#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

const daPath = join(root, "src/modules/database/data-access.ts");
let da = readFileSync(daPath, "utf8");

if (!da.includes("SchSchoolHubRepository")) {
    const anchor = "} from \"@/src/modules/database/repositories/restaurant-repositories\";";
    const rstImportEnd = da.indexOf(anchor) + anchor.length;
    const schImport = `
import {
    SchSchoolHubRepository,
    SchCampusRepository,
    SchBuildingRepository,
    SchClassroomRepository,
    SchAcademicYearRepository,
    SchAdmissionRepository,
    SchStudentProfileRepository,
    SchParentProfileRepository,
    SchEnrollmentRepository,
    SchSubjectRepository,
    SchTimetableRepository,
    SchExaminationRepository,
    SchReportCardRepository,
    SchTeacherRepository,
    SchStaffAttendanceRepository,
    SchLeaveRequestRepository,
    SchSubstituteTeacherRepository,
    SchFeeStructureRepository,
    SchFeeInvoiceRepository,
    SchFeePaymentRepository,
    SchScholarshipRepository,
    SchAnnouncementRepository,
    SchMessagingRepository,
    SchEventRepository,
    SchAdmissionsAnalyticsRepository,
    SchAttendanceAnalyticsRepository,
    SchAcademicAnalyticsRepository,
    SchSchoolMetricRepository,
    SchSchoolHealthRepository,
    SchExecutiveKpiRepository,
    SchSchoolFailureRepository,
    SchAuditLogRepository,
} from "@/src/modules/database/repositories/school-repositories";
`;
    da = da.slice(0, rstImportEnd) + schImport + da.slice(rstImportEnd);

    const rstProp = "    readonly rstAuditLogs: RstAuditLogRepository;";
    const schProps = `    readonly schSchoolHubs: SchSchoolHubRepository;
    readonly schCampuses: SchCampusRepository;
    readonly schBuildings: SchBuildingRepository;
    readonly schClassrooms: SchClassroomRepository;
    readonly schAcademicYears: SchAcademicYearRepository;
    readonly schAdmissions: SchAdmissionRepository;
    readonly schStudentProfiles: SchStudentProfileRepository;
    readonly schParentProfiles: SchParentProfileRepository;
    readonly schEnrollments: SchEnrollmentRepository;
    readonly schSubjects: SchSubjectRepository;
    readonly schTimetables: SchTimetableRepository;
    readonly schExaminations: SchExaminationRepository;
    readonly schReportCards: SchReportCardRepository;
    readonly schTeachers: SchTeacherRepository;
    readonly schStaffAttendance: SchStaffAttendanceRepository;
    readonly schLeaveRequests: SchLeaveRequestRepository;
    readonly schSubstituteTeachers: SchSubstituteTeacherRepository;
    readonly schFeeStructures: SchFeeStructureRepository;
    readonly schFeeInvoices: SchFeeInvoiceRepository;
    readonly schFeePayments: SchFeePaymentRepository;
    readonly schScholarships: SchScholarshipRepository;
    readonly schAnnouncements: SchAnnouncementRepository;
    readonly schMessaging: SchMessagingRepository;
    readonly schEvents: SchEventRepository;
    readonly schAdmissionsAnalytics: SchAdmissionsAnalyticsRepository;
    readonly schAttendanceAnalytics: SchAttendanceAnalyticsRepository;
    readonly schAcademicAnalytics: SchAcademicAnalyticsRepository;
    readonly schSchoolMetrics: SchSchoolMetricRepository;
    readonly schSchoolHealth: SchSchoolHealthRepository;
    readonly schExecutiveKpis: SchExecutiveKpiRepository;
    readonly schSchoolFailures: SchSchoolFailureRepository;
    readonly schAuditLogs: SchAuditLogRepository;`;
    da = da.replace(rstProp, rstProp + "\n" + schProps);

    const rstCtor = "        this.rstAuditLogs = new RstAuditLogRepository();";
    const schCtor = `        this.schSchoolHubs = new SchSchoolHubRepository();
        this.schCampuses = new SchCampusRepository();
        this.schBuildings = new SchBuildingRepository();
        this.schClassrooms = new SchClassroomRepository();
        this.schAcademicYears = new SchAcademicYearRepository();
        this.schAdmissions = new SchAdmissionRepository();
        this.schStudentProfiles = new SchStudentProfileRepository();
        this.schParentProfiles = new SchParentProfileRepository();
        this.schEnrollments = new SchEnrollmentRepository();
        this.schSubjects = new SchSubjectRepository();
        this.schTimetables = new SchTimetableRepository();
        this.schExaminations = new SchExaminationRepository();
        this.schReportCards = new SchReportCardRepository();
        this.schTeachers = new SchTeacherRepository();
        this.schStaffAttendance = new SchStaffAttendanceRepository();
        this.schLeaveRequests = new SchLeaveRequestRepository();
        this.schSubstituteTeachers = new SchSubstituteTeacherRepository();
        this.schFeeStructures = new SchFeeStructureRepository();
        this.schFeeInvoices = new SchFeeInvoiceRepository();
        this.schFeePayments = new SchFeePaymentRepository();
        this.schScholarships = new SchScholarshipRepository();
        this.schAnnouncements = new SchAnnouncementRepository();
        this.schMessaging = new SchMessagingRepository();
        this.schEvents = new SchEventRepository();
        this.schAdmissionsAnalytics = new SchAdmissionsAnalyticsRepository();
        this.schAttendanceAnalytics = new SchAttendanceAnalyticsRepository();
        this.schAcademicAnalytics = new SchAcademicAnalyticsRepository();
        this.schSchoolMetrics = new SchSchoolMetricRepository();
        this.schSchoolHealth = new SchSchoolHealthRepository();
        this.schExecutiveKpis = new SchExecutiveKpiRepository();
        this.schSchoolFailures = new SchSchoolFailureRepository();
        this.schAuditLogs = new SchAuditLogRepository();`;
    da = da.replace(rstCtor, rstCtor + "\n" + schCtor);

    writeFileSync(daPath, da, "utf8");
}

const dsPath = join(root, "src/modules/database/services/database-service.ts");
let ds = readFileSync(dsPath, "utf8");
if (!ds.includes("schSchoolHubs")) {
    ds = ds.replace(
        "    rstAuditLogs: databaseAccess.rstAuditLogs,",
        `    rstAuditLogs: databaseAccess.rstAuditLogs,
    schSchoolHubs: databaseAccess.schSchoolHubs,
    schCampuses: databaseAccess.schCampuses,
    schBuildings: databaseAccess.schBuildings,
    schClassrooms: databaseAccess.schClassrooms,
    schAcademicYears: databaseAccess.schAcademicYears,
    schAdmissions: databaseAccess.schAdmissions,
    schStudentProfiles: databaseAccess.schStudentProfiles,
    schParentProfiles: databaseAccess.schParentProfiles,
    schEnrollments: databaseAccess.schEnrollments,
    schSubjects: databaseAccess.schSubjects,
    schTimetables: databaseAccess.schTimetables,
    schExaminations: databaseAccess.schExaminations,
    schReportCards: databaseAccess.schReportCards,
    schTeachers: databaseAccess.schTeachers,
    schStaffAttendance: databaseAccess.schStaffAttendance,
    schLeaveRequests: databaseAccess.schLeaveRequests,
    schSubstituteTeachers: databaseAccess.schSubstituteTeachers,
    schFeeStructures: databaseAccess.schFeeStructures,
    schFeeInvoices: databaseAccess.schFeeInvoices,
    schFeePayments: databaseAccess.schFeePayments,
    schScholarships: databaseAccess.schScholarships,
    schAnnouncements: databaseAccess.schAnnouncements,
    schMessaging: databaseAccess.schMessaging,
    schEvents: databaseAccess.schEvents,
    schAdmissionsAnalytics: databaseAccess.schAdmissionsAnalytics,
    schAttendanceAnalytics: databaseAccess.schAttendanceAnalytics,
    schAcademicAnalytics: databaseAccess.schAcademicAnalytics,
    schSchoolMetrics: databaseAccess.schSchoolMetrics,
    schSchoolHealth: databaseAccess.schSchoolHealth,
    schExecutiveKpis: databaseAccess.schExecutiveKpis,
    schSchoolFailures: databaseAccess.schSchoolFailures,
    schAuditLogs: databaseAccess.schAuditLogs,`
    );
    writeFileSync(dsPath, ds, "utf8");
}

console.log("Wired data-access and database-service for SCH");
