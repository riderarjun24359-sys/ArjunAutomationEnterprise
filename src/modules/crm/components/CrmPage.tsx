"use client";

import { motion } from "framer-motion";
import { BriefcaseBusiness, CalendarDays, CheckCircle2, Mail, Sparkles, UserRound, TrendingUp, ArrowRight, Phone } from "lucide-react";
import { Card } from "@/src/components/ui/Card";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { LoadingState } from "@/src/components/ui/LoadingState";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { StatCard } from "@/src/components/ui/StatCard";
import { useCrm } from "@/src/modules/crm/hooks/useCrm";
import { CRM_TABS } from "@/src/modules/crm/constants";
import { useMemo, useState } from "react";

const tabs = [
    { id: CRM_TABS.overview, label: "Overview" },
    { id: CRM_TABS.clients, label: "Clients" },
    { id: CRM_TABS.leads, label: "Leads" },
    { id: CRM_TABS.deals, label: "Deals" },
    { id: CRM_TABS.activities, label: "Activities" },
    { id: CRM_TABS.tasks, label: "Tasks" },
];

export function CrmPage() {
    const { clients, selectedClient, leads, deals, activities, tasks, stats, loading, selectClient } = useCrm();
    const [activeTab, setActiveTab] = useState<(typeof CRM_TABS)[keyof typeof CRM_TABS]>(CRM_TABS.overview);

    const statsCards = useMemo(
        () => [
            { title: "Total Clients", value: stats?.totalClients?.toString() ?? "0", detail: "Across active engagements", trend: "up" as const, tone: "accent" as const },
            { title: "Active Deals", value: stats?.activeDeals?.toString() ?? "0", detail: "In progress", trend: "up" as const },
            { title: "Monthly Revenue", value: stats?.monthlyRevenue ?? "$0", detail: "Forecast confidence", trend: "up" as const },
            { title: "New Leads", value: stats?.newLeads?.toString() ?? "0", detail: "Qualified this month", trend: "up" as const },
        ],
        [stats],
    );

    if (loading) {
        return <LoadingState />;
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-slate-900 dark:text-slate-100">
                <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="text-sm font-medium uppercase tracking-[0.24em] text-emerald-600">CRM Command Center</p>
                            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Manage clients, leads, deals, and activities in one place</h1>
                            <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">Track client health, conversion signals, and deal momentum with a premium revenue operations workspace.</p>
                        </div>
                        <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">Revenue growth ready</div>
                    </div>
                </motion.header>

                <div className="flex flex-wrap gap-2">
                    {tabs.map((tab) => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === tab.id ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900" : "bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"}`}>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {activeTab === CRM_TABS.overview ? (
                    <>
                        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                            {statsCards.map((card) => (
                                <StatCard key={card.title} {...card} />
                            ))}
                        </section>

                        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                            <Card hover>
                                <SectionHeader title="Client pipeline" description="Current client engagement health" />
                                <div className="mt-6 space-y-3">
                                    {clients.map((client) => (
                                        <button key={client.id} onClick={() => void selectClient(client.id)} className="flex w-full items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-left transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-950/40">
                                            <div>
                                                <p className="font-medium">{client.name}</p>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">{client.industry} • {client.contactEmail}</p>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                                <BriefcaseBusiness className="h-4 w-4" /> {client.revenue}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </Card>

                            <Card hover>
                                <SectionHeader title="Conversion rate" description="Momentum snapshot" />
                                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/40">
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Current conversion</p>
                                    <p className="mt-3 text-4xl font-semibold">{stats?.conversionRate ?? "0%"}</p>
                                    <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Lead-to-client movement is trending upward, with stronger proposal conversion this month.</p>
                                </div>
                            </Card>
                        </section>

                        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                            <Card hover>
                                <SectionHeader title="Recent activities" description="Latest CRM signals" />
                                <div className="mt-6 space-y-3">
                                    {stats?.recentActivities.map((activity) => (
                                        <div key={activity.id} className="flex items-start gap-3 rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                                            <div className="rounded-full bg-emerald-100 p-2 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                                                <Sparkles className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{activity.title}</p>
                                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{activity.detail}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            <Card hover>
                                <SectionHeader title="Client detail" description="Highlighted profile" />
                                {selectedClient ? (
                                    <div className="mt-6 space-y-4">
                                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/40">
                                            <p className="text-sm text-slate-500 dark:text-slate-400">Selected client</p>
                                            <p className="mt-2 text-xl font-semibold">{selectedClient.name}</p>
                                            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{selectedClient.description}</p>
                                        </div>
                                        <div className="grid gap-3 sm:grid-cols-2">
                                            <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                                                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400"><Phone className="h-4 w-4" /> Contact</div>
                                                <p className="mt-2 font-medium">{selectedClient.phone}</p>
                                            </div>
                                            <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                                                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400"><Mail className="h-4 w-4" /> Email</div>
                                                <p className="mt-2 font-medium">{selectedClient.contactEmail}</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-950/40">Select a client to inspect their profile.</div>
                                )}
                            </Card>
                        </section>
                    </>
                ) : null}

                {activeTab === CRM_TABS.clients ? (
                    <Card hover>
                        <SectionHeader title="Client roster" description="Client profile, status, and ownership" />
                        <div className="mt-6 grid gap-4 md:grid-cols-2">
                            {clients.map((client) => (
                                <div key={client.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="font-semibold">{client.name}</p>
                                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{client.industry}</p>
                                        </div>
                                        <span className="rounded-full border border-slate-200 px-3 py-1 text-sm dark:border-slate-700">{client.status}</span>
                                    </div>
                                    <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                                        <div className="flex items-center justify-between"><span>Manager</span><span>{client.manager}</span></div>
                                        <div className="flex items-center justify-between"><span>Revenue</span><span>{client.revenue}</span></div>
                                        <div className="flex items-center justify-between"><span>Contact</span><span>{client.contactEmail}</span></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                ) : null}

                {activeTab === CRM_TABS.leads ? (
                    <Card hover>
                        <SectionHeader title="Lead pipeline" description="Lead stages and score" />
                        <div className="mt-6 grid gap-4 md:grid-cols-2">
                            {leads.map((lead) => (
                                <div key={lead.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="font-semibold">{lead.company}</p>
                                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{lead.contact}</p>
                                        </div>
                                        <span className="rounded-full border border-slate-200 px-3 py-1 text-sm dark:border-slate-700">{lead.stage}</span>
                                    </div>
                                    <div className="mt-4 flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
                                        <span>Score {lead.score}</span>
                                        <span>{lead.value}</span>
                                    </div>
                                    <div className="mt-3 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                                        <span>Assigned to {lead.assignedTo}</span>
                                        <button className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">Convert <ArrowRight className="h-4 w-4" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                ) : null}

                {activeTab === CRM_TABS.deals ? (
                    <Card hover>
                        <SectionHeader title="Deals" description="Revenue opportunities and probabilities" />
                        <div className="mt-6 grid gap-4 md:grid-cols-2">
                            {deals.map((deal) => (
                                <div key={deal.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="font-semibold">{deal.client}</p>
                                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Close {deal.closeDate}</p>
                                        </div>
                                        <span className="rounded-full border border-slate-200 px-3 py-1 text-sm dark:border-slate-700">{deal.stage}</span>
                                    </div>
                                    <div className="mt-4 flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
                                        <span>Value {deal.value}</span>
                                        <span>{deal.probability}%</span>
                                    </div>
                                    <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{deal.revenueMetric}</p>
                                </div>
                            ))}
                        </div>
                    </Card>
                ) : null}

                {activeTab === CRM_TABS.activities ? (
                    <Card hover>
                        <SectionHeader title="Activities" description="Calls, meetings, notes, emails, and follow-ups" />
                        <div className="mt-6 grid gap-4 md:grid-cols-2">
                            {activities.map((activity) => (
                                <div key={activity.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                                    <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                                        {activity.type === "call" ? <Phone className="h-4 w-4" /> : activity.type === "meeting" ? <CalendarDays className="h-4 w-4" /> : activity.type === "email" ? <Mail className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                                        {activity.type}
                                    </div>
                                    <p className="mt-3 font-semibold">{activity.title}</p>
                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{activity.detail}</p>
                                    <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{activity.dueAt}</p>
                                </div>
                            ))}
                        </div>
                    </Card>
                ) : null}

                {activeTab === CRM_TABS.tasks ? (
                    <Card hover>
                        <SectionHeader title="Tasks" description="Create, assign, and track execution" />
                        <div className="mt-6 grid gap-4 md:grid-cols-2">
                            {tasks.map((task) => (
                                <div key={task.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="font-semibold">{task.title}</p>
                                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{task.assignee}</p>
                                        </div>
                                        <span className="rounded-full border border-slate-200 px-3 py-1 text-sm dark:border-slate-700">{task.priority}</span>
                                    </div>
                                    <div className="mt-4 flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
                                        <span>Due {task.dueDate}</span>
                                        <span>{task.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                ) : null}
        </div>
    );
}
