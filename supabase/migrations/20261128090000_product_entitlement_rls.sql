-- Enforce product entitlements at the database boundary as well as at page/API boundaries.
-- A tenant membership alone must not grant access to modules it has not enabled.
BEGIN;

CREATE OR REPLACE FUNCTION private.has_active_organization_product(
  p_organization_id uuid,
  p_product_key text
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.organization_products op
    WHERE op.organization_id = p_organization_id
      AND op.product_key = p_product_key
      AND op.status IN ('trial', 'active')
  );
$$;

GRANT USAGE ON SCHEMA private TO authenticated, service_role;
REVOKE ALL ON FUNCTION private.has_active_organization_product(uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.has_active_organization_product(uuid, text) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION private.has_organization_role(
  p_organization_id uuid,
  p_allowed_roles text[]
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.organization_members om
    WHERE om.organization_id = p_organization_id
      AND om.user_id = private.auth_profile_id()
      AND om.is_active = true
      AND om.role_name = ANY(p_allowed_roles)
  );
$$;

REVOKE ALL ON FUNCTION private.has_organization_role(uuid, text[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.has_organization_role(uuid, text[]) TO authenticated, service_role;

-- Direct organization_id tables: replace membership-only policies with
-- membership + active product entitlement policies.
DO $$
DECLARE
  tbl text;
  product_key text;
  product_tables text[];
BEGIN
  FOREACH product_key IN ARRAY ARRAY['school', 'clinic', 'retail', 'business', 'automation']
  LOOP
    product_tables := CASE product_key
      WHEN 'school' THEN ARRAY[
        'sch_school_hubs','sch_campuses','sch_buildings','sch_classrooms','sch_academic_years',
        'sch_admissions','sch_student_profiles','sch_parent_profiles','sch_enrollments','sch_subjects',
        'sch_timetables','sch_examinations','sch_report_cards','sch_teachers','sch_staff_attendance',
        'sch_leave_requests','sch_substitute_teachers','sch_fee_structures','sch_fee_invoices',
        'sch_fee_payments','sch_scholarships','sch_announcements','sch_messaging','sch_events',
        'sch_admissions_analytics','sch_attendance_analytics','sch_academic_analytics',
        'sch_school_metrics','sch_school_health','sch_executive_kpis','sch_school_failures','sch_audit_logs'
      ]
      WHEN 'clinic' THEN ARRAY[
        'hsp_hospital_hubs','hsp_campuses','hsp_departments','hsp_wards','hsp_hospital_beds',
        'hsp_patient_registrations','hsp_patient_profiles','hsp_medical_histories','hsp_insurance_policies',
        'hsp_appointments','hsp_opd_visits','hsp_ipd_admissions','hsp_clinical_notes',
        'hsp_pharmacy_inventory','hsp_prescriptions','hsp_lab_orders','hsp_lab_results',
        'hsp_hospital_billing','hsp_insurance_claims','hsp_hospital_invoices','hsp_hospital_payments',
        'hsp_patient_notifications','hsp_medical_reports','hsp_patient_feedback','hsp_admissions_analytics',
        'hsp_occupancy_analytics','hsp_revenue_analytics','hsp_hospital_metrics','hsp_hospital_health',
        'hsp_executive_kpis','hsp_hospital_failures','hsp_audit_logs'
      ]
      WHEN 'retail' THEN ARRAY[
        'rtl_retail_hubs','rtl_retail_brands','rtl_stores','rtl_cash_registers','rtl_store_departments',
        'rtl_products','rtl_product_categories','rtl_product_variants','rtl_promotions','rtl_sales_orders',
        'rtl_pos_transactions','rtl_returns_exchanges','rtl_shift_closings','rtl_warehouses','rtl_stock_levels',
        'rtl_purchase_orders','rtl_suppliers','rtl_customer_profiles','rtl_loyalty_programs','rtl_reward_points',
        'rtl_campaigns','rtl_daily_closings','rtl_branch_performance','rtl_commission_records',
        'rtl_sales_analytics','rtl_inventory_analytics','rtl_profitability_analytics','rtl_retail_metrics',
        'rtl_retail_health','rtl_executive_kpis','rtl_retail_failures','rtl_audit_logs',
        'rst_restaurant_hubs','rst_brands','rst_branches','rst_business_licenses','rst_dining_areas',
        'rst_restaurant_tables','rst_menu_categories','rst_menu_items','rst_menu_variants','rst_add_ons',
        'rst_combo_meals','rst_orders','rst_order_items','rst_order_queue','rst_kitchen_routing',
        'rst_order_timeline','rst_kitchen_stations','rst_preparation_queue','rst_cooking_status',
        'rst_ready_queue','rst_rush_orders','rst_reservations','rst_waiting_list','rst_customer_profiles',
        'rst_loyalty_programs','rst_feedback_reviews','rst_restaurant_metrics','rst_restaurant_health',
        'rst_revenue_analytics','rst_kitchen_performance','rst_restaurant_failures','rst_audit_logs',
        'product_categories','products','warehouses','stock_levels','suppliers','stock_movements',
        'inventory_adjustments','purchase_orders','assets','product_barcodes','low_stock_alerts',
        'stock_transfers','goods_received_notes','inventory_valuations','inventory_audit_logs'
      ]
      WHEN 'business' THEN ARRAY[
        'business_consultations','business_proposals','business_lifecycle_events','business_ai_recommendations'
      ]
      ELSE ARRAY[
        'ai_agents','workflow_templates','workflows','workflow_executions','automation_logs'
      ]
    END;

    FOREACH tbl IN ARRAY product_tables
    LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I_select ON public.%I', tbl, tbl);
      EXECUTE format(
        'CREATE POLICY %I_select ON public.%I FOR SELECT USING (public.is_organization_member(organization_id) AND private.has_active_organization_product(organization_id, %L))',
        tbl, tbl, product_key
      );
      EXECUTE format('DROP POLICY IF EXISTS %I_insert ON public.%I', tbl, tbl);
      EXECUTE format(
        'CREATE POLICY %I_insert ON public.%I FOR INSERT WITH CHECK (public.is_organization_member(organization_id) AND private.has_active_organization_product(organization_id, %L) AND private.has_organization_role(organization_id, ARRAY[''member'',''manager'',''admin'',''founder'',''owner'',''super_admin'']))',
        tbl, tbl, product_key
      );
      EXECUTE format('DROP POLICY IF EXISTS %I_update ON public.%I', tbl, tbl);
      EXECUTE format(
        'CREATE POLICY %I_update ON public.%I FOR UPDATE USING (public.is_organization_member(organization_id) AND private.has_active_organization_product(organization_id, %L) AND private.has_organization_role(organization_id, ARRAY[''member'',''manager'',''admin'',''founder'',''owner'',''super_admin''])) WITH CHECK (public.is_organization_member(organization_id) AND private.has_active_organization_product(organization_id, %L) AND private.has_organization_role(organization_id, ARRAY[''member'',''manager'',''admin'',''founder'',''owner'',''super_admin'']))',
        tbl, tbl, product_key, product_key
      );
      EXECUTE format('DROP POLICY IF EXISTS %I_delete ON public.%I', tbl, tbl);
      EXECUTE format(
        'CREATE POLICY %I_delete ON public.%I FOR DELETE USING (public.is_organization_member(organization_id) AND private.has_active_organization_product(organization_id, %L) AND private.has_organization_role(organization_id, ARRAY[''manager'',''admin'',''founder'',''owner'',''super_admin'']))',
        tbl, tbl, product_key
      );
    END LOOP;
  END LOOP;
END $$;

-- Inventory child rows inherit the Retail entitlement from their parent row.
DO $$
DECLARE
  policy_name text;
  parent_table text;
  parent_id_column text;
BEGIN
  FOREACH policy_name IN ARRAY ARRAY['purchase_order_items','stock_transfer_items','grn_items']
  LOOP
    parent_table := CASE policy_name
      WHEN 'purchase_order_items' THEN 'purchase_orders'
      WHEN 'stock_transfer_items' THEN 'stock_transfers'
      ELSE 'goods_received_notes'
    END;
    parent_id_column := CASE policy_name
      WHEN 'purchase_order_items' THEN 'purchase_order_id'
      WHEN 'stock_transfer_items' THEN 'transfer_id'
      ELSE 'grn_id'
    END;

    EXECUTE format('DROP POLICY IF EXISTS %I_select ON public.%I', policy_name, policy_name);
    EXECUTE format(
      'CREATE POLICY %I_select ON public.%I FOR SELECT USING (EXISTS (SELECT 1 FROM public.%I p WHERE p.id = %I AND public.is_organization_member(p.organization_id) AND private.has_active_organization_product(p.organization_id, %L)))',
      policy_name, policy_name, parent_table, parent_id_column, 'retail'
    );
    EXECUTE format('DROP POLICY IF EXISTS %I_insert ON public.%I', policy_name, policy_name);
    EXECUTE format(
      'CREATE POLICY %I_insert ON public.%I FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.%I p WHERE p.id = %I AND public.is_organization_member(p.organization_id) AND private.has_active_organization_product(p.organization_id, %L) AND private.has_organization_role(p.organization_id, ARRAY[''member'',''manager'',''admin'',''founder'',''owner'',''super_admin''])))',
      policy_name, policy_name, parent_table, parent_id_column, 'retail'
    );
    EXECUTE format('DROP POLICY IF EXISTS %I_update ON public.%I', policy_name, policy_name);
    EXECUTE format(
      'CREATE POLICY %I_update ON public.%I FOR UPDATE USING (EXISTS (SELECT 1 FROM public.%I p WHERE p.id = %I AND public.is_organization_member(p.organization_id) AND private.has_active_organization_product(p.organization_id, %L) AND private.has_organization_role(p.organization_id, ARRAY[''member'',''manager'',''admin'',''founder'',''owner'',''super_admin'']))) WITH CHECK (EXISTS (SELECT 1 FROM public.%I p WHERE p.id = %I AND public.is_organization_member(p.organization_id) AND private.has_active_organization_product(p.organization_id, %L) AND private.has_organization_role(p.organization_id, ARRAY[''member'',''manager'',''admin'',''founder'',''owner'',''super_admin''])))',
      policy_name, policy_name, parent_table, parent_id_column, 'retail',
      parent_table, parent_id_column, 'retail'
    );
    EXECUTE format('DROP POLICY IF EXISTS %I_delete ON public.%I', policy_name, policy_name);
    EXECUTE format(
      'CREATE POLICY %I_delete ON public.%I FOR DELETE USING (EXISTS (SELECT 1 FROM public.%I p WHERE p.id = %I AND public.is_organization_member(p.organization_id) AND private.has_active_organization_product(p.organization_id, %L) AND private.has_organization_role(p.organization_id, ARRAY[''manager'',''admin'',''founder'',''owner'',''super_admin''])))',
      policy_name, policy_name, parent_table, parent_id_column, 'retail'
    );
  END LOOP;
END $$;

-- Automation child rows inherit Automation entitlement from their workflow.
DO $$
DECLARE
  tbl text;
BEGIN
  FOREACH tbl IN ARRAY ARRAY['workflow_triggers','workflow_actions','workflow_conditions','workflow_schedules']
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I_select ON public.%I', tbl, tbl);
    EXECUTE format(
      'CREATE POLICY %I_select ON public.%I FOR SELECT USING (EXISTS (SELECT 1 FROM public.workflows w WHERE w.id = workflow_id AND public.is_organization_member(w.organization_id) AND private.has_active_organization_product(w.organization_id, %L)))',
      tbl, tbl, 'automation'
    );
    EXECUTE format('DROP POLICY IF EXISTS %I_insert ON public.%I', tbl, tbl);
    EXECUTE format(
      'CREATE POLICY %I_insert ON public.%I FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.workflows w WHERE w.id = workflow_id AND public.is_organization_member(w.organization_id) AND private.has_active_organization_product(w.organization_id, %L) AND private.has_organization_role(w.organization_id, ARRAY[''member'',''manager'',''admin'',''founder'',''owner'',''super_admin''])))',
      tbl, tbl, 'automation'
    );
    EXECUTE format('DROP POLICY IF EXISTS %I_update ON public.%I', tbl, tbl);
    EXECUTE format(
      'CREATE POLICY %I_update ON public.%I FOR UPDATE USING (EXISTS (SELECT 1 FROM public.workflows w WHERE w.id = workflow_id AND public.is_organization_member(w.organization_id) AND private.has_active_organization_product(w.organization_id, %L) AND private.has_organization_role(w.organization_id, ARRAY[''member'',''manager'',''admin'',''founder'',''owner'',''super_admin'']))) WITH CHECK (EXISTS (SELECT 1 FROM public.workflows w WHERE w.id = workflow_id AND public.is_organization_member(w.organization_id) AND private.has_active_organization_product(w.organization_id, %L) AND private.has_organization_role(w.organization_id, ARRAY[''member'',''manager'',''admin'',''founder'',''owner'',''super_admin''])))',
      tbl, tbl, 'automation', 'automation'
    );
    EXECUTE format('DROP POLICY IF EXISTS %I_delete ON public.%I', tbl, tbl);
    EXECUTE format(
      'CREATE POLICY %I_delete ON public.%I FOR DELETE USING (EXISTS (SELECT 1 FROM public.workflows w WHERE w.id = workflow_id AND public.is_organization_member(w.organization_id) AND private.has_active_organization_product(w.organization_id, %L) AND private.has_organization_role(w.organization_id, ARRAY[''manager'',''admin'',''founder'',''owner'',''super_admin''])))',
      tbl, tbl, 'automation'
    );
  END LOOP;
END $$;

-- Business Platform tables use explicit role-aware CRUD policies.
DO $$
DECLARE
  tbl text;
BEGIN
  FOREACH tbl IN ARRAY ARRAY['business_consultations','business_proposals','business_lifecycle_events','business_ai_recommendations']
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I_org_access ON public.%I', tbl, tbl);
    EXECUTE format('DROP POLICY IF EXISTS %I_select ON public.%I', tbl, tbl);
    EXECUTE format('DROP POLICY IF EXISTS %I_insert ON public.%I', tbl, tbl);
    EXECUTE format('DROP POLICY IF EXISTS %I_update ON public.%I', tbl, tbl);
    EXECUTE format('DROP POLICY IF EXISTS %I_delete ON public.%I', tbl, tbl);

    EXECUTE format('CREATE POLICY %I_select ON public.%I FOR SELECT USING (public.is_organization_member(organization_id) AND private.has_active_organization_product(organization_id, %L))', tbl, tbl, 'business');
    EXECUTE format('CREATE POLICY %I_insert ON public.%I FOR INSERT WITH CHECK (public.is_organization_member(organization_id) AND private.has_active_organization_product(organization_id, %L) AND private.has_organization_role(organization_id, ARRAY[''member'',''manager'',''admin'',''founder'',''owner'',''super_admin'']))', tbl, tbl, 'business');
    EXECUTE format('CREATE POLICY %I_update ON public.%I FOR UPDATE USING (public.is_organization_member(organization_id) AND private.has_active_organization_product(organization_id, %L) AND private.has_organization_role(organization_id, ARRAY[''member'',''manager'',''admin'',''founder'',''owner'',''super_admin''])) WITH CHECK (public.is_organization_member(organization_id) AND private.has_active_organization_product(organization_id, %L) AND private.has_organization_role(organization_id, ARRAY[''member'',''manager'',''admin'',''founder'',''owner'',''super_admin'']))', tbl, tbl, 'business', 'business');
    EXECUTE format('CREATE POLICY %I_delete ON public.%I FOR DELETE USING (public.is_organization_member(organization_id) AND private.has_active_organization_product(organization_id, %L) AND private.has_organization_role(organization_id, ARRAY[''manager'',''admin'',''founder'',''owner'',''super_admin'']))', tbl, tbl, 'business');
  END LOOP;
END $$;

-- Allow organization administrators to change their own enabled product set
-- through the authenticated server API. The function is service-role only;
-- the API performs session, organization-membership, and role validation.
CREATE OR REPLACE FUNCTION public.set_organization_products(
  p_organization_id uuid,
  p_product_keys text[]
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog
AS $$
BEGIN
  IF p_organization_id IS NULL THEN
    RAISE EXCEPTION 'organization_id is required';
  END IF;
  IF p_product_keys IS NULL OR cardinality(p_product_keys) < 1 THEN
    RAISE EXCEPTION 'at least one product must remain enabled';
  END IF;
  IF EXISTS (
    SELECT 1
    FROM unnest(p_product_keys) AS requested(product_key)
    WHERE requested.product_key NOT IN ('school','retail','clinic','business','automation')
  ) THEN
    RAISE EXCEPTION 'unknown product key';
  END IF;
  IF cardinality(p_product_keys) <> (
    SELECT count(DISTINCT requested.product_key)::integer
    FROM unnest(p_product_keys) AS requested(product_key)
  ) THEN
    RAISE EXCEPTION 'duplicate product keys are not allowed';
  END IF;

  UPDATE public.organization_products
  SET status = 'suspended', updated_at = now()
  WHERE organization_id = p_organization_id
    AND status IN ('trial','active')
    AND NOT (product_key = ANY(p_product_keys));

  INSERT INTO public.organization_products (organization_id, product_key, status, settings)
  SELECT p_organization_id, requested.product_key, 'active', '{}'::jsonb
  FROM unnest(p_product_keys) AS requested(product_key)
  ON CONFLICT (organization_id, product_key)
  DO UPDATE SET status = 'active', updated_at = now();
END;
$$;

REVOKE ALL ON FUNCTION public.set_organization_products(uuid, text[]) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.set_organization_products(uuid, text[]) TO service_role;

COMMIT;
