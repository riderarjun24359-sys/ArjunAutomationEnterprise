"use client";

import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import type {
    CustomerLifecycle,
    FounderGrowthDashboard,
    GrowthAnalytics,
    MarketingCrm,
    SalesPipeline,
} from "../types";

function Metric({ label, value }: { label: string; value: string }) {
    return (
        <Card>
            <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]">{label}</p>
            <p className="mt-3 text-2xl font-bold text-[var(--dos-text-primary)]">{value}</p>
        </Card>
    );
}

export function MarketingCrmPanel({ marketing }: { marketing: MarketingCrm }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Leads captured" value={String(marketing.totalLeads)} />
                <Metric label="Converted" value={String(marketing.convertedLeads)} />
                <Metric
                    label="Conversion rate"
                    value={marketing.conversionRatePercent != null ? `${marketing.conversionRatePercent}%` : "—"}
                />
                <Metric label="Active campaigns" value={String(marketing.activeCampaigns)} />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                    <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Lead capture</h3>
                    {marketing.leads.length === 0 ? (
                        <EmptyState title="No leads" description="Sales leads from Supabase appear here." />
                    ) : (
                        <ul className="mt-3 max-h-72 space-y-2 overflow-auto text-sm">
                            {marketing.leads.map((l) => (
                                <li key={l.id} className="flex items-center justify-between gap-2 border-b border-[var(--dos-border-subtle)] py-2">
                                    <div>
                                        <p className="font-medium">{l.name}</p>
                                        <p className="text-xs text-[var(--dos-text-tertiary)]">
                                            {l.company} · {l.source}
                                        </p>
                                    </div>
                                    <Badge variant="info">{l.status}</Badge>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>

                <Card>
                    <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Campaign tracking</h3>
                    {marketing.campaigns.length === 0 ? (
                        <EmptyState title="No campaigns" description="Communication hub campaigns list here." />
                    ) : (
                        <ul className="mt-3 max-h-72 space-y-2 overflow-auto text-sm">
                            {marketing.campaigns.map((c) => (
                                <li key={c.id} className="flex justify-between gap-2">
                                    <span>
                                        {c.name} · {c.channel}
                                    </span>
                                    <Badge variant="info">{c.status}</Badge>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                    <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Source attribution</h3>
                    {marketing.sourceBuckets.length === 0 && marketing.attributions.length === 0 ? (
                        <EmptyState title="No attribution" description="Lead sources and AAGO attribution rows power this view." />
                    ) : (
                        <ul className="mt-3 max-h-72 space-y-2 overflow-auto text-sm">
                            {marketing.sourceBuckets.map((s) => (
                                <li key={s.source} className="flex justify-between gap-2">
                                    <span>{s.source}</span>
                                    <span>
                                        {s.leads} leads · {s.conversionRatePercent ?? "—"}%
                                    </span>
                                </li>
                            ))}
                            {marketing.attributions.map((a) => (
                                <li key={a.id} className="flex justify-between gap-2">
                                    <span>
                                        {a.title} · {a.channel}
                                    </span>
                                    <span>{a.conversionRate}%</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>

                <Card>
                    <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Conversion dashboard</h3>
                    <p className="mt-2 text-sm text-[var(--dos-text-secondary)]">
                        {marketing.convertedLeads} of {marketing.totalLeads} leads converted
                        {marketing.conversionRatePercent != null ? ` (${marketing.conversionRatePercent}%)` : ""}.
                    </p>
                </Card>
            </div>
        </div>
    );
}

export function SalesPipelinePanel({ sales }: { sales: SalesPipeline }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Pipeline value" value={`$${sales.pipelineValueUsd}`} />
                <Metric label="Opportunities" value={String(sales.opportunities.length)} />
                <Metric label="Overdue follow-ups" value={String(sales.overdueFollowUps)} />
                <Metric label="Win rate" value={sales.winRatePercent != null ? `${sales.winRatePercent}%` : "—"} />
            </div>

            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Enterprise deal stages</h3>
                {sales.stages.length === 0 ? (
                    <EmptyState title="No stages" description="Opportunity stages from sales pipeline appear here." />
                ) : (
                    <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                        {sales.stages.map((s) => (
                            <li key={s.stage} className="rounded-[var(--dos-radius-md)] bg-[var(--dos-surface-tertiary)] p-3 text-sm">
                                <p className="font-medium">{s.stage}</p>
                                <p className="mt-1 text-xl font-bold">{s.count}</p>
                                <p className="text-xs text-[var(--dos-text-tertiary)]">${s.amountUsd}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </Card>

            <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                    <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Proposal management</h3>
                    {sales.proposals.length === 0 ? (
                        <EmptyState title="No proposals" description="Sales quotes act as proposals." />
                    ) : (
                        <ul className="mt-3 max-h-64 space-y-2 overflow-auto text-sm">
                            {sales.proposals.map((p) => (
                                <li key={p.id} className="flex justify-between gap-2">
                                    <span>
                                        {p.title} · {p.quoteNumber}
                                    </span>
                                    <span>
                                        ${p.amount} · {p.status}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>

                <Card>
                    <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Follow-up reminders</h3>
                    {sales.followUps.length === 0 ? (
                        <EmptyState title="No follow-ups" description="Sales activities with due dates appear here." />
                    ) : (
                        <ul className="mt-3 max-h-64 space-y-2 overflow-auto text-sm">
                            {sales.followUps.map((f) => (
                                <li key={f.id} className="flex justify-between gap-2">
                                    <span>
                                        {f.subject} · {f.activityType}
                                    </span>
                                    <Badge variant={f.completedAt ? "success" : "warning"}>
                                        {f.completedAt ? "done" : f.dueAt ?? "open"}
                                    </Badge>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>
            </div>

            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Win / Loss analysis</h3>
                {sales.winLoss.length === 0 ? (
                    <EmptyState title="No win/loss records" description="sales_win_loss_records feed this analysis." />
                ) : (
                    <ul className="mt-3 max-h-64 space-y-2 overflow-auto text-sm">
                        {sales.winLoss.map((w) => (
                            <li key={w.id} className="flex justify-between gap-2">
                                <span>
                                    {w.outcome} · {w.reason || "—"}
                                </span>
                                <span>
                                    ${w.amount} · {w.competitor || "n/a"}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </Card>
        </div>
    );
}

export function CustomerLifecyclePanel({ lifecycle }: { lifecycle: CustomerLifecycle }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Trial subs" value={String(lifecycle.trialSubscriptions.length)} />
                <Metric label="Paid subs" value={String(lifecycle.paidSubscriptions.length)} />
                <Metric
                    label="Trial → Paid"
                    value={lifecycle.trialToPaidRatePercent != null ? `${lifecycle.trialToPaidRatePercent}%` : "—"}
                />
                <Metric label="High churn risk" value={String(lifecycle.highChurnCount)} />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                    <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Trial → Paid tracking</h3>
                    {lifecycle.trialSubscriptions.length === 0 && lifecycle.paidSubscriptions.length === 0 ? (
                        <EmptyState title="No subscriptions" description="Billing subscription rows power trial/paid tracking." />
                    ) : (
                        <ul className="mt-3 max-h-64 space-y-2 overflow-auto text-sm">
                            {[...lifecycle.trialSubscriptions, ...lifecycle.paidSubscriptions].map((s) => (
                                <li key={s.id} className="flex justify-between gap-2">
                                    <span>{s.planName}</span>
                                    <Badge variant="info">
                                        {s.status}/{s.paymentStatus}
                                    </Badge>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>

                <Card>
                    <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Churn prediction</h3>
                    {lifecycle.churnPredictions.length === 0 ? (
                        <EmptyState title="No predictions" description="cs_churn_predictions appear here." />
                    ) : (
                        <ul className="mt-3 max-h-64 space-y-2 overflow-auto text-sm">
                            {lifecycle.churnPredictions.map((c) => (
                                <li key={c.id} className="flex justify-between gap-2">
                                    <span>{c.name}</span>
                                    <Badge variant={c.probability >= 0.5 ? "warning" : "info"}>
                                        {Math.round(c.probability * 100)}%
                                    </Badge>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                    <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Renewal workflow</h3>
                    {lifecycle.renewals.length === 0 ? (
                        <EmptyState title="No renewals" description="cs_renewal_plans list here." />
                    ) : (
                        <ul className="mt-3 max-h-64 space-y-2 overflow-auto text-sm">
                            {lifecycle.renewals.map((r) => (
                                <li key={r.id} className="flex justify-between gap-2">
                                    <span>
                                        {r.name} · {r.renewalDate ?? "TBD"}
                                    </span>
                                    <span>
                                        ${r.valueUsd} · {r.status}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>

                <Card>
                    <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Expansion opportunities</h3>
                    {lifecycle.expansions.length === 0 ? (
                        <EmptyState title="No expansions" description="cs_expansion_opportunities appear here." />
                    ) : (
                        <ul className="mt-3 max-h-64 space-y-2 overflow-auto text-sm">
                            {lifecycle.expansions.map((e) => (
                                <li key={e.id} className="flex justify-between gap-2">
                                    <span>
                                        {e.name} · {e.type}
                                    </span>
                                    <span>${e.estimatedValueUsd}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>
            </div>
        </div>
    );
}

export function GrowthAnalyticsPanel({ analytics }: { analytics: GrowthAnalytics }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="CAC" value={analytics.cacUsd != null ? `$${analytics.cacUsd}` : "—"} />
                <Metric label="LTV" value={analytics.ltvUsd != null ? `$${analytics.ltvUsd}` : "—"} />
                <Metric label="MRR" value={`$${analytics.mrrUsd}`} />
                <Metric label="ARR" value={`$${analytics.arrUsd}`} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric
                    label="Activation rate"
                    value={analytics.activationRatePercent != null ? `${analytics.activationRatePercent}%` : "—"}
                />
                <Metric
                    label="Retention rate"
                    value={analytics.retentionRatePercent != null ? `${analytics.retentionRatePercent}%` : "—"}
                />
                <Metric
                    label="Referral rate"
                    value={analytics.referralRatePercent != null ? `${analytics.referralRatePercent}%` : "—"}
                />
                <Metric label="New / Churn MRR" value={`$${analytics.newMrrUsd} / $${analytics.churnMrrUsd}`} />
            </div>
        </div>
    );
}

export function FounderGrowthPanel({ founder }: { founder: FounderGrowthDashboard }) {
    return (
        <div className="space-y-4">
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Founder growth summary</h3>
                <p className="mt-2 text-sm text-[var(--dos-text-secondary)]">{founder.summary}</p>
            </Card>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Daily revenue" value={`$${founder.dailyRevenueUsd}`} />
                <Metric label="New orgs today" value={String(founder.newOrganizationsToday)} />
                <Metric label="New orgs (7d)" value={String(founder.newOrganizations7d)} />
                <Metric label="Active users" value={String(founder.activeUsers)} />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                    <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Conversion funnel</h3>
                    <ul className="mt-3 space-y-2 text-sm">
                        {founder.funnel.map((step) => (
                            <li key={step.step} className="flex justify-between gap-2">
                                <span>{step.step}</span>
                                <span>
                                    {step.count}
                                    {step.conversionFromPreviousPercent != null
                                        ? ` · ${step.conversionFromPreviousPercent}%`
                                        : ""}
                                </span>
                            </li>
                        ))}
                    </ul>
                </Card>

                <Card>
                    <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Growth alerts</h3>
                    <ul className="mt-3 space-y-2 text-sm">
                        {founder.alerts.map((a) => (
                            <li key={a.id} className="rounded-[var(--dos-radius-md)] border border-[var(--dos-border-subtle)] p-3">
                                <div className="flex items-center justify-between gap-2">
                                    <p className="font-medium">{a.title}</p>
                                    <Badge
                                        variant={
                                            a.severity === "critical"
                                                ? "error"
                                                : a.severity === "warning"
                                                  ? "warning"
                                                  : "info"
                                        }
                                    >
                                        {a.severity}
                                    </Badge>
                                </div>
                                <p className="mt-1 text-xs text-[var(--dos-text-tertiary)]">{a.detail}</p>
                            </li>
                        ))}
                    </ul>
                </Card>
            </div>
        </div>
    );
}
