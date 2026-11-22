import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { getServiceRoleClient } from "@/src/lib/supabase-service-role";
import { isValidIndianE164 } from "@/src/modules/ai-voice-agent/providers/voice-provider";

export const runtime = "nodejs";

function authorized(request: Request): boolean {
    const secret = process.env.PRIYA_SALES_TOOL_SECRET;
    const header = request.headers.get("authorization") ?? "";
    if (!secret || !header.startsWith("Bearer ")) return false;
    const supplied = Buffer.from(header.slice(7));
    const expected = Buffer.from(secret);
    return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}

export async function POST(request: Request) {
    if (!authorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const organizationId = process.env.ARJUN_VOICE_ORGANIZATION_ID?.trim();
    if (!organizationId || !/^[0-9a-f-]{36}$/i.test(organizationId)) {
        return NextResponse.json({ error: "Sales organization is not configured" }, { status: 503 });
    }

    let body: Record<string, unknown>;
    try {
        body = (await request.json()) as Record<string, unknown>;
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const phoneNumber = typeof body.phoneNumber === "string" ? body.phoneNumber.trim() : "";
    const interactionId = typeof body.interactionId === "string" ? body.interactionId.trim().slice(0, 200) : "";
    const purpose = body.purpose === "requested_sales_followup"
        ? "requested_sales_followup"
        : body.purpose === "requested_callback"
            ? "requested_callback"
            : "";
    if (!isValidIndianE164(phoneNumber) || interactionId.length < 4 || !purpose || body.explicitConsent !== true) {
        return NextResponse.json({
            error: "A valid +91 number, interaction ID, purpose and explicit caller consent are required",
        }, { status: 400 });
    }

    const client = getServiceRoleClient();
    if (!client) return NextResponse.json({ error: "Consent storage is not configured" }, { status: 503 });

    const { data: suppression, error: suppressionError } = await client
        .from("ai_sales_suppressions")
        .select("id")
        .eq("organization_id", organizationId)
        .eq("phone_number", phoneNumber)
        .maybeSingle();
    if (suppressionError) return NextResponse.json({ error: "Could not verify do-not-contact status" }, { status: 500 });
    if (suppression) return NextResponse.json({ error: "This number is on the do-not-contact list" }, { status: 409 });

    // Bind consent to the verified active inbound call record. The model
    // cannot grant outbound permission for an arbitrary third-party number.
    const { data: activeCall, error: activeCallError } = await client
        .from("ai_voice_call_events")
        .select("id, phone_number, direction, status")
        .eq("organization_id", organizationId)
        .eq("interaction_id", interactionId)
        .eq("phone_number", phoneNumber)
        .eq("direction", "inbound")
        .in("status", ["connected", "completed"])
        .maybeSingle();

    if (activeCallError) {
        return NextResponse.json({ error: "Could not verify the current inbound call" }, { status: 500 });
    }
    if (!activeCall) {
        return NextResponse.json({
            error: "Consent can only be recorded for the verified caller on a tracked inbound call",
        }, { status: 403 });
    }

    const { data: existing, error: existingError } = await client
        .from("ai_voice_contact_consents")
        .select("id")
        .eq("organization_id", organizationId)
        .eq("phone_number", phoneNumber)
        .eq("purpose", purpose)
        .eq("evidence_reference", interactionId)
        .maybeSingle();
    if (existingError) return NextResponse.json({ error: "Could not check previous consent" }, { status: 500 });
    if (existing) return NextResponse.json({ success: true, duplicate: true, consentId: existing.id });

    const { data, error } = await client
        .from("ai_voice_contact_consents")
        .insert({
            organization_id: organizationId,
            phone_number: phoneNumber,
            purpose,
            evidence_type: "inbound_call",
            evidence_reference: interactionId,
            granted_at: new Date().toISOString(),
            recorded_by: null,
        })
        .select("id, phone_number, purpose, granted_at")
        .single();

    if (error || !data) return NextResponse.json({ error: "Could not record caller consent" }, { status: 500 });
    return NextResponse.json({ success: true, consentId: data.id, purpose }, { status: 201 });
}
