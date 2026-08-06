"use client";

import { cn } from "@/src/lib/cn";
import { WidgetEntrance } from "@/src/design-os/motion/components/WidgetEntrance";

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
            <div className={cn("dos-glass-panel rounded-[var(--dos-radius-2xl)] p-6", className)}>
                {title ? (
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-base font-semibold text-[var(--dos-text-primary)]">{title}</h3>
                        {action}
                    </div>
                ) : null}
                {children}
            </div>
        </WidgetEntrance>
    );
}
