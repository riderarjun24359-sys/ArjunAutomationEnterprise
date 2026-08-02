insert into public.support_categories (id, organization_id, name, slug, description)
values
  ('d1d1d1d1-d1d1-d1d1-d1d1-d1d1d1d1d101', '11111111-1111-1111-1111-111111111111', 'Technical Issue', 'technical', 'Software bugs and technical problems'),
  ('d1d1d1d1-d1d1-d1d1-d1d1-d1d1d1d1d102', '11111111-1111-1111-1111-111111111111', 'Billing', 'billing', 'Invoices, payments, and subscription questions'),
  ('d1d1d1d1-d1d1-d1d1-d1d1-d1d1d1d1d103', '11111111-1111-1111-1111-111111111111', 'Feature Request', 'feature-request', 'Product enhancement requests')
on conflict (id) do nothing;

insert into public.support_priorities (id, organization_id, name, level, color, response_hours)
values
  ('d2d2d2d2-d2d2-d2d2-d2d2-d2d2d2d2d201', '11111111-1111-1111-1111-111111111111', 'Critical', 1, '#ef4444', 1),
  ('d2d2d2d2-d2d2-d2d2-d2d2-d2d2d2d2d202', '11111111-1111-1111-1111-111111111111', 'High', 2, '#f97316', 4),
  ('d2d2d2d2-d2d2-d2d2-d2d2-d2d2d2d2d203', '11111111-1111-1111-1111-111111111111', 'Medium', 3, '#eab308', 24),
  ('d2d2d2d2-d2d2-d2d2-d2d2-d2d2d2d2d204', '11111111-1111-1111-1111-111111111111', 'Low', 4, '#22c55e', 72)
on conflict (id) do nothing;

insert into public.support_slas (id, organization_id, name, priority_id, first_response_minutes, resolution_minutes, is_active)
values
  ('d3d3d3d3-d3d3-d3d3-d3d3-d3d3d3d3d301', '11111111-1111-1111-1111-111111111111', 'Critical SLA', 'd2d2d2d2-d2d2-d2d2-d2d2-d2d2d2d2d201', 15, 240, true),
  ('d3d3d3d3-d3d3-d3d3-d3d3-d3d3d3d3d302', '11111111-1111-1111-1111-111111111111', 'Standard SLA', 'd2d2d2d2-d2d2-d2d2-d2d2-d2d2d2d2d203', 60, 480, true)
on conflict (id) do nothing;

insert into public.support_queues (id, organization_id, name, code, description, default_assignee_id, is_active)
values
  ('d4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d401', '11111111-1111-1111-1111-111111111111', 'General Support', 'GEN', 'Default support queue for all incoming tickets', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c01', true),
  ('d4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d402', '11111111-1111-1111-1111-111111111111', 'Enterprise Escalations', 'ESC', 'Priority queue for enterprise customers', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c02', true)
on conflict (id) do nothing;

insert into public.support_tickets (id, organization_id, ticket_number, subject, description, status, category_id, priority_id, sla_id, queue_id, client_id, contact_id, project_id, assigned_agent_id, portal_visible, due_at)
values
  ('d5d5d5d5-d5d5-d5d5-d5d5-d5d5d5d5d501', '11111111-1111-1111-1111-111111111111', 'TKT-2026-01042', 'API integration timeout errors', 'Northstar Labs reporting intermittent 504 errors on webhook endpoints during peak hours.', 'open', 'd1d1d1d1-d1d1-d1d1-d1d1-d1d1d1d1d101', 'd2d2d2d2-d2d2-d2d2-d2d2-d2d2d2d2d202', 'd3d3d3d3-d3d3-d3d3-d3d3-d3d3d3d3d301', 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d402', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee01', 'dddddddd-dddd-dddd-dddd-dddddddddd01', 'ffffffff-ffff-ffff-ffff-ffffffffff01', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c01', true, '2026-08-03 18:00:00+00'),
  ('d5d5d5d5-d5d5-d5d5-d5d5-d5d5d5d5d502', '11111111-1111-1111-1111-111111111111', 'TKT-2026-01043', 'Invoice discrepancy on Q2 billing', 'Apex Commerce needs clarification on duplicate line items in June invoice.', 'pending', 'd1d1d1d1-d1d1-d1d1-d1d1-d1d1d1d1d102', 'd2d2d2d2-d2d2-d2d2-d2d2-d2d2d2d2d203', 'd3d3d3d3-d3d3-d3d3-d3d3-d3d3d3d3d302', 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d401', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee02', 'dddddddd-dddd-dddd-dddd-dddddddddd02', null, '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c02', true, '2026-08-05 12:00:00+00'),
  ('d5d5d5d5-d5d5-d5d5-d5d5-d5d5d5d5d503', '11111111-1111-1111-1111-111111111111', 'TKT-2026-01044', 'Request for bulk export feature', 'Customer requesting CSV export for analytics dashboard data.', 'resolved', 'd1d1d1d1-d1d1-d1d1-d1d1-d1d1d1d1d103', 'd2d2d2d2-d2d2-d2d2-d2d2-d2d2d2d2d204', 'd3d3d3d3-d3d3-d3d3-d3d3-d3d3d3d3d302', 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d401', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee01', null, 'ffffffff-ffff-ffff-ffff-ffffffffff01', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c01', true, null)
on conflict (id) do nothing;

update public.support_tickets set resolved_at = '2026-07-30 16:45:00+00' where id = 'd5d5d5d5-d5d5-d5d5-d5d5-d5d5d5d5d503';

insert into public.support_ticket_notes (id, organization_id, ticket_id, body, is_internal)
values
  ('d6d6d6d6-d6d6-d6d6-d6d6-d6d6d6d6d601', '11111111-1111-1111-1111-111111111111', 'd5d5d5d5-d5d5-d5d5-d5d5-d5d5d5d5d501', 'Investigating load balancer logs — spike correlates with webhook batch processing.', true),
  ('d6d6d6d6-d6d6-d6d6-d6d6-d6d6d6d6d602', '11111111-1111-1111-1111-111111111111', 'd5d5d5d5-d5d5-d5d5-d5d5-d5d5d5d5d501', 'We are actively investigating the timeout issue and will update you shortly.', false),
  ('d6d6d6d6-d6d6-d6d6-d6d6-d6d6d6d6d603', '11111111-1111-1111-1111-111111111111', 'd5d5d5d5-d5d5-d5d5-d5d5-d5d5d5d5d502', 'Forwarded to finance team for invoice reconciliation.', true)
on conflict (id) do nothing;

insert into public.support_ticket_attachments (id, organization_id, ticket_id, file_name, file_url, file_size, mime_type)
values
  ('d7d7d7d7-d7d7-d7d7-d7d7-d7d7d7d7d701', '11111111-1111-1111-1111-111111111111', 'd5d5d5d5-d5d5-d5d5-d5d5-d5d5d5d5d501', 'error-logs.txt', 'https://storage.example.com/support/error-logs.txt', 24576, 'text/plain'),
  ('d7d7d7d7-d7d7-d7d7-d7d7-d7d7d7d7d702', '11111111-1111-1111-1111-111111111111', 'd5d5d5d5-d5d5-d5d5-d5d5-d5d5d5d5d502', 'invoice-june-2026.pdf', 'https://storage.example.com/support/invoice-june-2026.pdf', 102400, 'application/pdf')
on conflict (id) do nothing;

insert into public.support_knowledge_articles (id, organization_id, title, slug, content, category_id, status, view_count)
values
  ('d8d8d8d8-d8d8-d8d8-d8d8-d8d8d8d8d801', '11111111-1111-1111-1111-111111111111', 'Getting Started with Webhooks', 'getting-started-webhooks', 'Configure webhook endpoints in Settings > Integrations. Ensure your endpoint responds within 5 seconds.', 'd1d1d1d1-d1d1-d1d1-d1d1-d1d1d1d1d101', 'published', 142),
  ('d8d8d8d8-d8d8-d8d8-d8d8-d8d8d8d8d802', '11111111-1111-1111-1111-111111111111', 'Understanding Your Invoice', 'understanding-invoice', 'Your invoice includes base subscription, usage overages, and applicable taxes. Contact billing for adjustments.', 'd1d1d1d1-d1d1-d1d1-d1d1-d1d1d1d1d102', 'published', 89)
on conflict (id) do nothing;

insert into public.support_canned_responses (id, organization_id, title, shortcut, body, category_id)
values
  ('d9d9d9d9-d9d9-d9d9-d9d9-d9d9d9d9d901', '11111111-1111-1111-1111-111111111111', 'Acknowledge receipt', '/ack', 'Thank you for contacting support. We have received your request and assigned it to our team.', null),
  ('d9d9d9d9-d9d9-d9d9-d9d9-d9d9d9d9d902', '11111111-1111-1111-1111-111111111111', 'Request more info', '/info', 'To help us resolve this faster, could you please provide additional details or screenshots?', null)
on conflict (id) do nothing;

insert into public.support_escalation_rules (id, organization_id, name, trigger_condition, escalation_level, target_queue_id, notify_agent_id, is_active)
values
  ('dadadada-dada-dada-dada-dadadadada01', '11111111-1111-1111-1111-111111111111', 'SLA breach escalation', 'sla_breach', 1, 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d402', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c02', true),
  ('dadadada-dada-dada-dada-dadadadada02', '11111111-1111-1111-1111-111111111111', 'Critical priority auto-escalate', 'priority_critical', 2, 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d402', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c02', true)
on conflict (id) do nothing;

insert into public.support_satisfaction_ratings (id, organization_id, ticket_id, rating, comment, submitted_at)
values
  ('dbdbdbdb-dbdb-dbdb-dbdb-dbdbdbdbdb01', '11111111-1111-1111-1111-111111111111', 'd5d5d5d5-d5d5-d5d5-d5d5-d5d5d5d5d503', 5, 'Quick resolution and helpful agent. Export feature works perfectly.', '2026-07-31 09:00:00+00')
on conflict (id) do nothing;

insert into public.support_portal_settings (id, organization_id, portal_enabled, welcome_message, allow_ticket_creation, show_knowledge_base, custom_domain)
values
  ('dcdcdcdc-dcdc-dcdc-dcdc-dcdcdcdcdc01', '11111111-1111-1111-1111-111111111111', true, 'Welcome to Acme Support. How can we help you today?', true, true, 'support.acme.example.com')
on conflict (id) do nothing;

insert into public.support_audit_logs (id, organization_id, entity_type, entity_id, action, summary)
values
  ('dddddddd-dddd-dddd-dddd-dddddddddd91', '11111111-1111-1111-1111-111111111111', 'ticket', 'd5d5d5d5-d5d5-d5d5-d5d5-d5d5d5d5d501', 'create', 'Ticket TKT-2026-01042 created for Northstar Labs'),
  ('dddddddd-dddd-dddd-dddd-dddddddddd92', '11111111-1111-1111-1111-111111111111', 'ticket', 'd5d5d5d5-d5d5-d5d5-d5d5-d5d5d5d5d503', 'resolve', 'Ticket TKT-2026-01044 resolved')
on conflict (id) do nothing;
