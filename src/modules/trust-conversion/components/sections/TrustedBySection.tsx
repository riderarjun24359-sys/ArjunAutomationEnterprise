import { ShieldCheck } from "lucide-react";
import { SectionHeader } from "@/src/modules/trust-conversion/components/ui/SectionHeader";
import { TRUSTED_BY_CONTENT } from "@/src/modules/trust-conversion/data/trust-conversion-content";

const CHIP =
    "inline-block rounded-full border border-[var(--premium-border)] bg-[var(--premium-bg-secondary)] px-3.5 py-1.5 text-sm text-[var(--dos-text-secondary)]";

export function TrustedBySection() {
    const { title, subtitle, clientLogos, industries, technologies, badges, counters } = TRUSTED_BY_CONTENT;

    return (
        <section className="premium-section border-t border-[var(--premium-border)]" aria-labelledby="trusted-by-heading">
            <div className="premium-container">
                <SectionHeader id="trusted-by-heading" title={title} subtitle={subtitle} />

                {/* Industries we build for */}
                <ul className="tc-reveal tc-reveal-delay-1 mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                    {clientLogos.map((logo) => (
                        <li key={logo.name} className="premium-card flex flex-col items-center gap-3 p-5 text-center">
                            <span className="premium-card-icon" aria-hidden="true">
                                {logo.initials}
                            </span>
                            <span className="text-sm font-semibold text-[var(--dos-text-primary)]">{logo.name}</span>
                        </li>
                    ))}
                </ul>

                {/* Industries + technologies detail */}
                <div className="tc-reveal tc-reveal-delay-2 mt-12 grid gap-6 lg:grid-cols-2">
                    <div className="premium-card p-6 sm:p-8">
                        <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--premium-accent)]">
                            Industries served
                        </h3>
                        <ul className="mt-5 flex flex-wrap gap-2">
                            {industries.map((item) => (
                                <li key={item}>
                                    <span className={CHIP}>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="premium-card p-6 sm:p-8">
                        <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--premium-accent)]">
                            Technologies mastered
                        </h3>
                        <ul className="mt-5 flex flex-wrap gap-2">
                            {technologies.map((item) => (
                                <li key={item}>
                                    <span className={CHIP}>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Security foundations */}
                <div className="tc-reveal tc-reveal-delay-3 mt-14">
                    <h3 className="text-center text-sm font-semibold uppercase tracking-[0.14em] text-[var(--premium-accent)]">
                        Built-in security &amp; governance
                    </h3>
                    <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {badges.map((badge) => (
                            <li key={badge.label}>
                                <article className="premium-card h-full p-5">
                                    <ShieldCheck
                                        className="h-6 w-6 text-[var(--dos-brand-primary)]"
                                        aria-hidden="true"
                                    />
                                    <h4 className="mt-3 font-semibold text-[var(--dos-text-primary)]">{badge.label}</h4>
                                    <p className="mt-1.5 text-sm leading-relaxed text-[var(--dos-text-secondary)]">
                                        {badge.description}
                                    </p>
                                </article>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Platform scale counters */}
                <ul
                    className="tc-reveal tc-reveal-delay-4 mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4"
                    aria-label="Platform statistics"
                >
                    {counters.map((counter) => (
                        <li
                            key={counter.label}
                            className="rounded-[var(--dos-radius-2xl)] border border-[var(--premium-border)] bg-[var(--premium-bg)] px-5 py-6 text-center"
                        >
                            <p className="font-display text-3xl font-bold tabular-nums text-[var(--dos-text-primary)] sm:text-4xl">
                                {counter.value.toLocaleString()}
                                {counter.suffix}
                            </p>
                            <p className="mt-1.5 text-sm text-[var(--premium-fg-muted)]">{counter.label}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
