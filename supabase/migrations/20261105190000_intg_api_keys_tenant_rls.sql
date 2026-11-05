-- Keep integration API-key management available to authenticated tenant
-- members without allowing cross-organization reads or writes.
alter table public.intg_api_keys enable row level security;

-- Remove both table-level and legacy column-level grants. PostgreSQL table
-- REVOKE alone does not clear separately granted column privileges.
revoke all privileges on table public.intg_api_keys from anon, authenticated;
revoke all privileges (
    id,
    organization_id,
    hub_id,
    key_name,
    key_prefix,
    key_hash,
    api_version,
    expires_at,
    last_used_at,
    status,
    created_at,
    updated_at
) on table public.intg_api_keys from anon, authenticated;

-- Never expose key hashes to browser roles. Authenticated users receive only
-- metadata reads, constrained inserts, and status-only updates.
grant select (id, organization_id, hub_id, key_name, key_prefix, api_version, expires_at, last_used_at, status, created_at, updated_at)
    on public.intg_api_keys to authenticated;
grant insert (organization_id, hub_id, key_name, key_prefix, key_hash, api_version, expires_at, status)
    on public.intg_api_keys to authenticated;
grant update (status, updated_at)
    on public.intg_api_keys to authenticated;

-- API keys are revoked, not deleted, so audit history remains intact.
drop policy if exists intg_api_keys_delete on public.intg_api_keys;

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
