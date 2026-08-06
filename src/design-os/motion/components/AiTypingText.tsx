"use client";

import { useEffect, useState } from "react";
import { cn } from "@/src/lib/cn";
import { useReducedMotion } from "../hooks/useReducedMotion";

function AiTypingTextAnimated({
    text,
    className,
    speedMs,
    onComplete,
}: {
    text: string;
    className?: string;
    speedMs: number;
    onComplete?: () => void;
}) {
    const [shown, setShown] = useState("");

    useEffect(() => {
        let i = 0;
        const id = window.setInterval(() => {
            i += 1;
            setShown(text.slice(0, i));
            if (i >= text.length) {
                window.clearInterval(id);
                onComplete?.();
            }
        }, speedMs);
        return () => window.clearInterval(id);
    }, [text, speedMs, onComplete]);

    return <span className={cn("dos-typing-cursor whitespace-pre-wrap", className)}>{shown}</span>;
}

/** Character-by-character typing animation for AI responses. */
export function AiTypingText({
    text,
    className,
    speedMs = 18,
    onComplete,
}: {
    text: string;
    className?: string;
    speedMs?: number;
    onComplete?: () => void;
}) {
    const reduced = useReducedMotion();
    if (reduced) {
        return <span className={cn("whitespace-pre-wrap", className)}>{text}</span>;
    }
    return <AiTypingTextAnimated text={text} className={className} speedMs={speedMs} onComplete={onComplete} />;
}
