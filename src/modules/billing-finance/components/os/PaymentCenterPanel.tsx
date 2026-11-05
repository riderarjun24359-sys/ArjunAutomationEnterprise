"use client";

import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import type { PaymentCenterItem } from "../../types/os";

const formatInr = (amount: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(amount);

export function PaymentCenterPanel({ items }: { items: PaymentCenterItem[] }) {
    if (items.length === 0) {
        return <EmptyState title="No payments" description="Payment Center loads BRV payment attempts and finance payments from Supabase." />;
    }

    return (
        <div className="grid gap-3 lg:grid-cols-2">
            {items.map((item) => (
                <Card key={`${item.source}-${item.id}`}>
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <p className="font-semibold text-[var(--dos-text-primary)]">{item.accountOrClient}</p>
                            <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                                {item.currency === "INR" ? formatInr(item.amountUsd) : "Amount hidden until INR normalization"}
                            </p>
                        </div>
                        <Badge variant={["paid", "succeeded", "success", "completed", "captured"].includes(item.status.toLowerCase()) ? "success" : ["failed", "declined", "error"].includes(item.status.toLowerCase()) ? "error" : "warning"}>{item.status}</Badge>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-[var(--dos-text-secondary)]">
                        <span>Method {item.method}</span>
                        <span>Ref {item.reference}</span>
                        <span>Source {item.source}</span>
                        <span>{new Date(item.attemptedAt).toLocaleString()}</span>
                        {item.failureReason ? <span className="col-span-2">Failure · {item.failureReason}</span> : null}
                    </div>
                </Card>
            ))}
        </div>
    );
}
