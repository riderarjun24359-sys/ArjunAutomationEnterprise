import { AuditRepository } from "@/src/modules/database/repositories/audit-repository";
import { getServiceRoleClient } from "@/src/lib/supabase-service-role";

const auditRepo = new AuditRepository();

export async function logApiAudit(input: {
    action: string;
    userId?: string | null;
    organizationId?: string | null;
    metadata?: Record<string, unknown>;
}) {
    // Diagnostics carry the action name only — never email addresses,
    // metadata, or secrets (server logs are retained by the host).
    const safeContext = { action: input.action, organizationId: input.organizationId ?? null };
    try {
        if (typeof window !== "undefined") {
            // Browser callers keep the session-scoped repository path.
            await auditRepo.create({
                user_id: input.userId ?? null,
                organization_id: input.organizationId ?? null,
                entity_type: "api",
                action: input.action as import("@/src/modules/database/types/core").AuditAction,
                metadata: input.metadata ?? null,
            });
            return;
        }
        // Server callers previously received a null repository client, so
        // server-side events (lead_captured, lead_notification_attempt, …)
        // were silently never written. Use the server-only service-role
        // client against the same audit_logs table instead.
        const client = getServiceRoleClient();
        if (!client) {
            console.warn("[api-audit] skipped (service role unconfigured)", safeContext);
            return;
        }
        const { error } = await client.from("audit_logs").insert({
            user_id: input.userId ?? null,
            organization_id: input.organizationId ?? null,
            entity_type: "api",
            action: input.action,
            metadata: input.metadata ?? null,
        });
        if (error) {
            console.warn("[api-audit] insert failed", { ...safeContext, message: error.message });
        }
    } catch {
        console.info("[api-audit] failed", safeContext);
    }
}
