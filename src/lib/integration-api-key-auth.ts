import "server-only";

import { createHash, timingSafeEqual } from "node:crypto";
import { getServiceRoleClient } from "@/src/lib/supabase-service-role";

export interface VerifiedIntegrationApiKey {
    id: string;
    organizationId: string;
    hubId: string;
    apiVersion: string;
}

/**
 * Validate an integration API key against its stored SHA-256 digest.
 * The tenant is derived from the matching database row, never from request input.
 */
export async function verifyIntegrationApiKey(presentedKey: string): Promise<VerifiedIntegrationApiKey | null> {
    if (!/^aae_live_[a-f0-9]{24}\.[A-Za-z0-9_-]{43}$/.test(presentedKey)) return null;

    const separator = presentedKey.indexOf(".");
    const prefix = presentedKey.slice(0, separator);
    const client = getServiceRoleClient();
    if (!client) return null;

    const { data, error } = await client
        .from("intg_api_keys")
        .select("id,organization_id,hub_id,key_hash,api_version,status,expires_at")
        .eq("key_prefix", prefix)
        .maybeSingle();

    if (error || !data || data.status !== "active") return null;
    if (data.expires_at && Date.parse(data.expires_at) <= Date.now()) return null;

    const expected = Buffer.from(data.key_hash, "hex");
    const actual = createHash("sha256").update(presentedKey, "utf8").digest();
    if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;

    const { error: touchError } = await client
        .from("intg_api_keys")
        .update({ last_used_at: new Date().toISOString() })
        .eq("id", data.id)
        .eq("organization_id", data.organization_id)
        .eq("status", "active");
    if (touchError) return null;

    return {
        id: data.id,
        organizationId: data.organization_id,
        hubId: data.hub_id,
        apiVersion: data.api_version,
    };
}
