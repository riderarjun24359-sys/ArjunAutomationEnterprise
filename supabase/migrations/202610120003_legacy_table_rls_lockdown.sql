-- Legacy-table RLS lockdown: `project_management` + `storage_objects`.
--
-- STATUS: PREPARED / HELD — NOT APPLIED to any database. Apply with the other
-- prepared hardening migrations (see
-- docs/STAGING_TO_PRODUCTION_MIGRATION_PROCEDURE.md); it is idempotent and
-- carries no data prerequisite.
--
-- WHY: these two tables kept their foundation `USING (true)` / `WITH CHECK
-- (true)` policies, so ANY authenticated user could read, insert, and update
-- ANY row in them (cross-tenant read + write). The app no longer reads them
-- (`project_management` is an orphaned Sprint-9 parent whose child tables were
-- repointed to `projects` by 202608020004; `storage_objects`' repository is a
-- stub), but the open policies are a latent hole: any data placed in these
-- tables is world-readable/writable, and reconnecting either table would expose
-- it. Detected by `npm run rls:audit` (open-policy scan over the full chain).
--
-- FIX: replace the open policies with the repo-standard
-- `is_organization_member(organization_id)` pattern, `to authenticated` (which
-- also closes the anon path). No DELETE policy existed, so delete stays
-- deny-by-default (secure).

do $$
begin
    -- project_management ---------------------------------------------------
    drop policy if exists projects_select on public.project_management;
    create policy projects_select on public.project_management for select to authenticated
        using (public.is_organization_member(organization_id));

    drop policy if exists projects_insert on public.project_management;
    create policy projects_insert on public.project_management for insert to authenticated
        with check (public.is_organization_member(organization_id));

    drop policy if exists projects_update on public.project_management;
    create policy projects_update on public.project_management for update to authenticated
        using (public.is_organization_member(organization_id))
        with check (public.is_organization_member(organization_id));

    -- storage_objects ------------------------------------------------------
    drop policy if exists storage_select on public.storage_objects;
    create policy storage_select on public.storage_objects for select to authenticated
        using (public.is_organization_member(organization_id));

    drop policy if exists storage_insert on public.storage_objects;
    create policy storage_insert on public.storage_objects for insert to authenticated
        with check (public.is_organization_member(organization_id));

    drop policy if exists storage_update on public.storage_objects;
    create policy storage_update on public.storage_objects for update to authenticated
        using (public.is_organization_member(organization_id))
        with check (public.is_organization_member(organization_id));
end
$$;
