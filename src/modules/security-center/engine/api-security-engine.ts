import { createHash, createHmac, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";
import type { ApiKey, RateLimitResult, SecurityRole } from "../types";
import { checkRateLimitDb } from "@/src/lib/rate-limiter-db";

type StoredApiKey = ApiKey & { tokenHash: string };
export type CreatedApiKey = ApiKey & { token: string };

// This map is a process-local adapter only. Production API-key persistence
// should use the existing organization-scoped integration key repository.
const apiKeys = new Map<string, StoredApiKey>();

function tokenDigest(token: string): Buffer {
    return createHash("sha256").update(token, "utf8").digest();
}

function issueToken(): { prefix: string; token: string; tokenHash: string } {
    const prefix = `aa_${randomBytes(6).toString("hex")}`;
    const token = `${prefix}.${randomBytes(32).toString("base64url")}`;
    return { prefix, token, tokenHash: tokenDigest(token).toString("hex") };
}

function publicKey(key: StoredApiKey): ApiKey {
    const { tokenHash: _tokenHash, ...safe } = key;
    return safe;
}

export function createApiKey(name: string, role: SecurityRole): CreatedApiKey {
    const issued = issueToken();
    const key: StoredApiKey = {
        id: `key-${randomUUID()}`,
        name,
        prefix: issued.prefix,
        role,
        createdAt: new Date().toISOString(),
        status: "active",
        tokenHash: issued.tokenHash,
    };
    apiKeys.set(key.id, key);
    return { ...publicKey(key), token: issued.token };
}

export function validateToken(token: string): { valid: boolean; keyId?: string; role?: SecurityRole } {
    if (typeof token !== "string" || token.length < 40 || token.length > 256) {
        return { valid: false };
    }
    const candidate = tokenDigest(token);
    for (const [id, key] of apiKeys) {
        if (key.status !== "active") continue;
        if (key.expiresAt && Date.parse(key.expiresAt) <= Date.now()) continue;
        const expected = Buffer.from(key.tokenHash, "hex");
        if (expected.length === candidate.length && timingSafeEqual(candidate, expected)) {
            key.lastUsedAt = new Date().toISOString();
            return { valid: true, keyId: id, role: key.role };
        }
    }
    return { valid: false };
}

export async function checkRateLimit(keyId: string, limit = 100, windowMs = 60_000): Promise<RateLimitResult> {
    const { allowed, remaining, resetAt } = await checkRateLimitDb(keyId, limit, windowMs);
    return { allowed, remaining, resetAt: resetAt.toISOString() };
}

/** HMAC-SHA256 request signature. The caller must supply a secret, not a key id. */
export function signRequest(payload: string, secret: string): string {
    if (!secret || secret.length < 32) {
        throw new Error("A high-entropy request-signing secret is required");
    }
    return `hmac-sha256=${createHmac("sha256", secret).update(payload, "utf8").digest("hex")}`;
}

export function rotateApiKey(keyId: string): CreatedApiKey | null {
    const existing = apiKeys.get(keyId);
    if (!existing) return null;
    const issued = issueToken();
    existing.prefix = issued.prefix;
    existing.tokenHash = issued.tokenHash;
    existing.createdAt = new Date().toISOString();
    existing.lastUsedAt = null;
    return { ...publicKey(existing), token: issued.token };
}

export function listApiKeys(): ApiKey[] {
    return [...apiKeys.values()].map(publicKey);
}
