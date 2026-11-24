import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { getServiceRoleClient } from "@/src/lib/supabase-service-role";

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
        return NextResponse.json({ error: "Voice organization is not configured" }, { status: 503 });
    }

    let body: Record<string, unknown>;
    try {
        body = await request.json() as Record<string, unknown>;
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const callEventId = typeof body.callEventId === "string" ? body.callEventId.trim() : "";
    const workflowRunId = String(body.workflowRunId ?? "").trim();
    if (!/^[0-9a-f-]{36}$/i.test(callEventId) || !workflowRunId || workflowRunId.length > 120) {
        return NextResponse.json({ error: "Valid call event and workflow run are required" }, { status: 400 });
    }

    const client = getServiceRoleClient();
    if (!client) return NextResponse.json({ error: "Voice call storage is not configured" }, { status: 503 });

    const { data, error } = await client.from("ai_voice_call_events")
        .update({ status: "connected", interaction_id: workflowRunId, updated_at: new Date().toISOString() })
        .eq("id", callEventId)
        .eq("organization_id", organizationId)
        .eq("provider_attempt_id", workflowRunId)
        .in("status", ["queued", "connected"])
        .select("id")
        .maybeSingle();

    if (error) return NextResponse.json({ error: "Could not update call state" }, { status: 500 });
    if (!data) return NextResponse.json({ error: "Call does not match this workflow run and caller" }, { status: 403 });
    return NextResponse.json({ success: true, callEventId, status: "connected" });
}
