"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { SOFT_LAUNCH_PLANS, type SoftLaunchPlanId } from "@/src/modules/soft-launch/data/launch-assets";
import { Button } from "@/src/design-os/components/Button";
import { Card } from "@/src/design-os/components/Card";

export function UpgradeFlowPanel({ initialPlan = "professional" }: { initialPlan?: SoftLaunchPlanId }) {
    const [selected, setSelected] = useState<SoftLaunchPlanId>(initialPlan);
    const plan = useMemo(() => SOFT_LAUNCH_PLANS.find((p) => p.id === selected) ?? SOFT_LAUNCH_PLANS[2], [selected]);

    return (
        <div className="space-y-8">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {SOFT_LAUNCH_PLANS.map((item) => (
                    <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelected(item.id)}
                        className={`rounded-[var(--dos-radius-2xl)] border p-5 text-left transition ${
                            selected === item.id
                                ? "border-[var(--dos-brand-primary)] bg-[var(--dos-info-muted)] shadow-[var(--dos-elevation-2)]"
                                : "border-[var(--dos-border)] bg-[var(--dos-surface-elevated)]"
                        }`}
                    >
                        <p className="text-sm font-semibold text-[var(--dos-text-primary)]">{item.name}</p>
                        <p className="mt-2 text-2xl font-bold text-[var(--dos-text-primary)]">{item.priceLabel}</p>
                        <p className="mt-1 text-xs text-[var(--dos-text-tertiary)]">{item.billingNote}</p>
                    </button>
                ))}
            </div>

            <Card>
                <h2 className="text-xl font-semibold text-[var(--dos-text-primary)]">Upgrade to {plan.name}</h2>
                <p className="mt-2 text-sm text-[var(--dos-text-secondary)]">{plan.description}</p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {Object.entries(plan.limits).map(([key, value]) => (
                        <div key={key} className="rounded-[var(--dos-radius-lg)] border border-[var(--dos-border)] p-3">
                            <p className="text-xs uppercase tracking-wide text-[var(--dos-text-tertiary)]">{key}</p>
                            <p className="mt-1 text-sm font-semibold text-[var(--dos-text-primary)]">{value}</p>
                        </div>
                    ))}
                </div>
                <ul className="mt-6 space-y-2 text-sm text-[var(--dos-text-secondary)]">
                    {plan.features.map((feature) => (
                        <li key={feature}>• {feature}</li>
                    ))}
                </ul>
                <div className="mt-6">
                    <Link href={plan.cta.href}>
                        <Button>{plan.cta.label}</Button>
                    </Link>
                </div>
            </Card>
        </div>
    );
}
