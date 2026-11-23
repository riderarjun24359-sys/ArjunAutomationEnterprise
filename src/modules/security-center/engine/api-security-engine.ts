import type { ApiKey, RateLimitResult, SecurityRole } from "../types";
import { checkRateLimitDb } from "@/src/lib/rate-limiter-db";

/**
 * Security Center's legacy API-key engine has no durable, tenant-scoped
 * persistence contract. An in-memory key registry is lost on restart and
 * cannot validate credentials across serverless instances. It must therefore
 * fail closed until it is replaced by the database-backed Integration
 * Platform credential flow.
 *
 * Never issue a key that looks valid but cannot be securely persisted, and
 * never accept a predictable prefix or a locally-derived pseudo-hash.
 */
export function createApiKey(_name: string, _role: SecurityRole): ApiKey {
    throw new Error(
        "API key issuance is temporarily unavailable: durable, organization-scoped key storage is required."
    );
}

export function validateToken(_token: string): { valid: boolean; keyId?: string; role?: SecurityRole } {
    return { valid: false };
}

export async function checkRateLimit(keyId: string, limit = 100, windowMs = 60_000): Promise<RateLimitResult> {
    const { allowed, remaining, resetAt } = await checkRateLimitDb(keyId, limit, windowMs);
    return { allowed, remaining, resetAt: resetAt.toISOString() };
}

/**
 * This legacy helper is not a cryptographic signature implementation.
 * Keep the existing shape for compatibility, but do not treat its output as
 * authentication or integrity proof. Callers must migrate to HMAC-SHA-256
 * with a server-held secret before relying on request signatures.
 */
export function signRequest(payload: string, secretRef: string): string {
    return `sig-${secretRef}-${Buffer.from(payload).toString("base64url").slice(0, 16)}`;
}

export function rotateApiKey(_keyId: string): ApiKey | null {
    return null;
}

export function listApiKeys(): ApiKey[] {
    return [];
}
