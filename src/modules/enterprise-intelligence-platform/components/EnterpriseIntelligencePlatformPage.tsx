"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { LoadingState } from "@/src/components/ui/LoadingState";
import {
    RetailOverviewPanel,
    IntelligenceHubsPanel,
    KpiRegistrysPanel,
    KpiAggregationsPanel,
    KpiCategorysPanel,
    KpiTargetsPanel,
    KpiThresholdsPanel,
    KpiSnapshotsPanel,
    ExecutiveDashboardsPanel,
    CrossModuleInsightsPanel,
    BusinessHealthScoresPanel,
    OperationalEfficiencyScoresPanel,
    GrowthScoresPanel,
    StrategicInsightsPanel,
    RevenueForecastsPanel,
    CustomerGrowthForecastsPanel,
    RenewalForecastsPanel,
    CapacityPlanningsPanel,
    OperationalTrendsPanel,
    RiskForecastsPanel,
    DailyExecutiveBriefsPanel,
    WeeklyBusinessSummarysPanel,
    MonthlyPerformanceReportsPanel,
    QuarterlyExecutiveReviewsPanel,
    AnnualBusinessReportsPanel,
    KpiServiceConfigsPanel,
    IntelligenceServiceConfigsPanel,
    ForecastServiceConfigsPanel,
    IntelligenceMetricsPanel,
    IntelligenceHealthsPanel,
    MissionProgresssPanel,
    IntelligenceFailuresPanel,
    RetailAuditLogsPanel,
    RetailSdkPanel,
} from "@/src/modules/enterprise-intelligence-platform/components/EnterpriseIntelligencePlatformPanels";
import { EnterpriseIntelligencePlatformStats } from "@/src/modules/enterprise-intelligence-platform/components/EnterpriseIntelligencePlatformStats";
import { EIP_TABS } from "@/src/modules/enterprise-intelligence-platform/constants";
import { useEnterpriseIntelligencePlatform } from "@/src/modules/enterprise-intelligence-platform/hooks/useEnterpriseIntelligencePlatform";

const tabs = [
    { id: EIP_TABS.overview, label: "Overview" },
    { id: EIP_TABS.intelligenceHubs, label: "Intelligence Hubs" },
    { id: EIP_TABS.kpiRegistry, label: "Kpi Registry" },
    { id: EIP_TABS.kpiAggregations, label: "Kpi Aggregations" },
    { id: EIP_TABS.kpiCategories, label: "Kpi Categories" },
    { id: EIP_TABS.kpiTargets, label: "Kpi Targets" },
    { id: EIP_TABS.kpiThresholds, label: "Kpi Thresholds" },
    { id: EIP_TABS.kpiSnapshots, label: "Kpi Snapshots" },
    { id: EIP_TABS.executiveDashboards, label: "Executive Dashboards" },
    { id: EIP_TABS.crossModuleInsights, label: "Cross Module Insights" },
    { id: EIP_TABS.businessHealthScores, label: "Business Health Scores" },
    { id: EIP_TABS.operationalEfficiencyScores, label: "Operational Efficiency Scores" },
    { id: EIP_TABS.growthScores, label: "Growth Scores" },
    { id: EIP_TABS.strategicInsights, label: "Strategic Insights" },
    { id: EIP_TABS.revenueForecasts, label: "Revenue Forecasts" },
    { id: EIP_TABS.customerGrowthForecasts, label: "Customer Growth Forecasts" },
    { id: EIP_TABS.renewalForecasts, label: "Renewal Forecasts" },
    { id: EIP_TABS.capacityPlanning, label: "Capacity Planning" },
    { id: EIP_TABS.operationalTrends, label: "Operational Trends" },
    { id: EIP_TABS.riskForecasts, label: "Risk Forecasts" },
    { id: EIP_TABS.dailyExecutiveBriefs, label: "Daily Executive Briefs" },
    { id: EIP_TABS.weeklyBusinessSummaries, label: "Weekly Business Summaries" },
    { id: EIP_TABS.monthlyPerformanceReports, label: "Monthly Performance Reports" },
    { id: EIP_TABS.quarterlyExecutiveReviews, label: "Quarterly Executive Reviews" },
    { id: EIP_TABS.annualBusinessReports, label: "Annual Business Reports" },
    { id: EIP_TABS.kpiServiceConfigs, label: "Kpi Service Configs" },
    { id: EIP_TABS.intelligenceServiceConfigs, label: "Intelligence Service Configs" },
    { id: EIP_TABS.forecastServiceConfigs, label: "Forecast Service Configs" },
    { id: EIP_TABS.intelligenceMetrics, label: "Intelligence Metrics" },
    { id: EIP_TABS.intelligenceHealth, label: "Intelligence Health" },
    { id: EIP_TABS.missionProgress, label: "Mission Progress" },
    { id: EIP_TABS.intelligenceFailures, label: "Intelligence Failures" },
    { id: EIP_TABS.auditLogs, label: "Audit Logs" },
    { id: EIP_TABS.api, label: "SDK" },
] as const;

export function EnterpriseIntelligencePlatformPage() {
    const retail = useEnterpriseIntelligencePlatform();
    const [activeTab, setActiveTab] = useState<(typeof EIP_TABS)[keyof typeof EIP_TABS]>(EIP_TABS.overview);

    if (retail.loading) {
        return <div className="mx-auto max-w-7xl"><LoadingState label="Loading Enterprise Intelligence Platform" /></div>;
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-fuchsia-900 dark:text-fuchsia-100">
            <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-fuchsia-900/80">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-fuchsia-600">V2 Program A Enterprise Intelligence Platform</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Enterprise Enterprise Intelligence Platform</h1>
                <p className="mt-3 max-w-2xl text-sm text-fuchsia-500 dark:text-fuchsia-400">
                    Integration layer for the entire SaaS platform: dining areas, payment & accounting connectors, public API platform, webhook delivery, integration marketplace, API analytics, and retail operating system dashboard with security-first audit and the shared Enterprise Intelligence Platform SDK.
                </p>
            </motion.header>
            <EnterpriseIntelligencePlatformStats stats={retail.stats} />
            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === tab.id ? "bg-fuchsia-600 text-white" : "border border-slate-200 text-fuchsia-600 hover:border-fuchsia-300 dark:border-slate-800 dark:text-fuchsia-300"}`}>{tab.label}</button>
                ))}
            </div>
            {activeTab === EIP_TABS.overview ? <RetailOverviewPanel data={retail} /> : null}
            {activeTab === EIP_TABS.intelligenceHubs ? <IntelligenceHubsPanel data={retail} /> : null}
            {activeTab === EIP_TABS.kpiRegistry ? <KpiRegistrysPanel data={retail} /> : null}
            {activeTab === EIP_TABS.kpiAggregations ? <KpiAggregationsPanel data={retail} /> : null}
            {activeTab === EIP_TABS.kpiCategories ? <KpiCategorysPanel data={retail} /> : null}
            {activeTab === EIP_TABS.kpiTargets ? <KpiTargetsPanel data={retail} /> : null}
            {activeTab === EIP_TABS.kpiThresholds ? <KpiThresholdsPanel data={retail} /> : null}
            {activeTab === EIP_TABS.kpiSnapshots ? <KpiSnapshotsPanel data={retail} /> : null}
            {activeTab === EIP_TABS.executiveDashboards ? <ExecutiveDashboardsPanel data={retail} /> : null}
            {activeTab === EIP_TABS.crossModuleInsights ? <CrossModuleInsightsPanel data={retail} /> : null}
            {activeTab === EIP_TABS.businessHealthScores ? <BusinessHealthScoresPanel data={retail} /> : null}
            {activeTab === EIP_TABS.operationalEfficiencyScores ? <OperationalEfficiencyScoresPanel data={retail} /> : null}
            {activeTab === EIP_TABS.growthScores ? <GrowthScoresPanel data={retail} /> : null}
            {activeTab === EIP_TABS.strategicInsights ? <StrategicInsightsPanel data={retail} /> : null}
            {activeTab === EIP_TABS.revenueForecasts ? <RevenueForecastsPanel data={retail} /> : null}
            {activeTab === EIP_TABS.customerGrowthForecasts ? <CustomerGrowthForecastsPanel data={retail} /> : null}
            {activeTab === EIP_TABS.renewalForecasts ? <RenewalForecastsPanel data={retail} /> : null}
            {activeTab === EIP_TABS.capacityPlanning ? <CapacityPlanningsPanel data={retail} /> : null}
            {activeTab === EIP_TABS.operationalTrends ? <OperationalTrendsPanel data={retail} /> : null}
            {activeTab === EIP_TABS.riskForecasts ? <RiskForecastsPanel data={retail} /> : null}
            {activeTab === EIP_TABS.dailyExecutiveBriefs ? <DailyExecutiveBriefsPanel data={retail} /> : null}
            {activeTab === EIP_TABS.weeklyBusinessSummaries ? <WeeklyBusinessSummarysPanel data={retail} /> : null}
            {activeTab === EIP_TABS.monthlyPerformanceReports ? <MonthlyPerformanceReportsPanel data={retail} /> : null}
            {activeTab === EIP_TABS.quarterlyExecutiveReviews ? <QuarterlyExecutiveReviewsPanel data={retail} /> : null}
            {activeTab === EIP_TABS.annualBusinessReports ? <AnnualBusinessReportsPanel data={retail} /> : null}
            {activeTab === EIP_TABS.kpiServiceConfigs ? <KpiServiceConfigsPanel data={retail} /> : null}
            {activeTab === EIP_TABS.intelligenceServiceConfigs ? <IntelligenceServiceConfigsPanel data={retail} /> : null}
            {activeTab === EIP_TABS.forecastServiceConfigs ? <ForecastServiceConfigsPanel data={retail} /> : null}
            {activeTab === EIP_TABS.intelligenceMetrics ? <IntelligenceMetricsPanel data={retail} /> : null}
            {activeTab === EIP_TABS.intelligenceHealth ? <IntelligenceHealthsPanel data={retail} /> : null}
            {activeTab === EIP_TABS.missionProgress ? <MissionProgresssPanel data={retail} /> : null}
            {activeTab === EIP_TABS.intelligenceFailures ? <IntelligenceFailuresPanel data={retail} /> : null}
            {activeTab === EIP_TABS.auditLogs ? <RetailAuditLogsPanel data={retail} /> : null}
            {activeTab === EIP_TABS.api ? <RetailSdkPanel data={retail} /> : null}
        </div>
    );
}
