"use client";

import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import type { DepartmentItem } from "../../types/os";

export function DepartmentsPanel({ items }: { items: DepartmentItem[] }) {
    if (items.length === 0) {
        return <EmptyState title="No departments" description="Departments load from live Supabase department records." />;
    }
    return (
        <div className="grid gap-3 lg:grid-cols-2">
            {items.map((item) => (
                <Card key={item.id}>
                    <p className="font-semibold text-[var(--dos-text-primary)]">{item.name}</p>
                    <p className="mt-1 text-xs text-[var(--dos-text-tertiary)]">{item.code}</p>
                    <p className="mt-2 text-sm text-[var(--dos-text-secondary)]">{item.description || "No description"}</p>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-[var(--dos-text-secondary)]">
                        <span>Head {item.headName ?? "—"}</span>
                        <span>{item.employeeCount} employees</span>
                        <span className="col-span-2">Parent {item.parentName ?? "—"}</span>
                    </div>
                </Card>
            ))}
        </div>
    );
}
