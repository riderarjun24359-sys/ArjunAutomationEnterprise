export interface BrvDashboardStats {
    totalBillingAccounts: number;
    activeBillingAccounts: number;
    mrrUsd: number;
    arrUsd: number;
    outstandingBalanceUsd: number;
    openInvoiceCount: number;
    failedPaymentCount: number;
    collectionCaseCount: number;
    auditCount: number;
}

export interface BrvPipelineInfo {
    stages: Array<{ key: string; label: string }>;
    currentStage: string;
    nextStage: string;
    previousStage: string;
}

export interface AuditEntry {
    id: string;
    entityType: string;
    entityId?: string | null;
    action: string;
    summary: string;
    securityLevel: string;
    createdAt: string;
}

export interface BillingAccountSummary {
    id: string;
    accountKey: string;
    accountName: string;
    status: string;
}

export interface CreateBillingAccountInput {
    accountKey?: string;
    accountName?: string;
    currencyCode?: string;
}

export interface BillingCycleSummary {
    id: string;
    billingAccountName: string;
    cycleKey: string;
    status: string;
}

export interface CreateBillingCycleInput {
    billingAccountId: string;
    cycleKey?: string;
    billingCycle?: string;
}

export interface SubscriptionBillingSummary {
    id: string;
    billingAccountName: string;
    billingKey: string;
    status: string;
}

export interface CreateSubscriptionBillingInput {
    billingAccountId: string;
    billingKey?: string;
    amountUsd?: number;
    billingCycle?: string;
}

export interface ProrationRecordSummary {
    id: string;
    billingAccountName: string;
    prorationKey: string;
    status: string;
}

export interface CreateProrationRecordInput {
    billingAccountId: string;
    prorationKey?: string;
    amountUsd?: number;
}

export interface PaymentMethodSummary {
    id: string;
    billingAccountName: string;
    methodKey: string;
    status: string;
}

export interface CreatePaymentMethodInput {
    billingAccountId: string;
    methodKey?: string;
    methodType?: string;
}

export interface PaymentAttemptSummary {
    id: string;
    billingAccountName: string;
    attemptKey: string;
    status: string;
}

export interface CreatePaymentAttemptInput {
    billingAccountId: string;
    attemptKey?: string;
    amountUsd?: number;
    paymentStatus?: string;
}

export interface RefundSummary {
    id: string;
    billingAccountName: string;
    refundKey: string;
    status: string;
}

export interface CreateRefundInput {
    billingAccountId: string;
    refundKey?: string;
    amountUsd?: number;
}

export interface WalletBalanceSummary {
    id: string;
    billingAccountName: string;
    walletKey: string;
    status: string;
}

export interface CreateWalletBalanceInput {
    billingAccountId: string;
    walletKey?: string;
    balanceUsd?: number;
}

export interface MrrSnapshotSummary {
    id: string;
    billingAccountName: string;
    snapshotKey: string;
    mrrUsd?: number;
    status: string;
}

export interface CreateMrrSnapshotInput {
    billingAccountId: string;
    snapshotKey?: string;
    mrrUsd?: number;
}

export interface ArrSnapshotSummary {
    id: string;
    billingAccountName: string;
    snapshotKey: string;
    arrUsd?: number;
    status: string;
}

export interface CreateArrSnapshotInput {
    billingAccountId: string;
    snapshotKey?: string;
    arrUsd?: number;
}

export interface DeferredRevenueSummary {
    id: string;
    billingAccountName: string;
    recordKey: string;
    status: string;
}

export interface CreateDeferredRevenueInput {
    billingAccountId: string;
    recordKey?: string;
    amountUsd?: number;
}

export interface RevenueRecognitionSummary {
    id: string;
    billingAccountName: string;
    recognitionKey: string;
    status: string;
}

export interface CreateRevenueRecognitionInput {
    billingAccountId: string;
    recognitionKey?: string;
    amountUsd?: number;
}

export interface InvoiceSummary {
    id: string;
    billingAccountName: string;
    invoiceKey: string;
    status: string;
}

export interface CreateInvoiceInput {
    billingAccountId: string;
    invoiceKey?: string;
    amountUsd?: number;
}

export interface CreditNoteSummary {
    id: string;
    billingAccountName: string;
    noteKey: string;
    status: string;
}

export interface CreateCreditNoteInput {
    billingAccountId: string;
    noteKey?: string;
    amountUsd?: number;
}

export interface DebitNoteSummary {
    id: string;
    billingAccountName: string;
    noteKey: string;
    status: string;
}

export interface CreateDebitNoteInput {
    billingAccountId: string;
    noteKey?: string;
    amountUsd?: number;
}

export interface TaxConfigSummary {
    id: string;
    billingAccountName: string;
    configKey: string;
    status: string;
}

export interface CreateTaxConfigInput {
    billingAccountId: string;
    configKey?: string;
    gstRate?: number;
}

export interface OutstandingBalanceSummary {
    id: string;
    billingAccountName: string;
    balanceKey: string;
    amountUsd?: number;
    status: string;
}

export interface CreateOutstandingBalanceInput {
    billingAccountId: string;
    balanceKey?: string;
    amountUsd?: number;
}

export interface PaymentReminderSummary {
    id: string;
    billingAccountName: string;
    reminderKey: string;
    status: string;
}

export interface CreatePaymentReminderInput {
    billingAccountId: string;
    reminderKey?: string;
    
}

export interface CollectionCaseSummary {
    id: string;
    billingAccountName: string;
    caseKey: string;
    status: string;
}

export interface CreateCollectionCaseInput {
    billingAccountId: string;
    caseKey?: string;
    
}

export interface WriteOffSummary {
    id: string;
    billingAccountName: string;
    writeOffKey: string;
    status: string;
}

export interface CreateWriteOffInput {
    billingAccountId: string;
    writeOffKey?: string;
    amountUsd?: number;
}

export interface AnalyticsSnapshotSummary {
    id: string;
    billingAccountName: string;
    snapshotKey: string;
    status: string;
}

export interface CreateAnalyticsSnapshotInput {
    billingAccountId: string;
    snapshotKey?: string;
    
}

export interface RevenueGrowthMetricSummary {
    id: string;
    billingAccountName: string;
    metricsKey: string;
    status: string;
}

export interface CreateRevenueGrowthMetricInput {
    billingAccountId: string;
    metricsKey?: string;
    growthRatePercent?: number;
}

export interface CashFlowRecordSummary {
    id: string;
    billingAccountName: string;
    recordKey: string;
    status: string;
}

export interface CreateCashFlowRecordInput {
    billingAccountId: string;
    recordKey?: string;
    amountUsd?: number;
}

export interface SubscriptionTrendSummary {
    id: string;
    billingAccountName: string;
    trendKey: string;
    status: string;
}

export interface CreateSubscriptionTrendInput {
    billingAccountId: string;
    trendKey?: string;
    
}

export interface RenewalForecastSummary {
    id: string;
    billingAccountName: string;
    forecastKey: string;
    status: string;
}

export interface CreateRenewalForecastInput {
    billingAccountId: string;
    forecastKey?: string;
    
}

export interface MrrForecastSummary {
    id: string;
    billingAccountName: string;
    forecastKey: string;
    status: string;
}

export interface CreateMrrForecastInput {
    billingAccountId: string;
    forecastKey?: string;
    projectedMrrUsd?: number;
}

export interface ArrForecastSummary {
    id: string;
    billingAccountName: string;
    forecastKey: string;
    status: string;
}

export interface CreateArrForecastInput {
    billingAccountId: string;
    forecastKey?: string;
    projectedArrUsd?: number;
}

export interface RevenueProjectionSummary {
    id: string;
    billingAccountName: string;
    projectionKey: string;
    status: string;
}

export interface CreateRevenueProjectionInput {
    billingAccountId: string;
    projectionKey?: string;
    projectedRevenueUsd?: number;
}

export interface FinanceMetricSummary {
    id: string;
    metricsKey: string;
    status: string;
}

export interface CreateFinanceMetricInput {
    metricsKey?: string;
    mrrUsd?: number;
    arrUsd?: number;
}

export interface FinancialHealthSummary {
    id: string;
    healthKey: string;
    status: string;
}

export interface CreateFinancialHealthInput {
    healthKey?: string;
    overallScore?: number;
}

export interface ExpansionContractionSummary {
    id: string;
    billingAccountName: string;
    recordKey: string;
    status: string;
}

export interface CreateExpansionContractionInput {
    billingAccountId: string;
    recordKey?: string;
    expansionUsd?: number;
}

export interface BrvSdkGenerateInvoiceInput { billingAccountId: string; invoiceKey: string; amountUsd: number; }
export interface BrvSdkGenerateInvoiceResult { invoiceId: string; invoiceKey: string; amountUsd: number; status: string; }
export interface BrvSdkProcessPaymentInput { billingAccountId: string; attemptKey: string; amountUsd: number; paymentStatus?: string; }
export interface BrvSdkProcessPaymentResult { attemptId: string; attemptKey: string; paymentStatus: string; }
export interface BrvSdkRecognizeRevenueInput { billingAccountId: string; recognitionKey: string; amountUsd: number; }
export interface BrvSdkRecognizeRevenueResult { recognitionId: string; recognitionKey: string; amountUsd: number; status: string; }
