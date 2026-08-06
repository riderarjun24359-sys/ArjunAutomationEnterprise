/**
 * End-to-end production smoke for final launch readiness.
 * Env + Supabase + email templates/provider + journey surfaces + URL contract.
 */
import { existsSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { loadProjectEnv } from "./_load-env.mjs";
import { spawnVerify } from "./_verify-spawn-helper.mjs";

const root = process.cwd();
loadProjectEnv(root);

const results = [];
function pass(check, ok, detail = "") {
    results.push({ check, pass: !!ok, detail });
}

const journey = [
    "app/auth/sign-up/page.tsx",
    "app/auth/verify-email/page.tsx",
    "app/auth/welcome/page.tsx",
    "app/auth/sign-in/page.tsx",
    "app/auth/reset-password/page.tsx",
    "app/(shell)/onboarding/page.tsx",
    "app/(shell)/ai/page.tsx",
    "app/(shell)/clients/page.tsx",
    "app/(shell)/projects/page.tsx",
    "app/(shell)/tasks/page.tsx",
    "app/(shell)/finance/page.tsx",
    "app/(marketing)/privacy/page.tsx",
    "app/(marketing)/terms/page.tsx",
    "app/(marketing)/cookies/page.tsx",
    "app/(marketing)/refund/page.tsx",
];
for (const f of journey) pass(`surface:${f}`, existsSync(join(root, f)));

pass("env:app_url", Boolean(process.env.NEXT_PUBLIC_APP_URL?.trim()));
pass("env:supabase_url", Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()));
pass("env:supabase_anon", Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()));
pass("env:platform_lead", Boolean(process.env.PLATFORM_LEAD_API_KEY?.trim()));
pass("env:platform_org", Boolean(process.env.PLATFORM_ORGANIZATION_ID?.trim()));
pass(
    "env:email",
    Boolean(process.env.RESEND_API_KEY?.trim()) ||
        (Boolean(process.env.SMTP_HOST?.trim()) && Boolean(process.env.SMTP_USER?.trim())),
);

const email = spawnVerify(root, "scripts/verify-launch-email-provider.mjs");
pass("smoke:email_provider", email.status === 0, (email.stderr || email.stdout || "").split("\n").slice(-3).join(" | ").slice(0, 200));

const urls = spawnVerify(root, "scripts/verify-production-urls.mjs");
pass("smoke:production_urls", urls.status === 0, (urls.stderr || urls.stdout || "").split("\n").slice(-4).join(" | ").slice(0, 220));

const playwrightBin = join(root, "node_modules", "@playwright", "test", "cli.js");
if (existsSync(playwrightBin)) {
    const listed = spawnSync(process.execPath, [playwrightBin, "test", "--list", "e2e/final-launch-readiness.spec.ts"], {
        cwd: root,
        encoding: "utf8",
        timeout: 120_000,
        env: process.env,
    });
    pass("smoke:playwright_inventory", listed.status === 0, listed.status !== 0 ? (listed.stderr || listed.stdout || "").slice(0, 160) : "listed");
} else {
    pass("smoke:playwright_inventory", false, "@playwright/test missing");
}

const failed = results.filter((r) => !r.pass);
console.log(`production-smoke: ${results.filter((r) => r.pass).length}/${results.length}`);
for (const r of results) {
    console.log(`${r.pass ? "PASS" : "FAIL"} ${r.check}${r.detail ? ` — ${r.detail}` : ""}`);
}
console.log(`SMOKE_RESULT=${failed.length ? "FAIL" : "PASS"}`);
process.exit(failed.length ? 1 : 0);
