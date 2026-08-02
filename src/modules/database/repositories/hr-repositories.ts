import type {
    DbAttendanceRecord,
    DbDepartment,
    DbDesignation,
    DbEmployee,
    DbEmployeeDocument,
    DbHoliday,
    DbHrTeam,
    DbHrTeamMember,
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
import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";
import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";

abstract class OrgHrRepository<T> extends BaseRepository<T> {
    async listByOrganization(organizationId: string, query: RepositoryQuery = {}): Promise<T[]> {
        const client = getRepositoryClient();
        if (!client) return [];

        const normalized = this.buildQuery(query);
        const { data, error } = await client
            .from(this.table)
            .select("*")
            .eq("organization_id", organizationId)
            .order(normalized.orderBy, { ascending: normalized.orderDirection === "asc" })
            .range(normalized.offset, normalized.offset + normalized.limit - 1);

        mapRepositoryError(error, `Failed to list ${this.table}`);
        return (data ?? []) as T[];
    }

    async getById(id: string): Promise<T | null> {
        const client = getRepositoryClient();
        if (!client) return null;

        const { data, error } = await client.from(this.table).select("*").eq("id", id).maybeSingle();
        mapRepositoryError(error, `Failed to get ${this.table}`);
        return (data as T | null) ?? null;
    }

    async create(input: Record<string, unknown>): Promise<T | null> {
        const client = getRepositoryClient();
        if (!client) return null;

        const { data, error } = await client.from(this.table).insert(input).select("*").maybeSingle();
        mapRepositoryError(error, `Failed to create ${this.table}`);
        return (data as T | null) ?? null;
    }

    async update(id: string, input: Record<string, unknown>): Promise<T | null> {
        const client = getRepositoryClient();
        if (!client) return null;

        const { data, error } = await client.from(this.table).update(input).eq("id", id).select("*").maybeSingle();
        mapRepositoryError(error, `Failed to update ${this.table}`);
        return (data as T | null) ?? null;
    }
}

export class DepartmentRepository extends OrgHrRepository<DbDepartment> {
    protected table = "departments";
}

export class DesignationRepository extends OrgHrRepository<DbDesignation> {
    protected table = "designations";
}

export class EmployeeRepository extends OrgHrRepository<DbEmployee> {
    protected table = "employees";
}

export class HrTeamRepository extends OrgHrRepository<DbHrTeam> {
    protected table = "hr_teams";
}

export class HrTeamMemberRepository extends BaseRepository<DbHrTeamMember> {
    protected table = "hr_team_members";

    async listByTeam(teamId: string): Promise<DbHrTeamMember[]> {
        const client = getRepositoryClient();
        if (!client) return [];

        const { data, error } = await client.from(this.table).select("*").eq("team_id", teamId);
        mapRepositoryError(error, "Failed to list hr_team_members");
        return (data ?? []) as DbHrTeamMember[];
    }

    async create(input: Record<string, unknown>): Promise<DbHrTeamMember | null> {
        const client = getRepositoryClient();
        if (!client) return null;

        const { data, error } = await client.from(this.table).insert(input).select("*").maybeSingle();
        mapRepositoryError(error, "Failed to create hr_team_members");
        return (data as DbHrTeamMember | null) ?? null;
    }
}

export class AttendanceRecordRepository extends OrgHrRepository<DbAttendanceRecord> {
    protected table = "attendance_records";
}

export class LeaveTypeRepository extends OrgHrRepository<DbLeaveType> {
    protected table = "leave_types";
}

export class LeaveRequestRepository extends OrgHrRepository<DbLeaveRequest> {
    protected table = "leave_requests";
}

export class HolidayRepository extends OrgHrRepository<DbHoliday> {
    protected table = "holidays";
}

export class PayrollCycleRepository extends OrgHrRepository<DbPayrollCycle> {
    protected table = "payroll_cycles";
}

export class PayrollEntryRepository extends BaseRepository<DbPayrollEntry> {
    protected table = "payroll_entries";

    async listByCycle(cycleId: string): Promise<DbPayrollEntry[]> {
        const client = getRepositoryClient();
        if (!client) return [];

        const { data, error } = await client.from(this.table).select("*").eq("cycle_id", cycleId);
        mapRepositoryError(error, "Failed to list payroll_entries");
        return (data ?? []) as DbPayrollEntry[];
    }

    async create(input: Record<string, unknown>): Promise<DbPayrollEntry | null> {
        const client = getRepositoryClient();
        if (!client) return null;

        const { data, error } = await client.from(this.table).insert(input).select("*").maybeSingle();
        mapRepositoryError(error, "Failed to create payroll_entries");
        return (data as DbPayrollEntry | null) ?? null;
    }
}

export class EmployeeDocumentRepository extends OrgHrRepository<DbEmployeeDocument> {
    protected table = "employee_documents";
}

export class PerformanceReviewRepository extends OrgHrRepository<DbPerformanceReview> {
    protected table = "performance_reviews";
}

export class JobOpeningRepository extends OrgHrRepository<DbJobOpening> {
    protected table = "job_openings";
}

export class JobCandidateRepository extends BaseRepository<DbJobCandidate> {
    protected table = "job_candidates";

    async listByOpening(openingId: string): Promise<DbJobCandidate[]> {
        const client = getRepositoryClient();
        if (!client) return [];

        const { data, error } = await client.from(this.table).select("*").eq("opening_id", openingId).order("applied_at", { ascending: false });
        mapRepositoryError(error, "Failed to list job_candidates");
        return (data ?? []) as DbJobCandidate[];
    }

    async create(input: Record<string, unknown>): Promise<DbJobCandidate | null> {
        const client = getRepositoryClient();
        if (!client) return null;

        const { data, error } = await client.from(this.table).insert(input).select("*").maybeSingle();
        mapRepositoryError(error, "Failed to create job_candidates");
        return (data as DbJobCandidate | null) ?? null;
    }

    async update(id: string, input: Record<string, unknown>): Promise<DbJobCandidate | null> {
        const client = getRepositoryClient();
        if (!client) return null;

        const { data, error } = await client.from(this.table).update(input).eq("id", id).select("*").maybeSingle();
        mapRepositoryError(error, "Failed to update job_candidates");
        return (data as DbJobCandidate | null) ?? null;
    }
}

export class OnboardingPlanRepository extends OrgHrRepository<DbOnboardingPlan> {
    protected table = "onboarding_plans";
}

export class OnboardingTaskRepository extends BaseRepository<DbOnboardingTask> {
    protected table = "onboarding_tasks";

    async listByPlan(planId: string): Promise<DbOnboardingTask[]> {
        const client = getRepositoryClient();
        if (!client) return [];

        const { data, error } = await client.from(this.table).select("*").eq("plan_id", planId).order("due_date", { ascending: true });
        mapRepositoryError(error, "Failed to list onboarding_tasks");
        return (data ?? []) as DbOnboardingTask[];
    }

    async update(id: string, input: Record<string, unknown>): Promise<DbOnboardingTask | null> {
        const client = getRepositoryClient();
        if (!client) return null;

        const { data, error } = await client.from(this.table).update(input).eq("id", id).select("*").maybeSingle();
        mapRepositoryError(error, "Failed to update onboarding_tasks");
        return (data as DbOnboardingTask | null) ?? null;
    }
}

export class OffboardingPlanRepository extends OrgHrRepository<DbOffboardingPlan> {
    protected table = "offboarding_plans";
}

export class OffboardingTaskRepository extends BaseRepository<DbOffboardingTask> {
    protected table = "offboarding_tasks";

    async listByPlan(planId: string): Promise<DbOffboardingTask[]> {
        const client = getRepositoryClient();
        if (!client) return [];

        const { data, error } = await client.from(this.table).select("*").eq("plan_id", planId).order("due_date", { ascending: true });
        mapRepositoryError(error, "Failed to list offboarding_tasks");
        return (data ?? []) as DbOffboardingTask[];
    }

    async update(id: string, input: Record<string, unknown>): Promise<DbOffboardingTask | null> {
        const client = getRepositoryClient();
        if (!client) return null;

        const { data, error } = await client.from(this.table).update(input).eq("id", id).select("*").maybeSingle();
        mapRepositoryError(error, "Failed to update offboarding_tasks");
        return (data as DbOffboardingTask | null) ?? null;
    }
}

export class OrgChartNodeRepository extends OrgHrRepository<DbOrgChartNode> {
    protected table = "org_chart_nodes";
}
