import {
    buildFrameworkHubLookupMaps,
    buildIfrAuditPayload,
    buildIfrDashboardStats,
    buildIfrPipelineInfo,
    mapAuditEntry,
    buildFrameworkHubPayload,
    mapFrameworkHubSummary,
    buildIndustryRegistrationPayload,
    mapIndustryRegistrationSummary,
    buildIndustryMetadataPayload,
    mapIndustryMetadataSummary,
    buildIndustryVersionPayload,
    mapIndustryVersionSummary,
    buildIndustryDependencyPayload,
    mapIndustryDependencySummary,
    buildBusinessTypePayload,
    mapBusinessTypeSummary,
    buildBusinessSizePayload,
    mapBusinessSizeSummary,
    buildOperatingModelPayload,
    mapOperatingModelSummary,
    buildIndustryProfilePayload,
    mapIndustryProfileSummary,
    buildDashboardTemplatePayload,
    mapDashboardTemplateSummary,
    buildWorkflowTemplatePayload,
    mapWorkflowTemplateSummary,
    buildRoleTemplatePayload,
    mapRoleTemplateSummary,
    buildReportTemplatePayload,
    mapReportTemplateSummary,
    buildDynamicConfigurationPayload,
    mapDynamicConfigurationSummary,
    buildFeatureConfigurationPayload,
    mapFeatureConfigurationSummary,
    buildBusinessRulePayload,
    mapBusinessRuleSummary,
    buildValidationRulePayload,
    mapValidationRuleSummary,
    buildIndustryContextPayload,
    mapIndustryContextSummary,
    buildAiContextPayload,
    mapAiContextSummary,
    buildTerminologyEntryPayload,
    mapTerminologyEntrySummary,
    buildDemoProfilePayload,
    mapDemoProfileSummary,
    buildProductionProfilePayload,
    mapProductionProfileSummary,
    buildEnterpriseProfilePayload,
    mapEnterpriseProfileSummary,
    buildSharedApiPayload,
    mapSharedApiSummary,
    buildContextApiPayload,
    mapContextApiSummary,
    buildConfigurationApiPayload,
    mapConfigurationApiSummary,
    buildExtensionPointPayload,
    mapExtensionPointSummary,
    buildFrameworkMetricPayload,
    mapFrameworkMetricSummary,
    buildFrameworkHealthPayload,
    mapFrameworkHealthSummary,
    buildCompatibilityCheckPayload,
    mapCompatibilityCheckSummary,
    buildFrameworkFailurePayload,
    mapFrameworkFailureSummary,
    mapDashboardTemplateForStats,
    mapWorkflowTemplateForStats,
    mapFrameworkMetricForStats,
    mapIndustryProfileForStats,
    mapCompatibilityCheckForStats,
    mapValidationRuleForStats,
    mapFrameworkHealthForStats,
    mapFrameworkFailureForStats,
} from "@/src/modules/database/lib/industry-framework-mappers";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import { createAiOrchestrationClient } from "@/src/modules/ai-orchestration/sdk";
import { createKnowledgeClient } from "@/src/modules/knowledge/sdk";
import type {
    FrameworkHubSummary,
    CreateFrameworkHubInput,
    IndustryRegistrationSummary,
    CreateIndustryRegistrationInput,
    IndustryMetadataSummary,
    CreateIndustryMetadataInput,
    IndustryVersionSummary,
    CreateIndustryVersionInput,
    IndustryDependencySummary,
    CreateIndustryDependencyInput,
    BusinessTypeSummary,
    CreateBusinessTypeInput,
    BusinessSizeSummary,
    CreateBusinessSizeInput,
    OperatingModelSummary,
    CreateOperatingModelInput,
    IndustryProfileSummary,
    CreateIndustryProfileInput,
    DashboardTemplateSummary,
    CreateDashboardTemplateInput,
    WorkflowTemplateSummary,
    CreateWorkflowTemplateInput,
    RoleTemplateSummary,
    CreateRoleTemplateInput,
    ReportTemplateSummary,
    CreateReportTemplateInput,
    DynamicConfigurationSummary,
    CreateDynamicConfigurationInput,
    FeatureConfigurationSummary,
    CreateFeatureConfigurationInput,
    BusinessRuleSummary,
    CreateBusinessRuleInput,
    ValidationRuleSummary,
    CreateValidationRuleInput,
    IndustryContextSummary,
    CreateIndustryContextInput,
    AiContextSummary,
    CreateAiContextInput,
    TerminologyEntrySummary,
    CreateTerminologyEntryInput,
    DemoProfileSummary,
    CreateDemoProfileInput,
    ProductionProfileSummary,
    CreateProductionProfileInput,
    EnterpriseProfileSummary,
    CreateEnterpriseProfileInput,
    SharedApiSummary,
    CreateSharedApiInput,
    ContextApiSummary,
    CreateContextApiInput,
    ConfigurationApiSummary,
    CreateConfigurationApiInput,
    ExtensionPointSummary,
    CreateExtensionPointInput,
    FrameworkMetricSummary,
    CreateFrameworkMetricInput,
    FrameworkHealthSummary,
    CreateFrameworkHealthInput,
    CompatibilityCheckSummary,
    CreateCompatibilityCheckInput,
    FrameworkFailureSummary,
    CreateFrameworkFailureInput,
    AuditEntry,
    IfrDashboardStats,
    IfrPipelineInfo,
    IfrSdkRegisterIndustryInput,
    IfrSdkRegisterIndustryResult,
    IfrSdkConfigureTemplateInput,
    IfrSdkConfigureTemplateResult,
    IfrSdkRunCompatibilityCheckInput,
    IfrSdkRunCompatibilityCheckResult,
} from "@/src/modules/industry-framework/types";

export class IndustryFrameworkService {
    private async getContext(authUserId: string, email: string, fullName?: string | null) {
        return resolveOrganizationContext(authUserId, email, fullName);
    }

    private async getMaps(organizationId: string) {
        const frameworkHubs = await databaseService.ifrFrameworkHubs.listByOrganization(organizationId);
        return buildFrameworkHubLookupMaps(frameworkHubs);
    }

    async getDashboardStats(authUserId: string, email: string, fullName?: string | null): Promise<IfrDashboardStats> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return buildIfrDashboardStats({ frameworkHubs: [], dashboardTemplates: [], workflowTemplates: [], frameworkMetrics: [], industryProfiles: [], compatibilityChecks: [], validationRules: [], frameworkHealth: [], frameworkFailures: [], auditLogs: [] });
        const [frameworkHubs, dashboardTemplatesRaw, workflowTemplatesRaw, frameworkMetricsRaw, industryProfilesRaw, compatibilityChecksRaw, validationRulesRaw, frameworkHealthRaw, frameworkFailures, auditLogs] = await Promise.all([
            this.getFrameworkHubs(authUserId, email, fullName),
            databaseService.ifrDashboardTemplates.listByOrganization(context.organizationId),
            databaseService.ifrWorkflowTemplates.listByOrganization(context.organizationId),
            databaseService.ifrFrameworkMetrics.listByOrganization(context.organizationId),
            databaseService.ifrIndustryProfiles.listByOrganization(context.organizationId),
            databaseService.ifrCompatibilityChecks.listByOrganization(context.organizationId),
            databaseService.ifrValidationRules.listByOrganization(context.organizationId),
            databaseService.ifrFrameworkHealth.listByOrganization(context.organizationId),
            this.getFrameworkFailures(authUserId, email, fullName),
            this.getAuditLogs(authUserId, email, fullName),
        ]);
        return buildIfrDashboardStats({
            frameworkHubs,
            dashboardTemplates: dashboardTemplatesRaw.map(mapDashboardTemplateForStats),
            workflowTemplates: workflowTemplatesRaw.map(mapWorkflowTemplateForStats),
            frameworkMetrics: frameworkMetricsRaw.map(mapFrameworkMetricForStats),
            industryProfiles: industryProfilesRaw.map(mapIndustryProfileForStats),
            compatibilityChecks: compatibilityChecksRaw.map(mapCompatibilityCheckForStats),
            validationRules: validationRulesRaw.map(mapValidationRuleForStats),
            frameworkHealth: frameworkHealthRaw.map(mapFrameworkHealthForStats),
            frameworkFailures,
            auditLogs,
        });
    }

    getPipelineInfo(): IfrPipelineInfo {
        return buildIfrPipelineInfo();
    }

    async getFrameworkHubs(authUserId: string, email: string, fullName?: string | null): Promise<FrameworkHubSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.ifrFrameworkHubs.listByOrganization(context.organizationId)).map((r) => mapFrameworkHubSummary(r));
    }

    async createFrameworkHub(authUserId: string, email: string, input: CreateFrameworkHubInput, fullName?: string | null): Promise<FrameworkHubSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ifrFrameworkHubs.create(buildFrameworkHubPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create frameworkHubs");
        await databaseService.ifrAuditLogs.create(buildIfrAuditPayload(context.organizationId, "framework_hubs", "create", `FrameworkHub created`, created.id));
        return mapFrameworkHubSummary(created);
    }

    async getIndustryRegistrations(authUserId: string, email: string, fullName?: string | null): Promise<IndustryRegistrationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ifrIndustryRegistrations.listByOrganization(context.organizationId)).map((r) => mapIndustryRegistrationSummary(r, maps));
    }

    async createIndustryRegistration(authUserId: string, email: string, input: CreateIndustryRegistrationInput, fullName?: string | null): Promise<IndustryRegistrationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ifrIndustryRegistrations.create(buildIndustryRegistrationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create industryRegistrations");
        await databaseService.ifrAuditLogs.create(buildIfrAuditPayload(context.organizationId, "industry_registrations", "create", `IndustryRegistration created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapIndustryRegistrationSummary(created, maps);
    }

    async getIndustryMetadatas(authUserId: string, email: string, fullName?: string | null): Promise<IndustryMetadataSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ifrIndustryMetadata.listByOrganization(context.organizationId)).map((r) => mapIndustryMetadataSummary(r, maps));
    }

    async createIndustryMetadata(authUserId: string, email: string, input: CreateIndustryMetadataInput, fullName?: string | null): Promise<IndustryMetadataSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ifrIndustryMetadata.create(buildIndustryMetadataPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create industryMetadata");
        await databaseService.ifrAuditLogs.create(buildIfrAuditPayload(context.organizationId, "industry_metadata", "create", `IndustryMetadata created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapIndustryMetadataSummary(created, maps);
    }

    async getIndustryVersions(authUserId: string, email: string, fullName?: string | null): Promise<IndustryVersionSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ifrIndustryVersions.listByOrganization(context.organizationId)).map((r) => mapIndustryVersionSummary(r, maps));
    }

    async createIndustryVersion(authUserId: string, email: string, input: CreateIndustryVersionInput, fullName?: string | null): Promise<IndustryVersionSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ifrIndustryVersions.create(buildIndustryVersionPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create industryVersions");
        await databaseService.ifrAuditLogs.create(buildIfrAuditPayload(context.organizationId, "industry_versions", "create", `IndustryVersion created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapIndustryVersionSummary(created, maps);
    }

    async getIndustryDependencys(authUserId: string, email: string, fullName?: string | null): Promise<IndustryDependencySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ifrIndustryDependencies.listByOrganization(context.organizationId)).map((r) => mapIndustryDependencySummary(r, maps));
    }

    async createIndustryDependency(authUserId: string, email: string, input: CreateIndustryDependencyInput, fullName?: string | null): Promise<IndustryDependencySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ifrIndustryDependencies.create(buildIndustryDependencyPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create industryDependencies");
        await databaseService.ifrAuditLogs.create(buildIfrAuditPayload(context.organizationId, "industry_dependencies", "create", `IndustryDependency created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapIndustryDependencySummary(created, maps);
    }

    async getBusinessTypes(authUserId: string, email: string, fullName?: string | null): Promise<BusinessTypeSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ifrBusinessTypes.listByOrganization(context.organizationId)).map((r) => mapBusinessTypeSummary(r, maps));
    }

    async createBusinessType(authUserId: string, email: string, input: CreateBusinessTypeInput, fullName?: string | null): Promise<BusinessTypeSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ifrBusinessTypes.create(buildBusinessTypePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create businessTypes");
        await databaseService.ifrAuditLogs.create(buildIfrAuditPayload(context.organizationId, "business_types", "create", `BusinessType created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapBusinessTypeSummary(created, maps);
    }

    async getBusinessSizes(authUserId: string, email: string, fullName?: string | null): Promise<BusinessSizeSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ifrBusinessSizes.listByOrganization(context.organizationId)).map((r) => mapBusinessSizeSummary(r, maps));
    }

    async createBusinessSize(authUserId: string, email: string, input: CreateBusinessSizeInput, fullName?: string | null): Promise<BusinessSizeSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ifrBusinessSizes.create(buildBusinessSizePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create businessSizes");
        await databaseService.ifrAuditLogs.create(buildIfrAuditPayload(context.organizationId, "business_sizes", "create", `BusinessSize created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapBusinessSizeSummary(created, maps);
    }

    async getOperatingModels(authUserId: string, email: string, fullName?: string | null): Promise<OperatingModelSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ifrOperatingModels.listByOrganization(context.organizationId)).map((r) => mapOperatingModelSummary(r, maps));
    }

    async createOperatingModel(authUserId: string, email: string, input: CreateOperatingModelInput, fullName?: string | null): Promise<OperatingModelSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ifrOperatingModels.create(buildOperatingModelPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create operatingModels");
        await databaseService.ifrAuditLogs.create(buildIfrAuditPayload(context.organizationId, "operating_models", "create", `OperatingModel created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapOperatingModelSummary(created, maps);
    }

    async getIndustryProfiles(authUserId: string, email: string, fullName?: string | null): Promise<IndustryProfileSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ifrIndustryProfiles.listByOrganization(context.organizationId)).map((r) => mapIndustryProfileSummary(r, maps));
    }

    async createIndustryProfile(authUserId: string, email: string, input: CreateIndustryProfileInput, fullName?: string | null): Promise<IndustryProfileSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ifrIndustryProfiles.create(buildIndustryProfilePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create industryProfiles");
        await databaseService.ifrAuditLogs.create(buildIfrAuditPayload(context.organizationId, "industry_profiles", "create", `IndustryProfile created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapIndustryProfileSummary(created, maps);
    }

    async getDashboardTemplates(authUserId: string, email: string, fullName?: string | null): Promise<DashboardTemplateSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ifrDashboardTemplates.listByOrganization(context.organizationId)).map((r) => mapDashboardTemplateSummary(r, maps));
    }

    async createDashboardTemplate(authUserId: string, email: string, input: CreateDashboardTemplateInput, fullName?: string | null): Promise<DashboardTemplateSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ifrDashboardTemplates.create(buildDashboardTemplatePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create dashboardTemplates");
        await databaseService.ifrAuditLogs.create(buildIfrAuditPayload(context.organizationId, "dashboard_templates", "create", `DashboardTemplate created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapDashboardTemplateSummary(created, maps);
    }

    async getWorkflowTemplates(authUserId: string, email: string, fullName?: string | null): Promise<WorkflowTemplateSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ifrWorkflowTemplates.listByOrganization(context.organizationId)).map((r) => mapWorkflowTemplateSummary(r, maps));
    }

    async createWorkflowTemplate(authUserId: string, email: string, input: CreateWorkflowTemplateInput, fullName?: string | null): Promise<WorkflowTemplateSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ifrWorkflowTemplates.create(buildWorkflowTemplatePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create workflowTemplates");
        await databaseService.ifrAuditLogs.create(buildIfrAuditPayload(context.organizationId, "workflow_templates", "create", `WorkflowTemplate created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapWorkflowTemplateSummary(created, maps);
    }

    async getRoleTemplates(authUserId: string, email: string, fullName?: string | null): Promise<RoleTemplateSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ifrRoleTemplates.listByOrganization(context.organizationId)).map((r) => mapRoleTemplateSummary(r, maps));
    }

    async createRoleTemplate(authUserId: string, email: string, input: CreateRoleTemplateInput, fullName?: string | null): Promise<RoleTemplateSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ifrRoleTemplates.create(buildRoleTemplatePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create roleTemplates");
        await databaseService.ifrAuditLogs.create(buildIfrAuditPayload(context.organizationId, "role_templates", "create", `RoleTemplate created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapRoleTemplateSummary(created, maps);
    }

    async getReportTemplates(authUserId: string, email: string, fullName?: string | null): Promise<ReportTemplateSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ifrReportTemplates.listByOrganization(context.organizationId)).map((r) => mapReportTemplateSummary(r, maps));
    }

    async createReportTemplate(authUserId: string, email: string, input: CreateReportTemplateInput, fullName?: string | null): Promise<ReportTemplateSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ifrReportTemplates.create(buildReportTemplatePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create reportTemplates");
        await databaseService.ifrAuditLogs.create(buildIfrAuditPayload(context.organizationId, "report_templates", "create", `ReportTemplate created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapReportTemplateSummary(created, maps);
    }

    async getDynamicConfigurations(authUserId: string, email: string, fullName?: string | null): Promise<DynamicConfigurationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ifrDynamicConfigurations.listByOrganization(context.organizationId)).map((r) => mapDynamicConfigurationSummary(r, maps));
    }

    async createDynamicConfiguration(authUserId: string, email: string, input: CreateDynamicConfigurationInput, fullName?: string | null): Promise<DynamicConfigurationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ifrDynamicConfigurations.create(buildDynamicConfigurationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create dynamicConfigurations");
        await databaseService.ifrAuditLogs.create(buildIfrAuditPayload(context.organizationId, "dynamic_configurations", "create", `DynamicConfiguration created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapDynamicConfigurationSummary(created, maps);
    }

    async getFeatureConfigurations(authUserId: string, email: string, fullName?: string | null): Promise<FeatureConfigurationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ifrFeatureConfigurations.listByOrganization(context.organizationId)).map((r) => mapFeatureConfigurationSummary(r, maps));
    }

    async createFeatureConfiguration(authUserId: string, email: string, input: CreateFeatureConfigurationInput, fullName?: string | null): Promise<FeatureConfigurationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ifrFeatureConfigurations.create(buildFeatureConfigurationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create featureConfigurations");
        await databaseService.ifrAuditLogs.create(buildIfrAuditPayload(context.organizationId, "feature_configurations", "create", `FeatureConfiguration created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapFeatureConfigurationSummary(created, maps);
    }

    async getBusinessRules(authUserId: string, email: string, fullName?: string | null): Promise<BusinessRuleSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ifrBusinessRules.listByOrganization(context.organizationId)).map((r) => mapBusinessRuleSummary(r, maps));
    }

    async createBusinessRule(authUserId: string, email: string, input: CreateBusinessRuleInput, fullName?: string | null): Promise<BusinessRuleSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ifrBusinessRules.create(buildBusinessRulePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create businessRules");
        await databaseService.ifrAuditLogs.create(buildIfrAuditPayload(context.organizationId, "business_rules", "create", `BusinessRule created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapBusinessRuleSummary(created, maps);
    }

    async getValidationRules(authUserId: string, email: string, fullName?: string | null): Promise<ValidationRuleSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ifrValidationRules.listByOrganization(context.organizationId)).map((r) => mapValidationRuleSummary(r, maps));
    }

    async createValidationRule(authUserId: string, email: string, input: CreateValidationRuleInput, fullName?: string | null): Promise<ValidationRuleSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ifrValidationRules.create(buildValidationRulePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create validationRules");
        await databaseService.ifrAuditLogs.create(buildIfrAuditPayload(context.organizationId, "validation_rules", "create", `ValidationRule created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapValidationRuleSummary(created, maps);
    }

    async getIndustryContexts(authUserId: string, email: string, fullName?: string | null): Promise<IndustryContextSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ifrIndustryContexts.listByOrganization(context.organizationId)).map((r) => mapIndustryContextSummary(r, maps));
    }

    async createIndustryContext(authUserId: string, email: string, input: CreateIndustryContextInput, fullName?: string | null): Promise<IndustryContextSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ifrIndustryContexts.create(buildIndustryContextPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create industryContexts");
        await databaseService.ifrAuditLogs.create(buildIfrAuditPayload(context.organizationId, "industry_contexts", "create", `IndustryContext created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapIndustryContextSummary(created, maps);
    }

    async getAiContexts(authUserId: string, email: string, fullName?: string | null): Promise<AiContextSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ifrAiContexts.listByOrganization(context.organizationId)).map((r) => mapAiContextSummary(r, maps));
    }

    async createAiContext(authUserId: string, email: string, input: CreateAiContextInput, fullName?: string | null): Promise<AiContextSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ifrAiContexts.create(buildAiContextPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create aiContexts");
        await databaseService.ifrAuditLogs.create(buildIfrAuditPayload(context.organizationId, "ai_contexts", "create", `AiContext created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapAiContextSummary(created, maps);
    }

    async getTerminologyEntrys(authUserId: string, email: string, fullName?: string | null): Promise<TerminologyEntrySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ifrTerminologyEntries.listByOrganization(context.organizationId)).map((r) => mapTerminologyEntrySummary(r, maps));
    }

    async createTerminologyEntry(authUserId: string, email: string, input: CreateTerminologyEntryInput, fullName?: string | null): Promise<TerminologyEntrySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ifrTerminologyEntries.create(buildTerminologyEntryPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create terminologyEntries");
        await databaseService.ifrAuditLogs.create(buildIfrAuditPayload(context.organizationId, "terminology_entries", "create", `TerminologyEntry created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapTerminologyEntrySummary(created, maps);
    }

    async getDemoProfiles(authUserId: string, email: string, fullName?: string | null): Promise<DemoProfileSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ifrDemoProfiles.listByOrganization(context.organizationId)).map((r) => mapDemoProfileSummary(r, maps));
    }

    async createDemoProfile(authUserId: string, email: string, input: CreateDemoProfileInput, fullName?: string | null): Promise<DemoProfileSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ifrDemoProfiles.create(buildDemoProfilePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create demoProfiles");
        await databaseService.ifrAuditLogs.create(buildIfrAuditPayload(context.organizationId, "demo_profiles", "create", `DemoProfile created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapDemoProfileSummary(created, maps);
    }

    async getProductionProfiles(authUserId: string, email: string, fullName?: string | null): Promise<ProductionProfileSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ifrProductionProfiles.listByOrganization(context.organizationId)).map((r) => mapProductionProfileSummary(r, maps));
    }

    async createProductionProfile(authUserId: string, email: string, input: CreateProductionProfileInput, fullName?: string | null): Promise<ProductionProfileSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ifrProductionProfiles.create(buildProductionProfilePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create productionProfiles");
        await databaseService.ifrAuditLogs.create(buildIfrAuditPayload(context.organizationId, "production_profiles", "create", `ProductionProfile created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapProductionProfileSummary(created, maps);
    }

    async getEnterpriseProfiles(authUserId: string, email: string, fullName?: string | null): Promise<EnterpriseProfileSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ifrEnterpriseProfiles.listByOrganization(context.organizationId)).map((r) => mapEnterpriseProfileSummary(r, maps));
    }

    async createEnterpriseProfile(authUserId: string, email: string, input: CreateEnterpriseProfileInput, fullName?: string | null): Promise<EnterpriseProfileSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ifrEnterpriseProfiles.create(buildEnterpriseProfilePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create enterpriseProfiles");
        await databaseService.ifrAuditLogs.create(buildIfrAuditPayload(context.organizationId, "enterprise_profiles", "create", `EnterpriseProfile created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapEnterpriseProfileSummary(created, maps);
    }

    async getSharedApis(authUserId: string, email: string, fullName?: string | null): Promise<SharedApiSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ifrSharedApis.listByOrganization(context.organizationId)).map((r) => mapSharedApiSummary(r, maps));
    }

    async createSharedApi(authUserId: string, email: string, input: CreateSharedApiInput, fullName?: string | null): Promise<SharedApiSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ifrSharedApis.create(buildSharedApiPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create sharedApis");
        await databaseService.ifrAuditLogs.create(buildIfrAuditPayload(context.organizationId, "shared_apis", "create", `SharedApi created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapSharedApiSummary(created, maps);
    }

    async getContextApis(authUserId: string, email: string, fullName?: string | null): Promise<ContextApiSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ifrContextApis.listByOrganization(context.organizationId)).map((r) => mapContextApiSummary(r, maps));
    }

    async createContextApi(authUserId: string, email: string, input: CreateContextApiInput, fullName?: string | null): Promise<ContextApiSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ifrContextApis.create(buildContextApiPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create contextApis");
        await databaseService.ifrAuditLogs.create(buildIfrAuditPayload(context.organizationId, "context_apis", "create", `ContextApi created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapContextApiSummary(created, maps);
    }

    async getConfigurationApis(authUserId: string, email: string, fullName?: string | null): Promise<ConfigurationApiSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ifrConfigurationApis.listByOrganization(context.organizationId)).map((r) => mapConfigurationApiSummary(r, maps));
    }

    async createConfigurationApi(authUserId: string, email: string, input: CreateConfigurationApiInput, fullName?: string | null): Promise<ConfigurationApiSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ifrConfigurationApis.create(buildConfigurationApiPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create configurationApis");
        await databaseService.ifrAuditLogs.create(buildIfrAuditPayload(context.organizationId, "configuration_apis", "create", `ConfigurationApi created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapConfigurationApiSummary(created, maps);
    }

    async getExtensionPoints(authUserId: string, email: string, fullName?: string | null): Promise<ExtensionPointSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ifrExtensionPoints.listByOrganization(context.organizationId)).map((r) => mapExtensionPointSummary(r, maps));
    }

    async createExtensionPoint(authUserId: string, email: string, input: CreateExtensionPointInput, fullName?: string | null): Promise<ExtensionPointSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ifrExtensionPoints.create(buildExtensionPointPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create extensionPoints");
        await databaseService.ifrAuditLogs.create(buildIfrAuditPayload(context.organizationId, "extension_points", "create", `ExtensionPoint created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapExtensionPointSummary(created, maps);
    }

    async getFrameworkMetrics(authUserId: string, email: string, fullName?: string | null): Promise<FrameworkMetricSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.ifrFrameworkMetrics.listByOrganization(context.organizationId)).map(mapFrameworkMetricSummary);
    }

    async createFrameworkMetric(authUserId: string, email: string, input: CreateFrameworkMetricInput, fullName?: string | null): Promise<FrameworkMetricSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ifrFrameworkMetrics.create(buildFrameworkMetricPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create frameworkMetrics");
        await databaseService.ifrAuditLogs.create(buildIfrAuditPayload(context.organizationId, "framework_metrics", "create", `FrameworkMetric created`, created.id));
        return mapFrameworkMetricSummary(created);
    }

    async getFrameworkHealths(authUserId: string, email: string, fullName?: string | null): Promise<FrameworkHealthSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.ifrFrameworkHealth.listByOrganization(context.organizationId)).map(mapFrameworkHealthSummary);
    }

    async createFrameworkHealth(authUserId: string, email: string, input: CreateFrameworkHealthInput, fullName?: string | null): Promise<FrameworkHealthSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ifrFrameworkHealth.create(buildFrameworkHealthPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create frameworkHealth");
        await databaseService.ifrAuditLogs.create(buildIfrAuditPayload(context.organizationId, "framework_health", "create", `FrameworkHealth created`, created.id));
        return mapFrameworkHealthSummary(created);
    }

    async getCompatibilityChecks(authUserId: string, email: string, fullName?: string | null): Promise<CompatibilityCheckSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ifrCompatibilityChecks.listByOrganization(context.organizationId)).map((r) => mapCompatibilityCheckSummary(r, maps));
    }

    async createCompatibilityCheck(authUserId: string, email: string, input: CreateCompatibilityCheckInput, fullName?: string | null): Promise<CompatibilityCheckSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ifrCompatibilityChecks.create(buildCompatibilityCheckPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create compatibilityChecks");
        await databaseService.ifrAuditLogs.create(buildIfrAuditPayload(context.organizationId, "compatibility_checks", "create", `CompatibilityCheck created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapCompatibilityCheckSummary(created, maps);
    }

    async getFrameworkFailures(authUserId: string, email: string, fullName?: string | null): Promise<FrameworkFailureSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ifrFrameworkFailures.listByOrganization(context.organizationId)).map((r) => mapFrameworkFailureSummary(r, maps));
    }

    async createFrameworkFailure(authUserId: string, email: string, input: CreateFrameworkFailureInput, fullName?: string | null): Promise<FrameworkFailureSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ifrFrameworkFailures.create(buildFrameworkFailurePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create frameworkFailures");
        await databaseService.ifrAuditLogs.create(buildIfrAuditPayload(context.organizationId, "framework_failures", "create", `FrameworkFailure created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapFrameworkFailureSummary(created, maps);
    }

    async getAuditLogs(authUserId: string, email: string, fullName?: string | null): Promise<AuditEntry[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.ifrAuditLogs.listByOrganization(context.organizationId)).map(mapAuditEntry);
    }

    async getFrameworkHubOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.ifrFrameworkHubs.listByOrganization(context.organizationId)).map((r) => ({ id: r.id, name: r.hub_name }));
    }

    async sdkRegisterIndustry(authUserId: string, email: string, input: IfrSdkRegisterIndustryInput, fullName?: string | null): Promise<IfrSdkRegisterIndustryResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        await ai.executeTask({ taskType: "register_industry", moduleSource: "industry_framework", inputPayload: { ...input } });
        const created = await this.createIndustryRegistration(authUserId, email, { frameworkHubId: input.frameworkHubId, registrationKey: input.registrationKey, industryCode: input.industryCode }, fullName);
        return { registrationId: created.id, registrationKey: created.registrationKey, status: created.status };
    }

    async sdkConfigureTemplate(authUserId: string, email: string, input: IfrSdkConfigureTemplateInput, fullName?: string | null): Promise<IfrSdkConfigureTemplateResult> {
        const knowledge = createKnowledgeClient(authUserId, email, fullName);
        await knowledge.search({ query: input.templateKey ?? input.templateName ?? "template", limit: 3 });
        const created = await this.createDashboardTemplate(authUserId, email, { frameworkHubId: input.frameworkHubId, templateKey: input.templateKey, templateName: input.templateName }, fullName);
        return { templateId: created.id, templateKey: created.templateKey, status: created.status };
    }

    async sdkRunCompatibilityCheck(authUserId: string, email: string, input: IfrSdkRunCompatibilityCheckInput, fullName?: string | null): Promise<IfrSdkRunCompatibilityCheckResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        await ai.executeTask({ taskType: "run_compatibility_check", moduleSource: "industry_framework", inputPayload: { ...input } });
        const created = await this.createCompatibilityCheck(authUserId, email, { frameworkHubId: input.frameworkHubId, checkKey: input.checkKey, checkType: input.checkType }, fullName);
        return { checkId: created.id, checkKey: created.checkKey, status: created.status };
    }
}

export const industryFrameworkService = new IndustryFrameworkService();
