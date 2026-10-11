"use client";

import { Badge } from "@/src/design-os/components/Badge";
import { Button } from "@/src/design-os/components/Button";
import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import type { DeliveryEngineData } from "../../hooks/useDeliveryEngine";

export function BlueprintLibraryPanel({ data }: { data: DeliveryEngineData }) {
    return (
        <div className="space-y-4">
            <Card>
                <h2 className="text-lg font-semibold">Project Blueprint Library</h2>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">Reusable blueprints accelerate delivery. Every completed project contributes back to this library.</p>
            </Card>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {data.blueprints.map((bp) => (
                    <Card key={bp.id} hover>
                        <div className="flex items-start justify-between gap-2">
                            <p className="font-medium">{bp.name}</p>
                            <Badge variant="info">{bp.category}</Badge>
                        </div>
                        <p className="mt-2 text-sm text-[var(--dos-text-secondary)]">{bp.description}</p>
                        <div className="mt-3 flex flex-wrap gap-3 text-xs text-[var(--dos-text-tertiary)]">
                            <span>{bp.estimatedBuildHours}h build</span>
                            <span>{bp.componentCount} components</span>
                            <span>{bp.reuseScore}% reuse</span>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export function ComponentLibraryPanel({ data }: { data: DeliveryEngineData }) {
    return (
        <div className="space-y-4">
            <Card>
                <h2 className="text-lg font-semibold">Component Library</h2>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">Production-ready reusable components from completed projects.</p>
            </Card>
            {data.components.length === 0 ? (
                <EmptyState title="No components yet" description="Components are extracted from completed deliveries and added here for reuse." />
            ) : (
                <div className="space-y-3">
                    {data.components.map((c) => (
                        <Card key={c.id}>
                            <div className="flex justify-between gap-2">
                                <div>
                                    <p className="font-medium">{c.name}</p>
                                    <p className="text-sm text-[var(--dos-text-secondary)]">{c.description || c.category}</p>
                                </div>
                                <Badge variant="success">{c.reuseCount} reuses</Badge>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

export function AutomationPipelinesPanel({ data }: { data: DeliveryEngineData }) {
    const activeEng = data.engagements.find((e) => e.status === "active");
    return (
        <div className="space-y-4">
            <Card>
                <h2 className="text-lg font-semibold">Automation Pipelines</h2>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">Automated project init, environment setup, quality verification, testing, deployment prep, and documentation.</p>
                {activeEng ? (
                    <Button size="sm" className="mt-4" onClick={() => data.runAllPipelines(activeEng.id)}>Run all pipelines for {activeEng.title}</Button>
                ) : null}
            </Card>
            {data.pipelineRuns.length === 0 ? (
                <EmptyState title="No pipeline runs" description="Select an active engagement and run automation pipelines." />
            ) : (
                <div className="space-y-3">
                    {data.pipelineRuns.slice(0, 12).map((run) => (
                        <Card key={run.id}>
                            <div className="flex justify-between">
                                <div>
                                    <p className="font-medium capitalize">{run.pipelineType.replace("_", " ")}</p>
                                    <p className="text-sm text-[var(--dos-text-secondary)]">{run.summary}</p>
                                </div>
                                <Badge variant={run.status === "passed" ? "success" : run.status === "failed" ? "error" : "info"}>{run.status}</Badge>
                            </div>
                            <p className="mt-2 text-xs text-[var(--dos-text-tertiary)]">{run.durationMs}ms</p>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

export function DeliveryPlaybookPanel({ data }: { data: DeliveryEngineData }) {
    return (
        <div className="space-y-4">
            <Card>
                <h2 className="text-lg font-semibold">Delivery Playbook</h2>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">Lead → Discovery → Scope → Blueprint → Build → Verification → Deployment → Support</p>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">Deployment is gated: all recorded quality verifications must pass first.</p>
                {data.actionError ? (
                    <p role="alert" className="mt-2 text-sm text-red-600">
                        {data.actionError}
                    </p>
                ) : null}
            </Card>
            {data.engagements.length === 0 ? (
                <EmptyState title="No active deliveries" description="Create an engagement to start the delivery playbook workflow." />
            ) : (
                <div className="space-y-3">
                    {data.engagements.map((eng) => (
                        <Card key={eng.id}>
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <p className="font-medium">{eng.title}</p>
                                    <p className="text-sm text-[var(--dos-text-secondary)]">Stage: {eng.playbookStage} · Blueprint: {eng.blueprintKey || "—"}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Badge variant="info">{eng.status}</Badge>
                                    {eng.status === "active" && (
                                        <Button size="sm" onClick={() => data.advanceStage(eng.id)}>Advance stage</Button>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

export function QualityEnginePanel({ data }: { data: DeliveryEngineData }) {
    const activeEng = data.engagements.find((e) => e.status === "active");
    return (
        <div className="space-y-4">
            <Card>
                <h2 className="text-lg font-semibold">Quality Engine</h2>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">Record manual quality results for performance, security, accessibility, brand, SEO, engineering, and business rules. Deployment stays blocked until every recorded verification passes.</p>
                {activeEng ? (
                    <Button size="sm" className="mt-4" onClick={() => data.verifyQuality(activeEng.id)}>Run quality verification</Button>
                ) : null}
            </Card>
            {data.qualityVerifications.length === 0 ? (
                <EmptyState title="No quality reports" description="Run quality verification on an active engagement." />
            ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                    {data.qualityVerifications.slice(0, 14).map((q) => (
                        <Card key={q.id}>
                            <div className="flex justify-between">
                                <p className="font-medium capitalize">{q.dimension.replace("_", " ")}</p>
                                <Badge variant={q.passed ? "success" : "warning"}>{q.score}%</Badge>
                            </div>
                            {q.findings ? <p className="mt-2 text-xs text-[var(--dos-text-secondary)]">{q.findings}</p> : null}
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

export function KnowledgeEnginePanel({ data }: { data: DeliveryEngineData }) {
    return (
        <div className="space-y-4">
            <Card>
                <h2 className="text-lg font-semibold">Knowledge Engine</h2>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">Lessons learned, reusable solutions, common fixes, architecture decisions, and patterns.</p>
                <Button size="sm" className="mt-4" onClick={() => data.addKnowledgeEntry({ entryType: "lesson", title: "Delivery retrospective", content: "Document lessons from latest engagement.", tags: "delivery,retrospective" })}>Add lesson learned</Button>
            </Card>
            {data.knowledgeEntries.length === 0 ? (
                <EmptyState title="No knowledge entries" description="Capture lessons and patterns after each delivery." />
            ) : (
                <div className="space-y-3">
                    {data.knowledgeEntries.map((k) => (
                        <Card key={k.id}>
                            <div className="flex gap-2">
                                <Badge variant="info">{k.entryType}</Badge>
                                <p className="font-medium">{k.title}</p>
                            </div>
                            <p className="mt-2 text-sm text-[var(--dos-text-secondary)]">{k.content}</p>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

export function DeliveryAnalyticsPanel({ data }: { data: DeliveryEngineData }) {
    const a = data.analytics;
    if (!a) return <Card><p className="text-sm">Loading analytics...</p></Card>;
    const metrics = [
        { label: "Avg delivery time", value: `${a.avgDeliveryTimeDays} days` },
        { label: "Avg build time", value: `${a.avgBuildTimeHours} hours` },
        { label: "Avg testing time", value: `${a.avgTestingTimeHours} hours` },
        { label: "Avg deployment time", value: `${a.avgDeploymentTimeHours} hours` },
        { label: "Client satisfaction", value: `${a.clientSatisfactionScore}%` },
        { label: "Defect rate", value: `${a.defectRate}%` },
    ];
    return (
        <div className="space-y-4">
            <Card>
                <h2 className="text-lg font-semibold">Delivery Analytics</h2>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">Track delivery velocity and quality trends. Every project makes the next one faster.</p>
            </Card>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {metrics.map((m) => (
                    <Card key={m.label} hover>
                        <p className="text-sm text-[var(--dos-text-secondary)]">{m.label}</p>
                        <p className="mt-1 text-2xl font-bold">{m.value}</p>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export function AiDeliveryAssistantPanel({ data }: { data: DeliveryEngineData }) {
    return (
        <div className="space-y-4">
            <Card>
                <h2 className="text-lg font-semibold">AI Delivery Assistant</h2>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">Recommends blueprints, suggests reusable modules, detects duplicate work, and generates implementation checklists.</p>
            </Card>
            {data.aiRecommendations.length === 0 ? (
                <EmptyState title="No recommendations" description="AI will suggest blueprints and optimizations as engagements progress." />
            ) : (
                <div className="space-y-3">
                    {data.aiRecommendations.map((rec) => (
                        <Card key={rec.id}>
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <p className="font-medium">{rec.title}</p>
                                        <Badge variant="info">{rec.recommendationType}</Badge>
                                        <Badge variant={rec.priority === "high" ? "warning" : "default"}>{rec.priority}</Badge>
                                    </div>
                                    <p className="mt-2 text-sm text-[var(--dos-text-secondary)]">{rec.description}</p>
                                </div>
                                {rec.status === "pending" && (
                                    <div className="flex gap-2">
                                        <Button size="sm" onClick={() => data.approveAiRecommendation(rec.id)}>Apply</Button>
                                        <Button size="sm" variant="secondary" onClick={() => data.dismissAiRecommendation(rec.id)}>Dismiss</Button>
                                    </div>
                                )}
                                {rec.status !== "pending" && <Badge variant="success">{rec.status}</Badge>}
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
