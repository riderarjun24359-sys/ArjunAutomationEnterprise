"use client";

import { TRUSTED_BY_CONTENT } from "@/src/modules/trust-conversion/data/trust-conversion-content";
import { TrustCounter } from "@/src/modules/trust-conversion/components/ui/TrustCounter";

export function TrustCountersBlock() {
    return (
        <div
            className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8"
            role="region"
            aria-label="Trust statistics"
        >
            {TRUSTED_BY_CONTENT.counters.map((counter) => (
                <div key={counter.label} className="text-center sm:text-left">
                    <p className="font-display text-3xl font-bold tabular-nums text-slate-900 sm:text-4xl">
                        <TrustCounter value={counter.value} suffix={counter.suffix} />
                    </p>
                    <p className="mt-1.5 text-sm text-slate-700">{counter.label}</p>
                </div>
            ))}
        </div>
    );
}
