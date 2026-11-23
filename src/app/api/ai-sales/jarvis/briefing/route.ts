import { NextResponse } from "next/server";
import { secureApiRoute } from "@/src/lib/api-security";
import { getServiceRoleClient } from "@/src/lib/supabase-service-role";

export const runtime = "nodejs";

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

export async function GET(request: Request) {
    const secured = await secureApiRoute(request, {
        permission: "automationManage",
        rateLimit: 30,
    });
    if (secured.error) return secured.error;
    if (!secured.context?.organizationId) {
        return NextResponse.json({ error: "Organization context is required" }, { status: 403 });
    }

    const client = getServiceRoleClient();
    if (!client) return NextResponse.json({ error: "Sales reporting is not configured" }, { status: 503 });

    const organizationId = secured.context.organizationId;
    const { start, end } = istDayBounds();
    const weekStart = new Date(Date.now() - 7 * 24 * 60 * 60_000).toISOString().slice(0, 10);
    const razorpayConfigured = Boolean(process.env.RAZORPAY_WEBHOOK_SECRET?.trim());

    const [
        newLeads,
        callsAttempted,
        callsConnected,
        demosBooked,
        activeDeals,
        followupsDue,
        overdueFollowups,
        candidatePayments,
    ] = await Promise.all([
        client.from("sales_leads").select("id", { count: "exact", head: true })
            .eq("organization_id", organizationId).gte("created_at", start).lt("created_at", end),
        client.from("ai_voice_call_events").select("id", { count: "exact", head: true })
            .eq("organization_id", organizationId).gte("created_at", start).lt("created_at", end),
        client.from("ai_voice_call_events").select("id", { count: "exact", head: true })
            .eq("organization_id", organizationId).in("status", ["connected", "completed"])
            .gte("created_at", start).lt("created_at", end),
        client.from("ai_sales_deals").select("id", { count: "exact", head: true })
            .eq("organization_id", organizationId).eq("stage", "demo_booked")
            .gte("next_action_at", start).lt("next_action_at", end),
        client.from("ai_sales_deals").select("id", { count: "exact", head: true })
            .eq("organization_id", organizationId).not("stage", "in", "(won,lost)"),
        client.from("ai_sales_followups").select("id", { count: "exact", head: true })
            .eq("organization_id", organizationId).eq("status", "pending")
            .gte("due_at", start).lt("due_at", end),
        client.from("ai_sales_followups").select("id", { count: "exact", head: true })
            .eq("organization_id", organizationId).eq("status", "pending")
            .lt("due_at", new Date().toISOString()),
        client.from("payments")
            .select("amount, reference, payment_date, invoice:invoices!inner(currency)")
            .eq("organization_id", organizationId)
            .eq("method", "razorpay")
            .in("status", ["completed", "paid", "succeeded"])
            .gte("payment_date", weekStart),
    ]);

    const queryErrors = [newLeads, callsAttempted, callsConnected, demosBooked, activeDeals, followupsDue, overdueFollowups, candidatePayments]
        .filter((result) => result.error);
    if (queryErrors.length) {
        return NextResponse.json({ error: "One or more live sales metrics could not be loaded" }, { status: 500 });
    }

    const candidateRows = candidatePayments.data ?? [];
    const razorpayEventIds = candidateRows
        .map((payment) => typeof payment.reference === "string" && payment.reference.trim()
            ? "payment.captured:" + payment.reference.trim()
            : null)
        .filter((eventId): eventId is string => Boolean(eventId));
    const verifiedEvents = razorpayEventIds.length
        ? await client.from("webhook_idempotency").select("event_id")
            .eq("provider", "razorpay").in("event_id", razorpayEventIds)
        : { data: [], error: null };
    if (verifiedEvents.error) {
        return NextResponse.json({ error: "Verified Razorpay settlement metrics could not be loaded" }, { status: 500 });
    }
    const verifiedEventSet = new Set((verifiedEvents.data ?? []).map((event) => event.event_id));
    const weeklyRevenueInr = candidateRows.reduce((total, payment) => {
        const invoice = Array.isArray(payment.invoice) ? payment.invoice[0] : payment.invoice;
        const eventId = typeof payment.reference === "string" ? "payment.captured:" + payment.reference.trim() : "";
        return invoice?.currency === "INR" && verifiedEventSet.has(eventId)
            ? total + Number(payment.amount ?? 0)
            : total;
    }, 0);

    const urgentCount = overdueFollowups.count ?? 0;
    const urgentHighlight = urgentCount > 0
        ? `${urgentCount} overdue consented follow-up(s) need review`
        : (followupsDue.count ?? 0) > 0
            ? `${followupsDue.count} consented follow-up(s) are due today`
            : "No overdue sales follow-ups are currently reported";

    return NextResponse.json({
        timezone: "Asia/Kolkata",
        as_of: new Date().toISOString(),
        mrr_inr: null,
        weekly_revenue_inr: razorpayConfigured ? Math.round(weeklyRevenueInr * 100) / 100 : null,
        revenue_status: razorpayConfigured
            ? "verified_razorpay_captured_payments_only_mrr_not_available"
            : "razorpay_webhook_not_configured_mrr_not_available",
        new_leads_today: newLeads.count ?? 0,
        calls_attempted_today: callsAttempted.count ?? 0,
        calls_connected_today: callsConnected.count ?? 0,
        demos_booked_today: demosBooked.count ?? 0,
        active_deals: activeDeals.count ?? 0,
        followups_due_today: followupsDue.count ?? 0,
        overdue_followups: urgentCount,
        urgent_highlight: urgentHighlight,
    });
}
