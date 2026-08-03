"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { launchFoundationService } from "@/src/modules/launch-foundation/services/launch-foundation.service";
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
} from "@/src/modules/launch-foundation/types";

export function useLaunchFoundation() {
    const user = useAuthStore((state) => state.user);
    const authUserId = user?.id;
    const email = user?.email ?? "";
    const fullName = user?.fullName;
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<ElfDashboardStats | null>(null);
    const [pipeline, setPipeline] = useState<ElfPipelineInfo | null>(null);
    const [launchHubs, setLaunchHubs] = useState<LaunchHubSummary[]>([]);
    const [organizationProvisions, setOrganizationProvisions] = useState<OrganizationProvisionSummary[]>([]);
    const [tenantProvisions, setTenantProvisions] = useState<TenantProvisionSummary[]>([]);
    const [industryPackAssignments, setIndustryPackAssignments] = useState<IndustryPackAssignmentSummary[]>([]);
    const [moduleLicenses, setModuleLicenses] = useState<ModuleLicenseSummary[]>([]);
    const [wizardProfiles, setWizardProfiles] = useState<WizardProfileSummary[]>([]);
    const [wizardBranding, setWizardBrandings] = useState<WizardBrandingSummary[]>([]);
    const [wizardDepartments, setWizardDepartments] = useState<WizardDepartmentSummary[]>([]);
    const [wizardSettings, setWizardSettings] = useState<WizardSettingSummary[]>([]);
    const [importJobs, setImportJobs] = useState<ImportJobSummary[]>([]);
    const [importValidations, setImportValidations] = useState<ImportValidationSummary[]>([]);
    const [importPreviews, setImportPreviews] = useState<ImportPreviewSummary[]>([]);
    const [importHistory, setImportHistorys] = useState<ImportHistorySummary[]>([]);
    const [goLiveChecklists, setGoLiveChecklists] = useState<GoLiveChecklistSummary[]>([]);
    const [goLiveScores, setGoLiveScores] = useState<GoLiveScoreSummary[]>([]);
    const [deploymentStatuses, setDeploymentStatuss] = useState<DeploymentStatusSummary[]>([]);
    const [readinessValidations, setReadinessValidations] = useState<ReadinessValidationSummary[]>([]);
    const [customerHealthScores, setCustomerHealthScores] = useState<CustomerHealthScoreSummary[]>([]);
    const [platformAdoption, setPlatformAdoptions] = useState<PlatformAdoptionSummary[]>([]);
    const [featureUsage, setFeatureUsages] = useState<FeatureUsageSummary[]>([]);
    const [renewalTracking, setRenewalTrackings] = useState<RenewalTrackingSummary[]>([]);
    const [supportTickets, setSupportTickets] = useState<SupportTicketSummary[]>([]);
    const [knowledgeBaseArticles, setKnowledgeBaseArticles] = useState<KnowledgeBaseArticleSummary[]>([]);
    const [incidentTracking, setIncidentTrackings] = useState<IncidentTrackingSummary[]>([]);
    const [customerRegistry, setCustomerRegistrys] = useState<CustomerRegistrySummary[]>([]);
    const [subscriptionRecords, setSubscriptionRecords] = useState<SubscriptionRecordSummary[]>([]);
    const [licenseManagement, setLicenseManagements] = useState<LicenseManagementSummary[]>([]);
    const [launchMetrics, setLaunchMetrics] = useState<LaunchMetricSummary[]>([]);
    const [launchHealth, setLaunchHealths] = useState<LaunchHealthSummary[]>([]);
    const [missionControlKpis, setMissionControlKpis] = useState<MissionControlKpiSummary[]>([]);
    const [launchFailures, setLaunchFailures] = useState<LaunchFailureSummary[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
    const [launchHubOptions, setIntegrationHubOptions] = useState<Array<{ id: string; name: string }>>([]);

    const fetchData = useCallback(async () => {
        if (!authUserId || !email) return { empty: true as const };
        const [
            statsData,
            pipelineInfo,
launchHubsList,
            organizationProvisionsList,
            tenantProvisionsList,
            industryPackAssignmentsList,
            moduleLicensesList,
            wizardProfilesList,
            wizardBrandingList,
            wizardDepartmentsList,
            wizardSettingsList,
            importJobsList,
            importValidationsList,
            importPreviewsList,
            importHistoryList,
            goLiveChecklistsList,
            goLiveScoresList,
            deploymentStatusesList,
            readinessValidationsList,
            customerHealthScoresList,
            platformAdoptionList,
            featureUsageList,
            renewalTrackingList,
            supportTicketsList,
            knowledgeBaseArticlesList,
            incidentTrackingList,
            customerRegistryList,
            subscriptionRecordsList,
            licenseManagementList,
            launchMetricsList,
            launchHealthList,
            missionControlKpisList,
            launchFailuresList,
            auditLogsList,
            hubOpts,
        ] = await Promise.all([
            launchFoundationService.getDashboardStats(authUserId, email, fullName),
            Promise.resolve(launchFoundationService.getPipelineInfo()),
            launchFoundationService.getLaunchHubs(authUserId, email, fullName),
            launchFoundationService.getOrganizationProvisions(authUserId, email, fullName),
            launchFoundationService.getTenantProvisions(authUserId, email, fullName),
            launchFoundationService.getIndustryPackAssignments(authUserId, email, fullName),
            launchFoundationService.getModuleLicenses(authUserId, email, fullName),
            launchFoundationService.getWizardProfiles(authUserId, email, fullName),
            launchFoundationService.getWizardBrandings(authUserId, email, fullName),
            launchFoundationService.getWizardDepartments(authUserId, email, fullName),
            launchFoundationService.getWizardSettings(authUserId, email, fullName),
            launchFoundationService.getImportJobs(authUserId, email, fullName),
            launchFoundationService.getImportValidations(authUserId, email, fullName),
            launchFoundationService.getImportPreviews(authUserId, email, fullName),
            launchFoundationService.getImportHistorys(authUserId, email, fullName),
            launchFoundationService.getGoLiveChecklists(authUserId, email, fullName),
            launchFoundationService.getGoLiveScores(authUserId, email, fullName),
            launchFoundationService.getDeploymentStatuss(authUserId, email, fullName),
            launchFoundationService.getReadinessValidations(authUserId, email, fullName),
            launchFoundationService.getCustomerHealthScores(authUserId, email, fullName),
            launchFoundationService.getPlatformAdoptions(authUserId, email, fullName),
            launchFoundationService.getFeatureUsages(authUserId, email, fullName),
            launchFoundationService.getRenewalTrackings(authUserId, email, fullName),
            launchFoundationService.getSupportTickets(authUserId, email, fullName),
            launchFoundationService.getKnowledgeBaseArticles(authUserId, email, fullName),
            launchFoundationService.getIncidentTrackings(authUserId, email, fullName),
            launchFoundationService.getCustomerRegistrys(authUserId, email, fullName),
            launchFoundationService.getSubscriptionRecords(authUserId, email, fullName),
            launchFoundationService.getLicenseManagements(authUserId, email, fullName),
            launchFoundationService.getLaunchMetrics(authUserId, email, fullName),
            launchFoundationService.getLaunchHealths(authUserId, email, fullName),
            launchFoundationService.getMissionControlKpis(authUserId, email, fullName),
            launchFoundationService.getLaunchFailures(authUserId, email, fullName),
            launchFoundationService.getAuditLogs(authUserId, email, fullName),
            launchFoundationService.getLaunchHubOptions(authUserId, email, fullName),
        ]);
        return {
            statsData,
            pipelineInfo,
launchHubsList,
            organizationProvisionsList,
            tenantProvisionsList,
            industryPackAssignmentsList,
            moduleLicensesList,
            wizardProfilesList,
            wizardBrandingList,
            wizardDepartmentsList,
            wizardSettingsList,
            importJobsList,
            importValidationsList,
            importPreviewsList,
            importHistoryList,
            goLiveChecklistsList,
            goLiveScoresList,
            deploymentStatusesList,
            readinessValidationsList,
            customerHealthScoresList,
            platformAdoptionList,
            featureUsageList,
            renewalTrackingList,
            supportTicketsList,
            knowledgeBaseArticlesList,
            incidentTrackingList,
            customerRegistryList,
            subscriptionRecordsList,
            licenseManagementList,
            launchMetricsList,
            launchHealthList,
            missionControlKpisList,
            launchFailuresList,
            auditLogsList,
            hubOpts,
        };
    }, [authUserId, email, fullName]);

    const applyData = useCallback((result: Awaited<ReturnType<typeof fetchData>>) => {
        if ("empty" in result) { setLoading(false); return; }
        setStats(result.statsData);
        setPipeline(result.pipelineInfo);
        setLaunchHubs(result.launchHubsList);
        setOrganizationProvisions(result.organizationProvisionsList);
        setTenantProvisions(result.tenantProvisionsList);
        setIndustryPackAssignments(result.industryPackAssignmentsList);
        setModuleLicenses(result.moduleLicensesList);
        setWizardProfiles(result.wizardProfilesList);
        setWizardBrandings(result.wizardBrandingList);
        setWizardDepartments(result.wizardDepartmentsList);
        setWizardSettings(result.wizardSettingsList);
        setImportJobs(result.importJobsList);
        setImportValidations(result.importValidationsList);
        setImportPreviews(result.importPreviewsList);
        setImportHistorys(result.importHistoryList);
        setGoLiveChecklists(result.goLiveChecklistsList);
        setGoLiveScores(result.goLiveScoresList);
        setDeploymentStatuss(result.deploymentStatusesList);
        setReadinessValidations(result.readinessValidationsList);
        setCustomerHealthScores(result.customerHealthScoresList);
        setPlatformAdoptions(result.platformAdoptionList);
        setFeatureUsages(result.featureUsageList);
        setRenewalTrackings(result.renewalTrackingList);
        setSupportTickets(result.supportTicketsList);
        setKnowledgeBaseArticles(result.knowledgeBaseArticlesList);
        setIncidentTrackings(result.incidentTrackingList);
        setCustomerRegistrys(result.customerRegistryList);
        setSubscriptionRecords(result.subscriptionRecordsList);
        setLicenseManagements(result.licenseManagementList);
        setLaunchMetrics(result.launchMetricsList);
        setLaunchHealths(result.launchHealthList);
        setMissionControlKpis(result.missionControlKpisList);
        setLaunchFailures(result.launchFailuresList);
        setAuditLogs(result.auditLogsList);
        setIntegrationHubOptions(result.hubOpts);
        setLoading(false);
    }, []);

    const refresh = useCallback(async () => { applyData(await fetchData()); }, [fetchData, applyData]);

    useEffect(() => {
        let cancelled = false;
        void fetchData().then((data) => { if (!cancelled) applyData(data); }).catch(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [fetchData, applyData]);

    const createLaunchHub = useCallback(async (input: CreateLaunchHubInput) => { if (!user) throw new Error("Authentication required"); await launchFoundationService.createLaunchHub(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createOrganizationProvision = useCallback(async (input: CreateOrganizationProvisionInput) => { if (!user) throw new Error("Authentication required"); await launchFoundationService.createOrganizationProvision(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createTenantProvision = useCallback(async (input: CreateTenantProvisionInput) => { if (!user) throw new Error("Authentication required"); await launchFoundationService.createTenantProvision(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createIndustryPackAssignment = useCallback(async (input: CreateIndustryPackAssignmentInput) => { if (!user) throw new Error("Authentication required"); await launchFoundationService.createIndustryPackAssignment(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createModuleLicense = useCallback(async (input: CreateModuleLicenseInput) => { if (!user) throw new Error("Authentication required"); await launchFoundationService.createModuleLicense(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createWizardProfile = useCallback(async (input: CreateWizardProfileInput) => { if (!user) throw new Error("Authentication required"); await launchFoundationService.createWizardProfile(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createWizardBranding = useCallback(async (input: CreateWizardBrandingInput) => { if (!user) throw new Error("Authentication required"); await launchFoundationService.createWizardBranding(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createWizardDepartment = useCallback(async (input: CreateWizardDepartmentInput) => { if (!user) throw new Error("Authentication required"); await launchFoundationService.createWizardDepartment(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createWizardSetting = useCallback(async (input: CreateWizardSettingInput) => { if (!user) throw new Error("Authentication required"); await launchFoundationService.createWizardSetting(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createImportJob = useCallback(async (input: CreateImportJobInput) => { if (!user) throw new Error("Authentication required"); await launchFoundationService.createImportJob(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createImportValidation = useCallback(async (input: CreateImportValidationInput) => { if (!user) throw new Error("Authentication required"); await launchFoundationService.createImportValidation(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createImportPreview = useCallback(async (input: CreateImportPreviewInput) => { if (!user) throw new Error("Authentication required"); await launchFoundationService.createImportPreview(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createImportHistory = useCallback(async (input: CreateImportHistoryInput) => { if (!user) throw new Error("Authentication required"); await launchFoundationService.createImportHistory(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createGoLiveChecklist = useCallback(async (input: CreateGoLiveChecklistInput) => { if (!user) throw new Error("Authentication required"); await launchFoundationService.createGoLiveChecklist(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createGoLiveScore = useCallback(async (input: CreateGoLiveScoreInput) => { if (!user) throw new Error("Authentication required"); await launchFoundationService.createGoLiveScore(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createDeploymentStatus = useCallback(async (input: CreateDeploymentStatusInput) => { if (!user) throw new Error("Authentication required"); await launchFoundationService.createDeploymentStatus(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createReadinessValidation = useCallback(async (input: CreateReadinessValidationInput) => { if (!user) throw new Error("Authentication required"); await launchFoundationService.createReadinessValidation(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createCustomerHealthScore = useCallback(async (input: CreateCustomerHealthScoreInput) => { if (!user) throw new Error("Authentication required"); await launchFoundationService.createCustomerHealthScore(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createPlatformAdoption = useCallback(async (input: CreatePlatformAdoptionInput) => { if (!user) throw new Error("Authentication required"); await launchFoundationService.createPlatformAdoption(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createFeatureUsage = useCallback(async (input: CreateFeatureUsageInput) => { if (!user) throw new Error("Authentication required"); await launchFoundationService.createFeatureUsage(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRenewalTracking = useCallback(async (input: CreateRenewalTrackingInput) => { if (!user) throw new Error("Authentication required"); await launchFoundationService.createRenewalTracking(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createSupportTicket = useCallback(async (input: CreateSupportTicketInput) => { if (!user) throw new Error("Authentication required"); await launchFoundationService.createSupportTicket(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createKnowledgeBaseArticle = useCallback(async (input: CreateKnowledgeBaseArticleInput) => { if (!user) throw new Error("Authentication required"); await launchFoundationService.createKnowledgeBaseArticle(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createIncidentTracking = useCallback(async (input: CreateIncidentTrackingInput) => { if (!user) throw new Error("Authentication required"); await launchFoundationService.createIncidentTracking(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createCustomerRegistry = useCallback(async (input: CreateCustomerRegistryInput) => { if (!user) throw new Error("Authentication required"); await launchFoundationService.createCustomerRegistry(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createSubscriptionRecord = useCallback(async (input: CreateSubscriptionRecordInput) => { if (!user) throw new Error("Authentication required"); await launchFoundationService.createSubscriptionRecord(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createLicenseManagement = useCallback(async (input: CreateLicenseManagementInput) => { if (!user) throw new Error("Authentication required"); await launchFoundationService.createLicenseManagement(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createLaunchMetric = useCallback(async (input: CreateLaunchMetricInput) => { if (!user) throw new Error("Authentication required"); await launchFoundationService.createLaunchMetric(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createLaunchHealth = useCallback(async (input: CreateLaunchHealthInput) => { if (!user) throw new Error("Authentication required"); await launchFoundationService.createLaunchHealth(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createMissionControlKpi = useCallback(async (input: CreateMissionControlKpiInput) => { if (!user) throw new Error("Authentication required"); await launchFoundationService.createMissionControlKpi(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createLaunchFailure = useCallback(async (input: CreateLaunchFailureInput) => { if (!user) throw new Error("Authentication required"); await launchFoundationService.createLaunchFailure(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);

    return {
        loading,
        stats,
        pipeline,
        launchHubs,
        createLaunchHub,
        organizationProvisions,
        createOrganizationProvision,
        tenantProvisions,
        createTenantProvision,
        industryPackAssignments,
        createIndustryPackAssignment,
        moduleLicenses,
        createModuleLicense,
        wizardProfiles,
        createWizardProfile,
        wizardBranding,
        createWizardBranding,
        wizardDepartments,
        createWizardDepartment,
        wizardSettings,
        createWizardSetting,
        importJobs,
        createImportJob,
        importValidations,
        createImportValidation,
        importPreviews,
        createImportPreview,
        importHistory,
        createImportHistory,
        goLiveChecklists,
        createGoLiveChecklist,
        goLiveScores,
        createGoLiveScore,
        deploymentStatuses,
        createDeploymentStatus,
        readinessValidations,
        createReadinessValidation,
        customerHealthScores,
        createCustomerHealthScore,
        platformAdoption,
        createPlatformAdoption,
        featureUsage,
        createFeatureUsage,
        renewalTracking,
        createRenewalTracking,
        supportTickets,
        createSupportTicket,
        knowledgeBaseArticles,
        createKnowledgeBaseArticle,
        incidentTracking,
        createIncidentTracking,
        customerRegistry,
        createCustomerRegistry,
        subscriptionRecords,
        createSubscriptionRecord,
        licenseManagement,
        createLicenseManagement,
        launchMetrics,
        createLaunchMetric,
        launchHealth,
        createLaunchHealth,
        missionControlKpis,
        createMissionControlKpi,
        launchFailures,
        createLaunchFailure,
        auditLogs,
        launchHubOptions,
        refresh,
    };
}
