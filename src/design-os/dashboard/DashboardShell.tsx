"use client";

import { MobileNav } from "@/src/components/layout/MobileNav";
import { AiAssistantPanel } from "@/src/design-os/dashboard/AiAssistantPanel";
import { useExecutiveShellStore } from "@/src/store/executive.store";
import { PremiumSidebar } from "./PremiumSidebar";
import { DashboardToolbar } from "./DashboardToolbar";
import { CommandPalette } from "./CommandPalette";
import { KeyboardShortcuts } from "./KeyboardShortcuts";
import { PremiumMotionProvider } from "@/src/design-os/motion/components/PremiumMotionProvider";
import {
    AnimatePresence,
    m
} from "framer-motion";
import {
    pageTransition
} from "@/src/design-os/motion/variants";
import {
    usePathname
} from "next/navigation";
import {
    CinematicWelcome,
    ImmersiveProvider,
    LivingWorkspace
} from "@/src/design-os/immersive-v2";
import { cn } from "@/src/lib/cn";

interface DashboardShellProps {
    children: React.ReactNode;
    title?: string;
    className?: string;
}

export function DashboardShell({
    children,
    title,
    className
}: DashboardShellProps) {
    const copilotOpen = useExecutiveShellStore((s) => s.copilotOpen);
    const setCopilotOpen = useExecutiveShellStore((s) => s.setCopilotOpen);
    const pathname = usePathname();

    return (
        <PremiumMotionProvider>
            <ImmersiveProvider>
                <LivingWorkspace className={cn("text-[var(--dos-text-primary)]", className)}>
                    <CinematicWelcome />
                    <MobileNav />
                    <CommandPalette />
                    <KeyboardShortcuts />
                    <AiAssistantPanel open={copilotOpen} onClose={() => setCopilotOpen(false)} />
                    <div className="flex min-h-screen">
                        <div className="hidden lg:block">
                            <PremiumSidebar className="sticky top-0 h-screen" />
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col">
                            <DashboardToolbar title={title} />
                            <AnimatePresence mode="wait" initial={false}>
                                <m.main
                                    key={pathname}
                                    variants={pageTransition}
                                    initial="hidden"
                                    animate="show"
                                    exit="exit"
                                    className="flex-1 overflow-x-hidden px-4 py-6 sm:px-6 lg:px-8"
                                >
                                    {children}
                                </m.main>
                            </AnimatePresence>
                        </div>
                    </div>
                </LivingWorkspace>
            </ImmersiveProvider>
        </PremiumMotionProvider>
    );
}
