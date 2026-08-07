"use client";

import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import type {
    BrandImageStudio,
    CampaignDesigner,
    CreativeAssetLibrary,
    CreativeQualityEngine,
    SocialCreativeEngine,
    ThumbnailFactory,
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

export function BrandImageStudioPanel({ brandImages }: { brandImages: BrandImageStudio }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <Metric label="Hero images" value={brandImages.heroes.length} />
                <Metric label="Website banners" value={brandImages.banners.length} />
                <Metric label="Blog covers" value={brandImages.blogCovers.length} />
                <Metric label="Landing visuals" value={brandImages.landingVisuals.length} />
                <Metric label="Product illustrations" value={brandImages.productIllustrations.length} />
                <Metric label="Infographics" value={brandImages.infographics.length} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Brand visual inventory</h3>
                <div className="mt-3">
                    <Table
                        headers={["Name", "Kind", "Type", "Format", "Status"]}
                        rows={brandImages.visuals.map((v) => [v.name, v.kind, v.assetType, v.format, v.status])}
                        empty="No brand visuals"
                    />
                </div>
            </Card>
        </div>
    );
}

export function SocialCreativeEnginePanel({ social }: { social: SocialCreativeEngine }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {social.byPlatform.map((p) => (
                    <Metric key={p.platform} label={p.platform} value={p.count} />
                ))}
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Social creatives</h3>
                <div className="mt-3">
                    <Table
                        headers={["Name", "Platform", "Type", "Aspect", "Status"]}
                        rows={social.creatives.map((c) => [
                            c.name,
                            c.platform,
                            c.postType,
                            c.aspectRatio,
                            c.status,
                        ])}
                        empty="No social creatives"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Carousels & stories</h3>
                <div className="mt-3">
                    <Table
                        headers={["Name", "Platform", "Type", "Status"]}
                        rows={[...social.carousels, ...social.stories].map((c) => [
                            c.name,
                            c.platform,
                            c.postType,
                            c.status,
                        ])}
                        empty="No carousel or story templates"
                    />
                </div>
            </Card>
        </div>
    );
}

export function CampaignDesignerPanel({ campaign }: { campaign: CampaignDesigner }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                <Metric label="Product launch" value={campaign.productLaunches.length} />
                <Metric label="Events" value={campaign.events.length} />
                <Metric label="Seasonal" value={campaign.seasonal.length} />
                <Metric label="Promotional" value={campaign.promotional.length} />
                <Metric label="Email banners" value={campaign.emailBanners.length} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Campaign creatives</h3>
                <div className="mt-3">
                    <Table
                        headers={["Name", "Kind", "Type", "Assets", "Status"]}
                        rows={campaign.campaigns.map((c) => [
                            c.name,
                            c.kind,
                            c.campaignType,
                            String(c.assetCount),
                            c.status,
                        ])}
                        empty="No campaign creatives"
                    />
                </div>
            </Card>
        </div>
    );
}

export function ThumbnailFactoryPanel({ thumbnails }: { thumbnails: ThumbnailFactory }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="YouTube" value={thumbnails.youtube.length} />
                <Metric label="Blog" value={thumbnails.blog.length} />
                <Metric label="Webinar" value={thumbnails.webinar.length} />
                <Metric label="Case study" value={thumbnails.caseStudy.length} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Thumbnail factory</h3>
                <div className="mt-3">
                    <Table
                        headers={["Name", "Kind", "Aspect", "Style", "Status"]}
                        rows={thumbnails.thumbnails.map((t) => [
                            t.name,
                            t.kind,
                            t.aspectRatio,
                            t.style,
                            t.status,
                        ])}
                        empty="No thumbnails"
                    />
                </div>
            </Card>
        </div>
    );
}

export function CreativeQualityEnginePanel({ quality }: { quality: CreativeQualityEngine }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Quality score" value={quality.qualityScore ?? "—"} />
                <Metric label="Color checks" value={quality.colorValidations.length} />
                <Metric label="Duplicates" value={quality.duplicates.length} />
                <Metric label="Pending approvals" value={quality.pendingApprovals} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Brand color validation</h3>
                <div className="mt-3">
                    <Table
                        headers={["Name", "Primary", "Secondary", "Accent", "Valid"]}
                        rows={quality.colorValidations.map((c) => [
                            c.name,
                            c.primaryHex,
                            c.secondaryHex,
                            c.accentHex,
                            c.valid ? "pass" : "fail",
                        ])}
                        empty="No color systems"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Typography consistency</h3>
                <div className="mt-3">
                    <Table
                        headers={["Name", "Category", "Consistent", "Status"]}
                        rows={quality.typographyChecks.map((t) => [
                            t.name,
                            t.category,
                            t.consistent ? "yes" : "review",
                            t.status,
                        ])}
                        empty="No typography guidelines"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Layout scoring</h3>
                <div className="mt-3">
                    <Table
                        headers={["Workflow", "Score", "Status"]}
                        rows={quality.layoutScores.map((l) => [l.name, String(l.score), l.status])}
                        empty="No layout scores"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Accessibility checks</h3>
                <div className="mt-3">
                    <Table
                        headers={["Asset", "Check", "Result"]}
                        rows={quality.accessibility.map((a) => [a.name, a.check, a.passed ? "pass" : "fail"])}
                        empty="No accessibility checks"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Duplicate detection</h3>
                <div className="mt-3">
                    <Table
                        headers={["Left", "Right", "Similarity"]}
                        rows={quality.duplicates.map((d) => [d.leftName, d.rightName, String(d.similarity)])}
                        empty="No duplicates detected"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Resolution validation</h3>
                <div className="mt-3">
                    <Table
                        headers={["Name", "Format", "Valid", "Detail"]}
                        rows={quality.resolutionChecks.map((r) => [
                            r.name,
                            r.format,
                            r.valid ? "pass" : "fail",
                            r.detail,
                        ])}
                        empty="No resolution checks"
                    />
                </div>
            </Card>
            <Card>
                <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">
                        Founder / Admin approval workflow
                    </h3>
                    <Badge variant="info">{quality.pendingApprovals} pending</Badge>
                </div>
                <div className="mt-3">
                    <Table
                        headers={["Title", "Type", "Approver", "Status"]}
                        rows={quality.approvalQueue.map((a) => [
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

export function CreativeAssetLibraryPanel({ library }: { library: CreativeAssetLibrary }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Assets" value={library.assets.length} />
                <Metric label="Templates" value={library.templates.length} />
                <Metric label="Components" value={library.components.length} />
                <Metric label="Tags" value={library.tagIndex.length} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Organization asset management</h3>
                <div className="mt-3">
                    <Table
                        headers={["Name", "Category", "Tags", "Status"]}
                        rows={library.assets.map((a) => [a.name, a.category, a.tags.join(", ") || "—", a.status])}
                        empty="No library assets"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Brand templates</h3>
                <div className="mt-3">
                    <Table
                        headers={["Name", "Category", "Version", "Status"]}
                        rows={library.templates.map((t) => [t.name, t.category, t.version, t.status])}
                        empty="No brand templates"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Reusable design components</h3>
                <div className="mt-3">
                    <Table
                        headers={["Name", "Type", "Status"]}
                        rows={library.components.map((c) => [c.name, c.componentType, c.status])}
                        empty="No design components"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Version history</h3>
                <div className="mt-3">
                    <Table
                        headers={["Name", "Version", "Updated"]}
                        rows={library.versionHistory.map((v) => [v.name, v.version, v.updatedAt])}
                        empty="No version history"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Search & tagging</h3>
                <div className="mt-3">
                    <Table
                        headers={["Tag", "Count"]}
                        rows={library.tagIndex.map((t) => [t.tag, String(t.count)])}
                        empty="No tags indexed"
                    />
                </div>
            </Card>
        </div>
    );
}
