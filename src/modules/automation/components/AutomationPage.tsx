"use client";

import { useState } from "react";
import { PageTransition } from "@/src/design-os/motion/components/PageTransition";
import { Badge } from "@/src/design-os/components/Badge";
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
import { LoadingState } from "@/src/components/ui/LoadingState";

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
        const actionConfig: Record<string, unknown> =
            values.actionType === "webhook"
                ? {
                        ...(values.actionUrl?.trim() ? { url: values.actionUrl.trim() } : {}),
                        ...(values.webhookName?.trim() ? { webhookName: values.webhookName.trim() } : {}),
                        ...(values.actionEvent?.trim() ? { event: values.actionEvent.trim() } : {}),
                    }
                : values.actionType === "notify" || values.actionType === "create_task"
                  ? {
                        ...((values.actionType === "notify"
                            ? { message: values.actionMessage?.trim() }
                            : { title: values.actionMessage?.trim() }) as Record<string, unknown>),
                    }
                  : {};
        await createWorkflow({
            name: values.name,
            description: values.description,
            status: values.status,
            templateId: values.templateId || null,
            agentId: values.agentId || null,
            triggers: [{ triggerType: values.triggerType, eventName: values.eventName, isActive: true }],
            actions: [{ actionType: values.actionType, stepOrder: 1, agentId: values.agentId || null, config: actionConfig }],
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
        return <LoadingState label="Loading automation systems" />;
    }

    return (
        <PageTransition className="mx-auto max-w-[85rem] space-y-10">
            <header className="flex flex-col gap-4 border-b border-[var(--dos-border-subtle)] pb-8">
                <Badge variant="info" className="w-fit">Automation OS Engine</Badge>
                <div>
                    <h1 className="dos-text-display">Automation Control</h1>
                    <p className="mt-4 max-w-3xl dos-text-h3 text-[var(--dos-text-secondary)]">
                        Intelligent workflow orchestration, AI agent management, and real-time execution monitoring.
                    </p>
                </div>
            </header>

            <AutomationStats stats={stats} />

            <nav className="flex flex-wrap gap-2 border-b border-[var(--dos-border-subtle)] pb-4">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`rounded-full px-5 py-2 text-sm font-semibold transition ${activeTab === tab.id ? "bg-[var(--dos-text-primary)] text-[var(--dos-surface)]" : "text-[var(--dos-text-secondary)] hover:bg-[var(--dos-surface-tertiary)] hover:text-[var(--dos-text-primary)]"}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>

            <section className="min-h-[60vh] rounded-[var(--dos-radius-2xl)] bg-[var(--dos-surface-secondary)]/50 p-8">
                {activeTab === AUTOMATION_TABS.overview ? (
                    <section className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
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
                    <div className="space-y-6">
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => setShowWorkflowForm((current) => !current)}
                                className="rounded-full bg-[var(--dos-text-primary)] px-5 py-2 text-sm font-semibold text-[var(--dos-surface)]"
                            >
                                {showWorkflowForm ? "Close Builder" : "New Workflow"}
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
                        <section className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
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
                    </div>
                ) : null}

                {activeTab === AUTOMATION_TABS.agents ? (
                    <div className="space-y-6">
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => setShowAgentForm((current) => !current)}
                                className="rounded-full bg-[var(--dos-text-primary)] px-5 py-2 text-sm font-semibold text-[var(--dos-surface)]"
                            >
                                {showAgentForm ? "Close Form" : "New Agent"}
                            </button>
                        </div>
                        {showAgentForm ? <AgentForm onSubmit={handleCreateAgent} /> : null}
                        <AgentTable agents={agents} />
                    </div>
                ) : null}

                {activeTab === AUTOMATION_TABS.templates ? <TemplateTable templates={templates} /> : null}
                {activeTab === AUTOMATION_TABS.executions ? <ExecutionTable executions={executions} /> : null}
                {activeTab === AUTOMATION_TABS.logs ? <AutomationLogTable logs={logs} /> : null}
                {activeTab === AUTOMATION_TABS.monitoring ? (
                    <AutomationMonitoring stats={stats} workflows={allWorkflows} executions={executions} />
                ) : null}
                {activeTab === AUTOMATION_TABS.analytics ? <AutomationAnalyticsPanel analytics={analytics} /> : null}
            </section>
        </PageTransition>
    );
}
