import type { AebAgentRole } from "./constants";

export interface MissionControlBoard {
    objectives: Array<{ id: string; title: string; objective: string; quarter: string; status: string }>;
    activeMissions: Array<{ id: string; title: string; stage: string; status: string; summary: string }>;
    priorities: Array<{ id: string; title: string; level: string; owner: string; dueDate: string; status: string }>;
    progress: Array<{ id: string; title: string; type: string; targetDate: string; status: string }>;
    todayPriorities: number;
    activeMissionCount: number;
}

export interface MultiAgentCoordinatorBoard {
    agents: Array<{
        id: string;
        name: string;
        role: AebAgentRole | "other";
        agentType: string;
        status: string;
        source: "orchestration" | "ai";
    }>;
    byRole: Array<{ role: AebAgentRole; label: string; count: number; active: number }>;
    recentExecutions: Array<{ id: string; taskType: string; status: string; model: string; durationMs: number }>;
    coverageReady: boolean;
}

export interface AiDecisionEngineBoard {
    goalEvaluations: Array<{ id: string; title: string; type: string; confidence: number; status: string }>;
    risks: Array<{ id: string; title: string; level: string; category: string; status: string }>;
    opportunities: Array<{ id: string; title: string; score: number; status: string }>;
    rankedRecommendations: Array<{
        id: string;
        title: string;
        type: string;
        confidence: number;
        status: string;
        rank: number;
    }>;
    recommendationCount: number;
}

export interface TaskPlannerBoard {
    longRunningPlans: Array<{ id: string; name: string; status: string; detail: string }>;
    dependencies: Array<{ id: string; name: string; status: string; detail: string }>;
    schedule: Array<{ id: string; name: string; dueAt: string; status: string }>;
    resourceAllocation: Array<{ id: string; name: string; budgetUsd: number; status: string }>;
    openTasks: number;
}

export interface CrossModuleOrchestratorBoard {
    orchestrations: Array<{ id: string; name: string; modules: string; status: string }>;
    workflows: Array<{ id: string; name: string; trigger: string; status: string }>;
    executions: Array<{ id: string; key: string; status: string; at: string }>;
    rollbacks: Array<{ id: string; key: string; type: string; status: string }>;
    failureCount: number;
    retryCount: number;
}

export interface EnterpriseMemoryBoard {
    sharedContext: Array<{ id: string; title: string; category: string; status: string }>;
    decisions: Array<{ id: string; title: string; type: string; outcome: string; status: string }>;
    historicalEvents: Array<{ id: string; title: string; eventType: string; at: string }>;
    aiNotes: Array<{ id: string; title: string; source: string; status: string }>;
    activityFeed: Array<{ id: string; actor: string; action: string; summary: string; at: string }>;
    memoryEntries: number;
}

export interface ExceptionCenterBoard {
    failedWorkflows: Array<{ id: string; key: string; type: string; message: string; status: string }>;
    revenueRisks: Array<{ id: string; title: string; level: string; status: string }>;
    customerRisks: Array<{ id: string; title: string; level: string; status: string }>;
    securityRisks: Array<{ id: string; title: string; level: string; status: string }>;
    escalations: Array<{ id: string; name: string; severity: string; status: string }>;
    openExceptions: number;
}

export interface FounderApprovalCenterBoard {
    pending: Array<{ id: string; title: string; requiredRole: string; status: string; source: string }>;
    highImpact: Array<{ id: string; title: string; type: string; status: string }>;
    history: Array<{ id: string; title: string; outcome: string; status: string }>;
    auditTrail: Array<{ id: string; action: string; summary: string; at: string; source: string }>;
    pendingCount: number;
}

export interface ExecutiveMissionDashboard {
    companyHealthScore: number | null;
    missionStatus: Array<{ id: string; title: string; status: string; stage: string }>;
    aiActivity: Array<{ id: string; title: string; type: string; status: string }>;
    kpis: Array<{ id: string; name: string; current: number; target: number; unit: string; status: string }>;
    recommendations: Array<{ id: string; title: string; confidence: number; status: string }>;
    operationalHealth: number | null;
    executiveMetricCount: number;
}

export interface AiEnterpriseBrainSnapshot {
    accessGranted: boolean;
    accessDeniedReason: string | null;
    organizationId: string | null;
    fetchedAt: string;
    missionControl: MissionControlBoard;
    multiAgent: MultiAgentCoordinatorBoard;
    decisionEngine: AiDecisionEngineBoard;
    taskPlanner: TaskPlannerBoard;
    orchestrator: CrossModuleOrchestratorBoard;
    memory: EnterpriseMemoryBoard;
    exceptions: ExceptionCenterBoard;
    approvals: FounderApprovalCenterBoard;
    executive: ExecutiveMissionDashboard;
}

export interface AiEnterpriseBrainRawData {
    organizationId: string;
    membershipRole: string | null;
    strategicOkrs: Array<{ id: string; title: string; objective: string; quarter: string; status: string }>;
    companyContexts: Array<{
        id: string;
        title: string;
        pipeline_stage: string;
        status: string;
        summary: string;
    }>;
    foPriorities: Array<{
        id: string;
        title: string;
        priority_level: string;
        owner: string;
        due_date: string | null;
        status: string;
    }>;
    milestones: Array<{
        id: string;
        title: string;
        milestone_type: string;
        target_date: string | null;
        status: string;
    }>;
    todayPriorities: Array<{ id: string; priority_title: string; priority_rank: number; status: string }>;
    orchestrationAgents: Array<{ id: string; name: string; agent_type: string; status: string }>;
    aiAgents: Array<{ id: string; name: string; agent_type?: string | null; status: string }>;
    taskExecutions: Array<{
        id: string;
        task_type: string;
        status: string;
        model_used: string;
        duration_ms: number;
    }>;
    recommendedActions: Array<{
        id: string;
        action_title: string;
        action_type: string;
        ai_confidence_score: number;
        status: string;
    }>;
    businessRisks: Array<{ id: string; risk_title: string; risk_level: string; risk_category: string; status: string }>;
    growthOpportunities: Array<{
        id: string;
        opportunity_title: string;
        growth_score: number;
        status: string;
    }>;
    predictiveRecommendations: Array<{
        id: string;
        title: string;
        recommendation_type: string;
        confidence_score: number;
        status: string;
    }>;
    recommendationOutputs: Array<{
        id: string;
        recommendation_text: string;
        recommendation_type: string;
        ai_confidence_score: number;
        status: string;
    }>;
    productRoadmaps: Array<{ id: string; name: string; status: string }>;
    resourceAllocations: Array<{ id: string; name: string; budget_usd: number; status: string }>;
    approvalTasks: Array<{
        id: string;
        task_name: string;
        task_status: string;
        due_at: string | null;
        status: string;
    }>;
    timeTriggers: Array<{ id: string; trigger_name: string; cron_expression: string; status: string }>;
    orchestrationLinks: Array<{ id: string; link_key: string; link_type: string; status: string }>;
    workflowOrchestrations: Array<{
        id: string;
        name: string;
        participating_modules: unknown[];
        status: string;
    }>;
    crossModuleAutomations: Array<{
        id: string;
        name: string;
        trigger_module: string;
        status: string;
    }>;
    workflowExecutions: Array<{
        id: string;
        execution_key: string;
        execution_name: string;
        execution_status: string;
        status: string;
        created_at: string;
    }>;
    failedExecutions: Array<{
        id: string;
        failure_key: string;
        failure_type: string;
        error_message: string;
        status: string;
    }>;
    workflowFailures: Array<{
        id: string;
        failure_key: string;
        failure_type: string;
        error_message: string;
        status: string;
    }>;
    executionRetries: Array<{ id: string; retry_status: string; status: string }>;
    executionRollbacks: Array<{
        id: string;
        rollback_key: string;
        rollback_reason: string;
        rollback_status: string;
        status: string;
    }>;
    knowledgeEntries: Array<{ id: string; title: string; category: string; status: string }>;
    knowledgeAiContexts: Array<{ id: string; context_key: string; status: string }>;
    knowledgeAdrs: Array<{ id: string; title: string; status: string }>;
    decisionLogs: Array<{
        id: string;
        title: string;
        decision_type: string;
        outcome: string;
        status: string;
    }>;
    companyTimeline: Array<{
        id: string;
        title: string;
        event_type: string;
        event_at: string;
        status: string;
    }>;
    activityFeed: Array<{
        id: string;
        actor_name: string;
        action: string;
        summary: string;
        created_at: string;
    }>;
    evidenceTraces: Array<{ id: string; trace_summary: string; source_module: string; status: string }>;
    reasoningSessions: Array<{ id: string; objective: string; reasoning_type: string; status: string }>;
    revenueRisks: Array<{ id: string; risk_key: string; risk_level: string; status: string }>;
    churnRisks: Array<{ id: string; risk_key: string; risk_level: string; status: string }>;
    permissionRisks: Array<{ id: string; risk_key: string; risk_level: string; status: string }>;
    foRisks: Array<{ id: string; title: string; risk_level: string; status: string }>;
    emergencyWorkflows: Array<{ id: string; name: string; severity: string; status: string }>;
    csRiskAnalyses: Array<{ id: string; name: string; risk_level: string; status: string }>;
    executiveFailures: Array<{
        id: string;
        failure_key: string;
        failure_type: string;
        error_message: string;
        status: string;
    }>;
    approvalWorkflows: Array<{
        id: string;
        title: string;
        required_role: string;
        status: string;
    }>;
    manualReviews: Array<{ id: string; review_name: string; review_status: string; status: string }>;
    acAuditLogs: Array<{ id: string; action: string; summary: string; created_at: string }>;
    aixAuditLogs: Array<{ id: string; action: string; summary: string; created_at: string }>;
    foAuditLogs: Array<{ id: string; action: string; summary: string; created_at: string }>;
    businessKpis: Array<{
        id: string;
        name: string;
        current_value: number;
        target_value: number;
        unit: string;
        status: string;
    }>;
    operationalHealth: Array<{ id: string; name: string; overall_score: number; status: string }>;
    executiveMetrics: Array<{
        id: string;
        metrics_key: string;
        business_score: number;
        status: string;
    }>;
    executiveHealth: Array<{ id: string; overall_score: number; status: string }>;
    executiveInsights: Array<{ id: string; title: string; insight_type: string; status: string }>;
    founderInsights: Array<{ id: string; title: string; insight_type: string; status: string }>;
    platformHealthIntel: Array<{ id: string; health_score: number; status: string }>;
}
