import { z } from "zod";

export const workspaceFormSchema = z.object({
    title: z.string().min(2),
    workspaceKey: z.string().min(2),
    baEngagementId: z.string().optional(),
    saEngagementId: z.string().optional(),
    dfEngagementId: z.string().optional(),
    qaEngagementId: z.string().optional(),
    ddEngagementId: z.string().optional(),
    csEngagementId: z.string().optional(),
    clientId: z.string().optional(),
    projectId: z.string().optional(),
    agentId: z.string().optional(),
    sessionId: z.string().optional(),
    summary: z.string().optional(),
});

export const strategicOkrFormSchema = z.object({
    workspaceId: z.string().min(1),
    okrKey: z.string().min(2),
    title: z.string().min(2),
    objective: z.string().optional(),
    quarter: z.string().optional(),
});

export const executiveDashboardFormSchema = z.object({
    workspaceId: z.string().min(1),
    dashboardKey: z.string().min(2),
    name: z.string().min(2),
    refreshCadence: z.string().optional(),
});

export const revenueRunwayFormSchema = z.object({
    workspaceId: z.string().min(1),
    runwayKey: z.string().min(2),
    name: z.string().min(2),
    monthlyBurnUsd: z.number().min(0).optional(),
    cashBalanceUsd: z.number().min(0).optional(),
    runwayMonths: z.number().min(0).optional(),
});

export const teamCapacityFormSchema = z.object({
    workspaceId: z.string().min(1),
    capacityKey: z.string().min(2),
    name: z.string().min(2),
    utilizationPercent: z.number().min(0).max(100).optional(),
});

export const productRoadmapFormSchema = z.object({
    workspaceId: z.string().min(1),
    roadmapKey: z.string().min(2),
    name: z.string().min(2),
});

export const investorRelationFormSchema = z.object({
    workspaceId: z.string().min(1),
    relationKey: z.string().min(2),
    investorName: z.string().min(2),
    round: z.string().optional(),
    engagementNotes: z.string().optional(),
});

export const boardReportFormSchema = z.object({
    workspaceId: z.string().min(1),
    reportKey: z.string().min(2),
    title: z.string().min(2),
    reportingPeriod: z.string().optional(),
});

export const decisionLogFormSchema = z.object({
    workspaceId: z.string().min(1),
    decisionKey: z.string().min(2),
    title: z.string().min(2),
    decisionType: z.string().optional(),
    rationale: z.string().optional(),
    outcome: z.string().optional(),
});

export const priorityFormSchema = z.object({
    workspaceId: z.string().min(1),
    priorityKey: z.string().min(2),
    title: z.string().min(2),
    priorityLevel: z.string().optional(),
    owner: z.string().optional(),
});

export const resourceAllocationFormSchema = z.object({
    workspaceId: z.string().min(1),
    allocationKey: z.string().min(2),
    name: z.string().min(2),
    budgetUsd: z.number().min(0).optional(),
});

export const riskRegisterFormSchema = z.object({
    workspaceId: z.string().min(1),
    riskKey: z.string().min(2),
    title: z.string().min(2),
    riskLevel: z.string().optional(),
    mitigationPlan: z.string().optional(),
    owner: z.string().optional(),
});

export const growthMetricFormSchema = z.object({
    workspaceId: z.string().min(1),
    metricKey: z.string().min(2),
    name: z.string().min(2),
    metricType: z.string().optional(),
    currentValue: z.number().optional(),
    targetValue: z.number().optional(),
    growthRatePercent: z.number().optional(),
});

export const founderAgendaFormSchema = z.object({
    workspaceId: z.string().min(1),
    agendaKey: z.string().min(2),
    title: z.string().min(2),
});

export const stakeholderFormSchema = z.object({
    workspaceId: z.string().min(1),
    stakeholderKey: z.string().min(2),
    name: z.string().min(2),
    stakeholderType: z.string().optional(),
    influenceLevel: z.string().optional(),
});

export const capitalPlanFormSchema = z.object({
    workspaceId: z.string().min(1),
    planKey: z.string().min(2),
    name: z.string().min(2),
    fundingTargetUsd: z.number().min(0).optional(),
    timeline: z.string().optional(),
});

export const companyMilestoneFormSchema = z.object({
    workspaceId: z.string().min(1),
    milestoneKey: z.string().min(2),
    title: z.string().min(2),
    milestoneType: z.string().optional(),
    successCriteria: z.string().optional(),
});

export const founderInsightFormSchema = z.object({
    workspaceId: z.string().min(1),
    insightKey: z.string().min(2),
    title: z.string().min(2),
    insightType: z.string().optional(),
    content: z.string().optional(),
    confidenceScore: z.number().min(0).max(100).optional(),
});

export type WorkspaceFormValues = z.infer<typeof workspaceFormSchema>;
export type StrategicOkrFormValues = z.infer<typeof strategicOkrFormSchema>;
export type ExecutiveDashboardFormValues = z.infer<typeof executiveDashboardFormSchema>;
export type RevenueRunwayFormValues = z.infer<typeof revenueRunwayFormSchema>;
export type TeamCapacityFormValues = z.infer<typeof teamCapacityFormSchema>;
export type ProductRoadmapFormValues = z.infer<typeof productRoadmapFormSchema>;
export type InvestorRelationFormValues = z.infer<typeof investorRelationFormSchema>;
export type BoardReportFormValues = z.infer<typeof boardReportFormSchema>;
export type DecisionLogFormValues = z.infer<typeof decisionLogFormSchema>;
export type PriorityFormValues = z.infer<typeof priorityFormSchema>;
export type ResourceAllocationFormValues = z.infer<typeof resourceAllocationFormSchema>;
export type RiskRegisterFormValues = z.infer<typeof riskRegisterFormSchema>;
export type GrowthMetricFormValues = z.infer<typeof growthMetricFormSchema>;
export type FounderAgendaFormValues = z.infer<typeof founderAgendaFormSchema>;
export type StakeholderFormValues = z.infer<typeof stakeholderFormSchema>;
export type CapitalPlanFormValues = z.infer<typeof capitalPlanFormSchema>;
export type CompanyMilestoneFormValues = z.infer<typeof companyMilestoneFormSchema>;
export type FounderInsightFormValues = z.infer<typeof founderInsightFormSchema>;
