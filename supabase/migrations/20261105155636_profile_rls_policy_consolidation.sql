-- Consolidate same-organization profile visibility and keep the admin helper
-- SECURITY INVOKER; organization_members RLS already scopes its lookup.
BEGIN;

CREATE OR REPLACE FUNCTION public.is_organization_admin(org_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = pg_catalog
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.organization_members om
    WHERE om.organization_id = org_id
      AND om.user_id = public.auth_profile_id()
      AND om.is_active = true
      AND om.role_name IN ('super_admin', 'owner', 'founder', 'admin')
  );
$$;

REVOKE ALL ON FUNCTION public.is_organization_admin(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_organization_admin(uuid) TO authenticated, service_role;

ALTER POLICY profiles_select ON public.user_profiles
  USING (
    auth_user_id = (SELECT auth.uid())
    OR EXISTS (
      SELECT 1
      FROM public.organization_members om
      WHERE om.user_id = user_profiles.id
        AND om.is_active = true
        AND public.is_organization_member(om.organization_id)
    )
    -- Platform operators may inspect profile records for support and governance.
    -- The helper only returns true for an active super_admin membership.
    OR (SELECT public.is_platform_admin())
  );

DROP POLICY IF EXISTS profiles_select_org_members ON public.user_profiles;

COMMIT;
