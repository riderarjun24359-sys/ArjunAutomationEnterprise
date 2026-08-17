"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/src/components/ui/card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { ELR_THEME, RELEASE_CHANNEL_OPTIONS, LOG_LEVEL_OPTIONS, ALERT_SEVERITY_OPTIONS } from "@/src/modules/launch-readiness/constants";
import type { useLaunchReadiness } from "@/src/modules/launch-readiness/hooks/useLaunchReadiness";
import {
    readinessHubsFormSchema,
    type readinessHubsFormValues,
    environmentValidationsFormSchema,
    type environmentValidationsFormValues,
    configurationValidationsFormSchema,
    type configurationValidationsFormValues,
    secretsValidationsFormSchema,
    type secretsValidationsFormValues,
    deploymentPlansFormSchema,
    type deploymentPlansFormValues,
    rollbackPlansFormSchema,
    type rollbackPlansFormValues,
    versionRegistryFormSchema,
    type versionRegistryFormValues,
    releaseNotesFormSchema,
    type releaseNotesFormValues,
    backupPoliciesFormSchema,
    type backupPoliciesFormValues,
    backupVerificationsFormSchema,
    type backupVerificationsFormValues,
    restoreVerificationsFormSchema,
    type restoreVerificationsFormValues,
    recoveryDrillsFormSchema,
    type recoveryDrillsFormValues,
    observabilityLogsFormSchema,
    type observabilityLogsFormValues,
    observabilityMetricsFormSchema,
    type observabilityMetricsFormValues,
    traceRecordsFormSchema,
    type traceRecordsFormValues,
    slaMonitorsFormSchema,
    type slaMonitorsFormValues,
    securityChecklistsFormSchema,
    type securityChecklistsFormValues,
    vulnerabilityReviewsFormSchema,
    type vulnerabilityReviewsFormValues,
    permissionAuditsFormSchema,
    type permissionAuditsFormValues,
    complianceReviewsFormSchema,
    type complianceReviewsFormValues,
    adminGuidesFormSchema,
    type adminGuidesFormValues,
    userGuidesFormSchema,
    type userGuidesFormValues,
    deploymentGuidesFormSchema,
    type deploymentGuidesFormValues,
    launchScoreMetricsFormSchema,
    type launchScoreMetricsFormValues,
    readinessValidationsFormSchema,
    type readinessValidationsFormValues,
    launchBlockersFormSchema,
    type launchBlockersFormValues,
    scoreSnapshotsFormSchema,
    type scoreSnapshotsFormValues,
    launchHealthFormSchema,
    type launchHealthFormValues,
    criticalIssuesFormSchema,
    type criticalIssuesFormValues,
    readinessWarningsFormSchema,
    type readinessWarningsFormValues,
    launchFailuresFormSchema,
    type launchFailuresFormValues,
} from "@/src/modules/launch-readiness/schemas";

type LaunchReadinessData = ReturnType<typeof useLaunchReadiness>;
const inputClass = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-rose-500/20 focus:ring-4 dark:border-slate-800 dark:bg-slate-950";
function SaveButton({ loading, label = "Save changes" }: { loading?: boolean; label?: string }) {
    return <button type="submit" disabled={loading} className="rounded-full bg-rose-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-rose-500 disabled:opacity-60">{loading ? "Saving..." : label}</button>;
}
function ListCard({ title, subtitle, meta }: { title: string; subtitle: string; meta?: string }) {
    return <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800"><p className="font-medium">{title}</p><p className="text-sm text-slate-500">{subtitle}</p>{meta ? <p className="mt-1 text-xs text-rose-600">{meta}</p> : null}</div>;
}
function ReadinessHubSelect({ data, ...props }: { data: LaunchReadinessData } & React.SelectHTMLAttributes<HTMLSelectElement>) {
    return <select {...props} className={inputClass}><option value="">Select launch readiness</option>{data.readinessHubOptions.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>;
}

export function LaunchReadinessOverviewPanel({ data }: { data: LaunchReadinessData }) {
    const pipeline = data.pipeline;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="Launch Readiness summary" description="System health, background jobs, event bus, launchBlockers, feature flags, configuration, diagnostics, and operations dashboard" /><div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ListCard title="Readiness Hubs" subtitle={`${data.stats?.totalReadinessHubs ?? 0} total`} meta={`${data.stats?.activeReadinessHubs ?? 0} active • ${data.stats?.deploymentPlanCount ?? 0} deployment plans`} />
                <ListCard title="Connectors" subtitle={`${data.stats?.backupPolicyCount ?? 0} backup policies`} meta={`${data.stats?.recoveryDrillCount ?? 0} recovery drills • ${data.stats?.openBlockerCount ?? 0} open blockers`} />
                <ListCard title="Health" subtitle={`${(data.stats?.overallLaunchScore ?? 0).toFixed(1)} overall launch score`} meta={`${data.stats?.openFailureCount ?? 0} open failures`} />
                <ListCard title="Audit Trail" subtitle={`${data.stats?.auditCount ?? 0} audit entries`} meta="Security-first launch readiness" />
            </div></Card>
            <Card hover><SectionHeader title="Launch readiness pipeline" description={`${pipeline?.previousStage ?? "configured"} → ${pipeline?.currentStage ?? "active"} → ${pipeline?.nextStage ?? "degraded"}`} /><div className="mt-6 space-y-3">
                {pipeline?.stages?.length ? pipeline.stages.map((stage) => (
                    <ListCard key={stage.key} title={stage.label} subtitle={stage.key} meta={stage.label} />
                )) : <EmptyState title="No pipeline data" description="Launch readiness pipeline stages will appear as hubs are configured." />}
            </div></Card>
        </div>
    );
}

export function ReadinessHubsPanel({ data }: { data: LaunchReadinessData }) {
    const form = useForm<readinessHubsFormValues>({ resolver: zodResolver(readinessHubsFormSchema), defaultValues: {"hubKey":"","hubName":"","environment":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Readiness Hubs" description="Enterprise launch readiness readiness hubs" /><div className="mt-6 space-y-3">
                {data.readinessHubs.length === 0 ? <EmptyState title="No readiness hubs" description="Create the first readiness hubs record." /> : data.readinessHubs.map((item) => (
                    <ListCard key={item.id} title={String(item.hubName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.hubKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create readiness hubs" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createReadinessHub(v))}>
                <input {...form.register("hubKey")} placeholder="hubKey" className={inputClass} />
                <input {...form.register("hubName")} placeholder="hubName" className={inputClass} />
                <input {...form.register("environment")} placeholder="environment" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function EnvironmentValidationsPanel({ data }: { data: LaunchReadinessData }) {
    const form = useForm<environmentValidationsFormValues>({ resolver: zodResolver(environmentValidationsFormSchema), defaultValues: {"readinessHubId":"","validationKey":"","validationType":"","validationScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Environment Validations" description="Enterprise launch readiness environment validations" /><div className="mt-6 space-y-3">
                {data.environmentValidations.length === 0 ? <EmptyState title="No environment validations" description="Create the first environment validations record." /> : data.environmentValidations.map((item) => (
                    <ListCard key={item.id} title={String(item.validationKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.validationType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create environment validations" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createEnvironmentValidation(v))}>
                <ReadinessHubSelect data={data} {...form.register("readinessHubId")} />
                <input {...form.register("validationKey")} placeholder="validationKey" className={inputClass} />
                <input {...form.register("validationType")} placeholder="validationType" className={inputClass} />
                <input type="number" step="any" {...form.register("validationScore", { valueAsNumber: true })} placeholder="validationScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ConfigurationValidationsPanel({ data }: { data: LaunchReadinessData }) {
    const form = useForm<configurationValidationsFormValues>({ resolver: zodResolver(configurationValidationsFormSchema), defaultValues: {"readinessHubId":"","validationKey":"","configType":"","validationScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Configuration Validations" description="Enterprise launch readiness configuration validations" /><div className="mt-6 space-y-3">
                {data.configurationValidations.length === 0 ? <EmptyState title="No configuration validations" description="Create the first configuration validations record." /> : data.configurationValidations.map((item) => (
                    <ListCard key={item.id} title={String(item.validationKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.configType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create configuration validations" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createConfigurationValidation(v))}>
                <ReadinessHubSelect data={data} {...form.register("readinessHubId")} />
                <input {...form.register("validationKey")} placeholder="validationKey" className={inputClass} />
                <input {...form.register("configType")} placeholder="configType" className={inputClass} />
                <input type="number" step="any" {...form.register("validationScore", { valueAsNumber: true })} placeholder="validationScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function SecretsValidationsPanel({ data }: { data: LaunchReadinessData }) {
    const form = useForm<secretsValidationsFormValues>({ resolver: zodResolver(secretsValidationsFormSchema), defaultValues: {"readinessHubId":"","validationKey":"","secretType":"","validationScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Secrets Validations" description="Enterprise launch readiness secrets validations" /><div className="mt-6 space-y-3">
                {data.secretsValidations.length === 0 ? <EmptyState title="No secrets validations" description="Create the first secrets validations record." /> : data.secretsValidations.map((item) => (
                    <ListCard key={item.id} title={String(item.validationKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.secretType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create secrets validations" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createSecretsValidation(v))}>
                <ReadinessHubSelect data={data} {...form.register("readinessHubId")} />
                <input {...form.register("validationKey")} placeholder="validationKey" className={inputClass} />
                <input {...form.register("secretType")} placeholder="secretType" className={inputClass} />
                <input type="number" step="any" {...form.register("validationScore", { valueAsNumber: true })} placeholder="validationScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function DeploymentPlansPanel({ data }: { data: LaunchReadinessData }) {
    const form = useForm<deploymentPlansFormValues>({ resolver: zodResolver(deploymentPlansFormSchema), defaultValues: {"readinessHubId":"","planKey":"","planName":"","targetVersion":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Deployment Plans" description="Enterprise launch readiness deployment plans" /><div className="mt-6 space-y-3">
                {data.deploymentPlans.length === 0 ? <EmptyState title="No deployment plans" description="Create the first deployment plans record." /> : data.deploymentPlans.map((item) => (
                    <ListCard key={item.id} title={String(item.planName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.targetVersion}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create deployment plans" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDeploymentPlan(v))}>
                <ReadinessHubSelect data={data} {...form.register("readinessHubId")} />
                <input {...form.register("planKey")} placeholder="planKey" className={inputClass} />
                <input {...form.register("planName")} placeholder="planName" className={inputClass} />
                <input {...form.register("targetVersion")} placeholder="targetVersion" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function RollbackPlansPanel({ data }: { data: LaunchReadinessData }) {
    const form = useForm<rollbackPlansFormValues>({ resolver: zodResolver(rollbackPlansFormSchema), defaultValues: {"readinessHubId":"","planKey":"","rollbackVersion":"","rollbackReason":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Rollback Plans" description="Enterprise launch readiness rollback plans" /><div className="mt-6 space-y-3">
                {data.rollbackPlans.length === 0 ? <EmptyState title="No rollback plans" description="Create the first rollback plans record." /> : data.rollbackPlans.map((item) => (
                    <ListCard key={item.id} title={String(item.planKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.rollbackVersion}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create rollback plans" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRollbackPlan(v))}>
                <ReadinessHubSelect data={data} {...form.register("readinessHubId")} />
                <input {...form.register("planKey")} placeholder="planKey" className={inputClass} />
                <input {...form.register("rollbackVersion")} placeholder="rollbackVersion" className={inputClass} />
                <input {...form.register("rollbackReason")} placeholder="rollbackReason" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function VersionRegistrysPanel({ data }: { data: LaunchReadinessData }) {
    const form = useForm<versionRegistryFormValues>({ resolver: zodResolver(versionRegistryFormSchema), defaultValues: {"readinessHubId":"","versionKey":"","versionNumber":"","releaseChannel":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Version Registry" description="Enterprise launch readiness version registry" /><div className="mt-6 space-y-3">
                {data.versionRegistry.length === 0 ? <EmptyState title="No version registry" description="Create the first version registry record." /> : data.versionRegistry.map((item) => (
                    <ListCard key={item.id} title={String(item.versionNumber)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.releaseChannel}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create version registry" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createVersionRegistry(v))}>
                <ReadinessHubSelect data={data} {...form.register("readinessHubId")} />
                <input {...form.register("versionKey")} placeholder="versionKey" className={inputClass} />
                <input {...form.register("versionNumber")} placeholder="versionNumber" className={inputClass} />
                <select {...form.register("releaseChannel")} className={inputClass}>{RELEASE_CHANNEL_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ReleaseNotesPanel({ data }: { data: LaunchReadinessData }) {
    const form = useForm<releaseNotesFormValues>({ resolver: zodResolver(releaseNotesFormSchema), defaultValues: {"readinessHubId":"","noteKey":"","versionRef":"","noteSummary":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Release Notes" description="Enterprise launch readiness release notes" /><div className="mt-6 space-y-3">
                {data.releaseNotes.length === 0 ? <EmptyState title="No release notes" description="Create the first release notes record." /> : data.releaseNotes.map((item) => (
                    <ListCard key={item.id} title={String(item.noteKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.versionRef}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create release notes" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createReleaseNote(v))}>
                <ReadinessHubSelect data={data} {...form.register("readinessHubId")} />
                <input {...form.register("noteKey")} placeholder="noteKey" className={inputClass} />
                <input {...form.register("versionRef")} placeholder="versionRef" className={inputClass} />
                <input {...form.register("noteSummary")} placeholder="noteSummary" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function BackupPolicysPanel({ data }: { data: LaunchReadinessData }) {
    const form = useForm<backupPoliciesFormValues>({ resolver: zodResolver(backupPoliciesFormSchema), defaultValues: {"readinessHubId":"","policyKey":"","policyName":"","retentionDays":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Backup Policies" description="Enterprise launch readiness backup policies" /><div className="mt-6 space-y-3">
                {data.backupPolicies.length === 0 ? <EmptyState title="No backup policies" description="Create the first backup policies record." /> : data.backupPolicies.map((item) => (
                    <ListCard key={item.id} title={String(item.policyName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.policyKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create backup policies" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createBackupPolicy(v))}>
                <ReadinessHubSelect data={data} {...form.register("readinessHubId")} />
                <input {...form.register("policyKey")} placeholder="policyKey" className={inputClass} />
                <input {...form.register("policyName")} placeholder="policyName" className={inputClass} />
                <input type="number" step="any" {...form.register("retentionDays", { valueAsNumber: true })} placeholder="retentionDays" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function BackupVerificationsPanel({ data }: { data: LaunchReadinessData }) {
    const form = useForm<backupVerificationsFormValues>({ resolver: zodResolver(backupVerificationsFormSchema), defaultValues: {"readinessHubId":"","verificationKey":"","backupRef":"","verificationScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Backup Verifications" description="Enterprise launch readiness backup verifications" /><div className="mt-6 space-y-3">
                {data.backupVerifications.length === 0 ? <EmptyState title="No backup verifications" description="Create the first backup verifications record." /> : data.backupVerifications.map((item) => (
                    <ListCard key={item.id} title={String(item.verificationKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.backupRef}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create backup verifications" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createBackupVerification(v))}>
                <ReadinessHubSelect data={data} {...form.register("readinessHubId")} />
                <input {...form.register("verificationKey")} placeholder="verificationKey" className={inputClass} />
                <input {...form.register("backupRef")} placeholder="backupRef" className={inputClass} />
                <input type="number" step="any" {...form.register("verificationScore", { valueAsNumber: true })} placeholder="verificationScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function RestoreVerificationsPanel({ data }: { data: LaunchReadinessData }) {
    const form = useForm<restoreVerificationsFormValues>({ resolver: zodResolver(restoreVerificationsFormSchema), defaultValues: {"readinessHubId":"","verificationKey":"","restoreRef":"","verificationScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Restore Verifications" description="Enterprise launch readiness restore verifications" /><div className="mt-6 space-y-3">
                {data.restoreVerifications.length === 0 ? <EmptyState title="No restore verifications" description="Create the first restore verifications record." /> : data.restoreVerifications.map((item) => (
                    <ListCard key={item.id} title={String(item.verificationKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.restoreRef}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create restore verifications" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRestoreVerification(v))}>
                <ReadinessHubSelect data={data} {...form.register("readinessHubId")} />
                <input {...form.register("verificationKey")} placeholder="verificationKey" className={inputClass} />
                <input {...form.register("restoreRef")} placeholder="restoreRef" className={inputClass} />
                <input type="number" step="any" {...form.register("verificationScore", { valueAsNumber: true })} placeholder="verificationScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function RecoveryDrillsPanel({ data }: { data: LaunchReadinessData }) {
    const form = useForm<recoveryDrillsFormValues>({ resolver: zodResolver(recoveryDrillsFormSchema), defaultValues: {"readinessHubId":"","drillKey":"","drillType":"","drillScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Recovery Drills" description="Enterprise launch readiness recovery drills" /><div className="mt-6 space-y-3">
                {data.recoveryDrills.length === 0 ? <EmptyState title="No recovery drills" description="Create the first recovery drills record." /> : data.recoveryDrills.map((item) => (
                    <ListCard key={item.id} title={String(item.drillKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.drillType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create recovery drills" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRecoveryDrill(v))}>
                <ReadinessHubSelect data={data} {...form.register("readinessHubId")} />
                <input {...form.register("drillKey")} placeholder="drillKey" className={inputClass} />
                <input {...form.register("drillType")} placeholder="drillType" className={inputClass} />
                <input type="number" step="any" {...form.register("drillScore", { valueAsNumber: true })} placeholder="drillScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ObservabilityLogsPanel({ data }: { data: LaunchReadinessData }) {
    const form = useForm<observabilityLogsFormValues>({ resolver: zodResolver(observabilityLogsFormSchema), defaultValues: {"readinessHubId":"","logKey":"","logLevel":"","logSource":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Observability Logs" description="Enterprise launch readiness observability logs" /><div className="mt-6 space-y-3">
                {data.observabilityLogs.length === 0 ? <EmptyState title="No observability logs" description="Create the first observability logs record." /> : data.observabilityLogs.map((item) => (
                    <ListCard key={item.id} title={String(item.logKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.logLevel}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create observability logs" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createObservabilityLog(v))}>
                <ReadinessHubSelect data={data} {...form.register("readinessHubId")} />
                <input {...form.register("logKey")} placeholder="logKey" className={inputClass} />
                <select {...form.register("logLevel")} className={inputClass}>{LOG_LEVEL_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <input {...form.register("logSource")} placeholder="logSource" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ObservabilityMetricsPanel({ data }: { data: LaunchReadinessData }) {
    const form = useForm<observabilityMetricsFormValues>({ resolver: zodResolver(observabilityMetricsFormSchema), defaultValues: {"readinessHubId":"","metricKey":"","metricName":"","metricValue":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Observability Metrics" description="Enterprise launch readiness observability metrics" /><div className="mt-6 space-y-3">
                {data.observabilityMetrics.length === 0 ? <EmptyState title="No observability metrics" description="Create the first observability metrics record." /> : data.observabilityMetrics.map((item) => (
                    <ListCard key={item.id} title={String(item.metricName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.metricKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create observability metrics" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createObservabilityMetric(v))}>
                <ReadinessHubSelect data={data} {...form.register("readinessHubId")} />
                <input {...form.register("metricKey")} placeholder="metricKey" className={inputClass} />
                <input {...form.register("metricName")} placeholder="metricName" className={inputClass} />
                <input type="number" step="any" {...form.register("metricValue", { valueAsNumber: true })} placeholder="metricValue" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function TraceRecordsPanel({ data }: { data: LaunchReadinessData }) {
    const form = useForm<traceRecordsFormValues>({ resolver: zodResolver(traceRecordsFormSchema), defaultValues: {"readinessHubId":"","traceKey":"","traceName":"","latencyMs":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Trace Records" description="Enterprise launch readiness trace records" /><div className="mt-6 space-y-3">
                {data.traceRecords.length === 0 ? <EmptyState title="No trace records" description="Create the first trace records record." /> : data.traceRecords.map((item) => (
                    <ListCard key={item.id} title={String(item.traceName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.traceKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create trace records" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createTraceRecord(v))}>
                <ReadinessHubSelect data={data} {...form.register("readinessHubId")} />
                <input {...form.register("traceKey")} placeholder="traceKey" className={inputClass} />
                <input {...form.register("traceName")} placeholder="traceName" className={inputClass} />
                <input type="number" step="any" {...form.register("latencyMs", { valueAsNumber: true })} placeholder="latencyMs" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function SlaMonitorsPanel({ data }: { data: LaunchReadinessData }) {
    const form = useForm<slaMonitorsFormValues>({ resolver: zodResolver(slaMonitorsFormSchema), defaultValues: {"readinessHubId":"","monitorKey":"","slaTarget":0,"currentValue":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Sla Monitors" description="Enterprise launch readiness sla monitors" /><div className="mt-6 space-y-3">
                {data.slaMonitors.length === 0 ? <EmptyState title="No sla monitors" description="Create the first sla monitors record." /> : data.slaMonitors.map((item) => (
                    <ListCard key={item.id} title={String(item.monitorKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.slaTarget}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create sla monitors" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createSlaMonitor(v))}>
                <ReadinessHubSelect data={data} {...form.register("readinessHubId")} />
                <input {...form.register("monitorKey")} placeholder="monitorKey" className={inputClass} />
                <input type="number" step="any" {...form.register("slaTarget", { valueAsNumber: true })} placeholder="slaTarget" className={inputClass} />
                <input type="number" step="any" {...form.register("currentValue", { valueAsNumber: true })} placeholder="currentValue" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function SecurityChecklistsPanel({ data }: { data: LaunchReadinessData }) {
    const form = useForm<securityChecklistsFormValues>({ resolver: zodResolver(securityChecklistsFormSchema), defaultValues: {"readinessHubId":"","checklistKey":"","checklistName":"","completionScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Security Checklists" description="Enterprise launch readiness security checklists" /><div className="mt-6 space-y-3">
                {data.securityChecklists.length === 0 ? <EmptyState title="No security checklists" description="Create the first security checklists record." /> : data.securityChecklists.map((item) => (
                    <ListCard key={item.id} title={String(item.checklistName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.completionScore}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create security checklists" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createSecurityChecklist(v))}>
                <ReadinessHubSelect data={data} {...form.register("readinessHubId")} />
                <input {...form.register("checklistKey")} placeholder="checklistKey" className={inputClass} />
                <input {...form.register("checklistName")} placeholder="checklistName" className={inputClass} />
                <input type="number" step="any" {...form.register("completionScore", { valueAsNumber: true })} placeholder="completionScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function VulnerabilityReviewsPanel({ data }: { data: LaunchReadinessData }) {
    const form = useForm<vulnerabilityReviewsFormValues>({ resolver: zodResolver(vulnerabilityReviewsFormSchema), defaultValues: {"readinessHubId":"","reviewKey":"","vulnerabilityRef":"","severity":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Vulnerability Reviews" description="Enterprise launch readiness vulnerability reviews" /><div className="mt-6 space-y-3">
                {data.vulnerabilityReviews.length === 0 ? <EmptyState title="No vulnerability reviews" description="Create the first vulnerability reviews record." /> : data.vulnerabilityReviews.map((item) => (
                    <ListCard key={item.id} title={String(item.reviewKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.severity}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create vulnerability reviews" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createVulnerabilityReview(v))}>
                <ReadinessHubSelect data={data} {...form.register("readinessHubId")} />
                <input {...form.register("reviewKey")} placeholder="reviewKey" className={inputClass} />
                <input {...form.register("vulnerabilityRef")} placeholder="vulnerabilityRef" className={inputClass} />
                <select {...form.register("severity")} className={inputClass}>{ALERT_SEVERITY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function PermissionAuditsPanel({ data }: { data: LaunchReadinessData }) {
    const form = useForm<permissionAuditsFormValues>({ resolver: zodResolver(permissionAuditsFormSchema), defaultValues: {"readinessHubId":"","auditKey":"","auditScope":"","findingCount":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Permission Audits" description="Enterprise launch readiness permission audits" /><div className="mt-6 space-y-3">
                {data.permissionAudits.length === 0 ? <EmptyState title="No permission audits" description="Create the first permission audits record." /> : data.permissionAudits.map((item) => (
                    <ListCard key={item.id} title={String(item.auditKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.auditScope}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create permission audits" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createPermissionAudit(v))}>
                <ReadinessHubSelect data={data} {...form.register("readinessHubId")} />
                <input {...form.register("auditKey")} placeholder="auditKey" className={inputClass} />
                <input {...form.register("auditScope")} placeholder="auditScope" className={inputClass} />
                <input type="number" step="any" {...form.register("findingCount", { valueAsNumber: true })} placeholder="findingCount" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ComplianceReviewsPanel({ data }: { data: LaunchReadinessData }) {
    const form = useForm<complianceReviewsFormValues>({ resolver: zodResolver(complianceReviewsFormSchema), defaultValues: {"readinessHubId":"","reviewKey":"","complianceType":"","reviewScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Compliance Reviews" description="Enterprise launch readiness compliance reviews" /><div className="mt-6 space-y-3">
                {data.complianceReviews.length === 0 ? <EmptyState title="No compliance reviews" description="Create the first compliance reviews record." /> : data.complianceReviews.map((item) => (
                    <ListCard key={item.id} title={String(item.reviewKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.complianceType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create compliance reviews" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createComplianceReview(v))}>
                <ReadinessHubSelect data={data} {...form.register("readinessHubId")} />
                <input {...form.register("reviewKey")} placeholder="reviewKey" className={inputClass} />
                <input {...form.register("complianceType")} placeholder="complianceType" className={inputClass} />
                <input type="number" step="any" {...form.register("reviewScore", { valueAsNumber: true })} placeholder="reviewScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function AdminGuidesPanel({ data }: { data: LaunchReadinessData }) {
    const form = useForm<adminGuidesFormValues>({ resolver: zodResolver(adminGuidesFormSchema), defaultValues: {"readinessHubId":"","guideKey":"","guideTitle":"","guideVersion":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Admin Guides" description="Enterprise launch readiness admin guides" /><div className="mt-6 space-y-3">
                {data.adminGuides.length === 0 ? <EmptyState title="No admin guides" description="Create the first admin guides record." /> : data.adminGuides.map((item) => (
                    <ListCard key={item.id} title={String(item.guideTitle)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.guideVersion}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create admin guides" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createAdminGuide(v))}>
                <ReadinessHubSelect data={data} {...form.register("readinessHubId")} />
                <input {...form.register("guideKey")} placeholder="guideKey" className={inputClass} />
                <input {...form.register("guideTitle")} placeholder="guideTitle" className={inputClass} />
                <input {...form.register("guideVersion")} placeholder="guideVersion" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function UserGuidesPanel({ data }: { data: LaunchReadinessData }) {
    const form = useForm<userGuidesFormValues>({ resolver: zodResolver(userGuidesFormSchema), defaultValues: {"readinessHubId":"","guideKey":"","guideTitle":"","guideVersion":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="User Guides" description="Enterprise launch readiness user guides" /><div className="mt-6 space-y-3">
                {data.userGuides.length === 0 ? <EmptyState title="No user guides" description="Create the first user guides record." /> : data.userGuides.map((item) => (
                    <ListCard key={item.id} title={String(item.guideTitle)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.guideVersion}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create user guides" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createUserGuide(v))}>
                <ReadinessHubSelect data={data} {...form.register("readinessHubId")} />
                <input {...form.register("guideKey")} placeholder="guideKey" className={inputClass} />
                <input {...form.register("guideTitle")} placeholder="guideTitle" className={inputClass} />
                <input {...form.register("guideVersion")} placeholder="guideVersion" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function DeploymentGuidesPanel({ data }: { data: LaunchReadinessData }) {
    const form = useForm<deploymentGuidesFormValues>({ resolver: zodResolver(deploymentGuidesFormSchema), defaultValues: {"readinessHubId":"","guideKey":"","guideTitle":"","guideVersion":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Deployment Guides" description="Enterprise launch readiness deployment guides" /><div className="mt-6 space-y-3">
                {data.deploymentGuides.length === 0 ? <EmptyState title="No deployment guides" description="Create the first deployment guides record." /> : data.deploymentGuides.map((item) => (
                    <ListCard key={item.id} title={String(item.guideTitle)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.guideVersion}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create deployment guides" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDeploymentGuide(v))}>
                <ReadinessHubSelect data={data} {...form.register("readinessHubId")} />
                <input {...form.register("guideKey")} placeholder="guideKey" className={inputClass} />
                <input {...form.register("guideTitle")} placeholder="guideTitle" className={inputClass} />
                <input {...form.register("guideVersion")} placeholder="guideVersion" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function LaunchScoreMetricsPanel({ data }: { data: LaunchReadinessData }) {
    const form = useForm<launchScoreMetricsFormValues>({ resolver: zodResolver(launchScoreMetricsFormSchema), defaultValues: {"metricsKey":"","documentationScore":0,"overallLaunchScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Launch Score Metrics" description="Enterprise launch readiness launch score metrics" /><div className="mt-6 space-y-3">
                {data.launchScoreMetrics.length === 0 ? <EmptyState title="No launch score metrics" description="Create the first launch score metrics record." /> : data.launchScoreMetrics.map((item) => (
                    <ListCard key={item.id} title={String(item.metricsKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.overallLaunchScore}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create launch score metrics" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createLaunchScoreMetric(v))}>
                <input {...form.register("metricsKey")} placeholder="metricsKey" className={inputClass} />
                <input type="number" step="any" {...form.register("documentationScore", { valueAsNumber: true })} placeholder="documentationScore" className={inputClass} />
                <input type="number" step="any" {...form.register("overallLaunchScore", { valueAsNumber: true })} placeholder="overallLaunchScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ReadinessValidationsPanel({ data }: { data: LaunchReadinessData }) {
    const form = useForm<readinessValidationsFormValues>({ resolver: zodResolver(readinessValidationsFormSchema), defaultValues: {"readinessHubId":"","validationKey":"","validationType":"","validationScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Readiness Validations" description="Enterprise launch readiness readiness validations" /><div className="mt-6 space-y-3">
                {data.readinessValidations.length === 0 ? <EmptyState title="No readiness validations" description="Create the first readiness validations record." /> : data.readinessValidations.map((item) => (
                    <ListCard key={item.id} title={String(item.validationKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.validationType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create readiness validations" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createReadinessValidation(v))}>
                <ReadinessHubSelect data={data} {...form.register("readinessHubId")} />
                <input {...form.register("validationKey")} placeholder="validationKey" className={inputClass} />
                <input {...form.register("validationType")} placeholder="validationType" className={inputClass} />
                <input type="number" step="any" {...form.register("validationScore", { valueAsNumber: true })} placeholder="validationScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function LaunchBlockersPanel({ data }: { data: LaunchReadinessData }) {
    const form = useForm<launchBlockersFormValues>({ resolver: zodResolver(launchBlockersFormSchema), defaultValues: {"readinessHubId":"","blockerKey":"","blockerTitle":"","blockerSeverity":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Launch Blockers" description="Enterprise launch readiness launch blockers" /><div className="mt-6 space-y-3">
                {data.launchBlockers.length === 0 ? <EmptyState title="No launch blockers" description="Create the first launch blockers record." /> : data.launchBlockers.map((item) => (
                    <ListCard key={item.id} title={String(item.blockerTitle)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.blockerSeverity}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create launch blockers" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createLaunchBlocker(v))}>
                <ReadinessHubSelect data={data} {...form.register("readinessHubId")} />
                <input {...form.register("blockerKey")} placeholder="blockerKey" className={inputClass} />
                <input {...form.register("blockerTitle")} placeholder="blockerTitle" className={inputClass} />
                <select {...form.register("blockerSeverity")} className={inputClass}>{ALERT_SEVERITY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ScoreSnapshotsPanel({ data }: { data: LaunchReadinessData }) {
    const form = useForm<scoreSnapshotsFormValues>({ resolver: zodResolver(scoreSnapshotsFormSchema), defaultValues: {"readinessHubId":"","snapshotKey":"","snapshotDate":"","overallLaunchScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Score Snapshots" description="Enterprise launch readiness score snapshots" /><div className="mt-6 space-y-3">
                {data.scoreSnapshots.length === 0 ? <EmptyState title="No score snapshots" description="Create the first score snapshots record." /> : data.scoreSnapshots.map((item) => (
                    <ListCard key={item.id} title={String(item.snapshotKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.snapshotDate}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create score snapshots" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createScoreSnapshot(v))}>
                <ReadinessHubSelect data={data} {...form.register("readinessHubId")} />
                <input {...form.register("snapshotKey")} placeholder="snapshotKey" className={inputClass} />
                <input {...form.register("snapshotDate")} placeholder="snapshotDate" className={inputClass} />
                <input type="number" step="any" {...form.register("overallLaunchScore", { valueAsNumber: true })} placeholder="overallLaunchScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function LaunchHealthsPanel({ data }: { data: LaunchReadinessData }) {
    const form = useForm<launchHealthFormValues>({ resolver: zodResolver(launchHealthFormSchema), defaultValues: {"healthKey":"","overallScore":0,"disasterRecoveryMode":false} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Launch Health" description="Enterprise launch readiness launch health" /><div className="mt-6 space-y-3">
                {data.launchHealth.length === 0 ? <EmptyState title="No launch health" description="Create the first launch health record." /> : data.launchHealth.map((item) => (
                    <ListCard key={item.id} title={String(item.healthKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.overallScore}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create launch health" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createLaunchHealth(v))}>
                <input {...form.register("healthKey")} placeholder="healthKey" className={inputClass} />
                <input type="number" step="any" {...form.register("overallScore", { valueAsNumber: true })} placeholder="overallScore" className={inputClass} />
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...form.register("disasterRecoveryMode")} /> disasterRecoveryMode</label>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function CriticalIssuesPanel({ data }: { data: LaunchReadinessData }) {
    const form = useForm<criticalIssuesFormValues>({ resolver: zodResolver(criticalIssuesFormSchema), defaultValues: {"readinessHubId":"","issueKey":"","issueTitle":"","issueSeverity":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Critical Issues" description="Enterprise launch readiness critical issues" /><div className="mt-6 space-y-3">
                {data.criticalIssues.length === 0 ? <EmptyState title="No critical issues" description="Create the first critical issues record." /> : data.criticalIssues.map((item) => (
                    <ListCard key={item.id} title={String(item.issueTitle)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.issueSeverity}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create critical issues" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createCriticalIssue(v))}>
                <ReadinessHubSelect data={data} {...form.register("readinessHubId")} />
                <input {...form.register("issueKey")} placeholder="issueKey" className={inputClass} />
                <input {...form.register("issueTitle")} placeholder="issueTitle" className={inputClass} />
                <select {...form.register("issueSeverity")} className={inputClass}>{ALERT_SEVERITY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ReadinessWarningsPanel({ data }: { data: LaunchReadinessData }) {
    const form = useForm<readinessWarningsFormValues>({ resolver: zodResolver(readinessWarningsFormSchema), defaultValues: {"readinessHubId":"","warningKey":"","warningType":"","warningMessage":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Readiness Warnings" description="Enterprise launch readiness readiness warnings" /><div className="mt-6 space-y-3">
                {data.readinessWarnings.length === 0 ? <EmptyState title="No readiness warnings" description="Create the first readiness warnings record." /> : data.readinessWarnings.map((item) => (
                    <ListCard key={item.id} title={String(item.warningKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.warningType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create readiness warnings" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createReadinessWarning(v))}>
                <ReadinessHubSelect data={data} {...form.register("readinessHubId")} />
                <input {...form.register("warningKey")} placeholder="warningKey" className={inputClass} />
                <input {...form.register("warningType")} placeholder="warningType" className={inputClass} />
                <input {...form.register("warningMessage")} placeholder="warningMessage" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function LaunchFailuresPanel({ data }: { data: LaunchReadinessData }) {
    const form = useForm<launchFailuresFormValues>({ resolver: zodResolver(launchFailuresFormSchema), defaultValues: {"readinessHubId":"","failureKey":"","failureType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Launch Failures" description="Enterprise launch readiness launch failures" /><div className="mt-6 space-y-3">
                {data.launchFailures.length === 0 ? <EmptyState title="No launch failures" description="Create the first launch failures record." /> : data.launchFailures.map((item) => (
                    <ListCard key={item.id} title={String(item.failureKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.failureType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create launch failures" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createLaunchFailure(v))}>
                <ReadinessHubSelect data={data} {...form.register("readinessHubId")} />
                <input {...form.register("failureKey")} placeholder="failureKey" className={inputClass} />
                <input {...form.register("failureType")} placeholder="failureType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function LaunchReadinessAuditLogsPanel({ data }: { data: LaunchReadinessData }) {
    return (
        <Card hover><SectionHeader title="Launch Readiness audit history" description="Security-first audit trail for jobs, events, launchBlockers, and marketplace operations" /><div className="mt-6 space-y-3">
            {data.auditLogs.length === 0 ? <EmptyState title="No audit entries" description="Audit logs are created automatically for launch readiness." /> : data.auditLogs.map((entry) => (
                <ListCard key={entry.id} title={entry.summary} subtitle={`${entry.entityType} • ${entry.action}`} meta={`${entry.securityLevel} • ${new Date(entry.createdAt).toLocaleString()}`} />
            ))}
        </div></Card>
    );
}

export function LaunchReadinessSdkPanel({ data }: { data: LaunchReadinessData }) {
    return (
        <Card hover><SectionHeader title="Shared Launch Readiness SDK" description="Import from @/src/modules/launch-readiness/sdk for environment validation, deployment check, and recovery drill" /><div className="mt-6 space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <ListCard title="createLaunchReadinessClient()" subtitle="Factory for module-scoped Launch Readiness client with auth context" meta="Primary SDK for enterprise launch readiness" />
            <ListCard title="sdkValidateEnvironment()" subtitle="Validate production environment with AI orchestration" meta="moduleSource: launch_readiness" />
            <ListCard title="sdkRunDeploymentCheck()" subtitle="Run deployment readiness check with knowledge context" meta="v1/v2/v3 API versions" />
            <ListCard title="sdkRunRecoveryDrill()" subtitle="Run recovery drill with audit trail" meta="Event-driven integration delivery" />
            <p className="text-xs text-slate-500">Theme: {ELR_THEME.primary} • Integration hubs loaded: {data.readinessHubs.length}</p>
            <pre className="overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">{`import { createLaunchReadinessClient } from "@/src/modules/launch-readiness/sdk";

const intg = createLaunchReadinessClient(userId, email, fullName);
await intg.validateEnvironment({ readinessHubId, serviceKey: "svc-001", serviceName: "Stripe" });
await intg.runDeploymentCheck({ readinessHubId, keyName: "prod-key", apiVersion: "v1" });
await intg.runRecoveryDrill({ readinessHubId, webhookKey: "wh-001", webhookName: "Events" });`}</pre>
        </div></Card>
    );
}
