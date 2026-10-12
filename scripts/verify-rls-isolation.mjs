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
 *      escalation lockdown, 202610120002 authenticated read-scope lockdown)
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

// Positive control: a genuinely new user may still found a memberless org.
await asAuth(AUTH3);
await expectOk(
    `insert into public.organization_members (organization_id, user_id, role_name, is_active) values ('${ORG3}', '${PROF3}', 'founder', true)`,
    "membership: first-run founder self-join allowed",
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

// Platform admin (active super_admin membership) retains cross-org visibility.
await asAuth(AUTH4);
await expectRows(`select id from public.organizations where id = '${ORG2}'`, 1, "reads: platform admin sees other org");
await expectRows(`select id from public.user_profiles where id = '${PROF2}'`, 1, "reads: platform admin sees other profile");
await resetRole();

await db.close();

console.log(`\n${failed === 0 ? "PASS" : "FAIL"}: tenant-isolation verification (${failed} failure(s)).`);
process.exit(failed === 0 ? 0 : 1);
