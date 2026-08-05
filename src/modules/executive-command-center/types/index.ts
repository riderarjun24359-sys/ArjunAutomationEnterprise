import type { EipDashboardStats } from "@/src/modules/enterprise-intelligence-platform/types";
import type { AixDashboardStats } from "@/src/modules/executive-intelligence/types";
import type { DashboardOverview } from "@/src/modules/dashboard/types";
import type { BusinessPlatformDashboard } from "@/src/modules/business-platform/types";

export type IntelligenceModuleKey = "cto" | "operations" | "business" | "customer" | "project";

export type Severity = "critical" | "high" | "medium" | "low";
export type ModuleHealth = "healthy" | "watch" | "critical";

export interface ExecutiveAttentionItem {
    id: string;
    title: string;
    detail: string;
    severity: Severity;
    module: IntelligenceModuleKey;
    actionHref?: string;
    actionLabel?: string;
}

export interface ExecutiveRiskItem {
    id: string;
    title: string;
    detail: string;
    severity: Severity;
    module: IntelligenceModuleKey;
    score: number;
}

export interface ExecutiveOpportunityItem {
    id: string;
    title: string;
    detail: string;
    module: IntelligenceModuleKey;
    impact: "high" | "medium" | "low";
    actionHref?: string;
}

export interface ExecutiveRecommendationItem {
    id: string;
    title: string;
    detail: string;
    module: IntelligenceModuleKey;
    requiresApproval: boolean;
    confidence: number;
}

export interface ExecutiveFeedItem {
    id: string;
    title: string;
    detail: string;
    module: IntelligenceModuleKey;
    time: string;
    tag: string;
}

export interface ExecutiveNotification {
    id: string;
    title: string;
    detail: string;
    time: string;
    severity: Severity;
    read: boolean;
}

export interface IntelligenceModuleMetric {
    label: string;
    value: string | number;
    trend?: "up" | "down" | "flat";
}

export interface IntelligenceModuleSnapshot {
    key: IntelligenceModuleKey;
    label: string;
    description: string;
    score: number;
    status: ModuleHealth;
    metrics: IntelligenceModuleMetric[];
    highlights: string[];
}

export interface ExecutiveBrief {
    title: string;
    summary: string;
    generatedAt: string;
    priorities: string[];
}

export interface ExecutiveKpi {
    title: string;
    value: string;
    detail: string;
    tone?: "accent" | "warning" | "success" | "neutral";
    trend?: "up" | "down" | "flat";
}

export interface ExecutiveCommandCenterSnapshot {
    organizationName: string;
    source: "supabase" | "fallback";
    unifiedScore: number;
    attentionToday: ExecutiveAttentionItem[];
    risks: ExecutiveRiskItem[];
    opportunities: ExecutiveOpportunityItem[];
    recommendations: ExecutiveRecommendationItem[];
    feed: ExecutiveFeedItem[];
    notifications: ExecutiveNotification[];
    modules: IntelligenceModuleSnapshot[];
    brief: ExecutiveBrief;
    kpis: ExecutiveKpi[];
}

export interface ExecutiveRawSignals {
    overview: DashboardOverview;
    eip: EipDashboardStats;
    aix: AixDashboardStats;
    business: BusinessPlatformDashboard | null;
}

export interface SmartSearchResult {
    id: string;
    label: string;
    detail: string;
    category: "navigation" | "action" | "client" | "project" | "invoice" | "task" | "team" | "knowledge" | "ai";
    href?: string;
    keywords: string[];
    action?: () => void;
}

export interface ExecutiveCommand {
    id: string;
    label: string;
    detail: string;
    category: "navigation" | "action" | "query";
    keywords: string[];
    href?: string;
    requiresApproval?: boolean;
}

export interface CopilotMessage {
    id: string;
    role: "user" | "assistant" | "system";
    content: string;
    requiresApproval?: boolean;
    approved?: boolean;
    timestamp: string;
}

export interface CopilotContext {
    organizationName: string;
    unifiedScore: number;
    topRisks: string[];
    topOpportunities: string[];
    pendingRecommendations: number;
}
