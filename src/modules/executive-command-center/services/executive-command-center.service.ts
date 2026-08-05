import { fetchAixStats } from "../integrations/aix-bridge";
import { fetchBusinessPlatformDashboard } from "../integrations/business-platform-bridge";
import { fetchDashboardOverview } from "../integrations/dashboard-bridge";
import { fetchEipStats } from "../integrations/eip-bridge";
import { buildExecutiveNotifications, runFeedEngine } from "./engines/feed-engine";
import { runOpportunityEngine } from "./engines/opportunity-engine";
import { runPriorityEngine } from "./engines/priority-engine";
import { runRecommendationEngine } from "./engines/recommendation-engine";
import { runRiskEngine } from "./engines/risk-engine";
import { buildIntelligenceModules } from "./module-snapshots";
import type { CopilotContext, ExecutiveCommandCenterSnapshot, ExecutiveRawSignals } from "../types";

function buildBrief(signals: ExecutiveRawSignals, attention: ReturnType<typeof runPriorityEngine>): ExecutiveCommandCenterSnapshot["brief"] {
    const top = attention.filter((a) => a.severity !== "low").slice(0, 3);
    const org = signals.overview.organization?.name ?? "Enterprise workspace";
    return {
        title: `Executive brief — ${org}`,
        summary: top.length
            ? `Today requires attention on ${top.length} priority area${top.length === 1 ? "" : "s"}: ${top.map((t) => t.title).join("; ")}.`
            : "All systems nominal. Monitor growth opportunities and client lifecycle signals.",
        generatedAt: new Date().toISOString(),
        priorities: top.map((t) => t.title),
    };
}

function buildKpis(signals: ExecutiveRawSignals, unifiedScore: number): ExecutiveCommandCenterSnapshot["kpis"] {
    const { overview, eip, aix, business } = signals;
    return [
        { title: "Unified intelligence", value: `${unifiedScore}%`, detail: "Cross-domain executive score", tone: "accent", trend: unifiedScore >= 70 ? "up" : "down" },
        { title: "Attention items", value: String(runPriorityEngine(signals).filter((a) => a.severity !== "low").length), detail: "Requires action today", tone: "warning", trend: "flat" },
        { title: "Open risks", value: String(aix.openRiskCount + (eip.riskScore > 50 ? 1 : 0)), detail: "EIP + AIX risk register", trend: aix.openRiskCount > 0 ? "down" : "up" },
        { title: "Active clients", value: String(business?.activeClients ?? 0), detail: `${overview.teamCount} team members`, trend: "up" },
    ];
}

export class ExecutiveCommandCenterService {
    async getSnapshot(authUserId: string, email: string, fullName?: string | null): Promise<ExecutiveCommandCenterSnapshot> {
        const [overview, eip, aix, business] = await Promise.all([
            fetchDashboardOverview(authUserId, email, fullName),
            fetchEipStats(authUserId, email, fullName),
            fetchAixStats(authUserId, email, fullName),
            fetchBusinessPlatformDashboard(authUserId, email, fullName).catch(() => null),
        ]);

        const signals: ExecutiveRawSignals = { overview, eip, aix, business };
        const attentionToday = runPriorityEngine(signals);
        const risks = runRiskEngine(signals);
        const opportunities = runOpportunityEngine(signals);
        const recommendations = runRecommendationEngine(signals);
        const feed = runFeedEngine(signals);
        const notifications = buildExecutiveNotifications(attentionToday);
        const modules = buildIntelligenceModules(signals);
        const unifiedScore = Math.round(
            (eip.overallIntelligenceScore + aix.avgAiConfidenceScore + aix.businessScore + eip.businessHealthScore) / 4,
        );

        return {
            organizationName: overview.organization?.name ?? "Enterprise workspace",
            source: overview.source,
            unifiedScore,
            attentionToday,
            risks,
            opportunities,
            recommendations,
            feed,
            notifications,
            modules,
            brief: buildBrief(signals, attentionToday),
            kpis: buildKpis(signals, unifiedScore),
        };
    }

    buildCopilotContext(snapshot: ExecutiveCommandCenterSnapshot): CopilotContext {
        return {
            organizationName: snapshot.organizationName,
            unifiedScore: snapshot.unifiedScore,
            topRisks: snapshot.risks.filter((r) => r.severity !== "low").slice(0, 3).map((r) => r.title),
            topOpportunities: snapshot.opportunities.slice(0, 3).map((o) => o.title),
            pendingRecommendations: snapshot.recommendations.length,
        };
    }
}

export const executiveCommandCenterService = new ExecutiveCommandCenterService();
