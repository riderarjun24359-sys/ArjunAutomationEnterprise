// @vitest-environment node
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { mkdtempSync, mkdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { validateProductionCutover, type CutoverCheck } from "./production-cutover";

/**
 * Source-tree (file-presence) semantics for the production cutover gate.
 *
 * The Vercel serverless bundle ships only the compiled app output, so on the
 * live deployment `process.cwd()` has no `supabase/migrations`, no
 * `instrumentation.ts`, no route sources and no `docs/`. Those checks must
 * therefore be reported as *unverifiable in the deployed runtime* (warn) —
 * never as `fail`, which is what made `/api/ops/cutover` assert "0 migration
 * SQL files present — apply with npm run db:apply on production" against a
 * database where all migrations were already applied.
 *
 * Locally the source tree is authoritative, so a missing artefact must still
 * be a hard `fail`. Both invariants are pinned here.
 */

const REPO_ROOT = process.cwd();

const FILE_CHECK_IDS = [
    "secrets_startup_gate",
    "supabase_migrations",
    "supabase_rls",
    "payments_subscription_surface",
    "payments_invoice_surface",
    "monitoring_health",
    "monitoring_logging",
    "monitoring_diagnostics",
    "cutover_go_live_checklist",
    "cutover_readiness_report",
    "email_templates",
    "email_password_reset",
    "email_onboarding",
] as const;

const ENV_ONLY_CHECK_IDS = ["secrets_critical", "supabase_env", "email_provider", "payments_gateway"] as const;

const RUNTIME_NOTE = "not verifiable in the deployed runtime";

/** Production-shaped env: everything the env-driven gates need, except a payment gateway. */
const env: NodeJS.ProcessEnv = {
    NODE_ENV: "production",
    VERCEL_ENV: "production",
    AAOS_CUTOVER: "1",
    NEXT_PUBLIC_APP_URL: "https://www.arjunautomations.com",
    NEXT_PUBLIC_SUPABASE_URL: "https://ixassghxogcabfcyjjtz.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key",
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "publishable-key",
    PLATFORM_LEAD_API_KEY: "lead-key",
    PLATFORM_ORGANIZATION_ID: "11111111-1111-1111-1111-111111111111",
    SUPABASE_SERVICE_ROLE_KEY: "service-role-key",
    RESEND_API_KEY: "re_test_key",
    STORAGE_BUCKET: "organization-uploads",
};

function find(checkId: string, checks: CutoverCheck[]): CutoverCheck {
    const check = checks.find((c) => c.id === checkId);
    if (!check) throw new Error(`expected cutover check "${checkId}" to be produced`);
    return check;
}

describe("production cutover: source-tree checks", () => {
    let deployedCwd: string;
    let bareSourceTreeCwd: string;

    beforeAll(() => {
        // A directory with no repository source tree at all (the deployed runtime).
        deployedCwd = mkdtempSync(join(tmpdir(), "cutover-deployed-"));
        // A directory that *does* look like a source tree root, but is empty.
        bareSourceTreeCwd = mkdtempSync(join(tmpdir(), "cutover-source-"));
        mkdirSync(join(bareSourceTreeCwd, "supabase", "migrations"), { recursive: true });
    });

    afterAll(() => {
        rmSync(deployedCwd, { recursive: true, force: true });
        rmSync(bareSourceTreeCwd, { recursive: true, force: true });
    });

    it("verifies every source-tree artefact as present when run from the repository root", () => {
        const report = validateProductionCutover(env, REPO_ROOT);
        const missing = FILE_CHECK_IDS.filter((id) => find(id, report.checks).status !== "pass");
        expect({ missing, count: FILE_CHECK_IDS.length }).toEqual({ missing: [], count: FILE_CHECK_IDS.length });
        expect(find("supabase_migrations", report.checks).detail).toMatch(/migration SQL files present/);
    });

    it("does not weaken the local gate: missing artefacts still fail when the source tree is present", () => {
        const report = validateProductionCutover(env, bareSourceTreeCwd);
        expect(find("secrets_startup_gate", report.checks).status).toBe("fail");
        expect(find("monitoring_health", report.checks).status).toBe("fail");
        expect(find("email_templates", report.checks).status).toBe("fail");
        expect(find("supabase_migrations", report.checks).status).toBe("fail");
        // The original, truthful local message is preserved for the migrations gate.
        expect(find("supabase_migrations", report.checks).detail).toContain("0 migration SQL files present");
        expect(report.blockers).toContain("supabase_migrations: 0 migration SQL files present — apply with npm run db:apply on production");
    });

    it("reports source-tree checks as unverifiable (warn), never as blockers, in the deployed runtime", () => {
        const report = validateProductionCutover(env, deployedCwd);

        const wrongStatus = FILE_CHECK_IDS.filter((id) => find(id, report.checks).status !== "warn");
        expect({ ids: wrongStatus }).toEqual({ ids: [] });

        // Every unverifiable check says so explicitly instead of claiming an artefact is missing.
        for (const id of FILE_CHECK_IDS) {
            expect(find(id, report.checks).detail).toContain(RUNTIME_NOTE);
        }

        // The migrations gate points at the real source of truth rather than the file count.
        expect(find("supabase_migrations", report.checks).detail).toContain("supabase_migrations.schema_migrations");
        expect(find("supabase_migrations", report.checks).detail).not.toMatch(/0 migration SQL files present/);

        // No unverifiable check may masquerade as a blocker.
        for (const id of FILE_CHECK_IDS) {
            expect(report.blockers.some((b) => b.startsWith(`${id}:`))).toBe(false);
        }

        // The webhook route is also compiled in — reported as unverifiable, not as a failing surface.
        expect(find("payments_webhook", report.checks).status).toBe("warn");
    });

    it("leaves env-driven gates identical regardless of the source tree", () => {
        const fromRepo = validateProductionCutover(env, REPO_ROOT);
        const fromRuntime = validateProductionCutover(env, deployedCwd);
        for (const id of ENV_ONLY_CHECK_IDS) {
            expect({ id, status: find(id, fromRuntime.checks).status }).toEqual({
                id,
                status: find(id, fromRepo.checks).status,
            });
        }
        // The only env-driven blocker is the genuinely unconfigured payment gateway.
        expect(fromRuntime.blockers).toEqual(["payments_gateway: Configure Razorpay or Stripe for paid plans"]);
    });

    it("accepts the classic anon key for supabase_env (the key the app actually uses)", () => {
        // Production provisions NEXT_PUBLIC_SUPABASE_ANON_KEY, never the newer
        // NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY the gate used to demand — so the
        // anon-key-only shape must pass. The app authenticates via
        // getSupabaseAnonKey (src/lib/supabase-config.ts).
        const anonOnly = { ...env };
        delete anonOnly.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
        for (const cwd of [REPO_ROOT, deployedCwd]) {
            expect(find("supabase_env", validateProductionCutover(anonOnly, cwd).checks).status).toBe("pass");
        }
        const publishableOnly = { ...env };
        delete publishableOnly.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        expect(find("supabase_env", validateProductionCutover(publishableOnly, REPO_ROOT).checks).status).toBe("pass");
        const neither = { ...env };
        delete neither.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        delete neither.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
        expect(find("supabase_env", validateProductionCutover(neither, REPO_ROOT).checks).status).toBe("fail");
    });
});
