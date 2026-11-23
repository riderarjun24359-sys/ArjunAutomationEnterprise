import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { getServiceRoleClient } from "@/src/lib/supabase-service-role";

export const runtime = "nodejs";

interface LeadCaptureInput {
    interactionId?: unknown;
    leadName?: unknown;
    companyName?: unknown;
    email?: unknown;
    phoneNumber?: unknown;
    requirement?: unknown;
    callSummary?: unknown;
    followUpRequested?: unknown;
    preferredCallbackAt?: unknown;
    callDirection?: unknown;
    durationSeconds?: unknown;
    callerConsent?: unknown;
}

function hasValidToolToken(request: Request): boolean {
    const secret = process.env.SARVAM_VOICE_TOOL_SECRET;
    const authorization = request.headers.get("authorization") ?? "";
    if (!secret || !authorization.startsWith("Bearer ")) return false;
    const supplied = Buffer.from(authorization.slice(7));
    const expected = Buffer.from(secret);
    return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}

function cleanText(value: unknown, max: number): string {
    return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function isIndianE164(value: string): boolean {
    return /^\+91[6-9]\d{9}$/.test(value);
}

export async function POST(request: Request) {
    if (!hasValidToolToken(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const organizationId = process.env.ARJUN_VOICE_ORGANIZATION_ID?.trim();
    if (!organizationId || !/^[0-9a-f-]{36}$/i.test(organizationId)) {
        return NextResponse.json({ error: "Voice CRM tenant is not configured" }, { status: 503 });
    }

    const declaredLength = Number(request.headers.get("content-length") ?? "0");
    if (declaredLength > 20_000) {
        return NextResponse.json({ error: "Request body too large" }, { status: 413 });
    }

    let body: LeadCaptureInput;
    try {
        const raw = await request.text();
        if (raw.length > 20_000) return NextResponse.json({ error: "Request body too large" }, { status: 413 });
        body = JSON.parse(raw) as LeadCaptureInput;
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const interactionId = cleanText(body.interactionId, 200);
    const leadName = cleanText(body.leadName, 120);
    const companyName = cleanText(body.companyName, 160) || "Individual enquiry";
    const email = cleanText(body.email, 254).toLowerCase();
    const phoneNumber = cleanText(body.phoneNumber, 16);
    const requirement = cleanText(body.requirement, 1_000);
    const callSummary = cleanText(body.callSummary, 1_000);
    const preferredCallbackAt = cleanText(body.preferredCallbackAt, 100);
    const followUpRequested = body.followUpRequested === true;
    const callerConsent = body.callerConsent === true;
    const callDirection = body.callDirection === "outbound" ? "outbound" : "inbound";
    const durationSeconds =
        typeof body.durationSeconds === "number" && Number.isFinite(body.durationSeconds)
            ? Math.max(0, Math.min(86_400, Math.round(body.durationSeconds)))
            : 0;

    if (!callerConsent) {
        return NextResponse.json({ error: "The caller has not consented to saving their contact details" }, { status: 403 });
    }
    if (interactionId.length < 4 || !leadName || !phoneNumber || !isIndianE164(phoneNumber)) {
        return NextResponse.json({
            error: "A valid interaction ID, caller name, and Indian phone number are required",
        }, { status: 400 });
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const client = getServiceRoleClient();
    if (!client) return NextResponse.json({ error: "CRM storage is not configured" }, { status: 503 });

    // Reserve the provider interaction before creating a lead. A unique
    // (organization_id, interaction_id) constraint makes retries idempotent.
    const { error: reserveError } = await client.from("ai_voice_lead_captures").insert({
        organization_id: organizationId,
        interaction_id: interactionId,
        capture_status: "processing",
    });

    if (reserveError) {
        if (reserveError.code !== "23505") {
            return NextResponse.json({ error: "Could not reserve CRM capture" }, { status: 500 });
        }
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
        return NextResponse.json({ success: false, processing: true, message: "This call is already being processed" }, { status: 202 });
    }

    const { data: lead, error: leadError } = await client
        .from("sales_leads")
        .insert({
            organization_id: organizationId,
            lead_name: leadName,
            company_name: companyName,
            email,
            phone: phoneNumber,
            source: "AI Voice Agent",
            status: "new",
            score: 0,
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

    const { error: completeError } = await client
        .from("ai_voice_lead_captures")
        .update({
            lead_id: lead.id,
            capture_status: "completed",
            updated_at: new Date().toISOString(),
        })
        .eq("organization_id", organizationId)
        .eq("interaction_id", interactionId);

    if (completeError) {
        // Keep the lead, but return a retry-safe error; the reservation row
        // prevents a duplicate lead if Sarvam retries this interaction.
        return NextResponse.json({ success: false, leadCreated: true, message: "Lead created; capture confirmation needs reconciliation" }, { status: 202 });
    }

    const notes = [
        requirement ? `Requirement: ${requirement}` : "",
        callSummary ? `Call summary: ${callSummary}` : "",
        followUpRequested ? "Customer requested follow-up." : "No follow-up requested.",
        preferredCallbackAt ? `Preferred callback: ${preferredCallbackAt}` : "",
    ].filter(Boolean).join("\n");

    const { error: callLogError } = await client.from("sales_call_logs").insert({
        organization_id: organizationId,
        lead_id: lead.id,
        direction: callDirection,
        phone_number: phoneNumber,
        duration_seconds: durationSeconds,
        outcome: followUpRequested ? "follow_up_requested" : "lead_captured",
        notes,
        called_at: new Date().toISOString(),
    });

    return NextResponse.json({
        success: true,
        duplicate: false,
        leadId: lead.id,
        followUpRequested,
        callLogSaved: !callLogError,
    }, { status: 201 });
}
