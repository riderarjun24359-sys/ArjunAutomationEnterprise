export interface TloDashboardStats {
    totalTenantContexts: number;
    activeTenantContexts: number;
    lifecycleRecordCount: number;
    openReactivationCount: number;
    onboardingInProgressCount: number;
    marketplaceModuleCount: number;
    industryPackCount: number;
    avgHealthScore: number;
    openExpansionCount: number;
    auditCount: number;
}

export interface TloPipelineInfo {
    stages: Array<{ key: string; label: string }>;
    currentStage: string;
    nextStage: string;
    previousStage: string;
}

export interface AuditEntry {
    id: string;
    entityType: string;
    entityId?: string | null;
    action: string;
    summary: string;
    securityLevel: string;
    createdAt: string;
}

export interface TenantContextSummary {
    id: string;
    contextKey: string;
    companyName: string;
    lifecycleStage: string;
    status: string;
}

export interface CreateTenantContextInput {
    contextKey?: string;
    companyName?: string;
    lifecycleStage?: string;
}

export interface LifecycleRecordSummary {
    id: string;
    tenantContextName: string;
    recordKey: string;
    status: string;
}

export interface CreateLifecycleRecordInput {
    tenantContextId: string;
    recordKey?: string;
    currentStage?: string;
}

export interface LifecycleTransitionSummary {
    id: string;
    tenantContextName: string;
    transitionKey: string;
    status: string;
}

export interface CreateLifecycleTransitionInput {
    tenantContextId: string;
    transitionKey?: string;
    fromStage?: string;
    toStage?: string;
}

export interface LifecycleEventSummary {
    id: string;
    tenantContextName: string;
    eventKey: string;
    status: string;
}

export interface CreateLifecycleEventInput {
    tenantContextId: string;
    eventKey?: string;
    eventType?: string;
    summary?: string;
}

export interface ReactivationRequestSummary {
    id: string;
    tenantContextName: string;
    requestKey: string;
    status: string;
}

export interface CreateReactivationRequestInput {
    tenantContextId: string;
    requestKey?: string;
    targetStage?: string;
}

export interface WorkspaceSummary {
    id: string;
    tenantContextName: string;
    workspaceKey: string;
    workspaceName: string;
    status: string;
}

export interface CreateWorkspaceInput {
    tenantContextId: string;
    workspaceKey?: string;
    workspaceName?: string;
}

export interface EnvironmentSettingSummary {
    id: string;
    tenantContextName: string;
    settingKey: string;
    status: string;
}

export interface CreateEnvironmentSettingInput {
    tenantContextId: string;
    settingKey?: string;
    environmentName?: string;
}

export interface StorageManagementSummary {
    id: string;
    tenantContextName: string;
    storageKey: string;
    status: string;
}

export interface CreateStorageManagementInput {
    tenantContextId: string;
    storageKey?: string;
    storageType?: string;
}

export interface OperationsControlSummary {
    id: string;
    tenantContextName: string;
    controlKey: string;
    status: string;
}

export interface CreateOperationsControlInput {
    tenantContextId: string;
    controlKey?: string;
    
}

export interface OnboardingFlowSummary {
    id: string;
    tenantContextName: string;
    flowKey: string;
    flowName: string;
    status: string;
}

export interface CreateOnboardingFlowInput {
    tenantContextId: string;
    flowKey?: string;
    flowName?: string;
}

export interface OnboardingProgressSummary {
    id: string;
    tenantContextName: string;
    progressKey: string;
    status: string;
}

export interface CreateOnboardingProgressInput {
    tenantContextId: string;
    progressKey?: string;
    currentStep?: string;
}

export interface OnboardingValidationSummary {
    id: string;
    tenantContextName: string;
    validationKey: string;
    ruleName: string;
    status: string;
}

export interface CreateOnboardingValidationInput {
    tenantContextId: string;
    validationKey?: string;
    ruleName?: string;
}

export interface GoLiveChecklistSummary {
    id: string;
    tenantContextName: string;
    checklistKey: string;
    name: string;
    status: string;
}

export interface CreateGoLiveChecklistInput {
    tenantContextId: string;
    checklistKey?: string;
    name?: string;
}

export interface MarketplaceModuleSummary {
    id: string;
    tenantContextName: string;
    moduleKey: string;
    moduleName: string;
    status: string;
}

export interface CreateMarketplaceModuleInput {
    tenantContextId: string;
    moduleKey?: string;
    moduleName?: string;
}

export interface ModuleInstallationSummary {
    id: string;
    tenantContextName: string;
    installationKey: string;
    status: string;
}

export interface CreateModuleInstallationInput {
    tenantContextId: string;
    installationKey?: string;
    
}

export interface ModuleDependencySummary {
    id: string;
    tenantContextName: string;
    dependencyKey: string;
    status: string;
}

export interface CreateModuleDependencyInput {
    tenantContextId: string;
    dependencyKey?: string;
    
}

export interface ModuleCompatibilitySummary {
    id: string;
    tenantContextName: string;
    compatibilityKey: string;
    status: string;
}

export interface CreateModuleCompatibilityInput {
    tenantContextId: string;
    compatibilityKey?: string;
    
}

export interface IndustryPackSummary {
    id: string;
    tenantContextName: string;
    packKey: string;
    packName: string;
    status: string;
}

export interface CreateIndustryPackInput {
    tenantContextId: string;
    packKey?: string;
    packName?: string;
    industry?: string;
}

export interface PackInstallationSummary {
    id: string;
    tenantContextName: string;
    installationKey: string;
    status: string;
}

export interface CreatePackInstallationInput {
    tenantContextId: string;
    installationKey?: string;
    
}

export interface PackVersionSummary {
    id: string;
    tenantContextName: string;
    versionKey: string;
    versionNumber: string;
    status: string;
}

export interface CreatePackVersionInput {
    tenantContextId: string;
    versionKey?: string;
    versionNumber?: string;
}

export interface PackExportSummary {
    id: string;
    tenantContextName: string;
    exportKey: string;
    status: string;
}

export interface CreatePackExportInput {
    tenantContextId: string;
    exportKey?: string;
    
}

export interface HealthSnapshotSummary {
    id: string;
    tenantContextName: string;
    snapshotKey: string;
    overallScore: number;
    status: string;
}

export interface CreateHealthSnapshotInput {
    tenantContextId: string;
    snapshotKey?: string;
    overallScore?: number;
}

export interface HealthDimensionSummary {
    id: string;
    tenantContextName: string;
    dimensionKey: string;
    dimensionName: string;
    status: string;
}

export interface CreateHealthDimensionInput {
    tenantContextId: string;
    dimensionKey?: string;
    dimensionName?: string;
}

export interface HealthRiskSummary {
    id: string;
    tenantContextName: string;
    riskKey: string;
    title: string;
    status: string;
}

export interface CreateHealthRiskInput {
    tenantContextId: string;
    riskKey?: string;
    title?: string;
    severity?: string;
}

export interface HealthScoreSummary {
    id: string;
    tenantContextName: string;
    scoreKey: string;
    status: string;
}

export interface CreateHealthScoreInput {
    tenantContextId: string;
    scoreKey?: string;
    scoreValue?: number;
}

export interface SuccessPlanSummary {
    id: string;
    tenantContextName: string;
    planKey: string;
    planName: string;
    status: string;
}

export interface CreateSuccessPlanInput {
    tenantContextId: string;
    planKey?: string;
    planName?: string;
}

export interface QuarterlyReviewSummary {
    id: string;
    tenantContextName: string;
    reviewKey: string;
    status: string;
}

export interface CreateQuarterlyReviewInput {
    tenantContextId: string;
    reviewKey?: string;
    quarter?: string;
}

export interface RenewalPlanSummary {
    id: string;
    tenantContextName: string;
    renewalKey: string;
    status: string;
}

export interface CreateRenewalPlanInput {
    tenantContextId: string;
    renewalKey?: string;
    
}

export interface CustomerMilestoneSummary {
    id: string;
    tenantContextName: string;
    milestoneKey: string;
    milestoneName: string;
    status: string;
}

export interface CreateCustomerMilestoneInput {
    tenantContextId: string;
    milestoneKey?: string;
    milestoneName?: string;
}

export interface CommercialMetricSummary {
    id: string;
    metricsKey: string;
    status: string;
}

export interface CreateCommercialMetricInput {
    metricsKey?: string;
    totalTenants?: number;
}

export interface GrowthSnapshotSummary {
    id: string;
    snapshotKey: string;
    status: string;
}

export interface CreateGrowthSnapshotInput {
    snapshotKey?: string;
    growthRatePercent?: number;
}

export interface ExpansionOpportunitySummary {
    id: string;
    tenantContextName: string;
    opportunityKey: string;
    title: string;
    status: string;
}

export interface CreateExpansionOpportunityInput {
    tenantContextId: string;
    opportunityKey?: string;
    title?: string;
}

export interface TloSdkProvisionTenantInput { contextKey: string; companyName: string; lifecycleStage?: string; }
export interface TloSdkProvisionTenantResult { contextId: string; contextKey: string; recordId: string; aiTaskId?: string | null; }
export interface TloSdkTransitionLifecycleInput { tenantContextId: string; transitionKey: string; fromStage: string; toStage: string; reason?: string; }
export interface TloSdkTransitionLifecycleResult { transitionId: string; transitionKey: string; toStage: string; status: string; }
export interface TloSdkInstallIndustryPackInput { tenantContextId: string; packKey: string; packName: string; industry?: string; }
export interface TloSdkInstallIndustryPackResult { packId: string; packKey: string; installationId: string; status: string; }
