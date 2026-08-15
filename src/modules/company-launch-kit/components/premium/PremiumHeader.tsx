"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Menu, X } from "lucide-react";
import { cn } from "@/src/lib/cn";
import { ROUTES } from "@/src/constants/routes";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";
import { NAV_ITEMS } from "@/src/modules/company-launch-kit/data/home-content";

const ThemeToggle = dynamic(
    () => import("@/src/modules/company-launch-kit/components/premium/ui/ThemeToggle").then((m) => m.ThemeToggle),
    { ssr: false, loading: () => <div className="h-9 w-9" aria-hidden="true" /> },
);

export function PremiumHeader() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <header
            className={cn(
                "sticky top-0 z-50 transition-all duration-300",
                scrolled ? "premium-glass border-b border-[var(--premium-border)] shadow-sm" : "bg-transparent",
            )}
        >
            <div className="premium-container flex items-center justify-between py-4">
                <Link
                    href={MARKETING_ROUTES.home}
                    className="flex items-center gap-2 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50"
                >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-700 text-sm font-bold text-white">AA</span>
                    <span className="font-display text-lg font-semibold">Arjun Automation</span>
                </Link>

                <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
                    {NAV_ITEMS.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "rounded-lg px-3 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50",
                                pathname === item.href
                                    ? "text-indigo-700 bg-indigo-50 dark:text-indigo-300 dark:bg-indigo-950/50"
                                    : "text-[var(--premium-fg-muted)] hover:text-[var(--premium-fg)]",
                            )}
                            aria-current={pathname === item.href ? "page" : undefined}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="hidden items-center gap-3 lg:flex">
                    <ThemeToggle />
                    <Link
                        href={ROUTES.auth.signIn}
                        className="inline-flex items-center justify-center rounded-xl bg-indigo-700 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 dark:bg-indigo-600 dark:hover:bg-indigo-500"
                    >
                        Get Started
                    </Link>
                </div>

                <div className="flex items-center gap-2 lg:hidden">
                    <ThemeToggle />
                    <button
                        type="button"
                        className="rounded-lg p-2 text-[var(--premium-fg-muted)] hover:bg-[var(--premium-glass)] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-expanded={mobileOpen}
                        aria-controls="mobile-nav"
                        aria-label={mobileOpen ? "Close menu" : "Open menu"}
                    >
                        {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {mobileOpen ? (
                <nav
                    id="mobile-nav"
                    className="border-t border-[var(--premium-border)] premium-glass lg:hidden"
                    aria-label="Mobile navigation"
                >
                    <div className="premium-container flex flex-col gap-1 py-4">
                        {NAV_ITEMS.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                className={cn(
                                    "rounded-lg px-3 py-2 text-sm font-medium",
                                    pathname === item.href ? "text-indigo-700 bg-indigo-50 dark:text-indigo-300 dark:bg-indigo-950/50" : "text-[var(--premium-fg-muted)]",
                                )}
                            >
                                {item.label}
                            </Link>
                        ))}
                        <Link
                            href={ROUTES.auth.signIn}
                            className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-indigo-700 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-600"
                            onClick={() => setMobileOpen(false)}
                        >
                            Get Started
                        </Link>
                    </div>
                </nav>
            ) : null}
        </header>
    );
}
