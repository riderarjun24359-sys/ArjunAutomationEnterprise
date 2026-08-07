"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import type {
    AutomationHub,
    DocumentGenerators,
    LeadCaptureCenter,
    LeadQualificationBoard,
    SalesAnalytics,
    SalesPipelineBoard,
    WorkspaceTools,
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

export function LeadCaptureInboxPanel({ capture }: { capture: LeadCaptureCenter }) {
    const [query, setQuery] = useState("");
    const [sourceFilter, setSourceFilter] = useState("all");

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return capture.inbox.filter((row) => {
            if (sourceFilter !== "all" && row.source !== sourceFilter) return false;
            if (!q) return true;
            return [row.leadName, row.companyName, row.email, row.phone, row.source, row.status]
                .join(" ")
                .toLowerCase()
                .includes(q);
        });
    }, [capture.inbox, query, sourceFilter]);

    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Total leads" value={capture.totalLeads} />
                <Metric label="New today" value={capture.newToday} />
                <Metric label="Sources" value={capture.captureChannels.length} />
                <Metric label="Inbox view" value={filtered.length} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">AI Lead Capture Center</h3>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                    Multi-source lead intake with searchable inbox. Capture channels reflect live lead sources.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                    {capture.bySource.map((s) => (
                        <Badge key={s.source} variant="info">
                            {s.source}: {s.count}
                        </Badge>
                    ))}
                </div>
            </Card>
            <Card>
                <div className="flex flex-wrap gap-3">
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search leads…"
                        className="min-w-[220px] flex-1 rounded-[var(--dos-radius-md)] border border-[var(--dos-border)] bg-[var(--dos-surface)] px-3 py-2 text-sm text-[var(--dos-text-primary)]"
                    />
                    <select
                        value={sourceFilter}
                        onChange={(e) => setSourceFilter(e.target.value)}
                        className="rounded-[var(--dos-radius-md)] border border-[var(--dos-border)] bg-[var(--dos-surface)] px-3 py-2 text-sm text-[var(--dos-text-primary)]"
                    >
                        <option value="all">All sources</option>
                        {capture.captureChannels.map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mt-3">
                    <Table
                        headers={["Lead", "Company", "Email", "Source", "Score", "Band", "Status"]}
                        rows={filtered.map((r) => [
                            r.leadName,
                            r.companyName,
                            r.email,
                            r.source,
                            String(r.score),
                            r.scoreBand,
                            r.status,
                        ])}
                        empty="No leads in inbox"
                    />
                </div>
            </Card>
        </div>
    );
}

export function QualificationScoringPanel({ qualify }: { qualify: LeadQualificationBoard }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
                <Metric label="Qualified" value={qualify.qualified} />
                <Metric label="Nurture" value={qualify.nurture} />
                <Metric label="Disqualified" value={qualify.disqualified} />
                <Metric label="Hot" value={qualify.hot} />
                <Metric label="Warm" value={qualify.warm} />
                <Metric label="Cold" value={qualify.cold} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">AI Lead Qualification & Scoring</h3>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                    Deterministic scoring bands: Hot ≥ 70 · Warm 40–69 · Cold &lt; 40.
                </p>
                <div className="mt-3">
                    <Table
                        headers={["Lead", "Company", "Score", "Band", "Qualification", "Reason", "Status"]}
                        rows={qualify.rows.map((r) => [
                            r.leadName,
                            r.companyName,
                            String(r.score),
                            r.scoreBand,
                            r.qualification,
                            r.reason,
                            r.status,
                        ])}
                        empty="No leads to qualify"
                    />
                </div>
            </Card>
        </div>
    );
}

export function PipelineDealsPanel({ pipeline }: { pipeline: SalesPipelineBoard }) {
    const [view, setView] = useState<"kanban" | "list">("kanban");

    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Open deals" value={pipeline.openDealCount} />
                <Metric label="Pipeline value" value={pipeline.pipelineValue} />
                <Metric label="Weighted" value={pipeline.weightedPipeline} />
                <Metric label="Opportunity signals" value={pipeline.opportunities.length} />
            </div>
            <Card>
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Sales Pipeline & Deal Management</h3>
                        <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                            Kanban + list views with AI opportunity detection signals.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setView("kanban")}
                            className={`rounded-[var(--dos-radius-full)] px-3 py-1.5 text-sm ${
                                view === "kanban"
                                    ? "bg-[var(--dos-accent)] text-[var(--dos-accent-contrast,white)]"
                                    : "bg-[var(--dos-surface-tertiary)] text-[var(--dos-text-secondary)]"
                            }`}
                        >
                            Kanban
                        </button>
                        <button
                            type="button"
                            onClick={() => setView("list")}
                            className={`rounded-[var(--dos-radius-full)] px-3 py-1.5 text-sm ${
                                view === "list"
                                    ? "bg-[var(--dos-accent)] text-[var(--dos-accent-contrast,white)]"
                                    : "bg-[var(--dos-surface-tertiary)] text-[var(--dos-text-secondary)]"
                            }`}
                        >
                            List
                        </button>
                    </div>
                </div>
            </Card>

            {view === "kanban" ? (
                <div className="grid gap-3 lg:grid-cols-3 xl:grid-cols-4">
                    {pipeline.stages.map((stage) => (
                        <Card key={stage.stageId}>
                            <div className="flex items-center justify-between gap-2">
                                <h4 className="font-semibold text-[var(--dos-text-primary)]">{stage.stageName}</h4>
                                <Badge variant="info">{stage.deals.length}</Badge>
                            </div>
                            <p className="mt-1 text-xs text-[var(--dos-text-tertiary)]">
                                {stage.probability}% · {stage.totalAmount}
                            </p>
                            <div className="mt-3 space-y-2">
                                {stage.deals.length === 0 ? (
                                    <p className="text-sm text-[var(--dos-text-tertiary)]">No deals</p>
                                ) : (
                                    stage.deals.map((d) => (
                                        <div
                                            key={d.id}
                                            className="rounded-[var(--dos-radius-md)] border border-[var(--dos-border)] bg-[var(--dos-surface-tertiary)] p-2"
                                        >
                                            <p className="text-sm font-medium text-[var(--dos-text-primary)]">{d.name}</p>
                                            <p className="text-xs text-[var(--dos-text-secondary)]">
                                                {d.opportunityNumber} · {d.amount} · {d.probability}%
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card>
                    <Table
                        headers={["Deal", "Number", "Stage", "Amount", "Weighted", "Prob", "Status", "Close"]}
                        rows={pipeline.listDeals.map((d) => [
                            d.name,
                            d.opportunityNumber,
                            d.stageName,
                            String(d.amount),
                            String(d.weightedAmount),
                            String(d.probability),
                            d.status,
                            d.expectedCloseDate || "—",
                        ])}
                        empty="No deals"
                    />
                </Card>
            )}

            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">AI Opportunity Detection</h3>
                <div className="mt-3">
                    <Table
                        headers={["Opportunity", "Amount", "Prob", "Signal", "Stage", "Status"]}
                        rows={pipeline.opportunities.map((o) => [
                            o.name,
                            String(o.amount),
                            String(o.probability),
                            o.signal,
                            o.stageName,
                            o.status,
                        ])}
                        empty="No open opportunities"
                    />
                </div>
            </Card>
        </div>
    );
}

export function DocumentsPanel({ documents }: { documents: DocumentGenerators }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Proposals" value={documents.proposals.length} />
                <Metric label="Quotations" value={documents.quotations.length} />
                <Metric label="Contracts" value={documents.contracts.length} />
                <Metric label="Pending" value={documents.pendingCount} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Document generators</h3>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                    Proposal, quotation, and contract generators fed by live CMP/BA/sales quote and estimate records.
                    Total document value: {documents.totalValue}
                </p>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Proposal Generator</h3>
                <div className="mt-3">
                    <Table
                        headers={["Title", "Ref", "Status", "Value"]}
                        rows={documents.proposals.map((d) => [d.title, d.ref, d.status, String(d.value)])}
                        empty="No proposals"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Quotation Generator</h3>
                <div className="mt-3">
                    <Table
                        headers={["Title", "Number", "Status", "Value", "Valid until"]}
                        rows={documents.quotations.map((d) => [
                            d.title,
                            d.ref,
                            d.status,
                            String(d.value),
                            d.validUntil || "—",
                        ])}
                        empty="No quotations"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Contract Generator</h3>
                <div className="mt-3">
                    <Table
                        headers={["Title", "Ref", "Status", "Value"]}
                        rows={documents.contracts.map((d) => [d.title, d.ref, d.status, String(d.value)])}
                        empty="No contracts"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Estimates</h3>
                <div className="mt-3">
                    <Table
                        headers={["Title", "Number", "Status", "Value", "Valid until"]}
                        rows={documents.estimates.map((d) => [
                            d.title,
                            d.ref,
                            d.status,
                            String(d.value),
                            d.validUntil || "—",
                        ])}
                        empty="No estimates"
                    />
                </div>
            </Card>
        </div>
    );
}

export function AutomationIntegrationsPanel({ automation }: { automation: AutomationHub }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Follow-ups" value={automation.followUps.length} />
                <Metric label="Email signals" value={automation.emailSignals} />
                <Metric label="Meetings" value={automation.meetingSignals} />
                <Metric label="Notifications" value={automation.notificationCount} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">AI Sales Assistant</h3>
                <div className="mt-3 space-y-2">
                    {automation.assistantInsights.map((i) => (
                        <div
                            key={i.id}
                            className="rounded-[var(--dos-radius-md)] border border-[var(--dos-border)] bg-[var(--dos-surface-tertiary)] p-3"
                        >
                            <div className="flex items-center gap-2">
                                <p className="font-medium text-[var(--dos-text-primary)]">{i.title}</p>
                                <Badge variant={i.priority === "high" ? "warning" : "info"}>{i.priority}</Badge>
                            </div>
                            <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">{i.detail}</p>
                        </div>
                    ))}
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Follow-up Automation</h3>
                <div className="mt-3">
                    <Table
                        headers={["Subject", "Type", "Due", "Status", "Related"]}
                        rows={automation.followUps.map((f) => [
                            f.subject,
                            f.activityType,
                            f.dueAt || "—",
                            f.status,
                            f.related,
                        ])}
                        empty="No follow-ups"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Integration Architecture</h3>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                    Email, WhatsApp, and Calendar channels are architected against live sales signals without weakening
                    tenant isolation.
                </p>
                <div className="mt-3">
                    <Table
                        headers={["Channel", "Status", "Live signals", "Detail"]}
                        rows={automation.integrations.map((i) => [
                            i.channel,
                            i.status,
                            String(i.liveSignals),
                            i.detail,
                        ])}
                        empty="No integrations"
                    />
                </div>
            </Card>
        </div>
    );
}

export function AnalyticsPanel({ analytics }: { analytics: SalesAnalytics }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Leads" value={analytics.kpis.totalLeads} />
                <Metric label="Open opps" value={analytics.kpis.openOpportunities} />
                <Metric label="Pipeline" value={analytics.kpis.pipelineValue} />
                <Metric label="Win rate %" value={analytics.kpis.winRate} />
                <Metric label="Weighted" value={analytics.kpis.weightedPipeline} />
                <Metric label="Closed won" value={analytics.kpis.closedWonValue} />
                <Metric label="Active quotes" value={analytics.kpis.activeQuotes} />
                <Metric label="Target %" value={analytics.kpis.targetAchievement} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Conversion Funnel Analytics</h3>
                <div className="mt-3">
                    <Table
                        headers={["Stage", "Count", "Conv. from prior %"]}
                        rows={analytics.funnel.map((f) => [
                            f.stage,
                            String(f.count),
                            f.conversionFromPrior == null ? "—" : String(f.conversionFromPrior),
                        ])}
                        empty="No funnel data"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Revenue Forecasting</h3>
                <div className="mt-3">
                    <Table
                        headers={["Period", "Date", "Pipeline", "Weighted", "Closed", "Notes"]}
                        rows={analytics.forecasts.map((f) => [
                            f.period,
                            f.forecastDate,
                            String(f.pipelineValue),
                            String(f.weightedValue),
                            String(f.closedValue),
                            f.notes,
                        ])}
                        empty="No forecasts"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Win / Loss Analytics</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant="success">Wins: {analytics.winCount}</Badge>
                    <Badge variant="warning">Losses: {analytics.lossCount}</Badge>
                </div>
                <div className="mt-3">
                    <Table
                        headers={["Outcome", "Reason", "Competitor", "Amount", "Recorded"]}
                        rows={analytics.winLoss.map((w) => [
                            w.outcome,
                            w.reason,
                            w.competitor,
                            String(w.amount),
                            w.recordedAt,
                        ])}
                        empty="No win/loss records"
                    />
                </div>
            </Card>
        </div>
    );
}

export function WorkspacePanel({ workspace }: { workspace: WorkspaceTools }) {
    const [query, setQuery] = useState("");
    const [preset, setPreset] = useState("all");

    const filteredTimeline = useMemo(() => {
        const q = query.trim().toLowerCase();
        return workspace.timeline.filter((e) => {
            if (preset !== "all" && !e.kind.toLowerCase().includes(preset.replace(/-/g, ""))) {
                if (preset === "overdue-followups" && e.kind !== "activity") return false;
            }
            if (!q) return true;
            return `${e.title} ${e.detail} ${e.kind}`.toLowerCase().includes(q);
        });
    }, [workspace.timeline, query, preset]);

    const exportCsv = () => {
        const header = "at,kind,title,detail\n";
        const body = workspace.timeline
            .map((e) =>
                [e.at, e.kind, e.title, e.detail]
                    .map((c) => `"${String(c).replaceAll('"', '""')}"`)
                    .join(","),
            )
            .join("\n");
        const blob = new Blob([header + body], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "ai-sales-lead-engine-timeline.csv";
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Open tasks" value={workspace.openTasks} />
                <Metric label="Completed" value={workspace.completedTasks} />
                <Metric label="Search index" value={workspace.searchIndexSize} />
                <Metric label="Timeline events" value={workspace.timeline.length} />
            </div>
            <Card>
                <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Search, Filters & Export</h3>
                        <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                            Filter activity timeline and export CSV for founder reviews.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={exportCsv}
                        disabled={!workspace.exportReady || workspace.timeline.length === 0}
                        className="rounded-[var(--dos-radius-full)] bg-[var(--dos-accent)] px-4 py-2 text-sm font-medium text-[var(--dos-accent-contrast,white)] disabled:opacity-50"
                    >
                        Export CSV
                    </button>
                </div>
                <div className="mt-3 flex flex-wrap gap-3">
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search timeline…"
                        className="min-w-[220px] flex-1 rounded-[var(--dos-radius-md)] border border-[var(--dos-border)] bg-[var(--dos-surface)] px-3 py-2 text-sm text-[var(--dos-text-primary)]"
                    />
                    <select
                        value={preset}
                        onChange={(e) => setPreset(e.target.value)}
                        className="rounded-[var(--dos-radius-md)] border border-[var(--dos-border)] bg-[var(--dos-surface)] px-3 py-2 text-sm text-[var(--dos-text-primary)]"
                    >
                        <option value="all">All events</option>
                        {workspace.filterPresets.map((p) => (
                            <option key={p} value={p}>
                                {p}
                            </option>
                        ))}
                    </select>
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Sales Tasks</h3>
                <div className="mt-3">
                    <Table
                        headers={["Subject", "Type", "Due", "Completed"]}
                        rows={workspace.tasks.map((t) => [
                            t.subject,
                            t.activityType,
                            t.dueAt || "—",
                            t.completed ? "yes" : "no",
                        ])}
                        empty="No sales tasks"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Activity Timeline</h3>
                <div className="mt-3">
                    <Table
                        headers={["When", "Kind", "Title", "Detail"]}
                        rows={filteredTimeline.map((e) => [e.at, e.kind, e.title, e.detail])}
                        empty="No timeline events"
                    />
                </div>
            </Card>
        </div>
    );
}
