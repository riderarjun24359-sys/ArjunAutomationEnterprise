"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { LoadingState } from "@/src/components/ui/LoadingState";
import {
    ExecutiveIntelligenceOverviewPanel,
    IntelligenceHubsPanel,
    DailyExecutiveBriefsPanel,
    WeeklyBusinessReviewsPanel,
    MonthlyExecutiveSummarysPanel,
    TrialConversionScoresPanel,
    RenewalProbabilitysPanel,
    ChurnRisksPanel,
    ExpansionOpportunitysPanel,
    MrrTrendsPanel,
    ArrTrendsPanel,
    RevenueGrowthMetricsPanel,
    RevenueRisksPanel,
    PlatformHealthIntelsPanel,
    QueueHealthIntelsPanel,
    IntegrationHealthIntelsPanel,
    PerformanceTrendsPanel,
    UnusualLoginActivitysPanel,
    PermissionRisksPanel,
    TenantSecurityTrendsPanel,
    ComplianceWarningsPanel,
    TodayPrioritysPanel,
    RecommendedActionsPanel,
    BusinessRisksPanel,
    GrowthOpportunitysPanel,
    KnowledgeReasoningSessionsPanel,
    EvidenceTracesPanel,
    OrchestrationLinksPanel,
    RecommendationOutputsPanel,
    ExecutiveMetricsPanel,
    ExecutiveHealthsPanel,
    ExecutiveFailuresPanel,
    ExecutiveIntelligenceAuditLogsPanel,
    ExecutiveIntelligenceSdkPanel,
} from "@/src/modules/executive-intelligence/components/ExecutiveIntelligencePanels";
import { ExecutiveIntelligenceStats } from "@/src/modules/executive-intelligence/components/ExecutiveIntelligenceStats";
import { AIX_TABS } from "@/src/modules/executive-intelligence/constants";
import { useExecutiveIntelligence } from "@/src/modules/executive-intelligence/hooks/useExecutiveIntelligence";

const tabs = [
    { id: AIX_TABS.overview, label: "Overview" },
    { id: AIX_TABS.intelligenceHubs, label: "Intelligence Hubs" },
    { id: AIX_TABS.dailyExecutiveBriefs, label: "Daily Executive Briefs" },
    { id: AIX_TABS.weeklyBusinessReviews, label: "Weekly Business Reviews" },
    { id: AIX_TABS.monthlyExecutiveSummaries, label: "Monthly Executive Summaries" },
    { id: AIX_TABS.trialConversionScores, label: "Trial Conversion Scores" },
    { id: AIX_TABS.renewalProbabilities, label: "Renewal Probabilities" },
    { id: AIX_TABS.churnRisks, label: "Churn Risks" },
    { id: AIX_TABS.expansionOpportunities, label: "Expansion Opportunities" },
    { id: AIX_TABS.mrrTrends, label: "Mrr Trends" },
    { id: AIX_TABS.arrTrends, label: "Arr Trends" },
    { id: AIX_TABS.revenueGrowthMetrics, label: "Revenue Growth Metrics" },
    { id: AIX_TABS.revenueRisks, label: "Revenue Risks" },
    { id: AIX_TABS.platformHealthIntel, label: "Platform Health Intel" },
    { id: AIX_TABS.queueHealthIntel, label: "Queue Health Intel" },
    { id: AIX_TABS.integrationHealthIntel, label: "Integration Health Intel" },
    { id: AIX_TABS.performanceTrends, label: "Performance Trends" },
    { id: AIX_TABS.unusualLoginActivity, label: "Unusual Login Activity" },
    { id: AIX_TABS.permissionRisks, label: "Permission Risks" },
    { id: AIX_TABS.tenantSecurityTrends, label: "Tenant Security Trends" },
    { id: AIX_TABS.complianceWarnings, label: "Compliance Warnings" },
    { id: AIX_TABS.todayPriorities, label: "Today Priorities" },
    { id: AIX_TABS.recommendedActions, label: "Recommended Actions" },
    { id: AIX_TABS.businessRisks, label: "Business Risks" },
    { id: AIX_TABS.growthOpportunities, label: "Growth Opportunities" },
    { id: AIX_TABS.knowledgeReasoningSessions, label: "Knowledge Reasoning Sessions" },
    { id: AIX_TABS.evidenceTraces, label: "Evidence Traces" },
    { id: AIX_TABS.orchestrationLinks, label: "Orchestration Links" },
    { id: AIX_TABS.recommendationOutputs, label: "Recommendation Outputs" },
    { id: AIX_TABS.executiveMetrics, label: "Executive Metrics" },
    { id: AIX_TABS.executiveHealth, label: "Executive Health" },
    { id: AIX_TABS.executiveFailures, label: "Executive Failures" },
    { id: AIX_TABS.auditLogs, label: "Audit Logs" },
    { id: AIX_TABS.api, label: "SDK" },
] as const;

export function ExecutiveIntelligencePage() {
    const executiveIntelligence = useExecutiveIntelligence();
    const [activeTab, setActiveTab] = useState<(typeof AIX_TABS)[keyof typeof AIX_TABS]>(AIX_TABS.overview);

    if (executiveIntelligence.loading) {
        return <div className="mx-auto max-w-7xl"><LoadingState label="Loading Executive Intelligence" /></div>;
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-slate-900 dark:text-slate-100">
            <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-violet-600">V2 Program A Sprint 8</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Enterprise Executive Intelligence</h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                    Integration layer for the entire SaaS platform: recommendations, payment & accounting connectors, public API platform, webhook delivery, integration marketplace, API analytics, and executive intelligence dashboard with security-first audit and the shared Executive Intelligence SDK.
                </p>
            </motion.header>
            <ExecutiveIntelligenceStats stats={executiveIntelligence.stats} />
            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === tab.id ? "bg-violet-600 text-white" : "border border-slate-200 text-slate-600 hover:border-violet-300 dark:border-slate-800 dark:text-slate-300"}`}>{tab.label}</button>
                ))}
            </div>
            {activeTab === AIX_TABS.overview ? <ExecutiveIntelligenceOverviewPanel data={executiveIntelligence} /> : null}
            {activeTab === AIX_TABS.intelligenceHubs ? <IntelligenceHubsPanel data={executiveIntelligence} /> : null}
            {activeTab === AIX_TABS.dailyExecutiveBriefs ? <DailyExecutiveBriefsPanel data={executiveIntelligence} /> : null}
            {activeTab === AIX_TABS.weeklyBusinessReviews ? <WeeklyBusinessReviewsPanel data={executiveIntelligence} /> : null}
            {activeTab === AIX_TABS.monthlyExecutiveSummaries ? <MonthlyExecutiveSummarysPanel data={executiveIntelligence} /> : null}
            {activeTab === AIX_TABS.trialConversionScores ? <TrialConversionScoresPanel data={executiveIntelligence} /> : null}
            {activeTab === AIX_TABS.renewalProbabilities ? <RenewalProbabilitysPanel data={executiveIntelligence} /> : null}
            {activeTab === AIX_TABS.churnRisks ? <ChurnRisksPanel data={executiveIntelligence} /> : null}
            {activeTab === AIX_TABS.expansionOpportunities ? <ExpansionOpportunitysPanel data={executiveIntelligence} /> : null}
            {activeTab === AIX_TABS.mrrTrends ? <MrrTrendsPanel data={executiveIntelligence} /> : null}
            {activeTab === AIX_TABS.arrTrends ? <ArrTrendsPanel data={executiveIntelligence} /> : null}
            {activeTab === AIX_TABS.revenueGrowthMetrics ? <RevenueGrowthMetricsPanel data={executiveIntelligence} /> : null}
            {activeTab === AIX_TABS.revenueRisks ? <RevenueRisksPanel data={executiveIntelligence} /> : null}
            {activeTab === AIX_TABS.platformHealthIntel ? <PlatformHealthIntelsPanel data={executiveIntelligence} /> : null}
            {activeTab === AIX_TABS.queueHealthIntel ? <QueueHealthIntelsPanel data={executiveIntelligence} /> : null}
            {activeTab === AIX_TABS.integrationHealthIntel ? <IntegrationHealthIntelsPanel data={executiveIntelligence} /> : null}
            {activeTab === AIX_TABS.performanceTrends ? <PerformanceTrendsPanel data={executiveIntelligence} /> : null}
            {activeTab === AIX_TABS.unusualLoginActivity ? <UnusualLoginActivitysPanel data={executiveIntelligence} /> : null}
            {activeTab === AIX_TABS.permissionRisks ? <PermissionRisksPanel data={executiveIntelligence} /> : null}
            {activeTab === AIX_TABS.tenantSecurityTrends ? <TenantSecurityTrendsPanel data={executiveIntelligence} /> : null}
            {activeTab === AIX_TABS.complianceWarnings ? <ComplianceWarningsPanel data={executiveIntelligence} /> : null}
            {activeTab === AIX_TABS.todayPriorities ? <TodayPrioritysPanel data={executiveIntelligence} /> : null}
            {activeTab === AIX_TABS.recommendedActions ? <RecommendedActionsPanel data={executiveIntelligence} /> : null}
            {activeTab === AIX_TABS.businessRisks ? <BusinessRisksPanel data={executiveIntelligence} /> : null}
            {activeTab === AIX_TABS.growthOpportunities ? <GrowthOpportunitysPanel data={executiveIntelligence} /> : null}
            {activeTab === AIX_TABS.knowledgeReasoningSessions ? <KnowledgeReasoningSessionsPanel data={executiveIntelligence} /> : null}
            {activeTab === AIX_TABS.evidenceTraces ? <EvidenceTracesPanel data={executiveIntelligence} /> : null}
            {activeTab === AIX_TABS.orchestrationLinks ? <OrchestrationLinksPanel data={executiveIntelligence} /> : null}
            {activeTab === AIX_TABS.recommendationOutputs ? <RecommendationOutputsPanel data={executiveIntelligence} /> : null}
            {activeTab === AIX_TABS.executiveMetrics ? <ExecutiveMetricsPanel data={executiveIntelligence} /> : null}
            {activeTab === AIX_TABS.executiveHealth ? <ExecutiveHealthsPanel data={executiveIntelligence} /> : null}
            {activeTab === AIX_TABS.executiveFailures ? <ExecutiveFailuresPanel data={executiveIntelligence} /> : null}
            {activeTab === AIX_TABS.auditLogs ? <ExecutiveIntelligenceAuditLogsPanel data={executiveIntelligence} /> : null}
            {activeTab === AIX_TABS.api ? <ExecutiveIntelligenceSdkPanel data={executiveIntelligence} /> : null}
        </div>
    );
}
