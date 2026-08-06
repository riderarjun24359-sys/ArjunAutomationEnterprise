"use client";

import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import type { CustomerHealthMetric } from "../../types/os";

export function CustomerHealthCenterPanel({ items }: { items: CustomerHealthMetric[] }) {
    if (items.length === 0) {
        return <EmptyState title="No health data" description="Customer health metrics appear when clients and CS scores exist in Supabase." />;
    }

    return (
        <div className="grid gap-3 lg:grid-cols-2">
            {items.map((item) => (
                <Card key={item.clientId}>
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <p className="font-semibold text-[var(--dos-text-primary)]">{item.clientName}</p>
                            <p className="mt-1 text-xs text-[var(--dos-text-tertiary)]">Last activity · {item.lastActivityRelative}</p>
                        </div>
                        <Badge variant={item.overallHealthScore >= 80 ? "success" : item.overallHealthScore >= 60 ? "warning" : "error"}>
                            Health {item.overallHealthScore}
                        </Badge>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-[var(--dos-text-secondary)] sm:grid-cols-3">
                        <span>Adoption {item.productAdoption}</span>
                        <span>Login {item.loginActivityScore}</span>
                        <span>Delivery {item.projectDeliveryHealth}</span>
                        <span>Support {item.supportHealth}</span>
                        <span>Billing {item.billingHealth}</span>
                        <span>Trend {item.usageTrend}</span>
                    </div>
                    <p className="mt-3 text-sm text-[var(--dos-text-secondary)]">{item.executiveSummary}</p>
                </Card>
            ))}
        </div>
    );
}
