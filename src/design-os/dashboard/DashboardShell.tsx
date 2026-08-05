"use client";

import { MobileNav } from "@/src/components/layout/MobileNav";
import { ExecutiveCopilot } from "@/src/modules/executive-command-center/components/ExecutiveCopilot";
import { useExecutiveShellStore } from "@/src/store/executive.store";
import { PremiumSidebar } from "./PremiumSidebar";
import { DashboardToolbar } from "./DashboardToolbar";
import { CommandPalette } from "./CommandPalette";
import { KeyboardShortcuts } from "./KeyboardShortcuts";
import { cn } from "@/src/lib/cn";

interface DashboardShellProps {
    children: React.ReactNode;
    title?: string;
    className?: string;
}

export function DashboardShell({ children, title, className }: DashboardShellProps) {
    const copilotOpen = useExecutiveShellStore((s) => s.copilotOpen);
    const setCopilotOpen = useExecutiveShellStore((s) => s.setCopilotOpen);
    const snapshot = useExecutiveShellStore((s) => s.snapshot);

    return (
        <div className={cn("min-h-screen bg-[var(--dos-surface-secondary)] text-[var(--dos-text-primary)]", className)}>
            <MobileNav />
            <CommandPalette />
            <KeyboardShortcuts />
            <ExecutiveCopilot open={copilotOpen} onClose={() => setCopilotOpen(false)} snapshot={snapshot} />
            <div className="flex min-h-screen">
                <div className="hidden lg:block">
                    <PremiumSidebar className="sticky top-0 h-screen" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                    <DashboardToolbar title={title} />
                    <main className="flex-1 overflow-x-hidden px-4 py-6 sm:px-6 lg:px-8">{children}</main>
                </div>
            </div>
        </div>
    );
}
