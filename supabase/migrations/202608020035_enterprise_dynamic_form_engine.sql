-- V2 Program B Sprint 3: Enterprise Dynamic Form Engine

-- FormHub
create table if not exists public.dfe_form_hubs (
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

-- FormDefinition
create table if not exists public.dfe_form_definitions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dfe_form_hubs(id) on delete cascade,
  form_key text not null,
  form_name text not null default '',
  form_type text not null default 'standard',
  description text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, form_key)
);

-- FormCategory
create table if not exists public.dfe_form_categories (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dfe_form_hubs(id) on delete cascade,
  category_key text not null,
  category_name text not null default '',
  category_type text not null default 'general',
  description text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, category_key)
);

-- FormVersion
create table if not exists public.dfe_form_versions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dfe_form_hubs(id) on delete cascade,
  version_key text not null,
  version_number text not null default '',
  release_channel text not null default 'stable',
  published_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, version_key)
);

-- FormDependency
create table if not exists public.dfe_form_dependencies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dfe_form_hubs(id) on delete cascade,
  dependency_key text not null,
  dependency_type text not null default 'form',
  dependency_ref text not null default '',
  resolved_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, dependency_key)
);

-- FormSection
create table if not exists public.dfe_form_sections (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dfe_form_hubs(id) on delete cascade,
  section_key text not null,
  section_name text not null default '',
  section_order integer not null default 0,
  section_type text not null default 'standard',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, section_key)
);

-- FormTab
create table if not exists public.dfe_form_tabs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dfe_form_hubs(id) on delete cascade,
  tab_key text not null,
  tab_name text not null default '',
  tab_order integer not null default 0,
  tab_type text not null default 'standard',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, tab_key)
);

-- FormGroup
create table if not exists public.dfe_form_groups (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dfe_form_hubs(id) on delete cascade,
  group_key text not null,
  group_name text not null default '',
  group_order integer not null default 0,
  group_type text not null default 'standard',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, group_key)
);

-- RepeatableSection
create table if not exists public.dfe_repeatable_sections (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dfe_form_hubs(id) on delete cascade,
  section_key text not null,
  section_name text not null default '',
  min_instances integer not null default 0,
  max_instances integer not null default 10,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, section_key)
);

-- FormField
create table if not exists public.dfe_form_fields (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dfe_form_hubs(id) on delete cascade,
  field_key text not null,
  field_name text not null default '',
  field_type text not null default 'text',
  field_order integer not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, field_key)
);

-- FieldOption
create table if not exists public.dfe_field_options (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dfe_form_hubs(id) on delete cascade,
  option_key text not null,
  option_label text not null default '',
  option_value text not null default '',
  option_order integer not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, option_key)
);

-- FormulaField
create table if not exists public.dfe_formula_fields (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dfe_form_hubs(id) on delete cascade,
  formula_key text not null,
  formula_name text not null default '',
  formula_expression text not null default '',
  result_type text not null default 'number',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, formula_key)
);

-- MediaField
create table if not exists public.dfe_media_fields (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dfe_form_hubs(id) on delete cascade,
  media_key text not null,
  media_name text not null default '',
  media_type text not null default 'image',
  max_file_size_mb integer not null default 10,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, media_key)
);

-- RequiredRule
create table if not exists public.dfe_required_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dfe_form_hubs(id) on delete cascade,
  rule_key text not null,
  rule_name text not null default '',
  field_ref text not null default '',
  error_message text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, rule_key)
);

-- RegexRule
create table if not exists public.dfe_regex_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dfe_form_hubs(id) on delete cascade,
  rule_key text not null,
  rule_name text not null default '',
  pattern text not null default '',
  error_message text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, rule_key)
);

-- RangeRule
create table if not exists public.dfe_range_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dfe_form_hubs(id) on delete cascade,
  rule_key text not null,
  rule_name text not null default '',
  min_value numeric(12, 2),
  max_value numeric(12, 2),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, rule_key)
);

-- CrossFieldRule
create table if not exists public.dfe_cross_field_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dfe_form_hubs(id) on delete cascade,
  rule_key text not null,
  rule_name text not null default '',
  rule_expression text not null default '',
  error_message text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, rule_key)
);

-- FormDraft
create table if not exists public.dfe_form_drafts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dfe_form_hubs(id) on delete cascade,
  draft_key text not null,
  draft_name text not null default '',
  draft_status text not null default 'draft',
  saved_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, draft_key)
);

-- FormSubmission
create table if not exists public.dfe_form_submissions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dfe_form_hubs(id) on delete cascade,
  submission_key text not null,
  submission_name text not null default '',
  submission_status text not null default 'submitted',
  submitted_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, submission_key)
);

-- FormReview
create table if not exists public.dfe_form_reviews (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dfe_form_hubs(id) on delete cascade,
  review_key text not null,
  review_name text not null default '',
  review_status text not null default 'pending',
  reviewed_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, review_key)
);

-- ExecutionAuditEntry
create table if not exists public.dfe_execution_audit_entries (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dfe_form_hubs(id) on delete cascade,
  audit_key text not null,
  audit_type text not null default 'submission',
  audit_summary text not null default '',
  recorded_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, audit_key)
);

-- RenderProfile
create table if not exists public.dfe_render_profiles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dfe_form_hubs(id) on delete cascade,
  profile_key text not null,
  profile_name text not null default '',
  profile_type text not null default 'standard',
  layout_mode text not null default 'vertical',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, profile_key)
);

-- ThemeConfig
create table if not exists public.dfe_theme_configs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dfe_form_hubs(id) on delete cascade,
  theme_key text not null,
  theme_name text not null default '',
  primary_color text not null default '#d97706',
  theme_mode text not null default 'light',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, theme_key)
);

-- LocalizationPack
create table if not exists public.dfe_localization_packs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dfe_form_hubs(id) on delete cascade,
  locale_key text not null,
  locale_code text not null default 'en-US',
  locale_name text not null default '',
  translation_count integer not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, locale_key)
);

-- SubmissionAnalytics
create table if not exists public.dfe_submission_analytics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dfe_form_hubs(id) on delete cascade,
  analytics_key text not null,
  analytics_type text not null default 'submission',
  analytics_score numeric(5, 2) not null default 0,
  metric_date date not null default current_date,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, analytics_key)
);

-- CompletionMetric
create table if not exists public.dfe_completion_metrics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dfe_form_hubs(id) on delete cascade,
  metric_key text not null,
  metric_name text not null default '',
  completion_rate numeric(5, 2) not null default 0,
  metric_date date not null default current_date,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, metric_key)
);

-- UsageTrend
create table if not exists public.dfe_usage_trends (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dfe_form_hubs(id) on delete cascade,
  trend_key text not null,
  trend_name text not null default '',
  trend_value numeric(12, 2) not null default 0,
  trend_date date not null default current_date,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, trend_key)
);

-- FormMetric
create table if not exists public.dfe_form_metrics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  metrics_key text not null,
  metric_date date not null default current_date,
  submission_count integer not null default 0,
  completion_rate numeric(5, 2) not null default 100,
  average_completion_time_ms integer not null default 0,
  validation_error_count integer not null default 0,
  abandonment_rate numeric(5, 2) not null default 0,
  overall_form_score numeric(5, 2) not null default 100,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, metrics_key)
);

-- FormHealth
create table if not exists public.dfe_form_health (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  health_key text not null,
  health_date date not null default current_date,
  overall_score numeric(5, 2) not null default 100,
  disaster_recovery_mode boolean not null default false,
  pending_reviews_count integer not null default 0,
  active_forms_count integer not null default 0,
  framework_health_status text not null default 'healthy',
  summary text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, health_key)
);

-- PendingReviewItem
create table if not exists public.dfe_pending_review_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dfe_form_hubs(id) on delete cascade,
  item_key text not null,
  item_name text not null default '',
  review_type text not null default 'submission',
  priority text not null default 'normal',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, item_key)
);

-- FormFailure
create table if not exists public.dfe_form_failures (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dfe_form_hubs(id) on delete cascade,
  failure_key text not null,
  failure_type text not null default 'validation',
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
create table if not exists public.dfe_audit_logs (
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

create index if not exists idx_dfe_form_hubs_org on public.dfe_form_hubs(organization_id);
create index if not exists idx_dfe_form_definitions_org on public.dfe_form_definitions(organization_id);
create index if not exists idx_dfe_form_definitions_hub on public.dfe_form_definitions(hub_id);
create index if not exists idx_dfe_form_categories_org on public.dfe_form_categories(organization_id);
create index if not exists idx_dfe_form_categories_hub on public.dfe_form_categories(hub_id);
create index if not exists idx_dfe_form_versions_org on public.dfe_form_versions(organization_id);
create index if not exists idx_dfe_form_versions_hub on public.dfe_form_versions(hub_id);
create index if not exists idx_dfe_form_dependencies_org on public.dfe_form_dependencies(organization_id);
create index if not exists idx_dfe_form_dependencies_hub on public.dfe_form_dependencies(hub_id);
create index if not exists idx_dfe_form_sections_org on public.dfe_form_sections(organization_id);
create index if not exists idx_dfe_form_sections_hub on public.dfe_form_sections(hub_id);
create index if not exists idx_dfe_form_tabs_org on public.dfe_form_tabs(organization_id);
create index if not exists idx_dfe_form_tabs_hub on public.dfe_form_tabs(hub_id);
create index if not exists idx_dfe_form_groups_org on public.dfe_form_groups(organization_id);
create index if not exists idx_dfe_form_groups_hub on public.dfe_form_groups(hub_id);
create index if not exists idx_dfe_repeatable_sections_org on public.dfe_repeatable_sections(organization_id);
create index if not exists idx_dfe_repeatable_sections_hub on public.dfe_repeatable_sections(hub_id);
create index if not exists idx_dfe_form_fields_org on public.dfe_form_fields(organization_id);
create index if not exists idx_dfe_form_fields_hub on public.dfe_form_fields(hub_id);
create index if not exists idx_dfe_field_options_org on public.dfe_field_options(organization_id);
create index if not exists idx_dfe_field_options_hub on public.dfe_field_options(hub_id);
create index if not exists idx_dfe_formula_fields_org on public.dfe_formula_fields(organization_id);
create index if not exists idx_dfe_formula_fields_hub on public.dfe_formula_fields(hub_id);
create index if not exists idx_dfe_media_fields_org on public.dfe_media_fields(organization_id);
create index if not exists idx_dfe_media_fields_hub on public.dfe_media_fields(hub_id);
create index if not exists idx_dfe_required_rules_org on public.dfe_required_rules(organization_id);
create index if not exists idx_dfe_required_rules_hub on public.dfe_required_rules(hub_id);
create index if not exists idx_dfe_regex_rules_org on public.dfe_regex_rules(organization_id);
create index if not exists idx_dfe_regex_rules_hub on public.dfe_regex_rules(hub_id);
create index if not exists idx_dfe_range_rules_org on public.dfe_range_rules(organization_id);
create index if not exists idx_dfe_range_rules_hub on public.dfe_range_rules(hub_id);
create index if not exists idx_dfe_cross_field_rules_org on public.dfe_cross_field_rules(organization_id);
create index if not exists idx_dfe_cross_field_rules_hub on public.dfe_cross_field_rules(hub_id);
create index if not exists idx_dfe_form_drafts_org on public.dfe_form_drafts(organization_id);
create index if not exists idx_dfe_form_drafts_hub on public.dfe_form_drafts(hub_id);
create index if not exists idx_dfe_form_submissions_org on public.dfe_form_submissions(organization_id);
create index if not exists idx_dfe_form_submissions_hub on public.dfe_form_submissions(hub_id);
create index if not exists idx_dfe_form_reviews_org on public.dfe_form_reviews(organization_id);
create index if not exists idx_dfe_form_reviews_hub on public.dfe_form_reviews(hub_id);
create index if not exists idx_dfe_execution_audit_entries_org on public.dfe_execution_audit_entries(organization_id);
create index if not exists idx_dfe_execution_audit_entries_hub on public.dfe_execution_audit_entries(hub_id);
create index if not exists idx_dfe_render_profiles_org on public.dfe_render_profiles(organization_id);
create index if not exists idx_dfe_render_profiles_hub on public.dfe_render_profiles(hub_id);
create index if not exists idx_dfe_theme_configs_org on public.dfe_theme_configs(organization_id);
create index if not exists idx_dfe_theme_configs_hub on public.dfe_theme_configs(hub_id);
create index if not exists idx_dfe_localization_packs_org on public.dfe_localization_packs(organization_id);
create index if not exists idx_dfe_localization_packs_hub on public.dfe_localization_packs(hub_id);
create index if not exists idx_dfe_submission_analytics_org on public.dfe_submission_analytics(organization_id);
create index if not exists idx_dfe_submission_analytics_hub on public.dfe_submission_analytics(hub_id);
create index if not exists idx_dfe_completion_metrics_org on public.dfe_completion_metrics(organization_id);
create index if not exists idx_dfe_completion_metrics_hub on public.dfe_completion_metrics(hub_id);
create index if not exists idx_dfe_usage_trends_org on public.dfe_usage_trends(organization_id);
create index if not exists idx_dfe_usage_trends_hub on public.dfe_usage_trends(hub_id);
create index if not exists idx_dfe_form_metrics_org on public.dfe_form_metrics(organization_id);
create index if not exists idx_dfe_form_health_org on public.dfe_form_health(organization_id);
create index if not exists idx_dfe_pending_review_items_org on public.dfe_pending_review_items(organization_id);
create index if not exists idx_dfe_pending_review_items_hub on public.dfe_pending_review_items(hub_id);
create index if not exists idx_dfe_form_failures_org on public.dfe_form_failures(organization_id);
create index if not exists idx_dfe_form_failures_hub on public.dfe_form_failures(hub_id);
create index if not exists idx_dfe_audit_logs_org on public.dfe_audit_logs(organization_id);

do $$
declare tbl text;
begin
  foreach tbl in array array[
    'dfe_form_hubs','dfe_form_definitions','dfe_form_categories','dfe_form_versions','dfe_form_dependencies','dfe_form_sections','dfe_form_tabs','dfe_form_groups','dfe_repeatable_sections','dfe_form_fields','dfe_field_options','dfe_formula_fields','dfe_media_fields','dfe_required_rules','dfe_regex_rules','dfe_range_rules','dfe_cross_field_rules','dfe_form_drafts','dfe_form_submissions','dfe_form_reviews','dfe_execution_audit_entries','dfe_render_profiles','dfe_theme_configs','dfe_localization_packs','dfe_submission_analytics','dfe_completion_metrics','dfe_usage_trends','dfe_form_metrics','dfe_form_health','dfe_pending_review_items','dfe_form_failures'
  ]
  loop
    execute format('drop trigger if exists trg_%I_updated_at on public.%I', tbl, tbl);
    execute format('create trigger trg_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()', tbl, tbl);
  end loop;
end $$;

alter table public.dfe_form_hubs enable row level security;
alter table public.dfe_form_definitions enable row level security;
alter table public.dfe_form_categories enable row level security;
alter table public.dfe_form_versions enable row level security;
alter table public.dfe_form_dependencies enable row level security;
alter table public.dfe_form_sections enable row level security;
alter table public.dfe_form_tabs enable row level security;
alter table public.dfe_form_groups enable row level security;
alter table public.dfe_repeatable_sections enable row level security;
alter table public.dfe_form_fields enable row level security;
alter table public.dfe_field_options enable row level security;
alter table public.dfe_formula_fields enable row level security;
alter table public.dfe_media_fields enable row level security;
alter table public.dfe_required_rules enable row level security;
alter table public.dfe_regex_rules enable row level security;
alter table public.dfe_range_rules enable row level security;
alter table public.dfe_cross_field_rules enable row level security;
alter table public.dfe_form_drafts enable row level security;
alter table public.dfe_form_submissions enable row level security;
alter table public.dfe_form_reviews enable row level security;
alter table public.dfe_execution_audit_entries enable row level security;
alter table public.dfe_render_profiles enable row level security;
alter table public.dfe_theme_configs enable row level security;
alter table public.dfe_localization_packs enable row level security;
alter table public.dfe_submission_analytics enable row level security;
alter table public.dfe_completion_metrics enable row level security;
alter table public.dfe_usage_trends enable row level security;
alter table public.dfe_form_metrics enable row level security;
alter table public.dfe_form_health enable row level security;
alter table public.dfe_pending_review_items enable row level security;
alter table public.dfe_form_failures enable row level security;
alter table public.dfe_audit_logs enable row level security;

do $$
declare tbl text;
begin
  foreach tbl in array array[
    'dfe_form_hubs','dfe_form_definitions','dfe_form_categories','dfe_form_versions','dfe_form_dependencies','dfe_form_sections','dfe_form_tabs','dfe_form_groups','dfe_repeatable_sections','dfe_form_fields','dfe_field_options','dfe_formula_fields','dfe_media_fields','dfe_required_rules','dfe_regex_rules','dfe_range_rules','dfe_cross_field_rules','dfe_form_drafts','dfe_form_submissions','dfe_form_reviews','dfe_execution_audit_entries','dfe_render_profiles','dfe_theme_configs','dfe_localization_packs','dfe_submission_analytics','dfe_completion_metrics','dfe_usage_trends','dfe_form_metrics','dfe_form_health','dfe_pending_review_items','dfe_form_failures','dfe_audit_logs'
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
  ('dfe.view', 'View enterprise dynamic form engine data', 'enterprise_dynamic_form_engine'),
  ('dfe.manage', 'Manage form registry, builder, validation, execution, and framework outputs', 'enterprise_dynamic_form_engine'),
  ('dfe.approve', 'Approve form reviews and validation gates', 'enterprise_dynamic_form_engine'),
  ('dfe.admin', 'Administer enterprise dynamic form engine governance', 'enterprise_dynamic_form_engine')
on conflict (key) do update set description = excluded.description, resource = excluded.resource;
