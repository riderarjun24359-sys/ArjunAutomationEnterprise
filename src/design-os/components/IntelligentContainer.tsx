"use client";

import { cn } from "@/src/lib/cn";
import { HTMLAttributes, ReactNode } from "react";

/**
 * Foundation for the Intelligent Container.
 * Designed for future AI-behavioral states (observing, reasoning, acting).
 * 
 * Materiality: Defines surface hierarchy.
 * AgentType: Defines behavioral state (tint).
 */
interface IntelligentContainerProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    material?: "foundation" | "base" | "active" | "insight";
    agentType?: "neutral" | "processing" | "warning" | "critical" | "success";
    className?: string;
}

export function IntelligentContainer({
    children,
    material = "base",
    agentType = "neutral",
    className,
    ...props
}: IntelligentContainerProps) {
    // Map material to surface token
    const materialClass = {
        foundation: "bg-[var(--dos-surface-foundation)]",
        base: "bg-[var(--dos-surface-base)]",
        active: "bg-[var(--dos-surface-active)]",
        insight: "bg-[var(--dos-surface-insight)] backdrop-blur-md",
    }[material];

    // Map agentType to tint token
    const tintClass = {
        neutral: "bg-[var(--dos-tint-neutral)]",
        processing: "bg-[var(--dos-tint-processing)]",
        warning: "bg-[var(--dos-tint-warning)]",
        critical: "bg-[var(--dos-tint-critical)]",
        success: "bg-[var(--dos-tint-success)]",
    }[agentType];

    return (
        <div
            className={cn(
                "dos-gpu relative overflow-hidden rounded-[var(--dos-radius-2xl)] border border-[var(--dos-border)] p-6 transition-all duration-[var(--dos-motion-duration-fluid)] ease-[var(--dos-motion-ease-fluid)]",
                materialClass,
                className
            )}
            {...props}
        >
            {/* Agent Tint Overlay */}
            <div className={cn("absolute inset-0 pointer-events-none transition-colors duration-[var(--dos-motion-duration-fluid)]", tintClass)} />
            
            {/* Content Layer */}
            <div className="relative z-[1]">{children}</div>
        </div>
    );
}
