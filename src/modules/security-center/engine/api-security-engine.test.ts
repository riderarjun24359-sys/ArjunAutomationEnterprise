import { createHmac } from "node:crypto";
import { describe, expect, it, vi } from "vitest";
vi.mock("@/src/lib/rate-limiter-db", () => ({ checkRateLimitDb: vi.fn() }));
import { createApiKey, listApiKeys, rotateApiKey, signRequest, validateToken } from "./api-security-engine";

describe("API security engine", () => {
    it("issues cryptographically random one-time tokens and never exposes digests", () => {
        const first = createApiKey("first", "admin");
        const second = createApiKey("second", "admin");
        expect(first.token).toMatch(/^aa_[a-f0-9]{12}\.[A-Za-z0-9_-]{43}$/);
        expect(second.token).not.toBe(first.token);
        expect(validateToken(first.token)).toMatchObject({ valid: true, keyId: first.id, role: "admin" });
        expect(validateToken(first.prefix)).toEqual({ valid: false });
        expect(listApiKeys().every((key) => !("token" in key) && !("tokenHash" in key))).toBe(true);
    });
    it("rotation invalidates the previous token and returns a new one-time token", () => {
        const created = createApiKey("rotate", "support");
        const rotated = rotateApiKey(created.id);
        expect(rotated?.token).toBeTruthy();
        expect(rotated?.token).not.toBe(created.token);
        expect(validateToken(created.token)).toEqual({ valid: false });
        expect(validateToken(rotated!.token)).toMatchObject({ valid: true, keyId: created.id });
    });
    it("uses HMAC-SHA256 and rejects weak signing secrets", () => {
        const payload = '{"event":"invoice.paid"}';
        const secret = "a".repeat(48);
        const expected = createHmac("sha256", secret).update(payload).digest("hex");
        expect(signRequest(payload, secret)).toBe(`hmac-sha256=${expected}`);
        expect(() => signRequest(payload, "short")).toThrow(/high-entropy/);
    });
    it("rejects malformed tokens", () => {
        expect(validateToken("aa_123456789012")).toEqual({ valid: false });
    });
});
