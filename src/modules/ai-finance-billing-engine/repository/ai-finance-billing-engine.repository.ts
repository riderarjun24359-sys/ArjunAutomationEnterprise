import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import type { AiFinanceBillingEngineRawData, CreateInvoiceInput } from "../types";

const LIMIT = 500;
const q = { limit: LIMIT, orderBy: "created_at" as const, orderDirection: "desc" as const };

export class AiFinanceBillingEngineRepository {
    async loadOrganizationData(
        authUserId: string,
        email: string,
        fullName?: string | null,
    ): Promise<AiFinanceBillingEngineRawData | null> {
        const context = await resolveOrganizationContext(authUserId, email, fullName);
        if (!context) return null;

        const orgId = context.organizationId;
        const membershipsForUser = await databaseService.memberships.getByUser(context.profileId).catch(() => []);
        const membershipRole =
            membershipsForUser.find((m) => m.organization_id === orgId)?.role_name ??
            membershipsForUser[0]?.role_name ??
            null;

        const [
            clients,
            invoices,
            payments,
            expenses,
            taxRates,
            recurringInvoices,
            brvInvoices,
            brvSubscriptions,
            brvPaymentMethods,
            brvPaymentAttempts,
            brvRefunds,
            brvMrrSnapshots,
            brvArrSnapshots,
            brvCashFlow,
            brvTaxConfigs,
            brvOutstanding,
            brvReminders,
            brvFinanceMetrics,
            brvFinancialHealth,
            brvGrowth,
            brvProjections,
            brvRenewalForecasts,
            brvAccounts,
            brvProrations,
            brvAnalytics,
        ] = await Promise.all([
            databaseService.clients.listByOrganization(orgId, q).catch(() => []),
            databaseService.invoices.listByOrganization(orgId, q).catch(() => []),
            databaseService.payments.listByOrganization(orgId, q).catch(() => []),
            databaseService.expenses.listByOrganization(orgId, q).catch(() => []),
            databaseService.taxRates.listByOrganization(orgId, q).catch(() => []),
            databaseService.recurringInvoices.listByOrganization(orgId, q).catch(() => []),
            databaseService.brvInvoices.listByOrganization(orgId, q).catch(() => []),
            databaseService.brvSubscriptionBillings.listByOrganization(orgId, q).catch(() => []),
            databaseService.brvPaymentMethods.listByOrganization(orgId, q).catch(() => []),
            databaseService.brvPaymentAttempts.listByOrganization(orgId, q).catch(() => []),
            databaseService.brvRefunds.listByOrganization(orgId, q).catch(() => []),
            databaseService.brvMrrSnapshots.listByOrganization(orgId, q).catch(() => []),
            databaseService.brvArrSnapshots.listByOrganization(orgId, q).catch(() => []),
            databaseService.brvCashFlowRecords.listByOrganization(orgId, q).catch(() => []),
            databaseService.brvTaxConfigs.listByOrganization(orgId, q).catch(() => []),
            databaseService.brvOutstandingBalances.listByOrganization(orgId, q).catch(() => []),
            databaseService.brvPaymentReminders.listByOrganization(orgId, q).catch(() => []),
            databaseService.brvFinanceMetrics.listByOrganization(orgId, q).catch(() => []),
            databaseService.brvFinancialHealth.listByOrganization(orgId, q).catch(() => []),
            databaseService.brvRevenueGrowthMetrics.listByOrganization(orgId, q).catch(() => []),
            databaseService.brvRevenueProjections.listByOrganization(orgId, q).catch(() => []),
            databaseService.brvRenewalForecasts.listByOrganization(orgId, q).catch(() => []),
            databaseService.brvBillingAccounts.listByOrganization(orgId, q).catch(() => []),
            databaseService.brvProrationRecords.listByOrganization(orgId, q).catch(() => []),
            databaseService.brvAnalyticsSnapshots.listByOrganization(orgId, q).catch(() => []),
        ]);

        return {
            organizationId: orgId,
            membershipRole,
            clients: clients.map((c) => ({
                id: c.id,
                name: c.name || "Client",
            })),
            invoices: invoices.map((r) => ({
                id: r.id,
                number: r.number,
                status: r.status,
                issue_date: r.issue_date,
                due_date: r.due_date ?? null,
                subtotal: Number(r.subtotal ?? 0),
                tax_amount: Number(r.tax_amount ?? 0),
                total: Number(r.total ?? 0),
                amount_paid: Number(r.amount_paid ?? 0),
                currency: r.currency,
                notes: r.notes,
                client_id: r.client_id ?? null,
            })),
            payments: payments.map((r) => ({
                id: r.id,
                invoice_id: r.invoice_id,
                amount: Number(r.amount ?? 0),
                payment_date: r.payment_date,
                method: r.method,
                reference: r.reference,
                status: r.status,
                client_id: r.client_id ?? null,
            })),
            expenses: expenses.map((r) => ({
                id: r.id,
                category: r.category,
                description: r.description,
                amount: Number(r.amount ?? 0),
                expense_date: r.expense_date,
                status: r.status,
                client_id: r.client_id ?? null,
                project_id: r.project_id ?? null,
            })),
            taxRates: taxRates.map((r) => ({
                id: r.id,
                name: r.name,
                rate_percent: Number(r.rate_percent ?? 0),
                is_default: Boolean(r.is_default),
            })),
            recurringInvoices: recurringInvoices.map((r) => ({
                id: r.id,
                title: r.title,
                frequency: r.frequency,
                next_run_date: r.next_run_date,
                total: Number(r.total ?? 0),
                is_active: Boolean(r.is_active),
                notes: r.notes,
                client_id: r.client_id,
            })),
            brvInvoices: brvInvoices.map((r) => ({
                id: r.id,
                invoice_number: r.invoice_number,
                subtotal_usd: Number(r.subtotal_usd ?? 0),
                tax_amount: Number(r.tax_amount ?? 0),
                total_usd: Number(r.total_usd ?? 0),
                amount_due_usd: Number(r.amount_due_usd ?? 0),
                invoice_date: r.invoice_date,
                due_date: r.due_date ?? null,
                payment_status: r.payment_status,
                status: r.status,
                billing_account_id: r.billing_account_id,
            })),
            brvSubscriptions: brvSubscriptions.map((r) => ({
                id: r.id,
                plan_name: r.plan_name,
                billing_cycle: r.billing_cycle,
                amount_usd: Number(r.amount_usd ?? 0),
                mrr_usd: Number(r.mrr_usd ?? 0),
                arr_usd: Number(r.arr_usd ?? 0),
                status: r.status,
                payment_status: r.payment_status,
                renews_at: r.renews_at ?? null,
                starts_at: r.starts_at,
                ends_at: r.ends_at ?? null,
                billing_account_id: r.billing_account_id,
            })),
            brvPaymentMethods: brvPaymentMethods.map((r) => ({
                id: r.id,
                method_type: r.method_type,
                brand: r.brand,
                last_four: r.last_four,
                status: r.status,
                is_default: Boolean(r.is_default),
            })),
            brvPaymentAttempts: brvPaymentAttempts.map((r) => ({
                id: r.id,
                amount_usd: Number(r.amount_usd ?? 0),
                payment_status: r.payment_status,
                gateway_reference: r.gateway_reference,
                failure_reason: r.failure_reason,
                attempted_at: r.attempted_at,
                status: r.status,
            })),
            brvRefunds: brvRefunds.map((r) => ({
                id: r.id,
                amount_usd: Number(r.amount_usd ?? 0),
                refund_reason: r.refund_reason,
                refund_status: r.refund_status,
                processed_at: r.processed_at ?? null,
                status: r.status,
            })),
            brvMrrSnapshots: brvMrrSnapshots.map((r) => ({
                id: r.id,
                snapshot_date: r.snapshot_date,
                mrr_usd: Number(r.mrr_usd ?? 0),
                previous_mrr_usd: Number(r.previous_mrr_usd ?? 0),
                status: r.status,
            })),
            brvArrSnapshots: brvArrSnapshots.map((r) => ({
                id: r.id,
                snapshot_date: r.snapshot_date,
                arr_usd: Number(r.arr_usd ?? 0),
                previous_arr_usd: Number(r.previous_arr_usd ?? 0),
                status: r.status,
            })),
            brvCashFlow: brvCashFlow.map((r) => ({
                id: r.id,
                record_date: r.record_date,
                inflow_usd: Number(r.inflow_usd ?? 0),
                outflow_usd: Number(r.outflow_usd ?? 0),
                net_cash_usd: Number(r.net_cash_usd ?? 0),
                category: r.category,
                status: r.status,
            })),
            brvTaxConfigs: brvTaxConfigs.map((r) => ({
                id: r.id,
                tax_name: r.tax_name,
                gst_rate: Number(r.gst_rate ?? 0),
                tax_type: r.tax_type,
                jurisdiction: r.jurisdiction,
                is_default: Boolean(r.is_default),
                status: r.status,
            })),
            brvOutstanding: brvOutstanding.map((r) => ({
                id: r.id,
                total_outstanding_usd: Number(r.total_outstanding_usd ?? 0),
                overdue_usd: Number(r.overdue_usd ?? 0),
                current_usd: Number(r.current_usd ?? 0),
                days_overdue: Number(r.days_overdue ?? 0),
                status: r.status,
                billing_account_id: r.billing_account_id,
            })),
            brvReminders: brvReminders.map((r) => ({
                id: r.id,
                reminder_type: r.reminder_type,
                channel: r.channel,
                status: r.status,
                next_reminder_at: r.next_reminder_at ?? null,
                sent_at: r.sent_at ?? null,
            })),
            brvFinanceMetrics: brvFinanceMetrics.map((r) => ({
                id: r.id,
                metric_date: r.metric_date,
                total_mrr_usd: Number(r.total_mrr_usd ?? 0),
                total_arr_usd: Number(r.total_arr_usd ?? 0),
                total_revenue_usd: Number(r.total_revenue_usd ?? 0),
                collection_rate_percent: Number(r.collection_rate_percent ?? 0),
                dso_days: Number(r.dso_days ?? 0),
                status: r.status,
            })),
            brvFinancialHealth: brvFinancialHealth.map((r) => ({
                id: r.id,
                health_date: r.health_date,
                overall_score: Number(r.overall_score ?? 0),
                liquidity_score: Number(r.liquidity_score ?? 0),
                collection_score: Number(r.collection_score ?? 0),
                summary: r.summary,
                status: r.status,
            })),
            brvGrowth: brvGrowth.map((r) => ({
                id: r.id,
                metric_date: r.metric_date,
                growth_rate_percent: Number(r.growth_rate_percent ?? 0),
                expansion_revenue_usd: Number(r.expansion_revenue_usd ?? 0),
                contraction_revenue_usd: Number(r.contraction_revenue_usd ?? 0),
                status: r.status,
            })),
            brvProjections: brvProjections.map((r) => ({
                id: r.id,
                projection_date: r.projection_date,
                projected_revenue_usd: Number(r.projected_revenue_usd ?? 0),
                projection_horizon_months: Number(r.projection_horizon_months ?? 0),
                status: r.status,
            })),
            brvRenewalForecasts: brvRenewalForecasts.map((r) => ({
                id: r.id,
                forecast_date: r.forecast_date,
                renewal_amount_usd: Number(r.renewal_amount_usd ?? 0),
                renewal_probability: Number(r.renewal_probability ?? 0),
                status: r.status,
            })),
            brvAccounts: brvAccounts.map((r) => ({
                id: r.id,
                account_name: r.account_name,
                billing_email: r.billing_email,
                status: r.status,
            })),
            brvProrations: brvProrations.map((r) => ({
                id: r.id,
                proration_type: r.proration_type,
                prorated_amount_usd: Number(r.prorated_amount_usd ?? 0),
                reason: r.reason,
                status: r.status,
                effective_date: r.effective_date,
            })),
            brvAnalytics: brvAnalytics.map((r) => ({
                id: r.id,
                snapshot_date: r.snapshot_date,
                total_revenue_usd: Number(r.total_revenue_usd ?? 0),
                mrr_usd: Number(r.mrr_usd ?? 0),
                arr_usd: Number(r.arr_usd ?? 0),
                status: r.status,
            })),
        };
    }

    async createInvoice(
        authUserId: string,
        email: string,
        input: CreateInvoiceInput,
        fullName?: string | null,
    ): Promise<{ ok: boolean; id?: string; error?: string }> {
        const context = await resolveOrganizationContext(authUserId, email, fullName);
        if (!context) return { ok: false, error: "No organization context" };

        const created = await databaseService.invoices.create({
            organization_id: context.organizationId,
            client_id: input.clientId ?? null,
            number: input.number,
            status: input.status ?? "draft",
            issue_date: input.issueDate,
            due_date: input.dueDate ?? null,
            subtotal: input.subtotal,
            tax_amount: input.taxAmount,
            total: input.total,
            amount_paid: 0,
            currency: input.currency ?? "USD",
            notes: input.notes ?? "",
        });

        if (!created) return { ok: false, error: "Failed to create invoice" };
        return { ok: true, id: created.id };
    }
}

export const aiFinanceBillingEngineRepository = new AiFinanceBillingEngineRepository();
