"use client";

import { EmptyState } from "@/src/design-os/components/EmptyState";
import type { FinanceExecutiveWidgets } from "@/src/modules/billing-finance/types/os";

export function FinanceExecutiveWidgetsPanel({ widgets }: { widgets: FinanceExecutiveWidgets | null }) {
    if (!widgets) {
        return (
            <EmptyState
                title="Finance widgets unavailable"
                description="Widgets load from the Billing & Finance OS snapshot."
            />
        );
    }

    return (
        <section className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--dos-text-secondary)]">Finance Executive Widgets</h2>
            <EmptyState
                title="Revenue not verified"
                description="Revenue and collection widgets remain disabled until Razorpay settlements are reconciled to exact INR invoices and deals and the verified INR ledger is implemented."
            />
        </section>
    );
}
