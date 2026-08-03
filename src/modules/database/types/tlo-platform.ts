export interface DbTloTenantContext {
    id: string;
    organization_id: string;
    context_key: string;
    company_name: string;
    lifecycle_stage: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbTloLifecycleRecord {
    id: string;
    organization_id: string;
    tenant_context_id: string;
    record_key: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbTloLifecycleTransition {
    id: string;
    organization_id: string;
    tenant_context_id: string;
    transition_key: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbTloLifecycleEvent {
    id: string;
    organization_id: string;
    tenant_context_id: string;
    event_key: string;
    status: string;
    created_at: string;
}

export interface DbTloReactivationRequest {
    id: string;
    organization_id: string;
    tenant_context_id: string;
    request_key: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbTloWorkspace {
    id: string;
    organization_id: string;
    tenant_context_id: string;
    workspace_key: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbTloEnvironmentSetting {
    id: string;
    organization_id: string;
    tenant_context_id: string;
    setting_key: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbTloStorageManagement {
    id: string;
    organization_id: string;
    tenant_context_id: string;
    storage_key: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbTloOperationsControl {
    id: string;
    organization_id: string;
    tenant_context_id: string;
    control_key: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbTloOnboardingFlow {
    id: string;
    organization_id: string;
    tenant_context_id: string;
    flow_key: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbTloOnboardingProgress {
    id: string;
    organization_id: string;
    tenant_context_id: string;
    progress_key: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbTloOnboardingValidation {
    id: string;
    organization_id: string;
    tenant_context_id: string;
    validation_key: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbTloGoLiveChecklist {
    id: string;
    organization_id: string;
    tenant_context_id: string;
    checklist_key: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbTloMarketplaceModule {
    id: string;
    organization_id: string;
    tenant_context_id: string;
    module_key: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbTloModuleInstallation {
    id: string;
    organization_id: string;
    tenant_context_id: string;
    installation_key: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbTloModuleDependency {
    id: string;
    organization_id: string;
    tenant_context_id: string;
    dependency_key: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbTloModuleCompatibility {
    id: string;
    organization_id: string;
    tenant_context_id: string;
    compatibility_key: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbTloIndustryPack {
    id: string;
    organization_id: string;
    tenant_context_id: string;
    pack_key: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbTloPackInstallation {
    id: string;
    organization_id: string;
    tenant_context_id: string;
    installation_key: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbTloPackVersion {
    id: string;
    organization_id: string;
    tenant_context_id: string;
    version_key: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbTloPackExport {
    id: string;
    organization_id: string;
    tenant_context_id: string;
    export_key: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbTloHealthSnapshot {
    id: string;
    organization_id: string;
    tenant_context_id: string;
    snapshot_key: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbTloHealthDimension {
    id: string;
    organization_id: string;
    tenant_context_id: string;
    dimension_key: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbTloHealthRisk {
    id: string;
    organization_id: string;
    tenant_context_id: string;
    risk_key: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbTloHealthScore {
    id: string;
    organization_id: string;
    tenant_context_id: string;
    score_key: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbTloSuccessPlan {
    id: string;
    organization_id: string;
    tenant_context_id: string;
    plan_key: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbTloQuarterlyReview {
    id: string;
    organization_id: string;
    tenant_context_id: string;
    review_key: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbTloRenewalPlan {
    id: string;
    organization_id: string;
    tenant_context_id: string;
    renewal_key: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbTloCustomerMilestone {
    id: string;
    organization_id: string;
    tenant_context_id: string;
    milestone_key: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbTloCommercialMetric {
    id: string;
    organization_id: string;
    metrics_key: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbTloGrowthSnapshot {
    id: string;
    organization_id: string;
    snapshot_key: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbTloExpansionOpportunity {
    id: string;
    organization_id: string;
    tenant_context_id: string;
    opportunity_key: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbTloAuditLog {
    id: string;
    organization_id: string;
    entity_type: string;
    entity_id?: string | null;
    action: string;
    summary: string;
    metadata: Record<string, unknown>;
    performed_by?: string | null;
    security_level: string;
    created_at: string;
}
