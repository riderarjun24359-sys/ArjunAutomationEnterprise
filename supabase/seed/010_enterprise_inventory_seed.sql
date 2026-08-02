insert into public.product_categories (id, organization_id, name, slug, description)
values
  ('b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b1b101', '11111111-1111-1111-1111-111111111111', 'Hardware', 'hardware', 'Physical equipment and devices'),
  ('b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b1b102', '11111111-1111-1111-1111-111111111111', 'Software Licenses', 'software-licenses', 'Subscription and perpetual licenses'),
  ('b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b1b103', '11111111-1111-1111-1111-111111111111', 'Office Supplies', 'office-supplies', 'Consumables and stationery')
on conflict (id) do nothing;

insert into public.products (id, organization_id, category_id, sku, name, description, unit_of_measure, unit_cost, unit_price, reorder_level, status)
values
  ('b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b201', '11111111-1111-1111-1111-111111111111', 'b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b1b101', 'SKU-LPT-001', 'Enterprise Laptop', 'Standard issue developer laptop', 'each', 1200.00, 1499.00, 5, 'active'),
  ('b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b202', '11111111-1111-1111-1111-111111111111', 'b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b1b102', 'SKU-LIC-CRM', 'CRM Platform License', 'Annual CRM seat license', 'seat', 480.00, 720.00, 10, 'active'),
  ('b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b203', '11111111-1111-1111-1111-111111111111', 'b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b1b103', 'SKU-PPR-A4', 'A4 Copy Paper', '500-sheet reams', 'ream', 4.50, 7.99, 50, 'active')
on conflict (id) do nothing;

insert into public.warehouses (id, organization_id, name, code, location, manager_name, status)
values
  ('b3b3b3b3-b3b3-b3b3-b3b3-b3b3b3b3b301', '11111111-1111-1111-1111-111111111111', 'San Francisco HQ', 'SF-HQ', '100 Enterprise Way, San Francisco, CA', 'Alex Rivera', 'active'),
  ('b3b3b3b3-b3b3-b3b3-b3b3-b3b3b3b3b302', '11111111-1111-1111-1111-111111111111', 'Austin Distribution', 'ATX-DC', '500 Logistics Blvd, Austin, TX', 'Jordan Lee', 'active')
on conflict (id) do nothing;

insert into public.stock_levels (id, organization_id, product_id, warehouse_id, quantity, reserved_quantity)
values
  ('b4b4b4b4-b4b4-b4b4-b4b4-b4b4b4b4b401', '11111111-1111-1111-1111-111111111111', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b201', 'b3b3b3b3-b3b3-b3b3-b3b3-b3b3b3b3b301', 12, 2),
  ('b4b4b4b4-b4b4-b4b4-b4b4-b4b4b4b4b402', '11111111-1111-1111-1111-111111111111', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b201', 'b3b3b3b3-b3b3-b3b3-b3b3-b3b3b3b3b302', 3, 0),
  ('b4b4b4b4-b4b4-b4b4-b4b4-b4b4b4b4b403', '11111111-1111-1111-1111-111111111111', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b202', 'b3b3b3b3-b3b3-b3b3-b3b3-b3b3b3b3b301', 45, 5),
  ('b4b4b4b4-b4b4-b4b4-b4b4-b4b4b4b4b404', '11111111-1111-1111-1111-111111111111', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b203', 'b3b3b3b3-b3b3-b3b3-b3b3-b3b3b3b3b301', 28, 0)
on conflict (id) do nothing;

insert into public.suppliers (id, organization_id, name, code, email, phone, address, status)
values
  ('b5b5b5b5-b5b5-b5b5-b5b5-b5b5b5b5b501', '11111111-1111-1111-1111-111111111111', 'TechSupply Co', 'TECHSUP', 'orders@techsupply.example', '+1 415 555 0301', '200 Vendor Lane, San Jose, CA', 'active'),
  ('b5b5b5b5-b5b5-b5b5-b5b5-b5b5b5b5b502', '11111111-1111-1111-1111-111111111111', 'OfficeMart Inc', 'OFFMART', 'sales@officemart.example', '+1 512 555 0302', '88 Supply Row, Austin, TX', 'active')
on conflict (id) do nothing;

insert into public.stock_movements (id, organization_id, product_id, warehouse_id, movement_type, quantity, reference_type, notes, moved_at)
values
  ('b6b6b6b6-b6b6-b6b6-b6b6-b6b6b6b6b601', '11111111-1111-1111-1111-111111111111', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b201', 'b3b3b3b3-b3b3-b3b3-b3b3-b3b3b3b3b301', 'inbound', 10, 'grn', 'Initial stock receipt', '2026-07-15 10:00:00+00'),
  ('b6b6b6b6-b6b6-b6b6-b6b6-b6b6b6b6b602', '11111111-1111-1111-1111-111111111111', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b201', 'b3b3b3b3-b3b3-b3b3-b3b3-b3b3b3b3b301', 'outbound', 2, 'project', 'Allocated to delivery project', '2026-07-28 14:30:00+00')
on conflict (id) do nothing;

insert into public.inventory_adjustments (id, organization_id, product_id, warehouse_id, adjustment_type, quantity_delta, reason)
values
  ('b7b7b7b7-b7b7-b7b7-b7b7-b7b7b7b7b701', '11111111-1111-1111-1111-111111111111', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b203', 'b3b3b3b3-b3b3-b3b3-b3b3-b3b3b3b3b301', 'correction', -2, 'Cycle count variance')
on conflict (id) do nothing;

insert into public.purchase_orders (id, organization_id, supplier_id, po_number, status, order_date, expected_date, total_amount, notes)
values
  ('b8b8b8b8-b8b8-b8b8-b8b8-b8b8b8b8b801', '11111111-1111-1111-1111-111111111111', 'b5b5b5b5-b5b5-b5b5-b5b5-b5b5b5b5b501', 'PO-2026-0042', 'approved', '2026-07-20', '2026-08-05', 14400.00, 'Laptop replenishment order'),
  ('b8b8b8b8-b8b8-b8b8-b8b8-b8b8b8b8b802', '11111111-1111-1111-1111-111111111111', 'b5b5b5b5-b5b5-b5b5-b5b5-b5b5b5b5b502', 'PO-2026-0043', 'draft', '2026-08-01', '2026-08-10', 399.50, 'Office supplies restock')
on conflict (id) do nothing;

insert into public.purchase_order_items (id, purchase_order_id, product_id, quantity, unit_cost, line_total)
values
  ('b9b9b9b9-b9b9-b9b9-b9b9-b9b9b9b9b901', 'b8b8b8b8-b8b8-b8b8-b8b8-b8b8b8b8b801', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b201', 12, 1200.00, 14400.00),
  ('b9b9b9b9-b9b9-b9b9-b9b9-b9b9b9b9b902', 'b8b8b8b8-b8b8-b8b8-b8b8-b8b8b8b8b802', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b203', 50, 4.50, 225.00)
on conflict (id) do nothing;

insert into public.assets (id, organization_id, asset_tag, name, category, serial_number, purchase_cost, status, warehouse_id, employee_id, acquired_date)
values
  ('c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c101', '11111111-1111-1111-1111-111111111111', 'AST-LPT-001', 'MacBook Pro 16', 'laptop', 'SN-MBP-88421', 2499.00, 'assigned', 'b3b3b3b3-b3b3-b3b3-b3b3-b3b3b3b3b301', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c01', '2024-03-15'),
  ('c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c102', '11111111-1111-1111-1111-111111111111', 'AST-MON-042', 'Dell UltraSharp 27', 'monitor', 'SN-DU27-55210', 599.00, 'available', 'b3b3b3b3-b3b3-b3b3-b3b3-b3b3b3b3b301', null, '2025-01-10')
on conflict (id) do nothing;

insert into public.product_barcodes (id, organization_id, product_id, asset_id, barcode_value, barcode_type)
values
  ('c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c201', '11111111-1111-1111-1111-111111111111', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b201', null, '8901234567890', 'code128'),
  ('c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c202', '11111111-1111-1111-1111-111111111111', null, 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c101', 'QR-AST-LPT-001', 'qr')
on conflict (id) do nothing;

insert into public.low_stock_alerts (id, organization_id, product_id, warehouse_id, current_quantity, reorder_level, status, triggered_at)
values
  ('c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c301', '11111111-1111-1111-1111-111111111111', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b201', 'b3b3b3b3-b3b3-b3b3-b3b3-b3b3b3b3b302', 3, 5, 'open', '2026-08-01 08:00:00+00')
on conflict (id) do nothing;

insert into public.stock_transfers (id, organization_id, transfer_number, source_warehouse_id, destination_warehouse_id, status, notes, transferred_at)
values
  ('c4c4c4c4-c4c4-c4c4-c4c4-c4c4c4c4c401', '11111111-1111-1111-1111-111111111111', 'TRF-2026-0018', 'b3b3b3b3-b3b3-b3b3-b3b3-b3b3b3b3b301', 'b3b3b3b3-b3b3-b3b3-b3b3-b3b3b3b3b302', 'completed', 'Laptop redistribution to Austin', '2026-07-25 16:00:00+00')
on conflict (id) do nothing;

insert into public.stock_transfer_items (id, transfer_id, product_id, quantity)
values
  ('c5c5c5c5-c5c5-c5c5-c5c5-c5c5c5c5c501', 'c4c4c4c4-c4c4-c4c4-c4c4-c4c4c4c4c401', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b201', 3)
on conflict (id) do nothing;

insert into public.goods_received_notes (id, organization_id, grn_number, purchase_order_id, warehouse_id, supplier_id, status, received_date, notes)
values
  ('c6c6c6c6-c6c6-c6c6-c6c6-c6c6c6c6c601', '11111111-1111-1111-1111-111111111111', 'GRN-2026-0091', 'b8b8b8b8-b8b8-b8b8-b8b8-b8b8b8b8b801', 'b3b3b3b3-b3b3-b3b3-b3b3-b3b3b3b3b301', 'b5b5b5b5-b5b5-b5b5-b5b5-b5b5b5b5b501', 'received', '2026-07-22', 'Partial receipt against PO-2026-0042')
on conflict (id) do nothing;

insert into public.grn_items (id, grn_id, product_id, quantity_received, unit_cost)
values
  ('c7c7c7c7-c7c7-c7c7-c7c7-c7c7c7c7c701', 'c6c6c6c6-c6c6-c6c6-c6c6-c6c6c6c6c601', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b201', 10, 1200.00)
on conflict (id) do nothing;

insert into public.inventory_valuations (id, organization_id, valuation_date, method, total_value, total_units, notes)
values
  ('c8c8c8c8-c8c8-c8c8-c8c8-c8c8c8c8c801', '11111111-1111-1111-1111-111111111111', '2026-07-31', 'weighted_average', 38482.50, 88, 'Month-end inventory valuation snapshot')
on conflict (id) do nothing;

insert into public.inventory_audit_logs (id, organization_id, entity_type, entity_id, action, summary, metadata)
values
  ('c9c9c9c9-c9c9-c9c9-c9c9-c9c9c9c9c901', '11111111-1111-1111-1111-111111111111', 'purchase_order', 'b8b8b8b8-b8b8-b8b8-b8b8-b8b8b8b8b801', 'approve', 'Purchase order PO-2026-0042 approved', '{"po_number":"PO-2026-0042"}'::jsonb),
  ('c9c9c9c9-c9c9-c9c9-c9c9-c9c9c9c9c902', '11111111-1111-1111-1111-111111111111', 'stock_transfer', 'c4c4c4c4-c4c4-c4c4-c4c4-c4c4c4c4c401', 'complete', 'Transfer TRF-2026-0018 completed', '{"transfer_number":"TRF-2026-0018"}'::jsonb),
  ('c9c9c9c9-c9c9-c9c9-c9c9-c9c9c9c9c903', '11111111-1111-1111-1111-111111111111', 'asset', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c101', 'assign', 'Asset AST-LPT-001 assigned to employee', '{"asset_tag":"AST-LPT-001"}'::jsonb)
on conflict (id) do nothing;
