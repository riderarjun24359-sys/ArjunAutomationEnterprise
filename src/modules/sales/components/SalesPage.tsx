"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { LoadingState } from "@/src/components/ui/LoadingState";
import {
    ActivitiesPanel, CallsPanel, CommissionsPanel, EmailsPanel, ForecastingPanel, LeadsPanel, MeetingsPanel, OpportunitiesPanel, PipelinePanel, QuotesPanel, SalesAuditPanel, SalesOverviewPanel, SalesReportsPanel, StagesPanel, TargetsPanel, WinLossPanel,
} from "@/src/modules/sales/components/SalesPanels";
import { SalesStats } from "@/src/modules/sales/components/SalesStats";
import { SALES_TABS } from "@/src/modules/sales/constants";
import { useSales } from "@/src/modules/sales/hooks/useSales";

const tabs = [
    { id: SALES_TABS.overview, label: "Overview" },
    { id: SALES_TABS.leads, label: "Leads" },
    { id: SALES_TABS.opportunities, label: "Opportunities" },
    { id: SALES_TABS.pipeline, label: "Pipeline" },
    { id: SALES_TABS.stages, label: "Stages" },
    { id: SALES_TABS.quotes, label: "Quotes" },
    { id: SALES_TABS.forecasting, label: "Forecasting" },
    { id: SALES_TABS.activities, label: "Activities" },
    { id: SALES_TABS.meetings, label: "Meetings" },
    { id: SALES_TABS.calls, label: "Calls" },
    { id: SALES_TABS.emails, label: "Emails" },
    { id: SALES_TABS.targets, label: "Targets" },
    { id: SALES_TABS.commissions, label: "Commissions" },
    { id: SALES_TABS.winLoss, label: "Win/Loss" },
    { id: SALES_TABS.reports, label: "Reports" },
    { id: SALES_TABS.audit, label: "Audit" },
] as const;

export function SalesPage() {
    const sales = useSales();
    const [activeTab, setActiveTab] = useState<(typeof SALES_TABS)[keyof typeof SALES_TABS]>(SALES_TABS.overview);

    if (sales.loading) {
        return <div className="mx-auto max-w-7xl"><LoadingState label="Loading sales pipeline and revenue operations data" /></div>;
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-slate-900 dark:text-slate-100">
            <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-emerald-600">Revenue Operations</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Enterprise Sales Pipeline & Revenue Operations</h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                    Manage leads, opportunities, pipelines, stages, quotes, forecasting, activities, meetings, calls, email tracking, targets, commissions, win/loss analysis, reports, and audit history from one Supabase-backed workspace.
                </p>
            </motion.header>
            <SalesStats stats={sales.stats} />
            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === tab.id ? "bg-emerald-600 text-white" : "border border-slate-200 text-slate-600 hover:border-emerald-300 dark:border-slate-800 dark:text-slate-300"}`}>{tab.label}</button>
                ))}
            </div>
            {activeTab === SALES_TABS.overview ? <SalesOverviewPanel data={sales} /> : null}
            {activeTab === SALES_TABS.leads ? <LeadsPanel data={sales} /> : null}
            {activeTab === SALES_TABS.opportunities ? <OpportunitiesPanel data={sales} /> : null}
            {activeTab === SALES_TABS.pipeline ? <PipelinePanel data={sales} /> : null}
            {activeTab === SALES_TABS.stages ? <StagesPanel data={sales} /> : null}
            {activeTab === SALES_TABS.quotes ? <QuotesPanel data={sales} /> : null}
            {activeTab === SALES_TABS.forecasting ? <ForecastingPanel data={sales} /> : null}
            {activeTab === SALES_TABS.activities ? <ActivitiesPanel data={sales} /> : null}
            {activeTab === SALES_TABS.meetings ? <MeetingsPanel data={sales} /> : null}
            {activeTab === SALES_TABS.calls ? <CallsPanel data={sales} /> : null}
            {activeTab === SALES_TABS.emails ? <EmailsPanel data={sales} /> : null}
            {activeTab === SALES_TABS.targets ? <TargetsPanel data={sales} /> : null}
            {activeTab === SALES_TABS.commissions ? <CommissionsPanel data={sales} /> : null}
            {activeTab === SALES_TABS.winLoss ? <WinLossPanel data={sales} /> : null}
            {activeTab === SALES_TABS.reports ? <SalesReportsPanel data={sales} /> : null}
            {activeTab === SALES_TABS.audit ? <SalesAuditPanel data={sales} /> : null}
        </div>
    );
}
