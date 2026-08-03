insert into public.ai_orchestration_agents (id, organization_id, name, agent_type, workflow_agent_id, provider_id, model_route_id, capabilities, status)
values
  ('a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a338', '11111111-1111-1111-1111-111111111111', 'Enterprise Restaurant Orchestrator', 'enterprise_restaurant_business_os', null, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a201', '["restaurant_foundation","menu_engine","order_engine","kitchen_engine","customer_engine","restaurant_analytics","restaurant_dashboard"]'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.ai_sessions (id, organization_id, agent_id, session_key, module_source, entity_type, entity_id, context, status, expires_at)
values
  ('a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a538', '11111111-1111-1111-1111-111111111111', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a338', 'northstar-restaurant-os-001', 'enterprise_restaurant_business_os', 'restaurant_hub', '006e006e-006e-006e-006e-006e006e0101', '{"objective":"Enterprise restaurant business operating system for northstar dining operations"}'::jsonb, 'active', '2026-12-31 23:59:59+00')
on conflict (id) do nothing;

-- M0 Restaurant Hub
insert into public.rst_restaurant_hubs (id, organization_id, hub_key, hub_name, environment, gst_number, operating_hours, status)
values ('006e006e-006e-006e-006e-006e006e0101', '11111111-1111-1111-1111-111111111111', 'northstar-restaurant-os', 'Northstar Restaurant OS Hub', 'production', 'GST-0804-001', '{"mon":"09:00-22:00","tue":"09:00-22:00"}'::jsonb, 'active')
on conflict (id) do nothing;

-- M1 Foundation
insert into public.rst_brands (id, organization_id, hub_id, brand_key, brand_name, brand_type, status)
values ('006f006f-006f-006f-006f-006f006f0201', '11111111-1111-1111-1111-111111111111', '006e006e-006e-006e-006e-006e006e0101', 'brand-northstar-0804', 'Northstar Dining', 'franchise', 'active')
on conflict (id) do nothing;

insert into public.rst_branches (id, organization_id, hub_id, branch_key, branch_name, branch_address, status)
values ('00700070-0070-0070-0070-007000700301', '11111111-1111-1111-1111-111111111111', '006e006e-006e-006e-006e-006e006e0101', 'branch-downtown-0804', 'Downtown Branch', '123 Main Street', 'active')
on conflict (id) do nothing;

insert into public.rst_business_licenses (id, organization_id, hub_id, license_key, license_name, license_type, status)
values ('00710071-0071-0071-0071-007100710401', '11111111-1111-1111-1111-111111111111', '006e006e-006e-006e-006e-006e006e0101', 'lic-food-0804', 'Food Service License', 'food_service', 'active')
on conflict (id) do nothing;

insert into public.rst_dining_areas (id, organization_id, hub_id, area_key, area_name, area_type, status)
values ('00720072-0072-0072-0072-007200720501', '11111111-1111-1111-1111-111111111111', '006e006e-006e-006e-006e-006e006e0101', 'area-patio-0804', 'Patio Dining', 'outdoor', 'active')
on conflict (id) do nothing;

insert into public.rst_restaurant_tables (id, organization_id, hub_id, table_key, table_name, qr_code, table_status, floor_ref, seats, status)
values ('00730073-0073-0073-0073-007300730601', '11111111-1111-1111-1111-111111111111', '006e006e-006e-006e-006e-006e006e0101', 'tbl-12-0804', 'Table 12', 'QR-TBL-12', 'available', 'floor-1', 4, 'active')
on conflict (id) do nothing;

-- M2 Menu
insert into public.rst_menu_categories (id, organization_id, hub_id, category_key, category_name, category_type, status)
values ('00740074-0074-0074-0074-007400740701', '11111111-1111-1111-1111-111111111111', '006e006e-006e-006e-006e-006e006e0101', 'cat-mains-0804', 'Main Courses', 'main', 'active')
on conflict (id) do nothing;

insert into public.rst_menu_items (id, organization_id, hub_id, item_key, item_name, item_price, status)
values ('00750075-0075-0075-0075-007500750801', '11111111-1111-1111-1111-111111111111', '006e006e-006e-006e-006e-006e006e0101', 'item-pasta-0804', 'Truffle Pasta', 18.50, 'active')
on conflict (id) do nothing;

insert into public.rst_menu_variants (id, organization_id, hub_id, variant_key, variant_name, variant_type, status)
values ('00760076-0076-0076-0076-007600760901', '11111111-1111-1111-1111-111111111111', '006e006e-006e-006e-006e-006e006e0101', 'var-large-0804', 'Large Portion', 'size', 'active')
on conflict (id) do nothing;

insert into public.rst_add_ons (id, organization_id, hub_id, addon_key, addon_name, addon_price, status)
values ('00770077-0077-0077-0077-007700770a01', '11111111-1111-1111-1111-111111111111', '006e006e-006e-006e-006e-006e006e0101', 'addon-cheese-0804', 'Extra Cheese', 2.50, 'active')
on conflict (id) do nothing;

insert into public.rst_combo_meals (id, organization_id, hub_id, combo_key, combo_name, combo_price, status)
values ('00780078-0078-0078-0078-007800780b01', '11111111-1111-1111-1111-111111111111', '006e006e-006e-006e-006e-006e006e0101', 'combo-lunch-0804', 'Lunch Combo', 14.99, 'active')
on conflict (id) do nothing;

-- M3 Orders
insert into public.rst_orders (id, organization_id, hub_id, order_key, order_number, order_type, status)
values ('00790079-0079-0079-0079-007900790c01', '11111111-1111-1111-1111-111111111111', '006e006e-006e-006e-006e-006e006e0101', 'ord-1042-0804', 'ORD-1042', 'dine-in', 'active')
on conflict (id) do nothing;

insert into public.rst_order_items (id, organization_id, hub_id, item_key, item_name, item_quantity, status)
values ('007a007a-007a-007a-007a-007a007a0d01', '11111111-1111-1111-1111-111111111111', '006e006e-006e-006e-006e-006e006e0101', 'oi-pasta-0804', 'Truffle Pasta', 2, 'active')
on conflict (id) do nothing;

insert into public.rst_order_queue (id, organization_id, hub_id, queue_key, queue_name, queue_status, status)
values ('007b007b-007b-007b-007b-007b007b0e01', '11111111-1111-1111-1111-111111111111', '006e006e-006e-006e-006e-006e006e0101', 'que-1042-0804', 'Order Queue #1042', 'waiting', 'active')
on conflict (id) do nothing;

insert into public.rst_kitchen_routing (id, organization_id, hub_id, routing_key, routing_name, routing_status, status)
values ('007c007c-007c-007c-007c-007c007c0f01', '11111111-1111-1111-1111-111111111111', '006e006e-006e-006e-006e-006e006e0101', 'route-grill-0804', 'Grill Station Route', 'pending', 'active')
on conflict (id) do nothing;

insert into public.rst_order_timeline (id, organization_id, hub_id, timeline_key, timeline_event, timeline_status, status)
values ('007d007d-007d-007d-007d-007d007d1001', '11111111-1111-1111-1111-111111111111', '006e006e-006e-006e-006e-006e006e0101', 'tl-placed-0804', 'Order Placed', 'completed', 'active')
on conflict (id) do nothing;

-- M4 Kitchen
insert into public.rst_kitchen_stations (id, organization_id, hub_id, station_key, station_name, station_type, status)
values ('007e007e-007e-007e-007e-007e007e1101', '11111111-1111-1111-1111-111111111111', '006e006e-006e-006e-006e-006e006e0101', 'sta-grill-0804', 'Grill Station', 'grill', 'active')
on conflict (id) do nothing;

insert into public.rst_preparation_queue (id, organization_id, hub_id, prep_key, prep_name, prep_status, status)
values ('007f007f-007f-007f-007f-007f007f1201', '11111111-1111-1111-1111-111111111111', '006e006e-006e-006e-006e-006e006e0101', 'prep-1042-0804', 'Prep Order #1042', 'queued', 'active')
on conflict (id) do nothing;

insert into public.rst_cooking_status (id, organization_id, hub_id, cooking_key, cooking_name, cooking_status, status)
values ('00800080-0080-0080-0080-008000801301', '11111111-1111-1111-1111-111111111111', '006e006e-006e-006e-006e-006e006e0101', 'cook-1042-0804', 'Cooking Order #1042', 'preparing', 'active')
on conflict (id) do nothing;

insert into public.rst_ready_queue (id, organization_id, hub_id, ready_key, ready_name, ready_status, status)
values ('00810081-0081-0081-0081-008100811401', '11111111-1111-1111-1111-111111111111', '006e006e-006e-006e-006e-006e006e0101', 'ready-1042-0804', 'Ready Order #1042', 'ready', 'active')
on conflict (id) do nothing;

insert into public.rst_rush_orders (id, organization_id, hub_id, rush_key, rush_name, rush_priority, status)
values ('00820082-0082-0082-0082-008200821501', '11111111-1111-1111-1111-111111111111', '006e006e-006e-006e-006e-006e006e0101', 'rush-vip-0804', 'VIP Rush Order', 'high', 'active')
on conflict (id) do nothing;

-- M5 Customer
insert into public.rst_reservations (id, organization_id, hub_id, reservation_key, reservation_name, reservation_status, status)
values ('00830083-0083-0083-0083-008300831601', '11111111-1111-1111-1111-111111111111', '006e006e-006e-006e-006e-006e006e0101', 'res-smith-0804', 'Smith Party Reservation', 'confirmed', 'active')
on conflict (id) do nothing;

insert into public.rst_waiting_list (id, organization_id, hub_id, wait_key, wait_name, wait_status, status)
values ('00840084-0084-0084-0084-008400841701', '11111111-1111-1111-1111-111111111111', '006e006e-006e-006e-006e-006e006e0101', 'wait-jones-0804', 'Jones Party Waiting', 'waiting', 'active')
on conflict (id) do nothing;

insert into public.rst_customer_profiles (id, organization_id, hub_id, profile_key, profile_name, profile_type, status)
values ('00850085-0085-0085-0085-008500851801', '11111111-1111-1111-1111-111111111111', '006e006e-006e-006e-006e-006e006e0101', 'prof-vip-0804', 'VIP Customer Profile', 'vip', 'active')
on conflict (id) do nothing;

insert into public.rst_loyalty_programs (id, organization_id, hub_id, program_key, program_name, program_type, status)
values ('00860086-0086-0086-0086-008600861901', '11111111-1111-1111-1111-111111111111', '006e006e-006e-006e-006e-006e006e0101', 'prog-points-0804', 'Points Rewards Program', 'points', 'active')
on conflict (id) do nothing;

insert into public.rst_feedback_reviews (id, organization_id, hub_id, review_key, review_title, review_rating, status)
values ('00870087-0087-0087-0087-008700871a01', '11111111-1111-1111-1111-111111111111', '006e006e-006e-006e-006e-006e006e0101', 'rev-great-0804', 'Excellent Dining Experience', 4.8, 'active')
on conflict (id) do nothing;

-- M6 Analytics/Dashboard
insert into public.rst_restaurant_metrics (id, organization_id, metrics_key, order_count, revenue_total, average_bill, occupancy_rate, popular_dish_score, peak_hour_score, customer_growth_rate, kitchen_performance_score, overall_restaurant_score, status)
values ('00880088-0088-0088-0088-008800881b01', '11111111-1111-1111-1111-111111111111', 'rst-metrics-0804', 850, 42500.00, 50.00, 78.50, 92.00, 88.00, 12.50, 91.00, 94.25, 'active')
on conflict (id) do nothing;

insert into public.rst_restaurant_health (id, organization_id, health_key, overall_score, disaster_recovery_mode, pending_orders_count, kitchen_queue_depth, framework_health_status, summary, status)
values ('00890089-0089-0089-0089-008900891c01', '11111111-1111-1111-1111-111111111111', 'rst-health-0804', 95.00, false, 5, 3, 'healthy', 'Restaurant business operating system operational', 'healthy')
on conflict (id) do nothing;

insert into public.rst_revenue_analytics (id, organization_id, hub_id, analytics_key, analytics_type, analytics_score, status)
values ('00900090-0090-0090-0090-009000901d01', '11111111-1111-1111-1111-111111111111', '006e006e-006e-006e-006e-006e006e0101', 'anly-rev-0804', 'revenue', 96.50, 'active')
on conflict (id) do nothing;

insert into public.rst_kitchen_performance (id, organization_id, hub_id, performance_key, performance_type, performance_score, status)
values ('00910091-0091-0091-0091-009100911e01', '11111111-1111-1111-1111-111111111111', '006e006e-006e-006e-006e-006e006e0101', 'perf-kitchen-0804', 'kitchen', 93.00, 'active')
on conflict (id) do nothing;

insert into public.rst_restaurant_failures (id, organization_id, hub_id, failure_key, failure_type, error_code, error_message, status)
values ('00920092-0092-0092-0092-009200922001', '11111111-1111-1111-1111-111111111111', '006e006e-006e-006e-006e-006e006e0101', 'fail-ord-0804', 'order', 'ORD_TIMEOUT', 'Order processing timed out', 'open')
on conflict (id) do nothing;

insert into public.rst_audit_logs (id, organization_id, entity_type, action, summary, security_level)
values ('00930093-0093-0093-0093-009300932101', '11111111-1111-1111-1111-111111111111', 'restaurant_hub', 'seed', 'Enterprise restaurant business operating system seed data loaded', 'standard')
on conflict (id) do nothing;
