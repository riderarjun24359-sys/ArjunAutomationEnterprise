-- Ensure public key prefixes resolve to exactly one credential.
-- Empty legacy prefixes are excluded; only newly issued, non-empty prefixes
-- participate in the uniqueness guarantee.
create unique index if not exists intg_api_keys_key_prefix_unique
    on public.intg_api_keys (key_prefix)
    where key_prefix <> '';

create index if not exists intg_api_keys_active_org_hub_idx
    on public.intg_api_keys (organization_id, hub_id, status);
