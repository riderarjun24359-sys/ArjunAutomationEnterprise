export interface SchDashboardStats {
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

export interface SchoolHubSummary {
    id: string;
        hubKey: string;
    hubName: string;
    environment: string;
    status: string;
}

export interface CreateSchoolHubInput {
        hubKey?: string;
    hubName?: string;
    environment?: string;
}

export interface CampusSummary {
    id: string;
    hubName?: string;
        campusKey: string;
    campusName: string;
    campusType: string;
    status: string;
}

export interface CreateCampusInput {
        schoolHubId: string;
        campusKey?: string;
    campusName?: string;
    campusType?: string;
}

export interface BuildingSummary {
    id: string;
    hubName?: string;
        buildingKey: string;
    buildingName: string;
    buildingType: string;
    status: string;
}

export interface CreateBuildingInput {
        schoolHubId: string;
        buildingKey?: string;
    buildingName?: string;
    buildingType?: string;
}

export interface ClassroomSummary {
    id: string;
    hubName?: string;
        classroomKey: string;
    classroomName: string;
    classroomType: string;
    status: string;
}

export interface CreateClassroomInput {
        schoolHubId: string;
        classroomKey?: string;
    classroomName?: string;
    classroomType?: string;
}

export interface AcademicYearSummary {
    id: string;
    hubName?: string;
        yearKey: string;
    yearName: string;
    yearStatus: string;
    status: string;
}

export interface CreateAcademicYearInput {
        schoolHubId: string;
        yearKey?: string;
    yearName?: string;
    yearStatus?: string;
}

export interface AdmissionSummary {
    id: string;
    hubName?: string;
        admissionKey: string;
    admissionName: string;
    admissionStatus: string;
    status: string;
}

export interface CreateAdmissionInput {
        schoolHubId: string;
        admissionKey?: string;
    admissionName?: string;
    admissionStatus?: string;
}

export interface StudentProfileSummary {
    id: string;
    hubName?: string;
        profileKey: string;
    profileName: string;
    profileType: string;
    status: string;
}

export interface CreateStudentProfileInput {
        schoolHubId: string;
        profileKey?: string;
    profileName?: string;
    profileType?: string;
}

export interface ParentProfileSummary {
    id: string;
    hubName?: string;
        parentKey: string;
    parentName: string;
    parentType: string;
    status: string;
}

export interface CreateParentProfileInput {
        schoolHubId: string;
        parentKey?: string;
    parentName?: string;
    parentType?: string;
}

export interface EnrollmentSummary {
    id: string;
    hubName?: string;
        enrollmentKey: string;
    enrollmentName: string;
    enrollmentStatus: string;
    status: string;
}

export interface CreateEnrollmentInput {
        schoolHubId: string;
        enrollmentKey?: string;
    enrollmentName?: string;
    enrollmentStatus?: string;
}

export interface SubjectSummary {
    id: string;
    hubName?: string;
        subjectKey: string;
    subjectName: string;
    subjectType: string;
    status: string;
}

export interface CreateSubjectInput {
        schoolHubId: string;
        subjectKey?: string;
    subjectName?: string;
    subjectType?: string;
}

export interface TimetableSummary {
    id: string;
    hubName?: string;
        timetableKey: string;
    timetableName: string;
    timetableType: string;
    status: string;
}

export interface CreateTimetableInput {
        schoolHubId: string;
        timetableKey?: string;
    timetableName?: string;
    timetableType?: string;
}

export interface ExaminationSummary {
    id: string;
    hubName?: string;
        examKey: string;
    examName: string;
    examType: string;
    status: string;
}

export interface CreateExaminationInput {
        schoolHubId: string;
        examKey?: string;
    examName?: string;
    examType?: string;
}

export interface ReportCardSummary {
    id: string;
    hubName?: string;
        reportKey: string;
    reportName: string;
    reportGrade: string;
    status: string;
}

export interface CreateReportCardInput {
        schoolHubId: string;
        reportKey?: string;
    reportName?: string;
    reportGrade?: string;
}

export interface TeacherSummary {
    id: string;
    hubName?: string;
        teacherKey: string;
    teacherName: string;
    teacherType: string;
    status: string;
}

export interface CreateTeacherInput {
        schoolHubId: string;
        teacherKey?: string;
    teacherName?: string;
    teacherType?: string;
}

export interface StaffAttendanceSummary {
    id: string;
    hubName?: string;
        attendanceKey: string;
    attendanceName: string;
    attendanceStatus: string;
    status: string;
}

export interface CreateStaffAttendanceInput {
        schoolHubId: string;
        attendanceKey?: string;
    attendanceName?: string;
    attendanceStatus?: string;
}

export interface LeaveRequestSummary {
    id: string;
    hubName?: string;
        leaveKey: string;
    leaveName: string;
    leaveStatus: string;
    status: string;
}

export interface CreateLeaveRequestInput {
        schoolHubId: string;
        leaveKey?: string;
    leaveName?: string;
    leaveStatus?: string;
}

export interface SubstituteTeacherSummary {
    id: string;
    hubName?: string;
        substituteKey: string;
    substituteName: string;
    substituteStatus: string;
    status: string;
}

export interface CreateSubstituteTeacherInput {
        schoolHubId: string;
        substituteKey?: string;
    substituteName?: string;
    substituteStatus?: string;
}

export interface FeeStructureSummary {
    id: string;
    hubName?: string;
        feeKey: string;
    feeName: string;
    feeType: string;
    status: string;
}

export interface CreateFeeStructureInput {
        schoolHubId: string;
        feeKey?: string;
    feeName?: string;
    feeType?: string;
}

export interface FeeInvoiceSummary {
    id: string;
    hubName?: string;
        invoiceKey: string;
    invoiceName: string;
    invoiceAmount: number;
    status: string;
}

export interface CreateFeeInvoiceInput {
        schoolHubId: string;
        invoiceKey?: string;
    invoiceName?: string;
    invoiceAmount?: number;
}

export interface FeePaymentSummary {
    id: string;
    hubName?: string;
        paymentKey: string;
    paymentName: string;
    paymentAmount: number;
    status: string;
}

export interface CreateFeePaymentInput {
        schoolHubId: string;
        paymentKey?: string;
    paymentName?: string;
    paymentAmount?: number;
}

export interface ScholarshipSummary {
    id: string;
    hubName?: string;
        scholarshipKey: string;
    scholarshipName: string;
    scholarshipAmount: number;
    status: string;
}

export interface CreateScholarshipInput {
        schoolHubId: string;
        scholarshipKey?: string;
    scholarshipName?: string;
    scholarshipAmount?: number;
}

export interface AnnouncementSummary {
    id: string;
    hubName?: string;
        announcementKey: string;
    announcementTitle: string;
    announcementType: string;
    status: string;
}

export interface CreateAnnouncementInput {
        schoolHubId: string;
        announcementKey?: string;
    announcementTitle?: string;
    announcementType?: string;
}

export interface MessagingSummary {
    id: string;
    hubName?: string;
        messageKey: string;
    messageSubject: string;
    messageType: string;
    status: string;
}

export interface CreateMessagingInput {
        schoolHubId: string;
        messageKey?: string;
    messageSubject?: string;
    messageType?: string;
}

export interface EventSummary {
    id: string;
    hubName?: string;
        eventKey: string;
    eventName: string;
    eventType: string;
    status: string;
}

export interface CreateEventInput {
        schoolHubId: string;
        eventKey?: string;
    eventName?: string;
    eventType?: string;
}

export interface AdmissionsAnalyticsSummary {
    id: string;
    hubName?: string;
        analyticsKey: string;
    analyticsType: string;
    analyticsScore: number;
    status: string;
}

export interface CreateAdmissionsAnalyticsInput {
        schoolHubId: string;
        analyticsKey?: string;
    analyticsType?: string;
    analyticsScore?: number;
}

export interface AttendanceAnalyticsSummary {
    id: string;
    hubName?: string;
        analyticsKey: string;
    analyticsType: string;
    analyticsScore: number;
    status: string;
}

export interface CreateAttendanceAnalyticsInput {
        schoolHubId: string;
        analyticsKey?: string;
    analyticsType?: string;
    analyticsScore?: number;
}

export interface AcademicAnalyticsSummary {
    id: string;
    hubName?: string;
        analyticsKey: string;
    analyticsType: string;
    analyticsScore: number;
    status: string;
}

export interface CreateAcademicAnalyticsInput {
        schoolHubId: string;
        analyticsKey?: string;
    analyticsType?: string;
    analyticsScore?: number;
}

export interface SchoolMetricSummary {
    id: string;
    hubName?: string;
        metricsKey: string;
    admissionsCount: number;
    overallSchoolScore: number;
    status: string;
}

export interface CreateSchoolMetricInput {
        metricsKey?: string;
    admissionsCount?: number;
    overallSchoolScore?: number;
}

export interface SchoolHealthSummary {
    id: string;
    hubName?: string;
        healthKey: string;
    overallScore: number;
    disasterRecoveryMode: boolean;
    status: string;
}

export interface CreateSchoolHealthInput {
        healthKey?: string;
    overallScore?: number;
    disasterRecoveryMode?: boolean;
}

export interface ExecutiveKpiSummary {
    id: string;
    hubName?: string;
        kpiKey: string;
    kpiName: string;
    kpiScore: number;
    status: string;
}

export interface CreateExecutiveKpiInput {
        schoolHubId: string;
        kpiKey?: string;
    kpiName?: string;
    kpiScore?: number;
}

export interface SchoolFailureSummary {
    id: string;
    hubName?: string;
        failureKey: string;
    failureType: string;
    status: string;
}

export interface CreateSchoolFailureInput {
        schoolHubId: string;
        failureKey?: string;
    failureType?: string;
}

