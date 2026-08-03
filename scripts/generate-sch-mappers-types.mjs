#!/usr/bin/env node
/**
 * Generates school-mappers.ts and types/index.ts for Program B Sprint 7.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

const entities = [
    { pascal: "SchoolHub", key: "hub_key", title: "hub_name", sub: "hub_key", hub: false, orgOnly: false, createFields: ["hubKey", "hubName", "environment"] },
    { pascal: "Campus", key: "campus_key", title: "campus_name", sub: "campus_type", hub: true, orgOnly: false, createFields: ["campusKey", "campusName", "campusType"] },
    { pascal: "Building", key: "building_key", title: "building_name", sub: "building_type", hub: true, orgOnly: false, createFields: ["buildingKey", "buildingName", "buildingType"] },
    { pascal: "Classroom", key: "classroom_key", title: "classroom_name", sub: "classroom_type", hub: true, orgOnly: false, createFields: ["classroomKey", "classroomName", "classroomType"] },
    { pascal: "AcademicYear", key: "year_key", title: "year_name", sub: "year_status", hub: true, orgOnly: false, createFields: ["yearKey", "yearName", "yearStatus"] },
    { pascal: "Admission", key: "admission_key", title: "admission_name", sub: "admission_status", hub: true, orgOnly: false, createFields: ["admissionKey", "admissionName", "admissionStatus"] },
    { pascal: "StudentProfile", key: "profile_key", title: "profile_name", sub: "profile_type", hub: true, orgOnly: false, createFields: ["profileKey", "profileName", "profileType"] },
    { pascal: "ParentProfile", key: "parent_key", title: "parent_name", sub: "parent_type", hub: true, orgOnly: false, createFields: ["parentKey", "parentName", "parentType"] },
    { pascal: "Enrollment", key: "enrollment_key", title: "enrollment_name", sub: "enrollment_status", hub: true, orgOnly: false, createFields: ["enrollmentKey", "enrollmentName", "enrollmentStatus"] },
    { pascal: "Subject", key: "subject_key", title: "subject_name", sub: "subject_type", hub: true, orgOnly: false, createFields: ["subjectKey", "subjectName", "subjectType"] },
    { pascal: "Timetable", key: "timetable_key", title: "timetable_name", sub: "timetable_type", hub: true, orgOnly: false, createFields: ["timetableKey", "timetableName", "timetableType"] },
    { pascal: "Examination", key: "exam_key", title: "exam_name", sub: "exam_type", hub: true, orgOnly: false, createFields: ["examKey", "examName", "examType"] },
    { pascal: "ReportCard", key: "report_key", title: "report_name", sub: "report_grade", hub: true, orgOnly: false, createFields: ["reportKey", "reportName", "reportGrade"] },
    { pascal: "Teacher", key: "teacher_key", title: "teacher_name", sub: "teacher_type", hub: true, orgOnly: false, createFields: ["teacherKey", "teacherName", "teacherType"] },
    { pascal: "StaffAttendance", key: "attendance_key", title: "attendance_name", sub: "attendance_status", hub: true, orgOnly: false, createFields: ["attendanceKey", "attendanceName", "attendanceStatus"] },
    { pascal: "LeaveRequest", key: "leave_key", title: "leave_name", sub: "leave_status", hub: true, orgOnly: false, createFields: ["leaveKey", "leaveName", "leaveStatus"] },
    { pascal: "SubstituteTeacher", key: "substitute_key", title: "substitute_name", sub: "substitute_status", hub: true, orgOnly: false, createFields: ["substituteKey", "substituteName", "substituteStatus"] },
    { pascal: "FeeStructure", key: "fee_key", title: "fee_name", sub: "fee_type", hub: true, orgOnly: false, createFields: ["feeKey", "feeName", "feeType"] },
    { pascal: "FeeInvoice", key: "invoice_key", title: "invoice_name", sub: "invoice_amount", hub: true, orgOnly: false, createFields: ["invoiceKey", "invoiceName", "invoiceAmount"] },
    { pascal: "FeePayment", key: "payment_key", title: "payment_name", sub: "payment_amount", hub: true, orgOnly: false, createFields: ["paymentKey", "paymentName", "paymentAmount"] },
    { pascal: "Scholarship", key: "scholarship_key", title: "scholarship_name", sub: "scholarship_amount", hub: true, orgOnly: false, createFields: ["scholarshipKey", "scholarshipName", "scholarshipAmount"] },
    { pascal: "Announcement", key: "announcement_key", title: "announcement_title", sub: "announcement_type", hub: true, orgOnly: false, createFields: ["announcementKey", "announcementTitle", "announcementType"] },
    { pascal: "Messaging", key: "message_key", title: "message_subject", sub: "message_type", hub: true, orgOnly: false, createFields: ["messageKey", "messageSubject", "messageType"] },
    { pascal: "Event", key: "event_key", title: "event_name", sub: "event_type", hub: true, orgOnly: false, createFields: ["eventKey", "eventName", "eventType"] },
    { pascal: "AdmissionsAnalytics", key: "analytics_key", title: "analytics_key", sub: "analytics_type", hub: true, orgOnly: false, createFields: ["analyticsKey", "analyticsType", "analyticsScore"] },
    { pascal: "AttendanceAnalytics", key: "analytics_key", title: "analytics_key", sub: "analytics_type", hub: true, orgOnly: false, createFields: ["analyticsKey", "analyticsType", "analyticsScore"] },
    { pascal: "AcademicAnalytics", key: "analytics_key", title: "analytics_key", sub: "analytics_type", hub: true, orgOnly: false, createFields: ["analyticsKey", "analyticsType", "analyticsScore"] },
    { pascal: "SchoolMetric", key: "metrics_key", title: "metrics_key", sub: "overall_school_score", hub: false, orgOnly: true, createFields: ["metricsKey", "admissionsCount", "overallSchoolScore"] },
    { pascal: "SchoolHealth", key: "health_key", title: "health_key", sub: "overall_score", hub: false, orgOnly: true, createFields: ["healthKey", "overallScore", "disasterRecoveryMode"] },
    { pascal: "ExecutiveKpi", key: "kpi_key", title: "kpi_name", sub: "kpi_score", hub: true, orgOnly: false, createFields: ["kpiKey", "kpiName", "kpiScore"] },
    { pascal: "SchoolFailure", key: "failure_key", title: "failure_key", sub: "failure_type", hub: true, orgOnly: false, createFields: ["failureKey", "failureType"] },
];

const numFields = new Set([
    "invoiceAmount", "paymentAmount", "scholarshipAmount", "analyticsScore", "kpiScore",
    "admissionsCount", "overallSchoolScore", "overallScore",
]);
const boolFields = new Set(["disasterRecoveryMode"]);

function buildTypes() {
    let t = `export interface SchDashboardStats {
    totalSchoolHubs: number;
    activeSchoolHubs: number;
    campusCount: number;
    admissionCount: number;
    examinationCount: number;
    openFeeInvoiceCount: number;
    openFailureCount: number;
    overallSchoolScore: number;
    admissionsCountScore: number;
    revenueTotalScore: number;
    attendanceRateScore: number;
    academicPerformanceScore: number;
    feeCollectionRateScore: number;
    auditCount: number;
}

export interface SchPipelineInfo {
    stages: Array<{ key: string; label: string }>;
    currentStage: string;
    nextStage: string;
    previousStage: string;
}

export interface AuditEntry {
    id: string;
    entityType: string;
    entityId?: string | null;
    action: string;
    summary: string;
    securityLevel: string;
    createdAt: string;
}

export interface SchSdkRegisterCampusInput { schoolHubId: string; campusKey?: string; campusName?: string; }
export interface SchSdkRegisterCampusResult { campusId: string; campusKey: string; status: string; }
export interface SchSdkConfigureAdmissionInput { schoolHubId: string; admissionKey?: string; admissionName?: string; }
export interface SchSdkConfigureAdmissionResult { admissionId: string; admissionKey: string; status: string; }
export interface SchSdkRunExamWorkflowInput { schoolHubId: string; examKey?: string; examName?: string; }
export interface SchSdkRunExamWorkflowResult { examId: string; examKey: string; status: string; }

`;
    for (const e of entities) {
        const isHub = e.pascal === "SchoolHub";
        const fields = e.createFields.map((f) => `    ${f}?: ${boolFields.has(f) ? "boolean" : numFields.has(f) ? "number" : "string"};`).join("\n");
        const summaryFields = e.createFields.map((f) => `    ${f}: ${boolFields.has(f) ? "boolean" : numFields.has(f) ? "number" : "string"};`).join("\n");
        const createExtra = e.orgOnly || isHub ? "" : "    schoolHubId: string;\n    ";
        t += `export interface ${e.pascal}Summary {
    id: string;
    ${isHub ? "" : "hubName?: string;\n    "}${summaryFields}
    status: string;
}

export interface Create${e.pascal}Input {
    ${createExtra}${fields}
}

`;
    }
    return t;
}

function buildMappers() {
    const dbImports = entities.map((e) => `DbSch${e.pascal}`).concat(["DbSchAuditLog"]).join(",\n    ");
    const typeImports = entities.flatMap((e) => [`Create${e.pascal}Input`, `${e.pascal}Summary`]).concat(["SchDashboardStats", "SchPipelineInfo", "AuditEntry"]).join(",\n    ");

    let m = `import type { ${dbImports} } from "@/src/modules/database/types/platform";
import type { ${typeImports} } from "@/src/modules/school/types";

export function buildSchoolHubLookupMaps(hubs: DbSchSchoolHub[]) {
    const hubNameById = new Map(hubs.map((h) => [h.id, h.hub_name]));
    return { hubNameById };
}

export function buildSchPipelineInfo(): SchPipelineInfo {
    const stages = [
        { key: "foundation", label: "Foundation" },
        { key: "student", label: "Student" },
        { key: "academics", label: "Academics" },
        { key: "staff", label: "Staff" },
        { key: "finance", label: "Finance" },
    ];
    return { stages, currentStage: "academics", nextStage: "staff", previousStage: "student" };
}

export function buildSchAuditPayload(organizationId: string, entityType: string, action: string, summary: string, entityId?: string) {
    return { organization_id: organizationId, entity_type: entityType, action, summary, entity_id: entityId ?? null, metadata: {}, security_level: "standard" };
}

export function mapAuditEntry(record: DbSchAuditLog): AuditEntry {
    return { id: record.id, entityType: record.entity_type, entityId: record.entity_id, action: record.action, summary: record.summary, securityLevel: record.security_level, createdAt: record.created_at };
}

`;

    for (const e of entities) {
        const isHub = e.pascal === "SchoolHub";
        const mapFields = e.createFields.map((f) => {
            const snake = f.replace(/([A-Z])/g, "_$1").toLowerCase().replace(/^_/, "");
            const cast = boolFields.has(f) ? "boolean" : numFields.has(f) ? "number" : "string";
            return `        ${f}: record.${snake} as ${cast},`;
        }).join("\n");
        const payloadFields = e.createFields.map((f) => {
            const snake = f.replace(/([A-Z])/g, "_$1").toLowerCase().replace(/^_/, "");
            const def = boolFields.has(f) ? "false" : numFields.has(f) ? "0" : "''";
            return `        ${snake}: input.${f} ?? ${def},`;
        }).join("\n");
        const hubLine = e.orgOnly || isHub ? "" : "        hub_id: input.schoolHubId,\n";
        const hubNameLine = isHub || e.orgOnly ? "" : "        hubName: maps?.hubNameById.get(record.hub_id ?? \"\") ?? undefined,\n";
        m += `export function map${e.pascal}Summary(record: DbSch${e.pascal}${isHub || e.orgOnly ? "" : ", maps?: { hubNameById: Map<string, string> }"}): ${e.pascal}Summary {
    return {
        id: record.id,
${hubNameLine}${mapFields}
        status: record.status,
    };
}

export function build${e.pascal}Payload(organizationId: string, input: Create${e.pascal}Input): Record<string, unknown> {
    return {
        organization_id: organizationId,
${hubLine}${payloadFields}
        status: "active",
    };
}

`;
    }

    m += `export function mapCampusForStats(r: DbSchCampus) { return { status: r.status }; }
export function mapAdmissionForStats(r: DbSchAdmission) { return { status: r.status }; }
export function mapSchoolMetricForStats(r: DbSchSchoolMetric) {
    return {
        admissions_count: r.admissions_count,
        revenue_total: r.revenue_total,
        attendance_rate: r.attendance_rate,
        academic_performance_score: r.academic_performance_score,
        fee_collection_rate: r.fee_collection_rate,
        overall_school_score: r.overall_school_score,
        status: r.status,
    };
}
export function mapExaminationForStats(r: DbSchExamination) { return { exam_type: r.exam_type, status: r.status }; }
export function mapFeeInvoiceForStats(r: DbSchFeeInvoice) { return { status: r.status }; }
export function mapTeacherForStats(r: DbSchTeacher) { return { status: r.status }; }
export function mapSchoolHealthForStats(r: DbSchSchoolHealth) { return { overall_score: r.overall_score, status: r.status }; }
export function mapSchoolFailureForStats(r: DbSchSchoolFailure) { return { status: r.status }; }

export function buildSchDashboardStats(input: {
    schoolHubs: SchoolHubSummary[];
    campuses: ReturnType<typeof mapCampusForStats>[];
    admissions: ReturnType<typeof mapAdmissionForStats>[];
    schoolMetrics: ReturnType<typeof mapSchoolMetricForStats>[];
    examinations: ReturnType<typeof mapExaminationForStats>[];
    feeInvoices: ReturnType<typeof mapFeeInvoiceForStats>[];
    teachers: ReturnType<typeof mapTeacherForStats>[];
    schoolHealth: ReturnType<typeof mapSchoolHealthForStats>[];
    schoolFailures: SchoolFailureSummary[];
    auditLogs: AuditEntry[];
}): SchDashboardStats {
    const activeHubs = input.schoolHubs.filter((h) => h.status === "active").length;
    const latestMetrics = input.schoolMetrics[0];
    const latestHealth = input.schoolHealth[0];
    return {
        totalSchoolHubs: input.schoolHubs.length,
        activeSchoolHubs: activeHubs,
        campusCount: input.campuses.length,
        admissionCount: input.admissions.length,
        examinationCount: input.examinations.length,
        openFeeInvoiceCount: input.feeInvoices.filter((r) => r.status === "open" || r.status === "pending").length,
        openFailureCount: input.schoolFailures.filter((f) => f.status === "open" || f.status === "failed").length,
        overallSchoolScore: latestMetrics?.overall_school_score ?? latestHealth?.overall_score ?? 0,
        admissionsCountScore: latestMetrics?.admissions_count ?? 0,
        revenueTotalScore: latestMetrics?.revenue_total ?? 0,
        attendanceRateScore: latestMetrics?.attendance_rate ?? 0,
        academicPerformanceScore: latestMetrics?.academic_performance_score ?? 0,
        feeCollectionRateScore: latestMetrics?.fee_collection_rate ?? 0,
        auditCount: input.auditLogs.length,
    };
}
`;

    return m;
}

mkdirSync(join(root, "src/modules/school/types"), { recursive: true });
writeFileSync(join(root, "src/modules/school/types/index.ts"), buildTypes(), "utf8");
mkdirSync(join(root, "src/modules/database/lib"), { recursive: true });
writeFileSync(join(root, "src/modules/database/lib/school-mappers.ts"), buildMappers(), "utf8");
console.log("Generated SCH types and mappers");
