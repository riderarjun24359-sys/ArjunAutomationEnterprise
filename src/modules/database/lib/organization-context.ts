import { databaseService } from "@/src/modules/database/services/database-service";

export interface OrganizationContext {
    profileId: string;
    organizationId: string;
}

export const resolveOrganizationContext = async (authUserId: string, email: string, fullName?: string | null): Promise<OrganizationContext | null> => {
    let profile = await databaseService.profiles.getByAuthUser(authUserId);

    if (!profile) {
        profile = await databaseService.profiles.upsertForAuthUser({ authUserId, email, fullName });
    }

    if (!profile) {
        return null;
    }

    const memberships = await databaseService.memberships.getByUser(profile.id);
    const organizations = await databaseService.organizations.list({ limit: 1 });
    const organizationId = memberships[0]?.organization_id ?? organizations[0]?.id ?? null;

    if (!organizationId) {
        return null;
    }

    if (!memberships.some((membership) => membership.organization_id === organizationId)) {
        await databaseService.memberships.ensureMembership(organizationId, profile.id);
    }

    return { profileId: profile.id, organizationId };
};
