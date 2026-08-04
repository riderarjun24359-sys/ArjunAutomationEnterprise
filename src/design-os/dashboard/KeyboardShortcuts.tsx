"use client";

import { useEffect, useState } from "react";
import { Dialog } from "@/src/design-os/components/Dialog";

const SHORTCUTS = [
    { keys: ["⌘", "K"], action: "Open command palette" },
    { keys: ["?"], action: "Show keyboard shortcuts" },
    { keys: ["Esc"], action: "Close overlay" },
];

export function KeyboardShortcuts() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "?" && !e.metaKey && !e.ctrlKey && !(e.target instanceof HTMLInputElement)) {
                e.preventDefault();
                setOpen(true);
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    return (
        <Dialog open={open} onClose={() => setOpen(false)} title="Keyboard Shortcuts">
            <ul className="space-y-3">
                {SHORTCUTS.map((s) => (
                    <li key={s.action} className="flex items-center justify-between text-sm">
                        <span className="text-[var(--dos-text-secondary)]">{s.action}</span>
                        <span className="flex gap-1">
                            {s.keys.map((k) => (
                                <kbd key={k} className="rounded border border-[var(--dos-border)] px-2 py-0.5 text-xs font-mono">{k}</kbd>
                            ))}
                        </span>
                    </li>
                ))}
            </ul>
        </Dialog>
    );
}
