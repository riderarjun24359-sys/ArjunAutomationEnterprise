#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const inPath = join(root, "scripts/generate-ai-organization-foundation-ui.mjs");
const outPath = join(root, "scripts/generate-enterprise-governance-platform-ui.mjs");
let s = readFileSync(inPath, "utf8");

s = s.replace(/src\/modules\/ai-organization-foundation/g, "src/modules/enterprise-governance-platform");
s = s.replace(/const entities = \[[\s\S]*?\];/, "const entities = [\n    { tab: \"governanceHubs\", plural: \"governanceHubs\", singular: \"GovernanceHub\", pascal: \"GovernanceHub\", db: \"egpGovernanceHubs\", hubField: false, fields: [{ name: \"hubKey\", type: \"string\" }, { name: \"hubName\", type: \"string\" }, { name: \"environment\", type: \"string\" }], display: { title: \"hubName\", sub: \"hubKey\" } },\n    { tab: \"organizationGovernance\", plural: \"organizationGovernance\", singular: \"OrganizationGovernance\", pascal: \"OrganizationGovernance\", db: \"egpOrganizationGovernance\", fields: [{ name: \"governanceKey\", type: \"string\" }, { name: \"governanceName\", type: \"string\" }, { name: \"governanceStatus\", type: \"select\", options: \"GOVERNANCE_STATUS_OPTIONS\" }], display: { title: \"governanceName\", sub: \"governanceStatus\" } },\n    { tab: \"governancePolicies\", plural: \"governancePolicies\", singular: \"GovernancePolicy\", pascal: \"GovernancePolicy\", db: \"egpGovernancePolicies\", fields: [{ name: \"policyKey\", type: \"string\" }, { name: \"policyName\", type: \"string\" }, { name: \"policyStatus\", type: \"select\", options: \"POLICY_STATUS_OPTIONS\" }], display: { title: \"policyName\", sub: \"policyStatus\" } },\n    { tab: \"governanceFramework\", plural: \"governanceFramework\", singular: \"GovernanceFramework\", pascal: \"GovernanceFramework\", db: \"egpGovernanceFramework\", fields: [{ name: \"frameworkKey\", type: \"string\" }, { name: \"frameworkName\", type: \"string\" }, { name: \"frameworkStatus\", type: \"select\", options: \"FRAMEWORK_STATUS_OPTIONS\" }], display: { title: \"frameworkName\", sub: \"frameworkStatus\" } },\n    { tab: \"governanceReviews\", plural: \"governanceReviews\", singular: \"GovernanceReview\", pascal: \"GovernanceReview\", db: \"egpGovernanceReviews\", fields: [{ name: \"reviewKey\", type: \"string\" }, { name: \"reviewTitle\", type: \"string\" }, { name: \"reviewStatus\", type: \"select\", options: \"REVIEW_STATUS_OPTIONS\" }], display: { title: \"reviewTitle\", sub: \"reviewStatus\" } },\n    { tab: \"governanceDashboards\", plural: \"governanceDashboards\", singular: \"GovernanceDashboard\", pascal: \"GovernanceDashboard\", db: \"egpGovernanceDashboards\", fields: [{ name: \"dashboardKey\", type: \"string\" }, { name: \"dashboardName\", type: \"string\" }, { name: \"dashboardStatus\", type: \"select\", options: \"DASHBOARD_STATUS_OPTIONS\" }], display: { title: \"dashboardName\", sub: \"dashboardStatus\" } },\n    { tab: \"complianceFramework\", plural: \"complianceFramework\", singular: \"ComplianceFramework\", pascal: \"ComplianceFramework\", db: \"egpComplianceFramework\", fields: [{ name: \"frameworkKey\", type: \"string\" }, { name: \"frameworkName\", type: \"string\" }, { name: \"frameworkStatus\", type: \"select\", options: \"FRAMEWORK_STATUS_OPTIONS\" }], display: { title: \"frameworkName\", sub: \"frameworkStatus\" } },\n    { tab: \"complianceControls\", plural: \"complianceControls\", singular: \"ComplianceControl\", pascal: \"ComplianceControl\", db: \"egpComplianceControls\", fields: [{ name: \"controlKey\", type: \"string\" }, { name: \"controlName\", type: \"string\" }, { name: \"controlStatus\", type: \"select\", options: \"CONTROL_STATUS_OPTIONS\" }], display: { title: \"controlName\", sub: \"controlStatus\" } },\n    { tab: \"complianceEvidence\", plural: \"complianceEvidence\", singular: \"ComplianceEvidence\", pascal: \"ComplianceEvidence\", db: \"egpComplianceEvidence\", fields: [{ name: \"evidenceKey\", type: \"string\" }, { name: \"evidenceTitle\", type: \"string\" }, { name: \"evidenceStatus\", type: \"select\", options: \"EVIDENCE_STATUS_OPTIONS\" }], display: { title: \"evidenceTitle\", sub: \"evidenceStatus\" } },\n    { tab: \"complianceReports\", plural: \"complianceReports\", singular: \"ComplianceReport\", pascal: \"ComplianceReport\", db: \"egpComplianceReports\", fields: [{ name: \"reportKey\", type: \"string\" }, { name: \"reportTitle\", type: \"string\" }, { name: \"reportStatus\", type: \"select\", options: \"REPORT_STATUS_OPTIONS\" }], display: { title: \"reportTitle\", sub: \"reportStatus\" } },\n    { tab: \"complianceCalendar\", plural: \"complianceCalendar\", singular: \"ComplianceCalendar\", pascal: \"ComplianceCalendar\", db: \"egpComplianceCalendar\", fields: [{ name: \"calendarKey\", type: \"string\" }, { name: \"calendarName\", type: \"string\" }, { name: \"calendarStatus\", type: \"select\", options: \"CALENDAR_STATUS_OPTIONS\" }], display: { title: \"calendarName\", sub: \"calendarStatus\" } },\n    { tab: \"auditCenter\", plural: \"auditCenter\", singular: \"AuditCenter\", pascal: \"AuditCenter\", db: \"egpAuditCenter\", fields: [{ name: \"auditKey\", type: \"string\" }, { name: \"auditName\", type: \"string\" }, { name: \"auditStatus\", type: \"select\", options: \"AUDIT_STATUS_OPTIONS\" }], display: { title: \"auditName\", sub: \"auditStatus\" } },\n    { tab: \"auditFindings\", plural: \"auditFindings\", singular: \"AuditFinding\", pascal: \"AuditFinding\", db: \"egpAuditFindings\", fields: [{ name: \"findingKey\", type: \"string\" }, { name: \"findingTitle\", type: \"string\" }, { name: \"findingSeverity\", type: \"string\" }], display: { title: \"findingTitle\", sub: \"findingSeverity\" } },\n    { tab: \"correctiveActions\", plural: \"correctiveActions\", singular: \"CorrectiveAction\", pascal: \"CorrectiveAction\", db: \"egpCorrectiveActions\", fields: [{ name: \"actionKey\", type: \"string\" }, { name: \"actionTitle\", type: \"string\" }, { name: \"actionStatus\", type: \"select\", options: \"ACTION_STATUS_OPTIONS\" }], display: { title: \"actionTitle\", sub: \"actionStatus\" } },\n    { tab: \"auditEvidence\", plural: \"auditEvidence\", singular: \"AuditEvidence\", pascal: \"AuditEvidence\", db: \"egpAuditEvidence\", fields: [{ name: \"evidenceKey\", type: \"string\" }, { name: \"evidenceTitle\", type: \"string\" }, { name: \"evidenceStatus\", type: \"select\", options: \"EVIDENCE_STATUS_OPTIONS\" }], display: { title: \"evidenceTitle\", sub: \"evidenceStatus\" } },\n    { tab: \"auditAnalytics\", plural: \"auditAnalytics\", singular: \"AuditAnalytics\", pascal: \"AuditAnalytics\", db: \"egpAuditAnalytics\", fields: [{ name: \"analyticsKey\", type: \"string\" }, { name: \"analyticsName\", type: \"string\" }, { name: \"analyticsScore\", type: \"number\" }], display: { title: \"analyticsName\", sub: \"analyticsScore\" } },\n    { tab: \"dataClassification\", plural: \"dataClassification\", singular: \"DataClassification\", pascal: \"DataClassification\", db: \"egpDataClassification\", fields: [{ name: \"classificationKey\", type: \"string\" }, { name: \"classificationName\", type: \"string\" }, { name: \"classificationLevel\", type: \"string\" }], display: { title: \"classificationName\", sub: \"classificationLevel\" } },\n    { tab: \"retentionPolicies\", plural: \"retentionPolicies\", singular: \"RetentionPolicy\", pascal: \"RetentionPolicy\", db: \"egpRetentionPolicies\", fields: [{ name: \"policyKey\", type: \"string\" }, { name: \"policyName\", type: \"string\" }, { name: \"policyStatus\", type: \"select\", options: \"POLICY_STATUS_OPTIONS\" }], display: { title: \"policyName\", sub: \"policyStatus\" } },\n    { tab: \"dataLifecycle\", plural: \"dataLifecycle\", singular: \"DataLifecycle\", pascal: \"DataLifecycle\", db: \"egpDataLifecycle\", fields: [{ name: \"lifecycleKey\", type: \"string\" }, { name: \"lifecycleName\", type: \"string\" }, { name: \"lifecycleStage\", type: \"string\" }], display: { title: \"lifecycleName\", sub: \"lifecycleStage\" } },\n    { tab: \"dataOwnership\", plural: \"dataOwnership\", singular: \"DataOwnership\", pascal: \"DataOwnership\", db: \"egpDataOwnership\", fields: [{ name: \"ownershipKey\", type: \"string\" }, { name: \"ownershipName\", type: \"string\" }, { name: \"ownershipStatus\", type: \"select\", options: \"OWNERSHIP_STATUS_OPTIONS\" }], display: { title: \"ownershipName\", sub: \"ownershipStatus\" } },\n    { tab: \"dataQuality\", plural: \"dataQuality\", singular: \"DataQuality\", pascal: \"DataQuality\", db: \"egpDataQuality\", fields: [{ name: \"qualityKey\", type: \"string\" }, { name: \"qualityName\", type: \"string\" }, { name: \"qualityScore\", type: \"number\" }], display: { title: \"qualityName\", sub: \"qualityScore\" } },\n    { tab: \"riskRegister\", plural: \"riskRegister\", singular: \"RiskRegister\", pascal: \"RiskRegister\", db: \"egpRiskRegister\", fields: [{ name: \"riskKey\", type: \"string\" }, { name: \"riskTitle\", type: \"string\" }, { name: \"riskSeverity\", type: \"string\" }], display: { title: \"riskTitle\", sub: \"riskSeverity\" } },\n    { tab: \"riskAssessment\", plural: \"riskAssessment\", singular: \"RiskAssessment\", pascal: \"RiskAssessment\", db: \"egpRiskAssessment\", fields: [{ name: \"assessmentKey\", type: \"string\" }, { name: \"assessmentTitle\", type: \"string\" }, { name: \"assessmentScore\", type: \"number\" }], display: { title: \"assessmentTitle\", sub: \"assessmentScore\" } },\n    { tab: \"riskMitigation\", plural: \"riskMitigation\", singular: \"RiskMitigation\", pascal: \"RiskMitigation\", db: \"egpRiskMitigation\", fields: [{ name: \"mitigationKey\", type: \"string\" }, { name: \"mitigationTitle\", type: \"string\" }, { name: \"mitigationStatus\", type: \"select\", options: \"MITIGATION_STATUS_OPTIONS\" }], display: { title: \"mitigationTitle\", sub: \"mitigationStatus\" } },\n    { tab: \"riskMonitoring\", plural: \"riskMonitoring\", singular: \"RiskMonitoring\", pascal: \"RiskMonitoring\", db: \"egpRiskMonitoring\", fields: [{ name: \"monitoringKey\", type: \"string\" }, { name: \"monitoringName\", type: \"string\" }, { name: \"monitoringStatus\", type: \"select\", options: \"MONITORING_STATUS_OPTIONS\" }], display: { title: \"monitoringName\", sub: \"monitoringStatus\" } },\n    { tab: \"businessContinuity\", plural: \"businessContinuity\", singular: \"BusinessContinuity\", pascal: \"BusinessContinuity\", db: \"egpBusinessContinuity\", fields: [{ name: \"continuityKey\", type: \"string\" }, { name: \"continuityName\", type: \"string\" }, { name: \"continuityStatus\", type: \"select\", options: \"CONTINUITY_STATUS_OPTIONS\" }], display: { title: \"continuityName\", sub: \"continuityStatus\" } },\n    { tab: \"governanceMetrics\", plural: \"governanceMetrics\", singular: \"GovernanceMetric\", pascal: \"GovernanceMetric\", db: \"egpGovernanceMetrics\", hubField: false, orgOnly: true, fields: [{ name: \"metricsKey\", type: \"string\" }, { name: \"overallGovernanceScore\", type: \"number\" }, { name: \"complianceScore\", type: \"number\" }], display: { title: \"metricsKey\", sub: \"overallGovernanceScore\" } },\n    { tab: \"governanceHealth\", plural: \"governanceHealth\", singular: \"GovernanceHealth\", pascal: \"GovernanceHealth\", db: \"egpGovernanceHealth\", hubField: false, orgOnly: true, fields: [{ name: \"healthKey\", type: \"string\" }, { name: \"overallScore\", type: \"number\" }, { name: \"disasterRecoveryMode\", type: \"boolean\" }], display: { title: \"healthKey\", sub: \"overallScore\" } },\n    { tab: \"complianceDashboards\", plural: \"complianceDashboards\", singular: \"ComplianceDashboard\", pascal: \"ComplianceDashboard\", db: \"egpComplianceDashboards\", fields: [{ name: \"dashboardKey\", type: \"string\" }, { name: \"dashboardName\", type: \"string\" }, { name: \"dashboardStatus\", type: \"select\", options: \"DASHBOARD_STATUS_OPTIONS\" }], display: { title: \"dashboardName\", sub: \"dashboardStatus\" } },\n    { tab: \"missionProgress\", plural: \"missionProgress\", singular: \"MissionProgress\", pascal: \"MissionProgress\", db: \"egpMissionProgress\", fields: [{ name: \"progressKey\", type: \"string\" }, { name: \"progressName\", type: \"string\" }, { name: \"progressPercent\", type: \"number\" }], display: { title: \"progressName\", sub: \"progressPercent\" } },\n    { tab: \"governanceFailures\", plural: \"governanceFailures\", singular: \"GovernanceFailure\", pascal: \"GovernanceFailure\", db: \"egpGovernanceFailures\", fields: [{ name: \"failureKey\", type: \"string\" }, { name: \"failureType\", type: \"string\" }], display: { title: \"failureKey\", sub: \"failureType\" } },\n];");

const reps = [
    [/ai-organization-foundation/g, "enterprise-governance-platform"],
    [/AiOrganizationFoundation/g, "EnterpriseGovernancePlatform"],
    [/aiOrganizationFoundation/g, "enterpriseGovernancePlatform"],
    [/AOF_/g, "EGP_"],
    [/Aof/g, "Egp"],
    [/aof/g, "egp"],
    [/OrganizationHub/g, "GovernanceHub"],
    [/organizationHub/g, "governanceHub"],
    [/organizationHubId/g, "governanceHubId"],
    [/OrganizationHubSelect/g, "GovernanceHubSelect"],
    [/buildOrganizationHubLookupMaps/g, "buildGovernanceHubLookupMaps"],
    [/OrganizationMetric/g, "GovernanceMetric"],
    [/OrganizationHealth/g, "GovernanceHealth"],
    [/OrganizationFailure/g, "GovernanceFailure"],
    [/organizationMetrics/g, "governanceMetrics"],
    [/organizationHealth/g, "governanceHealth"],
    [/organizationFailures/g, "governanceFailures"],
    [/totalOrganizationHubs/g, "totalGovernanceHubs"],
    [/activeOrganizationHubs/g, "activeGovernanceHubs"],
    [/overallOrganizationScore/g, "overallGovernanceScore"],
    [/growthScore/g, "governanceHealthScore"],
    [/deliveryScore/g, "complianceScore"],
    [/innovationScore/g, "enterpriseRiskScore"],
    [/pipelineHealthScore/g, "auditSummaryScore"],
    [/missionProgressScore/g, "dataGovernanceHealthScore"],
    [/pendingAiApprovalCount/g, "openGovernanceFailureCount"],
    [/growthOrchestratorCount/g, "organizationGovernanceCount"],
    [/deliveryOrchestratorCount/g, "complianceControlCount"],
    [/ideaRegistryCount/g, "auditFindingCount"],
    [/aiTaskRouterCount/g, "riskRegisterCount"],
    [/humanApprovalCount/g, "dataClassificationCount"],
    [/openOrganizationFailureCount/g, "openGovernanceFailureCount"],
    [/mapGrowthOrchestratorForStats/g, "mapOrganizationGovernanceForStats"],
    [/mapDeliveryOrchestratorForStats/g, "mapComplianceControlForStats"],
    [/mapIdeaRegistryForStats/g, "mapAuditFindingForStats"],
    [/mapAiTaskRouterForStats/g, "mapRiskRegisterForStats"],
    [/mapOrganizationMetricForStats/g, "mapGovernanceMetricForStats"],
    [/mapOrganizationHealthForStats/g, "mapGovernanceHealthForStats"],
    [/mapOrganizationFailureForStats/g, "mapGovernanceFailureForStats"],
    [/growthOrchestrators/g, "organizationGovernance"],
    [/deliveryOrchestrators/g, "complianceControls"],
    [/ideaRegistry/g, "auditFindings"],
    [/aiTaskRouters/g, "riskRegister"],
    [/createGrowthOrchestrator/g, "createOrganizationGovernance"],
    [/createDeliveryOrchestrator/g, "createComplianceControl"],
    [/createIdeaRegistry/g, "createAuditFinding"],
    [/AgoService/g, "GovernanceService"],
    [/AdoService/g, "ComplianceService"],
    [/AioService/g, "AuditService"],
    [/OrchestrationService/g, "DataGovernanceService"],
    [/runAgoService/g, "runGovernanceService"],
    [/runAdoService/g, "runComplianceService"],
    [/runAioService/g, "runAuditService"],
    [/runOrchestrationService/g, "runDataGovernanceService"],
    [/sdkRunAgoService/g, "sdkRunGovernanceService"],
    [/sdkRunAdoService/g, "sdkRunComplianceService"],
    [/sdkRunAioService/g, "sdkRunAuditService"],
    [/sdkRunOrchestrationService/g, "sdkRunDataGovernanceService"],
    [/EgpSdkRunAgoService/g, "EgpSdkRunGovernanceService"],
    [/EgpSdkRunAdoService/g, "EgpSdkRunComplianceService"],
    [/EgpSdkRunAioService/g, "EgpSdkRunAuditService"],
    [/EgpSdkRunOrchestrationService/g, "EgpSdkRunDataGovernanceService"],
    [/ai_organization_foundation/g, "enterprise_governance_platform"],
    [/orange/g, "rose"],
    [/ORCHESTRATOR_STATUS_OPTIONS/g, "GOVERNANCE_STATUS_OPTIONS"],
    [/CAMPAIGN_STATUS_OPTIONS/g, "CONTROL_STATUS_OPTIONS"],
    [/APPROVAL_STATUS_OPTIONS/g, "EVIDENCE_STATUS_OPTIONS"],
    [/createEnterpriseIntelligencePlatformClient/g, "createAiOrganizationFoundationClient"],
    [/getOrganizationHubs/g, "getGovernanceHubs"],
    [/Bot/g, "ShieldCheck"],
    [/AI Organization Foundation/g, "Enterprise Governance Platform"],
    [/AI Organization/g, "Enterprise Governance"],
    [/Organization Hubs/g, "Governance Hubs"],
    [/organization hub/g, "governance hub"],
    [/Select organization hub/g, "Select governance hub"],
    [/"aof\./g, '"egp.'],
    [/RetailOverviewPanel/g, "GovernanceOverviewPanel"],
    [/RetailAuditLogsPanel/g, "GovernanceAuditLogsPanel"],
    [/RetailSdkPanel/g, "GovernanceSdkPanel"],
    [/RetailData/g, "GovernanceData"],
];

for (const [from, to] of reps) s = s.replace(from, to);

s = s.replace(
    /import { createCompanyFoundationClient } from "@\/src\/modules\/company-foundation\/sdk";\r?\nimport { createCustomerSuccessDeliveryClient } from "@\/src\/modules\/customer-success-delivery\/sdk";\r?\nimport { createCustomerOperatedPlatformClient } from "@\/src\/modules\/customer-operated-platform\/sdk";\r?\nimport { createEnterpriseIntelligencePlatformClient } from "@\/src\/modules\/enterprise-intelligence-platform\/sdk";\r?\nimport { createAiOrchestrationClient } from "@\/src\/modules\/ai-orchestration\/sdk";\r?\nimport { crmService } from "@\/src\/modules\/crm\/services\/crm\.service";/,
    `import { createCompanyFoundationClient } from "@/src/modules/company-foundation/sdk";
import { createCustomerSuccessDeliveryClient } from "@/src/modules/customer-success-delivery/sdk";
import { createCustomerOperatedPlatformClient } from "@/src/modules/customer-operated-platform/sdk";
import { createEnterpriseIntelligencePlatformClient } from "@/src/modules/enterprise-intelligence-platform/sdk";
import { createAiOrganizationFoundationClient } from "@/src/modules/ai-organization-foundation/sdk";
import { createAiOrchestrationClient } from "@/src/modules/ai-orchestration/sdk";
import { crmService } from "@/src/modules/crm/services/crm.service";`,
);

const egpOptions = `export const GOVERNANCE_STATUS_OPTIONS = [
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

`;

s = s.replace(
    /(writeFileSync\(join\(mod, "constants\/index\.ts"\), `export const EGP_TABS = \{[\s\S]*?\} as const;\r?\n\r?\n)[\s\S]*?(\r?\nexport const EGP_THEME)/,
    `$1${egpOptions}$2`,
);

writeFileSync(outPath, s, "utf8");
console.log("Patched generate-enterprise-governance-platform-ui.mjs");
