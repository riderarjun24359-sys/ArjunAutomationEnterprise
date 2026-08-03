-- V2 Program B Sprint 8: Enterprise Hospital Business Operating System

-- HospitalHub
create table if not exists public.hsp_hospital_hubs (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_key text not null,
  hub_name text not null,
  environment text not null default 'production',
  hospital_code text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_key)
);

-- Campus
create table if not exists public.hsp_campuses (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.hsp_hospital_hubs(id) on delete cascade,
  campus_key text not null,
  campus_name text not null default '',
  campus_type text not null default 'main',
  address text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, campus_key)
);

-- Department
create table if not exists public.hsp_departments (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.hsp_hospital_hubs(id) on delete cascade,
  department_key text not null,
  department_name text not null default '',
  department_type text not null default 'clinical',
  floor_level text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, department_key)
);

-- Ward
create table if not exists public.hsp_wards (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.hsp_hospital_hubs(id) on delete cascade,
  ward_key text not null,
  ward_name text not null default '',
  ward_type text not null default 'general',
  capacity integer not null default 20,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, ward_key)
);

-- HospitalBed
create table if not exists public.hsp_hospital_beds (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.hsp_hospital_hubs(id) on delete cascade,
  bed_key text not null,
  bed_number text not null default '',
  bed_status text not null default 'available',
  ward_ref text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, bed_key)
);

-- PatientRegistration
create table if not exists public.hsp_patient_registrations (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.hsp_hospital_hubs(id) on delete cascade,
  registration_key text not null,
  registration_name text not null default '',
  registration_status text not null default 'pending',
  patient_type text not null default 'outpatient',
  registered_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, registration_key)
);

-- PatientProfile
create table if not exists public.hsp_patient_profiles (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.hsp_hospital_hubs(id) on delete cascade,
  profile_key text not null,
  profile_name text not null default '',
  profile_type text not null default 'regular',
  blood_group text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, profile_key)
);

-- MedicalHistory
create table if not exists public.hsp_medical_histories (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.hsp_hospital_hubs(id) on delete cascade,
  history_key text not null,
  history_name text not null default '',
  history_type text not null default 'general',
  recorded_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, history_key)
);

-- InsurancePolicy
create table if not exists public.hsp_insurance_policies (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.hsp_hospital_hubs(id) on delete cascade,
  policy_key text not null,
  policy_name text not null default '',
  policy_type text not null default 'health',
  coverage_amount numeric(12, 2) not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, policy_key)
);

-- Appointment
create table if not exists public.hsp_appointments (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.hsp_hospital_hubs(id) on delete cascade,
  appointment_key text not null,
  appointment_name text not null default '',
  appointment_status text not null default 'scheduled',
  appointment_type text not null default 'consultation',
  scheduled_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, appointment_key)
);

-- OpdVisit
create table if not exists public.hsp_opd_visits (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.hsp_hospital_hubs(id) on delete cascade,
  visit_key text not null,
  visit_name text not null default '',
  visit_status text not null default 'checked_in',
  visit_type text not null default 'opd',
  visited_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, visit_key)
);

-- IpdAdmission
create table if not exists public.hsp_ipd_admissions (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.hsp_hospital_hubs(id) on delete cascade,
  admission_key text not null,
  admission_name text not null default '',
  admission_status text not null default 'admitted',
  ward_ref text not null default '',
  admitted_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, admission_key)
);

-- ClinicalNote
create table if not exists public.hsp_clinical_notes (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.hsp_hospital_hubs(id) on delete cascade,
  note_key text not null,
  note_name text not null default '',
  note_type text not null default 'operational',
  note_content text not null default '',
  recorded_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, note_key)
);

-- PharmacyInventory
create table if not exists public.hsp_pharmacy_inventory (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.hsp_hospital_hubs(id) on delete cascade,
  inventory_key text not null,
  inventory_name text not null default '',
  inventory_type text not null default 'medicine',
  stock_quantity integer not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, inventory_key)
);

-- Prescription
create table if not exists public.hsp_prescriptions (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.hsp_hospital_hubs(id) on delete cascade,
  prescription_key text not null,
  prescription_name text not null default '',
  prescription_status text not null default 'pending',
  prescribed_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, prescription_key)
);

-- LabOrder
create table if not exists public.hsp_lab_orders (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.hsp_hospital_hubs(id) on delete cascade,
  order_key text not null,
  order_name text not null default '',
  order_status text not null default 'pending',
  order_type text not null default 'blood_test',
  ordered_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, order_key)
);

-- LabResult
create table if not exists public.hsp_lab_results (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.hsp_hospital_hubs(id) on delete cascade,
  result_key text not null,
  result_name text not null default '',
  result_status text not null default 'pending',
  result_value text not null default '',
  resulted_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, result_key)
);

-- HospitalBilling
create table if not exists public.hsp_hospital_billing (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.hsp_hospital_hubs(id) on delete cascade,
  billing_key text not null,
  billing_name text not null default '',
  billing_amount numeric(12, 2) not null default 0,
  billing_type text not null default 'inpatient',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, billing_key)
);

-- InsuranceClaim
create table if not exists public.hsp_insurance_claims (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.hsp_hospital_hubs(id) on delete cascade,
  claim_key text not null,
  claim_name text not null default '',
  claim_status text not null default 'pending',
  claim_amount numeric(12, 2) not null default 0,
  submitted_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, claim_key)
);

-- HospitalInvoice
create table if not exists public.hsp_hospital_invoices (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.hsp_hospital_hubs(id) on delete cascade,
  invoice_key text not null,
  invoice_name text not null default '',
  invoice_amount numeric(12, 2) not null default 0,
  invoice_status text not null default 'pending',
  due_date date not null default current_date,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, invoice_key)
);

-- HospitalPayment
create table if not exists public.hsp_hospital_payments (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.hsp_hospital_hubs(id) on delete cascade,
  payment_key text not null,
  payment_name text not null default '',
  payment_amount numeric(12, 2) not null default 0,
  payment_status text not null default 'completed',
  paid_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, payment_key)
);

-- PatientNotification
create table if not exists public.hsp_patient_notifications (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.hsp_hospital_hubs(id) on delete cascade,
  notification_key text not null,
  notification_title text not null default '',
  notification_type text not null default 'general',
  sent_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, notification_key)
);

-- MedicalReport
create table if not exists public.hsp_medical_reports (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.hsp_hospital_hubs(id) on delete cascade,
  report_key text not null,
  report_name text not null default '',
  report_type text not null default 'operational',
  generated_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, report_key)
);

-- PatientFeedback
create table if not exists public.hsp_patient_feedback (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.hsp_hospital_hubs(id) on delete cascade,
  feedback_key text not null,
  feedback_name text not null default '',
  feedback_score numeric(3, 1) not null default 0,
  feedback_type text not null default 'service',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, feedback_key)
);

-- AdmissionsAnalytics
create table if not exists public.hsp_admissions_analytics (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.hsp_hospital_hubs(id) on delete cascade,
  analytics_key text not null,
  analytics_type text not null default 'admissions',
  analytics_score numeric(5, 2) not null default 0,
  metric_date date not null default current_date,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, analytics_key)
);

-- OccupancyAnalytics
create table if not exists public.hsp_occupancy_analytics (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.hsp_hospital_hubs(id) on delete cascade,
  analytics_key text not null,
  analytics_type text not null default 'occupancy',
  analytics_score numeric(5, 2) not null default 0,
  metric_date date not null default current_date,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, analytics_key)
);

-- RevenueAnalytics
create table if not exists public.hsp_revenue_analytics (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.hsp_hospital_hubs(id) on delete cascade,
  analytics_key text not null,
  analytics_type text not null default 'revenue',
  analytics_score numeric(5, 2) not null default 0,
  metric_date date not null default current_date,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, analytics_key)
);

-- HospitalMetric
create table if not exists public.hsp_hospital_metrics (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  metrics_key text not null,
  metric_date date not null default current_date,
  admissions_count integer not null default 0,
  discharge_count integer not null default 0,
  bed_occupancy_rate numeric(5, 2) not null default 0,
  revenue_total numeric(12, 2) not null default 0,
  department_performance_score numeric(5, 2) not null default 0,
  patient_satisfaction_score numeric(5, 2) not null default 0,
  operational_health_score numeric(5, 2) not null default 0,
  overall_hospital_score numeric(5, 2) not null default 100,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, metrics_key)
);

-- HospitalHealth
create table if not exists public.hsp_hospital_health (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  health_key text not null,
  health_date date not null default current_date,
  overall_score numeric(5, 2) not null default 100,
  disaster_recovery_mode boolean not null default false,
  bed_utilization_status text not null default 'healthy',
  financial_health_status text not null default 'healthy',
  operational_health_status text not null default 'healthy',
  summary text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, health_key)
);

-- ExecutiveKpi
create table if not exists public.hsp_executive_kpis (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.hsp_hospital_hubs(id) on delete cascade,
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

-- HospitalFailure
create table if not exists public.hsp_hospital_failures (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.hsp_hospital_hubs(id) on delete cascade,
  failure_key text not null,
  failure_type text not null default 'billing',
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
create table if not exists public.hsp_audit_logs (
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

create index if not exists idx_hsp_hospital_hubs_org on public.hsp_hospital_hubs(organization_id);
create index if not exists idx_hsp_campuses_org on public.hsp_campuses(organization_id);
create index if not exists idx_hsp_campuses_hub on public.hsp_campuses(hub_id);
create index if not exists idx_hsp_departments_org on public.hsp_departments(organization_id);
create index if not exists idx_hsp_departments_hub on public.hsp_departments(hub_id);
create index if not exists idx_hsp_wards_org on public.hsp_wards(organization_id);
create index if not exists idx_hsp_wards_hub on public.hsp_wards(hub_id);
create index if not exists idx_hsp_hospital_beds_org on public.hsp_hospital_beds(organization_id);
create index if not exists idx_hsp_hospital_beds_hub on public.hsp_hospital_beds(hub_id);
create index if not exists idx_hsp_patient_registrations_org on public.hsp_patient_registrations(organization_id);
create index if not exists idx_hsp_patient_registrations_hub on public.hsp_patient_registrations(hub_id);
create index if not exists idx_hsp_patient_profiles_org on public.hsp_patient_profiles(organization_id);
create index if not exists idx_hsp_patient_profiles_hub on public.hsp_patient_profiles(hub_id);
create index if not exists idx_hsp_medical_histories_org on public.hsp_medical_histories(organization_id);
create index if not exists idx_hsp_medical_histories_hub on public.hsp_medical_histories(hub_id);
create index if not exists idx_hsp_insurance_policies_org on public.hsp_insurance_policies(organization_id);
create index if not exists idx_hsp_insurance_policies_hub on public.hsp_insurance_policies(hub_id);
create index if not exists idx_hsp_appointments_org on public.hsp_appointments(organization_id);
create index if not exists idx_hsp_appointments_hub on public.hsp_appointments(hub_id);
create index if not exists idx_hsp_opd_visits_org on public.hsp_opd_visits(organization_id);
create index if not exists idx_hsp_opd_visits_hub on public.hsp_opd_visits(hub_id);
create index if not exists idx_hsp_ipd_admissions_org on public.hsp_ipd_admissions(organization_id);
create index if not exists idx_hsp_ipd_admissions_hub on public.hsp_ipd_admissions(hub_id);
create index if not exists idx_hsp_clinical_notes_org on public.hsp_clinical_notes(organization_id);
create index if not exists idx_hsp_clinical_notes_hub on public.hsp_clinical_notes(hub_id);
create index if not exists idx_hsp_pharmacy_inventory_org on public.hsp_pharmacy_inventory(organization_id);
create index if not exists idx_hsp_pharmacy_inventory_hub on public.hsp_pharmacy_inventory(hub_id);
create index if not exists idx_hsp_prescriptions_org on public.hsp_prescriptions(organization_id);
create index if not exists idx_hsp_prescriptions_hub on public.hsp_prescriptions(hub_id);
create index if not exists idx_hsp_lab_orders_org on public.hsp_lab_orders(organization_id);
create index if not exists idx_hsp_lab_orders_hub on public.hsp_lab_orders(hub_id);
create index if not exists idx_hsp_lab_results_org on public.hsp_lab_results(organization_id);
create index if not exists idx_hsp_lab_results_hub on public.hsp_lab_results(hub_id);
create index if not exists idx_hsp_hospital_billing_org on public.hsp_hospital_billing(organization_id);
create index if not exists idx_hsp_hospital_billing_hub on public.hsp_hospital_billing(hub_id);
create index if not exists idx_hsp_insurance_claims_org on public.hsp_insurance_claims(organization_id);
create index if not exists idx_hsp_insurance_claims_hub on public.hsp_insurance_claims(hub_id);
create index if not exists idx_hsp_hospital_invoices_org on public.hsp_hospital_invoices(organization_id);
create index if not exists idx_hsp_hospital_invoices_hub on public.hsp_hospital_invoices(hub_id);
create index if not exists idx_hsp_hospital_payments_org on public.hsp_hospital_payments(organization_id);
create index if not exists idx_hsp_hospital_payments_hub on public.hsp_hospital_payments(hub_id);
create index if not exists idx_hsp_patient_notifications_org on public.hsp_patient_notifications(organization_id);
create index if not exists idx_hsp_patient_notifications_hub on public.hsp_patient_notifications(hub_id);
create index if not exists idx_hsp_medical_reports_org on public.hsp_medical_reports(organization_id);
create index if not exists idx_hsp_medical_reports_hub on public.hsp_medical_reports(hub_id);
create index if not exists idx_hsp_patient_feedback_org on public.hsp_patient_feedback(organization_id);
create index if not exists idx_hsp_patient_feedback_hub on public.hsp_patient_feedback(hub_id);
create index if not exists idx_hsp_admissions_analytics_org on public.hsp_admissions_analytics(organization_id);
create index if not exists idx_hsp_admissions_analytics_hub on public.hsp_admissions_analytics(hub_id);
create index if not exists idx_hsp_occupancy_analytics_org on public.hsp_occupancy_analytics(organization_id);
create index if not exists idx_hsp_occupancy_analytics_hub on public.hsp_occupancy_analytics(hub_id);
create index if not exists idx_hsp_revenue_analytics_org on public.hsp_revenue_analytics(organization_id);
create index if not exists idx_hsp_revenue_analytics_hub on public.hsp_revenue_analytics(hub_id);
create index if not exists idx_hsp_hospital_metrics_org on public.hsp_hospital_metrics(organization_id);
create index if not exists idx_hsp_hospital_health_org on public.hsp_hospital_health(organization_id);
create index if not exists idx_hsp_executive_kpis_org on public.hsp_executive_kpis(organization_id);
create index if not exists idx_hsp_executive_kpis_hub on public.hsp_executive_kpis(hub_id);
create index if not exists idx_hsp_hospital_failures_org on public.hsp_hospital_failures(organization_id);
create index if not exists idx_hsp_hospital_failures_hub on public.hsp_hospital_failures(hub_id);
create index if not exists idx_hsp_audit_logs_org on public.hsp_audit_logs(organization_id);

do $$
declare tbl text;
begin
  foreach tbl in array array[
    'hsp_hospital_hubs','hsp_campuses','hsp_departments','hsp_wards','hsp_hospital_beds','hsp_patient_registrations','hsp_patient_profiles','hsp_medical_histories','hsp_insurance_policies','hsp_appointments','hsp_opd_visits','hsp_ipd_admissions','hsp_clinical_notes','hsp_pharmacy_inventory','hsp_prescriptions','hsp_lab_orders','hsp_lab_results','hsp_hospital_billing','hsp_insurance_claims','hsp_hospital_invoices','hsp_hospital_payments','hsp_patient_notifications','hsp_medical_reports','hsp_patient_feedback','hsp_admissions_analytics','hsp_occupancy_analytics','hsp_revenue_analytics','hsp_hospital_metrics','hsp_hospital_health','hsp_executive_kpis','hsp_hospital_failures'
  ]
  loop
    execute format('drop trigger if exists trg_%I_updated_at on public.%I', tbl, tbl);
    execute format('create trigger trg_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()', tbl, tbl);
  end loop;
end $$;

alter table public.hsp_hospital_hubs enable row level security;
alter table public.hsp_campuses enable row level security;
alter table public.hsp_departments enable row level security;
alter table public.hsp_wards enable row level security;
alter table public.hsp_hospital_beds enable row level security;
alter table public.hsp_patient_registrations enable row level security;
alter table public.hsp_patient_profiles enable row level security;
alter table public.hsp_medical_histories enable row level security;
alter table public.hsp_insurance_policies enable row level security;
alter table public.hsp_appointments enable row level security;
alter table public.hsp_opd_visits enable row level security;
alter table public.hsp_ipd_admissions enable row level security;
alter table public.hsp_clinical_notes enable row level security;
alter table public.hsp_pharmacy_inventory enable row level security;
alter table public.hsp_prescriptions enable row level security;
alter table public.hsp_lab_orders enable row level security;
alter table public.hsp_lab_results enable row level security;
alter table public.hsp_hospital_billing enable row level security;
alter table public.hsp_insurance_claims enable row level security;
alter table public.hsp_hospital_invoices enable row level security;
alter table public.hsp_hospital_payments enable row level security;
alter table public.hsp_patient_notifications enable row level security;
alter table public.hsp_medical_reports enable row level security;
alter table public.hsp_patient_feedback enable row level security;
alter table public.hsp_admissions_analytics enable row level security;
alter table public.hsp_occupancy_analytics enable row level security;
alter table public.hsp_revenue_analytics enable row level security;
alter table public.hsp_hospital_metrics enable row level security;
alter table public.hsp_hospital_health enable row level security;
alter table public.hsp_executive_kpis enable row level security;
alter table public.hsp_hospital_failures enable row level security;
alter table public.hsp_audit_logs enable row level security;

do $$
declare tbl text;
begin
  foreach tbl in array array[
    'hsp_hospital_hubs','hsp_campuses','hsp_departments','hsp_wards','hsp_hospital_beds','hsp_patient_registrations','hsp_patient_profiles','hsp_medical_histories','hsp_insurance_policies','hsp_appointments','hsp_opd_visits','hsp_ipd_admissions','hsp_clinical_notes','hsp_pharmacy_inventory','hsp_prescriptions','hsp_lab_orders','hsp_lab_results','hsp_hospital_billing','hsp_insurance_claims','hsp_hospital_invoices','hsp_hospital_payments','hsp_patient_notifications','hsp_medical_reports','hsp_patient_feedback','hsp_admissions_analytics','hsp_occupancy_analytics','hsp_revenue_analytics','hsp_hospital_metrics','hsp_hospital_health','hsp_executive_kpis','hsp_hospital_failures','hsp_audit_logs'
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
  ('hsp.view', 'View enterprise hospital business operating system data', 'enterprise_hospital_business_os'),
  ('hsp.manage', 'Manage hospital foundation, patient, clinical operations, pharmacy, lab, finance, and framework outputs', 'enterprise_hospital_business_os'),
  ('hsp.approve', 'Approve hospital admissions and billing gates', 'enterprise_hospital_business_os'),
  ('hsp.admin', 'Administer enterprise hospital business operating system governance', 'enterprise_hospital_business_os')
on conflict (key) do update set description = excluded.description, resource = excluded.resource;
