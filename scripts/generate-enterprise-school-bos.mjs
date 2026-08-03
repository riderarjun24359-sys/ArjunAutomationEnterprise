#!/usr/bin/env node
/**
 * Generates V2 Program B Sprint 7 Enterprise School Business Operating System artifacts.
 * Run: node scripts/generate-enterprise-school-bos.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const PREFIX = "sch";
const Pascal = "Sch";
const camel = "sch";
const permResource = "enterprise_school_business_os";

const hubTable = `${PREFIX}_school_hubs`;
const hubFk = "hub_id";
const orgOnlyTables = new Set([`${PREFIX}_school_metrics`, `${PREFIX}_school_health`, `${PREFIX}_audit_logs`]);

const entities = [
    { tab: "schoolHubs", plural: "schoolHubs", singular: "SchoolHub", pascal: "SchoolHub", db: `${camel}SchoolHubs`, table: hubTable, hubField: false, orgOnly: false, fields: [{ name: "hubKey", type: "string" }, { name: "hubName", type: "string" }, { name: "environment", type: "string" }], display: { title: "hubName", sub: "hubKey" }, sqlExtra: "hub_key text not null,\n  hub_name text not null,\n  environment text not null default 'production',\n  school_code text not null default ''" },
    { tab: "campuses", plural: "campuses", singular: "Campus", pascal: "Campus", db: `${camel}Campuses`, table: `${PREFIX}_campuses`, fields: [{ name: "campusKey", type: "string" }, { name: "campusName", type: "string" }, { name: "campusType", type: "string" }], display: { title: "campusName", sub: "campusType" }, sqlExtra: "campus_key text not null,\n  campus_name text not null default '',\n  campus_type text not null default 'main',\n  address text not null default ''" },
    { tab: "buildings", plural: "buildings", singular: "Building", pascal: "Building", db: `${camel}Buildings`, table: `${PREFIX}_buildings`, fields: [{ name: "buildingKey", type: "string" }, { name: "buildingName", type: "string" }, { name: "buildingType", type: "string" }], display: { title: "buildingName", sub: "buildingType" }, sqlExtra: "building_key text not null,\n  building_name text not null default '',\n  building_type text not null default 'academic',\n  floor_count integer not null default 1" },
    { tab: "classrooms", plural: "classrooms", singular: "Classroom", pascal: "Classroom", db: `${camel}Classrooms`, table: `${PREFIX}_classrooms`, fields: [{ name: "classroomKey", type: "string" }, { name: "classroomName", type: "string" }, { name: "classroomType", type: "string" }], display: { title: "classroomName", sub: "classroomType" }, sqlExtra: "classroom_key text not null,\n  classroom_name text not null default '',\n  classroom_type text not null default 'standard',\n  capacity integer not null default 30" },
    { tab: "academicYears", plural: "academicYears", singular: "AcademicYear", pascal: "AcademicYear", db: `${camel}AcademicYears`, table: `${PREFIX}_academic_years`, fields: [{ name: "yearKey", type: "string" }, { name: "yearName", type: "string" }, { name: "yearStatus", type: "string" }], display: { title: "yearName", sub: "yearStatus" }, sqlExtra: "year_key text not null,\n  year_name text not null default '',\n  year_status text not null default 'active',\n  start_date date not null default current_date,\n  end_date date" },
    { tab: "admissions", plural: "admissions", singular: "Admission", pascal: "Admission", db: `${camel}Admissions`, table: `${PREFIX}_admissions`, fields: [{ name: "admissionKey", type: "string" }, { name: "admissionName", type: "string" }, { name: "admissionStatus", type: "select", options: "ADMISSION_STATUS_OPTIONS" }], display: { title: "admissionName", sub: "admissionStatus" }, sqlExtra: "admission_key text not null,\n  admission_name text not null default '',\n  admission_status text not null default 'pending',\n  grade_level text not null default '',\n  applied_at timestamptz not null default now()" },
    { tab: "studentProfiles", plural: "studentProfiles", singular: "StudentProfile", pascal: "StudentProfile", db: `${camel}StudentProfiles`, table: `${PREFIX}_student_profiles`, fields: [{ name: "profileKey", type: "string" }, { name: "profileName", type: "string" }, { name: "profileType", type: "string" }], display: { title: "profileName", sub: "profileType" }, sqlExtra: "profile_key text not null,\n  profile_name text not null default '',\n  profile_type text not null default 'regular',\n  grade_level text not null default ''" },
    { tab: "parentProfiles", plural: "parentProfiles", singular: "ParentProfile", pascal: "ParentProfile", db: `${camel}ParentProfiles`, table: `${PREFIX}_parent_profiles`, fields: [{ name: "parentKey", type: "string" }, { name: "parentName", type: "string" }, { name: "parentType", type: "string" }], display: { title: "parentName", sub: "parentType" }, sqlExtra: "parent_key text not null,\n  parent_name text not null default '',\n  parent_type text not null default 'guardian',\n  email text not null default ''" },
    { tab: "enrollments", plural: "enrollments", singular: "Enrollment", pascal: "Enrollment", db: `${camel}Enrollments`, table: `${PREFIX}_enrollments`, fields: [{ name: "enrollmentKey", type: "string" }, { name: "enrollmentName", type: "string" }, { name: "enrollmentStatus", type: "string" }], display: { title: "enrollmentName", sub: "enrollmentStatus" }, sqlExtra: "enrollment_key text not null,\n  enrollment_name text not null default '',\n  enrollment_status text not null default 'active',\n  enrolled_at timestamptz not null default now()" },
    { tab: "subjects", plural: "subjects", singular: "Subject", pascal: "Subject", db: `${camel}Subjects`, table: `${PREFIX}_subjects`, fields: [{ name: "subjectKey", type: "string" }, { name: "subjectName", type: "string" }, { name: "subjectType", type: "string" }], display: { title: "subjectName", sub: "subjectType" }, sqlExtra: "subject_key text not null,\n  subject_name text not null default '',\n  subject_type text not null default 'core',\n  credit_hours numeric(4, 1) not null default 1" },
    { tab: "timetables", plural: "timetables", singular: "Timetable", pascal: "Timetable", db: `${camel}Timetables`, table: `${PREFIX}_timetables`, fields: [{ name: "timetableKey", type: "string" }, { name: "timetableName", type: "string" }, { name: "timetableType", type: "string" }], display: { title: "timetableName", sub: "timetableType" }, sqlExtra: "timetable_key text not null,\n  timetable_name text not null default '',\n  timetable_type text not null default 'weekly',\n  period_count integer not null default 8" },
    { tab: "examinations", plural: "examinations", singular: "Examination", pascal: "Examination", db: `${camel}Examinations`, table: `${PREFIX}_examinations`, fields: [{ name: "examKey", type: "string" }, { name: "examName", type: "string" }, { name: "examType", type: "select", options: "EXAM_TYPE_OPTIONS" }], display: { title: "examName", sub: "examType" }, sqlExtra: "exam_key text not null,\n  exam_name text not null default '',\n  exam_type text not null default 'midterm',\n  exam_status text not null default 'scheduled',\n  scheduled_at timestamptz not null default now()" },
    { tab: "reportCards", plural: "reportCards", singular: "ReportCard", pascal: "ReportCard", db: `${camel}ReportCards`, table: `${PREFIX}_report_cards`, fields: [{ name: "reportKey", type: "string" }, { name: "reportName", type: "string" }, { name: "reportGrade", type: "string" }], display: { title: "reportName", sub: "reportGrade" }, sqlExtra: "report_key text not null,\n  report_name text not null default '',\n  report_grade text not null default 'A',\n  gpa numeric(3, 2) not null default 0" },
    { tab: "teachers", plural: "teachers", singular: "Teacher", pascal: "Teacher", db: `${camel}Teachers`, table: `${PREFIX}_teachers`, fields: [{ name: "teacherKey", type: "string" }, { name: "teacherName", type: "string" }, { name: "teacherType", type: "string" }], display: { title: "teacherName", sub: "teacherType" }, sqlExtra: "teacher_key text not null,\n  teacher_name text not null default '',\n  teacher_type text not null default 'full_time',\n  department text not null default ''" },
    { tab: "staffAttendance", plural: "staffAttendance", singular: "StaffAttendance", pascal: "StaffAttendance", db: `${camel}StaffAttendance`, table: `${PREFIX}_staff_attendance`, fields: [{ name: "attendanceKey", type: "string" }, { name: "attendanceName", type: "string" }, { name: "attendanceStatus", type: "select", options: "ATTENDANCE_STATUS_OPTIONS" }], display: { title: "attendanceName", sub: "attendanceStatus" }, sqlExtra: "attendance_key text not null,\n  attendance_name text not null default '',\n  attendance_status text not null default 'present',\n  recorded_at timestamptz not null default now()" },
    { tab: "leaveRequests", plural: "leaveRequests", singular: "LeaveRequest", pascal: "LeaveRequest", db: `${camel}LeaveRequests`, table: `${PREFIX}_leave_requests`, fields: [{ name: "leaveKey", type: "string" }, { name: "leaveName", type: "string" }, { name: "leaveStatus", type: "string" }], display: { title: "leaveName", sub: "leaveStatus" }, sqlExtra: "leave_key text not null,\n  leave_name text not null default '',\n  leave_status text not null default 'pending',\n  leave_type text not null default 'personal',\n  requested_at timestamptz not null default now()" },
    { tab: "substituteTeachers", plural: "substituteTeachers", singular: "SubstituteTeacher", pascal: "SubstituteTeacher", db: `${camel}SubstituteTeachers`, table: `${PREFIX}_substitute_teachers`, fields: [{ name: "substituteKey", type: "string" }, { name: "substituteName", type: "string" }, { name: "substituteStatus", type: "string" }], display: { title: "substituteName", sub: "substituteStatus" }, sqlExtra: "substitute_key text not null,\n  substitute_name text not null default '',\n  substitute_status text not null default 'available',\n  assigned_at timestamptz not null default now()" },
    { tab: "feeStructures", plural: "feeStructures", singular: "FeeStructure", pascal: "FeeStructure", db: `${camel}FeeStructures`, table: `${PREFIX}_fee_structures`, fields: [{ name: "feeKey", type: "string" }, { name: "feeName", type: "string" }, { name: "feeType", type: "string" }], display: { title: "feeName", sub: "feeType" }, sqlExtra: "fee_key text not null,\n  fee_name text not null default '',\n  fee_type text not null default 'tuition',\n  amount numeric(12, 2) not null default 0" },
    { tab: "feeInvoices", plural: "feeInvoices", singular: "FeeInvoice", pascal: "FeeInvoice", db: `${camel}FeeInvoices`, table: `${PREFIX}_fee_invoices`, fields: [{ name: "invoiceKey", type: "string" }, { name: "invoiceName", type: "string" }, { name: "invoiceAmount", type: "number" }], display: { title: "invoiceName", sub: "invoiceAmount" }, sqlExtra: "invoice_key text not null,\n  invoice_name text not null default '',\n  invoice_amount numeric(12, 2) not null default 0,\n  invoice_status text not null default 'pending',\n  due_date date not null default current_date" },
    { tab: "feePayments", plural: "feePayments", singular: "FeePayment", pascal: "FeePayment", db: `${camel}FeePayments`, table: `${PREFIX}_fee_payments`, fields: [{ name: "paymentKey", type: "string" }, { name: "paymentName", type: "string" }, { name: "paymentAmount", type: "number" }], display: { title: "paymentName", sub: "paymentAmount" }, sqlExtra: "payment_key text not null,\n  payment_name text not null default '',\n  payment_amount numeric(12, 2) not null default 0,\n  payment_status text not null default 'completed',\n  paid_at timestamptz not null default now()" },
    { tab: "scholarships", plural: "scholarships", singular: "Scholarship", pascal: "Scholarship", db: `${camel}Scholarships`, table: `${PREFIX}_scholarships`, fields: [{ name: "scholarshipKey", type: "string" }, { name: "scholarshipName", type: "string" }, { name: "scholarshipAmount", type: "number" }], display: { title: "scholarshipName", sub: "scholarshipAmount" }, sqlExtra: "scholarship_key text not null,\n  scholarship_name text not null default '',\n  scholarship_amount numeric(12, 2) not null default 0,\n  scholarship_type text not null default 'merit'" },
    { tab: "announcements", plural: "announcements", singular: "Announcement", pascal: "Announcement", db: `${camel}Announcements`, table: `${PREFIX}_announcements`, fields: [{ name: "announcementKey", type: "string" }, { name: "announcementTitle", type: "string" }, { name: "announcementType", type: "string" }], display: { title: "announcementTitle", sub: "announcementType" }, sqlExtra: "announcement_key text not null,\n  announcement_title text not null default '',\n  announcement_type text not null default 'general',\n  published_at timestamptz not null default now()" },
    { tab: "messaging", plural: "messaging", singular: "Messaging", pascal: "Messaging", db: `${camel}Messaging`, table: `${PREFIX}_messaging`, fields: [{ name: "messageKey", type: "string" }, { name: "messageSubject", type: "string" }, { name: "messageType", type: "string" }], display: { title: "messageSubject", sub: "messageType" }, sqlExtra: "message_key text not null,\n  message_subject text not null default '',\n  message_type text not null default 'direct',\n  sent_at timestamptz not null default now()" },
    { tab: "events", plural: "events", singular: "Event", pascal: "Event", db: `${camel}Events`, table: `${PREFIX}_events`, fields: [{ name: "eventKey", type: "string" }, { name: "eventName", type: "string" }, { name: "eventType", type: "string" }], display: { title: "eventName", sub: "eventType" }, sqlExtra: "event_key text not null,\n  event_name text not null default '',\n  event_type text not null default 'academic',\n  event_date timestamptz not null default now()" },
    { tab: "admissionsAnalytics", plural: "admissionsAnalytics", singular: "AdmissionsAnalytics", pascal: "AdmissionsAnalytics", db: `${camel}AdmissionsAnalytics`, table: `${PREFIX}_admissions_analytics`, fields: [{ name: "analyticsKey", type: "string" }, { name: "analyticsType", type: "string" }, { name: "analyticsScore", type: "number" }], display: { title: "analyticsKey", sub: "analyticsType" }, sqlExtra: "analytics_key text not null,\n  analytics_type text not null default 'admissions',\n  analytics_score numeric(5, 2) not null default 0,\n  metric_date date not null default current_date" },
    { tab: "attendanceAnalytics", plural: "attendanceAnalytics", singular: "AttendanceAnalytics", pascal: "AttendanceAnalytics", db: `${camel}AttendanceAnalytics`, table: `${PREFIX}_attendance_analytics`, fields: [{ name: "analyticsKey", type: "string" }, { name: "analyticsType", type: "string" }, { name: "analyticsScore", type: "number" }], display: { title: "analyticsKey", sub: "analyticsType" }, sqlExtra: "analytics_key text not null,\n  analytics_type text not null default 'attendance',\n  analytics_score numeric(5, 2) not null default 0,\n  metric_date date not null default current_date" },
    { tab: "academicAnalytics", plural: "academicAnalytics", singular: "AcademicAnalytics", pascal: "AcademicAnalytics", db: `${camel}AcademicAnalytics`, table: `${PREFIX}_academic_analytics`, fields: [{ name: "analyticsKey", type: "string" }, { name: "analyticsType", type: "string" }, { name: "analyticsScore", type: "number" }], display: { title: "analyticsKey", sub: "analyticsType" }, sqlExtra: "analytics_key text not null,\n  analytics_type text not null default 'academic',\n  analytics_score numeric(5, 2) not null default 0,\n  metric_date date not null default current_date" },
    { tab: "schoolMetrics", plural: "schoolMetrics", singular: "SchoolMetric", pascal: "SchoolMetric", db: `${camel}SchoolMetrics`, table: `${PREFIX}_school_metrics`, hubField: false, orgOnly: true, fields: [{ name: "metricsKey", type: "string" }, { name: "admissionsCount", type: "number" }, { name: "overallSchoolScore", type: "number" }], display: { title: "metricsKey", sub: "overallSchoolScore" }, sqlExtra: "metrics_key text not null,\n  metric_date date not null default current_date,\n  revenue_total numeric(12, 2) not null default 0,\n  admissions_count integer not null default 0,\n  attendance_rate numeric(5, 2) not null default 0,\n  academic_performance_score numeric(5, 2) not null default 0,\n  fee_collection_rate numeric(5, 2) not null default 0,\n  teacher_performance_score numeric(5, 2) not null default 0,\n  student_growth_rate numeric(5, 2) not null default 0,\n  overall_school_score numeric(5, 2) not null default 100" },
    { tab: "schoolHealth", plural: "schoolHealth", singular: "SchoolHealth", pascal: "SchoolHealth", db: `${camel}SchoolHealth`, table: `${PREFIX}_school_health`, hubField: false, orgOnly: true, fields: [{ name: "healthKey", type: "string" }, { name: "overallScore", type: "number" }, { name: "disasterRecoveryMode", type: "boolean" }], display: { title: "healthKey", sub: "overallScore" }, sqlExtra: "health_key text not null,\n  health_date date not null default current_date,\n  overall_score numeric(5, 2) not null default 100,\n  disaster_recovery_mode boolean not null default false,\n  campus_health_status text not null default 'healthy',\n  financial_health_status text not null default 'healthy',\n  operational_health_status text not null default 'healthy',\n  summary text not null default ''" },
    { tab: "executiveKpis", plural: "executiveKpis", singular: "ExecutiveKpi", pascal: "ExecutiveKpi", db: `${camel}ExecutiveKpis`, table: `${PREFIX}_executive_kpis`, fields: [{ name: "kpiKey", type: "string" }, { name: "kpiName", type: "string" }, { name: "kpiScore", type: "number" }], display: { title: "kpiName", sub: "kpiScore" }, sqlExtra: "kpi_key text not null,\n  kpi_name text not null default '',\n  kpi_score numeric(5, 2) not null default 0,\n  kpi_type text not null default 'executive',\n  metric_date date not null default current_date" },
    { tab: "schoolFailures", plural: "schoolFailures", singular: "SchoolFailure", pascal: "SchoolFailure", db: `${camel}SchoolFailures`, table: `${PREFIX}_school_failures`, fields: [{ name: "failureKey", type: "string" }, { name: "failureType", type: "string" }], display: { title: "failureKey", sub: "failureType" }, sqlExtra: "failure_key text not null,\n  failure_type text not null default 'admission',\n  error_code text not null default '',\n  error_message text not null default '',\n  failed_at timestamptz not null default now(),\n  resolved_at timestamptz" },
];

const allTables = [...entities.map((e) => e.table), `${PREFIX}_audit_logs`];
const tablesForTriggers = allTables.filter((t) => t !== `${PREFIX}_audit_logs`);

function buildMigration() {
    let sql = "-- V2 Program B Sprint 7: Enterprise School Business Operating System\n\n";
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
    sql += `  ('${PREFIX}.view', 'View enterprise school business operating system data', '${permResource}'),\n`;
    sql += `  ('${PREFIX}.manage', 'Manage school foundation, student, academics, staff, finance, and framework outputs', '${permResource}'),\n`;
    sql += `  ('${PREFIX}.approve', 'Approve school admissions and fee gates', '${permResource}'),\n`;
    sql += `  ('${PREFIX}.admin', 'Administer enterprise school business operating system governance', '${permResource}')\n`;
    sql += `on conflict (key) do update set description = excluded.description, resource = excluded.resource;\n`;
    return sql;
}

function buildSeed() {
    const org = "11111111-1111-1111-1111-111111111111";
    const hubId = "006f006f-006f-006f-006f-006f006f0101";
    let sql = `insert into public.ai_orchestration_agents (id, organization_id, name, agent_type, workflow_agent_id, provider_id, model_route_id, capabilities, status)\nvalues\n  ('a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a339', '${org}', 'Enterprise School Orchestrator', 'enterprise_school_business_os', null, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a201', '["school_foundation","student_engine","academics_engine","staff_engine","finance_engine","school_analytics","school_dashboard"]'::jsonb, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.ai_sessions (id, organization_id, agent_id, session_key, module_source, entity_type, entity_id, context, status, expires_at)\nvalues\n  ('a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a539', '${org}', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a339', 'northstar-school-os-001', 'enterprise_school_business_os', 'school_hub', '${hubId}', '{"objective":"Enterprise school business operating system for northstar education operations"}'::jsonb, 'active', '2026-12-31 23:59:59+00')\non conflict (id) do nothing;\n\n`;
    sql += `-- M0 School Hub\n`;
    sql += `insert into public.sch_school_hubs (id, organization_id, hub_key, hub_name, environment, school_code, status)\nvalues ('${hubId}', '${org}', 'northstar-school-os', 'Northstar School OS Hub', 'production', 'SCH-0804-001', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M1 Foundation\n`;
    sql += `insert into public.sch_campuses (id, organization_id, hub_id, campus_key, campus_name, campus_type, status)\nvalues ('01000100-0100-0100-0100-010001000201', '${org}', '${hubId}', 'campus-main-0804', 'Main Campus', 'main', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.sch_buildings (id, organization_id, hub_id, building_key, building_name, building_type, status)\nvalues ('01010101-0101-0101-0101-010101010301', '${org}', '${hubId}', 'bldg-science-0804', 'Science Building', 'academic', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.sch_classrooms (id, organization_id, hub_id, classroom_key, classroom_name, classroom_type, status)\nvalues ('01020102-0102-0102-0102-010201020401', '${org}', '${hubId}', 'cls-101-0804', 'Classroom 101', 'standard', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.sch_academic_years (id, organization_id, hub_id, year_key, year_name, year_status, status)\nvalues ('01030103-0103-0103-0103-010301030501', '${org}', '${hubId}', 'year-2026-0804', 'Academic Year 2026', 'active', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M2 Student\n`;
    sql += `insert into public.sch_admissions (id, organization_id, hub_id, admission_key, admission_name, admission_status, status)\nvalues ('01040104-0104-0104-0104-010401040601', '${org}', '${hubId}', 'adm-smith-0804', 'Smith Admission Application', 'pending', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.sch_student_profiles (id, organization_id, hub_id, profile_key, profile_name, profile_type, status)\nvalues ('01050105-0105-0105-0105-010501050701', '${org}', '${hubId}', 'stu-jones-0804', 'Jones Student Profile', 'regular', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.sch_parent_profiles (id, organization_id, hub_id, parent_key, parent_name, parent_type, status)\nvalues ('01060106-0106-0106-0106-010601060801', '${org}', '${hubId}', 'par-jones-0804', 'Jones Parent Profile', 'guardian', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.sch_enrollments (id, organization_id, hub_id, enrollment_key, enrollment_name, enrollment_status, status)\nvalues ('01070107-0107-0107-0107-010701070901', '${org}', '${hubId}', 'enr-jones-0804', 'Jones Enrollment', 'active', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M3 Academics\n`;
    sql += `insert into public.sch_subjects (id, organization_id, hub_id, subject_key, subject_name, subject_type, status)\nvalues ('01080108-0108-0108-0108-010801080a01', '${org}', '${hubId}', 'sub-math-0804', 'Mathematics', 'core', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.sch_timetables (id, organization_id, hub_id, timetable_key, timetable_name, timetable_type, status)\nvalues ('01090109-0109-0109-0109-010901090b01', '${org}', '${hubId}', 'tt-weekly-0804', 'Weekly Timetable', 'weekly', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.sch_examinations (id, organization_id, hub_id, exam_key, exam_name, exam_type, status)\nvalues ('010a010a-010a-010a-010a-010a010a0c01', '${org}', '${hubId}', 'exam-mid-0804', 'Midterm Examination', 'midterm', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.sch_report_cards (id, organization_id, hub_id, report_key, report_name, report_grade, status)\nvalues ('010b010b-010b-010b-010b-010b010b0d01', '${org}', '${hubId}', 'rpt-jones-0804', 'Jones Report Card', 'A', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M4 Staff\n`;
    sql += `insert into public.sch_teachers (id, organization_id, hub_id, teacher_key, teacher_name, teacher_type, status)\nvalues ('010c010c-010c-010c-010c-010c010c0e01', '${org}', '${hubId}', 'tch-wilson-0804', 'Wilson Teacher', 'full_time', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.sch_staff_attendance (id, organization_id, hub_id, attendance_key, attendance_name, attendance_status, status)\nvalues ('010d010d-010d-010d-010d-010d010d0f01', '${org}', '${hubId}', 'att-wilson-0804', 'Wilson Attendance', 'present', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.sch_leave_requests (id, organization_id, hub_id, leave_key, leave_name, leave_status, status)\nvalues ('010e010e-010e-010e-010e-010e010e1001', '${org}', '${hubId}', 'lv-wilson-0804', 'Wilson Leave Request', 'pending', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.sch_substitute_teachers (id, organization_id, hub_id, substitute_key, substitute_name, substitute_status, status)\nvalues ('010f010f-010f-010f-010f-010f010f1101', '${org}', '${hubId}', 'sub-brown-0804', 'Brown Substitute', 'available', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M5 Finance\n`;
    sql += `insert into public.sch_fee_structures (id, organization_id, hub_id, fee_key, fee_name, fee_type, status)\nvalues ('01100110-0110-0110-0110-011001101201', '${org}', '${hubId}', 'fee-tuition-0804', 'Tuition Fee Structure', 'tuition', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.sch_fee_invoices (id, organization_id, hub_id, invoice_key, invoice_name, invoice_amount, status)\nvalues ('01110111-0111-0111-0111-011101111301', '${org}', '${hubId}', 'inv-jones-0804', 'Jones Fee Invoice', 5000.00, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.sch_fee_payments (id, organization_id, hub_id, payment_key, payment_name, payment_amount, status)\nvalues ('01120112-0112-0112-0112-011201121401', '${org}', '${hubId}', 'pay-jones-0804', 'Jones Fee Payment', 5000.00, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.sch_scholarships (id, organization_id, hub_id, scholarship_key, scholarship_name, scholarship_amount, status)\nvalues ('01130113-0113-0113-0113-011301131501', '${org}', '${hubId}', 'sch-merit-0804', 'Merit Scholarship', 1000.00, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M6 Parent/Student Experience\n`;
    sql += `insert into public.sch_announcements (id, organization_id, hub_id, announcement_key, announcement_title, announcement_type, status)\nvalues ('01140114-0114-0114-0114-011401141601', '${org}', '${hubId}', 'ann-open-0804', 'Open House Announcement', 'general', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.sch_messaging (id, organization_id, hub_id, message_key, message_subject, message_type, status)\nvalues ('01150115-0115-0115-0115-011501151701', '${org}', '${hubId}', 'msg-parent-0804', 'Parent Message', 'direct', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.sch_events (id, organization_id, hub_id, event_key, event_name, event_type, status)\nvalues ('01160116-0116-0116-0116-011601161801', '${org}', '${hubId}', 'evt-sports-0804', 'Sports Day Event', 'academic', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M7 Analytics\n`;
    sql += `insert into public.sch_admissions_analytics (id, organization_id, hub_id, analytics_key, analytics_type, analytics_score, status)\nvalues ('01170117-0117-0117-0117-011701171901', '${org}', '${hubId}', 'anly-adm-0804', 'admissions', 94.50, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.sch_attendance_analytics (id, organization_id, hub_id, analytics_key, analytics_type, analytics_score, status)\nvalues ('01180118-0118-0118-0118-011801181a01', '${org}', '${hubId}', 'anly-att-0804', 'attendance', 92.00, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.sch_academic_analytics (id, organization_id, hub_id, analytics_key, analytics_type, analytics_score, status)\nvalues ('01190119-0119-0119-0119-011901191b01', '${org}', '${hubId}', 'anly-acad-0804', 'academic', 96.00, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M8 Executive Dashboard\n`;
    sql += `insert into public.sch_school_metrics (id, organization_id, metrics_key, revenue_total, admissions_count, attendance_rate, academic_performance_score, fee_collection_rate, teacher_performance_score, student_growth_rate, overall_school_score, status)\nvalues ('011a011a-011a-011a-011a-011a011a1c01', '${org}', 'sch-metrics-0804', 850000.00, 1250, 94.50, 91.00, 88.50, 93.00, 8.50, 95.25, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.sch_school_health (id, organization_id, health_key, overall_score, disaster_recovery_mode, campus_health_status, financial_health_status, operational_health_status, summary, status)\nvalues ('011b011b-011b-011b-011b-011b011b1d01', '${org}', 'sch-health-0804', 96.00, false, 'healthy', 'healthy', 'healthy', 'School business operating system operational', 'healthy')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.sch_executive_kpis (id, organization_id, hub_id, kpi_key, kpi_name, kpi_score, status)\nvalues ('011c011c-011c-011c-011c-011c011c1e01', '${org}', '${hubId}', 'kpi-exec-0804', 'Executive KPI Score', 97.50, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.sch_school_failures (id, organization_id, hub_id, failure_key, failure_type, error_code, error_message, status)\nvalues ('011d011d-011d-011d-011d-011d011d1f01', '${org}', '${hubId}', 'fail-adm-0804', 'admission', 'ADM_TIMEOUT', 'Admission processing timed out', 'open')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.sch_audit_logs (id, organization_id, entity_type, action, summary, security_level)\nvalues ('011e011e-011e-011e-011e-011e011e2001', '${org}', 'school_hub', 'seed', 'Enterprise school business operating system seed data loaded', 'standard')\non conflict (id) do nothing;\n`;
    return sql;
}

function buildRepositories() {
    const dbTypes = entities.map((e) => `Db${Pascal}${e.pascal}`).concat([`Db${Pascal}AuditLog`]);
    let sql = `import type {\n    ${dbTypes.join(",\n    ")},\n} from "@/src/modules/database/types/platform";\n`;
    sql += `import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";\n`;
    sql += `import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";\n\n`;
    sql += `abstract class OrgSchRepository<T> extends BaseRepository<T> {\n`;
    sql += `    async listByOrganization(organizationId: string, query: RepositoryQuery = {}): Promise<T[]> {\n        const client = getRepositoryClient();\n        if (!client) return [];\n        const normalized = this.buildQuery(query);\n        const { data, error } = await client.from(this.table).select("*").eq("organization_id", organizationId).order(normalized.orderBy, { ascending: normalized.orderDirection === "asc" }).range(normalized.offset, normalized.offset + normalized.limit - 1);\n        mapRepositoryError(error, \`Failed to list \${this.table}\`);\n        return (data ?? []) as T[];\n    }\n\n    async getById(id: string): Promise<T | null> {\n        const client = getRepositoryClient();\n        if (!client) return null;\n        const { data, error } = await client.from(this.table).select("*").eq("id", id).maybeSingle();\n        mapRepositoryError(error, \`Failed to get \${this.table}\`);\n        return (data as T | null) ?? null;\n    }\n\n    async create(input: Record<string, unknown>): Promise<T | null> {\n        const client = getRepositoryClient();\n        if (!client) return null;\n        const { data, error } = await client.from(this.table).insert(input).select("*").maybeSingle();\n        mapRepositoryError(error, \`Failed to create \${this.table}\`);\n        return (data as T | null) ?? null;\n    }\n\n    async update(id: string, input: Record<string, unknown>): Promise<T | null> {\n        const client = getRepositoryClient();\n        if (!client) return null;\n        const { data, error } = await client.from(this.table).update(input).eq("id", id).select("*").maybeSingle();\n        mapRepositoryError(error, \`Failed to update \${this.table}\`);\n        return (data as T | null) ?? null;\n    }\n\n    async delete(id: string): Promise<boolean> {\n        const client = getRepositoryClient();\n        if (!client) return false;\n        const { error } = await client.from(this.table).delete().eq("id", id);\n        mapRepositoryError(error, \`Failed to delete \${this.table}\`);\n        return !error;\n    }\n}\n\n`;
    for (const e of entities) {
        sql += `export class ${Pascal}${e.pascal}Repository extends OrgSchRepository<Db${Pascal}${e.pascal}> { protected table = "${e.table}"; }\n`;
    }
    sql += `export class ${Pascal}AuditLogRepository extends OrgSchRepository<Db${Pascal}AuditLog> { protected table = "${PREFIX}_audit_logs"; }\n`;
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

const migrationPath = join(root, "supabase/migrations/202608020039_enterprise_school_business_os.sql");
const seedPath = join(root, "supabase/seed/039_enterprise_school_business_os_seed.sql");
const reposPath = join(root, "src/modules/database/repositories/school-repositories.ts");
const platformPath = join(root, "src/modules/database/types/platform.ts");

writeFileSync(migrationPath, buildMigration(), "utf8");
writeFileSync(seedPath, buildSeed(), "utf8");
writeFileSync(reposPath, buildRepositories(), "utf8");

const platformContent = readFileSync(platformPath, "utf8");
if (!platformContent.includes("DbSchSchoolHub")) {
    writeFileSync(platformPath, platformContent.trimEnd() + "\n\n" + buildDbTypes(), "utf8");
}

console.log("Generated Enterprise School Business Operating System artifacts:");
console.log(`  Migration: ${migrationPath}`);
console.log(`  Seed:      ${seedPath}`);
console.log(`  Repos:     ${reposPath}`);
console.log(`  Types:     ${platformPath} (appended DbSch* interfaces)`);
console.log(`  Entities:  ${entities.length} + audit_logs = ${allTables.length} tables`);
console.log("Run: node scripts/patch-school-ui.mjs");
