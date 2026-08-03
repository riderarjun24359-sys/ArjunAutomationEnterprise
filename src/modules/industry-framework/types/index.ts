export interface IfrDashboardStats {
    totalFrameworkHubs: number;
    activeFrameworkHubs: number;
    dashboardTemplateCount: number;
    workflowTemplateCount: number;
    industryProfileCount: number;
    openCompatibilityCount: number;
    openFailureCount: number;
    overallFrameworkScore: number;
    templateScore: number;
    profileScore: number;
    compatibilityScore: number;
    sdkScore: number;
    frameworkHealthScore: number;
    auditCount: number;
}

export interface IfrPipelineInfo {
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

export interface IfrSdkRegisterIndustryInput { frameworkHubId: string; registrationKey?: string; industryCode?: string; }
export interface IfrSdkRegisterIndustryResult { registrationId: string; registrationKey: string; status: string; }
export interface IfrSdkConfigureTemplateInput { frameworkHubId: string; templateKey?: string; templateName?: string; }
export interface IfrSdkConfigureTemplateResult { templateId: string; templateKey: string; status: string; }
export interface IfrSdkRunCompatibilityCheckInput { frameworkHubId: string; checkKey?: string; checkType?: string; }
export interface IfrSdkRunCompatibilityCheckResult { checkId: string; checkKey: string; status: string; }

export interface FrameworkHubSummary {
    id: string;
        hubKey: string;
    hubName: string;
    environment: string;
    status: string;
}

export interface CreateFrameworkHubInput {
        hubKey?: string;
    hubName?: string;
    environment?: string;
}

export interface IndustryRegistrationSummary {
    id: string;
    hubName?: string;
        registrationKey: string;
    industryCode: string;
    industryName: string;
    status: string;
}

export interface CreateIndustryRegistrationInput {
        frameworkHubId: string;
        registrationKey?: string;
    industryCode?: string;
    industryName?: string;
}

export interface IndustryMetadataSummary {
    id: string;
    hubName?: string;
        metadataKey: string;
    metadataType: string;
    metadataValue: string;
    status: string;
}

export interface CreateIndustryMetadataInput {
        frameworkHubId: string;
        metadataKey?: string;
    metadataType?: string;
    metadataValue?: string;
}

export interface IndustryVersionSummary {
    id: string;
    hubName?: string;
        versionKey: string;
    versionNumber: string;
    releaseChannel: string;
    status: string;
}

export interface CreateIndustryVersionInput {
        frameworkHubId: string;
        versionKey?: string;
    versionNumber?: string;
    releaseChannel?: string;
}

export interface IndustryDependencySummary {
    id: string;
    hubName?: string;
        dependencyKey: string;
    dependencyType: string;
    dependencyRef: string;
    status: string;
}

export interface CreateIndustryDependencyInput {
        frameworkHubId: string;
        dependencyKey?: string;
    dependencyType?: string;
    dependencyRef?: string;
}

export interface BusinessTypeSummary {
    id: string;
    hubName?: string;
        typeKey: string;
    typeName: string;
    typeCategory: string;
    status: string;
}

export interface CreateBusinessTypeInput {
        frameworkHubId: string;
        typeKey?: string;
    typeName?: string;
    typeCategory?: string;
}

export interface BusinessSizeSummary {
    id: string;
    hubName?: string;
        sizeKey: string;
    sizeLabel: string;
    employeeRange: string;
    status: string;
}

export interface CreateBusinessSizeInput {
        frameworkHubId: string;
        sizeKey?: string;
    sizeLabel?: string;
    employeeRange?: string;
}

export interface OperatingModelSummary {
    id: string;
    hubName?: string;
        modelKey: string;
    modelName: string;
    modelType: string;
    status: string;
}

export interface CreateOperatingModelInput {
        frameworkHubId: string;
        modelKey?: string;
    modelName?: string;
    modelType?: string;
}

export interface IndustryProfileSummary {
    id: string;
    hubName?: string;
        profileKey: string;
    profileName: string;
    profileScore: number;
    status: string;
}

export interface CreateIndustryProfileInput {
        frameworkHubId: string;
        profileKey?: string;
    profileName?: string;
    profileScore?: number;
}

export interface DashboardTemplateSummary {
    id: string;
    hubName?: string;
        templateKey: string;
    templateName: string;
    templateVersion: string;
    status: string;
}

export interface CreateDashboardTemplateInput {
        frameworkHubId: string;
        templateKey?: string;
    templateName?: string;
    templateVersion?: string;
}

export interface WorkflowTemplateSummary {
    id: string;
    hubName?: string;
        templateKey: string;
    templateName: string;
    workflowType: string;
    status: string;
}

export interface CreateWorkflowTemplateInput {
        frameworkHubId: string;
        templateKey?: string;
    templateName?: string;
    workflowType?: string;
}

export interface RoleTemplateSummary {
    id: string;
    hubName?: string;
        templateKey: string;
    roleName: string;
    permissionsCount: number;
    status: string;
}

export interface CreateRoleTemplateInput {
        frameworkHubId: string;
        templateKey?: string;
    roleName?: string;
    permissionsCount?: number;
}

export interface ReportTemplateSummary {
    id: string;
    hubName?: string;
        templateKey: string;
    reportName: string;
    reportFormat: string;
    status: string;
}

export interface CreateReportTemplateInput {
        frameworkHubId: string;
        templateKey?: string;
    reportName?: string;
    reportFormat?: string;
}

export interface DynamicConfigurationSummary {
    id: string;
    hubName?: string;
        configKey: string;
    configType: string;
    configValue: string;
    status: string;
}

export interface CreateDynamicConfigurationInput {
        frameworkHubId: string;
        configKey?: string;
    configType?: string;
    configValue?: string;
}

export interface FeatureConfigurationSummary {
    id: string;
    hubName?: string;
        featureKey: string;
    featureName: string;
    enabled: boolean;
    status: string;
}

export interface CreateFeatureConfigurationInput {
        frameworkHubId: string;
        featureKey?: string;
    featureName?: string;
    enabled?: boolean;
}

export interface BusinessRuleSummary {
    id: string;
    hubName?: string;
        ruleKey: string;
    ruleName: string;
    ruleType: string;
    status: string;
}

export interface CreateBusinessRuleInput {
        frameworkHubId: string;
        ruleKey?: string;
    ruleName?: string;
    ruleType?: string;
}

export interface ValidationRuleSummary {
    id: string;
    hubName?: string;
        ruleKey: string;
    ruleName: string;
    validationScore: number;
    status: string;
}

export interface CreateValidationRuleInput {
        frameworkHubId: string;
        ruleKey?: string;
    ruleName?: string;
    validationScore?: number;
}

export interface IndustryContextSummary {
    id: string;
    hubName?: string;
        contextKey: string;
    contextType: string;
    contextPayload: string;
    status: string;
}

export interface CreateIndustryContextInput {
        frameworkHubId: string;
        contextKey?: string;
    contextType?: string;
    contextPayload?: string;
}

export interface AiContextSummary {
    id: string;
    hubName?: string;
        contextKey: string;
    contextType: string;
    tokenCount: number;
    status: string;
}

export interface CreateAiContextInput {
        frameworkHubId: string;
        contextKey?: string;
    contextType?: string;
    tokenCount?: number;
}

export interface TerminologyEntrySummary {
    id: string;
    hubName?: string;
        termKey: string;
    termLabel: string;
    termDefinition: string;
    status: string;
}

export interface CreateTerminologyEntryInput {
        frameworkHubId: string;
        termKey?: string;
    termLabel?: string;
    termDefinition?: string;
}

export interface DemoProfileSummary {
    id: string;
    hubName?: string;
        profileKey: string;
    profileName: string;
    demoDurationDays: number;
    status: string;
}

export interface CreateDemoProfileInput {
        frameworkHubId: string;
        profileKey?: string;
    profileName?: string;
    demoDurationDays?: number;
}

export interface ProductionProfileSummary {
    id: string;
    hubName?: string;
        profileKey: string;
    profileName: string;
    deploymentTarget: string;
    status: string;
}

export interface CreateProductionProfileInput {
        frameworkHubId: string;
        profileKey?: string;
    profileName?: string;
    deploymentTarget?: string;
}

export interface EnterpriseProfileSummary {
    id: string;
    hubName?: string;
        profileKey: string;
    profileName: string;
    complianceTier: string;
    status: string;
}

export interface CreateEnterpriseProfileInput {
        frameworkHubId: string;
        profileKey?: string;
    profileName?: string;
    complianceTier?: string;
}

export interface SharedApiSummary {
    id: string;
    hubName?: string;
        apiKey: string;
    apiName: string;
    apiVersion: string;
    status: string;
}

export interface CreateSharedApiInput {
        frameworkHubId: string;
        apiKey?: string;
    apiName?: string;
    apiVersion?: string;
}

export interface ContextApiSummary {
    id: string;
    hubName?: string;
        apiKey: string;
    apiName: string;
    contextType: string;
    status: string;
}

export interface CreateContextApiInput {
        frameworkHubId: string;
        apiKey?: string;
    apiName?: string;
    contextType?: string;
}

export interface ConfigurationApiSummary {
    id: string;
    hubName?: string;
        apiKey: string;
    apiName: string;
    configScope: string;
    status: string;
}

export interface CreateConfigurationApiInput {
        frameworkHubId: string;
        apiKey?: string;
    apiName?: string;
    configScope?: string;
}

export interface ExtensionPointSummary {
    id: string;
    hubName?: string;
        extensionKey: string;
    extensionName: string;
    hookType: string;
    status: string;
}

export interface CreateExtensionPointInput {
        frameworkHubId: string;
        extensionKey?: string;
    extensionName?: string;
    hookType?: string;
}

export interface FrameworkMetricSummary {
    id: string;
    hubName?: string;
        metricsKey: string;
    templateScore: number;
    overallFrameworkScore: number;
    status: string;
}

export interface CreateFrameworkMetricInput {
        metricsKey?: string;
    templateScore?: number;
    overallFrameworkScore?: number;
}

export interface FrameworkHealthSummary {
    id: string;
    hubName?: string;
        healthKey: string;
    overallScore: number;
    disasterRecoveryMode: boolean;
    status: string;
}

export interface CreateFrameworkHealthInput {
        healthKey?: string;
    overallScore?: number;
    disasterRecoveryMode?: boolean;
}

export interface CompatibilityCheckSummary {
    id: string;
    hubName?: string;
        checkKey: string;
    checkType: string;
    checkScore: number;
    status: string;
}

export interface CreateCompatibilityCheckInput {
        frameworkHubId: string;
        checkKey?: string;
    checkType?: string;
    checkScore?: number;
}

export interface FrameworkFailureSummary {
    id: string;
    hubName?: string;
        failureKey: string;
    failureType: string;
    status: string;
}

export interface CreateFrameworkFailureInput {
        frameworkHubId: string;
        failureKey?: string;
    failureType?: string;
}

