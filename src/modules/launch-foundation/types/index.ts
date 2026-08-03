export interface ElfDashboardStats {
    totalLaunchHubs: number;
    activeLaunchHubs: number;
    organizationProvisionCount: number;
    importJobCount: number;
    goLiveChecklistCount: number;
    customerRegistryCount: number;
    openLaunchFailureCount: number;
    overallLaunchScore: number;
    platformHealthScore: number;
    customerHealthScore: number;
    deploymentCount: number;
    subscriptionCount: number;
    supportOpenCount: number;
    goLiveScore: number;
    auditCount: number;
}

export interface ElfPipelineInfo {
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

export interface ElfSdkProvisionOrganizationInput { launchHubId: string; provisionKey?: string; provisionName?: string; }
export interface ElfSdkProvisionOrganizationResult { provisionId: string; provisionKey: string; status: string; }
export interface ElfSdkConfigureWizardProfileInput { launchHubId: string; profileKey?: string; profileName?: string; }
export interface ElfSdkConfigureWizardProfileResult { profileId: string; profileKey: string; status: string; }
export interface ElfSdkRunGoLiveWorkflowInput { launchHubId: string; checklistKey?: string; checklistName?: string; }
export interface ElfSdkRunGoLiveWorkflowResult { checklistId: string; checklistKey: string; status: string; }

export interface LaunchHubSummary {
    id: string;
        hubKey: string;
    hubName: string;
    environment: string;
    status: string;
}

export interface CreateLaunchHubInput {
        hubKey?: string;
    hubName?: string;
    environment?: string;
}

export interface OrganizationProvisionSummary {
    id: string;
    hubName?: string;
        provisionKey: string;
    provisionName: string;
    provisionStatus: string;
    status: string;
}

export interface CreateOrganizationProvisionInput {
        launchHubId: string;
        provisionKey?: string;
    provisionName?: string;
    provisionStatus?: string;
}

export interface TenantProvisionSummary {
    id: string;
    hubName?: string;
        provisionKey: string;
    tenantRef: string;
    provisionStatus: string;
    status: string;
}

export interface CreateTenantProvisionInput {
        launchHubId: string;
        provisionKey?: string;
    tenantRef?: string;
    provisionStatus?: string;
}

export interface IndustryPackAssignmentSummary {
    id: string;
    hubName?: string;
        assignmentKey: string;
    packName: string;
    packType: string;
    status: string;
}

export interface CreateIndustryPackAssignmentInput {
        launchHubId: string;
        assignmentKey?: string;
    packName?: string;
    packType?: string;
}

export interface ModuleLicenseSummary {
    id: string;
    hubName?: string;
        licenseKey: string;
    moduleName: string;
    licenseStatus: string;
    status: string;
}

export interface CreateModuleLicenseInput {
        launchHubId: string;
        licenseKey?: string;
    moduleName?: string;
    licenseStatus?: string;
}

export interface WizardProfileSummary {
    id: string;
    hubName?: string;
        profileKey: string;
    profileName: string;
    profileType: string;
    status: string;
}

export interface CreateWizardProfileInput {
        launchHubId: string;
        profileKey?: string;
    profileName?: string;
    profileType?: string;
}

export interface WizardBrandingSummary {
    id: string;
    hubName?: string;
        brandingKey: string;
    brandingName: string;
    brandColor: string;
    status: string;
}

export interface CreateWizardBrandingInput {
        launchHubId: string;
        brandingKey?: string;
    brandingName?: string;
    brandColor?: string;
}

export interface WizardDepartmentSummary {
    id: string;
    hubName?: string;
        departmentKey: string;
    departmentName: string;
    departmentType: string;
    status: string;
}

export interface CreateWizardDepartmentInput {
        launchHubId: string;
        departmentKey?: string;
    departmentName?: string;
    departmentType?: string;
}

export interface WizardSettingSummary {
    id: string;
    hubName?: string;
        settingKey: string;
    settingName: string;
    settingValue: string;
    status: string;
}

export interface CreateWizardSettingInput {
        launchHubId: string;
        settingKey?: string;
    settingName?: string;
    settingValue?: string;
}

export interface ImportJobSummary {
    id: string;
    hubName?: string;
        jobKey: string;
    jobName: string;
    jobStatus: string;
    status: string;
}

export interface CreateImportJobInput {
        launchHubId: string;
        jobKey?: string;
    jobName?: string;
    jobStatus?: string;
}

export interface ImportValidationSummary {
    id: string;
    hubName?: string;
        validationKey: string;
    validationType: string;
    validationScore: number;
    status: string;
}

export interface CreateImportValidationInput {
        launchHubId: string;
        validationKey?: string;
    validationType?: string;
    validationScore?: number;
}

export interface ImportPreviewSummary {
    id: string;
    hubName?: string;
        previewKey: string;
    previewName: string;
    recordCount: number;
    status: string;
}

export interface CreateImportPreviewInput {
        launchHubId: string;
        previewKey?: string;
    previewName?: string;
    recordCount?: number;
}

export interface ImportHistorySummary {
    id: string;
    hubName?: string;
        historyKey: string;
    historyType: string;
    importedAt: string;
    status: string;
}

export interface CreateImportHistoryInput {
        launchHubId: string;
        historyKey?: string;
    historyType?: string;
    importedAt?: string;
}

export interface GoLiveChecklistSummary {
    id: string;
    hubName?: string;
        checklistKey: string;
    checklistName: string;
    completionScore: number;
    status: string;
}

export interface CreateGoLiveChecklistInput {
        launchHubId: string;
        checklistKey?: string;
    checklistName?: string;
    completionScore?: number;
}

export interface GoLiveScoreSummary {
    id: string;
    hubName?: string;
        scoreKey: string;
    scoreType: string;
    goLiveScore: number;
    status: string;
}

export interface CreateGoLiveScoreInput {
        launchHubId: string;
        scoreKey?: string;
    scoreType?: string;
    goLiveScore?: number;
}

export interface DeploymentStatusSummary {
    id: string;
    hubName?: string;
        statusKey: string;
    deploymentName: string;
    deploymentStatus: string;
    status: string;
}

export interface CreateDeploymentStatusInput {
        launchHubId: string;
        statusKey?: string;
    deploymentName?: string;
    deploymentStatus?: string;
}

export interface ReadinessValidationSummary {
    id: string;
    hubName?: string;
        validationKey: string;
    validationType: string;
    validationScore: number;
    status: string;
}

export interface CreateReadinessValidationInput {
        launchHubId: string;
        validationKey?: string;
    validationType?: string;
    validationScore?: number;
}

export interface CustomerHealthScoreSummary {
    id: string;
    hubName?: string;
        scoreKey: string;
    customerRef: string;
    healthScore: number;
    status: string;
}

export interface CreateCustomerHealthScoreInput {
        launchHubId: string;
        scoreKey?: string;
    customerRef?: string;
    healthScore?: number;
}

export interface PlatformAdoptionSummary {
    id: string;
    hubName?: string;
        adoptionKey: string;
    featureName: string;
    adoptionRate: number;
    status: string;
}

export interface CreatePlatformAdoptionInput {
        launchHubId: string;
        adoptionKey?: string;
    featureName?: string;
    adoptionRate?: number;
}

export interface FeatureUsageSummary {
    id: string;
    hubName?: string;
        usageKey: string;
    featureName: string;
    usageCount: number;
    status: string;
}

export interface CreateFeatureUsageInput {
        launchHubId: string;
        usageKey?: string;
    featureName?: string;
    usageCount?: number;
}

export interface RenewalTrackingSummary {
    id: string;
    hubName?: string;
        renewalKey: string;
    customerRef: string;
    renewalStatus: string;
    status: string;
}

export interface CreateRenewalTrackingInput {
        launchHubId: string;
        renewalKey?: string;
    customerRef?: string;
    renewalStatus?: string;
}

export interface SupportTicketSummary {
    id: string;
    hubName?: string;
        ticketKey: string;
    ticketTitle: string;
    ticketStatus: string;
    status: string;
}

export interface CreateSupportTicketInput {
        launchHubId: string;
        ticketKey?: string;
    ticketTitle?: string;
    ticketStatus?: string;
}

export interface KnowledgeBaseArticleSummary {
    id: string;
    hubName?: string;
        articleKey: string;
    articleTitle: string;
    articleCategory: string;
    status: string;
}

export interface CreateKnowledgeBaseArticleInput {
        launchHubId: string;
        articleKey?: string;
    articleTitle?: string;
    articleCategory?: string;
}

export interface IncidentTrackingSummary {
    id: string;
    hubName?: string;
        incidentKey: string;
    incidentTitle: string;
    incidentSeverity: string;
    status: string;
}

export interface CreateIncidentTrackingInput {
        launchHubId: string;
        incidentKey?: string;
    incidentTitle?: string;
    incidentSeverity?: string;
}

export interface CustomerRegistrySummary {
    id: string;
    hubName?: string;
        customerKey: string;
    customerName: string;
    customerTier: string;
    status: string;
}

export interface CreateCustomerRegistryInput {
        launchHubId: string;
        customerKey?: string;
    customerName?: string;
    customerTier?: string;
}

export interface SubscriptionRecordSummary {
    id: string;
    hubName?: string;
        subscriptionKey: string;
    planName: string;
    subscriptionStatus: string;
    status: string;
}

export interface CreateSubscriptionRecordInput {
        launchHubId: string;
        subscriptionKey?: string;
    planName?: string;
    subscriptionStatus?: string;
}

export interface LicenseManagementSummary {
    id: string;
    hubName?: string;
        licenseKey: string;
    licenseType: string;
    licenseStatus: string;
    status: string;
}

export interface CreateLicenseManagementInput {
        launchHubId: string;
        licenseKey?: string;
    licenseType?: string;
    licenseStatus?: string;
}

export interface LaunchMetricSummary {
    id: string;
    hubName?: string;
        metricsKey: string;
    platformHealthScore: number;
    overallLaunchScore: number;
    status: string;
}

export interface CreateLaunchMetricInput {
        metricsKey?: string;
    platformHealthScore?: number;
    overallLaunchScore?: number;
}

export interface LaunchHealthSummary {
    id: string;
    hubName?: string;
        healthKey: string;
    overallScore: number;
    disasterRecoveryMode: boolean;
    status: string;
}

export interface CreateLaunchHealthInput {
        healthKey?: string;
    overallScore?: number;
    disasterRecoveryMode?: boolean;
}

export interface MissionControlKpiSummary {
    id: string;
    hubName?: string;
        kpiKey: string;
    kpiName: string;
    kpiScore: number;
    status: string;
}

export interface CreateMissionControlKpiInput {
        launchHubId: string;
        kpiKey?: string;
    kpiName?: string;
    kpiScore?: number;
}

export interface LaunchFailureSummary {
    id: string;
    hubName?: string;
        failureKey: string;
    failureType: string;
    status: string;
}

export interface CreateLaunchFailureInput {
        launchHubId: string;
        failureKey?: string;
    failureType?: string;
}

