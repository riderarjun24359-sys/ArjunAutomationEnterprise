insert into public.ai_orchestration_agents (id, organization_id, name, agent_type, workflow_agent_id, provider_id, model_route_id, capabilities, status)
values
  ('a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a320', '11111111-1111-1111-1111-111111111111', 'Commercial SaaS Orchestrator', 'commercial_saas', null, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a201', '["tenant_registration","subscription_management","usage_tracking","billing","license_management"]'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.ai_sessions (id, organization_id, agent_id, session_key, module_source, entity_type, entity_id, context, status, expires_at)
values
  ('a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a520', '11111111-1111-1111-1111-111111111111', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a320', 'northstar-saas-001', 'commercial_saas', 'tenant', 'aa01aa01-aa01-aa01-aa01-aa01aa010101', '{"objective":"commercial multi-tenant saas platform"}'::jsonb, 'active', '2026-12-31 23:59:59+00')
on conflict (id) do nothing;

insert into public.saas_tenants (id, organization_id, tenant_key, company_name, current_plan, tenant_status, trial_ends_at, subscription_ends_at, domain_slug, summary)
values
  ('aa01aa01-aa01-aa01-aa01-aa01aa010101', '11111111-1111-1111-1111-111111111111', 'northstar-saas', 'Northstar Commercial SaaS', 'starter', 'active', '2026-09-02 00:24:00+00', '2027-08-02 00:24:00+00', 'northstar', 'Northstar tenant on starter plan with seat, AI, and module licenses covering trial-to-starter conversion')
on conflict (id) do nothing;

insert into public.saas_registrations (id, organization_id, tenant_id, registration_key, company_name, owner_email, owner_name, registration_status, metadata)
values
  ('aa02aa02-aa02-aa02-aa02-aa02aa020201', '11111111-1111-1111-1111-111111111111', 'aa01aa01-aa01-aa01-aa01-aa01aa010101', 'reg-northstar-001', 'Northstar Commercial SaaS', 'founder@northstar.example', 'Alex Founder', 'completed', '{"source":"self_service","plan":"starter"}'::jsonb)
on conflict (id) do nothing;

insert into public.saas_tenant_profiles (id, organization_id, tenant_id, profile_key, legal_name, industry, company_size, billing_email, address, status)
values
  ('aa03aa03-aa03-aa03-aa03-aa03aa030301', '11111111-1111-1111-1111-111111111111', 'aa01aa01-aa01-aa01-aa01-aa01aa010101', 'profile-northstar', 'Northstar Automation OS Inc.', 'enterprise_software', '11-50', 'billing@northstar.example', '{"city":"San Francisco","country":"US"}'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.saas_domain_configs (id, organization_id, tenant_id, domain_key, subdomain, custom_domain, ssl_status, status)
values
  ('aa04aa04-aa04-aa04-aa04-aa04aa040401', '11111111-1111-1111-1111-111111111111', 'aa01aa01-aa01-aa01-aa01-aa01aa010101', 'domain-northstar', 'northstar', 'app.northstar.example', 'active', 'active')
on conflict (id) do nothing;

insert into public.saas_email_verifications (id, organization_id, tenant_id, verification_key, email, verification_token, verified_at, status)
values
  ('aa05aa05-aa05-aa05-aa05-aa05aa050501', '11111111-1111-1111-1111-111111111111', 'aa01aa01-aa01-aa01-aa01-aa01aa010101', 'verify-northstar', 'founder@northstar.example', 'tok-northstar-verify-001', '2026-08-02 00:24:00+00', 'verified')
on conflict (id) do nothing;

insert into public.saas_trials (id, organization_id, tenant_id, trial_key, plan_tier, started_at, ends_at, converted_at, status)
values
  ('aa06aa06-aa06-aa06-aa06-aa06aa060601', '11111111-1111-1111-1111-111111111111', 'aa01aa01-aa01-aa01-aa01-aa01aa010101', 'trial-northstar', 'trial', '2026-07-19 00:24:00+00', '2026-08-02 00:24:00+00', '2026-08-02 00:24:00+00', 'converted')
on conflict (id) do nothing;

insert into public.saas_workspace_setups (id, organization_id, tenant_id, setup_key, workspace_name, initialization_steps, completed_steps, status)
values
  ('aa07aa07-aa07-aa07-aa07-aa07aa070701', '11111111-1111-1111-1111-111111111111', 'aa01aa01-aa01-aa01-aa01-aa01aa010101', 'setup-northstar', 'Northstar Workspace', '["create_org","provision_roles","configure_portal","enable_modules"]'::jsonb, '["create_org","provision_roles","configure_portal","enable_modules"]'::jsonb, 'completed')
on conflict (id) do nothing;

insert into public.saas_tenant_role_provisions (id, organization_id, tenant_id, provision_key, role_name, permissions, is_default, status)
values
  ('aa08aa08-aa08-aa08-aa08-aa08aa080801', '11111111-1111-1111-1111-111111111111', 'aa01aa01-aa01-aa01-aa01-aa01aa010101', 'role-admin', 'Tenant Admin', '["saas.view","saas.manage","saas.approve"]'::jsonb, true, 'active')
on conflict (id) do nothing;

insert into public.saas_welcome_experiences (id, organization_id, tenant_id, experience_key, title, welcome_steps, completed, status)
values
  ('aa09aa09-aa09-aa09-aa09-aa09aa090901', '11111111-1111-1111-1111-111111111111', 'aa01aa01-aa01-aa01-aa01-aa01aa010101', 'welcome-northstar', 'Welcome to Northstar SaaS', '["verify_email","complete_profile","invite_team","explore_modules"]'::jsonb, true, 'active')
on conflict (id) do nothing;

insert into public.saas_subscriptions (id, organization_id, tenant_id, subscription_key, plan_tier, billing_cycle, amount_usd, starts_at, renews_at, status)
values
  ('aa0aaa0a-aa0a-aa0a-aa0a-aa0aaa0a0a01', '11111111-1111-1111-1111-111111111111', 'aa01aa01-aa01-aa01-aa01-aa01aa010101', 'sub-northstar-starter', 'starter', 'monthly', 299.00, '2026-08-02 00:24:00+00', '2026-09-02 00:24:00+00', 'active')
on conflict (id) do nothing;

insert into public.saas_plan_limits (id, organization_id, tenant_id, limit_key, plan_tier, resource_type, limit_value, current_usage, status)
values
  ('aa0baa0b-aa0b-aa0b-aa0b-aa0baa0b0b01', '11111111-1111-1111-1111-111111111111', 'aa01aa01-aa01-aa01-aa01-aa01aa010101', 'limit-seats-starter', 'starter', 'seats', 25, 8, 'active'),
  ('aa0baa0b-aa0b-aa0b-aa0b-aa0baa0b0b02', '11111111-1111-1111-1111-111111111111', 'aa01aa01-aa01-aa01-aa01-aa01aa010101', 'limit-ai-starter', 'starter', 'ai_tokens', 500000, 125000, 'active')
on conflict (id) do nothing;

insert into public.saas_subscription_events (id, organization_id, tenant_id, event_key, event_type, from_plan, to_plan, reason, effective_at, status)
values
  ('aa0caa0c-aa0c-aa0c-aa0c-aa0caa0c0c01', '11111111-1111-1111-1111-111111111111', 'aa01aa01-aa01-aa01-aa01-aa01aa010101', 'event-trial-to-starter', 'plan_change', 'trial', 'starter', 'Trial converted to paid starter subscription', '2026-08-02 00:24:00+00', 'completed')
on conflict (id) do nothing;

insert into public.saas_licenses (id, organization_id, tenant_id, license_key, license_type, name, total_units, used_units, status)
values
  ('aa0daa0d-aa0d-aa0d-aa0d-aa0daa0d0d01', '11111111-1111-1111-1111-111111111111', 'aa01aa01-aa01-aa01-aa01-aa01aa010101', 'lic-seats', 'seat', 'Starter Seat License', 25, 8, 'active'),
  ('aa0daa0d-aa0d-aa0d-aa0d-aa0daa0d0d02', '11111111-1111-1111-1111-111111111111', 'aa01aa01-aa01-aa01-aa01-aa01aa010101', 'lic-ai', 'ai', 'AI Orchestration License', 500000, 125000, 'active'),
  ('aa0daa0d-aa0d-aa0d-aa0d-aa0daa0d0d03', '11111111-1111-1111-1111-111111111111', 'aa01aa01-aa01-aa01-aa01-aa01aa010101', 'lic-modules', 'module', 'Enterprise Module Pack', 12, 6, 'active')
on conflict (id) do nothing;

insert into public.saas_license_allocations (id, organization_id, tenant_id, allocation_key, license_id, resource_type, resource_name, allocated_units, status)
values
  ('aa0eaa0e-aa0e-aa0e-aa0e-aa0eaa0e0e01', '11111111-1111-1111-1111-111111111111', 'aa01aa01-aa01-aa01-aa01-aa01aa010101', 'alloc-admin-seats', 'aa0daa0d-aa0d-aa0d-aa0d-aa0daa0d0d01', 'seat', 'Admin Team', 5, 'active'),
  ('aa0eaa0e-aa0e-aa0e-aa0e-aa0eaa0e0e02', '11111111-1111-1111-1111-111111111111', 'aa01aa01-aa01-aa01-aa01-aa01aa010101', 'alloc-ai-ops', 'aa0daa0d-aa0d-aa0d-aa0d-aa0daa0d0d02', 'ai', 'AI Operations', 1, 'active')
on conflict (id) do nothing;

insert into public.saas_feature_flags (id, organization_id, tenant_id, flag_key, name, enabled, module_source, usage_limit, status)
values
  ('aa0faa0f-aa0f-aa0f-aa0f-aa0faa0f0f01', '11111111-1111-1111-1111-111111111111', 'aa01aa01-aa01-aa01-aa01-aa01aa010101', 'flag-ai-orchestration', 'AI Orchestration', true, 'ai-orchestration', 500000, 'active'),
  ('aa0faa0f-aa0f-aa0f-aa0f-aa0faa0f0f02', '11111111-1111-1111-1111-111111111111', 'aa01aa01-aa01-aa01-aa01-aa01aa010101', 'flag-autonomous-company', 'Autonomous Company v1', true, 'autonomous-company', null, 'active')
on conflict (id) do nothing;

insert into public.saas_portal_settings (id, organization_id, tenant_id, settings_key, portal_name, preferences, status)
values
  ('aa10aa10-aa10-aa10-aa10-aa10aa101001', '11111111-1111-1111-1111-111111111111', 'aa01aa01-aa01-aa01-aa01-aa01aa010101', 'settings-portal', 'Northstar Customer Portal', '{"theme":"sky-600","locale":"en-US","notifications":true}'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.saas_portal_branding (id, organization_id, tenant_id, branding_key, logo_url, primary_color, accent_color, status)
values
  ('aa11aa11-aa11-aa11-aa11-aa11aa111101', '11111111-1111-1111-1111-111111111111', 'aa01aa01-aa01-aa01-aa01-aa01aa010101', 'brand-northstar', '/branding/northstar-logo.svg', '#0284c7', '#0ea5e9', 'active')
on conflict (id) do nothing;

insert into public.saas_portal_integrations (id, organization_id, tenant_id, integration_key, provider, config, status)
values
  ('aa12aa12-aa12-aa12-aa12-aa12aa121201', '11111111-1111-1111-1111-111111111111', 'aa01aa01-aa01-aa01-aa01-aa01aa010101', 'int-stripe', 'stripe', '{"mode":"live","webhook_enabled":true}'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.saas_portal_api_keys (id, organization_id, tenant_id, api_key_hash, key_name, scopes, last_used_at, status)
values
  ('aa13aa13-aa13-aa13-aa13-aa13aa131301', '11111111-1111-1111-1111-111111111111', 'aa01aa01-aa01-aa01-aa01-aa01aa010101', 'sha256:northstar-portal-key-hash-001', 'northstar-portal-prod', '["saas.read","saas.write","usage.track"]'::jsonb, '2026-08-02 12:00:00+00', 'active')
on conflict (id) do nothing;

insert into public.saas_usage_meters (id, organization_id, tenant_id, meter_key, meter_type, unit_label, current_period_usage, period_start, period_end, status)
values
  ('aa14aa14-aa14-aa14-aa14-aa14aa141401', '11111111-1111-1111-1111-111111111111', 'aa01aa01-aa01-aa01-aa01-aa01aa010101', 'meter-users', 'users', 'active users', 8.0000, '2026-08-01 00:00:00+00', '2026-09-01 00:00:00+00', 'active'),
  ('aa14aa14-aa14-aa14-aa14-aa14aa141402', '11111111-1111-1111-1111-111111111111', 'aa01aa01-aa01-aa01-aa01-aa01aa010101', 'meter-ai-tokens', 'ai_tokens', 'tokens', 125000.0000, '2026-08-01 00:00:00+00', '2026-09-01 00:00:00+00', 'active')
on conflict (id) do nothing;

insert into public.saas_usage_records (id, organization_id, tenant_id, record_key, meter_type, quantity, recorded_at, metadata)
values
  ('aa15aa15-aa15-aa15-aa15-aa15aa151501', '11111111-1111-1111-1111-111111111111', 'aa01aa01-aa01-aa01-aa01-aa01aa010101', 'usage-ai-001', 'ai_tokens', 1500.0000, '2026-08-02 10:00:00+00', '{"module":"commercial_saas","task":"register_tenant"}'::jsonb)
on conflict (id) do nothing;

insert into public.saas_commercial_invoices (id, organization_id, tenant_id, invoice_key, invoice_number, amount_usd, tax_amount_usd, discount_amount_usd, due_date, status)
values
  ('aa16aa16-aa16-aa16-aa16-aa16aa161601', '11111111-1111-1111-1111-111111111111', 'aa01aa01-aa01-aa01-aa01-aa01aa010101', 'inv-starter-001', 'INV-NS-2026-0801', 299.00, 26.91, 0.00, '2026-08-15', 'paid')
on conflict (id) do nothing;

insert into public.saas_billing_credits (id, organization_id, tenant_id, credit_key, balance_usd, reason, status)
values
  ('aa17aa17-aa17-aa17-aa17-aa17aa171701', '11111111-1111-1111-1111-111111111111', 'aa01aa01-aa01-aa01-aa01-aa01aa010101', 'credit-welcome', 50.00, 'Welcome credit for trial conversion', 'active')
on conflict (id) do nothing;

insert into public.saas_billing_coupons (id, organization_id, tenant_id, coupon_key, code, discount_type, discount_value, expires_at, status)
values
  ('aa18aa18-aa18-aa18-aa18-aa18aa181801', '11111111-1111-1111-1111-111111111111', 'aa01aa01-aa01-aa01-aa01-aa01aa010101', 'coupon-launch', 'NORTHSTAR20', 'percent', 20.00, '2026-12-31 23:59:59+00', 'active')
on conflict (id) do nothing;

insert into public.saas_recurring_billing (id, organization_id, tenant_id, billing_key, amount_usd, billing_cycle, next_billing_date, status)
values
  ('aa19aa19-aa19-aa19-aa19-aa19aa191901', '11111111-1111-1111-1111-111111111111', 'aa01aa01-aa01-aa01-aa01-aa01aa010101', 'recurring-starter', 299.00, 'monthly', '2026-09-02', 'active')
on conflict (id) do nothing;

insert into public.saas_tenant_health_scores (id, organization_id, tenant_id, score_key, overall_score, dimension_scores, status)
values
  ('aa1aaa1a-aa1a-aa1a-aa1a-aa1aaa1a1a01', '11111111-1111-1111-1111-111111111111', 'aa01aa01-aa01-aa01-aa01-aa01aa010101', 'health-northstar', 88.50, '[{"dimension":"adoption","score":85},{"dimension":"billing","score":92},{"dimension":"support","score":88},{"dimension":"usage","score":89}]'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.saas_onboarding_checklists (id, organization_id, tenant_id, checklist_key, name, items, completion_percent, status)
values
  ('aa1baa1b-aa1b-aa1b-aa1b-aa1baa1b1b01', '11111111-1111-1111-1111-111111111111', 'aa01aa01-aa01-aa01-aa01-aa01aa010101', 'onboard-northstar', 'Northstar Onboarding', '["verify_email","setup_workspace","invite_team","configure_billing","enable_modules"]'::jsonb, 100.00, 'completed')
on conflict (id) do nothing;

insert into public.saas_product_adoption (id, organization_id, tenant_id, adoption_key, module_name, adoption_percent, active_users, status)
values
  ('aa1caa1c-aa1c-aa1c-aa1c-aa1caa1c1c01', '11111111-1111-1111-1111-111111111111', 'aa01aa01-aa01-aa01-aa01-aa01aa010101', 'adopt-ai', 'ai-orchestration', 75.00, 6, 'tracking'),
  ('aa1caa1c-aa1c-aa1c-aa1c-aa1caa1c1c02', '11111111-1111-1111-1111-111111111111', 'aa01aa01-aa01-aa01-aa01-aa01aa010101', 'adopt-ac', 'autonomous-company', 50.00, 4, 'tracking')
on conflict (id) do nothing;

insert into public.saas_renewal_tracking (id, organization_id, tenant_id, renewal_key, renewal_date, renewal_value_usd, renewal_probability, status)
values
  ('aa1daa1d-aa1d-aa1d-aa1d-aa1daa1d1d01', '11111111-1111-1111-1111-111111111111', 'aa01aa01-aa01-aa01-aa01-aa01aa010101', 'renewal-starter-2027', '2027-08-02', 3588.00, 92.50, 'upcoming')
on conflict (id) do nothing;

insert into public.saas_support_summaries (id, organization_id, tenant_id, summary_key, open_tickets, avg_resolution_hours, satisfaction_score, status)
values
  ('aa1eaa1e-aa1e-aa1e-aa1e-aa1eaa1e1e01', '11111111-1111-1111-1111-111111111111', 'aa01aa01-aa01-aa01-aa01-aa01aa010101', 'support-northstar', 2, 4.50, 4.80, 'active')
on conflict (id) do nothing;

insert into public.saas_admin_metrics (id, organization_id, metrics_key, metric_date, active_tenants, trial_tenants, mrr_usd, arr_usd, churn_rate_percent, renewal_count, total_usage_records, avg_health_score, growth_rate_percent, status)
values
  ('aa1faa1f-aa1f-aa1f-aa1f-aa1faa1f1f01', '11111111-1111-1111-1111-111111111111', 'metrics-northstar-daily', '2026-08-02', 1, 0, 299.00, 3588.00, 0.00, 1, 1, 88.50, 15.00, 'active')
on conflict (id) do nothing;

insert into public.saas_audit_logs (id, organization_id, entity_type, entity_id, action, summary, metadata, security_level)
values
  ('aa000001-aa00-aa00-aa00-aa0000000001', '11111111-1111-1111-1111-111111111111', 'tenant', 'aa01aa01-aa01-aa01-aa01-aa01aa010101', 'create', 'Northstar Commercial SaaS tenant registered and trial started', '{"plan":"trial","source":"self_service"}'::jsonb, 'standard'),
  ('aa000002-aa00-aa00-aa00-aa0000000002', '11111111-1111-1111-1111-111111111111', 'subscription', 'aa0aaa0a-aa0a-aa0a-aa0a-aa0aaa0a0a01', 'plan_change', 'Trial converted to starter subscription — MRR $299.00', '{"from_plan":"trial","to_plan":"starter","mrr_usd":299}'::jsonb, 'elevated'),
  ('aa000003-aa00-aa00-aa00-aa0000000003', '11111111-1111-1111-1111-111111111111', 'portal_api_key', 'aa13aa13-aa13-aa13-aa13-aa13aa131301', 'create', 'Production portal API key provisioned with scoped access', '{"key_name":"northstar-portal-prod","scopes":["saas.read","saas.write","usage.track"]}'::jsonb, 'restricted')
on conflict (id) do nothing;
