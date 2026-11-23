-- Keep RLS SECURITY DEFINER implementation helpers outside PostgREST's
-- exposed public schema while preserving stable public policy function names.
-- The public functions become SECURITY INVOKER wrappers; RLS policies keep
-- working through the private SECURITY DEFINER implementations.

BEGIN;

CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

CREATE OR REPLACE FUNCTION private.auth_profile_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog
AS $$
  SELECT id
  FROM public.user_profiles
  WHERE auth_user_id = auth.uid()
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION private.is_organization_member(org_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.organization_members om
    WHERE om.organization_id = org_id
      AND om.user_id = private.auth_profile_id()
      AND om.is_active = true
  );
$$;

REVOKE ALL ON FUNCTION private.auth_profile_id() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION private.is_organization_member(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.auth_profile_id() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION private.is_organization_member(uuid) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.auth_profile_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = pg_catalog
AS $$
  SELECT private.auth_profile_id();
$$;

CREATE OR REPLACE FUNCTION public.is_organization_member(org_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = pg_catalog
AS $$
  SELECT private.is_organization_member(org_id);
$$;

REVOKE ALL ON FUNCTION public.auth_profile_id() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.is_organization_member(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.auth_profile_id() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_organization_member(uuid) TO authenticated, service_role;

COMMIT;
