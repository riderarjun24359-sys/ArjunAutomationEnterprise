"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { LoadingState } from "@/src/components/ui/LoadingState";
import {
    BillingRevenueOverviewPanel,
    BillingAccountsPanel,
    BillingCyclesPanel,
    SubscriptionBillingsPanel,
    ProrationRecordsPanel,
    PaymentMethodsPanel,
    PaymentAttemptsPanel,
    RefundsPanel,
    WalletBalancesPanel,
    MrrSnapshotsPanel,
    ArrSnapshotsPanel,
    DeferredRevenuesPanel,
    RevenueRecognitionsPanel,
    InvoicesPanel,
    CreditNotesPanel,
    DebitNotesPanel,
    TaxConfigsPanel,
    OutstandingBalancesPanel,
    PaymentRemindersPanel,
    CollectionCasesPanel,
    WriteOffsPanel,
    AnalyticsSnapshotsPanel,
    RevenueGrowthMetricsPanel,
    CashFlowRecordsPanel,
    SubscriptionTrendsPanel,
    RenewalForecastsPanel,
    MrrForecastsPanel,
    ArrForecastsPanel,
    RevenueProjectionsPanel,
    FinanceMetricsPanel,
    FinancialHealthsPanel,
    ExpansionContractionsPanel,
    BrvAuditLogsPanel,
    BillingRevenueSdkPanel,
} from "@/src/modules/billing-revenue/components/BillingRevenuePanels";
import { BillingRevenueStats } from "@/src/modules/billing-revenue/components/BillingRevenueStats";
import { BRV_TABS } from "@/src/modules/billing-revenue/constants";
import { useBillingRevenue } from "@/src/modules/billing-revenue/hooks/useBillingRevenue";

const tabs = [
    { id: BRV_TABS.overview, label: "Overview" },
    { id: BRV_TABS.billingAccounts, label: "Billing Accounts" },
    { id: BRV_TABS.billingCycles, label: "Billing Cycles" },
    { id: BRV_TABS.subscriptionBillings, label: "Subscription Billings" },
    { id: BRV_TABS.prorationRecords, label: "Proration Records" },
    { id: BRV_TABS.paymentMethods, label: "Payment Methods" },
    { id: BRV_TABS.paymentAttempts, label: "Payment Attempts" },
    { id: BRV_TABS.refunds, label: "Refunds" },
    { id: BRV_TABS.walletBalances, label: "Wallet Balances" },
    { id: BRV_TABS.mrrSnapshots, label: "MRR Snapshots" },
    { id: BRV_TABS.arrSnapshots, label: "ARR Snapshots" },
    { id: BRV_TABS.deferredRevenue, label: "Deferred Revenue" },
    { id: BRV_TABS.revenueRecognition, label: "Revenue Recognition" },
    { id: BRV_TABS.invoices, label: "Invoices" },
    { id: BRV_TABS.creditNotes, label: "Credit Notes" },
    { id: BRV_TABS.debitNotes, label: "Debit Notes" },
    { id: BRV_TABS.taxConfigs, label: "Tax Configs" },
    { id: BRV_TABS.outstandingBalances, label: "Outstanding Balances" },
    { id: BRV_TABS.paymentReminders, label: "Payment Reminders" },
    { id: BRV_TABS.collectionCases, label: "Collection Cases" },
    { id: BRV_TABS.writeOffs, label: "Write-offs" },
    { id: BRV_TABS.analyticsSnapshots, label: "Analytics Snapshots" },
    { id: BRV_TABS.revenueGrowthMetrics, label: "Revenue Growth Metrics" },
    { id: BRV_TABS.cashFlowRecords, label: "Cash Flow Records" },
    { id: BRV_TABS.subscriptionTrends, label: "Subscription Trends" },
    { id: BRV_TABS.renewalForecasts, label: "Renewal Forecasts" },
    { id: BRV_TABS.mrrForecasts, label: "MRR Forecasts" },
    { id: BRV_TABS.arrForecasts, label: "ARR Forecasts" },
    { id: BRV_TABS.revenueProjections, label: "Revenue Projections" },
    { id: BRV_TABS.financeMetrics, label: "Finance Metrics" },
    { id: BRV_TABS.financialHealth, label: "Financial Health" },
    { id: BRV_TABS.expansionContraction, label: "Expansion & Contraction" },
    { id: BRV_TABS.auditLogs, label: "Audit Logs" },
    { id: BRV_TABS.api, label: "SDK" },
] as const;

export function BillingRevenuePage() {
    const billingRevenue = useBillingRevenue();
    const [activeTab, setActiveTab] = useState<(typeof BRV_TABS)[keyof typeof BRV_TABS]>(BRV_TABS.overview);

    if (billingRevenue.loading) {
        return <div className="mx-auto max-w-7xl"><LoadingState label="Loading Billing & Revenue" /></div>;
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-slate-900 dark:text-slate-100">
            <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-amber-600">V2 Program A Sprint 4</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Enterprise Billing & Revenue Platform</h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                    Financial backbone for the Commercial SaaS Platform: subscription billing, payment management, revenue recognition, invoice center, collections, financial analytics, revenue forecasting, and finance operations dashboard with security-first audit and the shared Billing & Revenue SDK.
                </p>
            </motion.header>
            <BillingRevenueStats stats={billingRevenue.stats} />
            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === tab.id ? "bg-amber-600 text-white" : "border border-slate-200 text-slate-600 hover:border-amber-300 dark:border-slate-800 dark:text-slate-300"}`}>{tab.label}</button>
                ))}
            </div>
            {activeTab === BRV_TABS.overview ? <BillingRevenueOverviewPanel data={billingRevenue} /> : null}
            {activeTab === BRV_TABS.billingAccounts ? <BillingAccountsPanel data={billingRevenue} /> : null}
            {activeTab === BRV_TABS.billingCycles ? <BillingCyclesPanel data={billingRevenue} /> : null}
            {activeTab === BRV_TABS.subscriptionBillings ? <SubscriptionBillingsPanel data={billingRevenue} /> : null}
            {activeTab === BRV_TABS.prorationRecords ? <ProrationRecordsPanel data={billingRevenue} /> : null}
            {activeTab === BRV_TABS.paymentMethods ? <PaymentMethodsPanel data={billingRevenue} /> : null}
            {activeTab === BRV_TABS.paymentAttempts ? <PaymentAttemptsPanel data={billingRevenue} /> : null}
            {activeTab === BRV_TABS.refunds ? <RefundsPanel data={billingRevenue} /> : null}
            {activeTab === BRV_TABS.walletBalances ? <WalletBalancesPanel data={billingRevenue} /> : null}
            {activeTab === BRV_TABS.mrrSnapshots ? <MrrSnapshotsPanel data={billingRevenue} /> : null}
            {activeTab === BRV_TABS.arrSnapshots ? <ArrSnapshotsPanel data={billingRevenue} /> : null}
            {activeTab === BRV_TABS.deferredRevenue ? <DeferredRevenuesPanel data={billingRevenue} /> : null}
            {activeTab === BRV_TABS.revenueRecognition ? <RevenueRecognitionsPanel data={billingRevenue} /> : null}
            {activeTab === BRV_TABS.invoices ? <InvoicesPanel data={billingRevenue} /> : null}
            {activeTab === BRV_TABS.creditNotes ? <CreditNotesPanel data={billingRevenue} /> : null}
            {activeTab === BRV_TABS.debitNotes ? <DebitNotesPanel data={billingRevenue} /> : null}
            {activeTab === BRV_TABS.taxConfigs ? <TaxConfigsPanel data={billingRevenue} /> : null}
            {activeTab === BRV_TABS.outstandingBalances ? <OutstandingBalancesPanel data={billingRevenue} /> : null}
            {activeTab === BRV_TABS.paymentReminders ? <PaymentRemindersPanel data={billingRevenue} /> : null}
            {activeTab === BRV_TABS.collectionCases ? <CollectionCasesPanel data={billingRevenue} /> : null}
            {activeTab === BRV_TABS.writeOffs ? <WriteOffsPanel data={billingRevenue} /> : null}
            {activeTab === BRV_TABS.analyticsSnapshots ? <AnalyticsSnapshotsPanel data={billingRevenue} /> : null}
            {activeTab === BRV_TABS.revenueGrowthMetrics ? <RevenueGrowthMetricsPanel data={billingRevenue} /> : null}
            {activeTab === BRV_TABS.cashFlowRecords ? <CashFlowRecordsPanel data={billingRevenue} /> : null}
            {activeTab === BRV_TABS.subscriptionTrends ? <SubscriptionTrendsPanel data={billingRevenue} /> : null}
            {activeTab === BRV_TABS.renewalForecasts ? <RenewalForecastsPanel data={billingRevenue} /> : null}
            {activeTab === BRV_TABS.mrrForecasts ? <MrrForecastsPanel data={billingRevenue} /> : null}
            {activeTab === BRV_TABS.arrForecasts ? <ArrForecastsPanel data={billingRevenue} /> : null}
            {activeTab === BRV_TABS.revenueProjections ? <RevenueProjectionsPanel data={billingRevenue} /> : null}
            {activeTab === BRV_TABS.financeMetrics ? <FinanceMetricsPanel data={billingRevenue} /> : null}
            {activeTab === BRV_TABS.financialHealth ? <FinancialHealthsPanel data={billingRevenue} /> : null}
            {activeTab === BRV_TABS.expansionContraction ? <ExpansionContractionsPanel data={billingRevenue} /> : null}
            {activeTab === BRV_TABS.auditLogs ? <BrvAuditLogsPanel data={billingRevenue} /> : null}
            {activeTab === BRV_TABS.api ? <BillingRevenueSdkPanel data={billingRevenue} /> : null}
        </div>
    );
}
