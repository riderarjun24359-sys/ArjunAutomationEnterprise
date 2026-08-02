export type HrTab =
    | "overview"
    | "directory"
    | "departments"
    | "designations"
    | "teams"
    | "attendance"
    | "leave"
    | "holidays"
    | "payroll"
    | "documents"
    | "performance"
    | "recruitment"
    | "lifecycle"
    | "orgChart"
    | "reports";

export interface HrDashboardStats {
    totalEmployees: number;
    activeEmployees: number;
    departments: number;
    openPositions: number;
    pendingLeaveRequests: number;
    upcomingHolidays: number;
    activeOnboarding: number;
    avgPerformanceRating: number;
}

export interface DepartmentSummary {
    id: string;
    name: string;
    code: string;
    description: string;
    headEmployeeName?: string | null;
    employeeCount: number;
    updatedAt: string;
}

export interface DesignationSummary {
    id: string;
    title: string;
    level: string;
    description: string;
    employeeCount: number;
    updatedAt: string;
}

export interface EmployeeSummary {
    id: string;
    employeeCode: string;
    fullName: string;
    email: string;
    phone: string;
    departmentName?: string | null;
    designationTitle?: string | null;
    managerName?: string | null;
    status: string;
    employmentType: string;
    hireDate: string;
    baseSalary: number;
    updatedAt: string;
}

export interface HrTeamSummary {
    id: string;
    name: string;
    slug: string;
    description: string;
    departmentName?: string | null;
    leadEmployeeName?: string | null;
    memberCount: number;
    updatedAt: string;
}

export interface AttendanceRecord {
    id: string;
    employeeId: string;
    employeeName: string;
    workDate: string;
    checkIn?: string | null;
    checkOut?: string | null;
    status: string;
    notes: string;
}

export interface LeaveType {
    id: string;
    name: string;
    code: string;
    annualQuota: number;
    paid: boolean;
}

export interface LeaveRequest {
    id: string;
    employeeId: string;
    employeeName: string;
    leaveTypeName: string;
    startDate: string;
    endDate: string;
    status: string;
    reason: string;
}

export interface Holiday {
    id: string;
    name: string;
    holidayDate: string;
    region: string;
}

export interface PayrollCycle {
    id: string;
    name: string;
    periodStart: string;
    periodEnd: string;
    status: string;
    entryCount: number;
    totalNetPay: number;
}

export interface PayrollEntry {
    id: string;
    cycleId: string;
    employeeId: string;
    employeeName: string;
    baseSalary: number;
    allowances: number;
    deductions: number;
    netPay: number;
    status: string;
}

export interface EmployeeDocument {
    id: string;
    employeeId: string;
    employeeName: string;
    title: string;
    documentType: string;
    fileUrl: string;
    uploadedAt: string;
}

export interface PerformanceReview {
    id: string;
    employeeId: string;
    employeeName: string;
    reviewerName?: string | null;
    reviewPeriod: string;
    rating: number;
    summary: string;
    status: string;
    reviewedAt?: string | null;
}

export interface JobOpening {
    id: string;
    title: string;
    departmentName?: string | null;
    designationTitle?: string | null;
    status: string;
    description: string;
    candidateCount: number;
    openedAt: string;
}

export interface JobCandidate {
    id: string;
    openingId: string;
    openingTitle: string;
    fullName: string;
    email: string;
    stage: string;
    appliedAt: string;
    notes: string;
}

export interface OnboardingPlan {
    id: string;
    employeeId: string;
    employeeName: string;
    status: string;
    startDate: string;
    tasks: OnboardingTask[];
}

export interface OnboardingTask {
    id: string;
    planId: string;
    title: string;
    status: string;
    dueDate?: string | null;
    completedAt?: string | null;
}

export interface OffboardingPlan {
    id: string;
    employeeId: string;
    employeeName: string;
    status: string;
    lastWorkingDate: string;
    tasks: OffboardingTask[];
}

export interface OffboardingTask {
    id: string;
    planId: string;
    title: string;
    status: string;
    dueDate?: string | null;
    completedAt?: string | null;
}

export interface OrgChartNode {
    id: string;
    employeeId: string;
    employeeName: string;
    departmentName?: string | null;
    designationTitle?: string | null;
    parentNodeId?: string | null;
    sortOrder: number;
}

export interface HrAnalyticsReport {
    headcountByDepartment: Array<{ department: string; count: number }>;
    leaveUtilization: Array<{ leaveType: string; requests: number }>;
    attendanceSummary: Array<{ status: string; count: number }>;
    recruitmentPipeline: Array<{ stage: string; count: number }>;
    performanceDistribution: Array<{ ratingBand: string; count: number }>;
}

export interface RoleAccessSummary {
    roleName: string;
    permissions: string[];
}

export interface CreateDepartmentInput {
    name: string;
    code: string;
    description: string;
}

export interface CreateDesignationInput {
    title: string;
    level: string;
    description: string;
}

export interface CreateEmployeeInput {
    employeeCode: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    departmentId?: string;
    designationId?: string;
    employmentType: string;
    hireDate: string;
    baseSalary: number;
}

export interface CreateHrTeamInput {
    name: string;
    slug: string;
    description: string;
    departmentId?: string;
}

export interface CreateLeaveRequestInput {
    employeeId: string;
    leaveTypeId: string;
    startDate: string;
    endDate: string;
    reason: string;
}

export interface CreateHolidayInput {
    name: string;
    holidayDate: string;
    region: string;
}

export interface CreateJobOpeningInput {
    title: string;
    departmentId?: string;
    designationId?: string;
    description: string;
}

export interface CreateJobCandidateInput {
    openingId: string;
    fullName: string;
    email: string;
    notes: string;
}

export interface UpdateLeaveRequestStatusInput {
    status: string;
}

export interface UpdateJobCandidateStageInput {
    stage: string;
}

export interface UpdateLifecycleTaskInput {
    status: string;
}
