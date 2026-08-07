"use client";

import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import type {
    CampaignOrchestrator,
    DistributionAnalytics,
    PublishingScheduler,
    ReleaseManager,
    SocialDistribution,
    WebsitePublisher,
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

export function CampaignOrchestratorPanel({ campaigns }: { campaigns: CampaignOrchestrator }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Campaigns" value={campaigns.campaigns.length} />
                <Metric label="Templates" value={campaigns.templates.length} />
                <Metric label="Timeline events" value={campaigns.timeline.length} />
                <Metric label="Pending approvals" value={campaigns.pendingApprovals} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Campaign creation & planning</h3>
                <div className="mt-3">
                    <Table
                        headers={["Name", "Channel", "Status", "Window"]}
                        rows={campaigns.campaigns.map((c) => [
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
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Multi-channel plans</h3>
                <div className="mt-3">
                    <Table
                        headers={["Campaign", "Channels"]}
                        rows={campaigns.multiChannelPlans.map((p) => [p.name, p.channels.join(", ")])}
                        empty="No multi-channel plans"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Campaign templates</h3>
                <div className="mt-3">
                    <Table
                        headers={["Name", "Type", "Status"]}
                        rows={campaigns.templates.map((t) => [t.name, t.campaignType, t.status])}
                        empty="No campaign templates"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Campaign timeline</h3>
                <div className="mt-3">
                    <Table
                        headers={["Campaign", "Kind", "When", "Label"]}
                        rows={campaigns.timeline.map((t) => [t.campaignName, t.kind, t.at || "—", t.label])}
                        empty="No timeline events"
                    />
                </div>
            </Card>
            <Card>
                <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">
                        Founder / Admin approval workflow
                    </h3>
                    <Badge variant="info">{campaigns.pendingApprovals} pending</Badge>
                </div>
                <div className="mt-3">
                    <Table
                        headers={["Title", "Type", "Approver", "Status"]}
                        rows={campaigns.approvalQueue.map((a) => [
                            a.title,
                            a.contentType,
                            a.approverRef || "founder/admin",
                            a.status,
                        ])}
                        empty="No approvals"
                    />
                </div>
            </Card>
        </div>
    );
}

export function PublishingSchedulerPanel({ scheduler }: { scheduler: PublishingScheduler }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Queue" value={scheduler.queue.length} />
                <Metric label="Calendar items" value={scheduler.calendar.length} />
                <Metric label="Retry / recovery" value={scheduler.retryQueue.length} />
                <Metric label="History" value={scheduler.history.length} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Queue management</h3>
                <div className="mt-3">
                    <Table
                        headers={["Title", "Type", "Publish at", "TZ hint", "Status"]}
                        rows={scheduler.queue.map((q) => [
                            q.title,
                            q.contentType,
                            q.publishAt,
                            q.timezoneHint,
                            q.status,
                        ])}
                        empty="Publishing queue empty"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Calendar view</h3>
                <div className="mt-3">
                    <Table
                        headers={["When", "Title", "Type", "Best-time score"]}
                        rows={scheduler.calendar.map((c) => [
                            c.publishAt,
                            c.title,
                            c.contentType,
                            c.bestTimeScore == null ? "—" : String(c.bestTimeScore),
                        ])}
                        empty="No calendar entries"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Best-time recommendations</h3>
                <div className="mt-3">
                    <Table
                        headers={["Slot", "Reason", "Score"]}
                        rows={scheduler.bestTimeRecommendations.map((r) => [r.slot, r.reason, String(r.score)])}
                        empty="No recommendations from live queue"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Publishing history</h3>
                <div className="mt-3">
                    <Table
                        headers={["Title", "Type", "Published", "Status"]}
                        rows={scheduler.history.map((h) => [h.title, h.contentType, h.publishedAt, h.status])}
                        empty="No publishing history"
                    />
                </div>
            </Card>
        </div>
    );
}

export function WebsitePublisherPanel({ website }: { website: WebsitePublisher }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <Metric label="Blogs" value={website.blogs.length} />
                <Metric label="Landing pages" value={website.landings.length} />
                <Metric label="Case studies" value={website.caseStudies.length} />
                <Metric label="Knowledge base" value={website.knowledge.length} />
                <Metric label="SEO meta synced" value={website.seoSyncCount} />
                <Metric label="Sitemap triggers" value={website.sitemapTriggers} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Website publisher</h3>
                <div className="mt-3">
                    <Table
                        headers={["Title", "Kind", "SEO focus", "Meta", "Sitemap", "Status"]}
                        rows={website.pages.map((p) => [
                            p.title,
                            p.kind,
                            p.seoFocus || "—",
                            p.metaSynced ? "synced" : "pending",
                            p.sitemapTrigger ? "trigger" : "—",
                            p.status,
                        ])}
                        empty="No website publish targets"
                    />
                </div>
            </Card>
        </div>
    );
}

export function SocialDistributionPanel({ social }: { social: SocialDistribution }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <Metric label="Channels" value={social.channels.length} />
                <Metric label="Queue items" value={social.queue.length} />
                <Metric
                    label="Bound connectors"
                    value={social.connectorSlots.filter((c) => c.status === "bound").length}
                />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">
                    Connector architecture (official API slots)
                </h3>
                <div className="mt-3">
                    <Table
                        headers={["Slot", "Status"]}
                        rows={social.connectorSlots.map((c) => [c.slot, c.status])}
                        empty="No connector slots"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Channels · formatting · rate limits</h3>
                <div className="mt-3">
                    <Table
                        headers={["Name", "Platform", "Post type", "Connector", "Rate-limit aware", "Status"]}
                        rows={social.channels.map((c) => [
                            c.name,
                            c.platform,
                            c.postType,
                            c.connectorSlot,
                            c.rateLimitAware ? "yes" : "no",
                            c.status,
                        ])}
                        empty="No social channels"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">
                    Publishing status · media · failure recovery
                </h3>
                <div className="mt-3">
                    <Table
                        headers={["Title", "Type", "Media", "Recoverable", "Status"]}
                        rows={social.queue.map((q) => [
                            q.title,
                            q.contentType,
                            q.mediaAttached ? "attached" : "—",
                            q.failureRecoverable ? "yes" : "no",
                            q.status,
                        ])}
                        empty="Social distribution queue empty"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Status tracking</h3>
                <div className="mt-3">
                    <Table
                        headers={["Status", "Count"]}
                        rows={social.statusBreakdown.map((s) => [s.status, String(s.count)])}
                        empty="No status breakdown"
                    />
                </div>
            </Card>
        </div>
    );
}

export function ReleaseManagerPanel({ releases }: { releases: ReleaseManager }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <Metric label="Releases" value={releases.releases.length} />
                <Metric label="Audit events" value={releases.auditTrail.length} />
                <Metric label="Pending approvals" value={releases.pendingApprovals} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">
                    Versioned campaign releases · rollback
                </h3>
                <div className="mt-3">
                    <Table
                        headers={["Name", "Version", "Channels", "Rollback", "Status"]}
                        rows={releases.releases.map((r) => [
                            r.name,
                            r.version,
                            r.channels.join(", "),
                            r.rollbackAvailable ? "available" : "—",
                            r.status,
                        ])}
                        empty="No releases"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Audit trail</h3>
                <div className="mt-3">
                    <Table
                        headers={["Entity", "Action", "Summary", "At"]}
                        rows={releases.auditTrail.map((a) => [a.entityType, a.action, a.summary, a.at])}
                        empty="No audit trail"
                    />
                </div>
            </Card>
        </div>
    );
}

export function DistributionAnalyticsPanel({ analytics }: { analytics: DistributionAnalytics }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Success rate %" value={analytics.successRatePercent ?? "—"} />
                <Metric label="Delivery rows" value={analytics.deliveryStatus.length} />
                <Metric label="UTM campaigns" value={analytics.utmCatalog.length} />
                <Metric label="Attributions" value={analytics.attribution.length} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Delivery status</h3>
                <div className="mt-3">
                    <Table
                        headers={["Name", "Type", "Score", "Measured"]}
                        rows={analytics.deliveryStatus.map((d) => [
                            d.name,
                            d.type,
                            String(d.score),
                            d.measuredAt,
                        ])}
                        empty="No delivery analytics"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Channel performance</h3>
                <div className="mt-3">
                    <Table
                        headers={["Channel", "Deliveries", "Open %", "Click %"]}
                        rows={analytics.channelPerformance.map((c) => [
                            c.channel,
                            String(c.deliveries),
                            String(c.openRate),
                            String(c.clickRate),
                        ])}
                        empty="No channel performance"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Click tracking</h3>
                <div className="mt-3">
                    <Table
                        headers={["Campaign", "Est. clicks"]}
                        rows={analytics.clickTracking.map((c) => [c.name, String(c.clicks)])}
                        empty="No click tracking"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">UTM management</h3>
                <div className="mt-3">
                    <Table
                        headers={["Campaign", "Source", "Medium", "Content"]}
                        rows={analytics.utmCatalog.map((u) => [u.campaign, u.source, u.medium, u.content])}
                        empty="No UTM catalog"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Campaign attribution foundation</h3>
                <div className="mt-3">
                    <Table
                        headers={["Title", "Channel", "Conversion %", "Status"]}
                        rows={analytics.attribution.map((a) => [
                            a.title,
                            a.channel,
                            String(a.conversionRate),
                            a.status,
                        ])}
                        empty="No attribution rows"
                    />
                </div>
            </Card>
        </div>
    );
}
