#!/usr/bin/env node
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const mod = join(root, "src/modules/enterprise-governance-platform");

const entities = [
    { tab: "governanceHubs", plural: "governanceHubs", singular: "GovernanceHub", pascal: "GovernanceHub", db: "egpGovernanceHubs", hubField: false, fields: [{ name: "hubKey", type: "string" }, { name: "hubName", type: "string" }, { name: "environment", type: "string" }], display: { title: "hubName", sub: "hubKey" } },
    { tab: "organizationGovernance", plural: "organizationGovernance", singular: "OrganizationGovernance", pascal: "OrganizationGovernance", db: "egpOrganizationGovernance", fields: [{ name: "governanceKey", type: "string" }, { name: "governanceName", type: "string" }, { name: "governanceStatus", type: "select", options: "GOVERNANCE_STATUS_OPTIONS" }], display: { title: "governanceName", sub: "governanceStatus" } },
    { tab: "governancePolicies", plural: "governancePolicies", singular: "GovernancePolicy", pascal: "GovernancePolicy", db: "egpGovernancePolicies", fields: [{ name: "policyKey", type: "string" }, { name: "policyName", type: "string" }, { name: "policyStatus", type: "select", options: "POLICY_STATUS_OPTIONS" }], display: { title: "policyName", sub: "policyStatus" } },
    { tab: "governanceFramework", plural: "governanceFramework", singular: "GovernanceFramework", pascal: "GovernanceFramework", db: "egpGovernanceFramework", fields: [{ name: "frameworkKey", type: "string" }, { name: "frameworkName", type: "string" }, { name: "frameworkStatus", type: "select", options: "FRAMEWORK_STATUS_OPTIONS" }], display: { title: "frameworkName", sub: "frameworkStatus" } },
    { tab: "governanceReviews", plural: "governanceReviews", singular: "GovernanceReview", pascal: "GovernanceReview", db: "egpGovernanceReviews", fields: [{ name: "reviewKey", type: "string" }, { name: "reviewTitle", type: "string" }, { name: "reviewStatus", type: "select", options: "REVIEW_STATUS_OPTIONS" }], display: { title: "reviewTitle", sub: "reviewStatus" } },
    { tab: "governanceDashboards", plural: "governanceDashboards", singular: "GovernanceDashboard", pascal: "GovernanceDashboard", db: "egpGovernanceDashboards", fields: [{ name: "dashboardKey", type: "string" }, { name: "dashboardName", type: "string" }, { name: "dashboardStatus", type: "select", options: "DASHBOARD_STATUS_OPTIONS" }], display: { title: "dashboardName", sub: "dashboardStatus" } },
    { tab: "complianceFramework", plural: "complianceFramework", singular: "ComplianceFramework", pascal: "ComplianceFramework", db: "egpComplianceFramework", fields: [{ name: "frameworkKey", type: "string" }, { name: "frameworkName", type: "string" }, { name: "frameworkStatus", type: "select", options: "FRAMEWORK_STATUS_OPTIONS" }], display: { title: "frameworkName", sub: "frameworkStatus" } },
    { tab: "complianceControls", plural: "complianceControls", singular: "ComplianceControl", pascal: "ComplianceControl", db: "egpComplianceControls", fields: [{ name: "controlKey", type: "string" }, { name: "controlName", type: "string" }, { name: "controlStatus", type: "select", options: "CONTROL_STATUS_OPTIONS" }], display: { title: "controlName", sub: "controlStatus" } },
    { tab: "complianceEvidence", plural: "complianceEvidence", singular: "ComplianceEvidence", pascal: "ComplianceEvidence", db: "egpComplianceEvidence", fields: [{ name: "evidenceKey", type: "string" }, { name: "evidenceTitle", type: "string" }, { name: "evidenceStatus", type: "select", options: "EVIDENCE_STATUS_OPTIONS" }], display: { title: "evidenceTitle", sub: "evidenceStatus" } },
    { tab: "complianceReports", plural: "complianceReports", singular: "ComplianceReport", pascal: "ComplianceReport", db: "egpComplianceReports", fields: [{ name: "reportKey", type: "string" }, { name: "reportTitle", type: "string" }, { name: "reportStatus", type: "select", options: "REPORT_STATUS_OPTIONS" }], display: { title: "reportTitle", sub: "reportStatus" } },
    { tab: "complianceCalendar", plural: "complianceCalendar", singular: "ComplianceCalendar", pascal: "ComplianceCalendar", db: "egpComplianceCalendar", fields: [{ name: "calendarKey", type: "string" }, { name: "calendarName", type: "string" }, { name: "calendarStatus", type: "select", options: "CALENDAR_STATUS_OPTIONS" }], display: { title: "calendarName", sub: "calendarStatus" } },
    { tab: "auditCenter", plural: "auditCenter", singular: "AuditCenter", pascal: "AuditCenter", db: "egpAuditCenter", fields: [{ name: "auditKey", type: "string" }, { name: "auditName", type: "string" }, { name: "auditStatus", type: "select", options: "AUDIT_STATUS_OPTIONS" }], display: { title: "auditName", sub: "auditStatus" } },
    { tab: "auditFindings", plural: "auditFindings", singular: "AuditFinding", pascal: "AuditFinding", db: "egpAuditFindings", fields: [{ name: "findingKey", type: "string" }, { name: "findingTitle", type: "string" }, { name: "findingSeverity", type: "string" }], display: { title: "findingTitle", sub: "findingSeverity" } },
    { tab: "correctiveActions", plural: "correctiveActions", singular: "CorrectiveAction", pascal: "CorrectiveAction", db: "egpCorrectiveActions", fields: [{ name: "actionKey", type: "string" }, { name: "actionTitle", type: "string" }, { name: "actionStatus", type: "select", options: "ACTION_STATUS_OPTIONS" }], display: { title: "actionTitle", sub: "actionStatus" } },
    { tab: "auditEvidence", plural: "auditEvidence", singular: "AuditEvidence", pascal: "AuditEvidence", db: "egpAuditEvidence", fields: [{ name: "evidenceKey", type: "string" }, { name: "evidenceTitle", type: "string" }, { name: "evidenceStatus", type: "select", options: "EVIDENCE_STATUS_OPTIONS" }], display: { title: "evidenceTitle", sub: "evidenceStatus" } },
    { tab: "auditAnalytics", plural: "auditAnalytics", singular: "AuditAnalytics", pascal: "AuditAnalytics", db: "egpAuditAnalytics", fields: [{ name: "analyticsKey", type: "string" }, { name: "analyticsName", type: "string" }, { name: "analyticsScore", type: "number" }], display: { title: "analyticsName", sub: "analyticsScore" } },
    { tab: "dataClassification", plural: "dataClassification", singular: "DataClassification", pascal: "DataClassification", db: "egpDataClassification", fields: [{ name: "classificationKey", type: "string" }, { name: "classificationName", type: "string" }, { name: "classificationLevel", type: "string" }], display: { title: "classificationName", sub: "classificationLevel" } },
    { tab: "retentionPolicies", plural: "retentionPolicies", singular: "RetentionPolicy", pascal: "RetentionPolicy", db: "egpRetentionPolicies", fields: [{ name: "policyKey", type: "string" }, { name: "policyName", type: "string" }, { name: "policyStatus", type: "select", options: "POLICY_STATUS_OPTIONS" }], display: { title: "policyName", sub: "policyStatus" } },
    { tab: "dataLifecycle", plural: "dataLifecycle", singular: "DataLifecycle", pascal: "DataLifecycle", db: "egpDataLifecycle", fields: [{ name: "lifecycleKey", type: "string" }, { name: "lifecycleName", type: "string" }, { name: "lifecycleStage", type: "string" }], display: { title: "lifecycleName", sub: "lifecycleStage" } },
    { tab: "dataOwnership", plural: "dataOwnership", singular: "DataOwnership", pascal: "DataOwnership", db: "egpDataOwnership", fields: [{ name: "ownershipKey", type: "string" }, { name: "ownershipName", type: "string" }, { name: "ownershipStatus", type: "select", options: "OWNERSHIP_STATUS_OPTIONS" }], display: { title: "ownershipName", sub: "ownershipStatus" } },
    { tab: "dataQuality", plural: "dataQuality", singular: "DataQuality", pascal: "DataQuality", db: "egpDataQuality", fields: [{ name: "qualityKey", type: "string" }, { name: "qualityName", type: "string" }, { name: "qualityScore", type: "number" }], display: { title: "qualityName", sub: "qualityScore" } },
    { tab: "riskRegister", plural: "riskRegister", singular: "RiskRegister", pascal: "RiskRegister", db: "egpRiskRegister", fields: [{ name: "riskKey", type: "string" }, { name: "riskTitle", type: "string" }, { name: "riskSeverity", type: "string" }], display: { title: "riskTitle", sub: "riskSeverity" } },
    { tab: "riskAssessment", plural: "riskAssessment", singular: "RiskAssessment", pascal: "RiskAssessment", db: "egpRiskAssessment", fields: [{ name: "assessmentKey", type: "string" }, { name: "assessmentTitle", type: "string" }, { name: "assessmentScore", type: "number" }], display: { title: "assessmentTitle", sub: "assessmentScore" } },
    { tab: "riskMitigation", plural: "riskMitigation", singular: "RiskMitigation", pascal: "RiskMitigation", db: "egpRiskMitigation", fields: [{ name: "mitigationKey", type: "string" }, { name: "mitigationTitle", type: "string" }, { name: "mitigationStatus", type: "select", options: "MITIGATION_STATUS_OPTIONS" }], display: { title: "mitigationTitle", sub: "mitigationStatus" } },
    { tab: "riskMonitoring", plural: "riskMonitoring", singular: "RiskMonitoring", pascal: "RiskMonitoring", db: "egpRiskMonitoring", fields: [{ name: "monitoringKey", type: "string" }, { name: "monitoringName", type: "string" }, { name: "monitoringStatus", type: "select", options: "MONITORING_STATUS_OPTIONS" }], display: { title: "monitoringName", sub: "monitoringStatus" } },
    { tab: "businessContinuity", plural: "businessContinuity", singular: "BusinessContinuity", pascal: "BusinessContinuity", db: "egpBusinessContinuity", fields: [{ name: "continuityKey", type: "string" }, { name: "continuityName", type: "string" }, { name: "continuityStatus", type: "select", options: "CONTINUITY_STATUS_OPTIONS" }], display: { title: "continuityName", sub: "continuityStatus" } },
    { tab: "governanceMetrics", plural: "governanceMetrics", singular: "GovernanceMetric", pascal: "GovernanceMetric", db: "egpGovernanceMetrics", hubField: false, orgOnly: true, fields: [{ name: "metricsKey", type: "string" }, { name: "overallGovernanceScore", type: "number" }, { name: "complianceScore", type: "number" }], display: { title: "metricsKey", sub: "overallGovernanceScore" } },
    { tab: "governanceHealth", plural: "governanceHealth", singular: "GovernanceHealth", pascal: "GovernanceHealth", db: "egpGovernanceHealth", hubField: false, orgOnly: true, fields: [{ name: "healthKey", type: "string" }, { name: "overallScore", type: "number" }, { name: "disasterRecoveryMode", type: "boolean" }], display: { title: "healthKey", sub: "overallScore" } },
    { tab: "complianceDashboards", plural: "complianceDashboards", singular: "ComplianceDashboard", pascal: "ComplianceDashboard", db: "egpComplianceDashboards", fields: [{ name: "dashboardKey", type: "string" }, { name: "dashboardName", type: "string" }, { name: "dashboardStatus", type: "select", options: "DASHBOARD_STATUS_OPTIONS" }], display: { title: "dashboardName", sub: "dashboardStatus" } },
    { tab: "missionProgress", plural: "missionProgress", singular: "MissionProgress", pascal: "MissionProgress", db: "egpMissionProgress", fields: [{ name: "progressKey", type: "string" }, { name: "progressName", type: "string" }, { name: "progressPercent", type: "number" }], display: { title: "progressName", sub: "progressPercent" } },
    { tab: "governanceFailures", plural: "governanceFailures", singular: "GovernanceFailure", pascal: "GovernanceFailure", db: "egpGovernanceFailures", fields: [{ name: "failureKey", type: "string" }, { name: "failureType", type: "string" }], display: { title: "failureKey", sub: "failureType" } },
];

const tabs = ["overview", ...entities.map((e) => e.tab), "auditLogs", "api"];
mkdirSync(join(mod, "constants"), { recursive: true });
mkdirSync(join(mod, "schemas"), { recursive: true });
mkdirSync(join(mod, "services"), { recursive: true });
mkdirSync(join(mod, "hooks"), { recursive: true });
mkdirSync(join(mod, "components"), { recursive: true });
mkdirSync(join(mod, "sdk"), { recursive: true });

// --- constants ---
writeFileSync(join(mod, "constants/index.ts"), `export const EGP_TABS = {
${tabs.map((t) => `    ${t}: "${t}",`).join("\n")}
} as const;

export const GOVERNANCE_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "paused", label: "Paused" },
    { value: "deprecated", label: "Deprecated" },
] as const;

export const POLICY_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
] as const;

export const FRAMEWORK_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
] as const;

export const CONTROL_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
] as const;

export const EVIDENCE_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
] as const;

export const DASHBOARD_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "paused", label: "Paused" },
    { value: "archived", label: "Archived" },
] as const;

export const EGP_PERMISSIONS = ["egp.view", "egp.manage", "egp.approve", "egp.admin"] as const;

export const EGP_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "healthy", label: "Healthy" },
    { value: "degraded", label: "Degraded" },
    { value: "failed", label: "Failed" },
    { value: "open", label: "Open" },
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
] as const;


export const EGP_THEME = {
    primary: "rose-600",
    primaryHover: "rose-500",
    ring: "rose-500/20",
    text: "text-rose-600",
    textDark: "dark:text-rose-400",
    bg: "bg-rose-600",
    bgHover: "hover:bg-rose-500",
} as const;
`);

// --- schemas ---
const schemaLines = entities.map((e) => {
    const hubId = e.hubField === false ? "" : `\n    governanceHubId: z.string().min(1),`;
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
    "buildGovernanceHubLookupMaps", "buildEgpAuditPayload", "buildEgpDashboardStats", "buildEgpPipelineInfo", "mapAuditEntry",
    ...entities.flatMap((e) => [`build${e.pascal}Payload`, `map${e.pascal}Summary`]),
    "mapOrganizationGovernanceForStats", "mapComplianceControlForStats", "mapGovernanceMetricForStats", "mapAuditFindingForStats", "mapRiskRegisterForStats", "mapComplianceControlForStats", "mapGovernanceHealthForStats", "mapGovernanceFailureForStats",
].join(",\n    ");

const typeImports = entities.flatMap((e) => [`${e.pascal}Summary`, `Create${e.pascal}Input`]).concat(["AuditEntry", "EgpDashboardStats", "EgpPipelineInfo", "EgpSdkTrackCustomerHealthInput", "EgpSdkTrackCustomerHealthResult", "EgpSdkOpenSupportTicketInput", "EgpSdkOpenSupportTicketResult", "EgpSdkRunDeliveryWorkflowInput", "EgpSdkRunDeliveryWorkflowResult"]).join(",\n    ");

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
        await databaseService.egpAuditLogs.create(buildEgpAuditPayload(context.organizationId, "${e.tab.replace(/([A-Z])/g, "_$1").toLowerCase().replace(/^_/, "")}", "create", \`${e.pascal} created\`, created.id));${createMaps}
        ${createReturn}
    }`;
}).join("\n");

writeFileSync(join(mod, "services/enterprise-governance-platform.service.ts"), `import {
    ${mapperImports},
} from "@/src/modules/database/lib/enterprise-governance-platform-mappers";
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
import { createAiOrganizationFoundationClient } from "@/src/modules/customer-operated-platform/sdk";
import { crmService } from "@/src/modules/crm/services/crm.service";
import type {
    ${typeImports},
} from "@/src/modules/enterprise-governance-platform/types";

export class EnterpriseGovernancePlatformService {
    private async getContext(authUserId: string, email: string, fullName?: string | null) {
        return resolveOrganizationContext(authUserId, email, fullName);
    }

    private async getMaps(organizationId: string) {
        const governanceHubs = await databaseService.egpGovernanceHubs.listByOrganization(organizationId);
        return buildGovernanceHubLookupMaps(governanceHubs);
    }

    async getDashboardStats(authUserId: string, email: string, fullName?: string | null): Promise<EgpDashboardStats> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return buildEgpDashboardStats({ governanceHubs: [], organizationGovernance: [], complianceControls: [], auditFindings: [], riskRegister: [], governanceMetrics: [], governanceHealth: [], governanceFailures: [], auditLogs: [] });
        const [governanceHubs, organizationGovernanceRaw, complianceControlsRaw, auditFindingsRaw, riskRegisterRaw, governanceMetricsRaw, governanceHealthRaw, governanceFailures, auditLogs] = await Promise.all([
            this.getGovernanceHubs(authUserId, email, fullName),
            databaseService.egpKpiRegistry.listByOrganization(context.organizationId),
            databaseService.egpExecutiveDashboards.listByOrganization(context.organizationId),
            databaseService.egpRevenueForecasts.listByOrganization(context.organizationId),
            databaseService.egpCrossModuleInsights.listByOrganization(context.organizationId),
            databaseService.egpGovernanceMetrics.listByOrganization(context.organizationId),
            databaseService.egpGovernanceHealth.listByOrganization(context.organizationId),
            this.getGovernanceFailures(authUserId, email, fullName),
            this.getAuditLogs(authUserId, email, fullName),
        ]);
        return buildEgpDashboardStats({
            governanceHubs,
            organizationGovernance: organizationGovernanceRaw.map(mapOrganizationGovernanceForStats),
            complianceControls: complianceControlsRaw.map(mapComplianceControlForStats),
            auditFindings: auditFindingsRaw.map(mapAuditFindingForStats),
            riskRegister: riskRegisterRaw.map(mapRiskRegisterForStats),
            governanceMetrics: governanceMetricsRaw.map(mapGovernanceMetricForStats),
            governanceHealth: governanceHealthRaw.map(mapGovernanceHealthForStats),
            governanceFailures,
            auditLogs,
        });
    }

    getPipelineInfo(): EgpPipelineInfo {
        return buildEgpPipelineInfo();
    }
${serviceMethods}

    async getAuditLogs(authUserId: string, email: string, fullName?: string | null): Promise<AuditEntry[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.egpAuditLogs.listByOrganization(context.organizationId)).map(mapAuditEntry);
    }

    async getGovernanceHubOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.egpGovernanceHubs.listByOrganization(context.organizationId)).map((r) => ({ id: r.id, name: r.hub_name }));
    }

    async sdkRunGovernanceService(authUserId: string, email: string, input: EgpSdkRunGovernanceServiceInput, fullName?: string | null): Promise<EgpSdkRunGovernanceServiceResult> {
        const ifr = createIndustryFrameworkClient(authUserId, email, fullName);
        await ifr.getIndustryFrameworkHubs();
        const dfe = createFormEngineClient(authUserId, email, fullName);
        await dfe.getFormEngineHubs();
        await crmService.getClients(authUserId, email, fullName);
        const created = await this.createOrganizationGovernance(authUserId, email, { governanceHubId: input.governanceHubId, kpiKey: input.kpiKey, kpiName: input.kpiName }, fullName);
        return { kpiId: created.id, kpiKey: created.kpiKey, status: created.status };
    }

    async sdkRunComplianceService(authUserId: string, email: string, input: EgpSdkRunComplianceServiceInput, fullName?: string | null): Promise<EgpSdkRunComplianceServiceResult> {
        const dwe = createWorkflowEngineClient(authUserId, email, fullName);
        await dwe.getWorkflowEngineHubs();
        const dde = createDocumentEngineClient(authUserId, email, fullName);
        await dde.getDocumentHubs();
        const comm = createCommunicationHubClient(authUserId, email, fullName);
        await comm.getCommunicationHubs();
        const created = await this.createComplianceControl(authUserId, email, { governanceHubId: input.governanceHubId, dashboardKey: input.dashboardKey, dashboardName: input.dashboardName }, fullName);
        return { dashboardId: created.id, dashboardKey: created.dashboardKey, status: created.status };
    }

    async sdkRunAuditService(authUserId: string, email: string, input: EgpSdkRunAuditServiceInput, fullName?: string | null): Promise<EgpSdkRunAuditServiceResult> {
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
        const cop = createAiOrganizationFoundationClient(authUserId, email, fullName);
        await cop.getIntelligenceHubs();
        await crmService.getDeals(authUserId, email, fullName);
        const created = await this.createAuditFinding(authUserId, email, { governanceHubId: input.governanceHubId, insightKey: input.insightKey, insightTitle: input.insightTitle }, fullName);
        return { insightId: created.id, insightKey: created.insightKey, status: created.status };
    }
}

export const enterpriseGovernancePlatformService = new EnterpriseGovernancePlatformService();
`);

// --- hook ---
const hookTypeImports = entities.flatMap((e) => [`${e.pascal}Summary`, `Create${e.pascal}Input`]).concat(["AuditEntry", "EgpDashboardStats", "EgpPipelineInfo"]).join(",\n    ");
const hookStates = entities.map((e) => `    const [${e.plural}, set${e.pascal}s] = useState<${e.pascal}Summary[]>([]);`).join("\n");
const hookFetchVars = entities.map((e) => `${e.plural}List`).join(",\n            ");
const hookFetchCalls = entities.map((e) => `            enterpriseGovernancePlatformService.get${e.pascal}s(authUserId, email, fullName),`).join("\n");
const hookReturnProps = entities.map((e) => `${e.plural}List`).join(",\n            ");
const hookApplySets = entities.map((e) => `        set${e.pascal}s(result.${e.plural}List);`).join("\n");
const hookCreates = entities.map((e) => `    const create${e.pascal} = useCallback(async (input: Create${e.pascal}Input) => { if (!user) throw new Error("Authentication required"); await enterpriseGovernancePlatformService.create${e.pascal}(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);`).join("\n");
const hookReturnFields = entities.map((e) => `        ${e.plural},\n        create${e.pascal},`).join("\n");

writeFileSync(join(mod, "hooks/useEnterpriseGovernancePlatform.ts"), `"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { enterpriseGovernancePlatformService } from "@/src/modules/enterprise-governance-platform/services/enterprise-governance-platform.service";
import type {
    ${hookTypeImports},
} from "@/src/modules/enterprise-governance-platform/types";

export function useEnterpriseGovernancePlatform() {
    const user = useAuthStore((state) => state.user);
    const authUserId = user?.id;
    const email = user?.email ?? "";
    const fullName = user?.fullName;
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<EgpDashboardStats | null>(null);
    const [pipeline, setPipeline] = useState<EgpPipelineInfo | null>(null);
${hookStates}
    const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
    const [governanceHubOptions, setIntegrationHubOptions] = useState<Array<{ id: string; name: string }>>([]);

    const fetchData = useCallback(async () => {
        if (!authUserId || !email) return { empty: true as const };
        const [
            statsData,
            pipelineInfo,
${hookFetchVars},
            auditLogsList,
            hubOpts,
        ] = await Promise.all([
            enterpriseGovernancePlatformService.getDashboardStats(authUserId, email, fullName),
            Promise.resolve(enterpriseGovernancePlatformService.getPipelineInfo()),
${hookFetchCalls}
            enterpriseGovernancePlatformService.getAuditLogs(authUserId, email, fullName),
            enterpriseGovernancePlatformService.getGovernanceHubOptions(authUserId, email, fullName),
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
        governanceHubOptions,
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
    }, e.hubField === false ? {} : { governanceHubId: "" });
    const defaultStr = JSON.stringify(defaults);
    const formFields = e.fields.map((f) => {
        if (f.type === "select") return `                <select {...form.register("${f.name}")} className={inputClass}>{${f.options}.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>`;
        if (f.type === "number") return `                <input type="number" step="any" {...form.register("${f.name}", { valueAsNumber: true })} placeholder="${f.name}" className={inputClass} />`;
        if (f.type === "boolean") return `                <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...form.register("${f.name}")} /> ${f.name}</label>`;
        return `                <input {...form.register("${f.name}")} placeholder="${f.name}" className={inputClass} />`;
    }).join("\n");
    const hubSelect = e.hubField === false ? "" : `                <GovernanceHubSelect data={data} {...form.register("governanceHubId")} />\n`;
    const titleField = e.display.title;
    const subField = e.display.sub;
    return `export function ${panelName}({ data }: { data: GovernanceData }) {
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

writeFileSync(join(mod, "components/EnterpriseGovernancePlatformPanels.tsx"), `"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/src/components/ui/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { EGP_THEME, CONTROL_STATUS_OPTIONS, ALERT_SEVERITY_OPTIONS } from "@/src/modules/enterprise-governance-platform/constants";
import type { useEnterpriseGovernancePlatform } from "@/src/modules/enterprise-governance-platform/hooks/useEnterpriseGovernancePlatform";
import {
${schemaImports}
} from "@/src/modules/enterprise-governance-platform/schemas";

type GovernanceData = ReturnType<typeof useEnterpriseGovernancePlatform>;
const inputClass = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-rose-500/20 focus:ring-4 dark:border-slate-800 dark:bg-rose-950";
function SaveButton({ loading, label = "Save changes" }: { loading?: boolean; label?: string }) {
    return <button type="submit" disabled={loading} className="rounded-full bg-rose-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-rose-500 disabled:opacity-60">{loading ? "Saving..." : label}</button>;
}
function ListCard({ title, subtitle, meta }: { title: string; subtitle: string; meta?: string }) {
    return <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800"><p className="font-medium">{title}</p><p className="text-sm text-rose-500">{subtitle}</p>{meta ? <p className="mt-1 text-xs text-rose-600">{meta}</p> : null}</div>;
}
function GovernanceHubSelect({ data, ...props }: { data: GovernanceData } & React.SelectHTMLAttributes<HTMLSelectElement>) {
    return <select {...props} className={inputClass}><option value="">Select retail operating system</option>{data.governanceHubOptions.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>;
}

export function GovernanceOverviewPanel({ data }: { data: GovernanceData }) {
    const pipeline = data.pipeline;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="Enterprise Governance Platform summary" description="System health, background jobs, event bus, riskRegister, feature flags, configuration, diagnostics, and operations dashboard" /><div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ListCard title="Governance Hubs" subtitle={\`\${data.stats?.totalGovernanceHubs ?? 0} total\`} meta={\`\${data.stats?.activeGovernanceHubs ?? 0} active • \${data.stats?.organizationGovernanceCount ?? 0} dining areas\`} />
                <ListCard title="Connectors" subtitle={\`\${data.stats?.complianceControlsCount ?? 0} menu categories\`} meta={\`\${data.stats?.auditFindingCount ?? 0} auditFindings • \${data.stats?.riskRegisterCount ?? 0} open riskRegister\`} />
                <ListCard title="Health" subtitle={\`\${(data.stats?.overallGovernanceScore ?? 0).toFixed(1)} overall retail score\`} meta={\`\${data.stats?.openFailureCount ?? 0} open failures\`} />
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

export function GovernanceAuditLogsPanel({ data }: { data: GovernanceData }) {
    return (
        <Card hover><SectionHeader title="Enterprise Governance Platform audit history" description="Security-first audit trail for jobs, events, riskRegister, and marketplace operations" /><div className="mt-6 space-y-3">
            {data.auditLogs.length === 0 ? <EmptyState title="No audit entries" description="Audit logs are created automatically for retail operating system." /> : data.auditLogs.map((entry) => (
                <ListCard key={entry.id} title={entry.summary} subtitle={\`\${entry.entityType} • \${entry.action}\`} meta={\`\${entry.securityLevel} • \${new Date(entry.createdAt).toLocaleString()}\`} />
            ))}
        </div></Card>
    );
}

export function GovernanceSdkPanel({ data }: { data: GovernanceData }) {
    return (
        <Card hover><SectionHeader title="Shared Enterprise Governance Platform SDK" description="Import from @/src/modules/enterprise-governance-platform/sdk for brand registration, menu configuration, and order workflow execution" /><div className="mt-6 space-y-4 text-sm text-rose-600 dark:text-rose-300">
            <ListCard title="createEnterpriseGovernancePlatformClient()" subtitle="Factory for module-scoped Enterprise Governance Platform client with auth context" meta="Primary SDK for enterprise retail operating system" />
            <ListCard title="sdkRunGovernanceService()" subtitle="Register retail operating system with AI orchestration" meta="moduleSource: enterprise_governance_platform" />
            <ListCard title="sdkRunComplianceService()" subtitle="Run intelligence service with knowledge context" meta="v1/v2/v3 API versions" />
            <ListCard title="sdkRunAuditService()" subtitle="Run forecast service with audit trail" meta="Event-driven integration delivery" />
            <p className="text-xs text-rose-500">Theme: {EGP_THEME.primary} • Integration hubs loaded: {data.governanceHubs.length}</p>
            <pre className="overflow-x-auto rounded-2xl bg-rose-950 p-4 text-xs text-rose-100">{\`import { createEnterpriseGovernancePlatformClient } from "@/src/modules/enterprise-governance-platform/sdk";

const intg = createEnterpriseGovernancePlatformClient(userId, email, fullName);
await intg.registerCampus({ governanceHubId, serviceKey: "svc-001", serviceName: "Stripe" });
await intg.runComplianceService({ governanceHubId, keyName: "prod-key", apiVersion: "v1" });
await intg.runAuditService({ governanceHubId, webhookKey: "wh-001", webhookName: "Events" });\`}</pre>
        </div></Card>
    );
}
`);

// --- stats ---
writeFileSync(join(mod, "components/EnterpriseGovernancePlatformStats.tsx"), `import { StatCard } from "@/src/components/ui/StatCard";
import type { EgpDashboardStats } from "@/src/modules/enterprise-governance-platform/types";

interface EnterpriseGovernancePlatformStatsProps { stats: EgpDashboardStats | null; }

export function EnterpriseGovernancePlatformStats({ stats }: EnterpriseGovernancePlatformStatsProps) {
    const cards = [
        { title: "Governance Hubs", value: String(stats?.totalGovernanceHubs ?? 0), detail: \`\${stats?.activeGovernanceHubs ?? 0} active • \${stats?.organizationGovernanceCount ?? 0} dining areas\`, trend: "up" as const },
        { title: "Connectors", value: String(stats?.complianceControlsCount ?? 0), detail: \`\${stats?.auditFindingCount ?? 0} auditFindings • \${stats?.riskRegisterCount ?? 0} open riskRegister\`, trend: "up" as const, tone: "accent" as const },
        { title: "Health Score", value: \`\${(stats?.overallGovernanceScore ?? 0).toFixed(1)}\`, detail: \`\${stats?.openFailureCount ?? 0} open failures\`, trend: "up" as const },
        { title: "Audit Trail", value: String(stats?.auditCount ?? 0), detail: "Jobs, events, riskRegister, and configuration audit entries", trend: "up" as const },
    ];
    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 [&_p:last-child]:text-rose-600 dark:[&_p:last-child]:text-rose-400">
            {cards.map((card) => <StatCard key={card.title} title={card.title} value={card.value} detail={card.detail} trend={card.trend} tone={card.tone} />)}
        </section>
    );
}
`);

// --- page ---
const tabDefs = [
    { id: "overview", label: "Overview", panel: "GovernanceOverviewPanel" },
    ...entities.map((e) => ({ id: e.tab, label: label(e.tab), panel: `${e.pascal}sPanel` })),
    { id: "auditLogs", label: "Audit Logs", panel: "GovernanceAuditLogsPanel" },
    { id: "api", label: "SDK", panel: "GovernanceSdkPanel" },
];

writeFileSync(join(mod, "components/EnterpriseGovernancePlatformPage.tsx"), `"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { LoadingState } from "@/src/components/ui/LoadingState";
import {
    GovernanceOverviewPanel,
    ${panelImports},
    GovernanceAuditLogsPanel,
    GovernanceSdkPanel,
} from "@/src/modules/enterprise-governance-platform/components/EnterpriseGovernancePlatformPanels";
import { EnterpriseGovernancePlatformStats } from "@/src/modules/enterprise-governance-platform/components/EnterpriseGovernancePlatformStats";
import { EGP_TABS } from "@/src/modules/enterprise-governance-platform/constants";
import { useEnterpriseGovernancePlatform } from "@/src/modules/enterprise-governance-platform/hooks/useEnterpriseGovernancePlatform";

const tabs = [
${tabDefs.map((t) => `    { id: EGP_TABS.${t.id}, label: "${t.label}" },`).join("\n")}
] as const;

export function EnterpriseGovernancePlatformPage() {
    const retail = useEnterpriseGovernancePlatform();
    const [activeTab, setActiveTab] = useState<(typeof EGP_TABS)[keyof typeof EGP_TABS]>(EGP_TABS.overview);

    if (retail.loading) {
        return <div className="mx-auto max-w-7xl"><LoadingState label="Loading Enterprise Governance Platform" /></div>;
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-rose-900 dark:text-rose-100">
            <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-rose-900/80">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-rose-600">V2 Program A Enterprise Governance Platform</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Enterprise Enterprise Governance Platform</h1>
                <p className="mt-3 max-w-2xl text-sm text-rose-500 dark:text-rose-400">
                    Integration layer for the entire SaaS platform: dining areas, payment & accounting connectors, public API platform, webhook delivery, integration marketplace, API analytics, and retail operating system dashboard with security-first audit and the shared Enterprise Governance Platform SDK.
                </p>
            </motion.header>
            <EnterpriseGovernancePlatformStats stats={retail.stats} />
            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={\`rounded-full px-4 py-2 text-sm font-medium transition \${activeTab === tab.id ? "bg-rose-600 text-white" : "border border-slate-200 text-rose-600 hover:border-rose-300 dark:border-slate-800 dark:text-rose-300"}\`}>{tab.label}</button>
                ))}
            </div>
${tabDefs.map((t) => `            {activeTab === EGP_TABS.${t.id} ? <${t.panel} data={retail} /> : null}`).join("\n")}
        </div>
    );
}
`);

// --- sdk ---
writeFileSync(join(mod, "sdk/index.ts"), `import { enterpriseGovernancePlatformService } from "@/src/modules/enterprise-governance-platform/services/enterprise-governance-platform.service";
import type { EgpSdkRunGovernanceServiceInput, EgpSdkRunComplianceServiceInput, EgpSdkRunAuditServiceInput, EgpSdkRunDataGovernanceServiceInput, EgpSdkRunDataGovernanceServiceInput } from "@/src/modules/enterprise-governance-platform/types";

export class GovernanceService {
    constructor(private readonly client: EnterpriseGovernancePlatformClient) {}
    async run(input: EgpSdkRunGovernanceServiceInput) { return this.client.runGovernanceService(input); }
}

export class ComplianceService {
    constructor(private readonly client: EnterpriseGovernancePlatformClient) {}
    async run(input: EgpSdkRunComplianceServiceInput) { return this.client.runComplianceService(input); }
}

export class AuditService {
    constructor(private readonly client: EnterpriseGovernancePlatformClient) {}
    async run(input: EgpSdkRunAuditServiceInput) { return this.client.runAuditService(input); }
}

export class DataGovernanceService {
    constructor(private readonly client: EnterpriseGovernancePlatformClient) {}
    async run(input: EgpSdkRunDataGovernanceServiceInput) { return this.client.runDataGovernanceService(input); }
}

export class DataGovernanceService {
    constructor(private readonly client: EnterpriseGovernancePlatformClient) {}
    async run(input: EgpSdkRunDataGovernanceServiceInput) { return this.client.runDataGovernanceService(input); }
}

export class EnterpriseGovernancePlatformClient {
    constructor(
        private readonly authUserId: string,
        private readonly email: string,
        private readonly fullName?: string | null,
    ) {}

    readonly kpiService = new GovernanceService(this);
    readonly intelligenceService = new ComplianceService(this);
    readonly forecastService = new AuditService(this);
    readonly reportingService = new DataGovernanceService(this);
    readonly executiveInsightService = new DataGovernanceService(this);

    async runGovernanceService(input: EgpSdkRunGovernanceServiceInput) {
        return enterpriseGovernancePlatformService.sdkRunGovernanceService(this.authUserId, this.email, input, this.fullName);
    }

    async runComplianceService(input: EgpSdkRunComplianceServiceInput) {
        return enterpriseGovernancePlatformService.sdkRunComplianceService(this.authUserId, this.email, input, this.fullName);
    }

    async runAuditService(input: EgpSdkRunAuditServiceInput) {
        return enterpriseGovernancePlatformService.sdkRunAuditService(this.authUserId, this.email, input, this.fullName);
    }

    async runDataGovernanceService(input: EgpSdkRunDataGovernanceServiceInput) {
        return enterpriseGovernancePlatformService.sdkRunDataGovernanceService(this.authUserId, this.email, input, this.fullName);
    }

    async runDataGovernanceService(input: EgpSdkRunDataGovernanceServiceInput) {
        return enterpriseGovernancePlatformService.sdkRunDataGovernanceService(this.authUserId, this.email, input, this.fullName);
    }

    async getGovernanceHubs() {
        return enterpriseGovernancePlatformService.getGovernanceHubs(this.authUserId, this.email, this.fullName);
    }

    async getDashboardStats() {
        return enterpriseGovernancePlatformService.getDashboardStats(this.authUserId, this.email, this.fullName);
    }

    async getPipelineInfo() {
        return enterpriseGovernancePlatformService.getPipelineInfo();
    }
}

export function createEnterpriseGovernancePlatformClient(authUserId: string, email: string, fullName?: string | null): EnterpriseGovernancePlatformClient {
    return new EnterpriseGovernancePlatformClient(authUserId, email, fullName);
}

export { enterpriseGovernancePlatformService };
`);

// --- index ---
writeFileSync(join(mod, "index.ts"), `export { EnterpriseGovernancePlatformPage } from "@/src/modules/enterprise-governance-platform/components/EnterpriseGovernancePlatformPage";
export { EnterpriseGovernancePlatformStats } from "@/src/modules/enterprise-governance-platform/components/EnterpriseGovernancePlatformStats";
export { enterpriseGovernancePlatformService } from "@/src/modules/enterprise-governance-platform/services/enterprise-governance-platform.service";
export { useEnterpriseGovernancePlatform } from "@/src/modules/enterprise-governance-platform/hooks/useEnterpriseGovernancePlatform";
export { createEnterpriseGovernancePlatformClient, EnterpriseGovernancePlatformClient } from "@/src/modules/enterprise-governance-platform/sdk";
export * from "@/src/modules/enterprise-governance-platform/types";
export * from "@/src/modules/enterprise-governance-platform/constants";
`);

console.log(`Generated retail operating system module files. EGP_TABS count: ${tabs.length}`);
