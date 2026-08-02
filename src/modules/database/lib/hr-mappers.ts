import type {
    DbAttendanceRecord,
    DbDepartment,
    DbDesignation,
    DbEmployee,
    DbEmployeeDocument,
    DbHoliday,
    DbHrTeam,
    DbJobCandidate,
    DbJobOpening,
    DbLeaveRequest,
    DbLeaveType,
    DbOffboardingPlan,
    DbOffboardingTask,
    DbOnboardingPlan,
    DbOnboardingTask,
    DbOrgChartNode,
    DbPayrollCycle,
    DbPayrollEntry,
    DbPerformanceReview,
} from "@/src/modules/database/types/platform";
import type {
    AttendanceRecord,
    CreateDepartmentInput,
    CreateDesignationInput,
    CreateEmployeeInput,
    CreateHolidayInput,
    CreateHrTeamInput,
    CreateJobCandidateInput,
    CreateJobOpeningInput,
    CreateLeaveRequestInput,
    DepartmentSummary,
    DesignationSummary,
    EmployeeDocument,
    EmployeeSummary,
    Holiday,
    HrAnalyticsReport,
    HrDashboardStats,
    HrTeamSummary,
    JobCandidate,
    JobOpening,
    LeaveRequest,
    LeaveType,
    OffboardingPlan,
    OffboardingTask,
    OnboardingPlan,
    OnboardingTask,
    OrgChartNode,
    PayrollCycle,
    PayrollEntry,
    PerformanceReview,
} from "@/src/modules/hr/types";

type LookupMaps = {
    departments: Map<string, DbDepartment>;
    designations: Map<string, DbDesignation>;
    employees: Map<string, DbEmployee>;
};

const fullName = (employee?: DbEmployee | null) =>
    employee ? `${employee.first_name} ${employee.last_name}`.trim() : null;

export const mapDepartmentSummary = (record: DbDepartment, employeeCount: number, head?: DbEmployee | null): DepartmentSummary => ({
    id: record.id,
    name: record.name,
    code: record.code,
    description: record.description,
    headEmployeeName: fullName(head),
    employeeCount,
    updatedAt: record.updated_at,
});

export const mapDesignationSummary = (record: DbDesignation, employeeCount: number): DesignationSummary => ({
    id: record.id,
    title: record.title,
    level: record.level,
    description: record.description,
    employeeCount,
    updatedAt: record.updated_at,
});

export const mapEmployeeSummary = (
    record: DbEmployee,
    maps: LookupMaps,
): EmployeeSummary => ({
    id: record.id,
    employeeCode: record.employee_code,
    fullName: fullName(record) ?? record.email,
    email: record.email,
    phone: record.phone,
    departmentName: record.department_id ? maps.departments.get(record.department_id)?.name ?? null : null,
    designationTitle: record.designation_id ? maps.designations.get(record.designation_id)?.title ?? null : null,
    managerName: record.manager_id ? fullName(maps.employees.get(record.manager_id)) : null,
    status: record.status,
    employmentType: record.employment_type,
    hireDate: record.hire_date,
    baseSalary: Number(record.base_salary),
    updatedAt: record.updated_at,
});

export const mapHrTeamSummary = (record: DbHrTeam, memberCount: number, department?: DbDepartment | null, lead?: DbEmployee | null): HrTeamSummary => ({
    id: record.id,
    name: record.name,
    slug: record.slug,
    description: record.description,
    departmentName: department?.name ?? null,
    leadEmployeeName: fullName(lead),
    memberCount,
    updatedAt: record.updated_at,
});

export const mapAttendanceRecord = (record: DbAttendanceRecord, employee?: DbEmployee | null): AttendanceRecord => ({
    id: record.id,
    employeeId: record.employee_id,
    employeeName: fullName(employee) ?? "Unknown",
    workDate: record.work_date,
    checkIn: record.check_in,
    checkOut: record.check_out,
    status: record.status,
    notes: record.notes,
});

export const mapLeaveType = (record: DbLeaveType): LeaveType => ({
    id: record.id,
    name: record.name,
    code: record.code,
    annualQuota: Number(record.annual_quota),
    paid: record.paid,
});

export const mapLeaveRequest = (record: DbLeaveRequest, employee?: DbEmployee | null, leaveType?: DbLeaveType | null): LeaveRequest => ({
    id: record.id,
    employeeId: record.employee_id,
    employeeName: fullName(employee) ?? "Unknown",
    leaveTypeName: leaveType?.name ?? "Leave",
    startDate: record.start_date,
    endDate: record.end_date,
    status: record.status,
    reason: record.reason,
});

export const mapHoliday = (record: DbHoliday): Holiday => ({
    id: record.id,
    name: record.name,
    holidayDate: record.holiday_date,
    region: record.region,
});

export const mapPayrollCycle = (record: DbPayrollCycle, entries: DbPayrollEntry[]): PayrollCycle => ({
    id: record.id,
    name: record.name,
    periodStart: record.period_start,
    periodEnd: record.period_end,
    status: record.status,
    entryCount: entries.length,
    totalNetPay: entries.reduce((sum, entry) => sum + Number(entry.net_pay), 0),
});

export const mapPayrollEntry = (record: DbPayrollEntry, employee?: DbEmployee | null): PayrollEntry => ({
    id: record.id,
    cycleId: record.cycle_id,
    employeeId: record.employee_id,
    employeeName: fullName(employee) ?? "Unknown",
    baseSalary: Number(record.base_salary),
    allowances: Number(record.allowances),
    deductions: Number(record.deductions),
    netPay: Number(record.net_pay),
    status: record.status,
});

export const mapEmployeeDocument = (record: DbEmployeeDocument, employee?: DbEmployee | null): EmployeeDocument => ({
    id: record.id,
    employeeId: record.employee_id,
    employeeName: fullName(employee) ?? "Unknown",
    title: record.title,
    documentType: record.document_type,
    fileUrl: record.file_url,
    uploadedAt: record.uploaded_at,
});

export const mapPerformanceReview = (
    record: DbPerformanceReview,
    employee?: DbEmployee | null,
    reviewer?: DbEmployee | null,
): PerformanceReview => ({
    id: record.id,
    employeeId: record.employee_id,
    employeeName: fullName(employee) ?? "Unknown",
    reviewerName: fullName(reviewer),
    reviewPeriod: record.review_period,
    rating: Number(record.rating),
    summary: record.summary,
    status: record.status,
    reviewedAt: record.reviewed_at,
});

export const mapJobOpening = (
    record: DbJobOpening,
    candidateCount: number,
    department?: DbDepartment | null,
    designation?: DbDesignation | null,
): JobOpening => ({
    id: record.id,
    title: record.title,
    departmentName: department?.name ?? null,
    designationTitle: designation?.title ?? null,
    status: record.status,
    description: record.description,
    candidateCount,
    openedAt: record.opened_at,
});

export const mapJobCandidate = (record: DbJobCandidate, opening?: DbJobOpening | null): JobCandidate => ({
    id: record.id,
    openingId: record.opening_id,
    openingTitle: opening?.title ?? "Opening",
    fullName: record.full_name,
    email: record.email,
    stage: record.stage,
    appliedAt: record.applied_at,
    notes: record.notes,
});

export const mapOnboardingTask = (record: DbOnboardingTask): OnboardingTask => ({
    id: record.id,
    planId: record.plan_id,
    title: record.title,
    status: record.status,
    dueDate: record.due_date,
    completedAt: record.completed_at,
});

export const mapOnboardingPlan = (record: DbOnboardingPlan, employee?: DbEmployee | null, tasks: DbOnboardingTask[] = []): OnboardingPlan => ({
    id: record.id,
    employeeId: record.employee_id,
    employeeName: fullName(employee) ?? "Unknown",
    status: record.status,
    startDate: record.start_date,
    tasks: tasks.map(mapOnboardingTask),
});

export const mapOffboardingTask = (record: DbOffboardingTask): OffboardingTask => ({
    id: record.id,
    planId: record.plan_id,
    title: record.title,
    status: record.status,
    dueDate: record.due_date,
    completedAt: record.completed_at,
});

export const mapOffboardingPlan = (record: DbOffboardingPlan, employee?: DbEmployee | null, tasks: DbOffboardingTask[] = []): OffboardingPlan => ({
    id: record.id,
    employeeId: record.employee_id,
    employeeName: fullName(employee) ?? "Unknown",
    status: record.status,
    lastWorkingDate: record.last_working_date,
    tasks: tasks.map(mapOffboardingTask),
});

export const mapOrgChartNode = (
    record: DbOrgChartNode,
    employee?: DbEmployee | null,
    department?: DbDepartment | null,
    designation?: DbDesignation | null,
): OrgChartNode => ({
    id: record.id,
    employeeId: record.employee_id,
    employeeName: fullName(employee) ?? "Unknown",
    departmentName: department?.name ?? null,
    designationTitle: designation?.title ?? null,
    parentNodeId: record.parent_node_id,
    sortOrder: record.sort_order,
});

export const buildLookupMaps = (departments: DbDepartment[], designations: DbDesignation[], employees: DbEmployee[]): LookupMaps => ({
    departments: new Map(departments.map((item) => [item.id, item])),
    designations: new Map(designations.map((item) => [item.id, item])),
    employees: new Map(employees.map((item) => [item.id, item])),
});

export const buildHrDashboardStats = (input: {
    employees: EmployeeSummary[];
    departments: DepartmentSummary[];
    openings: JobOpening[];
    leaveRequests: LeaveRequest[];
    holidays: Holiday[];
    onboardingPlans: OnboardingPlan[];
    reviews: PerformanceReview[];
}): HrDashboardStats => {
    const activeEmployees = input.employees.filter((employee) => employee.status === "active").length;
    const pendingLeaveRequests = input.leaveRequests.filter((request) => request.status === "pending").length;
    const today = new Date().toISOString().slice(0, 10);
    const upcomingHolidays = input.holidays.filter((holiday) => holiday.holidayDate >= today).length;
    const activeOnboarding = input.onboardingPlans.filter((plan) => plan.status === "in_progress").length;
    const completedReviews = input.reviews.filter((review) => review.rating > 0);
    const avgPerformanceRating = completedReviews.length
        ? completedReviews.reduce((sum, review) => sum + review.rating, 0) / completedReviews.length
        : 0;

    return {
        totalEmployees: input.employees.length,
        activeEmployees,
        departments: input.departments.length,
        openPositions: input.openings.filter((opening) => opening.status === "open").length,
        pendingLeaveRequests,
        upcomingHolidays,
        activeOnboarding,
        avgPerformanceRating: Number(avgPerformanceRating.toFixed(1)),
    };
};

export const buildHrAnalyticsReport = (input: {
    employees: EmployeeSummary[];
    leaveRequests: LeaveRequest[];
    attendance: AttendanceRecord[];
    candidates: JobCandidate[];
    reviews: PerformanceReview[];
}): HrAnalyticsReport => {
    const departmentCounts = new Map<string, number>();
    for (const employee of input.employees) {
        const key = employee.departmentName ?? "Unassigned";
        departmentCounts.set(key, (departmentCounts.get(key) ?? 0) + 1);
    }

    const leaveCounts = new Map<string, number>();
    for (const request of input.leaveRequests) {
        leaveCounts.set(request.leaveTypeName, (leaveCounts.get(request.leaveTypeName) ?? 0) + 1);
    }

    const attendanceCounts = new Map<string, number>();
    for (const record of input.attendance) {
        attendanceCounts.set(record.status, (attendanceCounts.get(record.status) ?? 0) + 1);
    }

    const pipelineCounts = new Map<string, number>();
    for (const candidate of input.candidates) {
        pipelineCounts.set(candidate.stage, (pipelineCounts.get(candidate.stage) ?? 0) + 1);
    }

    const ratingBands = new Map<string, number>();
    for (const review of input.reviews) {
        const band = review.rating >= 4.5 ? "Excellent (4.5+)" : review.rating >= 3.5 ? "Strong (3.5-4.4)" : review.rating >= 2.5 ? "Developing (2.5-3.4)" : "Needs Support (<2.5)";
        ratingBands.set(band, (ratingBands.get(band) ?? 0) + 1);
    }

    return {
        headcountByDepartment: Array.from(departmentCounts.entries()).map(([department, count]) => ({ department, count })),
        leaveUtilization: Array.from(leaveCounts.entries()).map(([leaveType, requests]) => ({ leaveType, requests })),
        attendanceSummary: Array.from(attendanceCounts.entries()).map(([status, count]) => ({ status, count })),
        recruitmentPipeline: Array.from(pipelineCounts.entries()).map(([stage, count]) => ({ stage, count })),
        performanceDistribution: Array.from(ratingBands.entries()).map(([ratingBand, count]) => ({ ratingBand, count })),
    };
};

export const buildDepartmentPayload = (organizationId: string, input: CreateDepartmentInput) => ({
    organization_id: organizationId,
    name: input.name,
    code: input.code,
    description: input.description,
});

export const buildDesignationPayload = (organizationId: string, input: CreateDesignationInput) => ({
    organization_id: organizationId,
    title: input.title,
    level: input.level,
    description: input.description,
});

export const buildEmployeePayload = (organizationId: string, input: CreateEmployeeInput) => ({
    organization_id: organizationId,
    employee_code: input.employeeCode,
    first_name: input.firstName,
    last_name: input.lastName,
    email: input.email,
    phone: input.phone,
    department_id: input.departmentId ?? null,
    designation_id: input.designationId ?? null,
    employment_type: input.employmentType,
    hire_date: input.hireDate,
    base_salary: input.baseSalary,
    status: "active",
});

export const buildHrTeamPayload = (organizationId: string, input: CreateHrTeamInput) => ({
    organization_id: organizationId,
    name: input.name,
    slug: input.slug,
    description: input.description,
    department_id: input.departmentId ?? null,
});

export const buildLeaveRequestPayload = (organizationId: string, input: CreateLeaveRequestInput) => ({
    organization_id: organizationId,
    employee_id: input.employeeId,
    leave_type_id: input.leaveTypeId,
    start_date: input.startDate,
    end_date: input.endDate,
    reason: input.reason,
    status: "pending",
});

export const buildHolidayPayload = (organizationId: string, input: CreateHolidayInput) => ({
    organization_id: organizationId,
    name: input.name,
    holiday_date: input.holidayDate,
    region: input.region,
});

export const buildJobOpeningPayload = (organizationId: string, input: CreateJobOpeningInput) => ({
    organization_id: organizationId,
    title: input.title,
    department_id: input.departmentId ?? null,
    designation_id: input.designationId ?? null,
    description: input.description,
    status: "open",
});

export const buildJobCandidatePayload = (input: CreateJobCandidateInput) => ({
    opening_id: input.openingId,
    full_name: input.fullName,
    email: input.email,
    notes: input.notes,
    stage: "applied",
});

export const buildHrActivityPayload = (organizationId: string, entityType: string, action: string, title: string, description: string) => ({
    organization_id: organizationId,
    entity_type: entityType,
    action,
    title,
    description,
});
