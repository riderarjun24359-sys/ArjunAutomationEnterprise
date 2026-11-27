import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({
    context: null as null | { user: { id: string; email: string; fullName: string | null; role: string }; organizationId: string | null },
    error: null as null | Response,
    tenant: null as null | {
        organizationId: string;
        organizationName: string;
        organizationSlug: string;
        profileId: string;
        roleName: string;
        hostname: string;
    },
}));

vi.mock("@/src/lib/api-security", () => ({
    getClientIp: () => "127.0.0.1",
    secureApiRoute: vi.fn(async () => ({ context: state.context, error: state.error })),
}));

vi.mock("@/src/lib/saas/tenant-resolution", () => ({
    resolveVerifiedTenantContext: vi.fn(async () => state.tenant),
}));

import { GET } from "./route";

describe("GET /api/tenant/context", () => {
    beforeEach(() => {
        state.context = null;
        state.error = new Response("unauthorized", { status: 401 });
        state.tenant = null;
    });

    it("rejects unauthenticated callers", async () => {
        const response = await GET(new Request("https://school.arjunautomations.com/api/tenant/context"));
        expect(response.status).toBe(401);
    });

    it("returns not found when the hostname has no verified tenant membership", async () => {
        state.context = {
            user: { id: "auth-user-1", email: "owner@example.test", fullName: "Owner", role: "member" },
            organizationId: null,
        };
        state.error = null;
        const response = await GET(new Request("https://unknown.arjunautomations.com/api/tenant/context"));
        expect(response.status).toBe(404);
        expect(response.headers.get("Cache-Control")).toBe("no-store");
    });

    it("returns only the authenticated user's verified tenant context", async () => {
        state.context = {
            user: { id: "auth-user-1", email: "owner@example.test", fullName: "Owner", role: "member" },
            organizationId: null,
        };
        state.error = null;
        state.tenant = {
            organizationId: "org-1",
            organizationName: "Example School",
            organizationSlug: "example-school",
            profileId: "profile-1",
            roleName: "founder",
            hostname: "example-school.arjunautomations.com",
        };

        const response = await GET(new Request("https://example-school.arjunautomations.com/api/tenant/context"));
        expect(response.status).toBe(200);
        expect(response.headers.get("Cache-Control")).toBe("no-store");
        await expect(response.json()).resolves.toEqual({
            organization: { id: "org-1", name: "Example School", slug: "example-school" },
            membership: { roleName: "founder" },
            hostname: "example-school.arjunautomations.com",
        });
    });
});
