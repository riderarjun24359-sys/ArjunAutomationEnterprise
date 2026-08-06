#!/usr/bin/env node
/**
 * Generates V2 Program B Sprint 8 Enterprise Hospital Business Operating System artifacts.
 * Run: node scripts/generate-enterprise-hospital-bos.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const PREFIX = "hsp";
const Pascal = "Hsp";
const camel = "hsp";
const permResource = "enterprise_hospital_business_os";

const hubTable = `${PREFIX}_hospital_hubs`;
const hubFk = "hub_id";
const orgOnlyTables = new Set([`${PREFIX}_hospital_metrics`, `${PREFIX}_hospital_health`, `${PREFIX}_audit_logs`]);

const entities = [
    { tab: "hospitalHubs", plural: "hospitalHubs", singular: "HospitalHub", pascal: "HospitalHub", db: `${camel}HospitalHubs`, table: hubTable, hubField: false, orgOnly: false, fields: [{ name: "hubKey", type: "string" }, { name: "hubName", type: "string" }, { name: "environment", type: "string" }], display: { title: "hubName", sub: "hubKey" }, sqlExtra: "hub_key text not null,\n  hub_name text not null,\n  environment text not null default 'production',\n  hospital_code text not null default ''" },
    { tab: "campuses", plural: "campuses", singular: "Campus", pascal: "Campus", db: `${camel}Campuses`, table: `${PREFIX}_campuses`, fields: [{ name: "campusKey", type: "string" }, { name: "campusName", type: "string" }, { name: "campusType", type: "string" }], display: { title: "campusName", sub: "campusType" }, sqlExtra: "campus_key text not null,\n  campus_name text not null default '',\n  campus_type text not null default 'main',\n  address text not null default ''" },
    { tab: "departments", plural: "departments", singular: "Department", pascal: "Department", db: `${camel}Departments`, table: `${PREFIX}_departments`, fields: [{ name: "departmentKey", type: "string" }, { name: "departmentName", type: "string" }, { name: "departmentType", type: "string" }], display: { title: "departmentName", sub: "departmentType" }, sqlExtra: "department_key text not null,\n  department_name text not null default '',\n  department_type text not null default 'clinical',\n  floor_level text not null default ''" },
    { tab: "wards", plural: "wards", singular: "Ward", pascal: "Ward", db: `${camel}Wards`, table: `${PREFIX}_wards`, fields: [{ name: "wardKey", type: "string" }, { name: "wardName", type: "string" }, { name: "wardType", type: "string" }], display: { title: "wardName", sub: "wardType" }, sqlExtra: "ward_key text not null,\n  ward_name text not null default '',\n  ward_type text not null default 'general',\n  capacity integer not null default 20" },
    { tab: "hospitalBeds", plural: "hospitalBeds", singular: "HospitalBed", pascal: "HospitalBed", db: `${camel}HospitalBeds`, table: `${PREFIX}_hospital_beds`, fields: [{ name: "bedKey", type: "string" }, { name: "bedNumber", type: "string" }, { name: "bedStatus", type: "select", options: "BED_STATUS_OPTIONS" }], display: { title: "bedNumber", sub: "bedStatus" }, sqlExtra: "bed_key text not null,\n  bed_number text not null default '',\n  bed_status text not null default 'available',\n  ward_ref text not null default ''" },
    { tab: "patientRegistrations", plural: "patientRegistrations", singular: "PatientRegistration", pascal: "PatientRegistration", db: `${camel}PatientRegistrations`, table: `${PREFIX}_patient_registrations`, fields: [{ name: "registrationKey", type: "string" }, { name: "registrationName", type: "string" }, { name: "registrationStatus", type: "select", options: "REGISTRATION_STATUS_OPTIONS" }], display: { title: "registrationName", sub: "registrationStatus" }, sqlExtra: "registration_key text not null,\n  registration_name text not null default '',\n  registration_status text not null default 'pending',\n  patient_type text not null default 'outpatient',\n  registered_at timestamptz not null default now()" },
    { tab: "patientProfiles", plural: "patientProfiles", singular: "PatientProfile", pascal: "PatientProfile", db: `${camel}PatientProfiles`, table: `${PREFIX}_patient_profiles`, fields: [{ name: "profileKey", type: "string" }, { name: "profileName", type: "string" }, { name: "profileType", type: "string" }], display: { title: "profileName", sub: "profileType" }, sqlExtra: "profile_key text not null,\n  profile_name text not null default '',\n  profile_type text not null default 'regular',\n  blood_group text not null default ''" },
    { tab: "medicalHistories", plural: "medicalHistories", singular: "MedicalHistory", pascal: "MedicalHistory", db: `${camel}MedicalHistories`, table: `${PREFIX}_medical_histories`, fields: [{ name: "historyKey", type: "string" }, { name: "historyName", type: "string" }, { name: "historyType", type: "string" }], display: { title: "historyName", sub: "historyType" }, sqlExtra: "history_key text not null,\n  history_name text not null default '',\n  history_type text not null default 'general',\n  recorded_at timestamptz not null default now()" },
    { tab: "insurancePolicies", plural: "insurancePolicies", singular: "InsurancePolicy", pascal: "InsurancePolicy", db: `${camel}InsurancePolicies`, table: `${PREFIX}_insurance_policies`, fields: [{ name: "policyKey", type: "string" }, { name: "policyName", type: "string" }, { name: "policyType", type: "string" }], display: { title: "policyName", sub: "policyType" }, sqlExtra: "policy_key text not null,\n  policy_name text not null default '',\n  policy_type text not null default 'health',\n  coverage_amount numeric(12, 2) not null default 0" },
    { tab: "appointments", plural: "appointments", singular: "Appointment", pascal: "Appointment", db: `${camel}Appointments`, table: `${PREFIX}_appointments`, fields: [{ name: "appointmentKey", type: "string" }, { name: "appointmentName", type: "string" }, { name: "appointmentStatus", type: "select", options: "APPOINTMENT_STATUS_OPTIONS" }], display: { title: "appointmentName", sub: "appointmentStatus" }, sqlExtra: "appointment_key text not null,\n  appointment_name text not null default '',\n  appointment_status text not null default 'scheduled',\n  appointment_type text not null default 'consultation',\n  scheduled_at timestamptz not null default now()" },
    { tab: "opdVisits", plural: "opdVisits", singular: "OpdVisit", pascal: "OpdVisit", db: `${camel}OpdVisits`, table: `${PREFIX}_opd_visits`, fields: [{ name: "visitKey", type: "string" }, { name: "visitName", type: "string" }, { name: "visitStatus", type: "string" }], display: { title: "visitName", sub: "visitStatus" }, sqlExtra: "visit_key text not null,\n  visit_name text not null default '',\n  visit_status text not null default 'checked_in',\n  visit_type text not null default 'opd',\n  visited_at timestamptz not null default now()" },
    { tab: "ipdAdmissions", plural: "ipdAdmissions", singular: "IpdAdmission", pascal: "IpdAdmission", db: `${camel}IpdAdmissions`, table: `${PREFIX}_ipd_admissions`, fields: [{ name: "admissionKey", type: "string" }, { name: "admissionName", type: "string" }, { name: "admissionStatus", type: "select", options: "IPD_ADMISSION_STATUS_OPTIONS" }], display: { title: "admissionName", sub: "admissionStatus" }, sqlExtra: "admission_key text not null,\n  admission_name text not null default '',\n  admission_status text not null default 'admitted',\n  ward_ref text not null default '',\n  admitted_at timestamptz not null default now()" },
    { tab: "clinicalNotes", plural: "clinicalNotes", singular: "ClinicalNote", pascal: "ClinicalNote", db: `${camel}ClinicalNotes`, table: `${PREFIX}_clinical_notes`, fields: [{ name: "noteKey", type: "string" }, { name: "noteName", type: "string" }, { name: "noteType", type: "string" }], display: { title: "noteName", sub: "noteType" }, sqlExtra: "note_key text not null,\n  note_name text not null default '',\n  note_type text not null default 'operational',\n  note_content text not null default '',\n  recorded_at timestamptz not null default now()" },
    { tab: "pharmacyInventory", plural: "pharmacyInventory", singular: "PharmacyInventory", pascal: "PharmacyInventory", db: `${camel}PharmacyInventory`, table: `${PREFIX}_pharmacy_inventory`, fields: [{ name: "inventoryKey", type: "string" }, { name: "inventoryName", type: "string" }, { name: "inventoryType", type: "string" }], display: { title: "inventoryName", sub: "inventoryType" }, sqlExtra: "inventory_key text not null,\n  inventory_name text not null default '',\n  inventory_type text not null default 'medicine',\n  stock_quantity integer not null default 0" },
    { tab: "prescriptions", plural: "prescriptions", singular: "Prescription", pascal: "Prescription", db: `${camel}Prescriptions`, table: `${PREFIX}_prescriptions`, fields: [{ name: "prescriptionKey", type: "string" }, { name: "prescriptionName", type: "string" }, { name: "prescriptionStatus", type: "select", options: "PRESCRIPTION_STATUS_OPTIONS" }], display: { title: "prescriptionName", sub: "prescriptionStatus" }, sqlExtra: "prescription_key text not null,\n  prescription_name text not null default '',\n  prescription_status text not null default 'pending',\n  prescribed_at timestamptz not null default now()" },
    { tab: "labOrders", plural: "labOrders", singular: "LabOrder", pascal: "LabOrder", db: `${camel}LabOrders`, table: `${PREFIX}_lab_orders`, fields: [{ name: "orderKey", type: "string" }, { name: "orderName", type: "string" }, { name: "orderStatus", type: "string" }], display: { title: "orderName", sub: "orderStatus" }, sqlExtra: "order_key text not null,\n  order_name text not null default '',\n  order_status text not null default 'pending',\n  order_type text not null default 'blood_test',\n  ordered_at timestamptz not null default now()" },
    { tab: "labResults", plural: "labResults", singular: "LabResult", pascal: "LabResult", db: `${camel}LabResults`, table: `${PREFIX}_lab_results`, fields: [{ name: "resultKey", type: "string" }, { name: "resultName", type: "string" }, { name: "resultStatus", type: "string" }], display: { title: "resultName", sub: "resultStatus" }, sqlExtra: "result_key text not null,\n  result_name text not null default '',\n  result_status text not null default 'pending',\n  result_value text not null default '',\n  resulted_at timestamptz not null default now()" },
    { tab: "hospitalBilling", plural: "hospitalBilling", singular: "HospitalBilling", pascal: "HospitalBilling", db: `${camel}HospitalBilling`, table: `${PREFIX}_hospital_billing`, fields: [{ name: "billingKey", type: "string" }, { name: "billingName", type: "string" }, { name: "billingAmount", type: "number" }], display: { title: "billingName", sub: "billingAmount" }, sqlExtra: "billing_key text not null,\n  billing_name text not null default '',\n  billing_amount numeric(12, 2) not null default 0,\n  billing_type text not null default 'inpatient'" },
    { tab: "insuranceClaims", plural: "insuranceClaims", singular: "InsuranceClaim", pascal: "InsuranceClaim", db: `${camel}InsuranceClaims`, table: `${PREFIX}_insurance_claims`, fields: [{ name: "claimKey", type: "string" }, { name: "claimName", type: "string" }, { name: "claimStatus", type: "string" }], display: { title: "claimName", sub: "claimStatus" }, sqlExtra: "claim_key text not null,\n  claim_name text not null default '',\n  claim_status text not null default 'pending',\n  claim_amount numeric(12, 2) not null default 0,\n  submitted_at timestamptz not null default now()" },
    { tab: "hospitalInvoices", plural: "hospitalInvoices", singular: "HospitalInvoice", pascal: "HospitalInvoice", db: `${camel}HospitalInvoices`, table: `${PREFIX}_hospital_invoices`, fields: [{ name: "invoiceKey", type: "string" }, { name: "invoiceName", type: "string" }, { name: "invoiceAmount", type: "number" }], display: { title: "invoiceName", sub: "invoiceAmount" }, sqlExtra: "invoice_key text not null,\n  invoice_name text not null default '',\n  invoice_amount numeric(12, 2) not null default 0,\n  invoice_status text not null default 'pending',\n  due_date date not null default current_date" },
    { tab: "hospitalPayments", plural: "hospitalPayments", singular: "HospitalPayment", pascal: "HospitalPayment", db: `${camel}HospitalPayments`, table: `${PREFIX}_hospital_payments`, fields: [{ name: "paymentKey", type: "string" }, { name: "paymentName", type: "string" }, { name: "paymentAmount", type: "number" }], display: { title: "paymentName", sub: "paymentAmount" }, sqlExtra: "payment_key text not null,\n  payment_name text not null default '',\n  payment_amount numeric(12, 2) not null default 0,\n  payment_status text not null default 'completed',\n  paid_at timestamptz not null default now()" },
    { tab: "patientNotifications", plural: "patientNotifications", singular: "PatientNotification", pascal: "PatientNotification", db: `${camel}PatientNotifications`, table: `${PREFIX}_patient_notifications`, fields: [{ name: "notificationKey", type: "string" }, { name: "notificationTitle", type: "string" }, { name: "notificationType", type: "string" }], display: { title: "notificationTitle", sub: "notificationType" }, sqlExtra: "notification_key text not null,\n  notification_title text not null default '',\n  notification_type text not null default 'general',\n  sent_at timestamptz not null default now()" },
    { tab: "medicalReports", plural: "medicalReports", singular: "MedicalReport", pascal: "MedicalReport", db: `${camel}MedicalReports`, table: `${PREFIX}_medical_reports`, fields: [{ name: "reportKey", type: "string" }, { name: "reportName", type: "string" }, { name: "reportType", type: "string" }], display: { title: "reportName", sub: "reportType" }, sqlExtra: "report_key text not null,\n  report_name text not null default '',\n  report_type text not null default 'operational',\n  generated_at timestamptz not null default now()" },
    { tab: "patientFeedback", plural: "patientFeedback", singular: "PatientFeedback", pascal: "PatientFeedback", db: `${camel}PatientFeedback`, table: `${PREFIX}_patient_feedback`, fields: [{ name: "feedbackKey", type: "string" }, { name: "feedbackName", type: "string" }, { name: "feedbackScore", type: "number" }], display: { title: "feedbackName", sub: "feedbackScore" }, sqlExtra: "feedback_key text not null,\n  feedback_name text not null default '',\n  feedback_score numeric(3, 1) not null default 0,\n  feedback_type text not null default 'service'" },
    { tab: "admissionsAnalytics", plural: "admissionsAnalytics", singular: "AdmissionsAnalytics", pascal: "AdmissionsAnalytics", db: `${camel}AdmissionsAnalytics`, table: `${PREFIX}_admissions_analytics`, fields: [{ name: "analyticsKey", type: "string" }, { name: "analyticsType", type: "string" }, { name: "analyticsScore", type: "number" }], display: { title: "analyticsKey", sub: "analyticsType" }, sqlExtra: "analytics_key text not null,\n  analytics_type text not null default 'admissions',\n  analytics_score numeric(5, 2) not null default 0,\n  metric_date date not null default current_date" },
    { tab: "occupancyAnalytics", plural: "occupancyAnalytics", singular: "OccupancyAnalytics", pascal: "OccupancyAnalytics", db: `${camel}OccupancyAnalytics`, table: `${PREFIX}_occupancy_analytics`, fields: [{ name: "analyticsKey", type: "string" }, { name: "analyticsType", type: "string" }, { name: "analyticsScore", type: "number" }], display: { title: "analyticsKey", sub: "analyticsType" }, sqlExtra: "analytics_key text not null,\n  analytics_type text not null default 'occupancy',\n  analytics_score numeric(5, 2) not null default 0,\n  metric_date date not null default current_date" },
    { tab: "revenueAnalytics", plural: "revenueAnalytics", singular: "RevenueAnalytics", pascal: "RevenueAnalytics", db: `${camel}RevenueAnalytics`, table: `${PREFIX}_revenue_analytics`, fields: [{ name: "analyticsKey", type: "string" }, { name: "analyticsType", type: "string" }, { name: "analyticsScore", type: "number" }], display: { title: "analyticsKey", sub: "analyticsType" }, sqlExtra: "analytics_key text not null,\n  analytics_type text not null default 'revenue',\n  analytics_score numeric(5, 2) not null default 0,\n  metric_date date not null default current_date" },
    { tab: "hospitalMetrics", plural: "hospitalMetrics", singular: "HospitalMetric", pascal: "HospitalMetric", db: `${camel}HospitalMetrics`, table: `${PREFIX}_hospital_metrics`, hubField: false, orgOnly: true, fields: [{ name: "metricsKey", type: "string" }, { name: "admissionsCount", type: "number" }, { name: "overallHospitalScore", type: "number" }], display: { title: "metricsKey", sub: "overallHospitalScore" }, sqlExtra: "metrics_key text not null,\n  metric_date date not null default current_date,\n  admissions_count integer not null default 0,\n  discharge_count integer not null default 0,\n  bed_occupancy_rate numeric(5, 2) not null default 0,\n  revenue_total numeric(12, 2) not null default 0,\n  department_performance_score numeric(5, 2) not null default 0,\n  patient_satisfaction_score numeric(5, 2) not null default 0,\n  operational_health_score numeric(5, 2) not null default 0,\n  overall_hospital_score numeric(5, 2) not null default 100" },
    { tab: "hospitalHealth", plural: "hospitalHealth", singular: "HospitalHealth", pascal: "HospitalHealth", db: `${camel}HospitalHealth`, table: `${PREFIX}_hospital_health`, hubField: false, orgOnly: true, fields: [{ name: "healthKey", type: "string" }, { name: "overallScore", type: "number" }, { name: "disasterRecoveryMode", type: "boolean" }], display: { title: "healthKey", sub: "overallScore" }, sqlExtra: "health_key text not null,\n  health_date date not null default current_date,\n  overall_score numeric(5, 2) not null default 100,\n  disaster_recovery_mode boolean not null default false,\n  bed_utilization_status text not null default 'healthy',\n  financial_health_status text not null default 'healthy',\n  operational_health_status text not null default 'healthy',\n  summary text not null default ''" },
    { tab: "executiveKpis", plural: "executiveKpis", singular: "ExecutiveKpi", pascal: "ExecutiveKpi", db: `${camel}ExecutiveKpis`, table: `${PREFIX}_executive_kpis`, fields: [{ name: "kpiKey", type: "string" }, { name: "kpiName", type: "string" }, { name: "kpiScore", type: "number" }], display: { title: "kpiName", sub: "kpiScore" }, sqlExtra: "kpi_key text not null,\n  kpi_name text not null default '',\n  kpi_score numeric(5, 2) not null default 0,\n  kpi_type text not null default 'executive',\n  metric_date date not null default current_date" },
    { tab: "hospitalFailures", plural: "hospitalFailures", singular: "HospitalFailure", pascal: "HospitalFailure", db: `${camel}HospitalFailures`, table: `${PREFIX}_hospital_failures`, fields: [{ name: "failureKey", type: "string" }, { name: "failureType", type: "string" }], display: { title: "failureKey", sub: "failureType" }, sqlExtra: "failure_key text not null,\n  failure_type text not null default 'billing',\n  error_code text not null default '',\n  error_message text not null default '',\n  failed_at timestamptz not null default now(),\n  resolved_at timestamptz" },
];

const allTables = [...entities.map((e) => e.table), `${PREFIX}_audit_logs`];
const tablesForTriggers = allTables.filter((t) => t !== `${PREFIX}_audit_logs`);

function buildMigration() {
    let sql = "-- V2 Program B Sprint 8: Enterprise Hospital Business Operating System\n\n";
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
    sql += `  ('${PREFIX}.view', 'View enterprise hospital business operating system data', '${permResource}'),\n`;
    sql += `  ('${PREFIX}.manage', 'Manage hospital foundation, patient, clinical operations, pharmacy, lab, finance, and framework outputs', '${permResource}'),\n`;
    sql += `  ('${PREFIX}.approve', 'Approve hospital admissions and billing gates', '${permResource}'),\n`;
    sql += `  ('${PREFIX}.admin', 'Administer enterprise hospital business operating system governance', '${permResource}')\n`;
    sql += `on conflict (key) do update set description = excluded.description, resource = excluded.resource;\n`;
    return sql;
}

function buildSeed() {
    const org = "11111111-1111-1111-1111-111111111111";
    const hubId = "00700070-0070-0070-0070-007000700101";
    let sql = `insert into public.ai_orchestration_agents (id, organization_id, name, agent_type, workflow_agent_id, provider_id, model_route_id, capabilities, status)\nvalues\n  ('a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a340', '${org}', 'Enterprise Hospital Orchestrator', 'enterprise_hospital_business_os', null, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a201', '["hospital_foundation","patient_engine","clinical_operations","pharmacy_lab","finance_engine","hospital_analytics","hospital_dashboard"]'::jsonb, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.ai_sessions (id, organization_id, agent_id, session_key, module_source, entity_type, entity_id, context, status, expires_at)\nvalues\n  ('a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a540', '${org}', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a340', 'northstar-hospital-os-001', 'enterprise_hospital_business_os', 'hospital_hub', '${hubId}', '{"objective":"Enterprise hospital business operating system for northstar healthcare operations"}'::jsonb, 'active', '2026-12-31 23:59:59+00')\non conflict (id) do nothing;\n\n`;
    sql += `-- M0 Hospital Hub\n`;
    sql += `insert into public.hsp_hospital_hubs (id, organization_id, hub_key, hub_name, environment, hospital_code, status)\nvalues ('${hubId}', '${org}', 'northstar-hospital-os', 'Northstar Hospital OS Hub', 'production', 'HSP-0804-001', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M1 Foundation\n`;
    sql += `insert into public.hsp_campuses (id, organization_id, hub_id, campus_key, campus_name, campus_type, status)\nvalues ('02000100-0200-0200-0200-020001000201', '${org}', '${hubId}', 'campus-main-0804', 'Main Campus', 'main', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.hsp_departments (id, organization_id, hub_id, department_key, department_name, department_type, status)\nvalues ('02010101-0201-0201-0201-020101010301', '${org}', '${hubId}', 'dept-cardio-0804', 'Cardiology Department', 'clinical', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.hsp_wards (id, organization_id, hub_id, ward_key, ward_name, ward_type, status)\nvalues ('02020102-0202-0202-0202-020201020401', '${org}', '${hubId}', 'ward-general-0804', 'General Ward', 'general', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.hsp_hospital_beds (id, organization_id, hub_id, bed_key, bed_number, bed_status, ward_ref, status)\nvalues ('02030103-0203-0203-0203-020301030501', '${org}', '${hubId}', 'bed-101-0804', '101', 'available', 'ward-general-0804', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M2 Patient\n`;
    sql += `insert into public.hsp_patient_registrations (id, organization_id, hub_id, registration_key, registration_name, registration_status, status)\nvalues ('02040104-0204-0204-0204-020401040601', '${org}', '${hubId}', 'reg-smith-0804', 'Smith Patient Registration', 'pending', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.hsp_patient_profiles (id, organization_id, hub_id, profile_key, profile_name, profile_type, status)\nvalues ('02050105-0205-0205-0205-020501050701', '${org}', '${hubId}', 'pat-jones-0804', 'Jones Patient Profile', 'regular', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.hsp_medical_histories (id, organization_id, hub_id, history_key, history_name, history_type, status)\nvalues ('02060106-0206-0206-0206-020601060801', '${org}', '${hubId}', 'hist-jones-0804', 'Jones Medical History', 'general', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.hsp_insurance_policies (id, organization_id, hub_id, policy_key, policy_name, policy_type, status)\nvalues ('02070107-0207-0207-0207-020701070901', '${org}', '${hubId}', 'pol-jones-0804', 'Jones Insurance Policy', 'health', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M3 Clinical Operations\n`;
    sql += `insert into public.hsp_appointments (id, organization_id, hub_id, appointment_key, appointment_name, appointment_status, status)\nvalues ('02080108-0208-0208-0208-020801080a01', '${org}', '${hubId}', 'appt-jones-0804', 'Jones Appointment', 'scheduled', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.hsp_opd_visits (id, organization_id, hub_id, visit_key, visit_name, visit_status, status)\nvalues ('02090109-0209-0209-0209-020901090b01', '${org}', '${hubId}', 'opd-jones-0804', 'Jones OPD Visit', 'checked_in', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.hsp_ipd_admissions (id, organization_id, hub_id, admission_key, admission_name, admission_status, status)\nvalues ('020a010a-020a-020a-020a-020a010a0c01', '${org}', '${hubId}', 'ipd-jones-0804', 'Jones IPD Admission', 'admitted', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.hsp_clinical_notes (id, organization_id, hub_id, note_key, note_name, note_type, status)\nvalues ('020b010b-020b-020b-020b-020b010b0d01', '${org}', '${hubId}', 'note-jones-0804', 'Jones Clinical Note', 'operational', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M4 Pharmacy & Lab\n`;
    sql += `insert into public.hsp_pharmacy_inventory (id, organization_id, hub_id, inventory_key, inventory_name, inventory_type, status)\nvalues ('020c010c-020c-020c-020c-020c010c0e01', '${org}', '${hubId}', 'inv-paracetamol-0804', 'Paracetamol Inventory', 'medicine', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.hsp_prescriptions (id, organization_id, hub_id, prescription_key, prescription_name, prescription_status, status)\nvalues ('020d010d-020d-020d-020d-020d010d0f01', '${org}', '${hubId}', 'rx-jones-0804', 'Jones Prescription', 'pending', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.hsp_lab_orders (id, organization_id, hub_id, order_key, order_name, order_status, status)\nvalues ('020e010e-020e-020e-020e-020e010e1001', '${org}', '${hubId}', 'lab-jones-0804', 'Jones Lab Order', 'pending', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.hsp_lab_results (id, organization_id, hub_id, result_key, result_name, result_status, status)\nvalues ('020f010f-020f-020f-020f-020f010f1101', '${org}', '${hubId}', 'res-jones-0804', 'Jones Lab Result', 'pending', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M5 Finance & Billing\n`;
    sql += `insert into public.hsp_hospital_billing (id, organization_id, hub_id, billing_key, billing_name, billing_amount, status)\nvalues ('02100110-0210-0210-0210-021001101201', '${org}', '${hubId}', 'bill-jones-0804', 'Jones Hospital Billing', 15000.00, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.hsp_insurance_claims (id, organization_id, hub_id, claim_key, claim_name, claim_status, status)\nvalues ('02110111-0211-0211-0211-021101111301', '${org}', '${hubId}', 'clm-jones-0804', 'Jones Insurance Claim', 'pending', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.hsp_hospital_invoices (id, organization_id, hub_id, invoice_key, invoice_name, invoice_amount, status)\nvalues ('02120112-0212-0212-0212-021201121401', '${org}', '${hubId}', 'inv-jones-0804', 'Jones Hospital Invoice', 15000.00, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.hsp_hospital_payments (id, organization_id, hub_id, payment_key, payment_name, payment_amount, status)\nvalues ('02130113-0213-0213-0213-021301131501', '${org}', '${hubId}', 'pay-jones-0804', 'Jones Hospital Payment', 15000.00, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M6 Patient Experience\n`;
    sql += `insert into public.hsp_patient_notifications (id, organization_id, hub_id, notification_key, notification_title, notification_type, status)\nvalues ('02140114-0214-0214-0214-021401141601', '${org}', '${hubId}', 'ntf-jones-0804', 'Appointment Reminder', 'general', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.hsp_medical_reports (id, organization_id, hub_id, report_key, report_name, report_type, status)\nvalues ('02150115-0215-0215-0215-021501151701', '${org}', '${hubId}', 'rpt-jones-0804', 'Jones Medical Report', 'operational', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.hsp_patient_feedback (id, organization_id, hub_id, feedback_key, feedback_name, feedback_score, status)\nvalues ('02160116-0216-0216-0216-021601161801', '${org}', '${hubId}', 'fdb-jones-0804', 'Jones Patient Feedback', 4.5, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M7 Analytics\n`;
    sql += `insert into public.hsp_admissions_analytics (id, organization_id, hub_id, analytics_key, analytics_type, analytics_score, status)\nvalues ('02170117-0217-0217-0217-021701171901', '${org}', '${hubId}', 'anly-adm-0804', 'admissions', 94.50, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.hsp_occupancy_analytics (id, organization_id, hub_id, analytics_key, analytics_type, analytics_score, status)\nvalues ('02180118-0218-0218-0218-021801181a01', '${org}', '${hubId}', 'anly-occ-0804', 'occupancy', 88.00, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.hsp_revenue_analytics (id, organization_id, hub_id, analytics_key, analytics_type, analytics_score, status)\nvalues ('02190119-0219-0219-0219-021901191b01', '${org}', '${hubId}', 'anly-rev-0804', 'revenue', 96.00, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M8 Executive Dashboard\n`;
    sql += `insert into public.hsp_hospital_metrics (id, organization_id, metrics_key, admissions_count, discharge_count, bed_occupancy_rate, revenue_total, department_performance_score, patient_satisfaction_score, operational_health_score, overall_hospital_score, status)\nvalues ('021a011a-021a-021a-021a-021a011a1c01', '${org}', 'hsp-metrics-0804', 850, 720, 88.50, 2500000.00, 91.00, 92.50, 93.00, 95.25, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.hsp_hospital_health (id, organization_id, health_key, overall_score, disaster_recovery_mode, bed_utilization_status, financial_health_status, operational_health_status, summary, status)\nvalues ('021b011b-021b-021b-021b-021b011b1d01', '${org}', 'hsp-health-0804', 96.00, false, 'healthy', 'healthy', 'healthy', 'Hospital business operating system operational', 'healthy')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.hsp_executive_kpis (id, organization_id, hub_id, kpi_key, kpi_name, kpi_score, status)\nvalues ('021c011c-021c-021c-021c-021c011c1e01', '${org}', '${hubId}', 'kpi-exec-0804', 'Executive KPI Score', 97.50, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.hsp_hospital_failures (id, organization_id, hub_id, failure_key, failure_type, error_code, error_message, status)\nvalues ('021d011d-021d-021d-021d-021d011d1f01', '${org}', '${hubId}', 'fail-bill-0804', 'billing', 'BILL_TIMEOUT', 'Billing processing timed out', 'open')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.hsp_audit_logs (id, organization_id, entity_type, action, summary, security_level)\nvalues ('021e011e-021e-021e-021e-021e011e2001', '${org}', 'hospital_hub', 'seed', 'Enterprise hospital business operating system seed data loaded', 'standard')\non conflict (id) do nothing;\n`;
    return sql;
}

function buildRepositories() {
    const dbTypes = entities.map((e) => `Db${Pascal}${e.pascal}`).concat([`Db${Pascal}AuditLog`]);
    let sql = `import type {\n    ${dbTypes.join(",\n    ")},\n} from "@/src/modules/database/types/platform";\n`;
    sql += `import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";\n`;
    sql += `import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";\n\n`;
    sql += `abstract class OrgHspRepository<T> extends BaseRepository<T> {\n`;
    sql += `    async listByOrganization(organizationId: string, query: RepositoryQuery = {}): Promise<T[]> {\n        const client = getRepositoryClient();\n        if (!client) return [];\n        const normalized = this.buildQuery(query);\n        const { data, error } = await client.from(this.table).select("*").eq("organization_id", organizationId).order(normalized.orderBy, { ascending: normalized.orderDirection === "asc" }).range(normalized.offset, normalized.offset + normalized.limit - 1);\n        mapRepositoryError(error, \`Failed to list \${this.table}\`);\n        return (data ?? []) as T[];\n    }\n\n    async getById(id: string): Promise<T | null> {\n        const client = getRepositoryClient();\n        if (!client) return null;\n        const { data, error } = await client.from(this.table).select("*").eq("id", id).maybeSingle();\n        mapRepositoryError(error, \`Failed to get \${this.table}\`);\n        return (data as T | null) ?? null;\n    }\n\n    async create(input: Record<string, unknown>): Promise<T | null> {\n        const client = getRepositoryClient();\n        if (!client) return null;\n        const { data, error } = await client.from(this.table).insert(input).select("*").maybeSingle();\n        mapRepositoryError(error, \`Failed to create \${this.table}\`);\n        return (data as T | null) ?? null;\n    }\n\n    async update(id: string, input: Record<string, unknown>): Promise<T | null> {\n        const client = getRepositoryClient();\n        if (!client) return null;\n        const { data, error } = await client.from(this.table).update(input).eq("id", id).select("*").maybeSingle();\n        mapRepositoryError(error, \`Failed to update \${this.table}\`);\n        return (data as T | null) ?? null;\n    }\n\n    async delete(id: string): Promise<boolean> {\n        const client = getRepositoryClient();\n        if (!client) return false;\n        const { error } = await client.from(this.table).delete().eq("id", id);\n        mapRepositoryError(error, \`Failed to delete \${this.table}\`);\n        return !error;\n    }\n}\n\n`;
    for (const e of entities) {
        sql += `export class ${Pascal}${e.pascal}Repository extends OrgHspRepository<Db${Pascal}${e.pascal}> { protected table = "${e.table}"; }\n`;
    }
    sql += `export class ${Pascal}AuditLogRepository extends OrgHspRepository<Db${Pascal}AuditLog> { protected table = "${PREFIX}_audit_logs"; }\n`;
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

const migrationPath = join(root, "supabase/migrations/202608020040_enterprise_hospital_business_os.sql");
const seedPath = join(root, "supabase/seed/040_enterprise_hospital_business_os_seed.sql");
const reposPath = join(root, "src/modules/database/repositories/hospital-repositories.ts");
const platformPath = join(root, "src/modules/database/types/platform.ts");

writeFileSync(migrationPath, buildMigration(), "utf8");
writeFileSync(seedPath, buildSeed(), "utf8");
writeFileSync(reposPath, buildRepositories(), "utf8");

const platformContent = readFileSync(platformPath, "utf8");
if (!platformContent.includes("DbHspHospitalHub")) {
    writeFileSync(platformPath, platformContent.trimEnd() + "\n\n" + buildDbTypes(), "utf8");
}

console.log("Generated Enterprise Hospital Business Operating System artifacts:");
console.log(`  Migration: ${migrationPath}`);
console.log(`  Seed:      ${seedPath}`);
console.log(`  Repos:     ${reposPath}`);
console.log(`  Types:     ${platformPath} (appended DbHsp* interfaces)`);
console.log(`  Entities:  ${entities.length} + audit_logs = ${allTables.length} tables`);
console.log("Run: node scripts/patch-hospital-ui.mjs");
