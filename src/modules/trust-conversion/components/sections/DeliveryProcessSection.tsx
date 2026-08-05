import { DELIVERY_PROCESS_CONTENT } from "@/src/modules/trust-conversion/data/trust-conversion-content";

export function DeliveryProcessSection() {
    const { title, subtitle, steps } = DELIVERY_PROCESS_CONTENT;

    return (
        <section className="premium-section" aria-labelledby="delivery-process-heading">
            <div className="premium-container">
                <div className="tc-reveal mx-auto max-w-3xl text-center">
                    <h2 id="delivery-process-heading" className="font-display text-3xl font-bold sm:text-4xl">
                        {title}
                    </h2>
                    <p className="mt-3 text-[var(--premium-fg-muted)]">{subtitle}</p>
                </div>

                {/* Desktop timeline */}
                <ol className="tc-reveal tc-reveal-delay-1 mt-14 hidden lg:grid lg:grid-cols-9 lg:gap-3">
                    {steps.map((step) => (
                        <li key={step.title} className="relative text-center">
                            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-indigo-700 text-sm font-bold text-white">
                                {step.step}
                            </div>
                            {step.step < steps.length ? (
                                <div
                                    className="absolute left-[calc(50%+1.25rem)] top-5 h-0.5 w-[calc(100%-2.5rem)] bg-indigo-200"
                                    aria-hidden="true"
                                />
                            ) : null}
                            <h3 className="mt-3 text-sm font-semibold text-slate-900">{step.title}</h3>
                            <p className="mt-1 text-xs leading-relaxed text-slate-600">{step.description}</p>
                        </li>
                    ))}
                </ol>

                {/* Mobile / tablet cards */}
                <ol className="relative mt-12 space-y-6 lg:hidden">
                    <div className="tc-timeline-line" aria-hidden="true" />
                    {steps.map((step) => (
                        <li key={step.title} className="relative flex gap-4 pl-2">
                            <div className="tc-step-dot" aria-hidden="true">
                                {step.step}
                            </div>
                            <article className="tc-card min-w-0 flex-1 p-4">
                                <h3 className="font-semibold text-slate-900">{step.title}</h3>
                                <p className="mt-1 text-sm leading-relaxed text-slate-600">{step.description}</p>
                            </article>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
}
