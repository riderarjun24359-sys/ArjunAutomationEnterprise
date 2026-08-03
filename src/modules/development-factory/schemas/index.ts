import { z } from "zod";

export const engagementFormSchema = z.object({
    title: z.string().min(2),
    engagementKey: z.string().min(2),
    baEngagementId: z.string().optional(),
    saEngagementId: z.string().optional(),
    solutionArchitectureId: z.string().optional(),
    brdId: z.string().optional(),
    frsId: z.string().optional(),
    clientId: z.string().optional(),
    projectId: z.string().optional(),
    agentId: z.string().optional(),
    sessionId: z.string().optional(),
    summary: z.string().optional(),
});

export const workPackageFormSchema = z.object({
    engagementId: z.string().min(1),
    packageKey: z.string().min(2),
    title: z.string().min(2),
    description: z.string().optional(),
});

export const backendWorkflowFormSchema = z.object({
    engagementId: z.string().min(1),
    workflowKey: z.string().min(2),
    name: z.string().min(2),
    targetModules: z.string().optional(),
});

export const frontendWorkflowFormSchema = z.object({
    engagementId: z.string().min(1),
    workflowKey: z.string().min(2),
    name: z.string().min(2),
    targetModules: z.string().optional(),
});

export const apiScaffoldFormSchema = z.object({
    engagementId: z.string().min(1),
    scaffoldKey: z.string().min(2),
    name: z.string().min(2),
    scaffoldSpec: z.string().optional(),
});

export const migrationPlanFormSchema = z.object({
    engagementId: z.string().min(1),
    planKey: z.string().min(2),
    name: z.string().min(2),
    rollbackNotes: z.string().optional(),
});

export const repositoryStructureFormSchema = z.object({
    engagementId: z.string().min(1),
    repoKey: z.string().min(2),
    name: z.string().min(2),
    repoType: z.string().optional(),
});

export const componentFormSchema = z.object({
    engagementId: z.string().min(1),
    componentKey: z.string().min(2),
    name: z.string().min(2),
    componentType: z.string().optional(),
    specification: z.string().optional(),
});

export const testScaffoldFormSchema = z.object({
    engagementId: z.string().min(1),
    scaffoldKey: z.string().min(2),
    name: z.string().min(2),
    testType: z.string().optional(),
});

export const codingStandardFormSchema = z.object({
    engagementId: z.string().min(1),
    standardKey: z.string().min(2),
    name: z.string().min(2),
    enforcementLevel: z.string().optional(),
});

export const secureCodingFormSchema = z.object({
    engagementId: z.string().min(1),
    validationKey: z.string().min(2),
    name: z.string().min(2),
    findings: z.string().optional(),
});

export const moduleRecommendationFormSchema = z.object({
    engagementId: z.string().min(1),
    recommendationKey: z.string().min(2),
    moduleName: z.string().min(2),
    platformModule: z.string().optional(),
    rationale: z.string().optional(),
});

export const pullRequestFormSchema = z.object({
    engagementId: z.string().min(1),
    prKey: z.string().min(2),
    title: z.string().min(2),
    description: z.string().optional(),
});

export const codeReviewFormSchema = z.object({
    engagementId: z.string().min(1),
    reviewKey: z.string().min(2),
    title: z.string().min(2),
    reviewerId: z.string().optional(),
    comments: z.string().optional(),
});

export const technicalDocFormSchema = z.object({
    engagementId: z.string().min(1),
    docKey: z.string().min(2),
    title: z.string().min(2),
    docType: z.string().optional(),
    content: z.string().optional(),
});

export const progressTrackingFormSchema = z.object({
    engagementId: z.string().min(1),
    trackingKey: z.string().min(2),
    milestone: z.string().min(2),
    progressPercent: z.number().min(0).max(100).optional(),
    notes: z.string().optional(),
});

export const buildArtifactFormSchema = z.object({
    engagementId: z.string().min(1),
    artifactKey: z.string().min(2),
    name: z.string().min(2),
    artifactType: z.string().optional(),
    artifactPath: z.string().optional(),
});

export const versionFormSchema = z.object({
    engagementId: z.string().min(1),
    entityType: z.string().min(1),
    entityId: z.string().min(1),
    content: z.string().min(10),
    changeSummary: z.string().min(5),
});

export type EngagementFormValues = z.infer<typeof engagementFormSchema>;
export type WorkPackageFormValues = z.infer<typeof workPackageFormSchema>;
export type BackendWorkflowFormValues = z.infer<typeof backendWorkflowFormSchema>;
export type FrontendWorkflowFormValues = z.infer<typeof frontendWorkflowFormSchema>;
export type ApiScaffoldFormValues = z.infer<typeof apiScaffoldFormSchema>;
export type MigrationPlanFormValues = z.infer<typeof migrationPlanFormSchema>;
export type RepositoryStructureFormValues = z.infer<typeof repositoryStructureFormSchema>;
export type ComponentFormValues = z.infer<typeof componentFormSchema>;
export type TestScaffoldFormValues = z.infer<typeof testScaffoldFormSchema>;
export type CodingStandardFormValues = z.infer<typeof codingStandardFormSchema>;
export type SecureCodingFormValues = z.infer<typeof secureCodingFormSchema>;
export type ModuleRecommendationFormValues = z.infer<typeof moduleRecommendationFormSchema>;
export type PullRequestFormValues = z.infer<typeof pullRequestFormSchema>;
export type CodeReviewFormValues = z.infer<typeof codeReviewFormSchema>;
export type TechnicalDocFormValues = z.infer<typeof technicalDocFormSchema>;
export type ProgressTrackingFormValues = z.infer<typeof progressTrackingFormSchema>;
export type BuildArtifactFormValues = z.infer<typeof buildArtifactFormSchema>;
export type VersionFormValues = z.infer<typeof versionFormSchema>;
