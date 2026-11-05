import { afterEach, describe, expect, it, vi } from "vitest";
import { buildContentSecurityPolicy } from "@/src/lib/content-security-policy";

describe("request-scoped Content Security Policy", () => {
    afterEach(() => vi.unstubAllEnvs());

    it("requires a nonce and does not allow inline scripts", () => {
        vi.stubEnv("NODE_ENV", "production");
        const policy = buildContentSecurityPolicy("dGVzdC1ub25jZS1mb3ItdW5pdC10ZXN0");

        expect(policy).toContain("'nonce-dGVzdC1ub25jZS1mb3ItdW5pdC10ZXN0'");
        expect(policy).toContain("'strict-dynamic'");
        expect(policy).not.toContain("script-src 'self' 'unsafe-inline'");
        expect(policy).not.toContain("'unsafe-eval'");
        expect(() => buildContentSecurityPolicy("short")).toThrow(/nonce/);
    });

    it("allows eval only in development for the Next.js refresh runtime", () => {
        vi.stubEnv("NODE_ENV", "development");
        const policy = buildContentSecurityPolicy("dGVzdC1ub25jZS1mb3ItdW5pdC10ZXN0");
        expect(policy).toContain("'unsafe-eval'");
        expect(policy.split(";").find((directive) => directive.trim().startsWith("script-src"))).not.toContain("'unsafe-inline'");
    });
});
