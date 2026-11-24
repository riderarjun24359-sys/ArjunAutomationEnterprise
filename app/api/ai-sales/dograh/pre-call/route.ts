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
    if (process.env.ARJUN_VOICE_INBOUND_ENABLED !== "true") {
        return NextResponse.json({ error: "Priya inbound calling is disabled" }, { status: 503 });
    }
    const organizationId = process.env.ARJUN_VOICE_ORGANIZATION_ID?.trim();
    if (!organizationId || !/^[0-9a-f-]{36}$/i.test(organizationId)) {
        return NextResponse.json({ error: "Voice organization is not configured" }, { status: 503 });
    }

    let body: Record<string, unknown>;
    try {
        const raw = await request.text();
        if (raw.length > 8_000) return NextResponse.json({ error: "Request body too large" }, { status: 413 });
        body = JSON.parse(raw) as Record<string, unknown>;
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const inbound = body.call_inbound && typeof body.call_inbound === "object"
        ? body.call_inbound as Record<string, unknown>
        : body;
    const runId = String(inbound.workflow_run_id ?? "").trim();
    const callerNumber = typeof inbound.from_number === "string" ? inbound.from_number.trim() : "";
    const calledNumber = typeof inbound.to_number === "string" ? inbound.to_number.trim() : "";

    if (runId.length < 1 || runId.length > 120 || !isValidIndianE164(callerNumber)) {
        // Never create a CRM/call record for an unverified or non-Indian caller ID.
        return NextResponse.json({ call_inbound: { initial_context: {} } });
    }

    const client = getServiceRoleClient();
    if (!client) return NextResponse.json({ error: "Voice call storage is not configured" }, { status: 503 });

    const { data: existing, error: lookupError } = await client
        .from("ai_voice_call_events")
        .select("id")
        .eq("organization_id", organizationId)
        .eq("provider_attempt_id", runId)
        .maybeSingle();
    if (lookupError) return NextResponse.json({ error: "Could not check existing call" }, { status: 500 });

    let callEventId = existing?.id as string | undefined;
    if (!callEventId) {
        const { data, error } = await client.from("ai_voice_call_events")
            .insert({
                organization_id: organizationId,
                direction: "inbound",
                phone_number: callerNumber,
                status: "connected",
                provider_attempt_id: runId,
                interaction_id: runId,
                extracted_variables: {
                    provider: "dograh",
                    workflow_run_id: runId,
                    called_number: calledNumber,
                },
            })
            .select("id")
            .single();
        if (error?.code === "23505") {
            const { data: raced, error: raceLookupError } = await client
                .from("ai_voice_call_events")
                .select("id")
                .eq("organization_id", organizationId)
                .eq("provider_attempt_id", runId)
                .maybeSingle();
            if (raceLookupError || !raced) {
                return NextResponse.json({ error: "Could not reconcile duplicate inbound call" }, { status: 500 });
            }
            callEventId = raced.id as string;
        } else if (error || !data) {
            return NextResponse.json({ error: "Could not register inbound call" }, { status: 500 });
        } else {
            callEventId = data.id as string;
        }
    }

    return NextResponse.json({
        call_inbound: {
            initial_context: {
                call_event_id: callEventId,
                interaction_id: runId,
                caller_number: callerNumber,
                called_number: calledNumber,
                direction: "inbound",
            },
        },
    });
}
