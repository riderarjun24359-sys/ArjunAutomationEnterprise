insert into public.organizations (id, name, slug, status, metadata) values
  ('11111111-1111-1111-1111-111111111111', 'Northstar Labs', 'northstar-labs', 'active', '{"segment":"saas"}')
on conflict (id) do nothing;

insert into public.crm_clients (organization_id, name, status, industry, contact_email, manager_name, revenue, phone, website, address, description) values
  ('11111111-1111-1111-1111-111111111111', 'Northstar Labs', 'active', 'saas', 'ops@northstarlabs.com', 'Mina Park', '$248k', '+1 415 555 0148', 'https://northstarlabs.com', '450 Market Street, San Francisco, CA', 'Series B SaaS company focused on workflow automation.'),
  ('11111111-1111-1111-1111-111111111111', 'Apex Commerce', 'at_risk', 'retail', 'vp@apexcommerce.com', 'Drew Hsu', '$96k', '+1 212 555 0149', 'https://apexcommerce.com', '21 Mercer Street, New York, NY', 'Omnichannel retail group expanding into B2B services.');

insert into public.crm_leads (organization_id, company_name, contact_name, stage, score, value, assigned_to) values
  ('11111111-1111-1111-1111-111111111111', 'Helio Health', 'Sara Kim', 'qualified', 82, '$48k', 'Lina Ortiz'),
  ('11111111-1111-1111-1111-111111111111', 'Summit Retail', 'Tom Reed', 'proposal', 71, '$67k', 'Jordan Lee');

insert into public.crm_deals (organization_id, client_name, value, close_date, stage, probability, revenue_metric) values
  ('11111111-1111-1111-1111-111111111111', 'Northstar Labs', '$124k', '2026-08-28', 'negotiation', 74, '+$18k ARR'),
  ('11111111-1111-1111-1111-111111111111', 'Apex Commerce', '$84k', '2026-09-14', 'proposal', 61, '+$12k ARR');

insert into public.crm_activities (organization_id, activity_type, title, detail, due_at) values
  ('11111111-1111-1111-1111-111111111111', 'call', 'Discovery call completed', 'Discussed implementation timeline', '10 mins ago'),
  ('11111111-1111-1111-1111-111111111111', 'meeting', 'Executive review', 'Shared revenue projection', '1 hr ago'),
  ('11111111-1111-1111-1111-111111111111', 'email', 'Proposal sent', 'Follow-up scheduled for Friday', 'Today');

insert into public.crm_tasks (organization_id, title, assignee, due_date, priority, status) values
  ('11111111-1111-1111-1111-111111111111', 'Prepare onboarding checklist', 'Mina Park', '2026-08-04', 'high', 'pending'),
  ('11111111-1111-1111-1111-111111111111', 'Review contract terms', 'Drew Hsu', '2026-08-06', 'medium', 'in_progress');
