-- Organization membership / organization write escalation lockdown.
--
-- STATUS: PREPARED ONLY — NOT APPLIED to any database (local or remote).
-- Apply path (owner action, non-production first, per docs/OWNER_ACTIONS.md §6b):
--   1. Test on a disposable Supabase branch/instance with representative data.
--   2. Regenerate/verify supabase/apply_all.sql so it includes this migration.
--   3. Run `npm run db:verify`, `npm run db:validate`, `npm run rls:verify`.
--   4. Live-probe staging as a signed-in non-member (self-join must 4xx), then production.
--
-- CONTEXT: 202610110001_org_member_anon_lockdown.sql (APPLIED to staging +
-- production 2026-10-11) removed unknown/anon access to public.organizations and
-- public.organization_members, but intentionally LEFT the authenticated write
-- policies open:
--   * memberships_insert: WITH CHECK (user_id = auth_profile_id() OR
--     is_organization_member(organization_id)) — any authenticated user can
--     insert a membership row for THEIR OWN profile into ANY organization;
--   * orgs_update: USING(true) WITH CHECK(true) — any authenticated user can
--     update ANY organization row.
--
-- IMPACT (privilege escalation / cross-tenant takeover): a signed-in user can
-- self-join an arbitrary organization, after which is_organization_member()
-- returns true for that org — exposing every row guarded by the repo-standard
-- policy (clients, projects, invoices, sales_leads, crm_*, ...) — and then
-- memberships_update (USING is_organization_member(organization_id)) lets them
-- raise their own role to admin. Proven locally (before this migration) by the
-- negative-control probes in scripts/verify-rls-isolation.mjs
-- (`membership: cross-org self-join blocked`, `orgs: cross-org UPDATE affects
-- 0 rows`): both FAIL against the pre-fix chain.
--
-- SCOPE: restrict membership INSERT to (a) the caller's own membership into an
-- organization that has NEVER had a member (first-run founder bootstrap — the
-- only legitimate self-insert, mirroring knowledge_membership any-status rule in
-- src/modules/database/lib/organization-context.ts) or (b) a membership row in
-- an organization the caller already belongs to (an existing member adding
-- someone). Restrict orgs UPDATE to the caller's own organization. Authenticated
-- READS of organizations/organization_members are intentionally left unchanged
-- here: the single-org bootstrap and several platform-analytics repositories
-- list organizations broadly, so tightening those reads is a separate
-- app-coupled change (tracked in docs/MISSION_CHECKLIST.md).

-- Security-definer helper: does an organization have zero membership rows
-- (active OR inactive)? SECURITY DEFINER so it can be referenced from
-- organization_members' own INSERT policy without triggering infinite RLS
-- recursion, and so the count is not filtered by the caller's RLS.
create or replace function public.organization_is_memberless(org_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select not exists (
    select 1 from public.organization_members where organization_id = org_id
  );
$$;

grant execute on function public.organization_is_memberless(uuid) to authenticated;

do $$
begin
    -- organizations: only an existing member may update the organization row.
    drop policy if exists orgs_update on public.organizations;
    create policy orgs_update on public.organizations for update to authenticated
        using (public.is_organization_member(id))
        with check (public.is_organization_member(id));

    -- organization_members: no self-join to a populated org, no arbitrary writes.
    drop policy if exists memberships_insert on public.organization_members;
    create policy memberships_insert on public.organization_members for insert to authenticated
        with check (
            (user_id = public.auth_profile_id() and public.organization_is_memberless(organization_id))
            or public.is_organization_member(organization_id)
        );
end
$$;
