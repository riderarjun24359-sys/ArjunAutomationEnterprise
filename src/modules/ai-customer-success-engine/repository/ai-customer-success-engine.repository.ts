import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import type { AiCustomerSuccessEngineRawData } from "../types";

const LIMIT = 500;
const q = { limit: LIMIT, orderBy: "created_at" as const, orderDirection: "desc" as const };

export class AiCustomerSuccessEngineRepository {
    async loadOrganizationData(
        authUserId: string,
        email: string,
        fullName?: string | null,
    ): Promise<AiCustomerSuccessEngineRawData | null> {
        const context = await resolveOrganizationContext(authUserId, email, fullName);
        if (!context) return null;

        const orgId = context.organizationId;
        const membershipsForUser = await databaseService.memberships.getByUser(context.profileId).catch(() => []);
        const membershipRole =
            membershipsForUser.find((m) => m.organization_id === orgId)?.role_name ??
            membershipsForUser[0]?.role_name ??
            null;

        const [
            tickets,
            priorities,
            queues,
            slas,
            knowledgeArticles,
            cannedResponses,
            escalationRules,
            satisfaction,
            healthScores,
            adoption,
            churnPredictions,
            expansions,
            renewals,
            slaMonitoring,
            kpiDashboards,
            executiveSummaries,
            faqs,
            knowledgeEntries,
            playbooks,
            riskAnalyses,
        ] = await Promise.all([
            databaseService.supportTickets.listByOrganization(orgId, q).catch(() => []),
            databaseService.supportPriorities.listByOrganization(orgId, q).catch(() => []),
            databaseService.supportQueues.listByOrganization(orgId, q).catch(() => []),
            databaseService.supportSlas.listByOrganization(orgId, q).catch(() => []),
            databaseService.supportKnowledgeArticles.listByOrganization(orgId, q).catch(() => []),
            databaseService.supportCannedResponses.listByOrganization(orgId, q).catch(() => []),
            databaseService.supportEscalationRules.listByOrganization(orgId, q).catch(() => []),
            databaseService.supportSatisfactionRatings.listByOrganization(orgId, q).catch(() => []),
            databaseService.csHealthScores.listByOrganization(orgId, q).catch(() => []),
            databaseService.csAdoptionTracking.listByOrganization(orgId, q).catch(() => []),
            databaseService.csChurnPredictions.listByOrganization(orgId, q).catch(() => []),
            databaseService.csExpansionOpportunities.listByOrganization(orgId, q).catch(() => []),
            databaseService.csRenewalPlans.listByOrganization(orgId, q).catch(() => []),
            databaseService.csSlaMonitoring.listByOrganization(orgId, q).catch(() => []),
            databaseService.csSuccessKpiDashboards.listByOrganization(orgId, q).catch(() => []),
            databaseService.csExecutiveSummaries.listByOrganization(orgId, q).catch(() => []),
            databaseService.aagoFaqLibrary.listByOrganization(orgId, q).catch(() => []),
            databaseService.knowledgeEntries.listByOrganization(orgId, q).catch(() => []),
            databaseService.csSuccessPlaybooks.listByOrganization(orgId, q).catch(() => []),
            databaseService.csRiskAnalyses.listByOrganization(orgId, q).catch(() => []),
        ]);

        return {
            organizationId: orgId,
            membershipRole,
            tickets: tickets.map((r) => ({
                id: r.id,
                ticket_number: r.ticket_number,
                subject: r.subject,
                description: r.description,
                status: r.status,
                priority_id: r.priority_id ?? null,
                queue_id: r.queue_id ?? null,
                due_at: r.due_at ?? null,
                resolved_at: r.resolved_at ?? null,
                created_at: r.created_at,
            })),
            priorities: priorities.map((r) => ({
                id: r.id,
                name: r.name,
                level: Number(r.level ?? 0),
                response_hours: Number(r.response_hours ?? 0),
            })),
            queues: queues.map((r) => ({
                id: r.id,
                name: r.name,
                code: r.code,
                is_active: Boolean(r.is_active),
            })),
            slas: slas.map((r) => ({
                id: r.id,
                name: r.name,
                first_response_minutes: Number(r.first_response_minutes ?? 0),
                resolution_minutes: Number(r.resolution_minutes ?? 0),
                is_active: Boolean(r.is_active),
            })),
            knowledgeArticles: knowledgeArticles.map((r) => ({
                id: r.id,
                title: r.title,
                content: r.content,
                status: r.status,
                view_count: Number(r.view_count ?? 0),
            })),
            cannedResponses: cannedResponses.map((r) => ({
                id: r.id,
                title: r.title,
                shortcut: r.shortcut,
                body: r.body,
            })),
            escalationRules: escalationRules.map((r) => ({
                id: r.id,
                name: r.name,
                trigger_condition: r.trigger_condition,
                escalation_level: Number(r.escalation_level ?? 0),
                is_active: Boolean(r.is_active),
            })),
            satisfaction: satisfaction.map((r) => ({
                id: r.id,
                rating: Number(r.rating ?? 0),
                comment: r.comment,
                submitted_at: r.submitted_at,
            })),
            healthScores: healthScores.map((r) => ({
                id: r.id,
                name: r.name,
                overall_score: Number(r.overall_score ?? 0),
                status: r.status,
            })),
            adoption: adoption.map((r) => ({
                id: r.id,
                name: r.name,
                adoption_percent: Number(r.adoption_percent ?? 0),
                status: r.status,
            })),
            churnPredictions: churnPredictions.map((r) => ({
                id: r.id,
                name: r.name,
                churn_probability: Number(r.churn_probability ?? 0),
                status: r.status,
            })),
            expansions: expansions.map((r) => ({
                id: r.id,
                name: r.name,
                estimated_value_usd: Number(r.estimated_value_usd ?? 0),
                status: r.status,
            })),
            renewals: renewals.map((r) => ({
                id: r.id,
                name: r.name,
                renewal_date: r.renewal_date ?? null,
                renewal_value_usd: Number(r.renewal_value_usd ?? 0),
                status: r.status,
            })),
            slaMonitoring: slaMonitoring.map((r) => ({
                id: r.id,
                name: r.name,
                compliance_percent: Number(r.compliance_percent ?? 0),
                status: r.status,
            })),
            kpiDashboards: kpiDashboards.map((r) => ({
                id: r.id,
                name: r.name,
                refresh_cadence: r.refresh_cadence,
                status: r.status,
            })),
            executiveSummaries: executiveSummaries.map((r) => ({
                id: r.id,
                title: r.title,
                summary_content: r.summary_content,
                status: r.status,
            })),
            faqs: faqs.map((r) => ({
                id: r.id,
                faq_question: r.faq_question,
                faq_category: r.faq_category,
                faq_status: r.faq_status,
                answer_ref: r.answer_ref,
                status: r.status,
            })),
            knowledgeEntries: knowledgeEntries.map((r) => ({
                id: r.id,
                title: r.title,
                category: r.category,
                status: r.status,
                content: r.content,
            })),
            playbooks: playbooks.map((r) => ({
                id: r.id,
                name: r.name,
                playbook_type: r.playbook_type,
                status: r.status,
            })),
            riskAnalyses: riskAnalyses.map((r) => ({
                id: r.id,
                name: r.name,
                risk_level: r.risk_level,
                status: r.status,
            })),
        };
    }
}

export const aiCustomerSuccessEngineRepository = new AiCustomerSuccessEngineRepository();
