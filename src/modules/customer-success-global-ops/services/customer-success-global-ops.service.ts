import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { productionLog } from "@/src/lib/production-logger";
import { csgRepository } from "../customer-success-global-ops-repository";
import { generateAiRecommendations, generateImprovementBacklog } from "../engines/continuous-improvement.engine";
import { computeCsatAverage, computeNpsScore } from "../engines/customer-feedback.engine";
import { computeHealthScores } from "../engines/customer-success-os.engine";
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
        const integrationIssues = [
            business.available ? null : "Business Platform",
            support.available ? null : "Support",
            delivery.available ? null : "Delivery Engine",
            successPlans.length ? null : "Customer health (no success plans)",
            support.available && (support.openTickets > 0 || support.avgSatisfaction > 0) ? null : "Support health (no measurable tickets or satisfaction data)",
            delivery.available && delivery.activeEngagements > 0 ? null : "Delivery health (no active engagements)",
        ].filter((item): item is string => Boolean(item));
        const renewals = storedRenewals;
        const escalations = storedEscalations;
        const onboardingSessions = storedOnboarding;
        const deliveryMilestones = storedMilestones;
        const deliveryHealth = delivery.available && delivery.activeEngagements > 0
            ? (deliveryMilestones.length
                ? computeDeliveryHealth(delivery.qualityPassRate, deliveryMilestones)
                : delivery.qualityPassRate)
            : 0;
        const feedback = storedFeedback;
        const csatAverage = computeCsatAverage(feedback);
        const npsScore = computeNpsScore(feedback);
        const supportHealth = support.available && (support.openTickets > 0 || support.avgSatisfaction > 0)
            ? computeSupportHealth(support)
            : 0;
        const queue = classifyLiveQueue(tickets);

        const improvementBacklog = storedImprovements.length
            ? storedImprovements
            : generateImprovementBacklog({
                feedback,
                deliveryHealth: delivery.available && delivery.activeEngagements > 0 ? deliveryHealth : null,
                supportHealth: support.available && (support.openTickets > 0 || support.avgSatisfaction > 0) ? supportHealth : null,
                customerHealth: successPlans.length ? customerHealth : null,
                openTickets: support.available ? support.openTickets : 0,
            });

        const dashboard: GlobalOperationsDashboard = {
            activeClients: business.activeClients,
            activeProjects: business.activeProjects,
            openTickets: support.openTickets,
            slaCompliance: support.slaCompliance,
            deliveryHealth,
            customerHealth,
            revenueOverview: {
                mrr: 0, // No provider-verified recurring payment ledger is connected yet.
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
            satisfactionTrend: [], // No historical satisfaction ledger is available; never synthesize a trend.
            integrationIssues,
        };

        dashboard.aiRecommendations = generateAiRecommendations({
            customerHealth: successPlans.length ? customerHealth : null,
            supportHealth: support.available && (support.openTickets > 0 || support.avgSatisfaction > 0) ? supportHealth : null,
            deliveryHealth: delivery.available && delivery.activeEngagements > 0 ? deliveryHealth : null,
            openTickets: support.available ? support.openTickets : 0,
            renewals,
            escalations,
        });

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
