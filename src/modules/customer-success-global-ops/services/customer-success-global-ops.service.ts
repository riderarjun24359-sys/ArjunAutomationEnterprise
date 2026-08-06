import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { productionLog } from "@/src/lib/production-logger";
import { csgRepository } from "../customer-success-global-ops-repository";
import { buildOnboardingSessions } from "../engines/client-onboarding.engine";
import { generateAiRecommendations, generateImprovementBacklog } from "../engines/continuous-improvement.engine";
import { buildDefaultFeedback, buildSatisfactionTrend, computeCsatAverage, computeNpsScore } from "../engines/customer-feedback.engine";
import {
    buildDefaultSuccessPlans,
    buildEscalations,
    buildRenewals,
    computeHealthScores,
} from "../engines/customer-success-os.engine";
import { classifyLiveQueue, computeSupportHealth } from "../engines/global-support-center.engine";
import { buildDeliveryMilestones, computeDeliveryHealth } from "../engines/service-delivery-control.engine";
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

        const successPlans = storedPlans.length ? storedPlans : buildDefaultSuccessPlans(business.activeClients);
        const healthScores = computeHealthScores(successPlans, support.openTickets);
        const customerHealth = healthScores.length
            ? Math.round(healthScores.reduce((s, h) => s + h.score, 0) / healthScores.length)
            : 75;
        const renewals = storedRenewals.length ? storedRenewals : buildRenewals(business.activeClients);
        const escalations = storedEscalations.length ? storedEscalations : buildEscalations(support.incidents);
        const onboardingSessions = buildOnboardingSessions(business.activeClients, storedOnboarding);
        const deliveryMilestones = buildDeliveryMilestones(delivery.activeEngagements, storedMilestones);
        const deliveryHealth = computeDeliveryHealth(delivery.qualityPassRate, deliveryMilestones);
        const feedback = storedFeedback.length ? storedFeedback : buildDefaultFeedback(support.avgSatisfaction);
        const csatAverage = computeCsatAverage(feedback) || support.avgSatisfaction || 4.2;
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
                mrr: renewals.reduce((s, r) => s + r.amount / 12, 0),
                openInvoices: business.openInvoices,
                renewalsDue: renewals.filter((r) => r.status !== "renewed" && r.status !== "churned").length,
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
            if (!storedPlans.length && successPlans[0]) {
                void csgRepository.upsertSuccessPlan(orgId, successPlans[0]);
            }
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
