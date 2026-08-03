import {
    buildCommercialMetricPayload,
    buildCustomerMilestonePayload,
    buildEnvironmentSettingPayload,
    buildExpansionOpportunityPayload,
    buildGoLiveChecklistPayload,
    buildGrowthSnapshotPayload,
    buildHealthDimensionPayload,
    buildHealthRiskPayload,
    buildHealthScorePayload,
    buildHealthSnapshotPayload,
    buildIndustryPackPayload,
    buildLifecycleEventPayload,
    buildLifecycleRecordPayload,
    buildLifecycleTransitionPayload,
    buildMarketplaceModulePayload,
    buildModuleCompatibilityPayload,
    buildModuleDependencyPayload,
    buildModuleInstallationPayload,
    buildOnboardingFlowPayload,
    buildOnboardingProgressPayload,
    buildOnboardingValidationPayload,
    buildOperationsControlPayload,
    buildPackExportPayload,
    buildPackInstallationPayload,
    buildPackVersionPayload,
    buildQuarterlyReviewPayload,
    buildReactivationRequestPayload,
    buildRenewalPlanPayload,
    buildStorageManagementPayload,
    buildSuccessPlanPayload,
    buildTenantContextLookupMaps,
    buildTenantContextPayload,
    buildTloAuditPayload,
    buildTloDashboardStats,
    buildTloPipelineInfo,
    buildWorkspacePayload,
    mapAuditEntry,
    mapCommercialMetricSummary,
    mapCustomerMilestoneSummary,
    mapEnvironmentSettingSummary,
    mapExpansionOpportunitySummary,
    mapGoLiveChecklistSummary,
    mapGrowthSnapshotSummary,
    mapHealthDimensionSummary,
    mapHealthRiskSummary,
    mapHealthScoreSummary,
    mapHealthSnapshotSummary,
    mapIndustryPackSummary,
    mapLifecycleEventSummary,
    mapLifecycleRecordSummary,
    mapLifecycleTransitionSummary,
    mapMarketplaceModuleSummary,
    mapModuleCompatibilitySummary,
    mapModuleDependencySummary,
    mapModuleInstallationSummary,
    mapOnboardingFlowSummary,
    mapOnboardingProgressSummary,
    mapOnboardingValidationSummary,
    mapOperationsControlSummary,
    mapPackExportSummary,
    mapPackInstallationSummary,
    mapPackVersionSummary,
    mapQuarterlyReviewSummary,
    mapReactivationRequestSummary,
    mapRenewalPlanSummary,
    mapStorageManagementSummary,
    mapSuccessPlanSummary,
    mapTenantContextSummary,
    mapWorkspaceSummary,
} from "@/src/modules/database/lib/tenant-lifecycle-ops-mappers";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import { createAiOrchestrationClient } from "@/src/modules/ai-orchestration/sdk";
import { createKnowledgeClient } from "@/src/modules/knowledge/sdk";
import type {
    AuditEntry,
    CommercialMetricSummary,
    CreateCommercialMetricInput,
    CreateCustomerMilestoneInput,
    CreateEnvironmentSettingInput,
    CreateExpansionOpportunityInput,
    CreateGoLiveChecklistInput,
    CreateGrowthSnapshotInput,
    CreateHealthDimensionInput,
    CreateHealthRiskInput,
    CreateHealthScoreInput,
    CreateHealthSnapshotInput,
    CreateIndustryPackInput,
    CreateLifecycleEventInput,
    CreateLifecycleRecordInput,
    CreateLifecycleTransitionInput,
    CreateMarketplaceModuleInput,
    CreateModuleCompatibilityInput,
    CreateModuleDependencyInput,
    CreateModuleInstallationInput,
    CreateOnboardingFlowInput,
    CreateOnboardingProgressInput,
    CreateOnboardingValidationInput,
    CreateOperationsControlInput,
    CreatePackExportInput,
    CreatePackInstallationInput,
    CreatePackVersionInput,
    CreateQuarterlyReviewInput,
    CreateReactivationRequestInput,
    CreateRenewalPlanInput,
    CreateStorageManagementInput,
    CreateSuccessPlanInput,
    CreateTenantContextInput,
    CreateWorkspaceInput,
    CustomerMilestoneSummary,
    EnvironmentSettingSummary,
    ExpansionOpportunitySummary,
    GoLiveChecklistSummary,
    GrowthSnapshotSummary,
    HealthDimensionSummary,
    HealthRiskSummary,
    HealthScoreSummary,
    HealthSnapshotSummary,
    IndustryPackSummary,
    LifecycleEventSummary,
    LifecycleRecordSummary,
    LifecycleTransitionSummary,
    MarketplaceModuleSummary,
    ModuleCompatibilitySummary,
    ModuleDependencySummary,
    ModuleInstallationSummary,
    OnboardingFlowSummary,
    OnboardingProgressSummary,
    OnboardingValidationSummary,
    OperationsControlSummary,
    PackExportSummary,
    PackInstallationSummary,
    PackVersionSummary,
    QuarterlyReviewSummary,
    ReactivationRequestSummary,
    RenewalPlanSummary,
    StorageManagementSummary,
    SuccessPlanSummary,
    TenantContextSummary,
    TloDashboardStats,
    TloPipelineInfo,
    TloSdkInstallIndustryPackInput,
    TloSdkInstallIndustryPackResult,
    TloSdkProvisionTenantInput,
    TloSdkProvisionTenantResult,
    TloSdkTransitionLifecycleInput,
    TloSdkTransitionLifecycleResult,
    WorkspaceSummary,
} from "@/src/modules/tenant-lifecycle-ops/types";

export class TenantLifecycleOpsService {
    private async getContext(authUserId: string, email: string, fullName?: string | null) {
        return resolveOrganizationContext(authUserId, email, fullName);
    }

    private async getMaps(organizationId: string) {
        const tenantContexts = await databaseService.tloTenantContexts.listByOrganization(organizationId);
        return buildTenantContextLookupMaps(tenantContexts);
    }

    async getDashboardStats(authUserId: string, email: string, fullName?: string | null): Promise<TloDashboardStats> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return buildTloDashboardStats({ tenantContexts: [], lifecycleRecords: [], reactivationRequests: [], onboardingProgress: [], marketplaceModules: [], industryPacks: [], healthSnapshots: [], expansionOpportunities: [], auditLogs: [] });
        const [tenantContexts, lifecycleRecords, reactivationRequests, onboardingProgress, marketplaceModules, industryPacks, healthSnapshots, expansionOpportunities, auditLogs] = await Promise.all([
            this.getTenantContexts(authUserId, email, fullName),
            this.getLifecycleRecords(authUserId, email, fullName),
            this.getReactivationRequests(authUserId, email, fullName),
            this.getOnboardingProgress(authUserId, email, fullName),
            this.getMarketplaceModules(authUserId, email, fullName),
            this.getIndustryPacks(authUserId, email, fullName),
            this.getHealthSnapshots(authUserId, email, fullName),
            this.getExpansionOpportunities(authUserId, email, fullName),
            this.getAuditLogs(authUserId, email, fullName),
        ]);
        return buildTloDashboardStats({ tenantContexts, lifecycleRecords, reactivationRequests, onboardingProgress, marketplaceModules, industryPacks, healthSnapshots, expansionOpportunities, auditLogs });
    }

    getPipelineInfo(): TloPipelineInfo {
        return buildTloPipelineInfo();
    }

    async getTenantContexts(authUserId: string, email: string, fullName?: string | null): Promise<TenantContextSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.tloTenantContexts.listByOrganization(context.organizationId)).map(mapTenantContextSummary);
    }

    async createTenantContext(authUserId: string, email: string, input: CreateTenantContextInput, fullName?: string | null): Promise<TenantContextSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.tloTenantContexts.create(buildTenantContextPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create tenantContexts");
        await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "tenant_context", "create", `TenantContext created`, created.id));
        return mapTenantContextSummary(created);
    }

    async updateTenantContext(authUserId: string, email: string, id: string, input: Partial<CreateTenantContextInput>, fullName?: string | null): Promise<TenantContextSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const patch: Record<string, unknown> = {};
        if (input.contextKey !== undefined) patch.context_key = input.contextKey;
        if (input.companyName !== undefined) patch.company_name = input.companyName;
        if (input.lifecycleStage !== undefined) patch.lifecycle_stage = input.lifecycleStage;
        const updated = await databaseService.tloTenantContexts.update(id, patch);
        if (!updated) throw new Error("Failed to update tenantContexts");
        await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "tenant_context", "update", `TenantContext updated`, updated.id));
        return mapTenantContextSummary(updated);
    }

    async deleteTenantContext(authUserId: string, email: string, id: string, fullName?: string | null): Promise<boolean> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const ok = await databaseService.tloTenantContexts.delete(id);
        if (ok) await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "tenant_context", "delete", `TenantContext deleted`, id, "elevated"));
        return ok;
    }

    async getLifecycleRecords(authUserId: string, email: string, fullName?: string | null): Promise<LifecycleRecordSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.tloLifecycleRecords.listByOrganization(context.organizationId)).map((r) => mapLifecycleRecordSummary(r, maps));
    }

    async createLifecycleRecord(authUserId: string, email: string, input: CreateLifecycleRecordInput, fullName?: string | null): Promise<LifecycleRecordSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.tloLifecycleRecords.create(buildLifecycleRecordPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create lifecycleRecords");
        await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "lifecycle_record", "create", `LifecycleRecord created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapLifecycleRecordSummary(created, maps);
    }

    async updateLifecycleRecord(authUserId: string, email: string, id: string, input: Partial<CreateLifecycleRecordInput>, fullName?: string | null): Promise<LifecycleRecordSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const patch: Record<string, unknown> = {};
        if (input.recordKey !== undefined) patch.record_key = input.recordKey;
        if (input.currentStage !== undefined) patch.current_stage = input.currentStage;
        const updated = await databaseService.tloLifecycleRecords.update(id, patch);
        if (!updated) throw new Error("Failed to update lifecycleRecords");
        await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "lifecycle_record", "update", `LifecycleRecord updated`, updated.id));
        const maps = await this.getMaps(context.organizationId);
        return mapLifecycleRecordSummary(updated, maps);
    }

    async deleteLifecycleRecord(authUserId: string, email: string, id: string, fullName?: string | null): Promise<boolean> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const ok = await databaseService.tloLifecycleRecords.delete(id);
        if (ok) await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "lifecycle_record", "delete", `LifecycleRecord deleted`, id, "elevated"));
        return ok;
    }

    async getLifecycleTransitions(authUserId: string, email: string, fullName?: string | null): Promise<LifecycleTransitionSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.tloLifecycleTransitions.listByOrganization(context.organizationId)).map((r) => mapLifecycleTransitionSummary(r, maps));
    }

    async createLifecycleTransition(authUserId: string, email: string, input: CreateLifecycleTransitionInput, fullName?: string | null): Promise<LifecycleTransitionSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.tloLifecycleTransitions.create(buildLifecycleTransitionPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create lifecycleTransitions");
        await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "lifecycle_transition", "create", `LifecycleTransition created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapLifecycleTransitionSummary(created, maps);
    }

    async updateLifecycleTransition(authUserId: string, email: string, id: string, input: Partial<CreateLifecycleTransitionInput>, fullName?: string | null): Promise<LifecycleTransitionSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const patch: Record<string, unknown> = {};
        if (input.transitionKey !== undefined) patch.transition_key = input.transitionKey;
        if (input.fromStage !== undefined) patch.from_stage = input.fromStage;
        if (input.toStage !== undefined) patch.to_stage = input.toStage;
        const updated = await databaseService.tloLifecycleTransitions.update(id, patch);
        if (!updated) throw new Error("Failed to update lifecycleTransitions");
        await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "lifecycle_transition", "update", `LifecycleTransition updated`, updated.id));
        const maps = await this.getMaps(context.organizationId);
        return mapLifecycleTransitionSummary(updated, maps);
    }

    async deleteLifecycleTransition(authUserId: string, email: string, id: string, fullName?: string | null): Promise<boolean> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const ok = await databaseService.tloLifecycleTransitions.delete(id);
        if (ok) await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "lifecycle_transition", "delete", `LifecycleTransition deleted`, id, "elevated"));
        return ok;
    }

    async getLifecycleEvents(authUserId: string, email: string, fullName?: string | null): Promise<LifecycleEventSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.tloLifecycleEvents.listByOrganization(context.organizationId)).map((r) => mapLifecycleEventSummary(r, maps));
    }

    async createLifecycleEvent(authUserId: string, email: string, input: CreateLifecycleEventInput, fullName?: string | null): Promise<LifecycleEventSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.tloLifecycleEvents.create(buildLifecycleEventPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create lifecycleEvents");
        await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "lifecycle_event", "create", `LifecycleEvent created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapLifecycleEventSummary(created, maps);
    }

    async updateLifecycleEvent(authUserId: string, email: string, id: string, input: Partial<CreateLifecycleEventInput>, fullName?: string | null): Promise<LifecycleEventSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const patch: Record<string, unknown> = {};
        if (input.eventKey !== undefined) patch.event_key = input.eventKey;
        if (input.eventType !== undefined) patch.event_type = input.eventType;
        if (input.summary !== undefined) patch.summary = input.summary;
        const updated = await databaseService.tloLifecycleEvents.update(id, patch);
        if (!updated) throw new Error("Failed to update lifecycleEvents");
        await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "lifecycle_event", "update", `LifecycleEvent updated`, updated.id));
        const maps = await this.getMaps(context.organizationId);
        return mapLifecycleEventSummary(updated, maps);
    }

    async deleteLifecycleEvent(authUserId: string, email: string, id: string, fullName?: string | null): Promise<boolean> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const ok = await databaseService.tloLifecycleEvents.delete(id);
        if (ok) await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "lifecycle_event", "delete", `LifecycleEvent deleted`, id, "elevated"));
        return ok;
    }

    async getReactivationRequests(authUserId: string, email: string, fullName?: string | null): Promise<ReactivationRequestSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.tloReactivationRequests.listByOrganization(context.organizationId)).map((r) => mapReactivationRequestSummary(r, maps));
    }

    async createReactivationRequest(authUserId: string, email: string, input: CreateReactivationRequestInput, fullName?: string | null): Promise<ReactivationRequestSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.tloReactivationRequests.create(buildReactivationRequestPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create reactivationRequests");
        await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "reactivation_request", "create", `ReactivationRequest created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapReactivationRequestSummary(created, maps);
    }

    async updateReactivationRequest(authUserId: string, email: string, id: string, input: Partial<CreateReactivationRequestInput>, fullName?: string | null): Promise<ReactivationRequestSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const patch: Record<string, unknown> = {};
        if (input.requestKey !== undefined) patch.request_key = input.requestKey;
        if (input.targetStage !== undefined) patch.target_stage = input.targetStage;
        const updated = await databaseService.tloReactivationRequests.update(id, patch);
        if (!updated) throw new Error("Failed to update reactivationRequests");
        await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "reactivation_request", "update", `ReactivationRequest updated`, updated.id));
        const maps = await this.getMaps(context.organizationId);
        return mapReactivationRequestSummary(updated, maps);
    }

    async deleteReactivationRequest(authUserId: string, email: string, id: string, fullName?: string | null): Promise<boolean> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const ok = await databaseService.tloReactivationRequests.delete(id);
        if (ok) await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "reactivation_request", "delete", `ReactivationRequest deleted`, id, "elevated"));
        return ok;
    }

    async getWorkspaces(authUserId: string, email: string, fullName?: string | null): Promise<WorkspaceSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.tloWorkspaces.listByOrganization(context.organizationId)).map((r) => mapWorkspaceSummary(r, maps));
    }

    async createWorkspace(authUserId: string, email: string, input: CreateWorkspaceInput, fullName?: string | null): Promise<WorkspaceSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.tloWorkspaces.create(buildWorkspacePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create workspaces");
        await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "workspace", "create", `Workspace created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapWorkspaceSummary(created, maps);
    }

    async updateWorkspace(authUserId: string, email: string, id: string, input: Partial<CreateWorkspaceInput>, fullName?: string | null): Promise<WorkspaceSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const patch: Record<string, unknown> = {};
        if (input.workspaceKey !== undefined) patch.workspace_key = input.workspaceKey;
        if (input.workspaceName !== undefined) patch.workspace_name = input.workspaceName;
        const updated = await databaseService.tloWorkspaces.update(id, patch);
        if (!updated) throw new Error("Failed to update workspaces");
        await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "workspace", "update", `Workspace updated`, updated.id));
        const maps = await this.getMaps(context.organizationId);
        return mapWorkspaceSummary(updated, maps);
    }

    async deleteWorkspace(authUserId: string, email: string, id: string, fullName?: string | null): Promise<boolean> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const ok = await databaseService.tloWorkspaces.delete(id);
        if (ok) await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "workspace", "delete", `Workspace deleted`, id, "elevated"));
        return ok;
    }

    async getEnvironmentSettings(authUserId: string, email: string, fullName?: string | null): Promise<EnvironmentSettingSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.tloEnvironmentSettings.listByOrganization(context.organizationId)).map((r) => mapEnvironmentSettingSummary(r, maps));
    }

    async createEnvironmentSetting(authUserId: string, email: string, input: CreateEnvironmentSettingInput, fullName?: string | null): Promise<EnvironmentSettingSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.tloEnvironmentSettings.create(buildEnvironmentSettingPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create environmentSettings");
        await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "environment_setting", "create", `EnvironmentSetting created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapEnvironmentSettingSummary(created, maps);
    }

    async updateEnvironmentSetting(authUserId: string, email: string, id: string, input: Partial<CreateEnvironmentSettingInput>, fullName?: string | null): Promise<EnvironmentSettingSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const patch: Record<string, unknown> = {};
        if (input.settingKey !== undefined) patch.setting_key = input.settingKey;
        if (input.environmentName !== undefined) patch.environment_name = input.environmentName;
        const updated = await databaseService.tloEnvironmentSettings.update(id, patch);
        if (!updated) throw new Error("Failed to update environmentSettings");
        await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "environment_setting", "update", `EnvironmentSetting updated`, updated.id));
        const maps = await this.getMaps(context.organizationId);
        return mapEnvironmentSettingSummary(updated, maps);
    }

    async deleteEnvironmentSetting(authUserId: string, email: string, id: string, fullName?: string | null): Promise<boolean> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const ok = await databaseService.tloEnvironmentSettings.delete(id);
        if (ok) await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "environment_setting", "delete", `EnvironmentSetting deleted`, id, "elevated"));
        return ok;
    }

    async getStorageManagements(authUserId: string, email: string, fullName?: string | null): Promise<StorageManagementSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.tloStorageManagement.listByOrganization(context.organizationId)).map((r) => mapStorageManagementSummary(r, maps));
    }

    async createStorageManagement(authUserId: string, email: string, input: CreateStorageManagementInput, fullName?: string | null): Promise<StorageManagementSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.tloStorageManagement.create(buildStorageManagementPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create storageManagement");
        await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "storage_management", "create", `StorageManagement created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapStorageManagementSummary(created, maps);
    }

    async updateStorageManagement(authUserId: string, email: string, id: string, input: Partial<CreateStorageManagementInput>, fullName?: string | null): Promise<StorageManagementSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const patch: Record<string, unknown> = {};
        if (input.storageKey !== undefined) patch.storage_key = input.storageKey;
        if (input.storageType !== undefined) patch.storage_type = input.storageType;
        const updated = await databaseService.tloStorageManagement.update(id, patch);
        if (!updated) throw new Error("Failed to update storageManagement");
        await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "storage_management", "update", `StorageManagement updated`, updated.id));
        const maps = await this.getMaps(context.organizationId);
        return mapStorageManagementSummary(updated, maps);
    }

    async deleteStorageManagement(authUserId: string, email: string, id: string, fullName?: string | null): Promise<boolean> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const ok = await databaseService.tloStorageManagement.delete(id);
        if (ok) await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "storage_management", "delete", `StorageManagement deleted`, id, "elevated"));
        return ok;
    }

    async getOperationsControls(authUserId: string, email: string, fullName?: string | null): Promise<OperationsControlSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.tloOperationsControls.listByOrganization(context.organizationId)).map((r) => mapOperationsControlSummary(r, maps));
    }

    async createOperationsControl(authUserId: string, email: string, input: CreateOperationsControlInput, fullName?: string | null): Promise<OperationsControlSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.tloOperationsControls.create(buildOperationsControlPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create operationsControls");
        await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "operations_control", "create", `OperationsControl created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapOperationsControlSummary(created, maps);
    }

    async updateOperationsControl(authUserId: string, email: string, id: string, input: Partial<CreateOperationsControlInput>, fullName?: string | null): Promise<OperationsControlSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const patch: Record<string, unknown> = {};
        if (input.controlKey !== undefined) patch.control_key = input.controlKey;
        const updated = await databaseService.tloOperationsControls.update(id, patch);
        if (!updated) throw new Error("Failed to update operationsControls");
        await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "operations_control", "update", `OperationsControl updated`, updated.id));
        const maps = await this.getMaps(context.organizationId);
        return mapOperationsControlSummary(updated, maps);
    }

    async deleteOperationsControl(authUserId: string, email: string, id: string, fullName?: string | null): Promise<boolean> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const ok = await databaseService.tloOperationsControls.delete(id);
        if (ok) await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "operations_control", "delete", `OperationsControl deleted`, id, "elevated"));
        return ok;
    }

    async getOnboardingFlows(authUserId: string, email: string, fullName?: string | null): Promise<OnboardingFlowSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.tloOnboardingFlows.listByOrganization(context.organizationId)).map((r) => mapOnboardingFlowSummary(r, maps));
    }

    async createOnboardingFlow(authUserId: string, email: string, input: CreateOnboardingFlowInput, fullName?: string | null): Promise<OnboardingFlowSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.tloOnboardingFlows.create(buildOnboardingFlowPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create onboardingFlows");
        await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "onboarding_flow", "create", `OnboardingFlow created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapOnboardingFlowSummary(created, maps);
    }

    async updateOnboardingFlow(authUserId: string, email: string, id: string, input: Partial<CreateOnboardingFlowInput>, fullName?: string | null): Promise<OnboardingFlowSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const patch: Record<string, unknown> = {};
        if (input.flowKey !== undefined) patch.flow_key = input.flowKey;
        if (input.flowName !== undefined) patch.flow_name = input.flowName;
        const updated = await databaseService.tloOnboardingFlows.update(id, patch);
        if (!updated) throw new Error("Failed to update onboardingFlows");
        await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "onboarding_flow", "update", `OnboardingFlow updated`, updated.id));
        const maps = await this.getMaps(context.organizationId);
        return mapOnboardingFlowSummary(updated, maps);
    }

    async deleteOnboardingFlow(authUserId: string, email: string, id: string, fullName?: string | null): Promise<boolean> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const ok = await databaseService.tloOnboardingFlows.delete(id);
        if (ok) await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "onboarding_flow", "delete", `OnboardingFlow deleted`, id, "elevated"));
        return ok;
    }

    async getOnboardingProgress(authUserId: string, email: string, fullName?: string | null): Promise<OnboardingProgressSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.tloOnboardingProgress.listByOrganization(context.organizationId)).map((r) => mapOnboardingProgressSummary(r, maps));
    }

    async createOnboardingProgress(authUserId: string, email: string, input: CreateOnboardingProgressInput, fullName?: string | null): Promise<OnboardingProgressSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.tloOnboardingProgress.create(buildOnboardingProgressPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create onboardingProgress");
        await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "onboarding_progress", "create", `OnboardingProgress created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapOnboardingProgressSummary(created, maps);
    }

    async updateOnboardingProgress(authUserId: string, email: string, id: string, input: Partial<CreateOnboardingProgressInput>, fullName?: string | null): Promise<OnboardingProgressSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const patch: Record<string, unknown> = {};
        if (input.progressKey !== undefined) patch.progress_key = input.progressKey;
        if (input.currentStep !== undefined) patch.current_step = input.currentStep;
        const updated = await databaseService.tloOnboardingProgress.update(id, patch);
        if (!updated) throw new Error("Failed to update onboardingProgress");
        await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "onboarding_progress", "update", `OnboardingProgress updated`, updated.id));
        const maps = await this.getMaps(context.organizationId);
        return mapOnboardingProgressSummary(updated, maps);
    }

    async deleteOnboardingProgress(authUserId: string, email: string, id: string, fullName?: string | null): Promise<boolean> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const ok = await databaseService.tloOnboardingProgress.delete(id);
        if (ok) await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "onboarding_progress", "delete", `OnboardingProgress deleted`, id, "elevated"));
        return ok;
    }

    async getOnboardingValidations(authUserId: string, email: string, fullName?: string | null): Promise<OnboardingValidationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.tloOnboardingValidations.listByOrganization(context.organizationId)).map((r) => mapOnboardingValidationSummary(r, maps));
    }

    async createOnboardingValidation(authUserId: string, email: string, input: CreateOnboardingValidationInput, fullName?: string | null): Promise<OnboardingValidationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.tloOnboardingValidations.create(buildOnboardingValidationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create onboardingValidations");
        await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "onboarding_validation", "create", `OnboardingValidation created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapOnboardingValidationSummary(created, maps);
    }

    async updateOnboardingValidation(authUserId: string, email: string, id: string, input: Partial<CreateOnboardingValidationInput>, fullName?: string | null): Promise<OnboardingValidationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const patch: Record<string, unknown> = {};
        if (input.validationKey !== undefined) patch.validation_key = input.validationKey;
        if (input.ruleName !== undefined) patch.rule_name = input.ruleName;
        const updated = await databaseService.tloOnboardingValidations.update(id, patch);
        if (!updated) throw new Error("Failed to update onboardingValidations");
        await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "onboarding_validation", "update", `OnboardingValidation updated`, updated.id));
        const maps = await this.getMaps(context.organizationId);
        return mapOnboardingValidationSummary(updated, maps);
    }

    async deleteOnboardingValidation(authUserId: string, email: string, id: string, fullName?: string | null): Promise<boolean> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const ok = await databaseService.tloOnboardingValidations.delete(id);
        if (ok) await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "onboarding_validation", "delete", `OnboardingValidation deleted`, id, "elevated"));
        return ok;
    }

    async getGoLiveChecklists(authUserId: string, email: string, fullName?: string | null): Promise<GoLiveChecklistSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.tloGoLiveChecklists.listByOrganization(context.organizationId)).map((r) => mapGoLiveChecklistSummary(r, maps));
    }

    async createGoLiveChecklist(authUserId: string, email: string, input: CreateGoLiveChecklistInput, fullName?: string | null): Promise<GoLiveChecklistSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.tloGoLiveChecklists.create(buildGoLiveChecklistPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create goLiveChecklists");
        await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "go_live_checklist", "create", `GoLiveChecklist created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapGoLiveChecklistSummary(created, maps);
    }

    async updateGoLiveChecklist(authUserId: string, email: string, id: string, input: Partial<CreateGoLiveChecklistInput>, fullName?: string | null): Promise<GoLiveChecklistSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const patch: Record<string, unknown> = {};
        if (input.checklistKey !== undefined) patch.checklist_key = input.checklistKey;
        if (input.name !== undefined) patch.name = input.name;
        const updated = await databaseService.tloGoLiveChecklists.update(id, patch);
        if (!updated) throw new Error("Failed to update goLiveChecklists");
        await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "go_live_checklist", "update", `GoLiveChecklist updated`, updated.id));
        const maps = await this.getMaps(context.organizationId);
        return mapGoLiveChecklistSummary(updated, maps);
    }

    async deleteGoLiveChecklist(authUserId: string, email: string, id: string, fullName?: string | null): Promise<boolean> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const ok = await databaseService.tloGoLiveChecklists.delete(id);
        if (ok) await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "go_live_checklist", "delete", `GoLiveChecklist deleted`, id, "elevated"));
        return ok;
    }

    async getMarketplaceModules(authUserId: string, email: string, fullName?: string | null): Promise<MarketplaceModuleSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.tloMarketplaceModules.listByOrganization(context.organizationId)).map((r) => mapMarketplaceModuleSummary(r, maps));
    }

    async createMarketplaceModule(authUserId: string, email: string, input: CreateMarketplaceModuleInput, fullName?: string | null): Promise<MarketplaceModuleSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.tloMarketplaceModules.create(buildMarketplaceModulePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create marketplaceModules");
        await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "marketplace_module", "create", `MarketplaceModule created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapMarketplaceModuleSummary(created, maps);
    }

    async updateMarketplaceModule(authUserId: string, email: string, id: string, input: Partial<CreateMarketplaceModuleInput>, fullName?: string | null): Promise<MarketplaceModuleSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const patch: Record<string, unknown> = {};
        if (input.moduleKey !== undefined) patch.module_key = input.moduleKey;
        if (input.moduleName !== undefined) patch.module_name = input.moduleName;
        const updated = await databaseService.tloMarketplaceModules.update(id, patch);
        if (!updated) throw new Error("Failed to update marketplaceModules");
        await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "marketplace_module", "update", `MarketplaceModule updated`, updated.id));
        const maps = await this.getMaps(context.organizationId);
        return mapMarketplaceModuleSummary(updated, maps);
    }

    async deleteMarketplaceModule(authUserId: string, email: string, id: string, fullName?: string | null): Promise<boolean> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const ok = await databaseService.tloMarketplaceModules.delete(id);
        if (ok) await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "marketplace_module", "delete", `MarketplaceModule deleted`, id, "elevated"));
        return ok;
    }

    async getModuleInstallations(authUserId: string, email: string, fullName?: string | null): Promise<ModuleInstallationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.tloModuleInstallations.listByOrganization(context.organizationId)).map((r) => mapModuleInstallationSummary(r, maps));
    }

    async createModuleInstallation(authUserId: string, email: string, input: CreateModuleInstallationInput, fullName?: string | null): Promise<ModuleInstallationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.tloModuleInstallations.create(buildModuleInstallationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create moduleInstallations");
        await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "module_installation", "create", `ModuleInstallation created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapModuleInstallationSummary(created, maps);
    }

    async updateModuleInstallation(authUserId: string, email: string, id: string, input: Partial<CreateModuleInstallationInput>, fullName?: string | null): Promise<ModuleInstallationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const patch: Record<string, unknown> = {};
        if (input.installationKey !== undefined) patch.installation_key = input.installationKey;
        const updated = await databaseService.tloModuleInstallations.update(id, patch);
        if (!updated) throw new Error("Failed to update moduleInstallations");
        await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "module_installation", "update", `ModuleInstallation updated`, updated.id));
        const maps = await this.getMaps(context.organizationId);
        return mapModuleInstallationSummary(updated, maps);
    }

    async deleteModuleInstallation(authUserId: string, email: string, id: string, fullName?: string | null): Promise<boolean> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const ok = await databaseService.tloModuleInstallations.delete(id);
        if (ok) await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "module_installation", "delete", `ModuleInstallation deleted`, id, "elevated"));
        return ok;
    }

    async getModuleDependencys(authUserId: string, email: string, fullName?: string | null): Promise<ModuleDependencySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.tloModuleDependencies.listByOrganization(context.organizationId)).map((r) => mapModuleDependencySummary(r, maps));
    }

    async createModuleDependency(authUserId: string, email: string, input: CreateModuleDependencyInput, fullName?: string | null): Promise<ModuleDependencySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.tloModuleDependencies.create(buildModuleDependencyPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create moduleDependencies");
        await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "module_dependency", "create", `ModuleDependency created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapModuleDependencySummary(created, maps);
    }

    async updateModuleDependency(authUserId: string, email: string, id: string, input: Partial<CreateModuleDependencyInput>, fullName?: string | null): Promise<ModuleDependencySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const patch: Record<string, unknown> = {};
        if (input.dependencyKey !== undefined) patch.dependency_key = input.dependencyKey;
        const updated = await databaseService.tloModuleDependencies.update(id, patch);
        if (!updated) throw new Error("Failed to update moduleDependencies");
        await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "module_dependency", "update", `ModuleDependency updated`, updated.id));
        const maps = await this.getMaps(context.organizationId);
        return mapModuleDependencySummary(updated, maps);
    }

    async deleteModuleDependency(authUserId: string, email: string, id: string, fullName?: string | null): Promise<boolean> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const ok = await databaseService.tloModuleDependencies.delete(id);
        if (ok) await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "module_dependency", "delete", `ModuleDependency deleted`, id, "elevated"));
        return ok;
    }

    async getModuleCompatibilitys(authUserId: string, email: string, fullName?: string | null): Promise<ModuleCompatibilitySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.tloModuleCompatibility.listByOrganization(context.organizationId)).map((r) => mapModuleCompatibilitySummary(r, maps));
    }

    async createModuleCompatibility(authUserId: string, email: string, input: CreateModuleCompatibilityInput, fullName?: string | null): Promise<ModuleCompatibilitySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.tloModuleCompatibility.create(buildModuleCompatibilityPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create moduleCompatibility");
        await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "module_compatibility", "create", `ModuleCompatibility created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapModuleCompatibilitySummary(created, maps);
    }

    async updateModuleCompatibility(authUserId: string, email: string, id: string, input: Partial<CreateModuleCompatibilityInput>, fullName?: string | null): Promise<ModuleCompatibilitySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const patch: Record<string, unknown> = {};
        if (input.compatibilityKey !== undefined) patch.compatibility_key = input.compatibilityKey;
        const updated = await databaseService.tloModuleCompatibility.update(id, patch);
        if (!updated) throw new Error("Failed to update moduleCompatibility");
        await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "module_compatibility", "update", `ModuleCompatibility updated`, updated.id));
        const maps = await this.getMaps(context.organizationId);
        return mapModuleCompatibilitySummary(updated, maps);
    }

    async deleteModuleCompatibility(authUserId: string, email: string, id: string, fullName?: string | null): Promise<boolean> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const ok = await databaseService.tloModuleCompatibility.delete(id);
        if (ok) await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "module_compatibility", "delete", `ModuleCompatibility deleted`, id, "elevated"));
        return ok;
    }

    async getIndustryPacks(authUserId: string, email: string, fullName?: string | null): Promise<IndustryPackSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.tloIndustryPacks.listByOrganization(context.organizationId)).map((r) => mapIndustryPackSummary(r, maps));
    }

    async createIndustryPack(authUserId: string, email: string, input: CreateIndustryPackInput, fullName?: string | null): Promise<IndustryPackSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.tloIndustryPacks.create(buildIndustryPackPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create industryPacks");
        await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "industry_pack", "create", `IndustryPack created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapIndustryPackSummary(created, maps);
    }

    async updateIndustryPack(authUserId: string, email: string, id: string, input: Partial<CreateIndustryPackInput>, fullName?: string | null): Promise<IndustryPackSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const patch: Record<string, unknown> = {};
        if (input.packKey !== undefined) patch.pack_key = input.packKey;
        if (input.packName !== undefined) patch.pack_name = input.packName;
        if (input.industry !== undefined) patch.industry = input.industry;
        const updated = await databaseService.tloIndustryPacks.update(id, patch);
        if (!updated) throw new Error("Failed to update industryPacks");
        await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "industry_pack", "update", `IndustryPack updated`, updated.id));
        const maps = await this.getMaps(context.organizationId);
        return mapIndustryPackSummary(updated, maps);
    }

    async deleteIndustryPack(authUserId: string, email: string, id: string, fullName?: string | null): Promise<boolean> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const ok = await databaseService.tloIndustryPacks.delete(id);
        if (ok) await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "industry_pack", "delete", `IndustryPack deleted`, id, "elevated"));
        return ok;
    }

    async getPackInstallations(authUserId: string, email: string, fullName?: string | null): Promise<PackInstallationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.tloPackInstallations.listByOrganization(context.organizationId)).map((r) => mapPackInstallationSummary(r, maps));
    }

    async createPackInstallation(authUserId: string, email: string, input: CreatePackInstallationInput, fullName?: string | null): Promise<PackInstallationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.tloPackInstallations.create(buildPackInstallationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create packInstallations");
        await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "pack_installation", "create", `PackInstallation created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapPackInstallationSummary(created, maps);
    }

    async updatePackInstallation(authUserId: string, email: string, id: string, input: Partial<CreatePackInstallationInput>, fullName?: string | null): Promise<PackInstallationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const patch: Record<string, unknown> = {};
        if (input.installationKey !== undefined) patch.installation_key = input.installationKey;
        const updated = await databaseService.tloPackInstallations.update(id, patch);
        if (!updated) throw new Error("Failed to update packInstallations");
        await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "pack_installation", "update", `PackInstallation updated`, updated.id));
        const maps = await this.getMaps(context.organizationId);
        return mapPackInstallationSummary(updated, maps);
    }

    async deletePackInstallation(authUserId: string, email: string, id: string, fullName?: string | null): Promise<boolean> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const ok = await databaseService.tloPackInstallations.delete(id);
        if (ok) await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "pack_installation", "delete", `PackInstallation deleted`, id, "elevated"));
        return ok;
    }

    async getPackVersions(authUserId: string, email: string, fullName?: string | null): Promise<PackVersionSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.tloPackVersions.listByOrganization(context.organizationId)).map((r) => mapPackVersionSummary(r, maps));
    }

    async createPackVersion(authUserId: string, email: string, input: CreatePackVersionInput, fullName?: string | null): Promise<PackVersionSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.tloPackVersions.create(buildPackVersionPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create packVersions");
        await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "pack_version", "create", `PackVersion created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapPackVersionSummary(created, maps);
    }

    async updatePackVersion(authUserId: string, email: string, id: string, input: Partial<CreatePackVersionInput>, fullName?: string | null): Promise<PackVersionSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const patch: Record<string, unknown> = {};
        if (input.versionKey !== undefined) patch.version_key = input.versionKey;
        if (input.versionNumber !== undefined) patch.version_number = input.versionNumber;
        const updated = await databaseService.tloPackVersions.update(id, patch);
        if (!updated) throw new Error("Failed to update packVersions");
        await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "pack_version", "update", `PackVersion updated`, updated.id));
        const maps = await this.getMaps(context.organizationId);
        return mapPackVersionSummary(updated, maps);
    }

    async deletePackVersion(authUserId: string, email: string, id: string, fullName?: string | null): Promise<boolean> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const ok = await databaseService.tloPackVersions.delete(id);
        if (ok) await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "pack_version", "delete", `PackVersion deleted`, id, "elevated"));
        return ok;
    }

    async getPackExports(authUserId: string, email: string, fullName?: string | null): Promise<PackExportSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.tloPackExports.listByOrganization(context.organizationId)).map((r) => mapPackExportSummary(r, maps));
    }

    async createPackExport(authUserId: string, email: string, input: CreatePackExportInput, fullName?: string | null): Promise<PackExportSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.tloPackExports.create(buildPackExportPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create packExports");
        await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "pack_export", "create", `PackExport created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapPackExportSummary(created, maps);
    }

    async updatePackExport(authUserId: string, email: string, id: string, input: Partial<CreatePackExportInput>, fullName?: string | null): Promise<PackExportSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const patch: Record<string, unknown> = {};
        if (input.exportKey !== undefined) patch.export_key = input.exportKey;
        const updated = await databaseService.tloPackExports.update(id, patch);
        if (!updated) throw new Error("Failed to update packExports");
        await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "pack_export", "update", `PackExport updated`, updated.id));
        const maps = await this.getMaps(context.organizationId);
        return mapPackExportSummary(updated, maps);
    }

    async deletePackExport(authUserId: string, email: string, id: string, fullName?: string | null): Promise<boolean> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const ok = await databaseService.tloPackExports.delete(id);
        if (ok) await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "pack_export", "delete", `PackExport deleted`, id, "elevated"));
        return ok;
    }

    async getHealthSnapshots(authUserId: string, email: string, fullName?: string | null): Promise<HealthSnapshotSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.tloHealthSnapshots.listByOrganization(context.organizationId)).map((r) => mapHealthSnapshotSummary(r, maps));
    }

    async createHealthSnapshot(authUserId: string, email: string, input: CreateHealthSnapshotInput, fullName?: string | null): Promise<HealthSnapshotSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.tloHealthSnapshots.create(buildHealthSnapshotPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create healthSnapshots");
        await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "health_snapshot", "create", `HealthSnapshot created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapHealthSnapshotSummary(created, maps);
    }

    async updateHealthSnapshot(authUserId: string, email: string, id: string, input: Partial<CreateHealthSnapshotInput>, fullName?: string | null): Promise<HealthSnapshotSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const patch: Record<string, unknown> = {};
        if (input.snapshotKey !== undefined) patch.snapshot_key = input.snapshotKey;
        if (input.overallScore !== undefined) patch.overall_score = input.overallScore;
        const updated = await databaseService.tloHealthSnapshots.update(id, patch);
        if (!updated) throw new Error("Failed to update healthSnapshots");
        await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "health_snapshot", "update", `HealthSnapshot updated`, updated.id));
        const maps = await this.getMaps(context.organizationId);
        return mapHealthSnapshotSummary(updated, maps);
    }

    async deleteHealthSnapshot(authUserId: string, email: string, id: string, fullName?: string | null): Promise<boolean> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const ok = await databaseService.tloHealthSnapshots.delete(id);
        if (ok) await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "health_snapshot", "delete", `HealthSnapshot deleted`, id, "elevated"));
        return ok;
    }

    async getHealthDimensions(authUserId: string, email: string, fullName?: string | null): Promise<HealthDimensionSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.tloHealthDimensions.listByOrganization(context.organizationId)).map((r) => mapHealthDimensionSummary(r, maps));
    }

    async createHealthDimension(authUserId: string, email: string, input: CreateHealthDimensionInput, fullName?: string | null): Promise<HealthDimensionSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.tloHealthDimensions.create(buildHealthDimensionPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create healthDimensions");
        await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "health_dimension", "create", `HealthDimension created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapHealthDimensionSummary(created, maps);
    }

    async updateHealthDimension(authUserId: string, email: string, id: string, input: Partial<CreateHealthDimensionInput>, fullName?: string | null): Promise<HealthDimensionSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const patch: Record<string, unknown> = {};
        if (input.dimensionKey !== undefined) patch.dimension_key = input.dimensionKey;
        if (input.dimensionName !== undefined) patch.dimension_name = input.dimensionName;
        const updated = await databaseService.tloHealthDimensions.update(id, patch);
        if (!updated) throw new Error("Failed to update healthDimensions");
        await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "health_dimension", "update", `HealthDimension updated`, updated.id));
        const maps = await this.getMaps(context.organizationId);
        return mapHealthDimensionSummary(updated, maps);
    }

    async deleteHealthDimension(authUserId: string, email: string, id: string, fullName?: string | null): Promise<boolean> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const ok = await databaseService.tloHealthDimensions.delete(id);
        if (ok) await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "health_dimension", "delete", `HealthDimension deleted`, id, "elevated"));
        return ok;
    }

    async getHealthRisks(authUserId: string, email: string, fullName?: string | null): Promise<HealthRiskSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.tloHealthRisks.listByOrganization(context.organizationId)).map((r) => mapHealthRiskSummary(r, maps));
    }

    async createHealthRisk(authUserId: string, email: string, input: CreateHealthRiskInput, fullName?: string | null): Promise<HealthRiskSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.tloHealthRisks.create(buildHealthRiskPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create healthRisks");
        await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "health_risk", "create", `HealthRisk created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapHealthRiskSummary(created, maps);
    }

    async updateHealthRisk(authUserId: string, email: string, id: string, input: Partial<CreateHealthRiskInput>, fullName?: string | null): Promise<HealthRiskSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const patch: Record<string, unknown> = {};
        if (input.riskKey !== undefined) patch.risk_key = input.riskKey;
        if (input.title !== undefined) patch.title = input.title;
        if (input.severity !== undefined) patch.severity = input.severity;
        const updated = await databaseService.tloHealthRisks.update(id, patch);
        if (!updated) throw new Error("Failed to update healthRisks");
        await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "health_risk", "update", `HealthRisk updated`, updated.id));
        const maps = await this.getMaps(context.organizationId);
        return mapHealthRiskSummary(updated, maps);
    }

    async deleteHealthRisk(authUserId: string, email: string, id: string, fullName?: string | null): Promise<boolean> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const ok = await databaseService.tloHealthRisks.delete(id);
        if (ok) await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "health_risk", "delete", `HealthRisk deleted`, id, "elevated"));
        return ok;
    }

    async getHealthScores(authUserId: string, email: string, fullName?: string | null): Promise<HealthScoreSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.tloHealthScores.listByOrganization(context.organizationId)).map((r) => mapHealthScoreSummary(r, maps));
    }

    async createHealthScore(authUserId: string, email: string, input: CreateHealthScoreInput, fullName?: string | null): Promise<HealthScoreSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.tloHealthScores.create(buildHealthScorePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create healthScores");
        await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "health_score", "create", `HealthScore created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapHealthScoreSummary(created, maps);
    }

    async updateHealthScore(authUserId: string, email: string, id: string, input: Partial<CreateHealthScoreInput>, fullName?: string | null): Promise<HealthScoreSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const patch: Record<string, unknown> = {};
        if (input.scoreKey !== undefined) patch.score_key = input.scoreKey;
        if (input.scoreValue !== undefined) patch.score_value = input.scoreValue;
        const updated = await databaseService.tloHealthScores.update(id, patch);
        if (!updated) throw new Error("Failed to update healthScores");
        await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "health_score", "update", `HealthScore updated`, updated.id));
        const maps = await this.getMaps(context.organizationId);
        return mapHealthScoreSummary(updated, maps);
    }

    async deleteHealthScore(authUserId: string, email: string, id: string, fullName?: string | null): Promise<boolean> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const ok = await databaseService.tloHealthScores.delete(id);
        if (ok) await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "health_score", "delete", `HealthScore deleted`, id, "elevated"));
        return ok;
    }

    async getSuccessPlans(authUserId: string, email: string, fullName?: string | null): Promise<SuccessPlanSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.tloSuccessPlans.listByOrganization(context.organizationId)).map((r) => mapSuccessPlanSummary(r, maps));
    }

    async createSuccessPlan(authUserId: string, email: string, input: CreateSuccessPlanInput, fullName?: string | null): Promise<SuccessPlanSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.tloSuccessPlans.create(buildSuccessPlanPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create successPlans");
        await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "success_plan", "create", `SuccessPlan created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapSuccessPlanSummary(created, maps);
    }

    async updateSuccessPlan(authUserId: string, email: string, id: string, input: Partial<CreateSuccessPlanInput>, fullName?: string | null): Promise<SuccessPlanSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const patch: Record<string, unknown> = {};
        if (input.planKey !== undefined) patch.plan_key = input.planKey;
        if (input.planName !== undefined) patch.plan_name = input.planName;
        const updated = await databaseService.tloSuccessPlans.update(id, patch);
        if (!updated) throw new Error("Failed to update successPlans");
        await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "success_plan", "update", `SuccessPlan updated`, updated.id));
        const maps = await this.getMaps(context.organizationId);
        return mapSuccessPlanSummary(updated, maps);
    }

    async deleteSuccessPlan(authUserId: string, email: string, id: string, fullName?: string | null): Promise<boolean> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const ok = await databaseService.tloSuccessPlans.delete(id);
        if (ok) await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "success_plan", "delete", `SuccessPlan deleted`, id, "elevated"));
        return ok;
    }

    async getQuarterlyReviews(authUserId: string, email: string, fullName?: string | null): Promise<QuarterlyReviewSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.tloQuarterlyReviews.listByOrganization(context.organizationId)).map((r) => mapQuarterlyReviewSummary(r, maps));
    }

    async createQuarterlyReview(authUserId: string, email: string, input: CreateQuarterlyReviewInput, fullName?: string | null): Promise<QuarterlyReviewSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.tloQuarterlyReviews.create(buildQuarterlyReviewPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create quarterlyReviews");
        await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "quarterly_review", "create", `QuarterlyReview created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapQuarterlyReviewSummary(created, maps);
    }

    async updateQuarterlyReview(authUserId: string, email: string, id: string, input: Partial<CreateQuarterlyReviewInput>, fullName?: string | null): Promise<QuarterlyReviewSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const patch: Record<string, unknown> = {};
        if (input.reviewKey !== undefined) patch.review_key = input.reviewKey;
        if (input.quarter !== undefined) patch.quarter = input.quarter;
        const updated = await databaseService.tloQuarterlyReviews.update(id, patch);
        if (!updated) throw new Error("Failed to update quarterlyReviews");
        await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "quarterly_review", "update", `QuarterlyReview updated`, updated.id));
        const maps = await this.getMaps(context.organizationId);
        return mapQuarterlyReviewSummary(updated, maps);
    }

    async deleteQuarterlyReview(authUserId: string, email: string, id: string, fullName?: string | null): Promise<boolean> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const ok = await databaseService.tloQuarterlyReviews.delete(id);
        if (ok) await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "quarterly_review", "delete", `QuarterlyReview deleted`, id, "elevated"));
        return ok;
    }

    async getRenewalPlans(authUserId: string, email: string, fullName?: string | null): Promise<RenewalPlanSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.tloRenewalPlans.listByOrganization(context.organizationId)).map((r) => mapRenewalPlanSummary(r, maps));
    }

    async createRenewalPlan(authUserId: string, email: string, input: CreateRenewalPlanInput, fullName?: string | null): Promise<RenewalPlanSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.tloRenewalPlans.create(buildRenewalPlanPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create renewalPlans");
        await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "renewal_plan", "create", `RenewalPlan created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapRenewalPlanSummary(created, maps);
    }

    async updateRenewalPlan(authUserId: string, email: string, id: string, input: Partial<CreateRenewalPlanInput>, fullName?: string | null): Promise<RenewalPlanSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const patch: Record<string, unknown> = {};
        if (input.renewalKey !== undefined) patch.renewal_key = input.renewalKey;
        const updated = await databaseService.tloRenewalPlans.update(id, patch);
        if (!updated) throw new Error("Failed to update renewalPlans");
        await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "renewal_plan", "update", `RenewalPlan updated`, updated.id));
        const maps = await this.getMaps(context.organizationId);
        return mapRenewalPlanSummary(updated, maps);
    }

    async deleteRenewalPlan(authUserId: string, email: string, id: string, fullName?: string | null): Promise<boolean> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const ok = await databaseService.tloRenewalPlans.delete(id);
        if (ok) await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "renewal_plan", "delete", `RenewalPlan deleted`, id, "elevated"));
        return ok;
    }

    async getCustomerMilestones(authUserId: string, email: string, fullName?: string | null): Promise<CustomerMilestoneSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.tloCustomerMilestones.listByOrganization(context.organizationId)).map((r) => mapCustomerMilestoneSummary(r, maps));
    }

    async createCustomerMilestone(authUserId: string, email: string, input: CreateCustomerMilestoneInput, fullName?: string | null): Promise<CustomerMilestoneSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.tloCustomerMilestones.create(buildCustomerMilestonePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create customerMilestones");
        await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "customer_milestone", "create", `CustomerMilestone created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapCustomerMilestoneSummary(created, maps);
    }

    async updateCustomerMilestone(authUserId: string, email: string, id: string, input: Partial<CreateCustomerMilestoneInput>, fullName?: string | null): Promise<CustomerMilestoneSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const patch: Record<string, unknown> = {};
        if (input.milestoneKey !== undefined) patch.milestone_key = input.milestoneKey;
        if (input.milestoneName !== undefined) patch.milestone_name = input.milestoneName;
        const updated = await databaseService.tloCustomerMilestones.update(id, patch);
        if (!updated) throw new Error("Failed to update customerMilestones");
        await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "customer_milestone", "update", `CustomerMilestone updated`, updated.id));
        const maps = await this.getMaps(context.organizationId);
        return mapCustomerMilestoneSummary(updated, maps);
    }

    async deleteCustomerMilestone(authUserId: string, email: string, id: string, fullName?: string | null): Promise<boolean> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const ok = await databaseService.tloCustomerMilestones.delete(id);
        if (ok) await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "customer_milestone", "delete", `CustomerMilestone deleted`, id, "elevated"));
        return ok;
    }

    async getCommercialMetrics(authUserId: string, email: string, fullName?: string | null): Promise<CommercialMetricSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.tloCommercialMetrics.listByOrganization(context.organizationId)).map(mapCommercialMetricSummary);
    }

    async createCommercialMetric(authUserId: string, email: string, input: CreateCommercialMetricInput, fullName?: string | null): Promise<CommercialMetricSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.tloCommercialMetrics.create(buildCommercialMetricPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create commercialMetrics");
        await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "commercial_metric", "create", `CommercialMetric created`, created.id));
        return mapCommercialMetricSummary(created);
    }

    async updateCommercialMetric(authUserId: string, email: string, id: string, input: Partial<CreateCommercialMetricInput>, fullName?: string | null): Promise<CommercialMetricSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const patch: Record<string, unknown> = {};
        if (input.metricsKey !== undefined) patch.metrics_key = input.metricsKey;
        if (input.totalTenants !== undefined) patch.total_tenants = input.totalTenants;
        const updated = await databaseService.tloCommercialMetrics.update(id, patch);
        if (!updated) throw new Error("Failed to update commercialMetrics");
        await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "commercial_metric", "update", `CommercialMetric updated`, updated.id));
        return mapCommercialMetricSummary(updated);
    }

    async deleteCommercialMetric(authUserId: string, email: string, id: string, fullName?: string | null): Promise<boolean> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const ok = await databaseService.tloCommercialMetrics.delete(id);
        if (ok) await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "commercial_metric", "delete", `CommercialMetric deleted`, id, "elevated"));
        return ok;
    }

    async getGrowthSnapshots(authUserId: string, email: string, fullName?: string | null): Promise<GrowthSnapshotSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.tloGrowthSnapshots.listByOrganization(context.organizationId)).map(mapGrowthSnapshotSummary);
    }

    async createGrowthSnapshot(authUserId: string, email: string, input: CreateGrowthSnapshotInput, fullName?: string | null): Promise<GrowthSnapshotSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.tloGrowthSnapshots.create(buildGrowthSnapshotPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create growthSnapshots");
        await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "growth_snapshot", "create", `GrowthSnapshot created`, created.id));
        return mapGrowthSnapshotSummary(created);
    }

    async updateGrowthSnapshot(authUserId: string, email: string, id: string, input: Partial<CreateGrowthSnapshotInput>, fullName?: string | null): Promise<GrowthSnapshotSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const patch: Record<string, unknown> = {};
        if (input.snapshotKey !== undefined) patch.snapshot_key = input.snapshotKey;
        if (input.growthRatePercent !== undefined) patch.growth_rate_percent = input.growthRatePercent;
        const updated = await databaseService.tloGrowthSnapshots.update(id, patch);
        if (!updated) throw new Error("Failed to update growthSnapshots");
        await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "growth_snapshot", "update", `GrowthSnapshot updated`, updated.id));
        return mapGrowthSnapshotSummary(updated);
    }

    async deleteGrowthSnapshot(authUserId: string, email: string, id: string, fullName?: string | null): Promise<boolean> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const ok = await databaseService.tloGrowthSnapshots.delete(id);
        if (ok) await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "growth_snapshot", "delete", `GrowthSnapshot deleted`, id, "elevated"));
        return ok;
    }

    async getExpansionOpportunities(authUserId: string, email: string, fullName?: string | null): Promise<ExpansionOpportunitySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.tloExpansionOpportunities.listByOrganization(context.organizationId)).map((r) => mapExpansionOpportunitySummary(r, maps));
    }

    async createExpansionOpportunity(authUserId: string, email: string, input: CreateExpansionOpportunityInput, fullName?: string | null): Promise<ExpansionOpportunitySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.tloExpansionOpportunities.create(buildExpansionOpportunityPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create expansionOpportunities");
        await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "expansion_opportunity", "create", `ExpansionOpportunity created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapExpansionOpportunitySummary(created, maps);
    }

    async updateExpansionOpportunity(authUserId: string, email: string, id: string, input: Partial<CreateExpansionOpportunityInput>, fullName?: string | null): Promise<ExpansionOpportunitySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const patch: Record<string, unknown> = {};
        if (input.opportunityKey !== undefined) patch.opportunity_key = input.opportunityKey;
        if (input.title !== undefined) patch.title = input.title;
        const updated = await databaseService.tloExpansionOpportunities.update(id, patch);
        if (!updated) throw new Error("Failed to update expansionOpportunities");
        await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "expansion_opportunity", "update", `ExpansionOpportunity updated`, updated.id));
        const maps = await this.getMaps(context.organizationId);
        return mapExpansionOpportunitySummary(updated, maps);
    }

    async deleteExpansionOpportunity(authUserId: string, email: string, id: string, fullName?: string | null): Promise<boolean> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const ok = await databaseService.tloExpansionOpportunities.delete(id);
        if (ok) await databaseService.tloAuditLogs.create(buildTloAuditPayload(context.organizationId, "expansion_opportunity", "delete", `ExpansionOpportunity deleted`, id, "elevated"));
        return ok;
    }

    async getAuditLogs(authUserId: string, email: string, fullName?: string | null): Promise<AuditEntry[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.tloAuditLogs.listByOrganization(context.organizationId)).map(mapAuditEntry);
    }

    async getTenantContextOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.tloTenantContexts.listByOrganization(context.organizationId)).map((r) => ({ id: r.id, name: r.company_name }));
    }

    async sdkProvisionTenant(authUserId: string, email: string, input: TloSdkProvisionTenantInput, fullName?: string | null): Promise<TloSdkProvisionTenantResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        const knowledge = createKnowledgeClient(authUserId, email, fullName);
        await knowledge.search({ query: input.companyName, limit: 5 });
        const task = await ai.executeTask({ taskType: "provision_tenant", moduleSource: "tenant_lifecycle_ops", inputPayload: { contextKey: input.contextKey, companyName: input.companyName } });
        const context = await this.createTenantContext(authUserId, email, { contextKey: input.contextKey, companyName: input.companyName, lifecycleStage: input.lifecycleStage ?? "lead" }, fullName);
        const record = await this.createLifecycleRecord(authUserId, email, { tenantContextId: context.id, recordKey: `${input.contextKey}-lifecycle`, currentStage: input.lifecycleStage ?? "lead" }, fullName);
        return { contextId: context.id, contextKey: context.contextKey, recordId: record.id, aiTaskId: task?.taskId ?? null };
    }

    async sdkTransitionLifecycle(authUserId: string, email: string, input: TloSdkTransitionLifecycleInput, fullName?: string | null): Promise<TloSdkTransitionLifecycleResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        await ai.executeTask({ taskType: "transition_lifecycle", moduleSource: "tenant_lifecycle_ops", inputPayload: { ...input } });
        const created = await this.createLifecycleTransition(authUserId, email, input, fullName);
        return { transitionId: created.id, transitionKey: created.transitionKey, toStage: input.toStage, status: created.status };
    }

    async sdkInstallIndustryPack(authUserId: string, email: string, input: TloSdkInstallIndustryPackInput, fullName?: string | null): Promise<TloSdkInstallIndustryPackResult> {
        const knowledge = createKnowledgeClient(authUserId, email, fullName);
        await knowledge.search({ query: input.packName, limit: 3 });
        const pack = await this.createIndustryPack(authUserId, email, { tenantContextId: input.tenantContextId, packKey: input.packKey, packName: input.packName, industry: input.industry ?? "technology" }, fullName);
        const installation = await this.createPackInstallation(authUserId, email, { tenantContextId: input.tenantContextId, installationKey: `${input.packKey}-install` }, fullName);
        return { packId: pack.id, packKey: pack.packKey, installationId: installation.id, status: installation.status };
    }
}

export const tenantLifecycleOpsService = new TenantLifecycleOpsService();
