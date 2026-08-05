"use client";

import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { Button } from "@/src/design-os/components/Button";
import { EmptyState } from "@/src/components/ui/EmptyState";
import type { BusinessPlatformData } from "../../hooks/useBusinessPlatform";

export function AiOpsPanel({ data }: { data: BusinessPlatformData }) {
    return (
        <div className="space-y-6">
            <Card>
                <h2 className="text-lg font-semibold">AI Operations Layer</h2>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                    Monitoring, alerts, recommendations, workflow automation, reporting, and operational assistance. Critical actions require human approval.
                </p>
            </Card>
            <div className="space-y-3">
                {data.aiRecommendations.length === 0 ? (
                    <EmptyState title="No AI recommendations" description="AI will surface follow-ups, approvals, and renewal opportunities." />
                ) : (
                    data.aiRecommendations.map((rec) => (
                        <Card key={rec.id}>
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <p className="font-medium">{rec.title}</p>
                                        <Badge variant={rec.priority === "high" || rec.priority === "critical" ? "warning" : "info"}>{rec.priority}</Badge>
                                        {rec.requiresApproval && <Badge variant="default">Requires approval</Badge>}
                                    </div>
                                    <p className="mt-2 text-sm text-[var(--dos-text-secondary)]">{rec.description}</p>
                                </div>
                                {rec.status === "pending" && (
                                    <div className="flex gap-2">
                                        {rec.requiresApproval && (
                                            <Button size="sm" onClick={() => data.approveAiRecommendation(rec.id)}>Approve</Button>
                                        )}
                                        <Button size="sm" variant="secondary" onClick={() => data.dismissAiRecommendation(rec.id)}>Dismiss</Button>
                                    </div>
                                )}
                                {rec.status !== "pending" && <Badge variant="success">{rec.status}</Badge>}
                            </div>
                        </Card>
                    ))
                )}
            </div>
            {data.lifecycleEvents.length > 0 && (
                <Card>
                    <h3 className="font-semibold">Recent lifecycle events</h3>
                    <ul className="mt-4 space-y-2 text-sm">
                        {data.lifecycleEvents.slice(0, 8).map((evt) => (
                            <li key={evt.id} className="flex justify-between border-b border-[var(--dos-border)] pb-2">
                                <span>{evt.notes}</span>
                                <span className="text-[var(--dos-text-secondary)]">{evt.stage}</span>
                            </li>
                        ))}
                    </ul>
                </Card>
            )}
        </div>
    );
}
