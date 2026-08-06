import { productionLog } from "@/src/lib/production-logger";
import type { ExecutiveAgentSnapshot } from "../types";

export function recordAgentHealth(agents: ExecutiveAgentSnapshot[]): { companyHealthScore: number; agentHealth: Record<string, number> } {
    const agentHealth: Record<string, number> = {};
    for (const agent of agents) {
        agentHealth[agent.key] = agent.healthScore;
    }
    const companyHealthScore = agents.length
        ? Math.round(agents.reduce((s, a) => s + a.healthScore, 0) / agents.length)
        : 0;
    productionLog("info", `Agent health recorded — company score ${companyHealthScore}`, "executive-ai-monitoring");
    return { companyHealthScore, agentHealth };
}

export function trackPerformanceMetric(agentKey: string, metricKey: string, value: number): void {
    productionLog("info", `Metric ${metricKey}=${value} for ${agentKey}`, "executive-ai-monitoring", { agentKey, metricKey, value });
}
