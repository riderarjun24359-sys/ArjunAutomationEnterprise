insert into public.ba_engagements (id, organization_id, title, engagement_key, client_id, project_id, agent_id, session_id, knowledge_context_id, pipeline_stage, status, summary)
values
  ('b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b10101', '11111111-1111-1111-1111-111111111111', 'Northstar Platform Expansion Analysis', 'northstar-expansion-ba-001', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee01', 'ffffffff-ffff-ffff-ffff-ffffffffff01', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a301', 'a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a501', 'cb000001-cb00-cb00-cb00-cb0000000001', 'requirement_interview', 'active', 'Enterprise requirement discovery for Northstar Labs platform expansion')
on conflict (id) do nothing;

insert into public.ba_interviews (id, organization_id, engagement_id, interview_key, stakeholder_name, questions, responses, status, conducted_at)
values
  ('b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b20101', '11111111-1111-1111-1111-111111111111', 'b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b10101', 'stakeholder-kickoff', 'Mina Park', '["What are the top 3 business objectives?","What systems must integrate?","What is the target go-live date?"]'::jsonb, '["Automate workflow onboarding","CRM and project management","Q4 2026"]'::jsonb, 'completed', '2026-08-01 09:00:00+00')
on conflict (id) do nothing;

insert into public.ba_brds (id, organization_id, engagement_id, title, executive_summary, business_objectives, scope_overview, content, status, current_version)
values
  ('b3b3b3b3-b3b3-b3b3-b3b3-b3b3b3b30101', '11111111-1111-1111-1111-111111111111', 'b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b10101', 'Northstar Platform Expansion BRD', 'Northstar Labs requires platform expansion to support enterprise workflow automation.', 'Reduce manual onboarding by 60%, integrate CRM and project systems, enable self-service training.', 'Phase 1: API integration. Phase 2: Migration. Phase 3: Training.', 'Full BRD content for Northstar expansion initiative.', 'draft', 1)
on conflict (id) do nothing;

insert into public.ba_frs_documents (id, organization_id, engagement_id, brd_id, title, functional_requirements, non_functional_requirements, content, status)
values
  ('b4b4b4b4-b4b4-b4b4-b4b4-b4b4b4b40101', '11111111-1111-1111-1111-111111111111', 'b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b10101', 'b3b3b3b3-b3b3-b3b3-b3b3-b3b3b3b30101', 'Northstar Platform Expansion FRS', 'FR-001: CRM client sync. FR-002: Project milestone tracking. FR-003: Training module access.', 'NFR-001: 99.9% uptime. NFR-002: Sub-200ms API response. NFR-003: SOC2 compliance.', 'Detailed functional and non-functional requirements.', 'draft')
on conflict (id) do nothing;

insert into public.ba_user_stories (id, organization_id, engagement_id, frs_id, story_key, title, description, persona, priority, status)
values
  ('b5b5b5b5-b5b5-b5b5-b5b5-b5b5b5b50101', '11111111-1111-1111-1111-111111111111', 'b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b10101', 'b4b4b4b4-b4b4-b4b4-b4b4-b4b4b4b40101', 'US-001', 'CRM Client Sync', 'As a CRM admin, I want client data to sync automatically so that project teams have current information.', 'CRM Administrator', 'high', 'draft'),
  ('b5b5b5b5-b5b5-b5b5-b5b5-b5b5b5b50202', '11111111-1111-1111-1111-111111111111', 'b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b10101', 'b4b4b4b4-b4b4-b4b4-b4b4-b4b4b4b40101', 'US-002', 'Training Self-Service', 'As a Northstar user, I want self-service training modules so that I can onboard without scheduled sessions.', 'End User', 'medium', 'draft')
on conflict (id) do nothing;

insert into public.ba_acceptance_criteria (id, organization_id, user_story_id, criterion_key, description, test_scenario, status)
values
  ('b6b6b6b6-b6b6-b6b6-b6b6-b6b6b6b60101', '11111111-1111-1111-1111-111111111111', 'b5b5b5b5-b5b5-b5b5-b5b5-b5b5b5b50101', 'AC-001', 'Client record updates in CRM reflect in project module within 5 minutes', 'Update client name in CRM and verify project view shows new name', 'draft'),
  ('b6b6b6b6-b6b6-b6b6-b6b6-b6b6b6b60202', '11111111-1111-1111-1111-111111111111', 'b5b5b5b5-b5b5-b5b5-b5b5-b5b5b5b50202', 'AC-002', 'User completes onboarding module and receives completion certificate', 'Enroll user, complete all modules, verify certificate generated', 'draft')
on conflict (id) do nothing;

insert into public.ba_process_maps (id, organization_id, engagement_id, name, process_type, steps, description, status)
values
  ('b7b7b7b7-b7b7-b7b7-b7b7-b7b7b7b70101', '11111111-1111-1111-1111-111111111111', 'b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b10101', 'Current Client Onboarding', 'as_is', '["Lead qualification","Manual data entry","Kickoff meeting","Training scheduling"]'::jsonb, 'Existing manual onboarding process for enterprise clients', 'draft')
on conflict (id) do nothing;

insert into public.ba_gap_analyses (id, organization_id, engagement_id, current_state, desired_state, gaps, recommendations, status)
values
  ('b8b8b8b8-b8b8-b8b8-b8b8-b8b8b8b80101', '11111111-1111-1111-1111-111111111111', 'b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b10101', 'Manual CRM-to-project data transfer', 'Automated real-time sync with audit trail', '["No API integration","No sync monitoring","Manual reconciliation required"]'::jsonb, 'Implement bidirectional CRM-project sync with event logging', 'draft')
on conflict (id) do nothing;

insert into public.ba_feature_priorities (id, organization_id, engagement_id, feature_name, priority_score, priority_rank, rationale, status)
values
  ('b9b9b9b9-b9b9-b9b9-b9b9-b9b9b9b90101', '11111111-1111-1111-1111-111111111111', 'b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b10101', 'CRM-Project Sync', 95.00, 1, 'Critical path for data consistency across modules', 'approved'),
  ('b9b9b9b9-b9b9-b9b9-b9b9-b9b9b9b90202', '11111111-1111-1111-1111-111111111111', 'b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b10101', 'Self-Service Training', 72.00, 2, 'Reduces onboarding cost but not blocking for go-live', 'proposed')
on conflict (id) do nothing;

insert into public.ba_risks (id, organization_id, engagement_id, risk_key, title, description, likelihood, impact, mitigation, status)
values
  ('ba000001-ba00-ba00-ba00-ba0000000001', '11111111-1111-1111-1111-111111111111', 'b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b10101', 'RISK-001', 'Data Migration Complexity', 'Legacy client data may require extensive transformation before sync', 'medium', 'high', 'Conduct data audit and create migration playbook before Phase 2', 'open')
on conflict (id) do nothing;

insert into public.ba_stakeholders (id, organization_id, engagement_id, name, role, influence, interest, contact_info, status)
values
  ('ba000002-ba00-ba00-ba00-ba0000000001', '11111111-1111-1111-1111-111111111111', 'b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b10101', 'Mina Park', 'VP Operations', 'high', 'high', 'mina.park@northstarlabs.io', 'active'),
  ('ba000002-ba00-ba00-ba00-ba0000000002', '11111111-1111-1111-1111-111111111111', 'b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b10101', 'James Chen', 'IT Director', 'high', 'medium', 'james.chen@northstarlabs.io', 'active')
on conflict (id) do nothing;

insert into public.ba_scope_items (id, organization_id, engagement_id, item_key, title, scope_type, description, status)
values
  ('ba000003-ba00-ba00-ba00-ba0000000001', '11111111-1111-1111-1111-111111111111', 'b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b10101', 'SCOPE-001', 'CRM-Project API Integration', 'in_scope', 'Bidirectional sync between CRM clients and project entities', 'active'),
  ('ba000003-ba00-ba00-ba00-ba0000000002', '11111111-1111-1111-1111-111111111111', 'b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b10101', 'SCOPE-002', 'Legacy ERP Migration', 'out_of_scope', 'Full ERP replacement deferred to Phase 3', 'active')
on conflict (id) do nothing;

insert into public.ba_proposals (id, organization_id, engagement_id, title, executive_summary, deliverables, content, status)
values
  ('ba000004-ba00-ba00-ba00-ba0000000001', '11111111-1111-1111-1111-111111111111', 'b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b10101', 'Northstar Expansion Proposal', 'Phased platform expansion delivering CRM integration, migration, and training by Q4 2026.', 'BRD, FRS, user stories, implementation plan, training program', 'Full proposal document for Northstar Labs expansion.', 'draft')
on conflict (id) do nothing;

insert into public.ba_cost_estimates (id, organization_id, engagement_id, estimate_key, line_items, total_amount, currency, assumptions, status)
values
  ('ba000005-ba00-ba00-ba00-ba0000000001', '11111111-1111-1111-1111-111111111111', 'b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b10101', 'initial-estimate', '[{"item":"API Integration","amount":45000},{"item":"Migration","amount":32000},{"item":"Training","amount":18000}]'::jsonb, 95000.00, 'USD', 'Based on 3-phase delivery over 6 months', 'draft')
on conflict (id) do nothing;

insert into public.ba_timeline_estimates (id, organization_id, engagement_id, estimate_key, phases, total_duration_days, assumptions, status)
values
  ('ba000006-ba00-ba00-ba00-ba0000000001', '11111111-1111-1111-1111-111111111111', 'b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b10101', 'initial-timeline', '[{"phase":"API Integration","days":45},{"phase":"Migration","days":60},{"phase":"Training","days":30}]'::jsonb, 135, 'Assumes dedicated team of 4 engineers', 'draft')
on conflict (id) do nothing;

insert into public.ba_requirement_versions (id, organization_id, engagement_id, entity_type, entity_id, version_number, content, change_summary)
values
  ('ba000007-ba00-ba00-ba00-ba0000000001', '11111111-1111-1111-1111-111111111111', 'b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b10101', 'brd', 'b3b3b3b3-b3b3-b3b3-b3b3-b3b3b3b30101', 1, 'Initial BRD draft for Northstar expansion', 'Created from stakeholder interview')
on conflict (id) do nothing;

insert into public.ba_review_approvals (id, organization_id, engagement_id, entity_type, entity_id, reviewer_id, approval_status, comments, reviewed_at)
values
  ('ba000008-ba00-ba00-ba00-ba0000000001', '11111111-1111-1111-1111-111111111111', 'b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b10101', 'brd', 'b3b3b3b3-b3b3-b3b3-b3b3-b3b3b3b30101', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c01', 'pending', 'Awaiting stakeholder review', null)
on conflict (id) do nothing;

insert into public.ba_audit_logs (id, organization_id, entity_type, entity_id, action, summary)
values
  ('ba000009-ba00-ba00-ba00-ba0000000001', '11111111-1111-1111-1111-111111111111', 'engagement', 'b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b10101', 'create', 'Northstar Platform Expansion engagement created'),
  ('ba000009-ba00-ba00-ba00-ba0000000002', '11111111-1111-1111-1111-111111111111', 'interview', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b20101', 'complete', 'Stakeholder kickoff interview completed')
on conflict (id) do nothing;
