/**
 * Distributed rate limiter backed by Supabase.
 *
 * The counter is incremented by one SECURITY DEFINER Postgres function so
 * concurrent Vercel invocations cannot lose increments between SELECT/UPDATE.
 * If the database is unavailable, a stricter per-process fallback is used.
 */
import { getServiceRoleClient } from "@/src/lib/supabase-service-role";
import type { RateLimitResult } from "@/src/modules/security-center/types";

const fallbackLimits = new Map<string, { count: number; resetAt: number }>();

export interface DbRateLimitResult {
    allowed: boolean;
    remaining: number;
    resetAt: Date;
    degraded: boolean;
}

export async function checkRateLimitDb(
    keyId: string,
    limit = 100,
    windowMs = 60_000,
): Promise<DbRateLimitResult> {
    const client = getServiceRoleClient();
    if (!client) return checkRateLimitFallback(keyId, limit, windowMs);

    try {
        const { data, error } = await client.rpc("consume_rate_limit", {
            p_key: keyId,
            p_limit: limit,
            p_window_ms: windowMs,
        });
        const row = Array.isArray(data) ? data[0] : data;
        if (error || !row || typeof row.count !== "number" || !row.reset_at) {
            return checkRateLimitFallback(keyId, limit, windowMs);
        }

        return {
            allowed: row.count <= limit,
            remaining: Math.max(0, limit - row.count),
            resetAt: new Date(row.reset_at),
            degraded: false,
        };
    } catch {
        return checkRateLimitFallback(keyId, limit, windowMs);
    }
}

function checkRateLimitFallback(
    keyId: string,
    limit: number,
    windowMs: number,
): DbRateLimitResult {
    const fallbackLimit = Math.max(1, Math.floor(limit / 10));
    const now = Date.now();
    let entry = fallbackLimits.get(keyId);
    if (!entry || now >= entry.resetAt) {
        entry = { count: 0, resetAt: now + windowMs };
        fallbackLimits.set(keyId, entry);
    }
    entry.count += 1;
    return {
        allowed: entry.count <= fallbackLimit,
        remaining: Math.max(0, fallbackLimit - entry.count),
        resetAt: new Date(entry.resetAt),
        degraded: true,
    };
}
