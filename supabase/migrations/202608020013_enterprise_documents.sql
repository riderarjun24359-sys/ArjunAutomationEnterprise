-- Sprint 20: Enterprise Document & Content Management

create table if not exists public.document_folders (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  parent_folder_id uuid references public.document_folders(id) on delete set null,
  name text not null,
  slug text not null,
  description text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, slug)
);

create table if not exists public.documents (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  folder_id uuid references public.document_folders(id) on delete set null,
  title text not null,
  file_name text not null,
  file_url text not null default '',
  mime_type text not null default 'application/octet-stream',
  file_size integer not null default 0,
  status text not null default 'active',
  current_version integer not null default 1,
  client_id uuid references public.clients(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  employee_id uuid references public.employees(id) on delete set null,
  invoice_id uuid references public.invoices(id) on delete set null,
  purchase_order_id uuid references public.purchase_orders(id) on delete set null,
  support_ticket_id uuid references public.support_tickets(id) on delete set null,
  sales_opportunity_id uuid references public.sales_opportunities(id) on delete set null,
  uploaded_by uuid references public.user_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.document_tags (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  color text not null default '#64748b',
  created_at timestamptz not null default now(),
  unique (organization_id, name)
);

create table if not exists public.document_tag_links (
  id uuid primary key default uuid_generate_v4(),
  document_id uuid not null references public.documents(id) on delete cascade,
  tag_id uuid not null references public.document_tags(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (document_id, tag_id)
);

create table if not exists public.document_versions (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  document_id uuid not null references public.documents(id) on delete cascade,
  version_number integer not null,
  file_url text not null default '',
  file_size integer not null default 0,
  change_summary text not null default '',
  created_by uuid references public.user_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (document_id, version_number)
);

create table if not exists public.document_approvals (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  document_id uuid not null references public.documents(id) on delete cascade,
  approver_id uuid references public.employees(id) on delete set null,
  status text not null default 'pending',
  comments text not null default '',
  decided_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.document_esign_preparations (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  document_id uuid not null references public.documents(id) on delete cascade,
  signer_name text not null,
  signer_email text not null,
  status text not null default 'draft',
  prepared_at timestamptz not null default now(),
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.document_shares (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  document_id uuid not null references public.documents(id) on delete cascade,
  share_token text not null,
  recipient_email text not null default '',
  permission_level text not null default 'view',
  expires_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (organization_id, share_token)
);

create table if not exists public.document_access_grants (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  document_id uuid references public.documents(id) on delete cascade,
  folder_id uuid references public.document_folders(id) on delete cascade,
  grantee_type text not null default 'employee',
  grantee_id uuid,
  permission_level text not null default 'view',
  created_at timestamptz not null default now()
);

create table if not exists public.document_templates (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  category text not null default 'general',
  description text not null default '',
  template_content text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, name)
);

create table if not exists public.document_previews (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  document_id uuid not null references public.documents(id) on delete cascade,
  preview_type text not null default 'thumbnail',
  preview_url text not null default '',
  page_count integer not null default 1,
  generated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.document_search_index (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  document_id uuid not null references public.documents(id) on delete cascade,
  search_text text not null default '',
  indexed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.document_retention_policies (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  retention_days integer not null default 365,
  action_on_expiry text not null default 'archive',
  applies_to_category text not null default 'all',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, name)
);

create table if not exists public.document_archives (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  document_id uuid not null references public.documents(id) on delete cascade,
  archived_at timestamptz not null default now(),
  archived_by uuid references public.user_profiles(id) on delete set null,
  restore_available boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.document_activity_logs (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  document_id uuid references public.documents(id) on delete set null,
  activity_type text not null,
  summary text not null default '',
  performed_by uuid references public.user_profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.document_audit_logs (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  entity_type text not null,
  entity_id uuid,
  action text not null,
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  performed_by uuid references public.user_profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_document_folders_org on public.document_folders(organization_id);
create index if not exists idx_documents_org on public.documents(organization_id);
create index if not exists idx_document_tags_org on public.document_tags(organization_id);
create index if not exists idx_document_versions_org on public.document_versions(organization_id);
create index if not exists idx_document_approvals_org on public.document_approvals(organization_id);
create index if not exists idx_document_esign_preparations_org on public.document_esign_preparations(organization_id);
create index if not exists idx_document_shares_org on public.document_shares(organization_id);
create index if not exists idx_document_access_grants_org on public.document_access_grants(organization_id);
create index if not exists idx_document_templates_org on public.document_templates(organization_id);
create index if not exists idx_document_previews_org on public.document_previews(organization_id);
create index if not exists idx_document_search_index_org on public.document_search_index(organization_id);
create index if not exists idx_document_retention_policies_org on public.document_retention_policies(organization_id);
create index if not exists idx_document_archives_org on public.document_archives(organization_id);
create index if not exists idx_document_activity_logs_org on public.document_activity_logs(organization_id);
create index if not exists idx_document_audit_logs_org on public.document_audit_logs(organization_id);

drop trigger if exists trg_document_folders_updated_at on public.document_folders;
create trigger trg_document_folders_updated_at before update on public.document_folders for each row execute function public.set_updated_at();
drop trigger if exists trg_documents_updated_at on public.documents;
create trigger trg_documents_updated_at before update on public.documents for each row execute function public.set_updated_at();
drop trigger if exists trg_document_approvals_updated_at on public.document_approvals;
create trigger trg_document_approvals_updated_at before update on public.document_approvals for each row execute function public.set_updated_at();
drop trigger if exists trg_document_esign_preparations_updated_at on public.document_esign_preparations;
create trigger trg_document_esign_preparations_updated_at before update on public.document_esign_preparations for each row execute function public.set_updated_at();
drop trigger if exists trg_document_templates_updated_at on public.document_templates;
create trigger trg_document_templates_updated_at before update on public.document_templates for each row execute function public.set_updated_at();
drop trigger if exists trg_document_retention_policies_updated_at on public.document_retention_policies;
create trigger trg_document_retention_policies_updated_at before update on public.document_retention_policies for each row execute function public.set_updated_at();

alter table public.document_folders enable row level security;
alter table public.documents enable row level security;
alter table public.document_tags enable row level security;
alter table public.document_tag_links enable row level security;
alter table public.document_versions enable row level security;
alter table public.document_approvals enable row level security;
alter table public.document_esign_preparations enable row level security;
alter table public.document_shares enable row level security;
alter table public.document_access_grants enable row level security;
alter table public.document_templates enable row level security;
alter table public.document_previews enable row level security;
alter table public.document_search_index enable row level security;
alter table public.document_retention_policies enable row level security;
alter table public.document_archives enable row level security;
alter table public.document_activity_logs enable row level security;
alter table public.document_audit_logs enable row level security;

do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'document_folders', 'documents', 'document_tags', 'document_versions',
    'document_approvals', 'document_esign_preparations', 'document_shares',
    'document_access_grants', 'document_templates', 'document_previews',
    'document_search_index', 'document_retention_policies', 'document_archives',
    'document_activity_logs', 'document_audit_logs'
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

drop policy if exists document_tag_links_select on public.document_tag_links;
create policy document_tag_links_select on public.document_tag_links for select using (
  exists (select 1 from public.documents d where d.id = document_id and public.is_organization_member(d.organization_id))
);
drop policy if exists document_tag_links_insert on public.document_tag_links;
create policy document_tag_links_insert on public.document_tag_links for insert with check (
  exists (select 1 from public.documents d where d.id = document_id and public.is_organization_member(d.organization_id))
);
drop policy if exists document_tag_links_update on public.document_tag_links;
create policy document_tag_links_update on public.document_tag_links for update using (
  exists (select 1 from public.documents d where d.id = document_id and public.is_organization_member(d.organization_id))
);
drop policy if exists document_tag_links_delete on public.document_tag_links;
create policy document_tag_links_delete on public.document_tag_links for delete using (
  exists (select 1 from public.documents d where d.id = document_id and public.is_organization_member(d.organization_id))
);

insert into public.permissions (key, description, resource)
values
  ('documents.view', 'View documents and content library', 'documents'),
  ('documents.manage', 'Upload, edit, and organize documents', 'documents'),
  ('documents.approve', 'Approve documents and manage workflows', 'documents'),
  ('documents.admin', 'Manage retention, access, and policies', 'documents')
on conflict (key) do update set description = excluded.description, resource = excluded.resource;
