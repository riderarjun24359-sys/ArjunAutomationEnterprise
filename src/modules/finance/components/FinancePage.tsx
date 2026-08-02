"use client";

import { motion } from "framer-motion";
import { Plus, Wallet } from "lucide-react";
import { useState } from "react";
import { Card } from "@/src/components/ui/Card";
import { LoadingState } from "@/src/components/ui/LoadingState";
import { EstimateForm } from "@/src/modules/finance/components/EstimateForm";
import { EstimateTable } from "@/src/modules/finance/components/EstimateTable";
import { ExpenseForm } from "@/src/modules/finance/components/ExpenseForm";
import { ExpenseTable } from "@/src/modules/finance/components/ExpenseTable";
import { FinanceFilters } from "@/src/modules/finance/components/FinanceFilters";
import { FinanceReports } from "@/src/modules/finance/components/FinanceReports";
import { FinanceStats } from "@/src/modules/finance/components/FinanceStats";
import { InvoiceDetailPanel } from "@/src/modules/finance/components/InvoiceDetailPanel";
import { InvoiceForm } from "@/src/modules/finance/components/InvoiceForm";
import { InvoiceTable } from "@/src/modules/finance/components/InvoiceTable";
import { PaymentForm } from "@/src/modules/finance/components/PaymentForm";
import { PaymentTable } from "@/src/modules/finance/components/PaymentTable";
import { RecurringForm } from "@/src/modules/finance/components/RecurringForm";
import { RecurringTable } from "@/src/modules/finance/components/RecurringTable";
import { TaxRateForm } from "@/src/modules/finance/components/TaxRateForm";
import { TaxRateTable } from "@/src/modules/finance/components/TaxRateTable";
import { FINANCE_TABS } from "@/src/modules/finance/constants";
import { useFinance } from "@/src/modules/finance/hooks/useFinance";
import type {
    EstimateFormValues,
    ExpenseFormValues,
    InvoiceFormValues,
    PaymentFormValues,
    RecurringInvoiceFormValues,
    TaxRateFormValues,
} from "@/src/modules/finance/schemas";

const tabs = [
    { id: FINANCE_TABS.overview, label: "Overview" },
    { id: FINANCE_TABS.invoices, label: "Invoices" },
    { id: FINANCE_TABS.estimates, label: "Estimates" },
    { id: FINANCE_TABS.payments, label: "Payments" },
    { id: FINANCE_TABS.expenses, label: "Expenses" },
    { id: FINANCE_TABS.recurring, label: "Recurring" },
    { id: FINANCE_TABS.taxes, label: "Taxes" },
    { id: FINANCE_TABS.reports, label: "Reports" },
] as const;

export function FinancePage() {
    const {
        invoices,
        allInvoices,
        estimates,
        payments,
        expenses,
        recurringInvoices,
        taxRates,
        clients,
        projects,
        stats,
        reports,
        selectedInvoice,
        loading,
        searchQuery,
        statusFilter,
        setSearchQuery,
        setStatusFilter,
        selectInvoice,
        createInvoice,
        createEstimate,
        convertEstimateToInvoice,
        createPayment,
        createExpense,
        createRecurringInvoice,
        createTaxRate,
    } = useFinance();

    const [activeTab, setActiveTab] = useState<(typeof FINANCE_TABS)[keyof typeof FINANCE_TABS]>(FINANCE_TABS.overview);
    const [showInvoiceForm, setShowInvoiceForm] = useState(false);
    const [showEstimateForm, setShowEstimateForm] = useState(false);
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [showExpenseForm, setShowExpenseForm] = useState(false);
    const [showRecurringForm, setShowRecurringForm] = useState(false);
    const [showTaxForm, setShowTaxForm] = useState(false);

    const handleCreateInvoice = async (values: InvoiceFormValues) => {
        await createInvoice({
            number: values.number,
            status: values.status,
            clientId: values.clientId || null,
            projectId: values.projectId || null,
            issueDate: values.issueDate,
            dueDate: values.dueDate,
            notes: values.notes,
            lineItems: values.lineItems,
        });
        setShowInvoiceForm(false);
        setActiveTab(FINANCE_TABS.invoices);
    };

    const handleCreateEstimate = async (values: EstimateFormValues) => {
        await createEstimate({
            number: values.number,
            status: values.status,
            clientId: values.clientId || null,
            projectId: values.projectId || null,
            issueDate: values.issueDate,
            validUntil: values.validUntil,
            notes: values.notes,
            lineItems: values.lineItems,
        });
        setShowEstimateForm(false);
    };

    const handleCreatePayment = async (values: PaymentFormValues) => {
        await createPayment(values);
        setShowPaymentForm(false);
    };

    const handleCreateExpense = async (values: ExpenseFormValues) => {
        await createExpense({
            category: values.category,
            description: values.description,
            amount: values.amount,
            expenseDate: values.expenseDate,
            status: values.status,
            submittedBy: values.submittedBy,
            projectId: values.projectId || null,
            clientId: values.clientId || null,
        });
        setShowExpenseForm(false);
    };

    const handleCreateRecurring = async (values: RecurringInvoiceFormValues) => {
        await createRecurringInvoice({
            title: values.title,
            clientId: values.clientId,
            projectId: values.projectId || null,
            frequency: values.frequency,
            nextRunDate: values.nextRunDate,
            endDate: values.endDate || null,
            subtotal: values.subtotal,
            taxAmount: values.taxAmount,
            total: values.total,
            notes: values.notes,
            isActive: values.isActive,
        });
        setShowRecurringForm(false);
    };

    const handleCreateTaxRate = async (values: TaxRateFormValues) => {
        await createTaxRate(values);
        setShowTaxForm(false);
    };

    if (loading) {
        return (
            <div className="mx-auto max-w-7xl">
                <LoadingState label="Loading finance and invoicing data" />
            </div>
        );
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-slate-900 dark:text-slate-100">
            <motion.header
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80"
            >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-sm font-medium uppercase tracking-[0.24em] text-emerald-600">Finance Operations</p>
                        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Enterprise finance and invoicing</h1>
                        <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                            Manage invoices, estimates, payments, expenses, recurring billing, taxes, and financial reports from one Supabase-backed workspace.
                        </p>
                    </div>
                </div>
            </motion.header>

            <FinanceStats stats={stats} />

            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === tab.id ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900" : "bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === FINANCE_TABS.overview ? (
                <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                    <InvoiceTable
                        invoices={allInvoices.slice(0, 5)}
                        selectedInvoiceId={selectedInvoice?.id}
                        onSelectInvoice={(id) => void selectInvoice(id)}
                    />
                    <InvoiceDetailPanel invoice={selectedInvoice} />
                </section>
            ) : null}

            {activeTab === FINANCE_TABS.invoices ? (
                <>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={() => setShowInvoiceForm((current) => !current)}
                            className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 dark:hover:bg-emerald-950"
                        >
                            <Plus className="h-4 w-4" />
                            {showInvoiceForm ? "Hide Form" : "New Invoice"}
                        </button>
                    </div>
                    {showInvoiceForm ? (
                        <InvoiceForm clients={clients} projects={projects} onSubmit={handleCreateInvoice} />
                    ) : null}
                    <FinanceFilters
                        searchQuery={searchQuery}
                        statusFilter={statusFilter}
                        onSearchChange={setSearchQuery}
                        onStatusChange={setStatusFilter}
                    />
                    <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                        <InvoiceTable
                            invoices={invoices}
                            selectedInvoiceId={selectedInvoice?.id}
                            onSelectInvoice={(id) => void selectInvoice(id)}
                        />
                        <InvoiceDetailPanel invoice={selectedInvoice} />
                    </section>
                </>
            ) : null}

            {activeTab === FINANCE_TABS.estimates ? (
                <>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={() => setShowEstimateForm((current) => !current)}
                            className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 dark:hover:bg-emerald-950"
                        >
                            <Plus className="h-4 w-4" />
                            {showEstimateForm ? "Hide Form" : "New Estimate"}
                        </button>
                    </div>
                    {showEstimateForm ? (
                        <EstimateForm clients={clients} projects={projects} onSubmit={handleCreateEstimate} />
                    ) : null}
                    <EstimateTable
                        estimates={estimates}
                        onConvert={(id) => void convertEstimateToInvoice(id)}
                    />
                </>
            ) : null}

            {activeTab === FINANCE_TABS.payments ? (
                <>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={() => setShowPaymentForm((current) => !current)}
                            className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 dark:hover:bg-emerald-950"
                        >
                            <Plus className="h-4 w-4" />
                            {showPaymentForm ? "Hide Form" : "Record Payment"}
                        </button>
                    </div>
                    {showPaymentForm ? (
                        <PaymentForm invoices={allInvoices} onSubmit={handleCreatePayment} />
                    ) : null}
                    <PaymentTable payments={payments} />
                </>
            ) : null}

            {activeTab === FINANCE_TABS.expenses ? (
                <>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={() => setShowExpenseForm((current) => !current)}
                            className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 dark:hover:bg-emerald-950"
                        >
                            <Plus className="h-4 w-4" />
                            {showExpenseForm ? "Hide Form" : "New Expense"}
                        </button>
                    </div>
                    {showExpenseForm ? (
                        <ExpenseForm clients={clients} projects={projects} onSubmit={handleCreateExpense} />
                    ) : null}
                    <ExpenseTable expenses={expenses} />
                </>
            ) : null}

            {activeTab === FINANCE_TABS.recurring ? (
                <>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={() => setShowRecurringForm((current) => !current)}
                            className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 dark:hover:bg-emerald-950"
                        >
                            <Plus className="h-4 w-4" />
                            {showRecurringForm ? "Hide Form" : "New Recurring"}
                        </button>
                    </div>
                    {showRecurringForm ? (
                        <RecurringForm clients={clients} projects={projects} onSubmit={handleCreateRecurring} />
                    ) : null}
                    <RecurringTable recurringInvoices={recurringInvoices} />
                </>
            ) : null}

            {activeTab === FINANCE_TABS.taxes ? (
                <>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={() => setShowTaxForm((current) => !current)}
                            className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 dark:hover:bg-emerald-950"
                        >
                            <Plus className="h-4 w-4" />
                            {showTaxForm ? "Hide Form" : "New Tax Rate"}
                        </button>
                    </div>
                    {showTaxForm ? <TaxRateForm onSubmit={handleCreateTaxRate} /> : null}
                    <TaxRateTable taxRates={taxRates} />
                </>
            ) : null}

            {activeTab === FINANCE_TABS.reports ? <FinanceReports reports={reports} /> : null}

            {allInvoices.length === 0 && estimates.length === 0 ? (
                <Card hover>
                    <div className="flex items-center gap-3">
                        <Wallet className="h-5 w-5 text-emerald-600" />
                        <p className="text-sm text-slate-500 dark:text-slate-400">Create your first invoice or estimate to populate the finance workspace.</p>
                    </div>
                </Card>
            ) : null}
        </div>
    );
}
