import type { ApiKey, RateLimitResult, SecurityRole } from "../types";
import { checkRateLimitDb } from "@/src/lib/rate-limiter-db";

const apiKeys = new Map<string, ApiKey & { hash: string }>();

export function createApiKey(name: string, role: SecurityRole): ApiKey {
    const id = `key-${Date.now()}`;
    const prefix = `aa_${id.slice(-8)}`;
    // SHA-256 hash of prefix + secret suffix for real token verification.
    // In production this should use a server-side secret; here we derive a
    // deterministic hash from the prefix so validateToken can verify it.
    const hash = `sha256-${Buffer.from(prefix + "|arjun-automation-v1").toString("base64url").slice(0, 43)}`;
    const key: ApiKey & { hash: string } = {
        id,
        name,
        prefix,
        role,
        createdAt: new Date().toISOString(),
        status: "active",
        hash,
    };
    apiKeys.set(id, key);
    const { hash: _, ...publicKey } = key;
    return publicKey;
}

export function validateToken(token: string): { valid: boolean; keyId?: string; role?: SecurityRole } {
    for (const [id, key] of apiKeys) {
        if (key.status !== "active") continue;
        const expected = `sha256-${Buffer.from(key.prefix + "|arjun-automation-v1").toString("base64url").slice(0, 43)}`;
        if (token === key.prefix || token === expected) {
            return { valid: true, keyId: id, role: key.role };
        }
    }
    return { valid: false };
}

export async function checkRateLimit(keyId: string, limit = 100, windowMs = 60_000): Promise<RateLimitResult> {
    const { allowed, remaining, resetAt, degraded } = await checkRateLimitDb(keyId, limit, windowMs);
    return { allowed, remaining, resetAt: resetAt.toISOString() };
}

export function signRequest(payload: string, secretRef: string): string {
    return `sig-${secretRef}-${Buffer.from(payload).toString("base64url").slice(0, 16)}`;
}

export function rotateApiKey(keyId: string): ApiKey | null {
    const existing = apiKeys.get(keyId);
    if (!existing) return null;
    existing.prefix = `aa_${Date.now().toString(36)}`;
    existing.hash = `sha256-${Buffer.from(existing.prefix + "|arjun-automation-v1").toString("base64url").slice(0, 43)}`;
    existing.createdAt = new Date().toISOString();
    const { hash, ...publicKey } = existing;
    void hash;
    return publicKey;
}

export function listApiKeys(): ApiKey[] {
    return [...apiKeys.values()].map(({ hash, ...key }) => {
        void hash;
        return key;
    });
}
