-- API credentials and scopes are privileged organization security settings.
-- Ordinary organization members may read key metadata, but only active
-- organization administrators may create, rotate/update, or delete credentials
-- and scopes. Server-side service-role routes continue to bypass RLS.
do $$
declare
  tbl text;
begin
  foreach tbl in array array['intg_api_keys', 'intg_api_scopes']
  loop
    execute format('drop policy if exists %I_insert on public.%I', tbl, tbl);
    execute format(
      'create policy %I_insert on public.%I for insert to authenticated with check (public.can_manage_organization_members(organization_id))',
      tbl, tbl
    );

    execute format('drop policy if exists %I_update on public.%I', tbl, tbl);
    execute format(
      'create policy %I_update on public.%I for update to authenticated using (public.can_manage_organization_members(organization_id)) with check (public.can_manage_organization_members(organization_id))',
      tbl, tbl
    );

    execute format('drop policy if exists %I_delete on public.%I', tbl, tbl);
    execute format(
      'create policy %I_delete on public.%I for delete to authenticated using (public.can_manage_organization_members(organization_id))',
      tbl, tbl
    );
  end loop;
end
$$;
