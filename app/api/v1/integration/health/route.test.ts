import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const validateIntegrationApiKey = vi.fn();

vi.mock("@/src/modules/integration-platform/lib/api-key-auth", () => ({
    validateIntegrationApiKey,
}));

import { GET } from "./route";

const makeRequest = (authorization?: string) => new NextRequest(
    "https://example.test/api/v1/integration/health",
    { headers: authorization ? { authorization } : undefined },
);

describe("GET /api/v1/integration/health", () => {
    beforeEach(() => validateIntegrationApiKey.mockReset());

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
            apiKeyId: "key-1",
            organizationId: "org-1",
            hubId: "hub-1",
            apiVersion: "v1",
            scopes: [{ scopeKey: "integration:health:read", permissions: ["write"] }],
        });
        const response = await GET(makeRequest("Bearer valid-token"));
        expect(response.status).toBe(403);
    });

    it("returns only minimal health metadata for a correctly scoped key", async () => {
        validateIntegrationApiKey.mockResolvedValue({
            apiKeyId: "key-1",
            organizationId: "org-1",
            hubId: "hub-1",
            apiVersion: "v2",
            scopes: [{ scopeKey: "integration:health:read", permissions: ["read"] }],
        });
        const response = await GET(makeRequest("Bearer valid-token"));
        expect(response.status).toBe(200);
        expect(response.headers.get("cache-control")).toBe("no-store");
        await expect(response.json()).resolves.toEqual({
            status: "ok",
            apiVersion: "v2",
            integrationHubId: "hub-1",
        });
    });

    it("accepts wildcard permission for the exact required scope", async () => {
        validateIntegrationApiKey.mockResolvedValue({
            apiKeyId: "key-1",
            organizationId: "org-1",
            hubId: "hub-1",
            apiVersion: "v1",
            scopes: [{ scopeKey: "integration:health:read", permissions: ["*"] }],
        });
        const response = await GET(makeRequest("Bearer valid-token"));
        expect(response.status).toBe(200);
    });
});
