insert into public.ai_orchestration_agents (id, organization_id, name, agent_type, workflow_agent_id, provider_id, model_route_id, capabilities, status)
values
  ('a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a339', '11111111-1111-1111-1111-111111111111', 'Enterprise School Orchestrator', 'enterprise_school_business_os', null, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a201', '["school_foundation","student_engine","academics_engine","staff_engine","finance_engine","school_analytics","school_dashboard"]'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.ai_sessions (id, organization_id, agent_id, session_key, module_source, entity_type, entity_id, context, status, expires_at)
values
  ('a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a539', '11111111-1111-1111-1111-111111111111', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a339', 'northstar-school-os-001', 'enterprise_school_business_os', 'school_hub', '006f006f-006f-006f-006f-006f006f0101', '{"objective":"Enterprise school business operating system for northstar education operations"}'::jsonb, 'active', '2026-12-31 23:59:59+00')
on conflict (id) do nothing;

-- M0 School Hub
insert into public.sch_school_hubs (id, organization_id, hub_key, hub_name, environment, school_code, status)
values ('006f006f-006f-006f-006f-006f006f0101', '11111111-1111-1111-1111-111111111111', 'northstar-school-os', 'Northstar School OS Hub', 'production', 'SCH-0804-001', 'active')
on conflict (id) do nothing;

-- M1 Foundation
insert into public.sch_campuses (id, organization_id, hub_id, campus_key, campus_name, campus_type, status)
values ('01000100-0100-0100-0100-010001000201', '11111111-1111-1111-1111-111111111111', '006f006f-006f-006f-006f-006f006f0101', 'campus-main-0804', 'Main Campus', 'main', 'active')
on conflict (id) do nothing;

insert into public.sch_buildings (id, organization_id, hub_id, building_key, building_name, building_type, status)
values ('01010101-0101-0101-0101-010101010301', '11111111-1111-1111-1111-111111111111', '006f006f-006f-006f-006f-006f006f0101', 'bldg-science-0804', 'Science Building', 'academic', 'active')
on conflict (id) do nothing;

insert into public.sch_classrooms (id, organization_id, hub_id, classroom_key, classroom_name, classroom_type, status)
values ('01020102-0102-0102-0102-010201020401', '11111111-1111-1111-1111-111111111111', '006f006f-006f-006f-006f-006f006f0101', 'cls-101-0804', 'Classroom 101', 'standard', 'active')
on conflict (id) do nothing;

insert into public.sch_academic_years (id, organization_id, hub_id, year_key, year_name, year_status, status)
values ('01030103-0103-0103-0103-010301030501', '11111111-1111-1111-1111-111111111111', '006f006f-006f-006f-006f-006f006f0101', 'year-2026-0804', 'Academic Year 2026', 'active', 'active')
on conflict (id) do nothing;

-- M2 Student
insert into public.sch_admissions (id, organization_id, hub_id, admission_key, admission_name, admission_status, status)
values ('01040104-0104-0104-0104-010401040601', '11111111-1111-1111-1111-111111111111', '006f006f-006f-006f-006f-006f006f0101', 'adm-smith-0804', 'Smith Admission Application', 'pending', 'active')
on conflict (id) do nothing;

insert into public.sch_student_profiles (id, organization_id, hub_id, profile_key, profile_name, profile_type, status)
values ('01050105-0105-0105-0105-010501050701', '11111111-1111-1111-1111-111111111111', '006f006f-006f-006f-006f-006f006f0101', 'stu-jones-0804', 'Jones Student Profile', 'regular', 'active')
on conflict (id) do nothing;

insert into public.sch_parent_profiles (id, organization_id, hub_id, parent_key, parent_name, parent_type, status)
values ('01060106-0106-0106-0106-010601060801', '11111111-1111-1111-1111-111111111111', '006f006f-006f-006f-006f-006f006f0101', 'par-jones-0804', 'Jones Parent Profile', 'guardian', 'active')
on conflict (id) do nothing;

insert into public.sch_enrollments (id, organization_id, hub_id, enrollment_key, enrollment_name, enrollment_status, status)
values ('01070107-0107-0107-0107-010701070901', '11111111-1111-1111-1111-111111111111', '006f006f-006f-006f-006f-006f006f0101', 'enr-jones-0804', 'Jones Enrollment', 'active', 'active')
on conflict (id) do nothing;

-- M3 Academics
insert into public.sch_subjects (id, organization_id, hub_id, subject_key, subject_name, subject_type, status)
values ('01080108-0108-0108-0108-010801080a01', '11111111-1111-1111-1111-111111111111', '006f006f-006f-006f-006f-006f006f0101', 'sub-math-0804', 'Mathematics', 'core', 'active')
on conflict (id) do nothing;

insert into public.sch_timetables (id, organization_id, hub_id, timetable_key, timetable_name, timetable_type, status)
values ('01090109-0109-0109-0109-010901090b01', '11111111-1111-1111-1111-111111111111', '006f006f-006f-006f-006f-006f006f0101', 'tt-weekly-0804', 'Weekly Timetable', 'weekly', 'active')
on conflict (id) do nothing;

insert into public.sch_examinations (id, organization_id, hub_id, exam_key, exam_name, exam_type, status)
values ('010a010a-010a-010a-010a-010a010a0c01', '11111111-1111-1111-1111-111111111111', '006f006f-006f-006f-006f-006f006f0101', 'exam-mid-0804', 'Midterm Examination', 'midterm', 'active')
on conflict (id) do nothing;

insert into public.sch_report_cards (id, organization_id, hub_id, report_key, report_name, report_grade, status)
values ('010b010b-010b-010b-010b-010b010b0d01', '11111111-1111-1111-1111-111111111111', '006f006f-006f-006f-006f-006f006f0101', 'rpt-jones-0804', 'Jones Report Card', 'A', 'active')
on conflict (id) do nothing;

-- M4 Staff
insert into public.sch_teachers (id, organization_id, hub_id, teacher_key, teacher_name, teacher_type, status)
values ('010c010c-010c-010c-010c-010c010c0e01', '11111111-1111-1111-1111-111111111111', '006f006f-006f-006f-006f-006f006f0101', 'tch-wilson-0804', 'Wilson Teacher', 'full_time', 'active')
on conflict (id) do nothing;

insert into public.sch_staff_attendance (id, organization_id, hub_id, attendance_key, attendance_name, attendance_status, status)
values ('010d010d-010d-010d-010d-010d010d0f01', '11111111-1111-1111-1111-111111111111', '006f006f-006f-006f-006f-006f006f0101', 'att-wilson-0804', 'Wilson Attendance', 'present', 'active')
on conflict (id) do nothing;

insert into public.sch_leave_requests (id, organization_id, hub_id, leave_key, leave_name, leave_status, status)
values ('010e010e-010e-010e-010e-010e010e1001', '11111111-1111-1111-1111-111111111111', '006f006f-006f-006f-006f-006f006f0101', 'lv-wilson-0804', 'Wilson Leave Request', 'pending', 'active')
on conflict (id) do nothing;

insert into public.sch_substitute_teachers (id, organization_id, hub_id, substitute_key, substitute_name, substitute_status, status)
values ('010f010f-010f-010f-010f-010f010f1101', '11111111-1111-1111-1111-111111111111', '006f006f-006f-006f-006f-006f006f0101', 'sub-brown-0804', 'Brown Substitute', 'available', 'active')
on conflict (id) do nothing;

-- M5 Finance
insert into public.sch_fee_structures (id, organization_id, hub_id, fee_key, fee_name, fee_type, status)
values ('01100110-0110-0110-0110-011001101201', '11111111-1111-1111-1111-111111111111', '006f006f-006f-006f-006f-006f006f0101', 'fee-tuition-0804', 'Tuition Fee Structure', 'tuition', 'active')
on conflict (id) do nothing;

insert into public.sch_fee_invoices (id, organization_id, hub_id, invoice_key, invoice_name, invoice_amount, status)
values ('01110111-0111-0111-0111-011101111301', '11111111-1111-1111-1111-111111111111', '006f006f-006f-006f-006f-006f006f0101', 'inv-jones-0804', 'Jones Fee Invoice', 5000.00, 'active')
on conflict (id) do nothing;

insert into public.sch_fee_payments (id, organization_id, hub_id, payment_key, payment_name, payment_amount, status)
values ('01120112-0112-0112-0112-011201121401', '11111111-1111-1111-1111-111111111111', '006f006f-006f-006f-006f-006f006f0101', 'pay-jones-0804', 'Jones Fee Payment', 5000.00, 'active')
on conflict (id) do nothing;

insert into public.sch_scholarships (id, organization_id, hub_id, scholarship_key, scholarship_name, scholarship_amount, status)
values ('01130113-0113-0113-0113-011301131501', '11111111-1111-1111-1111-111111111111', '006f006f-006f-006f-006f-006f006f0101', 'sch-merit-0804', 'Merit Scholarship', 1000.00, 'active')
on conflict (id) do nothing;

-- M6 Parent/Student Experience
insert into public.sch_announcements (id, organization_id, hub_id, announcement_key, announcement_title, announcement_type, status)
values ('01140114-0114-0114-0114-011401141601', '11111111-1111-1111-1111-111111111111', '006f006f-006f-006f-006f-006f006f0101', 'ann-open-0804', 'Open House Announcement', 'general', 'active')
on conflict (id) do nothing;

insert into public.sch_messaging (id, organization_id, hub_id, message_key, message_subject, message_type, status)
values ('01150115-0115-0115-0115-011501151701', '11111111-1111-1111-1111-111111111111', '006f006f-006f-006f-006f-006f006f0101', 'msg-parent-0804', 'Parent Message', 'direct', 'active')
on conflict (id) do nothing;

insert into public.sch_events (id, organization_id, hub_id, event_key, event_name, event_type, status)
values ('01160116-0116-0116-0116-011601161801', '11111111-1111-1111-1111-111111111111', '006f006f-006f-006f-006f-006f006f0101', 'evt-sports-0804', 'Sports Day Event', 'academic', 'active')
on conflict (id) do nothing;

-- M7 Analytics
insert into public.sch_admissions_analytics (id, organization_id, hub_id, analytics_key, analytics_type, analytics_score, status)
values ('01170117-0117-0117-0117-011701171901', '11111111-1111-1111-1111-111111111111', '006f006f-006f-006f-006f-006f006f0101', 'anly-adm-0804', 'admissions', 94.50, 'active')
on conflict (id) do nothing;

insert into public.sch_attendance_analytics (id, organization_id, hub_id, analytics_key, analytics_type, analytics_score, status)
values ('01180118-0118-0118-0118-011801181a01', '11111111-1111-1111-1111-111111111111', '006f006f-006f-006f-006f-006f006f0101', 'anly-att-0804', 'attendance', 92.00, 'active')
on conflict (id) do nothing;

insert into public.sch_academic_analytics (id, organization_id, hub_id, analytics_key, analytics_type, analytics_score, status)
values ('01190119-0119-0119-0119-011901191b01', '11111111-1111-1111-1111-111111111111', '006f006f-006f-006f-006f-006f006f0101', 'anly-acad-0804', 'academic', 96.00, 'active')
on conflict (id) do nothing;

-- M8 Executive Dashboard
insert into public.sch_school_metrics (id, organization_id, metrics_key, revenue_total, admissions_count, attendance_rate, academic_performance_score, fee_collection_rate, teacher_performance_score, student_growth_rate, overall_school_score, status)
values ('011a011a-011a-011a-011a-011a011a1c01', '11111111-1111-1111-1111-111111111111', 'sch-metrics-0804', 850000.00, 1250, 94.50, 91.00, 88.50, 93.00, 8.50, 95.25, 'active')
on conflict (id) do nothing;

insert into public.sch_school_health (id, organization_id, health_key, overall_score, disaster_recovery_mode, campus_health_status, financial_health_status, operational_health_status, summary, status)
values ('011b011b-011b-011b-011b-011b011b1d01', '11111111-1111-1111-1111-111111111111', 'sch-health-0804', 96.00, false, 'healthy', 'healthy', 'healthy', 'School business operating system operational', 'healthy')
on conflict (id) do nothing;

insert into public.sch_executive_kpis (id, organization_id, hub_id, kpi_key, kpi_name, kpi_score, status)
values ('011c011c-011c-011c-011c-011c011c1e01', '11111111-1111-1111-1111-111111111111', '006f006f-006f-006f-006f-006f006f0101', 'kpi-exec-0804', 'Executive KPI Score', 97.50, 'active')
on conflict (id) do nothing;

insert into public.sch_school_failures (id, organization_id, hub_id, failure_key, failure_type, error_code, error_message, status)
values ('011d011d-011d-011d-011d-011d011d1f01', '11111111-1111-1111-1111-111111111111', '006f006f-006f-006f-006f-006f006f0101', 'fail-adm-0804', 'admission', 'ADM_TIMEOUT', 'Admission processing timed out', 'open')
on conflict (id) do nothing;

insert into public.sch_audit_logs (id, organization_id, entity_type, action, summary, security_level)
values ('011e011e-011e-011e-011e-011e011e2001', '11111111-1111-1111-1111-111111111111', 'school_hub', 'seed', 'Enterprise school business operating system seed data loaded', 'standard')
on conflict (id) do nothing;
