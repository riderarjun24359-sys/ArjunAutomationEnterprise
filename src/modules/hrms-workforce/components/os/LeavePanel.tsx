"use client";

import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import type { LeaveManagementItem } from "../../types/os";

export function LeavePanel({ items }: { items: LeaveManagementItem[] }) {
    if (items.length === 0) {
        return <EmptyState title="No leave requests" description="Leave management loads from live leave_requests in Supabase." />;
    }
    return (
        <div className="grid gap-3 lg:grid-cols-2">
            {items.map((item) => (
                <Card key={item.id}>
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <p className="font-semibold text-[var(--dos-text-primary)]">{item.employeeName}</p>
                            <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">{item.leaveType}</p>
                        </div>
                        <Badge variant={item.status.toLowerCase() === "approved" ? "success" : item.status.toLowerCase() === "pending" ? "warning" : "info"}>
                            {item.status}
                        </Badge>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-[var(--dos-text-secondary)]">
                        <span>{item.startDate} → {item.endDate}</span>
                        <span>{item.days} day(s)</span>
                        <span className="col-span-2">{item.reason || "No reason"}</span>
                    </div>
                </Card>
            ))}
        </div>
    );
}
