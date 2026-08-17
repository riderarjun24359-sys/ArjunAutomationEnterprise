"use client";

import { cn } from "@/src/lib/cn";
import { PremiumMotionProvider } from "@/src/design-os/motion/components/PremiumMotionProvider";
import { LivingWorkspace } from "@/src/design-os/immersive-v2";

interface AuthLayoutProps {
    children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <PremiumMotionProvider>
            <LivingWorkspace className="min-h-screen">
                <div className="flex min-h-screen items-center justify-center p-6">
                    {children}
                </div>
            </LivingWorkspace>
        </PremiumMotionProvider>
    );
}
