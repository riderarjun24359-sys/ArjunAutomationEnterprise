import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import type { GrowthEngineV1RawData } from "../types";

const LIMIT = 400;
const q = { limit: LIMIT, orderBy: "created_at" as const, orderDirection: "desc" as const };

export class GrowthEngineV1Repository {
    async loadOrganizationData(
        authUserId: string,
        email: string,
        fullName?: string | null,
    ): Promise<GrowthEngineV1RawData | null> {
        const context = await resolveOrganizationContext(authUserId, email, fullName);
        if (!context) return null;

        const orgId = context.organizationId;
        const membershipsForUser = await databaseService.memberships.getByUser(context.profileId).catch(() => []);
        const membershipRole =
            membershipsForUser.find((m) => m.organization_id === orgId)?.role_name ??
            membershipsForUser[0]?.role_name ??
            null;

        const [
            salesLeads,
            campaigns,
            campaignMetrics,
            attributions,
            opportunities,
            pipelineStages,
            quotes,
            activities,
            winLoss,
            subscriptions,
            churnPredictions,
            renewals,
            expansions,
            lifecycles,
            mrrSnapshots,
            arrSnapshots,
            adoption,
            organizations,
            orgMemberships,
            growthKpis,
            payments,
        ] = await Promise.all([
            databaseService.salesLeads.listByOrganization(orgId, q).catch(() => []),
            databaseService.cnhCampaigns.listByOrganization(orgId, q).catch(() => []),
            databaseService.cnhCampaignMetrics.listByOrganization(orgId, q).catch(() => []),
            databaseService.aagoLeadAttribution.listByOrganization(orgId, q).catch(() => []),
            databaseService.salesOpportunities.listByOrganization(orgId, q).catch(() => []),
            databaseService.salesPipelineStages.listByOrganization(orgId, q).catch(() => []),
            databaseService.salesQuotes.listByOrganization(orgId, q).catch(() => []),
            databaseService.salesActivities.listByOrganization(orgId, q).catch(() => []),
            databaseService.salesWinLossRecords.listByOrganization(orgId, q).catch(() => []),
            databaseService.brvSubscriptionBillings.listByOrganization(orgId, q).catch(() => []),
            databaseService.csChurnPredictions.listByOrganization(orgId, q).catch(() => []),
            databaseService.csRenewalPlans.listByOrganization(orgId, q).catch(() => []),
            databaseService.csExpansionOpportunities.listByOrganization(orgId, q).catch(() => []),
            databaseService.csLifecycleManagement.listByOrganization(orgId, q).catch(() => []),
            databaseService.brvMrrSnapshots.listByOrganization(orgId, q).catch(() => []),
            databaseService.brvArrSnapshots.listByOrganization(orgId, q).catch(() => []),
            databaseService.csAdoptionTracking.listByOrganization(orgId, q).catch(() => []),
            databaseService.organizations.list({ limit: LIMIT }).catch(() => []),
            databaseService.memberships.listByOrganization(orgId).catch(() => []),
            databaseService.aagoGrowthKpis.listByOrganization(orgId, q).catch(() => []),
            databaseService.payments.listByOrganization(orgId, q).catch(() => []),
        ]);

        return {
            organizationId: orgId,
            membershipRole,
            salesLeads: salesLeads.map((l) => ({
                id: l.id,
                lead_name: l.lead_name,
                company_name: l.company_name,
                email: l.email,
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
                starts_at: c.starts_at,
                ends_at: c.ends_at,
            })),
            campaignMetrics: campaignMetrics.map((m) => ({
                campaign_id: m.campaign_id,
                open_rate: Number(m.open_rate ?? 0),
                click_rate: Number(m.click_rate ?? 0),
                sent_count: Number(m.sent_count ?? 0),
                delivered_count: Number(m.delivered_count ?? 0),
            })),
            attributions: attributions.map((a) => ({
                id: a.id,
                attribution_title: a.attribution_title,
                channel_ref: a.channel_ref,
                conversion_rate: Number(a.conversion_rate ?? 0),
                attribution_status: a.attribution_status,
                status: a.status,
            })),
            opportunities: opportunities.map((o) => ({
                id: o.id,
                name: o.name,
                amount: Number(o.amount ?? 0),
                probability: Number(o.probability ?? 0),
                status: o.status,
                expected_close_date: o.expected_close_date,
                stage_id: o.stage_id,
            })),
            pipelineStages: pipelineStages.map((s) => ({
                id: s.id,
                name: s.name,
                position: s.sort_order,
            })),
            quotes: quotes.map((qrow) => ({
                id: qrow.id,
                title: qrow.title,
                quote_number: qrow.quote_number,
                total_amount: Number(qrow.total_amount ?? 0),
                status: qrow.status,
                valid_until: qrow.valid_until,
            })),
            activities: activities.map((a) => ({
                id: a.id,
                subject: a.subject,
                activity_type: a.activity_type,
                due_at: a.due_at,
                completed_at: a.completed_at,
                opportunity_id: a.opportunity_id,
            })),
            winLoss: winLoss.map((w) => ({
                id: w.id,
                outcome: w.outcome,
                reason: w.reason,
                amount: Number(w.amount ?? 0),
                competitor: w.competitor,
                recorded_at: w.recorded_at,
            })),
            subscriptions: subscriptions.map((s) => ({
                id: s.id,
                plan_name: s.plan_name,
                status: s.status,
                payment_status: s.payment_status,
                mrr_usd: Number(s.mrr_usd ?? 0),
                arr_usd: Number(s.arr_usd ?? 0),
                starts_at: s.starts_at,
                ends_at: s.ends_at,
                created_at: s.created_at,
            })),
            churnPredictions: churnPredictions.map((c) => ({
                id: c.id,
                name: c.name,
                churn_probability: Number(c.churn_probability ?? 0),
                status: c.status,
            })),
            renewals: renewals.map((r) => ({
                id: r.id,
                name: r.name,
                renewal_date: r.renewal_date,
                renewal_value_usd: Number(r.renewal_value_usd ?? 0),
                status: r.status,
            })),
            expansions: expansions.map((e) => ({
                id: e.id,
                name: e.name,
                opportunity_type: e.opportunity_type,
                estimated_value_usd: Number(e.estimated_value_usd ?? 0),
                status: e.status,
            })),
            lifecycles: lifecycles.map((l) => ({
                id: l.id,
                name: l.name,
                current_stage: l.current_stage,
                status: l.status,
            })),
            mrrSnapshots: mrrSnapshots.map((m) => ({
                snapshot_date: m.snapshot_date,
                mrr_usd: Number(m.mrr_usd ?? 0),
                new_mrr_usd: Number(m.new_mrr_usd ?? 0),
                churn_mrr_usd: Number(m.churn_mrr_usd ?? 0),
                previous_mrr_usd: Number(m.previous_mrr_usd ?? 0),
            })),
            arrSnapshots: arrSnapshots.map((a) => ({
                snapshot_date: a.snapshot_date,
                arr_usd: Number(a.arr_usd ?? 0),
            })),
            adoption: adoption.map((a) => ({
                adoption_percent: Number(a.adoption_percent ?? 0),
                status: a.status,
            })),
            organizations: organizations.map((o) => ({
                id: o.id,
                name: o.name,
                status: o.status,
                created_at: o.created_at,
            })),
            memberships: orgMemberships.map((m) => ({
                id: m.id,
                user_id: m.user_id,
                is_active: Boolean(m.is_active),
                organization_id: m.organization_id,
            })),
            growthKpis: growthKpis.map((k) => ({
                kpi_name: k.kpi_name,
                kpi_value: Number(k.kpi_value ?? 0),
                kpi_category: k.kpi_category,
                target_value: Number(k.target_value ?? 0),
            })),
            payments: payments.map((p) => ({
                amount: Number(p.amount ?? 0),
                status: p.status,
                payment_date: p.payment_date,
                created_at: p.created_at,
            })),
        };
    }
}

export const growthEngineV1Repository = new GrowthEngineV1Repository();
