export const SCH_TABS = {
    overview: "overview",
    schoolHubs: "schoolHubs",
    campuses: "campuses",
    buildings: "buildings",
    classrooms: "classrooms",
    academicYears: "academicYears",
    admissions: "admissions",
    studentProfiles: "studentProfiles",
    parentProfiles: "parentProfiles",
    enrollments: "enrollments",
    subjects: "subjects",
    timetables: "timetables",
    examinations: "examinations",
    reportCards: "reportCards",
    teachers: "teachers",
    staffAttendance: "staffAttendance",
    leaveRequests: "leaveRequests",
    substituteTeachers: "substituteTeachers",
    feeStructures: "feeStructures",
    feeInvoices: "feeInvoices",
    feePayments: "feePayments",
    scholarships: "scholarships",
    announcements: "announcements",
    messaging: "messaging",
    events: "events",
    admissionsAnalytics: "admissionsAnalytics",
    attendanceAnalytics: "attendanceAnalytics",
    academicAnalytics: "academicAnalytics",
    schoolMetrics: "schoolMetrics",
    schoolHealth: "schoolHealth",
    executiveKpis: "executiveKpis",
    schoolFailures: "schoolFailures",
    auditLogs: "auditLogs",
    api: "api",
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
