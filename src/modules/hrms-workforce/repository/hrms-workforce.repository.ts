import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import type { DbJobCandidate, DbOnboardingTask, DbOffboardingTask, DbPayrollEntry } from "@/src/modules/database/types/platform";
import type { HrmsWorkforceRawData } from "../types/raw";

const LIMIT = 500;

export class HrmsWorkforceRepository {
    async loadOrganizationData(
        authUserId: string,
        email: string,
        fullName?: string | null,
    ): Promise<HrmsWorkforceRawData | null> {
        const context = await resolveOrganizationContext(authUserId, email, fullName);
        if (!context) return null;

        const orgId = context.organizationId;
        const q = { limit: LIMIT, orderBy: "created_at" as const, orderDirection: "desc" as const };

        const [
            departments,
            designations,
            employees,
            teams,
            attendance,
            leaveTypes,
            leaveRequests,
            holidays,
            payrollCycles,
            documents,
            performanceReviews,
            jobOpenings,
            onboardingPlans,
            offboardingPlans,
            assets,
            projects,
            activityLogs,
        ] = await Promise.all([
            databaseService.departments.listByOrganization(orgId, q).catch(() => []),
            databaseService.designations.listByOrganization(orgId, q).catch(() => []),
            databaseService.employees.listByOrganization(orgId, q).catch(() => []),
            databaseService.hrTeams.listByOrganization(orgId, q).catch(() => []),
            databaseService.attendanceRecords.listByOrganization(orgId, q).catch(() => []),
            databaseService.leaveTypes.listByOrganization(orgId, q).catch(() => []),
            databaseService.leaveRequests.listByOrganization(orgId, q).catch(() => []),
            databaseService.holidays.listByOrganization(orgId, q).catch(() => []),
            databaseService.payrollCycles.listByOrganization(orgId, q).catch(() => []),
            databaseService.employeeDocuments.listByOrganization(orgId, q).catch(() => []),
            databaseService.performanceReviews.listByOrganization(orgId, q).catch(() => []),
            databaseService.jobOpenings.listByOrganization(orgId, q).catch(() => []),
            databaseService.onboardingPlans.listByOrganization(orgId, q).catch(() => []),
            databaseService.offboardingPlans.listByOrganization(orgId, q).catch(() => []),
            databaseService.assets.listByOrganization(orgId, q).catch(() => []),
            databaseService.projects.listByOrganization(orgId, q).catch(() => []),
            databaseService.activityLogs.listByOrganization(orgId, { ...q, limit: 150 }).catch(() => []),
        ]);

        const [payrollEntries, jobCandidates, onboardingTasks, offboardingTasks] = await Promise.all([
            this.loadPayrollEntries(payrollCycles.map((c) => c.id)),
            this.loadCandidates(jobOpenings.map((o) => o.id)),
            this.loadOnboardingTasks(onboardingPlans.map((p) => p.id)),
            this.loadOffboardingTasks(offboardingPlans.map((p) => p.id)),
        ]);

        return {
            organizationId: orgId,
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
            performanceReviews,
            jobOpenings,
            jobCandidates,
            onboardingPlans,
            onboardingTasks,
            offboardingPlans,
            offboardingTasks,
            assets,
            projects,
            activityLogs,
            fetchedAt: new Date().toISOString(),
        };
    }

    private async loadPayrollEntries(cycleIds: string[]): Promise<DbPayrollEntry[]> {
        if (cycleIds.length === 0) return [];
        const batches = await Promise.all(
            cycleIds.slice(0, 50).map((id) => databaseService.payrollEntries.listByCycle(id).catch(() => [])),
        );
        return batches.flat();
    }

    private async loadCandidates(openingIds: string[]): Promise<DbJobCandidate[]> {
        if (openingIds.length === 0) return [];
        const batches = await Promise.all(
            openingIds.slice(0, 50).map((id) => databaseService.jobCandidates.listByOpening(id).catch(() => [])),
        );
        return batches.flat();
    }

    private async loadOnboardingTasks(planIds: string[]): Promise<DbOnboardingTask[]> {
        if (planIds.length === 0) return [];
        const batches = await Promise.all(
            planIds.slice(0, 50).map((id) => databaseService.onboardingTasks.listByPlan(id).catch(() => [])),
        );
        return batches.flat();
    }

    private async loadOffboardingTasks(planIds: string[]): Promise<DbOffboardingTask[]> {
        if (planIds.length === 0) return [];
        const batches = await Promise.all(
            planIds.slice(0, 50).map((id) => databaseService.offboardingTasks.listByPlan(id).catch(() => [])),
        );
        return batches.flat();
    }
}

export const hrmsWorkforceRepository = new HrmsWorkforceRepository();
