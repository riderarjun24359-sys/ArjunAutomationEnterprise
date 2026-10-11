/**
 * Delivery retry planning (H, pure).
 *
 * Computes the next retry instant for a queued notification from its retry
 * policy (max_retries, backoff_seconds, backoff_multiplier) and current
 * retry_count, with a cap so backoff cannot grow unbounded. Returns null
 * when no further retry is allowed (policy inactive, budget exhausted, or
 * terminal status). Pure — the caller persists and sends nothing.
 */

export interface RetryPolicyInput {
    maxRetries: number;
    backoffSeconds: number;
    backoffMultiplier: number;
    status?: string | null;
}

export type QueueStatus = "pending" | "queued" | "retrying" | "sent" | "delivered" | "failed" | "blocked-opt-out" | string;

const TERMINAL: string[] = ["sent", "delivered", "failed", "blocked-opt-out"];
const MAX_BACKOFF_SECONDS = 24 * 60 * 60;

export function nextRetryAt(
    policy: RetryPolicyInput | null | undefined,
    retryCount: number,
    deliveryStatus: QueueStatus,
    failedAtMs: number = Date.now(),
): number | null {
    if (!policy || (policy.status ?? "active") !== "active") return null;
    if (TERMINAL.includes(deliveryStatus)) return null;
    if (!Number.isFinite(retryCount) || retryCount < 0) return null;
    if (retryCount >= Math.max(0, Math.floor(policy.maxRetries))) return null;
    const base = Math.max(0, policy.backoffSeconds);
    const multiplier = policy.backoffMultiplier > 0 ? policy.backoffMultiplier : 1;
    const delaySeconds = Math.min(MAX_BACKOFF_SECONDS, base * Math.pow(multiplier, retryCount));
    return failedAtMs + Math.round(delaySeconds * 1000);
}
