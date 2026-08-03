"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/src/components/ui/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { BPF_THEME, RELEASE_CHANNEL_OPTIONS, ALERT_SEVERITY_OPTIONS } from "@/src/modules/business-process/constants";
import type { useBusinessProcess } from "@/src/modules/business-process/hooks/useBusinessProcess";
import {
    processHubsFormSchema,
    type processHubsFormValues,
    businessProcessesFormSchema,
    type businessProcessesFormValues,
    processCategoriesFormSchema,
    type processCategoriesFormValues,
    processVersionsFormSchema,
    type processVersionsFormValues,
    processDependenciesFormSchema,
    type processDependenciesFormValues,
    processModelsFormSchema,
    type processModelsFormValues,
    processStepsFormSchema,
    type processStepsFormValues,
    decisionPointsFormSchema,
    type decisionPointsFormValues,
    reusableBlocksFormSchema,
    type reusableBlocksFormValues,
    approvalRulesFormSchema,
    type approvalRulesFormValues,
    sequentialApprovalsFormSchema,
    type sequentialApprovalsFormValues,
    parallelApprovalsFormSchema,
    type parallelApprovalsFormValues,
    escalationRulesFormSchema,
    type escalationRulesFormValues,
    taskAssignmentsFormSchema,
    type taskAssignmentsFormValues,
    taskTemplatesFormSchema,
    type taskTemplatesFormValues,
    recurringTasksFormSchema,
    type recurringTasksFormValues,
    taskSlaPoliciesFormSchema,
    type taskSlaPoliciesFormValues,
    ruleConditionsFormSchema,
    type ruleConditionsFormValues,
    ruleValidationsFormSchema,
    type ruleValidationsFormValues,
    ruleCalculationsFormSchema,
    type ruleCalculationsFormValues,
    reusableRulesFormSchema,
    type reusableRulesFormValues,
    processExecutionsFormSchema,
    type processExecutionsFormValues,
    executionHistoryFormSchema,
    type executionHistoryFormValues,
    executionRetriesFormSchema,
    type executionRetriesFormValues,
    executionAnalyticsFormSchema,
    type executionAnalyticsFormValues,
    bottleneckReportsFormSchema,
    type bottleneckReportsFormValues,
    slaPerformanceMetricsFormSchema,
    type slaPerformanceMetricsFormValues,
    processMetricsFormSchema,
    type processMetricsFormValues,
    processHealthFormSchema,
    type processHealthFormValues,
    failedProcessRecordsFormSchema,
    type failedProcessRecordsFormValues,
    processFailuresFormSchema,
    type processFailuresFormValues,
} from "@/src/modules/business-process/schemas";

type BusinessProcessData = ReturnType<typeof useBusinessProcess>;
const inputClass = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-sky-500/20 focus:ring-4 dark:border-slate-800 dark:bg-slate-950";
function SaveButton({ loading, label = "Save changes" }: { loading?: boolean; label?: string }) {
    return <button type="submit" disabled={loading} className="rounded-full bg-sky-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-sky-500 disabled:opacity-60">{loading ? "Saving..." : label}</button>;
}
function ListCard({ title, subtitle, meta }: { title: string; subtitle: string; meta?: string }) {
    return <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800"><p className="font-medium">{title}</p><p className="text-sm text-slate-500">{subtitle}</p>{meta ? <p className="mt-1 text-xs text-sky-600">{meta}</p> : null}</div>;
}
function ProcessHubSelect({ data, ...props }: { data: BusinessProcessData } & React.SelectHTMLAttributes<HTMLSelectElement>) {
    return <select {...props} className={inputClass}><option value="">Select business process</option>{data.processHubOptions.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>;
}

export function BusinessProcessOverviewPanel({ data }: { data: BusinessProcessData }) {
    const pipeline = data.pipeline;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="Business Process summary" description="System health, background jobs, event bus, failedProcessRecords, feature flags, configuration, diagnostics, and operations dashboard" /><div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ListCard title="Process Hubs" subtitle={`${data.stats?.totalProcessHubs ?? 0} total`} meta={`${data.stats?.activeProcessHubs ?? 0} active • ${data.stats?.taskTemplateCount ?? 0} task templates`} />
                <ListCard title="Connectors" subtitle={`${data.stats?.approvalRuleCount ?? 0} approval rules`} meta={`${data.stats?.processExecutionCount ?? 0} process executions • ${data.stats?.openFailedRecordCount ?? 0} open failed process records`} />
                <ListCard title="Health" subtitle={`${(data.stats?.overallProcessScore ?? 0).toFixed(1)} overall process score`} meta={`${data.stats?.openFailureCount ?? 0} open failures`} />
                <ListCard title="Audit Trail" subtitle={`${data.stats?.auditCount ?? 0} audit entries`} meta="Security-first business process" />
            </div></Card>
            <Card hover><SectionHeader title="Business process pipeline" description={`${pipeline?.previousStage ?? "configured"} → ${pipeline?.currentStage ?? "active"} → ${pipeline?.nextStage ?? "degraded"}`} /><div className="mt-6 space-y-3">
                {pipeline?.stages?.length ? pipeline.stages.map((stage) => (
                    <ListCard key={stage.key} title={stage.label} subtitle={stage.key} meta={stage.label} />
                )) : <EmptyState title="No pipeline data" description="Business process pipeline stages will appear as hubs are configured." />}
            </div></Card>
        </div>
    );
}

export function ProcessHubsPanel({ data }: { data: BusinessProcessData }) {
    const form = useForm<processHubsFormValues>({ resolver: zodResolver(processHubsFormSchema), defaultValues: {"hubKey":"","hubName":"","environment":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Process Hubs" description="Enterprise business process process hubs" /><div className="mt-6 space-y-3">
                {data.processHubs.length === 0 ? <EmptyState title="No process hubs" description="Create the first process hubs record." /> : data.processHubs.map((item) => (
                    <ListCard key={item.id} title={String(item.hubName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.hubKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create process hubs" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createProcessHub(v))}>
                <input {...form.register("hubKey")} placeholder="hubKey" className={inputClass} />
                <input {...form.register("hubName")} placeholder="hubName" className={inputClass} />
                <input {...form.register("environment")} placeholder="environment" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function BusinessProcesssPanel({ data }: { data: BusinessProcessData }) {
    const form = useForm<businessProcessesFormValues>({ resolver: zodResolver(businessProcessesFormSchema), defaultValues: {"processHubId":"","processKey":"","processName":"","processType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Business Processes" description="Enterprise business process business processes" /><div className="mt-6 space-y-3">
                {data.businessProcesses.length === 0 ? <EmptyState title="No business processes" description="Create the first business processes record." /> : data.businessProcesses.map((item) => (
                    <ListCard key={item.id} title={String(item.processName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.processType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create business processes" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createBusinessProcess(v))}>
                <ProcessHubSelect data={data} {...form.register("processHubId")} />
                <input {...form.register("processKey")} placeholder="processKey" className={inputClass} />
                <input {...form.register("processName")} placeholder="processName" className={inputClass} />
                <input {...form.register("processType")} placeholder="processType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ProcessCategorysPanel({ data }: { data: BusinessProcessData }) {
    const form = useForm<processCategoriesFormValues>({ resolver: zodResolver(processCategoriesFormSchema), defaultValues: {"processHubId":"","categoryKey":"","categoryName":"","categoryType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Process Categories" description="Enterprise business process process categories" /><div className="mt-6 space-y-3">
                {data.processCategories.length === 0 ? <EmptyState title="No process categories" description="Create the first process categories record." /> : data.processCategories.map((item) => (
                    <ListCard key={item.id} title={String(item.categoryName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.categoryType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create process categories" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createProcessCategory(v))}>
                <ProcessHubSelect data={data} {...form.register("processHubId")} />
                <input {...form.register("categoryKey")} placeholder="categoryKey" className={inputClass} />
                <input {...form.register("categoryName")} placeholder="categoryName" className={inputClass} />
                <input {...form.register("categoryType")} placeholder="categoryType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ProcessVersionsPanel({ data }: { data: BusinessProcessData }) {
    const form = useForm<processVersionsFormValues>({ resolver: zodResolver(processVersionsFormSchema), defaultValues: {"processHubId":"","versionKey":"","versionNumber":"","releaseChannel":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Process Versions" description="Enterprise business process process versions" /><div className="mt-6 space-y-3">
                {data.processVersions.length === 0 ? <EmptyState title="No process versions" description="Create the first process versions record." /> : data.processVersions.map((item) => (
                    <ListCard key={item.id} title={String(item.versionNumber)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.releaseChannel}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create process versions" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createProcessVersion(v))}>
                <ProcessHubSelect data={data} {...form.register("processHubId")} />
                <input {...form.register("versionKey")} placeholder="versionKey" className={inputClass} />
                <input {...form.register("versionNumber")} placeholder="versionNumber" className={inputClass} />
                <select {...form.register("releaseChannel")} className={inputClass}>{RELEASE_CHANNEL_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ProcessDependencysPanel({ data }: { data: BusinessProcessData }) {
    const form = useForm<processDependenciesFormValues>({ resolver: zodResolver(processDependenciesFormSchema), defaultValues: {"processHubId":"","dependencyKey":"","dependencyType":"","dependencyRef":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Process Dependencies" description="Enterprise business process process dependencies" /><div className="mt-6 space-y-3">
                {data.processDependencies.length === 0 ? <EmptyState title="No process dependencies" description="Create the first process dependencies record." /> : data.processDependencies.map((item) => (
                    <ListCard key={item.id} title={String(item.dependencyKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.dependencyType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create process dependencies" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createProcessDependency(v))}>
                <ProcessHubSelect data={data} {...form.register("processHubId")} />
                <input {...form.register("dependencyKey")} placeholder="dependencyKey" className={inputClass} />
                <input {...form.register("dependencyType")} placeholder="dependencyType" className={inputClass} />
                <input {...form.register("dependencyRef")} placeholder="dependencyRef" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ProcessModelsPanel({ data }: { data: BusinessProcessData }) {
    const form = useForm<processModelsFormValues>({ resolver: zodResolver(processModelsFormSchema), defaultValues: {"processHubId":"","modelKey":"","modelName":"","modelType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Process Models" description="Enterprise business process process models" /><div className="mt-6 space-y-3">
                {data.processModels.length === 0 ? <EmptyState title="No process models" description="Create the first process models record." /> : data.processModels.map((item) => (
                    <ListCard key={item.id} title={String(item.modelName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.modelType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create process models" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createProcessModel(v))}>
                <ProcessHubSelect data={data} {...form.register("processHubId")} />
                <input {...form.register("modelKey")} placeholder="modelKey" className={inputClass} />
                <input {...form.register("modelName")} placeholder="modelName" className={inputClass} />
                <input {...form.register("modelType")} placeholder="modelType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ProcessStepsPanel({ data }: { data: BusinessProcessData }) {
    const form = useForm<processStepsFormValues>({ resolver: zodResolver(processStepsFormSchema), defaultValues: {"processHubId":"","stepKey":"","stepName":"","stepOrder":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Process Steps" description="Enterprise business process process steps" /><div className="mt-6 space-y-3">
                {data.processSteps.length === 0 ? <EmptyState title="No process steps" description="Create the first process steps record." /> : data.processSteps.map((item) => (
                    <ListCard key={item.id} title={String(item.stepName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.stepOrder}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create process steps" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createProcessStep(v))}>
                <ProcessHubSelect data={data} {...form.register("processHubId")} />
                <input {...form.register("stepKey")} placeholder="stepKey" className={inputClass} />
                <input {...form.register("stepName")} placeholder="stepName" className={inputClass} />
                <input type="number" step="any" {...form.register("stepOrder", { valueAsNumber: true })} placeholder="stepOrder" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function DecisionPointsPanel({ data }: { data: BusinessProcessData }) {
    const form = useForm<decisionPointsFormValues>({ resolver: zodResolver(decisionPointsFormSchema), defaultValues: {"processHubId":"","decisionKey":"","decisionName":"","decisionType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Decision Points" description="Enterprise business process decision points" /><div className="mt-6 space-y-3">
                {data.decisionPoints.length === 0 ? <EmptyState title="No decision points" description="Create the first decision points record." /> : data.decisionPoints.map((item) => (
                    <ListCard key={item.id} title={String(item.decisionName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.decisionType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create decision points" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDecisionPoint(v))}>
                <ProcessHubSelect data={data} {...form.register("processHubId")} />
                <input {...form.register("decisionKey")} placeholder="decisionKey" className={inputClass} />
                <input {...form.register("decisionName")} placeholder="decisionName" className={inputClass} />
                <input {...form.register("decisionType")} placeholder="decisionType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ReusableBlocksPanel({ data }: { data: BusinessProcessData }) {
    const form = useForm<reusableBlocksFormValues>({ resolver: zodResolver(reusableBlocksFormSchema), defaultValues: {"processHubId":"","blockKey":"","blockName":"","blockType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Reusable Blocks" description="Enterprise business process reusable blocks" /><div className="mt-6 space-y-3">
                {data.reusableBlocks.length === 0 ? <EmptyState title="No reusable blocks" description="Create the first reusable blocks record." /> : data.reusableBlocks.map((item) => (
                    <ListCard key={item.id} title={String(item.blockName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.blockType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create reusable blocks" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createReusableBlock(v))}>
                <ProcessHubSelect data={data} {...form.register("processHubId")} />
                <input {...form.register("blockKey")} placeholder="blockKey" className={inputClass} />
                <input {...form.register("blockName")} placeholder="blockName" className={inputClass} />
                <input {...form.register("blockType")} placeholder="blockType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ApprovalRulesPanel({ data }: { data: BusinessProcessData }) {
    const form = useForm<approvalRulesFormValues>({ resolver: zodResolver(approvalRulesFormSchema), defaultValues: {"processHubId":"","ruleKey":"","ruleName":"","ruleType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Approval Rules" description="Enterprise business process approval rules" /><div className="mt-6 space-y-3">
                {data.approvalRules.length === 0 ? <EmptyState title="No approval rules" description="Create the first approval rules record." /> : data.approvalRules.map((item) => (
                    <ListCard key={item.id} title={String(item.ruleName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.ruleType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create approval rules" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createApprovalRule(v))}>
                <ProcessHubSelect data={data} {...form.register("processHubId")} />
                <input {...form.register("ruleKey")} placeholder="ruleKey" className={inputClass} />
                <input {...form.register("ruleName")} placeholder="ruleName" className={inputClass} />
                <input {...form.register("ruleType")} placeholder="ruleType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function SequentialApprovalsPanel({ data }: { data: BusinessProcessData }) {
    const form = useForm<sequentialApprovalsFormValues>({ resolver: zodResolver(sequentialApprovalsFormSchema), defaultValues: {"processHubId":"","approvalKey":"","approvalName":"","approvalOrder":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Sequential Approvals" description="Enterprise business process sequential approvals" /><div className="mt-6 space-y-3">
                {data.sequentialApprovals.length === 0 ? <EmptyState title="No sequential approvals" description="Create the first sequential approvals record." /> : data.sequentialApprovals.map((item) => (
                    <ListCard key={item.id} title={String(item.approvalName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.approvalOrder}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create sequential approvals" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createSequentialApproval(v))}>
                <ProcessHubSelect data={data} {...form.register("processHubId")} />
                <input {...form.register("approvalKey")} placeholder="approvalKey" className={inputClass} />
                <input {...form.register("approvalName")} placeholder="approvalName" className={inputClass} />
                <input type="number" step="any" {...form.register("approvalOrder", { valueAsNumber: true })} placeholder="approvalOrder" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ParallelApprovalsPanel({ data }: { data: BusinessProcessData }) {
    const form = useForm<parallelApprovalsFormValues>({ resolver: zodResolver(parallelApprovalsFormSchema), defaultValues: {"processHubId":"","approvalKey":"","approvalName":"","approverCount":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Parallel Approvals" description="Enterprise business process parallel approvals" /><div className="mt-6 space-y-3">
                {data.parallelApprovals.length === 0 ? <EmptyState title="No parallel approvals" description="Create the first parallel approvals record." /> : data.parallelApprovals.map((item) => (
                    <ListCard key={item.id} title={String(item.approvalName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.approverCount}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create parallel approvals" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createParallelApproval(v))}>
                <ProcessHubSelect data={data} {...form.register("processHubId")} />
                <input {...form.register("approvalKey")} placeholder="approvalKey" className={inputClass} />
                <input {...form.register("approvalName")} placeholder="approvalName" className={inputClass} />
                <input type="number" step="any" {...form.register("approverCount", { valueAsNumber: true })} placeholder="approverCount" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function EscalationRulesPanel({ data }: { data: BusinessProcessData }) {
    const form = useForm<escalationRulesFormValues>({ resolver: zodResolver(escalationRulesFormSchema), defaultValues: {"processHubId":"","escalationKey":"","escalationName":"","escalationLevel":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Escalation Rules" description="Enterprise business process escalation rules" /><div className="mt-6 space-y-3">
                {data.escalationRules.length === 0 ? <EmptyState title="No escalation rules" description="Create the first escalation rules record." /> : data.escalationRules.map((item) => (
                    <ListCard key={item.id} title={String(item.escalationName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.escalationLevel}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create escalation rules" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createEscalationRule(v))}>
                <ProcessHubSelect data={data} {...form.register("processHubId")} />
                <input {...form.register("escalationKey")} placeholder="escalationKey" className={inputClass} />
                <input {...form.register("escalationName")} placeholder="escalationName" className={inputClass} />
                <input type="number" step="any" {...form.register("escalationLevel", { valueAsNumber: true })} placeholder="escalationLevel" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function TaskAssignmentsPanel({ data }: { data: BusinessProcessData }) {
    const form = useForm<taskAssignmentsFormValues>({ resolver: zodResolver(taskAssignmentsFormSchema), defaultValues: {"processHubId":"","assignmentKey":"","assignmentName":"","assigneeRef":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Task Assignments" description="Enterprise business process task assignments" /><div className="mt-6 space-y-3">
                {data.taskAssignments.length === 0 ? <EmptyState title="No task assignments" description="Create the first task assignments record." /> : data.taskAssignments.map((item) => (
                    <ListCard key={item.id} title={String(item.assignmentName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.assigneeRef}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create task assignments" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createTaskAssignment(v))}>
                <ProcessHubSelect data={data} {...form.register("processHubId")} />
                <input {...form.register("assignmentKey")} placeholder="assignmentKey" className={inputClass} />
                <input {...form.register("assignmentName")} placeholder="assignmentName" className={inputClass} />
                <input {...form.register("assigneeRef")} placeholder="assigneeRef" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function TaskTemplatesPanel({ data }: { data: BusinessProcessData }) {
    const form = useForm<taskTemplatesFormValues>({ resolver: zodResolver(taskTemplatesFormSchema), defaultValues: {"processHubId":"","templateKey":"","templateName":"","templateType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Task Templates" description="Enterprise business process task templates" /><div className="mt-6 space-y-3">
                {data.taskTemplates.length === 0 ? <EmptyState title="No task templates" description="Create the first task templates record." /> : data.taskTemplates.map((item) => (
                    <ListCard key={item.id} title={String(item.templateName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.templateType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create task templates" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createTaskTemplate(v))}>
                <ProcessHubSelect data={data} {...form.register("processHubId")} />
                <input {...form.register("templateKey")} placeholder="templateKey" className={inputClass} />
                <input {...form.register("templateName")} placeholder="templateName" className={inputClass} />
                <input {...form.register("templateType")} placeholder="templateType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function RecurringTasksPanel({ data }: { data: BusinessProcessData }) {
    const form = useForm<recurringTasksFormValues>({ resolver: zodResolver(recurringTasksFormSchema), defaultValues: {"processHubId":"","taskKey":"","taskName":"","recurrencePattern":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Recurring Tasks" description="Enterprise business process recurring tasks" /><div className="mt-6 space-y-3">
                {data.recurringTasks.length === 0 ? <EmptyState title="No recurring tasks" description="Create the first recurring tasks record." /> : data.recurringTasks.map((item) => (
                    <ListCard key={item.id} title={String(item.taskName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.recurrencePattern}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create recurring tasks" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRecurringTask(v))}>
                <ProcessHubSelect data={data} {...form.register("processHubId")} />
                <input {...form.register("taskKey")} placeholder="taskKey" className={inputClass} />
                <input {...form.register("taskName")} placeholder="taskName" className={inputClass} />
                <input {...form.register("recurrencePattern")} placeholder="recurrencePattern" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function TaskSlaPolicysPanel({ data }: { data: BusinessProcessData }) {
    const form = useForm<taskSlaPoliciesFormValues>({ resolver: zodResolver(taskSlaPoliciesFormSchema), defaultValues: {"processHubId":"","policyKey":"","policyName":"","slaHours":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Task Sla Policies" description="Enterprise business process task sla policies" /><div className="mt-6 space-y-3">
                {data.taskSlaPolicies.length === 0 ? <EmptyState title="No task sla policies" description="Create the first task sla policies record." /> : data.taskSlaPolicies.map((item) => (
                    <ListCard key={item.id} title={String(item.policyName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.slaHours}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create task sla policies" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createTaskSlaPolicy(v))}>
                <ProcessHubSelect data={data} {...form.register("processHubId")} />
                <input {...form.register("policyKey")} placeholder="policyKey" className={inputClass} />
                <input {...form.register("policyName")} placeholder="policyName" className={inputClass} />
                <input type="number" step="any" {...form.register("slaHours", { valueAsNumber: true })} placeholder="slaHours" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function RuleConditionsPanel({ data }: { data: BusinessProcessData }) {
    const form = useForm<ruleConditionsFormValues>({ resolver: zodResolver(ruleConditionsFormSchema), defaultValues: {"processHubId":"","conditionKey":"","conditionName":"","conditionType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Rule Conditions" description="Enterprise business process rule conditions" /><div className="mt-6 space-y-3">
                {data.ruleConditions.length === 0 ? <EmptyState title="No rule conditions" description="Create the first rule conditions record." /> : data.ruleConditions.map((item) => (
                    <ListCard key={item.id} title={String(item.conditionName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.conditionType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create rule conditions" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRuleCondition(v))}>
                <ProcessHubSelect data={data} {...form.register("processHubId")} />
                <input {...form.register("conditionKey")} placeholder="conditionKey" className={inputClass} />
                <input {...form.register("conditionName")} placeholder="conditionName" className={inputClass} />
                <input {...form.register("conditionType")} placeholder="conditionType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function RuleValidationsPanel({ data }: { data: BusinessProcessData }) {
    const form = useForm<ruleValidationsFormValues>({ resolver: zodResolver(ruleValidationsFormSchema), defaultValues: {"processHubId":"","validationKey":"","validationName":"","validationScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Rule Validations" description="Enterprise business process rule validations" /><div className="mt-6 space-y-3">
                {data.ruleValidations.length === 0 ? <EmptyState title="No rule validations" description="Create the first rule validations record." /> : data.ruleValidations.map((item) => (
                    <ListCard key={item.id} title={String(item.validationName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.validationScore}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create rule validations" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRuleValidation(v))}>
                <ProcessHubSelect data={data} {...form.register("processHubId")} />
                <input {...form.register("validationKey")} placeholder="validationKey" className={inputClass} />
                <input {...form.register("validationName")} placeholder="validationName" className={inputClass} />
                <input type="number" step="any" {...form.register("validationScore", { valueAsNumber: true })} placeholder="validationScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function RuleCalculationsPanel({ data }: { data: BusinessProcessData }) {
    const form = useForm<ruleCalculationsFormValues>({ resolver: zodResolver(ruleCalculationsFormSchema), defaultValues: {"processHubId":"","calculationKey":"","calculationName":"","calculationType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Rule Calculations" description="Enterprise business process rule calculations" /><div className="mt-6 space-y-3">
                {data.ruleCalculations.length === 0 ? <EmptyState title="No rule calculations" description="Create the first rule calculations record." /> : data.ruleCalculations.map((item) => (
                    <ListCard key={item.id} title={String(item.calculationName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.calculationType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create rule calculations" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRuleCalculation(v))}>
                <ProcessHubSelect data={data} {...form.register("processHubId")} />
                <input {...form.register("calculationKey")} placeholder="calculationKey" className={inputClass} />
                <input {...form.register("calculationName")} placeholder="calculationName" className={inputClass} />
                <input {...form.register("calculationType")} placeholder="calculationType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ReusableRulesPanel({ data }: { data: BusinessProcessData }) {
    const form = useForm<reusableRulesFormValues>({ resolver: zodResolver(reusableRulesFormSchema), defaultValues: {"processHubId":"","ruleKey":"","ruleName":"","ruleType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Reusable Rules" description="Enterprise business process reusable rules" /><div className="mt-6 space-y-3">
                {data.reusableRules.length === 0 ? <EmptyState title="No reusable rules" description="Create the first reusable rules record." /> : data.reusableRules.map((item) => (
                    <ListCard key={item.id} title={String(item.ruleName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.ruleType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create reusable rules" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createReusableRule(v))}>
                <ProcessHubSelect data={data} {...form.register("processHubId")} />
                <input {...form.register("ruleKey")} placeholder="ruleKey" className={inputClass} />
                <input {...form.register("ruleName")} placeholder="ruleName" className={inputClass} />
                <input {...form.register("ruleType")} placeholder="ruleType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ProcessExecutionsPanel({ data }: { data: BusinessProcessData }) {
    const form = useForm<processExecutionsFormValues>({ resolver: zodResolver(processExecutionsFormSchema), defaultValues: {"processHubId":"","executionKey":"","executionName":"","executionStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Process Executions" description="Enterprise business process process executions" /><div className="mt-6 space-y-3">
                {data.processExecutions.length === 0 ? <EmptyState title="No process executions" description="Create the first process executions record." /> : data.processExecutions.map((item) => (
                    <ListCard key={item.id} title={String(item.executionName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.executionStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create process executions" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createProcessExecution(v))}>
                <ProcessHubSelect data={data} {...form.register("processHubId")} />
                <input {...form.register("executionKey")} placeholder="executionKey" className={inputClass} />
                <input {...form.register("executionName")} placeholder="executionName" className={inputClass} />
                <input {...form.register("executionStatus")} placeholder="executionStatus" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ExecutionHistorysPanel({ data }: { data: BusinessProcessData }) {
    const form = useForm<executionHistoryFormValues>({ resolver: zodResolver(executionHistoryFormSchema), defaultValues: {"processHubId":"","historyKey":"","historyType":"","historySummary":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Execution History" description="Enterprise business process execution history" /><div className="mt-6 space-y-3">
                {data.executionHistory.length === 0 ? <EmptyState title="No execution history" description="Create the first execution history record." /> : data.executionHistory.map((item) => (
                    <ListCard key={item.id} title={String(item.historyKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.historyType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create execution history" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createExecutionHistory(v))}>
                <ProcessHubSelect data={data} {...form.register("processHubId")} />
                <input {...form.register("historyKey")} placeholder="historyKey" className={inputClass} />
                <input {...form.register("historyType")} placeholder="historyType" className={inputClass} />
                <input {...form.register("historySummary")} placeholder="historySummary" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ExecutionRetrysPanel({ data }: { data: BusinessProcessData }) {
    const form = useForm<executionRetriesFormValues>({ resolver: zodResolver(executionRetriesFormSchema), defaultValues: {"processHubId":"","retryKey":"","retryCount":0,"retryReason":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Execution Retries" description="Enterprise business process execution retries" /><div className="mt-6 space-y-3">
                {data.executionRetries.length === 0 ? <EmptyState title="No execution retries" description="Create the first execution retries record." /> : data.executionRetries.map((item) => (
                    <ListCard key={item.id} title={String(item.retryKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.retryCount}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create execution retries" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createExecutionRetry(v))}>
                <ProcessHubSelect data={data} {...form.register("processHubId")} />
                <input {...form.register("retryKey")} placeholder="retryKey" className={inputClass} />
                <input type="number" step="any" {...form.register("retryCount", { valueAsNumber: true })} placeholder="retryCount" className={inputClass} />
                <input {...form.register("retryReason")} placeholder="retryReason" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ExecutionAnalyticssPanel({ data }: { data: BusinessProcessData }) {
    const form = useForm<executionAnalyticsFormValues>({ resolver: zodResolver(executionAnalyticsFormSchema), defaultValues: {"processHubId":"","analyticsKey":"","analyticsType":"","analyticsScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Execution Analytics" description="Enterprise business process execution analytics" /><div className="mt-6 space-y-3">
                {data.executionAnalytics.length === 0 ? <EmptyState title="No execution analytics" description="Create the first execution analytics record." /> : data.executionAnalytics.map((item) => (
                    <ListCard key={item.id} title={String(item.analyticsKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.analyticsType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create execution analytics" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createExecutionAnalytics(v))}>
                <ProcessHubSelect data={data} {...form.register("processHubId")} />
                <input {...form.register("analyticsKey")} placeholder="analyticsKey" className={inputClass} />
                <input {...form.register("analyticsType")} placeholder="analyticsType" className={inputClass} />
                <input type="number" step="any" {...form.register("analyticsScore", { valueAsNumber: true })} placeholder="analyticsScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function BottleneckReportsPanel({ data }: { data: BusinessProcessData }) {
    const form = useForm<bottleneckReportsFormValues>({ resolver: zodResolver(bottleneckReportsFormSchema), defaultValues: {"processHubId":"","reportKey":"","reportName":"","bottleneckScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Bottleneck Reports" description="Enterprise business process bottleneck reports" /><div className="mt-6 space-y-3">
                {data.bottleneckReports.length === 0 ? <EmptyState title="No bottleneck reports" description="Create the first bottleneck reports record." /> : data.bottleneckReports.map((item) => (
                    <ListCard key={item.id} title={String(item.reportName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.bottleneckScore}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create bottleneck reports" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createBottleneckReport(v))}>
                <ProcessHubSelect data={data} {...form.register("processHubId")} />
                <input {...form.register("reportKey")} placeholder="reportKey" className={inputClass} />
                <input {...form.register("reportName")} placeholder="reportName" className={inputClass} />
                <input type="number" step="any" {...form.register("bottleneckScore", { valueAsNumber: true })} placeholder="bottleneckScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function SlaPerformanceMetricsPanel({ data }: { data: BusinessProcessData }) {
    const form = useForm<slaPerformanceMetricsFormValues>({ resolver: zodResolver(slaPerformanceMetricsFormSchema), defaultValues: {"processHubId":"","metricKey":"","metricName":"","slaScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Sla Performance Metrics" description="Enterprise business process sla performance metrics" /><div className="mt-6 space-y-3">
                {data.slaPerformanceMetrics.length === 0 ? <EmptyState title="No sla performance metrics" description="Create the first sla performance metrics record." /> : data.slaPerformanceMetrics.map((item) => (
                    <ListCard key={item.id} title={String(item.metricName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.slaScore}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create sla performance metrics" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createSlaPerformanceMetric(v))}>
                <ProcessHubSelect data={data} {...form.register("processHubId")} />
                <input {...form.register("metricKey")} placeholder="metricKey" className={inputClass} />
                <input {...form.register("metricName")} placeholder="metricName" className={inputClass} />
                <input type="number" step="any" {...form.register("slaScore", { valueAsNumber: true })} placeholder="slaScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ProcessMetricsPanel({ data }: { data: BusinessProcessData }) {
    const form = useForm<processMetricsFormValues>({ resolver: zodResolver(processMetricsFormSchema), defaultValues: {"metricsKey":"","executionCount":0,"overallProcessScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Process Metrics" description="Enterprise business process process metrics" /><div className="mt-6 space-y-3">
                {data.processMetrics.length === 0 ? <EmptyState title="No process metrics" description="Create the first process metrics record." /> : data.processMetrics.map((item) => (
                    <ListCard key={item.id} title={String(item.metricsKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.overallProcessScore}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create process metrics" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createProcessMetric(v))}>
                <input {...form.register("metricsKey")} placeholder="metricsKey" className={inputClass} />
                <input type="number" step="any" {...form.register("executionCount", { valueAsNumber: true })} placeholder="executionCount" className={inputClass} />
                <input type="number" step="any" {...form.register("overallProcessScore", { valueAsNumber: true })} placeholder="overallProcessScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ProcessHealthsPanel({ data }: { data: BusinessProcessData }) {
    const form = useForm<processHealthFormValues>({ resolver: zodResolver(processHealthFormSchema), defaultValues: {"healthKey":"","overallScore":0,"disasterRecoveryMode":false} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Process Health" description="Enterprise business process process health" /><div className="mt-6 space-y-3">
                {data.processHealth.length === 0 ? <EmptyState title="No process health" description="Create the first process health record." /> : data.processHealth.map((item) => (
                    <ListCard key={item.id} title={String(item.healthKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.overallScore}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create process health" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createProcessHealth(v))}>
                <input {...form.register("healthKey")} placeholder="healthKey" className={inputClass} />
                <input type="number" step="any" {...form.register("overallScore", { valueAsNumber: true })} placeholder="overallScore" className={inputClass} />
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...form.register("disasterRecoveryMode")} /> disasterRecoveryMode</label>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function FailedProcessRecordsPanel({ data }: { data: BusinessProcessData }) {
    const form = useForm<failedProcessRecordsFormValues>({ resolver: zodResolver(failedProcessRecordsFormSchema), defaultValues: {"processHubId":"","recordKey":"","recordName":"","failureType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Failed Process Records" description="Enterprise business process failed process records" /><div className="mt-6 space-y-3">
                {data.failedProcessRecords.length === 0 ? <EmptyState title="No failed process records" description="Create the first failed process records record." /> : data.failedProcessRecords.map((item) => (
                    <ListCard key={item.id} title={String(item.recordName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.failureType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create failed process records" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createFailedProcessRecord(v))}>
                <ProcessHubSelect data={data} {...form.register("processHubId")} />
                <input {...form.register("recordKey")} placeholder="recordKey" className={inputClass} />
                <input {...form.register("recordName")} placeholder="recordName" className={inputClass} />
                <input {...form.register("failureType")} placeholder="failureType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ProcessFailuresPanel({ data }: { data: BusinessProcessData }) {
    const form = useForm<processFailuresFormValues>({ resolver: zodResolver(processFailuresFormSchema), defaultValues: {"processHubId":"","failureKey":"","failureType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Process Failures" description="Enterprise business process process failures" /><div className="mt-6 space-y-3">
                {data.processFailures.length === 0 ? <EmptyState title="No process failures" description="Create the first process failures record." /> : data.processFailures.map((item) => (
                    <ListCard key={item.id} title={String(item.failureKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.failureType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create process failures" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createProcessFailure(v))}>
                <ProcessHubSelect data={data} {...form.register("processHubId")} />
                <input {...form.register("failureKey")} placeholder="failureKey" className={inputClass} />
                <input {...form.register("failureType")} placeholder="failureType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function BusinessProcessAuditLogsPanel({ data }: { data: BusinessProcessData }) {
    return (
        <Card hover><SectionHeader title="Business Process audit history" description="Security-first audit trail for jobs, events, failedProcessRecords, and marketplace operations" /><div className="mt-6 space-y-3">
            {data.auditLogs.length === 0 ? <EmptyState title="No audit entries" description="Audit logs are created automatically for business process." /> : data.auditLogs.map((entry) => (
                <ListCard key={entry.id} title={entry.summary} subtitle={`${entry.entityType} • ${entry.action}`} meta={`${entry.securityLevel} • ${new Date(entry.createdAt).toLocaleString()}`} />
            ))}
        </div></Card>
    );
}

export function BusinessProcessSdkPanel({ data }: { data: BusinessProcessData }) {
    return (
        <Card hover><SectionHeader title="Shared Business Process SDK" description="Import from @/src/modules/business-process/sdk for process registration, approval configuration, and process execution" /><div className="mt-6 space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <ListCard title="createBusinessProcessClient()" subtitle="Factory for module-scoped Business Process client with auth context" meta="Primary SDK for enterprise business process" />
            <ListCard title="sdkRegisterProcess()" subtitle="Register business process with AI orchestration" meta="moduleSource: business_process" />
            <ListCard title="sdkConfigureApproval()" subtitle="Configure approval rule with knowledge context" meta="v1/v2/v3 API versions" />
            <ListCard title="sdkRunProcessExecution()" subtitle="Run process execution with audit trail" meta="Event-driven integration delivery" />
            <p className="text-xs text-slate-500">Theme: {BPF_THEME.primary} • Integration hubs loaded: {data.processHubs.length}</p>
            <pre className="overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">{`import { createBusinessProcessClient } from "@/src/modules/business-process/sdk";

const intg = createBusinessProcessClient(userId, email, fullName);
await intg.registerProcess({ processHubId, serviceKey: "svc-001", serviceName: "Stripe" });
await intg.configureApproval({ processHubId, keyName: "prod-key", apiVersion: "v1" });
await intg.runProcessExecution({ processHubId, webhookKey: "wh-001", webhookName: "Events" });`}</pre>
        </div></Card>
    );
}
