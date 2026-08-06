"use client";

import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import type { InvoiceCenterItem } from "../../types/os";

export function InvoiceCenterPanel({ items }: { items: InvoiceCenterItem[] }) {
    if (items.length === 0) {
        return (
            <EmptyState
                title="No invoices"
                description="Invoice Center loads BRV invoices and finance invoices from Supabase."
            />
        );
    }

    return (
        <div className="grid gap-3 lg:grid-cols-2">
            {items.map((item) => (
                <Card key={`${item.source}-${item.id}`}>
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <p className="font-semibold text-[var(--dos-text-primary)]">{item.number}</p>
                            <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">{item.accountOrClient}</p>
                        </div>
                        <Badge variant={item.amountDueUsd <= 0 ? "success" : (item.daysOverdue ?? 0) > 0 ? "error" : "warning"}>
                            {item.paymentStatus}
                        </Badge>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-[var(--dos-text-secondary)]">
                        <span>Total ${item.totalUsd.toLocaleString()}</span>
                        <span>Due ${item.amountDueUsd.toLocaleString()}</span>
                        <span>Paid ${item.amountPaidUsd.toLocaleString()}</span>
                        <span>Source {item.source}</span>
                        <span>Status {item.status}</span>
                        <span>
                            Overdue {item.daysOverdue === null ? "—" : `${item.daysOverdue}d`}
                        </span>
                        {item.projectName ? <span className="col-span-2">Project {item.projectName}</span> : null}
                    </div>
                </Card>
            ))}
        </div>
    );
}
