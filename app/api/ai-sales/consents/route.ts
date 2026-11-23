import { NextResponse } from "next/server";
import { secureApiRoute } from "@/src/lib/api-security";
import { getServiceRoleClient } from "@/src/lib/supabase-service-role";
import { isValidIndianE164 } from "@/src/modules/ai-voice-agent/providers/voice-provider";

export const runtime = "nodejs";

const EVIDENCE_TYPES = new Set(["website_form", "inbound_call", "email", "sms"]);

export async function POST(request: Request) {
    const secured = await secureApiRoute(request, {
        permission: "automationManage",
        rateLimit: 10,
    });
    if (secured.error) return secured.error;
    if (!secured.context?.organizationId) {
        return NextResponse.json({ error: "Organization context is required" }, { status: 403 });
    }

    let body: Record<string, unknown>;
    try {
        body = (await request.json()) as Record<string, unknown>;
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const phoneNumber = typeof body.phoneNumber === "string" ? body.phoneNumber.trim() : "";
    const purpose = body.purpose === "requested_sales_followup"
        ? "requested_sales_followup"
        : body.purpose === "requested_callback"
            ? "requested_callback"
            : "";
    const evidenceType = typeof body.evidenceType === "string" ? body.evidenceType : "";
    const evidenceReference = typeof body.evidenceReference === "string" ? body.evidenceReference.trim() : "";
    const callerConfirmed = body.callerConfirmed === true;
    const grantedAt = typeof body.grantedAt === "string" ? new Date(body.grantedAt) : new Date();

    if (!isValidIndianE164(phoneNumber)) {
        return NextResponse.json({ error: "Enter a valid Indian phone number in +91 format" }, { status: 400 });
    }
    if (!purpose || !EVIDENCE_TYPES.has(evidenceType) || evidenceReference.length < 4 || evidenceReference.length > 500) {
        return NextResponse.json({ error: "Purpose and verifiable consent evidence are required" }, { status: 400 });
    }
    if (!callerConfirmed) {
        return NextResponse.json({ error: "The contact must explicitly confirm the requested call or follow-up" }, { status: 403 });
    }
    if (Number.isNaN(grantedAt.getTime()) || grantedAt.getTime() > Date.now() + 60_000) {
        return NextResponse.json({ error: "Invalid consent timestamp" }, { status: 400 });
    }

    const client = getServiceRoleClient();
    if (!client) return NextResponse.json({ error: "Voice consent storage is not configured" }, { status: 503 });

    const { data: suppression } = await client
        .from("ai_sales_suppressions")
        .select("id")
        .eq("organization_id", secured.context.organizationId)
        .eq("phone_number", phoneNumber)
        .maybeSingle();

    if (suppression) {
        return NextResponse.json({ error: "This number is on the do-not-contact list and cannot be re-enrolled automatically" }, { status: 409 });
    }

    const { data, error } = await client
        .from("ai_voice_contact_consents")
        .insert({
            organization_id: secured.context.organizationId,
            phone_number: phoneNumber,
            purpose,
            evidence_type: evidenceType,
            evidence_reference: evidenceReference,
            granted_at: grantedAt.toISOString(),
            recorded_by: secured.context.user.id,
        })
        .select("id, phone_number, purpose, granted_at, evidence_type")
        .single();

    if (error || !data) {
        return NextResponse.json({ error: "Could not save consent evidence" }, { status: 500 });
    }

    return NextResponse.json({ success: true, consent: data }, { status: 201 });
}
