#!/usr/bin/env node
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const mod = join(root, "src/modules/ai-organization-foundation");

const entities = [
    { tab: "organizationHubs", plural: "organizationHubs", singular: "OrganizationHub", pascal: "OrganizationHub", db: "aofOrganizationHubs", hubField: false, fields: [{ name: "hubKey", type: "string" }, { name: "hubName", type: "string" }, { name: "environment", type: "string" }], display: { title: "hubName", sub: "hubKey" } },
    { tab: "growthOrchestrators", plural: "growthOrchestrators", singular: "GrowthOrchestrator", pascal: "GrowthOrchestrator", db: "aofGrowthOrchestrators", fields: [{ name: "orchestratorKey", type: "string" }, { name: "orchestratorName", type: "string" }, { name: "orchestratorStatus", type: "select", options: "ORCHESTRATOR_STATUS_OPTIONS" }], display: { title: "orchestratorName", sub: "orchestratorStatus" } },
    { tab: "campaignIntelligence", plural: "campaignIntelligence", singular: "CampaignIntelligence", pascal: "CampaignIntelligence", db: "aofCampaignIntelligence", fields: [{ name: "campaignKey", type: "string" }, { name: "campaignName", type: "string" }, { name: "campaignStatus", type: "select", options: "CAMPAIGN_STATUS_OPTIONS" }], display: { title: "campaignName", sub: "campaignStatus" } },
    { tab: "leadPrioritization", plural: "leadPrioritization", singular: "LeadPrioritization", pascal: "LeadPrioritization", db: "aofLeadPrioritization", fields: [{ name: "leadKey", type: "string" }, { name: "leadName", type: "string" }, { name: "priorityScore", type: "number" }], display: { title: "leadName", sub: "priorityScore" } },
    { tab: "opportunityRecommendations", plural: "opportunityRecommendations", singular: "OpportunityRecommendation", pascal: "OpportunityRecommendation", db: "aofOpportunityRecommendations", fields: [{ name: "recommendationKey", type: "string" }, { name: "recommendationTitle", type: "string" }, { name: "recommendationType", type: "string" }], display: { title: "recommendationTitle", sub: "recommendationType" } },
    { tab: "pipelineHealth", plural: "pipelineHealth", singular: "PipelineHealth", pascal: "PipelineHealth", db: "aofPipelineHealth", fields: [{ name: "healthKey", type: "string" }, { name: "healthName", type: "string" }, { name: "healthScore", type: "number" }], display: { title: "healthName", sub: "healthScore" } },
    { tab: "growthAnalytics", plural: "growthAnalytics", singular: "GrowthAnalytics", pascal: "GrowthAnalytics", db: "aofGrowthAnalytics", fields: [{ name: "analyticsKey", type: "string" }, { name: "analyticsName", type: "string" }, { name: "analyticsType", type: "string" }], display: { title: "analyticsName", sub: "analyticsType" } },
    { tab: "executiveGrowthDashboards", plural: "executiveGrowthDashboards", singular: "ExecutiveGrowthDashboard", pascal: "ExecutiveGrowthDashboard", db: "aofExecutiveGrowthDashboards", fields: [{ name: "dashboardKey", type: "string" }, { name: "dashboardName", type: "string" }, { name: "dashboardStatus", type: "select", options: "DASHBOARD_STATUS_OPTIONS" }], display: { title: "dashboardName", sub: "dashboardStatus" } },
    { tab: "deliveryOrchestrators", plural: "deliveryOrchestrators", singular: "DeliveryOrchestrator", pascal: "DeliveryOrchestrator", db: "aofDeliveryOrchestrators", fields: [{ name: "orchestratorKey", type: "string" }, { name: "orchestratorName", type: "string" }, { name: "orchestratorStatus", type: "select", options: "ORCHESTRATOR_STATUS_OPTIONS" }], display: { title: "orchestratorName", sub: "orchestratorStatus" } },
    { tab: "resourcePlanners", plural: "resourcePlanners", singular: "ResourcePlanner", pascal: "ResourcePlanner", db: "aofResourcePlanners", fields: [{ name: "plannerKey", type: "string" }, { name: "plannerName", type: "string" }, { name: "plannerStatus", type: "select", options: "PLANNER_STATUS_OPTIONS" }], display: { title: "plannerName", sub: "plannerStatus" } },
    { tab: "implementationSchedulers", plural: "implementationSchedulers", singular: "ImplementationScheduler", pascal: "ImplementationScheduler", db: "aofImplementationSchedulers", fields: [{ name: "schedulerKey", type: "string" }, { name: "schedulerName", type: "string" }, { name: "schedulerStatus", type: "select", options: "SCHEDULER_STATUS_OPTIONS" }], display: { title: "schedulerName", sub: "schedulerStatus" } },
    { tab: "deploymentCoordination", plural: "deploymentCoordination", singular: "DeploymentCoordination", pascal: "DeploymentCoordination", db: "aofDeploymentCoordination", fields: [{ name: "coordinationKey", type: "string" }, { name: "coordinationName", type: "string" }, { name: "coordinationStatus", type: "select", options: "COORDINATION_STATUS_OPTIONS" }], display: { title: "coordinationName", sub: "coordinationStatus" } },
    { tab: "deliveryIntelligence", plural: "deliveryIntelligence", singular: "DeliveryIntelligence", pascal: "DeliveryIntelligence", db: "aofDeliveryIntelligence", fields: [{ name: "intelligenceKey", type: "string" }, { name: "intelligenceTitle", type: "string" }, { name: "intelligenceType", type: "string" }], display: { title: "intelligenceTitle", sub: "intelligenceType" } },
    { tab: "customerSuccessAutomation", plural: "customerSuccessAutomation", singular: "CustomerSuccessAutomation", pascal: "CustomerSuccessAutomation", db: "aofCustomerSuccessAutomation", fields: [{ name: "automationKey", type: "string" }, { name: "automationName", type: "string" }, { name: "automationStatus", type: "select", options: "AUTOMATION_STATUS_OPTIONS" }], display: { title: "automationName", sub: "automationStatus" } },
    { tab: "executiveDeliveryDashboards", plural: "executiveDeliveryDashboards", singular: "ExecutiveDeliveryDashboard", pascal: "ExecutiveDeliveryDashboard", db: "aofExecutiveDeliveryDashboards", fields: [{ name: "dashboardKey", type: "string" }, { name: "dashboardName", type: "string" }, { name: "dashboardStatus", type: "select", options: "DASHBOARD_STATUS_OPTIONS" }], display: { title: "dashboardName", sub: "dashboardStatus" } },
    { tab: "ideaRegistry", plural: "ideaRegistry", singular: "IdeaRegistry", pascal: "IdeaRegistry", db: "aofIdeaRegistry", fields: [{ name: "ideaKey", type: "string" }, { name: "ideaTitle", type: "string" }, { name: "ideaStatus", type: "select", options: "IDEA_STATUS_OPTIONS" }], display: { title: "ideaTitle", sub: "ideaStatus" } },
    { tab: "innovationPipeline", plural: "innovationPipeline", singular: "InnovationPipeline", pascal: "InnovationPipeline", db: "aofInnovationPipeline", fields: [{ name: "pipelineKey", type: "string" }, { name: "pipelineName", type: "string" }, { name: "pipelineStatus", type: "select", options: "PIPELINE_STATUS_OPTIONS" }], display: { title: "pipelineName", sub: "pipelineStatus" } },
    { tab: "experimentTracker", plural: "experimentTracker", singular: "ExperimentTracker", pascal: "ExperimentTracker", db: "aofExperimentTracker", fields: [{ name: "experimentKey", type: "string" }, { name: "experimentName", type: "string" }, { name: "experimentStatus", type: "select", options: "EXPERIMENT_STATUS_OPTIONS" }], display: { title: "experimentName", sub: "experimentStatus" } },
    { tab: "validationWorkflow", plural: "validationWorkflow", singular: "ValidationWorkflow", pascal: "ValidationWorkflow", db: "aofValidationWorkflow", fields: [{ name: "workflowKey", type: "string" }, { name: "workflowName", type: "string" }, { name: "workflowStatus", type: "select", options: "WORKFLOW_STATUS_OPTIONS" }], display: { title: "workflowName", sub: "workflowStatus" } },
    { tab: "outcomeEvaluation", plural: "outcomeEvaluation", singular: "OutcomeEvaluation", pascal: "OutcomeEvaluation", db: "aofOutcomeEvaluation", fields: [{ name: "evaluationKey", type: "string" }, { name: "evaluationTitle", type: "string" }, { name: "evaluationScore", type: "number" }], display: { title: "evaluationTitle", sub: "evaluationScore" } },
    { tab: "knowledgeRepository", plural: "knowledgeRepository", singular: "KnowledgeRepository", pascal: "KnowledgeRepository", db: "aofKnowledgeRepository", fields: [{ name: "repositoryKey", type: "string" }, { name: "repositoryName", type: "string" }, { name: "repositoryStatus", type: "select", options: "REPOSITORY_STATUS_OPTIONS" }], display: { title: "repositoryName", sub: "repositoryStatus" } },
    { tab: "aiTaskRouters", plural: "aiTaskRouters", singular: "AiTaskRouter", pascal: "AiTaskRouter", db: "aofAiTaskRouters", fields: [{ name: "routerKey", type: "string" }, { name: "routerName", type: "string" }, { name: "routerStatus", type: "select", options: "ROUTER_STATUS_OPTIONS" }], display: { title: "routerName", sub: "routerStatus" } },
    { tab: "humanApprovalEngine", plural: "humanApprovalEngine", singular: "HumanApprovalEngine", pascal: "HumanApprovalEngine", db: "aofHumanApprovalEngine", fields: [{ name: "approvalKey", type: "string" }, { name: "approvalName", type: "string" }, { name: "approvalStatus", type: "select", options: "APPROVAL_STATUS_OPTIONS" }], display: { title: "approvalName", sub: "approvalStatus" } },
    { tab: "policyEngine", plural: "policyEngine", singular: "PolicyEngine", pascal: "PolicyEngine", db: "aofPolicyEngine", fields: [{ name: "policyKey", type: "string" }, { name: "policyName", type: "string" }, { name: "policyStatus", type: "select", options: "POLICY_STATUS_OPTIONS" }], display: { title: "policyName", sub: "policyStatus" } },
    { tab: "executionHistory", plural: "executionHistory", singular: "ExecutionHistory", pascal: "ExecutionHistory", db: "aofExecutionHistory", fields: [{ name: "historyKey", type: "string" }, { name: "historyTitle", type: "string" }, { name: "executionStatus", type: "string" }], display: { title: "historyTitle", sub: "executionStatus" } },
    { tab: "aiGovernanceRules", plural: "aiGovernanceRules", singular: "AiGovernanceRule", pascal: "AiGovernanceRule", db: "aofAiGovernanceRules", fields: [{ name: "ruleKey", type: "string" }, { name: "ruleName", type: "string" }, { name: "ruleStatus", type: "select", options: "GOVERNANCE_STATUS_OPTIONS" }], display: { title: "ruleName", sub: "ruleStatus" } },
    { tab: "organizationMetrics", plural: "organizationMetrics", singular: "OrganizationMetric", pascal: "OrganizationMetric", db: "aofOrganizationMetrics", hubField: false, orgOnly: true, fields: [{ name: "metricsKey", type: "string" }, { name: "growthScore", type: "number" }, { name: "overallOrganizationScore", type: "number" }], display: { title: "metricsKey", sub: "overallOrganizationScore" } },
    { tab: "organizationHealth", plural: "organizationHealth", singular: "OrganizationHealth", pascal: "OrganizationHealth", db: "aofOrganizationHealth", hubField: false, orgOnly: true, fields: [{ name: "healthKey", type: "string" }, { name: "overallScore", type: "number" }, { name: "disasterRecoveryMode", type: "boolean" }], display: { title: "healthKey", sub: "overallScore" } },
    { tab: "innovationDashboards", plural: "innovationDashboards", singular: "InnovationDashboard", pascal: "InnovationDashboard", db: "aofInnovationDashboards", fields: [{ name: "dashboardKey", type: "string" }, { name: "dashboardName", type: "string" }, { name: "dashboardStatus", type: "select", options: "DASHBOARD_STATUS_OPTIONS" }], display: { title: "dashboardName", sub: "dashboardStatus" } },
    { tab: "missionProgress", plural: "missionProgress", singular: "MissionProgress", pascal: "MissionProgress", db: "aofMissionProgress", fields: [{ name: "progressKey", type: "string" }, { name: "progressName", type: "string" }, { name: "progressPercent", type: "number" }], display: { title: "progressName", sub: "progressPercent" } },
    { tab: "organizationFailures", plural: "organizationFailures", singular: "OrganizationFailure", pascal: "OrganizationFailure", db: "aofOrganizationFailures", fields: [{ name: "failureKey", type: "string" }, { name: "failureType", type: "string" }], display: { title: "failureKey", sub: "failureType" } },
];

const tabs = ["overview", ...entities.map((e) => e.tab), "auditLogs", "api"];
mkdirSync(join(mod, "constants"), { recursive: true });
mkdirSync(join(mod, "schemas"), { recursive: true });
mkdirSync(join(mod, "services"), { recursive: true });
mkdirSync(join(mod, "hooks"), { recursive: true });
mkdirSync(join(mod, "components"), { recursive: true });
mkdirSync(join(mod, "sdk"), { recursive: true });

// --- constants ---
writeFileSync(join(mod, "constants/index.ts"), `export const AOF_TABS = {
${tabs.map((t) => `    ${t}: "${t}",`).join("\n")}
} as const;

export const ORCHESTRATOR_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "paused", label: "Paused" },
    { value: "deprecated", label: "Deprecated" },
] as const;

export const CAMPAIGN_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
] as const;

export const DASHBOARD_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "paused", label: "Paused" },
    { value: "archived", label: "Archived" },
] as const;

export const APPROVAL_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
] as const;

export const AOF_PERMISSIONS = ["aof.view", "aof.manage", "aof.approve", "aof.admin"] as const;

export const AOF_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "healthy", label: "Healthy" },
    { value: "degraded", label: "Degraded" },
    { value: "failed", label: "Failed" },
    { value: "open", label: "Open" },
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
] as const;


export const AOF_THEME = {
    primary: "orange-600",
    primaryHover: "orange-500",
    ring: "orange-500/20",
    text: "text-orange-600",
    textDark: "dark:text-orange-400",
    bg: "bg-orange-600",
    bgHover: "hover:bg-orange-500",
} as const;
`);

// --- schemas ---
const schemaLines = entities.map((e) => {
    const hubId = e.hubField === false ? "" : `\n    organizationHubId: z.string().min(1),`;
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
    "buildOrganizationHubLookupMaps", "buildAofAuditPayload", "buildAofDashboardStats", "buildAofPipelineInfo", "mapAuditEntry",
    ...entities.flatMap((e) => [`build${e.pascal}Payload`, `map${e.pascal}Summary`]),
    "mapGrowthOrchestratorForStats", "mapDeliveryOrchestratorForStats", "mapOrganizationMetricForStats", "mapIdeaRegistryForStats", "mapAiTaskRouterForStats", "mapDeliveryOrchestratorForStats", "mapOrganizationHealthForStats", "mapOrganizationFailureForStats",
].join(",\n    ");

const typeImports = entities.flatMap((e) => [`${e.pascal}Summary`, `Create${e.pascal}Input`]).concat(["AuditEntry", "AofDashboardStats", "AofPipelineInfo", "AofSdkTrackCustomerHealthInput", "AofSdkTrackCustomerHealthResult", "AofSdkOpenSupportTicketInput", "AofSdkOpenSupportTicketResult", "AofSdkRunDeliveryWorkflowInput", "AofSdkRunDeliveryWorkflowResult"]).join(",\n    ");

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
        await databaseService.aofAuditLogs.create(buildAofAuditPayload(context.organizationId, "${e.tab.replace(/([A-Z])/g, "_$1").toLowerCase().replace(/^_/, "")}", "create", \`${e.pascal} created\`, created.id));${createMaps}
        ${createReturn}
    }`;
}).join("\n");

writeFileSync(join(mod, "services/ai-organization-foundation.service.ts"), `import {
    ${mapperImports},
} from "@/src/modules/database/lib/ai-organization-foundation-mappers";
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
import { createCustomerSuccessDeliveryClient } from "@/src/modules/customer-success-delivery/sdk";
import { createEnterpriseIntelligencePlatformClient } from "@/src/modules/customer-operated-platform/sdk";
import { crmService } from "@/src/modules/crm/services/crm.service";
import type {
    ${typeImports},
} from "@/src/modules/ai-organization-foundation/types";

export class AiOrganizationFoundationService {
    private async getContext(authUserId: string, email: string, fullName?: string | null) {
        return resolveOrganizationContext(authUserId, email, fullName);
    }

    private async getMaps(organizationId: string) {
        const organizationHubs = await databaseService.aofOrganizationHubs.listByOrganization(organizationId);
        return buildOrganizationHubLookupMaps(organizationHubs);
    }

    async getDashboardStats(authUserId: string, email: string, fullName?: string | null): Promise<AofDashboardStats> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return buildAofDashboardStats({ organizationHubs: [], growthOrchestrators: [], deliveryOrchestrators: [], ideaRegistry: [], aiTaskRouters: [], organizationMetrics: [], organizationHealth: [], organizationFailures: [], auditLogs: [] });
        const [organizationHubs, growthOrchestratorsRaw, deliveryOrchestratorsRaw, ideaRegistryRaw, aiTaskRoutersRaw, organizationMetricsRaw, organizationHealthRaw, organizationFailures, auditLogs] = await Promise.all([
            this.getOrganizationHubs(authUserId, email, fullName),
            databaseService.aofKpiRegistry.listByOrganization(context.organizationId),
            databaseService.aofExecutiveDashboards.listByOrganization(context.organizationId),
            databaseService.aofRevenueForecasts.listByOrganization(context.organizationId),
            databaseService.aofCrossModuleInsights.listByOrganization(context.organizationId),
            databaseService.aofOrganizationMetrics.listByOrganization(context.organizationId),
            databaseService.aofOrganizationHealth.listByOrganization(context.organizationId),
            this.getOrganizationFailures(authUserId, email, fullName),
            this.getAuditLogs(authUserId, email, fullName),
        ]);
        return buildAofDashboardStats({
            organizationHubs,
            growthOrchestrators: growthOrchestratorsRaw.map(mapGrowthOrchestratorForStats),
            deliveryOrchestrators: deliveryOrchestratorsRaw.map(mapDeliveryOrchestratorForStats),
            ideaRegistry: ideaRegistryRaw.map(mapIdeaRegistryForStats),
            aiTaskRouters: aiTaskRoutersRaw.map(mapAiTaskRouterForStats),
            organizationMetrics: organizationMetricsRaw.map(mapOrganizationMetricForStats),
            organizationHealth: organizationHealthRaw.map(mapOrganizationHealthForStats),
            organizationFailures,
            auditLogs,
        });
    }

    getPipelineInfo(): AofPipelineInfo {
        return buildAofPipelineInfo();
    }
${serviceMethods}

    async getAuditLogs(authUserId: string, email: string, fullName?: string | null): Promise<AuditEntry[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.aofAuditLogs.listByOrganization(context.organizationId)).map(mapAuditEntry);
    }

    async getOrganizationHubOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.aofOrganizationHubs.listByOrganization(context.organizationId)).map((r) => ({ id: r.id, name: r.hub_name }));
    }

    async sdkRunAgoService(authUserId: string, email: string, input: AofSdkRunAgoServiceInput, fullName?: string | null): Promise<AofSdkRunAgoServiceResult> {
        const ifr = createIndustryFrameworkClient(authUserId, email, fullName);
        await ifr.getIndustryFrameworkHubs();
        const dfe = createFormEngineClient(authUserId, email, fullName);
        await dfe.getFormEngineHubs();
        await crmService.getClients(authUserId, email, fullName);
        const created = await this.createGrowthOrchestrator(authUserId, email, { organizationHubId: input.organizationHubId, kpiKey: input.kpiKey, kpiName: input.kpiName }, fullName);
        return { kpiId: created.id, kpiKey: created.kpiKey, status: created.status };
    }

    async sdkRunAdoService(authUserId: string, email: string, input: AofSdkRunAdoServiceInput, fullName?: string | null): Promise<AofSdkRunAdoServiceResult> {
        const dwe = createWorkflowEngineClient(authUserId, email, fullName);
        await dwe.getWorkflowEngineHubs();
        const dde = createDocumentEngineClient(authUserId, email, fullName);
        await dde.getDocumentHubs();
        const comm = createCommunicationHubClient(authUserId, email, fullName);
        await comm.getCommunicationHubs();
        const created = await this.createDeliveryOrchestrator(authUserId, email, { organizationHubId: input.organizationHubId, dashboardKey: input.dashboardKey, dashboardName: input.dashboardName }, fullName);
        return { dashboardId: created.id, dashboardKey: created.dashboardKey, status: created.status };
    }

    async sdkRunAioService(authUserId: string, email: string, input: AofSdkRunAioServiceInput, fullName?: string | null): Promise<AofSdkRunAioServiceResult> {
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
        const csd = createCustomerSuccessDeliveryClient(authUserId, email, fullName);
        await csd.getDeliveryHubs();
        const cop = createEnterpriseIntelligencePlatformClient(authUserId, email, fullName);
        await cop.getIntelligenceHubs();
        await crmService.getDeals(authUserId, email, fullName);
        const created = await this.createIdeaRegistry(authUserId, email, { organizationHubId: input.organizationHubId, insightKey: input.insightKey, insightTitle: input.insightTitle }, fullName);
        return { insightId: created.id, insightKey: created.insightKey, status: created.status };
    }
}

export const aiOrganizationFoundationService = new AiOrganizationFoundationService();
`);

// --- hook ---
const hookTypeImports = entities.flatMap((e) => [`${e.pascal}Summary`, `Create${e.pascal}Input`]).concat(["AuditEntry", "AofDashboardStats", "AofPipelineInfo"]).join(",\n    ");
const hookStates = entities.map((e) => `    const [${e.plural}, set${e.pascal}s] = useState<${e.pascal}Summary[]>([]);`).join("\n");
const hookFetchVars = entities.map((e) => `${e.plural}List`).join(",\n            ");
const hookFetchCalls = entities.map((e) => `            aiOrganizationFoundationService.get${e.pascal}s(authUserId, email, fullName),`).join("\n");
const hookReturnProps = entities.map((e) => `${e.plural}List`).join(",\n            ");
const hookApplySets = entities.map((e) => `        set${e.pascal}s(result.${e.plural}List);`).join("\n");
const hookCreates = entities.map((e) => `    const create${e.pascal} = useCallback(async (input: Create${e.pascal}Input) => { if (!user) throw new Error("Authentication required"); await aiOrganizationFoundationService.create${e.pascal}(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);`).join("\n");
const hookReturnFields = entities.map((e) => `        ${e.plural},\n        create${e.pascal},`).join("\n");

writeFileSync(join(mod, "hooks/useAiOrganizationFoundation.ts"), `"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { aiOrganizationFoundationService } from "@/src/modules/ai-organization-foundation/services/ai-organization-foundation.service";
import type {
    ${hookTypeImports},
} from "@/src/modules/ai-organization-foundation/types";

export function useAiOrganizationFoundation() {
    const user = useAuthStore((state) => state.user);
    const authUserId = user?.id;
    const email = user?.email ?? "";
    const fullName = user?.fullName;
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<AofDashboardStats | null>(null);
    const [pipeline, setPipeline] = useState<AofPipelineInfo | null>(null);
${hookStates}
    const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
    const [organizationHubOptions, setIntegrationHubOptions] = useState<Array<{ id: string; name: string }>>([]);

    const fetchData = useCallback(async () => {
        if (!authUserId || !email) return { empty: true as const };
        const [
            statsData,
            pipelineInfo,
${hookFetchVars},
            auditLogsList,
            hubOpts,
        ] = await Promise.all([
            aiOrganizationFoundationService.getDashboardStats(authUserId, email, fullName),
            Promise.resolve(aiOrganizationFoundationService.getPipelineInfo()),
${hookFetchCalls}
            aiOrganizationFoundationService.getAuditLogs(authUserId, email, fullName),
            aiOrganizationFoundationService.getOrganizationHubOptions(authUserId, email, fullName),
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
        organizationHubOptions,
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
    }, e.hubField === false ? {} : { organizationHubId: "" });
    const defaultStr = JSON.stringify(defaults);
    const formFields = e.fields.map((f) => {
        if (f.type === "select") return `                <select {...form.register("${f.name}")} className={inputClass}>{${f.options}.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>`;
        if (f.type === "number") return `                <input type="number" step="any" {...form.register("${f.name}", { valueAsNumber: true })} placeholder="${f.name}" className={inputClass} />`;
        if (f.type === "boolean") return `                <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...form.register("${f.name}")} /> ${f.name}</label>`;
        return `                <input {...form.register("${f.name}")} placeholder="${f.name}" className={inputClass} />`;
    }).join("\n");
    const hubSelect = e.hubField === false ? "" : `                <OrganizationHubSelect data={data} {...form.register("organizationHubId")} />\n`;
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

writeFileSync(join(mod, "components/AiOrganizationFoundationPanels.tsx"), `"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/src/components/ui/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { AOF_THEME, CAMPAIGN_STATUS_OPTIONS, ALERT_SEVERITY_OPTIONS } from "@/src/modules/ai-organization-foundation/constants";
import type { useAiOrganizationFoundation } from "@/src/modules/ai-organization-foundation/hooks/useAiOrganizationFoundation";
import {
${schemaImports}
} from "@/src/modules/ai-organization-foundation/schemas";

type RetailData = ReturnType<typeof useAiOrganizationFoundation>;
const inputClass = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-orange-500/20 focus:ring-4 dark:border-slate-800 dark:bg-orange-950";
function SaveButton({ loading, label = "Save changes" }: { loading?: boolean; label?: string }) {
    return <button type="submit" disabled={loading} className="rounded-full bg-orange-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-500 disabled:opacity-60">{loading ? "Saving..." : label}</button>;
}
function ListCard({ title, subtitle, meta }: { title: string; subtitle: string; meta?: string }) {
    return <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800"><p className="font-medium">{title}</p><p className="text-sm text-orange-500">{subtitle}</p>{meta ? <p className="mt-1 text-xs text-orange-600">{meta}</p> : null}</div>;
}
function OrganizationHubSelect({ data, ...props }: { data: RetailData } & React.SelectHTMLAttributes<HTMLSelectElement>) {
    return <select {...props} className={inputClass}><option value="">Select retail operating system</option>{data.organizationHubOptions.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>;
}

export function RetailOverviewPanel({ data }: { data: RetailData }) {
    const pipeline = data.pipeline;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="AI Organization Foundation summary" description="System health, background jobs, event bus, aiTaskRouters, feature flags, configuration, diagnostics, and operations dashboard" /><div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ListCard title="Organization Hubs" subtitle={\`\${data.stats?.totalOrganizationHubs ?? 0} total\`} meta={\`\${data.stats?.activeOrganizationHubs ?? 0} active • \${data.stats?.growthOrchestratorCount ?? 0} dining areas\`} />
                <ListCard title="Connectors" subtitle={\`\${data.stats?.deliveryOrchestratorsCount ?? 0} menu categories\`} meta={\`\${data.stats?.ideaRegistryCount ?? 0} ideaRegistry • \${data.stats?.aiTaskRouterCount ?? 0} open aiTaskRouters\`} />
                <ListCard title="Health" subtitle={\`\${(data.stats?.overallOrganizationScore ?? 0).toFixed(1)} overall retail score\`} meta={\`\${data.stats?.openFailureCount ?? 0} open failures\`} />
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
        <Card hover><SectionHeader title="AI Organization Foundation audit history" description="Security-first audit trail for jobs, events, aiTaskRouters, and marketplace operations" /><div className="mt-6 space-y-3">
            {data.auditLogs.length === 0 ? <EmptyState title="No audit entries" description="Audit logs are created automatically for retail operating system." /> : data.auditLogs.map((entry) => (
                <ListCard key={entry.id} title={entry.summary} subtitle={\`\${entry.entityType} • \${entry.action}\`} meta={\`\${entry.securityLevel} • \${new Date(entry.createdAt).toLocaleString()}\`} />
            ))}
        </div></Card>
    );
}

export function RetailSdkPanel({ data }: { data: RetailData }) {
    return (
        <Card hover><SectionHeader title="Shared AI Organization Foundation SDK" description="Import from @/src/modules/ai-organization-foundation/sdk for brand registration, menu configuration, and order workflow execution" /><div className="mt-6 space-y-4 text-sm text-orange-600 dark:text-orange-300">
            <ListCard title="createAiOrganizationFoundationClient()" subtitle="Factory for module-scoped AI Organization Foundation client with auth context" meta="Primary SDK for enterprise retail operating system" />
            <ListCard title="sdkRunAgoService()" subtitle="Register retail operating system with AI orchestration" meta="moduleSource: ai_organization_foundation" />
            <ListCard title="sdkRunAdoService()" subtitle="Run intelligence service with knowledge context" meta="v1/v2/v3 API versions" />
            <ListCard title="sdkRunAioService()" subtitle="Run forecast service with audit trail" meta="Event-driven integration delivery" />
            <p className="text-xs text-orange-500">Theme: {AOF_THEME.primary} • Integration hubs loaded: {data.organizationHubs.length}</p>
            <pre className="overflow-x-auto rounded-2xl bg-orange-950 p-4 text-xs text-orange-100">{\`import { createAiOrganizationFoundationClient } from "@/src/modules/ai-organization-foundation/sdk";

const intg = createAiOrganizationFoundationClient(userId, email, fullName);
await intg.registerCampus({ organizationHubId, serviceKey: "svc-001", serviceName: "Stripe" });
await intg.runAdoService({ organizationHubId, keyName: "prod-key", apiVersion: "v1" });
await intg.runAioService({ organizationHubId, webhookKey: "wh-001", webhookName: "Events" });\`}</pre>
        </div></Card>
    );
}
`);

// --- stats ---
writeFileSync(join(mod, "components/AiOrganizationFoundationStats.tsx"), `import { StatCard } from "@/src/components/ui/StatCard";
import type { AofDashboardStats } from "@/src/modules/ai-organization-foundation/types";

interface AiOrganizationFoundationStatsProps { stats: AofDashboardStats | null; }

export function AiOrganizationFoundationStats({ stats }: AiOrganizationFoundationStatsProps) {
    const cards = [
        { title: "Organization Hubs", value: String(stats?.totalOrganizationHubs ?? 0), detail: \`\${stats?.activeOrganizationHubs ?? 0} active • \${stats?.growthOrchestratorCount ?? 0} dining areas\`, trend: "up" as const },
        { title: "Connectors", value: String(stats?.deliveryOrchestratorsCount ?? 0), detail: \`\${stats?.ideaRegistryCount ?? 0} ideaRegistry • \${stats?.aiTaskRouterCount ?? 0} open aiTaskRouters\`, trend: "up" as const, tone: "accent" as const },
        { title: "Health Score", value: \`\${(stats?.overallOrganizationScore ?? 0).toFixed(1)}\`, detail: \`\${stats?.openFailureCount ?? 0} open failures\`, trend: "up" as const },
        { title: "Audit Trail", value: String(stats?.auditCount ?? 0), detail: "Jobs, events, aiTaskRouters, and configuration audit entries", trend: "up" as const },
    ];
    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 [&_p:last-child]:text-orange-600 dark:[&_p:last-child]:text-orange-400">
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

writeFileSync(join(mod, "components/AiOrganizationFoundationPage.tsx"), `"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { LoadingState } from "@/src/components/ui/LoadingState";
import {
    RetailOverviewPanel,
    ${panelImports},
    RetailAuditLogsPanel,
    RetailSdkPanel,
} from "@/src/modules/ai-organization-foundation/components/AiOrganizationFoundationPanels";
import { AiOrganizationFoundationStats } from "@/src/modules/ai-organization-foundation/components/AiOrganizationFoundationStats";
import { AOF_TABS } from "@/src/modules/ai-organization-foundation/constants";
import { useAiOrganizationFoundation } from "@/src/modules/ai-organization-foundation/hooks/useAiOrganizationFoundation";

const tabs = [
${tabDefs.map((t) => `    { id: AOF_TABS.${t.id}, label: "${t.label}" },`).join("\n")}
] as const;

export function AiOrganizationFoundationPage() {
    const retail = useAiOrganizationFoundation();
    const [activeTab, setActiveTab] = useState<(typeof AOF_TABS)[keyof typeof AOF_TABS]>(AOF_TABS.overview);

    if (retail.loading) {
        return <div className="mx-auto max-w-7xl"><LoadingState label="Loading AI Organization Foundation" /></div>;
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-orange-900 dark:text-orange-100">
            <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-orange-900/80">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-orange-600">V2 Program A AI Organization Foundation</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Enterprise AI Organization Foundation</h1>
                <p className="mt-3 max-w-2xl text-sm text-orange-500 dark:text-orange-400">
                    Integration layer for the entire SaaS platform: dining areas, payment & accounting connectors, public API platform, webhook delivery, integration marketplace, API analytics, and retail operating system dashboard with security-first audit and the shared AI Organization Foundation SDK.
                </p>
            </motion.header>
            <AiOrganizationFoundationStats stats={retail.stats} />
            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={\`rounded-full px-4 py-2 text-sm font-medium transition \${activeTab === tab.id ? "bg-orange-600 text-white" : "border border-slate-200 text-orange-600 hover:border-orange-300 dark:border-slate-800 dark:text-orange-300"}\`}>{tab.label}</button>
                ))}
            </div>
${tabDefs.map((t) => `            {activeTab === AOF_TABS.${t.id} ? <${t.panel} data={retail} /> : null}`).join("\n")}
        </div>
    );
}
`);

// --- sdk ---
writeFileSync(join(mod, "sdk/index.ts"), `import { aiOrganizationFoundationService } from "@/src/modules/ai-organization-foundation/services/ai-organization-foundation.service";
import type { AofSdkRunAgoServiceInput, AofSdkRunAdoServiceInput, AofSdkRunAioServiceInput, AofSdkRunOrchestrationServiceInput, AofSdkRunOrchestrationServiceInput } from "@/src/modules/ai-organization-foundation/types";

export class AgoService {
    constructor(private readonly client: AiOrganizationFoundationClient) {}
    async run(input: AofSdkRunAgoServiceInput) { return this.client.runAgoService(input); }
}

export class AdoService {
    constructor(private readonly client: AiOrganizationFoundationClient) {}
    async run(input: AofSdkRunAdoServiceInput) { return this.client.runAdoService(input); }
}

export class AioService {
    constructor(private readonly client: AiOrganizationFoundationClient) {}
    async run(input: AofSdkRunAioServiceInput) { return this.client.runAioService(input); }
}

export class OrchestrationService {
    constructor(private readonly client: AiOrganizationFoundationClient) {}
    async run(input: AofSdkRunOrchestrationServiceInput) { return this.client.runOrchestrationService(input); }
}

export class OrchestrationService {
    constructor(private readonly client: AiOrganizationFoundationClient) {}
    async run(input: AofSdkRunOrchestrationServiceInput) { return this.client.runOrchestrationService(input); }
}

export class AiOrganizationFoundationClient {
    constructor(
        private readonly authUserId: string,
        private readonly email: string,
        private readonly fullName?: string | null,
    ) {}

    readonly kpiService = new AgoService(this);
    readonly intelligenceService = new AdoService(this);
    readonly forecastService = new AioService(this);
    readonly reportingService = new OrchestrationService(this);
    readonly executiveInsightService = new OrchestrationService(this);

    async runAgoService(input: AofSdkRunAgoServiceInput) {
        return aiOrganizationFoundationService.sdkRunAgoService(this.authUserId, this.email, input, this.fullName);
    }

    async runAdoService(input: AofSdkRunAdoServiceInput) {
        return aiOrganizationFoundationService.sdkRunAdoService(this.authUserId, this.email, input, this.fullName);
    }

    async runAioService(input: AofSdkRunAioServiceInput) {
        return aiOrganizationFoundationService.sdkRunAioService(this.authUserId, this.email, input, this.fullName);
    }

    async runOrchestrationService(input: AofSdkRunOrchestrationServiceInput) {
        return aiOrganizationFoundationService.sdkRunOrchestrationService(this.authUserId, this.email, input, this.fullName);
    }

    async runOrchestrationService(input: AofSdkRunOrchestrationServiceInput) {
        return aiOrganizationFoundationService.sdkRunOrchestrationService(this.authUserId, this.email, input, this.fullName);
    }

    async getOrganizationHubs() {
        return aiOrganizationFoundationService.getOrganizationHubs(this.authUserId, this.email, this.fullName);
    }

    async getDashboardStats() {
        return aiOrganizationFoundationService.getDashboardStats(this.authUserId, this.email, this.fullName);
    }

    async getPipelineInfo() {
        return aiOrganizationFoundationService.getPipelineInfo();
    }
}

export function createAiOrganizationFoundationClient(authUserId: string, email: string, fullName?: string | null): AiOrganizationFoundationClient {
    return new AiOrganizationFoundationClient(authUserId, email, fullName);
}

export { aiOrganizationFoundationService };
`);

// --- index ---
writeFileSync(join(mod, "index.ts"), `export { AiOrganizationFoundationPage } from "@/src/modules/ai-organization-foundation/components/AiOrganizationFoundationPage";
export { AiOrganizationFoundationStats } from "@/src/modules/ai-organization-foundation/components/AiOrganizationFoundationStats";
export { aiOrganizationFoundationService } from "@/src/modules/ai-organization-foundation/services/ai-organization-foundation.service";
export { useAiOrganizationFoundation } from "@/src/modules/ai-organization-foundation/hooks/useAiOrganizationFoundation";
export { createAiOrganizationFoundationClient, AiOrganizationFoundationClient } from "@/src/modules/ai-organization-foundation/sdk";
export * from "@/src/modules/ai-organization-foundation/types";
export * from "@/src/modules/ai-organization-foundation/constants";
`);

console.log(`Generated retail operating system module files. AOF_TABS count: ${tabs.length}`);
