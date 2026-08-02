insert into public.organization_settings (id, organization_id, timezone, currency, fiscal_year_start, contact_email, billing_address, support_phone, feature_flags)
values
  ('5a5a5a5a-5a5a-5a5a-5a5a-5a5a5a5a5a01', '11111111-1111-1111-1111-111111111111', 'America/Los_Angeles', 'USD', '01-01', 'admin@acme.example', '100 Enterprise Way, San Francisco, CA', '+1 415 555 0100', '{"automation":true,"analytics":true,"finance":true}'::jsonb)
on conflict (organization_id) do nothing;

insert into public.organization_branding (id, organization_id, logo_url, favicon_url, primary_color, secondary_color, accent_color, custom_domain, email_header_html)
values
  ('5b5b5b5b-5b5b-5b5b-5b5b-5b5b5b5b5b01', '11111111-1111-1111-1111-111111111111', 'https://acme.example/logo.svg', 'https://acme.example/favicon.ico', '#10b981', '#0f172a', '#3b82f6', 'app.acme.example', '<h1>Acme Enterprise</h1>')
on conflict (organization_id) do nothing;

insert into public.organization_preferences (id, organization_id, default_locale, default_timezone, week_starts_on, date_format, time_format)
values
  ('5c5c5c5c-5c5c-5c5c-5c5c-5c5c5c5c5c01', '11111111-1111-1111-1111-111111111111', 'en', 'America/Los_Angeles', 'monday', 'YYYY-MM-DD', '24h')
on conflict (organization_id) do nothing;

insert into public.organization_security_policies (id, organization_id, mfa_required, session_timeout_minutes, password_min_length, ip_allowlist, login_attempt_limit)
values
  ('5d5d5d5d-5d5d-5d5d-5d5d-5d5d5d5d5d01', '11111111-1111-1111-1111-111111111111', true, 480, 12, '["203.0.113.0/24"]'::jsonb, 5)
on conflict (organization_id) do nothing;

insert into public.teams (id, organization_id, name, slug, description)
values
  ('5e5e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e01', '11111111-1111-1111-1111-111111111111', 'Platform Engineering', 'platform-engineering', 'Core platform and infrastructure delivery'),
  ('5e5e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e02', '11111111-1111-1111-1111-111111111111', 'Customer Success', 'customer-success', 'Client onboarding and account management')
on conflict (id) do nothing;

insert into public.organization_invitations (id, organization_id, email, role_name, status, expires_at)
values
  ('5f5f5f5f-5f5f-5f5f-5f5f-5f5f5f5f5f01', '11111111-1111-1111-1111-111111111111', 'ops.lead@acme.example', 'member', 'pending', '2026-09-01 00:00:00+00'),
  ('5f5f5f5f-5f5f-5f5f-5f5f-5f5f5f5f5f02', '11111111-1111-1111-1111-111111111111', 'finance.admin@acme.example', 'super_admin', 'accepted', '2026-08-15 00:00:00+00')
on conflict (id) do nothing;

insert into public.audit_config (id, organization_id, retention_days, enabled_events, export_format, alert_threshold)
values
  ('6a6a6a6a-6a6a-6a6a-6a6a-6a6a6a6a6a01', '11111111-1111-1111-1111-111111111111', 365, array['create','update','delete','login','export'], 'json', 100)
on conflict (organization_id) do nothing;

insert into public.api_keys (id, organization_id, name, key_prefix, key_hash, scopes, status, expires_at, last_used_at)
values
  ('6b6b6b6b-6b6b-6b6b-6b6b-6b6b6b6b6b01', '11111111-1111-1111-1111-111111111111', 'Production Integration', 'aao_live_', 'sha256:demo_hash_production', '["clients.read","projects.read","finance.read"]'::jsonb, 'active', '2027-08-01 00:00:00+00', '2026-08-02 10:00:00+00'),
  ('6b6b6b6b-6b6b-6b6b-6b6b-6b6b6b6b6b02', '11111111-1111-1111-1111-111111111111', 'Automation Webhook', 'aao_hook_', 'sha256:demo_hash_webhook', '["automation.write","workflows.execute"]'::jsonb, 'active', null, '2026-08-01 18:30:00+00')
on conflict (id) do nothing;

insert into public.notification_preferences (id, organization_id, user_id, channel, event_type, enabled)
values
  ('6c6c6c6c-6c6c-6c6c-6c6c-6c6c6c6c6c01', '11111111-1111-1111-1111-111111111111', null, 'email', 'invoice.overdue', true),
  ('6c6c6c6c-6c6c-6c6c-6c6c-6c6c6c6c6c02', '11111111-1111-1111-1111-111111111111', null, 'in_app', 'workflow.failed', true),
  ('6c6c6c6c-6c6c-6c6c-6c6c-6c6c6c6c6c03', '11111111-1111-1111-1111-111111111111', null, 'email', 'backup.completed', false)
on conflict (id) do nothing;

insert into public.backup_configs (id, organization_id, name, schedule_cron, destination, retention_count, include_tables, is_enabled)
values
  ('6d6d6d6d-6d6d-6d6d-6d6d-6d6d6d6d6d01', '11111111-1111-1111-1111-111111111111', 'Weekly Full Backup', '0 2 * * 0', 'supabase', 7, '["clients","projects","invoices","workflows"]'::jsonb, true)
on conflict (id) do nothing;

insert into public.backup_runs (id, config_id, status, started_at, completed_at, size_bytes, storage_path, error_message)
values
  ('6e6e6e6e-6e6e-6e6e-6e6e-6e6e6e6e6e01', '6d6d6d6d-6d6d-6d6d-6d6d-6d6d6d6d6d01', 'completed', '2026-07-28 02:00:00+00', '2026-07-28 02:04:30+00', 52428800, 'backups/acme/2026-07-28-full.sql.gz', ''),
  ('6e6e6e6e-6e6e-6e6e-6e6e-6e6e6e6e6e02', '6d6d6d6d-6d6d-6d6d-6d6d-6d6d6d6d6d01', 'failed', '2026-08-04 02:00:00+00', '2026-08-04 02:01:10+00', 0, '', 'Destination timeout')
on conflict (id) do nothing;
