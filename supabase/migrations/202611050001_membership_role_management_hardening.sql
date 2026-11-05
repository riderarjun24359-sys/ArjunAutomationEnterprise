-- Membership role-management hardening.
--
-- Fixes a privilege-escalation gap left by 202610120001:
--   * ordinary members could UPDATE their own membership role;
--   * membership UPDATE was scoped only to "is a member", not an administrator;
--   * a member could therefore self-promote after joining an organization.
--
-- This migration deliberately preserves the browser membership role-management
-- flow for organization administrators, while enforcing the same rule in both
-- RLS and a trigger. Platform service-role operations remain supported.

create or replace function public.can_manage_organization_members(org_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
set row_security = off
as $$
  select exists (
    select 1
    from public.organization_members actor
    where actor.organization_id = org_id
      and actor.user_id = public.auth_profile_id()
      and actor.is_active = true
      and actor.role_name in ('founder', 'owner', 'admin', 'super_admin')
  );
$$;

revoke all on function public.can_manage_organization_members(uuid) from public;
grant execute on function public.can_manage_organization_members(uuid) to authenticated, service_role;

create or replace function public.guard_organization_membership_update()
returns trigger
language plpgsql
security definer
set search_path = public
set row_security = off
as $$
declare
  actor_profile_id uuid;
  actor_role text;
begin
  -- Trusted server-side service-role operations are allowed; browser sessions
  -- must pass the organization-admin checks below.
  if auth.role() = 'service_role' then
    return new;
  end if;

  actor_profile_id := public.auth_profile_id();
  if actor_profile_id is null then
    raise exception 'membership update requires an authenticated profile'
      using errcode = '42501';
  end if;

  select actor.role_name
    into actor_role
  from public.organization_members actor
  where actor.organization_id = old.organization_id
    and actor.user_id = actor_profile_id
    and actor.is_active = true;

  if actor_role is null or actor_role not in ('founder', 'owner', 'admin', 'super_admin') then
    raise exception 'only organization administrators can manage memberships'
      using errcode = '42501';
  end if;

  if new.organization_id is distinct from old.organization_id
     or new.user_id is distinct from old.user_id then
    raise exception 'membership identity and organization are immutable'
      using errcode = '42501';
  end if;

  if old.user_id = actor_profile_id
     and (new.role_name is distinct from old.role_name
          or new.is_active is distinct from old.is_active) then
    raise exception 'administrators cannot change their own membership privileges'
      using errcode = '42501';
  end if;

  if old.role_name = 'super_admin' and actor_role <> 'super_admin' then
    raise exception 'only a platform administrator can manage a platform administrator'
      using errcode = '42501';
  end if;

  if new.role_name in ('super_admin', 'founder', 'owner')
     and actor_role <> 'super_admin' then
    raise exception 'only a platform administrator can grant elevated ownership roles'
      using errcode = '42501';
  end if;

  return new;
end;
$$;

drop trigger if exists guard_organization_membership_update
  on public.organization_members;
create trigger guard_organization_membership_update
before update on public.organization_members
for each row execute function public.guard_organization_membership_update();

do $$
begin
  drop policy if exists memberships_update on public.organization_members;
  create policy memberships_update
    on public.organization_members
    for update
    to authenticated
    using (public.can_manage_organization_members(organization_id))
    with check (public.can_manage_organization_members(organization_id));
end
$$;
