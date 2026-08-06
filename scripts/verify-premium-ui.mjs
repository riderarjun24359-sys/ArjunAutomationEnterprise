/**
 * Premium Experience Sprint verification.
 * UX-only design system / motion checks — no backend or schema assertions.
 * Run: npm run premium-ui:verify
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { runTsc, runLint, spawnVerify } from "./_verify-spawn-helper.mjs";

const root = process.cwd();
const dos = join(root, "src", "design-os");
const results = [];

function pass(check, ok, detail = "") {
    results.push({ check, pass: !!ok, detail });
}

function readSafe(path) {
    try {
        return readFileSync(path, "utf8");
    } catch {
        return "";
    }
}

const tsc = runTsc(root);
pass("runtime:tsc", tsc.status === 0, tsc.status !== 0 ? (tsc.stderr || tsc.stdout || "").slice(0, 240) : "");

const lint = runLint(root);
pass("runtime:eslint", lint.status === 0, lint.status !== 0 ? (lint.stderr || lint.stdout || "").slice(0, 240) : "");

const css = readSafe(join(dos, "css", "design-os.css"));
pass("tokens:spacing_scale", css.includes("--dos-space-0-5") && css.includes("--dos-space-12"));
pass("tokens:elevation_scale", css.includes("--dos-elevation-1") && css.includes("--dos-elevation-4"));
pass("tokens:typography_h4", css.includes(".dos-text-h4") && css.includes(".dos-text-body-sm"));
pass("tokens:glass_panel", css.includes(".dos-glass-panel"));
pass("tokens:gpu", css.includes(".dos-gpu"));
pass("a11y:reduced_motion", css.includes("prefers-reduced-motion: reduce"));
pass("a11y:focus_ring", css.includes(".dos-focus-ring"));
pass("micro:ripple", css.includes(".dos-ripple"));
pass("micro:interactive", css.includes(".dos-interactive"));
pass("loading:skeleton_shimmer", css.includes(".dos-skeleton") && css.includes("dos-shimmer"));
pass("ai:thinking_dots", css.includes(".dos-thinking-dot"));
pass("ai:typing_cursor", css.includes(".dos-typing-cursor"));
pass("toast:enter", css.includes(".dos-toast-enter"));
pass("mobile:bottom_sheet", css.includes(".dos-bottom-sheet"));

const variants = readSafe(join(dos, "motion", "variants.ts"));
for (const name of ["pageTransition", "modalPanel", "drawerPanel", "dropdownMenu", "toastMotion", "bottomSheet", "widgetEntrance", "chartReveal", "activityItem"]) {
    pass(`motion:variant:${name}`, variants.includes(`export const ${name}`));
}

const motionComponents = [
    "PremiumMotionProvider",
    "RouteTransition",
    "WidgetEntrance",
    "AiTypingText",
    "AiThinkingIndicator",
    "StreamingText",
    "BottomSheet",
    "ProgressIndicator",
    "AnimatedCounter",
    "SkeletonLoader",
    "PageTransition",
];
for (const c of motionComponents) {
    pass(`motion:component:${c}`, existsSync(join(dos, "motion", "components", `${c}.tsx`)));
}

pass("hook:useReducedMotion", existsSync(join(dos, "motion", "hooks", "useReducedMotion.ts")));

const components = ["Button", "Card", "Dialog", "Dropdown", "Tabs", "Notification", "Toggle", "SuccessState", "LoadingState", "EmptyState", "ErrorState", "ChartContainer", "Input"];
for (const c of components) {
    pass(`component:${c}`, existsSync(join(dos, "components", `${c}.tsx`)));
}

pass("button:hover_press", readSafe(join(dos, "components", "Button.tsx")).includes("whileTap") && readSafe(join(dos, "components", "Button.tsx")).includes("whileHover"));
pass("card:hover", readSafe(join(dos, "components", "Card.tsx")).includes("whileHover"));
pass("dialog:animate", readSafe(join(dos, "components", "Dialog.tsx")).includes("AnimatePresence"));
pass("dropdown:animate", readSafe(join(dos, "components", "Dropdown.tsx")).includes("dropdownMenu"));
pass("tabs:layoutId", readSafe(join(dos, "components", "Tabs.tsx")).includes("layoutId"));
pass("toggle:switch", readSafe(join(dos, "components", "Toggle.tsx")).includes('role="switch"'));
pass("notification:toastMotion", readSafe(join(dos, "components", "Notification.tsx")).includes("toastMotion"));

pass("shell:lazy_motion", readSafe(join(dos, "dashboard", "DashboardShell.tsx")).includes("PremiumMotionProvider"));
pass("shell:route_transition", readSafe(join(dos, "dashboard", "DashboardShell.tsx")).includes("RouteTransition"));
pass("sidebar:spring_width", readSafe(join(dos, "dashboard", "PremiumSidebar.tsx")).includes("animate={{ width"));
pass("ai_panel:drawer", readSafe(join(dos, "dashboard", "AiAssistantPanel.tsx")).includes("drawerPanel"));
pass("ai_panel:typing", readSafe(join(dos, "dashboard", "AiAssistantPanel.tsx")).includes("AiTypingText"));
pass("kpi:counter", readSafe(join(dos, "dashboard", "KpiCard.tsx")).includes("AnimatedCounter"));
pass("kpi:entrance", readSafe(join(dos, "dashboard", "KpiCard.tsx")).includes("WidgetEntrance"));
pass("activity:stagger", readSafe(join(dos, "dashboard", "ActivityFeed.tsx")).includes("staggerContainer"));
pass("mobile:nav_motion", readSafe(join(root, "src/components/layout/MobileNav.tsx")).includes("AnimatePresence"));

pass("exports:SuccessState", readSafe(join(dos, "components", "index.ts")).includes("SuccessState"));
pass("exports:Toggle", readSafe(join(dos, "components", "index.ts")).includes("Toggle"));
pass("exports:BottomSheet", readSafe(join(dos, "motion", "components", "index.ts")).includes("BottomSheet"));
pass("exports:PremiumMotionProvider", readSafe(join(dos, "motion", "components", "index.ts")).includes("PremiumMotionProvider"));

pass("package:premium_ui_verify", readSafe(join(root, "package.json")).includes('"premium-ui:verify"'));
pass("dep:framer_motion", readSafe(join(root, "package.json")).includes('"framer-motion"'));

process.env.SKIP_TSC = "1";
process.env.SKIP_LINT = "1";

const eccLive = spawnVerify(root, "scripts/test-executive-live-stats.mjs");
pass("regression:ecc-live", eccLive.status === 0);

const widgets = spawnVerify(root, "scripts/test-executive-widgets.mjs");
pass("regression:ecc-widgets", widgets.status === 0);

const security = spawnVerify(root, "scripts/test-security-center-os.mjs");
pass("regression:security-os", security.status === 0);

const cs = spawnVerify(root, "scripts/test-customer-success-os.mjs");
pass("regression:customer-success", cs.status === 0);

const passed = results.filter((r) => r.pass).length;
const failed = results.filter((r) => !r.pass);

console.log("\nPremium UI Verification\n");
for (const r of results) {
    console.log(`${r.pass ? "PASS" : "FAIL"} ${r.check}${r.detail ? ` — ${r.detail}` : ""}`);
}
console.log(`\n${passed}/${results.length} checks passed`);
if (failed.length > 0) process.exit(1);
