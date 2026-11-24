import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { getServiceRoleClient } from "@/src/lib/supabase-service-role";

export const runtime = "nodejs";

function authorized(request: Request): boolean {
    const secret = process.env.DOGRAH_WEBHOOK_SECRET;
    const header = request.headers.get("x-arjun-dograh-secret") ?? "";
    if (!secret || !header) return false;
    const supplied = Buffer.from(header);
    const expected = Buffer.from(secret);
    return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}

function record(value: unknown): Record<string, unknown> {
    return value && typeof value === "object" && !Array.isArray(value)
        ? value as Record<string, unknown>
        : {};
}

function safeText(value: unknown, max = 500): string {
    return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function normalizedStatus(value: string): "completed" | "no_answer" | "busy" | "failed" {
    const status = value.toLowerCase();
    if (status.includes("no_answer") || status.includes("no answer") || status.includes("unanswered")) return "no_answer";
    if (status.includes("busy")) return "busy";
    if (status.includes("fail") || status.includes("error")) return "failed";
    return "completed";
}

export async function POST(request: Request) {
    if (!authorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const organizationId = process.env.ARJUN_VOICE_ORGANIZATION_ID?.trim();
    if (!organizationId || !/^[0-9a-f-]{36}$/i.test(organizationId)) {
        return NextResponse.json({ error: "Voice organization is not configured" }, { status: 503 });
    }

    let body: Record<string, unknown>;
    try {
        const raw = await request.text();
        if (raw.length > 30_000) return NextResponse.json({ error: "Request body too large" }, { status: 413 });
        body = JSON.parse(raw) as Record<string, unknown>;
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const initialContext = record(body.initial_context);
    const gatheredContext = record(body.gathered_context);
    const callEventId = safeText(initialContext.call_event_id, 80);
    const workflowRunId = String(body.workflow_run_id ?? "").trim();
    const disposition = safeText(body.call_disposition || gatheredContext.call_disposition, 120);
    const durationRaw = record(body.cost_info).call_duration_seconds;
    const durationSeconds = typeof durationRaw === "number" && Number.isFinite(durationRaw)
        ? Math.max(0, Math.min(86_400, Math.round(durationRaw)))
        : null;

    if (!/^[0-9a-f-]{36}$/i.test(callEventId) || !workflowRunId) {
        return NextResponse.json({ error: "A known call event and Dograh workflow run are required" }, { status: 400 });
    }

    const client = getServiceRoleClient();
    if (!client) return NextResponse.json({ error: "Voice call storage is not configured" }, { status: 503 });

    const extracted = {
        provider: "dograh",
        workflow_run_id: workflowRunId,
        call_disposition: disposition || "completed",
        gathered_context: gatheredContext,
        recording_url: safeText(body.recording_url, 2_000),
        transcript_url: safeText(body.transcript_url, 2_000),
    };

    const { data, error } = await client.from("ai_voice_call_events")
        .update({
            status: normalizedStatus(disposition),
            provider_attempt_id: workflowRunId,
            interaction_id: workflowRunId,
            duration_seconds: durationSeconds,
            extracted_variables: extracted,
            updated_at: new Date().toISOString(),
        })
        .eq("id", callEventId)
        .eq("organization_id", organizationId)
        .eq("provider_attempt_id", workflowRunId)
        .select("id, direction, phone_number")
        .maybeSingle();

    if (error) return NextResponse.json({ error: "Could not save Dograh call outcome" }, { status: 500 });
    if (!data) return NextResponse.json({ error: "Dograh run does not match a registered Arjun call" }, { status: 404 });

    return NextResponse.json({ success: true, callEventId, workflowRunId, status: normalizedStatus(disposition) });
}
