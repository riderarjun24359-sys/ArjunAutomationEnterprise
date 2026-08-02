"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { hrService } from "@/src/modules/hr/services/hr.service";
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

export function useHr() {
    const user = useAuthStore((state) => state.user);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<HrDashboardStats | null>(null);
    const [departments, setDepartments] = useState<DepartmentSummary[]>([]);
    const [designations, setDesignations] = useState<DesignationSummary[]>([]);
    const [employees, setEmployees] = useState<EmployeeSummary[]>([]);
    const [teams, setTeams] = useState<HrTeamSummary[]>([]);
    const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
    const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
    const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
    const [holidays, setHolidays] = useState<Holiday[]>([]);
    const [payrollCycles, setPayrollCycles] = useState<PayrollCycle[]>([]);
    const [payrollEntries, setPayrollEntries] = useState<PayrollEntry[]>([]);
    const [documents, setDocuments] = useState<EmployeeDocument[]>([]);
    const [reviews, setReviews] = useState<PerformanceReview[]>([]);
    const [openings, setOpenings] = useState<JobOpening[]>([]);
    const [candidates, setCandidates] = useState<JobCandidate[]>([]);
    const [onboardingPlans, setOnboardingPlans] = useState<OnboardingPlan[]>([]);
    const [offboardingPlans, setOffboardingPlans] = useState<OffboardingPlan[]>([]);
    const [orgChart, setOrgChart] = useState<OrgChartNode[]>([]);
    const [roleAccess, setRoleAccess] = useState<RoleAccessSummary[]>([]);
    const [analytics, setAnalytics] = useState<HrAnalyticsReport | null>(null);

    const fetchHrData = useCallback(async () => {
        if (!user) {
            return {
                dashboardStats: null,
                departmentList: [],
                designationList: [],
                employeeList: [],
                teamList: [],
                attendanceList: [],
                leaveTypeList: [],
                leaveRequestList: [],
                holidayList: [],
                payrollCycleList: [],
                payrollEntryList: [],
                documentList: [],
                reviewList: [],
                openingList: [],
                candidateList: [],
                onboardingPlanList: [],
                offboardingPlanList: [],
                orgChartList: [],
                roleAccessList: [],
                analyticsReport: null,
            };
        }

        const [
            dashboardStats,
            departmentList,
            designationList,
            employeeList,
            teamList,
            attendanceList,
            leaveTypeList,
            leaveRequestList,
            holidayList,
            payrollCycleList,
            payrollEntryList,
            documentList,
            reviewList,
            openingList,
            candidateList,
            onboardingPlanList,
            offboardingPlanList,
            orgChartList,
            roleAccessList,
            analyticsReport,
        ] = await Promise.all([
            hrService.getDashboardStats(user.id, user.email, user.fullName),
            hrService.getDepartments(user.id, user.email, user.fullName),
            hrService.getDesignations(user.id, user.email, user.fullName),
            hrService.getEmployees(user.id, user.email, user.fullName),
            hrService.getHrTeams(user.id, user.email, user.fullName),
            hrService.getAttendance(user.id, user.email, user.fullName),
            hrService.getLeaveTypes(user.id, user.email, user.fullName),
            hrService.getLeaveRequests(user.id, user.email, user.fullName),
            hrService.getHolidays(user.id, user.email, user.fullName),
            hrService.getPayrollCycles(user.id, user.email, user.fullName),
            hrService.getPayrollEntries(user.id, user.email, user.fullName),
            hrService.getDocuments(user.id, user.email, user.fullName),
            hrService.getPerformanceReviews(user.id, user.email, user.fullName),
            hrService.getJobOpenings(user.id, user.email, user.fullName),
            hrService.getJobCandidates(user.id, user.email, user.fullName),
            hrService.getOnboardingPlans(user.id, user.email, user.fullName),
            hrService.getOffboardingPlans(user.id, user.email, user.fullName),
            hrService.getOrgChart(user.id, user.email, user.fullName),
            hrService.getRoleAccess(user.id, user.email, user.fullName),
            hrService.getAnalyticsReport(user.id, user.email, user.fullName),
        ]);

        return {
            dashboardStats,
            departmentList,
            designationList,
            employeeList,
            teamList,
            attendanceList,
            leaveTypeList,
            leaveRequestList,
            holidayList,
            payrollCycleList,
            payrollEntryList,
            documentList,
            reviewList,
            openingList,
            candidateList,
            onboardingPlanList,
            offboardingPlanList,
            orgChartList,
            roleAccessList,
            analyticsReport,
        };
    }, [user]);

    const applyData = useCallback((data: Awaited<ReturnType<typeof fetchHrData>>) => {
        setStats(data.dashboardStats);
        setDepartments(data.departmentList);
        setDesignations(data.designationList);
        setEmployees(data.employeeList);
        setTeams(data.teamList);
        setAttendance(data.attendanceList);
        setLeaveTypes(data.leaveTypeList);
        setLeaveRequests(data.leaveRequestList);
        setHolidays(data.holidayList);
        setPayrollCycles(data.payrollCycleList);
        setPayrollEntries(data.payrollEntryList);
        setDocuments(data.documentList);
        setReviews(data.reviewList);
        setOpenings(data.openingList);
        setCandidates(data.candidateList);
        setOnboardingPlans(data.onboardingPlanList);
        setOffboardingPlans(data.offboardingPlanList);
        setOrgChart(data.orgChartList);
        setRoleAccess(data.roleAccessList);
        setAnalytics(data.analyticsReport);
        setLoading(false);
    }, []);

    const refresh = useCallback(async () => {
        const data = await fetchHrData();
        applyData(data);
    }, [fetchHrData, applyData]);

    useEffect(() => {
        let cancelled = false;
        void fetchHrData()
            .then((data) => {
                if (cancelled) return;
                applyData(data);
            })
            .catch(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [fetchHrData, applyData]);

    const createDepartment = useCallback(async (input: CreateDepartmentInput) => {
        if (!user) throw new Error("Authentication required");
        await hrService.createDepartment(user.id, user.email, input, user.fullName);
        await refresh();
    }, [user, refresh]);

    const createDesignation = useCallback(async (input: CreateDesignationInput) => {
        if (!user) throw new Error("Authentication required");
        await hrService.createDesignation(user.id, user.email, input, user.fullName);
        await refresh();
    }, [user, refresh]);

    const createEmployee = useCallback(async (input: CreateEmployeeInput) => {
        if (!user) throw new Error("Authentication required");
        await hrService.createEmployee(user.id, user.email, input, user.fullName);
        await refresh();
    }, [user, refresh]);

    const createHrTeam = useCallback(async (input: CreateHrTeamInput) => {
        if (!user) throw new Error("Authentication required");
        await hrService.createHrTeam(user.id, user.email, input, user.fullName);
        await refresh();
    }, [user, refresh]);

    const createLeaveRequest = useCallback(async (input: CreateLeaveRequestInput) => {
        if (!user) throw new Error("Authentication required");
        await hrService.createLeaveRequest(user.id, user.email, input, user.fullName);
        await refresh();
    }, [user, refresh]);

    const updateLeaveRequestStatus = useCallback(async (requestId: string, input: UpdateLeaveRequestStatusInput) => {
        if (!user) throw new Error("Authentication required");
        await hrService.updateLeaveRequestStatus(user.id, user.email, requestId, input, user.fullName);
        await refresh();
    }, [user, refresh]);

    const createHoliday = useCallback(async (input: CreateHolidayInput) => {
        if (!user) throw new Error("Authentication required");
        await hrService.createHoliday(user.id, user.email, input, user.fullName);
        await refresh();
    }, [user, refresh]);

    const createJobOpening = useCallback(async (input: CreateJobOpeningInput) => {
        if (!user) throw new Error("Authentication required");
        await hrService.createJobOpening(user.id, user.email, input, user.fullName);
        await refresh();
    }, [user, refresh]);

    const createJobCandidate = useCallback(async (input: CreateJobCandidateInput) => {
        if (!user) throw new Error("Authentication required");
        await hrService.createJobCandidate(user.id, user.email, input, user.fullName);
        await refresh();
    }, [user, refresh]);

    const updateJobCandidateStage = useCallback(async (candidateId: string, input: UpdateJobCandidateStageInput) => {
        if (!user) throw new Error("Authentication required");
        await hrService.updateJobCandidateStage(user.id, user.email, candidateId, input, user.fullName);
        await refresh();
    }, [user, refresh]);

    const updateOnboardingTask = useCallback(async (taskId: string, input: UpdateLifecycleTaskInput) => {
        if (!user) throw new Error("Authentication required");
        await hrService.updateOnboardingTask(user.id, user.email, taskId, input, user.fullName);
        await refresh();
    }, [user, refresh]);

    const updateOffboardingTask = useCallback(async (taskId: string, input: UpdateLifecycleTaskInput) => {
        if (!user) throw new Error("Authentication required");
        await hrService.updateOffboardingTask(user.id, user.email, taskId, input, user.fullName);
        await refresh();
    }, [user, refresh]);

    return {
        loading,
        stats,
        departments,
        designations,
        employees,
        teams,
        attendance,
        leaveTypes,
        leaveRequests,
        holidays,
        payrollCycles,
        payrollEntries,
        documents,
        reviews,
        openings,
        candidates,
        onboardingPlans,
        offboardingPlans,
        orgChart,
        roleAccess,
        analytics,
        createDepartment,
        createDesignation,
        createEmployee,
        createHrTeam,
        createLeaveRequest,
        updateLeaveRequestStatus,
        createHoliday,
        createJobOpening,
        createJobCandidate,
        updateJobCandidateStage,
        updateOnboardingTask,
        updateOffboardingTask,
        refresh,
    };
}
