import { TRUSTED_BY_CONTENT } from "@/src/modules/trust-conversion/data/trust-conversion-content";

export function TrustedBySection() {
    const { title, subtitle, clientLogos, industries, technologies, badges, counters } = TRUSTED_BY_CONTENT;

    return (
        <section className="premium-section border-t border-[var(--premium-border)]" aria-labelledby="trusted-by-heading">
            <div className="premium-container">
                <div className="tc-reveal mx-auto max-w-3xl text-center">
                    <h2 id="trusted-by-heading" className="font-display text-3xl font-bold sm:text-4xl">
                        {title}
                    </h2>
                    <p className="mt-3 text-[var(--premium-fg-muted)]">{subtitle}</p>
                </div>

                <div className="tc-reveal tc-reveal-delay-1 mt-12" role="region" aria-label="Enterprise clients">
                    <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                        Trusted by
                    </p>
                    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                        {clientLogos.map((logo) => (
                            <li key={logo.name}>
                                <div
                                    className="tc-logo mx-auto h-16 w-full max-w-[9rem] text-sm"
                                    title={logo.name}
                                    aria-label={logo.name}
                                >
                                    {logo.initials}
                                </div>
                                <p className="mt-2 truncate text-center text-xs text-[var(--premium-fg-muted)]">{logo.name}</p>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="tc-reveal tc-reveal-delay-2 mt-14 grid gap-8 lg:grid-cols-2">
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-800">Industries served</h3>
                        <ul className="mt-4 flex flex-wrap gap-2">
                            {industries.map((item) => (
                                <li key={item}>
                                    <span className="inline-block rounded-lg border border-[var(--premium-border)] bg-[var(--premium-bg)] px-3 py-1.5 text-sm text-slate-700">
                                        {item}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-800">Technologies mastered</h3>
                        <ul className="mt-4 flex flex-wrap gap-2">
                            {technologies.map((item) => (
                                <li key={item}>
                                    <span className="inline-block rounded-lg border border-[var(--premium-border)] bg-[var(--premium-bg)] px-3 py-1.5 text-sm text-slate-700">
                                        {item}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="tc-reveal tc-reveal-delay-3 mt-12" role="region" aria-label="Security and quality badges">
                    <h3 className="text-center text-sm font-semibold uppercase tracking-wider text-indigo-800">
                        Security &amp; quality
                    </h3>
                    <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {badges.map((badge) => (
                            <li key={badge.label}>
                                <div className="tc-badge h-full">
                                    <p className="font-semibold text-slate-900">{badge.label}</p>
                                    <p className="mt-1 text-xs leading-relaxed text-slate-600">{badge.description}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div
                    className="tc-reveal tc-reveal-delay-4 mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8"
                    role="region"
                    aria-label="Trust statistics"
                >
                    {counters.map((counter) => (
                        <div key={counter.label} className="text-center sm:text-left">
                            <p className="tc-stat-value font-display text-3xl font-bold tabular-nums text-slate-900 sm:text-4xl">
                                {counter.value.toLocaleString()}
                                {counter.suffix}
                            </p>
                            <p className="mt-1.5 text-sm text-slate-700">{counter.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
