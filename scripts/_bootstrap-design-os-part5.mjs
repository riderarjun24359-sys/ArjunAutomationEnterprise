/**
 * Bootstrap V4 Design OS — Part 5: Module hub, integration, verify script
 */
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";

const root = process.cwd();

function write(rel, content) {
    const full = join(root, rel);
    mkdirSync(dirname(full), { recursive: true });
    writeFileSync(full, content, "utf8");
    console.log("wrote", rel);
}

function patch(rel, search, replace) {
    const full = join(root, rel);
    let src = readFileSync(full, "utf8");
    if (!src.includes(search)) {
        src = src.replace(replace.from, replace.to);
        writeFileSync(full, src, "utf8");
        console.log("patched", rel);
    } else {
        console.log("skip patch (already applied)", rel);
    }
}

// MODULE
write("src/modules/design-os/types/index.ts", `export type DesignOsTab =
    | "overview"
    | "tokens"
    | "motion"
    | "components"
    | "dashboard"
    | "website"
    | "guidelines";
`);

write("src/modules/design-os/constants/index.ts", `import type { DesignOsTab } from "@/src/modules/design-os/types";

export const DESIGN_OS_TABS = {
    overview: "overview",
    tokens: "tokens",
    motion: "motion",
    components: "components",
    dashboard: "dashboard",
    website: "website",
    guidelines: "guidelines",
} as const satisfies Record<string, DesignOsTab>;

export const DESIGN_OS_TAB_LIST: { id: DesignOsTab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "tokens", label: "Tokens" },
    { id: "motion", label: "Motion" },
    { id: "components", label: "Components" },
    { id: "dashboard", label: "Dashboard" },
    { id: "website", label: "Website" },
    { id: "guidelines", label: "Guidelines" },
];

export const DESIGN_OS_THEME = {
    accent: "text-indigo-600 dark:text-indigo-400",
    badge: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300",
    border: "border-indigo-200 dark:border-indigo-800",
} as const;
`);

write("src/modules/design-os/components/DesignOsPage.tsx", `"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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
`);

write("src/modules/design-os/index.ts", `export { DesignOsPage } from "@/src/modules/design-os/components/DesignOsPage";
export * from "@/src/modules/design-os/constants";
export * from "@/src/modules/design-os/types";
`);

write("app/(shell)/design-os/page.tsx", `import { DesignOsPage } from "@/src/modules/design-os";

export default function DesignOsRoute() {
    return <DesignOsPage />;
}
`);

// VERIFY SCRIPT
write("scripts/verify-design-os.mjs", `/**
 * Design OS verification: tsc, lint, tokens, css, motion, components,
 * dashboard, guidelines, integration, rules, and regression checks.
 * Run: node scripts/verify-design-os.mjs
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const dosRoot = join(root, "src", "design-os");
const results = [];

function pass(check, ok, detail = "") {
    results.push({ check, pass: ok, detail });
}

function readSafe(path) {
    try { return readFileSync(path, "utf8"); } catch { return ""; }
}

const tsc = spawnSync("npx", ["tsc", "--noEmit"], { cwd: root, shell: true, encoding: "utf8" });
pass("regression:tsc", tsc.status === 0, tsc.status !== 0 ? (tsc.stderr || tsc.stdout || "").slice(0, 200) : "");

const lint = spawnSync("npm", ["run", "lint"], { cwd: root, shell: true, encoding: "utf8" });
pass("regression:lint", lint.status === 0, lint.status !== 0 ? (lint.stderr || lint.stdout || "").slice(0, 200) : "");

const tokenFiles = ["colors", "typography", "spacing", "grid", "radii", "elevation", "motion", "blur", "glass", "breakpoints", "semantic", "index"];
for (const f of tokenFiles) {
    pass(\`tokens:\${f}\`, existsSync(join(dosRoot, "tokens", \`\${f}.ts\`)));
}

const css = readSafe(join(dosRoot, "css", "design-os.css"));
pass("css:design_os_exists", existsSync(join(dosRoot, "css", "design-os.css")));
pass("css:dark_light_vars", css.includes(":root") && css.includes(".dark"));

pass("motion:variants", existsSync(join(dosRoot, "motion", "variants.ts")));
pass("motion:transitions", existsSync(join(dosRoot, "motion", "transitions.ts")));
pass("motion:hooks", existsSync(join(dosRoot, "motion", "hooks", "useReducedMotion.ts")));
pass("motion:components", existsSync(join(dosRoot, "motion", "components", "PageTransition.tsx")));

const components = ["Button", "Input", "Textarea", "Select", "Card", "Dialog", "Table", "ChartContainer", "Form", "Dropdown", "Tabs", "Badge", "Notification", "LoadingState", "EmptyState", "ErrorState", "AnimatedLink", "ThemeToggle"];
for (const c of components) {
    pass(\`component:\${c}\`, existsSync(join(dosRoot, "components", \`\${c}.tsx\`)));
}

const dashboard = ["DashboardShell", "PremiumSidebar", "CommandPalette", "DockNav", "KpiCard", "GlassWidget", "ActivityFeed", "NotificationCenter", "AiAssistantPanel", "SmartSearch", "KeyboardShortcuts", "DashboardToolbar"];
for (const d of dashboard) {
    pass(\`dashboard:\${d}\`, existsSync(join(dosRoot, "dashboard", \`\${d}.tsx\`)));
}

const guidelines = ["philosophy", "typography", "spacing", "motion", "components", "dashboard", "website", "accessibility", "illustration"];
for (const g of guidelines) {
    pass(\`guideline:\${g}\`, existsSync(join(dosRoot, "guidelines", \`\${g}.md\`)));
}

const appShell = readSafe(join(root, "src", "components", "layout", "AppShell.tsx"));
pass("integration:AppShell_uses_DashboardShell", appShell.includes("DashboardShell") || appShell.includes("design-os"));

const globals = readSafe(join(root, "app", "globals.css"));
pass("integration:globals_imports_design_os", globals.includes("design-os.css"));

const routes = readSafe(join(root, "src", "constants", "routes.ts"));
pass("route:designOs", routes.includes('designOs: "/design-os"'));

const nav = readSafe(join(root, "src", "config", "shell-navigation.ts"));
pass("nav:Design_OS", nav.includes("Design OS"));
pass("nav:Layers_or_Palette", nav.includes("Layers") || nav.includes("Palette"));
pass("nav:designOs_route", nav.includes("ROUTES.designOs"));

const middleware = readSafe(join(root, "src", "middleware", "auth.ts"));
pass("middleware:designOs_protected", middleware.includes("ROUTES.designOs"));

const rules = readSafe(join(dosRoot, "rules.ts"));
pass("rules:MANDATORY_RULES", rules.includes("MANDATORY_RULES"));

pass("module:DesignOsPage", existsSync(join(root, "src", "modules", "design-os", "components", "DesignOsPage.tsx")));
pass("route:page_exists", existsSync(join(root, "app", "(shell)", "design-os", "page.tsx")));

pass("package:design_os_verify", readSafe(join(root, "package.json")).includes('"design-os:verify"'));

const premiumVerify = spawnSync("node", ["scripts/verify-premium-website.mjs"], { cwd: root, shell: true, encoding: "utf8" });
pass("regression:premium_website", premiumVerify.status === 0, premiumVerify.status !== 0 ? "premium-website verify failed" : "");

const clkVerify = spawnSync("node", ["scripts/verify-company-launch-kit.mjs"], { cwd: root, shell: true, encoding: "utf8" });
pass("regression:company_launch_kit", clkVerify.status === 0, clkVerify.status !== 0 ? "company-launch-kit verify failed" : "");

const passed = results.filter((r) => r.pass).length;
const failed = results.filter((r) => !r.pass);

console.log("\\nDesign OS Verification Results\\n");
for (const r of results) {
    console.log(\`\${r.pass ? "PASS" : "FAIL"} \${r.check}\${r.detail ? \` — \${r.detail}\` : ""}\`);
}
console.log(\`\\n\${passed}/\${results.length} checks passed\`);

if (failed.length > 0) process.exit(1);
`);

console.log("Part 5 module + verify complete — apply integration patches manually or via part6");
