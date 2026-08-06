#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
let s = readFileSync(join(root, "scripts/verify-ai-organization-foundation.mjs"), "utf8");

const reps = [
    [/AI Organization Foundation verification/g, "Enterprise Governance Platform verification"],
    [/verify-ai-organization-foundation/g, "verify-enterprise-governance"],
    [/202608020047_ai_organization_foundation/g, "202608020048_enterprise_governance_platform"],
    [/047_ai_organization_foundation_seed/g, "048_enterprise_governance_platform_seed"],
    [/ai-organization-foundation-mappers/g, "enterprise-governance-platform-mappers"],
    [/ai-organization-foundation\/sdk/g, "enterprise-governance-platform/sdk"],
    [/ai-organization-foundation/g, "enterprise-governance-platform"],
    [/AiOrganizationFoundation/g, "EnterpriseGovernancePlatform"],
    [/aiOrganizationFoundation/g, "enterpriseGovernancePlatform"],
    [/ai_organization_foundation/g, "enterprise_governance_platform"],
    [/AOF_/g, "EGP_"],
    [/Aof/g, "Egp"],
    [/"aof\./g, '"egp.'],
    [/aof_/g, "egp_"],
    [/OrganizationHub/g, "GovernanceHub"],
    [/organizationHub/g, "governanceHub"],
    [/OrganizationMetric/g, "GovernanceMetric"],
    [/OrganizationHealth/g, "GovernanceHealth"],
    [/OrganizationFailure/g, "GovernanceFailure"],
    [/orange-600/g, "rose-600"],
    [/Bot/g, "ShieldCheck"],
    [/AI Organization/g, "Enterprise Governance"],
    [/AgoService/g, "GovernanceService"],
    [/AdoService/g, "ComplianceService"],
    [/AioService/g, "AuditService"],
    [/OrchestrationService/g, "DataGovernanceService"],
    [/createAiOrganizationFoundationClient/g, "createEnterpriseGovernancePlatformClient"],
    [/ai-organization-foundation:verify/g, "enterprise-governance:verify"],
    [/founder_os_phase5/g, "founder_os_phase6"],
    [/FoPhase5Stats/g, "FoPhase6Stats"],
    [/FounderOsPhase5Panel/g, "FounderOsPhase6Panel"],
    [/phase5 tab/g, "phase6 tab"],
    [/phase5Stats/g, "phase6Stats"],
    [/getPhase5Stats/g, "getPhase6Stats"],
    [/northstar-ai-organization/g, "northstar-enterprise-governance"],
    [/ago-growth-0907/g, "gov-org-0908"],
    [/schema:aof_table_count/g, "schema:egp_table_count"],
    [/buildAofDashboardStats/g, "buildEgpDashboardStats"],
    [/buildOrganizationHubLookupMaps/g, "buildGovernanceHubLookupMaps"],
    [/buildAofPipelineInfo/g, "buildEgpPipelineInfo"],
    [/AOF_TABS count/g, "EGP_TABS count"],
];

for (const [from, to] of reps) s = s.replace(from, to);

s = s.replace(
    /pass\("founder_os_phase6:FoPhase6Stats type"/,
    `pass("governance:organization_governance_table", tables.includes("egp_organization_governance"));
pass("governance:governance_policies_table", tables.includes("egp_governance_policies"));
pass("governance:governance_framework_table", tables.includes("egp_governance_framework"));
pass("governance:governance_reviews_table", tables.includes("egp_governance_reviews"));
pass("governance:governance_dashboards_table", tables.includes("egp_governance_dashboards"));
pass("compliance:compliance_framework_table", tables.includes("egp_compliance_framework"));
pass("compliance:compliance_controls_table", tables.includes("egp_compliance_controls"));
pass("compliance:compliance_evidence_table", tables.includes("egp_compliance_evidence"));
pass("compliance:compliance_reports_table", tables.includes("egp_compliance_reports"));
pass("compliance:compliance_calendar_table", tables.includes("egp_compliance_calendar"));
pass("audit:audit_center_table", tables.includes("egp_audit_center"));
pass("audit:audit_findings_table", tables.includes("egp_audit_findings"));
pass("audit:corrective_actions_table", tables.includes("egp_corrective_actions"));
pass("audit:audit_evidence_table", tables.includes("egp_audit_evidence"));
pass("audit:audit_analytics_table", tables.includes("egp_audit_analytics"));
pass("data_governance:data_classification_table", tables.includes("egp_data_classification"));
pass("data_governance:retention_policies_table", tables.includes("egp_retention_policies"));
pass("data_governance:data_lifecycle_table", tables.includes("egp_data_lifecycle"));
pass("data_governance:data_ownership_table", tables.includes("egp_data_ownership"));
pass("data_governance:data_quality_table", tables.includes("egp_data_quality"));
pass("risk_management:risk_register_table", tables.includes("egp_risk_register"));
pass("risk_management:risk_assessment_table", tables.includes("egp_risk_assessment"));
pass("risk_management:risk_mitigation_table", tables.includes("egp_risk_mitigation"));
pass("risk_management:risk_monitoring_table", tables.includes("egp_risk_monitoring"));
pass("risk_management:business_continuity_table", tables.includes("egp_business_continuity"));
pass("enterprise_governance:createEnterpriseGovernancePlatformClient", sdkSource.includes("createEnterpriseGovernancePlatformClient"));
pass("governance_metrics:governance_health_score", /egp_governance_metrics[\\s\\S]*?governance_health_score numeric/i.test(migrationSql));
pass("governance_metrics:compliance_score", /egp_governance_metrics[\\s\\S]*?compliance_score numeric/i.test(migrationSql));
pass("governance_metrics:overall_governance_score", /egp_governance_metrics[\\s\\S]*?overall_governance_score numeric/i.test(migrationSql));
pass("governance_health:disaster_recovery_mode", /egp_governance_health[\\s\\S]*?disaster_recovery_mode boolean/i.test(migrationSql));
pass("governance_health:governance_status", /egp_governance_health[\\s\\S]*?governance_status text/i.test(migrationSql));
pass("governance_health:compliance_status", /egp_governance_health[\\s\\S]*?compliance_status text/i.test(migrationSql));
pass("founder_os_phase6:FoPhase6Stats type"`,
);

s = s.replace(/pass\("ago:[^"]+"[^;]*;\n/g, "");
s = s.replace(/pass\("ado:[^"]+"[^;]*;\n/g, "");
s = s.replace(/pass\("aio:[^"]+"[^;]*;\n/g, "");
s = s.replace(/pass\("ai_orchestration:[^"]+"[^;]*;\n/g, "");
s = s.replace(/pass\("organization_metrics:[^"]+"[^;]*;\n/g, "");
s = s.replace(/pass\("organization_health:[^"]+"[^;]*;\n/g, "");
s = s.replace(/pass\("enterprise_ai_foundation:[^"]+"[^;]*;\n/g, "");

s = s.replace(
    /pass\("sdk:AgoService"/,
    `pass("sdk:GovernanceService", sdkSource.includes("export class GovernanceService"));
pass("sdk:ComplianceService", sdkSource.includes("export class ComplianceService"));
pass("sdk:AuditService", sdkSource.includes("export class AuditService"));
pass("sdk:DataGovernanceService", sdkSource.includes("export class DataGovernanceService"));
pass("sdk:RiskManagementService", sdkSource.includes("export class RiskManagementService"));
pass("sdk:DashboardService", sdkSource.includes("export class DashboardService"));
pass("sdk:createEnterpriseGovernancePlatformClient"`,
);

s = s.replace(
    /pass\("framework:createEnterpriseIntelligencePlatformClient"/,
    `pass("framework:createAiOrganizationFoundationClient", serviceSource.includes("createAiOrganizationFoundationClient"));
pass("framework:createEnterpriseIntelligencePlatformClient"`,
);

s = s.replace(/All AI Organization Foundation verification checks passed\./, "All Enterprise Governance Platform verification checks passed.");

writeFileSync(join(root, "scripts/verify-enterprise-governance.mjs"), s);
console.log("Created verify-enterprise-governance.mjs");
