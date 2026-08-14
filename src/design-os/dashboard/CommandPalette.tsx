"use client";

import { useEffect, useState, useCallback } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { Search, Sparkles } from "lucide-react";
import { shellNavigation } from "@/src/config/shell-navigation";
import { searchCommands, parseNaturalLanguageCommand } from "@/src/modules/executive-command-center/services/command-registry";
import { searchEverything } from "@/src/modules/executive-command-center/services/smart-search.service";
import { useExecutiveShellStore } from "@/src/store/executive.store";
import { AiCommandPaletteMotion } from "@/src/design-os/immersive-v2";
import { AiThinkingIndicator } from "@/src/design-os/components/ai/AiThinkingIndicator";

export function CommandPalette() {
    const open = useExecutiveShellStore((s) => s.commandPaletteOpen);
    const setOpen = useExecutiveShellStore((s) => s.setCommandPaletteOpen);
    const snapshot = useExecutiveShellStore((s) => s.snapshot);
    const [query, setQuery] = useState("");
    const router = useRouter();

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setOpen(!open);
            }
            if (e.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open, setOpen]);

    const runSelect = useCallback(
        (href: string) => {
            router.push(href);
            setOpen(false);
            setQuery("");
        },
        [router, setOpen],
    );

    if (!open) {
        return <AiCommandPaletteMotion open={false}>{null}</AiCommandPaletteMotion>;
    }

    const nlCommand = parseNaturalLanguageCommand(query);
    const commandResults = searchCommands(query, 8);
    const searchResults = query.trim() ? searchEverything(query, snapshot, 8) : [];

    const showNav = !query.trim();
    const thinking = query.trim().length > 0 && commandResults.length === 0 && searchResults.length === 0 && !nlCommand;

    return (
        <AiCommandPaletteMotion open={open}>
            <div className="flex h-full items-start justify-center pt-[15vh]">
                <div className="absolute inset-0 bg-[var(--dos-surface-overlay)]" onClick={() => setOpen(false)} aria-hidden />
                <Command
                    className="immersive-command-palette dos-gpu relative z-10 w-full max-w-xl overflow-hidden rounded-[var(--dos-radius-2xl)] border border-[var(--dos-glass-border)] bg-[var(--dos-glass-bg)] shadow-[var(--dos-shadow-xl)] backdrop-blur-xl"
                    label="Executive command palette"
                    shouldFilter={false}
                >
                    <div className="flex items-center gap-2 border-b border-[var(--dos-border)] px-4">
                        <Search className="h-4 w-4 text-[var(--dos-text-tertiary)]" />
                        <Command.Input
                            value={query}
                            onValueChange={setQuery}
                            placeholder="Search everything or type a command..."
                            className="flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-[var(--dos-text-tertiary)]"
                            autoFocus
                        />
                        <kbd className="hidden rounded border border-[var(--dos-border)] px-1.5 py-0.5 text-[10px] text-[var(--dos-text-tertiary)] sm:inline">ESC</kbd>
                    </div>
                    {thinking ? (
                        <div className="px-4 py-3">
                            <AiThinkingIndicator />
                        </div>
                    ) : null}
                    <Command.List className="max-h-80 overflow-y-auto p-2">
                        <Command.Empty className="px-4 py-8 text-center text-sm text-[var(--dos-text-tertiary)]">
                            No results. Try &quot;create proposal&quot; or &quot;delayed projects&quot;.
                        </Command.Empty>

                        {nlCommand && nlCommand.href ? (
                            <Command.Group heading="Natural language match">
                                <Command.Item
                                    value={nlCommand.label}
                                    onSelect={() => nlCommand.href && runSelect(nlCommand.href)}
                                    className="flex cursor-pointer items-center gap-3 rounded-[var(--dos-radius-md)] px-3 py-2 text-sm aria-selected:bg-[var(--dos-surface-tertiary)]"
                                >
                                    <Sparkles className="h-4 w-4 text-[var(--dos-brand-primary)]" />
                                    <div>
                                        <p className="font-medium">{nlCommand.label}</p>
                                        <p className="text-xs text-[var(--dos-text-tertiary)]">{nlCommand.detail}</p>
                                    </div>
                                </Command.Item>
                            </Command.Group>
                        ) : null}

                        {commandResults.length > 0 && query.trim() ? (
                            <Command.Group heading="Commands">
                                {commandResults.map((cmd) => (
                                    <Command.Item
                                        key={cmd.id}
                                        value={cmd.label}
                                        onSelect={() => cmd.href && runSelect(cmd.href)}
                                        className="flex cursor-pointer items-center gap-3 rounded-[var(--dos-radius-md)] px-3 py-2 text-sm aria-selected:bg-[var(--dos-surface-tertiary)]"
                                    >
                                        <Sparkles className="h-4 w-4 text-[var(--dos-text-tertiary)]" />
                                        <div>
                                            <p className="font-medium">{cmd.label}</p>
                                            <p className="text-xs text-[var(--dos-text-tertiary)]">{cmd.detail}</p>
                                        </div>
                                    </Command.Item>
                                ))}
                            </Command.Group>
                        ) : null}

                        {searchResults.length > 0 ? (
                            <Command.Group heading="Smart search">
                                {searchResults.map((item) => (
                                    <Command.Item
                                        key={item.id}
                                        value={item.label}
                                        onSelect={() => item.href && runSelect(item.href)}
                                        className="flex cursor-pointer items-center gap-3 rounded-[var(--dos-radius-md)] px-3 py-2 text-sm aria-selected:bg-[var(--dos-surface-tertiary)]"
                                    >
                                        <Search className="h-4 w-4 text-[var(--dos-text-tertiary)]" />
                                        <div>
                                            <p className="font-medium">{item.label}</p>
                                            <p className="text-xs text-[var(--dos-text-tertiary)]">{item.detail}</p>
                                        </div>
                                    </Command.Item>
                                ))}
                            </Command.Group>
                        ) : null}

                        {showNav ? (
                            <Command.Group heading="Navigation">
                                {shellNavigation.slice(0, 12).map((item) => (
                                    <Command.Item
                                        key={item.href}
                                        value={item.label}
                                        onSelect={() => runSelect(item.href)}
                                        className="flex cursor-pointer items-center gap-3 rounded-[var(--dos-radius-md)] px-3 py-2 text-sm aria-selected:bg-[var(--dos-surface-tertiary)]"
                                    >
                                        <item.icon className="h-4 w-4 text-[var(--dos-text-tertiary)]" />
                                        <div>
                                            <p className="font-medium">{item.label}</p>
                                            <p className="text-xs text-[var(--dos-text-tertiary)]">{item.description}</p>
                                        </div>
                                    </Command.Item>
                                ))}
                            </Command.Group>
                        ) : null}
                    </Command.List>
                </Command>
            </div>
        </AiCommandPaletteMotion>
    );
}
