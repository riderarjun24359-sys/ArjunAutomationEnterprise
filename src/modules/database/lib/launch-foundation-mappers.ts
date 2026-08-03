import type { DbElfLaunchHub,
    DbElfOrganizationProvision,
    DbElfTenantProvision,
    DbElfIndustryPackAssignment,
    DbElfModuleLicense,
    DbElfWizardProfile,
    DbElfWizardBranding,
    DbElfWizardDepartment,
    DbElfWizardSetting,
    DbElfImportJob,
    DbElfImportValidation,
    DbElfImportPreview,
    DbElfImportHistory,
    DbElfGoLiveChecklist,
    DbElfGoLiveScore,
    DbElfDeploymentStatus,
    DbElfReadinessValidation,
    DbElfCustomerHealthScore,
    DbElfPlatformAdoption,
    DbElfFeatureUsage,
    DbElfRenewalTracking,
    DbElfSupportTicket,
    DbElfKnowledgeBaseArticle,
    DbElfIncidentTracking,
    DbElfCustomerRegistry,
    DbElfSubscriptionRecord,
    DbElfLicenseManagement,
    DbElfLaunchMetric,
    DbElfLaunchHealth,
    DbElfMissionControlKpi,
    DbElfLaunchFailure,
    DbElfAuditLog } from "@/src/modules/database/types/platform";
import type { CreateLaunchHubInput,
    LaunchHubSummary,
    CreateOrganizationProvisionInput,
    OrganizationProvisionSummary,
    CreateTenantProvisionInput,
    TenantProvisionSummary,
    CreateIndustryPackAssignmentInput,
    IndustryPackAssignmentSummary,
    CreateModuleLicenseInput,
    ModuleLicenseSummary,
    CreateWizardProfileInput,
    WizardProfileSummary,
    CreateWizardBrandingInput,
    WizardBrandingSummary,
    CreateWizardDepartmentInput,
    WizardDepartmentSummary,
    CreateWizardSettingInput,
    WizardSettingSummary,
    CreateImportJobInput,
    ImportJobSummary,
    CreateImportValidationInput,
    ImportValidationSummary,
    CreateImportPreviewInput,
    ImportPreviewSummary,
    CreateImportHistoryInput,
    ImportHistorySummary,
    CreateGoLiveChecklistInput,
    GoLiveChecklistSummary,
    CreateGoLiveScoreInput,
    GoLiveScoreSummary,
    CreateDeploymentStatusInput,
    DeploymentStatusSummary,
    CreateReadinessValidationInput,
    ReadinessValidationSummary,
    CreateCustomerHealthScoreInput,
    CustomerHealthScoreSummary,
    CreatePlatformAdoptionInput,
    PlatformAdoptionSummary,
    CreateFeatureUsageInput,
    FeatureUsageSummary,
    CreateRenewalTrackingInput,
    RenewalTrackingSummary,
    CreateSupportTicketInput,
    SupportTicketSummary,
    CreateKnowledgeBaseArticleInput,
    KnowledgeBaseArticleSummary,
    CreateIncidentTrackingInput,
    IncidentTrackingSummary,
    CreateCustomerRegistryInput,
    CustomerRegistrySummary,
    CreateSubscriptionRecordInput,
    SubscriptionRecordSummary,
    CreateLicenseManagementInput,
    LicenseManagementSummary,
    CreateLaunchMetricInput,
    LaunchMetricSummary,
    CreateLaunchHealthInput,
    LaunchHealthSummary,
    CreateMissionControlKpiInput,
    MissionControlKpiSummary,
    CreateLaunchFailureInput,
    LaunchFailureSummary,
    ElfDashboardStats,
    ElfPipelineInfo,
    AuditEntry } from "@/src/modules/launch-foundation/types";

export function buildLaunchHubLookupMaps(hubs: DbElfLaunchHub[]) {
    const hubNameById = new Map(hubs.map((h) => [h.id, h.hub_name]));
    return { hubNameById };
}

export function buildElfPipelineInfo(): ElfPipelineInfo {
    const stages = [
        { key: "provisioning", label: "Provisioning" },
        { key: "config_wizard", label: "Config Wizard" },
        { key: "data_import", label: "Data Import" },
        { key: "go_live", label: "Go Live" },
        { key: "customer_success", label: "Customer Success" },
    ];
    return { stages, currentStage: "go_live", nextStage: "customer_success", previousStage: "data_import" };
}

export function buildElfAuditPayload(organizationId: string, entityType: string, action: string, summary: string, entityId?: string) {
    return { organization_id: organizationId, entity_type: entityType, action, summary, entity_id: entityId ?? null, metadata: {}, security_level: "standard" };
}

export function mapAuditEntry(record: DbElfAuditLog): AuditEntry {
    return { id: record.id, entityType: record.entity_type, entityId: record.entity_id, action: record.action, summary: record.summary, securityLevel: record.security_level, createdAt: record.created_at };
}

export function mapLaunchHubSummary(record: DbElfLaunchHub): LaunchHubSummary {
    return {
        id: record.id,
        hubKey: record.hub_key as string,
        hubName: record.hub_name as string,
        environment: record.environment as string,
        status: record.status,
    };
}

export function buildLaunchHubPayload(organizationId: string, input: CreateLaunchHubInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_key: input.hubKey ?? '',
        hub_name: input.hubName ?? '',
        environment: input.environment ?? '',
        status: "active",
    };
}

export function mapOrganizationProvisionSummary(record: DbElfOrganizationProvision, maps?: { hubNameById: Map<string, string> }): OrganizationProvisionSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        provisionKey: record.provision_key as string,
        provisionName: record.provision_name as string,
        provisionStatus: record.provision_status as string,
        status: record.status,
    };
}

export function buildOrganizationProvisionPayload(organizationId: string, input: CreateOrganizationProvisionInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.launchHubId,
        provision_key: input.provisionKey ?? '',
        provision_name: input.provisionName ?? '',
        provision_status: input.provisionStatus ?? '',
        status: "active",
    };
}

export function mapTenantProvisionSummary(record: DbElfTenantProvision, maps?: { hubNameById: Map<string, string> }): TenantProvisionSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        provisionKey: record.provision_key as string,
        tenantRef: record.tenant_ref as string,
        provisionStatus: record.provision_status as string,
        status: record.status,
    };
}

export function buildTenantProvisionPayload(organizationId: string, input: CreateTenantProvisionInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.launchHubId,
        provision_key: input.provisionKey ?? '',
        tenant_ref: input.tenantRef ?? '',
        provision_status: input.provisionStatus ?? '',
        status: "active",
    };
}

export function mapIndustryPackAssignmentSummary(record: DbElfIndustryPackAssignment, maps?: { hubNameById: Map<string, string> }): IndustryPackAssignmentSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        assignmentKey: record.assignment_key as string,
        packName: record.pack_name as string,
        packType: record.pack_type as string,
        status: record.status,
    };
}

export function buildIndustryPackAssignmentPayload(organizationId: string, input: CreateIndustryPackAssignmentInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.launchHubId,
        assignment_key: input.assignmentKey ?? '',
        pack_name: input.packName ?? '',
        pack_type: input.packType ?? '',
        status: "active",
    };
}

export function mapModuleLicenseSummary(record: DbElfModuleLicense, maps?: { hubNameById: Map<string, string> }): ModuleLicenseSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        licenseKey: record.license_key as string,
        moduleName: record.module_name as string,
        licenseStatus: record.license_status as string,
        status: record.status,
    };
}

export function buildModuleLicensePayload(organizationId: string, input: CreateModuleLicenseInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.launchHubId,
        license_key: input.licenseKey ?? '',
        module_name: input.moduleName ?? '',
        license_status: input.licenseStatus ?? '',
        status: "active",
    };
}

export function mapWizardProfileSummary(record: DbElfWizardProfile, maps?: { hubNameById: Map<string, string> }): WizardProfileSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        profileKey: record.profile_key as string,
        profileName: record.profile_name as string,
        profileType: record.profile_type as string,
        status: record.status,
    };
}

export function buildWizardProfilePayload(organizationId: string, input: CreateWizardProfileInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.launchHubId,
        profile_key: input.profileKey ?? '',
        profile_name: input.profileName ?? '',
        profile_type: input.profileType ?? '',
        status: "active",
    };
}

export function mapWizardBrandingSummary(record: DbElfWizardBranding, maps?: { hubNameById: Map<string, string> }): WizardBrandingSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        brandingKey: record.branding_key as string,
        brandingName: record.branding_name as string,
        brandColor: record.brand_color as string,
        status: record.status,
    };
}

export function buildWizardBrandingPayload(organizationId: string, input: CreateWizardBrandingInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.launchHubId,
        branding_key: input.brandingKey ?? '',
        branding_name: input.brandingName ?? '',
        brand_color: input.brandColor ?? '',
        status: "active",
    };
}

export function mapWizardDepartmentSummary(record: DbElfWizardDepartment, maps?: { hubNameById: Map<string, string> }): WizardDepartmentSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        departmentKey: record.department_key as string,
        departmentName: record.department_name as string,
        departmentType: record.department_type as string,
        status: record.status,
    };
}

export function buildWizardDepartmentPayload(organizationId: string, input: CreateWizardDepartmentInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.launchHubId,
        department_key: input.departmentKey ?? '',
        department_name: input.departmentName ?? '',
        department_type: input.departmentType ?? '',
        status: "active",
    };
}

export function mapWizardSettingSummary(record: DbElfWizardSetting, maps?: { hubNameById: Map<string, string> }): WizardSettingSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        settingKey: record.setting_key as string,
        settingName: record.setting_name as string,
        settingValue: record.setting_value as string,
        status: record.status,
    };
}

export function buildWizardSettingPayload(organizationId: string, input: CreateWizardSettingInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.launchHubId,
        setting_key: input.settingKey ?? '',
        setting_name: input.settingName ?? '',
        setting_value: input.settingValue ?? '',
        status: "active",
    };
}

export function mapImportJobSummary(record: DbElfImportJob, maps?: { hubNameById: Map<string, string> }): ImportJobSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        jobKey: record.job_key as string,
        jobName: record.job_name as string,
        jobStatus: record.job_status as string,
        status: record.status,
    };
}

export function buildImportJobPayload(organizationId: string, input: CreateImportJobInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.launchHubId,
        job_key: input.jobKey ?? '',
        job_name: input.jobName ?? '',
        job_status: input.jobStatus ?? '',
        status: "active",
    };
}

export function mapImportValidationSummary(record: DbElfImportValidation, maps?: { hubNameById: Map<string, string> }): ImportValidationSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        validationKey: record.validation_key as string,
        validationType: record.validation_type as string,
        validationScore: record.validation_score as number,
        status: record.status,
    };
}

export function buildImportValidationPayload(organizationId: string, input: CreateImportValidationInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.launchHubId,
        validation_key: input.validationKey ?? '',
        validation_type: input.validationType ?? '',
        validation_score: input.validationScore ?? 0,
        status: "active",
    };
}

export function mapImportPreviewSummary(record: DbElfImportPreview, maps?: { hubNameById: Map<string, string> }): ImportPreviewSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        previewKey: record.preview_key as string,
        previewName: record.preview_name as string,
        recordCount: record.record_count as number,
        status: record.status,
    };
}

export function buildImportPreviewPayload(organizationId: string, input: CreateImportPreviewInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.launchHubId,
        preview_key: input.previewKey ?? '',
        preview_name: input.previewName ?? '',
        record_count: input.recordCount ?? 0,
        status: "active",
    };
}

export function mapImportHistorySummary(record: DbElfImportHistory, maps?: { hubNameById: Map<string, string> }): ImportHistorySummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        historyKey: record.history_key as string,
        historyType: record.history_type as string,
        importedAt: record.imported_at as string,
        status: record.status,
    };
}

export function buildImportHistoryPayload(organizationId: string, input: CreateImportHistoryInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.launchHubId,
        history_key: input.historyKey ?? '',
        history_type: input.historyType ?? '',
        imported_at: input.importedAt ?? '',
        status: "active",
    };
}

export function mapGoLiveChecklistSummary(record: DbElfGoLiveChecklist, maps?: { hubNameById: Map<string, string> }): GoLiveChecklistSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        checklistKey: record.checklist_key as string,
        checklistName: record.checklist_name as string,
        completionScore: record.completion_score as number,
        status: record.status,
    };
}

export function buildGoLiveChecklistPayload(organizationId: string, input: CreateGoLiveChecklistInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.launchHubId,
        checklist_key: input.checklistKey ?? '',
        checklist_name: input.checklistName ?? '',
        completion_score: input.completionScore ?? 0,
        status: "active",
    };
}

export function mapGoLiveScoreSummary(record: DbElfGoLiveScore, maps?: { hubNameById: Map<string, string> }): GoLiveScoreSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        scoreKey: record.score_key as string,
        scoreType: record.score_type as string,
        goLiveScore: record.go_live_score as number,
        status: record.status,
    };
}

export function buildGoLiveScorePayload(organizationId: string, input: CreateGoLiveScoreInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.launchHubId,
        score_key: input.scoreKey ?? '',
        score_type: input.scoreType ?? '',
        go_live_score: input.goLiveScore ?? 0,
        status: "active",
    };
}

export function mapDeploymentStatusSummary(record: DbElfDeploymentStatus, maps?: { hubNameById: Map<string, string> }): DeploymentStatusSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        statusKey: record.status_key as string,
        deploymentName: record.deployment_name as string,
        deploymentStatus: record.deployment_status as string,
        status: record.status,
    };
}

export function buildDeploymentStatusPayload(organizationId: string, input: CreateDeploymentStatusInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.launchHubId,
        status_key: input.statusKey ?? '',
        deployment_name: input.deploymentName ?? '',
        deployment_status: input.deploymentStatus ?? '',
        status: "active",
    };
}

export function mapReadinessValidationSummary(record: DbElfReadinessValidation, maps?: { hubNameById: Map<string, string> }): ReadinessValidationSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        validationKey: record.validation_key as string,
        validationType: record.validation_type as string,
        validationScore: record.validation_score as number,
        status: record.status,
    };
}

export function buildReadinessValidationPayload(organizationId: string, input: CreateReadinessValidationInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.launchHubId,
        validation_key: input.validationKey ?? '',
        validation_type: input.validationType ?? '',
        validation_score: input.validationScore ?? 0,
        status: "active",
    };
}

export function mapCustomerHealthScoreSummary(record: DbElfCustomerHealthScore, maps?: { hubNameById: Map<string, string> }): CustomerHealthScoreSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        scoreKey: record.score_key as string,
        customerRef: record.customer_ref as string,
        healthScore: record.health_score as number,
        status: record.status,
    };
}

export function buildCustomerHealthScorePayload(organizationId: string, input: CreateCustomerHealthScoreInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.launchHubId,
        score_key: input.scoreKey ?? '',
        customer_ref: input.customerRef ?? '',
        health_score: input.healthScore ?? 0,
        status: "active",
    };
}

export function mapPlatformAdoptionSummary(record: DbElfPlatformAdoption, maps?: { hubNameById: Map<string, string> }): PlatformAdoptionSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        adoptionKey: record.adoption_key as string,
        featureName: record.feature_name as string,
        adoptionRate: record.adoption_rate as number,
        status: record.status,
    };
}

export function buildPlatformAdoptionPayload(organizationId: string, input: CreatePlatformAdoptionInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.launchHubId,
        adoption_key: input.adoptionKey ?? '',
        feature_name: input.featureName ?? '',
        adoption_rate: input.adoptionRate ?? 0,
        status: "active",
    };
}

export function mapFeatureUsageSummary(record: DbElfFeatureUsage, maps?: { hubNameById: Map<string, string> }): FeatureUsageSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        usageKey: record.usage_key as string,
        featureName: record.feature_name as string,
        usageCount: record.usage_count as number,
        status: record.status,
    };
}

export function buildFeatureUsagePayload(organizationId: string, input: CreateFeatureUsageInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.launchHubId,
        usage_key: input.usageKey ?? '',
        feature_name: input.featureName ?? '',
        usage_count: input.usageCount ?? 0,
        status: "active",
    };
}

export function mapRenewalTrackingSummary(record: DbElfRenewalTracking, maps?: { hubNameById: Map<string, string> }): RenewalTrackingSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        renewalKey: record.renewal_key as string,
        customerRef: record.customer_ref as string,
        renewalStatus: record.renewal_status as string,
        status: record.status,
    };
}

export function buildRenewalTrackingPayload(organizationId: string, input: CreateRenewalTrackingInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.launchHubId,
        renewal_key: input.renewalKey ?? '',
        customer_ref: input.customerRef ?? '',
        renewal_status: input.renewalStatus ?? '',
        status: "active",
    };
}

export function mapSupportTicketSummary(record: DbElfSupportTicket, maps?: { hubNameById: Map<string, string> }): SupportTicketSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        ticketKey: record.ticket_key as string,
        ticketTitle: record.ticket_title as string,
        ticketStatus: record.ticket_status as string,
        status: record.status,
    };
}

export function buildSupportTicketPayload(organizationId: string, input: CreateSupportTicketInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.launchHubId,
        ticket_key: input.ticketKey ?? '',
        ticket_title: input.ticketTitle ?? '',
        ticket_status: input.ticketStatus ?? '',
        status: "active",
    };
}

export function mapKnowledgeBaseArticleSummary(record: DbElfKnowledgeBaseArticle, maps?: { hubNameById: Map<string, string> }): KnowledgeBaseArticleSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        articleKey: record.article_key as string,
        articleTitle: record.article_title as string,
        articleCategory: record.article_category as string,
        status: record.status,
    };
}

export function buildKnowledgeBaseArticlePayload(organizationId: string, input: CreateKnowledgeBaseArticleInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.launchHubId,
        article_key: input.articleKey ?? '',
        article_title: input.articleTitle ?? '',
        article_category: input.articleCategory ?? '',
        status: "active",
    };
}

export function mapIncidentTrackingSummary(record: DbElfIncidentTracking, maps?: { hubNameById: Map<string, string> }): IncidentTrackingSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        incidentKey: record.incident_key as string,
        incidentTitle: record.incident_title as string,
        incidentSeverity: record.incident_severity as string,
        status: record.status,
    };
}

export function buildIncidentTrackingPayload(organizationId: string, input: CreateIncidentTrackingInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.launchHubId,
        incident_key: input.incidentKey ?? '',
        incident_title: input.incidentTitle ?? '',
        incident_severity: input.incidentSeverity ?? '',
        status: "active",
    };
}

export function mapCustomerRegistrySummary(record: DbElfCustomerRegistry, maps?: { hubNameById: Map<string, string> }): CustomerRegistrySummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        customerKey: record.customer_key as string,
        customerName: record.customer_name as string,
        customerTier: record.customer_tier as string,
        status: record.status,
    };
}

export function buildCustomerRegistryPayload(organizationId: string, input: CreateCustomerRegistryInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.launchHubId,
        customer_key: input.customerKey ?? '',
        customer_name: input.customerName ?? '',
        customer_tier: input.customerTier ?? '',
        status: "active",
    };
}

export function mapSubscriptionRecordSummary(record: DbElfSubscriptionRecord, maps?: { hubNameById: Map<string, string> }): SubscriptionRecordSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        subscriptionKey: record.subscription_key as string,
        planName: record.plan_name as string,
        subscriptionStatus: record.subscription_status as string,
        status: record.status,
    };
}

export function buildSubscriptionRecordPayload(organizationId: string, input: CreateSubscriptionRecordInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.launchHubId,
        subscription_key: input.subscriptionKey ?? '',
        plan_name: input.planName ?? '',
        subscription_status: input.subscriptionStatus ?? '',
        status: "active",
    };
}

export function mapLicenseManagementSummary(record: DbElfLicenseManagement, maps?: { hubNameById: Map<string, string> }): LicenseManagementSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        licenseKey: record.license_key as string,
        licenseType: record.license_type as string,
        licenseStatus: record.license_status as string,
        status: record.status,
    };
}

export function buildLicenseManagementPayload(organizationId: string, input: CreateLicenseManagementInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.launchHubId,
        license_key: input.licenseKey ?? '',
        license_type: input.licenseType ?? '',
        license_status: input.licenseStatus ?? '',
        status: "active",
    };
}

export function mapLaunchMetricSummary(record: DbElfLaunchMetric): LaunchMetricSummary {
    return {
        id: record.id,
        metricsKey: record.metrics_key as string,
        platformHealthScore: record.platform_health_score as number,
        overallLaunchScore: record.overall_launch_score as number,
        status: record.status,
    };
}

export function buildLaunchMetricPayload(organizationId: string, input: CreateLaunchMetricInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        metrics_key: input.metricsKey ?? '',
        platform_health_score: input.platformHealthScore ?? 0,
        overall_launch_score: input.overallLaunchScore ?? 0,
        status: "active",
    };
}

export function mapLaunchHealthSummary(record: DbElfLaunchHealth): LaunchHealthSummary {
    return {
        id: record.id,
        healthKey: record.health_key as string,
        overallScore: record.overall_score as number,
        disasterRecoveryMode: record.disaster_recovery_mode as boolean,
        status: record.status,
    };
}

export function buildLaunchHealthPayload(organizationId: string, input: CreateLaunchHealthInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        health_key: input.healthKey ?? '',
        overall_score: input.overallScore ?? 0,
        disaster_recovery_mode: input.disasterRecoveryMode ?? false,
        status: "active",
    };
}

export function mapMissionControlKpiSummary(record: DbElfMissionControlKpi, maps?: { hubNameById: Map<string, string> }): MissionControlKpiSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        kpiKey: record.kpi_key as string,
        kpiName: record.kpi_name as string,
        kpiScore: record.kpi_score as number,
        status: record.status,
    };
}

export function buildMissionControlKpiPayload(organizationId: string, input: CreateMissionControlKpiInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.launchHubId,
        kpi_key: input.kpiKey ?? '',
        kpi_name: input.kpiName ?? '',
        kpi_score: input.kpiScore ?? 0,
        status: "active",
    };
}

export function mapLaunchFailureSummary(record: DbElfLaunchFailure, maps?: { hubNameById: Map<string, string> }): LaunchFailureSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        failureKey: record.failure_key as string,
        failureType: record.failure_type as string,
        status: record.status,
    };
}

export function buildLaunchFailurePayload(organizationId: string, input: CreateLaunchFailureInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.launchHubId,
        failure_key: input.failureKey ?? '',
        failure_type: input.failureType ?? '',
        status: "active",
    };
}

export function mapOrganizationProvisionForStats(r: DbElfOrganizationProvision) { return { status: r.status }; }
export function mapImportJobForStats(r: DbElfImportJob) { return { job_status: r.job_status, status: r.status }; }
export function mapLaunchMetricForStats(r: DbElfLaunchMetric) {
    return {
        platform_health_score: r.platform_health_score,
        customer_health_score: r.customer_health_score,
        deployment_count: r.deployment_count,
        subscription_count: r.subscription_count,
        support_open_count: r.support_open_count,
        go_live_score: r.go_live_score,
        overall_launch_score: r.overall_launch_score,
        status: r.status,
    };
}
export function mapGoLiveChecklistForStats(r: DbElfGoLiveChecklist) { return { status: r.status }; }
export function mapCustomerRegistryForStats(r: DbElfCustomerRegistry) { return { status: r.status }; }
export function mapLaunchHealthForStats(r: DbElfLaunchHealth) { return { overall_score: r.overall_score, status: r.status }; }
export function mapLaunchFailureForStats(r: DbElfLaunchFailure) { return { status: r.status }; }

export function buildElfDashboardStats(input: {
    launchHubs: LaunchHubSummary[];
    organizationProvisions: ReturnType<typeof mapOrganizationProvisionForStats>[];
    launchMetrics: ReturnType<typeof mapLaunchMetricForStats>[];
    importJobs: ReturnType<typeof mapImportJobForStats>[];
    goLiveChecklists: ReturnType<typeof mapGoLiveChecklistForStats>[];
    customerRegistry: ReturnType<typeof mapCustomerRegistryForStats>[];
    launchHealth: ReturnType<typeof mapLaunchHealthForStats>[];
    launchFailures: LaunchFailureSummary[];
    auditLogs: AuditEntry[];
}): ElfDashboardStats {
    const activeHubs = input.launchHubs.filter((h) => h.status === "active").length;
    const latestMetrics = input.launchMetrics[0];
    const latestHealth = input.launchHealth[0];
    return {
        totalLaunchHubs: input.launchHubs.length,
        activeLaunchHubs: activeHubs,
        organizationProvisionCount: input.organizationProvisions.length,
        importJobCount: input.importJobs.length,
        goLiveChecklistCount: input.goLiveChecklists.length,
        customerRegistryCount: input.customerRegistry.length,
        openLaunchFailureCount: input.launchFailures.filter((f) => f.status === "open" || f.status === "failed").length,
        overallLaunchScore: latestMetrics?.overall_launch_score ?? latestHealth?.overall_score ?? 0,
        platformHealthScore: latestMetrics?.platform_health_score ?? 0,
        customerHealthScore: latestMetrics?.customer_health_score ?? 0,
        deploymentCount: latestMetrics?.deployment_count ?? 0,
        subscriptionCount: latestMetrics?.subscription_count ?? 0,
        supportOpenCount: latestMetrics?.support_open_count ?? 0,
        goLiveScore: latestMetrics?.go_live_score ?? 0,
        auditCount: input.auditLogs.length,
    };
}
