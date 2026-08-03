"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { industryFrameworkService } from "@/src/modules/industry-framework/services/industry-framework.service";
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
} from "@/src/modules/industry-framework/types";

export function useIndustryFramework() {
    const user = useAuthStore((state) => state.user);
    const authUserId = user?.id;
    const email = user?.email ?? "";
    const fullName = user?.fullName;
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<IfrDashboardStats | null>(null);
    const [pipeline, setPipeline] = useState<IfrPipelineInfo | null>(null);
    const [frameworkHubs, setFrameworkHubs] = useState<FrameworkHubSummary[]>([]);
    const [industryRegistrations, setIndustryRegistrations] = useState<IndustryRegistrationSummary[]>([]);
    const [industryMetadata, setIndustryMetadatas] = useState<IndustryMetadataSummary[]>([]);
    const [industryVersions, setIndustryVersions] = useState<IndustryVersionSummary[]>([]);
    const [industryDependencies, setIndustryDependencys] = useState<IndustryDependencySummary[]>([]);
    const [businessTypes, setBusinessTypes] = useState<BusinessTypeSummary[]>([]);
    const [businessSizes, setBusinessSizes] = useState<BusinessSizeSummary[]>([]);
    const [operatingModels, setOperatingModels] = useState<OperatingModelSummary[]>([]);
    const [industryProfiles, setIndustryProfiles] = useState<IndustryProfileSummary[]>([]);
    const [dashboardTemplates, setDashboardTemplates] = useState<DashboardTemplateSummary[]>([]);
    const [workflowTemplates, setWorkflowTemplates] = useState<WorkflowTemplateSummary[]>([]);
    const [roleTemplates, setRoleTemplates] = useState<RoleTemplateSummary[]>([]);
    const [reportTemplates, setReportTemplates] = useState<ReportTemplateSummary[]>([]);
    const [dynamicConfigurations, setDynamicConfigurations] = useState<DynamicConfigurationSummary[]>([]);
    const [featureConfigurations, setFeatureConfigurations] = useState<FeatureConfigurationSummary[]>([]);
    const [businessRules, setBusinessRules] = useState<BusinessRuleSummary[]>([]);
    const [validationRules, setValidationRules] = useState<ValidationRuleSummary[]>([]);
    const [industryContexts, setIndustryContexts] = useState<IndustryContextSummary[]>([]);
    const [aiContexts, setAiContexts] = useState<AiContextSummary[]>([]);
    const [terminologyEntries, setTerminologyEntrys] = useState<TerminologyEntrySummary[]>([]);
    const [demoProfiles, setDemoProfiles] = useState<DemoProfileSummary[]>([]);
    const [productionProfiles, setProductionProfiles] = useState<ProductionProfileSummary[]>([]);
    const [enterpriseProfiles, setEnterpriseProfiles] = useState<EnterpriseProfileSummary[]>([]);
    const [sharedApis, setSharedApis] = useState<SharedApiSummary[]>([]);
    const [contextApis, setContextApis] = useState<ContextApiSummary[]>([]);
    const [configurationApis, setConfigurationApis] = useState<ConfigurationApiSummary[]>([]);
    const [extensionPoints, setExtensionPoints] = useState<ExtensionPointSummary[]>([]);
    const [frameworkMetrics, setFrameworkMetrics] = useState<FrameworkMetricSummary[]>([]);
    const [frameworkHealth, setFrameworkHealths] = useState<FrameworkHealthSummary[]>([]);
    const [compatibilityChecks, setCompatibilityChecks] = useState<CompatibilityCheckSummary[]>([]);
    const [frameworkFailures, setFrameworkFailures] = useState<FrameworkFailureSummary[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
    const [frameworkHubOptions, setIntegrationHubOptions] = useState<Array<{ id: string; name: string }>>([]);

    const fetchData = useCallback(async () => {
        if (!authUserId || !email) return { empty: true as const };
        const [
            statsData,
            pipelineInfo,
frameworkHubsList,
            industryRegistrationsList,
            industryMetadataList,
            industryVersionsList,
            industryDependenciesList,
            businessTypesList,
            businessSizesList,
            operatingModelsList,
            industryProfilesList,
            dashboardTemplatesList,
            workflowTemplatesList,
            roleTemplatesList,
            reportTemplatesList,
            dynamicConfigurationsList,
            featureConfigurationsList,
            businessRulesList,
            validationRulesList,
            industryContextsList,
            aiContextsList,
            terminologyEntriesList,
            demoProfilesList,
            productionProfilesList,
            enterpriseProfilesList,
            sharedApisList,
            contextApisList,
            configurationApisList,
            extensionPointsList,
            frameworkMetricsList,
            frameworkHealthList,
            compatibilityChecksList,
            frameworkFailuresList,
            auditLogsList,
            hubOpts,
        ] = await Promise.all([
            industryFrameworkService.getDashboardStats(authUserId, email, fullName),
            Promise.resolve(industryFrameworkService.getPipelineInfo()),
            industryFrameworkService.getFrameworkHubs(authUserId, email, fullName),
            industryFrameworkService.getIndustryRegistrations(authUserId, email, fullName),
            industryFrameworkService.getIndustryMetadatas(authUserId, email, fullName),
            industryFrameworkService.getIndustryVersions(authUserId, email, fullName),
            industryFrameworkService.getIndustryDependencys(authUserId, email, fullName),
            industryFrameworkService.getBusinessTypes(authUserId, email, fullName),
            industryFrameworkService.getBusinessSizes(authUserId, email, fullName),
            industryFrameworkService.getOperatingModels(authUserId, email, fullName),
            industryFrameworkService.getIndustryProfiles(authUserId, email, fullName),
            industryFrameworkService.getDashboardTemplates(authUserId, email, fullName),
            industryFrameworkService.getWorkflowTemplates(authUserId, email, fullName),
            industryFrameworkService.getRoleTemplates(authUserId, email, fullName),
            industryFrameworkService.getReportTemplates(authUserId, email, fullName),
            industryFrameworkService.getDynamicConfigurations(authUserId, email, fullName),
            industryFrameworkService.getFeatureConfigurations(authUserId, email, fullName),
            industryFrameworkService.getBusinessRules(authUserId, email, fullName),
            industryFrameworkService.getValidationRules(authUserId, email, fullName),
            industryFrameworkService.getIndustryContexts(authUserId, email, fullName),
            industryFrameworkService.getAiContexts(authUserId, email, fullName),
            industryFrameworkService.getTerminologyEntrys(authUserId, email, fullName),
            industryFrameworkService.getDemoProfiles(authUserId, email, fullName),
            industryFrameworkService.getProductionProfiles(authUserId, email, fullName),
            industryFrameworkService.getEnterpriseProfiles(authUserId, email, fullName),
            industryFrameworkService.getSharedApis(authUserId, email, fullName),
            industryFrameworkService.getContextApis(authUserId, email, fullName),
            industryFrameworkService.getConfigurationApis(authUserId, email, fullName),
            industryFrameworkService.getExtensionPoints(authUserId, email, fullName),
            industryFrameworkService.getFrameworkMetrics(authUserId, email, fullName),
            industryFrameworkService.getFrameworkHealths(authUserId, email, fullName),
            industryFrameworkService.getCompatibilityChecks(authUserId, email, fullName),
            industryFrameworkService.getFrameworkFailures(authUserId, email, fullName),
            industryFrameworkService.getAuditLogs(authUserId, email, fullName),
            industryFrameworkService.getFrameworkHubOptions(authUserId, email, fullName),
        ]);
        return {
            statsData,
            pipelineInfo,
frameworkHubsList,
            industryRegistrationsList,
            industryMetadataList,
            industryVersionsList,
            industryDependenciesList,
            businessTypesList,
            businessSizesList,
            operatingModelsList,
            industryProfilesList,
            dashboardTemplatesList,
            workflowTemplatesList,
            roleTemplatesList,
            reportTemplatesList,
            dynamicConfigurationsList,
            featureConfigurationsList,
            businessRulesList,
            validationRulesList,
            industryContextsList,
            aiContextsList,
            terminologyEntriesList,
            demoProfilesList,
            productionProfilesList,
            enterpriseProfilesList,
            sharedApisList,
            contextApisList,
            configurationApisList,
            extensionPointsList,
            frameworkMetricsList,
            frameworkHealthList,
            compatibilityChecksList,
            frameworkFailuresList,
            auditLogsList,
            hubOpts,
        };
    }, [authUserId, email, fullName]);

    const applyData = useCallback((result: Awaited<ReturnType<typeof fetchData>>) => {
        if ("empty" in result) { setLoading(false); return; }
        setStats(result.statsData);
        setPipeline(result.pipelineInfo);
        setFrameworkHubs(result.frameworkHubsList);
        setIndustryRegistrations(result.industryRegistrationsList);
        setIndustryMetadatas(result.industryMetadataList);
        setIndustryVersions(result.industryVersionsList);
        setIndustryDependencys(result.industryDependenciesList);
        setBusinessTypes(result.businessTypesList);
        setBusinessSizes(result.businessSizesList);
        setOperatingModels(result.operatingModelsList);
        setIndustryProfiles(result.industryProfilesList);
        setDashboardTemplates(result.dashboardTemplatesList);
        setWorkflowTemplates(result.workflowTemplatesList);
        setRoleTemplates(result.roleTemplatesList);
        setReportTemplates(result.reportTemplatesList);
        setDynamicConfigurations(result.dynamicConfigurationsList);
        setFeatureConfigurations(result.featureConfigurationsList);
        setBusinessRules(result.businessRulesList);
        setValidationRules(result.validationRulesList);
        setIndustryContexts(result.industryContextsList);
        setAiContexts(result.aiContextsList);
        setTerminologyEntrys(result.terminologyEntriesList);
        setDemoProfiles(result.demoProfilesList);
        setProductionProfiles(result.productionProfilesList);
        setEnterpriseProfiles(result.enterpriseProfilesList);
        setSharedApis(result.sharedApisList);
        setContextApis(result.contextApisList);
        setConfigurationApis(result.configurationApisList);
        setExtensionPoints(result.extensionPointsList);
        setFrameworkMetrics(result.frameworkMetricsList);
        setFrameworkHealths(result.frameworkHealthList);
        setCompatibilityChecks(result.compatibilityChecksList);
        setFrameworkFailures(result.frameworkFailuresList);
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

    const createFrameworkHub = useCallback(async (input: CreateFrameworkHubInput) => { if (!user) throw new Error("Authentication required"); await industryFrameworkService.createFrameworkHub(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createIndustryRegistration = useCallback(async (input: CreateIndustryRegistrationInput) => { if (!user) throw new Error("Authentication required"); await industryFrameworkService.createIndustryRegistration(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createIndustryMetadata = useCallback(async (input: CreateIndustryMetadataInput) => { if (!user) throw new Error("Authentication required"); await industryFrameworkService.createIndustryMetadata(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createIndustryVersion = useCallback(async (input: CreateIndustryVersionInput) => { if (!user) throw new Error("Authentication required"); await industryFrameworkService.createIndustryVersion(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createIndustryDependency = useCallback(async (input: CreateIndustryDependencyInput) => { if (!user) throw new Error("Authentication required"); await industryFrameworkService.createIndustryDependency(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createBusinessType = useCallback(async (input: CreateBusinessTypeInput) => { if (!user) throw new Error("Authentication required"); await industryFrameworkService.createBusinessType(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createBusinessSize = useCallback(async (input: CreateBusinessSizeInput) => { if (!user) throw new Error("Authentication required"); await industryFrameworkService.createBusinessSize(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createOperatingModel = useCallback(async (input: CreateOperatingModelInput) => { if (!user) throw new Error("Authentication required"); await industryFrameworkService.createOperatingModel(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createIndustryProfile = useCallback(async (input: CreateIndustryProfileInput) => { if (!user) throw new Error("Authentication required"); await industryFrameworkService.createIndustryProfile(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createDashboardTemplate = useCallback(async (input: CreateDashboardTemplateInput) => { if (!user) throw new Error("Authentication required"); await industryFrameworkService.createDashboardTemplate(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createWorkflowTemplate = useCallback(async (input: CreateWorkflowTemplateInput) => { if (!user) throw new Error("Authentication required"); await industryFrameworkService.createWorkflowTemplate(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRoleTemplate = useCallback(async (input: CreateRoleTemplateInput) => { if (!user) throw new Error("Authentication required"); await industryFrameworkService.createRoleTemplate(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createReportTemplate = useCallback(async (input: CreateReportTemplateInput) => { if (!user) throw new Error("Authentication required"); await industryFrameworkService.createReportTemplate(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createDynamicConfiguration = useCallback(async (input: CreateDynamicConfigurationInput) => { if (!user) throw new Error("Authentication required"); await industryFrameworkService.createDynamicConfiguration(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createFeatureConfiguration = useCallback(async (input: CreateFeatureConfigurationInput) => { if (!user) throw new Error("Authentication required"); await industryFrameworkService.createFeatureConfiguration(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createBusinessRule = useCallback(async (input: CreateBusinessRuleInput) => { if (!user) throw new Error("Authentication required"); await industryFrameworkService.createBusinessRule(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createValidationRule = useCallback(async (input: CreateValidationRuleInput) => { if (!user) throw new Error("Authentication required"); await industryFrameworkService.createValidationRule(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createIndustryContext = useCallback(async (input: CreateIndustryContextInput) => { if (!user) throw new Error("Authentication required"); await industryFrameworkService.createIndustryContext(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createAiContext = useCallback(async (input: CreateAiContextInput) => { if (!user) throw new Error("Authentication required"); await industryFrameworkService.createAiContext(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createTerminologyEntry = useCallback(async (input: CreateTerminologyEntryInput) => { if (!user) throw new Error("Authentication required"); await industryFrameworkService.createTerminologyEntry(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createDemoProfile = useCallback(async (input: CreateDemoProfileInput) => { if (!user) throw new Error("Authentication required"); await industryFrameworkService.createDemoProfile(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createProductionProfile = useCallback(async (input: CreateProductionProfileInput) => { if (!user) throw new Error("Authentication required"); await industryFrameworkService.createProductionProfile(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createEnterpriseProfile = useCallback(async (input: CreateEnterpriseProfileInput) => { if (!user) throw new Error("Authentication required"); await industryFrameworkService.createEnterpriseProfile(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createSharedApi = useCallback(async (input: CreateSharedApiInput) => { if (!user) throw new Error("Authentication required"); await industryFrameworkService.createSharedApi(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createContextApi = useCallback(async (input: CreateContextApiInput) => { if (!user) throw new Error("Authentication required"); await industryFrameworkService.createContextApi(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createConfigurationApi = useCallback(async (input: CreateConfigurationApiInput) => { if (!user) throw new Error("Authentication required"); await industryFrameworkService.createConfigurationApi(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createExtensionPoint = useCallback(async (input: CreateExtensionPointInput) => { if (!user) throw new Error("Authentication required"); await industryFrameworkService.createExtensionPoint(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createFrameworkMetric = useCallback(async (input: CreateFrameworkMetricInput) => { if (!user) throw new Error("Authentication required"); await industryFrameworkService.createFrameworkMetric(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createFrameworkHealth = useCallback(async (input: CreateFrameworkHealthInput) => { if (!user) throw new Error("Authentication required"); await industryFrameworkService.createFrameworkHealth(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createCompatibilityCheck = useCallback(async (input: CreateCompatibilityCheckInput) => { if (!user) throw new Error("Authentication required"); await industryFrameworkService.createCompatibilityCheck(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createFrameworkFailure = useCallback(async (input: CreateFrameworkFailureInput) => { if (!user) throw new Error("Authentication required"); await industryFrameworkService.createFrameworkFailure(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);

    return {
        loading,
        stats,
        pipeline,
        frameworkHubs,
        createFrameworkHub,
        industryRegistrations,
        createIndustryRegistration,
        industryMetadata,
        createIndustryMetadata,
        industryVersions,
        createIndustryVersion,
        industryDependencies,
        createIndustryDependency,
        businessTypes,
        createBusinessType,
        businessSizes,
        createBusinessSize,
        operatingModels,
        createOperatingModel,
        industryProfiles,
        createIndustryProfile,
        dashboardTemplates,
        createDashboardTemplate,
        workflowTemplates,
        createWorkflowTemplate,
        roleTemplates,
        createRoleTemplate,
        reportTemplates,
        createReportTemplate,
        dynamicConfigurations,
        createDynamicConfiguration,
        featureConfigurations,
        createFeatureConfiguration,
        businessRules,
        createBusinessRule,
        validationRules,
        createValidationRule,
        industryContexts,
        createIndustryContext,
        aiContexts,
        createAiContext,
        terminologyEntries,
        createTerminologyEntry,
        demoProfiles,
        createDemoProfile,
        productionProfiles,
        createProductionProfile,
        enterpriseProfiles,
        createEnterpriseProfile,
        sharedApis,
        createSharedApi,
        contextApis,
        createContextApi,
        configurationApis,
        createConfigurationApi,
        extensionPoints,
        createExtensionPoint,
        frameworkMetrics,
        createFrameworkMetric,
        frameworkHealth,
        createFrameworkHealth,
        compatibilityChecks,
        createCompatibilityCheck,
        frameworkFailures,
        createFrameworkFailure,
        auditLogs,
        frameworkHubOptions,
        refresh,
    };
}
