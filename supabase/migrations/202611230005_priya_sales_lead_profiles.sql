-- Structured qualification details captured by Priya, separated from core CRM contacts.
create table if not exists public.ai_sales_lead_profiles (
    id uuid primary key default gen_random_uuid(),
    organization_id uuid not null,
    lead_id uuid not null references public.sales_leads(id) on delete cascade,
    city text not null default '',
    industry text not null default '',
    pain_point text not null default '',
    service_interest text not null default '',
    decision_maker text not null default '',
    budget_range text not null default '',
    buying_timeline text not null default '',
    qualification_score integer not null default 0 check (qualification_score between 0 and 100),
    next_action text not null default '',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint ai_sales_lead_profiles_org_lead_unique unique (organization_id, lead_id)
);

create index if not exists ai_sales_lead_profiles_org_score_idx
    on public.ai_sales_lead_profiles (organization_id, qualification_score desc, updated_at desc);

alter table public.ai_sales_lead_profiles enable row level security;
revoke all on public.ai_sales_lead_profiles from anon, authenticated;
grant select, insert, update, delete on public.ai_sales_lead_profiles to service_role;

comment on table public.ai_sales_lead_profiles is
    'Structured Priya qualification details; server-only and organization-scoped.';
