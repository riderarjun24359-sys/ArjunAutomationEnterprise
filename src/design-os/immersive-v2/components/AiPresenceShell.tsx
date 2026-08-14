"use client";

import { m } from "framer-motion";
import { useReducedMotion } from "@/src/design-os/motion/hooks/useReducedMotion";
import { AiThinkingIndicator } from "@/src/design-os/components/ai/AiThinkingIndicator";
import { StreamingText } from "@/src/design-os/motion/components/StreamingText";
import { aiPresencePulse } from "../variants";
import { cn } from "@/src/lib/cn";

export type AiPresenceMode = "idle" | "thinking" | "streaming";

export function AiPresenceShell({
    mode = "idle",
    streamingText,
    className,
    children,
}: {
    mode?: AiPresenceMode;
    streamingText?: string;
    className?: string;
    children?: React.ReactNode;
}) {
    const reduced = useReducedMotion();

    return (
        <div className={cn("immersive-ai-presence dos-gpu rounded-[var(--dos-radius-2xl)] border border-[var(--dos-border-subtle)] bg-[var(--dos-glass-bg)] p-4 backdrop-blur-md", className)}>
            <div className="flex items-center gap-3">
                <m.span
                    className="inline-flex h-3 w-3 rounded-full bg-[var(--dos-brand-primary)]"
                    variants={reduced ? undefined : aiPresencePulse}
                    animate={reduced ? undefined : mode}
                    aria-hidden="true"
                />
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--dos-text-tertiary)]">
                    AI presence · {mode}
                </p>
            </div>
            {mode === "thinking" ? (
                <div className="mt-3">
                    <AiThinkingIndicator />
                </div>
            ) : null}
            {mode === "streaming" && streamingText ? (
                <div className="mt-3 text-sm text-[var(--dos-text-secondary)]">
                    <StreamingText chunks={streamingText.split(/(\s+)/).filter(Boolean)} />
                </div>
            ) : null}
            {children ? <div className="mt-3">{children}</div> : null}
        </div>
    );
}
