/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Command } from "cmdk";
import { useRouter, usePathname } from "next/navigation";
import { Search, Sparkles, Terminal, LucideIcon } from "lucide-react";
import { shellNavigation } from "@/src/config/shell-navigation";
import { navigationContextMap } from "@/src/config/navigation-context";
import { resolveCommand } from "@/src/design-os/navigation/command-resolver";
import { resolveNavigationContext } from "@/src/design-os/navigation/navigation-context-engine";
import { searchCommands, parseNaturalLanguageCommand } from "@/src/modules/executive-command-center/services/command-registry";
import { searchEverything } from "@/src/modules/executive-command-center/services/smart-search.service";
import { useExecutiveShellStore } from "@/src/store/executive.store";
import { AiCommandPaletteMotion } from "@/src/design-os/immersive-v2";
import { AiThinkingIndicator } from "@/src/design-os/components/ai/AiThinkingIndicator";
import { IntentResponse } from "@/src/design-os/navigation/intent";

export function CommandPalette() {
    const open = useExecutiveShellStore((s) => s.commandPaletteOpen);
    const setOpen = useExecutiveShellStore((s) => s.setCommandPaletteOpen);
    const snapshot = useExecutiveShellStore((s) => s.snapshot);
    const [query, setQuery] = useState("");
    const [aiResponse, setAiResponse] = useState<IntentResponse | null>(null);
    const [loadingAi, setLoadingAi] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);
    const router = useRouter();
    const pathname = usePathname();

    const { persistent, contextual, library } = resolveNavigationContext({
        currentPath: pathname,
        authorizedNavigation: shellNavigation,
        explicitRelationships: navigationContextMap,
        snapshot: {
            runningAutomations: snapshot?.runningAutomations ?? 0,
            pendingApprovals: snapshot?.pendingApprovals ?? 0,
            criticalRisks: snapshot?.criticalRisks ?? 0,
        }
    });

    useEffect(() => {
        if (!query.trim()) {
            setAiResponse(null);
            setLoadingAi(false);
            if (abortControllerRef.current) abortControllerRef.current.abort();
            return;
        }
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setAiResponse(null);
        setLoadingAi(true);
        // ... rest of logic

        // Deterministic checks
        const commandResolution = resolveCommand(query, shellNavigation);
        const nlCommand = parseNaturalLanguageCommand(query);
        const commandResults = searchCommands(query, 1);
        const searchResults = searchEverything(query, snapshot, 1);

        if (commandResolution || nlCommand || commandResults.length > 0 || searchResults.length > 0) {
            setAiResponse(null);
            setLoadingAi(false);
            return;
        }

        // Trigger AI fallback
        if (abortControllerRef.current) abortControllerRef.current.abort();
        abortControllerRef.current = new AbortController();
        setLoadingAi(true);

        const fetchIntent = async () => {
            try {
                const response = await fetch("/api/ai/intent", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ rawInput: query }),
                    signal: abortControllerRef.current?.signal,
                });

                if (!response.ok) throw new Error("Failed");
                const intentResponse: IntentResponse = await response.json();
                setAiResponse(intentResponse);
            } catch (e) {
                // Ignore abort errors
                if (e instanceof Error && e.name === "AbortError") return;
                setAiResponse(null);
            } finally {
                setLoadingAi(false);
            }
        };

        const timeout = setTimeout(fetchIntent, 300); // Debounce
        return () => clearTimeout(timeout);
    }, [query, snapshot]);

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

    const commandResolution = query.trim() ? resolveCommand(query, shellNavigation) : null;
    const nlCommand = parseNaturalLanguageCommand(query);
    const commandResults = searchCommands(query, 8);
    const searchResults = query.trim() ? searchEverything(query, snapshot, 8) : [];
    const showNav = !query.trim();
    const thinking = loadingAi;

    const renderNavItem = (item: { icon: LucideIcon, label: string, description: string, href: string }) => (
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
    );

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

                        {commandResolution && (
                            <Command.Group heading="Command Match">
                                <Command.Item
                                    value={commandResolution.item.label}
                                    onSelect={() => runSelect(commandResolution.item.href)}
                                    className="flex cursor-pointer items-center gap-3 rounded-[var(--dos-radius-md)] px-3 py-2 text-sm aria-selected:bg-[var(--dos-surface-tertiary)]"
                                >
                                    <Terminal className="h-4 w-4 text-[var(--dos-brand-primary)]" />
                                    <div>
                                        <p className="font-medium">{commandResolution.item.label}</p>
                                        <p className="text-xs text-[var(--dos-text-tertiary)]">({commandResolution.matchType})</p>
                                    </div>
                                </Command.Item>
                            </Command.Group>
                        )}
                        {aiResponse?.primaryIntent && (
                             <Command.Group heading="Interpreted command">
                                <Command.Item
                                    value={aiResponse.primaryIntent.moduleHref}
                                    onSelect={() => runSelect(aiResponse.primaryIntent!.moduleHref)}
                                    className="flex cursor-pointer items-center gap-3 rounded-[var(--dos-radius-md)] px-3 py-2 text-sm aria-selected:bg-[var(--dos-surface-tertiary)]"
                                >
                                    <Sparkles className="h-4 w-4 text-[var(--dos-brand-primary)]" />
                                    <div>
                                        <p className="font-medium">AI: {aiResponse.primaryIntent.moduleHref}</p>
                                        <p className="text-xs text-[var(--dos-text-tertiary)]">{aiResponse.primaryIntent.rawInput}</p>
                                    </div>
                                </Command.Item>
                            </Command.Group>
                        )}
                        {aiResponse?.candidates && aiResponse.candidates.length > 0 && (
                            <Command.Group heading="Suggested Actions">
                                {aiResponse.candidates.map((candidate, idx) => (
                                    <Command.Item
                                        key={idx}
                                        value={candidate.moduleHref}
                                        onSelect={() => runSelect(candidate.moduleHref)}
                                        className="flex cursor-pointer items-center gap-3 rounded-[var(--dos-radius-md)] px-3 py-2 text-sm aria-selected:bg-[var(--dos-surface-tertiary)]"
                                    >
                                        <Sparkles className="h-4 w-4 text-[var(--dos-brand-primary)]" />
                                        <div>
                                            <p className="font-medium">{candidate.moduleHref}</p>
                                            <p className="text-xs text-[var(--dos-text-tertiary)]">{candidate.reason}</p>
                                        </div>
                                    </Command.Item>
                                ))}
                            </Command.Group>
                        )}
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
                            <>
                                <Command.Group heading="Persistent">
                                    {persistent.map(renderNavItem)}
                                </Command.Group>
                                {contextual.length > 0 && (
                                    <Command.Group heading="Contextual">
                                        {contextual.map(renderNavItem)}
                                    </Command.Group>
                                )}
                                <Command.Group heading="Library">
                                    {library.slice(0, 12).map(renderNavItem)}
                                </Command.Group>
                            </>
                        ) : null}
                    </Command.List>
                </Command>
            </div>
        </AiCommandPaletteMotion>
    );
}
