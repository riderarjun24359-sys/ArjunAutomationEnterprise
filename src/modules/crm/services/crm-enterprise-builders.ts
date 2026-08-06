import type { CrmPlatformRawData } from "./crm-platform-data.service";
import type {
    ClientProfileBundle,
    CommunicationItem,
    CrmAnalyticsBundle,
    CrmEnterpriseSnapshot,
    CrmEnterpriseStats,
    DirectoryClient,
    DirectoryClientStatus,
    DirectoryQuery,
    DirectoryResult,
    LeadKanbanColumn,
    LeadPipelineStage,
    PipelineLead,
    AiCrmInsight,
} from "../types/enterprise";

const LEAD_STAGES: Array<{ stage: LeadPipelineStage; label: string }> = [
    { stage: "new", label: "New" },
    { stage: "contacted", label: "Contacted" },
    { stage: "qualified", label: "Qualified" },
    { stage: "proposal", label: "Proposal" },
    { stage: "negotiation", label: "Negotiation" },
    { stage: "won", label: "Won" },
    { stage: "lost", label: "Lost" },
];

export function parseMoney(value: string | number | null | undefined): number {
    if (typeof value === "number") return Number.isFinite(value) ? value : 0;
    if (!value) return 0;
    const n = Number(String(value).replace(/[^0-9.-]/g, ""));
    return Number.isFinite(n) ? n : 0;
}

export function formatCurrency(amount: number, currency = "USD"): string {
    try {
        return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
    } catch {
        return `$${Math.round(amount).toLocaleString()}`;
    }
}

export function formatRelativeTime(iso: string, nowMs = Date.now()): string {
    const minutes = Math.floor((nowMs - new Date(iso).getTime()) / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hr ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days === 1 ? "" : "s"} ago`;
}

function normalizeStatus(raw: string, lifecycle: string): DirectoryClientStatus {
    const s = raw.toLowerCase();
    const life = lifecycle.toLowerCase();
    if (life === "lead" || s === "lead") return "lead";
    if (s === "at_risk" || s === "at-risk") return "at_risk";
    if (s === "inactive" || s === "churned") return "inactive";
    if (s === "active" || life === "client") return "active";
    return "other";
}

function buildTags(client: { industry: string; status: string; lifecycle_stage: string }): string[] {
    const tags = new Set<string>();
    if (client.industry) tags.add(client.industry.toLowerCase());
    if (client.status) tags.add(client.status.toLowerCase());
    if (client.lifecycle_stage) tags.add(client.lifecycle_stage.toLowerCase());
    return [...tags];
}

export function mapDirectoryClient(client: CrmPlatformRawData["clients"][number]): DirectoryClient {
    const revenue = parseMoney(client.revenue);
    return {
        id: client.id,
        name: client.name,
        status: normalizeStatus(client.status, client.lifecycle_stage),
        rawStatus: client.status,
        industry: client.industry || "general",
        owner: client.manager_name || client.assigned_to || "Unassigned",
        companyProfile: client.description || `${client.name} · ${client.industry || "Company"}`,
        contactEmail: client.contact_email,
        phone: client.phone ?? "",
        website: client.website ?? "",
        address: client.address ?? "",
        revenue,
        revenueLabel: formatCurrency(revenue),
        tags: buildTags(client),
        lifecycleStage: client.lifecycle_stage,
        updatedAt: client.updated_at,
        createdAt: client.created_at,
    };
}

export function queryDirectory(clients: DirectoryClient[], query: DirectoryQuery): DirectoryResult {
    const search = query.search.trim().toLowerCase();
    let filtered = clients;

    if (search) {
        filtered = filtered.filter(
            (c) =>
                c.name.toLowerCase().includes(search) ||
                c.contactEmail.toLowerCase().includes(search) ||
                c.owner.toLowerCase().includes(search) ||
                c.companyProfile.toLowerCase().includes(search) ||
                c.tags.some((t) => t.includes(search)),
        );
    }
    if (query.status && query.status !== "all") {
        filtered = filtered.filter((c) => c.status === query.status || c.rawStatus === query.status);
    }
    if (query.owner && query.owner !== "all") {
        filtered = filtered.filter((c) => c.owner === query.owner);
    }
    if (query.tag && query.tag !== "all") {
        filtered = filtered.filter((c) => c.tags.includes(query.tag.toLowerCase()));
    }

    const pageSize = Math.max(1, query.pageSize);
    const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
    const page = Math.min(Math.max(1, query.page), pageCount);
    const start = (page - 1) * pageSize;

    return {
        items: filtered.slice(start, start + pageSize),
        total: filtered.length,
        page,
        pageSize,
        pageCount,
        owners: [...new Set(clients.map((c) => c.owner))].sort(),
        tags: [...new Set(clients.flatMap((c) => c.tags))].sort(),
        statuses: [...new Set(clients.map((c) => c.status))].sort(),
    };
}

export function normalizeLeadStage(raw: string): LeadPipelineStage {
    const s = raw.toLowerCase().replace(/[\s-]+/g, "_");
    if (["new", "open", "inbound"].includes(s)) return "new";
    if (["contacted", "outreach", "attempted"].includes(s)) return "contacted";
    if (["qualified", "qualification", "mql", "sql"].includes(s)) return "qualified";
    if (["proposal", "quote", "pitched"].includes(s)) return "proposal";
    if (["negotiation", "negotiate", "contract"].includes(s)) return "negotiation";
    if (["won", "closed_won", "converted", "client"].includes(s)) return "won";
    if (["lost", "closed_lost", "disqualified"].includes(s)) return "lost";
    return "new";
}

export function buildPipelineLeads(data: CrmPlatformRawData): PipelineLead[] {
    const fromSales = data.salesLeads.map((lead) => ({
        id: lead.id,
        name: lead.lead_name,
        company: lead.company_name,
        email: lead.email,
        phone: lead.phone,
        stage: normalizeLeadStage(lead.status),
        score: Number(lead.score ?? 0),
        source: lead.source || "unknown",
        owner: lead.assigned_to || "Unassigned",
        value: 0,
        valueLabel: formatCurrency(0),
        origin: "sales_lead" as const,
        updatedAt: lead.updated_at,
    }));

    const salesIds = new Set(fromSales.map((l) => l.email.toLowerCase()));
    const fromCrm = data.leadsCrm
        .filter((c) => !salesIds.has(c.contact_email.toLowerCase()))
        .map((lead) => {
            const value = parseMoney(lead.deal_value);
            return {
                id: lead.id,
                name: lead.name,
                company: lead.name,
                email: lead.contact_email,
                phone: lead.phone ?? "",
                stage: normalizeLeadStage(lead.lifecycle_stage || lead.status),
                score: Number(lead.lead_score ?? 0),
                source: lead.industry || "crm",
                owner: lead.assigned_to || lead.manager_name || "Unassigned",
                value,
                valueLabel: formatCurrency(value),
                origin: "crm_lead" as const,
                updatedAt: lead.updated_at,
            };
        });

    return [...fromSales, ...fromCrm].sort((a, b) => b.score - a.score);
}

export function buildLeadKanban(leads: PipelineLead[]): LeadKanbanColumn[] {
    return LEAD_STAGES.map(({ stage, label }) => ({
        stage,
        label,
        leads: leads.filter((l) => l.stage === stage),
    }));
}

export function buildClientProfile(data: CrmPlatformRawData, clientId: string): ClientProfileBundle | null {
    const raw = data.clients.find((c) => c.id === clientId);
    if (!raw) return null;
    const client = mapDirectoryClient(raw);

    const timeline = data.activities
        .filter((a) => a.entity_id === clientId || a.detail.toLowerCase().includes(client.name.toLowerCase()))
        .slice(0, 20)
        .map((a) => ({
            id: a.id,
            title: a.title,
            detail: a.detail,
            time: formatRelativeTime(a.created_at),
            kind: a.entity_type,
        }));

    const notes = data.activities
        .filter(
            (a) =>
                (a.action === "note" || a.entity_type === "note" || a.action === "comment") &&
                (a.entity_id === clientId || a.detail.toLowerCase().includes(client.name.toLowerCase())),
        )
        .map((a) => ({
            id: a.id,
            title: a.title,
            detail: a.detail,
            time: formatRelativeTime(a.created_at),
        }));

    const files = data.documents
        .filter((d) => d.client_id === clientId || d.file_name.toLowerCase().includes(client.name.toLowerCase()) || d.title.toLowerCase().includes(client.name.toLowerCase()))
        .slice(0, 20)
        .map((d) => ({
            id: d.id,
            name: d.title || d.file_name,
            detail: `${d.mime_type || "file"} · v${d.current_version}`,
            updatedAt: formatRelativeTime(d.updated_at),
        }));

    const contacts = data.contacts
        .filter((c) => c.company_id === raw.company_id || (raw.primary_contact_id && c.id === raw.primary_contact_id))
        .map((c) => ({
            id: c.id,
            name: [c.first_name, c.last_name].filter(Boolean).join(" "),
            email: c.email ?? "",
            phone: c.phone ?? "",
            title: c.title ?? "",
        }));

    const clientProjects = data.projects.filter((p) => p.client_id === clientId || p.client_name === client.name);
    const projectIds = new Set(clientProjects.map((p) => p.id));

    const meetings = data.meetings.slice(0, 20).map((m) => ({
        id: m.id,
        title: m.title,
        when: formatRelativeTime(m.scheduled_at),
        status: m.status,
        location: m.location || m.meeting_url || "",
    }));

    const tasks = data.tasks
        .filter((t) => (t.project_id ? projectIds.has(t.project_id) : false))
        .slice(0, 30)
        .map((t) => ({
            id: t.id,
            title: t.title,
            status: t.status,
            priority: t.priority,
            dueDate: t.due_date ? formatRelativeTime(t.due_date) : "—",
        }));

    const invoices = data.invoices.filter((inv) => inv.client_id === clientId);
    const payments = data.payments.filter((p) => p.client_id === clientId);
    const collected = Math.max(
        payments.reduce((s, p) => s + Number(p.amount ?? 0), 0),
        invoices.reduce((s, i) => s + Number(i.amount_paid ?? 0), 0),
        client.revenue,
    );
    const outstanding = invoices.reduce(
        (s, i) => s + Math.max(0, Number(i.total ?? 0) - Number(i.amount_paid ?? 0)),
        0,
    );

    return {
        client,
        timeline,
        notes,
        files,
        contacts,
        meetings,
        tasks,
        projects: clientProjects.map((p) => ({
            id: p.id,
            name: p.name,
            status: p.status,
            progress: Number(p.progress ?? 0),
        })),
        revenue: {
            collected,
            outstanding,
            invoiceCount: invoices.length,
            label: formatCurrency(collected),
            detail: `${invoices.length} invoices · ${formatCurrency(outstanding)} outstanding`,
        },
    };
}

export function buildCommunications(data: CrmPlatformRawData): CommunicationItem[] {
    const items: CommunicationItem[] = [
        ...data.emails.map((e) => ({
            id: `email-${e.id}`,
            channel: "email" as const,
            title: e.subject || "Email",
            detail: e.status || "logged",
            actor: e.recipient_email || "Sales",
            occurredAt: e.sent_at || e.created_at,
            relativeTime: formatRelativeTime(e.sent_at || e.created_at),
        })),
        ...data.calls.map((c) => ({
            id: `call-${c.id}`,
            channel: "call" as const,
            title: c.outcome || "Call",
            detail: `${c.direction || "outbound"} · ${c.duration_seconds ?? 0}s · ${c.notes || ""}`.trim(),
            actor: c.phone_number || "Sales",
            occurredAt: c.called_at || c.created_at,
            relativeTime: formatRelativeTime(c.called_at || c.created_at),
        })),
        ...data.meetings.map((m) => ({
            id: `meet-${m.id}`,
            channel: "meeting" as const,
            title: m.title,
            detail: m.status,
            actor: m.attendee_names || "Team",
            occurredAt: m.scheduled_at,
            relativeTime: formatRelativeTime(m.scheduled_at),
        })),
        ...data.salesActivities
            .filter((a) => /whatsapp|wa\b/i.test(`${a.activity_type} ${a.subject} ${a.description}`))
            .map((a) => ({
                id: `wa-${a.id}`,
                channel: "whatsapp" as const,
                title: a.subject || "WhatsApp",
                detail: a.description || a.activity_type,
                actor: a.assigned_to || "Sales",
                occurredAt: a.created_at,
                relativeTime: formatRelativeTime(a.created_at),
            })),
        ...data.activities
            .filter((a) => a.action === "comment" || a.entity_type === "comment" || a.action === "note")
            .map((a) => ({
                id: `cmt-${a.id}`,
                channel: "comment" as const,
                title: a.title || "Internal comment",
                detail: a.detail,
                actor: "Internal",
                occurredAt: a.created_at,
                relativeTime: formatRelativeTime(a.created_at),
            })),
    ];

    return items.sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime()).slice(0, 80);
}

export function buildCrmAnalytics(data: CrmPlatformRawData, leads: PipelineLead[], directory: DirectoryClient[]): CrmAnalyticsBundle {
    const funnel = LEAD_STAGES.map(({ stage, label }) => ({
        stage: label,
        count: leads.filter((l) => l.stage === stage).length,
    }));

    const won = data.winLoss.filter((w) => w.outcome.toLowerCase().includes("won"));
    const lost = data.winLoss.filter((w) => w.outcome.toLowerCase().includes("lost"));
    const wonAmount = won.reduce((s, w) => s + Number(w.amount ?? 0), 0);
    const lostAmount = lost.reduce((s, w) => s + Number(w.amount ?? 0), 0);
    const decided = won.length + lost.length;

    const collected = Math.max(
        data.payments.reduce((s, p) => s + Number(p.amount ?? 0), 0),
        data.invoices.reduce((s, i) => s + Number(i.amount_paid ?? 0), 0),
        directory.reduce((s, c) => s + c.revenue, 0),
    );
    const outstanding = data.invoices.reduce(
        (s, i) => s + Math.max(0, Number(i.total ?? 0) - Number(i.amount_paid ?? 0)),
        0,
    );

    const owners = new Set([...directory.map((c) => c.owner), ...leads.map((l) => l.owner)]);
    const teamPerformance = [...owners].map((owner) => {
        const clients = directory.filter((c) => c.owner === owner);
        const ownerLeads = leads.filter((l) => l.owner === owner);
        return {
            owner,
            clients: clients.length,
            leads: ownerLeads.length,
            revenue: clients.reduce((s, c) => s + c.revenue, 0),
        };
    }).sort((a, b) => b.revenue - a.revenue);

    return {
        conversionFunnel: funnel,
        winLoss: {
            won: won.length,
            lost: lost.length,
            winRate: decided === 0 ? 0 : Math.round((won.length / decided) * 100),
            wonAmount,
            lostAmount,
        },
        revenue: {
            collected,
            outstanding,
            label: formatCurrency(collected),
        },
        teamPerformance,
    };
}

export function computeClientHealthScore(input: {
    client: DirectoryClient;
    openTasks: number;
    activeProjects: number;
    outstanding: number;
    collected: number;
    recentActivityDays: number | null;
}): number {
    let score = 70;
    if (input.client.status === "at_risk") score -= 25;
    if (input.client.status === "inactive") score -= 35;
    if (input.client.status === "active") score += 10;
    if (input.activeProjects > 0) score += 8;
    if (input.openTasks > 10) score -= 10;
    if (input.outstanding > input.collected * 0.4) score -= 15;
    if (input.recentActivityDays !== null) {
        if (input.recentActivityDays <= 7) score += 8;
        else if (input.recentActivityDays > 45) score -= 20;
        else if (input.recentActivityDays > 21) score -= 10;
    }
    return Math.max(0, Math.min(100, score));
}

export function buildAiCrmInsights(input: {
    directory: DirectoryClient[];
    leads: PipelineLead[];
    data: CrmPlatformRawData;
    analytics: CrmAnalyticsBundle;
}): AiCrmInsight[] {
    const insights: AiCrmInsight[] = [];
    const { directory, leads, data, analytics } = input;

    for (const client of directory.slice(0, 40)) {
        const projects = data.projects.filter((p) => p.client_id === client.id);
        const projectIds = new Set(projects.map((p) => p.id));
        const openTasks = data.tasks.filter((t) => t.project_id && projectIds.has(t.project_id) && !["done", "completed", "cancelled"].includes(t.status.toLowerCase())).length;
        const invoices = data.invoices.filter((i) => i.client_id === client.id);
        const collected = invoices.reduce((s, i) => s + Number(i.amount_paid ?? 0), 0) || client.revenue;
        const outstanding = invoices.reduce((s, i) => s + Math.max(0, Number(i.total ?? 0) - Number(i.amount_paid ?? 0)), 0);
        const lastActivity = data.activities.find((a) => a.entity_id === client.id);
        const recentActivityDays = lastActivity
            ? Math.floor((Date.now() - new Date(lastActivity.created_at).getTime()) / 86400000)
            : null;
        const health = computeClientHealthScore({
            client,
            openTasks,
            activeProjects: projects.filter((p) => !["completed", "cancelled", "archived"].includes(p.status.toLowerCase())).length,
            outstanding,
            collected,
            recentActivityDays,
        });

        if (health < 45) {
            insights.push({
                id: `churn-${client.id}`,
                kind: "churn_risk",
                priority: health < 30 ? "P1" : "P2",
                title: `Churn risk: ${client.name}`,
                detail: `Health score ${health}. Outstanding ${formatCurrency(outstanding)} with ${openTasks} open tasks.`,
                clientId: client.id,
                clientName: client.name,
                healthScore: health,
                actionLabel: "Open client profile",
            });
        } else if (health >= 75 && client.revenue > 0) {
            insights.push({
                id: `upsell-${client.id}`,
                kind: "upsell",
                priority: "P3",
                title: `Upsell opportunity: ${client.name}`,
                detail: `Strong health (${health}). Current revenue ${client.revenueLabel}.`,
                clientId: client.id,
                clientName: client.name,
                healthScore: health,
                actionLabel: "Plan expansion",
            });
        }

        if (recentActivityDays !== null && recentActivityDays > 14) {
            insights.push({
                id: `followup-${client.id}`,
                kind: "follow_up",
                priority: recentActivityDays > 30 ? "P1" : "P2",
                title: `Follow up with ${client.name}`,
                detail: `No CRM activity for ${recentActivityDays} days.`,
                clientId: client.id,
                clientName: client.name,
                healthScore: health,
                actionLabel: "Schedule outreach",
            });
        }
    }

    const hotLeads = leads.filter((l) => l.score >= 70 && !["won", "lost"].includes(l.stage)).slice(0, 5);
    for (const lead of hotLeads) {
        insights.push({
            id: `nba-${lead.id}`,
            kind: "next_best_action",
            priority: lead.score >= 85 ? "P1" : "P2",
            title: `Next best action: ${lead.company}`,
            detail: `Score ${lead.score} in ${lead.stage}. Source: ${lead.source}. Move to next stage or book a meeting.`,
            actionLabel: "Open lead pipeline",
        });
    }

    if (analytics.winLoss.winRate > 0 && analytics.winLoss.winRate < 35) {
        insights.push({
            id: "winrate-low",
            kind: "next_best_action",
            priority: "P2",
            title: "Improve win rate",
            detail: `Win rate is ${analytics.winLoss.winRate}%. Review lost-deal reasons and proposal quality.`,
            actionLabel: "View analytics",
        });
    }

    const order = { P1: 0, P2: 1, P3: 2 } as const;
    return insights.sort((a, b) => order[a.priority] - order[b.priority]).slice(0, 12);
}

export function buildCrmEnterpriseSnapshot(data: CrmPlatformRawData): CrmEnterpriseSnapshot {
    const directory = data.clients
        .filter((c) => c.lifecycle_stage === "client" || c.status === "active" || c.lifecycle_stage !== "lead")
        .map(mapDirectoryClient);
    // Prefer true clients; if empty include all non-duplicate
    const directoryFinal =
        directory.filter((c) => c.lifecycleStage === "client" || c.status === "active").length > 0
            ? directory.filter((c) => c.lifecycleStage === "client" || c.status === "active" || c.status === "at_risk" || c.status === "inactive")
            : directory;

    const leads = buildPipelineLeads(data);
    const analytics = buildCrmAnalytics(data, leads, directoryFinal);
    const insights = buildAiCrmInsights({ directory: directoryFinal, leads, data, analytics });
    const healthScores = insights.filter((i) => typeof i.healthScore === "number").map((i) => i.healthScore as number);

    const stats: CrmEnterpriseStats = {
        totalClients: directoryFinal.length,
        totalLeads: leads.length,
        openOpportunities: data.opportunities.filter((o) => !["won", "lost", "closed_won", "closed_lost"].includes(o.status.toLowerCase())).length,
        collectedRevenue: analytics.revenue.collected,
        collectedRevenueLabel: analytics.revenue.label,
        conversionRate:
            directoryFinal.length + leads.length === 0
                ? 0
                : Math.round((directoryFinal.length / (directoryFinal.length + leads.filter((l) => l.stage !== "won").length)) * 100),
        averageHealthScore:
            healthScores.length === 0 ? 0 : Math.round(healthScores.reduce((s, n) => s + n, 0) / healthScores.length),
    };

    return {
        organizationId: data.organizationId,
        source: "supabase",
        fetchedAt: data.fetchedAt,
        stats,
        directory: directoryFinal,
        leads,
        kanban: buildLeadKanban(leads),
        communications: buildCommunications(data),
        analytics,
        insights,
    };
}

export function createEmptyCrmSnapshot(): CrmEnterpriseSnapshot {
    return {
        organizationId: null,
        source: "fallback",
        fetchedAt: new Date().toISOString(),
        stats: {
            totalClients: 0,
            totalLeads: 0,
            openOpportunities: 0,
            collectedRevenue: 0,
            collectedRevenueLabel: "$0",
            conversionRate: 0,
            averageHealthScore: 0,
        },
        directory: [],
        leads: [],
        kanban: buildLeadKanban([]),
        communications: [],
        analytics: {
            conversionFunnel: LEAD_STAGES.map(({ label }) => ({ stage: label, count: 0 })),
            winLoss: { won: 0, lost: 0, winRate: 0, wonAmount: 0, lostAmount: 0 },
            revenue: { collected: 0, outstanding: 0, label: "$0" },
            teamPerformance: [],
        },
        insights: [],
    };
}

export { LEAD_STAGES };
