import { describe, expect, it } from "vitest";
import {
    hashIntegrationApiKey,
    isWellFormedIntegrationApiKey,
    matchesIntegrationApiKey,
} from "@/src/modules/integration-platform/lib/api-key-crypto";

const validToken = "aa_0123456789ab.AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";

describe("integration API key crypto", () => {
    it("accepts the issued token format", () => {
        expect(isWellFormedIntegrationApiKey(validToken)).toBe(true);
    });

    it.each([
        "",
        "not-a-key",
        "aa_0123456789ab.short",
        "aa_0123456789ab.AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA.extra",
        "aa_NOTHEX0123.AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    ])("rejects malformed tokens: %s", (token) => {
        expect(isWellFormedIntegrationApiKey(token)).toBe(false);
    });

    it("verifies a digest generated from the exact token", () => {
        const digest = hashIntegrationApiKey(validToken);
        expect(digest).toMatch(/^[a-f0-9]{64}$/);
        expect(matchesIntegrationApiKey(validToken, digest)).toBe(true);
    });

    it("rejects a token with a different secret", () => {
        const digest = hashIntegrationApiKey(validToken);
        const changed = validToken.slice(0, -1) + "B";
        expect(matchesIntegrationApiKey(changed, digest)).toBe(false);
    });

    it("rejects malformed and non-hex stored digests", () => {
        expect(matchesIntegrationApiKey(validToken, "bad-digest")).toBe(false);
        expect(matchesIntegrationApiKey("bad-token", "0".repeat(64))).toBe(false);
    });
});
