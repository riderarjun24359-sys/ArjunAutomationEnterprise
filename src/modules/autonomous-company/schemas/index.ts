import { z } from "zod";

export const companyContextFormSchema = z.object({
    title: z.string().min(2),
    contextKey: z.string().min(2),
    baEngagementId: z.string().optional(),
    saEngagementId: z.string().optional(),
    dfEngagementId: z.string().optional(),
    qaEngagementId: z.string().optional(),
    ddEngagementId: z.string().optional(),
    csEngagementId: z.string().optional(),
    foWorkspaceId: z.string().optional(),
    clientId: z.string().optional(),
    projectId: z.string().optional(),
    agentId: z.string().optional(),
    sessionId: z.string().optional(),
    summary: z.string().optional(),
});

export const workflowOrchestrationFormSchema = z.object({
    contextId: z.string().min(1),
    orchestrationKey: z.string().min(2),
    name: z.string().min(2),
});

export const eventBusFormSchema = z.object({
    contextId: z.string().min(1),
    eventKey: z.string().min(2),
    name: z.string().min(2),
    sourceModule: z.string().optional(),
});

export const workerCollaborationFormSchema = z.object({
    contextId: z.string().min(1),
    collaborationKey: z.string().min(2),
    name: z.string().min(2),
});

export const approvalWorkflowFormSchema = z.object({
    contextId: z.string().min(1),
    workflowKey: z.string().min(2),
    title: z.string().min(2),
    requiredRole: z.string().optional(),
});

export const notificationFormSchema = z.object({
    contextId: z.string().min(1),
    notificationKey: z.string().min(2),
    title: z.string().min(2),
    channel: z.string().optional(),
    priority: z.string().optional(),
    message: z.string().optional(),
});

export const timelineFormSchema = z.object({
    contextId: z.string().min(1),
    timelineKey: z.string().min(2),
    title: z.string().min(2),
    eventType: z.string().optional(),
});

export const activityFeedFormSchema = z.object({
    contextId: z.string().min(1),
    feedKey: z.string().min(2),
    actorName: z.string().optional(),
    action: z.string().optional(),
    resourceType: z.string().optional(),
    summary: z.string().optional(),
});

export const automationFormSchema = z.object({
    contextId: z.string().min(1),
    automationKey: z.string().min(2),
    name: z.string().min(2),
    triggerModule: z.string().optional(),
});

export const executiveInsightFormSchema = z.object({
    contextId: z.string().min(1),
    insightKey: z.string().min(2),
    title: z.string().min(2),
    insightType: z.string().optional(),
    content: z.string().optional(),
});

export const predictiveRecommendationFormSchema = z.object({
    contextId: z.string().min(1),
    recommendationKey: z.string().min(2),
    title: z.string().min(2),
    recommendationType: z.string().optional(),
    confidenceScore: z.number().min(0).max(100).optional(),
    recommendation: z.string().optional(),
});

export const systemSearchFormSchema = z.object({
    contextId: z.string().min(1),
    searchKey: z.string().min(2),
    resourceType: z.string().min(1),
    title: z.string().min(2),
    keywords: z.string().optional(),
    moduleSource: z.string().optional(),
});

export const commandPaletteFormSchema = z.object({
    contextId: z.string().min(1),
    commandKey: z.string().min(2),
    label: z.string().min(2),
    actionType: z.string().optional(),
    targetPath: z.string().optional(),
    shortcut: z.string().optional(),
});

export const emergencyWorkflowFormSchema = z.object({
    contextId: z.string().min(1),
    workflowKey: z.string().min(2),
    name: z.string().min(2),
    severity: z.string().optional(),
});

export const businessKpiFormSchema = z.object({
    contextId: z.string().min(1),
    kpiKey: z.string().min(2),
    name: z.string().min(2),
    kpiCategory: z.string().optional(),
    currentValue: z.number().optional(),
    targetValue: z.number().optional(),
    unit: z.string().optional(),
});

export const securityGovernanceFormSchema = z.object({
    contextId: z.string().min(1),
    governanceKey: z.string().min(2),
    name: z.string().min(2),
    controlArea: z.string().optional(),
    complianceStatus: z.string().optional(),
});

export const complianceDashboardFormSchema = z.object({
    contextId: z.string().min(1),
    dashboardKey: z.string().min(2),
    name: z.string().min(2),
    framework: z.string().optional(),
    compliancePercent: z.number().min(0).max(100).optional(),
});

export const operationalHealthFormSchema = z.object({
    contextId: z.string().min(1),
    healthKey: z.string().min(2),
    name: z.string().min(2),
    overallScore: z.number().min(0).max(100).optional(),
});

export type CompanyContextFormValues = z.infer<typeof companyContextFormSchema>;
export type WorkflowOrchestrationFormValues = z.infer<typeof workflowOrchestrationFormSchema>;
export type EventBusFormValues = z.infer<typeof eventBusFormSchema>;
export type WorkerCollaborationFormValues = z.infer<typeof workerCollaborationFormSchema>;
export type ApprovalWorkflowFormValues = z.infer<typeof approvalWorkflowFormSchema>;
export type NotificationFormValues = z.infer<typeof notificationFormSchema>;
export type TimelineFormValues = z.infer<typeof timelineFormSchema>;
export type ActivityFeedFormValues = z.infer<typeof activityFeedFormSchema>;
export type AutomationFormValues = z.infer<typeof automationFormSchema>;
export type ExecutiveInsightFormValues = z.infer<typeof executiveInsightFormSchema>;
export type PredictiveRecommendationFormValues = z.infer<typeof predictiveRecommendationFormSchema>;
export type SystemSearchFormValues = z.infer<typeof systemSearchFormSchema>;
export type CommandPaletteFormValues = z.infer<typeof commandPaletteFormSchema>;
export type EmergencyWorkflowFormValues = z.infer<typeof emergencyWorkflowFormSchema>;
export type BusinessKpiFormValues = z.infer<typeof businessKpiFormSchema>;
export type SecurityGovernanceFormValues = z.infer<typeof securityGovernanceFormSchema>;
export type ComplianceDashboardFormValues = z.infer<typeof complianceDashboardFormSchema>;
export type OperationalHealthFormValues = z.infer<typeof operationalHealthFormSchema>;
