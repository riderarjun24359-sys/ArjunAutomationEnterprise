import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";
import type {
    DeliveryMilestone,
    EscalationRecord,
    FeedbackEntry,
    ImprovementItem,
    OnboardingSession,
    RenewalRecord,
    SuccessPlan,
} from "./types";

export class CustomerSuccessGlobalOpsRepository {
    async listSuccessPlans(orgId: string): Promise<SuccessPlan[]> {
        const client = getRepositoryClient();
        if (!client) return [];
        const { data, error } = await client.from("csg_success_plans").select("*").eq("organization_id", orgId).order("updated_at", { ascending: false });
        mapRepositoryError(error, "listSuccessPlans");
        return (data ?? []).map((r) => ({
            id: r.id,
            clientId: r.client_id,
            title: r.title,
            goals: (r.goals as SuccessPlan["goals"]) ?? [],
            status: r.status,
            healthScore: Number(r.health_score),
            ownerName: r.owner_name ?? "",
        }));
    }

    async upsertSuccessPlan(orgId: string, plan: SuccessPlan): Promise<void> {
        const client = getRepositoryClient();
        if (!client) return;
        const { error } = await client.from("csg_success_plans").upsert({
            id: plan.id,
            organization_id: orgId,
            client_id: plan.clientId,
            title: plan.title,
            goals: plan.goals,
            status: plan.status,
            health_score: plan.healthScore,
            owner_name: plan.ownerName,
            updated_at: new Date().toISOString(),
        });
        mapRepositoryError(error, "upsertSuccessPlan");
    }

    async listOnboardingSessions(orgId: string): Promise<OnboardingSession[]> {
        const client = getRepositoryClient();
        if (!client) return [];
        const { data, error } = await client.from("csg_onboarding_sessions").select("*").eq("organization_id", orgId);
        mapRepositoryError(error, "listOnboardingSessions");
        return (data ?? []).map((r) => {
            const checklist = (r.checklist as Array<{ completed?: boolean }>) ?? [];
            return {
                id: r.id,
                clientName: String(r.client_id ?? "Client"),
                status: r.status,
                checklistComplete: checklist.filter((c) => c.completed).length,
                checklistTotal: checklist.length || 8,
                kickoffAt: r.kickoff_at,
            };
        });
    }

    async listDeliveryMilestones(orgId: string): Promise<DeliveryMilestone[]> {
        const client = getRepositoryClient();
        if (!client) return [];
        const { data, error } = await client.from("csg_delivery_milestones").select("*").eq("organization_id", orgId);
        mapRepositoryError(error, "listDeliveryMilestones");
        return (data ?? []).map((r) => ({
            id: r.id,
            title: r.title,
            stage: r.stage,
            status: r.status,
            riskLevel: r.risk_level,
            requiresClientApproval: Boolean(r.requires_client_approval),
            dueAt: r.due_at,
        }));
    }

    async listFeedback(orgId: string): Promise<FeedbackEntry[]> {
        const client = getRepositoryClient();
        if (!client) return [];
        const { data, error } = await client.from("csg_feedback_responses").select("*").eq("organization_id", orgId).order("created_at", { ascending: false });
        mapRepositoryError(error, "listFeedback");
        return (data ?? []).map((r) => ({
            id: r.id,
            type: r.feedback_type,
            score: r.score != null ? Number(r.score) : null,
            comment: r.comment ?? "",
            status: r.status,
            createdAt: r.created_at,
        }));
    }

    async listEscalations(orgId: string): Promise<EscalationRecord[]> {
        const client = getRepositoryClient();
        if (!client) return [];
        const { data, error } = await client.from("csg_escalations").select("*").eq("organization_id", orgId);
        mapRepositoryError(error, "listEscalations");
        return (data ?? []).map((r) => ({
            id: r.id,
            clientName: String(r.client_id ?? "Client"),
            reason: r.reason,
            severity: r.severity,
            status: r.status,
        }));
    }

    async listRenewals(orgId: string): Promise<RenewalRecord[]> {
        const client = getRepositoryClient();
        if (!client) return [];
        const { data, error } = await client.from("csg_renewals").select("*").eq("organization_id", orgId);
        mapRepositoryError(error, "listRenewals");
        return (data ?? []).map((r) => ({
            id: r.id,
            clientName: String(r.client_id ?? "Client"),
            renewalDate: r.renewal_date,
            amount: Number(r.amount),
            probability: Number(r.probability),
            status: r.status,
        }));
    }

    async listImprovementItems(orgId: string): Promise<ImprovementItem[]> {
        const client = getRepositoryClient();
        if (!client) return [];
        const { data, error } = await client.from("csg_improvement_items").select("*").eq("organization_id", orgId).order("created_at", { ascending: false });
        mapRepositoryError(error, "listImprovementItems");
        return (data ?? []).map((r) => ({
            id: r.id,
            sourceModule: r.source_module,
            title: r.title,
            detail: r.detail ?? "",
            priority: r.priority,
            status: r.status,
        }));
    }

    async insertImprovementItem(orgId: string, item: ImprovementItem): Promise<void> {
        const client = getRepositoryClient();
        if (!client) return;
        const { error } = await client.from("csg_improvement_items").upsert({
            id: item.id,
            organization_id: orgId,
            source_module: item.sourceModule,
            title: item.title,
            detail: item.detail,
            priority: item.priority,
            status: item.status,
        });
        mapRepositoryError(error, "insertImprovementItem");
    }

    async logAudit(orgId: string, action: string, detail: string, moduleKey = "global-ops"): Promise<void> {
        const client = getRepositoryClient();
        if (!client) return;
        const { error } = await client.from("csg_audit_logs").insert({
            organization_id: orgId,
            action,
            detail,
            module_key: moduleKey,
        });
        mapRepositoryError(error, "logAudit");
    }
}

export const csgRepository = new CustomerSuccessGlobalOpsRepository();
