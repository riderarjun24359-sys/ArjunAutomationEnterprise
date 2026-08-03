insert into public.ai_orchestration_agents (id, organization_id, name, agent_type, workflow_agent_id, provider_id, model_route_id, capabilities, status)
values
  ('a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a328', '11111111-1111-1111-1111-111111111111', 'Enterprise Communication Hub Orchestrator', 'enterprise_communication_hub', null, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a201', '["notification_engine","message_template_center","communication_automation","customer_preference_center","announcement_center","campaign_management","delivery_analytics","communication_ops_dashboard"]'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.ai_sessions (id, organization_id, agent_id, session_key, module_source, entity_type, entity_id, context, status, expires_at)
values
  ('a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a528', '11111111-1111-1111-1111-111111111111', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a328', 'northstar-comms-001', 'enterprise_communication_hub', 'communication_hub', 'ee01ee01-ee01-ee01-ee01-ee01ee010101', '{"objective":"enterprise communication and notification hub for northstar-comms hub"}'::jsonb, 'active', '2026-12-31 23:59:59+00')
on conflict (id) do nothing;

-- M1 Notification Engine
insert into public.cnh_communication_hubs (id, organization_id, hub_key, hub_name, default_locale, status)
values
  ('ee01ee01-ee01-ee01-ee01-ee01ee010101', '11111111-1111-1111-1111-111111111111', 'northstar-comms', 'Northstar Communication Hub', 'en-US', 'active')
on conflict (id) do nothing;

insert into public.cnh_notification_channels (id, organization_id, hub_id, channel_key, channel_name, channel_type, provider_config, is_enabled, priority_level, status)
values
  ('ee02ee02-ee02-ee02-ee02-ee02ee020201', '11111111-1111-1111-1111-111111111111', 'ee01ee01-ee01-ee01-ee01-ee01ee010101', 'email-primary', 'Primary Email Channel', 'email', '{"provider":"sendgrid","from":"noreply@northstar.example"}'::jsonb, true, 'normal', 'active'),
  ('ee02ee02-ee02-ee02-ee02-ee02ee020202', '11111111-1111-1111-1111-111111111111', 'ee01ee01-ee01-ee01-ee01-ee01ee010101', 'in-app-default', 'In-App Notifications', 'in_app', '{"badge_enabled":true}'::jsonb, true, 'high', 'active')
on conflict (id) do nothing;

insert into public.cnh_notification_queue (id, organization_id, hub_id, queue_key, channel_id, channel_type, recipient, subject, body, priority_level, delivery_status, retry_count, scheduled_at, delivered_at, failure_reason, status)
values
  ('ee03ee03-ee03-ee03-ee03-ee03ee030301', '11111111-1111-1111-1111-111111111111', 'ee01ee01-ee01-ee01-ee01-ee01ee010101', 'notif-welcome-delivered', 'ee02ee02-ee02-ee02-ee02-ee02ee020201', 'email', 'customer@northstar.example', 'Welcome to Northstar', 'Thank you for joining Northstar. Your account is ready.', 'normal', 'delivered', 0, '2026-08-02 09:00:00+00', '2026-08-02 09:00:05+00', '', 'completed'),
  ('ee03ee03-ee03-ee03-ee03-ee03ee030302', '11111111-1111-1111-1111-111111111111', 'ee01ee01-ee01-ee01-ee01-ee01ee010101', 'notif-alert-failed', 'ee02ee02-ee02-ee02-ee02-ee02ee020201', 'email', 'invalid@bounce.example', 'Account Alert', 'Your account requires attention.', 'high', 'failed', 3, '2026-08-02 10:00:00+00', null, '550 5.1.1 User unknown', 'failed')
on conflict (id) do nothing;

insert into public.cnh_retry_policies (id, organization_id, hub_id, policy_key, policy_name, channel_type, max_retries, backoff_seconds, backoff_multiplier, status)
values
  ('ee04ee04-ee04-ee04-ee04-ee04ee040401', '11111111-1111-1111-1111-111111111111', 'ee01ee01-ee01-ee01-ee01-ee01ee010101', 'retry-email-standard', 'Standard Email Retry', 'email', 3, 60, 2.0, 'active')
on conflict (id) do nothing;

-- M2 Message Template Center
insert into public.cnh_message_templates (id, organization_id, hub_id, template_key, template_name, channel_type, subject_template, body_template, version, status)
values
  ('ee05ee05-ee05-ee05-ee05-ee05ee050501', '11111111-1111-1111-1111-111111111111', 'ee01ee01-ee01-ee01-ee01-ee01ee010101', 'tpl-welcome-email', 'Welcome Email Template', 'email', 'Welcome to {{company_name}}', 'Hello {{first_name}}, welcome aboard!', 1, 'approved')
on conflict (id) do nothing;

insert into public.cnh_template_variables (id, organization_id, hub_id, template_id, variable_key, variable_name, default_value, is_required, status)
values
  ('ee06ee06-ee06-ee06-ee06-ee06ee060601', '11111111-1111-1111-1111-111111111111', 'ee01ee01-ee01-ee01-ee01-ee01ee010101', 'ee05ee05-ee05-ee05-ee05-ee05ee050501', 'var-first-name', 'first_name', '', true, 'active'),
  ('ee06ee06-ee06-ee06-ee06-ee06ee060602', '11111111-1111-1111-1111-111111111111', 'ee01ee01-ee01-ee01-ee01-ee01ee010101', 'ee05ee05-ee05-ee05-ee05-ee05ee050501', 'var-company-name', 'company_name', 'Northstar', true, 'active')
on conflict (id) do nothing;

insert into public.cnh_template_localizations (id, organization_id, hub_id, template_id, locale, subject_template, body_template, status)
values
  ('ee07ee07-ee07-ee07-ee07-ee07ee070701', '11111111-1111-1111-1111-111111111111', 'ee01ee01-ee01-ee01-ee01-ee01ee010101', 'ee05ee05-ee05-ee05-ee05-ee05ee050501', 'es-MX', 'Bienvenido a {{company_name}}', 'Hola {{first_name}}, ¡bienvenido!', 'active')
on conflict (id) do nothing;

insert into public.cnh_template_approvals (id, organization_id, hub_id, template_id, approval_key, approval_status, approved_at, status)
values
  ('ee08ee08-ee08-ee08-ee08-ee08ee080801', '11111111-1111-1111-1111-111111111111', 'ee01ee01-ee01-ee01-ee01-ee01ee010101', 'ee05ee05-ee05-ee05-ee05-ee05ee050501', 'approval-welcome-v1', 'approved', '2026-08-01 14:00:00+00', 'approved')
on conflict (id) do nothing;

-- M3 Communication Automation
insert into public.cnh_automation_rules (id, organization_id, hub_id, rule_key, rule_name, trigger_type, action_type, priority_level, is_enabled, status)
values
  ('ee09ee09-ee09-ee09-ee09-ee09ee090901', '11111111-1111-1111-1111-111111111111', 'ee01ee01-ee01-ee01-ee01-ee01ee010101', 'rule-onboarding-welcome', 'Onboarding Welcome Rule', 'event', 'send_notification', 'normal', true, 'active')
on conflict (id) do nothing;

insert into public.cnh_automation_triggers (id, organization_id, hub_id, rule_id, trigger_key, trigger_event, conditions, status)
values
  ('ee10ee10-ee10-ee10-ee10-ee10ee101001', '11111111-1111-1111-1111-111111111111', 'ee01ee01-ee01-ee01-ee01-ee01ee010101', 'ee09ee09-ee09-ee09-ee09-ee09ee090901', 'trigger-user-signup', 'user.signup.completed', '{"plan":"any"}'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.cnh_automation_schedules (id, organization_id, hub_id, rule_id, schedule_key, cron_expression, timezone, next_run_at, status)
values
  ('ee11ee11-ee11-ee11-ee11-ee11ee111101', '11111111-1111-1111-1111-111111111111', 'ee01ee01-ee01-ee01-ee01-ee01ee010101', 'ee09ee09-ee09-ee09-ee09-ee09ee090901', 'schedule-daily-digest', '0 9 * * *', 'America/Los_Angeles', '2026-08-03 16:00:00+00', 'active')
on conflict (id) do nothing;

insert into public.cnh_automation_executions (id, organization_id, hub_id, rule_id, execution_key, started_at, completed_at, execution_status, notifications_sent, status)
values
  ('ee12ee12-ee12-ee12-ee12-ee12ee121201', '11111111-1111-1111-1111-111111111111', 'ee01ee01-ee01-ee01-ee01-ee01ee010101', 'ee09ee09-ee09-ee09-ee09-ee09ee090901', 'exec-welcome-0802', '2026-08-02 09:00:00+00', '2026-08-02 09:00:06+00', 'completed', 1, 'completed')
on conflict (id) do nothing;

-- M4 Customer Preference Center
insert into public.cnh_preference_profiles (id, organization_id, hub_id, profile_key, customer_email, preferred_locale, timezone, status)
values
  ('ee13ee13-ee13-ee13-ee13-ee13ee131301', '11111111-1111-1111-1111-111111111111', 'ee01ee01-ee01-ee01-ee01-ee01ee010101', 'pref-customer-demo', 'customer@northstar.example', 'en-US', 'America/Los_Angeles', 'active')
on conflict (id) do nothing;

insert into public.cnh_channel_preferences (id, organization_id, hub_id, preference_profile_id, channel_type, is_enabled, frequency, status)
values
  ('ee14ee14-ee14-ee14-ee14-ee14ee141401', '11111111-1111-1111-1111-111111111111', 'ee01ee01-ee01-ee01-ee01-ee01ee010101', 'ee13ee13-ee13-ee13-ee13-ee13ee131301', 'email', true, 'immediate', 'active'),
  ('ee14ee14-ee14-ee14-ee14-ee14ee141402', '11111111-1111-1111-1111-111111111111', 'ee01ee01-ee01-ee01-ee01-ee01ee010101', 'ee13ee13-ee13-ee13-ee13-ee13ee131301', 'sms', false, 'never', 'active')
on conflict (id) do nothing;

insert into public.cnh_opt_in_records (id, organization_id, hub_id, preference_profile_id, opt_in_key, channel_type, source, opted_in_at, status)
values
  ('ee15ee15-ee15-ee15-ee15-ee15ee151501', '11111111-1111-1111-1111-111111111111', 'ee01ee01-ee01-ee01-ee01-ee01ee010101', 'ee13ee13-ee13-ee13-ee13-ee13ee131301', 'optin-email-signup', 'email', 'signup', '2026-08-01 12:00:00+00', 'active')
on conflict (id) do nothing;

insert into public.cnh_opt_out_records (id, organization_id, hub_id, preference_profile_id, opt_out_key, channel_type, reason, opted_out_at, status)
values
  ('ee16ee16-ee16-ee16-ee16-ee16ee161601', '11111111-1111-1111-1111-111111111111', 'ee01ee01-ee01-ee01-ee01-ee01ee010101', 'ee13ee13-ee13-ee13-ee13-ee13ee131301', 'optout-sms-marketing', 'sms', 'User opted out of SMS marketing', '2026-08-01 12:05:00+00', 'active')
on conflict (id) do nothing;

-- M5 Announcement Center
insert into public.cnh_announcements (id, organization_id, hub_id, announcement_key, title, content, channel_type, priority_level, requires_acknowledgement, status)
values
  ('ee17ee17-ee17-ee17-ee17-ee17ee171701', '11111111-1111-1111-1111-111111111111', 'ee01ee01-ee01-ee01-ee01-ee01ee010101', 'announce-maintenance-aug', 'Scheduled Maintenance — Aug 10', 'Platform maintenance window on August 10, 2026 from 02:00–04:00 UTC.', 'in_app', 'high', true, 'published')
on conflict (id) do nothing;

insert into public.cnh_announcement_schedules (id, organization_id, hub_id, announcement_id, schedule_key, publish_at, expire_at, status)
values
  ('ee18ee18-ee18-ee18-ee18-ee18ee181801', '11111111-1111-1111-1111-111111111111', 'ee01ee01-ee01-ee01-ee01-ee01ee010101', 'ee17ee17-ee17-ee17-ee17-ee17ee171701', 'schedule-maintenance-aug', '2026-08-02 08:00:00+00', '2026-08-10 06:00:00+00', 'published')
on conflict (id) do nothing;

insert into public.cnh_pinned_announcements (id, organization_id, hub_id, announcement_id, pin_key, pin_order, pinned_at, expires_at, status)
values
  ('ee19ee19-ee19-ee19-ee19-ee19ee191901', '11111111-1111-1111-1111-111111111111', 'ee01ee01-ee01-ee01-ee01-ee01ee010101', 'ee17ee17-ee17-ee17-ee17-ee17ee171701', 'pin-maintenance-aug', 1, '2026-08-02 08:00:00+00', '2026-08-10 06:00:00+00', 'active')
on conflict (id) do nothing;

insert into public.cnh_announcement_acknowledgements (id, organization_id, hub_id, announcement_id, acknowledgement_key, acknowledged_at, status)
values
  ('ee20ee20-ee20-ee20-ee20-ee20ee202001', '11111111-1111-1111-1111-111111111111', 'ee01ee01-ee01-ee01-ee01-ee01ee010101', 'ee17ee17-ee17-ee17-ee17-ee17ee171701', 'ack-maintenance-demo', '2026-08-02 09:30:00+00', 'acknowledged')
on conflict (id) do nothing;

-- M6 Campaign Management
insert into public.cnh_campaigns (id, organization_id, hub_id, campaign_key, campaign_name, channel_type, template_id, priority_level, starts_at, ends_at, status)
values
  ('ee21ee21-ee21-ee21-ee21-ee21ee212101', '11111111-1111-1111-1111-111111111111', 'ee01ee01-ee01-ee01-ee01-ee01ee010101', 'campaign-onboarding-aug', 'August Onboarding Campaign', 'email', 'ee05ee05-ee05-ee05-ee05-ee05ee050501', 'normal', '2026-08-01 00:00:00+00', '2026-08-31 23:59:59+00', 'active')
on conflict (id) do nothing;

insert into public.cnh_audience_segments (id, organization_id, hub_id, campaign_id, segment_key, segment_name, criteria, estimated_size, status)
values
  ('ee22ee22-ee22-ee22-ee22-ee22ee222201', '11111111-1111-1111-1111-111111111111', 'ee01ee01-ee01-ee01-ee01-ee01ee010101', 'ee21ee21-ee21-ee21-ee21-ee21ee212101', 'segment-new-signups', 'New Signups — Last 7 Days', '{"signup_days_lte":7,"plan":"starter"}'::jsonb, 42, 'active')
on conflict (id) do nothing;

insert into public.cnh_campaign_deliveries (id, organization_id, hub_id, campaign_id, delivery_key, recipient, channel_type, delivery_status, sent_at, delivered_at, opened_at, retry_count, status)
values
  ('ee23ee23-ee23-ee23-ee23-ee23ee232301', '11111111-1111-1111-1111-111111111111', 'ee01ee01-ee01-ee01-ee01-ee01ee010101', 'ee21ee21-ee21-ee21-ee21-ee21ee212101', 'delivery-welcome-001', 'customer@northstar.example', 'email', 'delivered', '2026-08-02 09:00:00+00', '2026-08-02 09:00:05+00', '2026-08-02 09:15:00+00', 0, 'completed'),
  ('ee23ee23-ee23-ee23-ee23-ee23ee232302', '11111111-1111-1111-1111-111111111111', 'ee01ee01-ee01-ee01-ee01-ee01ee010101', 'ee21ee21-ee21-ee21-ee21-ee21ee212101', 'delivery-welcome-failed', 'invalid@bounce.example', 'email', 'failed', '2026-08-02 10:00:00+00', null, null, 3, 'failed')
on conflict (id) do nothing;

insert into public.cnh_campaign_metrics (id, organization_id, hub_id, campaign_id, metrics_key, metric_date, sent_count, delivered_count, open_rate, click_rate, bounce_rate, unsubscribe_rate, status)
values
  ('ee24ee24-ee24-ee24-ee24-ee24ee242401', '11111111-1111-1111-1111-111111111111', 'ee01ee01-ee01-ee01-ee01-ee01ee010101', 'ee21ee21-ee21-ee21-ee21-ee21ee212101', 'metrics-onboarding-0802', '2026-08-02', 2, 1, 100.00, 0.00, 50.00, 0.00, 'active')
on conflict (id) do nothing;

-- M7 Delivery Analytics
insert into public.cnh_delivery_analytics (id, organization_id, hub_id, analytics_key, metric_date, channel_type, total_sent, total_delivered, total_failed, delivery_rate, status)
values
  ('ee25ee25-ee25-ee25-ee25-ee25ee252501', '11111111-1111-1111-1111-111111111111', 'ee01ee01-ee01-ee01-ee01-ee01ee010101', 'analytics-email-0802', '2026-08-02', 'email', 2, 1, 1, 50.00, 'active')
on conflict (id) do nothing;

insert into public.cnh_engagement_metrics (id, organization_id, hub_id, metrics_key, metric_date, channel_type, open_rate, click_rate, unsubscribe_rate, engagement_score, status)
values
  ('ee26ee26-ee26-ee26-ee26-ee26ee262601', '11111111-1111-1111-1111-111111111111', 'ee01ee01-ee01-ee01-ee01-ee01ee010101', 'engagement-email-0802', '2026-08-02', 'email', 100.00, 0.00, 0.00, 75.00, 'active')
on conflict (id) do nothing;

insert into public.cnh_bounce_records (id, organization_id, hub_id, bounce_key, channel_type, recipient, bounce_type, bounce_reason, bounced_at, retry_count, status)
values
  ('ee27ee27-ee27-ee27-ee27-ee27ee272701', '11111111-1111-1111-1111-111111111111', 'ee01ee01-ee01-ee01-ee01-ee01ee010101', 'bounce-invalid-0802', 'email', 'invalid@bounce.example', 'hard', '550 5.1.1 User unknown', '2026-08-02 10:00:30+00', 3, 'recorded')
on conflict (id) do nothing;

insert into public.cnh_channel_performance (id, organization_id, hub_id, performance_key, metric_date, channel_type, delivery_rate, open_rate, click_rate, avg_latency_ms, status)
values
  ('ee28ee28-ee28-ee28-ee28-ee28ee282801', '11111111-1111-1111-1111-111111111111', 'ee01ee01-ee01-ee01-ee01-ee01ee010101', 'perf-email-0802', '2026-08-02', 'email', 50.00, 100.00, 0.00, 5200, 'active')
on conflict (id) do nothing;

-- M8 Communication Ops Dashboard (org-only tables)
insert into public.cnh_communication_metrics (id, organization_id, metrics_key, metric_date, total_sent, total_delivered, total_failed, delivery_rate, open_rate, click_rate, status)
values
  ('ee29ee29-ee29-ee29-ee29-ee29ee292901', '11111111-1111-1111-1111-111111111111', 'comms-daily-0802', '2026-08-02', 2, 1, 1, 50.00, 100.00, 0.00, 'active')
on conflict (id) do nothing;

insert into public.cnh_system_health (id, organization_id, health_key, health_date, overall_score, uptime_percent, queue_depth, avg_delivery_latency_ms, disaster_recovery_mode, summary, status)
values
  ('ee30ee30-ee30-ee30-ee30-ee30ee303001', '11111111-1111-1111-1111-111111111111', 'health-daily-0802', '2026-08-02', 92.50, 99.95, 0, 5200, false, 'Communication hub healthy — 50% delivery rate with 1 hard bounce under investigation', 'healthy')
on conflict (id) do nothing;

insert into public.cnh_delivery_failures (id, organization_id, hub_id, failure_key, channel_type, recipient, error_code, error_message, retry_count, failed_at, status)
values
  ('ee31ee31-ee31-ee31-ee31-ee31ee313101', '11111111-1111-1111-1111-111111111111', 'ee01ee01-ee01-ee01-ee01-ee01ee010101', 'failure-bounce-0802', 'email', 'invalid@bounce.example', '550', '550 5.1.1 User unknown', 3, '2026-08-02 10:00:30+00', 'open')
on conflict (id) do nothing;

insert into public.cnh_audit_logs (id, organization_id, entity_type, entity_id, action, summary, metadata, security_level)
values
  ('ee000001-ee00-ee00-ee00-ee0000000001', '11111111-1111-1111-1111-111111111111', 'communication_hub', 'ee01ee01-ee01-ee01-ee01-ee01ee010101', 'create', 'Northstar communication hub provisioned with en-US default locale', '{"hub_key":"northstar-comms","default_locale":"en-US"}'::jsonb, 'standard'),
  ('ee000002-ee00-ee00-ee00-ee0000000002', '11111111-1111-1111-1111-111111111111', 'notification_queue', 'ee03ee03-ee03-ee03-ee03-ee03ee030301', 'deliver', 'Welcome notification delivered to customer@northstar.example', '{"delivery_status":"delivered","channel_type":"email"}'::jsonb, 'elevated'),
  ('ee000003-ee00-ee00-ee00-ee0000000003', '11111111-1111-1111-1111-111111111111', 'notification_queue', 'ee03ee03-ee03-ee03-ee03-ee03ee030302', 'fail', 'Alert notification failed after 3 retries — hard bounce', '{"delivery_status":"failed","error":"550 5.1.1 User unknown","retry_count":3}'::jsonb, 'restricted')
on conflict (id) do nothing;
