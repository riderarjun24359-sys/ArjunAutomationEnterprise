import type { AsleIntegrationChannel, AsleScoreBand } from "./constants";

export interface LeadInboxRow {
    id: string;
    leadName: string;
    companyName: string;
    email: string;
    phone: string;
    source: string;
    status: string;
    score: number;
    scoreBand: AsleScoreBand;
    createdAt: string;
}

export interface LeadCaptureCenter {
    inbox: LeadInboxRow[];
    bySource: Array<{ source: string; count: number }>;
    newToday: number;
    totalLeads: number;
    captureChannels: string[];
}

export interface QualificationRow {
    id: string;
    leadName: string;
    companyName: string;
    status: string;
    score: number;
    scoreBand: AsleScoreBand;
    qualification: "qualified" | "nurture" | "disqualified" | "new";
    reason: string;
}

export interface LeadQualificationBoard {
    rows: QualificationRow[];
    qualified: number;
    nurture: number;
    disqualified: number;
    hot: number;
    warm: number;
    cold: number;
}

export interface OpportunitySignalRow {
    id: string;
    name: string;
    amount: number;
    probability: number;
    status: string;
    stageName: string;
    signal: "strong" | "moderate" | "weak";
    expectedCloseDate: string;
}

export interface DealRow {
    id: string;
    opportunityNumber: string;
    name: string;
    amount: number;
    weightedAmount: number;
    probability: number;
    status: string;
    stageName: string;
    pipelineName: string;
    expectedCloseDate: string;
}

export interface PipelineStageColumn {
    stageId: string;
    stageName: string;
    sortOrder: number;
    probability: number;
    isClosedWon: boolean;
    isClosedLost: boolean;
    deals: DealRow[];
    totalAmount: number;
}

export interface SalesPipelineBoard {
    stages: PipelineStageColumn[];
    listDeals: DealRow[];
    opportunities: OpportunitySignalRow[];
    openDealCount: number;
    pipelineValue: number;
    weightedPipeline: number;
}

export interface DocumentRow {
    id: string;
    title: string;
    kind: "proposal" | "quotation" | "contract" | "estimate";
    status: string;
    value: number;
    ref: string;
    validUntil: string;
}

export interface DocumentGenerators {
    proposals: DocumentRow[];
    quotations: DocumentRow[];
    contracts: DocumentRow[];
    estimates: DocumentRow[];
    pendingCount: number;
    totalValue: number;
}

export interface FollowUpRow {
    id: string;
    subject: string;
    activityType: string;
    dueAt: string;
    status: "overdue" | "due_soon" | "scheduled" | "completed";
    related: string;
}

export interface IntegrationArchitectureRow {
    channel: AsleIntegrationChannel;
    status: "connected_architecture" | "ready" | "needs_config";
    liveSignals: number;
    detail: string;
}

export interface SalesAssistantInsight {
    id: string;
    title: string;
    priority: "high" | "medium" | "low";
    detail: string;
}

export interface AutomationHub {
    followUps: FollowUpRow[];
    assistantInsights: SalesAssistantInsight[];
    integrations: IntegrationArchitectureRow[];
    emailSignals: number;
    meetingSignals: number;
    callSignals: number;
    notificationCount: number;
}

export interface FunnelStage {
    stage: string;
    count: number;
    conversionFromPrior: number | null;
}

export interface WinLossRow {
    id: string;
    outcome: string;
    reason: string;
    competitor: string;
    amount: number;
    recordedAt: string;
}

export interface ForecastRow {
    id: string;
    period: string;
    forecastDate: string;
    pipelineValue: number;
    weightedValue: number;
    closedValue: number;
    notes: string;
}

export interface SalesAnalytics {
    kpis: {
        totalLeads: number;
        openOpportunities: number;
        pipelineValue: number;
        weightedPipeline: number;
        closedWonValue: number;
        winRate: number;
        activeQuotes: number;
        targetAchievement: number;
    };
    funnel: FunnelStage[];
    forecasts: ForecastRow[];
    winLoss: WinLossRow[];
    winCount: number;
    lossCount: number;
}

export interface TimelineEvent {
    id: string;
    at: string;
    kind: string;
    title: string;
    detail: string;
}

export interface SalesTaskRow {
    id: string;
    subject: string;
    activityType: string;
    dueAt: string;
    completed: boolean;
    assignee: string;
}

export interface WorkspaceTools {
    timeline: TimelineEvent[];
    tasks: SalesTaskRow[];
    openTasks: number;
    completedTasks: number;
    searchIndexSize: number;
    exportReady: boolean;
    filterPresets: string[];
}

export interface AiSalesLeadEngineSnapshot {
    organizationId: string | null;
    accessGranted: boolean;
    accessDeniedReason?: string;
    fetchedAt: string;
    capture: LeadCaptureCenter;
    qualify: LeadQualificationBoard;
    pipeline: SalesPipelineBoard;
    documents: DocumentGenerators;
    automation: AutomationHub;
    analytics: SalesAnalytics;
    workspace: WorkspaceTools;
}

export interface AiSalesLeadEngineRawData {
    organizationId: string;
    membershipRole: string | null;
    leads: Array<{
        id: string;
        lead_name: string;
        company_name: string;
        email: string;
        phone: string;
        source: string;
        status: string;
        score: number;
        created_at: string;
    }>;
    opportunities: Array<{
        id: string;
        opportunity_number: string;
        name: string;
        description: string;
        pipeline_id: string | null;
        stage_id: string | null;
        amount: number;
        probability: number;
        expected_close_date: string | null;
        status: string;
        lost_reason: string;
        created_at: string;
    }>;
    pipelines: Array<{ id: string; name: string; code: string; is_default: boolean }>;
    stages: Array<{
        id: string;
        pipeline_id: string;
        name: string;
        sort_order: number;
        probability: number;
        is_closed_won: boolean;
        is_closed_lost: boolean;
    }>;
    quotes: Array<{
        id: string;
        quote_number: string;
        title: string;
        status: string;
        total_amount: number;
        valid_until: string | null;
    }>;
    forecasts: Array<{
        id: string;
        forecast_period: string;
        forecast_date: string;
        pipeline_value: number;
        weighted_value: number;
        closed_value: number;
        notes: string;
    }>;
    activities: Array<{
        id: string;
        opportunity_id: string | null;
        lead_id: string | null;
        activity_type: string;
        subject: string;
        description: string;
        due_at: string | null;
        completed_at: string | null;
        created_at: string;
    }>;
    meetings: Array<{
        id: string;
        title: string;
        scheduled_at: string;
        status: string;
        duration_minutes: number;
    }>;
    callLogs: Array<{
        id: string;
        direction: string;
        outcome: string;
        called_at: string;
        notes: string;
    }>;
    emailTracking: Array<{
        id: string;
        subject: string;
        recipient_email: string;
        status: string;
        sent_at: string;
        opened_at: string | null;
    }>;
    targets: Array<{
        id: string;
        period_label: string;
        target_amount: number;
        achieved_amount: number;
    }>;
    winLoss: Array<{
        id: string;
        outcome: string;
        reason: string;
        competitor: string;
        amount: number;
        recorded_at: string;
    }>;
    auditLogs: Array<{
        id: string;
        entity_type: string;
        action: string;
        summary: string;
        created_at: string;
    }>;
    proposals: Array<{
        id: string;
        proposal_name: string;
        proposal_status: string;
        proposal_value: number;
        proposal_key: string;
    }>;
    contracts: Array<{
        id: string;
        contract_name: string;
        contract_status: string;
        contract_value: number;
        contract_key: string;
    }>;
    baProposals: Array<{
        id: string;
        title: string;
        status: string;
    }>;
    estimates: Array<{
        id: string;
        number: string;
        status: string;
        total: number;
        valid_until: string | null;
        notes: string;
    }>;
}
