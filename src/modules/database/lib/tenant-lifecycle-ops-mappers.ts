import type {
    DbTloTenantContext,
    DbTloLifecycleRecord,
    DbTloLifecycleTransition,
    DbTloLifecycleEvent,
    DbTloReactivationRequest,
    DbTloWorkspace,
    DbTloEnvironmentSetting,
    DbTloStorageManagement,
    DbTloOperationsControl,
    DbTloOnboardingFlow,
    DbTloOnboardingProgress,
    DbTloOnboardingValidation,
    DbTloGoLiveChecklist,
    DbTloMarketplaceModule,
    DbTloModuleInstallation,
    DbTloModuleDependency,
    DbTloModuleCompatibility,
    DbTloIndustryPack,
    DbTloPackInstallation,
    DbTloPackVersion,
    DbTloPackExport,
    DbTloHealthSnapshot,
    DbTloHealthDimension,
    DbTloHealthRisk,
    DbTloHealthScore,
    DbTloSuccessPlan,
    DbTloQuarterlyReview,
    DbTloRenewalPlan,
    DbTloCustomerMilestone,
    DbTloCommercialMetric,
    DbTloGrowthSnapshot,
    DbTloExpansionOpportunity,
    DbTloAuditLog,
} from "@/src/modules/database/types/tlo-platform";
import type {
    CreateTenantContextInput,
    TenantContextSummary,
    CreateLifecycleRecordInput,
    LifecycleRecordSummary,
    CreateLifecycleTransitionInput,
    LifecycleTransitionSummary,
    CreateLifecycleEventInput,
    LifecycleEventSummary,
    CreateReactivationRequestInput,
    ReactivationRequestSummary,
    CreateWorkspaceInput,
    WorkspaceSummary,
    CreateEnvironmentSettingInput,
    EnvironmentSettingSummary,
    CreateStorageManagementInput,
    StorageManagementSummary,
    CreateOperationsControlInput,
    OperationsControlSummary,
    CreateOnboardingFlowInput,
    OnboardingFlowSummary,
    CreateOnboardingProgressInput,
    OnboardingProgressSummary,
    CreateOnboardingValidationInput,
    OnboardingValidationSummary,
    CreateGoLiveChecklistInput,
    GoLiveChecklistSummary,
    CreateMarketplaceModuleInput,
    MarketplaceModuleSummary,
    CreateModuleInstallationInput,
    ModuleInstallationSummary,
    CreateModuleDependencyInput,
    ModuleDependencySummary,
    CreateModuleCompatibilityInput,
    ModuleCompatibilitySummary,
    CreateIndustryPackInput,
    IndustryPackSummary,
    CreatePackInstallationInput,
    PackInstallationSummary,
    CreatePackVersionInput,
    PackVersionSummary,
    CreatePackExportInput,
    PackExportSummary,
    CreateHealthSnapshotInput,
    HealthSnapshotSummary,
    CreateHealthDimensionInput,
    HealthDimensionSummary,
    CreateHealthRiskInput,
    HealthRiskSummary,
    CreateHealthScoreInput,
    HealthScoreSummary,
    CreateSuccessPlanInput,
    SuccessPlanSummary,
    CreateQuarterlyReviewInput,
    QuarterlyReviewSummary,
    CreateRenewalPlanInput,
    RenewalPlanSummary,
    CreateCustomerMilestoneInput,
    CustomerMilestoneSummary,
    CreateCommercialMetricInput,
    CommercialMetricSummary,
    CreateGrowthSnapshotInput,
    GrowthSnapshotSummary,
    CreateExpansionOpportunityInput,
    ExpansionOpportunitySummary,
    TloDashboardStats,
    TloPipelineInfo,
    AuditEntry,
} from "@/src/modules/tenant-lifecycle-ops/types";

type LookupMaps = { tenantContexts: Map<string, DbTloTenantContext> };

export const buildTenantContextLookupMaps = (tenantContexts: DbTloTenantContext[]): LookupMaps => ({
    tenantContexts: new Map(tenantContexts.map((item) => [item.id, item])),
});

const tenantContextName = (maps: LookupMaps, id?: string | null) => (id ? maps.tenantContexts.get(id)?.company_name ?? null : null);

export const mapAuditEntry = (record: DbTloAuditLog): AuditEntry => ({
    id: record.id,
    entityType: record.entity_type,
    entityId: record.entity_id,
    action: record.action,
    summary: record.summary,
    securityLevel: record.security_level,
    createdAt: record.created_at,
});

export const buildTloAuditPayload = (organizationId: string, entityType: string, action: string, summary: string, entityId?: string, securityLevel = "standard") => ({
    organization_id: organizationId,
    entity_type: entityType,
    entity_id: entityId ?? null,
    action,
    summary,
    security_level: securityLevel,
});

export const buildTloDashboardStats = (input: {
    tenantContexts: TenantContextSummary[];
    lifecycleRecords: unknown[];
    reactivationRequests: { status: string }[];
    onboardingProgress: { status: string }[];
    marketplaceModules: unknown[];
    industryPacks: unknown[];
    healthSnapshots: { overallScore: number }[];
    expansionOpportunities: { status: string }[];
    auditLogs: unknown[];
}): TloDashboardStats => ({
    totalTenantContexts: input.tenantContexts.length,
    activeTenantContexts: input.tenantContexts.filter((t) => t.status === "active").length,
    lifecycleRecordCount: input.lifecycleRecords.length,
    openReactivationCount: input.reactivationRequests.filter((r) => r.status === "pending").length,
    onboardingInProgressCount: input.onboardingProgress.filter((p) => p.status === "in_progress").length,
    marketplaceModuleCount: input.marketplaceModules.length,
    industryPackCount: input.industryPacks.length,
    avgHealthScore: input.healthSnapshots.length ? input.healthSnapshots.reduce((s, h) => s + h.overallScore, 0) / input.healthSnapshots.length : 0,
    openExpansionCount: input.expansionOpportunities.filter((o) => o.status === "open").length,
    auditCount: input.auditLogs.length,
});

export const buildTloPipelineInfo = (): TloPipelineInfo => ({
    stages: [
        { key: "lead", label: "Lead" },
        { key: "trial", label: "Trial" },
        { key: "onboarding", label: "Onboarding" },
        { key: "active", label: "Active" },
        { key: "expansion", label: "Expansion" },
        { key: "renewal", label: "Renewal" },
    ],
    currentStage: "onboarding",
    nextStage: "active",
    previousStage: "trial",
});

export const mapTenantContextSummary = (record: DbTloTenantContext): TenantContextSummary => ({
    id: record.id,
    contextKey: record.context_key,
    companyName: record.company_name,
    lifecycleStage: record.lifecycle_stage,
    status: record.status,
});

export const mapLifecycleRecordSummary = (record: DbTloLifecycleRecord, maps: LookupMaps): LifecycleRecordSummary => ({
    id: record.id,
    tenantContextName: tenantContextName(maps, record.tenant_context_id) ?? "",
    recordKey: String((record as unknown as Record<string, unknown>).record_key ?? ""),
    
    status: record.status,
});

export const mapLifecycleTransitionSummary = (record: DbTloLifecycleTransition, maps: LookupMaps): LifecycleTransitionSummary => ({
    id: record.id,
    tenantContextName: tenantContextName(maps, record.tenant_context_id) ?? "",
    transitionKey: String((record as unknown as Record<string, unknown>).transition_key ?? ""),
    
    status: record.status,
});

export const mapLifecycleEventSummary = (record: DbTloLifecycleEvent, maps: LookupMaps): LifecycleEventSummary => ({
    id: record.id,
    tenantContextName: tenantContextName(maps, record.tenant_context_id) ?? "",
    eventKey: String((record as unknown as Record<string, unknown>).event_key ?? ""),
    
    status: record.status,
});

export const mapReactivationRequestSummary = (record: DbTloReactivationRequest, maps: LookupMaps): ReactivationRequestSummary => ({
    id: record.id,
    tenantContextName: tenantContextName(maps, record.tenant_context_id) ?? "",
    requestKey: String((record as unknown as Record<string, unknown>).request_key ?? ""),
    
    status: record.status,
});

export const mapWorkspaceSummary = (record: DbTloWorkspace, maps: LookupMaps): WorkspaceSummary => ({
    id: record.id,
    tenantContextName: tenantContextName(maps, record.tenant_context_id) ?? "",
    workspaceKey: String((record as unknown as Record<string, unknown>).workspace_key ?? ""),
    workspaceName: String((record as unknown as Record<string, unknown>).workspace_name ?? (record as unknown as Record<string, unknown>).workspace_key ?? ""),
    status: record.status,
});

export const mapEnvironmentSettingSummary = (record: DbTloEnvironmentSetting, maps: LookupMaps): EnvironmentSettingSummary => ({
    id: record.id,
    tenantContextName: tenantContextName(maps, record.tenant_context_id) ?? "",
    settingKey: String((record as unknown as Record<string, unknown>).setting_key ?? ""),
    
    status: record.status,
});

export const mapStorageManagementSummary = (record: DbTloStorageManagement, maps: LookupMaps): StorageManagementSummary => ({
    id: record.id,
    tenantContextName: tenantContextName(maps, record.tenant_context_id) ?? "",
    storageKey: String((record as unknown as Record<string, unknown>).storage_key ?? ""),
    
    status: record.status,
});

export const mapOperationsControlSummary = (record: DbTloOperationsControl, maps: LookupMaps): OperationsControlSummary => ({
    id: record.id,
    tenantContextName: tenantContextName(maps, record.tenant_context_id) ?? "",
    controlKey: String((record as unknown as Record<string, unknown>).control_key ?? ""),
    
    status: record.status,
});

export const mapOnboardingFlowSummary = (record: DbTloOnboardingFlow, maps: LookupMaps): OnboardingFlowSummary => ({
    id: record.id,
    tenantContextName: tenantContextName(maps, record.tenant_context_id) ?? "",
    flowKey: String((record as unknown as Record<string, unknown>).flow_key ?? ""),
    flowName: String((record as unknown as Record<string, unknown>).flow_name ?? (record as unknown as Record<string, unknown>).flow_key ?? ""),
    status: record.status,
});

export const mapOnboardingProgressSummary = (record: DbTloOnboardingProgress, maps: LookupMaps): OnboardingProgressSummary => ({
    id: record.id,
    tenantContextName: tenantContextName(maps, record.tenant_context_id) ?? "",
    progressKey: String((record as unknown as Record<string, unknown>).progress_key ?? ""),
    
    status: record.status,
});

export const mapOnboardingValidationSummary = (record: DbTloOnboardingValidation, maps: LookupMaps): OnboardingValidationSummary => ({
    id: record.id,
    tenantContextName: tenantContextName(maps, record.tenant_context_id) ?? "",
    validationKey: String((record as unknown as Record<string, unknown>).validation_key ?? ""),
    ruleName: String((record as unknown as Record<string, unknown>).rule_name ?? (record as unknown as Record<string, unknown>).validation_key ?? ""),
    status: record.status,
});

export const mapGoLiveChecklistSummary = (record: DbTloGoLiveChecklist, maps: LookupMaps): GoLiveChecklistSummary => ({
    id: record.id,
    tenantContextName: tenantContextName(maps, record.tenant_context_id) ?? "",
    checklistKey: String((record as unknown as Record<string, unknown>).checklist_key ?? ""),
    name: String((record as unknown as Record<string, unknown>).name ?? (record as unknown as Record<string, unknown>).checklist_key ?? ""),
    status: record.status,
});

export const mapMarketplaceModuleSummary = (record: DbTloMarketplaceModule, maps: LookupMaps): MarketplaceModuleSummary => ({
    id: record.id,
    tenantContextName: tenantContextName(maps, record.tenant_context_id) ?? "",
    moduleKey: String((record as unknown as Record<string, unknown>).module_key ?? ""),
    moduleName: String((record as unknown as Record<string, unknown>).module_name ?? (record as unknown as Record<string, unknown>).module_key ?? ""),
    status: record.status,
});

export const mapModuleInstallationSummary = (record: DbTloModuleInstallation, maps: LookupMaps): ModuleInstallationSummary => ({
    id: record.id,
    tenantContextName: tenantContextName(maps, record.tenant_context_id) ?? "",
    installationKey: String((record as unknown as Record<string, unknown>).installation_key ?? ""),
    
    status: record.status,
});

export const mapModuleDependencySummary = (record: DbTloModuleDependency, maps: LookupMaps): ModuleDependencySummary => ({
    id: record.id,
    tenantContextName: tenantContextName(maps, record.tenant_context_id) ?? "",
    dependencyKey: String((record as unknown as Record<string, unknown>).dependency_key ?? ""),
    
    status: record.status,
});

export const mapModuleCompatibilitySummary = (record: DbTloModuleCompatibility, maps: LookupMaps): ModuleCompatibilitySummary => ({
    id: record.id,
    tenantContextName: tenantContextName(maps, record.tenant_context_id) ?? "",
    compatibilityKey: String((record as unknown as Record<string, unknown>).compatibility_key ?? ""),
    
    status: record.status,
});

export const mapIndustryPackSummary = (record: DbTloIndustryPack, maps: LookupMaps): IndustryPackSummary => ({
    id: record.id,
    tenantContextName: tenantContextName(maps, record.tenant_context_id) ?? "",
    packKey: String((record as unknown as Record<string, unknown>).pack_key ?? ""),
    packName: String((record as unknown as Record<string, unknown>).pack_name ?? (record as unknown as Record<string, unknown>).pack_key ?? ""),
    status: record.status,
});

export const mapPackInstallationSummary = (record: DbTloPackInstallation, maps: LookupMaps): PackInstallationSummary => ({
    id: record.id,
    tenantContextName: tenantContextName(maps, record.tenant_context_id) ?? "",
    installationKey: String((record as unknown as Record<string, unknown>).installation_key ?? ""),
    
    status: record.status,
});

export const mapPackVersionSummary = (record: DbTloPackVersion, maps: LookupMaps): PackVersionSummary => ({
    id: record.id,
    tenantContextName: tenantContextName(maps, record.tenant_context_id) ?? "",
    versionKey: String((record as unknown as Record<string, unknown>).version_key ?? ""),
    versionNumber: String((record as unknown as Record<string, unknown>).version_number ?? (record as unknown as Record<string, unknown>).version_key ?? ""),
    status: record.status,
});

export const mapPackExportSummary = (record: DbTloPackExport, maps: LookupMaps): PackExportSummary => ({
    id: record.id,
    tenantContextName: tenantContextName(maps, record.tenant_context_id) ?? "",
    exportKey: String((record as unknown as Record<string, unknown>).export_key ?? ""),
    
    status: record.status,
});

export const mapHealthSnapshotSummary = (record: DbTloHealthSnapshot, maps: LookupMaps): HealthSnapshotSummary => ({
    id: record.id,
    tenantContextName: tenantContextName(maps, record.tenant_context_id) ?? "",
    snapshotKey: String((record as unknown as Record<string, unknown>).snapshot_key ?? ""),
    overallScore: Number((record as unknown as Record<string, unknown>).overall_score ?? 0),
    status: record.status,
});

export const mapHealthDimensionSummary = (record: DbTloHealthDimension, maps: LookupMaps): HealthDimensionSummary => ({
    id: record.id,
    tenantContextName: tenantContextName(maps, record.tenant_context_id) ?? "",
    dimensionKey: String((record as unknown as Record<string, unknown>).dimension_key ?? ""),
    dimensionName: String((record as unknown as Record<string, unknown>).dimension_name ?? (record as unknown as Record<string, unknown>).dimension_key ?? ""),
    status: record.status,
});

export const mapHealthRiskSummary = (record: DbTloHealthRisk, maps: LookupMaps): HealthRiskSummary => ({
    id: record.id,
    tenantContextName: tenantContextName(maps, record.tenant_context_id) ?? "",
    riskKey: String((record as unknown as Record<string, unknown>).risk_key ?? ""),
    title: String((record as unknown as Record<string, unknown>).title ?? (record as unknown as Record<string, unknown>).risk_key ?? ""),
    status: record.status,
});

export const mapHealthScoreSummary = (record: DbTloHealthScore, maps: LookupMaps): HealthScoreSummary => ({
    id: record.id,
    tenantContextName: tenantContextName(maps, record.tenant_context_id) ?? "",
    scoreKey: String((record as unknown as Record<string, unknown>).score_key ?? ""),
    
    status: record.status,
});

export const mapSuccessPlanSummary = (record: DbTloSuccessPlan, maps: LookupMaps): SuccessPlanSummary => ({
    id: record.id,
    tenantContextName: tenantContextName(maps, record.tenant_context_id) ?? "",
    planKey: String((record as unknown as Record<string, unknown>).plan_key ?? ""),
    planName: String((record as unknown as Record<string, unknown>).plan_name ?? (record as unknown as Record<string, unknown>).plan_key ?? ""),
    status: record.status,
});

export const mapQuarterlyReviewSummary = (record: DbTloQuarterlyReview, maps: LookupMaps): QuarterlyReviewSummary => ({
    id: record.id,
    tenantContextName: tenantContextName(maps, record.tenant_context_id) ?? "",
    reviewKey: String((record as unknown as Record<string, unknown>).review_key ?? ""),
    
    status: record.status,
});

export const mapRenewalPlanSummary = (record: DbTloRenewalPlan, maps: LookupMaps): RenewalPlanSummary => ({
    id: record.id,
    tenantContextName: tenantContextName(maps, record.tenant_context_id) ?? "",
    renewalKey: String((record as unknown as Record<string, unknown>).renewal_key ?? ""),
    
    status: record.status,
});

export const mapCustomerMilestoneSummary = (record: DbTloCustomerMilestone, maps: LookupMaps): CustomerMilestoneSummary => ({
    id: record.id,
    tenantContextName: tenantContextName(maps, record.tenant_context_id) ?? "",
    milestoneKey: String((record as unknown as Record<string, unknown>).milestone_key ?? ""),
    milestoneName: String((record as unknown as Record<string, unknown>).milestone_name ?? (record as unknown as Record<string, unknown>).milestone_key ?? ""),
    status: record.status,
});

export const mapCommercialMetricSummary = (record: DbTloCommercialMetric): CommercialMetricSummary => ({
    id: record.id,
    metricsKey: String((record as unknown as Record<string, unknown>).metrics_key ?? ""),
    
    status: record.status,
});

export const mapGrowthSnapshotSummary = (record: DbTloGrowthSnapshot): GrowthSnapshotSummary => ({
    id: record.id,
    snapshotKey: String((record as unknown as Record<string, unknown>).snapshot_key ?? ""),
    
    status: record.status,
});

export const mapExpansionOpportunitySummary = (record: DbTloExpansionOpportunity, maps: LookupMaps): ExpansionOpportunitySummary => ({
    id: record.id,
    tenantContextName: tenantContextName(maps, record.tenant_context_id) ?? "",
    opportunityKey: String((record as unknown as Record<string, unknown>).opportunity_key ?? ""),
    title: String((record as unknown as Record<string, unknown>).title ?? (record as unknown as Record<string, unknown>).opportunity_key ?? ""),
    status: record.status,
});

export const buildTenantContextPayload = (organizationId: string, input: CreateTenantContextInput) => ({
    organization_id: organizationId,
    context_key: input.contextKey ?? "",
    company_name: input.companyName ?? "",
    lifecycle_stage: input.lifecycleStage ?? "",
});

export const buildLifecycleRecordPayload = (organizationId: string, input: CreateLifecycleRecordInput) => ({
    organization_id: organizationId,
    tenant_context_id: input.tenantContextId,
    record_key: input.recordKey ?? "",
    current_stage: input.currentStage ?? "",
});

export const buildLifecycleTransitionPayload = (organizationId: string, input: CreateLifecycleTransitionInput) => ({
    organization_id: organizationId,
    tenant_context_id: input.tenantContextId,
    transition_key: input.transitionKey ?? "",
    from_stage: input.fromStage ?? "",
    to_stage: input.toStage ?? "",
});

export const buildLifecycleEventPayload = (organizationId: string, input: CreateLifecycleEventInput) => ({
    organization_id: organizationId,
    tenant_context_id: input.tenantContextId,
    event_key: input.eventKey ?? "",
    event_type: input.eventType ?? "",
    summary: input.summary ?? "",
});

export const buildReactivationRequestPayload = (organizationId: string, input: CreateReactivationRequestInput) => ({
    organization_id: organizationId,
    tenant_context_id: input.tenantContextId,
    request_key: input.requestKey ?? "",
    target_stage: input.targetStage ?? "",
});

export const buildWorkspacePayload = (organizationId: string, input: CreateWorkspaceInput) => ({
    organization_id: organizationId,
    tenant_context_id: input.tenantContextId,
    workspace_key: input.workspaceKey ?? "",
    workspace_name: input.workspaceName ?? "",
});

export const buildEnvironmentSettingPayload = (organizationId: string, input: CreateEnvironmentSettingInput) => ({
    organization_id: organizationId,
    tenant_context_id: input.tenantContextId,
    setting_key: input.settingKey ?? "",
    environment_name: input.environmentName ?? "",
});

export const buildStorageManagementPayload = (organizationId: string, input: CreateStorageManagementInput) => ({
    organization_id: organizationId,
    tenant_context_id: input.tenantContextId,
    storage_key: input.storageKey ?? "",
    storage_type: input.storageType ?? "",
});

export const buildOperationsControlPayload = (organizationId: string, input: CreateOperationsControlInput) => ({
    organization_id: organizationId,
    tenant_context_id: input.tenantContextId,
    control_key: input.controlKey ?? "",
});

export const buildOnboardingFlowPayload = (organizationId: string, input: CreateOnboardingFlowInput) => ({
    organization_id: organizationId,
    tenant_context_id: input.tenantContextId,
    flow_key: input.flowKey ?? "",
    flow_name: input.flowName ?? "",
});

export const buildOnboardingProgressPayload = (organizationId: string, input: CreateOnboardingProgressInput) => ({
    organization_id: organizationId,
    tenant_context_id: input.tenantContextId,
    progress_key: input.progressKey ?? "",
    current_step: input.currentStep ?? "",
});

export const buildOnboardingValidationPayload = (organizationId: string, input: CreateOnboardingValidationInput) => ({
    organization_id: organizationId,
    tenant_context_id: input.tenantContextId,
    validation_key: input.validationKey ?? "",
    rule_name: input.ruleName ?? "",
});

export const buildGoLiveChecklistPayload = (organizationId: string, input: CreateGoLiveChecklistInput) => ({
    organization_id: organizationId,
    tenant_context_id: input.tenantContextId,
    checklist_key: input.checklistKey ?? "",
    name: input.name ?? "",
});

export const buildMarketplaceModulePayload = (organizationId: string, input: CreateMarketplaceModuleInput) => ({
    organization_id: organizationId,
    tenant_context_id: input.tenantContextId,
    module_key: input.moduleKey ?? "",
    module_name: input.moduleName ?? "",
});

export const buildModuleInstallationPayload = (organizationId: string, input: CreateModuleInstallationInput) => ({
    organization_id: organizationId,
    tenant_context_id: input.tenantContextId,
    installation_key: input.installationKey ?? "",
});

export const buildModuleDependencyPayload = (organizationId: string, input: CreateModuleDependencyInput) => ({
    organization_id: organizationId,
    tenant_context_id: input.tenantContextId,
    dependency_key: input.dependencyKey ?? "",
});

export const buildModuleCompatibilityPayload = (organizationId: string, input: CreateModuleCompatibilityInput) => ({
    organization_id: organizationId,
    tenant_context_id: input.tenantContextId,
    compatibility_key: input.compatibilityKey ?? "",
});

export const buildIndustryPackPayload = (organizationId: string, input: CreateIndustryPackInput) => ({
    organization_id: organizationId,
    tenant_context_id: input.tenantContextId,
    pack_key: input.packKey ?? "",
    pack_name: input.packName ?? "",
    industry: input.industry ?? "",
});

export const buildPackInstallationPayload = (organizationId: string, input: CreatePackInstallationInput) => ({
    organization_id: organizationId,
    tenant_context_id: input.tenantContextId,
    installation_key: input.installationKey ?? "",
});

export const buildPackVersionPayload = (organizationId: string, input: CreatePackVersionInput) => ({
    organization_id: organizationId,
    tenant_context_id: input.tenantContextId,
    version_key: input.versionKey ?? "",
    version_number: input.versionNumber ?? "",
});

export const buildPackExportPayload = (organizationId: string, input: CreatePackExportInput) => ({
    organization_id: organizationId,
    tenant_context_id: input.tenantContextId,
    export_key: input.exportKey ?? "",
});

export const buildHealthSnapshotPayload = (organizationId: string, input: CreateHealthSnapshotInput) => ({
    organization_id: organizationId,
    tenant_context_id: input.tenantContextId,
    snapshot_key: input.snapshotKey ?? "",
    overall_score: input.overallScore ?? 0,
});

export const buildHealthDimensionPayload = (organizationId: string, input: CreateHealthDimensionInput) => ({
    organization_id: organizationId,
    tenant_context_id: input.tenantContextId,
    dimension_key: input.dimensionKey ?? "",
    dimension_name: input.dimensionName ?? "",
});

export const buildHealthRiskPayload = (organizationId: string, input: CreateHealthRiskInput) => ({
    organization_id: organizationId,
    tenant_context_id: input.tenantContextId,
    risk_key: input.riskKey ?? "",
    title: input.title ?? "",
    severity: input.severity ?? "",
});

export const buildHealthScorePayload = (organizationId: string, input: CreateHealthScoreInput) => ({
    organization_id: organizationId,
    tenant_context_id: input.tenantContextId,
    score_key: input.scoreKey ?? "",
    score_value: input.scoreValue ?? 0,
});

export const buildSuccessPlanPayload = (organizationId: string, input: CreateSuccessPlanInput) => ({
    organization_id: organizationId,
    tenant_context_id: input.tenantContextId,
    plan_key: input.planKey ?? "",
    plan_name: input.planName ?? "",
});

export const buildQuarterlyReviewPayload = (organizationId: string, input: CreateQuarterlyReviewInput) => ({
    organization_id: organizationId,
    tenant_context_id: input.tenantContextId,
    review_key: input.reviewKey ?? "",
    quarter: input.quarter ?? "",
});

export const buildRenewalPlanPayload = (organizationId: string, input: CreateRenewalPlanInput) => ({
    organization_id: organizationId,
    tenant_context_id: input.tenantContextId,
    renewal_key: input.renewalKey ?? "",
});

export const buildCustomerMilestonePayload = (organizationId: string, input: CreateCustomerMilestoneInput) => ({
    organization_id: organizationId,
    tenant_context_id: input.tenantContextId,
    milestone_key: input.milestoneKey ?? "",
    milestone_name: input.milestoneName ?? "",
});

export const buildCommercialMetricPayload = (organizationId: string, input: CreateCommercialMetricInput) => ({
    organization_id: organizationId,
    metrics_key: input.metricsKey ?? "",
    total_tenants: input.totalTenants ?? 0,
});

export const buildGrowthSnapshotPayload = (organizationId: string, input: CreateGrowthSnapshotInput) => ({
    organization_id: organizationId,
    snapshot_key: input.snapshotKey ?? "",
    growth_rate_percent: input.growthRatePercent ?? 0,
});

export const buildExpansionOpportunityPayload = (organizationId: string, input: CreateExpansionOpportunityInput) => ({
    organization_id: organizationId,
    tenant_context_id: input.tenantContextId,
    opportunity_key: input.opportunityKey ?? "",
    title: input.title ?? "",
});
