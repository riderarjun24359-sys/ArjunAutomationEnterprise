import { z } from "zod";

export const communicationHubFormSchema = z.object({
    hubKey: z.string().min(2).optional(),
    hubName: z.string().min(1).optional(),
});

export const notificationChannelFormSchema = z.object({
    communicationHubId: z.string().min(1),
    channelKey: z.string().min(2).optional(),
    channelName: z.string().min(1).optional(),
    channelType: z.string().min(1).optional(),
});

export const notificationQueueFormSchema = z.object({
    communicationHubId: z.string().min(1),
    queueKey: z.string().min(2).optional(),
    recipient: z.string().min(1).optional(),
    deliveryStatus: z.string().min(1).optional(),
});

export const retryPolicyFormSchema = z.object({
    communicationHubId: z.string().min(1),
    policyKey: z.string().min(2).optional(),
    policyName: z.string().min(1).optional(),
});

export const messageTemplateFormSchema = z.object({
    communicationHubId: z.string().min(1),
    templateKey: z.string().min(2).optional(),
    templateName: z.string().min(1).optional(),
    channelType: z.string().min(1).optional(),
});

export const templateVariableFormSchema = z.object({
    communicationHubId: z.string().min(1),
    variableKey: z.string().min(2).optional(),
    variableName: z.string().min(1).optional(),
});

export const templateLocalizationFormSchema = z.object({
    communicationHubId: z.string().min(1),
    locale: z.string().min(2).optional(),
});

export const templateApprovalFormSchema = z.object({
    communicationHubId: z.string().min(1),
    approvalKey: z.string().min(2).optional(),
});

export const automationRuleFormSchema = z.object({
    communicationHubId: z.string().min(1),
    ruleKey: z.string().min(2).optional(),
    ruleName: z.string().min(1).optional(),
    priorityLevel: z.string().min(1).optional(),
});

export const automationTriggerFormSchema = z.object({
    communicationHubId: z.string().min(1),
    triggerKey: z.string().min(2).optional(),
    triggerEvent: z.string().min(1).optional(),
});

export const automationScheduleFormSchema = z.object({
    communicationHubId: z.string().min(1),
    scheduleKey: z.string().min(2).optional(),
});

export const automationExecutionFormSchema = z.object({
    communicationHubId: z.string().min(1),
    executionKey: z.string().min(2).optional(),
});

export const preferenceProfileFormSchema = z.object({
    communicationHubId: z.string().min(1),
    profileKey: z.string().min(2).optional(),
    customerEmail: z.string().min(1).optional(),
});

export const channelPreferenceFormSchema = z.object({
    communicationHubId: z.string().min(1),
    channelType: z.string().min(1).optional(),
});

export const optInRecordFormSchema = z.object({
    communicationHubId: z.string().min(1),
    optInKey: z.string().min(2).optional(),
});

export const optOutRecordFormSchema = z.object({
    communicationHubId: z.string().min(1),
    optOutKey: z.string().min(2).optional(),
});

export const announcementFormSchema = z.object({
    communicationHubId: z.string().min(1),
    announcementKey: z.string().min(2).optional(),
    title: z.string().min(1).optional(),
});

export const announcementScheduleFormSchema = z.object({
    communicationHubId: z.string().min(1),
    scheduleKey: z.string().min(2).optional(),
});

export const pinnedAnnouncementFormSchema = z.object({
    communicationHubId: z.string().min(1),
    pinKey: z.string().min(2).optional(),
});

export const announcementAcknowledgementFormSchema = z.object({
    communicationHubId: z.string().min(1),
    acknowledgementKey: z.string().min(2).optional(),
});

export const campaignFormSchema = z.object({
    communicationHubId: z.string().min(1),
    campaignKey: z.string().min(2).optional(),
    campaignName: z.string().min(1).optional(),
});

export const audienceSegmentFormSchema = z.object({
    communicationHubId: z.string().min(1),
    segmentKey: z.string().min(2).optional(),
    segmentName: z.string().min(1).optional(),
});

export const campaignDeliveryFormSchema = z.object({
    communicationHubId: z.string().min(1),
    deliveryKey: z.string().min(2).optional(),
});

export const campaignMetricFormSchema = z.object({
    communicationHubId: z.string().min(1),
    metricsKey: z.string().min(2).optional(),
});

export const deliveryAnalyticsFormSchema = z.object({
    communicationHubId: z.string().min(1),
    analyticsKey: z.string().min(2).optional(),
});

export const engagementMetricFormSchema = z.object({
    communicationHubId: z.string().min(1),
    metricsKey: z.string().min(2).optional(),
});

export const bounceRecordFormSchema = z.object({
    communicationHubId: z.string().min(1),
    bounceKey: z.string().min(2).optional(),
});

export const channelPerformanceFormSchema = z.object({
    communicationHubId: z.string().min(1),
    performanceKey: z.string().min(2).optional(),
});

export const communicationMetricFormSchema = z.object({
    metricsKey: z.string().min(2).optional(),
});

export const systemHealthFormSchema = z.object({
    healthKey: z.string().min(2).optional(),
});

export const deliveryFailureFormSchema = z.object({
    communicationHubId: z.string().min(1),
    failureKey: z.string().min(2).optional(),
});

export type communicationHubFormValues = z.infer<typeof communicationHubFormSchema>;
export type notificationChannelFormValues = z.infer<typeof notificationChannelFormSchema>;
export type notificationQueueFormValues = z.infer<typeof notificationQueueFormSchema>;
export type retryPolicyFormValues = z.infer<typeof retryPolicyFormSchema>;
export type messageTemplateFormValues = z.infer<typeof messageTemplateFormSchema>;
export type templateVariableFormValues = z.infer<typeof templateVariableFormSchema>;
export type templateLocalizationFormValues = z.infer<typeof templateLocalizationFormSchema>;
export type templateApprovalFormValues = z.infer<typeof templateApprovalFormSchema>;
export type automationRuleFormValues = z.infer<typeof automationRuleFormSchema>;
export type automationTriggerFormValues = z.infer<typeof automationTriggerFormSchema>;
export type automationScheduleFormValues = z.infer<typeof automationScheduleFormSchema>;
export type automationExecutionFormValues = z.infer<typeof automationExecutionFormSchema>;
export type preferenceProfileFormValues = z.infer<typeof preferenceProfileFormSchema>;
export type channelPreferenceFormValues = z.infer<typeof channelPreferenceFormSchema>;
export type optInRecordFormValues = z.infer<typeof optInRecordFormSchema>;
export type optOutRecordFormValues = z.infer<typeof optOutRecordFormSchema>;
export type announcementFormValues = z.infer<typeof announcementFormSchema>;
export type announcementScheduleFormValues = z.infer<typeof announcementScheduleFormSchema>;
export type pinnedAnnouncementFormValues = z.infer<typeof pinnedAnnouncementFormSchema>;
export type announcementAcknowledgementFormValues = z.infer<typeof announcementAcknowledgementFormSchema>;
export type campaignFormValues = z.infer<typeof campaignFormSchema>;
export type audienceSegmentFormValues = z.infer<typeof audienceSegmentFormSchema>;
export type campaignDeliveryFormValues = z.infer<typeof campaignDeliveryFormSchema>;
export type campaignMetricFormValues = z.infer<typeof campaignMetricFormSchema>;
export type deliveryAnalyticsFormValues = z.infer<typeof deliveryAnalyticsFormSchema>;
export type engagementMetricFormValues = z.infer<typeof engagementMetricFormSchema>;
export type bounceRecordFormValues = z.infer<typeof bounceRecordFormSchema>;
export type channelPerformanceFormValues = z.infer<typeof channelPerformanceFormSchema>;
export type communicationMetricFormValues = z.infer<typeof communicationMetricFormSchema>;
export type systemHealthFormValues = z.infer<typeof systemHealthFormSchema>;
export type deliveryFailureFormValues = z.infer<typeof deliveryFailureFormSchema>;
