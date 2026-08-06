-- V2 Program B Sprint 7: Enterprise School Business Operating System

-- SchoolHub
create table if not exists public.sch_school_hubs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_key text not null,
  hub_name text not null,
  environment text not null default 'production',
  school_code text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_key)
);

-- Campus
create table if not exists public.sch_campuses (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.sch_school_hubs(id) on delete cascade,
  campus_key text not null,
  campus_name text not null default '',
  campus_type text not null default 'main',
  address text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, campus_key)
);

-- Building
create table if not exists public.sch_buildings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.sch_school_hubs(id) on delete cascade,
  building_key text not null,
  building_name text not null default '',
  building_type text not null default 'academic',
  floor_count integer not null default 1,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, building_key)
);

-- Classroom
create table if not exists public.sch_classrooms (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.sch_school_hubs(id) on delete cascade,
  classroom_key text not null,
  classroom_name text not null default '',
  classroom_type text not null default 'standard',
  capacity integer not null default 30,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, classroom_key)
);

-- AcademicYear
create table if not exists public.sch_academic_years (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.sch_school_hubs(id) on delete cascade,
  year_key text not null,
  year_name text not null default '',
  year_status text not null default 'active',
  start_date date not null default current_date,
  end_date date,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, year_key)
);

-- Admission
create table if not exists public.sch_admissions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.sch_school_hubs(id) on delete cascade,
  admission_key text not null,
  admission_name text not null default '',
  admission_status text not null default 'pending',
  grade_level text not null default '',
  applied_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, admission_key)
);

-- StudentProfile
create table if not exists public.sch_student_profiles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.sch_school_hubs(id) on delete cascade,
  profile_key text not null,
  profile_name text not null default '',
  profile_type text not null default 'regular',
  grade_level text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, profile_key)
);

-- ParentProfile
create table if not exists public.sch_parent_profiles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.sch_school_hubs(id) on delete cascade,
  parent_key text not null,
  parent_name text not null default '',
  parent_type text not null default 'guardian',
  email text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, parent_key)
);

-- Enrollment
create table if not exists public.sch_enrollments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.sch_school_hubs(id) on delete cascade,
  enrollment_key text not null,
  enrollment_name text not null default '',
  enrollment_status text not null default 'active',
  enrolled_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, enrollment_key)
);

-- Subject
create table if not exists public.sch_subjects (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.sch_school_hubs(id) on delete cascade,
  subject_key text not null,
  subject_name text not null default '',
  subject_type text not null default 'core',
  credit_hours numeric(4, 1) not null default 1,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, subject_key)
);

-- Timetable
create table if not exists public.sch_timetables (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.sch_school_hubs(id) on delete cascade,
  timetable_key text not null,
  timetable_name text not null default '',
  timetable_type text not null default 'weekly',
  period_count integer not null default 8,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, timetable_key)
);

-- Examination
create table if not exists public.sch_examinations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.sch_school_hubs(id) on delete cascade,
  exam_key text not null,
  exam_name text not null default '',
  exam_type text not null default 'midterm',
  exam_status text not null default 'scheduled',
  scheduled_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, exam_key)
);

-- ReportCard
create table if not exists public.sch_report_cards (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.sch_school_hubs(id) on delete cascade,
  report_key text not null,
  report_name text not null default '',
  report_grade text not null default 'A',
  gpa numeric(3, 2) not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, report_key)
);

-- Teacher
create table if not exists public.sch_teachers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.sch_school_hubs(id) on delete cascade,
  teacher_key text not null,
  teacher_name text not null default '',
  teacher_type text not null default 'full_time',
  department text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, teacher_key)
);

-- StaffAttendance
create table if not exists public.sch_staff_attendance (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.sch_school_hubs(id) on delete cascade,
  attendance_key text not null,
  attendance_name text not null default '',
  attendance_status text not null default 'present',
  recorded_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, attendance_key)
);

-- LeaveRequest
create table if not exists public.sch_leave_requests (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.sch_school_hubs(id) on delete cascade,
  leave_key text not null,
  leave_name text not null default '',
  leave_status text not null default 'pending',
  leave_type text not null default 'personal',
  requested_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, leave_key)
);

-- SubstituteTeacher
create table if not exists public.sch_substitute_teachers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.sch_school_hubs(id) on delete cascade,
  substitute_key text not null,
  substitute_name text not null default '',
  substitute_status text not null default 'available',
  assigned_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, substitute_key)
);

-- FeeStructure
create table if not exists public.sch_fee_structures (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.sch_school_hubs(id) on delete cascade,
  fee_key text not null,
  fee_name text not null default '',
  fee_type text not null default 'tuition',
  amount numeric(12, 2) not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, fee_key)
);

-- FeeInvoice
create table if not exists public.sch_fee_invoices (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.sch_school_hubs(id) on delete cascade,
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

-- FeePayment
create table if not exists public.sch_fee_payments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.sch_school_hubs(id) on delete cascade,
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

-- Scholarship
create table if not exists public.sch_scholarships (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.sch_school_hubs(id) on delete cascade,
  scholarship_key text not null,
  scholarship_name text not null default '',
  scholarship_amount numeric(12, 2) not null default 0,
  scholarship_type text not null default 'merit',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, scholarship_key)
);

-- Announcement
create table if not exists public.sch_announcements (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.sch_school_hubs(id) on delete cascade,
  announcement_key text not null,
  announcement_title text not null default '',
  announcement_type text not null default 'general',
  published_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, announcement_key)
);

-- Messaging
create table if not exists public.sch_messaging (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.sch_school_hubs(id) on delete cascade,
  message_key text not null,
  message_subject text not null default '',
  message_type text not null default 'direct',
  sent_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, message_key)
);

-- Event
create table if not exists public.sch_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.sch_school_hubs(id) on delete cascade,
  event_key text not null,
  event_name text not null default '',
  event_type text not null default 'academic',
  event_date timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, event_key)
);

-- AdmissionsAnalytics
create table if not exists public.sch_admissions_analytics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.sch_school_hubs(id) on delete cascade,
  analytics_key text not null,
  analytics_type text not null default 'admissions',
  analytics_score numeric(5, 2) not null default 0,
  metric_date date not null default current_date,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, analytics_key)
);

-- AttendanceAnalytics
create table if not exists public.sch_attendance_analytics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.sch_school_hubs(id) on delete cascade,
  analytics_key text not null,
  analytics_type text not null default 'attendance',
  analytics_score numeric(5, 2) not null default 0,
  metric_date date not null default current_date,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, analytics_key)
);

-- AcademicAnalytics
create table if not exists public.sch_academic_analytics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.sch_school_hubs(id) on delete cascade,
  analytics_key text not null,
  analytics_type text not null default 'academic',
  analytics_score numeric(5, 2) not null default 0,
  metric_date date not null default current_date,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, analytics_key)
);

-- SchoolMetric
create table if not exists public.sch_school_metrics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  metrics_key text not null,
  metric_date date not null default current_date,
  revenue_total numeric(12, 2) not null default 0,
  admissions_count integer not null default 0,
  attendance_rate numeric(5, 2) not null default 0,
  academic_performance_score numeric(5, 2) not null default 0,
  fee_collection_rate numeric(5, 2) not null default 0,
  teacher_performance_score numeric(5, 2) not null default 0,
  student_growth_rate numeric(5, 2) not null default 0,
  overall_school_score numeric(5, 2) not null default 100,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, metrics_key)
);

-- SchoolHealth
create table if not exists public.sch_school_health (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  health_key text not null,
  health_date date not null default current_date,
  overall_score numeric(5, 2) not null default 100,
  disaster_recovery_mode boolean not null default false,
  campus_health_status text not null default 'healthy',
  financial_health_status text not null default 'healthy',
  operational_health_status text not null default 'healthy',
  summary text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, health_key)
);

-- ExecutiveKpi
create table if not exists public.sch_executive_kpis (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.sch_school_hubs(id) on delete cascade,
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

-- SchoolFailure
create table if not exists public.sch_school_failures (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.sch_school_hubs(id) on delete cascade,
  failure_key text not null,
  failure_type text not null default 'admission',
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
create table if not exists public.sch_audit_logs (
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

create index if not exists idx_sch_school_hubs_org on public.sch_school_hubs(organization_id);
create index if not exists idx_sch_campuses_org on public.sch_campuses(organization_id);
create index if not exists idx_sch_campuses_hub on public.sch_campuses(hub_id);
create index if not exists idx_sch_buildings_org on public.sch_buildings(organization_id);
create index if not exists idx_sch_buildings_hub on public.sch_buildings(hub_id);
create index if not exists idx_sch_classrooms_org on public.sch_classrooms(organization_id);
create index if not exists idx_sch_classrooms_hub on public.sch_classrooms(hub_id);
create index if not exists idx_sch_academic_years_org on public.sch_academic_years(organization_id);
create index if not exists idx_sch_academic_years_hub on public.sch_academic_years(hub_id);
create index if not exists idx_sch_admissions_org on public.sch_admissions(organization_id);
create index if not exists idx_sch_admissions_hub on public.sch_admissions(hub_id);
create index if not exists idx_sch_student_profiles_org on public.sch_student_profiles(organization_id);
create index if not exists idx_sch_student_profiles_hub on public.sch_student_profiles(hub_id);
create index if not exists idx_sch_parent_profiles_org on public.sch_parent_profiles(organization_id);
create index if not exists idx_sch_parent_profiles_hub on public.sch_parent_profiles(hub_id);
create index if not exists idx_sch_enrollments_org on public.sch_enrollments(organization_id);
create index if not exists idx_sch_enrollments_hub on public.sch_enrollments(hub_id);
create index if not exists idx_sch_subjects_org on public.sch_subjects(organization_id);
create index if not exists idx_sch_subjects_hub on public.sch_subjects(hub_id);
create index if not exists idx_sch_timetables_org on public.sch_timetables(organization_id);
create index if not exists idx_sch_timetables_hub on public.sch_timetables(hub_id);
create index if not exists idx_sch_examinations_org on public.sch_examinations(organization_id);
create index if not exists idx_sch_examinations_hub on public.sch_examinations(hub_id);
create index if not exists idx_sch_report_cards_org on public.sch_report_cards(organization_id);
create index if not exists idx_sch_report_cards_hub on public.sch_report_cards(hub_id);
create index if not exists idx_sch_teachers_org on public.sch_teachers(organization_id);
create index if not exists idx_sch_teachers_hub on public.sch_teachers(hub_id);
create index if not exists idx_sch_staff_attendance_org on public.sch_staff_attendance(organization_id);
create index if not exists idx_sch_staff_attendance_hub on public.sch_staff_attendance(hub_id);
create index if not exists idx_sch_leave_requests_org on public.sch_leave_requests(organization_id);
create index if not exists idx_sch_leave_requests_hub on public.sch_leave_requests(hub_id);
create index if not exists idx_sch_substitute_teachers_org on public.sch_substitute_teachers(organization_id);
create index if not exists idx_sch_substitute_teachers_hub on public.sch_substitute_teachers(hub_id);
create index if not exists idx_sch_fee_structures_org on public.sch_fee_structures(organization_id);
create index if not exists idx_sch_fee_structures_hub on public.sch_fee_structures(hub_id);
create index if not exists idx_sch_fee_invoices_org on public.sch_fee_invoices(organization_id);
create index if not exists idx_sch_fee_invoices_hub on public.sch_fee_invoices(hub_id);
create index if not exists idx_sch_fee_payments_org on public.sch_fee_payments(organization_id);
create index if not exists idx_sch_fee_payments_hub on public.sch_fee_payments(hub_id);
create index if not exists idx_sch_scholarships_org on public.sch_scholarships(organization_id);
create index if not exists idx_sch_scholarships_hub on public.sch_scholarships(hub_id);
create index if not exists idx_sch_announcements_org on public.sch_announcements(organization_id);
create index if not exists idx_sch_announcements_hub on public.sch_announcements(hub_id);
create index if not exists idx_sch_messaging_org on public.sch_messaging(organization_id);
create index if not exists idx_sch_messaging_hub on public.sch_messaging(hub_id);
create index if not exists idx_sch_events_org on public.sch_events(organization_id);
create index if not exists idx_sch_events_hub on public.sch_events(hub_id);
create index if not exists idx_sch_admissions_analytics_org on public.sch_admissions_analytics(organization_id);
create index if not exists idx_sch_admissions_analytics_hub on public.sch_admissions_analytics(hub_id);
create index if not exists idx_sch_attendance_analytics_org on public.sch_attendance_analytics(organization_id);
create index if not exists idx_sch_attendance_analytics_hub on public.sch_attendance_analytics(hub_id);
create index if not exists idx_sch_academic_analytics_org on public.sch_academic_analytics(organization_id);
create index if not exists idx_sch_academic_analytics_hub on public.sch_academic_analytics(hub_id);
create index if not exists idx_sch_school_metrics_org on public.sch_school_metrics(organization_id);
create index if not exists idx_sch_school_health_org on public.sch_school_health(organization_id);
create index if not exists idx_sch_executive_kpis_org on public.sch_executive_kpis(organization_id);
create index if not exists idx_sch_executive_kpis_hub on public.sch_executive_kpis(hub_id);
create index if not exists idx_sch_school_failures_org on public.sch_school_failures(organization_id);
create index if not exists idx_sch_school_failures_hub on public.sch_school_failures(hub_id);
create index if not exists idx_sch_audit_logs_org on public.sch_audit_logs(organization_id);

do $$
declare tbl text;
begin
  foreach tbl in array array[
    'sch_school_hubs','sch_campuses','sch_buildings','sch_classrooms','sch_academic_years','sch_admissions','sch_student_profiles','sch_parent_profiles','sch_enrollments','sch_subjects','sch_timetables','sch_examinations','sch_report_cards','sch_teachers','sch_staff_attendance','sch_leave_requests','sch_substitute_teachers','sch_fee_structures','sch_fee_invoices','sch_fee_payments','sch_scholarships','sch_announcements','sch_messaging','sch_events','sch_admissions_analytics','sch_attendance_analytics','sch_academic_analytics','sch_school_metrics','sch_school_health','sch_executive_kpis','sch_school_failures'
  ]
  loop
    execute format('drop trigger if exists trg_%I_updated_at on public.%I', tbl, tbl);
    execute format('create trigger trg_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()', tbl, tbl);
  end loop;
end $$;

alter table public.sch_school_hubs enable row level security;
alter table public.sch_campuses enable row level security;
alter table public.sch_buildings enable row level security;
alter table public.sch_classrooms enable row level security;
alter table public.sch_academic_years enable row level security;
alter table public.sch_admissions enable row level security;
alter table public.sch_student_profiles enable row level security;
alter table public.sch_parent_profiles enable row level security;
alter table public.sch_enrollments enable row level security;
alter table public.sch_subjects enable row level security;
alter table public.sch_timetables enable row level security;
alter table public.sch_examinations enable row level security;
alter table public.sch_report_cards enable row level security;
alter table public.sch_teachers enable row level security;
alter table public.sch_staff_attendance enable row level security;
alter table public.sch_leave_requests enable row level security;
alter table public.sch_substitute_teachers enable row level security;
alter table public.sch_fee_structures enable row level security;
alter table public.sch_fee_invoices enable row level security;
alter table public.sch_fee_payments enable row level security;
alter table public.sch_scholarships enable row level security;
alter table public.sch_announcements enable row level security;
alter table public.sch_messaging enable row level security;
alter table public.sch_events enable row level security;
alter table public.sch_admissions_analytics enable row level security;
alter table public.sch_attendance_analytics enable row level security;
alter table public.sch_academic_analytics enable row level security;
alter table public.sch_school_metrics enable row level security;
alter table public.sch_school_health enable row level security;
alter table public.sch_executive_kpis enable row level security;
alter table public.sch_school_failures enable row level security;
alter table public.sch_audit_logs enable row level security;

do $$
declare tbl text;
begin
  foreach tbl in array array[
    'sch_school_hubs','sch_campuses','sch_buildings','sch_classrooms','sch_academic_years','sch_admissions','sch_student_profiles','sch_parent_profiles','sch_enrollments','sch_subjects','sch_timetables','sch_examinations','sch_report_cards','sch_teachers','sch_staff_attendance','sch_leave_requests','sch_substitute_teachers','sch_fee_structures','sch_fee_invoices','sch_fee_payments','sch_scholarships','sch_announcements','sch_messaging','sch_events','sch_admissions_analytics','sch_attendance_analytics','sch_academic_analytics','sch_school_metrics','sch_school_health','sch_executive_kpis','sch_school_failures','sch_audit_logs'
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
  ('sch.view', 'View enterprise school business operating system data', 'enterprise_school_business_os'),
  ('sch.manage', 'Manage school foundation, student, academics, staff, finance, and framework outputs', 'enterprise_school_business_os'),
  ('sch.approve', 'Approve school admissions and fee gates', 'enterprise_school_business_os'),
  ('sch.admin', 'Administer enterprise school business operating system governance', 'enterprise_school_business_os')
on conflict (key) do update set description = excluded.description, resource = excluded.resource;
