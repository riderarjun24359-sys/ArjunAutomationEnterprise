"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/src/components/ui/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { COP_THEME, FLOW_STATUS_OPTIONS, PROVISION_STATUS_OPTIONS, DOMAIN_STATUS_OPTIONS, VERIFICATION_STATUS_OPTIONS, WIZARD_STATUS_OPTIONS, PROFILE_STATUS_OPTIONS, JOB_STATUS_OPTIONS, VALIDATION_STATUS_OPTIONS, ROLLBACK_STATUS_OPTIONS, AUDIT_STATUS_OPTIONS, COLLECTOR_STATUS_OPTIONS, TRACE_STATUS_OPTIONS, ALERT_SEVERITY_OPTIONS, INCIDENT_STATUS_OPTIONS, SCHEDULE_STATUS_OPTIONS, RESTORE_STATUS_OPTIONS, MAINTENANCE_STATUS_OPTIONS, FLAG_STATUS_OPTIONS, DIAGNOSTIC_STATUS_OPTIONS, BETA_STATUS_OPTIONS, INVITATION_STATUS_OPTIONS, REQUEST_STATUS_OPTIONS, BUG_STATUS_OPTIONS, CHANNEL_STATUS_OPTIONS } from "@/src/modules/customer-operated-platform/constants";
import type { useCustomerOperatedPlatform } from "@/src/modules/customer-operated-platform/hooks/useCustomerOperatedPlatform";
import {
    operatedHubsFormSchema,
    type operatedHubsFormValues,
    signupFlowsFormSchema,
    type signupFlowsFormValues,
    orgProvisioningFormSchema,
    type orgProvisioningFormValues,
    domainOnboardingFormSchema,
    type domainOnboardingFormValues,
    emailVerificationsFormSchema,
    type emailVerificationsFormValues,
    onboardingWizardsFormSchema,
    type onboardingWizardsFormValues,
    productionProfilesFormSchema,
    type productionProfilesFormValues,
    deploymentJobsFormSchema,
    type deploymentJobsFormValues,
    healthValidationsFormSchema,
    type healthValidationsFormValues,
    rollbackAutomationsFormSchema,
    type rollbackAutomationsFormValues,
    deploymentAuditsFormSchema,
    type deploymentAuditsFormValues,
    centralLogsFormSchema,
    type centralLogsFormValues,
    metricsCollectorsFormSchema,
    type metricsCollectorsFormValues,
    distributedTracesFormSchema,
    type distributedTracesFormValues,
    alertRulesFormSchema,
    type alertRulesFormValues,
    incidentTimelinesFormSchema,
    type incidentTimelinesFormValues,
    backupSchedulersFormSchema,
    type backupSchedulersFormValues,
    restoreValidationsFormSchema,
    type restoreValidationsFormValues,
    maintenanceModesFormSchema,
    type maintenanceModesFormValues,
    featureFlagOpsFormSchema,
    type featureFlagOpsFormValues,
    platformDiagnosticsFormSchema,
    type platformDiagnosticsFormValues,
    betaOrganizationsFormSchema,
    type betaOrganizationsFormValues,
    betaInvitationsFormSchema,
    type betaInvitationsFormValues,
    feedbackCollectionFormSchema,
    type feedbackCollectionFormValues,
    featureRequestsFormSchema,
    type featureRequestsFormValues,
    bugReportsFormSchema,
    type bugReportsFormValues,
    releaseChannelsFormSchema,
    type releaseChannelsFormValues,
    operatedMetricsFormSchema,
    type operatedMetricsFormValues,
    operatedHealthFormSchema,
    type operatedHealthFormValues,
    executiveBriefingsFormSchema,
    type executiveBriefingsFormValues,
    platformFailuresFormSchema,
    type platformFailuresFormValues,
} from "@/src/modules/customer-operated-platform/schemas";

type RetailData = ReturnType<typeof useCustomerOperatedPlatform>;
const inputClass = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-violet-500/20 focus:ring-4 dark:border-slate-800 dark:bg-violet-950";
function SaveButton({ loading, label = "Save changes" }: { loading?: boolean; label?: string }) {
    return <button type="submit" disabled={loading} className="rounded-full bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-violet-500 disabled:opacity-60">{loading ? "Saving..." : label}</button>;
}
function ListCard({ title, subtitle, meta }: { title: string; subtitle: string; meta?: string }) {
    return <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800"><p className="font-medium">{title}</p><p className="text-sm text-violet-500">{subtitle}</p>{meta ? <p className="mt-1 text-xs text-violet-600">{meta}</p> : null}</div>;
}
function OperatedHubSelect({ data, ...props }: { data: RetailData } & React.SelectHTMLAttributes<HTMLSelectElement>) {
    return <select {...props} className={inputClass}><option value="">Select retail operating system</option>{data.operatedHubOptions.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>;
}

export function RetailOverviewPanel({ data }: { data: RetailData }) {
    const pipeline = data.pipeline;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="Customer Operated Platform summary" description="System health, background jobs, event bus, centralLogs, feature flags, configuration, diagnostics, and operations dashboard" /><div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ListCard title="Operated Hubs" subtitle={`${data.stats?.totalOperatedHubs ?? 0} total`} meta={`${data.stats?.activeOperatedHubs ?? 0} active • ${data.stats?.signupFlowCount ?? 0} dining areas`} />
                <ListCard title="Connectors" subtitle={`${data.stats?.deploymentJobCount ?? 0} menu categories`} meta={`${data.stats?.productionProfileCount ?? 0} productionProfiles • ${data.stats?.centralLogCount ?? 0} open centralLogs`} />
                <ListCard title="Health" subtitle={`${(data.stats?.overallOperatedScore ?? 0).toFixed(1)} overall retail score`} meta={`${data.stats?.openPlatformFailureCount ?? 0} open failures`} />
                <ListCard title="Audit Trail" subtitle={`${data.stats?.auditCount ?? 0} audit entries`} meta="Security-first retail operating system" />
            </div></Card>
            <Card hover><SectionHeader title="Retail operating system pipeline" description={`${pipeline?.previousStage ?? "configured"} → ${pipeline?.currentStage ?? "active"} → ${pipeline?.nextStage ?? "degraded"}`} /><div className="mt-6 space-y-3">
                {pipeline?.stages?.length ? pipeline.stages.map((stage) => (
                    <ListCard key={stage.key} title={stage.label} subtitle={stage.key} meta={stage.label} />
                )) : <EmptyState title="No pipeline data" description="Retail operating system pipeline stages will appear as hubs are configured." />}
            </div></Card>
        </div>
    );
}

export function OperatedHubsPanel({ data }: { data: RetailData }) {
    const form = useForm<operatedHubsFormValues>({ resolver: zodResolver(operatedHubsFormSchema), defaultValues: {"hubKey":"","hubName":"","environment":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Operated Hubs" description="Enterprise retail operating system operated hubs" /><div className="mt-6 space-y-3">
                {data.operatedHubs.length === 0 ? <EmptyState title="No operated hubs" description="Create the first operated hubs record." /> : data.operatedHubs.map((item) => (
                    <ListCard key={item.id} title={String(item.hubName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.hubKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create operated hubs" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createOperatedHub(v))}>
                <input {...form.register("hubKey")} placeholder="hubKey" className={inputClass} />
                <input {...form.register("hubName")} placeholder="hubName" className={inputClass} />
                <input {...form.register("environment")} placeholder="environment" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function SignupFlowsPanel({ data }: { data: RetailData }) {
    const form = useForm<signupFlowsFormValues>({ resolver: zodResolver(signupFlowsFormSchema), defaultValues: {"operatedHubId":"","flowKey":"","flowName":"","flowStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Signup Flows" description="Enterprise retail operating system signup flows" /><div className="mt-6 space-y-3">
                {data.signupFlows.length === 0 ? <EmptyState title="No signup flows" description="Create the first signup flows record." /> : data.signupFlows.map((item) => (
                    <ListCard key={item.id} title={String(item.flowName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.flowStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create signup flows" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createSignupFlow(v))}>
                <OperatedHubSelect data={data} {...form.register("operatedHubId")} />
                <input {...form.register("flowKey")} placeholder="flowKey" className={inputClass} />
                <input {...form.register("flowName")} placeholder="flowName" className={inputClass} />
                <select {...form.register("flowStatus")} className={inputClass}>{FLOW_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function OrgProvisioningsPanel({ data }: { data: RetailData }) {
    const form = useForm<orgProvisioningFormValues>({ resolver: zodResolver(orgProvisioningFormSchema), defaultValues: {"operatedHubId":"","provisionKey":"","provisionName":"","provisionStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Org Provisioning" description="Enterprise retail operating system org provisioning" /><div className="mt-6 space-y-3">
                {data.orgProvisioning.length === 0 ? <EmptyState title="No org provisioning" description="Create the first org provisioning record." /> : data.orgProvisioning.map((item) => (
                    <ListCard key={item.id} title={String(item.provisionName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.provisionStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create org provisioning" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createOrgProvisioning(v))}>
                <OperatedHubSelect data={data} {...form.register("operatedHubId")} />
                <input {...form.register("provisionKey")} placeholder="provisionKey" className={inputClass} />
                <input {...form.register("provisionName")} placeholder="provisionName" className={inputClass} />
                <select {...form.register("provisionStatus")} className={inputClass}>{PROVISION_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function DomainOnboardingsPanel({ data }: { data: RetailData }) {
    const form = useForm<domainOnboardingFormValues>({ resolver: zodResolver(domainOnboardingFormSchema), defaultValues: {"operatedHubId":"","domainKey":"","domainName":"","domainStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Domain Onboarding" description="Enterprise retail operating system domain onboarding" /><div className="mt-6 space-y-3">
                {data.domainOnboarding.length === 0 ? <EmptyState title="No domain onboarding" description="Create the first domain onboarding record." /> : data.domainOnboarding.map((item) => (
                    <ListCard key={item.id} title={String(item.domainName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.domainStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create domain onboarding" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDomainOnboarding(v))}>
                <OperatedHubSelect data={data} {...form.register("operatedHubId")} />
                <input {...form.register("domainKey")} placeholder="domainKey" className={inputClass} />
                <input {...form.register("domainName")} placeholder="domainName" className={inputClass} />
                <select {...form.register("domainStatus")} className={inputClass}>{DOMAIN_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function EmailVerificationsPanel({ data }: { data: RetailData }) {
    const form = useForm<emailVerificationsFormValues>({ resolver: zodResolver(emailVerificationsFormSchema), defaultValues: {"operatedHubId":"","verificationKey":"","emailAddress":"","verificationStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Email Verifications" description="Enterprise retail operating system email verifications" /><div className="mt-6 space-y-3">
                {data.emailVerifications.length === 0 ? <EmptyState title="No email verifications" description="Create the first email verifications record." /> : data.emailVerifications.map((item) => (
                    <ListCard key={item.id} title={String(item.emailAddress)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.verificationStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create email verifications" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createEmailVerification(v))}>
                <OperatedHubSelect data={data} {...form.register("operatedHubId")} />
                <input {...form.register("verificationKey")} placeholder="verificationKey" className={inputClass} />
                <input {...form.register("emailAddress")} placeholder="emailAddress" className={inputClass} />
                <select {...form.register("verificationStatus")} className={inputClass}>{VERIFICATION_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function OnboardingWizardsPanel({ data }: { data: RetailData }) {
    const form = useForm<onboardingWizardsFormValues>({ resolver: zodResolver(onboardingWizardsFormSchema), defaultValues: {"operatedHubId":"","wizardKey":"","wizardName":"","wizardStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Onboarding Wizards" description="Enterprise retail operating system onboarding wizards" /><div className="mt-6 space-y-3">
                {data.onboardingWizards.length === 0 ? <EmptyState title="No onboarding wizards" description="Create the first onboarding wizards record." /> : data.onboardingWizards.map((item) => (
                    <ListCard key={item.id} title={String(item.wizardName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.wizardStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create onboarding wizards" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createOnboardingWizard(v))}>
                <OperatedHubSelect data={data} {...form.register("operatedHubId")} />
                <input {...form.register("wizardKey")} placeholder="wizardKey" className={inputClass} />
                <input {...form.register("wizardName")} placeholder="wizardName" className={inputClass} />
                <select {...form.register("wizardStatus")} className={inputClass}>{WIZARD_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ProductionProfilesPanel({ data }: { data: RetailData }) {
    const form = useForm<productionProfilesFormValues>({ resolver: zodResolver(productionProfilesFormSchema), defaultValues: {"operatedHubId":"","profileKey":"","profileName":"","profileStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Production Profiles" description="Enterprise retail operating system production profiles" /><div className="mt-6 space-y-3">
                {data.productionProfiles.length === 0 ? <EmptyState title="No production profiles" description="Create the first production profiles record." /> : data.productionProfiles.map((item) => (
                    <ListCard key={item.id} title={String(item.profileName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.profileStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create production profiles" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createProductionProfile(v))}>
                <OperatedHubSelect data={data} {...form.register("operatedHubId")} />
                <input {...form.register("profileKey")} placeholder="profileKey" className={inputClass} />
                <input {...form.register("profileName")} placeholder="profileName" className={inputClass} />
                <select {...form.register("profileStatus")} className={inputClass}>{PROFILE_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function DeploymentJobsPanel({ data }: { data: RetailData }) {
    const form = useForm<deploymentJobsFormValues>({ resolver: zodResolver(deploymentJobsFormSchema), defaultValues: {"operatedHubId":"","jobKey":"","jobName":"","jobStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Deployment Jobs" description="Enterprise retail operating system deployment jobs" /><div className="mt-6 space-y-3">
                {data.deploymentJobs.length === 0 ? <EmptyState title="No deployment jobs" description="Create the first deployment jobs record." /> : data.deploymentJobs.map((item) => (
                    <ListCard key={item.id} title={String(item.jobName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.jobStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create deployment jobs" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDeploymentJob(v))}>
                <OperatedHubSelect data={data} {...form.register("operatedHubId")} />
                <input {...form.register("jobKey")} placeholder="jobKey" className={inputClass} />
                <input {...form.register("jobName")} placeholder="jobName" className={inputClass} />
                <select {...form.register("jobStatus")} className={inputClass}>{JOB_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function HealthValidationsPanel({ data }: { data: RetailData }) {
    const form = useForm<healthValidationsFormValues>({ resolver: zodResolver(healthValidationsFormSchema), defaultValues: {"operatedHubId":"","validationKey":"","validationName":"","validationStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Health Validations" description="Enterprise retail operating system health validations" /><div className="mt-6 space-y-3">
                {data.healthValidations.length === 0 ? <EmptyState title="No health validations" description="Create the first health validations record." /> : data.healthValidations.map((item) => (
                    <ListCard key={item.id} title={String(item.validationName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.validationStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create health validations" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createHealthValidation(v))}>
                <OperatedHubSelect data={data} {...form.register("operatedHubId")} />
                <input {...form.register("validationKey")} placeholder="validationKey" className={inputClass} />
                <input {...form.register("validationName")} placeholder="validationName" className={inputClass} />
                <select {...form.register("validationStatus")} className={inputClass}>{VALIDATION_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function RollbackAutomationsPanel({ data }: { data: RetailData }) {
    const form = useForm<rollbackAutomationsFormValues>({ resolver: zodResolver(rollbackAutomationsFormSchema), defaultValues: {"operatedHubId":"","rollbackKey":"","rollbackName":"","rollbackStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Rollback Automations" description="Enterprise retail operating system rollback automations" /><div className="mt-6 space-y-3">
                {data.rollbackAutomations.length === 0 ? <EmptyState title="No rollback automations" description="Create the first rollback automations record." /> : data.rollbackAutomations.map((item) => (
                    <ListCard key={item.id} title={String(item.rollbackName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.rollbackStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create rollback automations" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRollbackAutomation(v))}>
                <OperatedHubSelect data={data} {...form.register("operatedHubId")} />
                <input {...form.register("rollbackKey")} placeholder="rollbackKey" className={inputClass} />
                <input {...form.register("rollbackName")} placeholder="rollbackName" className={inputClass} />
                <select {...form.register("rollbackStatus")} className={inputClass}>{ROLLBACK_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function DeploymentAuditsPanel({ data }: { data: RetailData }) {
    const form = useForm<deploymentAuditsFormValues>({ resolver: zodResolver(deploymentAuditsFormSchema), defaultValues: {"operatedHubId":"","auditKey":"","auditName":"","auditStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Deployment Audits" description="Enterprise retail operating system deployment audits" /><div className="mt-6 space-y-3">
                {data.deploymentAudits.length === 0 ? <EmptyState title="No deployment audits" description="Create the first deployment audits record." /> : data.deploymentAudits.map((item) => (
                    <ListCard key={item.id} title={String(item.auditName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.auditStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create deployment audits" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDeploymentAudit(v))}>
                <OperatedHubSelect data={data} {...form.register("operatedHubId")} />
                <input {...form.register("auditKey")} placeholder="auditKey" className={inputClass} />
                <input {...form.register("auditName")} placeholder="auditName" className={inputClass} />
                <select {...form.register("auditStatus")} className={inputClass}>{AUDIT_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function CentralLogsPanel({ data }: { data: RetailData }) {
    const form = useForm<centralLogsFormValues>({ resolver: zodResolver(centralLogsFormSchema), defaultValues: {"operatedHubId":"","logKey":"","logSource":"","logLevel":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Central Logs" description="Enterprise retail operating system central logs" /><div className="mt-6 space-y-3">
                {data.centralLogs.length === 0 ? <EmptyState title="No central logs" description="Create the first central logs record." /> : data.centralLogs.map((item) => (
                    <ListCard key={item.id} title={String(item.logSource)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.logLevel}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create central logs" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createCentralLog(v))}>
                <OperatedHubSelect data={data} {...form.register("operatedHubId")} />
                <input {...form.register("logKey")} placeholder="logKey" className={inputClass} />
                <input {...form.register("logSource")} placeholder="logSource" className={inputClass} />
                <input {...form.register("logLevel")} placeholder="logLevel" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function MetricsCollectorsPanel({ data }: { data: RetailData }) {
    const form = useForm<metricsCollectorsFormValues>({ resolver: zodResolver(metricsCollectorsFormSchema), defaultValues: {"operatedHubId":"","collectorKey":"","collectorName":"","collectorStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Metrics Collectors" description="Enterprise retail operating system metrics collectors" /><div className="mt-6 space-y-3">
                {data.metricsCollectors.length === 0 ? <EmptyState title="No metrics collectors" description="Create the first metrics collectors record." /> : data.metricsCollectors.map((item) => (
                    <ListCard key={item.id} title={String(item.collectorName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.collectorStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create metrics collectors" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createMetricsCollector(v))}>
                <OperatedHubSelect data={data} {...form.register("operatedHubId")} />
                <input {...form.register("collectorKey")} placeholder="collectorKey" className={inputClass} />
                <input {...form.register("collectorName")} placeholder="collectorName" className={inputClass} />
                <select {...form.register("collectorStatus")} className={inputClass}>{COLLECTOR_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function DistributedTracesPanel({ data }: { data: RetailData }) {
    const form = useForm<distributedTracesFormValues>({ resolver: zodResolver(distributedTracesFormSchema), defaultValues: {"operatedHubId":"","traceKey":"","traceName":"","traceStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Distributed Traces" description="Enterprise retail operating system distributed traces" /><div className="mt-6 space-y-3">
                {data.distributedTraces.length === 0 ? <EmptyState title="No distributed traces" description="Create the first distributed traces record." /> : data.distributedTraces.map((item) => (
                    <ListCard key={item.id} title={String(item.traceName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.traceStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create distributed traces" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDistributedTrace(v))}>
                <OperatedHubSelect data={data} {...form.register("operatedHubId")} />
                <input {...form.register("traceKey")} placeholder="traceKey" className={inputClass} />
                <input {...form.register("traceName")} placeholder="traceName" className={inputClass} />
                <select {...form.register("traceStatus")} className={inputClass}>{TRACE_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function AlertRulesPanel({ data }: { data: RetailData }) {
    const form = useForm<alertRulesFormValues>({ resolver: zodResolver(alertRulesFormSchema), defaultValues: {"operatedHubId":"","ruleKey":"","ruleName":"","severity":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Alert Rules" description="Enterprise retail operating system alert rules" /><div className="mt-6 space-y-3">
                {data.alertRules.length === 0 ? <EmptyState title="No alert rules" description="Create the first alert rules record." /> : data.alertRules.map((item) => (
                    <ListCard key={item.id} title={String(item.ruleName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.severity}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create alert rules" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createAlertRule(v))}>
                <OperatedHubSelect data={data} {...form.register("operatedHubId")} />
                <input {...form.register("ruleKey")} placeholder="ruleKey" className={inputClass} />
                <input {...form.register("ruleName")} placeholder="ruleName" className={inputClass} />
                <select {...form.register("severity")} className={inputClass}>{ALERT_SEVERITY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function IncidentTimelinesPanel({ data }: { data: RetailData }) {
    const form = useForm<incidentTimelinesFormValues>({ resolver: zodResolver(incidentTimelinesFormSchema), defaultValues: {"operatedHubId":"","incidentKey":"","incidentTitle":"","incidentStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Incident Timelines" description="Enterprise retail operating system incident timelines" /><div className="mt-6 space-y-3">
                {data.incidentTimelines.length === 0 ? <EmptyState title="No incident timelines" description="Create the first incident timelines record." /> : data.incidentTimelines.map((item) => (
                    <ListCard key={item.id} title={String(item.incidentTitle)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.incidentStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create incident timelines" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createIncidentTimeline(v))}>
                <OperatedHubSelect data={data} {...form.register("operatedHubId")} />
                <input {...form.register("incidentKey")} placeholder="incidentKey" className={inputClass} />
                <input {...form.register("incidentTitle")} placeholder="incidentTitle" className={inputClass} />
                <select {...form.register("incidentStatus")} className={inputClass}>{INCIDENT_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function BackupSchedulersPanel({ data }: { data: RetailData }) {
    const form = useForm<backupSchedulersFormValues>({ resolver: zodResolver(backupSchedulersFormSchema), defaultValues: {"operatedHubId":"","scheduleKey":"","scheduleName":"","scheduleStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Backup Schedulers" description="Enterprise retail operating system backup schedulers" /><div className="mt-6 space-y-3">
                {data.backupSchedulers.length === 0 ? <EmptyState title="No backup schedulers" description="Create the first backup schedulers record." /> : data.backupSchedulers.map((item) => (
                    <ListCard key={item.id} title={String(item.scheduleName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.scheduleStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create backup schedulers" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createBackupScheduler(v))}>
                <OperatedHubSelect data={data} {...form.register("operatedHubId")} />
                <input {...form.register("scheduleKey")} placeholder="scheduleKey" className={inputClass} />
                <input {...form.register("scheduleName")} placeholder="scheduleName" className={inputClass} />
                <select {...form.register("scheduleStatus")} className={inputClass}>{SCHEDULE_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function RestoreValidationsPanel({ data }: { data: RetailData }) {
    const form = useForm<restoreValidationsFormValues>({ resolver: zodResolver(restoreValidationsFormSchema), defaultValues: {"operatedHubId":"","restoreKey":"","restoreName":"","restoreStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Restore Validations" description="Enterprise retail operating system restore validations" /><div className="mt-6 space-y-3">
                {data.restoreValidations.length === 0 ? <EmptyState title="No restore validations" description="Create the first restore validations record." /> : data.restoreValidations.map((item) => (
                    <ListCard key={item.id} title={String(item.restoreName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.restoreStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create restore validations" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRestoreValidation(v))}>
                <OperatedHubSelect data={data} {...form.register("operatedHubId")} />
                <input {...form.register("restoreKey")} placeholder="restoreKey" className={inputClass} />
                <input {...form.register("restoreName")} placeholder="restoreName" className={inputClass} />
                <select {...form.register("restoreStatus")} className={inputClass}>{RESTORE_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function MaintenanceModesPanel({ data }: { data: RetailData }) {
    const form = useForm<maintenanceModesFormValues>({ resolver: zodResolver(maintenanceModesFormSchema), defaultValues: {"operatedHubId":"","maintenanceKey":"","maintenanceName":"","maintenanceStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Maintenance Modes" description="Enterprise retail operating system maintenance modes" /><div className="mt-6 space-y-3">
                {data.maintenanceModes.length === 0 ? <EmptyState title="No maintenance modes" description="Create the first maintenance modes record." /> : data.maintenanceModes.map((item) => (
                    <ListCard key={item.id} title={String(item.maintenanceName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.maintenanceStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create maintenance modes" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createMaintenanceMode(v))}>
                <OperatedHubSelect data={data} {...form.register("operatedHubId")} />
                <input {...form.register("maintenanceKey")} placeholder="maintenanceKey" className={inputClass} />
                <input {...form.register("maintenanceName")} placeholder="maintenanceName" className={inputClass} />
                <select {...form.register("maintenanceStatus")} className={inputClass}>{MAINTENANCE_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function FeatureFlagOpsPanel({ data }: { data: RetailData }) {
    const form = useForm<featureFlagOpsFormValues>({ resolver: zodResolver(featureFlagOpsFormSchema), defaultValues: {"operatedHubId":"","flagKey":"","flagName":"","flagStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Feature Flag Ops" description="Enterprise retail operating system feature flag ops" /><div className="mt-6 space-y-3">
                {data.featureFlagOps.length === 0 ? <EmptyState title="No feature flag ops" description="Create the first feature flag ops record." /> : data.featureFlagOps.map((item) => (
                    <ListCard key={item.id} title={String(item.flagName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.flagStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create feature flag ops" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createFeatureFlagOp(v))}>
                <OperatedHubSelect data={data} {...form.register("operatedHubId")} />
                <input {...form.register("flagKey")} placeholder="flagKey" className={inputClass} />
                <input {...form.register("flagName")} placeholder="flagName" className={inputClass} />
                <select {...form.register("flagStatus")} className={inputClass}>{FLAG_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function PlatformDiagnosticsPanel({ data }: { data: RetailData }) {
    const form = useForm<platformDiagnosticsFormValues>({ resolver: zodResolver(platformDiagnosticsFormSchema), defaultValues: {"operatedHubId":"","diagnosticKey":"","diagnosticName":"","diagnosticStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Platform Diagnostics" description="Enterprise retail operating system platform diagnostics" /><div className="mt-6 space-y-3">
                {data.platformDiagnostics.length === 0 ? <EmptyState title="No platform diagnostics" description="Create the first platform diagnostics record." /> : data.platformDiagnostics.map((item) => (
                    <ListCard key={item.id} title={String(item.diagnosticName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.diagnosticStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create platform diagnostics" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createPlatformDiagnostic(v))}>
                <OperatedHubSelect data={data} {...form.register("operatedHubId")} />
                <input {...form.register("diagnosticKey")} placeholder="diagnosticKey" className={inputClass} />
                <input {...form.register("diagnosticName")} placeholder="diagnosticName" className={inputClass} />
                <select {...form.register("diagnosticStatus")} className={inputClass}>{DIAGNOSTIC_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function BetaOrganizationsPanel({ data }: { data: RetailData }) {
    const form = useForm<betaOrganizationsFormValues>({ resolver: zodResolver(betaOrganizationsFormSchema), defaultValues: {"operatedHubId":"","orgKey":"","orgName":"","betaStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Beta Organizations" description="Enterprise retail operating system beta organizations" /><div className="mt-6 space-y-3">
                {data.betaOrganizations.length === 0 ? <EmptyState title="No beta organizations" description="Create the first beta organizations record." /> : data.betaOrganizations.map((item) => (
                    <ListCard key={item.id} title={String(item.orgName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.betaStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create beta organizations" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createBetaOrganization(v))}>
                <OperatedHubSelect data={data} {...form.register("operatedHubId")} />
                <input {...form.register("orgKey")} placeholder="orgKey" className={inputClass} />
                <input {...form.register("orgName")} placeholder="orgName" className={inputClass} />
                <select {...form.register("betaStatus")} className={inputClass}>{BETA_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function BetaInvitationsPanel({ data }: { data: RetailData }) {
    const form = useForm<betaInvitationsFormValues>({ resolver: zodResolver(betaInvitationsFormSchema), defaultValues: {"operatedHubId":"","invitationKey":"","inviteeEmail":"","invitationStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Beta Invitations" description="Enterprise retail operating system beta invitations" /><div className="mt-6 space-y-3">
                {data.betaInvitations.length === 0 ? <EmptyState title="No beta invitations" description="Create the first beta invitations record." /> : data.betaInvitations.map((item) => (
                    <ListCard key={item.id} title={String(item.inviteeEmail)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.invitationStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create beta invitations" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createBetaInvitation(v))}>
                <OperatedHubSelect data={data} {...form.register("operatedHubId")} />
                <input {...form.register("invitationKey")} placeholder="invitationKey" className={inputClass} />
                <input {...form.register("inviteeEmail")} placeholder="inviteeEmail" className={inputClass} />
                <select {...form.register("invitationStatus")} className={inputClass}>{INVITATION_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function FeedbackCollectionsPanel({ data }: { data: RetailData }) {
    const form = useForm<feedbackCollectionFormValues>({ resolver: zodResolver(feedbackCollectionFormSchema), defaultValues: {"operatedHubId":"","feedbackKey":"","feedbackTitle":"","feedbackType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Feedback Collection" description="Enterprise retail operating system feedback collection" /><div className="mt-6 space-y-3">
                {data.feedbackCollection.length === 0 ? <EmptyState title="No feedback collection" description="Create the first feedback collection record." /> : data.feedbackCollection.map((item) => (
                    <ListCard key={item.id} title={String(item.feedbackTitle)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.feedbackType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create feedback collection" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createFeedbackCollection(v))}>
                <OperatedHubSelect data={data} {...form.register("operatedHubId")} />
                <input {...form.register("feedbackKey")} placeholder="feedbackKey" className={inputClass} />
                <input {...form.register("feedbackTitle")} placeholder="feedbackTitle" className={inputClass} />
                <input {...form.register("feedbackType")} placeholder="feedbackType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function FeatureRequestsPanel({ data }: { data: RetailData }) {
    const form = useForm<featureRequestsFormValues>({ resolver: zodResolver(featureRequestsFormSchema), defaultValues: {"operatedHubId":"","requestKey":"","requestTitle":"","requestStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Feature Requests" description="Enterprise retail operating system feature requests" /><div className="mt-6 space-y-3">
                {data.featureRequests.length === 0 ? <EmptyState title="No feature requests" description="Create the first feature requests record." /> : data.featureRequests.map((item) => (
                    <ListCard key={item.id} title={String(item.requestTitle)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.requestStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create feature requests" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createFeatureRequest(v))}>
                <OperatedHubSelect data={data} {...form.register("operatedHubId")} />
                <input {...form.register("requestKey")} placeholder="requestKey" className={inputClass} />
                <input {...form.register("requestTitle")} placeholder="requestTitle" className={inputClass} />
                <select {...form.register("requestStatus")} className={inputClass}>{REQUEST_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function BugReportsPanel({ data }: { data: RetailData }) {
    const form = useForm<bugReportsFormValues>({ resolver: zodResolver(bugReportsFormSchema), defaultValues: {"operatedHubId":"","bugKey":"","bugTitle":"","bugStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Bug Reports" description="Enterprise retail operating system bug reports" /><div className="mt-6 space-y-3">
                {data.bugReports.length === 0 ? <EmptyState title="No bug reports" description="Create the first bug reports record." /> : data.bugReports.map((item) => (
                    <ListCard key={item.id} title={String(item.bugTitle)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.bugStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create bug reports" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createBugReport(v))}>
                <OperatedHubSelect data={data} {...form.register("operatedHubId")} />
                <input {...form.register("bugKey")} placeholder="bugKey" className={inputClass} />
                <input {...form.register("bugTitle")} placeholder="bugTitle" className={inputClass} />
                <select {...form.register("bugStatus")} className={inputClass}>{BUG_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ReleaseChannelsPanel({ data }: { data: RetailData }) {
    const form = useForm<releaseChannelsFormValues>({ resolver: zodResolver(releaseChannelsFormSchema), defaultValues: {"operatedHubId":"","channelKey":"","channelName":"","channelStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Release Channels" description="Enterprise retail operating system release channels" /><div className="mt-6 space-y-3">
                {data.releaseChannels.length === 0 ? <EmptyState title="No release channels" description="Create the first release channels record." /> : data.releaseChannels.map((item) => (
                    <ListCard key={item.id} title={String(item.channelName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.channelStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create release channels" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createReleaseChannel(v))}>
                <OperatedHubSelect data={data} {...form.register("operatedHubId")} />
                <input {...form.register("channelKey")} placeholder="channelKey" className={inputClass} />
                <input {...form.register("channelName")} placeholder="channelName" className={inputClass} />
                <select {...form.register("channelStatus")} className={inputClass}>{CHANNEL_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function OperatedMetricsPanel({ data }: { data: RetailData }) {
    const form = useForm<operatedMetricsFormValues>({ resolver: zodResolver(operatedMetricsFormSchema), defaultValues: {"metricsKey":"","productionStatusScore":0,"overallOperatedScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Operated Metrics" description="Enterprise retail operating system operated metrics" /><div className="mt-6 space-y-3">
                {data.operatedMetrics.length === 0 ? <EmptyState title="No operated metrics" description="Create the first operated metrics record." /> : data.operatedMetrics.map((item) => (
                    <ListCard key={item.id} title={String(item.metricsKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.overallOperatedScore}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create operated metrics" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createOperatedMetric(v))}>
                <input {...form.register("metricsKey")} placeholder="metricsKey" className={inputClass} />
                <input type="number" step="any" {...form.register("productionStatusScore", { valueAsNumber: true })} placeholder="productionStatusScore" className={inputClass} />
                <input type="number" step="any" {...form.register("overallOperatedScore", { valueAsNumber: true })} placeholder="overallOperatedScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function OperatedHealthsPanel({ data }: { data: RetailData }) {
    const form = useForm<operatedHealthFormValues>({ resolver: zodResolver(operatedHealthFormSchema), defaultValues: {"healthKey":"","overallScore":0,"disasterRecoveryMode":false} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Operated Health" description="Enterprise retail operating system operated health" /><div className="mt-6 space-y-3">
                {data.operatedHealth.length === 0 ? <EmptyState title="No operated health" description="Create the first operated health record." /> : data.operatedHealth.map((item) => (
                    <ListCard key={item.id} title={String(item.healthKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.overallScore}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create operated health" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createOperatedHealth(v))}>
                <input {...form.register("healthKey")} placeholder="healthKey" className={inputClass} />
                <input type="number" step="any" {...form.register("overallScore", { valueAsNumber: true })} placeholder="overallScore" className={inputClass} />
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...form.register("disasterRecoveryMode")} /> disasterRecoveryMode</label>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ExecutiveBriefingsPanel({ data }: { data: RetailData }) {
    const form = useForm<executiveBriefingsFormValues>({ resolver: zodResolver(executiveBriefingsFormSchema), defaultValues: {"operatedHubId":"","briefingKey":"","briefingTitle":"","briefingType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Executive Briefings" description="Enterprise retail operating system executive briefings" /><div className="mt-6 space-y-3">
                {data.executiveBriefings.length === 0 ? <EmptyState title="No executive briefings" description="Create the first executive briefings record." /> : data.executiveBriefings.map((item) => (
                    <ListCard key={item.id} title={String(item.briefingTitle)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.briefingType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create executive briefings" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createExecutiveBriefing(v))}>
                <OperatedHubSelect data={data} {...form.register("operatedHubId")} />
                <input {...form.register("briefingKey")} placeholder="briefingKey" className={inputClass} />
                <input {...form.register("briefingTitle")} placeholder="briefingTitle" className={inputClass} />
                <input {...form.register("briefingType")} placeholder="briefingType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function PlatformFailuresPanel({ data }: { data: RetailData }) {
    const form = useForm<platformFailuresFormValues>({ resolver: zodResolver(platformFailuresFormSchema), defaultValues: {"operatedHubId":"","failureKey":"","failureType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Platform Failures" description="Enterprise retail operating system platform failures" /><div className="mt-6 space-y-3">
                {data.platformFailures.length === 0 ? <EmptyState title="No platform failures" description="Create the first platform failures record." /> : data.platformFailures.map((item) => (
                    <ListCard key={item.id} title={String(item.failureKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.failureType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create platform failures" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createPlatformFailure(v))}>
                <OperatedHubSelect data={data} {...form.register("operatedHubId")} />
                <input {...form.register("failureKey")} placeholder="failureKey" className={inputClass} />
                <input {...form.register("failureType")} placeholder="failureType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function RetailAuditLogsPanel({ data }: { data: RetailData }) {
    return (
        <Card hover><SectionHeader title="Customer Operated Platform audit history" description="Security-first audit trail for jobs, events, centralLogs, and marketplace operations" /><div className="mt-6 space-y-3">
            {data.auditLogs.length === 0 ? <EmptyState title="No audit entries" description="Audit logs are created automatically for retail operating system." /> : data.auditLogs.map((entry) => (
                <ListCard key={entry.id} title={entry.summary} subtitle={`${entry.entityType} • ${entry.action}`} meta={`${entry.securityLevel} • ${new Date(entry.createdAt).toLocaleString()}`} />
            ))}
        </div></Card>
    );
}

export function RetailSdkPanel({ data }: { data: RetailData }) {
    return (
        <Card hover><SectionHeader title="Shared Customer Operated Platform SDK" description="Import from @/src/modules/customer-operated-platform/sdk for brand registration, menu configuration, and order workflow execution" /><div className="mt-6 space-y-4 text-sm text-violet-600 dark:text-violet-300">
            <ListCard title="createCustomerOperatedPlatformClient()" subtitle="Factory for module-scoped Customer Operated Platform client with auth context" meta="Primary SDK for enterprise retail operating system" />
            <ListCard title="sdkLaunchOnboarding()" subtitle="Register retail operating system with AI orchestration" meta="moduleSource: customer_operated_platform" />
            <ListCard title="sdkDeployProduction()" subtitle="Deploy production job with knowledge context" meta="v1/v2/v3 API versions" />
            <ListCard title="sdkMonitorPlatform()" subtitle="Monitor platform health with audit trail" meta="Event-driven integration delivery" />
            <p className="text-xs text-violet-500">Theme: {COP_THEME.primary} • Integration hubs loaded: {data.operatedHubs.length}</p>
            <pre className="overflow-x-auto rounded-2xl bg-violet-950 p-4 text-xs text-violet-100">{`import { createCustomerOperatedPlatformClient } from "@/src/modules/customer-operated-platform/sdk";

const intg = createCustomerOperatedPlatformClient(userId, email, fullName);
await intg.registerCampus({ operatedHubId, serviceKey: "svc-001", serviceName: "Stripe" });
await intg.deployProduction({ operatedHubId, keyName: "prod-key", apiVersion: "v1" });
await intg.monitorPlatform({ operatedHubId, webhookKey: "wh-001", webhookName: "Events" });`}</pre>
        </div></Card>
    );
}
