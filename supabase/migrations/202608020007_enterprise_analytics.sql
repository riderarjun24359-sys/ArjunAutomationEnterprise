-- Sprint 14: Enterprise Analytics & Performance Insights

create table if not exists public.analytics_dashboards (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  description text not null default '',
  is_default boolean not null default false,
  layout jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.analytics_widgets (
  id uuid primary key default gen_random_uuid(),
  dashboard_id uuid not null references public.analytics_dashboards(id) on delete cascade,
  title text not null,
  widget_type text not null default 'kpi',
  metric_key text not null default '',
  chart_type text not null default 'line',
  config jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.analytics_metrics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  metric_key text not null,
  label text not null,
  category text not null default 'general',
  value numeric(14, 2) not null default 0,
  unit text not null default '',
  period_start date,
  period_end date,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, metric_key, period_start, period_end)
);

create table if not exists public.analytics_reports (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  report_type text not null default 'summary',
  status text not null default 'draft',
  filters jsonb not null default '{}'::jsonb,
  summary jsonb not null default '{}'::jsonb,
  generated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_analytics_dashboards_updated_at on public.analytics_dashboards;
create trigger trg_analytics_dashboards_updated_at before update on public.analytics_dashboards for each row execute function public.set_updated_at();

drop trigger if exists trg_analytics_widgets_updated_at on public.analytics_widgets;
create trigger trg_analytics_widgets_updated_at before update on public.analytics_widgets for each row execute function public.set_updated_at();

drop trigger if exists trg_analytics_metrics_updated_at on public.analytics_metrics;
create trigger trg_analytics_metrics_updated_at before update on public.analytics_metrics for each row execute function public.set_updated_at();

drop trigger if exists trg_analytics_reports_updated_at on public.analytics_reports;
create trigger trg_analytics_reports_updated_at before update on public.analytics_reports for each row execute function public.set_updated_at();

create index if not exists idx_analytics_dashboards_org on public.analytics_dashboards(organization_id);
create index if not exists idx_analytics_widgets_dashboard on public.analytics_widgets(dashboard_id);
create index if not exists idx_analytics_metrics_org on public.analytics_metrics(organization_id);
create index if not exists idx_analytics_metrics_category on public.analytics_metrics(category);
create index if not exists idx_analytics_reports_org on public.analytics_reports(organization_id);
create index if not exists idx_analytics_reports_type on public.analytics_reports(report_type);

alter table public.analytics_dashboards enable row level security;
alter table public.analytics_widgets enable row level security;
alter table public.analytics_metrics enable row level security;
alter table public.analytics_reports enable row level security;

do $$
declare
  tbl text;
begin
  foreach tbl in array array['analytics_dashboards', 'analytics_metrics', 'analytics_reports']
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

drop policy if exists analytics_widgets_select on public.analytics_widgets;
create policy analytics_widgets_select on public.analytics_widgets for select using (
  exists (select 1 from public.analytics_dashboards d where d.id = dashboard_id and public.is_organization_member(d.organization_id))
);
drop policy if exists analytics_widgets_insert on public.analytics_widgets;
create policy analytics_widgets_insert on public.analytics_widgets for insert with check (
  exists (select 1 from public.analytics_dashboards d where d.id = dashboard_id and public.is_organization_member(d.organization_id))
);
drop policy if exists analytics_widgets_update on public.analytics_widgets;
create policy analytics_widgets_update on public.analytics_widgets for update using (
  exists (select 1 from public.analytics_dashboards d where d.id = dashboard_id and public.is_organization_member(d.organization_id))
);
drop policy if exists analytics_widgets_delete on public.analytics_widgets;
create policy analytics_widgets_delete on public.analytics_widgets for delete using (
  exists (select 1 from public.analytics_dashboards d where d.id = dashboard_id and public.is_organization_member(d.organization_id))
);

insert into public.permissions (key, description, resource)
values ('analytics.manage', 'Manage analytics dashboards and reports', 'analytics')
on conflict (key) do update set description = excluded.description, resource = excluded.resource;
