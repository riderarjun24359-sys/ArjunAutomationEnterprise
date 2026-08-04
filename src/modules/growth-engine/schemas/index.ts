import { z } from "zod";

export const growthHubsFormSchema = z.object({
    hubKey: z.string().min(1).optional(),
    hubName: z.string().min(1).optional(),
    environment: z.string().min(1).optional(),
});

export type growthHubsFormValues = z.infer<typeof growthHubsFormSchema>;

export const brandProfilesFormSchema = z.object({
    growthHubId: z.string().min(1),
    profileKey: z.string().min(1).optional(),
    profileName: z.string().min(1).optional(),
    profileStatus: z.string().min(1).optional(),
});

export type brandProfilesFormValues = z.infer<typeof brandProfilesFormSchema>;

export const brandVoiceFormSchema = z.object({
    growthHubId: z.string().min(1),
    voiceKey: z.string().min(1).optional(),
    voiceName: z.string().min(1).optional(),
    voiceTone: z.string().min(1).optional(),
});

export type brandVoiceFormValues = z.infer<typeof brandVoiceFormSchema>;

export const coreMessagingFormSchema = z.object({
    growthHubId: z.string().min(1),
    messagingKey: z.string().min(1).optional(),
    messagingTitle: z.string().min(1).optional(),
    messagingStatus: z.string().min(1).optional(),
});

export type coreMessagingFormValues = z.infer<typeof coreMessagingFormSchema>;

export const brandGuidelinesFormSchema = z.object({
    growthHubId: z.string().min(1),
    guidelineKey: z.string().min(1).optional(),
    guidelineName: z.string().min(1).optional(),
    guidelineStatus: z.string().min(1).optional(),
});

export type brandGuidelinesFormValues = z.infer<typeof brandGuidelinesFormSchema>;

export const logoLibraryFormSchema = z.object({
    growthHubId: z.string().min(1),
    logoKey: z.string().min(1).optional(),
    logoName: z.string().min(1).optional(),
    logoFormat: z.string().min(1).optional(),
});

export type logoLibraryFormValues = z.infer<typeof logoLibraryFormSchema>;

export const colorSystemsFormSchema = z.object({
    growthHubId: z.string().min(1),
    colorKey: z.string().min(1).optional(),
    colorName: z.string().min(1).optional(),
    primaryHex: z.string().min(1).optional(),
});

export type colorSystemsFormValues = z.infer<typeof colorSystemsFormSchema>;

export const youtubeTemplatesFormSchema = z.object({
    growthHubId: z.string().min(1),
    templateKey: z.string().min(1).optional(),
    templateName: z.string().min(1).optional(),
    templateStatus: z.string().min(1).optional(),
});

export type youtubeTemplatesFormValues = z.infer<typeof youtubeTemplatesFormSchema>;

export const socialTemplatesFormSchema = z.object({
    growthHubId: z.string().min(1),
    templateKey: z.string().min(1).optional(),
    templateName: z.string().min(1).optional(),
    templateStatus: z.string().min(1).optional(),
});

export type socialTemplatesFormValues = z.infer<typeof socialTemplatesFormSchema>;

export const blogTemplatesFormSchema = z.object({
    growthHubId: z.string().min(1),
    templateKey: z.string().min(1).optional(),
    templateName: z.string().min(1).optional(),
    templateStatus: z.string().min(1).optional(),
});

export type blogTemplatesFormValues = z.infer<typeof blogTemplatesFormSchema>;

export const websiteArticleTemplatesFormSchema = z.object({
    growthHubId: z.string().min(1),
    templateKey: z.string().min(1).optional(),
    templateName: z.string().min(1).optional(),
    templateStatus: z.string().min(1).optional(),
});

export type websiteArticleTemplatesFormValues = z.infer<typeof websiteArticleTemplatesFormSchema>;

export const emailCampaignTemplatesFormSchema = z.object({
    growthHubId: z.string().min(1),
    templateKey: z.string().min(1).optional(),
    templateName: z.string().min(1).optional(),
    templateStatus: z.string().min(1).optional(),
});

export type emailCampaignTemplatesFormValues = z.infer<typeof emailCampaignTemplatesFormSchema>;

export const caseStudyTemplatesFormSchema = z.object({
    growthHubId: z.string().min(1),
    templateKey: z.string().min(1).optional(),
    templateName: z.string().min(1).optional(),
    templateStatus: z.string().min(1).optional(),
});

export type caseStudyTemplatesFormValues = z.infer<typeof caseStudyTemplatesFormSchema>;

export const imageAssetsFormSchema = z.object({
    growthHubId: z.string().min(1),
    assetKey: z.string().min(1).optional(),
    assetName: z.string().min(1).optional(),
    assetType: z.string().min(1).optional(),
});

export type imageAssetsFormValues = z.infer<typeof imageAssetsFormSchema>;

export const videoAssetsFormSchema = z.object({
    growthHubId: z.string().min(1),
    assetKey: z.string().min(1).optional(),
    assetName: z.string().min(1).optional(),
    assetType: z.string().min(1).optional(),
});

export type videoAssetsFormValues = z.infer<typeof videoAssetsFormSchema>;

export const iconAssetsFormSchema = z.object({
    growthHubId: z.string().min(1),
    assetKey: z.string().min(1).optional(),
    assetName: z.string().min(1).optional(),
    assetType: z.string().min(1).optional(),
});

export type iconAssetsFormValues = z.infer<typeof iconAssetsFormSchema>;

export const voiceProfilesFormSchema = z.object({
    growthHubId: z.string().min(1),
    profileKey: z.string().min(1).optional(),
    profileName: z.string().min(1).optional(),
    voiceType: z.string().min(1).optional(),
});

export type voiceProfilesFormValues = z.infer<typeof voiceProfilesFormSchema>;

export const musicAssetsFormSchema = z.object({
    growthHubId: z.string().min(1),
    assetKey: z.string().min(1).optional(),
    assetName: z.string().min(1).optional(),
    genre: z.string().min(1).optional(),
});

export type musicAssetsFormValues = z.infer<typeof musicAssetsFormSchema>;

export const thumbnailTemplatesFormSchema = z.object({
    growthHubId: z.string().min(1),
    templateKey: z.string().min(1).optional(),
    templateName: z.string().min(1).optional(),
    templateStatus: z.string().min(1).optional(),
});

export type thumbnailTemplatesFormValues = z.infer<typeof thumbnailTemplatesFormSchema>;

export const ideaGeneratorsFormSchema = z.object({
    growthHubId: z.string().min(1),
    generatorKey: z.string().min(1).optional(),
    generatorName: z.string().min(1).optional(),
    generatorStatus: z.string().min(1).optional(),
});

export type ideaGeneratorsFormValues = z.infer<typeof ideaGeneratorsFormSchema>;

export const scriptGeneratorsFormSchema = z.object({
    growthHubId: z.string().min(1),
    generatorKey: z.string().min(1).optional(),
    generatorName: z.string().min(1).optional(),
    generatorStatus: z.string().min(1).optional(),
});

export type scriptGeneratorsFormValues = z.infer<typeof scriptGeneratorsFormSchema>;

export const captionGeneratorsFormSchema = z.object({
    growthHubId: z.string().min(1),
    generatorKey: z.string().min(1).optional(),
    generatorName: z.string().min(1).optional(),
    generatorStatus: z.string().min(1).optional(),
});

export type captionGeneratorsFormValues = z.infer<typeof captionGeneratorsFormSchema>;

export const blogGeneratorsFormSchema = z.object({
    growthHubId: z.string().min(1),
    generatorKey: z.string().min(1).optional(),
    generatorName: z.string().min(1).optional(),
    generatorStatus: z.string().min(1).optional(),
});

export type blogGeneratorsFormValues = z.infer<typeof blogGeneratorsFormSchema>;

export const seoAssistantsFormSchema = z.object({
    growthHubId: z.string().min(1),
    assistantKey: z.string().min(1).optional(),
    assistantName: z.string().min(1).optional(),
    assistantStatus: z.string().min(1).optional(),
});

export type seoAssistantsFormValues = z.infer<typeof seoAssistantsFormSchema>;

export const ctaGeneratorsFormSchema = z.object({
    growthHubId: z.string().min(1),
    generatorKey: z.string().min(1).optional(),
    generatorName: z.string().min(1).optional(),
    generatorStatus: z.string().min(1).optional(),
});

export type ctaGeneratorsFormValues = z.infer<typeof ctaGeneratorsFormSchema>;

export const growthMetricsFormSchema = z.object({
    metricsKey: z.string().min(1).optional(),
    overallGrowthScore: z.number().optional(),
    brandHealthScore: z.number().optional(),
});

export type growthMetricsFormValues = z.infer<typeof growthMetricsFormSchema>;

export const growthHealthFormSchema = z.object({
    healthKey: z.string().min(1).optional(),
    overallScore: z.number().optional(),
    brandStatus: z.string().min(1).optional(),
});

export type growthHealthFormValues = z.infer<typeof growthHealthFormSchema>;

export const contentCalendarFormSchema = z.object({
    growthHubId: z.string().min(1),
    calendarKey: z.string().min(1).optional(),
    calendarName: z.string().min(1).optional(),
    calendarStatus: z.string().min(1).optional(),
});

export type contentCalendarFormValues = z.infer<typeof contentCalendarFormSchema>;

export const draftQueueFormSchema = z.object({
    growthHubId: z.string().min(1),
    queueKey: z.string().min(1).optional(),
    queueTitle: z.string().min(1).optional(),
    queueStatus: z.string().min(1).optional(),
});

export type draftQueueFormValues = z.infer<typeof draftQueueFormSchema>;

export const approvalQueueFormSchema = z.object({
    growthHubId: z.string().min(1),
    queueKey: z.string().min(1).optional(),
    queueTitle: z.string().min(1).optional(),
    queueStatus: z.string().min(1).optional(),
});

export type approvalQueueFormValues = z.infer<typeof approvalQueueFormSchema>;

export const publishingQueueFormSchema = z.object({
    growthHubId: z.string().min(1),
    queueKey: z.string().min(1).optional(),
    queueTitle: z.string().min(1).optional(),
    queueStatus: z.string().min(1).optional(),
});

export type publishingQueueFormValues = z.infer<typeof publishingQueueFormSchema>;
