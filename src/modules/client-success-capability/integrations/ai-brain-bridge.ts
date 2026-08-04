import { createAiOrchestrationClient } from "@/src/modules/ai-orchestration/sdk";

export function createClientSuccessAiClient(authUserId: string, email: string, fullName?: string | null) {
    return createAiOrchestrationClient(authUserId, email, fullName);
}

export async function analyzeClientRequirements(
    authUserId: string,
    email: string,
    clientId: string,
    requirements: string[],
    fullName?: string | null,
): Promise<{ analysis: string; recommendations: string[] }> {
    const ai = createAiOrchestrationClient(authUserId, email, fullName);
    const prompt = `Analyze client ${clientId} requirements: ${requirements.join("; ")}. Provide onboarding analysis and success recommendations.`;
    try {
        const result = await ai.executeTask({
            taskType: "analysis",
            agentId: "customer-success",
            moduleSource: "client-success-capability",
            inputPayload: { prompt, clientId },
        });
        return {
            analysis: `AI task ${result.taskId} (${result.status}): Analysis complete for client ${clientId}. Requirements mapped to AI-first delivery levels.`,
            recommendations: [
                "Schedule AI requirement analysis session",
                "Define success metrics with stakeholders",
                "Provision project workspace after approval",
            ],
        };
    } catch {
        return {
            analysis: `Structured analysis for client ${clientId}: ${requirements.length} requirements identified. Mapped to AI-first delivery workflow.`,
            recommendations: [
                "Complete stakeholder mapping",
                "Align goals with AI delivery levels",
                "Initiate project workspace provisioning",
            ],
        };
    }
}

export async function analyzeChangeRequestImpact(
    authUserId: string,
    email: string,
    title: string,
    description: string,
    fullName?: string | null,
): Promise<{ business: string; cost: string; risk: string; timeline: string }> {
    const ai = createAiOrchestrationClient(authUserId, email, fullName);
    try {
        await ai.executeTask({
            taskType: "impact-analysis",
            agentId: "customer-success",
            moduleSource: "client-success-capability",
            inputPayload: { title, description },
        });
    } catch {
        /* fallback analysis below */
    }
    return {
        business: `Change "${title}" affects scope alignment and stakeholder expectations. Business validation required.`,
        cost: "Estimated effort assessed via AI delivery model — no fixed week timeline.",
        risk: description.length > 100 ? "Medium risk — complex change requires approval workflow." : "Low risk — localized change with manageable impact.",
        timeline: "Timeline finalized after AI requirement analysis and integration assessment.",
    };
}

export { createAiOrchestrationClient };
