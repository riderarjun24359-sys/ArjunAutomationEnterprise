import {
    ACSE_INBOX_CHANNELS,
    ACSE_REPLY_CHANNELS,
    ACSE_REPLY_TONES,
    ACSE_TICKET_STATUSES,
    type AcseInboxChannel,
    type AcseReplyChannel,
    type AcseReplyTone,
    type AcseTicketStatus,
} from "../constants";
import type {
    AiCustomerSuccessEngineRawData,
    AiCustomerSuccessEngineSnapshot,
    AiKnowledgeBase,
    AiReplyGenerator,
    AiSupportInbox,
    AutomationCenter,
    CustomerHealthBoard,
    CustomerSuccessDashboard,
    ExecutiveIntelligence,
    RenewalCenter,
    SlaDashboard,
    SupportInboxRow,
    TicketManagement,
} from "../types";

function avg(nums: number[]): number | null {
    if (!nums.length) return null;
    return Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 10) / 10;
}

function money(n: number): number {
    return Math.round((Number.isFinite(n) ? n : 0) * 100) / 100;
}

export function normalizeTicketStatus(status: string): AcseTicketStatus {
    const s = status.toLowerCase().trim();
    if (s.includes("escalat")) return "escalated";
    if (s.includes("wait") || s.includes("customer")) return "waiting_customer";
    if (s.includes("pending") || s.includes("hold")) return "pending";
    if (s.includes("resolv") || s.includes("done") || s.includes("fixed")) return "resolved";
    if (s.includes("close")) return "closed";
    return "open";
}

export function inferInboxChannel(subject: string, description: string, queueName: string): AcseInboxChannel {
    const s = `${subject} ${description} ${queueName}`.toLowerCase();
    if (s.includes("whatsapp") || s.includes("wa ")) return "whatsapp";
    if (s.includes("chat") || s.includes("live")) return "live_chat";
    if (s.includes("form") || s.includes("contact") || s.includes("web")) return "contact_form";
    if (s.includes("email") || s.includes("mail")) return "email";
    return "email";
}

export function inferReplyTone(title: string, body: string): AcseReplyTone {
    const s = `${title} ${body}`.toLowerCase();
    if (s.includes("tech") || s.includes("api") || s.includes("debug") || s.includes("error")) return "technical";
    if (s.includes("friend") || s.includes("thanks") || s.includes("happy")) return "friendly";
    return "professional";
}

export function inferReplyChannel(title: string, body: string): AcseReplyChannel {
    const s = `${title} ${body}`.toLowerCase();
    if (s.includes("whatsapp") || s.includes("wa")) return "whatsapp";
    if (s.includes("ticket") || s.includes("case")) return "ticket";
    return "email";
}

export function classifyKnowledgeKind(title: string, category: string): "article" | "sop" | "faq" | "other" {
    const s = `${title} ${category}`.toLowerCase();
    if (s.includes("faq") || s.includes("question")) return "faq";
    if (s.includes("sop") || s.includes("procedure") || s.includes("runbook") || s.includes("playbook")) return "sop";
    if (s.includes("article") || s.includes("guide") || s.includes("how")) return "article";
    return "other";
}

export function classifyRenewalBucket(
    renewalDate: string | null,
    status: string,
): "upcoming" | "expired" | "payment_followup" | "reminder" {
    const s = status.toLowerCase();
    if (s.includes("payment") || s.includes("invoice") || s.includes("billing")) return "payment_followup";
    if (s.includes("remind")) return "reminder";
    if (!renewalDate) return s.includes("expir") ? "expired" : "upcoming";
    const t = new Date(renewalDate).getTime();
    if (!Number.isFinite(t)) return "reminder";
    if (t < Date.now()) return "expired";
    if (t - Date.now() <= 86_400_000 * 14) return "reminder";
    return "upcoming";
}

export const acsePure = {
    avg,
    money,
    normalizeTicketStatus,
    inferInboxChannel,
    inferReplyTone,
    inferReplyChannel,
    classifyKnowledgeKind,
    classifyRenewalBucket,
};

function mapTicketRows(data: AiCustomerSuccessEngineRawData): SupportInboxRow[] {
    const priorityById = new Map(data.priorities.map((p) => [p.id, p]));
    const queueById = new Map(data.queues.map((q) => [q.id, q]));

    return data.tickets.map((t) => {
        const priority = t.priority_id ? priorityById.get(t.priority_id) : undefined;
        const queue = t.queue_id ? queueById.get(t.queue_id) : undefined;
        return {
            id: t.id,
            ticketNumber: t.ticket_number,
            subject: t.subject,
            channel: inferInboxChannel(t.subject, t.description, queue?.name ?? ""),
            priority: priority?.name ?? "normal",
            priorityLevel: priority?.level ?? 0,
            status: t.status,
            queue: queue?.name ?? "unassigned",
            createdAt: t.created_at,
            dueAt: t.due_at ?? "",
        };
    });
}

export function buildAiSupportInbox(data: AiCustomerSuccessEngineRawData): AiSupportInbox {
    const rows = mapTicketRows(data);
    const byChannel = ACSE_INBOX_CHANNELS.map((channel) => ({
        channel,
        count: rows.filter((r) => r.channel === channel).length,
    }));
    const priorityMap = new Map<string, number>();
    for (const row of rows) priorityMap.set(row.priority, (priorityMap.get(row.priority) ?? 0) + 1);

    return {
        rows,
        byChannel,
        byPriority: [...priorityMap.entries()].map(([priority, count]) => ({ priority, count })),
        openCount: rows.filter((r) => normalizeTicketStatus(r.status) === "open").length,
    };
}

export function buildTicketManagement(data: AiCustomerSuccessEngineRawData): TicketManagement {
    const rows = mapTicketRows(data);
    const buckets = ACSE_TICKET_STATUSES.map((status) => {
        const tickets = rows.filter((r) => normalizeTicketStatus(r.status) === status);
        return { status, count: tickets.length, tickets };
    });
    return {
        buckets,
        total: rows.length,
        escalatedCount: buckets.find((b) => b.status === "escalated")?.count ?? 0,
        resolvedCount: buckets.find((b) => b.status === "resolved")?.count ?? 0,
    };
}

export function buildCustomerHealthBoard(data: AiCustomerSuccessEngineRawData): CustomerHealthBoard {
    const adoptionByName = new Map(data.adoption.map((a) => [a.name.toLowerCase(), a.adoption_percent]));
    const churnByName = new Map(data.churnPredictions.map((c) => [c.name.toLowerCase(), c.churn_probability]));
    const expansionByName = new Map(data.expansions.map((e) => [e.name.toLowerCase(), e.estimated_value_usd]));

    const rows = data.healthScores.map((h) => {
        const key = h.name.toLowerCase();
        const usage = adoptionByName.get(key) ?? avg(data.adoption.map((a) => a.adoption_percent)) ?? 0;
        const churn = churnByName.get(key) ?? 0;
        return {
            id: h.id,
            name: h.name,
            healthScore: h.overall_score,
            usagePercent: usage,
            loginSignal: usage >= 70 ? "active" : usage >= 30 ? "intermittent" : "dormant",
            churnRisk: churn,
            expansionValue: money(expansionByName.get(key) ?? 0),
            status: h.status,
        };
    });

    if (!rows.length && (data.adoption.length || data.churnPredictions.length)) {
        for (const a of data.adoption) {
            rows.push({
                id: a.id,
                name: a.name,
                healthScore: a.adoption_percent,
                usagePercent: a.adoption_percent,
                loginSignal: a.adoption_percent >= 70 ? "active" : a.adoption_percent >= 30 ? "intermittent" : "dormant",
                churnRisk: churnByName.get(a.name.toLowerCase()) ?? 0,
                expansionValue: money(expansionByName.get(a.name.toLowerCase()) ?? 0),
                status: a.status,
            });
        }
    }

    return {
        rows,
        avgHealth: avg(rows.map((r) => r.healthScore)),
        highChurnCount: rows.filter((r) => r.churnRisk >= 0.5 || r.churnRisk >= 50).length,
        expansionCount: data.expansions.length,
    };
}

export function buildRenewalCenter(data: AiCustomerSuccessEngineRawData): RenewalCenter {
    const rows = data.renewals.map((r) => {
        const bucket = classifyRenewalBucket(r.renewal_date, r.status);
        return {
            id: r.id,
            name: r.name,
            renewalDate: r.renewal_date ?? "",
            valueUsd: money(r.renewal_value_usd),
            status: r.status,
            bucket,
        };
    });
    return {
        rows,
        upcoming: rows.filter((r) => r.bucket === "upcoming").length,
        expired: rows.filter((r) => r.bucket === "expired").length,
        paymentFollowUp: rows.filter((r) => r.bucket === "payment_followup").length,
        reminderQueue: rows.filter((r) => r.bucket === "reminder").length,
        totalValue: money(rows.reduce((s, r) => s + r.valueUsd, 0)),
    };
}

export function buildAiKnowledgeBase(data: AiCustomerSuccessEngineRawData): AiKnowledgeBase {
    const articles = data.knowledgeArticles.map((a) => ({
        id: a.id,
        title: a.title,
        kind: classifyKnowledgeKind(a.title, "article") as "article" | "sop" | "faq" | "other",
        category: "support",
        status: a.status,
        views: a.view_count,
    }));

    const entries = data.knowledgeEntries.map((e) => ({
        id: e.id,
        title: e.title,
        kind: classifyKnowledgeKind(e.title, e.category),
        category: e.category || "knowledge",
        status: e.status,
        views: 0,
    }));

    const playbookSops = data.playbooks.map((p) => ({
        id: p.id,
        title: p.name,
        kind: "sop" as const,
        category: p.playbook_type || "sop",
        status: p.status,
        views: 0,
    }));

    const faqs = data.faqs.map((f) => ({
        id: f.id,
        title: f.faq_question,
        kind: "faq" as const,
        category: f.faq_category || "faq",
        status: f.faq_status || f.status,
        views: 0,
    }));

    const all = [...articles, ...entries, ...playbookSops, ...faqs];
    return {
        articles: all.filter((k) => k.kind === "article"),
        sops: all.filter((k) => k.kind === "sop"),
        faqs: all.filter((k) => k.kind === "faq"),
        searchIndexSize: all.length,
    };
}

export function buildAiReplyGenerator(data: AiCustomerSuccessEngineRawData): AiReplyGenerator {
    const templates = data.cannedResponses.map((c) => {
        const tone = inferReplyTone(c.title, c.body);
        const channel = inferReplyChannel(c.title, c.body);
        return {
            id: c.id,
            title: c.title,
            channel,
            tone,
            shortcut: c.shortcut,
            preview: c.body.slice(0, 160),
        };
    });

    return {
        templates,
        byTone: ACSE_REPLY_TONES.map((tone) => ({
            tone,
            count: templates.filter((t) => t.tone === tone).length,
        })),
        byChannel: ACSE_REPLY_CHANNELS.map((channel) => ({
            channel,
            count: templates.filter((t) => t.channel === channel).length,
        })),
    };
}

export function buildSlaDashboard(data: AiCustomerSuccessEngineRawData): SlaDashboard {
    const complianceByName = new Map(data.slaMonitoring.map((s) => [s.name.toLowerCase(), s.compliance_percent]));
    const policies = data.slas.map((s) => ({
        id: s.id,
        name: s.name,
        firstResponseMinutes: s.first_response_minutes,
        resolutionMinutes: s.resolution_minutes,
        compliancePercent: complianceByName.get(s.name.toLowerCase()) ?? avg(data.slaMonitoring.map((m) => m.compliance_percent)) ?? 100,
        status: s.is_active ? "active" : "inactive",
    }));

    const tickets = mapTicketRows(data);
    const queueMap = new Map<string, number>();
    for (const t of tickets) queueMap.set(t.queue, (queueMap.get(t.queue) ?? 0) + 1);

    const overdue = tickets.filter((t) => {
        if (!t.dueAt) return false;
        const due = new Date(t.dueAt).getTime();
        return Number.isFinite(due) && due < Date.now() && normalizeTicketStatus(t.status) !== "resolved" && normalizeTicketStatus(t.status) !== "closed";
    }).length;

    return {
        policies,
        avgFirstResponseMinutes: avg(policies.map((p) => p.firstResponseMinutes)),
        avgResolutionMinutes: avg(policies.map((p) => p.resolutionMinutes)),
        breachCount: overdue + data.slaMonitoring.filter((s) => s.compliance_percent < 90).length,
        escalationCount: data.escalationRules.filter((r) => r.is_active).length,
        teamQueues: [...queueMap.entries()].map(([queue, ticketCount]) => ({ queue, ticketCount })),
    };
}

export function buildCustomerSuccessDashboard(data: AiCustomerSuccessEngineRawData): CustomerSuccessDashboard {
    const ratings = data.satisfaction.map((s) => s.rating).filter((n) => Number.isFinite(n));
    const csat = avg(ratings);
    const promoters = ratings.filter((r) => r >= 9).length;
    const detractors = ratings.filter((r) => r <= 6).length;
    const nps = ratings.length ? Math.round(((promoters - detractors) / ratings.length) * 1000) / 10 : null;

    const highChurn = data.churnPredictions.filter((c) => c.churn_probability >= 0.5 || c.churn_probability >= 50).length;
    const churnRate =
        data.churnPredictions.length > 0
            ? Math.round((highChurn / data.churnPredictions.length) * 1000) / 10
            : null;
    const retentionRate = churnRate == null ? null : Math.round((100 - churnRate) * 10) / 10;

    return {
        kpis: {
            csat,
            nps,
            activeCustomers: data.healthScores.length || data.adoption.length,
            churnRate,
            retentionRate,
            expansionRevenue: money(data.expansions.reduce((s, e) => s + e.estimated_value_usd, 0)),
        },
        ratingCount: ratings.length,
        kpiBoards: data.kpiDashboards.length,
    };
}

export function buildAutomationCenter(data: AiCustomerSuccessEngineRawData): AutomationCenter {
    const rules = [
        ...data.escalationRules.map((r) => ({
            id: r.id,
            name: r.name,
            kind: "escalation" as const,
            trigger: r.trigger_condition,
            level: r.escalation_level,
            active: r.is_active,
        })),
        ...data.queues.map((q) => ({
            id: `route-${q.id}`,
            name: `Route → ${q.name}`,
            kind: "routing" as const,
            trigger: `queue:${q.code || q.name}`,
            level: 1,
            active: q.is_active,
        })),
        ...data.playbooks
            .filter((p) => {
                const t = p.playbook_type.toLowerCase();
                return t.includes("follow") || t.includes("assign") || t.includes("close") || t.includes("auto");
            })
            .map((p) => {
                const t = p.playbook_type.toLowerCase();
                const kind = t.includes("assign")
                    ? ("assignment" as const)
                    : t.includes("close")
                      ? ("auto_close" as const)
                      : ("followup" as const);
                return {
                    id: p.id,
                    name: p.name,
                    kind,
                    trigger: p.playbook_type,
                    level: 1,
                    active: !p.status.toLowerCase().includes("inactive"),
                };
            }),
    ];

    const kinds = ["routing", "assignment", "followup", "escalation", "auto_close"] as const;
    return {
        rules,
        activeRules: rules.filter((r) => r.active).length,
        byKind: kinds.map((kind) => ({ kind, count: rules.filter((r) => r.kind === kind).length })),
    };
}

export function buildExecutiveIntelligence(data: AiCustomerSuccessEngineRawData): ExecutiveIntelligence {
    const avgHealth = avg(data.healthScores.map((h) => h.overall_score));
    const expansionRevenue = money(data.expansions.reduce((s, e) => s + e.estimated_value_usd, 0));
    const highChurn = data.churnPredictions.filter((c) => c.churn_probability >= 0.5 || c.churn_probability >= 50).length;
    const topIssues = mapTicketRows(data)
        .filter((t) => normalizeTicketStatus(t.status) === "escalated" || normalizeTicketStatus(t.status) === "open")
        .slice(0, 5);

    const insights = [
        {
            id: "health",
            title: "Customer health",
            category: "health" as const,
            detail: avgHealth == null ? "No health scores yet." : `Average health score ${avgHealth}.`,
            severity: (avgHealth != null && avgHealth < 60 ? "high" : "medium") as "high" | "medium" | "low",
        },
        {
            id: "revenue",
            title: "Revenue risk / expansion",
            category: "revenue_risk" as const,
            detail: `Expansion pipeline ${expansionRevenue}; ${data.expansions.length} opportunities.`,
            severity: (expansionRevenue <= 0 ? "medium" : "low") as "high" | "medium" | "low",
        },
        {
            id: "churn",
            title: "Churn risk",
            category: "churn_risk" as const,
            detail: `${highChurn} high-risk churn predictions.`,
            severity: (highChurn > 0 ? "high" : "low") as "high" | "medium" | "low",
        },
        {
            id: "issues",
            title: "Top issues",
            category: "top_issue" as const,
            detail: topIssues.length
                ? topIssues.map((t) => t.subject).join(" · ")
                : "No open/escalated issues.",
            severity: (topIssues.length >= 3 ? "high" : topIssues.length > 0 ? "medium" : "low") as
                | "high"
                | "medium"
                | "low",
        },
        {
            id: "team",
            title: "Team KPIs",
            category: "team_kpi" as const,
            detail: `${data.kpiDashboards.length} KPI boards · ${data.queues.length} queues · ${data.escalationRules.filter((r) => r.is_active).length} active escalations.`,
            severity: "low" as const,
        },
        ...data.riskAnalyses.slice(0, 5).map((r) => ({
            id: r.id,
            title: r.name,
            category: "revenue_risk" as const,
            detail: `Risk level: ${r.risk_level}`,
            severity: (r.risk_level.toLowerCase().includes("high")
                ? "high"
                : r.risk_level.toLowerCase().includes("med")
                  ? "medium"
                  : "low") as "high" | "medium" | "low",
        })),
    ];

    return {
        insights,
        summaries: data.executiveSummaries.map((s) => ({
            id: s.id,
            title: s.title,
            content: s.summary_content,
        })),
        highSeverity: insights.filter((i) => i.severity === "high").length,
    };
}

export function createEmptyAiCustomerSuccessEngineSnapshot(
    accessGranted: boolean,
    accessDeniedReason?: string,
): AiCustomerSuccessEngineSnapshot {
    return {
        organizationId: null,
        accessGranted,
        accessDeniedReason,
        fetchedAt: new Date().toISOString(),
        inbox: { rows: [], byChannel: [], byPriority: [], openCount: 0 },
        tickets: { buckets: [], total: 0, escalatedCount: 0, resolvedCount: 0 },
        health: { rows: [], avgHealth: null, highChurnCount: 0, expansionCount: 0 },
        renewals: { rows: [], upcoming: 0, expired: 0, paymentFollowUp: 0, reminderQueue: 0, totalValue: 0 },
        knowledge: { articles: [], sops: [], faqs: [], searchIndexSize: 0 },
        replies: { templates: [], byTone: [], byChannel: [] },
        sla: {
            policies: [],
            avgFirstResponseMinutes: null,
            avgResolutionMinutes: null,
            breachCount: 0,
            escalationCount: 0,
            teamQueues: [],
        },
        success: {
            kpis: {
                csat: null,
                nps: null,
                activeCustomers: 0,
                churnRate: null,
                retentionRate: null,
                expansionRevenue: 0,
            },
            ratingCount: 0,
            kpiBoards: 0,
        },
        automation: { rules: [], activeRules: 0, byKind: [] },
        executive: { insights: [], summaries: [], highSeverity: 0 },
    };
}

export function buildAiCustomerSuccessEngineSnapshot(
    data: AiCustomerSuccessEngineRawData,
): AiCustomerSuccessEngineSnapshot {
    return {
        organizationId: data.organizationId,
        accessGranted: true,
        fetchedAt: new Date().toISOString(),
        inbox: buildAiSupportInbox(data),
        tickets: buildTicketManagement(data),
        health: buildCustomerHealthBoard(data),
        renewals: buildRenewalCenter(data),
        knowledge: buildAiKnowledgeBase(data),
        replies: buildAiReplyGenerator(data),
        sla: buildSlaDashboard(data),
        success: buildCustomerSuccessDashboard(data),
        automation: buildAutomationCenter(data),
        executive: buildExecutiveIntelligence(data),
    };
}
