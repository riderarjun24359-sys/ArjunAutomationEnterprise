-- Keep integration API-key management available to authenticated tenant
-- members without allowing cross-organization reads or writes.
alter table public.intg_api_keys enable row level security;

-- Prefixes are globally random and unique so the server can locate one key safely.
create unique index if not exists intg_api_keys_key_prefix_uidx
    on public.intg_api_keys (key_prefix);

drop policy if exists intg_api_keys_select on public.intg_api_keys;
create policy intg_api_keys_select
    on public.intg_api_keys
    for select
    to authenticated
    using (public.is_organization_member(organization_id));

drop policy if exists intg_api_keys_insert on public.intg_api_keys;
create policy intg_api_keys_insert
    on public.intg_api_keys
    for insert
    to authenticated
    with check (public.is_organization_admin(organization_id));

drop policy if exists intg_api_keys_update on public.intg_api_keys;
create policy intg_api_keys_update
    on public.intg_api_keys
    for update
    to authenticated
    using (public.is_organization_admin(organization_id))
    with check (public.is_organization_admin(organization_id));

comment on policy intg_api_keys_select on public.intg_api_keys
    is 'Tenant members may view API key metadata for their own organization only.';
comment on policy intg_api_keys_insert on public.intg_api_keys
    is 'Organization admins may issue API keys only inside their own organization.';
comment on policy intg_api_keys_update on public.intg_api_keys
    is 'Organization admins may rotate or revoke API keys only inside their own organization.';
