import { NextResponse } from "next/server";
import { createHmac } from "node:crypto";
import { getClientIp, secureApiRoute } from "@/src/lib/api-security";
import { getServiceRoleClient } from "@/src/lib/supabase-service-role";
import { executeWebhookStep, validateWebhookTarget } from "@/src/modules/automation/lib/webhook-action";

export const runtime = "nodejs";

interface DeliveryInput {
    webhookName: string;
    event: string;
    payload: Record<string, unknown>;
    idempotencyKey: string;
    timeoutMs?: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function readBoundedJson(
    request: Request,
    maxBytes: number,
): Promise<{ ok: true; value: unknown } | { ok: false; tooLarge: boolean }> {
    const reader = request.body?.getReader();
    if (!reader) return { ok: false, tooLarge: false };

    const chunks: Uint8Array[] = [];
    let totalBytes = 0;
    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            if (!value) continue;
            totalBytes += value.byteLength;
            if (totalBytes > maxBytes) {
                await reader.cancel().catch(() => undefined);
                return { ok: false, tooLarge: true };
            }
            chunks.push(value);
        }

        const bytes = new Uint8Array(totalBytes);
        let offset = 0;
        for (const chunk of chunks) {
            bytes.set(chunk, offset);
            offset += chunk.byteLength;
        }
        return { ok: true, value: JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)) as unknown };
    } catch {
        return { ok: false, tooLarge: false };
    } finally {
        reader.releaseLock();
    }
}

export async function POST(request: Request) {
    const { context, error } = await secureApiRoute(request, {
        permission: "integrationManage",
        rateLimitKey: `automation-webhook-delivery:${getClientIp(request)}`,
        rateLimit: 20,
    });
    if (error || !context) return error ?? NextResponse.json({ error: "Authentication required" }, { status: 401 });
    if (!context.organizationId) return NextResponse.json({ error: "Organization context required" }, { status: 403 });

    const declaredLength = Number(request.headers.get("content-length") ?? 0);
    if (Number.isFinite(declaredLength) && declaredLength > 64 * 1024) {
        return NextResponse.json({ error: "Webhook payload exceeds 64 KB" }, { status: 413 });
    }
    // Enforce the byte cap while reading, not only from Content-Length: chunked
    // or dishonest requests must not be able to allocate an unbounded JSON body.
    const parsedBody = await readBoundedJson(request, 64 * 1024);
    if (!parsedBody.ok) {
        return NextResponse.json(
            { error: parsedBody.tooLarge ? "Webhook payload exceeds 64 KB" : "Invalid JSON body" },
            { status: parsedBody.tooLarge ? 413 : 400 },
        );
    }
    const body = parsedBody.value;
    if (!isRecord(body)) return NextResponse.json({ error: "Invalid request body" }, { status: 400 });

    const input = body as unknown as DeliveryInput;
    if (
        typeof input.webhookName !== "string" || !input.webhookName.trim() ||
        typeof input.event !== "string" || !input.event.trim() || input.event.length > 160 ||
        typeof input.idempotencyKey !== "string" || !/^[a-zA-Z0-9:._-]{1,180}$/.test(input.idempotencyKey) ||
        !isRecord(input.payload)
    ) {
        return NextResponse.json({ error: "Invalid webhook delivery fields" }, { status: 400 });
    }

    const client = getServiceRoleClient();
    if (!client) return NextResponse.json({ error: "Webhook delivery service unavailable" }, { status: 503 });

    const serializedPayload = JSON.stringify(input.payload);
    if (new TextEncoder().encode(serializedPayload).byteLength > 48 * 1024) {
        return NextResponse.json({ error: "Webhook payload exceeds 48 KB" }, { status: 413 });
    }

    const lookup = await client
        .from("integration_webhooks")
        .select("id,name,url,secret,allowed_hosts,is_active")
        .eq("organization_id", context.organizationId)
        .eq("name", input.webhookName.trim())
        .eq("is_active", true)
        .maybeSingle();

    if (lookup.error) return NextResponse.json({ error: "Unable to load configured webhook" }, { status: 503 });
    const hook = lookup.data as { id: string; name: string; url: string; secret: string; allowed_hosts: string[] | null; is_active: boolean } | null;
    if (!hook) return NextResponse.json({ error: "Unknown or inactive webhook" }, { status: 404 });
    if (typeof hook.secret !== "string" || hook.secret.length < 16) {
        return NextResponse.json({ error: "Webhook signing secret is unavailable" }, { status: 503 });
    }

    const allowedHosts = Array.isArray(hook.allowed_hosts) ? hook.allowed_hosts : [];
    const validation = validateWebhookTarget(hook.url, allowedHosts);
    if (!validation.ok) return NextResponse.json({ error: validation.error ?? "Webhook target rejected" }, { status: 400 });

    // Claim the idempotency key before any network side effect. The database's
    // unique index makes this atomic across concurrent requests.
    const claim = await client
        .from("integration_deliveries")
        .insert({
            organization_id: context.organizationId,
            webhook_id: hook.id,
            event: input.event.trim(),
            target_host: validation.host ?? "",
            status: "pending",
            attempts: 0,
            error: "",
            idempotency_key: input.idempotencyKey,
        })
        .select("id")
        .single();

    if (claim.error) {
        if (claim.error.code === "23505") {
            const existing = await client
                .from("integration_deliveries")
                .select("status,response_status")
                .eq("organization_id", context.organizationId)
                .eq("webhook_id", hook.id)
                .eq("idempotency_key", input.idempotencyKey)
                .maybeSingle();
            if (existing.error) return NextResponse.json({ error: "Unable to verify webhook idempotency" }, { status: 503 });
            if (existing.data?.status === "delivered") {
                return NextResponse.json(
                    { ok: true, attempts: 0, responseStatus: existing.data.response_status, deduplicated: true },
                    { status: 200, headers: { "Cache-Control": "no-store, private" } },
                );
            }
            return NextResponse.json(
                { error: existing.data?.status === "pending" ? "Webhook delivery is already in progress" : "Idempotency key was already used; provide a new key" },
                { status: 409, headers: { "Cache-Control": "no-store, private" } },
            );
        }
        return NextResponse.json({ error: "Unable to claim webhook delivery" }, { status: 503 });
    }

    const timeoutMs = Number.isFinite(input.timeoutMs) ? Math.min(15000, Math.max(1000, Number(input.timeoutMs))) : 8000;
    const result = await executeWebhookStep({
        dispatch: {
            url: hook.url,
            event: input.event.trim(),
            payload: input.payload,
            idempotencyKey: input.idempotencyKey,
            allowedHosts,
            timeoutMs,
        },
        sign: async (raw) => createHmac("sha256", hook.secret).update(raw).digest("hex"),
        fetchFn: async (url, init) => {
            const response = await fetch(url, { method: init.method, headers: init.headers, body: init.body, signal: init.signal, redirect: "manual", cache: "no-store" });
            return { status: response.status };
        },
        delaysMs: [500, 2000],
    });

    const audit = await client
        .from("integration_deliveries")
        .update({
            status: result.ok ? "delivered" : "failed",
            attempts: result.attempts.length,
            response_status: result.responseStatus,
            error: result.error ?? "",
        })
        .eq("id", claim.data.id)
        .eq("organization_id", context.organizationId)
        .select("id")
        .single();

    if (audit.error) {
        return NextResponse.json(
            { error: "Delivery completed but audit persistence failed", delivered: result.ok },
            { status: 503, headers: { "Cache-Control": "no-store, private" } },
        );
    }

    return NextResponse.json(
        { ok: result.ok, attempts: result.attempts.length, responseStatus: result.responseStatus, error: result.error ?? null },
        { status: result.ok ? 200 : 502, headers: { "Cache-Control": "no-store, private" } },
    );
}
