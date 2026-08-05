import {
    Award,
    Expand,
    LifeBuoy,
    Lock,
    MessageSquare,
    Timer,
    type LucideIcon,
} from "lucide-react";
import { TRUST_METRICS_CONTENT } from "@/src/modules/trust-conversion/data/trust-conversion-content";

const ICONS: Record<string, LucideIcon> = {
    timer: Timer,
    award: Award,
    lock: Lock,
    expand: Expand,
    "life-buoy": LifeBuoy,
    messages: MessageSquare,
};

export function TrustMetricsSection() {
    const { title, subtitle, metrics } = TRUST_METRICS_CONTENT;

    return (
        <section className="premium-section" aria-labelledby="trust-metrics-heading">
            <div className="premium-container">
                <div className="tc-reveal mx-auto max-w-3xl text-center">
                    <h2 id="trust-metrics-heading" className="font-display text-3xl font-bold sm:text-4xl">
                        {title}
                    </h2>
                    <p className="mt-3 text-[var(--premium-fg-muted)]">{subtitle}</p>
                </div>

                <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {metrics.map((metric, index) => {
                        const Icon = ICONS[metric.icon] ?? Award;
                        const delayClass = index % 3 === 0 ? "" : `tc-reveal-delay-${Math.min(index % 3, 3)}`;
                        return (
                            <li key={metric.title} className={`tc-reveal ${delayClass}`.trim()}>
                                <article className="tc-card h-full p-6">
                                    <Icon className="h-7 w-7 text-indigo-700" aria-hidden="true" />
                                    <h3 className="mt-4 text-lg font-semibold text-slate-900">{metric.title}</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{metric.description}</p>
                                </article>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </section>
    );
}
