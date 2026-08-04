import type {
    AiAgent,
    AiFoundationState,
    AiWorkflow,
    CostUsageRecord,
    EvaluationMetric,
    ExecutiveDashboardStats,
    GovernancePolicy,
    KnowledgeEdge,
    KnowledgeNode,
    LearningFeedback,
    MemoryRecord,
    PromptTemplate,
} from "../types";
import * as aiMemoryEngine from "../engine/ai-memory-engine";
import * as knowledgeGraphEngine from "../engine/knowledge-graph-engine";
import * as promptManagementEngine from "../engine/prompt-management-engine";
import * as agentRegistryEngine from "../engine/agent-registry-engine";
import * as aiWorkflowEngine from "../engine/ai-workflow-engine";
import * as evaluationCenterEngine from "../engine/evaluation-center-engine";
import * as aiGovernanceEngine from "../engine/ai-governance-engine";
import * as costUsageEngine from "../engine/cost-usage-engine";
import * as learningPipelineEngine from "../engine/learning-pipeline-engine";
import * as executiveDashboardEngine from "../engine/executive-dashboard-engine";
import {
    publishAgentSelectedEvent,
    publishAiRoutingEvent,
    publishAiWorkflowExecutedEvent,
    publishKnowledgeAccessEvent,
    publishMemoryAccessEvent,
    publishPolicyEnforcedEvent,
    routeAiDecision,
} from "../integrations/mission-core-bridge";
import { logAiFoundationAudit } from "../integrations/audit-bridge";

export class AiFoundationService {
    getMemories(type?: string): MemoryRecord[] {
        const memories = aiMemoryEngine.getMemories(type);
        publishMemoryAccessEvent({ action: "read", count: memories.length, type });
        return memories;
    }

    storeMemory(input: { type: MemoryRecord["type"]; key: string; content: string; scope: string }): MemoryRecord {
        const memory = aiMemoryEngine.storeMemory(input);
        publishMemoryAccessEvent({ action: "write", memoryId: memory.id, type: input.type });
        void logAiFoundationAudit({ action: "memory_stored", metadata: { memoryId: memory.id } });
        return memory;
    }

    searchMemories(query: string): MemoryRecord[] {
        return aiMemoryEngine.searchMemories(query);
    }

    getKnowledgeNodes(type?: string): KnowledgeNode[] {
        const nodes = knowledgeGraphEngine.getKnowledgeNodes(type);
        publishKnowledgeAccessEvent({ action: "read_nodes", count: nodes.length });
        return nodes;
    }

    getKnowledgeEdges(nodeId?: string): KnowledgeEdge[] {
        return knowledgeGraphEngine.getKnowledgeEdges(nodeId);
    }

    getRelatedNodes(nodeId: string): KnowledgeNode[] {
        return knowledgeGraphEngine.getRelatedNodes(nodeId);
    }

    getPrompts(status?: string): PromptTemplate[] {
        return promptManagementEngine.getPrompts(status);
    }

    testPrompt(id: string) {
        return promptManagementEngine.testPrompt(id);
    }

    approvePrompt(id: string, approvedBy: string): PromptTemplate | null {
        return promptManagementEngine.approvePrompt(id, approvedBy);
    }

    rollbackPrompt(id: string): PromptTemplate | null {
        return promptManagementEngine.rollbackPrompt(id);
    }

    trackPromptUsage(id: string): void {
        promptManagementEngine.trackPromptUsage(id);
    }

    getAgents(status?: string): AiAgent[] {
        return agentRegistryEngine.getAgents(status);
    }

    registerAgent(input: Omit<AiAgent, "id">): AiAgent {
        return agentRegistryEngine.registerAgent(input);
    }

    selectAgent(capability: string): AiAgent | null {
        const agent = agentRegistryEngine.selectAgent(capability);
        if (agent) {
            publishAgentSelectedEvent({ agentId: agent.id, capability });
            publishAiRoutingEvent({ capability, agentId: agent.id });
        }
        return agent;
    }

    routeAiRequest(capability: string, task: string) {
        return routeAiDecision({ capability, task });
    }

    getWorkflows(): AiWorkflow[] {
        return aiWorkflowEngine.getWorkflows();
    }

    executeWorkflow(id: string, mode?: "sequential" | "parallel" | "conditional"): AiWorkflow | null {
        const wf = aiWorkflowEngine.executeWorkflow(id, mode);
        if (wf) publishAiWorkflowExecutedEvent({ workflowId: id, mode: wf.mode, status: wf.status });
        return wf;
    }

    getEvaluationMetrics(): EvaluationMetric[] {
        return evaluationCenterEngine.getEvaluationMetrics();
    }

    getOverallQualityScore(): number {
        return evaluationCenterEngine.getOverallQualityScore();
    }

    getGovernancePolicies(): GovernancePolicy[] {
        return aiGovernanceEngine.getGovernancePolicies();
    }

    enforcePolicy(model: string, output: string) {
        const result = aiGovernanceEngine.enforcePolicy(model, output);
        publishPolicyEnforcedEvent({ model, allowed: result.allowed, riskScore: result.riskScore });
        return result;
    }

    getApprovedModels(): string[] {
        return aiGovernanceEngine.getApprovedModels();
    }

    getCostUsageRecords(): CostUsageRecord[] {
        return costUsageEngine.getCostUsageRecords();
    }

    getOptimizationRecommendations(): string[] {
        return costUsageEngine.getOptimizationRecommendations();
    }

    getFeedbackQueue(status?: string): LearningFeedback[] {
        return learningPipelineEngine.getFeedbackQueue(status);
    }

    captureFeedback(input: { source: string; feedback: string; rating: number }): LearningFeedback {
        return learningPipelineEngine.captureFeedback(input);
    }

    getHumanReviewQueue(): LearningFeedback[] {
        return learningPipelineEngine.getHumanReviewQueue();
    }

    getExecutiveDashboard(): ExecutiveDashboardStats {
        return executiveDashboardEngine.getExecutiveDashboard();
    }

    getFullState(): AiFoundationState {
        return {
            memories: this.getMemories(),
            knowledgeNodes: this.getKnowledgeNodes(),
            knowledgeEdges: this.getKnowledgeEdges(),
            prompts: this.getPrompts(),
            agents: this.getAgents(),
            workflows: this.getWorkflows(),
            evaluations: this.getEvaluationMetrics(),
            policies: this.getGovernancePolicies(),
            costUsage: this.getCostUsageRecords(),
            feedback: this.getFeedbackQueue(),
            dashboard: this.getExecutiveDashboard(),
        };
    }
}

export const aiFoundationService = new AiFoundationService();
