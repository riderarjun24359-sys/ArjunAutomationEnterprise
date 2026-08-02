"use client";

import { usePathname } from "next/navigation";
import { Menu, Search } from "lucide-react";
import { shellRouteLabels } from "@/src/config/shell-navigation";
import { UserMenu } from "@/src/components/layout/UserMenu";
import { useAppStore } from "@/src/store/app.store";

export function Header() {
    const pathname = usePathname();
    const toggleMobileMenu = useAppStore((state) => state.toggleMobileMenu);
    const title = shellRouteLabels[pathname] ?? "Workspace";

    return (
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
            <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
                <div className="flex min-w-0 items-center gap-3">
                    <button
                        type="button"
                        onClick={toggleMobileMenu}
                        className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                        aria-label="Open navigation menu"
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                    <div className="min-w-0">
                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-emerald-600">Enterprise Shell</p>
                        <h1 className="truncate text-lg font-semibold text-slate-900 dark:text-white">{title}</h1>
                    </div>
                </div>

                <div className="hidden max-w-md flex-1 px-4 md:block">
                    <label className="relative block">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="search"
                            placeholder="Search modules, records, and actions..."
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-300 dark:border-slate-700 dark:bg-slate-900 dark:focus:border-emerald-700"
                        />
                    </label>
                </div>

                <UserMenu />
            </div>
        </header>
    );
}
