import fs from "fs";
import path from "path";

const root = process.cwd();
const uiRoot = path.join(root, "src/modules/billing-revenue");

const entities = [
    { tab: "billingAccounts", label: "Billing Accounts", singular: "BillingAccount", state: "billingAccounts", table: "brv_billing_accounts", db: "brvBillingAccounts", orgScoped: true, maps: false, titleKey: "accountName", keyField: "accountKey", audit: "billing_account", fields: [{ name: "accountKey", placeholder: "Account key" }, { name: "accountName", placeholder: "Account name" }, { name: "currencyCode", placeholder: "Currency code" }] },
    { tab: "billingCycles", label: "Billing Cycles", singular: "BillingCycle", state: "billingCycles", table: "brv_billing_cycles", db: "brvBillingCycles", orgScoped: false, maps: true, titleKey: "cycleKey", keyField: "cycleKey", audit: "billing_cycle", fields: [{ name: "cycleKey", placeholder: "Cycle key" }, { name: "billingCycle", placeholder: "Billing cycle", select: "BILLING_CYCLE_OPTIONS" }] },
    { tab: "subscriptionBillings", label: "Subscription Billings", singular: "SubscriptionBilling", state: "subscriptionBillings", table: "brv_subscription_billings", db: "brvSubscriptionBillings", orgScoped: false, maps: true, titleKey: "billingKey", keyField: "billingKey", audit: "subscription_billing", fields: [{ name: "billingKey", placeholder: "Billing key" }, { name: "amountUsd", placeholder: "Amount USD", number: true }, { name: "billingCycle", placeholder: "Billing cycle", select: "BILLING_CYCLE_OPTIONS" }] },
    { tab: "prorationRecords", label: "Proration Records", singular: "ProrationRecord", state: "prorationRecords", table: "brv_proration_records", db: "brvProrationRecords", orgScoped: false, maps: true, titleKey: "prorationKey", keyField: "prorationKey", audit: "proration_record", fields: [{ name: "prorationKey", placeholder: "Proration key" }, { name: "amountUsd", placeholder: "Amount USD", number: true }] },
    { tab: "paymentMethods", label: "Payment Methods", singular: "PaymentMethod", state: "paymentMethods", table: "brv_payment_methods", db: "brvPaymentMethods", orgScoped: false, maps: true, titleKey: "methodKey", keyField: "methodKey", audit: "payment_method", fields: [{ name: "methodKey", placeholder: "Method key" }, { name: "methodType", placeholder: "Method type" }] },
    { tab: "paymentAttempts", label: "Payment Attempts", singular: "PaymentAttempt", state: "paymentAttempts", table: "brv_payment_attempts", db: "brvPaymentAttempts", orgScoped: false, maps: true, titleKey: "attemptKey", keyField: "attemptKey", audit: "payment_attempt", fields: [{ name: "attemptKey", placeholder: "Attempt key" }, { name: "amountUsd", placeholder: "Amount USD", number: true }, { name: "paymentStatus", placeholder: "Payment status", select: "PAYMENT_STATUS_OPTIONS" }] },
    { tab: "refunds", label: "Refunds", singular: "Refund", state: "refunds", table: "brv_refunds", db: "brvRefunds", orgScoped: false, maps: true, titleKey: "refundKey", keyField: "refundKey", audit: "refund", fields: [{ name: "refundKey", placeholder: "Refund key" }, { name: "amountUsd", placeholder: "Amount USD", number: true }] },
    { tab: "walletBalances", label: "Wallet Balances", singular: "WalletBalance", state: "walletBalances", table: "brv_wallet_balances", db: "brvWalletBalances", orgScoped: false, maps: true, titleKey: "walletKey", keyField: "walletKey", audit: "wallet_balance", fields: [{ name: "walletKey", placeholder: "Wallet key" }, { name: "balanceUsd", placeholder: "Balance USD", number: true }] },
    { tab: "mrrSnapshots", label: "MRR Snapshots", singular: "MrrSnapshot", state: "mrrSnapshots", table: "brv_mrr_snapshots", db: "brvMrrSnapshots", orgScoped: false, maps: true, titleKey: "snapshotKey", keyField: "snapshotKey", audit: "mrr_snapshot", fields: [{ name: "snapshotKey", placeholder: "Snapshot key" }, { name: "mrrUsd", placeholder: "MRR USD", number: true }] },
    { tab: "arrSnapshots", label: "ARR Snapshots", singular: "ArrSnapshot", state: "arrSnapshots", table: "brv_arr_snapshots", db: "brvArrSnapshots", orgScoped: false, maps: true, titleKey: "snapshotKey", keyField: "snapshotKey", audit: "arr_snapshot", fields: [{ name: "snapshotKey", placeholder: "Snapshot key" }, { name: "arrUsd", placeholder: "ARR USD", number: true }] },
    { tab: "deferredRevenue", label: "Deferred Revenue", singular: "DeferredRevenue", state: "deferredRevenue", table: "brv_deferred_revenue", db: "brvDeferredRevenue", orgScoped: false, maps: true, titleKey: "recordKey", keyField: "recordKey", audit: "deferred_revenue", fields: [{ name: "recordKey", placeholder: "Record key" }, { name: "amountUsd", placeholder: "Amount USD", number: true }] },
    { tab: "revenueRecognition", label: "Revenue Recognition", singular: "RevenueRecognition", state: "revenueRecognition", table: "brv_revenue_recognition", db: "brvRevenueRecognition", orgScoped: false, maps: true, titleKey: "recognitionKey", keyField: "recognitionKey", audit: "revenue_recognition", fields: [{ name: "recognitionKey", placeholder: "Recognition key" }, { name: "amountUsd", placeholder: "Amount USD", number: true }] },
    { tab: "invoices", label: "Invoices", singular: "Invoice", state: "invoices", table: "brv_invoices", db: "brvInvoices", orgScoped: false, maps: true, titleKey: "invoiceKey", keyField: "invoiceKey", audit: "invoice", fields: [{ name: "invoiceKey", placeholder: "Invoice key" }, { name: "amountUsd", placeholder: "Amount USD", number: true }] },
    { tab: "creditNotes", label: "Credit Notes", singular: "CreditNote", state: "creditNotes", table: "brv_credit_notes", db: "brvCreditNotes", orgScoped: false, maps: true, titleKey: "noteKey", keyField: "noteKey", audit: "credit_note", fields: [{ name: "noteKey", placeholder: "Note key" }, { name: "amountUsd", placeholder: "Amount USD", number: true }] },
    { tab: "debitNotes", label: "Debit Notes", singular: "DebitNote", state: "debitNotes", table: "brv_debit_notes", db: "brvDebitNotes", orgScoped: false, maps: true, titleKey: "noteKey", keyField: "noteKey", audit: "debit_note", fields: [{ name: "noteKey", placeholder: "Note key" }, { name: "amountUsd", placeholder: "Amount USD", number: true }] },
    { tab: "taxConfigs", label: "Tax Configs", singular: "TaxConfig", state: "taxConfigs", table: "brv_tax_configs", db: "brvTaxConfigs", orgScoped: false, maps: true, titleKey: "configKey", keyField: "configKey", audit: "tax_config", fields: [{ name: "configKey", placeholder: "Config key" }, { name: "gstRate", placeholder: "GST rate %", number: true }] },
    { tab: "outstandingBalances", label: "Outstanding Balances", singular: "OutstandingBalance", state: "outstandingBalances", table: "brv_outstanding_balances", db: "brvOutstandingBalances", orgScoped: false, maps: true, titleKey: "balanceKey", keyField: "balanceKey", audit: "outstanding_balance", fields: [{ name: "balanceKey", placeholder: "Balance key" }, { name: "amountUsd", placeholder: "Amount USD", number: true }] },
    { tab: "paymentReminders", label: "Payment Reminders", singular: "PaymentReminder", state: "paymentReminders", table: "brv_payment_reminders", db: "brvPaymentReminders", orgScoped: false, maps: true, titleKey: "reminderKey", keyField: "reminderKey", audit: "payment_reminder", fields: [{ name: "reminderKey", placeholder: "Reminder key" }] },
    { tab: "collectionCases", label: "Collection Cases", singular: "CollectionCase", state: "collectionCases", table: "brv_collection_cases", db: "brvCollectionCases", orgScoped: false, maps: true, titleKey: "caseKey", keyField: "caseKey", audit: "collection_case", fields: [{ name: "caseKey", placeholder: "Case key" }] },
    { tab: "writeOffs", label: "Write-offs", singular: "WriteOff", state: "writeOffs", table: "brv_write_offs", db: "brvWriteOffs", orgScoped: false, maps: true, titleKey: "writeOffKey", keyField: "writeOffKey", audit: "write_off", fields: [{ name: "writeOffKey", placeholder: "Write-off key" }, { name: "amountUsd", placeholder: "Amount USD", number: true }] },
    { tab: "analyticsSnapshots", label: "Analytics Snapshots", singular: "AnalyticsSnapshot", state: "analyticsSnapshots", table: "brv_analytics_snapshots", db: "brvAnalyticsSnapshots", orgScoped: false, maps: true, titleKey: "snapshotKey", keyField: "snapshotKey", audit: "analytics_snapshot", fields: [{ name: "snapshotKey", placeholder: "Snapshot key" }] },
    { tab: "revenueGrowthMetrics", label: "Revenue Growth Metrics", singular: "RevenueGrowthMetric", state: "revenueGrowthMetrics", table: "brv_revenue_growth_metrics", db: "brvRevenueGrowthMetrics", orgScoped: false, maps: true, titleKey: "metricsKey", keyField: "metricsKey", audit: "revenue_growth_metric", fields: [{ name: "metricsKey", placeholder: "Metrics key" }, { name: "growthRatePercent", placeholder: "Growth rate %", number: true }] },
    { tab: "cashFlowRecords", label: "Cash Flow Records", singular: "CashFlowRecord", state: "cashFlowRecords", table: "brv_cash_flow_records", db: "brvCashFlowRecords", orgScoped: false, maps: true, titleKey: "recordKey", keyField: "recordKey", audit: "cash_flow_record", fields: [{ name: "recordKey", placeholder: "Record key" }, { name: "amountUsd", placeholder: "Amount USD", number: true }] },
    { tab: "subscriptionTrends", label: "Subscription Trends", singular: "SubscriptionTrend", state: "subscriptionTrends", table: "brv_subscription_trends", db: "brvSubscriptionTrends", orgScoped: false, maps: true, titleKey: "trendKey", keyField: "trendKey", audit: "subscription_trend", fields: [{ name: "trendKey", placeholder: "Trend key" }] },
    { tab: "renewalForecasts", label: "Renewal Forecasts", singular: "RenewalForecast", state: "renewalForecasts", table: "brv_renewal_forecasts", db: "brvRenewalForecasts", orgScoped: false, maps: true, titleKey: "forecastKey", keyField: "forecastKey", audit: "renewal_forecast", fields: [{ name: "forecastKey", placeholder: "Forecast key" }] },
    { tab: "mrrForecasts", label: "MRR Forecasts", singular: "MrrForecast", state: "mrrForecasts", table: "brv_mrr_forecasts", db: "brvMrrForecasts", orgScoped: false, maps: true, titleKey: "forecastKey", keyField: "forecastKey", audit: "mrr_forecast", fields: [{ name: "forecastKey", placeholder: "Forecast key" }, { name: "projectedMrrUsd", placeholder: "Projected MRR USD", number: true }] },
    { tab: "arrForecasts", label: "ARR Forecasts", singular: "ArrForecast", state: "arrForecasts", table: "brv_arr_forecasts", db: "brvArrForecasts", orgScoped: false, maps: true, titleKey: "forecastKey", keyField: "forecastKey", audit: "arr_forecast", fields: [{ name: "forecastKey", placeholder: "Forecast key" }, { name: "projectedArrUsd", placeholder: "Projected ARR USD", number: true }] },
    { tab: "revenueProjections", label: "Revenue Projections", singular: "RevenueProjection", state: "revenueProjections", table: "brv_revenue_projections", db: "brvRevenueProjections", orgScoped: false, maps: true, titleKey: "projectionKey", keyField: "projectionKey", audit: "revenue_projection", fields: [{ name: "projectionKey", placeholder: "Projection key" }, { name: "projectedRevenueUsd", placeholder: "Projected revenue USD", number: true }] },
    { tab: "financeMetrics", label: "Finance Metrics", singular: "FinanceMetric", state: "financeMetrics", table: "brv_finance_metrics", db: "brvFinanceMetrics", orgScoped: true, maps: false, titleKey: "metricsKey", keyField: "metricsKey", audit: "finance_metric", fields: [{ name: "metricsKey", placeholder: "Metrics key" }, { name: "mrrUsd", placeholder: "MRR USD", number: true }, { name: "arrUsd", placeholder: "ARR USD", number: true }] },
    { tab: "financialHealth", label: "Financial Health", singular: "FinancialHealth", state: "financialHealth", table: "brv_financial_health", db: "brvFinancialHealth", orgScoped: true, maps: false, titleKey: "healthKey", keyField: "healthKey", audit: "financial_health", fields: [{ name: "healthKey", placeholder: "Health key" }, { name: "overallScore", placeholder: "Overall score", number: true }] },
    { tab: "expansionContraction", label: "Expansion & Contraction", singular: "ExpansionContraction", state: "expansionContraction", table: "brv_expansion_contraction", db: "brvExpansionContraction", orgScoped: false, maps: true, titleKey: "recordKey", keyField: "recordKey", audit: "expansion_contraction", fields: [{ name: "recordKey", placeholder: "Record key" }, { name: "expansionUsd", placeholder: "Expansion USD", number: true }] },
    { tab: "auditLogs", label: "Audit Logs", singular: "BrvAuditLog", state: "auditLogs", table: "brv_audit_logs", db: "brvAuditLogs", orgScoped: true, maps: false, titleKey: "summary", keyField: "auditKey", audit: "audit_log", listOnly: true, fields: [{ name: "auditKey", placeholder: "Audit key" }, { name: "summary", placeholder: "Summary" }] },
];

const toSnake = (s) => s.replace(/([A-Z])/g, "_$1").toLowerCase();

const schemaMap = {
    billingAccounts: "billingAccountFormSchema",
    billingCycles: "billingCycleFormSchema",
    subscriptionBillings: "subscriptionBillingFormSchema",
    prorationRecords: "prorationRecordFormSchema",
    paymentMethods: "paymentMethodFormSchema",
    paymentAttempts: "paymentAttemptFormSchema",
    refunds: "refundFormSchema",
    walletBalances: "walletBalanceFormSchema",
    mrrSnapshots: "mrrSnapshotFormSchema",
    arrSnapshots: "arrSnapshotFormSchema",
    deferredRevenue: "deferredRevenueFormSchema",
    revenueRecognition: "revenueRecognitionFormSchema",
    invoices: "invoiceFormSchema",
    creditNotes: "creditNoteFormSchema",
    debitNotes: "debitNoteFormSchema",
    taxConfigs: "taxConfigFormSchema",
    outstandingBalances: "outstandingBalanceFormSchema",
    paymentReminders: "paymentReminderFormSchema",
    collectionCases: "collectionCaseFormSchema",
    writeOffs: "writeOffFormSchema",
    analyticsSnapshots: "analyticsSnapshotFormSchema",
    revenueGrowthMetrics: "revenueGrowthMetricFormSchema",
    cashFlowRecords: "cashFlowRecordFormSchema",
    subscriptionTrends: "subscriptionTrendFormSchema",
    renewalForecasts: "renewalForecastFormSchema",
    mrrForecasts: "mrrForecastFormSchema",
    arrForecasts: "arrForecastFormSchema",
    revenueProjections: "revenueProjectionFormSchema",
    financeMetrics: "financeMetricFormSchema",
    financialHealth: "financialHealthFormSchema",
    expansionContraction: "expansionContractionFormSchema",
    auditLogs: "brvAuditLogFormSchema",
};

for (const e of entities) {
    e.schema = schemaMap[e.tab];
    e.form = e.schema.replace("FormSchema", "FormValues");
    e.summary = `${e.singular}Summary`;
    e.input = `Create${e.singular}Input`;
    e.get = `get${e.singular}s`;
    e.create = `create${e.singular}`;
}

function genConstants() {
    const tabs = ["overview", ...entities.map((e) => e.tab), "api"];
    return `export const BRV_TABS = {
${tabs.map((t) => `    ${t}: "${t}",`).join("\n")}
} as const;

export const BILLING_CYCLE_OPTIONS = [
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Quarterly" },
    { value: "annual", label: "Annual" },
    { value: "custom", label: "Custom" },
] as const;

export const PAYMENT_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "succeeded", label: "Succeeded" },
    { value: "failed", label: "Failed" },
    { value: "refunded", label: "Refunded" },
    { value: "partial", label: "Partial" },
    { value: "cancelled", label: "Cancelled" },
] as const;

export const BRV_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "pending", label: "Pending" },
    { value: "inactive", label: "Inactive" },
    { value: "open", label: "Open" },
    { value: "overdue", label: "Overdue" },
    { value: "paid", label: "Paid" },
    { value: "closed", label: "Closed" },
] as const;

export const BRV_PERMISSIONS = ["brv.view", "brv.manage", "brv.approve", "brv.admin"] as const;

export const BRV_THEME = {
    primary: "amber-600",
    primaryHover: "amber-500",
    ring: "amber-500/20",
    text: "text-amber-600",
    textDark: "dark:text-amber-400",
    bg: "bg-amber-600",
    bgHover: "hover:bg-amber-500",
} as const;
`;
}

function genTypes() {
    const blocks = [
        `export interface BrvDashboardStats {
    totalBillingAccounts: number;
    activeBillingAccounts: number;
    mrrUsd: number;
    arrUsd: number;
    outstandingBalanceUsd: number;
    openInvoiceCount: number;
    failedPaymentCount: number;
    collectionCaseCount: number;
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
    for (const e of entities.filter((x) => !x.listOnly)) {
        blocks.push(`export interface ${e.summary} {
    id: string;
    ${e.maps ? "billingAccountName: string;\n    " : ""}${e.keyField}: string;
    ${e.titleKey !== e.keyField ? `${e.titleKey}: string;\n    ` : ""}status: string;
}`);
        blocks.push(`export interface ${e.input} {
    ${e.orgScoped ? "" : "billingAccountId: string;\n    "}${e.keyField}?: string;
    ${e.fields.filter((f) => f.name !== e.keyField).map((f) => `${f.name}${f.number ? "?: number" : "?: string"};`).join("\n    ")}
}`);
    }
    blocks.push(`export interface BrvSdkGenerateInvoiceInput { billingAccountId: string; invoiceKey: string; amountUsd: number; }
export interface BrvSdkGenerateInvoiceResult { invoiceId: string; invoiceKey: string; amountUsd: number; status: string; }
export interface BrvSdkProcessPaymentInput { billingAccountId: string; attemptKey: string; amountUsd: number; paymentStatus?: string; }
export interface BrvSdkProcessPaymentResult { attemptId: string; attemptKey: string; paymentStatus: string; }
export interface BrvSdkRecognizeRevenueInput { billingAccountId: string; recognitionKey: string; amountUsd: number; }
export interface BrvSdkRecognizeRevenueResult { recognitionId: string; recognitionKey: string; amountUsd: number; status: string; }`);
    return blocks.join("\n\n") + "\n";
}

function genSchemas() {
    return entities.filter((e) => !e.listOnly).map((e) => {
        const fields = e.orgScoped
            ? e.fields.map((f) => `    ${f.name}: ${f.number ? "z.number().optional()" : f.name.includes("Key") || f.name === "accountName" ? "z.string().min(2)" : "z.string().min(2).optional()"},`).join("\n")
            : [`    billingAccountId: z.string().min(1),`, ...e.fields.map((f) => `    ${f.name}: ${f.number ? "z.number().optional()" : f.name.includes("Key") ? "z.string().min(2)" : "z.string().min(2).optional()"},`)].join("\n");
        return `export const ${e.schema} = z.object({\n${fields}\n});`;
    }).join("\n\n") + "\n\n" + entities.filter((e) => !e.listOnly).map((e) => `export type ${e.form} = z.infer<typeof ${e.schema}>;`).join("\n") + "\n";
}

function genService() {
    const creatable = entities.filter((e) => !e.listOnly);
    const mapperImports = [...new Set(creatable.flatMap((e) => [`map${e.singular}Summary`, `build${e.singular}Payload`]))].concat(["buildBrvAuditPayload", "buildBrvDashboardStats", "buildBrvPipelineInfo", "buildBillingAccountLookupMaps", "mapAuditEntry"]).sort();
    const typeImports = [...new Set(creatable.flatMap((e) => [e.input, e.summary]))].concat(["AuditEntry", "BrvDashboardStats", "BrvPipelineInfo", "BrvSdkGenerateInvoiceInput", "BrvSdkGenerateInvoiceResult", "BrvSdkProcessPaymentInput", "BrvSdkProcessPaymentResult", "BrvSdkRecognizeRevenueInput", "BrvSdkRecognizeRevenueResult"]).sort();
    const methods = creatable.map((e) => {
        const getBody = e.maps
            ? `const maps = await this.getMaps(context.organizationId);
        return (await databaseService.${e.db}.listByOrganization(context.organizationId)).map((r) => map${e.singular}Summary(r, maps));`
            : `return (await databaseService.${e.db}.listByOrganization(context.organizationId)).map(map${e.singular}Summary);`;
        const createReturn = e.maps ? `\n        const maps = await this.getMaps(context.organizationId);\n        return map${e.singular}Summary(created, maps);` : `\n        return map${e.singular}Summary(created);`;
        return `    async ${e.get}(authUserId: string, email: string, fullName?: string | null): Promise<${e.summary}[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        ${getBody}
    }

    async ${e.create}(authUserId: string, email: string, input: ${e.input}, fullName?: string | null): Promise<${e.summary}> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.${e.db}.create(build${e.singular}Payload(context.organizationId, input));
        if (!created) throw new Error("Failed to create ${e.tab}");
        await databaseService.brvAuditLogs.create(buildBrvAuditPayload(context.organizationId, "${e.audit}", "create", \`${e.singular} created\`, created.id));${createReturn}
    }`;
    }).join("\n\n");
    return `import {
    ${mapperImports.join(",\n    ")},
} from "@/src/modules/database/lib/billing-revenue-mappers";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import { createAiOrchestrationClient } from "@/src/modules/ai-orchestration/sdk";
import { createKnowledgeClient } from "@/src/modules/knowledge/sdk";
import type {
    ${typeImports.join(",\n    ")},
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
        if (!context) return buildBrvDashboardStats({ billingAccounts: [], mrrSnapshots: [], arrSnapshots: [], outstandingBalances: [], invoices: [], paymentAttempts: [], collectionCases: [], auditLogs: [] });
        const [billingAccounts, mrrSnapshots, arrSnapshots, outstandingBalances, invoices, paymentAttempts, collectionCases, auditLogs] = await Promise.all([
            this.getBillingAccounts(authUserId, email, fullName),
            this.getMrrSnapshots(authUserId, email, fullName),
            this.getArrSnapshots(authUserId, email, fullName),
            this.getOutstandingBalances(authUserId, email, fullName),
            this.getInvoices(authUserId, email, fullName),
            this.getPaymentAttempts(authUserId, email, fullName),
            this.getCollectionCases(authUserId, email, fullName),
            this.getAuditLogs(authUserId, email, fullName),
        ]);
        return buildBrvDashboardStats({ billingAccounts, mrrSnapshots, arrSnapshots, outstandingBalances, invoices, paymentAttempts, collectionCases, auditLogs });
    }

    getPipelineInfo(): BrvPipelineInfo {
        return buildBrvPipelineInfo();
    }

${methods}

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
        await ai.executeTask({ taskType: "generate_invoice", moduleSource: "billing_revenue", inputPayload: input });
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
        await ai.executeTask({ taskType: "recognize_revenue", moduleSource: "billing_revenue", inputPayload: input });
        const created = await this.createRevenueRecognition(authUserId, email, { billingAccountId: input.billingAccountId, recognitionKey: input.recognitionKey, amountUsd: input.amountUsd }, fullName);
        return { recognitionId: created.id, recognitionKey: created.recognitionKey, amountUsd: input.amountUsd, status: created.status };
    }
}

export const billingRevenueService = new BillingRevenueService();
`;
}

function genHook() {
    const creatable = entities.filter((e) => !e.listOnly);
    const typeImports = [...new Set(creatable.flatMap((e) => [e.input, e.summary]))].concat(["AuditEntry", "BrvDashboardStats", "BrvPipelineInfo"]).sort();
    const states = entities.map((e) => `    const [${e.state}, set${e.singular}s] = useState<${e.listOnly ? "AuditEntry" : e.summary}[]>([]);`).join("\n");
    const setters = entities.map((e) => `        set${e.singular}s(result.${e.state}List);`).join("\n");
    const fetchItems = [...entities.filter((e) => !e.listOnly).map((e) => `            ${e.state}List,`), "            auditLogsList,", "            accountOpts,"].join("\n");
    const fetchCalls = [...entities.filter((e) => !e.listOnly).map((e) => `            billingRevenueService.${e.get}(authUserId, email, fullName),`), "            billingRevenueService.getAuditLogs(authUserId, email, fullName),", "            billingRevenueService.getBillingAccountOptions(authUserId, email, fullName),"].join("\n");
    const creates = creatable.map((e) => `    const ${e.create} = useCallback(async (input: ${e.input}) => { if (!user) throw new Error("Authentication required"); await billingRevenueService.${e.create}(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);`).join("\n");
    return `"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { billingRevenueService } from "@/src/modules/billing-revenue/services/billing-revenue.service";
import type {
    ${typeImports.join(",\n    ")},
} from "@/src/modules/billing-revenue/types";

export function useBillingRevenue() {
    const user = useAuthStore((state) => state.user);
    const authUserId = user?.id;
    const email = user?.email ?? "";
    const fullName = user?.fullName;
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<BrvDashboardStats | null>(null);
    const [pipeline, setPipeline] = useState<BrvPipelineInfo | null>(null);
${states}
    const [billingAccountOptions, setBillingAccountOptions] = useState<Array<{ id: string; name: string }>>([]);

    const fetchData = useCallback(async () => {
        if (!authUserId || !email) return { empty: true as const };
        const [
            statsData,
            pipelineInfo,
${fetchItems}
        ] = await Promise.all([
            billingRevenueService.getDashboardStats(authUserId, email, fullName),
            Promise.resolve(billingRevenueService.getPipelineInfo()),
${fetchCalls}
        ]);
        return {
            statsData,
            pipelineInfo,
${entities.filter((e) => !e.listOnly).map((e) => `            ${e.state}List,`).join("\n")}
            auditLogsList,
            accountOpts,
        };
    }, [authUserId, email, fullName]);

    const applyData = useCallback((result: Awaited<ReturnType<typeof fetchData>>) => {
        if ("empty" in result) { setLoading(false); return; }
        setStats(result.statsData);
        setPipeline(result.pipelineInfo);
${setters}
        setBillingAccountOptions(result.accountOpts);
        setLoading(false);
    }, []);

    const refresh = useCallback(async () => { applyData(await fetchData()); }, [fetchData, applyData]);

    useEffect(() => {
        let cancelled = false;
        void fetchData().then((data) => { if (!cancelled) applyData(data); }).catch(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [fetchData, applyData]);

${creates}

    return {
        loading,
        stats,
        pipeline,
${entities.map((e) => `        ${e.state},`).join("\n")}
        billingAccountOptions,
        refresh,
${creatable.map((e) => `        ${e.create},`).join("\n")}
    };
}
`;
}

function genField(f) {
    if (f.select) return `<select {...form.register("${f.name}")} className={inputClass}>{${f.select}.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>`;
    if (f.number) return `<input type="number" step="any" {...form.register("${f.name}", { valueAsNumber: true })} placeholder="${f.placeholder}" className={inputClass} />`;
    return `<input {...form.register("${f.name}")} placeholder="${f.placeholder}" className={inputClass} />`;
}

function genPanels() {
    const creatable = entities.filter((e) => !e.listOnly);
    const schemaImports = creatable.map((e) => e.schema).join(",\n    ");
    const formImports = creatable.map((e) => `type ${e.form}`).join(",\n    ");
    const panels = creatable.map((e) => {
        const defaults = e.orgScoped
            ? e.fields.map((f) => `${f.name}: ${f.number ? "0" : '""'}`).join(", ")
            : [`billingAccountId: ""`, ...e.fields.map((f) => `${f.name}: ${f.number ? "0" : '""'}`)].join(", ");
        const formFields = e.orgScoped
            ? e.fields.map((f) => `                ${genField(f)}`).join("\n")
            : `                <BillingAccountSelect data={data} {...form.register("billingAccountId")} />\n${e.fields.map((f) => `                ${genField(f)}`).join("\n")}`;
        const listSub = e.maps ? `\${item.billingAccountName} • \${item.${e.keyField}}` : `\${item.${e.keyField}} • \${item.status}`;
        const panelName = e.tab === "billingAccounts" ? "BillingAccountsPanel" : `${e.singular}sPanel`;
        return `export function ${panelName}({ data }: { data: BillingRevenueData }) {
    const form = useForm<${e.form}>({ resolver: zodResolver(${e.schema}), defaultValues: { ${defaults} } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="${e.label}" description="Billing & revenue ${e.label.toLowerCase()}" /><div className="mt-6 space-y-3">
                {data.${e.state}.length === 0 ? <EmptyState title="No ${e.label.toLowerCase()}" description="Create the first ${e.label.toLowerCase()} record." /> : data.${e.state}.map((item) => (
                    <ListCard key={item.id} title={String(item.${e.titleKey})} subtitle={\`${listSub}\`} meta={\`\${item.status}\`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create ${e.label.toLowerCase().replace(/s$/, "")}" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.${e.create}(v))}>
${formFields}
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}`;
    }).join("\n\n");

    const auditPanel = `export function BrvAuditLogsPanel({ data }: { data: BillingRevenueData }) {
    return (
        <Card hover><SectionHeader title="Billing & Revenue audit history" description="Security-first audit trail for subscription billing, payments, revenue, invoices, and collections" /><div className="mt-6 space-y-3">
            {data.auditLogs.length === 0 ? <EmptyState title="No audit entries" description="Audit logs are created automatically for billing and revenue operations." /> : data.auditLogs.map((entry) => (
                <ListCard key={entry.id} title={entry.summary} subtitle={\`\${entry.entityType} • \${entry.action}\`} meta={\`\${entry.securityLevel} • \${new Date(entry.createdAt).toLocaleString()}\`} />
            ))}
        </div></Card>
    );
}`;

    return `"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/src/components/ui/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { BRV_THEME, BILLING_CYCLE_OPTIONS, PAYMENT_STATUS_OPTIONS } from "@/src/modules/billing-revenue/constants";
import type { useBillingRevenue } from "@/src/modules/billing-revenue/hooks/useBillingRevenue";
import {
    ${schemaImports},
    ${formImports},
} from "@/src/modules/billing-revenue/schemas";

type BillingRevenueData = ReturnType<typeof useBillingRevenue>;
const inputClass = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-amber-500/20 focus:ring-4 dark:border-slate-800 dark:bg-slate-950";
function SaveButton({ loading, label = "Save changes" }: { loading?: boolean; label?: string }) {
    return <button type="submit" disabled={loading} className="rounded-full bg-amber-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-amber-500 disabled:opacity-60">{loading ? "Saving..." : label}</button>;
}
function ListCard({ title, subtitle, meta }: { title: string; subtitle: string; meta?: string }) {
    return <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800"><p className="font-medium">{title}</p><p className="text-sm text-slate-500">{subtitle}</p>{meta ? <p className="mt-1 text-xs text-amber-600">{meta}</p> : null}</div>;
}
function BillingAccountSelect({ data, ...props }: { data: BillingRevenueData } & React.SelectHTMLAttributes<HTMLSelectElement>) {
    return <select {...props} className={inputClass}><option value="">Select billing account</option>{data.billingAccountOptions.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>;
}

export function BillingRevenueOverviewPanel({ data }: { data: BillingRevenueData }) {
    const pipeline = data.pipeline;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="Billing & Revenue summary" description="Subscription billing, payments, revenue management, invoices, collections, analytics, and forecasting" /><div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ListCard title="Billing Accounts" subtitle={\`\${data.stats?.totalBillingAccounts ?? 0} total\`} meta={\`\${data.stats?.activeBillingAccounts ?? 0} active • MRR $\${(data.stats?.mrrUsd ?? 0).toFixed(0)}\`} />
                <ListCard title="Revenue" subtitle={\`ARR $\${(data.stats?.arrUsd ?? 0).toFixed(0)}\`} meta={\`Outstanding $\${(data.stats?.outstandingBalanceUsd ?? 0).toFixed(0)} • \${data.stats?.openInvoiceCount ?? 0} open invoices\`} />
                <ListCard title="Payments & Collections" subtitle={\`\${data.stats?.failedPaymentCount ?? 0} failed payments\`} meta={\`\${data.stats?.collectionCaseCount ?? 0} collection cases\`} />
                <ListCard title="Audit Trail" subtitle={\`\${data.stats?.auditCount ?? 0} audit entries\`} meta="Security-first financial operations" />
            </div></Card>
            <Card hover><SectionHeader title="Billing pipeline" description={\`\${pipeline?.previousStage ?? "monthly"} → \${pipeline?.currentStage ?? "quarterly"} → \${pipeline?.nextStage ?? "annual"}\`} /><div className="mt-6 space-y-3">
                {pipeline?.stages?.length ? pipeline.stages.map((stage) => (
                    <ListCard key={stage.key} title={stage.label} subtitle={stage.key} meta={stage.label} />
                )) : <EmptyState title="No pipeline data" description="Billing pipeline stages will appear as accounts are configured." />}
            </div></Card>
        </div>
    );
}

${panels}

${auditPanel}

export function BillingRevenueSdkPanel({ data }: { data: BillingRevenueData }) {
    return (
        <Card hover><SectionHeader title="Shared Billing & Revenue SDK" description="Import from @/src/modules/billing-revenue/sdk for invoice generation, payment processing, and revenue recognition" /><div className="mt-6 space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <ListCard title="createBillingRevenueClient()" subtitle="Factory for module-scoped Billing & Revenue client with auth context" meta="Primary SDK for enterprise billing operations" />
            <ListCard title="sdkGenerateInvoice()" subtitle="Generate invoice with AI orchestration" meta="moduleSource: billing_revenue" />
            <ListCard title="sdkProcessPayment()" subtitle="Process payment attempt with knowledge context" meta="Succeeded, failed, partial, refunded" />
            <ListCard title="sdkRecognizeRevenue()" subtitle="Recognize revenue with audit trail" meta="Deferred → recognized revenue" />
            <p className="text-xs text-slate-500">Theme: {BRV_THEME.primary} • Billing accounts loaded: {data.billingAccounts.length}</p>
            <pre className="overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">{\`import { createBillingRevenueClient } from "@/src/modules/billing-revenue/sdk";

const brv = createBillingRevenueClient(userId, email, fullName);
await brv.generateInvoice({ billingAccountId, invoiceKey: "inv-001", amountUsd: 299 });
await brv.processPayment({ billingAccountId, attemptKey: "pay-001", amountUsd: 299 });
await brv.recognizeRevenue({ billingAccountId, recognitionKey: "rev-001", amountUsd: 299 });\`}</pre>
        </div></Card>
    );
}
`;
}

function genStats() {
    return `import { StatCard } from "@/src/components/ui/StatCard";
import type { BrvDashboardStats } from "@/src/modules/billing-revenue/types";

interface BillingRevenueStatsProps { stats: BrvDashboardStats | null; }

export function BillingRevenueStats({ stats }: BillingRevenueStatsProps) {
    const cards = [
        { title: "MRR", value: \`$\${(stats?.mrrUsd ?? 0).toFixed(0)}\`, detail: \`\${stats?.activeBillingAccounts ?? 0} active accounts • \${stats?.totalBillingAccounts ?? 0} total\`, trend: "up" as const, tone: "accent" as const },
        { title: "ARR", value: \`$\${(stats?.arrUsd ?? 0).toFixed(0)}\`, detail: \`Outstanding $\${(stats?.outstandingBalanceUsd ?? 0).toFixed(0)} • \${stats?.openInvoiceCount ?? 0} open invoices\`, trend: "up" as const },
        { title: "Payments", value: String(stats?.failedPaymentCount ?? 0), detail: \`\${stats?.collectionCaseCount ?? 0} collection cases • failed payment count\`, trend: "up" as const },
        { title: "Audit Trail", value: String(stats?.auditCount ?? 0), detail: "Billing, payments, revenue, invoice, and collection audit entries", trend: "up" as const },
    ];
    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 [&_p:last-child]:text-amber-600 dark:[&_p:last-child]:text-amber-400">
            {cards.map((card) => <StatCard key={card.title} title={card.title} value={card.value} detail={card.detail} trend={card.trend} tone={card.tone} />)}
        </section>
    );
}
`;
}

function genPage() {
    const panelImports = ["BillingRevenueOverviewPanel", ...entities.filter((e) => !e.listOnly).map((e) => e.tab === "billingAccounts" ? "BillingAccountsPanel" : `${e.singular}sPanel`), "BrvAuditLogsPanel", "BillingRevenueSdkPanel"];
    const tabs = [{ id: "BRV_TABS.overview", label: "Overview" }, ...entities.map((e) => ({ id: `BRV_TABS.${e.tab}`, label: e.label })), { id: "BRV_TABS.api", label: "SDK" }];
    const conditionals = [`{activeTab === BRV_TABS.overview ? <BillingRevenueOverviewPanel data={billingRevenue} /> : null}`, ...entities.map((e) => {
        const panel = e.tab === "billingAccounts" ? "BillingAccountsPanel" : e.listOnly ? "BrvAuditLogsPanel" : `${e.singular}sPanel`;
        return `{activeTab === BRV_TABS.${e.tab} ? <${panel} data={billingRevenue} /> : null}`;
    }), `{activeTab === BRV_TABS.api ? <BillingRevenueSdkPanel data={billingRevenue} /> : null}`];
    return `"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { LoadingState } from "@/src/components/ui/LoadingState";
import {
    ${panelImports.join(",\n    ")},
} from "@/src/modules/billing-revenue/components/BillingRevenuePanels";
import { BillingRevenueStats } from "@/src/modules/billing-revenue/components/BillingRevenueStats";
import { BRV_TABS } from "@/src/modules/billing-revenue/constants";
import { useBillingRevenue } from "@/src/modules/billing-revenue/hooks/useBillingRevenue";

const tabs = [
    ${tabs.map((t) => `{ id: ${t.id}, label: "${t.label}" },`).join("\n    ")}
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
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={\`rounded-full px-4 py-2 text-sm font-medium transition \${activeTab === tab.id ? "bg-amber-600 text-white" : "border border-slate-200 text-slate-600 hover:border-amber-300 dark:border-slate-800 dark:text-slate-300"}\`}>{tab.label}</button>
                ))}
            </div>
            ${conditionals.join("\n            ")}
        </div>
    );
}
`;
}

function genSdk() {
    return `import { billingRevenueService } from "@/src/modules/billing-revenue/services/billing-revenue.service";
import type { BrvSdkGenerateInvoiceInput, BrvSdkProcessPaymentInput, BrvSdkRecognizeRevenueInput } from "@/src/modules/billing-revenue/types";

export class BillingRevenueClient {
    constructor(
        private readonly authUserId: string,
        private readonly email: string,
        private readonly fullName?: string | null,
    ) {}

    async generateInvoice(input: BrvSdkGenerateInvoiceInput) {
        return billingRevenueService.sdkGenerateInvoice(this.authUserId, this.email, input, this.fullName);
    }

    async processPayment(input: BrvSdkProcessPaymentInput) {
        return billingRevenueService.sdkProcessPayment(this.authUserId, this.email, input, this.fullName);
    }

    async recognizeRevenue(input: BrvSdkRecognizeRevenueInput) {
        return billingRevenueService.sdkRecognizeRevenue(this.authUserId, this.email, input, this.fullName);
    }

    async getBillingAccounts() {
        return billingRevenueService.getBillingAccounts(this.authUserId, this.email, this.fullName);
    }

    async getDashboardStats() {
        return billingRevenueService.getDashboardStats(this.authUserId, this.email, this.fullName);
    }

    async getPipelineInfo() {
        return billingRevenueService.getPipelineInfo();
    }
}

export function createBillingRevenueClient(authUserId: string, email: string, fullName?: string | null): BillingRevenueClient {
    return new BillingRevenueClient(authUserId, email, fullName);
}

export { billingRevenueService };
`;
}

function genIndex() {
    return `export { BillingRevenuePage } from "@/src/modules/billing-revenue/components/BillingRevenuePage";
export { BillingRevenueStats } from "@/src/modules/billing-revenue/components/BillingRevenueStats";
export { billingRevenueService } from "@/src/modules/billing-revenue/services/billing-revenue.service";
export { useBillingRevenue } from "@/src/modules/billing-revenue/hooks/useBillingRevenue";
export { createBillingRevenueClient, BillingRevenueClient } from "@/src/modules/billing-revenue/sdk";
export * from "@/src/modules/billing-revenue/types";
export * from "@/src/modules/billing-revenue/constants";
`;
}

for (const dir of ["constants", "schemas", "services", "hooks", "components", "sdk", "types"]) {
    fs.mkdirSync(path.join(uiRoot, dir), { recursive: true });
}

fs.writeFileSync(path.join(uiRoot, "constants/index.ts"), genConstants());
fs.writeFileSync(path.join(uiRoot, "types/index.ts"), genTypes());
fs.writeFileSync(path.join(uiRoot, "schemas/index.ts"), `import { z } from "zod";\n\n${genSchemas()}`);
fs.writeFileSync(path.join(uiRoot, "services/billing-revenue.service.ts"), genService());
fs.writeFileSync(path.join(uiRoot, "hooks/useBillingRevenue.ts"), genHook());
fs.writeFileSync(path.join(uiRoot, "components/BillingRevenuePanels.tsx"), genPanels());
fs.writeFileSync(path.join(uiRoot, "components/BillingRevenueStats.tsx"), genStats());
fs.writeFileSync(path.join(uiRoot, "components/BillingRevenuePage.tsx"), genPage());
fs.writeFileSync(path.join(uiRoot, "sdk/index.ts"), genSdk());
fs.writeFileSync(path.join(uiRoot, "index.ts"), genIndex());

const tabCount = entities.length + 2;
console.log("Generated billing-revenue UI module");
console.log("Entity tabs:", entities.length);
console.log("Total BRV_TABS:", tabCount);
