"use client";

import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import type {
    AiResearchEngine,
    AnalyticsFoundation,
    BrandAssetManager,
    ContentWorkspace,
    WorkflowEngine,
} from "../types";

function Metric({ label, value }: { label: string; value: string | number }) {
    return (
        <Card>
            <p className="text-xs uppercase tracking-[0.14em] text-[var(--dos-text-tertiary)]">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-[var(--dos-text-primary)]">{value}</p>
        </Card>
    );
}

function Table({
    headers,
    rows,
    empty,
}: {
    headers: string[];
    rows: string[][];
    empty: string;
}) {
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

export function BrandAssetManagerPanel({ brand }: { brand: BrandAssetManager }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Logos" value={brand.logoCount} />
                <Metric label="Templates" value={brand.templateCount} />
                <Metric label="Palette systems" value={brand.colors.length} />
                <Metric label="Approval rules" value={brand.approvalRules.length} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Logo management</h3>
                <div className="mt-3">
                    <Table
                        headers={["Name", "Variant", "Format", "Status"]}
                        rows={brand.logos.map((l) => [l.name, l.variant, l.format, l.status])}
                        empty="No logos in brand library"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Color palette</h3>
                <div className="mt-3">
                    <Table
                        headers={["Name", "Primary", "Secondary", "Accent"]}
                        rows={brand.colors.map((c) => [c.name, c.primaryHex, c.secondaryHex, c.accentHex])}
                        empty="No color systems"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Fonts & guidelines</h3>
                <div className="mt-3">
                    <Table
                        headers={["Name", "Category", "Version", "Status"]}
                        rows={brand.fonts.map((f) => [f.name, f.category, f.version, f.status])}
                        empty="No typography guidelines"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Templates</h3>
                <div className="mt-3">
                    <Table
                        headers={["Name", "Kind", "Status"]}
                        rows={brand.templates.map((t) => [t.name, t.kind, t.status])}
                        empty="No templates"
                    />
                </div>
            </Card>
            <Card>
                <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Brand approval workflow</h3>
                    <Badge variant="info">{brand.pendingApprovals} rules</Badge>
                </div>
                <div className="mt-3">
                    <Table
                        headers={["Rule", "Level", "Entity", "Status"]}
                        rows={brand.approvalRules.map((r) => [r.name, r.approvalLevel, r.entityType, r.status])}
                        empty="No brand approval rules"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Central brand library</h3>
                <div className="mt-3">
                    <Table
                        headers={["Title", "Category", "Ref", "Status"]}
                        rows={brand.library.map((a) => [a.title, a.category, a.ref || "—", a.status])}
                        empty="Brand library empty"
                    />
                </div>
            </Card>
        </div>
    );
}

export function ContentWorkspacePanel({ content }: { content: ContentWorkspace }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Calendar items" value={content.calendar.length} />
                <Metric label="Campaigns" value={content.campaigns.length} />
                <Metric label="Drafts" value={content.draftCount} />
                <Metric label="In review" value={content.reviewCount} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Content calendar</h3>
                <div className="mt-3">
                    <Table
                        headers={["Name", "Type", "Scheduled", "Status"]}
                        rows={content.calendar.map((c) => [c.name, c.contentType, c.scheduledDate, c.status])}
                        empty="No calendar entries"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Campaign planner</h3>
                <div className="mt-3">
                    <Table
                        headers={["Campaign", "Channel", "Status", "Window"]}
                        rows={content.campaigns.map((c) => [
                            c.name,
                            c.channel,
                            c.status,
                            `${c.startsAt ?? "—"} → ${c.endsAt ?? "—"}`,
                        ])}
                        empty="No campaigns"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Draft management</h3>
                <div className="mt-3">
                    <Table
                        headers={["Title", "Type", "Priority", "Status"]}
                        rows={content.drafts.map((d) => [d.title, d.contentType, d.priority, d.status])}
                        empty="No drafts"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Review & approval</h3>
                <div className="mt-3">
                    <Table
                        headers={["Title", "Type", "Approver", "Status"]}
                        rows={content.reviews.map((r) => [r.title, r.contentType, r.approverRef || "—", r.status])}
                        empty="No reviews pending"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Asset library</h3>
                <div className="mt-3">
                    <Table
                        headers={["Name", "Type", "Status"]}
                        rows={content.assets.map((a) => [a.name, a.assetType, a.status])}
                        empty="No content assets"
                    />
                </div>
            </Card>
        </div>
    );
}

export function AiResearchEnginePanel({ research }: { research: AiResearchEngine }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Industry trends" value={research.trends.length} />
                <Metric label="Competitor signals" value={research.competitors.length} />
                <Metric label="SEO keywords" value={research.keywordCount} />
                <Metric label="Opportunities" value={research.opportunityCount} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Industry trends</h3>
                <div className="mt-3">
                    <Table
                        headers={["Industry", "Vertical", "Segment", "Status"]}
                        rows={research.trends.map((t) => [t.name, t.vertical, t.segment, t.status])}
                        empty="No industry library rows"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Competitor monitoring</h3>
                <div className="mt-3">
                    <Table
                        headers={["Competitor", "Outcome", "Reason", "Amount"]}
                        rows={research.competitors.map((c) => [
                            c.competitor,
                            c.outcome,
                            c.reason,
                            String(c.amount),
                        ])}
                        empty="No competitor signals"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">SEO keyword research</h3>
                <div className="mt-3">
                    <Table
                        headers={["Assistant", "Keyword focus", "Intent", "Status"]}
                        rows={research.keywords.map((k) => [k.name, k.keywordFocus, k.searchIntent, k.status])}
                        empty="No SEO assistants"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Content opportunities</h3>
                <div className="mt-3">
                    <Table
                        headers={["Opportunity", "Type", "Format", "Status"]}
                        rows={research.opportunities.map((o) => [o.name, o.contentType, o.outputFormat, o.status])}
                        empty="No idea generators"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Audience insights</h3>
                <div className="mt-3">
                    <Table
                        headers={["Message", "Audience", "Type", "Status"]}
                        rows={research.audiences.map((a) => [a.title, a.audienceSegment, a.messagingType, a.status])}
                        empty="No audience messaging"
                    />
                </div>
            </Card>
        </div>
    );
}

export function WorkflowEnginePanel({ workflow }: { workflow: WorkflowEngine }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                {workflow.stages.map((s) => (
                    <Metric key={s.stage} label={s.stage} value={s.count} />
                ))}
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">
                    Draft → Review → Approved → Scheduled → Published
                </h3>
                <div className="mt-3">
                    <Table
                        headers={["Title", "Type", "Stage", "Role", "Source"]}
                        rows={workflow.items.map((i) => [i.title, i.contentType, i.stage, i.roleRequired, i.source])}
                        empty="No workflow items"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Role-based approvals</h3>
                <div className="mt-3">
                    <Table
                        headers={["Role", "Pending"]}
                        rows={workflow.roleApprovals.map((r) => [r.role, String(r.pending)])}
                        empty="No role approval queues"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Audit log</h3>
                <div className="mt-3">
                    <Table
                        headers={["Entity", "Action", "Summary", "By", "At"]}
                        rows={workflow.auditLog.map((a) => [
                            a.entityType,
                            a.action,
                            a.summary,
                            a.performedBy ?? "—",
                            a.createdAt,
                        ])}
                        empty="No audit events"
                    />
                </div>
            </Card>
        </div>
    );
}

export function AnalyticsFoundationPanel({ analytics }: { analytics: AnalyticsFoundation }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                <Metric label="Avg open %" value={analytics.avgOpenRatePercent ?? "—"} />
                <Metric label="Avg click %" value={analytics.avgClickRatePercent ?? "—"} />
                <Metric label="Content score" value={analytics.avgContentScore ?? "—"} />
                <Metric label="Growth score" value={analytics.growthScore ?? "—"} />
                <Metric label="Brand health" value={analytics.brandHealthScore ?? "—"} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Campaign metrics</h3>
                <div className="mt-3">
                    <Table
                        headers={["Campaign", "Open %", "Click %", "Sent", "Delivered"]}
                        rows={analytics.campaignMetrics.map((m) => [
                            m.name,
                            String(m.openRate),
                            String(m.clickRate),
                            String(m.sentCount),
                            String(m.deliveredCount),
                        ])}
                        empty="No campaign metrics"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Content performance</h3>
                <div className="mt-3">
                    <Table
                        headers={["Title", "Type", "Score", "Measured"]}
                        rows={analytics.contentPerformance.map((p) => [
                            p.title,
                            p.contentType,
                            String(p.score),
                            p.measuredAt,
                        ])}
                        empty="No content performance"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">SEO dashboard foundation</h3>
                <div className="mt-3">
                    <Table
                        headers={["Name", "Keyword", "Intent", "Status"]}
                        rows={analytics.seoDashboard.map((s) => [s.name, s.keywordFocus, s.searchIntent, s.status])}
                        empty="No SEO dashboard rows"
                    />
                </div>
            </Card>
        </div>
    );
}
