import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";
import { getServiceRoleClient } from "@/src/lib/supabase-service-role";

export interface ValidatedIntegrationApiKey {
    apiKeyId: string;
    organizationId: string;
    hubId: string;
    apiVersion: string;
}

/**
 * Validate a key issued by POST /api/integration-platform/api-keys.
 * Only the SHA-256 digest is persisted. The plaintext token is never queried
 * from or returned by the database.
 */
export async function validateIntegrationApiKey(token: string): Promise<ValidatedIntegrationApiKey | null> {
    if (typeof token !== "string" || token.length < 48 || token.length > 160) return null;

    const [prefix, secret, extra] = token.split(".");
    if (extra !== undefined || !/^aa_[a-f0-9]{12}$/.test(prefix ?? "") || !/^[A-Za-z0-9_-]{40,60}$/.test(secret ?? "")) {
        return null;
    }

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

        const candidate = createHash("sha256").update(token, "utf8").digest();
        const expected = Buffer.from(key.key_hash, "hex");
        if (candidate.length !== expected.length || !timingSafeEqual(candidate, expected)) return null;

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
        };
    } catch {
        return null;
    }
}
