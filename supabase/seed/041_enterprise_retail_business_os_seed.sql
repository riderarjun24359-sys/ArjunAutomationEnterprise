insert into public.ai_orchestration_agents (id, organization_id, name, agent_type, workflow_agent_id, provider_id, model_route_id, capabilities, status)
values
  ('a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a341', '11111111-1111-1111-1111-111111111111', 'Enterprise Retail Orchestrator', 'enterprise_retail_business_os', null, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a201', '["retail_foundation","product_engine","sales_pos","inventory_engine","customer_engine","finance_engine","retail_analytics","retail_dashboard"]'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.ai_sessions (id, organization_id, agent_id, session_key, module_source, entity_type, entity_id, context, status, expires_at)
values
  ('a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a541', '11111111-1111-1111-1111-111111111111', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a341', 'northstar-retail-os-001', 'enterprise_retail_business_os', 'retail_hub', '00710071-0071-0071-0071-007100710101', '{"objective":"Enterprise retail business operating system for northstar retail operations"}'::jsonb, 'active', '2026-12-31 23:59:59+00')
on conflict (id) do nothing;

-- M0 Retail Hub
insert into public.rtl_retail_hubs (id, organization_id, hub_key, hub_name, environment, retail_code, status)
values ('00710071-0071-0071-0071-007100710101', '11111111-1111-1111-1111-111111111111', 'northstar-retail-os', 'Northstar Retail OS Hub', 'production', 'RTL-0904-001', 'active')
on conflict (id) do nothing;

-- M1 Foundation
insert into public.rtl_retail_brands (id, organization_id, hub_id, brand_key, brand_name, brand_type, status)
values ('03000100-0300-0300-0300-030001000201', '11111111-1111-1111-1111-111111111111', '00710071-0071-0071-0071-007100710101', 'brand-flagship-0904', 'Northstar Flagship Brand', 'flagship', 'active')
on conflict (id) do nothing;

insert into public.rtl_stores (id, organization_id, hub_id, store_key, store_name, store_type, status)
values ('03010101-0301-0301-0301-030101010301', '11111111-1111-1111-1111-111111111111', '00710071-0071-0071-0071-007100710101', 'store-downtown-0904', 'Downtown Store', 'retail', 'active')
on conflict (id) do nothing;

insert into public.rtl_cash_registers (id, organization_id, hub_id, register_key, register_name, register_status, status)
values ('03020102-0302-0302-0302-030201020401', '11111111-1111-1111-1111-111111111111', '00710071-0071-0071-0071-007100710101', 'reg-pos-01-0904', 'POS Register 01', 'active', 'active')
on conflict (id) do nothing;

insert into public.rtl_store_departments (id, organization_id, hub_id, department_key, department_name, department_type, status)
values ('03030103-0303-0303-0303-030301030501', '11111111-1111-1111-1111-111111111111', '00710071-0071-0071-0071-007100710101', 'dept-apparel-0904', 'Apparel Department', 'sales', 'active')
on conflict (id) do nothing;

-- M2 Product
insert into public.rtl_products (id, organization_id, hub_id, product_key, product_name, product_type, status)
values ('03040104-0304-0304-0304-030401040601', '11111111-1111-1111-1111-111111111111', '00710071-0071-0071-0071-007100710101', 'prod-jacket-0904', 'Winter Jacket', 'standard', 'active')
on conflict (id) do nothing;

insert into public.rtl_product_categories (id, organization_id, hub_id, category_key, category_name, category_type, status)
values ('03050105-0305-0305-0305-030501050701', '11111111-1111-1111-1111-111111111111', '00710071-0071-0071-0071-007100710101', 'cat-apparel-0904', 'Apparel Category', 'general', 'active')
on conflict (id) do nothing;

insert into public.rtl_product_variants (id, organization_id, hub_id, variant_key, variant_name, variant_type, status)
values ('03060106-0306-0306-0306-030601060801', '11111111-1111-1111-1111-111111111111', '00710071-0071-0071-0071-007100710101', 'var-jacket-lg-0904', 'Winter Jacket Large', 'size', 'active')
on conflict (id) do nothing;

insert into public.rtl_promotions (id, organization_id, hub_id, promotion_key, promotion_name, promotion_status, status)
values ('03070107-0307-0307-0307-030701070901', '11111111-1111-1111-1111-111111111111', '00710071-0071-0071-0071-007100710101', 'promo-winter-0904', 'Winter Sale Promotion', 'active', 'active')
on conflict (id) do nothing;

-- M3 Sales & POS
insert into public.rtl_sales_orders (id, organization_id, hub_id, order_key, order_name, order_status, status)
values ('03080108-0308-0308-0308-030801080a01', '11111111-1111-1111-1111-111111111111', '00710071-0071-0071-0071-007100710101', 'ord-smith-0904', 'Smith Sales Order', 'pending', 'active')
on conflict (id) do nothing;

insert into public.rtl_pos_transactions (id, organization_id, hub_id, transaction_key, transaction_name, transaction_status, status)
values ('03090109-0309-0309-0309-030901090b01', '11111111-1111-1111-1111-111111111111', '00710071-0071-0071-0071-007100710101', 'pos-smith-0904', 'Smith POS Transaction', 'completed', 'active')
on conflict (id) do nothing;

insert into public.rtl_returns_exchanges (id, organization_id, hub_id, return_key, return_name, return_status, status)
values ('030a010a-030a-030a-030a-030a010a0c01', '11111111-1111-1111-1111-111111111111', '00710071-0071-0071-0071-007100710101', 'ret-smith-0904', 'Smith Return', 'pending', 'active')
on conflict (id) do nothing;

insert into public.rtl_shift_closings (id, organization_id, hub_id, closing_key, closing_name, closing_status, status)
values ('030b010b-030b-030b-030b-030b010b0d01', '11111111-1111-1111-1111-111111111111', '00710071-0071-0071-0071-007100710101', 'shift-close-0904', 'Evening Shift Closing', 'closed', 'active')
on conflict (id) do nothing;

-- M4 Inventory
insert into public.rtl_warehouses (id, organization_id, hub_id, warehouse_key, warehouse_name, warehouse_type, status)
values ('030c010c-030c-030c-030c-030c010c0e01', '11111111-1111-1111-1111-111111111111', '00710071-0071-0071-0071-007100710101', 'wh-central-0904', 'Central Warehouse', 'distribution', 'active')
on conflict (id) do nothing;

insert into public.rtl_stock_levels (id, organization_id, hub_id, stock_key, stock_name, stock_quantity, status)
values ('030d010d-030d-030d-030d-030d010d0f01', '11111111-1111-1111-1111-111111111111', '00710071-0071-0071-0071-007100710101', 'stk-jacket-0904', 'Jacket Stock Level', 150, 'active')
on conflict (id) do nothing;

insert into public.rtl_purchase_orders (id, organization_id, hub_id, order_key, order_name, order_status, status)
values ('030e010e-030e-030e-030e-030e010e1001', '11111111-1111-1111-1111-111111111111', '00710071-0071-0071-0071-007100710101', 'po-jacket-0904', 'Jacket Purchase Order', 'pending', 'active')
on conflict (id) do nothing;

insert into public.rtl_suppliers (id, organization_id, hub_id, supplier_key, supplier_name, supplier_type, status)
values ('030f010f-030f-030f-030f-030f010f1101', '11111111-1111-1111-1111-111111111111', '00710071-0071-0071-0071-007100710101', 'sup-apparel-0904', 'Apparel Supplier Co', 'vendor', 'active')
on conflict (id) do nothing;

-- M5 Customer
insert into public.rtl_customer_profiles (id, organization_id, hub_id, profile_key, profile_name, profile_type, status)
values ('03100110-0310-0310-0310-031001101201', '11111111-1111-1111-1111-111111111111', '00710071-0071-0071-0071-007100710101', 'cust-smith-0904', 'Smith Customer Profile', 'regular', 'active')
on conflict (id) do nothing;

insert into public.rtl_loyalty_programs (id, organization_id, hub_id, program_key, program_name, program_type, status)
values ('03110111-0311-0311-0311-031101111301', '11111111-1111-1111-1111-111111111111', '00710071-0071-0071-0071-007100710101', 'loyalty-gold-0904', 'Gold Loyalty Program', 'points', 'active')
on conflict (id) do nothing;

insert into public.rtl_reward_points (id, organization_id, hub_id, points_key, points_name, points_balance, status)
values ('03120112-0312-0312-0312-031201121401', '11111111-1111-1111-1111-111111111111', '00710071-0071-0071-0071-007100710101', 'pts-smith-0904', 'Smith Reward Points', 250.00, 'active')
on conflict (id) do nothing;

insert into public.rtl_campaigns (id, organization_id, hub_id, campaign_key, campaign_name, campaign_status, status)
values ('03130113-0313-0313-0313-031301131501', '11111111-1111-1111-1111-111111111111', '00710071-0071-0071-0071-007100710101', 'camp-winter-0904', 'Winter Campaign', 'active', 'active')
on conflict (id) do nothing;

-- M6 Finance
insert into public.rtl_daily_closings (id, organization_id, hub_id, closing_key, closing_name, closing_amount, status)
values ('03140114-0314-0314-0314-031401141601', '11111111-1111-1111-1111-111111111111', '00710071-0071-0071-0071-007100710101', 'daily-close-0904', 'Daily Store Closing', 45000.00, 'active')
on conflict (id) do nothing;

insert into public.rtl_branch_performance (id, organization_id, hub_id, performance_key, performance_name, performance_score, status)
values ('03150115-0315-0315-0315-031501151701', '11111111-1111-1111-1111-111111111111', '00710071-0071-0071-0071-007100710101', 'perf-downtown-0904', 'Downtown Branch Performance', 92.50, 'active')
on conflict (id) do nothing;

insert into public.rtl_commission_records (id, organization_id, hub_id, commission_key, commission_name, commission_amount, status)
values ('03160116-0316-0316-0316-031601161801', '11111111-1111-1111-1111-111111111111', '00710071-0071-0071-0071-007100710101', 'comm-smith-0904', 'Smith Commission Record', 1250.00, 'active')
on conflict (id) do nothing;

-- M7 Analytics
insert into public.rtl_sales_analytics (id, organization_id, hub_id, analytics_key, analytics_type, analytics_score, status)
values ('03170117-0317-0317-0317-031701171901', '11111111-1111-1111-1111-111111111111', '00710071-0071-0071-0071-007100710101', 'anly-sales-0904', 'sales', 94.50, 'active')
on conflict (id) do nothing;

insert into public.rtl_inventory_analytics (id, organization_id, hub_id, analytics_key, analytics_type, analytics_score, status)
values ('03180118-0318-0318-0318-031801181a01', '11111111-1111-1111-1111-111111111111', '00710071-0071-0071-0071-007100710101', 'anly-inv-0904', 'inventory', 88.00, 'active')
on conflict (id) do nothing;

insert into public.rtl_profitability_analytics (id, organization_id, hub_id, analytics_key, analytics_type, analytics_score, status)
values ('03190119-0319-0319-0319-031901191b01', '11111111-1111-1111-1111-111111111111', '00710071-0071-0071-0071-007100710101', 'anly-profit-0904', 'profitability', 96.00, 'active')
on conflict (id) do nothing;

-- M8 Executive Dashboard
insert into public.rtl_retail_metrics (id, organization_id, metrics_key, revenue_total, profit_total, sales_count, inventory_value, customer_retention_rate, store_performance_score, top_product_score, overall_retail_score, status)
values ('031a011a-031a-031a-031a-031a011a1c01', '11111111-1111-1111-1111-111111111111', 'rtl-metrics-0904', 3500000.00, 875000.00, 12500, 980000.00, 87.50, 91.00, 93.50, 95.25, 'active')
on conflict (id) do nothing;

insert into public.rtl_retail_health (id, organization_id, health_key, overall_score, disaster_recovery_mode, inventory_health_status, financial_health_status, operational_health_status, summary, status)
values ('031b011b-031b-031b-031b-031b011b1d01', '11111111-1111-1111-1111-111111111111', 'rtl-health-0904', 96.00, false, 'healthy', 'healthy', 'healthy', 'Retail business operating system operational', 'healthy')
on conflict (id) do nothing;

insert into public.rtl_executive_kpis (id, organization_id, hub_id, kpi_key, kpi_name, kpi_score, status)
values ('031c011c-031c-031c-031c-031c011c1e01', '11111111-1111-1111-1111-111111111111', '00710071-0071-0071-0071-007100710101', 'kpi-exec-0904', 'Executive KPI Score', 97.50, 'active')
on conflict (id) do nothing;

insert into public.rtl_retail_failures (id, organization_id, hub_id, failure_key, failure_type, error_code, error_message, status)
values ('031d011d-031d-031d-031d-031d011d1f01', '11111111-1111-1111-1111-111111111111', '00710071-0071-0071-0071-007100710101', 'fail-pos-0904', 'pos', 'POS_TIMEOUT', 'POS transaction processing timed out', 'open')
on conflict (id) do nothing;

insert into public.rtl_audit_logs (id, organization_id, entity_type, action, summary, security_level)
values ('031e011e-031e-031e-031e-031e011e2001', '11111111-1111-1111-1111-111111111111', 'retail_hub', 'seed', 'Enterprise retail business operating system seed data loaded', 'standard')
on conflict (id) do nothing;
