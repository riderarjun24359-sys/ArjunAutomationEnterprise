import { z } from "zod";

export const engagementFormSchema = z.object({
    title: z.string().min(2),
    engagementKey: z.string().min(2),
    baEngagementId: z.string().optional(),
    saEngagementId: z.string().optional(),
    dfEngagementId: z.string().optional(),
    solutionArchitectureId: z.string().optional(),
    workPackageId: z.string().optional(),
    brdId: z.string().optional(),
    frsId: z.string().optional(),
    clientId: z.string().optional(),
    projectId: z.string().optional(),
    agentId: z.string().optional(),
    sessionId: z.string().optional(),
    summary: z.string().optional(),
});

export const testStrategyFormSchema = z.object({
    engagementId: z.string().min(1),
    strategyKey: z.string().min(2),
    title: z.string().min(2),
    scope: z.string().optional(),
    approach: z.string().optional(),
});

export const unitTestPlanFormSchema = z.object({
    engagementId: z.string().min(1),
    planKey: z.string().min(2),
    name: z.string().min(2),
    targetModules: z.string().optional(),
});

export const integrationTestPlanFormSchema = z.object({
    engagementId: z.string().min(1),
    planKey: z.string().min(2),
    name: z.string().min(2),
});

export const e2eTestPlanFormSchema = z.object({
    engagementId: z.string().min(1),
    planKey: z.string().min(2),
    name: z.string().min(2),
});

export const regressionAnalysisFormSchema = z.object({
    engagementId: z.string().min(1),
    analysisKey: z.string().min(2),
    name: z.string().min(2),
    regressionRisks: z.string().optional(),
    recommendations: z.string().optional(),
});

export const riskBasedTestFormSchema = z.object({
    engagementId: z.string().min(1),
    testKey: z.string().min(2),
    name: z.string().min(2),
    riskLevel: z.string().optional(),
    testPriority: z.string().optional(),
});

export const securityValidationFormSchema = z.object({
    engagementId: z.string().min(1),
    validationKey: z.string().min(2),
    name: z.string().min(2),
    findings: z.string().optional(),
});

export const performanceValidationFormSchema = z.object({
    engagementId: z.string().min(1),
    validationKey: z.string().min(2),
    name: z.string().min(2),
    results: z.string().optional(),
});

export const accessibilityValidationFormSchema = z.object({
    engagementId: z.string().min(1),
    validationKey: z.string().min(2),
    name: z.string().min(2),
    wcagLevel: z.string().optional(),
    findings: z.string().optional(),
});

export const apiValidationFormSchema = z.object({
    engagementId: z.string().min(1),
    validationKey: z.string().min(2),
    name: z.string().min(2),
    validationResults: z.string().optional(),
});

export const databaseValidationFormSchema = z.object({
    engagementId: z.string().min(1),
    validationKey: z.string().min(2),
    name: z.string().min(2),
});

export const uiValidationFormSchema = z.object({
    engagementId: z.string().min(1),
    validationKey: z.string().min(2),
    name: z.string().min(2),
    validationResults: z.string().optional(),
});

export const bugTriageFormSchema = z.object({
    engagementId: z.string().min(1),
    bugKey: z.string().min(2),
    title: z.string().min(2),
    severity: z.string().optional(),
    priority: z.string().optional(),
    triageNotes: z.string().optional(),
});

export const defectAnalysisFormSchema = z.object({
    engagementId: z.string().min(1),
    analysisKey: z.string().min(2),
    title: z.string().min(2),
    rootCause: z.string().optional(),
    impactAnalysis: z.string().optional(),
    remediation: z.string().optional(),
});

export const coverageAnalyticsFormSchema = z.object({
    engagementId: z.string().min(1),
    analyticsKey: z.string().min(2),
    name: z.string().min(2),
    coveragePercent: z.number().min(0).max(100).optional(),
    gaps: z.string().optional(),
});

export const releaseReadinessFormSchema = z.object({
    engagementId: z.string().min(1),
    assessmentKey: z.string().min(2),
    title: z.string().min(2),
    recommendation: z.string().optional(),
});

export const qualityScoreFormSchema = z.object({
    engagementId: z.string().min(1),
    scoreKey: z.string().min(2),
    name: z.string().min(2),
    overallScore: z.number().min(0).max(100).optional(),
});

export type EngagementFormValues = z.infer<typeof engagementFormSchema>;
export type TestStrategyFormValues = z.infer<typeof testStrategyFormSchema>;
export type UnitTestPlanFormValues = z.infer<typeof unitTestPlanFormSchema>;
export type IntegrationTestPlanFormValues = z.infer<typeof integrationTestPlanFormSchema>;
export type E2eTestPlanFormValues = z.infer<typeof e2eTestPlanFormSchema>;
export type RegressionAnalysisFormValues = z.infer<typeof regressionAnalysisFormSchema>;
export type RiskBasedTestFormValues = z.infer<typeof riskBasedTestFormSchema>;
export type SecurityValidationFormValues = z.infer<typeof securityValidationFormSchema>;
export type PerformanceValidationFormValues = z.infer<typeof performanceValidationFormSchema>;
export type AccessibilityValidationFormValues = z.infer<typeof accessibilityValidationFormSchema>;
export type ApiValidationFormValues = z.infer<typeof apiValidationFormSchema>;
export type DatabaseValidationFormValues = z.infer<typeof databaseValidationFormSchema>;
export type UiValidationFormValues = z.infer<typeof uiValidationFormSchema>;
export type BugTriageFormValues = z.infer<typeof bugTriageFormSchema>;
export type DefectAnalysisFormValues = z.infer<typeof defectAnalysisFormSchema>;
export type CoverageAnalyticsFormValues = z.infer<typeof coverageAnalyticsFormSchema>;
export type ReleaseReadinessFormValues = z.infer<typeof releaseReadinessFormSchema>;
export type QualityScoreFormValues = z.infer<typeof qualityScoreFormSchema>;
