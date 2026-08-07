-- =============================================================================
-- Production-safe: expand organization_members.role_name CHECK + assign Founder
--
-- Current CHECK allows: super_admin | admin | manager | member | viewer
-- App RBAC also needs:  founder | owner
--
-- Scope (only):
--   1) Expand organization_members_role_name_check
--   2) Assign chittemprashantharjun@gmail.com -> founder
--
-- Does NOT:
--   - modify handle_new_profile()
--   - modify triggers
--   - change RLS policies
-- =============================================================================

-- 1) Expand allowed membership roles (idempotent drop/add)
alter table public.organization_members
  drop constraint if exists organization_members_role_name_check;

alter table public.organization_members
  add constraint organization_members_role_name_check
  check (
    role_name = any (
      array[
        'super_admin'::text,
        'admin'::text,
        'founder'::text,
        'owner'::text,
        'manager'::text,
        'member'::text,
        'viewer'::text
      ]
    )
  );

-- 2) Assign Founder role to the designated account (idempotent)
update public.organization_members om
set
  role_name = 'founder',
  updated_at = now()
from public.user_profiles up
where om.user_id = up.id
  and lower(up.email) = lower('chittemprashantharjun@gmail.com')
  and om.is_active = true
  and om.role_name is distinct from 'founder';

-- Verification (optional, run after apply):
-- select pg_get_constraintdef(oid)
-- from pg_constraint
-- where conrelid = 'public.organization_members'::regclass
--   and conname = 'organization_members_role_name_check';
--
-- select up.email, om.role_name, om.is_active
-- from public.organization_members om
-- join public.user_profiles up on up.id = om.user_id
-- where lower(up.email) = lower('chittemprashantharjun@gmail.com');
