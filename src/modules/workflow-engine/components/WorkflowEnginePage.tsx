"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { LoadingState } from "@/src/components/ui/LoadingState";
import {
    WorkflowEngineOverviewPanel,
    WorkflowHubsPanel,
    WorkflowDefinitionsPanel,
    WorkflowCategorysPanel,
    WorkflowTemplatesPanel,
    WorkflowVersionsPanel,
    WorkflowNodesPanel,
    WorkflowTransitionsPanel,
    DecisionNodesPanel,
    ReusableSubflowsPanel,
    WorkflowExecutionsPanel,
    ExecutionHistorysPanel,
    ExecutionRetrysPanel,
    ExecutionRollbacksPanel,
    TimeTriggersPanel,
    BusinessEventTriggersPanel,
    WebhookTriggersPanel,
    ScheduledTriggersPanel,
    ManualReviewsPanel,
    ApprovalTasksPanel,
    EscalationRulesPanel,
    SlaTrackingsPanel,
    AutomationNotificationsPanel,
    AutomationApiCallsPanel,
    AutomationIntegrationsPanel,
    ExecutionAnalyticssPanel,
    BottleneckReportsPanel,
    SlaComplianceMetricsPanel,
    WorkflowMetricsPanel,
    WorkflowHealthsPanel,
    FailedExecutionsPanel,
    WorkflowFailuresPanel,
    WorkflowEngineAuditLogsPanel,
    WorkflowEngineSdkPanel,
} from "@/src/modules/workflow-engine/components/WorkflowEnginePanels";
import { WorkflowEngineStats } from "@/src/modules/workflow-engine/components/WorkflowEngineStats";
import { DWE_TABS } from "@/src/modules/workflow-engine/constants";
import { useWorkflowEngine } from "@/src/modules/workflow-engine/hooks/useWorkflowEngine";

const tabs = [
    { id: DWE_TABS.overview, label: "Overview" },
    { id: DWE_TABS.workflowHubs, label: "Workflow Hubs" },
    { id: DWE_TABS.workflowDefinitions, label: "Workflow Definitions" },
    { id: DWE_TABS.workflowCategories, label: "Workflow Categories" },
    { id: DWE_TABS.workflowTemplates, label: "Workflow Templates" },
    { id: DWE_TABS.workflowVersions, label: "Workflow Versions" },
    { id: DWE_TABS.workflowNodes, label: "Workflow Nodes" },
    { id: DWE_TABS.workflowTransitions, label: "Workflow Transitions" },
    { id: DWE_TABS.decisionNodes, label: "Decision Nodes" },
    { id: DWE_TABS.reusableSubflows, label: "Reusable Subflows" },
    { id: DWE_TABS.workflowExecutions, label: "Workflow Executions" },
    { id: DWE_TABS.executionHistory, label: "Execution History" },
    { id: DWE_TABS.executionRetries, label: "Execution Retries" },
    { id: DWE_TABS.executionRollbacks, label: "Execution Rollbacks" },
    { id: DWE_TABS.timeTriggers, label: "Time Triggers" },
    { id: DWE_TABS.businessEventTriggers, label: "Business Event Triggers" },
    { id: DWE_TABS.webhookTriggers, label: "Webhook Triggers" },
    { id: DWE_TABS.scheduledTriggers, label: "Scheduled Triggers" },
    { id: DWE_TABS.manualReviews, label: "Manual Reviews" },
    { id: DWE_TABS.approvalTasks, label: "Approval Tasks" },
    { id: DWE_TABS.escalationRules, label: "Escalation Rules" },
    { id: DWE_TABS.slaTrackings, label: "Sla Trackings" },
    { id: DWE_TABS.automationNotifications, label: "Automation Notifications" },
    { id: DWE_TABS.automationApiCalls, label: "Automation Api Calls" },
    { id: DWE_TABS.automationIntegrations, label: "Automation Integrations" },
    { id: DWE_TABS.executionAnalytics, label: "Execution Analytics" },
    { id: DWE_TABS.bottleneckReports, label: "Bottleneck Reports" },
    { id: DWE_TABS.slaComplianceMetrics, label: "Sla Compliance Metrics" },
    { id: DWE_TABS.workflowMetrics, label: "Workflow Metrics" },
    { id: DWE_TABS.workflowHealth, label: "Workflow Health" },
    { id: DWE_TABS.failedExecutions, label: "Failed Executions" },
    { id: DWE_TABS.workflowFailures, label: "Workflow Failures" },
    { id: DWE_TABS.auditLogs, label: "Audit Logs" },
    { id: DWE_TABS.api, label: "SDK" },
] as const;

export function WorkflowEnginePage() {
    const workflowEngine = useWorkflowEngine();
    const [activeTab, setActiveTab] = useState<(typeof DWE_TABS)[keyof typeof DWE_TABS]>(DWE_TABS.overview);

    if (workflowEngine.loading) {
        return <div className="mx-auto max-w-7xl"><LoadingState label="Loading Workflow Engine" /></div>;
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-slate-900 dark:text-slate-100">
            <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-orange-600">V2 Program A Program B Sprint 4</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Enterprise Workflow Engine</h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                    Integration layer for the entire SaaS platform: workflow nodes, payment & accounting connectors, public API platform, webhook delivery, integration marketplace, API analytics, and workflow engine dashboard with security-first audit and the shared Workflow Engine SDK.
                </p>
            </motion.header>
            <WorkflowEngineStats stats={workflowEngine.stats} />
            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === tab.id ? "bg-orange-600 text-white" : "border border-slate-200 text-slate-600 hover:border-orange-300 dark:border-slate-800 dark:text-slate-300"}`}>{tab.label}</button>
                ))}
            </div>
            {activeTab === DWE_TABS.overview ? <WorkflowEngineOverviewPanel data={workflowEngine} /> : null}
            {activeTab === DWE_TABS.workflowHubs ? <WorkflowHubsPanel data={workflowEngine} /> : null}
            {activeTab === DWE_TABS.workflowDefinitions ? <WorkflowDefinitionsPanel data={workflowEngine} /> : null}
            {activeTab === DWE_TABS.workflowCategories ? <WorkflowCategorysPanel data={workflowEngine} /> : null}
            {activeTab === DWE_TABS.workflowTemplates ? <WorkflowTemplatesPanel data={workflowEngine} /> : null}
            {activeTab === DWE_TABS.workflowVersions ? <WorkflowVersionsPanel data={workflowEngine} /> : null}
            {activeTab === DWE_TABS.workflowNodes ? <WorkflowNodesPanel data={workflowEngine} /> : null}
            {activeTab === DWE_TABS.workflowTransitions ? <WorkflowTransitionsPanel data={workflowEngine} /> : null}
            {activeTab === DWE_TABS.decisionNodes ? <DecisionNodesPanel data={workflowEngine} /> : null}
            {activeTab === DWE_TABS.reusableSubflows ? <ReusableSubflowsPanel data={workflowEngine} /> : null}
            {activeTab === DWE_TABS.workflowExecutions ? <WorkflowExecutionsPanel data={workflowEngine} /> : null}
            {activeTab === DWE_TABS.executionHistory ? <ExecutionHistorysPanel data={workflowEngine} /> : null}
            {activeTab === DWE_TABS.executionRetries ? <ExecutionRetrysPanel data={workflowEngine} /> : null}
            {activeTab === DWE_TABS.executionRollbacks ? <ExecutionRollbacksPanel data={workflowEngine} /> : null}
            {activeTab === DWE_TABS.timeTriggers ? <TimeTriggersPanel data={workflowEngine} /> : null}
            {activeTab === DWE_TABS.businessEventTriggers ? <BusinessEventTriggersPanel data={workflowEngine} /> : null}
            {activeTab === DWE_TABS.webhookTriggers ? <WebhookTriggersPanel data={workflowEngine} /> : null}
            {activeTab === DWE_TABS.scheduledTriggers ? <ScheduledTriggersPanel data={workflowEngine} /> : null}
            {activeTab === DWE_TABS.manualReviews ? <ManualReviewsPanel data={workflowEngine} /> : null}
            {activeTab === DWE_TABS.approvalTasks ? <ApprovalTasksPanel data={workflowEngine} /> : null}
            {activeTab === DWE_TABS.escalationRules ? <EscalationRulesPanel data={workflowEngine} /> : null}
            {activeTab === DWE_TABS.slaTrackings ? <SlaTrackingsPanel data={workflowEngine} /> : null}
            {activeTab === DWE_TABS.automationNotifications ? <AutomationNotificationsPanel data={workflowEngine} /> : null}
            {activeTab === DWE_TABS.automationApiCalls ? <AutomationApiCallsPanel data={workflowEngine} /> : null}
            {activeTab === DWE_TABS.automationIntegrations ? <AutomationIntegrationsPanel data={workflowEngine} /> : null}
            {activeTab === DWE_TABS.executionAnalytics ? <ExecutionAnalyticssPanel data={workflowEngine} /> : null}
            {activeTab === DWE_TABS.bottleneckReports ? <BottleneckReportsPanel data={workflowEngine} /> : null}
            {activeTab === DWE_TABS.slaComplianceMetrics ? <SlaComplianceMetricsPanel data={workflowEngine} /> : null}
            {activeTab === DWE_TABS.workflowMetrics ? <WorkflowMetricsPanel data={workflowEngine} /> : null}
            {activeTab === DWE_TABS.workflowHealth ? <WorkflowHealthsPanel data={workflowEngine} /> : null}
            {activeTab === DWE_TABS.failedExecutions ? <FailedExecutionsPanel data={workflowEngine} /> : null}
            {activeTab === DWE_TABS.workflowFailures ? <WorkflowFailuresPanel data={workflowEngine} /> : null}
            {activeTab === DWE_TABS.auditLogs ? <WorkflowEngineAuditLogsPanel data={workflowEngine} /> : null}
            {activeTab === DWE_TABS.api ? <WorkflowEngineSdkPanel data={workflowEngine} /> : null}
        </div>
    );
}
