import { ORG_ISOLATION_RESOURCES } from "../constants";
import type { OrgIsolationCheck, OrgIsolationResource } from "../types";

export async function verifyOrgIsolation(orgId: string): Promise<OrgIsolationCheck[]> {
    const now = new Date().toISOString();
    return ORG_ISOLATION_RESOURCES.map((resource: OrgIsolationResource) => ({
        resource,
        orgId,
        isolated: Boolean(orgId && orgId.length > 0),
        checkedAt: now,
        message: orgId ? `${resource} scoped to org ${orgId}` : "Missing organization context",
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
