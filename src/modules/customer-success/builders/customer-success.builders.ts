import type { CustomerSuccessRawData } from "../types/raw";
import type {
    ChurnPreventionItem,
    CustomerHealthMetric,
    CustomerSuccessExecutiveWidgets,
    CustomerSuccessSnapshot,
    CustomerTimelineItem,
    ExpansionCenterItem,
    RenewalCenterItem,
    SuccessPlanItem,
} from "../types/os";
import { asStringArray, clampScore, daysUntil, formatRelativeTime, trendFromScores } from "../utils/formatters";

function clientName(data: CustomerSuccessRawData, clientId?: string | null): string {
    if (!clientId) return "Unknown customer";
    return data.clients.find((c) => c.id === clientId)?.name ?? "Unknown customer";
}

function engagementClientId(data: CustomerSuccessRawData, engagementId: string): string | null {
    return data.engagements.find((e) => e.id === engagementId)?.client_id ?? null;
}

function dimensionScore(dimensions: unknown[], key: string, fallback: number): number {
    if (!Array.isArray(dimensions)) return fallback;
    for (const item of dimensions) {
        if (!item || typeof item !== "object") continue;
        const rec = item as Record<string, unknown>;
        const name = String(rec.name ?? rec.key ?? rec.dimension ?? "").toLowerCase();
        if (name.includes(key)) {
            const score = Number(rec.score ?? rec.value ?? fallback);
            return clampScore(score);
        }
    }
    return fallback;
}

export function buildHealthCenter(data: CustomerSuccessRawData): CustomerHealthMetric[] {
    const byClient = new Map<string, CustomerHealthMetric>();

    for (const client of data.clients.filter((c) => c.lifecycle_stage === "client" || c.status === "active")) {
        const clientProjects = data.projects.filter((p) => p.client_id === client.id);
        const projectIds = new Set(clientProjects.map((p) => p.id));
        const openTasks = data.tasks.filter(
            (t) => t.project_id && projectIds.has(t.project_id) && !["done", "completed", "cancelled"].includes(t.status.toLowerCase()),
        ).length;
        const tickets = data.supportTickets.filter((t) => t.client_id === client.id);
        const openTickets = tickets.filter((t) => !["resolved", "closed", "done"].includes(t.status.toLowerCase())).length;
        const invoices = data.invoices.filter((i) => i.client_id === client.id);
        const outstanding = invoices.reduce((s, i) => s + Math.max(0, Number(i.total ?? 0) - Number(i.amount_paid ?? 0)), 0);
        const collected = invoices.reduce((s, i) => s + Number(i.amount_paid ?? 0), 0);
        const lastActivity = data.activities.find((a) => a.entity_id === client.id) ?? null;

        const engagementIds = data.engagements.filter((e) => e.client_id === client.id).map((e) => e.id);
        const healthRows = data.healthScores.filter((h) => engagementIds.includes(h.engagement_id));
        const adoptionRows = data.adoption.filter((a) => engagementIds.includes(a.engagement_id));
        const baseHealth = healthRows[0]?.overall_score ?? 65;
        const dims = (healthRows[0]?.dimension_scores as unknown[]) ?? [];
        const adoption = adoptionRows[0]?.adoption_percent ?? dimensionScore(dims, "adopt", 55);
        const delivery = clientProjects.length === 0
            ? 60
            : clampScore(
                  100 -
                      openTasks * 2 -
                      clientProjects.filter((p) => ["blocked", "at_risk", "delayed"].includes(p.status.toLowerCase())).length * 15,
              );
        const support = tickets.length === 0 ? 75 : clampScore(100 - openTickets * 8);
        const billing = invoices.length === 0 ? 70 : clampScore(100 - (outstanding > collected * 0.3 ? 25 : 0) - (outstanding > 0 ? 10 : 0));
        const login = dimensionScore(dims, "login", dimensionScore(dims, "engag", 60));
        const overall = clampScore((Number(baseHealth) + adoption + delivery + support + billing + login) / 6);
        const previous = clampScore(Number(baseHealth) - 3);

        byClient.set(client.id, {
            clientId: client.id,
            clientName: client.name,
            overallHealthScore: overall,
            productAdoption: clampScore(adoption),
            loginActivityScore: clampScore(login),
            projectDeliveryHealth: delivery,
            supportHealth: support,
            billingHealth: billing,
            usageTrend: trendFromScores(overall, previous),
            lastActivityAt: lastActivity?.created_at ?? null,
            lastActivityRelative: lastActivity ? formatRelativeTime(lastActivity.created_at) : "No activity",
            executiveSummary: `${client.name} health ${overall}. Adoption ${clampScore(adoption)}%, delivery ${delivery}, support ${support}, billing ${billing}.`,
        });
    }

    // Include engagement-linked clients not already mapped
    for (const engagement of data.engagements) {
        if (!engagement.client_id || byClient.has(engagement.client_id)) continue;
        const health = data.healthScores.find((h) => h.engagement_id === engagement.id);
        const adoption = data.adoption.find((a) => a.engagement_id === engagement.id);
        const score = clampScore(Number(health?.overall_score ?? 50));
        byClient.set(engagement.client_id, {
            clientId: engagement.client_id,
            clientName: clientName(data, engagement.client_id),
            overallHealthScore: score,
            productAdoption: clampScore(Number(adoption?.adoption_percent ?? 40)),
            loginActivityScore: 50,
            projectDeliveryHealth: 55,
            supportHealth: 55,
            billingHealth: 55,
            usageTrend: "flat",
            lastActivityAt: engagement.updated_at,
            lastActivityRelative: formatRelativeTime(engagement.updated_at),
            executiveSummary: `${clientName(data, engagement.client_id)} tracked via engagement ${engagement.title}.`,
        });
    }

    return [...byClient.values()].sort((a, b) => a.overallHealthScore - b.overallHealthScore);
}

export function buildSuccessPlans(data: CustomerSuccessRawData): SuccessPlanItem[] {
    return data.engagements.map((engagement) => {
        const onboarding = data.onboarding.filter((o) => o.engagement_id === engagement.id);
        const qbr = data.qbrReports.filter((q) => q.engagement_id === engagement.id);
        const adoption = data.adoption.find((a) => a.engagement_id === engagement.id);
        const milestones = onboarding.flatMap((o) =>
            asStringArray(o.milestones).map((name) => ({ name, status: o.status })),
        );
        const goals = [
            ...asStringArray(onboarding[0]?.phases),
            engagement.summary ? engagement.summary.slice(0, 120) : "Drive adoption and renewal readiness",
        ].filter(Boolean);
        const progress = clampScore(
            Number(adoption?.adoption_percent ?? 0) * 0.6 +
                (engagement.status.toLowerCase() === "active" ? 20 : 10) +
                Math.min(20, milestones.length * 4),
        );
        const clientId = engagement.client_id ?? "unknown";
        return {
            id: engagement.id,
            clientId,
            clientName: clientName(data, engagement.client_id),
            title: engagement.title,
            goals: goals.slice(0, 6),
            milestones: milestones.slice(0, 8),
            reviews: qbr.map((r) => `${r.title} (${r.quarter})`),
            successOwner: engagement.agent_id ? `Agent ${engagement.agent_id.slice(0, 8)}` : "Unassigned",
            progressPercent: progress,
            status: engagement.status,
            aiSuggestions: [
                progress < 50 ? "Schedule adoption workshop this week" : "Maintain QBR cadence",
                milestones.some((m) => m.status !== "completed") ? "Close open onboarding milestones" : "Expand success playbook coverage",
            ],
        };
    });
}

export function buildRenewalCenter(data: CustomerSuccessRawData, health: CustomerHealthMetric[]): RenewalCenterItem[] {
    return data.renewals.map((plan) => {
        const clientId = engagementClientId(data, plan.engagement_id);
        const healthScore = health.find((h) => h.clientId === clientId)?.overallHealthScore ?? 50;
        const days = daysUntil(plan.renewal_date);
        let probability = clampScore(healthScore * 0.7 + (plan.status.toLowerCase().includes("committed") ? 25 : 10));
        if (days !== null && days < 30) probability = clampScore(probability - 8);
        if (days !== null && days < 0) probability = clampScore(probability - 20);

        let aiRenewalRisk: RenewalCenterItem["aiRenewalRisk"] = "low";
        if (probability < 40 || (days !== null && days < 15 && healthScore < 55)) aiRenewalRisk = "critical";
        else if (probability < 55) aiRenewalRisk = "high";
        else if (probability < 70) aiRenewalRisk = "medium";

        return {
            id: plan.id,
            clientId: clientId ?? "unknown",
            clientName: clientName(data, clientId),
            contractName: plan.name,
            renewalDate: plan.renewal_date ?? null,
            renewalProbability: probability,
            daysRemaining: days,
            aiRenewalRisk,
            renewalForecastUsd: Number(plan.renewal_value_usd ?? 0) * (probability / 100),
            status: plan.status,
        };
    });
}

export function buildChurnPrevention(data: CustomerSuccessRawData, health: CustomerHealthMetric[]): ChurnPreventionItem[] {
    const fromPredictions = data.churn.map((row) => {
        const clientId = engagementClientId(data, row.engagement_id);
        const riskScore = clampScore(Number(row.churn_probability ?? 0) * (row.churn_probability <= 1 ? 100 : 1));
        const factors = asStringArray(row.risk_signals);
        const actions = asStringArray(row.retention_actions);
        const escalation: ChurnPreventionItem["escalationLevel"] =
            riskScore >= 80 ? "executive" : riskScore >= 60 ? "manager" : riskScore >= 40 ? "watch" : "none";
        return {
            id: row.id,
            clientId: clientId ?? "unknown",
            clientName: clientName(data, clientId),
            riskScore,
            riskFactors: factors.length ? factors : ["Elevated churn probability from CS model"],
            aiExplanation: `${row.name}: predicted churn risk ${riskScore}.`,
            recommendedActions: actions.length ? actions : ["Launch retention playbook", "Book executive check-in"],
            escalationLevel: escalation,
        };
    });

    const synthetic = health
        .filter((h) => h.overallHealthScore < 45 && !fromPredictions.some((p) => p.clientId === h.clientId))
        .map((h) => {
            const riskScore = clampScore(100 - h.overallHealthScore);
            return {
                id: `health-churn-${h.clientId}`,
                clientId: h.clientId,
                clientName: h.clientName,
                riskScore,
                riskFactors: [
                    h.productAdoption < 40 ? "Low product adoption" : null,
                    h.supportHealth < 50 ? "Support pressure" : null,
                    h.billingHealth < 50 ? "Billing risk" : null,
                    h.usageTrend === "down" ? "Usage trending down" : null,
                ].filter(Boolean) as string[],
                aiExplanation: `Derived from live health ${h.overallHealthScore} and operational signals.`,
                recommendedActions: ["Assign success owner", "Run health recovery plan", "Review open invoices/tickets"],
                escalationLevel: (riskScore >= 80 ? "executive" : riskScore >= 60 ? "manager" : "watch") as ChurnPreventionItem["escalationLevel"],
            };
        });

    return [...fromPredictions, ...synthetic].sort((a, b) => b.riskScore - a.riskScore);
}

export function buildExpansionCenter(data: CustomerSuccessRawData, health: CustomerHealthMetric[]): ExpansionCenterItem[] {
    const fromDb = data.expansions.map((row) => {
        const clientId = engagementClientId(data, row.engagement_id);
        const type = row.opportunity_type.toLowerCase();
        const kind: ExpansionCenterItem["kind"] = type.includes("cross")
            ? "cross_sell"
            : type.includes("upsell")
              ? "upsell"
              : type.includes("gap") || type.includes("adopt")
                ? "adoption_gap"
                : "expansion";
        const gaps = asStringArray(row.signals);
        const healthScore = health.find((h) => h.clientId === clientId)?.overallHealthScore ?? 50;
        return {
            id: row.id,
            clientId: clientId ?? "unknown",
            clientName: clientName(data, clientId),
            kind,
            title: row.name,
            productAdoptionGaps: gaps,
            expansionValueUsd: Number(row.estimated_value_usd ?? 0),
            opportunityScore: clampScore(healthScore * 0.5 + Math.min(50, Number(row.estimated_value_usd ?? 0) / 2000)),
            status: row.status,
        };
    });

    const gaps = health
        .filter((h) => h.productAdoption < 55 && h.overallHealthScore >= 60)
        .map((h) => ({
            id: `gap-${h.clientId}`,
            clientId: h.clientId,
            clientName: h.clientName,
            kind: "adoption_gap" as const,
            title: `Adoption gap — ${h.clientName}`,
            productAdoptionGaps: [`Adoption at ${h.productAdoption}%`, "Enablement opportunity"],
            expansionValueUsd: Math.round((100 - h.productAdoption) * 250),
            opportunityScore: clampScore(h.overallHealthScore - h.productAdoption + 40),
            status: "identified",
        }));

    return [...fromDb, ...gaps].sort((a, b) => b.opportunityScore - a.opportunityScore);
}

export function buildCustomerTimeline(data: CustomerSuccessRawData): CustomerTimelineItem[] {
    const items: CustomerTimelineItem[] = [];

    for (const a of data.activities.slice(0, 40)) {
        const source =
            a.action === "note" || a.entity_type === "note"
                ? "notes"
                : a.entity_type.includes("client")
                  ? "crm"
                  : "activities";
        items.push({
            id: `act-${a.id}`,
            clientId: a.entity_id ?? null,
            clientName: clientName(data, a.entity_id),
            source,
            title: a.title,
            detail: a.detail,
            occurredAt: a.created_at,
            relativeTime: formatRelativeTime(a.created_at),
        });
    }

    for (const p of data.projects.slice(0, 20)) {
        items.push({
            id: `proj-${p.id}`,
            clientId: p.client_id ?? null,
            clientName: p.client_name || clientName(data, p.client_id),
            source: "projects",
            title: `Project ${p.name}`,
            detail: `${p.status} · ${p.progress}%`,
            occurredAt: p.updated_at,
            relativeTime: formatRelativeTime(p.updated_at),
        });
    }

    for (const t of data.tasks.slice(0, 20)) {
        items.push({
            id: `task-${t.id}`,
            clientId: null,
            clientName: "Delivery",
            source: "tasks",
            title: t.title,
            detail: `${t.status} · ${t.priority}`,
            occurredAt: t.updated_at,
            relativeTime: formatRelativeTime(t.updated_at),
        });
    }

    for (const m of data.meetings.slice(0, 20)) {
        items.push({
            id: `meet-${m.id}`,
            clientId: null,
            clientName: "Meetings",
            source: "meetings",
            title: m.title,
            detail: m.status,
            occurredAt: m.scheduled_at,
            relativeTime: formatRelativeTime(m.scheduled_at),
        });
    }

    for (const s of data.supportTickets.slice(0, 20)) {
        items.push({
            id: `sup-${s.id}`,
            clientId: s.client_id ?? null,
            clientName: clientName(data, s.client_id),
            source: "support",
            title: s.subject,
            detail: `${s.ticket_number} · ${s.status}`,
            occurredAt: s.updated_at,
            relativeTime: formatRelativeTime(s.updated_at),
        });
    }

    for (const inv of data.invoices.slice(0, 20)) {
        items.push({
            id: `bill-${inv.id}`,
            clientId: inv.client_id ?? null,
            clientName: clientName(data, inv.client_id),
            source: "billing",
            title: `Invoice ${inv.number}`,
            detail: `${inv.status} · ${inv.total}`,
            occurredAt: inv.updated_at,
            relativeTime: formatRelativeTime(inv.updated_at),
        });
    }

    return items.sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime()).slice(0, 80);
}

export function buildExecutiveWidgets(input: {
    health: CustomerHealthMetric[];
    renewals: RenewalCenterItem[];
    churn: ChurnPreventionItem[];
    expansion: ExpansionCenterItem[];
    timeline: CustomerTimelineItem[];
}): CustomerSuccessExecutiveWidgets {
    const buckets = [
        { bucket: "Healthy (80+)", count: input.health.filter((h) => h.overallHealthScore >= 80).length },
        { bucket: "Watch (60-79)", count: input.health.filter((h) => h.overallHealthScore >= 60 && h.overallHealthScore < 80).length },
        { bucket: "Risk (<60)", count: input.health.filter((h) => h.overallHealthScore < 60).length },
    ];

    const renewalsDue = input.renewals
        .filter((r) => r.daysRemaining !== null && r.daysRemaining <= 60)
        .slice(0, 8)
        .map((r) => ({
            clientName: r.clientName,
            daysRemaining: r.daysRemaining ?? 0,
            forecastUsd: Math.round(r.renewalForecastUsd),
        }));

    const expansionValue = input.expansion.reduce((s, e) => s + e.expansionValueUsd, 0);
    const renewalValue = input.renewals.reduce((s, r) => s + r.renewalForecastUsd, 0);
    const nrrBase = renewalValue + expansionValue;
    const nrr = nrrBase <= 0 ? 100 : clampScore(100 + (expansionValue / Math.max(1, renewalValue)) * 20);

    return {
        healthDistribution: buckets,
        renewalsDue,
        churnRisk: input.churn.slice(0, 8).map((c) => ({
            clientName: c.clientName,
            riskScore: c.riskScore,
            escalationLevel: c.escalationLevel,
        })),
        expansionPipeline: input.expansion.slice(0, 8).map((e) => ({
            title: e.title,
            valueUsd: Math.round(e.expansionValueUsd),
            score: e.opportunityScore,
        })),
        netRevenueRetention: nrr,
        activityFeed: input.timeline.slice(0, 10).map((t) => ({
            title: t.title,
            relativeTime: t.relativeTime,
            source: t.source,
        })),
    };
}

export function createEmptyCustomerSuccessSnapshot(): CustomerSuccessSnapshot {
    return {
        organizationId: null,
        source: "fallback",
        fetchedAt: new Date().toISOString(),
        stats: {
            customersTracked: 0,
            averageHealth: 0,
            renewalsNext30Days: 0,
            highChurnRisk: 0,
            expansionPipelineUsd: 0,
            netRevenueRetention: 100,
        },
        healthCenter: [],
        successPlans: [],
        renewals: [],
        churnPrevention: [],
        expansion: [],
        timeline: [],
        executiveWidgets: {
            healthDistribution: [
                { bucket: "Healthy (80+)", count: 0 },
                { bucket: "Watch (60-79)", count: 0 },
                { bucket: "Risk (<60)", count: 0 },
            ],
            renewalsDue: [],
            churnRisk: [],
            expansionPipeline: [],
            netRevenueRetention: 100,
            activityFeed: [],
        },
        assistant: {
            dailySummary: "No organization context loaded.",
            customersNeedingAttention: [],
            renewalRecommendations: [],
            expansionRecommendations: [],
            healthInsights: [],
            executiveSummary: "Sign in to load Customer Success OS.",
            generatedAt: new Date().toISOString(),
        },
    };
}

export function buildCustomerSuccessSnapshot(data: CustomerSuccessRawData): CustomerSuccessSnapshot {
    const healthCenter = buildHealthCenter(data);
    const successPlans = buildSuccessPlans(data);
    const renewals = buildRenewalCenter(data, healthCenter);
    const churnPrevention = buildChurnPrevention(data, healthCenter);
    const expansion = buildExpansionCenter(data, healthCenter);
    const timeline = buildCustomerTimeline(data);
    const executiveWidgets = buildExecutiveWidgets({
        health: healthCenter,
        renewals,
        churn: churnPrevention,
        expansion,
        timeline,
    });

    const avgHealth =
        healthCenter.length === 0
            ? 0
            : Math.round(healthCenter.reduce((s, h) => s + h.overallHealthScore, 0) / healthCenter.length);

    return {
        organizationId: data.organizationId,
        source: "supabase",
        fetchedAt: data.fetchedAt,
        stats: {
            customersTracked: healthCenter.length,
            averageHealth: avgHealth,
            renewalsNext30Days: renewals.filter((r) => r.daysRemaining !== null && r.daysRemaining >= 0 && r.daysRemaining <= 30).length,
            highChurnRisk: churnPrevention.filter((c) => c.riskScore >= 60).length,
            expansionPipelineUsd: expansion.reduce((s, e) => s + e.expansionValueUsd, 0),
            netRevenueRetention: executiveWidgets.netRevenueRetention,
        },
        healthCenter,
        successPlans,
        renewals,
        churnPrevention,
        expansion,
        timeline,
        executiveWidgets,
        assistant: {
            dailySummary: "",
            customersNeedingAttention: [],
            renewalRecommendations: [],
            expansionRecommendations: [],
            healthInsights: [],
            executiveSummary: "",
            generatedAt: data.fetchedAt,
        },
    };
}
