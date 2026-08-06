import { databaseService } from "@/src/modules/database/services/database-service";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import type {
    OrganizationInvitationSummary,
    OrganizationMemberSummary,
    OrganizationSummary,
    WorkspaceSummary,
} from "@/src/modules/organization/types";
import type { UserRoleName } from "@/src/modules/database/types/core";

function relativeUpdatedAt(iso: string): string {
    const diffMs = Date.now() - new Date(iso).getTime();
    const minutes = Math.floor(diffMs / 60_000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

function asRoleName(value: string): OrganizationMemberSummary["roleName"] {
    const allowed: UserRoleName[] = ["super_admin", "admin", "manager", "member", "viewer"];
    return (allowed.includes(value as UserRoleName) ? value : "member") as OrganizationMemberSummary["roleName"];
}

function asInviteStatus(value: string): OrganizationInvitationSummary["status"] {
    const allowed = ["pending", "accepted", "expired", "revoked"] as const;
    return (allowed.includes(value as (typeof allowed)[number]) ? value : "pending") as OrganizationInvitationSummary["status"];
}

export class OrganizationService {
    async getOrganizations(authUserId: string, email: string, fullName?: string | null): Promise<OrganizationSummary[]> {
        const context = await resolveOrganizationContext(authUserId, email, fullName);
        if (!context) return [];

        const [org, members, teams] = await Promise.all([
            databaseService.organizations.getById(context.organizationId),
            databaseService.memberships.listByOrganization(context.organizationId).catch(() => []),
            databaseService.teams.listByOrganization(context.organizationId).catch(() => []),
        ]);

        if (!org) return [];

        return [
            {
                id: org.id,
                name: org.name,
                slug: org.slug,
                status: org.status,
                memberCount: members.length,
                workspaceCount: teams.length,
                updatedAt: relativeUpdatedAt(org.updated_at),
            },
        ];
    }

    async getWorkspaces(
        authUserId: string,
        email: string,
        organizationId?: string,
        fullName?: string | null,
    ): Promise<WorkspaceSummary[]> {
        const context = await resolveOrganizationContext(authUserId, email, fullName);
        if (!context) return [];

        const orgId = organizationId && organizationId === context.organizationId ? organizationId : context.organizationId;
        const teams = await databaseService.teams.listByOrganization(orgId).catch(() => []);

        return teams.map((team) => ({
            id: team.id,
            organizationId: team.organization_id,
            name: team.name,
            slug: team.slug,
            status: "active" as const,
            memberCount: 0,
            updatedAt: relativeUpdatedAt(team.updated_at),
        }));
    }

    async getMembers(authUserId: string, email: string, fullName?: string | null): Promise<OrganizationMemberSummary[]> {
        const context = await resolveOrganizationContext(authUserId, email, fullName);
        if (!context) return [];

        const members = await databaseService.memberships.listByOrganization(context.organizationId).catch(() => []);
        const profiles = await Promise.all(
            members.map(async (member) => {
                const profile = await databaseService.profiles.getById(member.user_id).catch(() => null);
                return { member, profile };
            }),
        );

        return profiles.map(({ member, profile }) => ({
            id: member.id,
            userId: member.user_id,
            fullName: profile?.full_name ?? null,
            email: profile?.email ?? "unknown",
            roleName: asRoleName(member.role_name),
            isActive: member.is_active,
            joinedAt: member.created_at.slice(0, 10),
        }));
    }

    async getInvitations(authUserId: string, email: string, fullName?: string | null): Promise<OrganizationInvitationSummary[]> {
        const context = await resolveOrganizationContext(authUserId, email, fullName);
        if (!context) return [];

        const invites = await databaseService.organizationInvitations
            .listByOrganization(context.organizationId, { orderBy: "created_at", orderDirection: "desc", limit: 100 })
            .catch(() => []);

        return invites.map((invite) => ({
            id: invite.id,
            email: invite.email,
            roleName: asRoleName(invite.role_name),
            status: asInviteStatus(invite.status),
            expiresAt: invite.expires_at.slice(0, 10),
        }));
    }
}

export const organizationService = new OrganizationService();
