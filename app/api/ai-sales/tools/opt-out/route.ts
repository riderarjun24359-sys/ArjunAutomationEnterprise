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
    if (!authorized(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
    const source = typeof body.source === "string" ? body.source.trim().slice(0, 100) : "Priya voice call";
    if (!isValidIndianE164(phoneNumber)) {
        return NextResponse.json({ error: "A valid Indian E.164 phone number is required" }, { status: 400 });
    }

    const client = getServiceRoleClient();
    if (!client) return NextResponse.json({ error: "Suppression storage is not configured" }, { status: 503 });

    const now = new Date().toISOString();
    const { error: suppressionError } = await client
        .from("ai_sales_suppressions")
        .upsert({
            organization_id: organizationId,
            phone_number: phoneNumber,
            reason: "caller_opt_out",
            source,
        }, { onConflict: "organization_id,phone_number" });

    if (suppressionError) {
        return NextResponse.json({ error: "Could not save the do-not-contact request" }, { status: 500 });
    }

    const { error: revokeError } = await client
        .from("ai_voice_contact_consents")
        .update({ revoked_at: now })
        .eq("organization_id", organizationId)
        .eq("phone_number", phoneNumber)
        .is("revoked_at", null);

    if (revokeError) {
        return NextResponse.json({
            success: false,
            suppressed: true,
            consentRevocationPending: true,
            message: "The number is blocked immediately; consent revocation requires reconciliation.",
        }, { status: 202 });
    }

    return NextResponse.json({ success: true, suppressed: true, consentRevoked: true });
}
