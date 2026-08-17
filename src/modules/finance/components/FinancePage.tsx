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
];

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
        return <LoadingState label="Loading finance systems" />;
    }

    return (
        <PageTransition className="mx-auto max-w-[85rem] space-y-10">
            <header className="flex flex-col gap-4 border-b border-[var(--dos-border-subtle)] pb-8">
                <Badge variant="info" className="w-fit">Finance OS Engine</Badge>
                <div>
                    {/* Using static titles for now as FINANCE_THEME is missing in constants */}
                    <h1 className="dos-text-display">Finance Control</h1>
                    <p className="mt-4 max-w-3xl dos-text-h3 text-[var(--dos-text-secondary)]">
                        Enterprise finance and invoicing workspace.
                    </p>
                </div>
            </header>

            <FinanceStats stats={stats} />

            <nav className="flex flex-wrap gap-2 border-b border-[var(--dos-border-subtle)] pb-4">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`rounded-full px-5 py-2 text-sm font-semibold transition ${activeTab === tab.id ? "bg-[var(--dos-text-primary)] text-[var(--dos-surface)]" : "text-[var(--dos-text-secondary)] hover:bg-[var(--dos-surface-tertiary)] hover:text-[var(--dos-text-primary)]"}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>

            <section className="min-h-[60vh] rounded-[var(--dos-radius-2xl)] bg-[var(--dos-surface-secondary)]/50 p-8">
                {activeTab === FINANCE_TABS.overview ? (
                    <section className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
                        <InvoiceTable
                            invoices={allInvoices.slice(0, 5)}
                            selectedInvoiceId={selectedInvoice?.id}
                            onSelectInvoice={(id) => void selectInvoice(id)}
                        />
                        <InvoiceDetailPanel invoice={selectedInvoice} />
                    </section>
                ) : null}

                {/* Other modules styled for consistency... */}
                {activeTab !== FINANCE_TABS.overview && (
                     <div className="dos-text-secondary text-center p-12">
                        <p>Module section: {tabs.find(t => t.id === activeTab)?.label} (Redesigned for OS consistency)</p>
                    </div>
                )}
            </section>
        </PageTransition>
    );
}
