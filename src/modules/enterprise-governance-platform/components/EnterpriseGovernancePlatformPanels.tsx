"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/src/components/ui/card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { EGP_THEME, GOVERNANCE_STATUS_OPTIONS, POLICY_STATUS_OPTIONS, FRAMEWORK_STATUS_OPTIONS, CONTROL_STATUS_OPTIONS, EVIDENCE_STATUS_OPTIONS, DASHBOARD_STATUS_OPTIONS, REVIEW_STATUS_OPTIONS, REPORT_STATUS_OPTIONS, CALENDAR_STATUS_OPTIONS, AUDIT_STATUS_OPTIONS, ACTION_STATUS_OPTIONS, OWNERSHIP_STATUS_OPTIONS, MITIGATION_STATUS_OPTIONS, MONITORING_STATUS_OPTIONS, CONTINUITY_STATUS_OPTIONS, ALERT_SEVERITY_OPTIONS } from "@/src/modules/enterprise-governance-platform/constants";
import type { useEnterpriseGovernancePlatform } from "@/src/modules/enterprise-governance-platform/hooks/useEnterpriseGovernancePlatform";
import {
    governanceHubsFormSchema,
    type governanceHubsFormValues,
    organizationGovernanceFormSchema,
    type organizationGovernanceFormValues,
    governancePoliciesFormSchema,
    type governancePoliciesFormValues,
    governanceFrameworkFormSchema,
    type governanceFrameworkFormValues,
    governanceReviewsFormSchema,
    type governanceReviewsFormValues,
    governanceDashboardsFormSchema,
    type governanceDashboardsFormValues,
    complianceFrameworkFormSchema,
    type complianceFrameworkFormValues,
    complianceControlsFormSchema,
    type complianceControlsFormValues,
    complianceEvidenceFormSchema,
    type complianceEvidenceFormValues,
    complianceReportsFormSchema,
    type complianceReportsFormValues,
    complianceCalendarFormSchema,
    type complianceCalendarFormValues,
    auditCenterFormSchema,
    type auditCenterFormValues,
    auditFindingsFormSchema,
    type auditFindingsFormValues,
    correctiveActionsFormSchema,
    type correctiveActionsFormValues,
    auditEvidenceFormSchema,
    type auditEvidenceFormValues,
    auditAnalyticsFormSchema,
    type auditAnalyticsFormValues,
    dataClassificationFormSchema,
    type dataClassificationFormValues,
    retentionPoliciesFormSchema,
    type retentionPoliciesFormValues,
    dataLifecycleFormSchema,
    type dataLifecycleFormValues,
    dataOwnershipFormSchema,
    type dataOwnershipFormValues,
    dataQualityFormSchema,
    type dataQualityFormValues,
    riskRegisterFormSchema,
    type riskRegisterFormValues,
    riskAssessmentFormSchema,
    type riskAssessmentFormValues,
    riskMitigationFormSchema,
    type riskMitigationFormValues,
    riskMonitoringFormSchema,
    type riskMonitoringFormValues,
    businessContinuityFormSchema,
    type businessContinuityFormValues,
    governanceMetricsFormSchema,
    type governanceMetricsFormValues,
    governanceHealthFormSchema,
    type governanceHealthFormValues,
    complianceDashboardsFormSchema,
    type complianceDashboardsFormValues,
    missionProgressFormSchema,
    type missionProgressFormValues,
    governanceFailuresFormSchema,
    type governanceFailuresFormValues,
} from "@/src/modules/enterprise-governance-platform/schemas";

type GovernanceData = ReturnType<typeof useEnterpriseGovernancePlatform>;
const inputClass = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-rose-500/20 focus:ring-4 dark:border-slate-800 dark:bg-rose-950";
function SaveButton({ loading, label = "Save changes" }: { loading?: boolean; label?: string }) {
    return <button type="submit" disabled={loading} className="rounded-full bg-rose-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-rose-500 disabled:opacity-60">{loading ? "Saving..." : label}</button>;
}
function ListCard({ title, subtitle, meta }: { title: string; subtitle: string; meta?: string }) {
    return <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800"><p className="font-medium">{title}</p><p className="text-sm text-rose-500">{subtitle}</p>{meta ? <p className="mt-1 text-xs text-rose-600">{meta}</p> : null}</div>;
}
function GovernanceHubSelect({ data, ...props }: { data: GovernanceData } & React.SelectHTMLAttributes<HTMLSelectElement>) {
    return <select {...props} className={inputClass}><option value="">Select retail operating system</option>{data.governanceHubOptions.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>;
}

export function GovernanceOverviewPanel({ data }: { data: GovernanceData }) {
    const pipeline = data.pipeline;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="Enterprise Governance Platform summary" description="System health, background jobs, event bus, riskRegister, feature flags, configuration, diagnostics, and operations dashboard" /><div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ListCard title="Governance Hubs" subtitle={`${data.stats?.totalGovernanceHubs ?? 0} total`} meta={`${data.stats?.activeGovernanceHubs ?? 0} active • ${data.stats?.organizationGovernanceCount ?? 0} dining areas`} />
                <ListCard title="Connectors" subtitle={`${data.stats?.complianceControlCount ?? 0} menu categories`} meta={`${data.stats?.auditFindingCount ?? 0} auditFindings • ${data.stats?.riskRegisterCount ?? 0} open riskRegister`} />
                <ListCard title="Health" subtitle={`${(data.stats?.overallGovernanceScore ?? 0).toFixed(1)} overall retail score`} meta={`${data.stats?.openGovernanceFailureCount ?? 0} open failures`} />
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

export function GovernanceHubsPanel({ data }: { data: GovernanceData }) {
    const form = useForm<governanceHubsFormValues>({ resolver: zodResolver(governanceHubsFormSchema), defaultValues: {"hubKey":"","hubName":"","environment":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Governance Hubs" description="Enterprise retail operating system governance hubs" /><div className="mt-6 space-y-3">
                {data.governanceHubs.length === 0 ? <EmptyState title="No governance hubs" description="Create the first governance hubs record." /> : data.governanceHubs.map((item) => (
                    <ListCard key={item.id} title={String(item.hubName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.hubKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create governance hubs" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createGovernanceHub(v))}>
                <input {...form.register("hubKey")} placeholder="hubKey" className={inputClass} />
                <input {...form.register("hubName")} placeholder="hubName" className={inputClass} />
                <input {...form.register("environment")} placeholder="environment" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function OrganizationGovernancesPanel({ data }: { data: GovernanceData }) {
    const form = useForm<organizationGovernanceFormValues>({ resolver: zodResolver(organizationGovernanceFormSchema), defaultValues: {"governanceHubId":"","governanceKey":"","governanceName":"","governanceStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Organization Governance" description="Enterprise retail operating system organization governance" /><div className="mt-6 space-y-3">
                {data.organizationGovernance.length === 0 ? <EmptyState title="No organization governance" description="Create the first organization governance record." /> : data.organizationGovernance.map((item) => (
                    <ListCard key={item.id} title={String(item.governanceName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.governanceStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create organization governance" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createOrganizationGovernance(v))}>
                <GovernanceHubSelect data={data} {...form.register("governanceHubId")} />
                <input {...form.register("governanceKey")} placeholder="governanceKey" className={inputClass} />
                <input {...form.register("governanceName")} placeholder="governanceName" className={inputClass} />
                <select {...form.register("governanceStatus")} className={inputClass}>{GOVERNANCE_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function GovernancePolicysPanel({ data }: { data: GovernanceData }) {
    const form = useForm<governancePoliciesFormValues>({ resolver: zodResolver(governancePoliciesFormSchema), defaultValues: {"governanceHubId":"","policyKey":"","policyName":"","policyStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Governance Policies" description="Enterprise retail operating system governance policies" /><div className="mt-6 space-y-3">
                {data.governancePolicies.length === 0 ? <EmptyState title="No governance policies" description="Create the first governance policies record." /> : data.governancePolicies.map((item) => (
                    <ListCard key={item.id} title={String(item.policyName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.policyStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create governance policies" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createGovernancePolicy(v))}>
                <GovernanceHubSelect data={data} {...form.register("governanceHubId")} />
                <input {...form.register("policyKey")} placeholder="policyKey" className={inputClass} />
                <input {...form.register("policyName")} placeholder="policyName" className={inputClass} />
                <select {...form.register("policyStatus")} className={inputClass}>{POLICY_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function GovernanceFrameworksPanel({ data }: { data: GovernanceData }) {
    const form = useForm<governanceFrameworkFormValues>({ resolver: zodResolver(governanceFrameworkFormSchema), defaultValues: {"governanceHubId":"","frameworkKey":"","frameworkName":"","frameworkStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Governance Framework" description="Enterprise retail operating system governance framework" /><div className="mt-6 space-y-3">
                {data.governanceFramework.length === 0 ? <EmptyState title="No governance framework" description="Create the first governance framework record." /> : data.governanceFramework.map((item) => (
                    <ListCard key={item.id} title={String(item.frameworkName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.frameworkStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create governance framework" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createGovernanceFramework(v))}>
                <GovernanceHubSelect data={data} {...form.register("governanceHubId")} />
                <input {...form.register("frameworkKey")} placeholder="frameworkKey" className={inputClass} />
                <input {...form.register("frameworkName")} placeholder="frameworkName" className={inputClass} />
                <select {...form.register("frameworkStatus")} className={inputClass}>{FRAMEWORK_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function GovernanceReviewsPanel({ data }: { data: GovernanceData }) {
    const form = useForm<governanceReviewsFormValues>({ resolver: zodResolver(governanceReviewsFormSchema), defaultValues: {"governanceHubId":"","reviewKey":"","reviewTitle":"","reviewStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Governance Reviews" description="Enterprise retail operating system governance reviews" /><div className="mt-6 space-y-3">
                {data.governanceReviews.length === 0 ? <EmptyState title="No governance reviews" description="Create the first governance reviews record." /> : data.governanceReviews.map((item) => (
                    <ListCard key={item.id} title={String(item.reviewTitle)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.reviewStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create governance reviews" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createGovernanceReview(v))}>
                <GovernanceHubSelect data={data} {...form.register("governanceHubId")} />
                <input {...form.register("reviewKey")} placeholder="reviewKey" className={inputClass} />
                <input {...form.register("reviewTitle")} placeholder="reviewTitle" className={inputClass} />
                <select {...form.register("reviewStatus")} className={inputClass}>{REVIEW_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function GovernanceDashboardsPanel({ data }: { data: GovernanceData }) {
    const form = useForm<governanceDashboardsFormValues>({ resolver: zodResolver(governanceDashboardsFormSchema), defaultValues: {"governanceHubId":"","dashboardKey":"","dashboardName":"","dashboardStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Governance Dashboards" description="Enterprise retail operating system governance dashboards" /><div className="mt-6 space-y-3">
                {data.governanceDashboards.length === 0 ? <EmptyState title="No governance dashboards" description="Create the first governance dashboards record." /> : data.governanceDashboards.map((item) => (
                    <ListCard key={item.id} title={String(item.dashboardName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.dashboardStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create governance dashboards" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createGovernanceDashboard(v))}>
                <GovernanceHubSelect data={data} {...form.register("governanceHubId")} />
                <input {...form.register("dashboardKey")} placeholder="dashboardKey" className={inputClass} />
                <input {...form.register("dashboardName")} placeholder="dashboardName" className={inputClass} />
                <select {...form.register("dashboardStatus")} className={inputClass}>{DASHBOARD_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ComplianceFrameworksPanel({ data }: { data: GovernanceData }) {
    const form = useForm<complianceFrameworkFormValues>({ resolver: zodResolver(complianceFrameworkFormSchema), defaultValues: {"governanceHubId":"","frameworkKey":"","frameworkName":"","frameworkStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Compliance Framework" description="Enterprise retail operating system compliance framework" /><div className="mt-6 space-y-3">
                {data.complianceFramework.length === 0 ? <EmptyState title="No compliance framework" description="Create the first compliance framework record." /> : data.complianceFramework.map((item) => (
                    <ListCard key={item.id} title={String(item.frameworkName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.frameworkStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create compliance framework" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createComplianceFramework(v))}>
                <GovernanceHubSelect data={data} {...form.register("governanceHubId")} />
                <input {...form.register("frameworkKey")} placeholder="frameworkKey" className={inputClass} />
                <input {...form.register("frameworkName")} placeholder="frameworkName" className={inputClass} />
                <select {...form.register("frameworkStatus")} className={inputClass}>{FRAMEWORK_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ComplianceControlsPanel({ data }: { data: GovernanceData }) {
    const form = useForm<complianceControlsFormValues>({ resolver: zodResolver(complianceControlsFormSchema), defaultValues: {"governanceHubId":"","controlKey":"","controlName":"","controlStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Compliance Controls" description="Enterprise retail operating system compliance controls" /><div className="mt-6 space-y-3">
                {data.complianceControls.length === 0 ? <EmptyState title="No compliance controls" description="Create the first compliance controls record." /> : data.complianceControls.map((item) => (
                    <ListCard key={item.id} title={String(item.controlName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.controlStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create compliance controls" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createComplianceControl(v))}>
                <GovernanceHubSelect data={data} {...form.register("governanceHubId")} />
                <input {...form.register("controlKey")} placeholder="controlKey" className={inputClass} />
                <input {...form.register("controlName")} placeholder="controlName" className={inputClass} />
                <select {...form.register("controlStatus")} className={inputClass}>{CONTROL_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ComplianceEvidencesPanel({ data }: { data: GovernanceData }) {
    const form = useForm<complianceEvidenceFormValues>({ resolver: zodResolver(complianceEvidenceFormSchema), defaultValues: {"governanceHubId":"","evidenceKey":"","evidenceTitle":"","evidenceStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Compliance Evidence" description="Enterprise retail operating system compliance evidence" /><div className="mt-6 space-y-3">
                {data.complianceEvidence.length === 0 ? <EmptyState title="No compliance evidence" description="Create the first compliance evidence record." /> : data.complianceEvidence.map((item) => (
                    <ListCard key={item.id} title={String(item.evidenceTitle)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.evidenceStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create compliance evidence" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createComplianceEvidence(v))}>
                <GovernanceHubSelect data={data} {...form.register("governanceHubId")} />
                <input {...form.register("evidenceKey")} placeholder="evidenceKey" className={inputClass} />
                <input {...form.register("evidenceTitle")} placeholder="evidenceTitle" className={inputClass} />
                <select {...form.register("evidenceStatus")} className={inputClass}>{EVIDENCE_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ComplianceReportsPanel({ data }: { data: GovernanceData }) {
    const form = useForm<complianceReportsFormValues>({ resolver: zodResolver(complianceReportsFormSchema), defaultValues: {"governanceHubId":"","reportKey":"","reportTitle":"","reportStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Compliance Reports" description="Enterprise retail operating system compliance reports" /><div className="mt-6 space-y-3">
                {data.complianceReports.length === 0 ? <EmptyState title="No compliance reports" description="Create the first compliance reports record." /> : data.complianceReports.map((item) => (
                    <ListCard key={item.id} title={String(item.reportTitle)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.reportStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create compliance reports" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createComplianceReport(v))}>
                <GovernanceHubSelect data={data} {...form.register("governanceHubId")} />
                <input {...form.register("reportKey")} placeholder="reportKey" className={inputClass} />
                <input {...form.register("reportTitle")} placeholder="reportTitle" className={inputClass} />
                <select {...form.register("reportStatus")} className={inputClass}>{REPORT_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ComplianceCalendarsPanel({ data }: { data: GovernanceData }) {
    const form = useForm<complianceCalendarFormValues>({ resolver: zodResolver(complianceCalendarFormSchema), defaultValues: {"governanceHubId":"","calendarKey":"","calendarName":"","calendarStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Compliance Calendar" description="Enterprise retail operating system compliance calendar" /><div className="mt-6 space-y-3">
                {data.complianceCalendar.length === 0 ? <EmptyState title="No compliance calendar" description="Create the first compliance calendar record." /> : data.complianceCalendar.map((item) => (
                    <ListCard key={item.id} title={String(item.calendarName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.calendarStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create compliance calendar" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createComplianceCalendar(v))}>
                <GovernanceHubSelect data={data} {...form.register("governanceHubId")} />
                <input {...form.register("calendarKey")} placeholder="calendarKey" className={inputClass} />
                <input {...form.register("calendarName")} placeholder="calendarName" className={inputClass} />
                <select {...form.register("calendarStatus")} className={inputClass}>{CALENDAR_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function AuditCentersPanel({ data }: { data: GovernanceData }) {
    const form = useForm<auditCenterFormValues>({ resolver: zodResolver(auditCenterFormSchema), defaultValues: {"governanceHubId":"","auditKey":"","auditName":"","auditStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Audit Center" description="Enterprise retail operating system audit center" /><div className="mt-6 space-y-3">
                {data.auditCenter.length === 0 ? <EmptyState title="No audit center" description="Create the first audit center record." /> : data.auditCenter.map((item) => (
                    <ListCard key={item.id} title={String(item.auditName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.auditStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create audit center" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createAuditCenter(v))}>
                <GovernanceHubSelect data={data} {...form.register("governanceHubId")} />
                <input {...form.register("auditKey")} placeholder="auditKey" className={inputClass} />
                <input {...form.register("auditName")} placeholder="auditName" className={inputClass} />
                <select {...form.register("auditStatus")} className={inputClass}>{AUDIT_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function AuditFindingsPanel({ data }: { data: GovernanceData }) {
    const form = useForm<auditFindingsFormValues>({ resolver: zodResolver(auditFindingsFormSchema), defaultValues: {"governanceHubId":"","findingKey":"","findingTitle":"","findingSeverity":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Audit Findings" description="Enterprise retail operating system audit findings" /><div className="mt-6 space-y-3">
                {data.auditFindings.length === 0 ? <EmptyState title="No audit findings" description="Create the first audit findings record." /> : data.auditFindings.map((item) => (
                    <ListCard key={item.id} title={String(item.findingTitle)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.findingSeverity}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create audit findings" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createAuditFinding(v))}>
                <GovernanceHubSelect data={data} {...form.register("governanceHubId")} />
                <input {...form.register("findingKey")} placeholder="findingKey" className={inputClass} />
                <input {...form.register("findingTitle")} placeholder="findingTitle" className={inputClass} />
                <input {...form.register("findingSeverity")} placeholder="findingSeverity" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function CorrectiveActionsPanel({ data }: { data: GovernanceData }) {
    const form = useForm<correctiveActionsFormValues>({ resolver: zodResolver(correctiveActionsFormSchema), defaultValues: {"governanceHubId":"","actionKey":"","actionTitle":"","actionStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Corrective Actions" description="Enterprise retail operating system corrective actions" /><div className="mt-6 space-y-3">
                {data.correctiveActions.length === 0 ? <EmptyState title="No corrective actions" description="Create the first corrective actions record." /> : data.correctiveActions.map((item) => (
                    <ListCard key={item.id} title={String(item.actionTitle)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.actionStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create corrective actions" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createCorrectiveAction(v))}>
                <GovernanceHubSelect data={data} {...form.register("governanceHubId")} />
                <input {...form.register("actionKey")} placeholder="actionKey" className={inputClass} />
                <input {...form.register("actionTitle")} placeholder="actionTitle" className={inputClass} />
                <select {...form.register("actionStatus")} className={inputClass}>{ACTION_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function AuditEvidencesPanel({ data }: { data: GovernanceData }) {
    const form = useForm<auditEvidenceFormValues>({ resolver: zodResolver(auditEvidenceFormSchema), defaultValues: {"governanceHubId":"","evidenceKey":"","evidenceTitle":"","evidenceStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Audit Evidence" description="Enterprise retail operating system audit evidence" /><div className="mt-6 space-y-3">
                {data.auditEvidence.length === 0 ? <EmptyState title="No audit evidence" description="Create the first audit evidence record." /> : data.auditEvidence.map((item) => (
                    <ListCard key={item.id} title={String(item.evidenceTitle)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.evidenceStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create audit evidence" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createAuditEvidence(v))}>
                <GovernanceHubSelect data={data} {...form.register("governanceHubId")} />
                <input {...form.register("evidenceKey")} placeholder="evidenceKey" className={inputClass} />
                <input {...form.register("evidenceTitle")} placeholder="evidenceTitle" className={inputClass} />
                <select {...form.register("evidenceStatus")} className={inputClass}>{EVIDENCE_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function AuditAnalyticssPanel({ data }: { data: GovernanceData }) {
    const form = useForm<auditAnalyticsFormValues>({ resolver: zodResolver(auditAnalyticsFormSchema), defaultValues: {"governanceHubId":"","analyticsKey":"","analyticsName":"","analyticsScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Audit Analytics" description="Enterprise retail operating system audit analytics" /><div className="mt-6 space-y-3">
                {data.auditAnalytics.length === 0 ? <EmptyState title="No audit analytics" description="Create the first audit analytics record." /> : data.auditAnalytics.map((item) => (
                    <ListCard key={item.id} title={String(item.analyticsName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.analyticsScore}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create audit analytics" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createAuditAnalytics(v))}>
                <GovernanceHubSelect data={data} {...form.register("governanceHubId")} />
                <input {...form.register("analyticsKey")} placeholder="analyticsKey" className={inputClass} />
                <input {...form.register("analyticsName")} placeholder="analyticsName" className={inputClass} />
                <input type="number" step="any" {...form.register("analyticsScore", { valueAsNumber: true })} placeholder="analyticsScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function DataClassificationsPanel({ data }: { data: GovernanceData }) {
    const form = useForm<dataClassificationFormValues>({ resolver: zodResolver(dataClassificationFormSchema), defaultValues: {"governanceHubId":"","classificationKey":"","classificationName":"","classificationLevel":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Data Classification" description="Enterprise retail operating system data classification" /><div className="mt-6 space-y-3">
                {data.dataClassification.length === 0 ? <EmptyState title="No data classification" description="Create the first data classification record." /> : data.dataClassification.map((item) => (
                    <ListCard key={item.id} title={String(item.classificationName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.classificationLevel}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create data classification" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDataClassification(v))}>
                <GovernanceHubSelect data={data} {...form.register("governanceHubId")} />
                <input {...form.register("classificationKey")} placeholder="classificationKey" className={inputClass} />
                <input {...form.register("classificationName")} placeholder="classificationName" className={inputClass} />
                <input {...form.register("classificationLevel")} placeholder="classificationLevel" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function RetentionPolicysPanel({ data }: { data: GovernanceData }) {
    const form = useForm<retentionPoliciesFormValues>({ resolver: zodResolver(retentionPoliciesFormSchema), defaultValues: {"governanceHubId":"","policyKey":"","policyName":"","policyStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Retention Policies" description="Enterprise retail operating system retention policies" /><div className="mt-6 space-y-3">
                {data.retentionPolicies.length === 0 ? <EmptyState title="No retention policies" description="Create the first retention policies record." /> : data.retentionPolicies.map((item) => (
                    <ListCard key={item.id} title={String(item.policyName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.policyStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create retention policies" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRetentionPolicy(v))}>
                <GovernanceHubSelect data={data} {...form.register("governanceHubId")} />
                <input {...form.register("policyKey")} placeholder="policyKey" className={inputClass} />
                <input {...form.register("policyName")} placeholder="policyName" className={inputClass} />
                <select {...form.register("policyStatus")} className={inputClass}>{POLICY_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function DataLifecyclesPanel({ data }: { data: GovernanceData }) {
    const form = useForm<dataLifecycleFormValues>({ resolver: zodResolver(dataLifecycleFormSchema), defaultValues: {"governanceHubId":"","lifecycleKey":"","lifecycleName":"","lifecycleStage":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Data Lifecycle" description="Enterprise retail operating system data lifecycle" /><div className="mt-6 space-y-3">
                {data.dataLifecycle.length === 0 ? <EmptyState title="No data lifecycle" description="Create the first data lifecycle record." /> : data.dataLifecycle.map((item) => (
                    <ListCard key={item.id} title={String(item.lifecycleName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.lifecycleStage}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create data lifecycle" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDataLifecycle(v))}>
                <GovernanceHubSelect data={data} {...form.register("governanceHubId")} />
                <input {...form.register("lifecycleKey")} placeholder="lifecycleKey" className={inputClass} />
                <input {...form.register("lifecycleName")} placeholder="lifecycleName" className={inputClass} />
                <input {...form.register("lifecycleStage")} placeholder="lifecycleStage" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function DataOwnershipsPanel({ data }: { data: GovernanceData }) {
    const form = useForm<dataOwnershipFormValues>({ resolver: zodResolver(dataOwnershipFormSchema), defaultValues: {"governanceHubId":"","ownershipKey":"","ownershipName":"","ownershipStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Data Ownership" description="Enterprise retail operating system data ownership" /><div className="mt-6 space-y-3">
                {data.dataOwnership.length === 0 ? <EmptyState title="No data ownership" description="Create the first data ownership record." /> : data.dataOwnership.map((item) => (
                    <ListCard key={item.id} title={String(item.ownershipName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.ownershipStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create data ownership" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDataOwnership(v))}>
                <GovernanceHubSelect data={data} {...form.register("governanceHubId")} />
                <input {...form.register("ownershipKey")} placeholder="ownershipKey" className={inputClass} />
                <input {...form.register("ownershipName")} placeholder="ownershipName" className={inputClass} />
                <select {...form.register("ownershipStatus")} className={inputClass}>{OWNERSHIP_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function DataQualitysPanel({ data }: { data: GovernanceData }) {
    const form = useForm<dataQualityFormValues>({ resolver: zodResolver(dataQualityFormSchema), defaultValues: {"governanceHubId":"","qualityKey":"","qualityName":"","qualityScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Data Quality" description="Enterprise retail operating system data quality" /><div className="mt-6 space-y-3">
                {data.dataQuality.length === 0 ? <EmptyState title="No data quality" description="Create the first data quality record." /> : data.dataQuality.map((item) => (
                    <ListCard key={item.id} title={String(item.qualityName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.qualityScore}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create data quality" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDataQuality(v))}>
                <GovernanceHubSelect data={data} {...form.register("governanceHubId")} />
                <input {...form.register("qualityKey")} placeholder="qualityKey" className={inputClass} />
                <input {...form.register("qualityName")} placeholder="qualityName" className={inputClass} />
                <input type="number" step="any" {...form.register("qualityScore", { valueAsNumber: true })} placeholder="qualityScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function RiskRegistersPanel({ data }: { data: GovernanceData }) {
    const form = useForm<riskRegisterFormValues>({ resolver: zodResolver(riskRegisterFormSchema), defaultValues: {"governanceHubId":"","riskKey":"","riskTitle":"","riskSeverity":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Risk Register" description="Enterprise retail operating system risk register" /><div className="mt-6 space-y-3">
                {data.riskRegister.length === 0 ? <EmptyState title="No risk register" description="Create the first risk register record." /> : data.riskRegister.map((item) => (
                    <ListCard key={item.id} title={String(item.riskTitle)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.riskSeverity}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create risk register" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRiskRegister(v))}>
                <GovernanceHubSelect data={data} {...form.register("governanceHubId")} />
                <input {...form.register("riskKey")} placeholder="riskKey" className={inputClass} />
                <input {...form.register("riskTitle")} placeholder="riskTitle" className={inputClass} />
                <input {...form.register("riskSeverity")} placeholder="riskSeverity" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function RiskAssessmentsPanel({ data }: { data: GovernanceData }) {
    const form = useForm<riskAssessmentFormValues>({ resolver: zodResolver(riskAssessmentFormSchema), defaultValues: {"governanceHubId":"","assessmentKey":"","assessmentTitle":"","assessmentScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Risk Assessment" description="Enterprise retail operating system risk assessment" /><div className="mt-6 space-y-3">
                {data.riskAssessment.length === 0 ? <EmptyState title="No risk assessment" description="Create the first risk assessment record." /> : data.riskAssessment.map((item) => (
                    <ListCard key={item.id} title={String(item.assessmentTitle)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.assessmentScore}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create risk assessment" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRiskAssessment(v))}>
                <GovernanceHubSelect data={data} {...form.register("governanceHubId")} />
                <input {...form.register("assessmentKey")} placeholder="assessmentKey" className={inputClass} />
                <input {...form.register("assessmentTitle")} placeholder="assessmentTitle" className={inputClass} />
                <input type="number" step="any" {...form.register("assessmentScore", { valueAsNumber: true })} placeholder="assessmentScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function RiskMitigationsPanel({ data }: { data: GovernanceData }) {
    const form = useForm<riskMitigationFormValues>({ resolver: zodResolver(riskMitigationFormSchema), defaultValues: {"governanceHubId":"","mitigationKey":"","mitigationTitle":"","mitigationStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Risk Mitigation" description="Enterprise retail operating system risk mitigation" /><div className="mt-6 space-y-3">
                {data.riskMitigation.length === 0 ? <EmptyState title="No risk mitigation" description="Create the first risk mitigation record." /> : data.riskMitigation.map((item) => (
                    <ListCard key={item.id} title={String(item.mitigationTitle)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.mitigationStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create risk mitigation" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRiskMitigation(v))}>
                <GovernanceHubSelect data={data} {...form.register("governanceHubId")} />
                <input {...form.register("mitigationKey")} placeholder="mitigationKey" className={inputClass} />
                <input {...form.register("mitigationTitle")} placeholder="mitigationTitle" className={inputClass} />
                <select {...form.register("mitigationStatus")} className={inputClass}>{MITIGATION_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function RiskMonitoringsPanel({ data }: { data: GovernanceData }) {
    const form = useForm<riskMonitoringFormValues>({ resolver: zodResolver(riskMonitoringFormSchema), defaultValues: {"governanceHubId":"","monitoringKey":"","monitoringName":"","monitoringStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Risk Monitoring" description="Enterprise retail operating system risk monitoring" /><div className="mt-6 space-y-3">
                {data.riskMonitoring.length === 0 ? <EmptyState title="No risk monitoring" description="Create the first risk monitoring record." /> : data.riskMonitoring.map((item) => (
                    <ListCard key={item.id} title={String(item.monitoringName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.monitoringStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create risk monitoring" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRiskMonitoring(v))}>
                <GovernanceHubSelect data={data} {...form.register("governanceHubId")} />
                <input {...form.register("monitoringKey")} placeholder="monitoringKey" className={inputClass} />
                <input {...form.register("monitoringName")} placeholder="monitoringName" className={inputClass} />
                <select {...form.register("monitoringStatus")} className={inputClass}>{MONITORING_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function BusinessContinuitysPanel({ data }: { data: GovernanceData }) {
    const form = useForm<businessContinuityFormValues>({ resolver: zodResolver(businessContinuityFormSchema), defaultValues: {"governanceHubId":"","continuityKey":"","continuityName":"","continuityStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Business Continuity" description="Enterprise retail operating system business continuity" /><div className="mt-6 space-y-3">
                {data.businessContinuity.length === 0 ? <EmptyState title="No business continuity" description="Create the first business continuity record." /> : data.businessContinuity.map((item) => (
                    <ListCard key={item.id} title={String(item.continuityName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.continuityStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create business continuity" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createBusinessContinuity(v))}>
                <GovernanceHubSelect data={data} {...form.register("governanceHubId")} />
                <input {...form.register("continuityKey")} placeholder="continuityKey" className={inputClass} />
                <input {...form.register("continuityName")} placeholder="continuityName" className={inputClass} />
                <select {...form.register("continuityStatus")} className={inputClass}>{CONTINUITY_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function GovernanceMetricsPanel({ data }: { data: GovernanceData }) {
    const form = useForm<governanceMetricsFormValues>({ resolver: zodResolver(governanceMetricsFormSchema), defaultValues: {"metricsKey":"","overallGovernanceScore":0,"complianceScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Governance Metrics" description="Enterprise retail operating system governance metrics" /><div className="mt-6 space-y-3">
                {data.governanceMetrics.length === 0 ? <EmptyState title="No governance metrics" description="Create the first governance metrics record." /> : data.governanceMetrics.map((item) => (
                    <ListCard key={item.id} title={String(item.metricsKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.overallGovernanceScore}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create governance metrics" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createGovernanceMetric(v))}>
                <input {...form.register("metricsKey")} placeholder="metricsKey" className={inputClass} />
                <input type="number" step="any" {...form.register("overallGovernanceScore", { valueAsNumber: true })} placeholder="overallGovernanceScore" className={inputClass} />
                <input type="number" step="any" {...form.register("complianceScore", { valueAsNumber: true })} placeholder="complianceScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function GovernanceHealthsPanel({ data }: { data: GovernanceData }) {
    const form = useForm<governanceHealthFormValues>({ resolver: zodResolver(governanceHealthFormSchema), defaultValues: {"healthKey":"","overallScore":0,"disasterRecoveryMode":false} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Governance Health" description="Enterprise retail operating system governance health" /><div className="mt-6 space-y-3">
                {data.governanceHealth.length === 0 ? <EmptyState title="No governance health" description="Create the first governance health record." /> : data.governanceHealth.map((item) => (
                    <ListCard key={item.id} title={String(item.healthKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.overallScore}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create governance health" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createGovernanceHealth(v))}>
                <input {...form.register("healthKey")} placeholder="healthKey" className={inputClass} />
                <input type="number" step="any" {...form.register("overallScore", { valueAsNumber: true })} placeholder="overallScore" className={inputClass} />
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...form.register("disasterRecoveryMode")} /> disasterRecoveryMode</label>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ComplianceDashboardsPanel({ data }: { data: GovernanceData }) {
    const form = useForm<complianceDashboardsFormValues>({ resolver: zodResolver(complianceDashboardsFormSchema), defaultValues: {"governanceHubId":"","dashboardKey":"","dashboardName":"","dashboardStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Compliance Dashboards" description="Enterprise retail operating system compliance dashboards" /><div className="mt-6 space-y-3">
                {data.complianceDashboards.length === 0 ? <EmptyState title="No compliance dashboards" description="Create the first compliance dashboards record." /> : data.complianceDashboards.map((item) => (
                    <ListCard key={item.id} title={String(item.dashboardName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.dashboardStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create compliance dashboards" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createComplianceDashboard(v))}>
                <GovernanceHubSelect data={data} {...form.register("governanceHubId")} />
                <input {...form.register("dashboardKey")} placeholder="dashboardKey" className={inputClass} />
                <input {...form.register("dashboardName")} placeholder="dashboardName" className={inputClass} />
                <select {...form.register("dashboardStatus")} className={inputClass}>{DASHBOARD_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function MissionProgresssPanel({ data }: { data: GovernanceData }) {
    const form = useForm<missionProgressFormValues>({ resolver: zodResolver(missionProgressFormSchema), defaultValues: {"governanceHubId":"","progressKey":"","progressName":"","progressPercent":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Mission Progress" description="Enterprise retail operating system mission progress" /><div className="mt-6 space-y-3">
                {data.missionProgress.length === 0 ? <EmptyState title="No mission progress" description="Create the first mission progress record." /> : data.missionProgress.map((item) => (
                    <ListCard key={item.id} title={String(item.progressName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.progressPercent}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create mission progress" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createMissionProgress(v))}>
                <GovernanceHubSelect data={data} {...form.register("governanceHubId")} />
                <input {...form.register("progressKey")} placeholder="progressKey" className={inputClass} />
                <input {...form.register("progressName")} placeholder="progressName" className={inputClass} />
                <input type="number" step="any" {...form.register("progressPercent", { valueAsNumber: true })} placeholder="progressPercent" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function GovernanceFailuresPanel({ data }: { data: GovernanceData }) {
    const form = useForm<governanceFailuresFormValues>({ resolver: zodResolver(governanceFailuresFormSchema), defaultValues: {"governanceHubId":"","failureKey":"","failureType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Governance Failures" description="Enterprise retail operating system governance failures" /><div className="mt-6 space-y-3">
                {data.governanceFailures.length === 0 ? <EmptyState title="No governance failures" description="Create the first governance failures record." /> : data.governanceFailures.map((item) => (
                    <ListCard key={item.id} title={String(item.failureKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.failureType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create governance failures" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createGovernanceFailure(v))}>
                <GovernanceHubSelect data={data} {...form.register("governanceHubId")} />
                <input {...form.register("failureKey")} placeholder="failureKey" className={inputClass} />
                <input {...form.register("failureType")} placeholder="failureType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function GovernanceAuditLogsPanel({ data }: { data: GovernanceData }) {
    return (
        <Card hover><SectionHeader title="Enterprise Governance Platform audit history" description="Security-first audit trail for jobs, events, riskRegister, and marketplace operations" /><div className="mt-6 space-y-3">
            {data.auditLogs.length === 0 ? <EmptyState title="No audit entries" description="Audit logs are created automatically for retail operating system." /> : data.auditLogs.map((entry) => (
                <ListCard key={entry.id} title={entry.summary} subtitle={`${entry.entityType} • ${entry.action}`} meta={`${entry.securityLevel} • ${new Date(entry.createdAt).toLocaleString()}`} />
            ))}
        </div></Card>
    );
}

export function GovernanceSdkPanel({ data }: { data: GovernanceData }) {
    return (
        <Card hover><SectionHeader title="Shared Enterprise Governance Platform SDK" description="Import from @/src/modules/enterprise-governance-platform/sdk for brand registration, menu configuration, and order workflow execution" /><div className="mt-6 space-y-4 text-sm text-rose-600 dark:text-rose-300">
            <ListCard title="createEnterpriseGovernancePlatformClient()" subtitle="Factory for module-scoped Enterprise Governance Platform client with auth context" meta="Primary SDK for enterprise retail operating system" />
            <ListCard title="sdkRunGovernanceService()" subtitle="Register retail operating system with AI orchestration" meta="moduleSource: enterprise_governance_platform" />
            <ListCard title="sdkRunComplianceService()" subtitle="Run intelligence service with knowledge context" meta="v1/v2/v3 API versions" />
            <ListCard title="sdkRunAuditService()" subtitle="Run forecast service with audit trail" meta="Event-driven integration delivery" />
            <p className="text-xs text-rose-500">Theme: {EGP_THEME.primary} • Integration hubs loaded: {data.governanceHubs.length}</p>
            <pre className="overflow-x-auto rounded-2xl bg-rose-950 p-4 text-xs text-rose-100">{`import { createEnterpriseGovernancePlatformClient } from "@/src/modules/enterprise-governance-platform/sdk";

const intg = createEnterpriseGovernancePlatformClient(userId, email, fullName);
await intg.registerCampus({ governanceHubId, serviceKey: "svc-001", serviceName: "Stripe" });
await intg.runComplianceService({ governanceHubId, keyName: "prod-key", apiVersion: "v1" });
await intg.runAuditService({ governanceHubId, webhookKey: "wh-001", webhookName: "Events" });`}</pre>
        </div></Card>
    );
}
