#!/usr/bin/env node
/**
 * Generates V2 Launch Ready to Customer Operated Platform artifacts.
 * Run: node scripts/generate-enterprise-customer-operated-platform.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const PREFIX = "cop";
const Pascal = "Cop";
const camel = "cop";
const permResource = "customer_operated_platform";

const hubTable = `${PREFIX}_operated_hubs`;
const hubFk = "hub_id";
const orgOnlyTables = new Set([`${PREFIX}_operated_metrics`, `${PREFIX}_operated_health`, `${PREFIX}_audit_logs`]);

const entities = [
    { tab: "operatedHubs", plural: "operatedHubs", singular: "OperatedHub", pascal: "OperatedHub", db: `${camel}OperatedHubs`, table: hubTable, hubField: false, orgOnly: false, fields: [{ name: "hubKey", type: "string" }, { name: "hubName", type: "string" }, { name: "environment", type: "string" }], display: { title: "hubName", sub: "hubKey" }, sqlExtra: "hub_key text not null,\n  hub_name text not null,\n  environment text not null default 'production',\n  operated_tier text not null default 'enterprise'" },
    { tab: "signupFlows", plural: "signupFlows", singular: "SignupFlow", pascal: "SignupFlow", db: `${camel}SignupFlows`, table: `${PREFIX}_signup_flows`, fields: [{ name: "flowKey", type: "string" }, { name: "flowName", type: "string" }, { name: "flowStatus", type: "select", options: "FLOW_STATUS_OPTIONS" }], display: { title: "flowName", sub: "flowStatus" }, sqlExtra: "flow_key text not null,\n  flow_name text not null default '',\n  flow_status text not null default 'active',\n  signup_type text not null default 'self_service',\n  started_at timestamptz not null default now()" },
    { tab: "orgProvisioning", plural: "orgProvisioning", singular: "OrgProvisioning", pascal: "OrgProvisioning", db: `${camel}OrgProvisioning`, table: `${PREFIX}_org_provisioning`, fields: [{ name: "provisionKey", type: "string" }, { name: "provisionName", type: "string" }, { name: "provisionStatus", type: "select", options: "PROVISION_STATUS_OPTIONS" }], display: { title: "provisionName", sub: "provisionStatus" }, sqlExtra: "provision_key text not null,\n  provision_name text not null default '',\n  provision_status text not null default 'pending',\n  org_ref text not null default '',\n  provisioned_at timestamptz" },
    { tab: "domainOnboarding", plural: "domainOnboarding", singular: "DomainOnboarding", pascal: "DomainOnboarding", db: `${camel}DomainOnboarding`, table: `${PREFIX}_domain_onboarding`, fields: [{ name: "domainKey", type: "string" }, { name: "domainName", type: "string" }, { name: "domainStatus", type: "select", options: "DOMAIN_STATUS_OPTIONS" }], display: { title: "domainName", sub: "domainStatus" }, sqlExtra: "domain_key text not null,\n  domain_name text not null default '',\n  domain_status text not null default 'pending',\n  verification_method text not null default 'dns',\n  verified_at timestamptz" },
    { tab: "emailVerifications", plural: "emailVerifications", singular: "EmailVerification", pascal: "EmailVerification", db: `${camel}EmailVerifications`, table: `${PREFIX}_email_verifications`, fields: [{ name: "verificationKey", type: "string" }, { name: "emailAddress", type: "string" }, { name: "verificationStatus", type: "select", options: "VERIFICATION_STATUS_OPTIONS" }], display: { title: "emailAddress", sub: "verificationStatus" }, sqlExtra: "verification_key text not null,\n  email_address text not null default '',\n  verification_status text not null default 'pending',\n  sent_at timestamptz not null default now(),\n  verified_at timestamptz" },
    { tab: "onboardingWizards", plural: "onboardingWizards", singular: "OnboardingWizard", pascal: "OnboardingWizard", db: `${camel}OnboardingWizards`, table: `${PREFIX}_onboarding_wizards`, fields: [{ name: "wizardKey", type: "string" }, { name: "wizardName", type: "string" }, { name: "wizardStatus", type: "select", options: "WIZARD_STATUS_OPTIONS" }], display: { title: "wizardName", sub: "wizardStatus" }, sqlExtra: "wizard_key text not null,\n  wizard_name text not null default '',\n  wizard_status text not null default 'active',\n  step_count integer not null default 0,\n  completion_percent numeric(5, 2) not null default 0" },
    { tab: "productionProfiles", plural: "productionProfiles", singular: "ProductionProfile", pascal: "ProductionProfile", db: `${camel}ProductionProfiles`, table: `${PREFIX}_production_profiles`, fields: [{ name: "profileKey", type: "string" }, { name: "profileName", type: "string" }, { name: "profileStatus", type: "select", options: "PROFILE_STATUS_OPTIONS" }], display: { title: "profileName", sub: "profileStatus" }, sqlExtra: "profile_key text not null,\n  profile_name text not null default '',\n  profile_status text not null default 'active',\n  environment text not null default 'production',\n  region text not null default ''" },
    { tab: "deploymentJobs", plural: "deploymentJobs", singular: "DeploymentJob", pascal: "DeploymentJob", db: `${camel}DeploymentJobs`, table: `${PREFIX}_deployment_jobs`, fields: [{ name: "jobKey", type: "string" }, { name: "jobName", type: "string" }, { name: "jobStatus", type: "select", options: "JOB_STATUS_OPTIONS" }], display: { title: "jobName", sub: "jobStatus" }, sqlExtra: "job_key text not null,\n  job_name text not null default '',\n  job_status text not null default 'pending',\n  target_version text not null default '',\n  started_at timestamptz" },
    { tab: "healthValidations", plural: "healthValidations", singular: "HealthValidation", pascal: "HealthValidation", db: `${camel}HealthValidations`, table: `${PREFIX}_health_validations`, fields: [{ name: "validationKey", type: "string" }, { name: "validationName", type: "string" }, { name: "validationStatus", type: "select", options: "VALIDATION_STATUS_OPTIONS" }], display: { title: "validationName", sub: "validationStatus" }, sqlExtra: "validation_key text not null,\n  validation_name text not null default '',\n  validation_status text not null default 'pending',\n  health_score numeric(5, 2) not null default 100,\n  validated_at timestamptz" },
    { tab: "rollbackAutomations", plural: "rollbackAutomations", singular: "RollbackAutomation", pascal: "RollbackAutomation", db: `${camel}RollbackAutomations`, table: `${PREFIX}_rollback_automations`, fields: [{ name: "rollbackKey", type: "string" }, { name: "rollbackName", type: "string" }, { name: "rollbackStatus", type: "select", options: "ROLLBACK_STATUS_OPTIONS" }], display: { title: "rollbackName", sub: "rollbackStatus" }, sqlExtra: "rollback_key text not null,\n  rollback_name text not null default '',\n  rollback_status text not null default 'ready',\n  from_version text not null default '',\n  to_version text not null default ''" },
    { tab: "deploymentAudits", plural: "deploymentAudits", singular: "DeploymentAudit", pascal: "DeploymentAudit", db: `${camel}DeploymentAudits`, table: `${PREFIX}_deployment_audits`, fields: [{ name: "auditKey", type: "string" }, { name: "auditName", type: "string" }, { name: "auditStatus", type: "select", options: "AUDIT_STATUS_OPTIONS" }], display: { title: "auditName", sub: "auditStatus" }, sqlExtra: "audit_key text not null,\n  audit_name text not null default '',\n  audit_status text not null default 'pending',\n  deployment_ref text not null default '',\n  audited_at timestamptz" },
    { tab: "centralLogs", plural: "centralLogs", singular: "CentralLog", pascal: "CentralLog", db: `${camel}CentralLogs`, table: `${PREFIX}_central_logs`, fields: [{ name: "logKey", type: "string" }, { name: "logSource", type: "string" }, { name: "logLevel", type: "string" }], display: { title: "logSource", sub: "logLevel" }, sqlExtra: "log_key text not null,\n  log_source text not null default '',\n  log_level text not null default 'info',\n  log_message text not null default '',\n  logged_at timestamptz not null default now()" },
    { tab: "metricsCollectors", plural: "metricsCollectors", singular: "MetricsCollector", pascal: "MetricsCollector", db: `${camel}MetricsCollectors`, table: `${PREFIX}_metrics_collectors`, fields: [{ name: "collectorKey", type: "string" }, { name: "collectorName", type: "string" }, { name: "collectorStatus", type: "select", options: "COLLECTOR_STATUS_OPTIONS" }], display: { title: "collectorName", sub: "collectorStatus" }, sqlExtra: "collector_key text not null,\n  collector_name text not null default '',\n  collector_status text not null default 'active',\n  metric_type text not null default 'counter',\n  last_scraped_at timestamptz" },
    { tab: "distributedTraces", plural: "distributedTraces", singular: "DistributedTrace", pascal: "DistributedTrace", db: `${camel}DistributedTraces`, table: `${PREFIX}_distributed_traces`, fields: [{ name: "traceKey", type: "string" }, { name: "traceName", type: "string" }, { name: "traceStatus", type: "select", options: "TRACE_STATUS_OPTIONS" }], display: { title: "traceName", sub: "traceStatus" }, sqlExtra: "trace_key text not null,\n  trace_name text not null default '',\n  trace_status text not null default 'active',\n  span_count integer not null default 0,\n  duration_ms integer not null default 0" },
    { tab: "alertRules", plural: "alertRules", singular: "AlertRule", pascal: "AlertRule", db: `${camel}AlertRules`, table: `${PREFIX}_alert_rules`, fields: [{ name: "ruleKey", type: "string" }, { name: "ruleName", type: "string" }, { name: "severity", type: "select", options: "ALERT_SEVERITY_OPTIONS" }], display: { title: "ruleName", sub: "severity" }, sqlExtra: "rule_key text not null,\n  rule_name text not null default '',\n  severity text not null default 'warning',\n  threshold_value numeric(12, 2) not null default 0,\n  rule_type text not null default 'threshold'" },
    { tab: "incidentTimelines", plural: "incidentTimelines", singular: "IncidentTimeline", pascal: "IncidentTimeline", db: `${camel}IncidentTimelines`, table: `${PREFIX}_incident_timelines`, fields: [{ name: "incidentKey", type: "string" }, { name: "incidentTitle", type: "string" }, { name: "incidentStatus", type: "select", options: "INCIDENT_STATUS_OPTIONS" }], display: { title: "incidentTitle", sub: "incidentStatus" }, sqlExtra: "incident_key text not null,\n  incident_title text not null default '',\n  incident_status text not null default 'open',\n  severity text not null default 'medium',\n  opened_at timestamptz not null default now()" },
    { tab: "backupSchedulers", plural: "backupSchedulers", singular: "BackupScheduler", pascal: "BackupScheduler", db: `${camel}BackupSchedulers`, table: `${PREFIX}_backup_schedulers`, fields: [{ name: "scheduleKey", type: "string" }, { name: "scheduleName", type: "string" }, { name: "scheduleStatus", type: "select", options: "SCHEDULE_STATUS_OPTIONS" }], display: { title: "scheduleName", sub: "scheduleStatus" }, sqlExtra: "schedule_key text not null,\n  schedule_name text not null default '',\n  schedule_status text not null default 'active',\n  cron_expression text not null default '0 2 * * *',\n  retention_days integer not null default 30" },
    { tab: "restoreValidations", plural: "restoreValidations", singular: "RestoreValidation", pascal: "RestoreValidation", db: `${camel}RestoreValidations`, table: `${PREFIX}_restore_validations`, fields: [{ name: "restoreKey", type: "string" }, { name: "restoreName", type: "string" }, { name: "restoreStatus", type: "select", options: "RESTORE_STATUS_OPTIONS" }], display: { title: "restoreName", sub: "restoreStatus" }, sqlExtra: "restore_key text not null,\n  restore_name text not null default '',\n  restore_status text not null default 'pending',\n  backup_ref text not null default '',\n  validated_at timestamptz" },
    { tab: "maintenanceModes", plural: "maintenanceModes", singular: "MaintenanceMode", pascal: "MaintenanceMode", db: `${camel}MaintenanceModes`, table: `${PREFIX}_maintenance_modes`, fields: [{ name: "maintenanceKey", type: "string" }, { name: "maintenanceName", type: "string" }, { name: "maintenanceStatus", type: "select", options: "MAINTENANCE_STATUS_OPTIONS" }], display: { title: "maintenanceName", sub: "maintenanceStatus" }, sqlExtra: "maintenance_key text not null,\n  maintenance_name text not null default '',\n  maintenance_status text not null default 'scheduled',\n  starts_at timestamptz,\n  ends_at timestamptz" },
    { tab: "featureFlagOps", plural: "featureFlagOps", singular: "FeatureFlagOp", pascal: "FeatureFlagOp", db: `${camel}FeatureFlagOps`, table: `${PREFIX}_feature_flag_ops`, fields: [{ name: "flagKey", type: "string" }, { name: "flagName", type: "string" }, { name: "flagStatus", type: "select", options: "FLAG_STATUS_OPTIONS" }], display: { title: "flagName", sub: "flagStatus" }, sqlExtra: "flag_key text not null,\n  flag_name text not null default '',\n  flag_status text not null default 'disabled',\n  rollout_percent numeric(5, 2) not null default 0,\n  flag_type text not null default 'boolean'" },
    { tab: "platformDiagnostics", plural: "platformDiagnostics", singular: "PlatformDiagnostic", pascal: "PlatformDiagnostic", db: `${camel}PlatformDiagnostics`, table: `${PREFIX}_platform_diagnostics`, fields: [{ name: "diagnosticKey", type: "string" }, { name: "diagnosticName", type: "string" }, { name: "diagnosticStatus", type: "select", options: "DIAGNOSTIC_STATUS_OPTIONS" }], display: { title: "diagnosticName", sub: "diagnosticStatus" }, sqlExtra: "diagnostic_key text not null,\n  diagnostic_name text not null default '',\n  diagnostic_status text not null default 'pending',\n  diagnostic_type text not null default 'health_check',\n  ran_at timestamptz" },
    { tab: "betaOrganizations", plural: "betaOrganizations", singular: "BetaOrganization", pascal: "BetaOrganization", db: `${camel}BetaOrganizations`, table: `${PREFIX}_beta_organizations`, fields: [{ name: "orgKey", type: "string" }, { name: "orgName", type: "string" }, { name: "betaStatus", type: "select", options: "BETA_STATUS_OPTIONS" }], display: { title: "orgName", sub: "betaStatus" }, sqlExtra: "org_key text not null,\n  org_name text not null default '',\n  beta_status text not null default 'invited',\n  cohort_ref text not null default '',\n  enrolled_at timestamptz" },
    { tab: "betaInvitations", plural: "betaInvitations", singular: "BetaInvitation", pascal: "BetaInvitation", db: `${camel}BetaInvitations`, table: `${PREFIX}_beta_invitations`, fields: [{ name: "invitationKey", type: "string" }, { name: "inviteeEmail", type: "string" }, { name: "invitationStatus", type: "select", options: "INVITATION_STATUS_OPTIONS" }], display: { title: "inviteeEmail", sub: "invitationStatus" }, sqlExtra: "invitation_key text not null,\n  invitee_email text not null default '',\n  invitation_status text not null default 'pending',\n  cohort_ref text not null default '',\n  sent_at timestamptz not null default now()" },
    { tab: "feedbackCollection", plural: "feedbackCollection", singular: "FeedbackCollection", pascal: "FeedbackCollection", db: `${camel}FeedbackCollection`, table: `${PREFIX}_feedback_collection`, fields: [{ name: "feedbackKey", type: "string" }, { name: "feedbackTitle", type: "string" }, { name: "feedbackType", type: "string" }], display: { title: "feedbackTitle", sub: "feedbackType" }, sqlExtra: "feedback_key text not null,\n  feedback_title text not null default '',\n  feedback_type text not null default 'general',\n  rating numeric(3, 1) not null default 0,\n  collected_at timestamptz not null default now()" },
    { tab: "featureRequests", plural: "featureRequests", singular: "FeatureRequest", pascal: "FeatureRequest", db: `${camel}FeatureRequests`, table: `${PREFIX}_feature_requests`, fields: [{ name: "requestKey", type: "string" }, { name: "requestTitle", type: "string" }, { name: "requestStatus", type: "select", options: "REQUEST_STATUS_OPTIONS" }], display: { title: "requestTitle", sub: "requestStatus" }, sqlExtra: "request_key text not null,\n  request_title text not null default '',\n  request_status text not null default 'submitted',\n  priority text not null default 'normal',\n  submitted_at timestamptz not null default now()" },
    { tab: "bugReports", plural: "bugReports", singular: "BugReport", pascal: "BugReport", db: `${camel}BugReports`, table: `${PREFIX}_bug_reports`, fields: [{ name: "bugKey", type: "string" }, { name: "bugTitle", type: "string" }, { name: "bugStatus", type: "select", options: "BUG_STATUS_OPTIONS" }], display: { title: "bugTitle", sub: "bugStatus" }, sqlExtra: "bug_key text not null,\n  bug_title text not null default '',\n  bug_status text not null default 'open',\n  severity text not null default 'medium',\n  reported_at timestamptz not null default now()" },
    { tab: "releaseChannels", plural: "releaseChannels", singular: "ReleaseChannel", pascal: "ReleaseChannel", db: `${camel}ReleaseChannels`, table: `${PREFIX}_release_channels`, fields: [{ name: "channelKey", type: "string" }, { name: "channelName", type: "string" }, { name: "channelStatus", type: "select", options: "CHANNEL_STATUS_OPTIONS" }], display: { title: "channelName", sub: "channelStatus" }, sqlExtra: "channel_key text not null,\n  channel_name text not null default '',\n  channel_status text not null default 'active',\n  release_version text not null default '1.0.0',\n  published_at timestamptz" },
    { tab: "operatedMetrics", plural: "operatedMetrics", singular: "OperatedMetric", pascal: "OperatedMetric", db: `${camel}OperatedMetrics`, table: `${PREFIX}_operated_metrics`, hubField: false, orgOnly: true, fields: [{ name: "metricsKey", type: "string" }, { name: "productionStatusScore", type: "number" }, { name: "overallOperatedScore", type: "number" }], display: { title: "metricsKey", sub: "overallOperatedScore" }, sqlExtra: "metrics_key text not null,\n  metric_date date not null default current_date,\n  production_status_score numeric(5, 2) not null default 100,\n  onboarding_completion_rate numeric(5, 2) not null default 0,\n  revenue_today numeric(12, 2) not null default 0,\n  active_incident_count integer not null default 0,\n  pending_approval_count integer not null default 0,\n  platform_availability_score numeric(5, 2) not null default 100,\n  customer_satisfaction_score numeric(5, 2) not null default 100,\n  overall_operated_score numeric(5, 2) not null default 100" },
    { tab: "operatedHealth", plural: "operatedHealth", singular: "OperatedHealth", pascal: "OperatedHealth", db: `${camel}OperatedHealth`, table: `${PREFIX}_operated_health`, hubField: false, orgOnly: true, fields: [{ name: "healthKey", type: "string" }, { name: "overallScore", type: "number" }, { name: "disasterRecoveryMode", type: "boolean" }], display: { title: "healthKey", sub: "overallScore" }, sqlExtra: "health_key text not null,\n  health_date date not null default current_date,\n  overall_score numeric(5, 2) not null default 100,\n  disaster_recovery_mode boolean not null default false,\n  production_status text not null default 'healthy',\n  onboarding_status text not null default 'healthy',\n  observability_status text not null default 'healthy',\n  security_status text not null default 'healthy',\n  summary text not null default ''" },
    { tab: "executiveBriefings", plural: "executiveBriefings", singular: "ExecutiveBriefing", pascal: "ExecutiveBriefing", db: `${camel}ExecutiveBriefings`, table: `${PREFIX}_executive_briefings`, fields: [{ name: "briefingKey", type: "string" }, { name: "briefingTitle", type: "string" }, { name: "briefingType", type: "string" }], display: { title: "briefingTitle", sub: "briefingType" }, sqlExtra: "briefing_key text not null,\n  briefing_title text not null default '',\n  briefing_type text not null default 'daily',\n  briefing_date date not null default current_date,\n  summary text not null default ''" },
    { tab: "platformFailures", plural: "platformFailures", singular: "PlatformFailure", pascal: "PlatformFailure", db: `${camel}PlatformFailures`, table: `${PREFIX}_platform_failures`, fields: [{ name: "failureKey", type: "string" }, { name: "failureType", type: "string" }], display: { title: "failureKey", sub: "failureType" }, sqlExtra: "failure_key text not null,\n  failure_type text not null default 'deployment',\n  error_code text not null default '',\n  error_message text not null default '',\n  failed_at timestamptz not null default now(),\n  resolved_at timestamptz" },
];

const allTables = [...entities.map((e) => e.table), `${PREFIX}_audit_logs`];
const tablesForTriggers = allTables.filter((t) => t !== `${PREFIX}_audit_logs`);

function buildMigration() {
    let sql = "-- V2 Launch Ready to Customer Operated Platform\n\n";
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
    sql += `  ('${PREFIX}.view', 'View customer operated platform data', '${permResource}'),\n`;
    sql += `  ('${PREFIX}.manage', 'Manage onboarding, production, observability, operations, beta, and dashboard outputs', '${permResource}'),\n`;
    sql += `  ('${PREFIX}.approve', 'Approve customer operated platform gates and actions', '${permResource}'),\n`;
    sql += `  ('${PREFIX}.admin', 'Administer customer operated platform governance', '${permResource}')\n`;
    sql += `on conflict (key) do update set description = excluded.description, resource = excluded.resource;\n`;
    return sql;
}

function buildSeed() {
    const org = "11111111-1111-1111-1111-111111111111";
    const hubId = "00750075-0075-0075-0075-007500750101";
    let sql = `insert into public.ai_orchestration_agents (id, organization_id, name, agent_type, workflow_agent_id, provider_id, model_route_id, capabilities, status)\nvalues\n  ('a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a345', '${org}', 'Customer Operated Platform Orchestrator', 'customer_operated_platform', null, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a201', '["onboarding","production","observability","operations","beta","dashboard"]'::jsonb, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.ai_sessions (id, organization_id, agent_id, session_key, module_source, entity_type, entity_id, context, status, expires_at)\nvalues\n  ('a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a545', '${org}', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a345', 'northstar-customer-operated-001', 'customer_operated_platform', 'operated_hub', '${hubId}', '{"objective":"Launch ready to customer operated platform onboarding, production, and observability"}'::jsonb, 'active', '2026-12-31 23:59:59+00')\non conflict (id) do nothing;\n\n`;
    sql += `-- G0 Operated Hub\n`;
    sql += `insert into public.cop_operated_hubs (id, organization_id, hub_key, hub_name, environment, operated_tier, status)\nvalues ('${hubId}', '${org}', 'northstar-customer-operated', 'Northstar Customer Operated Hub', 'production', 'enterprise', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- G1 Onboarding\n`;
    sql += `insert into public.cop_signup_flows (id, organization_id, hub_id, flow_key, flow_name, flow_status, status)\nvalues ('04500100-0450-0450-0450-045001000101', '${org}', '${hubId}', 'signup-flow-0905', 'Self-Service Signup', 'active', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.cop_org_provisioning (id, organization_id, hub_id, provision_key, provision_name, provision_status, status)\nvalues ('04510101-0451-0451-0451-045101010201', '${org}', '${hubId}', 'org-provision-0905', 'Org Provisioning Job', 'pending', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.cop_domain_onboarding (id, organization_id, hub_id, domain_key, domain_name, domain_status, status)\nvalues ('04520102-0452-0452-0452-045201020301', '${org}', '${hubId}', 'domain-onboard-0905', 'app.northstar.io', 'pending', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.cop_email_verifications (id, organization_id, hub_id, verification_key, email_address, verification_status, status)\nvalues ('04530103-0453-0453-0453-045301030401', '${org}', '${hubId}', 'email-verify-0905', 'admin@northstar.io', 'pending', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.cop_onboarding_wizards (id, organization_id, hub_id, wizard_key, wizard_name, wizard_status, status)\nvalues ('04540104-0454-0454-0454-045401040501', '${org}', '${hubId}', 'wizard-onboard-0905', 'Launch Onboarding Wizard', 'active', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- G2 Production\n`;
    sql += `insert into public.cop_production_profiles (id, organization_id, hub_id, profile_key, profile_name, profile_status, status)\nvalues ('04550105-0455-0455-0455-045501050601', '${org}', '${hubId}', 'prod-profile-0905', 'Production Profile', 'active', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.cop_deployment_jobs (id, organization_id, hub_id, job_key, job_name, job_status, status)\nvalues ('04560106-0456-0456-0456-045601060701', '${org}', '${hubId}', 'deploy-job-0905', 'Production Deployment', 'pending', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.cop_health_validations (id, organization_id, hub_id, validation_key, validation_name, validation_status, status)\nvalues ('04570107-0457-0457-0457-045701070801', '${org}', '${hubId}', 'health-val-0905', 'Production Health Validation', 'pending', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.cop_rollback_automations (id, organization_id, hub_id, rollback_key, rollback_name, rollback_status, status)\nvalues ('04580108-0458-0458-0458-045801080901', '${org}', '${hubId}', 'rollback-auto-0905', 'Automated Rollback', 'ready', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.cop_deployment_audits (id, organization_id, hub_id, audit_key, audit_name, audit_status, status)\nvalues ('04590109-0459-0459-0459-045901090a01', '${org}', '${hubId}', 'deploy-audit-0905', 'Deployment Audit', 'pending', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- G3 Observability\n`;
    sql += `insert into public.cop_central_logs (id, organization_id, hub_id, log_key, log_source, log_level, status)\nvalues ('045a010a-045a-045a-045a-045a010a0b01', '${org}', '${hubId}', 'log-central-0905', 'api-gateway', 'info', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.cop_metrics_collectors (id, organization_id, hub_id, collector_key, collector_name, collector_status, status)\nvalues ('045b010b-045b-045b-045b-045b010b0c01', '${org}', '${hubId}', 'metrics-col-0905', 'Platform Metrics Collector', 'active', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.cop_distributed_traces (id, organization_id, hub_id, trace_key, trace_name, trace_status, status)\nvalues ('045c010c-045c-045c-045c-045c010c0d01', '${org}', '${hubId}', 'trace-dist-0905', 'API Request Trace', 'active', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.cop_alert_rules (id, organization_id, hub_id, rule_key, rule_name, severity, status)\nvalues ('045d010d-045d-045d-045d-045d010d0e01', '${org}', '${hubId}', 'alert-rule-0905', 'High Error Rate Alert', 'warning', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.cop_incident_timelines (id, organization_id, hub_id, incident_key, incident_title, incident_status, status)\nvalues ('045e010e-045e-045e-045e-045e010e0f01', '${org}', '${hubId}', 'incident-0905', 'Production Incident', 'open', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- G4 Operations\n`;
    sql += `insert into public.cop_backup_schedulers (id, organization_id, hub_id, schedule_key, schedule_name, schedule_status, status)\nvalues ('045f010f-045f-045f-045f-045f010f1001', '${org}', '${hubId}', 'backup-sched-0905', 'Daily Backup Schedule', 'active', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.cop_restore_validations (id, organization_id, hub_id, restore_key, restore_name, restore_status, status)\nvalues ('04600110-0460-0460-0460-046001101101', '${org}', '${hubId}', 'restore-val-0905', 'Restore Validation', 'pending', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.cop_maintenance_modes (id, organization_id, hub_id, maintenance_key, maintenance_name, maintenance_status, status)\nvalues ('04610111-0461-0461-0461-046101111201', '${org}', '${hubId}', 'maint-mode-0905', 'Scheduled Maintenance', 'scheduled', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.cop_feature_flag_ops (id, organization_id, hub_id, flag_key, flag_name, flag_status, status)\nvalues ('04620112-0462-0462-0462-046201121301', '${org}', '${hubId}', 'flag-beta-0905', 'Beta Feature Flag', 'disabled', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.cop_platform_diagnostics (id, organization_id, hub_id, diagnostic_key, diagnostic_name, diagnostic_status, status)\nvalues ('04630113-0463-0463-0463-046301131401', '${org}', '${hubId}', 'diag-platform-0905', 'Platform Diagnostic', 'pending', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- G5 Beta\n`;
    sql += `insert into public.cop_beta_organizations (id, organization_id, hub_id, org_key, org_name, beta_status, status)\nvalues ('04640114-0464-0464-0464-046401141501', '${org}', '${hubId}', 'beta-org-0905', 'Northstar Beta Corp', 'invited', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.cop_beta_invitations (id, organization_id, hub_id, invitation_key, invitee_email, invitation_status, status)\nvalues ('04650115-0465-0465-0465-046501151601', '${org}', '${hubId}', 'beta-invite-0905', 'beta@northstar.io', 'pending', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.cop_feedback_collection (id, organization_id, hub_id, feedback_key, feedback_title, feedback_type, status)\nvalues ('04660116-0466-0466-0466-046601161701', '${org}', '${hubId}', 'feedback-0905', 'Beta Feedback', 'general', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.cop_feature_requests (id, organization_id, hub_id, request_key, request_title, request_status, status)\nvalues ('04670117-0467-0467-0467-046701171801', '${org}', '${hubId}', 'feature-req-0905', 'Advanced Analytics Request', 'submitted', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.cop_bug_reports (id, organization_id, hub_id, bug_key, bug_title, bug_status, status)\nvalues ('04680118-0468-0468-0468-046801181901', '${org}', '${hubId}', 'bug-report-0905', 'Login Timeout Bug', 'open', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.cop_release_channels (id, organization_id, hub_id, channel_key, channel_name, channel_status, status)\nvalues ('04690119-0469-0469-0469-046901191a01', '${org}', '${hubId}', 'release-chan-0905', 'Beta Release Channel', 'active', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- G6 Dashboard\n`;
    sql += `insert into public.cop_operated_metrics (id, organization_id, metrics_key, production_status_score, onboarding_completion_rate, revenue_today, active_incident_count, pending_approval_count, platform_availability_score, customer_satisfaction_score, overall_operated_score, status)\nvalues ('046a011a-046a-046a-046a-046a011a1b01', '${org}', 'cop-metrics-0905', 96.00, 82.50, 12500.00, 2, 5, 99.50, 94.00, 95.50, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.cop_operated_health (id, organization_id, health_key, overall_score, disaster_recovery_mode, production_status, onboarding_status, observability_status, security_status, summary, status)\nvalues ('046b011b-046b-046b-046b-046b011b1c01', '${org}', 'cop-health-0905', 95.00, false, 'healthy', 'healthy', 'healthy', 'healthy', 'Customer operated platform operational', 'healthy')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.cop_executive_briefings (id, organization_id, hub_id, briefing_key, briefing_title, briefing_type, status)\nvalues ('046c011c-046c-046c-046c-046c011c1d01', '${org}', '${hubId}', 'briefing-daily-0905', 'Daily Executive Briefing', 'daily', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.cop_platform_failures (id, organization_id, hub_id, failure_key, failure_type, error_code, error_message, status)\nvalues ('046d011d-046d-046d-046d-046d011d1e01', '${org}', '${hubId}', 'fail-deploy-0905', 'deployment', 'DEPLOY_TIMEOUT', 'Production deployment timed out', 'open')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.cop_audit_logs (id, organization_id, entity_type, action, summary, security_level)\nvalues ('046e011e-046e-046e-046e-046e011e1f01', '${org}', 'operated_hub', 'seed', 'Customer operated platform seed data loaded', 'standard')\non conflict (id) do nothing;\n`;
    return sql;
}

function buildRepositories() {
    const dbTypes = entities.map((e) => `Db${Pascal}${e.pascal}`).concat([`Db${Pascal}AuditLog`]);
    let sql = `import type {\n    ${dbTypes.join(",\n    ")},\n} from "@/src/modules/database/types/platform";\n`;
    sql += `import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";\n`;
    sql += `import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";\n\n`;
    sql += `abstract class OrgCopRepository<T> extends BaseRepository<T> {\n`;
    sql += `    async listByOrganization(organizationId: string, query: RepositoryQuery = {}): Promise<T[]> {\n        const client = getRepositoryClient();\n        if (!client) return [];\n        const normalized = this.buildQuery(query);\n        const { data, error } = await client.from(this.table).select("*").eq("organization_id", organizationId).order(normalized.orderBy, { ascending: normalized.orderDirection === "asc" }).range(normalized.offset, normalized.offset + normalized.limit - 1);\n        mapRepositoryError(error, \`Failed to list \${this.table}\`);\n        return (data ?? []) as T[];\n    }\n\n    async getById(id: string): Promise<T | null> {\n        const client = getRepositoryClient();\n        if (!client) return null;\n        const { data, error } = await client.from(this.table).select("*").eq("id", id).maybeSingle();\n        mapRepositoryError(error, \`Failed to get \${this.table}\`);\n        return (data as T | null) ?? null;\n    }\n\n    async create(input: Record<string, unknown>): Promise<T | null> {\n        const client = getRepositoryClient();\n        if (!client) return null;\n        const { data, error } = await client.from(this.table).insert(input).select("*").maybeSingle();\n        mapRepositoryError(error, \`Failed to create \${this.table}\`);\n        return (data as T | null) ?? null;\n    }\n\n    async update(id: string, input: Record<string, unknown>): Promise<T | null> {\n        const client = getRepositoryClient();\n        if (!client) return null;\n        const { data, error } = await client.from(this.table).update(input).eq("id", id).select("*").maybeSingle();\n        mapRepositoryError(error, \`Failed to update \${this.table}\`);\n        return (data as T | null) ?? null;\n    }\n\n    async delete(id: string): Promise<boolean> {\n        const client = getRepositoryClient();\n        if (!client) return false;\n        const { error } = await client.from(this.table).delete().eq("id", id);\n        mapRepositoryError(error, \`Failed to delete \${this.table}\`);\n        return !error;\n    }\n}\n\n`;
    for (const e of entities) {
        sql += `export class ${Pascal}${e.pascal}Repository extends OrgCopRepository<Db${Pascal}${e.pascal}> { protected table = "${e.table}"; }\n`;
    }
    sql += `export class ${Pascal}AuditLogRepository extends OrgCopRepository<Db${Pascal}AuditLog> { protected table = "${PREFIX}_audit_logs"; }\n`;
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

const migrationPath = join(root, "supabase/migrations/202608020045_customer_operated_platform.sql");
const seedPath = join(root, "supabase/seed/045_customer_operated_platform_seed.sql");
const reposPath = join(root, "src/modules/database/repositories/customer-operated-platform-repositories.ts");
const platformPath = join(root, "src/modules/database/types/platform.ts");

writeFileSync(migrationPath, buildMigration(), "utf8");
writeFileSync(seedPath, buildSeed(), "utf8");
writeFileSync(reposPath, buildRepositories(), "utf8");

const platformContent = readFileSync(platformPath, "utf8");
if (!platformContent.includes("DbCopOperatedHub")) {
    writeFileSync(platformPath, platformContent.trimEnd() + "\n\n" + buildDbTypes(), "utf8");
}

console.log("Generated Customer Operated Platform artifacts:");
console.log(`  Migration: ${migrationPath}`);
console.log(`  Seed:      ${seedPath}`);
console.log(`  Repos:     ${reposPath}`);
console.log(`  Types:     ${platformPath} (appended DbCop* interfaces)`);
console.log(`  Entities:  ${entities.length} + audit_logs = ${allTables.length} tables`);
console.log("Run: node scripts/patch-customer-operated-platform-ui.mjs");
