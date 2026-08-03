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
import type {
    CreateBillingAccountInput,
    BillingAccountSummary,
    CreateBillingCycleInput,
    BillingCycleSummary,
    CreateSubscriptionBillingInput,
    SubscriptionBillingSummary,
    CreateProrationRecordInput,
    ProrationRecordSummary,
    CreatePaymentMethodInput,
    PaymentMethodSummary,
    CreatePaymentAttemptInput,
    PaymentAttemptSummary,
    CreateRefundInput,
    RefundSummary,
    CreateWalletBalanceInput,
    WalletBalanceSummary,
    CreateMrrSnapshotInput,
    MrrSnapshotSummary,
    CreateArrSnapshotInput,
    ArrSnapshotSummary,
    CreateDeferredRevenueInput,
    DeferredRevenueSummary,
    CreateRevenueRecognitionInput,
    RevenueRecognitionSummary,
    CreateInvoiceInput,
    InvoiceSummary,
    CreateCreditNoteInput,
    CreditNoteSummary,
    CreateDebitNoteInput,
    DebitNoteSummary,
    CreateTaxConfigInput,
    TaxConfigSummary,
    CreateOutstandingBalanceInput,
    OutstandingBalanceSummary,
    CreatePaymentReminderInput,
    PaymentReminderSummary,
    CreateCollectionCaseInput,
    CollectionCaseSummary,
    CreateWriteOffInput,
    WriteOffSummary,
    CreateAnalyticsSnapshotInput,
    AnalyticsSnapshotSummary,
    CreateRevenueGrowthMetricInput,
    RevenueGrowthMetricSummary,
    CreateCashFlowRecordInput,
    CashFlowRecordSummary,
    CreateSubscriptionTrendInput,
    SubscriptionTrendSummary,
    CreateRenewalForecastInput,
    RenewalForecastSummary,
    CreateMrrForecastInput,
    MrrForecastSummary,
    CreateArrForecastInput,
    ArrForecastSummary,
    CreateRevenueProjectionInput,
    RevenueProjectionSummary,
    CreateFinanceMetricInput,
    FinanceMetricSummary,
    CreateFinancialHealthInput,
    FinancialHealthSummary,
    CreateExpansionContractionInput,
    ExpansionContractionSummary,
    BrvDashboardStats,
    BrvPipelineInfo,
    AuditEntry,
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
    subscriptionBillings?: Array<{ status: string; mrrUsd?: number; amountUsd?: number; billingCycle?: string }>;
    mrrSnapshots?: Array<{ mrrUsd?: number }>;
    arrSnapshots?: Array<{ arrUsd?: number }>;
    outstandingBalances: Array<{ amountUsd?: number; status?: string }>;
    invoices: Array<{ status: string; paymentStatus?: string }>;
    paymentAttempts: Array<{ status: string; paymentStatus?: string }>;
    collectionCases: Array<{ status: string }>;
    auditLogs: unknown[];
}): BrvDashboardStats => {
    let mrrUsd = 0;
    if (input.subscriptionBillings?.length) {
        const activeSubscriptions = input.subscriptionBillings.filter((s) => s.status === "active");
        mrrUsd = activeSubscriptions.reduce((sum, s) => {
            if (typeof s.mrrUsd === "number" && s.mrrUsd > 0) return sum + s.mrrUsd;
            const amount = s.amountUsd ?? 0;
            const cycle = s.billingCycle ?? "monthly";
            return sum + normalizeToMrr(amount, cycle);
        }, 0);
    } else if (input.mrrSnapshots?.length) {
        mrrUsd = input.mrrSnapshots.reduce((sum, s) => sum + (s.mrrUsd ?? 0), 0);
    }
    const arrUsd = mrrUsd > 0 ? mrrUsd * 12 : (input.arrSnapshots?.reduce((sum, s) => sum + (s.arrUsd ?? 0), 0) ?? 0);
    return {
        totalBillingAccounts: input.billingAccounts.length,
        activeBillingAccounts: input.billingAccounts.filter((a) => a.status === "active").length,
        mrrUsd,
        arrUsd,
        outstandingBalanceUsd: input.outstandingBalances.reduce((s, b) => s + (b.amountUsd ?? 0), 0),
        openInvoiceCount: input.invoices.filter((i) => i.status === "open" || i.status === "draft" || i.paymentStatus === "pending").length,
        failedPaymentCount: input.paymentAttempts.filter((p) => p.paymentStatus === "failed" || p.status === "failed").length,
        collectionCaseCount: input.collectionCases.filter((c) => c.status === "open").length,
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

export const mapBillingAccountSummary = (record: DbBrvBillingAccount): BillingAccountSummary => ({
    id: record.id,
    accountKey: record.account_key,
    accountName: record.account_name,
    status: record.status,
});

export const mapBillingCycleSummary = (record: DbBrvBillingCycle, maps: LookupMaps): BillingCycleSummary => ({
    id: record.id,
    billingAccountName: billingAccountName(maps, record.billing_account_id) ?? "",
    cycleKey: record.cycle_key,
    status: record.status,
});

export const mapSubscriptionBillingSummary = (record: DbBrvSubscriptionBilling, maps: LookupMaps): SubscriptionBillingSummary => ({
    id: record.id,
    billingAccountName: billingAccountName(maps, record.billing_account_id) ?? "",
    billingKey: record.subscription_key,
    status: record.status,
});

export const mapProrationRecordSummary = (record: DbBrvProrationRecord, maps: LookupMaps): ProrationRecordSummary => ({
    id: record.id,
    billingAccountName: billingAccountName(maps, record.billing_account_id) ?? "",
    prorationKey: record.proration_key,
    status: record.status,
});

export const mapPaymentMethodSummary = (record: DbBrvPaymentMethod, maps: LookupMaps): PaymentMethodSummary => ({
    id: record.id,
    billingAccountName: billingAccountName(maps, record.billing_account_id) ?? "",
    methodKey: record.method_key,
    status: record.status,
});

export const mapPaymentAttemptSummary = (record: DbBrvPaymentAttempt, maps: LookupMaps): PaymentAttemptSummary => ({
    id: record.id,
    billingAccountName: billingAccountName(maps, record.billing_account_id) ?? "",
    attemptKey: record.attempt_key,
    status: record.status,
});

export const mapRefundSummary = (record: DbBrvRefund, maps: LookupMaps): RefundSummary => ({
    id: record.id,
    billingAccountName: billingAccountName(maps, record.billing_account_id) ?? "",
    refundKey: record.refund_key,
    status: record.status,
});

export const mapWalletBalanceSummary = (record: DbBrvWalletBalance, maps: LookupMaps): WalletBalanceSummary => ({
    id: record.id,
    billingAccountName: billingAccountName(maps, record.billing_account_id) ?? "",
    walletKey: record.balance_key,
    status: record.status,
});

export const mapMrrSnapshotSummary = (record: DbBrvMrrSnapshot, maps: LookupMaps): MrrSnapshotSummary => ({
    id: record.id,
    billingAccountName: billingAccountName(maps, record.billing_account_id) ?? "",
    snapshotKey: record.snapshot_key,
    status: record.status,
});

export const mapArrSnapshotSummary = (record: DbBrvArrSnapshot, maps: LookupMaps): ArrSnapshotSummary => ({
    id: record.id,
    billingAccountName: billingAccountName(maps, record.billing_account_id) ?? "",
    snapshotKey: record.snapshot_key,
    status: record.status,
});

export const mapDeferredRevenueSummary = (record: DbBrvDeferredRevenue, maps: LookupMaps): DeferredRevenueSummary => ({
    id: record.id,
    billingAccountName: billingAccountName(maps, record.billing_account_id) ?? "",
    recordKey: record.deferred_key,
    status: record.status,
});

export const mapRevenueRecognitionSummary = (record: DbBrvRevenueRecognition, maps: LookupMaps): RevenueRecognitionSummary => ({
    id: record.id,
    billingAccountName: billingAccountName(maps, record.billing_account_id) ?? "",
    recognitionKey: record.recognition_key,
    status: record.status,
});

export const mapInvoiceSummary = (record: DbBrvInvoice, maps: LookupMaps): InvoiceSummary => ({
    id: record.id,
    billingAccountName: billingAccountName(maps, record.billing_account_id) ?? "",
    invoiceKey: record.invoice_key,
    status: record.status,
});

export const mapCreditNoteSummary = (record: DbBrvCreditNote, maps: LookupMaps): CreditNoteSummary => ({
    id: record.id,
    billingAccountName: billingAccountName(maps, record.billing_account_id) ?? "",
    noteKey: record.credit_key,
    status: record.status,
});

export const mapDebitNoteSummary = (record: DbBrvDebitNote, maps: LookupMaps): DebitNoteSummary => ({
    id: record.id,
    billingAccountName: billingAccountName(maps, record.billing_account_id) ?? "",
    noteKey: record.debit_key,
    status: record.status,
});

export const mapTaxConfigSummary = (record: DbBrvTaxConfig, maps: LookupMaps): TaxConfigSummary => ({
    id: record.id,
    billingAccountName: billingAccountName(maps, record.billing_account_id) ?? "",
    configKey: record.config_key,
    status: record.status,
});

export const mapOutstandingBalanceSummary = (record: DbBrvOutstandingBalance, maps: LookupMaps): OutstandingBalanceSummary => ({
    id: record.id,
    billingAccountName: billingAccountName(maps, record.billing_account_id) ?? "",
    balanceKey: record.balance_key,
    status: record.status,
});

export const mapPaymentReminderSummary = (record: DbBrvPaymentReminder, maps: LookupMaps): PaymentReminderSummary => ({
    id: record.id,
    billingAccountName: billingAccountName(maps, record.billing_account_id) ?? "",
    reminderKey: record.reminder_key,
    status: record.status,
});

export const mapCollectionCaseSummary = (record: DbBrvCollectionCase, maps: LookupMaps): CollectionCaseSummary => ({
    id: record.id,
    billingAccountName: billingAccountName(maps, record.billing_account_id) ?? "",
    caseKey: record.case_key,
    status: record.status,
});

export const mapWriteOffSummary = (record: DbBrvWriteOff, maps: LookupMaps): WriteOffSummary => ({
    id: record.id,
    billingAccountName: billingAccountName(maps, record.billing_account_id) ?? "",
    writeOffKey: record.writeoff_key,
    status: record.status,
});

export const mapAnalyticsSnapshotSummary = (record: DbBrvAnalyticsSnapshot, maps: LookupMaps): AnalyticsSnapshotSummary => ({
    id: record.id,
    billingAccountName: billingAccountName(maps, record.billing_account_id) ?? "",
    snapshotKey: record.snapshot_key,
    status: record.status,
});

export const mapRevenueGrowthMetricSummary = (record: DbBrvRevenueGrowthMetric, maps: LookupMaps): RevenueGrowthMetricSummary => ({
    id: record.id,
    billingAccountName: billingAccountName(maps, record.billing_account_id) ?? "",
    metricsKey: record.metrics_key,
    status: record.status,
});

export const mapCashFlowRecordSummary = (record: DbBrvCashFlowRecord, maps: LookupMaps): CashFlowRecordSummary => ({
    id: record.id,
    billingAccountName: billingAccountName(maps, record.billing_account_id) ?? "",
    recordKey: record.record_key,
    status: record.status,
});

export const mapSubscriptionTrendSummary = (record: DbBrvSubscriptionTrend, maps: LookupMaps): SubscriptionTrendSummary => ({
    id: record.id,
    billingAccountName: billingAccountName(maps, record.billing_account_id) ?? "",
    trendKey: record.trend_key,
    status: record.status,
});

export const mapRenewalForecastSummary = (record: DbBrvRenewalForecast, maps: LookupMaps): RenewalForecastSummary => ({
    id: record.id,
    billingAccountName: billingAccountName(maps, record.billing_account_id) ?? "",
    forecastKey: record.forecast_key,
    status: record.status,
});

export const mapMrrForecastSummary = (record: DbBrvMrrForecast, maps: LookupMaps): MrrForecastSummary => ({
    id: record.id,
    billingAccountName: billingAccountName(maps, record.billing_account_id) ?? "",
    forecastKey: record.forecast_key,
    status: record.status,
});

export const mapArrForecastSummary = (record: DbBrvArrForecast, maps: LookupMaps): ArrForecastSummary => ({
    id: record.id,
    billingAccountName: billingAccountName(maps, record.billing_account_id) ?? "",
    forecastKey: record.forecast_key,
    status: record.status,
});

export const mapRevenueProjectionSummary = (record: DbBrvRevenueProjection, maps: LookupMaps): RevenueProjectionSummary => ({
    id: record.id,
    billingAccountName: billingAccountName(maps, record.billing_account_id) ?? "",
    projectionKey: record.projection_key,
    status: record.status,
});

export const mapFinanceMetricSummary = (record: DbBrvFinanceMetric): FinanceMetricSummary => ({
    id: record.id,
    metricsKey: record.metrics_key,
    status: record.status,
});

export const mapFinancialHealthSummary = (record: DbBrvFinancialHealth): FinancialHealthSummary => ({
    id: record.id,
    healthKey: record.health_key,
    status: record.status,
});

export const mapExpansionContractionSummary = (record: DbBrvExpansionContraction, maps: LookupMaps): ExpansionContractionSummary => ({
    id: record.id,
    billingAccountName: billingAccountName(maps, record.billing_account_id) ?? "",
    recordKey: record.record_key,
    status: record.status,
});

export const buildBillingAccountPayload = (organizationId: string, input: CreateBillingAccountInput) => ({
    organization_id: organizationId,
    account_key: input.accountKey ?? "",
    account_name: input.accountName ?? "",
    currency_code: input.currencyCode ?? "",
});

export const buildBillingCyclePayload = (organizationId: string, input: CreateBillingCycleInput) => ({
    organization_id: organizationId,
    billing_account_id: input.billingAccountId,
    cycle_key: input.cycleKey ?? "",
    billing_cycle: input.billingCycle ?? "",
});

export const buildSubscriptionBillingPayload = (organizationId: string, input: CreateSubscriptionBillingInput) => ({
    organization_id: organizationId,
    billing_account_id: input.billingAccountId,
    subscription_key: input.billingKey ?? "",
    plan_name: input.billingKey ?? "",
    billing_cycle: input.billingCycle ?? "monthly",
    amount_usd: input.amountUsd ?? 0,
});

export const buildProrationRecordPayload = (organizationId: string, input: CreateProrationRecordInput) => ({
    organization_id: organizationId,
    billing_account_id: input.billingAccountId,
    proration_key: input.prorationKey ?? "",
    prorated_amount_usd: input.amountUsd ?? 0,
});

export const buildPaymentMethodPayload = (organizationId: string, input: CreatePaymentMethodInput) => ({
    organization_id: organizationId,
    billing_account_id: input.billingAccountId,
    method_key: input.methodKey ?? "",
    method_type: input.methodType ?? "",
});

export const buildPaymentAttemptPayload = (organizationId: string, input: CreatePaymentAttemptInput) => ({
    organization_id: organizationId,
    billing_account_id: input.billingAccountId,
    attempt_key: input.attemptKey ?? "",
    amount_usd: input.amountUsd ?? 0,
    payment_status: input.paymentStatus ?? "pending",
});

export const buildRefundPayload = (organizationId: string, input: CreateRefundInput) => ({
    organization_id: organizationId,
    billing_account_id: input.billingAccountId,
    refund_key: input.refundKey ?? "",
    amount_usd: input.amountUsd ?? 0,
});

export const buildWalletBalancePayload = (organizationId: string, input: CreateWalletBalanceInput) => ({
    organization_id: organizationId,
    billing_account_id: input.billingAccountId,
    balance_key: input.walletKey ?? "",
    balance_usd: input.balanceUsd ?? 0,
});

export const buildMrrSnapshotPayload = (organizationId: string, input: CreateMrrSnapshotInput) => ({
    organization_id: organizationId,
    billing_account_id: input.billingAccountId,
    snapshot_key: input.snapshotKey ?? "",
    mrr_usd: input.mrrUsd ?? 0,
});

export const buildArrSnapshotPayload = (organizationId: string, input: CreateArrSnapshotInput) => ({
    organization_id: organizationId,
    billing_account_id: input.billingAccountId,
    snapshot_key: input.snapshotKey ?? "",
    arr_usd: input.arrUsd ?? 0,
});

export const buildDeferredRevenuePayload = (organizationId: string, input: CreateDeferredRevenueInput) => ({
    organization_id: organizationId,
    billing_account_id: input.billingAccountId,
    deferred_key: input.recordKey ?? "",
    total_deferred_usd: input.amountUsd ?? 0,
});

export const buildRevenueRecognitionPayload = (organizationId: string, input: CreateRevenueRecognitionInput) => ({
    organization_id: organizationId,
    billing_account_id: input.billingAccountId,
    recognition_key: input.recognitionKey ?? "",
    recognized_amount_usd: input.amountUsd ?? 0,
});

export const buildInvoicePayload = (organizationId: string, input: CreateInvoiceInput) => ({
    organization_id: organizationId,
    billing_account_id: input.billingAccountId,
    invoice_key: input.invoiceKey ?? "",
    invoice_number: input.invoiceKey ?? "",
    total_usd: input.amountUsd ?? 0,
});

export const buildCreditNotePayload = (organizationId: string, input: CreateCreditNoteInput) => ({
    organization_id: organizationId,
    billing_account_id: input.billingAccountId,
    credit_key: input.noteKey ?? "",
    amount_usd: input.amountUsd ?? 0,
});

export const buildDebitNotePayload = (organizationId: string, input: CreateDebitNoteInput) => ({
    organization_id: organizationId,
    billing_account_id: input.billingAccountId,
    debit_key: input.noteKey ?? "",
    amount_usd: input.amountUsd ?? 0,
});

export const buildTaxConfigPayload = (organizationId: string, input: CreateTaxConfigInput) => ({
    organization_id: organizationId,
    billing_account_id: input.billingAccountId,
    config_key: input.configKey ?? "",
    tax_name: input.configKey ?? "",
    gst_rate: input.gstRate ?? 0,
});

export const buildOutstandingBalancePayload = (organizationId: string, input: CreateOutstandingBalanceInput) => ({
    organization_id: organizationId,
    billing_account_id: input.billingAccountId,
    balance_key: input.balanceKey ?? "",
    total_outstanding_usd: input.amountUsd ?? 0,
});

export const buildPaymentReminderPayload = (organizationId: string, input: CreatePaymentReminderInput) => ({
    organization_id: organizationId,
    billing_account_id: input.billingAccountId,
    reminder_key: input.reminderKey ?? "",
});

export const buildCollectionCasePayload = (organizationId: string, input: CreateCollectionCaseInput) => ({
    organization_id: organizationId,
    billing_account_id: input.billingAccountId,
    case_key: input.caseKey ?? "",
});

export const buildWriteOffPayload = (organizationId: string, input: CreateWriteOffInput) => ({
    organization_id: organizationId,
    billing_account_id: input.billingAccountId,
    writeoff_key: input.writeOffKey ?? "",
    amount_usd: input.amountUsd ?? 0,
});

export const buildAnalyticsSnapshotPayload = (organizationId: string, input: CreateAnalyticsSnapshotInput) => ({
    organization_id: organizationId,
    billing_account_id: input.billingAccountId,
    snapshot_key: input.snapshotKey ?? "",
});

export const buildRevenueGrowthMetricPayload = (organizationId: string, input: CreateRevenueGrowthMetricInput) => ({
    organization_id: organizationId,
    billing_account_id: input.billingAccountId,
    metrics_key: input.metricsKey ?? "",
    growth_rate_percent: input.growthRatePercent ?? 0,
});

export const buildCashFlowRecordPayload = (organizationId: string, input: CreateCashFlowRecordInput) => ({
    organization_id: organizationId,
    billing_account_id: input.billingAccountId,
    record_key: input.recordKey ?? "",
    net_cash_usd: input.amountUsd ?? 0,
});

export const buildSubscriptionTrendPayload = (organizationId: string, input: CreateSubscriptionTrendInput) => ({
    organization_id: organizationId,
    billing_account_id: input.billingAccountId,
    trend_key: input.trendKey ?? "",
});

export const buildRenewalForecastPayload = (organizationId: string, input: CreateRenewalForecastInput) => ({
    organization_id: organizationId,
    billing_account_id: input.billingAccountId,
    forecast_key: input.forecastKey ?? "",
});

export const buildMrrForecastPayload = (organizationId: string, input: CreateMrrForecastInput) => ({
    organization_id: organizationId,
    billing_account_id: input.billingAccountId,
    forecast_key: input.forecastKey ?? "",
    projected_mrr_usd: input.projectedMrrUsd ?? 0,
});

export const buildArrForecastPayload = (organizationId: string, input: CreateArrForecastInput) => ({
    organization_id: organizationId,
    billing_account_id: input.billingAccountId,
    forecast_key: input.forecastKey ?? "",
    projected_arr_usd: input.projectedArrUsd ?? 0,
});

export const buildRevenueProjectionPayload = (organizationId: string, input: CreateRevenueProjectionInput) => ({
    organization_id: organizationId,
    billing_account_id: input.billingAccountId,
    projection_key: input.projectionKey ?? "",
    projected_revenue_usd: input.projectedRevenueUsd ?? 0,
});

export const buildFinanceMetricPayload = (organizationId: string, input: CreateFinanceMetricInput) => ({
    organization_id: organizationId,
    metrics_key: input.metricsKey ?? "",
    total_mrr_usd: input.mrrUsd ?? 0,
    total_arr_usd: input.arrUsd ?? 0,
});

export const buildFinancialHealthPayload = (organizationId: string, input: CreateFinancialHealthInput) => ({
    organization_id: organizationId,
    health_key: input.healthKey ?? "",
    overall_score: input.overallScore ?? 0,
});

export const buildExpansionContractionPayload = (organizationId: string, input: CreateExpansionContractionInput) => ({
    organization_id: organizationId,
    billing_account_id: input.billingAccountId,
    record_key: input.recordKey ?? "",
    amount_usd: input.expansionUsd ?? 0,
});

export const mapSubscriptionBillingForStats = (record: DbBrvSubscriptionBilling) => ({
    status: record.status,
    mrrUsd: record.mrr_usd,
    amountUsd: record.amount_usd,
    billingCycle: record.billing_cycle,
});

export const mapMrrSnapshotForStats = (record: DbBrvMrrSnapshot) => ({
    mrrUsd: record.mrr_usd,
});

export const mapArrSnapshotForStats = (record: DbBrvArrSnapshot) => ({
    arrUsd: record.arr_usd,
});

export const mapOutstandingBalanceForStats = (record: DbBrvOutstandingBalance) => ({
    amountUsd: record.total_outstanding_usd,
    status: record.status,
});

export const mapInvoiceForStats = (record: DbBrvInvoice) => ({
    status: record.status,
    paymentStatus: record.payment_status,
});

export const mapPaymentAttemptForStats = (record: DbBrvPaymentAttempt) => ({
    status: record.status,
    paymentStatus: record.payment_status,
});
