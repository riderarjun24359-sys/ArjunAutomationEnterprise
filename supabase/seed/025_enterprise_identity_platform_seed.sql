insert into public.ai_orchestration_agents (id, organization_id, name, agent_type, workflow_agent_id, provider_id, model_route_id, capabilities, status)
values
  ('a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a325', '11111111-1111-1111-1111-111111111111', 'Enterprise Identity Orchestrator', 'enterprise_identity', null, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a201', '["identity_provider","mfa_enrollment","session_management","access_control","org_directory","invitations","security_monitoring","admin_dashboard"]'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.ai_sessions (id, organization_id, agent_id, session_key, module_source, entity_type, entity_id, context, status, expires_at)
values
  ('a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a525', '11111111-1111-1111-1111-111111111111', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a325', 'northstar-idp-001', 'enterprise_identity', 'realm', 'bb01bb01-bb01-bb01-bb01-bb01bb010101', '{"objective":"enterprise identity platform for acme-identity realm"}'::jsonb, 'active', '2026-12-31 23:59:59+00')
on conflict (id) do nothing;

insert into public.idp_realms (id, organization_id, realm_key, realm_name, summary, status)
values
  ('bb01bb01-bb01-bb01-bb01-bb01bb010101', '11111111-1111-1111-1111-111111111111', 'acme-identity', 'Acme Enterprise Identity', 'Northstar/Acme primary identity realm with SSO, MFA, RBAC, and org directory for 48 active users', 'active')
on conflict (id) do nothing;

insert into public.idp_providers (id, organization_id, realm_id, provider_key, provider_type, display_name, config, is_default, status)
values
  ('bb02bb02-bb02-bb02-bb02-bb02bb020201', '11111111-1111-1111-1111-111111111111', 'bb01bb01-bb01-bb01-bb01-bb01bb010101', 'provider-local', 'local', 'Acme Local Directory', '{"password_policy":"acme-standard","lockout_threshold":5}'::jsonb, true, 'active'),
  ('bb02bb02-bb02-bb02-bb02-bb02bb020202', '11111111-1111-1111-1111-111111111111', 'bb01bb01-bb01-bb01-bb01-bb01bb010101', 'provider-google', 'google', 'Google Workspace SSO', '{"domain":"acme.example","hd":"acme.example"}'::jsonb, false, 'active'),
  ('bb02bb02-bb02-bb02-bb02-bb02bb020203', '11111111-1111-1111-1111-111111111111', 'bb01bb01-bb01-bb01-bb01-bb01bb010101', 'provider-microsoft', 'microsoft', 'Microsoft Entra ID', '{"tenant_id":"acme-entra-001","domain":"acme.onmicrosoft.com"}'::jsonb, false, 'active')
on conflict (id) do nothing;

insert into public.idp_saml_configs (id, organization_id, realm_id, config_key, entity_id, sso_url, certificate_pem, attribute_mapping, status)
values
  ('bb03bb03-bb03-bb03-bb03-bb03bb030301', '11111111-1111-1111-1111-111111111111', 'bb01bb01-bb01-bb01-bb01-bb01bb010101', 'saml-okta', 'urn:acme:identity:okta', 'https://acme.okta.com/app/acme/sso/saml', '-----BEGIN CERTIFICATE-----\nMIID...AcmeOktaCert...==\n-----END CERTIFICATE-----', '{"email":"user.email","firstName":"user.firstName","lastName":"user.lastName","groups":"user.groups"}'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.idp_oidc_configs (id, organization_id, realm_id, config_key, client_id, client_secret_hash, issuer_url, redirect_uris, scopes, status)
values
  ('bb04bb04-bb04-bb04-bb04-bb04bb040401', '11111111-1111-1111-1111-111111111111', 'bb01bb01-bb01-bb01-bb01-bb01bb010101', 'oidc-github', 'acme-github-oauth', 'sha256:acme-github-secret-hash-001', 'https://token.actions.githubusercontent.com', '["https://identity.acme.example/callback/github"]'::jsonb, '["openid","profile","email","read:org"]'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.idp_mfa_policies (id, organization_id, realm_id, policy_key, name, required_methods, grace_period_days, enforce_for_admins, status)
values
  ('bb05bb05-bb05-bb05-bb05-bb05bb050501', '11111111-1111-1111-1111-111111111111', 'bb01bb01-bb01-bb01-bb01-bb01bb010101', 'mfa-policy-standard', 'Acme Standard MFA Policy', '["authenticator","email_otp"]'::jsonb, 7, true, 'active')
on conflict (id) do nothing;

insert into public.idp_mfa_enrollments (id, organization_id, realm_id, enrollment_key, user_id, mfa_type, enrolled_at, last_used_at, status)
values
  ('bb06bb06-bb06-bb06-bb06-bb06bb060601', '11111111-1111-1111-1111-111111111111', 'bb01bb01-bb01-bb01-bb01-bb01bb010101', 'mfa-enroll-admin', null, 'authenticator', '2026-07-15 09:00:00+00', '2026-08-02 14:30:00+00', 'active'),
  ('bb06bb06-bb06-bb06-bb06-bb06bb060602', '11111111-1111-1111-1111-111111111111', 'bb01bb01-bb01-bb01-bb01-bb01bb010101', 'mfa-enroll-ops', null, 'email_otp', '2026-07-20 11:00:00+00', '2026-08-01 08:15:00+00', 'active')
on conflict (id) do nothing;

insert into public.idp_backup_codes (id, organization_id, realm_id, code_key, user_id, code_hash, used_at, status)
values
  ('bb07bb07-bb07-bb07-bb07-bb07bb070701', '11111111-1111-1111-1111-111111111111', 'bb01bb01-bb01-bb01-bb01-bb01bb010101', 'backup-admin-001', null, 'sha256:backup-code-hash-001', null, 'available'),
  ('bb07bb07-bb07-bb07-bb07-bb07bb070702', '11111111-1111-1111-1111-111111111111', 'bb01bb01-bb01-bb01-bb01-bb01bb010101', 'backup-admin-002', null, 'sha256:backup-code-hash-002', '2026-07-28 16:00:00+00', 'used')
on conflict (id) do nothing;

insert into public.idp_trusted_devices (id, organization_id, realm_id, device_key, user_id, device_fingerprint, device_name, trusted_at, expires_at, status)
values
  ('bb08bb08-bb08-bb08-bb08-bb08bb080801', '11111111-1111-1111-1111-111111111111', 'bb01bb01-bb01-bb01-bb01-bb01bb010101', 'trusted-macbook-admin', null, 'fp:macbook-pro-m3-001', 'Alex MacBook Pro', '2026-07-10 10:00:00+00', '2027-07-10 10:00:00+00', 'active')
on conflict (id) do nothing;

insert into public.idp_session_policies (id, organization_id, realm_id, policy_key, name, idle_timeout_minutes, absolute_timeout_hours, require_reauth, status)
values
  ('bb09bb09-bb09-bb09-bb09-bb09bb090901', '11111111-1111-1111-1111-111111111111', 'bb01bb01-bb01-bb01-bb01-bb01bb010101', 'session-policy-default', 'Acme Default Session Policy', 30, 12, true, 'active')
on conflict (id) do nothing;

insert into public.idp_active_sessions (id, organization_id, realm_id, session_key, user_id, device_name, ip_address, user_agent, last_active_at, expires_at, status)
values
  ('bb10bb10-bb10-bb10-bb10-bb10bb101001', '11111111-1111-1111-1111-111111111111', 'bb01bb01-bb01-bb01-bb01-bb01bb010101', 'session-admin-001', null, 'MacBook Pro 16"', '203.0.113.42', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5)', '2026-08-02 15:00:00+00', '2026-08-03 03:00:00+00', 'active'),
  ('bb10bb10-bb10-bb10-bb10-bb10bb101002', '11111111-1111-1111-1111-111111111111', 'bb01bb01-bb01-bb01-bb01-bb01bb010101', 'session-ops-002', null, 'Windows Desktop', '198.51.100.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '2026-08-02 14:45:00+00', '2026-08-03 02:45:00+00', 'active')
on conflict (id) do nothing;

insert into public.idp_device_registry (id, organization_id, realm_id, device_key, user_id, device_name, device_type, os_name, registered_at, status)
values
  ('bb11bb11-bb11-bb11-bb11-bb11bb111101', '11111111-1111-1111-1111-111111111111', 'bb01bb01-bb01-bb01-bb01-bb01bb010101', 'device-macbook-admin', null, 'Alex MacBook Pro', 'laptop', 'macOS 14.5', '2026-07-10 10:00:00+00', 'active'),
  ('bb11bb11-bb11-bb11-bb11-bb11bb111102', '11111111-1111-1111-1111-111111111111', 'bb01bb01-bb01-bb01-bb01-bb01bb010101', 'device-iphone-admin', null, 'Alex iPhone 15', 'mobile', 'iOS 17.5', '2026-07-12 08:30:00+00', 'active')
on conflict (id) do nothing;

insert into public.idp_concurrent_login_policies (id, organization_id, realm_id, policy_key, max_concurrent_sessions, action_on_exceed, status)
values
  ('bb12bb12-bb12-bb12-bb12-bb12bb121201', '11111111-1111-1111-1111-111111111111', 'bb01bb01-bb01-bb01-bb01-bb01bb010101', 'concurrent-policy-standard', 3, 'terminate_oldest', 'active')
on conflict (id) do nothing;

insert into public.idp_rbac_roles (id, organization_id, realm_id, role_key, role_name, permissions, is_system, status)
values
  ('bb13bb13-bb13-bb13-bb13-bb13bb131301', '11111111-1111-1111-1111-111111111111', 'bb01bb01-bb01-bb01-bb01-bb01bb010101', 'role-identity-admin', 'Identity Admin', '["idp.view","idp.manage","idp.approve","idp.admin"]'::jsonb, true, 'active'),
  ('bb13bb13-bb13-bb13-bb13-bb13bb131302', '11111111-1111-1111-1111-111111111111', 'bb01bb01-bb01-bb01-bb01-bb01bb010101', 'role-security-analyst', 'Security Analyst', '["idp.view","idp.manage"]'::jsonb, false, 'active'),
  ('bb13bb13-bb13-bb13-bb13-bb13bb131303', '11111111-1111-1111-1111-111111111111', 'bb01bb01-bb01-bb01-bb01-bb01bb010101', 'role-standard-user', 'Standard User', '["idp.view"]'::jsonb, true, 'active')
on conflict (id) do nothing;

insert into public.idp_permission_groups (id, organization_id, realm_id, group_key, group_name, permissions, status)
values
  ('bb14bb14-bb14-bb14-bb14-bb14bb141401', '11111111-1111-1111-1111-111111111111', 'bb01bb01-bb01-bb01-bb01-bb01bb010101', 'group-mfa-mgmt', 'MFA Management', '["idp.view","idp.manage"]'::jsonb, 'active'),
  ('bb14bb14-bb14-bb14-bb14-bb14bb141402', '11111111-1111-1111-1111-111111111111', 'bb01bb01-bb01-bb01-bb01-bb01bb010101', 'group-invite-mgmt', 'Invitation Management', '["idp.view","idp.manage","idp.approve"]'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.idp_abac_policies (id, organization_id, realm_id, policy_key, name, conditions, effect, status)
values
  ('bb15bb15-bb15-bb15-bb15-bb15bb151501', '11111111-1111-1111-1111-111111111111', 'bb01bb01-bb01-bb01-bb01-bb01bb010101', 'abac-admin-hours', 'Admin Access Business Hours', '{"department":"engineering","time_range":"09:00-18:00","timezone":"America/Los_Angeles"}'::jsonb, 'allow', 'active'),
  ('bb15bb15-bb15-bb15-bb15-bb15bb151502', '11111111-1111-1111-1111-111111111111', 'bb01bb01-bb01-bb01-bb01-bb01bb010101', 'abac-deny-geo', 'Deny High-Risk Geo Login', '{"country_not_in":["US","CA","GB"],"risk_score_gt":80}'::jsonb, 'deny', 'active')
on conflict (id) do nothing;

insert into public.idp_temporary_access_grants (id, organization_id, realm_id, grant_key, user_id, granted_by, permissions, starts_at, expires_at, status)
values
  ('bb16bb16-bb16-bb16-bb16-bb16bb161601', '11111111-1111-1111-1111-111111111111', 'bb01bb01-bb01-bb01-bb01-bb01bb010101', 'grant-audit-temp', null, null, '["idp.view","idp.manage"]'::jsonb, '2026-08-01 00:00:00+00', '2026-08-08 23:59:59+00', 'active')
on conflict (id) do nothing;

insert into public.idp_departments (id, organization_id, realm_id, department_key, name, parent_department_id, head_user_id, status)
values
  ('bb17bb17-bb17-bb17-bb17-bb17bb171701', '11111111-1111-1111-1111-111111111111', 'bb01bb01-bb01-bb01-bb01-bb01bb010101', 'dept-engineering', 'Engineering', null, null, 'active'),
  ('bb17bb17-bb17-bb17-bb17-bb17bb171702', '11111111-1111-1111-1111-111111111111', 'bb01bb01-bb01-bb01-bb01-bb01bb010101', 'dept-security', 'Security & Compliance', null, null, 'active'),
  ('bb17bb17-bb17-bb17-bb17-bb17bb171703', '11111111-1111-1111-1111-111111111111', 'bb01bb01-bb01-bb01-bb01-bb01bb010101', 'dept-platform', 'Platform Engineering', 'bb17bb17-bb17-bb17-bb17-bb17bb171701', null, 'active')
on conflict (id) do nothing;

insert into public.idp_teams (id, organization_id, realm_id, team_key, name, department_id, lead_user_id, status)
values
  ('bb18bb18-bb18-bb18-bb18-bb18bb181801', '11111111-1111-1111-1111-111111111111', 'bb01bb01-bb01-bb01-bb01-bb01bb010101', 'team-identity', 'Identity Platform Team', 'bb17bb17-bb17-bb17-bb17-bb17bb171703', null, 'active'),
  ('bb18bb18-bb18-bb18-bb18-bb18bb181802', '11111111-1111-1111-1111-111111111111', 'bb01bb01-bb01-bb01-bb01-bb01bb010101', 'team-soc', 'Security Operations', 'bb17bb17-bb17-bb17-bb17-bb17bb171702', null, 'active')
on conflict (id) do nothing;

insert into public.idp_business_units (id, organization_id, realm_id, unit_key, name, code, parent_unit_id, status)
values
  ('bb19bb19-bb19-bb19-bb19-bb19bb191901', '11111111-1111-1111-1111-111111111111', 'bb01bb01-bb01-bb01-bb01-bb01bb010101', 'bu-northstar', 'Northstar Labs', 'NSL', null, 'active'),
  ('bb19bb19-bb19-bb19-bb19-bb19bb191902', '11111111-1111-1111-1111-111111111111', 'bb01bb01-bb01-bb01-bb01-bb01bb010101', 'bu-acme-cloud', 'Acme Cloud Services', 'ACS', 'bb19bb19-bb19-bb19-bb19-bb19bb191901', 'active')
on conflict (id) do nothing;

insert into public.idp_reporting_structures (id, organization_id, realm_id, structure_key, employee_user_id, manager_user_id, effective_from, status)
values
  ('bb1abb1a-bb1a-bb1a-bb1a-bb1abb1a1a01', '11111111-1111-1111-1111-111111111111', 'bb01bb01-bb01-bb01-bb01-bb01bb010101', 'report-platform-lead', null, null, '2026-01-01', 'active')
on conflict (id) do nothing;

insert into public.idp_invitations (id, organization_id, realm_id, invitation_key, email, invited_by, role_name, expires_at, accepted_at, status)
values
  ('bb1bbb1b-bb1b-bb1b-bb1b-bb1bbb1b1b01', '11111111-1111-1111-1111-111111111111', 'bb01bb01-bb01-bb01-bb01-bb01bb010101', 'invite-security-analyst', 'analyst@acme.example', null, 'Security Analyst', '2026-08-16 23:59:59+00', null, 'pending'),
  ('bb1bbb1b-bb1b-bb1b-bb1b-bb1bbb1b1b02', '11111111-1111-1111-1111-111111111111', 'bb01bb01-bb01-bb01-bb01-bb01bb010101', 'invite-platform-eng', 'engineer@acme.example', null, 'Standard User', '2026-08-10 23:59:59+00', '2026-08-01 14:00:00+00', 'accepted')
on conflict (id) do nothing;

insert into public.idp_bulk_invite_batches (id, organization_id, realm_id, batch_key, name, total_count, sent_count, failed_count, status)
values
  ('bb1cbb1c-bb1c-bb1c-bb1c-bb1cbb1c1c01', '11111111-1111-1111-1111-111111111111', 'bb01bb01-bb01-bb01-bb01-bb01bb010101', 'batch-q3-hires', 'Q3 2026 Engineering Hires', 12, 10, 2, 'completed')
on conflict (id) do nothing;

insert into public.idp_invitation_roles (id, organization_id, realm_id, role_assignment_key, invitation_id, role_id, status)
values
  ('bb1dbb1d-bb1d-bb1d-bb1d-bb1dbb1d1d01', '11111111-1111-1111-1111-111111111111', 'bb01bb01-bb01-bb01-bb01-bb01bb010101', 'inv-role-analyst', 'bb1bbb1b-bb1b-bb1b-bb1b-bb1bbb1b1b01', 'bb13bb13-bb13-bb13-bb13-bb13bb131302', 'pending'),
  ('bb1dbb1d-bb1d-bb1d-bb1d-bb1dbb1d1d02', '11111111-1111-1111-1111-111111111111', 'bb01bb01-bb01-bb01-bb01-bb01bb010101', 'inv-role-engineer', 'bb1bbb1b-bb1b-bb1b-bb1b-bb1bbb1b1b02', 'bb13bb13-bb13-bb13-bb13-bb13bb131303', 'accepted')
on conflict (id) do nothing;

insert into public.idp_invitation_audit (id, organization_id, realm_id, audit_key, invitation_id, action, actor_user_id, details, status)
values
  ('bb1ebb1e-bb1e-bb1e-bb1e-bb1ebb1e1e01', '11111111-1111-1111-1111-111111111111', 'bb01bb01-bb01-bb01-bb01-bb01bb010101', 'audit-invite-sent', 'bb1bbb1b-bb1b-bb1b-bb1b-bb1bbb1b1b01', 'invitation_sent', null, '{"email":"analyst@acme.example","batch":"batch-q3-hires"}'::jsonb, 'recorded'),
  ('bb1ebb1e-bb1e-bb1e-bb1e-bb1ebb1e1e02', '11111111-1111-1111-1111-111111111111', 'bb01bb01-bb01-bb01-bb01-bb01bb010101', 'audit-invite-accepted', 'bb1bbb1b-bb1b-bb1b-bb1b-bb1bbb1b1b02', 'invitation_accepted', null, '{"email":"engineer@acme.example","role":"Standard User"}'::jsonb, 'recorded')
on conflict (id) do nothing;

insert into public.idp_login_history (id, organization_id, realm_id, login_key, user_id, ip_address, device_name, login_method, success, logged_at, status)
values
  ('bb1fbb1f-bb1f-bb1f-bb1f-bb1fbb1f1f01', '11111111-1111-1111-1111-111111111111', 'bb01bb01-bb01-bb01-bb01-bb01bb010101', 'login-success-admin', null, '203.0.113.42', 'MacBook Pro 16"', 'password+mfa', true, '2026-08-02 15:00:00+00', 'recorded'),
  ('bb1fbb1f-bb1f-bb1f-bb1f-bb1fbb1f1f02', '11111111-1111-1111-1111-111111111111', 'bb01bb01-bb01-bb01-bb01-bb01bb010101', 'login-fail-brute', null, '198.51.100.99', 'Unknown Device', 'password', false, '2026-08-02 03:22:00+00', 'recorded')
on conflict (id) do nothing;

insert into public.idp_security_alerts (id, organization_id, realm_id, alert_key, alert_type, severity, title, description, resolved_at, status)
values
  ('bb20bb20-bb20-bb20-bb20-bb20bb202001', '11111111-1111-1111-1111-111111111111', 'bb01bb01-bb01-bb01-bb01-bb01bb010101', 'alert-brute-force', 'brute_force_attempt', 'high', 'Repeated Failed Login Attempts', '15 failed login attempts from IP 198.51.100.99 within 10 minutes', null, 'open'),
  ('bb20bb20-bb20-bb20-bb20-bb20bb202002', '11111111-1111-1111-1111-111111111111', 'bb01bb01-bb01-bb01-bb01-bb01bb010101', 'alert-mfa-bypass', 'mfa_policy_violation', 'medium', 'MFA Grace Period Expiring', '3 users have MFA grace period expiring within 48 hours', '2026-08-01 12:00:00+00', 'resolved')
on conflict (id) do nothing;

insert into public.idp_risk_events (id, organization_id, realm_id, event_key, user_id, risk_score, risk_factors, action_taken, status)
values
  ('bb21bb21-bb21-bb21-bb21-bb21bb212101', '11111111-1111-1111-1111-111111111111', 'bb01bb01-bb01-bb01-bb01-bb01bb010101', 'risk-impossible-travel', null, 85.00, '["impossible_travel","new_device","geo_anomaly"]'::jsonb, 'session_terminated', 'open'),
  ('bb21bb21-bb21-bb21-bb21-bb21bb212102', '11111111-1111-1111-1111-111111111111', 'bb01bb01-bb01-bb01-bb01-bb01bb010101', 'risk-tor-exit', null, 72.50, '["tor_exit_node","credential_stuffing_pattern"]'::jsonb, 'login_blocked', 'resolved')
on conflict (id) do nothing;

insert into public.idp_password_policies (id, organization_id, realm_id, policy_key, name, min_length, require_uppercase, require_numbers, require_symbols, max_age_days, status)
values
  ('bb22bb22-bb22-bb22-bb22-bb22bb222201', '11111111-1111-1111-1111-111111111111', 'bb01bb01-bb01-bb01-bb01-bb01bb010101', 'password-acme-standard', 'Acme Standard Password Policy', 12, true, true, true, 90, 'active')
on conflict (id) do nothing;

insert into public.idp_admin_metrics (id, organization_id, metrics_key, metric_date, total_users, mfa_adoption_percent, active_sessions, failed_logins_24h, pending_invitations, compromised_accounts, open_security_alerts, status)
values
  ('bb23bb23-bb23-bb23-bb23-bb23bb232301', '11111111-1111-1111-1111-111111111111', 'metrics-acme-daily', '2026-08-02', 48, 87.50, 12, 15, 1, 0, 1, 'active')
on conflict (id) do nothing;

insert into public.idp_identity_health (id, organization_id, health_key, overall_score, dimension_scores, status)
values
  ('bb24bb24-bb24-bb24-bb24-bb24bb242401', '11111111-1111-1111-1111-111111111111', 'health-acme-identity', 91.25, '[{"dimension":"mfa_adoption","score":88},{"dimension":"session_hygiene","score":94},{"dimension":"access_control","score":92},{"dimension":"password_compliance","score":90},{"dimension":"invitation_hygiene","score":93}]'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.idp_compromised_accounts (id, organization_id, realm_id, account_key, user_id, detected_at, remediation_status, status)
values
  ('bb25bb25-bb25-bb25-bb25-bb25bb252501', '11111111-1111-1111-1111-111111111111', 'bb01bb01-bb01-bb01-bb01-bb01bb010101', 'compromised-stale-test', null, '2026-07-25 08:00:00+00', 'password_reset_forced', 'remediated')
on conflict (id) do nothing;

insert into public.idp_audit_logs (id, organization_id, entity_type, entity_id, action, summary, metadata, security_level)
values
  ('bb000001-bb00-bb00-bb00-bb0000000001', '11111111-1111-1111-1111-111111111111', 'realm', 'bb01bb01-bb01-bb01-bb01-bb01bb010101', 'create', 'Acme Enterprise Identity realm provisioned with local, Google, and Microsoft providers', '{"realm_key":"acme-identity","providers":["local","google","microsoft"]}'::jsonb, 'standard'),
  ('bb000002-bb00-bb00-bb00-bb0000000002', '11111111-1111-1111-1111-111111111111', 'mfa_policy', 'bb05bb05-bb05-bb05-bb05-bb05bb050501', 'update', 'MFA policy enforced for all admin accounts — grace period 7 days', '{"policy_key":"mfa-policy-standard","enforce_for_admins":true}'::jsonb, 'elevated'),
  ('bb000003-bb00-bb00-bb00-bb0000000003', '11111111-1111-1111-1111-111111111111', 'security_alert', 'bb20bb20-bb20-bb20-bb20-bb20bb202001', 'create', 'High-severity brute force alert triggered from IP 198.51.100.99', '{"alert_type":"brute_force_attempt","severity":"high","ip":"198.51.100.99"}'::jsonb, 'restricted')
on conflict (id) do nothing;
