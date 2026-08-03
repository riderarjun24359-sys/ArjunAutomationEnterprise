import type { DbSchSchoolHub,
    DbSchCampus,
    DbSchBuilding,
    DbSchClassroom,
    DbSchAcademicYear,
    DbSchAdmission,
    DbSchStudentProfile,
    DbSchParentProfile,
    DbSchEnrollment,
    DbSchSubject,
    DbSchTimetable,
    DbSchExamination,
    DbSchReportCard,
    DbSchTeacher,
    DbSchStaffAttendance,
    DbSchLeaveRequest,
    DbSchSubstituteTeacher,
    DbSchFeeStructure,
    DbSchFeeInvoice,
    DbSchFeePayment,
    DbSchScholarship,
    DbSchAnnouncement,
    DbSchMessaging,
    DbSchEvent,
    DbSchAdmissionsAnalytics,
    DbSchAttendanceAnalytics,
    DbSchAcademicAnalytics,
    DbSchSchoolMetric,
    DbSchSchoolHealth,
    DbSchExecutiveKpi,
    DbSchSchoolFailure,
    DbSchAuditLog } from "@/src/modules/database/types/platform";
import type { CreateSchoolHubInput,
    SchoolHubSummary,
    CreateCampusInput,
    CampusSummary,
    CreateBuildingInput,
    BuildingSummary,
    CreateClassroomInput,
    ClassroomSummary,
    CreateAcademicYearInput,
    AcademicYearSummary,
    CreateAdmissionInput,
    AdmissionSummary,
    CreateStudentProfileInput,
    StudentProfileSummary,
    CreateParentProfileInput,
    ParentProfileSummary,
    CreateEnrollmentInput,
    EnrollmentSummary,
    CreateSubjectInput,
    SubjectSummary,
    CreateTimetableInput,
    TimetableSummary,
    CreateExaminationInput,
    ExaminationSummary,
    CreateReportCardInput,
    ReportCardSummary,
    CreateTeacherInput,
    TeacherSummary,
    CreateStaffAttendanceInput,
    StaffAttendanceSummary,
    CreateLeaveRequestInput,
    LeaveRequestSummary,
    CreateSubstituteTeacherInput,
    SubstituteTeacherSummary,
    CreateFeeStructureInput,
    FeeStructureSummary,
    CreateFeeInvoiceInput,
    FeeInvoiceSummary,
    CreateFeePaymentInput,
    FeePaymentSummary,
    CreateScholarshipInput,
    ScholarshipSummary,
    CreateAnnouncementInput,
    AnnouncementSummary,
    CreateMessagingInput,
    MessagingSummary,
    CreateEventInput,
    EventSummary,
    CreateAdmissionsAnalyticsInput,
    AdmissionsAnalyticsSummary,
    CreateAttendanceAnalyticsInput,
    AttendanceAnalyticsSummary,
    CreateAcademicAnalyticsInput,
    AcademicAnalyticsSummary,
    CreateSchoolMetricInput,
    SchoolMetricSummary,
    CreateSchoolHealthInput,
    SchoolHealthSummary,
    CreateExecutiveKpiInput,
    ExecutiveKpiSummary,
    CreateSchoolFailureInput,
    SchoolFailureSummary,
    SchDashboardStats,
    SchPipelineInfo,
    AuditEntry } from "@/src/modules/school/types";

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

export function mapSchoolHubSummary(record: DbSchSchoolHub): SchoolHubSummary {
    return {
        id: record.id,
        hubKey: record.hub_key as string,
        hubName: record.hub_name as string,
        environment: record.environment as string,
        status: record.status,
    };
}

export function buildSchoolHubPayload(organizationId: string, input: CreateSchoolHubInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_key: input.hubKey ?? '',
        hub_name: input.hubName ?? '',
        environment: input.environment ?? '',
        status: "active",
    };
}

export function mapCampusSummary(record: DbSchCampus, maps?: { hubNameById: Map<string, string> }): CampusSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        campusKey: record.campus_key as string,
        campusName: record.campus_name as string,
        campusType: record.campus_type as string,
        status: record.status,
    };
}

export function buildCampusPayload(organizationId: string, input: CreateCampusInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.schoolHubId,
        campus_key: input.campusKey ?? '',
        campus_name: input.campusName ?? '',
        campus_type: input.campusType ?? '',
        status: "active",
    };
}

export function mapBuildingSummary(record: DbSchBuilding, maps?: { hubNameById: Map<string, string> }): BuildingSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        buildingKey: record.building_key as string,
        buildingName: record.building_name as string,
        buildingType: record.building_type as string,
        status: record.status,
    };
}

export function buildBuildingPayload(organizationId: string, input: CreateBuildingInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.schoolHubId,
        building_key: input.buildingKey ?? '',
        building_name: input.buildingName ?? '',
        building_type: input.buildingType ?? '',
        status: "active",
    };
}

export function mapClassroomSummary(record: DbSchClassroom, maps?: { hubNameById: Map<string, string> }): ClassroomSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        classroomKey: record.classroom_key as string,
        classroomName: record.classroom_name as string,
        classroomType: record.classroom_type as string,
        status: record.status,
    };
}

export function buildClassroomPayload(organizationId: string, input: CreateClassroomInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.schoolHubId,
        classroom_key: input.classroomKey ?? '',
        classroom_name: input.classroomName ?? '',
        classroom_type: input.classroomType ?? '',
        status: "active",
    };
}

export function mapAcademicYearSummary(record: DbSchAcademicYear, maps?: { hubNameById: Map<string, string> }): AcademicYearSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        yearKey: record.year_key as string,
        yearName: record.year_name as string,
        yearStatus: record.year_status as string,
        status: record.status,
    };
}

export function buildAcademicYearPayload(organizationId: string, input: CreateAcademicYearInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.schoolHubId,
        year_key: input.yearKey ?? '',
        year_name: input.yearName ?? '',
        year_status: input.yearStatus ?? '',
        status: "active",
    };
}

export function mapAdmissionSummary(record: DbSchAdmission, maps?: { hubNameById: Map<string, string> }): AdmissionSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        admissionKey: record.admission_key as string,
        admissionName: record.admission_name as string,
        admissionStatus: record.admission_status as string,
        status: record.status,
    };
}

export function buildAdmissionPayload(organizationId: string, input: CreateAdmissionInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.schoolHubId,
        admission_key: input.admissionKey ?? '',
        admission_name: input.admissionName ?? '',
        admission_status: input.admissionStatus ?? '',
        status: "active",
    };
}

export function mapStudentProfileSummary(record: DbSchStudentProfile, maps?: { hubNameById: Map<string, string> }): StudentProfileSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        profileKey: record.profile_key as string,
        profileName: record.profile_name as string,
        profileType: record.profile_type as string,
        status: record.status,
    };
}

export function buildStudentProfilePayload(organizationId: string, input: CreateStudentProfileInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.schoolHubId,
        profile_key: input.profileKey ?? '',
        profile_name: input.profileName ?? '',
        profile_type: input.profileType ?? '',
        status: "active",
    };
}

export function mapParentProfileSummary(record: DbSchParentProfile, maps?: { hubNameById: Map<string, string> }): ParentProfileSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        parentKey: record.parent_key as string,
        parentName: record.parent_name as string,
        parentType: record.parent_type as string,
        status: record.status,
    };
}

export function buildParentProfilePayload(organizationId: string, input: CreateParentProfileInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.schoolHubId,
        parent_key: input.parentKey ?? '',
        parent_name: input.parentName ?? '',
        parent_type: input.parentType ?? '',
        status: "active",
    };
}

export function mapEnrollmentSummary(record: DbSchEnrollment, maps?: { hubNameById: Map<string, string> }): EnrollmentSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        enrollmentKey: record.enrollment_key as string,
        enrollmentName: record.enrollment_name as string,
        enrollmentStatus: record.enrollment_status as string,
        status: record.status,
    };
}

export function buildEnrollmentPayload(organizationId: string, input: CreateEnrollmentInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.schoolHubId,
        enrollment_key: input.enrollmentKey ?? '',
        enrollment_name: input.enrollmentName ?? '',
        enrollment_status: input.enrollmentStatus ?? '',
        status: "active",
    };
}

export function mapSubjectSummary(record: DbSchSubject, maps?: { hubNameById: Map<string, string> }): SubjectSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        subjectKey: record.subject_key as string,
        subjectName: record.subject_name as string,
        subjectType: record.subject_type as string,
        status: record.status,
    };
}

export function buildSubjectPayload(organizationId: string, input: CreateSubjectInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.schoolHubId,
        subject_key: input.subjectKey ?? '',
        subject_name: input.subjectName ?? '',
        subject_type: input.subjectType ?? '',
        status: "active",
    };
}

export function mapTimetableSummary(record: DbSchTimetable, maps?: { hubNameById: Map<string, string> }): TimetableSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        timetableKey: record.timetable_key as string,
        timetableName: record.timetable_name as string,
        timetableType: record.timetable_type as string,
        status: record.status,
    };
}

export function buildTimetablePayload(organizationId: string, input: CreateTimetableInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.schoolHubId,
        timetable_key: input.timetableKey ?? '',
        timetable_name: input.timetableName ?? '',
        timetable_type: input.timetableType ?? '',
        status: "active",
    };
}

export function mapExaminationSummary(record: DbSchExamination, maps?: { hubNameById: Map<string, string> }): ExaminationSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        examKey: record.exam_key as string,
        examName: record.exam_name as string,
        examType: record.exam_type as string,
        status: record.status,
    };
}

export function buildExaminationPayload(organizationId: string, input: CreateExaminationInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.schoolHubId,
        exam_key: input.examKey ?? '',
        exam_name: input.examName ?? '',
        exam_type: input.examType ?? '',
        status: "active",
    };
}

export function mapReportCardSummary(record: DbSchReportCard, maps?: { hubNameById: Map<string, string> }): ReportCardSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        reportKey: record.report_key as string,
        reportName: record.report_name as string,
        reportGrade: record.report_grade as string,
        status: record.status,
    };
}

export function buildReportCardPayload(organizationId: string, input: CreateReportCardInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.schoolHubId,
        report_key: input.reportKey ?? '',
        report_name: input.reportName ?? '',
        report_grade: input.reportGrade ?? '',
        status: "active",
    };
}

export function mapTeacherSummary(record: DbSchTeacher, maps?: { hubNameById: Map<string, string> }): TeacherSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        teacherKey: record.teacher_key as string,
        teacherName: record.teacher_name as string,
        teacherType: record.teacher_type as string,
        status: record.status,
    };
}

export function buildTeacherPayload(organizationId: string, input: CreateTeacherInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.schoolHubId,
        teacher_key: input.teacherKey ?? '',
        teacher_name: input.teacherName ?? '',
        teacher_type: input.teacherType ?? '',
        status: "active",
    };
}

export function mapStaffAttendanceSummary(record: DbSchStaffAttendance, maps?: { hubNameById: Map<string, string> }): StaffAttendanceSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        attendanceKey: record.attendance_key as string,
        attendanceName: record.attendance_name as string,
        attendanceStatus: record.attendance_status as string,
        status: record.status,
    };
}

export function buildStaffAttendancePayload(organizationId: string, input: CreateStaffAttendanceInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.schoolHubId,
        attendance_key: input.attendanceKey ?? '',
        attendance_name: input.attendanceName ?? '',
        attendance_status: input.attendanceStatus ?? '',
        status: "active",
    };
}

export function mapLeaveRequestSummary(record: DbSchLeaveRequest, maps?: { hubNameById: Map<string, string> }): LeaveRequestSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        leaveKey: record.leave_key as string,
        leaveName: record.leave_name as string,
        leaveStatus: record.leave_status as string,
        status: record.status,
    };
}

export function buildLeaveRequestPayload(organizationId: string, input: CreateLeaveRequestInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.schoolHubId,
        leave_key: input.leaveKey ?? '',
        leave_name: input.leaveName ?? '',
        leave_status: input.leaveStatus ?? '',
        status: "active",
    };
}

export function mapSubstituteTeacherSummary(record: DbSchSubstituteTeacher, maps?: { hubNameById: Map<string, string> }): SubstituteTeacherSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        substituteKey: record.substitute_key as string,
        substituteName: record.substitute_name as string,
        substituteStatus: record.substitute_status as string,
        status: record.status,
    };
}

export function buildSubstituteTeacherPayload(organizationId: string, input: CreateSubstituteTeacherInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.schoolHubId,
        substitute_key: input.substituteKey ?? '',
        substitute_name: input.substituteName ?? '',
        substitute_status: input.substituteStatus ?? '',
        status: "active",
    };
}

export function mapFeeStructureSummary(record: DbSchFeeStructure, maps?: { hubNameById: Map<string, string> }): FeeStructureSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        feeKey: record.fee_key as string,
        feeName: record.fee_name as string,
        feeType: record.fee_type as string,
        status: record.status,
    };
}

export function buildFeeStructurePayload(organizationId: string, input: CreateFeeStructureInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.schoolHubId,
        fee_key: input.feeKey ?? '',
        fee_name: input.feeName ?? '',
        fee_type: input.feeType ?? '',
        status: "active",
    };
}

export function mapFeeInvoiceSummary(record: DbSchFeeInvoice, maps?: { hubNameById: Map<string, string> }): FeeInvoiceSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        invoiceKey: record.invoice_key as string,
        invoiceName: record.invoice_name as string,
        invoiceAmount: record.invoice_amount as number,
        status: record.status,
    };
}

export function buildFeeInvoicePayload(organizationId: string, input: CreateFeeInvoiceInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.schoolHubId,
        invoice_key: input.invoiceKey ?? '',
        invoice_name: input.invoiceName ?? '',
        invoice_amount: input.invoiceAmount ?? 0,
        status: "active",
    };
}

export function mapFeePaymentSummary(record: DbSchFeePayment, maps?: { hubNameById: Map<string, string> }): FeePaymentSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        paymentKey: record.payment_key as string,
        paymentName: record.payment_name as string,
        paymentAmount: record.payment_amount as number,
        status: record.status,
    };
}

export function buildFeePaymentPayload(organizationId: string, input: CreateFeePaymentInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.schoolHubId,
        payment_key: input.paymentKey ?? '',
        payment_name: input.paymentName ?? '',
        payment_amount: input.paymentAmount ?? 0,
        status: "active",
    };
}

export function mapScholarshipSummary(record: DbSchScholarship, maps?: { hubNameById: Map<string, string> }): ScholarshipSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        scholarshipKey: record.scholarship_key as string,
        scholarshipName: record.scholarship_name as string,
        scholarshipAmount: record.scholarship_amount as number,
        status: record.status,
    };
}

export function buildScholarshipPayload(organizationId: string, input: CreateScholarshipInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.schoolHubId,
        scholarship_key: input.scholarshipKey ?? '',
        scholarship_name: input.scholarshipName ?? '',
        scholarship_amount: input.scholarshipAmount ?? 0,
        status: "active",
    };
}

export function mapAnnouncementSummary(record: DbSchAnnouncement, maps?: { hubNameById: Map<string, string> }): AnnouncementSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        announcementKey: record.announcement_key as string,
        announcementTitle: record.announcement_title as string,
        announcementType: record.announcement_type as string,
        status: record.status,
    };
}

export function buildAnnouncementPayload(organizationId: string, input: CreateAnnouncementInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.schoolHubId,
        announcement_key: input.announcementKey ?? '',
        announcement_title: input.announcementTitle ?? '',
        announcement_type: input.announcementType ?? '',
        status: "active",
    };
}

export function mapMessagingSummary(record: DbSchMessaging, maps?: { hubNameById: Map<string, string> }): MessagingSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        messageKey: record.message_key as string,
        messageSubject: record.message_subject as string,
        messageType: record.message_type as string,
        status: record.status,
    };
}

export function buildMessagingPayload(organizationId: string, input: CreateMessagingInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.schoolHubId,
        message_key: input.messageKey ?? '',
        message_subject: input.messageSubject ?? '',
        message_type: input.messageType ?? '',
        status: "active",
    };
}

export function mapEventSummary(record: DbSchEvent, maps?: { hubNameById: Map<string, string> }): EventSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        eventKey: record.event_key as string,
        eventName: record.event_name as string,
        eventType: record.event_type as string,
        status: record.status,
    };
}

export function buildEventPayload(organizationId: string, input: CreateEventInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.schoolHubId,
        event_key: input.eventKey ?? '',
        event_name: input.eventName ?? '',
        event_type: input.eventType ?? '',
        status: "active",
    };
}

export function mapAdmissionsAnalyticsSummary(record: DbSchAdmissionsAnalytics, maps?: { hubNameById: Map<string, string> }): AdmissionsAnalyticsSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        analyticsKey: record.analytics_key as string,
        analyticsType: record.analytics_type as string,
        analyticsScore: record.analytics_score as number,
        status: record.status,
    };
}

export function buildAdmissionsAnalyticsPayload(organizationId: string, input: CreateAdmissionsAnalyticsInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.schoolHubId,
        analytics_key: input.analyticsKey ?? '',
        analytics_type: input.analyticsType ?? '',
        analytics_score: input.analyticsScore ?? 0,
        status: "active",
    };
}

export function mapAttendanceAnalyticsSummary(record: DbSchAttendanceAnalytics, maps?: { hubNameById: Map<string, string> }): AttendanceAnalyticsSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        analyticsKey: record.analytics_key as string,
        analyticsType: record.analytics_type as string,
        analyticsScore: record.analytics_score as number,
        status: record.status,
    };
}

export function buildAttendanceAnalyticsPayload(organizationId: string, input: CreateAttendanceAnalyticsInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.schoolHubId,
        analytics_key: input.analyticsKey ?? '',
        analytics_type: input.analyticsType ?? '',
        analytics_score: input.analyticsScore ?? 0,
        status: "active",
    };
}

export function mapAcademicAnalyticsSummary(record: DbSchAcademicAnalytics, maps?: { hubNameById: Map<string, string> }): AcademicAnalyticsSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        analyticsKey: record.analytics_key as string,
        analyticsType: record.analytics_type as string,
        analyticsScore: record.analytics_score as number,
        status: record.status,
    };
}

export function buildAcademicAnalyticsPayload(organizationId: string, input: CreateAcademicAnalyticsInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.schoolHubId,
        analytics_key: input.analyticsKey ?? '',
        analytics_type: input.analyticsType ?? '',
        analytics_score: input.analyticsScore ?? 0,
        status: "active",
    };
}

export function mapSchoolMetricSummary(record: DbSchSchoolMetric): SchoolMetricSummary {
    return {
        id: record.id,
        metricsKey: record.metrics_key as string,
        admissionsCount: record.admissions_count as number,
        overallSchoolScore: record.overall_school_score as number,
        status: record.status,
    };
}

export function buildSchoolMetricPayload(organizationId: string, input: CreateSchoolMetricInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        metrics_key: input.metricsKey ?? '',
        admissions_count: input.admissionsCount ?? 0,
        overall_school_score: input.overallSchoolScore ?? 0,
        status: "active",
    };
}

export function mapSchoolHealthSummary(record: DbSchSchoolHealth): SchoolHealthSummary {
    return {
        id: record.id,
        healthKey: record.health_key as string,
        overallScore: record.overall_score as number,
        disasterRecoveryMode: record.disaster_recovery_mode as boolean,
        status: record.status,
    };
}

export function buildSchoolHealthPayload(organizationId: string, input: CreateSchoolHealthInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        health_key: input.healthKey ?? '',
        overall_score: input.overallScore ?? 0,
        disaster_recovery_mode: input.disasterRecoveryMode ?? false,
        status: "active",
    };
}

export function mapExecutiveKpiSummary(record: DbSchExecutiveKpi, maps?: { hubNameById: Map<string, string> }): ExecutiveKpiSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        kpiKey: record.kpi_key as string,
        kpiName: record.kpi_name as string,
        kpiScore: record.kpi_score as number,
        status: record.status,
    };
}

export function buildExecutiveKpiPayload(organizationId: string, input: CreateExecutiveKpiInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.schoolHubId,
        kpi_key: input.kpiKey ?? '',
        kpi_name: input.kpiName ?? '',
        kpi_score: input.kpiScore ?? 0,
        status: "active",
    };
}

export function mapSchoolFailureSummary(record: DbSchSchoolFailure, maps?: { hubNameById: Map<string, string> }): SchoolFailureSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        failureKey: record.failure_key as string,
        failureType: record.failure_type as string,
        status: record.status,
    };
}

export function buildSchoolFailurePayload(organizationId: string, input: CreateSchoolFailureInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.schoolHubId,
        failure_key: input.failureKey ?? '',
        failure_type: input.failureType ?? '',
        status: "active",
    };
}

export function mapCampusForStats(r: DbSchCampus) { return { status: r.status }; }
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
