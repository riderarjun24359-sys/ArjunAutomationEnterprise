"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/src/components/ui/card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { DWE_THEME, RELEASE_CHANNEL_OPTIONS, ALERT_SEVERITY_OPTIONS } from "@/src/modules/workflow-engine/constants";
import type { useWorkflowEngine } from "@/src/modules/workflow-engine/hooks/useWorkflowEngine";
import {
    workflowHubsFormSchema,
    type workflowHubsFormValues,
    workflowDefinitionsFormSchema,
    type workflowDefinitionsFormValues,
    workflowCategoriesFormSchema,
    type workflowCategoriesFormValues,
    workflowTemplatesFormSchema,
    type workflowTemplatesFormValues,
    workflowVersionsFormSchema,
    type workflowVersionsFormValues,
    workflowNodesFormSchema,
    type workflowNodesFormValues,
    workflowTransitionsFormSchema,
    type workflowTransitionsFormValues,
    decisionNodesFormSchema,
    type decisionNodesFormValues,
    reusableSubflowsFormSchema,
    type reusableSubflowsFormValues,
    workflowExecutionsFormSchema,
    type workflowExecutionsFormValues,
    executionHistoryFormSchema,
    type executionHistoryFormValues,
    executionRetriesFormSchema,
    type executionRetriesFormValues,
    executionRollbacksFormSchema,
    type executionRollbacksFormValues,
    timeTriggersFormSchema,
    type timeTriggersFormValues,
    businessEventTriggersFormSchema,
    type businessEventTriggersFormValues,
    webhookTriggersFormSchema,
    type webhookTriggersFormValues,
    scheduledTriggersFormSchema,
    type scheduledTriggersFormValues,
    manualReviewsFormSchema,
    type manualReviewsFormValues,
    approvalTasksFormSchema,
    type approvalTasksFormValues,
    escalationRulesFormSchema,
    type escalationRulesFormValues,
    slaTrackingsFormSchema,
    type slaTrackingsFormValues,
    automationNotificationsFormSchema,
    type automationNotificationsFormValues,
    automationApiCallsFormSchema,
    type automationApiCallsFormValues,
    automationIntegrationsFormSchema,
    type automationIntegrationsFormValues,
    executionAnalyticsFormSchema,
    type executionAnalyticsFormValues,
    bottleneckReportsFormSchema,
    type bottleneckReportsFormValues,
    slaComplianceMetricsFormSchema,
    type slaComplianceMetricsFormValues,
    workflowMetricsFormSchema,
    type workflowMetricsFormValues,
    workflowHealthFormSchema,
    type workflowHealthFormValues,
    failedExecutionsFormSchema,
    type failedExecutionsFormValues,
    workflowFailuresFormSchema,
    type workflowFailuresFormValues,
} from "@/src/modules/workflow-engine/schemas";

type WorkflowEngineData = ReturnType<typeof useWorkflowEngine>;
const inputClass = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-indigo-500/20 focus:ring-4 dark:border-slate-800 dark:bg-slate-950";
function SaveButton({ loading, label = "Save changes" }: { loading?: boolean; label?: string }) {
    return <button type="submit" disabled={loading} className="rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-60">{loading ? "Saving..." : label}</button>;
}
function ListCard({ title, subtitle, meta }: { title: string; subtitle: string; meta?: string }) {
    return <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800"><p className="font-medium">{title}</p><p className="text-sm text-slate-500">{subtitle}</p>{meta ? <p className="mt-1 text-xs text-indigo-600">{meta}</p> : null}</div>;
}
function WorkflowHubSelect({ data, ...props }: { data: WorkflowEngineData } & React.SelectHTMLAttributes<HTMLSelectElement>) {
    return <select {...props} className={inputClass}><option value="">Select workflow engine</option>{data.workflowHubOptions.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>;
}

export function WorkflowEngineOverviewPanel({ data }: { data: WorkflowEngineData }) {
    const pipeline = data.pipeline;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="Workflow Engine summary" description="System health, background jobs, event bus, failedExecutions, feature flags, configuration, diagnostics, and operations dashboard" /><div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ListCard title="Workflow Hubs" subtitle={`${data.stats?.totalWorkflowHubs ?? 0} total`} meta={`${data.stats?.activeWorkflowHubs ?? 0} active • ${data.stats?.workflowNodeCount ?? 0} workflow nodes`} />
                <ListCard title="Connectors" subtitle={`${data.stats?.escalationRuleCount ?? 0} escalation rules`} meta={`${data.stats?.workflowExecutionCount ?? 0} workflow executions • ${data.stats?.openFailedExecutionCount ?? 0} open failed executions`} />
                <ListCard title="Health" subtitle={`${(data.stats?.overallWorkflowScore ?? 0).toFixed(1)} overall workflow score`} meta={`${data.stats?.openFailureCount ?? 0} open failures`} />
                <ListCard title="Audit Trail" subtitle={`${data.stats?.auditCount ?? 0} audit entries`} meta="Security-first workflow engine" />
            </div></Card>
            <Card hover><SectionHeader title="Workflow engine pipeline" description={`${pipeline?.previousStage ?? "configured"} → ${pipeline?.currentStage ?? "active"} → ${pipeline?.nextStage ?? "degraded"}`} /><div className="mt-6 space-y-3">
                {pipeline?.stages?.length ? pipeline.stages.map((stage) => (
                    <ListCard key={stage.key} title={stage.label} subtitle={stage.key} meta={stage.label} />
                )) : <EmptyState title="No pipeline data" description="Workflow engine pipeline stages will appear as hubs are configured." />}
            </div></Card>
        </div>
    );
}

export function WorkflowHubsPanel({ data }: { data: WorkflowEngineData }) {
    const form = useForm<workflowHubsFormValues>({ resolver: zodResolver(workflowHubsFormSchema), defaultValues: {"hubKey":"","hubName":"","environment":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Workflow Hubs" description="Enterprise workflow engine workflow hubs" /><div className="mt-6 space-y-3">
                {data.workflowHubs.length === 0 ? <EmptyState title="No workflow hubs" description="Create the first workflow hubs record." /> : data.workflowHubs.map((item) => (
                    <ListCard key={item.id} title={String(item.hubName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.hubKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create workflow hubs" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createWorkflowHub(v))}>
                <input {...form.register("hubKey")} placeholder="hubKey" className={inputClass} />
                <input {...form.register("hubName")} placeholder="hubName" className={inputClass} />
                <input {...form.register("environment")} placeholder="environment" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function WorkflowDefinitionsPanel({ data }: { data: WorkflowEngineData }) {
    const form = useForm<workflowDefinitionsFormValues>({ resolver: zodResolver(workflowDefinitionsFormSchema), defaultValues: {"workflowHubId":"","workflowKey":"","workflowName":"","workflowType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Workflow Definitions" description="Enterprise workflow engine workflow definitions" /><div className="mt-6 space-y-3">
                {data.workflowDefinitions.length === 0 ? <EmptyState title="No workflow definitions" description="Create the first workflow definitions record." /> : data.workflowDefinitions.map((item) => (
                    <ListCard key={item.id} title={String(item.workflowName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.workflowType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create workflow definitions" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createWorkflowDefinition(v))}>
                <WorkflowHubSelect data={data} {...form.register("workflowHubId")} />
                <input {...form.register("workflowKey")} placeholder="workflowKey" className={inputClass} />
                <input {...form.register("workflowName")} placeholder="workflowName" className={inputClass} />
                <input {...form.register("workflowType")} placeholder="workflowType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function WorkflowCategorysPanel({ data }: { data: WorkflowEngineData }) {
    const form = useForm<workflowCategoriesFormValues>({ resolver: zodResolver(workflowCategoriesFormSchema), defaultValues: {"workflowHubId":"","categoryKey":"","categoryName":"","categoryType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Workflow Categories" description="Enterprise workflow engine workflow categories" /><div className="mt-6 space-y-3">
                {data.workflowCategories.length === 0 ? <EmptyState title="No workflow categories" description="Create the first workflow categories record." /> : data.workflowCategories.map((item) => (
                    <ListCard key={item.id} title={String(item.categoryName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.categoryType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create workflow categories" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createWorkflowCategory(v))}>
                <WorkflowHubSelect data={data} {...form.register("workflowHubId")} />
                <input {...form.register("categoryKey")} placeholder="categoryKey" className={inputClass} />
                <input {...form.register("categoryName")} placeholder="categoryName" className={inputClass} />
                <input {...form.register("categoryType")} placeholder="categoryType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function WorkflowTemplatesPanel({ data }: { data: WorkflowEngineData }) {
    const form = useForm<workflowTemplatesFormValues>({ resolver: zodResolver(workflowTemplatesFormSchema), defaultValues: {"workflowHubId":"","templateKey":"","templateName":"","templateType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Workflow Templates" description="Enterprise workflow engine workflow templates" /><div className="mt-6 space-y-3">
                {data.workflowTemplates.length === 0 ? <EmptyState title="No workflow templates" description="Create the first workflow templates record." /> : data.workflowTemplates.map((item) => (
                    <ListCard key={item.id} title={String(item.templateName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.templateType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create workflow templates" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createWorkflowTemplate(v))}>
                <WorkflowHubSelect data={data} {...form.register("workflowHubId")} />
                <input {...form.register("templateKey")} placeholder="templateKey" className={inputClass} />
                <input {...form.register("templateName")} placeholder="templateName" className={inputClass} />
                <input {...form.register("templateType")} placeholder="templateType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function WorkflowVersionsPanel({ data }: { data: WorkflowEngineData }) {
    const form = useForm<workflowVersionsFormValues>({ resolver: zodResolver(workflowVersionsFormSchema), defaultValues: {"workflowHubId":"","versionKey":"","versionNumber":"","releaseChannel":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Workflow Versions" description="Enterprise workflow engine workflow versions" /><div className="mt-6 space-y-3">
                {data.workflowVersions.length === 0 ? <EmptyState title="No workflow versions" description="Create the first workflow versions record." /> : data.workflowVersions.map((item) => (
                    <ListCard key={item.id} title={String(item.versionNumber)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.releaseChannel}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create workflow versions" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createWorkflowVersion(v))}>
                <WorkflowHubSelect data={data} {...form.register("workflowHubId")} />
                <input {...form.register("versionKey")} placeholder="versionKey" className={inputClass} />
                <input {...form.register("versionNumber")} placeholder="versionNumber" className={inputClass} />
                <select {...form.register("releaseChannel")} className={inputClass}>{RELEASE_CHANNEL_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function WorkflowNodesPanel({ data }: { data: WorkflowEngineData }) {
    const form = useForm<workflowNodesFormValues>({ resolver: zodResolver(workflowNodesFormSchema), defaultValues: {"workflowHubId":"","nodeKey":"","nodeName":"","nodeType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Workflow Nodes" description="Enterprise workflow engine workflow nodes" /><div className="mt-6 space-y-3">
                {data.workflowNodes.length === 0 ? <EmptyState title="No workflow nodes" description="Create the first workflow nodes record." /> : data.workflowNodes.map((item) => (
                    <ListCard key={item.id} title={String(item.nodeName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.nodeType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create workflow nodes" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createWorkflowNode(v))}>
                <WorkflowHubSelect data={data} {...form.register("workflowHubId")} />
                <input {...form.register("nodeKey")} placeholder="nodeKey" className={inputClass} />
                <input {...form.register("nodeName")} placeholder="nodeName" className={inputClass} />
                <input {...form.register("nodeType")} placeholder="nodeType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function WorkflowTransitionsPanel({ data }: { data: WorkflowEngineData }) {
    const form = useForm<workflowTransitionsFormValues>({ resolver: zodResolver(workflowTransitionsFormSchema), defaultValues: {"workflowHubId":"","transitionKey":"","transitionName":"","sourceNodeRef":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Workflow Transitions" description="Enterprise workflow engine workflow transitions" /><div className="mt-6 space-y-3">
                {data.workflowTransitions.length === 0 ? <EmptyState title="No workflow transitions" description="Create the first workflow transitions record." /> : data.workflowTransitions.map((item) => (
                    <ListCard key={item.id} title={String(item.transitionName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.sourceNodeRef}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create workflow transitions" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createWorkflowTransition(v))}>
                <WorkflowHubSelect data={data} {...form.register("workflowHubId")} />
                <input {...form.register("transitionKey")} placeholder="transitionKey" className={inputClass} />
                <input {...form.register("transitionName")} placeholder="transitionName" className={inputClass} />
                <input {...form.register("sourceNodeRef")} placeholder="sourceNodeRef" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function DecisionNodesPanel({ data }: { data: WorkflowEngineData }) {
    const form = useForm<decisionNodesFormValues>({ resolver: zodResolver(decisionNodesFormSchema), defaultValues: {"workflowHubId":"","decisionKey":"","decisionName":"","decisionExpression":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Decision Nodes" description="Enterprise workflow engine decision nodes" /><div className="mt-6 space-y-3">
                {data.decisionNodes.length === 0 ? <EmptyState title="No decision nodes" description="Create the first decision nodes record." /> : data.decisionNodes.map((item) => (
                    <ListCard key={item.id} title={String(item.decisionName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.decisionExpression}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create decision nodes" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDecisionNode(v))}>
                <WorkflowHubSelect data={data} {...form.register("workflowHubId")} />
                <input {...form.register("decisionKey")} placeholder="decisionKey" className={inputClass} />
                <input {...form.register("decisionName")} placeholder="decisionName" className={inputClass} />
                <input {...form.register("decisionExpression")} placeholder="decisionExpression" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ReusableSubflowsPanel({ data }: { data: WorkflowEngineData }) {
    const form = useForm<reusableSubflowsFormValues>({ resolver: zodResolver(reusableSubflowsFormSchema), defaultValues: {"workflowHubId":"","subflowKey":"","subflowName":"","subflowType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Reusable Subflows" description="Enterprise workflow engine reusable subflows" /><div className="mt-6 space-y-3">
                {data.reusableSubflows.length === 0 ? <EmptyState title="No reusable subflows" description="Create the first reusable subflows record." /> : data.reusableSubflows.map((item) => (
                    <ListCard key={item.id} title={String(item.subflowName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.subflowType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create reusable subflows" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createReusableSubflow(v))}>
                <WorkflowHubSelect data={data} {...form.register("workflowHubId")} />
                <input {...form.register("subflowKey")} placeholder="subflowKey" className={inputClass} />
                <input {...form.register("subflowName")} placeholder="subflowName" className={inputClass} />
                <input {...form.register("subflowType")} placeholder="subflowType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function WorkflowExecutionsPanel({ data }: { data: WorkflowEngineData }) {
    const form = useForm<workflowExecutionsFormValues>({ resolver: zodResolver(workflowExecutionsFormSchema), defaultValues: {"workflowHubId":"","executionKey":"","executionName":"","executionStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Workflow Executions" description="Enterprise workflow engine workflow executions" /><div className="mt-6 space-y-3">
                {data.workflowExecutions.length === 0 ? <EmptyState title="No workflow executions" description="Create the first workflow executions record." /> : data.workflowExecutions.map((item) => (
                    <ListCard key={item.id} title={String(item.executionName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.executionStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create workflow executions" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createWorkflowExecution(v))}>
                <WorkflowHubSelect data={data} {...form.register("workflowHubId")} />
                <input {...form.register("executionKey")} placeholder="executionKey" className={inputClass} />
                <input {...form.register("executionName")} placeholder="executionName" className={inputClass} />
                <input {...form.register("executionStatus")} placeholder="executionStatus" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ExecutionHistorysPanel({ data }: { data: WorkflowEngineData }) {
    const form = useForm<executionHistoryFormValues>({ resolver: zodResolver(executionHistoryFormSchema), defaultValues: {"workflowHubId":"","historyKey":"","historyType":"","historySummary":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Execution History" description="Enterprise workflow engine execution history" /><div className="mt-6 space-y-3">
                {data.executionHistory.length === 0 ? <EmptyState title="No execution history" description="Create the first execution history record." /> : data.executionHistory.map((item) => (
                    <ListCard key={item.id} title={String(item.historyKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.historyType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create execution history" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createExecutionHistory(v))}>
                <WorkflowHubSelect data={data} {...form.register("workflowHubId")} />
                <input {...form.register("historyKey")} placeholder="historyKey" className={inputClass} />
                <input {...form.register("historyType")} placeholder="historyType" className={inputClass} />
                <input {...form.register("historySummary")} placeholder="historySummary" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ExecutionRetrysPanel({ data }: { data: WorkflowEngineData }) {
    const form = useForm<executionRetriesFormValues>({ resolver: zodResolver(executionRetriesFormSchema), defaultValues: {"workflowHubId":"","retryKey":"","retryCount":0,"retryStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Execution Retries" description="Enterprise workflow engine execution retries" /><div className="mt-6 space-y-3">
                {data.executionRetries.length === 0 ? <EmptyState title="No execution retries" description="Create the first execution retries record." /> : data.executionRetries.map((item) => (
                    <ListCard key={item.id} title={String(item.retryKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.retryStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create execution retries" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createExecutionRetry(v))}>
                <WorkflowHubSelect data={data} {...form.register("workflowHubId")} />
                <input {...form.register("retryKey")} placeholder="retryKey" className={inputClass} />
                <input type="number" step="any" {...form.register("retryCount", { valueAsNumber: true })} placeholder="retryCount" className={inputClass} />
                <input {...form.register("retryStatus")} placeholder="retryStatus" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ExecutionRollbacksPanel({ data }: { data: WorkflowEngineData }) {
    const form = useForm<executionRollbacksFormValues>({ resolver: zodResolver(executionRollbacksFormSchema), defaultValues: {"workflowHubId":"","rollbackKey":"","rollbackReason":"","rollbackStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Execution Rollbacks" description="Enterprise workflow engine execution rollbacks" /><div className="mt-6 space-y-3">
                {data.executionRollbacks.length === 0 ? <EmptyState title="No execution rollbacks" description="Create the first execution rollbacks record." /> : data.executionRollbacks.map((item) => (
                    <ListCard key={item.id} title={String(item.rollbackKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.rollbackStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create execution rollbacks" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createExecutionRollback(v))}>
                <WorkflowHubSelect data={data} {...form.register("workflowHubId")} />
                <input {...form.register("rollbackKey")} placeholder="rollbackKey" className={inputClass} />
                <input {...form.register("rollbackReason")} placeholder="rollbackReason" className={inputClass} />
                <input {...form.register("rollbackStatus")} placeholder="rollbackStatus" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function TimeTriggersPanel({ data }: { data: WorkflowEngineData }) {
    const form = useForm<timeTriggersFormValues>({ resolver: zodResolver(timeTriggersFormSchema), defaultValues: {"workflowHubId":"","triggerKey":"","triggerName":"","cronExpression":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Time Triggers" description="Enterprise workflow engine time triggers" /><div className="mt-6 space-y-3">
                {data.timeTriggers.length === 0 ? <EmptyState title="No time triggers" description="Create the first time triggers record." /> : data.timeTriggers.map((item) => (
                    <ListCard key={item.id} title={String(item.triggerName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.cronExpression}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create time triggers" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createTimeTrigger(v))}>
                <WorkflowHubSelect data={data} {...form.register("workflowHubId")} />
                <input {...form.register("triggerKey")} placeholder="triggerKey" className={inputClass} />
                <input {...form.register("triggerName")} placeholder="triggerName" className={inputClass} />
                <input {...form.register("cronExpression")} placeholder="cronExpression" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function BusinessEventTriggersPanel({ data }: { data: WorkflowEngineData }) {
    const form = useForm<businessEventTriggersFormValues>({ resolver: zodResolver(businessEventTriggersFormSchema), defaultValues: {"workflowHubId":"","triggerKey":"","triggerName":"","eventType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Business Event Triggers" description="Enterprise workflow engine business event triggers" /><div className="mt-6 space-y-3">
                {data.businessEventTriggers.length === 0 ? <EmptyState title="No business event triggers" description="Create the first business event triggers record." /> : data.businessEventTriggers.map((item) => (
                    <ListCard key={item.id} title={String(item.triggerName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.eventType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create business event triggers" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createBusinessEventTrigger(v))}>
                <WorkflowHubSelect data={data} {...form.register("workflowHubId")} />
                <input {...form.register("triggerKey")} placeholder="triggerKey" className={inputClass} />
                <input {...form.register("triggerName")} placeholder="triggerName" className={inputClass} />
                <input {...form.register("eventType")} placeholder="eventType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function WebhookTriggersPanel({ data }: { data: WorkflowEngineData }) {
    const form = useForm<webhookTriggersFormValues>({ resolver: zodResolver(webhookTriggersFormSchema), defaultValues: {"workflowHubId":"","triggerKey":"","triggerName":"","webhookUrl":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Webhook Triggers" description="Enterprise workflow engine webhook triggers" /><div className="mt-6 space-y-3">
                {data.webhookTriggers.length === 0 ? <EmptyState title="No webhook triggers" description="Create the first webhook triggers record." /> : data.webhookTriggers.map((item) => (
                    <ListCard key={item.id} title={String(item.triggerName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.webhookUrl}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create webhook triggers" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createWebhookTrigger(v))}>
                <WorkflowHubSelect data={data} {...form.register("workflowHubId")} />
                <input {...form.register("triggerKey")} placeholder="triggerKey" className={inputClass} />
                <input {...form.register("triggerName")} placeholder="triggerName" className={inputClass} />
                <input {...form.register("webhookUrl")} placeholder="webhookUrl" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ScheduledTriggersPanel({ data }: { data: WorkflowEngineData }) {
    const form = useForm<scheduledTriggersFormValues>({ resolver: zodResolver(scheduledTriggersFormSchema), defaultValues: {"workflowHubId":"","triggerKey":"","triggerName":"","scheduleType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Scheduled Triggers" description="Enterprise workflow engine scheduled triggers" /><div className="mt-6 space-y-3">
                {data.scheduledTriggers.length === 0 ? <EmptyState title="No scheduled triggers" description="Create the first scheduled triggers record." /> : data.scheduledTriggers.map((item) => (
                    <ListCard key={item.id} title={String(item.triggerName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.scheduleType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create scheduled triggers" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createScheduledTrigger(v))}>
                <WorkflowHubSelect data={data} {...form.register("workflowHubId")} />
                <input {...form.register("triggerKey")} placeholder="triggerKey" className={inputClass} />
                <input {...form.register("triggerName")} placeholder="triggerName" className={inputClass} />
                <input {...form.register("scheduleType")} placeholder="scheduleType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ManualReviewsPanel({ data }: { data: WorkflowEngineData }) {
    const form = useForm<manualReviewsFormValues>({ resolver: zodResolver(manualReviewsFormSchema), defaultValues: {"workflowHubId":"","reviewKey":"","reviewName":"","reviewStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Manual Reviews" description="Enterprise workflow engine manual reviews" /><div className="mt-6 space-y-3">
                {data.manualReviews.length === 0 ? <EmptyState title="No manual reviews" description="Create the first manual reviews record." /> : data.manualReviews.map((item) => (
                    <ListCard key={item.id} title={String(item.reviewName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.reviewStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create manual reviews" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createManualReview(v))}>
                <WorkflowHubSelect data={data} {...form.register("workflowHubId")} />
                <input {...form.register("reviewKey")} placeholder="reviewKey" className={inputClass} />
                <input {...form.register("reviewName")} placeholder="reviewName" className={inputClass} />
                <input {...form.register("reviewStatus")} placeholder="reviewStatus" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ApprovalTasksPanel({ data }: { data: WorkflowEngineData }) {
    const form = useForm<approvalTasksFormValues>({ resolver: zodResolver(approvalTasksFormSchema), defaultValues: {"workflowHubId":"","taskKey":"","taskName":"","taskStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Approval Tasks" description="Enterprise workflow engine approval tasks" /><div className="mt-6 space-y-3">
                {data.approvalTasks.length === 0 ? <EmptyState title="No approval tasks" description="Create the first approval tasks record." /> : data.approvalTasks.map((item) => (
                    <ListCard key={item.id} title={String(item.taskName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.taskStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create approval tasks" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createApprovalTask(v))}>
                <WorkflowHubSelect data={data} {...form.register("workflowHubId")} />
                <input {...form.register("taskKey")} placeholder="taskKey" className={inputClass} />
                <input {...form.register("taskName")} placeholder="taskName" className={inputClass} />
                <input {...form.register("taskStatus")} placeholder="taskStatus" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function EscalationRulesPanel({ data }: { data: WorkflowEngineData }) {
    const form = useForm<escalationRulesFormValues>({ resolver: zodResolver(escalationRulesFormSchema), defaultValues: {"workflowHubId":"","ruleKey":"","ruleName":"","escalationLevel":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Escalation Rules" description="Enterprise workflow engine escalation rules" /><div className="mt-6 space-y-3">
                {data.escalationRules.length === 0 ? <EmptyState title="No escalation rules" description="Create the first escalation rules record." /> : data.escalationRules.map((item) => (
                    <ListCard key={item.id} title={String(item.ruleName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.escalationLevel}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create escalation rules" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createEscalationRule(v))}>
                <WorkflowHubSelect data={data} {...form.register("workflowHubId")} />
                <input {...form.register("ruleKey")} placeholder="ruleKey" className={inputClass} />
                <input {...form.register("ruleName")} placeholder="ruleName" className={inputClass} />
                <input type="number" step="any" {...form.register("escalationLevel", { valueAsNumber: true })} placeholder="escalationLevel" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function SlaTrackingsPanel({ data }: { data: WorkflowEngineData }) {
    const form = useForm<slaTrackingsFormValues>({ resolver: zodResolver(slaTrackingsFormSchema), defaultValues: {"workflowHubId":"","slaKey":"","slaName":"","targetMinutes":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Sla Trackings" description="Enterprise workflow engine sla trackings" /><div className="mt-6 space-y-3">
                {data.slaTrackings.length === 0 ? <EmptyState title="No sla trackings" description="Create the first sla trackings record." /> : data.slaTrackings.map((item) => (
                    <ListCard key={item.id} title={String(item.slaName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.targetMinutes}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create sla trackings" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createSlaTracking(v))}>
                <WorkflowHubSelect data={data} {...form.register("workflowHubId")} />
                <input {...form.register("slaKey")} placeholder="slaKey" className={inputClass} />
                <input {...form.register("slaName")} placeholder="slaName" className={inputClass} />
                <input type="number" step="any" {...form.register("targetMinutes", { valueAsNumber: true })} placeholder="targetMinutes" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function AutomationNotificationsPanel({ data }: { data: WorkflowEngineData }) {
    const form = useForm<automationNotificationsFormValues>({ resolver: zodResolver(automationNotificationsFormSchema), defaultValues: {"workflowHubId":"","notificationKey":"","notificationName":"","channel":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Automation Notifications" description="Enterprise workflow engine automation notifications" /><div className="mt-6 space-y-3">
                {data.automationNotifications.length === 0 ? <EmptyState title="No automation notifications" description="Create the first automation notifications record." /> : data.automationNotifications.map((item) => (
                    <ListCard key={item.id} title={String(item.notificationName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.channel}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create automation notifications" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createAutomationNotification(v))}>
                <WorkflowHubSelect data={data} {...form.register("workflowHubId")} />
                <input {...form.register("notificationKey")} placeholder="notificationKey" className={inputClass} />
                <input {...form.register("notificationName")} placeholder="notificationName" className={inputClass} />
                <input {...form.register("channel")} placeholder="channel" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function AutomationApiCallsPanel({ data }: { data: WorkflowEngineData }) {
    const form = useForm<automationApiCallsFormValues>({ resolver: zodResolver(automationApiCallsFormSchema), defaultValues: {"workflowHubId":"","apiKey":"","apiName":"","endpointUrl":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Automation Api Calls" description="Enterprise workflow engine automation api calls" /><div className="mt-6 space-y-3">
                {data.automationApiCalls.length === 0 ? <EmptyState title="No automation api calls" description="Create the first automation api calls record." /> : data.automationApiCalls.map((item) => (
                    <ListCard key={item.id} title={String(item.apiName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.endpointUrl}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create automation api calls" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createAutomationApiCall(v))}>
                <WorkflowHubSelect data={data} {...form.register("workflowHubId")} />
                <input {...form.register("apiKey")} placeholder="apiKey" className={inputClass} />
                <input {...form.register("apiName")} placeholder="apiName" className={inputClass} />
                <input {...form.register("endpointUrl")} placeholder="endpointUrl" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function AutomationIntegrationsPanel({ data }: { data: WorkflowEngineData }) {
    const form = useForm<automationIntegrationsFormValues>({ resolver: zodResolver(automationIntegrationsFormSchema), defaultValues: {"workflowHubId":"","integrationKey":"","integrationName":"","integrationType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Automation Integrations" description="Enterprise workflow engine automation integrations" /><div className="mt-6 space-y-3">
                {data.automationIntegrations.length === 0 ? <EmptyState title="No automation integrations" description="Create the first automation integrations record." /> : data.automationIntegrations.map((item) => (
                    <ListCard key={item.id} title={String(item.integrationName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.integrationType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create automation integrations" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createAutomationIntegration(v))}>
                <WorkflowHubSelect data={data} {...form.register("workflowHubId")} />
                <input {...form.register("integrationKey")} placeholder="integrationKey" className={inputClass} />
                <input {...form.register("integrationName")} placeholder="integrationName" className={inputClass} />
                <input {...form.register("integrationType")} placeholder="integrationType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ExecutionAnalyticssPanel({ data }: { data: WorkflowEngineData }) {
    const form = useForm<executionAnalyticsFormValues>({ resolver: zodResolver(executionAnalyticsFormSchema), defaultValues: {"workflowHubId":"","analyticsKey":"","analyticsType":"","analyticsScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Execution Analytics" description="Enterprise workflow engine execution analytics" /><div className="mt-6 space-y-3">
                {data.executionAnalytics.length === 0 ? <EmptyState title="No execution analytics" description="Create the first execution analytics record." /> : data.executionAnalytics.map((item) => (
                    <ListCard key={item.id} title={String(item.analyticsKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.analyticsType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create execution analytics" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createExecutionAnalytics(v))}>
                <WorkflowHubSelect data={data} {...form.register("workflowHubId")} />
                <input {...form.register("analyticsKey")} placeholder="analyticsKey" className={inputClass} />
                <input {...form.register("analyticsType")} placeholder="analyticsType" className={inputClass} />
                <input type="number" step="any" {...form.register("analyticsScore", { valueAsNumber: true })} placeholder="analyticsScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function BottleneckReportsPanel({ data }: { data: WorkflowEngineData }) {
    const form = useForm<bottleneckReportsFormValues>({ resolver: zodResolver(bottleneckReportsFormSchema), defaultValues: {"workflowHubId":"","reportKey":"","reportName":"","bottleneckScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Bottleneck Reports" description="Enterprise workflow engine bottleneck reports" /><div className="mt-6 space-y-3">
                {data.bottleneckReports.length === 0 ? <EmptyState title="No bottleneck reports" description="Create the first bottleneck reports record." /> : data.bottleneckReports.map((item) => (
                    <ListCard key={item.id} title={String(item.reportName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.bottleneckScore}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create bottleneck reports" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createBottleneckReport(v))}>
                <WorkflowHubSelect data={data} {...form.register("workflowHubId")} />
                <input {...form.register("reportKey")} placeholder="reportKey" className={inputClass} />
                <input {...form.register("reportName")} placeholder="reportName" className={inputClass} />
                <input type="number" step="any" {...form.register("bottleneckScore", { valueAsNumber: true })} placeholder="bottleneckScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function SlaComplianceMetricsPanel({ data }: { data: WorkflowEngineData }) {
    const form = useForm<slaComplianceMetricsFormValues>({ resolver: zodResolver(slaComplianceMetricsFormSchema), defaultValues: {"workflowHubId":"","metricKey":"","metricName":"","complianceRate":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Sla Compliance Metrics" description="Enterprise workflow engine sla compliance metrics" /><div className="mt-6 space-y-3">
                {data.slaComplianceMetrics.length === 0 ? <EmptyState title="No sla compliance metrics" description="Create the first sla compliance metrics record." /> : data.slaComplianceMetrics.map((item) => (
                    <ListCard key={item.id} title={String(item.metricName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.complianceRate}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create sla compliance metrics" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createSlaComplianceMetric(v))}>
                <WorkflowHubSelect data={data} {...form.register("workflowHubId")} />
                <input {...form.register("metricKey")} placeholder="metricKey" className={inputClass} />
                <input {...form.register("metricName")} placeholder="metricName" className={inputClass} />
                <input type="number" step="any" {...form.register("complianceRate", { valueAsNumber: true })} placeholder="complianceRate" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function WorkflowMetricsPanel({ data }: { data: WorkflowEngineData }) {
    const form = useForm<workflowMetricsFormValues>({ resolver: zodResolver(workflowMetricsFormSchema), defaultValues: {"metricsKey":"","executionCount":0,"overallWorkflowScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Workflow Metrics" description="Enterprise workflow engine workflow metrics" /><div className="mt-6 space-y-3">
                {data.workflowMetrics.length === 0 ? <EmptyState title="No workflow metrics" description="Create the first workflow metrics record." /> : data.workflowMetrics.map((item) => (
                    <ListCard key={item.id} title={String(item.metricsKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.overallWorkflowScore}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create workflow metrics" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createWorkflowMetric(v))}>
                <input {...form.register("metricsKey")} placeholder="metricsKey" className={inputClass} />
                <input type="number" step="any" {...form.register("executionCount", { valueAsNumber: true })} placeholder="executionCount" className={inputClass} />
                <input type="number" step="any" {...form.register("overallWorkflowScore", { valueAsNumber: true })} placeholder="overallWorkflowScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function WorkflowHealthsPanel({ data }: { data: WorkflowEngineData }) {
    const form = useForm<workflowHealthFormValues>({ resolver: zodResolver(workflowHealthFormSchema), defaultValues: {"healthKey":"","overallScore":0,"disasterRecoveryMode":false} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Workflow Health" description="Enterprise workflow engine workflow health" /><div className="mt-6 space-y-3">
                {data.workflowHealth.length === 0 ? <EmptyState title="No workflow health" description="Create the first workflow health record." /> : data.workflowHealth.map((item) => (
                    <ListCard key={item.id} title={String(item.healthKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.overallScore}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create workflow health" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createWorkflowHealth(v))}>
                <input {...form.register("healthKey")} placeholder="healthKey" className={inputClass} />
                <input type="number" step="any" {...form.register("overallScore", { valueAsNumber: true })} placeholder="overallScore" className={inputClass} />
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...form.register("disasterRecoveryMode")} /> disasterRecoveryMode</label>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function FailedExecutionsPanel({ data }: { data: WorkflowEngineData }) {
    const form = useForm<failedExecutionsFormValues>({ resolver: zodResolver(failedExecutionsFormSchema), defaultValues: {"workflowHubId":"","failureKey":"","executionRef":"","failureType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Failed Executions" description="Enterprise workflow engine failed executions" /><div className="mt-6 space-y-3">
                {data.failedExecutions.length === 0 ? <EmptyState title="No failed executions" description="Create the first failed executions record." /> : data.failedExecutions.map((item) => (
                    <ListCard key={item.id} title={String(item.failureKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.failureType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create failed executions" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createFailedExecution(v))}>
                <WorkflowHubSelect data={data} {...form.register("workflowHubId")} />
                <input {...form.register("failureKey")} placeholder="failureKey" className={inputClass} />
                <input {...form.register("executionRef")} placeholder="executionRef" className={inputClass} />
                <input {...form.register("failureType")} placeholder="failureType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function WorkflowFailuresPanel({ data }: { data: WorkflowEngineData }) {
    const form = useForm<workflowFailuresFormValues>({ resolver: zodResolver(workflowFailuresFormSchema), defaultValues: {"workflowHubId":"","failureKey":"","failureType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Workflow Failures" description="Enterprise workflow engine workflow failures" /><div className="mt-6 space-y-3">
                {data.workflowFailures.length === 0 ? <EmptyState title="No workflow failures" description="Create the first workflow failures record." /> : data.workflowFailures.map((item) => (
                    <ListCard key={item.id} title={String(item.failureKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.failureType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create workflow failures" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createWorkflowFailure(v))}>
                <WorkflowHubSelect data={data} {...form.register("workflowHubId")} />
                <input {...form.register("failureKey")} placeholder="failureKey" className={inputClass} />
                <input {...form.register("failureType")} placeholder="failureType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function WorkflowEngineAuditLogsPanel({ data }: { data: WorkflowEngineData }) {
    return (
        <Card hover><SectionHeader title="Workflow Engine audit history" description="Security-first audit trail for jobs, events, failedExecutions, and marketplace operations" /><div className="mt-6 space-y-3">
            {data.auditLogs.length === 0 ? <EmptyState title="No audit entries" description="Audit logs are created automatically for workflow engine." /> : data.auditLogs.map((entry) => (
                <ListCard key={entry.id} title={entry.summary} subtitle={`${entry.entityType} • ${entry.action}`} meta={`${entry.securityLevel} • ${new Date(entry.createdAt).toLocaleString()}`} />
            ))}
        </div></Card>
    );
}

export function WorkflowEngineSdkPanel({ data }: { data: WorkflowEngineData }) {
    return (
        <Card hover><SectionHeader title="Shared Workflow Engine SDK" description="Import from @/src/modules/workflow-engine/sdk for workflow registration, automation configuration, and workflow execution" /><div className="mt-6 space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <ListCard title="createWorkflowEngineClient()" subtitle="Factory for module-scoped Workflow Engine client with auth context" meta="Primary SDK for enterprise workflow engine" />
            <ListCard title="sdkRegisterWorkflow()" subtitle="Register workflow engine with AI orchestration" meta="moduleSource: dynamic_workflow_engine" />
            <ListCard title="sdkConfigureAutomation()" subtitle="Configure automation rule with knowledge context" meta="v1/v2/v3 API versions" />
            <ListCard title="sdkRunWorkflowExecution()" subtitle="Run workflow execution with audit trail" meta="Event-driven integration delivery" />
            <p className="text-xs text-slate-500">Theme: {DWE_THEME.primary} • Integration hubs loaded: {data.workflowHubs.length}</p>
            <pre className="overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">{`import { createWorkflowEngineClient } from "@/src/modules/workflow-engine/sdk";

const intg = createWorkflowEngineClient(userId, email, fullName);
await intg.registerWorkflow({ workflowHubId, serviceKey: "svc-001", serviceName: "Stripe" });
await intg.configureAutomation({ workflowHubId, keyName: "prod-key", apiVersion: "v1" });
await intg.runWorkflowExecution({ workflowHubId, webhookKey: "wh-001", webhookName: "Events" });`}</pre>
        </div></Card>
    );
}
