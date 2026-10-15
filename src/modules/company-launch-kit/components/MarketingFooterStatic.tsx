import Link from "next/link";
import { Mail } from "lucide-react";
import { BrandLogo } from "@/src/modules/brand-os/components/BrandLogo";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";

const FOOTER_LINKS = {
    company: [
        { label: "About", href: MARKETING_ROUTES.about },
        { label: "Pricing", href: MARKETING_ROUTES.pricing },
        { label: "Careers", href: MARKETING_ROUTES.careers },
        { label: "Contact", href: MARKETING_ROUTES.contact },
    ],
    solutions: [
        { label: "Services", href: MARKETING_ROUTES.services },
        { label: "Industries", href: MARKETING_ROUTES.industries },
        { label: "Portfolio", href: MARKETING_ROUTES.portfolio },
        { label: "Case Studies", href: MARKETING_ROUTES.caseStudies },
    ],
    resources: [
        { label: "Resources Hub", href: MARKETING_ROUTES.resources },
        { label: "Blog", href: MARKETING_ROUTES.blog },
        { label: "FAQ", href: MARKETING_ROUTES.faq },
        { label: "Sitemap", href: MARKETING_ROUTES.sitemap },
    ],
    legal: [
        { label: "Privacy Policy", href: MARKETING_ROUTES.privacy },
        { label: "Terms", href: MARKETING_ROUTES.terms },
        { label: "Cookies", href: MARKETING_ROUTES.cookies },
    ],
};

const LINK_CLASS =
    "inline-block rounded py-1 text-[var(--premium-fg-muted)] transition-colors hover:text-[var(--premium-fg)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dos-border-focus)]";

/** Arjun Automation — Premium Cinematic Footer */
export function MarketingFooterStatic() {
    const year = new Date().getFullYear();

    return (
        <footer className="relative border-t border-[var(--premium-border)] bg-[var(--premium-bg-secondary)] text-[var(--premium-fg-muted)]">
            {/* Technical grid underlay */}
            <div className="absolute inset-0 premium-grid-bg pointer-events-none" aria-hidden="true" />

            {/* Angular divider accent line */}
            <div className="premium-divider" aria-hidden="true" />

            <div className="premium-container relative py-14 sm:py-16">
                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
                    <div className="lg:col-span-4">
                        <BrandLogo variant="inverse" className="h-8" />
                        <p className="mt-5 max-w-sm text-sm leading-relaxed text-[var(--premium-fg-muted)]">
                            Expert engineering for growing organizations — a unified platform, AI-native workflows, and
                            delivery you can measure.
                        </p>
                        <a
                            href="mailto:sales@arjunautomations.com"
                            className={`mt-5 inline-flex items-center gap-2 text-sm font-medium text-[var(--premium-fg-muted)] ${LINK_CLASS}`}
                        >
                            <Mail className="h-4 w-4" aria-hidden="true" />
                            sales@arjunautomations.com
                        </a>
                    </div>

                    {(
                        [
                            ["Company", FOOTER_LINKS.company],
                            ["Solutions", FOOTER_LINKS.solutions],
                            ["Resources", FOOTER_LINKS.resources],
                            ["Legal", FOOTER_LINKS.legal],
                        ] as const
                    ).map(([title, links]) => (
                        <nav key={title} className="lg:col-span-2" aria-label={`Footer — ${title}`}>
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--premium-accent)]">{title}</h3>
                            <ul className="mt-4 space-y-2.5 text-sm">
                                {links.map((link) => (
                                    <li key={link.href}>
                                        <Link href={link.href} className={LINK_CLASS}>
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    ))}
                </div>

                <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[var(--premium-border)] pt-8 text-sm sm:flex-row">
                    <p className="text-[var(--premium-fg-muted)]">© {year} Arjun Automation. All rights reserved.</p>
                    <p className="text-[var(--premium-fg-muted)]">Built by Arjun Automation.</p>
                </div>
            </div>
        </footer>
    );
}