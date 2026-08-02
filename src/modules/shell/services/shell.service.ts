import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import type { ShellContext } from "@/src/modules/shell/types";

export const shellService = {
    async getContext(authUserId: string, email: string, fullName?: string | null): Promise<ShellContext> {
        const context = await resolveOrganizationContext(authUserId, email, fullName);

        if (!context) {
            return {
                profile: null,
                organization: null,
                memberships: [],
                recentActivity: [],
            };
        }

        const profile = await databaseService.profiles.getById(context.profileId);
        const organization = await databaseService.organizations.getById(context.organizationId);
        const memberships = await databaseService.memberships.getByUser(context.profileId);

        const recentActivity = await databaseService.audits.list({
            limit: 8,
            orderBy: "created_at",
            orderDirection: "desc",
            filters: { organization_id: context.organizationId },
        });

        return {
            profile,
            organization,
            memberships,
            recentActivity,
        };
    },
};
