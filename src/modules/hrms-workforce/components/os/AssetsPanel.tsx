"use client";

import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import type { AssetManagementItem } from "../../types/os";

export function AssetsPanel({ items }: { items: AssetManagementItem[] }) {
    if (items.length === 0) {
        return <EmptyState title="No assets" description="Asset management loads from live assets in Supabase." />;
    }
    return (
        <div className="grid gap-3 lg:grid-cols-2">
            {items.map((item) => (
                <Card key={item.id}>
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <p className="font-semibold text-[var(--dos-text-primary)]">{item.name}</p>
                            <p className="mt-1 text-xs text-[var(--dos-text-tertiary)]">{item.assetTag}</p>
                        </div>
                        <Badge variant={item.employeeId ? "success" : "warning"}>{item.status}</Badge>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-[var(--dos-text-secondary)]">
                        <span>{item.category}</span>
                        <span>${item.purchaseCost.toLocaleString()}</span>
                        <span>Assignee {item.employeeName ?? "Unassigned"}</span>
                        <span>Project {item.projectName ?? "—"}</span>
                        <span className="col-span-2">Acquired {item.acquiredDate}</span>
                    </div>
                </Card>
            ))}
        </div>
    );
}
