"use client";

import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import type { RenewalCenterItem } from "../../types/os";

export function RenewalCenterPanel({ items }: { items: RenewalCenterItem[] }) {
    if (items.length === 0) {
        return <EmptyState title="No renewals" description="Renewal plans from Supabase CS tables appear here." />;
    }

    return (
        <div className="grid gap-3 lg:grid-cols-2">
            {items.map((item) => (
                <Card key={item.id}>
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <p className="font-semibold text-[var(--dos-text-primary)]">{item.clientName}</p>
                            <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">{item.contractName}</p>
                        </div>
                        <Badge variant={item.aiRenewalRisk === "low" ? "success" : item.aiRenewalRisk === "medium" ? "warning" : "error"}>
                            {item.aiRenewalRisk}
                        </Badge>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-[var(--dos-text-secondary)]">
                        <span>Date {item.renewalDate ?? "—"}</span>
                        <span>Days {item.daysRemaining ?? "—"}</span>
                        <span>Probability {item.renewalProbability}%</span>
                        <span>Forecast ${Math.round(item.renewalForecastUsd).toLocaleString()}</span>
                    </div>
                </Card>
            ))}
        </div>
    );
}
