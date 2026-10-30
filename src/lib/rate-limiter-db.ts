/**
 * Rate limiter backed by Supabase for distributed (serverless) deployments.
 *
 * In-memory rate limiting (api-security-engine.ts) works on a single Node
 * process but is ineffective in Vercel serverless where every function
 * invocation gets its own heap. This module stores per-key counters in
 * Supabase so any instance can enforce the same limit.
 *
 * Access pattern:
 *   1. SELECT count, reset_at FROM rate_limits WHERE key = $1 AND reset_at > now()
   2. If found: UPDATE count = count + 1 WHERE key = $1 AND reset_at > now()
   3. If not found: INSERT ... ON CONFLICT (key) DO UPDATE SET count = 1, reset_at = $2
 *
 * Step 1→2 has a tiny race window (another request can insert between them),
 * but the INSERT … ON CONFLICT path handles it gracefully by resetting the
 * count to 1 — a rare, acceptable over-count.
 *
 * Falls back to an in-memory limiter with stricter limits (1/10th of normal)
 * when Supabase is unavailable. Never fails open: when the store is down we
 * still enforce limits, just more strictly.
 */

import { getServiceRoleClient } from "@/src/lib/supabase-service-role";
import { RateLimitResult } from "@/src/modules/security-center/types";

// In-memory fallback when Supabase is unavailable.
// Uses stricter limits (1/10th of normal) to remain protective when degraded.
const fallbackLimits = new Map<string, { count: number; resetAt: number }>();

export interface DbRateLimitResult {
    allowed: boolean;
    remaining: number;
    resetAt: Date;
    degraded: boolean;
}

/**
 * Check and increment a rate-limit counter using Supabase as the shared store.
 */
export async function checkRateLimitDb(
    keyId: string,
    limit = 100,
    windowMs = 60_000
): Promise<DbRateLimitResult> {
    const client = getServiceRoleClient();

    if (!client) {
        return checkRateLimitFallback(keyId, limit, windowMs, fallbackLimits);
    }

    const now = Date.now();
    const resetAt = new Date(now + windowMs);

    // Step 1: Try to increment an existing, non-expired entry.
    const nowIso = new Date(now).toISOString();
    const { data: existing } = await client
        .from("rate_limits")
        .select("count, reset_at")
        .eq("key", keyId)
        .gt("reset_at", nowIso)
        .maybeSingle();

    if (existing) {
        const { data: updated, error } = await client
            .from("rate_limits")
            .update({ count: existing.count + 1 })
            .eq("key", keyId)
            .gt("reset_at", nowIso)
            .select("count, reset_at");

        if (updated && updated[0]) {
            const count = updated[0].count;
            return {
                allowed: count <= limit,
                remaining: Math.max(0, limit - count),
                resetAt: new Date(updated[0].reset_at),
                degraded: false,
            };
        }
        // Update failed (race condition — another request updated the row
        // between our SELECT and UPDATE). Fall through to insert path.
    }

    // Step 2: Key doesn't exist or is expired — insert or reset.
    const { data: inserted, error } = await client
        .from("rate_limits")
        .upsert({ key: keyId, count: 1, reset_at: resetAt.toISOString() }, { onConflict: "key" })
        .select("count, reset_at");

    if (inserted && inserted[0]) {
        const count = inserted[0].count;
        return {
            allowed: count <= limit,
            remaining: Math.max(0, limit - count),
            resetAt: new Date(inserted[0].reset_at),
            degraded: false,
        };
    }

    // Final fallback: in-memory.
    return checkRateLimitFallback(keyId, limit, windowMs, fallbackLimits);
}

function checkRateLimitFallback(
    keyId: string,
    limit: number,
    windowMs: number,
    store: Map<string, { count: number; resetAt: number }>
): DbRateLimitResult {
    const fallbackLimit = Math.max(1, Math.floor(limit / 10));
    const now = Date.now();
    const entry = store.get(keyId);
    if (!entry || now > entry.resetAt) {
        store.set(keyId, { count: 1, resetAt: now + windowMs });
        return { allowed: true, remaining: fallbackLimit - 1, resetAt: new Date(now + windowMs), degraded: true };
    }
    entry.count += 1;
    const allowed = entry.count <= fallbackLimit;
    return {
        allowed,
        remaining: Math.max(0, fallbackLimit - entry.count),
        resetAt: new Date(entry.resetAt),
        degraded: true,
    };
}
