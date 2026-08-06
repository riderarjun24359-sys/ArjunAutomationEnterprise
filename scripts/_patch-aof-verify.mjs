#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
let s = readFileSync(join(root, "scripts/verify-ai-organization-foundation.mjs"), "utf8");

const reps = [
    [/Enterprise Intelligence Platform verification/g, "AI Organization Foundation verification"],
    [/verify-enterprise-intelligence/g, "verify-ai-organization-foundation"],
    [/202608020046_enterprise_intelligence_platform/g, "202608020047_ai_organization_foundation"],
    [/046_enterprise_intelligence_platform_seed/g, "047_ai_organization_foundation_seed"],
    [/enterprise-intelligence-platform-mappers/g, "ai-organization-foundation-mappers"],
    [/enterprise-intelligence-platform\/sdk/g, "ai-organization-foundation/sdk"],
    [/enterprise-intelligence-platform/g, "ai-organization-foundation"],
    [/EnterpriseIntelligencePlatform/g, "AiOrganizationFoundation"],
    [/enterpriseIntelligencePlatform/g, "aiOrganizationFoundation"],
    [/enterprise_intelligence_platform/g, "ai_organization_foundation"],
    [/EIP_/g, "AOF_"],
    [/Eip/g, "Aof"],
    [/"eip\./g, '"aof.'],
    [/eip_/g, "aof_"],
    [/IntelligenceHub/g, "OrganizationHub"],
    [/intelligenceHub/g, "organizationHub"],
    [/IntelligenceMetric/g, "OrganizationMetric"],
    [/IntelligenceHealth/g, "OrganizationHealth"],
    [/IntelligenceFailure/g, "OrganizationFailure"],
    [/fuchsia-600/g, "orange-600"],
    [/Brain/g, "Bot"],
    [/Enterprise Intelligence/g, "AI Organization"],
    [/KpiService/g, "AgoService"],
    [/ForecastService/g, "AioService"],
    [/ReportingService/g, "OrchestrationService"],
    [/ExecutiveInsightService/g, "OrchestrationService"],
    [/createEnterpriseIntelligencePlatformClient/g, "createAiOrganizationFoundationClient"],
    [/enterprise-intelligence:verify/g, "ai-organization-foundation:verify"],
    [/founder_os_phase4/g, "founder_os_phase5"],
    [/FoPhase4Stats/g, "FoPhase5Stats"],
    [/FounderOsPhase4Panel/g, "FounderOsPhase5Panel"],
    [/phase4 tab/g, "phase5 tab"],
    [/phase4Stats/g, "phase5Stats"],
    [/getPhase4Stats/g, "getPhase5Stats"],
    [/northstar-enterprise-intelligence/g, "northstar-ai-organization"],
    [/kpi-revenue-0906/g, "ago-growth-0907"],
    [/schema:eip_table_count/g, "schema:aof_table_count"],
];

for (const [from, to] of reps) s = s.replace(from, to);

s = s.replace(/createAofOrganizationFoundationClient/g, "createAiOrganizationFoundationClient");
s = s.replace(/IntelligenceService/g, "AdoService");

s = s.replace(
    /pass\("founder_os_phase5:FoPhase5Stats type"/,
    `pass("ago:growth_orchestrators_table", tables.includes("aof_growth_orchestrators"));
pass("ago:campaign_intelligence_table", tables.includes("aof_campaign_intelligence"));
pass("ago:pipeline_health_table", tables.includes("aof_pipeline_health"));
pass("ado:delivery_orchestrators_table", tables.includes("aof_delivery_orchestrators"));
pass("ado:resource_planners_table", tables.includes("aof_resource_planners"));
pass("ado:deployment_coordination_table", tables.includes("aof_deployment_coordination"));
pass("aio:idea_registry_table", tables.includes("aof_idea_registry"));
pass("aio:innovation_pipeline_table", tables.includes("aof_innovation_pipeline"));
pass("aio:experiment_tracker_table", tables.includes("aof_experiment_tracker"));
pass("ai_orchestration:ai_task_routers_table", tables.includes("aof_ai_task_routers"));
pass("ai_orchestration:human_approval_engine_table", tables.includes("aof_human_approval_engine"));
pass("ai_orchestration:policy_engine_table", tables.includes("aof_policy_engine"));
pass("ai_orchestration:execution_history_table", tables.includes("aof_execution_history"));
pass("ai_orchestration:ai_governance_rules_table", tables.includes("aof_ai_governance_rules"));
pass("enterprise_ai_foundation:createAiOrganizationFoundationClient", sdkSource.includes("createAiOrganizationFoundationClient"));
pass("organization_metrics:growth_score", /aof_organization_metrics[\\s\\S]*?growth_score numeric/i.test(migrationSql));
pass("organization_metrics:pending_ai_approval_count", /aof_organization_metrics[\\s\\S]*?pending_ai_approval_count integer/i.test(migrationSql));
pass("organization_health:ago_status", /aof_organization_health[\\s\\S]*?ago_status text/i.test(migrationSql));
pass("organization_health:orchestration_status", /aof_organization_health[\\s\\S]*?orchestration_status text/i.test(migrationSql));
pass("founder_os_phase5:FoPhase5Stats type"`,
);

s = s.replace(/pass\("kpi_engine:[^"]+"[^;]*;\n/g, "");
s = s.replace(/pass\("executive:[^"]+"[^;]*;\n/g, "");
s = s.replace(/pass\("predictive:[^"]+"[^;]*;\n/g, "");
s = s.replace(/pass\("reporting:[^"]+"[^;]*;\n/g, "");
s = s.replace(/pass\("sdk:kpi_service_configs_table"[^;]*;\n/g, "");
s = s.replace(/pass\("sdk:intelligence_service_configs_table"[^;]*;\n/g, "");
s = s.replace(/pass\("sdk:forecast_service_configs_table"[^;]*;\n/g, "");
s = s.replace(/pass\("intelligence_metrics:[^"]+"[^;]*;\n/g, "");
s = s.replace(/pass\("intelligence_health:[^"]+"[^;]*;\n/g, "");

writeFileSync(join(root, "scripts/verify-ai-organization-foundation.mjs"), s, "utf8");
console.log("Patched verify-ai-organization-foundation.mjs");
