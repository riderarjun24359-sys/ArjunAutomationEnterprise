"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/src/components/ui/card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { CMP_THEME, DEMO_REQUEST_STATUS_OPTIONS, ALERT_SEVERITY_OPTIONS, BRAND_STATUS_OPTIONS, PROPOSAL_STATUS_OPTIONS, CONTRACT_STATUS_OPTIONS, SUBSCRIPTION_STATUS_OPTIONS, SUPPORT_STATUS_OPTIONS } from "@/src/modules/company-foundation/constants";
import type { useCompanyFoundation } from "@/src/modules/company-foundation/hooks/useCompanyFoundation";
import {
    companyHubsFormSchema,
    type companyHubsFormValues,
    brandProfilesFormSchema,
    type brandProfilesFormValues,
    logoAssetsFormSchema,
    type logoAssetsFormValues,
    themeConfigsFormSchema,
    type themeConfigsFormValues,
    brandAssetsFormSchema,
    type brandAssetsFormValues,
    websitePagesFormSchema,
    type websitePagesFormValues,
    websiteFeaturesFormSchema,
    type websiteFeaturesFormValues,
    websiteSectionsFormSchema,
    type websiteSectionsFormValues,
    demoRequestsFormSchema,
    type demoRequestsFormValues,
    pricingPlansFormSchema,
    type pricingPlansFormValues,
    pricingPackagesFormSchema,
    type pricingPackagesFormValues,
    modulePricingFormSchema,
    type modulePricingFormValues,
    discountRulesFormSchema,
    type discountRulesFormValues,
    proposalsFormSchema,
    type proposalsFormValues,
    proposalDocumentsFormSchema,
    type proposalDocumentsFormValues,
    proposalContractsFormSchema,
    type proposalContractsFormValues,
    proposalHistoryFormSchema,
    type proposalHistoryFormValues,
    portalDashboardsFormSchema,
    type portalDashboardsFormValues,
    portalSubscriptionsFormSchema,
    type portalSubscriptionsFormValues,
    portalBillingFormSchema,
    type portalBillingFormValues,
    portalSupportFormSchema,
    type portalSupportFormValues,
    docGuidesFormSchema,
    type docGuidesFormValues,
    docApiReferencesFormSchema,
    type docApiReferencesFormValues,
    docVersionsFormSchema,
    type docVersionsFormValues,
    demoOrganizationsFormSchema,
    type demoOrganizationsFormValues,
    demoDataSetsFormSchema,
    type demoDataSetsFormValues,
    demoUsersFormSchema,
    type demoUsersFormValues,
    companyMetricsFormSchema,
    type companyMetricsFormValues,
    companyHealthFormSchema,
    type companyHealthFormValues,
    executiveKpisFormSchema,
    type executiveKpisFormValues,
    companyFailuresFormSchema,
    type companyFailuresFormValues,
} from "@/src/modules/company-foundation/schemas";

type RetailData = ReturnType<typeof useCompanyFoundation>;
const inputClass = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-emerald-500/20 focus:ring-4 dark:border-slate-800 dark:bg-emerald-950";
function SaveButton({ loading, label = "Save changes" }: { loading?: boolean; label?: string }) {
    return <button type="submit" disabled={loading} className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:opacity-60">{loading ? "Saving..." : label}</button>;
}
function ListCard({ title, subtitle, meta }: { title: string; subtitle: string; meta?: string }) {
    return <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800"><p className="font-medium">{title}</p><p className="text-sm text-emerald-500">{subtitle}</p>{meta ? <p className="mt-1 text-xs text-emerald-600">{meta}</p> : null}</div>;
}
function CompanyHubSelect({ data, ...props }: { data: RetailData } & React.SelectHTMLAttributes<HTMLSelectElement>) {
    return <select {...props} className={inputClass}><option value="">Select retail operating system</option>{data.companyHubOptions.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>;
}

export function CompanyFoundationOverviewPanel({ data }: { data: RetailData }) {
    const pipeline = data.pipeline;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="Company Foundation summary" description="Brand, website, pricing, proposal, customer portal, documentation, demo, and dashboard" /><div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ListCard title="Company Hubs" subtitle={`${data.stats?.totalCompanyHubs ?? 0} total`} meta={`${data.stats?.activeCompanyHubs ?? 0} active • ${data.stats?.brandProfileCount ?? 0} brand profiles`} />
                <ListCard title="Platform Ops" subtitle={`${data.stats?.portalDashboardCount ?? 0} portal dashboards`} meta={`${data.stats?.websitePageCount ?? 0} website pages • ${data.stats?.pricingPlanCount ?? 0} pricing plans`} />
                <ListCard title="Health" subtitle={`${(data.stats?.overallCompanyScore ?? 0).toFixed(1)} overall company score`} meta={`${data.stats?.openCompanyFailureCount ?? 0} open failures`} />
                <ListCard title="Audit Trail" subtitle={`${data.stats?.auditCount ?? 0} audit entries`} meta="Security-first company foundation" />
            </div></Card>
            <Card hover><SectionHeader title="Company foundation pipeline" description={`${pipeline?.previousStage ?? "configured"} → ${pipeline?.currentStage ?? "active"} → ${pipeline?.nextStage ?? "degraded"}`} /><div className="mt-6 space-y-3">
                {pipeline?.stages?.length ? pipeline.stages.map((stage) => (
                    <ListCard key={stage.key} title={stage.label} subtitle={stage.key} meta={stage.label} />
                )) : <EmptyState title="No pipeline data" description="Company foundation pipeline stages will appear as hubs are configured." />}
            </div></Card>
        </div>
    );
}

export function CompanyHubsPanel({ data }: { data: RetailData }) {
    const form = useForm<companyHubsFormValues>({ resolver: zodResolver(companyHubsFormSchema), defaultValues: {"hubKey":"","hubName":"","environment":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Company Hubs" description="Enterprise retail operating system company hubs" /><div className="mt-6 space-y-3">
                {data.companyHubs.length === 0 ? <EmptyState title="No company hubs" description="Create the first company hubs record." /> : data.companyHubs.map((item) => (
                    <ListCard key={item.id} title={String(item.hubName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.hubKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create company hubs" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createCompanyHub(v))}>
                <input {...form.register("hubKey")} placeholder="hubKey" className={inputClass} />
                <input {...form.register("hubName")} placeholder="hubName" className={inputClass} />
                <input {...form.register("environment")} placeholder="environment" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function BrandProfilesPanel({ data }: { data: RetailData }) {
    const form = useForm<brandProfilesFormValues>({ resolver: zodResolver(brandProfilesFormSchema), defaultValues: {"companyHubId":"","profileKey":"","profileName":"","brandStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Brand Profiles" description="Enterprise retail operating system brand profiles" /><div className="mt-6 space-y-3">
                {data.brandProfiles.length === 0 ? <EmptyState title="No brand profiles" description="Create the first brand profiles record." /> : data.brandProfiles.map((item) => (
                    <ListCard key={item.id} title={String(item.profileName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.brandStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create brand profiles" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createBrandProfile(v))}>
                <CompanyHubSelect data={data} {...form.register("companyHubId")} />
                <input {...form.register("profileKey")} placeholder="profileKey" className={inputClass} />
                <input {...form.register("profileName")} placeholder="profileName" className={inputClass} />
                <select {...form.register("brandStatus")} className={inputClass}>{BRAND_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function LogoAssetsPanel({ data }: { data: RetailData }) {
    const form = useForm<logoAssetsFormValues>({ resolver: zodResolver(logoAssetsFormSchema), defaultValues: {"companyHubId":"","assetKey":"","assetName":"","assetType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Logo Assets" description="Enterprise retail operating system logo assets" /><div className="mt-6 space-y-3">
                {data.logoAssets.length === 0 ? <EmptyState title="No logo assets" description="Create the first logo assets record." /> : data.logoAssets.map((item) => (
                    <ListCard key={item.id} title={String(item.assetName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.assetType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create logo assets" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createLogoAsset(v))}>
                <CompanyHubSelect data={data} {...form.register("companyHubId")} />
                <input {...form.register("assetKey")} placeholder="assetKey" className={inputClass} />
                <input {...form.register("assetName")} placeholder="assetName" className={inputClass} />
                <input {...form.register("assetType")} placeholder="assetType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ThemeConfigsPanel({ data }: { data: RetailData }) {
    const form = useForm<themeConfigsFormValues>({ resolver: zodResolver(themeConfigsFormSchema), defaultValues: {"companyHubId":"","configKey":"","configName":"","primaryColor":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Theme Configs" description="Enterprise retail operating system theme configs" /><div className="mt-6 space-y-3">
                {data.themeConfigs.length === 0 ? <EmptyState title="No theme configs" description="Create the first theme configs record." /> : data.themeConfigs.map((item) => (
                    <ListCard key={item.id} title={String(item.configName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.primaryColor}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create theme configs" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createThemeConfig(v))}>
                <CompanyHubSelect data={data} {...form.register("companyHubId")} />
                <input {...form.register("configKey")} placeholder="configKey" className={inputClass} />
                <input {...form.register("configName")} placeholder="configName" className={inputClass} />
                <input {...form.register("primaryColor")} placeholder="primaryColor" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function BrandAssetsPanel({ data }: { data: RetailData }) {
    const form = useForm<brandAssetsFormValues>({ resolver: zodResolver(brandAssetsFormSchema), defaultValues: {"companyHubId":"","assetKey":"","assetName":"","assetCategory":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Brand Assets" description="Enterprise retail operating system brand assets" /><div className="mt-6 space-y-3">
                {data.brandAssets.length === 0 ? <EmptyState title="No brand assets" description="Create the first brand assets record." /> : data.brandAssets.map((item) => (
                    <ListCard key={item.id} title={String(item.assetName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.assetCategory}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create brand assets" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createBrandAsset(v))}>
                <CompanyHubSelect data={data} {...form.register("companyHubId")} />
                <input {...form.register("assetKey")} placeholder="assetKey" className={inputClass} />
                <input {...form.register("assetName")} placeholder="assetName" className={inputClass} />
                <input {...form.register("assetCategory")} placeholder="assetCategory" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function WebsitePagesPanel({ data }: { data: RetailData }) {
    const form = useForm<websitePagesFormValues>({ resolver: zodResolver(websitePagesFormSchema), defaultValues: {"companyHubId":"","pageKey":"","pageTitle":"","pageSlug":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Website Pages" description="Enterprise retail operating system website pages" /><div className="mt-6 space-y-3">
                {data.websitePages.length === 0 ? <EmptyState title="No website pages" description="Create the first website pages record." /> : data.websitePages.map((item) => (
                    <ListCard key={item.id} title={String(item.pageTitle)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.pageSlug}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create website pages" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createWebsitePage(v))}>
                <CompanyHubSelect data={data} {...form.register("companyHubId")} />
                <input {...form.register("pageKey")} placeholder="pageKey" className={inputClass} />
                <input {...form.register("pageTitle")} placeholder="pageTitle" className={inputClass} />
                <input {...form.register("pageSlug")} placeholder="pageSlug" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function WebsiteFeaturesPanel({ data }: { data: RetailData }) {
    const form = useForm<websiteFeaturesFormValues>({ resolver: zodResolver(websiteFeaturesFormSchema), defaultValues: {"companyHubId":"","featureKey":"","featureName":"","featureType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Website Features" description="Enterprise retail operating system website features" /><div className="mt-6 space-y-3">
                {data.websiteFeatures.length === 0 ? <EmptyState title="No website features" description="Create the first website features record." /> : data.websiteFeatures.map((item) => (
                    <ListCard key={item.id} title={String(item.featureName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.featureType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create website features" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createWebsiteFeature(v))}>
                <CompanyHubSelect data={data} {...form.register("companyHubId")} />
                <input {...form.register("featureKey")} placeholder="featureKey" className={inputClass} />
                <input {...form.register("featureName")} placeholder="featureName" className={inputClass} />
                <input {...form.register("featureType")} placeholder="featureType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function WebsiteSectionsPanel({ data }: { data: RetailData }) {
    const form = useForm<websiteSectionsFormValues>({ resolver: zodResolver(websiteSectionsFormSchema), defaultValues: {"companyHubId":"","sectionKey":"","sectionName":"","sectionType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Website Sections" description="Enterprise retail operating system website sections" /><div className="mt-6 space-y-3">
                {data.websiteSections.length === 0 ? <EmptyState title="No website sections" description="Create the first website sections record." /> : data.websiteSections.map((item) => (
                    <ListCard key={item.id} title={String(item.sectionName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.sectionType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create website sections" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createWebsiteSection(v))}>
                <CompanyHubSelect data={data} {...form.register("companyHubId")} />
                <input {...form.register("sectionKey")} placeholder="sectionKey" className={inputClass} />
                <input {...form.register("sectionName")} placeholder="sectionName" className={inputClass} />
                <input {...form.register("sectionType")} placeholder="sectionType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function DemoRequestsPanel({ data }: { data: RetailData }) {
    const form = useForm<demoRequestsFormValues>({ resolver: zodResolver(demoRequestsFormSchema), defaultValues: {"companyHubId":"","requestKey":"","requestName":"","requestStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Demo Requests" description="Enterprise retail operating system demo requests" /><div className="mt-6 space-y-3">
                {data.demoRequests.length === 0 ? <EmptyState title="No demo requests" description="Create the first demo requests record." /> : data.demoRequests.map((item) => (
                    <ListCard key={item.id} title={String(item.requestName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.requestStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create demo requests" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDemoRequest(v))}>
                <CompanyHubSelect data={data} {...form.register("companyHubId")} />
                <input {...form.register("requestKey")} placeholder="requestKey" className={inputClass} />
                <input {...form.register("requestName")} placeholder="requestName" className={inputClass} />
                <select {...form.register("requestStatus")} className={inputClass}>{DEMO_REQUEST_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function PricingPlansPanel({ data }: { data: RetailData }) {
    const form = useForm<pricingPlansFormValues>({ resolver: zodResolver(pricingPlansFormSchema), defaultValues: {"companyHubId":"","planKey":"","planName":"","planTier":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Pricing Plans" description="Enterprise retail operating system pricing plans" /><div className="mt-6 space-y-3">
                {data.pricingPlans.length === 0 ? <EmptyState title="No pricing plans" description="Create the first pricing plans record." /> : data.pricingPlans.map((item) => (
                    <ListCard key={item.id} title={String(item.planName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.planTier}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create pricing plans" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createPricingPlan(v))}>
                <CompanyHubSelect data={data} {...form.register("companyHubId")} />
                <input {...form.register("planKey")} placeholder="planKey" className={inputClass} />
                <input {...form.register("planName")} placeholder="planName" className={inputClass} />
                <input {...form.register("planTier")} placeholder="planTier" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function PricingPackagesPanel({ data }: { data: RetailData }) {
    const form = useForm<pricingPackagesFormValues>({ resolver: zodResolver(pricingPackagesFormSchema), defaultValues: {"companyHubId":"","packageKey":"","packageName":"","packageType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Pricing Packages" description="Enterprise retail operating system pricing packages" /><div className="mt-6 space-y-3">
                {data.pricingPackages.length === 0 ? <EmptyState title="No pricing packages" description="Create the first pricing packages record." /> : data.pricingPackages.map((item) => (
                    <ListCard key={item.id} title={String(item.packageName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.packageType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create pricing packages" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createPricingPackage(v))}>
                <CompanyHubSelect data={data} {...form.register("companyHubId")} />
                <input {...form.register("packageKey")} placeholder="packageKey" className={inputClass} />
                <input {...form.register("packageName")} placeholder="packageName" className={inputClass} />
                <input {...form.register("packageType")} placeholder="packageType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ModulePricingsPanel({ data }: { data: RetailData }) {
    const form = useForm<modulePricingFormValues>({ resolver: zodResolver(modulePricingFormSchema), defaultValues: {"companyHubId":"","pricingKey":"","moduleName":"","priceAmount":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Module Pricing" description="Enterprise retail operating system module pricing" /><div className="mt-6 space-y-3">
                {data.modulePricing.length === 0 ? <EmptyState title="No module pricing" description="Create the first module pricing record." /> : data.modulePricing.map((item) => (
                    <ListCard key={item.id} title={String(item.moduleName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.priceAmount}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create module pricing" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createModulePricing(v))}>
                <CompanyHubSelect data={data} {...form.register("companyHubId")} />
                <input {...form.register("pricingKey")} placeholder="pricingKey" className={inputClass} />
                <input {...form.register("moduleName")} placeholder="moduleName" className={inputClass} />
                <input type="number" step="any" {...form.register("priceAmount", { valueAsNumber: true })} placeholder="priceAmount" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function DiscountRulesPanel({ data }: { data: RetailData }) {
    const form = useForm<discountRulesFormValues>({ resolver: zodResolver(discountRulesFormSchema), defaultValues: {"companyHubId":"","ruleKey":"","ruleName":"","discountPercent":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Discount Rules" description="Enterprise retail operating system discount rules" /><div className="mt-6 space-y-3">
                {data.discountRules.length === 0 ? <EmptyState title="No discount rules" description="Create the first discount rules record." /> : data.discountRules.map((item) => (
                    <ListCard key={item.id} title={String(item.ruleName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.discountPercent}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create discount rules" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDiscountRule(v))}>
                <CompanyHubSelect data={data} {...form.register("companyHubId")} />
                <input {...form.register("ruleKey")} placeholder="ruleKey" className={inputClass} />
                <input {...form.register("ruleName")} placeholder="ruleName" className={inputClass} />
                <input type="number" step="any" {...form.register("discountPercent", { valueAsNumber: true })} placeholder="discountPercent" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ProposalsPanel({ data }: { data: RetailData }) {
    const form = useForm<proposalsFormValues>({ resolver: zodResolver(proposalsFormSchema), defaultValues: {"companyHubId":"","proposalKey":"","proposalName":"","proposalStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Proposals" description="Enterprise retail operating system proposals" /><div className="mt-6 space-y-3">
                {data.proposals.length === 0 ? <EmptyState title="No proposals" description="Create the first proposals record." /> : data.proposals.map((item) => (
                    <ListCard key={item.id} title={String(item.proposalName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.proposalStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create proposals" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createProposal(v))}>
                <CompanyHubSelect data={data} {...form.register("companyHubId")} />
                <input {...form.register("proposalKey")} placeholder="proposalKey" className={inputClass} />
                <input {...form.register("proposalName")} placeholder="proposalName" className={inputClass} />
                <select {...form.register("proposalStatus")} className={inputClass}>{PROPOSAL_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ProposalDocumentsPanel({ data }: { data: RetailData }) {
    const form = useForm<proposalDocumentsFormValues>({ resolver: zodResolver(proposalDocumentsFormSchema), defaultValues: {"companyHubId":"","documentKey":"","documentName":"","documentType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Proposal Documents" description="Enterprise retail operating system proposal documents" /><div className="mt-6 space-y-3">
                {data.proposalDocuments.length === 0 ? <EmptyState title="No proposal documents" description="Create the first proposal documents record." /> : data.proposalDocuments.map((item) => (
                    <ListCard key={item.id} title={String(item.documentName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.documentType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create proposal documents" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createProposalDocument(v))}>
                <CompanyHubSelect data={data} {...form.register("companyHubId")} />
                <input {...form.register("documentKey")} placeholder="documentKey" className={inputClass} />
                <input {...form.register("documentName")} placeholder="documentName" className={inputClass} />
                <input {...form.register("documentType")} placeholder="documentType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ProposalContractsPanel({ data }: { data: RetailData }) {
    const form = useForm<proposalContractsFormValues>({ resolver: zodResolver(proposalContractsFormSchema), defaultValues: {"companyHubId":"","contractKey":"","contractName":"","contractStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Proposal Contracts" description="Enterprise retail operating system proposal contracts" /><div className="mt-6 space-y-3">
                {data.proposalContracts.length === 0 ? <EmptyState title="No proposal contracts" description="Create the first proposal contracts record." /> : data.proposalContracts.map((item) => (
                    <ListCard key={item.id} title={String(item.contractName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.contractStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create proposal contracts" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createProposalContract(v))}>
                <CompanyHubSelect data={data} {...form.register("companyHubId")} />
                <input {...form.register("contractKey")} placeholder="contractKey" className={inputClass} />
                <input {...form.register("contractName")} placeholder="contractName" className={inputClass} />
                <select {...form.register("contractStatus")} className={inputClass}>{CONTRACT_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ProposalHistorysPanel({ data }: { data: RetailData }) {
    const form = useForm<proposalHistoryFormValues>({ resolver: zodResolver(proposalHistoryFormSchema), defaultValues: {"companyHubId":"","historyKey":"","historyType":"","changedAt":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Proposal History" description="Enterprise retail operating system proposal history" /><div className="mt-6 space-y-3">
                {data.proposalHistory.length === 0 ? <EmptyState title="No proposal history" description="Create the first proposal history record." /> : data.proposalHistory.map((item) => (
                    <ListCard key={item.id} title={String(item.historyKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.historyType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create proposal history" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createProposalHistory(v))}>
                <CompanyHubSelect data={data} {...form.register("companyHubId")} />
                <input {...form.register("historyKey")} placeholder="historyKey" className={inputClass} />
                <input {...form.register("historyType")} placeholder="historyType" className={inputClass} />
                <input {...form.register("changedAt")} placeholder="changedAt" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function PortalDashboardsPanel({ data }: { data: RetailData }) {
    const form = useForm<portalDashboardsFormValues>({ resolver: zodResolver(portalDashboardsFormSchema), defaultValues: {"companyHubId":"","dashboardKey":"","dashboardName":"","dashboardType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Portal Dashboards" description="Enterprise retail operating system portal dashboards" /><div className="mt-6 space-y-3">
                {data.portalDashboards.length === 0 ? <EmptyState title="No portal dashboards" description="Create the first portal dashboards record." /> : data.portalDashboards.map((item) => (
                    <ListCard key={item.id} title={String(item.dashboardName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.dashboardType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create portal dashboards" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createPortalDashboard(v))}>
                <CompanyHubSelect data={data} {...form.register("companyHubId")} />
                <input {...form.register("dashboardKey")} placeholder="dashboardKey" className={inputClass} />
                <input {...form.register("dashboardName")} placeholder="dashboardName" className={inputClass} />
                <input {...form.register("dashboardType")} placeholder="dashboardType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function PortalSubscriptionsPanel({ data }: { data: RetailData }) {
    const form = useForm<portalSubscriptionsFormValues>({ resolver: zodResolver(portalSubscriptionsFormSchema), defaultValues: {"companyHubId":"","subscriptionKey":"","planName":"","subscriptionStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Portal Subscriptions" description="Enterprise retail operating system portal subscriptions" /><div className="mt-6 space-y-3">
                {data.portalSubscriptions.length === 0 ? <EmptyState title="No portal subscriptions" description="Create the first portal subscriptions record." /> : data.portalSubscriptions.map((item) => (
                    <ListCard key={item.id} title={String(item.planName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.subscriptionStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create portal subscriptions" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createPortalSubscription(v))}>
                <CompanyHubSelect data={data} {...form.register("companyHubId")} />
                <input {...form.register("subscriptionKey")} placeholder="subscriptionKey" className={inputClass} />
                <input {...form.register("planName")} placeholder="planName" className={inputClass} />
                <select {...form.register("subscriptionStatus")} className={inputClass}>{SUBSCRIPTION_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function PortalBillingsPanel({ data }: { data: RetailData }) {
    const form = useForm<portalBillingFormValues>({ resolver: zodResolver(portalBillingFormSchema), defaultValues: {"companyHubId":"","billingKey":"","billingType":"","billingAmount":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Portal Billing" description="Enterprise retail operating system portal billing" /><div className="mt-6 space-y-3">
                {data.portalBilling.length === 0 ? <EmptyState title="No portal billing" description="Create the first portal billing record." /> : data.portalBilling.map((item) => (
                    <ListCard key={item.id} title={String(item.billingKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.billingType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create portal billing" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createPortalBilling(v))}>
                <CompanyHubSelect data={data} {...form.register("companyHubId")} />
                <input {...form.register("billingKey")} placeholder="billingKey" className={inputClass} />
                <input {...form.register("billingType")} placeholder="billingType" className={inputClass} />
                <input type="number" step="any" {...form.register("billingAmount", { valueAsNumber: true })} placeholder="billingAmount" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function PortalSupportsPanel({ data }: { data: RetailData }) {
    const form = useForm<portalSupportFormValues>({ resolver: zodResolver(portalSupportFormSchema), defaultValues: {"companyHubId":"","supportKey":"","supportTitle":"","supportStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Portal Support" description="Enterprise retail operating system portal support" /><div className="mt-6 space-y-3">
                {data.portalSupport.length === 0 ? <EmptyState title="No portal support" description="Create the first portal support record." /> : data.portalSupport.map((item) => (
                    <ListCard key={item.id} title={String(item.supportTitle)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.supportStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create portal support" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createPortalSupport(v))}>
                <CompanyHubSelect data={data} {...form.register("companyHubId")} />
                <input {...form.register("supportKey")} placeholder="supportKey" className={inputClass} />
                <input {...form.register("supportTitle")} placeholder="supportTitle" className={inputClass} />
                <select {...form.register("supportStatus")} className={inputClass}>{SUPPORT_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function DocGuidesPanel({ data }: { data: RetailData }) {
    const form = useForm<docGuidesFormValues>({ resolver: zodResolver(docGuidesFormSchema), defaultValues: {"companyHubId":"","guideKey":"","guideTitle":"","guideCategory":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Doc Guides" description="Enterprise retail operating system doc guides" /><div className="mt-6 space-y-3">
                {data.docGuides.length === 0 ? <EmptyState title="No doc guides" description="Create the first doc guides record." /> : data.docGuides.map((item) => (
                    <ListCard key={item.id} title={String(item.guideTitle)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.guideCategory}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create doc guides" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDocGuide(v))}>
                <CompanyHubSelect data={data} {...form.register("companyHubId")} />
                <input {...form.register("guideKey")} placeholder="guideKey" className={inputClass} />
                <input {...form.register("guideTitle")} placeholder="guideTitle" className={inputClass} />
                <input {...form.register("guideCategory")} placeholder="guideCategory" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function DocApiReferencesPanel({ data }: { data: RetailData }) {
    const form = useForm<docApiReferencesFormValues>({ resolver: zodResolver(docApiReferencesFormSchema), defaultValues: {"companyHubId":"","referenceKey":"","referenceName":"","apiVersion":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Doc Api References" description="Enterprise retail operating system doc api references" /><div className="mt-6 space-y-3">
                {data.docApiReferences.length === 0 ? <EmptyState title="No doc api references" description="Create the first doc api references record." /> : data.docApiReferences.map((item) => (
                    <ListCard key={item.id} title={String(item.referenceName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.apiVersion}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create doc api references" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDocApiReference(v))}>
                <CompanyHubSelect data={data} {...form.register("companyHubId")} />
                <input {...form.register("referenceKey")} placeholder="referenceKey" className={inputClass} />
                <input {...form.register("referenceName")} placeholder="referenceName" className={inputClass} />
                <input {...form.register("apiVersion")} placeholder="apiVersion" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function DocVersionsPanel({ data }: { data: RetailData }) {
    const form = useForm<docVersionsFormValues>({ resolver: zodResolver(docVersionsFormSchema), defaultValues: {"companyHubId":"","versionKey":"","versionName":"","versionNumber":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Doc Versions" description="Enterprise retail operating system doc versions" /><div className="mt-6 space-y-3">
                {data.docVersions.length === 0 ? <EmptyState title="No doc versions" description="Create the first doc versions record." /> : data.docVersions.map((item) => (
                    <ListCard key={item.id} title={String(item.versionName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.versionNumber}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create doc versions" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDocVersion(v))}>
                <CompanyHubSelect data={data} {...form.register("companyHubId")} />
                <input {...form.register("versionKey")} placeholder="versionKey" className={inputClass} />
                <input {...form.register("versionName")} placeholder="versionName" className={inputClass} />
                <input {...form.register("versionNumber")} placeholder="versionNumber" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function DemoOrganizationsPanel({ data }: { data: RetailData }) {
    const form = useForm<demoOrganizationsFormValues>({ resolver: zodResolver(demoOrganizationsFormSchema), defaultValues: {"companyHubId":"","orgKey":"","orgName":"","orgType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Demo Organizations" description="Enterprise retail operating system demo organizations" /><div className="mt-6 space-y-3">
                {data.demoOrganizations.length === 0 ? <EmptyState title="No demo organizations" description="Create the first demo organizations record." /> : data.demoOrganizations.map((item) => (
                    <ListCard key={item.id} title={String(item.orgName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.orgType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create demo organizations" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDemoOrganization(v))}>
                <CompanyHubSelect data={data} {...form.register("companyHubId")} />
                <input {...form.register("orgKey")} placeholder="orgKey" className={inputClass} />
                <input {...form.register("orgName")} placeholder="orgName" className={inputClass} />
                <input {...form.register("orgType")} placeholder="orgType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function DemoDataSetsPanel({ data }: { data: RetailData }) {
    const form = useForm<demoDataSetsFormValues>({ resolver: zodResolver(demoDataSetsFormSchema), defaultValues: {"companyHubId":"","datasetKey":"","datasetName":"","recordCount":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Demo Data Sets" description="Enterprise retail operating system demo data sets" /><div className="mt-6 space-y-3">
                {data.demoDataSets.length === 0 ? <EmptyState title="No demo data sets" description="Create the first demo data sets record." /> : data.demoDataSets.map((item) => (
                    <ListCard key={item.id} title={String(item.datasetName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.recordCount}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create demo data sets" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDemoDataSet(v))}>
                <CompanyHubSelect data={data} {...form.register("companyHubId")} />
                <input {...form.register("datasetKey")} placeholder="datasetKey" className={inputClass} />
                <input {...form.register("datasetName")} placeholder="datasetName" className={inputClass} />
                <input type="number" step="any" {...form.register("recordCount", { valueAsNumber: true })} placeholder="recordCount" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function DemoUsersPanel({ data }: { data: RetailData }) {
    const form = useForm<demoUsersFormValues>({ resolver: zodResolver(demoUsersFormSchema), defaultValues: {"companyHubId":"","userKey":"","userName":"","userRole":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Demo Users" description="Enterprise retail operating system demo users" /><div className="mt-6 space-y-3">
                {data.demoUsers.length === 0 ? <EmptyState title="No demo users" description="Create the first demo users record." /> : data.demoUsers.map((item) => (
                    <ListCard key={item.id} title={String(item.userName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.userRole}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create demo users" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDemoUser(v))}>
                <CompanyHubSelect data={data} {...form.register("companyHubId")} />
                <input {...form.register("userKey")} placeholder="userKey" className={inputClass} />
                <input {...form.register("userName")} placeholder="userName" className={inputClass} />
                <input {...form.register("userRole")} placeholder="userRole" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function CompanyMetricsPanel({ data }: { data: RetailData }) {
    const form = useForm<companyMetricsFormValues>({ resolver: zodResolver(companyMetricsFormSchema), defaultValues: {"metricsKey":"","overallCompanyScore":0,"platformHealthScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Company Metrics" description="Enterprise retail operating system company metrics" /><div className="mt-6 space-y-3">
                {data.companyMetrics.length === 0 ? <EmptyState title="No company metrics" description="Create the first company metrics record." /> : data.companyMetrics.map((item) => (
                    <ListCard key={item.id} title={String(item.metricsKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.overallCompanyScore}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create company metrics" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createCompanyMetric(v))}>
                <input {...form.register("metricsKey")} placeholder="metricsKey" className={inputClass} />
                <input type="number" step="any" {...form.register("overallCompanyScore", { valueAsNumber: true })} placeholder="overallCompanyScore" className={inputClass} />
                <input type="number" step="any" {...form.register("platformHealthScore", { valueAsNumber: true })} placeholder="platformHealthScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function CompanyHealthsPanel({ data }: { data: RetailData }) {
    const form = useForm<companyHealthFormValues>({ resolver: zodResolver(companyHealthFormSchema), defaultValues: {"healthKey":"","overallScore":0,"disasterRecoveryMode":false} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Company Health" description="Enterprise retail operating system company health" /><div className="mt-6 space-y-3">
                {data.companyHealth.length === 0 ? <EmptyState title="No company health" description="Create the first company health record." /> : data.companyHealth.map((item) => (
                    <ListCard key={item.id} title={String(item.healthKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.overallScore}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create company health" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createCompanyHealth(v))}>
                <input {...form.register("healthKey")} placeholder="healthKey" className={inputClass} />
                <input type="number" step="any" {...form.register("overallScore", { valueAsNumber: true })} placeholder="overallScore" className={inputClass} />
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...form.register("disasterRecoveryMode")} /> disasterRecoveryMode</label>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ExecutiveKpisPanel({ data }: { data: RetailData }) {
    const form = useForm<executiveKpisFormValues>({ resolver: zodResolver(executiveKpisFormSchema), defaultValues: {"companyHubId":"","kpiKey":"","kpiName":"","kpiScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Executive Kpis" description="Enterprise retail operating system executive kpis" /><div className="mt-6 space-y-3">
                {data.executiveKpis.length === 0 ? <EmptyState title="No executive kpis" description="Create the first executive kpis record." /> : data.executiveKpis.map((item) => (
                    <ListCard key={item.id} title={String(item.kpiName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.kpiScore}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create executive kpis" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createExecutiveKpi(v))}>
                <CompanyHubSelect data={data} {...form.register("companyHubId")} />
                <input {...form.register("kpiKey")} placeholder="kpiKey" className={inputClass} />
                <input {...form.register("kpiName")} placeholder="kpiName" className={inputClass} />
                <input type="number" step="any" {...form.register("kpiScore", { valueAsNumber: true })} placeholder="kpiScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function CompanyFailuresPanel({ data }: { data: RetailData }) {
    const form = useForm<companyFailuresFormValues>({ resolver: zodResolver(companyFailuresFormSchema), defaultValues: {"companyHubId":"","failureKey":"","failureType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Company Failures" description="Enterprise retail operating system company failures" /><div className="mt-6 space-y-3">
                {data.companyFailures.length === 0 ? <EmptyState title="No company failures" description="Create the first company failures record." /> : data.companyFailures.map((item) => (
                    <ListCard key={item.id} title={String(item.failureKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.failureType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create company failures" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createCompanyFailure(v))}>
                <CompanyHubSelect data={data} {...form.register("companyHubId")} />
                <input {...form.register("failureKey")} placeholder="failureKey" className={inputClass} />
                <input {...form.register("failureType")} placeholder="failureType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function RetailAuditLogsPanel({ data }: { data: RetailData }) {
    return (
        <Card hover><SectionHeader title="Company Foundation audit history" description="Security-first audit trail for jobs, events, retailInvoices, and marketplace operations" /><div className="mt-6 space-y-3">
            {data.auditLogs.length === 0 ? <EmptyState title="No audit entries" description="Audit logs are created automatically for retail operating system." /> : data.auditLogs.map((entry) => (
                <ListCard key={entry.id} title={entry.summary} subtitle={`${entry.entityType} • ${entry.action}`} meta={`${entry.securityLevel} • ${new Date(entry.createdAt).toLocaleString()}`} />
            ))}
        </div></Card>
    );
}

export function RetailSdkPanel({ data }: { data: RetailData }) {
    return (
        <Card hover><SectionHeader title="Shared Company Foundation SDK" description="Import from @/src/modules/company-foundation/sdk for brand registration, menu configuration, and order workflow execution" /><div className="mt-6 space-y-4 text-sm text-emerald-600 dark:text-emerald-300">
            <ListCard title="createCompanyFoundationClient()" subtitle="Factory for module-scoped Company Foundation client with auth context" meta="Primary SDK for enterprise retail operating system" />
            <ListCard title="sdkConfigureBrandProfile()" subtitle="Register retail operating system with AI orchestration" meta="moduleSource: company_foundation" />
            <ListCard title="sdkPublishWebsitePage()" subtitle="Publish website page with knowledge context" meta="v1/v2/v3 API versions" />
            <ListCard title="sdkGenerateProposal()" subtitle="Generate proposal with audit trail" meta="Event-driven integration delivery" />
            <p className="text-xs text-emerald-500">Theme: {CMP_THEME.primary} • Integration hubs loaded: {data.companyHubs.length}</p>
            <pre className="overflow-x-auto rounded-2xl bg-emerald-950 p-4 text-xs text-emerald-100">{`import { createCompanyFoundationClient } from "@/src/modules/company-foundation/sdk";

const intg = createCompanyFoundationClient(userId, email, fullName);
await intg.registerCampus({ companyHubId, serviceKey: "svc-001", serviceName: "Stripe" });
await intg.publishWebsitePage({ companyHubId, keyName: "prod-key", apiVersion: "v1" });
await intg.generateProposal({ companyHubId, webhookKey: "wh-001", webhookName: "Events" });`}</pre>
        </div></Card>
    );
}
