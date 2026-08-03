insert into public.ai_orchestration_agents (id, organization_id, name, agent_type, workflow_agent_id, provider_id, model_route_id, capabilities, status)
values
  ('a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a334', '11111111-1111-1111-1111-111111111111', 'Enterprise Business Process Orchestrator', 'enterprise_business_process_framework', null, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a201', '["process_registry","process_designer","approval_engine","task_engine","business_rule_engine","process_execution","process_analytics","process_dashboard"]'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.ai_sessions (id, organization_id, agent_id, session_key, module_source, entity_type, entity_id, context, status, expires_at)
values
  ('a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a534', '11111111-1111-1111-1111-111111111111', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a334', 'northstar-business-process-001', 'enterprise_business_process_framework', 'process_hub', '006a006a-006a-006a-006a-006a006a0101', '{"objective":"Enterprise business process framework for northstar operational workflows"}'::jsonb, 'active', '2026-12-31 23:59:59+00')
on conflict (id) do nothing;

-- M0 Process Hub
insert into public.bpf_process_hubs (id, organization_id, hub_key, hub_name, environment, status)
values ('006a006a-006a-006a-006a-006a006a0101', '11111111-1111-1111-1111-111111111111', 'northstar-business-process', 'Northstar Business Process Hub', 'production', 'active')
on conflict (id) do nothing;

-- M1 Process Registry
insert into public.bpf_business_processes (id, organization_id, hub_id, process_key, process_name, process_type, status)
values ('006b006b-006b-006b-006b-006b006b0201', '11111111-1111-1111-1111-111111111111', '006a006a-006a-006a-006a-006a006a0101', 'proc-onboard-0804', 'Customer Onboarding', 'operational', 'active')
on conflict (id) do nothing;

insert into public.bpf_process_categories (id, organization_id, hub_id, category_key, category_name, category_type, status)
values ('006c006c-006c-006c-006c-006c006c0301', '11111111-1111-1111-1111-111111111111', '006a006a-006a-006a-006a-006a006a0101', 'cat-ops-0804', 'Operations', 'operational', 'active')
on conflict (id) do nothing;

insert into public.bpf_process_versions (id, organization_id, hub_id, version_key, version_number, release_channel, status)
values ('006d006d-006d-006d-006d-006d006d0401', '11111111-1111-1111-1111-111111111111', '006a006a-006a-006a-006a-006a006a0101', 'ver-1-0-0', '1.0.0', 'stable', 'active')
on conflict (id) do nothing;

insert into public.bpf_process_dependencies (id, organization_id, hub_id, dependency_key, dependency_type, dependency_ref, status)
values ('006e006e-006e-006e-006e-006e006e0501', '11111111-1111-1111-1111-111111111111', '006a006a-006a-006a-006a-006a006a0101', 'dep-crm-0804', 'process', 'crm-onboarding', 'active')
on conflict (id) do nothing;

-- M2 Process Designer
insert into public.bpf_process_models (id, organization_id, hub_id, model_key, model_name, model_type, status)
values ('006f006f-006f-006f-006f-006f006f0601', '11111111-1111-1111-1111-111111111111', '006a006a-006a-006a-006a-006a006a0101', 'model-wf-0804', 'Onboarding Workflow', 'workflow', 'active')
on conflict (id) do nothing;

insert into public.bpf_process_steps (id, organization_id, hub_id, step_key, step_name, step_order, status)
values ('00700070-0070-0070-0070-007000700701', '11111111-1111-1111-1111-111111111111', '006a006a-006a-006a-006a-006a006a0101', 'step-verify-0804', 'Verify Account', 1, 'active')
on conflict (id) do nothing;

insert into public.bpf_decision_points (id, organization_id, hub_id, decision_key, decision_name, decision_type, status)
values ('00710071-0071-0071-0071-007100710801', '11111111-1111-1111-1111-111111111111', '006a006a-006a-006a-006a-006a006a0101', 'dec-approve-0804', 'Approval Gateway', 'gateway', 'active')
on conflict (id) do nothing;

insert into public.bpf_reusable_blocks (id, organization_id, hub_id, block_key, block_name, block_type, status)
values ('00720072-0072-0072-0072-007200720901', '11111111-1111-1111-1111-111111111111', '006a006a-006a-006a-006a-006a006a0101', 'block-kyc-0804', 'KYC Subprocess', 'subprocess', 'active')
on conflict (id) do nothing;

-- M3 Approval Engine
insert into public.bpf_approval_rules (id, organization_id, hub_id, rule_key, rule_name, rule_type, status)
values ('00730073-0073-0073-0073-007300730a01', '11111111-1111-1111-1111-111111111111', '006a006a-006a-006a-006a-006a006a0101', 'rule-seq-0804', 'Sequential Approval Rule', 'sequential', 'active')
on conflict (id) do nothing;

insert into public.bpf_sequential_approvals (id, organization_id, hub_id, approval_key, approval_name, approval_order, status)
values ('00740074-0074-0074-0074-007400740b01', '11111111-1111-1111-1111-111111111111', '006a006a-006a-006a-006a-006a006a0101', 'appr-mgr-0804', 'Manager Approval', 1, 'active')
on conflict (id) do nothing;

insert into public.bpf_parallel_approvals (id, organization_id, hub_id, approval_key, approval_name, approver_count, status)
values ('00750075-0075-0075-0075-007500750c01', '11111111-1111-1111-1111-111111111111', '006a006a-006a-006a-006a-006a006a0101', 'appr-par-0804', 'Parallel Review', 3, 'active')
on conflict (id) do nothing;

insert into public.bpf_escalation_rules (id, organization_id, hub_id, escalation_key, escalation_name, escalation_level, status)
values ('00760076-0076-0076-0076-007600760d01', '11111111-1111-1111-1111-111111111111', '006a006a-006a-006a-006a-006a006a0101', 'esc-l1-0804', 'Level 1 Escalation', 1, 'active')
on conflict (id) do nothing;

-- M4 Task Engine
insert into public.bpf_task_assignments (id, organization_id, hub_id, assignment_key, assignment_name, assignee_ref, status)
values ('00770077-0077-0077-0077-007700770e01', '11111111-1111-1111-1111-111111111111', '006a006a-006a-006a-006a-006a006a0101', 'asgn-rev-0804', 'Document Review', 'user-reviewer-001', 'active')
on conflict (id) do nothing;

insert into public.bpf_task_templates (id, organization_id, hub_id, template_key, template_name, template_type, status)
values ('00780078-0078-0078-0078-007800780f01', '11111111-1111-1111-1111-111111111111', '006a006a-006a-006a-006a-006a006a0101', 'tmpl-review-0804', 'Review Task Template', 'standard', 'active')
on conflict (id) do nothing;

insert into public.bpf_recurring_tasks (id, organization_id, hub_id, task_key, task_name, recurrence_pattern, status)
values ('00790079-0079-0079-0079-007900791001', '11111111-1111-1111-1111-111111111111', '006a006a-006a-006a-006a-006a006a0101', 'task-daily-0804', 'Daily Status Check', 'daily', 'active')
on conflict (id) do nothing;

insert into public.bpf_task_sla_policies (id, organization_id, hub_id, policy_key, policy_name, sla_hours, status)
values ('007a007a-007a-007a-007a-007a007a1101', '11111111-1111-1111-1111-111111111111', '006a006a-006a-006a-006a-006a006a0101', 'sla-24h-0804', '24 Hour SLA', 24, 'active')
on conflict (id) do nothing;

-- M5 Business Rule Engine
insert into public.bpf_rule_conditions (id, organization_id, hub_id, condition_key, condition_name, condition_type, status)
values ('007b007b-007b-007b-007b-007b007b1201', '11111111-1111-1111-1111-111111111111', '006a006a-006a-006a-006a-006a006a0101', 'cond-amt-0804', 'Amount Threshold', 'expression', 'active')
on conflict (id) do nothing;

insert into public.bpf_rule_validations (id, organization_id, hub_id, validation_key, validation_name, validation_score, status)
values ('007c007c-007c-007c-007c-007c007c1301', '11111111-1111-1111-1111-111111111111', '006a006a-006a-006a-006a-006a006a0101', 'val-schema-0804', 'Schema Validation', 96.00, 'active')
on conflict (id) do nothing;

insert into public.bpf_rule_calculations (id, organization_id, hub_id, calculation_key, calculation_name, calculation_type, status)
values ('007d007d-007d-007d-007d-007d007d1401', '11111111-1111-1111-1111-111111111111', '006a006a-006a-006a-006a-006a006a0101', 'calc-fee-0804', 'Fee Calculation', 'formula', 'active')
on conflict (id) do nothing;

insert into public.bpf_reusable_rules (id, organization_id, hub_id, rule_key, rule_name, rule_type, status)
values ('007e007e-007e-007e-007e-007e007e1501', '11111111-1111-1111-1111-111111111111', '006a006a-006a-006a-006a-006a006a0101', 'rule-valid-0804', 'Validation Rule', 'validation', 'active')
on conflict (id) do nothing;

-- M6 Process Execution
insert into public.bpf_process_executions (id, organization_id, hub_id, execution_key, execution_name, execution_status, status)
values ('007f007f-007f-007f-007f-007f007f1601', '11111111-1111-1111-1111-111111111111', '006a006a-006a-006a-006a-006a006a0101', 'exec-run-0804', 'Onboarding Run #42', 'running', 'active')
on conflict (id) do nothing;

insert into public.bpf_execution_history (id, organization_id, hub_id, history_key, history_type, history_summary, status)
values ('00800080-0080-0080-0080-008000801701', '11111111-1111-1111-1111-111111111111', '006a006a-006a-006a-006a-006a006a0101', 'hist-state-0804', 'state_change', 'Process moved to approval stage', 'active')
on conflict (id) do nothing;

insert into public.bpf_execution_retries (id, organization_id, hub_id, retry_key, retry_count, retry_reason, status)
values ('00810081-0081-0081-0081-008100811801', '11111111-1111-1111-1111-111111111111', '006a006a-006a-006a-006a-006a006a0101', 'retry-1-0804', 1, 'Transient API failure', 'active')
on conflict (id) do nothing;

-- M7 Process Analytics
insert into public.bpf_execution_analytics (id, organization_id, hub_id, analytics_key, analytics_type, analytics_score, status)
values ('00820082-0082-0082-0082-008200821901', '11111111-1111-1111-1111-111111111111', '006a006a-006a-006a-006a-006a006a0101', 'anly-thru-0804', 'throughput', 94.50, 'active')
on conflict (id) do nothing;

insert into public.bpf_bottleneck_reports (id, organization_id, hub_id, report_key, report_name, bottleneck_score, status)
values ('00830083-0083-0083-0083-008300831a01', '11111111-1111-1111-1111-111111111111', '006a006a-006a-006a-006a-006a006a0101', 'rpt-bneck-0804', 'Approval Bottleneck Report', 72.00, 'active')
on conflict (id) do nothing;

insert into public.bpf_sla_performance_metrics (id, organization_id, hub_id, metric_key, metric_name, sla_score, status)
values ('00840084-0084-0084-0084-008400841b01', '11111111-1111-1111-1111-111111111111', '006a006a-006a-006a-006a-006a006a0101', 'sla-perf-0804', 'SLA Performance', 98.00, 'active')
on conflict (id) do nothing;

-- M8 Business Process Dashboard
insert into public.bpf_process_metrics (id, organization_id, metrics_key, execution_count, average_duration_ms, success_rate, failure_count, bottleneck_score, sla_performance_score, overall_process_score, status)
values ('00850085-0085-0085-0085-008500851c01', '11111111-1111-1111-1111-111111111111', 'process-metrics-0804', 1250, 4500, 97.50, 12, 15.00, 98.00, 94.75, 'active')
on conflict (id) do nothing;

insert into public.bpf_process_health (id, organization_id, health_key, overall_score, disaster_recovery_mode, pending_approvals_count, active_process_count, task_queue_depth, framework_health_status, summary, status)
values ('00860086-0086-0086-0086-008600861d01', '11111111-1111-1111-1111-111111111111', 'process-health-0804', 95.00, false, 3, 42, 8, 'healthy', 'Business process framework operational', 'healthy')
on conflict (id) do nothing;

insert into public.bpf_failed_process_records (id, organization_id, hub_id, record_key, record_name, failure_type, error_message, status)
values ('00870087-0087-0087-0087-008700871e01', '11111111-1111-1111-1111-111111111111', '006a006a-006a-006a-006a-006a006a0101', 'fail-rec-0804', 'Failed Onboarding Step', 'execution', 'Timeout waiting for external API', 'open')
on conflict (id) do nothing;

insert into public.bpf_process_failures (id, organization_id, hub_id, failure_key, failure_type, error_code, error_message, status)
values ('00880088-0088-0088-0088-008800882001', '11111111-1111-1111-1111-111111111111', '006a006a-006a-006a-006a-006a006a0101', 'fail-exec-0804', 'execution', 'EXEC_TIMEOUT', 'Process execution timed out after 30 minutes', 'open')
on conflict (id) do nothing;

insert into public.bpf_audit_logs (id, organization_id, entity_type, action, summary, security_level)
values ('00890089-0089-0089-0089-008900892101', '11111111-1111-1111-1111-111111111111', 'process_hub', 'seed', 'Enterprise business process framework seed data loaded', 'standard')
on conflict (id) do nothing;
