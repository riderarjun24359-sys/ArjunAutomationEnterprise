"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { schoolService } from "@/src/modules/school/services/school.service";
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
} from "@/src/modules/school/types";

export function useSchool() {
    const user = useAuthStore((state) => state.user);
    const authUserId = user?.id;
    const email = user?.email ?? "";
    const fullName = user?.fullName;
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<SchDashboardStats | null>(null);
    const [pipeline, setPipeline] = useState<SchPipelineInfo | null>(null);
    const [schoolHubs, setSchoolHubs] = useState<SchoolHubSummary[]>([]);
    const [campuses, setCampuss] = useState<CampusSummary[]>([]);
    const [buildings, setBuildings] = useState<BuildingSummary[]>([]);
    const [classrooms, setClassrooms] = useState<ClassroomSummary[]>([]);
    const [academicYears, setAcademicYears] = useState<AcademicYearSummary[]>([]);
    const [admissions, setAdmissions] = useState<AdmissionSummary[]>([]);
    const [studentProfiles, setStudentProfiles] = useState<StudentProfileSummary[]>([]);
    const [parentProfiles, setParentProfiles] = useState<ParentProfileSummary[]>([]);
    const [enrollments, setEnrollments] = useState<EnrollmentSummary[]>([]);
    const [subjects, setSubjects] = useState<SubjectSummary[]>([]);
    const [timetables, setTimetables] = useState<TimetableSummary[]>([]);
    const [examinations, setExaminations] = useState<ExaminationSummary[]>([]);
    const [reportCards, setReportCards] = useState<ReportCardSummary[]>([]);
    const [teachers, setTeachers] = useState<TeacherSummary[]>([]);
    const [staffAttendance, setStaffAttendances] = useState<StaffAttendanceSummary[]>([]);
    const [leaveRequests, setLeaveRequests] = useState<LeaveRequestSummary[]>([]);
    const [substituteTeachers, setSubstituteTeachers] = useState<SubstituteTeacherSummary[]>([]);
    const [feeStructures, setFeeStructures] = useState<FeeStructureSummary[]>([]);
    const [feeInvoices, setFeeInvoices] = useState<FeeInvoiceSummary[]>([]);
    const [feePayments, setFeePayments] = useState<FeePaymentSummary[]>([]);
    const [scholarships, setScholarships] = useState<ScholarshipSummary[]>([]);
    const [announcements, setAnnouncements] = useState<AnnouncementSummary[]>([]);
    const [messaging, setMessagings] = useState<MessagingSummary[]>([]);
    const [events, setEvents] = useState<EventSummary[]>([]);
    const [admissionsAnalytics, setAdmissionsAnalyticss] = useState<AdmissionsAnalyticsSummary[]>([]);
    const [attendanceAnalytics, setAttendanceAnalyticss] = useState<AttendanceAnalyticsSummary[]>([]);
    const [academicAnalytics, setAcademicAnalyticss] = useState<AcademicAnalyticsSummary[]>([]);
    const [schoolMetrics, setSchoolMetrics] = useState<SchoolMetricSummary[]>([]);
    const [schoolHealth, setSchoolHealths] = useState<SchoolHealthSummary[]>([]);
    const [executiveKpis, setExecutiveKpis] = useState<ExecutiveKpiSummary[]>([]);
    const [schoolFailures, setSchoolFailures] = useState<SchoolFailureSummary[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
    const [schoolHubOptions, setIntegrationHubOptions] = useState<Array<{ id: string; name: string }>>([]);

    const fetchData = useCallback(async () => {
        if (!authUserId || !email) return { empty: true as const };
        const [
            statsData,
            pipelineInfo,
schoolHubsList,
            campusesList,
            buildingsList,
            classroomsList,
            academicYearsList,
            admissionsList,
            studentProfilesList,
            parentProfilesList,
            enrollmentsList,
            subjectsList,
            timetablesList,
            examinationsList,
            reportCardsList,
            teachersList,
            staffAttendanceList,
            leaveRequestsList,
            substituteTeachersList,
            feeStructuresList,
            feeInvoicesList,
            feePaymentsList,
            scholarshipsList,
            announcementsList,
            messagingList,
            eventsList,
            admissionsAnalyticsList,
            attendanceAnalyticsList,
            academicAnalyticsList,
            schoolMetricsList,
            schoolHealthList,
            executiveKpisList,
            schoolFailuresList,
            auditLogsList,
            hubOpts,
        ] = await Promise.all([
            schoolService.getDashboardStats(authUserId, email, fullName),
            Promise.resolve(schoolService.getPipelineInfo()),
            schoolService.getSchoolHubs(authUserId, email, fullName),
            schoolService.getCampuss(authUserId, email, fullName),
            schoolService.getBuildings(authUserId, email, fullName),
            schoolService.getClassrooms(authUserId, email, fullName),
            schoolService.getAcademicYears(authUserId, email, fullName),
            schoolService.getAdmissions(authUserId, email, fullName),
            schoolService.getStudentProfiles(authUserId, email, fullName),
            schoolService.getParentProfiles(authUserId, email, fullName),
            schoolService.getEnrollments(authUserId, email, fullName),
            schoolService.getSubjects(authUserId, email, fullName),
            schoolService.getTimetables(authUserId, email, fullName),
            schoolService.getExaminations(authUserId, email, fullName),
            schoolService.getReportCards(authUserId, email, fullName),
            schoolService.getTeachers(authUserId, email, fullName),
            schoolService.getStaffAttendances(authUserId, email, fullName),
            schoolService.getLeaveRequests(authUserId, email, fullName),
            schoolService.getSubstituteTeachers(authUserId, email, fullName),
            schoolService.getFeeStructures(authUserId, email, fullName),
            schoolService.getFeeInvoices(authUserId, email, fullName),
            schoolService.getFeePayments(authUserId, email, fullName),
            schoolService.getScholarships(authUserId, email, fullName),
            schoolService.getAnnouncements(authUserId, email, fullName),
            schoolService.getMessagings(authUserId, email, fullName),
            schoolService.getEvents(authUserId, email, fullName),
            schoolService.getAdmissionsAnalyticss(authUserId, email, fullName),
            schoolService.getAttendanceAnalyticss(authUserId, email, fullName),
            schoolService.getAcademicAnalyticss(authUserId, email, fullName),
            schoolService.getSchoolMetrics(authUserId, email, fullName),
            schoolService.getSchoolHealths(authUserId, email, fullName),
            schoolService.getExecutiveKpis(authUserId, email, fullName),
            schoolService.getSchoolFailures(authUserId, email, fullName),
            schoolService.getAuditLogs(authUserId, email, fullName),
            schoolService.getSchoolHubOptions(authUserId, email, fullName),
        ]);
        return {
            statsData,
            pipelineInfo,
schoolHubsList,
            campusesList,
            buildingsList,
            classroomsList,
            academicYearsList,
            admissionsList,
            studentProfilesList,
            parentProfilesList,
            enrollmentsList,
            subjectsList,
            timetablesList,
            examinationsList,
            reportCardsList,
            teachersList,
            staffAttendanceList,
            leaveRequestsList,
            substituteTeachersList,
            feeStructuresList,
            feeInvoicesList,
            feePaymentsList,
            scholarshipsList,
            announcementsList,
            messagingList,
            eventsList,
            admissionsAnalyticsList,
            attendanceAnalyticsList,
            academicAnalyticsList,
            schoolMetricsList,
            schoolHealthList,
            executiveKpisList,
            schoolFailuresList,
            auditLogsList,
            hubOpts,
        };
    }, [authUserId, email, fullName]);

    const applyData = useCallback((result: Awaited<ReturnType<typeof fetchData>>) => {
        if ("empty" in result) { setLoading(false); return; }
        setStats(result.statsData);
        setPipeline(result.pipelineInfo);
        setSchoolHubs(result.schoolHubsList);
        setCampuss(result.campusesList);
        setBuildings(result.buildingsList);
        setClassrooms(result.classroomsList);
        setAcademicYears(result.academicYearsList);
        setAdmissions(result.admissionsList);
        setStudentProfiles(result.studentProfilesList);
        setParentProfiles(result.parentProfilesList);
        setEnrollments(result.enrollmentsList);
        setSubjects(result.subjectsList);
        setTimetables(result.timetablesList);
        setExaminations(result.examinationsList);
        setReportCards(result.reportCardsList);
        setTeachers(result.teachersList);
        setStaffAttendances(result.staffAttendanceList);
        setLeaveRequests(result.leaveRequestsList);
        setSubstituteTeachers(result.substituteTeachersList);
        setFeeStructures(result.feeStructuresList);
        setFeeInvoices(result.feeInvoicesList);
        setFeePayments(result.feePaymentsList);
        setScholarships(result.scholarshipsList);
        setAnnouncements(result.announcementsList);
        setMessagings(result.messagingList);
        setEvents(result.eventsList);
        setAdmissionsAnalyticss(result.admissionsAnalyticsList);
        setAttendanceAnalyticss(result.attendanceAnalyticsList);
        setAcademicAnalyticss(result.academicAnalyticsList);
        setSchoolMetrics(result.schoolMetricsList);
        setSchoolHealths(result.schoolHealthList);
        setExecutiveKpis(result.executiveKpisList);
        setSchoolFailures(result.schoolFailuresList);
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

    const createSchoolHub = useCallback(async (input: CreateSchoolHubInput) => { if (!user) throw new Error("Authentication required"); await schoolService.createSchoolHub(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createCampus = useCallback(async (input: CreateCampusInput) => { if (!user) throw new Error("Authentication required"); await schoolService.createCampus(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createBuilding = useCallback(async (input: CreateBuildingInput) => { if (!user) throw new Error("Authentication required"); await schoolService.createBuilding(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createClassroom = useCallback(async (input: CreateClassroomInput) => { if (!user) throw new Error("Authentication required"); await schoolService.createClassroom(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createAcademicYear = useCallback(async (input: CreateAcademicYearInput) => { if (!user) throw new Error("Authentication required"); await schoolService.createAcademicYear(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createAdmission = useCallback(async (input: CreateAdmissionInput) => { if (!user) throw new Error("Authentication required"); await schoolService.createAdmission(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createStudentProfile = useCallback(async (input: CreateStudentProfileInput) => { if (!user) throw new Error("Authentication required"); await schoolService.createStudentProfile(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createParentProfile = useCallback(async (input: CreateParentProfileInput) => { if (!user) throw new Error("Authentication required"); await schoolService.createParentProfile(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createEnrollment = useCallback(async (input: CreateEnrollmentInput) => { if (!user) throw new Error("Authentication required"); await schoolService.createEnrollment(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createSubject = useCallback(async (input: CreateSubjectInput) => { if (!user) throw new Error("Authentication required"); await schoolService.createSubject(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createTimetable = useCallback(async (input: CreateTimetableInput) => { if (!user) throw new Error("Authentication required"); await schoolService.createTimetable(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createExamination = useCallback(async (input: CreateExaminationInput) => { if (!user) throw new Error("Authentication required"); await schoolService.createExamination(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createReportCard = useCallback(async (input: CreateReportCardInput) => { if (!user) throw new Error("Authentication required"); await schoolService.createReportCard(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createTeacher = useCallback(async (input: CreateTeacherInput) => { if (!user) throw new Error("Authentication required"); await schoolService.createTeacher(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createStaffAttendance = useCallback(async (input: CreateStaffAttendanceInput) => { if (!user) throw new Error("Authentication required"); await schoolService.createStaffAttendance(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createLeaveRequest = useCallback(async (input: CreateLeaveRequestInput) => { if (!user) throw new Error("Authentication required"); await schoolService.createLeaveRequest(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createSubstituteTeacher = useCallback(async (input: CreateSubstituteTeacherInput) => { if (!user) throw new Error("Authentication required"); await schoolService.createSubstituteTeacher(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createFeeStructure = useCallback(async (input: CreateFeeStructureInput) => { if (!user) throw new Error("Authentication required"); await schoolService.createFeeStructure(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createFeeInvoice = useCallback(async (input: CreateFeeInvoiceInput) => { if (!user) throw new Error("Authentication required"); await schoolService.createFeeInvoice(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createFeePayment = useCallback(async (input: CreateFeePaymentInput) => { if (!user) throw new Error("Authentication required"); await schoolService.createFeePayment(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createScholarship = useCallback(async (input: CreateScholarshipInput) => { if (!user) throw new Error("Authentication required"); await schoolService.createScholarship(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createAnnouncement = useCallback(async (input: CreateAnnouncementInput) => { if (!user) throw new Error("Authentication required"); await schoolService.createAnnouncement(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createMessaging = useCallback(async (input: CreateMessagingInput) => { if (!user) throw new Error("Authentication required"); await schoolService.createMessaging(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createEvent = useCallback(async (input: CreateEventInput) => { if (!user) throw new Error("Authentication required"); await schoolService.createEvent(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createAdmissionsAnalytics = useCallback(async (input: CreateAdmissionsAnalyticsInput) => { if (!user) throw new Error("Authentication required"); await schoolService.createAdmissionsAnalytics(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createAttendanceAnalytics = useCallback(async (input: CreateAttendanceAnalyticsInput) => { if (!user) throw new Error("Authentication required"); await schoolService.createAttendanceAnalytics(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createAcademicAnalytics = useCallback(async (input: CreateAcademicAnalyticsInput) => { if (!user) throw new Error("Authentication required"); await schoolService.createAcademicAnalytics(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createSchoolMetric = useCallback(async (input: CreateSchoolMetricInput) => { if (!user) throw new Error("Authentication required"); await schoolService.createSchoolMetric(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createSchoolHealth = useCallback(async (input: CreateSchoolHealthInput) => { if (!user) throw new Error("Authentication required"); await schoolService.createSchoolHealth(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createExecutiveKpi = useCallback(async (input: CreateExecutiveKpiInput) => { if (!user) throw new Error("Authentication required"); await schoolService.createExecutiveKpi(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createSchoolFailure = useCallback(async (input: CreateSchoolFailureInput) => { if (!user) throw new Error("Authentication required"); await schoolService.createSchoolFailure(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);

    return {
        loading,
        stats,
        pipeline,
        schoolHubs,
        createSchoolHub,
        campuses,
        createCampus,
        buildings,
        createBuilding,
        classrooms,
        createClassroom,
        academicYears,
        createAcademicYear,
        admissions,
        createAdmission,
        studentProfiles,
        createStudentProfile,
        parentProfiles,
        createParentProfile,
        enrollments,
        createEnrollment,
        subjects,
        createSubject,
        timetables,
        createTimetable,
        examinations,
        createExamination,
        reportCards,
        createReportCard,
        teachers,
        createTeacher,
        staffAttendance,
        createStaffAttendance,
        leaveRequests,
        createLeaveRequest,
        substituteTeachers,
        createSubstituteTeacher,
        feeStructures,
        createFeeStructure,
        feeInvoices,
        createFeeInvoice,
        feePayments,
        createFeePayment,
        scholarships,
        createScholarship,
        announcements,
        createAnnouncement,
        messaging,
        createMessaging,
        events,
        createEvent,
        admissionsAnalytics,
        createAdmissionsAnalytics,
        attendanceAnalytics,
        createAttendanceAnalytics,
        academicAnalytics,
        createAcademicAnalytics,
        schoolMetrics,
        createSchoolMetric,
        schoolHealth,
        createSchoolHealth,
        executiveKpis,
        createExecutiveKpi,
        schoolFailures,
        createSchoolFailure,
        auditLogs,
        schoolHubOptions,
        refresh,
    };
}
