"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { LoadingState } from "@/src/components/ui/LoadingState";
import {
    AcAuditPanel,
    ActivityFeedPanel,
    ApprovalWorkflowsPanel,
    AutomationsPanel,
    AutonomousCompanyOverviewPanel,
    AutonomousCompanySdkPanel,
    BusinessKpisPanel,
    CommandPalettePanel,
    CompanyContextsPanel,
    ComplianceDashboardsPanel,
    EmergencyWorkflowsPanel,
    EventBusPanel,
    ExecutiveInsightsPanel,
    NotificationsPanel,
    OperationalHealthPanel,
    PredictiveRecommendationsPanel,
    SecurityGovernancePanel,
    SystemSearchPanel,
    TimelinePanel,
    WorkerCollaborationPanel,
    WorkflowOrchestrationPanel,
} from "@/src/modules/autonomous-company/components/AutonomousCompanyPanels";
import { AutonomousCompanyStats } from "@/src/modules/autonomous-company/components/AutonomousCompanyStats";
import { AUTONOMOUS_COMPANY_TABS } from "@/src/modules/autonomous-company/constants";
import { useAutonomousCompany } from "@/src/modules/autonomous-company/hooks/useAutonomousCompany";

const tabs = [
    { id: AUTONOMOUS_COMPANY_TABS.overview, label: "Overview" },
    { id: AUTONOMOUS_COMPANY_TABS.companyContexts, label: "Company Contexts" },
    { id: AUTONOMOUS_COMPANY_TABS.workflowOrchestration, label: "Workflow Orchestration" },
    { id: AUTONOMOUS_COMPANY_TABS.eventBus, label: "Event Bus" },
    { id: AUTONOMOUS_COMPANY_TABS.workerCollaboration, label: "Worker Collaboration" },
    { id: AUTONOMOUS_COMPANY_TABS.approvals, label: "Approvals" },
    { id: AUTONOMOUS_COMPANY_TABS.notifications, label: "Notifications" },
    { id: AUTONOMOUS_COMPANY_TABS.timeline, label: "Timeline" },
    { id: AUTONOMOUS_COMPANY_TABS.activityFeed, label: "Activity Feed" },
    { id: AUTONOMOUS_COMPANY_TABS.automations, label: "Automations" },
    { id: AUTONOMOUS_COMPANY_TABS.executiveInsights, label: "Executive Insights" },
    { id: AUTONOMOUS_COMPANY_TABS.predictions, label: "Predictions" },
    { id: AUTONOMOUS_COMPANY_TABS.search, label: "Search" },
    { id: AUTONOMOUS_COMPANY_TABS.commandPalette, label: "Command Palette" },
    { id: AUTONOMOUS_COMPANY_TABS.emergency, label: "Emergency" },
    { id: AUTONOMOUS_COMPANY_TABS.kpis, label: "KPIs" },
    { id: AUTONOMOUS_COMPANY_TABS.security, label: "Security" },
    { id: AUTONOMOUS_COMPANY_TABS.compliance, label: "Compliance" },
    { id: AUTONOMOUS_COMPANY_TABS.health, label: "Health" },
    { id: AUTONOMOUS_COMPANY_TABS.audit, label: "Audit" },
    { id: AUTONOMOUS_COMPANY_TABS.api, label: "SDK" },
] as const;

export function AutonomousCompanyPage() {
    const autonomousCompany = useAutonomousCompany();
    const [activeTab, setActiveTab] = useState<(typeof AUTONOMOUS_COMPANY_TABS)[keyof typeof AUTONOMOUS_COMPANY_TABS]>(AUTONOMOUS_COMPANY_TABS.overview);

    if (autonomousCompany.loading) {
        return <div className="mx-auto max-w-7xl"><LoadingState label="Loading Autonomous Company" /></div>;
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-slate-900 dark:text-slate-100">
            <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-violet-600">Enterprise Module</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Autonomous Company v1</h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                    Cross-module orchestration workspace for autonomous company operations: company contexts, workflow orchestration, event bus, worker collaboration, approvals, notifications, timeline, activity feed, automations, executive insights, predictions, search, command palette, emergency workflows, KPIs, security governance, compliance dashboards, operational health, audit history, and the shared Autonomous Company SDK. Pipeline: Founder OS + All AI Workers → Autonomous Company v1 → Continuous Operations.
                </p>
            </motion.header>
            <AutonomousCompanyStats stats={autonomousCompany.stats} />
            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === tab.id ? "bg-violet-600 text-white" : "border border-slate-200 text-slate-600 hover:border-violet-300 dark:border-slate-800 dark:text-slate-300"}`}>{tab.label}</button>
                ))}
            </div>
            {activeTab === AUTONOMOUS_COMPANY_TABS.overview ? <AutonomousCompanyOverviewPanel data={autonomousCompany} /> : null}
            {activeTab === AUTONOMOUS_COMPANY_TABS.companyContexts ? <CompanyContextsPanel data={autonomousCompany} /> : null}
            {activeTab === AUTONOMOUS_COMPANY_TABS.workflowOrchestration ? <WorkflowOrchestrationPanel data={autonomousCompany} /> : null}
            {activeTab === AUTONOMOUS_COMPANY_TABS.eventBus ? <EventBusPanel data={autonomousCompany} /> : null}
            {activeTab === AUTONOMOUS_COMPANY_TABS.workerCollaboration ? <WorkerCollaborationPanel data={autonomousCompany} /> : null}
            {activeTab === AUTONOMOUS_COMPANY_TABS.approvals ? <ApprovalWorkflowsPanel data={autonomousCompany} /> : null}
            {activeTab === AUTONOMOUS_COMPANY_TABS.notifications ? <NotificationsPanel data={autonomousCompany} /> : null}
            {activeTab === AUTONOMOUS_COMPANY_TABS.timeline ? <TimelinePanel data={autonomousCompany} /> : null}
            {activeTab === AUTONOMOUS_COMPANY_TABS.activityFeed ? <ActivityFeedPanel data={autonomousCompany} /> : null}
            {activeTab === AUTONOMOUS_COMPANY_TABS.automations ? <AutomationsPanel data={autonomousCompany} /> : null}
            {activeTab === AUTONOMOUS_COMPANY_TABS.executiveInsights ? <ExecutiveInsightsPanel data={autonomousCompany} /> : null}
            {activeTab === AUTONOMOUS_COMPANY_TABS.predictions ? <PredictiveRecommendationsPanel data={autonomousCompany} /> : null}
            {activeTab === AUTONOMOUS_COMPANY_TABS.search ? <SystemSearchPanel data={autonomousCompany} /> : null}
            {activeTab === AUTONOMOUS_COMPANY_TABS.commandPalette ? <CommandPalettePanel data={autonomousCompany} /> : null}
            {activeTab === AUTONOMOUS_COMPANY_TABS.emergency ? <EmergencyWorkflowsPanel data={autonomousCompany} /> : null}
            {activeTab === AUTONOMOUS_COMPANY_TABS.kpis ? <BusinessKpisPanel data={autonomousCompany} /> : null}
            {activeTab === AUTONOMOUS_COMPANY_TABS.security ? <SecurityGovernancePanel data={autonomousCompany} /> : null}
            {activeTab === AUTONOMOUS_COMPANY_TABS.compliance ? <ComplianceDashboardsPanel data={autonomousCompany} /> : null}
            {activeTab === AUTONOMOUS_COMPANY_TABS.health ? <OperationalHealthPanel data={autonomousCompany} /> : null}
            {activeTab === AUTONOMOUS_COMPANY_TABS.audit ? <AcAuditPanel data={autonomousCompany} /> : null}
            {activeTab === AUTONOMOUS_COMPANY_TABS.api ? <AutonomousCompanySdkPanel data={autonomousCompany} /> : null}
        </div>
    );
}
