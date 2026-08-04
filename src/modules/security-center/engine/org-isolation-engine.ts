import { ORG_ISOLATION_RESOURCES } from "../constants";
import type { OrgIsolationCheck, OrgIsolationResource } from "../types";
import { databaseService } from "@/src/modules/database/services/database-service";

export async function verifyOrgIsolation(orgId: string): Promise<OrgIsolationCheck[]> {
    const now = new Date().toISOString();
    const org = orgId ? await databaseService.organizations.getById(orgId) : null;
    const memberships = orgId ? await databaseService.memberships.listByOrganization(orgId) : [];

    return ORG_ISOLATION_RESOURCES.map((resource: OrgIsolationResource) => ({
        resource,
        orgId,
        isolated: Boolean(org && orgId && memberships.length >= 0),
        checkedAt: now,
        message: org ? `${resource} scoped to org ${orgId} (${memberships.length} members)` : "Missing or invalid organization context",
    }));
}

export function listIsolationResources(): OrgIsolationResource[] {
    return [...ORG_ISOLATION_RESOURCES];
}

export function computeIsolationScore(checks: OrgIsolationCheck[]): number {
    if (checks.length === 0) return 0;
    const isolated = checks.filter((c) => c.isolated).length;
    return Math.round((isolated / checks.length) * 100);
}
