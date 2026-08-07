import {
    AEB_AGENT_ROLE_LABELS,
    AEB_AGENT_ROLES,
    type AebAgentRole,
} from "../constants";
import type {
    AiDecisionEngineBoard,
    AiEnterpriseBrainRawData,
    AiEnterpriseBrainSnapshot,
    CrossModuleOrchestratorBoard,
    EnterpriseMemoryBoard,
    ExceptionCenterBoard,
    ExecutiveMissionDashboard,
    FounderApprovalCenterBoard,
    MissionControlBoard,
    MultiAgentCoordinatorBoard,
    TaskPlannerBoard,
} from "../types";

function avg(nums: number[]): number | null {
    if (!nums.length) return null;
    return Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 10) / 10;
}

function isActiveStatus(status: string): boolean {
    const s = status.toLowerCase();
    return s.includes("active") || s.includes("running") || s.includes("open") || s.includes("in_progress");
}

function isPendingStatus(status: string): boolean {
    const s = status.toLowerCase();
    return s.includes("pending") || s.includes("await") || s.includes("review") || s.includes("open");
}

/** Map agent name/type to one of the six Enterprise Brain coordinator roles. */
export function classifyAgentRole(type: string, name = ""): AebAgentRole | "other" {
    const s = `${type} ${name}`.toLowerCase();
    if (s.includes("market") || s.includes("growth") || s.includes("content") || s.includes("brand")) {
        return "marketing";
    }
    if (s.includes("sales") || s.includes("lead") || s.includes("crm") || s.includes("pipeline")) {
        return "sales";
    }
    if (
        s.includes("customer success")
        || s.includes("customer_success")
        || s.includes("cs agent")
        || s.includes("churn")
        || s.includes("retention")
        || s.includes("onboarding")
    ) {
        return "customer_success";
    }
    if (s.includes("financ") || s.includes("billing") || s.includes("invoice") || s.includes("revenue")) {
        return "finance";
    }
    if (s.includes("automat") || s.includes("workflow") || s.includes("rpa") || s.includes("orchestr")) {
        return "automation";
    }
    if (s.includes("operat") || s.includes("infra") || s.includes("ops") || s.includes("sre") || s.includes("devops")) {
        return "operations";
    }
    return "other";
}

export function modulesLabel(modules: unknown[]): string {
    if (!Array.isArray(modules) || !modules.length) return "—";
    return modules
        .map((m) => (typeof m === "string" ? m : typeof m === "object" && m && "name" in m ? String((m as { name: unknown }).name) : String(m)))
        .filter(Boolean)
        .slice(0, 4)
        .join(", ");
}

export function buildMissionControl(data: AiEnterpriseBrainRawData): MissionControlBoard {
    const objectives = data.strategicOkrs.map((o) => ({
        id: o.id,
        title: o.title,
        objective: o.objective,
        quarter: o.quarter,
        status: o.status,
    }));
    const activeMissions = data.companyContexts
        .filter((c) => isActiveStatus(c.status) || c.pipeline_stage)
        .map((c) => ({
            id: c.id,
            title: c.title,
            stage: c.pipeline_stage,
            status: c.status,
            summary: c.summary,
        }));
    const priorities = [
        ...data.foPriorities.map((p) => ({
            id: p.id,
            title: p.title,
            level: p.priority_level,
            owner: p.owner,
            dueDate: p.due_date ?? "—",
            status: p.status,
        })),
        ...data.todayPriorities.map((p) => ({
            id: p.id,
            title: p.priority_title,
            level: `rank-${p.priority_rank}`,
            owner: "AI",
            dueDate: "today",
            status: p.status,
        })),
    ];
    const progress = data.milestones.map((m) => ({
        id: m.id,
        title: m.title,
        type: m.milestone_type,
        targetDate: m.target_date ?? "—",
        status: m.status,
    }));
    return {
        objectives,
        activeMissions,
        priorities,
        progress,
        todayPriorities: data.todayPriorities.length,
        activeMissionCount: activeMissions.length,
    };
}

export function buildMultiAgentCoordinator(data: AiEnterpriseBrainRawData): MultiAgentCoordinatorBoard {
    const fromOrch = data.orchestrationAgents.map((a) => ({
        id: a.id,
        name: a.name,
        role: classifyAgentRole(a.agent_type, a.name),
        agentType: a.agent_type,
        status: a.status,
        source: "orchestration" as const,
    }));
    const fromAi = data.aiAgents.map((a) => ({
        id: a.id,
        name: a.name,
        role: classifyAgentRole("", a.name),
        agentType: "ai_agent",
        status: a.status,
        source: "ai" as const,
    }));
    const agents = [...fromOrch, ...fromAi];
    const byRole = AEB_AGENT_ROLES.map((role) => {
        const matched = agents.filter((a) => a.role === role);
        return {
            role,
            label: AEB_AGENT_ROLE_LABELS[role],
            count: matched.length,
            active: matched.filter((a) => isActiveStatus(a.status)).length,
        };
    });
    const coverageReady = byRole.filter((r) => r.count > 0).length >= 4;
    return {
        agents,
        byRole,
        recentExecutions: data.taskExecutions.slice(0, 40).map((t) => ({
            id: t.id,
            taskType: t.task_type,
            status: t.status,
            model: t.model_used,
            durationMs: t.duration_ms,
        })),
        coverageReady,
    };
}

export function buildAiDecisionEngine(data: AiEnterpriseBrainRawData): AiDecisionEngineBoard {
    const goalEvaluations = [
        ...data.reasoningSessions.map((s) => ({
            id: s.id,
            title: s.objective,
            type: s.reasoning_type,
            confidence: 0,
            status: s.status,
        })),
        ...data.recommendedActions.map((a) => ({
            id: a.id,
            title: a.action_title,
            type: a.action_type,
            confidence: Number(a.ai_confidence_score ?? 0),
            status: a.status,
        })),
    ];
    const risks = data.businessRisks.map((r) => ({
        id: r.id,
        title: r.risk_title,
        level: r.risk_level,
        category: r.risk_category,
        status: r.status,
    }));
    const opportunities = data.growthOpportunities.map((o) => ({
        id: o.id,
        title: o.opportunity_title,
        score: Number(o.growth_score ?? 0),
        status: o.status,
    }));
    const ranked = [
        ...data.predictiveRecommendations.map((r) => ({
            id: r.id,
            title: r.title,
            type: r.recommendation_type,
            confidence: Number(r.confidence_score ?? 0),
            status: r.status,
        })),
        ...data.recommendationOutputs.map((r) => ({
            id: r.id,
            title: r.recommendation_text.slice(0, 120),
            type: r.recommendation_type,
            confidence: Number(r.ai_confidence_score ?? 0),
            status: r.status,
        })),
        ...data.recommendedActions.map((a) => ({
            id: `ra-${a.id}`,
            title: a.action_title,
            type: a.action_type,
            confidence: Number(a.ai_confidence_score ?? 0),
            status: a.status,
        })),
    ]
        .sort((a, b) => b.confidence - a.confidence)
        .map((r, i) => ({ ...r, rank: i + 1 }));

    return {
        goalEvaluations,
        risks,
        opportunities,
        rankedRecommendations: ranked,
        recommendationCount: ranked.length,
    };
}

export function buildTaskPlanner(data: AiEnterpriseBrainRawData): TaskPlannerBoard {
    return {
        longRunningPlans: data.productRoadmaps.map((r) => ({
            id: r.id,
            name: r.name,
            status: r.status,
            detail: "product_roadmap",
        })),
        dependencies: data.orchestrationLinks.map((l) => ({
            id: l.id,
            name: l.link_key,
            status: l.status,
            detail: l.link_type,
        })),
        schedule: [
            ...data.timeTriggers.map((t) => ({
                id: t.id,
                name: t.trigger_name,
                dueAt: t.cron_expression,
                status: t.status,
            })),
            ...data.approvalTasks.map((t) => ({
                id: t.id,
                name: t.task_name,
                dueAt: t.due_at ?? "—",
                status: t.task_status || t.status,
            })),
        ],
        resourceAllocation: data.resourceAllocations.map((r) => ({
            id: r.id,
            name: r.name,
            budgetUsd: Number(r.budget_usd ?? 0),
            status: r.status,
        })),
        openTasks: data.approvalTasks.filter((t) => isPendingStatus(t.task_status) || isPendingStatus(t.status)).length,
    };
}

export function buildCrossModuleOrchestrator(data: AiEnterpriseBrainRawData): CrossModuleOrchestratorBoard {
    return {
        orchestrations: data.workflowOrchestrations.map((o) => ({
            id: o.id,
            name: o.name,
            modules: modulesLabel(o.participating_modules),
            status: o.status,
        })),
        workflows: data.crossModuleAutomations.map((w) => ({
            id: w.id,
            name: w.name,
            trigger: w.trigger_module,
            status: w.status,
        })),
        executions: data.workflowExecutions.slice(0, 50).map((e) => ({
            id: e.id,
            key: e.execution_name || e.execution_key,
            status: e.execution_status || e.status,
            at: e.created_at,
        })),
        rollbacks: data.executionRollbacks.map((r) => ({
            id: r.id,
            key: r.rollback_key,
            type: r.rollback_reason,
            status: r.rollback_status || r.status,
        })),
        failureCount: data.failedExecutions.length + data.workflowFailures.length,
        retryCount: data.executionRetries.length,
    };
}

export function buildEnterpriseMemory(data: AiEnterpriseBrainRawData): EnterpriseMemoryBoard {
    return {
        sharedContext: [
            ...data.knowledgeEntries.map((e) => ({
                id: e.id,
                title: e.title,
                category: e.category,
                status: e.status,
            })),
            ...data.knowledgeAiContexts.map((c) => ({
                id: c.id,
                title: c.context_key,
                category: "ai_context",
                status: c.status,
            })),
        ],
        decisions: data.decisionLogs.map((d) => ({
            id: d.id,
            title: d.title,
            type: d.decision_type,
            outcome: d.outcome,
            status: d.status,
        })),
        historicalEvents: data.companyTimeline.map((t) => ({
            id: t.id,
            title: t.title,
            eventType: t.event_type,
            at: t.event_at,
        })),
        aiNotes: [
            ...data.knowledgeAdrs.map((a) => ({
                id: a.id,
                title: a.title,
                source: "adr",
                status: a.status,
            })),
            ...data.evidenceTraces.map((e) => ({
                id: e.id,
                title: e.trace_summary.slice(0, 120),
                source: e.source_module,
                status: e.status,
            })),
            ...data.reasoningSessions.map((s) => ({
                id: s.id,
                title: s.objective.slice(0, 120),
                source: s.reasoning_type,
                status: s.status,
            })),
        ],
        activityFeed: data.activityFeed.slice(0, 40).map((a) => ({
            id: a.id,
            actor: a.actor_name,
            action: a.action,
            summary: a.summary,
            at: a.created_at,
        })),
        memoryEntries: data.knowledgeEntries.length + data.knowledgeAiContexts.length + data.knowledgeAdrs.length,
    };
}

export function buildExceptionCenter(data: AiEnterpriseBrainRawData): ExceptionCenterBoard {
    const failedWorkflows = [
        ...data.failedExecutions.map((f) => ({
            id: f.id,
            key: f.failure_key,
            type: f.failure_type,
            message: f.error_message,
            status: f.status,
        })),
        ...data.workflowFailures.map((f) => ({
            id: f.id,
            key: f.failure_key,
            type: f.failure_type,
            message: f.error_message,
            status: f.status,
        })),
        ...data.executiveFailures.map((f) => ({
            id: f.id,
            key: f.failure_key,
            type: f.failure_type,
            message: f.error_message,
            status: f.status,
        })),
    ];
    const revenueRisks = data.revenueRisks.map((r) => ({
        id: r.id,
        title: r.risk_key,
        level: r.risk_level,
        status: r.status,
    }));
    const customerRisks = [
        ...data.churnRisks.map((r) => ({
            id: r.id,
            title: r.risk_key,
            level: r.risk_level,
            status: r.status,
        })),
        ...data.csRiskAnalyses.map((r) => ({
            id: r.id,
            title: r.name,
            level: r.risk_level,
            status: r.status,
        })),
    ];
    const securityRisks = [
        ...data.permissionRisks.map((r) => ({
            id: r.id,
            title: r.risk_key,
            level: r.risk_level,
            status: r.status,
        })),
        ...data.foRisks.map((r) => ({
            id: r.id,
            title: r.title,
            level: r.risk_level,
            status: r.status,
        })),
    ];
    const escalations = data.emergencyWorkflows.map((e) => ({
        id: e.id,
        name: e.name,
        severity: e.severity,
        status: e.status,
    }));
    return {
        failedWorkflows,
        revenueRisks,
        customerRisks,
        securityRisks,
        escalations,
        openExceptions:
            failedWorkflows.filter((f) => isPendingStatus(f.status) || isActiveStatus(f.status)).length
            + revenueRisks.length
            + customerRisks.length
            + securityRisks.length
            + escalations.filter((e) => isActiveStatus(e.status) || isPendingStatus(e.status)).length,
    };
}

export function buildFounderApprovalCenter(data: AiEnterpriseBrainRawData): FounderApprovalCenterBoard {
    const pending = [
        ...data.approvalWorkflows
            .filter((a) => isPendingStatus(a.status))
            .map((a) => ({
                id: a.id,
                title: a.title,
                requiredRole: a.required_role,
                status: a.status,
                source: "ac_approval",
            })),
        ...data.approvalTasks
            .filter((t) => isPendingStatus(t.task_status) || isPendingStatus(t.status))
            .map((t) => ({
                id: t.id,
                title: t.task_name,
                requiredRole: "founder",
                status: t.task_status || t.status,
                source: "dwe_approval",
            })),
        ...data.manualReviews
            .filter((r) => isPendingStatus(r.review_status) || isPendingStatus(r.status))
            .map((r) => ({
                id: r.id,
                title: r.review_name,
                requiredRole: "founder",
                status: r.review_status || r.status,
                source: "manual_review",
            })),
    ];
    const highImpact = [
        ...data.approvalWorkflows
            .filter((a) => {
                const role = a.required_role.toLowerCase();
                return role.includes("founder") || role.includes("admin") || role.includes("executive");
            })
            .map((a) => ({
                id: a.id,
                title: a.title,
                type: "high_impact_approval",
                status: a.status,
            })),
        ...data.emergencyWorkflows.map((e) => ({
            id: e.id,
            title: e.name,
            type: `emergency:${e.severity}`,
            status: e.status,
        })),
    ];
    const history = data.decisionLogs.map((d) => ({
        id: d.id,
        title: d.title,
        outcome: d.outcome,
        status: d.status,
    }));
    const auditTrail = [
        ...data.foAuditLogs.map((l) => ({
            id: l.id,
            action: l.action,
            summary: l.summary,
            at: l.created_at,
            source: "founder_os",
        })),
        ...data.acAuditLogs.map((l) => ({
            id: l.id,
            action: l.action,
            summary: l.summary,
            at: l.created_at,
            source: "autonomous_company",
        })),
        ...data.aixAuditLogs.map((l) => ({
            id: l.id,
            action: l.action,
            summary: l.summary,
            at: l.created_at,
            source: "executive_intelligence",
        })),
    ]
        .sort((a, b) => (a.at < b.at ? 1 : -1))
        .slice(0, 60);

    return {
        pending,
        highImpact,
        history,
        auditTrail,
        pendingCount: pending.length,
    };
}

export function buildExecutiveMissionDashboard(data: AiEnterpriseBrainRawData): ExecutiveMissionDashboard {
    const healthScores = [
        ...data.executiveHealth.map((h) => Number(h.overall_score ?? 0)),
        ...data.operationalHealth.map((h) => Number(h.overall_score ?? 0)),
        ...data.platformHealthIntel.map((h) => Number(h.health_score ?? 0)),
        ...data.executiveMetrics.map((m) => Number(m.business_score ?? 0)),
    ].filter((n) => Number.isFinite(n) && n > 0);

    return {
        companyHealthScore: avg(healthScores),
        missionStatus: data.companyContexts.slice(0, 30).map((c) => ({
            id: c.id,
            title: c.title,
            status: c.status,
            stage: c.pipeline_stage,
        })),
        aiActivity: [
            ...data.executiveInsights.map((i) => ({
                id: i.id,
                title: i.title,
                type: i.insight_type,
                status: i.status,
            })),
            ...data.founderInsights.map((i) => ({
                id: i.id,
                title: i.title,
                type: i.insight_type,
                status: i.status,
            })),
            ...data.taskExecutions.slice(0, 20).map((t) => ({
                id: t.id,
                title: t.task_type,
                type: "task_execution",
                status: t.status,
            })),
        ],
        kpis: data.businessKpis.map((k) => ({
            id: k.id,
            name: k.name,
            current: Number(k.current_value ?? 0),
            target: Number(k.target_value ?? 0),
            unit: k.unit,
            status: k.status,
        })),
        recommendations: [
            ...data.predictiveRecommendations.map((r) => ({
                id: r.id,
                title: r.title,
                confidence: Number(r.confidence_score ?? 0),
                status: r.status,
            })),
            ...data.recommendedActions.map((a) => ({
                id: a.id,
                title: a.action_title,
                confidence: Number(a.ai_confidence_score ?? 0),
                status: a.status,
            })),
        ]
            .sort((a, b) => b.confidence - a.confidence)
            .slice(0, 30),
        operationalHealth: avg(data.operationalHealth.map((h) => Number(h.overall_score ?? 0)).filter((n) => n > 0)),
        executiveMetricCount: data.executiveMetrics.length,
    };
}

export const aebPure = {
    classifyAgentRole,
    modulesLabel,
    isActiveStatus,
    isPendingStatus,
    avg,
};

export function createEmptyAiEnterpriseBrainSnapshot(
    accessGranted: boolean,
    accessDeniedReason: string | null = null,
): AiEnterpriseBrainSnapshot {
    return {
        accessGranted,
        accessDeniedReason,
        organizationId: null,
        fetchedAt: new Date().toISOString(),
        missionControl: {
            objectives: [],
            activeMissions: [],
            priorities: [],
            progress: [],
            todayPriorities: 0,
            activeMissionCount: 0,
        },
        multiAgent: {
            agents: [],
            byRole: AEB_AGENT_ROLES.map((role) => ({
                role,
                label: AEB_AGENT_ROLE_LABELS[role],
                count: 0,
                active: 0,
            })),
            recentExecutions: [],
            coverageReady: false,
        },
        decisionEngine: {
            goalEvaluations: [],
            risks: [],
            opportunities: [],
            rankedRecommendations: [],
            recommendationCount: 0,
        },
        taskPlanner: {
            longRunningPlans: [],
            dependencies: [],
            schedule: [],
            resourceAllocation: [],
            openTasks: 0,
        },
        orchestrator: {
            orchestrations: [],
            workflows: [],
            executions: [],
            rollbacks: [],
            failureCount: 0,
            retryCount: 0,
        },
        memory: {
            sharedContext: [],
            decisions: [],
            historicalEvents: [],
            aiNotes: [],
            activityFeed: [],
            memoryEntries: 0,
        },
        exceptions: {
            failedWorkflows: [],
            revenueRisks: [],
            customerRisks: [],
            securityRisks: [],
            escalations: [],
            openExceptions: 0,
        },
        approvals: {
            pending: [],
            highImpact: [],
            history: [],
            auditTrail: [],
            pendingCount: 0,
        },
        executive: {
            companyHealthScore: null,
            missionStatus: [],
            aiActivity: [],
            kpis: [],
            recommendations: [],
            operationalHealth: null,
            executiveMetricCount: 0,
        },
    };
}

export function buildAiEnterpriseBrainSnapshot(data: AiEnterpriseBrainRawData): AiEnterpriseBrainSnapshot {
    return {
        accessGranted: true,
        accessDeniedReason: null,
        organizationId: data.organizationId,
        fetchedAt: new Date().toISOString(),
        missionControl: buildMissionControl(data),
        multiAgent: buildMultiAgentCoordinator(data),
        decisionEngine: buildAiDecisionEngine(data),
        taskPlanner: buildTaskPlanner(data),
        orchestrator: buildCrossModuleOrchestrator(data),
        memory: buildEnterpriseMemory(data),
        exceptions: buildExceptionCenter(data),
        approvals: buildFounderApprovalCenter(data),
        executive: buildExecutiveMissionDashboard(data),
    };
}
