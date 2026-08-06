-- V2 Enterprise Governance Platform

-- GovernanceHub
create table if not exists public.egp_governance_hubs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_key text not null,
  hub_name text not null,
  environment text not null default 'production',
  governance_tier text not null default 'enterprise',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_key)
);

-- OrganizationGovernance
create table if not exists public.egp_organization_governance (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.egp_governance_hubs(id) on delete cascade,
  governance_key text not null,
  governance_name text not null default '',
  governance_status text not null default 'active',
  governance_scope text not null default 'enterprise',
  owner_ref text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, governance_key)
);

-- GovernancePolicy
create table if not exists public.egp_governance_policies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.egp_governance_hubs(id) on delete cascade,
  policy_key text not null,
  policy_name text not null default '',
  policy_status text not null default 'active',
  policy_type text not null default 'standard',
  effective_date date not null default current_date,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, policy_key)
);

-- GovernanceFramework
create table if not exists public.egp_governance_framework (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.egp_governance_hubs(id) on delete cascade,
  framework_key text not null,
  framework_name text not null default '',
  framework_status text not null default 'active',
  framework_version text not null default '1.0',
  control_count integer not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, framework_key)
);

-- GovernanceReview
create table if not exists public.egp_governance_reviews (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.egp_governance_hubs(id) on delete cascade,
  review_key text not null,
  review_title text not null default '',
  review_status text not null default 'scheduled',
  review_type text not null default 'quarterly',
  scheduled_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, review_key)
);

-- GovernanceDashboard
create table if not exists public.egp_governance_dashboards (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.egp_governance_hubs(id) on delete cascade,
  dashboard_key text not null,
  dashboard_name text not null default '',
  dashboard_status text not null default 'active',
  widget_count integer not null default 0,
  refresh_cadence text not null default 'daily',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, dashboard_key)
);

-- ComplianceFramework
create table if not exists public.egp_compliance_framework (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.egp_governance_hubs(id) on delete cascade,
  framework_key text not null,
  framework_name text not null default '',
  framework_status text not null default 'active',
  regulatory_body text not null default '',
  certification_level text not null default 'standard',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, framework_key)
);

-- ComplianceControl
create table if not exists public.egp_compliance_controls (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.egp_governance_hubs(id) on delete cascade,
  control_key text not null,
  control_name text not null default '',
  control_status text not null default 'active',
  control_type text not null default 'preventive',
  framework_ref text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, control_key)
);

-- ComplianceEvidence
create table if not exists public.egp_compliance_evidence (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.egp_governance_hubs(id) on delete cascade,
  evidence_key text not null,
  evidence_title text not null default '',
  evidence_status text not null default 'pending',
  evidence_type text not null default 'document',
  control_ref text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, evidence_key)
);

-- ComplianceReport
create table if not exists public.egp_compliance_reports (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.egp_governance_hubs(id) on delete cascade,
  report_key text not null,
  report_title text not null default '',
  report_status text not null default 'draft',
  report_period text not null default 'quarterly',
  compliance_score numeric(5, 2) not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, report_key)
);

-- ComplianceCalendar
create table if not exists public.egp_compliance_calendar (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.egp_governance_hubs(id) on delete cascade,
  calendar_key text not null,
  calendar_name text not null default '',
  calendar_status text not null default 'active',
  due_date date not null default current_date,
  obligation_type text not null default 'filing',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, calendar_key)
);

-- AuditCenter
create table if not exists public.egp_audit_center (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.egp_governance_hubs(id) on delete cascade,
  audit_key text not null,
  audit_name text not null default '',
  audit_status text not null default 'planned',
  audit_type text not null default 'internal',
  scheduled_start date not null default current_date,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, audit_key)
);

-- AuditFinding
create table if not exists public.egp_audit_findings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.egp_governance_hubs(id) on delete cascade,
  finding_key text not null,
  finding_title text not null default '',
  finding_severity text not null default 'medium',
  finding_status text not null default 'open',
  audit_ref text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, finding_key)
);

-- CorrectiveAction
create table if not exists public.egp_corrective_actions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.egp_governance_hubs(id) on delete cascade,
  action_key text not null,
  action_title text not null default '',
  action_status text not null default 'open',
  finding_ref text not null default '',
  due_date date,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, action_key)
);

-- AuditEvidence
create table if not exists public.egp_audit_evidence (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.egp_governance_hubs(id) on delete cascade,
  evidence_key text not null,
  evidence_title text not null default '',
  evidence_status text not null default 'pending',
  evidence_type text not null default 'document',
  audit_ref text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, evidence_key)
);

-- AuditAnalytics
create table if not exists public.egp_audit_analytics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.egp_governance_hubs(id) on delete cascade,
  analytics_key text not null,
  analytics_name text not null default '',
  analytics_score numeric(5, 2) not null default 0,
  analytics_type text not null default 'summary',
  measured_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, analytics_key)
);

-- DataClassification
create table if not exists public.egp_data_classification (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.egp_governance_hubs(id) on delete cascade,
  classification_key text not null,
  classification_name text not null default '',
  classification_level text not null default 'internal',
  data_domain text not null default 'general',
  retention_ref text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, classification_key)
);

-- RetentionPolicy
create table if not exists public.egp_retention_policies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.egp_governance_hubs(id) on delete cascade,
  policy_key text not null,
  policy_name text not null default '',
  policy_status text not null default 'active',
  retention_days integer not null default 365,
  data_class_ref text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, policy_key)
);

-- DataLifecycle
create table if not exists public.egp_data_lifecycle (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.egp_governance_hubs(id) on delete cascade,
  lifecycle_key text not null,
  lifecycle_name text not null default '',
  lifecycle_stage text not null default 'active',
  data_domain text not null default 'general',
  transition_policy text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, lifecycle_key)
);

-- DataOwnership
create table if not exists public.egp_data_ownership (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.egp_governance_hubs(id) on delete cascade,
  ownership_key text not null,
  ownership_name text not null default '',
  ownership_status text not null default 'active',
  owner_ref text not null default '',
  data_domain text not null default 'general',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, ownership_key)
);

-- DataQuality
create table if not exists public.egp_data_quality (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.egp_governance_hubs(id) on delete cascade,
  quality_key text not null,
  quality_name text not null default '',
  quality_score numeric(5, 2) not null default 100,
  quality_dimension text not null default 'completeness',
  measured_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, quality_key)
);

-- RiskRegister
create table if not exists public.egp_risk_register (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.egp_governance_hubs(id) on delete cascade,
  risk_key text not null,
  risk_title text not null default '',
  risk_severity text not null default 'medium',
  risk_category text not null default 'operational',
  risk_status text not null default 'open',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, risk_key)
);

-- RiskAssessment
create table if not exists public.egp_risk_assessment (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.egp_governance_hubs(id) on delete cascade,
  assessment_key text not null,
  assessment_title text not null default '',
  assessment_score numeric(5, 2) not null default 0,
  assessment_type text not null default 'qualitative',
  risk_ref text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, assessment_key)
);

-- RiskMitigation
create table if not exists public.egp_risk_mitigation (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.egp_governance_hubs(id) on delete cascade,
  mitigation_key text not null,
  mitigation_title text not null default '',
  mitigation_status text not null default 'planned',
  risk_ref text not null default '',
  effectiveness_score numeric(5, 2) not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, mitigation_key)
);

-- RiskMonitoring
create table if not exists public.egp_risk_monitoring (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.egp_governance_hubs(id) on delete cascade,
  monitoring_key text not null,
  monitoring_name text not null default '',
  monitoring_status text not null default 'active',
  alert_threshold numeric(5, 2) not null default 75,
  risk_ref text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, monitoring_key)
);

-- BusinessContinuity
create table if not exists public.egp_business_continuity (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.egp_governance_hubs(id) on delete cascade,
  continuity_key text not null,
  continuity_name text not null default '',
  continuity_status text not null default 'active',
  recovery_tier text not null default 'tier1',
  rto_hours numeric(8, 2) not null default 4,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, continuity_key)
);

-- GovernanceMetric
create table if not exists public.egp_governance_metrics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  metrics_key text not null,
  metric_date date not null default current_date,
  governance_health_score numeric(5, 2) not null default 100,
  compliance_score numeric(5, 2) not null default 100,
  enterprise_risk_score numeric(5, 2) not null default 0,
  audit_summary_score numeric(5, 2) not null default 100,
  data_governance_health_score numeric(5, 2) not null default 100,
  overall_governance_score numeric(5, 2) not null default 100,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, metrics_key)
);

-- GovernanceHealth
create table if not exists public.egp_governance_health (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  health_key text not null,
  health_date date not null default current_date,
  overall_score numeric(5, 2) not null default 100,
  disaster_recovery_mode boolean not null default false,
  governance_status text not null default 'healthy',
  compliance_status text not null default 'healthy',
  audit_status text not null default 'healthy',
  data_governance_status text not null default 'healthy',
  security_status text not null default 'healthy',
  summary text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, health_key)
);

-- ComplianceDashboard
create table if not exists public.egp_compliance_dashboards (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.egp_governance_hubs(id) on delete cascade,
  dashboard_key text not null,
  dashboard_name text not null default '',
  dashboard_status text not null default 'active',
  compliance_score numeric(5, 2) not null default 0,
  refresh_cadence text not null default 'weekly',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, dashboard_key)
);

-- MissionProgress
create table if not exists public.egp_mission_progress (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.egp_governance_hubs(id) on delete cascade,
  progress_key text not null,
  progress_name text not null default '',
  progress_percent numeric(5, 2) not null default 0,
  mission_ref text not null default '',
  target_date date,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, progress_key)
);

-- GovernanceFailure
create table if not exists public.egp_governance_failures (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.egp_governance_hubs(id) on delete cascade,
  failure_key text not null,
  failure_type text not null default 'governance',
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
create table if not exists public.egp_audit_logs (
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

create index if not exists idx_egp_governance_hubs_org on public.egp_governance_hubs(organization_id);
create index if not exists idx_egp_organization_governance_org on public.egp_organization_governance(organization_id);
create index if not exists idx_egp_organization_governance_hub on public.egp_organization_governance(hub_id);
create index if not exists idx_egp_governance_policies_org on public.egp_governance_policies(organization_id);
create index if not exists idx_egp_governance_policies_hub on public.egp_governance_policies(hub_id);
create index if not exists idx_egp_governance_framework_org on public.egp_governance_framework(organization_id);
create index if not exists idx_egp_governance_framework_hub on public.egp_governance_framework(hub_id);
create index if not exists idx_egp_governance_reviews_org on public.egp_governance_reviews(organization_id);
create index if not exists idx_egp_governance_reviews_hub on public.egp_governance_reviews(hub_id);
create index if not exists idx_egp_governance_dashboards_org on public.egp_governance_dashboards(organization_id);
create index if not exists idx_egp_governance_dashboards_hub on public.egp_governance_dashboards(hub_id);
create index if not exists idx_egp_compliance_framework_org on public.egp_compliance_framework(organization_id);
create index if not exists idx_egp_compliance_framework_hub on public.egp_compliance_framework(hub_id);
create index if not exists idx_egp_compliance_controls_org on public.egp_compliance_controls(organization_id);
create index if not exists idx_egp_compliance_controls_hub on public.egp_compliance_controls(hub_id);
create index if not exists idx_egp_compliance_evidence_org on public.egp_compliance_evidence(organization_id);
create index if not exists idx_egp_compliance_evidence_hub on public.egp_compliance_evidence(hub_id);
create index if not exists idx_egp_compliance_reports_org on public.egp_compliance_reports(organization_id);
create index if not exists idx_egp_compliance_reports_hub on public.egp_compliance_reports(hub_id);
create index if not exists idx_egp_compliance_calendar_org on public.egp_compliance_calendar(organization_id);
create index if not exists idx_egp_compliance_calendar_hub on public.egp_compliance_calendar(hub_id);
create index if not exists idx_egp_audit_center_org on public.egp_audit_center(organization_id);
create index if not exists idx_egp_audit_center_hub on public.egp_audit_center(hub_id);
create index if not exists idx_egp_audit_findings_org on public.egp_audit_findings(organization_id);
create index if not exists idx_egp_audit_findings_hub on public.egp_audit_findings(hub_id);
create index if not exists idx_egp_corrective_actions_org on public.egp_corrective_actions(organization_id);
create index if not exists idx_egp_corrective_actions_hub on public.egp_corrective_actions(hub_id);
create index if not exists idx_egp_audit_evidence_org on public.egp_audit_evidence(organization_id);
create index if not exists idx_egp_audit_evidence_hub on public.egp_audit_evidence(hub_id);
create index if not exists idx_egp_audit_analytics_org on public.egp_audit_analytics(organization_id);
create index if not exists idx_egp_audit_analytics_hub on public.egp_audit_analytics(hub_id);
create index if not exists idx_egp_data_classification_org on public.egp_data_classification(organization_id);
create index if not exists idx_egp_data_classification_hub on public.egp_data_classification(hub_id);
create index if not exists idx_egp_retention_policies_org on public.egp_retention_policies(organization_id);
create index if not exists idx_egp_retention_policies_hub on public.egp_retention_policies(hub_id);
create index if not exists idx_egp_data_lifecycle_org on public.egp_data_lifecycle(organization_id);
create index if not exists idx_egp_data_lifecycle_hub on public.egp_data_lifecycle(hub_id);
create index if not exists idx_egp_data_ownership_org on public.egp_data_ownership(organization_id);
create index if not exists idx_egp_data_ownership_hub on public.egp_data_ownership(hub_id);
create index if not exists idx_egp_data_quality_org on public.egp_data_quality(organization_id);
create index if not exists idx_egp_data_quality_hub on public.egp_data_quality(hub_id);
create index if not exists idx_egp_risk_register_org on public.egp_risk_register(organization_id);
create index if not exists idx_egp_risk_register_hub on public.egp_risk_register(hub_id);
create index if not exists idx_egp_risk_assessment_org on public.egp_risk_assessment(organization_id);
create index if not exists idx_egp_risk_assessment_hub on public.egp_risk_assessment(hub_id);
create index if not exists idx_egp_risk_mitigation_org on public.egp_risk_mitigation(organization_id);
create index if not exists idx_egp_risk_mitigation_hub on public.egp_risk_mitigation(hub_id);
create index if not exists idx_egp_risk_monitoring_org on public.egp_risk_monitoring(organization_id);
create index if not exists idx_egp_risk_monitoring_hub on public.egp_risk_monitoring(hub_id);
create index if not exists idx_egp_business_continuity_org on public.egp_business_continuity(organization_id);
create index if not exists idx_egp_business_continuity_hub on public.egp_business_continuity(hub_id);
create index if not exists idx_egp_governance_metrics_org on public.egp_governance_metrics(organization_id);
create index if not exists idx_egp_governance_health_org on public.egp_governance_health(organization_id);
create index if not exists idx_egp_compliance_dashboards_org on public.egp_compliance_dashboards(organization_id);
create index if not exists idx_egp_compliance_dashboards_hub on public.egp_compliance_dashboards(hub_id);
create index if not exists idx_egp_mission_progress_org on public.egp_mission_progress(organization_id);
create index if not exists idx_egp_mission_progress_hub on public.egp_mission_progress(hub_id);
create index if not exists idx_egp_governance_failures_org on public.egp_governance_failures(organization_id);
create index if not exists idx_egp_governance_failures_hub on public.egp_governance_failures(hub_id);
create index if not exists idx_egp_audit_logs_org on public.egp_audit_logs(organization_id);

do $$
declare tbl text;
begin
  foreach tbl in array array[
    'egp_governance_hubs','egp_organization_governance','egp_governance_policies','egp_governance_framework','egp_governance_reviews','egp_governance_dashboards','egp_compliance_framework','egp_compliance_controls','egp_compliance_evidence','egp_compliance_reports','egp_compliance_calendar','egp_audit_center','egp_audit_findings','egp_corrective_actions','egp_audit_evidence','egp_audit_analytics','egp_data_classification','egp_retention_policies','egp_data_lifecycle','egp_data_ownership','egp_data_quality','egp_risk_register','egp_risk_assessment','egp_risk_mitigation','egp_risk_monitoring','egp_business_continuity','egp_governance_metrics','egp_governance_health','egp_compliance_dashboards','egp_mission_progress','egp_governance_failures'
  ]
  loop
    execute format('drop trigger if exists trg_%I_updated_at on public.%I', tbl, tbl);
    execute format('create trigger trg_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()', tbl, tbl);
  end loop;
end $$;

alter table public.egp_governance_hubs enable row level security;
alter table public.egp_organization_governance enable row level security;
alter table public.egp_governance_policies enable row level security;
alter table public.egp_governance_framework enable row level security;
alter table public.egp_governance_reviews enable row level security;
alter table public.egp_governance_dashboards enable row level security;
alter table public.egp_compliance_framework enable row level security;
alter table public.egp_compliance_controls enable row level security;
alter table public.egp_compliance_evidence enable row level security;
alter table public.egp_compliance_reports enable row level security;
alter table public.egp_compliance_calendar enable row level security;
alter table public.egp_audit_center enable row level security;
alter table public.egp_audit_findings enable row level security;
alter table public.egp_corrective_actions enable row level security;
alter table public.egp_audit_evidence enable row level security;
alter table public.egp_audit_analytics enable row level security;
alter table public.egp_data_classification enable row level security;
alter table public.egp_retention_policies enable row level security;
alter table public.egp_data_lifecycle enable row level security;
alter table public.egp_data_ownership enable row level security;
alter table public.egp_data_quality enable row level security;
alter table public.egp_risk_register enable row level security;
alter table public.egp_risk_assessment enable row level security;
alter table public.egp_risk_mitigation enable row level security;
alter table public.egp_risk_monitoring enable row level security;
alter table public.egp_business_continuity enable row level security;
alter table public.egp_governance_metrics enable row level security;
alter table public.egp_governance_health enable row level security;
alter table public.egp_compliance_dashboards enable row level security;
alter table public.egp_mission_progress enable row level security;
alter table public.egp_governance_failures enable row level security;
alter table public.egp_audit_logs enable row level security;

do $$
declare tbl text;
begin
  foreach tbl in array array[
    'egp_governance_hubs','egp_organization_governance','egp_governance_policies','egp_governance_framework','egp_governance_reviews','egp_governance_dashboards','egp_compliance_framework','egp_compliance_controls','egp_compliance_evidence','egp_compliance_reports','egp_compliance_calendar','egp_audit_center','egp_audit_findings','egp_corrective_actions','egp_audit_evidence','egp_audit_analytics','egp_data_classification','egp_retention_policies','egp_data_lifecycle','egp_data_ownership','egp_data_quality','egp_risk_register','egp_risk_assessment','egp_risk_mitigation','egp_risk_monitoring','egp_business_continuity','egp_governance_metrics','egp_governance_health','egp_compliance_dashboards','egp_mission_progress','egp_governance_failures','egp_audit_logs'
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
  ('egp.view', 'View enterprise governance platform data', 'enterprise_governance_platform'),
  ('egp.manage', 'Manage governance, compliance, audit, data governance, risk, and dashboard outputs', 'enterprise_governance_platform'),
  ('egp.approve', 'Approve enterprise governance gates and actions', 'enterprise_governance_platform'),
  ('egp.admin', 'Administer enterprise governance platform', 'enterprise_governance_platform')
on conflict (key) do update set description = excluded.description, resource = excluded.resource;
