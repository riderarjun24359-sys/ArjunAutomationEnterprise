"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import type {
    ActionsLibrary,
    AiWorkflowGenerator,
    ApprovalCenter,
    ExecutionCenter,
    ExecutiveAutomationDashboard,
    IntegrationHub,
    MonitoringDashboard,
    TemplateMarketplace,
    TriggerCenter,
    WorkflowBuilderBoard,
    WorkflowBuilderNode,
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

export function WorkflowBuilderPanel({ builder }: { builder: WorkflowBuilderBoard }) {
    const [nodes, setNodes] = useState<WorkflowBuilderNode[]>(builder.nodes);
    const [dragId, setDragId] = useState<string | null>(null);

    function onDrop(targetId: string) {
        if (!dragId || dragId === targetId) return;
        setNodes((prev) => {
            const next = [...prev];
            const from = next.findIndex((n) => n.id === dragId);
            const to = next.findIndex((n) => n.id === targetId);
            if (from < 0 || to < 0) return prev;
            const [item] = next.splice(from, 1);
            next.splice(to, 0, item);
            return next.map((n, i) => ({ ...n, order: i + 1 }));
        });
        setDragId(null);
    }

    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                <Metric label="Workflows" value={builder.workflows.length} />
                <Metric label="Conditions" value={builder.conditions} />
                <Metric label="Branching" value={builder.branches} />
                <Metric label="Delays" value={builder.delays} />
                <Metric label="Loops" value={builder.loops} />
                <Metric label="Templates" value={builder.templates} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Workflow Builder</h3>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                    Drag & Drop workflow editor · Conditions · Branching · Delays · Loops · Templates
                </p>
                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                    <Table
                        headers={["Workflow", "Status", "Version", "Nodes"]}
                        rows={builder.workflows.map((w) => [
                            w.name,
                            w.status,
                            String(w.version),
                            String(w.nodeCount),
                        ])}
                        empty="No workflows"
                    />
                    <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.14em] text-[var(--dos-text-tertiary)]">
                            Drag & Drop editor
                        </p>
                        {!nodes.length ? (
                            <EmptyState title="No nodes" description="Workflow nodes will appear from live DWE/automation data." />
                        ) : (
                            nodes.map((n) => (
                                <div
                                    key={n.id}
                                    draggable
                                    onDragStart={() => setDragId(n.id)}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={() => onDrop(n.id)}
                                    className="cursor-grab rounded-[var(--dos-radius-md)] border border-[var(--dos-border)] bg-[var(--dos-surface-tertiary)] px-3 py-2 active:cursor-grabbing"
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="text-sm font-medium text-[var(--dos-text-primary)]">
                                            {n.order}. {n.name}
                                        </p>
                                        <Badge variant="info">{n.kind}</Badge>
                                    </div>
                                    <p className="mt-1 text-xs text-[var(--dos-text-tertiary)]">{n.detail}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
}

export function TriggerCenterPanel({ triggers }: { triggers: TriggerCenter }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {triggers.byType.map((t) => (
                    <Metric key={t.type} label={t.type} value={t.count} />
                ))}
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Trigger Center</h3>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                    Form submitted · Lead created · Deal won · Invoice overdue · Customer created · Schedule · Manual
                    trigger · Webhook trigger
                </p>
                <Table
                    headers={["Name", "Type", "Source", "Active", "Detail"]}
                    rows={triggers.rows.map((r) => [
                        r.name,
                        r.type,
                        r.source,
                        r.active ? "yes" : "no",
                        r.detail,
                    ])}
                    empty="No triggers"
                />
            </Card>
        </div>
    );
}

export function ActionsLibraryPanel({ actions }: { actions: ActionsLibrary }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {actions.byType.map((a) => (
                    <Metric key={a.type} label={a.type} value={a.count} />
                ))}
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Actions Library</h3>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                    Create CRM record · Send Email · Send WhatsApp (architecture) · Create Task · Update Deal · Publish
                    Content · Generate Report · AI Content Generation · AI Image Generation · AI Video Generation ·
                    Custom HTTP Request
                </p>
                <Table
                    headers={["Name", "Type", "Source", "Detail"]}
                    rows={actions.rows.map((r) => [r.name, r.type, r.source, r.detail])}
                    empty="No actions"
                />
            </Card>
        </div>
    );
}

export function AiWorkflowGeneratorPanel({ generator }: { generator: AiWorkflowGenerator }) {
    const [prompt, setPrompt] = useState("");
    const suggestion = useMemo(() => {
        const q = prompt.trim().toLowerCase();
        if (!q) return generator.insights[0]?.detail ?? "Describe a workflow in natural language.";
        if (q.includes("invoice") || q.includes("overdue")) {
            return "Suggested: schedule overdue invoice check → send email reminder → create finance task → escalate if unpaid.";
        }
        if (q.includes("lead")) {
            return "Suggested: on lead created → AI score → assign owner → send welcome email → create follow-up task.";
        }
        if (q.includes("deal")) {
            return "Suggested: on deal won → create customer record → kickoff onboarding workflow → notify success team.";
        }
        return `Drafting workflow from prompt (${generator.generatedCount} generators available): ${prompt}`;
    }, [prompt, generator]);

    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <Metric label="Generated capacity" value={generator.generatedCount} />
                <Metric label="Insights" value={generator.insights.length} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">AI Workflow Generator</h3>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                    Generate workflows from natural language · Workflow optimization · Error detection · Suggested improvements
                </p>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the automation you want…"
                    className="mt-3 min-h-[100px] w-full rounded-[var(--dos-radius-md)] border border-[var(--dos-border)] bg-[var(--dos-surface)] px-3 py-2 text-sm text-[var(--dos-text-primary)]"
                />
                <p className="mt-2 text-sm text-[var(--dos-text-secondary)]">{suggestion}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                    {generator.promptSamples.map((s) => (
                        <button
                            key={s}
                            type="button"
                            onClick={() => setPrompt(s)}
                            className="rounded-[var(--dos-radius-full)] bg-[var(--dos-surface-tertiary)] px-3 py-1 text-xs text-[var(--dos-text-secondary)]"
                        >
                            {s}
                        </button>
                    ))}
                </div>
                <div className="mt-4">
                    <Table
                        headers={["Kind", "Title", "Detail", "Severity"]}
                        rows={generator.insights.map((i) => [i.kind, i.title, i.detail, i.severity])}
                        empty="No generator insights"
                    />
                </div>
            </Card>
        </div>
    );
}

export function ExecutionCenterPanel({ execution }: { execution: ExecutionCenter }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {execution.byStatus.map((s) => (
                    <Metric key={s.status} label={s.status} value={s.count} />
                ))}
                <Metric label="Retry queue" value={execution.retryQueue} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Execution Center</h3>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                    Running workflows · Completed · Failed · Retry queue · Execution logs
                </p>
                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                    <Table
                        headers={["Name", "Status", "Started", "Duration ms", "Error"]}
                        rows={execution.rows.map((r) => [
                            r.name,
                            r.status,
                            r.startedAt,
                            String(r.durationMs),
                            r.error || "—",
                        ])}
                        empty="No executions"
                    />
                    <Table
                        headers={["Level", "Message", "At"]}
                        rows={execution.logs.map((l) => [l.level, l.message, l.createdAt])}
                        empty="No execution logs"
                    />
                </div>
            </Card>
        </div>
    );
}

export function ApprovalCenterPanel({ approvals }: { approvals: ApprovalCenter }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Founder approvals" value={approvals.founderCount} />
                <Metric label="Admin approvals" value={approvals.adminCount} />
                <Metric label="High-risk action approvals" value={approvals.highRiskCount} />
                <Metric label="Audit trail" value={approvals.auditTrail.length} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Approval Center</h3>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                    Founder approvals · Admin approvals · High-risk action approvals · Audit trail
                </p>
                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                    <Table
                        headers={["Name", "Audience", "Status", "Due"]}
                        rows={approvals.rows.map((r) => [r.name, r.audience, r.status, r.dueAt || "—"])}
                        empty="No approvals"
                    />
                    <Table
                        headers={["Action", "Summary", "Security", "At"]}
                        rows={approvals.auditTrail.map((a) => [
                            a.action,
                            a.summary,
                            a.securityLevel,
                            a.createdAt,
                        ])}
                        empty="No audit trail"
                    />
                </div>
            </Card>
        </div>
    );
}

export function MonitoringDashboardPanel({ monitoring }: { monitoring: MonitoringDashboard }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <Metric label="Active workflows" value={monitoring.activeWorkflows} />
                <Metric label="Success rate" value={monitoring.successRate == null ? "—" : `${monitoring.successRate}%`} />
                <Metric label="Failures" value={monitoring.failures} />
                <Metric
                    label="Average execution time"
                    value={monitoring.avgExecutionMs == null ? "—" : `${monitoring.avgExecutionMs} ms`}
                />
                <Metric label="Automation savings" value={`${monitoring.automationSavingsHours} h`} />
                <Metric label="Health" value={monitoring.healthScore ?? "—"} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Monitoring Dashboard</h3>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                    Active workflows · Success rate · Failures · Average execution time · Automation savings
                </p>
            </Card>
        </div>
    );
}

export function TemplateMarketplacePanel({ templates }: { templates: TemplateMarketplace }) {
    const [category, setCategory] = useState("all");
    const filtered = useMemo(
        () => (category === "all" ? templates.rows : templates.rows.filter((r) => r.category === category)),
        [templates.rows, category],
    );

    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {templates.byCategory.map((c) => (
                    <Metric key={c.category} label={c.category} value={c.count} />
                ))}
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Template Marketplace</h3>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                    Marketing · Sales · Customer Success · Finance · HR · Operations
                </p>
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-3 rounded-[var(--dos-radius-md)] border border-[var(--dos-border)] bg-[var(--dos-surface)] px-3 py-2 text-sm text-[var(--dos-text-primary)]"
                >
                    <option value="all">All categories</option>
                    {templates.byCategory.map((c) => (
                        <option key={c.category} value={c.category}>
                            {c.category}
                        </option>
                    ))}
                </select>
                <div className="mt-4">
                    <Table
                        headers={["Name", "Category", "Status", "Description"]}
                        rows={filtered.map((r) => [r.name, r.category, r.status, r.description])}
                        empty="No templates"
                    />
                </div>
            </Card>
        </div>
    );
}

export function IntegrationHubPanel({ integrations }: { integrations: IntegrationHub }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {integrations.byType.map((i) => (
                    <Metric key={i.type} label={i.type} value={i.count} />
                ))}
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Integration Hub (Architecture)</h3>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                    Email · Calendar · Slack · Discord · GitHub · Stripe · Razorpay · Google Drive · Webhooks
                </p>
                <Table
                    headers={["Name", "Type", "Status", "Architecture"]}
                    rows={integrations.rows.map((r) => [r.name, r.type, r.status, r.architecture])}
                    empty="No integrations"
                />
            </Card>
        </div>
    );
}

export function ExecutiveAutomationPanel({ executive }: { executive: ExecutiveAutomationDashboard }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Automation ROI" value={`$${executive.automationRoi.toLocaleString()}`} />
                <Metric label="Time saved" value={`${executive.timeSavedHours} h`} />
                <Metric label="Workflow health" value={executive.workflowHealth ?? "—"} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Executive Dashboard</h3>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                    Automation ROI · Time saved · Workflow health · Top automations · AI recommendations
                </p>
                <p className="mt-3 text-sm text-[var(--dos-text-secondary)]">{executive.summary}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                    {executive.aiRecommendations.map((r) => (
                        <Badge key={r} variant="info">
                            {r}
                        </Badge>
                    ))}
                </div>
                <div className="mt-4">
                    <p className="mb-2 text-xs uppercase tracking-[0.14em] text-[var(--dos-text-tertiary)]">
                        Top automations
                    </p>
                    <Table
                        headers={["Automation", "Executions", "Success %"]}
                        rows={executive.topAutomations.map((t) => [
                            t.name,
                            String(t.executions),
                            String(t.successRate),
                        ])}
                        empty="No top automations"
                    />
                </div>
            </Card>
        </div>
    );
}
