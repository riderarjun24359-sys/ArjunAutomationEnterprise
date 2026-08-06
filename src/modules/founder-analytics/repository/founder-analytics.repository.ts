import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import type { FounderAnalyticsRawData } from "../types";

const LIMIT = 500;
const q = { limit: LIMIT, orderBy: "created_at" as const, orderDirection: "desc" as const };

export class FounderAnalyticsRepository {
    async loadOrganizationData(
        authUserId: string,
        email: string,
        fullName?: string | null,
    ): Promise<FounderAnalyticsRawData | null> {
        const context = await resolveOrganizationContext(authUserId, email, fullName);
        if (!context) return null;

        const orgId = context.organizationId;
        const memberships = await databaseService.memberships.getByUser(context.profileId).catch(() => []);
        const membershipRole = memberships.find((m) => m.organization_id === orgId)?.role_name ?? memberships[0]?.role_name ?? null;

        const [
            organizations,
            billingAccounts,
            subscriptions,
            mrrSnapshots,
            arrSnapshots,
            mrrForecasts,
            paymentAttempts,
            invoices,
            payments,
            clients,
            healthScores,
            expansions,
            churnPredictions,
            adoption,
            salesLeads,
            campaigns,
            campaignDeliveries,
            campaignMetrics,
            satisfaction,
            feedbackAnalyses,
            growthMetrics,
            securityAlerts,
            audits,
        ] = await Promise.all([
            databaseService.organizations.list({ limit: LIMIT }).catch(() => []),
            databaseService.brvBillingAccounts.listByOrganization(orgId, q).catch(() => []),
            databaseService.brvSubscriptionBillings.listByOrganization(orgId, q).catch(() => []),
            databaseService.brvMrrSnapshots.listByOrganization(orgId, q).catch(() => []),
            databaseService.brvArrSnapshots.listByOrganization(orgId, q).catch(() => []),
            databaseService.brvMrrForecasts.listByOrganization(orgId, q).catch(() => []),
            databaseService.brvPaymentAttempts.listByOrganization(orgId, q).catch(() => []),
            databaseService.invoices.listByOrganization(orgId, q).catch(() => []),
            databaseService.payments.listByOrganization(orgId, q).catch(() => []),
            databaseService.clients.listByOrganization(orgId, q).catch(() => []),
            databaseService.csHealthScores.listByOrganization(orgId, q).catch(() => []),
            databaseService.csExpansionOpportunities.listByOrganization(orgId, q).catch(() => []),
            databaseService.csChurnPredictions.listByOrganization(orgId, q).catch(() => []),
            databaseService.csAdoptionTracking.listByOrganization(orgId, q).catch(() => []),
            databaseService.salesLeads.listByOrganization(orgId, q).catch(() => []),
            databaseService.cnhCampaigns.listByOrganization(orgId, q).catch(() => []),
            databaseService.cnhCampaignDeliveries.listByOrganization(orgId, q).catch(() => []),
            databaseService.cnhCampaignMetrics.listByOrganization(orgId, q).catch(() => []),
            databaseService.supportSatisfactionRatings.listByOrganization(orgId, q).catch(() => []),
            databaseService.csFeedbackAnalyses.listByOrganization(orgId, q).catch(() => []),
            databaseService.aageGrowthMetrics.listByOrganization(orgId, q).catch(() => []),
            databaseService.idpSecurityAlerts.listByOrganization(orgId, q).catch(() => []),
            databaseService.audits.list({ limit: 100, orderBy: "created_at", orderDirection: "desc", filters: { organization_id: orgId } }).catch(() => []),
        ]);

        return {
            organizationId: orgId,
            membershipRole,
            organizations: organizations.map((o) => ({
                id: o.id,
                name: o.name,
                status: o.status,
                created_at: o.created_at,
            })),
            billingAccounts: billingAccounts.map((a) => ({
                id: a.id,
                account_name: a.account_name,
                status: a.status,
                created_at: a.created_at,
            })),
            subscriptions: subscriptions.map((s) => ({
                id: s.id,
                plan_name: s.plan_name,
                mrr_usd: Number(s.mrr_usd ?? 0),
                arr_usd: Number(s.arr_usd ?? 0),
                status: s.status,
                payment_status: s.payment_status,
                starts_at: s.starts_at,
                ends_at: s.ends_at,
                created_at: s.created_at,
                billing_account_id: s.billing_account_id,
            })),
            mrrSnapshots: mrrSnapshots.map((s) => ({
                mrr_usd: Number(s.mrr_usd ?? 0),
                previous_mrr_usd: Number(s.previous_mrr_usd ?? 0),
                churn_mrr_usd: Number(s.churn_mrr_usd ?? 0),
                new_mrr_usd: Number(s.new_mrr_usd ?? 0),
                expansion_mrr_usd: Number(s.expansion_mrr_usd ?? 0),
                contraction_mrr_usd: Number(s.contraction_mrr_usd ?? 0),
                snapshot_date: s.snapshot_date,
            })),
            arrSnapshots: arrSnapshots.map((s) => ({
                arr_usd: Number(s.arr_usd ?? 0),
                previous_arr_usd: Number(s.previous_arr_usd ?? 0),
                snapshot_date: s.snapshot_date,
            })),
            mrrForecasts: mrrForecasts.map((f) => ({
                projected_mrr_usd: Number(f.projected_mrr_usd ?? 0),
                forecast_date: f.forecast_date,
                confidence_percent: Number(f.confidence_percent ?? 0),
            })),
            paymentAttempts: paymentAttempts.map((p) => ({
                amount_usd: Number(p.amount_usd ?? 0),
                payment_status: p.payment_status,
                status: p.status,
                attempted_at: p.attempted_at,
                failure_reason: p.failure_reason,
            })),
            invoices: invoices.map((inv) => ({
                total: Number(inv.total ?? 0),
                amount_paid: Number(inv.amount_paid ?? 0),
                amount_due: Math.max(0, Number(inv.total ?? 0) - Number(inv.amount_paid ?? 0)),
                status: String(inv.status ?? ""),
                issue_date: inv.issue_date,
                created_at: inv.created_at,
            })),
            payments: payments.map((p) => ({
                amount: Number(p.amount ?? 0),
                status: String(p.status ?? ""),
                paid_at: p.payment_date,
                created_at: p.created_at,
            })),
            clients: clients.map((c) => ({
                id: c.id,
                name: c.name,
                status: c.status,
                lifecycle_stage: c.lifecycle_stage,
                created_at: c.created_at,
                updated_at: c.updated_at,
            })),
            healthScores: healthScores.map((h) => ({
                id: h.id,
                name: h.name,
                overall_score: Number(h.overall_score ?? 0),
                status: h.status,
                engagement_id: h.engagement_id,
            })),
            expansions: expansions.map((e) => ({
                id: e.id,
                name: e.name,
                estimated_value_usd: Number(e.estimated_value_usd ?? 0),
                opportunity_type: e.opportunity_type,
                status: e.status,
            })),
            churnPredictions: churnPredictions.map((c) => ({
                id: c.id,
                name: c.name,
                churn_probability: Number(c.churn_probability ?? 0),
                status: c.status,
            })),
            adoption: adoption.map((a) => ({
                id: a.id,
                name: a.name,
                adoption_score: Number(a.adoption_percent ?? 0),
                feature_adoption: a.feature_adoptions,
                status: a.status,
            })),
            salesLeads: salesLeads.map((l) => ({
                id: l.id,
                lead_name: l.lead_name,
                source: l.source,
                status: l.status,
                score: Number(l.score ?? 0),
                created_at: l.created_at,
            })),
            campaigns: campaigns.map((c) => ({
                id: c.id,
                campaign_name: c.campaign_name,
                channel_type: c.channel_type,
                status: c.status,
            })),
            campaignDeliveries: campaignDeliveries.map((d) => ({
                campaign_id: d.campaign_id,
                delivery_status: d.delivery_status,
            })),
            campaignMetrics: campaignMetrics.map((m) => ({
                campaign_id: m.campaign_id,
                sent_count: m.sent_count,
                delivered_count: m.delivered_count,
                open_rate: m.open_rate,
                click_rate: m.click_rate,
            })),
            satisfaction: satisfaction.map((s) => ({
                rating: Number(s.rating ?? 0),
                submitted_at: s.submitted_at,
            })),
            feedbackAnalyses: feedbackAnalyses.map((f) => ({
                name: f.name,
                sentiment_score: Number(f.sentiment_score ?? 0),
                status: f.status,
            })),
            growthMetrics: growthMetrics.map((g) => ({
                overall_growth_score: Number(g.overall_growth_score ?? 0),
                marketing_overview_score: Number(g.marketing_overview_score ?? 0),
                metric_date: g.metric_date,
            })),
            securityThreats: securityAlerts.map((a) => ({
                id: a.id,
                title: a.title,
                severity: a.severity,
                status: a.status,
                created_at: a.created_at,
            })),
            auditEvents: audits.map((a) => ({
                id: a.id,
                action: String(a.action ?? ""),
                summary: `${a.action}${a.entity_type ? ` · ${a.entity_type}` : ""}`,
                created_at: a.created_at,
            })),
            fetchedAt: new Date().toISOString(),
        };
    }
}

export const founderAnalyticsRepository = new FounderAnalyticsRepository();
