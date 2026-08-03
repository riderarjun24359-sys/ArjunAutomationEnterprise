import type { DbIfrFrameworkHub,
    DbIfrIndustryRegistration,
    DbIfrIndustryMetadata,
    DbIfrIndustryVersion,
    DbIfrIndustryDependency,
    DbIfrBusinessType,
    DbIfrBusinessSize,
    DbIfrOperatingModel,
    DbIfrIndustryProfile,
    DbIfrDashboardTemplate,
    DbIfrWorkflowTemplate,
    DbIfrRoleTemplate,
    DbIfrReportTemplate,
    DbIfrDynamicConfiguration,
    DbIfrFeatureConfiguration,
    DbIfrBusinessRule,
    DbIfrValidationRule,
    DbIfrIndustryContext,
    DbIfrAiContext,
    DbIfrTerminologyEntry,
    DbIfrDemoProfile,
    DbIfrProductionProfile,
    DbIfrEnterpriseProfile,
    DbIfrSharedApi,
    DbIfrContextApi,
    DbIfrConfigurationApi,
    DbIfrExtensionPoint,
    DbIfrFrameworkMetric,
    DbIfrFrameworkHealth,
    DbIfrCompatibilityCheck,
    DbIfrFrameworkFailure,
    DbIfrAuditLog } from "@/src/modules/database/types/platform";
import type { CreateFrameworkHubInput,
    FrameworkHubSummary,
    CreateIndustryRegistrationInput,
    IndustryRegistrationSummary,
    CreateIndustryMetadataInput,
    IndustryMetadataSummary,
    CreateIndustryVersionInput,
    IndustryVersionSummary,
    CreateIndustryDependencyInput,
    IndustryDependencySummary,
    CreateBusinessTypeInput,
    BusinessTypeSummary,
    CreateBusinessSizeInput,
    BusinessSizeSummary,
    CreateOperatingModelInput,
    OperatingModelSummary,
    CreateIndustryProfileInput,
    IndustryProfileSummary,
    CreateDashboardTemplateInput,
    DashboardTemplateSummary,
    CreateWorkflowTemplateInput,
    WorkflowTemplateSummary,
    CreateRoleTemplateInput,
    RoleTemplateSummary,
    CreateReportTemplateInput,
    ReportTemplateSummary,
    CreateDynamicConfigurationInput,
    DynamicConfigurationSummary,
    CreateFeatureConfigurationInput,
    FeatureConfigurationSummary,
    CreateBusinessRuleInput,
    BusinessRuleSummary,
    CreateValidationRuleInput,
    ValidationRuleSummary,
    CreateIndustryContextInput,
    IndustryContextSummary,
    CreateAiContextInput,
    AiContextSummary,
    CreateTerminologyEntryInput,
    TerminologyEntrySummary,
    CreateDemoProfileInput,
    DemoProfileSummary,
    CreateProductionProfileInput,
    ProductionProfileSummary,
    CreateEnterpriseProfileInput,
    EnterpriseProfileSummary,
    CreateSharedApiInput,
    SharedApiSummary,
    CreateContextApiInput,
    ContextApiSummary,
    CreateConfigurationApiInput,
    ConfigurationApiSummary,
    CreateExtensionPointInput,
    ExtensionPointSummary,
    CreateFrameworkMetricInput,
    FrameworkMetricSummary,
    CreateFrameworkHealthInput,
    FrameworkHealthSummary,
    CreateCompatibilityCheckInput,
    CompatibilityCheckSummary,
    CreateFrameworkFailureInput,
    FrameworkFailureSummary,
    IfrDashboardStats,
    IfrPipelineInfo,
    AuditEntry } from "@/src/modules/industry-framework/types";

export function buildFrameworkHubLookupMaps(hubs: DbIfrFrameworkHub[]) {
    const hubNameById = new Map(hubs.map((h) => [h.id, h.hub_name]));
    return { hubNameById };
}

export function buildIfrPipelineInfo(): IfrPipelineInfo {
    const stages = [
        { key: "register", label: "Register" },
        { key: "profile", label: "Profile" },
        { key: "template", label: "Template" },
        { key: "framework", label: "Framework" },
    ];
    return { stages, currentStage: "template", nextStage: "framework", previousStage: "profile" };
}

export function buildIfrAuditPayload(organizationId: string, entityType: string, action: string, summary: string, entityId?: string) {
    return { organization_id: organizationId, entity_type: entityType, action, summary, entity_id: entityId ?? null, metadata: {}, security_level: "standard" };
}

export function mapAuditEntry(record: DbIfrAuditLog): AuditEntry {
    return { id: record.id, entityType: record.entity_type, entityId: record.entity_id, action: record.action, summary: record.summary, securityLevel: record.security_level, createdAt: record.created_at };
}

export function mapFrameworkHubSummary(record: DbIfrFrameworkHub): FrameworkHubSummary {
    return {
        id: record.id,
        hubKey: record.hub_key as string,
        hubName: record.hub_name as string,
        environment: record.environment as string,
        status: record.status,
    };
}

export function buildFrameworkHubPayload(organizationId: string, input: CreateFrameworkHubInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_key: input.hubKey ?? '',
        hub_name: input.hubName ?? '',
        environment: input.environment ?? '',
        status: "active",
    };
}

export function mapIndustryRegistrationSummary(record: DbIfrIndustryRegistration, maps?: { hubNameById: Map<string, string> }): IndustryRegistrationSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        registrationKey: record.registration_key as string,
        industryCode: record.industry_code as string,
        industryName: record.industry_name as string,
        status: record.status,
    };
}

export function buildIndustryRegistrationPayload(organizationId: string, input: CreateIndustryRegistrationInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.frameworkHubId,
        registration_key: input.registrationKey ?? '',
        industry_code: input.industryCode ?? '',
        industry_name: input.industryName ?? '',
        status: "active",
    };
}

export function mapIndustryMetadataSummary(record: DbIfrIndustryMetadata, maps?: { hubNameById: Map<string, string> }): IndustryMetadataSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        metadataKey: record.metadata_key as string,
        metadataType: record.metadata_type as string,
        metadataValue: JSON.stringify(record.metadata_value ?? {}),
        status: record.status,
    };
}

export function buildIndustryMetadataPayload(organizationId: string, input: CreateIndustryMetadataInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.frameworkHubId,
        metadata_key: input.metadataKey ?? '',
        metadata_type: input.metadataType ?? '',
        metadata_value: input.metadataValue ?? '',
        status: "active",
    };
}

export function mapIndustryVersionSummary(record: DbIfrIndustryVersion, maps?: { hubNameById: Map<string, string> }): IndustryVersionSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        versionKey: record.version_key as string,
        versionNumber: record.version_number as string,
        releaseChannel: record.release_channel as string,
        status: record.status,
    };
}

export function buildIndustryVersionPayload(organizationId: string, input: CreateIndustryVersionInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.frameworkHubId,
        version_key: input.versionKey ?? '',
        version_number: input.versionNumber ?? '',
        release_channel: input.releaseChannel ?? '',
        status: "active",
    };
}

export function mapIndustryDependencySummary(record: DbIfrIndustryDependency, maps?: { hubNameById: Map<string, string> }): IndustryDependencySummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        dependencyKey: record.dependency_key as string,
        dependencyType: record.dependency_type as string,
        dependencyRef: record.dependency_ref as string,
        status: record.status,
    };
}

export function buildIndustryDependencyPayload(organizationId: string, input: CreateIndustryDependencyInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.frameworkHubId,
        dependency_key: input.dependencyKey ?? '',
        dependency_type: input.dependencyType ?? '',
        dependency_ref: input.dependencyRef ?? '',
        status: "active",
    };
}

export function mapBusinessTypeSummary(record: DbIfrBusinessType, maps?: { hubNameById: Map<string, string> }): BusinessTypeSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        typeKey: record.type_key as string,
        typeName: record.type_name as string,
        typeCategory: record.type_category as string,
        status: record.status,
    };
}

export function buildBusinessTypePayload(organizationId: string, input: CreateBusinessTypeInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.frameworkHubId,
        type_key: input.typeKey ?? '',
        type_name: input.typeName ?? '',
        type_category: input.typeCategory ?? '',
        status: "active",
    };
}

export function mapBusinessSizeSummary(record: DbIfrBusinessSize, maps?: { hubNameById: Map<string, string> }): BusinessSizeSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        sizeKey: record.size_key as string,
        sizeLabel: record.size_label as string,
        employeeRange: record.employee_range as string,
        status: record.status,
    };
}

export function buildBusinessSizePayload(organizationId: string, input: CreateBusinessSizeInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.frameworkHubId,
        size_key: input.sizeKey ?? '',
        size_label: input.sizeLabel ?? '',
        employee_range: input.employeeRange ?? '',
        status: "active",
    };
}

export function mapOperatingModelSummary(record: DbIfrOperatingModel, maps?: { hubNameById: Map<string, string> }): OperatingModelSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        modelKey: record.model_key as string,
        modelName: record.model_name as string,
        modelType: record.model_type as string,
        status: record.status,
    };
}

export function buildOperatingModelPayload(organizationId: string, input: CreateOperatingModelInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.frameworkHubId,
        model_key: input.modelKey ?? '',
        model_name: input.modelName ?? '',
        model_type: input.modelType ?? '',
        status: "active",
    };
}

export function mapIndustryProfileSummary(record: DbIfrIndustryProfile, maps?: { hubNameById: Map<string, string> }): IndustryProfileSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        profileKey: record.profile_key as string,
        profileName: record.profile_name as string,
        profileScore: record.profile_score as number,
        status: record.status,
    };
}

export function buildIndustryProfilePayload(organizationId: string, input: CreateIndustryProfileInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.frameworkHubId,
        profile_key: input.profileKey ?? '',
        profile_name: input.profileName ?? '',
        profile_score: input.profileScore ?? 0,
        status: "active",
    };
}

export function mapDashboardTemplateSummary(record: DbIfrDashboardTemplate, maps?: { hubNameById: Map<string, string> }): DashboardTemplateSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        templateKey: record.template_key as string,
        templateName: record.template_name as string,
        templateVersion: record.template_version as string,
        status: record.status,
    };
}

export function buildDashboardTemplatePayload(organizationId: string, input: CreateDashboardTemplateInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.frameworkHubId,
        template_key: input.templateKey ?? '',
        template_name: input.templateName ?? '',
        template_version: input.templateVersion ?? '',
        status: "active",
    };
}

export function mapWorkflowTemplateSummary(record: DbIfrWorkflowTemplate, maps?: { hubNameById: Map<string, string> }): WorkflowTemplateSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        templateKey: record.template_key as string,
        templateName: record.template_name as string,
        workflowType: record.workflow_type as string,
        status: record.status,
    };
}

export function buildWorkflowTemplatePayload(organizationId: string, input: CreateWorkflowTemplateInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.frameworkHubId,
        template_key: input.templateKey ?? '',
        template_name: input.templateName ?? '',
        workflow_type: input.workflowType ?? '',
        status: "active",
    };
}

export function mapRoleTemplateSummary(record: DbIfrRoleTemplate, maps?: { hubNameById: Map<string, string> }): RoleTemplateSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        templateKey: record.template_key as string,
        roleName: record.role_name as string,
        permissionsCount: record.permissions_count as number,
        status: record.status,
    };
}

export function buildRoleTemplatePayload(organizationId: string, input: CreateRoleTemplateInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.frameworkHubId,
        template_key: input.templateKey ?? '',
        role_name: input.roleName ?? '',
        permissions_count: input.permissionsCount ?? 0,
        status: "active",
    };
}

export function mapReportTemplateSummary(record: DbIfrReportTemplate, maps?: { hubNameById: Map<string, string> }): ReportTemplateSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        templateKey: record.template_key as string,
        reportName: record.report_name as string,
        reportFormat: record.report_format as string,
        status: record.status,
    };
}

export function buildReportTemplatePayload(organizationId: string, input: CreateReportTemplateInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.frameworkHubId,
        template_key: input.templateKey ?? '',
        report_name: input.reportName ?? '',
        report_format: input.reportFormat ?? '',
        status: "active",
    };
}

export function mapDynamicConfigurationSummary(record: DbIfrDynamicConfiguration, maps?: { hubNameById: Map<string, string> }): DynamicConfigurationSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        configKey: record.config_key as string,
        configType: record.config_type as string,
        configValue: JSON.stringify(record.config_value ?? {}),
        status: record.status,
    };
}

export function buildDynamicConfigurationPayload(organizationId: string, input: CreateDynamicConfigurationInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.frameworkHubId,
        config_key: input.configKey ?? '',
        config_type: input.configType ?? '',
        config_value: input.configValue ?? '',
        status: "active",
    };
}

export function mapFeatureConfigurationSummary(record: DbIfrFeatureConfiguration, maps?: { hubNameById: Map<string, string> }): FeatureConfigurationSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        featureKey: record.feature_key as string,
        featureName: record.feature_name as string,
        enabled: record.enabled as boolean,
        status: record.status,
    };
}

export function buildFeatureConfigurationPayload(organizationId: string, input: CreateFeatureConfigurationInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.frameworkHubId,
        feature_key: input.featureKey ?? '',
        feature_name: input.featureName ?? '',
        enabled: input.enabled ?? false,
        status: "active",
    };
}

export function mapBusinessRuleSummary(record: DbIfrBusinessRule, maps?: { hubNameById: Map<string, string> }): BusinessRuleSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        ruleKey: record.rule_key as string,
        ruleName: record.rule_name as string,
        ruleType: record.rule_type as string,
        status: record.status,
    };
}

export function buildBusinessRulePayload(organizationId: string, input: CreateBusinessRuleInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.frameworkHubId,
        rule_key: input.ruleKey ?? '',
        rule_name: input.ruleName ?? '',
        rule_type: input.ruleType ?? '',
        status: "active",
    };
}

export function mapValidationRuleSummary(record: DbIfrValidationRule, maps?: { hubNameById: Map<string, string> }): ValidationRuleSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        ruleKey: record.rule_key as string,
        ruleName: record.rule_name as string,
        validationScore: record.validation_score as number,
        status: record.status,
    };
}

export function buildValidationRulePayload(organizationId: string, input: CreateValidationRuleInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.frameworkHubId,
        rule_key: input.ruleKey ?? '',
        rule_name: input.ruleName ?? '',
        validation_score: input.validationScore ?? 0,
        status: "active",
    };
}

export function mapIndustryContextSummary(record: DbIfrIndustryContext, maps?: { hubNameById: Map<string, string> }): IndustryContextSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        contextKey: record.context_key as string,
        contextType: record.context_type as string,
        contextPayload: JSON.stringify(record.context_payload ?? {}),
        status: record.status,
    };
}

export function buildIndustryContextPayload(organizationId: string, input: CreateIndustryContextInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.frameworkHubId,
        context_key: input.contextKey ?? '',
        context_type: input.contextType ?? '',
        context_payload: input.contextPayload ?? '',
        status: "active",
    };
}

export function mapAiContextSummary(record: DbIfrAiContext, maps?: { hubNameById: Map<string, string> }): AiContextSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        contextKey: record.context_key as string,
        contextType: record.context_type as string,
        tokenCount: record.token_count as number,
        status: record.status,
    };
}

export function buildAiContextPayload(organizationId: string, input: CreateAiContextInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.frameworkHubId,
        context_key: input.contextKey ?? '',
        context_type: input.contextType ?? '',
        token_count: input.tokenCount ?? 0,
        status: "active",
    };
}

export function mapTerminologyEntrySummary(record: DbIfrTerminologyEntry, maps?: { hubNameById: Map<string, string> }): TerminologyEntrySummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        termKey: record.term_key as string,
        termLabel: record.term_label as string,
        termDefinition: record.term_definition as string,
        status: record.status,
    };
}

export function buildTerminologyEntryPayload(organizationId: string, input: CreateTerminologyEntryInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.frameworkHubId,
        term_key: input.termKey ?? '',
        term_label: input.termLabel ?? '',
        term_definition: input.termDefinition ?? '',
        status: "active",
    };
}

export function mapDemoProfileSummary(record: DbIfrDemoProfile, maps?: { hubNameById: Map<string, string> }): DemoProfileSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        profileKey: record.profile_key as string,
        profileName: record.profile_name as string,
        demoDurationDays: record.demo_duration_days as number,
        status: record.status,
    };
}

export function buildDemoProfilePayload(organizationId: string, input: CreateDemoProfileInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.frameworkHubId,
        profile_key: input.profileKey ?? '',
        profile_name: input.profileName ?? '',
        demo_duration_days: input.demoDurationDays ?? 0,
        status: "active",
    };
}

export function mapProductionProfileSummary(record: DbIfrProductionProfile, maps?: { hubNameById: Map<string, string> }): ProductionProfileSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        profileKey: record.profile_key as string,
        profileName: record.profile_name as string,
        deploymentTarget: record.deployment_target as string,
        status: record.status,
    };
}

export function buildProductionProfilePayload(organizationId: string, input: CreateProductionProfileInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.frameworkHubId,
        profile_key: input.profileKey ?? '',
        profile_name: input.profileName ?? '',
        deployment_target: input.deploymentTarget ?? '',
        status: "active",
    };
}

export function mapEnterpriseProfileSummary(record: DbIfrEnterpriseProfile, maps?: { hubNameById: Map<string, string> }): EnterpriseProfileSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        profileKey: record.profile_key as string,
        profileName: record.profile_name as string,
        complianceTier: record.compliance_tier as string,
        status: record.status,
    };
}

export function buildEnterpriseProfilePayload(organizationId: string, input: CreateEnterpriseProfileInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.frameworkHubId,
        profile_key: input.profileKey ?? '',
        profile_name: input.profileName ?? '',
        compliance_tier: input.complianceTier ?? '',
        status: "active",
    };
}

export function mapSharedApiSummary(record: DbIfrSharedApi, maps?: { hubNameById: Map<string, string> }): SharedApiSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        apiKey: record.api_key as string,
        apiName: record.api_name as string,
        apiVersion: record.api_version as string,
        status: record.status,
    };
}

export function buildSharedApiPayload(organizationId: string, input: CreateSharedApiInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.frameworkHubId,
        api_key: input.apiKey ?? '',
        api_name: input.apiName ?? '',
        api_version: input.apiVersion ?? '',
        status: "active",
    };
}

export function mapContextApiSummary(record: DbIfrContextApi, maps?: { hubNameById: Map<string, string> }): ContextApiSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        apiKey: record.api_key as string,
        apiName: record.api_name as string,
        contextType: record.context_type as string,
        status: record.status,
    };
}

export function buildContextApiPayload(organizationId: string, input: CreateContextApiInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.frameworkHubId,
        api_key: input.apiKey ?? '',
        api_name: input.apiName ?? '',
        context_type: input.contextType ?? '',
        status: "active",
    };
}

export function mapConfigurationApiSummary(record: DbIfrConfigurationApi, maps?: { hubNameById: Map<string, string> }): ConfigurationApiSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        apiKey: record.api_key as string,
        apiName: record.api_name as string,
        configScope: record.config_scope as string,
        status: record.status,
    };
}

export function buildConfigurationApiPayload(organizationId: string, input: CreateConfigurationApiInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.frameworkHubId,
        api_key: input.apiKey ?? '',
        api_name: input.apiName ?? '',
        config_scope: input.configScope ?? '',
        status: "active",
    };
}

export function mapExtensionPointSummary(record: DbIfrExtensionPoint, maps?: { hubNameById: Map<string, string> }): ExtensionPointSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        extensionKey: record.extension_key as string,
        extensionName: record.extension_name as string,
        hookType: record.hook_type as string,
        status: record.status,
    };
}

export function buildExtensionPointPayload(organizationId: string, input: CreateExtensionPointInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.frameworkHubId,
        extension_key: input.extensionKey ?? '',
        extension_name: input.extensionName ?? '',
        hook_type: input.hookType ?? '',
        status: "active",
    };
}

export function mapFrameworkMetricSummary(record: DbIfrFrameworkMetric): FrameworkMetricSummary {
    return {
        id: record.id,
        metricsKey: record.metrics_key as string,
        templateScore: record.template_score as number,
        overallFrameworkScore: record.overall_framework_score as number,
        status: record.status,
    };
}

export function buildFrameworkMetricPayload(organizationId: string, input: CreateFrameworkMetricInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        metrics_key: input.metricsKey ?? '',
        template_score: input.templateScore ?? 0,
        overall_framework_score: input.overallFrameworkScore ?? 0,
        status: "active",
    };
}

export function mapFrameworkHealthSummary(record: DbIfrFrameworkHealth): FrameworkHealthSummary {
    return {
        id: record.id,
        healthKey: record.health_key as string,
        overallScore: record.overall_score as number,
        disasterRecoveryMode: record.disaster_recovery_mode as boolean,
        status: record.status,
    };
}

export function buildFrameworkHealthPayload(organizationId: string, input: CreateFrameworkHealthInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        health_key: input.healthKey ?? '',
        overall_score: input.overallScore ?? 0,
        disaster_recovery_mode: input.disasterRecoveryMode ?? false,
        status: "active",
    };
}

export function mapCompatibilityCheckSummary(record: DbIfrCompatibilityCheck, maps?: { hubNameById: Map<string, string> }): CompatibilityCheckSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        checkKey: record.check_key as string,
        checkType: record.check_type as string,
        checkScore: record.check_score as number,
        status: record.status,
    };
}

export function buildCompatibilityCheckPayload(organizationId: string, input: CreateCompatibilityCheckInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.frameworkHubId,
        check_key: input.checkKey ?? '',
        check_type: input.checkType ?? '',
        check_score: input.checkScore ?? 0,
        status: "active",
    };
}

export function mapFrameworkFailureSummary(record: DbIfrFrameworkFailure, maps?: { hubNameById: Map<string, string> }): FrameworkFailureSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        failureKey: record.failure_key as string,
        failureType: record.failure_type as string,
        status: record.status,
    };
}

export function buildFrameworkFailurePayload(organizationId: string, input: CreateFrameworkFailureInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.frameworkHubId,
        failure_key: input.failureKey ?? '',
        failure_type: input.failureType ?? '',
        status: "active",
    };
}

export function mapDashboardTemplateForStats(r: DbIfrDashboardTemplate) { return { status: r.status }; }
export function mapWorkflowTemplateForStats(r: DbIfrWorkflowTemplate) { return { status: r.status }; }
export function mapFrameworkMetricForStats(r: DbIfrFrameworkMetric) {
    return {
        template_score: r.template_score,
        profile_score: r.profile_score,
        compatibility_score: r.compatibility_score,
        sdk_score: r.sdk_score,
        framework_health_score: r.framework_health_score,
        overall_framework_score: r.overall_framework_score,
        status: r.status,
    };
}
export function mapIndustryProfileForStats(r: DbIfrIndustryProfile) { return { profile_score: r.profile_score, status: r.status }; }
export function mapCompatibilityCheckForStats(r: DbIfrCompatibilityCheck) { return { check_score: r.check_score, status: r.status }; }
export function mapValidationRuleForStats(r: DbIfrValidationRule) { return { validation_score: r.validation_score, status: r.status }; }
export function mapFrameworkHealthForStats(r: DbIfrFrameworkHealth) { return { overall_score: r.overall_score, status: r.status }; }
export function mapFrameworkFailureForStats(r: DbIfrFrameworkFailure) { return { status: r.status }; }

export function buildIfrDashboardStats(input: {
    frameworkHubs: FrameworkHubSummary[];
    dashboardTemplates: ReturnType<typeof mapDashboardTemplateForStats>[];
    workflowTemplates: ReturnType<typeof mapWorkflowTemplateForStats>[];
    frameworkMetrics: ReturnType<typeof mapFrameworkMetricForStats>[];
    industryProfiles: ReturnType<typeof mapIndustryProfileForStats>[];
    compatibilityChecks: ReturnType<typeof mapCompatibilityCheckForStats>[];
    validationRules: ReturnType<typeof mapValidationRuleForStats>[];
    frameworkHealth: ReturnType<typeof mapFrameworkHealthForStats>[];
    frameworkFailures: FrameworkFailureSummary[];
    auditLogs: AuditEntry[];
}): IfrDashboardStats {
    const activeHubs = input.frameworkHubs.filter((h) => h.status === "active").length;
    const latestMetrics = input.frameworkMetrics[0];
    const latestHealth = input.frameworkHealth[0];
    return {
        totalFrameworkHubs: input.frameworkHubs.length,
        activeFrameworkHubs: activeHubs,
        dashboardTemplateCount: input.dashboardTemplates.length,
        workflowTemplateCount: input.workflowTemplates.length,
        industryProfileCount: input.industryProfiles.length,
        openCompatibilityCount: input.compatibilityChecks.filter((c) => c.status === "open" || (c.check_score ?? 100) < 80).length,
        openFailureCount: input.frameworkFailures.filter((f) => f.status === "open" || f.status === "failed").length,
        overallFrameworkScore: latestMetrics?.overall_framework_score ?? latestHealth?.overall_score ?? 0,
        templateScore: latestMetrics?.template_score ?? 0,
        profileScore: latestMetrics?.profile_score ?? 0,
        compatibilityScore: latestMetrics?.compatibility_score ?? 0,
        sdkScore: latestMetrics?.sdk_score ?? 0,
        frameworkHealthScore: latestMetrics?.framework_health_score ?? 0,
        auditCount: input.auditLogs.length,
    };
}
