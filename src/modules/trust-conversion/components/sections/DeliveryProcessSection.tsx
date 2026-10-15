import { SectionHeader } from "@/src/modules/trust-conversion/components/ui/SectionHeader";
import { DELIVERY_PROCESS_CONTENT } from "@/src/modules/trust-conversion/data/trust-conversion-content";

export function DeliveryProcessSection() {
    const { title, subtitle, steps } = DELIVERY_PROCESS_CONTENT;

    return (
        <section className="premium-section" aria-labelledby="delivery-process-heading">
            <div className="premium-container">
                <SectionHeader id="delivery-process-heading" title={title} subtitle={subtitle} />

                {/* Desktop timeline */}
                <ol className="tc-reveal tc-reveal-delay-1 mt-14 hidden gap-x-3 gap-y-8 lg:grid lg:grid-cols-9">
                    {steps.map((step) => (
                        <li key={step.title} className="relative text-center">
                            <span
                                className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[var(--dos-brand-accent)] text-sm font-bold text-white shadow-[var(--dos-shadow-md)] ring-4 ring-[var(--premium-bg)]"
                                aria-hidden="true"
                            >
                                {step.step}
                            </span>
                            {step.step < steps.length ? (
                                <span
                                    className="absolute left-[calc(50%+1.5rem)] top-5 h-px w-[calc(100%-3rem)] bg-[var(--dos-border-strong)]"
                                    aria-hidden="true"
                                />
                            ) : null}
                            <h3 className="mt-3 text-sm font-semibold text-[var(--dos-text-primary)]">{step.title}</h3>
                            <p className="mt-1 text-xs leading-snug text-[var(--dos-text-secondary)]">
                                {step.description}
                            </p>
                        </li>
                    ))}
                </ol>

                {/* Mobile / tablet timeline */}
                <div className="relative mt-12 lg:hidden">
                    <span className="tc-timeline-line" aria-hidden="true" />
                    <ol className="space-y-6">
                        {steps.map((step) => (
                            <li key={step.title} className="relative flex gap-4 pl-2">
                                <span className="tc-step-dot" aria-hidden="true">
                                    {step.step}
                                </span>
                                <article className="tc-card min-w-0 flex-1 p-4">
                                    <h3 className="font-semibold text-[var(--dos-text-primary)]">{step.title}</h3>
                                    <p className="mt-1 text-sm leading-relaxed text-[var(--dos-text-secondary)]">
                                        {step.description}
                                    </p>
                                </article>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        </section>
    );
}
