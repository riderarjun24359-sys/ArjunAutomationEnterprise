import Link from "next/link";
import { Phone } from "lucide-react";
import { BrandLogo } from "@/src/modules/brand-os/components/BrandLogo";
import { COMPANY_PROFILE, HAS_PHONE } from "@/src/config/company-profile";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";
import { NAV_ITEMS } from "@/src/modules/company-launch-kit/data/home-content";

/**
 * Curated desktop navigation. The full NAV_ITEMS list (10 links) does not fit
 * one row beside the logo and CTA at 1024px without clipping, so the desktop
 * bar surfaces the highest-intent destinations and the mobile menu keeps the
 * complete list. Both are rendered from the same source of truth.
 *
 * Portfolio, Features, Solutions, Blog and FAQ were previously absent from the
 * desktop bar even though every one of them was in the sitemap — they were only
 * reachable from the footer, which buried pages that were meant to rank.
 */
const DESKTOP_NAV_LABELS = ["About", "Services", "Industries", "Case Studies", "Portfolio", "Pricing", "Resources"];

/**
 * `whitespace-nowrap` is load-bearing.
 *
 * Every header control previously wrapped onto two lines at desktop widths:
 * "Case Studies" broke across lines, the phone number split mid-number, and
 * "Book Free Consultation" stacked. The bar was being asked to fit a 7-item
 * nav plus a phone number plus a CTA into 1024–1440px, and every one of those
 * elements was free to wrap. Locking them to a single line keeps the bar on one
 * row; the nav itself sheds items below `xl` so there is always room.
 */
const NAV_LINK =
    "relative whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-[var(--dos-text-secondary)] transition-colors hover:bg-[var(--dos-surface-secondary)] hover:text-[var(--dos-text-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dos-border-focus)] before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2 before:w-0 before:h-[1px] before:bg-[var(--premium-accent)] before:transition before:duration-200 hover:before:w-[calc(100%-1rem)]";

const CTA_LINK =
    "inline-flex items-center justify-center whitespace-nowrap rounded-full bg-[var(--dos-brand-primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-[var(--premium-accent-glow)] transition duration-200 hover:-translate-y-0.5 hover:bg-[var(--dos-brand-primary-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dos-border-focus)] focus-visible:ring-offset-2";

const MOBILE_LINK =
    "block rounded-[var(--dos-radius-lg)] px-4 py-3 text-sm font-medium text-[var(--dos-text-primary)] transition-colors hover:bg-[var(--dos-surface-secondary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dos-border-focus)]";

/**
 * Note: no `display` utility here on purpose. This class is combined with a
 * responsive `hidden xl:inline-flex` at the call site, and Tailwind resolves
 * conflicting display utilities by stylesheet order rather than class
 * attribute order — baking `inline-flex` in here would beat the `hidden` and
 * reintroduce the 1024px overflow.
 */
const PHONE_LINK =
    "items-center gap-2 whitespace-nowrap rounded-full px-3 py-2.5 text-sm font-medium text-[var(--dos-text-secondary)] transition-colors hover:bg-[var(--dos-surface-secondary)] hover:text-[var(--dos-text-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dos-border-focus)]";

/** Arjun Automation — Premium Cinematic Header */
export function MarketingHeaderStatic() {
    const desktopNav = NAV_ITEMS.filter((item) => DESKTOP_NAV_LABELS.includes(item.label));

    return (
        <header className="sticky top-0 z-50 w-full border-b border-[var(--premium-border)] bg-[var(--premium-bg)]/95 backdrop-blur-xl">
            {/* Technical grid underlay */}
            <div className="absolute inset-0 premium-grid-bg pointer-events-none" aria-hidden="true" />

            {/* Angular divider accent line */}
            <div className="premium-divider" aria-hidden="true" />

            <div className="premium-container relative flex items-center justify-between gap-4 py-4">
                <Link
                    href={MARKETING_ROUTES.home}
                    className="flex shrink-0 items-center rounded-[var(--dos-radius-lg)] transition hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dos-border-focus)]"
                    aria-label="Arjun Automation — Home"
                >
                    <BrandLogo variant="blue" priority className="h-8" />
                </Link>

                {/* Desktop nav.
                    Portfolio and Resources only appear at `xl` and above. At
                    `lg` (1024–1279px) the bar shows five items, which fits
                    beside the logo, phone number and CTA on one row. The
                    dropped two stay reachable from the footer and the mobile
                    menu. */}
                <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main navigation">
                    {desktopNav.map((item) => {
                        const wide = item.label === "Portfolio" || item.label === "Resources";
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`${NAV_LINK} ${wide ? "hidden xl:inline-flex" : ""}`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="hidden items-center gap-3 lg:flex">
                    {/* Click-to-call. Only rendered once a real number is
                        configured — see src/config/company-profile.ts.

                        Hidden below `xl`: at the 1024px `lg` breakpoint the bar
                        already carries seven nav items plus the CTA, and adding
                        the phone label pushed the document to 1085px wide,
                        causing horizontal scroll. The number is still reachable
                        from the mobile menu, the contact page and the footer, so
                        no information is lost. */}
                    {HAS_PHONE && COMPANY_PROFILE.phoneDisplay ? (
                        <a href={`tel:${COMPANY_PROFILE.phoneE164}`} className={`${PHONE_LINK} hidden xl:inline-flex`}>

                            <Phone className="h-4 w-4" aria-hidden="true" />
                            <span className="sr-only">Call </span>
                            {COMPANY_PROFILE.phoneDisplay}
                        </a>
                    ) : null}
                    <Link href={MARKETING_ROUTES.contact} className={CTA_LINK}>
                        Book a Demo
                    </Link>
                </div>

                {/* Mobile menu — native <details>, no JavaScript required */}
                <details className="group relative lg:hidden">
                    <summary className="list-none rounded-[var(--dos-radius-lg)] p-2 text-[var(--dos-text-primary)] transition-colors hover:bg-[var(--dos-surface-secondary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dos-border-focus)] [&::-webkit-details-marker]:hidden">
                        <span className="sr-only">Toggle navigation menu</span>
                        <svg
                            aria-hidden="true"
                            className="h-6 w-6 group-open:hidden"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
                        </svg>
                        <svg
                            aria-hidden="true"
                            className="hidden h-6 w-6 group-open:block"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                        </svg>
                    </summary>
                    <nav
                        className="absolute right-0 top-full z-50 mt-2 w-64 max-w-[calc(100vw-2rem)] rounded-[var(--dos-radius-2xl)] border border-[var(--premium-border)] bg-[var(--premium-bg-secondary)] p-3 shadow-[var(--premium-accent-glow)]"
                        aria-label="Mobile navigation"
                    >
                        {NAV_ITEMS.map((item) => (
                            <Link key={item.href} href={item.href} className={MOBILE_LINK}>
                                {item.label}
                            </Link>
                        ))}
                        {HAS_PHONE && COMPANY_PROFILE.phoneDisplay ? (
                            <a href={`tel:${COMPANY_PROFILE.phoneE164}`} className={`${MOBILE_LINK} flex items-center gap-2`}>
                                <Phone className="h-4 w-4" aria-hidden="true" />
                                {COMPANY_PROFILE.phoneDisplay}
                            </a>
                        ) : null}
                        <Link
                            href={MARKETING_ROUTES.contact}
                            className="mt-3 block w-full rounded-full bg-[var(--dos-brand-primary)] px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-[var(--dos-brand-primary-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dos-border-focus)] focus-visible:ring-offset-2"
                        >
                            Book a Demo
                        </Link>
                    </nav>
                </details>
            </div>
        </header>
    );
}