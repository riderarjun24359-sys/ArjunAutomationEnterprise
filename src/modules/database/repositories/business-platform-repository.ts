import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";
import type {
    AiRecommendation,
    ConsultationRecord,
    CreateConsultationInput,
    CreateProposalInput,
    LifecycleEvent,
    ProposalRecord,
} from "@/src/modules/business-platform/types";

function uid(): string {
    return crypto.randomUUID?.() ?? `bp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function mapConsultation(row: Record<string, unknown>): ConsultationRecord {
    return {
        id: String(row.id),
        organizationId: String(row.organization_id),
        leadId: row.lead_id ? String(row.lead_id) : null,
        clientId: row.client_id ? String(row.client_id) : null,
        title: String(row.title),
        scheduledAt: String(row.scheduled_at),
        durationMinutes: Number(row.duration_minutes ?? 30),
        status: row.status as ConsultationRecord["status"],
        assignedTo: row.assigned_to ? String(row.assigned_to) : null,
        meetingNotes: String(row.meeting_notes ?? ""),
        requirements: String(row.requirements ?? ""),
        aiSummary: String(row.ai_summary ?? ""),
        source: String(row.source ?? "manual"),
        createdAt: String(row.created_at),
        updatedAt: String(row.updated_at),
    };
}

function mapProposal(row: Record<string, unknown>): ProposalRecord {
    return {
        id: String(row.id),
        organizationId: String(row.organization_id),
        leadId: row.lead_id ? String(row.lead_id) : null,
        clientId: row.client_id ? String(row.client_id) : null,
        opportunityId: row.opportunity_id ? String(row.opportunity_id) : null,
        title: String(row.title),
        status: row.status as ProposalRecord["status"],
        version: Number(row.version ?? 1),
        totalAmount: Number(row.total_amount ?? 0),
        sourceType: String(row.source_type ?? "business_platform"),
        sourceId: String(row.source_id ?? ""),
        documentRef: String(row.document_ref ?? ""),
        approvalStatus: row.approval_status as ProposalRecord["approvalStatus"],
        validUntil: row.valid_until ? String(row.valid_until) : null,
        createdAt: String(row.created_at),
        updatedAt: String(row.updated_at),
    };
}

export class BusinessPlatformRepository {
    async listConsultations(organizationId: string): Promise<ConsultationRecord[]> {
        const client = getRepositoryClient();
        if (!client) return [];
        const { data, error } = await client
            .from("business_consultations")
            .select("*")
            .eq("organization_id", organizationId)
            .order("scheduled_at", { ascending: true });
        mapRepositoryError(error, "Failed to list consultations");
        return (data ?? []).map((row) => mapConsultation(row as Record<string, unknown>));
    }

    async createConsultation(organizationId: string, input: CreateConsultationInput): Promise<ConsultationRecord | null> {
        const client = getRepositoryClient();
        if (!client) return null;
        const now = new Date().toISOString();
        const payload = {
            id: uid(),
            organization_id: organizationId,
            lead_id: input.leadId ?? null,
            client_id: input.clientId ?? null,
            title: input.title,
            scheduled_at: input.scheduledAt,
            duration_minutes: input.durationMinutes ?? 30,
            status: "scheduled",
            assigned_to: input.assignedTo ?? null,
            requirements: input.requirements ?? "",
            meeting_notes: "",
            ai_summary: "",
            source: "business_platform",
            created_at: now,
            updated_at: now,
        };
        const { data, error } = await client.from("business_consultations").insert(payload).select("*").single();
        mapRepositoryError(error, "Failed to create consultation");
        return data ? mapConsultation(data as Record<string, unknown>) : null;
    }

    async listProposals(organizationId: string): Promise<ProposalRecord[]> {
        const client = getRepositoryClient();
        if (!client) return [];
        const { data, error } = await client
            .from("business_proposals")
            .select("*")
            .eq("organization_id", organizationId)
            .order("created_at", { ascending: false });
        mapRepositoryError(error, "Failed to list proposals");
        return (data ?? []).map((row) => mapProposal(row as Record<string, unknown>));
    }

    async createProposal(organizationId: string, input: CreateProposalInput): Promise<ProposalRecord | null> {
        const client = getRepositoryClient();
        if (!client) return null;
        const now = new Date().toISOString();
        const payload = {
            id: uid(),
            organization_id: organizationId,
            lead_id: input.leadId ?? null,
            client_id: input.clientId ?? null,
            opportunity_id: input.opportunityId ?? null,
            title: input.title,
            status: "draft",
            version: 1,
            total_amount: input.totalAmount,
            source_type: "business_platform",
            source_id: "",
            document_ref: `PROP-${Date.now()}`,
            approval_status: "pending",
            valid_until: input.validUntil ?? null,
            created_at: now,
            updated_at: now,
        };
        const { data, error } = await client.from("business_proposals").insert(payload).select("*").single();
        mapRepositoryError(error, "Failed to create proposal");
        return data ? mapProposal(data as Record<string, unknown>) : null;
    }

    async listLifecycleEvents(organizationId: string): Promise<LifecycleEvent[]> {
        const client = getRepositoryClient();
        if (!client) return [];
        const { data, error } = await client
            .from("business_lifecycle_events")
            .select("*")
            .eq("organization_id", organizationId)
            .order("created_at", { ascending: false })
            .limit(100);
        mapRepositoryError(error, "Failed to list lifecycle events");
        return (data ?? []).map((row) => ({
            id: String(row.id),
            organizationId: String(row.organization_id),
            entityType: String(row.entity_type),
            entityId: String(row.entity_id),
            stage: row.stage as LifecycleEvent["stage"],
            eventType: String(row.event_type),
            notes: String(row.notes ?? ""),
            createdAt: String(row.created_at),
        }));
    }

    async listAiRecommendations(organizationId: string): Promise<AiRecommendation[]> {
        const client = getRepositoryClient();
        if (!client) return [];
        const { data, error } = await client
            .from("business_ai_recommendations")
            .select("*")
            .eq("organization_id", organizationId)
            .order("created_at", { ascending: false });
        mapRepositoryError(error, "Failed to list AI recommendations");
        return (data ?? []).map((row) => ({
            id: String(row.id),
            organizationId: String(row.organization_id),
            entityType: String(row.entity_type),
            entityId: row.entity_id ? String(row.entity_id) : null,
            recommendationType: String(row.recommendation_type),
            title: String(row.title),
            description: String(row.description ?? ""),
            priority: row.priority as AiRecommendation["priority"],
            status: row.status as AiRecommendation["status"],
            requiresApproval: Boolean(row.requires_approval),
            createdAt: String(row.created_at),
        }));
    }
}

export const businessPlatformRepository = new BusinessPlatformRepository();
