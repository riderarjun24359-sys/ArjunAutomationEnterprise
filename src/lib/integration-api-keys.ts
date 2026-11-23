import { createHash, timingSafeEqual } from "node:crypto";
import { getServiceRoleClient } from "@/src/lib/supabase-service-role";

export interface ValidatedIntegrationApiKey {
    apiKeyId: string;
    organizationId: string;
    integrationHubId: string;
    apiVersion: string;
}

/**
 * Validate a bearer credential without ever storing or comparing a plaintext
 * secret. The database contains only SHA-256 digests of high-entropy random
 * tokens; a matching key must also be active and not expired.
 */
export async function validateIntegrationApiKey(token: string): Promise<ValidatedIntegrationApiKey | null> {
    const match = /^((?:aae_live)_[a-f0-9]{16})_([A-Za-z0-9_-]{43})$/.exec(token.trim());
    if (!match) return null;

    const serviceClient = getServiceRoleClient();
    if (!serviceClient) return null;

    const keyPrefix = match[1];
    const candidateHash = createHash("sha256").update(token.trim(), "utf8").digest();
    const result = await serviceClient
        .from("intg_api_keys")
        .select("id,organization_id,hub_id,key_hash,api_version,expires_at")
        .eq("key_prefix", keyPrefix)
        .eq("status", "active")
        .limit(5);

    if (result.error || !result.data?.length) return null;

    for (const row of result.data) {
        const storedHash = typeof row.key_hash === "string" ? row.key_hash : "";
        if (!/^[a-f0-9]{64}$/i.test(storedHash)) continue;
        const storedDigest = Buffer.from(storedHash, "hex");
        if (storedDigest.length !== candidateHash.length || !timingSafeEqual(storedDigest, candidateHash)) {
            continue;
        }

        if (row.expires_at) {
            const expiresAt = Date.parse(row.expires_at);
            if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) return null;
        }

        await serviceClient
            .from("intg_api_keys")
            .update({ last_used_at: new Date().toISOString() })
            .eq("id", row.id)
            .eq("organization_id", row.organization_id)
            .eq("status", "active");

        return {
            apiKeyId: row.id,
            organizationId: row.organization_id,
            integrationHubId: row.hub_id,
            apiVersion: row.api_version,
        };
    }

    return null;
}
