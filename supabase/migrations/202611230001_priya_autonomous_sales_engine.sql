-- Priya autonomous sales engine foundation.
-- Sales automation is opt-in only. No cold-calling campaign is enabled by this migration.

alter table public.ai_voice_contact_consents
    drop constraint if exists ai_voice_contact_consents_purpose_check;

alter table public.ai_voice_contact_consents
    add constraint ai_voice_contact_consents_purpose_check
    check (purpose in ('requested_callback', 'requested_sales_followup'));

create table if not exists public.ai_sales_pricing_policies (
    id uuid primary key default gen_random_uuid(),
    organization_id uuid not null,
    service_code text not null,
    service_name text not null,
    currency text not null default 'INR' check (currency = 'INR'),
    list_price_inr numeric(12,2) not null check (list_price_inr >= 0),
    minimum_price_inr numeric(12,2) not null check (minimum_price_inr >= 0),
    max_discount_percent numeric(5,2) not null default 0
        check (max_discount_percent >= 0 and max_discount_percent <= 100),
    active boolean not null default false,
    updated_by uuid,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint ai_sales_pricing_policy_min_le_list check (minimum_price_inr <= list_price_inr),
    constraint ai_sales_pricing_policy_org_service_unique unique (organization_id, service_code)
);

create table if not exists public.ai_sales_deals (
    id uuid primary key default gen_random_uuid(),
    organization_id uuid not null,
    lead_id uuid not null references public.sales_leads(id) on delete cascade,
    service_code text,
    stage text not null default 'qualified'
        check (stage in ('new', 'contacted', 'qualified', 'demo_booked', 'proposal_sent', 'negotiation', 'won', 'lost', 'nurture')),
    currency text not null default 'INR' check (currency = 'INR'),
    list_price_inr numeric(12,2) check (list_price_inr is null or list_price_inr >= 0),
    discount_percent numeric(5,2) not null default 0
        check (discount_percent >= 0 and discount_percent <= 100),
    final_price_inr numeric(12,2) check (final_price_inr is null or final_price_inr >= 0),
    discount_approved boolean not null default false,
    approval_required boolean not null default false,
    next_action_at timestamptz,
    closed_at timestamptz,
    loss_reason text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists ai_sales_deals_org_stage_idx
    on public.ai_sales_deals (organization_id, stage, updated_at desc);
create index if not exists ai_sales_deals_lead_idx
    on public.ai_sales_deals (organization_id, lead_id);

create table if not exists public.ai_sales_followups (
    id uuid primary key default gen_random_uuid(),
    organization_id uuid not null,
    lead_id uuid not null references public.sales_leads(id) on delete cascade,
    consent_id uuid not null references public.ai_voice_contact_consents(id) on delete restrict,
    channel text not null default 'voice' check (channel in ('voice', 'whatsapp', 'email')),
    purpose text not null check (purpose in ('requested_callback', 'requested_sales_followup')),
    due_at timestamptz not null,
    status text not null default 'pending'
        check (status in ('pending', 'processing', 'completed', 'cancelled', 'failed')),
    attempt_count integer not null default 0 check (attempt_count >= 0 and attempt_count <= 5),
    idempotency_key text not null,
    last_error text,
    completed_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint ai_sales_followups_idempotency_unique unique (organization_id, idempotency_key)
);

create index if not exists ai_sales_followups_due_idx
    on public.ai_sales_followups (status, due_at)
    where status = 'pending';

create table if not exists public.ai_sales_activity (
    id uuid primary key default gen_random_uuid(),
    organization_id uuid not null,
    lead_id uuid references public.sales_leads(id) on delete set null,
    deal_id uuid references public.ai_sales_deals(id) on delete set null,
    actor text not null check (actor in ('priya', 'jarvis', 'founder', 'system')),
    event_type text not null,
    summary text not null,
    metadata jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now()
);

create index if not exists ai_sales_activity_org_created_idx
    on public.ai_sales_activity (organization_id, created_at desc);

alter table public.ai_sales_pricing_policies enable row level security;
alter table public.ai_sales_deals enable row level security;
alter table public.ai_sales_followups enable row level security;
alter table public.ai_sales_activity enable row level security;

revoke all on public.ai_sales_pricing_policies from anon, authenticated;
revoke all on public.ai_sales_deals from anon, authenticated;
revoke all on public.ai_sales_followups from anon, authenticated;
revoke all on public.ai_sales_activity from anon, authenticated;

grant select, insert, update, delete on public.ai_sales_pricing_policies to service_role;
grant select, insert, update, delete on public.ai_sales_deals to service_role;
grant select, insert, update, delete on public.ai_sales_followups to service_role;
grant select, insert, update, delete on public.ai_sales_activity to service_role;

comment on table public.ai_sales_pricing_policies is
    'Founder-approved INR price floors and maximum discount policy. Inactive until explicitly configured.';
comment on table public.ai_sales_followups is
    'Consent-linked follow-up queue. Dispatchers must revalidate consent and calling windows before every attempt.';
comment on table public.ai_sales_activity is
    'Append-only audit events for Priya and Jarvis sales lifecycle actions.';
