#!/usr/bin/env node
/**
 * Real-Postgres tenant-isolation verification (PGlite, embedded PostgreSQL 17).
 *
 * Applies the FULL migration chain to a fresh database, seeds two independent
 * organizations with members, then switches to the `authenticated`/`anon` roles
 * with `request.jwt.claims` set, exactly as Supabase's RLS engine evaluates
 * `auth.uid()`. Proves:
 *   - the prepared tenant-isolation migrations
 *     (202610100001 CRM RLS, 202610100002 lead consent/dedup,
 *      202610100003 finance guards, 202610120001 membership/org write
 *      escalation lockdown, 202610120002 authenticated read-scope lockdown,
 *      202610120003 legacy-table lockdown, 202610120004 module-table tenant reads)
 *     behave correctly;
 *   - the 202610110001 anon lockdown holds;
 *   - the repo-standard is_organization_member(organization_id) pattern denies
 *     cross-organization reads/writes for a representative table (invoices).
 *
 * Run locally:  npm run rls:verify
 * Nothing here touches a remote database. To run the same suite against a
 * staging/production Postgres instead, set SUPABASE_DB_URL (owner action) and
 * use a disposable project — the fixture rows are committed, not rolled back.
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

const ORG1 = "00000000-0000-4000-8000-0000000000a1";
const ORG2 = "00000000-0000-4000-8000-0000000000a2";
const ORG3 = "00000000-0000-4000-8000-0000000000a3";
const PROF1 = "00000000-0000-4000-8000-0000000000b1";
const PROF2 = "00000000-0000-4000-8000-0000000000b2";
const PROF3 = "00000000-0000-4000-8000-0000000000b3";
const PROF4 = "00000000-0000-4000-8000-0000000000b4"; // platform admin (super_admin)
const PROF5 = "00000000-0000-4000-8000-0000000000b5"; // memberless
const AUTH1 = "00000000-0000-4000-8000-0000000000c1";
const AUTH2 = "00000000-0000-4000-8000-0000000000c2";
const AUTH3 = "00000000-0000-4000-8000-0000000000c3";
const AUTH4 = "00000000-0000-4000-8000-0000000000c4";
const AUTH5 = "00000000-0000-4000-8000-0000000000c5";

// Supabase-compatible auth stub: uid()/role() read the request JWT claims.
const authStub = `
create schema if not exists auth;
do $$ begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then create role anon; end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then create role authenticated; end if;
  -- Supabase migrations grant internal RPC execution to this hosted role.
  -- Create a local BYPASSRLS equivalent so the isolated PGlite migration
  -- harness models the role without connecting to any remote database.
  if not exists (select 1 from pg_roles where rolname = 'service_role') then
    create role service_role bypassrls;
  end if;
end $$;
create or replace function auth.uid() returns uuid language sql stable as $fn$
  select (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')::uuid;
$fn$;
create or replace function auth.role() returns text language sql stable as $fn$
  select coalesce(nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role', 'anon');
$fn$;
grant usage on schema public to anon, authenticated;
alter default privileges in schema public grant select, insert, update, delete on tables to anon, authenticated;
`;

const migDir = join(root, "supabase", "migrations");
const files = readdirSync(migDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

try {
    await db.exec(authStub);
} catch (error) {
    console.error(`auth stub failed: ${error.message}`);
    process.exit(2);
}

for (const file of files) {
    let sql = readFileSync(join(migDir, file), "utf8");
    sql = sql.replace(/create extension if not exists "uuid-ossp";/gi, "-- stubbed");
    sql = sql.replace(/create extension if not exists "pgcrypto";/gi, "-- stubbed");
    try {
        await db.exec(`begin; ${sql} commit;`);
    } catch (error) {
        console.error(`MIGRATION FAILED: ${file}: ${error.message}`);
        process.exit(2);
    }
}
console.log(`Applied ${files.length} migrations to embedded Postgres.\n`);

// Fixtures are inserted as the superuser (RLS bypassed) to set up tenants.
await db.exec(`
insert into public.user_profiles (id, auth_user_id, email, full_name) values
  ('${PROF1}', '${AUTH1}', 'one@test.dev', 'One'),
  ('${PROF2}', '${AUTH2}', 'two@test.dev', 'Two'),
  ('${PROF3}', '${AUTH3}', 'three@test.dev', 'Three'),
  ('${PROF4}', '${AUTH4}', 'admin@test.dev', 'Admin'),
  ('${PROF5}', '${AUTH5}', 'nobody@test.dev', 'Nobody');
insert into public.organizations (id, name, slug) values
  ('${ORG1}', 'Org One', 'org-one'),
  ('${ORG2}', 'Org Two', 'org-two'),
  ('${ORG3}', 'Empty Org', 'org-empty');
insert into public.organization_members (organization_id, user_id, role_name, is_active) values
  ('${ORG1}', '${PROF1}', 'founder', true),
  ('${ORG1}', '${PROF4}', 'super_admin', true),
  ('${ORG2}', '${PROF2}', 'founder', true);
insert into public.crm_clients (organization_id, name, contact_email, manager_name) values
  ('${ORG1}', 'Client One', 'a@x.com', 'Manager One'),
  ('${ORG2}', 'Client Two', 'b@x.com', 'Manager Two');
insert into public.invoices (organization_id, number, status, total, amount_paid) values
  ('${ORG1}', 'INV-1', 'draft', 100, 0),
  ('${ORG2}', 'INV-2', 'draft', 200, 0);
insert into public.csg_success_plans (organization_id, title) values
  ('${ORG1}', 'Plan One'),
  ('${ORG2}', 'Plan Two');
insert into public.de_blueprints (organization_id, blueprint_key, name, category) values
  ('${ORG1}', 'bp-one', 'BP One', 'web'),
  ('${ORG2}', 'bp-two', 'BP Two', 'web');
insert into public.executive_recommendations (organization_id, agent_key, title) values
  ('${ORG1}', 'agent-a', 'Rec One'),
  ('${ORG2}', 'agent-a', 'Rec Two');
insert into public.executive_approvals (organization_id, agent_key, action_summary) values
  ('${ORG1}', 'agent-a', 'Approve X'),
  ('${ORG2}', 'agent-a', 'Approve Y');
insert into public.integration_webhooks (organization_id, name, url, secret) values
  ('${ORG1}', 'crm', 'https://hooks.example.com/events', 'test-secret-16-chars!!'),
  ('${ORG2}', 'crm', 'https://hooks.example.com/events', 'test-secret-16-chars!!');
insert into public.integration_deliveries (organization_id, event, target_host, status, attempts) values
  ('${ORG1}', 'lead.created', 'hooks.example.com', 'delivered', 1),
  ('${ORG2}', 'lead.created', 'hooks.example.com', 'delivered', 1);
`);

async function asAuth(authId) {
    const claims = JSON.stringify({ sub: authId, role: "authenticated", aud: "authenticated" });
    await db.exec(`select set_config('request.jwt.claims', $jwt$${claims}$jwt$, false); set role authenticated;`);
}
async function asAnon() {
    await db.exec(`select set_config('request.jwt.claims', '', false); set role anon;`);
}
async function resetRole() {
    await db.exec("reset role;");
}
async function expectRows(sql, expected, label) {
    try {
        const res = await db.query(sql);
        record(label, res.rows.length === expected, `expected ${expected}, got ${res.rows.length}`);
    } catch (error) {
        record(label, false, `error: ${String(error.message).split("\n")[0]}`);
    }
}
async function expectError(sql, label) {
    try {
        await db.query(sql);
        record(label, false, "expected an error but the statement succeeded");
    } catch (error) {
        record(label, true, String(error.message).split("\n")[0].slice(0, 90));
    }
}
async function expectOk(sql, label) {
    try {
        await db.query(sql);
        record(label, true);
    } catch (error) {
        record(label, false, `error: ${String(error.message).split("\n")[0]}`);
    }
}
async function expectModulePolicy(table) {
    // Every table enabled by 202610120004 must carry exactly the tenant-scoped
    // trio (select/insert/update TO authenticated, is_organization_member on
    // organization_id) and no open USING/WITH CHECK-true policy.
    try {
        const res = await db.query(
            `select policyname, cmd, roles::text as roles, coalesce(qual, '') as qual, coalesce(with_check, '') as wc from pg_policies where schemaname = 'public' and tablename = '${table}';`,
        );
        const need = [[`${table}_select`, "SELECT"], [`${table}_insert`, "INSERT"], [`${table}_update`, "UPDATE"]];
        const bad = [];
        for (const [name, cmd] of need) {
            const p = res.rows.find((r) => r.policyname === name && r.cmd === cmd);
            const expr = p ? `${p.qual} ${p.wc}` : "";
            const ok = Boolean(p) && p.roles.includes("authenticated") && expr.includes("is_organization_member") && expr.includes("organization_id");
            if (!ok) bad.push(name);
        }
        const open = res.rows.filter((r) => /(^|[^_a-z])true([^_a-z]|$)/i.test(`${r.qual} ${r.wc}`) && !/is_organization_member/.test(`${r.qual} ${r.wc}`));
        if (open.length) bad.push(`open:${open.map((r) => r.policyname).join(",")}`);
        record(`module policy: ${table} tenant-scoped trio, no open policy`, bad.length === 0, bad.length ? bad.join("; ") : "");
    } catch (error) {
        record(`module policy: ${table} tenant-scoped trio, no open policy`, false, String(error.message).split("\n")[0]);
    }
}

// --- 202610100001: CRM RLS remediation ------------------------------------
await asAuth(AUTH1);
await expectRows("select id from public.crm_clients", 1, "crm: owner reads own org");
await expectRows(`select id from public.crm_clients where organization_id = '${ORG2}'`, 0, "crm: cross-org SELECT filtered");
await expectError(
    `insert into public.crm_clients (organization_id, name, contact_email, manager_name) values ('${ORG2}', 'X', 'x@x.com', 'M')`,
    "crm: cross-org INSERT blocked",
);
await expectRows(
    `update public.crm_clients set name = 'Hacked' where organization_id = '${ORG2}' returning id`,
    0,
    "crm: cross-org UPDATE affects 0 rows",
);
await expectRows(
    `delete from public.crm_clients where organization_id = '${ORG2}' returning id`,
    0,
    "crm: cross-org DELETE affects 0 rows",
);
await resetRole();

// --- 202610110001: anon lockdown ------------------------------------------
await asAnon();
await expectError("select id from public.organizations", "anon: organizations denied");
await expectError("select id from public.organization_members", "anon: organization_members denied");
await expectError("select id from public.crm_clients", "anon: crm_clients denied");
await resetRole();

// --- membership/organization write escalation (live finding) ----------------
// Live on production: 202610110001 allows any authenticated user to insert a
// membership row for THEIR OWN profile into ANY organization (then read all of
// that org's data and self-promote via memberships_update), and orgs_update is
// still USING(true) so any org row can be edited. These probes assert the
// SECURE behavior, so they FAIL until the escalation lockdown is applied.
await asAuth(AUTH1);
await expectError(
    `insert into public.organization_members (organization_id, user_id, role_name, is_active) values ('${ORG2}', '${PROF1}', 'member', true)`,
    "membership: cross-org self-join blocked",
);
await expectRows(
    `update public.organizations set name = 'Hacked' where id = '${ORG2}' returning id`,
    0,
    "orgs: cross-org UPDATE affects 0 rows",
);
await resetRole();

// Authenticated users cannot directly create membership rows. First-run
// organization provisioning must use the trusted server-side onboarding path.
await asAuth(AUTH3);
await expectError(
    `insert into public.organization_members (organization_id, user_id, role_name, is_active) values ('${ORG3}', '${PROF3}', 'founder', true)`,
    "membership: direct self-join denied; trusted onboarding required",
);
await resetRole();

// --- representative standard pattern (invoices) ---------------------------
await asAuth(AUTH1);
await expectRows("select id from public.invoices", 1, "invoices: owner reads own org");
await expectRows(`select id from public.invoices where organization_id = '${ORG2}'`, 0, "invoices: cross-org SELECT filtered");
await resetRole();

// --- 202610100003: finance guards -----------------------------------------
await asAuth(AUTH1);
await expectError(
    `insert into public.invoices (organization_id, number, status, total, amount_paid) values ('${ORG1}', 'INV-BAD', 'archived', 10, 0)`,
    "finance: invalid invoice status blocked",
);
await expectError(
    `insert into public.invoices (organization_id, number, status, total, amount_paid) values ('${ORG1}', 'INV-OVR', 'draft', 10, 20)`,
    "finance: amount_paid > total blocked",
);
await expectError(
    `insert into public.invoices (organization_id, number, status, total, amount_paid) values ('${ORG1}', 'inv-1', 'draft', 10, 0)`,
    "finance: duplicate invoice number (case-insensitive) blocked",
);
await expectOk(
    `insert into public.invoices (organization_id, number, status, total, amount_paid) values ('${ORG1}', 'INV-OK', 'draft', 10, 0)`,
    "finance: valid invoice allowed",
);
await expectError(
    `insert into public.payments (organization_id, invoice_id, amount) values ('${ORG1}', (select id from public.invoices where number = 'INV-OK' limit 1), 0)`,
    "finance: non-positive payment blocked",
);
await resetRole();

// --- 202610100002: lead consent + dedup -----------------------------------
await asAuth(AUTH1);
await expectOk(
    `insert into public.sales_leads (organization_id, lead_name, email, consent_given, consent_at, consent_notice_version) values ('${ORG1}', 'Lead A', 'Alice@X.com', true, now(), '2026-10-01')`,
    "leads: consent columns accept insert",
);
await expectError(
    `insert into public.sales_leads (organization_id, lead_name, email) values ('${ORG1}', 'Lead B', 'alice@x.com')`,
    "leads: duplicate (org, lower(email)) blocked",
);
await resetRole();
await asAuth(AUTH2);
await expectOk(
    `insert into public.sales_leads (organization_id, lead_name, email) values ('${ORG2}', 'Lead C', 'alice@x.com')`,
    "leads: same email allowed in a different org",
);
await resetRole();

// --- 202610120002: authenticated read-scope lockdown ----------------------
// Ordinary member of ORG1 sees only their own org / peers / profile.
await asAuth(AUTH1);
await expectRows(`select id from public.organizations where id = '${ORG1}'`, 1, "reads: member sees own org");
await expectRows(`select id from public.organizations where id = '${ORG2}'`, 0, "reads: member cannot see other org");
await expectRows(
    `select id from public.organization_members where organization_id = '${ORG2}'`,
    0,
    "reads: member cannot list other org's members",
);
await expectRows(`select id from public.user_profiles where id = '${PROF2}'`, 0, "reads: member cannot read other-org profile");
await expectRows(`select id from public.user_profiles where id = '${PROF1}'`, 1, "reads: member reads own profile");
await expectRows(
    `update public.user_profiles set full_name = 'Hacked' where id = '${PROF2}' returning id`,
    0,
    "profiles: cross-user UPDATE affects 0 rows",
);
await expectRows(
    `update public.user_profiles set full_name = 'One' where id = '${PROF1}' returning id`,
    1,
    "profiles: self UPDATE allowed",
);
await resetRole();

// A memberless user sees nothing of anyone else.
await asAuth(AUTH5);
await expectRows("select id from public.organizations", 0, "reads: memberless user sees no orgs");
await expectRows("select id from public.organization_members", 0, "reads: memberless user sees no memberships");
await expectRows(`select id from public.user_profiles where id = '${PROF2}'`, 0, "reads: memberless user cannot read other profile");
await resetRole();

// Even a super_admin membership is tenant-scoped by the current identity
// policies; cross-organization identity reads remain denied at the RLS layer.
await asAuth(AUTH4);
await expectRows(`select id from public.organizations where id = '${ORG2}'`, 0, "reads: super_admin cannot bypass tenant boundary");
await expectRows(`select id from public.user_profiles where id = '${PROF2}'`, 0, "reads: super_admin cannot read other-tenant profile");
await resetRole();

// --- 202610120004: module-table tenant reads --------------------------------
// One representative table per enabled module family. AUTH1 founds ORG1 only.
// Same-tenant positive reads must work (dashboards were inert under full deny);
// cross-tenant SELECT/INSERT/UPDATE must fail; memberless sees nothing; the
// platform admin keeps cross-org visibility.
const MODULE_TABLES = [
    { tbl: "csg_success_plans", col: "title", evil: "'Plan Evil'", insCols: "title", insVals: "'Evil'" },
    { tbl: "de_blueprints", col: "name", evil: "'BP Evil'", insCols: "blueprint_key, name, category", insVals: "'evil', 'Evil', 'web'" },
    { tbl: "executive_recommendations", col: "title", evil: "'Rec Evil'", insCols: "agent_key, title", insVals: "'agent-a', 'Evil'" },
    { tbl: "executive_approvals", col: "action_summary", evil: "'Approve Evil'", insCols: "agent_key, action_summary", insVals: "'agent-a', 'Evil'" },
];
await asAuth(AUTH1);
for (const t of MODULE_TABLES) {
    await expectRows(`select id from public.${t.tbl} where organization_id = '${ORG1}'`, 1, `module: ${t.tbl} same-tenant read`);
    await expectRows(`select id from public.${t.tbl} where organization_id = '${ORG2}'`, 0, `module: ${t.tbl} cross-org read denied`);
    await expectError(
        `insert into public.${t.tbl} (organization_id, ${t.insCols}) values ('${ORG2}', ${t.insVals})`,
        `module: ${t.tbl} cross-org INSERT blocked`,
    );
    await expectRows(
        `update public.${t.tbl} set ${t.col} = ${t.evil} where organization_id = '${ORG2}' returning id`,
        0,
        `module: ${t.tbl} cross-org UPDATE affects 0 rows`,
    );
    await expectRows(
        `update public.${t.tbl} set ${t.col} = ${t.evil} where organization_id = '${ORG1}' returning id`,
        1,
        `module: ${t.tbl} same-tenant UPDATE allowed`,
    );
}
await resetRole();

// A memberless user sees nothing in the module tables either.
await asAuth(AUTH5);
for (const t of MODULE_TABLES) {
    await expectRows(`select id from public.${t.tbl}`, 0, `module: ${t.tbl} memberless sees nothing`);
}
await resetRole();

// Platform admin (super_admin in ORG1) keeps cross-org visibility on the
// identity layer only (organizations/members/profiles per 202610120002).
// Business/module rows stay member-scoped — exactly like invoices and
// crm_clients — so the admin sees 0 of ORG2's module rows here.
await asAuth(AUTH4);
for (const t of MODULE_TABLES) {
    await expectRows(`select id from public.${t.tbl} where organization_id = '${ORG2}'`, 0, `module: ${t.tbl} business-data isolation holds for platform admin`);
}
await resetRole();

// --- 202610120005: governed outbound webhooks --------------------------------
// Named targets + delivery log. Same-tenant positive, cross-tenant denied,
// memberless sees nothing; policy-shape assertion reuses the module gate.
await asAuth(AUTH1);
await expectRows(`select id from public.integration_webhooks where organization_id = '${ORG1}'`, 1, "webhooks: same-tenant read");
await expectRows(`select id from public.integration_webhooks where organization_id = '${ORG2}'`, 0, "webhooks: cross-org read denied");
await expectError(
    `insert into public.integration_webhooks (organization_id, name, url, secret) values ('${ORG2}', 'evil', 'https://evil.example.net/x', 'x')`,
    "webhooks: cross-org INSERT blocked",
);
await expectRows(
    `update public.integration_webhooks set name = 'Hacked' where organization_id = '${ORG2}' returning id`,
    0,
    "webhooks: cross-org UPDATE affects 0 rows",
);
await expectRows(`select id from public.integration_deliveries where organization_id = '${ORG1}'`, 1, "deliveries: same-tenant read");
await expectRows(`select id from public.integration_deliveries where organization_id = '${ORG2}'`, 0, "deliveries: cross-org read denied");
await expectError(
    `insert into public.integration_deliveries (organization_id, event) values ('${ORG2}', 'evil')`,
    "deliveries: cross-org INSERT blocked",
);
await resetRole();

await asAuth(AUTH5);
await expectRows("select id from public.integration_webhooks", 0, "webhooks: memberless sees nothing");
await expectRows("select id from public.integration_deliveries", 0, "deliveries: memberless sees nothing");
await resetRole();

await expectModulePolicy("integration_webhooks");
await expectModulePolicy("integration_deliveries");
const apiKeyPrivileges = await db.query(`
    select
        has_table_privilege('anon', 'public.intg_api_keys', 'select') as anon_select,
        has_column_privilege('anon', 'public.intg_api_keys', 'key_hash', 'select') as anon_hash_select,
        has_column_privilege('anon', 'public.intg_api_keys', 'key_hash', 'insert') as anon_hash_insert,
        has_column_privilege('anon', 'public.intg_api_keys', 'status', 'update') as anon_status_update,
        has_table_privilege('authenticated', 'public.intg_api_keys', 'select') as auth_table_select,
        has_column_privilege('authenticated', 'public.intg_api_keys', 'key_hash', 'select') as auth_hash_select,
        has_column_privilege('authenticated', 'public.intg_api_keys', 'key_prefix', 'select') as auth_prefix_select,
        has_column_privilege('authenticated', 'public.intg_api_keys', 'key_hash', 'insert') as auth_hash_insert,
        has_column_privilege('authenticated', 'public.intg_api_keys', 'status', 'update') as auth_status_update,
        has_column_privilege('authenticated', 'public.intg_api_keys', 'key_hash', 'update') as auth_hash_update,
        has_column_privilege('authenticated', 'public.intg_api_keys', 'organization_id', 'update') as auth_org_update,
        has_table_privilege('authenticated', 'public.intg_api_keys', 'delete') as auth_delete;
`);
const apiKeyGrant = apiKeyPrivileges.rows[0];
record("api keys: anon has no table or legacy column privileges",
    !apiKeyGrant.anon_select && !apiKeyGrant.anon_hash_select && !apiKeyGrant.anon_hash_insert && !apiKeyGrant.anon_status_update);
record("api keys: hash is not readable by authenticated", !apiKeyGrant.auth_table_select && !apiKeyGrant.auth_hash_select && apiKeyGrant.auth_prefix_select);
record("api keys: authenticated can insert hash but cannot change it or tenant ownership later",
    apiKeyGrant.auth_hash_insert && apiKeyGrant.auth_status_update && !apiKeyGrant.auth_hash_update && !apiKeyGrant.auth_org_update);
record("api keys: authenticated cannot delete keys", !apiKeyGrant.auth_delete);
const apiKeyPolicies = await db.query(`
    select policyname, cmd, coalesce(qual, '') as qual, coalesce(with_check, '') as wc, roles::text as roles
    from pg_policies where schemaname = 'public' and tablename = 'intg_api_keys';
`);
for (const [name, command, required] of [
    ["intg_api_keys_select", "SELECT", "is_organization_member"],
    ["intg_api_keys_insert", "INSERT", "is_organization_admin"],
    ["intg_api_keys_update", "UPDATE", "is_organization_admin"],
]) {
    const policy = apiKeyPolicies.rows.find((row) => row.policyname === name && row.cmd === command);
    const expression = policy ? `${policy.qual} ${policy.wc}` : "";
    record(`api keys: ${command.toLowerCase()} restricted to tenant role`,
        Boolean(policy) && policy.roles.includes("authenticated") && expression.includes(required) && expression.includes("organization_id"));
}

// Policy-shape gate over all 20 tables enabled by 202610120004.
for (const tbl of [
    "csg_success_plans", "csg_onboarding_sessions", "csg_delivery_milestones",
    "csg_feedback_responses", "csg_escalations", "csg_renewals",
    "csg_improvement_items", "csg_audit_logs",
    "de_blueprints", "de_components", "de_engagements", "de_pipeline_runs",
    "de_quality_verifications", "de_knowledge_entries", "de_analytics_metrics",
    "de_ai_recommendations",
    "executive_recommendations", "executive_collaboration",
    "executive_audit_logs", "executive_approvals",
]) {
    await expectModulePolicy(tbl);
}

await db.close();

console.log(`\n${failed === 0 ? "PASS" : "FAIL"}: tenant-isolation verification (${failed} failure(s)).`);
process.exit(failed === 0 ? 0 : 1);
