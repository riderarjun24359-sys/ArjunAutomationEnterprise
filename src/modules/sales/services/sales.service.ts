import {
    buildActivityPayload,
    buildCallLogPayload,
    buildCrossModuleLinks,
    buildEmailTrackingPayload,
    buildForecastPayload,
    buildLeadPayload,
    buildLookupMaps,
    buildMeetingPayload,
    buildOpportunityPayload,
    buildPipelinePayload,
    buildQuotePayload,
    buildSalesAuditPayload,
    buildSalesDashboardStats,
    buildSalesReport,
    buildStagePayload,
    buildTargetPayload,
    mapActivitySummary,
    mapAuditEntry,
    mapCallLogSummary,
    mapCommissionSummary,
    mapEmailTrackingSummary,
    mapForecastSummary,
    mapLeadSummary,
    mapMeetingSummary,
    mapOpportunitySummary,
    mapPipelineSummary,
    mapQuoteSummary,
    mapStageSummary,
    mapTargetSummary,
    mapWinLossSummary,
} from "@/src/modules/database/lib/sales-mappers";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import { isOpportunityTransitionAllowed } from "@/src/modules/finance/lib/transaction-guards";
import { selectDueFollowUps } from "@/src/modules/sales/lib/follow-ups";
import type {
    ActivitySummary,
    CallLogSummary,
    CommissionSummary,
    CreateActivityInput,
    CreateCallLogInput,
    CreateEmailTrackingInput,
    CreateForecastInput,
    CreateLeadInput,
    CreateMeetingInput,
    CreateOpportunityInput,
    CreatePipelineInput,
    CreateQuoteInput,
    CreateStageInput,
    CreateTargetInput,
    CrossModuleLinks,
    EmailTrackingSummary,
    ForecastSummary,
    LeadSummary,
    MeetingSummary,
    OpportunitySummary,
    PipelineStageSummary,
    PipelineSummary,
    QuoteSummary,
    SalesAuditEntry,
    SalesDashboardStats,
    SalesReport,
    SalesTargetSummary,
    UpdateOpportunityStatusInput,
    WinLossSummary,
} from "@/src/modules/sales/types";

export class SalesService {
    private async getContext(authUserId: string, email: string, fullName?: string | null) {
        return resolveOrganizationContext(authUserId, email, fullName);
    }

    private async getMaps(organizationId: string) {
        const [pipelines, stages, opportunities, leads, clients, projects, employees] = await Promise.all([
            databaseService.salesPipelines.listByOrganization(organizationId),
            databaseService.salesPipelineStages.listByOrganization(organizationId),
            databaseService.salesOpportunities.listByOrganization(organizationId),
            databaseService.salesLeads.listByOrganization(organizationId),
            databaseService.clients.listByOrganization(organizationId),
            databaseService.projects.listByOrganization(organizationId),
            databaseService.employees.listByOrganization(organizationId),
        ]);
        return buildLookupMaps(pipelines, stages, opportunities, leads, clients, projects, employees);
    }

    async getPipelines(authUserId: string, email: string, fullName?: string | null): Promise<PipelineSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const [pipelines, stages, opportunities] = await Promise.all([
            databaseService.salesPipelines.listByOrganization(context.organizationId),
            databaseService.salesPipelineStages.listByOrganization(context.organizationId),
            databaseService.salesOpportunities.listByOrganization(context.organizationId),
        ]);
        return pipelines.map((pipeline) => mapPipelineSummary(pipeline, stages.filter((s) => s.pipeline_id === pipeline.id).length, opportunities.filter((o) => o.pipeline_id === pipeline.id).length));
    }

    async createPipeline(authUserId: string, email: string, input: CreatePipelineInput, fullName?: string | null): Promise<PipelineSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.salesPipelines.create(buildPipelinePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create pipeline");
        await databaseService.salesAuditLogs.create(buildSalesAuditPayload(context.organizationId, "pipeline", "create", `Pipeline ${created.name} created`, created.id));
        return mapPipelineSummary(created, 0, 0);
    }

    async getStages(authUserId: string, email: string, fullName?: string | null): Promise<PipelineStageSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        const [stages, opportunities] = await Promise.all([
            databaseService.salesPipelineStages.listByOrganization(context.organizationId),
            databaseService.salesOpportunities.listByOrganization(context.organizationId),
        ]);
        return stages.map((stage) => mapStageSummary(stage, maps, opportunities.filter((o) => o.stage_id === stage.id).length));
    }

    async createStage(authUserId: string, email: string, input: CreateStageInput, fullName?: string | null): Promise<PipelineStageSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.salesPipelineStages.create(buildStagePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create stage");
        const maps = await this.getMaps(context.organizationId);
        return mapStageSummary(created, maps, 0);
    }

    async getLeads(authUserId: string, email: string, fullName?: string | null): Promise<LeadSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.salesLeads.listByOrganization(context.organizationId, { orderBy: "created_at", orderDirection: "desc" })).map((lead) => mapLeadSummary(lead, maps));
    }

    async createLead(authUserId: string, email: string, input: CreateLeadInput, fullName?: string | null): Promise<LeadSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.salesLeads.create(buildLeadPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create lead");
        const maps = await this.getMaps(context.organizationId);
        return mapLeadSummary(created, maps);
    }

    async getOpportunities(authUserId: string, email: string, fullName?: string | null): Promise<OpportunitySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.salesOpportunities.listByOrganization(context.organizationId, { orderBy: "created_at", orderDirection: "desc" })).map((opp) => mapOpportunitySummary(opp, maps));
    }

    async createOpportunity(authUserId: string, email: string, input: CreateOpportunityInput, fullName?: string | null): Promise<OpportunitySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.salesOpportunities.create(buildOpportunityPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create opportunity");
        await databaseService.salesAuditLogs.create(buildSalesAuditPayload(context.organizationId, "opportunity", "create", `Opportunity ${created.opportunity_number} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapOpportunitySummary(created, maps);
    }

    async updateOpportunityStatus(authUserId: string, email: string, opportunityId: string, input: UpdateOpportunityStatusInput, fullName?: string | null): Promise<OpportunitySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const current = await databaseService.salesOpportunities.getById(opportunityId);
        if (!current) throw new Error("Opportunity not found");
        if (!isOpportunityTransitionAllowed(current.status, input.status)) {
            throw new Error(`Opportunity status transition from ${current.status} to ${input.status} is not allowed`);
        }
        const updated = await databaseService.salesOpportunities.update(opportunityId, {
            status: input.status,
            won_at: input.status === "won" ? new Date().toISOString() : null,
            lost_at: input.status === "lost" ? new Date().toISOString() : null,
            lost_reason: input.lostReason ?? "",
        });
        if (!updated) throw new Error("Failed to update opportunity");
        const maps = await this.getMaps(context.organizationId);
        return mapOpportunitySummary(updated, maps);
    }

    async getQuotes(authUserId: string, email: string, fullName?: string | null): Promise<QuoteSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        const quotes = await databaseService.salesQuotes.listByOrganization(context.organizationId, { orderBy: "created_at", orderDirection: "desc" });
        return Promise.all(quotes.map(async (quote) => {
            const items = await databaseService.salesQuoteItems.listByQuote(quote.id);
            return mapQuoteSummary(quote, items, maps);
        }));
    }

    async createQuote(authUserId: string, email: string, input: CreateQuoteInput, fullName?: string | null): Promise<QuoteSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.salesQuotes.create(buildQuotePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create quote");
        const maps = await this.getMaps(context.organizationId);
        return mapQuoteSummary(created, [], maps);
    }

    async getForecasts(authUserId: string, email: string, fullName?: string | null): Promise<ForecastSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.salesForecasts.listByOrganization(context.organizationId, { orderBy: "forecast_date", orderDirection: "desc" })).map(mapForecastSummary);
    }

    async createForecast(authUserId: string, email: string, input: CreateForecastInput, fullName?: string | null): Promise<ForecastSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.salesForecasts.create(buildForecastPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create forecast");
        return mapForecastSummary(created);
    }

    async getActivities(authUserId: string, email: string, fullName?: string | null): Promise<ActivitySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.salesActivities.listByOrganization(context.organizationId, { orderBy: "created_at", orderDirection: "desc" })).map((a) => mapActivitySummary(a, maps));
    }

    async createActivity(authUserId: string, email: string, input: CreateActivityInput, fullName?: string | null): Promise<ActivitySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.salesActivities.create(buildActivityPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create activity");
        const maps = await this.getMaps(context.organizationId);
        return mapActivitySummary(created, maps);
    }

    /**
     * Follow-ups due now or within the horizon — computed from persisted
     * activities only. Owners act on these manually; nothing is auto-sent.
     */
    async getDueFollowUps(authUserId: string, email: string, horizonDays = 7, fullName?: string | null): Promise<ActivitySummary[]> {
        const activities = await this.getActivities(authUserId, email, fullName);
        const due = selectDueFollowUps(
            activities.map((a) => ({ ...a, due_at: a.dueAt, completed_at: a.completedAt })),
            Date.now(),
            horizonDays,
        );
        const ids = new Set(due.map((d) => d.id));
        return activities.filter((a) => ids.has(a.id));
    }

    async getMeetings(authUserId: string, email: string, fullName?: string | null): Promise<MeetingSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.salesMeetings.listByOrganization(context.organizationId, { orderBy: "scheduled_at", orderDirection: "desc" })).map((m) => mapMeetingSummary(m, maps));
    }

    async createMeeting(authUserId: string, email: string, input: CreateMeetingInput, fullName?: string | null): Promise<MeetingSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.salesMeetings.create(buildMeetingPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create meeting");
        const maps = await this.getMaps(context.organizationId);
        return mapMeetingSummary(created, maps);
    }

    async getCallLogs(authUserId: string, email: string, fullName?: string | null): Promise<CallLogSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.salesCallLogs.listByOrganization(context.organizationId, { orderBy: "called_at", orderDirection: "desc" })).map((c) => mapCallLogSummary(c, maps));
    }

    async createCallLog(authUserId: string, email: string, input: CreateCallLogInput, fullName?: string | null): Promise<CallLogSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.salesCallLogs.create(buildCallLogPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create call log");
        const maps = await this.getMaps(context.organizationId);
        return mapCallLogSummary(created, maps);
    }

    async getEmailTracking(authUserId: string, email: string, fullName?: string | null): Promise<EmailTrackingSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.salesEmailTracking.listByOrganization(context.organizationId, { orderBy: "sent_at", orderDirection: "desc" })).map((e) => mapEmailTrackingSummary(e, maps));
    }

    async createEmailTracking(authUserId: string, email: string, input: CreateEmailTrackingInput, fullName?: string | null): Promise<EmailTrackingSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.salesEmailTracking.create(buildEmailTrackingPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create email tracking");
        const maps = await this.getMaps(context.organizationId);
        return mapEmailTrackingSummary(created, maps);
    }

    async getTargets(authUserId: string, email: string, fullName?: string | null): Promise<SalesTargetSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.salesTargets.listByOrganization(context.organizationId)).map((t) => mapTargetSummary(t, maps));
    }

    async createTarget(authUserId: string, email: string, input: CreateTargetInput, fullName?: string | null): Promise<SalesTargetSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.salesTargets.create(buildTargetPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create target");
        const maps = await this.getMaps(context.organizationId);
        return mapTargetSummary(created, maps);
    }

    async getCommissions(authUserId: string, email: string, fullName?: string | null): Promise<CommissionSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.salesCommissions.listByOrganization(context.organizationId, { orderBy: "calculated_at", orderDirection: "desc" })).map((c) => mapCommissionSummary(c, maps));
    }

    async getWinLossRecords(authUserId: string, email: string, fullName?: string | null): Promise<WinLossSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.salesWinLossRecords.listByOrganization(context.organizationId, { orderBy: "recorded_at", orderDirection: "desc" })).map((r) => mapWinLossSummary(r, maps));
    }

    async getAuditLogs(authUserId: string, email: string, fullName?: string | null): Promise<SalesAuditEntry[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.salesAuditLogs.listByOrganization(context.organizationId, { orderBy: "created_at", orderDirection: "desc" })).map(mapAuditEntry);
    }

    async getReport(authUserId: string, email: string, fullName?: string | null): Promise<SalesReport> {
        const [opportunities, leads, forecasts, winLoss] = await Promise.all([
            this.getOpportunities(authUserId, email, fullName),
            this.getLeads(authUserId, email, fullName),
            this.getForecasts(authUserId, email, fullName),
            this.getWinLossRecords(authUserId, email, fullName),
        ]);
        return buildSalesReport({ opportunities, leads, forecasts, winLoss });
    }

    async getCrossModuleLinks(authUserId: string, email: string, fullName?: string | null): Promise<CrossModuleLinks> {
        const [opportunities, leads, targets] = await Promise.all([
            this.getOpportunities(authUserId, email, fullName),
            this.getLeads(authUserId, email, fullName),
            this.getTargets(authUserId, email, fullName),
        ]);
        return buildCrossModuleLinks({ opportunities, leads, targets });
    }

    async getDashboardStats(authUserId: string, email: string, fullName?: string | null): Promise<SalesDashboardStats> {
        const [leads, opportunities, quotes, targets, winLoss] = await Promise.all([
            this.getLeads(authUserId, email, fullName),
            this.getOpportunities(authUserId, email, fullName),
            this.getQuotes(authUserId, email, fullName),
            this.getTargets(authUserId, email, fullName),
            this.getWinLossRecords(authUserId, email, fullName),
        ]);
        return buildSalesDashboardStats({ leads, opportunities, quotes, targets, winLoss });
    }

    async getClientOptions(authUserId: string, email: string, fullName?: string | null): Promise<Array<{ id: string; name: string }>> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.clients.listByOrganization(context.organizationId)).map((c) => ({ id: c.id, name: c.name }));
    }

    async getEmployeeOptions(authUserId: string, email: string, fullName?: string | null): Promise<Array<{ id: string; name: string }>> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.employees.listByOrganization(context.organizationId)).map((e) => ({ id: e.id, name: `${e.first_name} ${e.last_name}` }));
    }
}

export const salesService = new SalesService();
