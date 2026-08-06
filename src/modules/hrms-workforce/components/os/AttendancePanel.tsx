"use client";

import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import type { AttendanceItem } from "../../types/os";

export function AttendancePanel({ items }: { items: AttendanceItem[] }) {
    if (items.length === 0) {
        return <EmptyState title="No attendance records" description="Attendance loads from live attendance_records in Supabase." />;
    }
    return (
        <div className="grid gap-3 lg:grid-cols-2">
            {items.map((item) => (
                <Card key={item.id}>
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <p className="font-semibold text-[var(--dos-text-primary)]">{item.employeeName}</p>
                            <p className="mt-1 text-xs text-[var(--dos-text-tertiary)]">{item.workDate}</p>
                        </div>
                        <Badge variant={item.status.toLowerCase() === "present" ? "success" : "warning"}>{item.status}</Badge>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-[var(--dos-text-secondary)]">
                        <span>In {item.checkIn ? new Date(item.checkIn).toLocaleTimeString() : "—"}</span>
                        <span>Out {item.checkOut ? new Date(item.checkOut).toLocaleTimeString() : "—"}</span>
                        {item.notes ? <span className="col-span-2">{item.notes}</span> : null}
                    </div>
                </Card>
            ))}
        </div>
    );
}
