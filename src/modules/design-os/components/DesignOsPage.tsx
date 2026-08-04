"use client";

import { useState } from "react";
import { DESIGN_OS_TAB_LIST, DESIGN_OS_TABS, DESIGN_OS_THEME } from "@/src/modules/design-os/constants";
import { MANDATORY_RULES } from "@/src/design-os/rules";
import { Tabs } from "@/src/design-os/components/Tabs";
import { Card } from "@/src/design-os/components/Card";
import { Badge } from "@/src/design-os/components/Badge";
import { Button } from "@/src/design-os/components/Button";
import { KpiCard } from "@/src/design-os/dashboard/KpiCard";
import { PageTransition } from "@/src/design-os/motion/components/PageTransition";
import { StaggerReveal, StaggerRevealItem } from "@/src/design-os/motion/components/StaggerReveal";
import { WEBSITE_SECTIONS } from "@/src/design-os/website/standards";

const TOKEN_FILES = ["colors", "typography", "spacing", "grid", "radii", "elevation", "motion", "blur", "glass", "breakpoints", "semantic"];
const COMPONENT_LIST = ["Button", "Input", "Textarea", "Select", "Card", "Dialog", "Table", "ChartContainer", "Form", "Dropdown", "Tabs", "Badge", "Notification", "LoadingState", "EmptyState", "ErrorState", "AnimatedLink", "ThemeToggle"];
const DASHBOARD_LIST = ["DashboardShell", "PremiumSidebar", "CommandPalette", "DockNav", "KpiCard", "GlassWidget", "ActivityFeed", "NotificationCenter", "AiAssistantPanel", "SmartSearch", "KeyboardShortcuts", "DashboardToolbar"];
const GUIDELINE_FILES = ["philosophy", "typography", "spacing", "motion", "components", "dashboard", "website", "accessibility", "illustration"];

export function DesignOsPage() {
    const [activeTab, setActiveTab] = useState<string>(DESIGN_OS_TABS.overview);

    return (
        <PageTransition className="mx-auto max-w-6xl space-y-8">
            <div>
                <Badge variant="info">V4 Design OS</Badge>
                <h1 className="mt-3 text-3xl font-bold text-[var(--dos-text-primary)]">Design OS</h1>
                <p className="mt-2 max-w-2xl text-[var(--dos-text-secondary)]">
                    Permanent UI/UX engineering standard for the entire Arjun Automation ecosystem. All modules MUST import from <code className="rounded bg-[var(--dos-surface-tertiary)] px-1 text-sm">@/src/design-os</code>.
                </p>
            </div>

            <Tabs tabs={DESIGN_OS_TAB_LIST.map((t) => ({ id: t.id, label: t.label }))} active={activeTab} onChange={setActiveTab} />

            {activeTab === DESIGN_OS_TABS.overview && (
                <StaggerReveal className="grid gap-6 md:grid-cols-3">
                    <StaggerRevealItem><KpiCard title="Token Files" value={11} trend="up" trendLabel="Complete" /></StaggerRevealItem>
                    <StaggerRevealItem><KpiCard title="Components" value={18} trend="up" trendLabel="Library" /></StaggerRevealItem>
                    <StaggerRevealItem><KpiCard title="Dashboard" value={12} trend="up" trendLabel="Standard" /></StaggerRevealItem>
                    <StaggerRevealItem className="md:col-span-3">
                        <Card>
                            <h2 className="text-lg font-semibold text-[var(--dos-text-primary)]">Mandatory Rules</h2>
                            <ul className="mt-4 space-y-2">
                                {MANDATORY_RULES.map((rule) => (
                                    <li key={rule} className="flex gap-2 text-sm text-[var(--dos-text-secondary)]">
                                        <span className={DESIGN_OS_THEME.accent}>•</span>{rule}
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    </StaggerRevealItem>
                </StaggerReveal>
            )}

            {activeTab === DESIGN_OS_TABS.tokens && (
                <Card>
                    <h2 className="text-lg font-semibold">Design Tokens</h2>
                    <p className="mt-2 text-sm text-[var(--dos-text-secondary)]">Comprehensive reusable tokens in <code>src/design-os/tokens/</code></p>
                    <div className="mt-4 flex flex-wrap gap-2">
                        {TOKEN_FILES.map((f) => <Badge key={f}>{f}.ts</Badge>)}
                    </div>
                </Card>
            )}

            {activeTab === DESIGN_OS_TABS.motion && (
                <Card>
                    <h2 className="text-lg font-semibold">Motion Framework</h2>
                    <p className="mt-2 text-sm text-[var(--dos-text-secondary)]">Variants, transitions, hooks, and animated components.</p>
                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                        {["fadeUp", "staggerContainer", "scaleIn", "slideIn", "pageTransition"].map((v) => <Badge key={v} variant="info">{v}</Badge>)}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                        {["useReducedMotion", "useMagnetic", "useScrollProgress", "useStagger"].map((h) => <Badge key={h}>{h}</Badge>)}
                    </div>
                </Card>
            )}

            {activeTab === DESIGN_OS_TABS.components && (
                <Card>
                    <h2 className="text-lg font-semibold">Component Library</h2>
                    <div className="mt-4 flex flex-wrap gap-2">
                        {COMPONENT_LIST.map((c) => <Badge key={c}>{c}</Badge>)}
                    </div>
                    <div className="mt-6 flex gap-3">
                        <Button variant="primary">Primary</Button>
                        <Button variant="secondary">Secondary</Button>
                        <Button variant="ghost">Ghost</Button>
                        <Button variant="danger">Danger</Button>
                    </div>
                </Card>
            )}

            {activeTab === DESIGN_OS_TABS.dashboard && (
                <Card>
                    <h2 className="text-lg font-semibold">Enterprise Dashboard Standard</h2>
                    <div className="mt-4 flex flex-wrap gap-2">
                        {DASHBOARD_LIST.map((d) => <Badge key={d}>{d}</Badge>)}
                    </div>
                </Card>
            )}

            {activeTab === DESIGN_OS_TABS.website && (
                <Card>
                    <h2 className="text-lg font-semibold">Website Standards</h2>
                    <div className="mt-4 space-y-2">
                        {Object.entries(WEBSITE_SECTIONS).map(([key, val]) => (
                            <div key={key} className="text-sm text-[var(--dos-text-secondary)]">
                                <span className="font-medium text-[var(--dos-text-primary)]">{key}</span>: {JSON.stringify(val)}
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {activeTab === DESIGN_OS_TABS.guidelines && (
                <Card>
                    <h2 className="text-lg font-semibold">Guidelines</h2>
                    <div className="mt-4 flex flex-wrap gap-2">
                        {GUIDELINE_FILES.map((g) => <Badge key={g}>{g}.md</Badge>)}
                    </div>
                    <p className="mt-4 text-sm text-[var(--dos-text-secondary)]">
                        Production documentation in <code>src/design-os/guidelines/</code>
                    </p>
                </Card>
            )}
        </PageTransition>
    );
}
