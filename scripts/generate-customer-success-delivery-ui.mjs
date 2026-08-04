#!/usr/bin/env node
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const mod = join(root, "src/modules/customer-success-delivery");

const entities = [
    { tab: "deliveryHubs", plural: "deliveryHubs", singular: "DeliveryHub", pascal: "DeliveryHub", db: "csdDeliveryHubs", hubField: false, fields: [{ name: "hubKey", type: "string" }, { name: "hubName", type: "string" }, { name: "environment", type: "string" }], display: { title: "hubName", sub: "hubKey" } },
    { tab: "customerHealthScores", plural: "customerHealthScores", singular: "CustomerHealthScore", pascal: "CustomerHealthScore", db: "csdCustomerHealthScores", fields: [{ name: "scoreKey", type: "string" }, { name: "customerRef", type: "string" }, { name: "healthScore", type: "number" }], display: { title: "scoreKey", sub: "customerRef" } },
    { tab: "adoptionAnalytics", plural: "adoptionAnalytics", singular: "AdoptionAnalytic", pascal: "AdoptionAnalytic", db: "csdAdoptionAnalytics", fields: [{ name: "analyticsKey", type: "string" }, { name: "featureName", type: "string" }, { name: "adoptionRate", type: "number" }], display: { title: "featureName", sub: "adoptionRate" } },
    { tab: "successPlans", plural: "successPlans", singular: "SuccessPlan", pascal: "SuccessPlan", db: "csdSuccessPlans", fields: [{ name: "planKey", type: "string" }, { name: "planName", type: "string" }, { name: "planStatus", type: "select", options: "PLAN_STATUS_OPTIONS" }], display: { title: "planName", sub: "planStatus" } },
    { tab: "customerTimelines", plural: "customerTimelines", singular: "CustomerTimeline", pascal: "CustomerTimeline", db: "csdCustomerTimelines", fields: [{ name: "timelineKey", type: "string" }, { name: "timelineName", type: "string" }, { name: "timelineType", type: "string" }], display: { title: "timelineName", sub: "timelineType" } },
    { tab: "renewalForecasts", plural: "renewalForecasts", singular: "RenewalForecast", pascal: "RenewalForecast", db: "csdRenewalForecasts", fields: [{ name: "forecastKey", type: "string" }, { name: "customerRef", type: "string" }, { name: "forecastStatus", type: "select", options: "RENEWAL_STATUS_OPTIONS" }], display: { title: "forecastKey", sub: "customerRef" } },
    { tab: "supportTickets", plural: "supportTickets", singular: "SupportTicket", pascal: "SupportTicket", db: "csdSupportTickets", fields: [{ name: "ticketKey", type: "string" }, { name: "ticketTitle", type: "string" }, { name: "ticketStatus", type: "select", options: "TICKET_STATUS_OPTIONS" }], display: { title: "ticketTitle", sub: "ticketStatus" } },
    { tab: "liveChatSessions", plural: "liveChatSessions", singular: "LiveChatSession", pascal: "LiveChatSession", db: "csdLiveChatSessions", fields: [{ name: "sessionKey", type: "string" }, { name: "sessionTitle", type: "string" }, { name: "sessionStatus", type: "select", options: "SESSION_STATUS_OPTIONS" }], display: { title: "sessionTitle", sub: "sessionStatus" } },
    { tab: "knowledgeBaseArticles", plural: "knowledgeBaseArticles", singular: "KnowledgeBaseArticle", pascal: "KnowledgeBaseArticle", db: "csdKnowledgeBaseArticles", fields: [{ name: "articleKey", type: "string" }, { name: "articleTitle", type: "string" }, { name: "articleCategory", type: "string" }], display: { title: "articleTitle", sub: "articleCategory" } },
    { tab: "slaPolicies", plural: "slaPolicies", singular: "SlaPolicy", pascal: "SlaPolicy", db: "csdSlaPolicies", fields: [{ name: "policyKey", type: "string" }, { name: "policyName", type: "string" }, { name: "policyType", type: "string" }], display: { title: "policyName", sub: "policyType" } },
    { tab: "escalationRules", plural: "escalationRules", singular: "EscalationRule", pascal: "EscalationRule", db: "csdEscalationRules", fields: [{ name: "ruleKey", type: "string" }, { name: "ruleName", type: "string" }, { name: "ruleType", type: "string" }], display: { title: "ruleName", sub: "ruleType" } },
    { tab: "deploymentAutomations", plural: "deploymentAutomations", singular: "DeploymentAutomation", pascal: "DeploymentAutomation", db: "csdDeploymentAutomations", fields: [{ name: "automationKey", type: "string" }, { name: "automationName", type: "string" }, { name: "automationStatus", type: "select", options: "AUTOMATION_STATUS_OPTIONS" }], display: { title: "automationName", sub: "automationStatus" } },
    { tab: "environmentManagement", plural: "environmentManagement", singular: "EnvironmentManagement", pascal: "EnvironmentManagement", db: "csdEnvironmentManagement", fields: [{ name: "environmentKey", type: "string" }, { name: "environmentName", type: "string" }, { name: "environmentType", type: "string" }], display: { title: "environmentName", sub: "environmentType" } },
    { tab: "deploymentTracking", plural: "deploymentTracking", singular: "DeploymentTracking", pascal: "DeploymentTracking", db: "csdDeploymentTracking", fields: [{ name: "trackingKey", type: "string" }, { name: "deploymentName", type: "string" }, { name: "deploymentStatus", type: "select", options: "DEPLOYMENT_STATUS_OPTIONS" }], display: { title: "deploymentName", sub: "deploymentStatus" } },
    { tab: "upgradeManagement", plural: "upgradeManagement", singular: "UpgradeManagement", pascal: "UpgradeManagement", db: "csdUpgradeManagement", fields: [{ name: "upgradeKey", type: "string" }, { name: "upgradeName", type: "string" }, { name: "upgradeStatus", type: "select", options: "UPGRADE_STATUS_OPTIONS" }], display: { title: "upgradeName", sub: "upgradeStatus" } },
    { tab: "releaseTracking", plural: "releaseTracking", singular: "ReleaseTracking", pascal: "ReleaseTracking", db: "csdReleaseTracking", fields: [{ name: "releaseKey", type: "string" }, { name: "releaseName", type: "string" }, { name: "releaseStatus", type: "select", options: "RELEASE_STATUS_OPTIONS" }], display: { title: "releaseName", sub: "releaseStatus" } },
    { tab: "trainingPortals", plural: "trainingPortals", singular: "TrainingPortal", pascal: "TrainingPortal", db: "csdTrainingPortals", fields: [{ name: "portalKey", type: "string" }, { name: "portalName", type: "string" }, { name: "portalType", type: "string" }], display: { title: "portalName", sub: "portalType" } },
    { tab: "videoLibrary", plural: "videoLibrary", singular: "VideoLibrary", pascal: "VideoLibrary", db: "csdVideoLibrary", fields: [{ name: "videoKey", type: "string" }, { name: "videoTitle", type: "string" }, { name: "videoCategory", type: "string" }], display: { title: "videoTitle", sub: "videoCategory" } },
    { tab: "productTours", plural: "productTours", singular: "ProductTour", pascal: "ProductTour", db: "csdProductTours", fields: [{ name: "tourKey", type: "string" }, { name: "tourName", type: "string" }, { name: "tourType", type: "string" }], display: { title: "tourName", sub: "tourType" } },
    { tab: "certifications", plural: "certifications", singular: "Certification", pascal: "Certification", db: "csdCertifications", fields: [{ name: "certificationKey", type: "string" }, { name: "certificationName", type: "string" }, { name: "certificationType", type: "string" }], display: { title: "certificationName", sub: "certificationType" } },
    { tab: "progressTracking", plural: "progressTracking", singular: "ProgressTracking", pascal: "ProgressTracking", db: "csdProgressTracking", fields: [{ name: "progressKey", type: "string" }, { name: "learnerRef", type: "string" }, { name: "progressPercent", type: "number" }], display: { title: "progressKey", sub: "learnerRef" } },
    { tab: "learningAnalytics", plural: "learningAnalytics", singular: "LearningAnalytic", pascal: "LearningAnalytic", db: "csdLearningAnalytics", fields: [{ name: "analyticsKey", type: "string" }, { name: "metricName", type: "string" }, { name: "completionRate", type: "number" }], display: { title: "metricName", sub: "completionRate" } },
    { tab: "deliveryWorkflows", plural: "deliveryWorkflows", singular: "DeliveryWorkflow", pascal: "DeliveryWorkflow", db: "csdDeliveryWorkflows", fields: [{ name: "workflowKey", type: "string" }, { name: "workflowName", type: "string" }, { name: "workflowStatus", type: "select", options: "WORKFLOW_STATUS_OPTIONS" }], display: { title: "workflowName", sub: "workflowStatus" } },
    { tab: "onboardingAutomation", plural: "onboardingAutomation", singular: "OnboardingAutomation", pascal: "OnboardingAutomation", db: "csdOnboardingAutomation", fields: [{ name: "automationKey", type: "string" }, { name: "automationName", type: "string" }, { name: "automationStatus", type: "select", options: "AUTOMATION_STATUS_OPTIONS" }], display: { title: "automationName", sub: "automationStatus" } },
    { tab: "implementationTracking", plural: "implementationTracking", singular: "ImplementationTracking", pascal: "ImplementationTracking", db: "csdImplementationTracking", fields: [{ name: "trackingKey", type: "string" }, { name: "implementationName", type: "string" }, { name: "implementationStatus", type: "select", options: "IMPLEMENTATION_STATUS_OPTIONS" }], display: { title: "implementationName", sub: "implementationStatus" } },
    { tab: "resourceAssignments", plural: "resourceAssignments", singular: "ResourceAssignment", pascal: "ResourceAssignment", db: "csdResourceAssignments", fields: [{ name: "assignmentKey", type: "string" }, { name: "resourceName", type: "string" }, { name: "resourceType", type: "string" }], display: { title: "resourceName", sub: "resourceType" } },
    { tab: "milestoneTracking", plural: "milestoneTracking", singular: "MilestoneTracking", pascal: "MilestoneTracking", db: "csdMilestoneTracking", fields: [{ name: "milestoneKey", type: "string" }, { name: "milestoneName", type: "string" }, { name: "milestoneStatus", type: "select", options: "MILESTONE_STATUS_OPTIONS" }], display: { title: "milestoneName", sub: "milestoneStatus" } },
    { tab: "operationsMetrics", plural: "operationsMetrics", singular: "OperationsMetric", pascal: "OperationsMetric", db: "csdOperationsMetrics", hubField: false, orgOnly: true, fields: [{ name: "metricsKey", type: "string" }, { name: "customerHealthScore", type: "number" }, { name: "overallDeliveryScore", type: "number" }], display: { title: "metricsKey", sub: "overallDeliveryScore" } },
    { tab: "operationsHealth", plural: "operationsHealth", singular: "OperationsHealth", pascal: "OperationsHealth", db: "csdOperationsHealth", hubField: false, orgOnly: true, fields: [{ name: "healthKey", type: "string" }, { name: "overallScore", type: "number" }, { name: "disasterRecoveryMode", type: "boolean" }], display: { title: "healthKey", sub: "overallScore" } },
    { tab: "executiveKpis", plural: "executiveKpis", singular: "ExecutiveKpi", pascal: "ExecutiveKpi", db: "csdExecutiveKpis", fields: [{ name: "kpiKey", type: "string" }, { name: "kpiName", type: "string" }, { name: "kpiScore", type: "number" }], display: { title: "kpiName", sub: "kpiScore" } },
    { tab: "deliveryFailures", plural: "deliveryFailures", singular: "DeliveryFailure", pascal: "DeliveryFailure", db: "csdDeliveryFailures", fields: [{ name: "failureKey", type: "string" }, { name: "failureType", type: "string" }], display: { title: "failureKey", sub: "failureType" } },
];

const tabs = ["overview", ...entities.map((e) => e.tab), "auditLogs", "api"];
mkdirSync(join(mod, "constants"), { recursive: true });
mkdirSync(join(mod, "schemas"), { recursive: true });
mkdirSync(join(mod, "services"), { recursive: true });
mkdirSync(join(mod, "hooks"), { recursive: true });
mkdirSync(join(mod, "components"), { recursive: true });
mkdirSync(join(mod, "sdk"), { recursive: true });

// --- constants ---
writeFileSync(join(mod, "constants/index.ts"), `export const CSD_TABS = {
${tabs.map((t) => `    ${t}: "${t}",`).join("\n")}
} as const;

export const PLAN_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
    { value: "archived", label: "Archived" },
] as const;

export const RENEWAL_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "at_risk", label: "At Risk" },
    { value: "churned", label: "Churned" },
] as const;

export const TICKET_STATUS_OPTIONS = [
    { value: "open", label: "Open" },
    { value: "in_progress", label: "In Progress" },
    { value: "resolved", label: "Resolved" },
    { value: "closed", label: "Closed" },
] as const;

export const SESSION_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "waiting", label: "Waiting" },
    { value: "ended", label: "Ended" },
    { value: "missed", label: "Missed" },
] as const;

export const AUTOMATION_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "paused", label: "Paused" },
    { value: "failed", label: "Failed" },
    { value: "completed", label: "Completed" },
] as const;

export const DEPLOYMENT_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "deploying", label: "Deploying" },
    { value: "deployed", label: "Deployed" },
    { value: "failed", label: "Failed" },
] as const;

export const UPGRADE_STATUS_OPTIONS = [
    { value: "scheduled", label: "Scheduled" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "failed", label: "Failed" },
] as const;

export const RELEASE_STATUS_OPTIONS = [
    { value: "planned", label: "Planned" },
    { value: "in_progress", label: "In Progress" },
    { value: "released", label: "Released" },
    { value: "cancelled", label: "Cancelled" },
] as const;

export const WORKFLOW_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "paused", label: "Paused" },
    { value: "completed", label: "Completed" },
    { value: "failed", label: "Failed" },
] as const;

export const IMPLEMENTATION_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "blocked", label: "Blocked" },
] as const;

export const MILESTONE_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "missed", label: "Missed" },
] as const;

export const ALERT_SEVERITY_OPTIONS = [
    { value: "critical", label: "Critical" },
    { value: "warning", label: "Warning" },
    { value: "info", label: "Info" },
] as const;

export const CSD_PERMISSIONS = ["csd.view", "csd.manage", "csd.approve", "csd.admin"] as const;

export const CSD_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "healthy", label: "Healthy" },
    { value: "degraded", label: "Degraded" },
    { value: "failed", label: "Failed" },
    { value: "open", label: "Open" },
    { value: "ready", label: "Ready" },
    { value: "running", label: "Running" },
    { value: "pending", label: "Pending" },
    { value: "deployed", label: "Deployed" },
    { value: "completed", label: "Completed" },
] as const;


export const CSD_THEME = {
    primary: "sky-600",
    primaryHover: "sky-500",
    ring: "sky-500/20",
    text: "text-sky-600",
    textDark: "dark:text-sky-400",
    bg: "bg-sky-600",
    bgHover: "hover:bg-sky-500",
} as const;
`);

// --- schemas ---
const schemaLines = entities.map((e) => {
    const hubId = e.hubField === false ? "" : `\n    deliveryHubId: z.string().min(1),`;
    const fieldLines = e.fields.map((f) => {
        if (f.type === "number") return `    ${f.name}: z.number().optional(),`;
        if (f.type === "boolean") return `    ${f.name}: z.boolean().optional(),`;
        return `    ${f.name}: z.string().min(1).optional(),`;
    }).join("\n");
    const schemaName = e.tab.replace(/([A-Z])/g, (m) => m.toLowerCase());
    const camel = e.tab.charAt(0).toLowerCase() + e.tab.slice(1);
    return `export const ${camel}FormSchema = z.object({${hubId}
${fieldLines}
});

export type ${camel}FormValues = z.infer<typeof ${camel}FormSchema>;`;
});
writeFileSync(join(mod, "schemas/index.ts"), `import { z } from "zod";\n\n${schemaLines.join("\n\n")}\n`);

// --- service ---
const mapperImports = [
    "buildDeliveryHubLookupMaps", "buildCsdAuditPayload", "buildCsdDashboardStats", "buildCsdPipelineInfo", "mapAuditEntry",
    ...entities.flatMap((e) => [`build${e.pascal}Payload`, `map${e.pascal}Summary`]),
    "mapCustomerHealthScoreForStats", "mapSupportTicketForStats", "mapOperationsMetricForStats", "mapDeploymentTrackingForStats", "mapTrainingPortalForStats", "mapSupportTicketForStats", "mapOperationsHealthForStats", "mapDeliveryFailureForStats",
].join(",\n    ");

const typeImports = entities.flatMap((e) => [`${e.pascal}Summary`, `Create${e.pascal}Input`]).concat(["AuditEntry", "CsdDashboardStats", "CsdPipelineInfo", "CsdSdkTrackCustomerHealthInput", "CsdSdkTrackCustomerHealthResult", "CsdSdkOpenSupportTicketInput", "CsdSdkOpenSupportTicketResult", "CsdSdkRunDeliveryWorkflowInput", "CsdSdkRunDeliveryWorkflowResult"]).join(",\n    ");

const serviceMethods = entities.map((e) => {
    const maps = e.orgOnly ? "" : "\n        const maps = await this.getMaps(context.organizationId);";
    const mapCall = e.orgOnly ? `map${e.pascal}Summary` : `(r) => map${e.pascal}Summary(r, maps)`;
    const createMaps = e.orgOnly ? "" : "\n        const maps = await this.getMaps(context.organizationId);";
    const createReturn = e.orgOnly ? `return map${e.pascal}Summary(created);` : `return map${e.pascal}Summary(created, maps);`;
    return `
    async get${e.pascal}s(authUserId: string, email: string, fullName?: string | null): Promise<${e.pascal}Summary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];${maps}
        return (await databaseService.${e.db}.listByOrganization(context.organizationId)).map(${mapCall});
    }

    async create${e.pascal}(authUserId: string, email: string, input: Create${e.pascal}Input, fullName?: string | null): Promise<${e.pascal}Summary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.${e.db}.create(build${e.pascal}Payload(context.organizationId, input));
        if (!created) throw new Error("Failed to create ${e.plural}");
        await databaseService.csdAuditLogs.create(buildCsdAuditPayload(context.organizationId, "${e.tab.replace(/([A-Z])/g, "_$1").toLowerCase().replace(/^_/, "")}", "create", \`${e.pascal} created\`, created.id));${createMaps}
        ${createReturn}
    }`;
}).join("\n");

writeFileSync(join(mod, "services/customer-success-delivery.service.ts"), `import {
    ${mapperImports},
} from "@/src/modules/database/lib/customer-success-delivery-mappers";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import { createIndustryFrameworkClient } from "@/src/modules/industry-framework/sdk";
import { createBusinessProcessClient } from "@/src/modules/business-process/sdk";
import { createFormEngineClient } from "@/src/modules/form-engine/sdk";
import { createWorkflowEngineClient } from "@/src/modules/workflow-engine/sdk";
import { createDocumentEngineClient } from "@/src/modules/document-engine/sdk";
import { createCommercialSaasClient } from "@/src/modules/commercial-saas/sdk";
import { createEnterpriseIdentityClient } from "@/src/modules/enterprise-identity/sdk";
import { createCommunicationHubClient } from "@/src/modules/communication-hub/sdk";
import { createIntegrationPlatformClient } from "@/src/modules/integration-platform/sdk";
import { createLaunchFoundationClient } from "@/src/modules/launch-foundation/sdk";
import { createCompanyFoundationClient } from "@/src/modules/company-foundation/sdk";
import { crmService } from "@/src/modules/crm/services/crm.service";
import type {
    ${typeImports},
} from "@/src/modules/customer-success-delivery/types";

export class CustomerSuccessDeliveryService {
    private async getContext(authUserId: string, email: string, fullName?: string | null) {
        return resolveOrganizationContext(authUserId, email, fullName);
    }

    private async getMaps(organizationId: string) {
        const deliveryHubs = await databaseService.csdDeliveryHubs.listByOrganization(organizationId);
        return buildDeliveryHubLookupMaps(deliveryHubs);
    }

    async getDashboardStats(authUserId: string, email: string, fullName?: string | null): Promise<CsdDashboardStats> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return buildCsdDashboardStats({ deliveryHubs: [], customerHealthScores: [], supportTickets: [], deploymentTracking: [], trainingPortals: [], operationsMetrics: [], operationsHealth: [], deliveryFailures: [], auditLogs: [] });
        const [deliveryHubs, customerHealthScoresRaw, supportTicketsRaw, deploymentTrackingRaw, trainingPortalsRaw, operationsMetricsRaw, operationsHealthRaw, deliveryFailures, auditLogs] = await Promise.all([
            this.getDeliveryHubs(authUserId, email, fullName),
            databaseService.csdCustomerHealthScores.listByOrganization(context.organizationId),
            databaseService.csdSupportTickets.listByOrganization(context.organizationId),
            databaseService.csdDeploymentTracking.listByOrganization(context.organizationId),
            databaseService.csdTrainingPortals.listByOrganization(context.organizationId),
            databaseService.csdOperationsMetrics.listByOrganization(context.organizationId),
            databaseService.csdOperationsHealth.listByOrganization(context.organizationId),
            this.getDeliveryFailures(authUserId, email, fullName),
            this.getAuditLogs(authUserId, email, fullName),
        ]);
        return buildCsdDashboardStats({
            deliveryHubs,
            customerHealthScores: customerHealthScoresRaw.map(mapCustomerHealthScoreForStats),
            supportTickets: supportTicketsRaw.map(mapSupportTicketForStats),
            deploymentTracking: deploymentTrackingRaw.map(mapDeploymentTrackingForStats),
            trainingPortals: trainingPortalsRaw.map(mapTrainingPortalForStats),
            operationsMetrics: operationsMetricsRaw.map(mapOperationsMetricForStats),
            operationsHealth: operationsHealthRaw.map(mapOperationsHealthForStats),
            deliveryFailures,
            auditLogs,
        });
    }

    getPipelineInfo(): CsdPipelineInfo {
        return buildCsdPipelineInfo();
    }
${serviceMethods}

    async getAuditLogs(authUserId: string, email: string, fullName?: string | null): Promise<AuditEntry[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.csdAuditLogs.listByOrganization(context.organizationId)).map(mapAuditEntry);
    }

    async getDeliveryHubOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.csdDeliveryHubs.listByOrganization(context.organizationId)).map((r) => ({ id: r.id, name: r.hub_name }));
    }

    async sdkTrackCustomerHealth(authUserId: string, email: string, input: CsdSdkTrackCustomerHealthInput, fullName?: string | null): Promise<CsdSdkTrackCustomerHealthResult> {
        const ifr = createIndustryFrameworkClient(authUserId, email, fullName);
        await ifr.getIndustryFrameworkHubs();
        const dfe = createFormEngineClient(authUserId, email, fullName);
        await dfe.getFormEngineHubs();
        await crmService.getClients(authUserId, email, fullName);
        const created = await this.createCustomerHealthScore(authUserId, email, { deliveryHubId: input.deliveryHubId, scoreKey: input.scoreKey, customerRef: input.customerRef }, fullName);
        return { scoreId: created.id, scoreKey: created.scoreKey, status: created.status };
    }

    async sdkOpenSupportTicket(authUserId: string, email: string, input: CsdSdkOpenSupportTicketInput, fullName?: string | null): Promise<CsdSdkOpenSupportTicketResult> {
        const dwe = createWorkflowEngineClient(authUserId, email, fullName);
        await dwe.getWorkflowEngineHubs();
        const dde = createDocumentEngineClient(authUserId, email, fullName);
        await dde.getDocumentHubs();
        const comm = createCommunicationHubClient(authUserId, email, fullName);
        await comm.getCommunicationHubs();
        const created = await this.createSupportTicket(authUserId, email, { deliveryHubId: input.deliveryHubId, ticketKey: input.ticketKey, ticketTitle: input.ticketTitle }, fullName);
        return { ticketId: created.id, ticketKey: created.ticketKey, status: created.status };
    }

    async sdkRunDeliveryWorkflow(authUserId: string, email: string, input: CsdSdkRunDeliveryWorkflowInput, fullName?: string | null): Promise<CsdSdkRunDeliveryWorkflowResult> {
        const bpf = createBusinessProcessClient(authUserId, email, fullName);
        await bpf.getBusinessProcessHubs();
        const saas = createCommercialSaasClient(authUserId, email, fullName);
        await saas.getTenants();
        const identity = createEnterpriseIdentityClient(authUserId, email, fullName);
        await identity.getRealms();
        const intg = createIntegrationPlatformClient(authUserId, email, fullName);
        await intg.getIntegrationHubs();
        const launch = createLaunchFoundationClient(authUserId, email, fullName);
        await launch.getLaunchHubs();
        const company = createCompanyFoundationClient(authUserId, email, fullName);
        await company.getCompanyHubs();
        await crmService.getDeals(authUserId, email, fullName);
        const created = await this.createDeliveryWorkflow(authUserId, email, { deliveryHubId: input.deliveryHubId, workflowKey: input.workflowKey, workflowName: input.workflowName }, fullName);
        return { workflowId: created.id, workflowKey: created.workflowKey, status: created.status };
    }
}

export const customerSuccessDeliveryService = new CustomerSuccessDeliveryService();
`);

// --- hook ---
const hookTypeImports = entities.flatMap((e) => [`${e.pascal}Summary`, `Create${e.pascal}Input`]).concat(["AuditEntry", "CsdDashboardStats", "CsdPipelineInfo"]).join(",\n    ");
const hookStates = entities.map((e) => `    const [${e.plural}, set${e.pascal}s] = useState<${e.pascal}Summary[]>([]);`).join("\n");
const hookFetchVars = entities.map((e) => `${e.plural}List`).join(",\n            ");
const hookFetchCalls = entities.map((e) => `            customerSuccessDeliveryService.get${e.pascal}s(authUserId, email, fullName),`).join("\n");
const hookReturnProps = entities.map((e) => `${e.plural}List`).join(",\n            ");
const hookApplySets = entities.map((e) => `        set${e.pascal}s(result.${e.plural}List);`).join("\n");
const hookCreates = entities.map((e) => `    const create${e.pascal} = useCallback(async (input: Create${e.pascal}Input) => { if (!user) throw new Error("Authentication required"); await customerSuccessDeliveryService.create${e.pascal}(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);`).join("\n");
const hookReturnFields = entities.map((e) => `        ${e.plural},\n        create${e.pascal},`).join("\n");

writeFileSync(join(mod, "hooks/useCustomerSuccessDelivery.ts"), `"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { customerSuccessDeliveryService } from "@/src/modules/customer-success-delivery/services/customer-success-delivery.service";
import type {
    ${hookTypeImports},
} from "@/src/modules/customer-success-delivery/types";

export function useCustomerSuccessDelivery() {
    const user = useAuthStore((state) => state.user);
    const authUserId = user?.id;
    const email = user?.email ?? "";
    const fullName = user?.fullName;
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<CsdDashboardStats | null>(null);
    const [pipeline, setPipeline] = useState<CsdPipelineInfo | null>(null);
${hookStates}
    const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
    const [deliveryHubOptions, setIntegrationHubOptions] = useState<Array<{ id: string; name: string }>>([]);

    const fetchData = useCallback(async () => {
        if (!authUserId || !email) return { empty: true as const };
        const [
            statsData,
            pipelineInfo,
${hookFetchVars},
            auditLogsList,
            hubOpts,
        ] = await Promise.all([
            customerSuccessDeliveryService.getDashboardStats(authUserId, email, fullName),
            Promise.resolve(customerSuccessDeliveryService.getPipelineInfo()),
${hookFetchCalls}
            customerSuccessDeliveryService.getAuditLogs(authUserId, email, fullName),
            customerSuccessDeliveryService.getDeliveryHubOptions(authUserId, email, fullName),
        ]);
        return {
            statsData,
            pipelineInfo,
${hookReturnProps},
            auditLogsList,
            hubOpts,
        };
    }, [authUserId, email, fullName]);

    const applyData = useCallback((result: Awaited<ReturnType<typeof fetchData>>) => {
        if ("empty" in result) { setLoading(false); return; }
        setStats(result.statsData);
        setPipeline(result.pipelineInfo);
${hookApplySets}
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

${hookCreates}

    return {
        loading,
        stats,
        pipeline,
${hookReturnFields}
        auditLogs,
        deliveryHubOptions,
        refresh,
    };
}
`);

// --- panels ---
const label = (tab) => tab.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
const panelImports = entities.map((e) => `${e.pascal}sPanel`).join(",\n    ");
const schemaImports = entities.map((e) => {
    const camel = e.tab.charAt(0).toLowerCase() + e.tab.slice(1);
    return `    ${camel}FormSchema,\n    type ${camel}FormValues,`;
}).join("\n");

const panelFns = entities.map((e) => {
    const camel = e.tab.charAt(0).toLowerCase() + e.tab.slice(1);
    const panelName = `${e.pascal}sPanel`;
    const defaults = e.fields.reduce((acc, f) => {
        acc[f.name] = f.type === "number" ? 0 : f.type === "boolean" ? false : "";
        return acc;
    }, e.hubField === false ? {} : { deliveryHubId: "" });
    const defaultStr = JSON.stringify(defaults);
    const formFields = e.fields.map((f) => {
        if (f.type === "select") return `                <select {...form.register("${f.name}")} className={inputClass}>{${f.options}.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>`;
        if (f.type === "number") return `                <input type="number" step="any" {...form.register("${f.name}", { valueAsNumber: true })} placeholder="${f.name}" className={inputClass} />`;
        if (f.type === "boolean") return `                <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...form.register("${f.name}")} /> ${f.name}</label>`;
        return `                <input {...form.register("${f.name}")} placeholder="${f.name}" className={inputClass} />`;
    }).join("\n");
    const hubSelect = e.hubField === false ? "" : `                <DeliveryHubSelect data={data} {...form.register("deliveryHubId")} />\n`;
    const titleField = e.display.title;
    const subField = e.display.sub;
    return `export function ${panelName}({ data }: { data: RetailData }) {
    const form = useForm<${camel}FormValues>({ resolver: zodResolver(${camel}FormSchema), defaultValues: ${defaultStr} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="${label(e.tab)}" description="Enterprise retail operating system ${label(e.tab).toLowerCase()}" /><div className="mt-6 space-y-3">
                {data.${e.plural}.length === 0 ? <EmptyState title="No ${label(e.tab).toLowerCase()}" description="Create the first ${label(e.tab).toLowerCase()} record." /> : data.${e.plural}.map((item) => (
                    <ListCard key={item.id} title={String(item.${titleField})} subtitle={\`\${item.hubName ? item.hubName + " • " : ""}\${item.${subField}}\`} meta={\`\${item.status}\`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create ${label(e.tab).toLowerCase()}" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.create${e.pascal}(v))}>
${hubSelect}${formFields}
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}`;
}).join("\n\n");

writeFileSync(join(mod, "components/CustomerSuccessDeliveryPanels.tsx"), `"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/src/components/ui/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { CSD_THEME, SESSION_STATUS_OPTIONS, ALERT_SEVERITY_OPTIONS } from "@/src/modules/customer-success-delivery/constants";
import type { useCustomerSuccessDelivery } from "@/src/modules/customer-success-delivery/hooks/useCustomerSuccessDelivery";
import {
${schemaImports}
} from "@/src/modules/customer-success-delivery/schemas";

type RetailData = ReturnType<typeof useCustomerSuccessDelivery>;
const inputClass = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-sky-500/20 focus:ring-4 dark:border-slate-800 dark:bg-sky-950";
function SaveButton({ loading, label = "Save changes" }: { loading?: boolean; label?: string }) {
    return <button type="submit" disabled={loading} className="rounded-full bg-sky-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-sky-500 disabled:opacity-60">{loading ? "Saving..." : label}</button>;
}
function ListCard({ title, subtitle, meta }: { title: string; subtitle: string; meta?: string }) {
    return <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800"><p className="font-medium">{title}</p><p className="text-sm text-sky-500">{subtitle}</p>{meta ? <p className="mt-1 text-xs text-sky-600">{meta}</p> : null}</div>;
}
function DeliveryHubSelect({ data, ...props }: { data: RetailData } & React.SelectHTMLAttributes<HTMLSelectElement>) {
    return <select {...props} className={inputClass}><option value="">Select retail operating system</option>{data.deliveryHubOptions.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>;
}

export function RetailOverviewPanel({ data }: { data: RetailData }) {
    const pipeline = data.pipeline;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="Customer Success & Delivery summary" description="System health, background jobs, event bus, trainingPortals, feature flags, configuration, diagnostics, and operations dashboard" /><div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ListCard title="Delivery Hubs" subtitle={\`\${data.stats?.totalDeliveryHubs ?? 0} total\`} meta={\`\${data.stats?.activeDeliveryHubs ?? 0} active • \${data.stats?.customerHealthScoreCount ?? 0} dining areas\`} />
                <ListCard title="Connectors" subtitle={\`\${data.stats?.supportTicketsCount ?? 0} menu categories\`} meta={\`\${data.stats?.deploymentTrackingCount ?? 0} deploymentTracking • \${data.stats?.trainingPortalCount ?? 0} open trainingPortals\`} />
                <ListCard title="Health" subtitle={\`\${(data.stats?.overallDeliveryScore ?? 0).toFixed(1)} overall retail score\`} meta={\`\${data.stats?.openFailureCount ?? 0} open failures\`} />
                <ListCard title="Audit Trail" subtitle={\`\${data.stats?.auditCount ?? 0} audit entries\`} meta="Security-first retail operating system" />
            </div></Card>
            <Card hover><SectionHeader title="Retail operating system pipeline" description={\`\${pipeline?.previousStage ?? "configured"} → \${pipeline?.currentStage ?? "active"} → \${pipeline?.nextStage ?? "degraded"}\`} /><div className="mt-6 space-y-3">
                {pipeline?.stages?.length ? pipeline.stages.map((stage) => (
                    <ListCard key={stage.key} title={stage.label} subtitle={stage.key} meta={stage.label} />
                )) : <EmptyState title="No pipeline data" description="Retail operating system pipeline stages will appear as hubs are configured." />}
            </div></Card>
        </div>
    );
}

${panelFns}

export function RetailAuditLogsPanel({ data }: { data: RetailData }) {
    return (
        <Card hover><SectionHeader title="Customer Success & Delivery audit history" description="Security-first audit trail for jobs, events, trainingPortals, and marketplace operations" /><div className="mt-6 space-y-3">
            {data.auditLogs.length === 0 ? <EmptyState title="No audit entries" description="Audit logs are created automatically for retail operating system." /> : data.auditLogs.map((entry) => (
                <ListCard key={entry.id} title={entry.summary} subtitle={\`\${entry.entityType} • \${entry.action}\`} meta={\`\${entry.securityLevel} • \${new Date(entry.createdAt).toLocaleString()}\`} />
            ))}
        </div></Card>
    );
}

export function RetailSdkPanel({ data }: { data: RetailData }) {
    return (
        <Card hover><SectionHeader title="Shared Customer Success & Delivery SDK" description="Import from @/src/modules/customer-success-delivery/sdk for brand registration, menu configuration, and order workflow execution" /><div className="mt-6 space-y-4 text-sm text-sky-600 dark:text-sky-300">
            <ListCard title="createCustomerSuccessDeliveryClient()" subtitle="Factory for module-scoped Customer Success & Delivery client with auth context" meta="Primary SDK for enterprise retail operating system" />
            <ListCard title="sdkTrackCustomerHealth()" subtitle="Register retail operating system with AI orchestration" meta="moduleSource: customer_success_delivery" />
            <ListCard title="sdkOpenSupportTicket()" subtitle="Open support ticket with knowledge context" meta="v1/v2/v3 API versions" />
            <ListCard title="sdkRunDeliveryWorkflow()" subtitle="Run delivery workflow with audit trail" meta="Event-driven integration delivery" />
            <p className="text-xs text-sky-500">Theme: {CSD_THEME.primary} • Integration hubs loaded: {data.deliveryHubs.length}</p>
            <pre className="overflow-x-auto rounded-2xl bg-sky-950 p-4 text-xs text-sky-100">{\`import { createCustomerSuccessDeliveryClient } from "@/src/modules/customer-success-delivery/sdk";

const intg = createCustomerSuccessDeliveryClient(userId, email, fullName);
await intg.registerCampus({ deliveryHubId, serviceKey: "svc-001", serviceName: "Stripe" });
await intg.openSupportTicket({ deliveryHubId, keyName: "prod-key", apiVersion: "v1" });
await intg.runDeliveryWorkflow({ deliveryHubId, webhookKey: "wh-001", webhookName: "Events" });\`}</pre>
        </div></Card>
    );
}
`);

// --- stats ---
writeFileSync(join(mod, "components/CustomerSuccessDeliveryStats.tsx"), `import { StatCard } from "@/src/components/ui/StatCard";
import type { CsdDashboardStats } from "@/src/modules/customer-success-delivery/types";

interface CustomerSuccessDeliveryStatsProps { stats: CsdDashboardStats | null; }

export function CustomerSuccessDeliveryStats({ stats }: CustomerSuccessDeliveryStatsProps) {
    const cards = [
        { title: "Delivery Hubs", value: String(stats?.totalDeliveryHubs ?? 0), detail: \`\${stats?.activeDeliveryHubs ?? 0} active • \${stats?.customerHealthScoreCount ?? 0} dining areas\`, trend: "up" as const },
        { title: "Connectors", value: String(stats?.supportTicketsCount ?? 0), detail: \`\${stats?.deploymentTrackingCount ?? 0} deploymentTracking • \${stats?.trainingPortalCount ?? 0} open trainingPortals\`, trend: "up" as const, tone: "accent" as const },
        { title: "Health Score", value: \`\${(stats?.overallDeliveryScore ?? 0).toFixed(1)}\`, detail: \`\${stats?.openFailureCount ?? 0} open failures\`, trend: "up" as const },
        { title: "Audit Trail", value: String(stats?.auditCount ?? 0), detail: "Jobs, events, trainingPortals, and configuration audit entries", trend: "up" as const },
    ];
    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 [&_p:last-child]:text-sky-600 dark:[&_p:last-child]:text-sky-400">
            {cards.map((card) => <StatCard key={card.title} title={card.title} value={card.value} detail={card.detail} trend={card.trend} tone={card.tone} />)}
        </section>
    );
}
`);

// --- page ---
const tabDefs = [
    { id: "overview", label: "Overview", panel: "RetailOverviewPanel" },
    ...entities.map((e) => ({ id: e.tab, label: label(e.tab), panel: `${e.pascal}sPanel` })),
    { id: "auditLogs", label: "Audit Logs", panel: "RetailAuditLogsPanel" },
    { id: "api", label: "SDK", panel: "RetailSdkPanel" },
];

writeFileSync(join(mod, "components/CustomerSuccessDeliveryPage.tsx"), `"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { LoadingState } from "@/src/components/ui/LoadingState";
import {
    RetailOverviewPanel,
    ${panelImports},
    RetailAuditLogsPanel,
    RetailSdkPanel,
} from "@/src/modules/customer-success-delivery/components/CustomerSuccessDeliveryPanels";
import { CustomerSuccessDeliveryStats } from "@/src/modules/customer-success-delivery/components/CustomerSuccessDeliveryStats";
import { CSD_TABS } from "@/src/modules/customer-success-delivery/constants";
import { useCustomerSuccessDelivery } from "@/src/modules/customer-success-delivery/hooks/useCustomerSuccessDelivery";

const tabs = [
${tabDefs.map((t) => `    { id: CSD_TABS.${t.id}, label: "${t.label}" },`).join("\n")}
] as const;

export function CustomerSuccessDeliveryPage() {
    const retail = useCustomerSuccessDelivery();
    const [activeTab, setActiveTab] = useState<(typeof CSD_TABS)[keyof typeof CSD_TABS]>(CSD_TABS.overview);

    if (retail.loading) {
        return <div className="mx-auto max-w-7xl"><LoadingState label="Loading Customer Success & Delivery" /></div>;
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-sky-900 dark:text-sky-100">
            <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-sky-900/80">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-sky-600">V2 Program A Program F Wave 3</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Enterprise Customer Success & Delivery</h1>
                <p className="mt-3 max-w-2xl text-sm text-sky-500 dark:text-sky-400">
                    Integration layer for the entire SaaS platform: dining areas, payment & accounting connectors, public API platform, webhook delivery, integration marketplace, API analytics, and retail operating system dashboard with security-first audit and the shared Customer Success & Delivery SDK.
                </p>
            </motion.header>
            <CustomerSuccessDeliveryStats stats={retail.stats} />
            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={\`rounded-full px-4 py-2 text-sm font-medium transition \${activeTab === tab.id ? "bg-sky-600 text-white" : "border border-slate-200 text-sky-600 hover:border-sky-300 dark:border-slate-800 dark:text-sky-300"}\`}>{tab.label}</button>
                ))}
            </div>
${tabDefs.map((t) => `            {activeTab === CSD_TABS.${t.id} ? <${t.panel} data={retail} /> : null}`).join("\n")}
        </div>
    );
}
`);

// --- sdk ---
writeFileSync(join(mod, "sdk/index.ts"), `import { customerSuccessDeliveryService } from "@/src/modules/customer-success-delivery/services/customer-success-delivery.service";
import type { CsdSdkTrackCustomerHealthInput, CsdSdkOpenSupportTicketInput, CsdSdkRunDeliveryWorkflowInput } from "@/src/modules/customer-success-delivery/types";

export class CustomerSuccessDeliveryClient {
    constructor(
        private readonly authUserId: string,
        private readonly email: string,
        private readonly fullName?: string | null,
    ) {}

    async trackCustomerHealth(input: CsdSdkTrackCustomerHealthInput) {
        return customerSuccessDeliveryService.sdkTrackCustomerHealth(this.authUserId, this.email, input, this.fullName);
    }

    async openSupportTicket(input: CsdSdkOpenSupportTicketInput) {
        return customerSuccessDeliveryService.sdkOpenSupportTicket(this.authUserId, this.email, input, this.fullName);
    }

    async runDeliveryWorkflow(input: CsdSdkRunDeliveryWorkflowInput) {
        return customerSuccessDeliveryService.sdkRunDeliveryWorkflow(this.authUserId, this.email, input, this.fullName);
    }

    async getDeliveryHubs() {
        return customerSuccessDeliveryService.getDeliveryHubs(this.authUserId, this.email, this.fullName);
    }

    async getDashboardStats() {
        return customerSuccessDeliveryService.getDashboardStats(this.authUserId, this.email, this.fullName);
    }

    async getPipelineInfo() {
        return customerSuccessDeliveryService.getPipelineInfo();
    }
}

export function createCustomerSuccessDeliveryClient(authUserId: string, email: string, fullName?: string | null): CustomerSuccessDeliveryClient {
    return new CustomerSuccessDeliveryClient(authUserId, email, fullName);
}

export { customerSuccessDeliveryService };
`);

// --- index ---
writeFileSync(join(mod, "index.ts"), `export { CustomerSuccessDeliveryPage } from "@/src/modules/customer-success-delivery/components/CustomerSuccessDeliveryPage";
export { CustomerSuccessDeliveryStats } from "@/src/modules/customer-success-delivery/components/CustomerSuccessDeliveryStats";
export { customerSuccessDeliveryService } from "@/src/modules/customer-success-delivery/services/customer-success-delivery.service";
export { useCustomerSuccessDelivery } from "@/src/modules/customer-success-delivery/hooks/useCustomerSuccessDelivery";
export { createCustomerSuccessDeliveryClient, CustomerSuccessDeliveryClient } from "@/src/modules/customer-success-delivery/sdk";
export * from "@/src/modules/customer-success-delivery/types";
export * from "@/src/modules/customer-success-delivery/constants";
`);

console.log(`Generated retail operating system module files. CSD_TABS count: ${tabs.length}`);
