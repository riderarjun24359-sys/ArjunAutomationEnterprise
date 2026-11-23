import { describe, it, expect, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => ({
    validateSession: vi.fn(),
    getServiceRoleClient: vi.fn(),
    checkRateLimit: vi.fn(),
    logApiAudit: vi.fn(),
}));

vi.mock("@/src/services/auth.server", () => ({
    authServerService: {
        validateSession: mocks.validateSession,
        getUser: vi.fn(),
        refreshSessionIfNeeded: vi.fn(),
    },
}));

vi.mock("@/src/lib/supabase-service-role", () => ({
    getServiceRoleClient: mocks.getServiceRoleClient,
}));

vi.mock("@/src/modules/security-center/engine/api-security-engine", () => ({
    checkRateLimit: mocks.checkRateLimit,
}));

vi.mock("@/src/lib/api-audit", () => ({ logApiAudit: mocks.logApiAudit }));

import { secureApiRoute, resolveServerIdentity, getClientIp } from "./api-security";

/** Minimal chainable/thenable stand-in for the Supabase query builder. */
function fakeClient(
    profile: { id: string } | null,
    membership:
        | { organization_id: string; role_name: string }
        | Array<{ organization_id: string; role_name: string }>
        | null,
    organizationStatus = "active",
) {
    return {
        from(table: string) {
            const q = {
                select: () => q,
                eq: () => q,
                order: () => q,
                limit: async () => ({
                    data: table === "organization_members"
                        ? (Array.isArray(membership) ? membership : membership ? [membership] : [])
                        : [],
                    error: null,
                }),
                maybeSingle: async () => ({
                    data: table === "user_profiles" ? profile
                        : table === "organizations" ? { status: organizationStatus }
                        : membership,
                    error: null,
                }),
            };
            return q;
        },
    };
}

const request = { url: "http://localhost/api/example", headers: { get: () => null } } as unknown as Request;

function authenticatedAs(userId = "auth-1") {
    mocks.validateSession.mockResolvedValue({
        valid: true,
        reason: "ok",
        user: { id: userId, email: "u@test.dev", fullName: "U", role: "member", createdAt: "", updatedAt: "" },
        session: { expiresAt: "2030-01-01T00:00:00.000Z" },
    });
}

describe("api-security server-side identity resolution", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.checkRateLimit.mockReturnValue({ allowed: true });
    });

    it("resolves role and organization from the server session identity (not the browser client)", async () => {
        authenticatedAs("auth-1");
        mocks.getServiceRoleClient.mockReturnValue(fakeClient({ id: "prof-1" }, { organization_id: "org-1", role_name: "admin" }));

        const { context, error } = await secureApiRoute(request);
        expect(error).toBeNull();
        expect(context?.organizationId).toBe("org-1");
        expect(context?.user.role).toBe("admin");
        expect(context?.user.id).toBe("auth-1");
    });

    it("allows a valid server API key without a browser Origin header", async () => {
        process.env.TEST_PLATFORM_API_KEY = "test-secret-key";
        const serverRequest = new Request("https://example.test/api/lead", {
            method: "POST",
            headers: { "x-platform-key": "test-secret-key" },
            body: JSON.stringify({ name: "Lead" }),
        });

        const { context, error } = await secureApiRoute(serverRequest, {
            allowPublic: true,
            publicApiKeyEnv: "TEST_PLATFORM_API_KEY",
        });

        expect(error).toBeNull();
        expect(context?.user.id).toBe("platform-lead");
        delete process.env.TEST_PLATFORM_API_KEY;
    });

    it("fails closed to member/no-org when there is no profile", async () => {
        authenticatedAs("auth-2");
        mocks.getServiceRoleClient.mockReturnValue(fakeClient(null, null));

        const identity = await resolveServerIdentity("auth-2");
        expect(identity).toEqual({ role: "member", organizationId: null });
    });

    it("fails closed when multiple memberships exist without an explicit tenant selection", async () => {
        mocks.getServiceRoleClient.mockReturnValue(fakeClient({ id: "prof-multi" }, [
            { organization_id: "org-a", role_name: "admin" },
            { organization_id: "org-b", role_name: "member" },
        ]));

        const identity = await resolveServerIdentity("auth-multi");
        expect(identity).toEqual({ role: "member", organizationId: null });
    });

    it("uses an explicitly requested tenant only when it is in the caller's memberships", async () => {
        mocks.getServiceRoleClient.mockReturnValue(fakeClient({ id: "prof-multi" }, [
            { organization_id: "org-a", role_name: "admin" },
            { organization_id: "org-b", role_name: "member" },
        ]));

        const allowed = await resolveServerIdentity("auth-multi", "org-b");
        expect(allowed).toEqual({ role: "member", organizationId: "org-b" });

        const denied = await resolveServerIdentity("auth-multi", "org-outsider");
        expect(denied).toEqual({ role: "member", organizationId: null });
    });

    it("fails closed when the selected organization is suspended", async () => {
        mocks.getServiceRoleClient.mockReturnValue(fakeClient(
            { id: "prof-suspended" },
            { organization_id: "org-suspended", role_name: "admin" },
            "suspended",
        ));

        const identity = await resolveServerIdentity("auth-suspended");
        expect(identity).toEqual({ role: "member", organizationId: null });
    });

    it("fails closed when the service-role client is unavailable", async () => {
        authenticatedAs("auth-3");
        mocks.getServiceRoleClient.mockReturnValue(null);

        const { context } = await secureApiRoute(request);
        expect(context?.organizationId).toBeNull();
        expect(context?.user.role).toBe("member");
    });

    it("enforces permission gates against the resolved role", async () => {
        authenticatedAs("auth-4");
        mocks.getServiceRoleClient.mockReturnValue(fakeClient({ id: "prof-4" }, { organization_id: "org-4", role_name: "member" }));

        const memberAttempt = await secureApiRoute(request, { permission: "financeManage" });
        expect(memberAttempt.error?.status).toBe(403);

        mocks.getServiceRoleClient.mockReturnValue(fakeClient({ id: "prof-4" }, { organization_id: "org-4", role_name: "admin" }));
        const adminAttempt = await secureApiRoute(request, { permission: "financeManage" });
        expect(adminAttempt.error).toBeNull();
        expect(adminAttempt.context?.user.role).toBe("admin");
    });

    it("ignores an unknown role value and fails closed to member", async () => {
        authenticatedAs("auth-5");
        mocks.getServiceRoleClient.mockReturnValue(fakeClient({ id: "prof-5" }, { organization_id: "org-5", role_name: "root" }));

        const identity = await resolveServerIdentity("auth-5");
        expect(identity.role).toBe("member");
        expect(identity.organizationId).toBe("org-5");
    });

    it("maps the DB `founder`/`owner` roles to admin so the org creator keeps admin gates", async () => {
        authenticatedAs("auth-6");
        mocks.getServiceRoleClient.mockReturnValue(fakeClient({ id: "prof-6" }, { organization_id: "org-6", role_name: "founder" }));

        const identity = await resolveServerIdentity("auth-6");
        expect(identity.role).toBe("admin");
        expect(identity.organizationId).toBe("org-6");
    });
});


describe("getClientIp — trusted proxy precedence", () => {
    it("prefers the Cloudflare client IP over forwarded headers", () => {
        const request = new Request("https://example.test", {
            headers: {
                "cf-connecting-ip": "203.0.113.10",
                "x-real-ip": "198.51.100.20",
                "x-forwarded-for": "192.0.2.30, 192.0.2.40",
            },
        });
        expect(getClientIp(request)).toBe("203.0.113.10");
    });

    it("uses the platform real-IP header before the forwarded chain", () => {
        const request = new Request("https://example.test", {
            headers: {
                "x-real-ip": "198.51.100.20",
                "x-forwarded-for": "192.0.2.30",
            },
        });
        expect(getClientIp(request)).toBe("198.51.100.20");
    });

    it("uses the first non-empty forwarded address only as a last fallback", () => {
        const request = new Request("https://example.test", {
            headers: { "x-forwarded-for": ", 192.0.2.30, 192.0.2.40" },
        });
        expect(getClientIp(request)).toBe("192.0.2.30");
    });
});
