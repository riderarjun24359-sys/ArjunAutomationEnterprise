"use client";

import { motion } from "framer-motion";
import { Building2, Sparkles, Users } from "lucide-react";
import { Card } from "@/src/components/ui/card";
import { StatCard } from "@/src/components/ui/StatCard";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { ErrorBoundary } from "@/src/components/ui/ErrorBoundary";
import { LoadingState } from "@/src/components/ui/LoadingState";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { useDashboard } from "@/src/modules/dashboard/hooks/useDashboard";

export function DashboardShell() {
    const { overview, loading } = useDashboard();

    return (
        <ErrorBoundary>
            <div className="mx-auto flex max-w-7xl flex-col gap-6">
                <motion.header
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80"
                >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="text-sm font-medium uppercase tracking-[0.24em] text-emerald-600">Executive Command Center</p>
                            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Enterprise operating system overview</h2>
                            <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                                Live workspace intelligence from Supabase-backed organization, membership, audit, and task signals.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <div className="rounded-full border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                Data source • {overview?.source === "supabase" ? "Supabase" : "Fallback"}
                            </div>
                            <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                                {overview?.organization?.name ?? "Enterprise workspace"}
                            </div>
                        </div>
                    </div>
                </motion.header>

                {loading ? <LoadingState label="Loading executive dashboard" /> : null}

                {!loading && !overview ? (
                    <EmptyState title="No dashboard data available" description="Sign in and connect your Supabase workspace to populate this board." />
                ) : null}

                {!loading && overview ? (
                    <>
                        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                            {overview.kpis.map((card) => (
                                <StatCard key={card.title} {...card} />
                            ))}
                        </section>

                        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                            <Card hover>
                                <SectionHeader title="Organization context" description="Active workspace and governance posture" />
                                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/40">
                                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                            <Building2 className="h-4 w-4" />
                                            Organization
                                        </div>
                                        <p className="mt-2 text-xl font-semibold">{overview.organization?.name ?? "No organization linked"}</p>
                                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Status: {overview.organization?.status ?? "active"}</p>
                                    </div>
                                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/40">
                                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                            <Users className="h-4 w-4" />
                                            Team members
                                        </div>
                                        <p className="mt-2 text-xl font-semibold">{overview.teamCount}</p>
                                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Active memberships in workspace</p>
                                    </div>
                                </div>
                            </Card>

                            <Card hover>
                                <SectionHeader title="Platform signals" description="Operational health indicators" />
                                <div className="mt-6 space-y-3">
                                    {[
                                        { label: "Audit events loaded", value: overview.auditCount.toString() },
                                        { label: "Organization slug", value: overview.organization?.slug ?? "—" },
                                        { label: "Dashboard source", value: overview.source },
                                    ].map((item) => (
                                        <div key={item.label} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                                            <span className="text-sm text-slate-500 dark:text-slate-400">{item.label}</span>
                                            <span className="font-medium capitalize">{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </section>

                        <Card hover>
                            <SectionHeader title="Recent activity timeline" description="Latest audit and platform events from Supabase" />
                            <div className="mt-6 space-y-4">
                                {overview.activities.map((item) => (
                                    <div key={item.id} className="flex items-start gap-3 rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                                        <div className="mt-1 rounded-full bg-emerald-100 p-2 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                                            <Sparkles className="h-4 w-4" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="font-medium">{item.title}</p>
                                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.detail}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">{item.tag}</span>
                                            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{item.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </>
                ) : null}
            </div>
        </ErrorBoundary>
    );
}
