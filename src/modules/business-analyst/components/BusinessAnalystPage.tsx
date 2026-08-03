"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { LoadingState } from "@/src/components/ui/LoadingState";
import {
    AcceptanceCriteriaPanel,
    ApprovalsPanel,
    BaAuditPanel,
    BaOverviewPanel,
    BaSdkPanel,
    BrdsPanel,
    CostEstimatesPanel,
    EngagementsPanel,
    FrsPanel,
    GapAnalysisPanel,
    InterviewsPanel,
    PrioritizationPanel,
    ProcessMapsPanel,
    ProposalsPanel,
    RisksPanel,
    ScopePanel,
    StakeholdersPanel,
    TimelineEstimatesPanel,
    UserStoriesPanel,
    VersionsPanel,
} from "@/src/modules/business-analyst/components/BusinessAnalystPanels";
import { BusinessAnalystStats } from "@/src/modules/business-analyst/components/BusinessAnalystStats";
import { BUSINESS_ANALYST_TABS } from "@/src/modules/business-analyst/constants";
import { useBusinessAnalyst } from "@/src/modules/business-analyst/hooks/useBusinessAnalyst";

const tabs = [
    { id: BUSINESS_ANALYST_TABS.overview, label: "Overview" },
    { id: BUSINESS_ANALYST_TABS.engagements, label: "Engagements" },
    { id: BUSINESS_ANALYST_TABS.interviews, label: "Interviews" },
    { id: BUSINESS_ANALYST_TABS.brds, label: "BRDs" },
    { id: BUSINESS_ANALYST_TABS.frs, label: "FRS" },
    { id: BUSINESS_ANALYST_TABS.userStories, label: "User Stories" },
    { id: BUSINESS_ANALYST_TABS.acceptanceCriteria, label: "Acceptance Criteria" },
    { id: BUSINESS_ANALYST_TABS.processMaps, label: "Process Maps" },
    { id: BUSINESS_ANALYST_TABS.gapAnalysis, label: "Gap Analysis" },
    { id: BUSINESS_ANALYST_TABS.prioritization, label: "Prioritization" },
    { id: BUSINESS_ANALYST_TABS.risks, label: "Risks" },
    { id: BUSINESS_ANALYST_TABS.stakeholders, label: "Stakeholders" },
    { id: BUSINESS_ANALYST_TABS.scope, label: "Scope" },
    { id: BUSINESS_ANALYST_TABS.proposals, label: "Proposals" },
    { id: BUSINESS_ANALYST_TABS.costEstimates, label: "Cost Estimates" },
    { id: BUSINESS_ANALYST_TABS.timelineEstimates, label: "Timeline Estimates" },
    { id: BUSINESS_ANALYST_TABS.versions, label: "Versions" },
    { id: BUSINESS_ANALYST_TABS.approvals, label: "Approvals" },
    { id: BUSINESS_ANALYST_TABS.audit, label: "Audit" },
    { id: BUSINESS_ANALYST_TABS.api, label: "SDK" },
] as const;

export function BusinessAnalystPage() {
    const businessAnalyst = useBusinessAnalyst();
    const [activeTab, setActiveTab] = useState<(typeof BUSINESS_ANALYST_TABS)[keyof typeof BUSINESS_ANALYST_TABS]>(BUSINESS_ANALYST_TABS.overview);

    if (businessAnalyst.loading) {
        return <div className="mx-auto max-w-7xl"><LoadingState label="Loading AI Business Analyst worker" /></div>;
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-slate-900 dark:text-slate-100">
            <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-emerald-600">AI Worker</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">AI Business Analyst</h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                    AI worker for customer requirement capture, stakeholder interviews, BRD and FRS generation, user stories, acceptance criteria, process mapping, gap analysis, feature prioritization, risk assessment, stakeholder mapping, scope definition, solution proposals, cost and timeline estimates, versioning, approvals, audit history, and the shared Business Analyst SDK. Pipeline: Customer Requirement → AI Business Analyst → AI Solution Architect → AI Developer → AI QA → AI DevOps → AI Support.
                </p>
            </motion.header>
            <BusinessAnalystStats stats={businessAnalyst.stats} />
            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === tab.id ? "bg-emerald-600 text-white" : "border border-slate-200 text-slate-600 hover:border-emerald-300 dark:border-slate-800 dark:text-slate-300"}`}>{tab.label}</button>
                ))}
            </div>
            {activeTab === BUSINESS_ANALYST_TABS.overview ? <BaOverviewPanel data={businessAnalyst} /> : null}
            {activeTab === BUSINESS_ANALYST_TABS.engagements ? <EngagementsPanel data={businessAnalyst} /> : null}
            {activeTab === BUSINESS_ANALYST_TABS.interviews ? <InterviewsPanel data={businessAnalyst} /> : null}
            {activeTab === BUSINESS_ANALYST_TABS.brds ? <BrdsPanel data={businessAnalyst} /> : null}
            {activeTab === BUSINESS_ANALYST_TABS.frs ? <FrsPanel data={businessAnalyst} /> : null}
            {activeTab === BUSINESS_ANALYST_TABS.userStories ? <UserStoriesPanel data={businessAnalyst} /> : null}
            {activeTab === BUSINESS_ANALYST_TABS.acceptanceCriteria ? <AcceptanceCriteriaPanel data={businessAnalyst} /> : null}
            {activeTab === BUSINESS_ANALYST_TABS.processMaps ? <ProcessMapsPanel data={businessAnalyst} /> : null}
            {activeTab === BUSINESS_ANALYST_TABS.gapAnalysis ? <GapAnalysisPanel data={businessAnalyst} /> : null}
            {activeTab === BUSINESS_ANALYST_TABS.prioritization ? <PrioritizationPanel data={businessAnalyst} /> : null}
            {activeTab === BUSINESS_ANALYST_TABS.risks ? <RisksPanel data={businessAnalyst} /> : null}
            {activeTab === BUSINESS_ANALYST_TABS.stakeholders ? <StakeholdersPanel data={businessAnalyst} /> : null}
            {activeTab === BUSINESS_ANALYST_TABS.scope ? <ScopePanel data={businessAnalyst} /> : null}
            {activeTab === BUSINESS_ANALYST_TABS.proposals ? <ProposalsPanel data={businessAnalyst} /> : null}
            {activeTab === BUSINESS_ANALYST_TABS.costEstimates ? <CostEstimatesPanel data={businessAnalyst} /> : null}
            {activeTab === BUSINESS_ANALYST_TABS.timelineEstimates ? <TimelineEstimatesPanel data={businessAnalyst} /> : null}
            {activeTab === BUSINESS_ANALYST_TABS.versions ? <VersionsPanel data={businessAnalyst} /> : null}
            {activeTab === BUSINESS_ANALYST_TABS.approvals ? <ApprovalsPanel data={businessAnalyst} /> : null}
            {activeTab === BUSINESS_ANALYST_TABS.audit ? <BaAuditPanel data={businessAnalyst} /> : null}
            {activeTab === BUSINESS_ANALYST_TABS.api ? <BaSdkPanel data={businessAnalyst} /> : null}
        </div>
    );
}
