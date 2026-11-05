"use client";

import { useState } from "react";
import { Card } from "@/src/design-os/components/primitives/Card";
import { Button } from "@/src/design-os/components/primitives/Button";
import { PageTransition } from "@/src/design-os/motion/components/PageTransition";
import { SkeletonLoader } from "@/src/design-os/motion/components/SkeletonLoader";
import { BILLING_FINANCE_OS_THEME } from "@/src/modules/billing-finance/constants/os";
import { useBillingFinanceOs } from "@/src/modules/billing-finance/hooks/useBillingFinanceOs";
import { useFinance } from "@/src/modules/finance/hooks/useFinance";
import { AiFinanceAssistantPanel } from "@/src/modules/billing-finance/components/os/AiFinanceAssistantPanel";
import { InvoiceCenterPanel } from "@/src/modules/billing-finance/components/os/InvoiceCenterPanel";
import { PaymentCenterPanel } from "@/src/modules/billing-finance/components/os/PaymentCenterPanel";
import { SubscriptionManagementPanel } from "@/src/modules/billing-finance/components/os/SubscriptionManagementPanel";
import { EstimateCenterPanel } from "@/src/modules/billing-finance/components/os/EstimateCenterPanel";
import { ExpenseCenterPanel } from "@/src/modules/billing-finance/components/os/ExpenseCenterPanel";
import { TaxCenterPanel } from "@/src/modules/billing-finance/components/os/TaxCenterPanel";
import { RecurringCenterPanel } from "@/src/modules/billing-finance/components/os/RecurringCenterPanel";
import type {
    EstimateFormValues,
    ExpenseFormValues,
    RecurringInvoiceFormValues,
    TaxRateFormValues,
} from "@/src/modules/finance/schemas";

function Skeleton() {
    return (
        <PageTransition className="mx-auto max-w-7xl space-y-6 p-6">
            <SkeletonLoader className="h-8 w-72" />
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => <Card key={index}><SkeletonLoader className="h-16 w-full" /></Card>)}
            </div>
        </PageTransition>
    );
}

const formatUsd = (amount: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);

export function BillingFinanceOsPage() {
    const { snapshot, loading, error } = useBillingFinanceOs();
    const {
        estimates, expenses, recurringInvoices, taxRates, clients, projects,
        createEstimate, createExpense, createRecurringInvoice, createTaxRate,
        loading: financeLoading,
    } = useFinance();
    const [activeView, setActiveView] = useState("pulse");

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
    };

    const handleCreateTaxRate = async (values: TaxRateFormValues) => {
        await createTaxRate(values);
    };

    if (loading || financeLoading) return <Skeleton />;
    if (error || !snapshot) {
        return (
            <PageTransition className="mx-auto max-w-3xl p-6">
                <Card variant="base" className="space-y-3">
                    <h1 className="text-xl font-semibold text-[var(--dos-text-primary)]">Billing & Finance is unavailable</h1>
                    <p className="text-sm text-[var(--dos-text-secondary)]">{error || "The finance snapshot could not be loaded. Check your organization access and try again."}</p>
                    <p className="text-xs text-[var(--dos-text-tertiary)]">No financial data has been changed.</p>
                </Card>
            </PageTransition>
        );
    }

    return (
        <PageTransition className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6">
            <header>
                <h1 className="text-3xl font-bold text-[var(--dos-text-primary)]">{BILLING_FINANCE_OS_THEME.title}</h1>
                <p className="text-[var(--dos-text-secondary)]">{BILLING_FINANCE_OS_THEME.subtitle}</p>
            </header>

            <section aria-label="Financial pulse">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <Card variant="base">
                        <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]">MRR · USD</p>
                        <p className="mt-1 text-2xl font-bold">{formatUsd(snapshot.stats.mrrUsd)}</p>
                    </Card>
                    <Card variant="base">
                        <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]">ARR · USD</p>
                        <p className="mt-1 text-2xl font-bold">{formatUsd(snapshot.stats.arrUsd)}</p>
                    </Card>
                    <Card variant="base">
                        <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]">Collected · USD</p>
                        <p className="mt-1 text-2xl font-bold text-[var(--dos-tint-success)]">{formatUsd(snapshot.stats.collectedUsd)}</p>
                    </Card>
                    <Card variant="insight">
                        <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]">Outstanding · USD</p>
                        <p className="mt-1 text-2xl font-bold text-[var(--dos-brand-primary)]">{formatUsd(snapshot.stats.outstandingUsd)}</p>
                    </Card>
                </div>
                <p className="mt-2 text-xs text-[var(--dos-text-tertiary)]">These executive revenue metrics are stored in USD in the current billing data model; INR conversion is not applied.</p>
            </section>

            <section className="grid gap-6 md:grid-cols-3">
                <div className="space-y-4 md:col-span-2">
                    <h2 className="text-lg font-semibold text-[var(--dos-text-primary)]">Exception field</h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Card variant="base" className="border-[var(--dos-tint-critical)]/30">
                            <p className="text-sm font-medium text-[var(--dos-tint-critical)]">Open invoices</p>
                            <p className="mt-1 text-3xl font-bold">{snapshot.stats.openInvoices}</p>
                        </Card>
                        <Card variant="base" className="border-[var(--dos-tint-warning)]/30">
                            <p className="text-sm font-medium text-[var(--dos-tint-warning)]">Failed payments</p>
                            <p className="mt-1 text-3xl font-bold">{snapshot.stats.failedPayments}</p>
                        </Card>
                    </div>
                </div>
                <div>
                    <h2 className="mb-4 text-lg font-semibold text-[var(--dos-text-primary)]">Financial context</h2>
                    <Card variant="base">
                        <p className="text-sm font-medium text-[var(--dos-text-tertiary)]">Top accounts (MRR · USD)</p>
                        <ul className="mt-4 space-y-2">
                            {snapshot.revenue.topAccounts.slice(0, 5).map((account) => (
                                <li key={account.name} className="flex justify-between gap-3 text-sm">
                                    <span className="truncate text-[var(--dos-text-secondary)]">{account.name}</span>
                                    <span className="font-semibold">{formatUsd(account.mrrUsd)}</span>
                                </li>
                            ))}
                        </ul>
                    </Card>
                </div>
            </section>

            <nav aria-label="Billing and finance sections" className="flex flex-wrap gap-2">
                <Button variant={activeView === "pulse" ? "primary" : "secondary"} onClick={() => setActiveView("pulse")}>Overview</Button>
                <Button variant={activeView === "invoices" ? "primary" : "secondary"} onClick={() => setActiveView("invoices")}>Invoices</Button>
                <Button variant={activeView === "payments" ? "primary" : "secondary"} onClick={() => setActiveView("payments")}>Payments</Button>
                <Button variant={activeView === "subs" ? "primary" : "secondary"} onClick={() => setActiveView("subs")}>Subscriptions</Button>
                <Button variant={activeView === "estimates" ? "primary" : "secondary"} onClick={() => setActiveView("estimates")}>Estimates</Button>
                <Button variant={activeView === "expenses" ? "primary" : "secondary"} onClick={() => setActiveView("expenses")}>Expenses</Button>
                <Button variant={activeView === "tax" ? "primary" : "secondary"} onClick={() => setActiveView("tax")}>Tax</Button>
                <Button variant={activeView === "recurring" ? "primary" : "secondary"} onClick={() => setActiveView("recurring")}>Recurring</Button>
                <Button variant={activeView === "assistant" ? "primary" : "secondary"} onClick={() => setActiveView("assistant")}>Intelligence</Button>
            </nav>

            <main>
                {activeView === "pulse" && <Card variant="base"><p className="text-sm text-[var(--dos-text-secondary)]">Use the sections above to review and manage invoices, payments, subscriptions, estimates, expenses, tax rates, recurring billing, and financial insights.</p></Card>}
                {activeView === "invoices" && <InvoiceCenterPanel items={snapshot.invoices} />}
                {activeView === "payments" && <PaymentCenterPanel items={snapshot.payments} />}
                {activeView === "subs" && <SubscriptionManagementPanel items={snapshot.subscriptions} />}
                {activeView === "estimates" && <EstimateCenterPanel estimates={estimates} clients={clients} projects={projects} onCreate={handleCreateEstimate} />}
                {activeView === "expenses" && <ExpenseCenterPanel expenses={expenses} clients={clients} projects={projects} onCreate={handleCreateExpense} />}
                {activeView === "tax" && <TaxCenterPanel taxRates={taxRates} onSubmit={handleCreateTaxRate} />}
                {activeView === "recurring" && <RecurringCenterPanel clients={clients} projects={projects} recurringInvoices={recurringInvoices} onCreate={handleCreateRecurring} />}
                {activeView === "assistant" && <AiFinanceAssistantPanel assistant={snapshot.assistant} />}
            </main>
        </PageTransition>
    );
}
