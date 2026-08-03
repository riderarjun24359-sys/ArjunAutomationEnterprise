-- V2 Program B Sprint 9: Enterprise Retail Business Operating System

-- RetailHub
create table if not exists public.rtl_retail_hubs (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_key text not null,
  hub_name text not null,
  environment text not null default 'production',
  retail_code text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_key)
);

-- RetailBrand
create table if not exists public.rtl_retail_brands (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.rtl_retail_hubs(id) on delete cascade,
  brand_key text not null,
  brand_name text not null default '',
  brand_type text not null default 'flagship',
  region text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, brand_key)
);

-- Store
create table if not exists public.rtl_stores (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.rtl_retail_hubs(id) on delete cascade,
  store_key text not null,
  store_name text not null default '',
  store_type text not null default 'retail',
  address text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, store_key)
);

-- CashRegister
create table if not exists public.rtl_cash_registers (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.rtl_retail_hubs(id) on delete cascade,
  register_key text not null,
  register_name text not null default '',
  register_status text not null default 'active',
  terminal_id text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, register_key)
);

-- StoreDepartment
create table if not exists public.rtl_store_departments (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.rtl_retail_hubs(id) on delete cascade,
  department_key text not null,
  department_name text not null default '',
  department_type text not null default 'sales',
  floor_level text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, department_key)
);

-- Product
create table if not exists public.rtl_products (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.rtl_retail_hubs(id) on delete cascade,
  product_key text not null,
  product_name text not null default '',
  product_type text not null default 'standard',
  sku text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, product_key)
);

-- ProductCategory
create table if not exists public.rtl_product_categories (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.rtl_retail_hubs(id) on delete cascade,
  category_key text not null,
  category_name text not null default '',
  category_type text not null default 'general',
  parent_ref text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, category_key)
);

-- ProductVariant
create table if not exists public.rtl_product_variants (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.rtl_retail_hubs(id) on delete cascade,
  variant_key text not null,
  variant_name text not null default '',
  variant_type text not null default 'size',
  sku_ref text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, variant_key)
);

-- Promotion
create table if not exists public.rtl_promotions (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.rtl_retail_hubs(id) on delete cascade,
  promotion_key text not null,
  promotion_name text not null default '',
  promotion_status text not null default 'draft',
  discount_pct numeric(5, 2) not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, promotion_key)
);

-- SalesOrder
create table if not exists public.rtl_sales_orders (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.rtl_retail_hubs(id) on delete cascade,
  order_key text not null,
  order_name text not null default '',
  order_status text not null default 'pending',
  order_type text not null default 'in_store',
  ordered_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, order_key)
);

-- PosTransaction
create table if not exists public.rtl_pos_transactions (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.rtl_retail_hubs(id) on delete cascade,
  transaction_key text not null,
  transaction_name text not null default '',
  transaction_status text not null default 'completed',
  amount numeric(12, 2) not null default 0,
  transacted_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, transaction_key)
);

-- ReturnsExchange
create table if not exists public.rtl_returns_exchanges (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.rtl_retail_hubs(id) on delete cascade,
  return_key text not null,
  return_name text not null default '',
  return_status text not null default 'pending',
  return_type text not null default 'return',
  returned_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, return_key)
);

-- ShiftClosing
create table if not exists public.rtl_shift_closings (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.rtl_retail_hubs(id) on delete cascade,
  closing_key text not null,
  closing_name text not null default '',
  closing_status text not null default 'open',
  closed_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, closing_key)
);

-- Warehouse
create table if not exists public.rtl_warehouses (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.rtl_retail_hubs(id) on delete cascade,
  warehouse_key text not null,
  warehouse_name text not null default '',
  warehouse_type text not null default 'distribution',
  location text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, warehouse_key)
);

-- StockLevel
create table if not exists public.rtl_stock_levels (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.rtl_retail_hubs(id) on delete cascade,
  stock_key text not null,
  stock_name text not null default '',
  stock_quantity integer not null default 0,
  reorder_level integer not null default 10,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, stock_key)
);

-- PurchaseOrder
create table if not exists public.rtl_purchase_orders (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.rtl_retail_hubs(id) on delete cascade,
  order_key text not null,
  order_name text not null default '',
  order_status text not null default 'pending',
  supplier_ref text not null default '',
  ordered_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, order_key)
);

-- Supplier
create table if not exists public.rtl_suppliers (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.rtl_retail_hubs(id) on delete cascade,
  supplier_key text not null,
  supplier_name text not null default '',
  supplier_type text not null default 'vendor',
  contact_info text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, supplier_key)
);

-- CustomerProfile
create table if not exists public.rtl_customer_profiles (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.rtl_retail_hubs(id) on delete cascade,
  profile_key text not null,
  profile_name text not null default '',
  profile_type text not null default 'regular',
  loyalty_tier text not null default 'bronze',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, profile_key)
);

-- LoyaltyProgram
create table if not exists public.rtl_loyalty_programs (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.rtl_retail_hubs(id) on delete cascade,
  program_key text not null,
  program_name text not null default '',
  program_type text not null default 'points',
  points_rate numeric(5, 2) not null default 1,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, program_key)
);

-- RewardPoint
create table if not exists public.rtl_reward_points (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.rtl_retail_hubs(id) on delete cascade,
  points_key text not null,
  points_name text not null default '',
  points_balance numeric(10, 2) not null default 0,
  earned_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, points_key)
);

-- Campaign
create table if not exists public.rtl_campaigns (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.rtl_retail_hubs(id) on delete cascade,
  campaign_key text not null,
  campaign_name text not null default '',
  campaign_status text not null default 'draft',
  start_date date not null default current_date,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, campaign_key)
);

-- DailyClosing
create table if not exists public.rtl_daily_closings (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.rtl_retail_hubs(id) on delete cascade,
  closing_key text not null,
  closing_name text not null default '',
  closing_amount numeric(12, 2) not null default 0,
  closed_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, closing_key)
);

-- BranchPerformance
create table if not exists public.rtl_branch_performance (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.rtl_retail_hubs(id) on delete cascade,
  performance_key text not null,
  performance_name text not null default '',
  performance_score numeric(5, 2) not null default 0,
  metric_date date not null default current_date,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, performance_key)
);

-- CommissionRecord
create table if not exists public.rtl_commission_records (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.rtl_retail_hubs(id) on delete cascade,
  commission_key text not null,
  commission_name text not null default '',
  commission_amount numeric(12, 2) not null default 0,
  earned_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, commission_key)
);

-- SalesAnalytics
create table if not exists public.rtl_sales_analytics (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.rtl_retail_hubs(id) on delete cascade,
  analytics_key text not null,
  analytics_type text not null default 'sales',
  analytics_score numeric(5, 2) not null default 0,
  metric_date date not null default current_date,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, analytics_key)
);

-- InventoryAnalytics
create table if not exists public.rtl_inventory_analytics (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.rtl_retail_hubs(id) on delete cascade,
  analytics_key text not null,
  analytics_type text not null default 'inventory',
  analytics_score numeric(5, 2) not null default 0,
  metric_date date not null default current_date,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, analytics_key)
);

-- ProfitabilityAnalytics
create table if not exists public.rtl_profitability_analytics (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.rtl_retail_hubs(id) on delete cascade,
  analytics_key text not null,
  analytics_type text not null default 'profitability',
  analytics_score numeric(5, 2) not null default 0,
  metric_date date not null default current_date,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, analytics_key)
);

-- RetailMetric
create table if not exists public.rtl_retail_metrics (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  metrics_key text not null,
  metric_date date not null default current_date,
  revenue_total numeric(12, 2) not null default 0,
  profit_total numeric(12, 2) not null default 0,
  sales_count integer not null default 0,
  inventory_value numeric(12, 2) not null default 0,
  customer_retention_rate numeric(5, 2) not null default 0,
  store_performance_score numeric(5, 2) not null default 0,
  top_product_score numeric(5, 2) not null default 0,
  overall_retail_score numeric(5, 2) not null default 100,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, metrics_key)
);

-- RetailHealth
create table if not exists public.rtl_retail_health (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  health_key text not null,
  health_date date not null default current_date,
  overall_score numeric(5, 2) not null default 100,
  disaster_recovery_mode boolean not null default false,
  inventory_health_status text not null default 'healthy',
  financial_health_status text not null default 'healthy',
  operational_health_status text not null default 'healthy',
  summary text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, health_key)
);

-- ExecutiveKpi
create table if not exists public.rtl_executive_kpis (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.rtl_retail_hubs(id) on delete cascade,
  kpi_key text not null,
  kpi_name text not null default '',
  kpi_score numeric(5, 2) not null default 0,
  kpi_type text not null default 'executive',
  metric_date date not null default current_date,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, kpi_key)
);

-- RetailFailure
create table if not exists public.rtl_retail_failures (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.rtl_retail_hubs(id) on delete cascade,
  failure_key text not null,
  failure_type text not null default 'pos',
  error_code text not null default '',
  error_message text not null default '',
  failed_at timestamptz not null default now(),
  resolved_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, failure_key)
);

-- Audit Logs
create table if not exists public.rtl_audit_logs (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  entity_type text not null default '',
  entity_id uuid,
  action text not null default '',
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  performed_by uuid,
  security_level text not null default 'standard',
  created_at timestamptz not null default now()
);

create index if not exists idx_rtl_retail_hubs_org on public.rtl_retail_hubs(organization_id);
create index if not exists idx_rtl_retail_brands_org on public.rtl_retail_brands(organization_id);
create index if not exists idx_rtl_retail_brands_hub on public.rtl_retail_brands(hub_id);
create index if not exists idx_rtl_stores_org on public.rtl_stores(organization_id);
create index if not exists idx_rtl_stores_hub on public.rtl_stores(hub_id);
create index if not exists idx_rtl_cash_registers_org on public.rtl_cash_registers(organization_id);
create index if not exists idx_rtl_cash_registers_hub on public.rtl_cash_registers(hub_id);
create index if not exists idx_rtl_store_departments_org on public.rtl_store_departments(organization_id);
create index if not exists idx_rtl_store_departments_hub on public.rtl_store_departments(hub_id);
create index if not exists idx_rtl_products_org on public.rtl_products(organization_id);
create index if not exists idx_rtl_products_hub on public.rtl_products(hub_id);
create index if not exists idx_rtl_product_categories_org on public.rtl_product_categories(organization_id);
create index if not exists idx_rtl_product_categories_hub on public.rtl_product_categories(hub_id);
create index if not exists idx_rtl_product_variants_org on public.rtl_product_variants(organization_id);
create index if not exists idx_rtl_product_variants_hub on public.rtl_product_variants(hub_id);
create index if not exists idx_rtl_promotions_org on public.rtl_promotions(organization_id);
create index if not exists idx_rtl_promotions_hub on public.rtl_promotions(hub_id);
create index if not exists idx_rtl_sales_orders_org on public.rtl_sales_orders(organization_id);
create index if not exists idx_rtl_sales_orders_hub on public.rtl_sales_orders(hub_id);
create index if not exists idx_rtl_pos_transactions_org on public.rtl_pos_transactions(organization_id);
create index if not exists idx_rtl_pos_transactions_hub on public.rtl_pos_transactions(hub_id);
create index if not exists idx_rtl_returns_exchanges_org on public.rtl_returns_exchanges(organization_id);
create index if not exists idx_rtl_returns_exchanges_hub on public.rtl_returns_exchanges(hub_id);
create index if not exists idx_rtl_shift_closings_org on public.rtl_shift_closings(organization_id);
create index if not exists idx_rtl_shift_closings_hub on public.rtl_shift_closings(hub_id);
create index if not exists idx_rtl_warehouses_org on public.rtl_warehouses(organization_id);
create index if not exists idx_rtl_warehouses_hub on public.rtl_warehouses(hub_id);
create index if not exists idx_rtl_stock_levels_org on public.rtl_stock_levels(organization_id);
create index if not exists idx_rtl_stock_levels_hub on public.rtl_stock_levels(hub_id);
create index if not exists idx_rtl_purchase_orders_org on public.rtl_purchase_orders(organization_id);
create index if not exists idx_rtl_purchase_orders_hub on public.rtl_purchase_orders(hub_id);
create index if not exists idx_rtl_suppliers_org on public.rtl_suppliers(organization_id);
create index if not exists idx_rtl_suppliers_hub on public.rtl_suppliers(hub_id);
create index if not exists idx_rtl_customer_profiles_org on public.rtl_customer_profiles(organization_id);
create index if not exists idx_rtl_customer_profiles_hub on public.rtl_customer_profiles(hub_id);
create index if not exists idx_rtl_loyalty_programs_org on public.rtl_loyalty_programs(organization_id);
create index if not exists idx_rtl_loyalty_programs_hub on public.rtl_loyalty_programs(hub_id);
create index if not exists idx_rtl_reward_points_org on public.rtl_reward_points(organization_id);
create index if not exists idx_rtl_reward_points_hub on public.rtl_reward_points(hub_id);
create index if not exists idx_rtl_campaigns_org on public.rtl_campaigns(organization_id);
create index if not exists idx_rtl_campaigns_hub on public.rtl_campaigns(hub_id);
create index if not exists idx_rtl_daily_closings_org on public.rtl_daily_closings(organization_id);
create index if not exists idx_rtl_daily_closings_hub on public.rtl_daily_closings(hub_id);
create index if not exists idx_rtl_branch_performance_org on public.rtl_branch_performance(organization_id);
create index if not exists idx_rtl_branch_performance_hub on public.rtl_branch_performance(hub_id);
create index if not exists idx_rtl_commission_records_org on public.rtl_commission_records(organization_id);
create index if not exists idx_rtl_commission_records_hub on public.rtl_commission_records(hub_id);
create index if not exists idx_rtl_sales_analytics_org on public.rtl_sales_analytics(organization_id);
create index if not exists idx_rtl_sales_analytics_hub on public.rtl_sales_analytics(hub_id);
create index if not exists idx_rtl_inventory_analytics_org on public.rtl_inventory_analytics(organization_id);
create index if not exists idx_rtl_inventory_analytics_hub on public.rtl_inventory_analytics(hub_id);
create index if not exists idx_rtl_profitability_analytics_org on public.rtl_profitability_analytics(organization_id);
create index if not exists idx_rtl_profitability_analytics_hub on public.rtl_profitability_analytics(hub_id);
create index if not exists idx_rtl_retail_metrics_org on public.rtl_retail_metrics(organization_id);
create index if not exists idx_rtl_retail_health_org on public.rtl_retail_health(organization_id);
create index if not exists idx_rtl_executive_kpis_org on public.rtl_executive_kpis(organization_id);
create index if not exists idx_rtl_executive_kpis_hub on public.rtl_executive_kpis(hub_id);
create index if not exists idx_rtl_retail_failures_org on public.rtl_retail_failures(organization_id);
create index if not exists idx_rtl_retail_failures_hub on public.rtl_retail_failures(hub_id);
create index if not exists idx_rtl_audit_logs_org on public.rtl_audit_logs(organization_id);

do $$
declare tbl text;
begin
  foreach tbl in array array[
    'rtl_retail_hubs','rtl_retail_brands','rtl_stores','rtl_cash_registers','rtl_store_departments','rtl_products','rtl_product_categories','rtl_product_variants','rtl_promotions','rtl_sales_orders','rtl_pos_transactions','rtl_returns_exchanges','rtl_shift_closings','rtl_warehouses','rtl_stock_levels','rtl_purchase_orders','rtl_suppliers','rtl_customer_profiles','rtl_loyalty_programs','rtl_reward_points','rtl_campaigns','rtl_daily_closings','rtl_branch_performance','rtl_commission_records','rtl_sales_analytics','rtl_inventory_analytics','rtl_profitability_analytics','rtl_retail_metrics','rtl_retail_health','rtl_executive_kpis','rtl_retail_failures'
  ]
  loop
    execute format('drop trigger if exists trg_%I_updated_at on public.%I', tbl, tbl);
    execute format('create trigger trg_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()', tbl, tbl);
  end loop;
end $$;

alter table public.rtl_retail_hubs enable row level security;
alter table public.rtl_retail_brands enable row level security;
alter table public.rtl_stores enable row level security;
alter table public.rtl_cash_registers enable row level security;
alter table public.rtl_store_departments enable row level security;
alter table public.rtl_products enable row level security;
alter table public.rtl_product_categories enable row level security;
alter table public.rtl_product_variants enable row level security;
alter table public.rtl_promotions enable row level security;
alter table public.rtl_sales_orders enable row level security;
alter table public.rtl_pos_transactions enable row level security;
alter table public.rtl_returns_exchanges enable row level security;
alter table public.rtl_shift_closings enable row level security;
alter table public.rtl_warehouses enable row level security;
alter table public.rtl_stock_levels enable row level security;
alter table public.rtl_purchase_orders enable row level security;
alter table public.rtl_suppliers enable row level security;
alter table public.rtl_customer_profiles enable row level security;
alter table public.rtl_loyalty_programs enable row level security;
alter table public.rtl_reward_points enable row level security;
alter table public.rtl_campaigns enable row level security;
alter table public.rtl_daily_closings enable row level security;
alter table public.rtl_branch_performance enable row level security;
alter table public.rtl_commission_records enable row level security;
alter table public.rtl_sales_analytics enable row level security;
alter table public.rtl_inventory_analytics enable row level security;
alter table public.rtl_profitability_analytics enable row level security;
alter table public.rtl_retail_metrics enable row level security;
alter table public.rtl_retail_health enable row level security;
alter table public.rtl_executive_kpis enable row level security;
alter table public.rtl_retail_failures enable row level security;
alter table public.rtl_audit_logs enable row level security;

do $$
declare tbl text;
begin
  foreach tbl in array array[
    'rtl_retail_hubs','rtl_retail_brands','rtl_stores','rtl_cash_registers','rtl_store_departments','rtl_products','rtl_product_categories','rtl_product_variants','rtl_promotions','rtl_sales_orders','rtl_pos_transactions','rtl_returns_exchanges','rtl_shift_closings','rtl_warehouses','rtl_stock_levels','rtl_purchase_orders','rtl_suppliers','rtl_customer_profiles','rtl_loyalty_programs','rtl_reward_points','rtl_campaigns','rtl_daily_closings','rtl_branch_performance','rtl_commission_records','rtl_sales_analytics','rtl_inventory_analytics','rtl_profitability_analytics','rtl_retail_metrics','rtl_retail_health','rtl_executive_kpis','rtl_retail_failures','rtl_audit_logs'
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
  ('rtl.view', 'View enterprise retail business operating system data', 'enterprise_retail_business_os'),
  ('rtl.manage', 'Manage retail foundation, product, sales, inventory, customer, finance, and framework outputs', 'enterprise_retail_business_os'),
  ('rtl.approve', 'Approve retail sales and inventory gates', 'enterprise_retail_business_os'),
  ('rtl.admin', 'Administer enterprise retail business operating system governance', 'enterprise_retail_business_os')
on conflict (key) do update set description = excluded.description, resource = excluded.resource;
