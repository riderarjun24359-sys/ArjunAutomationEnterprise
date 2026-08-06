import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import type { DbBackupRun, DbRolePermissionGrant } from "@/src/modules/database/types/platform";
import type { SecurityCenterRawData } from "../types/raw";

const LIMIT = 500;

export class SecurityCenterOsRepository {
    async loadOrganizationData(
        authUserId: string,
        email: string,
        fullName?: string | null,
    ): Promise<SecurityCenterRawData | null> {
        const context = await resolveOrganizationContext(authUserId, email, fullName);
        if (!context) return null;

        const orgId = context.organizationId;
        const q = { limit: LIMIT, orderBy: "created_at" as const, orderDirection: "desc" as const };

        const [
            roles,
            permissions,
            idpRbacRoles,
            idpPermissionGroups,
            mfaPolicies,
            mfaEnrollments,
            sessionPolicies,
            activeSessions,
            securityAlerts,
            riskEvents,
            identityHealth,
            idpAuditLogs,
            activityLogs,
            apiKeys,
            rateLimits,
            backupConfigs,
            disasterPlans,
            complianceReviews,
            complianceWarnings,
        ] = await Promise.all([
            databaseService.roles.listByOrganization(orgId).catch(() => []),
            databaseService.permissions.listAll().catch(() => []),
            databaseService.idpRbacRoles.listByOrganization(orgId, q).catch(() => []),
            databaseService.idpPermissionGroups.listByOrganization(orgId, q).catch(() => []),
            databaseService.idpMfaPolicies.listByOrganization(orgId, q).catch(() => []),
            databaseService.idpMfaEnrollments.listByOrganization(orgId, q).catch(() => []),
            databaseService.idpSessionPolicies.listByOrganization(orgId, q).catch(() => []),
            databaseService.idpActiveSessions.listByOrganization(orgId, q).catch(() => []),
            databaseService.idpSecurityAlerts.listByOrganization(orgId, q).catch(() => []),
            databaseService.idpRiskEvents.listByOrganization(orgId, q).catch(() => []),
            databaseService.idpIdentityHealth.listByOrganization(orgId, q).catch(() => []),
            databaseService.idpAuditLogs.listByOrganization(orgId, q).catch(() => []),
            databaseService.activityLogs.listByOrganization(orgId, { ...q, limit: 150 }).catch(() => []),
            databaseService.intgApiKeys.listByOrganization(orgId, q).catch(() => []),
            databaseService.intgRateLimits.listByOrganization(orgId, q).catch(() => []),
            databaseService.backupConfigs.listByOrganization(orgId, q).catch(() => []),
            databaseService.ddDisasterRecoveryPlans.listByOrganization(orgId, q).catch(() => []),
            databaseService.elrComplianceReviews.listByOrganization(orgId, q).catch(() => []),
            databaseService.aixComplianceWarnings.listByOrganization(orgId, q).catch(() => []),
        ]);

        const [roleGrants, backupRuns] = await Promise.all([
            this.loadRoleGrants(roles.map((r) => r.id)),
            this.loadBackupRuns(backupConfigs.map((c) => c.id)),
        ]);

        return {
            organizationId: orgId,
            roles,
            permissions,
            roleGrants,
            idpRbacRoles,
            idpPermissionGroups,
            mfaPolicies,
            mfaEnrollments,
            sessionPolicies,
            activeSessions,
            securityAlerts,
            riskEvents,
            identityHealth,
            idpAuditLogs,
            activityLogs,
            apiKeys,
            rateLimits,
            backupConfigs,
            backupRuns,
            disasterPlans,
            complianceReviews,
            complianceWarnings,
            fetchedAt: new Date().toISOString(),
        };
    }

    private async loadRoleGrants(roleIds: string[]): Promise<DbRolePermissionGrant[]> {
        if (roleIds.length === 0) return [];
        const batches = await Promise.all(
            roleIds.slice(0, 50).map((id) => databaseService.rolePermissionGrants.listByRole(id).catch(() => [])),
        );
        return batches.flat();
    }

    private async loadBackupRuns(configIds: string[]): Promise<DbBackupRun[]> {
        if (configIds.length === 0) return [];
        const batches = await Promise.all(
            configIds.slice(0, 50).map((id) => databaseService.backupRuns.listByConfig(id).catch(() => [])),
        );
        return batches.flat();
    }
}

export const securityCenterOsRepository = new SecurityCenterOsRepository();
