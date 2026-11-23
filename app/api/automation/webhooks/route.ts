import { NextResponse } from "next/server";
import { getClientIp, secureApiRoute } from "@/src/lib/api-security";
import { getServiceRoleClient } from "@/src/lib/supabase-service-role";
import { validateWebhookTarget } from "@/src/modules/automation/lib/webhook-action";

export const runtime = "nodejs";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const MAX_BODY_BYTES = 8 * 1024;

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function readBoundedJson(request: Request): Promise<unknown | null> {
    const reader = request.body?.getReader();
    if (!reader) return null;
    const chunks: Uint8Array[] = [];
    let total = 0;
    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            if (!value) continue;
            total += value.byteLength;
            if (total > MAX_BODY_BYTES) {
                await reader.cancel().catch(() => undefined);
                return null;
            }
            chunks.push(value);
        }
        const bytes = new Uint8Array(total);
        let offset = 0;
        for (const chunk of chunks) {
            bytes.set(chunk, offset);
            offset += chunk.byteLength;
        }
        return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)) as unknown;
    } catch {
        return null;
    } finally {
        reader.releaseLock();
    }
}

function authorized(request: Request, action: string) {
    return secureApiRoute(request, {
        permission: "integrationManage",
        rateLimitKey: `automation-webhooks:${action}:${getClientIp(request)}`,
        rateLimit: action === "read" ? 60 : 20,
    });
}

export async function GET(request: Request) {
    const { context, error } = await authorized(request, "read");
    if (error || !context) return error ?? NextResponse.json({ error: "Authentication required" }, { status: 401 });
    if (!context.organizationId) return NextResponse.json({ error: "Organization context required" }, { status: 403 });
    const client = getServiceRoleClient();
    if (!client) return NextResponse.json({ error: "Webhook service unavailable" }, { status: 503 });

    const { data, error: queryError } = await client
        .from("integration_webhooks")
        .select("id,name,url,allowed_hosts,is_active,created_at,secret")
        .eq("organization_id", context.organizationId)
        .order("created_at", { ascending: false })
        .limit(200);
    if (queryError) return NextResponse.json({ error: "Unable to load webhooks" }, { status: 503 });

    return NextResponse.json({
        webhooks: (data ?? []).map((row) => ({
            id: row.id,
            name: row.name,
            url: row.url,
            allowedHosts: row.allowed_hosts,
            isActive: row.is_active,
            hasSecret: typeof row.secret === "string" && row.secret.length >= 16,
            createdAt: row.created_at,
        })),
    }, { headers: { "Cache-Control": "no-store, private" } });
}

export async function POST(request: Request) {
    const { context, error } = await authorized(request, "create");
    if (error || !context) return error ?? NextResponse.json({ error: "Authentication required" }, { status: 401 });
    if (!context.organizationId) return NextResponse.json({ error: "Organization context required" }, { status: 403 });

    const body = await readBoundedJson(request);
    if (!isRecord(body)) return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const url = typeof body.url === "string" ? body.url.trim() : "";
    const secret = typeof body.secret === "string" ? body.secret : "";
    if (!name || name.length > 80 || !/^[a-zA-Z0-9][a-zA-Z0-9 ._-]{1,79}$/.test(name)) {
        return NextResponse.json({ error: "Webhook name must be 2–80 characters and use letters, numbers, spaces, dots, underscores or hyphens" }, { status: 400 });
    }
    if (secret.length < 16 || secret.length > 256) {
        return NextResponse.json({ error: "Webhook secret must be between 16 and 256 characters" }, { status: 400 });
    }
    if (!url || url.length > 2048) return NextResponse.json({ error: "A valid webhook URL is required" }, { status: 400 });

    const suppliedHosts = Array.isArray(body.allowedHosts) ? body.allowedHosts : [];
    if (suppliedHosts.length > 30 || suppliedHosts.some((host) => typeof host !== "string" || host.length > 253)) {
        return NextResponse.json({ error: "Invalid webhook host allowlist" }, { status: 400 });
    }
    let fallbackHost = "";
    try {
        fallbackHost = new URL(url).hostname.toLowerCase().replace(/\.$/, "");
    } catch {
        return NextResponse.json({ error: "Webhook URL is invalid" }, { status: 400 });
    }
    const allowedHosts = (suppliedHosts as string[]).map((host) => host.trim().toLowerCase().replace(/\.$/, "")).filter(Boolean);
    const effectiveHosts = allowedHosts.length ? allowedHosts : [fallbackHost];
    const validation = validateWebhookTarget(url, effectiveHosts);
    if (!validation.ok) return NextResponse.json({ error: validation.error ?? "Webhook target rejected" }, { status: 400 });

    const client = getServiceRoleClient();
    if (!client) return NextResponse.json({ error: "Webhook service unavailable" }, { status: 503 });
    const { data, error: insertError } = await client
        .from("integration_webhooks")
        .insert({
            organization_id: context.organizationId,
            name,
            url,
            secret,
            allowed_hosts: effectiveHosts,
            is_active: true,
        })
        .select("id,name")
        .single();
    if (insertError || !data) {
        return NextResponse.json(
            { error: insertError?.code === "23505" ? "A webhook with this name already exists" : "Unable to create webhook" },
            { status: insertError?.code === "23505" ? 409 : 503 },
        );
    }
    return NextResponse.json({ webhook: data }, { status: 201, headers: { "Cache-Control": "no-store, private" } });
}

export async function PATCH(request: Request) {
    const { context, error } = await authorized(request, "update");
    if (error || !context) return error ?? NextResponse.json({ error: "Authentication required" }, { status: 401 });
    if (!context.organizationId) return NextResponse.json({ error: "Organization context required" }, { status: 403 });
    const body = await readBoundedJson(request);
    if (!isRecord(body) || typeof body.id !== "string" || !UUID_PATTERN.test(body.id) || typeof body.isActive !== "boolean") {
        return NextResponse.json({ error: "A valid webhook ID and active state are required" }, { status: 400 });
    }
    const client = getServiceRoleClient();
    if (!client) return NextResponse.json({ error: "Webhook service unavailable" }, { status: 503 });
    const { data, error: updateError } = await client
        .from("integration_webhooks")
        .update({ is_active: body.isActive, updated_at: new Date().toISOString() })
        .eq("id", body.id)
        .eq("organization_id", context.organizationId)
        .select("id,name,is_active")
        .maybeSingle();
    if (updateError) return NextResponse.json({ error: "Unable to update webhook" }, { status: 503 });
    if (!data) return NextResponse.json({ error: "Webhook not found in your organization" }, { status: 404 });
    return NextResponse.json({ webhook: data }, { headers: { "Cache-Control": "no-store, private" } });
}
