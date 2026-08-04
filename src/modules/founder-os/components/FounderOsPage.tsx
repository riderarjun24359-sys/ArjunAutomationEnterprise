"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { LoadingState } from "@/src/components/ui/LoadingState";
import {
    BoardReportsPanel,
    CapitalPlansPanel,
    CompanyMilestonesPanel,
    DecisionLogPanel,
    ExecutiveDashboardsPanel,
    FoAuditPanel,
    FoWorkspacesPanel,
    FounderAgendaPanel,
    FounderInsightsPanel,
    FounderOsOverviewPanel,
    FounderOsPhase3Panel,
    FounderOsSdkPanel,
    GrowthMetricsPanel,
    InvestorRelationsPanel,
    PrioritiesPanel,
    ProductRoadmapsPanel,
    ResourceAllocationsPanel,
    RevenueRunwayPanel,
    RiskRegisterPanel,
    StakeholdersPanel,
    StrategicOkrsPanel,
    TeamCapacityPanel,
} from "@/src/modules/founder-os/components/FounderOsPanels";
import { FounderOsStats } from "@/src/modules/founder-os/components/FounderOsStats";
import { FOUNDER_OS_TABS } from "@/src/modules/founder-os/constants";
import { useFounderOs } from "@/src/modules/founder-os/hooks/useFounderOs";

const tabs = [
    { id: FOUNDER_OS_TABS.overview, label: "Overview" },
    { id: FOUNDER_OS_TABS.workspaces, label: "Workspaces" },
    { id: FOUNDER_OS_TABS.strategicOkrs, label: "Strategic OKRs" },
    { id: FOUNDER_OS_TABS.executiveDashboards, label: "Dashboards" },
    { id: FOUNDER_OS_TABS.revenueRunway, label: "Revenue Runway" },
    { id: FOUNDER_OS_TABS.teamCapacity, label: "Team Capacity" },
    { id: FOUNDER_OS_TABS.productRoadmaps, label: "Product Roadmaps" },
    { id: FOUNDER_OS_TABS.investorRelations, label: "Investor Relations" },
    { id: FOUNDER_OS_TABS.boardReports, label: "Board Reports" },
    { id: FOUNDER_OS_TABS.decisionLog, label: "Decision Log" },
    { id: FOUNDER_OS_TABS.priorities, label: "Priorities" },
    { id: FOUNDER_OS_TABS.resourceAllocations, label: "Resource Allocations" },
    { id: FOUNDER_OS_TABS.riskRegister, label: "Risk Register" },
    { id: FOUNDER_OS_TABS.growthMetrics, label: "Growth Metrics" },
    { id: FOUNDER_OS_TABS.founderAgenda, label: "Founder Agenda" },
    { id: FOUNDER_OS_TABS.stakeholders, label: "Stakeholders" },
    { id: FOUNDER_OS_TABS.capitalPlans, label: "Capital Plans" },
    { id: FOUNDER_OS_TABS.companyMilestones, label: "Company Milestones" },
    { id: FOUNDER_OS_TABS.founderInsights, label: "Founder Insights" },
    { id: FOUNDER_OS_TABS.phase3, label: "Phase 3 Dashboard" },
    { id: FOUNDER_OS_TABS.audit, label: "Audit" },
    { id: FOUNDER_OS_TABS.api, label: "SDK" },
] as const;

export function FounderOsPage() {
    const founderOs = useFounderOs();
    const [activeTab, setActiveTab] = useState<(typeof FOUNDER_OS_TABS)[keyof typeof FOUNDER_OS_TABS]>(FOUNDER_OS_TABS.overview);

    if (founderOs.loading) {
        return <div className="mx-auto max-w-7xl"><LoadingState label="Loading Founder Operating System" /></div>;
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-slate-900 dark:text-slate-100">
            <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-amber-600">Enterprise Module</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Founder Operating System</h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                    Strategic execution workspace for founders: OKRs, executive dashboards, revenue runway, team capacity, product roadmaps, investor relations, board reports, decision logs, priorities, resource allocations, risk register, growth metrics, founder agenda, stakeholders, capital plans, company milestones, founder insights, audit history, and the shared Founder OS SDK. Pipeline: All AI Workers + Enterprise Modules → Founder Operating System → Strategic Execution.
                </p>
            </motion.header>
            <FounderOsStats stats={founderOs.stats} phase3Stats={founderOs.phase3Stats} />
            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === tab.id ? "bg-amber-600 text-white" : "border border-slate-200 text-slate-600 hover:border-amber-300 dark:border-slate-800 dark:text-slate-300"}`}>{tab.label}</button>
                ))}
            </div>
            {activeTab === FOUNDER_OS_TABS.overview ? <FounderOsOverviewPanel data={founderOs} /> : null}
            {activeTab === FOUNDER_OS_TABS.workspaces ? <FoWorkspacesPanel data={founderOs} /> : null}
            {activeTab === FOUNDER_OS_TABS.strategicOkrs ? <StrategicOkrsPanel data={founderOs} /> : null}
            {activeTab === FOUNDER_OS_TABS.executiveDashboards ? <ExecutiveDashboardsPanel data={founderOs} /> : null}
            {activeTab === FOUNDER_OS_TABS.revenueRunway ? <RevenueRunwayPanel data={founderOs} /> : null}
            {activeTab === FOUNDER_OS_TABS.teamCapacity ? <TeamCapacityPanel data={founderOs} /> : null}
            {activeTab === FOUNDER_OS_TABS.productRoadmaps ? <ProductRoadmapsPanel data={founderOs} /> : null}
            {activeTab === FOUNDER_OS_TABS.investorRelations ? <InvestorRelationsPanel data={founderOs} /> : null}
            {activeTab === FOUNDER_OS_TABS.boardReports ? <BoardReportsPanel data={founderOs} /> : null}
            {activeTab === FOUNDER_OS_TABS.decisionLog ? <DecisionLogPanel data={founderOs} /> : null}
            {activeTab === FOUNDER_OS_TABS.priorities ? <PrioritiesPanel data={founderOs} /> : null}
            {activeTab === FOUNDER_OS_TABS.resourceAllocations ? <ResourceAllocationsPanel data={founderOs} /> : null}
            {activeTab === FOUNDER_OS_TABS.riskRegister ? <RiskRegisterPanel data={founderOs} /> : null}
            {activeTab === FOUNDER_OS_TABS.growthMetrics ? <GrowthMetricsPanel data={founderOs} /> : null}
            {activeTab === FOUNDER_OS_TABS.founderAgenda ? <FounderAgendaPanel data={founderOs} /> : null}
            {activeTab === FOUNDER_OS_TABS.stakeholders ? <StakeholdersPanel data={founderOs} /> : null}
            {activeTab === FOUNDER_OS_TABS.capitalPlans ? <CapitalPlansPanel data={founderOs} /> : null}
            {activeTab === FOUNDER_OS_TABS.companyMilestones ? <CompanyMilestonesPanel data={founderOs} /> : null}
            {activeTab === FOUNDER_OS_TABS.founderInsights ? <FounderInsightsPanel data={founderOs} /> : null}
            {activeTab === FOUNDER_OS_TABS.phase3 ? <FounderOsPhase3Panel data={founderOs} /> : null}
            {activeTab === FOUNDER_OS_TABS.audit ? <FoAuditPanel data={founderOs} /> : null}
            {activeTab === FOUNDER_OS_TABS.api ? <FounderOsSdkPanel data={founderOs} /> : null}
        </div>
    );
}
