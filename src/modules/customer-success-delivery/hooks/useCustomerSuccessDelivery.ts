"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { customerSuccessDeliveryService } from "@/src/modules/customer-success-delivery/services/customer-success-delivery.service";
import type {
    DeliveryHubSummary,
    CreateDeliveryHubInput,
    CustomerHealthScoreSummary,
    CreateCustomerHealthScoreInput,
    AdoptionAnalyticSummary,
    CreateAdoptionAnalyticInput,
    SuccessPlanSummary,
    CreateSuccessPlanInput,
    CustomerTimelineSummary,
    CreateCustomerTimelineInput,
    RenewalForecastSummary,
    CreateRenewalForecastInput,
    SupportTicketSummary,
    CreateSupportTicketInput,
    LiveChatSessionSummary,
    CreateLiveChatSessionInput,
    KnowledgeBaseArticleSummary,
    CreateKnowledgeBaseArticleInput,
    SlaPolicySummary,
    CreateSlaPolicyInput,
    EscalationRuleSummary,
    CreateEscalationRuleInput,
    DeploymentAutomationSummary,
    CreateDeploymentAutomationInput,
    EnvironmentManagementSummary,
    CreateEnvironmentManagementInput,
    DeploymentTrackingSummary,
    CreateDeploymentTrackingInput,
    UpgradeManagementSummary,
    CreateUpgradeManagementInput,
    ReleaseTrackingSummary,
    CreateReleaseTrackingInput,
    TrainingPortalSummary,
    CreateTrainingPortalInput,
    VideoLibrarySummary,
    CreateVideoLibraryInput,
    ProductTourSummary,
    CreateProductTourInput,
    CertificationSummary,
    CreateCertificationInput,
    ProgressTrackingSummary,
    CreateProgressTrackingInput,
    LearningAnalyticSummary,
    CreateLearningAnalyticInput,
    DeliveryWorkflowSummary,
    CreateDeliveryWorkflowInput,
    OnboardingAutomationSummary,
    CreateOnboardingAutomationInput,
    ImplementationTrackingSummary,
    CreateImplementationTrackingInput,
    ResourceAssignmentSummary,
    CreateResourceAssignmentInput,
    MilestoneTrackingSummary,
    CreateMilestoneTrackingInput,
    OperationsMetricSummary,
    CreateOperationsMetricInput,
    OperationsHealthSummary,
    CreateOperationsHealthInput,
    ExecutiveKpiSummary,
    CreateExecutiveKpiInput,
    DeliveryFailureSummary,
    CreateDeliveryFailureInput,
    AuditEntry,
    CsdDashboardStats,
    CsdPipelineInfo,
} from "@/src/modules/customer-success-delivery/types";

export function useCustomerSuccessDelivery() {
    const user = useAuthStore((state) => state.user);
    const authUserId = user?.id;
    const email = user?.email ?? "";
    const fullName = user?.fullName;
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<CsdDashboardStats | null>(null);
    const [pipeline, setPipeline] = useState<CsdPipelineInfo | null>(null);
    const [deliveryHubs, setDeliveryHubs] = useState<DeliveryHubSummary[]>([]);
    const [customerHealthScores, setCustomerHealthScores] = useState<CustomerHealthScoreSummary[]>([]);
    const [adoptionAnalytics, setAdoptionAnalytics] = useState<AdoptionAnalyticSummary[]>([]);
    const [successPlans, setSuccessPlans] = useState<SuccessPlanSummary[]>([]);
    const [customerTimelines, setCustomerTimelines] = useState<CustomerTimelineSummary[]>([]);
    const [renewalForecasts, setRenewalForecasts] = useState<RenewalForecastSummary[]>([]);
    const [supportTickets, setSupportTickets] = useState<SupportTicketSummary[]>([]);
    const [liveChatSessions, setLiveChatSessions] = useState<LiveChatSessionSummary[]>([]);
    const [knowledgeBaseArticles, setKnowledgeBaseArticles] = useState<KnowledgeBaseArticleSummary[]>([]);
    const [slaPolicies, setSlaPolicys] = useState<SlaPolicySummary[]>([]);
    const [escalationRules, setEscalationRules] = useState<EscalationRuleSummary[]>([]);
    const [deploymentAutomations, setDeploymentAutomations] = useState<DeploymentAutomationSummary[]>([]);
    const [environmentManagement, setEnvironmentManagements] = useState<EnvironmentManagementSummary[]>([]);
    const [deploymentTracking, setDeploymentTrackings] = useState<DeploymentTrackingSummary[]>([]);
    const [upgradeManagement, setUpgradeManagements] = useState<UpgradeManagementSummary[]>([]);
    const [releaseTracking, setReleaseTrackings] = useState<ReleaseTrackingSummary[]>([]);
    const [trainingPortals, setTrainingPortals] = useState<TrainingPortalSummary[]>([]);
    const [videoLibrary, setVideoLibrarys] = useState<VideoLibrarySummary[]>([]);
    const [productTours, setProductTours] = useState<ProductTourSummary[]>([]);
    const [certifications, setCertifications] = useState<CertificationSummary[]>([]);
    const [progressTracking, setProgressTrackings] = useState<ProgressTrackingSummary[]>([]);
    const [learningAnalytics, setLearningAnalytics] = useState<LearningAnalyticSummary[]>([]);
    const [deliveryWorkflows, setDeliveryWorkflows] = useState<DeliveryWorkflowSummary[]>([]);
    const [onboardingAutomation, setOnboardingAutomations] = useState<OnboardingAutomationSummary[]>([]);
    const [implementationTracking, setImplementationTrackings] = useState<ImplementationTrackingSummary[]>([]);
    const [resourceAssignments, setResourceAssignments] = useState<ResourceAssignmentSummary[]>([]);
    const [milestoneTracking, setMilestoneTrackings] = useState<MilestoneTrackingSummary[]>([]);
    const [operationsMetrics, setOperationsMetrics] = useState<OperationsMetricSummary[]>([]);
    const [operationsHealth, setOperationsHealths] = useState<OperationsHealthSummary[]>([]);
    const [executiveKpis, setExecutiveKpis] = useState<ExecutiveKpiSummary[]>([]);
    const [deliveryFailures, setDeliveryFailures] = useState<DeliveryFailureSummary[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
    const [deliveryHubOptions, setIntegrationHubOptions] = useState<Array<{ id: string; name: string }>>([]);

    const fetchData = useCallback(async () => {
        if (!authUserId || !email) return { empty: true as const };
        const [
            statsData,
            pipelineInfo,
deliveryHubsList,
            customerHealthScoresList,
            adoptionAnalyticsList,
            successPlansList,
            customerTimelinesList,
            renewalForecastsList,
            supportTicketsList,
            liveChatSessionsList,
            knowledgeBaseArticlesList,
            slaPoliciesList,
            escalationRulesList,
            deploymentAutomationsList,
            environmentManagementList,
            deploymentTrackingList,
            upgradeManagementList,
            releaseTrackingList,
            trainingPortalsList,
            videoLibraryList,
            productToursList,
            certificationsList,
            progressTrackingList,
            learningAnalyticsList,
            deliveryWorkflowsList,
            onboardingAutomationList,
            implementationTrackingList,
            resourceAssignmentsList,
            milestoneTrackingList,
            operationsMetricsList,
            operationsHealthList,
            executiveKpisList,
            deliveryFailuresList,
            auditLogsList,
            hubOpts,
        ] = await Promise.all([
            customerSuccessDeliveryService.getDashboardStats(authUserId, email, fullName),
            Promise.resolve(customerSuccessDeliveryService.getPipelineInfo()),
            customerSuccessDeliveryService.getDeliveryHubs(authUserId, email, fullName),
            customerSuccessDeliveryService.getCustomerHealthScores(authUserId, email, fullName),
            customerSuccessDeliveryService.getAdoptionAnalytics(authUserId, email, fullName),
            customerSuccessDeliveryService.getSuccessPlans(authUserId, email, fullName),
            customerSuccessDeliveryService.getCustomerTimelines(authUserId, email, fullName),
            customerSuccessDeliveryService.getRenewalForecasts(authUserId, email, fullName),
            customerSuccessDeliveryService.getSupportTickets(authUserId, email, fullName),
            customerSuccessDeliveryService.getLiveChatSessions(authUserId, email, fullName),
            customerSuccessDeliveryService.getKnowledgeBaseArticles(authUserId, email, fullName),
            customerSuccessDeliveryService.getSlaPolicys(authUserId, email, fullName),
            customerSuccessDeliveryService.getEscalationRules(authUserId, email, fullName),
            customerSuccessDeliveryService.getDeploymentAutomations(authUserId, email, fullName),
            customerSuccessDeliveryService.getEnvironmentManagements(authUserId, email, fullName),
            customerSuccessDeliveryService.getDeploymentTrackings(authUserId, email, fullName),
            customerSuccessDeliveryService.getUpgradeManagements(authUserId, email, fullName),
            customerSuccessDeliveryService.getReleaseTrackings(authUserId, email, fullName),
            customerSuccessDeliveryService.getTrainingPortals(authUserId, email, fullName),
            customerSuccessDeliveryService.getVideoLibrarys(authUserId, email, fullName),
            customerSuccessDeliveryService.getProductTours(authUserId, email, fullName),
            customerSuccessDeliveryService.getCertifications(authUserId, email, fullName),
            customerSuccessDeliveryService.getProgressTrackings(authUserId, email, fullName),
            customerSuccessDeliveryService.getLearningAnalytics(authUserId, email, fullName),
            customerSuccessDeliveryService.getDeliveryWorkflows(authUserId, email, fullName),
            customerSuccessDeliveryService.getOnboardingAutomations(authUserId, email, fullName),
            customerSuccessDeliveryService.getImplementationTrackings(authUserId, email, fullName),
            customerSuccessDeliveryService.getResourceAssignments(authUserId, email, fullName),
            customerSuccessDeliveryService.getMilestoneTrackings(authUserId, email, fullName),
            customerSuccessDeliveryService.getOperationsMetrics(authUserId, email, fullName),
            customerSuccessDeliveryService.getOperationsHealths(authUserId, email, fullName),
            customerSuccessDeliveryService.getExecutiveKpis(authUserId, email, fullName),
            customerSuccessDeliveryService.getDeliveryFailures(authUserId, email, fullName),
            customerSuccessDeliveryService.getAuditLogs(authUserId, email, fullName),
            customerSuccessDeliveryService.getDeliveryHubOptions(authUserId, email, fullName),
        ]);
        return {
            statsData,
            pipelineInfo,
deliveryHubsList,
            customerHealthScoresList,
            adoptionAnalyticsList,
            successPlansList,
            customerTimelinesList,
            renewalForecastsList,
            supportTicketsList,
            liveChatSessionsList,
            knowledgeBaseArticlesList,
            slaPoliciesList,
            escalationRulesList,
            deploymentAutomationsList,
            environmentManagementList,
            deploymentTrackingList,
            upgradeManagementList,
            releaseTrackingList,
            trainingPortalsList,
            videoLibraryList,
            productToursList,
            certificationsList,
            progressTrackingList,
            learningAnalyticsList,
            deliveryWorkflowsList,
            onboardingAutomationList,
            implementationTrackingList,
            resourceAssignmentsList,
            milestoneTrackingList,
            operationsMetricsList,
            operationsHealthList,
            executiveKpisList,
            deliveryFailuresList,
            auditLogsList,
            hubOpts,
        };
    }, [authUserId, email, fullName]);

    const applyData = useCallback((result: Awaited<ReturnType<typeof fetchData>>) => {
        if ("empty" in result) { setLoading(false); return; }
        setStats(result.statsData);
        setPipeline(result.pipelineInfo);
        setDeliveryHubs(result.deliveryHubsList);
        setCustomerHealthScores(result.customerHealthScoresList);
        setAdoptionAnalytics(result.adoptionAnalyticsList);
        setSuccessPlans(result.successPlansList);
        setCustomerTimelines(result.customerTimelinesList);
        setRenewalForecasts(result.renewalForecastsList);
        setSupportTickets(result.supportTicketsList);
        setLiveChatSessions(result.liveChatSessionsList);
        setKnowledgeBaseArticles(result.knowledgeBaseArticlesList);
        setSlaPolicys(result.slaPoliciesList);
        setEscalationRules(result.escalationRulesList);
        setDeploymentAutomations(result.deploymentAutomationsList);
        setEnvironmentManagements(result.environmentManagementList);
        setDeploymentTrackings(result.deploymentTrackingList);
        setUpgradeManagements(result.upgradeManagementList);
        setReleaseTrackings(result.releaseTrackingList);
        setTrainingPortals(result.trainingPortalsList);
        setVideoLibrarys(result.videoLibraryList);
        setProductTours(result.productToursList);
        setCertifications(result.certificationsList);
        setProgressTrackings(result.progressTrackingList);
        setLearningAnalytics(result.learningAnalyticsList);
        setDeliveryWorkflows(result.deliveryWorkflowsList);
        setOnboardingAutomations(result.onboardingAutomationList);
        setImplementationTrackings(result.implementationTrackingList);
        setResourceAssignments(result.resourceAssignmentsList);
        setMilestoneTrackings(result.milestoneTrackingList);
        setOperationsMetrics(result.operationsMetricsList);
        setOperationsHealths(result.operationsHealthList);
        setExecutiveKpis(result.executiveKpisList);
        setDeliveryFailures(result.deliveryFailuresList);
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

    const createDeliveryHub = useCallback(async (input: CreateDeliveryHubInput) => { if (!user) throw new Error("Authentication required"); await customerSuccessDeliveryService.createDeliveryHub(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createCustomerHealthScore = useCallback(async (input: CreateCustomerHealthScoreInput) => { if (!user) throw new Error("Authentication required"); await customerSuccessDeliveryService.createCustomerHealthScore(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createAdoptionAnalytic = useCallback(async (input: CreateAdoptionAnalyticInput) => { if (!user) throw new Error("Authentication required"); await customerSuccessDeliveryService.createAdoptionAnalytic(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createSuccessPlan = useCallback(async (input: CreateSuccessPlanInput) => { if (!user) throw new Error("Authentication required"); await customerSuccessDeliveryService.createSuccessPlan(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createCustomerTimeline = useCallback(async (input: CreateCustomerTimelineInput) => { if (!user) throw new Error("Authentication required"); await customerSuccessDeliveryService.createCustomerTimeline(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRenewalForecast = useCallback(async (input: CreateRenewalForecastInput) => { if (!user) throw new Error("Authentication required"); await customerSuccessDeliveryService.createRenewalForecast(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createSupportTicket = useCallback(async (input: CreateSupportTicketInput) => { if (!user) throw new Error("Authentication required"); await customerSuccessDeliveryService.createSupportTicket(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createLiveChatSession = useCallback(async (input: CreateLiveChatSessionInput) => { if (!user) throw new Error("Authentication required"); await customerSuccessDeliveryService.createLiveChatSession(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createKnowledgeBaseArticle = useCallback(async (input: CreateKnowledgeBaseArticleInput) => { if (!user) throw new Error("Authentication required"); await customerSuccessDeliveryService.createKnowledgeBaseArticle(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createSlaPolicy = useCallback(async (input: CreateSlaPolicyInput) => { if (!user) throw new Error("Authentication required"); await customerSuccessDeliveryService.createSlaPolicy(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createEscalationRule = useCallback(async (input: CreateEscalationRuleInput) => { if (!user) throw new Error("Authentication required"); await customerSuccessDeliveryService.createEscalationRule(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createDeploymentAutomation = useCallback(async (input: CreateDeploymentAutomationInput) => { if (!user) throw new Error("Authentication required"); await customerSuccessDeliveryService.createDeploymentAutomation(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createEnvironmentManagement = useCallback(async (input: CreateEnvironmentManagementInput) => { if (!user) throw new Error("Authentication required"); await customerSuccessDeliveryService.createEnvironmentManagement(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createDeploymentTracking = useCallback(async (input: CreateDeploymentTrackingInput) => { if (!user) throw new Error("Authentication required"); await customerSuccessDeliveryService.createDeploymentTracking(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createUpgradeManagement = useCallback(async (input: CreateUpgradeManagementInput) => { if (!user) throw new Error("Authentication required"); await customerSuccessDeliveryService.createUpgradeManagement(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createReleaseTracking = useCallback(async (input: CreateReleaseTrackingInput) => { if (!user) throw new Error("Authentication required"); await customerSuccessDeliveryService.createReleaseTracking(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createTrainingPortal = useCallback(async (input: CreateTrainingPortalInput) => { if (!user) throw new Error("Authentication required"); await customerSuccessDeliveryService.createTrainingPortal(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createVideoLibrary = useCallback(async (input: CreateVideoLibraryInput) => { if (!user) throw new Error("Authentication required"); await customerSuccessDeliveryService.createVideoLibrary(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createProductTour = useCallback(async (input: CreateProductTourInput) => { if (!user) throw new Error("Authentication required"); await customerSuccessDeliveryService.createProductTour(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createCertification = useCallback(async (input: CreateCertificationInput) => { if (!user) throw new Error("Authentication required"); await customerSuccessDeliveryService.createCertification(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createProgressTracking = useCallback(async (input: CreateProgressTrackingInput) => { if (!user) throw new Error("Authentication required"); await customerSuccessDeliveryService.createProgressTracking(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createLearningAnalytic = useCallback(async (input: CreateLearningAnalyticInput) => { if (!user) throw new Error("Authentication required"); await customerSuccessDeliveryService.createLearningAnalytic(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createDeliveryWorkflow = useCallback(async (input: CreateDeliveryWorkflowInput) => { if (!user) throw new Error("Authentication required"); await customerSuccessDeliveryService.createDeliveryWorkflow(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createOnboardingAutomation = useCallback(async (input: CreateOnboardingAutomationInput) => { if (!user) throw new Error("Authentication required"); await customerSuccessDeliveryService.createOnboardingAutomation(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createImplementationTracking = useCallback(async (input: CreateImplementationTrackingInput) => { if (!user) throw new Error("Authentication required"); await customerSuccessDeliveryService.createImplementationTracking(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createResourceAssignment = useCallback(async (input: CreateResourceAssignmentInput) => { if (!user) throw new Error("Authentication required"); await customerSuccessDeliveryService.createResourceAssignment(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createMilestoneTracking = useCallback(async (input: CreateMilestoneTrackingInput) => { if (!user) throw new Error("Authentication required"); await customerSuccessDeliveryService.createMilestoneTracking(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createOperationsMetric = useCallback(async (input: CreateOperationsMetricInput) => { if (!user) throw new Error("Authentication required"); await customerSuccessDeliveryService.createOperationsMetric(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createOperationsHealth = useCallback(async (input: CreateOperationsHealthInput) => { if (!user) throw new Error("Authentication required"); await customerSuccessDeliveryService.createOperationsHealth(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createExecutiveKpi = useCallback(async (input: CreateExecutiveKpiInput) => { if (!user) throw new Error("Authentication required"); await customerSuccessDeliveryService.createExecutiveKpi(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createDeliveryFailure = useCallback(async (input: CreateDeliveryFailureInput) => { if (!user) throw new Error("Authentication required"); await customerSuccessDeliveryService.createDeliveryFailure(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);

    return {
        loading,
        stats,
        pipeline,
        deliveryHubs,
        createDeliveryHub,
        customerHealthScores,
        createCustomerHealthScore,
        adoptionAnalytics,
        createAdoptionAnalytic,
        successPlans,
        createSuccessPlan,
        customerTimelines,
        createCustomerTimeline,
        renewalForecasts,
        createRenewalForecast,
        supportTickets,
        createSupportTicket,
        liveChatSessions,
        createLiveChatSession,
        knowledgeBaseArticles,
        createKnowledgeBaseArticle,
        slaPolicies,
        createSlaPolicy,
        escalationRules,
        createEscalationRule,
        deploymentAutomations,
        createDeploymentAutomation,
        environmentManagement,
        createEnvironmentManagement,
        deploymentTracking,
        createDeploymentTracking,
        upgradeManagement,
        createUpgradeManagement,
        releaseTracking,
        createReleaseTracking,
        trainingPortals,
        createTrainingPortal,
        videoLibrary,
        createVideoLibrary,
        productTours,
        createProductTour,
        certifications,
        createCertification,
        progressTracking,
        createProgressTracking,
        learningAnalytics,
        createLearningAnalytic,
        deliveryWorkflows,
        createDeliveryWorkflow,
        onboardingAutomation,
        createOnboardingAutomation,
        implementationTracking,
        createImplementationTracking,
        resourceAssignments,
        createResourceAssignment,
        milestoneTracking,
        createMilestoneTracking,
        operationsMetrics,
        createOperationsMetric,
        operationsHealth,
        createOperationsHealth,
        executiveKpis,
        createExecutiveKpi,
        deliveryFailures,
        createDeliveryFailure,
        auditLogs,
        deliveryHubOptions,
        refresh,
    };
}
