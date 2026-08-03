import {
    buildAnalyticsSnapshotPayload,
    buildArrForecastPayload,
    buildArrSnapshotPayload,
    buildBillingAccountLookupMaps,
    buildBillingAccountPayload,
    buildBillingCyclePayload,
    buildBrvAuditPayload,
    buildBrvDashboardStats,
    buildBrvPipelineInfo,
    mapSubscriptionBillingForStats,
    mapMrrSnapshotForStats,
    mapArrSnapshotForStats,
    mapOutstandingBalanceForStats,
    mapInvoiceForStats,
    mapPaymentAttemptForStats,
    buildCashFlowRecordPayload,
    buildCollectionCasePayload,
    buildCreditNotePayload,
    buildDebitNotePayload,
    buildDeferredRevenuePayload,
    buildExpansionContractionPayload,
    buildFinanceMetricPayload,
    buildFinancialHealthPayload,
    buildInvoicePayload,
    buildMrrForecastPayload,
    buildMrrSnapshotPayload,
    buildOutstandingBalancePayload,
    buildPaymentAttemptPayload,
    buildPaymentMethodPayload,
    buildPaymentReminderPayload,
    buildProrationRecordPayload,
    buildRefundPayload,
    buildRenewalForecastPayload,
    buildRevenueGrowthMetricPayload,
    buildRevenueProjectionPayload,
    buildRevenueRecognitionPayload,
    buildSubscriptionBillingPayload,
    buildSubscriptionTrendPayload,
    buildTaxConfigPayload,
    buildWalletBalancePayload,
    buildWriteOffPayload,
    mapAnalyticsSnapshotSummary,
    mapArrForecastSummary,
    mapArrSnapshotSummary,
    mapAuditEntry,
    mapBillingAccountSummary,
    mapBillingCycleSummary,
    mapCashFlowRecordSummary,
    mapCollectionCaseSummary,
    mapCreditNoteSummary,
    mapDebitNoteSummary,
    mapDeferredRevenueSummary,
    mapExpansionContractionSummary,
    mapFinanceMetricSummary,
    mapFinancialHealthSummary,
    mapInvoiceSummary,
    mapMrrForecastSummary,
    mapMrrSnapshotSummary,
    mapOutstandingBalanceSummary,
    mapPaymentAttemptSummary,
    mapPaymentMethodSummary,
    mapPaymentReminderSummary,
    mapProrationRecordSummary,
    mapRefundSummary,
    mapRenewalForecastSummary,
    mapRevenueGrowthMetricSummary,
    mapRevenueProjectionSummary,
    mapRevenueRecognitionSummary,
    mapSubscriptionBillingSummary,
    mapSubscriptionTrendSummary,
    mapTaxConfigSummary,
    mapWalletBalanceSummary,
    mapWriteOffSummary,
} from "@/src/modules/database/lib/billing-revenue-mappers";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import { createAiOrchestrationClient } from "@/src/modules/ai-orchestration/sdk";
import { createKnowledgeClient } from "@/src/modules/knowledge/sdk";
import type {
    AnalyticsSnapshotSummary,
    ArrForecastSummary,
    ArrSnapshotSummary,
    AuditEntry,
    BillingAccountSummary,
    BillingCycleSummary,
    BrvDashboardStats,
    BrvPipelineInfo,
    BrvSdkGenerateInvoiceInput,
    BrvSdkGenerateInvoiceResult,
    BrvSdkProcessPaymentInput,
    BrvSdkProcessPaymentResult,
    BrvSdkRecognizeRevenueInput,
    BrvSdkRecognizeRevenueResult,
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

export class BillingRevenueService {
    private async getContext(authUserId: string, email: string, fullName?: string | null) {
        return resolveOrganizationContext(authUserId, email, fullName);
    }

    private async getMaps(organizationId: string) {
        const billingAccounts = await databaseService.brvBillingAccounts.listByOrganization(organizationId);
        return buildBillingAccountLookupMaps(billingAccounts);
    }

    async getDashboardStats(authUserId: string, email: string, fullName?: string | null): Promise<BrvDashboardStats> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return buildBrvDashboardStats({ billingAccounts: [], outstandingBalances: [], invoices: [], paymentAttempts: [], collectionCases: [], auditLogs: [] });
        const [billingAccounts, subscriptionBillingsRaw, mrrSnapshotsRaw, arrSnapshotsRaw, outstandingBalancesRaw, invoicesRaw, paymentAttemptsRaw, collectionCases, auditLogs] = await Promise.all([
            this.getBillingAccounts(authUserId, email, fullName),
            databaseService.brvSubscriptionBillings.listByOrganization(context.organizationId),
            databaseService.brvMrrSnapshots.listByOrganization(context.organizationId),
            databaseService.brvArrSnapshots.listByOrganization(context.organizationId),
            databaseService.brvOutstandingBalances.listByOrganization(context.organizationId),
            databaseService.brvInvoices.listByOrganization(context.organizationId),
            databaseService.brvPaymentAttempts.listByOrganization(context.organizationId),
            this.getCollectionCases(authUserId, email, fullName),
            this.getAuditLogs(authUserId, email, fullName),
        ]);
        return buildBrvDashboardStats({
            billingAccounts,
            subscriptionBillings: subscriptionBillingsRaw.map(mapSubscriptionBillingForStats),
            mrrSnapshots: mrrSnapshotsRaw.map(mapMrrSnapshotForStats),
            arrSnapshots: arrSnapshotsRaw.map(mapArrSnapshotForStats),
            outstandingBalances: outstandingBalancesRaw.map(mapOutstandingBalanceForStats),
            invoices: invoicesRaw.map(mapInvoiceForStats),
            paymentAttempts: paymentAttemptsRaw.map(mapPaymentAttemptForStats),
            collectionCases,
            auditLogs,
        });
    }

    getPipelineInfo(): BrvPipelineInfo {
        return buildBrvPipelineInfo();
    }

    async getBillingAccounts(authUserId: string, email: string, fullName?: string | null): Promise<BillingAccountSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.brvBillingAccounts.listByOrganization(context.organizationId)).map(mapBillingAccountSummary);
    }

    async createBillingAccount(authUserId: string, email: string, input: CreateBillingAccountInput, fullName?: string | null): Promise<BillingAccountSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.brvBillingAccounts.create(buildBillingAccountPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create billingAccounts");
        await databaseService.brvAuditLogs.create(buildBrvAuditPayload(context.organizationId, "billing_account", "create", `BillingAccount created`, created.id));
        return mapBillingAccountSummary(created);
    }

    async getBillingCycles(authUserId: string, email: string, fullName?: string | null): Promise<BillingCycleSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.brvBillingCycles.listByOrganization(context.organizationId)).map((r) => mapBillingCycleSummary(r, maps));
    }

    async createBillingCycle(authUserId: string, email: string, input: CreateBillingCycleInput, fullName?: string | null): Promise<BillingCycleSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.brvBillingCycles.create(buildBillingCyclePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create billingCycles");
        await databaseService.brvAuditLogs.create(buildBrvAuditPayload(context.organizationId, "billing_cycle", "create", `BillingCycle created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapBillingCycleSummary(created, maps);
    }

    async getSubscriptionBillings(authUserId: string, email: string, fullName?: string | null): Promise<SubscriptionBillingSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.brvSubscriptionBillings.listByOrganization(context.organizationId)).map((r) => mapSubscriptionBillingSummary(r, maps));
    }

    async createSubscriptionBilling(authUserId: string, email: string, input: CreateSubscriptionBillingInput, fullName?: string | null): Promise<SubscriptionBillingSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.brvSubscriptionBillings.create(buildSubscriptionBillingPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create subscriptionBillings");
        await databaseService.brvAuditLogs.create(buildBrvAuditPayload(context.organizationId, "subscription_billing", "create", `SubscriptionBilling created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapSubscriptionBillingSummary(created, maps);
    }

    async getProrationRecords(authUserId: string, email: string, fullName?: string | null): Promise<ProrationRecordSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.brvProrationRecords.listByOrganization(context.organizationId)).map((r) => mapProrationRecordSummary(r, maps));
    }

    async createProrationRecord(authUserId: string, email: string, input: CreateProrationRecordInput, fullName?: string | null): Promise<ProrationRecordSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.brvProrationRecords.create(buildProrationRecordPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create prorationRecords");
        await databaseService.brvAuditLogs.create(buildBrvAuditPayload(context.organizationId, "proration_record", "create", `ProrationRecord created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapProrationRecordSummary(created, maps);
    }

    async getPaymentMethods(authUserId: string, email: string, fullName?: string | null): Promise<PaymentMethodSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.brvPaymentMethods.listByOrganization(context.organizationId)).map((r) => mapPaymentMethodSummary(r, maps));
    }

    async createPaymentMethod(authUserId: string, email: string, input: CreatePaymentMethodInput, fullName?: string | null): Promise<PaymentMethodSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.brvPaymentMethods.create(buildPaymentMethodPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create paymentMethods");
        await databaseService.brvAuditLogs.create(buildBrvAuditPayload(context.organizationId, "payment_method", "create", `PaymentMethod created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapPaymentMethodSummary(created, maps);
    }

    async getPaymentAttempts(authUserId: string, email: string, fullName?: string | null): Promise<PaymentAttemptSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.brvPaymentAttempts.listByOrganization(context.organizationId)).map((r) => mapPaymentAttemptSummary(r, maps));
    }

    async createPaymentAttempt(authUserId: string, email: string, input: CreatePaymentAttemptInput, fullName?: string | null): Promise<PaymentAttemptSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.brvPaymentAttempts.create(buildPaymentAttemptPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create paymentAttempts");
        await databaseService.brvAuditLogs.create(buildBrvAuditPayload(context.organizationId, "payment_attempt", "create", `PaymentAttempt created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapPaymentAttemptSummary(created, maps);
    }

    async getRefunds(authUserId: string, email: string, fullName?: string | null): Promise<RefundSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.brvRefunds.listByOrganization(context.organizationId)).map((r) => mapRefundSummary(r, maps));
    }

    async createRefund(authUserId: string, email: string, input: CreateRefundInput, fullName?: string | null): Promise<RefundSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.brvRefunds.create(buildRefundPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create refunds");
        await databaseService.brvAuditLogs.create(buildBrvAuditPayload(context.organizationId, "refund", "create", `Refund created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapRefundSummary(created, maps);
    }

    async getWalletBalances(authUserId: string, email: string, fullName?: string | null): Promise<WalletBalanceSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.brvWalletBalances.listByOrganization(context.organizationId)).map((r) => mapWalletBalanceSummary(r, maps));
    }

    async createWalletBalance(authUserId: string, email: string, input: CreateWalletBalanceInput, fullName?: string | null): Promise<WalletBalanceSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.brvWalletBalances.create(buildWalletBalancePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create walletBalances");
        await databaseService.brvAuditLogs.create(buildBrvAuditPayload(context.organizationId, "wallet_balance", "create", `WalletBalance created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapWalletBalanceSummary(created, maps);
    }

    async getMrrSnapshots(authUserId: string, email: string, fullName?: string | null): Promise<MrrSnapshotSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.brvMrrSnapshots.listByOrganization(context.organizationId)).map((r) => mapMrrSnapshotSummary(r, maps));
    }

    async createMrrSnapshot(authUserId: string, email: string, input: CreateMrrSnapshotInput, fullName?: string | null): Promise<MrrSnapshotSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.brvMrrSnapshots.create(buildMrrSnapshotPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create mrrSnapshots");
        await databaseService.brvAuditLogs.create(buildBrvAuditPayload(context.organizationId, "mrr_snapshot", "create", `MrrSnapshot created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapMrrSnapshotSummary(created, maps);
    }

    async getArrSnapshots(authUserId: string, email: string, fullName?: string | null): Promise<ArrSnapshotSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.brvArrSnapshots.listByOrganization(context.organizationId)).map((r) => mapArrSnapshotSummary(r, maps));
    }

    async createArrSnapshot(authUserId: string, email: string, input: CreateArrSnapshotInput, fullName?: string | null): Promise<ArrSnapshotSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.brvArrSnapshots.create(buildArrSnapshotPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create arrSnapshots");
        await databaseService.brvAuditLogs.create(buildBrvAuditPayload(context.organizationId, "arr_snapshot", "create", `ArrSnapshot created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapArrSnapshotSummary(created, maps);
    }

    async getDeferredRevenues(authUserId: string, email: string, fullName?: string | null): Promise<DeferredRevenueSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.brvDeferredRevenue.listByOrganization(context.organizationId)).map((r) => mapDeferredRevenueSummary(r, maps));
    }

    async createDeferredRevenue(authUserId: string, email: string, input: CreateDeferredRevenueInput, fullName?: string | null): Promise<DeferredRevenueSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.brvDeferredRevenue.create(buildDeferredRevenuePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create deferredRevenue");
        await databaseService.brvAuditLogs.create(buildBrvAuditPayload(context.organizationId, "deferred_revenue", "create", `DeferredRevenue created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapDeferredRevenueSummary(created, maps);
    }

    async getRevenueRecognitions(authUserId: string, email: string, fullName?: string | null): Promise<RevenueRecognitionSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.brvRevenueRecognition.listByOrganization(context.organizationId)).map((r) => mapRevenueRecognitionSummary(r, maps));
    }

    async createRevenueRecognition(authUserId: string, email: string, input: CreateRevenueRecognitionInput, fullName?: string | null): Promise<RevenueRecognitionSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.brvRevenueRecognition.create(buildRevenueRecognitionPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create revenueRecognition");
        await databaseService.brvAuditLogs.create(buildBrvAuditPayload(context.organizationId, "revenue_recognition", "create", `RevenueRecognition created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapRevenueRecognitionSummary(created, maps);
    }

    async getInvoices(authUserId: string, email: string, fullName?: string | null): Promise<InvoiceSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.brvInvoices.listByOrganization(context.organizationId)).map((r) => mapInvoiceSummary(r, maps));
    }

    async createInvoice(authUserId: string, email: string, input: CreateInvoiceInput, fullName?: string | null): Promise<InvoiceSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.brvInvoices.create(buildInvoicePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create invoices");
        await databaseService.brvAuditLogs.create(buildBrvAuditPayload(context.organizationId, "invoice", "create", `Invoice created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapInvoiceSummary(created, maps);
    }

    async getCreditNotes(authUserId: string, email: string, fullName?: string | null): Promise<CreditNoteSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.brvCreditNotes.listByOrganization(context.organizationId)).map((r) => mapCreditNoteSummary(r, maps));
    }

    async createCreditNote(authUserId: string, email: string, input: CreateCreditNoteInput, fullName?: string | null): Promise<CreditNoteSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.brvCreditNotes.create(buildCreditNotePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create creditNotes");
        await databaseService.brvAuditLogs.create(buildBrvAuditPayload(context.organizationId, "credit_note", "create", `CreditNote created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapCreditNoteSummary(created, maps);
    }

    async getDebitNotes(authUserId: string, email: string, fullName?: string | null): Promise<DebitNoteSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.brvDebitNotes.listByOrganization(context.organizationId)).map((r) => mapDebitNoteSummary(r, maps));
    }

    async createDebitNote(authUserId: string, email: string, input: CreateDebitNoteInput, fullName?: string | null): Promise<DebitNoteSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.brvDebitNotes.create(buildDebitNotePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create debitNotes");
        await databaseService.brvAuditLogs.create(buildBrvAuditPayload(context.organizationId, "debit_note", "create", `DebitNote created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapDebitNoteSummary(created, maps);
    }

    async getTaxConfigs(authUserId: string, email: string, fullName?: string | null): Promise<TaxConfigSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.brvTaxConfigs.listByOrganization(context.organizationId)).map((r) => mapTaxConfigSummary(r, maps));
    }

    async createTaxConfig(authUserId: string, email: string, input: CreateTaxConfigInput, fullName?: string | null): Promise<TaxConfigSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.brvTaxConfigs.create(buildTaxConfigPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create taxConfigs");
        await databaseService.brvAuditLogs.create(buildBrvAuditPayload(context.organizationId, "tax_config", "create", `TaxConfig created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapTaxConfigSummary(created, maps);
    }

    async getOutstandingBalances(authUserId: string, email: string, fullName?: string | null): Promise<OutstandingBalanceSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.brvOutstandingBalances.listByOrganization(context.organizationId)).map((r) => mapOutstandingBalanceSummary(r, maps));
    }

    async createOutstandingBalance(authUserId: string, email: string, input: CreateOutstandingBalanceInput, fullName?: string | null): Promise<OutstandingBalanceSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.brvOutstandingBalances.create(buildOutstandingBalancePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create outstandingBalances");
        await databaseService.brvAuditLogs.create(buildBrvAuditPayload(context.organizationId, "outstanding_balance", "create", `OutstandingBalance created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapOutstandingBalanceSummary(created, maps);
    }

    async getPaymentReminders(authUserId: string, email: string, fullName?: string | null): Promise<PaymentReminderSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.brvPaymentReminders.listByOrganization(context.organizationId)).map((r) => mapPaymentReminderSummary(r, maps));
    }

    async createPaymentReminder(authUserId: string, email: string, input: CreatePaymentReminderInput, fullName?: string | null): Promise<PaymentReminderSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.brvPaymentReminders.create(buildPaymentReminderPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create paymentReminders");
        await databaseService.brvAuditLogs.create(buildBrvAuditPayload(context.organizationId, "payment_reminder", "create", `PaymentReminder created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapPaymentReminderSummary(created, maps);
    }

    async getCollectionCases(authUserId: string, email: string, fullName?: string | null): Promise<CollectionCaseSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.brvCollectionCases.listByOrganization(context.organizationId)).map((r) => mapCollectionCaseSummary(r, maps));
    }

    async createCollectionCase(authUserId: string, email: string, input: CreateCollectionCaseInput, fullName?: string | null): Promise<CollectionCaseSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.brvCollectionCases.create(buildCollectionCasePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create collectionCases");
        await databaseService.brvAuditLogs.create(buildBrvAuditPayload(context.organizationId, "collection_case", "create", `CollectionCase created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapCollectionCaseSummary(created, maps);
    }

    async getWriteOffs(authUserId: string, email: string, fullName?: string | null): Promise<WriteOffSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.brvWriteOffs.listByOrganization(context.organizationId)).map((r) => mapWriteOffSummary(r, maps));
    }

    async createWriteOff(authUserId: string, email: string, input: CreateWriteOffInput, fullName?: string | null): Promise<WriteOffSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.brvWriteOffs.create(buildWriteOffPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create writeOffs");
        await databaseService.brvAuditLogs.create(buildBrvAuditPayload(context.organizationId, "write_off", "create", `WriteOff created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapWriteOffSummary(created, maps);
    }

    async getAnalyticsSnapshots(authUserId: string, email: string, fullName?: string | null): Promise<AnalyticsSnapshotSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.brvAnalyticsSnapshots.listByOrganization(context.organizationId)).map((r) => mapAnalyticsSnapshotSummary(r, maps));
    }

    async createAnalyticsSnapshot(authUserId: string, email: string, input: CreateAnalyticsSnapshotInput, fullName?: string | null): Promise<AnalyticsSnapshotSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.brvAnalyticsSnapshots.create(buildAnalyticsSnapshotPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create analyticsSnapshots");
        await databaseService.brvAuditLogs.create(buildBrvAuditPayload(context.organizationId, "analytics_snapshot", "create", `AnalyticsSnapshot created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapAnalyticsSnapshotSummary(created, maps);
    }

    async getRevenueGrowthMetrics(authUserId: string, email: string, fullName?: string | null): Promise<RevenueGrowthMetricSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.brvRevenueGrowthMetrics.listByOrganization(context.organizationId)).map((r) => mapRevenueGrowthMetricSummary(r, maps));
    }

    async createRevenueGrowthMetric(authUserId: string, email: string, input: CreateRevenueGrowthMetricInput, fullName?: string | null): Promise<RevenueGrowthMetricSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.brvRevenueGrowthMetrics.create(buildRevenueGrowthMetricPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create revenueGrowthMetrics");
        await databaseService.brvAuditLogs.create(buildBrvAuditPayload(context.organizationId, "revenue_growth_metric", "create", `RevenueGrowthMetric created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapRevenueGrowthMetricSummary(created, maps);
    }

    async getCashFlowRecords(authUserId: string, email: string, fullName?: string | null): Promise<CashFlowRecordSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.brvCashFlowRecords.listByOrganization(context.organizationId)).map((r) => mapCashFlowRecordSummary(r, maps));
    }

    async createCashFlowRecord(authUserId: string, email: string, input: CreateCashFlowRecordInput, fullName?: string | null): Promise<CashFlowRecordSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.brvCashFlowRecords.create(buildCashFlowRecordPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create cashFlowRecords");
        await databaseService.brvAuditLogs.create(buildBrvAuditPayload(context.organizationId, "cash_flow_record", "create", `CashFlowRecord created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapCashFlowRecordSummary(created, maps);
    }

    async getSubscriptionTrends(authUserId: string, email: string, fullName?: string | null): Promise<SubscriptionTrendSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.brvSubscriptionTrends.listByOrganization(context.organizationId)).map((r) => mapSubscriptionTrendSummary(r, maps));
    }

    async createSubscriptionTrend(authUserId: string, email: string, input: CreateSubscriptionTrendInput, fullName?: string | null): Promise<SubscriptionTrendSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.brvSubscriptionTrends.create(buildSubscriptionTrendPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create subscriptionTrends");
        await databaseService.brvAuditLogs.create(buildBrvAuditPayload(context.organizationId, "subscription_trend", "create", `SubscriptionTrend created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapSubscriptionTrendSummary(created, maps);
    }

    async getRenewalForecasts(authUserId: string, email: string, fullName?: string | null): Promise<RenewalForecastSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.brvRenewalForecasts.listByOrganization(context.organizationId)).map((r) => mapRenewalForecastSummary(r, maps));
    }

    async createRenewalForecast(authUserId: string, email: string, input: CreateRenewalForecastInput, fullName?: string | null): Promise<RenewalForecastSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.brvRenewalForecasts.create(buildRenewalForecastPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create renewalForecasts");
        await databaseService.brvAuditLogs.create(buildBrvAuditPayload(context.organizationId, "renewal_forecast", "create", `RenewalForecast created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapRenewalForecastSummary(created, maps);
    }

    async getMrrForecasts(authUserId: string, email: string, fullName?: string | null): Promise<MrrForecastSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.brvMrrForecasts.listByOrganization(context.organizationId)).map((r) => mapMrrForecastSummary(r, maps));
    }

    async createMrrForecast(authUserId: string, email: string, input: CreateMrrForecastInput, fullName?: string | null): Promise<MrrForecastSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.brvMrrForecasts.create(buildMrrForecastPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create mrrForecasts");
        await databaseService.brvAuditLogs.create(buildBrvAuditPayload(context.organizationId, "mrr_forecast", "create", `MrrForecast created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapMrrForecastSummary(created, maps);
    }

    async getArrForecasts(authUserId: string, email: string, fullName?: string | null): Promise<ArrForecastSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.brvArrForecasts.listByOrganization(context.organizationId)).map((r) => mapArrForecastSummary(r, maps));
    }

    async createArrForecast(authUserId: string, email: string, input: CreateArrForecastInput, fullName?: string | null): Promise<ArrForecastSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.brvArrForecasts.create(buildArrForecastPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create arrForecasts");
        await databaseService.brvAuditLogs.create(buildBrvAuditPayload(context.organizationId, "arr_forecast", "create", `ArrForecast created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapArrForecastSummary(created, maps);
    }

    async getRevenueProjections(authUserId: string, email: string, fullName?: string | null): Promise<RevenueProjectionSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.brvRevenueProjections.listByOrganization(context.organizationId)).map((r) => mapRevenueProjectionSummary(r, maps));
    }

    async createRevenueProjection(authUserId: string, email: string, input: CreateRevenueProjectionInput, fullName?: string | null): Promise<RevenueProjectionSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.brvRevenueProjections.create(buildRevenueProjectionPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create revenueProjections");
        await databaseService.brvAuditLogs.create(buildBrvAuditPayload(context.organizationId, "revenue_projection", "create", `RevenueProjection created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapRevenueProjectionSummary(created, maps);
    }

    async getFinanceMetrics(authUserId: string, email: string, fullName?: string | null): Promise<FinanceMetricSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.brvFinanceMetrics.listByOrganization(context.organizationId)).map(mapFinanceMetricSummary);
    }

    async createFinanceMetric(authUserId: string, email: string, input: CreateFinanceMetricInput, fullName?: string | null): Promise<FinanceMetricSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.brvFinanceMetrics.create(buildFinanceMetricPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create financeMetrics");
        await databaseService.brvAuditLogs.create(buildBrvAuditPayload(context.organizationId, "finance_metric", "create", `FinanceMetric created`, created.id));
        return mapFinanceMetricSummary(created);
    }

    async getFinancialHealths(authUserId: string, email: string, fullName?: string | null): Promise<FinancialHealthSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.brvFinancialHealth.listByOrganization(context.organizationId)).map(mapFinancialHealthSummary);
    }

    async createFinancialHealth(authUserId: string, email: string, input: CreateFinancialHealthInput, fullName?: string | null): Promise<FinancialHealthSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.brvFinancialHealth.create(buildFinancialHealthPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create financialHealth");
        await databaseService.brvAuditLogs.create(buildBrvAuditPayload(context.organizationId, "financial_health", "create", `FinancialHealth created`, created.id));
        return mapFinancialHealthSummary(created);
    }

    async getExpansionContractions(authUserId: string, email: string, fullName?: string | null): Promise<ExpansionContractionSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.brvExpansionContraction.listByOrganization(context.organizationId)).map((r) => mapExpansionContractionSummary(r, maps));
    }

    async createExpansionContraction(authUserId: string, email: string, input: CreateExpansionContractionInput, fullName?: string | null): Promise<ExpansionContractionSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.brvExpansionContraction.create(buildExpansionContractionPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create expansionContraction");
        await databaseService.brvAuditLogs.create(buildBrvAuditPayload(context.organizationId, "expansion_contraction", "create", `ExpansionContraction created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapExpansionContractionSummary(created, maps);
    }

    async getAuditLogs(authUserId: string, email: string, fullName?: string | null): Promise<AuditEntry[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.brvAuditLogs.listByOrganization(context.organizationId)).map(mapAuditEntry);
    }

    async getBillingAccountOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.brvBillingAccounts.listByOrganization(context.organizationId)).map((r) => ({ id: r.id, name: r.account_name }));
    }

    async sdkGenerateInvoice(authUserId: string, email: string, input: BrvSdkGenerateInvoiceInput, fullName?: string | null): Promise<BrvSdkGenerateInvoiceResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        await ai.executeTask({ taskType: "generate_invoice", moduleSource: "billing_revenue", inputPayload: { ...input } });
        const created = await this.createInvoice(authUserId, email, { billingAccountId: input.billingAccountId, invoiceKey: input.invoiceKey, amountUsd: input.amountUsd }, fullName);
        return { invoiceId: created.id, invoiceKey: created.invoiceKey, amountUsd: input.amountUsd, status: created.status };
    }

    async sdkProcessPayment(authUserId: string, email: string, input: BrvSdkProcessPaymentInput, fullName?: string | null): Promise<BrvSdkProcessPaymentResult> {
        const knowledge = createKnowledgeClient(authUserId, email, fullName);
        await knowledge.search({ query: "payment processing", limit: 3 });
        const created = await this.createPaymentAttempt(authUserId, email, { billingAccountId: input.billingAccountId, attemptKey: input.attemptKey, amountUsd: input.amountUsd, paymentStatus: input.paymentStatus ?? "succeeded" }, fullName);
        return { attemptId: created.id, attemptKey: created.attemptKey, paymentStatus: created.status };
    }

    async sdkRecognizeRevenue(authUserId: string, email: string, input: BrvSdkRecognizeRevenueInput, fullName?: string | null): Promise<BrvSdkRecognizeRevenueResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        await ai.executeTask({ taskType: "recognize_revenue", moduleSource: "billing_revenue", inputPayload: { ...input } });
        const created = await this.createRevenueRecognition(authUserId, email, { billingAccountId: input.billingAccountId, recognitionKey: input.recognitionKey, amountUsd: input.amountUsd }, fullName);
        return { recognitionId: created.id, recognitionKey: created.recognitionKey, amountUsd: input.amountUsd, status: created.status };
    }
}

export const billingRevenueService = new BillingRevenueService();
