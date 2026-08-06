#!/usr/bin/env node
/**
 * /**
 * Generates V2 Enterprise Governance Platform artifacts.
 * Run: node scripts/generate-enterprise-governance-platform.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const PREFIX = "egp";
const Pascal = "Egp";
const camel = "egp";
const permResource = "enterprise_governance_platform";

const hubTable = `${PREFIX}_governance_hubs`;
const hubFk = "hub_id";
const orgOnlyTables = new Set([`${PREFIX}_governance_metrics`, `${PREFIX}_governance_health`, `${PREFIX}_audit_logs`]);

const entities = [
    { tab: "governanceHubs", plural: "governanceHubs", singular: "GovernanceHub", pascal: "GovernanceHub", db: "egpGovernanceHubs", table: hubTable, hubField: false, orgOnly: false, fields: [{ name: "hubKey", type: "string" }, { name: "hubName", type: "string" }, { name: "environment", type: "string" }], display: { title: "hubName", sub: "hubKey" }, sqlExtra: "hub_key text not null,\n  hub_name text not null,\n  environment text not null default 'production',\n  governance_tier text not null default 'enterprise'" },
    { tab: "organizationGovernance", plural: "organizationGovernance", singular: "OrganizationGovernance", pascal: "OrganizationGovernance", db: "egpOrganizationGovernance", table: `${PREFIX}_organization_governance`, fields: [{ name: "governanceKey", type: "string" }, { name: "governanceName", type: "string" }, { name: "governanceStatus", type: "select", options: "GOVERNANCE_STATUS_OPTIONS" }], display: { title: "governanceName", sub: "governanceStatus" }, sqlExtra: "governance_key text not null,\n  governance_name text not null default '',\n  governance_status text not null default 'active',\n  governance_scope text not null default 'enterprise',\n  owner_ref text not null default ''" },
    { tab: "governancePolicies", plural: "governancePolicies", singular: "GovernancePolicy", pascal: "GovernancePolicy", db: "egpGovernancePolicies", table: `${PREFIX}_governance_policies`, fields: [{ name: "policyKey", type: "string" }, { name: "policyName", type: "string" }, { name: "policyStatus", type: "select", options: "POLICY_STATUS_OPTIONS" }], display: { title: "policyName", sub: "policyStatus" }, sqlExtra: "policy_key text not null,\n  policy_name text not null default '',\n  policy_status text not null default 'active',\n  policy_type text not null default 'standard',\n  effective_date date not null default current_date" },
    { tab: "governanceFramework", plural: "governanceFramework", singular: "GovernanceFramework", pascal: "GovernanceFramework", db: "egpGovernanceFramework", table: `${PREFIX}_governance_framework`, fields: [{ name: "frameworkKey", type: "string" }, { name: "frameworkName", type: "string" }, { name: "frameworkStatus", type: "select", options: "FRAMEWORK_STATUS_OPTIONS" }], display: { title: "frameworkName", sub: "frameworkStatus" }, sqlExtra: "framework_key text not null,\n  framework_name text not null default '',\n  framework_status text not null default 'active',\n  framework_version text not null default '1.0',\n  control_count integer not null default 0" },
    { tab: "governanceReviews", plural: "governanceReviews", singular: "GovernanceReview", pascal: "GovernanceReview", db: "egpGovernanceReviews", table: `${PREFIX}_governance_reviews`, fields: [{ name: "reviewKey", type: "string" }, { name: "reviewTitle", type: "string" }, { name: "reviewStatus", type: "select", options: "REVIEW_STATUS_OPTIONS" }], display: { title: "reviewTitle", sub: "reviewStatus" }, sqlExtra: "review_key text not null,\n  review_title text not null default '',\n  review_status text not null default 'scheduled',\n  review_type text not null default 'quarterly',\n  scheduled_at timestamptz not null default now()" },
    { tab: "governanceDashboards", plural: "governanceDashboards", singular: "GovernanceDashboard", pascal: "GovernanceDashboard", db: "egpGovernanceDashboards", table: `${PREFIX}_governance_dashboards`, fields: [{ name: "dashboardKey", type: "string" }, { name: "dashboardName", type: "string" }, { name: "dashboardStatus", type: "select", options: "DASHBOARD_STATUS_OPTIONS" }], display: { title: "dashboardName", sub: "dashboardStatus" }, sqlExtra: "dashboard_key text not null,\n  dashboard_name text not null default '',\n  dashboard_status text not null default 'active',\n  widget_count integer not null default 0,\n  refresh_cadence text not null default 'daily'" },
    { tab: "complianceFramework", plural: "complianceFramework", singular: "ComplianceFramework", pascal: "ComplianceFramework", db: "egpComplianceFramework", table: `${PREFIX}_compliance_framework`, fields: [{ name: "frameworkKey", type: "string" }, { name: "frameworkName", type: "string" }, { name: "frameworkStatus", type: "select", options: "FRAMEWORK_STATUS_OPTIONS" }], display: { title: "frameworkName", sub: "frameworkStatus" }, sqlExtra: "framework_key text not null,\n  framework_name text not null default '',\n  framework_status text not null default 'active',\n  regulatory_body text not null default '',\n  certification_level text not null default 'standard'" },
    { tab: "complianceControls", plural: "complianceControls", singular: "ComplianceControl", pascal: "ComplianceControl", db: "egpComplianceControls", table: `${PREFIX}_compliance_controls`, fields: [{ name: "controlKey", type: "string" }, { name: "controlName", type: "string" }, { name: "controlStatus", type: "select", options: "CONTROL_STATUS_OPTIONS" }], display: { title: "controlName", sub: "controlStatus" }, sqlExtra: "control_key text not null,\n  control_name text not null default '',\n  control_status text not null default 'active',\n  control_type text not null default 'preventive',\n  framework_ref text not null default ''" },
    { tab: "complianceEvidence", plural: "complianceEvidence", singular: "ComplianceEvidence", pascal: "ComplianceEvidence", db: "egpComplianceEvidence", table: `${PREFIX}_compliance_evidence`, fields: [{ name: "evidenceKey", type: "string" }, { name: "evidenceTitle", type: "string" }, { name: "evidenceStatus", type: "select", options: "EVIDENCE_STATUS_OPTIONS" }], display: { title: "evidenceTitle", sub: "evidenceStatus" }, sqlExtra: "evidence_key text not null,\n  evidence_title text not null default '',\n  evidence_status text not null default 'pending',\n  evidence_type text not null default 'document',\n  control_ref text not null default ''" },
    { tab: "complianceReports", plural: "complianceReports", singular: "ComplianceReport", pascal: "ComplianceReport", db: "egpComplianceReports", table: `${PREFIX}_compliance_reports`, fields: [{ name: "reportKey", type: "string" }, { name: "reportTitle", type: "string" }, { name: "reportStatus", type: "select", options: "REPORT_STATUS_OPTIONS" }], display: { title: "reportTitle", sub: "reportStatus" }, sqlExtra: "report_key text not null,\n  report_title text not null default '',\n  report_status text not null default 'draft',\n  report_period text not null default 'quarterly',\n  compliance_score numeric(5, 2) not null default 0" },
    { tab: "complianceCalendar", plural: "complianceCalendar", singular: "ComplianceCalendar", pascal: "ComplianceCalendar", db: "egpComplianceCalendar", table: `${PREFIX}_compliance_calendar`, fields: [{ name: "calendarKey", type: "string" }, { name: "calendarName", type: "string" }, { name: "calendarStatus", type: "select", options: "CALENDAR_STATUS_OPTIONS" }], display: { title: "calendarName", sub: "calendarStatus" }, sqlExtra: "calendar_key text not null,\n  calendar_name text not null default '',\n  calendar_status text not null default 'active',\n  due_date date not null default current_date,\n  obligation_type text not null default 'filing'" },
    { tab: "auditCenter", plural: "auditCenter", singular: "AuditCenter", pascal: "AuditCenter", db: "egpAuditCenter", table: `${PREFIX}_audit_center`, fields: [{ name: "auditKey", type: "string" }, { name: "auditName", type: "string" }, { name: "auditStatus", type: "select", options: "AUDIT_STATUS_OPTIONS" }], display: { title: "auditName", sub: "auditStatus" }, sqlExtra: "audit_key text not null,\n  audit_name text not null default '',\n  audit_status text not null default 'planned',\n  audit_type text not null default 'internal',\n  scheduled_start date not null default current_date" },
    { tab: "auditFindings", plural: "auditFindings", singular: "AuditFinding", pascal: "AuditFinding", db: "egpAuditFindings", table: `${PREFIX}_audit_findings`, fields: [{ name: "findingKey", type: "string" }, { name: "findingTitle", type: "string" }, { name: "findingSeverity", type: "string" }], display: { title: "findingTitle", sub: "findingSeverity" }, sqlExtra: "finding_key text not null,\n  finding_title text not null default '',\n  finding_severity text not null default 'medium',\n  finding_status text not null default 'open',\n  audit_ref text not null default ''" },
    { tab: "correctiveActions", plural: "correctiveActions", singular: "CorrectiveAction", pascal: "CorrectiveAction", db: "egpCorrectiveActions", table: `${PREFIX}_corrective_actions`, fields: [{ name: "actionKey", type: "string" }, { name: "actionTitle", type: "string" }, { name: "actionStatus", type: "select", options: "ACTION_STATUS_OPTIONS" }], display: { title: "actionTitle", sub: "actionStatus" }, sqlExtra: "action_key text not null,\n  action_title text not null default '',\n  action_status text not null default 'open',\n  finding_ref text not null default '',\n  due_date date" },
    { tab: "auditEvidence", plural: "auditEvidence", singular: "AuditEvidence", pascal: "AuditEvidence", db: "egpAuditEvidence", table: `${PREFIX}_audit_evidence`, fields: [{ name: "evidenceKey", type: "string" }, { name: "evidenceTitle", type: "string" }, { name: "evidenceStatus", type: "select", options: "EVIDENCE_STATUS_OPTIONS" }], display: { title: "evidenceTitle", sub: "evidenceStatus" }, sqlExtra: "evidence_key text not null,\n  evidence_title text not null default '',\n  evidence_status text not null default 'pending',\n  evidence_type text not null default 'document',\n  audit_ref text not null default ''" },
    { tab: "auditAnalytics", plural: "auditAnalytics", singular: "AuditAnalytics", pascal: "AuditAnalytics", db: "egpAuditAnalytics", table: `${PREFIX}_audit_analytics`, fields: [{ name: "analyticsKey", type: "string" }, { name: "analyticsName", type: "string" }, { name: "analyticsScore", type: "number" }], display: { title: "analyticsName", sub: "analyticsScore" }, sqlExtra: "analytics_key text not null,\n  analytics_name text not null default '',\n  analytics_score numeric(5, 2) not null default 0,\n  analytics_type text not null default 'summary',\n  measured_at timestamptz not null default now()" },
    { tab: "dataClassification", plural: "dataClassification", singular: "DataClassification", pascal: "DataClassification", db: "egpDataClassification", table: `${PREFIX}_data_classification`, fields: [{ name: "classificationKey", type: "string" }, { name: "classificationName", type: "string" }, { name: "classificationLevel", type: "string" }], display: { title: "classificationName", sub: "classificationLevel" }, sqlExtra: "classification_key text not null,\n  classification_name text not null default '',\n  classification_level text not null default 'internal',\n  data_domain text not null default 'general',\n  retention_ref text not null default ''" },
    { tab: "retentionPolicies", plural: "retentionPolicies", singular: "RetentionPolicy", pascal: "RetentionPolicy", db: "egpRetentionPolicies", table: `${PREFIX}_retention_policies`, fields: [{ name: "policyKey", type: "string" }, { name: "policyName", type: "string" }, { name: "policyStatus", type: "select", options: "POLICY_STATUS_OPTIONS" }], display: { title: "policyName", sub: "policyStatus" }, sqlExtra: "policy_key text not null,\n  policy_name text not null default '',\n  policy_status text not null default 'active',\n  retention_days integer not null default 365,\n  data_class_ref text not null default ''" },
    { tab: "dataLifecycle", plural: "dataLifecycle", singular: "DataLifecycle", pascal: "DataLifecycle", db: "egpDataLifecycle", table: `${PREFIX}_data_lifecycle`, fields: [{ name: "lifecycleKey", type: "string" }, { name: "lifecycleName", type: "string" }, { name: "lifecycleStage", type: "string" }], display: { title: "lifecycleName", sub: "lifecycleStage" }, sqlExtra: "lifecycle_key text not null,\n  lifecycle_name text not null default '',\n  lifecycle_stage text not null default 'active',\n  data_domain text not null default 'general',\n  transition_policy text not null default ''" },
    { tab: "dataOwnership", plural: "dataOwnership", singular: "DataOwnership", pascal: "DataOwnership", db: "egpDataOwnership", table: `${PREFIX}_data_ownership`, fields: [{ name: "ownershipKey", type: "string" }, { name: "ownershipName", type: "string" }, { name: "ownershipStatus", type: "select", options: "OWNERSHIP_STATUS_OPTIONS" }], display: { title: "ownershipName", sub: "ownershipStatus" }, sqlExtra: "ownership_key text not null,\n  ownership_name text not null default '',\n  ownership_status text not null default 'active',\n  owner_ref text not null default '',\n  data_domain text not null default 'general'" },
    { tab: "dataQuality", plural: "dataQuality", singular: "DataQuality", pascal: "DataQuality", db: "egpDataQuality", table: `${PREFIX}_data_quality`, fields: [{ name: "qualityKey", type: "string" }, { name: "qualityName", type: "string" }, { name: "qualityScore", type: "number" }], display: { title: "qualityName", sub: "qualityScore" }, sqlExtra: "quality_key text not null,\n  quality_name text not null default '',\n  quality_score numeric(5, 2) not null default 100,\n  quality_dimension text not null default 'completeness',\n  measured_at timestamptz not null default now()" },
    { tab: "riskRegister", plural: "riskRegister", singular: "RiskRegister", pascal: "RiskRegister", db: "egpRiskRegister", table: `${PREFIX}_risk_register`, fields: [{ name: "riskKey", type: "string" }, { name: "riskTitle", type: "string" }, { name: "riskSeverity", type: "string" }], display: { title: "riskTitle", sub: "riskSeverity" }, sqlExtra: "risk_key text not null,\n  risk_title text not null default '',\n  risk_severity text not null default 'medium',\n  risk_category text not null default 'operational',\n  risk_status text not null default 'open'" },
    { tab: "riskAssessment", plural: "riskAssessment", singular: "RiskAssessment", pascal: "RiskAssessment", db: "egpRiskAssessment", table: `${PREFIX}_risk_assessment`, fields: [{ name: "assessmentKey", type: "string" }, { name: "assessmentTitle", type: "string" }, { name: "assessmentScore", type: "number" }], display: { title: "assessmentTitle", sub: "assessmentScore" }, sqlExtra: "assessment_key text not null,\n  assessment_title text not null default '',\n  assessment_score numeric(5, 2) not null default 0,\n  assessment_type text not null default 'qualitative',\n  risk_ref text not null default ''" },
    { tab: "riskMitigation", plural: "riskMitigation", singular: "RiskMitigation", pascal: "RiskMitigation", db: "egpRiskMitigation", table: `${PREFIX}_risk_mitigation`, fields: [{ name: "mitigationKey", type: "string" }, { name: "mitigationTitle", type: "string" }, { name: "mitigationStatus", type: "select", options: "MITIGATION_STATUS_OPTIONS" }], display: { title: "mitigationTitle", sub: "mitigationStatus" }, sqlExtra: "mitigation_key text not null,\n  mitigation_title text not null default '',\n  mitigation_status text not null default 'planned',\n  risk_ref text not null default '',\n  effectiveness_score numeric(5, 2) not null default 0" },
    { tab: "riskMonitoring", plural: "riskMonitoring", singular: "RiskMonitoring", pascal: "RiskMonitoring", db: "egpRiskMonitoring", table: `${PREFIX}_risk_monitoring`, fields: [{ name: "monitoringKey", type: "string" }, { name: "monitoringName", type: "string" }, { name: "monitoringStatus", type: "select", options: "MONITORING_STATUS_OPTIONS" }], display: { title: "monitoringName", sub: "monitoringStatus" }, sqlExtra: "monitoring_key text not null,\n  monitoring_name text not null default '',\n  monitoring_status text not null default 'active',\n  alert_threshold numeric(5, 2) not null default 75,\n  risk_ref text not null default ''" },
    { tab: "businessContinuity", plural: "businessContinuity", singular: "BusinessContinuity", pascal: "BusinessContinuity", db: "egpBusinessContinuity", table: `${PREFIX}_business_continuity`, fields: [{ name: "continuityKey", type: "string" }, { name: "continuityName", type: "string" }, { name: "continuityStatus", type: "select", options: "CONTINUITY_STATUS_OPTIONS" }], display: { title: "continuityName", sub: "continuityStatus" }, sqlExtra: "continuity_key text not null,\n  continuity_name text not null default '',\n  continuity_status text not null default 'active',\n  recovery_tier text not null default 'tier1',\n  rto_hours numeric(8, 2) not null default 4" },
    { tab: "governanceMetrics", plural: "governanceMetrics", singular: "GovernanceMetric", pascal: "GovernanceMetric", db: "egpGovernanceMetrics", table: `${PREFIX}_governance_metrics`, hubField: false, orgOnly: true, fields: [{ name: "metricsKey", type: "string" }, { name: "overallGovernanceScore", type: "number" }, { name: "complianceScore", type: "number" }], display: { title: "metricsKey", sub: "overallGovernanceScore" }, sqlExtra: "metrics_key text not null,\n  metric_date date not null default current_date,\n  governance_health_score numeric(5, 2) not null default 100,\n  compliance_score numeric(5, 2) not null default 100,\n  enterprise_risk_score numeric(5, 2) not null default 0,\n  audit_summary_score numeric(5, 2) not null default 100,\n  data_governance_health_score numeric(5, 2) not null default 100,\n  overall_governance_score numeric(5, 2) not null default 100" },
    { tab: "governanceHealth", plural: "governanceHealth", singular: "GovernanceHealth", pascal: "GovernanceHealth", db: "egpGovernanceHealth", table: `${PREFIX}_governance_health`, hubField: false, orgOnly: true, fields: [{ name: "healthKey", type: "string" }, { name: "overallScore", type: "number" }, { name: "disasterRecoveryMode", type: "boolean" }], display: { title: "healthKey", sub: "overallScore" }, sqlExtra: "health_key text not null,\n  health_date date not null default current_date,\n  overall_score numeric(5, 2) not null default 100,\n  disaster_recovery_mode boolean not null default false,\n  governance_status text not null default 'healthy',\n  compliance_status text not null default 'healthy',\n  audit_status text not null default 'healthy',\n  data_governance_status text not null default 'healthy',\n  security_status text not null default 'healthy',\n  summary text not null default ''" },
    { tab: "complianceDashboards", plural: "complianceDashboards", singular: "ComplianceDashboard", pascal: "ComplianceDashboard", db: "egpComplianceDashboards", table: `${PREFIX}_compliance_dashboards`, fields: [{ name: "dashboardKey", type: "string" }, { name: "dashboardName", type: "string" }, { name: "dashboardStatus", type: "select", options: "DASHBOARD_STATUS_OPTIONS" }], display: { title: "dashboardName", sub: "dashboardStatus" }, sqlExtra: "dashboard_key text not null,\n  dashboard_name text not null default '',\n  dashboard_status text not null default 'active',\n  compliance_score numeric(5, 2) not null default 0,\n  refresh_cadence text not null default 'weekly'" },
    { tab: "missionProgress", plural: "missionProgress", singular: "MissionProgress", pascal: "MissionProgress", db: "egpMissionProgress", table: `${PREFIX}_mission_progress`, fields: [{ name: "progressKey", type: "string" }, { name: "progressName", type: "string" }, { name: "progressPercent", type: "number" }], display: { title: "progressName", sub: "progressPercent" }, sqlExtra: "progress_key text not null,\n  progress_name text not null default '',\n  progress_percent numeric(5, 2) not null default 0,\n  mission_ref text not null default '',\n  target_date date" },
    { tab: "governanceFailures", plural: "governanceFailures", singular: "GovernanceFailure", pascal: "GovernanceFailure", db: "egpGovernanceFailures", table: `${PREFIX}_governance_failures`, fields: [{ name: "failureKey", type: "string" }, { name: "failureType", type: "string" }], display: { title: "failureKey", sub: "failureType" }, sqlExtra: "failure_key text not null,\n  failure_type text not null default 'governance',\n  error_code text not null default '',\n  error_message text not null default '',\n  failed_at timestamptz not null default now(),\n  resolved_at timestamptz" },
];

const allTables = [...entities.map((e) => e.table), `${PREFIX}_audit_logs`];
const tablesForTriggers = allTables.filter((t) => t !== `${PREFIX}_audit_logs`);

function buildMigration() {
    let sql = "-- V2 Enterprise Governance Platform\n\n";
    for (const e of entities) {
        const isHub = e.table === hubTable;
        const isOrgOnly = e.orgOnly || orgOnlyTables.has(e.table);
        const hubCol = isHub || isOrgOnly ? "" : `  ${hubFk} uuid not null references public.${hubTable}(id) on delete cascade,\n`;
        const uniqueClause = isHub
            ? "unique (organization_id, hub_key)"
            : isOrgOnly
                ? `unique (organization_id, ${e.sqlExtra.split("\n")[0].split(" ")[0]})`
                : `unique (organization_id, ${hubFk}, ${e.sqlExtra.split("\n")[0].split(" ")[0]})`;
        sql += `-- ${e.pascal}\n`;
        sql += `create table if not exists public.${e.table} (\n`;
        sql += `  id uuid primary key default gen_random_uuid(),\n`;
        sql += `  organization_id uuid not null references public.organizations(id) on delete cascade,\n`;
        sql += hubCol;
        sql += `  ${e.sqlExtra},\n`;
        sql += `  status text not null default 'active',\n`;
        sql += `  created_at timestamptz not null default now(),\n`;
        sql += `  updated_at timestamptz not null default now(),\n`;
        sql += `  ${uniqueClause}\n`;
        sql += `);\n\n`;
    }
    sql += `-- Audit Logs\n`;
    sql += `create table if not exists public.${PREFIX}_audit_logs (\n`;
    sql += `  id uuid primary key default gen_random_uuid(),\n`;
    sql += `  organization_id uuid not null references public.organizations(id) on delete cascade,\n`;
    sql += `  entity_type text not null default '',\n`;
    sql += `  entity_id uuid,\n`;
    sql += `  action text not null default '',\n`;
    sql += `  summary text not null default '',\n`;
    sql += `  metadata jsonb not null default '{}'::jsonb,\n`;
    sql += `  performed_by uuid,\n`;
    sql += `  security_level text not null default 'standard',\n`;
    sql += `  created_at timestamptz not null default now()\n`;
    sql += `);\n\n`;

    for (const t of allTables) {
        sql += `create index if not exists idx_${t}_org on public.${t}(organization_id);\n`;
        if (!orgOnlyTables.has(t) && t !== hubTable) {
            sql += `create index if not exists idx_${t}_hub on public.${t}(${hubFk});\n`;
        }
    }
    sql += "\n";

    sql += `do $$\ndeclare tbl text;\nbegin\n  foreach tbl in array array[\n    '${tablesForTriggers.join("','")}'\n  ]\n  loop\n    execute format('drop trigger if exists trg_%I_updated_at on public.%I', tbl, tbl);\n    execute format('create trigger trg_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()', tbl, tbl);\n  end loop;\nend $$;\n\n`;

    for (const t of allTables) {
        sql += `alter table public.${t} enable row level security;\n`;
    }
    sql += "\n";

    sql += `do $$\ndeclare tbl text;\nbegin\n  foreach tbl in array array[\n    '${allTables.join("','")}'\n  ]\n  loop\n    execute format('drop policy if exists %I_select on public.%I', tbl, tbl);\n    execute format('create policy %I_select on public.%I for select using (public.is_organization_member(organization_id))', tbl, tbl);\n    execute format('drop policy if exists %I_insert on public.%I', tbl, tbl);\n    execute format('create policy %I_insert on public.%I for insert with check (public.is_organization_member(organization_id))', tbl, tbl);\n    execute format('drop policy if exists %I_update on public.%I', tbl, tbl);\n    execute format('create policy %I_update on public.%I for update using (public.is_organization_member(organization_id)) with check (public.is_organization_member(organization_id))', tbl, tbl);\n    execute format('drop policy if exists %I_delete on public.%I', tbl, tbl);\n    execute format('create policy %I_delete on public.%I for delete using (public.is_organization_member(organization_id))', tbl, tbl);\n  end loop;\nend $$;\n\n`;

    sql += `insert into public.permissions (key, description, resource)\nvalues\n`;
    sql += `  ('${PREFIX}.view', 'View enterprise governance platform data', '${permResource}'),\n`;
    sql += `  ('${PREFIX}.manage', 'Manage governance, compliance, audit, data governance, risk, and dashboard outputs', '${permResource}'),\n`;
    sql += `  ('${PREFIX}.approve', 'Approve enterprise governance gates and actions', '${permResource}'),\n`;
    sql += `  ('${PREFIX}.admin', 'Administer enterprise governance platform', '${permResource}')\n`;
    sql += `on conflict (key) do update set description = excluded.description, resource = excluded.resource;\n`;
    return sql;
}

function buildSeed() {
    const org = "11111111-1111-1111-1111-111111111111";
    const hubId = "00780078-0078-0078-0078-007800780101";
    let sql = `insert into public.ai_orchestration_agents (id, organization_id, name, agent_type, workflow_agent_id, provider_id, model_route_id, capabilities, status)
values
  ('a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a348', '${org}', 'Enterprise Governance Platform Orchestrator', 'enterprise_governance_platform', null, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a201', '["governance","compliance","audit","data_governance","risk","dashboard"]'::jsonb, 'active')
on conflict (id) do nothing;

`;
    sql += `insert into public.ai_sessions (id, organization_id, agent_id, session_key, module_source, entity_type, entity_id, context, status, expires_at)
values
  ('a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a548', '${org}', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a348', 'northstar-enterprise-governance-001', 'enterprise_governance_platform', 'governance_hub', '${hubId}', '{"objective":"Unified enterprise governance platform"}'::jsonb, 'active', '2026-12-31 23:59:59+00')
on conflict (id) do nothing;

`;
    sql += `insert into public.egp_governance_hubs (id, organization_id, hub_key, hub_name, environment, governance_tier, status)
values ('${hubId}', '${org}', 'northstar-enterprise-governance', 'Northstar Enterprise Governance Hub', 'production', 'enterprise', 'active')
on conflict (id) do nothing;

`;
    sql += `insert into public.egp_organization_governance (id, organization_id, hub_id, governance_key, governance_name, governance_status, status)
values ('04800100-0480-0480-0480-048001000101', '${org}', '${hubId}', 'gov-org-0908', 'Organization Governance', 'active', 'active')
on conflict (id) do nothing;

`;
    sql += `insert into public.egp_governance_policies (id, organization_id, hub_id, policy_key, policy_name, policy_status, status)
values ('04810101-0481-0481-0481-048101010201', '${org}', '${hubId}', 'gov-policy-0908', 'Governance Policy', 'active', 'active')
on conflict (id) do nothing;

`;
    sql += `insert into public.egp_governance_framework (id, organization_id, hub_id, framework_key, framework_name, framework_status, status)
values ('04820102-0482-0482-0482-048201020301', '${org}', '${hubId}', 'gov-framework-0908', 'Governance Framework', 'active', 'active')
on conflict (id) do nothing;

`;
    sql += `insert into public.egp_governance_reviews (id, organization_id, hub_id, review_key, review_title, review_status, status)
values ('04830103-0483-0483-0483-048301030401', '${org}', '${hubId}', 'gov-review-0908', 'Governance Review', 'scheduled', 'active')
on conflict (id) do nothing;

`;
    sql += `insert into public.egp_governance_dashboards (id, organization_id, hub_id, dashboard_key, dashboard_name, dashboard_status, status)
values ('04840104-0484-0484-0484-048401040501', '${org}', '${hubId}', 'gov-dash-0908', 'Governance Dashboard', 'active', 'active')
on conflict (id) do nothing;

`;
    sql += `insert into public.egp_compliance_framework (id, organization_id, hub_id, framework_key, framework_name, framework_status, status)
values ('04850105-0485-0485-0485-048501050601', '${org}', '${hubId}', 'comp-framework-0908', 'Compliance Framework', 'active', 'active')
on conflict (id) do nothing;

`;
    sql += `insert into public.egp_compliance_controls (id, organization_id, hub_id, control_key, control_name, control_status, status)
values ('04860106-0486-0486-0486-048601060701', '${org}', '${hubId}', 'comp-control-0908', 'Compliance Control', 'active', 'active')
on conflict (id) do nothing;

`;
    sql += `insert into public.egp_compliance_evidence (id, organization_id, hub_id, evidence_key, evidence_title, evidence_status, status)
values ('04870107-0487-0487-0487-048701070801', '${org}', '${hubId}', 'comp-evidence-0908', 'Compliance Evidence', 'pending', 'active')
on conflict (id) do nothing;

`;
    sql += `insert into public.egp_compliance_reports (id, organization_id, hub_id, report_key, report_title, report_status, status)
values ('04880108-0488-0488-0488-048801080901', '${org}', '${hubId}', 'comp-report-0908', 'Compliance Report', 'draft', 'active')
on conflict (id) do nothing;

`;
    sql += `insert into public.egp_compliance_calendar (id, organization_id, hub_id, calendar_key, calendar_name, calendar_status, status)
values ('04890109-0489-0489-0489-048901090a01', '${org}', '${hubId}', 'comp-calendar-0908', 'Compliance Calendar', 'active', 'active')
on conflict (id) do nothing;

`;
    sql += `insert into public.egp_audit_center (id, organization_id, hub_id, audit_key, audit_name, audit_status, status)
values ('048a010a-048a-048a-048a-048a010a0b01', '${org}', '${hubId}', 'audit-center-0908', 'Audit Center', 'planned', 'active')
on conflict (id) do nothing;

`;
    sql += `insert into public.egp_audit_findings (id, organization_id, hub_id, finding_key, finding_title, finding_severity, status)
values ('048b010b-048b-048b-048b-048b010b0c01', '${org}', '${hubId}', 'audit-finding-0908', 'Audit Finding', 'medium', 'active')
on conflict (id) do nothing;

`;
    sql += `insert into public.egp_corrective_actions (id, organization_id, hub_id, action_key, action_title, action_status, status)
values ('048c010c-048c-048c-048c-048c010c0d01', '${org}', '${hubId}', 'corrective-0908', 'Corrective Action', 'open', 'active')
on conflict (id) do nothing;

`;
    sql += `insert into public.egp_audit_evidence (id, organization_id, hub_id, evidence_key, evidence_title, evidence_status, status)
values ('048d010d-048d-048d-048d-048d010d0e01', '${org}', '${hubId}', 'audit-evidence-0908', 'Audit Evidence', 'pending', 'active')
on conflict (id) do nothing;

`;
    sql += `insert into public.egp_audit_analytics (id, organization_id, hub_id, analytics_key, analytics_name, analytics_score, status)
values ('048e010e-048e-048e-048e-048e010e0f01', '${org}', '${hubId}', 'audit-analytics-0908', 'Audit Analytics', 88.00, 'active')
on conflict (id) do nothing;

`;
    sql += `insert into public.egp_data_classification (id, organization_id, hub_id, classification_key, classification_name, classification_level, status)
values ('048f010f-048f-048f-048f-048f010f1001', '${org}', '${hubId}', 'data-class-0908', 'Data Classification', 'internal', 'active')
on conflict (id) do nothing;

`;
    sql += `insert into public.egp_retention_policies (id, organization_id, hub_id, policy_key, policy_name, policy_status, status)
values ('04900110-0490-0490-0490-049001101101', '${org}', '${hubId}', 'retention-0908', 'Retention Policy', 'active', 'active')
on conflict (id) do nothing;

`;
    sql += `insert into public.egp_data_lifecycle (id, organization_id, hub_id, lifecycle_key, lifecycle_name, lifecycle_stage, status)
values ('04910111-0491-0491-0491-049101111201', '${org}', '${hubId}', 'data-lifecycle-0908', 'Data Lifecycle', 'active', 'active')
on conflict (id) do nothing;

`;
    sql += `insert into public.egp_data_ownership (id, organization_id, hub_id, ownership_key, ownership_name, ownership_status, status)
values ('04920112-0492-0492-0492-049201121301', '${org}', '${hubId}', 'data-owner-0908', 'Data Ownership', 'active', 'active')
on conflict (id) do nothing;

`;
    sql += `insert into public.egp_data_quality (id, organization_id, hub_id, quality_key, quality_name, quality_score, status)
values ('04930113-0493-0493-0493-049301131401', '${org}', '${hubId}', 'data-quality-0908', 'Data Quality', 100.00, 'active')
on conflict (id) do nothing;

`;
    sql += `insert into public.egp_risk_register (id, organization_id, hub_id, risk_key, risk_title, risk_severity, status)
values ('04940114-0494-0494-0494-049401141501', '${org}', '${hubId}', 'risk-reg-0908', 'Enterprise Risk', 'medium', 'active')
on conflict (id) do nothing;

`;
    sql += `insert into public.egp_risk_assessment (id, organization_id, hub_id, assessment_key, assessment_title, assessment_score, status)
values ('04950115-0495-0495-0495-049501151601', '${org}', '${hubId}', 'risk-assess-0908', 'Risk Assessment', 75.00, 'active')
on conflict (id) do nothing;

`;
    sql += `insert into public.egp_risk_mitigation (id, organization_id, hub_id, mitigation_key, mitigation_title, mitigation_status, status)
values ('04960116-0496-0496-0496-049601161701', '${org}', '${hubId}', 'risk-mitigate-0908', 'Risk Mitigation', 'planned', 'active')
on conflict (id) do nothing;

`;
    sql += `insert into public.egp_risk_monitoring (id, organization_id, hub_id, monitoring_key, monitoring_name, monitoring_status, status)
values ('04970117-0497-0497-0497-049701171801', '${org}', '${hubId}', 'risk-monitor-0908', 'Risk Monitoring', 'active', 'active')
on conflict (id) do nothing;

`;
    sql += `insert into public.egp_business_continuity (id, organization_id, hub_id, continuity_key, continuity_name, continuity_status, status)
values ('04980118-0498-0498-0498-049801181901', '${org}', '${hubId}', 'bcp-0908', 'Business Continuity', 'active', 'active')
on conflict (id) do nothing;

`;
    sql += `insert into public.egp_governance_metrics (id, organization_id, metrics_key, governance_health_score, compliance_score, enterprise_risk_score, audit_summary_score, data_governance_health_score, overall_governance_score, status)
values ('04990119-0499-0499-0499-049901191a01', '${org}', 'egp-metrics-0908', 92.00, 94.50, 18.00, 91.00, 89.00, 91.25, 'active')
on conflict (id) do nothing;

`;
    sql += `insert into public.egp_governance_health (id, organization_id, health_key, overall_score, disaster_recovery_mode, governance_status, compliance_status, audit_status, data_governance_status, security_status, summary, status)
values ('049a011a-049a-049a-049a-049a011a1b01', '${org}', 'egp-health-0908', 91.00, false, 'healthy', 'healthy', 'healthy', 'healthy', 'healthy', 'Enterprise governance platform operational', 'healthy')
on conflict (id) do nothing;

`;
    sql += `insert into public.egp_compliance_dashboards (id, organization_id, hub_id, dashboard_key, dashboard_name, dashboard_status, status)
values ('049b011b-049b-049b-049b-049b011b1c01', '${org}', '${hubId}', 'comp-dash-0908', 'Compliance Dashboard', 'active', 'active')
on conflict (id) do nothing;

`;
    sql += `insert into public.egp_mission_progress (id, organization_id, hub_id, progress_key, progress_name, progress_percent, status)
values ('049c011c-049c-049c-049c-049c011c1d01', '${org}', '${hubId}', 'mission-progress-0908', 'Governance Mission', 82.50, 'active')
on conflict (id) do nothing;

`;
    sql += `insert into public.egp_governance_failures (id, organization_id, hub_id, failure_key, failure_type, error_code, error_message, status)
values ('049d011d-049d-049d-049d-049d011d1d01', '${org}', '${hubId}', 'fail-gov-0908', 'governance', 'GOV_SYNC_FAIL', 'Governance sync failed', 'open')
on conflict (id) do nothing;

`;
    sql += `insert into public.egp_audit_logs (id, organization_id, entity_type, action, summary, security_level)
values ('049e011e-049e-049e-049e-049e011e1e01', '${org}', 'governance_hub', 'seed', 'Enterprise governance platform seed data loaded', 'standard')
on conflict (id) do nothing;
`;
    return sql;
}

function buildRepositories() {
    const dbTypes = entities.map((e) => `Db${Pascal}${e.pascal}`).concat([`Db${Pascal}AuditLog`]);
    let sql = `import type {\n    ${dbTypes.join(",\n    ")},\n} from "@/src/modules/database/types/platform";\n`;
    sql += `import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";\n`;
    sql += `import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";\n\n`;
    sql += `abstract class OrgEgpRepository<T> extends BaseRepository<T> {\n`;
    sql += `    async listByOrganization(organizationId: string, query: RepositoryQuery = {}): Promise<T[]> {\n        const client = getRepositoryClient();\n        if (!client) return [];\n        const normalized = this.buildQuery(query);\n        const { data, error } = await client.from(this.table).select("*").eq("organization_id", organizationId).order(normalized.orderBy, { ascending: normalized.orderDirection === "asc" }).range(normalized.offset, normalized.offset + normalized.limit - 1);\n        mapRepositoryError(error, \`Failed to list \${this.table}\`);\n        return (data ?? []) as T[];\n    }\n\n    async getById(id: string): Promise<T | null> {\n        const client = getRepositoryClient();\n        if (!client) return null;\n        const { data, error } = await client.from(this.table).select("*").eq("id", id).maybeSingle();\n        mapRepositoryError(error, \`Failed to get \${this.table}\`);\n        return (data as T | null) ?? null;\n    }\n\n    async create(input: Record<string, unknown>): Promise<T | null> {\n        const client = getRepositoryClient();\n        if (!client) return null;\n        const { data, error } = await client.from(this.table).insert(input).select("*").maybeSingle();\n        mapRepositoryError(error, \`Failed to create \${this.table}\`);\n        return (data as T | null) ?? null;\n    }\n\n    async update(id: string, input: Record<string, unknown>): Promise<T | null> {\n        const client = getRepositoryClient();\n        if (!client) return null;\n        const { data, error } = await client.from(this.table).update(input).eq("id", id).select("*").maybeSingle();\n        mapRepositoryError(error, \`Failed to update \${this.table}\`);\n        return (data as T | null) ?? null;\n    }\n\n    async delete(id: string): Promise<boolean> {\n        const client = getRepositoryClient();\n        if (!client) return false;\n        const { error } = await client.from(this.table).delete().eq("id", id);\n        mapRepositoryError(error, \`Failed to delete \${this.table}\`);\n        return !error;\n    }\n}\n\n`;
    for (const e of entities) {
        sql += `export class ${Pascal}${e.pascal}Repository extends OrgEgpRepository<Db${Pascal}${e.pascal}> { protected table = "${e.table}"; }\n`;
    }
    sql += `export class ${Pascal}AuditLogRepository extends OrgEgpRepository<Db${Pascal}AuditLog> { protected table = "${PREFIX}_audit_logs"; }\n`;
    return sql;
}

function buildDbTypes() {
    let types = "";
    for (const e of entities) {
        const isHub = e.table === hubTable;
        const isOrgOnly = e.orgOnly || orgOnlyTables.has(e.table);
        types += `export interface Db${Pascal}${e.pascal} {\n    id: string;\n    organization_id: string;\n`;
        if (!isHub && !isOrgOnly) types += `    ${hubFk}: string;\n`;
        const cols = e.sqlExtra.split("\n").map((l) => l.trim().replace(/,$/, ""));
        for (const col of cols) {
            const [name, ...rest] = col.split(" ");
            const sqlType = rest.join(" ");
            let tsType = "string";
            if (sqlType.includes("integer") || sqlType.includes("numeric")) tsType = "number";
            if (sqlType.includes("boolean")) tsType = "boolean";
            if (sqlType.includes("jsonb")) tsType = "Record<string, unknown>";
            if (sqlType.includes("timestamptz") || sqlType.includes(" date")) tsType = "string";
            const opt = sqlType.includes("not null") ? "" : "?";
            types += `    ${name}${opt}: ${tsType};\n`;
        }
        types += `    status: string;\n`;
        if (e.table !== `${PREFIX}_audit_logs`) {
            types += `    created_at: string;\n    updated_at: string;\n`;
        }
        types += `}\n\n`;
    }
    types += `export interface Db${Pascal}AuditLog {\n    id: string;\n    organization_id: string;\n    entity_type: string;\n    entity_id?: string | null;\n    action: string;\n    summary: string;\n    metadata: Record<string, unknown>;\n    performed_by?: string | null;\n    security_level: string;\n    created_at: string;\n}\n`;
    return types;
}

const migrationPath = join(root, "supabase/migrations/202608020048_enterprise_governance_platform.sql");
const seedPath = join(root, "supabase/seed/048_enterprise_governance_platform_seed.sql");
const reposPath = join(root, "src/modules/database/repositories/enterprise-governance-platform-repositories.ts");
const platformPath = join(root, "src/modules/database/types/platform.ts");

writeFileSync(migrationPath, buildMigration(), "utf8");
writeFileSync(seedPath, buildSeed(), "utf8");
writeFileSync(reposPath, buildRepositories(), "utf8");

const platformContent = readFileSync(platformPath, "utf8");
if (!platformContent.includes("DbEgpGovernanceHub")) {
    writeFileSync(platformPath, platformContent.trimEnd() + "\n\n" + buildDbTypes(), "utf8");
}

console.log("Generated Enterprise Governance Platform artifacts:");
console.log(`  Migration: ${migrationPath}`);
console.log(`  Seed:      ${seedPath}`);
console.log(`  Repos:     ${reposPath}`);
console.log(`  Types:     ${platformPath} (appended DbAof* interfaces)`);
console.log(`  Entities:  ${entities.length} + audit_logs = ${allTables.length} tables`);
console.log("Run: node scripts/patch-enterprise-governance-platform-ui.mjs");
