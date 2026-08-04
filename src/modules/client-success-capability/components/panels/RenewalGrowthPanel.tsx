"use client";

import { Card } from "@/src/design-os/components/Card";
import { Badge } from "@/src/design-os/components/Badge";
import { SimpleTable } from "../shared/SimpleTable";
import { KpiCard } from "@/src/design-os/dashboard/KpiCard";
import { useClientSuccessCapability } from "../../hooks/useClientSuccessCapability";

export function RenewalGrowthPanel() {
    const { renewal } = useClientSuccessCapability();

    if (!renewal) {
        return <Card><p className="text-[var(--dos-text-secondary)]">Select a client to view renewal and growth.</p></Card>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-[var(--dos-text-primary)]">Renewal & Growth</h2>
                <p className="text-sm text-[var(--dos-text-secondary)]">Renewals, upsell, cross-sell, referrals, and testimonials.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-4">
                <KpiCard title="Renewals" value={renewal.renewals.length} />
                <KpiCard title="Upsell Opps" value={renewal.upsell.length} />
                <KpiCard title="Cross-sell" value={renewal.crossSell.length} />
                <KpiCard title="Referrals" value={renewal.referrals.length} />
            </div>

            <Card>
                <h3 className="mb-3 font-semibold">Renewals</h3>
                <SimpleTable
                    headers={["Contract End", "Value", "Probability"]}
                    rows={renewal.renewals.map((r) => [r.contractEnd, `$${r.value.toLocaleString()}`, `${r.probability}%`])}
                />
            </Card>

            <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                    <h3 className="mb-3 font-semibold">Upsell Opportunities</h3>
                    {renewal.upsell.map((u) => (
                        <div key={u.id} className="mb-2 flex justify-between">
                            <span>{u.opportunity}</span>
                            <Badge variant="info">{u.stage}</Badge>
                        </div>
                    ))}
                </Card>
                <Card>
                    <h3 className="mb-3 font-semibold">Testimonials</h3>
                    {renewal.testimonials.map((t) => (
                        <blockquote key={t.id} className="mb-3 border-l-2 border-emerald-500 pl-3">
                            <p className="text-sm italic">&ldquo;{t.quote}&rdquo;</p>
                            <p className="text-xs text-[var(--dos-text-secondary)]">— {t.author} {t.published ? "(Published)" : "(Draft)"}</p>
                        </blockquote>
                    ))}
                </Card>
            </div>
        </div>
    );
}
