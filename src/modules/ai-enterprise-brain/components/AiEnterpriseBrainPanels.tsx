"use client";

import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import type {
    AiDecisionEngineBoard,
    CrossModuleOrchestratorBoard,
    EnterpriseMemoryBoard,
    ExceptionCenterBoard,
    ExecutiveMissionDashboard,
    FounderApprovalCenterBoard,
    MissionControlBoard,
    MultiAgentCoordinatorBoard,
    TaskPlannerBoard,
} from "../types";

function Metric({ label, value }: { label: string; value: string | number }) {
    return (
        <Card>
            <p className="text-xs uppercase tracking-[0.14em] text-[var(--dos-text-tertiary)]">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-[var(--dos-text-primary)]">{value}</p>
        </Card>
    );
}

function Table({ headers, rows, empty }: { headers: string[]; rows: string[][]; empty: string }) {
    if (!rows.length) {
        return <EmptyState title={empty} description="Live tenant data will appear when records exist in Supabase." />;
    }
    return (
        <div className="overflow-x-auto rounded-[var(--dos-radius-lg)] border border-[var(--dos-border)]">
            <table className="min-w-full text-left text-sm">
                <thead className="bg-[var(--dos-surface-tertiary)] text-[var(--dos-text-tertiary)]">
                    <tr>
                        {headers.map((h) => (
                            <th key={h} className="px-3 py-2 font-medium">
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, i) => (
                        <tr key={i} className="border-t border-[var(--dos-border)]">
                            {row.map((cell, j) => (
                                <td key={j} className="px-3 py-2 text-[var(--dos-text-secondary)]">
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export function MissionControlPanel({ missionControl }: { missionControl: MissionControlBoard }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Company objectives" value={missionControl.objectives.length} />
                <Metric label="Active missions" value={missionControl.activeMissionCount} />
                <Metric label="Priorities" value={missionControl.priorities.length} />
                <Metric label="Today priorities" value={missionControl.todayPriorities} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Mission Control</h3>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                    Company objectives · Active missions · Priorities · Progress tracking
                </p>
                <div className="mt-4 space-y-4">
                    <Table
                        headers={["Objective", "Detail", "Quarter", "Status"]}
                        rows={missionControl.objectives.map((o) => [o.title, o.objective, o.quarter, o.status])}
                        empty="No company objectives"
                    />
                    <Table
                        headers={["Mission", "Stage", "Status", "Summary"]}
                        rows={missionControl.activeMissions.map((m) => [m.title, m.stage, m.status, m.summary])}
                        empty="No active missions"
                    />
                    <Table
                        headers={["Priority", "Level", "Owner", "Due", "Status"]}
                        rows={missionControl.priorities.map((p) => [p.title, p.level, p.owner, p.dueDate, p.status])}
                        empty="No priorities"
                    />
                    <Table
                        headers={["Milestone", "Type", "Target", "Status"]}
                        rows={missionControl.progress.map((p) => [p.title, p.type, p.targetDate, p.status])}
                        empty="No progress milestones"
                    />
                </div>
            </Card>
        </div>
    );
}

export function MultiAgentCoordinatorPanel({ multiAgent }: { multiAgent: MultiAgentCoordinatorBoard }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Agents" value={multiAgent.agents.length} />
                <Metric label="Role coverage" value={multiAgent.coverageReady ? "Ready" : "Partial"} />
                <Metric label="Recent executions" value={multiAgent.recentExecutions.length} />
                <Metric
                    label="Active agents"
                    value={multiAgent.byRole.reduce((n, r) => n + r.active, 0)}
                />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Multi-Agent Coordinator</h3>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                    Marketing Agent · Sales Agent · Customer Success Agent · Finance Agent · Automation Agent ·
                    Operations Agent
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                    {multiAgent.byRole.map((r) => (
                        <Badge key={r.role} variant="info">
                            {r.label}: {r.count} ({r.active} active)
                        </Badge>
                    ))}
                </div>
                <div className="mt-4 space-y-4">
                    <Table
                        headers={["Agent", "Role", "Type", "Source", "Status"]}
                        rows={multiAgent.agents.map((a) => [
                            a.name,
                            a.role,
                            a.agentType,
                            a.source,
                            a.status,
                        ])}
                        empty="No coordinating agents"
                    />
                    <Table
                        headers={["Task", "Status", "Model", "Duration ms"]}
                        rows={multiAgent.recentExecutions.map((e) => [
                            e.taskType,
                            e.status,
                            e.model,
                            String(e.durationMs),
                        ])}
                        empty="No agent executions"
                    />
                </div>
            </Card>
        </div>
    );
}

export function AiDecisionEnginePanel({ decisionEngine }: { decisionEngine: AiDecisionEngineBoard }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Goal evaluations" value={decisionEngine.goalEvaluations.length} />
                <Metric label="Risk analysis" value={decisionEngine.risks.length} />
                <Metric label="Opportunities" value={decisionEngine.opportunities.length} />
                <Metric label="Ranked recommendations" value={decisionEngine.recommendationCount} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">AI Decision Engine</h3>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                    Goal evaluation · Risk analysis · Opportunity detection · Recommendation ranking
                </p>
                <div className="mt-4 space-y-4">
                    <Table
                        headers={["Goal / Action", "Type", "Confidence", "Status"]}
                        rows={decisionEngine.goalEvaluations.map((g) => [
                            g.title,
                            g.type,
                            String(g.confidence),
                            g.status,
                        ])}
                        empty="No goal evaluations"
                    />
                    <Table
                        headers={["Risk", "Level", "Category", "Status"]}
                        rows={decisionEngine.risks.map((r) => [r.title, r.level, r.category, r.status])}
                        empty="No risks"
                    />
                    <Table
                        headers={["Opportunity", "Score", "Status"]}
                        rows={decisionEngine.opportunities.map((o) => [o.title, String(o.score), o.status])}
                        empty="No opportunities"
                    />
                    <Table
                        headers={["Rank", "Recommendation", "Type", "Confidence", "Status"]}
                        rows={decisionEngine.rankedRecommendations.map((r) => [
                            String(r.rank),
                            r.title,
                            r.type,
                            String(r.confidence),
                            r.status,
                        ])}
                        empty="No recommendations"
                    />
                </div>
            </Card>
        </div>
    );
}

export function TaskPlannerPanel({ taskPlanner }: { taskPlanner: TaskPlannerBoard }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Long-running plans" value={taskPlanner.longRunningPlans.length} />
                <Metric label="Dependencies" value={taskPlanner.dependencies.length} />
                <Metric label="Scheduled items" value={taskPlanner.schedule.length} />
                <Metric label="Open tasks" value={taskPlanner.openTasks} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Task Planner</h3>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                    Long-running plans · Task dependencies · Scheduling · Resource allocation
                </p>
                <div className="mt-4 space-y-4">
                    <Table
                        headers={["Plan", "Detail", "Status"]}
                        rows={taskPlanner.longRunningPlans.map((p) => [p.name, p.detail, p.status])}
                        empty="No long-running plans"
                    />
                    <Table
                        headers={["Dependency", "Detail", "Status"]}
                        rows={taskPlanner.dependencies.map((d) => [d.name, d.detail, d.status])}
                        empty="No task dependencies"
                    />
                    <Table
                        headers={["Schedule item", "When", "Status"]}
                        rows={taskPlanner.schedule.map((s) => [s.name, s.dueAt, s.status])}
                        empty="No schedule"
                    />
                    <Table
                        headers={["Resource", "Budget USD", "Status"]}
                        rows={taskPlanner.resourceAllocation.map((r) => [
                            r.name,
                            String(r.budgetUsd),
                            r.status,
                        ])}
                        empty="No resource allocation"
                    />
                </div>
            </Card>
        </div>
    );
}

export function CrossModuleOrchestratorPanel({
    orchestrator,
}: {
    orchestrator: CrossModuleOrchestratorBoard;
}) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Orchestrations" value={orchestrator.orchestrations.length} />
                <Metric label="Workflows" value={orchestrator.workflows.length} />
                <Metric label="Failures" value={orchestrator.failureCount} />
                <Metric label="Retries" value={orchestrator.retryCount} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Cross-Module Orchestrator</h3>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                    Coordinate existing modules · Execute workflows · Track execution · Rollback on failures
                </p>
                <div className="mt-4 space-y-4">
                    <Table
                        headers={["Orchestration", "Modules", "Status"]}
                        rows={orchestrator.orchestrations.map((o) => [o.name, o.modules, o.status])}
                        empty="No orchestrations"
                    />
                    <Table
                        headers={["Workflow", "Trigger module", "Status"]}
                        rows={orchestrator.workflows.map((w) => [w.name, w.trigger, w.status])}
                        empty="No cross-module workflows"
                    />
                    <Table
                        headers={["Execution", "Status", "At"]}
                        rows={orchestrator.executions.map((e) => [e.key, e.status, e.at])}
                        empty="No executions tracked"
                    />
                    <Table
                        headers={["Rollback", "Reason", "Status"]}
                        rows={orchestrator.rollbacks.map((r) => [r.key, r.type, r.status])}
                        empty="No rollbacks"
                    />
                </div>
            </Card>
        </div>
    );
}

export function EnterpriseMemoryPanel({ memory }: { memory: EnterpriseMemoryBoard }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Memory entries" value={memory.memoryEntries} />
                <Metric label="Decisions" value={memory.decisions.length} />
                <Metric label="Historical events" value={memory.historicalEvents.length} />
                <Metric label="AI notes" value={memory.aiNotes.length} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Enterprise Memory</h3>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                    Shared business context · Decisions · Historical events · AI notes
                </p>
                <div className="mt-4 space-y-4">
                    <Table
                        headers={["Context", "Category", "Status"]}
                        rows={memory.sharedContext.map((c) => [c.title, c.category, c.status])}
                        empty="No shared context"
                    />
                    <Table
                        headers={["Decision", "Type", "Outcome", "Status"]}
                        rows={memory.decisions.map((d) => [d.title, d.type, d.outcome, d.status])}
                        empty="No decisions"
                    />
                    <Table
                        headers={["Event", "Type", "At"]}
                        rows={memory.historicalEvents.map((e) => [e.title, e.eventType, e.at])}
                        empty="No historical events"
                    />
                    <Table
                        headers={["AI note", "Source", "Status"]}
                        rows={memory.aiNotes.map((n) => [n.title, n.source, n.status])}
                        empty="No AI notes"
                    />
                    <Table
                        headers={["Actor", "Action", "Summary", "At"]}
                        rows={memory.activityFeed.map((a) => [a.actor, a.action, a.summary, a.at])}
                        empty="No activity feed"
                    />
                </div>
            </Card>
        </div>
    );
}

export function ExceptionCenterPanel({ exceptions }: { exceptions: ExceptionCenterBoard }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Open exceptions" value={exceptions.openExceptions} />
                <Metric label="Failed workflows" value={exceptions.failedWorkflows.length} />
                <Metric label="Revenue risks" value={exceptions.revenueRisks.length} />
                <Metric label="Escalations" value={exceptions.escalations.length} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Exception Center</h3>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                    Failed workflows · Revenue risks · Customer risks · Security risks · Escalations
                </p>
                <div className="mt-4 space-y-4">
                    <Table
                        headers={["Failure", "Type", "Message", "Status"]}
                        rows={exceptions.failedWorkflows.map((f) => [f.key, f.type, f.message, f.status])}
                        empty="No failed workflows"
                    />
                    <Table
                        headers={["Revenue risk", "Level", "Status"]}
                        rows={exceptions.revenueRisks.map((r) => [r.title, r.level, r.status])}
                        empty="No revenue risks"
                    />
                    <Table
                        headers={["Customer risk", "Level", "Status"]}
                        rows={exceptions.customerRisks.map((r) => [r.title, r.level, r.status])}
                        empty="No customer risks"
                    />
                    <Table
                        headers={["Security risk", "Level", "Status"]}
                        rows={exceptions.securityRisks.map((r) => [r.title, r.level, r.status])}
                        empty="No security risks"
                    />
                    <Table
                        headers={["Escalation", "Severity", "Status"]}
                        rows={exceptions.escalations.map((e) => [e.name, e.severity, e.status])}
                        empty="No escalations"
                    />
                </div>
            </Card>
        </div>
    );
}

export function FounderApprovalCenterPanel({ approvals }: { approvals: FounderApprovalCenterBoard }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Pending approvals" value={approvals.pendingCount} />
                <Metric label="High-impact actions" value={approvals.highImpact.length} />
                <Metric label="Approval history" value={approvals.history.length} />
                <Metric label="Audit trail" value={approvals.auditTrail.length} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Founder Approval Center</h3>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                    Pending approvals · High-impact actions · Approval history · Audit trail
                </p>
                <div className="mt-4 space-y-4">
                    <Table
                        headers={["Pending", "Required role", "Source", "Status"]}
                        rows={approvals.pending.map((p) => [p.title, p.requiredRole, p.source, p.status])}
                        empty="No pending approvals"
                    />
                    <Table
                        headers={["High-impact action", "Type", "Status"]}
                        rows={approvals.highImpact.map((h) => [h.title, h.type, h.status])}
                        empty="No high-impact actions"
                    />
                    <Table
                        headers={["History", "Outcome", "Status"]}
                        rows={approvals.history.map((h) => [h.title, h.outcome, h.status])}
                        empty="No approval history"
                    />
                    <Table
                        headers={["Action", "Summary", "Source", "At"]}
                        rows={approvals.auditTrail.map((a) => [a.action, a.summary, a.source, a.at])}
                        empty="No audit trail"
                    />
                </div>
            </Card>
        </div>
    );
}

export function ExecutiveMissionDashboardPanel({
    executive,
}: {
    executive: ExecutiveMissionDashboard;
}) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric
                    label="Company health"
                    value={executive.companyHealthScore == null ? "—" : executive.companyHealthScore}
                />
                <Metric
                    label="Operational health"
                    value={executive.operationalHealth == null ? "—" : executive.operationalHealth}
                />
                <Metric label="KPI overview" value={executive.kpis.length} />
                <Metric label="AI metrics" value={executive.executiveMetricCount} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Executive Mission Dashboard</h3>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                    Company health · Mission status · AI activity · KPI overview · Business recommendations
                </p>
                <div className="mt-4 space-y-4">
                    <Table
                        headers={["Mission", "Stage", "Status"]}
                        rows={executive.missionStatus.map((m) => [m.title, m.stage, m.status])}
                        empty="No mission status"
                    />
                    <Table
                        headers={["AI activity", "Type", "Status"]}
                        rows={executive.aiActivity.map((a) => [a.title, a.type, a.status])}
                        empty="No AI activity"
                    />
                    <Table
                        headers={["KPI", "Current", "Target", "Unit", "Status"]}
                        rows={executive.kpis.map((k) => [
                            k.name,
                            String(k.current),
                            String(k.target),
                            k.unit,
                            k.status,
                        ])}
                        empty="No KPIs"
                    />
                    <Table
                        headers={["Recommendation", "Confidence", "Status"]}
                        rows={executive.recommendations.map((r) => [
                            r.title,
                            String(r.confidence),
                            r.status,
                        ])}
                        empty="No business recommendations"
                    />
                </div>
            </Card>
        </div>
    );
}
