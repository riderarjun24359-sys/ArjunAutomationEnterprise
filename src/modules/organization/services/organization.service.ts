import type { OrganizationInvitationSummary, OrganizationMemberSummary, OrganizationSummary, WorkspaceSummary } from "@/src/modules/organization/types";

const mockOrganizations: OrganizationSummary[] = [
    {
        id: "org-1",
        name: "Northstar Labs",
        slug: "northstar-labs",
        status: "active",
        memberCount: 24,
        workspaceCount: 3,
        updatedAt: "2h ago",
    },
    {
        id: "org-2",
        name: "Apex Commerce",
        slug: "apex-commerce",
        status: "inactive",
        memberCount: 9,
        workspaceCount: 1,
        updatedAt: "1d ago",
    },
];

const mockWorkspaces: WorkspaceSummary[] = [
    {
        id: "ws-1",
        organizationId: "org-1",
        name: "Executive Workspace",
        slug: "executive",
        status: "active",
        memberCount: 12,
        updatedAt: "Today",
    },
    {
        id: "ws-2",
        organizationId: "org-1",
        name: "Operations Hub",
        slug: "ops",
        status: "active",
        memberCount: 8,
        updatedAt: "Yesterday",
    },
];

const mockMembers: OrganizationMemberSummary[] = [
    {
        id: "mem-1",
        userId: "user-1",
        fullName: "Ava Chen",
        email: "ava@northstarlabs.com",
        roleName: "admin",
        isActive: true,
        joinedAt: "2025-01-14",
    },
    {
        id: "mem-2",
        userId: "user-2",
        fullName: "Nico Alvarez",
        email: "nico@northstarlabs.com",
        roleName: "manager",
        isActive: true,
        joinedAt: "2025-02-19",
    },
];

const mockInvitations: OrganizationInvitationSummary[] = [
    {
        id: "inv-1",
        email: "maya@northstarlabs.com",
        roleName: "member",
        status: "pending",
        expiresAt: "2026-08-10",
    },
    {
        id: "inv-2",
        email: "leo@northstarlabs.com",
        roleName: "viewer",
        status: "accepted",
        expiresAt: "2026-07-31",
    },
];

export class OrganizationService {
    async getOrganizations(): Promise<OrganizationSummary[]> {
        return mockOrganizations;
    }

    async getWorkspaces(organizationId: string): Promise<WorkspaceSummary[]> {
        return mockWorkspaces.filter((workspace) => workspace.organizationId === organizationId);
    }

    async getMembers(): Promise<OrganizationMemberSummary[]> {
        return mockMembers;
    }

    async getInvitations(): Promise<OrganizationInvitationSummary[]> {
        return mockInvitations;
    }
}

export const organizationService = new OrganizationService();
