"use client";

import { motion } from "framer-motion";
import { BellRing, CalendarDays, Sparkles, Zap } from "lucide-react";
import { Card } from "@/src/components/ui/Card";
import { StatCard } from "@/src/components/ui/StatCard";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { ErrorBoundary } from "@/src/components/ui/ErrorBoundary";
import { LoadingState } from "@/src/components/ui/LoadingState";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { useEffect, useState } from "react";

const kpiCards = [
    { title: "Revenue", value: "$1.24M", detail: "+18% vs last month", trend: "up" as const, tone: "accent" as const },
    { title: "Retention", value: "94.2%", detail: "+3.1 pts", trend: "up" as const },
    { title: "Open Tasks", value: "128", detail: "42 overdue", trend: "down" as const },
    { title: "AI Automation", value: "87%", detail: "24 agents healthy", trend: "up" as const },
];

const projectRows = [
    { name: "Northstar Expansion", progress: 74, owner: "Mina" },
    { name: "FinOps Refresh", progress: 56, owner: "Drew" },
    { name: "Client Onboarding", progress: 92, owner: "Lina" },
];

const activityItems = [
    { title: "New contract signed", time: "10 mins ago", tag: "Revenue" },
    { title: "AI agent completed onboarding", time: "32 mins ago", tag: "Automation" },
    { title: "Project milestone updated", time: "1 hr ago", tag: "Projects" },
];

const notifications = [
    { title: "Quarterly review due", detail: "Prepare executive summary by 5 PM" },
    { title: "3 tasks blocked", detail: "Escalation required" },
];

const calendarItems = [
    { title: "Executive sync", time: "09:00" },
    { title: "Client review", time: "14:30" },
    { title: "Ops planning", time: "16:00" },
];

const quickActions = ["Review pipeline", "Launch AI runbook", "Approve invoices", "Share report"];

export function DashboardShell() {
    const [isLoading, setIsLoading] = useState(true);
    const [hasData, setHasData] = useState(true);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            setIsLoading(false);
        }, 600);

        return () => window.clearTimeout(timer);
    }, []);

    return (
        <ErrorBoundary>
            <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 dark:bg-slate-950 dark:text-slate-100 sm:px-6 lg:px-8">
                <div className="mx-auto flex max-w-7xl flex-col gap-6">
                    <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                            <div>
                                <p className="text-sm font-medium uppercase tracking-[0.24em] text-emerald-600">Executive Command Center</p>
                                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Enterprise operating system overview</h1>
                                <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">Track performance, delivery health, automation signals, and executive priorities from a premium control surface.</p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <div className="rounded-full border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">Weekly pulse • Live</div>
                                <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">AI orchestration active</div>
                            </div>
                        </div>
                    </motion.header>

                    {isLoading ? <LoadingState /> : null}

                    {!isLoading && !hasData ? <EmptyState title="No analytics available" description="Connect your data source to populate this executive board." /> : null}

                    {!isLoading && hasData ? (
                        <>
                            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                                {kpiCards.map((card) => (
                                    <StatCard key={card.title} {...card} />
                                ))}
                            </section>

                            <section className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
                                <Card hover className="min-h-[320px]">
                                    <SectionHeader title="Revenue overview" description="Revenue trend across the last 6 months" />
                                    <div className="mt-6 grid gap-4 md:grid-cols-3">
                                        {[
                                            { label: "MRR", value: "$842k" },
                                            { label: "Expansion", value: "$281k" },
                                            { label: "Forecast", value: "$1.36M" },
                                        ].map((item) => (
                                            <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/40">
                                                <p className="text-sm text-slate-500 dark:text-slate-400">{item.label}</p>
                                                <p className="mt-2 text-xl font-semibold">{item.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-6 h-40 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-6 text-white">
                                        <div className="flex h-full items-end justify-between gap-4">
                                            {[40, 72, 58, 86, 94, 76].map((height, index) => (
                                                <div key={`${height}-${index}`} className="flex-1 rounded-t-2xl bg-white/30" style={{ height: `${height}%` }} />
                                            ))}
                                        </div>
                                    </div>
                                </Card>

                                <Card hover>
                                    <SectionHeader title="Client statistics" description="Health and growth outlook" />
                                    <div className="mt-6 space-y-4">
                                        {[
                                            { label: "Active clients", value: "184" },
                                            { label: "Net growth", value: "+12.4%" },
                                            { label: "Churn risk", value: "4.1%" },
                                        ].map((item) => (
                                            <div key={item.label} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                                                <span className="text-sm text-slate-500 dark:text-slate-400">{item.label}</span>
                                                <span className="font-semibold">{item.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </section>

                            <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                                <Card hover>
                                    <SectionHeader title="Active projects" description="Delivery momentum across key initiatives" />
                                    <div className="mt-6 space-y-4">
                                        {projectRows.map((project) => (
                                            <div key={project.name} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-medium">{project.name}</p>
                                                        <p className="text-sm text-slate-500 dark:text-slate-400">Owner: {project.owner}</p>
                                                    </div>
                                                    <span className="text-sm font-semibold text-emerald-600">{project.progress}%</span>
                                                </div>
                                                <div className="mt-3 h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                                                    <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${project.progress}%` }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>

                                <Card hover>
                                    <SectionHeader title="Tasks summary" description="Execution risk and throughput" />
                                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                                        {[
                                            { label: "Completed", value: "84" },
                                            { label: "In review", value: "21" },
                                            { label: "Blocked", value: "9" },
                                            { label: "Due today", value: "13" },
                                        ].map((item) => (
                                            <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/40">
                                                <p className="text-sm text-slate-500 dark:text-slate-400">{item.label}</p>
                                                <p className="mt-2 text-2xl font-semibold">{item.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </section>

                            <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                                <Card hover>
                                    <SectionHeader title="AI agent status" description="Operational health of autonomous workflows" />
                                    <div className="mt-6 flex flex-wrap items-center gap-3">
                                        {[
                                            { label: "Forecasting", state: "Healthy" },
                                            { label: "CRM sync", state: "Healthy" },
                                            { label: "Invoice triage", state: "Watch" },
                                        ].map((agent) => (
                                            <div key={agent.label} className="rounded-full border border-slate-200 px-4 py-2 text-sm dark:border-slate-800">
                                                <span className="mr-2 inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                                                {agent.label} • {agent.state}
                                            </div>
                                        ))}
                                    </div>
                                </Card>

                                <Card hover>
                                    <SectionHeader title="Quick actions" description="Accelerate common tasks" />
                                    <div className="mt-6 flex flex-wrap gap-3">
                                        {quickActions.map((action) => (
                                            <button key={action} className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-200">
                                                {action}
                                            </button>
                                        ))}
                                    </div>
                                </Card>
                            </section>

                            <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                                <Card hover>
                                    <SectionHeader title="Recent activity timeline" description="High-signal events across the system" />
                                    <div className="mt-6 space-y-4">
                                        {activityItems.map((item) => (
                                            <div key={item.title} className="flex items-start gap-3 rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                                                <div className="mt-1 rounded-full bg-emerald-100 p-2 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                                                    <Sparkles className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">{item.title}</p>
                                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.time}</p>
                                                </div>
                                                <span className="ml-auto rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">{item.tag}</span>
                                            </div>
                                        ))}
                                    </div>
                                </Card>

                                <div className="space-y-6">
                                    <Card hover>
                                        <SectionHeader title="Notifications center" description="Priority updates" />
                                        <div className="mt-6 space-y-3">
                                            {notifications.map((notification) => (
                                                <div key={notification.title} className="flex gap-3 rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                                                    <div className="rounded-full bg-amber-100 p-2 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
                                                        <BellRing className="h-4 w-4" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{notification.title}</p>
                                                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{notification.detail}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </Card>

                                    <Card hover>
                                        <SectionHeader title="Calendar widget" description="Upcoming priorities" />
                                        <div className="mt-6 space-y-3">
                                            {calendarItems.map((item) => (
                                                <div key={item.title} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                                                    <span className="font-medium">{item.title}</span>
                                                    <span className="text-sm text-slate-500 dark:text-slate-400">{item.time}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </Card>
                                </div>
                            </section>
                        </>
                    ) : null}
                </div>
            </main>
        </ErrorBoundary>
    );
}
