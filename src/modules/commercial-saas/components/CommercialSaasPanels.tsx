"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/src/components/ui/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { PLAN_TIER_OPTIONS, SAAS_THEME } from "@/src/modules/commercial-saas/constants";
import type { useCommercialSaas } from "@/src/modules/commercial-saas/hooks/useCommercialSaas";
import {
    adminMetricFormSchema,
    tenantFormSchema,
    registrationsFormSchema,
    tenantProfilesFormSchema,
    domainConfigsFormSchema,
    emailVerificationsFormSchema,
    trialsFormSchema,
    workspaceSetupsFormSchema,
    roleProvisionsFormSchema,
    welcomeExperiencesFormSchema,
    subscriptionsFormSchema,
    planLimitsFormSchema,
    subscriptionEventsFormSchema,
    licensesFormSchema,
    licenseAllocationsFormSchema,
    featureFlagsFormSchema,
    portalSettingsFormSchema,
    portalBrandingFormSchema,
    portalIntegrationsFormSchema,
    portalApiKeysFormSchema,
    usageMetersFormSchema,
    usageRecordsFormSchema,
    invoicesFormSchema,
    billingCreditsFormSchema,
    billingCouponsFormSchema,
    recurringBillingFormSchema,
    healthScoresFormSchema,
    onboardingChecklistsFormSchema,
    productAdoptionFormSchema,
    renewalTrackingFormSchema,
    supportSummariesFormSchema,
    type AdminMetricFormValues,
    type TenantFormValues,
    type RegistrationsFormValues,
    type TenantProfilesFormValues,
    type DomainConfigsFormValues,
    type EmailVerificationsFormValues,
    type TrialsFormValues,
    type WorkspaceSetupsFormValues,
    type RoleProvisionsFormValues,
    type WelcomeExperiencesFormValues,
    type SubscriptionsFormValues,
    type PlanLimitsFormValues,
    type SubscriptionEventsFormValues,
    type LicensesFormValues,
    type LicenseAllocationsFormValues,
    type FeatureFlagsFormValues,
    type PortalSettingsFormValues,
    type PortalBrandingFormValues,
    type PortalIntegrationsFormValues,
    type PortalApiKeysFormValues,
    type UsageMetersFormValues,
    type UsageRecordsFormValues,
    type InvoicesFormValues,
    type BillingCreditsFormValues,
    type BillingCouponsFormValues,
    type RecurringBillingFormValues,
    type HealthScoresFormValues,
    type OnboardingChecklistsFormValues,
    type ProductAdoptionFormValues,
    type RenewalTrackingFormValues,
    type SupportSummariesFormValues,
} from "@/src/modules/commercial-saas/schemas";

type CommercialSaasData = ReturnType<typeof useCommercialSaas>;
const inputClass = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-sky-500/20 focus:ring-4 dark:border-slate-800 dark:bg-slate-950";
function SaveButton({ loading, label = "Save changes" }: { loading?: boolean; label?: string }) {
    return <button type="submit" disabled={loading} className="rounded-full bg-sky-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-sky-500 disabled:opacity-60">{loading ? "Saving..." : label}</button>;
}
function ListCard({ title, subtitle, meta }: { title: string; subtitle: string; meta?: string }) {
    return <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800"><p className="font-medium">{title}</p><p className="text-sm text-slate-500">{subtitle}</p>{meta ? <p className="mt-1 text-xs text-sky-600">{meta}</p> : null}</div>;
}
function TenantSelect({ data, ...props }: { data: CommercialSaasData } & React.SelectHTMLAttributes<HTMLSelectElement>) {
    return <select {...props} className={inputClass}><option value="">Select tenant</option>{data.tenantOptions.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>;
}

export function CommercialSaasOverviewPanel({ data }: { data: CommercialSaasData }) {
    const pipeline = data.pipeline;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="Commercial SaaS summary" description="Multi-tenant platform metrics: tenants, subscriptions, licenses, usage, billing, and MRR" /><div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ListCard title="Tenants" subtitle={`${data.stats?.totalTenants ?? 0} total`} meta={`${data.stats?.activeTenants ?? 0} active • ${data.stats?.trialTenants ?? 0} trial`} />
                <ListCard title="Subscriptions & Licenses" subtitle={`${data.stats?.subscriptionCount ?? 0} subscriptions • ${data.stats?.licenseCount ?? 0} licenses`} meta={`${data.stats?.featureFlagCount ?? 0} feature flags • ${data.stats?.portalApiKeyCount ?? 0} API keys`} />
                <ListCard title="Revenue Metrics" subtitle={`MRR $${(data.stats?.mrrUsd ?? 0).toFixed(2)} • ARR $${(data.stats?.arrUsd ?? 0).toFixed(2)}`} meta={`${data.stats?.invoiceCount ?? 0} invoices • ${data.stats?.renewalCount ?? 0} renewals`} />
                <ListCard title="Usage & Health" subtitle={`${data.stats?.usageMeterCount ?? 0} meters • ${data.stats?.registrationCount ?? 0} registrations`} meta={`${(data.stats?.avgHealthScore ?? 0).toFixed(0)}% avg health • ${data.stats?.auditCount ?? 0} audit entries`} />
            </div></Card>
            <Card hover><SectionHeader title="Plan pipeline" description={`${pipeline?.previousStage ?? "Trial"} → ${pipeline?.currentStage ?? "Starter"} → ${pipeline?.nextStage ?? "Growth"}`} /><div className="mt-6 space-y-3">
                {pipeline?.stages?.length ? pipeline.stages.map((stage) => (
                    <ListCard key={stage.key} title={stage.label} subtitle={stage.key} meta={PLAN_TIER_OPTIONS.find((o) => o.value === stage.key)?.label ?? stage.label} />
                )) : <EmptyState title="No pipeline data" description="Plan pipeline stages will appear as tenants progress through trial to enterprise tiers." />}
            </div></Card>
        </div>
    );
}

export function TenantsPanel({ data }: { data: CommercialSaasData }) {
    const form = useForm<TenantFormValues>({ resolver: zodResolver(tenantFormSchema), defaultValues: { tenantKey: "", companyName: "", currentPlan: "trial", domainSlug: "", summary: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Tenants" description="Commercial SaaS tenant hub — trial through enterprise plans" /><div className="mt-6 space-y-3">
                {data.tenants.length === 0 ? <EmptyState title="No tenants" description="Register the first commercial SaaS tenant." /> : data.tenants.map((t) => (
                    <ListCard key={t.id} title={t.companyName} subtitle={`${t.tenantKey} • ${t.currentPlan}`} meta={`${t.tenantStatus}${t.domainSlug ? ` • ${t.domainSlug}` : ""}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create tenant" description="Register a new commercial SaaS tenant" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createTenant(v))}>
                <input {...form.register("tenantKey")} placeholder="Tenant key" className={inputClass} />
                <input {...form.register("companyName")} placeholder="Company name" className={inputClass} />
                <select {...form.register("currentPlan")} className={inputClass}>{PLAN_TIER_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <input {...form.register("domainSlug")} placeholder="Domain slug" className={inputClass} />
                <textarea {...form.register("summary")} placeholder="Summary" rows={3} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create tenant" />
            </form></Card>
        </div>
    );
}

export function RegistrationsPanel({ data }: { data: CommercialSaasData }) {
    const form = useForm<RegistrationsFormValues>({ resolver: zodResolver(registrationsFormSchema), defaultValues: { tenantId: "", registrationKey: "", companyName: "", ownerEmail: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Registrations" description="Tenant-scoped registrations for commercial SaaS platform" /><div className="mt-6 space-y-3">
                {data.registrations.length === 0 ? <EmptyState title="No registrations" description="Create registrations for a tenant." /> : data.registrations.map((item) => (
                    <ListCard key={item.id} title={String(item.registrationKey)} subtitle={`${item.tenantName} • ${String(item.companyName)}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create registration" description="Add a new record for the selected tenant" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRegistration(v))}>
                <TenantSelect data={data} {...form.register("tenantId")} />
                <input {...form.register("registrationKey")} placeholder="Registration key" className={inputClass} />
                <input {...form.register("companyName")} placeholder="Company name" className={inputClass} />
                <input {...form.register("ownerEmail")} placeholder="Owner email" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function TenantProfilesPanel({ data }: { data: CommercialSaasData }) {
    const form = useForm<TenantProfilesFormValues>({ resolver: zodResolver(tenantProfilesFormSchema), defaultValues: { tenantId: "", profileKey: "", legalName: "", billingEmail: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Tenant Profiles" description="Tenant-scoped tenant profiles for commercial SaaS platform" /><div className="mt-6 space-y-3">
                {data.tenantProfiles.length === 0 ? <EmptyState title="No tenant profiles" description="Create tenant profiles for a tenant." /> : data.tenantProfiles.map((item) => (
                    <ListCard key={item.id} title={String(item.profileKey)} subtitle={`${item.tenantName} • ${String(item.legalName)}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create tenant profile" description="Add a new record for the selected tenant" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createTenantProfile(v))}>
                <TenantSelect data={data} {...form.register("tenantId")} />
                <input {...form.register("profileKey")} placeholder="Profile key" className={inputClass} />
                <input {...form.register("legalName")} placeholder="Legal name" className={inputClass} />
                <input {...form.register("billingEmail")} placeholder="Billing email" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function DomainsPanel({ data }: { data: CommercialSaasData }) {
    const form = useForm<DomainConfigsFormValues>({ resolver: zodResolver(domainConfigsFormSchema), defaultValues: { tenantId: "", domainKey: "", subdomain: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Domains" description="Tenant-scoped domains for commercial SaaS platform" /><div className="mt-6 space-y-3">
                {data.domainConfigs.length === 0 ? <EmptyState title="No domains" description="Create domains for a tenant." /> : data.domainConfigs.map((item) => (
                    <ListCard key={item.id} title={String(item.domainKey)} subtitle={`${item.tenantName} • ${String(item.subdomain)}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create domain" description="Add a new record for the selected tenant" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDomainConfig(v))}>
                <TenantSelect data={data} {...form.register("tenantId")} />
                <input {...form.register("domainKey")} placeholder="Domain key" className={inputClass} />
                <input {...form.register("subdomain")} placeholder="Subdomain" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function EmailVerificationPanel({ data }: { data: CommercialSaasData }) {
    const form = useForm<EmailVerificationsFormValues>({ resolver: zodResolver(emailVerificationsFormSchema), defaultValues: { tenantId: "", verificationKey: "", email: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Email Verification" description="Tenant-scoped email verification for commercial SaaS platform" /><div className="mt-6 space-y-3">
                {data.emailVerifications.length === 0 ? <EmptyState title="No email verification" description="Create email verification for a tenant." /> : data.emailVerifications.map((item) => (
                    <ListCard key={item.id} title={String(item.verificationKey)} subtitle={`${item.tenantName} • ${String(item.email)}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create email verification" description="Add a new record for the selected tenant" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createEmailVerification(v))}>
                <TenantSelect data={data} {...form.register("tenantId")} />
                <input {...form.register("verificationKey")} placeholder="Verification key" className={inputClass} />
                <input {...form.register("email")} placeholder="Email" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function TrialsPanel({ data }: { data: CommercialSaasData }) {
    const form = useForm<TrialsFormValues>({ resolver: zodResolver(trialsFormSchema), defaultValues: { tenantId: "", trialKey: "", planTier: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Trials" description="Tenant-scoped trials for commercial SaaS platform" /><div className="mt-6 space-y-3">
                {data.trials.length === 0 ? <EmptyState title="No trials" description="Create trials for a tenant." /> : data.trials.map((item) => (
                    <ListCard key={item.id} title={String(item.trialKey)} subtitle={`${item.tenantName} • ${String(item.planTier)}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create trial" description="Add a new record for the selected tenant" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createTrial(v))}>
                <TenantSelect data={data} {...form.register("tenantId")} />
                <input {...form.register("trialKey")} placeholder="Trial key" className={inputClass} />
                <input {...form.register("planTier")} placeholder="Plan tier" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function WorkspaceSetupPanel({ data }: { data: CommercialSaasData }) {
    const form = useForm<WorkspaceSetupsFormValues>({ resolver: zodResolver(workspaceSetupsFormSchema), defaultValues: { tenantId: "", setupKey: "", workspaceName: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Workspace Setup" description="Tenant-scoped workspace setup for commercial SaaS platform" /><div className="mt-6 space-y-3">
                {data.workspaceSetups.length === 0 ? <EmptyState title="No workspace setup" description="Create workspace setup for a tenant." /> : data.workspaceSetups.map((item) => (
                    <ListCard key={item.id} title={String(item.setupKey)} subtitle={`${item.tenantName} • ${String(item.workspaceName)}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create workspace setup" description="Add a new record for the selected tenant" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createWorkspaceSetup(v))}>
                <TenantSelect data={data} {...form.register("tenantId")} />
                <input {...form.register("setupKey")} placeholder="Setup key" className={inputClass} />
                <input {...form.register("workspaceName")} placeholder="Workspace name" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function RoleProvisionsPanel({ data }: { data: CommercialSaasData }) {
    const form = useForm<RoleProvisionsFormValues>({ resolver: zodResolver(roleProvisionsFormSchema), defaultValues: { tenantId: "", provisionKey: "", roleName: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Role Provisions" description="Tenant-scoped role provisions for commercial SaaS platform" /><div className="mt-6 space-y-3">
                {data.roleProvisions.length === 0 ? <EmptyState title="No role provisions" description="Create role provisions for a tenant." /> : data.roleProvisions.map((item) => (
                    <ListCard key={item.id} title={String(item.provisionKey)} subtitle={`${item.tenantName} • ${String(item.roleName)}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create role provision" description="Add a new record for the selected tenant" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createTenantRoleProvision(v))}>
                <TenantSelect data={data} {...form.register("tenantId")} />
                <input {...form.register("provisionKey")} placeholder="Provision key" className={inputClass} />
                <input {...form.register("roleName")} placeholder="Role name" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function WelcomeExperiencePanel({ data }: { data: CommercialSaasData }) {
    const form = useForm<WelcomeExperiencesFormValues>({ resolver: zodResolver(welcomeExperiencesFormSchema), defaultValues: { tenantId: "", experienceKey: "", title: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Welcome Experience" description="Tenant-scoped welcome experience for commercial SaaS platform" /><div className="mt-6 space-y-3">
                {data.welcomeExperiences.length === 0 ? <EmptyState title="No welcome experience" description="Create welcome experience for a tenant." /> : data.welcomeExperiences.map((item) => (
                    <ListCard key={item.id} title={String(item.experienceKey)} subtitle={`${item.tenantName} • ${String(item.title)}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create welcome experience" description="Add a new record for the selected tenant" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createWelcomeExperience(v))}>
                <TenantSelect data={data} {...form.register("tenantId")} />
                <input {...form.register("experienceKey")} placeholder="Experience key" className={inputClass} />
                <input {...form.register("title")} placeholder="Title" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function SubscriptionsPanel({ data }: { data: CommercialSaasData }) {
    const form = useForm<SubscriptionsFormValues>({ resolver: zodResolver(subscriptionsFormSchema), defaultValues: { tenantId: "", subscriptionKey: "", planTier: "", amountUsd: 0 } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Subscriptions" description="Tenant-scoped subscriptions for commercial SaaS platform" /><div className="mt-6 space-y-3">
                {data.subscriptions.length === 0 ? <EmptyState title="No subscriptions" description="Create subscriptions for a tenant." /> : data.subscriptions.map((item) => (
                    <ListCard key={item.id} title={String(item.subscriptionKey)} subtitle={`${item.tenantName} • ${String(item.planTier)}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create subscription" description="Add a new record for the selected tenant" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createSubscription(v))}>
                <TenantSelect data={data} {...form.register("tenantId")} />
                <input {...form.register("subscriptionKey")} placeholder="Subscription key" className={inputClass} />
                <input {...form.register("planTier")} placeholder="Plan tier" className={inputClass} />
                <input type="number" step="any" {...form.register("amountUsd", { valueAsNumber: true })} placeholder="Amount USD" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function PlanLimitsPanel({ data }: { data: CommercialSaasData }) {
    const form = useForm<PlanLimitsFormValues>({ resolver: zodResolver(planLimitsFormSchema), defaultValues: { tenantId: "", limitKey: "", planTier: "", resourceType: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Plan Limits" description="Tenant-scoped plan limits for commercial SaaS platform" /><div className="mt-6 space-y-3">
                {data.planLimits.length === 0 ? <EmptyState title="No plan limits" description="Create plan limits for a tenant." /> : data.planLimits.map((item) => (
                    <ListCard key={item.id} title={String(item.limitKey)} subtitle={`${item.tenantName} • ${String(item.planTier)}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create plan limit" description="Add a new record for the selected tenant" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createPlanLimit(v))}>
                <TenantSelect data={data} {...form.register("tenantId")} />
                <input {...form.register("limitKey")} placeholder="Limit key" className={inputClass} />
                <input {...form.register("planTier")} placeholder="Plan tier" className={inputClass} />
                <input {...form.register("resourceType")} placeholder="Resource type" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function SubscriptionEventsPanel({ data }: { data: CommercialSaasData }) {
    const form = useForm<SubscriptionEventsFormValues>({ resolver: zodResolver(subscriptionEventsFormSchema), defaultValues: { tenantId: "", eventKey: "", eventType: "", toPlan: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Subscription Events" description="Tenant-scoped subscription events for commercial SaaS platform" /><div className="mt-6 space-y-3">
                {data.subscriptionEvents.length === 0 ? <EmptyState title="No subscription events" description="Create subscription events for a tenant." /> : data.subscriptionEvents.map((item) => (
                    <ListCard key={item.id} title={String(item.eventKey)} subtitle={`${item.tenantName} • ${String(item.eventType)}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create subscription event" description="Add a new record for the selected tenant" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createSubscriptionEvent(v))}>
                <TenantSelect data={data} {...form.register("tenantId")} />
                <input {...form.register("eventKey")} placeholder="Event key" className={inputClass} />
                <input {...form.register("eventType")} placeholder="Event type" className={inputClass} />
                <input {...form.register("toPlan")} placeholder="To plan" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function LicensesPanel({ data }: { data: CommercialSaasData }) {
    const form = useForm<LicensesFormValues>({ resolver: zodResolver(licensesFormSchema), defaultValues: { tenantId: "", licenseKey: "", name: "", licenseType: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Licenses" description="Tenant-scoped licenses for commercial SaaS platform" /><div className="mt-6 space-y-3">
                {data.licenses.length === 0 ? <EmptyState title="No licenses" description="Create licenses for a tenant." /> : data.licenses.map((item) => (
                    <ListCard key={item.id} title={String(item.licenseKey)} subtitle={`${item.tenantName} • ${String(item.name)}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create license" description="Add a new record for the selected tenant" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createLicense(v))}>
                <TenantSelect data={data} {...form.register("tenantId")} />
                <input {...form.register("licenseKey")} placeholder="License key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <input {...form.register("licenseType")} placeholder="License type" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function LicenseAllocationsPanel({ data }: { data: CommercialSaasData }) {
    const form = useForm<LicenseAllocationsFormValues>({ resolver: zodResolver(licenseAllocationsFormSchema), defaultValues: { tenantId: "", allocationKey: "", resourceName: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="License Allocations" description="Tenant-scoped license allocations for commercial SaaS platform" /><div className="mt-6 space-y-3">
                {data.licenseAllocations.length === 0 ? <EmptyState title="No license allocations" description="Create license allocations for a tenant." /> : data.licenseAllocations.map((item) => (
                    <ListCard key={item.id} title={String(item.allocationKey)} subtitle={`${item.tenantName} • ${String(item.resourceName)}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create license allocation" description="Add a new record for the selected tenant" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createLicenseAllocation(v))}>
                <TenantSelect data={data} {...form.register("tenantId")} />
                <input {...form.register("allocationKey")} placeholder="Allocation key" className={inputClass} />
                <input {...form.register("resourceName")} placeholder="Resource name" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function FeatureFlagsPanel({ data }: { data: CommercialSaasData }) {
    const form = useForm<FeatureFlagsFormValues>({ resolver: zodResolver(featureFlagsFormSchema), defaultValues: { tenantId: "", flagKey: "", name: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Feature Flags" description="Tenant-scoped feature flags for commercial SaaS platform" /><div className="mt-6 space-y-3">
                {data.featureFlags.length === 0 ? <EmptyState title="No feature flags" description="Create feature flags for a tenant." /> : data.featureFlags.map((item) => (
                    <ListCard key={item.id} title={String(item.flagKey)} subtitle={`${item.tenantName} • ${String(item.name)}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create feature flag" description="Add a new record for the selected tenant" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createFeatureFlag(v))}>
                <TenantSelect data={data} {...form.register("tenantId")} />
                <input {...form.register("flagKey")} placeholder="Flag key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function PortalSettingsPanel({ data }: { data: CommercialSaasData }) {
    const form = useForm<PortalSettingsFormValues>({ resolver: zodResolver(portalSettingsFormSchema), defaultValues: { tenantId: "", settingsKey: "", portalName: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Portal Settings" description="Tenant-scoped portal settings for commercial SaaS platform" /><div className="mt-6 space-y-3">
                {data.portalSettings.length === 0 ? <EmptyState title="No portal settings" description="Create portal settings for a tenant." /> : data.portalSettings.map((item) => (
                    <ListCard key={item.id} title={String(item.settingsKey)} subtitle={`${item.tenantName} • ${String(item.portalName)}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create portal setting" description="Add a new record for the selected tenant" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createPortalSetting(v))}>
                <TenantSelect data={data} {...form.register("tenantId")} />
                <input {...form.register("settingsKey")} placeholder="Settings key" className={inputClass} />
                <input {...form.register("portalName")} placeholder="Portal name" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function PortalBrandingPanel({ data }: { data: CommercialSaasData }) {
    const form = useForm<PortalBrandingFormValues>({ resolver: zodResolver(portalBrandingFormSchema), defaultValues: { tenantId: "", brandingKey: "", primaryColor: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Portal Branding" description="Tenant-scoped portal branding for commercial SaaS platform" /><div className="mt-6 space-y-3">
                {data.portalBranding.length === 0 ? <EmptyState title="No portal branding" description="Create portal branding for a tenant." /> : data.portalBranding.map((item) => (
                    <ListCard key={item.id} title={String(item.brandingKey)} subtitle={`${item.tenantName} • ${String(item.primaryColor)}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create portal branding" description="Add a new record for the selected tenant" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createPortalBranding(v))}>
                <TenantSelect data={data} {...form.register("tenantId")} />
                <input {...form.register("brandingKey")} placeholder="Branding key" className={inputClass} />
                <input {...form.register("primaryColor")} placeholder="Primary color" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function PortalIntegrationsPanel({ data }: { data: CommercialSaasData }) {
    const form = useForm<PortalIntegrationsFormValues>({ resolver: zodResolver(portalIntegrationsFormSchema), defaultValues: { tenantId: "", integrationKey: "", provider: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Portal Integrations" description="Tenant-scoped portal integrations for commercial SaaS platform" /><div className="mt-6 space-y-3">
                {data.portalIntegrations.length === 0 ? <EmptyState title="No portal integrations" description="Create portal integrations for a tenant." /> : data.portalIntegrations.map((item) => (
                    <ListCard key={item.id} title={String(item.integrationKey)} subtitle={`${item.tenantName} • ${String(item.provider)}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create portal integration" description="Add a new record for the selected tenant" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createPortalIntegration(v))}>
                <TenantSelect data={data} {...form.register("tenantId")} />
                <input {...form.register("integrationKey")} placeholder="Integration key" className={inputClass} />
                <input {...form.register("provider")} placeholder="Provider" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function PortalApiKeysPanel({ data }: { data: CommercialSaasData }) {
    const form = useForm<PortalApiKeysFormValues>({ resolver: zodResolver(portalApiKeysFormSchema), defaultValues: { tenantId: "", keyName: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Portal API Keys" description="Tenant-scoped portal API keys for commercial SaaS platform — security-first API key governance" /><div className="mt-6 space-y-3">
                {data.portalApiKeys.length === 0 ? <EmptyState title="No portal api keys" description="Create portal api keys for a tenant." /> : data.portalApiKeys.map((item) => (
                    <ListCard key={item.id} title={String(item.keyName)} subtitle={`${item.tenantName} • ${String(item.keyName)}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create portal api key" description="Add a new record for the selected tenant" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createPortalApiKey(v))}>
                <TenantSelect data={data} {...form.register("tenantId")} />
                <input {...form.register("keyName")} placeholder="Key name" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function UsageMetersPanel({ data }: { data: CommercialSaasData }) {
    const form = useForm<UsageMetersFormValues>({ resolver: zodResolver(usageMetersFormSchema), defaultValues: { tenantId: "", meterKey: "", meterType: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Usage Meters" description="Tenant-scoped usage meters for commercial SaaS platform" /><div className="mt-6 space-y-3">
                {data.usageMeters.length === 0 ? <EmptyState title="No usage meters" description="Create usage meters for a tenant." /> : data.usageMeters.map((item) => (
                    <ListCard key={item.id} title={String(item.meterKey)} subtitle={`${item.tenantName} • ${String(item.meterType)}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create usage meter" description="Add a new record for the selected tenant" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createUsageMeter(v))}>
                <TenantSelect data={data} {...form.register("tenantId")} />
                <input {...form.register("meterKey")} placeholder="Meter key" className={inputClass} />
                <input {...form.register("meterType")} placeholder="Meter type" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function UsageRecordsPanel({ data }: { data: CommercialSaasData }) {
    const form = useForm<UsageRecordsFormValues>({ resolver: zodResolver(usageRecordsFormSchema), defaultValues: { tenantId: "", recordKey: "", meterType: "", quantity: 0 } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Usage Records" description="Tenant-scoped usage records for commercial SaaS platform" /><div className="mt-6 space-y-3">
                {data.usageRecords.length === 0 ? <EmptyState title="No usage records" description="Create usage records for a tenant." /> : data.usageRecords.map((item) => (
                    <ListCard key={item.id} title={String(item.recordKey)} subtitle={`${item.tenantName} • ${String(item.meterType)}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create usage record" description="Add a new record for the selected tenant" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createUsageRecord(v))}>
                <TenantSelect data={data} {...form.register("tenantId")} />
                <input {...form.register("recordKey")} placeholder="Record key" className={inputClass} />
                <input {...form.register("meterType")} placeholder="Meter type" className={inputClass} />
                <input type="number" step="any" {...form.register("quantity", { valueAsNumber: true })} placeholder="Quantity" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function InvoicesPanel({ data }: { data: CommercialSaasData }) {
    const form = useForm<InvoicesFormValues>({ resolver: zodResolver(invoicesFormSchema), defaultValues: { tenantId: "", invoiceKey: "", invoiceNumber: "", amountUsd: 0 } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Invoices" description="Tenant-scoped invoices for commercial SaaS platform" /><div className="mt-6 space-y-3">
                {data.invoices.length === 0 ? <EmptyState title="No invoices" description="Create invoices for a tenant." /> : data.invoices.map((item) => (
                    <ListCard key={item.id} title={String(item.invoiceKey)} subtitle={`${item.tenantName} • ${String(item.invoiceNumber)}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create invoice" description="Add a new record for the selected tenant" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createCommercialInvoice(v))}>
                <TenantSelect data={data} {...form.register("tenantId")} />
                <input {...form.register("invoiceKey")} placeholder="Invoice key" className={inputClass} />
                <input {...form.register("invoiceNumber")} placeholder="Invoice number" className={inputClass} />
                <input type="number" step="any" {...form.register("amountUsd", { valueAsNumber: true })} placeholder="Amount USD" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function BillingCreditsPanel({ data }: { data: CommercialSaasData }) {
    const form = useForm<BillingCreditsFormValues>({ resolver: zodResolver(billingCreditsFormSchema), defaultValues: { tenantId: "", creditKey: "", reason: "", balanceUsd: 0 } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Billing Credits" description="Tenant-scoped billing credits for commercial SaaS platform" /><div className="mt-6 space-y-3">
                {data.billingCredits.length === 0 ? <EmptyState title="No billing credits" description="Create billing credits for a tenant." /> : data.billingCredits.map((item) => (
                    <ListCard key={item.id} title={String(item.creditKey)} subtitle={`${item.tenantName} • ${String(item.reason)}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create billing credit" description="Add a new record for the selected tenant" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createBillingCredit(v))}>
                <TenantSelect data={data} {...form.register("tenantId")} />
                <input {...form.register("creditKey")} placeholder="Credit key" className={inputClass} />
                <input {...form.register("reason")} placeholder="Reason" className={inputClass} />
                <input type="number" step="any" {...form.register("balanceUsd", { valueAsNumber: true })} placeholder="Balance USD" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function BillingCouponsPanel({ data }: { data: CommercialSaasData }) {
    const form = useForm<BillingCouponsFormValues>({ resolver: zodResolver(billingCouponsFormSchema), defaultValues: { tenantId: "", couponKey: "", code: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Billing Coupons" description="Tenant-scoped billing coupons for commercial SaaS platform" /><div className="mt-6 space-y-3">
                {data.billingCoupons.length === 0 ? <EmptyState title="No billing coupons" description="Create billing coupons for a tenant." /> : data.billingCoupons.map((item) => (
                    <ListCard key={item.id} title={String(item.couponKey)} subtitle={`${item.tenantName} • ${String(item.code)}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create billing coupon" description="Add a new record for the selected tenant" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createBillingCoupon(v))}>
                <TenantSelect data={data} {...form.register("tenantId")} />
                <input {...form.register("couponKey")} placeholder="Coupon key" className={inputClass} />
                <input {...form.register("code")} placeholder="Code" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function RecurringBillingPanel({ data }: { data: CommercialSaasData }) {
    const form = useForm<RecurringBillingFormValues>({ resolver: zodResolver(recurringBillingFormSchema), defaultValues: { tenantId: "", billingKey: "", billingCycle: "", amountUsd: 0 } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Recurring Billing" description="Tenant-scoped recurring billing for commercial SaaS platform" /><div className="mt-6 space-y-3">
                {data.recurringBilling.length === 0 ? <EmptyState title="No recurring billing" description="Create recurring billing for a tenant." /> : data.recurringBilling.map((item) => (
                    <ListCard key={item.id} title={String(item.billingKey)} subtitle={`${item.tenantName} • ${String(item.billingCycle)}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create recurring billing" description="Add a new record for the selected tenant" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRecurringBilling(v))}>
                <TenantSelect data={data} {...form.register("tenantId")} />
                <input {...form.register("billingKey")} placeholder="Billing key" className={inputClass} />
                <input {...form.register("billingCycle")} placeholder="Billing cycle" className={inputClass} />
                <input type="number" step="any" {...form.register("amountUsd", { valueAsNumber: true })} placeholder="Amount USD" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function HealthScoresPanel({ data }: { data: CommercialSaasData }) {
    const form = useForm<HealthScoresFormValues>({ resolver: zodResolver(healthScoresFormSchema), defaultValues: { tenantId: "", scoreKey: "", overallScore: 0 } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Health Scores" description="Tenant-scoped health scores for commercial SaaS platform" /><div className="mt-6 space-y-3">
                {data.healthScores.length === 0 ? <EmptyState title="No health scores" description="Create health scores for a tenant." /> : data.healthScores.map((item) => (
                    <ListCard key={item.id} title={String(item.scoreKey)} subtitle={`${item.tenantName} • ${String(item.overallScore)}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create health score" description="Add a new record for the selected tenant" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createTenantHealthScore(v))}>
                <TenantSelect data={data} {...form.register("tenantId")} />
                <input {...form.register("scoreKey")} placeholder="Score key" className={inputClass} />
                <input type="number" step="any" {...form.register("overallScore", { valueAsNumber: true })} placeholder="Overall score" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function OnboardingChecklistsPanel({ data }: { data: CommercialSaasData }) {
    const form = useForm<OnboardingChecklistsFormValues>({ resolver: zodResolver(onboardingChecklistsFormSchema), defaultValues: { tenantId: "", checklistKey: "", name: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Onboarding Checklists" description="Tenant-scoped onboarding checklists for commercial SaaS platform" /><div className="mt-6 space-y-3">
                {data.onboardingChecklists.length === 0 ? <EmptyState title="No onboarding checklists" description="Create onboarding checklists for a tenant." /> : data.onboardingChecklists.map((item) => (
                    <ListCard key={item.id} title={String(item.checklistKey)} subtitle={`${item.tenantName} • ${String(item.name)}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create onboarding checklist" description="Add a new record for the selected tenant" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createOnboardingChecklist(v))}>
                <TenantSelect data={data} {...form.register("tenantId")} />
                <input {...form.register("checklistKey")} placeholder="Checklist key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ProductAdoptionPanel({ data }: { data: CommercialSaasData }) {
    const form = useForm<ProductAdoptionFormValues>({ resolver: zodResolver(productAdoptionFormSchema), defaultValues: { tenantId: "", adoptionKey: "", moduleName: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Product Adoption" description="Tenant-scoped product adoption for commercial SaaS platform" /><div className="mt-6 space-y-3">
                {data.productAdoption.length === 0 ? <EmptyState title="No product adoption" description="Create product adoption for a tenant." /> : data.productAdoption.map((item) => (
                    <ListCard key={item.id} title={String(item.adoptionKey)} subtitle={`${item.tenantName} • ${String(item.moduleName)}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create product adoption" description="Add a new record for the selected tenant" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createProductAdoption(v))}>
                <TenantSelect data={data} {...form.register("tenantId")} />
                <input {...form.register("adoptionKey")} placeholder="Adoption key" className={inputClass} />
                <input {...form.register("moduleName")} placeholder="Module name" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function RenewalTrackingPanel({ data }: { data: CommercialSaasData }) {
    const form = useForm<RenewalTrackingFormValues>({ resolver: zodResolver(renewalTrackingFormSchema), defaultValues: { tenantId: "", renewalKey: "", renewalDate: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Renewal Tracking" description="Tenant-scoped renewal tracking for commercial SaaS platform" /><div className="mt-6 space-y-3">
                {data.renewalTracking.length === 0 ? <EmptyState title="No renewal tracking" description="Create renewal tracking for a tenant." /> : data.renewalTracking.map((item) => (
                    <ListCard key={item.id} title={String(item.renewalKey)} subtitle={`${item.tenantName} • ${String(item.renewalDate)}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create renewal tracking" description="Add a new record for the selected tenant" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRenewalTracking(v))}>
                <TenantSelect data={data} {...form.register("tenantId")} />
                <input {...form.register("renewalKey")} placeholder="Renewal key" className={inputClass} />
                <input {...form.register("renewalDate")} placeholder="Renewal date" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function SupportSummariesPanel({ data }: { data: CommercialSaasData }) {
    const form = useForm<SupportSummariesFormValues>({ resolver: zodResolver(supportSummariesFormSchema), defaultValues: { tenantId: "", summaryKey: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Support Summaries" description="Tenant-scoped support summaries for commercial SaaS platform" /><div className="mt-6 space-y-3">
                {data.supportSummaries.length === 0 ? <EmptyState title="No support summaries" description="Create support summaries for a tenant." /> : data.supportSummaries.map((item) => (
                    <ListCard key={item.id} title={String(item.summaryKey)} subtitle={`${item.tenantName} • ${String(item.summaryKey)}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create support summarie" description="Add a new record for the selected tenant" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createSupportSummary(v))}>
                <TenantSelect data={data} {...form.register("tenantId")} />
                <input {...form.register("summaryKey")} placeholder="Summary key" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function AdminMetricsPanel({ data }: { data: CommercialSaasData }) {
    const form = useForm<AdminMetricFormValues>({ resolver: zodResolver(adminMetricFormSchema), defaultValues: { metricsKey: "", mrrUsd: 0, arrUsd: 0, activeTenants: 0, trialTenants: 0 } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Admin metrics" description="Organization-wide MRR, ARR, churn, and tenant growth metrics" /><div className="mt-6 space-y-3">
                {data.adminMetrics.length === 0 ? <EmptyState title="No admin metrics" description="Record platform-wide commercial metrics." /> : data.adminMetrics.map((m) => (
                    <ListCard key={m.id} title={m.metricsKey} subtitle={`${m.metricDate} • ${m.activeTenants} active tenants`} meta={`MRR $${m.mrrUsd.toFixed(2)} • ARR $${m.arrUsd.toFixed(2)} • ${m.avgHealthScore.toFixed(0)}% health`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create admin metric" description="Record organization-wide SaaS metrics" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createAdminMetric(v))}>
                <input {...form.register("metricsKey")} placeholder="Metrics key" className={inputClass} />
                <input type="number" step="any" {...form.register("mrrUsd", { valueAsNumber: true })} placeholder="MRR USD" className={inputClass} />
                <input type="number" step="any" {...form.register("arrUsd", { valueAsNumber: true })} placeholder="ARR USD" className={inputClass} />
                <input type="number" {...form.register("activeTenants", { valueAsNumber: true })} placeholder="Active tenants" className={inputClass} />
                <input type="number" {...form.register("trialTenants", { valueAsNumber: true })} placeholder="Trial tenants" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create metric" />
            </form></Card>
        </div>
    );
}

export function SaasAuditPanel({ data }: { data: CommercialSaasData }) {
    return (
        <Card hover><SectionHeader title="Commercial SaaS audit history" description="Security-first audit trail with security_level classification for all commercial operations" /><div className="mt-6 space-y-3">
            {data.auditLogs.length === 0 ? <EmptyState title="No audit entries" description="Audit logs are created automatically for tenant, subscription, billing, and API key operations." /> : data.auditLogs.map((entry) => (
                <ListCard key={entry.id} title={entry.summary} subtitle={`${entry.entityType} • ${entry.action}`} meta={`${entry.securityLevel} • ${new Date(entry.createdAt).toLocaleString()}`} />
            ))}
        </div></Card>
    );
}

export function CommercialSaasSdkPanel({ data }: { data: CommercialSaasData }) {
    return (
        <Card hover><SectionHeader title="Shared Commercial SaaS SDK" description="Import from @/src/modules/commercial-saas/sdk for tenant registration, subscription management, and usage tracking" /><div className="mt-6 space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <ListCard title="createCommercialSaasClient()" subtitle="Factory for module-scoped Commercial SaaS client with auth context" meta="Primary SDK for multi-tenant SaaS operations" />
            <ListCard title="sdkRegisterTenant()" subtitle="Register tenant with AI orchestration + knowledge context" meta="moduleSource: commercial_saas" />
            <ListCard title="sdkManageSubscription()" subtitle="Manage subscription plan changes with audit trail" meta="Supports trial → starter → growth → professional → enterprise" />
            <ListCard title="sdkTrackUsage()" subtitle="Track usage meters with AI orchestration integration" meta="Seat, AI token, API call, and storage meters" />
            <p className="text-xs text-slate-500">Theme: {SAAS_THEME.primary} • Tenants loaded: {data.tenants.length}</p>
            <pre className="overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">{`import { createCommercialSaasClient } from "@/src/modules/commercial-saas/sdk";

const saas = createCommercialSaasClient(userId, email, fullName);
await saas.registerTenant({ tenantKey: "acme", companyName: "Acme Corp", ownerEmail: "owner@acme.com" });
await saas.manageSubscription({ tenantId, subscriptionKey: "sub-001", planTier: "starter" });
await saas.trackUsage({ tenantId, recordKey: "usage-001", meterType: "ai_tokens", quantity: 1500 });`}</pre>
        </div></Card>
    );
}
