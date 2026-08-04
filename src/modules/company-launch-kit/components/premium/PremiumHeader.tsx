"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/src/lib/cn";
import { MagneticButton } from "@/src/modules/company-launch-kit/components/premium/ui/MagneticButton";
import { ThemeToggle } from "@/src/modules/company-launch-kit/components/premium/ui/ThemeToggle";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";
import { NAV_ITEMS } from "@/src/modules/company-launch-kit/data/home-content";

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
                    className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 rounded-lg"
                    aria-label="Arjun Automation home"
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
                    <MagneticButton href={MARKETING_ROUTES.contact} className="px-4 py-2">
                        Get Started
                    </MagneticButton>
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

            <AnimatePresence>
                {mobileOpen && (
                    <motion.nav
                        id="mobile-nav"
                        className="border-t border-[var(--premium-border)] premium-glass lg:hidden"
                        aria-label="Mobile navigation"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
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
                            <MagneticButton href={MARKETING_ROUTES.contact} className="mt-2 w-full">
                                Get Started
                            </MagneticButton>
                        </div>
                    </motion.nav>
                )}
            </AnimatePresence>
        </header>
    );
}
