"use client";

import { usePathname } from "next/navigation";
import { m } from "framer-motion";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { shellNavigation } from "@/src/config/shell-navigation";
import { navigationContextMap } from "@/src/config/navigation-context";
import { NavLink } from "@/src/components/layout/NavLink";
import { appConfig } from "@/src/config/app";
import { cn } from "@/src/lib/cn";
import { useAppStore } from "@/src/store/app.store";
import { useExecutiveShellStore } from "@/src/store/executive.store";
import { useReducedMotion } from "@/src/design-os/motion/hooks/useReducedMotion";
import { staggerContainer } from "@/src/design-os/motion/variants";
import { resolveNavigationContext } from "@/src/design-os/navigation/navigation-context-engine";

interface PremiumSidebarProps {
    onNavigate?: () => void;
    className?: string;
}

export function PremiumSidebar({ onNavigate, className }: PremiumSidebarProps) {
    const sidebarOpen = useAppStore((s) => s.sidebarOpen);
    const toggleSidebar = useAppStore((s) => s.toggleSidebar);
    const reduced = useReducedMotion();
    const pathname = usePathname();
    const snapshot = useExecutiveShellStore((s) => s.snapshot);

    const { persistent, contextual, library } = resolveNavigationContext({
        currentPath: pathname,
        authorizedNavigation: shellNavigation,
        explicitRelationships: navigationContextMap,
        snapshot: {
            runningAutomations: snapshot?.runningAutomations ?? 0,
            pendingApprovals: snapshot?.pendingApprovals ?? 0,
            criticalRisks: snapshot?.criticalRisks ?? 0,
        }
    });

    return (
        <m.aside
            className={cn(
                "dos-gpu flex h-full flex-col border-r border-[var(--dos-border-subtle)] bg-[var(--dos-surface-foundation)]",
                className
            )}
            animate={{ width: sidebarOpen ? 288 : 84 }}
            transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 320, damping: 34 }}
        >
            <div className="flex items-center justify-between gap-3 border-b border-[var(--dos-border-subtle)] px-4 py-3">
                <div className={cn("min-w-0", !sidebarOpen && "mx-auto")}>
                    {sidebarOpen ? (
                        <>
                            <p className="truncate text-sm font-semibold text-[var(--dos-text-primary)]">{appConfig.name}</p>
                            <p className="truncate text-xs text-[var(--dos-text-tertiary)] uppercase tracking-widest">Enterprise OS</p>
                        </>
                    ) : (
                        <div />
                    )}
                </div>
                <button
                    type="button"
                    onClick={toggleSidebar}
                    className="dos-focus-ring dos-interactive hidden rounded-[var(--dos-radius-lg)] border border-[var(--dos-border-subtle)] p-2 text-[var(--dos-text-tertiary)] hover:bg-[var(--dos-surface-active)] lg:inline-flex"
                    aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                >
                    {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
                </button>
            </div>
            
            <m.nav
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="flex-1 space-y-8 overflow-y-auto px-3 py-6"
            >
                {/* Persistent Zone */}
                <div className="space-y-1">
                    {persistent.map((item) => (
                        <NavLink key={item.href} item={item} collapsed={!sidebarOpen} onNavigate={onNavigate} />
                    ))}
                </div>

                {/* Context Zone */}
                {contextual.length > 0 && (
                    <div className="space-y-1">
                        {sidebarOpen && <p className="px-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--dos-text-tertiary)]">Context</p>}
                        {contextual.map((item) => (
                            <NavLink key={item.href} item={item} collapsed={!sidebarOpen} onNavigate={onNavigate} />
                        ))}
                    </div>
                )}

                {/* Library Zone */}
                <div className="space-y-1">
                    {sidebarOpen && <p className="px-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--dos-text-tertiary)]">Library</p>}
                    {library.map((item) => (
                        <NavLink key={item.href} item={item} collapsed={!sidebarOpen} onNavigate={onNavigate} />
                    ))}
                </div>
            </m.nav>
        </m.aside>
    );
}
