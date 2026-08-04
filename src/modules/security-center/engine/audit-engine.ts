import { AUDIT_EVENT_TYPES } from "../constants";
import type { AuditEvent, AuditEventType } from "../types";
import { createAuditLog, listAuditLogs, mapAuditLogToEvent } from "../integrations/audit-bridge";

export async function logAuditEvent(input: {
    type: AuditEventType;
    action: string;
    organizationId?: string | null;
    actorId?: string | null;
    metadata?: Record<string, unknown> | null;
}): Promise<AuditEvent | null> {
    const log = await createAuditLog({
        action: input.action,
        organization_id: input.organizationId,
        user_id: input.actorId,
        entity_type: input.type,
        metadata: input.metadata,
    });
    if (!log) {
        return {
            id: `local-${Date.now()}`,
            type: input.type,
            action: input.action,
            actorId: input.actorId,
            organizationId: input.organizationId,
            metadata: input.metadata,
            createdAt: new Date().toISOString(),
        };
    }
    return mapAuditLogToEvent(log, input.type);
}

export async function listAuditEventsByType(
    type: AuditEventType,
    organizationId?: string,
): Promise<AuditEvent[]> {
    const logs = await listAuditLogs(organizationId);
    return logs
        .filter((l) => l.entity_type === type || l.action.includes(type))
        .map((l) => mapAuditLogToEvent(l, type));
}

export async function getAuditCenter(organizationId?: string): Promise<AuditEvent[]> {
    const logs = await listAuditLogs(organizationId);
    return logs.map((l) =>
        mapAuditLogToEvent(l, (AUDIT_EVENT_TYPES.includes(l.entity_type as AuditEventType)
            ? l.entity_type
            : "admin_action") as AuditEventType),
    );
}

export function listAuditEventTypes(): AuditEventType[] {
    return [...AUDIT_EVENT_TYPES];
}
