"use client";

import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import type {
    AiScriptStudio,
    QualityAssuranceEngine,
    StoryboardEngine,
    VideoCompositionEngine,
    VideoProjectManager,
    VoiceAudioStudio,
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

export function AiScriptStudioPanel({ scripts }: { scripts: AiScriptStudio }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <Metric label="YouTube long-form" value={scripts.youtubeLong.length} />
                <Metric label="Shorts / Reels" value={scripts.shorts.length} />
                <Metric label="Product demos" value={scripts.productDemos.length} />
                <Metric label="Explainers" value={scripts.explainers.length} />
                <Metric label="Case studies" value={scripts.caseStudies.length} />
                <Metric label="Webinars" value={scripts.webinars.length} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">AI Script Studio</h3>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                    Multi-language ready: {scripts.languagesReady.join(", ") || "awaiting voice profiles"} · Brand voice
                    profiles: {scripts.brandVoiceProfiles.length}
                </p>
                <div className="mt-3">
                    <Table
                        headers={["Name", "Kind", "Type", "Length", "Voice", "Lang", "Status"]}
                        rows={scripts.scripts.map((s) => [
                            s.name,
                            s.kind,
                            s.scriptType,
                            String(s.targetLength),
                            s.brandVoiceAligned ? "enforced" : "pending",
                            s.languageReady ? "ready" : "—",
                            s.status,
                        ])}
                        empty="No scripts"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Brand voice enforcement</h3>
                <div className="mt-3">
                    <Table
                        headers={["Name", "Tone", "Style", "Status"]}
                        rows={scripts.brandVoiceProfiles.map((v) => [v.name, v.tone, v.style, v.status])}
                        empty="No brand voice profiles"
                    />
                </div>
            </Card>
        </div>
    );
}

export function StoryboardEnginePanel({ storyboard }: { storyboard: StoryboardEngine }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <Metric label="Projects" value={storyboard.projectsCovered} />
                <Metric label="Scenes" value={storyboard.scenes.length} />
                <Metric label="Est. duration (s)" value={storyboard.totalEstimatedSeconds} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Scene breakdown</h3>
                <div className="mt-3">
                    <Table
                        headers={["Project", "Scene", "Camera", "Shot", "Transition", "Seconds", "Cue"]}
                        rows={storyboard.scenes.map((s) => [
                            s.projectName,
                            String(s.sceneIndex),
                            s.cameraSuggestion,
                            s.shotType,
                            s.transition,
                            String(s.durationSeconds),
                            s.visualCue,
                        ])}
                        empty="No storyboard scenes"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Transition planning</h3>
                <div className="mt-3">
                    <Table
                        headers={["From", "To", "Type"]}
                        rows={storyboard.transitions.map((t) => [t.from, t.to, t.type])}
                        empty="No transitions"
                    />
                </div>
            </Card>
        </div>
    );
}

export function VoiceAudioStudioPanel({ audio }: { audio: VoiceAudioStudio }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Voice profiles" value={audio.voiceProfiles.length} />
                <Metric label="Voiceovers" value={audio.voiceovers.length} />
                <Metric label="Music tracks" value={audio.musicLibrary.length} />
                <Metric label="Loudness-ready" value={audio.loudnessNormalizedCount} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Voice profile management</h3>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                    Languages: {audio.languages.join(", ") || "—"}
                </p>
                <div className="mt-3">
                    <Table
                        headers={["Name", "Type", "Language", "Status"]}
                        rows={audio.voiceProfiles.map((v) => [v.name, v.voiceType, v.language, v.status])}
                        empty="No voice profiles"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Multi-language voiceovers</h3>
                <div className="mt-3">
                    <Table
                        headers={["Name", "Type", "Language", "Status"]}
                        rows={audio.voiceovers.map((v) => [v.name, v.voiceType, v.language, v.status])}
                        empty="No voiceovers"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Pronunciation dictionary</h3>
                <div className="mt-3">
                    <Table
                        headers={["Term", "Language", "Source"]}
                        rows={audio.pronunciationEntries.map((p) => [p.term, p.language, p.source])}
                        empty="No pronunciation entries"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Background music library</h3>
                <div className="mt-3">
                    <Table
                        headers={["Name", "Genre", "Mood", "Status"]}
                        rows={audio.musicLibrary.map((m) => [m.name, m.genre, m.mood, m.status])}
                        empty="No music assets"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Sound effects</h3>
                <div className="mt-3">
                    <Table
                        headers={["Name", "Genre", "Mood", "Status"]}
                        rows={audio.soundEffects.map((m) => [m.name, m.genre, m.mood, m.status])}
                        empty="No sound effects tagged"
                    />
                </div>
            </Card>
        </div>
    );
}

export function VideoCompositionEnginePanel({ composition }: { composition: VideoCompositionEngine }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {composition.aspectRatios.map((a) => (
                    <Metric key={a.ratio} label={a.ratio} value={a.assetCount} />
                ))}
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Provider-agnostic orchestration</h3>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                    Slots bind to approved generation/editing providers without locking to a single model.
                </p>
                <div className="mt-3">
                    <Table
                        headers={["Provider slot", "Status"]}
                        rows={composition.providerSlots.map((p) => [p.slot, p.status])}
                        empty="No provider slots"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Composition assets</h3>
                <div className="mt-3">
                    <Table
                        headers={["Name", "Role", "Aspect", "Format", "Status"]}
                        rows={composition.assets.map((a) => [a.name, a.role, a.aspectRatio, a.format, a.status])}
                        empty="No composition assets"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">
                    Captions · intros/outros · watermarks
                </h3>
                <div className="mt-3">
                    <Table
                        headers={["Name", "Role", "Aspect", "Status"]}
                        rows={[...composition.captions, ...composition.introsOutros, ...composition.watermarks].map(
                            (a) => [a.name, a.role, a.aspectRatio, a.status],
                        )}
                        empty="No caption/intro/watermark assets"
                    />
                </div>
            </Card>
        </div>
    );
}

export function VideoProjectManagerPanel({ projects }: { projects: VideoProjectManager }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                <Metric label="Drafts" value={projects.drafts.length} />
                <Metric label="In review" value={projects.inReview.length} />
                <Metric label="Approved" value={projects.approved.length} />
                <Metric label="Export queue" value={projects.exportQueue.length} />
                <Metric label="Pending approvals" value={projects.pendingApprovals} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Video projects</h3>
                <div className="mt-3">
                    <Table
                        headers={["Name", "Stage", "Format", "Duration", "Version", "Status"]}
                        rows={projects.projects.map((p) => [
                            p.name,
                            p.stage,
                            p.format,
                            String(p.durationSeconds),
                            p.versionLabel,
                            p.status,
                        ])}
                        empty="No video projects"
                    />
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Version history</h3>
                <div className="mt-3">
                    <Table
                        headers={["Name", "Version", "Updated"]}
                        rows={projects.versionHistory.map((v) => [v.name, v.version, v.updatedAt])}
                        empty="No version history"
                    />
                </div>
            </Card>
            <Card>
                <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">
                        Review workflow · team comments · Founder / Admin approval
                    </h3>
                    <Badge variant="info">{projects.pendingApprovals} pending</Badge>
                </div>
                <div className="mt-3">
                    <Table
                        headers={["Project", "Note", "Status"]}
                        rows={projects.comments.map((c) => [c.projectName, c.note, c.status])}
                        empty="No review comments"
                    />
                </div>
            </Card>
        </div>
    );
}

export function QualityAssuranceEnginePanel({ qa }: { qa: QualityAssuranceEngine }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Quality score" value={qa.qualityScore ?? "—"} />
                <Metric label="Caption checks" value={qa.captionValidation.length} />
                <Metric label="Platform checks" value={qa.platformReadiness.length} />
                <Metric label="Pending approvals" value={qa.pendingApprovals} />
            </div>
            {(
                [
                    ["Brand compliance", qa.brandCompliance],
                    ["Caption validation", qa.captionValidation],
                    ["Audio quality", qa.audioQuality],
                    ["Resolution validation", qa.resolutionChecks],
                    ["Duration optimization", qa.durationOptimization],
                    ["Platform readiness", qa.platformReadiness],
                ] as const
            ).map(([title, rows]) => (
                <Card key={title}>
                    <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">{title}</h3>
                    <div className="mt-3">
                        <Table
                            headers={["Name", "Category", "Result", "Detail"]}
                            rows={rows.map((r) => [r.name, r.category, r.passed ? "pass" : "fail", r.detail])}
                            empty={`No ${title.toLowerCase()} checks`}
                        />
                    </div>
                </Card>
            ))}
            <Card>
                <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">
                        Founder / Admin approval workflow
                    </h3>
                    <Badge variant="info">{qa.pendingApprovals} pending</Badge>
                </div>
                <div className="mt-3">
                    <Table
                        headers={["Title", "Type", "Approver", "Status"]}
                        rows={qa.approvalQueue.map((a) => [
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
