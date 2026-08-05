import Link from "next/link";
import { BrandLogo } from "@/src/modules/brand-os/components/BrandLogo";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";
import { NAV_ITEMS } from "@/src/modules/company-launch-kit/data/home-content";

/** Zero-JS marketing header — official brand logo from Identity System v1.0 */
export function MarketingHeaderStatic() {
    return (
        <header className="sticky top-0 z-50 border-b border-transparent bg-[var(--premium-bg)]/80 backdrop-blur-md">
            <div className="premium-container flex items-center justify-between py-4">
                <Link
                    href={MARKETING_ROUTES.home}
                    className="flex items-center rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50"
                >
                    <BrandLogo variant="secondary" priority className="max-h-8" />
                </Link>

                <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
                    {NAV_ITEMS.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--premium-fg-muted)] transition hover:text-[var(--premium-fg)] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="hidden lg:block">
                    <Link
                        href={MARKETING_ROUTES.contact}
                        className="inline-flex items-center justify-center rounded-xl bg-indigo-700 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50"
                    >
                        Get Started
                    </Link>
                </div>

                <details className="group relative lg:hidden">
                    <summary className="list-none rounded-lg p-2 text-[var(--premium-fg-muted)] hover:bg-[var(--premium-glass)] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 [&::-webkit-details-marker]:hidden">
                        <span className="sr-only">Open menu</span>
                        <svg aria-hidden="true" className="h-6 w-6 group-open:hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
                        </svg>
                        <svg aria-hidden="true" className="hidden h-6 w-6 group-open:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                        </svg>
                    </summary>
                    <nav className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-[var(--premium-border)] bg-[var(--premium-bg)] p-3 shadow-lg" aria-label="Mobile navigation">
                        {NAV_ITEMS.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="block rounded-lg px-3 py-2 text-sm font-medium text-[var(--premium-fg-muted)] hover:bg-[var(--premium-glass)]"
                            >
                                {item.label}
                            </Link>
                        ))}
                        <Link
                            href={MARKETING_ROUTES.contact}
                            className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-indigo-700 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-600"
                        >
                            Get Started
                        </Link>
                    </nav>
                </details>
            </div>
        </header>
    );
}
