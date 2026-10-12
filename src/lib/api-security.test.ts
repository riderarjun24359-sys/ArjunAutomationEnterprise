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

import { secureApiRoute, resolveServerIdentity } from "./api-security";

/** Minimal chainable/thenable stand-in for the Supabase query builder. */
function fakeClient(profile: { id: string } | null, membership: { organization_id: string; role_name: string } | null) {
    return {
        from(table: string) {
            const q = {
                select: () => q,
                eq: () => q,
                order: () => q,
                limit: async () => ({
                    data: table === "organization_members" ? (membership ? [membership] : []) : [],
                    error: null,
                }),
                maybeSingle: async () => ({
                    data: table === "user_profiles" ? profile : membership,
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

    it("fails closed to member/no-org when there is no profile", async () => {
        authenticatedAs("auth-2");
        mocks.getServiceRoleClient.mockReturnValue(fakeClient(null, null));

        const identity = await resolveServerIdentity("auth-2");
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
