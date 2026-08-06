import type {
    DbBrvArrSnapshot,
    DbBrvBillingAccount,
    DbBrvCollectionCase,
    DbBrvInvoice,
    DbBrvMrrSnapshot,
    DbBrvOutstandingBalance,
    DbBrvPaymentAttempt,
    DbBrvRefund,
    DbBrvSubscriptionBilling,
    DbClient,
    DbCsExpansionOpportunity,
    DbCsHealthScore,
    DbInvoice,
    DbPayment,
    DbProject,
} from "@/src/modules/database/types/platform";

export interface BillingFinanceRawData {
    organizationId: string;
    clients: DbClient[];
    projects: DbProject[];
    billingAccounts: DbBrvBillingAccount[];
    subscriptions: DbBrvSubscriptionBilling[];
    brvInvoices: DbBrvInvoice[];
    paymentAttempts: DbBrvPaymentAttempt[];
    refunds: DbBrvRefund[];
    mrrSnapshots: DbBrvMrrSnapshot[];
    arrSnapshots: DbBrvArrSnapshot[];
    outstandingBalances: DbBrvOutstandingBalance[];
    collectionCases: DbBrvCollectionCase[];
    financeInvoices: DbInvoice[];
    financePayments: DbPayment[];
    csHealthScores: DbCsHealthScore[];
    csExpansions: DbCsExpansionOpportunity[];
    fetchedAt: string;
}
