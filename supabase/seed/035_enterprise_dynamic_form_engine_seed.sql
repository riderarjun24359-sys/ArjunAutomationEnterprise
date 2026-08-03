insert into public.ai_orchestration_agents (id, organization_id, name, agent_type, workflow_agent_id, provider_id, model_route_id, capabilities, status)
values
  ('a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a335', '11111111-1111-1111-1111-111111111111', 'Enterprise Dynamic Form Orchestrator', 'enterprise_dynamic_form_engine', null, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a201', '["form_registry","form_builder","field_engine","validation_engine","form_execution","form_rendering","form_analytics","form_dashboard"]'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.ai_sessions (id, organization_id, agent_id, session_key, module_source, entity_type, entity_id, context, status, expires_at)
values
  ('a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a535', '11111111-1111-1111-1111-111111111111', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a335', 'northstar-form-engine-001', 'enterprise_dynamic_form_engine', 'form_hub', '006b006b-006b-006b-006b-006b006b0101', '{"objective":"Enterprise dynamic form engine for northstar operational forms"}'::jsonb, 'active', '2026-12-31 23:59:59+00')
on conflict (id) do nothing;

-- M0 Form Hub
insert into public.dfe_form_hubs (id, organization_id, hub_key, hub_name, environment, status)
values ('006b006b-006b-006b-006b-006b006b0101', '11111111-1111-1111-1111-111111111111', 'northstar-form-engine', 'Northstar Form Engine Hub', 'production', 'active')
on conflict (id) do nothing;

-- M1 Form Registry
insert into public.dfe_form_definitions (id, organization_id, hub_id, form_key, form_name, form_type, status)
values ('006c006c-006c-006c-006c-006c006c0201', '11111111-1111-1111-1111-111111111111', '006b006b-006b-006b-006b-006b006b0101', 'form-onboard-0804', 'Customer Onboarding Form', 'standard', 'active')
on conflict (id) do nothing;

insert into public.dfe_form_categories (id, organization_id, hub_id, category_key, category_name, category_type, status)
values ('006d006d-006d-006d-006d-006d006d0301', '11111111-1111-1111-1111-111111111111', '006b006b-006b-006b-006b-006b006b0101', 'cat-ops-0804', 'Operations', 'operational', 'active')
on conflict (id) do nothing;

insert into public.dfe_form_versions (id, organization_id, hub_id, version_key, version_number, release_channel, status)
values ('006e006e-006e-006e-006e-006e006e0401', '11111111-1111-1111-1111-111111111111', '006b006b-006b-006b-006b-006b006b0101', 'ver-1-0-0', '1.0.0', 'stable', 'active')
on conflict (id) do nothing;

insert into public.dfe_form_dependencies (id, organization_id, hub_id, dependency_key, dependency_type, dependency_ref, status)
values ('006f006f-006f-006f-006f-006f006f0501', '11111111-1111-1111-1111-111111111111', '006b006b-006b-006b-006b-006b006b0101', 'dep-crm-0804', 'form', 'crm-onboarding', 'active')
on conflict (id) do nothing;

-- M2 Form Builder
insert into public.dfe_form_sections (id, organization_id, hub_id, section_key, section_name, section_order, status)
values ('00700070-0070-0070-0070-007000700601', '11111111-1111-1111-1111-111111111111', '006b006b-006b-006b-006b-006b006b0101', 'sec-personal-0804', 'Personal Information', 1, 'active')
on conflict (id) do nothing;

insert into public.dfe_form_tabs (id, organization_id, hub_id, tab_key, tab_name, tab_order, status)
values ('00710071-0071-0071-0071-007100710701', '11111111-1111-1111-1111-111111111111', '006b006b-006b-006b-006b-006b006b0101', 'tab-details-0804', 'Details', 1, 'active')
on conflict (id) do nothing;

insert into public.dfe_form_groups (id, organization_id, hub_id, group_key, group_name, group_order, status)
values ('00720072-0072-0072-0072-007200720801', '11111111-1111-1111-1111-111111111111', '006b006b-006b-006b-006b-006b006b0101', 'grp-contact-0804', 'Contact Group', 1, 'active')
on conflict (id) do nothing;

insert into public.dfe_repeatable_sections (id, organization_id, hub_id, section_key, section_name, min_instances, status)
values ('00730073-0073-0073-0073-007300730901', '11111111-1111-1111-1111-111111111111', '006b006b-006b-006b-006b-006b006b0101', 'rep-addr-0804', 'Addresses', 0, 'active')
on conflict (id) do nothing;

-- M3 Field Engine
insert into public.dfe_form_fields (id, organization_id, hub_id, field_key, field_name, field_type, status)
values ('00740074-0074-0074-0074-007400740a01', '11111111-1111-1111-1111-111111111111', '006b006b-006b-006b-006b-006b006b0101', 'fld-email-0804', 'Email Address', 'email', 'active')
on conflict (id) do nothing;

insert into public.dfe_field_options (id, organization_id, hub_id, option_key, option_label, option_value, status)
values ('00750075-0075-0075-0075-007500750b01', '11111111-1111-1111-1111-111111111111', '006b006b-006b-006b-006b-006b006b0101', 'opt-yes-0804', 'Yes', 'yes', 'active')
on conflict (id) do nothing;

insert into public.dfe_formula_fields (id, organization_id, hub_id, formula_key, formula_name, formula_expression, status)
values ('00760076-0076-0076-0076-007600760c01', '11111111-1111-1111-1111-111111111111', '006b006b-006b-006b-006b-006b006b0101', 'frm-total-0804', 'Total Amount', 'price * quantity', 'active')
on conflict (id) do nothing;

insert into public.dfe_media_fields (id, organization_id, hub_id, media_key, media_name, media_type, status)
values ('00770077-0077-0077-0077-007700770d01', '11111111-1111-1111-1111-111111111111', '006b006b-006b-006b-006b-006b006b0101', 'med-doc-0804', 'Document Upload', 'document', 'active')
on conflict (id) do nothing;

-- M4 Validation Engine
insert into public.dfe_required_rules (id, organization_id, hub_id, rule_key, rule_name, field_ref, status)
values ('00780078-0078-0078-0078-007800780e01', '11111111-1111-1111-1111-111111111111', '006b006b-006b-006b-006b-006b006b0101', 'req-email-0804', 'Email Required', 'fld-email-0804', 'active')
on conflict (id) do nothing;

insert into public.dfe_regex_rules (id, organization_id, hub_id, rule_key, rule_name, pattern, status)
values ('00790079-0079-0079-0079-007900790f01', '11111111-1111-1111-1111-111111111111', '006b006b-006b-006b-006b-006b006b0101', 'rx-email-0804', 'Email Format', '^[^@]+@[^@]+\\.[^@]+$', 'active')
on conflict (id) do nothing;

insert into public.dfe_range_rules (id, organization_id, hub_id, rule_key, rule_name, min_value, status)
values ('007a007a-007a-007a-007a-007a007a1001', '11111111-1111-1111-1111-111111111111', '006b006b-006b-006b-006b-006b006b0101', 'rng-age-0804', 'Age Range', 18, 'active')
on conflict (id) do nothing;

insert into public.dfe_cross_field_rules (id, organization_id, hub_id, rule_key, rule_name, rule_expression, status)
values ('007b007b-007b-007b-007b-007b007b1101', '11111111-1111-1111-1111-111111111111', '006b006b-006b-006b-006b-006b006b0101', 'xfr-match-0804', 'Password Match', 'password === confirmPassword', 'active')
on conflict (id) do nothing;

-- M5 Form Execution
insert into public.dfe_form_drafts (id, organization_id, hub_id, draft_key, draft_name, draft_status, status)
values ('007c007c-007c-007c-007c-007c007c1201', '11111111-1111-1111-1111-111111111111', '006b006b-006b-006b-006b-006b006b0101', 'drf-save-0804', 'Onboarding Draft #12', 'draft', 'active')
on conflict (id) do nothing;

insert into public.dfe_form_submissions (id, organization_id, hub_id, submission_key, submission_name, submission_status, status)
values ('007d007d-007d-007d-007d-007d007d1301', '11111111-1111-1111-1111-111111111111', '006b006b-006b-006b-006b-006b006b0101', 'sub-run-0804', 'Onboarding Submission #42', 'submitted', 'active')
on conflict (id) do nothing;

insert into public.dfe_form_reviews (id, organization_id, hub_id, review_key, review_name, review_status, status)
values ('007e007e-007e-007e-007e-007e007e1401', '11111111-1111-1111-1111-111111111111', '006b006b-006b-006b-006b-006b006b0101', 'rev-pending-0804', 'Pending Review', 'pending', 'active')
on conflict (id) do nothing;

insert into public.dfe_execution_audit_entries (id, organization_id, hub_id, audit_key, audit_type, audit_summary, status)
values ('007f007f-007f-007f-007f-007f007f1501', '11111111-1111-1111-1111-111111111111', '006b006b-006b-006b-006b-006b006b0101', 'aud-sub-0804', 'submission', 'Form submitted successfully', 'active')
on conflict (id) do nothing;

-- M6 Form Rendering
insert into public.dfe_render_profiles (id, organization_id, hub_id, profile_key, profile_name, profile_type, status)
values ('00800080-0080-0080-0080-008000801601', '11111111-1111-1111-1111-111111111111', '006b006b-006b-006b-006b-006b006b0101', 'prof-std-0804', 'Standard Layout', 'standard', 'active')
on conflict (id) do nothing;

insert into public.dfe_theme_configs (id, organization_id, hub_id, theme_key, theme_name, primary_color, status)
values ('00810081-0081-0081-0081-008100811701', '11111111-1111-1111-1111-111111111111', '006b006b-006b-006b-006b-006b006b0101', 'thm-amber-0804', 'Amber Theme', '#d97706', 'active')
on conflict (id) do nothing;

insert into public.dfe_localization_packs (id, organization_id, hub_id, locale_key, locale_code, locale_name, status)
values ('00820082-0082-0082-0082-008200821801', '11111111-1111-1111-1111-111111111111', '006b006b-006b-006b-006b-006b006b0101', 'loc-en-0804', 'en-US', 'English (US)', 'active')
on conflict (id) do nothing;

-- M7 Form Analytics
insert into public.dfe_submission_analytics (id, organization_id, hub_id, analytics_key, analytics_type, analytics_score, status)
values ('00830083-0083-0083-0083-008300831901', '11111111-1111-1111-1111-111111111111', '006b006b-006b-006b-006b-006b006b0101', 'anly-sub-0804', 'submission', 94.50, 'active')
on conflict (id) do nothing;

insert into public.dfe_completion_metrics (id, organization_id, hub_id, metric_key, metric_name, completion_rate, status)
values ('00840084-0084-0084-0084-008400841a01', '11111111-1111-1111-1111-111111111111', '006b006b-006b-006b-006b-006b006b0101', 'cmp-rate-0804', 'Completion Rate', 87.00, 'active')
on conflict (id) do nothing;

insert into public.dfe_usage_trends (id, organization_id, hub_id, trend_key, trend_name, trend_value, status)
values ('00850085-0085-0085-0085-008500851b01', '11111111-1111-1111-1111-111111111111', '006b006b-006b-006b-006b-006b006b0101', 'trd-vol-0804', 'Submission Volume', 1250.00, 'active')
on conflict (id) do nothing;

-- M8 Form Dashboard
insert into public.dfe_form_metrics (id, organization_id, metrics_key, submission_count, completion_rate, average_completion_time_ms, validation_error_count, abandonment_rate, overall_form_score, status)
values ('00860086-0086-0086-0086-008600861c01', '11111111-1111-1111-1111-111111111111', 'form-metrics-0804', 1250, 87.50, 4500, 42, 12.50, 94.75, 'active')
on conflict (id) do nothing;

insert into public.dfe_form_health (id, organization_id, health_key, overall_score, disaster_recovery_mode, pending_reviews_count, active_forms_count, framework_health_status, summary, status)
values ('00870087-0087-0087-0087-008700871d01', '11111111-1111-1111-1111-111111111111', 'form-health-0804', 95.00, false, 3, 42, 'healthy', 'Dynamic form engine operational', 'healthy')
on conflict (id) do nothing;

insert into public.dfe_pending_review_items (id, organization_id, hub_id, item_key, item_name, review_type, status)
values ('00880088-0088-0088-0088-008800881e01', '11111111-1111-1111-1111-111111111111', '006b006b-006b-006b-006b-006b006b0101', 'item-rev-0804', 'Pending Submission Review', 'submission', 'open')
on conflict (id) do nothing;

insert into public.dfe_form_failures (id, organization_id, hub_id, failure_key, failure_type, error_code, error_message, status)
values ('00890089-0089-0089-0089-008900892001', '11111111-1111-1111-1111-111111111111', '006b006b-006b-006b-006b-006b006b0101', 'fail-val-0804', 'validation', 'VAL_REQUIRED', 'Required field email is missing', 'open')
on conflict (id) do nothing;

insert into public.dfe_audit_logs (id, organization_id, entity_type, action, summary, security_level)
values ('00900090-0090-0090-0090-009000902101', '11111111-1111-1111-1111-111111111111', 'form_hub', 'seed', 'Enterprise dynamic form engine seed data loaded', 'standard')
on conflict (id) do nothing;
