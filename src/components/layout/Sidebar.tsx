"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { appConfig } from "@/src/config/app";
import { primaryShellNavigation, secondaryShellNavigation } from "@/src/config/shell-navigation";
import { NavLink } from "@/src/components/layout/NavLink";
import { cn } from "@/src/lib/cn";
import { useAppStore } from "@/src/store/app.store";

interface SidebarProps {
    onNavigate?: () => void;
    className?: string;
}

export function Sidebar({ onNavigate, className }: SidebarProps) {
    const sidebarOpen = useAppStore((state) => state.sidebarOpen);
    const toggleSidebar = useAppStore((state) => state.toggleSidebar);

    return (
        <aside
            className={cn(
                "flex h-full flex-col border-r border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95",
                sidebarOpen ? "w-72" : "w-[84px]",
                className,
            )}
        >
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-4 dark:border-slate-800">
                <div className={cn("min-w-0", !sidebarOpen && "mx-auto")}>
                    {sidebarOpen ? (
                        <>
                            <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{appConfig.name}</p>
                            <p className="truncate text-xs text-slate-500 dark:text-slate-400">Enterprise OS</p>
                        </>
                    ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                            AO
                        </div>
                    )}
                </div>
                <button
                    type="button"
                    onClick={toggleSidebar}
                    className="hidden rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100 lg:inline-flex dark:border-slate-700 dark:hover:bg-slate-800"
                    aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                >
                    {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
                </button>
            </div>

            <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
                <div className="space-y-1">
                    {sidebarOpen ? <p className="px-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Operations</p> : null}
                    {primaryShellNavigation.map((item) => (
                        <NavLink key={item.href} item={item} collapsed={!sidebarOpen} onNavigate={onNavigate} />
                    ))}
                </div>

                <div className="space-y-1">
                    {sidebarOpen ? <p className="px-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Platform</p> : null}
                    {secondaryShellNavigation.map((item) => (
                        <NavLink key={item.href} item={item} collapsed={!sidebarOpen} onNavigate={onNavigate} />
                    ))}
                </div>
            </nav>
        </aside>
    );
}
