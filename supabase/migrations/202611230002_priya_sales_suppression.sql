-- Organization-scoped do-not-contact ledger for AI sales outreach.
create table if not exists public.ai_sales_suppressions (
    id uuid primary key default gen_random_uuid(),
    organization_id uuid not null,
    phone_number text not null,
    reason text not null check (reason in ('caller_opt_out', 'dnd_or_provider_block', 'manual_request', 'invalid_consent')),
    source text not null,
    created_at timestamptz not null default now(),
    created_by uuid,
    constraint ai_sales_suppression_phone_e164 check (phone_number ~ '^\\+91[6-9][0-9]{9}$'),
    constraint ai_sales_suppression_org_phone_unique unique (organization_id, phone_number)
);

alter table public.ai_sales_suppressions enable row level security;
revoke all on public.ai_sales_suppressions from anon, authenticated;
grant select, insert, update on public.ai_sales_suppressions to service_role;

comment on table public.ai_sales_suppressions is
    'Server-only organization-scoped do-not-contact list. Every outbound dispatch must check this table.';
