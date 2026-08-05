export type LifecycleStage =
    | "lead"
    | "qualification"
    | "consultation"
    | "proposal"
    | "agreement"
    | "client"
    | "project"
    | "delivery"
    | "support"
    | "renewal"
    | "referral";

export interface BusinessPlatformContext {
    authUserId: string;
    email: string;
    fullName?: string | null;
    organizationId?: string | null;
}

export interface ConsultationRecord {
    id: string;
    organizationId: string;
    leadId?: string | null;
    clientId?: string | null;
    title: string;
    scheduledAt: string;
    durationMinutes: number;
    status: "scheduled" | "completed" | "cancelled" | "no_show";
    assignedTo?: string | null;
    meetingNotes: string;
    requirements: string;
    aiSummary: string;
    source: string;
    createdAt: string;
    updatedAt: string;
}

export interface ProposalRecord {
    id: string;
    organizationId: string;
    leadId?: string | null;
    clientId?: string | null;
    opportunityId?: string | null;
    title: string;
    status: "draft" | "review" | "sent" | "viewed" | "accepted" | "rejected" | "expired";
    version: number;
    totalAmount: number;
    sourceType: string;
    sourceId: string;
    documentRef: string;
    approvalStatus: "pending" | "approved" | "rejected";
    validUntil?: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface LifecycleEvent {
    id: string;
    organizationId: string;
    entityType: string;
    entityId: string;
    stage: LifecycleStage;
    eventType: string;
    notes: string;
    createdAt: string;
}

export interface AiRecommendation {
    id: string;
    organizationId: string;
    entityType: string;
    entityId?: string | null;
    recommendationType: string;
    title: string;
    description: string;
    priority: "low" | "medium" | "high" | "critical";
    status: "pending" | "approved" | "dismissed" | "executed";
    requiresApproval: boolean;
    createdAt: string;
}

export interface BusinessPlatformDashboard {
    leadsCount: number;
    consultationsScheduled: number;
    proposalsDraft: number;
    activeClients: number;
    activeProjects: number;
    openInvoices: number;
    teamMembers: number;
    pendingAiRecommendations: number;
    lifecycleCounts: Record<LifecycleStage, number>;
}

export interface BusinessPlatformState {
    selectedEntityId: string | null;
    selectedEntityType: "lead" | "client" | null;
    consultations: ConsultationRecord[];
    proposals: ProposalRecord[];
    lifecycleEvents: LifecycleEvent[];
    aiRecommendations: AiRecommendation[];
    updatedAt: string;
}

export interface CreateConsultationInput {
    title: string;
    scheduledAt: string;
    durationMinutes?: number;
    leadId?: string;
    clientId?: string;
    assignedTo?: string;
    requirements?: string;
}

export interface CreateProposalInput {
    title: string;
    totalAmount: number;
    leadId?: string;
    clientId?: string;
    opportunityId?: string;
    validUntil?: string;
}

export interface TeamMemberSummary {
    id: string;
    name: string;
    role: string;
    department: string;
    capacity: number;
    activeAssignments: number;
}

export interface ClientPortalSummary {
    clientId: string;
    clientName: string;
    projectsCount: number;
    openInvoices: number;
    pendingApprovals: number;
    lastActivity: string;
}
