"use client";

import { cn } from "@/src/lib/cn";
import { AmbientGradients } from "./AmbientGradients";

/** Living workspace chrome — ambient gradients, glass depth, no business logic. */
export function LivingWorkspace({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={cn("immersive-living-workspace relative min-h-screen", className)}>
            <AmbientGradients />
            <div className="relative z-[1]">{children}</div>
        </div>
    );
}
