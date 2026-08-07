"use client";

import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import type {
    AiBlogStudio,
    BrandCompliance,
    EmailContent,
    LandingPageGenerator,
    SeoIntelligence,
    SocialContentEngine,
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

export function AiBlogStudioPanel({ blog }: { blog: AiBlogStudio }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Articles" value={blog.articles.length} />
                <Metric label="Topic clusters" value={blog.topicClusters.length} />
                <Metric label="Pillar pages" value={blog.pillarPages.length} />
                <Metric label="Schema-ready" value={blog.schemaReadyCount} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">SEO-first article generation</h3>
                <div className="mt-3">
                    <Table
                        headers={["Title", "Type", "Words", "Role", "Status"]}
                        rows={blog.articles.map((a) => [
                            a.title,
                            a.contentType,
                            String(a.wordCountTarget),
                            a.role,
                            a.status,
                        ])}
                        empty="No blog articles"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Topic clusters</h3>
                <div className="mt-3">
                    <Table
                        headers={["Cluster", "Keyword", "Intent", "Status"]}
                        rows={blog.topicClusters.map((t) => [t.name, t.keywordFocus, t.searchIntent, t.status])}
                        empty="No topic clusters"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Internal link suggestions</h3>
                <div className="mt-3">
                    <Table
                        headers={["From", "To", "Reason"]}
                        rows={blog.internalLinks.map((l) => [l.fromTitle, l.toTitle, l.reason])}
                        empty="No link suggestions"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Meta title / description</h3>
                <div className="mt-3">
                    <Table
                        headers={["Title", "Meta title", "Meta description", "Schema"]}
                        rows={blog.meta.map((m) => [m.title, m.metaTitle, m.metaDescription, m.schemaType])}
                        empty="No meta SEO rows"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">FAQ generation</h3>
                <div className="mt-3">
                    <Table
                        headers={["Question", "Category", "Answer ref", "Status"]}
                        rows={blog.faqs.map((f) => [f.question, f.category, f.answerRef || "—", f.status])}
                        empty="No FAQs"
                    />
                </div>
            </Card>
        </div>
    );
}

export function LandingPageGeneratorPanel({ landing }: { landing: LandingPageGenerator }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                <Metric label="Product" value={landing.productPages.length} />
                <Metric label="Industry" value={landing.industryPages.length} />
                <Metric label="Campaign" value={landing.campaignPages.length} />
                <Metric label="Case study" value={landing.caseStudyPages.length} />
                <Metric label="CTAs" value={landing.conversionCopy.length} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Landing pages</h3>
                <div className="mt-3">
                    <Table
                        headers={["Name", "Kind", "Page type", "SEO focus", "Status"]}
                        rows={landing.pages.map((p) => [p.name, p.kind, p.pageType, p.seoFocus, p.status])}
                        empty="No landing pages"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Conversion-focused copy</h3>
                <div className="mt-3">
                    <Table
                        headers={["Name", "CTA type", "Goal", "Status"]}
                        rows={landing.conversionCopy.map((c) => [c.name, c.ctaType, c.conversionGoal, c.status])}
                        empty="No conversion CTAs"
                    />
                </div>
            </Card>
        </div>
    );
}

export function SocialContentEnginePanel({ social }: { social: SocialContentEngine }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {social.byPlatform.map((p) => (
                    <Metric key={p.platform} label={p.platform} value={p.count} />
                ))}
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Platform-specific content</h3>
                <div className="mt-3">
                    <Table
                        headers={["Name", "Platform", "Type", "Tone", "Status"]}
                        rows={social.posts.map((p) => [p.name, String(p.platform), p.postType, p.tone, p.status])}
                        empty="No social content"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">YouTube descriptions</h3>
                <div className="mt-3">
                    <Table
                        headers={["Name", "Format", "Tone", "Status"]}
                        rows={social.youtubeDescriptions.map((y) => [y.name, y.postType, y.tone, y.status])}
                        empty="No YouTube descriptions"
                    />
                </div>
            </Card>
        </div>
    );
}

export function EmailContentPanel({ email }: { email: EmailContent }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                <Metric label="Welcome" value={email.welcome.length} />
                <Metric label="Product updates" value={email.productUpdates.length} />
                <Metric label="Newsletters" value={email.newsletters.length} />
                <Metric label="Re-engagement" value={email.reengagement.length} />
                <Metric label="Nurturing" value={email.nurturing.length} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Email sequences</h3>
                <div className="mt-3">
                    <Table
                        headers={["Name", "Kind", "Campaign type", "Subject", "Status"]}
                        rows={email.sequences.map((s) => [
                            s.name,
                            s.sequenceKind,
                            s.campaignType,
                            s.subjectLine || "—",
                            s.status,
                        ])}
                        empty="No email templates"
                    />
                </div>
            </Card>
        </div>
    );
}

export function BrandCompliancePanel({ compliance }: { compliance: BrandCompliance }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Quality score" value={compliance.qualityScore ?? "—"} />
                <Metric label="Voice profiles" value={compliance.voices.length} />
                <Metric label="Duplicates" value={compliance.duplicates.length} />
                <Metric label="Pending approvals" value={compliance.pendingApprovals} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Brand voice</h3>
                <div className="mt-3">
                    <Table
                        headers={["Name", "Tone", "Style", "Formality", "Status"]}
                        rows={compliance.voices.map((v) => [v.name, v.tone, v.style, v.formality, v.status])}
                        empty="No brand voice rows"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Brand terminology</h3>
                <div className="mt-3">
                    <Table
                        headers={["Name", "Category", "Version", "Status"]}
                        rows={compliance.terminology.map((t) => [t.name, t.category, t.version, t.status])}
                        empty="No terminology"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Approved messaging</h3>
                <div className="mt-3">
                    <Table
                        headers={["Title", "Type", "Audience", "Status"]}
                        rows={compliance.approvedMessaging.map((m) => [m.title, m.type, m.audience, m.status])}
                        empty="No approved messaging"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Duplicate detection</h3>
                <div className="mt-3">
                    <Table
                        headers={["Left", "Right", "Similarity"]}
                        rows={compliance.duplicates.map((d) => [
                            d.leftTitle,
                            d.rightTitle,
                            String(d.similarity),
                        ])}
                        empty="No duplicates detected"
                    />
                </div>
            </Card>
            <Card>
                <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">
                        Founder / Admin approval workflow
                    </h3>
                    <Badge variant="info">{compliance.pendingApprovals} pending</Badge>
                </div>
                <div className="mt-3">
                    <Table
                        headers={["Title", "Type", "Approver", "Status"]}
                        rows={compliance.approvalQueue.map((a) => [
                            a.title,
                            a.contentType,
                            a.approverRef || "founder/admin",
                            a.status,
                        ])}
                        empty="No approval queue items"
                    />
                </div>
            </Card>
        </div>
    );
}

export function SeoIntelligencePanel({ seo }: { seo: SeoIntelligence }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Keyword clusters" value={seo.keywordClusters.length} />
                <Metric label="Readability" value={seo.readabilityScore ?? "—"} />
                <Metric label="Content score" value={seo.contentScore ?? "—"} />
                <Metric label="Recommendations" value={seo.recommendations.length} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Keyword clustering</h3>
                <div className="mt-3">
                    <Table
                        headers={["Name", "Keyword", "Intent", "Cluster", "Status"]}
                        rows={seo.keywordClusters.map((k) => [
                            k.name,
                            k.keywordFocus,
                            k.searchIntent,
                            k.cluster,
                            k.status,
                        ])}
                        empty="No keyword clusters"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Search intent</h3>
                <div className="mt-3">
                    <Table
                        headers={["Intent", "Count"]}
                        rows={seo.intentBreakdown.map((i) => [i.intent, String(i.count)])}
                        empty="No intent data"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Optimization recommendations</h3>
                <div className="mt-3">
                    <Table
                        headers={["Target", "Recommendation", "Priority"]}
                        rows={seo.recommendations.map((r) => [r.target, r.recommendation, r.priority])}
                        empty="No recommendations"
                    />
                </div>
            </Card>
        </div>
    );
}
