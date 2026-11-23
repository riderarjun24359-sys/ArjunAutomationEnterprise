"use client";

import { EmptyState } from "@/src/design-os/components/EmptyState";
import type { RevenueDashboardMetrics } from "../../types/os";

export function RevenueDashboardPanel({ revenue }: { revenue: RevenueDashboardMetrics }) {
    return (
        <EmptyState
            title="Revenue not verified"
            description={revenue.revenueVerified
                ? "Revenue display remains disabled until the verified INR ledger is implemented and independently reconciled."
                : "MRR, ARR and collections are unavailable until Razorpay settlements are reconciled to exact INR invoices and deals. Legacy USD snapshots and CRM estimates are excluded."}
        />
    );
}
