// @vitest-environment node
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { PGlite } from "@electric-sql/pglite";

/**
 * Tenant-isolation integration tests against REAL Postgres (PGlite).
 *
 * Applies the ACTUAL migration files (foundation + remediation) with only
 * Supabase-host plumbing stubbed (auth.uid via session GUC, anon/
 * authenticated roles, minimal org/membership tables). Policies, helpers,
 * and grants under test are the real file contents — no copies.
 *
 * A negative-control database (foundation only) proves the harness can
 * actually detect the open-policy vulnerability instead of passing vacuously.
 */

const dir = join(dirname(fileURLToPath(import.meta.url)));
const read = (name: string): string => readFileSync(join(dir, name), "utf8");

const AUTH_STUB = `
create schema if not exists auth;
create or replace function auth.uid() returns uuid language sql stable as $$
  select current_setting('app.auth_uid', true)::uuid;
$$;
do $$ begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then create role anon; end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then create role authenticated; end if;
end $$;
`;

const BASE_TABLES = `
create table if not exists public.organizations (id uuid primary key);
create table if not exists public.user_profiles (id uuid primary key, auth_user_id uuid unique);
create table if not exists public.organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  user_id uuid not null,
  is_active boolean not null default true
);
grant usage on schema public to anon, authenticated;
`;

function extractHelper(source: string, name: string): string {
    const match = source.match(
        new RegExp(`create or replace function public\\.${name}\\([\\s\\S]*?\\$\\$;`),
    );
    if (!match) throw new Error(`helper ${name} not found in migration source`);
    return match[0];
}

const TABLES = ["crm_clients", "crm_leads", "crm_deals", "crm_activities", "crm_tasks"] as const;

const ORG_A = "11111111-1111-1111-1111-111111111111";
const ORG_B = "22222222-2222-2222-2222-222222222222";
const AUTH_A = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";
const AUTH_B = "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb";
const PROFILE_A = "a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1";
const PROFILE_B = "b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2";

async function buildDb(applyRemediation: boolean): Promise<PGlite> {
    const db = new PGlite();
    await db.exec(AUTH_STUB);
    await db.exec(BASE_TABLES);
    const dataPlatform = read("202608020004_enterprise_data_platform.sql");
    await db.exec(extractHelper(dataPlatform, "auth_profile_id"));
    await db.exec(extractHelper(dataPlatform, "is_organization_member"));
    await db.exec(read("202608020002_crm_foundation.sql"));
    // Mirror hosted Supabase default privileges so RLS (not missing grants) decides.
    await db.exec(`grant select, insert, update, delete on all tables in schema public to authenticated;`);
    if (applyRemediation) {
        await db.exec(read("202610100001_crm_rls_remediation.sql"));
    }
    // Seed as owner (bypasses RLS, like service_role).
    await db.exec(`
      insert into public.organizations (id) values ('${ORG_A}'), ('${ORG_B}');
      insert into public.user_profiles (id, auth_user_id) values ('${PROFILE_A}', '${AUTH_A}'), ('${PROFILE_B}', '${AUTH_B}');
      insert into public.organization_members (organization_id, user_id, is_active) values
        ('${ORG_A}', '${PROFILE_A}', true),
        ('${ORG_B}', '${PROFILE_B}', true);
      insert into public.crm_clients (organization_id, name, contact_email, manager_name) values
        ('${ORG_A}', 'Org A Client', 'a@example.com', 'Alice'),
        ('${ORG_B}', 'Org B Client', 'b@example.com', 'Bob');
    `);
    return db;
}

async function asUser(db: PGlite, authUid: string | null): Promise<void> {
    await db.exec(`reset role;`);
    await db.exec(`set role authenticated;`);
    if (authUid) await db.exec(`set app.auth_uid = '${authUid}';`);
    else await db.exec(`reset app.auth_uid;`);
}

async function asAnon(db: PGlite): Promise<void> {
    await db.exec(`reset role;`);
    await db.exec(`set role anon;`);
    await db.exec(`reset app.auth_uid;`);
}

async function countVisible(db: PGlite, table: string): Promise<number> {
    const result = await db.query<{ count: string }>(`select count(*)::text as count from public.${table};`);
    return Number((result.rows[0] as { count: string }).count);
}

describe("crm RLS isolation (PGlite)", () => {
    let fixed: PGlite;
    let open: PGlite;

    beforeAll(async () => {
        fixed = await buildDb(true);
        open = await buildDb(false);
    }, 120_000);

    afterAll(async () => {
        await fixed?.close();
        await open?.close();
    });

    it("negative control: foundation-only policies leak across organizations", async () => {
        await asUser(open, AUTH_A);
        expect(await countVisible(open, "crm_clients")).toBe(2);
    });

    it.each(TABLES)("remediated %s: member sees only their own organization", async (table) => {
        await asUser(fixed, AUTH_A);
        expect(await countVisible(fixed, table)).toBeLessThanOrEqual(1);
        if (table === "crm_clients") {
            const rows = await fixed.query<{ name: string }>(`select name from public.crm_clients;`);
            expect(rows.rows.map((r) => r.name)).toEqual(["Org A Client"]);
        }
    });

    it("remediated: cross-org INSERT/UPDATE/DELETE are denied", async () => {
        await asUser(fixed, AUTH_A);
        await expect(
            fixed.query(`insert into public.crm_clients (organization_id, name, contact_email, manager_name) values ('${ORG_B}', 'X', 'x@x.com', 'X');`),
        ).rejects.toThrow(/row-level security|permission denied/i);
        const own = await fixed.query<{ id: string }>(
            `insert into public.crm_clients (organization_id, name, contact_email, manager_name) values ('${ORG_A}', 'A2', 'a2@example.com', 'Alice') returning id;`,
        );
        expect((own.rows[0] as { id: string }).id).toBeTruthy();
        // RLS USING on UPDATE/DELETE filters (0 rows) rather than raising;
        // WITH CHECK on INSERT raises. Both deny in effect — assert each form.
        const updated = await fixed.query(`update public.crm_clients set name = 'Hijacked' where organization_id = '${ORG_B}';`);
        expect(updated.affectedRows ?? updated.rows.length).toBe(0);
        const deleted = await fixed.query(`delete from public.crm_clients where organization_id = '${ORG_B}';`);
        expect(deleted.affectedRows ?? deleted.rows.length).toBe(0);
        await asUser(fixed, AUTH_B);
        const intact = await fixed.query<{ name: string }>(`select name from public.crm_clients where organization_id = '${ORG_B}';`);
        expect(intact.rows.map((r) => r.name)).toContain("Org B Client");
    });

    it("remediated: anonymous access is denied", async () => {
        await asAnon(fixed);
        await expect(fixed.query(`select * from public.crm_clients;`)).rejects.toThrow(/permission denied/i);
    });
});
