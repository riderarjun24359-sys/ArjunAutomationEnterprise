import {
    Award,
    Brain,
    Clock,
    Handshake,
    Headphones,
    Layers,
    Shield,
    TrendingUp,
    Zap,
    type LucideIcon,
} from "lucide-react";
import { SectionHeader } from "@/src/modules/trust-conversion/components/ui/SectionHeader";
import { WHY_ARJUN_CONTENT } from "@/src/modules/trust-conversion/data/trust-conversion-content";

const ICONS: Record<string, LucideIcon> = {
    trending: TrendingUp,
    clock: Clock,
    brain: Brain,
    layers: Layers,
    shield: Shield,
    zap: Zap,
    handshake: Handshake,
    headphones: Headphones,
};

export function WhyArjunSection() {
    const { title, subtitle, cards } = WHY_ARJUN_CONTENT;

    return (
        <section className="premium-section bg-[var(--premium-bg-secondary)]" aria-labelledby="why-arjun-heading">
            <div className="premium-container">
                <SectionHeader id="why-arjun-heading" title={title} subtitle={subtitle} />

                <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {cards.map((card, index) => {
                        const Icon = ICONS[card.icon] ?? Award;
                        const delayClass = index % 4 === 0 ? "" : `tc-reveal-delay-${Math.min(index % 4, 4)}`;
                        return (
                            <li key={card.title} className={`tc-reveal ${delayClass}`.trim()}>
                                <article className="premium-card h-full p-6">
                                    <span className="premium-card-icon">
                                        <Icon className="h-6 w-6" aria-hidden="true" />
                                    </span>
                                    <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--premium-accent)]">
                                        {card.outcome}
                                    </p>
                                    <h3 className="mt-2 text-lg font-semibold text-[var(--dos-text-primary)]">
                                        {card.title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-[var(--dos-text-secondary)]">
                                        {card.description}
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
