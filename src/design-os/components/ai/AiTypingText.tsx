"use client";

import { cn } from "@/src/lib/cn";

interface AiTypingTextProps {
    className?: string;
    text?: string;
}

export function AiTypingText({ className, text = "AI is typing" }: AiTypingTextProps) {
    return (
        <div className={cn("flex items-center gap-2", className)}>
            <span className="text-sm italic text-[var(--dos-text-secondary)]">{text}</span>
            <span className="dos-typing-cursor" />
        </div>
    );
}
