import { EXECUTIVE_AGENTS, type ExecutiveAgentKey } from "../constants";
import type { AgentRecommendation, ExecutiveAgentSnapshot, SharedKnowledgeSnapshot } from "../types";
import { generateAnalyticsRecommendations } from "./agents/analytics-ai";
import { generateCeoRecommendations } from "./agents/ceo-ai";
import { generateCfoRecommendations } from "./agents/cfo-ai";
import { generateCmoRecommendations } from "./agents/cmo-ai";
import { generateCooRecommendations } from "./agents/coo-ai";
import { generateCsoRecommendations } from "./agents/cso-ai";
import { generateCtoRecommendations } from "./agents/cto-ai";
import { generateCustomerSuccessRecommendations } from "./agents/customer-success-ai";
import { generateSecurityRecommendations } from "./agents/security-ai";

type AgentGenerator = (knowledge: SharedKnowledgeSnapshot) => AgentRecommendation[];

const agentGenerators: Record<ExecutiveAgentKey, AgentGenerator> = {
    ceo: generateCeoRecommendations,
    cto: generateCtoRecommendations,
    coo: generateCooRecommendations,
    cfo: generateCfoRecommendations,
    cmo: generateCmoRecommendations,
    cso: generateCsoRecommendations,
    customerSuccess: generateCustomerSuccessRecommendations,
    security: generateSecurityRecommendations,
    analytics: generateAnalyticsRecommendations,
};

export function generateAllAgentRecommendations(knowledge: SharedKnowledgeSnapshot): AgentRecommendation[] {
    const all: AgentRecommendation[] = [];
    for (const key of Object.keys(EXECUTIVE_AGENTS) as ExecutiveAgentKey[]) {
        all.push(...agentGenerators[key](knowledge));
    }
    return all;
}

export function routeTaskToAgents(taskType: string): ExecutiveAgentKey[] {
    const lower = taskType.toLowerCase();
    if (/architect|code|debt|sprint|engineering/.test(lower)) return ["cto", "analytics"];
    if (/strategy|priorit|decision|company/.test(lower)) return ["ceo", "analytics"];
    if (/operat|deliver|resource|workflow/.test(lower)) return ["coo", "cto"];
    if (/revenue|cost|profit|cash|pric/.test(lower)) return ["cfo", "analytics"];
    if (/market|campaign|seo|content|lead/.test(lower)) return ["cmo", "cso"];
    if (/sales|pipeline|proposal|opportun/.test(lower)) return ["cso", "cmo"];
    if (/customer|renewal|satisf/.test(lower)) return ["customerSuccess", "cso"];
    if (/security|vulner|compliance|incident/.test(lower)) return ["security", "cto"];
    if (/kpi|trend|forecast|report/.test(lower)) return ["analytics", "ceo"];
    return ["ceo", "analytics"];
}

export function buildAgentSnapshots(recommendations: AgentRecommendation[]): ExecutiveAgentSnapshot[] {
    return (Object.keys(EXECUTIVE_AGENTS) as ExecutiveAgentKey[]).map((key) => {
        const agentRecs = recommendations.filter((r) => r.agentKey === key);
        const pending = agentRecs.filter((r) => r.status === "pending").length;
        return {
            key,
            label: EXECUTIVE_AGENTS[key].label,
            role: EXECUTIVE_AGENTS[key].role,
            version: EXECUTIVE_AGENTS[key].version,
            status: pending > 2 ? "processing" : pending > 0 ? "active" : "idle",
            healthScore: agentRecs.length ? Math.round((agentRecs.reduce((s, r) => s + r.confidence, 0) / agentRecs.length) * 100) : 85,
            activeTasks: 0,
            pendingRecommendations: pending,
            lastActivity: new Date().toISOString(),
            confidence: agentRecs.length ? Math.round((agentRecs.reduce((s, r) => s + r.confidence, 0) / agentRecs.length) * 100) : 85,
        };
    });
}

export { EXECUTIVE_AGENTS };
