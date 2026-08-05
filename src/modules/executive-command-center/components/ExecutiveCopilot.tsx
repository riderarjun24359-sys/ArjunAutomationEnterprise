"use client";

import { Bot, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/src/design-os/components/Button";
import { cn } from "@/src/lib/cn";
import { useExecutiveCopilot } from "../hooks/useExecutiveCopilot";
import type { ExecutiveCommandCenterSnapshot } from "../types";

export function ExecutiveCopilot({
    open,
    onClose,
    snapshot,
    className,
}: {
    open: boolean;
    onClose: () => void;
    snapshot: ExecutiveCommandCenterSnapshot | null;
    className?: string;
}) {
    const { messages, sendMessage, pendingApproval, approvePending, dismissPending } = useExecutiveCopilot(snapshot);
    const [input, setInput] = useState("");

    const handleSend = () => {
        sendMessage(input);
        setInput("");
    };

    return (
        <div
            className={cn(
                "fixed inset-y-0 right-0 z-[var(--dos-z-modal)] flex w-full max-w-md flex-col border-l border-[var(--dos-border)] bg-[var(--dos-surface-elevated)] shadow-[var(--dos-shadow-xl)] transition-transform duration-300",
                open ? "translate-x-0" : "translate-x-full",
                className,
            )}
        >
            <div className="flex items-center justify-between border-b border-[var(--dos-border)] px-4 py-3">
                <div className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-[var(--dos-brand-primary)]" />
                    <span className="font-semibold text-[var(--dos-text-primary)]">Executive Copilot</span>
                </div>
                <button type="button" onClick={onClose} className="rounded-[var(--dos-radius-md)] p-1 text-[var(--dos-text-tertiary)] hover:bg-[var(--dos-surface-tertiary)]" aria-label="Close copilot">
                    <X className="h-5 w-5" />
                </button>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={cn(
                            "rounded-[var(--dos-radius-lg)] px-3 py-2 text-sm",
                            msg.role === "user"
                                ? "ml-8 bg-[var(--dos-brand-primary)]/10 text-[var(--dos-text-primary)]"
                                : "mr-8 bg-[var(--dos-surface-secondary)] text-[var(--dos-text-secondary)]",
                        )}
                    >
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                ))}
                {pendingApproval ? (
                    <div className="rounded-[var(--dos-radius-lg)] border border-amber-300 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950/30">
                        <p className="text-sm font-medium text-amber-800 dark:text-amber-200">Approval required</p>
                        <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">{pendingApproval.content}</p>
                        <div className="mt-3 flex gap-2">
                            <Button size="sm" onClick={approvePending}>Approve</Button>
                            <Button size="sm" variant="secondary" onClick={dismissPending}>Dismiss</Button>
                        </div>
                    </div>
                ) : null}
            </div>
            <div className="border-t border-[var(--dos-border)] p-4">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        placeholder="Ask about risks, opportunities, clients..."
                        className="flex-1 rounded-[var(--dos-radius-lg)] border border-[var(--dos-border)] bg-[var(--dos-surface-secondary)] px-3 py-2 text-sm outline-none focus:border-[var(--dos-border-focus)]"
                    />
                    <Button size="sm" onClick={handleSend}>Send</Button>
                </div>
                <p className="mt-2 text-[10px] text-[var(--dos-text-tertiary)]">Critical actions require explicit approval. Copilot never executes destructive operations automatically.</p>
            </div>
        </div>
    );
}
