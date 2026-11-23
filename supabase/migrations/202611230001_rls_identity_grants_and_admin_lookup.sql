-- RLS hardening follow-up: make the identity-layer grants explicit and
-- resolve platform-admin identity directly from the JWT subject.
--
-- Table grants do not bypass RLS. They only allow authenticated callers to
-- reach the policies; tenant visibility remains controlled by the policies
-- installed in 202610120001/002.

grant select, insert, update, delete
  on table public.organizations, public.organization_members, public.user_profiles
  to authenticated;

-- Avoid depending on auth_profile_id() inside the platform-admin helper.
-- Resolve the caller using auth.uid() directly, then check for an active
-- super_admin membership. SECURITY DEFINER avoids RLS recursion on the
-- membership table; the JWT subject remains the sole caller identity.
create or replace function public.is_platform_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_profiles up
    join public.organization_members om on om.user_id = up.id
    where up.auth_user_id = auth.uid()
      and om.is_active = true
      and om.role_name = 'super_admin'
  );
$$;

revoke all on function public.is_platform_admin() from public;
grant execute on function public.is_platform_admin() to authenticated;
