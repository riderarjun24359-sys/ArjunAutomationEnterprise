import { buildHrActivityPayload } from "@/src/modules/database/lib/hr-mappers";
import { databaseService } from "@/src/modules/database/services/database-service";

/** Write an org-scoped HR audit log entry (RLS via organization_id). */
export async function writeHrmsAuditLog(
    organizationId: string,
    entityType: string,
    action: string,
    title: string,
    description: string,
): Promise<void> {
    await databaseService.activityLogs.create(
        buildHrActivityPayload(organizationId, entityType, action, title, description),
    );
}
