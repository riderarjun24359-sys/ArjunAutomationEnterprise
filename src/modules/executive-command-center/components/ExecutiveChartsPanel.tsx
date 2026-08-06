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
import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import type { ExecutiveChartsBundle } from "../types";

const CHART_COLORS = [
    "var(--dos-brand-primary)",
    "#0ea5e9",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#64748b",
];

function ChartShell({
    title,
    description,
    empty,
    children,
}: {
    title: string;
    description: string;
    empty: boolean;
    children: React.ReactNode;
}) {
    return (
        <Card>
            <h3 className="text-sm font-semibold text-[var(--dos-text-primary)]">{title}</h3>
            <p className="mt-1 text-xs text-[var(--dos-text-tertiary)]">{description}</p>
            <div className="mt-4 h-56 sm:h-64">
                {empty ? (
                    <EmptyState
                        className="h-full border-0 bg-transparent p-4"
                        title="No data yet"
                        description="Charts populate from live Supabase records."
                    />
                ) : (
                    children
                )}
            </div>
        </Card>
    );
}

export function ExecutiveChartsPanel({ charts }: { charts: ExecutiveChartsBundle }) {
    const revenueEmpty = charts.revenueTrend.every((p) => p.value === 0);
    const clientEmpty = charts.clientGrowth.every((p) => p.value === 0);
    const projectEmpty = charts.projectStatus.length === 0;
    const taskEmpty = charts.taskCompletion.total === 0;

    const taskRateData = [
        { name: "Completed", value: charts.taskCompletion.completed },
        { name: "Open", value: charts.taskCompletion.open },
    ];

    return (
        <section>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--dos-text-secondary)]">
                Executive Charts
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
                <ChartShell
                    title="Revenue trend"
                    description="Collected payments / invoice amounts by month"
                    empty={revenueEmpty}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={charts.revenueTrend}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--dos-border-subtle)" />
                            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="var(--dos-brand-primary)"
                                strokeWidth={2.5}
                                dot={{ r: 3 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartShell>

                <ChartShell
                    title="Client growth"
                    description="Cumulative clients over the last 6 months"
                    empty={clientEmpty}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={charts.clientGrowth}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--dos-border-subtle)" />
                            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="value" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartShell>

                <ChartShell
                    title="Project status distribution"
                    description="Live project counts by status"
                    empty={projectEmpty}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={charts.projectStatus}
                                dataKey="count"
                                nameKey="status"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label
                            >
                                {charts.projectStatus.map((entry, index) => (
                                    <Cell key={entry.status} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartShell>

                <ChartShell
                    title="Task completion rate"
                    description={`${charts.taskCompletion.rate}% complete · ${charts.taskCompletion.completed}/${charts.taskCompletion.total} tasks`}
                    empty={taskEmpty}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={taskRateData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                innerRadius={45}
                                outerRadius={80}
                                label
                            >
                                {taskRateData.map((entry, index) => (
                                    <Cell key={entry.name} fill={index === 0 ? "#10b981" : "#f59e0b"} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartShell>
            </div>
        </section>
    );
}
