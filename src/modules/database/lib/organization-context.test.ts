import { describe, it, expect, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => ({
    profilesGetByAuthUser: vi.fn(),
    profilesUpsert: vi.fn(),
    membershipsGetByUser: vi.fn(),
    membershipsListByOrganization: vi.fn(),
    membershipsListByOrganizationAnyStatus: vi.fn(),
    membershipsEnsure: vi.fn(),
    membershipsUpdateRole: vi.fn(),
    organizationsList: vi.fn(),
    organizationsGetById: vi.fn(),
}));

vi.mock("@/src/modules/database/services/database-service", () => ({
    databaseService: {
        profiles: { getByAuthUser: mocks.profilesGetByAuthUser, upsertForAuthUser: mocks.profilesUpsert },
        memberships: {
            getByUser: mocks.membershipsGetByUser,
            listByOrganization: mocks.membershipsListByOrganization,
            listByOrganizationAnyStatus: mocks.membershipsListByOrganizationAnyStatus,
            ensureMembership: mocks.membershipsEnsure,
            updateRole: mocks.membershipsUpdateRole,
        },
        organizations: { list: mocks.organizationsList, getById: mocks.organizationsGetById },
    },
}));

vi.mock("@/src/modules/database/lib/platform-founder", () => ({
    isPlatformFounderEmail: () => false,
    hasFounderAdminMembershipRole: () => false,
}));

import { resolveOrganizationContext } from "./organization-context";

const profile = (id: string) => ({ id, auth_user_id: `auth-${id}` });
const membership = (org: string, user: string, active = true) => ({
    organization_id: org,
    user_id: user,
    role_name: "member",
    is_active: active,
});

describe("organization context bootstrap", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.organizationsGetById.mockResolvedValue({ id: "org-1", status: "active" });
    });

    it("reuses an existing membership without attaching anything", async () => {
        mocks.profilesGetByAuthUser.mockResolvedValue(profile("p1"));
        mocks.membershipsGetByUser.mockResolvedValue([membership("org-1", "p1")]);
        const ctx = await resolveOrganizationContext("auth-p1", "member-one@test.dev");
        expect(ctx).toEqual({ profileId: "p1", organizationId: "org-1" });
        expect(mocks.membershipsEnsure).not.toHaveBeenCalled();
    });

    it("rechecks tenant status on the next request instead of reusing stale authorization", async () => {
        mocks.profilesGetByAuthUser.mockResolvedValue(profile("pc"));
        mocks.membershipsGetByUser.mockResolvedValue([membership("org-1", "pc")]);
        mocks.organizationsGetById.mockResolvedValue({ id: "org-1", status: "active" });

        const first = await resolveOrganizationContext("auth-pc", "cache@test.dev");
        expect(first).toEqual({ profileId: "pc", organizationId: "org-1" });

        mocks.organizationsGetById.mockResolvedValue({ id: "org-1", status: "suspended" });
        const second = await resolveOrganizationContext("auth-pc", "cache@test.dev");
        expect(second).toBeNull();
        expect(mocks.organizationsGetById).toHaveBeenCalledTimes(2);
    });

    it("fails closed when the member's organization is suspended", async () => {
        mocks.profilesGetByAuthUser.mockResolvedValue(profile("ps"));
        mocks.membershipsGetByUser.mockResolvedValue([membership("org-suspended", "ps")]);
        mocks.organizationsGetById.mockResolvedValue({ id: "org-suspended", status: "suspended" });

        const ctx = await resolveOrganizationContext("auth-ps", "suspended@test.dev");

        expect(ctx).toBeNull();
        expect(mocks.membershipsEnsure).not.toHaveBeenCalled();
        expect(mocks.membershipsUpdateRole).not.toHaveBeenCalled();
    });

    it("fails closed when a user has multiple active organization memberships", async () => {
        mocks.profilesGetByAuthUser.mockResolvedValue(profile("pm"));
        mocks.membershipsGetByUser.mockResolvedValue([
            membership("org-a", "pm"),
            membership("org-b", "pm"),
        ]);
        const ctx = await resolveOrganizationContext("auth-pm", "multi@test.dev");
        expect(ctx).toBeNull();
        expect(mocks.organizationsList).not.toHaveBeenCalled();
        expect(mocks.membershipsEnsure).not.toHaveBeenCalled();
    });

    it("bootstraps a first-run user into an empty organization", async () => {
        mocks.profilesGetByAuthUser.mockResolvedValue(profile("p9"));
        mocks.membershipsGetByUser.mockResolvedValue([]);
        mocks.organizationsList.mockResolvedValue([{ id: "org-new" }]);
        mocks.membershipsListByOrganizationAnyStatus.mockResolvedValue([]);
        mocks.membershipsEnsure.mockResolvedValue(membership("org-new", "p9"));
        const ctx = await resolveOrganizationContext("auth-p9", "first-run@test.dev");
        expect(ctx).toEqual({ profileId: "p9", organizationId: "org-new" });
        expect(mocks.membershipsEnsure).toHaveBeenCalledWith("org-new", "p9", undefined);
    });

    it("refuses to auto-join a stranger to a populated organization", async () => {
        mocks.profilesGetByAuthUser.mockResolvedValue(profile("px"));
        mocks.membershipsGetByUser.mockResolvedValue([]);
        mocks.organizationsList.mockResolvedValue([{ id: "org-lived" }]);
        mocks.membershipsListByOrganizationAnyStatus.mockResolvedValue([membership("org-lived", "someone-else")]);
        const ctx = await resolveOrganizationContext("auth-px", "stranger@test.dev");
        expect(ctx).toBeNull();
        expect(mocks.membershipsEnsure).not.toHaveBeenCalled();
    });

    it("refuses to adopt an abandoned organization whose members are all inactive", async () => {
        mocks.profilesGetByAuthUser.mockResolvedValue(profile("pa"));
        mocks.membershipsGetByUser.mockResolvedValue([]);
        mocks.organizationsList.mockResolvedValue([{ id: "org-abandoned" }]);
        mocks.membershipsListByOrganizationAnyStatus.mockResolvedValue([
            membership("org-abandoned", "former-member", false),
        ]);
        const ctx = await resolveOrganizationContext("auth-pa", "adopter@test.dev");
        expect(ctx).toBeNull();
        expect(mocks.membershipsEnsure).not.toHaveBeenCalled();
    });

    it("prefers an existing active membership over empty organizations", async () => {
        mocks.profilesGetByAuthUser.mockResolvedValue(profile("p2"));
        mocks.membershipsGetByUser.mockResolvedValue([membership("org-2", "p2")]);
        mocks.organizationsList.mockResolvedValue([{ id: "org-empty" }]);
        const ctx = await resolveOrganizationContext("auth-p2", "two@test.dev");
        expect(ctx).toEqual({ profileId: "p2", organizationId: "org-2" });
        expect(mocks.membershipsListByOrganizationAnyStatus).not.toHaveBeenCalled();
    });

    it("resolves to null when no organization exists at all", async () => {
        mocks.profilesGetByAuthUser.mockResolvedValue(profile("py"));
        mocks.membershipsGetByUser.mockResolvedValue([]);
        mocks.organizationsList.mockResolvedValue([]);
        const ctx = await resolveOrganizationContext("auth-py", "nobody@test.dev");
        expect(ctx).toBeNull();
        expect(mocks.membershipsEnsure).not.toHaveBeenCalled();
    });

    it("resolves to null when no profile can be established", async () => {
        mocks.profilesGetByAuthUser.mockResolvedValue(null);
        mocks.profilesUpsert.mockResolvedValue(null);
        const ctx = await resolveOrganizationContext("auth-pz", "ghost@test.dev");
        expect(ctx).toBeNull();
    });
});
