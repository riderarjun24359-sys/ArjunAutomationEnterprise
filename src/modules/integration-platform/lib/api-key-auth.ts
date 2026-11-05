import "server-only";
import { isWellFormedIntegrationApiKey, matchesIntegrationApiKey } from "@/src/modules/integration-platform/lib/api-key-crypto";
import { getServiceRoleClient } from "@/src/lib/supabase-service-role";

export interface ValidatedIntegrationApiKey {
    apiKeyId: string;
    organizationId: string;
    hubId: string;
    apiVersion: string;
    scopes: Array<{ scopeKey: string; permissions: unknown[] }>;
}

/**
 * Validate a key issued by POST /api/integration-platform/api-keys.
 * Only the SHA-256 digest is persisted. The plaintext token is never queried
 * from or returned by the database.
 */
export async function validateIntegrationApiKey(token: string): Promise<ValidatedIntegrationApiKey | null> {
    if (!isWellFormedIntegrationApiKey(token)) return null;

    const prefix = token.slice(0, token.indexOf("."));

    const client = getServiceRoleClient();
    if (!client) return null;

    try {
        const { data: key, error } = await client
            .from("intg_api_keys")
            .select("id, organization_id, hub_id, key_hash, api_version, expires_at, status")
            .eq("key_prefix", prefix)
            .eq("status", "active")
            .maybeSingle();

        if (error || !key || key.status !== "active") return null;
        if (key.expires_at && Date.parse(key.expires_at) <= Date.now()) return null;
        if (typeof key.key_hash !== "string" || !/^[a-f0-9]{64}$/i.test(key.key_hash)) return null;

        if (!matchesIntegrationApiKey(token, key.key_hash)) return null;

        const [{ data: hub, error: hubError }, { data: organization, error: organizationError }] = await Promise.all([
            client.from("intg_integration_hubs").select("id, organization_id, status")
                .eq("id", key.hub_id).eq("organization_id", key.organization_id).maybeSingle(),
            client.from("organizations").select("id, status")
                .eq("id", key.organization_id).maybeSingle(),
        ]);
        if (hubError || !hub || hub.status !== "active" ||
            organizationError || !organization || organization.status !== "active") return null;

        const { data: scopeRows, error: scopeError } = await client
            .from("intg_api_scopes")
            .select("scope_key, permissions")
            .eq("api_key_id", key.id)
            .eq("organization_id", key.organization_id)
            .eq("hub_id", key.hub_id)
            .eq("status", "active");

        if (scopeError || !Array.isArray(scopeRows)) return null;

        // Last-used tracking is scoped by both key id and organization id.
        await client
            .from("intg_api_keys")
            .update({ last_used_at: new Date().toISOString() })
            .eq("id", key.id)
            .eq("organization_id", key.organization_id)
            .eq("status", "active");

        return {
            apiKeyId: key.id,
            organizationId: key.organization_id,
            hubId: key.hub_id,
            apiVersion: key.api_version,
            scopes: scopeRows.map((scope) => ({
                scopeKey: scope.scope_key,
                permissions: Array.isArray(scope.permissions) ? scope.permissions : [],
            })),
        };
    } catch {
        return null;
    }
}
