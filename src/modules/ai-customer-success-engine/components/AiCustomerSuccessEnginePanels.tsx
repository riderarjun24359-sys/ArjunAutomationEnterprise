"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import type {
    AiKnowledgeBase,
    AiReplyGenerator,
    AiSupportInbox,
    AutomationCenter,
    CustomerHealthBoard,
    CustomerSuccessDashboard,
    ExecutiveIntelligence,
    RenewalCenter,
    SlaDashboard,
    TicketManagement,
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

export function SupportInboxPanel({ inbox }: { inbox: AiSupportInbox }) {
    const [query, setQuery] = useState("");
    const [priority, setPriority] = useState("all");
    const [channel, setChannel] = useState("all");

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return inbox.rows.filter((r) => {
            if (priority !== "all" && r.priority !== priority) return false;
            if (channel !== "all" && r.channel !== channel) return false;
            if (!q) return true;
            return `${r.ticketNumber} ${r.subject} ${r.queue} ${r.channel}`.toLowerCase().includes(q);
        });
    }, [inbox.rows, query, priority, channel]);

    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Inbox" value={inbox.rows.length} />
                <Metric label="Open" value={inbox.openCount} />
                <Metric label="Channels" value={inbox.byChannel.filter((c) => c.count > 0).length} />
                <Metric label="Filtered" value={filtered.length} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">AI Support Inbox</h3>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                    Email · WhatsApp · Live Chat · Contact Forms with search and priority filters.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                    {inbox.byChannel.map((c) => (
                        <Badge key={c.channel} variant="info">
                            {c.channel}: {c.count}
                        </Badge>
                    ))}
                </div>
                <div className="mt-3 flex flex-wrap gap-3">
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search inbox…"
                        className="min-w-[220px] flex-1 rounded-[var(--dos-radius-md)] border border-[var(--dos-border)] bg-[var(--dos-surface)] px-3 py-2 text-sm text-[var(--dos-text-primary)]"
                    />
                    <select
                        value={channel}
                        onChange={(e) => setChannel(e.target.value)}
                        className="rounded-[var(--dos-radius-md)] border border-[var(--dos-border)] bg-[var(--dos-surface)] px-3 py-2 text-sm text-[var(--dos-text-primary)]"
                    >
                        <option value="all">All channels</option>
                        {inbox.byChannel.map((c) => (
                            <option key={c.channel} value={c.channel}>
                                {c.channel}
                            </option>
                        ))}
                    </select>
                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="rounded-[var(--dos-radius-md)] border border-[var(--dos-border)] bg-[var(--dos-surface)] px-3 py-2 text-sm text-[var(--dos-text-primary)]"
                    >
                        <option value="all">All priorities</option>
                        {inbox.byPriority.map((p) => (
                            <option key={p.priority} value={p.priority}>
                                {p.priority}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mt-3">
                    <Table
                        headers={["Ticket", "Subject", "Channel", "Priority", "Queue", "Status", "Due"]}
                        rows={filtered.map((r) => [
                            r.ticketNumber,
                            r.subject,
                            r.channel,
                            r.priority,
                            r.queue,
                            r.status,
                            r.dueAt || "—",
                        ])}
                        empty="No inbox items"
                    />
                </div>
            </Card>
        </div>
    );
}

export function TicketManagementPanel({ tickets }: { tickets: TicketManagement }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Total tickets" value={tickets.total} />
                <Metric label="Escalated" value={tickets.escalatedCount} />
                <Metric label="Resolved" value={tickets.resolvedCount} />
                <Metric label="Buckets" value={tickets.buckets.length} />
            </div>
            <div className="grid gap-3 lg:grid-cols-3">
                {tickets.buckets.map((b) => (
                    <Card key={b.status}>
                        <div className="flex items-center justify-between gap-2">
                            <h4 className="font-semibold capitalize text-[var(--dos-text-primary)]">
                                {b.status.replaceAll("_", " ")}
                            </h4>
                            <Badge variant="info">{b.count}</Badge>
                        </div>
                        <div className="mt-3 space-y-2">
                            {b.tickets.slice(0, 5).map((t) => (
                                <div
                                    key={t.id}
                                    className="rounded-[var(--dos-radius-md)] border border-[var(--dos-border)] bg-[var(--dos-surface-tertiary)] p-2"
                                >
                                    <p className="text-sm font-medium text-[var(--dos-text-primary)]">{t.subject}</p>
                                    <p className="text-xs text-[var(--dos-text-secondary)]">
                                        {t.ticketNumber} · {t.priority}
                                    </p>
                                </div>
                            ))}
                            {b.tickets.length === 0 ? (
                                <p className="text-sm text-[var(--dos-text-tertiary)]">No tickets</p>
                            ) : null}
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export function CustomerHealthPanel({ health }: { health: CustomerHealthBoard }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Customers" value={health.rows.length} />
                <Metric label="Avg health" value={health.avgHealth ?? "—"} />
                <Metric label="High churn" value={health.highChurnCount} />
                <Metric label="Expansion opps" value={health.expansionCount} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Customer Health</h3>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                    Health score · usage · login activity · churn risk · expansion opportunity.
                </p>
                <div className="mt-3">
                    <Table
                        headers={["Customer", "Health", "Usage %", "Login", "Churn risk", "Expansion $", "Status"]}
                        rows={health.rows.map((r) => [
                            r.name,
                            String(r.healthScore),
                            String(r.usagePercent),
                            r.loginSignal,
                            String(r.churnRisk),
                            String(r.expansionValue),
                            r.status,
                        ])}
                        empty="No health scores"
                    />
                </div>
            </Card>
        </div>
    );
}

export function RenewalCenterPanel({ renewals }: { renewals: RenewalCenter }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                <Metric label="Upcoming" value={renewals.upcoming} />
                <Metric label="Expired" value={renewals.expired} />
                <Metric label="Payment follow-up" value={renewals.paymentFollowUp} />
                <Metric label="Reminders" value={renewals.reminderQueue} />
                <Metric label="Value" value={renewals.totalValue} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Renewal Center</h3>
                <div className="mt-3">
                    <Table
                        headers={["Name", "Date", "Value", "Bucket", "Status"]}
                        rows={renewals.rows.map((r) => [
                            r.name,
                            r.renewalDate || "—",
                            String(r.valueUsd),
                            r.bucket,
                            r.status,
                        ])}
                        empty="No renewals"
                    />
                </div>
            </Card>
        </div>
    );
}

export function KnowledgeBasePanel({ knowledge }: { knowledge: AiKnowledgeBase }) {
    const [query, setQuery] = useState("");
    const filtered = useMemo(() => {
        const all = [...knowledge.articles, ...knowledge.sops, ...knowledge.faqs];
        const q = query.trim().toLowerCase();
        if (!q) return all;
        return all.filter((k) => `${k.title} ${k.category} ${k.kind}`.toLowerCase().includes(q));
    }, [knowledge.articles, knowledge.sops, knowledge.faqs, query]);

    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Articles" value={knowledge.articles.length} />
                <Metric label="SOPs" value={knowledge.sops.length} />
                <Metric label="FAQs" value={knowledge.faqs.length} />
                <Metric label="AI search index" value={knowledge.searchIndexSize} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">AI Knowledge Base</h3>
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="AI search articles, SOPs, FAQs…"
                    className="mt-3 w-full rounded-[var(--dos-radius-md)] border border-[var(--dos-border)] bg-[var(--dos-surface)] px-3 py-2 text-sm text-[var(--dos-text-primary)]"
                />
                <div className="mt-3">
                    <Table
                        headers={["Title", "Kind", "Category", "Views", "Status"]}
                        rows={filtered.map((k) => [k.title, k.kind, k.category, String(k.views), k.status])}
                        empty="No knowledge items"
                    />
                </div>
            </Card>
        </div>
    );
}

export function ReplyGeneratorPanel({ replies }: { replies: AiReplyGenerator }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Templates" value={replies.templates.length} />
                <Metric label="Friendly" value={replies.byTone.find((t) => t.tone === "friendly")?.count ?? 0} />
                <Metric
                    label="Professional"
                    value={replies.byTone.find((t) => t.tone === "professional")?.count ?? 0}
                />
                <Metric label="Technical" value={replies.byTone.find((t) => t.tone === "technical")?.count ?? 0} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">AI Reply Generator</h3>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                    Email · WhatsApp · Ticket replies across Friendly · Professional · Technical tones.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                    {replies.byChannel.map((c) => (
                        <Badge key={c.channel} variant="info">
                            {c.channel}: {c.count}
                        </Badge>
                    ))}
                </div>
                <div className="mt-3">
                    <Table
                        headers={["Title", "Channel", "Tone", "Shortcut", "Preview"]}
                        rows={replies.templates.map((t) => [
                            t.title,
                            t.channel,
                            t.tone,
                            t.shortcut,
                            t.preview,
                        ])}
                        empty="No reply templates"
                    />
                </div>
            </Card>
        </div>
    );
}

export function SlaDashboardPanel({ sla }: { sla: SlaDashboard }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Avg first response (m)" value={sla.avgFirstResponseMinutes ?? "—"} />
                <Metric label="Avg resolution (m)" value={sla.avgResolutionMinutes ?? "—"} />
                <Metric label="Breaches" value={sla.breachCount} />
                <Metric label="Escalations" value={sla.escalationCount} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">SLA Policies</h3>
                <div className="mt-3">
                    <Table
                        headers={["Policy", "First response", "Resolution", "Compliance %", "Status"]}
                        rows={sla.policies.map((p) => [
                            p.name,
                            String(p.firstResponseMinutes),
                            String(p.resolutionMinutes),
                            String(p.compliancePercent),
                            p.status,
                        ])}
                        empty="No SLA policies"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Team Performance</h3>
                <div className="mt-3">
                    <Table
                        headers={["Queue", "Tickets"]}
                        rows={sla.teamQueues.map((q) => [q.queue, String(q.ticketCount)])}
                        empty="No queue performance"
                    />
                </div>
            </Card>
        </div>
    );
}

export function SuccessDashboardPanel({ success }: { success: CustomerSuccessDashboard }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <Metric label="CSAT" value={success.kpis.csat ?? "—"} />
                <Metric label="NPS" value={success.kpis.nps ?? "—"} />
                <Metric label="Active customers" value={success.kpis.activeCustomers} />
                <Metric label="Churn %" value={success.kpis.churnRate ?? "—"} />
                <Metric label="Retention %" value={success.kpis.retentionRate ?? "—"} />
                <Metric label="Expansion revenue" value={success.kpis.expansionRevenue} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Customer Success Dashboard</h3>
                <p className="mt-2 text-sm text-[var(--dos-text-secondary)]">
                    {success.ratingCount} satisfaction ratings · {success.kpiBoards} KPI boards live from Supabase.
                </p>
            </Card>
        </div>
    );
}

export function AutomationCenterPanel({ automation }: { automation: AutomationCenter }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Rules" value={automation.rules.length} />
                <Metric label="Active" value={automation.activeRules} />
                <Metric
                    label="Routing"
                    value={automation.byKind.find((k) => k.kind === "routing")?.count ?? 0}
                />
                <Metric
                    label="Escalation"
                    value={automation.byKind.find((k) => k.kind === "escalation")?.count ?? 0}
                />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Automation Center</h3>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                    Auto routing · assignment · follow-ups · escalation rules · auto close.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                    {automation.byKind.map((k) => (
                        <Badge key={k.kind} variant="info">
                            {k.kind}: {k.count}
                        </Badge>
                    ))}
                </div>
                <div className="mt-3">
                    <Table
                        headers={["Name", "Kind", "Trigger", "Level", "Active"]}
                        rows={automation.rules.map((r) => [
                            r.name,
                            r.kind,
                            r.trigger,
                            String(r.level),
                            r.active ? "yes" : "no",
                        ])}
                        empty="No automation rules"
                    />
                </div>
            </Card>
        </div>
    );
}

export function ExecutiveIntelligencePanel({ executive }: { executive: ExecutiveIntelligence }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Insights" value={executive.insights.length} />
                <Metric label="High severity" value={executive.highSeverity} />
                <Metric label="Summaries" value={executive.summaries.length} />
                <Metric label="Focus" value="CS + Support" />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Executive Intelligence</h3>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                    Customer health · revenue risk · churn risk · top issues · team KPIs.
                </p>
                <div className="mt-3 space-y-2">
                    {executive.insights.map((i) => (
                        <div
                            key={i.id}
                            className="rounded-[var(--dos-radius-md)] border border-[var(--dos-border)] bg-[var(--dos-surface-tertiary)] p-3"
                        >
                            <div className="flex flex-wrap items-center gap-2">
                                <p className="font-medium text-[var(--dos-text-primary)]">{i.title}</p>
                                <Badge variant={i.severity === "high" ? "warning" : "info"}>{i.category}</Badge>
                                <Badge variant={i.severity === "high" ? "error" : "default"}>{i.severity}</Badge>
                            </div>
                            <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">{i.detail}</p>
                        </div>
                    ))}
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Executive summaries</h3>
                <div className="mt-3">
                    <Table
                        headers={["Title", "Content"]}
                        rows={executive.summaries.map((s) => [s.title, s.content.slice(0, 180)])}
                        empty="No executive summaries"
                    />
                </div>
            </Card>
        </div>
    );
}
