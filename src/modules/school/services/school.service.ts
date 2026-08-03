import {
    buildSchoolHubLookupMaps,
    buildSchAuditPayload,
    buildSchDashboardStats,
    buildSchPipelineInfo,
    mapAuditEntry,
    buildSchoolHubPayload,
    mapSchoolHubSummary,
    buildCampusPayload,
    mapCampusSummary,
    buildBuildingPayload,
    mapBuildingSummary,
    buildClassroomPayload,
    mapClassroomSummary,
    buildAcademicYearPayload,
    mapAcademicYearSummary,
    buildAdmissionPayload,
    mapAdmissionSummary,
    buildStudentProfilePayload,
    mapStudentProfileSummary,
    buildParentProfilePayload,
    mapParentProfileSummary,
    buildEnrollmentPayload,
    mapEnrollmentSummary,
    buildSubjectPayload,
    mapSubjectSummary,
    buildTimetablePayload,
    mapTimetableSummary,
    buildExaminationPayload,
    mapExaminationSummary,
    buildReportCardPayload,
    mapReportCardSummary,
    buildTeacherPayload,
    mapTeacherSummary,
    buildStaffAttendancePayload,
    mapStaffAttendanceSummary,
    buildLeaveRequestPayload,
    mapLeaveRequestSummary,
    buildSubstituteTeacherPayload,
    mapSubstituteTeacherSummary,
    buildFeeStructurePayload,
    mapFeeStructureSummary,
    buildFeeInvoicePayload,
    mapFeeInvoiceSummary,
    buildFeePaymentPayload,
    mapFeePaymentSummary,
    buildScholarshipPayload,
    mapScholarshipSummary,
    buildAnnouncementPayload,
    mapAnnouncementSummary,
    buildMessagingPayload,
    mapMessagingSummary,
    buildEventPayload,
    mapEventSummary,
    buildAdmissionsAnalyticsPayload,
    mapAdmissionsAnalyticsSummary,
    buildAttendanceAnalyticsPayload,
    mapAttendanceAnalyticsSummary,
    buildAcademicAnalyticsPayload,
    mapAcademicAnalyticsSummary,
    buildSchoolMetricPayload,
    mapSchoolMetricSummary,
    buildSchoolHealthPayload,
    mapSchoolHealthSummary,
    buildExecutiveKpiPayload,
    mapExecutiveKpiSummary,
    buildSchoolFailurePayload,
    mapSchoolFailureSummary,
    mapCampusForStats,
    mapAdmissionForStats,
    mapSchoolMetricForStats,
    mapExaminationForStats,
    mapFeeInvoiceForStats,
    mapTeacherForStats,
    mapSchoolHealthForStats,
    mapSchoolFailureForStats,
} from "@/src/modules/database/lib/school-mappers";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import { createIndustryFrameworkClient } from "@/src/modules/industry-framework/sdk";
import { createBusinessProcessClient } from "@/src/modules/business-process/sdk";
import { createFormEngineClient } from "@/src/modules/form-engine/sdk";
import { createWorkflowEngineClient } from "@/src/modules/workflow-engine/sdk";
import { createDocumentEngineClient } from "@/src/modules/document-engine/sdk";
import type {
    SchoolHubSummary,
    CreateSchoolHubInput,
    CampusSummary,
    CreateCampusInput,
    BuildingSummary,
    CreateBuildingInput,
    ClassroomSummary,
    CreateClassroomInput,
    AcademicYearSummary,
    CreateAcademicYearInput,
    AdmissionSummary,
    CreateAdmissionInput,
    StudentProfileSummary,
    CreateStudentProfileInput,
    ParentProfileSummary,
    CreateParentProfileInput,
    EnrollmentSummary,
    CreateEnrollmentInput,
    SubjectSummary,
    CreateSubjectInput,
    TimetableSummary,
    CreateTimetableInput,
    ExaminationSummary,
    CreateExaminationInput,
    ReportCardSummary,
    CreateReportCardInput,
    TeacherSummary,
    CreateTeacherInput,
    StaffAttendanceSummary,
    CreateStaffAttendanceInput,
    LeaveRequestSummary,
    CreateLeaveRequestInput,
    SubstituteTeacherSummary,
    CreateSubstituteTeacherInput,
    FeeStructureSummary,
    CreateFeeStructureInput,
    FeeInvoiceSummary,
    CreateFeeInvoiceInput,
    FeePaymentSummary,
    CreateFeePaymentInput,
    ScholarshipSummary,
    CreateScholarshipInput,
    AnnouncementSummary,
    CreateAnnouncementInput,
    MessagingSummary,
    CreateMessagingInput,
    EventSummary,
    CreateEventInput,
    AdmissionsAnalyticsSummary,
    CreateAdmissionsAnalyticsInput,
    AttendanceAnalyticsSummary,
    CreateAttendanceAnalyticsInput,
    AcademicAnalyticsSummary,
    CreateAcademicAnalyticsInput,
    SchoolMetricSummary,
    CreateSchoolMetricInput,
    SchoolHealthSummary,
    CreateSchoolHealthInput,
    ExecutiveKpiSummary,
    CreateExecutiveKpiInput,
    SchoolFailureSummary,
    CreateSchoolFailureInput,
    AuditEntry,
    SchDashboardStats,
    SchPipelineInfo,
    SchSdkRegisterCampusInput,
    SchSdkRegisterCampusResult,
    SchSdkConfigureAdmissionInput,
    SchSdkConfigureAdmissionResult,
    SchSdkRunExamWorkflowInput,
    SchSdkRunExamWorkflowResult,
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

    async getSchoolHubs(authUserId: string, email: string, fullName?: string | null): Promise<SchoolHubSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.schSchoolHubs.listByOrganization(context.organizationId)).map((r) => mapSchoolHubSummary(r));
    }

    async createSchoolHub(authUserId: string, email: string, input: CreateSchoolHubInput, fullName?: string | null): Promise<SchoolHubSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.schSchoolHubs.create(buildSchoolHubPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create schoolHubs");
        await databaseService.schAuditLogs.create(buildSchAuditPayload(context.organizationId, "school_hubs", "create", `SchoolHub created`, created.id));
        return mapSchoolHubSummary(created);
    }

    async getCampuss(authUserId: string, email: string, fullName?: string | null): Promise<CampusSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.schCampuses.listByOrganization(context.organizationId)).map((r) => mapCampusSummary(r, maps));
    }

    async createCampus(authUserId: string, email: string, input: CreateCampusInput, fullName?: string | null): Promise<CampusSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.schCampuses.create(buildCampusPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create campuses");
        await databaseService.schAuditLogs.create(buildSchAuditPayload(context.organizationId, "campuses", "create", `Campus created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapCampusSummary(created, maps);
    }

    async getBuildings(authUserId: string, email: string, fullName?: string | null): Promise<BuildingSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.schBuildings.listByOrganization(context.organizationId)).map((r) => mapBuildingSummary(r, maps));
    }

    async createBuilding(authUserId: string, email: string, input: CreateBuildingInput, fullName?: string | null): Promise<BuildingSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.schBuildings.create(buildBuildingPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create buildings");
        await databaseService.schAuditLogs.create(buildSchAuditPayload(context.organizationId, "buildings", "create", `Building created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapBuildingSummary(created, maps);
    }

    async getClassrooms(authUserId: string, email: string, fullName?: string | null): Promise<ClassroomSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.schClassrooms.listByOrganization(context.organizationId)).map((r) => mapClassroomSummary(r, maps));
    }

    async createClassroom(authUserId: string, email: string, input: CreateClassroomInput, fullName?: string | null): Promise<ClassroomSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.schClassrooms.create(buildClassroomPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create classrooms");
        await databaseService.schAuditLogs.create(buildSchAuditPayload(context.organizationId, "classrooms", "create", `Classroom created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapClassroomSummary(created, maps);
    }

    async getAcademicYears(authUserId: string, email: string, fullName?: string | null): Promise<AcademicYearSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.schAcademicYears.listByOrganization(context.organizationId)).map((r) => mapAcademicYearSummary(r, maps));
    }

    async createAcademicYear(authUserId: string, email: string, input: CreateAcademicYearInput, fullName?: string | null): Promise<AcademicYearSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.schAcademicYears.create(buildAcademicYearPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create academicYears");
        await databaseService.schAuditLogs.create(buildSchAuditPayload(context.organizationId, "academic_years", "create", `AcademicYear created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapAcademicYearSummary(created, maps);
    }

    async getAdmissions(authUserId: string, email: string, fullName?: string | null): Promise<AdmissionSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.schAdmissions.listByOrganization(context.organizationId)).map((r) => mapAdmissionSummary(r, maps));
    }

    async createAdmission(authUserId: string, email: string, input: CreateAdmissionInput, fullName?: string | null): Promise<AdmissionSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.schAdmissions.create(buildAdmissionPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create admissions");
        await databaseService.schAuditLogs.create(buildSchAuditPayload(context.organizationId, "admissions", "create", `Admission created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapAdmissionSummary(created, maps);
    }

    async getStudentProfiles(authUserId: string, email: string, fullName?: string | null): Promise<StudentProfileSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.schStudentProfiles.listByOrganization(context.organizationId)).map((r) => mapStudentProfileSummary(r, maps));
    }

    async createStudentProfile(authUserId: string, email: string, input: CreateStudentProfileInput, fullName?: string | null): Promise<StudentProfileSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.schStudentProfiles.create(buildStudentProfilePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create studentProfiles");
        await databaseService.schAuditLogs.create(buildSchAuditPayload(context.organizationId, "student_profiles", "create", `StudentProfile created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapStudentProfileSummary(created, maps);
    }

    async getParentProfiles(authUserId: string, email: string, fullName?: string | null): Promise<ParentProfileSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.schParentProfiles.listByOrganization(context.organizationId)).map((r) => mapParentProfileSummary(r, maps));
    }

    async createParentProfile(authUserId: string, email: string, input: CreateParentProfileInput, fullName?: string | null): Promise<ParentProfileSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.schParentProfiles.create(buildParentProfilePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create parentProfiles");
        await databaseService.schAuditLogs.create(buildSchAuditPayload(context.organizationId, "parent_profiles", "create", `ParentProfile created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapParentProfileSummary(created, maps);
    }

    async getEnrollments(authUserId: string, email: string, fullName?: string | null): Promise<EnrollmentSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.schEnrollments.listByOrganization(context.organizationId)).map((r) => mapEnrollmentSummary(r, maps));
    }

    async createEnrollment(authUserId: string, email: string, input: CreateEnrollmentInput, fullName?: string | null): Promise<EnrollmentSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.schEnrollments.create(buildEnrollmentPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create enrollments");
        await databaseService.schAuditLogs.create(buildSchAuditPayload(context.organizationId, "enrollments", "create", `Enrollment created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapEnrollmentSummary(created, maps);
    }

    async getSubjects(authUserId: string, email: string, fullName?: string | null): Promise<SubjectSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.schSubjects.listByOrganization(context.organizationId)).map((r) => mapSubjectSummary(r, maps));
    }

    async createSubject(authUserId: string, email: string, input: CreateSubjectInput, fullName?: string | null): Promise<SubjectSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.schSubjects.create(buildSubjectPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create subjects");
        await databaseService.schAuditLogs.create(buildSchAuditPayload(context.organizationId, "subjects", "create", `Subject created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapSubjectSummary(created, maps);
    }

    async getTimetables(authUserId: string, email: string, fullName?: string | null): Promise<TimetableSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.schTimetables.listByOrganization(context.organizationId)).map((r) => mapTimetableSummary(r, maps));
    }

    async createTimetable(authUserId: string, email: string, input: CreateTimetableInput, fullName?: string | null): Promise<TimetableSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.schTimetables.create(buildTimetablePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create timetables");
        await databaseService.schAuditLogs.create(buildSchAuditPayload(context.organizationId, "timetables", "create", `Timetable created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapTimetableSummary(created, maps);
    }

    async getExaminations(authUserId: string, email: string, fullName?: string | null): Promise<ExaminationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.schExaminations.listByOrganization(context.organizationId)).map((r) => mapExaminationSummary(r, maps));
    }

    async createExamination(authUserId: string, email: string, input: CreateExaminationInput, fullName?: string | null): Promise<ExaminationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.schExaminations.create(buildExaminationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create examinations");
        await databaseService.schAuditLogs.create(buildSchAuditPayload(context.organizationId, "examinations", "create", `Examination created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapExaminationSummary(created, maps);
    }

    async getReportCards(authUserId: string, email: string, fullName?: string | null): Promise<ReportCardSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.schReportCards.listByOrganization(context.organizationId)).map((r) => mapReportCardSummary(r, maps));
    }

    async createReportCard(authUserId: string, email: string, input: CreateReportCardInput, fullName?: string | null): Promise<ReportCardSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.schReportCards.create(buildReportCardPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create reportCards");
        await databaseService.schAuditLogs.create(buildSchAuditPayload(context.organizationId, "report_cards", "create", `ReportCard created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapReportCardSummary(created, maps);
    }

    async getTeachers(authUserId: string, email: string, fullName?: string | null): Promise<TeacherSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.schTeachers.listByOrganization(context.organizationId)).map((r) => mapTeacherSummary(r, maps));
    }

    async createTeacher(authUserId: string, email: string, input: CreateTeacherInput, fullName?: string | null): Promise<TeacherSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.schTeachers.create(buildTeacherPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create teachers");
        await databaseService.schAuditLogs.create(buildSchAuditPayload(context.organizationId, "teachers", "create", `Teacher created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapTeacherSummary(created, maps);
    }

    async getStaffAttendances(authUserId: string, email: string, fullName?: string | null): Promise<StaffAttendanceSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.schStaffAttendance.listByOrganization(context.organizationId)).map((r) => mapStaffAttendanceSummary(r, maps));
    }

    async createStaffAttendance(authUserId: string, email: string, input: CreateStaffAttendanceInput, fullName?: string | null): Promise<StaffAttendanceSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.schStaffAttendance.create(buildStaffAttendancePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create staffAttendance");
        await databaseService.schAuditLogs.create(buildSchAuditPayload(context.organizationId, "staff_attendance", "create", `StaffAttendance created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapStaffAttendanceSummary(created, maps);
    }

    async getLeaveRequests(authUserId: string, email: string, fullName?: string | null): Promise<LeaveRequestSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.schLeaveRequests.listByOrganization(context.organizationId)).map((r) => mapLeaveRequestSummary(r, maps));
    }

    async createLeaveRequest(authUserId: string, email: string, input: CreateLeaveRequestInput, fullName?: string | null): Promise<LeaveRequestSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.schLeaveRequests.create(buildLeaveRequestPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create leaveRequests");
        await databaseService.schAuditLogs.create(buildSchAuditPayload(context.organizationId, "leave_requests", "create", `LeaveRequest created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapLeaveRequestSummary(created, maps);
    }

    async getSubstituteTeachers(authUserId: string, email: string, fullName?: string | null): Promise<SubstituteTeacherSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.schSubstituteTeachers.listByOrganization(context.organizationId)).map((r) => mapSubstituteTeacherSummary(r, maps));
    }

    async createSubstituteTeacher(authUserId: string, email: string, input: CreateSubstituteTeacherInput, fullName?: string | null): Promise<SubstituteTeacherSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.schSubstituteTeachers.create(buildSubstituteTeacherPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create substituteTeachers");
        await databaseService.schAuditLogs.create(buildSchAuditPayload(context.organizationId, "substitute_teachers", "create", `SubstituteTeacher created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapSubstituteTeacherSummary(created, maps);
    }

    async getFeeStructures(authUserId: string, email: string, fullName?: string | null): Promise<FeeStructureSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.schFeeStructures.listByOrganization(context.organizationId)).map((r) => mapFeeStructureSummary(r, maps));
    }

    async createFeeStructure(authUserId: string, email: string, input: CreateFeeStructureInput, fullName?: string | null): Promise<FeeStructureSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.schFeeStructures.create(buildFeeStructurePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create feeStructures");
        await databaseService.schAuditLogs.create(buildSchAuditPayload(context.organizationId, "fee_structures", "create", `FeeStructure created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapFeeStructureSummary(created, maps);
    }

    async getFeeInvoices(authUserId: string, email: string, fullName?: string | null): Promise<FeeInvoiceSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.schFeeInvoices.listByOrganization(context.organizationId)).map((r) => mapFeeInvoiceSummary(r, maps));
    }

    async createFeeInvoice(authUserId: string, email: string, input: CreateFeeInvoiceInput, fullName?: string | null): Promise<FeeInvoiceSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.schFeeInvoices.create(buildFeeInvoicePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create feeInvoices");
        await databaseService.schAuditLogs.create(buildSchAuditPayload(context.organizationId, "fee_invoices", "create", `FeeInvoice created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapFeeInvoiceSummary(created, maps);
    }

    async getFeePayments(authUserId: string, email: string, fullName?: string | null): Promise<FeePaymentSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.schFeePayments.listByOrganization(context.organizationId)).map((r) => mapFeePaymentSummary(r, maps));
    }

    async createFeePayment(authUserId: string, email: string, input: CreateFeePaymentInput, fullName?: string | null): Promise<FeePaymentSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.schFeePayments.create(buildFeePaymentPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create feePayments");
        await databaseService.schAuditLogs.create(buildSchAuditPayload(context.organizationId, "fee_payments", "create", `FeePayment created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapFeePaymentSummary(created, maps);
    }

    async getScholarships(authUserId: string, email: string, fullName?: string | null): Promise<ScholarshipSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.schScholarships.listByOrganization(context.organizationId)).map((r) => mapScholarshipSummary(r, maps));
    }

    async createScholarship(authUserId: string, email: string, input: CreateScholarshipInput, fullName?: string | null): Promise<ScholarshipSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.schScholarships.create(buildScholarshipPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create scholarships");
        await databaseService.schAuditLogs.create(buildSchAuditPayload(context.organizationId, "scholarships", "create", `Scholarship created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapScholarshipSummary(created, maps);
    }

    async getAnnouncements(authUserId: string, email: string, fullName?: string | null): Promise<AnnouncementSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.schAnnouncements.listByOrganization(context.organizationId)).map((r) => mapAnnouncementSummary(r, maps));
    }

    async createAnnouncement(authUserId: string, email: string, input: CreateAnnouncementInput, fullName?: string | null): Promise<AnnouncementSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.schAnnouncements.create(buildAnnouncementPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create announcements");
        await databaseService.schAuditLogs.create(buildSchAuditPayload(context.organizationId, "announcements", "create", `Announcement created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapAnnouncementSummary(created, maps);
    }

    async getMessagings(authUserId: string, email: string, fullName?: string | null): Promise<MessagingSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.schMessaging.listByOrganization(context.organizationId)).map((r) => mapMessagingSummary(r, maps));
    }

    async createMessaging(authUserId: string, email: string, input: CreateMessagingInput, fullName?: string | null): Promise<MessagingSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.schMessaging.create(buildMessagingPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create messaging");
        await databaseService.schAuditLogs.create(buildSchAuditPayload(context.organizationId, "messaging", "create", `Messaging created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapMessagingSummary(created, maps);
    }

    async getEvents(authUserId: string, email: string, fullName?: string | null): Promise<EventSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.schEvents.listByOrganization(context.organizationId)).map((r) => mapEventSummary(r, maps));
    }

    async createEvent(authUserId: string, email: string, input: CreateEventInput, fullName?: string | null): Promise<EventSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.schEvents.create(buildEventPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create events");
        await databaseService.schAuditLogs.create(buildSchAuditPayload(context.organizationId, "events", "create", `Event created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapEventSummary(created, maps);
    }

    async getAdmissionsAnalyticss(authUserId: string, email: string, fullName?: string | null): Promise<AdmissionsAnalyticsSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.schAdmissionsAnalytics.listByOrganization(context.organizationId)).map((r) => mapAdmissionsAnalyticsSummary(r, maps));
    }

    async createAdmissionsAnalytics(authUserId: string, email: string, input: CreateAdmissionsAnalyticsInput, fullName?: string | null): Promise<AdmissionsAnalyticsSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.schAdmissionsAnalytics.create(buildAdmissionsAnalyticsPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create admissionsAnalytics");
        await databaseService.schAuditLogs.create(buildSchAuditPayload(context.organizationId, "admissions_analytics", "create", `AdmissionsAnalytics created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapAdmissionsAnalyticsSummary(created, maps);
    }

    async getAttendanceAnalyticss(authUserId: string, email: string, fullName?: string | null): Promise<AttendanceAnalyticsSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.schAttendanceAnalytics.listByOrganization(context.organizationId)).map((r) => mapAttendanceAnalyticsSummary(r, maps));
    }

    async createAttendanceAnalytics(authUserId: string, email: string, input: CreateAttendanceAnalyticsInput, fullName?: string | null): Promise<AttendanceAnalyticsSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.schAttendanceAnalytics.create(buildAttendanceAnalyticsPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create attendanceAnalytics");
        await databaseService.schAuditLogs.create(buildSchAuditPayload(context.organizationId, "attendance_analytics", "create", `AttendanceAnalytics created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapAttendanceAnalyticsSummary(created, maps);
    }

    async getAcademicAnalyticss(authUserId: string, email: string, fullName?: string | null): Promise<AcademicAnalyticsSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.schAcademicAnalytics.listByOrganization(context.organizationId)).map((r) => mapAcademicAnalyticsSummary(r, maps));
    }

    async createAcademicAnalytics(authUserId: string, email: string, input: CreateAcademicAnalyticsInput, fullName?: string | null): Promise<AcademicAnalyticsSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.schAcademicAnalytics.create(buildAcademicAnalyticsPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create academicAnalytics");
        await databaseService.schAuditLogs.create(buildSchAuditPayload(context.organizationId, "academic_analytics", "create", `AcademicAnalytics created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapAcademicAnalyticsSummary(created, maps);
    }

    async getSchoolMetrics(authUserId: string, email: string, fullName?: string | null): Promise<SchoolMetricSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.schSchoolMetrics.listByOrganization(context.organizationId)).map(mapSchoolMetricSummary);
    }

    async createSchoolMetric(authUserId: string, email: string, input: CreateSchoolMetricInput, fullName?: string | null): Promise<SchoolMetricSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.schSchoolMetrics.create(buildSchoolMetricPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create schoolMetrics");
        await databaseService.schAuditLogs.create(buildSchAuditPayload(context.organizationId, "school_metrics", "create", `SchoolMetric created`, created.id));
        return mapSchoolMetricSummary(created);
    }

    async getSchoolHealths(authUserId: string, email: string, fullName?: string | null): Promise<SchoolHealthSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.schSchoolHealth.listByOrganization(context.organizationId)).map(mapSchoolHealthSummary);
    }

    async createSchoolHealth(authUserId: string, email: string, input: CreateSchoolHealthInput, fullName?: string | null): Promise<SchoolHealthSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.schSchoolHealth.create(buildSchoolHealthPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create schoolHealth");
        await databaseService.schAuditLogs.create(buildSchAuditPayload(context.organizationId, "school_health", "create", `SchoolHealth created`, created.id));
        return mapSchoolHealthSummary(created);
    }

    async getExecutiveKpis(authUserId: string, email: string, fullName?: string | null): Promise<ExecutiveKpiSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.schExecutiveKpis.listByOrganization(context.organizationId)).map((r) => mapExecutiveKpiSummary(r, maps));
    }

    async createExecutiveKpi(authUserId: string, email: string, input: CreateExecutiveKpiInput, fullName?: string | null): Promise<ExecutiveKpiSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.schExecutiveKpis.create(buildExecutiveKpiPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create executiveKpis");
        await databaseService.schAuditLogs.create(buildSchAuditPayload(context.organizationId, "executive_kpis", "create", `ExecutiveKpi created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapExecutiveKpiSummary(created, maps);
    }

    async getSchoolFailures(authUserId: string, email: string, fullName?: string | null): Promise<SchoolFailureSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.schSchoolFailures.listByOrganization(context.organizationId)).map((r) => mapSchoolFailureSummary(r, maps));
    }

    async createSchoolFailure(authUserId: string, email: string, input: CreateSchoolFailureInput, fullName?: string | null): Promise<SchoolFailureSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.schSchoolFailures.create(buildSchoolFailurePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create schoolFailures");
        await databaseService.schAuditLogs.create(buildSchAuditPayload(context.organizationId, "school_failures", "create", `SchoolFailure created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapSchoolFailureSummary(created, maps);
    }

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

    async sdkRegisterCampus(authUserId: string, email: string, input: SchSdkRegisterCampusInput, fullName?: string | null): Promise<SchSdkRegisterCampusResult> {
        const ifr = createIndustryFrameworkClient(authUserId, email, fullName);
        await ifr.getFrameworkHubs();
        const created = await this.createCampus(authUserId, email, { schoolHubId: input.schoolHubId, campusKey: input.campusKey, campusName: input.campusName }, fullName);
        return { campusId: created.id, campusKey: created.campusKey, status: created.status };
    }

    async sdkConfigureAdmission(authUserId: string, email: string, input: SchSdkConfigureAdmissionInput, fullName?: string | null): Promise<SchSdkConfigureAdmissionResult> {
        const dfe = createFormEngineClient(authUserId, email, fullName);
        await dfe.getFormHubs();
        const created = await this.createAdmission(authUserId, email, { schoolHubId: input.schoolHubId, admissionKey: input.admissionKey, admissionName: input.admissionName }, fullName);
        return { admissionId: created.id, admissionKey: created.admissionKey, status: created.status };
    }

    async sdkRunExamWorkflow(authUserId: string, email: string, input: SchSdkRunExamWorkflowInput, fullName?: string | null): Promise<SchSdkRunExamWorkflowResult> {
        const dwe = createWorkflowEngineClient(authUserId, email, fullName);
        await dwe.getWorkflowHubs();
        const bpf = createBusinessProcessClient(authUserId, email, fullName);
        await bpf.getProcessHubs();
        const dde = createDocumentEngineClient(authUserId, email, fullName);
        await dde.getDocumentHubs();
        const created = await this.createExamination(authUserId, email, { schoolHubId: input.schoolHubId, examKey: input.examKey, examName: input.examName }, fullName);
        return { examId: created.id, examKey: created.examKey, status: created.status };
    }
}

export const schoolService = new SchoolService();
