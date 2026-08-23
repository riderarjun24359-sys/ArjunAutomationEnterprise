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
import { IntelligentContainer } from "@/src/design-os/components/IntelligentContainer";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import type { ExecutiveChartsBundle } from "../types";

const CHART_COLORS = [
    "var(--dos-brand-primary)",
    "#0ea5e9",
    "#10b981",
    "#f59e0b",
    "#ef4444",
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
        <IntelligentContainer material="base" className="flex flex-col">
            <h3 className="text-sm font-semibold text-[var(--dos-text-primary)] tracking-wide uppercase">{title}</h3>
            <p className="mt-1 text-xs text-[var(--dos-text-tertiary)]">{description}</p>
            <div className="mt-6 h-56 w-full sm:h-64">
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
        </IntelligentContainer>
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
            <h2 className="mb-6 text-xs font-semibold uppercase tracking-widest text-[var(--dos-text-tertiary)]">
                Executive Analytics
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
                <ChartShell
                    title="Revenue Trend"
                    description="Collected payments / invoice amounts by month"
                    empty={revenueEmpty}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={charts.revenueTrend}>
                            <CartesianGrid vertical={false} stroke="var(--dos-border-subtle)" />
                            <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--dos-text-tertiary)" }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--dos-text-tertiary)" }} />
                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', background: 'var(--dos-surface-elevated)', color: 'var(--dos-text-primary)' }} />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="var(--dos-brand-primary)"
                                strokeWidth={2}
                                dot={false}
                                activeDot={{ r: 4, strokeWidth: 0 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartShell>

                <ChartShell
                    title="Client Growth"
                    description="Cumulative clients over the last 6 months"
                    empty={clientEmpty}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={charts.clientGrowth}>
                            <CartesianGrid vertical={false} stroke="var(--dos-border-subtle)" />
                            <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--dos-text-tertiary)" }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--dos-text-tertiary)" }} />
                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', background: 'var(--dos-surface-elevated)', color: 'var(--dos-text-primary)' }} />
                            <Bar dataKey="value" fill="var(--dos-brand-accent)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartShell>
                
                {/* Simplified pie chart shell structure */}
                <ChartShell
                    title="Project Status"
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
                                outerRadius={70}
                                innerRadius={40}
                                stroke="none"
                            >
                                {charts.projectStatus.map((entry, index) => (
                                    <Cell key={entry.status} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', background: 'var(--dos-surface-elevated)', color: 'var(--dos-text-primary)' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartShell>

                <ChartShell
                    title="Task Completion Rate"
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
                                innerRadius={40}
                                outerRadius={70}
                                stroke="none"
                            >
                                {taskRateData.map((entry, index) => (
                                    <Cell key={entry.name} fill={index === 0 ? "var(--dos-tint-success)" : "var(--dos-tint-warning)"} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', background: 'var(--dos-surface-elevated)', color: 'var(--dos-text-primary)' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartShell>
            </div>
        </section>
    );
}
