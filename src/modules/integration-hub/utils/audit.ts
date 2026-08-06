import { buildIntgAuditPayload } from "@/src/modules/database/lib/integration-platform-mappers";
import { databaseService } from "@/src/modules/database/services/database-service";

export async function writeIntegrationAuditLog(
    organizationId: string,
    entityType: string,
    action: string,
    summary: string,
    entityId?: string,
): Promise<void> {
    await databaseService.intgAuditLogs.create(
        buildIntgAuditPayload(organizationId, entityType, action, summary, entityId),
    );
}
