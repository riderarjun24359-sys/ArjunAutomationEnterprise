insert into public.ai_orchestration_agents (id, organization_id, name, agent_type, workflow_agent_id, provider_id, model_route_id, capabilities, status)
values
  ('a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a344', '11111111-1111-1111-1111-111111111111', 'Customer Success & Delivery Orchestrator', 'customer_success_delivery', null, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a201', '["customer_success","support","deployment","learning","ado","dashboard"]'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.ai_sessions (id, organization_id, agent_id, session_key, module_source, entity_type, entity_id, context, status, expires_at)
values
  ('a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a544', '11111111-1111-1111-1111-111111111111', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a344', 'northstar-customer-success-delivery-001', 'customer_success_delivery', 'delivery_hub', '00740074-0074-0074-0074-007400740101', '{"objective":"Customer success and delivery for northstar platform onboarding, support, and deployment"}'::jsonb, 'active', '2026-12-31 23:59:59+00')
on conflict (id) do nothing;

-- G0 Delivery Hub
insert into public.csd_delivery_hubs (id, organization_id, hub_key, hub_name, environment, delivery_tier, status)
values ('00740074-0074-0074-0074-007400740101', '11111111-1111-1111-1111-111111111111', 'northstar-customer-success-delivery', 'Northstar Customer Success & Delivery Hub', 'production', 'enterprise', 'active')
on conflict (id) do nothing;

-- G1 Customer Success
insert into public.csd_customer_health_scores (id, organization_id, hub_id, score_key, customer_ref, health_score, status)
values ('04400100-0440-0440-0440-044001000101', '11111111-1111-1111-1111-111111111111', '00740074-0074-0074-0074-007400740101', 'health-score-0904', 'northstar-corp', 92.00, 'active')
on conflict (id) do nothing;

insert into public.csd_adoption_analytics (id, organization_id, hub_id, analytics_key, feature_name, adoption_rate, status)
values ('04410101-0441-0441-0441-044101010201', '11111111-1111-1111-1111-111111111111', '00740074-0074-0074-0074-007400740101', 'adopt-analytics-0904', 'Workflow Engine', 78.50, 'active')
on conflict (id) do nothing;

insert into public.csd_success_plans (id, organization_id, hub_id, plan_key, plan_name, plan_status, status)
values ('04420102-0442-0442-0442-044201020301', '11111111-1111-1111-1111-111111111111', '00740074-0074-0074-0074-007400740101', 'success-plan-0904', 'Enterprise Success Plan', 'active', 'active')
on conflict (id) do nothing;

insert into public.csd_customer_timelines (id, organization_id, hub_id, timeline_key, timeline_name, timeline_type, status)
values ('04430103-0443-0443-0443-044301030401', '11111111-1111-1111-1111-111111111111', '00740074-0074-0074-0074-007400740101', 'timeline-onboard-0904', 'Onboarding Timeline', 'milestone', 'active')
on conflict (id) do nothing;

insert into public.csd_renewal_forecasts (id, organization_id, hub_id, forecast_key, customer_ref, forecast_status, status)
values ('04440104-0444-0444-0444-044401040501', '11111111-1111-1111-1111-111111111111', '00740074-0074-0074-0074-007400740101', 'renewal-forecast-0904', 'northstar-corp', 'pending', 'active')
on conflict (id) do nothing;

-- G2 Support
insert into public.csd_support_tickets (id, organization_id, hub_id, ticket_key, ticket_title, ticket_status, status)
values ('04450105-0445-0445-0445-044501050601', '11111111-1111-1111-1111-111111111111', '00740074-0074-0074-0074-007400740101', 'ticket-0904', 'Integration Support Request', 'open', 'active')
on conflict (id) do nothing;

insert into public.csd_live_chat_sessions (id, organization_id, hub_id, session_key, session_title, session_status, status)
values ('04460106-0446-0446-0446-044601060701', '11111111-1111-1111-1111-111111111111', '00740074-0074-0074-0074-007400740101', 'chat-session-0904', 'Live Support Session', 'active', 'active')
on conflict (id) do nothing;

insert into public.csd_knowledge_base_articles (id, organization_id, hub_id, article_key, article_title, article_category, status)
values ('04470107-0447-0447-0447-044701070801', '11111111-1111-1111-1111-111111111111', '00740074-0074-0074-0074-007400740101', 'kb-article-0904', 'Getting Started Guide', 'general', 'active')
on conflict (id) do nothing;

insert into public.csd_sla_policies (id, organization_id, hub_id, policy_key, policy_name, policy_type, status)
values ('04480108-0448-0448-0448-044801080901', '11111111-1111-1111-1111-111111111111', '00740074-0074-0074-0074-007400740101', 'sla-enterprise-0904', 'Enterprise SLA', 'standard', 'active')
on conflict (id) do nothing;

insert into public.csd_escalation_rules (id, organization_id, hub_id, rule_key, rule_name, rule_type, status)
values ('04490109-0449-0449-0449-044901090a01', '11111111-1111-1111-1111-111111111111', '00740074-0074-0074-0074-007400740101', 'escalation-0904', 'Critical Escalation Rule', 'time_based', 'active')
on conflict (id) do nothing;

-- G3 Deployment
insert into public.csd_deployment_automations (id, organization_id, hub_id, automation_key, automation_name, automation_status, status)
values ('044a010a-044a-044a-044a-044a010a0b01', '11111111-1111-1111-1111-111111111111', '00740074-0074-0074-0074-007400740101', 'deploy-auto-0904', 'Production Pipeline', 'active', 'active')
on conflict (id) do nothing;

insert into public.csd_environment_management (id, organization_id, hub_id, environment_key, environment_name, environment_type, status)
values ('044b010b-044b-044b-044b-044b010b0c01', '11111111-1111-1111-1111-111111111111', '00740074-0074-0074-0074-007400740101', 'env-prod-0904', 'Production Environment', 'production', 'active')
on conflict (id) do nothing;

insert into public.csd_deployment_tracking (id, organization_id, hub_id, tracking_key, deployment_name, deployment_status, status)
values ('044c010c-044c-044c-044c-044c010c0d01', '11111111-1111-1111-1111-111111111111', '00740074-0074-0074-0074-007400740101', 'deploy-track-0904', 'Platform Deployment', 'pending', 'active')
on conflict (id) do nothing;

insert into public.csd_upgrade_management (id, organization_id, hub_id, upgrade_key, upgrade_name, upgrade_status, status)
values ('044d010d-044d-044d-044d-044d010d0e01', '11111111-1111-1111-1111-111111111111', '00740074-0074-0074-0074-007400740101', 'upgrade-0904', 'Version 2.0 Upgrade', 'scheduled', 'active')
on conflict (id) do nothing;

insert into public.csd_release_tracking (id, organization_id, hub_id, release_key, release_name, release_status, status)
values ('044e010e-044e-044e-044e-044e010e0f01', '11111111-1111-1111-1111-111111111111', '00740074-0074-0074-0074-007400740101', 'release-0904', 'Platform Release 2.0', 'planned', 'active')
on conflict (id) do nothing;

-- G4 Learning
insert into public.csd_training_portals (id, organization_id, hub_id, portal_key, portal_name, portal_type, status)
values ('044f010f-044f-044f-044f-044f010f1001', '11111111-1111-1111-1111-111111111111', '00740074-0074-0074-0074-007400740101', 'training-portal-0904', 'Customer Training Portal', 'customer', 'active')
on conflict (id) do nothing;

insert into public.csd_video_library (id, organization_id, hub_id, video_key, video_title, video_category, status)
values ('04500110-0450-0450-0450-045001101101', '11111111-1111-1111-1111-111111111111', '00740074-0074-0074-0074-007400740101', 'video-onboard-0904', 'Platform Onboarding Video', 'onboarding', 'active')
on conflict (id) do nothing;

insert into public.csd_product_tours (id, organization_id, hub_id, tour_key, tour_name, tour_type, status)
values ('04510111-0451-0451-0451-045101111201', '11111111-1111-1111-1111-111111111111', '00740074-0074-0074-0074-007400740101', 'tour-guided-0904', 'Guided Product Tour', 'guided', 'active')
on conflict (id) do nothing;

insert into public.csd_certifications (id, organization_id, hub_id, certification_key, certification_name, certification_type, status)
values ('04520112-0452-0452-0452-045201121301', '11111111-1111-1111-1111-111111111111', '00740074-0074-0074-0074-007400740101', 'cert-product-0904', 'Platform Certification', 'product', 'active')
on conflict (id) do nothing;

insert into public.csd_progress_tracking (id, organization_id, hub_id, progress_key, learner_ref, progress_percent, status)
values ('04530113-0453-0453-0453-045301131401', '11111111-1111-1111-1111-111111111111', '00740074-0074-0074-0074-007400740101', 'progress-0904', 'learner-001', 65.00, 'active')
on conflict (id) do nothing;

insert into public.csd_learning_analytics (id, organization_id, hub_id, analytics_key, metric_name, completion_rate, status)
values ('04540114-0454-0454-0454-045401141501', '11111111-1111-1111-1111-111111111111', '00740074-0074-0074-0074-007400740101', 'learn-analytics-0904', 'Course Completion Rate', 82.00, 'active')
on conflict (id) do nothing;

-- G5 ADO
insert into public.csd_delivery_workflows (id, organization_id, hub_id, workflow_key, workflow_name, workflow_status, status)
values ('04550115-0455-0455-0455-045501151601', '11111111-1111-1111-1111-111111111111', '00740074-0074-0074-0074-007400740101', 'workflow-onboard-0904', 'Onboarding Workflow', 'active', 'active')
on conflict (id) do nothing;

insert into public.csd_onboarding_automation (id, organization_id, hub_id, automation_key, automation_name, automation_status, status)
values ('04560116-0456-0456-0456-045601161701', '11111111-1111-1111-1111-111111111111', '00740074-0074-0074-0074-007400740101', 'onboard-auto-0904', 'Customer Onboarding Automation', 'active', 'active')
on conflict (id) do nothing;

insert into public.csd_implementation_tracking (id, organization_id, hub_id, tracking_key, implementation_name, implementation_status, status)
values ('04570117-0457-0457-0457-045701171801', '11111111-1111-1111-1111-111111111111', '00740074-0074-0074-0074-007400740101', 'impl-track-0904', 'Enterprise Implementation', 'in_progress', 'active')
on conflict (id) do nothing;

insert into public.csd_resource_assignments (id, organization_id, hub_id, assignment_key, resource_name, resource_type, status)
values ('04580118-0458-0458-0458-045801181901', '11111111-1111-1111-1111-111111111111', '00740074-0074-0074-0074-007400740101', 'resource-0904', 'Senior Implementation Consultant', 'consultant', 'active')
on conflict (id) do nothing;

insert into public.csd_milestone_tracking (id, organization_id, hub_id, milestone_key, milestone_name, milestone_status, status)
values ('04590119-0459-0459-0459-045901191a01', '11111111-1111-1111-1111-111111111111', '00740074-0074-0074-0074-007400740101', 'milestone-go-live-0904', 'Go-Live Milestone', 'pending', 'active')
on conflict (id) do nothing;

-- G6 Dashboard
insert into public.csd_operations_metrics (id, organization_id, metrics_key, customer_health_score, open_ticket_count, sla_compliance_score, deployment_status_score, renewal_forecast_count, adoption_rate, overall_delivery_score, status)
values ('045a011a-045a-045a-045a-045a011a1b01', '11111111-1111-1111-1111-111111111111', 'csd-metrics-0904', 92.00, 8, 96.00, 94.00, 12, 78.50, 93.50, 'active')
on conflict (id) do nothing;

insert into public.csd_operations_health (id, organization_id, health_key, overall_score, disaster_recovery_mode, customer_success_status, support_status, deployment_status, security_status, summary, status)
values ('045b011b-045b-045b-045b-045b011b1c01', '11111111-1111-1111-1111-111111111111', 'csd-health-0904', 94.00, false, 'healthy', 'healthy', 'healthy', 'healthy', 'Customer success and delivery operational', 'healthy')
on conflict (id) do nothing;

insert into public.csd_executive_kpis (id, organization_id, hub_id, kpi_key, kpi_name, kpi_score, status)
values ('045c011c-045c-045c-045c-045c011c1d01', '11111111-1111-1111-1111-111111111111', '00740074-0074-0074-0074-007400740101', 'kpi-exec-0904', 'Executive Delivery KPI', 95.00, 'active')
on conflict (id) do nothing;

insert into public.csd_delivery_failures (id, organization_id, hub_id, failure_key, failure_type, error_code, error_message, status)
values ('045d011d-045d-045d-045d-045d011d1e01', '11111111-1111-1111-1111-111111111111', '00740074-0074-0074-0074-007400740101', 'fail-deploy-0904', 'deployment', 'DEPLOY_TIMEOUT', 'Production deployment timed out', 'open')
on conflict (id) do nothing;

insert into public.csd_audit_logs (id, organization_id, entity_type, action, summary, security_level)
values ('045e011e-045e-045e-045e-045e011e1f01', '11111111-1111-1111-1111-111111111111', 'delivery_hub', 'seed', 'Customer success and delivery seed data loaded', 'standard')
on conflict (id) do nothing;
