// @vitest-environment node
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { PGlite } from "@electric-sql/pglite";

/**
 * Anon-lockdown tests for organizations / organization_members against REAL
 * Postgres (PGlite), using the ACTUAL migration file plus the real
 * auth_profile_id / is_organization_member helpers. A negative-control database
 * (foundation-style open policies, no lockdown) proves the harness can detect
 * the anonymous exposure instead of passing vacuously.
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

// Mirrors the foundation migration's open policies + Supabase default grants.
const BASE = `
create table if not exists public.organizations (
  id uuid primary key,
  name text not null default ''
);
create table if not exists public.user_profiles (
  id uuid primary key,
  auth_user_id uuid unique
);
create table if not exists public.organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  user_id uuid not null,
  role_name text not null default 'member',
  is_active boolean not null default true,
  unique (organization_id, user_id)
);
create policy orgs_select on public.organizations for select using (true);
create policy orgs_insert on public.organizations for insert with check (true);
create policy orgs_update on public.organizations for update using (true) with check (true);
create policy memberships_select on public.organization_members for select using (true);
create policy memberships_insert on public.organization_members for insert with check (true);
create policy memberships_update on public.organization_members for update using (true) with check (true);
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on all tables in schema public to anon, authenticated;
`;

function extractHelper(source: string, name: string): string {
    const match = source.match(
        new RegExp(`create or replace function public\\.${name}\\([\\s\\S]*?\\$\\$;`),
    );
    if (!match) throw new Error(`helper ${name} not found in migration source`);
    return match[0];
}

const ORG_A = "11111111-1111-1111-1111-111111111111";
const ORG_B = "22222222-2222-2222-2222-222222222222";
const AUTH_A = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";
const AUTH_B = "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb";
const AUTH_C = "cccccccc-cccc-cccc-cccc-cccccccccccc";
const PROFILE_A = "a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1";
const PROFILE_B = "b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2";
const PROFILE_C = "c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3";

async function buildDb(applyLockdown: boolean): Promise<PGlite> {
    const db = new PGlite();
    await db.exec(AUTH_STUB);
    await db.exec(BASE);
    const dataPlatform = read("202608020004_enterprise_data_platform.sql");
    await db.exec(extractHelper(dataPlatform, "auth_profile_id"));
    await db.exec(extractHelper(dataPlatform, "is_organization_member"));
    // Seed as owner (bypasses RLS, like service_role).
    await db.exec(`
      insert into public.organizations (id, name) values ('${ORG_A}', 'Org A'), ('${ORG_B}', 'Org B');
      insert into public.user_profiles (id, auth_user_id) values
        ('${PROFILE_A}', '${AUTH_A}'),
        ('${PROFILE_B}', '${AUTH_B}'),
        ('${PROFILE_C}', '${AUTH_C}');
      insert into public.organization_members (organization_id, user_id, role_name) values
        ('${ORG_A}', '${PROFILE_A}', 'member');
    `);
    if (applyLockdown) {
        await db.exec(read("202610110001_org_member_anon_lockdown.sql"));
    }
    return db;
}

async function asAnon(db: PGlite): Promise<void> {
    await db.exec(`reset role;`);
    await db.exec(`set role anon;`);
    await db.exec(`reset app.auth_uid;`);
}

async function asUser(db: PGlite, authUid: string): Promise<void> {
    await db.exec(`reset role;`);
    await db.exec(`set role authenticated;`);
    await db.exec(`set app.auth_uid = '${authUid}';`);
}

async function countVisible(db: PGlite, table: string): Promise<number> {
    const result = await db.query<{ count: string }>(`select count(*)::text as count from public.${table};`);
    return Number((result.rows[0] as { count: string }).count);
}

describe("organizations/members anon lockdown (PGlite)", () => {
    let locked: PGlite;
    let open: PGlite;

    beforeAll(async () => {
        locked = await buildDb(true);
        open = await buildDb(false);
    }, 120_000);

    afterAll(async () => {
        await locked?.close();
        await open?.close();
    });

    it("negative control: without lockdown anon can read organizations and members", async () => {
        await asAnon(open);
        expect(await countVisible(open, "organizations")).toBe(2);
        expect(await countVisible(open, "organization_members")).toBe(1);
    });

    it("lockdown: anon cannot read organizations", async () => {
        await asAnon(locked);
        await expect(locked.query(`select * from public.organizations;`)).rejects.toThrow(
            /permission denied|row-level security/i,
        );
    });

    it("lockdown: anon cannot insert into organization_members", async () => {
        await asAnon(locked);
        await expect(
            locked.query(
                `insert into public.organization_members (organization_id, user_id, role_name) values ('${ORG_A}', '${PROFILE_B}', 'founder');`,
            ),
        ).rejects.toThrow(/permission denied|row-level security/i);
    });

    it("lockdown preserves authenticated reads", async () => {
        await asUser(locked, AUTH_A);
        expect(await countVisible(locked, "organizations")).toBe(2);
        expect(await countVisible(locked, "organization_members")).toBeGreaterThanOrEqual(1);
    });

    it("lockdown lets a signed-in user create their own membership (onboarding bootstrap)", async () => {
        await asUser(locked, AUTH_C);
        const res = await locked.query<{ id: string }>(
            `insert into public.organization_members (organization_id, user_id, role_name) values ('${ORG_A}', '${PROFILE_C}', 'founder') returning id;`,
        );
        expect((res.rows[0] as { id: string }).id).toBeTruthy();
    });

    it("lockdown blocks a signed-in user from adding another user to an org they don't belong to", async () => {
        await asUser(locked, AUTH_C);
        await expect(
            locked.query(
                `insert into public.organization_members (organization_id, user_id, role_name) values ('${ORG_B}', '${PROFILE_B}', 'founder');`,
            ),
        ).rejects.toThrow(/row-level security|permission denied/i);
    });
});
