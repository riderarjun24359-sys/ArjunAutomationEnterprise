import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const { validateIntegrationApiKey, checkRateLimitDb } = vi.hoisted(() => ({ validateIntegrationApiKey: vi.fn(), checkRateLimitDb: vi.fn() }));

vi.mock("@/src/modules/integration-platform/lib/api-key-auth", () => ({
    validateIntegrationApiKey,
}));
vi.mock("@/src/lib/rate-limiter-db", () => ({ checkRateLimitDb }));

import { GET } from "./route";

const makeRequest = (authorization?: string) => new NextRequest(
    "https://example.test/api/v1/integration/health",
    { headers: authorization ? { authorization } : undefined },
);

describe("GET /api/v1/integration/health", () => {
    beforeEach(() => {
        validateIntegrationApiKey.mockReset();
        checkRateLimitDb.mockReset().mockResolvedValue({
            allowed: true, remaining: 119, resetAt: new Date(Date.now() + 60_000), degraded: false,
        });
    });

    it("rejects missing bearer credentials", async () => {
        const response = await GET(makeRequest());
        expect(response.status).toBe(401);
        expect(response.headers.get("www-authenticate")).toBe("Bearer");
        expect(validateIntegrationApiKey).not.toHaveBeenCalled();
    });

    it("rejects invalid credentials", async () => {
        validateIntegrationApiKey.mockResolvedValue(null);
        const response = await GET(makeRequest("Bearer invalid-token"));
        expect(response.status).toBe(401);
        expect(response.headers.get("cache-control")).toBe("no-store");
    });

    it("rejects credentials without the required read scope", async () => {
        validateIntegrationApiKey.mockResolvedValue({
            apiKeyId: "key-1", organizationId: "org-1", hubId: "hub-1",
            apiVersion: "v1",
            scopes: [{ scopeKey: "integration:health:read", permissions: ["write"] }],
        });
        const response = await GET(makeRequest("Bearer valid-token"));
        expect(response.status).toBe(403);
    });

    it("returns only minimal health metadata for a correctly scoped key", async () => {
        validateIntegrationApiKey.mockResolvedValue({
            apiKeyId: "key-1", organizationId: "org-1", hubId: "hub-1",
            apiVersion: "v2",
            scopes: [{ scopeKey: "integration:health:read", permissions: ["read"] }],
        });
        const response = await GET(makeRequest("Bearer valid-token"));
        expect(response.status).toBe(200);
        expect(response.headers.get("cache-control")).toBe("no-store");
        await expect(response.json()).resolves.toEqual({
            status: "ok", apiVersion: "v2", integrationHubId: "hub-1",
        });
    });

    it("accepts wildcard permission for the exact required scope", async () => {
        validateIntegrationApiKey.mockResolvedValue({
            apiKeyId: "key-1", organizationId: "org-1", hubId: "hub-1",
            apiVersion: "v1",
            scopes: [{ scopeKey: "integration:health:read", permissions: ["*"] }],
        });
        const response = await GET(makeRequest("Bearer valid-token"));
        expect(response.status).toBe(200);
    });
    it("fails closed when distributed rate limiting is degraded", async () => {
        validateIntegrationApiKey.mockResolvedValue({ apiKeyId: "key-1", organizationId: "org-1", hubId: "hub-1", apiVersion: "v1", scopes: [{ scopeKey: "integration:health:read", permissions: ["read"] }] });
        checkRateLimitDb.mockResolvedValue({ allowed: true, remaining: 0, resetAt: new Date(Date.now() + 60_000), degraded: true });
        const response = await GET(makeRequest("Bearer valid-token"));
        expect(response.status).toBe(503);
    });

    it("returns 429 when the per-key rate limit is exceeded", async () => {
        validateIntegrationApiKey.mockResolvedValue({ apiKeyId: "key-1", organizationId: "org-1", hubId: "hub-1", apiVersion: "v1", scopes: [{ scopeKey: "integration:health:read", permissions: ["read"] }] });
        checkRateLimitDb.mockResolvedValue({ allowed: false, remaining: 0, resetAt: new Date(Date.now() + 60_000), degraded: false });
        const response = await GET(makeRequest("Bearer valid-token"));
        expect(response.status).toBe(429);
        expect(response.headers.get("retry-after")).toBeTruthy();
    });

});
