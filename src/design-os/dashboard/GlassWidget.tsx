"use client";

import { cn } from "@/src/lib/cn";
import { WidgetEntrance } from "@/src/design-os/motion/components/WidgetEntrance";
import { IntelligentContainer } from "@/src/design-os/components/IntelligentContainer";

export function GlassWidget({
    title,
    children,
    className,
    action,
}: {
    title?: string;
    children: React.ReactNode;
    className?: string;
    action?: React.ReactNode;
}) {
    return (
        <WidgetEntrance>
            <IntelligentContainer 
                className={cn(
                    "border-0 shadow-none",
                    "bg-[var(--dos-surface-insight)] backdrop-blur-md", // Refractive look
                    "z-[var(--dos-z-data)]", // Spatial elevation
                    className
                )}
            >
                {title ? (
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-base font-semibold text-[var(--dos-text-primary)]">{title}</h3>
                        {action}
                    </div>
                ) : null}
                {children}
            </IntelligentContainer>
        </WidgetEntrance>
    );
}
