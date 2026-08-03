import type {
    DbBrvBillingAccount,
    DbBrvBillingCycle,
    DbBrvSubscriptionBilling,
    DbBrvProrationRecord,
    DbBrvPaymentMethod,
    DbBrvPaymentAttempt,
    DbBrvRefund,
    DbBrvWalletBalance,
    DbBrvMrrSnapshot,
    DbBrvArrSnapshot,
    DbBrvDeferredRevenue,
    DbBrvRevenueRecognition,
    DbBrvInvoice,
    DbBrvCreditNote,
    DbBrvDebitNote,
    DbBrvTaxConfig,
    DbBrvOutstandingBalance,
    DbBrvPaymentReminder,
    DbBrvCollectionCase,
    DbBrvWriteOff,
    DbBrvAnalyticsSnapshot,
    DbBrvRevenueGrowthMetric,
    DbBrvCashFlowRecord,
    DbBrvSubscriptionTrend,
    DbBrvRenewalForecast,
    DbBrvMrrForecast,
    DbBrvArrForecast,
    DbBrvRevenueProjection,
    DbBrvFinanceMetric,
    DbBrvFinancialHealth,
    DbBrvExpansionContraction,
    DbBrvAuditLog,
} from "@/src/modules/database/types/platform";
import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";
import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";

abstract class OrgBrvRepository<T> extends BaseRepository<T> {
    async listByOrganization(organizationId: string, query: RepositoryQuery = {}): Promise<T[]> {
        const client = getRepositoryClient();
        if (!client) return [];
        const normalized = this.buildQuery(query);
        const { data, error } = await client.from(this.table).select("*").eq("organization_id", organizationId).order(normalized.orderBy, { ascending: normalized.orderDirection === "asc" }).range(normalized.offset, normalized.offset + normalized.limit - 1);
        mapRepositoryError(error, `Failed to list ${this.table}`);
        return (data ?? []) as T[];
    }

    async getById(id: string): Promise<T | null> {
        const client = getRepositoryClient();
        if (!client) return null;
        const { data, error } = await client.from(this.table).select("*").eq("id", id).maybeSingle();
        mapRepositoryError(error, `Failed to get ${this.table}`);
        return (data as T | null) ?? null;
    }

    async create(input: Record<string, unknown>): Promise<T | null> {
        const client = getRepositoryClient();
        if (!client) return null;
        const { data, error } = await client.from(this.table).insert(input).select("*").maybeSingle();
        mapRepositoryError(error, `Failed to create ${this.table}`);
        return (data as T | null) ?? null;
    }

    async update(id: string, input: Record<string, unknown>): Promise<T | null> {
        const client = getRepositoryClient();
        if (!client) return null;
        const { data, error } = await client.from(this.table).update(input).eq("id", id).select("*").maybeSingle();
        mapRepositoryError(error, `Failed to update ${this.table}`);
        return (data as T | null) ?? null;
    }

    async delete(id: string): Promise<boolean> {
        const client = getRepositoryClient();
        if (!client) return false;
        const { error } = await client.from(this.table).delete().eq("id", id);
        mapRepositoryError(error, `Failed to delete ${this.table}`);
        return !error;
    }
}

export class BrvBillingAccountRepository extends OrgBrvRepository<DbBrvBillingAccount> { protected table = "brv_billing_accounts"; }
export class BrvBillingCycleRepository extends OrgBrvRepository<DbBrvBillingCycle> { protected table = "brv_billing_cycles"; }
export class BrvSubscriptionBillingRepository extends OrgBrvRepository<DbBrvSubscriptionBilling> { protected table = "brv_subscription_billings"; }
export class BrvProrationRecordRepository extends OrgBrvRepository<DbBrvProrationRecord> { protected table = "brv_proration_records"; }
export class BrvPaymentMethodRepository extends OrgBrvRepository<DbBrvPaymentMethod> { protected table = "brv_payment_methods"; }
export class BrvPaymentAttemptRepository extends OrgBrvRepository<DbBrvPaymentAttempt> { protected table = "brv_payment_attempts"; }
export class BrvRefundRepository extends OrgBrvRepository<DbBrvRefund> { protected table = "brv_refunds"; }
export class BrvWalletBalanceRepository extends OrgBrvRepository<DbBrvWalletBalance> { protected table = "brv_wallet_balances"; }
export class BrvMrrSnapshotRepository extends OrgBrvRepository<DbBrvMrrSnapshot> { protected table = "brv_mrr_snapshots"; }
export class BrvArrSnapshotRepository extends OrgBrvRepository<DbBrvArrSnapshot> { protected table = "brv_arr_snapshots"; }
export class BrvDeferredRevenueRepository extends OrgBrvRepository<DbBrvDeferredRevenue> { protected table = "brv_deferred_revenue"; }
export class BrvRevenueRecognitionRepository extends OrgBrvRepository<DbBrvRevenueRecognition> { protected table = "brv_revenue_recognition"; }
export class BrvInvoiceRepository extends OrgBrvRepository<DbBrvInvoice> { protected table = "brv_invoices"; }
export class BrvCreditNoteRepository extends OrgBrvRepository<DbBrvCreditNote> { protected table = "brv_credit_notes"; }
export class BrvDebitNoteRepository extends OrgBrvRepository<DbBrvDebitNote> { protected table = "brv_debit_notes"; }
export class BrvTaxConfigRepository extends OrgBrvRepository<DbBrvTaxConfig> { protected table = "brv_tax_configs"; }
export class BrvOutstandingBalanceRepository extends OrgBrvRepository<DbBrvOutstandingBalance> { protected table = "brv_outstanding_balances"; }
export class BrvPaymentReminderRepository extends OrgBrvRepository<DbBrvPaymentReminder> { protected table = "brv_payment_reminders"; }
export class BrvCollectionCaseRepository extends OrgBrvRepository<DbBrvCollectionCase> { protected table = "brv_collection_cases"; }
export class BrvWriteOffRepository extends OrgBrvRepository<DbBrvWriteOff> { protected table = "brv_write_offs"; }
export class BrvAnalyticsSnapshotRepository extends OrgBrvRepository<DbBrvAnalyticsSnapshot> { protected table = "brv_analytics_snapshots"; }
export class BrvRevenueGrowthMetricRepository extends OrgBrvRepository<DbBrvRevenueGrowthMetric> { protected table = "brv_revenue_growth_metrics"; }
export class BrvCashFlowRecordRepository extends OrgBrvRepository<DbBrvCashFlowRecord> { protected table = "brv_cash_flow_records"; }
export class BrvSubscriptionTrendRepository extends OrgBrvRepository<DbBrvSubscriptionTrend> { protected table = "brv_subscription_trends"; }
export class BrvRenewalForecastRepository extends OrgBrvRepository<DbBrvRenewalForecast> { protected table = "brv_renewal_forecasts"; }
export class BrvMrrForecastRepository extends OrgBrvRepository<DbBrvMrrForecast> { protected table = "brv_mrr_forecasts"; }
export class BrvArrForecastRepository extends OrgBrvRepository<DbBrvArrForecast> { protected table = "brv_arr_forecasts"; }
export class BrvRevenueProjectionRepository extends OrgBrvRepository<DbBrvRevenueProjection> { protected table = "brv_revenue_projections"; }
export class BrvFinanceMetricRepository extends OrgBrvRepository<DbBrvFinanceMetric> { protected table = "brv_finance_metrics"; }
export class BrvFinancialHealthRepository extends OrgBrvRepository<DbBrvFinancialHealth> { protected table = "brv_financial_health"; }
export class BrvExpansionContractionRepository extends OrgBrvRepository<DbBrvExpansionContraction> { protected table = "brv_expansion_contraction"; }
export class BrvAuditLogRepository extends OrgBrvRepository<DbBrvAuditLog> { protected table = "brv_audit_logs"; }
