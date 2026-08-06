"use client";

import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import type { ExpansionCenterItem } from "../../types/os";

export function ExpansionCenterPanel({ items }: { items: ExpansionCenterItem[] }) {
    if (items.length === 0) {
        return <EmptyState title="No expansion opportunities" description="Upsell, cross-sell, and adoption gaps from live CS data appear here." />;
    }

    return (
        <div className="grid gap-3 lg:grid-cols-2">
            {items.map((item) => (
                <Card key={item.id}>
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <p className="font-semibold text-[var(--dos-text-primary)]">{item.title}</p>
                            <p className="mt-1 text-xs text-[var(--dos-text-tertiary)]">{item.clientName}</p>
                        </div>
                        <Badge variant="info">{item.kind}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-[var(--dos-text-secondary)]">
                        Value ${Math.round(item.expansionValueUsd).toLocaleString()} · Score {item.opportunityScore}
                    </p>
                    <p className="mt-1 text-xs text-[var(--dos-text-tertiary)]">
                        Gaps: {item.productAdoptionGaps.join(" · ") || "None listed"}
                    </p>
                </Card>
            ))}
        </div>
    );
}
