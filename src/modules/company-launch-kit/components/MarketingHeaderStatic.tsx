import Link from "next/link";
import { BrandLogo } from "@/src/modules/brand-os/components/BrandLogo";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";
import { NAV_ITEMS } from "@/src/modules/company-launch-kit/data/home-content";

/** Arjun Automation OS Marketing Header */
export function MarketingHeaderStatic() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-[var(--dos-border)] bg-[var(--dos-surface)]/80 backdrop-blur-md transition-all">
            <div className="premium-container flex items-center justify-between py-3">
                <Link
                    href={MARKETING_ROUTES.home}
                    className="flex items-center rounded-lg transition hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dos-border-focus)]"
                >
                    <BrandLogo variant="secondary" priority className="h-8" />
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
                    {NAV_ITEMS.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="rounded-full px-4 py-2 text-sm font-medium text-[var(--dos-text-secondary)] transition hover:bg-[var(--dos-surface-tertiary)] hover:text-[var(--dos-text-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dos-border-focus)]"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="hidden lg:block">
                    <Link
                        href={MARKETING_ROUTES.home}
                        className="inline-flex items-center justify-center rounded-full bg-[var(--dos-brand-primary)] px-5 py-2.5 text-sm font-semibold text-[var(--dos-surface)] transition-transform hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    >
                        Get Started
                    </Link>
                </div>

                {/* Mobile Menu */}
                <details className="group relative lg:hidden">
                    <summary className="list-none rounded-lg p-2 text-[var(--dos-text-primary)] transition hover:bg-[var(--dos-surface-tertiary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dos-border-focus)] [&::-webkit-details-marker]:hidden">
                        <span className="sr-only">Open menu</span>
                        <svg aria-hidden="true" className="h-6 w-6 group-open:hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
                        </svg>
                        <svg aria-hidden="true" className="hidden h-6 w-6 group-open:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                        </svg>
                    </summary>
                    <nav className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-[var(--dos-border)] bg-[var(--dos-surface)] p-4 shadow-xl backdrop-blur-lg" aria-label="Mobile navigation">
                        {NAV_ITEMS.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="block rounded-lg px-4 py-3 text-sm font-medium text-[var(--dos-text-primary)] hover:bg-[var(--dos-surface-tertiary)]"
                            >
                                {item.label}
                            </Link>
                        ))}
                        <Link
                            href={MARKETING_ROUTES.contact}
                            className="mt-4 block w-full rounded-full bg-[var(--dos-brand-primary)] px-4 py-3 text-center text-sm font-semibold text-[var(--dos-surface)]"
                        >
                            Get Started
                        </Link>
                    </nav>
                </details>
            </div>
        </header>
    );
}
