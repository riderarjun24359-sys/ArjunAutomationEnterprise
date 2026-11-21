import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { getServiceRoleClient } from "@/src/lib/supabase-service-role";

export const runtime = "nodejs";

interface SarvamVoiceWebhook {
    attempt_id?: string;
    status?: "connected" | "no_answer" | "busy" | "failed";
    interaction_id?: string | null;
    duration?: number | null;
    failure_reason?: string | null;
    user_phone_number?: string;
    final_agent_variables?: Record<string, unknown> | null;
    output_agent_variables?: Record<string, unknown> | null;
    metadata?: Record<string, unknown> | null;
    webhook_config?: { metadata?: Record<string, unknown> | null } | null;
}

function verifySarvamSignature(rawBody: string, request: Request): boolean {
    const secret = process.env.SARVAM_VOICE_WEBHOOK_SECRET;
    const signature = request.headers.get("Sarvam-Signature");
    const timestamp = request.headers.get("Sarvam-Timestamp");
    if (!secret || !signature || !timestamp || !/^\d+$/.test(timestamp)) return false;

    const timestampSeconds = Number(timestamp);
    if (!Number.isFinite(timestampSeconds) || Math.abs(Date.now() / 1000 - timestampSeconds) > 300) {
        return false;
    }

    const digest = createHmac("sha256", secret).update(`${timestamp}.${rawBody}`).digest("hex");
    const expected = Buffer.from(`sha256=${digest}`);
    const received = Buffer.from(signature);
    return expected.length === received.length && timingSafeEqual(expected, received);
}

export async function POST(request: Request) {
    const rawBody = await request.text();
    if (!verifySarvamSignature(rawBody, request)) {
        return NextResponse.json({ error: "Invalid or expired webhook signature" }, { status: 401 });
    }

    let payload: SarvamVoiceWebhook;
    try {
        payload = JSON.parse(rawBody) as SarvamVoiceWebhook;
    } catch {
        return NextResponse.json({ error: "Invalid webhook payload" }, { status: 400 });
    }

    // Outbound attempts use attempt_id; inbound deployments use interaction_id.
    const providerAttemptId = payload.attempt_id ?? payload.interaction_id ?? "";
    if (!providerAttemptId) {
        return NextResponse.json({ error: "Missing call attempt identity" }, { status: 400 });
    }

    const metadata = payload.webhook_config?.metadata ?? payload.metadata ?? {};
    const organizationId = typeof metadata.organization_id === "string" ? metadata.organization_id : "";
    const callEventId = typeof metadata.call_event_id === "string" ? metadata.call_event_id : "";
    const direction = metadata.direction === "inbound" ? "inbound" : "outbound";
    if (!/^[0-9a-f-]{36}$/i.test(organizationId)) {
        return NextResponse.json({ error: "Missing organization routing metadata" }, { status: 400 });
    }

    const client = getServiceRoleClient();
    if (!client) return NextResponse.json({ error: "Webhook storage is not configured" }, { status: 503 });

    const update = {
        provider_attempt_id: providerAttemptId,
        interaction_id: payload.interaction_id ?? null,
        status: payload.status ?? "completed",
        duration_seconds: typeof payload.duration === "number" ? payload.duration : null,
        failure_reason: payload.failure_reason?.slice(0, 500) ?? null,
        extracted_variables: payload.final_agent_variables ?? payload.output_agent_variables ?? {},
        updated_at: new Date().toISOString(),
    };

    if (callEventId && /^[0-9a-f-]{36}$/i.test(callEventId)) {
        const { error } = await client
            .from("ai_voice_call_events")
            .update(update)
            .eq("id", callEventId)
            .eq("organization_id", organizationId);
        if (error) return NextResponse.json({ error: "Could not update call event" }, { status: 500 });
    } else {
        const phoneNumber = typeof payload.user_phone_number === "string" ? payload.user_phone_number : null;
        const { error } = await client.from("ai_voice_call_events").upsert({
            organization_id: organizationId,
            direction,
            phone_number: phoneNumber,
            purpose: direction === "inbound" ? "inbound_enquiry" : "requested_callback",
            ...update,
        }, { onConflict: "provider_attempt_id" });
        if (error) return NextResponse.json({ error: "Could not save call event" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
