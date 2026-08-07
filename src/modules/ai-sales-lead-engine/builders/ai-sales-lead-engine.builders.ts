import { ASLE_SCORE_BANDS } from "../constants";
import type {
    AiSalesLeadEngineRawData,
    AiSalesLeadEngineSnapshot,
    AutomationHub,
    DocumentGenerators,
    LeadCaptureCenter,
    LeadQualificationBoard,
    SalesAnalytics,
    SalesPipelineBoard,
    WorkspaceTools,
} from "../types";

function money(n: number): number {
    return Math.round((Number.isFinite(n) ? n : 0) * 100) / 100;
}

export function scoreBand(score: number): (typeof ASLE_SCORE_BANDS)[number] {
    if (score >= 70) return "hot";
    if (score >= 40) return "warm";
    return "cold";
}

export function classifyQualification(
    status: string,
    score: number,
): "qualified" | "nurture" | "disqualified" | "new" {
    const s = status.toLowerCase();
    if (s.includes("disqual") || s.includes("reject") || s.includes("spam")) return "disqualified";
    if (s.includes("qualif") || s.includes("mql") || s.includes("sql") || score >= 70) return "qualified";
    if (s.includes("nurtur") || s.includes("warm") || (score >= 40 && score < 70)) return "nurture";
    if (s.includes("new") || s.includes("open") || s.includes("inbox")) return "new";
    if (score >= 70) return "qualified";
    if (score >= 40) return "nurture";
    return "new";
}

export function opportunitySignal(probability: number, amount: number): "strong" | "moderate" | "weak" {
    if (probability >= 60 && amount > 0) return "strong";
    if (probability >= 30 || amount > 0) return "moderate";
    return "weak";
}

function followUpStatus(dueAt: string | null, completedAt: string | null): "overdue" | "due_soon" | "scheduled" | "completed" {
    if (completedAt) return "completed";
    if (!dueAt) return "scheduled";
    const due = new Date(dueAt).getTime();
    if (!Number.isFinite(due)) return "scheduled";
    const now = Date.now();
    if (due < now) return "overdue";
    if (due - now <= 86_400_000 * 2) return "due_soon";
    return "scheduled";
}

function isOpenOpportunity(status: string): boolean {
    const s = status.toLowerCase();
    return !s.includes("won") && !s.includes("lost") && !s.includes("closed");
}

export const aslePure = {
    money,
    scoreBand,
    classifyQualification,
    opportunitySignal,
    followUpStatus,
    isOpenOpportunity,
};

export function buildLeadCaptureCenter(data: AiSalesLeadEngineRawData): LeadCaptureCenter {
    const inbox = data.leads.map((l) => ({
        id: l.id,
        leadName: l.lead_name,
        companyName: l.company_name,
        email: l.email,
        phone: l.phone,
        source: l.source || "unknown",
        status: l.status,
        score: l.score,
        scoreBand: scoreBand(l.score),
        createdAt: l.created_at,
    }));

    const sourceMap = new Map<string, number>();
    for (const row of inbox) {
        sourceMap.set(row.source, (sourceMap.get(row.source) ?? 0) + 1);
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const newToday = inbox.filter((r) => new Date(r.createdAt).getTime() >= startOfDay.getTime()).length;

    return {
        inbox,
        bySource: [...sourceMap.entries()].map(([source, count]) => ({ source, count })).sort((a, b) => b.count - a.count),
        newToday,
        totalLeads: inbox.length,
        captureChannels: [...sourceMap.keys()],
    };
}

export function buildLeadQualificationBoard(data: AiSalesLeadEngineRawData): LeadQualificationBoard {
    const rows = data.leads.map((l) => {
        const band = scoreBand(l.score);
        const qualification = classifyQualification(l.status, l.score);
        const reason =
            qualification === "qualified"
                ? `Score ${l.score} · ${band.toUpperCase()} band`
                : qualification === "nurture"
                  ? `Nurture path · score ${l.score}`
                  : qualification === "disqualified"
                    ? `Status ${l.status}`
                    : `Awaiting qualification · score ${l.score}`;
        return {
            id: l.id,
            leadName: l.lead_name,
            companyName: l.company_name,
            status: l.status,
            score: l.score,
            scoreBand: band,
            qualification,
            reason,
        };
    });

    return {
        rows,
        qualified: rows.filter((r) => r.qualification === "qualified").length,
        nurture: rows.filter((r) => r.qualification === "nurture").length,
        disqualified: rows.filter((r) => r.qualification === "disqualified").length,
        hot: rows.filter((r) => r.scoreBand === "hot").length,
        warm: rows.filter((r) => r.scoreBand === "warm").length,
        cold: rows.filter((r) => r.scoreBand === "cold").length,
    };
}

export function buildSalesPipelineBoard(data: AiSalesLeadEngineRawData): SalesPipelineBoard {
    const pipeline =
        data.pipelines.find((p) => p.is_default) ?? data.pipelines[0] ?? null;
    const stages = data.stages
        .filter((s) => !pipeline || s.pipeline_id === pipeline.id)
        .sort((a, b) => a.sort_order - b.sort_order);

    const stageName = (id: string | null) => stages.find((s) => s.id === id)?.name ?? "Unstaged";
    const pipelineName = pipeline?.name ?? "Default";

    const listDeals = data.opportunities.map((o) => ({
        id: o.id,
        opportunityNumber: o.opportunity_number,
        name: o.name,
        amount: money(o.amount),
        weightedAmount: money(o.amount * (o.probability / 100)),
        probability: o.probability,
        status: o.status,
        stageName: stageName(o.stage_id),
        pipelineName,
        expectedCloseDate: o.expected_close_date ?? "",
    }));

    const stageColumns = stages.map((stage) => {
        const deals = listDeals.filter((d) => {
            const opp = data.opportunities.find((o) => o.id === d.id);
            return opp?.stage_id === stage.id;
        });
        return {
            stageId: stage.id,
            stageName: stage.name,
            sortOrder: stage.sort_order,
            probability: stage.probability,
            isClosedWon: stage.is_closed_won,
            isClosedLost: stage.is_closed_lost,
            deals,
            totalAmount: money(deals.reduce((sum, d) => sum + d.amount, 0)),
        };
    });

    const unstaged = listDeals.filter((d) => {
        const opp = data.opportunities.find((o) => o.id === d.id);
        return !opp?.stage_id || !stages.some((s) => s.id === opp.stage_id);
    });
    if (unstaged.length) {
        stageColumns.push({
            stageId: "unstaged",
            stageName: "Unstaged",
            sortOrder: 999,
            probability: 0,
            isClosedWon: false,
            isClosedLost: false,
            deals: unstaged,
            totalAmount: money(unstaged.reduce((sum, d) => sum + d.amount, 0)),
        });
    }

    const opportunities = data.opportunities
        .filter((o) => isOpenOpportunity(o.status))
        .map((o) => ({
            id: o.id,
            name: o.name,
            amount: money(o.amount),
            probability: o.probability,
            status: o.status,
            stageName: stageName(o.stage_id),
            signal: opportunitySignal(o.probability, o.amount),
            expectedCloseDate: o.expected_close_date ?? "",
        }));

    const open = listDeals.filter((d) => isOpenOpportunity(d.status));

    return {
        stages: stageColumns,
        listDeals,
        opportunities,
        openDealCount: open.length,
        pipelineValue: money(open.reduce((sum, d) => sum + d.amount, 0)),
        weightedPipeline: money(open.reduce((sum, d) => sum + d.weightedAmount, 0)),
    };
}

export function buildDocumentGenerators(data: AiSalesLeadEngineRawData): DocumentGenerators {
    const proposals = [
        ...data.proposals.map((p) => ({
            id: p.id,
            title: p.proposal_name,
            kind: "proposal" as const,
            status: p.proposal_status,
            value: money(p.proposal_value),
            ref: p.proposal_key,
            validUntil: "",
        })),
        ...data.baProposals.map((p) => ({
            id: p.id,
            title: p.title,
            kind: "proposal" as const,
            status: p.status,
            value: 0,
            ref: p.id.slice(0, 8),
            validUntil: "",
        })),
    ];

    const quotations = data.quotes.map((q) => ({
        id: q.id,
        title: q.title,
        kind: "quotation" as const,
        status: q.status,
        value: money(q.total_amount),
        ref: q.quote_number,
        validUntil: q.valid_until ?? "",
    }));

    const contracts = data.contracts.map((c) => ({
        id: c.id,
        title: c.contract_name,
        kind: "contract" as const,
        status: c.contract_status,
        value: money(c.contract_value),
        ref: c.contract_key,
        validUntil: "",
    }));

    const estimates = data.estimates.map((e) => ({
        id: e.id,
        title: e.notes || e.number,
        kind: "estimate" as const,
        status: e.status,
        value: money(e.total),
        ref: e.number,
        validUntil: e.valid_until ?? "",
    }));

    const all = [...proposals, ...quotations, ...contracts, ...estimates];
    const pendingCount = all.filter((d) => {
        const s = d.status.toLowerCase();
        return s.includes("draft") || s.includes("pending") || s.includes("review");
    }).length;

    return {
        proposals,
        quotations,
        contracts,
        estimates,
        pendingCount,
        totalValue: money(all.reduce((sum, d) => sum + d.value, 0)),
    };
}

export function buildAutomationHub(data: AiSalesLeadEngineRawData): AutomationHub {
    const followUps = data.activities.map((a) => ({
        id: a.id,
        subject: a.subject,
        activityType: a.activity_type,
        dueAt: a.due_at ?? "",
        status: followUpStatus(a.due_at, a.completed_at),
        related: a.opportunity_id ? `opp:${a.opportunity_id.slice(0, 8)}` : a.lead_id ? `lead:${a.lead_id.slice(0, 8)}` : "—",
    }));

    const hotLeads = data.leads.filter((l) => scoreBand(l.score) === "hot").length;
    const overdue = followUps.filter((f) => f.status === "overdue").length;
    const strongOpps = data.opportunities.filter((o) => opportunitySignal(o.probability, o.amount) === "strong").length;

    const assistantInsights = [
        {
            id: "insight-hot-leads",
            title: "Prioritize hot leads",
            priority: hotLeads > 0 ? ("high" as const) : ("low" as const),
            detail: `${hotLeads} hot-scored leads need founder/AE attention.`,
        },
        {
            id: "insight-overdue",
            title: "Clear overdue follow-ups",
            priority: overdue > 0 ? ("high" as const) : ("medium" as const),
            detail: `${overdue} follow-ups are overdue in the live activity queue.`,
        },
        {
            id: "insight-opps",
            title: "Advance strong opportunities",
            priority: strongOpps > 0 ? ("medium" as const) : ("low" as const),
            detail: `${strongOpps} opportunities show strong win signals.`,
        },
    ];

    const integrations = [
        {
            channel: "email" as const,
            status: data.emailTracking.length > 0 ? ("connected_architecture" as const) : ("ready" as const),
            liveSignals: data.emailTracking.length,
            detail: "Sales email tracking + outbound architecture mapped to sales_email_tracking.",
        },
        {
            channel: "whatsapp" as const,
            status: data.callLogs.length > 0 ? ("ready" as const) : ("needs_config" as const),
            liveSignals: data.callLogs.length,
            detail: "WhatsApp channel architecture reuses conversation/call outcome signals pending provider binding.",
        },
        {
            channel: "calendar" as const,
            status: data.meetings.length > 0 ? ("connected_architecture" as const) : ("ready" as const),
            liveSignals: data.meetings.length,
            detail: "Calendar architecture mapped to sales_meetings for scheduling and reminders.",
        },
    ];

    return {
        followUps,
        assistantInsights,
        integrations,
        emailSignals: data.emailTracking.length,
        meetingSignals: data.meetings.length,
        callSignals: data.callLogs.length,
        notificationCount: data.auditLogs.length + overdue,
    };
}

export function buildSalesAnalytics(data: AiSalesLeadEngineRawData): SalesAnalytics {
    const openOpps = data.opportunities.filter((o) => isOpenOpportunity(o.status));
    const won = data.opportunities.filter((o) => o.status.toLowerCase().includes("won"));
    const lost = data.opportunities.filter((o) => o.status.toLowerCase().includes("lost"));
    const closed = [...won, ...lost];
    const pipelineValue = money(openOpps.reduce((s, o) => s + o.amount, 0));
    const weightedPipeline = money(openOpps.reduce((s, o) => s + o.amount * (o.probability / 100), 0));
    const closedWonValue = money(won.reduce((s, o) => s + o.amount, 0));
    const winRate = closed.length ? Math.round((won.length / closed.length) * 1000) / 10 : 0;

    const targetAmount = data.targets.reduce((s, t) => s + t.target_amount, 0);
    const achievedAmount = data.targets.reduce((s, t) => s + t.achieved_amount, 0);
    const targetAchievement = targetAmount > 0 ? Math.round((achievedAmount / targetAmount) * 1000) / 10 : 0;

    const qualified = data.leads.filter((l) => classifyQualification(l.status, l.score) === "qualified").length;
    const funnel = [
        { stage: "Leads captured", count: data.leads.length, conversionFromPrior: null as number | null },
        {
            stage: "Qualified",
            count: qualified,
            conversionFromPrior: data.leads.length ? Math.round((qualified / data.leads.length) * 1000) / 10 : null,
        },
        {
            stage: "Opportunities",
            count: data.opportunities.length,
            conversionFromPrior: qualified ? Math.round((data.opportunities.length / qualified) * 1000) / 10 : null,
        },
        {
            stage: "Quotes",
            count: data.quotes.length,
            conversionFromPrior: data.opportunities.length
                ? Math.round((data.quotes.length / data.opportunities.length) * 1000) / 10
                : null,
        },
        {
            stage: "Won",
            count: won.length,
            conversionFromPrior: data.opportunities.length
                ? Math.round((won.length / data.opportunities.length) * 1000) / 10
                : null,
        },
    ];

    const winLossRows = data.winLoss.map((w) => ({
        id: w.id,
        outcome: w.outcome,
        reason: w.reason,
        competitor: w.competitor,
        amount: money(w.amount),
        recordedAt: w.recorded_at,
    }));

    return {
        kpis: {
            totalLeads: data.leads.length,
            openOpportunities: openOpps.length,
            pipelineValue,
            weightedPipeline,
            closedWonValue,
            winRate,
            activeQuotes: data.quotes.filter((q) => {
                const s = q.status.toLowerCase();
                return !s.includes("void") && !s.includes("expired") && !s.includes("rejected");
            }).length,
            targetAchievement,
        },
        funnel,
        forecasts: data.forecasts.map((f) => ({
            id: f.id,
            period: f.forecast_period,
            forecastDate: f.forecast_date,
            pipelineValue: money(f.pipeline_value),
            weightedValue: money(f.weighted_value),
            closedValue: money(f.closed_value),
            notes: f.notes,
        })),
        winLoss: winLossRows,
        winCount: winLossRows.filter((w) => w.outcome.toLowerCase().includes("win")).length || won.length,
        lossCount: winLossRows.filter((w) => w.outcome.toLowerCase().includes("loss")).length || lost.length,
    };
}

export function buildWorkspaceTools(data: AiSalesLeadEngineRawData): WorkspaceTools {
    const timeline = [
        ...data.activities.map((a) => ({
            id: a.id,
            at: a.created_at,
            kind: a.activity_type || "activity",
            title: a.subject,
            detail: a.description,
        })),
        ...data.emailTracking.map((e) => ({
            id: e.id,
            at: e.sent_at,
            kind: "email",
            title: e.subject,
            detail: `${e.recipient_email} · ${e.status}`,
        })),
        ...data.meetings.map((m) => ({
            id: m.id,
            at: m.scheduled_at,
            kind: "meeting",
            title: m.title,
            detail: m.status,
        })),
        ...data.callLogs.map((c) => ({
            id: c.id,
            at: c.called_at,
            kind: "call",
            title: `${c.direction} call`,
            detail: c.outcome || c.notes,
        })),
        ...data.auditLogs.map((a) => ({
            id: a.id,
            at: a.created_at,
            kind: a.entity_type || "audit",
            title: a.action,
            detail: a.summary,
        })),
    ]
        .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
        .slice(0, 100);

    const tasks = data.activities.map((a) => ({
        id: a.id,
        subject: a.subject,
        activityType: a.activity_type,
        dueAt: a.due_at ?? "",
        completed: Boolean(a.completed_at),
        assignee: "—",
    }));

    return {
        timeline,
        tasks,
        openTasks: tasks.filter((t) => !t.completed).length,
        completedTasks: tasks.filter((t) => t.completed).length,
        searchIndexSize: data.leads.length + data.opportunities.length + data.quotes.length,
        exportReady: true,
        filterPresets: ["hot-leads", "open-pipeline", "overdue-followups", "pending-quotes", "won-this-period"],
    };
}

export function createEmptyAiSalesLeadEngineSnapshot(
    accessGranted: boolean,
    accessDeniedReason?: string,
): AiSalesLeadEngineSnapshot {
    return {
        organizationId: null,
        accessGranted,
        accessDeniedReason,
        fetchedAt: new Date().toISOString(),
        capture: { inbox: [], bySource: [], newToday: 0, totalLeads: 0, captureChannels: [] },
        qualify: { rows: [], qualified: 0, nurture: 0, disqualified: 0, hot: 0, warm: 0, cold: 0 },
        pipeline: {
            stages: [],
            listDeals: [],
            opportunities: [],
            openDealCount: 0,
            pipelineValue: 0,
            weightedPipeline: 0,
        },
        documents: {
            proposals: [],
            quotations: [],
            contracts: [],
            estimates: [],
            pendingCount: 0,
            totalValue: 0,
        },
        automation: {
            followUps: [],
            assistantInsights: [],
            integrations: [],
            emailSignals: 0,
            meetingSignals: 0,
            callSignals: 0,
            notificationCount: 0,
        },
        analytics: {
            kpis: {
                totalLeads: 0,
                openOpportunities: 0,
                pipelineValue: 0,
                weightedPipeline: 0,
                closedWonValue: 0,
                winRate: 0,
                activeQuotes: 0,
                targetAchievement: 0,
            },
            funnel: [],
            forecasts: [],
            winLoss: [],
            winCount: 0,
            lossCount: 0,
        },
        workspace: {
            timeline: [],
            tasks: [],
            openTasks: 0,
            completedTasks: 0,
            searchIndexSize: 0,
            exportReady: true,
            filterPresets: [],
        },
    };
}

export function buildAiSalesLeadEngineSnapshot(data: AiSalesLeadEngineRawData): AiSalesLeadEngineSnapshot {
    return {
        organizationId: data.organizationId,
        accessGranted: true,
        fetchedAt: new Date().toISOString(),
        capture: buildLeadCaptureCenter(data),
        qualify: buildLeadQualificationBoard(data),
        pipeline: buildSalesPipelineBoard(data),
        documents: buildDocumentGenerators(data),
        automation: buildAutomationHub(data),
        analytics: buildSalesAnalytics(data),
        workspace: buildWorkspaceTools(data),
    };
}
