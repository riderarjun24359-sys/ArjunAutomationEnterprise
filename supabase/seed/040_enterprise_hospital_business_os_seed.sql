insert into public.ai_orchestration_agents (id, organization_id, name, agent_type, workflow_agent_id, provider_id, model_route_id, capabilities, status)
values
  ('a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a340', '11111111-1111-1111-1111-111111111111', 'Enterprise Hospital Orchestrator', 'enterprise_hospital_business_os', null, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a201', '["hospital_foundation","patient_engine","clinical_operations","pharmacy_lab","finance_engine","hospital_analytics","hospital_dashboard"]'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.ai_sessions (id, organization_id, agent_id, session_key, module_source, entity_type, entity_id, context, status, expires_at)
values
  ('a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a540', '11111111-1111-1111-1111-111111111111', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a340', 'northstar-hospital-os-001', 'enterprise_hospital_business_os', 'hospital_hub', '00700070-0070-0070-0070-007000700101', '{"objective":"Enterprise hospital business operating system for northstar healthcare operations"}'::jsonb, 'active', '2026-12-31 23:59:59+00')
on conflict (id) do nothing;

-- M0 Hospital Hub
insert into public.hsp_hospital_hubs (id, organization_id, hub_key, hub_name, environment, hospital_code, status)
values ('00700070-0070-0070-0070-007000700101', '11111111-1111-1111-1111-111111111111', 'northstar-hospital-os', 'Northstar Hospital OS Hub', 'production', 'HSP-0804-001', 'active')
on conflict (id) do nothing;

-- M1 Foundation
insert into public.hsp_campuses (id, organization_id, hub_id, campus_key, campus_name, campus_type, status)
values ('02000100-0200-0200-0200-020001000201', '11111111-1111-1111-1111-111111111111', '00700070-0070-0070-0070-007000700101', 'campus-main-0804', 'Main Campus', 'main', 'active')
on conflict (id) do nothing;

insert into public.hsp_departments (id, organization_id, hub_id, department_key, department_name, department_type, status)
values ('02010101-0201-0201-0201-020101010301', '11111111-1111-1111-1111-111111111111', '00700070-0070-0070-0070-007000700101', 'dept-cardio-0804', 'Cardiology Department', 'clinical', 'active')
on conflict (id) do nothing;

insert into public.hsp_wards (id, organization_id, hub_id, ward_key, ward_name, ward_type, status)
values ('02020102-0202-0202-0202-020201020401', '11111111-1111-1111-1111-111111111111', '00700070-0070-0070-0070-007000700101', 'ward-general-0804', 'General Ward', 'general', 'active')
on conflict (id) do nothing;

insert into public.hsp_hospital_beds (id, organization_id, hub_id, bed_key, bed_number, bed_status, ward_ref, status)
values ('02030103-0203-0203-0203-020301030501', '11111111-1111-1111-1111-111111111111', '00700070-0070-0070-0070-007000700101', 'bed-101-0804', '101', 'available', 'ward-general-0804', 'active')
on conflict (id) do nothing;

-- M2 Patient
insert into public.hsp_patient_registrations (id, organization_id, hub_id, registration_key, registration_name, registration_status, status)
values ('02040104-0204-0204-0204-020401040601', '11111111-1111-1111-1111-111111111111', '00700070-0070-0070-0070-007000700101', 'reg-smith-0804', 'Smith Patient Registration', 'pending', 'active')
on conflict (id) do nothing;

insert into public.hsp_patient_profiles (id, organization_id, hub_id, profile_key, profile_name, profile_type, status)
values ('02050105-0205-0205-0205-020501050701', '11111111-1111-1111-1111-111111111111', '00700070-0070-0070-0070-007000700101', 'pat-jones-0804', 'Jones Patient Profile', 'regular', 'active')
on conflict (id) do nothing;

insert into public.hsp_medical_histories (id, organization_id, hub_id, history_key, history_name, history_type, status)
values ('02060106-0206-0206-0206-020601060801', '11111111-1111-1111-1111-111111111111', '00700070-0070-0070-0070-007000700101', 'hist-jones-0804', 'Jones Medical History', 'general', 'active')
on conflict (id) do nothing;

insert into public.hsp_insurance_policies (id, organization_id, hub_id, policy_key, policy_name, policy_type, status)
values ('02070107-0207-0207-0207-020701070901', '11111111-1111-1111-1111-111111111111', '00700070-0070-0070-0070-007000700101', 'pol-jones-0804', 'Jones Insurance Policy', 'health', 'active')
on conflict (id) do nothing;

-- M3 Clinical Operations
insert into public.hsp_appointments (id, organization_id, hub_id, appointment_key, appointment_name, appointment_status, status)
values ('02080108-0208-0208-0208-020801080a01', '11111111-1111-1111-1111-111111111111', '00700070-0070-0070-0070-007000700101', 'appt-jones-0804', 'Jones Appointment', 'scheduled', 'active')
on conflict (id) do nothing;

insert into public.hsp_opd_visits (id, organization_id, hub_id, visit_key, visit_name, visit_status, status)
values ('02090109-0209-0209-0209-020901090b01', '11111111-1111-1111-1111-111111111111', '00700070-0070-0070-0070-007000700101', 'opd-jones-0804', 'Jones OPD Visit', 'checked_in', 'active')
on conflict (id) do nothing;

insert into public.hsp_ipd_admissions (id, organization_id, hub_id, admission_key, admission_name, admission_status, status)
values ('020a010a-020a-020a-020a-020a010a0c01', '11111111-1111-1111-1111-111111111111', '00700070-0070-0070-0070-007000700101', 'ipd-jones-0804', 'Jones IPD Admission', 'admitted', 'active')
on conflict (id) do nothing;

insert into public.hsp_clinical_notes (id, organization_id, hub_id, note_key, note_name, note_type, status)
values ('020b010b-020b-020b-020b-020b010b0d01', '11111111-1111-1111-1111-111111111111', '00700070-0070-0070-0070-007000700101', 'note-jones-0804', 'Jones Clinical Note', 'operational', 'active')
on conflict (id) do nothing;

-- M4 Pharmacy & Lab
insert into public.hsp_pharmacy_inventory (id, organization_id, hub_id, inventory_key, inventory_name, inventory_type, status)
values ('020c010c-020c-020c-020c-020c010c0e01', '11111111-1111-1111-1111-111111111111', '00700070-0070-0070-0070-007000700101', 'inv-paracetamol-0804', 'Paracetamol Inventory', 'medicine', 'active')
on conflict (id) do nothing;

insert into public.hsp_prescriptions (id, organization_id, hub_id, prescription_key, prescription_name, prescription_status, status)
values ('020d010d-020d-020d-020d-020d010d0f01', '11111111-1111-1111-1111-111111111111', '00700070-0070-0070-0070-007000700101', 'rx-jones-0804', 'Jones Prescription', 'pending', 'active')
on conflict (id) do nothing;

insert into public.hsp_lab_orders (id, organization_id, hub_id, order_key, order_name, order_status, status)
values ('020e010e-020e-020e-020e-020e010e1001', '11111111-1111-1111-1111-111111111111', '00700070-0070-0070-0070-007000700101', 'lab-jones-0804', 'Jones Lab Order', 'pending', 'active')
on conflict (id) do nothing;

insert into public.hsp_lab_results (id, organization_id, hub_id, result_key, result_name, result_status, status)
values ('020f010f-020f-020f-020f-020f010f1101', '11111111-1111-1111-1111-111111111111', '00700070-0070-0070-0070-007000700101', 'res-jones-0804', 'Jones Lab Result', 'pending', 'active')
on conflict (id) do nothing;

-- M5 Finance & Billing
insert into public.hsp_hospital_billing (id, organization_id, hub_id, billing_key, billing_name, billing_amount, status)
values ('02100110-0210-0210-0210-021001101201', '11111111-1111-1111-1111-111111111111', '00700070-0070-0070-0070-007000700101', 'bill-jones-0804', 'Jones Hospital Billing', 15000.00, 'active')
on conflict (id) do nothing;

insert into public.hsp_insurance_claims (id, organization_id, hub_id, claim_key, claim_name, claim_status, status)
values ('02110111-0211-0211-0211-021101111301', '11111111-1111-1111-1111-111111111111', '00700070-0070-0070-0070-007000700101', 'clm-jones-0804', 'Jones Insurance Claim', 'pending', 'active')
on conflict (id) do nothing;

insert into public.hsp_hospital_invoices (id, organization_id, hub_id, invoice_key, invoice_name, invoice_amount, status)
values ('02120112-0212-0212-0212-021201121401', '11111111-1111-1111-1111-111111111111', '00700070-0070-0070-0070-007000700101', 'inv-jones-0804', 'Jones Hospital Invoice', 15000.00, 'active')
on conflict (id) do nothing;

insert into public.hsp_hospital_payments (id, organization_id, hub_id, payment_key, payment_name, payment_amount, status)
values ('02130113-0213-0213-0213-021301131501', '11111111-1111-1111-1111-111111111111', '00700070-0070-0070-0070-007000700101', 'pay-jones-0804', 'Jones Hospital Payment', 15000.00, 'active')
on conflict (id) do nothing;

-- M6 Patient Experience
insert into public.hsp_patient_notifications (id, organization_id, hub_id, notification_key, notification_title, notification_type, status)
values ('02140114-0214-0214-0214-021401141601', '11111111-1111-1111-1111-111111111111', '00700070-0070-0070-0070-007000700101', 'ntf-jones-0804', 'Appointment Reminder', 'general', 'active')
on conflict (id) do nothing;

insert into public.hsp_medical_reports (id, organization_id, hub_id, report_key, report_name, report_type, status)
values ('02150115-0215-0215-0215-021501151701', '11111111-1111-1111-1111-111111111111', '00700070-0070-0070-0070-007000700101', 'rpt-jones-0804', 'Jones Medical Report', 'operational', 'active')
on conflict (id) do nothing;

insert into public.hsp_patient_feedback (id, organization_id, hub_id, feedback_key, feedback_name, feedback_score, status)
values ('02160116-0216-0216-0216-021601161801', '11111111-1111-1111-1111-111111111111', '00700070-0070-0070-0070-007000700101', 'fdb-jones-0804', 'Jones Patient Feedback', 4.5, 'active')
on conflict (id) do nothing;

-- M7 Analytics
insert into public.hsp_admissions_analytics (id, organization_id, hub_id, analytics_key, analytics_type, analytics_score, status)
values ('02170117-0217-0217-0217-021701171901', '11111111-1111-1111-1111-111111111111', '00700070-0070-0070-0070-007000700101', 'anly-adm-0804', 'admissions', 94.50, 'active')
on conflict (id) do nothing;

insert into public.hsp_occupancy_analytics (id, organization_id, hub_id, analytics_key, analytics_type, analytics_score, status)
values ('02180118-0218-0218-0218-021801181a01', '11111111-1111-1111-1111-111111111111', '00700070-0070-0070-0070-007000700101', 'anly-occ-0804', 'occupancy', 88.00, 'active')
on conflict (id) do nothing;

insert into public.hsp_revenue_analytics (id, organization_id, hub_id, analytics_key, analytics_type, analytics_score, status)
values ('02190119-0219-0219-0219-021901191b01', '11111111-1111-1111-1111-111111111111', '00700070-0070-0070-0070-007000700101', 'anly-rev-0804', 'revenue', 96.00, 'active')
on conflict (id) do nothing;

-- M8 Executive Dashboard
insert into public.hsp_hospital_metrics (id, organization_id, metrics_key, admissions_count, discharge_count, bed_occupancy_rate, revenue_total, department_performance_score, patient_satisfaction_score, operational_health_score, overall_hospital_score, status)
values ('021a011a-021a-021a-021a-021a011a1c01', '11111111-1111-1111-1111-111111111111', 'hsp-metrics-0804', 850, 720, 88.50, 2500000.00, 91.00, 92.50, 93.00, 95.25, 'active')
on conflict (id) do nothing;

insert into public.hsp_hospital_health (id, organization_id, health_key, overall_score, disaster_recovery_mode, bed_utilization_status, financial_health_status, operational_health_status, summary, status)
values ('021b011b-021b-021b-021b-021b011b1d01', '11111111-1111-1111-1111-111111111111', 'hsp-health-0804', 96.00, false, 'healthy', 'healthy', 'healthy', 'Hospital business operating system operational', 'healthy')
on conflict (id) do nothing;

insert into public.hsp_executive_kpis (id, organization_id, hub_id, kpi_key, kpi_name, kpi_score, status)
values ('021c011c-021c-021c-021c-021c011c1e01', '11111111-1111-1111-1111-111111111111', '00700070-0070-0070-0070-007000700101', 'kpi-exec-0804', 'Executive KPI Score', 97.50, 'active')
on conflict (id) do nothing;

insert into public.hsp_hospital_failures (id, organization_id, hub_id, failure_key, failure_type, error_code, error_message, status)
values ('021d011d-021d-021d-021d-021d011d1f01', '11111111-1111-1111-1111-111111111111', '00700070-0070-0070-0070-007000700101', 'fail-bill-0804', 'billing', 'BILL_TIMEOUT', 'Billing processing timed out', 'open')
on conflict (id) do nothing;

insert into public.hsp_audit_logs (id, organization_id, entity_type, action, summary, security_level)
values ('021e011e-021e-021e-021e-021e011e2001', '11111111-1111-1111-1111-111111111111', 'hospital_hub', 'seed', 'Enterprise hospital business operating system seed data loaded', 'standard')
on conflict (id) do nothing;
