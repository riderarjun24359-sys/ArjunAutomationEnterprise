import { describe, it, expect, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => ({
    resolveOrganizationContext: vi.fn(),
    membershipsGetByUser: vi.fn(),
    invitationsCreate: vi.fn(),
}));

vi.mock("@/src/modules/database/lib/organization-context", () => ({
    resolveOrganizationContext: mocks.resolveOrganizationContext,
}));

vi.mock("@/src/modules/database/services/database-service", () => ({
    databaseService: {
        memberships: { getByUser: mocks.membershipsGetByUser },
        organizationInvitations: { create: mocks.invitationsCreate },
    },
}));

import { settingsService } from "./settings.service";

const membership = (role: string) => ({
    id: "m1",
    organization_id: "org-a",
    user_id: "prof-1",
    role_name: role,
    is_active: true,
});

describe("settingsService.createInvitation role gate", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.resolveOrganizationContext.mockResolvedValue({ profileId: "prof-1", organizationId: "org-a" });
        mocks.invitationsCreate.mockImplementation(async (payload: Record<string, unknown>) => ({
            ...payload,
            id: "inv-1",
            created_at: new Date().toISOString(),
        }));
    });

    it("rejects invite escalation from a member targeting admin", async () => {
        mocks.membershipsGetByUser.mockResolvedValue([membership("member")]);
        await expect(
            settingsService.createInvitation("auth-1", "owner@test.dev", { email: "boss@test.dev", roleName: "admin" }),
        ).rejects.toThrow(/Cannot invite/i);
        expect(mocks.invitationsCreate).not.toHaveBeenCalled();
    });

    it("rejects invitations from a viewer", async () => {
        mocks.membershipsGetByUser.mockResolvedValue([membership("viewer")]);
        await expect(
            settingsService.createInvitation("auth-1", "owner@test.dev", { email: "peer@test.dev", roleName: "member" }),
        ).rejects.toThrow(/member role to invite/i);
        expect(mocks.invitationsCreate).not.toHaveBeenCalled();
    });

    it("rejects callers without an active membership in the resolved org", async () => {
        mocks.membershipsGetByUser.mockResolvedValue([]);
        await expect(
            settingsService.createInvitation("auth-1", "owner@test.dev", { email: "peer@test.dev", roleName: "member" }),
        ).rejects.toThrow(/not an active member/i);
        expect(mocks.invitationsCreate).not.toHaveBeenCalled();
    });

    it("allows a founder to invite an admin", async () => {
        mocks.membershipsGetByUser.mockResolvedValue([membership("founder")]);
        const result = await settingsService.createInvitation("auth-1", "owner@test.dev", {
            email: "admin@test.dev",
            roleName: "admin",
        });
        expect(result.roleName).toBe("admin");
        expect(mocks.invitationsCreate).toHaveBeenCalledWith(
            expect.objectContaining({ organization_id: "org-a", invited_by: "prof-1", role_name: "admin" }),
        );
    });

    it("allows a member to invite a peer", async () => {
        mocks.membershipsGetByUser.mockResolvedValue([membership("member")]);
        await settingsService.createInvitation("auth-1", "owner@test.dev", { email: "peer@test.dev", roleName: "member" });
        expect(mocks.invitationsCreate).toHaveBeenCalledTimes(1);
    });
});
