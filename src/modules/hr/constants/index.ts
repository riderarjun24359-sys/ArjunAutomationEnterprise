export const HR_TABS = {
    overview: "overview",
    directory: "directory",
    departments: "departments",
    designations: "designations",
    teams: "teams",
    attendance: "attendance",
    leave: "leave",
    holidays: "holidays",
    payroll: "payroll",
    documents: "documents",
    performance: "performance",
    recruitment: "recruitment",
    lifecycle: "lifecycle",
    orgChart: "orgChart",
    reports: "reports",
} as const;

export const EMPLOYMENT_TYPE_OPTIONS = [
    { value: "full_time", label: "Full Time" },
    { value: "part_time", label: "Part Time" },
    { value: "contract", label: "Contract" },
    { value: "intern", label: "Intern" },
] as const;

export const DESIGNATION_LEVEL_OPTIONS = [
    { value: "executive", label: "Executive" },
    { value: "manager", label: "Manager" },
    { value: "senior", label: "Senior" },
    { value: "individual_contributor", label: "Individual Contributor" },
    { value: "intern", label: "Intern" },
] as const;

export const LEAVE_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
    { value: "cancelled", label: "Cancelled" },
] as const;

export const CANDIDATE_STAGE_OPTIONS = [
    { value: "applied", label: "Applied" },
    { value: "screening", label: "Screening" },
    { value: "interview", label: "Interview" },
    { value: "offer", label: "Offer" },
    { value: "hired", label: "Hired" },
    { value: "rejected", label: "Rejected" },
] as const;

export const ATTENDANCE_STATUS_OPTIONS = [
    { value: "present", label: "Present" },
    { value: "remote", label: "Remote" },
    { value: "absent", label: "Absent" },
    { value: "leave", label: "On Leave" },
] as const;

export const HR_PERMISSIONS = ["hr.view", "hr.manage", "hr.payroll.manage", "hr.recruitment.manage"] as const;
