export type CsOsTab =
    | "health"
    | "plans"
    | "renewals"
    | "churn"
    | "expansion"
    | "timeline"
    | "assistant";

export interface CustomerHealthMetric {
    clientId: string;
    clientName: string;
    overallHealthScore: number;
    productAdoption: number;
    loginActivityScore: number;
    projectDeliveryHealth: number;
    supportHealth: number;
    billingHealth: number;
    usageTrend: "up" | "down" | "flat";
    lastActivityAt: string | null;
    lastActivityRelative: string;
    executiveSummary: string;
}

export interface SuccessPlanItem {
    id: string;
    clientId: string;
    clientName: string;
    title: string;
    goals: string[];
    milestones: Array<{ name: string; status: string }>;
    reviews: string[];
    successOwner: string;
    progressPercent: number;
    status: string;
    aiSuggestions: string[];
}

export interface RenewalCenterItem {
    id: string;
    clientId: string;
    clientName: string;
    contractName: string;
    renewalDate: string | null;
    renewalProbability: number;
    daysRemaining: number | null;
    aiRenewalRisk: "low" | "medium" | "high" | "critical";
    renewalForecastUsd: number;
    status: string;
}

export interface ChurnPreventionItem {
    id: string;
    clientId: string;
    clientName: string;
    riskScore: number;
    riskFactors: string[];
    aiExplanation: string;
    recommendedActions: string[];
    escalationLevel: "none" | "watch" | "manager" | "executive";
}

export interface ExpansionCenterItem {
    id: string;
    clientId: string;
    clientName: string;
    kind: "upsell" | "cross_sell" | "adoption_gap" | "expansion";
    title: string;
    productAdoptionGaps: string[];
    expansionValueUsd: number;
    opportunityScore: number;
    status: string;
}

export interface CustomerTimelineItem {
    id: string;
    clientId: string | null;
    clientName: string;
    source: "crm" | "projects" | "tasks" | "meetings" | "support" | "billing" | "notes" | "activities";
    title: string;
    detail: string;
    occurredAt: string;
    relativeTime: string;
}

export interface CustomerSuccessExecutiveWidgets {
    healthDistribution: Array<{ bucket: string; count: number }>;
    renewalsDue: Array<{ clientName: string; daysRemaining: number; forecastUsd: number }>;
    churnRisk: Array<{ clientName: string; riskScore: number; escalationLevel: string }>;
    expansionPipeline: Array<{ title: string; valueUsd: number; score: number }>;
    netRevenueRetention: number;
    activityFeed: Array<{ title: string; relativeTime: string; source: string }>;
}

export interface AiCustomerSuccessAssistant {
    dailySummary: string;
    customersNeedingAttention: string[];
    renewalRecommendations: string[];
    expansionRecommendations: string[];
    healthInsights: string[];
    executiveSummary: string;
    generatedAt: string;
}

export interface CustomerSuccessOsStats {
    customersTracked: number;
    averageHealth: number;
    renewalsNext30Days: number;
    highChurnRisk: number;
    expansionPipelineUsd: number;
    netRevenueRetention: number;
}

export interface CustomerSuccessSnapshot {
    organizationId: string | null;
    source: "supabase" | "fallback";
    fetchedAt: string;
    stats: CustomerSuccessOsStats;
    healthCenter: CustomerHealthMetric[];
    successPlans: SuccessPlanItem[];
    renewals: RenewalCenterItem[];
    churnPrevention: ChurnPreventionItem[];
    expansion: ExpansionCenterItem[];
    timeline: CustomerTimelineItem[];
    executiveWidgets: CustomerSuccessExecutiveWidgets;
    assistant: AiCustomerSuccessAssistant;
}
