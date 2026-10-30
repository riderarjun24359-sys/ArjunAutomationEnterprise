"use client";

import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import type {
    FounderAdvisorBriefing,
    FounderAlert,
    FounderCustomerIntelligence,
    FounderExecutiveDashboard,
    FounderGrowthCenter,
    BoardRoomSnapshot,
} from "../types";
import { exportBoardRoomPdf } from "../lib/board-pdf";

function Metric({ label, value, hint }: { label: string; value: string; hint?: string }) {
    return (
        <Card>
            <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]">{label}</p>
            <p className="mt-3 text-2xl font-bold text-[var(--dos-text-primary)]">{value}</p>
            {hint ? <p className="mt-2 text-xs text-[var(--dos-text-secondary)]">{hint}</p> : null}
        </Card>
    );
}

export function ExecutiveDashboardPanel({ executive }: { executive: FounderExecutiveDashboard }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                <Metric label="MRR" value={`₹${executive.mrrUsd.toLocaleString()}`} hint={`Trend ${executive.mrrTrend}`} />
                <Metric label="ARR" value={`₹${executive.arrUsd.toLocaleString()}`} />
                <Metric label="Cash flow signal" value={`₹${executive.cashFlowUsd.toLocaleString()}`} hint="Collected − outstanding" />
                <Metric label="New organizations" value={String(executive.newOrganizations)} hint="Last 30 days" />
                <Metric label="Active organizations" value={String(executive.activeOrganizations)} />
                <Metric label="Trial → Paid" value={`${executive.trialToPaidConversionPercent}%`} />
                <Metric label="Churn" value={`${executive.churnRatePercent}%`} />
                <Metric label="Retention" value={`${executive.retentionPercent}%`} />
                <Metric label="NPS" value={executive.npsScore != null ? String(executive.npsScore) : "—"} hint="From live CSAT when NPS rows absent" />
                <Metric
                    label="CSAT"
                    value={executive.customerSatisfactionAvg != null ? String(executive.customerSatisfactionAvg) : "—"}
                />
                <Metric label="Revenue forecast" value={`₹${executive.revenueForecastUsd.toLocaleString()}`} hint="From MRR forecasts × 12" />
                <Metric label="Subscriptions" value={`${executive.activeSubscriptions}`} hint={`${executive.trialSubscriptions} trial · ${executive.paidSubscriptions} paid`} />
            </div>
        </div>
    );
}

export function GrowthCenterPanel({ growth }: { growth: FounderGrowthCenter }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Landing conversions" value={String(growth.landingPageConversions)} hint={`${growth.landingConversionRatePercent}% rate`} />
                <Metric label="Organic leads" value={String(growth.organicLeads)} />
                <Metric label="Paid leads" value={String(growth.paidLeads)} />
                <Metric label="Referral leads" value={String(growth.referralLeads)} />
                <Metric label="CAC" value={growth.cacUsd != null ? `₹${growth.cacUsd.toLocaleString()}` : "—"} hint="Requires spend data in Supabase" />
                <Metric label="LTV" value={growth.ltvUsd != null ? `₹${growth.ltvUsd.toLocaleString()}` : "—"} />
                <Metric label="LTV:CAC" value={growth.ltvToCac != null ? String(growth.ltvToCac) : "—"} />
                <Metric label="Growth score" value={growth.growthScore != null ? String(growth.growthScore) : "—"} />
            </div>

            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Acquisition channels</h3>
                {growth.acquisitionChannels.length === 0 ? (
                    <EmptyState title="No acquisition channels yet" description="Sales leads with source values will populate this chart from Supabase." />
                ) : (
                    <ul className="mt-4 space-y-2 text-sm">
                        {growth.acquisitionChannels.map((row) => (
                            <li key={row.channel} className="flex items-center justify-between gap-3 border-b border-[var(--dos-border-subtle)] py-2">
                                <span className="text-[var(--dos-text-primary)]">{row.channel}</span>
                                <span className="text-[var(--dos-text-secondary)]">
                                    {row.leads} · {row.sharePercent}%
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </Card>

            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Campaign performance</h3>
                {growth.campaigns.length === 0 ? (
                    <EmptyState title="No campaigns" description="Communication hub campaigns and deliveries appear here when present." />
                ) : (
                    <ul className="mt-4 space-y-2 text-sm">
                        {growth.campaigns.map((c) => (
                            <li key={c.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--dos-border-subtle)] py-2">
                                <div>
                                    <p className="font-medium text-[var(--dos-text-primary)]">{c.name}</p>
                                    <p className="text-[var(--dos-text-tertiary)]">
                                        {c.channel} · {c.status}
                                    </p>
                                </div>
                                <Badge variant={c.successRatePercent >= 70 ? "success" : "warning"}>
                                    {c.deliveries} sends · {c.successRatePercent}%
                                </Badge>
                            </li>
                        ))}
                    </ul>
                )}
            </Card>
        </div>
    );
}

export function CustomerIntelligencePanel({ customers }: { customers: FounderCustomerIntelligence }) {
    return (
        <div className="space-y-4">
            <Metric label="Average health score" value={String(customers.averageHealthScore)} />

            <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                    <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Health overview</h3>
                    {customers.healthOverview.length === 0 ? (
                        <EmptyState title="No health scores" description="CS health scores from Supabase will list here." />
                    ) : (
                        <ul className="mt-3 space-y-2 text-sm">
                            {customers.healthOverview.map((h) => (
                                <li key={h.id} className="flex justify-between gap-2 border-b border-[var(--dos-border-subtle)] py-2">
                                    <span>{h.name}</span>
                                    <Badge variant={h.healthScore >= 70 ? "success" : h.healthScore >= 50 ? "warning" : "error"}>{h.healthScore}</Badge>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>

                <Card>
                    <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Expansion opportunities</h3>
                    {customers.expansionOpportunities.length === 0 ? (
                        <EmptyState title="No expansions" description="CS expansion opportunities surface here." />
                    ) : (
                        <ul className="mt-3 space-y-2 text-sm">
                            {customers.expansionOpportunities.map((e) => (
                                <li key={e.id} className="flex justify-between gap-2 border-b border-[var(--dos-border-subtle)] py-2">
                                    <span>
                                        {e.name}
                                        <span className="block text-[var(--dos-text-tertiary)]">{e.type}</span>
                                    </span>
                                    <span>${e.estimatedValueUsd.toLocaleString()}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>

                <Card>
                    <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Churn watchlist</h3>
                    {customers.churnWatchlist.length === 0 ? (
                        <EmptyState title="No churn risks" description="Low health and churn predictions appear here." />
                    ) : (
                        <ul className="mt-3 space-y-2 text-sm">
                            {customers.churnWatchlist.map((c) => (
                                <li key={c.id} className="flex justify-between gap-2 border-b border-[var(--dos-border-subtle)] py-2">
                                    <span>{c.name}</span>
                                    <Badge variant="error">{c.status}</Badge>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>

                <Card>
                    <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Top customers</h3>
                    {customers.topCustomers.length === 0 ? (
                        <EmptyState title="No top customers" description="Active subscription MRR by billing account will rank here." />
                    ) : (
                        <ul className="mt-3 space-y-2 text-sm">
                            {customers.topCustomers.map((c) => (
                                <li key={c.name} className="flex justify-between gap-2 border-b border-[var(--dos-border-subtle)] py-2">
                                    <span>{c.name}</span>
                                    <span>${c.mrrUsd.toLocaleString()} MRR</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>

                <Card>
                    <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Inactive customers</h3>
                    {customers.inactiveCustomers.length === 0 ? (
                        <EmptyState title="No inactive customers" description="Inactive or stale client records appear here." />
                    ) : (
                        <ul className="mt-3 space-y-2 text-sm">
                            {customers.inactiveCustomers.map((c) => (
                                <li key={c.id} className="flex justify-between gap-2 border-b border-[var(--dos-border-subtle)] py-2">
                                    <span>{c.name}</span>
                                    <span className="text-[var(--dos-text-tertiary)]">{c.status}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>

                <Card>
                    <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Adoption heatmap</h3>
                    {customers.adoptionHeatmap.length === 0 ? (
                        <EmptyState title="No adoption data" description="CS adoption tracking percentages render as a heatmap." />
                    ) : (
                        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                            {customers.adoptionHeatmap.map((cell) => (
                                <div
                                    key={cell.label}
                                    className="rounded-[var(--dos-radius-lg)] border border-[var(--dos-border-subtle)] p-3"
                                    style={{
                                        background: `color-mix(in srgb, var(--dos-success) ${Math.min(100, cell.value)}%, var(--dos-surface-elevated))`,
                                    }}
                                >
                                    <p className="text-xs text-[var(--dos-text-secondary)]">{cell.label}</p>
                                    <p className="mt-1 text-lg font-semibold text-[var(--dos-text-primary)]">{cell.value}%</p>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}

export function FounderAlertsPanel({ alerts }: { alerts: FounderAlert[] }) {
    if (alerts.length === 0) {
        return <EmptyState title="No founder alerts" description="Revenue, payments, incidents, signups, trials, and security alerts appear when live signals fire." />;
    }
    return (
        <ul className="space-y-3">
            {alerts.map((a) => (
                <Card key={a.id}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <p className="font-semibold text-[var(--dos-text-primary)]">{a.title}</p>
                            <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">{a.detail}</p>
                            <p className="mt-2 text-xs text-[var(--dos-text-tertiary)]">{a.detectedAt}</p>
                        </div>
                        <div className="flex gap-2">
                            <Badge variant="info">{a.category}</Badge>
                            <Badge variant={a.severity === "critical" || a.severity === "high" ? "error" : a.severity === "medium" ? "warning" : "default"}>
                                {a.severity}
                            </Badge>
                        </div>
                    </div>
                </Card>
            ))}
        </ul>
    );
}

export function ExecutiveAdvisorPanel({ advisor }: { advisor: FounderAdvisorBriefing }) {
    return (
        <div className="space-y-4">
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Daily founder briefing</h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--dos-text-secondary)]">{advisor.dailyBriefing}</p>
                <p className="mt-2 text-xs text-[var(--dos-text-tertiary)]">Generated {advisor.generatedAt}</p>
            </Card>
            <div className="grid gap-4 lg:grid-cols-3">
                <Card>
                    <h3 className="font-semibold text-[var(--dos-text-primary)]">Business risks</h3>
                    <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[var(--dos-text-secondary)]">
                        {advisor.businessRisks.map((r) => (
                            <li key={r}>{r}</li>
                        ))}
                    </ul>
                </Card>
                <Card>
                    <h3 className="font-semibold text-[var(--dos-text-primary)]">Growth opportunities</h3>
                    <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[var(--dos-text-secondary)]">
                        {advisor.growthOpportunities.map((r) => (
                            <li key={r}>{r}</li>
                        ))}
                    </ul>
                </Card>
                <Card>
                    <h3 className="font-semibold text-[var(--dos-text-primary)]">Revenue recommendations</h3>
                    <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[var(--dos-text-secondary)]">
                        {advisor.revenueRecommendations.map((r) => (
                            <li key={r}>{r}</li>
                        ))}
                    </ul>
                </Card>
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Weekly executive summary</h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--dos-text-secondary)]">{advisor.weeklyExecutiveSummary}</p>
            </Card>
        </div>
    );
}

export function BoardRoomPanel({
    board,
    executive,
}: {
    board: BoardRoomSnapshot;
    executive: FounderExecutiveDashboard;
}) {
    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-[var(--dos-text-secondary)]">Investor-ready KPIs from live Supabase metrics.</p>
                <button
                    type="button"
                    className="rounded-[var(--dos-radius-lg)] bg-[var(--dos-accent)] px-4 py-2 text-sm font-medium text-[var(--dos-accent-contrast,white)]"
                    onClick={() => {
                        void exportBoardRoomPdf({ board, executive });
                    }}
                >
                    Export PDF
                </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {board.investorKpis.map((k) => (
                    <Metric key={k.label} label={k.label} value={k.value} hint={k.note} />
                ))}
            </div>

            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">SaaS metrics</h3>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2 text-sm">
                    {board.saasMetrics.map((m) => (
                        <li key={m.label} className="flex justify-between border-b border-[var(--dos-border-subtle)] py-2">
                            <span className="text-[var(--dos-text-secondary)]">{m.label}</span>
                            <span className="font-medium text-[var(--dos-text-primary)]">{m.value}</span>
                        </li>
                    ))}
                </ul>
            </Card>

            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Executive report</h3>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[var(--dos-text-secondary)]">
                    {board.executiveReportLines.map((line) => (
                        <li key={line}>{line}</li>
                    ))}
                </ul>
            </Card>

            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Monthly business snapshot</h3>
                <pre className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-[var(--dos-text-secondary)]">{board.monthlyBusinessSnapshot}</pre>
            </Card>
        </div>
    );
}
