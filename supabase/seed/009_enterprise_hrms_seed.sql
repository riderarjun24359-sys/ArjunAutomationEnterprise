insert into public.departments (id, organization_id, name, code, description)
values
  ('7a7a7a7a-7a7a-7a7a-7a7a-7a7a7a7a7a01', '11111111-1111-1111-1111-111111111111', 'Engineering', 'ENG', 'Product engineering and platform delivery'),
  ('7a7a7a7a-7a7a-7a7a-7a7a-7a7a7a7a7a02', '11111111-1111-1111-1111-111111111111', 'Human Resources', 'HR', 'People operations and talent management'),
  ('7a7a7a7a-7a7a-7a7a-7a7a-7a7a7a7a7a03', '11111111-1111-1111-1111-111111111111', 'Finance', 'FIN', 'Finance and accounting operations')
on conflict (id) do nothing;

insert into public.designations (id, organization_id, title, level, description)
values
  ('7b7b7b7b-7b7b-7b7b-7b7b-7b7b7b7b7b01', '11111111-1111-1111-1111-111111111111', 'Engineering Manager', 'manager', 'Leads engineering teams'),
  ('7b7b7b7b-7b7b-7b7b-7b7b-7b7b7b7b7b02', '11111111-1111-1111-1111-111111111111', 'Senior Software Engineer', 'senior', 'Senior individual contributor'),
  ('7b7b7b7b-7b7b-7b7b-7b7b-7b7b7b7b7b03', '11111111-1111-1111-1111-111111111111', 'HR Business Partner', 'manager', 'HR partner for business units'),
  ('7b7b7b7b-7b7b-7b7b-7b7b-7b7b7b7b7b04', '11111111-1111-1111-1111-111111111111', 'Finance Analyst', 'individual_contributor', 'Financial planning and analysis')
on conflict (id) do nothing;

insert into public.employees (id, organization_id, employee_code, first_name, last_name, email, phone, department_id, designation_id, status, employment_type, hire_date, base_salary)
values
  ('7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c01', '11111111-1111-1111-1111-111111111111', 'EMP-001', 'Alex', 'Rivera', 'alex.rivera@acme.example', '+1 415 555 0201', '7a7a7a7a-7a7a-7a7a-7a7a-7a7a7a7a7a01', '7b7b7b7b-7b7b-7b7b-7b7b-7b7b7b7b7b01', 'active', 'full_time', '2024-03-15', 145000),
  ('7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c02', '11111111-1111-1111-1111-111111111111', 'EMP-002', 'Jordan', 'Lee', 'jordan.lee@acme.example', '+1 415 555 0202', '7a7a7a7a-7a7a-7a7a-7a7a-7a7a7a7a7a01', '7b7b7b7b-7b7b-7b7b-7b7b-7b7b7b7b7b02', 'active', 'full_time', '2024-06-01', 125000),
  ('7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c03', '11111111-1111-1111-1111-111111111111', 'EMP-003', 'Sam', 'Patel', 'sam.patel@acme.example', '+1 415 555 0203', '7a7a7a7a-7a7a-7a7a-7a7a-7a7a7a7a7a02', '7b7b7b7b-7b7b-7b7b-7b7b-7b7b7b7b7b03', 'active', 'full_time', '2023-11-10', 98000),
  ('7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c04', '11111111-1111-1111-1111-111111111111', 'EMP-004', 'Taylor', 'Nguyen', 'taylor.nguyen@acme.example', '+1 415 555 0204', '7a7a7a7a-7a7a-7a7a-7a7a-7a7a7a7a7a03', '7b7b7b7b-7b7b-7b7b-7b7b-7b7b7b7b7b04', 'active', 'full_time', '2025-01-20', 92000)
on conflict (id) do nothing;

update public.departments set head_employee_id = '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c01' where id = '7a7a7a7a-7a7a-7a7a-7a7a-7a7a7a7a7a01';
update public.departments set head_employee_id = '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c03' where id = '7a7a7a7a-7a7a-7a7a-7a7a-7a7a7a7a7a02';
update public.employees set manager_id = '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c01' where id = '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c02';

insert into public.hr_teams (id, organization_id, name, slug, department_id, lead_employee_id, description)
values
  ('7d7d7d7d-7d7d-7d7d-7d7d-7d7d7d7d7d01', '11111111-1111-1111-1111-111111111111', 'Platform Squad', 'platform-squad', '7a7a7a7a-7a7a-7a7a-7a7a-7a7a7a7a7a01', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c01', 'Core platform engineering squad'),
  ('7d7d7d7d-7d7d-7d7d-7d7d-7d7d7d7d7d02', '11111111-1111-1111-1111-111111111111', 'People Ops', 'people-ops', '7a7a7a7a-7a7a-7a7a-7a7a-7a7a7a7a7a02', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c03', 'HR operations and employee experience')
on conflict (id) do nothing;

insert into public.hr_team_members (id, team_id, employee_id, role_name)
values
  ('7e7e7e7e-7e7e-7e7e-7e7e-7e7e7e7e7e01', '7d7d7d7d-7d7d-7d7d-7d7d-7d7d7d7d7d01', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c01', 'lead'),
  ('7e7e7e7e-7e7e-7e7e-7e7e-7e7e7e7e7e02', '7d7d7d7d-7d7d-7d7d-7d7d-7d7d7d7d7d01', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c02', 'member'),
  ('7e7e7e7e-7e7e-7e7e-7e7e-7e7e7e7e7e03', '7d7d7d7d-7d7d-7d7d-7d7d-7d7d7d7d7d02', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c03', 'lead')
on conflict (id) do nothing;

insert into public.leave_types (id, organization_id, name, code, annual_quota, paid)
values
  ('7f7f7f7f-7f7f-7f7f-7f7f-7f7f7f7f7f01', '11111111-1111-1111-1111-111111111111', 'Annual Leave', 'AL', 20, true),
  ('7f7f7f7f-7f7f-7f7f-7f7f-7f7f7f7f7f02', '11111111-1111-1111-1111-111111111111', 'Sick Leave', 'SL', 10, true),
  ('7f7f7f7f-7f7f-7f7f-7f7f-7f7f7f7f7f03', '11111111-1111-1111-1111-111111111111', 'Unpaid Leave', 'UL', 5, false)
on conflict (id) do nothing;

insert into public.leave_requests (id, organization_id, employee_id, leave_type_id, start_date, end_date, status, reason)
values
  ('8a8a8a8a-8a8a-8a8a-8a8a-8a8a8a8a8a01', '11111111-1111-1111-1111-111111111111', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c02', '7f7f7f7f-7f7f-7f7f-7f7f-7f7f7f7f7f01', '2026-08-10', '2026-08-14', 'approved', 'Family vacation'),
  ('8a8a8a8a-8a8a-8a8a-8a8a-8a8a8a8a8a02', '11111111-1111-1111-1111-111111111111', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c04', '7f7f7f7f-7f7f-7f7f-7f7f-7f7f7f7f7f02', '2026-08-05', '2026-08-06', 'pending', 'Medical appointment')
on conflict (id) do nothing;

insert into public.holidays (id, organization_id, name, holiday_date, region)
values
  ('8b8b8b8b-8b8b-8b8b-8b8b-8b8b8b8b8b01', '11111111-1111-1111-1111-111111111111', 'New Year Day', '2026-01-01', 'global'),
  ('8b8b8b8b-8b8b-8b8b-8b8b-8b8b8b8b8b02', '11111111-1111-1111-1111-111111111111', 'Independence Day', '2026-07-04', 'US'),
  ('8b8b8b8b-8b8b-8b8b-8b8b-8b8b8b8b8b03', '11111111-1111-1111-1111-111111111111', 'Thanksgiving', '2026-11-26', 'US')
on conflict (id) do nothing;

insert into public.attendance_records (id, organization_id, employee_id, work_date, check_in, check_out, status, notes)
values
  ('8c8c8c8c-8c8c-8c8c-8c8c-8c8c8c8c8c01', '11111111-1111-1111-1111-111111111111', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c01', '2026-08-01', '2026-08-01 09:00:00+00', '2026-08-01 18:00:00+00', 'present', ''),
  ('8c8c8c8c-8c8c-8c8c-8c8c-8c8c8c8c8c02', '11111111-1111-1111-1111-111111111111', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c02', '2026-08-01', '2026-08-01 09:15:00+00', '2026-08-01 17:45:00+00', 'present', ''),
  ('8c8c8c8c-8c8c-8c8c-8c8c-8c8c8c8c8c03', '11111111-1111-1111-1111-111111111111', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c02', '2026-08-02', '2026-08-02 09:00:00+00', null, 'remote', 'Working remotely')
on conflict (id) do nothing;

insert into public.payroll_cycles (id, organization_id, name, period_start, period_end, status)
values
  ('8d8d8d8d-8d8d-8d8d-8d8d-8d8d8d8d8d01', '11111111-1111-1111-1111-111111111111', 'July 2026 Payroll', '2026-07-01', '2026-07-31', 'processed'),
  ('8d8d8d8d-8d8d-8d8d-8d8d-8d8d8d8d8d02', '11111111-1111-1111-1111-111111111111', 'August 2026 Payroll', '2026-08-01', '2026-08-31', 'draft')
on conflict (id) do nothing;

insert into public.payroll_entries (id, cycle_id, employee_id, base_salary, allowances, deductions, net_pay, status)
values
  ('8e8e8e8e-8e8e-8e8e-8e8e-8e8e8e8e8e01', '8d8d8d8d-8d8d-8d8d-8d8d-8d8d8d8d8d01', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c01', 145000, 2000, 3500, 143500, 'paid'),
  ('8e8e8e8e-8e8e-8e8e-8e8e-8e8e8e8e8e02', '8d8d8d8d-8d8d-8d8d-8d8d-8d8d8d8d8d01', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c02', 125000, 1500, 2800, 123700, 'paid'),
  ('8e8e8e8e-8e8e-8e8e-8e8e-8e8e8e8e8e03', '8d8d8d8d-8d8d-8d8d-8d8d-8d8d8d8d8d01', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c03', 98000, 1000, 1900, 97100, 'paid')
on conflict (id) do nothing;

insert into public.employee_documents (id, organization_id, employee_id, title, document_type, file_url)
values
  ('8f8f8f8f-8f8f-8f8f-8f8f-8f8f8f8f8f01', '11111111-1111-1111-1111-111111111111', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c01', 'Employment Contract', 'contract', 'https://acme.example/docs/emp-001-contract.pdf'),
  ('8f8f8f8f-8f8f-8f8f-8f8f-8f8f8f8f8f02', '11111111-1111-1111-1111-111111111111', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c02', 'ID Verification', 'identity', 'https://acme.example/docs/emp-002-id.pdf')
on conflict (id) do nothing;

insert into public.performance_reviews (id, organization_id, employee_id, reviewer_id, review_period, rating, summary, status, reviewed_at)
values
  ('9a9a9a9a-9a9a-9a9a-9a9a-9a9a9a9a9a01', '11111111-1111-1111-1111-111111111111', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c02', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c01', 'H1 2026', 4.5, 'Strong delivery and collaboration across platform initiatives.', 'completed', '2026-07-15 00:00:00+00'),
  ('9a9a9a9a-9a9a-9a9a-9a9a-9a9a9a9a9a02', '11111111-1111-1111-1111-111111111111', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c04', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c03', 'H1 2026', 4.0, 'Reliable financial reporting and process improvements.', 'completed', '2026-07-18 00:00:00+00')
on conflict (id) do nothing;

insert into public.job_openings (id, organization_id, title, department_id, designation_id, status, description)
values
  ('9b9b9b9b-9b9b-9b9b-9b9b-9b9b9b9b9b01', '11111111-1111-1111-1111-111111111111', 'Senior Software Engineer', '7a7a7a7a-7a7a-7a7a-7a7a-7a7a7a7a7a01', '7b7b7b7b-7b7b-7b7b-7b7b-7b7b7b7b7b02', 'open', 'Hiring a senior engineer for the platform squad.'),
  ('9b9b9b9b-9b9b-9b9b-9b9b-9b9b9b9b9b02', '11111111-1111-1111-1111-111111111111', 'HR Coordinator', '7a7a7a7a-7a7a-7a7a-7a7a-7a7a7a7a7a02', '7b7b7b7b-7b7b-7b7b-7b7b-7b7b7b7b7b03', 'open', 'Support onboarding and employee lifecycle operations.')
on conflict (id) do nothing;

insert into public.job_candidates (id, opening_id, full_name, email, stage, notes)
values
  ('9c9c9c9c-9c9c-9c9c-9c9c-9c9c9c9c9c01', '9b9b9b9b-9b9b-9b9b-9b9b-9b9b9b9b9b01', 'Morgan Chen', 'morgan.chen@example.com', 'interview', 'Strong backend experience'),
  ('9c9c9c9c-9c9c-9c9c-9c9c-9c9c9c9c9c02', '9b9b9b9b-9b9b-9b9b-9b9b-9b9b9b9b9b01', 'Riley Brooks', 'riley.brooks@example.com', 'screening', 'Referred by engineering team'),
  ('9c9c9c9c-9c9c-9c9c-9c9c-9c9c9c9c9c03', '9b9b9b9b-9b9b-9b9b-9b9b-9b9b9b9b9b02', 'Casey Morgan', 'casey.morgan@example.com', 'applied', 'HR generalist background')
on conflict (id) do nothing;

insert into public.onboarding_plans (id, organization_id, employee_id, status, start_date)
values
  ('9d9d9d9d-9d9d-9d9d-9d9d-9d9d9d9d9d01', '11111111-1111-1111-1111-111111111111', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c04', 'in_progress', '2025-01-20')
on conflict (id) do nothing;

insert into public.onboarding_tasks (id, plan_id, title, status, due_date, completed_at)
values
  ('9e9e9e9e-9e9e-9e9e-9e9e-9e9e9e9e9e01', '9d9d9d9d-9d9d-9d9d-9d9d-9d9d9d9d9d01', 'Complete HR orientation', 'completed', '2025-01-22', '2025-01-21 00:00:00+00'),
  ('9e9e9e9e-9e9e-9e9e-9e9e-9e9e9e9e9e02', '9d9d9d9d-9d9d-9d9d-9d9d-9d9d9d9d9d01', 'Set up payroll profile', 'completed', '2025-01-25', '2025-01-24 00:00:00+00'),
  ('9e9e9e9e-9e9e-9e9e-9e9e-9e9e9e9e9e03', '9d9d9d9d-9d9d-9d9d-9d9d-9d9d9d9d9d01', 'Finance systems access', 'pending', '2025-02-01', null)
on conflict (id) do nothing;

insert into public.offboarding_plans (id, organization_id, employee_id, status, last_working_date)
values
  ('9f9f9f9f-9f9f-9f9f-9f9f-9f9f9f9f9f01', '11111111-1111-1111-1111-111111111111', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c02', 'planned', '2026-12-31')
on conflict (id) do nothing;

insert into public.offboarding_tasks (id, plan_id, title, status, due_date)
values
  ('a0a0a0a0-a0a0-a0a0-a0a0-a0a0a0a0a001', '9f9f9f9f-9f9f-9f9f-9f9f-9f9f9f9f9f01', 'Knowledge transfer sessions', 'pending', '2026-12-15'),
  ('a0a0a0a0-a0a0-a0a0-a0a0-a0a0a0a0a002', '9f9f9f9f-9f9f-9f9f-9f9f-9f9f9f9f9f01', 'Revoke system access', 'pending', '2026-12-31')
on conflict (id) do nothing;

insert into public.org_chart_nodes (id, organization_id, employee_id, department_id, parent_node_id, sort_order)
values
  ('a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a001', '11111111-1111-1111-1111-111111111111', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c01', '7a7a7a7a-7a7a-7a7a-7a7a-7a7a7a7a7a01', null, 1),
  ('a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a002', '11111111-1111-1111-1111-111111111111', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c02', '7a7a7a7a-7a7a-7a7a-7a7a-7a7a7a7a7a01', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a001', 2),
  ('a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a003', '11111111-1111-1111-1111-111111111111', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c03', '7a7a7a7a-7a7a-7a7a-7a7a-7a7a7a7a7a02', null, 3),
  ('a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a004', '11111111-1111-1111-1111-111111111111', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c04', '7a7a7a7a-7a7a-7a7a-7a7a-7a7a7a7a7a03', null, 4)
on conflict (id) do nothing;
