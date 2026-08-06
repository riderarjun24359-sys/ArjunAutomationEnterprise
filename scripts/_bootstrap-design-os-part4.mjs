/**
 * Bootstrap V4 Design OS — Part 4: Dashboard, Guidelines, Module, Integration
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";

const root = process.cwd();

function write(rel, content) {
    const full = join(root, rel);
    mkdirSync(dirname(full), { recursive: true });
    writeFileSync(full, content, "utf8");
    console.log("wrote", rel);
}

// DASHBOARD
write("src/design-os/dashboard/DashboardShell.tsx", `"use client";

import { PremiumSidebar } from "./PremiumSidebar";
import { DashboardToolbar } from "./DashboardToolbar";
import { CommandPalette } from "./CommandPalette";
import { KeyboardShortcuts } from "./KeyboardShortcuts";
import { cn } from "@/src/lib/cn";

interface DashboardShellProps {
    children: React.ReactNode;
    title?: string;
    className?: string;
}

export function DashboardShell({ children, title, className }: DashboardShellProps) {
    return (
        <div className={cn("min-h-screen bg-[var(--dos-surface-secondary)] text-[var(--dos-text-primary)]", className)}>
            <CommandPalette />
            <KeyboardShortcuts />
            <div className="flex min-h-screen">
                <div className="hidden lg:block">
                    <PremiumSidebar className="sticky top-0 h-screen" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                    <DashboardToolbar title={title} />
                    <main className="flex-1 overflow-x-hidden px-4 py-6 sm:px-6 lg:px-8">{children}</main>
                </div>
            </div>
        </div>
    );
}
`);

write("src/design-os/dashboard/PremiumSidebar.tsx", `"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { primaryShellNavigation, secondaryShellNavigation } from "@/src/config/shell-navigation";
import { NavLink } from "@/src/components/layout/NavLink";
import { appConfig } from "@/src/config/app";
import { cn } from "@/src/lib/cn";
import { useAppStore } from "@/src/store/app.store";

export function PremiumSidebar({ className }: { className?: string }) {
    const sidebarOpen = useAppStore((s) => s.sidebarOpen);
    const toggleSidebar = useAppStore((s) => s.toggleSidebar);

    return (
        <aside className={cn("dos-glass flex h-full flex-col border-r border-[var(--dos-border)]", sidebarOpen ? "w-72" : "w-[84px]", className)}>
            <div className="flex items-center justify-between gap-3 border-b border-[var(--dos-border)] px-4 py-4">
                <div className={cn("min-w-0", !sidebarOpen && "mx-auto")}>
                    {sidebarOpen ? (
                        <>
                            <p className="truncate text-sm font-semibold text-[var(--dos-text-primary)]">{appConfig.name}</p>
                            <p className="truncate text-xs text-[var(--dos-text-tertiary)]">Design OS</p>
                        </>
                    ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-[var(--dos-radius-xl)] bg-[var(--dos-brand-primary)]/15 text-sm font-semibold text-[var(--dos-brand-primary)]">AO</div>
                    )}
                </div>
                <button type="button" onClick={toggleSidebar} className="hidden rounded-[var(--dos-radius-lg)] border border-[var(--dos-border)] p-2 text-[var(--dos-text-tertiary)] hover:bg-[var(--dos-surface-tertiary)] lg:inline-flex" aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}>
                    {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
                </button>
            </div>
            <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
                <div className="space-y-1">
                    {sidebarOpen ? <p className="px-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--dos-text-tertiary)]">Operations</p> : null}
                    {primaryShellNavigation.map((item) => <NavLink key={item.href} item={item} collapsed={!sidebarOpen} />)}
                </div>
                <div className="space-y-1">
                    {sidebarOpen ? <p className="px-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--dos-text-tertiary)]">Platform</p> : null}
                    {secondaryShellNavigation.map((item) => <NavLink key={item.href} item={item} collapsed={!sidebarOpen} />)}
                </div>
            </nav>
        </aside>
    );
}
`);

write("src/design-os/dashboard/CommandPalette.tsx", `"use client";

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
`);

write("src/design-os/dashboard/DockNav.tsx", `"use client";

import { cn } from "@/src/lib/cn";

export function DockNav({ items, className }: { items: { icon: React.ReactNode; label: string; onClick?: () => void; active?: boolean }[]; className?: string }) {
    return (
        <nav className={cn("dos-glass fixed bottom-6 left-1/2 z-[var(--dos-z-sticky)] flex -translate-x-1/2 gap-1 rounded-[var(--dos-radius-full)] border border-[var(--dos-border)] p-1.5 shadow-[var(--dos-shadow-lg)]", className)}>
            {items.map((item) => (
                <button key={item.label} type="button" onClick={item.onClick} className={cn("flex flex-col items-center gap-0.5 rounded-[var(--dos-radius-full)] px-4 py-2 text-xs transition", item.active ? "bg-[var(--dos-brand-primary)] text-white" : "text-[var(--dos-text-secondary)] hover:bg-[var(--dos-surface-tertiary)]")} aria-label={item.label}>
                    {item.icon}
                    <span className="hidden sm:inline">{item.label}</span>
                </button>
            ))}
        </nav>
    );
}
`);

write("src/design-os/dashboard/KpiCard.tsx", `"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/src/design-os/components/Card";
import { AnimatedCounter } from "@/src/design-os/motion/components/AnimatedCounter";
import { cn } from "@/src/lib/cn";

export function KpiCard({ title, value, suffix, trend, trendLabel, className }: { title: string; value: number; suffix?: string; trend?: "up" | "down"; trendLabel?: string; className?: string }) {
    return (
        <Card hover className={cn(className)}>
            <p className="text-sm font-medium text-[var(--dos-text-secondary)]">{title}</p>
            <div className="mt-2 flex items-end justify-between gap-4">
                <p className="text-3xl font-semibold text-[var(--dos-text-primary)]">
                    <AnimatedCounter value={value} suffix={suffix} />
                </p>
                {trend ? (
                    <div className={cn("flex items-center gap-1 rounded-[var(--dos-radius-lg)] px-2 py-1 text-xs font-medium", trend === "up" ? "bg-[var(--dos-success-muted)] text-[var(--dos-success)]" : "bg-[var(--dos-error-muted)] text-[var(--dos-error)]")}>
                        {trend === "up" ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                        {trendLabel}
                    </div>
                ) : null}
            </div>
            <div className="mt-4 h-8 rounded-[var(--dos-radius-md)] bg-gradient-to-r from-[var(--dos-brand-primary)]/20 to-transparent" aria-hidden="true" />
        </Card>
    );
}
`);

write("src/design-os/dashboard/GlassWidget.tsx", `"use client";

import { cn } from "@/src/lib/cn";

export function GlassWidget({ title, children, className, action }: { title?: string; children: React.ReactNode; className?: string; action?: React.ReactNode }) {
    return (
        <div className={cn("dos-glass rounded-[var(--dos-radius-2xl)] p-6", className)}>
            {title ? (
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-base font-semibold text-[var(--dos-text-primary)]">{title}</h3>
                    {action}
                </div>
            ) : null}
            {children}
        </div>
    );
}
`);

write("src/design-os/dashboard/ActivityFeed.tsx", `"use client";

import { cn } from "@/src/lib/cn";

export interface ActivityItem { id: string; title: string; description: string; time: string; type?: "info" | "success" | "warning" }

export function ActivityFeed({ items, className }: { items: ActivityItem[]; className?: string }) {
    return (
        <ul className={cn("space-y-3", className)}>
            {items.map((item) => (
                <li key={item.id} className="flex gap-3 rounded-[var(--dos-radius-lg)] border border-[var(--dos-border-subtle)] p-3">
                    <div className={cn("mt-1 h-2 w-2 shrink-0 rounded-full", item.type === "success" ? "bg-[var(--dos-success)]" : item.type === "warning" ? "bg-[var(--dos-warning)]" : "bg-[var(--dos-brand-primary)]")} />
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-[var(--dos-text-primary)]">{item.title}</p>
                        <p className="text-xs text-[var(--dos-text-secondary)]">{item.description}</p>
                        <p className="mt-1 text-xs text-[var(--dos-text-tertiary)]">{item.time}</p>
                    </div>
                </li>
            ))}
        </ul>
    );
}
`);

write("src/design-os/dashboard/NotificationCenter.tsx", `"use client";

import { Bell } from "lucide-react";
import { Dropdown, DropdownItem } from "@/src/design-os/components/Dropdown";
import { Badge } from "@/src/design-os/components/Badge";

export function NotificationCenter({ count = 0, items }: { count?: number; items: { id: string; title: string; time: string }[] }) {
    return (
        <Dropdown
            trigger={
                <button type="button" className="relative flex h-9 w-9 items-center justify-center rounded-[var(--dos-radius-lg)] border border-[var(--dos-border)] bg-[var(--dos-surface-secondary)] text-[var(--dos-text-secondary)] hover:text-[var(--dos-text-primary)]" aria-label="Notifications">
                    <Bell className="h-4 w-4" />
                    {count > 0 ? <Badge variant="error" className="absolute -right-1 -top-1 min-w-[18px] justify-center px-1 py-0 text-[10px]">{count}</Badge> : null}
                </button>
            }
        >
            {items.length === 0 ? <DropdownItem>No notifications</DropdownItem> : items.map((item) => (
                <DropdownItem key={item.id}>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-[var(--dos-text-tertiary)]">{item.time}</p>
                </DropdownItem>
            ))}
        </Dropdown>
    );
}
`);

write("src/design-os/dashboard/AiAssistantPanel.tsx", `"use client";

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
`);

write("src/design-os/dashboard/SmartSearch.tsx", `"use client";

import { Search } from "lucide-react";
import { cn } from "@/src/lib/cn";

export function SmartSearch({ className, onFocus }: { className?: string; onFocus?: () => void }) {
    return (
        <label className={cn("relative block", className)}>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--dos-text-tertiary)]" />
            <input
                type="search"
                placeholder="Search modules, records, and actions..."
                onFocus={onFocus}
                className="w-full rounded-[var(--dos-radius-2xl)] border border-[var(--dos-border)] bg-[var(--dos-surface-secondary)] py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[var(--dos-border-focus)] focus:ring-2 focus:ring-[var(--dos-border-focus)]/20"
            />
            <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-[var(--dos-border)] px-1.5 py-0.5 text-[10px] text-[var(--dos-text-tertiary)] sm:inline">⌘K</kbd>
        </label>
    );
}
`);

write("src/design-os/dashboard/KeyboardShortcuts.tsx", `"use client";

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
`);

write("src/design-os/dashboard/DashboardToolbar.tsx", `"use client";

import { Menu } from "lucide-react";
import { SmartSearch } from "./SmartSearch";
import { NotificationCenter } from "./NotificationCenter";
import { ThemeToggle } from "@/src/design-os/components/ThemeToggle";
import { UserMenu } from "@/src/components/layout/UserMenu";
import { useAppStore } from "@/src/store/app.store";
import { shellRouteLabels } from "@/src/config/shell-navigation";
import { usePathname } from "next/navigation";

export function DashboardToolbar({ title }: { title?: string }) {
    const pathname = usePathname();
    const toggleMobileMenu = useAppStore((s) => s.toggleMobileMenu);
    const resolvedTitle = title ?? shellRouteLabels[pathname] ?? "Workspace";

    return (
        <header className="sticky top-0 z-[var(--dos-z-sticky)] border-b border-[var(--dos-border)] bg-[var(--dos-surface-elevated)]/90 backdrop-blur-md">
            <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
                <div className="flex min-w-0 items-center gap-3">
                    <button type="button" onClick={toggleMobileMenu} className="rounded-[var(--dos-radius-xl)] border border-[var(--dos-border)] p-2 text-[var(--dos-text-secondary)] hover:bg-[var(--dos-surface-tertiary)] lg:hidden" aria-label="Open navigation menu">
                        <Menu className="h-5 w-5" />
                    </button>
                    <div className="min-w-0">
                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--dos-brand-primary)]">Enterprise Shell</p>
                        <h1 className="truncate text-lg font-semibold text-[var(--dos-text-primary)]">{resolvedTitle}</h1>
                    </div>
                </div>
                <div className="hidden max-w-md flex-1 px-4 md:block">
                    <SmartSearch />
                </div>
                <div className="flex items-center gap-2">
                    <NotificationCenter count={2} items={[{ id: "1", title: "System update complete", time: "2m ago" }, { id: "2", title: "New module available", time: "1h ago" }]} />
                    <ThemeToggle />
                    <UserMenu />
                </div>
            </div>
        </header>
    );
}
`);

write("src/design-os/dashboard/index.ts", `export { DashboardShell } from "./DashboardShell";
export { PremiumSidebar } from "./PremiumSidebar";
export { CommandPalette } from "./CommandPalette";
export { DockNav } from "./DockNav";
export { KpiCard } from "./KpiCard";
export { GlassWidget } from "./GlassWidget";
export { ActivityFeed } from "./ActivityFeed";
export { NotificationCenter } from "./NotificationCenter";
export { AiAssistantPanel } from "./AiAssistantPanel";
export { SmartSearch } from "./SmartSearch";
export { KeyboardShortcuts } from "./KeyboardShortcuts";
export { DashboardToolbar } from "./DashboardToolbar";
`);

// WEBSITE
write("src/design-os/website/standards.ts", `/** Website section requirements and constants for marketing pages */
export const WEBSITE_SECTIONS = {
    hero: { minHeight: "80vh", requiredElements: ["headline", "subheadline", "cta", "visual"] },
    features: { minItems: 3, layout: "grid" },
    socialProof: { minItems: 2, types: ["logos", "testimonials", "metrics"] },
    cta: { requiredElements: ["headline", "primaryAction"] },
    footer: { requiredElements: ["links", "legal", "brand"] },
} as const;

export const WEBSITE_MOTION = {
    heroEntrance: "fadeUp",
    sectionReveal: "staggerContainer",
    pageTransition: "pageTransition",
} as const;

export const WEBSITE_TOKENS = {
    maxContentWidth: "1280px",
    sectionPadding: "96px",
    heroGradient: "var(--dos-brand-primary)",
} as const;
`);

write("src/design-os/website/index.ts", `export * from "./standards";
export { PageTransition, StaggerReveal, StaggerRevealItem, AnimatedCounter, FloatingElement } from "@/src/design-os/motion";
`);

// RULES
write("src/design-os/rules.ts", `/**
 * MANDATORY Design OS integration rules for all Arjun Automation modules.
 * Every module MUST import UI primitives, tokens, and motion from @/src/design-os.
 */
export const MANDATORY_RULES = [
    "All modules MUST import UI components from @/src/design-os or @/src/design-os/components — never duplicate Button, Card, Input, etc.",
    "All modules MUST use design-os CSS variables (--dos-*) for colors, spacing, typography, radii, shadows, and motion — no hardcoded hex in components.",
    "All modules MUST use @/src/design-os/motion hooks (useReducedMotion, useMagnetic, useStagger) — never duplicate motion hooks.",
    "All dashboard pages MUST use DashboardShell from @/src/design-os/dashboard or extend it — never create standalone shell layouts.",
    "All marketing/website pages MUST import motion components from @/src/design-os/motion or @/src/design-os/website.",
    "Theme support MUST use .dark class with design-os.css variables — compatible with next-themes attribute='class'.",
    "New components MUST use cn() from @/src/lib/cn with design-os token classes or CSS vars.",
    "Accessibility: all interactive components MUST have aria labels, focus rings using --dos-border-focus, and respect prefers-reduced-motion.",
] as const;

export type MandatoryRule = (typeof MANDATORY_RULES)[number];
`);

write("src/design-os/index.ts", `export * from "./tokens";
export * from "./motion";
export * from "./components";
export * from "./dashboard";
export * from "./website";
export { MANDATORY_RULES } from "./rules";
export type { MandatoryRule } from "./rules";
`);

// GUIDELINES
const guidelines = {
    philosophy: `# Design OS Philosophy

Design OS is the permanent UI/UX engineering standard for the entire Arjun Automation ecosystem. It is not a redesign — it is the mandatory design system that all modules must follow.

## Principles

1. **Consistency over novelty** — Use shared tokens and components before creating module-specific UI.
2. **Premium enterprise feel** — Glass surfaces, subtle motion, and refined typography convey trust.
3. **Accessibility first** — Reduced motion, focus states, and semantic HTML are non-negotiable.
4. **Token-driven** — All visual properties flow from \`src/design-os/tokens/\` and \`design-os.css\`.
5. **Composable** — Small, focused components compose into dashboards and marketing pages.
`,
    typography: `# Typography

Design OS uses a modular type scale defined in \`tokens/typography.ts\`.

## Scale

- **Display** — 3.75rem, hero headlines
- **H1–H6** — Section hierarchy
- **Body / Body Sm** — Content and UI text
- **Caption** — Labels, metadata
- **Mono** — Code, keyboard shortcuts

## Usage

Apply via CSS classes (\`.dos-text-h1\`, etc.) or CSS variables (\`--dos-font-sans\`).
`,
    spacing: `# Spacing

Design OS uses an **8pt spacing system** (0–96 in 8px increments).

Use \`tokens/spacing.ts\` for programmatic values and \`--dos-space-*\` CSS variables in stylesheets.

## Guidelines

- Section padding: 48–96px
- Component internal padding: 16–24px
- Stack spacing: multiples of 8px
`,
    motion: `# Motion

Motion is defined in \`tokens/motion.ts\` and \`motion/variants.ts\`.

## Rules

- Always check \`useReducedMotion()\` before animating
- Page transitions: 500ms max
- Stagger delays: 40–120ms between items
- Spring configs for interactive elements only

## Variants

fadeUp, staggerContainer, staggerItem, scaleIn, slideIn, pageTransition
`,
    components: `# Components

The component library lives in \`src/design-os/components/\`.

## Required imports

\`\`\`tsx
import { Button, Card, Input } from "@/src/design-os/components";
\`\`\`

## Variants

Button: primary, secondary, ghost, danger
Card: glass, hover elevation
Badge: default, success, warning, error, info
`,
    dashboard: `# Dashboard Standard

Enterprise dashboards use \`DashboardShell\` from \`src/design-os/dashboard/\`.

## Features

- PremiumSidebar with glass navigation
- CommandPalette (⌘K)
- SmartSearch, NotificationCenter, ThemeToggle
- KpiCard with animated counters
- Keyboard shortcuts overlay (?)

## Usage

\`\`\`tsx
import { DashboardShell, KpiCard } from "@/src/design-os/dashboard";
\`\`\`
`,
    website: `# Website Standard

Marketing pages use \`src/design-os/website/standards.ts\` for section requirements.

## Sections

Hero, Features, Social Proof, CTA, Footer — each with required elements.

## Motion

Re-export motion components from \`@/src/design-os/website\` for marketing use.
`,
    accessibility: `# Accessibility

## Requirements

- WCAG 2.1 AA contrast for text on surfaces
- Focus rings using \`--dos-border-focus\`
- \`prefers-reduced-motion\` respected via \`useReducedMotion\`
- Semantic HTML and ARIA labels on all interactive elements
- Keyboard navigation for CommandPalette, Dialog, Tabs
`,
    illustration: `# Illustration

## Style

- Isometric and abstract platform visuals
- Brand palette: indigo, cyan, violet
- Subtle gradients and glow — never flat stock imagery
- SVG preferred for scalability

## Assets

Module-specific illustrations live in module folders but MUST use design-os color tokens.
`,
};

for (const [name, content] of Object.entries(guidelines)) {
    write(`src/design-os/guidelines/${name}.md`, content);
}

console.log("Part 4 complete");
