"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { billingRevenueService } from "@/src/modules/billing-revenue/services/billing-revenue.service";
import type {
    AnalyticsSnapshotSummary,
    ArrForecastSummary,
    ArrSnapshotSummary,
    AuditEntry,
    BillingAccountSummary,
    BillingCycleSummary,
    BrvDashboardStats,
    BrvPipelineInfo,
    CashFlowRecordSummary,
    CollectionCaseSummary,
    CreateAnalyticsSnapshotInput,
    CreateArrForecastInput,
    CreateArrSnapshotInput,
    CreateBillingAccountInput,
    CreateBillingCycleInput,
    CreateCashFlowRecordInput,
    CreateCollectionCaseInput,
    CreateCreditNoteInput,
    CreateDebitNoteInput,
    CreateDeferredRevenueInput,
    CreateExpansionContractionInput,
    CreateFinanceMetricInput,
    CreateFinancialHealthInput,
    CreateInvoiceInput,
    CreateMrrForecastInput,
    CreateMrrSnapshotInput,
    CreateOutstandingBalanceInput,
    CreatePaymentAttemptInput,
    CreatePaymentMethodInput,
    CreatePaymentReminderInput,
    CreateProrationRecordInput,
    CreateRefundInput,
    CreateRenewalForecastInput,
    CreateRevenueGrowthMetricInput,
    CreateRevenueProjectionInput,
    CreateRevenueRecognitionInput,
    CreateSubscriptionBillingInput,
    CreateSubscriptionTrendInput,
    CreateTaxConfigInput,
    CreateWalletBalanceInput,
    CreateWriteOffInput,
    CreditNoteSummary,
    DebitNoteSummary,
    DeferredRevenueSummary,
    ExpansionContractionSummary,
    FinanceMetricSummary,
    FinancialHealthSummary,
    InvoiceSummary,
    MrrForecastSummary,
    MrrSnapshotSummary,
    OutstandingBalanceSummary,
    PaymentAttemptSummary,
    PaymentMethodSummary,
    PaymentReminderSummary,
    ProrationRecordSummary,
    RefundSummary,
    RenewalForecastSummary,
    RevenueGrowthMetricSummary,
    RevenueProjectionSummary,
    RevenueRecognitionSummary,
    SubscriptionBillingSummary,
    SubscriptionTrendSummary,
    TaxConfigSummary,
    WalletBalanceSummary,
    WriteOffSummary,
} from "@/src/modules/billing-revenue/types";

export function useBillingRevenue() {
    const user = useAuthStore((state) => state.user);
    const authUserId = user?.id;
    const email = user?.email ?? "";
    const fullName = user?.fullName;
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<BrvDashboardStats | null>(null);
    const [pipeline, setPipeline] = useState<BrvPipelineInfo | null>(null);
    const [billingAccounts, setBillingAccounts] = useState<BillingAccountSummary[]>([]);
    const [billingCycles, setBillingCycles] = useState<BillingCycleSummary[]>([]);
    const [subscriptionBillings, setSubscriptionBillings] = useState<SubscriptionBillingSummary[]>([]);
    const [prorationRecords, setProrationRecords] = useState<ProrationRecordSummary[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethodSummary[]>([]);
    const [paymentAttempts, setPaymentAttempts] = useState<PaymentAttemptSummary[]>([]);
    const [refunds, setRefunds] = useState<RefundSummary[]>([]);
    const [walletBalances, setWalletBalances] = useState<WalletBalanceSummary[]>([]);
    const [mrrSnapshots, setMrrSnapshots] = useState<MrrSnapshotSummary[]>([]);
    const [arrSnapshots, setArrSnapshots] = useState<ArrSnapshotSummary[]>([]);
    const [deferredRevenue, setDeferredRevenues] = useState<DeferredRevenueSummary[]>([]);
    const [revenueRecognition, setRevenueRecognitions] = useState<RevenueRecognitionSummary[]>([]);
    const [invoices, setInvoices] = useState<InvoiceSummary[]>([]);
    const [creditNotes, setCreditNotes] = useState<CreditNoteSummary[]>([]);
    const [debitNotes, setDebitNotes] = useState<DebitNoteSummary[]>([]);
    const [taxConfigs, setTaxConfigs] = useState<TaxConfigSummary[]>([]);
    const [outstandingBalances, setOutstandingBalances] = useState<OutstandingBalanceSummary[]>([]);
    const [paymentReminders, setPaymentReminders] = useState<PaymentReminderSummary[]>([]);
    const [collectionCases, setCollectionCases] = useState<CollectionCaseSummary[]>([]);
    const [writeOffs, setWriteOffs] = useState<WriteOffSummary[]>([]);
    const [analyticsSnapshots, setAnalyticsSnapshots] = useState<AnalyticsSnapshotSummary[]>([]);
    const [revenueGrowthMetrics, setRevenueGrowthMetrics] = useState<RevenueGrowthMetricSummary[]>([]);
    const [cashFlowRecords, setCashFlowRecords] = useState<CashFlowRecordSummary[]>([]);
    const [subscriptionTrends, setSubscriptionTrends] = useState<SubscriptionTrendSummary[]>([]);
    const [renewalForecasts, setRenewalForecasts] = useState<RenewalForecastSummary[]>([]);
    const [mrrForecasts, setMrrForecasts] = useState<MrrForecastSummary[]>([]);
    const [arrForecasts, setArrForecasts] = useState<ArrForecastSummary[]>([]);
    const [revenueProjections, setRevenueProjections] = useState<RevenueProjectionSummary[]>([]);
    const [financeMetrics, setFinanceMetrics] = useState<FinanceMetricSummary[]>([]);
    const [financialHealth, setFinancialHealths] = useState<FinancialHealthSummary[]>([]);
    const [expansionContraction, setExpansionContractions] = useState<ExpansionContractionSummary[]>([]);
    const [auditLogs, setBrvAuditLogs] = useState<AuditEntry[]>([]);
    const [billingAccountOptions, setBillingAccountOptions] = useState<Array<{ id: string; name: string }>>([]);

    const fetchData = useCallback(async () => {
        if (!authUserId || !email) return { empty: true as const };
        const [
            statsData,
            pipelineInfo,
            billingAccountsList,
            billingCyclesList,
            subscriptionBillingsList,
            prorationRecordsList,
            paymentMethodsList,
            paymentAttemptsList,
            refundsList,
            walletBalancesList,
            mrrSnapshotsList,
            arrSnapshotsList,
            deferredRevenueList,
            revenueRecognitionList,
            invoicesList,
            creditNotesList,
            debitNotesList,
            taxConfigsList,
            outstandingBalancesList,
            paymentRemindersList,
            collectionCasesList,
            writeOffsList,
            analyticsSnapshotsList,
            revenueGrowthMetricsList,
            cashFlowRecordsList,
            subscriptionTrendsList,
            renewalForecastsList,
            mrrForecastsList,
            arrForecastsList,
            revenueProjectionsList,
            financeMetricsList,
            financialHealthList,
            expansionContractionList,
            auditLogsList,
            accountOpts,
        ] = await Promise.all([
            billingRevenueService.getDashboardStats(authUserId, email, fullName),
            Promise.resolve(billingRevenueService.getPipelineInfo()),
            billingRevenueService.getBillingAccounts(authUserId, email, fullName),
            billingRevenueService.getBillingCycles(authUserId, email, fullName),
            billingRevenueService.getSubscriptionBillings(authUserId, email, fullName),
            billingRevenueService.getProrationRecords(authUserId, email, fullName),
            billingRevenueService.getPaymentMethods(authUserId, email, fullName),
            billingRevenueService.getPaymentAttempts(authUserId, email, fullName),
            billingRevenueService.getRefunds(authUserId, email, fullName),
            billingRevenueService.getWalletBalances(authUserId, email, fullName),
            billingRevenueService.getMrrSnapshots(authUserId, email, fullName),
            billingRevenueService.getArrSnapshots(authUserId, email, fullName),
            billingRevenueService.getDeferredRevenues(authUserId, email, fullName),
            billingRevenueService.getRevenueRecognitions(authUserId, email, fullName),
            billingRevenueService.getInvoices(authUserId, email, fullName),
            billingRevenueService.getCreditNotes(authUserId, email, fullName),
            billingRevenueService.getDebitNotes(authUserId, email, fullName),
            billingRevenueService.getTaxConfigs(authUserId, email, fullName),
            billingRevenueService.getOutstandingBalances(authUserId, email, fullName),
            billingRevenueService.getPaymentReminders(authUserId, email, fullName),
            billingRevenueService.getCollectionCases(authUserId, email, fullName),
            billingRevenueService.getWriteOffs(authUserId, email, fullName),
            billingRevenueService.getAnalyticsSnapshots(authUserId, email, fullName),
            billingRevenueService.getRevenueGrowthMetrics(authUserId, email, fullName),
            billingRevenueService.getCashFlowRecords(authUserId, email, fullName),
            billingRevenueService.getSubscriptionTrends(authUserId, email, fullName),
            billingRevenueService.getRenewalForecasts(authUserId, email, fullName),
            billingRevenueService.getMrrForecasts(authUserId, email, fullName),
            billingRevenueService.getArrForecasts(authUserId, email, fullName),
            billingRevenueService.getRevenueProjections(authUserId, email, fullName),
            billingRevenueService.getFinanceMetrics(authUserId, email, fullName),
            billingRevenueService.getFinancialHealths(authUserId, email, fullName),
            billingRevenueService.getExpansionContractions(authUserId, email, fullName),
            billingRevenueService.getAuditLogs(authUserId, email, fullName),
            billingRevenueService.getBillingAccountOptions(authUserId, email, fullName),
        ]);
        return {
            statsData,
            pipelineInfo,
            billingAccountsList,
            billingCyclesList,
            subscriptionBillingsList,
            prorationRecordsList,
            paymentMethodsList,
            paymentAttemptsList,
            refundsList,
            walletBalancesList,
            mrrSnapshotsList,
            arrSnapshotsList,
            deferredRevenueList,
            revenueRecognitionList,
            invoicesList,
            creditNotesList,
            debitNotesList,
            taxConfigsList,
            outstandingBalancesList,
            paymentRemindersList,
            collectionCasesList,
            writeOffsList,
            analyticsSnapshotsList,
            revenueGrowthMetricsList,
            cashFlowRecordsList,
            subscriptionTrendsList,
            renewalForecastsList,
            mrrForecastsList,
            arrForecastsList,
            revenueProjectionsList,
            financeMetricsList,
            financialHealthList,
            expansionContractionList,
            auditLogsList,
            accountOpts,
        };
    }, [authUserId, email, fullName]);

    const applyData = useCallback((result: Awaited<ReturnType<typeof fetchData>>) => {
        if ("empty" in result) { setLoading(false); return; }
        setStats(result.statsData);
        setPipeline(result.pipelineInfo);
        setBillingAccounts(result.billingAccountsList);
        setBillingCycles(result.billingCyclesList);
        setSubscriptionBillings(result.subscriptionBillingsList);
        setProrationRecords(result.prorationRecordsList);
        setPaymentMethods(result.paymentMethodsList);
        setPaymentAttempts(result.paymentAttemptsList);
        setRefunds(result.refundsList);
        setWalletBalances(result.walletBalancesList);
        setMrrSnapshots(result.mrrSnapshotsList);
        setArrSnapshots(result.arrSnapshotsList);
        setDeferredRevenues(result.deferredRevenueList);
        setRevenueRecognitions(result.revenueRecognitionList);
        setInvoices(result.invoicesList);
        setCreditNotes(result.creditNotesList);
        setDebitNotes(result.debitNotesList);
        setTaxConfigs(result.taxConfigsList);
        setOutstandingBalances(result.outstandingBalancesList);
        setPaymentReminders(result.paymentRemindersList);
        setCollectionCases(result.collectionCasesList);
        setWriteOffs(result.writeOffsList);
        setAnalyticsSnapshots(result.analyticsSnapshotsList);
        setRevenueGrowthMetrics(result.revenueGrowthMetricsList);
        setCashFlowRecords(result.cashFlowRecordsList);
        setSubscriptionTrends(result.subscriptionTrendsList);
        setRenewalForecasts(result.renewalForecastsList);
        setMrrForecasts(result.mrrForecastsList);
        setArrForecasts(result.arrForecastsList);
        setRevenueProjections(result.revenueProjectionsList);
        setFinanceMetrics(result.financeMetricsList);
        setFinancialHealths(result.financialHealthList);
        setExpansionContractions(result.expansionContractionList);
        setBrvAuditLogs(result.auditLogsList);
        setBillingAccountOptions(result.accountOpts);
        setLoading(false);
    }, []);

    const refresh = useCallback(async () => { applyData(await fetchData()); }, [fetchData, applyData]);

    useEffect(() => {
        let cancelled = false;
        void fetchData().then((data) => { if (!cancelled) applyData(data); }).catch(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [fetchData, applyData]);

    const createBillingAccount = useCallback(async (input: CreateBillingAccountInput) => { if (!user) throw new Error("Authentication required"); await billingRevenueService.createBillingAccount(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createBillingCycle = useCallback(async (input: CreateBillingCycleInput) => { if (!user) throw new Error("Authentication required"); await billingRevenueService.createBillingCycle(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createSubscriptionBilling = useCallback(async (input: CreateSubscriptionBillingInput) => { if (!user) throw new Error("Authentication required"); await billingRevenueService.createSubscriptionBilling(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createProrationRecord = useCallback(async (input: CreateProrationRecordInput) => { if (!user) throw new Error("Authentication required"); await billingRevenueService.createProrationRecord(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createPaymentMethod = useCallback(async (input: CreatePaymentMethodInput) => { if (!user) throw new Error("Authentication required"); await billingRevenueService.createPaymentMethod(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createPaymentAttempt = useCallback(async (input: CreatePaymentAttemptInput) => { if (!user) throw new Error("Authentication required"); await billingRevenueService.createPaymentAttempt(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRefund = useCallback(async (input: CreateRefundInput) => { if (!user) throw new Error("Authentication required"); await billingRevenueService.createRefund(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createWalletBalance = useCallback(async (input: CreateWalletBalanceInput) => { if (!user) throw new Error("Authentication required"); await billingRevenueService.createWalletBalance(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createMrrSnapshot = useCallback(async (input: CreateMrrSnapshotInput) => { if (!user) throw new Error("Authentication required"); await billingRevenueService.createMrrSnapshot(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createArrSnapshot = useCallback(async (input: CreateArrSnapshotInput) => { if (!user) throw new Error("Authentication required"); await billingRevenueService.createArrSnapshot(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createDeferredRevenue = useCallback(async (input: CreateDeferredRevenueInput) => { if (!user) throw new Error("Authentication required"); await billingRevenueService.createDeferredRevenue(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRevenueRecognition = useCallback(async (input: CreateRevenueRecognitionInput) => { if (!user) throw new Error("Authentication required"); await billingRevenueService.createRevenueRecognition(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createInvoice = useCallback(async (input: CreateInvoiceInput) => { if (!user) throw new Error("Authentication required"); await billingRevenueService.createInvoice(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createCreditNote = useCallback(async (input: CreateCreditNoteInput) => { if (!user) throw new Error("Authentication required"); await billingRevenueService.createCreditNote(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createDebitNote = useCallback(async (input: CreateDebitNoteInput) => { if (!user) throw new Error("Authentication required"); await billingRevenueService.createDebitNote(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createTaxConfig = useCallback(async (input: CreateTaxConfigInput) => { if (!user) throw new Error("Authentication required"); await billingRevenueService.createTaxConfig(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createOutstandingBalance = useCallback(async (input: CreateOutstandingBalanceInput) => { if (!user) throw new Error("Authentication required"); await billingRevenueService.createOutstandingBalance(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createPaymentReminder = useCallback(async (input: CreatePaymentReminderInput) => { if (!user) throw new Error("Authentication required"); await billingRevenueService.createPaymentReminder(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createCollectionCase = useCallback(async (input: CreateCollectionCaseInput) => { if (!user) throw new Error("Authentication required"); await billingRevenueService.createCollectionCase(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createWriteOff = useCallback(async (input: CreateWriteOffInput) => { if (!user) throw new Error("Authentication required"); await billingRevenueService.createWriteOff(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createAnalyticsSnapshot = useCallback(async (input: CreateAnalyticsSnapshotInput) => { if (!user) throw new Error("Authentication required"); await billingRevenueService.createAnalyticsSnapshot(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRevenueGrowthMetric = useCallback(async (input: CreateRevenueGrowthMetricInput) => { if (!user) throw new Error("Authentication required"); await billingRevenueService.createRevenueGrowthMetric(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createCashFlowRecord = useCallback(async (input: CreateCashFlowRecordInput) => { if (!user) throw new Error("Authentication required"); await billingRevenueService.createCashFlowRecord(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createSubscriptionTrend = useCallback(async (input: CreateSubscriptionTrendInput) => { if (!user) throw new Error("Authentication required"); await billingRevenueService.createSubscriptionTrend(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRenewalForecast = useCallback(async (input: CreateRenewalForecastInput) => { if (!user) throw new Error("Authentication required"); await billingRevenueService.createRenewalForecast(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createMrrForecast = useCallback(async (input: CreateMrrForecastInput) => { if (!user) throw new Error("Authentication required"); await billingRevenueService.createMrrForecast(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createArrForecast = useCallback(async (input: CreateArrForecastInput) => { if (!user) throw new Error("Authentication required"); await billingRevenueService.createArrForecast(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRevenueProjection = useCallback(async (input: CreateRevenueProjectionInput) => { if (!user) throw new Error("Authentication required"); await billingRevenueService.createRevenueProjection(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createFinanceMetric = useCallback(async (input: CreateFinanceMetricInput) => { if (!user) throw new Error("Authentication required"); await billingRevenueService.createFinanceMetric(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createFinancialHealth = useCallback(async (input: CreateFinancialHealthInput) => { if (!user) throw new Error("Authentication required"); await billingRevenueService.createFinancialHealth(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createExpansionContraction = useCallback(async (input: CreateExpansionContractionInput) => { if (!user) throw new Error("Authentication required"); await billingRevenueService.createExpansionContraction(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);

    return {
        loading,
        stats,
        pipeline,
        billingAccounts,
        billingCycles,
        subscriptionBillings,
        prorationRecords,
        paymentMethods,
        paymentAttempts,
        refunds,
        walletBalances,
        mrrSnapshots,
        arrSnapshots,
        deferredRevenue,
        revenueRecognition,
        invoices,
        creditNotes,
        debitNotes,
        taxConfigs,
        outstandingBalances,
        paymentReminders,
        collectionCases,
        writeOffs,
        analyticsSnapshots,
        revenueGrowthMetrics,
        cashFlowRecords,
        subscriptionTrends,
        renewalForecasts,
        mrrForecasts,
        arrForecasts,
        revenueProjections,
        financeMetrics,
        financialHealth,
        expansionContraction,
        auditLogs,
        billingAccountOptions,
        refresh,
        createBillingAccount,
        createBillingCycle,
        createSubscriptionBilling,
        createProrationRecord,
        createPaymentMethod,
        createPaymentAttempt,
        createRefund,
        createWalletBalance,
        createMrrSnapshot,
        createArrSnapshot,
        createDeferredRevenue,
        createRevenueRecognition,
        createInvoice,
        createCreditNote,
        createDebitNote,
        createTaxConfig,
        createOutstandingBalance,
        createPaymentReminder,
        createCollectionCase,
        createWriteOff,
        createAnalyticsSnapshot,
        createRevenueGrowthMetric,
        createCashFlowRecord,
        createSubscriptionTrend,
        createRenewalForecast,
        createMrrForecast,
        createArrForecast,
        createRevenueProjection,
        createFinanceMetric,
        createFinancialHealth,
        createExpansionContraction,
    };
}
