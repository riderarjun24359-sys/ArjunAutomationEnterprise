#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

const daPath = join(root, "src/modules/database/data-access.ts");
let da = readFileSync(daPath, "utf8");

if (!da.includes("DweWorkflowHubRepository")) {
    const anchor = "} from \"@/src/modules/database/repositories/form-engine-repositories\";";
    const dfeImportEnd = da.indexOf(anchor) + anchor.length;
    const dweImport = `
import {
    DweWorkflowHubRepository,
    DweWorkflowDefinitionRepository,
    DweWorkflowCategoryRepository,
    DweWorkflowTemplateRepository,
    DweWorkflowVersionRepository,
    DweWorkflowNodeRepository,
    DweWorkflowTransitionRepository,
    DweDecisionNodeRepository,
    DweReusableSubflowRepository,
    DweWorkflowExecutionRepository,
    DweExecutionHistoryRepository,
    DweExecutionRetryRepository,
    DweExecutionRollbackRepository,
    DweTimeTriggerRepository,
    DweBusinessEventTriggerRepository,
    DweWebhookTriggerRepository,
    DweScheduledTriggerRepository,
    DweManualReviewRepository,
    DweApprovalTaskRepository,
    DweEscalationRuleRepository,
    DweSlaTrackingRepository,
    DweAutomationNotificationRepository,
    DweAutomationApiCallRepository,
    DweAutomationIntegrationRepository,
    DweExecutionAnalyticsRepository,
    DweBottleneckReportRepository,
    DweSlaComplianceMetricRepository,
    DweWorkflowMetricRepository,
    DweWorkflowHealthRepository,
    DweFailedExecutionRepository,
    DweWorkflowFailureRepository,
    DweAuditLogRepository,
} from "@/src/modules/database/repositories/workflow-engine-repositories";
`;
    da = da.slice(0, dfeImportEnd) + dweImport + da.slice(dfeImportEnd);

    const dfeProp = "    readonly dfeAuditLogs: DfeAuditLogRepository;";
    const dweProps = `    readonly dweWorkflowHubs: DweWorkflowHubRepository;
    readonly dweWorkflowDefinitions: DweWorkflowDefinitionRepository;
    readonly dweWorkflowCategories: DweWorkflowCategoryRepository;
    readonly dweWorkflowTemplates: DweWorkflowTemplateRepository;
    readonly dweWorkflowVersions: DweWorkflowVersionRepository;
    readonly dweWorkflowNodes: DweWorkflowNodeRepository;
    readonly dweWorkflowTransitions: DweWorkflowTransitionRepository;
    readonly dweDecisionNodes: DweDecisionNodeRepository;
    readonly dweReusableSubflows: DweReusableSubflowRepository;
    readonly dweWorkflowExecutions: DweWorkflowExecutionRepository;
    readonly dweExecutionHistory: DweExecutionHistoryRepository;
    readonly dweExecutionRetries: DweExecutionRetryRepository;
    readonly dweExecutionRollbacks: DweExecutionRollbackRepository;
    readonly dweTimeTriggers: DweTimeTriggerRepository;
    readonly dweBusinessEventTriggers: DweBusinessEventTriggerRepository;
    readonly dweWebhookTriggers: DweWebhookTriggerRepository;
    readonly dweScheduledTriggers: DweScheduledTriggerRepository;
    readonly dweManualReviews: DweManualReviewRepository;
    readonly dweApprovalTasks: DweApprovalTaskRepository;
    readonly dweEscalationRules: DweEscalationRuleRepository;
    readonly dweSlaTrackings: DweSlaTrackingRepository;
    readonly dweAutomationNotifications: DweAutomationNotificationRepository;
    readonly dweAutomationApiCalls: DweAutomationApiCallRepository;
    readonly dweAutomationIntegrations: DweAutomationIntegrationRepository;
    readonly dweExecutionAnalytics: DweExecutionAnalyticsRepository;
    readonly dweBottleneckReports: DweBottleneckReportRepository;
    readonly dweSlaComplianceMetrics: DweSlaComplianceMetricRepository;
    readonly dweWorkflowMetrics: DweWorkflowMetricRepository;
    readonly dweWorkflowHealth: DweWorkflowHealthRepository;
    readonly dweFailedExecutions: DweFailedExecutionRepository;
    readonly dweWorkflowFailures: DweWorkflowFailureRepository;
    readonly dweAuditLogs: DweAuditLogRepository;`;
    da = da.replace(dfeProp, dfeProp + "\n" + dweProps);

    const dfeCtor = "        this.dfeAuditLogs = new DfeAuditLogRepository();";
    const dweCtor = `        this.dweWorkflowHubs = new DweWorkflowHubRepository();
        this.dweWorkflowDefinitions = new DweWorkflowDefinitionRepository();
        this.dweWorkflowCategories = new DweWorkflowCategoryRepository();
        this.dweWorkflowTemplates = new DweWorkflowTemplateRepository();
        this.dweWorkflowVersions = new DweWorkflowVersionRepository();
        this.dweWorkflowNodes = new DweWorkflowNodeRepository();
        this.dweWorkflowTransitions = new DweWorkflowTransitionRepository();
        this.dweDecisionNodes = new DweDecisionNodeRepository();
        this.dweReusableSubflows = new DweReusableSubflowRepository();
        this.dweWorkflowExecutions = new DweWorkflowExecutionRepository();
        this.dweExecutionHistory = new DweExecutionHistoryRepository();
        this.dweExecutionRetries = new DweExecutionRetryRepository();
        this.dweExecutionRollbacks = new DweExecutionRollbackRepository();
        this.dweTimeTriggers = new DweTimeTriggerRepository();
        this.dweBusinessEventTriggers = new DweBusinessEventTriggerRepository();
        this.dweWebhookTriggers = new DweWebhookTriggerRepository();
        this.dweScheduledTriggers = new DweScheduledTriggerRepository();
        this.dweManualReviews = new DweManualReviewRepository();
        this.dweApprovalTasks = new DweApprovalTaskRepository();
        this.dweEscalationRules = new DweEscalationRuleRepository();
        this.dweSlaTrackings = new DweSlaTrackingRepository();
        this.dweAutomationNotifications = new DweAutomationNotificationRepository();
        this.dweAutomationApiCalls = new DweAutomationApiCallRepository();
        this.dweAutomationIntegrations = new DweAutomationIntegrationRepository();
        this.dweExecutionAnalytics = new DweExecutionAnalyticsRepository();
        this.dweBottleneckReports = new DweBottleneckReportRepository();
        this.dweSlaComplianceMetrics = new DweSlaComplianceMetricRepository();
        this.dweWorkflowMetrics = new DweWorkflowMetricRepository();
        this.dweWorkflowHealth = new DweWorkflowHealthRepository();
        this.dweFailedExecutions = new DweFailedExecutionRepository();
        this.dweWorkflowFailures = new DweWorkflowFailureRepository();
        this.dweAuditLogs = new DweAuditLogRepository();`;
    da = da.replace(dfeCtor, dfeCtor + "\n" + dweCtor);

    writeFileSync(daPath, da, "utf8");
}

const dsPath = join(root, "src/modules/database/services/database-service.ts");
let ds = readFileSync(dsPath, "utf8");
if (!ds.includes("dweWorkflowHubs")) {
    ds = ds.replace(
        "    dfeAuditLogs: databaseAccess.dfeAuditLogs,",
        `    dfeAuditLogs: databaseAccess.dfeAuditLogs,
    dweWorkflowHubs: databaseAccess.dweWorkflowHubs,
    dweWorkflowDefinitions: databaseAccess.dweWorkflowDefinitions,
    dweWorkflowCategories: databaseAccess.dweWorkflowCategories,
    dweWorkflowTemplates: databaseAccess.dweWorkflowTemplates,
    dweWorkflowVersions: databaseAccess.dweWorkflowVersions,
    dweWorkflowNodes: databaseAccess.dweWorkflowNodes,
    dweWorkflowTransitions: databaseAccess.dweWorkflowTransitions,
    dweDecisionNodes: databaseAccess.dweDecisionNodes,
    dweReusableSubflows: databaseAccess.dweReusableSubflows,
    dweWorkflowExecutions: databaseAccess.dweWorkflowExecutions,
    dweExecutionHistory: databaseAccess.dweExecutionHistory,
    dweExecutionRetries: databaseAccess.dweExecutionRetries,
    dweExecutionRollbacks: databaseAccess.dweExecutionRollbacks,
    dweTimeTriggers: databaseAccess.dweTimeTriggers,
    dweBusinessEventTriggers: databaseAccess.dweBusinessEventTriggers,
    dweWebhookTriggers: databaseAccess.dweWebhookTriggers,
    dweScheduledTriggers: databaseAccess.dweScheduledTriggers,
    dweManualReviews: databaseAccess.dweManualReviews,
    dweApprovalTasks: databaseAccess.dweApprovalTasks,
    dweEscalationRules: databaseAccess.dweEscalationRules,
    dweSlaTrackings: databaseAccess.dweSlaTrackings,
    dweAutomationNotifications: databaseAccess.dweAutomationNotifications,
    dweAutomationApiCalls: databaseAccess.dweAutomationApiCalls,
    dweAutomationIntegrations: databaseAccess.dweAutomationIntegrations,
    dweExecutionAnalytics: databaseAccess.dweExecutionAnalytics,
    dweBottleneckReports: databaseAccess.dweBottleneckReports,
    dweSlaComplianceMetrics: databaseAccess.dweSlaComplianceMetrics,
    dweWorkflowMetrics: databaseAccess.dweWorkflowMetrics,
    dweWorkflowHealth: databaseAccess.dweWorkflowHealth,
    dweFailedExecutions: databaseAccess.dweFailedExecutions,
    dweWorkflowFailures: databaseAccess.dweWorkflowFailures,
    dweAuditLogs: databaseAccess.dweAuditLogs,`
    );
    writeFileSync(dsPath, ds, "utf8");
}

console.log("Wired data-access and database-service for DWE");
