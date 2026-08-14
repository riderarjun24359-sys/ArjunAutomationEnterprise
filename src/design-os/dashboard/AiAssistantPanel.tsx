"use client";

import { AnimatePresence, m } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/src/lib/cn";
import { Button } from "@/src/design-os/components/Button";
import { Input } from "@/src/design-os/components/Input";
import { drawerPanel, modalOverlay } from "@/src/design-os/motion/variants";
import { useReducedMotion } from "@/src/design-os/motion/hooks/useReducedMotion";
import { AiThinkingIndicator } from "@/src/design-os/components/ai/AiThinkingIndicator";
import { AiTypingText } from "@/src/design-os/components/ai/AiTypingText";
import { AiState, AiStateIndicator } from "@/src/design-os/components/ai/AiStateIndicator";
import { useState } from "react";

export function AiAssistantPanel({ open, onClose, className }: { open: boolean; onClose: () => void; className?: string }) {
    const reduced = useReducedMotion();
    const [aiState] = useState<AiState>("idle");

    return (
        <AnimatePresence>
            {open ? (
                <>
                    <m.button
                        type="button"
                        aria-label="Close assistant overlay"
                        className="fixed inset-0 z-[var(--dos-z-overlay)] bg-[var(--dos-surface-overlay)] lg:hidden"
                        variants={reduced ? undefined : modalOverlay}
                        initial={reduced ? false : "hidden"}
                        animate="visible"
                        exit="exit"
                        onClick={onClose}
                    />
                    <m.aside
                        className={cn(
                            "dos-gpu fixed inset-y-0 right-0 z-[var(--dos-z-modal)] flex w-full max-w-md flex-col border-l border-[var(--dos-border)] bg-[var(--dos-surface-elevated)] shadow-[var(--dos-elevation-4)]",
                            className,
                        )}
                        variants={reduced ? undefined : drawerPanel}
                        initial={reduced ? false : "hidden"}
                        animate="visible"
                        exit="exit"
                        role="dialog"
                        aria-modal="true"
                        aria-label="AI Assistant"
                    >
                        <div className="flex items-center justify-between border-b border-[var(--dos-border)] px-4 py-3">
                            <div className="flex items-center gap-2">
                                <AiStateIndicator state={aiState} size={30} />
                                <span className="font-semibold text-[var(--dos-text-primary)]">AI Assistant</span>
                            </div>
                            <button
                                type="button"
                                onClick={onClose}
                                className="dos-focus-ring dos-interactive rounded-[var(--dos-radius-md)] p-1 text-[var(--dos-text-tertiary)] hover:bg-[var(--dos-surface-tertiary)]"
                                aria-label="Close assistant"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
                            <div className="flex justify-center py-4">
                                <AiThinkingIndicator />
                            </div>
                            <div className="rounded-[var(--dos-radius-xl)] border border-[var(--dos-border)] bg-[var(--dos-surface-secondary)] p-3 text-sm text-[var(--dos-text-secondary)]">
                                <AiTypingText text="Ask anything about your workspace, modules, or live data. Answers stream with premium motion." />
                            </div>

                            <div className="mt-auto flex gap-2 pt-2">
                                <Input placeholder="Ask a question..." aria-label="Ask the AI assistant" />
                                <Button size="sm">Send</Button>
                            </div>
                        </div>
                    </m.aside>
                </>
            ) : null}
        </AnimatePresence>
    );
}
