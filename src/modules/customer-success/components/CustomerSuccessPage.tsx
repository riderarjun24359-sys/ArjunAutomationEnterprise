"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { LoadingState } from "@/src/components/ui/LoadingState";
import {
    AdoptionTrackingPanel,
    ChurnPredictionPanel,
    CommunicationPlansPanel,
    CsAuditPanel,
    CsEngagementsPanel,
    CustomerSuccessOverviewPanel,
    CustomerSuccessSdkPanel,
    ExecutiveSummariesPanel,
    ExpansionOpportunitiesPanel,
    FeedbackAnalysisPanel,
    HealthScoresPanel,
    KpiDashboardsPanel,
    LifecycleManagementPanel,
    OnboardingWorkflowsPanel,
    QbrReportsPanel,
    RenewalPlansPanel,
    RiskAnalysisPanel,
    SlaMonitoringPanel,
    SuccessPlaybooksPanel,
    SupportTrendsPanel,
    TrainingRecommendationsPanel,
} from "@/src/modules/customer-success/components/CustomerSuccessPanels";
import { CustomerSuccessStats } from "@/src/modules/customer-success/components/CustomerSuccessStats";
import { CUSTOMER_SUCCESS_TABS } from "@/src/modules/customer-success/constants";
import { useCustomerSuccess } from "@/src/modules/customer-success/hooks/useCustomerSuccess";

const tabs = [
    { id: CUSTOMER_SUCCESS_TABS.overview, label: "Overview" },
    { id: CUSTOMER_SUCCESS_TABS.engagements, label: "Engagements" },
    { id: CUSTOMER_SUCCESS_TABS.onboarding, label: "Onboarding" },
    { id: CUSTOMER_SUCCESS_TABS.adoption, label: "Adoption" },
    { id: CUSTOMER_SUCCESS_TABS.healthScores, label: "Health Scores" },
    { id: CUSTOMER_SUCCESS_TABS.renewalPlans, label: "Renewal Plans" },
    { id: CUSTOMER_SUCCESS_TABS.expansionOpportunities, label: "Expansion" },
    { id: CUSTOMER_SUCCESS_TABS.riskAnalysis, label: "Risk Analysis" },
    { id: CUSTOMER_SUCCESS_TABS.supportTrends, label: "Support Trends" },
    { id: CUSTOMER_SUCCESS_TABS.successPlaybooks, label: "Playbooks" },
    { id: CUSTOMER_SUCCESS_TABS.qbrReports, label: "QBR Reports" },
    { id: CUSTOMER_SUCCESS_TABS.communicationPlans, label: "Communication" },
    { id: CUSTOMER_SUCCESS_TABS.trainingRecommendations, label: "Training" },
    { id: CUSTOMER_SUCCESS_TABS.feedbackAnalysis, label: "Feedback" },
    { id: CUSTOMER_SUCCESS_TABS.slaMonitoring, label: "SLA Monitoring" },
    { id: CUSTOMER_SUCCESS_TABS.kpiDashboards, label: "KPI Dashboards" },
    { id: CUSTOMER_SUCCESS_TABS.churnPrediction, label: "Churn Prediction" },
    { id: CUSTOMER_SUCCESS_TABS.lifecycleManagement, label: "Lifecycle" },
    { id: CUSTOMER_SUCCESS_TABS.executiveSummaries, label: "Executive Summaries" },
    { id: CUSTOMER_SUCCESS_TABS.audit, label: "Audit" },
    { id: CUSTOMER_SUCCESS_TABS.api, label: "SDK" },
] as const;

export function CustomerSuccessPage() {
    const customerSuccess = useCustomerSuccess();
    const [activeTab, setActiveTab] = useState<(typeof CUSTOMER_SUCCESS_TABS)[keyof typeof CUSTOMER_SUCCESS_TABS]>(CUSTOMER_SUCCESS_TABS.overview);

    if (customerSuccess.loading) {
        return <div className="mx-auto max-w-7xl"><LoadingState label="Loading AI Customer Success Manager" /></div>;
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-slate-900 dark:text-slate-100">
            <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-teal-600">AI Worker</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">AI Customer Success Manager</h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                    AI worker for customer onboarding, adoption tracking, health scores, renewal and expansion planning, risk and churn analysis, support trend insights, success playbooks, QBR reports, communication plans, training recommendations, feedback analysis, SLA monitoring, KPI dashboards, lifecycle management, executive summaries, audit history, and the shared Customer Success SDK. Pipeline: Customer Requirement → AI Business Analyst → AI Solution Architect → AI Development Factory → AI QA Engineer → AI DevOps & Deployment → Production Deployment → AI Customer Success Manager → Continuous Customer Success.
                </p>
            </motion.header>
            <CustomerSuccessStats stats={customerSuccess.stats} />
            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === tab.id ? "bg-teal-600 text-white" : "border border-slate-200 text-slate-600 hover:border-teal-300 dark:border-slate-800 dark:text-slate-300"}`}>{tab.label}</button>
                ))}
            </div>
            {activeTab === CUSTOMER_SUCCESS_TABS.overview ? <CustomerSuccessOverviewPanel data={customerSuccess} /> : null}
            {activeTab === CUSTOMER_SUCCESS_TABS.engagements ? <CsEngagementsPanel data={customerSuccess} /> : null}
            {activeTab === CUSTOMER_SUCCESS_TABS.onboarding ? <OnboardingWorkflowsPanel data={customerSuccess} /> : null}
            {activeTab === CUSTOMER_SUCCESS_TABS.adoption ? <AdoptionTrackingPanel data={customerSuccess} /> : null}
            {activeTab === CUSTOMER_SUCCESS_TABS.healthScores ? <HealthScoresPanel data={customerSuccess} /> : null}
            {activeTab === CUSTOMER_SUCCESS_TABS.renewalPlans ? <RenewalPlansPanel data={customerSuccess} /> : null}
            {activeTab === CUSTOMER_SUCCESS_TABS.expansionOpportunities ? <ExpansionOpportunitiesPanel data={customerSuccess} /> : null}
            {activeTab === CUSTOMER_SUCCESS_TABS.riskAnalysis ? <RiskAnalysisPanel data={customerSuccess} /> : null}
            {activeTab === CUSTOMER_SUCCESS_TABS.supportTrends ? <SupportTrendsPanel data={customerSuccess} /> : null}
            {activeTab === CUSTOMER_SUCCESS_TABS.successPlaybooks ? <SuccessPlaybooksPanel data={customerSuccess} /> : null}
            {activeTab === CUSTOMER_SUCCESS_TABS.qbrReports ? <QbrReportsPanel data={customerSuccess} /> : null}
            {activeTab === CUSTOMER_SUCCESS_TABS.communicationPlans ? <CommunicationPlansPanel data={customerSuccess} /> : null}
            {activeTab === CUSTOMER_SUCCESS_TABS.trainingRecommendations ? <TrainingRecommendationsPanel data={customerSuccess} /> : null}
            {activeTab === CUSTOMER_SUCCESS_TABS.feedbackAnalysis ? <FeedbackAnalysisPanel data={customerSuccess} /> : null}
            {activeTab === CUSTOMER_SUCCESS_TABS.slaMonitoring ? <SlaMonitoringPanel data={customerSuccess} /> : null}
            {activeTab === CUSTOMER_SUCCESS_TABS.kpiDashboards ? <KpiDashboardsPanel data={customerSuccess} /> : null}
            {activeTab === CUSTOMER_SUCCESS_TABS.churnPrediction ? <ChurnPredictionPanel data={customerSuccess} /> : null}
            {activeTab === CUSTOMER_SUCCESS_TABS.lifecycleManagement ? <LifecycleManagementPanel data={customerSuccess} /> : null}
            {activeTab === CUSTOMER_SUCCESS_TABS.executiveSummaries ? <ExecutiveSummariesPanel data={customerSuccess} /> : null}
            {activeTab === CUSTOMER_SUCCESS_TABS.audit ? <CsAuditPanel data={customerSuccess} /> : null}
            {activeTab === CUSTOMER_SUCCESS_TABS.api ? <CustomerSuccessSdkPanel data={customerSuccess} /> : null}
        </div>
    );
}
