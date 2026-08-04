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
        <section className="bg-indigo-700 py-16 text-white" aria-labelledby="cta-heading">
            <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
                <h2 id="cta-heading" className="text-3xl font-semibold tracking-tight sm:text-4xl">
                    {title}
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-lg text-indigo-100">{description}</p>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                    <Link
                        href={primaryHref}
                        className="rounded-lg bg-white px-6 py-3 font-medium text-indigo-700 transition hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-white/50"
                    >
                        {primaryLabel}
                    </Link>
                    <Link
                        href={secondaryHref}
                        className="rounded-lg border border-white/30 px-6 py-3 font-medium text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50"
                    >
                        {secondaryLabel}
                    </Link>
                </div>
            </div>
        </section>
    );
}
