insert into public.ai_orchestration_agents (id, organization_id, name, agent_type, workflow_agent_id, provider_id, model_route_id, capabilities, status)
values
  ('a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a348', '11111111-1111-1111-1111-111111111111', 'Enterprise Governance Platform Orchestrator', 'enterprise_governance_platform', null, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a201', '["governance","compliance","audit","data_governance","risk","dashboard"]'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.ai_sessions (id, organization_id, agent_id, session_key, module_source, entity_type, entity_id, context, status, expires_at)
values
  ('a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a548', '11111111-1111-1111-1111-111111111111', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a348', 'northstar-enterprise-governance-001', 'enterprise_governance_platform', 'governance_hub', '00780078-0078-0078-0078-007800780101', '{"objective":"Unified enterprise governance platform"}'::jsonb, 'active', '2026-12-31 23:59:59+00')
on conflict (id) do nothing;

insert into public.egp_governance_hubs (id, organization_id, hub_key, hub_name, environment, governance_tier, status)
values ('00780078-0078-0078-0078-007800780101', '11111111-1111-1111-1111-111111111111', 'northstar-enterprise-governance', 'Northstar Enterprise Governance Hub', 'production', 'enterprise', 'active')
on conflict (id) do nothing;

insert into public.egp_organization_governance (id, organization_id, hub_id, governance_key, governance_name, governance_status, status)
values ('04800100-0480-0480-0480-048001000101', '11111111-1111-1111-1111-111111111111', '00780078-0078-0078-0078-007800780101', 'gov-org-0908', 'Organization Governance', 'active', 'active')
on conflict (id) do nothing;

insert into public.egp_governance_policies (id, organization_id, hub_id, policy_key, policy_name, policy_status, status)
values ('04810101-0481-0481-0481-048101010201', '11111111-1111-1111-1111-111111111111', '00780078-0078-0078-0078-007800780101', 'gov-policy-0908', 'Governance Policy', 'active', 'active')
on conflict (id) do nothing;

insert into public.egp_governance_framework (id, organization_id, hub_id, framework_key, framework_name, framework_status, status)
values ('04820102-0482-0482-0482-048201020301', '11111111-1111-1111-1111-111111111111', '00780078-0078-0078-0078-007800780101', 'gov-framework-0908', 'Governance Framework', 'active', 'active')
on conflict (id) do nothing;

insert into public.egp_governance_reviews (id, organization_id, hub_id, review_key, review_title, review_status, status)
values ('04830103-0483-0483-0483-048301030401', '11111111-1111-1111-1111-111111111111', '00780078-0078-0078-0078-007800780101', 'gov-review-0908', 'Governance Review', 'scheduled', 'active')
on conflict (id) do nothing;

insert into public.egp_governance_dashboards (id, organization_id, hub_id, dashboard_key, dashboard_name, dashboard_status, status)
values ('04840104-0484-0484-0484-048401040501', '11111111-1111-1111-1111-111111111111', '00780078-0078-0078-0078-007800780101', 'gov-dash-0908', 'Governance Dashboard', 'active', 'active')
on conflict (id) do nothing;

insert into public.egp_compliance_framework (id, organization_id, hub_id, framework_key, framework_name, framework_status, status)
values ('04850105-0485-0485-0485-048501050601', '11111111-1111-1111-1111-111111111111', '00780078-0078-0078-0078-007800780101', 'comp-framework-0908', 'Compliance Framework', 'active', 'active')
on conflict (id) do nothing;

insert into public.egp_compliance_controls (id, organization_id, hub_id, control_key, control_name, control_status, status)
values ('04860106-0486-0486-0486-048601060701', '11111111-1111-1111-1111-111111111111', '00780078-0078-0078-0078-007800780101', 'comp-control-0908', 'Compliance Control', 'active', 'active')
on conflict (id) do nothing;

insert into public.egp_compliance_evidence (id, organization_id, hub_id, evidence_key, evidence_title, evidence_status, status)
values ('04870107-0487-0487-0487-048701070801', '11111111-1111-1111-1111-111111111111', '00780078-0078-0078-0078-007800780101', 'comp-evidence-0908', 'Compliance Evidence', 'pending', 'active')
on conflict (id) do nothing;

insert into public.egp_compliance_reports (id, organization_id, hub_id, report_key, report_title, report_status, status)
values ('04880108-0488-0488-0488-048801080901', '11111111-1111-1111-1111-111111111111', '00780078-0078-0078-0078-007800780101', 'comp-report-0908', 'Compliance Report', 'draft', 'active')
on conflict (id) do nothing;

insert into public.egp_compliance_calendar (id, organization_id, hub_id, calendar_key, calendar_name, calendar_status, status)
values ('04890109-0489-0489-0489-048901090a01', '11111111-1111-1111-1111-111111111111', '00780078-0078-0078-0078-007800780101', 'comp-calendar-0908', 'Compliance Calendar', 'active', 'active')
on conflict (id) do nothing;

insert into public.egp_audit_center (id, organization_id, hub_id, audit_key, audit_name, audit_status, status)
values ('048a010a-048a-048a-048a-048a010a0b01', '11111111-1111-1111-1111-111111111111', '00780078-0078-0078-0078-007800780101', 'audit-center-0908', 'Audit Center', 'planned', 'active')
on conflict (id) do nothing;

insert into public.egp_audit_findings (id, organization_id, hub_id, finding_key, finding_title, finding_severity, status)
values ('048b010b-048b-048b-048b-048b010b0c01', '11111111-1111-1111-1111-111111111111', '00780078-0078-0078-0078-007800780101', 'audit-finding-0908', 'Audit Finding', 'medium', 'active')
on conflict (id) do nothing;

insert into public.egp_corrective_actions (id, organization_id, hub_id, action_key, action_title, action_status, status)
values ('048c010c-048c-048c-048c-048c010c0d01', '11111111-1111-1111-1111-111111111111', '00780078-0078-0078-0078-007800780101', 'corrective-0908', 'Corrective Action', 'open', 'active')
on conflict (id) do nothing;

insert into public.egp_audit_evidence (id, organization_id, hub_id, evidence_key, evidence_title, evidence_status, status)
values ('048d010d-048d-048d-048d-048d010d0e01', '11111111-1111-1111-1111-111111111111', '00780078-0078-0078-0078-007800780101', 'audit-evidence-0908', 'Audit Evidence', 'pending', 'active')
on conflict (id) do nothing;

insert into public.egp_audit_analytics (id, organization_id, hub_id, analytics_key, analytics_name, analytics_score, status)
values ('048e010e-048e-048e-048e-048e010e0f01', '11111111-1111-1111-1111-111111111111', '00780078-0078-0078-0078-007800780101', 'audit-analytics-0908', 'Audit Analytics', 88.00, 'active')
on conflict (id) do nothing;

insert into public.egp_data_classification (id, organization_id, hub_id, classification_key, classification_name, classification_level, status)
values ('048f010f-048f-048f-048f-048f010f1001', '11111111-1111-1111-1111-111111111111', '00780078-0078-0078-0078-007800780101', 'data-class-0908', 'Data Classification', 'internal', 'active')
on conflict (id) do nothing;

insert into public.egp_retention_policies (id, organization_id, hub_id, policy_key, policy_name, policy_status, status)
values ('04900110-0490-0490-0490-049001101101', '11111111-1111-1111-1111-111111111111', '00780078-0078-0078-0078-007800780101', 'retention-0908', 'Retention Policy', 'active', 'active')
on conflict (id) do nothing;

insert into public.egp_data_lifecycle (id, organization_id, hub_id, lifecycle_key, lifecycle_name, lifecycle_stage, status)
values ('04910111-0491-0491-0491-049101111201', '11111111-1111-1111-1111-111111111111', '00780078-0078-0078-0078-007800780101', 'data-lifecycle-0908', 'Data Lifecycle', 'active', 'active')
on conflict (id) do nothing;

insert into public.egp_data_ownership (id, organization_id, hub_id, ownership_key, ownership_name, ownership_status, status)
values ('04920112-0492-0492-0492-049201121301', '11111111-1111-1111-1111-111111111111', '00780078-0078-0078-0078-007800780101', 'data-owner-0908', 'Data Ownership', 'active', 'active')
on conflict (id) do nothing;

insert into public.egp_data_quality (id, organization_id, hub_id, quality_key, quality_name, quality_score, status)
values ('04930113-0493-0493-0493-049301131401', '11111111-1111-1111-1111-111111111111', '00780078-0078-0078-0078-007800780101', 'data-quality-0908', 'Data Quality', 100.00, 'active')
on conflict (id) do nothing;

insert into public.egp_risk_register (id, organization_id, hub_id, risk_key, risk_title, risk_severity, status)
values ('04940114-0494-0494-0494-049401141501', '11111111-1111-1111-1111-111111111111', '00780078-0078-0078-0078-007800780101', 'risk-reg-0908', 'Enterprise Risk', 'medium', 'active')
on conflict (id) do nothing;

insert into public.egp_risk_assessment (id, organization_id, hub_id, assessment_key, assessment_title, assessment_score, status)
values ('04950115-0495-0495-0495-049501151601', '11111111-1111-1111-1111-111111111111', '00780078-0078-0078-0078-007800780101', 'risk-assess-0908', 'Risk Assessment', 75.00, 'active')
on conflict (id) do nothing;

insert into public.egp_risk_mitigation (id, organization_id, hub_id, mitigation_key, mitigation_title, mitigation_status, status)
values ('04960116-0496-0496-0496-049601161701', '11111111-1111-1111-1111-111111111111', '00780078-0078-0078-0078-007800780101', 'risk-mitigate-0908', 'Risk Mitigation', 'planned', 'active')
on conflict (id) do nothing;

insert into public.egp_risk_monitoring (id, organization_id, hub_id, monitoring_key, monitoring_name, monitoring_status, status)
values ('04970117-0497-0497-0497-049701171801', '11111111-1111-1111-1111-111111111111', '00780078-0078-0078-0078-007800780101', 'risk-monitor-0908', 'Risk Monitoring', 'active', 'active')
on conflict (id) do nothing;

insert into public.egp_business_continuity (id, organization_id, hub_id, continuity_key, continuity_name, continuity_status, status)
values ('04980118-0498-0498-0498-049801181901', '11111111-1111-1111-1111-111111111111', '00780078-0078-0078-0078-007800780101', 'bcp-0908', 'Business Continuity', 'active', 'active')
on conflict (id) do nothing;

insert into public.egp_governance_metrics (id, organization_id, metrics_key, governance_health_score, compliance_score, enterprise_risk_score, audit_summary_score, data_governance_health_score, overall_governance_score, status)
values ('04990119-0499-0499-0499-049901191a01', '11111111-1111-1111-1111-111111111111', 'egp-metrics-0908', 92.00, 94.50, 18.00, 91.00, 89.00, 91.25, 'active')
on conflict (id) do nothing;

insert into public.egp_governance_health (id, organization_id, health_key, overall_score, disaster_recovery_mode, governance_status, compliance_status, audit_status, data_governance_status, security_status, summary, status)
values ('049a011a-049a-049a-049a-049a011a1b01', '11111111-1111-1111-1111-111111111111', 'egp-health-0908', 91.00, false, 'healthy', 'healthy', 'healthy', 'healthy', 'healthy', 'Enterprise governance platform operational', 'healthy')
on conflict (id) do nothing;

insert into public.egp_compliance_dashboards (id, organization_id, hub_id, dashboard_key, dashboard_name, dashboard_status, status)
values ('049b011b-049b-049b-049b-049b011b1c01', '11111111-1111-1111-1111-111111111111', '00780078-0078-0078-0078-007800780101', 'comp-dash-0908', 'Compliance Dashboard', 'active', 'active')
on conflict (id) do nothing;

insert into public.egp_mission_progress (id, organization_id, hub_id, progress_key, progress_name, progress_percent, status)
values ('049c011c-049c-049c-049c-049c011c1d01', '11111111-1111-1111-1111-111111111111', '00780078-0078-0078-0078-007800780101', 'mission-progress-0908', 'Governance Mission', 82.50, 'active')
on conflict (id) do nothing;

insert into public.egp_governance_failures (id, organization_id, hub_id, failure_key, failure_type, error_code, error_message, status)
values ('049d011d-049d-049d-049d-049d011d1d01', '11111111-1111-1111-1111-111111111111', '00780078-0078-0078-0078-007800780101', 'fail-gov-0908', 'governance', 'GOV_SYNC_FAIL', 'Governance sync failed', 'open')
on conflict (id) do nothing;

insert into public.egp_audit_logs (id, organization_id, entity_type, action, summary, security_level)
values ('049e011e-049e-049e-049e-049e011e1e01', '11111111-1111-1111-1111-111111111111', 'governance_hub', 'seed', 'Enterprise governance platform seed data loaded', 'standard')
on conflict (id) do nothing;
