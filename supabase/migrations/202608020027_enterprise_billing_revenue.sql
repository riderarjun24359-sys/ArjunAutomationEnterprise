-- V2 Program A Sprint 4: Enterprise Billing & Revenue Platform

-- M1 Subscription Billing
create table if not exists public.brv_billing_accounts (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  account_key text not null,
  account_name text not null,
  currency_code text not null default 'USD',
  billing_email text not null default '',
  payment_terms_days integer not null default 30,
  tax_id text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, account_key)
);

create table if not exists public.brv_billing_cycles (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  billing_account_id uuid not null references public.brv_billing_accounts(id) on delete cascade,
  cycle_key text not null,
  billing_cycle text not null default 'monthly',
  cycle_start_date date not null default current_date,
  cycle_end_date date,
  next_invoice_date date,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, billing_account_id, cycle_key)
);

create table if not exists public.brv_subscription_billings (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  billing_account_id uuid not null references public.brv_billing_accounts(id) on delete cascade,
  subscription_key text not null,
  plan_name text not null,
  billing_cycle text not null default 'monthly',
  amount_usd numeric(12, 2) not null default 0,
  mrr_usd numeric(12, 2) not null default 0,
  arr_usd numeric(14, 2) not null default 0,
  quantity integer not null default 1,
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  renews_at timestamptz,
  payment_status text not null default 'pending',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, billing_account_id, subscription_key)
);

create table if not exists public.brv_proration_records (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  billing_account_id uuid not null references public.brv_billing_accounts(id) on delete cascade,
  proration_key text not null,
  subscription_billing_id uuid references public.brv_subscription_billings(id) on delete set null,
  proration_type text not null default 'upgrade',
  prorated_amount_usd numeric(12, 2) not null default 0,
  days_remaining integer not null default 0,
  days_in_cycle integer not null default 30,
  effective_date date not null default current_date,
  reason text not null default '',
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, billing_account_id, proration_key)
);

-- M2 Payment Management
create table if not exists public.brv_payment_methods (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  billing_account_id uuid not null references public.brv_billing_accounts(id) on delete cascade,
  method_key text not null,
  method_type text not null default 'card',
  last_four text not null default '',
  brand text not null default '',
  expiry_month integer,
  expiry_year integer,
  is_default boolean not null default false,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, billing_account_id, method_key)
);

create table if not exists public.brv_payment_attempts (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  billing_account_id uuid not null references public.brv_billing_accounts(id) on delete cascade,
  attempt_key text not null,
  payment_method_id uuid references public.brv_payment_methods(id) on delete set null,
  amount_usd numeric(12, 2) not null default 0,
  currency_code text not null default 'USD',
  payment_status text not null default 'pending',
  gateway_reference text not null default '',
  failure_reason text not null default '',
  attempted_at timestamptz not null default now(),
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  unique (organization_id, billing_account_id, attempt_key)
);

create table if not exists public.brv_refunds (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  billing_account_id uuid not null references public.brv_billing_accounts(id) on delete cascade,
  refund_key text not null,
  payment_attempt_id uuid references public.brv_payment_attempts(id) on delete set null,
  amount_usd numeric(12, 2) not null default 0,
  refund_reason text not null default '',
  refund_status text not null default 'pending',
  processed_at timestamptz,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, billing_account_id, refund_key)
);

create table if not exists public.brv_wallet_balances (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  billing_account_id uuid not null references public.brv_billing_accounts(id) on delete cascade,
  balance_key text not null,
  balance_usd numeric(12, 2) not null default 0,
  credit_usd numeric(12, 2) not null default 0,
  debit_usd numeric(12, 2) not null default 0,
  last_transaction_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, billing_account_id, balance_key)
);

-- M3 Revenue Management
create table if not exists public.brv_mrr_snapshots (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  billing_account_id uuid not null references public.brv_billing_accounts(id) on delete cascade,
  snapshot_key text not null,
  snapshot_date date not null default current_date,
  mrr_usd numeric(14, 2) not null default 0,
  previous_mrr_usd numeric(14, 2) not null default 0,
  new_mrr_usd numeric(14, 2) not null default 0,
  expansion_mrr_usd numeric(14, 2) not null default 0,
  contraction_mrr_usd numeric(14, 2) not null default 0,
  churn_mrr_usd numeric(14, 2) not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, billing_account_id, snapshot_key)
);

create table if not exists public.brv_arr_snapshots (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  billing_account_id uuid not null references public.brv_billing_accounts(id) on delete cascade,
  snapshot_key text not null,
  snapshot_date date not null default current_date,
  arr_usd numeric(14, 2) not null default 0,
  previous_arr_usd numeric(14, 2) not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, billing_account_id, snapshot_key)
);

create table if not exists public.brv_deferred_revenue (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  billing_account_id uuid not null references public.brv_billing_accounts(id) on delete cascade,
  deferred_key text not null,
  period_start date not null default current_date,
  period_end date,
  total_deferred_usd numeric(14, 2) not null default 0,
  recognized_usd numeric(14, 2) not null default 0,
  remaining_usd numeric(14, 2) not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, billing_account_id, deferred_key)
);

create table if not exists public.brv_revenue_recognition (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  billing_account_id uuid not null references public.brv_billing_accounts(id) on delete cascade,
  recognition_key text not null,
  deferred_revenue_id uuid references public.brv_deferred_revenue(id) on delete set null,
  recognized_amount_usd numeric(12, 2) not null default 0,
  recognition_date date not null default current_date,
  recognition_type text not null default 'subscription',
  status text not null default 'recorded',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, billing_account_id, recognition_key)
);

-- M4 Invoice Center
create table if not exists public.brv_invoices (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  billing_account_id uuid not null references public.brv_billing_accounts(id) on delete cascade,
  invoice_key text not null,
  invoice_number text not null,
  subtotal_usd numeric(12, 2) not null default 0,
  tax_amount numeric(12, 2) not null default 0,
  total_usd numeric(12, 2) not null default 0,
  amount_due_usd numeric(12, 2) not null default 0,
  billing_cycle text not null default 'monthly',
  invoice_date date not null default current_date,
  due_date date,
  paid_at timestamptz,
  payment_status text not null default 'pending',
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, billing_account_id, invoice_key)
);

create table if not exists public.brv_credit_notes (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  billing_account_id uuid not null references public.brv_billing_accounts(id) on delete cascade,
  credit_key text not null,
  invoice_id uuid references public.brv_invoices(id) on delete set null,
  amount_usd numeric(12, 2) not null default 0,
  tax_amount numeric(12, 2) not null default 0,
  reason text not null default '',
  issued_at timestamptz not null default now(),
  status text not null default 'issued',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, billing_account_id, credit_key)
);

create table if not exists public.brv_debit_notes (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  billing_account_id uuid not null references public.brv_billing_accounts(id) on delete cascade,
  debit_key text not null,
  invoice_id uuid references public.brv_invoices(id) on delete set null,
  amount_usd numeric(12, 2) not null default 0,
  tax_amount numeric(12, 2) not null default 0,
  reason text not null default '',
  issued_at timestamptz not null default now(),
  status text not null default 'issued',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, billing_account_id, debit_key)
);

create table if not exists public.brv_tax_configs (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  billing_account_id uuid not null references public.brv_billing_accounts(id) on delete cascade,
  config_key text not null,
  tax_name text not null,
  gst_rate numeric(5, 2) not null default 0,
  tax_type text not null default 'sales_tax',
  jurisdiction text not null default '',
  is_default boolean not null default false,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, billing_account_id, config_key)
);

-- M5 Collection Center
create table if not exists public.brv_outstanding_balances (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  billing_account_id uuid not null references public.brv_billing_accounts(id) on delete cascade,
  balance_key text not null,
  total_outstanding_usd numeric(12, 2) not null default 0,
  overdue_usd numeric(12, 2) not null default 0,
  current_usd numeric(12, 2) not null default 0,
  days_overdue integer not null default 0,
  last_payment_at timestamptz,
  status text not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, billing_account_id, balance_key)
);

create table if not exists public.brv_payment_reminders (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  billing_account_id uuid not null references public.brv_billing_accounts(id) on delete cascade,
  reminder_key text not null,
  outstanding_balance_id uuid references public.brv_outstanding_balances(id) on delete set null,
  reminder_type text not null default 'overdue',
  channel text not null default 'email',
  sent_at timestamptz,
  next_reminder_at timestamptz,
  status text not null default 'scheduled',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, billing_account_id, reminder_key)
);

create table if not exists public.brv_collection_cases (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  billing_account_id uuid not null references public.brv_billing_accounts(id) on delete cascade,
  case_key text not null,
  case_type text not null default 'overdue',
  priority text not null default 'medium',
  outstanding_amount_usd numeric(12, 2) not null default 0,
  assigned_to uuid references public.user_profiles(id) on delete set null,
  opened_at timestamptz not null default now(),
  resolved_at timestamptz,
  status text not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, billing_account_id, case_key)
);

create table if not exists public.brv_write_offs (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  billing_account_id uuid not null references public.brv_billing_accounts(id) on delete cascade,
  writeoff_key text not null,
  collection_case_id uuid references public.brv_collection_cases(id) on delete set null,
  amount_usd numeric(12, 2) not null default 0,
  reason text not null default '',
  approved_by uuid references public.user_profiles(id) on delete set null,
  written_off_at timestamptz,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, billing_account_id, writeoff_key)
);

-- M6 Financial Analytics
create table if not exists public.brv_analytics_snapshots (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  billing_account_id uuid not null references public.brv_billing_accounts(id) on delete cascade,
  snapshot_key text not null,
  snapshot_date date not null default current_date,
  total_revenue_usd numeric(14, 2) not null default 0,
  mrr_usd numeric(14, 2) not null default 0,
  arr_usd numeric(14, 2) not null default 0,
  metrics jsonb not null default '{}'::jsonb,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, billing_account_id, snapshot_key)
);

create table if not exists public.brv_revenue_growth_metrics (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  billing_account_id uuid not null references public.brv_billing_accounts(id) on delete cascade,
  metrics_key text not null,
  metric_date date not null default current_date,
  growth_rate_percent numeric(5, 2) not null default 0,
  net_revenue_retention numeric(5, 2) not null default 0,
  expansion_revenue_usd numeric(14, 2) not null default 0,
  contraction_revenue_usd numeric(14, 2) not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, billing_account_id, metrics_key)
);

create table if not exists public.brv_cash_flow_records (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  billing_account_id uuid not null references public.brv_billing_accounts(id) on delete cascade,
  record_key text not null,
  record_date date not null default current_date,
  inflow_usd numeric(14, 2) not null default 0,
  outflow_usd numeric(14, 2) not null default 0,
  net_cash_usd numeric(14, 2) not null default 0,
  category text not null default 'operations',
  status text not null default 'recorded',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, billing_account_id, record_key)
);

create table if not exists public.brv_subscription_trends (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  billing_account_id uuid not null references public.brv_billing_accounts(id) on delete cascade,
  trend_key text not null,
  trend_date date not null default current_date,
  active_subscriptions integer not null default 0,
  new_subscriptions integer not null default 0,
  churned_subscriptions integer not null default 0,
  mrr_usd numeric(14, 2) not null default 0,
  arr_usd numeric(14, 2) not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, billing_account_id, trend_key)
);

-- M7 Revenue Forecasting
create table if not exists public.brv_renewal_forecasts (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  billing_account_id uuid not null references public.brv_billing_accounts(id) on delete cascade,
  forecast_key text not null,
  forecast_date date not null default current_date,
  renewal_amount_usd numeric(14, 2) not null default 0,
  renewal_probability numeric(5, 2) not null default 0,
  contract_end_date date,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, billing_account_id, forecast_key)
);

create table if not exists public.brv_mrr_forecasts (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  billing_account_id uuid not null references public.brv_billing_accounts(id) on delete cascade,
  forecast_key text not null,
  forecast_date date not null default current_date,
  forecast_period text not null default 'monthly',
  projected_mrr_usd numeric(14, 2) not null default 0,
  confidence_percent numeric(5, 2) not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, billing_account_id, forecast_key)
);

create table if not exists public.brv_arr_forecasts (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  billing_account_id uuid not null references public.brv_billing_accounts(id) on delete cascade,
  forecast_key text not null,
  forecast_date date not null default current_date,
  forecast_period text not null default 'annual',
  projected_arr_usd numeric(14, 2) not null default 0,
  confidence_percent numeric(5, 2) not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, billing_account_id, forecast_key)
);

create table if not exists public.brv_revenue_projections (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  billing_account_id uuid not null references public.brv_billing_accounts(id) on delete cascade,
  projection_key text not null,
  projection_date date not null default current_date,
  projected_revenue_usd numeric(14, 2) not null default 0,
  projection_horizon_months integer not null default 12,
  assumptions jsonb not null default '{}'::jsonb,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, billing_account_id, projection_key)
);

-- M8 Finance Ops Dashboard
create table if not exists public.brv_finance_metrics (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  metrics_key text not null,
  metric_date date not null default current_date,
  total_mrr_usd numeric(14, 2) not null default 0,
  total_arr_usd numeric(14, 2) not null default 0,
  total_revenue_usd numeric(14, 2) not null default 0,
  collection_rate_percent numeric(5, 2) not null default 0,
  dso_days integer not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, metrics_key)
);

create table if not exists public.brv_financial_health (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  health_key text not null,
  health_date date not null default current_date,
  overall_score numeric(5, 2) not null default 0,
  liquidity_score numeric(5, 2) not null default 0,
  collection_score numeric(5, 2) not null default 0,
  summary text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, health_key)
);

create table if not exists public.brv_expansion_contraction (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  billing_account_id uuid not null references public.brv_billing_accounts(id) on delete cascade,
  record_key text not null,
  record_date date not null default current_date,
  record_type text not null default 'expansion',
  amount_usd numeric(12, 2) not null default 0,
  mrr_impact_usd numeric(12, 2) not null default 0,
  reason text not null default '',
  status text not null default 'recorded',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, billing_account_id, record_key)
);

create table if not exists public.brv_audit_logs (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  entity_type text not null,
  entity_id uuid,
  action text not null,
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  performed_by uuid references public.user_profiles(id) on delete set null,
  security_level text not null default 'standard',
  created_at timestamptz not null default now()
);

-- indexes
create index if not exists idx_brv_billing_accounts_org on public.brv_billing_accounts(organization_id);
create index if not exists idx_brv_billing_cycles_org on public.brv_billing_cycles(organization_id);
create index if not exists idx_brv_billing_cycles_account on public.brv_billing_cycles(billing_account_id);
create index if not exists idx_brv_subscription_billings_org on public.brv_subscription_billings(organization_id);
create index if not exists idx_brv_subscription_billings_account on public.brv_subscription_billings(billing_account_id);
create index if not exists idx_brv_proration_records_org on public.brv_proration_records(organization_id);
create index if not exists idx_brv_proration_records_account on public.brv_proration_records(billing_account_id);
create index if not exists idx_brv_payment_methods_org on public.brv_payment_methods(organization_id);
create index if not exists idx_brv_payment_methods_account on public.brv_payment_methods(billing_account_id);
create index if not exists idx_brv_payment_attempts_org on public.brv_payment_attempts(organization_id);
create index if not exists idx_brv_payment_attempts_account on public.brv_payment_attempts(billing_account_id);
create index if not exists idx_brv_refunds_org on public.brv_refunds(organization_id);
create index if not exists idx_brv_refunds_account on public.brv_refunds(billing_account_id);
create index if not exists idx_brv_wallet_balances_org on public.brv_wallet_balances(organization_id);
create index if not exists idx_brv_wallet_balances_account on public.brv_wallet_balances(billing_account_id);
create index if not exists idx_brv_mrr_snapshots_org on public.brv_mrr_snapshots(organization_id);
create index if not exists idx_brv_mrr_snapshots_account on public.brv_mrr_snapshots(billing_account_id);
create index if not exists idx_brv_arr_snapshots_org on public.brv_arr_snapshots(organization_id);
create index if not exists idx_brv_arr_snapshots_account on public.brv_arr_snapshots(billing_account_id);
create index if not exists idx_brv_deferred_revenue_org on public.brv_deferred_revenue(organization_id);
create index if not exists idx_brv_deferred_revenue_account on public.brv_deferred_revenue(billing_account_id);
create index if not exists idx_brv_revenue_recognition_org on public.brv_revenue_recognition(organization_id);
create index if not exists idx_brv_revenue_recognition_account on public.brv_revenue_recognition(billing_account_id);
create index if not exists idx_brv_invoices_org on public.brv_invoices(organization_id);
create index if not exists idx_brv_invoices_account on public.brv_invoices(billing_account_id);
create index if not exists idx_brv_credit_notes_org on public.brv_credit_notes(organization_id);
create index if not exists idx_brv_credit_notes_account on public.brv_credit_notes(billing_account_id);
create index if not exists idx_brv_debit_notes_org on public.brv_debit_notes(organization_id);
create index if not exists idx_brv_debit_notes_account on public.brv_debit_notes(billing_account_id);
create index if not exists idx_brv_tax_configs_org on public.brv_tax_configs(organization_id);
create index if not exists idx_brv_tax_configs_account on public.brv_tax_configs(billing_account_id);
create index if not exists idx_brv_outstanding_balances_org on public.brv_outstanding_balances(organization_id);
create index if not exists idx_brv_outstanding_balances_account on public.brv_outstanding_balances(billing_account_id);
create index if not exists idx_brv_payment_reminders_org on public.brv_payment_reminders(organization_id);
create index if not exists idx_brv_payment_reminders_account on public.brv_payment_reminders(billing_account_id);
create index if not exists idx_brv_collection_cases_org on public.brv_collection_cases(organization_id);
create index if not exists idx_brv_collection_cases_account on public.brv_collection_cases(billing_account_id);
create index if not exists idx_brv_write_offs_org on public.brv_write_offs(organization_id);
create index if not exists idx_brv_write_offs_account on public.brv_write_offs(billing_account_id);
create index if not exists idx_brv_analytics_snapshots_org on public.brv_analytics_snapshots(organization_id);
create index if not exists idx_brv_analytics_snapshots_account on public.brv_analytics_snapshots(billing_account_id);
create index if not exists idx_brv_revenue_growth_metrics_org on public.brv_revenue_growth_metrics(organization_id);
create index if not exists idx_brv_revenue_growth_metrics_account on public.brv_revenue_growth_metrics(billing_account_id);
create index if not exists idx_brv_cash_flow_records_org on public.brv_cash_flow_records(organization_id);
create index if not exists idx_brv_cash_flow_records_account on public.brv_cash_flow_records(billing_account_id);
create index if not exists idx_brv_subscription_trends_org on public.brv_subscription_trends(organization_id);
create index if not exists idx_brv_subscription_trends_account on public.brv_subscription_trends(billing_account_id);
create index if not exists idx_brv_renewal_forecasts_org on public.brv_renewal_forecasts(organization_id);
create index if not exists idx_brv_renewal_forecasts_account on public.brv_renewal_forecasts(billing_account_id);
create index if not exists idx_brv_mrr_forecasts_org on public.brv_mrr_forecasts(organization_id);
create index if not exists idx_brv_mrr_forecasts_account on public.brv_mrr_forecasts(billing_account_id);
create index if not exists idx_brv_arr_forecasts_org on public.brv_arr_forecasts(organization_id);
create index if not exists idx_brv_arr_forecasts_account on public.brv_arr_forecasts(billing_account_id);
create index if not exists idx_brv_revenue_projections_org on public.brv_revenue_projections(organization_id);
create index if not exists idx_brv_revenue_projections_account on public.brv_revenue_projections(billing_account_id);
create index if not exists idx_brv_finance_metrics_org on public.brv_finance_metrics(organization_id);
create index if not exists idx_brv_financial_health_org on public.brv_financial_health(organization_id);
create index if not exists idx_brv_expansion_contraction_org on public.brv_expansion_contraction(organization_id);
create index if not exists idx_brv_expansion_contraction_account on public.brv_expansion_contraction(billing_account_id);
create index if not exists idx_brv_audit_logs_org on public.brv_audit_logs(organization_id);

-- updated_at triggers
do $$
declare tbl text;
begin
  foreach tbl in array array[
    'brv_billing_accounts','brv_billing_cycles','brv_subscription_billings','brv_proration_records',
    'brv_payment_methods','brv_refunds','brv_wallet_balances',
    'brv_mrr_snapshots','brv_arr_snapshots','brv_deferred_revenue','brv_revenue_recognition',
    'brv_invoices','brv_credit_notes','brv_debit_notes','brv_tax_configs',
    'brv_outstanding_balances','brv_payment_reminders','brv_collection_cases','brv_write_offs',
    'brv_analytics_snapshots','brv_revenue_growth_metrics','brv_cash_flow_records','brv_subscription_trends',
    'brv_renewal_forecasts','brv_mrr_forecasts','brv_arr_forecasts','brv_revenue_projections',
    'brv_finance_metrics','brv_financial_health','brv_expansion_contraction'
  ]
  loop
    execute format('drop trigger if exists trg_%I_updated_at on public.%I', tbl, tbl);
    execute format('create trigger trg_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()', tbl, tbl);
  end loop;
end $$;

-- RLS
alter table public.brv_billing_accounts enable row level security;
alter table public.brv_billing_cycles enable row level security;
alter table public.brv_subscription_billings enable row level security;
alter table public.brv_proration_records enable row level security;
alter table public.brv_payment_methods enable row level security;
alter table public.brv_payment_attempts enable row level security;
alter table public.brv_refunds enable row level security;
alter table public.brv_wallet_balances enable row level security;
alter table public.brv_mrr_snapshots enable row level security;
alter table public.brv_arr_snapshots enable row level security;
alter table public.brv_deferred_revenue enable row level security;
alter table public.brv_revenue_recognition enable row level security;
alter table public.brv_invoices enable row level security;
alter table public.brv_credit_notes enable row level security;
alter table public.brv_debit_notes enable row level security;
alter table public.brv_tax_configs enable row level security;
alter table public.brv_outstanding_balances enable row level security;
alter table public.brv_payment_reminders enable row level security;
alter table public.brv_collection_cases enable row level security;
alter table public.brv_write_offs enable row level security;
alter table public.brv_analytics_snapshots enable row level security;
alter table public.brv_revenue_growth_metrics enable row level security;
alter table public.brv_cash_flow_records enable row level security;
alter table public.brv_subscription_trends enable row level security;
alter table public.brv_renewal_forecasts enable row level security;
alter table public.brv_mrr_forecasts enable row level security;
alter table public.brv_arr_forecasts enable row level security;
alter table public.brv_revenue_projections enable row level security;
alter table public.brv_finance_metrics enable row level security;
alter table public.brv_financial_health enable row level security;
alter table public.brv_expansion_contraction enable row level security;
alter table public.brv_audit_logs enable row level security;

do $$
declare tbl text;
begin
  foreach tbl in array array[
    'brv_billing_accounts','brv_billing_cycles','brv_subscription_billings','brv_proration_records',
    'brv_payment_methods','brv_payment_attempts','brv_refunds','brv_wallet_balances',
    'brv_mrr_snapshots','brv_arr_snapshots','brv_deferred_revenue','brv_revenue_recognition',
    'brv_invoices','brv_credit_notes','brv_debit_notes','brv_tax_configs',
    'brv_outstanding_balances','brv_payment_reminders','brv_collection_cases','brv_write_offs',
    'brv_analytics_snapshots','brv_revenue_growth_metrics','brv_cash_flow_records','brv_subscription_trends',
    'brv_renewal_forecasts','brv_mrr_forecasts','brv_arr_forecasts','brv_revenue_projections',
    'brv_finance_metrics','brv_financial_health','brv_expansion_contraction','brv_audit_logs'
  ]
  loop
    execute format('drop policy if exists %I_select on public.%I', tbl, tbl);
    execute format('create policy %I_select on public.%I for select using (public.is_organization_member(organization_id))', tbl, tbl);
    execute format('drop policy if exists %I_insert on public.%I', tbl, tbl);
    execute format('create policy %I_insert on public.%I for insert with check (public.is_organization_member(organization_id))', tbl, tbl);
    execute format('drop policy if exists %I_update on public.%I', tbl, tbl);
    execute format('create policy %I_update on public.%I for update using (public.is_organization_member(organization_id)) with check (public.is_organization_member(organization_id))', tbl, tbl);
    execute format('drop policy if exists %I_delete on public.%I', tbl, tbl);
    execute format('create policy %I_delete on public.%I for delete using (public.is_organization_member(organization_id))', tbl, tbl);
  end loop;
end $$;

insert into public.permissions (key, description, resource)
values
  ('brv.view', 'View enterprise billing and revenue platform data', 'enterprise_billing_revenue'),
  ('brv.manage', 'Manage subscriptions, payments, invoices, and revenue records', 'enterprise_billing_revenue'),
  ('brv.approve', 'Approve refunds, write-offs, and revenue recognition adjustments', 'enterprise_billing_revenue'),
  ('brv.admin', 'Administer enterprise billing and revenue platform governance', 'enterprise_billing_revenue')
on conflict (key) do update set description = excluded.description, resource = excluded.resource;
