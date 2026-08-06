"use client";

import { Badge } from "@/src/design-os/components/Badge";
import { Button } from "@/src/design-os/components/Button";
import { Card } from "@/src/design-os/components/Card";
import type { AiCommandCenterData } from "../hooks/useAiCommandCenter";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <Card>
            <h3 className="font-semibold text-[var(--dos-text-primary)]">{title}</h3>
            <div className="mt-4 space-y-3">{children}</div>
        </Card>
    );
}

export function AiCommandCenterDashboard({ data }: { data: AiCommandCenterData }) {
    const dash = data.dashboard;
    if (!dash) return null;

    return (
        <div className="space-y-8">
            <div className="grid gap-6 xl:grid-cols-2">
                <Section title="System Health">
                    <p className="text-3xl font-bold">{dash.systemHealth}%</p>
                    <p className="text-sm text-[var(--dos-text-secondary)]">Overall command score {dash.overallScore}%</p>
                    <div className="grid grid-cols-2 gap-2 text-xs text-[var(--dos-text-tertiary)]">
                        <span>Client health {dash.clientHealth}%</span>
                        <span>Agent health {Math.round(dash.agents.reduce((s, a) => s + a.healthScore, 0) / Math.max(1, dash.agents.length))}%</span>
                    </div>
                </Section>

                <Section title="Revenue Summary">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div><p className="text-[var(--dos-text-secondary)]">MRR</p><p className="text-xl font-bold">${Math.round(dash.revenue.mrr).toLocaleString()}</p></div>
                        <div><p className="text-[var(--dos-text-secondary)]">Active clients</p><p className="text-xl font-bold">{dash.revenue.activeClients}</p></div>
                        <div><p className="text-[var(--dos-text-secondary)]">Open invoices</p><p className="text-xl font-bold">{dash.revenue.openInvoices}</p></div>
                        <div><p className="text-[var(--dos-text-secondary)]">Renewals due</p><p className="text-xl font-bold">{dash.revenue.renewalsDue}</p></div>
                    </div>
                    <p className="text-xs text-[var(--dos-text-tertiary)]">{dash.revenue.pipelineLeads} pipeline leads</p>
                </Section>

                <Section title="Support SLA">
                    <div className="flex flex-wrap gap-3 text-sm">
                        <Badge variant="info">{dash.supportSla.openTickets} open</Badge>
                        <Badge variant={dash.supportSla.slaCompliance >= 90 ? "success" : "warning"}>SLA {dash.supportSla.slaCompliance}%</Badge>
                        <Badge variant="default">Health {dash.supportSla.supportHealth}%</Badge>
                        <Badge variant={dash.supportSla.incidents > 0 ? "error" : "success"}>{dash.supportSla.incidents} incidents</Badge>
                    </div>
                </Section>

                <Section title="Delivery Status">
                    <div className="flex flex-wrap gap-3 text-sm">
                        <Badge variant="info">{dash.deliveryStatus.activeEngagements} engagements</Badge>
                        <Badge variant="success">Quality {dash.deliveryStatus.qualityPassRate}%</Badge>
                        <Badge variant={dash.deliveryStatus.deliveryHealth >= 85 ? "success" : "warning"}>Health {dash.deliveryStatus.deliveryHealth}%</Badge>
                        <Badge variant="default">{dash.deliveryStatus.pendingAi} AI pending</Badge>
                    </div>
                </Section>
            </div>

            <Section title="AI Agent Status">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {dash.agents.map((agent) => (
                        <div key={agent.key} className="rounded-lg border border-[var(--dos-border)] p-3">
                            <div className="flex items-center justify-between gap-2">
                                <p className="text-sm font-medium">{agent.label}</p>
                                <Badge variant={agent.status === "degraded" ? "error" : agent.status === "processing" ? "warning" : "info"}>{agent.status}</Badge>
                            </div>
                            <p className="mt-2 text-xs text-[var(--dos-text-tertiary)]">{agent.healthScore}% health</p>
                        </div>
                    ))}
                </div>
            </Section>

            <div className="grid gap-6 xl:grid-cols-2">
                <Section title="Active Alerts">
                    {dash.alerts.length === 0 ? (
                        <p className="text-sm text-[var(--dos-text-tertiary)]">No active alerts.</p>
                    ) : (
                        dash.alerts.map((alert) => (
                            <div key={alert.id} className="rounded-lg border border-[var(--dos-border)] p-3 text-sm">
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant={alert.severity === "critical" || alert.severity === "high" ? "error" : "warning"}>{alert.severity}</Badge>
                                    <Badge variant="info">{alert.sourceModule}</Badge>
                                </div>
                                <p className="mt-1 font-medium">{alert.title}</p>
                                <p className="text-xs text-[var(--dos-text-secondary)]">{alert.detail}</p>
                            </div>
                        ))
                    )}
                </Section>

                <Section title="AI Recommendations">
                    {dash.recommendations.slice(0, 8).map((rec) => (
                        <div key={rec.id} className="rounded-lg border border-[var(--dos-border)] p-3 text-sm">
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="info">{rec.engineKey}</Badge>
                                <Badge variant={rec.priority === "high" || rec.priority === "critical" ? "warning" : "default"}>{rec.priority}</Badge>
                                <Badge variant="success">{Math.round(rec.confidence * 100)}%</Badge>
                            </div>
                            <p className="mt-1 font-medium">{rec.title}</p>
                            <p className="text-xs text-[var(--dos-text-secondary)]">{rec.detail}</p>
                            {rec.status === "pending" && (
                                <div className="mt-2 flex gap-2">
                                    <Button size="sm" onClick={() => data.acceptRecommendation(rec.id)}>Accept</Button>
                                    <Button size="sm" variant="secondary" onClick={() => data.dismissRecommendation(rec.id)}>Dismiss</Button>
                                </div>
                            )}
                        </div>
                    ))}
                </Section>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
                <Section title="AI Decisions">
                    {dash.decisions.map((d) => (
                        <div key={d.id} className="border-b border-[var(--dos-border)] pb-2 text-sm">
                            <div className="flex gap-2"><Badge variant="info">{d.decisionType}</Badge><Badge variant="default">{d.status}</Badge></div>
                            <p className="mt-1 font-medium">{d.summary}</p>
                            <p className="text-xs text-[var(--dos-text-tertiary)]">{d.rationale}</p>
                        </div>
                    ))}
                </Section>

                <Section title="Automations">
                    {dash.automations.map((a) => (
                        <div key={a.id} className="flex items-center justify-between border-b border-[var(--dos-border)] pb-2 text-sm">
                            <div>
                                <p className="font-medium">{a.title}</p>
                                <p className="text-xs text-[var(--dos-text-tertiary)]">{a.resultSummary}</p>
                            </div>
                            <Badge variant={a.status === "failed" ? "error" : a.status === "running" ? "warning" : "success"}>{a.status}</Badge>
                        </div>
                    ))}
                </Section>
            </div>
        </div>
    );
}
