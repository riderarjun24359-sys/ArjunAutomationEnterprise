"use client";

import { Menu } from "lucide-react";
import { SmartSearch } from "./SmartSearch";
import { NotificationCenter } from "./NotificationCenter";
import { ThemeToggle } from "@/src/design-os/components/ThemeToggle";
import { UserMenu } from "@/src/components/layout/UserMenu";
import { useAppStore } from "@/src/store/app.store";
import { shellRouteLabels } from "@/src/config/shell-navigation";
import { usePathname } from "next/navigation";

export function DashboardToolbar({ title }: { title?: string }) {
    const pathname = usePathname();
    const toggleMobileMenu = useAppStore((s) => s.toggleMobileMenu);
    const resolvedTitle = title ?? shellRouteLabels[pathname] ?? "Workspace";

    return (
        <header className="sticky top-0 z-[var(--dos-z-sticky)] border-b border-[var(--dos-border)] bg-[var(--dos-surface-elevated)]/90 backdrop-blur-md">
            <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
                <div className="flex min-w-0 items-center gap-3">
                    <button type="button" onClick={toggleMobileMenu} className="rounded-[var(--dos-radius-xl)] border border-[var(--dos-border)] p-2 text-[var(--dos-text-secondary)] hover:bg-[var(--dos-surface-tertiary)] lg:hidden" aria-label="Open navigation menu">
                        <Menu className="h-5 w-5" />
                    </button>
                    <div className="min-w-0">
                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--dos-brand-primary)]">Enterprise Shell</p>
                        <h1 className="truncate text-lg font-semibold text-[var(--dos-text-primary)]">{resolvedTitle}</h1>
                    </div>
                </div>
                <div className="hidden max-w-md flex-1 px-4 md:block">
                    <SmartSearch />
                </div>
                <div className="flex items-center gap-2">
                    <NotificationCenter count={2} items={[{ id: "1", title: "System update complete", time: "2m ago" }, { id: "2", title: "New module available", time: "1h ago" }]} />
                    <ThemeToggle />
                    <UserMenu />
                </div>
            </div>
        </header>
    );
}
