export type PlaybookStage = "lead" | "discovery" | "scope" | "blueprint" | "build" | "verification" | "deployment" | "support";
export type PipelineType = "init" | "environment" | "quality" | "testing" | "deployment" | "documentation";
export type QualityDimension = "performance" | "security" | "accessibility" | "brand" | "seo" | "engineering" | "business_rules";
export type KnowledgeEntryType = "lesson" | "solution" | "fix" | "architecture" | "pattern";
export type AiRecommendationType = "blueprint" | "component" | "duplicate" | "improvement" | "checklist";

export interface DeliveryEngineContext {
    authUserId: string;
    email: string;
    fullName?: string | null;
    organizationId?: string | null;
}

export interface BlueprintRecord {
    id: string;
    organizationId: string;
    blueprintKey: string;
    name: string;
    category: string;
    description: string;
    estimatedBuildHours: number;
    componentCount: number;
    reuseScore: number;
    status: "draft" | "active" | "archived";
    createdAt: string;
    updatedAt: string;
}

export interface ComponentRecord {
    id: string;
    organizationId: string;
    componentKey: string;
    name: string;
    category: string;
    blueprintKey: string;
    description: string;
    reuseCount: number;
    status: "draft" | "production" | "deprecated";
    sourceProjectId?: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface EngagementRecord {
    id: string;
    organizationId: string;
    projectId?: string | null;
    clientId?: string | null;
    title: string;
    blueprintKey: string;
    playbookStage: PlaybookStage;
    status: "active" | "paused" | "completed" | "cancelled";
    assignedTo: string;
    notes: string;
    createdAt: string;
    updatedAt: string;
}

export interface PipelineRunRecord {
    id: string;
    organizationId: string;
    engagementId?: string | null;
    pipelineType: PipelineType;
    status: "pending" | "running" | "passed" | "failed";
    durationMs: number;
    summary: string;
    createdAt: string;
    updatedAt: string;
}

export interface QualityVerificationRecord {
    id: string;
    organizationId: string;
    engagementId?: string | null;
    dimension: QualityDimension;
    score: number;
    passed: boolean;
    findings: string;
    createdAt: string;
}

export interface KnowledgeEntryRecord {
    id: string;
    organizationId: string;
    entryType: KnowledgeEntryType;
    title: string;
    content: string;
    tags: string;
    sourceEngagementId?: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface AnalyticsMetricRecord {
    id: string;
    organizationId: string;
    metricKey: string;
    metricValue: number;
    unit: string;
    period: string;
    createdAt: string;
}

export interface AiDeliveryRecommendation {
    id: string;
    organizationId: string;
    engagementId?: string | null;
    recommendationType: AiRecommendationType;
    title: string;
    description: string;
    priority: "low" | "medium" | "high" | "critical";
    status: "pending" | "approved" | "dismissed" | "executed";
    createdAt: string;
    updatedAt: string;
}

export interface DeliveryEngineDashboard {
    blueprintCount: number;
    componentCount: number;
    activeEngagements: number;
    completedEngagements: number;
    pipelinePassRate: number;
    qualityPassRate: number;
    knowledgeEntries: number;
    avgDeliveryDays: number;
    defectRate: number;
    pendingAiRecommendations: number;
    stageCounts: Record<PlaybookStage, number>;
}

export interface CreateEngagementInput {
    title: string;
    blueprintKey?: string;
    projectId?: string;
    clientId?: string;
    assignedTo?: string;
    notes?: string;
}

export interface CreateKnowledgeEntryInput {
    entryType: KnowledgeEntryType;
    title: string;
    content?: string;
    tags?: string;
    sourceEngagementId?: string;
}

export interface DeliveryEngineState {
    selectedEngagementId: string | null;
    updatedAt: string;
}

export interface QualityReport {
    engagementId: string;
    overallScore: number;
    passed: boolean;
    dimensions: QualityVerificationRecord[];
}

export interface DeliveryAnalyticsSummary {
    avgDeliveryTimeDays: number;
    avgBuildTimeHours: number;
    avgTestingTimeHours: number;
    avgDeploymentTimeHours: number;
    clientSatisfactionScore: number;
    defectRate: number;
}
