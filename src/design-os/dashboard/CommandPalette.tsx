"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { shellNavigation } from "@/src/config/shell-navigation";
import { Search } from "lucide-react";

export function CommandPalette() {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setOpen((v) => !v);
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[var(--dos-z-command)] flex items-start justify-center pt-[20vh]">
            <div className="absolute inset-0 bg-[var(--dos-surface-overlay)]" onClick={() => setOpen(false)} />
            <Command className="relative z-10 w-full max-w-lg overflow-hidden rounded-[var(--dos-radius-2xl)] border border-[var(--dos-border)] bg-[var(--dos-surface-elevated)] shadow-[var(--dos-shadow-xl)]" label="Command palette">
                <div className="flex items-center gap-2 border-b border-[var(--dos-border)] px-4">
                    <Search className="h-4 w-4 text-[var(--dos-text-tertiary)]" />
                    <Command.Input placeholder="Search modules and actions..." className="flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-[var(--dos-text-tertiary)]" />
                </div>
                <Command.List className="max-h-72 overflow-y-auto p-2">
                    <Command.Empty className="px-4 py-8 text-center text-sm text-[var(--dos-text-tertiary)]">No results found.</Command.Empty>
                    {shellNavigation.map((item) => (
                        <Command.Item key={item.href} value={item.label} onSelect={() => { router.push(item.href); setOpen(false); }} className="flex cursor-pointer items-center gap-3 rounded-[var(--dos-radius-md)] px-3 py-2 text-sm text-[var(--dos-text-primary)] aria-selected:bg-[var(--dos-surface-tertiary)]">
                            <item.icon className="h-4 w-4 text-[var(--dos-text-tertiary)]" />
                            <div>
                                <p className="font-medium">{item.label}</p>
                                <p className="text-xs text-[var(--dos-text-tertiary)]">{item.description}</p>
                            </div>
                        </Command.Item>
                    ))}
                </Command.List>
            </Command>
        </div>
    );
}
