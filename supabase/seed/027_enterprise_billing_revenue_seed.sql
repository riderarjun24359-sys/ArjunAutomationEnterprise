insert into public.ai_orchestration_agents (id, organization_id, name, agent_type, workflow_agent_id, provider_id, model_route_id, capabilities, status)
values
  ('a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a327', '11111111-1111-1111-1111-111111111111', 'Enterprise Billing & Revenue Orchestrator', 'enterprise_billing_revenue', null, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a201', '["subscription_billing","payment_management","revenue_management","invoice_center","collection_center","financial_analytics","revenue_forecasting","finance_ops_dashboard"]'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.ai_sessions (id, organization_id, agent_id, session_key, module_source, entity_type, entity_id, context, status, expires_at)
values
  ('a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a527', '11111111-1111-1111-1111-111111111111', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a327', 'northstar-billing-001', 'enterprise_billing_revenue', 'billing_account', 'dd01dd01-dd01-dd01-dd01-dd01dd010101', '{"objective":"enterprise billing and revenue platform for northstar-billing account"}'::jsonb, 'active', '2026-12-31 23:59:59+00')
on conflict (id) do nothing;

-- M1 Subscription Billing
insert into public.brv_billing_accounts (id, organization_id, account_key, account_name, currency_code, billing_email, payment_terms_days, tax_id, status)
values
  ('dd01dd01-dd01-dd01-dd01-dd01dd010101', '11111111-1111-1111-1111-111111111111', 'northstar-billing', 'Northstar Billing Account', 'USD', 'billing@northstar.example', 30, 'US-TAX-NS-001', 'active')
on conflict (id) do nothing;

insert into public.brv_billing_cycles (id, organization_id, billing_account_id, cycle_key, billing_cycle, cycle_start_date, cycle_end_date, next_invoice_date, status)
values
  ('dd02dd02-dd02-dd02-dd02-dd02dd020201', '11111111-1111-1111-1111-111111111111', 'dd01dd01-dd01-dd01-dd01-dd01dd010101', 'cycle-monthly-aug2026', 'monthly', '2026-08-01', '2026-08-31', '2026-09-01', 'active')
on conflict (id) do nothing;

insert into public.brv_subscription_billings (id, organization_id, billing_account_id, subscription_key, plan_name, billing_cycle, amount_usd, mrr_usd, arr_usd, quantity, starts_at, renews_at, payment_status, status)
values
  ('dd03dd03-dd03-dd03-dd03-dd03dd030301', '11111111-1111-1111-1111-111111111111', 'dd01dd01-dd01-dd01-dd01-dd01dd010101', 'sub-starter-monthly', 'Starter Plan', 'monthly', 299.00, 299.00, 3588.00, 1, '2026-08-02 00:00:00+00', '2026-09-02 00:00:00+00', 'paid', 'active')
on conflict (id) do nothing;

insert into public.brv_proration_records (id, organization_id, billing_account_id, proration_key, subscription_billing_id, proration_type, prorated_amount_usd, days_remaining, days_in_cycle, effective_date, reason, status)
values
  ('dd04dd04-dd04-dd04-dd04-dd04dd040401', '11111111-1111-1111-1111-111111111111', 'dd01dd01-dd01-dd01-dd01-dd01dd010101', 'proration-trial-conversion', 'dd03dd03-dd03-dd03-dd03-dd03dd030301', 'upgrade', 149.50, 15, 30, '2026-08-02', 'Mid-cycle trial-to-paid conversion proration', 'completed')
on conflict (id) do nothing;

-- M2 Payment Management
insert into public.brv_payment_methods (id, organization_id, billing_account_id, method_key, method_type, last_four, brand, expiry_month, expiry_year, is_default, status)
values
  ('dd05dd05-dd05-dd05-dd05-dd05dd050501', '11111111-1111-1111-1111-111111111111', 'dd01dd01-dd01-dd01-dd01-dd01dd010101', 'pm-visa-default', 'card', '4242', 'visa', 12, 2028, true, 'active')
on conflict (id) do nothing;

insert into public.brv_payment_attempts (id, organization_id, billing_account_id, attempt_key, payment_method_id, amount_usd, currency_code, payment_status, gateway_reference, attempted_at, status)
values
  ('dd06dd06-dd06-dd06-dd06-dd06dd060601', '11111111-1111-1111-1111-111111111111', 'dd01dd01-dd01-dd01-dd01-dd01dd010101', 'pay-aug2026-001', 'dd05dd05-dd05-dd05-dd05-dd05dd050501', 324.42, 'USD', 'succeeded', 'pi_ns_aug2026_001', '2026-08-02 00:05:00+00', 'completed')
on conflict (id) do nothing;

insert into public.brv_refunds (id, organization_id, billing_account_id, refund_key, payment_attempt_id, amount_usd, refund_reason, refund_status, processed_at, status)
values
  ('dd07dd07-dd07-dd07-dd07-dd07dd070701', '11111111-1111-1111-1111-111111111111', 'dd01dd01-dd01-dd01-dd01-dd01dd010101', 'refund-demo-partial', 'dd06dd06-dd06-dd06-dd06-dd06dd060601', 25.00, 'Demo partial refund for billing workflow testing', 'completed', '2026-08-03 10:00:00+00', 'completed')
on conflict (id) do nothing;

insert into public.brv_wallet_balances (id, organization_id, billing_account_id, balance_key, balance_usd, credit_usd, debit_usd, last_transaction_at, status)
values
  ('dd08dd08-dd08-dd08-dd08-dd08dd080801', '11111111-1111-1111-1111-111111111111', 'dd01dd01-dd01-dd01-dd01-dd01dd010101', 'wallet-primary', 25.00, 25.00, 0.00, '2026-08-03 10:00:00+00', 'active')
on conflict (id) do nothing;

-- M3 Revenue Management
insert into public.brv_mrr_snapshots (id, organization_id, billing_account_id, snapshot_key, snapshot_date, mrr_usd, previous_mrr_usd, new_mrr_usd, expansion_mrr_usd, contraction_mrr_usd, churn_mrr_usd, status)
values
  ('dd09dd09-dd09-dd09-dd09-dd09dd090901', '11111111-1111-1111-1111-111111111111', 'dd01dd01-dd01-dd01-dd01-dd01dd010101', 'mrr-daily-0802', '2026-08-02', 299.00, 0.00, 299.00, 0.00, 0.00, 0.00, 'active')
on conflict (id) do nothing;

insert into public.brv_arr_snapshots (id, organization_id, billing_account_id, snapshot_key, snapshot_date, arr_usd, previous_arr_usd, status)
values
  ('dd10dd10-dd10-dd10-dd10-dd10dd101001', '11111111-1111-1111-1111-111111111111', 'dd01dd01-dd01-dd01-dd01-dd01dd010101', 'arr-daily-0802', '2026-08-02', 3588.00, 0.00, 'active')
on conflict (id) do nothing;

insert into public.brv_deferred_revenue (id, organization_id, billing_account_id, deferred_key, period_start, period_end, total_deferred_usd, recognized_usd, remaining_usd, status)
values
  ('dd11dd11-dd11-dd11-dd11-dd11dd111101', '11111111-1111-1111-1111-111111111111', 'dd01dd01-dd01-dd01-dd01-dd01dd010101', 'deferred-aug2026', '2026-08-01', '2026-08-31', 299.00, 9.65, 289.35, 'active')
on conflict (id) do nothing;

insert into public.brv_revenue_recognition (id, organization_id, billing_account_id, recognition_key, deferred_revenue_id, recognized_amount_usd, recognition_date, recognition_type, status)
values
  ('dd12dd12-dd12-dd12-dd12-dd12dd121201', '11111111-1111-1111-1111-111111111111', 'dd01dd01-dd01-dd01-dd01-dd01dd010101', 'recognition-aug-daily', 'dd11dd11-dd11-dd11-dd11-dd11dd111101', 9.65, '2026-08-02', 'subscription', 'recorded')
on conflict (id) do nothing;

-- M4 Invoice Center
insert into public.brv_invoices (id, organization_id, billing_account_id, invoice_key, invoice_number, subtotal_usd, tax_amount, total_usd, amount_due_usd, billing_cycle, invoice_date, due_date, paid_at, payment_status, status)
values
  ('dd13dd13-dd13-dd13-dd13-dd13dd131301', '11111111-1111-1111-1111-111111111111', 'dd01dd01-dd01-dd01-dd01-dd01dd010101', 'inv-aug2026-001', 'INV-NS-2026-0802', 299.00, 25.42, 324.42, 0.00, 'monthly', '2026-08-02', '2026-09-01', '2026-08-02 00:05:00+00', 'paid', 'paid')
on conflict (id) do nothing;

insert into public.brv_credit_notes (id, organization_id, billing_account_id, credit_key, invoice_id, amount_usd, tax_amount, reason, issued_at, status)
values
  ('dd14dd14-dd14-dd14-dd14-dd14dd141401', '11111111-1111-1111-1111-111111111111', 'dd01dd01-dd01-dd01-dd01-dd01dd010101', 'credit-refund-001', 'dd13dd13-dd13-dd13-dd13-dd13dd131301', 25.00, 2.13, 'Partial refund credit for billing demo', '2026-08-03 10:00:00+00', 'issued')
on conflict (id) do nothing;

insert into public.brv_debit_notes (id, organization_id, billing_account_id, debit_key, invoice_id, amount_usd, tax_amount, reason, issued_at, status)
values
  ('dd15dd15-dd15-dd15-dd15-dd15dd151501', '11111111-1111-1111-1111-111111111111', 'dd01dd01-dd01-dd01-dd01-dd01dd010101', 'debit-overage-001', 'dd13dd13-dd13-dd13-dd13-dd13dd131301', 15.00, 1.28, 'API overage charge for August billing period', '2026-08-15 14:00:00+00', 'issued')
on conflict (id) do nothing;

insert into public.brv_tax_configs (id, organization_id, billing_account_id, config_key, tax_name, gst_rate, tax_type, jurisdiction, is_default, status)
values
  ('dd16dd16-dd16-dd16-dd16-dd16dd161601', '11111111-1111-1111-1111-111111111111', 'dd01dd01-dd01-dd01-dd01-dd01dd010101', 'tax-us-ca', 'California Sales Tax', 8.50, 'sales_tax', 'US-CA', true, 'active')
on conflict (id) do nothing;

-- M5 Collection Center
insert into public.brv_outstanding_balances (id, organization_id, billing_account_id, balance_key, total_outstanding_usd, overdue_usd, current_usd, days_overdue, last_payment_at, status)
values
  ('dd17dd17-dd17-dd17-dd17-dd17dd171701', '11111111-1111-1111-1111-111111111111', 'dd01dd01-dd01-dd01-dd01-dd01dd010101', 'balance-current', 0.00, 0.00, 0.00, 0, '2026-08-02 00:05:00+00', 'closed')
on conflict (id) do nothing;

insert into public.brv_payment_reminders (id, organization_id, billing_account_id, reminder_key, outstanding_balance_id, reminder_type, channel, sent_at, next_reminder_at, status)
values
  ('dd18dd18-dd18-dd18-dd18-dd18dd181801', '11111111-1111-1111-1111-111111111111', 'dd01dd01-dd01-dd01-dd01-dd01dd010101', 'reminder-upcoming-sep', 'dd17dd17-dd17-dd17-dd17-dd17dd171701', 'upcoming', 'email', null, '2026-08-28 09:00:00+00', 'scheduled')
on conflict (id) do nothing;

insert into public.brv_collection_cases (id, organization_id, billing_account_id, case_key, case_type, priority, outstanding_amount_usd, opened_at, status)
values
  ('dd19dd19-dd19-dd19-dd19-dd19dd191901', '11111111-1111-1111-1111-111111111111', 'dd01dd01-dd01-dd01-dd01-dd01dd010101', 'case-demo-resolved', 'overdue', 'low', 0.00, '2026-07-01 09:00:00+00', 'resolved')
on conflict (id) do nothing;

insert into public.brv_write_offs (id, organization_id, billing_account_id, writeoff_key, collection_case_id, amount_usd, reason, status)
values
  ('dd20dd20-dd20-dd20-dd20-dd20dd202001', '11111111-1111-1111-1111-111111111111', 'dd01dd01-dd01-dd01-dd01-dd01dd010101', 'writeoff-demo', 'dd19dd19-dd19-dd19-dd19-dd19dd191901', 0.00, 'Demo write-off placeholder — no actual bad debt', 'cancelled')
on conflict (id) do nothing;

-- M6 Financial Analytics
insert into public.brv_analytics_snapshots (id, organization_id, billing_account_id, snapshot_key, snapshot_date, total_revenue_usd, mrr_usd, arr_usd, metrics, status)
values
  ('dd21dd21-dd21-dd21-dd21-dd21dd212101', '11111111-1111-1111-1111-111111111111', 'dd01dd01-dd01-dd01-dd01-dd01dd010101', 'analytics-daily-0802', '2026-08-02', 299.00, 299.00, 3588.00, '{"plan":"starter","billing_cycle":"monthly","amount_usd":299,"mrr_usd":299,"arr_usd":3588}'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.brv_revenue_growth_metrics (id, organization_id, billing_account_id, metrics_key, metric_date, growth_rate_percent, net_revenue_retention, expansion_revenue_usd, contraction_revenue_usd, status)
values
  ('dd22dd22-dd22-dd22-dd22-dd22dd222201', '11111111-1111-1111-1111-111111111111', 'dd01dd01-dd01-dd01-dd01-dd01dd010101', 'growth-monthly-0802', '2026-08-02', 100.00, 100.00, 0.00, 0.00, 'active')
on conflict (id) do nothing;

insert into public.brv_cash_flow_records (id, organization_id, billing_account_id, record_key, record_date, inflow_usd, outflow_usd, net_cash_usd, category, status)
values
  ('dd23dd23-dd23-dd23-dd23-dd23dd232301', '11111111-1111-1111-1111-111111111111', 'dd01dd01-dd01-dd01-dd01-dd01dd010101', 'cashflow-aug2026', '2026-08-02', 324.42, 25.00, 299.42, 'subscription', 'recorded')
on conflict (id) do nothing;

insert into public.brv_subscription_trends (id, organization_id, billing_account_id, trend_key, trend_date, active_subscriptions, new_subscriptions, churned_subscriptions, mrr_usd, arr_usd, status)
values
  ('dd24dd24-dd24-dd24-dd24-dd24dd242401', '11111111-1111-1111-1111-111111111111', 'dd01dd01-dd01-dd01-dd01-dd01dd010101', 'trend-monthly-0802', '2026-08-02', 1, 1, 0, 299.00, 3588.00, 'active')
on conflict (id) do nothing;

-- M7 Revenue Forecasting
insert into public.brv_renewal_forecasts (id, organization_id, billing_account_id, forecast_key, forecast_date, renewal_amount_usd, renewal_probability, contract_end_date, status)
values
  ('dd25dd25-dd25-dd25-dd25-dd25dd252501', '11111111-1111-1111-1111-111111111111', 'dd01dd01-dd01-dd01-dd01-dd01dd010101', 'renewal-2027', '2026-08-02', 3588.00, 92.00, '2027-08-02', 'active')
on conflict (id) do nothing;

insert into public.brv_mrr_forecasts (id, organization_id, billing_account_id, forecast_key, forecast_date, forecast_period, projected_mrr_usd, confidence_percent, status)
values
  ('dd26dd26-dd26-dd26-dd26-dd26dd262601', '11111111-1111-1111-1111-111111111111', 'dd01dd01-dd01-dd01-dd01-dd01dd010101', 'mrr-forecast-q4', '2026-08-02', 'quarterly', 299.00, 85.00, 'active')
on conflict (id) do nothing;

insert into public.brv_arr_forecasts (id, organization_id, billing_account_id, forecast_key, forecast_date, forecast_period, projected_arr_usd, confidence_percent, status)
values
  ('dd27dd27-dd27-dd27-dd27-dd27dd272701', '11111111-1111-1111-1111-111111111111', 'dd01dd01-dd01-dd01-dd01-dd01dd010101', 'arr-forecast-fy2027', '2026-08-02', 'annual', 3588.00, 85.00, 'active')
on conflict (id) do nothing;

insert into public.brv_revenue_projections (id, organization_id, billing_account_id, projection_key, projection_date, projected_revenue_usd, projection_horizon_months, assumptions, status)
values
  ('dd28dd28-dd28-dd28-dd28-dd28dd282801', '11111111-1111-1111-1111-111111111111', 'dd01dd01-dd01-dd01-dd01-dd01dd010101', 'projection-12mo', '2026-08-02', 3588.00, 12, '{"base_mrr_usd":299,"growth_rate_percent":0,"churn_rate_percent":0}'::jsonb, 'active')
on conflict (id) do nothing;

-- M8 Finance Ops Dashboard (org-only tables)
insert into public.brv_finance_metrics (id, organization_id, metrics_key, metric_date, total_mrr_usd, total_arr_usd, total_revenue_usd, collection_rate_percent, dso_days, status)
values
  ('dd29dd29-dd29-dd29-dd29-dd29dd292901', '11111111-1111-1111-1111-111111111111', 'finance-daily-0802', '2026-08-02', 299.00, 3588.00, 299.00, 100.00, 0, 'active')
on conflict (id) do nothing;

insert into public.brv_financial_health (id, organization_id, health_key, health_date, overall_score, liquidity_score, collection_score, summary, status)
values
  ('dd30dd30-dd30-dd30-dd30-dd30dd303001', '11111111-1111-1111-1111-111111111111', 'health-daily-0802', '2026-08-02', 94.50, 96.00, 100.00, 'Strong billing health — all invoices paid on time, MRR $299 / ARR $3,588', 'active')
on conflict (id) do nothing;

insert into public.brv_expansion_contraction (id, organization_id, billing_account_id, record_key, record_date, record_type, amount_usd, mrr_impact_usd, reason, status)
values
  ('dd31dd31-dd31-dd31-dd31-dd31dd313101', '11111111-1111-1111-1111-111111111111', 'dd01dd01-dd01-dd01-dd01-dd01dd010101', 'expansion-new-sub', '2026-08-02', 'expansion', 299.00, 299.00, 'New starter subscription activated — monthly $299', 'recorded')
on conflict (id) do nothing;

insert into public.brv_audit_logs (id, organization_id, entity_type, entity_id, action, summary, metadata, security_level)
values
  ('dd000001-dd00-dd00-dd00-dd0000000001', '11111111-1111-1111-1111-111111111111', 'billing_account', 'dd01dd01-dd01-dd01-dd01-dd01dd010101', 'create', 'Northstar billing account provisioned with USD currency', '{"account_key":"northstar-billing","currency_code":"USD"}'::jsonb, 'standard'),
  ('dd000002-dd00-dd00-dd00-dd0000000002', '11111111-1111-1111-1111-111111111111', 'subscription_billing', 'dd03dd03-dd03-dd03-dd03-dd03dd030301', 'create', 'Starter monthly subscription activated — MRR $299, ARR $3,588', '{"plan_name":"Starter Plan","amount_usd":299,"mrr_usd":299,"arr_usd":3588}'::jsonb, 'elevated'),
  ('dd000003-dd00-dd00-dd00-dd0000000003', '11111111-1111-1111-1111-111111111111', 'invoice', 'dd13dd13-dd13-dd13-dd13-dd13dd131301', 'update', 'Invoice INV-NS-2026-0802 paid — $324.42 including 8.5% tax', '{"invoice_number":"INV-NS-2026-0802","total_usd":324.42,"payment_status":"paid"}'::jsonb, 'restricted')
on conflict (id) do nothing;
