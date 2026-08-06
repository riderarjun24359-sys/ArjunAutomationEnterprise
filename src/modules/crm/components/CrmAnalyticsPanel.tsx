"use client";

import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import { formatCurrency } from "../services/crm-enterprise-builders";
import type { CrmAnalyticsBundle } from "../types/enterprise";

export function CrmAnalyticsPanel({ analytics }: { analytics: CrmAnalyticsBundle }) {
    const funnelEmpty = analytics.conversionFunnel.every((f) => f.count === 0);
    const winLossData = [
        { name: "Won", value: analytics.winLoss.won },
        { name: "Lost", value: analytics.winLoss.lost },
    ];
    const winLossEmpty = analytics.winLoss.won + analytics.winLoss.lost === 0;

    return (
        <div className="grid gap-4 md:grid-cols-2">
            <Card>
                <h3 className="text-sm font-semibold text-[var(--dos-text-primary)]">Conversion funnel</h3>
                <div className="mt-4 h-56">
                    {funnelEmpty ? (
                        <EmptyState className="h-full border-0 bg-transparent p-4" title="No funnel data" description="Lead stages populate this chart." />
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analytics.conversionFunnel}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--dos-border-subtle)" />
                                <XAxis dataKey="stage" tick={{ fontSize: 10 }} />
                                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                                <Tooltip />
                                <Bar dataKey="count" fill="var(--dos-brand-primary)" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </Card>

            <Card>
                <h3 className="text-sm font-semibold text-[var(--dos-text-primary)]">Win / Loss</h3>
                <p className="mt-1 text-xs text-[var(--dos-text-tertiary)]">
                    Win rate {analytics.winLoss.winRate}% · Won {formatCurrency(analytics.winLoss.wonAmount)} · Lost {formatCurrency(analytics.winLoss.lostAmount)}
                </p>
                <div className="mt-4 h-56">
                    {winLossEmpty ? (
                        <EmptyState className="h-full border-0 bg-transparent p-4" title="No win/loss records" description="Sales win/loss outcomes from Supabase appear here." />
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={winLossData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                    {winLossData.map((entry, index) => (
                                        <Cell key={entry.name} fill={index === 0 ? "#10b981" : "#ef4444"} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </Card>

            <Card>
                <h3 className="text-sm font-semibold text-[var(--dos-text-primary)]">Revenue</h3>
                <p className="mt-3 text-3xl font-bold text-[var(--dos-text-primary)]">{analytics.revenue.label}</p>
                <p className="mt-2 text-sm text-[var(--dos-text-secondary)]">
                    Outstanding {formatCurrency(analytics.revenue.outstanding)}
                </p>
            </Card>

            <Card>
                <h3 className="text-sm font-semibold text-[var(--dos-text-primary)]">Team performance</h3>
                <div className="mt-4 max-h-56 space-y-2 overflow-y-auto">
                    {analytics.teamPerformance.length === 0 ? (
                        <EmptyState className="border-0 bg-transparent p-4" title="No team data" description="Owners from clients and leads appear here." />
                    ) : (
                        analytics.teamPerformance.map((row) => (
                            <div key={row.owner} className="flex items-center justify-between rounded-[var(--dos-radius-lg)] border border-[var(--dos-border)] px-3 py-2 text-sm">
                                <div>
                                    <p className="font-medium">{row.owner}</p>
                                    <p className="text-xs text-[var(--dos-text-tertiary)]">{row.clients} clients · {row.leads} leads</p>
                                </div>
                                <p className="font-semibold">{formatCurrency(row.revenue)}</p>
                            </div>
                        ))
                    )}
                </div>
            </Card>
        </div>
    );
}
