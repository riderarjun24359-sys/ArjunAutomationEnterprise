import { AuditRepository } from "@/src/modules/database/repositories/audit-repository";

const auditRepo = new AuditRepository();

export async function logApiAudit(input: {
    action: string;
    userId?: string | null;
    organizationId?: string | null;
    metadata?: Record<string, unknown>;
}) {
    try {
        await auditRepo.create({
            user_id: input.userId ?? null,
            organization_id: input.organizationId ?? null,
            entity_type: "api",
            action: input.action as import("@/src/modules/database/types/core").AuditAction,
            metadata: input.metadata ?? null,
        });
    } catch {
        console.info("[api-audit]", input);
    }
}
