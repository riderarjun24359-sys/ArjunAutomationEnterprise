import { z } from "zod";

export const schoolHubsFormSchema = z.object({
    hubKey: z.string().min(1).optional(),
    hubName: z.string().min(1).optional(),
    environment: z.string().min(1).optional(),
});

export type schoolHubsFormValues = z.infer<typeof schoolHubsFormSchema>;

export const campusesFormSchema = z.object({
    schoolHubId: z.string().min(1),
    campusKey: z.string().min(1).optional(),
    campusName: z.string().min(1).optional(),
    campusType: z.string().min(1).optional(),
});

export type campusesFormValues = z.infer<typeof campusesFormSchema>;

export const buildingsFormSchema = z.object({
    schoolHubId: z.string().min(1),
    buildingKey: z.string().min(1).optional(),
    buildingName: z.string().min(1).optional(),
    buildingType: z.string().min(1).optional(),
});

export type buildingsFormValues = z.infer<typeof buildingsFormSchema>;

export const classroomsFormSchema = z.object({
    schoolHubId: z.string().min(1),
    classroomKey: z.string().min(1).optional(),
    classroomName: z.string().min(1).optional(),
    classroomType: z.string().min(1).optional(),
});

export type classroomsFormValues = z.infer<typeof classroomsFormSchema>;

export const academicYearsFormSchema = z.object({
    schoolHubId: z.string().min(1),
    yearKey: z.string().min(1).optional(),
    yearName: z.string().min(1).optional(),
    yearStatus: z.string().min(1).optional(),
});

export type academicYearsFormValues = z.infer<typeof academicYearsFormSchema>;

export const admissionsFormSchema = z.object({
    schoolHubId: z.string().min(1),
    admissionKey: z.string().min(1).optional(),
    admissionName: z.string().min(1).optional(),
    admissionStatus: z.string().min(1).optional(),
});

export type admissionsFormValues = z.infer<typeof admissionsFormSchema>;

export const studentProfilesFormSchema = z.object({
    schoolHubId: z.string().min(1),
    profileKey: z.string().min(1).optional(),
    profileName: z.string().min(1).optional(),
    profileType: z.string().min(1).optional(),
});

export type studentProfilesFormValues = z.infer<typeof studentProfilesFormSchema>;

export const parentProfilesFormSchema = z.object({
    schoolHubId: z.string().min(1),
    parentKey: z.string().min(1).optional(),
    parentName: z.string().min(1).optional(),
    parentType: z.string().min(1).optional(),
});

export type parentProfilesFormValues = z.infer<typeof parentProfilesFormSchema>;

export const enrollmentsFormSchema = z.object({
    schoolHubId: z.string().min(1),
    enrollmentKey: z.string().min(1).optional(),
    enrollmentName: z.string().min(1).optional(),
    enrollmentStatus: z.string().min(1).optional(),
});

export type enrollmentsFormValues = z.infer<typeof enrollmentsFormSchema>;

export const subjectsFormSchema = z.object({
    schoolHubId: z.string().min(1),
    subjectKey: z.string().min(1).optional(),
    subjectName: z.string().min(1).optional(),
    subjectType: z.string().min(1).optional(),
});

export type subjectsFormValues = z.infer<typeof subjectsFormSchema>;

export const timetablesFormSchema = z.object({
    schoolHubId: z.string().min(1),
    timetableKey: z.string().min(1).optional(),
    timetableName: z.string().min(1).optional(),
    timetableType: z.string().min(1).optional(),
});

export type timetablesFormValues = z.infer<typeof timetablesFormSchema>;

export const examinationsFormSchema = z.object({
    schoolHubId: z.string().min(1),
    examKey: z.string().min(1).optional(),
    examName: z.string().min(1).optional(),
    examType: z.string().min(1).optional(),
});

export type examinationsFormValues = z.infer<typeof examinationsFormSchema>;

export const reportCardsFormSchema = z.object({
    schoolHubId: z.string().min(1),
    reportKey: z.string().min(1).optional(),
    reportName: z.string().min(1).optional(),
    reportGrade: z.string().min(1).optional(),
});

export type reportCardsFormValues = z.infer<typeof reportCardsFormSchema>;

export const teachersFormSchema = z.object({
    schoolHubId: z.string().min(1),
    teacherKey: z.string().min(1).optional(),
    teacherName: z.string().min(1).optional(),
    teacherType: z.string().min(1).optional(),
});

export type teachersFormValues = z.infer<typeof teachersFormSchema>;

export const staffAttendanceFormSchema = z.object({
    schoolHubId: z.string().min(1),
    attendanceKey: z.string().min(1).optional(),
    attendanceName: z.string().min(1).optional(),
    attendanceStatus: z.string().min(1).optional(),
});

export type staffAttendanceFormValues = z.infer<typeof staffAttendanceFormSchema>;

export const leaveRequestsFormSchema = z.object({
    schoolHubId: z.string().min(1),
    leaveKey: z.string().min(1).optional(),
    leaveName: z.string().min(1).optional(),
    leaveStatus: z.string().min(1).optional(),
});

export type leaveRequestsFormValues = z.infer<typeof leaveRequestsFormSchema>;

export const substituteTeachersFormSchema = z.object({
    schoolHubId: z.string().min(1),
    substituteKey: z.string().min(1).optional(),
    substituteName: z.string().min(1).optional(),
    substituteStatus: z.string().min(1).optional(),
});

export type substituteTeachersFormValues = z.infer<typeof substituteTeachersFormSchema>;

export const feeStructuresFormSchema = z.object({
    schoolHubId: z.string().min(1),
    feeKey: z.string().min(1).optional(),
    feeName: z.string().min(1).optional(),
    feeType: z.string().min(1).optional(),
});

export type feeStructuresFormValues = z.infer<typeof feeStructuresFormSchema>;

export const feeInvoicesFormSchema = z.object({
    schoolHubId: z.string().min(1),
    invoiceKey: z.string().min(1).optional(),
    invoiceName: z.string().min(1).optional(),
    invoiceAmount: z.number().optional(),
});

export type feeInvoicesFormValues = z.infer<typeof feeInvoicesFormSchema>;

export const feePaymentsFormSchema = z.object({
    schoolHubId: z.string().min(1),
    paymentKey: z.string().min(1).optional(),
    paymentName: z.string().min(1).optional(),
    paymentAmount: z.number().optional(),
});

export type feePaymentsFormValues = z.infer<typeof feePaymentsFormSchema>;

export const scholarshipsFormSchema = z.object({
    schoolHubId: z.string().min(1),
    scholarshipKey: z.string().min(1).optional(),
    scholarshipName: z.string().min(1).optional(),
    scholarshipAmount: z.number().optional(),
});

export type scholarshipsFormValues = z.infer<typeof scholarshipsFormSchema>;

export const announcementsFormSchema = z.object({
    schoolHubId: z.string().min(1),
    announcementKey: z.string().min(1).optional(),
    announcementTitle: z.string().min(1).optional(),
    announcementType: z.string().min(1).optional(),
});

export type announcementsFormValues = z.infer<typeof announcementsFormSchema>;

export const messagingFormSchema = z.object({
    schoolHubId: z.string().min(1),
    messageKey: z.string().min(1).optional(),
    messageSubject: z.string().min(1).optional(),
    messageType: z.string().min(1).optional(),
});

export type messagingFormValues = z.infer<typeof messagingFormSchema>;

export const eventsFormSchema = z.object({
    schoolHubId: z.string().min(1),
    eventKey: z.string().min(1).optional(),
    eventName: z.string().min(1).optional(),
    eventType: z.string().min(1).optional(),
});

export type eventsFormValues = z.infer<typeof eventsFormSchema>;

export const admissionsAnalyticsFormSchema = z.object({
    schoolHubId: z.string().min(1),
    analyticsKey: z.string().min(1).optional(),
    analyticsType: z.string().min(1).optional(),
    analyticsScore: z.number().optional(),
});

export type admissionsAnalyticsFormValues = z.infer<typeof admissionsAnalyticsFormSchema>;

export const attendanceAnalyticsFormSchema = z.object({
    schoolHubId: z.string().min(1),
    analyticsKey: z.string().min(1).optional(),
    analyticsType: z.string().min(1).optional(),
    analyticsScore: z.number().optional(),
});

export type attendanceAnalyticsFormValues = z.infer<typeof attendanceAnalyticsFormSchema>;

export const academicAnalyticsFormSchema = z.object({
    schoolHubId: z.string().min(1),
    analyticsKey: z.string().min(1).optional(),
    analyticsType: z.string().min(1).optional(),
    analyticsScore: z.number().optional(),
});

export type academicAnalyticsFormValues = z.infer<typeof academicAnalyticsFormSchema>;

export const schoolMetricsFormSchema = z.object({
    metricsKey: z.string().min(1).optional(),
    admissionsCount: z.number().optional(),
    overallSchoolScore: z.number().optional(),
});

export type schoolMetricsFormValues = z.infer<typeof schoolMetricsFormSchema>;

export const schoolHealthFormSchema = z.object({
    healthKey: z.string().min(1).optional(),
    overallScore: z.number().optional(),
    disasterRecoveryMode: z.boolean().optional(),
});

export type schoolHealthFormValues = z.infer<typeof schoolHealthFormSchema>;

export const executiveKpisFormSchema = z.object({
    schoolHubId: z.string().min(1),
    kpiKey: z.string().min(1).optional(),
    kpiName: z.string().min(1).optional(),
    kpiScore: z.number().optional(),
});

export type executiveKpisFormValues = z.infer<typeof executiveKpisFormSchema>;

export const schoolFailuresFormSchema = z.object({
    schoolHubId: z.string().min(1),
    failureKey: z.string().min(1).optional(),
    failureType: z.string().min(1).optional(),
});

export type schoolFailuresFormValues = z.infer<typeof schoolFailuresFormSchema>;
