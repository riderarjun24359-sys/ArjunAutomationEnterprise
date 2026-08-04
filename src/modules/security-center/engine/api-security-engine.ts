import type { ApiKey, RateLimitResult, SecurityRole } from "../types";

const apiKeys = new Map<string, ApiKey & { hash: string }>();
const rateLimits = new Map<string, { count: number; resetAt: number }>();

export function createApiKey(name: string, role: SecurityRole): ApiKey {
    const id = `key-${Date.now()}`;
    const prefix = `aa_${id.slice(-8)}`;
    const key: ApiKey & { hash: string } = {
        id,
        name,
        prefix,
        role,
        createdAt: new Date().toISOString(),
        status: "active",
        hash: `hash-${prefix}`,
    };
    apiKeys.set(id, key);
    const { hash, ...publicKey } = key;
    void hash;
    return publicKey;
}

export function validateToken(token: string): { valid: boolean; keyId?: string; role?: SecurityRole } {
    for (const [id, key] of apiKeys) {
        if (key.status === "active" && token.startsWith(key.prefix)) {
            return { valid: true, keyId: id, role: key.role };
        }
    }
    return { valid: false };
}

export function checkRateLimit(keyId: string, limit = 100, windowMs = 60_000): RateLimitResult {
    const now = Date.now();
    const entry = rateLimits.get(keyId);
    if (!entry || now > entry.resetAt) {
        rateLimits.set(keyId, { count: 1, resetAt: now + windowMs });
        return { allowed: true, remaining: limit - 1, resetAt: new Date(now + windowMs).toISOString() };
    }
    entry.count += 1;
    const allowed = entry.count <= limit;
    return {
        allowed,
        remaining: Math.max(0, limit - entry.count),
        resetAt: new Date(entry.resetAt).toISOString(),
    };
}

export function signRequest(payload: string, secretRef: string): string {
    return `sig-${secretRef}-${Buffer.from(payload).toString("base64url").slice(0, 16)}`;
}

export function rotateApiKey(keyId: string): ApiKey | null {
    const existing = apiKeys.get(keyId);
    if (!existing) return null;
    existing.prefix = `aa_${Date.now().toString(36)}`;
    existing.hash = `hash-${existing.prefix}`;
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
