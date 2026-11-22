import { randomUUID, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { secureApiRoute } from "@/src/lib/api-security";
import { getServiceRoleClient } from "@/src/lib/supabase-service-role";
import {
    createJarvisOutboundCall,
    isValidIndianE164,
} from "@/src/modules/ai-voice-agent/providers/voice-provider";

export const runtime = "nodejs";

function internalAuthorized(request: Request): boolean {
    const secret = process.env.PRIYA_JARVIS_DISPATCH_SECRET;
    const header = request.headers.get("authorization") ?? "";
    if (!secret || !header.startsWith("Bearer ")) return false;
    const supplied = Buffer.from(header.slice(7));
    const expected = Buffer.from(secret);
    return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}

function withinJarvisCallingWindow(now = new Date()): boolean {
    const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Kolkata",
        weekday: "short",
        hour: "2-digit",
        hourCycle: "h23",
    }).formatToParts(now);
    const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
    const hour = Number(values.hour);
    return values.weekday !== "Sun" && hour >= 8 && hour < 21;
}

function istDayBounds(now = new Date()) {
    const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(now);
    const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
    const start = Date.UTC(Number(values.year), Number(values.month) - 1, Number(values.day)) - 330 * 60_000;
    return {
        start: new Date(start).toISOString(),
        end: new Date(start + 24 * 60 * 60_000).toISOString(),
    };
}

export async function POST(request: Request) {
    if (process.env.ARJUN_JARVIS_CALLS_ENABLED !== "true") {
        return NextResponse.json({ error: "Jarvis outbound calls are disabled until provider setup and owner approval are complete" }, { status: 503 });
    }

    const internal = internalAuthorized(request);
    let organizationId = process.env.ARJUN_VOICE_ORGANIZATION_ID?.trim() ?? "";
    let actorId: string | null = null;

    if (!internal) {
        const secured = await secureApiRoute(request, {
            permission: "automationManage",
            rateLimit: 5,
        });
        if (secured.error) return secured.error;
        const ownerUserId = process.env.ARJUN_JARVIS_OWNER_USER_ID?.trim();
        if (!ownerUserId || secured.context?.user.id !== ownerUserId) {
            return NextResponse.json({ error: "Only the configured Jarvis owner can trigger personal briefing calls" }, { status: 403 });
        }
        organizationId = secured.context.organizationId ?? organizationId;
        actorId = secured.context.user.id;
    } else if (!process.env.PRIYA_JARVIS_DISPATCH_SECRET) {
        return NextResponse.json({ error: "Jarvis dispatch authentication is not configured" }, { status: 503 });
    }

    if (!organizationId || !/^[0-9a-f-]{36}$/i.test(organizationId)) {
        return NextResponse.json({ error: "Jarvis organization is not configured" }, { status: 503 });
    }

    if (!withinJarvisCallingWindow()) {
        return NextResponse.json({ error: "Jarvis calls are allowed Monday-Saturday between 08:00 and 21:00 Asia/Kolkata" }, { status: 409 });
    }

    const phoneNumber = process.env.ARJUN_PERSONAL_PHONE_NUMBER?.trim() ?? "";
    if (!isValidIndianE164(phoneNumber)) {
        return NextResponse.json({ error: "Configure ARJUN_PERSONAL_PHONE_NUMBER as a valid +91 E.164 number" }, { status: 503 });
    }

    let body: Record<string, unknown> = {};
    try {
        const raw = await request.text();
        if (raw.length > 5_000) return NextResponse.json({ error: "Request body too large" }, { status: 413 });
        if (raw) body = JSON.parse(raw) as Record<string, unknown>;
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const triggerReason = typeof body.triggerReason === "string"
        ? body.triggerReason.trim().slice(0, 120)
        : "manual_briefing";

    const client = getServiceRoleClient();
    if (!client) return NextResponse.json({ error: "Jarvis reporting storage is not configured" }, { status: 503 });

    const { start, end } = istDayBounds();
    const [newLeads, demosBooked, overdueFollowups] = await Promise.all([
        client.from("sales_leads").select("id", { count: "exact", head: true })
            .eq("organization_id", organizationId).gte("created_at", start).lt("created_at", end),
        client.from("ai_sales_deals").select("id", { count: "exact", head: true })
            .eq("organization_id", organizationId).eq("stage", "demo_booked")
            .gte("next_action_at", start).lt("next_action_at", end),
        client.from("ai_sales_followups").select("id", { count: "exact", head: true })
            .eq("organization_id", organizationId).eq("status", "pending")
            .lt("due_at", new Date().toISOString()),
    ]);

    if (newLeads.error || demosBooked.error || overdueFollowups.error) {
        return NextResponse.json({ error: "Could not load the live Jarvis briefing metrics" }, { status: 500 });
    }

    const overdueCount = overdueFollowups.count ?? 0;
    const urgentHighlight = overdueCount > 0
        ? `${overdueCount} overdue customer-requested follow-up(s) need review`
        : "No overdue customer-requested follow-ups are currently reported";

    const callEventId = randomUUID();
    const { error: eventError } = await client.from("ai_voice_call_events").insert({
        id: callEventId,
        organization_id: organizationId,
        direction: "outbound",
        phone_number: phoneNumber,
        purpose: "jarvis_briefing",
        status: "queued",
        created_by: actorId,
        extracted_variables: {
            agent: "jarvis",
            trigger_reason: triggerReason,
            new_leads_today: newLeads.count ?? 0,
            demos_booked_today: demosBooked.count ?? 0,
            urgent_highlight: urgentHighlight,
        },
    });

    if (eventError) return NextResponse.json({ error: "Could not create Jarvis call record" }, { status: 500 });

    try {
        const call = await createJarvisOutboundCall({
            phoneNumber,
            variables: {
                mrr_inr: "Not reported — verified billing source not connected",
                new_leads_today: newLeads.count ?? 0,
                demos_booked_today: demosBooked.count ?? 0,
                urgent_highlight: urgentHighlight,
                trigger_reason: triggerReason,
                call_event_id: callEventId,
            },
        });

        const { error: updateError } = await client.from("ai_voice_call_events")
            .update({ provider_attempt_id: call.providerCallId, updated_at: new Date().toISOString() })
            .eq("id", callEventId)
            .eq("organization_id", organizationId);

        if (updateError) {
            return NextResponse.json({
                success: false,
                callStarted: true,
                callEventId,
                error: "Jarvis call was accepted by the provider but CRM correlation needs reconciliation",
            }, { status: 202 });
        }

        await client.from("ai_sales_activity").insert({
            organization_id: organizationId,
            actor: "jarvis",
            event_type: "briefing_call_started",
            summary: "Jarvis started an executive briefing call",
            metadata: { call_event_id: callEventId, provider: call.provider, trigger_reason: triggerReason },
        });

        return NextResponse.json({
            success: true,
            callEventId,
            provider: call.provider,
            status: "queued",
            briefing: {
                mrr_inr: null,
                new_leads_today: newLeads.count ?? 0,
                demos_booked_today: demosBooked.count ?? 0,
                urgent_highlight: urgentHighlight,
            },
        }, { status: 202 });
    } catch {
        await client.from("ai_voice_call_events")
            .update({ status: "failed", failure_reason: "Jarvis voice provider request failed", updated_at: new Date().toISOString() })
            .eq("id", callEventId)
            .eq("organization_id", organizationId);
        return NextResponse.json({ error: "Could not start the Jarvis briefing call. Verify provider configuration." }, { status: 502 });
    }
}
