"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { LoadingState } from "@/src/components/ui/LoadingState";
import {
    RetailOverviewPanel,
    OrganizationHubsPanel,
    GrowthOrchestratorsPanel,
    CampaignIntelligencesPanel,
    LeadPrioritizationsPanel,
    OpportunityRecommendationsPanel,
    PipelineHealthsPanel,
    GrowthAnalyticssPanel,
    ExecutiveGrowthDashboardsPanel,
    DeliveryOrchestratorsPanel,
    ResourcePlannersPanel,
    ImplementationSchedulersPanel,
    DeploymentCoordinationsPanel,
    DeliveryIntelligencesPanel,
    CustomerSuccessAutomationsPanel,
    ExecutiveDeliveryDashboardsPanel,
    IdeaRegistrysPanel,
    InnovationPipelinesPanel,
    ExperimentTrackersPanel,
    ValidationWorkflowsPanel,
    OutcomeEvaluationsPanel,
    KnowledgeRepositorysPanel,
    AiTaskRoutersPanel,
    HumanApprovalEnginesPanel,
    PolicyEnginesPanel,
    ExecutionHistorysPanel,
    AiGovernanceRulesPanel,
    OrganizationMetricsPanel,
    OrganizationHealthsPanel,
    InnovationDashboardsPanel,
    MissionProgresssPanel,
    OrganizationFailuresPanel,
    RetailAuditLogsPanel,
    RetailSdkPanel,
} from "@/src/modules/ai-organization-foundation/components/AiOrganizationFoundationPanels";
import { AiOrganizationFoundationStats } from "@/src/modules/ai-organization-foundation/components/AiOrganizationFoundationStats";
import { AOF_TABS } from "@/src/modules/ai-organization-foundation/constants";
import { useAiOrganizationFoundation } from "@/src/modules/ai-organization-foundation/hooks/useAiOrganizationFoundation";

const tabs = [
    { id: AOF_TABS.overview, label: "Overview" },
    { id: AOF_TABS.organizationHubs, label: "Organization Hubs" },
    { id: AOF_TABS.growthOrchestrators, label: "Growth Orchestrators" },
    { id: AOF_TABS.campaignIntelligence, label: "Campaign Intelligence" },
    { id: AOF_TABS.leadPrioritization, label: "Lead Prioritization" },
    { id: AOF_TABS.opportunityRecommendations, label: "Opportunity Recommendations" },
    { id: AOF_TABS.pipelineHealth, label: "Pipeline Health" },
    { id: AOF_TABS.growthAnalytics, label: "Growth Analytics" },
    { id: AOF_TABS.executiveGrowthDashboards, label: "Executive Growth Dashboards" },
    { id: AOF_TABS.deliveryOrchestrators, label: "Delivery Orchestrators" },
    { id: AOF_TABS.resourcePlanners, label: "Resource Planners" },
    { id: AOF_TABS.implementationSchedulers, label: "Implementation Schedulers" },
    { id: AOF_TABS.deploymentCoordination, label: "Deployment Coordination" },
    { id: AOF_TABS.deliveryIntelligence, label: "Delivery Intelligence" },
    { id: AOF_TABS.customerSuccessAutomation, label: "Customer Success Automation" },
    { id: AOF_TABS.executiveDeliveryDashboards, label: "Executive Delivery Dashboards" },
    { id: AOF_TABS.ideaRegistry, label: "Idea Registry" },
    { id: AOF_TABS.innovationPipeline, label: "Innovation Pipeline" },
    { id: AOF_TABS.experimentTracker, label: "Experiment Tracker" },
    { id: AOF_TABS.validationWorkflow, label: "Validation Workflow" },
    { id: AOF_TABS.outcomeEvaluation, label: "Outcome Evaluation" },
    { id: AOF_TABS.knowledgeRepository, label: "Knowledge Repository" },
    { id: AOF_TABS.aiTaskRouters, label: "Ai Task Routers" },
    { id: AOF_TABS.humanApprovalEngine, label: "Human Approval Engine" },
    { id: AOF_TABS.policyEngine, label: "Policy Engine" },
    { id: AOF_TABS.executionHistory, label: "Execution History" },
    { id: AOF_TABS.aiGovernanceRules, label: "Ai Governance Rules" },
    { id: AOF_TABS.organizationMetrics, label: "Organization Metrics" },
    { id: AOF_TABS.organizationHealth, label: "Organization Health" },
    { id: AOF_TABS.innovationDashboards, label: "Innovation Dashboards" },
    { id: AOF_TABS.missionProgress, label: "Mission Progress" },
    { id: AOF_TABS.organizationFailures, label: "Organization Failures" },
    { id: AOF_TABS.auditLogs, label: "Audit Logs" },
    { id: AOF_TABS.api, label: "SDK" },
] as const;

export function AiOrganizationFoundationPage() {
    const retail = useAiOrganizationFoundation();
    const [activeTab, setActiveTab] = useState<(typeof AOF_TABS)[keyof typeof AOF_TABS]>(AOF_TABS.overview);

    if (retail.loading) {
        return <div className="mx-auto max-w-7xl"><LoadingState label="Loading AI Organization Foundation" /></div>;
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-orange-900 dark:text-orange-100">
            <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-orange-900/80">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-orange-600">V2 Program A AI Organization Foundation</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Enterprise AI Organization Foundation</h1>
                <p className="mt-3 max-w-2xl text-sm text-orange-500 dark:text-orange-400">
                    Integration layer for the entire SaaS platform: dining areas, payment & accounting connectors, public API platform, webhook delivery, integration marketplace, API analytics, and retail operating system dashboard with security-first audit and the shared AI Organization Foundation SDK.
                </p>
            </motion.header>
            <AiOrganizationFoundationStats stats={retail.stats} />
            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === tab.id ? "bg-orange-600 text-white" : "border border-slate-200 text-orange-600 hover:border-orange-300 dark:border-slate-800 dark:text-orange-300"}`}>{tab.label}</button>
                ))}
            </div>
            {activeTab === AOF_TABS.overview ? <RetailOverviewPanel data={retail} /> : null}
            {activeTab === AOF_TABS.organizationHubs ? <OrganizationHubsPanel data={retail} /> : null}
            {activeTab === AOF_TABS.growthOrchestrators ? <GrowthOrchestratorsPanel data={retail} /> : null}
            {activeTab === AOF_TABS.campaignIntelligence ? <CampaignIntelligencesPanel data={retail} /> : null}
            {activeTab === AOF_TABS.leadPrioritization ? <LeadPrioritizationsPanel data={retail} /> : null}
            {activeTab === AOF_TABS.opportunityRecommendations ? <OpportunityRecommendationsPanel data={retail} /> : null}
            {activeTab === AOF_TABS.pipelineHealth ? <PipelineHealthsPanel data={retail} /> : null}
            {activeTab === AOF_TABS.growthAnalytics ? <GrowthAnalyticssPanel data={retail} /> : null}
            {activeTab === AOF_TABS.executiveGrowthDashboards ? <ExecutiveGrowthDashboardsPanel data={retail} /> : null}
            {activeTab === AOF_TABS.deliveryOrchestrators ? <DeliveryOrchestratorsPanel data={retail} /> : null}
            {activeTab === AOF_TABS.resourcePlanners ? <ResourcePlannersPanel data={retail} /> : null}
            {activeTab === AOF_TABS.implementationSchedulers ? <ImplementationSchedulersPanel data={retail} /> : null}
            {activeTab === AOF_TABS.deploymentCoordination ? <DeploymentCoordinationsPanel data={retail} /> : null}
            {activeTab === AOF_TABS.deliveryIntelligence ? <DeliveryIntelligencesPanel data={retail} /> : null}
            {activeTab === AOF_TABS.customerSuccessAutomation ? <CustomerSuccessAutomationsPanel data={retail} /> : null}
            {activeTab === AOF_TABS.executiveDeliveryDashboards ? <ExecutiveDeliveryDashboardsPanel data={retail} /> : null}
            {activeTab === AOF_TABS.ideaRegistry ? <IdeaRegistrysPanel data={retail} /> : null}
            {activeTab === AOF_TABS.innovationPipeline ? <InnovationPipelinesPanel data={retail} /> : null}
            {activeTab === AOF_TABS.experimentTracker ? <ExperimentTrackersPanel data={retail} /> : null}
            {activeTab === AOF_TABS.validationWorkflow ? <ValidationWorkflowsPanel data={retail} /> : null}
            {activeTab === AOF_TABS.outcomeEvaluation ? <OutcomeEvaluationsPanel data={retail} /> : null}
            {activeTab === AOF_TABS.knowledgeRepository ? <KnowledgeRepositorysPanel data={retail} /> : null}
            {activeTab === AOF_TABS.aiTaskRouters ? <AiTaskRoutersPanel data={retail} /> : null}
            {activeTab === AOF_TABS.humanApprovalEngine ? <HumanApprovalEnginesPanel data={retail} /> : null}
            {activeTab === AOF_TABS.policyEngine ? <PolicyEnginesPanel data={retail} /> : null}
            {activeTab === AOF_TABS.executionHistory ? <ExecutionHistorysPanel data={retail} /> : null}
            {activeTab === AOF_TABS.aiGovernanceRules ? <AiGovernanceRulesPanel data={retail} /> : null}
            {activeTab === AOF_TABS.organizationMetrics ? <OrganizationMetricsPanel data={retail} /> : null}
            {activeTab === AOF_TABS.organizationHealth ? <OrganizationHealthsPanel data={retail} /> : null}
            {activeTab === AOF_TABS.innovationDashboards ? <InnovationDashboardsPanel data={retail} /> : null}
            {activeTab === AOF_TABS.missionProgress ? <MissionProgresssPanel data={retail} /> : null}
            {activeTab === AOF_TABS.organizationFailures ? <OrganizationFailuresPanel data={retail} /> : null}
            {activeTab === AOF_TABS.auditLogs ? <RetailAuditLogsPanel data={retail} /> : null}
            {activeTab === AOF_TABS.api ? <RetailSdkPanel data={retail} /> : null}
        </div>
    );
}
