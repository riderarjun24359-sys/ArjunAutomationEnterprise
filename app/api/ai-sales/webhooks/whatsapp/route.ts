import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { getServiceRoleClient } from "@/src/lib/supabase-service-role";

export const runtime = "nodejs";

function safeEqual(left: string, right: string): boolean {
    const a = Buffer.from(left);
    const b = Buffer.from(right);
    return a.length === b.length && timingSafeEqual(a, b);
}

export async function GET(request: Request) {
    const url = new URL(request.url);
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token") ?? "";
    const challenge = url.searchParams.get("hub.challenge") ?? "";
    const expected = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN ?? "";
    if (mode !== "subscribe" || !expected || !safeEqual(token, expected) || !challenge) {
        return new Response("Forbidden", { status: 403 });
    }
    return new Response(challenge, { status: 200, headers: { "Content-Type": "text/plain" } });
}

export async function POST(request: Request) {
    const appSecret = process.env.WHATSAPP_APP_SECRET?.trim();
    const signature = request.headers.get("x-hub-signature-256") ?? "";
    if (!appSecret || !/^sha256=[a-f0-9]{64}$/i.test(signature)) {
        return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
    }

    const rawBody = await request.text();
    const expected = "sha256=" + createHmac("sha256", appSecret).update(rawBody, "utf8").digest("hex");
    if (!safeEqual(expected, signature)) {
        return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
    }

    let payload: {
        entry?: Array<{
            changes?: Array<{
                value?: {
                    statuses?: Array<{
                        id?: string;
                        status?: string;
                        errors?: Array<{ code?: number }>;
                    }>;
                };
            }>;
        }>;
    };
    try {
        payload = JSON.parse(rawBody);
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const statuses = (payload.entry ?? []).flatMap((entry) =>
        (entry.changes ?? []).flatMap((change) => change.value?.statuses ?? []),
    );

    if (!statuses.length) return NextResponse.json({ received: true, updated: 0 });

    const client = getServiceRoleClient();
    if (!client) return NextResponse.json({ error: "WhatsApp status storage is unavailable" }, { status: 503 });

    let updated = 0;
    for (const item of statuses) {
        const messageId = typeof item.id === "string" ? item.id : "";
        const status = item.status;
        if (!messageId || !["sent", "delivered", "read", "failed"].includes(String(status))) continue;

        const eligiblePriorStatuses = status === "sent"
            ? ["accepted"]
            : status === "delivered"
                ? ["accepted", "sent"]
                : status === "read"
                    ? ["accepted", "sent", "delivered"]
                    : ["accepted", "sent"];

        const update = await client.from("ai_sales_whatsapp_messages").update({
            status,
            failure_code: status === "failed" ? String(item.errors?.[0]?.code ?? "provider_failed") : null,
            updated_at: new Date().toISOString(),
        }).eq("provider_message_id", messageId).in("status", eligiblePriorStatuses).select("id");

        if (!update.error) updated += update.data?.length ?? 0;
    }

    return NextResponse.json({ received: true, updated });
}
