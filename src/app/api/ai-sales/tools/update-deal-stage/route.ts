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

function clean(value: unknown, max: number): string {
    return typeof value === "string" ? value.trim().slice(0, max) : "";
}

const TRANSITIONS: Record<string, string[]> = {
    new: ["contacted", "qualified", "nurture", "lost"],
    contacted: ["qualified", "demo_booked", "proposal_sent", "nurture", "lost"],
    qualified: ["contacted", "demo_booked", "proposal_sent", "negotiation", "nurture", "lost"],
    demo_booked: ["proposal_sent", "negotiation", "nurture", "lost"],
    proposal_sent: ["negotiation", "nurture", "lost"],
    negotiation: ["proposal_sent", "nurture", "lost"],
    nurture: ["contacted", "qualified", "lost"],
};

export async function POST(request: Request) {
    if (!authorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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

    const leadId = clean(body.leadId, 80);
    const requestedStage = clean(body.stage, 40);
    const lossReason = clean(body.lossReason, 500);
    const meetingId = clean(body.meetingId, 80);
    const nextActionAt = typeof body.nextActionAt === "string" ? new Date(body.nextActionAt) : null;

    if (requestedStage === "won") {
        return NextResponse.json({
            error: "Won is locked until a signed Razorpay payment event is reconciled to this deal and invoice.",
            code: "verified_payment_mapping_required",
        }, { status: 409 });
    }

    if (!leadId || !Object.hasOwn(TRANSITIONS, requestedStage) && requestedStage !== "demo_booked") {
        return NextResponse.json({ error: "A CRM lead ID and allowed pipeline stage are required" }, { status: 400 });
    }
    if (requestedStage === "lost" && !lossReason) {
        return NextResponse.json({ error: "A factual loss reason is required when marking a deal lost" }, { status: 400 });
    }
    if (requestedStage === "demo_booked" && !meetingId) {
        return NextResponse.json({ error: "A verified sales meeting ID is required for the demo_booked stage" }, { status: 400 });
    }
    if (nextActionAt && Number.isNaN(nextActionAt.getTime())) {
        return NextResponse.json({ error: "Invalid next action date" }, { status: 400 });
    }

    const client = getServiceRoleClient();
    if (!client) return NextResponse.json({ error: "Sales pipeline storage is not configured" }, { status: 503 });

    const { data: lead, error: leadError } = await client.from("sales_leads")
        .select("id")
        .eq("id", leadId)
        .eq("organization_id", organizationId)
        .maybeSingle();
    if (leadError) return NextResponse.json({ error: "Could not verify CRM lead" }, { status: 500 });
    if (!lead) return NextResponse.json({ error: "CRM lead not found" }, { status: 404 });

    let meetingScheduledAt: string | null = null;
    if (requestedStage === "demo_booked") {
        const { data: meeting, error: meetingError } = await client.from("sales_meetings")
            .select("id, lead_id, scheduled_at, status")
            .eq("id", meetingId)
            .eq("organization_id", organizationId)
            .maybeSingle();
        if (meetingError) return NextResponse.json({ error: "Could not verify demo meeting" }, { status: 500 });
        if (!meeting || meeting.lead_id !== leadId || meeting.status !== "scheduled") {
            return NextResponse.json({ error: "The demo meeting does not match this lead or is not scheduled" }, { status: 409 });
        }
        meetingScheduledAt = meeting.scheduled_at;
    }

    const { data: existing, error: dealError } = await client.from("ai_sales_deals")
        .select("id, stage, final_price_inr")
        .eq("organization_id", organizationId)
        .eq("lead_id", leadId)
        .not("stage", "in", "(won,lost)")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (dealError) return NextResponse.json({ error: "Could not load active sales deal" }, { status: 500 });

    if (["proposal_sent", "negotiation"].includes(requestedStage) &&
        (!existing || existing.final_price_inr === null || Number(existing.final_price_inr) <= 0)) {
        return NextResponse.json({ error: "A founder-policy-approved quote must exist before sending a proposal or entering price negotiation" }, { status: 409 });
    }

    const currentStage = existing?.stage ?? "new";
    const allowed = TRANSITIONS[currentStage] ?? [];
    if (!allowed.includes(requestedStage)) {
        return NextResponse.json({
            error: "Invalid sales stage transition",
            currentStage,
            allowedNextStages: allowed,
        }, { status: 409 });
    }

    const payload = {
        organization_id: organizationId,
        lead_id: leadId,
        stage: requestedStage,
        next_action_at: meetingScheduledAt ?? nextActionAt?.toISOString() ?? null,
        loss_reason: requestedStage === "lost" ? lossReason : null,
        closed_at: requestedStage === "lost" ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
    };

    const write = existing
        ? await client.from("ai_sales_deals").update(payload)
            .eq("id", existing.id).eq("organization_id", organizationId)
            .select("id, lead_id, stage, next_action_at, loss_reason").single()
        : await client.from("ai_sales_deals").insert(payload)
            .select("id, lead_id, stage, next_action_at, loss_reason").single();

    if (write.error || !write.data) return NextResponse.json({ error: "Could not update sales pipeline" }, { status: 500 });

    await client.from("sales_leads").update({
        status: requestedStage === "lost" ? "lost" : requestedStage,
        updated_at: new Date().toISOString(),
    }).eq("id", leadId).eq("organization_id", organizationId);

    await client.from("ai_sales_activity").insert({
        organization_id: organizationId,
        lead_id: leadId,
        deal_id: write.data.id,
        actor: "priya",
        event_type: "deal_stage_changed",
        summary: `Priya moved the sales deal to ${requestedStage}`,
        metadata: { previous_stage: currentStage, new_stage: requestedStage, loss_reason: lossReason || null },
    });

    return NextResponse.json({ success: true, deal: write.data });
}
