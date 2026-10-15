import Link from "next/link";
import { BrandLogo } from "@/src/modules/brand-os/components/BrandLogo";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";
import { NAV_ITEMS } from "@/src/modules/company-launch-kit/data/home-content";

/**
 * Curated desktop navigation. The full NAV_ITEMS list (10 links) does not fit
 * one row beside the logo and CTA at 1024px without clipping, so the desktop
 * bar surfaces the highest-intent destinations and the mobile menu keeps the
 * complete list. Both are rendered from the same source of truth.
 */
const DESKTOP_NAV_LABELS = ["About", "Services", "Industries", "Case Studies", "Pricing", "Resources"];

const NAV_LINK =
    "rounded-full px-3.5 py-2 text-sm font-medium text-[var(--dos-text-secondary)] transition-colors hover:bg-[var(--dos-surface-secondary)] hover:text-[var(--dos-text-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dos-border-focus)]";

const CTA_LINK =
    "inline-flex items-center justify-center rounded-full bg-[var(--dos-brand-primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-[var(--dos-shadow-sm)] transition duration-200 hover:-translate-y-0.5 hover:bg-[var(--dos-brand-primary-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dos-border-focus)] focus-visible:ring-offset-2";

const MOBILE_LINK =
    "block rounded-[var(--dos-radius-lg)] px-4 py-3 text-sm font-medium text-[var(--dos-text-primary)] transition-colors hover:bg-[var(--dos-surface-secondary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dos-border-focus)]";

/** Arjun Automation OS Marketing Header */
export function MarketingHeaderStatic() {
    const desktopNav = NAV_ITEMS.filter((item) => DESKTOP_NAV_LABELS.includes(item.label));

    return (
        <header className="sticky top-0 z-50 w-full border-b border-[var(--dos-border)] bg-[var(--dos-surface)]/85 backdrop-blur-md">
            <div className="premium-container flex items-center justify-between gap-4 py-3">
                <Link
                    href={MARKETING_ROUTES.home}
                    className="flex shrink-0 items-center rounded-[var(--dos-radius-lg)] transition hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dos-border-focus)]"
                >
                    <BrandLogo variant="secondary" priority className="h-8" />
                </Link>

                {/* Desktop nav */}
                <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main navigation">
                    {desktopNav.map((item) => (
                        <Link key={item.href} href={item.href} className={NAV_LINK}>
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="hidden lg:block">
                    <Link href={MARKETING_ROUTES.contact} className={CTA_LINK}>
                        Get Started
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
                        className="absolute right-0 top-full z-50 mt-2 w-64 max-w-[calc(100vw-2rem)] rounded-[var(--dos-radius-2xl)] border border-[var(--dos-border)] bg-[var(--dos-surface)] p-3 shadow-[var(--dos-shadow-xl)]"
                        aria-label="Mobile navigation"
                    >
                        {NAV_ITEMS.map((item) => (
                            <Link key={item.href} href={item.href} className={MOBILE_LINK}>
                                {item.label}
                            </Link>
                        ))}
                        <Link
                            href={MARKETING_ROUTES.contact}
                            className="mt-3 block w-full rounded-full bg-[var(--dos-brand-primary)] px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-[var(--dos-brand-primary-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dos-border-focus)] focus-visible:ring-offset-2"
                        >
                            Get Started
                        </Link>
                    </nav>
                </details>
            </div>
        </header>
    );
}
