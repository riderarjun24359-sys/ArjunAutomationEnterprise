export type SalesTab =
    | "overview"
    | "leads"
    | "opportunities"
    | "pipeline"
    | "stages"
    | "quotes"
    | "forecasting"
    | "activities"
    | "meetings"
    | "calls"
    | "emails"
    | "targets"
    | "commissions"
    | "winLoss"
    | "reports"
    | "audit";

export interface SalesDashboardStats {
    totalLeads: number;
    openOpportunities: number;
    pipelineValue: number;
    weightedPipeline: number;
    closedWonValue: number;
    winRate: number;
    activeQuotes: number;
    targetAchievement: number;
}

export interface PipelineSummary {
    id: string;
    name: string;
    code: string;
    description: string;
    isDefault: boolean;
    stageCount: number;
    opportunityCount: number;
}

export interface PipelineStageSummary {
    id: string;
    pipelineName: string;
    name: string;
    sortOrder: number;
    probability: number;
    isClosedWon: boolean;
    isClosedLost: boolean;
    opportunityCount: number;
}

export interface LeadSummary {
    id: string;
    leadName: string;
    companyName: string;
    email: string;
    phone: string;
    source: string;
    status: string;
    score: number;
    assigneeName?: string | null;
    clientName?: string | null;
}

export interface OpportunitySummary {
    id: string;
    opportunityNumber: string;
    name: string;
    description: string;
    pipelineName?: string | null;
    stageName?: string | null;
    clientName?: string | null;
    projectName?: string | null;
    assigneeName?: string | null;
    amount: number;
    probability: number;
    expectedCloseDate?: string | null;
    status: string;
    weightedAmount: number;
}

export interface QuoteSummary {
    id: string;
    quoteNumber: string;
    title: string;
    opportunityNumber?: string | null;
    clientName?: string | null;
    status: string;
    totalAmount: number;
    itemCount: number;
    validUntil?: string | null;
}

export interface ForecastSummary {
    id: string;
    forecastPeriod: string;
    forecastDate: string;
    pipelineValue: number;
    weightedValue: number;
    closedValue: number;
    notes: string;
}

export interface ActivitySummary {
    id: string;
    activityType: string;
    subject: string;
    description: string;
    linkedName: string;
    assigneeName?: string | null;
    dueAt?: string | null;
    completedAt?: string | null;
}

export interface MeetingSummary {
    id: string;
    title: string;
    linkedName: string;
    location: string;
    scheduledAt: string;
    durationMinutes: number;
    status: string;
    attendeeNames: string;
}

export interface CallLogSummary {
    id: string;
    direction: string;
    phoneNumber: string;
    linkedName: string;
    durationSeconds: number;
    outcome: string;
    notes: string;
    calledAt: string;
}

export interface EmailTrackingSummary {
    id: string;
    subject: string;
    recipientEmail: string;
    linkedName: string;
    status: string;
    sentAt: string;
    openedAt?: string | null;
}

export interface SalesTargetSummary {
    id: string;
    employeeName: string;
    periodLabel: string;
    targetAmount: number;
    achievedAmount: number;
    achievementPercent: number;
    periodStart: string;
    periodEnd: string;
}

export interface CommissionSummary {
    id: string;
    employeeName: string;
    opportunityNumber?: string | null;
    commissionRate: number;
    commissionAmount: number;
    status: string;
    calculatedAt: string;
}

export interface WinLossSummary {
    id: string;
    opportunityNumber: string;
    opportunityName: string;
    outcome: string;
    reason: string;
    competitor: string;
    amount: number;
    recordedAt: string;
}

export interface SalesAuditEntry {
    id: string;
    entityType: string;
    action: string;
    summary: string;
    createdAt: string;
}

export interface SalesReport {
    opportunitiesByStage: Array<{ stage: string; count: number; value: number }>;
    leadsBySource: Array<{ source: string; count: number }>;
    leadsByStatus: Array<{ status: string; count: number }>;
    winLossBreakdown: Array<{ outcome: string; count: number; amount: number }>;
    forecastTrend: Array<{ period: string; pipeline: number; closed: number }>;
}

export interface CrossModuleLinks {
    crmClients: number;
    financeEstimates: number;
    projectOpportunities: number;
    supportTickets: number;
    hrSalesReps: number;
    automationWorkflows: number;
    analyticsMetrics: number;
    settingsConfigured: boolean;
}

export interface CreatePipelineInput { name: string; code: string; description: string; }
export interface CreateStageInput { pipelineId: string; name: string; sortOrder: number; probability: number; }
export interface CreateLeadInput { leadName: string; companyName: string; email: string; phone: string; source: string; assignedTo?: string; }
export interface CreateOpportunityInput { opportunityNumber: string; name: string; description: string; pipelineId?: string; stageId?: string; clientId?: string; assignedTo?: string; amount: number; expectedCloseDate?: string; }
export interface CreateQuoteInput { quoteNumber: string; opportunityId?: string; clientId?: string; title: string; totalAmount: number; }
export interface CreateForecastInput { forecastPeriod: string; pipelineValue: number; weightedValue: number; closedValue: number; notes: string; }
export interface CreateActivityInput { opportunityId?: string; leadId?: string; activityType: string; subject: string; description: string; dueAt?: string; assignedTo?: string; }
export interface CreateMeetingInput { opportunityId?: string; leadId?: string; title: string; scheduledAt: string; durationMinutes: number; attendeeNames: string; }
export interface CreateCallLogInput { opportunityId?: string; leadId?: string; direction: string; phoneNumber: string; durationSeconds: number; outcome: string; notes: string; }
export interface CreateEmailTrackingInput { opportunityId?: string; leadId?: string; subject: string; recipientEmail: string; }
export interface CreateTargetInput { employeeId: string; periodLabel: string; targetAmount: number; periodStart: string; periodEnd: string; }
export interface UpdateOpportunityStatusInput { status: string; lostReason?: string; }
