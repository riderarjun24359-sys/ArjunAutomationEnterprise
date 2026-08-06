"use client";

import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import type { PayrollItem } from "../../types/os";

export function PayrollPanel({ items }: { items: PayrollItem[] }) {
    if (items.length === 0) {
        return <EmptyState title="No payroll entries" description="Payroll loads from live payroll cycles and entries in Supabase." />;
    }
    return (
        <div className="grid gap-3 lg:grid-cols-2">
            {items.map((item) => (
                <Card key={item.id}>
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <p className="font-semibold text-[var(--dos-text-primary)]">{item.employeeName}</p>
                            <p className="mt-1 text-xs text-[var(--dos-text-tertiary)]">{item.cycleName}</p>
                        </div>
                        <Badge variant={item.status.toLowerCase() === "paid" ? "success" : "warning"}>{item.status}</Badge>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-[var(--dos-text-secondary)]">
                        <span>Base ${item.baseSalary.toLocaleString()}</span>
                        <span>Net ${item.netPay.toLocaleString()}</span>
                        <span>Allow ${item.allowances.toLocaleString()}</span>
                        <span>Deduct ${item.deductions.toLocaleString()}</span>
                        <span className="col-span-2">{item.periodStart} → {item.periodEnd}</span>
                    </div>
                </Card>
            ))}
        </div>
    );
}
