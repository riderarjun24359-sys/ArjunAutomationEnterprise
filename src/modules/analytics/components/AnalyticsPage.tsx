"use client";

import { useState } from "react";
import { PageTransition } from "@/src/design-os/motion/components/PageTransition";
import { Badge } from "@/src/design-os/components/Badge";
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
import { LoadingState } from "@/src/components/ui/LoadingState";

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
        return <LoadingState label="Loading intelligence systems" />;
    }

    return (
        <PageTransition className="mx-auto max-w-[85rem] space-y-10">
            <header className="flex flex-col gap-4 border-b border-[var(--dos-border-subtle)] pb-8">
                <Badge variant="info" className="w-fit">Intelligence OS Engine</Badge>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="dos-text-display">Performance Intelligence</h1>
                        <p className="mt-4 max-w-3xl dos-text-h3 text-[var(--dos-text-secondary)]">
                            Enterprise analytics, real-time insights, and predictive performance intelligence.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowReportForm((current) => !current)}
                        className="rounded-full bg-[var(--dos-text-primary)] px-6 py-3 text-sm font-semibold text-[var(--dos-surface)] transition hover:bg-[var(--dos-brand-primary)]"
                    >
                        {showReportForm ? "Close Form" : "New Report"}
                    </button>
                </div>
            </header>

            <AnalyticsStats stats={stats} />
            
            <AnalyticsFilters
                searchQuery={searchQuery}
                categoryFilter={categoryFilter}
                onSearchChange={setSearchQuery}
                onCategoryChange={setCategoryFilter}
            />

            <nav className="flex flex-wrap gap-2 border-b border-[var(--dos-border-subtle)] pb-4">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`rounded-full px-5 py-2 text-sm font-semibold transition ${activeTab === tab.id ? "bg-[var(--dos-text-primary)] text-[var(--dos-surface)]" : "text-[var(--dos-text-secondary)] hover:bg-[var(--dos-surface-tertiary)] hover:text-[var(--dos-text-primary)]"}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>

            <section className="min-h-[60vh] rounded-[var(--dos-radius-2xl)] bg-[var(--dos-surface-secondary)]/50 p-8">
                {showReportForm ? <ReportForm onSubmit={handleCreateReport} onCancel={() => setShowReportForm(false)} /> : null}

                {activeTab === ANALYTICS_TABS.overview ? (
                    <section className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
                        <DashboardTable dashboards={dashboards} />
                        <section className="os-panel p-6">
                            <h3 className="mb-6 dos-text-h3">Tracked Metrics</h3>
                            <div className="space-y-3">
                                {metrics.length === 0 ? (
                                    <p className="dos-text-secondary">No metrics available.</p>
                                ) : (
                                    metrics.slice(0, 8).map((metric) => (
                                        <div key={metric.id} className="flex justify-between rounded-[var(--dos-radius-lg)] border border-[var(--dos-border)] bg-[var(--dos-surface-elevated)] px-4 py-3">
                                            <div>
                                                <p className="font-semibold text-[var(--dos-text-primary)]">{metric.label}</p>
                                                <p className="dos-text-caption text-[var(--dos-text-tertiary)]">{metric.category}</p>
                                            </div>
                                            <span className="font-semibold text-[var(--dos-text-primary)]">
                                                {metric.unit === "USD" ? `$${metric.value.toLocaleString()}` : metric.unit === "percent" ? `${metric.value}%` : metric.value}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>
                    </section>
                ) : null}

                {activeTab === ANALYTICS_TABS.revenue ? <RevenueAnalyticsPanel revenue={revenue} /> : null}
                {activeTab === ANALYTICS_TABS.delivery ? <DeliveryAnalyticsPanel delivery={delivery} /> : null}
                {activeTab === ANALYTICS_TABS.clients ? <ClientAnalyticsPanel clients={clients} /> : null}
                {activeTab === ANALYTICS_TABS.automation ? <AutomationInsightsPanel automation={automation} /> : null}
                {activeTab === ANALYTICS_TABS.reports ? <AnalyticsReportsTable reports={reports} onPublish={publishReport} /> : null}
                {activeTab === ANALYTICS_TABS.charts ? <AnalyticsChartsPanel summary={summary} /> : null}
            </section>
        </PageTransition>
    );
}
