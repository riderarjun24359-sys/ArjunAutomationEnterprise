import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { businessPlatformRepository } from "@/src/modules/database/repositories/business-platform-repository";
import { BUSINESS_PLATFORM_STORAGE_KEY } from "../constants";
import {
    fetchActiveClients,
    fetchAnalyticsMetrics,
    fetchApiKeys,
    fetchClients,
    fetchEmployees,
    fetchOrganizationSettings,
    fetchTeams,
} from "../integrations/data-bridge";
import { fetchFinanceStats, fetchInvoices, fetchPayments } from "../integrations/finance-bridge";
import {
    createProjectViaMissionCore,
    generateProposalViaMissionCore,
    publishBusinessPlatformEvent,
    provisionClientPortal,
    scheduleConsultationViaMissionCore,
} from "../integrations/mission-core-bridge";
import { createProject, fetchProjects } from "../integrations/projects-bridge";
import { createLead, fetchLeads, fetchOpportunities, fetchQuotes, fetchSalesStats } from "../integrations/sales-bridge";
import type {
    AiRecommendation,
    BusinessPlatformContext,
    BusinessPlatformDashboard,
    BusinessPlatformState,
    ClientPortalSummary,
    ConsultationRecord,
    CreateConsultationInput,
    CreateProposalInput,
    LifecycleEvent,
    LifecycleStage,
    ProposalRecord,
    TeamMemberSummary,
} from "../types";

function uid(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function loadState(): BusinessPlatformState {
    if (typeof window === "undefined") return buildDefaultState();
    try {
        const raw = localStorage.getItem(BUSINESS_PLATFORM_STORAGE_KEY);
        if (!raw) return buildDefaultState();
        return JSON.parse(raw) as BusinessPlatformState;
    } catch {
        return buildDefaultState();
    }
}

function saveState(state: BusinessPlatformState) {
    if (typeof window === "undefined") return;
    localStorage.setItem(BUSINESS_PLATFORM_STORAGE_KEY, JSON.stringify(state));
}

export function buildDefaultState(): BusinessPlatformState {
    return {
        selectedEntityId: null,
        selectedEntityType: null,
        consultations: [],
        proposals: [],
        lifecycleEvents: [],
        aiRecommendations: [],
        updatedAt: new Date().toISOString(),
    };
}

export class BusinessPlatformService {
    private async getOrgId(ctx: BusinessPlatformContext): Promise<string | null> {
        if (ctx.organizationId) return ctx.organizationId;
        const resolved = await resolveOrganizationContext(ctx.authUserId, ctx.email, ctx.fullName);
        return resolved?.organizationId ?? null;
    }

    async getDashboard(ctx: BusinessPlatformContext): Promise<BusinessPlatformDashboard> {
        const [leads, consultations, proposals, clients, projects, invoices, employees, aiRecs, salesStats, financeStats] = await Promise.all([
            fetchLeads(ctx.authUserId, ctx.email, ctx.fullName),
            this.getConsultations(ctx),
            this.getProposals(ctx),
            fetchActiveClients(ctx.authUserId, ctx.email, ctx.fullName),
            fetchProjects(ctx.authUserId, ctx.email, ctx.fullName),
            fetchInvoices(ctx.authUserId, ctx.email, ctx.fullName),
            fetchEmployees(ctx.authUserId, ctx.email, ctx.fullName),
            this.getAiRecommendations(ctx),
            fetchSalesStats(ctx.authUserId, ctx.email, ctx.fullName),
            fetchFinanceStats(ctx.authUserId, ctx.email, ctx.fullName),
        ]);

        const lifecycleCounts = this.buildLifecycleCounts(leads.length, consultations, proposals, clients.length, projects.length);

        return {
            leadsCount: leads.length,
            consultationsScheduled: consultations.filter((c) => c.status === "scheduled").length,
            proposalsDraft: proposals.filter((p) => p.status === "draft" || p.status === "review").length,
            activeClients: clients.length,
            activeProjects: projects.filter((p) => p.status === "active" || p.status === "planning").length,
            openInvoices: invoices.filter((i) => i.status !== "paid" && i.status !== "void").length,
            teamMembers: employees.length,
            pendingAiRecommendations: aiRecs.filter((r) => r.status === "pending").length,
            lifecycleCounts,
        };
    }

    private buildLifecycleCounts(
        leadsCount: number,
        consultations: ConsultationRecord[],
        proposals: ProposalRecord[],
        clientsCount: number,
        projectsCount: number,
    ): Record<LifecycleStage, number> {
        return {
            lead: leadsCount,
            qualification: Math.max(0, Math.floor(leadsCount * 0.6)),
            consultation: consultations.length,
            proposal: proposals.length,
            agreement: proposals.filter((p) => p.status === "accepted").length,
            client: clientsCount,
            project: projectsCount,
            delivery: Math.max(0, Math.floor(projectsCount * 0.7)),
            support: clientsCount,
            renewal: Math.max(0, Math.floor(clientsCount * 0.3)),
            referral: Math.max(0, Math.floor(clientsCount * 0.1)),
        };
    }

    async getConsultations(ctx: BusinessPlatformContext): Promise<ConsultationRecord[]> {
        const orgId = await this.getOrgId(ctx);
        if (orgId) {
            const db = await businessPlatformRepository.listConsultations(orgId);
            if (db.length > 0) return db;
        }
        return loadState().consultations;
    }

    async getProposals(ctx: BusinessPlatformContext): Promise<ProposalRecord[]> {
        const orgId = await this.getOrgId(ctx);
        if (orgId) {
            const db = await businessPlatformRepository.listProposals(orgId);
            if (db.length > 0) return db;
        }
        return loadState().proposals;
    }

    async getLifecycleEvents(ctx: BusinessPlatformContext): Promise<LifecycleEvent[]> {
        const orgId = await this.getOrgId(ctx);
        if (orgId) {
            const db = await businessPlatformRepository.listLifecycleEvents(orgId);
            if (db.length > 0) return db;
        }
        return loadState().lifecycleEvents;
    }

    async getAiRecommendations(ctx: BusinessPlatformContext): Promise<AiRecommendation[]> {
        const orgId = await this.getOrgId(ctx);
        if (orgId) {
            const db = await businessPlatformRepository.listAiRecommendations(orgId);
            if (db.length > 0) return db;
        }
        const state = loadState();
        if (state.aiRecommendations.length === 0) {
            return this.seedAiRecommendations(orgId ?? "local");
        }
        return state.aiRecommendations;
    }

    private seedAiRecommendations(orgId: string): AiRecommendation[] {
        const now = new Date().toISOString();
        return [
            {
                id: uid("ai"),
                organizationId: orgId,
                entityType: "lead",
                recommendationType: "follow_up",
                title: "Follow up on high-score leads",
                description: "3 leads scored above 70 have no activity in 48 hours. Schedule qualification calls.",
                priority: "high",
                status: "pending",
                requiresApproval: false,
                createdAt: now,
            },
            {
                id: uid("ai"),
                organizationId: orgId,
                entityType: "proposal",
                recommendationType: "approval",
                title: "Proposal pending review",
                description: "Draft proposals awaiting manager approval before client send.",
                priority: "medium",
                status: "pending",
                requiresApproval: true,
                createdAt: now,
            },
            {
                id: uid("ai"),
                organizationId: orgId,
                entityType: "client",
                recommendationType: "renewal",
                title: "Renewal opportunity detected",
                description: "Clients approaching contract end — initiate renewal consultation.",
                priority: "medium",
                status: "pending",
                requiresApproval: true,
                createdAt: now,
            },
        ];
    }

    async scheduleConsultation(ctx: BusinessPlatformContext, input: CreateConsultationInput): Promise<ConsultationRecord> {
        const orgId = await this.getOrgId(ctx);
        let record: ConsultationRecord | null = null;

        if (orgId) {
            record = await businessPlatformRepository.createConsultation(orgId, input);
        }

        if (!record) {
            const now = new Date().toISOString();
            record = {
                id: uid("consult"),
                organizationId: orgId ?? "local",
                leadId: input.leadId ?? null,
                clientId: input.clientId ?? null,
                title: input.title,
                scheduledAt: input.scheduledAt,
                durationMinutes: input.durationMinutes ?? 30,
                status: "scheduled",
                assignedTo: input.assignedTo ?? null,
                meetingNotes: "",
                requirements: input.requirements ?? "",
                aiSummary: "",
                source: "business_platform",
                createdAt: now,
                updatedAt: now,
            };
            const state = loadState();
            state.consultations = [record, ...state.consultations];
            saveState(state);
        }

        await scheduleConsultationViaMissionCore({ ...ctx, organizationId: orgId, payload: { consultationId: record.id, title: input.title } });
        publishBusinessPlatformEvent("ConsultationScheduled", { consultationId: record.id });
        this.recordLifecycleEvent(ctx, "consultation", record.id, "consultation", "scheduled", `Consultation scheduled: ${input.title}`);
        return record;
    }

    async createProposal(ctx: BusinessPlatformContext, input: CreateProposalInput): Promise<ProposalRecord> {
        const orgId = await this.getOrgId(ctx);
        let record: ProposalRecord | null = null;

        if (orgId) {
            record = await businessPlatformRepository.createProposal(orgId, input);
        }

        if (!record) {
            const now = new Date().toISOString();
            record = {
                id: uid("prop"),
                organizationId: orgId ?? "local",
                leadId: input.leadId ?? null,
                clientId: input.clientId ?? null,
                opportunityId: input.opportunityId ?? null,
                title: input.title,
                status: "draft",
                version: 1,
                totalAmount: input.totalAmount,
                sourceType: "business_platform",
                sourceId: "",
                documentRef: `PROP-${Date.now()}`,
                approvalStatus: "pending",
                validUntil: input.validUntil ?? null,
                createdAt: now,
                updatedAt: now,
            };
            const state = loadState();
            state.proposals = [record, ...state.proposals];
            saveState(state);
        }

        await generateProposalViaMissionCore({ ...ctx, organizationId: orgId, payload: { proposalId: record.id, clientId: input.clientId } });
        publishBusinessPlatformEvent("ProposalCreated", { proposalId: record.id });
        this.recordLifecycleEvent(ctx, "proposal", record.id, "proposal", "created", `Proposal draft: ${input.title}`);
        return record;
    }

    async approveAiRecommendation(ctx: BusinessPlatformContext, recommendationId: string): Promise<void> {
        const state = loadState();
        state.aiRecommendations = state.aiRecommendations.map((r) =>
            r.id === recommendationId ? { ...r, status: "approved" as const } : r,
        );
        saveState(state);
        publishBusinessPlatformEvent("AiRecommendationApproved", { recommendationId });
    }

    async dismissAiRecommendation(ctx: BusinessPlatformContext, recommendationId: string): Promise<void> {
        const state = loadState();
        state.aiRecommendations = state.aiRecommendations.map((r) =>
            r.id === recommendationId ? { ...r, status: "dismissed" as const } : r,
        );
        saveState(state);
    }

    async convertLeadToClient(ctx: BusinessPlatformContext, leadId: string, clientName: string): Promise<void> {
        await createLead(ctx.authUserId, ctx.email, { leadName: clientName, companyName: clientName, email: ctx.email, source: "converted" }, ctx.fullName);
        publishBusinessPlatformEvent("LeadConverted", { leadId, clientName });
        this.recordLifecycleEvent(ctx, "lead", leadId, "client", "converted", `Lead converted to client: ${clientName}`);
    }

    async provisionPortalForClient(ctx: BusinessPlatformContext, clientId: string): Promise<void> {
        await provisionClientPortal({ ...ctx, payload: { clientId } });
        this.recordLifecycleEvent(ctx, "client", clientId, "client", "portal_provisioned", "Client portal provisioned");
    }

    async startProjectForClient(ctx: BusinessPlatformContext, clientId: string, clientName: string): Promise<void> {
        await createProjectViaMissionCore({ ...ctx, payload: { clientId, clientName, projectName: `${clientName} — Implementation` } });
        await createProject(ctx.authUserId, ctx.email, { name: `${clientName} — Implementation`, clientId, clientName }, ctx.fullName);
        this.recordLifecycleEvent(ctx, "client", clientId, "project", "created", `Project started for ${clientName}`);
    }

    async getTeamSummaries(ctx: BusinessPlatformContext): Promise<TeamMemberSummary[]> {
        const [employees, teams, projects] = await Promise.all([
            fetchEmployees(ctx.authUserId, ctx.email, ctx.fullName),
            fetchTeams(ctx.authUserId, ctx.email, ctx.fullName),
            fetchProjects(ctx.authUserId, ctx.email, ctx.fullName),
        ]);

        return employees.slice(0, 20).map((emp) => ({
            id: emp.id,
            name: `${emp.first_name} ${emp.last_name}`.trim(),
            role: emp.designation_id ?? "Team Member",
            department: emp.department_id ?? "General",
            capacity: 40,
            activeAssignments: projects.filter((p) => p.status === "active").length % 5,
        }));
    }

    async getClientPortalSummaries(ctx: BusinessPlatformContext): Promise<ClientPortalSummary[]> {
        const [clients, projects, invoices] = await Promise.all([
            fetchActiveClients(ctx.authUserId, ctx.email, ctx.fullName),
            fetchProjects(ctx.authUserId, ctx.email, ctx.fullName),
            fetchInvoices(ctx.authUserId, ctx.email, ctx.fullName),
        ]);

        return clients.slice(0, 10).map((client) => ({
            clientId: client.id,
            clientName: client.name,
            projectsCount: projects.filter((p) => p.clientName === client.name).length,
            openInvoices: invoices.filter((i) => i.clientId === client.id && i.status !== "paid" && i.status !== "void").length,
            pendingApprovals: 0,
            lastActivity: client.updated_at ?? client.created_at ?? new Date().toISOString(),
        }));
    }

    async getAnalyticsOverview(ctx: BusinessPlatformContext) {
        const [metrics, salesStats, financeStats, opportunities, quotes] = await Promise.all([
            fetchAnalyticsMetrics(ctx.authUserId, ctx.email, ctx.fullName),
            fetchSalesStats(ctx.authUserId, ctx.email, ctx.fullName),
            fetchFinanceStats(ctx.authUserId, ctx.email, ctx.fullName),
            fetchOpportunities(ctx.authUserId, ctx.email, ctx.fullName),
            fetchQuotes(ctx.authUserId, ctx.email, ctx.fullName),
        ]);

        return { metrics, salesStats, financeStats, opportunities, quotes };
    }

    async getSettingsOverview(ctx: BusinessPlatformContext) {
        const [settings, apiKeys, teams, clients] = await Promise.all([
            fetchOrganizationSettings(ctx.authUserId, ctx.email, ctx.fullName),
            fetchApiKeys(ctx.authUserId, ctx.email, ctx.fullName),
            fetchTeams(ctx.authUserId, ctx.email, ctx.fullName),
            fetchClients(ctx.authUserId, ctx.email, ctx.fullName),
        ]);
        return { settings, apiKeys, teams, clients };
    }

    private recordLifecycleEvent(
        ctx: BusinessPlatformContext,
        entityType: string,
        entityId: string,
        stage: LifecycleStage,
        eventType: string,
        notes: string,
    ) {
        const event: LifecycleEvent = {
            id: uid("evt"),
            organizationId: ctx.organizationId ?? "local",
            entityType,
            entityId,
            stage,
            eventType,
            notes,
            createdAt: new Date().toISOString(),
        };
        const state = loadState();
        state.lifecycleEvents = [event, ...state.lifecycleEvents].slice(0, 100);
        saveState(state);
    }
}

export const businessPlatformService = new BusinessPlatformService();
