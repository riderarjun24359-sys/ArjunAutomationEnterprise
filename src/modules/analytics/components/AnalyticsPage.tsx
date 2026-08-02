"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Card } from "@/src/components/ui/Card";
import { LoadingState } from "@/src/components/ui/LoadingState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { AnalyticsChartsPanel } from "@/src/modules/analytics/components/AnalyticsChartsPanel";
import { AnalyticsFilters } from "@/src/modules/analytics/components/AnalyticsFilters";
import { AnalyticsReportsTable } from "@/src/modules/analytics/components/AnalyticsReportsTable";
import { AnalyticsStats } from "@/src/modules/analytics/components/AnalyticsStats";
import { AutomationInsightsPanel } from "@/src/modules/analytics/components/AutomationInsightsPanel";
import { ClientAnalyticsPanel } from "@/src/modules/analytics/components/ClientAnalyticsPanel";
import { DashboardTable } from "@/src/modules/analytics/components/DashboardTable";
import { DeliveryAnalyticsPanel } from "@/src/modules/analytics/components/DeliveryAnalyticsPanel";
import { ReportForm } from "@/src/modules/analytics/components/ReportForm";
import { RevenueAnalyticsPanel } from "@/src/modules/analytics/components/RevenueAnalyticsPanel";
import { ANALYTICS_TABS } from "@/src/modules/analytics/constants";
import { useAnalytics } from "@/src/modules/analytics/hooks/useAnalytics";
import type { ReportFormValues } from "@/src/modules/analytics/schemas";

const tabs = [
    { id: ANALYTICS_TABS.overview, label: "Overview" },
    { id: ANALYTICS_TABS.revenue, label: "Revenue" },
    { id: ANALYTICS_TABS.delivery, label: "Delivery" },
    { id: ANALYTICS_TABS.clients, label: "Clients" },
    { id: ANALYTICS_TABS.automation, label: "Automation" },
    { id: ANALYTICS_TABS.reports, label: "Reports" },
    { id: ANALYTICS_TABS.charts, label: "Charts" },
] as const;

export function AnalyticsPage() {
    const {
        dashboards,
        metrics,
        reports,
        stats,
        summary,
        revenue,
        delivery,
        clients,
        automation,
        loading,
        searchQuery,
        categoryFilter,
        setSearchQuery,
        setCategoryFilter,
        createReport,
        publishReport,
    } = useAnalytics();

    const [activeTab, setActiveTab] = useState<(typeof ANALYTICS_TABS)[keyof typeof ANALYTICS_TABS]>(ANALYTICS_TABS.overview);
    const [showReportForm, setShowReportForm] = useState(false);

    const handleCreateReport = async (values: ReportFormValues) => {
        await createReport({
            name: values.name,
            reportType: values.reportType,
            status: values.status ?? "draft",
            summary: summary
                ? {
                      revenuePaid: summary.revenuePaid,
                      activeClients: summary.activeClients,
                      openTasks: summary.openTasks,
                      workflowSuccessRate: summary.workflowSuccessRate,
                  }
                : {},
        });
        setShowReportForm(false);
        setActiveTab(ANALYTICS_TABS.reports);
    };

    if (loading) {
        return (
            <div className="mx-auto max-w-7xl">
                <LoadingState label="Loading analytics and performance insights" />
            </div>
        );
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-slate-900 dark:text-slate-100">
            <motion.header
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80"
            >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-sm font-medium uppercase tracking-[0.24em] text-emerald-600">Performance Intelligence</p>
                        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Enterprise analytics and performance insights</h1>
                        <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                            Cross-module KPIs, revenue trends, delivery throughput, client portfolio health, automation performance, saved dashboards, and exportable reports from one Supabase-backed workspace.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowReportForm((current) => !current)}
                        className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-500"
                    >
                        <Plus className="h-4 w-4" />
                        New Report
                    </button>
                </div>
            </motion.header>

            <AnalyticsStats stats={stats} />
            <AnalyticsFilters
                searchQuery={searchQuery}
                categoryFilter={categoryFilter}
                onSearchChange={setSearchQuery}
                onCategoryChange={setCategoryFilter}
            />

            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                            activeTab === tab.id
                                ? "bg-emerald-600 text-white"
                                : "border border-slate-200 text-slate-600 hover:border-emerald-300 dark:border-slate-800 dark:text-slate-300"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {showReportForm ? <ReportForm onSubmit={handleCreateReport} onCancel={() => setShowReportForm(false)} /> : null}

            {activeTab === ANALYTICS_TABS.overview ? (
                <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                    <DashboardTable dashboards={dashboards} />
                    <Card hover>
                        <SectionHeader title="Tracked metrics" description="Stored metric snapshots for this organization" />
                        <div className="mt-6 space-y-3">
                            {metrics.length === 0 ? (
                                <p className="text-sm text-slate-500">No metrics available.</p>
                            ) : (
                                metrics.slice(0, 8).map((metric) => (
                                    <div key={metric.id} className="flex justify-between rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                                        <div>
                                            <p className="font-medium">{metric.label}</p>
                                            <p className="text-xs capitalize text-slate-500">{metric.category}</p>
                                        </div>
                                        <span className="font-medium">
                                            {metric.unit === "USD" ? `$${metric.value.toLocaleString()}` : metric.unit === "percent" ? `${metric.value}%` : metric.value}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </div>
            ) : null}

            {activeTab === ANALYTICS_TABS.revenue ? <RevenueAnalyticsPanel revenue={revenue} /> : null}
            {activeTab === ANALYTICS_TABS.delivery ? <DeliveryAnalyticsPanel delivery={delivery} /> : null}
            {activeTab === ANALYTICS_TABS.clients ? <ClientAnalyticsPanel clients={clients} /> : null}
            {activeTab === ANALYTICS_TABS.automation ? <AutomationInsightsPanel automation={automation} /> : null}
            {activeTab === ANALYTICS_TABS.reports ? <AnalyticsReportsTable reports={reports} onPublish={publishReport} /> : null}
            {activeTab === ANALYTICS_TABS.charts ? <AnalyticsChartsPanel summary={summary} /> : null}
        </div>
    );
}
