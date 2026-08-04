import { AuditRepository } from "@/src/modules/database/repositories/audit-repository";
import type { AuditAction } from "@/src/modules/database/types/core";
import type { AuditEvent, AuditEventType } from "../types";

const auditRepo = new AuditRepository();

export async function listAuditLogs(organizationId?: string) {
    return auditRepo.list({
        filters: organizationId ? { organization_id: organizationId } : undefined,
        limit: 100,
    });
}

export async function createAuditLog(input: {
    organization_id?: string | null;
    user_id?: string | null;
    entity_type?: string | null;
    entity_id?: string | null;
    action: string;
    metadata?: Record<string, unknown> | null;
}) {
    return auditRepo.create({
        ...input,
        action: input.action as AuditAction,
    });
}

export function mapAuditLogToEvent(
    log: { id: string; action: string; user_id?: string | null; organization_id?: string | null; metadata?: Record<string, unknown> | null; created_at: string },
    type: AuditEventType = "admin_action",
): AuditEvent {
    return {
        id: log.id,
        type,
        actorId: log.user_id,
        organizationId: log.organization_id,
        action: log.action,
        metadata: log.metadata,
        createdAt: log.created_at,
    };
}

export { AuditRepository };
