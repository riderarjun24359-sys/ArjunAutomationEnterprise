"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { LoadingState } from "@/src/components/ui/LoadingState";
import {
    BusinessProcessOverviewPanel,
    ProcessHubsPanel,
    BusinessProcesssPanel,
    ProcessCategorysPanel,
    ProcessVersionsPanel,
    ProcessDependencysPanel,
    ProcessModelsPanel,
    ProcessStepsPanel,
    DecisionPointsPanel,
    ReusableBlocksPanel,
    ApprovalRulesPanel,
    SequentialApprovalsPanel,
    ParallelApprovalsPanel,
    EscalationRulesPanel,
    TaskAssignmentsPanel,
    TaskTemplatesPanel,
    RecurringTasksPanel,
    TaskSlaPolicysPanel,
    RuleConditionsPanel,
    RuleValidationsPanel,
    RuleCalculationsPanel,
    ReusableRulesPanel,
    ProcessExecutionsPanel,
    ExecutionHistorysPanel,
    ExecutionRetrysPanel,
    ExecutionAnalyticssPanel,
    BottleneckReportsPanel,
    SlaPerformanceMetricsPanel,
    ProcessMetricsPanel,
    ProcessHealthsPanel,
    FailedProcessRecordsPanel,
    ProcessFailuresPanel,
    BusinessProcessAuditLogsPanel,
    BusinessProcessSdkPanel,
} from "@/src/modules/business-process/components/BusinessProcessPanels";
import { BusinessProcessStats } from "@/src/modules/business-process/components/BusinessProcessStats";
import { BPF_TABS } from "@/src/modules/business-process/constants";
import { useBusinessProcess } from "@/src/modules/business-process/hooks/useBusinessProcess";

const tabs = [
    { id: BPF_TABS.overview, label: "Overview" },
    { id: BPF_TABS.processHubs, label: "Process Hubs" },
    { id: BPF_TABS.businessProcesses, label: "Business Processes" },
    { id: BPF_TABS.processCategories, label: "Process Categories" },
    { id: BPF_TABS.processVersions, label: "Process Versions" },
    { id: BPF_TABS.processDependencies, label: "Process Dependencies" },
    { id: BPF_TABS.processModels, label: "Process Models" },
    { id: BPF_TABS.processSteps, label: "Process Steps" },
    { id: BPF_TABS.decisionPoints, label: "Decision Points" },
    { id: BPF_TABS.reusableBlocks, label: "Reusable Blocks" },
    { id: BPF_TABS.approvalRules, label: "Approval Rules" },
    { id: BPF_TABS.sequentialApprovals, label: "Sequential Approvals" },
    { id: BPF_TABS.parallelApprovals, label: "Parallel Approvals" },
    { id: BPF_TABS.escalationRules, label: "Escalation Rules" },
    { id: BPF_TABS.taskAssignments, label: "Task Assignments" },
    { id: BPF_TABS.taskTemplates, label: "Task Templates" },
    { id: BPF_TABS.recurringTasks, label: "Recurring Tasks" },
    { id: BPF_TABS.taskSlaPolicies, label: "Task Sla Policies" },
    { id: BPF_TABS.ruleConditions, label: "Rule Conditions" },
    { id: BPF_TABS.ruleValidations, label: "Rule Validations" },
    { id: BPF_TABS.ruleCalculations, label: "Rule Calculations" },
    { id: BPF_TABS.reusableRules, label: "Reusable Rules" },
    { id: BPF_TABS.processExecutions, label: "Process Executions" },
    { id: BPF_TABS.executionHistory, label: "Execution History" },
    { id: BPF_TABS.executionRetries, label: "Execution Retries" },
    { id: BPF_TABS.executionAnalytics, label: "Execution Analytics" },
    { id: BPF_TABS.bottleneckReports, label: "Bottleneck Reports" },
    { id: BPF_TABS.slaPerformanceMetrics, label: "Sla Performance Metrics" },
    { id: BPF_TABS.processMetrics, label: "Process Metrics" },
    { id: BPF_TABS.processHealth, label: "Process Health" },
    { id: BPF_TABS.failedProcessRecords, label: "Failed Process Records" },
    { id: BPF_TABS.processFailures, label: "Process Failures" },
    { id: BPF_TABS.auditLogs, label: "Audit Logs" },
    { id: BPF_TABS.api, label: "SDK" },
] as const;

export function BusinessProcessPage() {
    const businessProcess = useBusinessProcess();
    const [activeTab, setActiveTab] = useState<(typeof BPF_TABS)[keyof typeof BPF_TABS]>(BPF_TABS.overview);

    if (businessProcess.loading) {
        return <div className="mx-auto max-w-7xl"><LoadingState label="Loading Business Process" /></div>;
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-slate-900 dark:text-slate-100">
            <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-sky-600">V2 Program A Program B Sprint 2</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Enterprise Business Process</h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                    Integration layer for the entire SaaS platform: task templates, payment & accounting connectors, public API platform, webhook delivery, integration marketplace, API analytics, and business process dashboard with security-first audit and the shared Business Process SDK.
                </p>
            </motion.header>
            <BusinessProcessStats stats={businessProcess.stats} />
            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === tab.id ? "bg-sky-600 text-white" : "border border-slate-200 text-slate-600 hover:border-sky-300 dark:border-slate-800 dark:text-slate-300"}`}>{tab.label}</button>
                ))}
            </div>
            {activeTab === BPF_TABS.overview ? <BusinessProcessOverviewPanel data={businessProcess} /> : null}
            {activeTab === BPF_TABS.processHubs ? <ProcessHubsPanel data={businessProcess} /> : null}
            {activeTab === BPF_TABS.businessProcesses ? <BusinessProcesssPanel data={businessProcess} /> : null}
            {activeTab === BPF_TABS.processCategories ? <ProcessCategorysPanel data={businessProcess} /> : null}
            {activeTab === BPF_TABS.processVersions ? <ProcessVersionsPanel data={businessProcess} /> : null}
            {activeTab === BPF_TABS.processDependencies ? <ProcessDependencysPanel data={businessProcess} /> : null}
            {activeTab === BPF_TABS.processModels ? <ProcessModelsPanel data={businessProcess} /> : null}
            {activeTab === BPF_TABS.processSteps ? <ProcessStepsPanel data={businessProcess} /> : null}
            {activeTab === BPF_TABS.decisionPoints ? <DecisionPointsPanel data={businessProcess} /> : null}
            {activeTab === BPF_TABS.reusableBlocks ? <ReusableBlocksPanel data={businessProcess} /> : null}
            {activeTab === BPF_TABS.approvalRules ? <ApprovalRulesPanel data={businessProcess} /> : null}
            {activeTab === BPF_TABS.sequentialApprovals ? <SequentialApprovalsPanel data={businessProcess} /> : null}
            {activeTab === BPF_TABS.parallelApprovals ? <ParallelApprovalsPanel data={businessProcess} /> : null}
            {activeTab === BPF_TABS.escalationRules ? <EscalationRulesPanel data={businessProcess} /> : null}
            {activeTab === BPF_TABS.taskAssignments ? <TaskAssignmentsPanel data={businessProcess} /> : null}
            {activeTab === BPF_TABS.taskTemplates ? <TaskTemplatesPanel data={businessProcess} /> : null}
            {activeTab === BPF_TABS.recurringTasks ? <RecurringTasksPanel data={businessProcess} /> : null}
            {activeTab === BPF_TABS.taskSlaPolicies ? <TaskSlaPolicysPanel data={businessProcess} /> : null}
            {activeTab === BPF_TABS.ruleConditions ? <RuleConditionsPanel data={businessProcess} /> : null}
            {activeTab === BPF_TABS.ruleValidations ? <RuleValidationsPanel data={businessProcess} /> : null}
            {activeTab === BPF_TABS.ruleCalculations ? <RuleCalculationsPanel data={businessProcess} /> : null}
            {activeTab === BPF_TABS.reusableRules ? <ReusableRulesPanel data={businessProcess} /> : null}
            {activeTab === BPF_TABS.processExecutions ? <ProcessExecutionsPanel data={businessProcess} /> : null}
            {activeTab === BPF_TABS.executionHistory ? <ExecutionHistorysPanel data={businessProcess} /> : null}
            {activeTab === BPF_TABS.executionRetries ? <ExecutionRetrysPanel data={businessProcess} /> : null}
            {activeTab === BPF_TABS.executionAnalytics ? <ExecutionAnalyticssPanel data={businessProcess} /> : null}
            {activeTab === BPF_TABS.bottleneckReports ? <BottleneckReportsPanel data={businessProcess} /> : null}
            {activeTab === BPF_TABS.slaPerformanceMetrics ? <SlaPerformanceMetricsPanel data={businessProcess} /> : null}
            {activeTab === BPF_TABS.processMetrics ? <ProcessMetricsPanel data={businessProcess} /> : null}
            {activeTab === BPF_TABS.processHealth ? <ProcessHealthsPanel data={businessProcess} /> : null}
            {activeTab === BPF_TABS.failedProcessRecords ? <FailedProcessRecordsPanel data={businessProcess} /> : null}
            {activeTab === BPF_TABS.processFailures ? <ProcessFailuresPanel data={businessProcess} /> : null}
            {activeTab === BPF_TABS.auditLogs ? <BusinessProcessAuditLogsPanel data={businessProcess} /> : null}
            {activeTab === BPF_TABS.api ? <BusinessProcessSdkPanel data={businessProcess} /> : null}
        </div>
    );
}
