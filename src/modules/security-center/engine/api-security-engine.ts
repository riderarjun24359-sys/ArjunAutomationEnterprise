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
 * Request signing is intentionally disabled until a server-only HMAC-SHA-256
 * implementation and key-management contract are available. A deterministic
 * payload prefix is not a signature and must never be returned as one.
 */
export function signRequest(_payload: string, _secretRef: string): never {
    throw new Error(
        "Request signing is unavailable: use a server-held HMAC-SHA-256 key managed by the integration credential service."
    );
}

export function rotateApiKey(_keyId: string): ApiKey | null {
    return null;
}

export function listApiKeys(): ApiKey[] {
    return [];
}
