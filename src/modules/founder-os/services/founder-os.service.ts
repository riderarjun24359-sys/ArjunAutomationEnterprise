import {
    buildBoardReportPayload,
    buildCapitalPlanPayload,
    buildCompanyMilestonePayload,
    buildDecisionLogPayload,
    buildExecutiveDashboardPayload,
    buildFoAuditPayload,
    buildFoDashboardStats,
    buildFoPipelineInfo,
    buildFounderAgendaPayload,
    buildFounderInsightPayload,
    buildGrowthMetricPayload,
    buildInvestorRelationPayload,
    buildLookupMaps,
    buildPriorityPayload,
    buildProductRoadmapPayload,
    buildResourceAllocationPayload,
    buildRevenueRunwayPayload,
    buildRiskRegisterPayload,
    buildStakeholderPayload,
    buildStrategicOkrPayload,
    buildTeamCapacityPayload,
    buildWorkspacePayload,
    mapAuditEntry,
    mapBoardReportSummary,
    mapCapitalPlanSummary,
    mapCompanyMilestoneSummary,
    mapDecisionLogSummary,
    mapExecutiveDashboardSummary,
    mapFounderAgendaSummary,
    mapFounderInsightSummary,
    mapGrowthMetricSummary,
    mapInvestorRelationSummary,
    mapPrioritySummary,
    mapProductRoadmapSummary,
    mapResourceAllocationSummary,
    mapRevenueRunwaySummary,
    mapRiskRegisterSummary,
    mapStakeholderSummary,
    mapStrategicOkrSummary,
    mapTeamCapacitySummary,
    mapWorkspaceSummary,
} from "@/src/modules/database/lib/founder-os-mappers";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import { createAiOrchestrationClient } from "@/src/modules/ai-orchestration/sdk";
import { createKnowledgeClient } from "@/src/modules/knowledge/sdk";
import { createCustomerOperatedPlatformClient } from "@/src/modules/customer-operated-platform/sdk";
import type {
    AuditEntry,
    BoardReportSummary,
    CapitalPlanSummary,
    CompanyMilestoneSummary,
    CreateBoardReportInput,
    CreateCapitalPlanInput,
    CreateCompanyMilestoneInput,
    CreateDecisionLogInput,
    CreateExecutiveDashboardInput,
    CreateFounderAgendaInput,
    CreateFounderInsightInput,
    CreateGrowthMetricInput,
    CreateInvestorRelationInput,
    CreatePriorityInput,
    CreateProductRoadmapInput,
    CreateResourceAllocationInput,
    CreateRevenueRunwayInput,
    CreateRiskRegisterInput,
    CreateStakeholderInput,
    CreateStrategicOkrInput,
    CreateTeamCapacityInput,
    CreateWorkspaceInput,
    DecisionLogSummary,
    ExecutiveDashboardSummary,
    FoDashboardStats,
    FoPhase3Stats,
    FoPipelineInfo,
    FoSdkGenerateArtifactInput,
    FoSdkGenerateArtifactResult,
    FoSdkRunAnalysisInput,
    FoSdkRunAnalysisResult,
    FoSdkStartWorkspaceInput,
    FoSdkStartWorkspaceResult,
    FounderAgendaSummary,
    FounderInsightSummary,
    GrowthMetricSummary,
    InvestorRelationSummary,
    PrioritySummary,
    ProductRoadmapSummary,
    ResourceAllocationSummary,
    RevenueRunwaySummary,
    RiskRegisterSummary,
    StakeholderSummary,
    StrategicOkrSummary,
    TeamCapacitySummary,
    WorkspaceSummary,
} from "@/src/modules/founder-os/types";

export class FounderOsService {
    private async getContext(authUserId: string, email: string, fullName?: string | null) {
        return resolveOrganizationContext(authUserId, email, fullName);
    }

    /** Loads cross-module lookups: workspaces, pipeline engagements, CRM, projects, AI context, and finance data. */
    private async getMaps(organizationId: string) {
        const [workspaces, baEngagements, saEngagements, dfEngagements, qaEngagements, ddEngagements, csEngagements, clients, projects, agents, sessions, invoices, expenses] = await Promise.all([
            databaseService.foWorkspaces.listByOrganization(organizationId),
            databaseService.baEngagements.listByOrganization(organizationId),
            databaseService.saEngagements.listByOrganization(organizationId),
            databaseService.dfEngagements.listByOrganization(organizationId),
            databaseService.qaEngagements.listByOrganization(organizationId),
            databaseService.ddEngagements.listByOrganization(organizationId),
            databaseService.csEngagements.listByOrganization(organizationId),
            databaseService.clients.listByOrganization(organizationId),
            databaseService.projects.listByOrganization(organizationId),
            databaseService.aiOrchestrationAgents.listByOrganization(organizationId),
            databaseService.aiSessions.listByOrganization(organizationId),
            databaseService.invoices.listByOrganization(organizationId),
            databaseService.expenses.listByOrganization(organizationId),
        ]);
        return buildLookupMaps(workspaces, baEngagements, saEngagements, dfEngagements, qaEngagements, ddEngagements, csEngagements, clients, projects, agents, sessions, invoices, expenses);
    }

    async getWorkspaces(authUserId: string, email: string, fullName?: string | null): Promise<WorkspaceSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.foWorkspaces.listByOrganization(context.organizationId)).map((w) => mapWorkspaceSummary(w, maps));
    }

    async createWorkspace(authUserId: string, email: string, input: CreateWorkspaceInput, fullName?: string | null): Promise<WorkspaceSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.foWorkspaces.create(buildWorkspacePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create workspace");
        await databaseService.foAuditLogs.create(buildFoAuditPayload(context.organizationId, "workspace", "create", `Workspace ${created.title} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapWorkspaceSummary(created, maps);
    }

    async getStrategicOkrs(authUserId: string, email: string, fullName?: string | null): Promise<StrategicOkrSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.foStrategicOkrs.listByOrganization(context.organizationId)).map((r) => mapStrategicOkrSummary(r, maps));
    }

    async createStrategicOkr(authUserId: string, email: string, input: CreateStrategicOkrInput, fullName?: string | null): Promise<StrategicOkrSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.foStrategicOkrs.create(buildStrategicOkrPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create strategic OKR");
        await databaseService.foAuditLogs.create(buildFoAuditPayload(context.organizationId, "strategic_okr", "create", `Strategic OKR ${created.title} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapStrategicOkrSummary(created, maps);
    }

    async getExecutiveDashboards(authUserId: string, email: string, fullName?: string | null): Promise<ExecutiveDashboardSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.foExecutiveDashboards.listByOrganization(context.organizationId)).map((r) => mapExecutiveDashboardSummary(r, maps));
    }

    async createExecutiveDashboard(authUserId: string, email: string, input: CreateExecutiveDashboardInput, fullName?: string | null): Promise<ExecutiveDashboardSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.foExecutiveDashboards.create(buildExecutiveDashboardPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create executive dashboard");
        await databaseService.foAuditLogs.create(buildFoAuditPayload(context.organizationId, "executive_dashboard", "create", `Executive dashboard ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapExecutiveDashboardSummary(created, maps);
    }

    async getRevenueRunway(authUserId: string, email: string, fullName?: string | null): Promise<RevenueRunwaySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.foRevenueRunway.listByOrganization(context.organizationId)).map((r) => mapRevenueRunwaySummary(r, maps));
    }

    async createRevenueRunway(authUserId: string, email: string, input: CreateRevenueRunwayInput, fullName?: string | null): Promise<RevenueRunwaySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.foRevenueRunway.create(buildRevenueRunwayPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create revenue runway");
        await databaseService.foAuditLogs.create(buildFoAuditPayload(context.organizationId, "revenue_runway", "create", `Revenue runway ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapRevenueRunwaySummary(created, maps);
    }

    async getTeamCapacity(authUserId: string, email: string, fullName?: string | null): Promise<TeamCapacitySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.foTeamCapacity.listByOrganization(context.organizationId)).map((r) => mapTeamCapacitySummary(r, maps));
    }

    async createTeamCapacity(authUserId: string, email: string, input: CreateTeamCapacityInput, fullName?: string | null): Promise<TeamCapacitySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.foTeamCapacity.create(buildTeamCapacityPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create team capacity");
        await databaseService.foAuditLogs.create(buildFoAuditPayload(context.organizationId, "team_capacity", "create", `Team capacity ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapTeamCapacitySummary(created, maps);
    }

    async getProductRoadmaps(authUserId: string, email: string, fullName?: string | null): Promise<ProductRoadmapSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.foProductRoadmaps.listByOrganization(context.organizationId)).map((r) => mapProductRoadmapSummary(r, maps));
    }

    async createProductRoadmap(authUserId: string, email: string, input: CreateProductRoadmapInput, fullName?: string | null): Promise<ProductRoadmapSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.foProductRoadmaps.create(buildProductRoadmapPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create product roadmap");
        await databaseService.foAuditLogs.create(buildFoAuditPayload(context.organizationId, "product_roadmap", "create", `Product roadmap ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapProductRoadmapSummary(created, maps);
    }

    async getInvestorRelations(authUserId: string, email: string, fullName?: string | null): Promise<InvestorRelationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.foInvestorRelations.listByOrganization(context.organizationId)).map((r) => mapInvestorRelationSummary(r, maps));
    }

    async createInvestorRelation(authUserId: string, email: string, input: CreateInvestorRelationInput, fullName?: string | null): Promise<InvestorRelationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.foInvestorRelations.create(buildInvestorRelationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create investor relation");
        await databaseService.foAuditLogs.create(buildFoAuditPayload(context.organizationId, "investor_relation", "create", `Investor relation ${created.investor_name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapInvestorRelationSummary(created, maps);
    }

    async getBoardReports(authUserId: string, email: string, fullName?: string | null): Promise<BoardReportSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.foBoardReports.listByOrganization(context.organizationId)).map((r) => mapBoardReportSummary(r, maps));
    }

    async createBoardReport(authUserId: string, email: string, input: CreateBoardReportInput, fullName?: string | null): Promise<BoardReportSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.foBoardReports.create(buildBoardReportPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create board report");
        await databaseService.foAuditLogs.create(buildFoAuditPayload(context.organizationId, "board_report", "create", `Board report ${created.title} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapBoardReportSummary(created, maps);
    }

    async getDecisionLog(authUserId: string, email: string, fullName?: string | null): Promise<DecisionLogSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.foDecisionLog.listByOrganization(context.organizationId)).map((r) => mapDecisionLogSummary(r, maps));
    }

    async createDecisionLog(authUserId: string, email: string, input: CreateDecisionLogInput, fullName?: string | null): Promise<DecisionLogSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.foDecisionLog.create(buildDecisionLogPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create decision log entry");
        await databaseService.foAuditLogs.create(buildFoAuditPayload(context.organizationId, "decision_log", "create", `Decision log ${created.title} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapDecisionLogSummary(created, maps);
    }

    async getPriorities(authUserId: string, email: string, fullName?: string | null): Promise<PrioritySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.foPriorities.listByOrganization(context.organizationId)).map((r) => mapPrioritySummary(r, maps));
    }

    async createPriority(authUserId: string, email: string, input: CreatePriorityInput, fullName?: string | null): Promise<PrioritySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.foPriorities.create(buildPriorityPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create priority");
        await databaseService.foAuditLogs.create(buildFoAuditPayload(context.organizationId, "priority", "create", `Priority ${created.title} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapPrioritySummary(created, maps);
    }

    async getResourceAllocations(authUserId: string, email: string, fullName?: string | null): Promise<ResourceAllocationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.foResourceAllocations.listByOrganization(context.organizationId)).map((r) => mapResourceAllocationSummary(r, maps));
    }

    async createResourceAllocation(authUserId: string, email: string, input: CreateResourceAllocationInput, fullName?: string | null): Promise<ResourceAllocationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.foResourceAllocations.create(buildResourceAllocationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create resource allocation");
        await databaseService.foAuditLogs.create(buildFoAuditPayload(context.organizationId, "resource_allocation", "create", `Resource allocation ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapResourceAllocationSummary(created, maps);
    }

    async getRiskRegister(authUserId: string, email: string, fullName?: string | null): Promise<RiskRegisterSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.foRiskRegister.listByOrganization(context.organizationId)).map((r) => mapRiskRegisterSummary(r, maps));
    }

    async createRiskRegister(authUserId: string, email: string, input: CreateRiskRegisterInput, fullName?: string | null): Promise<RiskRegisterSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.foRiskRegister.create(buildRiskRegisterPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create risk register entry");
        await databaseService.foAuditLogs.create(buildFoAuditPayload(context.organizationId, "risk_register", "create", `Risk register ${created.title} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapRiskRegisterSummary(created, maps);
    }

    async getGrowthMetrics(authUserId: string, email: string, fullName?: string | null): Promise<GrowthMetricSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.foGrowthMetrics.listByOrganization(context.organizationId)).map((r) => mapGrowthMetricSummary(r, maps));
    }

    async createGrowthMetric(authUserId: string, email: string, input: CreateGrowthMetricInput, fullName?: string | null): Promise<GrowthMetricSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.foGrowthMetrics.create(buildGrowthMetricPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create growth metric");
        await databaseService.foAuditLogs.create(buildFoAuditPayload(context.organizationId, "growth_metric", "create", `Growth metric ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapGrowthMetricSummary(created, maps);
    }

    async getFounderAgenda(authUserId: string, email: string, fullName?: string | null): Promise<FounderAgendaSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.foFounderAgenda.listByOrganization(context.organizationId)).map((r) => mapFounderAgendaSummary(r, maps));
    }

    async createFounderAgenda(authUserId: string, email: string, input: CreateFounderAgendaInput, fullName?: string | null): Promise<FounderAgendaSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.foFounderAgenda.create(buildFounderAgendaPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create founder agenda");
        await databaseService.foAuditLogs.create(buildFoAuditPayload(context.organizationId, "founder_agenda", "create", `Founder agenda ${created.title} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapFounderAgendaSummary(created, maps);
    }

    async getStakeholders(authUserId: string, email: string, fullName?: string | null): Promise<StakeholderSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.foStakeholders.listByOrganization(context.organizationId)).map((r) => mapStakeholderSummary(r, maps));
    }

    async createStakeholder(authUserId: string, email: string, input: CreateStakeholderInput, fullName?: string | null): Promise<StakeholderSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.foStakeholders.create(buildStakeholderPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create stakeholder");
        await databaseService.foAuditLogs.create(buildFoAuditPayload(context.organizationId, "stakeholder", "create", `Stakeholder ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapStakeholderSummary(created, maps);
    }

    async getCapitalPlans(authUserId: string, email: string, fullName?: string | null): Promise<CapitalPlanSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.foCapitalPlans.listByOrganization(context.organizationId)).map((r) => mapCapitalPlanSummary(r, maps));
    }

    async createCapitalPlan(authUserId: string, email: string, input: CreateCapitalPlanInput, fullName?: string | null): Promise<CapitalPlanSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.foCapitalPlans.create(buildCapitalPlanPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create capital plan");
        await databaseService.foAuditLogs.create(buildFoAuditPayload(context.organizationId, "capital_plan", "create", `Capital plan ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapCapitalPlanSummary(created, maps);
    }

    async getCompanyMilestones(authUserId: string, email: string, fullName?: string | null): Promise<CompanyMilestoneSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.foCompanyMilestones.listByOrganization(context.organizationId)).map((r) => mapCompanyMilestoneSummary(r, maps));
    }

    async createCompanyMilestone(authUserId: string, email: string, input: CreateCompanyMilestoneInput, fullName?: string | null): Promise<CompanyMilestoneSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.foCompanyMilestones.create(buildCompanyMilestonePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create company milestone");
        await databaseService.foAuditLogs.create(buildFoAuditPayload(context.organizationId, "company_milestone", "create", `Company milestone ${created.title} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapCompanyMilestoneSummary(created, maps);
    }

    async getFounderInsights(authUserId: string, email: string, fullName?: string | null): Promise<FounderInsightSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.foFounderInsights.listByOrganization(context.organizationId)).map((r) => mapFounderInsightSummary(r, maps));
    }

    async createFounderInsight(authUserId: string, email: string, input: CreateFounderInsightInput, fullName?: string | null): Promise<FounderInsightSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.foFounderInsights.create(buildFounderInsightPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create founder insight");
        await databaseService.foAuditLogs.create(buildFoAuditPayload(context.organizationId, "founder_insight", "create", `Founder insight ${created.title} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapFounderInsightSummary(created, maps);
    }

    async getAuditLogs(authUserId: string, email: string, fullName?: string | null): Promise<AuditEntry[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.foAuditLogs.listByOrganization(context.organizationId, { orderBy: "created_at", orderDirection: "desc" })).map(mapAuditEntry);
    }

    async getDashboardStats(authUserId: string, email: string, fullName?: string | null): Promise<FoDashboardStats> {
        const [workspaces, strategicOkrs, executiveDashboards, revenueRunway, teamCapacity, productRoadmaps, investorRelations, boardReports, decisionLog, priorities, resourceAllocations, riskRegister, growthMetrics, founderAgenda, stakeholders, capitalPlans, companyMilestones, founderInsights] = await Promise.all([
            this.getWorkspaces(authUserId, email, fullName),
            this.getStrategicOkrs(authUserId, email, fullName),
            this.getExecutiveDashboards(authUserId, email, fullName),
            this.getRevenueRunway(authUserId, email, fullName),
            this.getTeamCapacity(authUserId, email, fullName),
            this.getProductRoadmaps(authUserId, email, fullName),
            this.getInvestorRelations(authUserId, email, fullName),
            this.getBoardReports(authUserId, email, fullName),
            this.getDecisionLog(authUserId, email, fullName),
            this.getPriorities(authUserId, email, fullName),
            this.getResourceAllocations(authUserId, email, fullName),
            this.getRiskRegister(authUserId, email, fullName),
            this.getGrowthMetrics(authUserId, email, fullName),
            this.getFounderAgenda(authUserId, email, fullName),
            this.getStakeholders(authUserId, email, fullName),
            this.getCapitalPlans(authUserId, email, fullName),
            this.getCompanyMilestones(authUserId, email, fullName),
            this.getFounderInsights(authUserId, email, fullName),
        ]);
        return buildFoDashboardStats({ workspaces, strategicOkrs, executiveDashboards, revenueRunway, teamCapacity, productRoadmaps, investorRelations, boardReports, decisionLog, priorities, resourceAllocations, riskRegister, growthMetrics, founderAgenda, stakeholders, capitalPlans, companyMilestones, founderInsights });
    }

    async getPipelineInfo(): Promise<FoPipelineInfo> {
        return buildFoPipelineInfo();
    }

    async getPhase3Stats(authUserId: string, email: string, fullName?: string | null): Promise<FoPhase3Stats> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) {
            return {
                liveProductionStatus: "unknown",
                customerOnboardingStatus: "unknown",
                revenueToday: 0,
                activeIncidents: 0,
                pendingApprovals: 0,
                dailyExecutiveBriefing: "No briefing available",
                platformAvailability: 0,
                customerSatisfactionOverview: 0,
                overallOperatedScore: 0,
            };
        }
        const cop = createCustomerOperatedPlatformClient(authUserId, email, fullName);
        const [stats, healthRecords, briefingRecords] = await Promise.all([
            cop.getDashboardStats(),
            databaseService.copOperatedHealth.listByOrganization(context.organizationId),
            databaseService.copExecutiveBriefings.listByOrganization(context.organizationId),
        ]);
        const latestHealth = healthRecords[0];
        const latestBriefing = briefingRecords[0];
        return {
            liveProductionStatus: latestHealth?.production_status ?? (stats.productionStatusScore >= 90 ? "healthy" : "degraded"),
            customerOnboardingStatus: latestHealth?.onboarding_status ?? (stats.onboardingCompletionRate >= 80 ? "healthy" : "in_progress"),
            revenueToday: stats.revenueToday,
            activeIncidents: stats.activeIncidentCount,
            pendingApprovals: stats.pendingApprovalCount,
            dailyExecutiveBriefing: latestBriefing?.briefing_title ?? "Daily executive briefing pending",
            platformAvailability: stats.platformAvailabilityScore,
            customerSatisfactionOverview: stats.customerSatisfactionScore,
            overallOperatedScore: stats.overallOperatedScore,
        };
    }

    async sdkStartWorkspace(authUserId: string, email: string, input: FoSdkStartWorkspaceInput, fullName?: string | null): Promise<FoSdkStartWorkspaceResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        const knowledge = createKnowledgeClient(authUserId, email, fullName);
        const context = await knowledge.resolveContext({ contextKey: `fo-${input.workspaceKey}`, agentId: input.agentId, sessionId: input.sessionId });
        const workspace = await this.createWorkspace(authUserId, email, { ...input, knowledgeContextId: context.contextId, pipelineStage: "founder_operating_system" }, fullName);
        let aiTaskId: string | null = null;
        if (input.agentId && input.sessionId) {
            const task = await ai.executeTask({ taskType: "founder_operating_system", agentId: input.agentId, sessionId: input.sessionId, moduleSource: "founder_os", inputPayload: { workspaceKey: input.workspaceKey, title: input.title } });
            aiTaskId = task.taskId;
        }
        if (input.clientId) {
            await knowledge.storeMemory({ entityType: "client", entityId: input.clientId, memoryKey: `fo-${input.workspaceKey}`, summary: input.title });
        }
        return { workspaceId: workspace.id, workspaceKey: workspace.workspaceKey, pipelineStage: workspace.pipelineStage, aiTaskId };
    }

    async sdkGenerateArtifact(authUserId: string, email: string, input: FoSdkGenerateArtifactInput, fullName?: string | null): Promise<FoSdkGenerateArtifactResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        await ai.executeTask({ taskType: `generate_${input.artifactType}`, moduleSource: "founder_os", inputPayload: { workspaceId: input.workspaceId, title: input.title, content: input.content } });
        const key = input.title.replace(/\s+/g, "-").toLowerCase();
        if (input.artifactType === "strategic_okr") {
            const created = await this.createStrategicOkr(authUserId, email, { workspaceId: input.workspaceId, okrKey: key, title: input.title, objective: input.content }, fullName);
            return { artifactId: created.id, artifactType: "strategic_okr", status: created.status };
        }
        if (input.artifactType === "board_report") {
            const created = await this.createBoardReport(authUserId, email, { workspaceId: input.workspaceId, reportKey: key, title: input.title, reportingPeriod: input.content }, fullName);
            return { artifactId: created.id, artifactType: "board_report", status: created.status };
        }
        if (input.artifactType === "founder_insight") {
            const created = await this.createFounderInsight(authUserId, email, { workspaceId: input.workspaceId, insightKey: key, title: input.title, content: input.content }, fullName);
            return { artifactId: created.id, artifactType: "founder_insight", status: created.status };
        }
        const created = await this.createExecutiveDashboard(authUserId, email, { workspaceId: input.workspaceId, dashboardKey: key, name: input.title }, fullName);
        return { artifactId: created.id, artifactType: "executive_dashboard", status: created.status };
    }

    async sdkRunAnalysis(authUserId: string, email: string, input: FoSdkRunAnalysisInput, fullName?: string | null): Promise<FoSdkRunAnalysisResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        const knowledge = createKnowledgeClient(authUserId, email, fullName);
        await knowledge.search({ query: input.analysisType, limit: 5 });
        await ai.executeTask({ taskType: `fo_${input.analysisType}_analysis`, moduleSource: "founder_os", inputPayload: { workspaceId: input.workspaceId, ...input.inputPayload } });
        if (input.analysisType === "runway") {
            const created = await this.createRevenueRunway(authUserId, email, { workspaceId: input.workspaceId, runwayKey: String(input.inputPayload.runwayKey ?? "RUNWAY-AUTO"), name: String(input.inputPayload.name ?? "Runway Analysis"), monthlyBurnUsd: Number(input.inputPayload.monthlyBurnUsd ?? 0), cashBalanceUsd: Number(input.inputPayload.cashBalanceUsd ?? 0), runwayMonths: Number(input.inputPayload.runwayMonths ?? 0), revenueForecast: (input.inputPayload.revenueForecast as unknown[]) ?? [] }, fullName);
            return { analysisId: created.id, analysisType: "runway", status: created.status };
        }
        if (input.analysisType === "growth") {
            const created = await this.createGrowthMetric(authUserId, email, { workspaceId: input.workspaceId, metricKey: String(input.inputPayload.metricKey ?? "GROWTH-AUTO"), name: String(input.inputPayload.name ?? "Growth Analysis"), metricType: String(input.inputPayload.metricType ?? "revenue"), currentValue: Number(input.inputPayload.currentValue ?? 0), targetValue: Number(input.inputPayload.targetValue ?? 0), growthRatePercent: Number(input.inputPayload.growthRatePercent ?? 0) }, fullName);
            return { analysisId: created.id, analysisType: "growth", status: created.status };
        }
        const created = await this.createRiskRegister(authUserId, email, { workspaceId: input.workspaceId, riskKey: String(input.inputPayload.riskKey ?? "RISK-AUTO"), title: String(input.inputPayload.title ?? "Risk Analysis"), riskLevel: String(input.inputPayload.riskLevel ?? "medium"), mitigationPlan: String(input.inputPayload.mitigationPlan ?? ""), owner: String(input.inputPayload.owner ?? "") }, fullName);
        return { analysisId: created.id, analysisType: "risk", status: created.status };
    }

    async getWorkspaceOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.foWorkspaces.listByOrganization(context.organizationId)).map((w) => ({ id: w.id, name: w.title }));
    }

    async getBaEngagementOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.baEngagements.listByOrganization(context.organizationId)).map((e) => ({ id: e.id, name: e.title }));
    }

    async getSaEngagementOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.saEngagements.listByOrganization(context.organizationId)).map((e) => ({ id: e.id, name: e.title }));
    }

    async getDfEngagementOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.dfEngagements.listByOrganization(context.organizationId)).map((e) => ({ id: e.id, name: e.title }));
    }

    async getQaEngagementOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.qaEngagements.listByOrganization(context.organizationId)).map((e) => ({ id: e.id, name: e.title }));
    }

    async getDdEngagementOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.ddEngagements.listByOrganization(context.organizationId)).map((e) => ({ id: e.id, name: e.title }));
    }

    async getCsEngagementOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.csEngagements.listByOrganization(context.organizationId)).map((e) => ({ id: e.id, name: e.title }));
    }

    async getClientOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.clients.listByOrganization(context.organizationId)).map((c) => ({ id: c.id, name: c.name }));
    }

    async getProjectOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.projects.listByOrganization(context.organizationId)).map((p) => ({ id: p.id, name: p.name }));
    }

    async getAgentOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.aiOrchestrationAgents.listByOrganization(context.organizationId)).map((a) => ({ id: a.id, name: a.name }));
    }

    async getSessionOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.aiSessions.listByOrganization(context.organizationId)).map((s) => ({ id: s.id, name: s.session_key }));
    }
}

export const founderOsService = new FounderOsService();
