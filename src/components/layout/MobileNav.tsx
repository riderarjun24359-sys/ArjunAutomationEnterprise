"use client";

import { X } from "lucide-react";
import { Sidebar } from "@/src/components/layout/Sidebar";
import { useAppStore } from "@/src/store/app.store";

export function MobileNav() {
    const isMobileMenuOpen = useAppStore((state) => state.isMobileMenuOpen);
    const toggleMobileMenu = useAppStore((state) => state.toggleMobileMenu);

    if (!isMobileMenuOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-40 lg:hidden">
            <button type="button" className="absolute inset-0 bg-slate-950/50" aria-label="Close navigation menu" onClick={toggleMobileMenu} />
            <div className="absolute inset-y-0 left-0 w-[85%] max-w-xs shadow-2xl">
                <div className="flex items-center justify-end border-b border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950">
                    <button
                        type="button"
                        onClick={toggleMobileMenu}
                        className="rounded-xl border border-slate-200 p-2 text-slate-600 dark:border-slate-700 dark:text-slate-300"
                        aria-label="Close navigation menu"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
                <Sidebar onNavigate={toggleMobileMenu} className="h-[calc(100%-57px)] w-full" />
            </div>
        </div>
    );
}
