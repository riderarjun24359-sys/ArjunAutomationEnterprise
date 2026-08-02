import {
    buildDepartmentPayload,
    buildDesignationPayload,
    buildEmployeePayload,
    buildHolidayPayload,
    buildHrActivityPayload,
    buildHrAnalyticsReport,
    buildHrDashboardStats,
    buildHrTeamPayload,
    buildJobCandidatePayload,
    buildJobOpeningPayload,
    buildLeaveRequestPayload,
    buildLookupMaps,
    mapAttendanceRecord,
    mapDepartmentSummary,
    mapDesignationSummary,
    mapEmployeeDocument,
    mapEmployeeSummary,
    mapHoliday,
    mapHrTeamSummary,
    mapJobCandidate,
    mapJobOpening,
    mapLeaveRequest,
    mapLeaveType,
    mapOffboardingPlan,
    mapOnboardingPlan,
    mapOrgChartNode,
    mapPayrollCycle,
    mapPayrollEntry,
    mapPerformanceReview,
} from "@/src/modules/database/lib/hr-mappers";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
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
    OnboardingPlan,
    OrgChartNode,
    PayrollCycle,
    PayrollEntry,
    PerformanceReview,
    RoleAccessSummary,
    UpdateJobCandidateStageInput,
    UpdateLeaveRequestStatusInput,
    UpdateLifecycleTaskInput,
} from "@/src/modules/hr/types";

export class HrService {
    private async getContext(authUserId: string, email: string, fullName?: string | null) {
        return resolveOrganizationContext(authUserId, email, fullName);
    }

    private async getLookupMaps(organizationId: string) {
        const [departments, designations, employees] = await Promise.all([
            databaseService.departments.listByOrganization(organizationId),
            databaseService.designations.listByOrganization(organizationId),
            databaseService.employees.listByOrganization(organizationId),
        ]);
        return { ...buildLookupMaps(departments, designations, employees), raw: { departments, designations, employees } };
    }

    async getDepartments(authUserId: string, email: string, fullName?: string | null): Promise<DepartmentSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const { raw, employees } = await this.getLookupMaps(context.organizationId);
        return raw.departments.map((department) => {
            const employeeCount = raw.employees.filter((employee) => employee.department_id === department.id).length;
            const head = department.head_employee_id ? employees.get(department.head_employee_id) ?? null : null;
            return mapDepartmentSummary(department, employeeCount, head);
        });
    }

    async createDepartment(authUserId: string, email: string, input: CreateDepartmentInput, fullName?: string | null): Promise<DepartmentSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.departments.create(buildDepartmentPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create department");
        await databaseService.activityLogs.create(buildHrActivityPayload(context.organizationId, "department", "create", created.name, "Department created"));
        return mapDepartmentSummary(created, 0, null);
    }

    async getDesignations(authUserId: string, email: string, fullName?: string | null): Promise<DesignationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const { raw } = await this.getLookupMaps(context.organizationId);
        return raw.designations.map((designation) => {
            const employeeCount = raw.employees.filter((employee) => employee.designation_id === designation.id).length;
            return mapDesignationSummary(designation, employeeCount);
        });
    }

    async createDesignation(authUserId: string, email: string, input: CreateDesignationInput, fullName?: string | null): Promise<DesignationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.designations.create(buildDesignationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create designation");
        return mapDesignationSummary(created, 0);
    }

    async getEmployees(authUserId: string, email: string, fullName?: string | null): Promise<EmployeeSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getLookupMaps(context.organizationId);
        return maps.raw.employees.map((employee) => mapEmployeeSummary(employee, maps));
    }

    async createEmployee(authUserId: string, email: string, input: CreateEmployeeInput, fullName?: string | null): Promise<EmployeeSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.employees.create(buildEmployeePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create employee");
        await databaseService.activityLogs.create(buildHrActivityPayload(context.organizationId, "employee", "create", `${created.first_name} ${created.last_name}`, "Employee record created"));
        const maps = await this.getLookupMaps(context.organizationId);
        return mapEmployeeSummary(created, maps);
    }

    async getHrTeams(authUserId: string, email: string, fullName?: string | null): Promise<HrTeamSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getLookupMaps(context.organizationId);
        const teams = await databaseService.hrTeams.listByOrganization(context.organizationId);
        return Promise.all(
            teams.map(async (team) => {
                const members = await databaseService.hrTeamMembers.listByTeam(team.id);
                const department = team.department_id ? maps.departments.get(team.department_id) ?? null : null;
                const lead = team.lead_employee_id ? maps.employees.get(team.lead_employee_id) ?? null : null;
                return mapHrTeamSummary(team, members.length, department, lead);
            }),
        );
    }

    async createHrTeam(authUserId: string, email: string, input: CreateHrTeamInput, fullName?: string | null): Promise<HrTeamSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.hrTeams.create(buildHrTeamPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create HR team");
        return mapHrTeamSummary(created, 0, null, null);
    }

    async getAttendance(authUserId: string, email: string, fullName?: string | null): Promise<AttendanceRecord[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getLookupMaps(context.organizationId);
        const records = await databaseService.attendanceRecords.listByOrganization(context.organizationId, { orderBy: "work_date", orderDirection: "desc" });
        return records.map((record) => mapAttendanceRecord(record, maps.employees.get(record.employee_id)));
    }

    async getLeaveTypes(authUserId: string, email: string, fullName?: string | null): Promise<LeaveType[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const records = await databaseService.leaveTypes.listByOrganization(context.organizationId);
        return records.map(mapLeaveType);
    }

    async getLeaveRequests(authUserId: string, email: string, fullName?: string | null): Promise<LeaveRequest[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getLookupMaps(context.organizationId);
        const leaveTypes = await databaseService.leaveTypes.listByOrganization(context.organizationId);
        const leaveTypeMap = new Map(leaveTypes.map((item) => [item.id, item]));
        const records = await databaseService.leaveRequests.listByOrganization(context.organizationId, { orderBy: "start_date", orderDirection: "desc" });
        return records.map((record) => mapLeaveRequest(record, maps.employees.get(record.employee_id), leaveTypeMap.get(record.leave_type_id)));
    }

    async createLeaveRequest(authUserId: string, email: string, input: CreateLeaveRequestInput, fullName?: string | null): Promise<LeaveRequest> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.leaveRequests.create(buildLeaveRequestPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create leave request");
        const maps = await this.getLookupMaps(context.organizationId);
        const leaveType = await databaseService.leaveTypes.getById(created.leave_type_id);
        return mapLeaveRequest(created, maps.employees.get(created.employee_id), leaveType);
    }

    async updateLeaveRequestStatus(authUserId: string, email: string, requestId: string, input: UpdateLeaveRequestStatusInput, fullName?: string | null): Promise<LeaveRequest> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const updated = await databaseService.leaveRequests.update(requestId, { status: input.status });
        if (!updated) throw new Error("Failed to update leave request");
        const maps = await this.getLookupMaps(context.organizationId);
        const leaveType = await databaseService.leaveTypes.getById(updated.leave_type_id);
        return mapLeaveRequest(updated, maps.employees.get(updated.employee_id), leaveType);
    }

    async getHolidays(authUserId: string, email: string, fullName?: string | null): Promise<Holiday[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const records = await databaseService.holidays.listByOrganization(context.organizationId, { orderBy: "holiday_date", orderDirection: "asc" });
        return records.map(mapHoliday);
    }

    async createHoliday(authUserId: string, email: string, input: CreateHolidayInput, fullName?: string | null): Promise<Holiday> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.holidays.create(buildHolidayPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create holiday");
        return mapHoliday(created);
    }

    async getPayrollCycles(authUserId: string, email: string, fullName?: string | null): Promise<PayrollCycle[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const cycles = await databaseService.payrollCycles.listByOrganization(context.organizationId, { orderBy: "period_start", orderDirection: "desc" });
        return Promise.all(
            cycles.map(async (cycle) => {
                const entries = await databaseService.payrollEntries.listByCycle(cycle.id);
                return mapPayrollCycle(cycle, entries);
            }),
        );
    }

    async getPayrollEntries(authUserId: string, email: string, fullName?: string | null): Promise<PayrollEntry[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getLookupMaps(context.organizationId);
        const cycles = await databaseService.payrollCycles.listByOrganization(context.organizationId);
        const allEntries = await Promise.all(cycles.map((cycle) => databaseService.payrollEntries.listByCycle(cycle.id)));
        return allEntries.flat().map((entry) => mapPayrollEntry(entry, maps.employees.get(entry.employee_id)));
    }

    async getDocuments(authUserId: string, email: string, fullName?: string | null): Promise<EmployeeDocument[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getLookupMaps(context.organizationId);
        const records = await databaseService.employeeDocuments.listByOrganization(context.organizationId, { orderBy: "uploaded_at", orderDirection: "desc" });
        return records.map((record) => mapEmployeeDocument(record, maps.employees.get(record.employee_id)));
    }

    async getPerformanceReviews(authUserId: string, email: string, fullName?: string | null): Promise<PerformanceReview[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getLookupMaps(context.organizationId);
        const records = await databaseService.performanceReviews.listByOrganization(context.organizationId, { orderBy: "reviewed_at", orderDirection: "desc" });
        return records.map((record) => mapPerformanceReview(record, maps.employees.get(record.employee_id), record.reviewer_id ? maps.employees.get(record.reviewer_id) : null));
    }

    async getJobOpenings(authUserId: string, email: string, fullName?: string | null): Promise<JobOpening[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getLookupMaps(context.organizationId);
        const openings = await databaseService.jobOpenings.listByOrganization(context.organizationId, { orderBy: "opened_at", orderDirection: "desc" });
        return Promise.all(
            openings.map(async (opening) => {
                const candidates = await databaseService.jobCandidates.listByOpening(opening.id);
                return mapJobOpening(opening, candidates.length, opening.department_id ? maps.departments.get(opening.department_id) ?? null : null, opening.designation_id ? maps.designations.get(opening.designation_id) ?? null : null);
            }),
        );
    }

    async createJobOpening(authUserId: string, email: string, input: CreateJobOpeningInput, fullName?: string | null): Promise<JobOpening> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.jobOpenings.create(buildJobOpeningPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create job opening");
        const maps = await this.getLookupMaps(context.organizationId);
        return mapJobOpening(created, 0, created.department_id ? maps.departments.get(created.department_id) ?? null : null, created.designation_id ? maps.designations.get(created.designation_id) ?? null : null);
    }

    async getJobCandidates(authUserId: string, email: string, fullName?: string | null): Promise<JobCandidate[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const openings = await databaseService.jobOpenings.listByOrganization(context.organizationId);
        const openingMap = new Map(openings.map((opening) => [opening.id, opening]));
        const allCandidates = await Promise.all(openings.map((opening) => databaseService.jobCandidates.listByOpening(opening.id)));
        return allCandidates.flat().map((candidate) => mapJobCandidate(candidate, openingMap.get(candidate.opening_id)));
    }

    async createJobCandidate(authUserId: string, email: string, input: CreateJobCandidateInput, fullName?: string | null): Promise<JobCandidate> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.jobCandidates.create(buildJobCandidatePayload(input));
        if (!created) throw new Error("Failed to create job candidate");
        const opening = await databaseService.jobOpenings.getById(created.opening_id);
        return mapJobCandidate(created, opening);
    }

    async updateJobCandidateStage(authUserId: string, email: string, candidateId: string, input: UpdateJobCandidateStageInput, fullName?: string | null): Promise<JobCandidate> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const updated = await databaseService.jobCandidates.update(candidateId, { stage: input.stage });
        if (!updated) throw new Error("Failed to update candidate stage");
        const opening = await databaseService.jobOpenings.getById(updated.opening_id);
        return mapJobCandidate(updated, opening);
    }

    async getOnboardingPlans(authUserId: string, email: string, fullName?: string | null): Promise<OnboardingPlan[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getLookupMaps(context.organizationId);
        const plans = await databaseService.onboardingPlans.listByOrganization(context.organizationId);
        return Promise.all(
            plans.map(async (plan) => {
                const tasks = await databaseService.onboardingTasks.listByPlan(plan.id);
                return mapOnboardingPlan(plan, maps.employees.get(plan.employee_id), tasks);
            }),
        );
    }

    async getOffboardingPlans(authUserId: string, email: string, fullName?: string | null): Promise<OffboardingPlan[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getLookupMaps(context.organizationId);
        const plans = await databaseService.offboardingPlans.listByOrganization(context.organizationId);
        return Promise.all(
            plans.map(async (plan) => {
                const tasks = await databaseService.offboardingTasks.listByPlan(plan.id);
                return mapOffboardingPlan(plan, maps.employees.get(plan.employee_id), tasks);
            }),
        );
    }

    async updateOnboardingTask(authUserId: string, email: string, taskId: string, input: UpdateLifecycleTaskInput, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const updated = await databaseService.onboardingTasks.update(taskId, {
            status: input.status,
            completed_at: input.status === "completed" ? new Date().toISOString() : null,
        });
        if (!updated) throw new Error("Failed to update onboarding task");
        return updated;
    }

    async updateOffboardingTask(authUserId: string, email: string, taskId: string, input: UpdateLifecycleTaskInput, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const updated = await databaseService.offboardingTasks.update(taskId, {
            status: input.status,
            completed_at: input.status === "completed" ? new Date().toISOString() : null,
        });
        if (!updated) throw new Error("Failed to update offboarding task");
        return updated;
    }

    async getOrgChart(authUserId: string, email: string, fullName?: string | null): Promise<OrgChartNode[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getLookupMaps(context.organizationId);
        const nodes = await databaseService.orgChartNodes.listByOrganization(context.organizationId, { orderBy: "sort_order", orderDirection: "asc" });
        return nodes.map((node) => {
            const employee = maps.employees.get(node.employee_id);
            const department = node.department_id ? maps.departments.get(node.department_id) ?? null : employee?.department_id ? maps.departments.get(employee.department_id) ?? null : null;
            const designation = employee?.designation_id ? maps.designations.get(employee.designation_id) ?? null : null;
            return mapOrgChartNode(node, employee, department, designation);
        });
    }

    async getRoleAccess(authUserId: string, email: string, fullName?: string | null): Promise<RoleAccessSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const [roles, permissions] = await Promise.all([
            databaseService.roles.listByOrganization(context.organizationId),
            databaseService.permissions.listAll(),
        ]);
        const permissionMap = new Map(permissions.map((permission) => [permission.id, permission.key]));
        const hrPermissions = new Set(["hr.view", "hr.manage", "hr.payroll.manage", "hr.recruitment.manage"]);
        const summaries = await Promise.all(
            roles.map(async (role) => {
                const grants = await databaseService.rolePermissionGrants.listByRole(role.id);
                const keys = grants.map((grant) => permissionMap.get(grant.permission_id)).filter((key): key is string => Boolean(key && hrPermissions.has(key)));
                return { roleName: role.name, permissions: keys };
            }),
        );
        return summaries.filter((summary) => summary.permissions.length > 0);
    }

    async getAnalyticsReport(authUserId: string, email: string, fullName?: string | null): Promise<HrAnalyticsReport> {
        const [employees, leaveRequests, attendance, candidates, reviews] = await Promise.all([
            this.getEmployees(authUserId, email, fullName),
            this.getLeaveRequests(authUserId, email, fullName),
            this.getAttendance(authUserId, email, fullName),
            this.getJobCandidates(authUserId, email, fullName),
            this.getPerformanceReviews(authUserId, email, fullName),
        ]);
        return buildHrAnalyticsReport({ employees, leaveRequests, attendance, candidates, reviews });
    }

    async getDashboardStats(authUserId: string, email: string, fullName?: string | null): Promise<HrDashboardStats> {
        const [employees, departments, openings, leaveRequests, holidays, onboardingPlans, reviews] = await Promise.all([
            this.getEmployees(authUserId, email, fullName),
            this.getDepartments(authUserId, email, fullName),
            this.getJobOpenings(authUserId, email, fullName),
            this.getLeaveRequests(authUserId, email, fullName),
            this.getHolidays(authUserId, email, fullName),
            this.getOnboardingPlans(authUserId, email, fullName),
            this.getPerformanceReviews(authUserId, email, fullName),
        ]);
        return buildHrDashboardStats({ employees, departments, openings, leaveRequests, holidays, onboardingPlans, reviews });
    }
}

export const hrService = new HrService();
