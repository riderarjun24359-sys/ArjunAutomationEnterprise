insert into public.tax_rates (id, organization_id, name, rate_percent, is_default)
values
  ('a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', '11111111-1111-1111-1111-111111111111', 'Standard Sales Tax', 8.50, true)
on conflict (id) do nothing;

insert into public.estimates (id, organization_id, client_id, project_id, number, status, issue_date, valid_until, subtotal, tax_amount, total, currency, notes)
values
  ('b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b201', '11111111-1111-1111-1111-111111111111', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee01', 'ffffffff-ffff-ffff-ffff-ffffffffff01', 'EST-1001', 'sent', '2026-07-15', '2026-08-15', 25000.00, 2125.00, 27125.00, 'USD', 'Northstar expansion phase 2 proposal'),
  ('b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b202', '11111111-1111-1111-1111-111111111111', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee02', 'ffffffff-ffff-ffff-ffff-ffffffffff02', 'EST-1002', 'accepted', '2026-07-20', '2026-09-01', 9200.00, 782.00, 9982.00, 'USD', 'FinOps refresh engagement')
on conflict (id) do nothing;

insert into public.estimate_line_items (id, estimate_id, description, quantity, unit_price, tax_rate_id, amount, sort_order)
values
  ('c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c301', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b201', 'Enterprise implementation services', 1, 25000.00, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 25000.00, 1),
  ('c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c302', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b202', 'Finance automation consulting', 1, 9200.00, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 9200.00, 1)
on conflict (id) do nothing;

insert into public.invoices (id, organization_id, client_id, project_id, estimate_id, number, status, issue_date, due_date, subtotal, tax_amount, total, amount_paid, currency, notes)
values
  ('d4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d401', '11111111-1111-1111-1111-111111111111', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee01', 'ffffffff-ffff-ffff-ffff-ffffffffff01', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b201', 'INV-2001', 'paid', '2026-07-28', '2026-08-28', 25000.00, 2125.00, 27125.00, 27125.00, 'USD', 'Northstar expansion milestone 1'),
  ('d4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d402', '11111111-1111-1111-1111-111111111111', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee02', 'ffffffff-ffff-ffff-ffff-ffffffffff02', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b202', 'INV-2002', 'sent', '2026-08-01', '2026-08-15', 9200.00, 782.00, 9982.00, 0.00, 'USD', 'FinOps refresh kickoff invoice')
on conflict (id) do nothing;

insert into public.invoice_line_items (id, invoice_id, description, quantity, unit_price, tax_rate_id, amount, sort_order)
values
  ('e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e501', 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d401', 'Enterprise implementation services', 1, 25000.00, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 25000.00, 1),
  ('e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e502', 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d402', 'Finance automation consulting', 1, 9200.00, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 9200.00, 1)
on conflict (id) do nothing;

insert into public.payments (id, organization_id, invoice_id, client_id, amount, payment_date, method, reference, status)
values
  ('f6f6f6f6-f6f6-f6f6-f6f6-f6f6f6f6f601', '11111111-1111-1111-1111-111111111111', 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d401', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee01', 27125.00, '2026-08-05', 'wire', 'WIRE-NS-0825', 'completed')
on conflict (id) do nothing;

insert into public.expenses (id, organization_id, project_id, client_id, category, description, amount, expense_date, status, submitted_by)
values
  ('17171717-1717-1717-1717-171717171701', '11111111-1111-1111-1111-111111111111', 'ffffffff-ffff-ffff-ffff-ffffffffff01', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee01', 'travel', 'On-site implementation travel', 1840.00, '2026-07-22', 'approved', 'Mina Park'),
  ('17171717-1717-1717-1717-171717171702', '11111111-1111-1111-1111-111111111111', 'ffffffff-ffff-ffff-ffff-ffffffffff02', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee02', 'software', 'Finance automation tooling license', 620.00, '2026-07-30', 'pending', 'Drew Hsu')
on conflict (id) do nothing;

insert into public.recurring_invoices (id, organization_id, client_id, project_id, title, frequency, next_run_date, end_date, subtotal, tax_amount, total, currency, is_active, notes)
values
  ('18181818-1818-1818-1818-181818181801', '11111111-1111-1111-1111-111111111111', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee01', 'ffffffff-ffff-ffff-ffff-ffffffffff01', 'Northstar monthly support retainer', 'monthly', '2026-09-01', '2027-09-01', 4200.00, 357.00, 4557.00, 'USD', true, 'Monthly support and maintenance')
on conflict (id) do nothing;
