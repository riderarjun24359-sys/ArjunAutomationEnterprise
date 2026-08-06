"use client";

import { useEffect, useState } from "react";
import { cn } from "@/src/lib/cn";
import { useReducedMotion } from "../hooks/useReducedMotion";

function StreamingTextAnimated({ chunks, className }: { chunks: string[]; className?: string }) {
    const [visibleCount, setVisibleCount] = useState(0);

    useEffect(() => {
        let i = 0;
        const id = window.setInterval(() => {
            i += 1;
            setVisibleCount(i);
            if (i >= chunks.length) window.clearInterval(id);
        }, 40);
        return () => window.clearInterval(id);
    }, [chunks]);

    const text = chunks.slice(0, visibleCount).join("");

    return (
        <p className={cn("dos-text-body-sm text-[var(--dos-text-primary)]", visibleCount < chunks.length ? "dos-typing-cursor" : "", className)}>
            {text}
        </p>
    );
}

/** Progressive reveal for streamed AI tokens. */
export function StreamingText({ chunks, className }: { chunks: string[]; className?: string }) {
    const reduced = useReducedMotion();
    if (reduced) {
        return <p className={cn("dos-text-body-sm text-[var(--dos-text-primary)]", className)}>{chunks.join("")}</p>;
    }
    return <StreamingTextAnimated chunks={chunks} className={className} />;
}
