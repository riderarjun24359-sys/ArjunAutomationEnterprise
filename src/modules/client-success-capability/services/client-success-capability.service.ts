import { AI_DELIVERY_LEVELS } from "@/src/constants/ai-delivery-model";
import { executeClientSuccessWorkflow } from "../integrations/mission-core-bridge";
import {
    buildLocalizedPortalContent,
    buildLocalizedNotification,
    resolveClientLocale,
    setClientPreferredLanguage,
} from "../integrations/gci-bridge";
import { fetchClientDetail, fetchClients, fetchDeals } from "../integrations/crm-bridge";
import { getBusinessDocumentPaths, getServiceCatalogItems } from "../integrations/business-assets-bridge";
import { analyzeClientRequirements, analyzeChangeRequestImpact } from "../integrations/ai-brain-bridge";
import { sendClientNotification } from "../integrations/notification-bridge";
import { logClientSuccessAudit } from "../integrations/audit-bridge";
import {
    createLocalProjectWorkspace,
    fetchClientProjects,
    fetchProjectMilestones,
} from "../integrations/projects-bridge";
import type {
    AiSuccessManagerInsights,
    ApprovalCenterData,
    ChangeRequestInput,
    ChangeRequestResult,
    ClientPortalData,
    ClientSuccessServiceContext,
    ClientSuccessState,
    CommunicationCenterData,
    CustomerHealthData,
    DeliveryCenterData,
    OnboardingProfile,
    ProjectWorkspace,
    RenewalGrowthData,
} from "../types";

function uid(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function buildDefaultClientSuccessState(): ClientSuccessState {
    return {
        selectedClientId: null,
        clientLocales: {},
        onboarding: {},
        workspaces: {},
        portalData: {},
        communication: {},
        approvals: {},
        changeRequests: [],
        delivery: {},
        health: {},
        renewal: {},
        insights: {},
        auditLog: [],
        updatedAt: new Date().toISOString(),
    };
}

export class ClientSuccessCapabilityService {
    async runAiOnboarding(
        ctx: ClientSuccessServiceContext,
        clientId: string,
        state: ClientSuccessState,
    ): Promise<{ state: ClientSuccessState; profile: OnboardingProfile }> {
        const client = await fetchClientDetail(ctx.authUserId, ctx.email, clientId, ctx.fullName);
        const deals = await fetchDeals(ctx.authUserId, ctx.email, ctx.fullName);
        const clientDeals = deals.filter((d) => d.client === client?.name || d.client.includes(client?.name ?? ""));

        const requirements = [
            client?.name ? `Enterprise platform for ${client.name}` : "Platform implementation",
            ...clientDeals.map((d) => `Deal scope: ${d.client} — ${d.stage}`),
            ...getServiceCatalogItems().slice(0, 2).map((s) => s.overview),
        ];

        const aiResult = await analyzeClientRequirements(
            ctx.authUserId,
            ctx.email,
            clientId,
            requirements,
            ctx.fullName,
        );

        executeClientSuccessWorkflow("run-onboarding", { clientId });

        const profile: OnboardingProfile = {
            clientId,
            requirements,
            stakeholders: [
                { id: "sh1", name: client?.name ?? "Primary Contact", role: "Decision Maker", email: client?.contactEmail ?? "", influence: "high" },
                { id: "sh2", name: "Technical Lead", role: "Technical Stakeholder", email: "", influence: "medium" },
                { id: "sh3", name: "Operations Manager", role: "End User Champion", email: "", influence: "medium" },
            ],
            goals: [
                { id: "g1", title: "Platform Adoption", metric: "Active Users", target: "80%", current: "0%", status: "on-track" },
                { id: "g2", title: "Time to Value", metric: "First Version", target: "AI-accelerated", current: "Pending", status: "on-track" },
                { id: "g3", title: "Customer Satisfaction", metric: "CSAT", target: "4.5/5", current: "N/A", status: "on-track" },
            ],
            metrics: [
                { name: "Health Score", value: 75, unit: "score" },
                { name: "Engagement", value: 0, unit: "%" },
                { name: "Open Tasks", value: 4, unit: "tasks" },
            ],
            checklist: AI_DELIVERY_LEVELS.map((level) => ({
                id: `cl-${level.level}`,
                label: level.title,
                completed: level.level === 1,
                deliveryLevel: level.level,
            })),
            aiAnalysis: aiResult.analysis,
            deliveryLevels: AI_DELIVERY_LEVELS,
            completedAt: new Date().toISOString(),
        };

        const audit = await logClientSuccessAudit(ctx.authUserId, ctx.email, {
            action: "run_ai_onboarding",
            clientId,
            details: { requirements: requirements.length, recommendations: aiResult.recommendations },
        }, ctx.fullName);

        await sendClientNotification(ctx.authUserId, ctx.email, clientId, "Onboarding Complete", aiResult.analysis, ctx.fullName);

        const nextState: ClientSuccessState = {
            ...state,
            onboarding: { ...state.onboarding, [clientId]: profile },
            auditLog: [audit, ...state.auditLog].slice(0, 100),
            updatedAt: new Date().toISOString(),
        };

        return { state: nextState, profile };
    }

    async provisionProjectWorkspace(
        ctx: ClientSuccessServiceContext,
        clientId: string,
        state: ClientSuccessState,
    ): Promise<{ state: ClientSuccessState; workspace: ProjectWorkspace }> {
        const client = await fetchClientDetail(ctx.authUserId, ctx.email, clientId, ctx.fullName);
        const existingProjects = await fetchClientProjects(ctx.authUserId, ctx.email, ctx.fullName);
        const matched = existingProjects.find((p) => p.name.toLowerCase().includes(client?.name?.toLowerCase() ?? ""));

        executeClientSuccessWorkflow("provision-workspace", { clientId });

        const local = createLocalProjectWorkspace(clientId, client?.name ?? "Client");
        if (matched) {
            const milestones = await fetchProjectMilestones(matched.id);
            if (milestones.length > 0) {
                local.milestones = milestones.map((m) => ({
                    id: m.id,
                    name: m.title,
                    status: m.status,
                    dueDate: m.dueDate ?? new Date().toISOString().slice(0, 10),
                }));
            }
            local.projectId = matched.id;
            local.projectName = matched.name;
        }

        const docPaths = getBusinessDocumentPaths();
        const workspace: ProjectWorkspace = {
            clientId,
            projectId: local.projectId,
            projectName: local.projectName,
            milestones: local.milestones,
            tasks: local.tasks,
            deliverables: local.deliverables,
            team: local.team,
            documents: docPaths.length > 0
                ? docPaths.map((d) => ({ id: uid("doc"), title: d.title, path: d.path }))
                : [{ id: "doc-sow", title: "Statement of Work", path: "/business-assets" }],
        };

        const audit = await logClientSuccessAudit(ctx.authUserId, ctx.email, {
            action: "provision_project_workspace",
            clientId,
            details: { projectId: workspace.projectId, milestones: workspace.milestones.length },
        }, ctx.fullName);

        const nextState: ClientSuccessState = {
            ...state,
            workspaces: { ...state.workspaces, [clientId]: workspace },
            auditLog: [audit, ...state.auditLog].slice(0, 100),
            updatedAt: new Date().toISOString(),
        };

        return { state: nextState, workspace };
    }

    getClientPortalData(clientId: string, state: ClientSuccessState): ClientPortalData {
        const locale = state.clientLocales[clientId] ?? resolveClientLocale(clientId);
        const portal = buildLocalizedPortalContent(clientId, locale);
        const workspace = state.workspaces[clientId];
        const onboarding = state.onboarding[clientId];

        return {
            clientId,
            locale,
            dashboard: {
                progress: onboarding ? onboarding.checklist.filter((c) => c.completed).length * 20 : 20,
                activeMilestones: workspace?.milestones.filter((m) => m.status === "in-progress").length ?? 1,
                openApprovals: state.approvals[clientId]?.pending.length ?? 2,
            },
            files: workspace?.documents.map((d) => ({ id: d.id, name: d.title, type: "document", updatedAt: new Date().toISOString() })) ?? [],
            invoices: [{ id: "inv1", number: "AA-INV-001", amount: 50000, status: "pending" }],
            docs: portal.documents.map((d, i) => ({ id: `doc-${i}`, title: d.title, category: "portal" })),
            approvals: (state.approvals[clientId]?.pending ?? []).map((a) => ({
                id: a.id, title: a.title, status: a.status, dueDate: a.requestedAt,
            })),
            meetings: [{ id: "mtg1", title: "Kickoff Session", date: new Date().toISOString(), summary: "AI-first delivery approach aligned" }],
            support: [{ id: "sup1", subject: "Portal Access", status: "open", priority: "normal" }],
            knowledgeBase: portal.documents.map((d, i) => ({ id: `kb-${i}`, title: d.title, category: "onboarding" })),
        };
    }

    getCommunicationCenter(clientId: string, state: ClientSuccessState): CommunicationCenterData {
        const locale = state.clientLocales[clientId] ?? resolveClientLocale(clientId);
        const notif = buildLocalizedNotification("Project Update", "Your delivery milestone is ready for review.", locale);

        return state.communication[clientId] ?? {
            clientId,
            emails: [
                { id: "em1", subject: notif.title, date: new Date().toISOString(), direction: "outbound", summary: notif.message },
                { id: "em2", subject: "Welcome to Arjun Automation", date: new Date(Date.now() - 86400000).toISOString(), direction: "outbound", summary: "AI-first onboarding initiated" },
            ],
            meetings: [
                { id: "mtg1", title: "Discovery Session", date: new Date().toISOString(), aiSummary: "Requirements captured and mapped to AI delivery levels" },
            ],
            aiSummaries: [
                { id: "sum1", topic: "Weekly Progress", summary: "Onboarding 40% complete. Next: solution generation.", generatedAt: new Date().toISOString() },
            ],
            reminders: [
                { id: "rem1", message: "Review onboarding profile", dueDate: new Date(Date.now() + 172800000).toISOString(), sent: false },
            ],
        };
    }

    getApprovalCenter(clientId: string, state: ClientSuccessState): ApprovalCenterData {
        if (state.approvals[clientId]) return state.approvals[clientId];

        const defaults: ApprovalCenterData = {
            clientId,
            pending: [
                { id: "ap1", type: "requirements", title: "Requirements Sign-off", status: "pending", requestedAt: new Date().toISOString() },
                { id: "ap2", type: "design", title: "Solution Design Review", status: "pending", requestedAt: new Date().toISOString() },
            ],
            history: [
                { id: "ap0", type: "document", title: "NDA Signed", status: "approved", requestedAt: new Date(Date.now() - 604800000).toISOString(), decidedAt: new Date(Date.now() - 518400000).toISOString(), decidedBy: "Client" },
            ],
        };
        return defaults;
    }

    async submitChangeRequest(
        ctx: ClientSuccessServiceContext,
        input: ChangeRequestInput,
        state: ClientSuccessState,
    ): Promise<{ state: ClientSuccessState; result: ChangeRequestResult }> {
        const impact = await analyzeChangeRequestImpact(ctx.authUserId, ctx.email, input.title, input.description, ctx.fullName);

        const result: ChangeRequestResult = {
            id: uid("cr"),
            clientId: input.clientId,
            title: input.title,
            impactAnalysis: impact,
            approvalWorkflow: [
                { step: "AI Impact Analysis", status: "completed" },
                { step: "Business Review", status: "pending" },
                { step: "Client Approval", status: "pending" },
                { step: "Implementation", status: "pending" },
            ],
            status: "under-review",
        };

        const audit = await logClientSuccessAudit(ctx.authUserId, ctx.email, {
            action: "submit_change_request",
            clientId: input.clientId,
            details: { changeRequestId: result.id, priority: input.priority },
        }, ctx.fullName);

        const nextState: ClientSuccessState = {
            ...state,
            changeRequests: [result, ...state.changeRequests],
            auditLog: [audit, ...state.auditLog].slice(0, 100),
            updatedAt: new Date().toISOString(),
        };

        return { state: nextState, result };
    }

    getDeliveryCenter(clientId: string, state: ClientSuccessState): DeliveryCenterData {
        if (state.delivery[clientId]) return state.delivery[clientId];

        return {
            clientId,
            qaChecklist: AI_DELIVERY_LEVELS.slice(2, 4).map((l, i) => ({
                id: `qa-${i}`,
                item: l.title,
                completed: false,
                deliveryLevel: l.level,
            })),
            deploymentChecklist: [
                { id: "dep1", item: "Security review passed", completed: false },
                { id: "dep2", item: "Production environment provisioned", completed: false },
                { id: "dep3", item: "Monitoring configured", completed: false },
                { id: "dep4", item: "Documentation delivered", completed: false },
            ],
            training: [
                { id: "tr1", module: "Platform Overview", completed: false },
                { id: "tr2", module: "Admin Configuration", completed: false },
                { id: "tr3", module: "End User Workflows", completed: false },
            ],
            docs: getBusinessDocumentPaths().map((d, i) => ({ id: `dd-${i}`, title: d.title, status: "ready" })),
            handover: [
                { item: "Production access credentials", status: "pending", owner: "DevOps" },
                { item: "Support SLA agreement", status: "pending", owner: "CS Lead" },
                { item: "Knowledge base articles", status: "in-progress", owner: "AI Success Manager" },
            ],
        };
    }

    getCustomerHealth(clientId: string, state: ClientSuccessState): CustomerHealthData {
        if (state.health[clientId]) return state.health[clientId];

        const onboarding = state.onboarding[clientId];
        const checklistProgress = onboarding
            ? (onboarding.checklist.filter((c) => c.completed).length / onboarding.checklist.length) * 100
            : 20;

        return {
            clientId,
            healthScore: Math.round(60 + checklistProgress * 0.3),
            csat: 4.2,
            engagement: Math.round(checklistProgress),
            renewalProbability: 78,
            riskAlerts: checklistProgress < 40
                ? [{ id: "risk1", severity: "medium", message: "Onboarding progress below target — schedule check-in" }]
                : [],
            trends: [
                { metric: "Health Score", direction: "up", value: 5 },
                { metric: "Engagement", direction: "stable", value: 0 },
                { metric: "Support Tickets", direction: "down", value: -2 },
            ],
        };
    }

    getRenewalGrowth(clientId: string, state: ClientSuccessState): RenewalGrowthData {
        if (state.renewal[clientId]) return state.renewal[clientId];

        return {
            clientId,
            renewals: [{ id: "ren1", contractEnd: new Date(Date.now() + 31536000000).toISOString().slice(0, 10), value: 120000, probability: 78 }],
            upsell: [{ id: "up1", opportunity: "AI Worker Integration", value: 45000, stage: "discovery" }],
            crossSell: [{ id: "cs1", product: "Industry Pack Deployment", fit: 85, stage: "qualified" }],
            referrals: [{ id: "ref1", contact: "Partner Organization", status: "identified" }],
            testimonials: [{ id: "test1", quote: "AI-first delivery exceeded our expectations.", author: "Client Executive", published: false }],
        };
    }

    getAiSuccessManagerInsights(clientId: string, state: ClientSuccessState): AiSuccessManagerInsights {
        if (state.insights[clientId]) return state.insights[clientId];

        const health = this.getCustomerHealth(clientId, state);
        const workspace = state.workspaces[clientId];

        return {
            clientId,
            nextActions: [
                { id: "na1", action: "Complete AI requirement analysis session", priority: "high", dueDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10) },
                { id: "na2", action: "Schedule stakeholder alignment meeting", priority: "medium", dueDate: new Date(Date.now() + 259200000).toISOString().slice(0, 10) },
            ],
            projectRisks: workspace
                ? [{ id: "pr1", risk: "Milestone dependency on client approvals", severity: "medium", mitigation: "Proactive approval reminders via communication hub" }]
                : [{ id: "pr2", risk: "Project workspace not yet provisioned", severity: "high", mitigation: "Run workspace provisioning workflow" }],
            customerRisks: health.riskAlerts.map((a) => ({
                id: a.id, risk: a.message, severity: a.severity, mitigation: "Schedule CS check-in and review onboarding progress",
            })),
            improvements: [
                { id: "imp1", area: "Onboarding", recommendation: "Enable multilingual portal for global stakeholders" },
                { id: "imp2", area: "Delivery", recommendation: "Automate QA checklist with AI delivery level gates" },
            ],
            automationOps: [
                { id: "ao1", workflow: "Health Score Monitoring", status: "active", savings: "4 hrs/week" },
                { id: "ao2", workflow: "Approval Reminders", status: "active", savings: "2 hrs/week" },
            ],
        };
    }

    setClientLanguage(clientId: string, locale: Parameters<typeof setClientPreferredLanguage>[1], state: ClientSuccessState): ClientSuccessState {
        setClientPreferredLanguage(clientId, locale);
        return {
            ...state,
            clientLocales: { ...state.clientLocales, [clientId]: locale },
            updatedAt: new Date().toISOString(),
        };
    }

    async loadClients(ctx: ClientSuccessServiceContext) {
        return fetchClients(ctx.authUserId, ctx.email, ctx.fullName);
    }
}

export const clientSuccessCapabilityService = new ClientSuccessCapabilityService();
