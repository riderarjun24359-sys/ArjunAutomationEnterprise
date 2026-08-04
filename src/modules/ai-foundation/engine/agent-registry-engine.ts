import type { AiAgent } from "../types";

const AGENTS: AiAgent[] = [
    { id: "agent-ba", name: "Business Analyst", capabilities: ["requirements", "analysis"], permissions: ["read:projects", "write:documents"], health: "healthy", version: "2.0", owner: "platform", status: "active" },
    { id: "agent-sa", name: "Solution Architect", capabilities: ["architecture", "design"], permissions: ["read:all", "write:designs"], health: "healthy", version: "2.0", owner: "platform", status: "active" },
    { id: "agent-dev", name: "Development Factory", capabilities: ["codegen", "review"], permissions: ["write:code"], health: "degraded", version: "1.8", owner: "platform", status: "active" },
    { id: "agent-qa", name: "QA Engineer", capabilities: ["testing", "validation"], permissions: ["read:code", "write:tests"], health: "healthy", version: "1.5", owner: "platform", status: "active" },
];

export function getAgents(status?: string): AiAgent[] {
    if (status) return AGENTS.filter((a) => a.status === status);
    return AGENTS;
}

export function registerAgent(input: Omit<AiAgent, "id">): AiAgent {
    return { ...input, id: `agent-${Date.now()}` };
}

export function getAgentHealth(id: string): AiAgent["health"] | null {
    return AGENTS.find((a) => a.id === id)?.health ?? null;
}

export function selectAgent(capability: string): AiAgent | null {
    return AGENTS.find((a) => a.capabilities.includes(capability) && a.status === "active") ?? null;
}
