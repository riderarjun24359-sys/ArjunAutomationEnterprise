-- Arjun AI Voice Agent: consent evidence and provider call events.
-- These tables are intentionally server-only. Browser roles receive no grants;
-- authenticated API routes validate the session and organization before using
-- the service-role client. RLS remains enabled as defence in depth.

create table if not exists public.ai_voice_contact_consents (
    id uuid primary key default gen_random_uuid(),
    organization_id uuid not null,
    phone_number text not null,
    purpose text not null check (purpose = 'requested_callback'),
    evidence_type text not null check (evidence_type in ('website_form', 'inbound_call', 'email', 'sms')),
    evidence_reference text not null,
    granted_at timestamptz not null,
    revoked_at timestamptz,
    recorded_by uuid not null,
    created_at timestamptz not null default now(),
    constraint ai_voice_consent_phone_e164 check (phone_number ~ '^\+91[6-9][0-9]{9}$'),
    constraint ai_voice_consent_evidence_nonempty check (length(trim(evidence_reference)) between 4 and 500)
);

create index if not exists ai_voice_contact_consents_lookup_idx
    on public.ai_voice_contact_consents (organization_id, phone_number, purpose, granted_at desc)
    where revoked_at is null;

create table if not exists public.ai_voice_call_events (
    id uuid primary key default gen_random_uuid(),
    organization_id uuid not null,
    direction text not null check (direction in ('inbound', 'outbound')),
    phone_number text,
    purpose text,
    status text not null default 'queued'
        check (status in ('queued', 'connected', 'no_answer', 'busy', 'failed', 'completed')),
    provider_attempt_id text unique,
    interaction_id text,
    duration_seconds numeric(10,2),
    failure_reason text,
    extracted_variables jsonb not null default '{}'::jsonb,
    created_by uuid,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint ai_voice_call_phone_e164 check (
        phone_number is null or phone_number ~ '^\+91[6-9][0-9]{9}$'
    )
);

create index if not exists ai_voice_call_events_org_created_idx
    on public.ai_voice_call_events (organization_id, created_at desc);

create index if not exists ai_voice_call_events_org_status_idx
    on public.ai_voice_call_events (organization_id, status, created_at desc);

alter table public.ai_voice_contact_consents enable row level security;
alter table public.ai_voice_call_events enable row level security;

revoke all on public.ai_voice_contact_consents from anon, authenticated;
revoke all on public.ai_voice_call_events from anon, authenticated;
grant select, insert, update on public.ai_voice_contact_consents to service_role;
grant select, insert, update on public.ai_voice_call_events to service_role;

comment on table public.ai_voice_contact_consents is
    'Evidence ledger for explicit, customer-requested AI callbacks. Server-only access.';
comment on table public.ai_voice_call_events is
    'Minimal metadata for inbound and outbound Arjun AI Voice Agent calls. Transcripts are not stored here.';
