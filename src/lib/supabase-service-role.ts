import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase service-role client for narrow, audited server paths
 * (payment webhook idempotency, public lead-intake dedup/insert).
 *
 * SECURITY RULES (non-negotiable):
 * - NEVER import this module from client components or browser code. The
 *   getter throws when `window` is defined.
 * - Returns null (instead of throwing) when Supabase or the service-role key
 *   is unconfigured, so routes degrade to explicit unavailable states.
 * - Never logs, returns, or embeds the key. Status strings must stay generic.
 */

export function isServiceRoleConfigured(env: NodeJS.ProcessEnv = process.env): boolean {
    return Boolean(env.NEXT_PUBLIC_SUPABASE_URL?.trim() && env.SUPABASE_SERVICE_ROLE_KEY?.trim());
}

/** Key-free status string. Safe to log and expose in health responses. */
export function describeServiceRoleStatus(env: NodeJS.ProcessEnv = process.env): string {
    return isServiceRoleConfigured(env) ? "service-role:configured" : "service-role:unconfigured";
}

export function getServiceRoleClient(env: NodeJS.ProcessEnv = process.env): SupabaseClient | null {
    if (typeof window !== "undefined") {
        throw new Error("Service-role client is server-only and must never run in the browser");
    }
    const url = env.NEXT_PUBLIC_SUPABASE_URL?.trim();
    const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY?.trim();
    if (!url || !serviceKey) return null;
    return createClient(url, serviceKey, {
        auth: { persistSession: false, autoRefreshToken: false },
    });
}
