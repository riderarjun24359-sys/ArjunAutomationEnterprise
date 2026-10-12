-- Authenticated READ-scope lockdown for the foundation tables.
--
-- STATUS: PREPARED / HELD — NOT APPLIED to any database (local or remote).
-- This migration is applied LAST in the order documented in
-- docs/STAGING_TO_PRODUCTION_MIGRATION_PROCEDURE.md §2 step 5, and ONLY after:
--   (a) staging pre-state is captured and the platform operator holds an active
--       `super_admin` membership (§2 step 5a), and
--   (b) the staging probes pass.  Do NOT ship this before staging validation.
--
-- CONTEXT: 202608020001_enterprise_foundation.sql created these for
-- `authenticated` with USING(true) / WITH CHECK(true):
--   orgs_select, orgs_insert, orgs_update,
--   profiles_select, profiles_insert, profiles_update,
--   memberships_select, memberships_insert, memberships_update.
-- 202608020004_enterprise_data_platform.sql ALREADY replaced the user_profiles
-- policies with self-only (`auth_user_id = auth.uid()`), so profiles were NOT
-- left open. 202610110001 recreated the organizations/organization_members
-- policies `to authenticated` but kept the reads broad; 202610120001 fixed the
-- WRITE escalation (membership self-join + orgs_update).
--
-- What this migration changes:
--   * orgs_select USING(true)        -> any signed-in user enumerates every org.
--   * memberships_select USING(true) -> enumerates every org's member list.
--   * profiles_select self-only      -> broadened ON PURPOSE to self + people who
--                                       share an organization + platform admins,
--                                       so the teammate directory works under
--                                       RLS (this is a scope fix, not a hole fix).
--   * profiles_insert/update         -> restated as self-only (`auth_user_id =
--                                       auth.uid()`), matching 202608020004.
--
-- DESIGN: reads are scoped to (i) the caller's own rows, (ii) organizations the
-- caller is an active member of, or (iii) platform admins. Platform-admin is the
-- DB-visible marker `super_admin` — a platform-level role already present in the
-- organization_members role check constraint and in src/constants/roles.ts,
-- excluded from invitation grants. The helper is SECURITY DEFINER so it (and the
-- shared-org check) can be referenced from the very tables' policies without RLS
-- recursion. NOTE: the app must have at least one active `super_admin`
-- membership before this is applied or platform analytics lose cross-org
-- visibility (see the staging procedure §2 step 5a).

-- Platform admin = an active `super_admin` membership held by the caller.
create or replace function public.is_platform_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.organization_members om
    where om.user_id = public.auth_profile_id()
      and om.is_active = true
      and om.role_name = 'super_admin'
  );
$$;

grant execute on function public.is_platform_admin() to authenticated;

-- True when the given profile shares at least one organization with the caller.
create or replace function public.shares_organization_with(profile_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.organization_members mine
    join public.organization_members theirs
      on theirs.organization_id = mine.organization_id
    where mine.user_id = public.auth_profile_id()
      and mine.is_active = true
      and theirs.user_id = profile_id
  );
$$;

grant execute on function public.shares_organization_with(uuid) to authenticated;

do $$
begin
    -- organizations: members read their own org (or platform admin).
    drop policy if exists orgs_select on public.organizations;
    create policy orgs_select on public.organizations for select to authenticated
        using (public.is_organization_member(id) or public.is_platform_admin());

    -- organization_members: own rows, rows of orgs the caller belongs to, or
    -- platform admin.
    drop policy if exists memberships_select on public.organization_members;
    create policy memberships_select on public.organization_members for select to authenticated
        using (
            user_id = public.auth_profile_id()
            or public.is_organization_member(organization_id)
            or public.is_platform_admin()
        );

    -- user_profiles: self, people who share an org, or platform admin.
    drop policy if exists profiles_select on public.user_profiles;
    create policy profiles_select on public.user_profiles for select to authenticated
        using (
            id = public.auth_profile_id()
            or public.shares_organization_with(id)
            or public.is_platform_admin()
        );

    -- user_profiles: a caller may only create/update their own profile row.
    drop policy if exists profiles_insert on public.user_profiles;
    create policy profiles_insert on public.user_profiles for insert to authenticated
        with check (auth_user_id = auth.uid());

    drop policy if exists profiles_update on public.user_profiles;
    create policy profiles_update on public.user_profiles for update to authenticated
        using (auth_user_id = auth.uid())
        with check (auth_user_id = auth.uid());
end
$$;
