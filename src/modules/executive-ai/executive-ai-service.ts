import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { productionLog } from "@/src/lib/production-logger";
import { GOVERNANCE_POLICIES, type ExecutiveAgentKey } from "./constants";
import { approveRecommendation as approveRec, buildApprovalQueue, dismissRecommendation as dismissRec } from "./approval-engine/approval-engine.service";
import { computeCompanyHealthScore } from "./analytics/analytics.service";
import { buildSharedKnowledge } from "./executive-memory/executive-memory.service";
import { buildAgentSnapshots, generateAllAgentRecommendations } from "./executive-registry/executive-registry.service";
import { ensureExplainability } from "./governance/governance.service";
import { recordAgentHealth } from "./monitoring/monitoring.service";
import { orchestratorService } from "./orchestrator/orchestrator.service";
import { executiveAiRepository } from "./executive-ai-repository";
import { publishExecutiveAiEvent } from "./executive-ai-events";
import type {
    AgentRecommendation,
    AgentTask,
    ExecutiveAiContext,
    ExecutiveAiDashboard,
} from "./types";

export class ExecutiveAiService {
    private async getOrgId(ctx: ExecutiveAiContext): Promise<string | null> {
        if (ctx.organizationId) return ctx.organizationId;
        const resolved = await resolveOrganizationContext(ctx.authUserId, ctx.email, ctx.fullName);
        return resolved?.organizationId ?? null;
    }

    async getDashboard(ctx: ExecutiveAiContext): Promise<ExecutiveAiDashboard> {
        productionLog("info", "Executive AI dashboard load", "executive-ai");
        publishExecutiveAiEvent({ type: "dashboard_loaded", agentKey: "system" });

        const knowledge = await buildSharedKnowledge(ctx);
        const recommendations = ensureExplainability(generateAllAgentRecommendations(knowledge));
        const orgId = await this.getOrgId(ctx);

        if (orgId) {
            for (const rec of recommendations.slice(0, 5)) {
                void executiveAiRepository.persistRecommendation(orgId, rec);
            }
        }

        const activeTasks: AgentTask[] = [
            { id: "task-1", agentKey: "cto", taskType: "architecture_review", title: "Weekly architecture review", detail: "Review delivery engine and production readiness integration", status: "in_progress", priority: "high", createdAt: new Date().toISOString() },
            { id: "task-2", agentKey: "cso", taskType: "pipeline_forecast", title: "Q pipeline forecast", detail: "Forecast from business platform leads", status: "pending", priority: "medium", createdAt: new Date().toISOString() },
        ];
        if (knowledge.deliveryEngine.activeEngagements > 0) {
            activeTasks.push({ id: "task-3", agentKey: "coo", taskType: "delivery_monitor", title: "Monitor active deliveries", detail: `${knowledge.deliveryEngine.activeEngagements} engagements in playbook`, status: "in_progress", priority: "high", createdAt: new Date().toISOString() });
        }

        const pendingApprovals = buildApprovalQueue(recommendations);
        const orchestration = await orchestratorService.orchestrate(ctx, "executive_daily_brief");

        if (orgId) {
            for (const event of orchestration.collaboration.slice(0, 3)) {
                void executiveAiRepository.logCollaboration(orgId, event);
            }
            void executiveAiRepository.logAudit(orgId, "system", "dashboard_load", "Executive AI dashboard loaded");
        }

        const agents = buildAgentSnapshots(recommendations).map((a) => {
            const tasks = activeTasks.filter((t) => t.agentKey === a.key);
            return { ...a, activeTasks: tasks.filter((t) => t.status === "in_progress" || t.status === "pending").length };
        });

        const { companyHealthScore } = recordAgentHealth(agents);
        const computedHealth = computeCompanyHealthScore(knowledge, recommendations);

        const alerts = recommendations
            .filter((r) => r.confidence >= 0.88 && r.status === "pending")
            .slice(0, 6)
            .map((r) => ({ id: `alert-${r.id}`, agentKey: r.agentKey, title: r.title, severity: r.requiresApproval ? "high" : "medium" }));

        if (knowledge.productionReadiness.alerts > 0) {
            alerts.unshift({ id: "alert-prod", agentKey: "security" as ExecutiveAgentKey, title: `${knowledge.productionReadiness.alerts} production alerts`, severity: "critical" });
        }

        return {
            agents,
            recommendations,
            activeTasks,
            alerts,
            collaborationHistory: orchestration.collaboration,
            pendingApprovals,
            orchestratorStatus: pendingApprovals.length > 0 ? "awaiting_approval" : "ready",
            sharedKnowledge: knowledge,
            companyHealthScore: Math.max(companyHealthScore, computedHealth),
            governancePolicies: GOVERNANCE_POLICIES.map((p) => ({ ...p })),
        };
    }

    async runOrchestration(ctx: ExecutiveAiContext, taskType: string) {
        publishExecutiveAiEvent({ type: "orchestration_started", agentKey: "system", payload: { taskType } });
        const result = await orchestratorService.orchestrate(ctx, taskType);
        publishExecutiveAiEvent({ type: "orchestration_completed", agentKey: "system", payload: { taskType, agents: result.routedAgents.length } });
        return result;
    }

    approveRecommendation(ctx: ExecutiveAiContext, recommendationId: string, recommendations: AgentRecommendation[]): AgentRecommendation[] {
        productionLog("info", `Recommendation approved: ${recommendationId}`, "executive-ai");
        publishExecutiveAiEvent({ type: "recommendation_approved", agentKey: "system", payload: { recommendationId } });
        void this.getOrgId(ctx).then((orgId) => {
            if (orgId) void executiveAiRepository.logAudit(orgId, "system", "approve", recommendationId);
        });
        return approveRec(recommendations, recommendationId);
    }

    dismissRecommendation(ctx: ExecutiveAiContext, recommendationId: string, recommendations: AgentRecommendation[]): AgentRecommendation[] {
        publishExecutiveAiEvent({ type: "recommendation_dismissed", agentKey: "system", payload: { recommendationId } });
        return dismissRec(recommendations, recommendationId);
    }
}

export const executiveAiService = new ExecutiveAiService();
