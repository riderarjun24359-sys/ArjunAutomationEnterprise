import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { isValidIndianE164 } from "@/src/modules/ai-voice-agent/providers/voice-provider";

export const runtime = "nodejs";

function verifyRetellSignature(rawBody: string, header: string, apiKey: string): boolean {
    const match = /^v=(\d+),d=([a-f0-9]+)$/i.exec(header);
    if (!match) return false;
    const timestamp = Number(match[1]);
    if (!Number.isFinite(timestamp) || Math.abs(Date.now() - timestamp) > 5 * 60_000) return false;
    const expected = createHmac("sha256", apiKey).update(rawBody + match[1]).digest();
    const supplied = Buffer.from(match[2], "hex");
    return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}

function clean(value: unknown, max = 300): string {
    return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
    const apiKey = process.env.RETELL_WEBHOOK_API_KEY;
    const signature = request.headers.get("x-retell-signature") ?? "";
    if (!apiKey) return NextResponse.json({ error: "Retell webhook verification key is not configured" }, { status: 503 });

    let rawBody = "";
    let body: Record<string, unknown>;
    try {
        rawBody = await request.text();
        if (rawBody.length > 100_000) return NextResponse.json({ error: "Webhook body too large" }, { status: 413 });
        if (!verifyRetellSignature(rawBody, signature, apiKey)) {
            return NextResponse.json({ error: "Invalid Retell webhook signature" }, { status: 401 });
        }
        body = JSON.parse(rawBody) as Record<string, unknown>;
    } catch {
        return NextResponse.json({ error: "Invalid Retell webhook payload" }, { status: 400 });
    }

    const event = clean(body.event, 80);
    if (!["call_started", "call_ended", "call_analyzed"].includes(event)) {
        return NextResponse.json({ success: true, ignored: true }, { status: 204 });
    }

    const call = body.call && typeof body.call === "object"
        ? body.call as Record<string, unknown>
        : {};
    const metadata = call.metadata && typeof call.metadata === "object"
        ? call.metadata as Record<string, unknown>
        : {};
    const fromNumber = clean(call.from_number, 16);
    const toNumber = clean(call.to_number, 16);
    const configuredFromNumber = process.env.RETELL_FROM_NUMBER?.trim() ?? "";
    const direction = call.direction === "inbound" || (configuredFromNumber && toNumber === configuredFromNumber)
        ? "inbound"
        : call.direction === "outbound" || (configuredFromNumber && fromNumber === configuredFromNumber)
            ? "outbound"
            : "";
    const phoneNumber = direction === "inbound" ? fromNumber : direction === "outbound" ? toNumber : "";
    const callStatus = clean(call.call_status, 40).toLowerCase();
    let status = "";
    if (callStatus === "ongoing") status = "connected";
    else if (callStatus === "registered") status = "queued";
    else if (callStatus === "not_connected") status = "no_answer";
    else if (callStatus === "error") status = "failed";
    else if (callStatus === "ended" || event === "call_ended" || event === "call_analyzed") status = "completed";

    const providerCallId = clean(call.call_id, 200);
    const callEventId = clean(metadata.call_event_id ?? (call.retell_llm_dynamic_variables as Record<string, unknown> | undefined)?.call_event_id, 80);
    if (!providerCallId || !direction || !isValidIndianE164(phoneNumber) || !status) {
        return NextResponse.json({ error: "Retell call event is missing a valid call ID, direction, caller number or status" }, { status: 400 });
    }

    const durationMs = typeof call.duration_ms === "number" && Number.isFinite(call.duration_ms) ? call.duration_ms : null;
    const analysis = call.call_analysis && typeof call.call_analysis === "object"
        ? call.call_analysis as Record<string, unknown>
        : {};
    const summary = clean(analysis.call_summary, 2_000) || clean(analysis.summary, 2_000);
    const webhookSecret = process.env.PRIYA_SALES_WEBHOOK_SECRET;
    if (!webhookSecret) return NextResponse.json({ error: "Internal call-event secret is not configured" }, { status: 503 });

    const target = new URL("/api/ai-sales/tools/call-event", request.url);
    const forwarded = await fetch(target, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${webhookSecret}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            provider: "retell",
            providerCallId,
            callEventId,
            phoneNumber,
            direction,
            status,
            interactionId: providerCallId,
            durationSeconds: durationMs === null ? null : Math.max(0, Math.round(durationMs / 1000)),
            summary,
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(8_000),
    });

    if (!forwarded.ok) return NextResponse.json({ error: "Could not persist normalized Retell call event" }, { status: 502 });
    return NextResponse.json({ success: true }, { status: 200 });
}
