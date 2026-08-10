import { BrandLogo } from "@/src/modules/brand-os/components/BrandLogo";
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";

const NAV_ITEMS = [
    { label: "About", href: MARKETING_ROUTES.about },
    { label: "Services", href: MARKETING_ROUTES.services },
    { label: "Industries", href: MARKETING_ROUTES.industries },
    { label: "Solutions", href: MARKETING_ROUTES.solutions },
    { label: "Portfolio", href: MARKETING_ROUTES.portfolio },
    { label: "Case Studies", href: MARKETING_ROUTES.caseStudies },
    { label: "Blog", href: MARKETING_ROUTES.blog },
    { label: "Careers", href: MARKETING_ROUTES.careers },
    { label: "Contact", href: MARKETING_ROUTES.contact },
];

export function MarketingHeader() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
                <Link href={MARKETING_ROUTES.home} className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-indigo-700/20 rounded-lg" aria-label="Arjun Automation home">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-700 text-sm font-bold text-white">AA</span>
                    <span className="text-lg font-semibold text-indigo-950">Arjun Automation</span>
                </Link>

                <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
                    {NAV_ITEMS.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`rounded-lg px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-indigo-700/20 ${
                                pathname === item.href ? "text-indigo-700 bg-indigo-50" : "text-slate-600 hover:text-indigo-700 hover:bg-slate-50"
                            }`}
                            aria-current={pathname === item.href ? "page" : undefined}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <Link
                    href={MARKETING_ROUTES.contact}
                    className="hidden rounded-lg bg-indigo-700 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-700/20 lg:inline-flex"
                >
                    Get Started
                </Link>

                <button
                    type="button"
                    className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-700/20 lg:hidden"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-expanded={mobileOpen}
                    aria-controls="mobile-nav"
                    aria-label={mobileOpen ? "Close menu" : "Open menu"}
                >
                    {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {mobileOpen ? (
                <nav id="mobile-nav" className="border-t border-slate-200 px-6 py-4 lg:hidden" aria-label="Mobile navigation">
                    <div className="flex flex-col gap-1">
                        {NAV_ITEMS.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                className={`rounded-lg px-3 py-2 text-sm font-medium ${
                                    pathname === item.href ? "text-indigo-700 bg-indigo-50" : "text-slate-600 hover:bg-slate-50"
                                }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                        <Link
                            href={MARKETING_ROUTES.contact}
                            onClick={() => setMobileOpen(false)}
                            className="mt-2 rounded-lg bg-indigo-700 px-4 py-2 text-center text-sm font-medium text-white"
                        >
                            Get Started
                        </Link>
                    </div>
                </nav>
            ) : null}
        </header>
    );
}
