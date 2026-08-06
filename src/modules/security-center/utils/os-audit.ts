import { databaseService } from "@/src/modules/database/services/database-service";

export async function writeSecurityOsAuditLog(
    organizationId: string,
    entityType: string,
    action: string,
    summary: string,
    entityId?: string,
): Promise<void> {
    await databaseService.idpAuditLogs.create({
        organization_id: organizationId,
        entity_type: entityType,
        entity_id: entityId ?? null,
        action,
        summary,
        metadata: { module: "security-center-os" },
        security_level: "standard",
    });
}
