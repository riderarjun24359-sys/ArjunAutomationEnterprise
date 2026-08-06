"use client";

import { cn } from "@/src/lib/cn";

export function AiThinkingIndicator({ label = "Thinking", className }: { label?: string; className?: string }) {
    return (
        <div className={cn("inline-flex items-center gap-2 rounded-[var(--dos-radius-full)] border border-[var(--dos-border)] bg-[var(--dos-surface-secondary)] px-3 py-1.5", className)} role="status" aria-live="polite">
            <span className="flex items-center gap-1" aria-hidden="true">
                <span className="dos-thinking-dot" />
                <span className="dos-thinking-dot" />
                <span className="dos-thinking-dot" />
            </span>
            <span className="text-xs font-medium text-[var(--dos-text-secondary)]">{label}</span>
        </div>
    );
}
