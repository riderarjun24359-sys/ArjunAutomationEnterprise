import fs from "fs";
import path from "path";

const root = process.cwd();

const entities = [
    { singular: "BillingAccount", table: "brv_billing_accounts", db: "brvBillingAccounts", orgOnly: true, maps: false, keyField: "accountKey", titleKey: "accountName", audit: "billing_account", fields: [{ name: "accountKey" }, { name: "accountName" }, { name: "currencyCode" }] },
    { singular: "BillingCycle", table: "brv_billing_cycles", db: "brvBillingCycles", orgOnly: false, maps: true, keyField: "cycleKey", titleKey: "cycleKey", audit: "billing_cycle", fields: [{ name: "cycleKey" }, { name: "billingCycle" }] },
    { singular: "SubscriptionBilling", table: "brv_subscription_billings", db: "brvSubscriptionBillings", orgOnly: false, maps: true, keyField: "subscriptionKey", titleKey: "planName", audit: "subscription_billing", fields: [{ name: "subscriptionKey" }, { name: "planName" }, { name: "billingCycle" }, { name: "amountUsd", number: true }] },
    { singular: "ProrationRecord", table: "brv_proration_records", db: "brvProrationRecords", orgOnly: false, maps: true, keyField: "prorationKey", titleKey: "prorationKey", audit: "proration_record", fields: [{ name: "prorationKey" }, { name: "prorationType" }] },
    { singular: "PaymentMethod", table: "brv_payment_methods", db: "brvPaymentMethods", orgOnly: false, maps: true, keyField: "methodKey", titleKey: "methodKey", audit: "payment_method", fields: [{ name: "methodKey" }, { name: "methodType" }] },
    { singular: "PaymentAttempt", table: "brv_payment_attempts", db: "brvPaymentAttempts", orgOnly: false, maps: true, keyField: "attemptKey", titleKey: "attemptKey", audit: "payment_attempt", fields: [{ name: "attemptKey" }, { name: "amountUsd", number: true }] },
    { singular: "Refund", table: "brv_refunds", db: "brvRefunds", orgOnly: false, maps: true, keyField: "refundKey", titleKey: "refundKey", audit: "refund", fields: [{ name: "refundKey" }, { name: "amountUsd", number: true }] },
    { singular: "WalletBalance", table: "brv_wallet_balances", db: "brvWalletBalances", orgOnly: false, maps: true, keyField: "balanceKey", titleKey: "balanceKey", audit: "wallet_balance", fields: [{ name: "balanceKey" }, { name: "balanceUsd", number: true }] },
    { singular: "MrrSnapshot", table: "brv_mrr_snapshots", db: "brvMrrSnapshots", orgOnly: false, maps: true, keyField: "snapshotKey", titleKey: "snapshotKey", audit: "mrr_snapshot", fields: [{ name: "snapshotKey" }, { name: "mrrUsd", number: true }] },
    { singular: "ArrSnapshot", table: "brv_arr_snapshots", db: "brvArrSnapshots", orgOnly: false, maps: true, keyField: "snapshotKey", titleKey: "snapshotKey", audit: "arr_snapshot", fields: [{ name: "snapshotKey" }, { name: "arrUsd", number: true }] },
    { singular: "DeferredRevenue", table: "brv_deferred_revenue", db: "brvDeferredRevenue", orgOnly: false, maps: true, keyField: "deferredKey", titleKey: "deferredKey", audit: "deferred_revenue", fields: [{ name: "deferredKey" }, { name: "totalDeferredUsd", number: true }] },
    { singular: "RevenueRecognition", table: "brv_revenue_recognition", db: "brvRevenueRecognition", orgOnly: false, maps: true, keyField: "recognitionKey", titleKey: "recognitionKey", audit: "revenue_recognition", fields: [{ name: "recognitionKey" }, { name: "recognizedAmountUsd", number: true }] },
    { singular: "Invoice", table: "brv_invoices", db: "brvInvoices", orgOnly: false, maps: true, keyField: "invoiceKey", titleKey: "invoiceNumber", audit: "invoice", fields: [{ name: "invoiceKey" }, { name: "invoiceNumber" }, { name: "totalUsd", number: true }] },
    { singular: "CreditNote", table: "brv_credit_notes", db: "brvCreditNotes", orgOnly: false, maps: true, keyField: "creditKey", titleKey: "creditKey", audit: "credit_note", fields: [{ name: "creditKey" }, { name: "amountUsd", number: true }] },
    { singular: "DebitNote", table: "brv_debit_notes", db: "brvDebitNotes", orgOnly: false, maps: true, keyField: "debitKey", titleKey: "debitKey", audit: "debit_note", fields: [{ name: "debitKey" }, { name: "amountUsd", number: true }] },
    { singular: "TaxConfig", table: "brv_tax_configs", db: "brvTaxConfigs", orgOnly: false, maps: true, keyField: "configKey", titleKey: "taxName", audit: "tax_config", fields: [{ name: "configKey" }, { name: "taxName" }, { name: "gstRate", number: true }] },
    { singular: "OutstandingBalance", table: "brv_outstanding_balances", db: "brvOutstandingBalances", orgOnly: false, maps: true, keyField: "balanceKey", titleKey: "balanceKey", audit: "outstanding_balance", fields: [{ name: "balanceKey" }, { name: "totalOutstandingUsd", number: true }] },
    { singular: "PaymentReminder", table: "brv_payment_reminders", db: "brvPaymentReminders", orgOnly: false, maps: true, keyField: "reminderKey", titleKey: "reminderKey", audit: "payment_reminder", fields: [{ name: "reminderKey" }, { name: "reminderType" }] },
    { singular: "CollectionCase", table: "brv_collection_cases", db: "brvCollectionCases", orgOnly: false, maps: true, keyField: "caseKey", titleKey: "caseKey", audit: "collection_case", fields: [{ name: "caseKey" }, { name: "caseType" }] },
    { singular: "WriteOff", table: "brv_write_offs", db: "brvWriteOffs", orgOnly: false, maps: true, keyField: "writeoffKey", titleKey: "writeoffKey", audit: "write_off", fields: [{ name: "writeoffKey" }, { name: "amountUsd", number: true }] },
    { singular: "AnalyticsSnapshot", table: "brv_analytics_snapshots", db: "brvAnalyticsSnapshots", orgOnly: false, maps: true, keyField: "snapshotKey", titleKey: "snapshotKey", audit: "analytics_snapshot", fields: [{ name: "snapshotKey" }, { name: "mrrUsd", number: true }] },
    { singular: "RevenueGrowthMetric", table: "brv_revenue_growth_metrics", db: "brvRevenueGrowthMetrics", orgOnly: false, maps: true, keyField: "metricsKey", titleKey: "metricsKey", audit: "revenue_growth_metric", fields: [{ name: "metricsKey" }, { name: "growthRatePercent", number: true }] },
    { singular: "CashFlowRecord", table: "brv_cash_flow_records", db: "brvCashFlowRecords", orgOnly: false, maps: true, keyField: "recordKey", titleKey: "recordKey", audit: "cash_flow_record", fields: [{ name: "recordKey" }, { name: "netCashUsd", number: true }] },
    { singular: "SubscriptionTrend", table: "brv_subscription_trends", db: "brvSubscriptionTrends", orgOnly: false, maps: true, keyField: "trendKey", titleKey: "trendKey", audit: "subscription_trend", fields: [{ name: "trendKey" }, { name: "mrrUsd", number: true }] },
    { singular: "RenewalForecast", table: "brv_renewal_forecasts", db: "brvRenewalForecasts", orgOnly: false, maps: true, keyField: "forecastKey", titleKey: "forecastKey", audit: "renewal_forecast", fields: [{ name: "forecastKey" }, { name: "renewalAmountUsd", number: true }] },
    { singular: "MrrForecast", table: "brv_mrr_forecasts", db: "brvMrrForecasts", orgOnly: false, maps: true, keyField: "forecastKey", titleKey: "forecastKey", audit: "mrr_forecast", fields: [{ name: "forecastKey" }, { name: "projectedMrrUsd", number: true }] },
    { singular: "ArrForecast", table: "brv_arr_forecasts", db: "brvArrForecasts", orgOnly: false, maps: true, keyField: "forecastKey", titleKey: "forecastKey", audit: "arr_forecast", fields: [{ name: "forecastKey" }, { name: "projectedArrUsd", number: true }] },
    { singular: "RevenueProjection", table: "brv_revenue_projections", db: "brvRevenueProjections", orgOnly: false, maps: true, keyField: "projectionKey", titleKey: "projectionKey", audit: "revenue_projection", fields: [{ name: "projectionKey" }, { name: "projectedRevenueUsd", number: true }] },
    { singular: "FinanceMetric", table: "brv_finance_metrics", db: "brvFinanceMetrics", orgOnly: true, maps: false, keyField: "metricsKey", titleKey: "metricsKey", audit: "finance_metric", fields: [{ name: "metricsKey" }, { name: "totalMrrUsd", number: true }] },
    { singular: "FinancialHealth", table: "brv_financial_health", db: "brvFinancialHealth", orgOnly: true, maps: false, keyField: "healthKey", titleKey: "healthKey", audit: "financial_health", fields: [{ name: "healthKey" }, { name: "overallScore", number: true }] },
    { singular: "ExpansionContraction", table: "brv_expansion_contraction", db: "brvExpansionContraction", orgOnly: false, maps: true, keyField: "recordKey", titleKey: "recordKey", audit: "expansion_contraction", fields: [{ name: "recordKey" }, { name: "recordType" }, { name: "amountUsd", number: true }] },
];

const toSnake = (s) => s.replace(/([A-Z])/g, "_$1").toLowerCase().replace(/^_/, "");

for (const e of entities) {
    e.dbType = `DbBrv${e.singular}`;
    e.repo = `Brv${e.singular}Repository`;
    e.summary = `${e.singular}Summary`;
    e.input = `Create${e.singular}Input`;
    e.map = `map${e.singular}Summary`;
    e.build = `build${e.singular}Payload`;
}

const dbInterfaces = {
    DbBrvBillingAccount: `export interface DbBrvBillingAccount {
    id: string;
    organization_id: string;
    account_key: string;
    account_name: string;
    currency_code: string;
    billing_email: string;
    payment_terms_days: number;
    tax_id: string;
    status: string;
    created_at: string;
    updated_at: string;
}`,
    DbBrvBillingCycle: `export interface DbBrvBillingCycle {
    id: string;
    organization_id: string;
    billing_account_id: string;
    cycle_key: string;
    billing_cycle: string;
    cycle_start_date: string;
    cycle_end_date?: string | null;
    next_invoice_date?: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}`,
    DbBrvSubscriptionBilling: `export interface DbBrvSubscriptionBilling {
    id: string;
    organization_id: string;
    billing_account_id: string;
    subscription_key: string;
    plan_name: string;
    billing_cycle: string;
    amount_usd: number;
    mrr_usd: number;
    arr_usd: number;
    quantity: number;
    starts_at: string;
    ends_at?: string | null;
    renews_at?: string | null;
    payment_status: string;
    status: string;
    created_at: string;
    updated_at: string;
}`,
    DbBrvProrationRecord: `export interface DbBrvProrationRecord {
    id: string;
    organization_id: string;
    billing_account_id: string;
    proration_key: string;
    subscription_billing_id?: string | null;
    proration_type: string;
    prorated_amount_usd: number;
    days_remaining: number;
    days_in_cycle: number;
    effective_date: string;
    reason: string;
    status: string;
    created_at: string;
    updated_at: string;
}`,
    DbBrvPaymentMethod: `export interface DbBrvPaymentMethod {
    id: string;
    organization_id: string;
    billing_account_id: string;
    method_key: string;
    method_type: string;
    last_four: string;
    brand: string;
    expiry_month?: number | null;
    expiry_year?: number | null;
    is_default: boolean;
    status: string;
    created_at: string;
    updated_at: string;
}`,
    DbBrvPaymentAttempt: `export interface DbBrvPaymentAttempt {
    id: string;
    organization_id: string;
    billing_account_id: string;
    attempt_key: string;
    payment_method_id?: string | null;
    amount_usd: number;
    currency_code: string;
    payment_status: string;
    gateway_reference: string;
    failure_reason: string;
    attempted_at: string;
    status: string;
    created_at: string;
}`,
    DbBrvRefund: `export interface DbBrvRefund {
    id: string;
    organization_id: string;
    billing_account_id: string;
    refund_key: string;
    payment_attempt_id?: string | null;
    amount_usd: number;
    refund_reason: string;
    refund_status: string;
    processed_at?: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}`,
    DbBrvWalletBalance: `export interface DbBrvWalletBalance {
    id: string;
    organization_id: string;
    billing_account_id: string;
    balance_key: string;
    balance_usd: number;
    credit_usd: number;
    debit_usd: number;
    last_transaction_at?: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}`,
    DbBrvMrrSnapshot: `export interface DbBrvMrrSnapshot {
    id: string;
    organization_id: string;
    billing_account_id: string;
    snapshot_key: string;
    snapshot_date: string;
    mrr_usd: number;
    previous_mrr_usd: number;
    new_mrr_usd: number;
    expansion_mrr_usd: number;
    contraction_mrr_usd: number;
    churn_mrr_usd: number;
    status: string;
    created_at: string;
    updated_at: string;
}`,
    DbBrvArrSnapshot: `export interface DbBrvArrSnapshot {
    id: string;
    organization_id: string;
    billing_account_id: string;
    snapshot_key: string;
    snapshot_date: string;
    arr_usd: number;
    previous_arr_usd: number;
    status: string;
    created_at: string;
    updated_at: string;
}`,
    DbBrvDeferredRevenue: `export interface DbBrvDeferredRevenue {
    id: string;
    organization_id: string;
    billing_account_id: string;
    deferred_key: string;
    period_start: string;
    period_end?: string | null;
    total_deferred_usd: number;
    recognized_usd: number;
    remaining_usd: number;
    status: string;
    created_at: string;
    updated_at: string;
}`,
    DbBrvRevenueRecognition: `export interface DbBrvRevenueRecognition {
    id: string;
    organization_id: string;
    billing_account_id: string;
    recognition_key: string;
    deferred_revenue_id?: string | null;
    recognized_amount_usd: number;
    recognition_date: string;
    recognition_type: string;
    status: string;
    created_at: string;
    updated_at: string;
}`,
    DbBrvInvoice: `export interface DbBrvInvoice {
    id: string;
    organization_id: string;
    billing_account_id: string;
    invoice_key: string;
    invoice_number: string;
    subtotal_usd: number;
    tax_amount: number;
    total_usd: number;
    amount_due_usd: number;
    billing_cycle: string;
    invoice_date: string;
    due_date?: string | null;
    paid_at?: string | null;
    payment_status: string;
    status: string;
    created_at: string;
    updated_at: string;
}`,
    DbBrvCreditNote: `export interface DbBrvCreditNote {
    id: string;
    organization_id: string;
    billing_account_id: string;
    credit_key: string;
    invoice_id?: string | null;
    amount_usd: number;
    tax_amount: number;
    reason: string;
    issued_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}`,
    DbBrvDebitNote: `export interface DbBrvDebitNote {
    id: string;
    organization_id: string;
    billing_account_id: string;
    debit_key: string;
    invoice_id?: string | null;
    amount_usd: number;
    tax_amount: number;
    reason: string;
    issued_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}`,
    DbBrvTaxConfig: `export interface DbBrvTaxConfig {
    id: string;
    organization_id: string;
    billing_account_id: string;
    config_key: string;
    tax_name: string;
    gst_rate: number;
    tax_type: string;
    jurisdiction: string;
    is_default: boolean;
    status: string;
    created_at: string;
    updated_at: string;
}`,
    DbBrvOutstandingBalance: `export interface DbBrvOutstandingBalance {
    id: string;
    organization_id: string;
    billing_account_id: string;
    balance_key: string;
    total_outstanding_usd: number;
    overdue_usd: number;
    current_usd: number;
    days_overdue: number;
    last_payment_at?: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}`,
    DbBrvPaymentReminder: `export interface DbBrvPaymentReminder {
    id: string;
    organization_id: string;
    billing_account_id: string;
    reminder_key: string;
    outstanding_balance_id?: string | null;
    reminder_type: string;
    channel: string;
    sent_at?: string | null;
    next_reminder_at?: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}`,
    DbBrvCollectionCase: `export interface DbBrvCollectionCase {
    id: string;
    organization_id: string;
    billing_account_id: string;
    case_key: string;
    case_type: string;
    priority: string;
    outstanding_amount_usd: number;
    assigned_to?: string | null;
    opened_at: string;
    resolved_at?: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}`,
    DbBrvWriteOff: `export interface DbBrvWriteOff {
    id: string;
    organization_id: string;
    billing_account_id: string;
    writeoff_key: string;
    collection_case_id?: string | null;
    amount_usd: number;
    reason: string;
    approved_by?: string | null;
    written_off_at?: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}`,
    DbBrvAnalyticsSnapshot: `export interface DbBrvAnalyticsSnapshot {
    id: string;
    organization_id: string;
    billing_account_id: string;
    snapshot_key: string;
    snapshot_date: string;
    total_revenue_usd: number;
    mrr_usd: number;
    arr_usd: number;
    metrics: Record<string, unknown>;
    status: string;
    created_at: string;
    updated_at: string;
}`,
    DbBrvRevenueGrowthMetric: `export interface DbBrvRevenueGrowthMetric {
    id: string;
    organization_id: string;
    billing_account_id: string;
    metrics_key: string;
    metric_date: string;
    growth_rate_percent: number;
    net_revenue_retention: number;
    expansion_revenue_usd: number;
    contraction_revenue_usd: number;
    status: string;
    created_at: string;
    updated_at: string;
}`,
    DbBrvCashFlowRecord: `export interface DbBrvCashFlowRecord {
    id: string;
    organization_id: string;
    billing_account_id: string;
    record_key: string;
    record_date: string;
    inflow_usd: number;
    outflow_usd: number;
    net_cash_usd: number;
    category: string;
    status: string;
    created_at: string;
    updated_at: string;
}`,
    DbBrvSubscriptionTrend: `export interface DbBrvSubscriptionTrend {
    id: string;
    organization_id: string;
    billing_account_id: string;
    trend_key: string;
    trend_date: string;
    active_subscriptions: number;
    new_subscriptions: number;
    churned_subscriptions: number;
    mrr_usd: number;
    arr_usd: number;
    status: string;
    created_at: string;
    updated_at: string;
}`,
    DbBrvRenewalForecast: `export interface DbBrvRenewalForecast {
    id: string;
    organization_id: string;
    billing_account_id: string;
    forecast_key: string;
    forecast_date: string;
    renewal_amount_usd: number;
    renewal_probability: number;
    contract_end_date?: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}`,
    DbBrvMrrForecast: `export interface DbBrvMrrForecast {
    id: string;
    organization_id: string;
    billing_account_id: string;
    forecast_key: string;
    forecast_date: string;
    forecast_period: string;
    projected_mrr_usd: number;
    confidence_percent: number;
    status: string;
    created_at: string;
    updated_at: string;
}`,
    DbBrvArrForecast: `export interface DbBrvArrForecast {
    id: string;
    organization_id: string;
    billing_account_id: string;
    forecast_key: string;
    forecast_date: string;
    forecast_period: string;
    projected_arr_usd: number;
    confidence_percent: number;
    status: string;
    created_at: string;
    updated_at: string;
}`,
    DbBrvRevenueProjection: `export interface DbBrvRevenueProjection {
    id: string;
    organization_id: string;
    billing_account_id: string;
    projection_key: string;
    projection_date: string;
    projected_revenue_usd: number;
    projection_horizon_months: number;
    assumptions: Record<string, unknown>;
    status: string;
    created_at: string;
    updated_at: string;
}`,
    DbBrvFinanceMetric: `export interface DbBrvFinanceMetric {
    id: string;
    organization_id: string;
    metrics_key: string;
    metric_date: string;
    total_mrr_usd: number;
    total_arr_usd: number;
    total_revenue_usd: number;
    collection_rate_percent: number;
    dso_days: number;
    status: string;
    created_at: string;
    updated_at: string;
}`,
    DbBrvFinancialHealth: `export interface DbBrvFinancialHealth {
    id: string;
    organization_id: string;
    health_key: string;
    health_date: string;
    overall_score: number;
    liquidity_score: number;
    collection_score: number;
    summary: string;
    status: string;
    created_at: string;
    updated_at: string;
}`,
    DbBrvExpansionContraction: `export interface DbBrvExpansionContraction {
    id: string;
    organization_id: string;
    billing_account_id: string;
    record_key: string;
    record_date: string;
    record_type: string;
    amount_usd: number;
    mrr_impact_usd: number;
    reason: string;
    status: string;
    created_at: string;
    updated_at: string;
}`,
    DbBrvAuditLog: `export interface DbBrvAuditLog {
    id: string;
    organization_id: string;
    entity_type: string;
    entity_id?: string | null;
    action: string;
    summary: string;
    metadata: Record<string, unknown>;
    performed_by?: string | null;
    security_level: string;
    created_at: string;
}`,
};

function genRepos() {
    const imports = [...entities.map((e) => e.dbType), "DbBrvAuditLog"].join(",\n    ");
    const classes = entities.map((e) => `export class ${e.repo} extends OrgBrvRepository<${e.dbType}> { protected table = "${e.table}"; }`).join("\n");
    return `import type {\n    ${imports},\n} from "@/src/modules/database/types/platform";\nimport { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";\nimport { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";\n\nabstract class OrgBrvRepository<T> extends BaseRepository<T> {\n    async listByOrganization(organizationId: string, query: RepositoryQuery = {}): Promise<T[]> {\n        const client = getRepositoryClient();\n        if (!client) return [];\n        const normalized = this.buildQuery(query);\n        const { data, error } = await client.from(this.table).select("*").eq("organization_id", organizationId).order(normalized.orderBy, { ascending: normalized.orderDirection === "asc" }).range(normalized.offset, normalized.offset + normalized.limit - 1);\n        mapRepositoryError(error, \`Failed to list \${this.table}\`);\n        return (data ?? []) as T[];\n    }\n\n    async getById(id: string): Promise<T | null> {\n        const client = getRepositoryClient();\n        if (!client) return null;\n        const { data, error } = await client.from(this.table).select("*").eq("id", id).maybeSingle();\n        mapRepositoryError(error, \`Failed to get \${this.table}\`);\n        return (data as T | null) ?? null;\n    }\n\n    async create(input: Record<string, unknown>): Promise<T | null> {\n        const client = getRepositoryClient();\n        if (!client) return null;\n        const { data, error } = await client.from(this.table).insert(input).select("*").maybeSingle();\n        mapRepositoryError(error, \`Failed to create \${this.table}\`);\n        return (data as T | null) ?? null;\n    }\n\n    async update(id: string, input: Record<string, unknown>): Promise<T | null> {\n        const client = getRepositoryClient();\n        if (!client) return null;\n        const { data, error } = await client.from(this.table).update(input).eq("id", id).select("*").maybeSingle();\n        mapRepositoryError(error, \`Failed to update \${this.table}\`);\n        return (data as T | null) ?? null;\n    }\n\n    async delete(id: string): Promise<boolean> {\n        const client = getRepositoryClient();\n        if (!client) return false;\n        const { error } = await client.from(this.table).delete().eq("id", id);\n        mapRepositoryError(error, \`Failed to delete \${this.table}\`);\n        return !error;\n    }\n}\n\n${classes}\nexport class BrvAuditLogRepository extends OrgBrvRepository<DbBrvAuditLog> { protected table = "brv_audit_logs"; }\n`;
}

function genTypes() {
    const blocks = [
        `export interface BrvDashboardStats {
    totalBillingAccounts: number;
    activeBillingAccounts: number;
    subscriptionBillingCount: number;
    activeSubscriptionCount: number;
    mrrUsd: number;
    arrUsd: number;
    pendingInvoiceCount: number;
    overdueBalanceUsd: number;
    openCollectionCaseCount: number;
    auditCount: number;
}`,
        `export interface BrvPipelineInfo {
    stages: Array<{ key: string; label: string }>;
    currentStage: string;
    nextStage: string;
    previousStage: string;
}`,
        `export interface AuditEntry {
    id: string;
    entityType: string;
    entityId?: string | null;
    action: string;
    summary: string;
    securityLevel: string;
    createdAt: string;
}`,
    ];
    for (const e of entities) {
        blocks.push(`export interface ${e.summary} {
    id: string;
    ${e.maps ? "billingAccountName: string;\n    " : ""}${e.keyField}: string;
    ${e.titleKey !== e.keyField ? `${e.titleKey}: string;\n    ` : ""}status: string;
}`);
        blocks.push(`export interface ${e.input} {
    ${e.orgOnly ? "" : "billingAccountId: string;\n    "}${e.fields.map((f) => `${f.name}${f.number ? "?: number" : "?: string"};`).join("\n    ")}
}`);
    }
    return blocks.join("\n\n") + "\n";
}

function camelToSnakeField(name) {
    return name.replace(/([A-Z])/g, "_$1").toLowerCase();
}

function genMappers() {
    const dbImports = [...entities.map((e) => e.dbType), "DbBrvAuditLog"].join(",\n    ");
    const typeImports = [...entities.flatMap((e) => [e.input, e.summary]), "BrvDashboardStats", "BrvPipelineInfo", "AuditEntry"].join(",\n    ");

    const mapFns = entities.map((e) => {
        const extra = e.singular === "BillingAccount"
            ? `accountName: record.account_name,\n    currencyCode: record.currency_code,`
            : e.titleKey !== e.keyField
              ? `${e.titleKey}: String((record as Record<string, unknown>).${camelToSnakeField(e.titleKey)} ?? (record as Record<string, unknown>).${camelToSnakeField(e.keyField)} ?? ""),`
              : "";
        if (e.singular === "BillingAccount") {
            return `export const ${e.map} = (record: DbBrvBillingAccount): ${e.summary} => ({
    id: record.id,
    accountKey: record.account_key,
    accountName: record.account_name,
    currencyCode: record.currency_code,
    status: record.status,
});`;
        }
        if (e.maps) {
            return `export const ${e.map} = (record: ${e.dbType}, maps: LookupMaps): ${e.summary} => ({
    id: record.id,
    billingAccountName: billingAccountName(maps, (record as Record<string, unknown>).billing_account_id as string) ?? "",
    ${e.keyField}: String((record as Record<string, unknown>).${camelToSnakeField(e.keyField)} ?? ""),
    ${extra}
    status: record.status,
});`;
        }
        return `export const ${e.map} = (record: ${e.dbType}): ${e.summary} => ({
    id: record.id,
    ${e.keyField}: String((record as Record<string, unknown>).${camelToSnakeField(e.keyField)} ?? ""),
    ${extra}
    status: record.status,
});`;
    });

    const buildFns = entities.map((e) => {
        const payloadFields = e.orgOnly
            ? e.fields.map((f) => `${camelToSnakeField(f.name)}: input.${f.name} ?? ${f.number ? "0" : '""'}`)
            : [`billing_account_id: input.billingAccountId`, ...e.fields.map((f) => `${camelToSnakeField(f.name)}: input.${f.name} ?? ${f.number ? "0" : '""'}`)];
        return `export const ${e.build} = (organizationId: string, input: ${e.input}) => ({
    organization_id: organizationId,
    ${payloadFields.join(",\n    ")},
});`;
    });

    return `import type {
    ${dbImports},
} from "@/src/modules/database/types/platform";
import type {
    ${typeImports},
} from "@/src/modules/billing-revenue/types";

type LookupMaps = { billingAccounts: Map<string, DbBrvBillingAccount> };

export const buildBillingAccountLookupMaps = (billingAccounts: DbBrvBillingAccount[]): LookupMaps => ({
    billingAccounts: new Map(billingAccounts.map((item) => [item.id, item])),
});

const billingAccountName = (maps: LookupMaps, id?: string | null) => (id ? maps.billingAccounts.get(id)?.account_name ?? null : null);

export const mapAuditEntry = (record: DbBrvAuditLog): AuditEntry => ({
    id: record.id,
    entityType: record.entity_type,
    entityId: record.entity_id,
    action: record.action,
    summary: record.summary,
    securityLevel: record.security_level,
    createdAt: record.created_at,
});

export const buildBrvAuditPayload = (organizationId: string, entityType: string, action: string, summary: string, entityId?: string, securityLevel = "standard") => ({
    organization_id: organizationId,
    entity_type: entityType,
    entity_id: entityId ?? null,
    action,
    summary,
    security_level: securityLevel,
});

const normalizeToMrr = (amountUsd: number, billingCycle: string): number => {
    switch (billingCycle) {
        case "annual":
        case "yearly":
            return amountUsd / 12;
        case "quarterly":
            return amountUsd / 3;
        case "monthly":
        default:
            return amountUsd;
    }
};

export const buildBrvDashboardStats = (input: {
    billingAccounts: BillingAccountSummary[];
    subscriptionBillings: { status: string; mrrUsd?: number; arrUsd?: number; billingCycle?: string; amountUsd?: number; paymentStatus?: string }[];
    invoices: { paymentStatus: string; amountDueUsd?: number }[];
    outstandingBalances: { overdueUsd?: number }[];
    collectionCases: { status: string }[];
    auditLogs: unknown[];
}): BrvDashboardStats => {
    const activeSubscriptions = input.subscriptionBillings.filter((s) => s.status === "active");
    const computedMrr = activeSubscriptions.reduce((sum, s) => {
        if (typeof s.mrrUsd === "number" && s.mrrUsd > 0) return sum + s.mrrUsd;
        const amount = s.amountUsd ?? 0;
        const cycle = s.billingCycle ?? "monthly";
        return sum + normalizeToMrr(amount, cycle);
    }, 0);
    const computedArr = computedMrr * 12;
    return {
        totalBillingAccounts: input.billingAccounts.length,
        activeBillingAccounts: input.billingAccounts.filter((a) => a.status === "active").length,
        subscriptionBillingCount: input.subscriptionBillings.length,
        activeSubscriptionCount: activeSubscriptions.length,
        mrrUsd: computedMrr,
        arrUsd: computedArr,
        pendingInvoiceCount: input.invoices.filter((i) => i.paymentStatus === "pending").length,
        overdueBalanceUsd: input.outstandingBalances.reduce((s, b) => s + (b.overdueUsd ?? 0), 0),
        openCollectionCaseCount: input.collectionCases.filter((c) => c.status === "open").length,
        auditCount: input.auditLogs.length,
    };
};

export const buildBrvPipelineInfo = (): BrvPipelineInfo => ({
    stages: [
        { key: "draft", label: "Draft" },
        { key: "pending", label: "Pending" },
        { key: "active", label: "Active" },
        { key: "past_due", label: "Past Due" },
        { key: "collected", label: "Collected" },
        { key: "closed", label: "Closed" },
    ],
    currentStage: "active",
    nextStage: "collected",
    previousStage: "pending",
});

${mapFns.join("\n\n")}

${buildFns.join("\n\n")}
`;
}

// Append to platform.ts
const platformPath = path.join(root, "src/modules/database/types/platform.ts");
const platformContent = fs.readFileSync(platformPath, "utf8");
const brvBlock = Object.values(dbInterfaces).join("\n\n") + "\n";
if (!platformContent.includes("export interface DbBrvBillingAccount")) {
    fs.writeFileSync(platformPath, platformContent.trimEnd() + "\n\n" + brvBlock);
}

fs.writeFileSync(path.join(root, "src/modules/database/repositories/billing-revenue-repositories.ts"), genRepos());
fs.mkdirSync(path.join(root, "src/modules/billing-revenue/types"), { recursive: true });
fs.writeFileSync(path.join(root, "src/modules/billing-revenue/types/index.ts"), genTypes());
fs.writeFileSync(path.join(root, "src/modules/database/lib/billing-revenue-mappers.ts"), genMappers());

const brvTables = [
    "brv_billing_accounts", "brv_billing_cycles", "brv_subscription_billings", "brv_proration_records",
    "brv_payment_methods", "brv_payment_attempts", "brv_refunds", "brv_wallet_balances",
    "brv_mrr_snapshots", "brv_arr_snapshots", "brv_deferred_revenue", "brv_revenue_recognition",
    "brv_invoices", "brv_credit_notes", "brv_debit_notes", "brv_tax_configs",
    "brv_outstanding_balances", "brv_payment_reminders", "brv_collection_cases", "brv_write_offs",
    "brv_analytics_snapshots", "brv_revenue_growth_metrics", "brv_cash_flow_records", "brv_subscription_trends",
    "brv_renewal_forecasts", "brv_mrr_forecasts", "brv_arr_forecasts", "brv_revenue_projections",
    "brv_finance_metrics", "brv_financial_health", "brv_expansion_contraction", "brv_audit_logs",
];

const patch = {
    imports: [...entities.map((e) => e.repo), "BrvAuditLogRepository"].join(",\n    "),
    props: [...entities.map((e) => `readonly ${e.db}: ${e.repo};`), "readonly brvAuditLogs: BrvAuditLogRepository;"].join("\n    "),
    inits: [...entities.map((e) => `this.${e.db} = new ${e.repo}();`), "this.brvAuditLogs = new BrvAuditLogRepository();"].join("\n        "),
    tables: brvTables,
};
fs.writeFileSync(path.join(root, "scripts/.brv-data-access-patch.json"), JSON.stringify(patch, null, 2));

console.log("Generated billing-revenue database layer");
console.log("Entities:", entities.length);
console.log("Tables:", brvTables.length);
