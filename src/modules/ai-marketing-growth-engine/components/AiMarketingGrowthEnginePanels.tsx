"use client";

import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import type {
    AiBrandVoiceManager,
    AiCampaignPlanner,
    AiContentCalendar,
    AiContentGenerator,
    AiPromptLibrary,
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

export function AiContentGeneratorPanel({ content }: { content: AiContentGenerator }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Total pieces" value={content.pieces.length} />
                <Metric label="Drafts" value={content.draftCount} />
                <Metric label="Ready" value={content.readyCount} />
                <Metric label="Channels covered" value={content.byChannel.filter((c) => c.count > 0).length} />
            </div>
            <Card>
                <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Channel mix</h3>
                    {content.byChannel.map((c) => (
                        <Badge key={c.channel} variant={c.count > 0 ? "info" : "default"}>
                            {c.channel}: {c.count}
                        </Badge>
                    ))}
                </div>
                <p className="mt-2 text-sm text-[var(--dos-text-secondary)]">
                    AI Content Generator covers blogs, emails, LinkedIn, X, Facebook, and Instagram from live AAGE
                    templates and generators.
                </p>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Blogs</h3>
                <div className="mt-3">
                    <Table
                        headers={["Title", "Type", "Tone", "Words", "Status"]}
                        rows={content.blogs.map((r) => [
                            r.title,
                            r.contentType,
                            r.tone,
                            String(r.wordCount),
                            r.status,
                        ])}
                        empty="No blog content"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Emails</h3>
                <div className="mt-3">
                    <Table
                        headers={["Title", "Type", "Tone", "Status"]}
                        rows={content.emails.map((r) => [r.title, r.contentType, r.tone, r.status])}
                        empty="No email content"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">LinkedIn · X · Facebook · Instagram</h3>
                <div className="mt-3">
                    <Table
                        headers={["Title", "Channel", "Type", "Tone", "Status"]}
                        rows={[...content.linkedin, ...content.x, ...content.facebook, ...content.instagram].map(
                            (r) => [r.title, String(r.channel), r.contentType, r.tone, r.status],
                        )}
                        empty="No social content"
                    />
                </div>
            </Card>
        </div>
    );
}

export function AiCampaignPlannerPanel({ campaigns }: { campaigns: AiCampaignPlanner }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Campaign plans" value={campaigns.plans.length} />
                <Metric label="Active" value={campaigns.activeCampaigns} />
                <Metric label="Total assets" value={campaigns.totalAssets} />
                <Metric label="Dashboards" value={campaigns.dashboards.length} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Phase pipeline</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                    {campaigns.byPhase.map((p) => (
                        <Badge key={p.phase} variant="info">
                            {p.phase}: {p.count}
                        </Badge>
                    ))}
                </div>
                <p className="mt-3 text-sm text-[var(--dos-text-secondary)]">
                    AI Campaign Planner maps live campaign builders into ideation → planning → production → launch →
                    optimize.
                </p>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Campaign plans</h3>
                <div className="mt-3">
                    <Table
                        headers={["Name", "Type", "Phase", "Assets", "Status"]}
                        rows={campaigns.plans.map((p) => [
                            p.name,
                            p.campaignType,
                            p.phase,
                            String(p.assetCount),
                            p.status,
                        ])}
                        empty="No campaign plans"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Campaign dashboards</h3>
                <div className="mt-3">
                    <Table
                        headers={["Dashboard", "Campaign ref", "Cadence", "Status"]}
                        rows={campaigns.dashboards.map((d) => [
                            d.name,
                            d.campaignRef,
                            d.refreshCadence,
                            d.status,
                        ])}
                        empty="No campaign dashboards"
                    />
                </div>
            </Card>
        </div>
    );
}

export function AiBrandVoiceManagerPanel({ brandVoice }: { brandVoice: AiBrandVoiceManager }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Voice profiles" value={brandVoice.voices.length} />
                <Metric label="Active voices" value={brandVoice.activeVoices} />
                <Metric label="Guidelines" value={brandVoice.guidelines.length} />
                <Metric label="Coverage" value={brandVoice.coverageScore ?? "—"} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Brand voice profiles</h3>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                    Tone, style, and formality controls for consistent AI-generated marketing output.
                </p>
                <div className="mt-3">
                    <Table
                        headers={["Name", "Tone", "Style", "Formality", "Status"]}
                        rows={brandVoice.voices.map((v) => [v.name, v.tone, v.style, v.formality, v.status])}
                        empty="No brand voices"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Guidelines</h3>
                <div className="mt-3">
                    <Table
                        headers={["Name", "Category", "Version", "Status"]}
                        rows={brandVoice.guidelines.map((g) => [g.name, g.category, g.version, g.status])}
                        empty="No guidelines"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Messaging pillars</h3>
                <div className="mt-3">
                    <Table
                        headers={["Title", "Type", "Audience", "Status"]}
                        rows={brandVoice.messaging.map((m) => [m.title, m.type, m.audience, m.status])}
                        empty="No messaging pillars"
                    />
                </div>
            </Card>
        </div>
    );
}

export function AiPromptLibraryPanel({ prompts }: { prompts: AiPromptLibrary }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Prompts" value={prompts.prompts.length} />
                <Metric label="Idea prompts" value={prompts.ideaPrompts.length} />
                <Metric label="Script prompts" value={prompts.scriptPrompts.length} />
                <Metric label="CTA prompts" value={prompts.ctaPrompts.length} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Categories</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                    {prompts.byCategory.length === 0 ? (
                        <p className="text-sm text-[var(--dos-text-secondary)]">No prompt categories yet.</p>
                    ) : (
                        prompts.byCategory.map((c) => (
                            <Badge key={c.category} variant="info">
                                {c.category}: {c.count}
                            </Badge>
                        ))
                    )}
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Prompt library</h3>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                    Reusable AI prompts sourced from idea, script, CTA, and caption generators.
                </p>
                <div className="mt-3">
                    <Table
                        headers={["Name", "Kind", "Category", "Output", "Status"]}
                        rows={prompts.prompts.map((p) => [p.name, p.kind, p.category, p.outputFormat, p.status])}
                        empty="No prompts"
                    />
                </div>
            </Card>
        </div>
    );
}

export function AiContentCalendarPanel({ calendar }: { calendar: AiContentCalendar }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Scheduled" value={calendar.scheduledCount} />
                <Metric label="Entries" value={calendar.entries.length} />
                <Metric label="Upcoming" value={calendar.upcoming.length} />
                <Metric label="Overdue" value={calendar.overdueCount} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">By content type</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                    {calendar.byContentType.map((t) => (
                        <Badge key={t.contentType} variant="info">
                            {t.contentType}: {t.count}
                        </Badge>
                    ))}
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Upcoming schedule</h3>
                <div className="mt-3">
                    <Table
                        headers={["Name", "Type", "Scheduled", "Week", "Status"]}
                        rows={calendar.upcoming.map((e) => [
                            e.name,
                            e.contentType,
                            e.scheduledDate,
                            e.weekBucket,
                            e.status,
                        ])}
                        empty="No upcoming calendar entries"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Full calendar</h3>
                <div className="mt-3">
                    <Table
                        headers={["Name", "Type", "Scheduled", "Week", "Status"]}
                        rows={calendar.entries.map((e) => [
                            e.name,
                            e.contentType,
                            e.scheduledDate,
                            e.weekBucket,
                            e.status,
                        ])}
                        empty="No calendar entries"
                    />
                </div>
            </Card>
        </div>
    );
}
