import { z } from "zod";

export const frameworkHubsFormSchema = z.object({
    hubKey: z.string().min(1).optional(),
    hubName: z.string().min(1).optional(),
    environment: z.string().min(1).optional(),
});

export type frameworkHubsFormValues = z.infer<typeof frameworkHubsFormSchema>;

export const industryRegistrationsFormSchema = z.object({
    frameworkHubId: z.string().min(1),
    registrationKey: z.string().min(1).optional(),
    industryCode: z.string().min(1).optional(),
    industryName: z.string().min(1).optional(),
});

export type industryRegistrationsFormValues = z.infer<typeof industryRegistrationsFormSchema>;

export const industryMetadataFormSchema = z.object({
    frameworkHubId: z.string().min(1),
    metadataKey: z.string().min(1).optional(),
    metadataType: z.string().min(1).optional(),
    metadataValue: z.string().min(1).optional(),
});

export type industryMetadataFormValues = z.infer<typeof industryMetadataFormSchema>;

export const industryVersionsFormSchema = z.object({
    frameworkHubId: z.string().min(1),
    versionKey: z.string().min(1).optional(),
    versionNumber: z.string().min(1).optional(),
    releaseChannel: z.string().min(1).optional(),
});

export type industryVersionsFormValues = z.infer<typeof industryVersionsFormSchema>;

export const industryDependenciesFormSchema = z.object({
    frameworkHubId: z.string().min(1),
    dependencyKey: z.string().min(1).optional(),
    dependencyType: z.string().min(1).optional(),
    dependencyRef: z.string().min(1).optional(),
});

export type industryDependenciesFormValues = z.infer<typeof industryDependenciesFormSchema>;

export const businessTypesFormSchema = z.object({
    frameworkHubId: z.string().min(1),
    typeKey: z.string().min(1).optional(),
    typeName: z.string().min(1).optional(),
    typeCategory: z.string().min(1).optional(),
});

export type businessTypesFormValues = z.infer<typeof businessTypesFormSchema>;

export const businessSizesFormSchema = z.object({
    frameworkHubId: z.string().min(1),
    sizeKey: z.string().min(1).optional(),
    sizeLabel: z.string().min(1).optional(),
    employeeRange: z.string().min(1).optional(),
});

export type businessSizesFormValues = z.infer<typeof businessSizesFormSchema>;

export const operatingModelsFormSchema = z.object({
    frameworkHubId: z.string().min(1),
    modelKey: z.string().min(1).optional(),
    modelName: z.string().min(1).optional(),
    modelType: z.string().min(1).optional(),
});

export type operatingModelsFormValues = z.infer<typeof operatingModelsFormSchema>;

export const industryProfilesFormSchema = z.object({
    frameworkHubId: z.string().min(1),
    profileKey: z.string().min(1).optional(),
    profileName: z.string().min(1).optional(),
    profileScore: z.number().optional(),
});

export type industryProfilesFormValues = z.infer<typeof industryProfilesFormSchema>;

export const dashboardTemplatesFormSchema = z.object({
    frameworkHubId: z.string().min(1),
    templateKey: z.string().min(1).optional(),
    templateName: z.string().min(1).optional(),
    templateVersion: z.string().min(1).optional(),
});

export type dashboardTemplatesFormValues = z.infer<typeof dashboardTemplatesFormSchema>;

export const workflowTemplatesFormSchema = z.object({
    frameworkHubId: z.string().min(1),
    templateKey: z.string().min(1).optional(),
    templateName: z.string().min(1).optional(),
    workflowType: z.string().min(1).optional(),
});

export type workflowTemplatesFormValues = z.infer<typeof workflowTemplatesFormSchema>;

export const roleTemplatesFormSchema = z.object({
    frameworkHubId: z.string().min(1),
    templateKey: z.string().min(1).optional(),
    roleName: z.string().min(1).optional(),
    permissionsCount: z.number().optional(),
});

export type roleTemplatesFormValues = z.infer<typeof roleTemplatesFormSchema>;

export const reportTemplatesFormSchema = z.object({
    frameworkHubId: z.string().min(1),
    templateKey: z.string().min(1).optional(),
    reportName: z.string().min(1).optional(),
    reportFormat: z.string().min(1).optional(),
});

export type reportTemplatesFormValues = z.infer<typeof reportTemplatesFormSchema>;

export const dynamicConfigurationsFormSchema = z.object({
    frameworkHubId: z.string().min(1),
    configKey: z.string().min(1).optional(),
    configType: z.string().min(1).optional(),
    configValue: z.string().min(1).optional(),
});

export type dynamicConfigurationsFormValues = z.infer<typeof dynamicConfigurationsFormSchema>;

export const featureConfigurationsFormSchema = z.object({
    frameworkHubId: z.string().min(1),
    featureKey: z.string().min(1).optional(),
    featureName: z.string().min(1).optional(),
    enabled: z.boolean().optional(),
});

export type featureConfigurationsFormValues = z.infer<typeof featureConfigurationsFormSchema>;

export const businessRulesFormSchema = z.object({
    frameworkHubId: z.string().min(1),
    ruleKey: z.string().min(1).optional(),
    ruleName: z.string().min(1).optional(),
    ruleType: z.string().min(1).optional(),
});

export type businessRulesFormValues = z.infer<typeof businessRulesFormSchema>;

export const validationRulesFormSchema = z.object({
    frameworkHubId: z.string().min(1),
    ruleKey: z.string().min(1).optional(),
    ruleName: z.string().min(1).optional(),
    validationScore: z.number().optional(),
});

export type validationRulesFormValues = z.infer<typeof validationRulesFormSchema>;

export const industryContextsFormSchema = z.object({
    frameworkHubId: z.string().min(1),
    contextKey: z.string().min(1).optional(),
    contextType: z.string().min(1).optional(),
    contextPayload: z.string().min(1).optional(),
});

export type industryContextsFormValues = z.infer<typeof industryContextsFormSchema>;

export const aiContextsFormSchema = z.object({
    frameworkHubId: z.string().min(1),
    contextKey: z.string().min(1).optional(),
    contextType: z.string().min(1).optional(),
    tokenCount: z.number().optional(),
});

export type aiContextsFormValues = z.infer<typeof aiContextsFormSchema>;

export const terminologyEntriesFormSchema = z.object({
    frameworkHubId: z.string().min(1),
    termKey: z.string().min(1).optional(),
    termLabel: z.string().min(1).optional(),
    termDefinition: z.string().min(1).optional(),
});

export type terminologyEntriesFormValues = z.infer<typeof terminologyEntriesFormSchema>;

export const demoProfilesFormSchema = z.object({
    frameworkHubId: z.string().min(1),
    profileKey: z.string().min(1).optional(),
    profileName: z.string().min(1).optional(),
    demoDurationDays: z.number().optional(),
});

export type demoProfilesFormValues = z.infer<typeof demoProfilesFormSchema>;

export const productionProfilesFormSchema = z.object({
    frameworkHubId: z.string().min(1),
    profileKey: z.string().min(1).optional(),
    profileName: z.string().min(1).optional(),
    deploymentTarget: z.string().min(1).optional(),
});

export type productionProfilesFormValues = z.infer<typeof productionProfilesFormSchema>;

export const enterpriseProfilesFormSchema = z.object({
    frameworkHubId: z.string().min(1),
    profileKey: z.string().min(1).optional(),
    profileName: z.string().min(1).optional(),
    complianceTier: z.string().min(1).optional(),
});

export type enterpriseProfilesFormValues = z.infer<typeof enterpriseProfilesFormSchema>;

export const sharedApisFormSchema = z.object({
    frameworkHubId: z.string().min(1),
    apiKey: z.string().min(1).optional(),
    apiName: z.string().min(1).optional(),
    apiVersion: z.string().min(1).optional(),
});

export type sharedApisFormValues = z.infer<typeof sharedApisFormSchema>;

export const contextApisFormSchema = z.object({
    frameworkHubId: z.string().min(1),
    apiKey: z.string().min(1).optional(),
    apiName: z.string().min(1).optional(),
    contextType: z.string().min(1).optional(),
});

export type contextApisFormValues = z.infer<typeof contextApisFormSchema>;

export const configurationApisFormSchema = z.object({
    frameworkHubId: z.string().min(1),
    apiKey: z.string().min(1).optional(),
    apiName: z.string().min(1).optional(),
    configScope: z.string().min(1).optional(),
});

export type configurationApisFormValues = z.infer<typeof configurationApisFormSchema>;

export const extensionPointsFormSchema = z.object({
    frameworkHubId: z.string().min(1),
    extensionKey: z.string().min(1).optional(),
    extensionName: z.string().min(1).optional(),
    hookType: z.string().min(1).optional(),
});

export type extensionPointsFormValues = z.infer<typeof extensionPointsFormSchema>;

export const frameworkMetricsFormSchema = z.object({
    metricsKey: z.string().min(1).optional(),
    templateScore: z.number().optional(),
    overallFrameworkScore: z.number().optional(),
});

export type frameworkMetricsFormValues = z.infer<typeof frameworkMetricsFormSchema>;

export const frameworkHealthFormSchema = z.object({
    healthKey: z.string().min(1).optional(),
    overallScore: z.number().optional(),
    disasterRecoveryMode: z.boolean().optional(),
});

export type frameworkHealthFormValues = z.infer<typeof frameworkHealthFormSchema>;

export const compatibilityChecksFormSchema = z.object({
    frameworkHubId: z.string().min(1),
    checkKey: z.string().min(1).optional(),
    checkType: z.string().min(1).optional(),
    checkScore: z.number().optional(),
});

export type compatibilityChecksFormValues = z.infer<typeof compatibilityChecksFormSchema>;

export const frameworkFailuresFormSchema = z.object({
    frameworkHubId: z.string().min(1),
    failureKey: z.string().min(1).optional(),
    failureType: z.string().min(1).optional(),
});

export type frameworkFailuresFormValues = z.infer<typeof frameworkFailuresFormSchema>;
