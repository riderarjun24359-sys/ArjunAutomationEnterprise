"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card } from "@/src/components/ui/card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { CHART_COLORS } from "@/src/modules/analytics/constants";
import type { AnalyticsSummary } from "@/src/modules/analytics/types";

interface AnalyticsChartsPanelProps {
    summary: AnalyticsSummary | null;
}

export function AnalyticsChartsPanel({ summary }: AnalyticsChartsPanelProps) {
    if (!summary) {
        return (
            <Card hover>
                <SectionHeader title="Performance charts" description="Visual trends across delivery and automation" />
                <div className="mt-6">
                    <EmptyState title="No chart data" description="Analytics charts will populate once workspace data is available." />
                </div>
            </Card>
        );
    }

    const portfolioData = [
        { name: "Clients", value: summary.activeClients },
        { name: "Projects", value: summary.activeProjects },
        { name: "Success %", value: summary.workflowSuccessRate },
    ];

    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover>
                <SectionHeader title="Revenue trend" description="Settlement reconciliation is required before revenue trends can be reported" />
                <div className="mt-6">
                    <EmptyState title="Revenue not verified" description="Manual invoice and payment records are not proof of cleared settlements." />
                </div>
            </Card>
            <Card hover>
                <SectionHeader title="Finance KPIs" description="Paid revenue and outstanding balances" />
                <div className="mt-6">
                    <EmptyState title="Finance totals not verified" description="Razorpay settlement-to-invoice/deal reconciliation is required before totals can be displayed." />
                </div>
            </Card>
            <Card hover className="xl:col-span-2">
                <SectionHeader title="Portfolio mix" description="Clients, projects, and automation success" />
                <div className="mt-6 h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={portfolioData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110} label>
                                {portfolioData.map((entry, index) => (
                                    <Cell key={entry.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
    );
}
