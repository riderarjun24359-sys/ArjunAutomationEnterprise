-- V2 Program B Sprint 5: Enterprise Dynamic Document Engine

-- DocumentHub
create table if not exists public.dde_document_hubs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_key text not null,
  hub_name text not null,
  environment text not null default 'production',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_key)
);

-- DocumentType
create table if not exists public.dde_document_types (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dde_document_hubs(id) on delete cascade,
  type_key text not null,
  type_name text not null default '',
  type_category text not null default 'general',
  description text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, type_key)
);

-- DocumentCategory
create table if not exists public.dde_document_categories (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dde_document_hubs(id) on delete cascade,
  category_key text not null,
  category_name text not null default '',
  category_type text not null default 'general',
  description text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, category_key)
);

-- DocumentTemplate
create table if not exists public.dde_document_templates (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dde_document_hubs(id) on delete cascade,
  template_key text not null,
  template_name text not null default '',
  template_type text not null default 'standard',
  description text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, template_key)
);

-- DocumentVersion
create table if not exists public.dde_document_versions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dde_document_hubs(id) on delete cascade,
  version_key text not null,
  version_number text not null default '',
  release_channel text not null default 'stable',
  published_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, version_key)
);

-- TemplateHeader
create table if not exists public.dde_template_headers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dde_document_hubs(id) on delete cascade,
  header_key text not null,
  header_name text not null default '',
  header_content text not null default '',
  position text not null default 'top',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, header_key)
);

-- TemplateFooter
create table if not exists public.dde_template_footers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dde_document_hubs(id) on delete cascade,
  footer_key text not null,
  footer_name text not null default '',
  footer_content text not null default '',
  position text not null default 'bottom',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, footer_key)
);

-- TemplateSection
create table if not exists public.dde_template_sections (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dde_document_hubs(id) on delete cascade,
  section_key text not null,
  section_name text not null default '',
  section_type text not null default 'body',
  section_order integer not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, section_key)
);

-- TemplateVariable
create table if not exists public.dde_template_variables (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dde_document_hubs(id) on delete cascade,
  variable_key text not null,
  variable_name text not null default '',
  variable_type text not null default 'string',
  default_value text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, variable_key)
);

-- PdfGeneration
create table if not exists public.dde_pdf_generations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dde_document_hubs(id) on delete cascade,
  generation_key text not null,
  generation_name text not null default '',
  generation_status text not null default 'pending',
  started_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, generation_key)
);

-- HtmlGeneration
create table if not exists public.dde_html_generations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dde_document_hubs(id) on delete cascade,
  generation_key text not null,
  generation_name text not null default '',
  generation_status text not null default 'pending',
  started_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, generation_key)
);

-- ExportJob
create table if not exists public.dde_export_jobs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dde_document_hubs(id) on delete cascade,
  job_key text not null,
  job_name text not null default '',
  job_status text not null default 'pending',
  export_format text not null default 'pdf',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, job_key)
);

-- BatchGeneration
create table if not exists public.dde_batch_generations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dde_document_hubs(id) on delete cascade,
  batch_key text not null,
  batch_name text not null default '',
  batch_status text not null default 'pending',
  total_count integer not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, batch_key)
);

-- ElectronicSignature
create table if not exists public.dde_electronic_signatures (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dde_document_hubs(id) on delete cascade,
  signature_key text not null,
  signature_name text not null default '',
  signature_status text not null default 'pending',
  signed_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, signature_key)
);

-- ApprovalSignature
create table if not exists public.dde_approval_signatures (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dde_document_hubs(id) on delete cascade,
  signature_key text not null,
  signature_name text not null default '',
  signature_status text not null default 'pending',
  approved_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, signature_key)
);

-- SignatureVerification
create table if not exists public.dde_signature_verifications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dde_document_hubs(id) on delete cascade,
  verification_key text not null,
  verification_status text not null default 'pending',
  verification_result text not null default '',
  verified_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, verification_key)
);

-- SignatureAuditEntry
create table if not exists public.dde_signature_audit_entries (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dde_document_hubs(id) on delete cascade,
  audit_key text not null,
  audit_action text not null default '',
  audit_summary text not null default '',
  recorded_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, audit_key)
);

-- VersionHistory
create table if not exists public.dde_version_histories (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dde_document_hubs(id) on delete cascade,
  history_key text not null,
  history_version text not null default '',
  history_summary text not null default '',
  recorded_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, history_key)
);

-- RetentionPolicy
create table if not exists public.dde_retention_policies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dde_document_hubs(id) on delete cascade,
  policy_key text not null,
  policy_name text not null default '',
  retention_days integer not null default 365,
  policy_type text not null default 'standard',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, policy_key)
);

-- ArchiveRecord
create table if not exists public.dde_archive_records (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dde_document_hubs(id) on delete cascade,
  archive_key text not null,
  archive_name text not null default '',
  archive_status text not null default 'pending',
  archived_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, archive_key)
);

-- SharingPolicy
create table if not exists public.dde_sharing_policies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dde_document_hubs(id) on delete cascade,
  policy_key text not null,
  policy_name text not null default '',
  sharing_scope text not null default 'organization',
  access_level text not null default 'read',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, policy_key)
);

-- EmailDelivery
create table if not exists public.dde_email_deliveries (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dde_document_hubs(id) on delete cascade,
  delivery_key text not null,
  delivery_name text not null default '',
  delivery_status text not null default 'pending',
  recipient_email text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, delivery_key)
);

-- DownloadDelivery
create table if not exists public.dde_download_deliveries (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dde_document_hubs(id) on delete cascade,
  delivery_key text not null,
  delivery_name text not null default '',
  delivery_status text not null default 'pending',
  download_url text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, delivery_key)
);

-- WebhookDelivery
create table if not exists public.dde_webhook_deliveries (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dde_document_hubs(id) on delete cascade,
  delivery_key text not null,
  delivery_name text not null default '',
  delivery_status text not null default 'pending',
  webhook_url text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, delivery_key)
);

-- GenerationAnalytics
create table if not exists public.dde_generation_analytics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dde_document_hubs(id) on delete cascade,
  analytics_key text not null,
  analytics_type text not null default 'generation',
  analytics_score numeric(5, 2) not null default 0,
  metric_date date not null default current_date,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, analytics_key)
);

-- DeliveryAnalytics
create table if not exists public.dde_delivery_analytics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dde_document_hubs(id) on delete cascade,
  analytics_key text not null,
  analytics_type text not null default 'delivery',
  analytics_score numeric(5, 2) not null default 0,
  metric_date date not null default current_date,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, analytics_key)
);

-- StorageAnalytics
create table if not exists public.dde_storage_analytics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dde_document_hubs(id) on delete cascade,
  analytics_key text not null,
  analytics_type text not null default 'storage',
  analytics_score numeric(5, 2) not null default 0,
  metric_date date not null default current_date,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, analytics_key)
);

-- DocumentMetric
create table if not exists public.dde_document_metrics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  metrics_key text not null,
  metric_date date not null default current_date,
  generated_count integer not null default 0,
  download_count integer not null default 0,
  delivery_success_rate numeric(5, 2) not null default 100,
  failure_count integer not null default 0,
  signature_pending_count integer not null default 0,
  storage_usage_mb numeric(10, 2) not null default 0,
  overall_document_score numeric(5, 2) not null default 100,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, metrics_key)
);

-- DocumentHealth
create table if not exists public.dde_document_health (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  health_key text not null,
  health_date date not null default current_date,
  overall_score numeric(5, 2) not null default 100,
  disaster_recovery_mode boolean not null default false,
  pending_signatures_count integer not null default 0,
  delivery_queue_depth integer not null default 0,
  framework_health_status text not null default 'healthy',
  summary text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, health_key)
);

-- PendingSignature
create table if not exists public.dde_pending_signatures (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dde_document_hubs(id) on delete cascade,
  signature_key text not null,
  signature_name text not null default '',
  signature_status text not null default 'pending',
  requested_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, signature_key)
);

-- DocumentFailure
create table if not exists public.dde_document_failures (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dde_document_hubs(id) on delete cascade,
  failure_key text not null,
  failure_type text not null default 'generation',
  error_code text not null default '',
  error_message text not null default '',
  failed_at timestamptz not null default now(),
  resolved_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, failure_key)
);

-- Audit Logs
create table if not exists public.dde_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  entity_type text not null default '',
  entity_id uuid,
  action text not null default '',
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  performed_by uuid,
  security_level text not null default 'standard',
  created_at timestamptz not null default now()
);

create index if not exists idx_dde_document_hubs_org on public.dde_document_hubs(organization_id);
create index if not exists idx_dde_document_types_org on public.dde_document_types(organization_id);
create index if not exists idx_dde_document_types_hub on public.dde_document_types(hub_id);
create index if not exists idx_dde_document_categories_org on public.dde_document_categories(organization_id);
create index if not exists idx_dde_document_categories_hub on public.dde_document_categories(hub_id);
create index if not exists idx_dde_document_templates_org on public.dde_document_templates(organization_id);
create index if not exists idx_dde_document_templates_hub on public.dde_document_templates(hub_id);
create index if not exists idx_dde_document_versions_org on public.dde_document_versions(organization_id);
create index if not exists idx_dde_document_versions_hub on public.dde_document_versions(hub_id);
create index if not exists idx_dde_template_headers_org on public.dde_template_headers(organization_id);
create index if not exists idx_dde_template_headers_hub on public.dde_template_headers(hub_id);
create index if not exists idx_dde_template_footers_org on public.dde_template_footers(organization_id);
create index if not exists idx_dde_template_footers_hub on public.dde_template_footers(hub_id);
create index if not exists idx_dde_template_sections_org on public.dde_template_sections(organization_id);
create index if not exists idx_dde_template_sections_hub on public.dde_template_sections(hub_id);
create index if not exists idx_dde_template_variables_org on public.dde_template_variables(organization_id);
create index if not exists idx_dde_template_variables_hub on public.dde_template_variables(hub_id);
create index if not exists idx_dde_pdf_generations_org on public.dde_pdf_generations(organization_id);
create index if not exists idx_dde_pdf_generations_hub on public.dde_pdf_generations(hub_id);
create index if not exists idx_dde_html_generations_org on public.dde_html_generations(organization_id);
create index if not exists idx_dde_html_generations_hub on public.dde_html_generations(hub_id);
create index if not exists idx_dde_export_jobs_org on public.dde_export_jobs(organization_id);
create index if not exists idx_dde_export_jobs_hub on public.dde_export_jobs(hub_id);
create index if not exists idx_dde_batch_generations_org on public.dde_batch_generations(organization_id);
create index if not exists idx_dde_batch_generations_hub on public.dde_batch_generations(hub_id);
create index if not exists idx_dde_electronic_signatures_org on public.dde_electronic_signatures(organization_id);
create index if not exists idx_dde_electronic_signatures_hub on public.dde_electronic_signatures(hub_id);
create index if not exists idx_dde_approval_signatures_org on public.dde_approval_signatures(organization_id);
create index if not exists idx_dde_approval_signatures_hub on public.dde_approval_signatures(hub_id);
create index if not exists idx_dde_signature_verifications_org on public.dde_signature_verifications(organization_id);
create index if not exists idx_dde_signature_verifications_hub on public.dde_signature_verifications(hub_id);
create index if not exists idx_dde_signature_audit_entries_org on public.dde_signature_audit_entries(organization_id);
create index if not exists idx_dde_signature_audit_entries_hub on public.dde_signature_audit_entries(hub_id);
create index if not exists idx_dde_version_histories_org on public.dde_version_histories(organization_id);
create index if not exists idx_dde_version_histories_hub on public.dde_version_histories(hub_id);
create index if not exists idx_dde_retention_policies_org on public.dde_retention_policies(organization_id);
create index if not exists idx_dde_retention_policies_hub on public.dde_retention_policies(hub_id);
create index if not exists idx_dde_archive_records_org on public.dde_archive_records(organization_id);
create index if not exists idx_dde_archive_records_hub on public.dde_archive_records(hub_id);
create index if not exists idx_dde_sharing_policies_org on public.dde_sharing_policies(organization_id);
create index if not exists idx_dde_sharing_policies_hub on public.dde_sharing_policies(hub_id);
create index if not exists idx_dde_email_deliveries_org on public.dde_email_deliveries(organization_id);
create index if not exists idx_dde_email_deliveries_hub on public.dde_email_deliveries(hub_id);
create index if not exists idx_dde_download_deliveries_org on public.dde_download_deliveries(organization_id);
create index if not exists idx_dde_download_deliveries_hub on public.dde_download_deliveries(hub_id);
create index if not exists idx_dde_webhook_deliveries_org on public.dde_webhook_deliveries(organization_id);
create index if not exists idx_dde_webhook_deliveries_hub on public.dde_webhook_deliveries(hub_id);
create index if not exists idx_dde_generation_analytics_org on public.dde_generation_analytics(organization_id);
create index if not exists idx_dde_generation_analytics_hub on public.dde_generation_analytics(hub_id);
create index if not exists idx_dde_delivery_analytics_org on public.dde_delivery_analytics(organization_id);
create index if not exists idx_dde_delivery_analytics_hub on public.dde_delivery_analytics(hub_id);
create index if not exists idx_dde_storage_analytics_org on public.dde_storage_analytics(organization_id);
create index if not exists idx_dde_storage_analytics_hub on public.dde_storage_analytics(hub_id);
create index if not exists idx_dde_document_metrics_org on public.dde_document_metrics(organization_id);
create index if not exists idx_dde_document_health_org on public.dde_document_health(organization_id);
create index if not exists idx_dde_pending_signatures_org on public.dde_pending_signatures(organization_id);
create index if not exists idx_dde_pending_signatures_hub on public.dde_pending_signatures(hub_id);
create index if not exists idx_dde_document_failures_org on public.dde_document_failures(organization_id);
create index if not exists idx_dde_document_failures_hub on public.dde_document_failures(hub_id);
create index if not exists idx_dde_audit_logs_org on public.dde_audit_logs(organization_id);

do $$
declare tbl text;
begin
  foreach tbl in array array[
    'dde_document_hubs','dde_document_types','dde_document_categories','dde_document_templates','dde_document_versions','dde_template_headers','dde_template_footers','dde_template_sections','dde_template_variables','dde_pdf_generations','dde_html_generations','dde_export_jobs','dde_batch_generations','dde_electronic_signatures','dde_approval_signatures','dde_signature_verifications','dde_signature_audit_entries','dde_version_histories','dde_retention_policies','dde_archive_records','dde_sharing_policies','dde_email_deliveries','dde_download_deliveries','dde_webhook_deliveries','dde_generation_analytics','dde_delivery_analytics','dde_storage_analytics','dde_document_metrics','dde_document_health','dde_pending_signatures','dde_document_failures'
  ]
  loop
    execute format('drop trigger if exists trg_%I_updated_at on public.%I', tbl, tbl);
    execute format('create trigger trg_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()', tbl, tbl);
  end loop;
end $$;

alter table public.dde_document_hubs enable row level security;
alter table public.dde_document_types enable row level security;
alter table public.dde_document_categories enable row level security;
alter table public.dde_document_templates enable row level security;
alter table public.dde_document_versions enable row level security;
alter table public.dde_template_headers enable row level security;
alter table public.dde_template_footers enable row level security;
alter table public.dde_template_sections enable row level security;
alter table public.dde_template_variables enable row level security;
alter table public.dde_pdf_generations enable row level security;
alter table public.dde_html_generations enable row level security;
alter table public.dde_export_jobs enable row level security;
alter table public.dde_batch_generations enable row level security;
alter table public.dde_electronic_signatures enable row level security;
alter table public.dde_approval_signatures enable row level security;
alter table public.dde_signature_verifications enable row level security;
alter table public.dde_signature_audit_entries enable row level security;
alter table public.dde_version_histories enable row level security;
alter table public.dde_retention_policies enable row level security;
alter table public.dde_archive_records enable row level security;
alter table public.dde_sharing_policies enable row level security;
alter table public.dde_email_deliveries enable row level security;
alter table public.dde_download_deliveries enable row level security;
alter table public.dde_webhook_deliveries enable row level security;
alter table public.dde_generation_analytics enable row level security;
alter table public.dde_delivery_analytics enable row level security;
alter table public.dde_storage_analytics enable row level security;
alter table public.dde_document_metrics enable row level security;
alter table public.dde_document_health enable row level security;
alter table public.dde_pending_signatures enable row level security;
alter table public.dde_document_failures enable row level security;
alter table public.dde_audit_logs enable row level security;

do $$
declare tbl text;
begin
  foreach tbl in array array[
    'dde_document_hubs','dde_document_types','dde_document_categories','dde_document_templates','dde_document_versions','dde_template_headers','dde_template_footers','dde_template_sections','dde_template_variables','dde_pdf_generations','dde_html_generations','dde_export_jobs','dde_batch_generations','dde_electronic_signatures','dde_approval_signatures','dde_signature_verifications','dde_signature_audit_entries','dde_version_histories','dde_retention_policies','dde_archive_records','dde_sharing_policies','dde_email_deliveries','dde_download_deliveries','dde_webhook_deliveries','dde_generation_analytics','dde_delivery_analytics','dde_storage_analytics','dde_document_metrics','dde_document_health','dde_pending_signatures','dde_document_failures','dde_audit_logs'
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
  ('dde.view', 'View enterprise dynamic document engine data', 'enterprise_dynamic_document_engine'),
  ('dde.manage', 'Manage document registry, template engine, generation, signature, storage, delivery, and framework outputs', 'enterprise_dynamic_document_engine'),
  ('dde.approve', 'Approve document signatures and approval gates', 'enterprise_dynamic_document_engine'),
  ('dde.admin', 'Administer enterprise dynamic document engine governance', 'enterprise_dynamic_document_engine')
on conflict (key) do update set description = excluded.description, resource = excluded.resource;
