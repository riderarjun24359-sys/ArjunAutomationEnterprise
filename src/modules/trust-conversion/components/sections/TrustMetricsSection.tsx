import {
    Award,
    Expand,
    LifeBuoy,
    Lock,
    MessageSquare,
    Timer,
    type LucideIcon,
} from "lucide-react";
import { SectionHeader } from "@/src/modules/trust-conversion/components/ui/SectionHeader";
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
                <SectionHeader id="trust-metrics-heading" title={title} subtitle={subtitle} />

                <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {metrics.map((metric, index) => {
                        const Icon = ICONS[metric.icon] ?? Award;
                        const delayClass = index % 3 === 0 ? "" : `tc-reveal-delay-${Math.min(index % 3, 3)}`;
                        return (
                            <li key={metric.title} className={`tc-reveal ${delayClass}`.trim()}>
                                <article className="premium-card h-full p-6">
                                    <span className="premium-card-icon">
                                        <Icon className="h-6 w-6" aria-hidden="true" />
                                    </span>
                                    <h3 className="mt-4 text-lg font-semibold text-[var(--dos-text-primary)]">
                                        {metric.title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-[var(--dos-text-secondary)]">
                                        {metric.description}
                                    </p>
                                </article>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </section>
    );
}
