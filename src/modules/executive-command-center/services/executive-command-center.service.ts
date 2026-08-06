import { fetchAixStats } from "../integrations/aix-bridge";
import { fetchBusinessPlatformDashboard } from "../integrations/business-platform-bridge";
import { fetchDashboardOverview } from "../integrations/dashboard-bridge";
import { fetchEipStats } from "../integrations/eip-bridge";
import { buildExecutiveNotifications, runFeedEngine } from "./engines/feed-engine";
import { runOpportunityEngine } from "./engines/opportunity-engine";
import { runPriorityEngine } from "./engines/priority-engine";
import { runRecommendationEngine } from "./engines/recommendation-engine";
import { runRiskEngine } from "./engines/risk-engine";
import {
    buildLiveOperationsStatsFromData,
    createEmptyLiveOperationsStats,
} from "./live-operations-stats.service";
import { buildLiveOperationsKpis } from "./build-live-operations-kpis";
import { buildIntelligenceModules } from "./module-snapshots";
import { loadOrganizationOperationsData } from "./organization-operations-data.service";
import { buildExecutiveDashboardWidgets } from "./executive-widgets.service";
import { customerSuccessOsService } from "@/src/modules/customer-success/services/customer-success-os.service";
import { billingFinanceOsService } from "@/src/modules/billing-finance/services/billing-finance-os.service";
import { hrmsWorkforceOsService } from "@/src/modules/hrms-workforce/services/hrms-workforce-os.service";
import { integrationHubOsService } from "@/src/modules/integration-hub/services/integration-hub-os.service";
import { securityCenterOsService } from "@/src/modules/security-center/services/security-center-os.service";
import type {
    CopilotContext,
    ExecutiveCommandCenterSnapshot,
    ExecutiveNotification,
    ExecutiveRawSignals,
} from "../types";

export { buildLiveOperationsKpis, createEmptyLiveOperationsStats } from "./build-live-operations-kpis";

function buildBrief(
    signals: ExecutiveRawSignals,
    attention: ReturnType<typeof runPriorityEngine>,
): ExecutiveCommandCenterSnapshot["brief"] {
    const top = attention.filter((a) => a.severity !== "low").slice(0, 3);
    const org = signals.overview.organization?.name ?? "Enterprise workspace";
    const stats = signals.liveStats;
    const opsLine =
        stats.source === "supabase"
            ? ` Ops pulse: ${stats.totalClients} clients, ${stats.activeProjects} active projects, ${stats.openTasks} open tasks.`
            : "";
    return {
        title: `Executive brief — ${org}`,
        summary: top.length
            ? `Today requires attention on ${top.length} priority area${top.length === 1 ? "" : "s"}: ${top.map((t) => t.title).join("; ")}.${opsLine}`
            : `All systems nominal. Monitor growth opportunities and client lifecycle signals.${opsLine}`,
        generatedAt: new Date().toISOString(),
        priorities: top.map((t) => t.title),
    };
}

function mergeNotifications(
    live: ExecutiveNotification[],
    attention: ExecutiveNotification[],
): ExecutiveNotification[] {
    const seen = new Set<string>();
    const merged: ExecutiveNotification[] = [];
    for (const item of [...live, ...attention]) {
        const key = `${item.title}|${item.detail}`;
        if (seen.has(key) || seen.has(item.id)) continue;
        seen.add(key);
        seen.add(item.id);
        merged.push(item);
        if (merged.length >= 12) break;
    }
    return merged;
}

export class ExecutiveCommandCenterService {
    async getSnapshot(authUserId: string, email: string, fullName?: string | null): Promise<ExecutiveCommandCenterSnapshot> {
        const [
            overview,
            eip,
            aix,
            business,
            opsData,
            csSnapshot,
            financeSnapshot,
            hrmsSnapshot,
            integrationSnapshot,
            securitySnapshot,
        ] = await Promise.all([
            fetchDashboardOverview(authUserId, email, fullName),
            fetchEipStats(authUserId, email, fullName),
            fetchAixStats(authUserId, email, fullName),
            fetchBusinessPlatformDashboard(authUserId, email, fullName).catch(() => null),
            loadOrganizationOperationsData(authUserId, email, fullName).catch(() => null),
            customerSuccessOsService.getSnapshot(authUserId, email, fullName).catch(() => null),
            billingFinanceOsService.getSnapshot(authUserId, email, fullName).catch(() => null),
            hrmsWorkforceOsService.getSnapshot(authUserId, email, fullName).catch(() => null),
            integrationHubOsService.getSnapshot(authUserId, email, fullName).catch(() => null),
            securityCenterOsService.getSnapshot(authUserId, email, fullName).catch(() => null),
        ]);

        const liveStats = opsData
            ? buildLiveOperationsStatsFromData(opsData)
            : createEmptyLiveOperationsStats(opsData === null ? "no_organization" : "error");

        const signals: ExecutiveRawSignals = { overview, eip, aix, business, liveStats };
        const attentionToday = runPriorityEngine(signals);
        const risks = runRiskEngine(signals);
        const opportunities = runOpportunityEngine(signals);
        const recommendations = runRecommendationEngine(signals);
        const feed = runFeedEngine(signals);
        const attentionNotifications = buildExecutiveNotifications(attentionToday).map((n) => ({
            ...n,
            source: "attention" as const,
        }));
        const notifications = mergeNotifications(liveStats.notifications, attentionNotifications);
        const modules = buildIntelligenceModules(signals);
        const unifiedScore = Math.round(
            (eip.overallIntelligenceScore + aix.avgAiConfidenceScore + aix.businessScore + eip.businessHealthScore) / 4,
        );
        const widgets = buildExecutiveDashboardWidgets({
            data: opsData,
            liveStats,
            unifiedScore,
            customerSuccess: csSnapshot?.executiveWidgets ?? null,
            finance: financeSnapshot?.executiveWidgets ?? null,
            hrms: hrmsSnapshot?.executiveWidgets ?? null,
            integrations: integrationSnapshot?.executiveWidgets ?? null,
            security: securitySnapshot?.executiveWidgets ?? null,
        });

        return {
            organizationName: overview.organization?.name ?? "Enterprise workspace",
            source: liveStats.source === "supabase" || overview.source === "supabase" ? "supabase" : overview.source,
            unifiedScore,
            attentionToday,
            risks,
            opportunities,
            recommendations,
            feed,
            notifications,
            modules,
            brief: buildBrief(signals, attentionToday),
            kpis: buildLiveOperationsKpis(liveStats),
            liveStats,
            widgets,
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
