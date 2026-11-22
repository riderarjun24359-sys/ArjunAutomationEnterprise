-- WhatsApp messaging consent and delivery audit for Priya.
alter table public.ai_voice_contact_consents
    drop constraint if exists ai_voice_contact_consents_purpose_check;

alter table public.ai_voice_contact_consents
    add constraint ai_voice_contact_consents_purpose_check
    check (purpose in ('requested_callback', 'requested_sales_followup', 'requested_whatsapp_message'));

create table if not exists public.ai_sales_whatsapp_messages (
    id uuid primary key default gen_random_uuid(),
    organization_id uuid not null,
    lead_id uuid not null references public.sales_leads(id) on delete cascade,
    consent_id uuid not null references public.ai_voice_contact_consents(id) on delete restrict,
    phone_number text not null,
    template_name text not null,
    language_code text not null,
    provider_message_id text unique,
    status text not null default 'accepted'
        check (status in ('accepted', 'sent', 'delivered', 'read', 'failed')),
    idempotency_key text not null,
    failure_code text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint ai_sales_whatsapp_phone_e164 check (phone_number ~ '^\+91[6-9][0-9]{9}$'),
    constraint ai_sales_whatsapp_idempotency_unique unique (organization_id, idempotency_key)
);

create index if not exists ai_sales_whatsapp_org_created_idx
    on public.ai_sales_whatsapp_messages (organization_id, created_at desc);

alter table public.ai_sales_whatsapp_messages enable row level security;
revoke all on public.ai_sales_whatsapp_messages from anon, authenticated;
grant select, insert, update on public.ai_sales_whatsapp_messages to service_role;

comment on table public.ai_sales_whatsapp_messages is
    'Server-only WhatsApp template delivery ledger. Messages require explicit purpose-specific consent and active approved Meta templates.';
