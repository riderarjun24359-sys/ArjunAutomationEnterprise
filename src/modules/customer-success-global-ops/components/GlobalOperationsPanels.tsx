"use client";

import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import type { GlobalOperationsDashboard } from "../types";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <Card>
            <h3 className="font-semibold text-[var(--dos-text-primary)]">{title}</h3>
            <div className="mt-4 space-y-3">{children}</div>
        </Card>
    );
}

export function GlobalOperationsPanels({ dash }: { dash: GlobalOperationsDashboard }) {
    return (
        <div className="space-y-8">
            <div className="grid gap-6 xl:grid-cols-2">
                <Section title="Customer Success OS">
                    <div className="flex flex-wrap gap-3 text-xs text-[var(--dos-text-secondary)]">
                        <span>Health {dash.customerHealth}%</span>
                        <span>·</span>
                        <span>{dash.successPlans.length} success plans</span>
                        <span>·</span>
                        <span>{dash.renewals.length} renewals</span>
                        <span>·</span>
                        <span>{dash.escalations.length} escalations</span>
                    </div>
                    <ul className="space-y-2">
                        {dash.healthScores.slice(0, 5).map((h) => (
                            <li key={h.clientId} className="flex items-center justify-between border-b border-[var(--dos-border)] pb-2 text-sm">
                                <span>{h.clientName}</span>
                                <div className="flex gap-2">
                                    <Badge variant={h.riskLevel === "high" ? "error" : h.riskLevel === "medium" ? "warning" : "success"}>{h.score}%</Badge>
                                    <Badge variant="info">{h.trend}</Badge>
                                </div>
                            </li>
                        ))}
                    </ul>
                    {dash.renewals.slice(0, 3).map((r) => (
                        <div key={r.id} className="rounded-lg border border-[var(--dos-border)] p-3 text-sm">
                            <div className="flex justify-between gap-2">
                                <span className="font-medium">{r.clientName}</span>
                                <Badge variant="warning">{r.status}</Badge>
                            </div>
                            <p className="mt-1 text-xs text-[var(--dos-text-tertiary)]">Due {r.renewalDate} · ${r.amount.toLocaleString()} · {r.probability}% probability</p>
                        </div>
                    ))}
                </Section>

                <Section title="Global Support Center">
                    <div className="flex flex-wrap gap-3 text-xs text-[var(--dos-text-secondary)]">
                        <span>{dash.openTickets} open tickets</span>
                        <span>·</span>
                        <span>SLA {dash.slaCompliance}%</span>
                        <span>·</span>
                        <span>Queue {dash.queueDepth}</span>
                        <span>·</span>
                        <span>{dash.knowledgeArticles} KB articles</span>
                        <span>·</span>
                        <span>{dash.incidents} incidents</span>
                    </div>
                    {dash.tickets.length === 0 ? (
                        <p className="text-sm text-[var(--dos-text-tertiary)]">No live tickets — queue clear.</p>
                    ) : (
                        <ul className="space-y-2">
                            {dash.tickets.slice(0, 6).map((t) => (
                                <li key={t.id} className="flex justify-between gap-2 border-b border-[var(--dos-border)] pb-2 text-sm">
                                    <span className="truncate">{t.subject}</span>
                                    <div className="flex shrink-0 gap-1">
                                        <Badge variant="info">{t.priority}</Badge>
                                        <Badge variant={t.slaStatus === "breached" ? "error" : "success"}>{t.slaStatus}</Badge>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                    {dash.escalations.map((e) => (
                        <div key={e.id} className="rounded-lg border border-[var(--dos-border)] p-3 text-sm">
                            <div className="flex justify-between"><span>{e.reason}</span><Badge variant="error">{e.severity}</Badge></div>
                            <p className="mt-1 text-xs text-[var(--dos-text-tertiary)]">{e.clientName} · {e.status}</p>
                        </div>
                    ))}
                </Section>

                <Section title="Client Onboarding">
                    {dash.onboardingSessions.map((s) => (
                        <div key={s.id} className="rounded-lg border border-[var(--dos-border)] p-3 text-sm">
                            <div className="flex justify-between gap-2">
                                <span className="font-medium">{s.clientName}</span>
                                <Badge variant={s.status === "ready" ? "success" : "info"}>{s.status}</Badge>
                            </div>
                            <p className="mt-1 text-xs text-[var(--dos-text-tertiary)]">
                                Checklist {s.checklistComplete}/{s.checklistTotal}
                                {s.kickoffAt ? ` · Kickoff ${new Date(s.kickoffAt).toLocaleDateString()}` : ""}
                            </p>
                        </div>
                    ))}
                </Section>

                <Section title="Service Delivery Control">
                    <p className="text-xs text-[var(--dos-text-secondary)]">Delivery health {dash.deliveryHealth}%</p>
                    {dash.deliveryMilestones.map((m) => (
                        <div key={m.id} className="flex items-center justify-between border-b border-[var(--dos-border)] pb-2 text-sm">
                            <div>
                                <p className="font-medium">{m.title}</p>
                                <p className="text-xs text-[var(--dos-text-tertiary)]">{m.stage}{m.requiresClientApproval ? " · client approval" : ""}</p>
                            </div>
                            <div className="flex gap-1">
                                <Badge variant={m.riskLevel === "high" || m.riskLevel === "critical" ? "warning" : "default"}>{m.riskLevel}</Badge>
                                <Badge variant="info">{m.status}</Badge>
                            </div>
                        </div>
                    ))}
                </Section>

                <Section title="Customer Feedback Engine">
                    <div className="flex flex-wrap gap-4 text-sm">
                        <span>CSAT <strong>{dash.csatAverage}</strong>/5</span>
                        <span>NPS <strong>{dash.npsScore}</strong></span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-[var(--dos-text-tertiary)]">
                        {dash.satisfactionTrend.map((t) => (
                            <span key={t.period}>{t.period}: CSAT {t.csat} · NPS {t.nps}</span>
                        ))}
                    </div>
                    <ul className="space-y-2">
                        {dash.feedback.slice(0, 6).map((f) => (
                            <li key={f.id} className="rounded-lg border border-[var(--dos-border)] p-3 text-sm">
                                <div className="flex gap-2">
                                    <Badge variant="info">{f.type}</Badge>
                                    {f.score != null && <Badge variant="default">{f.score}</Badge>}
                                    <Badge variant={f.status === "open" ? "warning" : "success"}>{f.status}</Badge>
                                </div>
                                <p className="mt-1 text-[var(--dos-text-secondary)]">{f.comment}</p>
                            </li>
                        ))}
                    </ul>
                </Section>

                <Section title="Continuous Improvement Engine">
                    {dash.improvementBacklog.length === 0 ? (
                        <p className="text-sm text-[var(--dos-text-tertiary)]">No improvement items yet.</p>
                    ) : (
                        dash.improvementBacklog.slice(0, 8).map((item) => (
                            <div key={item.id} className="rounded-lg border border-[var(--dos-border)] p-3 text-sm">
                                <div className="flex flex-wrap items-center gap-2">
                                    <Badge variant="info">{item.sourceModule}</Badge>
                                    <Badge variant={item.priority === "critical" || item.priority === "high" ? "warning" : "default"}>{item.priority}</Badge>
                                    <Badge variant="default">{item.status}</Badge>
                                </div>
                                <p className="mt-1 font-medium">{item.title}</p>
                                <p className="text-xs text-[var(--dos-text-tertiary)]">{item.detail}</p>
                            </div>
                        ))
                    )}
                </Section>
            </div>

            <Section title="AI recommendations">
                <ul className="grid gap-3 md:grid-cols-2">
                    {dash.aiRecommendations.map((r) => (
                        <li key={r.id} className="rounded-lg border border-[var(--dos-border)] p-3 text-sm">
                            <div className="flex gap-2">
                                <Badge variant="info">{r.module}</Badge>
                                <Badge variant="success">{Math.round(r.confidence * 100)}%</Badge>
                            </div>
                            <p className="mt-1 font-medium">{r.title}</p>
                            <p className="text-xs text-[var(--dos-text-secondary)]">{r.detail}</p>
                        </li>
                    ))}
                </ul>
            </Section>
        </div>
    );
}
