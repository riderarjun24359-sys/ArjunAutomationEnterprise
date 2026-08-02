import { databaseService } from "@/src/modules/database/services/database-service";
import type { ShellContext } from "@/src/modules/shell/types";

export const shellService = {
    async getContext(authUserId: string, email: string, fullName?: string | null): Promise<ShellContext> {
        let profile = await databaseService.profiles.getByAuthUser(authUserId);

        if (!profile) {
            profile = await databaseService.profiles.upsertForAuthUser({
                authUserId,
                email,
                fullName,
            });
        }

        const organizations = await databaseService.organizations.list({ limit: 1 });
        const memberships = profile ? await databaseService.memberships.getByUser(profile.id) : [];
        const organizationId = memberships[0]?.organization_id ?? organizations[0]?.id ?? null;
        const organization = organizationId ? await databaseService.organizations.getById(organizationId) : organizations[0] ?? null;

        const recentActivity = organization
            ? await databaseService.audits.list({
                  limit: 8,
                  orderBy: "created_at",
                  orderDirection: "desc",
                  filters: { organization_id: organization.id },
              })
            : await databaseService.audits.list({ limit: 8, orderBy: "created_at", orderDirection: "desc" });

        return {
            profile,
            organization,
            memberships,
            recentActivity,
        };
    },
};
