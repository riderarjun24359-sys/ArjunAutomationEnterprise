insert into public.project_management (organization_id, name, status, priority, progress, budget, timeline, owner, description, template, client, team_size) values
  ('11111111-1111-1111-1111-111111111111', 'Northstar Expansion', 'active', 'high', 74, '$284k', 'Q3 2026', 'Mina Park', 'Expand the enterprise implementation footprint across new verticals.', 'Enterprise Delivery', 'Northstar Labs', 8),
  ('11111111-1111-1111-1111-111111111111', 'FinOps Refresh', 'planning', 'medium', 36, '$92k', 'Q4 2026', 'Drew Hsu', 'Modernize finance automation and reporting readiness.', 'Operational Readiness', 'Apex Commerce', 4);

insert into public.project_milestones (project_id, title, due_date, status, progress) values
  ((select id from public.project_management where name='Northstar Expansion' limit 1), 'Discovery complete', '2026-08-10', 'completed', 100),
  ((select id from public.project_management where name='Northstar Expansion' limit 1), 'Pilot launch', '2026-08-24', 'in_progress', 62);

insert into public.project_tasks (project_id, title, status, assignee, due_date, priority) values
  ((select id from public.project_management where name='Northstar Expansion' limit 1), 'Finalize rollout plan', 'in_progress', 'Lina Ortiz', '2026-08-06', 'high'),
  ((select id from public.project_management where name='Northstar Expansion' limit 1), 'Review integration requirements', 'todo', 'Jordan Lee', '2026-08-08', 'medium');

insert into public.project_team_members (project_id, name, role, capacity, status) values
  ((select id from public.project_management where name='Northstar Expansion' limit 1), 'Mina Park', 'owner', '92%', 'active'),
  ((select id from public.project_management where name='Northstar Expansion' limit 1), 'Lina Ortiz', 'manager', '78%', 'active');

insert into public.project_time_entries (project_id, project_name, started_at, duration, status) values
  ((select id from public.project_management where name='Northstar Expansion' limit 1), 'Northstar Expansion', '09:15', '2h 12m', 'running'),
  ((select id from public.project_management where name='FinOps Refresh' limit 1), 'FinOps Refresh', '13:40', '1h 05m', 'paused');

insert into public.project_files (project_id, name, folder, version, updated_at) values
  ((select id from public.project_management where name='Northstar Expansion' limit 1), 'Implementation Plan.pdf', 'Planning', 'v3', 'Today'),
  ((select id from public.project_management where name='Northstar Expansion' limit 1), 'Architecture Diagram.png', 'Design', 'v1', 'Yesterday');

insert into public.project_comments (project_id, author, body, mentions, attachments) values
  ((select id from public.project_management where name='Northstar Expansion' limit 1), 'Mina Park', 'Need final sign-off before the pilot starts.', '["Lina"]', '["plan.pdf"]');
