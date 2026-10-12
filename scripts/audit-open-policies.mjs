#!/usr/bin/env node
/**
 * Open-policy audit: applies the FULL migration chain to embedded Postgres and
 * reports the FINAL policy state (later migrations override earlier ones).
 *
 *   FAIL (exit 1): any policy granting `authenticated`/`public` an unscoped
 *                  (`USING (true)`) read on a tenant table (a table carrying an
 *                  `organization_id` column) — a cross-tenant read hole.
 *   WARN (exit 0): tenant tables with RLS enabled but NO SELECT policy for
 *                  authenticated/public — deny-by-default. This is the *secure*
 *                  posture, but it means browser (RLS) reads of those tables
 *                  return empty, so any UI feature backed by them is inert.
 *
 * Read-only audit; never touches a remote database.
 *
 * Run locally:  npm run rls:audit
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const { PGlite } = await import("@electric-sql/pglite");
const db = new PGlite();

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

await db.exec(authStub);

const migDir = join(root, "supabase", "migrations");
const files = readdirSync(migDir).filter((f) => f.endsWith(".sql")).sort();
for (const file of files) {
    let sql = readFileSync(join(migDir, file), "utf8");
    sql = sql.replace(/create extension if not exists "uuid-ossp";/gi, "-- stubbed");
    sql = sql.replace(/create extension if not exists "pgcrypto";/gi, "-- stubbed");
    await db.exec(`begin; ${sql} commit;`);
}
console.log(`Applied ${files.length} migrations.\n`);

// Tenant tables = tables with an organization_id column.
const tenantTables = await db.query(`
  select table_name from information_schema.columns
  where table_schema = 'public' and column_name = 'organization_id'
  order by table_name;
`);
const tenantSet = new Set((tenantTables.rows ?? []).map((r) => r.table_name));

// 1) Open policies (USING true or WITH CHECK true) on tenant tables for authenticated/public.
const open = await db.query(`
  select tablename, policyname, cmd, qual, with_check
  from pg_policies
  where schemaname = 'public'
    and (roles::text like '%authenticated%' or roles::text like '%public%')
    and (lower(btrim(coalesce(qual, ''))) = 'true'
         or lower(btrim(coalesce(with_check, ''))) = 'true')
  order by tablename, policyname;
`);
const openRows = (open.rows ?? []).filter((r) => tenantSet.has(r.tablename));

// 2) Tenant tables with RLS enabled but no SELECT policy for authenticated/public.
const rlsEnabled = await db.query(`
  select c.relname as table_name
  from pg_class c join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public' and c.relkind = 'r'
    and exists (select 1 from information_schema.columns cols
                where cols.table_schema='public' and cols.table_name=c.relname
                  and cols.column_name='organization_id')
    and c.relrowsecurity;
`);
const noSelect = [];
for (const row of rlsEnabled.rows ?? []) {
    const t = row.table_name;
    const has = await db.query(
        `select 1 from pg_policies
         where schemaname='public' and tablename=$1
           and cmd in ('SELECT','ALL')
           and (coalesce(roles::text,'{}') = '{}'
                or roles::text like '%authenticated%'
                or roles::text like '%public%')
         limit 1;`,
        [t],
    );
    if (!has.rows?.length) noSelect.push(t);
}

console.log("=== Open policies on tenant tables (USING/WITH CHECK true) — SECURITY FAIL ===");
if (!openRows.length) console.log("  none");
for (const r of openRows) console.log(`  ${r.tablename}.${r.policyname} [${r.cmd}] qual=${r.qual ?? 'null'} with_check=${r.with_check ?? 'null'}`);

console.log("\n=== Tenant tables with RLS but no SELECT policy (deny-by-default) — WARN ===");
if (!noSelect.length) console.log("  none");
for (const t of noSelect) console.log(`  ${t}`);

await db.close();
process.exit(openRows.length === 0 ? 0 : 1);
