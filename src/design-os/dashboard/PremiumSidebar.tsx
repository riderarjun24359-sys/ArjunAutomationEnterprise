"use client";

import { m } from "framer-motion";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { primaryShellNavigation, secondaryShellNavigation } from "@/src/config/shell-navigation";
import { NavLink } from "@/src/components/layout/NavLink";
import { appConfig } from "@/src/config/app";
import { cn } from "@/src/lib/cn";
import { useAppStore } from "@/src/store/app.store";
import { useReducedMotion } from "@/src/design-os/motion/hooks/useReducedMotion";

interface PremiumSidebarProps {
    onNavigate?: () => void;
    className?: string;
}

export function PremiumSidebar({ onNavigate, className }: PremiumSidebarProps) {
    const sidebarOpen = useAppStore((s) => s.sidebarOpen);
    const toggleSidebar = useAppStore((s) => s.toggleSidebar);
    const reduced = useReducedMotion();

    return (
        <m.aside
            className={cn("dos-glass-panel dos-gpu flex h-full flex-col border-r border-[var(--dos-border)]", className)}
            animate={{ width: sidebarOpen ? 288 : 84 }}
            transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 320, damping: 34 }}
        >
            <div className="flex items-center justify-between gap-3 border-b border-[var(--dos-border)] px-4 py-4">
                <div className={cn("min-w-0", !sidebarOpen && "mx-auto")}>
                    {sidebarOpen ? (
                        <>
                            <p className="truncate text-sm font-semibold text-[var(--dos-text-primary)]">{appConfig.name}</p>
                            <p className="truncate text-xs text-[var(--dos-text-tertiary)]">Enterprise OS</p>
                        </>
                    ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-[var(--dos-radius-xl)] bg-[var(--dos-brand-primary)]/15 text-sm font-semibold text-[var(--dos-brand-primary)]">
                            AO
                        </div>
                    )}
                </div>
                <button
                    type="button"
                    onClick={toggleSidebar}
                    className="dos-focus-ring dos-interactive hidden rounded-[var(--dos-radius-lg)] border border-[var(--dos-border)] p-2 text-[var(--dos-text-tertiary)] hover:bg-[var(--dos-surface-tertiary)] lg:inline-flex"
                    aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                >
                    {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
                </button>
            </div>
            <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
                <div className="space-y-1">
                    {sidebarOpen ? (
                        <p className="px-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--dos-text-tertiary)]">Operations</p>
                    ) : null}
                    {primaryShellNavigation.map((item) => (
                        <NavLink key={item.href} item={item} collapsed={!sidebarOpen} onNavigate={onNavigate} />
                    ))}
                </div>
                <div className="space-y-1">
                    {sidebarOpen ? (
                        <p className="px-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--dos-text-tertiary)]">Platform</p>
                    ) : null}
                    {secondaryShellNavigation.map((item) => (
                        <NavLink key={item.href} item={item} collapsed={!sidebarOpen} onNavigate={onNavigate} />
                    ))}
                </div>
            </nav>
        </m.aside>
    );
}
