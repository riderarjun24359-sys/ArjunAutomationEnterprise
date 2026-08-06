-- V2 Program B Sprint 6: Enterprise Restaurant Business Operating System

-- RestaurantHub
create table if not exists public.rst_restaurant_hubs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_key text not null,
  hub_name text not null,
  environment text not null default 'production',
  gst_number text not null default '',
  operating_hours jsonb not null default '{}'::jsonb,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_key)
);

-- Brand
create table if not exists public.rst_brands (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.rst_restaurant_hubs(id) on delete cascade,
  brand_key text not null,
  brand_name text not null default '',
  brand_type text not null default 'franchise',
  description text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, brand_key)
);

-- Branch
create table if not exists public.rst_branches (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.rst_restaurant_hubs(id) on delete cascade,
  branch_key text not null,
  branch_name text not null default '',
  branch_address text not null default '',
  city text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, branch_key)
);

-- BusinessLicense
create table if not exists public.rst_business_licenses (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.rst_restaurant_hubs(id) on delete cascade,
  license_key text not null,
  license_name text not null default '',
  license_type text not null default 'food_service',
  expiry_date date,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, license_key)
);

-- DiningArea
create table if not exists public.rst_dining_areas (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.rst_restaurant_hubs(id) on delete cascade,
  area_key text not null,
  area_name text not null default '',
  area_type text not null default 'indoor',
  capacity integer not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, area_key)
);

-- RestaurantTable
create table if not exists public.rst_restaurant_tables (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.rst_restaurant_hubs(id) on delete cascade,
  table_key text not null,
  table_name text not null default '',
  qr_code text not null default '',
  table_status text not null default 'available',
  floor_ref text not null default '',
  seats integer not null default 4,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, table_key)
);

-- MenuCategory
create table if not exists public.rst_menu_categories (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.rst_restaurant_hubs(id) on delete cascade,
  category_key text not null,
  category_name text not null default '',
  category_type text not null default 'main',
  display_order integer not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, category_key)
);

-- MenuItem
create table if not exists public.rst_menu_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.rst_restaurant_hubs(id) on delete cascade,
  item_key text not null,
  item_name text not null default '',
  item_price numeric(10, 2) not null default 0,
  description text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, item_key)
);

-- MenuVariant
create table if not exists public.rst_menu_variants (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.rst_restaurant_hubs(id) on delete cascade,
  variant_key text not null,
  variant_name text not null default '',
  variant_type text not null default 'size',
  price_adjustment numeric(10, 2) not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, variant_key)
);

-- AddOn
create table if not exists public.rst_add_ons (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.rst_restaurant_hubs(id) on delete cascade,
  addon_key text not null,
  addon_name text not null default '',
  addon_price numeric(10, 2) not null default 0,
  addon_type text not null default 'extra',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, addon_key)
);

-- ComboMeal
create table if not exists public.rst_combo_meals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.rst_restaurant_hubs(id) on delete cascade,
  combo_key text not null,
  combo_name text not null default '',
  combo_price numeric(10, 2) not null default 0,
  combo_type text not null default 'standard',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, combo_key)
);

-- Order
create table if not exists public.rst_orders (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.rst_restaurant_hubs(id) on delete cascade,
  order_key text not null,
  order_number text not null default '',
  order_type text not null default 'dine-in',
  order_status text not null default 'pending',
  total_amount numeric(10, 2) not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, order_key)
);

-- OrderItem
create table if not exists public.rst_order_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.rst_restaurant_hubs(id) on delete cascade,
  item_key text not null,
  item_name text not null default '',
  item_quantity integer not null default 1,
  unit_price numeric(10, 2) not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, item_key)
);

-- OrderQueue
create table if not exists public.rst_order_queue (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.rst_restaurant_hubs(id) on delete cascade,
  queue_key text not null,
  queue_name text not null default '',
  queue_status text not null default 'waiting',
  position integer not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, queue_key)
);

-- KitchenRouting
create table if not exists public.rst_kitchen_routing (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.rst_restaurant_hubs(id) on delete cascade,
  routing_key text not null,
  routing_name text not null default '',
  routing_status text not null default 'pending',
  station_ref text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, routing_key)
);

-- OrderTimeline
create table if not exists public.rst_order_timeline (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.rst_restaurant_hubs(id) on delete cascade,
  timeline_key text not null,
  timeline_event text not null default '',
  timeline_status text not null default 'pending',
  recorded_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, timeline_key)
);

-- KitchenStation
create table if not exists public.rst_kitchen_stations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.rst_restaurant_hubs(id) on delete cascade,
  station_key text not null,
  station_name text not null default '',
  station_type text not null default 'grill',
  capacity integer not null default 5,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, station_key)
);

-- PreparationQueue
create table if not exists public.rst_preparation_queue (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.rst_restaurant_hubs(id) on delete cascade,
  prep_key text not null,
  prep_name text not null default '',
  prep_status text not null default 'queued',
  priority integer not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, prep_key)
);

-- CookingStatus
create table if not exists public.rst_cooking_status (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.rst_restaurant_hubs(id) on delete cascade,
  cooking_key text not null,
  cooking_name text not null default '',
  cooking_status text not null default 'preparing',
  started_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, cooking_key)
);

-- ReadyQueue
create table if not exists public.rst_ready_queue (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.rst_restaurant_hubs(id) on delete cascade,
  ready_key text not null,
  ready_name text not null default '',
  ready_status text not null default 'ready',
  ready_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, ready_key)
);

-- RushOrder
create table if not exists public.rst_rush_orders (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.rst_restaurant_hubs(id) on delete cascade,
  rush_key text not null,
  rush_name text not null default '',
  rush_priority text not null default 'high',
  escalated_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, rush_key)
);

-- Reservation
create table if not exists public.rst_reservations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.rst_restaurant_hubs(id) on delete cascade,
  reservation_key text not null,
  reservation_name text not null default '',
  reservation_status text not null default 'pending',
  party_size integer not null default 2,
  reserved_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, reservation_key)
);

-- WaitingList
create table if not exists public.rst_waiting_list (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.rst_restaurant_hubs(id) on delete cascade,
  wait_key text not null,
  wait_name text not null default '',
  wait_status text not null default 'waiting',
  party_size integer not null default 2,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, wait_key)
);

-- CustomerProfile
create table if not exists public.rst_customer_profiles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.rst_restaurant_hubs(id) on delete cascade,
  profile_key text not null,
  profile_name text not null default '',
  profile_type text not null default 'regular',
  email text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, profile_key)
);

-- LoyaltyProgram
create table if not exists public.rst_loyalty_programs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.rst_restaurant_hubs(id) on delete cascade,
  program_key text not null,
  program_name text not null default '',
  program_type text not null default 'points',
  points_balance integer not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, program_key)
);

-- FeedbackReview
create table if not exists public.rst_feedback_reviews (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.rst_restaurant_hubs(id) on delete cascade,
  review_key text not null,
  review_title text not null default '',
  review_rating numeric(3, 1) not null default 5,
  review_text text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, review_key)
);

-- RestaurantMetric
create table if not exists public.rst_restaurant_metrics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  metrics_key text not null,
  metric_date date not null default current_date,
  order_count integer not null default 0,
  revenue_total numeric(12, 2) not null default 0,
  average_bill numeric(10, 2) not null default 0,
  occupancy_rate numeric(5, 2) not null default 0,
  popular_dish_score numeric(5, 2) not null default 0,
  peak_hour_score numeric(5, 2) not null default 0,
  customer_growth_rate numeric(5, 2) not null default 0,
  kitchen_performance_score numeric(5, 2) not null default 0,
  overall_restaurant_score numeric(5, 2) not null default 100,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, metrics_key)
);

-- RestaurantHealth
create table if not exists public.rst_restaurant_health (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  health_key text not null,
  health_date date not null default current_date,
  overall_score numeric(5, 2) not null default 100,
  disaster_recovery_mode boolean not null default false,
  pending_orders_count integer not null default 0,
  kitchen_queue_depth integer not null default 0,
  framework_health_status text not null default 'healthy',
  summary text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, health_key)
);

-- RevenueAnalytics
create table if not exists public.rst_revenue_analytics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.rst_restaurant_hubs(id) on delete cascade,
  analytics_key text not null,
  analytics_type text not null default 'revenue',
  analytics_score numeric(5, 2) not null default 0,
  metric_date date not null default current_date,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, analytics_key)
);

-- KitchenPerformance
create table if not exists public.rst_kitchen_performance (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.rst_restaurant_hubs(id) on delete cascade,
  performance_key text not null,
  performance_type text not null default 'kitchen',
  performance_score numeric(5, 2) not null default 0,
  metric_date date not null default current_date,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, performance_key)
);

-- RestaurantFailure
create table if not exists public.rst_restaurant_failures (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.rst_restaurant_hubs(id) on delete cascade,
  failure_key text not null,
  failure_type text not null default 'order',
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
create table if not exists public.rst_audit_logs (
  id uuid primary key default gen_random_uuid(),
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

create index if not exists idx_rst_restaurant_hubs_org on public.rst_restaurant_hubs(organization_id);
create index if not exists idx_rst_brands_org on public.rst_brands(organization_id);
create index if not exists idx_rst_brands_hub on public.rst_brands(hub_id);
create index if not exists idx_rst_branches_org on public.rst_branches(organization_id);
create index if not exists idx_rst_branches_hub on public.rst_branches(hub_id);
create index if not exists idx_rst_business_licenses_org on public.rst_business_licenses(organization_id);
create index if not exists idx_rst_business_licenses_hub on public.rst_business_licenses(hub_id);
create index if not exists idx_rst_dining_areas_org on public.rst_dining_areas(organization_id);
create index if not exists idx_rst_dining_areas_hub on public.rst_dining_areas(hub_id);
create index if not exists idx_rst_restaurant_tables_org on public.rst_restaurant_tables(organization_id);
create index if not exists idx_rst_restaurant_tables_hub on public.rst_restaurant_tables(hub_id);
create index if not exists idx_rst_menu_categories_org on public.rst_menu_categories(organization_id);
create index if not exists idx_rst_menu_categories_hub on public.rst_menu_categories(hub_id);
create index if not exists idx_rst_menu_items_org on public.rst_menu_items(organization_id);
create index if not exists idx_rst_menu_items_hub on public.rst_menu_items(hub_id);
create index if not exists idx_rst_menu_variants_org on public.rst_menu_variants(organization_id);
create index if not exists idx_rst_menu_variants_hub on public.rst_menu_variants(hub_id);
create index if not exists idx_rst_add_ons_org on public.rst_add_ons(organization_id);
create index if not exists idx_rst_add_ons_hub on public.rst_add_ons(hub_id);
create index if not exists idx_rst_combo_meals_org on public.rst_combo_meals(organization_id);
create index if not exists idx_rst_combo_meals_hub on public.rst_combo_meals(hub_id);
create index if not exists idx_rst_orders_org on public.rst_orders(organization_id);
create index if not exists idx_rst_orders_hub on public.rst_orders(hub_id);
create index if not exists idx_rst_order_items_org on public.rst_order_items(organization_id);
create index if not exists idx_rst_order_items_hub on public.rst_order_items(hub_id);
create index if not exists idx_rst_order_queue_org on public.rst_order_queue(organization_id);
create index if not exists idx_rst_order_queue_hub on public.rst_order_queue(hub_id);
create index if not exists idx_rst_kitchen_routing_org on public.rst_kitchen_routing(organization_id);
create index if not exists idx_rst_kitchen_routing_hub on public.rst_kitchen_routing(hub_id);
create index if not exists idx_rst_order_timeline_org on public.rst_order_timeline(organization_id);
create index if not exists idx_rst_order_timeline_hub on public.rst_order_timeline(hub_id);
create index if not exists idx_rst_kitchen_stations_org on public.rst_kitchen_stations(organization_id);
create index if not exists idx_rst_kitchen_stations_hub on public.rst_kitchen_stations(hub_id);
create index if not exists idx_rst_preparation_queue_org on public.rst_preparation_queue(organization_id);
create index if not exists idx_rst_preparation_queue_hub on public.rst_preparation_queue(hub_id);
create index if not exists idx_rst_cooking_status_org on public.rst_cooking_status(organization_id);
create index if not exists idx_rst_cooking_status_hub on public.rst_cooking_status(hub_id);
create index if not exists idx_rst_ready_queue_org on public.rst_ready_queue(organization_id);
create index if not exists idx_rst_ready_queue_hub on public.rst_ready_queue(hub_id);
create index if not exists idx_rst_rush_orders_org on public.rst_rush_orders(organization_id);
create index if not exists idx_rst_rush_orders_hub on public.rst_rush_orders(hub_id);
create index if not exists idx_rst_reservations_org on public.rst_reservations(organization_id);
create index if not exists idx_rst_reservations_hub on public.rst_reservations(hub_id);
create index if not exists idx_rst_waiting_list_org on public.rst_waiting_list(organization_id);
create index if not exists idx_rst_waiting_list_hub on public.rst_waiting_list(hub_id);
create index if not exists idx_rst_customer_profiles_org on public.rst_customer_profiles(organization_id);
create index if not exists idx_rst_customer_profiles_hub on public.rst_customer_profiles(hub_id);
create index if not exists idx_rst_loyalty_programs_org on public.rst_loyalty_programs(organization_id);
create index if not exists idx_rst_loyalty_programs_hub on public.rst_loyalty_programs(hub_id);
create index if not exists idx_rst_feedback_reviews_org on public.rst_feedback_reviews(organization_id);
create index if not exists idx_rst_feedback_reviews_hub on public.rst_feedback_reviews(hub_id);
create index if not exists idx_rst_restaurant_metrics_org on public.rst_restaurant_metrics(organization_id);
create index if not exists idx_rst_restaurant_health_org on public.rst_restaurant_health(organization_id);
create index if not exists idx_rst_revenue_analytics_org on public.rst_revenue_analytics(organization_id);
create index if not exists idx_rst_revenue_analytics_hub on public.rst_revenue_analytics(hub_id);
create index if not exists idx_rst_kitchen_performance_org on public.rst_kitchen_performance(organization_id);
create index if not exists idx_rst_kitchen_performance_hub on public.rst_kitchen_performance(hub_id);
create index if not exists idx_rst_restaurant_failures_org on public.rst_restaurant_failures(organization_id);
create index if not exists idx_rst_restaurant_failures_hub on public.rst_restaurant_failures(hub_id);
create index if not exists idx_rst_audit_logs_org on public.rst_audit_logs(organization_id);

do $$
declare tbl text;
begin
  foreach tbl in array array[
    'rst_restaurant_hubs','rst_brands','rst_branches','rst_business_licenses','rst_dining_areas','rst_restaurant_tables','rst_menu_categories','rst_menu_items','rst_menu_variants','rst_add_ons','rst_combo_meals','rst_orders','rst_order_items','rst_order_queue','rst_kitchen_routing','rst_order_timeline','rst_kitchen_stations','rst_preparation_queue','rst_cooking_status','rst_ready_queue','rst_rush_orders','rst_reservations','rst_waiting_list','rst_customer_profiles','rst_loyalty_programs','rst_feedback_reviews','rst_restaurant_metrics','rst_restaurant_health','rst_revenue_analytics','rst_kitchen_performance','rst_restaurant_failures'
  ]
  loop
    execute format('drop trigger if exists trg_%I_updated_at on public.%I', tbl, tbl);
    execute format('create trigger trg_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()', tbl, tbl);
  end loop;
end $$;

alter table public.rst_restaurant_hubs enable row level security;
alter table public.rst_brands enable row level security;
alter table public.rst_branches enable row level security;
alter table public.rst_business_licenses enable row level security;
alter table public.rst_dining_areas enable row level security;
alter table public.rst_restaurant_tables enable row level security;
alter table public.rst_menu_categories enable row level security;
alter table public.rst_menu_items enable row level security;
alter table public.rst_menu_variants enable row level security;
alter table public.rst_add_ons enable row level security;
alter table public.rst_combo_meals enable row level security;
alter table public.rst_orders enable row level security;
alter table public.rst_order_items enable row level security;
alter table public.rst_order_queue enable row level security;
alter table public.rst_kitchen_routing enable row level security;
alter table public.rst_order_timeline enable row level security;
alter table public.rst_kitchen_stations enable row level security;
alter table public.rst_preparation_queue enable row level security;
alter table public.rst_cooking_status enable row level security;
alter table public.rst_ready_queue enable row level security;
alter table public.rst_rush_orders enable row level security;
alter table public.rst_reservations enable row level security;
alter table public.rst_waiting_list enable row level security;
alter table public.rst_customer_profiles enable row level security;
alter table public.rst_loyalty_programs enable row level security;
alter table public.rst_feedback_reviews enable row level security;
alter table public.rst_restaurant_metrics enable row level security;
alter table public.rst_restaurant_health enable row level security;
alter table public.rst_revenue_analytics enable row level security;
alter table public.rst_kitchen_performance enable row level security;
alter table public.rst_restaurant_failures enable row level security;
alter table public.rst_audit_logs enable row level security;

do $$
declare tbl text;
begin
  foreach tbl in array array[
    'rst_restaurant_hubs','rst_brands','rst_branches','rst_business_licenses','rst_dining_areas','rst_restaurant_tables','rst_menu_categories','rst_menu_items','rst_menu_variants','rst_add_ons','rst_combo_meals','rst_orders','rst_order_items','rst_order_queue','rst_kitchen_routing','rst_order_timeline','rst_kitchen_stations','rst_preparation_queue','rst_cooking_status','rst_ready_queue','rst_rush_orders','rst_reservations','rst_waiting_list','rst_customer_profiles','rst_loyalty_programs','rst_feedback_reviews','rst_restaurant_metrics','rst_restaurant_health','rst_revenue_analytics','rst_kitchen_performance','rst_restaurant_failures','rst_audit_logs'
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
  ('rst.view', 'View enterprise restaurant business operating system data', 'enterprise_restaurant_business_os'),
  ('rst.manage', 'Manage restaurant foundation, menu, orders, kitchen, customer, and framework outputs', 'enterprise_restaurant_business_os'),
  ('rst.approve', 'Approve restaurant reservations and order gates', 'enterprise_restaurant_business_os'),
  ('rst.admin', 'Administer enterprise restaurant business operating system governance', 'enterprise_restaurant_business_os')
on conflict (key) do update set description = excluded.description, resource = excluded.resource;
