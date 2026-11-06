"use client";

import { useState } from "react";
import { PageTransition } from "@/src/design-os/motion/components/PageTransition";
import { Badge } from "@/src/design-os/components/Badge";
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

const actionClass = "rounded-full bg-[var(--dos-text-primary)] px-5 py-2.5 text-sm font-semibold text-[var(--dos-surface)] transition hover:opacity-90";

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

    if (loading) return <LoadingState label="Loading finance systems" />;

    return (
        <PageTransition className="mx-auto max-w-[85rem] space-y-8">
            <header className="flex flex-col gap-4 border-b border-[var(--dos-border-subtle)] pb-8">
                <Badge variant="info" className="w-fit">Finance OS Engine</Badge>
                <div>
                    <h1 className="dos-text-display">Finance Control</h1>
                    <p className="mt-4 max-w-3xl dos-text-h3 text-[var(--dos-text-secondary)]">
                        Manage invoices, estimates, payments, expenses, recurring billing, tax rates, and financial reports.
                    </p>
                </div>
            </header>

            <FinanceStats stats={stats} />

            <nav aria-label="Finance sections" className="flex flex-wrap gap-2 border-b border-[var(--dos-border-subtle)] pb-4">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        aria-pressed={activeTab === tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`rounded-full px-5 py-2 text-sm font-semibold transition ${activeTab === tab.id ? "bg-[var(--dos-text-primary)] text-[var(--dos-surface)]" : "text-[var(--dos-text-secondary)] hover:bg-[var(--dos-surface-tertiary)] hover:text-[var(--dos-text-primary)]"}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>

            <section className="min-h-[50vh] space-y-6 rounded-[var(--dos-radius-2xl)] bg-[var(--dos-surface-secondary)]/50 p-4 sm:p-8">
                {activeTab === FINANCE_TABS.overview && (
                    <>
                        <FinanceFilters searchQuery={searchQuery} statusFilter={statusFilter} onSearchChange={setSearchQuery} onStatusChange={setStatusFilter} />
                        <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
                            <InvoiceTable invoices={invoices.slice(0, 5)} selectedInvoiceId={selectedInvoice?.id} onSelectInvoice={selectInvoice} />
                            <InvoiceDetailPanel invoice={selectedInvoice} />
                        </div>
                        <div className="grid gap-8 xl:grid-cols-2">
                            <EstimateTable estimates={estimates.slice(0, 5)} onConvert={convertEstimateToInvoice} />
                            <ExpenseTable expenses={expenses.slice(0, 5)} />
                        </div>
                    </>
                )}

                {activeTab === FINANCE_TABS.invoices && (
                    <>
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <h2 className="dos-text-h2">Invoices</h2>
                            <button type="button" className={actionClass} onClick={() => setShowInvoiceForm((value) => !value)}>{showInvoiceForm ? "Close form" : "Create invoice"}</button>
                        </div>
                        {showInvoiceForm && <InvoiceForm clients={clients} projects={projects} onSubmit={handleCreateInvoice} />}
                        <FinanceFilters searchQuery={searchQuery} statusFilter={statusFilter} onSearchChange={setSearchQuery} onStatusChange={setStatusFilter} />
                        <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
                            <InvoiceTable invoices={invoices} selectedInvoiceId={selectedInvoice?.id} onSelectInvoice={selectInvoice} />
                            <InvoiceDetailPanel invoice={selectedInvoice} />
                        </div>
                    </>
                )}

                {activeTab === FINANCE_TABS.estimates && (
                    <>
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <h2 className="dos-text-h2">Estimates</h2>
                            <button type="button" className={actionClass} onClick={() => setShowEstimateForm((value) => !value)}>{showEstimateForm ? "Close form" : "Create estimate"}</button>
                        </div>
                        {showEstimateForm && <EstimateForm clients={clients} projects={projects} onSubmit={handleCreateEstimate} />}
                        <EstimateTable estimates={estimates} onConvert={convertEstimateToInvoice} />
                    </>
                )}

                {activeTab === FINANCE_TABS.payments && (
                    <>
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <h2 className="dos-text-h2">Payments</h2>
                            <button type="button" className={actionClass} onClick={() => setShowPaymentForm((value) => !value)}>{showPaymentForm ? "Close form" : "Record payment"}</button>
                        </div>
                        {showPaymentForm && <PaymentForm invoices={allInvoices} onSubmit={handleCreatePayment} />}
                        <PaymentTable payments={payments} />
                    </>
                )}

                {activeTab === FINANCE_TABS.expenses && (
                    <>
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <h2 className="dos-text-h2">Expenses</h2>
                            <button type="button" className={actionClass} onClick={() => setShowExpenseForm((value) => !value)}>{showExpenseForm ? "Close form" : "Add expense"}</button>
                        </div>
                        {showExpenseForm && <ExpenseForm clients={clients} projects={projects} onSubmit={handleCreateExpense} />}
                        <ExpenseTable expenses={expenses} />
                    </>
                )}

                {activeTab === FINANCE_TABS.recurring && (
                    <>
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <h2 className="dos-text-h2">Recurring invoices</h2>
                            <button type="button" className={actionClass} onClick={() => setShowRecurringForm((value) => !value)}>{showRecurringForm ? "Close form" : "Create schedule"}</button>
                        </div>
                        {showRecurringForm && <RecurringForm clients={clients} projects={projects} onSubmit={handleCreateRecurring} />}
                        <RecurringTable recurringInvoices={recurringInvoices} />
                    </>
                )}

                {activeTab === FINANCE_TABS.taxes && (
                    <>
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <h2 className="dos-text-h2">Tax rates</h2>
                            <button type="button" className={actionClass} onClick={() => setShowTaxForm((value) => !value)}>{showTaxForm ? "Close form" : "Add tax rate"}</button>
                        </div>
                        {showTaxForm && <TaxRateForm onSubmit={handleCreateTaxRate} />}
                        <TaxRateTable taxRates={taxRates} />
                    </>
                )}

                {activeTab === FINANCE_TABS.reports && <FinanceReports reports={reports} />}
            </section>
        </PageTransition>
    );
}
