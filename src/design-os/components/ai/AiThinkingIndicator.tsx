"use client";

import { m } from "framer-motion";
import { cn } from "@/src/lib/cn";
import { staggerContainer } from "@/src/design-os/motion/variants";

interface AiThinkingIndicatorProps {
    className?: string;
    count?: number;
}

export function AiThinkingIndicator({ className, count = 3 }: AiThinkingIndicatorProps) {
    return (
        <m.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className={cn("flex items-center justify-center gap-1.5", className)}
        >
            {Array.from({ length: count }).map((_, i) => (
                <m.div key={i} className="dos-thinking-dot" />
            ))}
        </m.div>
    );
}
