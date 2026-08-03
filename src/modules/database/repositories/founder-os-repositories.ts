import type {
    DbFoAuditLog,
    DbFoBoardReport,
    DbFoCapitalPlan,
    DbFoCompanyMilestone,
    DbFoDecisionLog,
    DbFoExecutiveDashboard,
    DbFoFounderAgenda,
    DbFoFounderInsight,
    DbFoGrowthMetric,
    DbFoInvestorRelation,
    DbFoPriority,
    DbFoProductRoadmap,
    DbFoResourceAllocation,
    DbFoRevenueRunway,
    DbFoRiskRegister,
    DbFoStakeholder,
    DbFoStrategicOkr,
    DbFoTeamCapacity,
    DbFoWorkspace,
} from "@/src/modules/database/types/platform";
import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";
import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";

abstract class OrgFoRepository<T> extends BaseRepository<T> {
    async listByOrganization(organizationId: string, query: RepositoryQuery = {}): Promise<T[]> {
        const client = getRepositoryClient();
        if (!client) return [];
        const normalized = this.buildQuery(query);
        const { data, error } = await client.from(this.table).select("*").eq("organization_id", organizationId).order(normalized.orderBy, { ascending: normalized.orderDirection === "asc" }).range(normalized.offset, normalized.offset + normalized.limit - 1);
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

export class FoWorkspaceRepository extends OrgFoRepository<DbFoWorkspace> { protected table = "fo_workspaces"; }
export class FoStrategicOkrRepository extends OrgFoRepository<DbFoStrategicOkr> { protected table = "fo_strategic_okrs"; }
export class FoExecutiveDashboardRepository extends OrgFoRepository<DbFoExecutiveDashboard> { protected table = "fo_executive_dashboards"; }
export class FoRevenueRunwayRepository extends OrgFoRepository<DbFoRevenueRunway> { protected table = "fo_revenue_runway"; }
export class FoTeamCapacityRepository extends OrgFoRepository<DbFoTeamCapacity> { protected table = "fo_team_capacity"; }
export class FoProductRoadmapRepository extends OrgFoRepository<DbFoProductRoadmap> { protected table = "fo_product_roadmaps"; }
export class FoInvestorRelationRepository extends OrgFoRepository<DbFoInvestorRelation> { protected table = "fo_investor_relations"; }
export class FoBoardReportRepository extends OrgFoRepository<DbFoBoardReport> { protected table = "fo_board_reports"; }
export class FoDecisionLogRepository extends OrgFoRepository<DbFoDecisionLog> { protected table = "fo_decision_log"; }
export class FoPriorityRepository extends OrgFoRepository<DbFoPriority> { protected table = "fo_priorities"; }
export class FoResourceAllocationRepository extends OrgFoRepository<DbFoResourceAllocation> { protected table = "fo_resource_allocations"; }
export class FoRiskRegisterRepository extends OrgFoRepository<DbFoRiskRegister> { protected table = "fo_risk_register"; }
export class FoGrowthMetricRepository extends OrgFoRepository<DbFoGrowthMetric> { protected table = "fo_growth_metrics"; }
export class FoFounderAgendaRepository extends OrgFoRepository<DbFoFounderAgenda> { protected table = "fo_founder_agenda"; }
export class FoStakeholderRepository extends OrgFoRepository<DbFoStakeholder> { protected table = "fo_stakeholders"; }
export class FoCapitalPlanRepository extends OrgFoRepository<DbFoCapitalPlan> { protected table = "fo_capital_plans"; }
export class FoCompanyMilestoneRepository extends OrgFoRepository<DbFoCompanyMilestone> { protected table = "fo_company_milestones"; }
export class FoFounderInsightRepository extends OrgFoRepository<DbFoFounderInsight> { protected table = "fo_founder_insights"; }
export class FoAuditLogRepository extends OrgFoRepository<DbFoAuditLog> { protected table = "fo_audit_logs"; }
