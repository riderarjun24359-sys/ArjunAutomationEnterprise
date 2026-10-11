import type {
    DbClient,
    DbEmployee,
    DbProject,
    DbSalesActivity,
    DbSalesAuditLog,
    DbSalesCallLog,
    DbSalesCommission,
    DbSalesEmailTracking,
    DbSalesForecast,
    DbSalesLead,
    DbSalesMeeting,
    DbSalesOpportunity,
    DbSalesPipeline,
    DbSalesPipelineStage,
    DbSalesQuote,
    DbSalesQuoteItem,
    DbSalesTarget,
    DbSalesWinLossRecord,
} from "@/src/modules/database/types/platform";
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
    WinLossSummary,
} from "@/src/modules/sales/types";

type LookupMaps = {
    pipelines: Map<string, DbSalesPipeline>;
    stages: Map<string, DbSalesPipelineStage>;
    opportunities: Map<string, DbSalesOpportunity>;
    leads: Map<string, DbSalesLead>;
    clients: Map<string, DbClient>;
    projects: Map<string, DbProject>;
    employees: Map<string, DbEmployee>;
};

export const buildLookupMaps = (
    pipelines: DbSalesPipeline[],
    stages: DbSalesPipelineStage[],
    opportunities: DbSalesOpportunity[],
    leads: DbSalesLead[],
    clients: DbClient[],
    projects: DbProject[],
    employees: DbEmployee[],
): LookupMaps => ({
    pipelines: new Map(pipelines.map((item) => [item.id, item])),
    stages: new Map(stages.map((item) => [item.id, item])),
    opportunities: new Map(opportunities.map((item) => [item.id, item])),
    leads: new Map(leads.map((item) => [item.id, item])),
    clients: new Map(clients.map((item) => [item.id, item])),
    projects: new Map(projects.map((item) => [item.id, item])),
    employees: new Map(employees.map((item) => [item.id, item])),
});

const employeeName = (id: string | null | undefined, maps: LookupMaps) => {
    if (!id) return null;
    const e = maps.employees.get(id);
    return e ? `${e.first_name} ${e.last_name}` : null;
};

export const mapPipelineSummary = (record: DbSalesPipeline, stageCount: number, opportunityCount: number): PipelineSummary => ({
    id: record.id, name: record.name, code: record.code, description: record.description, isDefault: record.is_default, stageCount, opportunityCount,
});

export const mapStageSummary = (record: DbSalesPipelineStage, maps: LookupMaps, opportunityCount: number): PipelineStageSummary => ({
    id: record.id,
    pipelineName: maps.pipelines.get(record.pipeline_id)?.name ?? "Unknown",
    name: record.name,
    sortOrder: record.sort_order,
    probability: record.probability,
    isClosedWon: record.is_closed_won,
    isClosedLost: record.is_closed_lost,
    opportunityCount,
});

export const mapLeadSummary = (record: DbSalesLead, maps: LookupMaps): LeadSummary => ({
    id: record.id,
    leadName: record.lead_name,
    companyName: record.company_name,
    email: record.email,
    phone: record.phone,
    source: record.source,
    status: record.status,
    score: record.score,
    assigneeName: employeeName(record.assigned_to, maps),
    clientName: record.client_id ? maps.clients.get(record.client_id)?.name ?? null : null,
});

export const mapOpportunitySummary = (record: DbSalesOpportunity, maps: LookupMaps): OpportunitySummary => ({
    id: record.id,
    opportunityNumber: record.opportunity_number,
    name: record.name,
    description: record.description,
    pipelineName: record.pipeline_id ? maps.pipelines.get(record.pipeline_id)?.name ?? null : null,
    stageName: record.stage_id ? maps.stages.get(record.stage_id)?.name ?? null : null,
    clientName: record.client_id ? maps.clients.get(record.client_id)?.name ?? null : null,
    projectName: record.project_id ? maps.projects.get(record.project_id)?.name ?? null : null,
    assigneeName: employeeName(record.assigned_to, maps),
    amount: Number(record.amount),
    probability: record.probability,
    expectedCloseDate: record.expected_close_date ?? null,
    status: record.status,
    weightedAmount: Math.round(Number(record.amount) * record.probability / 100),
});

export const mapQuoteSummary = (record: DbSalesQuote, items: DbSalesQuoteItem[], maps: LookupMaps): QuoteSummary => ({
    id: record.id,
    quoteNumber: record.quote_number,
    title: record.title,
    opportunityNumber: record.opportunity_id ? maps.opportunities.get(record.opportunity_id)?.opportunity_number ?? null : null,
    clientName: record.client_id ? maps.clients.get(record.client_id)?.name ?? null : null,
    status: record.status,
    totalAmount: Number(record.total_amount),
    itemCount: items.length,
    validUntil: record.valid_until ?? null,
});

export const mapForecastSummary = (record: DbSalesForecast): ForecastSummary => ({
    id: record.id,
    forecastPeriod: record.forecast_period,
    forecastDate: record.forecast_date,
    pipelineValue: Number(record.pipeline_value),
    weightedValue: Number(record.weighted_value),
    closedValue: Number(record.closed_value),
    notes: record.notes,
});

export const mapActivitySummary = (record: DbSalesActivity, maps: LookupMaps): ActivitySummary => ({
    id: record.id,
    activityType: record.activity_type,
    subject: record.subject,
    description: record.description,
    linkedName: record.opportunity_id ? maps.opportunities.get(record.opportunity_id)?.name ?? "Unknown" : record.lead_id ? maps.leads.get(record.lead_id)?.lead_name ?? "Unknown" : "Unlinked",
    assigneeName: employeeName(record.assigned_to, maps),
    dueAt: record.due_at ?? null,
    completedAt: record.completed_at ?? null,
});

export const mapMeetingSummary = (record: DbSalesMeeting, maps: LookupMaps): MeetingSummary => ({
    id: record.id,
    title: record.title,
    linkedName: record.opportunity_id ? maps.opportunities.get(record.opportunity_id)?.name ?? "Unknown" : record.lead_id ? maps.leads.get(record.lead_id)?.lead_name ?? "Unknown" : "Unlinked",
    location: record.location,
    scheduledAt: record.scheduled_at,
    durationMinutes: record.duration_minutes,
    status: record.status,
    attendeeNames: record.attendee_names,
});

export const mapCallLogSummary = (record: DbSalesCallLog, maps: LookupMaps): CallLogSummary => ({
    id: record.id,
    direction: record.direction,
    phoneNumber: record.phone_number,
    linkedName: record.opportunity_id ? maps.opportunities.get(record.opportunity_id)?.name ?? "Unknown" : record.lead_id ? maps.leads.get(record.lead_id)?.lead_name ?? "Unknown" : "Unlinked",
    durationSeconds: record.duration_seconds,
    outcome: record.outcome,
    notes: record.notes,
    calledAt: record.called_at,
});

export const mapEmailTrackingSummary = (record: DbSalesEmailTracking, maps: LookupMaps): EmailTrackingSummary => ({
    id: record.id,
    subject: record.subject,
    recipientEmail: record.recipient_email,
    linkedName: record.opportunity_id ? maps.opportunities.get(record.opportunity_id)?.name ?? "Unknown" : record.lead_id ? maps.leads.get(record.lead_id)?.lead_name ?? "Unknown" : "Unlinked",
    status: record.status,
    sentAt: record.sent_at,
    openedAt: record.opened_at ?? null,
});

export const mapTargetSummary = (record: DbSalesTarget, maps: LookupMaps): SalesTargetSummary => ({
    id: record.id,
    employeeName: employeeName(record.employee_id, maps) ?? "Unknown",
    periodLabel: record.period_label,
    targetAmount: Number(record.target_amount),
    achievedAmount: Number(record.achieved_amount),
    achievementPercent: Number(record.target_amount) > 0 ? Math.round((Number(record.achieved_amount) / Number(record.target_amount)) * 100) : 0,
    periodStart: record.period_start,
    periodEnd: record.period_end,
});

export const mapCommissionSummary = (record: DbSalesCommission, maps: LookupMaps): CommissionSummary => ({
    id: record.id,
    employeeName: employeeName(record.employee_id, maps) ?? "Unknown",
    opportunityNumber: record.opportunity_id ? maps.opportunities.get(record.opportunity_id)?.opportunity_number ?? null : null,
    commissionRate: Number(record.commission_rate),
    commissionAmount: Number(record.commission_amount),
    status: record.status,
    calculatedAt: record.calculated_at,
});

export const mapWinLossSummary = (record: DbSalesWinLossRecord, maps: LookupMaps): WinLossSummary => ({
    id: record.id,
    opportunityNumber: maps.opportunities.get(record.opportunity_id)?.opportunity_number ?? "Unknown",
    opportunityName: maps.opportunities.get(record.opportunity_id)?.name ?? "Unknown",
    outcome: record.outcome,
    reason: record.reason,
    competitor: record.competitor,
    amount: Number(record.amount),
    recordedAt: record.recorded_at,
});

export const mapAuditEntry = (record: DbSalesAuditLog): SalesAuditEntry => ({
    id: record.id, entityType: record.entity_type, action: record.action, summary: record.summary, createdAt: record.created_at,
});

export const buildPipelinePayload = (organizationId: string, input: CreatePipelineInput) => ({ organization_id: organizationId, name: input.name, code: input.code, description: input.description });
export const buildStagePayload = (organizationId: string, input: CreateStageInput) => ({ organization_id: organizationId, pipeline_id: input.pipelineId, name: input.name, sort_order: input.sortOrder, probability: input.probability });
export const buildLeadPayload = (organizationId: string, input: CreateLeadInput) => ({ organization_id: organizationId, lead_name: input.leadName, company_name: input.companyName, email: input.email, phone: input.phone, source: input.source, assigned_to: input.assignedTo || null });
export const buildOpportunityPayload = (organizationId: string, input: CreateOpportunityInput) => ({ organization_id: organizationId, opportunity_number: input.opportunityNumber, name: input.name, description: input.description, pipeline_id: input.pipelineId || null, stage_id: input.stageId || null, client_id: input.clientId || null, assigned_to: input.assignedTo || null, amount: input.amount, expected_close_date: input.expectedCloseDate || null });
export const buildQuotePayload = (organizationId: string, input: CreateQuoteInput) => ({ organization_id: organizationId, quote_number: input.quoteNumber, opportunity_id: input.opportunityId || null, client_id: input.clientId || null, title: input.title, total_amount: input.totalAmount });
export const buildForecastPayload = (organizationId: string, input: CreateForecastInput) => ({ organization_id: organizationId, forecast_period: input.forecastPeriod, pipeline_value: input.pipelineValue, weighted_value: input.weightedValue, closed_value: input.closedValue, notes: input.notes });
export const buildActivityPayload = (organizationId: string, input: CreateActivityInput) => ({ organization_id: organizationId, opportunity_id: input.opportunityId || null, lead_id: input.leadId || null, activity_type: input.activityType, subject: input.subject, description: input.description, due_at: input.dueAt || null, assigned_to: input.assignedTo || null });
export const buildMeetingPayload = (organizationId: string, input: CreateMeetingInput) => ({ organization_id: organizationId, opportunity_id: input.opportunityId || null, lead_id: input.leadId || null, title: input.title, scheduled_at: input.scheduledAt, duration_minutes: input.durationMinutes, attendee_names: input.attendeeNames });
export const buildCallLogPayload = (organizationId: string, input: CreateCallLogInput) => ({ organization_id: organizationId, opportunity_id: input.opportunityId || null, lead_id: input.leadId || null, direction: input.direction, phone_number: input.phoneNumber, duration_seconds: input.durationSeconds, outcome: input.outcome, notes: input.notes });
export const buildEmailTrackingPayload = (organizationId: string, input: CreateEmailTrackingInput) => ({ organization_id: organizationId, opportunity_id: input.opportunityId || null, lead_id: input.leadId || null, subject: input.subject, recipient_email: input.recipientEmail });
export const buildTargetPayload = (organizationId: string, input: CreateTargetInput) => ({ organization_id: organizationId, employee_id: input.employeeId, period_label: input.periodLabel, target_amount: input.targetAmount, period_start: input.periodStart, period_end: input.periodEnd });
export const buildSalesAuditPayload = (organizationId: string, entityType: string, action: string, summary: string, entityId?: string, metadata?: Record<string, unknown>) => ({ organization_id: organizationId, entity_type: entityType, entity_id: entityId ?? null, action, summary, metadata: metadata ?? {} });

export const buildSalesDashboardStats = (input: { leads: LeadSummary[]; opportunities: OpportunitySummary[]; quotes: QuoteSummary[]; targets: SalesTargetSummary[]; winLoss: WinLossSummary[] }): SalesDashboardStats => {
    const openOpps = input.opportunities.filter((o) => !["won", "lost"].includes(o.status));
    const wonOpps = input.opportunities.filter((o) => o.status === "won");
    const pipelineValue = openOpps.reduce((sum, o) => sum + o.amount, 0);
    const weightedPipeline = openOpps.reduce((sum, o) => sum + o.weightedAmount, 0);
    const closedWonValue = wonOpps.reduce((sum, o) => sum + o.amount, 0);
    const totalClosed = input.winLoss.length;
    const wonCount = input.winLoss.filter((w) => w.outcome === "won").length;
    const avgAchievement = input.targets.length > 0 ? Math.round(input.targets.reduce((sum, t) => sum + t.achievementPercent, 0) / input.targets.length) : 0;
    return {
        totalLeads: input.leads.length,
        openOpportunities: openOpps.length,
        pipelineValue,
        weightedPipeline,
        closedWonValue,
        winRate: totalClosed > 0 ? Math.round((wonCount / totalClosed) * 100) : 0,
        activeQuotes: input.quotes.filter((q) => q.status !== "accepted" && q.status !== "rejected").length,
        targetAchievement: avgAchievement,
    };
};

export const buildSalesReport = (input: { opportunities: OpportunitySummary[]; leads: LeadSummary[]; forecasts: ForecastSummary[]; winLoss: WinLossSummary[] }): SalesReport => {
    const stageMap = new Map<string, { count: number; value: number }>();
    for (const opp of input.opportunities) {
        const stage = opp.stageName ?? "Unassigned";
        const entry = stageMap.get(stage) ?? { count: 0, value: 0 };
        entry.count += 1;
        entry.value += opp.amount;
        stageMap.set(stage, entry);
    }
    const sourceMap = new Map<string, number>();
    for (const lead of input.leads) {
        sourceMap.set(lead.source, (sourceMap.get(lead.source) ?? 0) + 1);
    }
    const statusMap = new Map<string, number>();
    for (const lead of input.leads) {
        statusMap.set(lead.status, (statusMap.get(lead.status) ?? 0) + 1);
    }
    const outcomeMap = new Map<string, { count: number; amount: number }>();
    for (const record of input.winLoss) {
        const entry = outcomeMap.get(record.outcome) ?? { count: 0, amount: 0 };
        entry.count += 1;
        entry.amount += record.amount;
        outcomeMap.set(record.outcome, entry);
    }
    return {
        opportunitiesByStage: Array.from(stageMap.entries()).map(([stage, data]) => ({ stage, count: data.count, value: data.value })),
        leadsBySource: Array.from(sourceMap.entries()).map(([source, count]) => ({ source, count })),
        leadsByStatus: Array.from(statusMap.entries()).map(([status, count]) => ({ status, count })),
        winLossBreakdown: Array.from(outcomeMap.entries()).map(([outcome, data]) => ({ outcome, count: data.count, amount: data.amount })),
        forecastTrend: input.forecasts.map((f) => ({ period: f.forecastPeriod, pipeline: f.pipelineValue, closed: f.closedValue })),
    };
};

export const buildCrossModuleLinks = (input: { opportunities: OpportunitySummary[]; leads: LeadSummary[]; targets: SalesTargetSummary[] }): CrossModuleLinks => ({
    crmClients: new Set(input.opportunities.filter((o) => o.clientName).map((o) => o.clientName)).size + new Set(input.leads.filter((l) => l.clientName).map((l) => l.clientName)).size,
    financeEstimates: input.opportunities.filter((o) => o.amount > 0).length,
    projectOpportunities: input.opportunities.filter((o) => o.projectName).length,
    supportTickets: 0,
    hrSalesReps: input.targets.length,
    automationWorkflows: 0,
    analyticsMetrics: input.opportunities.length,
    settingsConfigured: true,
});
