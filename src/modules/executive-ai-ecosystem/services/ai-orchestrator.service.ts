import { productionLog } from "@/src/lib/production-logger";
import type { ExecutiveAgentKey } from "../../constants";
import { generateAllAgentRecommendations, routeTaskToAgents } from "./agents/executive-agents.registry";
import { buildSharedKnowledge } from "./shared-knowledge.service";
import type {
    AgentRecommendation,
    CollaborationEvent,
    ExecutiveAiContext,
    OrchestratorResult,
    SharedKnowledgeSnapshot,
} from "../types";

function resolveConflicts(recommendations: AgentRecommendation[]): { merged: AgentRecommendation[]; resolved: number } {
    const seen = new Map<string, AgentRecommendation>();
    let resolved = 0;
    for (const rec of recommendations) {
        const key = rec.title.toLowerCase().slice(0, 40);
        const existing = seen.get(key);
        if (existing) {
            if (rec.confidence > existing.confidence) {
                seen.set(key, { ...rec, detail: `${rec.detail} (Merged — higher confidence)` });
            }
            resolved += 1;
        } else {
            seen.set(key, rec);
        }
    }
    return { merged: Array.from(seen.values()), resolved };
}

function buildUnifiedResponse(agents: ExecutiveAgentKey[], recommendations: AgentRecommendation[], knowledge: SharedKnowledgeSnapshot): string {
    const top = recommendations.sort((a, b) => b.confidence - a.confidence).slice(0, 5);
    const lines = [
        `Executive AI Orchestrator — unified response for ${knowledge.organizationName}`,
        ``,
        `Agents consulted: ${agents.map((a) => a.toUpperCase()).join(", ")}`,
        ``,
        `Top recommendations:`,
        ...top.map((r, i) => `${i + 1}. [${r.agentKey.toUpperCase()}] ${r.title} (${Math.round(r.confidence * 100)}% confidence)`),
        ``,
        `Shared intelligence: ${knowledge.executiveIntelligence.unifiedScore}% unified score · ${knowledge.businessPlatform.clients} clients · ${knowledge.deliveryEngine.activeEngagements} active deliveries · ${knowledge.productionReadiness.alerts} production alerts.`,
        ``,
        `Critical actions require human approval before execution.`,
    ];
    return lines.join("\n");
}

export class AiOrchestratorService {
    async orchestrate(ctx: ExecutiveAiContext, taskType: string): Promise<OrchestratorResult & { collaboration: CollaborationEvent[]; knowledge: SharedKnowledgeSnapshot }> {
        productionLog("info", `Orchestrating task: ${taskType}`, "ai-orchestrator", { taskType });

        const knowledge = await buildSharedKnowledge(ctx);
        const routedAgents = routeTaskToAgents(taskType);
        const agentRecs = generateAllAgentRecommendations(knowledge).filter((r) => routedAgents.includes(r.agentKey));
        const { merged, resolved } = resolveConflicts(agentRecs.length ? agentRecs : generateAllAgentRecommendations(knowledge));

        const collaboration: CollaborationEvent[] = [
            { id: `collab-${Date.now()}-1`, eventType: "task_routed", agentKeys: routedAgents.join(","), summary: `Task "${taskType}" routed to ${routedAgents.length} agents`, createdAt: new Date().toISOString() },
        ];
        if (resolved > 0) {
            collaboration.push({ id: `collab-${Date.now()}-2`, eventType: "conflict_resolved", agentKeys: routedAgents.join(","), summary: `Resolved ${resolved} duplicate recommendations`, createdAt: new Date().toISOString() });
        }
        collaboration.push({ id: `collab-${Date.now()}-3`, eventType: "recommendation_merged", agentKeys: "orchestrator", summary: `Merged ${merged.length} executive recommendations`, createdAt: new Date().toISOString() });

        const requiresApproval = merged.some((r) => r.requiresApproval);
        if (requiresApproval) {
            collaboration.push({ id: `collab-${Date.now()}-4`, eventType: "approval_requested", agentKeys: merged.filter((r) => r.requiresApproval).map((r) => r.agentKey).join(","), summary: "Critical actions pending human approval", createdAt: new Date().toISOString() });
        }

        return {
            unifiedResponse: buildUnifiedResponse(routedAgents, merged, knowledge),
            routedAgents,
            mergedRecommendations: merged,
            conflictsResolved: resolved,
            requiresApproval,
            collaboration,
            knowledge,
        };
    }
}

export const aiOrchestratorService = new AiOrchestratorService();
