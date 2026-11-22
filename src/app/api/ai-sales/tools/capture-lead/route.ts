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

function clean(value: unknown, max: number): string {
    return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function scoreLead(input: {
    painPoint: string;
    serviceInterest: string;
    buyingTimeline: string;
    decisionMaker: string;
    budgetRange: string;
    city: string;
    industry: string;
    companyName: string;
}): number {
    return Math.min(100,
        (input.painPoint ? 25 : 0) +
        (input.serviceInterest ? 20 : 0) +
        (input.buyingTimeline ? 15 : 0) +
        (input.decisionMaker ? 15 : 0) +
        (input.budgetRange ? 10 : 0) +
        (input.city ? 5 : 0) +
        (input.industry ? 5 : 0) +
        (input.companyName ? 5 : 0)
    );
}

export async function POST(request: Request) {
    if (!authorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const organizationId = process.env.ARJUN_VOICE_ORGANIZATION_ID?.trim();
    if (!organizationId || !/^[0-9a-f-]{36}$/i.test(organizationId)) {
        return NextResponse.json({ error: "Sales organization is not configured" }, { status: 503 });
    }

    let body: Record<string, unknown>;
    try {
        const raw = await request.text();
        if (raw.length > 20_000) return NextResponse.json({ error: "Request body too large" }, { status: 413 });
        body = JSON.parse(raw) as Record<string, unknown>;
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const interactionId = clean(body.interactionId, 200);
    const leadName = clean(body.leadName, 120);
    const companyName = clean(body.companyName, 160);
    const email = clean(body.email, 254).toLowerCase();
    const phoneNumber = clean(body.phoneNumber, 16);
    const city = clean(body.city, 120);
    const industry = clean(body.industry, 120);
    const painPoint = clean(body.painPoint, 1_000);
    const serviceInterest = clean(body.serviceInterest, 160);
    const decisionMaker = clean(body.decisionMaker, 100);
    const budgetRange = clean(body.budgetRange, 120);
    const buyingTimeline = clean(body.buyingTimeline, 120);
    const nextAction = clean(body.nextAction, 300);
    const callSummary = clean(body.callSummary, 1_500);
    const direction = body.direction === "outbound" ? "outbound" : "inbound";
    const durationSeconds = typeof body.durationSeconds === "number" && Number.isFinite(body.durationSeconds)
        ? Math.max(0, Math.min(86_400, Math.round(body.durationSeconds)))
        : 0;
    const consentToStore = body.consentToStore === true;

    if (!consentToStore) {
        return NextResponse.json({ error: "The prospect has not explicitly agreed to save their contact details" }, { status: 403 });
    }
    if (interactionId.length < 4 || !leadName || !isValidIndianE164(phoneNumber)) {
        return NextResponse.json({ error: "A verified call ID, caller name and valid +91 mobile number are required" }, { status: 400 });
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const client = getServiceRoleClient();
    if (!client) return NextResponse.json({ error: "CRM storage is not configured" }, { status: 503 });

    const { data: activeCall, error: callLookupError } = await client
        .from("ai_voice_call_events")
        .select("id, direction, phone_number, status")
        .eq("organization_id", organizationId)
        .eq("interaction_id", interactionId)
        .eq("phone_number", phoneNumber)
        .eq("direction", direction)
        .in("status", ["connected", "completed"])
        .maybeSingle();

    if (callLookupError) return NextResponse.json({ error: "Could not verify the current call" }, { status: 500 });
    if (!activeCall) return NextResponse.json({ error: "Lead capture is only allowed for the verified caller on a tracked call" }, { status: 403 });

    const { error: reserveError } = await client.from("ai_voice_lead_captures").insert({
        organization_id: organizationId,
        interaction_id: interactionId,
        capture_status: "processing",
        caller_consented: true,
        consented_at: new Date().toISOString(),
    });

    if (reserveError) {
        if (reserveError.code !== "23505") return NextResponse.json({ error: "Could not reserve CRM capture" }, { status: 500 });
        const { data: existing, error: lookupError } = await client
            .from("ai_voice_lead_captures")
            .select("lead_id, capture_status")
            .eq("organization_id", organizationId)
            .eq("interaction_id", interactionId)
            .maybeSingle();
        if (lookupError) return NextResponse.json({ error: "Could not verify previous CRM capture" }, { status: 500 });
        if (existing?.capture_status === "completed" && existing.lead_id) {
            return NextResponse.json({ success: true, duplicate: true, leadId: existing.lead_id });
        }
        return NextResponse.json({ success: false, processing: true, message: "This call's lead capture is already being processed" }, { status: 202 });
    }

    const qualificationScore = scoreLead({
        painPoint,
        serviceInterest,
        buyingTimeline,
        decisionMaker,
        budgetRange,
        city,
        industry,
        companyName,
    });
    const leadPriority = qualificationScore >= 75 ? "hot" : qualificationScore >= 45 ? "warm" : "normal";

    const { data: lead, error: leadError } = await client
        .from("sales_leads")
        .insert({
            organization_id: organizationId,
            lead_name: leadName,
            company_name: companyName || "Individual enquiry",
            email,
            phone: phoneNumber,
            source: "Priya AI Voice",
            status: qualificationScore >= 75 ? "qualified" : "new",
            score: qualificationScore,
        })
        .select("id")
        .single();

    if (leadError || !lead) {
        await client.from("ai_voice_lead_captures")
            .delete()
            .eq("organization_id", organizationId)
            .eq("interaction_id", interactionId);
        return NextResponse.json({ error: "Could not create CRM lead" }, { status: 500 });
    }

    const { error: profileError } = await client.from("ai_sales_lead_profiles").insert({
        organization_id: organizationId,
        lead_id: lead.id,
        city,
        industry,
        pain_point: painPoint,
        service_interest: serviceInterest,
        decision_maker: decisionMaker,
        budget_range: budgetRange,
        buying_timeline: buyingTimeline,
        qualification_score: qualificationScore,
        next_action: nextAction,
    });

    const notes = [
        painPoint ? `Pain point: ${painPoint}` : "",
        serviceInterest ? `Service interest: ${serviceInterest}` : "",
        callSummary ? `Call summary: ${callSummary}` : "",
        nextAction ? `Agreed next action: ${nextAction}` : "",
    ].filter(Boolean).join("\n");

    const { error: logError } = await client.from("sales_call_logs").insert({
        organization_id: organizationId,
        lead_id: lead.id,
        direction,
        phone_number: phoneNumber,
        duration_seconds: durationSeconds,
        outcome: "lead_captured",
        notes,
        called_at: new Date().toISOString(),
    });

    await client.from("ai_sales_activity").insert({
        organization_id: organizationId,
        lead_id: lead.id,
        actor: "priya",
        event_type: "lead_qualified",
        summary: `Priya captured a ${leadPriority} lead with qualification score ${qualificationScore}/100`,
        metadata: {
            qualification_score: qualificationScore,
            priority: leadPriority,
            follow_up_requested: body.followUpRequested === true,
            next_action: nextAction,
            call_event_id: activeCall.id,
        },
    });

    const { error: completeError } = await client
        .from("ai_voice_lead_captures")
        .update({ lead_id: lead.id, capture_status: "completed", updated_at: new Date().toISOString() })
        .eq("organization_id", organizationId)
        .eq("interaction_id", interactionId);

    if (completeError) {
        return NextResponse.json({ success: false, leadCreated: true, message: "Lead saved; capture reconciliation is required" }, { status: 202 });
    }

    return NextResponse.json({
        success: true,
        duplicate: false,
        leadId: lead.id,
        qualificationScore,
        priority: leadPriority,
        profileSaved: !profileError,
        callLogSaved: !logError,
        nextAction,
        followUpConsentRequired: body.followUpRequested === true,
    }, { status: 201 });
}
