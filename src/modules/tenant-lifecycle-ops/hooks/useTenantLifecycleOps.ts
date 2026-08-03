"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { tenantLifecycleOpsService } from "@/src/modules/tenant-lifecycle-ops/services/tenant-lifecycle-ops.service";
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
    WorkspaceSummary,
} from "@/src/modules/tenant-lifecycle-ops/types";

export function useTenantLifecycleOps() {
    const user = useAuthStore((state) => state.user);
    const authUserId = user?.id;
    const email = user?.email ?? "";
    const fullName = user?.fullName;
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<TloDashboardStats | null>(null);
    const [pipeline, setPipeline] = useState<TloPipelineInfo | null>(null);
    const [tenantContexts, setTenantContexts] = useState<TenantContextSummary[]>([]);
    const [lifecycleRecords, setLifecycleRecords] = useState<LifecycleRecordSummary[]>([]);
    const [lifecycleTransitions, setLifecycleTransitions] = useState<LifecycleTransitionSummary[]>([]);
    const [lifecycleEvents, setLifecycleEvents] = useState<LifecycleEventSummary[]>([]);
    const [reactivationRequests, setReactivationRequests] = useState<ReactivationRequestSummary[]>([]);
    const [workspaces, setWorkspaces] = useState<WorkspaceSummary[]>([]);
    const [environmentSettings, setEnvironmentSettings] = useState<EnvironmentSettingSummary[]>([]);
    const [storageManagement, setStorageManagements] = useState<StorageManagementSummary[]>([]);
    const [operationsControls, setOperationsControls] = useState<OperationsControlSummary[]>([]);
    const [onboardingFlows, setOnboardingFlows] = useState<OnboardingFlowSummary[]>([]);
    const [onboardingProgress, setOnboardingProgress] = useState<OnboardingProgressSummary[]>([]);
    const [onboardingValidations, setOnboardingValidations] = useState<OnboardingValidationSummary[]>([]);
    const [goLiveChecklists, setGoLiveChecklists] = useState<GoLiveChecklistSummary[]>([]);
    const [marketplaceModules, setMarketplaceModules] = useState<MarketplaceModuleSummary[]>([]);
    const [moduleInstallations, setModuleInstallations] = useState<ModuleInstallationSummary[]>([]);
    const [moduleDependencies, setModuleDependencys] = useState<ModuleDependencySummary[]>([]);
    const [moduleCompatibility, setModuleCompatibilitys] = useState<ModuleCompatibilitySummary[]>([]);
    const [industryPacks, setIndustryPacks] = useState<IndustryPackSummary[]>([]);
    const [packInstallations, setPackInstallations] = useState<PackInstallationSummary[]>([]);
    const [packVersions, setPackVersions] = useState<PackVersionSummary[]>([]);
    const [packExports, setPackExports] = useState<PackExportSummary[]>([]);
    const [healthSnapshots, setHealthSnapshots] = useState<HealthSnapshotSummary[]>([]);
    const [healthDimensions, setHealthDimensions] = useState<HealthDimensionSummary[]>([]);
    const [healthRisks, setHealthRisks] = useState<HealthRiskSummary[]>([]);
    const [healthScores, setHealthScores] = useState<HealthScoreSummary[]>([]);
    const [successPlans, setSuccessPlans] = useState<SuccessPlanSummary[]>([]);
    const [quarterlyReviews, setQuarterlyReviews] = useState<QuarterlyReviewSummary[]>([]);
    const [renewalPlans, setRenewalPlans] = useState<RenewalPlanSummary[]>([]);
    const [customerMilestones, setCustomerMilestones] = useState<CustomerMilestoneSummary[]>([]);
    const [commercialMetrics, setCommercialMetrics] = useState<CommercialMetricSummary[]>([]);
    const [growthSnapshots, setGrowthSnapshots] = useState<GrowthSnapshotSummary[]>([]);
    const [expansionOpportunities, setExpansionOpportunities] = useState<ExpansionOpportunitySummary[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
    const [tenantContextOptions, setTenantContextOptions] = useState<Array<{ id: string; name: string }>>([]);

    const fetchData = useCallback(async () => {
        if (!authUserId || !email) return { empty: true as const };
        const [
            statsData,
            pipelineInfo,
            tenantContextsList,
            lifecycleRecordsList,
            lifecycleTransitionsList,
            lifecycleEventsList,
            reactivationRequestsList,
            workspacesList,
            environmentSettingsList,
            storageManagementList,
            operationsControlsList,
            onboardingFlowsList,
            onboardingProgressList,
            onboardingValidationsList,
            goLiveChecklistsList,
            marketplaceModulesList,
            moduleInstallationsList,
            moduleDependenciesList,
            moduleCompatibilityList,
            industryPacksList,
            packInstallationsList,
            packVersionsList,
            packExportsList,
            healthSnapshotsList,
            healthDimensionsList,
            healthRisksList,
            healthScoresList,
            successPlansList,
            quarterlyReviewsList,
            renewalPlansList,
            customerMilestonesList,
            commercialMetricsList,
            growthSnapshotsList,
            expansionOpportunitiesList,
            auditList,
            tenantOpts,
        ] = await Promise.all([
            tenantLifecycleOpsService.getDashboardStats(authUserId, email, fullName),
            Promise.resolve(tenantLifecycleOpsService.getPipelineInfo()),
            tenantLifecycleOpsService.getTenantContexts(authUserId, email, fullName),
            tenantLifecycleOpsService.getLifecycleRecords(authUserId, email, fullName),
            tenantLifecycleOpsService.getLifecycleTransitions(authUserId, email, fullName),
            tenantLifecycleOpsService.getLifecycleEvents(authUserId, email, fullName),
            tenantLifecycleOpsService.getReactivationRequests(authUserId, email, fullName),
            tenantLifecycleOpsService.getWorkspaces(authUserId, email, fullName),
            tenantLifecycleOpsService.getEnvironmentSettings(authUserId, email, fullName),
            tenantLifecycleOpsService.getStorageManagements(authUserId, email, fullName),
            tenantLifecycleOpsService.getOperationsControls(authUserId, email, fullName),
            tenantLifecycleOpsService.getOnboardingFlows(authUserId, email, fullName),
            tenantLifecycleOpsService.getOnboardingProgress(authUserId, email, fullName),
            tenantLifecycleOpsService.getOnboardingValidations(authUserId, email, fullName),
            tenantLifecycleOpsService.getGoLiveChecklists(authUserId, email, fullName),
            tenantLifecycleOpsService.getMarketplaceModules(authUserId, email, fullName),
            tenantLifecycleOpsService.getModuleInstallations(authUserId, email, fullName),
            tenantLifecycleOpsService.getModuleDependencys(authUserId, email, fullName),
            tenantLifecycleOpsService.getModuleCompatibilitys(authUserId, email, fullName),
            tenantLifecycleOpsService.getIndustryPacks(authUserId, email, fullName),
            tenantLifecycleOpsService.getPackInstallations(authUserId, email, fullName),
            tenantLifecycleOpsService.getPackVersions(authUserId, email, fullName),
            tenantLifecycleOpsService.getPackExports(authUserId, email, fullName),
            tenantLifecycleOpsService.getHealthSnapshots(authUserId, email, fullName),
            tenantLifecycleOpsService.getHealthDimensions(authUserId, email, fullName),
            tenantLifecycleOpsService.getHealthRisks(authUserId, email, fullName),
            tenantLifecycleOpsService.getHealthScores(authUserId, email, fullName),
            tenantLifecycleOpsService.getSuccessPlans(authUserId, email, fullName),
            tenantLifecycleOpsService.getQuarterlyReviews(authUserId, email, fullName),
            tenantLifecycleOpsService.getRenewalPlans(authUserId, email, fullName),
            tenantLifecycleOpsService.getCustomerMilestones(authUserId, email, fullName),
            tenantLifecycleOpsService.getCommercialMetrics(authUserId, email, fullName),
            tenantLifecycleOpsService.getGrowthSnapshots(authUserId, email, fullName),
            tenantLifecycleOpsService.getExpansionOpportunities(authUserId, email, fullName),
            tenantLifecycleOpsService.getAuditLogs(authUserId, email, fullName),
            tenantLifecycleOpsService.getTenantContextOptions(authUserId, email, fullName),
        ]);
        return {
            statsData,
            pipelineInfo,
            tenantContextsList,
            lifecycleRecordsList,
            lifecycleTransitionsList,
            lifecycleEventsList,
            reactivationRequestsList,
            workspacesList,
            environmentSettingsList,
            storageManagementList,
            operationsControlsList,
            onboardingFlowsList,
            onboardingProgressList,
            onboardingValidationsList,
            goLiveChecklistsList,
            marketplaceModulesList,
            moduleInstallationsList,
            moduleDependenciesList,
            moduleCompatibilityList,
            industryPacksList,
            packInstallationsList,
            packVersionsList,
            packExportsList,
            healthSnapshotsList,
            healthDimensionsList,
            healthRisksList,
            healthScoresList,
            successPlansList,
            quarterlyReviewsList,
            renewalPlansList,
            customerMilestonesList,
            commercialMetricsList,
            growthSnapshotsList,
            expansionOpportunitiesList,
            auditList,
            tenantOpts,
        };
    }, [authUserId, email, fullName]);

    const applyData = useCallback((result: Awaited<ReturnType<typeof fetchData>>) => {
        if ("empty" in result) { setLoading(false); return; }
        setStats(result.statsData);
        setPipeline(result.pipelineInfo);
        setTenantContexts(result.tenantContextsList);
        setLifecycleRecords(result.lifecycleRecordsList);
        setLifecycleTransitions(result.lifecycleTransitionsList);
        setLifecycleEvents(result.lifecycleEventsList);
        setReactivationRequests(result.reactivationRequestsList);
        setWorkspaces(result.workspacesList);
        setEnvironmentSettings(result.environmentSettingsList);
        setStorageManagements(result.storageManagementList);
        setOperationsControls(result.operationsControlsList);
        setOnboardingFlows(result.onboardingFlowsList);
        setOnboardingProgress(result.onboardingProgressList);
        setOnboardingValidations(result.onboardingValidationsList);
        setGoLiveChecklists(result.goLiveChecklistsList);
        setMarketplaceModules(result.marketplaceModulesList);
        setModuleInstallations(result.moduleInstallationsList);
        setModuleDependencys(result.moduleDependenciesList);
        setModuleCompatibilitys(result.moduleCompatibilityList);
        setIndustryPacks(result.industryPacksList);
        setPackInstallations(result.packInstallationsList);
        setPackVersions(result.packVersionsList);
        setPackExports(result.packExportsList);
        setHealthSnapshots(result.healthSnapshotsList);
        setHealthDimensions(result.healthDimensionsList);
        setHealthRisks(result.healthRisksList);
        setHealthScores(result.healthScoresList);
        setSuccessPlans(result.successPlansList);
        setQuarterlyReviews(result.quarterlyReviewsList);
        setRenewalPlans(result.renewalPlansList);
        setCustomerMilestones(result.customerMilestonesList);
        setCommercialMetrics(result.commercialMetricsList);
        setGrowthSnapshots(result.growthSnapshotsList);
        setExpansionOpportunities(result.expansionOpportunitiesList);
        setAuditLogs(result.auditList);
        setTenantContextOptions(result.tenantOpts);
        setLoading(false);
    }, []);

    const refresh = useCallback(async () => { applyData(await fetchData()); }, [fetchData, applyData]);

    useEffect(() => {
        let cancelled = false;
        void fetchData().then((data) => { if (!cancelled) applyData(data); }).catch(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [fetchData, applyData]);

    const createTenantContext = useCallback(async (input: CreateTenantContextInput) => { if (!user) throw new Error("Authentication required"); await tenantLifecycleOpsService.createTenantContext(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createLifecycleRecord = useCallback(async (input: CreateLifecycleRecordInput) => { if (!user) throw new Error("Authentication required"); await tenantLifecycleOpsService.createLifecycleRecord(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createLifecycleTransition = useCallback(async (input: CreateLifecycleTransitionInput) => { if (!user) throw new Error("Authentication required"); await tenantLifecycleOpsService.createLifecycleTransition(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createLifecycleEvent = useCallback(async (input: CreateLifecycleEventInput) => { if (!user) throw new Error("Authentication required"); await tenantLifecycleOpsService.createLifecycleEvent(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createReactivationRequest = useCallback(async (input: CreateReactivationRequestInput) => { if (!user) throw new Error("Authentication required"); await tenantLifecycleOpsService.createReactivationRequest(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createWorkspace = useCallback(async (input: CreateWorkspaceInput) => { if (!user) throw new Error("Authentication required"); await tenantLifecycleOpsService.createWorkspace(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createEnvironmentSetting = useCallback(async (input: CreateEnvironmentSettingInput) => { if (!user) throw new Error("Authentication required"); await tenantLifecycleOpsService.createEnvironmentSetting(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createStorageManagement = useCallback(async (input: CreateStorageManagementInput) => { if (!user) throw new Error("Authentication required"); await tenantLifecycleOpsService.createStorageManagement(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createOperationsControl = useCallback(async (input: CreateOperationsControlInput) => { if (!user) throw new Error("Authentication required"); await tenantLifecycleOpsService.createOperationsControl(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createOnboardingFlow = useCallback(async (input: CreateOnboardingFlowInput) => { if (!user) throw new Error("Authentication required"); await tenantLifecycleOpsService.createOnboardingFlow(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createOnboardingProgress = useCallback(async (input: CreateOnboardingProgressInput) => { if (!user) throw new Error("Authentication required"); await tenantLifecycleOpsService.createOnboardingProgress(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createOnboardingValidation = useCallback(async (input: CreateOnboardingValidationInput) => { if (!user) throw new Error("Authentication required"); await tenantLifecycleOpsService.createOnboardingValidation(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createGoLiveChecklist = useCallback(async (input: CreateGoLiveChecklistInput) => { if (!user) throw new Error("Authentication required"); await tenantLifecycleOpsService.createGoLiveChecklist(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createMarketplaceModule = useCallback(async (input: CreateMarketplaceModuleInput) => { if (!user) throw new Error("Authentication required"); await tenantLifecycleOpsService.createMarketplaceModule(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createModuleInstallation = useCallback(async (input: CreateModuleInstallationInput) => { if (!user) throw new Error("Authentication required"); await tenantLifecycleOpsService.createModuleInstallation(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createModuleDependency = useCallback(async (input: CreateModuleDependencyInput) => { if (!user) throw new Error("Authentication required"); await tenantLifecycleOpsService.createModuleDependency(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createModuleCompatibility = useCallback(async (input: CreateModuleCompatibilityInput) => { if (!user) throw new Error("Authentication required"); await tenantLifecycleOpsService.createModuleCompatibility(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createIndustryPack = useCallback(async (input: CreateIndustryPackInput) => { if (!user) throw new Error("Authentication required"); await tenantLifecycleOpsService.createIndustryPack(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createPackInstallation = useCallback(async (input: CreatePackInstallationInput) => { if (!user) throw new Error("Authentication required"); await tenantLifecycleOpsService.createPackInstallation(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createPackVersion = useCallback(async (input: CreatePackVersionInput) => { if (!user) throw new Error("Authentication required"); await tenantLifecycleOpsService.createPackVersion(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createPackExport = useCallback(async (input: CreatePackExportInput) => { if (!user) throw new Error("Authentication required"); await tenantLifecycleOpsService.createPackExport(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createHealthSnapshot = useCallback(async (input: CreateHealthSnapshotInput) => { if (!user) throw new Error("Authentication required"); await tenantLifecycleOpsService.createHealthSnapshot(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createHealthDimension = useCallback(async (input: CreateHealthDimensionInput) => { if (!user) throw new Error("Authentication required"); await tenantLifecycleOpsService.createHealthDimension(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createHealthRisk = useCallback(async (input: CreateHealthRiskInput) => { if (!user) throw new Error("Authentication required"); await tenantLifecycleOpsService.createHealthRisk(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createHealthScore = useCallback(async (input: CreateHealthScoreInput) => { if (!user) throw new Error("Authentication required"); await tenantLifecycleOpsService.createHealthScore(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createSuccessPlan = useCallback(async (input: CreateSuccessPlanInput) => { if (!user) throw new Error("Authentication required"); await tenantLifecycleOpsService.createSuccessPlan(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createQuarterlyReview = useCallback(async (input: CreateQuarterlyReviewInput) => { if (!user) throw new Error("Authentication required"); await tenantLifecycleOpsService.createQuarterlyReview(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRenewalPlan = useCallback(async (input: CreateRenewalPlanInput) => { if (!user) throw new Error("Authentication required"); await tenantLifecycleOpsService.createRenewalPlan(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createCustomerMilestone = useCallback(async (input: CreateCustomerMilestoneInput) => { if (!user) throw new Error("Authentication required"); await tenantLifecycleOpsService.createCustomerMilestone(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createCommercialMetric = useCallback(async (input: CreateCommercialMetricInput) => { if (!user) throw new Error("Authentication required"); await tenantLifecycleOpsService.createCommercialMetric(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createGrowthSnapshot = useCallback(async (input: CreateGrowthSnapshotInput) => { if (!user) throw new Error("Authentication required"); await tenantLifecycleOpsService.createGrowthSnapshot(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createExpansionOpportunity = useCallback(async (input: CreateExpansionOpportunityInput) => { if (!user) throw new Error("Authentication required"); await tenantLifecycleOpsService.createExpansionOpportunity(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);

    return {
        loading,
        stats,
        pipeline,
        tenantContexts,
        lifecycleRecords,
        lifecycleTransitions,
        lifecycleEvents,
        reactivationRequests,
        workspaces,
        environmentSettings,
        storageManagement,
        operationsControls,
        onboardingFlows,
        onboardingProgress,
        onboardingValidations,
        goLiveChecklists,
        marketplaceModules,
        moduleInstallations,
        moduleDependencies,
        moduleCompatibility,
        industryPacks,
        packInstallations,
        packVersions,
        packExports,
        healthSnapshots,
        healthDimensions,
        healthRisks,
        healthScores,
        successPlans,
        quarterlyReviews,
        renewalPlans,
        customerMilestones,
        commercialMetrics,
        growthSnapshots,
        expansionOpportunities,
        auditLogs,
        tenantContextOptions,
        refresh,
        createTenantContext,
        createLifecycleRecord,
        createLifecycleTransition,
        createLifecycleEvent,
        createReactivationRequest,
        createWorkspace,
        createEnvironmentSetting,
        createStorageManagement,
        createOperationsControl,
        createOnboardingFlow,
        createOnboardingProgress,
        createOnboardingValidation,
        createGoLiveChecklist,
        createMarketplaceModule,
        createModuleInstallation,
        createModuleDependency,
        createModuleCompatibility,
        createIndustryPack,
        createPackInstallation,
        createPackVersion,
        createPackExport,
        createHealthSnapshot,
        createHealthDimension,
        createHealthRisk,
        createHealthScore,
        createSuccessPlan,
        createQuarterlyReview,
        createRenewalPlan,
        createCustomerMilestone,
        createCommercialMetric,
        createGrowthSnapshot,
        createExpansionOpportunity,
    };
}
