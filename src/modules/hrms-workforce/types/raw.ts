import type {
    DbActivityLog,
    DbAsset,
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
    DbPayrollCycle,
    DbPayrollEntry,
    DbPerformanceReview,
    DbProject,
} from "@/src/modules/database/types/platform";

export interface HrmsWorkforceRawData {
    organizationId: string;
    departments: DbDepartment[];
    designations: DbDesignation[];
    employees: DbEmployee[];
    teams: DbHrTeam[];
    attendance: DbAttendanceRecord[];
    leaveTypes: DbLeaveType[];
    leaveRequests: DbLeaveRequest[];
    holidays: DbHoliday[];
    payrollCycles: DbPayrollCycle[];
    payrollEntries: DbPayrollEntry[];
    documents: DbEmployeeDocument[];
    performanceReviews: DbPerformanceReview[];
    jobOpenings: DbJobOpening[];
    jobCandidates: DbJobCandidate[];
    onboardingPlans: DbOnboardingPlan[];
    onboardingTasks: DbOnboardingTask[];
    offboardingPlans: DbOffboardingPlan[];
    offboardingTasks: DbOffboardingTask[];
    assets: DbAsset[];
    projects: DbProject[];
    activityLogs: DbActivityLog[];
    fetchedAt: string;
}
