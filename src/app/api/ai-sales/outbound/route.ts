import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { secureApiRoute } from "@/src/lib/api-security";
import { getServiceRoleClient } from "@/src/lib/supabase-service-role";
import {
    createPriyaOutboundCall,
    isValidIndianE164,
} from "@/src/modules/ai-voice-agent/providers/voice-provider";

export const runtime = "nodejs";

function withinApprovedCallingWindow(now = new Date()): boolean {
    const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Kolkata",
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
    }).formatToParts(now);
    const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
    const hour = Number(values.hour);
    const minute = Number(values.minute);
    const weekday = values.weekday;
    const minutes = hour * 60 + minute;
    // Conservative local calling window: Monday-Saturday, 09:00-19:00 IST.
    return weekday !== "Sun" && minutes >= 9 * 60 && minutes < 19 * 60;
}

function text(value: unknown, max: number): string {
    return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
    const secured = await secureApiRoute(request, {
        permission: "automationManage",
        rateLimit: 5,
    });
    if (secured.error) return secured.error;
    if (!secured.context?.organizationId) {
        return NextResponse.json({ error: "Organization context is required" }, { status: 403 });
    }

    if (process.env.ARJUN_AI_SALES_OUTBOUND_ENABLED !== "true") {
        return NextResponse.json({ error: "Priya outbound sales calling is disabled until provider, consent and compliance checks are complete" }, { status: 503 });
    }
    if (!withinApprovedCallingWindow()) {
        return NextResponse.json({ error: "Outbound calls are only dispatched Monday-Saturday between 09:00 and 19:00 Asia/Kolkata" }, { status: 409 });
    }

    let body: Record<string, unknown>;
    try {
        body = (await request.json()) as Record<string, unknown>;
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const leadId = text(body.leadId, 80);
    const consentId = text(body.consentId, 80);
    const phoneNumber = text(body.phoneNumber, 16);
    const purpose = body.purpose === "requested_sales_followup"
        ? "requested_sales_followup"
        : body.purpose === "requested_callback"
            ? "requested_callback"
            : "";
    const idempotencyKey = text(body.idempotencyKey, 160);
    const requirement = text(body.requirement, 700);
    const preferredLanguage = body.preferredLanguage === "te" || body.preferredLanguage === "en" || body.preferredLanguage === "hi"
        ? body.preferredLanguage
        : "auto";

    if (!leadId || !consentId || !purpose || !idempotencyKey || !isValidIndianE164(phoneNumber)) {
        return NextResponse.json({
            error: "leadId, consentId, purpose, idempotencyKey and a valid +91 phone number are required",
        }, { status: 400 });
    }

    const client = getServiceRoleClient();
    if (!client) return NextResponse.json({ error: "Sales storage is not configured" }, { status: 503 });

    const organizationId = secured.context.organizationId;
    const { data: consent, error: consentError } = await client
        .from("ai_voice_contact_consents")
        .select("id, phone_number, purpose, granted_at, revoked_at")
        .eq("id", consentId)
        .eq("organization_id", organizationId)
        .eq("phone_number", phoneNumber)
        .eq("purpose", purpose)
        .is("revoked_at", null)
        .lte("granted_at", new Date().toISOString())
        .gte("granted_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .maybeSingle();

    if (consentError) return NextResponse.json({ error: "Could not verify outbound consent" }, { status: 500 });
    if (!consent) return NextResponse.json({ error: "No active, recent, matching customer opt-in exists for this call" }, { status: 403 });

    const { data: suppression, error: suppressionError } = await client
        .from("ai_sales_suppressions")
        .select("id")
        .eq("organization_id", organizationId)
        .eq("phone_number", phoneNumber)
        .maybeSingle();

    if (suppressionError) return NextResponse.json({ error: "Could not verify do-not-contact status" }, { status: 500 });
    if (suppression) return NextResponse.json({ error: "This number is suppressed and cannot be called" }, { status: 409 });

    const { data: lead, error: leadError } = await client
        .from("sales_leads")
        .select("id, lead_name, company_name, phone")
        .eq("id", leadId)
        .eq("organization_id", organizationId)
        .maybeSingle();

    if (leadError) return NextResponse.json({ error: "Could not verify CRM lead" }, { status: 500 });
    if (!lead) return NextResponse.json({ error: "Lead was not found in this organization" }, { status: 404 });
    if (lead.phone && lead.phone !== phoneNumber) {
        return NextResponse.json({ error: "The supplied number does not match the CRM lead number" }, { status: 409 });
    }

    const { data: queued, error: queueError } = await client
        .from("ai_sales_followups")
        .insert({
            organization_id: organizationId,
            lead_id: leadId,
            consent_id: consentId,
            channel: "voice",
            purpose,
            due_at: new Date().toISOString(),
            status: "processing",
            attempt_count: 1,
            idempotency_key: idempotencyKey,
        })
        .select("id")
        .single();

    if (queueError) {
        if (queueError.code === "23505") {
            const { data: existing } = await client
                .from("ai_sales_followups")
                .select("id, status")
                .eq("organization_id", organizationId)
                .eq("idempotency_key", idempotencyKey)
                .maybeSingle();
            return NextResponse.json({
                success: true,
                duplicate: true,
                followupId: existing?.id ?? null,
                status: existing?.status ?? "already_processed",
            }, { status: 202 });
        }
        return NextResponse.json({ error: "Could not queue the outbound sales call" }, { status: 500 });
    }

    const callEventId = randomUUID();
    const { error: callEventError } = await client.from("ai_voice_call_events").insert({
        id: callEventId,
        organization_id: organizationId,
        direction: "outbound",
        phone_number: phoneNumber,
        purpose,
        status: "queued",
        created_by: secured.context.user.id,
    });

    if (callEventError) {
        await client.from("ai_sales_followups")
            .update({ status: "failed", last_error: "Could not create call event", updated_at: new Date().toISOString() })
            .eq("id", queued.id)
            .eq("organization_id", organizationId);
        return NextResponse.json({ error: "Could not create outbound call record" }, { status: 500 });
    }

    try {
        const call = await createPriyaOutboundCall({
            phoneNumber,
            variables: {
                lead_name: lead.lead_name ?? "there",
                company_name: lead.company_name ?? "your business",
                requirement,
                call_purpose: purpose,
                preferred_language: preferredLanguage,
            },
        });

        await client.from("ai_voice_call_events")
            .update({
                provider_attempt_id: call.providerCallId,
                updated_at: new Date().toISOString(),
            })
            .eq("id", callEventId)
            .eq("organization_id", organizationId);

        await client.from("ai_sales_activity").insert({
            organization_id: organizationId,
            lead_id: leadId,
            actor: "priya",
            event_type: "outbound_call_started",
            summary: "Priya started a consented outbound sales follow-up",
            metadata: {
                provider: call.provider,
                call_event_id: callEventId,
                followup_id: queued.id,
                purpose,
            },
        });

        return NextResponse.json({
            success: true,
            callEventId,
            followupId: queued.id,
            provider: call.provider,
            status: "queued",
        }, { status: 202 });
    } catch {
        await client.from("ai_voice_call_events")
            .update({ status: "failed", failure_reason: "Voice provider request failed", updated_at: new Date().toISOString() })
            .eq("id", callEventId)
            .eq("organization_id", organizationId);
        await client.from("ai_sales_followups")
            .update({ status: "failed", last_error: "Voice provider request failed", updated_at: new Date().toISOString() })
            .eq("id", queued.id)
            .eq("organization_id", organizationId);
        return NextResponse.json({ error: "Could not start Priya's outbound call. Verify provider configuration." }, { status: 502 });
    }
}
