"use client";

import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { Card } from "@/src/components/ui/Card";
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
                <SectionHeader title="Performance charts" description="Visual trends across finance, delivery, and automation" />
                <div className="mt-6">
                    <EmptyState title="No chart data" description="Analytics charts will populate once workspace data is available." />
                </div>
            </Card>
        );
    }

    const kpiData = [
        { name: "Revenue", value: summary.revenuePaid },
        { name: "Outstanding", value: summary.revenueOutstanding },
        { name: "Expenses", value: summary.expenseTotal },
        { name: "Open Tasks", value: summary.openTasks },
    ];

    const portfolioData = [
        { name: "Clients", value: summary.activeClients },
        { name: "Projects", value: summary.activeProjects },
        { name: "Success %", value: summary.workflowSuccessRate },
    ];

    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover>
                <SectionHeader title="Revenue trend" description="Invoice totals across documents" />
                <div className="mt-6 h-72">
                    {summary.monthlyTrend.length === 0 ? (
                        <EmptyState title="No trend data" description="Invoice records will populate this chart." />
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={summary.monthlyTrend}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </Card>

            <Card hover>
                <SectionHeader title="Finance KPIs" description="Paid revenue, outstanding balance, and expenses" />
                <div className="mt-6 h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={kpiData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
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
