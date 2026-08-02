-- Sprint 12: Enterprise Finance & Invoicing

create table if not exists public.tax_rates (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  rate_percent numeric(5, 2) not null default 0,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.estimates (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  number text not null,
  status text not null default 'draft',
  issue_date date not null default current_date,
  valid_until date,
  subtotal numeric(12, 2) not null default 0,
  tax_amount numeric(12, 2) not null default 0,
  total numeric(12, 2) not null default 0,
  currency text not null default 'USD',
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.estimate_line_items (
  id uuid primary key default uuid_generate_v4(),
  estimate_id uuid not null references public.estimates(id) on delete cascade,
  description text not null,
  quantity numeric(10, 2) not null default 1,
  unit_price numeric(12, 2) not null default 0,
  tax_rate_id uuid references public.tax_rates(id) on delete set null,
  amount numeric(12, 2) not null default 0,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.invoices (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  estimate_id uuid references public.estimates(id) on delete set null,
  number text not null,
  status text not null default 'draft',
  issue_date date not null default current_date,
  due_date date,
  paid_at timestamptz,
  subtotal numeric(12, 2) not null default 0,
  tax_amount numeric(12, 2) not null default 0,
  total numeric(12, 2) not null default 0,
  amount_paid numeric(12, 2) not null default 0,
  currency text not null default 'USD',
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.invoice_line_items (
  id uuid primary key default uuid_generate_v4(),
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  description text not null,
  quantity numeric(10, 2) not null default 1,
  unit_price numeric(12, 2) not null default 0,
  tax_rate_id uuid references public.tax_rates(id) on delete set null,
  amount numeric(12, 2) not null default 0,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  amount numeric(12, 2) not null default 0,
  payment_date date not null default current_date,
  method text not null default 'wire',
  reference text not null default '',
  status text not null default 'completed',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.expenses (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  client_id uuid references public.clients(id) on delete set null,
  category text not null default 'general',
  description text not null,
  amount numeric(12, 2) not null default 0,
  expense_date date not null default current_date,
  status text not null default 'pending',
  submitted_by text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.recurring_invoices (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  title text not null,
  frequency text not null default 'monthly',
  next_run_date date not null,
  end_date date,
  subtotal numeric(12, 2) not null default 0,
  tax_amount numeric(12, 2) not null default 0,
  total numeric(12, 2) not null default 0,
  currency text not null default 'USD',
  is_active boolean not null default true,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_tax_rates_updated_at on public.tax_rates;
create trigger trg_tax_rates_updated_at before update on public.tax_rates for each row execute function public.set_updated_at();

drop trigger if exists trg_estimates_updated_at on public.estimates;
create trigger trg_estimates_updated_at before update on public.estimates for each row execute function public.set_updated_at();

drop trigger if exists trg_invoices_updated_at on public.invoices;
create trigger trg_invoices_updated_at before update on public.invoices for each row execute function public.set_updated_at();

drop trigger if exists trg_payments_updated_at on public.payments;
create trigger trg_payments_updated_at before update on public.payments for each row execute function public.set_updated_at();

drop trigger if exists trg_expenses_updated_at on public.expenses;
create trigger trg_expenses_updated_at before update on public.expenses for each row execute function public.set_updated_at();

drop trigger if exists trg_recurring_invoices_updated_at on public.recurring_invoices;
create trigger trg_recurring_invoices_updated_at before update on public.recurring_invoices for each row execute function public.set_updated_at();

create index if not exists idx_tax_rates_org on public.tax_rates(organization_id);
create index if not exists idx_estimates_org on public.estimates(organization_id);
create index if not exists idx_estimates_client on public.estimates(client_id);
create index if not exists idx_estimates_status on public.estimates(status);
create index if not exists idx_estimate_line_items_estimate on public.estimate_line_items(estimate_id);
create index if not exists idx_invoices_org on public.invoices(organization_id);
create index if not exists idx_invoices_client on public.invoices(client_id);
create index if not exists idx_invoices_project on public.invoices(project_id);
create index if not exists idx_invoices_status on public.invoices(status);
create index if not exists idx_invoices_due_date on public.invoices(due_date);
create index if not exists idx_invoice_line_items_invoice on public.invoice_line_items(invoice_id);
create index if not exists idx_payments_org on public.payments(organization_id);
create index if not exists idx_payments_invoice on public.payments(invoice_id);
create index if not exists idx_expenses_org on public.expenses(organization_id);
create index if not exists idx_expenses_project on public.expenses(project_id);
create index if not exists idx_recurring_invoices_org on public.recurring_invoices(organization_id);
create index if not exists idx_recurring_invoices_client on public.recurring_invoices(client_id);

alter table public.tax_rates enable row level security;
alter table public.estimates enable row level security;
alter table public.estimate_line_items enable row level security;
alter table public.invoices enable row level security;
alter table public.invoice_line_items enable row level security;
alter table public.payments enable row level security;
alter table public.expenses enable row level security;
alter table public.recurring_invoices enable row level security;

do $$
declare
  tbl text;
begin
  foreach tbl in array array['tax_rates', 'estimates', 'invoices', 'payments', 'expenses', 'recurring_invoices']
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

drop policy if exists estimate_line_items_select on public.estimate_line_items;
create policy estimate_line_items_select on public.estimate_line_items for select using (
  exists (select 1 from public.estimates e where e.id = estimate_id and public.is_organization_member(e.organization_id))
);
drop policy if exists estimate_line_items_insert on public.estimate_line_items;
create policy estimate_line_items_insert on public.estimate_line_items for insert with check (
  exists (select 1 from public.estimates e where e.id = estimate_id and public.is_organization_member(e.organization_id))
);
drop policy if exists estimate_line_items_update on public.estimate_line_items;
create policy estimate_line_items_update on public.estimate_line_items for update using (
  exists (select 1 from public.estimates e where e.id = estimate_id and public.is_organization_member(e.organization_id))
);
drop policy if exists estimate_line_items_delete on public.estimate_line_items;
create policy estimate_line_items_delete on public.estimate_line_items for delete using (
  exists (select 1 from public.estimates e where e.id = estimate_id and public.is_organization_member(e.organization_id))
);

drop policy if exists invoice_line_items_select on public.invoice_line_items;
create policy invoice_line_items_select on public.invoice_line_items for select using (
  exists (select 1 from public.invoices i where i.id = invoice_id and public.is_organization_member(i.organization_id))
);
drop policy if exists invoice_line_items_insert on public.invoice_line_items;
create policy invoice_line_items_insert on public.invoice_line_items for insert with check (
  exists (select 1 from public.invoices i where i.id = invoice_id and public.is_organization_member(i.organization_id))
);
drop policy if exists invoice_line_items_update on public.invoice_line_items;
create policy invoice_line_items_update on public.invoice_line_items for update using (
  exists (select 1 from public.invoices i where i.id = invoice_id and public.is_organization_member(i.organization_id))
);
drop policy if exists invoice_line_items_delete on public.invoice_line_items;
create policy invoice_line_items_delete on public.invoice_line_items for delete using (
  exists (select 1 from public.invoices i where i.id = invoice_id and public.is_organization_member(i.organization_id))
);

insert into public.permissions (key, description, resource)
values ('finance.manage', 'Manage finance and invoicing', 'finance')
on conflict (key) do update set description = excluded.description, resource = excluded.resource;
