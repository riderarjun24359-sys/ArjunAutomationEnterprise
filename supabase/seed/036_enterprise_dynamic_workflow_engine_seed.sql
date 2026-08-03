insert into public.ai_orchestration_agents (id, organization_id, name, agent_type, workflow_agent_id, provider_id, model_route_id, capabilities, status)
values
  ('a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a336', '11111111-1111-1111-1111-111111111111', 'Enterprise Dynamic Workflow Orchestrator', 'enterprise_dynamic_workflow_engine', null, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a201', '["workflow_registry","visual_designer","execution_engine","event_triggers","approval_tasks","workflow_automation","workflow_analytics","workflow_dashboard"]'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.ai_sessions (id, organization_id, agent_id, session_key, module_source, entity_type, entity_id, context, status, expires_at)
values
  ('a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a536', '11111111-1111-1111-1111-111111111111', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a336', 'northstar-workflow-engine-001', 'enterprise_dynamic_workflow_engine', 'workflow_hub', '006c006c-006c-006c-006c-006c006c0101', '{"objective":"Enterprise dynamic workflow engine for northstar operational workflows"}'::jsonb, 'active', '2026-12-31 23:59:59+00')
on conflict (id) do nothing;

-- M0 Workflow Hub
insert into public.dwe_workflow_hubs (id, organization_id, hub_key, hub_name, environment, status)
values ('006c006c-006c-006c-006c-006c006c0101', '11111111-1111-1111-1111-111111111111', 'northstar-workflow-engine', 'Northstar Workflow Engine Hub', 'production', 'active')
on conflict (id) do nothing;

-- M1 Workflow Registry
insert into public.dwe_workflow_definitions (id, organization_id, hub_id, workflow_key, workflow_name, workflow_type, status)
values ('006d006d-006d-006d-006d-006d006d0201', '11111111-1111-1111-1111-111111111111', '006c006c-006c-006c-006c-006c006c0101', 'wf-onboard-0804', 'Customer Onboarding Workflow', 'standard', 'active')
on conflict (id) do nothing;

insert into public.dwe_workflow_categories (id, organization_id, hub_id, category_key, category_name, category_type, status)
values ('006e006e-006e-006e-006e-006e006e0301', '11111111-1111-1111-1111-111111111111', '006c006c-006c-006c-006c-006c006c0101', 'cat-ops-0804', 'Operations', 'operational', 'active')
on conflict (id) do nothing;

insert into public.dwe_workflow_templates (id, organization_id, hub_id, template_key, template_name, template_type, status)
values ('006f006f-006f-006f-006f-006f006f0401', '11111111-1111-1111-1111-111111111111', '006c006c-006c-006c-006c-006c006c0101', 'tpl-std-0804', 'Standard Approval Template', 'standard', 'active')
on conflict (id) do nothing;

insert into public.dwe_workflow_versions (id, organization_id, hub_id, version_key, version_number, release_channel, status)
values ('00700070-0070-0070-0070-007000700501', '11111111-1111-1111-1111-111111111111', '006c006c-006c-006c-006c-006c006c0101', 'ver-1-0-0', '1.0.0', 'stable', 'active')
on conflict (id) do nothing;

-- M2 Visual Designer
insert into public.dwe_workflow_nodes (id, organization_id, hub_id, node_key, node_name, node_type, status)
values ('00710071-0071-0071-0071-007100710601', '11111111-1111-1111-1111-111111111111', '006c006c-006c-006c-006c-006c006c0101', 'node-start-0804', 'Start Node', 'start', 'active')
on conflict (id) do nothing;

insert into public.dwe_workflow_transitions (id, organization_id, hub_id, transition_key, transition_name, source_node_ref, status)
values ('00720072-0072-0072-0072-007200720701', '11111111-1111-1111-1111-111111111111', '006c006c-006c-006c-006c-006c006c0101', 'trn-approve-0804', 'Approve Transition', 'node-start-0804', 'active')
on conflict (id) do nothing;

insert into public.dwe_decision_nodes (id, organization_id, hub_id, decision_key, decision_name, decision_expression, status)
values ('00730073-0073-0073-0073-007300730801', '11111111-1111-1111-1111-111111111111', '006c006c-006c-006c-006c-006c006c0101', 'dec-amount-0804', 'Amount Check', 'amount > 1000', 'active')
on conflict (id) do nothing;

insert into public.dwe_reusable_subflows (id, organization_id, hub_id, subflow_key, subflow_name, subflow_type, status)
values ('00740074-0074-0074-0074-007400740901', '11111111-1111-1111-1111-111111111111', '006c006c-006c-006c-006c-006c006c0101', 'sub-notify-0804', 'Notification Subflow', 'standard', 'active')
on conflict (id) do nothing;

-- M3 Execution Engine
insert into public.dwe_workflow_executions (id, organization_id, hub_id, execution_key, execution_name, execution_status, status)
values ('00750075-0075-0075-0075-007500750a01', '11111111-1111-1111-1111-111111111111', '006c006c-006c-006c-006c-006c006c0101', 'exec-run-0804', 'Onboarding Execution #42', 'running', 'active')
on conflict (id) do nothing;

insert into public.dwe_execution_history (id, organization_id, hub_id, history_key, history_type, history_summary, status)
values ('00760076-0076-0076-0076-007600760b01', '11111111-1111-1111-1111-111111111111', '006c006c-006c-006c-006c-006c006c0101', 'hist-step-0804', 'step', 'Step completed successfully', 'active')
on conflict (id) do nothing;

insert into public.dwe_execution_retries (id, organization_id, hub_id, retry_key, retry_count, retry_status, status)
values ('00770077-0077-0077-0077-007700770c01', '11111111-1111-1111-1111-111111111111', '006c006c-006c-006c-006c-006c006c0101', 'rty-fail-0804', 1, 'pending', 'active')
on conflict (id) do nothing;

insert into public.dwe_execution_rollbacks (id, organization_id, hub_id, rollback_key, rollback_reason, rollback_status, status)
values ('00780078-0078-0078-0078-007800780d01', '11111111-1111-1111-1111-111111111111', '006c006c-006c-006c-006c-006c006c0101', 'rbk-err-0804', 'Validation failed', 'pending', 'active')
on conflict (id) do nothing;

-- M4 Event & Trigger
insert into public.dwe_time_triggers (id, organization_id, hub_id, trigger_key, trigger_name, cron_expression, status)
values ('00790079-0079-0079-0079-007900790e01', '11111111-1111-1111-1111-111111111111', '006c006c-006c-006c-006c-006c006c0101', 'trg-daily-0804', 'Daily Trigger', '0 9 * * *', 'active')
on conflict (id) do nothing;

insert into public.dwe_business_event_triggers (id, organization_id, hub_id, trigger_key, trigger_name, event_type, status)
values ('007a007a-007a-007a-007a-007a007a0f01', '11111111-1111-1111-1111-111111111111', '006c006c-006c-006c-006c-006c006c0101', 'trg-order-0804', 'Order Created', 'order.created', 'active')
on conflict (id) do nothing;

insert into public.dwe_webhook_triggers (id, organization_id, hub_id, trigger_key, trigger_name, webhook_url, status)
values ('007b007b-007b-007b-007b-007b007b1001', '11111111-1111-1111-1111-111111111111', '006c006c-006c-006c-006c-006c006c0101', 'trg-hook-0804', 'Webhook Trigger', 'https://api.example.com/hook', 'active')
on conflict (id) do nothing;

insert into public.dwe_scheduled_triggers (id, organization_id, hub_id, trigger_key, trigger_name, schedule_type, status)
values ('007c007c-007c-007c-007c-007c007c1101', '11111111-1111-1111-1111-111111111111', '006c006c-006c-006c-006c-006c006c0101', 'trg-sched-0804', 'Hourly Trigger', 'interval', 'active')
on conflict (id) do nothing;

-- M5 Approval & Human Tasks
insert into public.dwe_manual_reviews (id, organization_id, hub_id, review_key, review_name, review_status, status)
values ('007d007d-007d-007d-007d-007d007d1201', '11111111-1111-1111-1111-111111111111', '006c006c-006c-006c-006c-006c006c0101', 'rev-pending-0804', 'Pending Manual Review', 'pending', 'active')
on conflict (id) do nothing;

insert into public.dwe_approval_tasks (id, organization_id, hub_id, task_key, task_name, task_status, status)
values ('007e007e-007e-007e-007e-007e007e1301', '11111111-1111-1111-1111-111111111111', '006c006c-006c-006c-006c-006c006c0101', 'tsk-approve-0804', 'Manager Approval', 'pending', 'active')
on conflict (id) do nothing;

insert into public.dwe_escalation_rules (id, organization_id, hub_id, rule_key, rule_name, escalation_level, status)
values ('007f007f-007f-007f-007f-007f007f1401', '11111111-1111-1111-1111-111111111111', '006c006c-006c-006c-006c-006c006c0101', 'esc-l1-0804', 'Level 1 Escalation', 1, 'active')
on conflict (id) do nothing;

insert into public.dwe_sla_trackings (id, organization_id, hub_id, sla_key, sla_name, target_minutes, status)
values ('00800080-0080-0080-0080-008000801501', '11111111-1111-1111-1111-111111111111', '006c006c-006c-006c-006c-006c006c0101', 'sla-24h-0804', '24 Hour SLA', 1440, 'active')
on conflict (id) do nothing;

-- M6 Workflow Automation
insert into public.dwe_automation_notifications (id, organization_id, hub_id, notification_key, notification_name, channel, status)
values ('00810081-0081-0081-0081-008100811601', '11111111-1111-1111-1111-111111111111', '006c006c-006c-006c-006c-006c006c0101', 'ntf-email-0804', 'Email Notification', 'email', 'active')
on conflict (id) do nothing;

insert into public.dwe_automation_api_calls (id, organization_id, hub_id, api_key, api_name, endpoint_url, status)
values ('00820082-0082-0082-0082-008200821701', '11111111-1111-1111-1111-111111111111', '006c006c-006c-006c-006c-006c006c0101', 'api-crm-0804', 'CRM API Call', 'https://api.example.com/crm', 'active')
on conflict (id) do nothing;

insert into public.dwe_automation_integrations (id, organization_id, hub_id, integration_key, integration_name, integration_type, status)
values ('00830083-0083-0083-0083-008300831801', '11111111-1111-1111-1111-111111111111', '006c006c-006c-006c-006c-006c006c0101', 'int-slack-0804', 'Slack Integration', 'rest', 'active')
on conflict (id) do nothing;

-- M7 Workflow Analytics
insert into public.dwe_execution_analytics (id, organization_id, hub_id, analytics_key, analytics_type, analytics_score, status)
values ('00840084-0084-0084-0084-008400841901', '11111111-1111-1111-1111-111111111111', '006c006c-006c-006c-006c-006c006c0101', 'anly-exec-0804', 'execution', 94.50, 'active')
on conflict (id) do nothing;

insert into public.dwe_bottleneck_reports (id, organization_id, hub_id, report_key, report_name, bottleneck_score, status)
values ('00850085-0085-0085-0085-008500851a01', '11111111-1111-1111-1111-111111111111', '006c006c-006c-006c-006c-006c006c0101', 'bnk-approval-0804', 'Approval Bottleneck', 12.50, 'active')
on conflict (id) do nothing;

insert into public.dwe_sla_compliance_metrics (id, organization_id, hub_id, metric_key, metric_name, compliance_rate, status)
values ('00860086-0086-0086-0086-008600861b01', '11111111-1111-1111-1111-111111111111', '006c006c-006c-006c-006c-006c006c0101', 'sla-rate-0804', 'SLA Compliance Rate', 96.00, 'active')
on conflict (id) do nothing;

-- M8 Workflow Dashboard
insert into public.dwe_workflow_metrics (id, organization_id, metrics_key, execution_count, average_duration_ms, failure_rate, success_rate, bottleneck_score, sla_compliance_score, overall_workflow_score, status)
values ('00870087-0087-0087-0087-008700871c01', '11111111-1111-1111-1111-111111111111', 'wf-metrics-0804', 850, 3200, 2.50, 97.50, 8.00, 96.00, 94.75, 'active')
on conflict (id) do nothing;

insert into public.dwe_workflow_health (id, organization_id, health_key, overall_score, disaster_recovery_mode, running_workflows_count, pending_tasks_count, automation_health_status, framework_health_status, summary, status)
values ('00880088-0088-0088-0088-008800881d01', '11111111-1111-1111-1111-111111111111', 'wf-health-0804', 95.00, false, 12, 5, 'healthy', 'healthy', 'Dynamic workflow engine operational', 'healthy')
on conflict (id) do nothing;

insert into public.dwe_failed_executions (id, organization_id, hub_id, failure_key, execution_ref, failure_type, error_message, status)
values ('00890089-0089-0089-0089-008900891e01', '11111111-1111-1111-1111-111111111111', '006c006c-006c-006c-006c-006c006c0101', 'fail-exec-0804', 'exec-run-0804', 'runtime', 'Node execution timeout', 'open')
on conflict (id) do nothing;

insert into public.dwe_workflow_failures (id, organization_id, hub_id, failure_key, failure_type, error_code, error_message, status)
values ('00900090-0090-0090-0090-009000902001', '11111111-1111-1111-1111-111111111111', '006c006c-006c-006c-006c-006c006c0101', 'fail-wf-0804', 'execution', 'WF_TIMEOUT', 'Workflow execution timed out', 'open')
on conflict (id) do nothing;

insert into public.dwe_audit_logs (id, organization_id, entity_type, action, summary, security_level)
values ('00910091-0091-0091-0091-009100912101', '11111111-1111-1111-1111-111111111111', 'workflow_hub', 'seed', 'Enterprise dynamic workflow engine seed data loaded', 'standard')
on conflict (id) do nothing;
