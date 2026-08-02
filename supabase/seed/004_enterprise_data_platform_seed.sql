-- Sprint 10 seed: canonical enterprise data platform records

insert into public.organizations (id, name, slug, status, metadata)
values
  ('11111111-1111-1111-1111-111111111111', 'Acme Enterprise', 'acme-enterprise', 'active', '{"industry":"software"}'::jsonb)
on conflict (id) do update set
  name = excluded.name,
  slug = excluded.slug,
  status = excluded.status,
  metadata = excluded.metadata;

insert into public.permissions (key, description, resource)
values
  ('dashboard.view', 'View executive dashboard', 'dashboard'),
  ('clients.manage', 'Manage CRM clients', 'crm'),
  ('projects.manage', 'Manage projects', 'projects'),
  ('tasks.manage', 'Manage tasks', 'tasks'),
  ('organization.manage', 'Manage organization settings', 'organization')
on conflict (key) do update set
  description = excluded.description,
  resource = excluded.resource;

insert into public.roles (id, organization_id, name, description, is_system)
values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'super_admin', 'Full platform access', true),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'member', 'Standard workspace member', true)
on conflict (organization_id, name) do nothing;

insert into public.role_permission_grants (role_id, permission_id, action)
select r.id, p.id, 'manage'
from public.roles r
cross join public.permissions p
where r.name = 'super_admin'
on conflict (role_id, permission_id, action) do nothing;

insert into public.companies (id, organization_id, name, industry, website, phone, address, description)
values
  ('cccccccc-cccc-cccc-cccc-cccccccccc01', '11111111-1111-1111-1111-111111111111', 'Northstar Labs', 'saas', 'https://northstarlabs.com', '+1 415 555 0148', '450 Market Street, San Francisco, CA', 'Series B SaaS company focused on workflow automation.'),
  ('cccccccc-cccc-cccc-cccc-cccccccccc02', '11111111-1111-1111-1111-111111111111', 'Apex Commerce', 'retail', 'https://apexcommerce.com', '+1 212 555 0149', '21 Mercer Street, New York, NY', 'Omnichannel retail group expanding into B2B services.'),
  ('cccccccc-cccc-cccc-cccc-cccccccccc03', '11111111-1111-1111-1111-111111111111', 'Helio Health', 'healthcare', null, null, null, 'Digital health platform.'),
  ('cccccccc-cccc-cccc-cccc-cccccccccc04', '11111111-1111-1111-1111-111111111111', 'Summit Retail', 'retail', null, null, null, 'Regional retail chain.')
on conflict (id) do nothing;

insert into public.contacts (id, organization_id, company_id, first_name, last_name, email, phone, title)
values
  ('dddddddd-dddd-dddd-dddd-dddddddddd01', '11111111-1111-1111-1111-111111111111', 'cccccccc-cccc-cccc-cccc-cccccccccc01', 'Ops', 'Team', 'ops@northstarlabs.com', '+1 415 555 0148', 'Operations'),
  ('dddddddd-dddd-dddd-dddd-dddddddddd02', '11111111-1111-1111-1111-111111111111', 'cccccccc-cccc-cccc-cccc-cccccccccc02', 'VP', 'Commerce', 'vp@apexcommerce.com', '+1 212 555 0149', 'VP Sales'),
  ('dddddddd-dddd-dddd-dddd-dddddddddd03', '11111111-1111-1111-1111-111111111111', 'cccccccc-cccc-cccc-cccc-cccccccccc03', 'Sara', 'Kim', 'sara@heliohealth.com', null, 'Director'),
  ('dddddddd-dddd-dddd-dddd-dddddddddd04', '11111111-1111-1111-1111-111111111111', 'cccccccc-cccc-cccc-cccc-cccccccccc04', 'Tom', 'Reed', 'tom@summitretail.com', null, 'Buyer')
on conflict (id) do nothing;

insert into public.clients (id, organization_id, company_id, primary_contact_id, name, status, industry, contact_email, manager_name, revenue, phone, website, address, description, lifecycle_stage, lead_score, deal_value, assigned_to)
values
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee01', '11111111-1111-1111-1111-111111111111', 'cccccccc-cccc-cccc-cccc-cccccccccc01', 'dddddddd-dddd-dddd-dddd-dddddddddd01', 'Northstar Labs', 'active', 'saas', 'ops@northstarlabs.com', 'Mina Park', '$248k', '+1 415 555 0148', 'https://northstarlabs.com', '450 Market Street, San Francisco, CA', 'Series B SaaS company focused on workflow automation.', 'client', null, null, null),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee02', '11111111-1111-1111-1111-111111111111', 'cccccccc-cccc-cccc-cccc-cccccccccc02', 'dddddddd-dddd-dddd-dddd-dddddddddd02', 'Apex Commerce', 'at_risk', 'retail', 'vp@apexcommerce.com', 'Drew Hsu', '$96k', '+1 212 555 0149', 'https://apexcommerce.com', '21 Mercer Street, New York, NY', 'Omnichannel retail group expanding into B2B services.', 'client', null, null, null),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee03', '11111111-1111-1111-1111-111111111111', 'cccccccc-cccc-cccc-cccc-cccccccccc03', 'dddddddd-dddd-dddd-dddd-dddddddddd03', 'Helio Health', 'lead', 'healthcare', 'sara@heliohealth.com', 'Lina Ortiz', '$48k', null, null, null, 'Qualified healthcare lead.', 'qualified', 82, '$48k', 'Lina Ortiz'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee04', '11111111-1111-1111-1111-111111111111', 'cccccccc-cccc-cccc-cccc-cccccccccc04', 'dddddddd-dddd-dddd-dddd-dddddddddd04', 'Summit Retail', 'lead', 'retail', 'tom@summitretail.com', 'Jordan Lee', '$67k', null, null, null, 'Proposal-stage retail lead.', 'proposal', 71, '$67k', 'Jordan Lee')
on conflict (id) do nothing;

insert into public.projects (id, organization_id, client_id, name, status, priority, progress, budget, timeline, owner_name, description, template, client_name, team_size)
values
  ('ffffffff-ffff-ffff-ffff-ffffffffff01', '11111111-1111-1111-1111-111111111111', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee01', 'Northstar Expansion', 'active', 'high', 74, '$284k', 'Q3 2026', 'Mina Park', 'Expand the enterprise implementation footprint across new verticals.', 'Enterprise Delivery', 'Northstar Labs', 8),
  ('ffffffff-ffff-ffff-ffff-ffffffffff02', '11111111-1111-1111-1111-111111111111', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee02', 'FinOps Refresh', 'planning', 'medium', 36, '$92k', 'Q4 2026', 'Drew Hsu', 'Modernize finance automation and reporting readiness.', 'Operational Readiness', 'Apex Commerce', 4)
on conflict (id) do nothing;

insert into public.project_members (project_id, name, role, capacity, status)
values
  ('ffffffff-ffff-ffff-ffff-ffffffffff01', 'Mina Park', 'owner', '92%', 'active'),
  ('ffffffff-ffff-ffff-ffff-ffffffffff01', 'Lina Ortiz', 'manager', '78%', 'active'),
  ('ffffffff-ffff-ffff-ffff-ffffffffff02', 'Drew Hsu', 'owner', '64%', 'active')
on conflict do nothing;

insert into public.project_milestones (project_id, title, due_date, status, progress)
values
  ('ffffffff-ffff-ffff-ffff-ffffffffff01', 'Discovery complete', '2026-08-10', 'completed', 100),
  ('ffffffff-ffff-ffff-ffff-ffffffffff01', 'Pilot launch', '2026-08-24', 'in_progress', 62)
on conflict do nothing;

insert into public.project_time_entries (project_id, project_name, started_at, duration, status)
values
  ('ffffffff-ffff-ffff-ffff-ffffffffff01', 'Northstar Expansion', '09:15', '2h 12m', 'running'),
  ('ffffffff-ffff-ffff-ffff-ffffffffff02', 'FinOps Refresh', '13:40', '1h 05m', 'paused')
on conflict do nothing;

insert into public.project_files (project_id, name, folder, version, updated_at)
values
  ('ffffffff-ffff-ffff-ffff-ffffffffff01', 'Implementation Plan.pdf', 'Planning', 'v3', 'Today'),
  ('ffffffff-ffff-ffff-ffff-ffffffffff01', 'Architecture Diagram.png', 'Design', 'v1', 'Yesterday')
on conflict do nothing;

insert into public.project_comments (project_id, author, body, mentions, attachments)
values
  ('ffffffff-ffff-ffff-ffff-ffffffffff01', 'Mina Park', 'Need final sign-off before the pilot starts.', '["Lina"]'::jsonb, '["plan.pdf"]'::jsonb)
on conflict do nothing;

insert into public.task_labels (id, organization_id, name, color)
values
  ('99999999-9999-9999-9999-999999999901', '11111111-1111-1111-1111-111111111111', 'Infrastructure', 'emerald'),
  ('99999999-9999-9999-9999-999999999902', '11111111-1111-1111-1111-111111111111', 'Client Delivery', 'blue'),
  ('99999999-9999-9999-9999-999999999903', '11111111-1111-1111-1111-111111111111', 'Compliance', 'amber'),
  ('99999999-9999-9999-9999-999999999904', '11111111-1111-1111-1111-111111111111', 'Automation', 'violet'),
  ('99999999-9999-9999-9999-999999999905', '11111111-1111-1111-1111-111111111111', 'Security', 'rose')
on conflict (organization_id, name) do nothing;

insert into public.tasks (id, organization_id, project_id, title, description, status, priority, assignee_name, due_date, estimated_hours, completed_hours, tags)
values
  ('88888888-8888-8888-8888-888888888801', '11111111-1111-1111-1111-111111111111', 'ffffffff-ffff-ffff-ffff-ffffffffff01', 'Finalize enterprise rollout plan', 'Complete the phased rollout strategy for Northstar Labs across all business units.', 'in_progress', 'critical', 'Mina Park', '2026-08-06', 16, 10, array['rollout', 'enterprise']),
  ('88888888-8888-8888-8888-888888888802', '11111111-1111-1111-1111-111111111111', 'ffffffff-ffff-ffff-ffff-ffffffffff01', 'Review integration requirements', 'Audit third-party API integration requirements and document compatibility matrix.', 'todo', 'high', 'Jordan Lee', '2026-08-08', 8, 0, array['integration', 'api']),
  ('88888888-8888-8888-8888-888888888803', '11111111-1111-1111-1111-111111111111', null, 'Prepare SOC 2 evidence package', 'Compile audit evidence for access controls, change management, and incident response.', 'review', 'critical', 'Drew Hsu', '2026-08-05', 24, 22, array['compliance', 'audit']),
  ('88888888-8888-8888-8888-888888888804', '11111111-1111-1111-1111-111111111111', null, 'Automate client onboarding workflow', 'Build end-to-end automation for client provisioning, document collection, and kickoff scheduling.', 'in_progress', 'high', 'Lina Ortiz', '2026-08-12', 32, 18, array['automation', 'onboarding']),
  ('88888888-8888-8888-8888-888888888805', '11111111-1111-1111-1111-111111111111', 'ffffffff-ffff-ffff-ffff-ffffffffff02', 'Resolve production deployment blocker', 'Investigate and fix the CI/CD pipeline failure blocking the FinOps Refresh release.', 'blocked', 'urgent', 'Jordan Lee', '2026-08-03', 6, 2, array['deployment', 'blocker']),
  ('88888888-8888-8888-8888-888888888806', '11111111-1111-1111-1111-111111111111', 'ffffffff-ffff-ffff-ffff-ffffffffff01', 'Complete regression test suite', 'Execute full regression suite for the Q3 release candidate and document results.', 'done', 'medium', 'Sara Chen', '2026-07-30', 12, 12, array['qa', 'release']),
  ('88888888-8888-8888-8888-888888888807', '11111111-1111-1111-1111-111111111111', null, 'Update executive dashboard metrics', 'Refresh KPI definitions and wire new data sources into the executive dashboard.', 'todo', 'medium', null, '2026-08-15', 10, 0, array['analytics', 'dashboard']),
  ('88888888-8888-8888-8888-888888888808', '11111111-1111-1111-1111-111111111111', null, 'Draft vendor security assessment', 'Evaluate third-party vendor security posture and produce risk assessment report.', 'todo', 'high', 'Drew Hsu', '2026-08-01', 14, 0, array['security', 'vendor'])
on conflict (id) do nothing;

insert into public.task_label_assignments (task_id, label_id)
values
  ('88888888-8888-8888-8888-888888888801', '99999999-9999-9999-9999-999999999901'),
  ('88888888-8888-8888-8888-888888888801', '99999999-9999-9999-9999-999999999902'),
  ('88888888-8888-8888-8888-888888888802', '99999999-9999-9999-9999-999999999901'),
  ('88888888-8888-8888-8888-888888888802', '99999999-9999-9999-9999-999999999905')
on conflict do nothing;

insert into public.activity_logs (organization_id, entity_type, action, title, detail, metadata)
values
  ('11111111-1111-1111-1111-111111111111', 'deal', 'update', 'Northstar Labs', 'Negotiation in progress', '{"value":"$124k","stage":"negotiation","probability":74,"revenueMetric":"+$18k ARR","closeDate":"2026-08-28"}'::jsonb),
  ('11111111-1111-1111-1111-111111111111', 'deal', 'update', 'Apex Commerce', 'Proposal submitted', '{"value":"$84k","stage":"proposal","probability":61,"revenueMetric":"+$12k ARR","closeDate":"2026-09-14"}'::jsonb),
  ('11111111-1111-1111-1111-111111111111', 'activity', 'call', 'Discovery call completed', 'Discussed implementation timeline', '{"dueAt":"10 mins ago"}'::jsonb),
  ('11111111-1111-1111-1111-111111111111', 'activity', 'meeting', 'Executive review', 'Shared revenue projection', '{"dueAt":"1 hr ago"}'::jsonb),
  ('11111111-1111-1111-1111-111111111111', 'activity', 'email', 'Proposal sent', 'Follow-up scheduled for Friday', '{"dueAt":"Today"}'::jsonb),
  ('11111111-1111-1111-1111-111111111111', 'crm_task', 'create', 'Prepare onboarding checklist', 'Assigned to Mina Park', '{"assignee":"Mina Park","dueDate":"2026-08-04","priority":"high","status":"pending"}'::jsonb),
  ('11111111-1111-1111-1111-111111111111', 'crm_task', 'update', 'Review contract terms', 'Assigned to Drew Hsu', '{"assignee":"Drew Hsu","dueDate":"2026-08-06","priority":"medium","status":"in_progress"}'::jsonb)
on conflict do nothing;

insert into public.audit_logs (organization_id, entity_type, action, metadata)
values
  ('11111111-1111-1111-1111-111111111111', 'organization', 'view', '{"source":"seed"}'::jsonb),
  ('11111111-1111-1111-1111-111111111111', 'dashboard', 'view', '{"source":"seed"}'::jsonb),
  ('11111111-1111-1111-1111-111111111111', 'project', 'update', '{"project":"Northstar Expansion"}'::jsonb)
on conflict do nothing;

insert into public.notifications (organization_id, title, body, notification_type)
values
  ('11111111-1111-1111-1111-111111111111', 'Workspace ready', 'Enterprise data platform seeded successfully.', 'success'),
  ('11111111-1111-1111-1111-111111111111', 'New deal activity', 'Northstar Labs moved to negotiation.', 'info')
on conflict do nothing;

-- Auto-enroll new profiles into the default organization for RLS access
create or replace function public.handle_new_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  default_org uuid := '11111111-1111-1111-1111-111111111111';
begin
  insert into public.organization_members (organization_id, user_id, role_name, is_active)
  values (default_org, new.id, 'member', true)
  on conflict (organization_id, user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_profile_created on public.user_profiles;
create trigger on_profile_created
after insert on public.user_profiles
for each row execute function public.handle_new_profile();
