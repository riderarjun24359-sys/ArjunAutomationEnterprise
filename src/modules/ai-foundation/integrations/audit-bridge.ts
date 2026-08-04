import { AuditRepository } from "@/src/modules/database/repositories/audit-repository";
import type { AuditAction } from "@/src/modules/database/types/core";

const auditRepo = new AuditRepository();

export async function logAiFoundationAudit(input: {
    organization_id?: string | null;
    user_id?: string | null;
    action: string;
    metadata?: Record<string, unknown> | null;
}) {
    return auditRepo.create({
        organization_id: input.organization_id,
        user_id: input.user_id,
        entity_type: "ai_foundation",
        action: input.action as AuditAction,
        metadata: input.metadata,
    });
}

export async function listAiFoundationAuditLogs(organizationId?: string) {
    return auditRepo.list({
        filters: organizationId ? { organization_id: organizationId } : undefined,
        limit: 50,
    });
}

export { AuditRepository };
