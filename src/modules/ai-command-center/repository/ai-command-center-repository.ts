import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";
import type { AccAlert, AccAutomation, AccDecision, AccRecommendation } from "../types";

export class AiCommandCenterRepository {
    async listAlerts(orgId: string): Promise<AccAlert[]> {
        const client = getRepositoryClient();
        if (!client) return [];
        const { data, error } = await client
            .from("acc_alerts")
            .select("*")
            .eq("organization_id", orgId)
            .order("created_at", { ascending: false })
            .limit(50);
        mapRepositoryError(error, "listAlerts");
        return (data ?? []).map((r) => ({
            id: String(r.id),
            severity: r.severity,
            sourceModule: String(r.source_module ?? "system"),
            title: String(r.title),
            detail: String(r.detail ?? ""),
            status: r.status,
            createdAt: String(r.created_at),
        }));
    }

    async persistAlert(orgId: string, alert: AccAlert): Promise<void> {
        const client = getRepositoryClient();
        if (!client) return;
        const { error } = await client.from("acc_alerts").upsert({
            id: alert.id,
            organization_id: orgId,
            severity: alert.severity,
            source_module: alert.sourceModule,
            title: alert.title,
            detail: alert.detail,
            status: alert.status,
        });
        mapRepositoryError(error, "persistAlert");
    }

    async listRecommendations(orgId: string): Promise<AccRecommendation[]> {
        const client = getRepositoryClient();
        if (!client) return [];
        const { data, error } = await client
            .from("acc_recommendations")
            .select("*")
            .eq("organization_id", orgId)
            .order("created_at", { ascending: false })
            .limit(50);
        mapRepositoryError(error, "listRecommendations");
        return (data ?? []).map((r) => ({
            id: String(r.id),
            engineKey: r.engine_key,
            title: String(r.title),
            detail: String(r.detail ?? ""),
            confidence: Number(r.confidence) > 1 ? Number(r.confidence) / 100 : Number(r.confidence),
            priority: r.priority,
            status: r.status,
            createdAt: String(r.created_at),
        }));
    }

    async persistRecommendation(orgId: string, rec: AccRecommendation): Promise<void> {
        const client = getRepositoryClient();
        if (!client) return;
        const { error } = await client.from("acc_recommendations").upsert({
            id: rec.id,
            organization_id: orgId,
            engine_key: rec.engineKey,
            title: rec.title,
            detail: rec.detail,
            confidence: Math.round(rec.confidence * 100),
            priority: rec.priority,
            status: rec.status,
            updated_at: new Date().toISOString(),
        });
        mapRepositoryError(error, "persistRecommendation");
    }

    async listDecisions(orgId: string): Promise<AccDecision[]> {
        const client = getRepositoryClient();
        if (!client) return [];
        const { data, error } = await client
            .from("acc_decisions")
            .select("*")
            .eq("organization_id", orgId)
            .order("created_at", { ascending: false })
            .limit(30);
        mapRepositoryError(error, "listDecisions");
        return (data ?? []).map((r) => ({
            id: String(r.id),
            decisionType: String(r.decision_type),
            summary: String(r.summary),
            rationale: String(r.rationale ?? ""),
            confidence: Number(r.confidence) > 1 ? Number(r.confidence) / 100 : Number(r.confidence),
            status: r.status,
            createdAt: String(r.created_at),
        }));
    }

    async persistDecision(orgId: string, decision: AccDecision): Promise<void> {
        const client = getRepositoryClient();
        if (!client) return;
        const { error } = await client.from("acc_decisions").upsert({
            id: decision.id,
            organization_id: orgId,
            decision_type: decision.decisionType,
            summary: decision.summary,
            rationale: decision.rationale,
            confidence: Math.round(decision.confidence * 100),
            status: decision.status,
        });
        mapRepositoryError(error, "persistDecision");
    }

    async listAutomations(orgId: string): Promise<AccAutomation[]> {
        const client = getRepositoryClient();
        if (!client) return [];
        const { data, error } = await client.from("acc_automations").select("*").eq("organization_id", orgId);
        mapRepositoryError(error, "listAutomations");
        return (data ?? []).map((r) => ({
            id: String(r.id),
            automationKey: String(r.automation_key),
            title: String(r.title),
            status: r.status,
            lastRunAt: r.last_run_at ? String(r.last_run_at) : null,
            resultSummary: String(r.result_summary ?? ""),
        }));
    }

    async persistHealthSnapshot(
        orgId: string,
        snapshot: {
            systemHealth: number;
            clientHealth: number;
            supportSla: number;
            deliveryHealth: number;
            agentHealth: number;
            metadata?: Record<string, unknown>;
        },
    ): Promise<void> {
        const client = getRepositoryClient();
        if (!client) return;
        const { error } = await client.from("acc_health_snapshots").insert({
            organization_id: orgId,
            system_health: snapshot.systemHealth,
            client_health: snapshot.clientHealth,
            support_sla: snapshot.supportSla,
            delivery_health: snapshot.deliveryHealth,
            agent_health: snapshot.agentHealth,
            metadata: snapshot.metadata ?? {},
        });
        mapRepositoryError(error, "persistHealthSnapshot");
    }

    async logAudit(orgId: string, action: string, detail: string, metadata: Record<string, unknown> = {}): Promise<void> {
        const client = getRepositoryClient();
        if (!client) return;
        const { error } = await client.from("acc_audit_logs").insert({
            organization_id: orgId,
            action,
            detail,
            metadata,
        });
        mapRepositoryError(error, "logAudit");
    }
}

export const aiCommandCenterRepository = new AiCommandCenterRepository();
