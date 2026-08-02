insert into public.ai_agents (id, organization_id, name, description, model, system_prompt, status, temperature, max_tokens, config)
values
  ('19191919-1919-1919-1919-191919191901', '11111111-1111-1111-1111-111111111111', 'Ops Copilot', 'Operations assistant for task triage and routing', 'gpt-4o', 'You are an enterprise operations copilot. Triage tasks, summarize status, and recommend next actions.', 'active', 0.50, 4096, '{"tools":["tasks","projects"]}'::jsonb),
  ('19191919-1919-1919-1919-191919191902', '11111111-1111-1111-1111-111111111111', 'Finance Analyst', 'Finance workflow assistant for invoice and payment alerts', 'gpt-4o-mini', 'You analyze finance events and draft concise alerts for finance operators.', 'active', 0.30, 2048, '{"tools":["finance","clients"]}'::jsonb)
on conflict (id) do nothing;

insert into public.workflow_templates (id, organization_id, name, description, category, definition, is_public)
values
  ('1a1a1a1a-1a1a-1a1a-1a1a-1a1a1a1a1a01', '11111111-1111-1111-1111-111111111111', 'Client Onboarding', 'Automate client onboarding notifications and task creation', 'onboarding', '{"triggers":["client.created"],"actions":["notify","create_task"]}'::jsonb, true),
  ('1a1a1a1a-1a1a-1a1a-1a1a-1a1a1a1a1a02', '11111111-1111-1111-1111-111111111111', 'Invoice Reminder', 'Send reminders for overdue invoices', 'finance', '{"triggers":["invoice.overdue"],"actions":["email","notify"]}'::jsonb, true)
on conflict (id) do nothing;

insert into public.workflows (id, organization_id, template_id, agent_id, name, description, status, version)
values
  ('2b2b2b2b-2b2b-2b2b-2b2b-2b2b2b2b2b01', '11111111-1111-1111-1111-111111111111', '1a1a1a1a-1a1a-1a1a-1a1a-1a1a1a1a1a01', '19191919-1919-1919-1919-191919191901', 'Northstar Client Onboarding', 'Onboard new Northstar client accounts with task routing', 'active', 1),
  ('2b2b2b2b-2b2b-2b2b-2b2b-2b2b2b2b2b02', '11111111-1111-1111-1111-111111111111', '1a1a1a1a-1a1a-1a1a-1a1a-1a1a1a1a1a02', '19191919-1919-1919-1919-191919191902', 'Overdue Invoice Escalation', 'Escalate overdue invoices to finance team', 'active', 1),
  ('2b2b2b2b-2b2b-2b2b-2b2b-2b2b2b2b2b03', '11111111-1111-1111-1111-111111111111', null, '19191919-1919-1919-1919-191919191901', 'Weekly Ops Digest', 'Weekly summary of open tasks and project risks', 'paused', 1)
on conflict (id) do nothing;

insert into public.workflow_triggers (id, workflow_id, trigger_type, event_name, config, is_active)
values
  ('3c3c3c3c-3c3c-3c3c-3c3c-3c3c3c3c3c01', '2b2b2b2b-2b2b-2b2b-2b2b-2b2b2b2b2b01', 'event', 'client.created', '{"source":"crm"}'::jsonb, true),
  ('3c3c3c3c-3c3c-3c3c-3c3c-3c3c3c3c3c02', '2b2b2b2b-2b2b-2b2b-2b2b-2b2b2b2b2b02', 'event', 'invoice.overdue', '{"days_overdue":7}'::jsonb, true),
  ('3c3c3c3c-3c3c-3c3c-3c3c-3c3c3c3c3c03', '2b2b2b2b-2b2b-2b2b-2b2b-2b2b2b2b2b03', 'schedule', 'cron.weekly', '{"day":"monday","hour":9}'::jsonb, false)
on conflict (id) do nothing;

insert into public.workflow_actions (id, workflow_id, step_order, action_type, config, agent_id)
values
  ('4d4d4d4d-4d4d-4d4d-4d4d-4d4d4d4d4d01', '2b2b2b2b-2b2b-2b2b-2b2b-2b2b2b2b2b01', 1, 'notify', '{"channel":"slack","template":"client_onboarding"}'::jsonb, '19191919-1919-1919-1919-191919191901'),
  ('4d4d4d4d-4d4d-4d4d-4d4d-4d4d4d4d4d02', '2b2b2b2b-2b2b-2b2b-2b2b-2b2b2b2b2b01', 2, 'create_task', '{"project":"onboarding","priority":"high"}'::jsonb, null),
  ('4d4d4d4d-4d4d-4d4d-4d4d-4d4d4d4d4d03', '2b2b2b2b-2b2b-2b2b-2b2b-2b2b2b2b2b02', 1, 'email', '{"to":"finance@acme.com","template":"invoice_overdue"}'::jsonb, '19191919-1919-1919-1919-191919191902'),
  ('4d4d4d4d-4d4d-4d4d-4d4d-4d4d4d4d4d04', '2b2b2b2b-2b2b-2b2b-2b2b-2b2b2b2b2b02', 2, 'ai_task', '{"prompt":"Summarize overdue invoice context"}'::jsonb, '19191919-1919-1919-1919-191919191902')
on conflict (id) do nothing;

insert into public.workflow_conditions (id, workflow_id, step_order, field, operator, value, logic_group)
values
  ('5e5e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e01', '2b2b2b2b-2b2b-2b2b-2b2b-2b2b2b2b2b01', 1, 'client.status', 'equals', 'active', 'default'),
  ('5e5e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e02', '2b2b2b2b-2b2b-2b2b-2b2b-2b2b2b2b2b02', 1, 'invoice.balance_due', 'greater_than', '0', 'default')
on conflict (id) do nothing;

insert into public.workflow_schedules (id, workflow_id, cron_expression, timezone, next_run_at, last_run_at, is_active)
values
  ('6f6f6f6f-6f6f-6f6f-6f6f-6f6f6f6f6f01', '2b2b2b2b-2b2b-2b2b-2b2b-2b2b2b2b2b03', '0 9 * * 1', 'America/New_York', '2026-08-04 09:00:00+00', '2026-07-28 09:00:00+00', false)
on conflict (id) do nothing;

insert into public.workflow_executions (id, organization_id, workflow_id, status, trigger_type, started_at, completed_at, duration_ms, result, error_message)
values
  ('7a7a7a7a-7a7a-7a7a-7a7a-7a7a7a7a7a01', '11111111-1111-1111-1111-111111111111', '2b2b2b2b-2b2b-2b2b-2b2b-2b2b2b2b2b01', 'completed', 'event', '2026-08-01 10:15:00+00', '2026-08-01 10:15:04+00', 4200, '{"tasks_created":1,"notifications_sent":1}'::jsonb, ''),
  ('7a7a7a7a-7a7a-7a7a-7a7a-7a7a7a7a7a02', '11111111-1111-1111-1111-111111111111', '2b2b2b2b-2b2b-2b2b-2b2b-2b2b2b2b2b02', 'failed', 'event', '2026-08-02 08:30:00+00', '2026-08-02 08:30:02+00', 2100, '{}'::jsonb, 'Email gateway timeout'),
  ('7a7a7a7a-7a7a-7a7a-7a7a-7a7a7a7a7a03', '11111111-1111-1111-1111-111111111111', '2b2b2b2b-2b2b-2b2b-2b2b-2b2b2b2b2b01', 'running', 'manual', '2026-08-02 14:00:00+00', null, 0, '{}'::jsonb, '')
on conflict (id) do nothing;

insert into public.automation_logs (id, organization_id, workflow_id, execution_id, level, message, metadata)
values
  ('8b8b8b8b-8b8b-8b8b-8b8b-8b8b8b8b8b01', '11111111-1111-1111-1111-111111111111', '2b2b2b2b-2b2b-2b2b-2b2b-2b2b2b2b2b01', '7a7a7a7a-7a7a-7a7a-7a7a-7a7a7a7a7a01', 'info', 'Workflow execution started', '{"trigger":"client.created"}'::jsonb),
  ('8b8b8b8b-8b8b-8b8b-8b8b-8b8b8b8b8b02', '11111111-1111-1111-1111-111111111111', '2b2b2b2b-2b2b-2b2b-2b2b-2b2b2b2b2b01', '7a7a7a7a-7a7a-7a7a-7a7a-7a7a7a7a7a01', 'info', 'Notification dispatched to Slack', '{"channel":"#ops"}'::jsonb),
  ('8b8b8b8b-8b8b-8b8b-8b8b-8b8b8b8b8b03', '11111111-1111-1111-1111-111111111111', '2b2b2b2b-2b2b-2b2b-2b2b-2b2b2b2b2b02', '7a7a7a7a-7a7a-7a7a-7a7a-7a7a7a7a7a02', 'error', 'Email gateway timeout after 2s', '{"retry":true}'::jsonb),
  ('8b8b8b8b-8b8b-8b8b-8b8b-8b8b8b8b8b04', '11111111-1111-1111-1111-111111111111', '2b2b2b2b-2b2b-2b2b-2b2b-2b2b2b2b2b03', null, 'warn', 'Weekly digest schedule paused by operator', '{}'::jsonb)
on conflict (id) do nothing;
