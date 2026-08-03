insert into public.ai_orchestration_agents (id, organization_id, name, agent_type, workflow_agent_id, provider_id, model_route_id, capabilities, status)
values
  ('a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a343', '11111111-1111-1111-1111-111111111111', 'Company Foundation Orchestrator', 'company_foundation', null, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a201', '["brand","website","pricing","proposal","customer_portal","documentation","demo","dashboard"]'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.ai_sessions (id, organization_id, agent_id, session_key, module_source, entity_type, entity_id, context, status, expires_at)
values
  ('a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a543', '11111111-1111-1111-1111-111111111111', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a343', 'northstar-company-foundation-001', 'company_foundation', 'company_hub', '00730073-0073-0073-0073-007300730101', '{"objective":"Company foundation for northstar platform brand, website, pricing, and portal"}'::jsonb, 'active', '2026-12-31 23:59:59+00')
on conflict (id) do nothing;

-- G0 Company Hub
insert into public.cmp_company_hubs (id, organization_id, hub_key, hub_name, environment, company_tier, status)
values ('00730073-0073-0073-0073-007300730101', '11111111-1111-1111-1111-111111111111', 'northstar-company-foundation', 'Northstar Company Foundation Hub', 'production', 'enterprise', 'active')
on conflict (id) do nothing;

-- G1 Brand
insert into public.cmp_brand_profiles (id, organization_id, hub_id, profile_key, profile_name, brand_status, status)
values ('04300100-0430-0430-0430-043001000101', '11111111-1111-1111-1111-111111111111', '00730073-0073-0073-0073-007300730101', 'brand-profile-0904', 'Northstar Brand Profile', 'active', 'active')
on conflict (id) do nothing;

insert into public.cmp_logo_assets (id, organization_id, hub_id, asset_key, asset_name, asset_type, status)
values ('04310101-0431-0431-0431-043101010201', '11111111-1111-1111-1111-111111111111', '00730073-0073-0073-0073-007300730101', 'logo-primary-0904', 'Northstar Primary Logo', 'primary', 'active')
on conflict (id) do nothing;

insert into public.cmp_theme_configs (id, organization_id, hub_id, config_key, config_name, primary_color, status)
values ('04320102-0432-0432-0432-043201020301', '11111111-1111-1111-1111-111111111111', '00730073-0073-0073-0073-007300730101', 'theme-emerald-0904', 'Emerald Theme', '#059669', 'active')
on conflict (id) do nothing;

insert into public.cmp_brand_assets (id, organization_id, hub_id, asset_key, asset_name, asset_category, status)
values ('04330103-0433-0433-0433-043301030401', '11111111-1111-1111-1111-111111111111', '00730073-0073-0073-0073-007300730101', 'brand-asset-0904', 'Marketing Banner', 'marketing', 'active')
on conflict (id) do nothing;

-- G2 Website
insert into public.cmp_website_pages (id, organization_id, hub_id, page_key, page_title, page_slug, status)
values ('04340104-0434-0434-0434-043401040501', '11111111-1111-1111-1111-111111111111', '00730073-0073-0073-0073-007300730101', 'page-home-0904', 'Home Page', 'home', 'active')
on conflict (id) do nothing;

insert into public.cmp_website_features (id, organization_id, hub_id, feature_key, feature_name, feature_type, status)
values ('04350105-0435-0435-0435-043501050601', '11111111-1111-1111-1111-111111111111', '00730073-0073-0073-0073-007300730101', 'feat-automation-0904', 'Automation Engine', 'core', 'active')
on conflict (id) do nothing;

insert into public.cmp_website_sections (id, organization_id, hub_id, section_key, section_name, section_type, status)
values ('04360106-0436-0436-0436-043601060701', '11111111-1111-1111-1111-111111111111', '00730073-0073-0073-0073-007300730101', 'section-hero-0904', 'Hero Section', 'hero', 'active')
on conflict (id) do nothing;

insert into public.cmp_demo_requests (id, organization_id, hub_id, request_key, request_name, request_status, status)
values ('04370107-0437-0437-0437-043701070801', '11111111-1111-1111-1111-111111111111', '00730073-0073-0073-0073-007300730101', 'demo-req-0904', 'Enterprise Demo Request', 'pending', 'active')
on conflict (id) do nothing;

-- G3 Pricing
insert into public.cmp_pricing_plans (id, organization_id, hub_id, plan_key, plan_name, plan_tier, status)
values ('04380108-0438-0438-0438-043801080901', '11111111-1111-1111-1111-111111111111', '00730073-0073-0073-0073-007300730101', 'plan-enterprise-0904', 'Enterprise Plan', 'enterprise', 'active')
on conflict (id) do nothing;

insert into public.cmp_pricing_packages (id, organization_id, hub_id, package_key, package_name, package_type, status)
values ('04390109-0439-0439-0439-043901090a01', '11111111-1111-1111-1111-111111111111', '00730073-0073-0073-0073-007300730101', 'pkg-platform-0904', 'Platform Bundle', 'bundle', 'active')
on conflict (id) do nothing;

insert into public.cmp_module_pricing (id, organization_id, hub_id, pricing_key, module_name, price_amount, status)
values ('043a010a-043a-043a-043a-043a010a0b01', '11111111-1111-1111-1111-111111111111', '00730073-0073-0073-0073-007300730101', 'mod-price-0904', 'Workflow Engine', 499.00, 'active')
on conflict (id) do nothing;

insert into public.cmp_discount_rules (id, organization_id, hub_id, rule_key, rule_name, discount_percent, status)
values ('043b010b-043b-043b-043b-043b010b0c01', '11111111-1111-1111-1111-111111111111', '00730073-0073-0073-0073-007300730101', 'disc-volume-0904', 'Volume Discount', 15.00, 'active')
on conflict (id) do nothing;

-- G4 Proposal
insert into public.cmp_proposals (id, organization_id, hub_id, proposal_key, proposal_name, proposal_status, status)
values ('043c010c-043c-043c-043c-043c010c0d01', '11111111-1111-1111-1111-111111111111', '00730073-0073-0073-0073-007300730101', 'prop-enterprise-0904', 'Enterprise Proposal', 'pending', 'active')
on conflict (id) do nothing;

insert into public.cmp_proposal_documents (id, organization_id, hub_id, document_key, document_name, document_type, status)
values ('043d010d-043d-043d-043d-043d010d0e01', '11111111-1111-1111-1111-111111111111', '00730073-0073-0073-0073-007300730101', 'doc-proposal-0904', 'Proposal PDF', 'pdf', 'active')
on conflict (id) do nothing;

insert into public.cmp_proposal_contracts (id, organization_id, hub_id, contract_key, contract_name, contract_status, status)
values ('043e010e-043e-043e-043e-043e010e0f01', '11111111-1111-1111-1111-111111111111', '00730073-0073-0073-0073-007300730101', 'contract-0904', 'Enterprise Contract', 'pending', 'active')
on conflict (id) do nothing;

insert into public.cmp_proposal_history (id, organization_id, hub_id, history_key, history_type, status)
values ('043f010f-043f-043f-043f-043f010f1001', '11111111-1111-1111-1111-111111111111', '00730073-0073-0073-0073-007300730101', 'hist-revision-0904', 'revision', 'active')
on conflict (id) do nothing;

-- G5 Customer Portal
insert into public.cmp_portal_dashboards (id, organization_id, hub_id, dashboard_key, dashboard_name, dashboard_type, status)
values ('04400110-0440-0440-0440-044001101101', '11111111-1111-1111-1111-111111111111', '00730073-0073-0073-0073-007300730101', 'dash-customer-0904', 'Customer Dashboard', 'customer', 'active')
on conflict (id) do nothing;

insert into public.cmp_portal_subscriptions (id, organization_id, hub_id, subscription_key, plan_name, subscription_status, status)
values ('04410111-0441-0441-0441-044101111201', '11111111-1111-1111-1111-111111111111', '00730073-0073-0073-0073-007300730101', 'sub-portal-0904', 'Enterprise Plan', 'active', 'active')
on conflict (id) do nothing;

insert into public.cmp_portal_billing (id, organization_id, hub_id, billing_key, billing_type, billing_amount, status)
values ('04420112-0442-0442-0442-044201121301', '11111111-1111-1111-1111-111111111111', '00730073-0073-0073-0073-007300730101', 'bill-invoice-0904', 'invoice', 4999.00, 'active')
on conflict (id) do nothing;

insert into public.cmp_portal_support (id, organization_id, hub_id, support_key, support_title, support_status, status)
values ('04430113-0443-0443-0443-044301131401', '11111111-1111-1111-1111-111111111111', '00730073-0073-0073-0073-007300730101', 'support-0904', 'Portal Support Request', 'open', 'active')
on conflict (id) do nothing;

-- G6 Documentation
insert into public.cmp_doc_guides (id, organization_id, hub_id, guide_key, guide_title, guide_category, status)
values ('04440114-0444-0444-0444-044401141501', '11111111-1111-1111-1111-111111111111', '00730073-0073-0073-0073-007300730101', 'guide-start-0904', 'Getting Started Guide', 'getting_started', 'active')
on conflict (id) do nothing;

insert into public.cmp_doc_api_references (id, organization_id, hub_id, reference_key, reference_name, api_version, status)
values ('04450115-0445-0445-0445-044501151601', '11111111-1111-1111-1111-111111111111', '00730073-0073-0073-0073-007300730101', 'api-ref-0904', 'Platform API Reference', 'v1', 'active')
on conflict (id) do nothing;

insert into public.cmp_doc_versions (id, organization_id, hub_id, version_key, version_name, version_number, status)
values ('04460116-0446-0446-0446-044601161701', '11111111-1111-1111-1111-111111111111', '00730073-0073-0073-0073-007300730101', 'doc-ver-0904', 'Documentation v1', '1.0.0', 'active')
on conflict (id) do nothing;

-- G7 Demo
insert into public.cmp_demo_organizations (id, organization_id, hub_id, org_key, org_name, org_type, status)
values ('04470117-0447-0447-0447-044701171801', '11111111-1111-1111-1111-111111111111', '00730073-0073-0073-0073-007300730101', 'demo-org-0904', 'Demo Sandbox Org', 'sandbox', 'active')
on conflict (id) do nothing;

insert into public.cmp_demo_data_sets (id, organization_id, hub_id, dataset_key, dataset_name, record_count, status)
values ('04480118-0448-0448-0448-044801181901', '11111111-1111-1111-1111-111111111111', '00730073-0073-0073-0073-007300730101', 'demo-dataset-0904', 'Sample Customer Data', 500, 'active')
on conflict (id) do nothing;

insert into public.cmp_demo_users (id, organization_id, hub_id, user_key, user_name, user_role, status)
values ('04490119-0449-0449-0449-044901191a01', '11111111-1111-1111-1111-111111111111', '00730073-0073-0073-0073-007300730101', 'demo-user-0904', 'Demo Admin', 'admin', 'active')
on conflict (id) do nothing;

-- G8 Dashboard
insert into public.cmp_company_metrics (id, organization_id, metrics_key, website_analytics_score, demo_request_count, active_customer_count, revenue_total, proposal_pending_count, support_open_count, platform_health_score, overall_company_score, status)
values ('044a011a-044a-044a-044a-044a011a1b01', '11111111-1111-1111-1111-111111111111', 'cmp-metrics-0904', 94.00, 12, 45, 125000.00, 5, 3, 96.00, 95.50, 'active')
on conflict (id) do nothing;

insert into public.cmp_company_health (id, organization_id, health_key, overall_score, disaster_recovery_mode, website_status, revenue_status, support_status, security_status, summary, status)
values ('044b011b-044b-044b-044b-044b011b1c01', '11111111-1111-1111-1111-111111111111', 'cmp-health-0904', 95.00, false, 'healthy', 'healthy', 'healthy', 'healthy', 'Company foundation operational', 'healthy')
on conflict (id) do nothing;

insert into public.cmp_executive_kpis (id, organization_id, hub_id, kpi_key, kpi_name, kpi_score, status)
values ('044c011c-044c-044c-044c-044c011c1d01', '11111111-1111-1111-1111-111111111111', '00730073-0073-0073-0073-007300730101', 'kpi-exec-0904', 'Executive KPI Score', 97.00, 'active')
on conflict (id) do nothing;

insert into public.cmp_company_failures (id, organization_id, hub_id, failure_key, failure_type, error_code, error_message, status)
values ('044d011d-044d-044d-044d-044d011d1e01', '11111111-1111-1111-1111-111111111111', '00730073-0073-0073-0073-007300730101', 'fail-website-0904', 'website', 'PAGE_RENDER_ERROR', 'Home page render timeout', 'open')
on conflict (id) do nothing;

insert into public.cmp_audit_logs (id, organization_id, entity_type, action, summary, security_level)
values ('044e011e-044e-044e-044e-044e011e1f01', '11111111-1111-1111-1111-111111111111', 'company_hub', 'seed', 'Company foundation seed data loaded', 'standard')
on conflict (id) do nothing;
