"use client";

import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import type { SubscriptionManagementItem } from "../../types/os";

export function SubscriptionManagementPanel({ items }: { items: SubscriptionManagementItem[] }) {
    if (items.length === 0) {
        return (
            <EmptyState
                title="No subscriptions"
                description="Subscription management populates from live brv_subscription_billings in Supabase."
            />
        );
    }

    return (
        <div className="grid gap-3 lg:grid-cols-2">
            {items.map((item) => (
                <Card key={item.id}>
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <p className="font-semibold text-[var(--dos-text-primary)]">{item.accountName}</p>
                            <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">{item.planName}</p>
                        </div>
                        <Badge variant={item.status.toLowerCase() === "active" ? "success" : "warning"}>{item.status}</Badge>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-[var(--dos-text-secondary)] sm:grid-cols-3">
                        <span>Cycle {item.billingCycle}</span>
                        <span>MRR ${item.mrrUsd.toLocaleString()}</span>
                        <span>ARR ${item.arrUsd.toLocaleString()}</span>
                        <span>Qty {item.quantity}</span>
                        <span>Payment {item.paymentStatus}</span>
                        <span>
                            Renews{" "}
                            {item.daysToRenewal === null
                                ? "—"
                                : item.daysToRenewal < 0
                                  ? `${Math.abs(item.daysToRenewal)}d overdue`
                                  : `${item.daysToRenewal}d`}
                        </span>
                    </div>
                </Card>
            ))}
        </div>
    );
}
