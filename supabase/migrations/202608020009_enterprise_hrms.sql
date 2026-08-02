-- Sprint 16: Enterprise HRMS & Employee Management

create table if not exists public.departments (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  code text not null,
  parent_department_id uuid references public.departments(id) on delete set null,
  head_employee_id uuid,
  description text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, code)
);

create table if not exists public.designations (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  title text not null,
  level text not null default 'individual_contributor',
  description text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, title)
);

create table if not exists public.employees (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  employee_code text not null,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null default '',
  department_id uuid references public.departments(id) on delete set null,
  designation_id uuid references public.designations(id) on delete set null,
  manager_id uuid references public.employees(id) on delete set null,
  profile_id uuid references public.user_profiles(id) on delete set null,
  status text not null default 'active',
  employment_type text not null default 'full_time',
  hire_date date not null default current_date,
  base_salary numeric(12,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, employee_code),
  unique (organization_id, email)
);

alter table public.departments
  drop constraint if exists departments_head_employee_id_fkey,
  add constraint departments_head_employee_id_fkey foreign key (head_employee_id) references public.employees(id) on delete set null;

create table if not exists public.hr_teams (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  slug text not null,
  department_id uuid references public.departments(id) on delete set null,
  lead_employee_id uuid references public.employees(id) on delete set null,
  description text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, slug)
);

create table if not exists public.hr_team_members (
  id uuid primary key default uuid_generate_v4(),
  team_id uuid not null references public.hr_teams(id) on delete cascade,
  employee_id uuid not null references public.employees(id) on delete cascade,
  role_name text not null default 'member',
  created_at timestamptz not null default now(),
  unique (team_id, employee_id)
);

create table if not exists public.attendance_records (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  employee_id uuid not null references public.employees(id) on delete cascade,
  work_date date not null,
  check_in timestamptz,
  check_out timestamptz,
  status text not null default 'present',
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (employee_id, work_date)
);

create table if not exists public.leave_types (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  code text not null,
  annual_quota numeric(5,1) not null default 0,
  paid boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, code)
);

create table if not exists public.leave_requests (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  employee_id uuid not null references public.employees(id) on delete cascade,
  leave_type_id uuid not null references public.leave_types(id) on delete restrict,
  start_date date not null,
  end_date date not null,
  status text not null default 'pending',
  reason text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.holidays (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  holiday_date date not null,
  region text not null default 'global',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, holiday_date, region)
);

create table if not exists public.payroll_cycles (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  period_start date not null,
  period_end date not null,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payroll_entries (
  id uuid primary key default uuid_generate_v4(),
  cycle_id uuid not null references public.payroll_cycles(id) on delete cascade,
  employee_id uuid not null references public.employees(id) on delete cascade,
  base_salary numeric(12,2) not null default 0,
  allowances numeric(12,2) not null default 0,
  deductions numeric(12,2) not null default 0,
  net_pay numeric(12,2) not null default 0,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (cycle_id, employee_id)
);

create table if not exists public.employee_documents (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  employee_id uuid not null references public.employees(id) on delete cascade,
  title text not null,
  document_type text not null default 'general',
  file_url text not null default '',
  uploaded_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.performance_reviews (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  employee_id uuid not null references public.employees(id) on delete cascade,
  reviewer_id uuid references public.employees(id) on delete set null,
  review_period text not null,
  rating numeric(3,1) not null default 0,
  summary text not null default '',
  status text not null default 'scheduled',
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.job_openings (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  title text not null,
  department_id uuid references public.departments(id) on delete set null,
  designation_id uuid references public.designations(id) on delete set null,
  status text not null default 'open',
  description text not null default '',
  opened_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.job_candidates (
  id uuid primary key default uuid_generate_v4(),
  opening_id uuid not null references public.job_openings(id) on delete cascade,
  full_name text not null,
  email text not null,
  stage text not null default 'applied',
  applied_at timestamptz not null default now(),
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.onboarding_plans (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  employee_id uuid not null references public.employees(id) on delete cascade,
  status text not null default 'in_progress',
  start_date date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.onboarding_tasks (
  id uuid primary key default uuid_generate_v4(),
  plan_id uuid not null references public.onboarding_plans(id) on delete cascade,
  title text not null,
  status text not null default 'pending',
  due_date date,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.offboarding_plans (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  employee_id uuid not null references public.employees(id) on delete cascade,
  status text not null default 'in_progress',
  last_working_date date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.offboarding_tasks (
  id uuid primary key default uuid_generate_v4(),
  plan_id uuid not null references public.offboarding_plans(id) on delete cascade,
  title text not null,
  status text not null default 'pending',
  due_date date,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.org_chart_nodes (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  employee_id uuid not null references public.employees(id) on delete cascade,
  department_id uuid references public.departments(id) on delete set null,
  parent_node_id uuid references public.org_chart_nodes(id) on delete set null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, employee_id)
);

create index if not exists idx_departments_org on public.departments(organization_id);
create index if not exists idx_designations_org on public.designations(organization_id);
create index if not exists idx_employees_org on public.employees(organization_id);
create index if not exists idx_employees_department on public.employees(department_id);
create index if not exists idx_hr_teams_org on public.hr_teams(organization_id);
create index if not exists idx_attendance_org on public.attendance_records(organization_id);
create index if not exists idx_attendance_employee on public.attendance_records(employee_id);
create index if not exists idx_leave_types_org on public.leave_types(organization_id);
create index if not exists idx_leave_requests_org on public.leave_requests(organization_id);
create index if not exists idx_holidays_org on public.holidays(organization_id);
create index if not exists idx_payroll_cycles_org on public.payroll_cycles(organization_id);
create index if not exists idx_employee_documents_org on public.employee_documents(organization_id);
create index if not exists idx_performance_reviews_org on public.performance_reviews(organization_id);
create index if not exists idx_job_openings_org on public.job_openings(organization_id);
create index if not exists idx_onboarding_plans_org on public.onboarding_plans(organization_id);
create index if not exists idx_offboarding_plans_org on public.offboarding_plans(organization_id);
create index if not exists idx_org_chart_nodes_org on public.org_chart_nodes(organization_id);

drop trigger if exists trg_departments_updated_at on public.departments;
create trigger trg_departments_updated_at before update on public.departments for each row execute function public.set_updated_at();
drop trigger if exists trg_designations_updated_at on public.designations;
create trigger trg_designations_updated_at before update on public.designations for each row execute function public.set_updated_at();
drop trigger if exists trg_employees_updated_at on public.employees;
create trigger trg_employees_updated_at before update on public.employees for each row execute function public.set_updated_at();
drop trigger if exists trg_hr_teams_updated_at on public.hr_teams;
create trigger trg_hr_teams_updated_at before update on public.hr_teams for each row execute function public.set_updated_at();
drop trigger if exists trg_attendance_records_updated_at on public.attendance_records;
create trigger trg_attendance_records_updated_at before update on public.attendance_records for each row execute function public.set_updated_at();
drop trigger if exists trg_leave_types_updated_at on public.leave_types;
create trigger trg_leave_types_updated_at before update on public.leave_types for each row execute function public.set_updated_at();
drop trigger if exists trg_leave_requests_updated_at on public.leave_requests;
create trigger trg_leave_requests_updated_at before update on public.leave_requests for each row execute function public.set_updated_at();
drop trigger if exists trg_holidays_updated_at on public.holidays;
create trigger trg_holidays_updated_at before update on public.holidays for each row execute function public.set_updated_at();
drop trigger if exists trg_payroll_cycles_updated_at on public.payroll_cycles;
create trigger trg_payroll_cycles_updated_at before update on public.payroll_cycles for each row execute function public.set_updated_at();
drop trigger if exists trg_payroll_entries_updated_at on public.payroll_entries;
create trigger trg_payroll_entries_updated_at before update on public.payroll_entries for each row execute function public.set_updated_at();
drop trigger if exists trg_employee_documents_updated_at on public.employee_documents;
create trigger trg_employee_documents_updated_at before update on public.employee_documents for each row execute function public.set_updated_at();
drop trigger if exists trg_performance_reviews_updated_at on public.performance_reviews;
create trigger trg_performance_reviews_updated_at before update on public.performance_reviews for each row execute function public.set_updated_at();
drop trigger if exists trg_job_openings_updated_at on public.job_openings;
create trigger trg_job_openings_updated_at before update on public.job_openings for each row execute function public.set_updated_at();
drop trigger if exists trg_job_candidates_updated_at on public.job_candidates;
create trigger trg_job_candidates_updated_at before update on public.job_candidates for each row execute function public.set_updated_at();
drop trigger if exists trg_onboarding_plans_updated_at on public.onboarding_plans;
create trigger trg_onboarding_plans_updated_at before update on public.onboarding_plans for each row execute function public.set_updated_at();
drop trigger if exists trg_onboarding_tasks_updated_at on public.onboarding_tasks;
create trigger trg_onboarding_tasks_updated_at before update on public.onboarding_tasks for each row execute function public.set_updated_at();
drop trigger if exists trg_offboarding_plans_updated_at on public.offboarding_plans;
create trigger trg_offboarding_plans_updated_at before update on public.offboarding_plans for each row execute function public.set_updated_at();
drop trigger if exists trg_offboarding_tasks_updated_at on public.offboarding_tasks;
create trigger trg_offboarding_tasks_updated_at before update on public.offboarding_tasks for each row execute function public.set_updated_at();
drop trigger if exists trg_org_chart_nodes_updated_at on public.org_chart_nodes;
create trigger trg_org_chart_nodes_updated_at before update on public.org_chart_nodes for each row execute function public.set_updated_at();

alter table public.departments enable row level security;
alter table public.designations enable row level security;
alter table public.employees enable row level security;
alter table public.hr_teams enable row level security;
alter table public.hr_team_members enable row level security;
alter table public.attendance_records enable row level security;
alter table public.leave_types enable row level security;
alter table public.leave_requests enable row level security;
alter table public.holidays enable row level security;
alter table public.payroll_cycles enable row level security;
alter table public.payroll_entries enable row level security;
alter table public.employee_documents enable row level security;
alter table public.performance_reviews enable row level security;
alter table public.job_openings enable row level security;
alter table public.job_candidates enable row level security;
alter table public.onboarding_plans enable row level security;
alter table public.onboarding_tasks enable row level security;
alter table public.offboarding_plans enable row level security;
alter table public.offboarding_tasks enable row level security;
alter table public.org_chart_nodes enable row level security;

do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'departments', 'designations', 'employees', 'hr_teams',
    'attendance_records', 'leave_types', 'leave_requests', 'holidays',
    'payroll_cycles', 'employee_documents', 'performance_reviews',
    'job_openings', 'onboarding_plans', 'offboarding_plans', 'org_chart_nodes'
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

drop policy if exists hr_team_members_select on public.hr_team_members;
create policy hr_team_members_select on public.hr_team_members for select using (
  exists (select 1 from public.hr_teams t where t.id = team_id and public.is_organization_member(t.organization_id))
);
drop policy if exists hr_team_members_insert on public.hr_team_members;
create policy hr_team_members_insert on public.hr_team_members for insert with check (
  exists (select 1 from public.hr_teams t where t.id = team_id and public.is_organization_member(t.organization_id))
);
drop policy if exists hr_team_members_update on public.hr_team_members;
create policy hr_team_members_update on public.hr_team_members for update using (
  exists (select 1 from public.hr_teams t where t.id = team_id and public.is_organization_member(t.organization_id))
);
drop policy if exists hr_team_members_delete on public.hr_team_members;
create policy hr_team_members_delete on public.hr_team_members for delete using (
  exists (select 1 from public.hr_teams t where t.id = team_id and public.is_organization_member(t.organization_id))
);

drop policy if exists payroll_entries_select on public.payroll_entries;
create policy payroll_entries_select on public.payroll_entries for select using (
  exists (select 1 from public.payroll_cycles c where c.id = cycle_id and public.is_organization_member(c.organization_id))
);
drop policy if exists payroll_entries_insert on public.payroll_entries;
create policy payroll_entries_insert on public.payroll_entries for insert with check (
  exists (select 1 from public.payroll_cycles c where c.id = cycle_id and public.is_organization_member(c.organization_id))
);
drop policy if exists payroll_entries_update on public.payroll_entries;
create policy payroll_entries_update on public.payroll_entries for update using (
  exists (select 1 from public.payroll_cycles c where c.id = cycle_id and public.is_organization_member(c.organization_id))
);
drop policy if exists payroll_entries_delete on public.payroll_entries;
create policy payroll_entries_delete on public.payroll_entries for delete using (
  exists (select 1 from public.payroll_cycles c where c.id = cycle_id and public.is_organization_member(c.organization_id))
);

drop policy if exists job_candidates_select on public.job_candidates;
create policy job_candidates_select on public.job_candidates for select using (
  exists (select 1 from public.job_openings o where o.id = opening_id and public.is_organization_member(o.organization_id))
);
drop policy if exists job_candidates_insert on public.job_candidates;
create policy job_candidates_insert on public.job_candidates for insert with check (
  exists (select 1 from public.job_openings o where o.id = opening_id and public.is_organization_member(o.organization_id))
);
drop policy if exists job_candidates_update on public.job_candidates;
create policy job_candidates_update on public.job_candidates for update using (
  exists (select 1 from public.job_openings o where o.id = opening_id and public.is_organization_member(o.organization_id))
);
drop policy if exists job_candidates_delete on public.job_candidates;
create policy job_candidates_delete on public.job_candidates for delete using (
  exists (select 1 from public.job_openings o where o.id = opening_id and public.is_organization_member(o.organization_id))
);

drop policy if exists onboarding_tasks_select on public.onboarding_tasks;
create policy onboarding_tasks_select on public.onboarding_tasks for select using (
  exists (select 1 from public.onboarding_plans p where p.id = plan_id and public.is_organization_member(p.organization_id))
);
drop policy if exists onboarding_tasks_insert on public.onboarding_tasks;
create policy onboarding_tasks_insert on public.onboarding_tasks for insert with check (
  exists (select 1 from public.onboarding_plans p where p.id = plan_id and public.is_organization_member(p.organization_id))
);
drop policy if exists onboarding_tasks_update on public.onboarding_tasks;
create policy onboarding_tasks_update on public.onboarding_tasks for update using (
  exists (select 1 from public.onboarding_plans p where p.id = plan_id and public.is_organization_member(p.organization_id))
);
drop policy if exists onboarding_tasks_delete on public.onboarding_tasks;
create policy onboarding_tasks_delete on public.onboarding_tasks for delete using (
  exists (select 1 from public.onboarding_plans p where p.id = plan_id and public.is_organization_member(p.organization_id))
);

drop policy if exists offboarding_tasks_select on public.offboarding_tasks;
create policy offboarding_tasks_select on public.offboarding_tasks for select using (
  exists (select 1 from public.offboarding_plans p where p.id = plan_id and public.is_organization_member(p.organization_id))
);
drop policy if exists offboarding_tasks_insert on public.offboarding_tasks;
create policy offboarding_tasks_insert on public.offboarding_tasks for insert with check (
  exists (select 1 from public.offboarding_plans p where p.id = plan_id and public.is_organization_member(p.organization_id))
);
drop policy if exists offboarding_tasks_update on public.offboarding_tasks;
create policy offboarding_tasks_update on public.offboarding_tasks for update using (
  exists (select 1 from public.offboarding_plans p where p.id = plan_id and public.is_organization_member(p.organization_id))
);
drop policy if exists offboarding_tasks_delete on public.offboarding_tasks;
create policy offboarding_tasks_delete on public.offboarding_tasks for delete using (
  exists (select 1 from public.offboarding_plans p where p.id = plan_id and public.is_organization_member(p.organization_id))
);

insert into public.permissions (key, description, resource)
values
  ('hr.view', 'View HR and employee records', 'hr'),
  ('hr.manage', 'Manage employees, departments, and HR operations', 'hr'),
  ('hr.payroll.manage', 'Manage payroll cycles and compensation', 'hr'),
  ('hr.recruitment.manage', 'Manage recruitment pipeline and candidates', 'hr')
on conflict (key) do update set description = excluded.description, resource = excluded.resource;
