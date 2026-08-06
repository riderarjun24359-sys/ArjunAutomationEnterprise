import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";
import type { AgentRecommendation, ApprovalRequest, CollaborationEvent } from "./types";

const TABLE = {
    agents: "executive_agents",
    tasks: "executive_tasks",
    recommendations: "executive_recommendations",
    collaboration: "executive_collaboration",
    approvals: "executive_approvals",
    memory: "executive_memory",
    health: "executive_health",
    audit: "executive_audit_logs",
    metrics: "executive_agent_metrics",
} as const;

export class ExecutiveAiRepository {
    async listRecommendations(orgId: string): Promise<AgentRecommendation[]> {
        const client = getRepositoryClient();
        if (!client) return [];
        const { data, error } = await client
            .from(TABLE.recommendations)
            .select("*")
            .eq("organization_id", orgId)
            .order("created_at", { ascending: false })
            .limit(50);
        mapRepositoryError(error, "listRecommendations");
        if (!data?.length) return [];
        return data.map((row) => ({
            id: row.id,
            agentKey: row.agent_key,
            title: row.title,
            detail: row.detail ?? "",
            explanation: row.explanation ?? "",
            confidence: Number(row.confidence) / 100,
            votes: row.votes ?? 0,
            requiresApproval: row.requires_approval ?? false,
            status: row.status,
            sourceModules: row.source_modules ?? "",
            createdAt: row.created_at,
        }));
    }

    async persistRecommendation(orgId: string, rec: AgentRecommendation): Promise<void> {
        const client = getRepositoryClient();
        if (!client) return;
        const { error } = await client.from(TABLE.recommendations).upsert({
            id: rec.id,
            organization_id: orgId,
            agent_key: rec.agentKey,
            title: rec.title,
            detail: rec.detail,
            explanation: rec.explanation,
            confidence: Math.round(rec.confidence * 100),
            votes: rec.votes,
            requires_approval: rec.requiresApproval,
            status: rec.status,
            source_modules: rec.sourceModules,
        });
        mapRepositoryError(error, "persistRecommendation");
    }

    async logCollaboration(orgId: string, event: CollaborationEvent): Promise<void> {
        const client = getRepositoryClient();
        if (!client) return;
        const { error } = await client.from(TABLE.collaboration).insert({
            organization_id: orgId,
            event_type: event.eventType,
            agent_keys: event.agentKeys,
            summary: event.summary,
        });
        mapRepositoryError(error, "logCollaboration");
    }

    async logAudit(orgId: string, agentKey: string, action: string, detail: string): Promise<void> {
        const client = getRepositoryClient();
        if (!client) return;
        const { error } = await client.from(TABLE.audit).insert({
            organization_id: orgId,
            agent_key: agentKey,
            action,
            detail,
        });
        mapRepositoryError(error, "logAudit");
    }

    async listPendingApprovals(orgId: string): Promise<ApprovalRequest[]> {
        const client = getRepositoryClient();
        if (!client) return [];
        const { data, error } = await client
            .from(TABLE.approvals)
            .select("*")
            .eq("organization_id", orgId)
            .eq("status", "pending")
            .order("created_at", { ascending: false });
        mapRepositoryError(error, "listPendingApprovals");
        if (!data?.length) return [];
        return data.map((row) => ({
            id: row.id,
            agentKey: row.agent_key,
            actionSummary: row.action_summary,
            policyKey: row.policy_key ?? "critical_action",
            status: row.status,
            recommendationId: row.recommendation_id,
            createdAt: row.created_at,
        }));
    }
}

export const executiveAiRepository = new ExecutiveAiRepository();
