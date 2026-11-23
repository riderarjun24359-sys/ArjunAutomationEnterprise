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

function requiredEnv(name: string): string {
    const value = process.env[name]?.trim();
    if (!value) throw new Error("WhatsApp configuration is incomplete");
    return value;
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
    const phoneNumber = clean(body.phoneNumber, 16);
    const templateName = clean(body.templateName, 512);
    const languageCode = clean(body.languageCode, 16);
    const idempotencyKey = clean(body.idempotencyKey, 160);
    const parameters = Array.isArray(body.bodyParameters) ? body.bodyParameters : [];

    if (!leadId || !isValidIndianE164(phoneNumber) ||
        !/^[a-z0-9_]{3,512}$/.test(templateName) ||
        !/^[a-z]{2,3}(?:_[A-Z]{2})?$/.test(languageCode) ||
        !/^[A-Za-z0-9:_-]{8,160}$/.test(idempotencyKey) ||
        parameters.length > 10 ||
        parameters.some((value) => typeof value !== "string" || value.length > 1024)) {
        return NextResponse.json({
            error: "Provide a lead, valid +91 number, approved template name, language, idempotency key and up to 10 text parameters",
        }, { status: 400 });
    }

    const client = getServiceRoleClient();
    if (!client) return NextResponse.json({ error: "WhatsApp message storage is not configured" }, { status: 503 });

    const { data: previous, error: previousError } = await client.from("ai_sales_whatsapp_messages")
        .select("id, provider_message_id, status")
        .eq("organization_id", organizationId)
        .eq("idempotency_key", idempotencyKey)
        .maybeSingle();
    if (previousError) return NextResponse.json({ error: "Could not check previous WhatsApp request" }, { status: 500 });
    if (previous) {
        return NextResponse.json({
            success: true,
            duplicate: true,
            messageRecordId: previous.id,
            providerMessageId: previous.provider_message_id,
            status: previous.status,
        }, { status: 202 });
    }

    const { data: suppression, error: suppressionError } = await client.from("ai_sales_suppressions")
        .select("id")
        .eq("organization_id", organizationId)
        .eq("phone_number", phoneNumber)
        .maybeSingle();
    if (suppressionError) return NextResponse.json({ error: "Could not verify do-not-contact status" }, { status: 500 });
    if (suppression) return NextResponse.json({ error: "This number is suppressed and cannot receive WhatsApp messages" }, { status: 409 });

    const { data: lead, error: leadError } = await client.from("sales_leads")
        .select("id, phone")
        .eq("id", leadId)
        .eq("organization_id", organizationId)
        .maybeSingle();
    if (leadError) return NextResponse.json({ error: "Could not verify CRM lead" }, { status: 500 });
    if (!lead || lead.phone !== phoneNumber) {
        return NextResponse.json({ error: "The phone number does not match this CRM lead" }, { status: 404 });
    }

    const consentCutoff = new Date(Date.now() - 90 * 24 * 60 * 60_000).toISOString();
    const { data: consent, error: consentError } = await client.from("ai_voice_contact_consents")
        .select("id, granted_at")
        .eq("organization_id", organizationId)
        .eq("phone_number", phoneNumber)
        .eq("purpose", "requested_whatsapp_message")
        .is("revoked_at", null)
        .gte("granted_at", consentCutoff)
        .order("granted_at", { ascending: false })
        .limit(1)
        .maybeSingle();
    if (consentError) return NextResponse.json({ error: "Could not verify WhatsApp consent" }, { status: 500 });
    if (!consent) {
        return NextResponse.json({
            error: "No recent, active, explicit WhatsApp-message consent exists for this number",
        }, { status: 403 });
    }

    let graphVersion: string;
    let accessToken: string;
    let phoneNumberId: string;
    let businessAccountId: string;
    try {
        graphVersion = requiredEnv("WHATSAPP_GRAPH_API_VERSION");
        accessToken = requiredEnv("WHATSAPP_CLOUD_API_ACCESS_TOKEN");
        phoneNumberId = requiredEnv("WHATSAPP_PHONE_NUMBER_ID");
        businessAccountId = requiredEnv("WHATSAPP_BUSINESS_ACCOUNT_ID");
    } catch {
        return NextResponse.json({ error: "WhatsApp Cloud API credentials are not configured" }, { status: 503 });
    }

    if (!/^v\d+\.\d+$/.test(graphVersion)) {
        return NextResponse.json({ error: "WhatsApp Graph API version must look like v27.0" }, { status: 503 });
    }

    const graphBase = "https://graph.facebook.com/" + graphVersion;
    let approvedTemplate: Record<string, unknown>;
    try {
        const templateResponse = await fetch(
            graphBase + "/" + businessAccountId + "/message_templates?name=" + encodeURIComponent(templateName),
            {
                headers: { Authorization: "Bearer " + accessToken },
                cache: "no-store",
                signal: AbortSignal.timeout(10_000),
            },
        );
        if (!templateResponse.ok) {
            return NextResponse.json({ error: "Could not verify the WhatsApp template approval status" }, { status: 502 });
        }
        const templatePayload = await templateResponse.json() as { data?: Record<string, unknown>[] };
        approvedTemplate = (templatePayload.data ?? []).find((item) =>
            item.name === templateName &&
            item.language === languageCode &&
            item.status === "APPROVED" &&
            ["UTILITY", "MARKETING"].includes(String(item.category)),
        ) ?? {};
    } catch {
        return NextResponse.json({ error: "WhatsApp template verification timed out" }, { status: 504 });
    }

    if (!approvedTemplate.id) {
        return NextResponse.json({
            error: "The requested template is not approved for the selected language",
        }, { status: 409 });
    }

    const { data: messageRecord, error: recordError } = await client.from("ai_sales_whatsapp_messages")
        .insert({
            organization_id: organizationId,
            lead_id: leadId,
            consent_id: consent.id,
            phone_number: phoneNumber,
            template_name: templateName,
            language_code: languageCode,
            idempotency_key: idempotencyKey,
            status: "accepted",
        })
        .select("id")
        .single();

    if (recordError?.code === "23505") {
        const { data: duplicate } = await client.from("ai_sales_whatsapp_messages")
            .select("id, provider_message_id, status")
            .eq("organization_id", organizationId)
            .eq("idempotency_key", idempotencyKey)
            .maybeSingle();
        if (duplicate) return NextResponse.json({ success: true, duplicate: true, messageRecordId: duplicate.id, providerMessageId: duplicate.provider_message_id, status: duplicate.status }, { status: 202 });
    }
    if (recordError || !messageRecord) {
        return NextResponse.json({ error: "Could not create WhatsApp delivery record" }, { status: 500 });
    }

    try {
        const sendResponse = await fetch(graphBase + "/" + phoneNumberId + "/messages", {
            method: "POST",
            headers: {
                Authorization: "Bearer " + accessToken,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: phoneNumber.slice(1),
                type: "template",
                template: {
                    name: templateName,
                    language: { code: languageCode },
                    ...(parameters.length ? {
                        components: [{
                            type: "body",
                            parameters: parameters.map((value) => ({ type: "text", text: value })),
                        }],
                    } : {}),
                },
            }),
            cache: "no-store",
            signal: AbortSignal.timeout(15_000),
        });

        const result = await sendResponse.json() as {
            messages?: Array<{ id?: string }>;
            error?: { code?: number; message?: string };
        };
        const providerMessageId = result.messages?.[0]?.id ?? "";
        if (!sendResponse.ok || !providerMessageId) {
            await client.from("ai_sales_whatsapp_messages").update({
                status: "failed",
                failure_code: String(result.error?.code ?? sendResponse.status).slice(0, 80),
                updated_at: new Date().toISOString(),
            }).eq("id", messageRecord.id).eq("organization_id", organizationId);
            return NextResponse.json({ error: "WhatsApp provider did not accept the message" }, { status: 502 });
        }

        await client.from("ai_sales_whatsapp_messages").update({
            provider_message_id: providerMessageId,
            updated_at: new Date().toISOString(),
        }).eq("id", messageRecord.id).eq("organization_id", organizationId);

        await client.from("ai_sales_activity").insert({
            organization_id: organizationId,
            lead_id: leadId,
            actor: "priya",
            event_type: "whatsapp_template_accepted",
            summary: "Priya sent approved WhatsApp template " + templateName,
            metadata: {
                message_record_id: messageRecord.id,
                provider_message_id: providerMessageId,
                template_name: templateName,
                language_code: languageCode,
            },
        });

        return NextResponse.json({
            success: true,
            status: "accepted",
            messageRecordId: messageRecord.id,
            providerMessageId,
            note: "Accepted by WhatsApp Cloud API; delivery is not confirmed until a status webhook is received.",
        }, { status: 202 });
    } catch {
        await client.from("ai_sales_whatsapp_messages").update({
            status: "failed",
            failure_code: "provider_timeout_or_network_error",
            updated_at: new Date().toISOString(),
        }).eq("id", messageRecord.id).eq("organization_id", organizationId);
        return NextResponse.json({ error: "WhatsApp provider request failed; inspect delivery state before retrying with a new key" }, { status: 502 });
    }
}
