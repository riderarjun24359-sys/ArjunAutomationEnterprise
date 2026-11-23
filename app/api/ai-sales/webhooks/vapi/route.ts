import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { isValidIndianE164 } from "@/src/modules/ai-voice-agent/providers/voice-provider";

export const runtime = "nodejs";

function validSecret(request: Request): boolean {
    const secret = process.env.VAPI_PRIYA_WEBHOOK_SECRET;
    const supplied = Buffer.from(request.headers.get("x-vapi-secret") ?? "");
    const expected = Buffer.from(secret ?? "");
    return Boolean(secret) && supplied.length === expected.length && timingSafeEqual(supplied, expected);
}

function clean(value: unknown, max = 300): string {
    return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function mapStatus(raw: string, endedReason: string, eventType: string): string {
    const status = raw.toLowerCase();
    const reason = endedReason.toLowerCase();
    if (reason.includes("no-answer") || reason.includes("did-not-answer")) return "no_answer";
    if (reason.includes("busy")) return "busy";
    if (reason.includes("failed") || reason.includes("error")) return "failed";
    if (eventType === "end-of-call-report") return "completed";
    if (status === "in-progress" || status === "connected") return "connected";
    if (status === "ended" || status === "completed") return "completed";
    if (status === "queued" || status === "ringing") return "queued";
    return "";
}

export async function POST(request: Request) {
    if (!validSecret(request)) return NextResponse.json({ error: "Unauthorized Vapi webhook" }, { status: 401 });

    let body: Record<string, unknown>;
    try {
        const raw = await request.text();
        if (raw.length > 100_000) return NextResponse.json({ error: "Webhook body too large" }, { status: 413 });
        body = JSON.parse(raw) as Record<string, unknown>;
    } catch {
        return NextResponse.json({ error: "Invalid Vapi webhook JSON" }, { status: 400 });
    }

    const message = body.message && typeof body.message === "object"
        ? body.message as Record<string, unknown>
        : {};
    const eventType = clean(message.type, 80);
    if (!["status-update", "end-of-call-report"].includes(eventType)) {
        return NextResponse.json({ success: true, ignored: true }, { status: 204 });
    }

    const call = message.call && typeof message.call === "object"
        ? message.call as Record<string, unknown>
        : {};
    const customer = call.customer && typeof call.customer === "object"
        ? call.customer as Record<string, unknown>
        : {};
    const metadata = call.metadata && typeof call.metadata === "object"
        ? call.metadata as Record<string, unknown>
        : {};
    const overrides = call.assistantOverrides && typeof call.assistantOverrides === "object"
        ? call.assistantOverrides as Record<string, unknown>
        : {};
    const variableValues = overrides.variableValues && typeof overrides.variableValues === "object"
        ? overrides.variableValues as Record<string, unknown>
        : {};

    const providerCallId = clean(call.id, 200);
    const phoneNumber = clean(customer.number ?? call.customerNumber, 16);
    const direction = call.type === "inboundPhoneCall" ? "inbound" : call.type === "outboundPhoneCall" ? "outbound" : "";
    const callEventId = clean(metadata.call_event_id ?? variableValues.call_event_id, 80);
    const status = mapStatus(
        clean(message.status ?? call.status, 40),
        clean(call.endedReason, 120),
        eventType,
    );

    if (!providerCallId || !isValidIndianE164(phoneNumber) || !direction || !status) {
        return NextResponse.json({ error: "Vapi call event is missing a valid call ID, E.164 caller number, direction or status" }, { status: 400 });
    }

    const artifact = message.artifact && typeof message.artifact === "object"
        ? message.artifact as Record<string, unknown>
        : call.artifact && typeof call.artifact === "object"
            ? call.artifact as Record<string, unknown>
            : {};
    const analysis = message.analysis && typeof message.analysis === "object"
        ? message.analysis as Record<string, unknown>
        : call.analysis && typeof call.analysis === "object"
            ? call.analysis as Record<string, unknown>
            : {};
    const duration = typeof call.duration === "number" && Number.isFinite(call.duration)
        ? Math.max(0, Math.round(call.duration))
        : null;
    const summary = clean(analysis.summary, 2_000) || clean(artifact.transcript, 2_000);

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
            provider: "vapi",
            providerCallId,
            callEventId,
            phoneNumber,
            direction,
            status,
            interactionId: providerCallId,
            durationSeconds: duration,
            summary,
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(8_000),
    });

    if (!forwarded.ok) return NextResponse.json({ error: "Could not persist normalized Vapi call event" }, { status: 502 });
    return NextResponse.json({ success: true }, { status: 200 });
}
