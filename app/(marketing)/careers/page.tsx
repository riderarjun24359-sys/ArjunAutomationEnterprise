import type { Metadata } from "next";
import Link from "next/link";
import { CtaSection } from "@/src/modules/company-launch-kit/components/CtaSection";
import { PremiumPageShell } from "@/src/modules/company-launch-kit/components/premium/PremiumPageShell";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";
import { buildMetadata } from "@/src/lib/seo";

export const metadata: Metadata = buildMetadata({
    title: "Careers",
    description: "Join Arjun Automation — build enterprise automation, AI workers, and industry OS packs that transform how organizations operate.",
    path: "/careers",
});

/**
 * No open positions are listed right now.
 *
 * An earlier version showed four generic template roles (Senior Platform
 * Engineer, Solution Architect, Customer Success Manager, Technical Writer)
 * that were placeholders rather than real, currently-open reqs. Listing roles
 * we are not actually hiring for misleads candidates, so the section now
 * states honestly that there are no open positions and points visitors to the
 * general contact path instead. When a genuine opening exists, add it back as
 * data and render it from that list.
 */
const openings: Array<{
    title: string;
    location: string;
    type: string;
    description: string;
}> = [];

export default function CareersPage() {
    return (
        <PremiumPageShell
            title="Careers"
            description="Join a team building the enterprise operating system for the next generation of organizations."
        >
            <section className="space-y-10">
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold text-[var(--premium-fg)]">Why Arjun Automation</h2>
                    <p className="text-lg text-[var(--premium-fg-muted)] leading-relaxed">
                        We are builders, operators, and partners — not just vendors. Our team works on meaningful enterprise automation challenges across restaurants, healthcare, education, retail, and professional services. You will ship production features used by real organizations, not slide decks.
                    </p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold text-[var(--premium-fg)]">Open Positions</h2>
                    {openings.length > 0 ? (
                        <div className="mt-6 space-y-4">
                            {openings.map((job) => (
                                <article key={job.title} className="rounded-xl border border-[var(--dos-border)] p-6">
                                    <h3 className="text-lg font-semibold text-[var(--premium-fg)]">
                                        {job.title}
                                    </h3>
                                    <p className="mt-1 text-sm text-[var(--premium-fg-muted)]">
                                        {job.location} · {job.type}
                                    </p>
                                    <p className="mt-3 text-sm text-[var(--premium-fg-muted)]">
                                        {job.description}
                                    </p>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="mt-6 rounded-xl border border-[var(--dos-border)] p-6 bg-[var(--dos-surface-secondary)]">
                            <p className="text-[var(--premium-fg-muted)] leading-relaxed">
                                We don&rsquo;t have any open positions at the moment. Please check back later — we post
                                here as soon as a role opens up.
                            </p>
                        </div>
                    )}
                    <p className="mt-6 text-sm text-[var(--premium-fg-muted)]">
                        Think you&rsquo;d add something exceptional to the team even without an open role? Introduce
                        yourself at{" "}
                        <a
                            href="mailto:careers@arjunautomations.com"
                            className="text-[var(--dos-brand-primary)] hover:text-[var(--dos-brand-primary-hover)] underline"
                        >
                            careers@arjunautomations.com
                        </a>{" "}
                        or{" "}
                        <Link
                            href={MARKETING_ROUTES.contact}
                            className="text-[var(--dos-brand-primary)] hover:text-[var(--dos-brand-primary-hover)] underline"
                        >
                            contact us
                        </Link>
                        .
                    </p>
                </div>
            </section>

            <CtaSection
                title="Build with us"
                description="Even if you do not see a matching role, we welcome exceptional talent. Reach out and tell us what you would build."
                primaryLabel="Get in Touch"
            />
        </PremiumPageShell>
    );
}
