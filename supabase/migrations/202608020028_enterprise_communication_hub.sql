-- V2 Program A Sprint 5: Enterprise Customer Communication & Notification Hub

-- M1 Notification Engine
create table if not exists public.cnh_communication_hubs (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_key text not null,
  hub_name text not null,
  default_locale text not null default 'en-US',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_key)
);

create table if not exists public.cnh_notification_channels (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cnh_communication_hubs(id) on delete cascade,
  channel_key text not null,
  channel_name text not null,
  channel_type text not null default 'email',
  provider_config jsonb not null default '{}'::jsonb,
  is_enabled boolean not null default true,
  priority_level text not null default 'normal',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, channel_key)
);

create table if not exists public.cnh_notification_queue (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cnh_communication_hubs(id) on delete cascade,
  queue_key text not null,
  channel_id uuid references public.cnh_notification_channels(id) on delete set null,
  channel_type text not null default 'email',
  recipient text not null,
  subject text not null default '',
  body text not null default '',
  priority_level text not null default 'normal',
  delivery_status text not null default 'pending',
  retry_count integer not null default 0,
  scheduled_at timestamptz not null default now(),
  delivered_at timestamptz,
  failure_reason text not null default '',
  status text not null default 'queued',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, queue_key)
);

create table if not exists public.cnh_retry_policies (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cnh_communication_hubs(id) on delete cascade,
  policy_key text not null,
  policy_name text not null,
  channel_type text not null default 'email',
  max_retries integer not null default 3,
  backoff_seconds integer not null default 60,
  backoff_multiplier numeric(4, 2) not null default 2.0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, policy_key)
);

-- M2 Message Template Center
create table if not exists public.cnh_message_templates (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cnh_communication_hubs(id) on delete cascade,
  template_key text not null,
  template_name text not null,
  channel_type text not null default 'email',
  subject_template text not null default '',
  body_template text not null default '',
  version integer not null default 1,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, template_key)
);

create table if not exists public.cnh_template_variables (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cnh_communication_hubs(id) on delete cascade,
  template_id uuid not null references public.cnh_message_templates(id) on delete cascade,
  variable_key text not null,
  variable_name text not null,
  default_value text not null default '',
  is_required boolean not null default false,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, template_id, variable_key)
);

create table if not exists public.cnh_template_localizations (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cnh_communication_hubs(id) on delete cascade,
  template_id uuid not null references public.cnh_message_templates(id) on delete cascade,
  locale text not null default 'en-US',
  subject_template text not null default '',
  body_template text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, template_id, locale)
);

create table if not exists public.cnh_template_approvals (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cnh_communication_hubs(id) on delete cascade,
  template_id uuid not null references public.cnh_message_templates(id) on delete cascade,
  approval_key text not null,
  approval_status text not null default 'pending',
  approved_by uuid references public.user_profiles(id) on delete set null,
  approved_at timestamptz,
  rejection_reason text not null default '',
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, approval_key)
);

-- M3 Communication Automation
create table if not exists public.cnh_automation_rules (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cnh_communication_hubs(id) on delete cascade,
  rule_key text not null,
  rule_name text not null,
  trigger_type text not null default 'event',
  action_type text not null default 'send_notification',
  priority_level text not null default 'normal',
  is_enabled boolean not null default true,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, rule_key)
);

create table if not exists public.cnh_automation_triggers (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cnh_communication_hubs(id) on delete cascade,
  rule_id uuid not null references public.cnh_automation_rules(id) on delete cascade,
  trigger_key text not null,
  trigger_event text not null,
  conditions jsonb not null default '{}'::jsonb,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, rule_id, trigger_key)
);

create table if not exists public.cnh_automation_schedules (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cnh_communication_hubs(id) on delete cascade,
  rule_id uuid not null references public.cnh_automation_rules(id) on delete cascade,
  schedule_key text not null,
  cron_expression text not null default '0 9 * * *',
  timezone text not null default 'UTC',
  next_run_at timestamptz,
  last_run_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, schedule_key)
);

create table if not exists public.cnh_automation_executions (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cnh_communication_hubs(id) on delete cascade,
  rule_id uuid references public.cnh_automation_rules(id) on delete set null,
  execution_key text not null,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  execution_status text not null default 'running',
  notifications_sent integer not null default 0,
  error_message text not null default '',
  status text not null default 'running',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, execution_key)
);

-- M4 Customer Preference Center
create table if not exists public.cnh_preference_profiles (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cnh_communication_hubs(id) on delete cascade,
  profile_key text not null,
  user_id uuid references public.user_profiles(id) on delete set null,
  customer_email text not null default '',
  preferred_locale text not null default 'en-US',
  timezone text not null default 'UTC',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, profile_key)
);

create table if not exists public.cnh_channel_preferences (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cnh_communication_hubs(id) on delete cascade,
  preference_profile_id uuid not null references public.cnh_preference_profiles(id) on delete cascade,
  channel_type text not null default 'email',
  is_enabled boolean not null default true,
  frequency text not null default 'immediate',
  quiet_hours_start time,
  quiet_hours_end time,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, preference_profile_id, channel_type)
);

create table if not exists public.cnh_opt_in_records (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cnh_communication_hubs(id) on delete cascade,
  preference_profile_id uuid references public.cnh_preference_profiles(id) on delete set null,
  opt_in_key text not null,
  channel_type text not null default 'email',
  source text not null default 'signup',
  opted_in_at timestamptz not null default now(),
  ip_address text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, opt_in_key)
);

create table if not exists public.cnh_opt_out_records (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cnh_communication_hubs(id) on delete cascade,
  preference_profile_id uuid references public.cnh_preference_profiles(id) on delete set null,
  opt_out_key text not null,
  channel_type text not null default 'email',
  reason text not null default '',
  opted_out_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, opt_out_key)
);

-- M5 Announcement Center
create table if not exists public.cnh_announcements (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cnh_communication_hubs(id) on delete cascade,
  announcement_key text not null,
  title text not null,
  content text not null default '',
  channel_type text not null default 'in_app',
  priority_level text not null default 'normal',
  requires_acknowledgement boolean not null default false,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, announcement_key)
);

create table if not exists public.cnh_announcement_schedules (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cnh_communication_hubs(id) on delete cascade,
  announcement_id uuid not null references public.cnh_announcements(id) on delete cascade,
  schedule_key text not null,
  publish_at timestamptz not null default now(),
  expire_at timestamptz,
  status text not null default 'scheduled',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, schedule_key)
);

create table if not exists public.cnh_pinned_announcements (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cnh_communication_hubs(id) on delete cascade,
  announcement_id uuid not null references public.cnh_announcements(id) on delete cascade,
  pin_key text not null,
  pin_order integer not null default 0,
  pinned_at timestamptz not null default now(),
  expires_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, pin_key)
);

create table if not exists public.cnh_announcement_acknowledgements (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cnh_communication_hubs(id) on delete cascade,
  announcement_id uuid not null references public.cnh_announcements(id) on delete cascade,
  acknowledgement_key text not null,
  user_id uuid references public.user_profiles(id) on delete set null,
  acknowledged_at timestamptz not null default now(),
  status text not null default 'acknowledged',
  created_at timestamptz not null default now(),
  unique (organization_id, hub_id, acknowledgement_key)
);

-- M6 Campaign Management
create table if not exists public.cnh_campaigns (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cnh_communication_hubs(id) on delete cascade,
  campaign_key text not null,
  campaign_name text not null,
  channel_type text not null default 'email',
  template_id uuid references public.cnh_message_templates(id) on delete set null,
  priority_level text not null default 'normal',
  starts_at timestamptz,
  ends_at timestamptz,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, campaign_key)
);

create table if not exists public.cnh_audience_segments (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cnh_communication_hubs(id) on delete cascade,
  campaign_id uuid references public.cnh_campaigns(id) on delete set null,
  segment_key text not null,
  segment_name text not null,
  criteria jsonb not null default '{}'::jsonb,
  estimated_size integer not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, segment_key)
);

create table if not exists public.cnh_campaign_deliveries (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cnh_communication_hubs(id) on delete cascade,
  campaign_id uuid not null references public.cnh_campaigns(id) on delete cascade,
  delivery_key text not null,
  recipient text not null,
  channel_type text not null default 'email',
  delivery_status text not null default 'pending',
  sent_at timestamptz,
  delivered_at timestamptz,
  opened_at timestamptz,
  clicked_at timestamptz,
  retry_count integer not null default 0,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, delivery_key)
);

create table if not exists public.cnh_campaign_metrics (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cnh_communication_hubs(id) on delete cascade,
  campaign_id uuid not null references public.cnh_campaigns(id) on delete cascade,
  metrics_key text not null,
  metric_date date not null default current_date,
  sent_count integer not null default 0,
  delivered_count integer not null default 0,
  open_rate numeric(5, 2) not null default 0,
  click_rate numeric(5, 2) not null default 0,
  bounce_rate numeric(5, 2) not null default 0,
  unsubscribe_rate numeric(5, 2) not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, campaign_id, metrics_key)
);

-- M7 Delivery Analytics
create table if not exists public.cnh_delivery_analytics (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cnh_communication_hubs(id) on delete cascade,
  analytics_key text not null,
  metric_date date not null default current_date,
  channel_type text not null default 'email',
  total_sent integer not null default 0,
  total_delivered integer not null default 0,
  total_failed integer not null default 0,
  delivery_rate numeric(5, 2) not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, analytics_key)
);

create table if not exists public.cnh_engagement_metrics (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cnh_communication_hubs(id) on delete cascade,
  metrics_key text not null,
  metric_date date not null default current_date,
  channel_type text not null default 'email',
  open_rate numeric(5, 2) not null default 0,
  click_rate numeric(5, 2) not null default 0,
  unsubscribe_rate numeric(5, 2) not null default 0,
  engagement_score numeric(5, 2) not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, metrics_key)
);

create table if not exists public.cnh_bounce_records (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cnh_communication_hubs(id) on delete cascade,
  bounce_key text not null,
  channel_type text not null default 'email',
  recipient text not null,
  bounce_type text not null default 'hard',
  bounce_reason text not null default '',
  bounced_at timestamptz not null default now(),
  retry_count integer not null default 0,
  status text not null default 'recorded',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, bounce_key)
);

create table if not exists public.cnh_channel_performance (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cnh_communication_hubs(id) on delete cascade,
  performance_key text not null,
  metric_date date not null default current_date,
  channel_type text not null default 'email',
  delivery_rate numeric(5, 2) not null default 0,
  open_rate numeric(5, 2) not null default 0,
  click_rate numeric(5, 2) not null default 0,
  avg_latency_ms integer not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, performance_key)
);

-- M8 Communication Ops Dashboard
create table if not exists public.cnh_communication_metrics (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  metrics_key text not null,
  metric_date date not null default current_date,
  total_sent integer not null default 0,
  total_delivered integer not null default 0,
  total_failed integer not null default 0,
  delivery_rate numeric(5, 2) not null default 0,
  open_rate numeric(5, 2) not null default 0,
  click_rate numeric(5, 2) not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, metrics_key)
);

create table if not exists public.cnh_system_health (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  health_key text not null,
  health_date date not null default current_date,
  overall_score numeric(5, 2) not null default 0,
  uptime_percent numeric(5, 2) not null default 100,
  queue_depth integer not null default 0,
  avg_delivery_latency_ms integer not null default 0,
  disaster_recovery_mode boolean not null default false,
  summary text not null default '',
  status text not null default 'healthy',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, health_key)
);

create table if not exists public.cnh_delivery_failures (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cnh_communication_hubs(id) on delete cascade,
  failure_key text not null,
  channel_type text not null default 'email',
  recipient text not null default '',
  error_code text not null default '',
  error_message text not null default '',
  retry_count integer not null default 0,
  failed_at timestamptz not null default now(),
  resolved_at timestamptz,
  status text not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, failure_key)
);

create table if not exists public.cnh_audit_logs (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  entity_type text not null,
  entity_id uuid,
  action text not null,
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  performed_by uuid references public.user_profiles(id) on delete set null,
  security_level text not null default 'standard',
  created_at timestamptz not null default now()
);

-- indexes
create index if not exists idx_cnh_communication_hubs_org on public.cnh_communication_hubs(organization_id);
create index if not exists idx_cnh_notification_channels_org on public.cnh_notification_channels(organization_id);
create index if not exists idx_cnh_notification_channels_hub on public.cnh_notification_channels(hub_id);
create index if not exists idx_cnh_notification_queue_org on public.cnh_notification_queue(organization_id);
create index if not exists idx_cnh_notification_queue_hub on public.cnh_notification_queue(hub_id);
create index if not exists idx_cnh_notification_queue_status on public.cnh_notification_queue(delivery_status);
create index if not exists idx_cnh_retry_policies_org on public.cnh_retry_policies(organization_id);
create index if not exists idx_cnh_retry_policies_hub on public.cnh_retry_policies(hub_id);
create index if not exists idx_cnh_message_templates_org on public.cnh_message_templates(organization_id);
create index if not exists idx_cnh_message_templates_hub on public.cnh_message_templates(hub_id);
create index if not exists idx_cnh_template_variables_org on public.cnh_template_variables(organization_id);
create index if not exists idx_cnh_template_variables_hub on public.cnh_template_variables(hub_id);
create index if not exists idx_cnh_template_localizations_org on public.cnh_template_localizations(organization_id);
create index if not exists idx_cnh_template_localizations_hub on public.cnh_template_localizations(hub_id);
create index if not exists idx_cnh_template_approvals_org on public.cnh_template_approvals(organization_id);
create index if not exists idx_cnh_template_approvals_hub on public.cnh_template_approvals(hub_id);
create index if not exists idx_cnh_automation_rules_org on public.cnh_automation_rules(organization_id);
create index if not exists idx_cnh_automation_rules_hub on public.cnh_automation_rules(hub_id);
create index if not exists idx_cnh_automation_triggers_org on public.cnh_automation_triggers(organization_id);
create index if not exists idx_cnh_automation_triggers_hub on public.cnh_automation_triggers(hub_id);
create index if not exists idx_cnh_automation_schedules_org on public.cnh_automation_schedules(organization_id);
create index if not exists idx_cnh_automation_schedules_hub on public.cnh_automation_schedules(hub_id);
create index if not exists idx_cnh_automation_executions_org on public.cnh_automation_executions(organization_id);
create index if not exists idx_cnh_automation_executions_hub on public.cnh_automation_executions(hub_id);
create index if not exists idx_cnh_preference_profiles_org on public.cnh_preference_profiles(organization_id);
create index if not exists idx_cnh_preference_profiles_hub on public.cnh_preference_profiles(hub_id);
create index if not exists idx_cnh_channel_preferences_org on public.cnh_channel_preferences(organization_id);
create index if not exists idx_cnh_channel_preferences_hub on public.cnh_channel_preferences(hub_id);
create index if not exists idx_cnh_opt_in_records_org on public.cnh_opt_in_records(organization_id);
create index if not exists idx_cnh_opt_in_records_hub on public.cnh_opt_in_records(hub_id);
create index if not exists idx_cnh_opt_out_records_org on public.cnh_opt_out_records(organization_id);
create index if not exists idx_cnh_opt_out_records_hub on public.cnh_opt_out_records(hub_id);
create index if not exists idx_cnh_announcements_org on public.cnh_announcements(organization_id);
create index if not exists idx_cnh_announcements_hub on public.cnh_announcements(hub_id);
create index if not exists idx_cnh_announcement_schedules_org on public.cnh_announcement_schedules(organization_id);
create index if not exists idx_cnh_announcement_schedules_hub on public.cnh_announcement_schedules(hub_id);
create index if not exists idx_cnh_pinned_announcements_org on public.cnh_pinned_announcements(organization_id);
create index if not exists idx_cnh_pinned_announcements_hub on public.cnh_pinned_announcements(hub_id);
create index if not exists idx_cnh_announcement_acknowledgements_org on public.cnh_announcement_acknowledgements(organization_id);
create index if not exists idx_cnh_announcement_acknowledgements_hub on public.cnh_announcement_acknowledgements(hub_id);
create index if not exists idx_cnh_campaigns_org on public.cnh_campaigns(organization_id);
create index if not exists idx_cnh_campaigns_hub on public.cnh_campaigns(hub_id);
create index if not exists idx_cnh_audience_segments_org on public.cnh_audience_segments(organization_id);
create index if not exists idx_cnh_audience_segments_hub on public.cnh_audience_segments(hub_id);
create index if not exists idx_cnh_campaign_deliveries_org on public.cnh_campaign_deliveries(organization_id);
create index if not exists idx_cnh_campaign_deliveries_hub on public.cnh_campaign_deliveries(hub_id);
create index if not exists idx_cnh_campaign_metrics_org on public.cnh_campaign_metrics(organization_id);
create index if not exists idx_cnh_campaign_metrics_hub on public.cnh_campaign_metrics(hub_id);
create index if not exists idx_cnh_delivery_analytics_org on public.cnh_delivery_analytics(organization_id);
create index if not exists idx_cnh_delivery_analytics_hub on public.cnh_delivery_analytics(hub_id);
create index if not exists idx_cnh_engagement_metrics_org on public.cnh_engagement_metrics(organization_id);
create index if not exists idx_cnh_engagement_metrics_hub on public.cnh_engagement_metrics(hub_id);
create index if not exists idx_cnh_bounce_records_org on public.cnh_bounce_records(organization_id);
create index if not exists idx_cnh_bounce_records_hub on public.cnh_bounce_records(hub_id);
create index if not exists idx_cnh_channel_performance_org on public.cnh_channel_performance(organization_id);
create index if not exists idx_cnh_channel_performance_hub on public.cnh_channel_performance(hub_id);
create index if not exists idx_cnh_communication_metrics_org on public.cnh_communication_metrics(organization_id);
create index if not exists idx_cnh_system_health_org on public.cnh_system_health(organization_id);
create index if not exists idx_cnh_delivery_failures_org on public.cnh_delivery_failures(organization_id);
create index if not exists idx_cnh_delivery_failures_hub on public.cnh_delivery_failures(hub_id);
create index if not exists idx_cnh_audit_logs_org on public.cnh_audit_logs(organization_id);

-- updated_at triggers
do $$
declare tbl text;
begin
  foreach tbl in array array[
    'cnh_communication_hubs','cnh_notification_channels','cnh_notification_queue','cnh_retry_policies',
    'cnh_message_templates','cnh_template_variables','cnh_template_localizations','cnh_template_approvals',
    'cnh_automation_rules','cnh_automation_triggers','cnh_automation_schedules','cnh_automation_executions',
    'cnh_preference_profiles','cnh_channel_preferences','cnh_opt_in_records','cnh_opt_out_records',
    'cnh_announcements','cnh_announcement_schedules','cnh_pinned_announcements',
    'cnh_campaigns','cnh_audience_segments','cnh_campaign_deliveries','cnh_campaign_metrics',
    'cnh_delivery_analytics','cnh_engagement_metrics','cnh_bounce_records','cnh_channel_performance',
    'cnh_communication_metrics','cnh_system_health','cnh_delivery_failures'
  ]
  loop
    execute format('drop trigger if exists trg_%I_updated_at on public.%I', tbl, tbl);
    execute format('create trigger trg_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()', tbl, tbl);
  end loop;
end $$;

-- RLS
alter table public.cnh_communication_hubs enable row level security;
alter table public.cnh_notification_channels enable row level security;
alter table public.cnh_notification_queue enable row level security;
alter table public.cnh_retry_policies enable row level security;
alter table public.cnh_message_templates enable row level security;
alter table public.cnh_template_variables enable row level security;
alter table public.cnh_template_localizations enable row level security;
alter table public.cnh_template_approvals enable row level security;
alter table public.cnh_automation_rules enable row level security;
alter table public.cnh_automation_triggers enable row level security;
alter table public.cnh_automation_schedules enable row level security;
alter table public.cnh_automation_executions enable row level security;
alter table public.cnh_preference_profiles enable row level security;
alter table public.cnh_channel_preferences enable row level security;
alter table public.cnh_opt_in_records enable row level security;
alter table public.cnh_opt_out_records enable row level security;
alter table public.cnh_announcements enable row level security;
alter table public.cnh_announcement_schedules enable row level security;
alter table public.cnh_pinned_announcements enable row level security;
alter table public.cnh_announcement_acknowledgements enable row level security;
alter table public.cnh_campaigns enable row level security;
alter table public.cnh_audience_segments enable row level security;
alter table public.cnh_campaign_deliveries enable row level security;
alter table public.cnh_campaign_metrics enable row level security;
alter table public.cnh_delivery_analytics enable row level security;
alter table public.cnh_engagement_metrics enable row level security;
alter table public.cnh_bounce_records enable row level security;
alter table public.cnh_channel_performance enable row level security;
alter table public.cnh_communication_metrics enable row level security;
alter table public.cnh_system_health enable row level security;
alter table public.cnh_delivery_failures enable row level security;
alter table public.cnh_audit_logs enable row level security;

do $$
declare tbl text;
begin
  foreach tbl in array array[
    'cnh_communication_hubs','cnh_notification_channels','cnh_notification_queue','cnh_retry_policies',
    'cnh_message_templates','cnh_template_variables','cnh_template_localizations','cnh_template_approvals',
    'cnh_automation_rules','cnh_automation_triggers','cnh_automation_schedules','cnh_automation_executions',
    'cnh_preference_profiles','cnh_channel_preferences','cnh_opt_in_records','cnh_opt_out_records',
    'cnh_announcements','cnh_announcement_schedules','cnh_pinned_announcements','cnh_announcement_acknowledgements',
    'cnh_campaigns','cnh_audience_segments','cnh_campaign_deliveries','cnh_campaign_metrics',
    'cnh_delivery_analytics','cnh_engagement_metrics','cnh_bounce_records','cnh_channel_performance',
    'cnh_communication_metrics','cnh_system_health','cnh_delivery_failures','cnh_audit_logs'
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
  ('cnh.view', 'View enterprise communication and notification hub data', 'enterprise_communication_hub'),
  ('cnh.manage', 'Manage channels, templates, campaigns, and notification delivery', 'enterprise_communication_hub'),
  ('cnh.approve', 'Approve message templates and campaign communications', 'enterprise_communication_hub'),
  ('cnh.admin', 'Administer enterprise communication hub governance and configuration', 'enterprise_communication_hub')
on conflict (key) do update set description = excluded.description, resource = excluded.resource;
