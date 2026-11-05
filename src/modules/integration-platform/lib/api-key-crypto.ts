import { createHash, timingSafeEqual } from "node:crypto";

const PREFIX_PATTERN = /^aa_[a-f0-9]{12}$/;
const SECRET_PATTERN = /^[A-Za-z0-9_-]{40,60}$/;

export function isWellFormedIntegrationApiKey(token: string): boolean {
    if (typeof token !== "string" || token.length < 48 || token.length > 160) return false;
    const [prefix, secret, extra] = token.split(".");
    return extra === undefined && PREFIX_PATTERN.test(prefix ?? "") && SECRET_PATTERN.test(secret ?? "");
}

export function hashIntegrationApiKey(token: string): string {
    return createHash("sha256").update(token, "utf8").digest("hex");
}

export function matchesIntegrationApiKey(token: string, storedHash: string): boolean {
    if (!isWellFormedIntegrationApiKey(token) || !/^[a-f0-9]{64}$/i.test(storedHash)) return false;
    const candidate = createHash("sha256").update(token, "utf8").digest();
    const expected = Buffer.from(storedHash, "hex");
    return candidate.length === expected.length && timingSafeEqual(candidate, expected);
}
