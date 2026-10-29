import Link from "next/link";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";

export interface CtaSectionProps {
    title?: string;
    description?: string;
    primaryLabel?: string;
    primaryHref?: string;
    secondaryLabel?: string;
    secondaryHref?: string;
}

export function CtaSection({
    title = "Ready for AI-first enterprise automation?",
    description = "Start with AI Requirement Analysis. We will map your automation goals to a delivery roadmap after technical assessment.",
    primaryLabel = "Contact Us",
    primaryHref = MARKETING_ROUTES.contact,
    secondaryLabel = "View Portfolio",
    secondaryHref = MARKETING_ROUTES.portfolio,
}: CtaSectionProps) {
    return (
        <section className="premium-cta-panel" aria-labelledby="cta-heading">
            <div className="premium-cta-grid" aria-hidden="true" />
            <div className="mx-auto max-w-7xl px-6 relative text-center lg:px-8 py-16">
                <h2 id="cta-heading" className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                    {title}
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--premium-fg-muted)]">{description}</p>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                    <Link
                        href={primaryHref}
                        className="inline-flex items-center justify-center rounded-lg bg-[var(--dos-brand-primary)] px-6 py-3 font-medium text-white transition hover:bg-[var(--dos-brand-primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--dos-brand-primary)]/50"
                    >
                        {primaryLabel}
                    </Link>
                    <Link
                        href={secondaryHref}
                        className="inline-flex items-center justify-center rounded-lg border border-white/25 px-6 py-3 font-medium text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/60"
                    >
                        {secondaryLabel}
                    </Link>
                </div>
            </div>
        </section>
    );
}