-- CRM RLS remediation (legacy crm_* tables).
--
-- STATUS: PREPARED ONLY — NOT APPLIED to any database (local or remote).
-- Apply path (owner action, non-production first):
--   1. Test on a disposable Supabase branch/instance with representative data.
--   2. Regenerate/verify supabase/apply_all.sql so it includes this migration.
--   3. Run `npm run db:verify` and tenant-isolation tests before any promotion.
--
-- CONTEXT: supabase/migrations/202608020002_crm_foundation.sql created
-- crm_clients / crm_leads / crm_deals / crm_activities / crm_tasks with
-- USING(true) / WITH CHECK(true) SELECT/INSERT/UPDATE policies and NO delete
-- policy. Those tables are currently orphaned (no service imports them; live
-- code uses clients/sales_*), but open policies mean any future GRANT or
-- mis-scoped read exposes every tenant's rows. This migration replaces the
-- open policies with the repo-standard
-- public.is_organization_member(organization_id) pattern (defined in
-- 202608020004_enterprise_data_platform.sql) and applies least-privilege
-- grants: nothing for anon, select/insert/update/delete for authenticated.
-- RLS stays enforced through membership in public.organization_members.

do $$
declare
    tbl text;
begin
    foreach tbl in array array['crm_clients', 'crm_leads', 'crm_deals', 'crm_activities', 'crm_tasks']
    loop
        execute format('drop policy if exists %I on public.%I', tbl || '_select', tbl);
        execute format('drop policy if exists %I on public.%I', tbl || '_insert', tbl);
        execute format('drop policy if exists %I on public.%I', tbl || '_update', tbl);
        execute format('drop policy if exists %I on public.%I', tbl || '_delete', tbl);

        execute format(
            'create policy %I on public.%I for select using (public.is_organization_member(organization_id))',
            tbl || '_select', tbl
        );
        execute format(
            'create policy %I on public.%I for insert with check (public.is_organization_member(organization_id))',
            tbl || '_insert', tbl
        );
        execute format(
            'create policy %I on public.%I for update using (public.is_organization_member(organization_id)) with check (public.is_organization_member(organization_id))',
            tbl || '_update', tbl
        );
        execute format(
            'create policy %I on public.%I for delete using (public.is_organization_member(organization_id))',
            tbl || '_delete', tbl
        );

        execute format('revoke all on public.%I from anon, authenticated', tbl);
        execute format('grant select, insert, update, delete on public.%I to authenticated', tbl);
    end loop;
end
$$;
