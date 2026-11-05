-- Production tenant-isolation lockdown for legacy permissive RLS policies.
-- Replace unrestricted TRUE policies with organization-scoped rules.
BEGIN;

CREATE OR REPLACE FUNCTION public.is_organization_admin(org_id uuid)
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
      AND om.user_id = public.auth_profile_id()
      AND om.is_active = true
      AND om.role_name IN ('super_admin', 'owner', 'founder', 'admin')
  );
$$;

REVOKE ALL ON FUNCTION public.is_organization_admin(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_organization_admin(uuid) TO authenticated, service_role;

-- Membership and organization records.
DROP POLICY IF EXISTS memberships_insert ON public.organization_members;
DROP POLICY IF EXISTS memberships_update ON public.organization_members;
DROP POLICY IF EXISTS memberships_select ON public.organization_members;
CREATE POLICY memberships_select ON public.organization_members
  FOR SELECT TO authenticated
  USING (public.is_organization_member(organization_id));

DROP POLICY IF EXISTS orgs_insert ON public.organizations;
DROP POLICY IF EXISTS orgs_select ON public.organizations;
DROP POLICY IF EXISTS orgs_update ON public.organizations;
CREATE POLICY orgs_select ON public.organizations
  FOR SELECT TO authenticated
  USING (public.is_organization_member(id));
CREATE POLICY orgs_update ON public.organizations
  FOR UPDATE TO authenticated
  USING (public.is_organization_admin(id))
  WITH CHECK (public.is_organization_admin(id));

-- Global permission catalog is readable by signed-in users, never writable
-- through a browser session.
DROP POLICY IF EXISTS permissions_insert ON public.permission_definitions;
DROP POLICY IF EXISTS permissions_select ON public.permission_definitions;
CREATE POLICY permissions_select ON public.permission_definitions
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS role_perms_insert ON public.role_permissions;
DROP POLICY IF EXISTS role_perms_select ON public.role_permissions;
CREATE POLICY role_perms_select ON public.role_permissions
  FOR SELECT TO authenticated USING (true);

-- Project comments: all operations stay within a project whose organization
-- the caller belongs to. Existing broad public policies are removed.
DROP POLICY IF EXISTS comments_insert ON public.project_comments;
DROP POLICY IF EXISTS comments_select ON public.project_comments;
DROP POLICY IF EXISTS comments_update ON public.project_comments;
DROP POLICY IF EXISTS project_comments_select ON public.project_comments;
CREATE POLICY project_comments_select ON public.project_comments
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = project_comments.project_id
      AND public.is_organization_member(p.organization_id)
  ));
CREATE POLICY project_comments_insert ON public.project_comments
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = project_comments.project_id
      AND public.is_organization_member(p.organization_id)
  ));
CREATE POLICY project_comments_update ON public.project_comments
  FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = project_comments.project_id
      AND public.is_organization_member(p.organization_id)
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = project_comments.project_id
      AND public.is_organization_member(p.organization_id)
  ));

-- Project files.
DROP POLICY IF EXISTS files_insert ON public.project_files;
DROP POLICY IF EXISTS files_select ON public.project_files;
DROP POLICY IF EXISTS files_update ON public.project_files;
DROP POLICY IF EXISTS project_files_select ON public.project_files;
CREATE POLICY project_files_select ON public.project_files
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = project_files.project_id
      AND public.is_organization_member(p.organization_id)
  ));
CREATE POLICY project_files_insert ON public.project_files
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = project_files.project_id
      AND public.is_organization_member(p.organization_id)
  ));
CREATE POLICY project_files_update ON public.project_files
  FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = project_files.project_id
      AND public.is_organization_member(p.organization_id)
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = project_files.project_id
      AND public.is_organization_member(p.organization_id)
  ));

-- Legacy project management table.
DROP POLICY IF EXISTS projects_insert ON public.project_management;
DROP POLICY IF EXISTS projects_select ON public.project_management;
DROP POLICY IF EXISTS projects_update ON public.project_management;
CREATE POLICY project_management_select ON public.project_management
  FOR SELECT TO authenticated USING (public.is_organization_member(organization_id));
CREATE POLICY project_management_insert ON public.project_management
  FOR INSERT TO authenticated WITH CHECK (public.is_organization_member(organization_id));
CREATE POLICY project_management_update ON public.project_management
  FOR UPDATE TO authenticated
  USING (public.is_organization_member(organization_id))
  WITH CHECK (public.is_organization_member(organization_id));

-- Milestones.
DROP POLICY IF EXISTS milestones_insert ON public.project_milestones;
DROP POLICY IF EXISTS milestones_select ON public.project_milestones;
DROP POLICY IF EXISTS milestones_update ON public.project_milestones;
DROP POLICY IF EXISTS project_milestones_insert ON public.project_milestones;
DROP POLICY IF EXISTS project_milestones_select ON public.project_milestones;
DROP POLICY IF EXISTS project_milestones_update ON public.project_milestones;
CREATE POLICY project_milestones_select ON public.project_milestones
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = project_milestones.project_id
      AND public.is_organization_member(p.organization_id)
  ));
CREATE POLICY project_milestones_insert ON public.project_milestones
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = project_milestones.project_id
      AND public.is_organization_member(p.organization_id)
  ));
CREATE POLICY project_milestones_update ON public.project_milestones
  FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = project_milestones.project_id
      AND public.is_organization_member(p.organization_id)
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = project_milestones.project_id
      AND public.is_organization_member(p.organization_id)
  ));

-- Tasks.
DROP POLICY IF EXISTS tasks_insert ON public.project_tasks;
DROP POLICY IF EXISTS tasks_select ON public.project_tasks;
DROP POLICY IF EXISTS tasks_update ON public.project_tasks;
CREATE POLICY project_tasks_select ON public.project_tasks
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = project_tasks.project_id
      AND public.is_organization_member(p.organization_id)
  ));
CREATE POLICY project_tasks_insert ON public.project_tasks
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = project_tasks.project_id
      AND public.is_organization_member(p.organization_id)
  ));
CREATE POLICY project_tasks_update ON public.project_tasks
  FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = project_tasks.project_id
      AND public.is_organization_member(p.organization_id)
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = project_tasks.project_id
      AND public.is_organization_member(p.organization_id)
  ));

-- Project team members.
DROP POLICY IF EXISTS team_insert ON public.project_team_members;
DROP POLICY IF EXISTS team_select ON public.project_team_members;
DROP POLICY IF EXISTS team_update ON public.project_team_members;
CREATE POLICY project_team_members_select ON public.project_team_members
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = project_team_members.project_id
      AND public.is_organization_member(p.organization_id)
  ));
CREATE POLICY project_team_members_insert ON public.project_team_members
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = project_team_members.project_id
      AND public.is_organization_member(p.organization_id)
  ));
CREATE POLICY project_team_members_update ON public.project_team_members
  FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = project_team_members.project_id
      AND public.is_organization_member(p.organization_id)
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = project_team_members.project_id
      AND public.is_organization_member(p.organization_id)
  ));

-- Time entries.
DROP POLICY IF EXISTS time_insert ON public.project_time_entries;
DROP POLICY IF EXISTS time_select ON public.project_time_entries;
DROP POLICY IF EXISTS time_update ON public.project_time_entries;
DROP POLICY IF EXISTS project_time_entries_select ON public.project_time_entries;
CREATE POLICY project_time_entries_select ON public.project_time_entries
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = project_time_entries.project_id
      AND public.is_organization_member(p.organization_id)
  ));
CREATE POLICY project_time_entries_insert ON public.project_time_entries
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = project_time_entries.project_id
      AND public.is_organization_member(p.organization_id)
  ));
CREATE POLICY project_time_entries_update ON public.project_time_entries
  FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = project_time_entries.project_id
      AND public.is_organization_member(p.organization_id)
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = project_time_entries.project_id
      AND public.is_organization_member(p.organization_id)
  ));

-- Custom file metadata records are organization-scoped.
DROP POLICY IF EXISTS storage_insert ON public.storage_objects;
DROP POLICY IF EXISTS storage_select ON public.storage_objects;
DROP POLICY IF EXISTS storage_update ON public.storage_objects;
CREATE POLICY storage_objects_select ON public.storage_objects
  FOR SELECT TO authenticated
  USING (public.is_organization_member(organization_id));
CREATE POLICY storage_objects_insert ON public.storage_objects
  FOR INSERT TO authenticated
  WITH CHECK (public.is_organization_member(organization_id));
CREATE POLICY storage_objects_update ON public.storage_objects
  FOR UPDATE TO authenticated
  USING (public.is_organization_admin(organization_id))
  WITH CHECK (public.is_organization_admin(organization_id));

-- Profile details may be read only by the user and active members of one of
-- the same organizations. This supports the organization member roster.
ALTER POLICY profiles_insert ON public.user_profiles TO authenticated;
ALTER POLICY profiles_select ON public.user_profiles TO authenticated;
ALTER POLICY profiles_update ON public.user_profiles TO authenticated;
CREATE POLICY profiles_select_org_members ON public.user_profiles
  FOR SELECT TO authenticated
  USING (
    id = public.auth_profile_id()
    OR EXISTS (
      SELECT 1
      FROM public.organization_members om
      WHERE om.user_id = user_profiles.id
        AND om.is_active = true
        AND public.is_organization_member(om.organization_id)
    )
  );

-- Reset browser-role table privileges to match the policies above. Service
-- role and object owners are deliberately untouched.
REVOKE ALL ON TABLE
  public.organization_members,
  public.organizations,
  public.permission_definitions,
  public.project_comments,
  public.project_files,
  public.project_management,
  public.project_milestones,
  public.project_tasks,
  public.project_team_members,
  public.project_time_entries,
  public.role_permissions,
  public.storage_objects,
  public.user_profiles
FROM PUBLIC, anon, authenticated;

GRANT SELECT ON TABLE public.organization_members TO authenticated;
GRANT SELECT, UPDATE ON TABLE public.organizations TO authenticated;
GRANT SELECT ON TABLE public.permission_definitions TO authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.project_comments TO authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.project_files TO authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.project_management TO authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.project_milestones TO authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.project_tasks TO authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.project_team_members TO authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.project_time_entries TO authenticated;
GRANT SELECT ON TABLE public.role_permissions TO authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.storage_objects TO authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.user_profiles TO authenticated;

COMMIT;
