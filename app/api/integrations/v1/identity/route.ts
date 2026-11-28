import { NextResponse } from "next/server";
import { validateIntegrationApiKey } from "@/src/lib/integration-api-keys";
import { getClientIp, hasOrganizationProductAccess } from "@/src/lib/api-security";
import { checkRateLimit } from "@/src/modules/security-center/engine/api-security-engine";
import { getServiceRoleClient } from "@/src/lib/supabase-service-role";

export const runtime = "nodejs";

export async function GET(request: Request) {
    const ipRate = await checkRateLimit(`integration-api-ip:${getClientIp(request)}`, 30, 60_000);
    if (!ipRate.allowed) {
        return NextResponse.json(
            { error: "Too many integration API authentication attempts", resetAt: ipRate.resetAt },
            { status: 429, headers: { "Retry-After": String(Math.max(1, Math.ceil((Date.parse(ipRate.resetAt) - Date.now()) / 1000))) } },
        );
    }

    const authorization = request.headers.get("authorization") ?? "";
    const match = /^Bearer\s+(.+)$/i.exec(authorization);
    if (!match?.[1]) {
        return NextResponse.json({ error: "Bearer API key required" }, { status: 401 });
    }

    const identity = await validateIntegrationApiKey(match[1]);
    if (!identity) {
        return NextResponse.json({ error: "Invalid, revoked, expired, or inactive API key" }, { status: 401 });
    }

    if (!(await hasOrganizationProductAccess(identity.organizationId, "automation"))) {
        return NextResponse.json(
            { error: "This product is not enabled for the organization", code: "PRODUCT_NOT_ENABLED" },
            { status: 403, headers: { "Cache-Control": "no-store" } },
        );
    }

    const rate = await checkRateLimit(`integration-key:${identity.apiKeyId}`, 120, 60_000);
    if (!rate.allowed) {
        return NextResponse.json(
            { error: "API key rate limit exceeded", resetAt: rate.resetAt },
            { status: 429, headers: { "Retry-After": String(Math.max(1, Math.ceil((Date.parse(rate.resetAt) - Date.now()) / 1000))) } },
        );
    }

    const client = getServiceRoleClient();
    if (!client) {
        return NextResponse.json({ error: "Integration API is not configured" }, { status: 503 });
    }

    const scopes = await client
        .from("intg_api_scopes")
        .select("scope_key,scope_name,permissions")
        .eq("api_key_id", identity.apiKeyId)
        .eq("organization_id", identity.organizationId)
        .eq("hub_id", identity.integrationHubId)
        .eq("status", "active");

    if (scopes.error) {
        return NextResponse.json({ error: "Unable to load API key scopes" }, { status: 503 });
    }

    return NextResponse.json(
        {
            authenticated: true,
            apiVersion: identity.apiVersion,
            organizationId: identity.organizationId,
            integrationHubId: identity.integrationHubId,
            scopes: scopes.data ?? [],
        },
        { status: 200, headers: { "Cache-Control": "no-store, private" } },
    );
}
