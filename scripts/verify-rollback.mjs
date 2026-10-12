#!/usr/bin/env node
/**
 * Rollback verification: proves the Recovery/rollback section (§5) of
 * docs/STAGING_TO_PRODUCTION_MIGRATION_PROCEDURE.md actually restores the
 * documented pre-state.
 *
 *   1. Applies the FULL migration chain to embedded Postgres (PGlite).
 *   2. Extracts the ```sql fence from §5 of the procedure doc and executes it
 *      (this is the drift-proof part — the test always runs the documented SQL).
 *   3. Asserts the documented pre-state:
 *        - orgs_select / orgs_update USING(true); memberships_select USING(true);
 *          memberships_insert = (user_id = auth_profile_id() OR member);
 *          profiles_select / profiles_update USING(true);
 *        - project_management + storage_objects back to the open trio;
 *        - all 31 module tables back to zero policies (full deny);
 *        - the 202610120002 helper functions are gone.
 *
 * Read-only w.r.t. every remote system; runs entirely in-process.
 * Run locally:  npm run db:rollback-verify
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
let failed = 0;
function record(name, pass, detail = "") {
    if (!pass) failed += 1;
    console.log(`${pass ? "PASS" : "FAIL"}: ${name}${detail ? ` — ${detail}` : ""}`);
}

const { PGlite } = await import("@electric-sql/pglite");
const db = new PGlite();

await db.exec(`
create schema if not exists auth;
do $$ begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then create role anon; end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then create role authenticated; end if;
end $$;
create or replace function auth.uid() returns uuid language sql stable as $fn$
  select (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')::uuid;
$fn$;
create or replace function auth.role() returns text language sql stable as $fn$
  select coalesce(nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role', 'anon');
$fn$;
grant usage on schema public to anon, authenticated;
alter default privileges in schema public grant select, insert, update, delete on tables to anon, authenticated;
`);

const migDir = join(root, "supabase", "migrations");
for (const file of readdirSync(migDir).filter((f) => f.endsWith(".sql")).sort()) {
    let sql = readFileSync(join(migDir, file), "utf8");
    sql = sql.replace(/create extension if not exists "uuid-ossp";/gi, "-- stubbed");
    sql = sql.replace(/create extension if not exists "pgcrypto";/gi, "-- stubbed");
    await db.exec(`begin; ${sql} commit;`);
}
console.log("Chain applied. Extracting §5 rollback SQL from the procedure doc.\n");

const doc = readFileSync(join(root, "docs", "STAGING_TO_PRODUCTION_MIGRATION_PROCEDURE.md"), "utf8");
const section = doc.slice(doc.indexOf("## 5. Recovery / rollback"), doc.indexOf("## 6. Production"));
const fence = section.match(/```sql\n([\s\S]*?)```/);
if (!fence) {
    console.error("FAIL: no ```sql fence found in §5");
    process.exit(2);
}
for (const marker of ["Undo 202610120001", "Undo 202610120002", "Undo 202610120003", "Undo 202610120004", "Undo 202610120005"]) {
    if (!fence[1].includes(marker)) {
        console.error(`FAIL: §5 rollback SQL is missing ${marker}`);
        process.exit(2);
    }
}
console.log("Rollback SQL covers: 120001, 120002, 120003, 120004. Executing.\n");
await db.exec(`begin; ${fence[1]} commit;`);

async function policy(table, name) {
    const r = await db.query(
        `select cmd, roles::text as roles, coalesce(qual,'') as qual, coalesce(with_check,'') as wc
         from pg_policies where schemaname='public' and tablename=$1 and policyname=$2;`,
        [table, name],
    );
    return r.rows[0] ?? null;
}
const isOpen = (p) => p && /true/.test(`${p.qual} ${p.wc}`) && !/is_organization_member|auth_profile_id/.test(`${p.qual} ${p.wc}`);

// --- identity layer back to open pre-state --------------------------------
let p = await policy("organizations", "orgs_select");
record("rollback: orgs_select open", isOpen(p));
p = await policy("organizations", "orgs_update");
record("rollback: orgs_update open", isOpen(p));
p = await policy("organization_members", "memberships_select");
record("rollback: memberships_select open", isOpen(p));
p = await policy("organization_members", "memberships_insert");
record(
    "rollback: memberships_insert self-join-anywhere",
    Boolean(p) && /auth_profile_id/.test(p.wc) && /is_organization_member/.test(p.wc),
    p ? "" : "missing",
);
p = await policy("user_profiles", "profiles_select");
record("rollback: profiles_select open", isOpen(p));
p = await policy("user_profiles", "profiles_update");
record("rollback: profiles_update open", isOpen(p));

// --- legacy tables back to open pre-state ----------------------------------
for (const [tbl, names] of [
    ["project_management", ["projects_select", "projects_insert", "projects_update"]],
    ["storage_objects", ["storage_select", "storage_insert", "storage_update"]],
]) {
    for (const name of names) {
        record(`rollback: ${tbl}.${name} open`, isOpen(await policy(tbl, name)));
    }
}

// --- module tables back to zero policies ------------------------------------
const modules = [
    "csg_success_plans", "csg_onboarding_sessions", "csg_delivery_milestones",
    "csg_feedback_responses", "csg_escalations", "csg_renewals",
    "csg_improvement_items", "csg_audit_logs",
    "de_blueprints", "de_components", "de_engagements", "de_pipeline_runs",
    "de_quality_verifications", "de_knowledge_entries", "de_analytics_metrics",
    "de_ai_recommendations",
    "executive_recommendations", "executive_collaboration",
    "executive_audit_logs", "executive_approvals",
    "eae_agent_tasks", "eae_recommendations", "eae_collaboration_events",
    "eae_approval_requests",
    "pr_readiness_snapshots", "pr_system_alerts",
    "executive_agents", "executive_tasks", "executive_agent_metrics",
    "executive_health", "executive_memory",
    "integration_webhooks", "integration_deliveries",
];
for (const tbl of modules) {
    const r = await db.query("select count(*)::int as n from pg_policies where schemaname='public' and tablename=$1;", [tbl]);
    record(`rollback: ${tbl} zero policies`, r.rows[0].n === 0, r.rows[0].n === 0 ? "" : `${r.rows[0].n} remain`);
}

// --- 120002 helper functions dropped ------------------------------------------
for (const fn of ["organization_is_memberless", "is_platform_admin", "shares_organization_with"]) {
    const r = await db.query("select count(*)::int as n from pg_proc where proname=$1 and pronamespace='public'::regnamespace;", [fn]);
    record(`rollback: function ${fn}() dropped`, r.rows[0].n === 0, r.rows[0].n === 0 ? "" : "still exists");
}

await db.close();
console.log(`\n${failed === 0 ? "PASS" : "FAIL"}: rollback verification (${failed} failure(s)).`);
process.exit(failed === 0 ? 0 : 1);
