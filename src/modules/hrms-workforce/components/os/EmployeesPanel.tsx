"use client";

import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import type { EmployeeManagementItem } from "../../types/os";

export function EmployeesPanel({ items }: { items: EmployeeManagementItem[] }) {
    if (items.length === 0) {
        return <EmptyState title="No employees" description="Employee directory loads from live employees in Supabase." />;
    }
    return (
        <div className="grid gap-3 lg:grid-cols-2">
            {items.map((item) => (
                <Card key={item.id}>
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <p className="font-semibold text-[var(--dos-text-primary)]">{item.fullName}</p>
                            <p className="mt-1 text-xs text-[var(--dos-text-tertiary)]">
                                {item.employeeCode} · {item.email}
                            </p>
                        </div>
                        <Badge variant={item.status.toLowerCase() === "active" ? "success" : "warning"}>{item.status}</Badge>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-[var(--dos-text-secondary)]">
                        <span>{item.departmentName}</span>
                        <span>{item.designationTitle}</span>
                        <span>{item.employmentType}</span>
                        <span>Hired {item.hireDate}</span>
                        <span>Mgr {item.managerName ?? "—"}</span>
                        <span>Salary ${item.baseSalary.toLocaleString()}</span>
                    </div>
                </Card>
            ))}
        </div>
    );
}
