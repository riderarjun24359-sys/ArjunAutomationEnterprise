import { SectionHeader } from "@/src/modules/trust-conversion/components/ui/SectionHeader";
import { DELIVERY_PROCESS_CONTENT } from "@/src/modules/trust-conversion/data/trust-conversion-content";

/**
 * Nine-stage delivery process.
 *
 * PERFORMANCE NOTE
 * ----------------
 * This previously rendered the whole `steps` array twice — once inside a
 * `hidden ... lg:grid` desktop timeline and again inside an `lg:hidden` mobile
 * timeline. Both copies shipped in the HTML payload on every request, so mobile
 * visitors downloaded the desktop markup (including nine connector <span>s and
 * nine <h3>s) only for it to be hidden by CSS. That roughly doubled the
 * homepage payload.
 *
 * It now renders a single <ol> and uses CSS to reflow it: one column on mobile,
 * nine across from the `lg` breakpoint. Same visual result, half the markup, and
 * one set of headings for search engines and screen readers.
 */
export function DeliveryProcessSection() {
    const { title, subtitle, steps } = DELIVERY_PROCESS_CONTENT;

    return (
        <section className="premium-section" aria-labelledby="delivery-process-heading">
            <div className="premium-container">
                <SectionHeader id="delivery-process-heading" title={title} subtitle={subtitle} />

                <ol className="tc-reveal tc-reveal-delay-1 mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-9 lg:gap-3">
                    {steps.map((step) => (
                        <li key={step.title} className="relative text-center">
                            <span
                                className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[var(--dos-brand-accent)] text-sm font-bold text-white shadow-[var(--dos-shadow-md)] ring-4 ring-[var(--premium-bg)]"
                                aria-hidden="true"
                            >
                                {step.step}
                            </span>
                            {/* Connector line — decorative, and only meaningful in the
                                desktop grid, so it is hidden below `lg`. */}
                            {step.step < steps.length ? (
                                <span
                                    className="absolute left-[calc(50%+1.5rem)] top-5 hidden h-px w-[calc(100%-3rem)] bg-[var(--dos-border-strong)] lg:block"
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
            </div>
        </section>
    );
}
