import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import type { AiSalesLeadEngineRawData } from "../types";

const LIMIT = 500;
const q = { limit: LIMIT, orderBy: "created_at" as const, orderDirection: "desc" as const };

export class AiSalesLeadEngineRepository {
    async loadOrganizationData(
        authUserId: string,
        email: string,
        fullName?: string | null,
    ): Promise<AiSalesLeadEngineRawData | null> {
        const context = await resolveOrganizationContext(authUserId, email, fullName);
        if (!context) return null;

        const orgId = context.organizationId;
        const membershipsForUser = await databaseService.memberships.getByUser(context.profileId).catch(() => []);
        const membershipRole =
            membershipsForUser.find((m) => m.organization_id === orgId)?.role_name ??
            membershipsForUser[0]?.role_name ??
            null;

        const [
            leads,
            opportunities,
            pipelines,
            stages,
            quotes,
            forecasts,
            activities,
            meetings,
            callLogs,
            emailTracking,
            targets,
            winLoss,
            auditLogs,
            proposals,
            contracts,
            baProposals,
            estimates,
        ] = await Promise.all([
            databaseService.salesLeads.listByOrganization(orgId, q).catch(() => []),
            databaseService.salesOpportunities.listByOrganization(orgId, q).catch(() => []),
            databaseService.salesPipelines.listByOrganization(orgId, q).catch(() => []),
            databaseService.salesPipelineStages.listByOrganization(orgId, q).catch(() => []),
            databaseService.salesQuotes.listByOrganization(orgId, q).catch(() => []),
            databaseService.salesForecasts.listByOrganization(orgId, q).catch(() => []),
            databaseService.salesActivities.listByOrganization(orgId, q).catch(() => []),
            databaseService.salesMeetings.listByOrganization(orgId, q).catch(() => []),
            databaseService.salesCallLogs.listByOrganization(orgId, q).catch(() => []),
            databaseService.salesEmailTracking.listByOrganization(orgId, q).catch(() => []),
            databaseService.salesTargets.listByOrganization(orgId, q).catch(() => []),
            databaseService.salesWinLossRecords.listByOrganization(orgId, q).catch(() => []),
            databaseService.salesAuditLogs.listByOrganization(orgId, q).catch(() => []),
            databaseService.cmpProposals.listByOrganization(orgId, q).catch(() => []),
            databaseService.cmpProposalContracts.listByOrganization(orgId, q).catch(() => []),
            databaseService.baProposals.listByOrganization(orgId, q).catch(() => []),
            databaseService.estimates.listByOrganization(orgId, q).catch(() => []),
        ]);

        return {
            organizationId: orgId,
            membershipRole,
            leads: leads.map((r) => ({
                id: r.id,
                lead_name: r.lead_name,
                company_name: r.company_name,
                email: r.email,
                phone: r.phone,
                source: r.source,
                status: r.status,
                score: Number(r.score ?? 0),
                created_at: r.created_at,
            })),
            opportunities: opportunities.map((r) => ({
                id: r.id,
                opportunity_number: r.opportunity_number,
                name: r.name,
                description: r.description,
                pipeline_id: r.pipeline_id ?? null,
                stage_id: r.stage_id ?? null,
                amount: Number(r.amount ?? 0),
                probability: Number(r.probability ?? 0),
                expected_close_date: r.expected_close_date ?? null,
                status: r.status,
                lost_reason: r.lost_reason,
                created_at: r.created_at,
            })),
            pipelines: pipelines.map((r) => ({
                id: r.id,
                name: r.name,
                code: r.code,
                is_default: Boolean(r.is_default),
            })),
            stages: stages.map((r) => ({
                id: r.id,
                pipeline_id: r.pipeline_id,
                name: r.name,
                sort_order: Number(r.sort_order ?? 0),
                probability: Number(r.probability ?? 0),
                is_closed_won: Boolean(r.is_closed_won),
                is_closed_lost: Boolean(r.is_closed_lost),
            })),
            quotes: quotes.map((r) => ({
                id: r.id,
                quote_number: r.quote_number,
                title: r.title,
                status: r.status,
                total_amount: Number(r.total_amount ?? 0),
                valid_until: r.valid_until ?? null,
            })),
            forecasts: forecasts.map((r) => ({
                id: r.id,
                forecast_period: r.forecast_period,
                forecast_date: r.forecast_date,
                pipeline_value: Number(r.pipeline_value ?? 0),
                weighted_value: Number(r.weighted_value ?? 0),
                closed_value: Number(r.closed_value ?? 0),
                notes: r.notes,
            })),
            activities: activities.map((r) => ({
                id: r.id,
                opportunity_id: r.opportunity_id ?? null,
                lead_id: r.lead_id ?? null,
                activity_type: r.activity_type,
                subject: r.subject,
                description: r.description,
                due_at: r.due_at ?? null,
                completed_at: r.completed_at ?? null,
                created_at: r.created_at,
            })),
            meetings: meetings.map((r) => ({
                id: r.id,
                title: r.title,
                scheduled_at: r.scheduled_at,
                status: r.status,
                duration_minutes: Number(r.duration_minutes ?? 0),
            })),
            callLogs: callLogs.map((r) => ({
                id: r.id,
                direction: r.direction,
                outcome: r.outcome,
                called_at: r.called_at,
                notes: r.notes,
            })),
            emailTracking: emailTracking.map((r) => ({
                id: r.id,
                subject: r.subject,
                recipient_email: r.recipient_email,
                status: r.status,
                sent_at: r.sent_at,
                opened_at: r.opened_at ?? null,
            })),
            targets: targets.map((r) => ({
                id: r.id,
                period_label: r.period_label,
                target_amount: Number(r.target_amount ?? 0),
                achieved_amount: Number(r.achieved_amount ?? 0),
            })),
            winLoss: winLoss.map((r) => ({
                id: r.id,
                outcome: r.outcome,
                reason: r.reason,
                competitor: r.competitor,
                amount: Number(r.amount ?? 0),
                recorded_at: r.recorded_at,
            })),
            auditLogs: auditLogs.map((r) => ({
                id: r.id,
                entity_type: r.entity_type,
                action: r.action,
                summary: r.summary,
                created_at: r.created_at,
            })),
            proposals: proposals.map((r) => ({
                id: r.id,
                proposal_name: r.proposal_name,
                proposal_status: r.proposal_status,
                proposal_value: Number(r.proposal_value ?? 0),
                proposal_key: r.proposal_key,
            })),
            contracts: contracts.map((r) => ({
                id: r.id,
                contract_name: r.contract_name,
                contract_status: r.contract_status,
                contract_value: Number(r.contract_value ?? 0),
                contract_key: r.contract_key,
            })),
            baProposals: baProposals.map((r) => ({
                id: r.id,
                title: r.title,
                status: r.status,
            })),
            estimates: estimates.map((r) => ({
                id: r.id,
                number: r.number,
                status: r.status,
                total: Number(r.total ?? 0),
                valid_until: r.valid_until ?? null,
                notes: r.notes,
            })),
        };
    }
}

export const aiSalesLeadEngineRepository = new AiSalesLeadEngineRepository();
