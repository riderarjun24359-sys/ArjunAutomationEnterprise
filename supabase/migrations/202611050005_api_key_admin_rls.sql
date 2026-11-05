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

-- The SHA-256 digest is authentication material, not dashboard metadata.
-- Remove table-wide SELECT and grant only the fields required by the UI.
revoke select on public.intg_api_keys from anon, authenticated;
grant select (
  id, organization_id, hub_id, key_name, key_prefix, api_version,
  expires_at, last_used_at, status, created_at, updated_at
) on public.intg_api_keys to authenticated;
