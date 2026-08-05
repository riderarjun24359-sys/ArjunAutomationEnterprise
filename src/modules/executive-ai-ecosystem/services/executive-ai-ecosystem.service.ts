import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { productionLog } from "@/src/lib/production-logger";
import { EXECUTIVE_AGENTS, type ExecutiveAgentKey } from "../constants";
import { aiOrchestratorService } from "./ai-orchestrator.service";
import { generateAllAgentRecommendations } from "./agents/executive-agents.registry";
import { buildSharedKnowledge } from "./shared-knowledge.service";
import type {
    AgentRecommendation,
    AgentTask,
    ApprovalRequest,
    CollaborationEvent,
    ExecutiveAgentSnapshot,
    ExecutiveAiContext,
    ExecutiveAiEcosystemDashboard,
} from "../types";

function buildAgentSnapshots(recommendations: AgentRecommendation[], tasks: AgentTask[]): ExecutiveAgentSnapshot[] {
    return (Object.keys(EXECUTIVE_AGENTS) as ExecutiveAgentKey[]).map((key) => {
        const agentRecs = recommendations.filter((r) => r.agentKey === key);
        const agentTasks = tasks.filter((t) => t.agentKey === key);
        const pending = agentRecs.filter((r) => r.status === "pending").length;
        return {
            key,
            label: EXECUTIVE_AGENTS[key].label,
            role: EXECUTIVE_AGENTS[key].role,
            status: pending > 2 ? "processing" : pending > 0 ? "active" : "idle",
            activeTasks: agentTasks.filter((t) => t.status === "in_progress" || t.status === "pending").length,
            pendingRecommendations: pending,
            lastActivity: new Date().toISOString(),
            confidence: agentRecs.length ? Math.round((agentRecs.reduce((s, r) => s + r.confidence, 0) / agentRecs.length) * 100) : 85,
        };
    });
}

export class ExecutiveAiEcosystemService {
    private async getOrgId(ctx: ExecutiveAiContext): Promise<string | null> {
        if (ctx.organizationId) return ctx.organizationId;
        const resolved = await resolveOrganizationContext(ctx.authUserId, ctx.email, ctx.fullName);
        return resolved?.organizationId ?? null;
    }

    async getDashboard(ctx: ExecutiveAiContext): Promise<ExecutiveAiEcosystemDashboard> {
        productionLog("info", "Executive AI ecosystem dashboard load", "executive-ai-ecosystem");
        const knowledge = await buildSharedKnowledge(ctx);
        const recommendations = generateAllAgentRecommendations(knowledge);

        const activeTasks: AgentTask[] = [
            { id: "task-1", agentKey: "cto", taskType: "architecture_review", title: "Weekly architecture review", detail: "Review delivery engine and production readiness integration", status: "in_progress", priority: "high", createdAt: new Date().toISOString() },
            { id: "task-2", agentKey: "cso", taskType: "pipeline_forecast", title: "Q pipeline forecast", detail: "Forecast from business platform leads", status: "pending", priority: "medium", createdAt: new Date().toISOString() },
        ];

        if (knowledge.deliveryEngine.activeEngagements > 0) {
            activeTasks.push({ id: "task-3", agentKey: "coo", taskType: "delivery_monitor", title: "Monitor active deliveries", detail: `${knowledge.deliveryEngine.activeEngagements} engagements in playbook`, status: "in_progress", priority: "high", createdAt: new Date().toISOString() });
        }

        const pendingApprovals: ApprovalRequest[] = recommendations
            .filter((r) => r.requiresApproval && r.status === "pending")
            .map((r) => ({
                id: `approval-${r.id}`,
                agentKey: r.agentKey,
                actionSummary: r.title,
                status: "pending" as const,
                recommendationId: r.id,
                createdAt: r.createdAt,
            }));

        const orchestration = await aiOrchestratorService.orchestrate(ctx, "executive_daily_brief");

        const alerts = recommendations
            .filter((r) => r.confidence >= 0.88 && r.status === "pending")
            .slice(0, 6)
            .map((r) => ({ id: `alert-${r.id}`, agentKey: r.agentKey, title: r.title, severity: r.requiresApproval ? "high" : "medium" }));

        if (knowledge.productionReadiness.alerts > 0) {
            alerts.unshift({ id: "alert-prod", agentKey: "security", title: `${knowledge.productionReadiness.alerts} production alerts`, severity: "critical" });
        }

        return {
            agents: buildAgentSnapshots(recommendations, activeTasks),
            recommendations,
            activeTasks,
            alerts,
            collaborationHistory: orchestration.collaboration,
            pendingApprovals,
            orchestratorStatus: pendingApprovals.length > 0 ? "awaiting_approval" : "ready",
            sharedKnowledge: knowledge,
        };
    }

    async runOrchestration(ctx: ExecutiveAiContext, taskType: string) {
        return aiOrchestratorService.orchestrate(ctx, taskType);
    }

    approveRecommendation(_ctx: ExecutiveAiContext, recommendationId: string, recommendations: AgentRecommendation[]): AgentRecommendation[] {
        productionLog("info", `Recommendation approved: ${recommendationId}`, "executive-ai-ecosystem");
        return recommendations.map((r) => (r.id === recommendationId ? { ...r, status: "approved" as const } : r));
    }

    dismissRecommendation(_ctx: ExecutiveAiContext, recommendationId: string, recommendations: AgentRecommendation[]): AgentRecommendation[] {
        return recommendations.map((r) => (r.id === recommendationId ? { ...r, status: "dismissed" as const } : r));
    }
}

export const executiveAiEcosystemService = new ExecutiveAiEcosystemService();
