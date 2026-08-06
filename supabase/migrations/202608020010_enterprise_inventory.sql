-- Sprint 17: Enterprise Inventory & Asset Management

create table if not exists public.product_categories (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  slug text not null,
  description text not null default '',
  parent_category_id uuid references public.product_categories(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, slug)
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  category_id uuid references public.product_categories(id) on delete set null,
  sku text not null,
  name text not null,
  description text not null default '',
  unit_of_measure text not null default 'each',
  unit_cost numeric(12,2) not null default 0,
  unit_price numeric(12,2) not null default 0,
  reorder_level numeric(12,2) not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, sku)
);

create table if not exists public.warehouses (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  code text not null,
  location text not null default '',
  manager_name text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, code)
);

create table if not exists public.stock_levels (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  warehouse_id uuid not null references public.warehouses(id) on delete cascade,
  quantity numeric(12,2) not null default 0,
  reserved_quantity numeric(12,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, warehouse_id)
);

create table if not exists public.suppliers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  code text not null,
  email text not null default '',
  phone text not null default '',
  address text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, code)
);

create table if not exists public.stock_movements (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  warehouse_id uuid not null references public.warehouses(id) on delete cascade,
  movement_type text not null,
  quantity numeric(12,2) not null,
  reference_type text not null default '',
  reference_id uuid,
  project_id uuid references public.projects(id) on delete set null,
  notes text not null default '',
  moved_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.inventory_adjustments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  warehouse_id uuid not null references public.warehouses(id) on delete cascade,
  adjustment_type text not null default 'correction',
  quantity_delta numeric(12,2) not null,
  reason text not null default '',
  adjusted_by uuid references public.user_profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.purchase_orders (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  supplier_id uuid not null references public.suppliers(id) on delete restrict,
  po_number text not null,
  status text not null default 'draft',
  order_date date not null default current_date,
  expected_date date,
  total_amount numeric(12,2) not null default 0,
  expense_id uuid references public.expenses(id) on delete set null,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, po_number)
);

create table if not exists public.purchase_order_items (
  id uuid primary key default gen_random_uuid(),
  purchase_order_id uuid not null references public.purchase_orders(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  quantity numeric(12,2) not null,
  unit_cost numeric(12,2) not null default 0,
  line_total numeric(12,2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.assets (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  asset_tag text not null,
  name text not null,
  category text not null default 'equipment',
  serial_number text not null default '',
  purchase_cost numeric(12,2) not null default 0,
  status text not null default 'available',
  warehouse_id uuid references public.warehouses(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  employee_id uuid references public.employees(id) on delete set null,
  acquired_date date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, asset_tag)
);

create table if not exists public.product_barcodes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  asset_id uuid references public.assets(id) on delete cascade,
  barcode_value text not null,
  barcode_type text not null default 'code128',
  created_at timestamptz not null default now(),
  unique (organization_id, barcode_value)
);

create table if not exists public.low_stock_alerts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  warehouse_id uuid not null references public.warehouses(id) on delete cascade,
  current_quantity numeric(12,2) not null default 0,
  reorder_level numeric(12,2) not null default 0,
  status text not null default 'open',
  triggered_at timestamptz not null default now(),
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.stock_transfers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  transfer_number text not null,
  source_warehouse_id uuid not null references public.warehouses(id) on delete restrict,
  destination_warehouse_id uuid not null references public.warehouses(id) on delete restrict,
  status text not null default 'pending',
  notes text not null default '',
  transferred_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, transfer_number)
);

create table if not exists public.stock_transfer_items (
  id uuid primary key default gen_random_uuid(),
  transfer_id uuid not null references public.stock_transfers(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  quantity numeric(12,2) not null,
  created_at timestamptz not null default now()
);

create table if not exists public.goods_received_notes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  grn_number text not null,
  purchase_order_id uuid references public.purchase_orders(id) on delete set null,
  warehouse_id uuid not null references public.warehouses(id) on delete restrict,
  supplier_id uuid references public.suppliers(id) on delete set null,
  status text not null default 'received',
  received_date date not null default current_date,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, grn_number)
);

create table if not exists public.grn_items (
  id uuid primary key default gen_random_uuid(),
  grn_id uuid not null references public.goods_received_notes(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  quantity_received numeric(12,2) not null,
  unit_cost numeric(12,2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.inventory_valuations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  valuation_date date not null default current_date,
  method text not null default 'weighted_average',
  total_value numeric(14,2) not null default 0,
  total_units numeric(14,2) not null default 0,
  notes text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.inventory_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  entity_type text not null,
  entity_id uuid,
  action text not null,
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  performed_by uuid references public.user_profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_product_categories_org on public.product_categories(organization_id);
create index if not exists idx_products_org on public.products(organization_id);
create index if not exists idx_warehouses_org on public.warehouses(organization_id);
create index if not exists idx_stock_levels_org on public.stock_levels(organization_id);
create index if not exists idx_suppliers_org on public.suppliers(organization_id);
create index if not exists idx_stock_movements_org on public.stock_movements(organization_id);
create index if not exists idx_inventory_adjustments_org on public.inventory_adjustments(organization_id);
create index if not exists idx_purchase_orders_org on public.purchase_orders(organization_id);
create index if not exists idx_assets_org on public.assets(organization_id);
create index if not exists idx_product_barcodes_org on public.product_barcodes(organization_id);
create index if not exists idx_low_stock_alerts_org on public.low_stock_alerts(organization_id);
create index if not exists idx_stock_transfers_org on public.stock_transfers(organization_id);
create index if not exists idx_goods_received_notes_org on public.goods_received_notes(organization_id);
create index if not exists idx_inventory_valuations_org on public.inventory_valuations(organization_id);
create index if not exists idx_inventory_audit_logs_org on public.inventory_audit_logs(organization_id);

drop trigger if exists trg_product_categories_updated_at on public.product_categories;
create trigger trg_product_categories_updated_at before update on public.product_categories for each row execute function public.set_updated_at();
drop trigger if exists trg_products_updated_at on public.products;
create trigger trg_products_updated_at before update on public.products for each row execute function public.set_updated_at();
drop trigger if exists trg_warehouses_updated_at on public.warehouses;
create trigger trg_warehouses_updated_at before update on public.warehouses for each row execute function public.set_updated_at();
drop trigger if exists trg_stock_levels_updated_at on public.stock_levels;
create trigger trg_stock_levels_updated_at before update on public.stock_levels for each row execute function public.set_updated_at();
drop trigger if exists trg_suppliers_updated_at on public.suppliers;
create trigger trg_suppliers_updated_at before update on public.suppliers for each row execute function public.set_updated_at();
drop trigger if exists trg_purchase_orders_updated_at on public.purchase_orders;
create trigger trg_purchase_orders_updated_at before update on public.purchase_orders for each row execute function public.set_updated_at();
drop trigger if exists trg_assets_updated_at on public.assets;
create trigger trg_assets_updated_at before update on public.assets for each row execute function public.set_updated_at();
drop trigger if exists trg_stock_transfers_updated_at on public.stock_transfers;
create trigger trg_stock_transfers_updated_at before update on public.stock_transfers for each row execute function public.set_updated_at();
drop trigger if exists trg_goods_received_notes_updated_at on public.goods_received_notes;
create trigger trg_goods_received_notes_updated_at before update on public.goods_received_notes for each row execute function public.set_updated_at();

alter table public.product_categories enable row level security;
alter table public.products enable row level security;
alter table public.warehouses enable row level security;
alter table public.stock_levels enable row level security;
alter table public.suppliers enable row level security;
alter table public.stock_movements enable row level security;
alter table public.inventory_adjustments enable row level security;
alter table public.purchase_orders enable row level security;
alter table public.purchase_order_items enable row level security;
alter table public.assets enable row level security;
alter table public.product_barcodes enable row level security;
alter table public.low_stock_alerts enable row level security;
alter table public.stock_transfers enable row level security;
alter table public.stock_transfer_items enable row level security;
alter table public.goods_received_notes enable row level security;
alter table public.grn_items enable row level security;
alter table public.inventory_valuations enable row level security;
alter table public.inventory_audit_logs enable row level security;

do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'product_categories', 'products', 'warehouses', 'stock_levels', 'suppliers',
    'stock_movements', 'inventory_adjustments', 'purchase_orders', 'assets',
    'product_barcodes', 'low_stock_alerts', 'stock_transfers',
    'goods_received_notes', 'inventory_valuations', 'inventory_audit_logs'
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

drop policy if exists purchase_order_items_select on public.purchase_order_items;
create policy purchase_order_items_select on public.purchase_order_items for select using (
  exists (select 1 from public.purchase_orders p where p.id = purchase_order_id and public.is_organization_member(p.organization_id))
);
drop policy if exists purchase_order_items_insert on public.purchase_order_items;
create policy purchase_order_items_insert on public.purchase_order_items for insert with check (
  exists (select 1 from public.purchase_orders p where p.id = purchase_order_id and public.is_organization_member(p.organization_id))
);
drop policy if exists purchase_order_items_update on public.purchase_order_items;
create policy purchase_order_items_update on public.purchase_order_items for update using (
  exists (select 1 from public.purchase_orders p where p.id = purchase_order_id and public.is_organization_member(p.organization_id))
);
drop policy if exists purchase_order_items_delete on public.purchase_order_items;
create policy purchase_order_items_delete on public.purchase_order_items for delete using (
  exists (select 1 from public.purchase_orders p where p.id = purchase_order_id and public.is_organization_member(p.organization_id))
);

drop policy if exists stock_transfer_items_select on public.stock_transfer_items;
create policy stock_transfer_items_select on public.stock_transfer_items for select using (
  exists (select 1 from public.stock_transfers t where t.id = transfer_id and public.is_organization_member(t.organization_id))
);
drop policy if exists stock_transfer_items_insert on public.stock_transfer_items;
create policy stock_transfer_items_insert on public.stock_transfer_items for insert with check (
  exists (select 1 from public.stock_transfers t where t.id = transfer_id and public.is_organization_member(t.organization_id))
);
drop policy if exists stock_transfer_items_update on public.stock_transfer_items;
create policy stock_transfer_items_update on public.stock_transfer_items for update using (
  exists (select 1 from public.stock_transfers t where t.id = transfer_id and public.is_organization_member(t.organization_id))
);
drop policy if exists stock_transfer_items_delete on public.stock_transfer_items;
create policy stock_transfer_items_delete on public.stock_transfer_items for delete using (
  exists (select 1 from public.stock_transfers t where t.id = transfer_id and public.is_organization_member(t.organization_id))
);

drop policy if exists grn_items_select on public.grn_items;
create policy grn_items_select on public.grn_items for select using (
  exists (select 1 from public.goods_received_notes g where g.id = grn_id and public.is_organization_member(g.organization_id))
);
drop policy if exists grn_items_insert on public.grn_items;
create policy grn_items_insert on public.grn_items for insert with check (
  exists (select 1 from public.goods_received_notes g where g.id = grn_id and public.is_organization_member(g.organization_id))
);
drop policy if exists grn_items_update on public.grn_items;
create policy grn_items_update on public.grn_items for update using (
  exists (select 1 from public.goods_received_notes g where g.id = grn_id and public.is_organization_member(g.organization_id))
);
drop policy if exists grn_items_delete on public.grn_items;
create policy grn_items_delete on public.grn_items for delete using (
  exists (select 1 from public.goods_received_notes g where g.id = grn_id and public.is_organization_member(g.organization_id))
);

insert into public.permissions (key, description, resource)
values
  ('inventory.view', 'View inventory and assets', 'inventory'),
  ('inventory.manage', 'Manage inventory, stock, and warehouses', 'inventory'),
  ('inventory.procurement.manage', 'Manage purchase orders and suppliers', 'inventory'),
  ('inventory.assets.manage', 'Manage fixed assets and assignments', 'inventory')
on conflict (key) do update set description = excluded.description, resource = excluded.resource;
