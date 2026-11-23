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
    const consentId = clean(body.consentId, 80);
    const purpose = body.purpose === "requested_sales_followup"
        ? "requested_sales_followup"
        : body.purpose === "requested_callback"
            ? "requested_callback"
            : "";
    const idempotencyKey = clean(body.idempotencyKey, 160);
    const dueAt = typeof body.dueAt === "string" ? new Date(body.dueAt) : new Date();

    if (!leadId || !consentId || !purpose || idempotencyKey.length < 8) {
        return NextResponse.json({ error: "Lead, consent, purpose and an idempotency key are required" }, { status: 400 });
    }
    if (Number.isNaN(dueAt.getTime()) || dueAt.getTime() < Date.now() - 60_000 || dueAt.getTime() > Date.now() + 30 * 24 * 60 * 60_000) {
        return NextResponse.json({ error: "Follow-up time must be between now and 30 days from now" }, { status: 400 });
    }

    const client = getServiceRoleClient();
    if (!client) return NextResponse.json({ error: "Sales follow-up storage is not configured" }, { status: 503 });

    const { data: lead, error: leadError } = await client
        .from("sales_leads")
        .select("id, phone")
        .eq("id", leadId)
        .eq("organization_id", organizationId)
        .maybeSingle();

    if (leadError) return NextResponse.json({ error: "Could not verify CRM lead" }, { status: 500 });
    if (!lead) return NextResponse.json({ error: "CRM lead not found" }, { status: 404 });

    const { data: consent, error: consentError } = await client
        .from("ai_voice_contact_consents")
        .select("id")
        .eq("id", consentId)
        .eq("organization_id", organizationId)
        .eq("phone_number", lead.phone)
        .eq("purpose", purpose)
        .is("revoked_at", null)
        .lte("granted_at", new Date().toISOString())
        .gte("granted_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .maybeSingle();

    if (consentError) return NextResponse.json({ error: "Could not verify follow-up consent" }, { status: 500 });
    if (!consent) return NextResponse.json({ error: "No active matching consent exists for this lead" }, { status: 403 });

    const { data: suppression, error: suppressionError } = await client
        .from("ai_sales_suppressions")
        .select("id")
        .eq("organization_id", organizationId)
        .eq("phone_number", lead.phone)
        .maybeSingle();

    if (suppressionError) return NextResponse.json({ error: "Could not verify do-not-contact status" }, { status: 500 });
    if (suppression) return NextResponse.json({ error: "This number is on the do-not-contact list" }, { status: 409 });

    const { data, error } = await client.from("ai_sales_followups")
        .insert({
            organization_id: organizationId,
            lead_id: leadId,
            consent_id: consentId,
            channel: "voice",
            purpose,
            due_at: dueAt.toISOString(),
            status: "pending",
            attempt_count: 0,
            idempotency_key: idempotencyKey,
        })
        .select("id, due_at, status, purpose")
        .single();

    if (error) {
        if (error.code === "23505") {
            const { data: existing, error: lookupError } = await client.from("ai_sales_followups")
                .select("id, due_at, status, purpose")
                .eq("organization_id", organizationId)
                .eq("idempotency_key", idempotencyKey)
                .maybeSingle();
            if (lookupError) return NextResponse.json({ error: "Could not verify duplicate follow-up" }, { status: 500 });
            return NextResponse.json({ success: true, duplicate: true, followup: existing });
        }
        return NextResponse.json({ error: "Could not schedule follow-up" }, { status: 500 });
    }

    await client.from("ai_sales_activity").insert({
        organization_id: organizationId,
        lead_id: leadId,
        actor: "priya",
        event_type: "followup_scheduled",
        summary: "Priya scheduled a prospect-requested follow-up",
        metadata: { followup_id: data.id, due_at: data.due_at, purpose },
    });

    return NextResponse.json({ success: true, followup: data }, { status: 201 });
}
