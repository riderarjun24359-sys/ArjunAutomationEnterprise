/**
 * Immersive Experience Engine v2 verification.
 * UX/motion only — no backend or schema assertions.
 * Run: npm run immersive-v2:verify
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { runTsc, runLint, spawnVerify } from "./_verify-spawn-helper.mjs";

const root = process.cwd();
const dos = join(root, "src", "design-os");
const iv2 = join(dos, "immersive-v2");
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

const required = [
    "index.ts",
    "constants.ts",
    "themes.ts",
    "variants.ts",
    "hooks/useTimeAwareTheme.ts",
    "hooks/useParallaxAmbient.ts",
    "hooks/useImmersivePerformance.ts",
    "components/ImmersiveProvider.tsx",
    "components/CinematicWelcome.tsx",
    "components/LivingWorkspace.tsx",
    "components/AmbientGradients.tsx",
    "components/PhysicsPageTransition.tsx",
    "components/SharedElement.tsx",
    "components/WidgetOrchestra.tsx",
    "components/AiPresenceShell.tsx",
    "components/AiCommandPaletteMotion.tsx",
    "components/CelebrationBurst.tsx",
    "components/DelightEmptyState.tsx",
    "components/PremiumSuccessState.tsx",
    "components/OnboardingMoment.tsx",
    "components/LiveKpiTransition.tsx",
    "components/AnimatedChartFrame.tsx",
    "components/LiveActivityMotion.tsx",
];
for (const f of required) pass(`file:${f}`, existsSync(join(iv2, f)));

const themes = readSafe(join(iv2, "themes.ts"));
pass("welcome:time_aware", themes.includes("resolveImmersiveTheme") && themes.includes("morning"));
pass("welcome:personalize", themes.includes("personalizeGreeting"));

const variants = readSafe(join(iv2, "variants.ts"));
for (const name of [
    "physicsPageTransition",
    "sharedElementReveal",
    "widgetOrchestra",
    "cinematicWelcome",
    "aiPresencePulse",
    "celebrationBurst",
    "liveKpiGlow",
    "commandPaletteMotion",
]) {
    pass(`motion:${name}`, variants.includes(`export const ${name}`));
}

const css = readSafe(join(dos, "css", "design-os.css"));
pass("perf:gpu", css.includes(".dos-gpu") && css.includes("immersive-living-workspace"));
pass("perf:contain", css.includes("contain: paint") || css.includes("contain: layout"));
pass("perf:reduced_motion", css.includes("prefers-reduced-motion: reduce") && css.includes("immersive-ambient"));
pass("perf:target_fps", readSafe(join(iv2, "constants.ts")).includes("targetFps: 60"));

const shell = readSafe(join(dos, "dashboard", "DashboardShell.tsx"));
pass("wire:living_workspace", shell.includes("LivingWorkspace"));
pass("wire:cinematic_welcome", shell.includes("CinematicWelcome"));
pass("wire:physics_page", shell.includes("PhysicsPageTransition"));
pass("wire:immersive_provider", shell.includes("ImmersiveProvider"));
pass("no_backend_imports", !shell.includes("databaseService") && !shell.includes("supabase"));

const palette = readSafe(join(dos, "dashboard", "CommandPalette.tsx"));
pass("ai:command_motion", palette.includes("AiCommandPaletteMotion"));
pass("ai:thinking", palette.includes("AiThinkingIndicator"));

const success = readSafe(join(dos, "components", "SuccessState.tsx"));
pass("delight:celebration", success.includes("CelebrationBurst"));
pass("delight:empty", readSafe(join(dos, "components", "EmptyState.tsx")).includes("immersive-empty-state"));

pass("export:design_os", readSafe(join(dos, "index.ts")).includes("immersive-v2"));
pass("package:script", readSafe(join(root, "package.json")).includes('"immersive-v2:verify"'));
pass("no_schema_touch", !existsSync(join(root, "supabase", "migrations", "immersive-v2.sql")));

process.env.SKIP_TSC = "1";
process.env.SKIP_LINT = "1";
const unit = spawnVerify(root, "scripts/test-immersive-v2.mjs");
pass("test:immersive-v2", unit.status === 0, unit.status !== 0 ? (unit.stderr || unit.stdout || "").slice(0, 240) : "");

const failed = results.filter((r) => !r.pass);
console.log(`immersive-v2:verify ${results.filter((r) => r.pass).length}/${results.length}`);
for (const r of results) {
    console.log(`${r.pass ? "PASS" : "FAIL"} ${r.check}${r.detail ? ` — ${r.detail}` : ""}`);
}
process.exit(failed.length ? 1 : 0);
