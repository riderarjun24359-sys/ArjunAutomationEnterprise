import { aiFoundationService } from "../services/ai-foundation.service";

export function createAiFoundationClient() {
    return {
        getMemories: aiFoundationService.getMemories.bind(aiFoundationService),
        storeMemory: aiFoundationService.storeMemory.bind(aiFoundationService),
        searchMemories: aiFoundationService.searchMemories.bind(aiFoundationService),
        getKnowledgeNodes: aiFoundationService.getKnowledgeNodes.bind(aiFoundationService),
        getKnowledgeEdges: aiFoundationService.getKnowledgeEdges.bind(aiFoundationService),
        getRelatedNodes: aiFoundationService.getRelatedNodes.bind(aiFoundationService),
        getPrompts: aiFoundationService.getPrompts.bind(aiFoundationService),
        testPrompt: aiFoundationService.testPrompt.bind(aiFoundationService),
        approvePrompt: aiFoundationService.approvePrompt.bind(aiFoundationService),
        rollbackPrompt: aiFoundationService.rollbackPrompt.bind(aiFoundationService),
        trackPromptUsage: aiFoundationService.trackPromptUsage.bind(aiFoundationService),
        getAgents: aiFoundationService.getAgents.bind(aiFoundationService),
        registerAgent: aiFoundationService.registerAgent.bind(aiFoundationService),
        selectAgent: aiFoundationService.selectAgent.bind(aiFoundationService),
        routeAiRequest: aiFoundationService.routeAiRequest.bind(aiFoundationService),
        getWorkflows: aiFoundationService.getWorkflows.bind(aiFoundationService),
        executeWorkflow: aiFoundationService.executeWorkflow.bind(aiFoundationService),
        getEvaluationMetrics: aiFoundationService.getEvaluationMetrics.bind(aiFoundationService),
        getOverallQualityScore: aiFoundationService.getOverallQualityScore.bind(aiFoundationService),
        getGovernancePolicies: aiFoundationService.getGovernancePolicies.bind(aiFoundationService),
        enforcePolicy: aiFoundationService.enforcePolicy.bind(aiFoundationService),
        getApprovedModels: aiFoundationService.getApprovedModels.bind(aiFoundationService),
        getCostUsageRecords: aiFoundationService.getCostUsageRecords.bind(aiFoundationService),
        getOptimizationRecommendations: aiFoundationService.getOptimizationRecommendations.bind(aiFoundationService),
        getFeedbackQueue: aiFoundationService.getFeedbackQueue.bind(aiFoundationService),
        captureFeedback: aiFoundationService.captureFeedback.bind(aiFoundationService),
        getHumanReviewQueue: aiFoundationService.getHumanReviewQueue.bind(aiFoundationService),
        getExecutiveDashboard: aiFoundationService.getExecutiveDashboard.bind(aiFoundationService),
        getFullState: aiFoundationService.getFullState.bind(aiFoundationService),
    };
}

export type AiFoundationClient = ReturnType<typeof createAiFoundationClient>;
