-- Organization / membership anon lockdown.
--
-- STATUS: APPLIED to staging + production (2026-10-11, via the Supabase Management API).
-- Idempotent and reversible (drop/create policies).
-- Removes unauthenticated (anon) access to public.organizations and
-- public.organization_members while preserving the existing AUTHENTICATED
-- behavior used by the single-org onboarding bootstrap
-- (src/modules/database/lib/organization-context.ts) and the browser
-- repository layer (src/modules/database/lib/repository-client.ts -> the
-- caller's Supabase JWT, i.e. role `authenticated`).
--
-- CONTEXT: 202608020001_enterprise_foundation.sql created
--   orgs_select / orgs_insert / orgs_update and
--   memberships_select / memberships_insert / memberships_update with
--   USING(true) / WITH CHECK(true) and no role restriction, while Supabase's
--   default privileges granted the `anon` role table privileges.
--
-- LIVE EVIDENCE (2026-10-11, production Supabase, public anon key):
--   GET  /rest/v1/organization_members?select=*   -> 200 + rows (leak)
--   POST /rest/v1/organization_members            -> passed RLS, failed only
--                                                    the user_id FK (escalation)
-- Every other foundation table (user_profiles, audit_logs, permission_*,
-- role_permissions, storage_objects, project_*) already returns [] / 401 to
-- anon. These two were the last anonymous-exposed tables.
--
-- SCOPE: recreate the six policies `to authenticated`, restrict membership
-- INSERT to the caller's own row (or an existing org member), restrict
-- membership UPDATE to org members, and revoke all anon privileges.
-- Authenticated semantics are intentionally unchanged: the single-org
-- onboarding bootstrap depends on listing organizations + counting members
-- before a membership row exists, so tightening those authenticated reads is a
-- separate, app-coupled change (tracked in docs/MISSION_CHECKLIST.md).

do $$
begin
    -- organizations
    drop policy if exists orgs_select on public.organizations;
    drop policy if exists orgs_insert on public.organizations;
    drop policy if exists orgs_update on public.organizations;
    create policy orgs_select on public.organizations for select to authenticated using (true);
    create policy orgs_insert on public.organizations for insert to authenticated with check (true);
    create policy orgs_update on public.organizations for update to authenticated using (true) with check (true);

    -- organization_members
    drop policy if exists memberships_select on public.organization_members;
    drop policy if exists memberships_insert on public.organization_members;
    drop policy if exists memberships_update on public.organization_members;
    create policy memberships_select on public.organization_members for select to authenticated using (true);
    create policy memberships_insert on public.organization_members for insert to authenticated
        with check (user_id = public.auth_profile_id() or public.is_organization_member(organization_id));
    create policy memberships_update on public.organization_members for update to authenticated
        using (public.is_organization_member(organization_id))
        with check (public.is_organization_member(organization_id));
end
$$;

revoke all on public.organizations from anon;
revoke all on public.organization_members from anon;
grant select, insert, update, delete on public.organizations to authenticated;
grant select, insert, update, delete on public.organization_members to authenticated;
