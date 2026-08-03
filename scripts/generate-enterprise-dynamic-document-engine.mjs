#!/usr/bin/env node
/**
 * Generates V2 Program B Sprint 5 Enterprise Dynamic Document Engine artifacts.
 * Run: node scripts/generate-enterprise-dynamic-document-engine.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const PREFIX = "dde";
const Pascal = "Dde";
const camel = "dde";
const permResource = "enterprise_dynamic_document_engine";

const hubTable = `${PREFIX}_document_hubs`;
const hubFk = "hub_id";
const orgOnlyTables = new Set([`${PREFIX}_document_metrics`, `${PREFIX}_document_health`, `${PREFIX}_audit_logs`]);

const entities = [
    { tab: "documentHubs", plural: "documentHubs", singular: "DocumentHub", pascal: "DocumentHub", db: `${camel}DocumentHubs`, table: hubTable, hubField: false, orgOnly: false, fields: [{ name: "hubKey", type: "string" }, { name: "hubName", type: "string" }, { name: "environment", type: "string" }], display: { title: "hubName", sub: "hubKey" }, sqlExtra: "hub_key text not null,\n  hub_name text not null,\n  environment text not null default 'production'" },
    { tab: "documentTypes", plural: "documentTypes", singular: "DocumentType", pascal: "DocumentType", db: `${camel}DocumentTypes`, table: `${PREFIX}_document_types`, fields: [{ name: "typeKey", type: "string" }, { name: "typeName", type: "string" }, { name: "typeCategory", type: "string" }], display: { title: "typeName", sub: "typeCategory" }, sqlExtra: "type_key text not null,\n  type_name text not null default '',\n  type_category text not null default 'general',\n  description text not null default ''" },
    { tab: "documentCategories", plural: "documentCategories", singular: "DocumentCategory", pascal: "DocumentCategory", db: `${camel}DocumentCategories`, table: `${PREFIX}_document_categories`, fields: [{ name: "categoryKey", type: "string" }, { name: "categoryName", type: "string" }, { name: "categoryType", type: "string" }], display: { title: "categoryName", sub: "categoryType" }, sqlExtra: "category_key text not null,\n  category_name text not null default '',\n  category_type text not null default 'general',\n  description text not null default ''" },
    { tab: "documentTemplates", plural: "documentTemplates", singular: "DocumentTemplate", pascal: "DocumentTemplate", db: `${camel}DocumentTemplates`, table: `${PREFIX}_document_templates`, fields: [{ name: "templateKey", type: "string" }, { name: "templateName", type: "string" }, { name: "templateType", type: "string" }], display: { title: "templateName", sub: "templateType" }, sqlExtra: "template_key text not null,\n  template_name text not null default '',\n  template_type text not null default 'standard',\n  description text not null default ''" },
    { tab: "documentVersions", plural: "documentVersions", singular: "DocumentVersion", pascal: "DocumentVersion", db: `${camel}DocumentVersions`, table: `${PREFIX}_document_versions`, fields: [{ name: "versionKey", type: "string" }, { name: "versionNumber", type: "string" }, { name: "releaseChannel", type: "select", options: "RELEASE_CHANNEL_OPTIONS" }], display: { title: "versionNumber", sub: "releaseChannel" }, sqlExtra: "version_key text not null,\n  version_number text not null default '',\n  release_channel text not null default 'stable',\n  published_at timestamptz" },
    { tab: "templateHeaders", plural: "templateHeaders", singular: "TemplateHeader", pascal: "TemplateHeader", db: `${camel}TemplateHeaders`, table: `${PREFIX}_template_headers`, fields: [{ name: "headerKey", type: "string" }, { name: "headerName", type: "string" }, { name: "headerContent", type: "string" }], display: { title: "headerName", sub: "headerKey" }, sqlExtra: "header_key text not null,\n  header_name text not null default '',\n  header_content text not null default '',\n  position text not null default 'top'" },
    { tab: "templateFooters", plural: "templateFooters", singular: "TemplateFooter", pascal: "TemplateFooter", db: `${camel}TemplateFooters`, table: `${PREFIX}_template_footers`, fields: [{ name: "footerKey", type: "string" }, { name: "footerName", type: "string" }, { name: "footerContent", type: "string" }], display: { title: "footerName", sub: "footerKey" }, sqlExtra: "footer_key text not null,\n  footer_name text not null default '',\n  footer_content text not null default '',\n  position text not null default 'bottom'" },
    { tab: "templateSections", plural: "templateSections", singular: "TemplateSection", pascal: "TemplateSection", db: `${camel}TemplateSections`, table: `${PREFIX}_template_sections`, fields: [{ name: "sectionKey", type: "string" }, { name: "sectionName", type: "string" }, { name: "sectionType", type: "string" }], display: { title: "sectionName", sub: "sectionType" }, sqlExtra: "section_key text not null,\n  section_name text not null default '',\n  section_type text not null default 'body',\n  section_order integer not null default 0" },
    { tab: "templateVariables", plural: "templateVariables", singular: "TemplateVariable", pascal: "TemplateVariable", db: `${camel}TemplateVariables`, table: `${PREFIX}_template_variables`, fields: [{ name: "variableKey", type: "string" }, { name: "variableName", type: "string" }, { name: "variableType", type: "string" }], display: { title: "variableName", sub: "variableType" }, sqlExtra: "variable_key text not null,\n  variable_name text not null default '',\n  variable_type text not null default 'string',\n  default_value text not null default ''" },
    { tab: "pdfGenerations", plural: "pdfGenerations", singular: "PdfGeneration", pascal: "PdfGeneration", db: `${camel}PdfGenerations`, table: `${PREFIX}_pdf_generations`, fields: [{ name: "generationKey", type: "string" }, { name: "generationName", type: "string" }, { name: "generationStatus", type: "string" }], display: { title: "generationName", sub: "generationStatus" }, sqlExtra: "generation_key text not null,\n  generation_name text not null default '',\n  generation_status text not null default 'pending',\n  started_at timestamptz not null default now()" },
    { tab: "htmlGenerations", plural: "htmlGenerations", singular: "HtmlGeneration", pascal: "HtmlGeneration", db: `${camel}HtmlGenerations`, table: `${PREFIX}_html_generations`, fields: [{ name: "generationKey", type: "string" }, { name: "generationName", type: "string" }, { name: "generationStatus", type: "string" }], display: { title: "generationName", sub: "generationStatus" }, sqlExtra: "generation_key text not null,\n  generation_name text not null default '',\n  generation_status text not null default 'pending',\n  started_at timestamptz not null default now()" },
    { tab: "exportJobs", plural: "exportJobs", singular: "ExportJob", pascal: "ExportJob", db: `${camel}ExportJobs`, table: `${PREFIX}_export_jobs`, fields: [{ name: "jobKey", type: "string" }, { name: "jobName", type: "string" }, { name: "jobStatus", type: "string" }], display: { title: "jobName", sub: "jobStatus" }, sqlExtra: "job_key text not null,\n  job_name text not null default '',\n  job_status text not null default 'pending',\n  export_format text not null default 'pdf'" },
    { tab: "batchGenerations", plural: "batchGenerations", singular: "BatchGeneration", pascal: "BatchGeneration", db: `${camel}BatchGenerations`, table: `${PREFIX}_batch_generations`, fields: [{ name: "batchKey", type: "string" }, { name: "batchName", type: "string" }, { name: "batchStatus", type: "string" }], display: { title: "batchName", sub: "batchStatus" }, sqlExtra: "batch_key text not null,\n  batch_name text not null default '',\n  batch_status text not null default 'pending',\n  total_count integer not null default 0" },
    { tab: "electronicSignatures", plural: "electronicSignatures", singular: "ElectronicSignature", pascal: "ElectronicSignature", db: `${camel}ElectronicSignatures`, table: `${PREFIX}_electronic_signatures`, fields: [{ name: "signatureKey", type: "string" }, { name: "signatureName", type: "string" }, { name: "signatureStatus", type: "string" }], display: { title: "signatureName", sub: "signatureStatus" }, sqlExtra: "signature_key text not null,\n  signature_name text not null default '',\n  signature_status text not null default 'pending',\n  signed_at timestamptz" },
    { tab: "approvalSignatures", plural: "approvalSignatures", singular: "ApprovalSignature", pascal: "ApprovalSignature", db: `${camel}ApprovalSignatures`, table: `${PREFIX}_approval_signatures`, fields: [{ name: "signatureKey", type: "string" }, { name: "signatureName", type: "string" }, { name: "signatureStatus", type: "string" }], display: { title: "signatureName", sub: "signatureStatus" }, sqlExtra: "signature_key text not null,\n  signature_name text not null default '',\n  signature_status text not null default 'pending',\n  approved_at timestamptz" },
    { tab: "signatureVerifications", plural: "signatureVerifications", singular: "SignatureVerification", pascal: "SignatureVerification", db: `${camel}SignatureVerifications`, table: `${PREFIX}_signature_verifications`, fields: [{ name: "verificationKey", type: "string" }, { name: "verificationStatus", type: "string" }, { name: "verificationResult", type: "string" }], display: { title: "verificationKey", sub: "verificationStatus" }, sqlExtra: "verification_key text not null,\n  verification_status text not null default 'pending',\n  verification_result text not null default '',\n  verified_at timestamptz" },
    { tab: "signatureAuditEntries", plural: "signatureAuditEntries", singular: "SignatureAuditEntry", pascal: "SignatureAuditEntry", db: `${camel}SignatureAuditEntries`, table: `${PREFIX}_signature_audit_entries`, fields: [{ name: "auditKey", type: "string" }, { name: "auditAction", type: "string" }, { name: "auditSummary", type: "string" }], display: { title: "auditKey", sub: "auditAction" }, sqlExtra: "audit_key text not null,\n  audit_action text not null default '',\n  audit_summary text not null default '',\n  recorded_at timestamptz not null default now()" },
    { tab: "versionHistories", plural: "versionHistories", singular: "VersionHistory", pascal: "VersionHistory", db: `${camel}VersionHistories`, table: `${PREFIX}_version_histories`, fields: [{ name: "historyKey", type: "string" }, { name: "historyVersion", type: "string" }, { name: "historySummary", type: "string" }], display: { title: "historyKey", sub: "historyVersion" }, sqlExtra: "history_key text not null,\n  history_version text not null default '',\n  history_summary text not null default '',\n  recorded_at timestamptz not null default now()" },
    { tab: "retentionPolicies", plural: "retentionPolicies", singular: "RetentionPolicy", pascal: "RetentionPolicy", db: `${camel}RetentionPolicies`, table: `${PREFIX}_retention_policies`, fields: [{ name: "policyKey", type: "string" }, { name: "policyName", type: "string" }, { name: "retentionDays", type: "number" }], display: { title: "policyName", sub: "retentionDays" }, sqlExtra: "policy_key text not null,\n  policy_name text not null default '',\n  retention_days integer not null default 365,\n  policy_type text not null default 'standard'" },
    { tab: "archiveRecords", plural: "archiveRecords", singular: "ArchiveRecord", pascal: "ArchiveRecord", db: `${camel}ArchiveRecords`, table: `${PREFIX}_archive_records`, fields: [{ name: "archiveKey", type: "string" }, { name: "archiveName", type: "string" }, { name: "archiveStatus", type: "string" }], display: { title: "archiveName", sub: "archiveStatus" }, sqlExtra: "archive_key text not null,\n  archive_name text not null default '',\n  archive_status text not null default 'pending',\n  archived_at timestamptz" },
    { tab: "sharingPolicies", plural: "sharingPolicies", singular: "SharingPolicy", pascal: "SharingPolicy", db: `${camel}SharingPolicies`, table: `${PREFIX}_sharing_policies`, fields: [{ name: "policyKey", type: "string" }, { name: "policyName", type: "string" }, { name: "sharingScope", type: "string" }], display: { title: "policyName", sub: "sharingScope" }, sqlExtra: "policy_key text not null,\n  policy_name text not null default '',\n  sharing_scope text not null default 'organization',\n  access_level text not null default 'read'" },
    { tab: "emailDeliveries", plural: "emailDeliveries", singular: "EmailDelivery", pascal: "EmailDelivery", db: `${camel}EmailDeliveries`, table: `${PREFIX}_email_deliveries`, fields: [{ name: "deliveryKey", type: "string" }, { name: "deliveryName", type: "string" }, { name: "deliveryStatus", type: "string" }], display: { title: "deliveryName", sub: "deliveryStatus" }, sqlExtra: "delivery_key text not null,\n  delivery_name text not null default '',\n  delivery_status text not null default 'pending',\n  recipient_email text not null default ''" },
    { tab: "downloadDeliveries", plural: "downloadDeliveries", singular: "DownloadDelivery", pascal: "DownloadDelivery", db: `${camel}DownloadDeliveries`, table: `${PREFIX}_download_deliveries`, fields: [{ name: "deliveryKey", type: "string" }, { name: "deliveryName", type: "string" }, { name: "deliveryStatus", type: "string" }], display: { title: "deliveryName", sub: "deliveryStatus" }, sqlExtra: "delivery_key text not null,\n  delivery_name text not null default '',\n  delivery_status text not null default 'pending',\n  download_url text not null default ''" },
    { tab: "webhookDeliveries", plural: "webhookDeliveries", singular: "WebhookDelivery", pascal: "WebhookDelivery", db: `${camel}WebhookDeliveries`, table: `${PREFIX}_webhook_deliveries`, fields: [{ name: "deliveryKey", type: "string" }, { name: "deliveryName", type: "string" }, { name: "deliveryStatus", type: "string" }], display: { title: "deliveryName", sub: "deliveryStatus" }, sqlExtra: "delivery_key text not null,\n  delivery_name text not null default '',\n  delivery_status text not null default 'pending',\n  webhook_url text not null default ''" },
    { tab: "generationAnalytics", plural: "generationAnalytics", singular: "GenerationAnalytics", pascal: "GenerationAnalytics", db: `${camel}GenerationAnalytics`, table: `${PREFIX}_generation_analytics`, fields: [{ name: "analyticsKey", type: "string" }, { name: "analyticsType", type: "string" }, { name: "analyticsScore", type: "number" }], display: { title: "analyticsKey", sub: "analyticsType" }, sqlExtra: "analytics_key text not null,\n  analytics_type text not null default 'generation',\n  analytics_score numeric(5, 2) not null default 0,\n  metric_date date not null default current_date" },
    { tab: "deliveryAnalytics", plural: "deliveryAnalytics", singular: "DeliveryAnalytics", pascal: "DeliveryAnalytics", db: `${camel}DeliveryAnalytics`, table: `${PREFIX}_delivery_analytics`, fields: [{ name: "analyticsKey", type: "string" }, { name: "analyticsType", type: "string" }, { name: "analyticsScore", type: "number" }], display: { title: "analyticsKey", sub: "analyticsType" }, sqlExtra: "analytics_key text not null,\n  analytics_type text not null default 'delivery',\n  analytics_score numeric(5, 2) not null default 0,\n  metric_date date not null default current_date" },
    { tab: "storageAnalytics", plural: "storageAnalytics", singular: "StorageAnalytics", pascal: "StorageAnalytics", db: `${camel}StorageAnalytics`, table: `${PREFIX}_storage_analytics`, fields: [{ name: "analyticsKey", type: "string" }, { name: "analyticsType", type: "string" }, { name: "analyticsScore", type: "number" }], display: { title: "analyticsKey", sub: "analyticsType" }, sqlExtra: "analytics_key text not null,\n  analytics_type text not null default 'storage',\n  analytics_score numeric(5, 2) not null default 0,\n  metric_date date not null default current_date" },
    { tab: "documentMetrics", plural: "documentMetrics", singular: "DocumentMetric", pascal: "DocumentMetric", db: `${camel}DocumentMetrics`, table: `${PREFIX}_document_metrics`, hubField: false, orgOnly: true, fields: [{ name: "metricsKey", type: "string" }, { name: "generatedCount", type: "number" }, { name: "overallDocumentScore", type: "number" }], display: { title: "metricsKey", sub: "overallDocumentScore" }, sqlExtra: "metrics_key text not null,\n  metric_date date not null default current_date,\n  generated_count integer not null default 0,\n  download_count integer not null default 0,\n  delivery_success_rate numeric(5, 2) not null default 100,\n  failure_count integer not null default 0,\n  signature_pending_count integer not null default 0,\n  storage_usage_mb numeric(10, 2) not null default 0,\n  overall_document_score numeric(5, 2) not null default 100" },
    { tab: "documentHealth", plural: "documentHealth", singular: "DocumentHealth", pascal: "DocumentHealth", db: `${camel}DocumentHealth`, table: `${PREFIX}_document_health`, hubField: false, orgOnly: true, fields: [{ name: "healthKey", type: "string" }, { name: "overallScore", type: "number" }, { name: "disasterRecoveryMode", type: "boolean" }], display: { title: "healthKey", sub: "overallScore" }, sqlExtra: "health_key text not null,\n  health_date date not null default current_date,\n  overall_score numeric(5, 2) not null default 100,\n  disaster_recovery_mode boolean not null default false,\n  pending_signatures_count integer not null default 0,\n  delivery_queue_depth integer not null default 0,\n  framework_health_status text not null default 'healthy',\n  summary text not null default ''" },
    { tab: "pendingSignatures", plural: "pendingSignatures", singular: "PendingSignature", pascal: "PendingSignature", db: `${camel}PendingSignatures`, table: `${PREFIX}_pending_signatures`, fields: [{ name: "signatureKey", type: "string" }, { name: "signatureName", type: "string" }, { name: "signatureStatus", type: "string" }], display: { title: "signatureName", sub: "signatureStatus" }, sqlExtra: "signature_key text not null,\n  signature_name text not null default '',\n  signature_status text not null default 'pending',\n  requested_at timestamptz not null default now()" },
    { tab: "documentFailures", plural: "documentFailures", singular: "DocumentFailure", pascal: "DocumentFailure", db: `${camel}DocumentFailures`, table: `${PREFIX}_document_failures`, fields: [{ name: "failureKey", type: "string" }, { name: "failureType", type: "string" }], display: { title: "failureKey", sub: "failureType" }, sqlExtra: "failure_key text not null,\n  failure_type text not null default 'generation',\n  error_code text not null default '',\n  error_message text not null default '',\n  failed_at timestamptz not null default now(),\n  resolved_at timestamptz" },
];

const allTables = [...entities.map((e) => e.table), `${PREFIX}_audit_logs`];
const tablesForTriggers = allTables.filter((t) => t !== `${PREFIX}_audit_logs`);

function buildMigration() {
    let sql = "-- V2 Program B Sprint 5: Enterprise Dynamic Document Engine\n\n";
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
    sql += `  ('${PREFIX}.view', 'View enterprise dynamic document engine data', '${permResource}'),\n`;
    sql += `  ('${PREFIX}.manage', 'Manage document registry, template engine, generation, signature, storage, delivery, and framework outputs', '${permResource}'),\n`;
    sql += `  ('${PREFIX}.approve', 'Approve document signatures and approval gates', '${permResource}'),\n`;
    sql += `  ('${PREFIX}.admin', 'Administer enterprise dynamic document engine governance', '${permResource}')\n`;
    sql += `on conflict (key) do update set description = excluded.description, resource = excluded.resource;\n`;
    return sql;
}

function buildSeed() {
    const org = "11111111-1111-1111-1111-111111111111";
    const hubId = "006d006d-006d-006d-006d-006d006d0101";
    let sql = `insert into public.ai_orchestration_agents (id, organization_id, name, agent_type, workflow_agent_id, provider_id, model_route_id, capabilities, status)\nvalues\n  ('a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a337', '${org}', 'Enterprise Dynamic Document Orchestrator', 'enterprise_dynamic_document_engine', null, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a201', '["document_registry","template_engine","generation_engine","digital_signature","storage_engine","delivery_engine","document_analytics","document_dashboard"]'::jsonb, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.ai_sessions (id, organization_id, agent_id, session_key, module_source, entity_type, entity_id, context, status, expires_at)\nvalues\n  ('a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a537', '${org}', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a337', 'northstar-document-engine-001', 'enterprise_dynamic_document_engine', 'document_hub', '${hubId}', '{"objective":"Enterprise dynamic document engine for northstar operational documents"}'::jsonb, 'active', '2026-12-31 23:59:59+00')\non conflict (id) do nothing;\n\n`;
    sql += `-- M0 Document Hub\n`;
    sql += `insert into public.dde_document_hubs (id, organization_id, hub_key, hub_name, environment, status)\nvalues ('${hubId}', '${org}', 'northstar-document-engine', 'Northstar Document Engine Hub', 'production', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M1 Document Registry\n`;
    sql += `insert into public.dde_document_types (id, organization_id, hub_id, type_key, type_name, type_category, status)\nvalues ('006e006e-006e-006e-006e-006e006e0201', '${org}', '${hubId}', 'type-invoice-0804', 'Invoice Document', 'financial', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.dde_document_categories (id, organization_id, hub_id, category_key, category_name, category_type, status)\nvalues ('006f006f-006f-006f-006f-006f006f0301', '${org}', '${hubId}', 'cat-ops-0804', 'Operations', 'operational', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.dde_document_templates (id, organization_id, hub_id, template_key, template_name, template_type, status)\nvalues ('00700070-0070-0070-0070-007000700401', '${org}', '${hubId}', 'tpl-std-0804', 'Standard Invoice Template', 'standard', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.dde_document_versions (id, organization_id, hub_id, version_key, version_number, release_channel, status)\nvalues ('00710071-0071-0071-0071-007100710501', '${org}', '${hubId}', 'ver-1-0-0', '1.0.0', 'stable', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M2 Template Engine\n`;
    sql += `insert into public.dde_template_headers (id, organization_id, hub_id, header_key, header_name, header_content, status)\nvalues ('00720072-0072-0072-0072-007200720601', '${org}', '${hubId}', 'hdr-logo-0804', 'Company Logo Header', 'Logo placeholder', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.dde_template_footers (id, organization_id, hub_id, footer_key, footer_name, footer_content, status)\nvalues ('00730073-0073-0073-0073-007300730701', '${org}', '${hubId}', 'ftr-legal-0804', 'Legal Footer', 'Terms and conditions', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.dde_template_sections (id, organization_id, hub_id, section_key, section_name, section_type, status)\nvalues ('00740074-0074-0074-0074-007400740801', '${org}', '${hubId}', 'sec-body-0804', 'Body Section', 'body', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.dde_template_variables (id, organization_id, hub_id, variable_key, variable_name, variable_type, status)\nvalues ('00750075-0075-0075-0075-007500750901', '${org}', '${hubId}', 'var-amount-0804', 'Amount Variable', 'number', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M3 Generation Engine\n`;
    sql += `insert into public.dde_pdf_generations (id, organization_id, hub_id, generation_key, generation_name, generation_status, status)\nvalues ('00760076-0076-0076-0076-007600760a01', '${org}', '${hubId}', 'gen-pdf-0804', 'Invoice PDF Generation #42', 'running', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.dde_html_generations (id, organization_id, hub_id, generation_key, generation_name, generation_status, status)\nvalues ('00770077-0077-0077-0077-007700770b01', '${org}', '${hubId}', 'gen-html-0804', 'Invoice HTML Generation', 'completed', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.dde_export_jobs (id, organization_id, hub_id, job_key, job_name, job_status, status)\nvalues ('00780078-0078-0078-0078-007800780c01', '${org}', '${hubId}', 'job-export-0804', 'Bulk Export Job', 'pending', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.dde_batch_generations (id, organization_id, hub_id, batch_key, batch_name, batch_status, status)\nvalues ('00790079-0079-0079-0079-007900790d01', '${org}', '${hubId}', 'batch-gen-0804', 'Monthly Batch Generation', 'running', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M4 Digital Signature\n`;
    sql += `insert into public.dde_electronic_signatures (id, organization_id, hub_id, signature_key, signature_name, signature_status, status)\nvalues ('007a007a-007a-007a-007a-007a007a0e01', '${org}', '${hubId}', 'sig-elect-0804', 'Electronic Signature', 'pending', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.dde_approval_signatures (id, organization_id, hub_id, signature_key, signature_name, signature_status, status)\nvalues ('007b007b-007b-007b-007b-007b007b0f01', '${org}', '${hubId}', 'sig-approve-0804', 'Manager Approval Signature', 'pending', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.dde_signature_verifications (id, organization_id, hub_id, verification_key, verification_status, verification_result, status)\nvalues ('007c007c-007c-007c-007c-007c007c1001', '${org}', '${hubId}', 'ver-sig-0804', 'pending', '', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.dde_signature_audit_entries (id, organization_id, hub_id, audit_key, audit_action, audit_summary, status)\nvalues ('007d007d-007d-007d-007d-007d007d1101', '${org}', '${hubId}', 'aud-sig-0804', 'sign', 'Signature audit entry recorded', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M5 Storage Engine\n`;
    sql += `insert into public.dde_version_histories (id, organization_id, hub_id, history_key, history_version, history_summary, status)\nvalues ('007e007e-007e-007e-007e-007e007e1201', '${org}', '${hubId}', 'hist-v1-0804', '1.0.0', 'Initial version recorded', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.dde_retention_policies (id, organization_id, hub_id, policy_key, policy_name, retention_days, status)\nvalues ('007f007f-007f-007f-007f-007f007f1301', '${org}', '${hubId}', 'pol-ret-0804', '7 Year Retention', 2555, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.dde_archive_records (id, organization_id, hub_id, archive_key, archive_name, archive_status, status)\nvalues ('00800080-0080-0080-0080-008000801401', '${org}', '${hubId}', 'arc-old-0804', 'Archived Invoice Batch', 'archived', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.dde_sharing_policies (id, organization_id, hub_id, policy_key, policy_name, sharing_scope, status)\nvalues ('00810081-0081-0081-0081-008100811501', '${org}', '${hubId}', 'pol-share-0804', 'Organization Sharing', 'organization', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M6 Delivery Engine\n`;
    sql += `insert into public.dde_email_deliveries (id, organization_id, hub_id, delivery_key, delivery_name, delivery_status, status)\nvalues ('00820082-0082-0082-0082-008200821601', '${org}', '${hubId}', 'del-email-0804', 'Email Delivery', 'pending', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.dde_download_deliveries (id, organization_id, hub_id, delivery_key, delivery_name, delivery_status, status)\nvalues ('00830083-0083-0083-0083-008300831701', '${org}', '${hubId}', 'del-dl-0804', 'Download Delivery', 'ready', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.dde_webhook_deliveries (id, organization_id, hub_id, delivery_key, delivery_name, delivery_status, status)\nvalues ('00840084-0084-0084-0084-008400841801', '${org}', '${hubId}', 'del-hook-0804', 'Webhook Delivery', 'pending', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M7 Document Analytics\n`;
    sql += `insert into public.dde_generation_analytics (id, organization_id, hub_id, analytics_key, analytics_type, analytics_score, status)\nvalues ('00850085-0085-0085-0085-008500851901', '${org}', '${hubId}', 'anly-gen-0804', 'generation', 94.50, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.dde_delivery_analytics (id, organization_id, hub_id, analytics_key, analytics_type, analytics_score, status)\nvalues ('00860086-0086-0086-0086-008600861a01', '${org}', '${hubId}', 'anly-del-0804', 'delivery', 96.00, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.dde_storage_analytics (id, organization_id, hub_id, analytics_key, analytics_type, analytics_score, status)\nvalues ('00870087-0087-0087-0087-008700871b01', '${org}', '${hubId}', 'anly-stor-0804', 'storage', 92.00, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M8 Document Dashboard\n`;
    sql += `insert into public.dde_document_metrics (id, organization_id, metrics_key, generated_count, download_count, delivery_success_rate, failure_count, signature_pending_count, storage_usage_mb, overall_document_score, status)\nvalues ('00880088-0088-0088-0088-008800881c01', '${org}', 'doc-metrics-0804', 1250, 980, 97.50, 12, 8, 512.50, 94.75, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.dde_document_health (id, organization_id, health_key, overall_score, disaster_recovery_mode, pending_signatures_count, delivery_queue_depth, framework_health_status, summary, status)\nvalues ('00890089-0089-0089-0089-008900891d01', '${org}', 'doc-health-0804', 95.00, false, 8, 3, 'healthy', 'Dynamic document engine operational', 'healthy')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.dde_pending_signatures (id, organization_id, hub_id, signature_key, signature_name, signature_status, status)\nvalues ('00900090-0090-0090-0090-009000901e01', '${org}', '${hubId}', 'sig-pend-0804', 'Pending Client Signature', 'pending', 'open')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.dde_document_failures (id, organization_id, hub_id, failure_key, failure_type, error_code, error_message, status)\nvalues ('00910091-0091-0091-0091-009100912001', '${org}', '${hubId}', 'fail-doc-0804', 'generation', 'DOC_TIMEOUT', 'Document generation timed out', 'open')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.dde_audit_logs (id, organization_id, entity_type, action, summary, security_level)\nvalues ('00920092-0092-0092-0092-009200922101', '${org}', 'document_hub', 'seed', 'Enterprise dynamic document engine seed data loaded', 'standard')\non conflict (id) do nothing;\n`;
    return sql;
}

function buildRepositories() {
    const dbTypes = entities.map((e) => `Db${Pascal}${e.pascal}`).concat([`Db${Pascal}AuditLog`]);
    let sql = `import type {\n    ${dbTypes.join(",\n    ")},\n} from "@/src/modules/database/types/platform";\n`;
    sql += `import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";\n`;
    sql += `import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";\n\n`;
    sql += `abstract class OrgDdeRepository<T> extends BaseRepository<T> {\n`;
    sql += `    async listByOrganization(organizationId: string, query: RepositoryQuery = {}): Promise<T[]> {\n        const client = getRepositoryClient();\n        if (!client) return [];\n        const normalized = this.buildQuery(query);\n        const { data, error } = await client.from(this.table).select("*").eq("organization_id", organizationId).order(normalized.orderBy, { ascending: normalized.orderDirection === "asc" }).range(normalized.offset, normalized.offset + normalized.limit - 1);\n        mapRepositoryError(error, \`Failed to list \${this.table}\`);\n        return (data ?? []) as T[];\n    }\n\n    async getById(id: string): Promise<T | null> {\n        const client = getRepositoryClient();\n        if (!client) return null;\n        const { data, error } = await client.from(this.table).select("*").eq("id", id).maybeSingle();\n        mapRepositoryError(error, \`Failed to get \${this.table}\`);\n        return (data as T | null) ?? null;\n    }\n\n    async create(input: Record<string, unknown>): Promise<T | null> {\n        const client = getRepositoryClient();\n        if (!client) return null;\n        const { data, error } = await client.from(this.table).insert(input).select("*").maybeSingle();\n        mapRepositoryError(error, \`Failed to create \${this.table}\`);\n        return (data as T | null) ?? null;\n    }\n\n    async update(id: string, input: Record<string, unknown>): Promise<T | null> {\n        const client = getRepositoryClient();\n        if (!client) return null;\n        const { data, error } = await client.from(this.table).update(input).eq("id", id).select("*").maybeSingle();\n        mapRepositoryError(error, \`Failed to update \${this.table}\`);\n        return (data as T | null) ?? null;\n    }\n\n    async delete(id: string): Promise<boolean> {\n        const client = getRepositoryClient();\n        if (!client) return false;\n        const { error } = await client.from(this.table).delete().eq("id", id);\n        mapRepositoryError(error, \`Failed to delete \${this.table}\`);\n        return !error;\n    }\n}\n\n`;
    for (const e of entities) {
        sql += `export class ${Pascal}${e.pascal}Repository extends OrgDdeRepository<Db${Pascal}${e.pascal}> { protected table = "${e.table}"; }\n`;
    }
    sql += `export class ${Pascal}AuditLogRepository extends OrgDdeRepository<Db${Pascal}AuditLog> { protected table = "${PREFIX}_audit_logs"; }\n`;
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

const migrationPath = join(root, "supabase/migrations/202608020037_enterprise_dynamic_document_engine.sql");
const seedPath = join(root, "supabase/seed/037_enterprise_dynamic_document_engine_seed.sql");
const reposPath = join(root, "src/modules/database/repositories/document-engine-repositories.ts");
const platformPath = join(root, "src/modules/database/types/platform.ts");

writeFileSync(migrationPath, buildMigration(), "utf8");
writeFileSync(seedPath, buildSeed(), "utf8");
writeFileSync(reposPath, buildRepositories(), "utf8");

const platformContent = readFileSync(platformPath, "utf8");
if (!platformContent.includes("DbDdeDocumentHub")) {
    writeFileSync(platformPath, platformContent.trimEnd() + "\n\n" + buildDbTypes(), "utf8");
}

console.log("Generated Enterprise Dynamic Document Engine artifacts:");
console.log(`  Migration: ${migrationPath}`);
console.log(`  Seed:      ${seedPath}`);
console.log(`  Repos:     ${reposPath}`);
console.log(`  Types:     ${platformPath} (appended DbDde* interfaces)`);
console.log(`  Entities:  ${entities.length} + audit_logs = ${allTables.length} tables`);
console.log("Run: node scripts/patch-document-engine-ui.mjs");
