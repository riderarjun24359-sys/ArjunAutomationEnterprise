import { databaseService } from "@/src/modules/database/services/database-service";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import type { ClientSuccessAuditEntry } from "../types";

export async function logClientSuccessAudit(
    authUserId: string,
    email: string,
    entry: Omit<ClientSuccessAuditEntry, "id" | "timestamp">,
    fullName?: string | null,
): Promise<ClientSuccessAuditEntry> {
    const auditEntry: ClientSuccessAuditEntry = {
        id: `cs-audit-${Date.now()}`,
        timestamp: new Date().toISOString(),
        ...entry,
    };

    const context = await resolveOrganizationContext(authUserId, email, fullName);
    if (context) {
        try {
            await databaseService.audits.create({
                organization_id: context.organizationId,
                user_id: authUserId,
                action: "create",
                entity_type: "client_success",
                entity_id: entry.clientId,
                metadata: { ...entry.details, auditAction: entry.action },
            });
        } catch {
            /* persist locally if database unavailable */
        }
    }

    return auditEntry;
}

export async function fetchRecentAudits(
    authUserId: string,
    email: string,
    fullName?: string | null,
) {
    const context = await resolveOrganizationContext(authUserId, email, fullName);
    if (!context) return [];
    try {
        const logs = await databaseService.audits.list({
            filters: { organization_id: context.organizationId },
            limit: 50,
        });
        return logs;
    } catch {
        return [];
    }
}

export { databaseService };
