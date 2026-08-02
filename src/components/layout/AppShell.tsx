"use client";

import { Header } from "@/src/components/layout/Header";
import { MobileNav } from "@/src/components/layout/MobileNav";
import { Sidebar } from "@/src/components/layout/Sidebar";

interface AppShellProps {
    children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
            <MobileNav />
            <div className="flex min-h-screen">
                <div className="hidden lg:block">
                    <Sidebar className="sticky top-0 h-screen" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                    <Header />
                    <main className="flex-1 overflow-x-hidden px-4 py-6 sm:px-6 lg:px-8">{children}</main>
                </div>
            </div>
        </div>
    );
}
