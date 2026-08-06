-- Sprint 18: Enterprise Customer Support & Service Management

create table if not exists public.support_categories (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  slug text not null,
  description text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, slug)
);

create table if not exists public.support_priorities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  level integer not null default 1,
  color text not null default '#64748b',
  response_hours integer not null default 24,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, name)
);

create table if not exists public.support_slas (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  priority_id uuid references public.support_priorities(id) on delete set null,
  first_response_minutes integer not null default 60,
  resolution_minutes integer not null default 480,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, name)
);

create table if not exists public.support_queues (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  code text not null,
  description text not null default '',
  default_assignee_id uuid references public.employees(id) on delete set null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, code)
);

create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  ticket_number text not null,
  subject text not null,
  description text not null default '',
  status text not null default 'open',
  category_id uuid references public.support_categories(id) on delete set null,
  priority_id uuid references public.support_priorities(id) on delete set null,
  sla_id uuid references public.support_slas(id) on delete set null,
  queue_id uuid references public.support_queues(id) on delete set null,
  client_id uuid references public.clients(id) on delete set null,
  contact_id uuid references public.contacts(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  assigned_agent_id uuid references public.employees(id) on delete set null,
  invoice_id uuid references public.invoices(id) on delete set null,
  portal_visible boolean not null default true,
  due_at timestamptz,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, ticket_number)
);

create table if not exists public.support_ticket_notes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  ticket_id uuid not null references public.support_tickets(id) on delete cascade,
  author_id uuid references public.user_profiles(id) on delete set null,
  body text not null,
  is_internal boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.support_ticket_attachments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  ticket_id uuid not null references public.support_tickets(id) on delete cascade,
  file_name text not null,
  file_url text not null default '',
  file_size integer not null default 0,
  mime_type text not null default 'application/octet-stream',
  uploaded_by uuid references public.user_profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.support_knowledge_articles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  title text not null,
  slug text not null,
  content text not null default '',
  category_id uuid references public.support_categories(id) on delete set null,
  status text not null default 'draft',
  view_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, slug)
);

create table if not exists public.support_canned_responses (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  title text not null,
  shortcut text not null,
  body text not null default '',
  category_id uuid references public.support_categories(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, shortcut)
);

create table if not exists public.support_escalation_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  trigger_condition text not null default 'sla_breach',
  escalation_level integer not null default 1,
  target_queue_id uuid references public.support_queues(id) on delete set null,
  notify_agent_id uuid references public.employees(id) on delete set null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, name)
);

create table if not exists public.support_satisfaction_ratings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  ticket_id uuid not null references public.support_tickets(id) on delete cascade,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text not null default '',
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.support_portal_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  portal_enabled boolean not null default true,
  welcome_message text not null default 'Welcome to our support portal.',
  allow_ticket_creation boolean not null default true,
  show_knowledge_base boolean not null default true,
  custom_domain text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id)
);

create table if not exists public.support_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  entity_type text not null,
  entity_id uuid,
  action text not null,
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  performed_by uuid references public.user_profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_support_categories_org on public.support_categories(organization_id);
create index if not exists idx_support_priorities_org on public.support_priorities(organization_id);
create index if not exists idx_support_slas_org on public.support_slas(organization_id);
create index if not exists idx_support_queues_org on public.support_queues(organization_id);
create index if not exists idx_support_tickets_org on public.support_tickets(organization_id);
create index if not exists idx_support_tickets_status on public.support_tickets(status);
create index if not exists idx_support_ticket_notes_org on public.support_ticket_notes(organization_id);
create index if not exists idx_support_ticket_notes_ticket on public.support_ticket_notes(ticket_id);
create index if not exists idx_support_ticket_attachments_org on public.support_ticket_attachments(organization_id);
create index if not exists idx_support_knowledge_articles_org on public.support_knowledge_articles(organization_id);
create index if not exists idx_support_canned_responses_org on public.support_canned_responses(organization_id);
create index if not exists idx_support_escalation_rules_org on public.support_escalation_rules(organization_id);
create index if not exists idx_support_satisfaction_ratings_org on public.support_satisfaction_ratings(organization_id);
create index if not exists idx_support_portal_settings_org on public.support_portal_settings(organization_id);
create index if not exists idx_support_audit_logs_org on public.support_audit_logs(organization_id);

drop trigger if exists trg_support_categories_updated_at on public.support_categories;
create trigger trg_support_categories_updated_at before update on public.support_categories for each row execute function public.set_updated_at();
drop trigger if exists trg_support_priorities_updated_at on public.support_priorities;
create trigger trg_support_priorities_updated_at before update on public.support_priorities for each row execute function public.set_updated_at();
drop trigger if exists trg_support_slas_updated_at on public.support_slas;
create trigger trg_support_slas_updated_at before update on public.support_slas for each row execute function public.set_updated_at();
drop trigger if exists trg_support_queues_updated_at on public.support_queues;
create trigger trg_support_queues_updated_at before update on public.support_queues for each row execute function public.set_updated_at();
drop trigger if exists trg_support_tickets_updated_at on public.support_tickets;
create trigger trg_support_tickets_updated_at before update on public.support_tickets for each row execute function public.set_updated_at();
drop trigger if exists trg_support_knowledge_articles_updated_at on public.support_knowledge_articles;
create trigger trg_support_knowledge_articles_updated_at before update on public.support_knowledge_articles for each row execute function public.set_updated_at();
drop trigger if exists trg_support_canned_responses_updated_at on public.support_canned_responses;
create trigger trg_support_canned_responses_updated_at before update on public.support_canned_responses for each row execute function public.set_updated_at();
drop trigger if exists trg_support_escalation_rules_updated_at on public.support_escalation_rules;
create trigger trg_support_escalation_rules_updated_at before update on public.support_escalation_rules for each row execute function public.set_updated_at();
drop trigger if exists trg_support_portal_settings_updated_at on public.support_portal_settings;
create trigger trg_support_portal_settings_updated_at before update on public.support_portal_settings for each row execute function public.set_updated_at();

alter table public.support_categories enable row level security;
alter table public.support_priorities enable row level security;
alter table public.support_slas enable row level security;
alter table public.support_queues enable row level security;
alter table public.support_tickets enable row level security;
alter table public.support_ticket_notes enable row level security;
alter table public.support_ticket_attachments enable row level security;
alter table public.support_knowledge_articles enable row level security;
alter table public.support_canned_responses enable row level security;
alter table public.support_escalation_rules enable row level security;
alter table public.support_satisfaction_ratings enable row level security;
alter table public.support_portal_settings enable row level security;
alter table public.support_audit_logs enable row level security;

do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'support_categories', 'support_priorities', 'support_slas', 'support_queues',
    'support_tickets', 'support_ticket_notes', 'support_ticket_attachments',
    'support_knowledge_articles', 'support_canned_responses', 'support_escalation_rules',
    'support_satisfaction_ratings', 'support_portal_settings', 'support_audit_logs'
  ]
  loop
    execute format('drop policy if exists %I_select on public.%I', tbl, tbl);
    execute format('create policy %I_select on public.%I for select using (public.is_organization_member(organization_id))', tbl, tbl);
    execute format('drop policy if exists %I_insert on public.%I', tbl, tbl);
    execute format('create policy %I_insert on public.%I for insert with check (public.is_organization_member(organization_id))', tbl, tbl);
    execute format('drop policy if exists %I_update on public.%I', tbl, tbl);
    execute format('create policy %I_update on public.%I for update using (public.is_organization_member(organization_id)) with check (public.is_organization_member(organization_id))', tbl, tbl);
    execute format('drop policy if exists %I_delete on public.%I', tbl, tbl);
    execute format('create policy %I_delete on public.%I for delete using (public.is_organization_member(organization_id))', tbl, tbl);
  end loop;
end $$;

insert into public.permissions (key, description, resource)
values
  ('support.view', 'View support tickets and service data', 'support'),
  ('support.manage', 'Manage tickets, queues, and SLAs', 'support'),
  ('support.agents.manage', 'Manage agent assignment and escalation', 'support'),
  ('support.knowledge.manage', 'Manage knowledge base and canned responses', 'support')
on conflict (key) do update set description = excluded.description, resource = excluded.resource;
