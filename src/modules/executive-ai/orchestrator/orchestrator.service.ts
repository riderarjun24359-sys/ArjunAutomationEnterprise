import { productionLog } from "@/src/lib/production-logger";
import type { ExecutiveAgentKey } from "../constants";
import { buildCollaborationTimeline, buildConsensus } from "../collaboration-engine/collaboration-engine.service";
import { buildSharedKnowledge } from "../executive-memory/executive-memory.service";
import { generateAllAgentRecommendations, routeTaskToAgents } from "../executive-registry/executive-registry.service";
import { ensureExplainability } from "../governance/governance.service";
import { rankRecommendations, resolveConflicts } from "../recommendation-engine/recommendation-engine.service";
import type {
    AgentRecommendation,
    CollaborationEvent,
    ExecutiveAiContext,
    OrchestratorResult,
    SharedKnowledgeSnapshot,
} from "../types";

function buildUnifiedResponse(agents: ExecutiveAgentKey[], recommendations: AgentRecommendation[], knowledge: SharedKnowledgeSnapshot): string {
    const top = rankRecommendations(recommendations).slice(0, 5);
    const lines = [
        `Executive AI Orchestrator — unified response for ${knowledge.organizationName}`,
        ``,
        `Agents consulted: ${agents.map((a) => a.toUpperCase()).join(", ")}`,
        ``,
        `Top recommendations:`,
        ...top.map((r, i) => `${i + 1}. [${r.agentKey.toUpperCase()}] ${r.title} (${Math.round(r.confidence * 100)}% confidence, ${r.votes} votes)`),
        ``,
        `Shared intelligence: ${knowledge.executiveIntelligence.unifiedScore}% unified score · ${knowledge.businessPlatform.clients} clients · ${knowledge.deliveryEngine.activeEngagements} active deliveries · ${knowledge.productionReadiness.alerts} production alerts.`,
        ``,
        `Critical actions require human approval before execution.`,
    ];
    return lines.join("\n");
}

export class OrchestratorService {
    async orchestrate(ctx: ExecutiveAiContext, taskType: string): Promise<OrchestratorResult & { collaboration: CollaborationEvent[]; knowledge: SharedKnowledgeSnapshot }> {
        productionLog("info", `Orchestrating task: ${taskType}`, "executive-ai-orchestrator", { taskType });

        const knowledge = await buildSharedKnowledge(ctx);
        const routedAgents = routeTaskToAgents(taskType);
        const allRecs = ensureExplainability(generateAllAgentRecommendations(knowledge));
        const agentRecs = allRecs.filter((r) => routedAgents.includes(r.agentKey));
        const { merged, resolved } = resolveConflicts(agentRecs.length ? agentRecs : allRecs);
        const { consensus, events: voteEvents } = buildConsensus(merged);
        const requiresApproval = consensus.some((r) => r.requiresApproval);

        const collaboration = [
            ...buildCollaborationTimeline(routedAgents, taskType, resolved, requiresApproval, consensus.length),
            ...voteEvents,
        ];

        return {
            unifiedResponse: buildUnifiedResponse(routedAgents, consensus, knowledge),
            routedAgents,
            mergedRecommendations: consensus,
            conflictsResolved: resolved,
            requiresApproval,
            collaboration,
            knowledge,
        };
    }
}

export const orchestratorService = new OrchestratorService();
