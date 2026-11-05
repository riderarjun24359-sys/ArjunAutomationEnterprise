-- Close organization membership INSERT privilege escalation.
--
-- 202610110001 intentionally allowed any existing member to insert a
-- membership for another user. That made the UPDATE-only hardening incomplete:
-- a member could create a new owner/admin/super_admin membership instead.
--
-- Preserve first-run self-bootstrap (first member of a truly empty org becomes
-- founder), allow org administrators to invite normal roles, and reserve
-- elevated roles for an active platform super-admin.

create or replace function public.can_bootstrap_organization_membership(
  org_id uuid,
  target_user_id uuid,
  target_role text
)
returns boolean
language sql
stable
security definer
set search_path = public
set row_security = off
as $$
  select
    target_user_id = public.auth_profile_id()
    and target_role = 'founder'
    and not exists (
      select 1
      from public.organization_members existing
      where existing.organization_id = org_id
    );
$$;

create or replace function public.is_platform_super_admin()
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
    where actor.user_id = public.auth_profile_id()
      and actor.role_name = 'super_admin'
      and actor.is_active = true
  );
$$;

revoke all on function public.can_bootstrap_organization_membership(uuid, uuid, text) from public;
revoke all on function public.is_platform_super_admin() from public;
grant execute on function public.can_bootstrap_organization_membership(uuid, uuid, text) to authenticated, service_role;
grant execute on function public.is_platform_super_admin() to authenticated, service_role;

create or replace function public.guard_organization_membership_insert()
returns trigger
language plpgsql
security definer
set search_path = public
set row_security = off
as $$
declare
  actor_profile_id uuid;
begin
  if auth.role() = 'service_role' then
    return new;
  end if;

  actor_profile_id := public.auth_profile_id();
  if actor_profile_id is null then
    raise exception 'membership insert requires an authenticated profile'
      using errcode = '42501';
  end if;

  if public.can_bootstrap_organization_membership(
    new.organization_id, new.user_id, new.role_name
  ) then
    return new;
  end if;

  if not public.can_manage_organization_members(new.organization_id) then
    raise exception 'only organization administrators can invite members'
      using errcode = '42501';
  end if;

  if new.role_name in ('admin', 'founder', 'owner', 'super_admin')
     and not public.is_platform_super_admin() then
    raise exception 'only a platform super-admin can grant elevated membership roles'
      using errcode = '42501';
  end if;

  return new;
end;
$$;

drop trigger if exists guard_organization_membership_insert
  on public.organization_members;
create trigger guard_organization_membership_insert
before insert on public.organization_members
for each row execute function public.guard_organization_membership_insert();

drop policy if exists memberships_insert on public.organization_members;
create policy memberships_insert
  on public.organization_members
  for insert
  to authenticated
  with check (
    public.can_bootstrap_organization_membership(
      organization_id, user_id, role_name
    )
    or (
      public.can_manage_organization_members(organization_id)
      and (
        role_name in ('member', 'manager', 'viewer')
        or (
          role_name in ('admin', 'founder', 'owner', 'super_admin')
          and public.is_platform_super_admin()
        )
      )
    )
  );
