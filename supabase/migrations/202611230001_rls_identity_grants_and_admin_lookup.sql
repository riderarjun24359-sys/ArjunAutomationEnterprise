-- Final identity-layer RLS reconciliation.
--
-- The November tenant-lockdown migrations intentionally removed the earlier
-- membership INSERT policy and restored self-only profile reads. Those later
-- migrations supersede the October policies, so the original October policy
-- changes were not effective in the final migration chain. Re-establish the
-- required behavior here, after all lockdown migrations.
--
-- Grants only make the SQL operations reachable. RLS below remains the
-- authority for tenant membership and identity visibility.

GRANT SELECT, INSERT, UPDATE ON TABLE
  public.organizations,
  public.organization_members,
  public.user_profiles
TO authenticated;

-- Platform admin is a global identity-layer role, represented only by an
-- active super_admin membership. Use the JWT subject directly and bypass RLS
-- only inside this narrowly scoped predicate.
CREATE OR REPLACE FUNCTION public.is_platform_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_profiles up
    JOIN public.organization_members om ON om.user_id = up.id
    WHERE up.auth_user_id = auth.uid()
      AND om.is_active = true
      AND om.role_name = 'super_admin'
  );
$$;
REVOKE ALL ON FUNCTION public.is_platform_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_platform_admin() TO authenticated;

-- This helper never exposes the membership rows; it returns only whether the
-- caller has an org-administration role in the target organization.
CREATE OR REPLACE FUNCTION public.can_manage_org_members(org_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
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
REVOKE ALL ON FUNCTION public.can_manage_org_members(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.can_manage_org_members(uuid) TO authenticated;

-- A signed-in user can see only their own org, unless they are a platform
-- admin. This re-applies the admin clause removed by the later lockdown.
DROP POLICY IF EXISTS orgs_select ON public.organizations;
CREATE POLICY orgs_select ON public.organizations
  FOR SELECT TO authenticated
  USING (
    public.is_organization_member(id)
    OR public.is_platform_admin()
  );

-- Members see their own membership and their org roster; platform admins can
-- inspect the identity-layer roster. No business tables inherit this access.
DROP POLICY IF EXISTS memberships_select ON public.organization_members;
CREATE POLICY memberships_select ON public.organization_members
  FOR SELECT TO authenticated
  USING (
    user_id = public.auth_profile_id()
    OR public.is_organization_member(organization_id)
    OR public.is_platform_admin()
  );

-- Only a first member may bootstrap a memberless organization as its founder.
-- For existing organizations, only an org manager may invite another user,
-- and elevated roles can never be assigned through the browser API.
DROP POLICY IF EXISTS memberships_insert ON public.organization_members;
CREATE POLICY memberships_insert ON public.organization_members
  FOR INSERT TO authenticated
  WITH CHECK (
    (
      user_id = public.auth_profile_id()
      AND role_name = 'founder'
      AND public.organization_is_memberless(organization_id)
    )
    OR (
      user_id <> public.auth_profile_id()
      AND role_name IN ('manager', 'member', 'viewer')
      AND public.can_manage_org_members(organization_id)
    )
  );

-- Deliberately do not create a browser UPDATE policy for memberships. Role
-- changes and removals must go through a separately authorized server path.

-- The prior profile consolidation migration explicitly dropped peer/admin
-- visibility. Restore self + same-org + platform-admin reads without exposing
-- unrelated profiles to ordinary members.
DROP POLICY IF EXISTS profiles_select ON public.user_profiles;
DROP POLICY IF EXISTS profiles_select_org_members ON public.user_profiles;
CREATE POLICY profiles_select ON public.user_profiles
  FOR SELECT TO authenticated
  USING (
    auth_user_id = auth.uid()
    OR public.shares_organization_with(id)
    OR public.is_platform_admin()
  );

-- Profile writes remain self-only.
DROP POLICY IF EXISTS profiles_insert ON public.user_profiles;
CREATE POLICY profiles_insert ON public.user_profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth_user_id = auth.uid());

DROP POLICY IF EXISTS profiles_update ON public.user_profiles;
CREATE POLICY profiles_update ON public.user_profiles
  FOR UPDATE TO authenticated
  USING (auth_user_id = auth.uid())
  WITH CHECK (auth_user_id = auth.uid());
