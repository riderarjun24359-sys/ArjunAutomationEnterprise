"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/src/components/ui/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { AAGE_THEME, KNOWLEDGE_STATUS_OPTIONS, RULEBOOK_STATUS_OPTIONS, MESSAGE_STATUS_OPTIONS, SERVICE_STATUS_OPTIONS, INDUSTRY_STATUS_OPTIONS, FAQ_STATUS_OPTIONS, RULE_STATUS_OPTIONS, PROJECT_STATUS_OPTIONS, THUMBNAIL_STATUS_OPTIONS, VOICEOVER_STATUS_OPTIONS, GENERATOR_STATUS_OPTIONS, BUILDER_STATUS_OPTIONS, WORKFLOW_STATUS_OPTIONS, QUEUE_STATUS_OPTIONS, CHANNEL_STATUS_OPTIONS, APPROVAL_STATUS_OPTIONS, HISTORY_STATUS_OPTIONS, DASHBOARD_STATUS_OPTIONS, ATTRIBUTION_STATUS_OPTIONS, RECOMMENDATION_STATUS_OPTIONS, MISSION_STATUS_OPTIONS, SUMMARY_STATUS_OPTIONS } from "@/src/modules/growth-engine/constants";
import type { useGrowthEngine } from "@/src/modules/growth-engine/hooks/useGrowthEngine";
import {
    operationsHubsFormSchema,
    type operationsHubsFormValues,
    brandKnowledgeBaseFormSchema,
    type brandKnowledgeBaseFormValues,
    brandRulebookFormSchema,
    type brandRulebookFormValues,
    messagingLibraryFormSchema,
    type messagingLibraryFormValues,
    serviceLibraryFormSchema,
    type serviceLibraryFormValues,
    industryLibraryFormSchema,
    type industryLibraryFormValues,
    faqLibraryFormSchema,
    type faqLibraryFormValues,
    brandApprovalRulesFormSchema,
    type brandApprovalRulesFormValues,
    videoProjectsFormSchema,
    type videoProjectsFormValues,
    thumbnailManagerFormSchema,
    type thumbnailManagerFormValues,
    voiceoverManagerFormSchema,
    type voiceoverManagerFormValues,
    creativeAssetGeneratorFormSchema,
    type creativeAssetGeneratorFormValues,
    campaignAssetBuilderFormSchema,
    type campaignAssetBuilderFormValues,
    creativeWorkflowsFormSchema,
    type creativeWorkflowsFormValues,
    distributionContentQueueFormSchema,
    type distributionContentQueueFormValues,
    distributionPublishingQueueFormSchema,
    type distributionPublishingQueueFormValues,
    channelManagerFormSchema,
    type channelManagerFormValues,
    approvalCenterFormSchema,
    type approvalCenterFormValues,
    publishingHistoryFormSchema,
    type publishingHistoryFormValues,
    distributionAnalyticsFormSchema,
    type distributionAnalyticsFormValues,
    campaignDashboardFormSchema,
    type campaignDashboardFormValues,
    contentPerformanceFormSchema,
    type contentPerformanceFormValues,
    leadAttributionFormSchema,
    type leadAttributionFormValues,
    growthKpisFormSchema,
    type growthKpisFormValues,
    roiDashboardFormSchema,
    type roiDashboardFormValues,
    recommendationEngineFormSchema,
    type recommendationEngineFormValues,
    commandCenterMetricsFormSchema,
    type commandCenterMetricsFormValues,
    commandCenterHealthFormSchema,
    type commandCenterHealthFormValues,
    missionStatusFormSchema,
    type missionStatusFormValues,
    executiveSummariesFormSchema,
    type executiveSummariesFormValues,
    operationalFailuresFormSchema,
    type operationalFailuresFormValues,
} from "@/src/modules/growth-engine/schemas";

type GrowthData = ReturnType<typeof useGrowthEngine>;
const inputClass = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-pink-500/20 focus:ring-4 dark:border-slate-800 dark:bg-pink-950";
function SaveButton({ loading, label = "Save changes" }: { loading?: boolean; label?: string }) {
    return <button type="submit" disabled={loading} className="rounded-full bg-pink-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-pink-500 disabled:opacity-60">{loading ? "Saving..." : label}</button>;
}
function ListCard({ title, subtitle, meta }: { title: string; subtitle: string; meta?: string }) {
    return <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800"><p className="font-medium">{title}</p><p className="text-sm text-pink-500">{subtitle}</p>{meta ? <p className="mt-1 text-xs text-pink-600">{meta}</p> : null}</div>;
}
function OperationsHubSelect({ data, ...props }: { data: GrowthData } & React.SelectHTMLAttributes<HTMLSelectElement>) {
    return <select {...props} className={inputClass}><option value="">Select retail operating system</option>{data.operationsHubOptions.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>;
}

export function GrowthOverviewPanel({ data }: { data: GrowthData }) {
    const pipeline = data.pipeline;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="Operational Growth Engine summary" description="Brand OS, Creative Studio, Distribution Hub, Growth Intelligence, and Founder Command Center" /><div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ListCard title="Operations Hubs" subtitle={`${data.stats?.totalOperationsHubs ?? 0} total`} meta={`${data.stats?.activeOperationsHubs ?? 0} active • ${data.stats?.brandKnowledgeBaseCount ?? 0} knowledge entries`} />
                <ListCard title="Creative & Distribution" subtitle={`${data.stats?.videoProjectCount ?? 0} video projects`} meta={`${data.stats?.distributionContentQueueCount ?? 0} content queue • ${data.stats?.campaignDashboardCount ?? 0} dashboards`} />
                <ListCard title="Health" subtitle={`${(data.stats?.overallOperationsScore ?? 0).toFixed(1)} overall operations score`} meta={`${data.stats?.openOperationalFailureCount ?? 0} open failures`} />
                <ListCard title="Audit Trail" subtitle={`${data.stats?.auditCount ?? 0} audit entries`} meta="Security-first operational growth engine" />
            </div></Card>
            <Card hover><SectionHeader title="Operational pipeline" description={`${pipeline?.previousStage ?? "brand_os"} → ${pipeline?.currentStage ?? "creative_studio"} → ${pipeline?.nextStage ?? "distribution_hub"}`} /><div className="mt-6 space-y-3">
                {pipeline?.stages?.length ? pipeline.stages.map((stage) => (
                    <ListCard key={stage.key} title={stage.label} subtitle={stage.key} meta={stage.label} />
                )) : <EmptyState title="No pipeline data" description="Operational pipeline stages will appear as hubs are configured." />}
            </div></Card>
        </div>
    );
}

export function OperationsHubsPanel({ data }: { data: GrowthData }) {
    const form = useForm<operationsHubsFormValues>({ resolver: zodResolver(operationsHubsFormSchema), defaultValues: {"hubKey":"","hubName":"","environment":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Operations Hubs" description="Enterprise retail operating system operations hubs" /><div className="mt-6 space-y-3">
                {data.operationsHubs.length === 0 ? <EmptyState title="No operations hubs" description="Create the first operations hubs record." /> : data.operationsHubs.map((item) => (
                    <ListCard key={item.id} title={String(item.hubName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.hubKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create operations hubs" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createOperationsHub(v))}>
                <input {...form.register("hubKey")} placeholder="hubKey" className={inputClass} />
                <input {...form.register("hubName")} placeholder="hubName" className={inputClass} />
                <input {...form.register("environment")} placeholder="environment" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function BrandKnowledgeBasesPanel({ data }: { data: GrowthData }) {
    const form = useForm<brandKnowledgeBaseFormValues>({ resolver: zodResolver(brandKnowledgeBaseFormSchema), defaultValues: {"operationsHubId":"","knowledgeKey":"","knowledgeTitle":"","knowledgeStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Brand Knowledge Base" description="Enterprise retail operating system brand knowledge base" /><div className="mt-6 space-y-3">
                {data.brandKnowledgeBase.length === 0 ? <EmptyState title="No brand knowledge base" description="Create the first brand knowledge base record." /> : data.brandKnowledgeBase.map((item) => (
                    <ListCard key={item.id} title={String(item.knowledgeTitle)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.knowledgeStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create brand knowledge base" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createBrandKnowledgeBase(v))}>
                <OperationsHubSelect data={data} {...form.register("operationsHubId")} />
                <input {...form.register("knowledgeKey")} placeholder="knowledgeKey" className={inputClass} />
                <input {...form.register("knowledgeTitle")} placeholder="knowledgeTitle" className={inputClass} />
                <select {...form.register("knowledgeStatus")} className={inputClass}>{KNOWLEDGE_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function BrandRulebooksPanel({ data }: { data: GrowthData }) {
    const form = useForm<brandRulebookFormValues>({ resolver: zodResolver(brandRulebookFormSchema), defaultValues: {"operationsHubId":"","rulebookKey":"","rulebookName":"","rulebookStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Brand Rulebook" description="Enterprise retail operating system brand rulebook" /><div className="mt-6 space-y-3">
                {data.brandRulebook.length === 0 ? <EmptyState title="No brand rulebook" description="Create the first brand rulebook record." /> : data.brandRulebook.map((item) => (
                    <ListCard key={item.id} title={String(item.rulebookName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.rulebookStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create brand rulebook" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createBrandRulebook(v))}>
                <OperationsHubSelect data={data} {...form.register("operationsHubId")} />
                <input {...form.register("rulebookKey")} placeholder="rulebookKey" className={inputClass} />
                <input {...form.register("rulebookName")} placeholder="rulebookName" className={inputClass} />
                <select {...form.register("rulebookStatus")} className={inputClass}>{RULEBOOK_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function MessagingLibrarysPanel({ data }: { data: GrowthData }) {
    const form = useForm<messagingLibraryFormValues>({ resolver: zodResolver(messagingLibraryFormSchema), defaultValues: {"operationsHubId":"","messageKey":"","messageTitle":"","messageStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Messaging Library" description="Enterprise retail operating system messaging library" /><div className="mt-6 space-y-3">
                {data.messagingLibrary.length === 0 ? <EmptyState title="No messaging library" description="Create the first messaging library record." /> : data.messagingLibrary.map((item) => (
                    <ListCard key={item.id} title={String(item.messageTitle)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.messageStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create messaging library" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createMessagingLibrary(v))}>
                <OperationsHubSelect data={data} {...form.register("operationsHubId")} />
                <input {...form.register("messageKey")} placeholder="messageKey" className={inputClass} />
                <input {...form.register("messageTitle")} placeholder="messageTitle" className={inputClass} />
                <select {...form.register("messageStatus")} className={inputClass}>{MESSAGE_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ServiceLibrarysPanel({ data }: { data: GrowthData }) {
    const form = useForm<serviceLibraryFormValues>({ resolver: zodResolver(serviceLibraryFormSchema), defaultValues: {"operationsHubId":"","serviceKey":"","serviceName":"","serviceStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Service Library" description="Enterprise retail operating system service library" /><div className="mt-6 space-y-3">
                {data.serviceLibrary.length === 0 ? <EmptyState title="No service library" description="Create the first service library record." /> : data.serviceLibrary.map((item) => (
                    <ListCard key={item.id} title={String(item.serviceName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.serviceStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create service library" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createServiceLibrary(v))}>
                <OperationsHubSelect data={data} {...form.register("operationsHubId")} />
                <input {...form.register("serviceKey")} placeholder="serviceKey" className={inputClass} />
                <input {...form.register("serviceName")} placeholder="serviceName" className={inputClass} />
                <select {...form.register("serviceStatus")} className={inputClass}>{SERVICE_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function IndustryLibrarysPanel({ data }: { data: GrowthData }) {
    const form = useForm<industryLibraryFormValues>({ resolver: zodResolver(industryLibraryFormSchema), defaultValues: {"operationsHubId":"","industryKey":"","industryName":"","industryStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Industry Library" description="Enterprise retail operating system industry library" /><div className="mt-6 space-y-3">
                {data.industryLibrary.length === 0 ? <EmptyState title="No industry library" description="Create the first industry library record." /> : data.industryLibrary.map((item) => (
                    <ListCard key={item.id} title={String(item.industryName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.industryStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create industry library" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createIndustryLibrary(v))}>
                <OperationsHubSelect data={data} {...form.register("operationsHubId")} />
                <input {...form.register("industryKey")} placeholder="industryKey" className={inputClass} />
                <input {...form.register("industryName")} placeholder="industryName" className={inputClass} />
                <select {...form.register("industryStatus")} className={inputClass}>{INDUSTRY_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function FaqLibrarysPanel({ data }: { data: GrowthData }) {
    const form = useForm<faqLibraryFormValues>({ resolver: zodResolver(faqLibraryFormSchema), defaultValues: {"operationsHubId":"","faqKey":"","faqQuestion":"","faqStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Faq Library" description="Enterprise retail operating system faq library" /><div className="mt-6 space-y-3">
                {data.faqLibrary.length === 0 ? <EmptyState title="No faq library" description="Create the first faq library record." /> : data.faqLibrary.map((item) => (
                    <ListCard key={item.id} title={String(item.faqQuestion)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.faqStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create faq library" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createFaqLibrary(v))}>
                <OperationsHubSelect data={data} {...form.register("operationsHubId")} />
                <input {...form.register("faqKey")} placeholder="faqKey" className={inputClass} />
                <input {...form.register("faqQuestion")} placeholder="faqQuestion" className={inputClass} />
                <select {...form.register("faqStatus")} className={inputClass}>{FAQ_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function BrandApprovalRulesPanel({ data }: { data: GrowthData }) {
    const form = useForm<brandApprovalRulesFormValues>({ resolver: zodResolver(brandApprovalRulesFormSchema), defaultValues: {"operationsHubId":"","ruleKey":"","ruleName":"","ruleStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Brand Approval Rules" description="Enterprise retail operating system brand approval rules" /><div className="mt-6 space-y-3">
                {data.brandApprovalRules.length === 0 ? <EmptyState title="No brand approval rules" description="Create the first brand approval rules record." /> : data.brandApprovalRules.map((item) => (
                    <ListCard key={item.id} title={String(item.ruleName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.ruleStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create brand approval rules" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createBrandApprovalRule(v))}>
                <OperationsHubSelect data={data} {...form.register("operationsHubId")} />
                <input {...form.register("ruleKey")} placeholder="ruleKey" className={inputClass} />
                <input {...form.register("ruleName")} placeholder="ruleName" className={inputClass} />
                <select {...form.register("ruleStatus")} className={inputClass}>{RULE_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function VideoProjectsPanel({ data }: { data: GrowthData }) {
    const form = useForm<videoProjectsFormValues>({ resolver: zodResolver(videoProjectsFormSchema), defaultValues: {"operationsHubId":"","projectKey":"","projectName":"","projectStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Video Projects" description="Enterprise retail operating system video projects" /><div className="mt-6 space-y-3">
                {data.videoProjects.length === 0 ? <EmptyState title="No video projects" description="Create the first video projects record." /> : data.videoProjects.map((item) => (
                    <ListCard key={item.id} title={String(item.projectName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.projectStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create video projects" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createVideoProject(v))}>
                <OperationsHubSelect data={data} {...form.register("operationsHubId")} />
                <input {...form.register("projectKey")} placeholder="projectKey" className={inputClass} />
                <input {...form.register("projectName")} placeholder="projectName" className={inputClass} />
                <select {...form.register("projectStatus")} className={inputClass}>{PROJECT_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ThumbnailManagersPanel({ data }: { data: GrowthData }) {
    const form = useForm<thumbnailManagerFormValues>({ resolver: zodResolver(thumbnailManagerFormSchema), defaultValues: {"operationsHubId":"","thumbnailKey":"","thumbnailName":"","thumbnailStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Thumbnail Manager" description="Enterprise retail operating system thumbnail manager" /><div className="mt-6 space-y-3">
                {data.thumbnailManager.length === 0 ? <EmptyState title="No thumbnail manager" description="Create the first thumbnail manager record." /> : data.thumbnailManager.map((item) => (
                    <ListCard key={item.id} title={String(item.thumbnailName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.thumbnailStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create thumbnail manager" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createThumbnailManager(v))}>
                <OperationsHubSelect data={data} {...form.register("operationsHubId")} />
                <input {...form.register("thumbnailKey")} placeholder="thumbnailKey" className={inputClass} />
                <input {...form.register("thumbnailName")} placeholder="thumbnailName" className={inputClass} />
                <select {...form.register("thumbnailStatus")} className={inputClass}>{THUMBNAIL_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function VoiceoverManagersPanel({ data }: { data: GrowthData }) {
    const form = useForm<voiceoverManagerFormValues>({ resolver: zodResolver(voiceoverManagerFormSchema), defaultValues: {"operationsHubId":"","voiceoverKey":"","voiceoverName":"","voiceoverStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Voiceover Manager" description="Enterprise retail operating system voiceover manager" /><div className="mt-6 space-y-3">
                {data.voiceoverManager.length === 0 ? <EmptyState title="No voiceover manager" description="Create the first voiceover manager record." /> : data.voiceoverManager.map((item) => (
                    <ListCard key={item.id} title={String(item.voiceoverName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.voiceoverStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create voiceover manager" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createVoiceoverManager(v))}>
                <OperationsHubSelect data={data} {...form.register("operationsHubId")} />
                <input {...form.register("voiceoverKey")} placeholder="voiceoverKey" className={inputClass} />
                <input {...form.register("voiceoverName")} placeholder="voiceoverName" className={inputClass} />
                <select {...form.register("voiceoverStatus")} className={inputClass}>{VOICEOVER_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function CreativeAssetGeneratorsPanel({ data }: { data: GrowthData }) {
    const form = useForm<creativeAssetGeneratorFormValues>({ resolver: zodResolver(creativeAssetGeneratorFormSchema), defaultValues: {"operationsHubId":"","generatorKey":"","generatorName":"","generatorStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Creative Asset Generator" description="Enterprise retail operating system creative asset generator" /><div className="mt-6 space-y-3">
                {data.creativeAssetGenerator.length === 0 ? <EmptyState title="No creative asset generator" description="Create the first creative asset generator record." /> : data.creativeAssetGenerator.map((item) => (
                    <ListCard key={item.id} title={String(item.generatorName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.generatorStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create creative asset generator" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createCreativeAssetGenerator(v))}>
                <OperationsHubSelect data={data} {...form.register("operationsHubId")} />
                <input {...form.register("generatorKey")} placeholder="generatorKey" className={inputClass} />
                <input {...form.register("generatorName")} placeholder="generatorName" className={inputClass} />
                <select {...form.register("generatorStatus")} className={inputClass}>{GENERATOR_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function CampaignAssetBuildersPanel({ data }: { data: GrowthData }) {
    const form = useForm<campaignAssetBuilderFormValues>({ resolver: zodResolver(campaignAssetBuilderFormSchema), defaultValues: {"operationsHubId":"","builderKey":"","builderName":"","builderStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Campaign Asset Builder" description="Enterprise retail operating system campaign asset builder" /><div className="mt-6 space-y-3">
                {data.campaignAssetBuilder.length === 0 ? <EmptyState title="No campaign asset builder" description="Create the first campaign asset builder record." /> : data.campaignAssetBuilder.map((item) => (
                    <ListCard key={item.id} title={String(item.builderName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.builderStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create campaign asset builder" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createCampaignAssetBuilder(v))}>
                <OperationsHubSelect data={data} {...form.register("operationsHubId")} />
                <input {...form.register("builderKey")} placeholder="builderKey" className={inputClass} />
                <input {...form.register("builderName")} placeholder="builderName" className={inputClass} />
                <select {...form.register("builderStatus")} className={inputClass}>{BUILDER_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function CreativeWorkflowsPanel({ data }: { data: GrowthData }) {
    const form = useForm<creativeWorkflowsFormValues>({ resolver: zodResolver(creativeWorkflowsFormSchema), defaultValues: {"operationsHubId":"","workflowKey":"","workflowName":"","workflowStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Creative Workflows" description="Enterprise retail operating system creative workflows" /><div className="mt-6 space-y-3">
                {data.creativeWorkflows.length === 0 ? <EmptyState title="No creative workflows" description="Create the first creative workflows record." /> : data.creativeWorkflows.map((item) => (
                    <ListCard key={item.id} title={String(item.workflowName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.workflowStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create creative workflows" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createCreativeWorkflow(v))}>
                <OperationsHubSelect data={data} {...form.register("operationsHubId")} />
                <input {...form.register("workflowKey")} placeholder="workflowKey" className={inputClass} />
                <input {...form.register("workflowName")} placeholder="workflowName" className={inputClass} />
                <select {...form.register("workflowStatus")} className={inputClass}>{WORKFLOW_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function DistributionContentQueuesPanel({ data }: { data: GrowthData }) {
    const form = useForm<distributionContentQueueFormValues>({ resolver: zodResolver(distributionContentQueueFormSchema), defaultValues: {"operationsHubId":"","queueKey":"","queueTitle":"","queueStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Distribution Content Queue" description="Enterprise retail operating system distribution content queue" /><div className="mt-6 space-y-3">
                {data.distributionContentQueue.length === 0 ? <EmptyState title="No distribution content queue" description="Create the first distribution content queue record." /> : data.distributionContentQueue.map((item) => (
                    <ListCard key={item.id} title={String(item.queueTitle)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.queueStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create distribution content queue" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDistributionContentQueue(v))}>
                <OperationsHubSelect data={data} {...form.register("operationsHubId")} />
                <input {...form.register("queueKey")} placeholder="queueKey" className={inputClass} />
                <input {...form.register("queueTitle")} placeholder="queueTitle" className={inputClass} />
                <select {...form.register("queueStatus")} className={inputClass}>{QUEUE_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function DistributionPublishingQueuesPanel({ data }: { data: GrowthData }) {
    const form = useForm<distributionPublishingQueueFormValues>({ resolver: zodResolver(distributionPublishingQueueFormSchema), defaultValues: {"operationsHubId":"","queueKey":"","queueTitle":"","queueStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Distribution Publishing Queue" description="Enterprise retail operating system distribution publishing queue" /><div className="mt-6 space-y-3">
                {data.distributionPublishingQueue.length === 0 ? <EmptyState title="No distribution publishing queue" description="Create the first distribution publishing queue record." /> : data.distributionPublishingQueue.map((item) => (
                    <ListCard key={item.id} title={String(item.queueTitle)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.queueStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create distribution publishing queue" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDistributionPublishingQueue(v))}>
                <OperationsHubSelect data={data} {...form.register("operationsHubId")} />
                <input {...form.register("queueKey")} placeholder="queueKey" className={inputClass} />
                <input {...form.register("queueTitle")} placeholder="queueTitle" className={inputClass} />
                <select {...form.register("queueStatus")} className={inputClass}>{QUEUE_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ChannelManagersPanel({ data }: { data: GrowthData }) {
    const form = useForm<channelManagerFormValues>({ resolver: zodResolver(channelManagerFormSchema), defaultValues: {"operationsHubId":"","channelKey":"","channelName":"","channelStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Channel Manager" description="Enterprise retail operating system channel manager" /><div className="mt-6 space-y-3">
                {data.channelManager.length === 0 ? <EmptyState title="No channel manager" description="Create the first channel manager record." /> : data.channelManager.map((item) => (
                    <ListCard key={item.id} title={String(item.channelName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.channelStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create channel manager" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createChannelManager(v))}>
                <OperationsHubSelect data={data} {...form.register("operationsHubId")} />
                <input {...form.register("channelKey")} placeholder="channelKey" className={inputClass} />
                <input {...form.register("channelName")} placeholder="channelName" className={inputClass} />
                <select {...form.register("channelStatus")} className={inputClass}>{CHANNEL_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ApprovalCentersPanel({ data }: { data: GrowthData }) {
    const form = useForm<approvalCenterFormValues>({ resolver: zodResolver(approvalCenterFormSchema), defaultValues: {"operationsHubId":"","approvalKey":"","approvalTitle":"","approvalStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Approval Center" description="Enterprise retail operating system approval center" /><div className="mt-6 space-y-3">
                {data.approvalCenter.length === 0 ? <EmptyState title="No approval center" description="Create the first approval center record." /> : data.approvalCenter.map((item) => (
                    <ListCard key={item.id} title={String(item.approvalTitle)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.approvalStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create approval center" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createApprovalCenter(v))}>
                <OperationsHubSelect data={data} {...form.register("operationsHubId")} />
                <input {...form.register("approvalKey")} placeholder="approvalKey" className={inputClass} />
                <input {...form.register("approvalTitle")} placeholder="approvalTitle" className={inputClass} />
                <select {...form.register("approvalStatus")} className={inputClass}>{APPROVAL_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function PublishingHistorysPanel({ data }: { data: GrowthData }) {
    const form = useForm<publishingHistoryFormValues>({ resolver: zodResolver(publishingHistoryFormSchema), defaultValues: {"operationsHubId":"","historyKey":"","historyTitle":"","historyStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Publishing History" description="Enterprise retail operating system publishing history" /><div className="mt-6 space-y-3">
                {data.publishingHistory.length === 0 ? <EmptyState title="No publishing history" description="Create the first publishing history record." /> : data.publishingHistory.map((item) => (
                    <ListCard key={item.id} title={String(item.historyTitle)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.historyStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create publishing history" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createPublishingHistory(v))}>
                <OperationsHubSelect data={data} {...form.register("operationsHubId")} />
                <input {...form.register("historyKey")} placeholder="historyKey" className={inputClass} />
                <input {...form.register("historyTitle")} placeholder="historyTitle" className={inputClass} />
                <select {...form.register("historyStatus")} className={inputClass}>{HISTORY_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function DistributionAnalyticssPanel({ data }: { data: GrowthData }) {
    const form = useForm<distributionAnalyticsFormValues>({ resolver: zodResolver(distributionAnalyticsFormSchema), defaultValues: {"operationsHubId":"","analyticsKey":"","analyticsName":"","analyticsScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Distribution Analytics" description="Enterprise retail operating system distribution analytics" /><div className="mt-6 space-y-3">
                {data.distributionAnalytics.length === 0 ? <EmptyState title="No distribution analytics" description="Create the first distribution analytics record." /> : data.distributionAnalytics.map((item) => (
                    <ListCard key={item.id} title={String(item.analyticsName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.analyticsScore}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create distribution analytics" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDistributionAnalytics(v))}>
                <OperationsHubSelect data={data} {...form.register("operationsHubId")} />
                <input {...form.register("analyticsKey")} placeholder="analyticsKey" className={inputClass} />
                <input {...form.register("analyticsName")} placeholder="analyticsName" className={inputClass} />
                <input type="number" step="any" {...form.register("analyticsScore", { valueAsNumber: true })} placeholder="analyticsScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function CampaignDashboardsPanel({ data }: { data: GrowthData }) {
    const form = useForm<campaignDashboardFormValues>({ resolver: zodResolver(campaignDashboardFormSchema), defaultValues: {"operationsHubId":"","dashboardKey":"","dashboardName":"","dashboardStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Campaign Dashboard" description="Enterprise retail operating system campaign dashboard" /><div className="mt-6 space-y-3">
                {data.campaignDashboard.length === 0 ? <EmptyState title="No campaign dashboard" description="Create the first campaign dashboard record." /> : data.campaignDashboard.map((item) => (
                    <ListCard key={item.id} title={String(item.dashboardName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.dashboardStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create campaign dashboard" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createCampaignDashboard(v))}>
                <OperationsHubSelect data={data} {...form.register("operationsHubId")} />
                <input {...form.register("dashboardKey")} placeholder="dashboardKey" className={inputClass} />
                <input {...form.register("dashboardName")} placeholder="dashboardName" className={inputClass} />
                <select {...form.register("dashboardStatus")} className={inputClass}>{DASHBOARD_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ContentPerformancesPanel({ data }: { data: GrowthData }) {
    const form = useForm<contentPerformanceFormValues>({ resolver: zodResolver(contentPerformanceFormSchema), defaultValues: {"operationsHubId":"","performanceKey":"","performanceTitle":"","performanceScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Content Performance" description="Enterprise retail operating system content performance" /><div className="mt-6 space-y-3">
                {data.contentPerformance.length === 0 ? <EmptyState title="No content performance" description="Create the first content performance record." /> : data.contentPerformance.map((item) => (
                    <ListCard key={item.id} title={String(item.performanceTitle)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.performanceScore}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create content performance" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createContentPerformance(v))}>
                <OperationsHubSelect data={data} {...form.register("operationsHubId")} />
                <input {...form.register("performanceKey")} placeholder="performanceKey" className={inputClass} />
                <input {...form.register("performanceTitle")} placeholder="performanceTitle" className={inputClass} />
                <input type="number" step="any" {...form.register("performanceScore", { valueAsNumber: true })} placeholder="performanceScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function LeadAttributionsPanel({ data }: { data: GrowthData }) {
    const form = useForm<leadAttributionFormValues>({ resolver: zodResolver(leadAttributionFormSchema), defaultValues: {"operationsHubId":"","attributionKey":"","attributionTitle":"","attributionStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Lead Attribution" description="Enterprise retail operating system lead attribution" /><div className="mt-6 space-y-3">
                {data.leadAttribution.length === 0 ? <EmptyState title="No lead attribution" description="Create the first lead attribution record." /> : data.leadAttribution.map((item) => (
                    <ListCard key={item.id} title={String(item.attributionTitle)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.attributionStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create lead attribution" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createLeadAttribution(v))}>
                <OperationsHubSelect data={data} {...form.register("operationsHubId")} />
                <input {...form.register("attributionKey")} placeholder="attributionKey" className={inputClass} />
                <input {...form.register("attributionTitle")} placeholder="attributionTitle" className={inputClass} />
                <select {...form.register("attributionStatus")} className={inputClass}>{ATTRIBUTION_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function GrowthKpisPanel({ data }: { data: GrowthData }) {
    const form = useForm<growthKpisFormValues>({ resolver: zodResolver(growthKpisFormSchema), defaultValues: {"operationsHubId":"","kpiKey":"","kpiName":"","kpiValue":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Growth Kpis" description="Enterprise retail operating system growth kpis" /><div className="mt-6 space-y-3">
                {data.growthKpis.length === 0 ? <EmptyState title="No growth kpis" description="Create the first growth kpis record." /> : data.growthKpis.map((item) => (
                    <ListCard key={item.id} title={String(item.kpiName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.kpiValue}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create growth kpis" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createGrowthKpi(v))}>
                <OperationsHubSelect data={data} {...form.register("operationsHubId")} />
                <input {...form.register("kpiKey")} placeholder="kpiKey" className={inputClass} />
                <input {...form.register("kpiName")} placeholder="kpiName" className={inputClass} />
                <input type="number" step="any" {...form.register("kpiValue", { valueAsNumber: true })} placeholder="kpiValue" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function RoiDashboardsPanel({ data }: { data: GrowthData }) {
    const form = useForm<roiDashboardFormValues>({ resolver: zodResolver(roiDashboardFormSchema), defaultValues: {"operationsHubId":"","roiKey":"","roiName":"","roiScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Roi Dashboard" description="Enterprise retail operating system roi dashboard" /><div className="mt-6 space-y-3">
                {data.roiDashboard.length === 0 ? <EmptyState title="No roi dashboard" description="Create the first roi dashboard record." /> : data.roiDashboard.map((item) => (
                    <ListCard key={item.id} title={String(item.roiName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.roiScore}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create roi dashboard" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRoiDashboard(v))}>
                <OperationsHubSelect data={data} {...form.register("operationsHubId")} />
                <input {...form.register("roiKey")} placeholder="roiKey" className={inputClass} />
                <input {...form.register("roiName")} placeholder="roiName" className={inputClass} />
                <input type="number" step="any" {...form.register("roiScore", { valueAsNumber: true })} placeholder="roiScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function RecommendationEnginesPanel({ data }: { data: GrowthData }) {
    const form = useForm<recommendationEngineFormValues>({ resolver: zodResolver(recommendationEngineFormSchema), defaultValues: {"operationsHubId":"","recommendationKey":"","recommendationTitle":"","recommendationStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Recommendation Engine" description="Enterprise retail operating system recommendation engine" /><div className="mt-6 space-y-3">
                {data.recommendationEngine.length === 0 ? <EmptyState title="No recommendation engine" description="Create the first recommendation engine record." /> : data.recommendationEngine.map((item) => (
                    <ListCard key={item.id} title={String(item.recommendationTitle)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.recommendationStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create recommendation engine" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRecommendationEngine(v))}>
                <OperationsHubSelect data={data} {...form.register("operationsHubId")} />
                <input {...form.register("recommendationKey")} placeholder="recommendationKey" className={inputClass} />
                <input {...form.register("recommendationTitle")} placeholder="recommendationTitle" className={inputClass} />
                <select {...form.register("recommendationStatus")} className={inputClass}>{RECOMMENDATION_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function CommandCenterMetricsPanel({ data }: { data: GrowthData }) {
    const form = useForm<commandCenterMetricsFormValues>({ resolver: zodResolver(commandCenterMetricsFormSchema), defaultValues: {"metricsKey":"","overallOperationsScore":0,"missionStatusScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Command Center Metrics" description="Enterprise retail operating system command center metrics" /><div className="mt-6 space-y-3">
                {data.commandCenterMetrics.length === 0 ? <EmptyState title="No command center metrics" description="Create the first command center metrics record." /> : data.commandCenterMetrics.map((item) => (
                    <ListCard key={item.id} title={String(item.metricsKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.overallOperationsScore}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create command center metrics" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createCommandCenterMetric(v))}>
                <input {...form.register("metricsKey")} placeholder="metricsKey" className={inputClass} />
                <input type="number" step="any" {...form.register("overallOperationsScore", { valueAsNumber: true })} placeholder="overallOperationsScore" className={inputClass} />
                <input type="number" step="any" {...form.register("missionStatusScore", { valueAsNumber: true })} placeholder="missionStatusScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function CommandCenterHealthsPanel({ data }: { data: GrowthData }) {
    const form = useForm<commandCenterHealthFormValues>({ resolver: zodResolver(commandCenterHealthFormSchema), defaultValues: {"healthKey":"","overallScore":0,"brandOsStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Command Center Health" description="Enterprise retail operating system command center health" /><div className="mt-6 space-y-3">
                {data.commandCenterHealth.length === 0 ? <EmptyState title="No command center health" description="Create the first command center health record." /> : data.commandCenterHealth.map((item) => (
                    <ListCard key={item.id} title={String(item.healthKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.overallScore}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create command center health" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createCommandCenterHealth(v))}>
                <input {...form.register("healthKey")} placeholder="healthKey" className={inputClass} />
                <input type="number" step="any" {...form.register("overallScore", { valueAsNumber: true })} placeholder="overallScore" className={inputClass} />
                <input {...form.register("brandOsStatus")} placeholder="brandOsStatus" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function MissionStatussPanel({ data }: { data: GrowthData }) {
    const form = useForm<missionStatusFormValues>({ resolver: zodResolver(missionStatusFormSchema), defaultValues: {"operationsHubId":"","missionKey":"","missionName":"","missionStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Mission Status" description="Enterprise retail operating system mission status" /><div className="mt-6 space-y-3">
                {data.missionStatus.length === 0 ? <EmptyState title="No mission status" description="Create the first mission status record." /> : data.missionStatus.map((item) => (
                    <ListCard key={item.id} title={String(item.missionName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.missionStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create mission status" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createMissionStatus(v))}>
                <OperationsHubSelect data={data} {...form.register("operationsHubId")} />
                <input {...form.register("missionKey")} placeholder="missionKey" className={inputClass} />
                <input {...form.register("missionName")} placeholder="missionName" className={inputClass} />
                <select {...form.register("missionStatus")} className={inputClass}>{MISSION_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ExecutiveSummarysPanel({ data }: { data: GrowthData }) {
    const form = useForm<executiveSummariesFormValues>({ resolver: zodResolver(executiveSummariesFormSchema), defaultValues: {"operationsHubId":"","summaryKey":"","summaryTitle":"","summaryStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Executive Summaries" description="Enterprise retail operating system executive summaries" /><div className="mt-6 space-y-3">
                {data.executiveSummaries.length === 0 ? <EmptyState title="No executive summaries" description="Create the first executive summaries record." /> : data.executiveSummaries.map((item) => (
                    <ListCard key={item.id} title={String(item.summaryTitle)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.summaryStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create executive summaries" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createExecutiveSummary(v))}>
                <OperationsHubSelect data={data} {...form.register("operationsHubId")} />
                <input {...form.register("summaryKey")} placeholder="summaryKey" className={inputClass} />
                <input {...form.register("summaryTitle")} placeholder="summaryTitle" className={inputClass} />
                <select {...form.register("summaryStatus")} className={inputClass}>{SUMMARY_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function OperationalFailuresPanel({ data }: { data: GrowthData }) {
    const form = useForm<operationalFailuresFormValues>({ resolver: zodResolver(operationalFailuresFormSchema), defaultValues: {"operationsHubId":"","failureKey":"","failureType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Operational Failures" description="Enterprise retail operating system operational failures" /><div className="mt-6 space-y-3">
                {data.operationalFailures.length === 0 ? <EmptyState title="No operational failures" description="Create the first operational failures record." /> : data.operationalFailures.map((item) => (
                    <ListCard key={item.id} title={String(item.failureKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.failureType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create operational failures" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createOperationalFailure(v))}>
                <OperationsHubSelect data={data} {...form.register("operationsHubId")} />
                <input {...form.register("failureKey")} placeholder="failureKey" className={inputClass} />
                <input {...form.register("failureType")} placeholder="failureType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function GrowthAuditLogsPanel({ data }: { data: GrowthData }) {
    return (
        <Card hover><SectionHeader title="Operational Growth Engine audit history" description="Security-first audit trail for jobs, events, contentPerformance, and marketplace operations" /><div className="mt-6 space-y-3">
            {data.auditLogs.length === 0 ? <EmptyState title="No audit entries" description="Audit logs are created automatically for retail operating system." /> : data.auditLogs.map((entry) => (
                <ListCard key={entry.id} title={entry.summary} subtitle={`${entry.entityType} • ${entry.action}`} meta={`${entry.securityLevel} • ${new Date(entry.createdAt).toLocaleString()}`} />
            ))}
        </div></Card>
    );
}

export function GrowthSdkPanel({ data }: { data: GrowthData }) {
    return (
        <Card hover><SectionHeader title="Shared Operational Growth Engine SDK" description="Import from @/src/modules/growth-engine/sdk for brand registration, menu configuration, and order workflow execution" /><div className="mt-6 space-y-4 text-sm text-pink-600 dark:text-pink-300">
            <ListCard title="createGrowthEngineClient()" subtitle="Factory for module-scoped Operational Growth Engine client with auth context" meta="Primary SDK for enterprise retail operating system" />
            <ListCard title="sdkRunBrandOsService()" subtitle="Register retail operating system with AI orchestration" meta="moduleSource: arjun_automation_growth_engine" />
            <ListCard title="sdkRunCreativeStudioService()" subtitle="Run intelligence service with knowledge context" meta="v1/v2/v3 API versions" />
            <ListCard title="sdkRunDistributionService()" subtitle="Run forecast service with audit trail" meta="Event-driven integration delivery" />
            <p className="text-xs text-pink-500">Theme: {AAGE_THEME.primary} • Integration hubs loaded: {data.operationsHubs.length}</p>
            <pre className="overflow-x-auto rounded-2xl bg-pink-950 p-4 text-xs text-pink-100">{`import { createGrowthEngineClient } from "@/src/modules/growth-engine/sdk";

const intg = createGrowthEngineClient(userId, email, fullName);
await intg.registerCampus({ operationsHubId, serviceKey: "svc-001", serviceName: "Stripe" });
await intg.runCreativeStudioService({ operationsHubId, keyName: "prod-key", apiVersion: "v1" });
await intg.runDistributionService({ operationsHubId, webhookKey: "wh-001", webhookName: "Events" });`}</pre>
        </div></Card>
    );
}
