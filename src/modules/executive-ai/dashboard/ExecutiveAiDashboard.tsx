"use client";

import { Badge } from "@/src/design-os/components/Badge";
import { Button } from "@/src/design-os/components/Button";
import { Card } from "@/src/design-os/components/Card";
import { EXECUTIVE_AGENTS } from "../constants";
import type { ExecutiveAiData } from "../executive-ai-hooks";
import type { ExecutiveAgentKey } from "../constants";

function AgentStatusBadge({ status }: { status: string }) {
    const variant = status === "idle" ? "default" : status === "active" ? "info" : status === "processing" ? "warning" : "error";
    return <Badge variant={variant}>{status}</Badge>;
}

export function ExecutiveAiDashboardPanel({ data }: { data: ExecutiveAiData }) {
    const dash = data.dashboard;
    if (!dash) return null;

    return (
        <div className="space-y-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {dash.agents.map((agent) => (
                    <Card key={agent.key} hover>
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <p className="font-semibold text-[var(--dos-text-primary)]">{agent.label}</p>
                                <p className="text-xs text-[var(--dos-text-tertiary)]">{agent.role} · v{agent.version}</p>
                            </div>
                            <AgentStatusBadge status={agent.status} />
                        </div>
                        <div className="mt-3 flex flex-wrap gap-3 text-xs text-[var(--dos-text-secondary)]">
                            <span>{agent.activeTasks} tasks</span>
                            <span>{agent.pendingRecommendations} recs</span>
                            <span>{agent.healthScore}% health</span>
                        </div>
                        <p className="mt-2 text-[10px] text-[var(--dos-text-tertiary)]">
                            {(EXECUTIVE_AGENTS[agent.key as ExecutiveAgentKey]?.domains ?? []).slice(0, 3).join(" · ")}
                        </p>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
                <Card>
                    <h3 className="font-semibold">Recommendations</h3>
                    <ul className="mt-4 space-y-3">
                        {dash.recommendations.slice(0, 8).map((rec) => (
                            <li key={rec.id} className="rounded-lg border border-[var(--dos-border)] p-3">
                                <div className="flex flex-wrap items-center gap-2">
                                    <Badge variant="info">{rec.agentKey}</Badge>
                                    <p className="font-medium">{rec.title}</p>
                                    {rec.requiresApproval && <Badge variant="warning">Approval required</Badge>}
                                </div>
                                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">{rec.detail}</p>
                                <p className="mt-1 text-xs text-[var(--dos-text-tertiary)]">{rec.explanation}</p>
                                <p className="mt-1 text-xs text-[var(--dos-text-tertiary)]">Sources: {rec.sourceModules} · {Math.round(rec.confidence * 100)}% · {rec.votes} votes</p>
                                {rec.status === "pending" && rec.requiresApproval && (
                                    <div className="mt-2 flex gap-2">
                                        <Button size="sm" onClick={() => data.approveRecommendation(rec.id)}>Approve</Button>
                                        <Button size="sm" variant="secondary" onClick={() => data.dismissRecommendation(rec.id)}>Dismiss</Button>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <h3 className="font-semibold">Active tasks</h3>
                        <ul className="mt-3 space-y-2">
                            {dash.activeTasks.map((t) => (
                                <li key={t.id} className="flex justify-between text-sm border-b border-[var(--dos-border)] pb-2">
                                    <span><Badge variant="info">{t.agentKey}</Badge> {t.title}</span>
                                    <Badge variant={t.status === "in_progress" ? "warning" : "default"}>{t.status}</Badge>
                                </li>
                            ))}
                        </ul>
                    </Card>

                    <Card>
                        <h3 className="font-semibold">Alerts</h3>
                        <ul className="mt-3 space-y-2">
                            {dash.alerts.length === 0 ? <li className="text-sm text-[var(--dos-text-tertiary)]">No alerts</li> : dash.alerts.map((a) => (
                                <li key={a.id} className="flex justify-between text-sm">
                                    <span>{a.title}</span>
                                    <Badge variant={a.severity === "critical" ? "error" : "warning"}>{a.severity}</Badge>
                                </li>
                            ))}
                        </ul>
                    </Card>

                    <Card>
                        <h3 className="font-semibold">Collaboration timeline</h3>
                        <ul className="mt-3 space-y-2 text-sm">
                            {dash.collaborationHistory.map((c) => (
                                <li key={c.id} className="border-b border-[var(--dos-border)] pb-2">
                                    <Badge variant="info">{c.eventType.replace("_", " ")}</Badge>
                                    <p className="mt-1">{c.summary}</p>
                                </li>
                            ))}
                        </ul>
                    </Card>

                    <Card>
                        <h3 className="font-semibold">Governance</h3>
                        <ul className="mt-3 space-y-2 text-sm">
                            {dash.governancePolicies.map((p) => (
                                <li key={p.key} className="flex justify-between">
                                    <span>{p.label}</span>
                                    <Badge variant={p.enforced ? "success" : "default"}>{p.enforced ? "enforced" : "optional"}</Badge>
                                </li>
                            ))}
                        </ul>
                    </Card>
                </div>
            </div>

            {data.orchestratorResult && (
                <Card className="border-[var(--dos-brand-primary)]/30">
                    <h3 className="font-semibold">Unified executive response</h3>
                    <pre className="mt-3 whitespace-pre-wrap text-sm text-[var(--dos-text-secondary)]">{data.orchestratorResult.unifiedResponse}</pre>
                </Card>
            )}
        </div>
    );
}
