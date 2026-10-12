import { describe, it, expect, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => ({
    profilesGetByAuthUser: vi.fn(),
    profilesUpsert: vi.fn(),
    membershipsGetByUser: vi.fn(),
    membershipsListByOrganization: vi.fn(),
    membershipsEnsure: vi.fn(),
    membershipsUpdateRole: vi.fn(),
    organizationsList: vi.fn(),
}));

vi.mock("@/src/modules/database/services/database-service", () => ({
    databaseService: {
        profiles: { getByAuthUser: mocks.profilesGetByAuthUser, upsertForAuthUser: mocks.profilesUpsert },
        memberships: {
            getByUser: mocks.membershipsGetByUser,
            listByOrganization: mocks.membershipsListByOrganization,
            ensureMembership: mocks.membershipsEnsure,
            updateRole: mocks.membershipsUpdateRole,
        },
        organizations: { list: mocks.organizationsList },
    },
}));

vi.mock("@/src/modules/database/lib/platform-founder", () => ({
    isPlatformFounderEmail: () => false,
    hasFounderAdminMembershipRole: () => false,
}));

import { resolveOrganizationContext } from "./organization-context";

const profile = (id: string) => ({ id, auth_user_id: `auth-${id}` });
const membership = (org: string, user: string) => ({ organization_id: org, user_id: user, role_name: "member", is_active: true });

describe("organization context bootstrap", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("reuses an existing membership without attaching anything", async () => {
        mocks.profilesGetByAuthUser.mockResolvedValue(profile("p1"));
        mocks.membershipsGetByUser.mockResolvedValue([membership("org-1", "p1")]);
        const ctx = await resolveOrganizationContext("auth-p1", "member-one@test.dev");
        expect(ctx).toEqual({ profileId: "p1", organizationId: "org-1" });
        expect(mocks.membershipsEnsure).not.toHaveBeenCalled();
    });

    it("bootstraps a first-run user into an empty organization", async () => {
        mocks.profilesGetByAuthUser.mockResolvedValue(profile("p9"));
        mocks.membershipsGetByUser.mockResolvedValue([]);
        mocks.organizationsList.mockResolvedValue([{ id: "org-new" }]);
        mocks.membershipsListByOrganization.mockResolvedValue([]);
        mocks.membershipsEnsure.mockResolvedValue(membership("org-new", "p9"));
        const ctx = await resolveOrganizationContext("auth-p9", "first-run@test.dev");
        expect(ctx).toEqual({ profileId: "p9", organizationId: "org-new" });
        expect(mocks.membershipsEnsure).toHaveBeenCalledWith("org-new", "p9", undefined);
    });

    it("refuses to auto-join a stranger to a populated organization", async () => {
        mocks.profilesGetByAuthUser.mockResolvedValue(profile("px"));
        mocks.membershipsGetByUser.mockResolvedValue([]);
        mocks.organizationsList.mockResolvedValue([{ id: "org-lived" }]);
        mocks.membershipsListByOrganization.mockResolvedValue([membership("org-lived", "someone-else")]);
        const ctx = await resolveOrganizationContext("auth-px", "stranger@test.dev");
        expect(ctx).toBeNull();
        expect(mocks.membershipsEnsure).not.toHaveBeenCalled();
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
