"use client";

import { motion } from "framer-motion";
import { Bot, Plus } from "lucide-react";
import { useState } from "react";
import { Card } from "@/src/components/ui/Card";
import { LoadingState } from "@/src/components/ui/LoadingState";
import { AgentForm } from "@/src/modules/automation/components/AgentForm";
import { AgentTable } from "@/src/modules/automation/components/AgentTable";
import { AutomationAnalyticsPanel } from "@/src/modules/automation/components/AutomationAnalyticsPanel";
import { AutomationFilters } from "@/src/modules/automation/components/AutomationFilters";
import { AutomationLogTable } from "@/src/modules/automation/components/AutomationLogTable";
import { AutomationMonitoring } from "@/src/modules/automation/components/AutomationMonitoring";
import { AutomationStats } from "@/src/modules/automation/components/AutomationStats";
import { ExecutionTable } from "@/src/modules/automation/components/ExecutionTable";
import { TemplateTable } from "@/src/modules/automation/components/TemplateTable";
import { WorkflowDetailPanel } from "@/src/modules/automation/components/WorkflowDetailPanel";
import { WorkflowForm } from "@/src/modules/automation/components/WorkflowForm";
import { WorkflowTable } from "@/src/modules/automation/components/WorkflowTable";
import { AUTOMATION_TABS } from "@/src/modules/automation/constants";
import { useAutomation } from "@/src/modules/automation/hooks/useAutomation";
import type { AiAgentFormValues, WorkflowFormValues } from "@/src/modules/automation/schemas";

const tabs = [
    { id: AUTOMATION_TABS.overview, label: "Overview" },
    { id: AUTOMATION_TABS.builder, label: "Builder" },
    { id: AUTOMATION_TABS.agents, label: "Agents" },
    { id: AUTOMATION_TABS.templates, label: "Templates" },
    { id: AUTOMATION_TABS.executions, label: "Executions" },
    { id: AUTOMATION_TABS.logs, label: "Logs" },
    { id: AUTOMATION_TABS.monitoring, label: "Monitoring" },
    { id: AUTOMATION_TABS.analytics, label: "Analytics" },
] as const;

export function AutomationPage() {
    const {
        workflows,
        allWorkflows,
        agents,
        templates,
        executions,
        logs,
        stats,
        analytics,
        selectedWorkflow,
        loading,
        searchQuery,
        statusFilter,
        setSearchQuery,
        setStatusFilter,
        selectWorkflow,
        createAgent,
        createWorkflow,
        updateWorkflowStatus,
        runWorkflow,
    } = useAutomation();

    const [activeTab, setActiveTab] = useState<(typeof AUTOMATION_TABS)[keyof typeof AUTOMATION_TABS]>(AUTOMATION_TABS.overview);
    const [showWorkflowForm, setShowWorkflowForm] = useState(false);
    const [showAgentForm, setShowAgentForm] = useState(false);

    const handleCreateWorkflow = async (values: WorkflowFormValues) => {
        await createWorkflow({
            name: values.name,
            description: values.description,
            status: values.status,
            templateId: values.templateId || null,
            agentId: values.agentId || null,
            triggers: [{ triggerType: values.triggerType, eventName: values.eventName, isActive: true }],
            actions: [{ actionType: values.actionType, stepOrder: 1, agentId: values.agentId || null }],
            conditions: values.conditionField
                ? [{ field: values.conditionField, operator: values.conditionOperator ?? "equals", value: values.conditionValue ?? "" }]
                : [],
            schedules: values.cronExpression
                ? [{ cronExpression: values.cronExpression, timezone: values.timezone ?? "UTC", isActive: true }]
                : [],
        });
        setShowWorkflowForm(false);
        setActiveTab(AUTOMATION_TABS.builder);
    };

    const handleCreateAgent = async (values: AiAgentFormValues) => {
        await createAgent(values);
        setShowAgentForm(false);
    };

    if (loading) {
        return (
            <div className="mx-auto max-w-7xl">
                <LoadingState label="Loading automation and workflow data" />
            </div>
        );
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-slate-900 dark:text-slate-100">
            <motion.header
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80"
            >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-sm font-medium uppercase tracking-[0.24em] text-emerald-600">Automation Operations</p>
                        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Enterprise AI automation and workflow builder</h1>
                        <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                            Build workflows with triggers, actions, conditions, AI agents, scheduling, execution history, and operational analytics from one Supabase-backed workspace.
                        </p>
                    </div>
                </div>
            </motion.header>

            <AutomationStats stats={stats} />

            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === tab.id ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900" : "bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === AUTOMATION_TABS.overview ? (
                <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                    <WorkflowTable
                        workflows={allWorkflows.slice(0, 5)}
                        selectedWorkflowId={selectedWorkflow?.id}
                        onSelectWorkflow={(id) => void selectWorkflow(id)}
                        onRunWorkflow={(id) => void runWorkflow(id)}
                    />
                    <WorkflowDetailPanel workflow={selectedWorkflow} />
                </section>
            ) : null}

            {activeTab === AUTOMATION_TABS.builder ? (
                <>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={() => setShowWorkflowForm((current) => !current)}
                            className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 dark:hover:bg-emerald-950"
                        >
                            <Plus className="h-4 w-4" />
                            {showWorkflowForm ? "Hide Form" : "New Workflow"}
                        </button>
                    </div>
                    {showWorkflowForm ? (
                        <WorkflowForm agents={agents} templates={templates} onSubmit={handleCreateWorkflow} />
                    ) : null}
                    <AutomationFilters
                        searchQuery={searchQuery}
                        statusFilter={statusFilter}
                        onSearchChange={setSearchQuery}
                        onStatusChange={setStatusFilter}
                    />
                    <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                        <WorkflowTable
                            workflows={workflows}
                            selectedWorkflowId={selectedWorkflow?.id}
                            onSelectWorkflow={(id) => void selectWorkflow(id)}
                            onRunWorkflow={(id) => void runWorkflow(id)}
                        />
                        <WorkflowDetailPanel
                            workflow={selectedWorkflow}
                            onStatusChange={(status) => selectedWorkflow ? void updateWorkflowStatus(selectedWorkflow.id, status) : undefined}
                        />
                    </section>
                </>
            ) : null}

            {activeTab === AUTOMATION_TABS.agents ? (
                <>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={() => setShowAgentForm((current) => !current)}
                            className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 dark:hover:bg-emerald-950"
                        >
                            <Plus className="h-4 w-4" />
                            {showAgentForm ? "Hide Form" : "New Agent"}
                        </button>
                    </div>
                    {showAgentForm ? <AgentForm onSubmit={handleCreateAgent} /> : null}
                    <AgentTable agents={agents} />
                </>
            ) : null}

            {activeTab === AUTOMATION_TABS.templates ? <TemplateTable templates={templates} /> : null}
            {activeTab === AUTOMATION_TABS.executions ? <ExecutionTable executions={executions} /> : null}
            {activeTab === AUTOMATION_TABS.logs ? <AutomationLogTable logs={logs} /> : null}
            {activeTab === AUTOMATION_TABS.monitoring ? (
                <AutomationMonitoring stats={stats} workflows={allWorkflows} executions={executions} />
            ) : null}
            {activeTab === AUTOMATION_TABS.analytics ? <AutomationAnalyticsPanel analytics={analytics} /> : null}

            {allWorkflows.length === 0 && agents.length === 0 ? (
                <Card hover>
                    <div className="flex items-center gap-3">
                        <Bot className="h-5 w-5 text-emerald-600" />
                        <p className="text-sm text-slate-500 dark:text-slate-400">Create your first workflow or AI agent to populate the automation workspace.</p>
                    </div>
                </Card>
            ) : null}
        </div>
    );
}
