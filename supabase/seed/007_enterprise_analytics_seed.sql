insert into public.analytics_dashboards (id, organization_id, name, description, is_default, layout)
values
  ('1c1c1c1c-1c1c-1c1c-1c1c-1c1c1c1c1c01', '11111111-1111-1111-1111-111111111111', 'Executive Overview', 'Cross-module KPIs for leadership reviews', true, '{"columns":2,"theme":"executive"}'::jsonb),
  ('1c1c1c1c-1c1c-1c1c-1c1c-1c1c1c1c1c02', '11111111-1111-1111-1111-111111111111', 'Operations Pulse', 'Delivery, tasks, and automation health', false, '{"columns":3,"theme":"operations"}'::jsonb)
on conflict (id) do nothing;

insert into public.analytics_widgets (id, dashboard_id, title, widget_type, metric_key, chart_type, config, sort_order)
values
  ('2d2d2d2d-2d2d-2d2d-2d2d-2d2d2d2d2d01', '1c1c1c1c-1c1c-1c1c-1c1c-1c1c1c1c1c01', 'Total Revenue', 'kpi', 'revenue.total', 'line', '{"format":"currency"}'::jsonb, 1),
  ('2d2d2d2d-2d2d-2d2d-2d2d-2d2d2d2d2d02', '1c1c1c1c-1c1c-1c1c-1c1c-1c1c1c1c1c01', 'Active Clients', 'kpi', 'clients.active', 'bar', '{"format":"number"}'::jsonb, 2),
  ('2d2d2d2d-2d2d-2d2d-2d2d-2d2d2d2d2d03', '1c1c1c1c-1c1c-1c1c-1c1c-1c1c1c1c1c01', 'Project Progress', 'chart', 'projects.progress', 'line', '{"series":"avg_progress"}'::jsonb, 3),
  ('2d2d2d2d-2d2d-2d2d-2d2d-2d2d2d2d2d04', '1c1c1c1c-1c1c-1c1c-1c1c-1c1c1c1c1c02', 'Open Tasks', 'kpi', 'tasks.open', 'bar', '{"format":"number"}'::jsonb, 1),
  ('2d2d2d2d-2d2d-2d2d-2d2d-2d2d2d2d2d05', '1c1c1c1c-1c1c-1c1c-1c1c-1c1c1c1c1c02', 'Workflow Success Rate', 'kpi', 'automation.success_rate', 'line', '{"format":"percent"}'::jsonb, 2)
on conflict (id) do nothing;

insert into public.analytics_metrics (id, organization_id, metric_key, label, category, value, unit, period_start, period_end, metadata)
values
  ('3e3e3e3e-3e3e-3e3e-3e3e-3e3e3e3e3e01', '11111111-1111-1111-1111-111111111111', 'revenue.total', 'Total Revenue', 'finance', 27125.00, 'USD', '2026-07-01', '2026-08-31', '{"source":"invoices"}'::jsonb),
  ('3e3e3e3e-3e3e-3e3e-3e3e-3e3e3e3e3e02', '11111111-1111-1111-1111-111111111111', 'revenue.outstanding', 'Outstanding Invoices', 'finance', 9982.00, 'USD', '2026-07-01', '2026-08-31', '{"source":"invoices"}'::jsonb),
  ('3e3e3e3e-3e3e-3e3e-3e3e-3e3e3e3e3e03', '11111111-1111-1111-1111-111111111111', 'clients.active', 'Active Clients', 'clients', 2.00, 'count', '2026-07-01', '2026-08-31', '{"source":"clients"}'::jsonb),
  ('3e3e3e3e-3e3e-3e3e-3e3e-3e3e3e3e3e04', '11111111-1111-1111-1111-111111111111', 'clients.leads', 'Qualified Leads', 'clients', 2.00, 'count', '2026-07-01', '2026-08-31', '{"source":"clients"}'::jsonb),
  ('3e3e3e3e-3e3e-3e3e-3e3e-3e3e3e3e3e05', '11111111-1111-1111-1111-111111111111', 'projects.active', 'Active Projects', 'delivery', 1.00, 'count', '2026-07-01', '2026-08-31', '{"source":"projects"}'::jsonb),
  ('3e3e3e3e-3e3e-3e3e-3e3e-3e3e3e3e3e06', '11111111-1111-1111-1111-111111111111', 'projects.progress', 'Average Project Progress', 'delivery', 55.00, 'percent', '2026-07-01', '2026-08-31', '{"source":"projects"}'::jsonb),
  ('3e3e3e3e-3e3e-3e3e-3e3e-3e3e3e3e3e07', '11111111-1111-1111-1111-111111111111', 'tasks.open', 'Open Tasks', 'delivery', 5.00, 'count', '2026-07-01', '2026-08-31', '{"source":"tasks"}'::jsonb),
  ('3e3e3e3e-3e3e-3e3e-3e3e-3e3e3e3e3e08', '11111111-1111-1111-1111-111111111111', 'tasks.completed', 'Completed Tasks', 'delivery', 1.00, 'count', '2026-07-01', '2026-08-31', '{"source":"tasks"}'::jsonb),
  ('3e3e3e3e-3e3e-3e3e-3e3e-3e3e3e3e3e09', '11111111-1111-1111-1111-111111111111', 'automation.success_rate', 'Workflow Success Rate', 'automation', 50.00, 'percent', '2026-07-01', '2026-08-31', '{"source":"workflow_executions"}'::jsonb),
  ('3e3e3e3e-3e3e-3e3e-3e3e-3e3e3e3e3e10', '11111111-1111-1111-1111-111111111111', 'expenses.total', 'Total Expenses', 'finance', 2460.00, 'USD', '2026-07-01', '2026-08-31', '{"source":"expenses"}'::jsonb)
on conflict (id) do nothing;

insert into public.analytics_reports (id, organization_id, name, report_type, status, filters, summary, generated_at)
values
  ('4f4f4f4f-4f4f-4f4f-4f4f-4f4f4f4f4f01', '11111111-1111-1111-1111-111111111111', 'Q3 Executive Summary', 'summary', 'published', '{"period":"2026-Q3","modules":["finance","clients","delivery"]}'::jsonb, '{"revenue":27125,"clients":4,"projects":2,"tasks":8}'::jsonb, '2026-08-01 09:00:00+00'),
  ('4f4f4f4f-4f4f-4f4f-4f4f-4f4f4f4f4f02', '11111111-1111-1111-1111-111111111111', 'Automation Performance Review', 'automation', 'published', '{"period":"2026-08","workflows":3}'::jsonb, '{"success_rate":50,"executions":3,"errors":1}'::jsonb, '2026-08-02 14:30:00+00'),
  ('4f4f4f4f-4f4f-4f4f-4f4f-4f4f4f4f4f03', '11111111-1111-1111-1111-111111111111', 'Client Portfolio Health', 'clients', 'draft', '{"lifecycle":["client","lead"]}'::jsonb, '{"active":2,"at_risk":1,"leads":2}'::jsonb, null)
on conflict (id) do nothing;
