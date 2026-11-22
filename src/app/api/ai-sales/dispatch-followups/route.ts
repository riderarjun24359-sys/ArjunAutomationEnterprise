import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { getServiceRoleClient } from "@/src/lib/supabase-service-role";
import { createPriyaOutboundCall, isValidIndianE164 } from "@/src/modules/ai-voice-agent/providers/voice-provider";

export const runtime = "nodejs";

function authorized(request: Request): boolean {
    const secret = process.env.PRIYA_SALES_DISPATCH_SECRET;
    const header = request.headers.get("authorization") ?? "";
    if (!secret || !header.startsWith("Bearer ")) return false;
    const supplied = Buffer.from(header.slice(7));
    const expected = Buffer.from(secret);
    return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}

function withinApprovedCallingWindow(now = new Date()): boolean {
    const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Kolkata",
        weekday: "short",
        hour: "2-digit",
        hourCycle: "h23",
    }).formatToParts(now);
    const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
    const hour = Number(values.hour);
    return values.weekday !== "Sun" && hour >= 9 && hour < 19;
}

interface ClaimedFollowup {
    followup_id: string;
    organization_id: string;
    lead_id: string;
    consent_id: string;
    phone_number: string;
    purpose: "requested_callback" | "requested_sales_followup";
    idempotency_key: string;
    lead_name: string;
    company_name: string;
}

export async function POST(request: Request) {
    if (!authorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (process.env.ARJUN_AI_SALES_OUTBOUND_ENABLED !== "true") {
        return NextResponse.json({ error: "Priya outbound dispatch is disabled" }, { status: 503 });
    }
    if (!withinApprovedCallingWindow()) {
        return NextResponse.json({ success: true, dispatched: 0, deferred: true, reason: "Outside approved IST calling window" });
    }

    const organizationId = process.env.ARJUN_VOICE_ORGANIZATION_ID?.trim();
    if (!organizationId || !/^[0-9a-f-]{36}$/i.test(organizationId)) {
        return NextResponse.json({ error: "Voice organization is not configured" }, { status: 503 });
    }

    const client = getServiceRoleClient();
    if (!client) return NextResponse.json({ error: "Sales storage is not configured" }, { status: 503 });

    const { data, error } = await client.rpc("claim_due_ai_sales_followups", {
        p_organization_id: organizationId,
        p_limit: 10,
    });
    if (error) return NextResponse.json({ error: "Could not claim due follow-ups" }, { status: 500 });

    const claimed = (data ?? []) as ClaimedFollowup[];
    let dispatched = 0;
    let cancelled = 0;
    let failed = 0;

    for (const followup of claimed) {
        if (
            followup.organization_id !== organizationId ||
            !isValidIndianE164(followup.phone_number)
        ) {
            await client.from("ai_sales_followups")
                .update({ status: "cancelled", last_error: "Invalid tenant or phone data", updated_at: new Date().toISOString() })
                .eq("id", followup.followup_id)
                .eq("organization_id", organizationId);
            cancelled += 1;
            continue;
        }

        const { data: consent, error: consentError } = await client
            .from("ai_voice_contact_consents")
            .select("id")
            .eq("id", followup.consent_id)
            .eq("organization_id", organizationId)
            .eq("phone_number", followup.phone_number)
            .eq("purpose", followup.purpose)
            .is("revoked_at", null)
            .lte("granted_at", new Date().toISOString())
            .gte("granted_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
            .maybeSingle();

        const { data: suppression, error: suppressionError } = await client
            .from("ai_sales_suppressions")
            .select("id")
            .eq("organization_id", organizationId)
            .eq("phone_number", followup.phone_number)
            .maybeSingle();

        if (consentError || suppressionError) {
            await client.from("ai_sales_followups")
                .update({ status: "failed", last_error: "Consent or suppression verification failed", updated_at: new Date().toISOString() })
                .eq("id", followup.followup_id)
                .eq("organization_id", organizationId);
            failed += 1;
            continue;
        }

        if (!consent || suppression) {
            await client.from("ai_sales_followups")
                .update({ status: "cancelled", last_error: "Consent revoked, expired or number suppressed", updated_at: new Date().toISOString() })
                .eq("id", followup.followup_id)
                .eq("organization_id", organizationId);
            cancelled += 1;
            continue;
        }

        const callEventId = crypto.randomUUID();
        const { error: eventError } = await client.from("ai_voice_call_events").insert({
            id: callEventId,
            organization_id: organizationId,
            direction: "outbound",
            phone_number: followup.phone_number,
            purpose: followup.purpose,
            status: "queued",
            extracted_variables: { followup_id: followup.followup_id, idempotency_key: followup.idempotency_key },
        });

        if (eventError) {
            await client.from("ai_sales_followups")
                .update({ status: "failed", last_error: "Could not create call event", updated_at: new Date().toISOString() })
                .eq("id", followup.followup_id)
                .eq("organization_id", organizationId);
            failed += 1;
            continue;
        }

        try {
            const call = await createPriyaOutboundCall({
                phoneNumber: followup.phone_number,
                variables: {
                    lead_name: followup.lead_name || "there",
                    company_name: followup.company_name || "your business",
                    requirement: "",
                    call_purpose: followup.purpose,
                    preferred_language: "auto",
                    call_event_id: callEventId,
                },
            });

            const { error: updateError } = await client.from("ai_voice_call_events")
                .update({ provider_attempt_id: call.providerCallId, updated_at: new Date().toISOString() })
                .eq("id", callEventId)
                .eq("organization_id", organizationId);

            if (updateError) {
                await client.from("ai_sales_followups")
                    .update({ status: "failed", last_error: "Provider accepted call but CRM correlation update failed", updated_at: new Date().toISOString() })
                    .eq("id", followup.followup_id)
                    .eq("organization_id", organizationId);
                failed += 1;
                continue;
            }

            await client.from("ai_sales_activity").insert({
                organization_id: organizationId,
                lead_id: followup.lead_id,
                actor: "priya",
                event_type: "scheduled_followup_dispatched",
                summary: "Priya dispatched a customer-requested follow-up call",
                metadata: { followup_id: followup.followup_id, call_event_id: callEventId, provider: call.provider },
            });
            dispatched += 1;
        } catch {
            await client.from("ai_voice_call_events")
                .update({ status: "failed", failure_reason: "Voice provider request failed", updated_at: new Date().toISOString() })
                .eq("id", callEventId)
                .eq("organization_id", organizationId);
            await client.from("ai_sales_followups")
                .update({ status: "failed", last_error: "Voice provider request failed", updated_at: new Date().toISOString() })
                .eq("id", followup.followup_id)
                .eq("organization_id", organizationId);
            failed += 1;
        }
    }

    return NextResponse.json({ success: true, claimed: claimed.length, dispatched, cancelled, failed });
}
