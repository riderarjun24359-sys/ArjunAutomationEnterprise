#!/usr/bin/env node
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const mod = join(root, "src/modules/school");

const entities = [
    { tab: "schoolHubs", plural: "schoolHubs", singular: "SchoolHub", pascal: "SchoolHub", db: "schSchoolHubs", hubField: false, fields: [{ name: "hubKey", type: "string" }, { name: "hubName", type: "string" }, { name: "environment", type: "string" }], display: { title: "hubName", sub: "hubKey" } },
    { tab: "campuses", plural: "campuses", singular: "Campus", pascal: "Campus", db: "schCampuses", fields: [{ name: "campusKey", type: "string" }, { name: "campusName", type: "string" }, { name: "campusType", type: "string" }], display: { title: "campusName", sub: "campusType" } },
    { tab: "buildings", plural: "buildings", singular: "Building", pascal: "Building", db: "schBuildings", fields: [{ name: "buildingKey", type: "string" }, { name: "buildingName", type: "string" }, { name: "buildingType", type: "string" }], display: { title: "buildingName", sub: "buildingType" } },
    { tab: "classrooms", plural: "classrooms", singular: "Classroom", pascal: "Classroom", db: "schClassrooms", fields: [{ name: "classroomKey", type: "string" }, { name: "classroomName", type: "string" }, { name: "classroomType", type: "string" }], display: { title: "classroomName", sub: "classroomType" } },
    { tab: "academicYears", plural: "academicYears", singular: "AcademicYear", pascal: "AcademicYear", db: "schAcademicYears", fields: [{ name: "yearKey", type: "string" }, { name: "yearName", type: "string" }, { name: "yearStatus", type: "string" }], display: { title: "yearName", sub: "yearStatus" } },
    { tab: "admissions", plural: "admissions", singular: "Admission", pascal: "Admission", db: "schAdmissions", fields: [{ name: "admissionKey", type: "string" }, { name: "admissionName", type: "string" }, { name: "admissionStatus", type: "select", options: "ADMISSION_STATUS_OPTIONS" }], display: { title: "admissionName", sub: "admissionStatus" } },
    { tab: "studentProfiles", plural: "studentProfiles", singular: "StudentProfile", pascal: "StudentProfile", db: "schStudentProfiles", fields: [{ name: "profileKey", type: "string" }, { name: "profileName", type: "string" }, { name: "profileType", type: "string" }], display: { title: "profileName", sub: "profileType" } },
    { tab: "parentProfiles", plural: "parentProfiles", singular: "ParentProfile", pascal: "ParentProfile", db: "schParentProfiles", fields: [{ name: "parentKey", type: "string" }, { name: "parentName", type: "string" }, { name: "parentType", type: "string" }], display: { title: "parentName", sub: "parentType" } },
    { tab: "enrollments", plural: "enrollments", singular: "Enrollment", pascal: "Enrollment", db: "schEnrollments", fields: [{ name: "enrollmentKey", type: "string" }, { name: "enrollmentName", type: "string" }, { name: "enrollmentStatus", type: "string" }], display: { title: "enrollmentName", sub: "enrollmentStatus" } },
    { tab: "subjects", plural: "subjects", singular: "Subject", pascal: "Subject", db: "schSubjects", fields: [{ name: "subjectKey", type: "string" }, { name: "subjectName", type: "string" }, { name: "subjectType", type: "string" }], display: { title: "subjectName", sub: "subjectType" } },
    { tab: "timetables", plural: "timetables", singular: "Timetable", pascal: "Timetable", db: "schTimetables", fields: [{ name: "timetableKey", type: "string" }, { name: "timetableName", type: "string" }, { name: "timetableType", type: "string" }], display: { title: "timetableName", sub: "timetableType" } },
    { tab: "examinations", plural: "examinations", singular: "Examination", pascal: "Examination", db: "schExaminations", fields: [{ name: "examKey", type: "string" }, { name: "examName", type: "string" }, { name: "examType", type: "select", options: "EXAM_TYPE_OPTIONS" }], display: { title: "examName", sub: "examType" } },
    { tab: "reportCards", plural: "reportCards", singular: "ReportCard", pascal: "ReportCard", db: "schReportCards", fields: [{ name: "reportKey", type: "string" }, { name: "reportName", type: "string" }, { name: "reportGrade", type: "string" }], display: { title: "reportName", sub: "reportGrade" } },
    { tab: "teachers", plural: "teachers", singular: "Teacher", pascal: "Teacher", db: "schTeachers", fields: [{ name: "teacherKey", type: "string" }, { name: "teacherName", type: "string" }, { name: "teacherType", type: "string" }], display: { title: "teacherName", sub: "teacherType" } },
    { tab: "staffAttendance", plural: "staffAttendance", singular: "StaffAttendance", pascal: "StaffAttendance", db: "schStaffAttendance", fields: [{ name: "attendanceKey", type: "string" }, { name: "attendanceName", type: "string" }, { name: "attendanceStatus", type: "select", options: "ATTENDANCE_STATUS_OPTIONS" }], display: { title: "attendanceName", sub: "attendanceStatus" } },
    { tab: "leaveRequests", plural: "leaveRequests", singular: "LeaveRequest", pascal: "LeaveRequest", db: "schLeaveRequests", fields: [{ name: "leaveKey", type: "string" }, { name: "leaveName", type: "string" }, { name: "leaveStatus", type: "string" }], display: { title: "leaveName", sub: "leaveStatus" } },
    { tab: "substituteTeachers", plural: "substituteTeachers", singular: "SubstituteTeacher", pascal: "SubstituteTeacher", db: "schSubstituteTeachers", fields: [{ name: "substituteKey", type: "string" }, { name: "substituteName", type: "string" }, { name: "substituteStatus", type: "string" }], display: { title: "substituteName", sub: "substituteStatus" } },
    { tab: "feeStructures", plural: "feeStructures", singular: "FeeStructure", pascal: "FeeStructure", db: "schFeeStructures", fields: [{ name: "feeKey", type: "string" }, { name: "feeName", type: "string" }, { name: "feeType", type: "string" }], display: { title: "feeName", sub: "feeType" } },
    { tab: "feeInvoices", plural: "feeInvoices", singular: "FeeInvoice", pascal: "FeeInvoice", db: "schFeeInvoices", fields: [{ name: "invoiceKey", type: "string" }, { name: "invoiceName", type: "string" }, { name: "invoiceAmount", type: "number" }], display: { title: "invoiceName", sub: "invoiceAmount" } },
    { tab: "feePayments", plural: "feePayments", singular: "FeePayment", pascal: "FeePayment", db: "schFeePayments", fields: [{ name: "paymentKey", type: "string" }, { name: "paymentName", type: "string" }, { name: "paymentAmount", type: "number" }], display: { title: "paymentName", sub: "paymentAmount" } },
    { tab: "scholarships", plural: "scholarships", singular: "Scholarship", pascal: "Scholarship", db: "schScholarships", fields: [{ name: "scholarshipKey", type: "string" }, { name: "scholarshipName", type: "string" }, { name: "scholarshipAmount", type: "number" }], display: { title: "scholarshipName", sub: "scholarshipAmount" } },
    { tab: "announcements", plural: "announcements", singular: "Announcement", pascal: "Announcement", db: "schAnnouncements", fields: [{ name: "announcementKey", type: "string" }, { name: "announcementTitle", type: "string" }, { name: "announcementType", type: "string" }], display: { title: "announcementTitle", sub: "announcementType" } },
    { tab: "messaging", plural: "messaging", singular: "Messaging", pascal: "Messaging", db: "schMessaging", fields: [{ name: "messageKey", type: "string" }, { name: "messageSubject", type: "string" }, { name: "messageType", type: "string" }], display: { title: "messageSubject", sub: "messageType" } },
    { tab: "events", plural: "events", singular: "Event", pascal: "Event", db: "schEvents", fields: [{ name: "eventKey", type: "string" }, { name: "eventName", type: "string" }, { name: "eventType", type: "string" }], display: { title: "eventName", sub: "eventType" } },
    { tab: "admissionsAnalytics", plural: "admissionsAnalytics", singular: "AdmissionsAnalytics", pascal: "AdmissionsAnalytics", db: "schAdmissionsAnalytics", fields: [{ name: "analyticsKey", type: "string" }, { name: "analyticsType", type: "string" }, { name: "analyticsScore", type: "number" }], display: { title: "analyticsKey", sub: "analyticsType" } },
    { tab: "attendanceAnalytics", plural: "attendanceAnalytics", singular: "AttendanceAnalytics", pascal: "AttendanceAnalytics", db: "schAttendanceAnalytics", fields: [{ name: "analyticsKey", type: "string" }, { name: "analyticsType", type: "string" }, { name: "analyticsScore", type: "number" }], display: { title: "analyticsKey", sub: "analyticsType" } },
    { tab: "academicAnalytics", plural: "academicAnalytics", singular: "AcademicAnalytics", pascal: "AcademicAnalytics", db: "schAcademicAnalytics", fields: [{ name: "analyticsKey", type: "string" }, { name: "analyticsType", type: "string" }, { name: "analyticsScore", type: "number" }], display: { title: "analyticsKey", sub: "analyticsType" } },
    { tab: "schoolMetrics", plural: "schoolMetrics", singular: "SchoolMetric", pascal: "SchoolMetric", db: "schSchoolMetrics", hubField: false, orgOnly: true, fields: [{ name: "metricsKey", type: "string" }, { name: "admissionsCount", type: "number" }, { name: "overallSchoolScore", type: "number" }], display: { title: "metricsKey", sub: "overallSchoolScore" } },
    { tab: "schoolHealth", plural: "schoolHealth", singular: "SchoolHealth", pascal: "SchoolHealth", db: "schSchoolHealth", hubField: false, orgOnly: true, fields: [{ name: "healthKey", type: "string" }, { name: "overallScore", type: "number" }, { name: "disasterRecoveryMode", type: "boolean" }], display: { title: "healthKey", sub: "overallScore" } },
    { tab: "executiveKpis", plural: "executiveKpis", singular: "ExecutiveKpi", pascal: "ExecutiveKpi", db: "schExecutiveKpis", fields: [{ name: "kpiKey", type: "string" }, { name: "kpiName", type: "string" }, { name: "kpiScore", type: "number" }], display: { title: "kpiName", sub: "kpiScore" } },
    { tab: "schoolFailures", plural: "schoolFailures", singular: "SchoolFailure", pascal: "SchoolFailure", db: "schSchoolFailures", fields: [{ name: "failureKey", type: "string" }, { name: "failureType", type: "string" }], display: { title: "failureKey", sub: "failureType" } },
];

const tabs = ["overview", ...entities.map((e) => e.tab), "auditLogs", "api"];
mkdirSync(join(mod, "constants"), { recursive: true });
mkdirSync(join(mod, "schemas"), { recursive: true });
mkdirSync(join(mod, "services"), { recursive: true });
mkdirSync(join(mod, "hooks"), { recursive: true });
mkdirSync(join(mod, "components"), { recursive: true });
mkdirSync(join(mod, "sdk"), { recursive: true });

// --- constants ---
writeFileSync(join(mod, "constants/index.ts"), `export const SCH_TABS = {
${tabs.map((t) => `    ${t}: "${t}",`).join("\n")}
} as const;

export const ADMISSION_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
    { value: "waitlisted", label: "Waitlisted" },
] as const;

export const EXAM_TYPE_OPTIONS = [
    { value: "midterm", label: "Midterm" },
    { value: "final", label: "Final" },
    { value: "quiz", label: "Quiz" },
    { value: "practical", label: "Practical" },
] as const;

export const ATTENDANCE_STATUS_OPTIONS = [
    { value: "present", label: "Present" },
    { value: "absent", label: "Absent" },
    { value: "late", label: "Late" },
    { value: "excused", label: "Excused" },
] as const;

export const ALERT_SEVERITY_OPTIONS = [
    { value: "critical", label: "Critical" },
    { value: "warning", label: "Warning" },
    { value: "info", label: "Info" },
] as const;

export const SCH_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "healthy", label: "Healthy" },
    { value: "degraded", label: "Degraded" },
    { value: "failed", label: "Failed" },
    { value: "open", label: "Open" },
    { value: "ready", label: "Ready" },
    { value: "running", label: "Running" },
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "waiting", label: "Waiting" },
    { value: "completed", label: "Completed" },
    { value: "available", label: "Available" },
] as const;

export const SCH_PERMISSIONS = ["sch.view", "sch.manage", "sch.approve", "sch.admin"] as const;


export const SCH_THEME = {
    primary: "blue-600",
    primaryHover: "blue-500",
    ring: "blue-500/20",
    text: "text-blue-600",
    textDark: "dark:text-blue-400",
    bg: "bg-blue-600",
    bgHover: "hover:bg-blue-500",
} as const;
`);

// --- schemas ---
const schemaLines = entities.map((e) => {
    const hubId = e.hubField === false ? "" : `\n    schoolHubId: z.string().min(1),`;
    const fieldLines = e.fields.map((f) => {
        if (f.type === "number") return `    ${f.name}: z.number().optional(),`;
        if (f.type === "boolean") return `    ${f.name}: z.boolean().optional(),`;
        return `    ${f.name}: z.string().min(1).optional(),`;
    }).join("\n");
    const schemaName = e.tab.replace(/([A-Z])/g, (m) => m.toLowerCase());
    const camel = e.tab.charAt(0).toLowerCase() + e.tab.slice(1);
    return `export const ${camel}FormSchema = z.object({${hubId}
${fieldLines}
});

export type ${camel}FormValues = z.infer<typeof ${camel}FormSchema>;`;
});
writeFileSync(join(mod, "schemas/index.ts"), `import { z } from "zod";\n\n${schemaLines.join("\n\n")}\n`);

// --- service ---
const mapperImports = [
    "buildSchoolHubLookupMaps", "buildSchAuditPayload", "buildSchDashboardStats", "buildSchPipelineInfo", "mapAuditEntry",
    ...entities.flatMap((e) => [`build${e.pascal}Payload`, `map${e.pascal}Summary`]),
    "mapCampusForStats", "mapAdmissionForStats", "mapSchoolMetricForStats", "mapExaminationForStats", "mapFeeInvoiceForStats", "mapTeacherForStats", "mapSchoolHealthForStats", "mapSchoolFailureForStats",
].join(",\n    ");

const typeImports = entities.flatMap((e) => [`${e.pascal}Summary`, `Create${e.pascal}Input`]).concat(["AuditEntry", "SchDashboardStats", "SchPipelineInfo", "SchSdkRegisterFormInput", "SchSdkRegisterFormResult", "SchSdkConfigureValidationInput", "SchSdkConfigureValidationResult", "SchSdkRunFormSubmissionInput", "SchSdkRunFormSubmissionResult"]).join(",\n    ");

const serviceMethods = entities.map((e) => {
    const maps = e.orgOnly ? "" : "\n        const maps = await this.getMaps(context.organizationId);";
    const mapCall = e.orgOnly ? `map${e.pascal}Summary` : `(r) => map${e.pascal}Summary(r, maps)`;
    const createMaps = e.orgOnly ? "" : "\n        const maps = await this.getMaps(context.organizationId);";
    const createReturn = e.orgOnly ? `return map${e.pascal}Summary(created);` : `return map${e.pascal}Summary(created, maps);`;
    return `
    async get${e.pascal}s(authUserId: string, email: string, fullName?: string | null): Promise<${e.pascal}Summary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];${maps}
        return (await databaseService.${e.db}.listByOrganization(context.organizationId)).map(${mapCall});
    }

    async create${e.pascal}(authUserId: string, email: string, input: Create${e.pascal}Input, fullName?: string | null): Promise<${e.pascal}Summary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.${e.db}.create(build${e.pascal}Payload(context.organizationId, input));
        if (!created) throw new Error("Failed to create ${e.plural}");
        await databaseService.schAuditLogs.create(buildSchAuditPayload(context.organizationId, "${e.tab.replace(/([A-Z])/g, "_$1").toLowerCase().replace(/^_/, "")}", "create", \`${e.pascal} created\`, created.id));${createMaps}
        ${createReturn}
    }`;
}).join("\n");

writeFileSync(join(mod, "services/school.service.ts"), `import {
    ${mapperImports},
} from "@/src/modules/database/lib/school-mappers";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import { createAiOrchestrationClient } from "@/src/modules/ai-orchestration/sdk";
import { createKnowledgeClient } from "@/src/modules/knowledge/sdk";
import type {
    ${typeImports},
} from "@/src/modules/school/types";

export class SchoolService {
    private async getContext(authUserId: string, email: string, fullName?: string | null) {
        return resolveOrganizationContext(authUserId, email, fullName);
    }

    private async getMaps(organizationId: string) {
        const schoolHubs = await databaseService.schSchoolHubs.listByOrganization(organizationId);
        return buildSchoolHubLookupMaps(schoolHubs);
    }

    async getDashboardStats(authUserId: string, email: string, fullName?: string | null): Promise<SchDashboardStats> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return buildSchDashboardStats({ schoolHubs: [], campuses: [], admissions: [], schoolMetrics: [], examinations: [], feeInvoices: [], teachers: [], schoolHealth: [], schoolFailures: [], auditLogs: [] });
        const [schoolHubs, campusesRaw, admissionsRaw, schoolMetricsRaw, examinationsRaw, feeInvoicesRaw, teachersRaw, schoolHealthRaw, schoolFailures, auditLogs] = await Promise.all([
            this.getSchoolHubs(authUserId, email, fullName),
            databaseService.schCampuses.listByOrganization(context.organizationId),
            databaseService.schAdmissions.listByOrganization(context.organizationId),
            databaseService.schSchoolMetrics.listByOrganization(context.organizationId),
            databaseService.schExaminations.listByOrganization(context.organizationId),
            databaseService.schFeeInvoices.listByOrganization(context.organizationId),
            databaseService.schTeachers.listByOrganization(context.organizationId),
            databaseService.schSchoolHealth.listByOrganization(context.organizationId),
            this.getSchoolFailures(authUserId, email, fullName),
            this.getAuditLogs(authUserId, email, fullName),
        ]);
        return buildSchDashboardStats({
            schoolHubs,
            campuses: campusesRaw.map(mapCampusForStats),
            admissions: admissionsRaw.map(mapAdmissionForStats),
            schoolMetrics: schoolMetricsRaw.map(mapSchoolMetricForStats),
            examinations: examinationsRaw.map(mapExaminationForStats),
            feeInvoices: feeInvoicesRaw.map(mapFeeInvoiceForStats),
            teachers: teachersRaw.map(mapTeacherForStats),
            schoolHealth: schoolHealthRaw.map(mapSchoolHealthForStats),
            schoolFailures,
            auditLogs,
        });
    }

    getPipelineInfo(): SchPipelineInfo {
        return buildSchPipelineInfo();
    }
${serviceMethods}

    async getAuditLogs(authUserId: string, email: string, fullName?: string | null): Promise<AuditEntry[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.schAuditLogs.listByOrganization(context.organizationId)).map(mapAuditEntry);
    }

    async getSchoolHubOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.schSchoolHubs.listByOrganization(context.organizationId)).map((r) => ({ id: r.id, name: r.hub_name }));
    }

    async sdkRegisterCampus(authUserId: string, email: string, input: SchSdkRegisterFormInput, fullName?: string | null): Promise<SchSdkRegisterFormResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        await ai.executeTask({ taskType: "register_campus", moduleSource: "enterprise_school_business_os", inputPayload: { ...input } });
        const created = await this.createCampus(authUserId, email, { schoolHubId: input.schoolHubId, formKey: input.formKey, formName: input.formName }, fullName);
        return { formId: created.id, formKey: created.formKey, status: created.status };
    }

    async sdkConfigureAdmission(authUserId: string, email: string, input: SchSdkConfigureValidationInput, fullName?: string | null): Promise<SchSdkConfigureValidationResult> {
        const knowledge = createKnowledgeClient(authUserId, email, fullName);
        await knowledge.search({ query: input.ruleKey ?? input.ruleName ?? "validation", limit: 3 });
        const created = await this.createRequiredRule(authUserId, email, { schoolHubId: input.schoolHubId, ruleKey: input.ruleKey, ruleName: input.ruleName }, fullName);
        return { ruleId: created.id, ruleKey: created.ruleKey, status: created.status };
    }

    async sdkRunExamWorkflow(authUserId: string, email: string, input: SchSdkRunFormSubmissionInput, fullName?: string | null): Promise<SchSdkRunFormSubmissionResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        await ai.executeTask({ taskType: "run_exam_workflow", moduleSource: "enterprise_school_business_os", inputPayload: { ...input } });
        const created = await this.createExamination(authUserId, email, { schoolHubId: input.schoolHubId, submissionKey: input.submissionKey, submissionName: input.submissionName }, fullName);
        return { submissionId: created.id, submissionKey: created.submissionKey, status: created.status };
    }
}

export const schoolService = new SchoolService();
`);

// --- hook ---
const hookTypeImports = entities.flatMap((e) => [`${e.pascal}Summary`, `Create${e.pascal}Input`]).concat(["AuditEntry", "SchDashboardStats", "SchPipelineInfo"]).join(",\n    ");
const hookStates = entities.map((e) => `    const [${e.plural}, set${e.pascal}s] = useState<${e.pascal}Summary[]>([]);`).join("\n");
const hookFetchVars = entities.map((e) => `${e.plural}List`).join(",\n            ");
const hookFetchCalls = entities.map((e) => `            schoolService.get${e.pascal}s(authUserId, email, fullName),`).join("\n");
const hookReturnProps = entities.map((e) => `${e.plural}List`).join(",\n            ");
const hookApplySets = entities.map((e) => `        set${e.pascal}s(result.${e.plural}List);`).join("\n");
const hookCreates = entities.map((e) => `    const create${e.pascal} = useCallback(async (input: Create${e.pascal}Input) => { if (!user) throw new Error("Authentication required"); await schoolService.create${e.pascal}(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);`).join("\n");
const hookReturnFields = entities.map((e) => `        ${e.plural},\n        create${e.pascal},`).join("\n");

writeFileSync(join(mod, "hooks/useSchool.ts"), `"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { schoolService } from "@/src/modules/school/services/school.service";
import type {
    ${hookTypeImports},
} from "@/src/modules/school/types";

export function useSchool() {
    const user = useAuthStore((state) => state.user);
    const authUserId = user?.id;
    const email = user?.email ?? "";
    const fullName = user?.fullName;
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<SchDashboardStats | null>(null);
    const [pipeline, setPipeline] = useState<SchPipelineInfo | null>(null);
${hookStates}
    const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
    const [schoolHubOptions, setIntegrationHubOptions] = useState<Array<{ id: string; name: string }>>([]);

    const fetchData = useCallback(async () => {
        if (!authUserId || !email) return { empty: true as const };
        const [
            statsData,
            pipelineInfo,
${hookFetchVars},
            auditLogsList,
            hubOpts,
        ] = await Promise.all([
            schoolService.getDashboardStats(authUserId, email, fullName),
            Promise.resolve(schoolService.getPipelineInfo()),
${hookFetchCalls}
            schoolService.getAuditLogs(authUserId, email, fullName),
            schoolService.getSchoolHubOptions(authUserId, email, fullName),
        ]);
        return {
            statsData,
            pipelineInfo,
${hookReturnProps},
            auditLogsList,
            hubOpts,
        };
    }, [authUserId, email, fullName]);

    const applyData = useCallback((result: Awaited<ReturnType<typeof fetchData>>) => {
        if ("empty" in result) { setLoading(false); return; }
        setStats(result.statsData);
        setPipeline(result.pipelineInfo);
${hookApplySets}
        setAuditLogs(result.auditLogsList);
        setIntegrationHubOptions(result.hubOpts);
        setLoading(false);
    }, []);

    const refresh = useCallback(async () => { applyData(await fetchData()); }, [fetchData, applyData]);

    useEffect(() => {
        let cancelled = false;
        void fetchData().then((data) => { if (!cancelled) applyData(data); }).catch(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [fetchData, applyData]);

${hookCreates}

    return {
        loading,
        stats,
        pipeline,
${hookReturnFields}
        auditLogs,
        schoolHubOptions,
        refresh,
    };
}
`);

// --- panels ---
const label = (tab) => tab.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
const panelImports = entities.map((e) => `${e.pascal}sPanel`).join(",\n    ");
const schemaImports = entities.map((e) => {
    const camel = e.tab.charAt(0).toLowerCase() + e.tab.slice(1);
    return `    ${camel}FormSchema,\n    type ${camel}FormValues,`;
}).join("\n");

const panelFns = entities.map((e) => {
    const camel = e.tab.charAt(0).toLowerCase() + e.tab.slice(1);
    const panelName = `${e.pascal}sPanel`;
    const defaults = e.fields.reduce((acc, f) => {
        acc[f.name] = f.type === "number" ? 0 : f.type === "boolean" ? false : "";
        return acc;
    }, e.hubField === false ? {} : { schoolHubId: "" });
    const defaultStr = JSON.stringify(defaults);
    const formFields = e.fields.map((f) => {
        if (f.type === "select") return `                <select {...form.register("${f.name}")} className={inputClass}>{${f.options}.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>`;
        if (f.type === "number") return `                <input type="number" step="any" {...form.register("${f.name}", { valueAsNumber: true })} placeholder="${f.name}" className={inputClass} />`;
        if (f.type === "boolean") return `                <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...form.register("${f.name}")} /> ${f.name}</label>`;
        return `                <input {...form.register("${f.name}")} placeholder="${f.name}" className={inputClass} />`;
    }).join("\n");
    const hubSelect = e.hubField === false ? "" : `                <SchoolHubSelect data={data} {...form.register("schoolHubId")} />\n`;
    const titleField = e.display.title;
    const subField = e.display.sub;
    return `export function ${panelName}({ data }: { data: SchoolData }) {
    const form = useForm<${camel}FormValues>({ resolver: zodResolver(${camel}FormSchema), defaultValues: ${defaultStr} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="${label(e.tab)}" description="Enterprise school operating system ${label(e.tab).toLowerCase()}" /><div className="mt-6 space-y-3">
                {data.${e.plural}.length === 0 ? <EmptyState title="No ${label(e.tab).toLowerCase()}" description="Create the first ${label(e.tab).toLowerCase()} record." /> : data.${e.plural}.map((item) => (
                    <ListCard key={item.id} title={String(item.${titleField})} subtitle={\`\${item.hubName ? item.hubName + " • " : ""}\${item.${subField}}\`} meta={\`\${item.status}\`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create ${label(e.tab).toLowerCase()}" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.create${e.pascal}(v))}>
${hubSelect}${formFields}
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}`;
}).join("\n\n");

writeFileSync(join(mod, "components/SchoolPanels.tsx"), `"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/src/components/ui/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { SCH_THEME, ADMISSION_STATUS_OPTIONS, ALERT_SEVERITY_OPTIONS } from "@/src/modules/school/constants";
import type { useSchool } from "@/src/modules/school/hooks/useSchool";
import {
${schemaImports}
} from "@/src/modules/school/schemas";

type SchoolData = ReturnType<typeof useSchool>;
const inputClass = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-blue-500/20 focus:ring-4 dark:border-slate-800 dark:bg-slate-950";
function SaveButton({ loading, label = "Save changes" }: { loading?: boolean; label?: string }) {
    return <button type="submit" disabled={loading} className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500 disabled:opacity-60">{loading ? "Saving..." : label}</button>;
}
function ListCard({ title, subtitle, meta }: { title: string; subtitle: string; meta?: string }) {
    return <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800"><p className="font-medium">{title}</p><p className="text-sm text-slate-500">{subtitle}</p>{meta ? <p className="mt-1 text-xs text-blue-600">{meta}</p> : null}</div>;
}
function SchoolHubSelect({ data, ...props }: { data: SchoolData } & React.SelectHTMLAttributes<HTMLSelectElement>) {
    return <select {...props} className={inputClass}><option value="">Select school operating system</option>{data.schoolHubOptions.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>;
}

export function SchoolOverviewPanel({ data }: { data: SchoolData }) {
    const pipeline = data.pipeline;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="School OS summary" description="System health, background jobs, event bus, feeInvoices, feature flags, configuration, diagnostics, and operations dashboard" /><div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ListCard title="School Hubs" subtitle={\`\${data.stats?.totalSchoolHubs ?? 0} total\`} meta={\`\${data.stats?.activeSchoolHubs ?? 0} active • \${data.stats?.campusCount ?? 0} dining areas\`} />
                <ListCard title="Connectors" subtitle={\`\${data.stats?.admissionCount ?? 0} menu categories\`} meta={\`\${data.stats?.examinationCount ?? 0} examinations • \${data.stats?.openFeeInvoiceCount ?? 0} open feeInvoices\`} />
                <ListCard title="Health" subtitle={\`\${(data.stats?.overallSchoolScore ?? 0).toFixed(1)} overall school score\`} meta={\`\${data.stats?.openFailureCount ?? 0} open failures\`} />
                <ListCard title="Audit Trail" subtitle={\`\${data.stats?.auditCount ?? 0} audit entries\`} meta="Security-first school operating system" />
            </div></Card>
            <Card hover><SectionHeader title="School operating system pipeline" description={\`\${pipeline?.previousStage ?? "configured"} → \${pipeline?.currentStage ?? "active"} → \${pipeline?.nextStage ?? "degraded"}\`} /><div className="mt-6 space-y-3">
                {pipeline?.stages?.length ? pipeline.stages.map((stage) => (
                    <ListCard key={stage.key} title={stage.label} subtitle={stage.key} meta={stage.label} />
                )) : <EmptyState title="No pipeline data" description="School operating system pipeline stages will appear as hubs are configured." />}
            </div></Card>
        </div>
    );
}

${panelFns}

export function SchoolAuditLogsPanel({ data }: { data: SchoolData }) {
    return (
        <Card hover><SectionHeader title="School OS audit history" description="Security-first audit trail for jobs, events, feeInvoices, and marketplace operations" /><div className="mt-6 space-y-3">
            {data.auditLogs.length === 0 ? <EmptyState title="No audit entries" description="Audit logs are created automatically for school operating system." /> : data.auditLogs.map((entry) => (
                <ListCard key={entry.id} title={entry.summary} subtitle={\`\${entry.entityType} • \${entry.action}\`} meta={\`\${entry.securityLevel} • \${new Date(entry.createdAt).toLocaleString()}\`} />
            ))}
        </div></Card>
    );
}

export function SchoolSdkPanel({ data }: { data: SchoolData }) {
    return (
        <Card hover><SectionHeader title="Shared School OS SDK" description="Import from @/src/modules/school/sdk for brand registration, menu configuration, and order workflow execution" /><div className="mt-6 space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <ListCard title="createSchoolClient()" subtitle="Factory for module-scoped School OS client with auth context" meta="Primary SDK for enterprise school operating system" />
            <ListCard title="sdkRegisterCampus()" subtitle="Register school operating system with AI orchestration" meta="moduleSource: enterprise_school_business_os" />
            <ListCard title="sdkConfigureAdmission()" subtitle="Configure admission with knowledge context" meta="v1/v2/v3 API versions" />
            <ListCard title="sdkRunExamWorkflow()" subtitle="Run exam workflow with audit trail" meta="Event-driven integration delivery" />
            <p className="text-xs text-slate-500">Theme: {SCH_THEME.primary} • Integration hubs loaded: {data.schoolHubs.length}</p>
            <pre className="overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">{\`import { createSchoolClient } from "@/src/modules/school/sdk";

const intg = createSchoolClient(userId, email, fullName);
await intg.registerCampus({ schoolHubId, serviceKey: "svc-001", serviceName: "Stripe" });
await intg.configureAdmission({ schoolHubId, keyName: "prod-key", apiVersion: "v1" });
await intg.runExamWorkflow({ schoolHubId, webhookKey: "wh-001", webhookName: "Events" });\`}</pre>
        </div></Card>
    );
}
`);

// --- stats ---
writeFileSync(join(mod, "components/SchoolStats.tsx"), `import { StatCard } from "@/src/components/ui/StatCard";
import type { SchDashboardStats } from "@/src/modules/school/types";

interface SchoolStatsProps { stats: SchDashboardStats | null; }

export function SchoolStats({ stats }: SchoolStatsProps) {
    const cards = [
        { title: "School Hubs", value: String(stats?.totalSchoolHubs ?? 0), detail: \`\${stats?.activeSchoolHubs ?? 0} active • \${stats?.campusCount ?? 0} dining areas\`, trend: "up" as const },
        { title: "Connectors", value: String(stats?.admissionCount ?? 0), detail: \`\${stats?.examinationCount ?? 0} examinations • \${stats?.openFeeInvoiceCount ?? 0} open feeInvoices\`, trend: "up" as const, tone: "accent" as const },
        { title: "Health Score", value: \`\${(stats?.overallSchoolScore ?? 0).toFixed(1)}\`, detail: \`\${stats?.openFailureCount ?? 0} open failures\`, trend: "up" as const },
        { title: "Audit Trail", value: String(stats?.auditCount ?? 0), detail: "Jobs, events, feeInvoices, and configuration audit entries", trend: "up" as const },
    ];
    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 [&_p:last-child]:text-blue-600 dark:[&_p:last-child]:text-blue-400">
            {cards.map((card) => <StatCard key={card.title} title={card.title} value={card.value} detail={card.detail} trend={card.trend} tone={card.tone} />)}
        </section>
    );
}
`);

// --- page ---
const tabDefs = [
    { id: "overview", label: "Overview", panel: "SchoolOverviewPanel" },
    ...entities.map((e) => ({ id: e.tab, label: label(e.tab), panel: `${e.pascal}sPanel` })),
    { id: "auditLogs", label: "Audit Logs", panel: "SchoolAuditLogsPanel" },
    { id: "api", label: "SDK", panel: "SchoolSdkPanel" },
];

writeFileSync(join(mod, "components/SchoolPage.tsx"), `"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { LoadingState } from "@/src/components/ui/LoadingState";
import {
    SchoolOverviewPanel,
    ${panelImports},
    SchoolAuditLogsPanel,
    SchoolSdkPanel,
} from "@/src/modules/school/components/SchoolPanels";
import { SchoolStats } from "@/src/modules/school/components/SchoolStats";
import { SCH_TABS } from "@/src/modules/school/constants";
import { useSchool } from "@/src/modules/school/hooks/useSchool";

const tabs = [
${tabDefs.map((t) => `    { id: SCH_TABS.${t.id}, label: "${t.label}" },`).join("\n")}
] as const;

export function SchoolPage() {
    const school = useSchool();
    const [activeTab, setActiveTab] = useState<(typeof SCH_TABS)[keyof typeof SCH_TABS]>(SCH_TABS.overview);

    if (school.loading) {
        return <div className="mx-auto max-w-7xl"><LoadingState label="Loading School OS" /></div>;
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-slate-900 dark:text-slate-100">
            <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-blue-600">V2 Program A Program B Sprint 7</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Enterprise School OS</h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                    Integration layer for the entire SaaS platform: dining areas, payment & accounting connectors, public API platform, webhook delivery, integration marketplace, API analytics, and school operating system dashboard with security-first audit and the shared School OS SDK.
                </p>
            </motion.header>
            <SchoolStats stats={school.stats} />
            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={\`rounded-full px-4 py-2 text-sm font-medium transition \${activeTab === tab.id ? "bg-blue-600 text-white" : "border border-slate-200 text-slate-600 hover:border-blue-300 dark:border-slate-800 dark:text-slate-300"}\`}>{tab.label}</button>
                ))}
            </div>
${tabDefs.map((t) => `            {activeTab === SCH_TABS.${t.id} ? <${t.panel} data={school} /> : null}`).join("\n")}
        </div>
    );
}
`);

// --- sdk ---
writeFileSync(join(mod, "sdk/index.ts"), `import { schoolService } from "@/src/modules/school/services/school.service";
import type { SchSdkRegisterFormInput, SchSdkConfigureValidationInput, SchSdkRunFormSubmissionInput } from "@/src/modules/school/types";

export class SchoolClient {
    constructor(
        private readonly authUserId: string,
        private readonly email: string,
        private readonly fullName?: string | null,
    ) {}

    async registerCampus(input: SchSdkConnectServiceInput) {
        return schoolService.sdkRegisterCampus(this.authUserId, this.email, input, this.fullName);
    }

    async configureAdmission(input: SchSdkIssueApiKeyInput) {
        return schoolService.sdkConfigureAdmission(this.authUserId, this.email, input, this.fullName);
    }

    async runExamWorkflow(input: SchSdkRegisterWebhookInput) {
        return schoolService.sdkRunExamWorkflow(this.authUserId, this.email, input, this.fullName);
    }

    async getSchoolHubs() {
        return schoolService.getSchoolHubs(this.authUserId, this.email, this.fullName);
    }

    async getDashboardStats() {
        return schoolService.getDashboardStats(this.authUserId, this.email, this.fullName);
    }

    async getPipelineInfo() {
        return schoolService.getPipelineInfo();
    }
}

export function createSchoolClient(authUserId: string, email: string, fullName?: string | null): SchoolClient {
    return new SchoolClient(authUserId, email, fullName);
}

export { schoolService };
`);

// --- index ---
writeFileSync(join(mod, "index.ts"), `export { SchoolPage } from "@/src/modules/school/components/SchoolPage";
export { SchoolStats } from "@/src/modules/school/components/SchoolStats";
export { schoolService } from "@/src/modules/school/services/school.service";
export { useSchool } from "@/src/modules/school/hooks/useSchool";
export { createSchoolClient, SchoolClient } from "@/src/modules/school/sdk";
export * from "@/src/modules/school/types";
export * from "@/src/modules/school/constants";
`);

console.log(`Generated school operating system module files. SCH_TABS count: ${tabs.length}`);
