#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

const daPath = join(root, "src/modules/database/data-access.ts");
let da = readFileSync(daPath, "utf8");

if (!da.includes("CsdDeliveryHubRepository")) {
    const anchor = '} from "@/src/modules/database/repositories/company-foundation-repositories";';
    const cmpImportEnd = da.indexOf(anchor) + anchor.length;
    const csdImport = `
import {
    CsdDeliveryHubRepository,
    CsdCustomerHealthScoreRepository,
    CsdAdoptionAnalyticRepository,
    CsdSuccessPlanRepository,
    CsdCustomerTimelineRepository,
    CsdRenewalForecastRepository,
    CsdSupportTicketRepository,
    CsdLiveChatSessionRepository,
    CsdKnowledgeBaseArticleRepository,
    CsdSlaPolicyRepository,
    CsdEscalationRuleRepository,
    CsdDeploymentAutomationRepository,
    CsdEnvironmentManagementRepository,
    CsdDeploymentTrackingRepository,
    CsdUpgradeManagementRepository,
    CsdReleaseTrackingRepository,
    CsdTrainingPortalRepository,
    CsdVideoLibraryRepository,
    CsdProductTourRepository,
    CsdCertificationRepository,
    CsdProgressTrackingRepository,
    CsdLearningAnalyticRepository,
    CsdDeliveryWorkflowRepository,
    CsdOnboardingAutomationRepository,
    CsdImplementationTrackingRepository,
    CsdResourceAssignmentRepository,
    CsdMilestoneTrackingRepository,
    CsdOperationsMetricRepository,
    CsdOperationsHealthRepository,
    CsdExecutiveKpiRepository,
    CsdDeliveryFailureRepository,
    CsdAuditLogRepository,
}
from "@/src/modules/database/repositories/customer-success-delivery-repositories";
`;
    da = da.slice(0, cmpImportEnd) + csdImport + da.slice(cmpImportEnd);

    const cmpProp = "    readonly cmpAuditLogs: CmpAuditLogRepository;";
    const csdProps = `    readonly csdDeliveryHubs: CsdDeliveryHubRepository;
    readonly csdCustomerHealthScores: CsdCustomerHealthScoreRepository;
    readonly csdAdoptionAnalytics: CsdAdoptionAnalyticRepository;
    readonly csdSuccessPlans: CsdSuccessPlanRepository;
    readonly csdCustomerTimelines: CsdCustomerTimelineRepository;
    readonly csdRenewalForecasts: CsdRenewalForecastRepository;
    readonly csdSupportTickets: CsdSupportTicketRepository;
    readonly csdLiveChatSessions: CsdLiveChatSessionRepository;
    readonly csdKnowledgeBaseArticles: CsdKnowledgeBaseArticleRepository;
    readonly csdSlaPolicies: CsdSlaPolicyRepository;
    readonly csdEscalationRules: CsdEscalationRuleRepository;
    readonly csdDeploymentAutomations: CsdDeploymentAutomationRepository;
    readonly csdEnvironmentManagement: CsdEnvironmentManagementRepository;
    readonly csdDeploymentTracking: CsdDeploymentTrackingRepository;
    readonly csdUpgradeManagement: CsdUpgradeManagementRepository;
    readonly csdReleaseTracking: CsdReleaseTrackingRepository;
    readonly csdTrainingPortals: CsdTrainingPortalRepository;
    readonly csdVideoLibrary: CsdVideoLibraryRepository;
    readonly csdProductTours: CsdProductTourRepository;
    readonly csdCertifications: CsdCertificationRepository;
    readonly csdProgressTracking: CsdProgressTrackingRepository;
    readonly csdLearningAnalytics: CsdLearningAnalyticRepository;
    readonly csdDeliveryWorkflows: CsdDeliveryWorkflowRepository;
    readonly csdOnboardingAutomation: CsdOnboardingAutomationRepository;
    readonly csdImplementationTracking: CsdImplementationTrackingRepository;
    readonly csdResourceAssignments: CsdResourceAssignmentRepository;
    readonly csdMilestoneTracking: CsdMilestoneTrackingRepository;
    readonly csdOperationsMetrics: CsdOperationsMetricRepository;
    readonly csdOperationsHealth: CsdOperationsHealthRepository;
    readonly csdExecutiveKpis: CsdExecutiveKpiRepository;
    readonly csdDeliveryFailures: CsdDeliveryFailureRepository;
    readonly csdAuditLogs: CsdAuditLogRepository;`;
    da = da.replace(cmpProp, cmpProp + "\n" + csdProps);

    const cmpCtor = "        this.cmpAuditLogs = new CmpAuditLogRepository();";
    const csdCtor = `        this.csdDeliveryHubs = new CsdDeliveryHubRepository();
        this.csdCustomerHealthScores = new CsdCustomerHealthScoreRepository();
        this.csdAdoptionAnalytics = new CsdAdoptionAnalyticRepository();
        this.csdSuccessPlans = new CsdSuccessPlanRepository();
        this.csdCustomerTimelines = new CsdCustomerTimelineRepository();
        this.csdRenewalForecasts = new CsdRenewalForecastRepository();
        this.csdSupportTickets = new CsdSupportTicketRepository();
        this.csdLiveChatSessions = new CsdLiveChatSessionRepository();
        this.csdKnowledgeBaseArticles = new CsdKnowledgeBaseArticleRepository();
        this.csdSlaPolicies = new CsdSlaPolicyRepository();
        this.csdEscalationRules = new CsdEscalationRuleRepository();
        this.csdDeploymentAutomations = new CsdDeploymentAutomationRepository();
        this.csdEnvironmentManagement = new CsdEnvironmentManagementRepository();
        this.csdDeploymentTracking = new CsdDeploymentTrackingRepository();
        this.csdUpgradeManagement = new CsdUpgradeManagementRepository();
        this.csdReleaseTracking = new CsdReleaseTrackingRepository();
        this.csdTrainingPortals = new CsdTrainingPortalRepository();
        this.csdVideoLibrary = new CsdVideoLibraryRepository();
        this.csdProductTours = new CsdProductTourRepository();
        this.csdCertifications = new CsdCertificationRepository();
        this.csdProgressTracking = new CsdProgressTrackingRepository();
        this.csdLearningAnalytics = new CsdLearningAnalyticRepository();
        this.csdDeliveryWorkflows = new CsdDeliveryWorkflowRepository();
        this.csdOnboardingAutomation = new CsdOnboardingAutomationRepository();
        this.csdImplementationTracking = new CsdImplementationTrackingRepository();
        this.csdResourceAssignments = new CsdResourceAssignmentRepository();
        this.csdMilestoneTracking = new CsdMilestoneTrackingRepository();
        this.csdOperationsMetrics = new CsdOperationsMetricRepository();
        this.csdOperationsHealth = new CsdOperationsHealthRepository();
        this.csdExecutiveKpis = new CsdExecutiveKpiRepository();
        this.csdDeliveryFailures = new CsdDeliveryFailureRepository();
        this.csdAuditLogs = new CsdAuditLogRepository();`;
    da = da.replace(cmpCtor, cmpCtor + "\n" + csdCtor);

    writeFileSync(daPath, da, "utf8");
}

const dsPath = join(root, "src/modules/database/services/database-service.ts");
let ds = readFileSync(dsPath, "utf8");
if (!ds.includes("csdDeliveryHubs")) {
    ds = ds.replace(
        "    cmpAuditLogs: databaseAccess.cmpAuditLogs,",
        `    cmpAuditLogs: databaseAccess.cmpAuditLogs,
    csdDeliveryHubs: databaseAccess.csdDeliveryHubs,
    csdCustomerHealthScores: databaseAccess.csdCustomerHealthScores,
    csdAdoptionAnalytics: databaseAccess.csdAdoptionAnalytics,
    csdSuccessPlans: databaseAccess.csdSuccessPlans,
    csdCustomerTimelines: databaseAccess.csdCustomerTimelines,
    csdRenewalForecasts: databaseAccess.csdRenewalForecasts,
    csdSupportTickets: databaseAccess.csdSupportTickets,
    csdLiveChatSessions: databaseAccess.csdLiveChatSessions,
    csdKnowledgeBaseArticles: databaseAccess.csdKnowledgeBaseArticles,
    csdSlaPolicies: databaseAccess.csdSlaPolicies,
    csdEscalationRules: databaseAccess.csdEscalationRules,
    csdDeploymentAutomations: databaseAccess.csdDeploymentAutomations,
    csdEnvironmentManagement: databaseAccess.csdEnvironmentManagement,
    csdDeploymentTracking: databaseAccess.csdDeploymentTracking,
    csdUpgradeManagement: databaseAccess.csdUpgradeManagement,
    csdReleaseTracking: databaseAccess.csdReleaseTracking,
    csdTrainingPortals: databaseAccess.csdTrainingPortals,
    csdVideoLibrary: databaseAccess.csdVideoLibrary,
    csdProductTours: databaseAccess.csdProductTours,
    csdCertifications: databaseAccess.csdCertifications,
    csdProgressTracking: databaseAccess.csdProgressTracking,
    csdLearningAnalytics: databaseAccess.csdLearningAnalytics,
    csdDeliveryWorkflows: databaseAccess.csdDeliveryWorkflows,
    csdOnboardingAutomation: databaseAccess.csdOnboardingAutomation,
    csdImplementationTracking: databaseAccess.csdImplementationTracking,
    csdResourceAssignments: databaseAccess.csdResourceAssignments,
    csdMilestoneTracking: databaseAccess.csdMilestoneTracking,
    csdOperationsMetrics: databaseAccess.csdOperationsMetrics,
    csdOperationsHealth: databaseAccess.csdOperationsHealth,
    csdExecutiveKpis: databaseAccess.csdExecutiveKpis,
    csdDeliveryFailures: databaseAccess.csdDeliveryFailures,
    csdAuditLogs: databaseAccess.csdAuditLogs,`
    );
    writeFileSync(dsPath, ds, "utf8");
}

console.log("Wired data-access and database-service for CSD");
