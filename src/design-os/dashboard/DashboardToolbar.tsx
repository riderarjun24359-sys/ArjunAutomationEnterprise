"use client";

import { Bot, Menu } from "lucide-react";
import { SmartSearch } from "./SmartSearch";
import { NotificationCenter } from "./NotificationCenter";
import { ThemeToggle } from "@/src/design-os/components/ThemeToggle";
import { UserMenu } from "@/src/components/layout/UserMenu";
import { useAppStore } from "@/src/store/app.store";
import { useExecutiveShellStore } from "@/src/store/executive.store";
import { shellRouteLabels } from "@/src/config/shell-navigation";
import { usePathname } from "next/navigation";
import { m } from "framer-motion";
import { staggerContainer, staggerItem } from "@/src/design-os/motion/variants";
import { cn } from "@/src/lib/cn";

export function DashboardToolbar({ title }: { title?: string }) {
    const pathname = usePathname();
    const toggleMobileMenu = useAppStore((s) => s.toggleMobileMenu);
    const toggleCopilot = useExecutiveShellStore((s) => s.toggleCopilot);
    const snapshot = useExecutiveShellStore((s) => s.snapshot);
    const resolvedTitle = title ?? shellRouteLabels[pathname] ?? "Workspace";

    const notifications = snapshot?.notifications.map((n) => ({
        id: n.id,
        title: n.title,
        time: n.time,
    })) ?? [];

    return (
        <header className={cn("dos-glass-panel sticky top-0 z-[var(--dos-z-sticky)]")}>
            <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
                <div className="flex min-w-0 items-center gap-3">
                    <button type="button" onClick={toggleMobileMenu} className="rounded-[var(--dos-radius-xl)] border border-[var(--dos-border)] p-2 text-[var(--dos-text-secondary)] hover:bg-[var(--dos-surface-tertiary)] lg:hidden" aria-label="Open navigation menu">
                        <Menu className="h-5 w-5" />
                    </button>
                    <div className="min-w-0">
                        <h1 className="truncate text-lg font-semibold text-[var(--dos-text-primary)]">{resolvedTitle}</h1>
                    </div>
                </div>
                <div className="hidden max-w-md flex-1 px-4 md:block">
                    <SmartSearch />
                </div>
                <m.div
                    className="flex items-center gap-2"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="show"
                >
                    <m.div variants={staggerItem}>
                        <button
                            type="button"
                            onClick={toggleCopilot}
                            className="dos-focus-ring dos-interactive flex h-9 w-9 items-center justify-center rounded-full border border-[var(--dos-border)] bg-[var(--dos-surface-secondary)] text-[var(--dos-text-secondary)] transition-colors hover:text-[var(--dos-brand-primary)]"
                            aria-label="Open executive copilot"
                        >
                            <Bot className="h-4 w-4" />
                        </button>
                    </m.div>
                    <m.div variants={staggerItem}>
                        <NotificationCenter count={notifications.length} items={notifications} />
                    </m.div>
                    <m.div variants={staggerItem}>
                        <ThemeToggle />
                    </m.div>
                    <m.div variants={staggerItem}>
                        <UserMenu />
                    </m.div>
                </m.div>
            </div>
        </header>
    );
}
