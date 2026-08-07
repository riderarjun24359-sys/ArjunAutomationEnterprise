import type {
    AfbeAutomationKind,
    AfbeInvoiceStatus,
    AfbePaymentMethod,
    AfbeSubscriptionBucket,
} from "./constants";

export interface ExecutiveFinanceKpis {
    arr: number;
    mrr: number;
    revenue: number;
    profit: number;
    expenses: number;
    cashFlow: number;
    burnRate: number;
    runwayMonths: number | null;
}

export interface ExecutiveFinanceDashboard {
    kpis: ExecutiveFinanceKpis;
    mrrTrend: Array<{ date: string; mrr: number }>;
    cashFlowTrend: Array<{ date: string; net: number }>;
}

export interface InvoiceRow {
    id: string;
    number: string;
    status: AfbeInvoiceStatus;
    issueDate: string;
    dueDate: string;
    total: number;
    taxAmount: number;
    amountPaid: number;
    currency: string;
    clientLabel: string;
    notes: string;
    source: "finance" | "brv";
}

export interface InvoiceCenter {
    rows: InvoiceRow[];
    byStatus: Array<{ status: AfbeInvoiceStatus; count: number; total: number }>;
    draftCount: number;
    overdueCount: number;
    paidCount: number;
}

export interface PaymentRow {
    id: string;
    amount: number;
    method: AfbePaymentMethod;
    status: string;
    reference: string;
    paymentDate: string;
    kind: "payment" | "attempt" | "refund";
    failureReason: string;
}

export interface PaymentCenter {
    rows: PaymentRow[];
    byMethod: Array<{ method: AfbePaymentMethod; count: number; amount: number }>;
    refunds: number;
    failed: number;
    timeline: PaymentRow[];
}

export interface ExpenseRow {
    id: string;
    category: string;
    vendor: string;
    description: string;
    amount: number;
    expenseDate: string;
    status: string;
    recurring: boolean;
    receipt: string;
}

export interface ExpenseManager {
    rows: ExpenseRow[];
    categories: Array<{ category: string; count: number; amount: number }>;
    vendors: Array<{ vendor: string; count: number; amount: number }>;
    recurringCount: number;
    pendingApprovals: number;
    monthlyTotal: number;
}

export interface SubscriptionRow {
    id: string;
    planName: string;
    bucket: AfbeSubscriptionBucket;
    billingCycle: string;
    amountUsd: number;
    mrrUsd: number;
    status: string;
    renewsAt: string;
}

export interface SubscriptionBilling {
    rows: SubscriptionRow[];
    byBucket: Array<{ bucket: AfbeSubscriptionBucket; count: number }>;
    activeMrr: number;
    planCount: number;
}

export interface RevenueAnalytics {
    monthlyRevenue: number;
    annualRevenue: number;
    byClient: Array<{ client: string; revenue: number }>;
    byService: Array<{ service: string; revenue: number }>;
    forecast: number;
    growthPercent: number | null;
    monthlySeries: Array<{ month: string; revenue: number }>;
}

export interface TaxGstDashboard {
    taxConfigs: Array<{ id: string; name: string; gstRate: number; taxType: string; jurisdiction: string }>;
    taxRates: Array<{ id: string; name: string; ratePercent: number; isDefault: boolean }>;
    invoiceTaxTotal: number;
    taxableInvoices: number;
    filingReady: boolean;
    exportRows: Array<{ label: string; value: string }>;
}

export interface AiFinancialInsight {
    id: string;
    category: "revenue_risk" | "spending" | "cost_optimization" | "cash_flow" | "profit";
    title: string;
    detail: string;
    severity: "high" | "medium" | "low";
}

export interface AiFinancialInsights {
    insights: AiFinancialInsight[];
    highSeverity: number;
}

export interface FinancialReports {
    profitAndLoss: { revenue: number; expenses: number; profit: number };
    balanceSheet: { assets: number; liabilities: number; equity: number };
    cashFlowStatement: { inflow: number; outflow: number; net: number };
    revenueReportTotal: number;
    expenseReportTotal: number;
    executiveSummary: string;
}

export interface AutomationRuleRow {
    id: string;
    name: string;
    kind: AfbeAutomationKind;
    status: string;
    schedule: string;
    active: boolean;
}

export interface FinanceAutomationCenter {
    rules: AutomationRuleRow[];
    activeRules: number;
    byKind: Array<{ kind: AfbeAutomationKind; count: number }>;
}

export interface ExecutiveIntelligenceBoard {
    financialHealthScore: number | null;
    cashPosition: number;
    revenueGrowthPercent: number | null;
    burnRate: number;
    topCustomers: Array<{ name: string; revenue: number }>;
    outstandingPayments: number;
    forecast: number;
    businessHealthScore: number | null;
    summary: string;
}

export interface AiFinanceBillingEngineSnapshot {
    organizationId: string | null;
    accessGranted: boolean;
    accessDeniedReason?: string;
    fetchedAt: string;
    dashboard: ExecutiveFinanceDashboard;
    invoices: InvoiceCenter;
    payments: PaymentCenter;
    expenses: ExpenseManager;
    subscriptions: SubscriptionBilling;
    revenue: RevenueAnalytics;
    tax: TaxGstDashboard;
    insights: AiFinancialInsights;
    reports: FinancialReports;
    automation: FinanceAutomationCenter;
    executive: ExecutiveIntelligenceBoard;
}

export interface AiFinanceBillingEngineRawData {
    organizationId: string;
    membershipRole: string | null;
    clients: Array<{ id: string; name: string }>;
    invoices: Array<{
        id: string;
        number: string;
        status: string;
        issue_date: string;
        due_date: string | null;
        subtotal: number;
        tax_amount: number;
        total: number;
        amount_paid: number;
        currency: string;
        notes: string;
        client_id: string | null;
    }>;
    payments: Array<{
        id: string;
        invoice_id: string;
        amount: number;
        payment_date: string;
        method: string;
        reference: string;
        status: string;
        client_id: string | null;
    }>;
    expenses: Array<{
        id: string;
        category: string;
        description: string;
        amount: number;
        expense_date: string;
        status: string;
        client_id: string | null;
        project_id: string | null;
    }>;
    taxRates: Array<{ id: string; name: string; rate_percent: number; is_default: boolean }>;
    recurringInvoices: Array<{
        id: string;
        title: string;
        frequency: string;
        next_run_date: string;
        total: number;
        is_active: boolean;
        notes: string;
        client_id: string;
    }>;
    brvInvoices: Array<{
        id: string;
        invoice_number: string;
        subtotal_usd: number;
        tax_amount: number;
        total_usd: number;
        amount_due_usd: number;
        invoice_date: string;
        due_date: string | null;
        payment_status: string;
        status: string;
        billing_account_id: string;
    }>;
    brvSubscriptions: Array<{
        id: string;
        plan_name: string;
        billing_cycle: string;
        amount_usd: number;
        mrr_usd: number;
        arr_usd: number;
        status: string;
        payment_status: string;
        renews_at: string | null;
        starts_at: string;
        ends_at: string | null;
        billing_account_id: string;
    }>;
    brvPaymentMethods: Array<{
        id: string;
        method_type: string;
        brand: string;
        last_four: string;
        status: string;
        is_default: boolean;
    }>;
    brvPaymentAttempts: Array<{
        id: string;
        amount_usd: number;
        payment_status: string;
        gateway_reference: string;
        failure_reason: string;
        attempted_at: string;
        status: string;
    }>;
    brvRefunds: Array<{
        id: string;
        amount_usd: number;
        refund_reason: string;
        refund_status: string;
        processed_at: string | null;
        status: string;
    }>;
    brvMrrSnapshots: Array<{
        id: string;
        snapshot_date: string;
        mrr_usd: number;
        previous_mrr_usd: number;
        status: string;
    }>;
    brvArrSnapshots: Array<{
        id: string;
        snapshot_date: string;
        arr_usd: number;
        previous_arr_usd: number;
        status: string;
    }>;
    brvCashFlow: Array<{
        id: string;
        record_date: string;
        inflow_usd: number;
        outflow_usd: number;
        net_cash_usd: number;
        category: string;
        status: string;
    }>;
    brvTaxConfigs: Array<{
        id: string;
        tax_name: string;
        gst_rate: number;
        tax_type: string;
        jurisdiction: string;
        is_default: boolean;
        status: string;
    }>;
    brvOutstanding: Array<{
        id: string;
        total_outstanding_usd: number;
        overdue_usd: number;
        current_usd: number;
        days_overdue: number;
        status: string;
        billing_account_id: string;
    }>;
    brvReminders: Array<{
        id: string;
        reminder_type: string;
        channel: string;
        status: string;
        next_reminder_at: string | null;
        sent_at: string | null;
    }>;
    brvFinanceMetrics: Array<{
        id: string;
        metric_date: string;
        total_mrr_usd: number;
        total_arr_usd: number;
        total_revenue_usd: number;
        collection_rate_percent: number;
        dso_days: number;
        status: string;
    }>;
    brvFinancialHealth: Array<{
        id: string;
        health_date: string;
        overall_score: number;
        liquidity_score: number;
        collection_score: number;
        summary: string;
        status: string;
    }>;
    brvGrowth: Array<{
        id: string;
        metric_date: string;
        growth_rate_percent: number;
        expansion_revenue_usd: number;
        contraction_revenue_usd: number;
        status: string;
    }>;
    brvProjections: Array<{
        id: string;
        projection_date: string;
        projected_revenue_usd: number;
        projection_horizon_months: number;
        status: string;
    }>;
    brvRenewalForecasts: Array<{
        id: string;
        forecast_date: string;
        renewal_amount_usd: number;
        renewal_probability: number;
        status: string;
    }>;
    brvAccounts: Array<{ id: string; account_name: string; billing_email: string; status: string }>;
    brvProrations: Array<{
        id: string;
        proration_type: string;
        prorated_amount_usd: number;
        reason: string;
        status: string;
        effective_date: string;
    }>;
    brvAnalytics: Array<{
        id: string;
        snapshot_date: string;
        total_revenue_usd: number;
        mrr_usd: number;
        arr_usd: number;
        status: string;
    }>;
}

export interface CreateInvoiceInput {
    number: string;
    clientId?: string | null;
    issueDate: string;
    dueDate?: string | null;
    subtotal: number;
    taxAmount: number;
    total: number;
    currency?: string;
    notes?: string;
    status?: string;
}
