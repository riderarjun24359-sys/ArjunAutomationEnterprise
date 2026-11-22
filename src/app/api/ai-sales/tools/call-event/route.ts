import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { getServiceRoleClient } from "@/src/lib/supabase-service-role";
import { isValidIndianE164 } from "@/src/modules/ai-voice-agent/providers/voice-provider";

export const runtime = "nodejs";

function authorized(request: Request): boolean {
    const secret = process.env.PRIYA_SALES_WEBHOOK_SECRET;
    const header = request.headers.get("authorization") ?? "";
    if (!secret || !header.startsWith("Bearer ")) return false;
    const supplied = Buffer.from(header.slice(7));
    const expected = Buffer.from(secret);
    return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}

function clean(value: unknown, max: number): string {
    return typeof value === "string" ? value.trim().slice(0, max) : "";
}

const STATUSES = new Set(["queued", "connected", "no_answer", "busy", "failed", "completed"]);

export async function POST(request: Request) {
    if (!authorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const organizationId = process.env.ARJUN_VOICE_ORGANIZATION_ID?.trim();
    if (!organizationId || !/^[0-9a-f-]{36}$/i.test(organizationId)) {
        return NextResponse.json({ error: "Voice organization is not configured" }, { status: 503 });
    }

    let body: Record<string, unknown>;
    try {
        const raw = await request.text();
        if (raw.length > 20_000) return NextResponse.json({ error: "Request body too large" }, { status: 413 });
        body = JSON.parse(raw) as Record<string, unknown>;
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const provider = body.provider === "retell" ? "retell" : body.provider === "vapi" ? "vapi" : "";
    const providerCallId = clean(body.providerCallId, 200);
    const callEventId = clean(body.callEventId, 80);
    const phoneNumber = clean(body.phoneNumber, 16);
    const direction = body.direction === "outbound" ? "outbound" : body.direction === "inbound" ? "inbound" : "";
    const status = clean(body.status, 30);
    const interactionId = clean(body.interactionId, 200);
    const duration = typeof body.durationSeconds === "number" && Number.isFinite(body.durationSeconds)
        ? Math.max(0, Math.min(86_400, Math.round(body.durationSeconds)))
        : null;
    const summary = clean(body.summary, 2_000);

    if (
        !provider ||
        !providerCallId ||
        !isValidIndianE164(phoneNumber) ||
        !direction ||
        !STATUSES.has(status) ||
        interactionId.length < 4
    ) {
        return NextResponse.json({ error: "Provider, call ID, valid +91 number, direction, status and interaction ID are required" }, { status: 400 });
    }

    const client = getServiceRoleClient();
    if (!client) return NextResponse.json({ error: "Voice event storage is not configured" }, { status: 503 });

    const lookup = callEventId
        ? await client.from("ai_voice_call_events")
            .select("id, direction, phone_number, interaction_id, status, extracted_variables")
            .eq("id", callEventId)
            .eq("organization_id", organizationId)
            .maybeSingle()
        : await client.from("ai_voice_call_events")
            .select("id, direction, phone_number, interaction_id, status, extracted_variables")
            .eq("provider_attempt_id", providerCallId)
            .eq("organization_id", organizationId)
            .maybeSingle();
    const { data: existing, error: lookupError } = lookup;

    if (lookupError) return NextResponse.json({ error: "Could not load previous call event" }, { status: 500 });

    if (existing && (
        existing.direction !== direction ||
        existing.phone_number !== phoneNumber ||
        (existing.interaction_id && existing.interaction_id !== interactionId)
    )) {
        return NextResponse.json({ error: "Call event identity does not match the stored record" }, { status: 409 });
    }

    const terminalStatuses = new Set(["completed", "no_answer", "busy", "failed"]);
    const alreadyTerminal = Boolean(existing && terminalStatuses.has(existing.status));
    if (alreadyTerminal && (!terminalStatuses.has(status) || status !== existing?.status)) {
        return NextResponse.json({ success: true, duplicate: true, ignoredOutOfOrderEvent: true, callEventId: existing?.id });
    }

    const eventPayload = {
        organization_id: organizationId,
        direction,
        phone_number: phoneNumber,
        interaction_id: interactionId,
        provider_attempt_id: providerCallId,
        status,
        duration_seconds: duration,
        extracted_variables: {
            ...(existing?.extracted_variables && typeof existing.extracted_variables === "object"
                ? existing.extracted_variables
                : {}),
            provider,
            ...(summary ? { call_summary: summary } : {}),
        },
        updated_at: new Date().toISOString(),
    };

    const write = existing
        ? await client.from("ai_voice_call_events")
            .update(eventPayload)
            .eq("id", existing.id)
            .eq("organization_id", organizationId)
            .select("id, status, direction, phone_number, provider_attempt_id")
            .single()
        : await client.from("ai_voice_call_events")
            .insert(eventPayload)
            .select("id, status, direction, phone_number, provider_attempt_id")
            .single();

    if (write.error || !write.data) {
        return NextResponse.json({ error: "Could not save provider call event" }, { status: 500 });
    }

    const followupId = existing?.extracted_variables &&
        typeof existing.extracted_variables === "object" &&
        typeof (existing.extracted_variables as Record<string, unknown>).followup_id === "string"
        ? (existing.extracted_variables as Record<string, unknown>).followup_id as string
        : "";
    if (followupId && terminalStatuses.has(status)) {
        if (!alreadyTerminal) {
            await client.from("ai_sales_followups")
                .update(status === "completed"
                    ? { status: "completed", completed_at: new Date().toISOString(), updated_at: new Date().toISOString() }
                    : { status: "failed", last_error: `Voice call ended with status: ${status}`, updated_at: new Date().toISOString() })
                .eq("id", followupId)
                .eq("organization_id", organizationId);
        }

        const { data: followup } = await client.from("ai_sales_followups")
            .select("lead_id")
            .eq("id", followupId)
            .eq("organization_id", organizationId)
            .maybeSingle();
        if (followup?.lead_id) {
            await client.from("sales_call_logs").upsert({
                organization_id: organizationId,
                lead_id: followup.lead_id,
                voice_call_event_id: write.data.id,
                direction: "outbound",
                phone_number: phoneNumber,
                duration_seconds: duration ?? 0,
                outcome: status,
                notes: summary || `Customer-requested follow-up call ended with status: ${status}`,
                called_at: new Date().toISOString(),
            }, { onConflict: "voice_call_event_id" });

            if (!alreadyTerminal) {
                await client.from("ai_sales_activity").insert({
                    organization_id: organizationId,
                    lead_id: followup.lead_id,
                    actor: "priya",
                    event_type: status === "completed" ? "followup_call_completed" : "followup_call_not_connected",
                    summary: status === "completed" ? "Priya completed a scheduled customer follow-up call" : `Priya follow-up call ended with status: ${status}`,
                    metadata: { followup_id: followupId, call_event_id: write.data.id, duration_seconds: duration ?? 0 },
                });
            }
        }
    }

    return NextResponse.json({ success: true, duplicate: Boolean(existing), callEvent: write.data });
}
