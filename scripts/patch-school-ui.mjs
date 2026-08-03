#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const genPath = join(root, "scripts/generate-restaurant-ui.mjs");
const outPath = join(root, "scripts/generate-school-ui.mjs");
let s = readFileSync(genPath, "utf8");

const entitiesBlock = `const entities = [
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
];`;

s = s.replace(/const mod = join\(root, "src\/modules\/restaurant"\);/, 'const mod = join(root, "src/modules/school");');
s = s.replace(/const entities = \[[\s\S]*?\];/, entitiesBlock);

const reps = [
    [/restaurantHubs/g, "schoolHubs"],
    [/restaurantHubOptions/g, "schoolHubOptions"],
    [/getRestaurantHubs/g, "getSchoolHubs"],
    [/getRestaurantHubOptions/g, "getSchoolHubOptions"],
    [/RestaurantHubSelect/g, "SchoolHubSelect"],
    [/buildRestaurantHubLookupMaps/g, "buildSchoolHubLookupMaps"],
    [/restaurantHubId/g, "schoolHubId"],
    [/Restaurant Hubs/g, "School Hubs"],
    [/Restaurant Hub/g, "School OS"],
    [/restaurant hub/g, "school hub"],
    [/restaurant/g, "school"],
    [/Restaurant/g, "School"],
    [/databaseService\.sch/g, "databaseService.sch"],
    [/buildRst/g, "buildSch"],
    [/mapRst/g, "mapSch"],
    [/RstDashboardStats/g, "SchDashboardStats"],
    [/RstPipelineInfo/g, "SchPipelineInfo"],
    [/RstSdk/g, "SchSdk"],
    [/RST_TABS/g, "SCH_TABS"],
    [/RST_THEME/g, "SCH_THEME"],
    [/RST_PERMISSIONS/g, "SCH_PERMISSIONS"],
    [/RST_STATUS_OPTIONS/g, "SCH_STATUS_OPTIONS"],
    [/Program B Sprint 6/g, "Program B Sprint 7"],
    [/orange-600/g, "blue-600"],
    [/orange-500/g, "blue-500"],
    [/orange-400/g, "blue-400"],
    [/orange-300/g, "blue-300"],
    [/ring-orange/g, "ring-blue"],
    [/bg-orange/g, "bg-blue"],
    [/text-orange/g, "text-blue"],
    [/hover:bg-orange/g, "hover:bg-blue"],
    [/hover:border-orange/g, "hover:border-blue"],
    [/mapDiningAreaForStats/g, "mapCampusForStats"],
    [/mapMenuCategoryForStats/g, "mapAdmissionForStats"],
    [/mapSchoolMetricForStats/g, "mapSchoolMetricForStats"],
    [/mapOrderForStats/g, "mapExaminationForStats"],
    [/mapReservationForStats/g, "mapFeeInvoiceForStats"],
    [/mapKitchenStationForStats/g, "mapTeacherForStats"],
    [/mapSchoolHealthForStats/g, "mapSchoolHealthForStats"],
    [/mapSchoolFailureForStats/g, "mapSchoolFailureForStats"],
    [/diningAreas/g, "campuses"],
    [/menuCategories/g, "admissions"],
    [/schoolMetrics/g, "schoolMetrics"],
    [/orders/g, "examinations"],
    [/reservations/g, "feeInvoices"],
    [/kitchenStations/g, "teachers"],
    [/schoolHealth/g, "schoolHealth"],
    [/schoolFailures/g, "schoolFailures"],
    [/totalSchoolHubs/g, "totalSchoolHubs"],
    [/activeSchoolHubs/g, "activeSchoolHubs"],
    [/diningAreaCount/g, "campusCount"],
    [/menuCategoryCount/g, "admissionCount"],
    [/orderCount/g, "examinationCount"],
    [/openReservationCount/g, "openFeeInvoiceCount"],
    [/overallSchoolScore/g, "overallSchoolScore"],
    [/orderCountScore/g, "admissionsCountScore"],
    [/revenueTotalScore/g, "revenueTotalScore"],
    [/averageBillScore/g, "attendanceRateScore"],
    [/occupancyRateScore/g, "academicPerformanceScore"],
    [/kitchenPerformanceScore/g, "feeCollectionRateScore"],
    [/sdkRegisterBrand/g, "sdkRegisterCampus"],
    [/sdkConfigureMenu/g, "sdkConfigureAdmission"],
    [/sdkRunOrderWorkflow/g, "sdkRunExamWorkflow"],
    [/registerBrand/g, "registerCampus"],
    [/configureMenu/g, "configureAdmission"],
    [/runOrderWorkflow/g, "runExamWorkflow"],
    [/createBrand/g, "createCampus"],
    [/createMenuCategory/g, "createAdmission"],
    [/createOrder/g, "createExamination"],
    [/Register brand/g, "Register campus"],
    [/Configure menu category/g, "Configure admission"],
    [/Run order workflow/g, "Run exam workflow"],
    [/brands, menus, orders, kitchen stations, reservations, and customer profiles/g, "campuses, admissions, examinations, teachers, fee invoices, and student profiles"],
    [/Brands, menus, orders, kitchen stations, reservations, customer profiles, and restaurant business operating system outputs/g, "Campuses, admissions, examinations, teachers, fee invoices, student profiles, and school business operating system outputs"],
    [/School operating system pipeline/g, "School operating system pipeline"],
    [/Generated school module/g, "Generated school module"],
    [/enterprise_restaurant_business_os/g, "enterprise_school_business_os"],
    [/register_brand/g, "register_campus"],
    [/run_order_workflow/g, "run_exam_workflow"],
    [/"rst\.view"/g, '"sch.view"'],
    [/"rst\.manage"/g, '"sch.manage"'],
    [/"rst\.approve"/g, '"sch.approve"'],
    [/"rst\.admin"/g, '"sch.admin"'],
    [/rstSchoolHubs/g, "schSchoolHubs"],
    [/getSchoolFailures/g, "getSchoolFailures"],
    [/school-mappers/g, "school-mappers"],
    [/buildSchoolHubPayload/g, "buildSchoolHubPayload"],
    [/mapSchoolHubSummary/g, "mapSchoolHubSummary"],
    [/buildSchAuditPayload/g, "buildSchAuditPayload"],
    [/Enterprise School OS/g, "Enterprise School OS"],
    [/createSchoolClient/g, "createSchoolClient"],
    [/SchoolClient/g, "SchoolClient"],
    [/databaseService\.rst/g, "databaseService.sch"],
];

for (const [from, to] of reps) s = s.replace(from, to);

s = s.replace(/databaseService\.schBrands\.listByOrganization/g, "databaseService.schCampuses.listByOrganization");
s = s.replace(/databaseService\.schDiningAreas\.listByOrganization/g, "databaseService.schCampuses.listByOrganization");
s = s.replace(/databaseService\.schMenuCategories\.listByOrganization/g, "databaseService.schAdmissions.listByOrganization");
s = s.replace(/databaseService\.schSchoolMetrics\.listByOrganization/g, "databaseService.schSchoolMetrics.listByOrganization");
s = s.replace(/databaseService\.schOrders\.listByOrganization/g, "databaseService.schExaminations.listByOrganization");
s = s.replace(/databaseService\.schReservations\.listByOrganization/g, "databaseService.schFeeInvoices.listByOrganization");
s = s.replace(/databaseService\.schKitchenStations\.listByOrganization/g, "databaseService.schTeachers.listByOrganization");
s = s.replace(/databaseService\.schSchoolHealth\.listByOrganization/g, "databaseService.schSchoolHealth.listByOrganization");
s = s.replace(/databaseService\.schSchoolHubs\.listByOrganization/g, "databaseService.schSchoolHubs.listByOrganization");
s = s.replace(/databaseService\.schAuditLogs/g, "databaseService.schAuditLogs");

s = s.replace(
    /async sdkRegisterCampus\(authUserId: string, email: string, input: SchSdkRegisterBrandInput[\s\S]*?return \{ brandId: created\.id, brandKey: created\.brandKey, status: created\.status \};\n    \}/,
    `async sdkRegisterCampus(authUserId: string, email: string, input: SchSdkRegisterCampusInput, fullName?: string | null): Promise<SchSdkRegisterCampusResult> {
        const ifr = createIndustryFrameworkClient(authUserId, email, fullName);
        await ifr.getIndustryFrameworkHubs();
        const created = await this.createCampus(authUserId, email, { schoolHubId: input.schoolHubId, campusKey: input.campusKey, campusName: input.campusName }, fullName);
        return { campusId: created.id, campusKey: created.campusKey, status: created.status };
    }`,
);

s = s.replace(
    /async sdkConfigureAdmission\(authUserId: string, email: string, input: SchSdkConfigureMenuInput[\s\S]*?return \{ categoryId: created\.id, categoryKey: created\.categoryKey, status: created\.status \};\n    \}/,
    `async sdkConfigureAdmission(authUserId: string, email: string, input: SchSdkConfigureAdmissionInput, fullName?: string | null): Promise<SchSdkConfigureAdmissionResult> {
        const dfe = createFormEngineClient(authUserId, email, fullName);
        await dfe.getFormEngineHubs();
        const created = await this.createAdmission(authUserId, email, { schoolHubId: input.schoolHubId, admissionKey: input.admissionKey, admissionName: input.admissionName }, fullName);
        return { admissionId: created.id, admissionKey: created.admissionKey, status: created.status };
    }`,
);

s = s.replace(
    /async sdkRunExamWorkflow\(authUserId: string, email: string, input: SchSdkRunOrderWorkflowInput[\s\S]*?return \{ orderId: created\.id, orderKey: created\.orderKey, status: created\.status \};\n    \}/,
    `async sdkRunExamWorkflow(authUserId: string, email: string, input: SchSdkRunExamWorkflowInput, fullName?: string | null): Promise<SchSdkRunExamWorkflowResult> {
        const dwe = createWorkflowEngineClient(authUserId, email, fullName);
        await dwe.getWorkflowEngineHubs();
        const bpf = createBusinessProcessClient(authUserId, email, fullName);
        await bpf.getBusinessProcessHubs();
        const dde = createDocumentEngineClient(authUserId, email, fullName);
        await dde.getDocumentHubs();
        const created = await this.createExamination(authUserId, email, { schoolHubId: input.schoolHubId, examKey: input.examKey, examName: input.examName }, fullName);
        return { examId: created.id, examKey: created.examKey, status: created.status };
    }`,
);

const schOptionsBlock = `export const ADMISSION_STATUS_OPTIONS = [
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

`;

s = s.replace(
    /(writeFileSync\(join\(mod, "constants\/index\.ts"\), `export const SCH_TABS = \{[\s\S]*?\} as const;\r?\n\r?\n)[\s\S]*?(\r?\nexport const SCH_THEME)/,
    `$1${schOptionsBlock}$2`,
);

s = s.replace(/Select school hub/g, "Select school hub");
s = s.replace(/ORDER_TYPE_OPTIONS/g, "ADMISSION_STATUS_OPTIONS");

writeFileSync(outPath, s, "utf8");
console.log("Patched generate-school-ui.mjs");
