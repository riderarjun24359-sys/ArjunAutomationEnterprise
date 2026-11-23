import { createHash, randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { getClientIp, secureApiRoute } from "@/src/lib/api-security";
import { getServiceRoleClient } from "@/src/lib/supabase-service-role";

export const runtime = "nodejs";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const KEY_NAME_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9 ._-]{1,63}$/;

export async function POST(request: Request) {
    const { context, error } = await secureApiRoute(request, {
        permission: "integrationManage",
        rateLimitKey: `integration-api-key-create:${getClientIp(request)}`,
        rateLimit: 10,
    });
    if (error || !context) {
        return error ?? NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    if (!context.organizationId) {
        return NextResponse.json({ error: "Organization context required" }, { status: 403 });
    }

    const serviceClient = getServiceRoleClient();
    if (!serviceClient) {
        return NextResponse.json({ error: "Secure credential storage is not configured" }, { status: 503 });
    }

    const body = await request.json().catch(() => null) as
        | { integrationHubId?: unknown; keyName?: unknown; apiVersion?: unknown }
        | null;
    if (!body || typeof body.integrationHubId !== "string" || !UUID_PATTERN.test(body.integrationHubId)) {
        return NextResponse.json({ error: "A valid integration hub is required" }, { status: 400 });
    }
    const keyName = typeof body.keyName === "string" ? body.keyName.trim() : "";
    if (!KEY_NAME_PATTERN.test(keyName)) {
        return NextResponse.json({ error: "Key name must be 2–64 characters and use letters, numbers, spaces, dots, underscores or hyphens" }, { status: 400 });
    }
    const apiVersion = typeof body.apiVersion === "string" ? body.apiVersion : "v1";
    if (!["v1", "v2", "v3"].includes(apiVersion)) {
        return NextResponse.json({ error: "Unsupported API version" }, { status: 400 });
    }

    const hub = await serviceClient
        .from("intg_integration_hubs")
        .select("id")
        .eq("id", body.integrationHubId)
        .eq("organization_id", context.organizationId)
        .eq("status", "active")
        .maybeSingle();
    if (hub.error || !hub.data) {
        return NextResponse.json({ error: "Integration hub not found or inactive in this organization" }, { status: 404 });
    }

    const prefix = `aae_live_${randomBytes(8).toString("hex")}`;
    const secret = randomBytes(32).toString("base64url");
    const token = `${prefix}_${secret}`;
    const keyHash = createHash("sha256").update(token, "utf8").digest("hex");

    const created = await serviceClient
        .from("intg_api_keys")
        .insert({
            organization_id: context.organizationId,
            hub_id: body.integrationHubId,
            key_name: keyName,
            key_prefix: prefix,
            key_hash: keyHash,
            api_version: apiVersion,
            expires_at: null,
            status: "active",
        })
        .select("id,key_name,key_prefix,api_version,status,created_at")
        .maybeSingle();

    if (created.error || !created.data) {
        if (created.error?.code === "23505") {
            return NextResponse.json({ error: "A key with this name already exists for this integration hub" }, { status: 409 });
        }
        return NextResponse.json({ error: "Unable to create API credential" }, { status: 500 });
    }

    const profile = await serviceClient
        .from("user_profiles")
        .select("id")
        .eq("auth_user_id", context.user.id)
        .maybeSingle();
    await serviceClient.from("intg_audit_logs").insert({
        organization_id: context.organizationId,
        entity_type: "api_key",
        entity_id: created.data.id,
        action: "create",
        summary: "Integration API credential issued",
        metadata: { key_name: keyName, key_prefix: prefix, api_version: apiVersion },
        performed_by: profile.data?.id ?? null,
        security_level: "high",
    });

    return NextResponse.json(
        {
            apiKey: {
                id: created.data.id,
                keyName: created.data.key_name,
                keyPrefix: created.data.key_prefix,
                apiVersion: created.data.api_version,
                status: created.data.status,
                createdAt: created.data.created_at,
            },
            secret: token,
            revealOnce: true,
        },
        { status: 201, headers: { "Cache-Control": "no-store, private" } },
    );
}

export async function DELETE(request: Request) {
    const { context, error } = await secureApiRoute(request, {
        permission: "integrationManage",
        rateLimitKey: `integration-api-key-revoke:${getClientIp(request)}`,
        rateLimit: 20,
    });
    if (error || !context) {
        return error ?? NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    if (!context.organizationId) {
        return NextResponse.json({ error: "Organization context required" }, { status: 403 });
    }

    const serviceClient = getServiceRoleClient();
    if (!serviceClient) {
        return NextResponse.json({ error: "Secure credential storage is not configured" }, { status: 503 });
    }

    const body = await request.json().catch(() => null) as { keyId?: unknown } | null;
    if (!body || typeof body.keyId !== "string" || !UUID_PATTERN.test(body.keyId)) {
        return NextResponse.json({ error: "A valid API key ID is required" }, { status: 400 });
    }

    const revoked = await serviceClient
        .from("intg_api_keys")
        .update({ status: "revoked", updated_at: new Date().toISOString() })
        .eq("id", body.keyId)
        .eq("organization_id", context.organizationId)
        .eq("status", "active")
        .select("id,key_name,key_prefix")
        .maybeSingle();

    if (revoked.error) {
        return NextResponse.json({ error: "Unable to revoke API credential" }, { status: 500 });
    }
    if (!revoked.data) {
        return NextResponse.json({ error: "Active API credential not found in this organization" }, { status: 404 });
    }

    const profile = await serviceClient
        .from("user_profiles")
        .select("id")
        .eq("auth_user_id", context.user.id)
        .maybeSingle();
    await serviceClient.from("intg_audit_logs").insert({
        organization_id: context.organizationId,
        entity_type: "api_key",
        entity_id: revoked.data.id,
        action: "revoke",
        summary: "Integration API credential revoked",
        metadata: { key_name: revoked.data.key_name, key_prefix: revoked.data.key_prefix },
        performed_by: profile.data?.id ?? null,
        security_level: "high",
    });

    return NextResponse.json(
        { revoked: true, keyId: revoked.data.id },
        { status: 200, headers: { "Cache-Control": "no-store, private" } },
    );
}
