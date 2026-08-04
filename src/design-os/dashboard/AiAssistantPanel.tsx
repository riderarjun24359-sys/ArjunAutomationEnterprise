"use client";

import { Bot, X } from "lucide-react";
import { cn } from "@/src/lib/cn";
import { Button } from "@/src/design-os/components/Button";

export function AiAssistantPanel({ open, onClose, className }: { open: boolean; onClose: () => void; className?: string }) {
    return (
        <div className={cn("fixed inset-y-0 right-0 z-[var(--dos-z-modal)] w-full max-w-md transform border-l border-[var(--dos-border)] bg-[var(--dos-surface-elevated)] shadow-[var(--dos-shadow-xl)] transition-transform duration-300", open ? "translate-x-0" : "translate-x-full", className)}>
            <div className="flex items-center justify-between border-b border-[var(--dos-border)] px-4 py-3">
                <div className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-[var(--dos-brand-primary)]" />
                    <span className="font-semibold text-[var(--dos-text-primary)]">AI Assistant</span>
                </div>
                <button type="button" onClick={onClose} className="rounded-[var(--dos-radius-md)] p-1 text-[var(--dos-text-tertiary)] hover:bg-[var(--dos-surface-tertiary)]" aria-label="Close assistant">
                    <X className="h-5 w-5" />
                </button>
            </div>
            <div className="flex flex-1 flex-col p-4">
                <p className="text-sm text-[var(--dos-text-secondary)]">Ask anything about your workspace, modules, or data.</p>
                <div className="mt-auto flex gap-2 pt-4">
                    <input type="text" placeholder="Ask a question..." className="flex-1 rounded-[var(--dos-radius-lg)] border border-[var(--dos-border)] bg-[var(--dos-surface-secondary)] px-3 py-2 text-sm outline-none focus:border-[var(--dos-border-focus)]" />
                    <Button size="sm">Send</Button>
                </div>
            </div>
        </div>
    );
}
