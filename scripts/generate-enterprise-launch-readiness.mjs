#!/usr/bin/env node
/**
 * Generates Sprint 9 Enterprise Launch Readiness Platform artifacts.
 * Run: node scripts/generate-enterprise-launch-readiness.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const PREFIX = "elr";
const Pascal = "Elr";
const camel = "elr";
const permResource = "enterprise_launch_readiness_platform";

const hubTable = `${PREFIX}_readiness_hubs`;
const hubFk = "hub_id";
const orgOnlyTables = new Set([`${PREFIX}_launch_scores`, `${PREFIX}_launch_health`, `${PREFIX}_audit_logs`]);

const entities = [
    { tab: "readinessHubs", plural: "readinessHubs", singular: "ReadinessHub", pascal: "ReadinessHub", db: `${camel}ReadinessHubs`, table: hubTable, hubField: false, orgOnly: false, fields: [{ name: "hubKey", type: "string" }, { name: "hubName", type: "string" }, { name: "environment", type: "string" }], display: { title: "hubName", sub: "hubKey" }, sqlExtra: "hub_key text not null,\n  hub_name text not null,\n  environment text not null default 'production'" },
    { tab: "environmentValidations", plural: "environmentValidations", singular: "EnvironmentValidation", pascal: "EnvironmentValidation", db: `${camel}EnvironmentValidations`, table: `${PREFIX}_environment_validations`, fields: [{ name: "validationKey", type: "string" }, { name: "validationType", type: "string" }, { name: "validationScore", type: "number" }], display: { title: "validationKey", sub: "validationType" }, sqlExtra: "validation_key text not null,\n  validation_type text not null default 'infrastructure',\n  validation_score numeric(5, 2) not null default 0,\n  validation_summary text not null default '',\n  validated_at timestamptz not null default now()" },
    { tab: "configurationValidations", plural: "configurationValidations", singular: "ConfigurationValidation", pascal: "ConfigurationValidation", db: `${camel}ConfigurationValidations`, table: `${PREFIX}_configuration_validations`, fields: [{ name: "validationKey", type: "string" }, { name: "configType", type: "string" }, { name: "validationScore", type: "number" }], display: { title: "validationKey", sub: "configType" }, sqlExtra: "validation_key text not null,\n  config_type text not null default 'application',\n  validation_score numeric(5, 2) not null default 0,\n  config_ref text not null default '',\n  validated_at timestamptz not null default now()" },
    { tab: "secretsValidations", plural: "secretsValidations", singular: "SecretsValidation", pascal: "SecretsValidation", db: `${camel}SecretsValidations`, table: `${PREFIX}_secrets_validations`, fields: [{ name: "validationKey", type: "string" }, { name: "secretType", type: "string" }, { name: "validationScore", type: "number" }], display: { title: "validationKey", sub: "secretType" }, sqlExtra: "validation_key text not null,\n  secret_type text not null default 'api_key',\n  validation_score numeric(5, 2) not null default 0,\n  secret_ref text not null default '',\n  validated_at timestamptz not null default now()" },
    { tab: "deploymentPlans", plural: "deploymentPlans", singular: "DeploymentPlan", pascal: "DeploymentPlan", db: `${camel}DeploymentPlans`, table: `${PREFIX}_deployment_plans`, fields: [{ name: "planKey", type: "string" }, { name: "planName", type: "string" }, { name: "targetVersion", type: "string" }], display: { title: "planName", sub: "targetVersion" }, sqlExtra: "plan_key text not null,\n  plan_name text not null default '',\n  target_version text not null default '',\n  deployment_strategy text not null default 'rolling',\n  scheduled_at timestamptz,\n  approved_at timestamptz" },
    { tab: "rollbackPlans", plural: "rollbackPlans", singular: "RollbackPlan", pascal: "RollbackPlan", db: `${camel}RollbackPlans`, table: `${PREFIX}_rollback_plans`, fields: [{ name: "planKey", type: "string" }, { name: "rollbackVersion", type: "string" }, { name: "rollbackReason", type: "string" }], display: { title: "planKey", sub: "rollbackVersion" }, sqlExtra: "plan_key text not null,\n  rollback_version text not null default '',\n  rollback_reason text not null default '',\n  trigger_condition text not null default '',\n  prepared_at timestamptz not null default now()" },
    { tab: "versionRegistry", plural: "versionRegistry", singular: "VersionRegistry", pascal: "VersionRegistry", db: `${camel}VersionRegistry`, table: `${PREFIX}_version_registry`, fields: [{ name: "versionKey", type: "string" }, { name: "versionNumber", type: "string" }, { name: "releaseChannel", type: "select", options: "RELEASE_CHANNEL_OPTIONS" }], display: { title: "versionNumber", sub: "releaseChannel" }, sqlExtra: "version_key text not null,\n  version_number text not null default '',\n  release_channel text not null default 'stable',\n  artifact_ref text not null default '',\n  registered_at timestamptz not null default now()" },
    { tab: "releaseNotes", plural: "releaseNotes", singular: "ReleaseNote", pascal: "ReleaseNote", db: `${camel}ReleaseNotes`, table: `${PREFIX}_release_notes`, fields: [{ name: "noteKey", type: "string" }, { name: "versionRef", type: "string" }, { name: "noteSummary", type: "string" }], display: { title: "noteKey", sub: "versionRef" }, sqlExtra: "note_key text not null,\n  version_ref text not null default '',\n  note_summary text not null default '',\n  change_log jsonb not null default '[]'::jsonb,\n  published_at timestamptz" },
    { tab: "backupPolicies", plural: "backupPolicies", singular: "BackupPolicy", pascal: "BackupPolicy", db: `${camel}BackupPolicies`, table: `${PREFIX}_backup_policies`, fields: [{ name: "policyKey", type: "string" }, { name: "policyName", type: "string" }, { name: "retentionDays", type: "number" }], display: { title: "policyName", sub: "policyKey" }, sqlExtra: "policy_key text not null,\n  policy_name text not null default '',\n  retention_days integer not null default 30,\n  backup_frequency text not null default 'daily',\n  storage_target text not null default 'primary'" },
    { tab: "backupVerifications", plural: "backupVerifications", singular: "BackupVerification", pascal: "BackupVerification", db: `${camel}BackupVerifications`, table: `${PREFIX}_backup_verifications`, fields: [{ name: "verificationKey", type: "string" }, { name: "backupRef", type: "string" }, { name: "verificationScore", type: "number" }], display: { title: "verificationKey", sub: "backupRef" }, sqlExtra: "verification_key text not null,\n  backup_ref text not null default '',\n  verification_score numeric(5, 2) not null default 0,\n  verification_summary text not null default '',\n  verified_at timestamptz not null default now()" },
    { tab: "restoreVerifications", plural: "restoreVerifications", singular: "RestoreVerification", pascal: "RestoreVerification", db: `${camel}RestoreVerifications`, table: `${PREFIX}_restore_verifications`, fields: [{ name: "verificationKey", type: "string" }, { name: "restoreRef", type: "string" }, { name: "verificationScore", type: "number" }], display: { title: "verificationKey", sub: "restoreRef" }, sqlExtra: "verification_key text not null,\n  restore_ref text not null default '',\n  verification_score numeric(5, 2) not null default 0,\n  verification_summary text not null default '',\n  verified_at timestamptz not null default now()" },
    { tab: "recoveryDrills", plural: "recoveryDrills", singular: "RecoveryDrill", pascal: "RecoveryDrill", db: `${camel}RecoveryDrills`, table: `${PREFIX}_recovery_drills`, fields: [{ name: "drillKey", type: "string" }, { name: "drillType", type: "string" }, { name: "drillScore", type: "number" }], display: { title: "drillKey", sub: "drillType" }, sqlExtra: "drill_key text not null,\n  drill_type text not null default 'failover',\n  drill_score numeric(5, 2) not null default 0,\n  drill_summary text not null default '',\n  completed_at timestamptz" },
    { tab: "observabilityLogs", plural: "observabilityLogs", singular: "ObservabilityLog", pascal: "ObservabilityLog", db: `${camel}ObservabilityLogs`, table: `${PREFIX}_observability_logs`, fields: [{ name: "logKey", type: "string" }, { name: "logLevel", type: "select", options: "LOG_LEVEL_OPTIONS" }, { name: "logSource", type: "string" }], display: { title: "logKey", sub: "logLevel" }, sqlExtra: "log_key text not null,\n  log_level text not null default 'info',\n  log_source text not null default '',\n  log_message text not null default '',\n  logged_at timestamptz not null default now()" },
    { tab: "observabilityMetrics", plural: "observabilityMetrics", singular: "ObservabilityMetric", pascal: "ObservabilityMetric", db: `${camel}ObservabilityMetrics`, table: `${PREFIX}_observability_metrics`, fields: [{ name: "metricKey", type: "string" }, { name: "metricName", type: "string" }, { name: "metricValue", type: "number" }], display: { title: "metricName", sub: "metricKey" }, sqlExtra: "metric_key text not null,\n  metric_name text not null default '',\n  metric_value numeric(14, 4) not null default 0,\n  metric_unit text not null default '',\n  recorded_at timestamptz not null default now()" },
    { tab: "traceRecords", plural: "traceRecords", singular: "TraceRecord", pascal: "TraceRecord", db: `${camel}TraceRecords`, table: `${PREFIX}_trace_records`, fields: [{ name: "traceKey", type: "string" }, { name: "traceName", type: "string" }, { name: "latencyMs", type: "number" }], display: { title: "traceName", sub: "traceKey" }, sqlExtra: "trace_key text not null,\n  trace_name text not null default '',\n  latency_ms numeric(10, 2) not null default 0,\n  span_count integer not null default 0,\n  traced_at timestamptz not null default now()" },
    { tab: "slaMonitors", plural: "slaMonitors", singular: "SlaMonitor", pascal: "SlaMonitor", db: `${camel}SlaMonitors`, table: `${PREFIX}_sla_monitors`, fields: [{ name: "monitorKey", type: "string" }, { name: "slaTarget", type: "number" }, { name: "currentValue", type: "number" }], display: { title: "monitorKey", sub: "slaTarget" }, sqlExtra: "monitor_key text not null,\n  sla_target numeric(5, 2) not null default 99.9,\n  current_value numeric(5, 2) not null default 100,\n  service_ref text not null default '',\n  measured_at timestamptz not null default now()" },
    { tab: "securityChecklists", plural: "securityChecklists", singular: "SecurityChecklist", pascal: "SecurityChecklist", db: `${camel}SecurityChecklists`, table: `${PREFIX}_security_checklists`, fields: [{ name: "checklistKey", type: "string" }, { name: "checklistName", type: "string" }, { name: "completionScore", type: "number" }], display: { title: "checklistName", sub: "completionScore" }, sqlExtra: "checklist_key text not null,\n  checklist_name text not null default '',\n  completion_score numeric(5, 2) not null default 0,\n  checklist_items jsonb not null default '[]'::jsonb,\n  reviewed_at timestamptz" },
    { tab: "vulnerabilityReviews", plural: "vulnerabilityReviews", singular: "VulnerabilityReview", pascal: "VulnerabilityReview", db: `${camel}VulnerabilityReviews`, table: `${PREFIX}_vulnerability_reviews`, fields: [{ name: "reviewKey", type: "string" }, { name: "vulnerabilityRef", type: "string" }, { name: "severity", type: "select", options: "ALERT_SEVERITY_OPTIONS" }], display: { title: "reviewKey", sub: "severity" }, sqlExtra: "review_key text not null,\n  vulnerability_ref text not null default '',\n  severity text not null default 'info',\n  review_summary text not null default '',\n  reviewed_at timestamptz not null default now()" },
    { tab: "permissionAudits", plural: "permissionAudits", singular: "PermissionAudit", pascal: "PermissionAudit", db: `${camel}PermissionAudits`, table: `${PREFIX}_permission_audits`, fields: [{ name: "auditKey", type: "string" }, { name: "auditScope", type: "string" }, { name: "findingCount", type: "number" }], display: { title: "auditKey", sub: "auditScope" }, sqlExtra: "audit_key text not null,\n  audit_scope text not null default 'platform',\n  finding_count integer not null default 0,\n  audit_summary text not null default '',\n  audited_at timestamptz not null default now()" },
    { tab: "complianceReviews", plural: "complianceReviews", singular: "ComplianceReview", pascal: "ComplianceReview", db: `${camel}ComplianceReviews`, table: `${PREFIX}_compliance_reviews`, fields: [{ name: "reviewKey", type: "string" }, { name: "complianceType", type: "string" }, { name: "reviewScore", type: "number" }], display: { title: "reviewKey", sub: "complianceType" }, sqlExtra: "review_key text not null,\n  compliance_type text not null default 'soc2',\n  review_score numeric(5, 2) not null default 0,\n  review_summary text not null default '',\n  reviewed_at timestamptz not null default now()" },
    { tab: "adminGuides", plural: "adminGuides", singular: "AdminGuide", pascal: "AdminGuide", db: `${camel}AdminGuides`, table: `${PREFIX}_admin_guides`, fields: [{ name: "guideKey", type: "string" }, { name: "guideTitle", type: "string" }, { name: "guideVersion", type: "string" }], display: { title: "guideTitle", sub: "guideVersion" }, sqlExtra: "guide_key text not null,\n  guide_title text not null default '',\n  guide_version text not null default '1.0',\n  guide_content text not null default '',\n  published_at timestamptz" },
    { tab: "userGuides", plural: "userGuides", singular: "UserGuide", pascal: "UserGuide", db: `${camel}UserGuides`, table: `${PREFIX}_user_guides`, fields: [{ name: "guideKey", type: "string" }, { name: "guideTitle", type: "string" }, { name: "guideVersion", type: "string" }], display: { title: "guideTitle", sub: "guideVersion" }, sqlExtra: "guide_key text not null,\n  guide_title text not null default '',\n  guide_version text not null default '1.0',\n  guide_content text not null default '',\n  published_at timestamptz" },
    { tab: "deploymentGuides", plural: "deploymentGuides", singular: "DeploymentGuide", pascal: "DeploymentGuide", db: `${camel}DeploymentGuides`, table: `${PREFIX}_deployment_guides`, fields: [{ name: "guideKey", type: "string" }, { name: "guideTitle", type: "string" }, { name: "guideVersion", type: "string" }], display: { title: "guideTitle", sub: "guideVersion" }, sqlExtra: "guide_key text not null,\n  guide_title text not null default '',\n  guide_version text not null default '1.0',\n  guide_content text not null default '',\n  published_at timestamptz" },
    { tab: "launchScoreMetrics", plural: "launchScoreMetrics", singular: "LaunchScoreMetric", pascal: "LaunchScoreMetric", db: `${camel}LaunchScoreMetrics`, table: `${PREFIX}_launch_scores`, hubField: false, orgOnly: true, fields: [{ name: "metricsKey", type: "string" }, { name: "securityScore", type: "number" }, { name: "overallLaunchScore", type: "number" }], display: { title: "metricsKey", sub: "overallLaunchScore" }, sqlExtra: "metrics_key text not null,\n  metric_date date not null default current_date,\n  security_score numeric(5, 2) not null default 100,\n  reliability_score numeric(5, 2) not null default 100,\n  performance_score numeric(5, 2) not null default 100,\n  documentation_score numeric(5, 2) not null default 100,\n  operational_score numeric(5, 2) not null default 100,\n  overall_launch_score numeric(5, 2) not null default 100" },
    { tab: "readinessValidations", plural: "readinessValidations", singular: "ReadinessValidation", pascal: "ReadinessValidation", db: `${camel}ReadinessValidations`, table: `${PREFIX}_readiness_validations`, fields: [{ name: "validationKey", type: "string" }, { name: "validationType", type: "string" }, { name: "validationScore", type: "number" }], display: { title: "validationKey", sub: "validationType" }, sqlExtra: "validation_key text not null,\n  validation_type text not null default 'launch_gate',\n  validation_score numeric(5, 2) not null default 0,\n  validation_summary text not null default '',\n  validated_at timestamptz not null default now()" },
    { tab: "launchBlockers", plural: "launchBlockers", singular: "LaunchBlocker", pascal: "LaunchBlocker", db: `${camel}LaunchBlockers`, table: `${PREFIX}_launch_blockers`, fields: [{ name: "blockerKey", type: "string" }, { name: "blockerTitle", type: "string" }, { name: "blockerSeverity", type: "select", options: "ALERT_SEVERITY_OPTIONS" }], display: { title: "blockerTitle", sub: "blockerSeverity" }, sqlExtra: "blocker_key text not null,\n  blocker_title text not null default '',\n  blocker_severity text not null default 'warning',\n  blocker_summary text not null default '',\n  detected_at timestamptz not null default now()" },
    { tab: "scoreSnapshots", plural: "scoreSnapshots", singular: "ScoreSnapshot", pascal: "ScoreSnapshot", db: `${camel}ScoreSnapshots`, table: `${PREFIX}_score_snapshots`, fields: [{ name: "snapshotKey", type: "string" }, { name: "snapshotDate", type: "string" }, { name: "overallLaunchScore", type: "number" }], display: { title: "snapshotKey", sub: "snapshotDate" }, sqlExtra: "snapshot_key text not null,\n  snapshot_date date not null default current_date,\n  overall_launch_score numeric(5, 2) not null default 0,\n  score_breakdown jsonb not null default '{}'::jsonb,\n  captured_at timestamptz not null default now()" },
    { tab: "launchHealth", plural: "launchHealth", singular: "LaunchHealth", pascal: "LaunchHealth", db: `${camel}LaunchHealth`, table: `${PREFIX}_launch_health`, hubField: false, orgOnly: true, fields: [{ name: "healthKey", type: "string" }, { name: "overallScore", type: "number" }, { name: "disasterRecoveryMode", type: "boolean" }], display: { title: "healthKey", sub: "overallScore" }, sqlExtra: "health_key text not null,\n  health_date date not null default current_date,\n  overall_score numeric(5, 2) not null default 100,\n  disaster_recovery_mode boolean not null default false,\n  deployment_status text not null default 'ready',\n  backup_status text not null default 'healthy',\n  security_status text not null default 'healthy',\n  summary text not null default ''" },
    { tab: "criticalIssues", plural: "criticalIssues", singular: "CriticalIssue", pascal: "CriticalIssue", db: `${camel}CriticalIssues`, table: `${PREFIX}_critical_issues`, fields: [{ name: "issueKey", type: "string" }, { name: "issueTitle", type: "string" }, { name: "issueSeverity", type: "select", options: "ALERT_SEVERITY_OPTIONS" }], display: { title: "issueTitle", sub: "issueSeverity" }, sqlExtra: "issue_key text not null,\n  issue_title text not null default '',\n  issue_severity text not null default 'critical',\n  issue_summary text not null default '',\n  detected_at timestamptz not null default now()" },
    { tab: "readinessWarnings", plural: "readinessWarnings", singular: "ReadinessWarning", pascal: "ReadinessWarning", db: `${camel}ReadinessWarnings`, table: `${PREFIX}_readiness_warnings`, fields: [{ name: "warningKey", type: "string" }, { name: "warningType", type: "string" }, { name: "warningMessage", type: "string" }], display: { title: "warningKey", sub: "warningType" }, sqlExtra: "warning_key text not null,\n  warning_type text not null default 'operational',\n  warning_message text not null default '',\n  due_date date,\n  detected_at timestamptz not null default now()" },
    { tab: "launchFailures", plural: "launchFailures", singular: "LaunchFailure", pascal: "LaunchFailure", db: `${camel}LaunchFailures`, table: `${PREFIX}_launch_failures`, fields: [{ name: "failureKey", type: "string" }, { name: "failureType", type: "string" }], display: { title: "failureKey", sub: "failureType" }, sqlExtra: "failure_key text not null,\n  failure_type text not null default 'deployment',\n  error_code text not null default '',\n  error_message text not null default '',\n  failed_at timestamptz not null default now(),\n  resolved_at timestamptz" },
];

const allTables = [...entities.map((e) => e.table), `${PREFIX}_audit_logs`];
const tablesForTriggers = allTables.filter((t) => t !== `${PREFIX}_audit_logs`);

function buildMigration() {
    let sql = "-- V2 Program A Sprint 9: Enterprise Launch Readiness Platform\n\n";
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
        sql += `  id uuid primary key default uuid_generate_v4(),\n`;
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
    sql += `  id uuid primary key default uuid_generate_v4(),\n`;
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
    sql += `  ('${PREFIX}.view', 'View enterprise launch readiness platform data', '${permResource}'),\n`;
    sql += `  ('${PREFIX}.manage', 'Manage launch readiness validations, deployments, and readiness outputs', '${permResource}'),\n`;
    sql += `  ('${PREFIX}.approve', 'Approve launch readiness gates and deployment actions', '${permResource}'),\n`;
    sql += `  ('${PREFIX}.admin', 'Administer enterprise launch readiness platform governance', '${permResource}')\n`;
    sql += `on conflict (key) do update set description = excluded.description, resource = excluded.resource;\n`;
    return sql;
}

function buildSeed() {
    const org = "11111111-1111-1111-1111-111111111111";
    const hubId = "00680068-0068-0068-0068-006800680101";
    let sql = `insert into public.ai_orchestration_agents (id, organization_id, name, agent_type, workflow_agent_id, provider_id, model_route_id, capabilities, status)\nvalues\n  ('a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a332', '${org}', 'Enterprise Launch Readiness Orchestrator', 'enterprise_launch_readiness_platform', null, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a201', '["production_validation","deployment_readiness","backup_recovery","observability","security_compliance","documentation","launch_scoring","launch_dashboard"]'::jsonb, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.ai_sessions (id, organization_id, agent_id, session_key, module_source, entity_type, entity_id, context, status, expires_at)\nvalues\n  ('a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a532', '${org}', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a332', 'northstar-launch-readiness-001', 'enterprise_launch_readiness_platform', 'readiness_hub', '${hubId}', '{"objective":"Enterprise launch readiness platform for northstar production go-live"}'::jsonb, 'active', '2026-12-31 23:59:59+00')\non conflict (id) do nothing;\n\n`;
    sql += `-- M1 Production Readiness Hub\n`;
    sql += `insert into public.elr_readiness_hubs (id, organization_id, hub_key, hub_name, environment, status)\nvalues ('${hubId}', '${org}', 'northstar-launch-readiness', 'Northstar Launch Readiness Hub', 'production', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.elr_environment_validations (id, organization_id, hub_id, validation_key, validation_type, validation_score, validation_summary, status)\nvalues ('00690069-0069-0069-0069-006900690201', '${org}', '${hubId}', 'env-prod-0804', 'infrastructure', 96.50, 'All production environment checks passed', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.elr_configuration_validations (id, organization_id, hub_id, validation_key, config_type, validation_score, config_ref, status)\nvalues ('006a006a-006a-006a-006a-006a006a0301', '${org}', '${hubId}', 'cfg-app-0804', 'application', 94.00, 'app-config-prod', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.elr_secrets_validations (id, organization_id, hub_id, validation_key, secret_type, validation_score, secret_ref, status)\nvalues ('006b006b-006b-006b-006b-006b006b0401', '${org}', '${hubId}', 'sec-api-0804', 'api_key', 98.00, 'vault/api-keys', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M2 Deployment Readiness\n`;
    sql += `insert into public.elr_deployment_plans (id, organization_id, hub_id, plan_key, plan_name, target_version, deployment_strategy, status)\nvalues ('006c006c-006c-006c-006c-006c006c0501', '${org}', '${hubId}', 'deploy-v2-0804', 'Production v2.0 Rollout', '2.0.0', 'rolling', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.elr_rollback_plans (id, organization_id, hub_id, plan_key, rollback_version, rollback_reason, status)\nvalues ('006d006d-006d-006d-006d-006d006d0601', '${org}', '${hubId}', 'rollback-v1-0804', '1.9.5', 'Automated rollback if error rate exceeds threshold', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.elr_version_registry (id, organization_id, hub_id, version_key, version_number, release_channel, artifact_ref, status)\nvalues ('006e006e-006e-006e-006e-006e006e0701', '${org}', '${hubId}', 'ver-2-0-0', '2.0.0', 'stable', 'registry/northstar:2.0.0', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.elr_release_notes (id, organization_id, hub_id, note_key, version_ref, note_summary, status)\nvalues ('006f006f-006f-006f-006f-006f006f0801', '${org}', '${hubId}', 'notes-v2-0804', '2.0.0', 'Major launch readiness release with backup and observability upgrades', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M3 Backup & Recovery\n`;
    sql += `insert into public.elr_backup_policies (id, organization_id, hub_id, policy_key, policy_name, retention_days, backup_frequency, status)\nvalues ('00700070-0070-0070-0070-007000700901', '${org}', '${hubId}', 'backup-daily-0804', 'Daily Full Backup', 30, 'daily', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.elr_backup_verifications (id, organization_id, hub_id, verification_key, backup_ref, verification_score, verification_summary, status)\nvalues ('00710071-0071-0071-0071-007100710a01', '${org}', '${hubId}', 'bkp-verify-0804', 'backup-20260804', 99.00, 'Backup integrity verified', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.elr_restore_verifications (id, organization_id, hub_id, verification_key, restore_ref, verification_score, verification_summary, status)\nvalues ('00720072-0072-0072-0072-007200720b01', '${org}', '${hubId}', 'restore-verify-0804', 'restore-drill-0804', 97.50, 'Restore drill completed successfully', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.elr_recovery_drills (id, organization_id, hub_id, drill_key, drill_type, drill_score, drill_summary, status)\nvalues ('00730073-0073-0073-0073-007300730c01', '${org}', '${hubId}', 'drill-failover-0804', 'failover', 95.00, 'Regional failover drill passed', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M4 Observability\n`;
    sql += `insert into public.elr_observability_logs (id, organization_id, hub_id, log_key, log_level, log_source, log_message, status)\nvalues ('00740074-0074-0074-0074-007400740d01', '${org}', '${hubId}', 'log-health-0804', 'info', 'launch-monitor', 'All observability pipelines healthy', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.elr_observability_metrics (id, organization_id, hub_id, metric_key, metric_name, metric_value, metric_unit, status)\nvalues ('00750075-0075-0075-0075-007500750e01', '${org}', '${hubId}', 'metric-latency-0804', 'p99_latency', 120.5, 'ms', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.elr_trace_records (id, organization_id, hub_id, trace_key, trace_name, latency_ms, span_count, status)\nvalues ('00760076-0076-0076-0076-007600760f01', '${org}', '${hubId}', 'trace-api-0804', 'api-gateway-trace', 45.2, 12, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.elr_sla_monitors (id, organization_id, hub_id, monitor_key, sla_target, current_value, service_ref, status)\nvalues ('00770077-0077-0077-0077-007700771001', '${org}', '${hubId}', 'sla-uptime-0804', 99.95, 99.98, 'platform-api', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M5 Security & Compliance\n`;
    sql += `insert into public.elr_security_checklists (id, organization_id, hub_id, checklist_key, checklist_name, completion_score, status)\nvalues ('00780078-0078-0078-0078-007800781101', '${org}', '${hubId}', 'sec-checklist-0804', 'Production Security Checklist', 92.00, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.elr_vulnerability_reviews (id, organization_id, hub_id, review_key, vulnerability_ref, severity, review_summary, status)\nvalues ('00790079-0079-0079-0079-007900791201', '${org}', '${hubId}', 'vuln-review-0804', 'CVE-2026-1234', 'warning', 'Patch scheduled for next maintenance window', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.elr_permission_audits (id, organization_id, hub_id, audit_key, audit_scope, finding_count, audit_summary, status)\nvalues ('007a007a-007a-007a-007a-007a007a1301', '${org}', '${hubId}', 'perm-audit-0804', 'platform', 2, 'Two over-privileged service accounts identified', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.elr_compliance_reviews (id, organization_id, hub_id, review_key, compliance_type, review_score, review_summary, status)\nvalues ('007b007b-007b-007b-007b-007b007b1401', '${org}', '${hubId}', 'compliance-soc2-0804', 'soc2', 94.50, 'SOC2 controls validated for launch', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M6 Documentation\n`;
    sql += `insert into public.elr_admin_guides (id, organization_id, hub_id, guide_key, guide_title, guide_version, status)\nvalues ('007c007c-007c-007c-007c-007c007c1501', '${org}', '${hubId}', 'admin-guide-0804', 'Production Admin Guide', '2.0', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.elr_user_guides (id, organization_id, hub_id, guide_key, guide_title, guide_version, status)\nvalues ('007d007d-007d-007d-007d-007d007d1601', '${org}', '${hubId}', 'user-guide-0804', 'End User Launch Guide', '2.0', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.elr_deployment_guides (id, organization_id, hub_id, guide_key, guide_title, guide_version, status)\nvalues ('007e007e-007e-007e-007e-007e007e1701', '${org}', '${hubId}', 'deploy-guide-0804', 'Production Deployment Runbook', '2.0', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M7 Launch Score\n`;
    sql += `insert into public.elr_launch_scores (id, organization_id, metrics_key, security_score, reliability_score, performance_score, documentation_score, operational_score, overall_launch_score, status)\nvalues ('007f007f-007f-007f-007f-007f007f1801', '${org}', 'launch-scores-0804', 94.00, 96.50, 95.00, 91.00, 97.00, 94.75, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.elr_readiness_validations (id, organization_id, hub_id, validation_key, validation_type, validation_score, validation_summary, status)\nvalues ('00800080-0080-0080-0080-008000801901', '${org}', '${hubId}', 'readiness-gate-0804', 'launch_gate', 93.00, 'All launch gates passed except documentation review', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.elr_launch_blockers (id, organization_id, hub_id, blocker_key, blocker_title, blocker_severity, blocker_summary, status)\nvalues ('00810081-0081-0081-0081-008100811a01', '${org}', '${hubId}', 'blocker-docs-0804', 'Deployment guide review pending', 'warning', 'Admin guide needs final sign-off', 'open')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.elr_score_snapshots (id, organization_id, hub_id, snapshot_key, snapshot_date, overall_launch_score, status)\nvalues ('00820082-0082-0082-0082-008200821b01', '${org}', '${hubId}', 'snapshot-0804', current_date, 94.75, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M8 Launch Dashboard\n`;
    sql += `insert into public.elr_launch_health (id, organization_id, health_key, overall_score, disaster_recovery_mode, deployment_status, backup_status, security_status, summary, status)\nvalues ('00830083-0083-0083-0083-008300831c01', '${org}', 'launch-health-0804', 95.00, false, 'ready', 'healthy', 'healthy', 'Launch readiness platform operational', 'healthy')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.elr_critical_issues (id, organization_id, hub_id, issue_key, issue_title, issue_severity, issue_summary, status)\nvalues ('00840084-0084-0084-0084-008400841d01', '${org}', '${hubId}', 'issue-drill-0804', 'Recovery drill scheduled for tonight', 'warning', 'Ensure on-call coverage during drill window', 'open')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.elr_readiness_warnings (id, organization_id, hub_id, warning_key, warning_type, warning_message, status)\nvalues ('00850085-0085-0085-0085-008500851e01', '${org}', '${hubId}', 'warn-sla-0804', 'sla', 'SLA monitor approaching threshold for api-gateway', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.elr_launch_failures (id, organization_id, hub_id, failure_key, failure_type, error_code, error_message, status)\nvalues ('00860086-0086-0086-0086-008600862001', '${org}', '${hubId}', 'fail-deploy-0804', 'deployment', 'ROLLBACK', 'Canary deployment rolled back due to elevated error rate', 'open')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.elr_audit_logs (id, organization_id, entity_type, action, summary, security_level)\nvalues ('00870087-0087-0087-0087-008700872101', '${org}', 'readiness_hub', 'seed', 'Enterprise launch readiness platform seed data loaded', 'standard')\non conflict (id) do nothing;\n`;
    return sql;
}

function buildRepositories() {
    const dbTypes = entities.map((e) => `Db${Pascal}${e.pascal}`).concat([`Db${Pascal}AuditLog`]);
    let sql = `import type {\n    ${dbTypes.join(",\n    ")},\n} from "@/src/modules/database/types/platform";\n`;
    sql += `import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";\n`;
    sql += `import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";\n\n`;
    sql += `abstract class OrgElrRepository<T> extends BaseRepository<T> {\n`;
    sql += `    async listByOrganization(organizationId: string, query: RepositoryQuery = {}): Promise<T[]> {\n        const client = getRepositoryClient();\n        if (!client) return [];\n        const normalized = this.buildQuery(query);\n        const { data, error } = await client.from(this.table).select("*").eq("organization_id", organizationId).order(normalized.orderBy, { ascending: normalized.orderDirection === "asc" }).range(normalized.offset, normalized.offset + normalized.limit - 1);\n        mapRepositoryError(error, \`Failed to list \${this.table}\`);\n        return (data ?? []) as T[];\n    }\n\n    async getById(id: string): Promise<T | null> {\n        const client = getRepositoryClient();\n        if (!client) return null;\n        const { data, error } = await client.from(this.table).select("*").eq("id", id).maybeSingle();\n        mapRepositoryError(error, \`Failed to get \${this.table}\`);\n        return (data as T | null) ?? null;\n    }\n\n    async create(input: Record<string, unknown>): Promise<T | null> {\n        const client = getRepositoryClient();\n        if (!client) return null;\n        const { data, error } = await client.from(this.table).insert(input).select("*").maybeSingle();\n        mapRepositoryError(error, \`Failed to create \${this.table}\`);\n        return (data as T | null) ?? null;\n    }\n\n    async update(id: string, input: Record<string, unknown>): Promise<T | null> {\n        const client = getRepositoryClient();\n        if (!client) return null;\n        const { data, error } = await client.from(this.table).update(input).eq("id", id).select("*").maybeSingle();\n        mapRepositoryError(error, \`Failed to update \${this.table}\`);\n        return (data as T | null) ?? null;\n    }\n\n    async delete(id: string): Promise<boolean> {\n        const client = getRepositoryClient();\n        if (!client) return false;\n        const { error } = await client.from(this.table).delete().eq("id", id);\n        mapRepositoryError(error, \`Failed to delete \${this.table}\`);\n        return !error;\n    }\n}\n\n`;
    for (const e of entities) {
        sql += `export class ${Pascal}${e.pascal}Repository extends OrgElrRepository<Db${Pascal}${e.pascal}> { protected table = "${e.table}"; }\n`;
    }
    sql += `export class ${Pascal}AuditLogRepository extends OrgElrRepository<Db${Pascal}AuditLog> { protected table = "${PREFIX}_audit_logs"; }\n`;
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

const migrationPath = join(root, "supabase/migrations/202608020032_enterprise_launch_readiness_platform.sql");
const seedPath = join(root, "supabase/seed/032_enterprise_launch_readiness_platform_seed.sql");
const reposPath = join(root, "src/modules/database/repositories/launch-readiness-repositories.ts");
const platformPath = join(root, "src/modules/database/types/platform.ts");

writeFileSync(migrationPath, buildMigration(), "utf8");
writeFileSync(seedPath, buildSeed(), "utf8");
writeFileSync(reposPath, buildRepositories(), "utf8");

const platformContent = readFileSync(platformPath, "utf8");
if (!platformContent.includes("DbElrReadinessHub")) {
    writeFileSync(platformPath, platformContent.trimEnd() + "\n\n" + buildDbTypes(), "utf8");
}

console.log("Generated Enterprise Launch Readiness Platform artifacts:");
console.log(`  Migration: ${migrationPath}`);
console.log(`  Seed:      ${seedPath}`);
console.log(`  Repos:     ${reposPath}`);
console.log(`  Types:     ${platformPath} (appended DbElr* interfaces)`);
console.log(`  Entities:  ${entities.length} + audit_logs = ${allTables.length} tables`);
console.log("Run: node scripts/patch-launch-readiness-ui.mjs");
