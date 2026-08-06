export type HrmsOsTab =
    | "employees"
    | "departments"
    | "attendance"
    | "leave"
    | "payroll"
    | "recruitment"
    | "performance"
    | "training"
    | "assets"
    | "self-service"
    | "assistant";

export interface EmployeeManagementItem {
    id: string;
    employeeCode: string;
    fullName: string;
    email: string;
    departmentName: string;
    designationTitle: string;
    managerName: string | null;
    status: string;
    employmentType: string;
    hireDate: string;
    baseSalary: number;
}

export interface DepartmentItem {
    id: string;
    name: string;
    code: string;
    description: string;
    headName: string | null;
    employeeCount: number;
    parentName: string | null;
}

export interface AttendanceItem {
    id: string;
    employeeId: string;
    employeeName: string;
    workDate: string;
    status: string;
    checkIn: string | null;
    checkOut: string | null;
    notes: string;
}

export interface LeaveManagementItem {
    id: string;
    employeeId: string;
    employeeName: string;
    leaveType: string;
    startDate: string;
    endDate: string;
    status: string;
    reason: string;
    days: number;
}

export interface PayrollItem {
    id: string;
    cycleId: string;
    cycleName: string;
    employeeId: string;
    employeeName: string;
    baseSalary: number;
    allowances: number;
    deductions: number;
    netPay: number;
    status: string;
    periodStart: string;
    periodEnd: string;
}

export interface RecruitmentItem {
    id: string;
    openingId: string;
    openingTitle: string;
    departmentName: string;
    candidateName: string;
    email: string;
    stage: string;
    appliedAt: string;
    openingStatus: string;
}

export interface PerformanceReviewItem {
    id: string;
    employeeId: string;
    employeeName: string;
    reviewerName: string | null;
    reviewPeriod: string;
    rating: number;
    kpiScore: number;
    okrSummary: string;
    status: string;
    summary: string;
}

export interface TrainingLearningItem {
    id: string;
    employeeId: string;
    employeeName: string;
    title: string;
    kind: "onboarding" | "document" | "learning_path";
    status: string;
    dueDate: string | null;
    progressPercent: number;
}

export interface AssetManagementItem {
    id: string;
    assetTag: string;
    name: string;
    category: string;
    status: string;
    employeeId: string | null;
    employeeName: string | null;
    projectId: string | null;
    projectName: string | null;
    purchaseCost: number;
    acquiredDate: string;
}

export interface SelfServicePortalItem {
    employeeId: string;
    employeeName: string;
    email: string;
    pendingLeaveCount: number;
    recentAttendanceStatus: string;
    openDocuments: number;
    assignedAssets: number;
    nextReview: string | null;
    onboardingStatus: string | null;
}

export interface HrAuditLogItem {
    id: string;
    entityType: string;
    action: string;
    title: string;
    detail: string;
    occurredAt: string;
}

export interface ExecutiveHrWidgets {
    headcount: number;
    openRoles: number;
    pendingLeave: number;
    attendancePresentRate: number;
    payrollNetTotal: number;
    avgPerformanceRating: number;
    recruitmentPipeline: Array<{ stage: string; count: number }>;
    departmentHeadcount: Array<{ department: string; count: number }>;
}

export interface AiHrAssistant {
    dailySummary: string;
    workforceAttention: string[];
    leaveRecommendations: string[];
    hiringInsights: string[];
    performanceInsights: string[];
    executiveSummary: string;
    generatedAt: string;
}

export interface HrmsOsStats {
    headcount: number;
    departments: number;
    pendingLeave: number;
    openRoles: number;
    candidates: number;
    payrollNetUsd: number;
    assetsAssigned: number;
}

export interface HrmsWorkforceSnapshot {
    organizationId: string | null;
    source: "supabase" | "fallback";
    fetchedAt: string;
    stats: HrmsOsStats;
    employees: EmployeeManagementItem[];
    departments: DepartmentItem[];
    attendance: AttendanceItem[];
    leave: LeaveManagementItem[];
    payroll: PayrollItem[];
    recruitment: RecruitmentItem[];
    performance: PerformanceReviewItem[];
    training: TrainingLearningItem[];
    assets: AssetManagementItem[];
    selfService: SelfServicePortalItem[];
    auditTrail: HrAuditLogItem[];
    executiveWidgets: ExecutiveHrWidgets;
    assistant: AiHrAssistant;
}
