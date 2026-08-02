insert into public.sales_pipelines (id, organization_id, name, code, description, is_default)
values
  ('e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e1e101', '11111111-1111-1111-1111-111111111111', 'Enterprise Sales', 'ENT', 'Primary B2B enterprise sales pipeline', true),
  ('e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e1e102', '11111111-1111-1111-1111-111111111111', 'Mid-Market', 'MM', 'Mid-market and SMB sales pipeline', false)
on conflict (id) do nothing;

insert into public.sales_pipeline_stages (id, organization_id, pipeline_id, name, sort_order, probability, is_closed_won, is_closed_lost)
values
  ('e2e2e2e2-e2e2-e2e2-e2e2-e2e2e2e2e201', '11111111-1111-1111-1111-111111111111', 'e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e1e101', 'Prospecting', 1, 10, false, false),
  ('e2e2e2e2-e2e2-e2e2-e2e2-e2e2e2e2e202', '11111111-1111-1111-1111-111111111111', 'e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e1e101', 'Qualification', 2, 25, false, false),
  ('e2e2e2e2-e2e2-e2e2-e2e2-e2e2e2e2e203', '11111111-1111-1111-1111-111111111111', 'e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e1e101', 'Proposal', 3, 50, false, false),
  ('e2e2e2e2-e2e2-e2e2-e2e2-e2e2e2e2e204', '11111111-1111-1111-1111-111111111111', 'e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e1e101', 'Negotiation', 4, 75, false, false),
  ('e2e2e2e2-e2e2-e2e2-e2e2-e2e2e2e2e205', '11111111-1111-1111-1111-111111111111', 'e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e1e101', 'Closed Won', 5, 100, true, false),
  ('e2e2e2e2-e2e2-e2e2-e2e2-e2e2e2e2e206', '11111111-1111-1111-1111-111111111111', 'e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e1e101', 'Closed Lost', 6, 0, false, true)
on conflict (id) do nothing;

insert into public.sales_leads (id, organization_id, client_id, lead_name, company_name, email, phone, source, status, score, assigned_to)
values
  ('e3e3e3e3-e3e3-e3e3-e3e3-e3e3e3e3e301', '11111111-1111-1111-1111-111111111111', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee03', 'Sara Chen', 'Helio Health', 'sara@heliohealth.com', '+1 617 555 0201', 'inbound', 'qualified', 82, '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c01'),
  ('e3e3e3e3-e3e3-e3e3-e3e3-e3e3e3e3e302', '11111111-1111-1111-1111-111111111111', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee04', 'Tom Bradley', 'Summit Retail', 'tom@summitretail.com', '+1 312 555 0202', 'referral', 'contacted', 71, '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c02'),
  ('e3e3e3e3-e3e3-e3e3-e3e3-e3e3e3e3e303', '11111111-1111-1111-1111-111111111111', null, 'Maria Gonzalez', 'NovaTech Solutions', 'maria@novatech.io', '+1 415 555 0203', 'outbound', 'new', 45, null)
on conflict (id) do nothing;

insert into public.sales_opportunities (id, organization_id, opportunity_number, name, description, pipeline_id, stage_id, client_id, contact_id, project_id, assigned_to, amount, probability, expected_close_date, status)
values
  ('e4e4e4e4-e4e4-e4e4-e4e4-e4e4e4e4e401', '11111111-1111-1111-1111-111111111111', 'OPP-2026-0088', 'Northstar Enterprise Expansion', 'Annual platform expansion for Northstar Labs', 'e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e1e101', 'e2e2e2e2-e2e2-e2e2-e2e2-e2e2e2e2e204', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee01', 'dddddddd-dddd-dddd-dddd-dddddddddd01', 'ffffffff-ffff-ffff-ffff-ffffffffff01', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c01', 284000.00, 75, '2026-09-15', 'open'),
  ('e4e4e4e4-e4e4-e4e4-e4e4-e4e4e4e4e402', '11111111-1111-1111-1111-111111111111', 'OPP-2026-0089', 'Helio Health Platform License', 'Healthcare compliance module deployment', 'e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e1e101', 'e2e2e2e2-e2e2-e2e2-e2e2-e2e2e2e2e203', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee03', 'dddddddd-dddd-dddd-dddd-dddddddddd03', null, '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c02', 48000.00, 50, '2026-08-30', 'open'),
  ('e4e4e4e4-e4e4-e4e4-e4e4-e4e4e4e4e403', '11111111-1111-1111-1111-111111111111', 'OPP-2026-0075', 'Apex Commerce Renewal', 'Annual renewal with upsell', 'e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e1e101', 'e2e2e2e2-e2e2-e2e2-e2e2-e2e2e2e2e205', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee02', 'dddddddd-dddd-dddd-dddd-dddddddddd02', null, '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c01', 96000.00, 100, '2026-07-01', 'won')
on conflict (id) do nothing;

update public.sales_opportunities set won_at = '2026-07-01 14:00:00+00', status = 'won' where id = 'e4e4e4e4-e4e4-e4e4-e4e4-e4e4e4e4e403';

insert into public.sales_quotes (id, organization_id, quote_number, opportunity_id, client_id, title, status, total_amount, valid_until)
values
  ('e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e501', '11111111-1111-1111-1111-111111111111', 'QT-2026-0042', 'e4e4e4e4-e4e4-e4e4-e4e4-e4e4e4e4e401', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee01', 'Northstar Enterprise Expansion Proposal', 'sent', 284000.00, '2026-09-01'),
  ('e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e502', '11111111-1111-1111-1111-111111111111', 'QT-2026-0043', 'e4e4e4e4-e4e4-e4e4-e4e4-e4e4e4e4e402', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee03', 'Helio Health Platform License', 'draft', 48000.00, '2026-08-15')
on conflict (id) do nothing;

insert into public.sales_quote_items (id, quote_id, description, quantity, unit_price, line_total)
values
  ('e6e6e6e6-e6e6-e6e6-e6e6-e6e6e6e6e601', 'e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e501', 'Enterprise Platform License (100 seats)', 100, 2400.00, 240000.00),
  ('e6e6e6e6-e6e6-e6e6-e6e6-e6e6e6e6e602', 'e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e501', 'Implementation Services', 1, 44000.00, 44000.00),
  ('e6e6e6e6-e6e6-e6e6-e6e6-e6e6e6e6e603', 'e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e502', 'Healthcare Compliance Module', 1, 48000.00, 48000.00)
on conflict (id) do nothing;

insert into public.sales_forecasts (id, organization_id, forecast_period, forecast_date, pipeline_value, weighted_value, closed_value, notes)
values
  ('e7e7e7e7-e7e7-e7e7-e7e7-e7e7e7e7e701', '11111111-1111-1111-1111-111111111111', 'Q3 2026', '2026-08-01', 428000.00, 253000.00, 96000.00, 'Strong pipeline with two enterprise deals in negotiation'),
  ('e7e7e7e7-e7e7-e7e7-e7e7-e7e7e7e7e702', '11111111-1111-1111-1111-111111111111', 'Q4 2026', '2026-08-01', 185000.00, 92500.00, 0, 'Early-stage Q4 pipeline build')
on conflict (id) do nothing;

insert into public.sales_activities (id, organization_id, opportunity_id, lead_id, activity_type, subject, description, due_at, assigned_to)
values
  ('e8e8e8e8-e8e8-e8e8-e8e8-e8e8e8e8e801', '11111111-1111-1111-1111-111111111111', 'e4e4e4e4-e4e4-e4e4-e4e4-e4e4e4e4e401', null, 'task', 'Send revised proposal', 'Update pricing per Mina Park feedback', '2026-08-05 17:00:00+00', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c01'),
  ('e8e8e8e8-e8e8-e8e8-e8e8-e8e8e8e8e802', '11111111-1111-1111-1111-111111111111', null, 'e3e3e3e3-e3e3-e3e3-e3e3-e3e3e3e3e302', 'follow_up', 'Follow up on Summit Retail demo', 'Schedule second demo with decision makers', '2026-08-06 10:00:00+00', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c02')
on conflict (id) do nothing;

insert into public.sales_meetings (id, organization_id, opportunity_id, lead_id, title, location, meeting_url, scheduled_at, duration_minutes, status, attendee_names)
values
  ('e9e9e9e9-e9e9-e9e9-e9e9-e9e9e9e9e901', '11111111-1111-1111-1111-111111111111', 'e4e4e4e4-e4e4-e4e4-e4e4-e4e4e4e4e401', null, 'Northstar Contract Review', 'Zoom', 'https://meet.example.com/northstar-review', '2026-08-04 15:00:00+00', 60, 'scheduled', 'Mina Park, Alex Rivera'),
  ('e9e9e9e9-e9e9-e9e9-e9e9-e9e9e9e9e902', '11111111-1111-1111-1111-111111111111', null, 'e3e3e3e3-e3e3-e3e3-e3e3-e3e3e3e3e301', 'Helio Health Discovery Call', 'Phone', '', '2026-08-03 11:00:00+00', 30, 'completed', 'Sara Chen')
on conflict (id) do nothing;

insert into public.sales_call_logs (id, organization_id, opportunity_id, lead_id, direction, phone_number, duration_seconds, outcome, notes, called_at)
values
  ('eaeaeaea-eaea-eaea-eaea-eaeaeaeaea01', '11111111-1111-1111-1111-111111111111', 'e4e4e4e4-e4e4-e4e4-e4e4-e4e4e4e4e401', null, 'outbound', '+1 415 555 0148', 1245, 'connected', 'Discussed contract terms and timeline', '2026-08-02 16:30:00+00'),
  ('eaeaeaea-eaea-eaea-eaea-eaeaeaeaea02', '11111111-1111-1111-1111-111111111111', null, 'e3e3e3e3-e3e3-e3e3-e3e3-e3e3e3e3e303', 'outbound', '+1 415 555 0203', 420, 'voicemail', 'Left voicemail about product demo', '2026-08-01 09:15:00+00')
on conflict (id) do nothing;

insert into public.sales_email_tracking (id, organization_id, opportunity_id, lead_id, subject, recipient_email, status, sent_at, opened_at)
values
  ('ebebebeb-ebeb-ebeb-ebeb-ebebebebeb01', '11111111-1111-1111-1111-111111111111', 'e4e4e4e4-e4e4-e4e4-e4e4-e4e4e4e4e401', null, 'Northstar Expansion Proposal — QT-2026-0042', 'ops@northstarlabs.com', 'opened', '2026-08-01 10:00:00+00', '2026-08-01 14:22:00+00'),
  ('ebebebeb-ebeb-ebeb-ebeb-ebebebebeb02', '11111111-1111-1111-1111-111111111111', null, 'e3e3e3e3-e3e3-e3e3-e3e3-e3e3e3e3e301', 'Helio Health — Next Steps', 'sara@heliohealth.com', 'clicked', '2026-07-28 11:00:00+00', '2026-07-28 11:45:00+00')
on conflict (id) do nothing;

insert into public.sales_targets (id, organization_id, employee_id, period_label, target_amount, achieved_amount, period_start, period_end)
values
  ('ecececec-ecec-ecec-ecec-ececececec01', '11111111-1111-1111-1111-111111111111', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c01', 'Q3 2026', 500000.00, 96000.00, '2026-07-01', '2026-09-30'),
  ('ecececec-ecec-ecec-ecec-ececececec02', '11111111-1111-1111-1111-111111111111', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c02', 'Q3 2026', 350000.00, 0, '2026-07-01', '2026-09-30')
on conflict (id) do nothing;

insert into public.sales_commissions (id, organization_id, employee_id, opportunity_id, commission_rate, commission_amount, status, calculated_at)
values
  ('edededed-eded-eded-eded-ededededed01', '11111111-1111-1111-1111-111111111111', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c01', 'e4e4e4e4-e4e4-e4e4-e4e4-e4e4e4e4e403', 8.00, 7680.00, 'approved', '2026-07-02 09:00:00+00')
on conflict (id) do nothing;

insert into public.sales_win_loss_records (id, organization_id, opportunity_id, outcome, reason, competitor, amount, recorded_at)
values
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee91', '11111111-1111-1111-1111-111111111111', 'e4e4e4e4-e4e4-e4e4-e4e4-e4e4e4e4e403', 'won', 'Competitive pricing and strong relationship', '', 96000.00, '2026-07-01 14:00:00+00')
on conflict (id) do nothing;

insert into public.sales_audit_logs (id, organization_id, entity_type, entity_id, action, summary)
values
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee92', '11111111-1111-1111-1111-111111111111', 'opportunity', 'e4e4e4e4-e4e4-e4e4-e4e4-e4e4e4e4e401', 'create', 'Opportunity OPP-2026-0088 created for Northstar Labs'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee93', '11111111-1111-1111-1111-111111111111', 'opportunity', 'e4e4e4e4-e4e4-e4e4-e4e4-e4e4e4e4e403', 'won', 'Opportunity OPP-2026-0075 marked as won')
on conflict (id) do nothing;
