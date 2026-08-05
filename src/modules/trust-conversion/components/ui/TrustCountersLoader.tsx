import dynamic from "next/dynamic";

/** Lazy client island — animated counters only, loaded after SSR paint. */
export const TrustCounters = dynamic(
    () => import("@/src/modules/trust-conversion/components/ui/TrustCountersBlock").then((m) => m.TrustCountersBlock),
    { loading: () => <TrustCountersFallback /> },
);

function TrustCountersFallback() {
    return (
        <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8" aria-hidden="true">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 rounded-lg bg-[var(--premium-bg-secondary)]" />
            ))}
        </div>
    );
}
