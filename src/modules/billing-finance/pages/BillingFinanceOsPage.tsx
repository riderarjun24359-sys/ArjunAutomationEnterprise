"use client";

import { useState } from "react";
import { Card } from "@/src/design-os/components/primitives/Card";
import { Button } from "@/src/design-os/components/primitives/Button";
import { PageTransition } from "@/src/design-os/motion/components/PageTransition";
import { SkeletonLoader } from "@/src/design-os/motion/components/SkeletonLoader";
import { BILLING_FINANCE_OS_THEME } from "@/src/modules/billing-finance/constants/os";
import { useBillingFinanceOs } from "@/src/modules/billing-finance/hooks/useBillingFinanceOs";
import { AiFinanceAssistantPanel } from "@/src/modules/billing-finance/components/os/AiFinanceAssistantPanel";
import { InvoiceCenterPanel } from "@/src/modules/billing-finance/components/os/InvoiceCenterPanel";
import { PaymentCenterPanel } from "@/src/modules/billing-finance/components/os/PaymentCenterPanel";
import { RevenueDashboardPanel } from "@/src/modules/billing-finance/components/os/RevenueDashboardPanel";
import { SubscriptionManagementPanel } from "@/src/modules/billing-finance/components/os/SubscriptionManagementPanel";
import { EstimateCenterPanel } from "@/src/modules/billing-finance/components/os/EstimateCenterPanel";
import { ExpenseCenterPanel } from "@/src/modules/billing-finance/components/os/ExpenseCenterPanel";
import { TaxCenterPanel } from "@/src/modules/billing-finance/components/os/TaxCenterPanel";
import { RecurringCenterPanel } from "@/src/modules/billing-finance/components/os/RecurringCenterPanel";

function Skeleton() {
    return (
        <PageTransition className="mx-auto max-w-7xl space-y-6">
            <SkeletonLoader className="h-8 w-72" />
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i}><SkeletonLoader className="h-16 w-full" /></Card>
                ))}
            </div>
        </PageTransition>
    );
}

export function BillingFinanceOsPage() {
    const { snapshot, loading, error } = useBillingFinanceOs();
    const [activeView, setActiveView] = useState("pulse");

    if (loading) return <Skeleton />;
    if (error || !snapshot) return null;

    return (
        <PageTransition className="mx-auto max-w-7xl space-y-8 p-6">
            <header>
                <h1 className="text-3xl font-bold text-[var(--dos-text-primary)]">{BILLING_FINANCE_OS_THEME.title}</h1>
                <p className="text-[var(--dos-text-secondary)]">{BILLING_FINANCE_OS_THEME.subtitle}</p>
            </header>

            {/* Financial Pulse */}
            <section>
                <div className="grid gap-4 sm:grid-cols-4">
                    <Card variant="base">
                        <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]">MRR</p>
                        <p className="mt-1 text-2xl font-bold">${Math.round(snapshot.stats.mrrUsd).toLocaleString()}</p>
                    </Card>
                    <Card variant="base">
                        <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]">ARR</p>
                        <p className="mt-1 text-2xl font-bold">${Math.round(snapshot.stats.arrUsd).toLocaleString()}</p>
                    </Card>
                    <Card variant="base">
                        <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]">Collected</p>
                        <p className="mt-1 text-2xl font-bold text-[var(--dos-tint-success)]">${Math.round(snapshot.stats.collectedUsd).toLocaleString()}</p>
                    </Card>
                    <Card variant="insight">
                        <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]">Outstanding</p>
                        <p className="mt-1 text-2xl font-bold text-[var(--dos-brand-primary)]">${Math.round(snapshot.stats.outstandingUsd).toLocaleString()}</p>
                    </Card>
                </div>
            </section>

            {/* Exception Field & Context */}
            <section className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2">
                    <h2 className="mb-4 text-lg font-semibold text-[var(--dos-text-primary)]">Exception Field</h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Card variant="base" className="border-[var(--dos-tint-critical)]/30">
                            <p className="text-sm font-medium text-[var(--dos-tint-critical)]">Overdue Invoices</p>
                            <p className="mt-1 text-3xl font-bold">{snapshot.stats.openInvoices}</p>
                        </Card>
                        <Card variant="base" className="border-[var(--dos-tint-warning)]/30">
                            <p className="text-sm font-medium text-[var(--dos-tint-warning)]">Failed Payments</p>
                            <p className="mt-1 text-3xl font-bold">{snapshot.stats.failedPayments}</p>
                        </Card>
                    </div>
                </div>
                <div>
                    <h2 className="mb-4 text-lg font-semibold text-[var(--dos-text-primary)]">Financial Context</h2>
                    <Card variant="base">
                        <p className="text-sm font-medium text-[var(--dos-text-tertiary)]">Top Accounts (MRR)</p>
                        <ul className="mt-4 space-y-2">
                            {snapshot.revenue.topAccounts.slice(0, 5).map((acc) => (
                                <li key={acc.name} className="flex justify-between text-sm">
                                    <span className="truncate text-[var(--dos-text-secondary)]">{acc.name}</span>
                                    <span className="font-semibold">${Math.round(acc.mrrUsd).toLocaleString()}</span>
                                </li>
                            ))}
                        </ul>
                    </Card>
                </div>
            </section>

            {/* Operational workspace selection */}
            <nav className="flex flex-wrap gap-2">
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
                {activeView === "invoices" && <InvoiceCenterPanel items={snapshot.invoices} />}
                {activeView === "payments" && <PaymentCenterPanel items={snapshot.payments} />}
                {activeView === "subs" && <SubscriptionManagementPanel items={snapshot.subscriptions} />}
                {activeView === "estimates" && <EstimateCenterPanel estimates={snapshot.estimates || []} clients={[]} projects={[]} onCreate={() => {}} />}
                {activeView === "expenses" && <ExpenseCenterPanel expenses={snapshot.expenses || []} clients={[]} projects={[]} onCreate={() => {}} />}
                {activeView === "tax" && <TaxCenterPanel taxRates={[]} onSubmit={() => {}} />}
                {activeView === "recurring" && <RecurringCenterPanel clients={[]} projects={[]} recurringInvoices={[]} onCreate={() => {}} />}
                {activeView === "assistant" && <AiFinanceAssistantPanel assistant={snapshot.assistant} />}
            </main>
        </PageTransition>
    );
}
