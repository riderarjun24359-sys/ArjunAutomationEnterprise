import { aiOrchestrationService } from "@/src/modules/ai-orchestration/services/ai-orchestration.service";

/** Delegates to ai-orchestration service — no duplicate AI logic. */
export async function getOrchestrationAgents(authUserId: string, email: string, fullName?: string | null) {
    return aiOrchestrationService.getAgents(authUserId, email, fullName);
}

export async function getOrchestrationPrompts(authUserId: string, email: string, fullName?: string | null) {
    return aiOrchestrationService.getPromptTemplates(authUserId, email, fullName);
}

export async function resolveOrchestrationRoute(authUserId: string, email: string, strategy?: string, fullName?: string | null) {
    return aiOrchestrationService.resolveRoute(authUserId, email, strategy, fullName);
}

export async function executeOrchestrationTask(
    authUserId: string,
    email: string,
    input: { taskType: string; agentId?: string; sessionId?: string; moduleSource: string; inputPayload?: Record<string, unknown> },
    fullName?: string | null,
) {
    return aiOrchestrationService.executeTask(authUserId, email, {
        taskType: input.taskType,
        agentId: input.agentId,
        sessionId: input.sessionId,
        moduleSource: input.moduleSource,
        inputPayload: input.inputPayload ?? {},
    }, fullName);
}

export async function getOrchestrationDashboard(authUserId: string, email: string, fullName?: string | null) {
    return aiOrchestrationService.getDashboardStats(authUserId, email, fullName);
}

export { aiOrchestrationService };
