import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { secureApiRoute } from "@/src/lib/api-security";
import { getServiceRoleClient } from "@/src/lib/supabase-service-role";
import {
    createSarvamOutboundCall,
    isValidIndianE164,
} from "@/src/modules/ai-voice-agent/providers/sarvam-client";

export const runtime = "nodejs";

export async function POST(request: Request) {
    const secured = await secureApiRoute(request, {
        permission: "automationManage",
        rateLimit: 5,
    });
    if (secured.error) return secured.error;
    if (!secured.context?.organizationId) {
        return NextResponse.json({ error: "Organization context is required" }, { status: 403 });
    }

    if (process.env.ARJUN_VOICE_OUTBOUND_ENABLED !== "true") {
        return NextResponse.json({ error: "Outbound calling is disabled until telephony setup and compliance checks are complete" }, { status: 503 });
    }

    let body: Record<string, unknown>;
    try {
        body = (await request.json()) as Record<string, unknown>;
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const phoneNumber = typeof body.phoneNumber === "string" ? body.phoneNumber.trim() : "";
    if (!isValidIndianE164(phoneNumber)) {
        return NextResponse.json({ error: "Enter a valid Indian phone number in +91 format" }, { status: 400 });
    }

    // The first live phase is strictly customer-requested callbacks. Cold
    // promotional campaigns are intentionally not exposed by this endpoint.
    const client = getServiceRoleClient();
    if (!client) return NextResponse.json({ error: "Voice call storage is not configured" }, { status: 503 });

    const { data: consent, error: consentError } = await client
        .from("ai_voice_contact_consents")
        .select("id")
        .eq("organization_id", secured.context.organizationId)
        .eq("phone_number", phoneNumber)
        .eq("purpose", "requested_callback")
        .is("revoked_at", null)
        .lte("granted_at", new Date().toISOString())
        .gte("granted_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order("granted_at", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (consentError) return NextResponse.json({ error: "Could not verify callback consent" }, { status: 500 });
    if (!consent) return NextResponse.json({ error: "No active, recorded customer callback request exists for this number" }, { status: 403 });

    const callEventId = randomUUID();
    const { error: insertError } = await client.from("ai_voice_call_events").insert({
        id: callEventId,
        organization_id: secured.context.organizationId,
        direction: "outbound",
        phone_number: phoneNumber,
        purpose: "requested_callback",
        status: "queued",
        created_by: secured.context.user.id,
    });
    if (insertError) return NextResponse.json({ error: "Could not create call record" }, { status: 500 });

    try {
        const result = await createSarvamOutboundCall({
            phoneNumber,
            organizationId: secured.context.organizationId,
            callEventId,
        });
        await client
            .from("ai_voice_call_events")
            .update({ provider_attempt_id: result.attempt_id, updated_at: new Date().toISOString() })
            .eq("id", callEventId)
            .eq("organization_id", secured.context.organizationId);

        return NextResponse.json({ success: true, callEventId, attemptId: result.attempt_id, status: "queued" }, { status: 202 });
    } catch {
        await client
            .from("ai_voice_call_events")
            .update({ status: "failed", failure_reason: "Provider request failed", updated_at: new Date().toISOString() })
            .eq("id", callEventId)
            .eq("organization_id", secured.context.organizationId);
        return NextResponse.json({ error: "Could not start the AI callback. Check provider configuration." }, { status: 502 });
    }
}
