"use client";

import { useEffect, useState } from "react";
import { cn } from "@/src/lib/cn";

export function ProgressiveLoader({ stages, className }: { stages: string[]; className?: string }) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (index >= stages.length - 1) return;
        const timer = setTimeout(() => setIndex((i) => i + 1), 800);
        return () => clearTimeout(timer);
    }, [index, stages.length]);

    return (
        <div className={cn("flex flex-col gap-2 text-sm text-[var(--dos-text-secondary)]", className)}>
            {stages.map((stage, i) => (
                <div key={stage} className={cn("flex items-center gap-2", i <= index ? "opacity-100" : "opacity-30")}>
                    <div className={cn("h-2 w-2 rounded-full", i < index ? "bg-[var(--dos-success)]" : i === index ? "animate-pulse bg-[var(--dos-brand-primary)]" : "bg-[var(--dos-border)]")} />
                    <span>{stage}</span>
                </div>
            ))}
        </div>
    );
}
