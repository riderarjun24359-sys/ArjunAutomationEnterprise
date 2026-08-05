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
                <div className="tc-reveal mx-auto max-w-3xl text-center">
                    <h2 id="why-arjun-heading" className="font-display text-3xl font-bold sm:text-4xl">
                        {title}
                    </h2>
                    <p className="mt-3 text-[var(--premium-fg-muted)]">{subtitle}</p>
                </div>

                <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {cards.map((card, index) => {
                        const Icon = ICONS[card.icon] ?? Award;
                        const delayClass = index % 4 === 0 ? "" : `tc-reveal-delay-${Math.min(index % 4, 4)}`;
                        return (
                            <li key={card.title} className={`tc-reveal ${delayClass}`.trim()}>
                                <article className="tc-card h-full p-6 focus-within:ring-2 focus-within:ring-indigo-500/40">
                                    <Icon className="h-7 w-7 text-indigo-700" aria-hidden="true" />
                                    <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-indigo-800">
                                        {card.outcome}
                                    </p>
                                    <h3 className="mt-2 text-lg font-semibold text-slate-900">{card.title}</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{card.description}</p>
                                </article>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </section>
    );
}
