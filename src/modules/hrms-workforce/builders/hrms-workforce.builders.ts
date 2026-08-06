import type { HrmsWorkforceRawData } from "../types/raw";
import type {
    AssetManagementItem,
    AttendanceItem,
    DepartmentItem,
    EmployeeManagementItem,
    ExecutiveHrWidgets,
    HrAuditLogItem,
    HrmsWorkforceSnapshot,
    LeaveManagementItem,
    PayrollItem,
    PerformanceReviewItem,
    RecruitmentItem,
    SelfServicePortalItem,
    TrainingLearningItem,
} from "../types/os";
import { clampScore, daysBetween, employeeFullName, HR_AUDIT_ENTITY_TYPES, money } from "../utils/formatters";

function empName(data: HrmsWorkforceRawData, id?: string | null): string {
    if (!id) return "Unknown employee";
    const e = data.employees.find((x) => x.id === id);
    return e ? employeeFullName(e.first_name, e.last_name) : "Unknown employee";
}

function deptName(data: HrmsWorkforceRawData, id?: string | null): string {
    if (!id) return "Unassigned";
    return data.departments.find((d) => d.id === id)?.name ?? "Unassigned";
}

function desigTitle(data: HrmsWorkforceRawData, id?: string | null): string {
    if (!id) return "Unassigned";
    return data.designations.find((d) => d.id === id)?.title ?? "Unassigned";
}

function projectName(data: HrmsWorkforceRawData, id?: string | null): string | null {
    if (!id) return null;
    return data.projects.find((p) => p.id === id)?.name ?? null;
}

export function buildEmployees(data: HrmsWorkforceRawData): EmployeeManagementItem[] {
    return data.employees
        .map((e) => ({
            id: e.id,
            employeeCode: e.employee_code,
            fullName: employeeFullName(e.first_name, e.last_name),
            email: e.email,
            departmentName: deptName(data, e.department_id),
            designationTitle: desigTitle(data, e.designation_id),
            managerName: e.manager_id ? empName(data, e.manager_id) : null,
            status: e.status,
            employmentType: e.employment_type,
            hireDate: e.hire_date,
            baseSalary: money(Number(e.base_salary ?? 0)),
        }))
        .sort((a, b) => a.fullName.localeCompare(b.fullName));
}

export function buildDepartments(data: HrmsWorkforceRawData): DepartmentItem[] {
    return data.departments.map((d) => ({
        id: d.id,
        name: d.name,
        code: d.code,
        description: d.description,
        headName: d.head_employee_id ? empName(data, d.head_employee_id) : null,
        employeeCount: data.employees.filter((e) => e.department_id === d.id).length,
        parentName: d.parent_department_id ? deptName(data, d.parent_department_id) : null,
    }));
}

export function buildAttendance(data: HrmsWorkforceRawData): AttendanceItem[] {
    return data.attendance
        .map((a) => ({
            id: a.id,
            employeeId: a.employee_id,
            employeeName: empName(data, a.employee_id),
            workDate: a.work_date,
            status: a.status,
            checkIn: a.check_in ?? null,
            checkOut: a.check_out ?? null,
            notes: a.notes,
        }))
        .sort((a, b) => b.workDate.localeCompare(a.workDate));
}

export function buildLeave(data: HrmsWorkforceRawData): LeaveManagementItem[] {
    return data.leaveRequests
        .map((r) => {
            const leaveType = data.leaveTypes.find((t) => t.id === r.leave_type_id)?.name ?? "Leave";
            return {
                id: r.id,
                employeeId: r.employee_id,
                employeeName: empName(data, r.employee_id),
                leaveType,
                startDate: r.start_date,
                endDate: r.end_date,
                status: r.status,
                reason: r.reason,
                days: daysBetween(r.start_date, r.end_date),
            };
        })
        .sort((a, b) => b.startDate.localeCompare(a.startDate));
}

export function buildPayroll(data: HrmsWorkforceRawData): PayrollItem[] {
    return data.payrollEntries
        .map((entry) => {
            const cycle = data.payrollCycles.find((c) => c.id === entry.cycle_id);
            return {
                id: entry.id,
                cycleId: entry.cycle_id,
                cycleName: cycle?.name ?? "Payroll cycle",
                employeeId: entry.employee_id,
                employeeName: empName(data, entry.employee_id),
                baseSalary: money(Number(entry.base_salary ?? 0)),
                allowances: money(Number(entry.allowances ?? 0)),
                deductions: money(Number(entry.deductions ?? 0)),
                netPay: money(Number(entry.net_pay ?? 0)),
                status: entry.status,
                periodStart: cycle?.period_start ?? "",
                periodEnd: cycle?.period_end ?? "",
            };
        })
        .sort((a, b) => b.periodEnd.localeCompare(a.periodEnd));
}

export function buildRecruitment(data: HrmsWorkforceRawData): RecruitmentItem[] {
    return data.jobCandidates
        .map((c) => {
            const opening = data.jobOpenings.find((o) => o.id === c.opening_id);
            return {
                id: c.id,
                openingId: c.opening_id,
                openingTitle: opening?.title ?? "Opening",
                departmentName: deptName(data, opening?.department_id),
                candidateName: c.full_name,
                email: c.email,
                stage: c.stage,
                appliedAt: c.applied_at,
                openingStatus: opening?.status ?? "unknown",
            };
        })
        .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());
}

export function buildPerformance(data: HrmsWorkforceRawData): PerformanceReviewItem[] {
    return data.performanceReviews
        .map((r) => {
            const rating = Number(r.rating ?? 0);
            const kpiScore = clampScore(rating <= 5 ? rating * 20 : rating);
            return {
                id: r.id,
                employeeId: r.employee_id,
                employeeName: empName(data, r.employee_id),
                reviewerName: r.reviewer_id ? empName(data, r.reviewer_id) : null,
                reviewPeriod: r.review_period,
                rating,
                kpiScore,
                okrSummary: r.summary
                    ? `OKR focus: ${r.summary.slice(0, 120)}`
                    : `KPI period ${r.review_period} · score ${kpiScore}`,
                status: r.status,
                summary: r.summary,
            };
        })
        .sort((a, b) => b.kpiScore - a.kpiScore);
}

export function buildTraining(data: HrmsWorkforceRawData): TrainingLearningItem[] {
    const fromOnboarding: TrainingLearningItem[] = data.onboardingTasks.map((t) => {
        const plan = data.onboardingPlans.find((p) => p.id === t.plan_id);
        const done = t.status.toLowerCase() === "completed" || Boolean(t.completed_at);
        return {
            id: t.id,
            employeeId: plan?.employee_id ?? "unknown",
            employeeName: empName(data, plan?.employee_id),
            title: t.title,
            kind: "onboarding",
            status: t.status,
            dueDate: t.due_date ?? null,
            progressPercent: done ? 100 : 0,
        };
    });

    const fromDocs: TrainingLearningItem[] = data.documents
        .filter((d) => {
            const type = d.document_type.toLowerCase();
            return type.includes("train") || type.includes("learn") || type.includes("cert");
        })
        .map((d) => ({
            id: d.id,
            employeeId: d.employee_id,
            employeeName: empName(data, d.employee_id),
            title: d.title,
            kind: "document" as const,
            status: "available",
            dueDate: null,
            progressPercent: 100,
        }));

    const paths: TrainingLearningItem[] = data.onboardingPlans.map((p) => {
        const tasks = data.onboardingTasks.filter((t) => t.plan_id === p.id);
        const done = tasks.filter((t) => t.status.toLowerCase() === "completed" || Boolean(t.completed_at)).length;
        const progress = tasks.length === 0 ? (p.status.toLowerCase() === "completed" ? 100 : 25) : Math.round((done / tasks.length) * 100);
        return {
            id: `path-${p.id}`,
            employeeId: p.employee_id,
            employeeName: empName(data, p.employee_id),
            title: `Onboarding learning path`,
            kind: "learning_path",
            status: p.status,
            dueDate: null,
            progressPercent: progress,
        };
    });

    return [...paths, ...fromOnboarding, ...fromDocs];
}

export function buildAssets(data: HrmsWorkforceRawData): AssetManagementItem[] {
    return data.assets.map((a) => ({
        id: a.id,
        assetTag: a.asset_tag,
        name: a.name,
        category: a.category,
        status: a.status,
        employeeId: a.employee_id ?? null,
        employeeName: a.employee_id ? empName(data, a.employee_id) : null,
        projectId: a.project_id ?? null,
        projectName: projectName(data, a.project_id),
        purchaseCost: money(Number(a.purchase_cost ?? 0)),
        acquiredDate: a.acquired_date,
    }));
}

export function buildSelfService(
    data: HrmsWorkforceRawData,
    leave: LeaveManagementItem[],
    attendance: AttendanceItem[],
    assets: AssetManagementItem[],
    performance: PerformanceReviewItem[],
): SelfServicePortalItem[] {
    return data.employees
        .filter((e) => e.status.toLowerCase() === "active")
        .map((e) => {
            const pendingLeaveCount = leave.filter((l) => l.employeeId === e.id && l.status.toLowerCase() === "pending").length;
            const recent = attendance.find((a) => a.employeeId === e.id);
            const openDocuments = data.documents.filter((d) => d.employee_id === e.id).length;
            const assignedAssets = assets.filter((a) => a.employeeId === e.id).length;
            const nextReview = performance.find((p) => p.employeeId === e.id && p.status.toLowerCase() !== "completed")?.reviewPeriod ?? null;
            const onboarding = data.onboardingPlans.find((p) => p.employee_id === e.id);
            return {
                employeeId: e.id,
                employeeName: employeeFullName(e.first_name, e.last_name),
                email: e.email,
                pendingLeaveCount,
                recentAttendanceStatus: recent?.status ?? "no_record",
                openDocuments,
                assignedAssets,
                nextReview,
                onboardingStatus: onboarding?.status ?? null,
            };
        });
}

export function buildAuditTrail(data: HrmsWorkforceRawData): HrAuditLogItem[] {
    const allowed = new Set<string>(HR_AUDIT_ENTITY_TYPES);
    return data.activityLogs
        .filter((a) => allowed.has(a.entity_type.toLowerCase()) || a.entity_type.toLowerCase().includes("employee") || a.entity_type.toLowerCase().includes("hr"))
        .slice(0, 40)
        .map((a) => ({
            id: a.id,
            entityType: a.entity_type,
            action: a.action,
            title: a.title,
            detail: a.detail,
            occurredAt: a.created_at,
        }));
}

export function buildExecutiveHrWidgets(input: {
    employees: EmployeeManagementItem[];
    departments: DepartmentItem[];
    leave: LeaveManagementItem[];
    attendance: AttendanceItem[];
    payroll: PayrollItem[];
    recruitment: RecruitmentItem[];
    performance: PerformanceReviewItem[];
    jobOpeningsCount: number;
}): ExecutiveHrWidgets {
    const present = input.attendance.filter((a) => a.status.toLowerCase() === "present").length;
    const attendancePresentRate =
        input.attendance.length === 0 ? 100 : clampScore((present / input.attendance.length) * 100);

    const stageMap = new Map<string, number>();
    for (const r of input.recruitment) {
        stageMap.set(r.stage, (stageMap.get(r.stage) ?? 0) + 1);
    }

    const avgPerformance =
        input.performance.length === 0
            ? 0
            : Math.round((input.performance.reduce((s, p) => s + p.rating, 0) / input.performance.length) * 10) / 10;

    return {
        headcount: input.employees.filter((e) => e.status.toLowerCase() === "active").length,
        openRoles: input.jobOpeningsCount,
        pendingLeave: input.leave.filter((l) => l.status.toLowerCase() === "pending").length,
        attendancePresentRate,
        payrollNetTotal: money(input.payroll.reduce((s, p) => s + p.netPay, 0)),
        avgPerformanceRating: avgPerformance,
        recruitmentPipeline: [...stageMap.entries()].map(([stage, count]) => ({ stage, count })),
        departmentHeadcount: input.departments.map((d) => ({ department: d.name, count: d.employeeCount })),
    };
}

export function createEmptyHrmsWorkforceSnapshot(): HrmsWorkforceSnapshot {
    return {
        organizationId: null,
        source: "fallback",
        fetchedAt: new Date().toISOString(),
        stats: {
            headcount: 0,
            departments: 0,
            pendingLeave: 0,
            openRoles: 0,
            candidates: 0,
            payrollNetUsd: 0,
            assetsAssigned: 0,
        },
        employees: [],
        departments: [],
        attendance: [],
        leave: [],
        payroll: [],
        recruitment: [],
        performance: [],
        training: [],
        assets: [],
        selfService: [],
        auditTrail: [],
        executiveWidgets: {
            headcount: 0,
            openRoles: 0,
            pendingLeave: 0,
            attendancePresentRate: 100,
            payrollNetTotal: 0,
            avgPerformanceRating: 0,
            recruitmentPipeline: [],
            departmentHeadcount: [],
        },
        assistant: {
            dailySummary: "No organization context loaded.",
            workforceAttention: [],
            leaveRecommendations: [],
            hiringInsights: [],
            performanceInsights: [],
            executiveSummary: "Sign in to load HRMS & Workforce OS.",
            generatedAt: new Date().toISOString(),
        },
    };
}

export function buildHrmsWorkforceSnapshot(data: HrmsWorkforceRawData): HrmsWorkforceSnapshot {
    const employees = buildEmployees(data);
    const departments = buildDepartments(data);
    const attendance = buildAttendance(data);
    const leave = buildLeave(data);
    const payroll = buildPayroll(data);
    const recruitment = buildRecruitment(data);
    const performance = buildPerformance(data);
    const training = buildTraining(data);
    const assets = buildAssets(data);
    const selfService = buildSelfService(data, leave, attendance, assets, performance);
    const auditTrail = buildAuditTrail(data);
    const openRoles = data.jobOpenings.filter((o) => o.status.toLowerCase() === "open").length;
    const executiveWidgets = buildExecutiveHrWidgets({
        employees,
        departments,
        leave,
        attendance,
        payroll,
        recruitment,
        performance,
        jobOpeningsCount: openRoles,
    });

    return {
        organizationId: data.organizationId,
        source: "supabase",
        fetchedAt: data.fetchedAt,
        stats: {
            headcount: executiveWidgets.headcount,
            departments: departments.length,
            pendingLeave: executiveWidgets.pendingLeave,
            openRoles,
            candidates: recruitment.length,
            payrollNetUsd: executiveWidgets.payrollNetTotal,
            assetsAssigned: assets.filter((a) => a.employeeId).length,
        },
        employees,
        departments,
        attendance,
        leave,
        payroll,
        recruitment,
        performance,
        training,
        assets,
        selfService,
        auditTrail,
        executiveWidgets,
        assistant: {
            dailySummary: "",
            workforceAttention: [],
            leaveRecommendations: [],
            hiringInsights: [],
            performanceInsights: [],
            executiveSummary: "",
            generatedAt: data.fetchedAt,
        },
    };
}
