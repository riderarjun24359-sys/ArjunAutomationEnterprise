import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";
import type {
    AiDeliveryRecommendation,
    AnalyticsMetricRecord,
    BlueprintRecord,
    ComponentRecord,
    CreateEngagementInput,
    CreateKnowledgeEntryInput,
    EngagementRecord,
    KnowledgeEntryRecord,
    PipelineRunRecord,
    QualityVerificationRecord,
} from "@/src/modules/delivery-engine/types";

function uid(): string {
    return crypto.randomUUID?.() ?? `de-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function mapBlueprint(row: Record<string, unknown>): BlueprintRecord {
    return {
        id: String(row.id),
        organizationId: String(row.organization_id),
        blueprintKey: String(row.blueprint_key),
        name: String(row.name),
        category: String(row.category),
        description: String(row.description ?? ""),
        estimatedBuildHours: Number(row.estimated_build_hours ?? 0),
        componentCount: Number(row.component_count ?? 0),
        reuseScore: Number(row.reuse_score ?? 0),
        status: row.status as BlueprintRecord["status"],
        createdAt: String(row.created_at),
        updatedAt: String(row.updated_at),
    };
}

function mapComponent(row: Record<string, unknown>): ComponentRecord {
    return {
        id: String(row.id),
        organizationId: String(row.organization_id),
        componentKey: String(row.component_key),
        name: String(row.name),
        category: String(row.category),
        blueprintKey: String(row.blueprint_key ?? ""),
        description: String(row.description ?? ""),
        reuseCount: Number(row.reuse_count ?? 0),
        status: row.status as ComponentRecord["status"],
        sourceProjectId: row.source_project_id ? String(row.source_project_id) : null,
        createdAt: String(row.created_at),
        updatedAt: String(row.updated_at),
    };
}

function mapEngagement(row: Record<string, unknown>): EngagementRecord {
    return {
        id: String(row.id),
        organizationId: String(row.organization_id),
        projectId: row.project_id ? String(row.project_id) : null,
        clientId: row.client_id ? String(row.client_id) : null,
        title: String(row.title),
        blueprintKey: String(row.blueprint_key ?? ""),
        playbookStage: row.playbook_stage as EngagementRecord["playbookStage"],
        status: row.status as EngagementRecord["status"],
        assignedTo: String(row.assigned_to ?? ""),
        notes: String(row.notes ?? ""),
        createdAt: String(row.created_at),
        updatedAt: String(row.updated_at),
    };
}

function mapPipelineRun(row: Record<string, unknown>): PipelineRunRecord {
    return {
        id: String(row.id),
        organizationId: String(row.organization_id),
        engagementId: row.engagement_id ? String(row.engagement_id) : null,
        pipelineType: row.pipeline_type as PipelineRunRecord["pipelineType"],
        status: row.status as PipelineRunRecord["status"],
        durationMs: Number(row.duration_ms ?? 0),
        summary: String(row.summary ?? ""),
        createdAt: String(row.created_at),
        updatedAt: String(row.updated_at),
    };
}

function mapQuality(row: Record<string, unknown>): QualityVerificationRecord {
    return {
        id: String(row.id),
        organizationId: String(row.organization_id),
        engagementId: row.engagement_id ? String(row.engagement_id) : null,
        dimension: row.dimension as QualityVerificationRecord["dimension"],
        score: Number(row.score ?? 0),
        passed: Boolean(row.passed),
        findings: String(row.findings ?? ""),
        createdAt: String(row.created_at),
    };
}

function mapKnowledge(row: Record<string, unknown>): KnowledgeEntryRecord {
    return {
        id: String(row.id),
        organizationId: String(row.organization_id),
        entryType: row.entry_type as KnowledgeEntryRecord["entryType"],
        title: String(row.title),
        content: String(row.content ?? ""),
        tags: String(row.tags ?? ""),
        sourceEngagementId: row.source_engagement_id ? String(row.source_engagement_id) : null,
        createdAt: String(row.created_at),
        updatedAt: String(row.updated_at),
    };
}

function mapMetric(row: Record<string, unknown>): AnalyticsMetricRecord {
    return {
        id: String(row.id),
        organizationId: String(row.organization_id),
        metricKey: String(row.metric_key),
        metricValue: Number(row.metric_value ?? 0),
        unit: String(row.unit ?? ""),
        period: String(row.period ?? "all_time"),
        createdAt: String(row.created_at),
    };
}

function mapAiRec(row: Record<string, unknown>): AiDeliveryRecommendation {
    return {
        id: String(row.id),
        organizationId: String(row.organization_id),
        engagementId: row.engagement_id ? String(row.engagement_id) : null,
        recommendationType: row.recommendation_type as AiDeliveryRecommendation["recommendationType"],
        title: String(row.title),
        description: String(row.description ?? ""),
        priority: row.priority as AiDeliveryRecommendation["priority"],
        status: row.status as AiDeliveryRecommendation["status"],
        createdAt: String(row.created_at),
        updatedAt: String(row.updated_at),
    };
}

export class DeliveryEngineRepository {
    async listBlueprints(organizationId: string): Promise<BlueprintRecord[]> {
        const client = getRepositoryClient();
        if (!client) return [];
        const { data, error } = await client.from("de_blueprints").select("*").eq("organization_id", organizationId).order("name");
        mapRepositoryError(error, "Failed to list blueprints");
        return (data ?? []).map((r) => mapBlueprint(r as Record<string, unknown>));
    }

    async upsertBlueprint(organizationId: string, input: { blueprintKey: string; name: string; category: string; description?: string; estimatedBuildHours?: number; componentCount?: number; reuseScore?: number }): Promise<BlueprintRecord | null> {
        const client = getRepositoryClient();
        if (!client) return null;
        const now = new Date().toISOString();
        const payload = {
            id: uid(),
            organization_id: organizationId,
            blueprint_key: input.blueprintKey,
            name: input.name,
            category: input.category,
            description: input.description ?? "",
            estimated_build_hours: input.estimatedBuildHours ?? 0,
            component_count: input.componentCount ?? 0,
            reuse_score: input.reuseScore ?? 0,
            status: "active",
            created_at: now,
            updated_at: now,
        };
        const { data, error } = await client.from("de_blueprints").upsert(payload, { onConflict: "organization_id,blueprint_key" }).select().single();
        mapRepositoryError(error, "Failed to upsert blueprint");
        return data ? mapBlueprint(data as Record<string, unknown>) : null;
    }

    async listComponents(organizationId: string): Promise<ComponentRecord[]> {
        const client = getRepositoryClient();
        if (!client) return [];
        const { data, error } = await client.from("de_components").select("*").eq("organization_id", organizationId).order("reuse_count", { ascending: false });
        mapRepositoryError(error, "Failed to list components");
        return (data ?? []).map((r) => mapComponent(r as Record<string, unknown>));
    }

    async listEngagements(organizationId: string): Promise<EngagementRecord[]> {
        const client = getRepositoryClient();
        if (!client) return [];
        const { data, error } = await client.from("de_engagements").select("*").eq("organization_id", organizationId).order("updated_at", { ascending: false });
        mapRepositoryError(error, "Failed to list engagements");
        return (data ?? []).map((r) => mapEngagement(r as Record<string, unknown>));
    }

    async createEngagement(organizationId: string, input: CreateEngagementInput): Promise<EngagementRecord | null> {
        const client = getRepositoryClient();
        if (!client) return null;
        const now = new Date().toISOString();
        const payload = {
            id: uid(),
            organization_id: organizationId,
            project_id: input.projectId ?? null,
            client_id: input.clientId ?? null,
            title: input.title,
            blueprint_key: input.blueprintKey ?? "",
            playbook_stage: "lead",
            status: "active",
            assigned_to: input.assignedTo ?? "",
            notes: input.notes ?? "",
            created_at: now,
            updated_at: now,
        };
        const { data, error } = await client.from("de_engagements").insert(payload).select().single();
        mapRepositoryError(error, "Failed to create engagement");
        return data ? mapEngagement(data as Record<string, unknown>) : null;
    }

    async updateEngagementStage(organizationId: string, engagementId: string, stage: EngagementRecord["playbookStage"]): Promise<EngagementRecord | null> {
        const client = getRepositoryClient();
        if (!client) return null;
        const { data, error } = await client.from("de_engagements").update({ playbook_stage: stage, updated_at: new Date().toISOString() }).eq("id", engagementId).eq("organization_id", organizationId).select().single();
        mapRepositoryError(error, "Failed to update engagement stage");
        return data ? mapEngagement(data as Record<string, unknown>) : null;
    }

    async listPipelineRuns(organizationId: string): Promise<PipelineRunRecord[]> {
        const client = getRepositoryClient();
        if (!client) return [];
        const { data, error } = await client.from("de_pipeline_runs").select("*").eq("organization_id", organizationId).order("created_at", { ascending: false });
        mapRepositoryError(error, "Failed to list pipeline runs");
        return (data ?? []).map((r) => mapPipelineRun(r as Record<string, unknown>));
    }

    async createPipelineRun(organizationId: string, input: { engagementId?: string; pipelineType: PipelineRunRecord["pipelineType"]; status?: PipelineRunRecord["status"]; durationMs?: number; summary?: string }): Promise<PipelineRunRecord | null> {
        const client = getRepositoryClient();
        if (!client) return null;
        const now = new Date().toISOString();
        const payload = {
            id: uid(),
            organization_id: organizationId,
            engagement_id: input.engagementId ?? null,
            pipeline_type: input.pipelineType,
            status: input.status ?? "passed",
            duration_ms: input.durationMs ?? 0,
            summary: input.summary ?? "",
            created_at: now,
            updated_at: now,
        };
        const { data, error } = await client.from("de_pipeline_runs").insert(payload).select().single();
        mapRepositoryError(error, "Failed to create pipeline run");
        return data ? mapPipelineRun(data as Record<string, unknown>) : null;
    }

    async listQualityVerifications(organizationId: string): Promise<QualityVerificationRecord[]> {
        const client = getRepositoryClient();
        if (!client) return [];
        const { data, error } = await client.from("de_quality_verifications").select("*").eq("organization_id", organizationId).order("created_at", { ascending: false });
        mapRepositoryError(error, "Failed to list quality verifications");
        return (data ?? []).map((r) => mapQuality(r as Record<string, unknown>));
    }

    async createQualityVerification(organizationId: string, input: { engagementId?: string; dimension: QualityVerificationRecord["dimension"]; score: number; passed: boolean; findings?: string }): Promise<QualityVerificationRecord | null> {
        const client = getRepositoryClient();
        if (!client) return null;
        const payload = {
            id: uid(),
            organization_id: organizationId,
            engagement_id: input.engagementId ?? null,
            dimension: input.dimension,
            score: input.score,
            passed: input.passed,
            findings: input.findings ?? "",
            created_at: new Date().toISOString(),
        };
        const { data, error } = await client.from("de_quality_verifications").insert(payload).select().single();
        mapRepositoryError(error, "Failed to create quality verification");
        return data ? mapQuality(data as Record<string, unknown>) : null;
    }

    async listKnowledgeEntries(organizationId: string): Promise<KnowledgeEntryRecord[]> {
        const client = getRepositoryClient();
        if (!client) return [];
        const { data, error } = await client.from("de_knowledge_entries").select("*").eq("organization_id", organizationId).order("created_at", { ascending: false });
        mapRepositoryError(error, "Failed to list knowledge entries");
        return (data ?? []).map((r) => mapKnowledge(r as Record<string, unknown>));
    }

    async createKnowledgeEntry(organizationId: string, input: CreateKnowledgeEntryInput): Promise<KnowledgeEntryRecord | null> {
        const client = getRepositoryClient();
        if (!client) return null;
        const now = new Date().toISOString();
        const payload = {
            id: uid(),
            organization_id: organizationId,
            entry_type: input.entryType,
            title: input.title,
            content: input.content ?? "",
            tags: input.tags ?? "",
            source_engagement_id: input.sourceEngagementId ?? null,
            created_at: now,
            updated_at: now,
        };
        const { data, error } = await client.from("de_knowledge_entries").insert(payload).select().single();
        mapRepositoryError(error, "Failed to create knowledge entry");
        return data ? mapKnowledge(data as Record<string, unknown>) : null;
    }

    async listAnalyticsMetrics(organizationId: string): Promise<AnalyticsMetricRecord[]> {
        const client = getRepositoryClient();
        if (!client) return [];
        const { data, error } = await client.from("de_analytics_metrics").select("*").eq("organization_id", organizationId);
        mapRepositoryError(error, "Failed to list analytics metrics");
        return (data ?? []).map((r) => mapMetric(r as Record<string, unknown>));
    }

    async upsertAnalyticsMetric(organizationId: string, metricKey: string, metricValue: number, unit: string): Promise<void> {
        const client = getRepositoryClient();
        if (!client) return;
        const payload = {
            id: uid(),
            organization_id: organizationId,
            metric_key: metricKey,
            metric_value: metricValue,
            unit,
            period: "all_time",
            created_at: new Date().toISOString(),
        };
        await client.from("de_analytics_metrics").upsert(payload, { onConflict: "organization_id,metric_key,period" });
    }

    async listAiRecommendations(organizationId: string): Promise<AiDeliveryRecommendation[]> {
        const client = getRepositoryClient();
        if (!client) return [];
        const { data, error } = await client.from("de_ai_recommendations").select("*").eq("organization_id", organizationId).order("created_at", { ascending: false });
        mapRepositoryError(error, "Failed to list AI recommendations");
        return (data ?? []).map((r) => mapAiRec(r as Record<string, unknown>));
    }

    async createAiRecommendation(organizationId: string, input: { engagementId?: string; recommendationType: AiDeliveryRecommendation["recommendationType"]; title: string; description?: string; priority?: AiDeliveryRecommendation["priority"] }): Promise<AiDeliveryRecommendation | null> {
        const client = getRepositoryClient();
        if (!client) return null;
        const now = new Date().toISOString();
        const payload = {
            id: uid(),
            organization_id: organizationId,
            engagement_id: input.engagementId ?? null,
            recommendation_type: input.recommendationType,
            title: input.title,
            description: input.description ?? "",
            priority: input.priority ?? "medium",
            status: "pending",
            created_at: now,
            updated_at: now,
        };
        const { data, error } = await client.from("de_ai_recommendations").insert(payload).select().single();
        mapRepositoryError(error, "Failed to create AI recommendation");
        return data ? mapAiRec(data as Record<string, unknown>) : null;
    }

    async updateAiRecommendationStatus(organizationId: string, id: string, status: AiDeliveryRecommendation["status"]): Promise<void> {
        const client = getRepositoryClient();
        if (!client) return;
        await client.from("de_ai_recommendations").update({ status, updated_at: new Date().toISOString() }).eq("id", id).eq("organization_id", organizationId);
    }
}

export const deliveryEngineRepository = new DeliveryEngineRepository();
