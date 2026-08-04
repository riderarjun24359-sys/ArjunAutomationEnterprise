"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/src/components/ui/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { AAGE_THEME, PROFILE_STATUS_OPTIONS, MESSAGING_STATUS_OPTIONS, GUIDELINE_STATUS_OPTIONS, TEMPLATE_STATUS_OPTIONS, GENERATOR_STATUS_OPTIONS, ASSISTANT_STATUS_OPTIONS, CALENDAR_STATUS_OPTIONS, QUEUE_STATUS_OPTIONS, ALERT_SEVERITY_OPTIONS } from "@/src/modules/growth-engine/constants";
import type { useGrowthEngine } from "@/src/modules/growth-engine/hooks/useGrowthEngine";
import {
    growthHubsFormSchema,
    type growthHubsFormValues,
    brandProfilesFormSchema,
    type brandProfilesFormValues,
    brandVoiceFormSchema,
    type brandVoiceFormValues,
    coreMessagingFormSchema,
    type coreMessagingFormValues,
    brandGuidelinesFormSchema,
    type brandGuidelinesFormValues,
    logoLibraryFormSchema,
    type logoLibraryFormValues,
    colorSystemsFormSchema,
    type colorSystemsFormValues,
    youtubeTemplatesFormSchema,
    type youtubeTemplatesFormValues,
    socialTemplatesFormSchema,
    type socialTemplatesFormValues,
    blogTemplatesFormSchema,
    type blogTemplatesFormValues,
    websiteArticleTemplatesFormSchema,
    type websiteArticleTemplatesFormValues,
    emailCampaignTemplatesFormSchema,
    type emailCampaignTemplatesFormValues,
    caseStudyTemplatesFormSchema,
    type caseStudyTemplatesFormValues,
    imageAssetsFormSchema,
    type imageAssetsFormValues,
    videoAssetsFormSchema,
    type videoAssetsFormValues,
    iconAssetsFormSchema,
    type iconAssetsFormValues,
    voiceProfilesFormSchema,
    type voiceProfilesFormValues,
    musicAssetsFormSchema,
    type musicAssetsFormValues,
    thumbnailTemplatesFormSchema,
    type thumbnailTemplatesFormValues,
    ideaGeneratorsFormSchema,
    type ideaGeneratorsFormValues,
    scriptGeneratorsFormSchema,
    type scriptGeneratorsFormValues,
    captionGeneratorsFormSchema,
    type captionGeneratorsFormValues,
    blogGeneratorsFormSchema,
    type blogGeneratorsFormValues,
    seoAssistantsFormSchema,
    type seoAssistantsFormValues,
    ctaGeneratorsFormSchema,
    type ctaGeneratorsFormValues,
    growthMetricsFormSchema,
    type growthMetricsFormValues,
    growthHealthFormSchema,
    type growthHealthFormValues,
    contentCalendarFormSchema,
    type contentCalendarFormValues,
    draftQueueFormSchema,
    type draftQueueFormValues,
    approvalQueueFormSchema,
    type approvalQueueFormValues,
    publishingQueueFormSchema,
    type publishingQueueFormValues,
} from "@/src/modules/growth-engine/schemas";

type GrowthData = ReturnType<typeof useGrowthEngine>;
const inputClass = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-pink-500/20 focus:ring-4 dark:border-slate-800 dark:bg-pink-950";
function SaveButton({ loading, label = "Save changes" }: { loading?: boolean; label?: string }) {
    return <button type="submit" disabled={loading} className="rounded-full bg-pink-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-pink-500 disabled:opacity-60">{loading ? "Saving..." : label}</button>;
}
function ListCard({ title, subtitle, meta }: { title: string; subtitle: string; meta?: string }) {
    return <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800"><p className="font-medium">{title}</p><p className="text-sm text-pink-500">{subtitle}</p>{meta ? <p className="mt-1 text-xs text-pink-600">{meta}</p> : null}</div>;
}
function GrowthHubSelect({ data, ...props }: { data: GrowthData } & React.SelectHTMLAttributes<HTMLSelectElement>) {
    return <select {...props} className={inputClass}><option value="">Select retail operating system</option>{data.growthHubOptions.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>;
}

export function GrowthOverviewPanel({ data }: { data: GrowthData }) {
    const pipeline = data.pipeline;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="Growth Engine summary" description="Brand foundation, content templates, media assets, content engine generators, and founder dashboard" /><div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ListCard title="Growth Hubs" subtitle={`${data.stats?.totalGrowthHubs ?? 0} total`} meta={`${data.stats?.activeGrowthHubs ?? 0} active • ${data.stats?.brandProfileCount ?? 0} brand profiles`} />
                <ListCard title="Content Pipeline" subtitle={`${data.stats?.youtubeTemplateCount ?? 0} templates`} meta={`${data.stats?.imageAssetCount ?? 0} media assets • ${data.stats?.ideaGeneratorCount ?? 0} generators`} />
                <ListCard title="Health" subtitle={`${(data.stats?.overallGrowthScore ?? 0).toFixed(1)} overall growth score`} meta={`${data.stats?.publishingQueueCount ?? 0} in publishing queue`} />
                <ListCard title="Audit Trail" subtitle={`${data.stats?.auditCount ?? 0} audit entries`} meta="Internal Arjun Automation growth platform" />
            </div></Card>
            <Card hover><SectionHeader title="Growth engine pipeline" description={`${pipeline?.previousStage ?? "configured"} → ${pipeline?.currentStage ?? "active"} → ${pipeline?.nextStage ?? "degraded"}`} /><div className="mt-6 space-y-3">
                {pipeline?.stages?.length ? pipeline.stages.map((stage) => (
                    <ListCard key={stage.key} title={stage.label} subtitle={stage.key} meta={stage.label} />
                )) : <EmptyState title="No pipeline data" description="Growth engine pipeline stages will appear as hubs are configured." />}
            </div></Card>
        </div>
    );
}

export function GrowthHubsPanel({ data }: { data: GrowthData }) {
    const form = useForm<growthHubsFormValues>({ resolver: zodResolver(growthHubsFormSchema), defaultValues: {"hubKey":"","hubName":"","environment":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Growth Hubs" description="Enterprise retail operating system growth hubs" /><div className="mt-6 space-y-3">
                {data.growthHubs.length === 0 ? <EmptyState title="No growth hubs" description="Create the first growth hubs record." /> : data.growthHubs.map((item) => (
                    <ListCard key={item.id} title={String(item.hubName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.hubKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create growth hubs" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createGrowthHub(v))}>
                <input {...form.register("hubKey")} placeholder="hubKey" className={inputClass} />
                <input {...form.register("hubName")} placeholder="hubName" className={inputClass} />
                <input {...form.register("environment")} placeholder="environment" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function BrandProfilesPanel({ data }: { data: GrowthData }) {
    const form = useForm<brandProfilesFormValues>({ resolver: zodResolver(brandProfilesFormSchema), defaultValues: {"growthHubId":"","profileKey":"","profileName":"","profileStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Brand Profiles" description="Enterprise retail operating system brand profiles" /><div className="mt-6 space-y-3">
                {data.brandProfiles.length === 0 ? <EmptyState title="No brand profiles" description="Create the first brand profiles record." /> : data.brandProfiles.map((item) => (
                    <ListCard key={item.id} title={String(item.profileName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.profileStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create brand profiles" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createBrandProfile(v))}>
                <GrowthHubSelect data={data} {...form.register("growthHubId")} />
                <input {...form.register("profileKey")} placeholder="profileKey" className={inputClass} />
                <input {...form.register("profileName")} placeholder="profileName" className={inputClass} />
                <select {...form.register("profileStatus")} className={inputClass}>{PROFILE_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function BrandVoicesPanel({ data }: { data: GrowthData }) {
    const form = useForm<brandVoiceFormValues>({ resolver: zodResolver(brandVoiceFormSchema), defaultValues: {"growthHubId":"","voiceKey":"","voiceName":"","voiceTone":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Brand Voice" description="Enterprise retail operating system brand voice" /><div className="mt-6 space-y-3">
                {data.brandVoice.length === 0 ? <EmptyState title="No brand voice" description="Create the first brand voice record." /> : data.brandVoice.map((item) => (
                    <ListCard key={item.id} title={String(item.voiceName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.voiceTone}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create brand voice" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createBrandVoice(v))}>
                <GrowthHubSelect data={data} {...form.register("growthHubId")} />
                <input {...form.register("voiceKey")} placeholder="voiceKey" className={inputClass} />
                <input {...form.register("voiceName")} placeholder="voiceName" className={inputClass} />
                <input {...form.register("voiceTone")} placeholder="voiceTone" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function CoreMessagingsPanel({ data }: { data: GrowthData }) {
    const form = useForm<coreMessagingFormValues>({ resolver: zodResolver(coreMessagingFormSchema), defaultValues: {"growthHubId":"","messagingKey":"","messagingTitle":"","messagingStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Core Messaging" description="Enterprise retail operating system core messaging" /><div className="mt-6 space-y-3">
                {data.coreMessaging.length === 0 ? <EmptyState title="No core messaging" description="Create the first core messaging record." /> : data.coreMessaging.map((item) => (
                    <ListCard key={item.id} title={String(item.messagingTitle)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.messagingStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create core messaging" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createCoreMessaging(v))}>
                <GrowthHubSelect data={data} {...form.register("growthHubId")} />
                <input {...form.register("messagingKey")} placeholder="messagingKey" className={inputClass} />
                <input {...form.register("messagingTitle")} placeholder="messagingTitle" className={inputClass} />
                <select {...form.register("messagingStatus")} className={inputClass}>{MESSAGING_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function BrandGuidelinesPanel({ data }: { data: GrowthData }) {
    const form = useForm<brandGuidelinesFormValues>({ resolver: zodResolver(brandGuidelinesFormSchema), defaultValues: {"growthHubId":"","guidelineKey":"","guidelineName":"","guidelineStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Brand Guidelines" description="Enterprise retail operating system brand guidelines" /><div className="mt-6 space-y-3">
                {data.brandGuidelines.length === 0 ? <EmptyState title="No brand guidelines" description="Create the first brand guidelines record." /> : data.brandGuidelines.map((item) => (
                    <ListCard key={item.id} title={String(item.guidelineName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.guidelineStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create brand guidelines" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createBrandGuideline(v))}>
                <GrowthHubSelect data={data} {...form.register("growthHubId")} />
                <input {...form.register("guidelineKey")} placeholder="guidelineKey" className={inputClass} />
                <input {...form.register("guidelineName")} placeholder="guidelineName" className={inputClass} />
                <select {...form.register("guidelineStatus")} className={inputClass}>{GUIDELINE_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function LogoLibrarysPanel({ data }: { data: GrowthData }) {
    const form = useForm<logoLibraryFormValues>({ resolver: zodResolver(logoLibraryFormSchema), defaultValues: {"growthHubId":"","logoKey":"","logoName":"","logoFormat":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Logo Library" description="Enterprise retail operating system logo library" /><div className="mt-6 space-y-3">
                {data.logoLibrary.length === 0 ? <EmptyState title="No logo library" description="Create the first logo library record." /> : data.logoLibrary.map((item) => (
                    <ListCard key={item.id} title={String(item.logoName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.logoFormat}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create logo library" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createLogoLibrary(v))}>
                <GrowthHubSelect data={data} {...form.register("growthHubId")} />
                <input {...form.register("logoKey")} placeholder="logoKey" className={inputClass} />
                <input {...form.register("logoName")} placeholder="logoName" className={inputClass} />
                <input {...form.register("logoFormat")} placeholder="logoFormat" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ColorSystemsPanel({ data }: { data: GrowthData }) {
    const form = useForm<colorSystemsFormValues>({ resolver: zodResolver(colorSystemsFormSchema), defaultValues: {"growthHubId":"","colorKey":"","colorName":"","primaryHex":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Color Systems" description="Enterprise retail operating system color systems" /><div className="mt-6 space-y-3">
                {data.colorSystems.length === 0 ? <EmptyState title="No color systems" description="Create the first color systems record." /> : data.colorSystems.map((item) => (
                    <ListCard key={item.id} title={String(item.colorName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.primaryHex}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create color systems" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createColorSystem(v))}>
                <GrowthHubSelect data={data} {...form.register("growthHubId")} />
                <input {...form.register("colorKey")} placeholder="colorKey" className={inputClass} />
                <input {...form.register("colorName")} placeholder="colorName" className={inputClass} />
                <input {...form.register("primaryHex")} placeholder="primaryHex" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function YoutubeTemplatesPanel({ data }: { data: GrowthData }) {
    const form = useForm<youtubeTemplatesFormValues>({ resolver: zodResolver(youtubeTemplatesFormSchema), defaultValues: {"growthHubId":"","templateKey":"","templateName":"","templateStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Youtube Templates" description="Enterprise retail operating system youtube templates" /><div className="mt-6 space-y-3">
                {data.youtubeTemplates.length === 0 ? <EmptyState title="No youtube templates" description="Create the first youtube templates record." /> : data.youtubeTemplates.map((item) => (
                    <ListCard key={item.id} title={String(item.templateName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.templateStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create youtube templates" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createYoutubeTemplate(v))}>
                <GrowthHubSelect data={data} {...form.register("growthHubId")} />
                <input {...form.register("templateKey")} placeholder="templateKey" className={inputClass} />
                <input {...form.register("templateName")} placeholder="templateName" className={inputClass} />
                <select {...form.register("templateStatus")} className={inputClass}>{TEMPLATE_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function SocialTemplatesPanel({ data }: { data: GrowthData }) {
    const form = useForm<socialTemplatesFormValues>({ resolver: zodResolver(socialTemplatesFormSchema), defaultValues: {"growthHubId":"","templateKey":"","templateName":"","templateStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Social Templates" description="Enterprise retail operating system social templates" /><div className="mt-6 space-y-3">
                {data.socialTemplates.length === 0 ? <EmptyState title="No social templates" description="Create the first social templates record." /> : data.socialTemplates.map((item) => (
                    <ListCard key={item.id} title={String(item.templateName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.templateStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create social templates" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createSocialTemplate(v))}>
                <GrowthHubSelect data={data} {...form.register("growthHubId")} />
                <input {...form.register("templateKey")} placeholder="templateKey" className={inputClass} />
                <input {...form.register("templateName")} placeholder="templateName" className={inputClass} />
                <select {...form.register("templateStatus")} className={inputClass}>{TEMPLATE_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function BlogTemplatesPanel({ data }: { data: GrowthData }) {
    const form = useForm<blogTemplatesFormValues>({ resolver: zodResolver(blogTemplatesFormSchema), defaultValues: {"growthHubId":"","templateKey":"","templateName":"","templateStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Blog Templates" description="Enterprise retail operating system blog templates" /><div className="mt-6 space-y-3">
                {data.blogTemplates.length === 0 ? <EmptyState title="No blog templates" description="Create the first blog templates record." /> : data.blogTemplates.map((item) => (
                    <ListCard key={item.id} title={String(item.templateName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.templateStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create blog templates" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createBlogTemplate(v))}>
                <GrowthHubSelect data={data} {...form.register("growthHubId")} />
                <input {...form.register("templateKey")} placeholder="templateKey" className={inputClass} />
                <input {...form.register("templateName")} placeholder="templateName" className={inputClass} />
                <select {...form.register("templateStatus")} className={inputClass}>{TEMPLATE_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function WebsiteArticleTemplatesPanel({ data }: { data: GrowthData }) {
    const form = useForm<websiteArticleTemplatesFormValues>({ resolver: zodResolver(websiteArticleTemplatesFormSchema), defaultValues: {"growthHubId":"","templateKey":"","templateName":"","templateStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Website Article Templates" description="Enterprise retail operating system website article templates" /><div className="mt-6 space-y-3">
                {data.websiteArticleTemplates.length === 0 ? <EmptyState title="No website article templates" description="Create the first website article templates record." /> : data.websiteArticleTemplates.map((item) => (
                    <ListCard key={item.id} title={String(item.templateName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.templateStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create website article templates" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createWebsiteArticleTemplate(v))}>
                <GrowthHubSelect data={data} {...form.register("growthHubId")} />
                <input {...form.register("templateKey")} placeholder="templateKey" className={inputClass} />
                <input {...form.register("templateName")} placeholder="templateName" className={inputClass} />
                <select {...form.register("templateStatus")} className={inputClass}>{TEMPLATE_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function EmailCampaignTemplatesPanel({ data }: { data: GrowthData }) {
    const form = useForm<emailCampaignTemplatesFormValues>({ resolver: zodResolver(emailCampaignTemplatesFormSchema), defaultValues: {"growthHubId":"","templateKey":"","templateName":"","templateStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Email Campaign Templates" description="Enterprise retail operating system email campaign templates" /><div className="mt-6 space-y-3">
                {data.emailCampaignTemplates.length === 0 ? <EmptyState title="No email campaign templates" description="Create the first email campaign templates record." /> : data.emailCampaignTemplates.map((item) => (
                    <ListCard key={item.id} title={String(item.templateName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.templateStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create email campaign templates" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createEmailCampaignTemplate(v))}>
                <GrowthHubSelect data={data} {...form.register("growthHubId")} />
                <input {...form.register("templateKey")} placeholder="templateKey" className={inputClass} />
                <input {...form.register("templateName")} placeholder="templateName" className={inputClass} />
                <select {...form.register("templateStatus")} className={inputClass}>{TEMPLATE_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function CaseStudyTemplatesPanel({ data }: { data: GrowthData }) {
    const form = useForm<caseStudyTemplatesFormValues>({ resolver: zodResolver(caseStudyTemplatesFormSchema), defaultValues: {"growthHubId":"","templateKey":"","templateName":"","templateStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Case Study Templates" description="Enterprise retail operating system case study templates" /><div className="mt-6 space-y-3">
                {data.caseStudyTemplates.length === 0 ? <EmptyState title="No case study templates" description="Create the first case study templates record." /> : data.caseStudyTemplates.map((item) => (
                    <ListCard key={item.id} title={String(item.templateName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.templateStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create case study templates" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createCaseStudyTemplate(v))}>
                <GrowthHubSelect data={data} {...form.register("growthHubId")} />
                <input {...form.register("templateKey")} placeholder="templateKey" className={inputClass} />
                <input {...form.register("templateName")} placeholder="templateName" className={inputClass} />
                <select {...form.register("templateStatus")} className={inputClass}>{TEMPLATE_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ImageAssetsPanel({ data }: { data: GrowthData }) {
    const form = useForm<imageAssetsFormValues>({ resolver: zodResolver(imageAssetsFormSchema), defaultValues: {"growthHubId":"","assetKey":"","assetName":"","assetType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Image Assets" description="Enterprise retail operating system image assets" /><div className="mt-6 space-y-3">
                {data.imageAssets.length === 0 ? <EmptyState title="No image assets" description="Create the first image assets record." /> : data.imageAssets.map((item) => (
                    <ListCard key={item.id} title={String(item.assetName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.assetType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create image assets" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createImageAsset(v))}>
                <GrowthHubSelect data={data} {...form.register("growthHubId")} />
                <input {...form.register("assetKey")} placeholder="assetKey" className={inputClass} />
                <input {...form.register("assetName")} placeholder="assetName" className={inputClass} />
                <input {...form.register("assetType")} placeholder="assetType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function VideoAssetsPanel({ data }: { data: GrowthData }) {
    const form = useForm<videoAssetsFormValues>({ resolver: zodResolver(videoAssetsFormSchema), defaultValues: {"growthHubId":"","assetKey":"","assetName":"","assetType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Video Assets" description="Enterprise retail operating system video assets" /><div className="mt-6 space-y-3">
                {data.videoAssets.length === 0 ? <EmptyState title="No video assets" description="Create the first video assets record." /> : data.videoAssets.map((item) => (
                    <ListCard key={item.id} title={String(item.assetName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.assetType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create video assets" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createVideoAsset(v))}>
                <GrowthHubSelect data={data} {...form.register("growthHubId")} />
                <input {...form.register("assetKey")} placeholder="assetKey" className={inputClass} />
                <input {...form.register("assetName")} placeholder="assetName" className={inputClass} />
                <input {...form.register("assetType")} placeholder="assetType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function IconAssetsPanel({ data }: { data: GrowthData }) {
    const form = useForm<iconAssetsFormValues>({ resolver: zodResolver(iconAssetsFormSchema), defaultValues: {"growthHubId":"","assetKey":"","assetName":"","assetType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Icon Assets" description="Enterprise retail operating system icon assets" /><div className="mt-6 space-y-3">
                {data.iconAssets.length === 0 ? <EmptyState title="No icon assets" description="Create the first icon assets record." /> : data.iconAssets.map((item) => (
                    <ListCard key={item.id} title={String(item.assetName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.assetType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create icon assets" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createIconAsset(v))}>
                <GrowthHubSelect data={data} {...form.register("growthHubId")} />
                <input {...form.register("assetKey")} placeholder="assetKey" className={inputClass} />
                <input {...form.register("assetName")} placeholder="assetName" className={inputClass} />
                <input {...form.register("assetType")} placeholder="assetType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function VoiceProfilesPanel({ data }: { data: GrowthData }) {
    const form = useForm<voiceProfilesFormValues>({ resolver: zodResolver(voiceProfilesFormSchema), defaultValues: {"growthHubId":"","profileKey":"","profileName":"","voiceType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Voice Profiles" description="Enterprise retail operating system voice profiles" /><div className="mt-6 space-y-3">
                {data.voiceProfiles.length === 0 ? <EmptyState title="No voice profiles" description="Create the first voice profiles record." /> : data.voiceProfiles.map((item) => (
                    <ListCard key={item.id} title={String(item.profileName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.voiceType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create voice profiles" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createVoiceProfile(v))}>
                <GrowthHubSelect data={data} {...form.register("growthHubId")} />
                <input {...form.register("profileKey")} placeholder="profileKey" className={inputClass} />
                <input {...form.register("profileName")} placeholder="profileName" className={inputClass} />
                <input {...form.register("voiceType")} placeholder="voiceType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function MusicAssetsPanel({ data }: { data: GrowthData }) {
    const form = useForm<musicAssetsFormValues>({ resolver: zodResolver(musicAssetsFormSchema), defaultValues: {"growthHubId":"","assetKey":"","assetName":"","genre":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Music Assets" description="Enterprise retail operating system music assets" /><div className="mt-6 space-y-3">
                {data.musicAssets.length === 0 ? <EmptyState title="No music assets" description="Create the first music assets record." /> : data.musicAssets.map((item) => (
                    <ListCard key={item.id} title={String(item.assetName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.genre}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create music assets" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createMusicAsset(v))}>
                <GrowthHubSelect data={data} {...form.register("growthHubId")} />
                <input {...form.register("assetKey")} placeholder="assetKey" className={inputClass} />
                <input {...form.register("assetName")} placeholder="assetName" className={inputClass} />
                <input {...form.register("genre")} placeholder="genre" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ThumbnailTemplatesPanel({ data }: { data: GrowthData }) {
    const form = useForm<thumbnailTemplatesFormValues>({ resolver: zodResolver(thumbnailTemplatesFormSchema), defaultValues: {"growthHubId":"","templateKey":"","templateName":"","templateStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Thumbnail Templates" description="Enterprise retail operating system thumbnail templates" /><div className="mt-6 space-y-3">
                {data.thumbnailTemplates.length === 0 ? <EmptyState title="No thumbnail templates" description="Create the first thumbnail templates record." /> : data.thumbnailTemplates.map((item) => (
                    <ListCard key={item.id} title={String(item.templateName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.templateStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create thumbnail templates" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createThumbnailTemplate(v))}>
                <GrowthHubSelect data={data} {...form.register("growthHubId")} />
                <input {...form.register("templateKey")} placeholder="templateKey" className={inputClass} />
                <input {...form.register("templateName")} placeholder="templateName" className={inputClass} />
                <select {...form.register("templateStatus")} className={inputClass}>{TEMPLATE_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function IdeaGeneratorsPanel({ data }: { data: GrowthData }) {
    const form = useForm<ideaGeneratorsFormValues>({ resolver: zodResolver(ideaGeneratorsFormSchema), defaultValues: {"growthHubId":"","generatorKey":"","generatorName":"","generatorStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Idea Generators" description="Enterprise retail operating system idea generators" /><div className="mt-6 space-y-3">
                {data.ideaGenerators.length === 0 ? <EmptyState title="No idea generators" description="Create the first idea generators record." /> : data.ideaGenerators.map((item) => (
                    <ListCard key={item.id} title={String(item.generatorName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.generatorStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create idea generators" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createIdeaGenerator(v))}>
                <GrowthHubSelect data={data} {...form.register("growthHubId")} />
                <input {...form.register("generatorKey")} placeholder="generatorKey" className={inputClass} />
                <input {...form.register("generatorName")} placeholder="generatorName" className={inputClass} />
                <select {...form.register("generatorStatus")} className={inputClass}>{GENERATOR_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ScriptGeneratorsPanel({ data }: { data: GrowthData }) {
    const form = useForm<scriptGeneratorsFormValues>({ resolver: zodResolver(scriptGeneratorsFormSchema), defaultValues: {"growthHubId":"","generatorKey":"","generatorName":"","generatorStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Script Generators" description="Enterprise retail operating system script generators" /><div className="mt-6 space-y-3">
                {data.scriptGenerators.length === 0 ? <EmptyState title="No script generators" description="Create the first script generators record." /> : data.scriptGenerators.map((item) => (
                    <ListCard key={item.id} title={String(item.generatorName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.generatorStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create script generators" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createScriptGenerator(v))}>
                <GrowthHubSelect data={data} {...form.register("growthHubId")} />
                <input {...form.register("generatorKey")} placeholder="generatorKey" className={inputClass} />
                <input {...form.register("generatorName")} placeholder="generatorName" className={inputClass} />
                <select {...form.register("generatorStatus")} className={inputClass}>{GENERATOR_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function CaptionGeneratorsPanel({ data }: { data: GrowthData }) {
    const form = useForm<captionGeneratorsFormValues>({ resolver: zodResolver(captionGeneratorsFormSchema), defaultValues: {"growthHubId":"","generatorKey":"","generatorName":"","generatorStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Caption Generators" description="Enterprise retail operating system caption generators" /><div className="mt-6 space-y-3">
                {data.captionGenerators.length === 0 ? <EmptyState title="No caption generators" description="Create the first caption generators record." /> : data.captionGenerators.map((item) => (
                    <ListCard key={item.id} title={String(item.generatorName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.generatorStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create caption generators" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createCaptionGenerator(v))}>
                <GrowthHubSelect data={data} {...form.register("growthHubId")} />
                <input {...form.register("generatorKey")} placeholder="generatorKey" className={inputClass} />
                <input {...form.register("generatorName")} placeholder="generatorName" className={inputClass} />
                <select {...form.register("generatorStatus")} className={inputClass}>{GENERATOR_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function BlogGeneratorsPanel({ data }: { data: GrowthData }) {
    const form = useForm<blogGeneratorsFormValues>({ resolver: zodResolver(blogGeneratorsFormSchema), defaultValues: {"growthHubId":"","generatorKey":"","generatorName":"","generatorStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Blog Generators" description="Enterprise retail operating system blog generators" /><div className="mt-6 space-y-3">
                {data.blogGenerators.length === 0 ? <EmptyState title="No blog generators" description="Create the first blog generators record." /> : data.blogGenerators.map((item) => (
                    <ListCard key={item.id} title={String(item.generatorName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.generatorStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create blog generators" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createBlogGenerator(v))}>
                <GrowthHubSelect data={data} {...form.register("growthHubId")} />
                <input {...form.register("generatorKey")} placeholder="generatorKey" className={inputClass} />
                <input {...form.register("generatorName")} placeholder="generatorName" className={inputClass} />
                <select {...form.register("generatorStatus")} className={inputClass}>{GENERATOR_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function SeoAssistantsPanel({ data }: { data: GrowthData }) {
    const form = useForm<seoAssistantsFormValues>({ resolver: zodResolver(seoAssistantsFormSchema), defaultValues: {"growthHubId":"","assistantKey":"","assistantName":"","assistantStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Seo Assistants" description="Enterprise retail operating system seo assistants" /><div className="mt-6 space-y-3">
                {data.seoAssistants.length === 0 ? <EmptyState title="No seo assistants" description="Create the first seo assistants record." /> : data.seoAssistants.map((item) => (
                    <ListCard key={item.id} title={String(item.assistantName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.assistantStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create seo assistants" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createSeoAssistant(v))}>
                <GrowthHubSelect data={data} {...form.register("growthHubId")} />
                <input {...form.register("assistantKey")} placeholder="assistantKey" className={inputClass} />
                <input {...form.register("assistantName")} placeholder="assistantName" className={inputClass} />
                <select {...form.register("assistantStatus")} className={inputClass}>{ASSISTANT_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function CtaGeneratorsPanel({ data }: { data: GrowthData }) {
    const form = useForm<ctaGeneratorsFormValues>({ resolver: zodResolver(ctaGeneratorsFormSchema), defaultValues: {"growthHubId":"","generatorKey":"","generatorName":"","generatorStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Cta Generators" description="Enterprise retail operating system cta generators" /><div className="mt-6 space-y-3">
                {data.ctaGenerators.length === 0 ? <EmptyState title="No cta generators" description="Create the first cta generators record." /> : data.ctaGenerators.map((item) => (
                    <ListCard key={item.id} title={String(item.generatorName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.generatorStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create cta generators" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createCtaGenerator(v))}>
                <GrowthHubSelect data={data} {...form.register("growthHubId")} />
                <input {...form.register("generatorKey")} placeholder="generatorKey" className={inputClass} />
                <input {...form.register("generatorName")} placeholder="generatorName" className={inputClass} />
                <select {...form.register("generatorStatus")} className={inputClass}>{GENERATOR_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function GrowthMetricsPanel({ data }: { data: GrowthData }) {
    const form = useForm<growthMetricsFormValues>({ resolver: zodResolver(growthMetricsFormSchema), defaultValues: {"metricsKey":"","overallGrowthScore":0,"brandHealthScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Growth Metrics" description="Enterprise retail operating system growth metrics" /><div className="mt-6 space-y-3">
                {data.growthMetrics.length === 0 ? <EmptyState title="No growth metrics" description="Create the first growth metrics record." /> : data.growthMetrics.map((item) => (
                    <ListCard key={item.id} title={String(item.metricsKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.overallGrowthScore}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create growth metrics" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createGrowthMetric(v))}>
                <input {...form.register("metricsKey")} placeholder="metricsKey" className={inputClass} />
                <input type="number" step="any" {...form.register("overallGrowthScore", { valueAsNumber: true })} placeholder="overallGrowthScore" className={inputClass} />
                <input type="number" step="any" {...form.register("brandHealthScore", { valueAsNumber: true })} placeholder="brandHealthScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function GrowthHealthsPanel({ data }: { data: GrowthData }) {
    const form = useForm<growthHealthFormValues>({ resolver: zodResolver(growthHealthFormSchema), defaultValues: {"healthKey":"","overallScore":0,"brandStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Growth Health" description="Enterprise retail operating system growth health" /><div className="mt-6 space-y-3">
                {data.growthHealth.length === 0 ? <EmptyState title="No growth health" description="Create the first growth health record." /> : data.growthHealth.map((item) => (
                    <ListCard key={item.id} title={String(item.healthKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.overallScore}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create growth health" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createGrowthHealth(v))}>
                <input {...form.register("healthKey")} placeholder="healthKey" className={inputClass} />
                <input type="number" step="any" {...form.register("overallScore", { valueAsNumber: true })} placeholder="overallScore" className={inputClass} />
                <input {...form.register("brandStatus")} placeholder="brandStatus" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ContentCalendarsPanel({ data }: { data: GrowthData }) {
    const form = useForm<contentCalendarFormValues>({ resolver: zodResolver(contentCalendarFormSchema), defaultValues: {"growthHubId":"","calendarKey":"","calendarName":"","calendarStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Content Calendar" description="Enterprise retail operating system content calendar" /><div className="mt-6 space-y-3">
                {data.contentCalendar.length === 0 ? <EmptyState title="No content calendar" description="Create the first content calendar record." /> : data.contentCalendar.map((item) => (
                    <ListCard key={item.id} title={String(item.calendarName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.calendarStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create content calendar" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createContentCalendar(v))}>
                <GrowthHubSelect data={data} {...form.register("growthHubId")} />
                <input {...form.register("calendarKey")} placeholder="calendarKey" className={inputClass} />
                <input {...form.register("calendarName")} placeholder="calendarName" className={inputClass} />
                <select {...form.register("calendarStatus")} className={inputClass}>{CALENDAR_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function DraftQueuesPanel({ data }: { data: GrowthData }) {
    const form = useForm<draftQueueFormValues>({ resolver: zodResolver(draftQueueFormSchema), defaultValues: {"growthHubId":"","queueKey":"","queueTitle":"","queueStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Draft Queue" description="Enterprise retail operating system draft queue" /><div className="mt-6 space-y-3">
                {data.draftQueue.length === 0 ? <EmptyState title="No draft queue" description="Create the first draft queue record." /> : data.draftQueue.map((item) => (
                    <ListCard key={item.id} title={String(item.queueTitle)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.queueStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create draft queue" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDraftQueue(v))}>
                <GrowthHubSelect data={data} {...form.register("growthHubId")} />
                <input {...form.register("queueKey")} placeholder="queueKey" className={inputClass} />
                <input {...form.register("queueTitle")} placeholder="queueTitle" className={inputClass} />
                <select {...form.register("queueStatus")} className={inputClass}>{QUEUE_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ApprovalQueuesPanel({ data }: { data: GrowthData }) {
    const form = useForm<approvalQueueFormValues>({ resolver: zodResolver(approvalQueueFormSchema), defaultValues: {"growthHubId":"","queueKey":"","queueTitle":"","queueStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Approval Queue" description="Enterprise retail operating system approval queue" /><div className="mt-6 space-y-3">
                {data.approvalQueue.length === 0 ? <EmptyState title="No approval queue" description="Create the first approval queue record." /> : data.approvalQueue.map((item) => (
                    <ListCard key={item.id} title={String(item.queueTitle)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.queueStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create approval queue" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createApprovalQueue(v))}>
                <GrowthHubSelect data={data} {...form.register("growthHubId")} />
                <input {...form.register("queueKey")} placeholder="queueKey" className={inputClass} />
                <input {...form.register("queueTitle")} placeholder="queueTitle" className={inputClass} />
                <select {...form.register("queueStatus")} className={inputClass}>{QUEUE_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function PublishingQueuesPanel({ data }: { data: GrowthData }) {
    const form = useForm<publishingQueueFormValues>({ resolver: zodResolver(publishingQueueFormSchema), defaultValues: {"growthHubId":"","queueKey":"","queueTitle":"","queueStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Publishing Queue" description="Enterprise retail operating system publishing queue" /><div className="mt-6 space-y-3">
                {data.publishingQueue.length === 0 ? <EmptyState title="No publishing queue" description="Create the first publishing queue record." /> : data.publishingQueue.map((item) => (
                    <ListCard key={item.id} title={String(item.queueTitle)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.queueStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create publishing queue" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createPublishingQueue(v))}>
                <GrowthHubSelect data={data} {...form.register("growthHubId")} />
                <input {...form.register("queueKey")} placeholder="queueKey" className={inputClass} />
                <input {...form.register("queueTitle")} placeholder="queueTitle" className={inputClass} />
                <select {...form.register("queueStatus")} className={inputClass}>{QUEUE_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function GrowthAuditLogsPanel({ data }: { data: GrowthData }) {
    return (
        <Card hover><SectionHeader title="Growth Engine audit history" description="Security-first audit trail for jobs, events, captionGenerators, and marketplace operations" /><div className="mt-6 space-y-3">
            {data.auditLogs.length === 0 ? <EmptyState title="No audit entries" description="Audit logs are created automatically for retail operating system." /> : data.auditLogs.map((entry) => (
                <ListCard key={entry.id} title={entry.summary} subtitle={`${entry.entityType} • ${entry.action}`} meta={`${entry.securityLevel} • ${new Date(entry.createdAt).toLocaleString()}`} />
            ))}
        </div></Card>
    );
}

export function GrowthSdkPanel({ data }: { data: GrowthData }) {
    return (
        <Card hover><SectionHeader title="Shared Growth Engine SDK" description="Import from @/src/modules/growth-engine/sdk for brand registration, menu configuration, and order workflow execution" /><div className="mt-6 space-y-4 text-sm text-pink-600 dark:text-pink-300">
            <ListCard title="createGrowthEngineClient()" subtitle="Factory for module-scoped Growth Engine client with auth context" meta="Primary SDK for enterprise retail operating system" />
            <ListCard title="sdkRunBrandService()" subtitle="Register retail operating system with AI orchestration" meta="moduleSource: arjun_automation_growth_engine" />
            <ListCard title="sdkRunContentFoundationService()" subtitle="Run intelligence service with knowledge context" meta="v1/v2/v3 API versions" />
            <ListCard title="sdkRunMediaFoundationService()" subtitle="Run forecast service with audit trail" meta="Event-driven integration delivery" />
            <p className="text-xs text-pink-500">Theme: {AAGE_THEME.primary} • Integration hubs loaded: {data.growthHubs.length}</p>
            <pre className="overflow-x-auto rounded-2xl bg-pink-950 p-4 text-xs text-pink-100">{`import { createGrowthEngineClient } from "@/src/modules/growth-engine/sdk";

const intg = createGrowthEngineClient(userId, email, fullName);
await intg.registerCampus({ growthHubId, serviceKey: "svc-001", serviceName: "Stripe" });
await intg.runContentFoundationService({ growthHubId, keyName: "prod-key", apiVersion: "v1" });
await intg.runMediaFoundationService({ growthHubId, webhookKey: "wh-001", webhookName: "Events" });`}</pre>
        </div></Card>
    );
}
