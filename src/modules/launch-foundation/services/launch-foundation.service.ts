import {
    buildLaunchHubLookupMaps,
    buildElfAuditPayload,
    buildElfDashboardStats,
    buildElfPipelineInfo,
    mapAuditEntry,
    buildLaunchHubPayload,
    mapLaunchHubSummary,
    buildOrganizationProvisionPayload,
    mapOrganizationProvisionSummary,
    buildTenantProvisionPayload,
    mapTenantProvisionSummary,
    buildIndustryPackAssignmentPayload,
    mapIndustryPackAssignmentSummary,
    buildModuleLicensePayload,
    mapModuleLicenseSummary,
    buildWizardProfilePayload,
    mapWizardProfileSummary,
    buildWizardBrandingPayload,
    mapWizardBrandingSummary,
    buildWizardDepartmentPayload,
    mapWizardDepartmentSummary,
    buildWizardSettingPayload,
    mapWizardSettingSummary,
    buildImportJobPayload,
    mapImportJobSummary,
    buildImportValidationPayload,
    mapImportValidationSummary,
    buildImportPreviewPayload,
    mapImportPreviewSummary,
    buildImportHistoryPayload,
    mapImportHistorySummary,
    buildGoLiveChecklistPayload,
    mapGoLiveChecklistSummary,
    buildGoLiveScorePayload,
    mapGoLiveScoreSummary,
    buildDeploymentStatusPayload,
    mapDeploymentStatusSummary,
    buildReadinessValidationPayload,
    mapReadinessValidationSummary,
    buildCustomerHealthScorePayload,
    mapCustomerHealthScoreSummary,
    buildPlatformAdoptionPayload,
    mapPlatformAdoptionSummary,
    buildFeatureUsagePayload,
    mapFeatureUsageSummary,
    buildRenewalTrackingPayload,
    mapRenewalTrackingSummary,
    buildSupportTicketPayload,
    mapSupportTicketSummary,
    buildKnowledgeBaseArticlePayload,
    mapKnowledgeBaseArticleSummary,
    buildIncidentTrackingPayload,
    mapIncidentTrackingSummary,
    buildCustomerRegistryPayload,
    mapCustomerRegistrySummary,
    buildSubscriptionRecordPayload,
    mapSubscriptionRecordSummary,
    buildLicenseManagementPayload,
    mapLicenseManagementSummary,
    buildLaunchMetricPayload,
    mapLaunchMetricSummary,
    buildLaunchHealthPayload,
    mapLaunchHealthSummary,
    buildMissionControlKpiPayload,
    mapMissionControlKpiSummary,
    buildLaunchFailurePayload,
    mapLaunchFailureSummary,
    mapOrganizationProvisionForStats,
    mapCustomerRegistryForStats,
    mapLaunchMetricForStats,
    mapImportJobForStats,
    mapGoLiveChecklistForStats,
    mapLaunchHealthForStats,
    mapLaunchFailureForStats,
} from "@/src/modules/database/lib/launch-foundation-mappers";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import { createIndustryFrameworkClient } from "@/src/modules/industry-framework/sdk";
import { createBusinessProcessClient } from "@/src/modules/business-process/sdk";
import { createFormEngineClient } from "@/src/modules/form-engine/sdk";
import { createWorkflowEngineClient } from "@/src/modules/workflow-engine/sdk";
import { createDocumentEngineClient } from "@/src/modules/document-engine/sdk";
import { createCommercialSaasClient } from "@/src/modules/commercial-saas/sdk";
import { createEnterpriseIdentityClient } from "@/src/modules/enterprise-identity/sdk";
import { createCommunicationHubClient } from "@/src/modules/communication-hub/sdk";
import { createIntegrationPlatformClient } from "@/src/modules/integration-platform/sdk";
import type {
    LaunchHubSummary,
    CreateLaunchHubInput,
    OrganizationProvisionSummary,
    CreateOrganizationProvisionInput,
    TenantProvisionSummary,
    CreateTenantProvisionInput,
    IndustryPackAssignmentSummary,
    CreateIndustryPackAssignmentInput,
    ModuleLicenseSummary,
    CreateModuleLicenseInput,
    WizardProfileSummary,
    CreateWizardProfileInput,
    WizardBrandingSummary,
    CreateWizardBrandingInput,
    WizardDepartmentSummary,
    CreateWizardDepartmentInput,
    WizardSettingSummary,
    CreateWizardSettingInput,
    ImportJobSummary,
    CreateImportJobInput,
    ImportValidationSummary,
    CreateImportValidationInput,
    ImportPreviewSummary,
    CreateImportPreviewInput,
    ImportHistorySummary,
    CreateImportHistoryInput,
    GoLiveChecklistSummary,
    CreateGoLiveChecklistInput,
    GoLiveScoreSummary,
    CreateGoLiveScoreInput,
    DeploymentStatusSummary,
    CreateDeploymentStatusInput,
    ReadinessValidationSummary,
    CreateReadinessValidationInput,
    CustomerHealthScoreSummary,
    CreateCustomerHealthScoreInput,
    PlatformAdoptionSummary,
    CreatePlatformAdoptionInput,
    FeatureUsageSummary,
    CreateFeatureUsageInput,
    RenewalTrackingSummary,
    CreateRenewalTrackingInput,
    SupportTicketSummary,
    CreateSupportTicketInput,
    KnowledgeBaseArticleSummary,
    CreateKnowledgeBaseArticleInput,
    IncidentTrackingSummary,
    CreateIncidentTrackingInput,
    CustomerRegistrySummary,
    CreateCustomerRegistryInput,
    SubscriptionRecordSummary,
    CreateSubscriptionRecordInput,
    LicenseManagementSummary,
    CreateLicenseManagementInput,
    LaunchMetricSummary,
    CreateLaunchMetricInput,
    LaunchHealthSummary,
    CreateLaunchHealthInput,
    MissionControlKpiSummary,
    CreateMissionControlKpiInput,
    LaunchFailureSummary,
    CreateLaunchFailureInput,
    AuditEntry,
    ElfDashboardStats,
    ElfPipelineInfo,
    ElfSdkProvisionOrganizationInput,
    ElfSdkProvisionOrganizationResult,
    ElfSdkConfigureWizardProfileInput,
    ElfSdkConfigureWizardProfileResult,
    ElfSdkRunGoLiveWorkflowInput,
    ElfSdkRunGoLiveWorkflowResult,
} from "@/src/modules/launch-foundation/types";

export class LaunchFoundationService {
    private async getContext(authUserId: string, email: string, fullName?: string | null) {
        return resolveOrganizationContext(authUserId, email, fullName);
    }

    private async getMaps(organizationId: string) {
        const launchHubs = await databaseService.elfLaunchHubs.listByOrganization(organizationId);
        return buildLaunchHubLookupMaps(launchHubs);
    }

    async getDashboardStats(authUserId: string, email: string, fullName?: string | null): Promise<ElfDashboardStats> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return buildElfDashboardStats({ launchHubs: [], organizationProvisions: [], launchMetrics: [], importJobs: [], goLiveChecklists: [], customerRegistry: [], launchHealth: [], launchFailures: [], auditLogs: [] });
        const [launchHubs, organizationProvisionsRaw, launchMetricsRaw, importJobsRaw, goLiveChecklistsRaw, customerRegistryRaw, launchHealthRaw, launchFailures, auditLogs] = await Promise.all([
            this.getLaunchHubs(authUserId, email, fullName),
            databaseService.elfOrganizationProvisions.listByOrganization(context.organizationId),
            databaseService.elfLaunchMetrics.listByOrganization(context.organizationId),
            databaseService.elfImportJobs.listByOrganization(context.organizationId),
            databaseService.elfGoLiveChecklists.listByOrganization(context.organizationId),
            databaseService.elfCustomerRegistry.listByOrganization(context.organizationId),
            databaseService.elfLaunchHealth.listByOrganization(context.organizationId),
            this.getLaunchFailures(authUserId, email, fullName),
            this.getAuditLogs(authUserId, email, fullName),
        ]);
        return buildElfDashboardStats({
            launchHubs,
            organizationProvisions: organizationProvisionsRaw.map(mapOrganizationProvisionForStats),
            launchMetrics: launchMetricsRaw.map(mapLaunchMetricForStats),
            importJobs: importJobsRaw.map(mapImportJobForStats),
            goLiveChecklists: goLiveChecklistsRaw.map(mapGoLiveChecklistForStats),
            customerRegistry: customerRegistryRaw.map(mapCustomerRegistryForStats),
            launchHealth: launchHealthRaw.map(mapLaunchHealthForStats),
            launchFailures,
            auditLogs,
        });
    }

    getPipelineInfo(): ElfPipelineInfo {
        return buildElfPipelineInfo();
    }

    async getLaunchHubs(authUserId: string, email: string, fullName?: string | null): Promise<LaunchHubSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.elfLaunchHubs.listByOrganization(context.organizationId)).map((r) => mapLaunchHubSummary(r));
    }

    async createLaunchHub(authUserId: string, email: string, input: CreateLaunchHubInput, fullName?: string | null): Promise<LaunchHubSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.elfLaunchHubs.create(buildLaunchHubPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create launchHubs");
        await databaseService.elfAuditLogs.create(buildElfAuditPayload(context.organizationId, "launch_hubs", "create", `LaunchHub created`, created.id));
        return mapLaunchHubSummary(created);
    }

    async getOrganizationProvisions(authUserId: string, email: string, fullName?: string | null): Promise<OrganizationProvisionSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.elfOrganizationProvisions.listByOrganization(context.organizationId)).map((r) => mapOrganizationProvisionSummary(r, maps));
    }

    async createOrganizationProvision(authUserId: string, email: string, input: CreateOrganizationProvisionInput, fullName?: string | null): Promise<OrganizationProvisionSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.elfOrganizationProvisions.create(buildOrganizationProvisionPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create organizationProvisions");
        await databaseService.elfAuditLogs.create(buildElfAuditPayload(context.organizationId, "organization_provisions", "create", `OrganizationProvision created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapOrganizationProvisionSummary(created, maps);
    }

    async getTenantProvisions(authUserId: string, email: string, fullName?: string | null): Promise<TenantProvisionSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.elfTenantProvisions.listByOrganization(context.organizationId)).map((r) => mapTenantProvisionSummary(r, maps));
    }

    async createTenantProvision(authUserId: string, email: string, input: CreateTenantProvisionInput, fullName?: string | null): Promise<TenantProvisionSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.elfTenantProvisions.create(buildTenantProvisionPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create tenantProvisions");
        await databaseService.elfAuditLogs.create(buildElfAuditPayload(context.organizationId, "tenant_provisions", "create", `TenantProvision created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapTenantProvisionSummary(created, maps);
    }

    async getIndustryPackAssignments(authUserId: string, email: string, fullName?: string | null): Promise<IndustryPackAssignmentSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.elfIndustryPackAssignments.listByOrganization(context.organizationId)).map((r) => mapIndustryPackAssignmentSummary(r, maps));
    }

    async createIndustryPackAssignment(authUserId: string, email: string, input: CreateIndustryPackAssignmentInput, fullName?: string | null): Promise<IndustryPackAssignmentSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.elfIndustryPackAssignments.create(buildIndustryPackAssignmentPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create industryPackAssignments");
        await databaseService.elfAuditLogs.create(buildElfAuditPayload(context.organizationId, "industry_pack_assignments", "create", `IndustryPackAssignment created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapIndustryPackAssignmentSummary(created, maps);
    }

    async getModuleLicenses(authUserId: string, email: string, fullName?: string | null): Promise<ModuleLicenseSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.elfModuleLicenses.listByOrganization(context.organizationId)).map((r) => mapModuleLicenseSummary(r, maps));
    }

    async createModuleLicense(authUserId: string, email: string, input: CreateModuleLicenseInput, fullName?: string | null): Promise<ModuleLicenseSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.elfModuleLicenses.create(buildModuleLicensePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create moduleLicenses");
        await databaseService.elfAuditLogs.create(buildElfAuditPayload(context.organizationId, "module_licenses", "create", `ModuleLicense created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapModuleLicenseSummary(created, maps);
    }

    async getWizardProfiles(authUserId: string, email: string, fullName?: string | null): Promise<WizardProfileSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.elfWizardProfiles.listByOrganization(context.organizationId)).map((r) => mapWizardProfileSummary(r, maps));
    }

    async createWizardProfile(authUserId: string, email: string, input: CreateWizardProfileInput, fullName?: string | null): Promise<WizardProfileSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.elfWizardProfiles.create(buildWizardProfilePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create wizardProfiles");
        await databaseService.elfAuditLogs.create(buildElfAuditPayload(context.organizationId, "wizard_profiles", "create", `WizardProfile created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapWizardProfileSummary(created, maps);
    }

    async getWizardBrandings(authUserId: string, email: string, fullName?: string | null): Promise<WizardBrandingSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.elfWizardBranding.listByOrganization(context.organizationId)).map((r) => mapWizardBrandingSummary(r, maps));
    }

    async createWizardBranding(authUserId: string, email: string, input: CreateWizardBrandingInput, fullName?: string | null): Promise<WizardBrandingSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.elfWizardBranding.create(buildWizardBrandingPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create wizardBranding");
        await databaseService.elfAuditLogs.create(buildElfAuditPayload(context.organizationId, "wizard_branding", "create", `WizardBranding created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapWizardBrandingSummary(created, maps);
    }

    async getWizardDepartments(authUserId: string, email: string, fullName?: string | null): Promise<WizardDepartmentSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.elfWizardDepartments.listByOrganization(context.organizationId)).map((r) => mapWizardDepartmentSummary(r, maps));
    }

    async createWizardDepartment(authUserId: string, email: string, input: CreateWizardDepartmentInput, fullName?: string | null): Promise<WizardDepartmentSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.elfWizardDepartments.create(buildWizardDepartmentPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create wizardDepartments");
        await databaseService.elfAuditLogs.create(buildElfAuditPayload(context.organizationId, "wizard_departments", "create", `WizardDepartment created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapWizardDepartmentSummary(created, maps);
    }

    async getWizardSettings(authUserId: string, email: string, fullName?: string | null): Promise<WizardSettingSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.elfWizardSettings.listByOrganization(context.organizationId)).map((r) => mapWizardSettingSummary(r, maps));
    }

    async createWizardSetting(authUserId: string, email: string, input: CreateWizardSettingInput, fullName?: string | null): Promise<WizardSettingSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.elfWizardSettings.create(buildWizardSettingPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create wizardSettings");
        await databaseService.elfAuditLogs.create(buildElfAuditPayload(context.organizationId, "wizard_settings", "create", `WizardSetting created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapWizardSettingSummary(created, maps);
    }

    async getImportJobs(authUserId: string, email: string, fullName?: string | null): Promise<ImportJobSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.elfImportJobs.listByOrganization(context.organizationId)).map((r) => mapImportJobSummary(r, maps));
    }

    async createImportJob(authUserId: string, email: string, input: CreateImportJobInput, fullName?: string | null): Promise<ImportJobSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.elfImportJobs.create(buildImportJobPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create importJobs");
        await databaseService.elfAuditLogs.create(buildElfAuditPayload(context.organizationId, "import_jobs", "create", `ImportJob created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapImportJobSummary(created, maps);
    }

    async getImportValidations(authUserId: string, email: string, fullName?: string | null): Promise<ImportValidationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.elfImportValidations.listByOrganization(context.organizationId)).map((r) => mapImportValidationSummary(r, maps));
    }

    async createImportValidation(authUserId: string, email: string, input: CreateImportValidationInput, fullName?: string | null): Promise<ImportValidationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.elfImportValidations.create(buildImportValidationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create importValidations");
        await databaseService.elfAuditLogs.create(buildElfAuditPayload(context.organizationId, "import_validations", "create", `ImportValidation created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapImportValidationSummary(created, maps);
    }

    async getImportPreviews(authUserId: string, email: string, fullName?: string | null): Promise<ImportPreviewSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.elfImportPreviews.listByOrganization(context.organizationId)).map((r) => mapImportPreviewSummary(r, maps));
    }

    async createImportPreview(authUserId: string, email: string, input: CreateImportPreviewInput, fullName?: string | null): Promise<ImportPreviewSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.elfImportPreviews.create(buildImportPreviewPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create importPreviews");
        await databaseService.elfAuditLogs.create(buildElfAuditPayload(context.organizationId, "import_previews", "create", `ImportPreview created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapImportPreviewSummary(created, maps);
    }

    async getImportHistorys(authUserId: string, email: string, fullName?: string | null): Promise<ImportHistorySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.elfImportHistory.listByOrganization(context.organizationId)).map((r) => mapImportHistorySummary(r, maps));
    }

    async createImportHistory(authUserId: string, email: string, input: CreateImportHistoryInput, fullName?: string | null): Promise<ImportHistorySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.elfImportHistory.create(buildImportHistoryPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create importHistory");
        await databaseService.elfAuditLogs.create(buildElfAuditPayload(context.organizationId, "import_history", "create", `ImportHistory created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapImportHistorySummary(created, maps);
    }

    async getGoLiveChecklists(authUserId: string, email: string, fullName?: string | null): Promise<GoLiveChecklistSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.elfGoLiveChecklists.listByOrganization(context.organizationId)).map((r) => mapGoLiveChecklistSummary(r, maps));
    }

    async createGoLiveChecklist(authUserId: string, email: string, input: CreateGoLiveChecklistInput, fullName?: string | null): Promise<GoLiveChecklistSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.elfGoLiveChecklists.create(buildGoLiveChecklistPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create goLiveChecklists");
        await databaseService.elfAuditLogs.create(buildElfAuditPayload(context.organizationId, "go_live_checklists", "create", `GoLiveChecklist created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapGoLiveChecklistSummary(created, maps);
    }

    async getGoLiveScores(authUserId: string, email: string, fullName?: string | null): Promise<GoLiveScoreSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.elfGoLiveScores.listByOrganization(context.organizationId)).map((r) => mapGoLiveScoreSummary(r, maps));
    }

    async createGoLiveScore(authUserId: string, email: string, input: CreateGoLiveScoreInput, fullName?: string | null): Promise<GoLiveScoreSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.elfGoLiveScores.create(buildGoLiveScorePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create goLiveScores");
        await databaseService.elfAuditLogs.create(buildElfAuditPayload(context.organizationId, "go_live_scores", "create", `GoLiveScore created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapGoLiveScoreSummary(created, maps);
    }

    async getDeploymentStatuss(authUserId: string, email: string, fullName?: string | null): Promise<DeploymentStatusSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.elfDeploymentStatuses.listByOrganization(context.organizationId)).map((r) => mapDeploymentStatusSummary(r, maps));
    }

    async createDeploymentStatus(authUserId: string, email: string, input: CreateDeploymentStatusInput, fullName?: string | null): Promise<DeploymentStatusSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.elfDeploymentStatuses.create(buildDeploymentStatusPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create deploymentStatuses");
        await databaseService.elfAuditLogs.create(buildElfAuditPayload(context.organizationId, "deployment_statuses", "create", `DeploymentStatus created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapDeploymentStatusSummary(created, maps);
    }

    async getReadinessValidations(authUserId: string, email: string, fullName?: string | null): Promise<ReadinessValidationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.elfReadinessValidations.listByOrganization(context.organizationId)).map((r) => mapReadinessValidationSummary(r, maps));
    }

    async createReadinessValidation(authUserId: string, email: string, input: CreateReadinessValidationInput, fullName?: string | null): Promise<ReadinessValidationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.elfReadinessValidations.create(buildReadinessValidationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create readinessValidations");
        await databaseService.elfAuditLogs.create(buildElfAuditPayload(context.organizationId, "readiness_validations", "create", `ReadinessValidation created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapReadinessValidationSummary(created, maps);
    }

    async getCustomerHealthScores(authUserId: string, email: string, fullName?: string | null): Promise<CustomerHealthScoreSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.elfCustomerHealthScores.listByOrganization(context.organizationId)).map((r) => mapCustomerHealthScoreSummary(r, maps));
    }

    async createCustomerHealthScore(authUserId: string, email: string, input: CreateCustomerHealthScoreInput, fullName?: string | null): Promise<CustomerHealthScoreSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.elfCustomerHealthScores.create(buildCustomerHealthScorePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create customerHealthScores");
        await databaseService.elfAuditLogs.create(buildElfAuditPayload(context.organizationId, "customer_health_scores", "create", `CustomerHealthScore created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapCustomerHealthScoreSummary(created, maps);
    }

    async getPlatformAdoptions(authUserId: string, email: string, fullName?: string | null): Promise<PlatformAdoptionSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.elfPlatformAdoption.listByOrganization(context.organizationId)).map((r) => mapPlatformAdoptionSummary(r, maps));
    }

    async createPlatformAdoption(authUserId: string, email: string, input: CreatePlatformAdoptionInput, fullName?: string | null): Promise<PlatformAdoptionSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.elfPlatformAdoption.create(buildPlatformAdoptionPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create platformAdoption");
        await databaseService.elfAuditLogs.create(buildElfAuditPayload(context.organizationId, "platform_adoption", "create", `PlatformAdoption created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapPlatformAdoptionSummary(created, maps);
    }

    async getFeatureUsages(authUserId: string, email: string, fullName?: string | null): Promise<FeatureUsageSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.elfFeatureUsage.listByOrganization(context.organizationId)).map((r) => mapFeatureUsageSummary(r, maps));
    }

    async createFeatureUsage(authUserId: string, email: string, input: CreateFeatureUsageInput, fullName?: string | null): Promise<FeatureUsageSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.elfFeatureUsage.create(buildFeatureUsagePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create featureUsage");
        await databaseService.elfAuditLogs.create(buildElfAuditPayload(context.organizationId, "feature_usage", "create", `FeatureUsage created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapFeatureUsageSummary(created, maps);
    }

    async getRenewalTrackings(authUserId: string, email: string, fullName?: string | null): Promise<RenewalTrackingSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.elfRenewalTracking.listByOrganization(context.organizationId)).map((r) => mapRenewalTrackingSummary(r, maps));
    }

    async createRenewalTracking(authUserId: string, email: string, input: CreateRenewalTrackingInput, fullName?: string | null): Promise<RenewalTrackingSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.elfRenewalTracking.create(buildRenewalTrackingPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create renewalTracking");
        await databaseService.elfAuditLogs.create(buildElfAuditPayload(context.organizationId, "renewal_tracking", "create", `RenewalTracking created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapRenewalTrackingSummary(created, maps);
    }

    async getSupportTickets(authUserId: string, email: string, fullName?: string | null): Promise<SupportTicketSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.elfSupportTickets.listByOrganization(context.organizationId)).map((r) => mapSupportTicketSummary(r, maps));
    }

    async createSupportTicket(authUserId: string, email: string, input: CreateSupportTicketInput, fullName?: string | null): Promise<SupportTicketSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.elfSupportTickets.create(buildSupportTicketPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create supportTickets");
        await databaseService.elfAuditLogs.create(buildElfAuditPayload(context.organizationId, "support_tickets", "create", `SupportTicket created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapSupportTicketSummary(created, maps);
    }

    async getKnowledgeBaseArticles(authUserId: string, email: string, fullName?: string | null): Promise<KnowledgeBaseArticleSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.elfKnowledgeBaseArticles.listByOrganization(context.organizationId)).map((r) => mapKnowledgeBaseArticleSummary(r, maps));
    }

    async createKnowledgeBaseArticle(authUserId: string, email: string, input: CreateKnowledgeBaseArticleInput, fullName?: string | null): Promise<KnowledgeBaseArticleSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.elfKnowledgeBaseArticles.create(buildKnowledgeBaseArticlePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create knowledgeBaseArticles");
        await databaseService.elfAuditLogs.create(buildElfAuditPayload(context.organizationId, "knowledge_base_articles", "create", `KnowledgeBaseArticle created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapKnowledgeBaseArticleSummary(created, maps);
    }

    async getIncidentTrackings(authUserId: string, email: string, fullName?: string | null): Promise<IncidentTrackingSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.elfIncidentTracking.listByOrganization(context.organizationId)).map((r) => mapIncidentTrackingSummary(r, maps));
    }

    async createIncidentTracking(authUserId: string, email: string, input: CreateIncidentTrackingInput, fullName?: string | null): Promise<IncidentTrackingSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.elfIncidentTracking.create(buildIncidentTrackingPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create incidentTracking");
        await databaseService.elfAuditLogs.create(buildElfAuditPayload(context.organizationId, "incident_tracking", "create", `IncidentTracking created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapIncidentTrackingSummary(created, maps);
    }

    async getCustomerRegistrys(authUserId: string, email: string, fullName?: string | null): Promise<CustomerRegistrySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.elfCustomerRegistry.listByOrganization(context.organizationId)).map((r) => mapCustomerRegistrySummary(r, maps));
    }

    async createCustomerRegistry(authUserId: string, email: string, input: CreateCustomerRegistryInput, fullName?: string | null): Promise<CustomerRegistrySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.elfCustomerRegistry.create(buildCustomerRegistryPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create customerRegistry");
        await databaseService.elfAuditLogs.create(buildElfAuditPayload(context.organizationId, "customer_registry", "create", `CustomerRegistry created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapCustomerRegistrySummary(created, maps);
    }

    async getSubscriptionRecords(authUserId: string, email: string, fullName?: string | null): Promise<SubscriptionRecordSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.elfSubscriptionRecords.listByOrganization(context.organizationId)).map((r) => mapSubscriptionRecordSummary(r, maps));
    }

    async createSubscriptionRecord(authUserId: string, email: string, input: CreateSubscriptionRecordInput, fullName?: string | null): Promise<SubscriptionRecordSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.elfSubscriptionRecords.create(buildSubscriptionRecordPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create subscriptionRecords");
        await databaseService.elfAuditLogs.create(buildElfAuditPayload(context.organizationId, "subscription_records", "create", `SubscriptionRecord created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapSubscriptionRecordSummary(created, maps);
    }

    async getLicenseManagements(authUserId: string, email: string, fullName?: string | null): Promise<LicenseManagementSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.elfLicenseManagement.listByOrganization(context.organizationId)).map((r) => mapLicenseManagementSummary(r, maps));
    }

    async createLicenseManagement(authUserId: string, email: string, input: CreateLicenseManagementInput, fullName?: string | null): Promise<LicenseManagementSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.elfLicenseManagement.create(buildLicenseManagementPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create licenseManagement");
        await databaseService.elfAuditLogs.create(buildElfAuditPayload(context.organizationId, "license_management", "create", `LicenseManagement created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapLicenseManagementSummary(created, maps);
    }

    async getLaunchMetrics(authUserId: string, email: string, fullName?: string | null): Promise<LaunchMetricSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.elfLaunchMetrics.listByOrganization(context.organizationId)).map(mapLaunchMetricSummary);
    }

    async createLaunchMetric(authUserId: string, email: string, input: CreateLaunchMetricInput, fullName?: string | null): Promise<LaunchMetricSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.elfLaunchMetrics.create(buildLaunchMetricPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create launchMetrics");
        await databaseService.elfAuditLogs.create(buildElfAuditPayload(context.organizationId, "launch_metrics", "create", `LaunchMetric created`, created.id));
        return mapLaunchMetricSummary(created);
    }

    async getLaunchHealths(authUserId: string, email: string, fullName?: string | null): Promise<LaunchHealthSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.elfLaunchHealth.listByOrganization(context.organizationId)).map(mapLaunchHealthSummary);
    }

    async createLaunchHealth(authUserId: string, email: string, input: CreateLaunchHealthInput, fullName?: string | null): Promise<LaunchHealthSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.elfLaunchHealth.create(buildLaunchHealthPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create launchHealth");
        await databaseService.elfAuditLogs.create(buildElfAuditPayload(context.organizationId, "launch_health", "create", `LaunchHealth created`, created.id));
        return mapLaunchHealthSummary(created);
    }

    async getMissionControlKpis(authUserId: string, email: string, fullName?: string | null): Promise<MissionControlKpiSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.elfMissionControlKpis.listByOrganization(context.organizationId)).map((r) => mapMissionControlKpiSummary(r, maps));
    }

    async createMissionControlKpi(authUserId: string, email: string, input: CreateMissionControlKpiInput, fullName?: string | null): Promise<MissionControlKpiSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.elfMissionControlKpis.create(buildMissionControlKpiPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create missionControlKpis");
        await databaseService.elfAuditLogs.create(buildElfAuditPayload(context.organizationId, "mission_control_kpis", "create", `MissionControlKpi created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapMissionControlKpiSummary(created, maps);
    }

    async getLaunchFailures(authUserId: string, email: string, fullName?: string | null): Promise<LaunchFailureSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.elfLaunchFailures.listByOrganization(context.organizationId)).map((r) => mapLaunchFailureSummary(r, maps));
    }

    async createLaunchFailure(authUserId: string, email: string, input: CreateLaunchFailureInput, fullName?: string | null): Promise<LaunchFailureSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.elfLaunchFailures.create(buildLaunchFailurePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create launchFailures");
        await databaseService.elfAuditLogs.create(buildElfAuditPayload(context.organizationId, "launch_failures", "create", `LaunchFailure created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapLaunchFailureSummary(created, maps);
    }

    async getAuditLogs(authUserId: string, email: string, fullName?: string | null): Promise<AuditEntry[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.elfAuditLogs.listByOrganization(context.organizationId)).map(mapAuditEntry);
    }

    async getLaunchHubOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.elfLaunchHubs.listByOrganization(context.organizationId)).map((r) => ({ id: r.id, name: r.hub_name }));
    }

    async sdkProvisionOrganization(authUserId: string, email: string, input: ElfSdkProvisionOrganizationInput, fullName?: string | null): Promise<ElfSdkProvisionOrganizationResult> {
        const ifr = createIndustryFrameworkClient(authUserId, email, fullName);
        await ifr.getFrameworkHubs();
        const saas = createCommercialSaasClient(authUserId, email, fullName);
        await saas.getTenants();
        const created = await this.createOrganizationProvision(authUserId, email, { launchHubId: input.launchHubId, provisionKey: input.provisionKey, provisionName: input.provisionName }, fullName);
        return { provisionId: created.id, provisionKey: created.provisionKey, status: created.status };
    }

    async sdkConfigureWizardProfile(authUserId: string, email: string, input: ElfSdkConfigureWizardProfileInput, fullName?: string | null): Promise<ElfSdkConfigureWizardProfileResult> {
        const dfe = createFormEngineClient(authUserId, email, fullName);
        await dfe.getFormHubs();
        const identity = createEnterpriseIdentityClient(authUserId, email, fullName);
        await identity.getRealms();
        const created = await this.createWizardProfile(authUserId, email, { launchHubId: input.launchHubId, profileKey: input.profileKey, profileName: input.profileName }, fullName);
        return { profileId: created.id, profileKey: created.profileKey, status: created.status };
    }

    async sdkRunGoLiveWorkflow(authUserId: string, email: string, input: ElfSdkRunGoLiveWorkflowInput, fullName?: string | null): Promise<ElfSdkRunGoLiveWorkflowResult> {
        const dwe = createWorkflowEngineClient(authUserId, email, fullName);
        await dwe.getWorkflowHubs();
        const bpf = createBusinessProcessClient(authUserId, email, fullName);
        await bpf.getProcessHubs();
        const dde = createDocumentEngineClient(authUserId, email, fullName);
        await dde.getDocumentHubs();
        const comm = createCommunicationHubClient(authUserId, email, fullName);
        await comm.getCommunicationHubs();
        const intg = createIntegrationPlatformClient(authUserId, email, fullName);
        await intg.getIntegrationHubs();
        const created = await this.createGoLiveChecklist(authUserId, email, { launchHubId: input.launchHubId, checklistKey: input.checklistKey, checklistName: input.checklistName }, fullName);
        return { checklistId: created.id, checklistKey: created.checklistKey, status: created.status };
    }
}

export const launchFoundationService = new LaunchFoundationService();
