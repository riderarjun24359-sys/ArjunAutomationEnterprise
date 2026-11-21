import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { productionLog } from "@/src/lib/production-logger";
import { csgRepository } from "../customer-success-global-ops-repository";
import { generateAiRecommendations, generateImprovementBacklog } from "../engines/continuous-improvement.engine";
import { buildSatisfactionTrend, computeCsatAverage, computeNpsScore } from "../engines/customer-feedback.engine";
import {
    computeHealthScores,
} from "../engines/customer-success-os.engine";
import { classifyLiveQueue, computeSupportHealth } from "../engines/global-support-center.engine";
import { computeDeliveryHealth } from "../engines/service-delivery-control.engine";
import { publishGlobalOpsEvent } from "../integrations/mission-core-bridge";
import {
    fetchBusinessPlatformSnapshot,
    fetchDeliverySnapshot,
    fetchSupportSnapshot,
    fetchSupportTickets,
} from "../integrations/platform-bridges";
import type { CsgContext, GlobalOperationsDashboard, SuccessPlan } from "../types";

export class CustomerSuccessGlobalOpsService {
    private async getOrgId(ctx: CsgContext): Promise<string | null> {
        if (ctx.organizationId) return ctx.organizationId;
        const resolved = await resolveOrganizationContext(ctx.authUserId, ctx.email, ctx.fullName);
        return resolved?.organizationId ?? null;
    }

    async getDashboard(ctx: CsgContext): Promise<GlobalOperationsDashboard> {
        productionLog("info", "Global operations dashboard load", "customer-success-global-ops");
        publishGlobalOpsEvent("GlobalOpsDashboardLoaded", { at: new Date().toISOString() });

        const [business, support, delivery, tickets] = await Promise.all([
            fetchBusinessPlatformSnapshot(ctx),
            fetchSupportSnapshot(ctx),
            fetchDeliverySnapshot(ctx),
            fetchSupportTickets(ctx),
        ]);

        const orgId = await this.getOrgId(ctx);
        const [
            storedPlans,
            storedOnboarding,
            storedMilestones,
            storedFeedback,
            storedEscalations,
            storedRenewals,
            storedImprovements,
        ] = orgId
            ? await Promise.all([
                csgRepository.listSuccessPlans(orgId),
                csgRepository.listOnboardingSessions(orgId),
                csgRepository.listDeliveryMilestones(orgId),
                csgRepository.listFeedback(orgId),
                csgRepository.listEscalations(orgId),
                csgRepository.listRenewals(orgId),
                csgRepository.listImprovementItems(orgId),
            ])
            : [[], [], [], [], [], [], []];

        const successPlans = storedPlans;
        const healthScores = computeHealthScores(successPlans, support.openTickets);
        const customerHealth = healthScores.length
            ? Math.round(healthScores.reduce((s, h) => s + h.score, 0) / healthScores.length)
            : 0;
        const renewals = storedRenewals;
        const escalations = storedEscalations;
        const onboardingSessions = storedOnboarding;
        const deliveryMilestones = storedMilestones;
        const deliveryHealth = computeDeliveryHealth(delivery.qualityPassRate, deliveryMilestones);
        const feedback = storedFeedback;
        const csatAverage = computeCsatAverage(feedback);
        const npsScore = computeNpsScore(feedback);
        const supportHealth = computeSupportHealth(support);
        const queue = classifyLiveQueue(tickets);

        const improvementBacklog = storedImprovements.length
            ? storedImprovements
            : generateImprovementBacklog({
                feedback,
                deliveryHealth,
                supportHealth,
                customerHealth,
                openTickets: support.openTickets,
            });

        const dashboard: GlobalOperationsDashboard = {
            activeClients: business.activeClients,
            activeProjects: business.activeProjects,
            openTickets: support.openTickets,
            slaCompliance: support.slaCompliance,
            deliveryHealth,
            customerHealth,
            revenueOverview: {
                // Only persisted renewal records represent contracted revenue.
                // Generated placeholder renewals remain useful for UI scaffolding,
                // but must never be presented as real MRR or upcoming renewals.
                mrr: storedRenewals.reduce((s, renewal) => s + renewal.amount / 12, 0),
                openInvoices: business.openInvoices,
                renewalsDue: storedRenewals.filter((r) => r.status !== "renewed" && r.status !== "churned").length,
            },
            supportHealth,
            aiRecommendations: [],
            successPlans,
            healthScores,
            renewals,
            escalations,
            tickets,
            queueDepth: queue.queueDepth || support.queueDepth,
            knowledgeArticles: support.knowledgeArticles,
            incidents: support.incidents,
            onboardingSessions,
            deliveryMilestones,
            feedback,
            csatAverage,
            npsScore,
            improvementBacklog,
            satisfactionTrend: buildSatisfactionTrend(csatAverage, npsScore),
        };

        dashboard.aiRecommendations = generateAiRecommendations(dashboard);

        if (orgId) {
            void csgRepository.logAudit(orgId, "dashboard_load", "Global operations dashboard loaded");
            if (!storedImprovements.length) {
                for (const item of improvementBacklog.slice(0, 3)) {
                    void csgRepository.insertImprovementItem(orgId, item);
                }
            }
        }

        return dashboard;
    }

    async createSuccessPlan(ctx: CsgContext, plan: Omit<SuccessPlan, "id">): Promise<SuccessPlan> {
        const orgId = await this.getOrgId(ctx);
        const created: SuccessPlan = {
            ...plan,
            id: `plan-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        };
        if (orgId) {
            await csgRepository.upsertSuccessPlan(orgId, created);
            await csgRepository.logAudit(orgId, "success_plan_created", created.title, "customerSuccessOs");
        }
        publishGlobalOpsEvent("SuccessPlanCreated", { planId: created.id });
        return created;
    }
}

export const customerSuccessGlobalOpsService = new CustomerSuccessGlobalOpsService();
