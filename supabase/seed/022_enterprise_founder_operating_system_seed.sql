insert into public.ai_orchestration_agents (id, organization_id, name, agent_type, workflow_agent_id, provider_id, model_route_id, capabilities, status)
values
  ('a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a309', '11111111-1111-1111-1111-111111111111', 'Founder Operating System Agent', 'founder_os', null, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a201', '["strategic_okrs","revenue_runway","board_reports","founder_insights"]'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.ai_sessions (id, organization_id, agent_id, session_key, module_source, entity_type, entity_id, context, status, expires_at)
values
  ('a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a509', '11111111-1111-1111-1111-111111111111', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a309', 'northstar-fo-001', 'founder_os', 'project', 'ffffffff-ffff-ffff-ffff-ffffffffff01', '{"objective":"founder operating system orchestration"}'::jsonb, 'active', '2026-12-31 23:59:59+00')
on conflict (id) do nothing;

insert into public.knowledge_ai_contexts (id, organization_id, context_key, agent_id, session_id, entry_id, context_payload, status)
values
  ('cb000001-cb00-cb00-cb00-cb0000000008', '11111111-1111-1111-1111-111111111111', 'northstar-fo-context', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a309', 'a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a509', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c10101', '{"includes":["client_memory","project_memory","ba_outputs","sa_outputs","df_outputs","qa_outputs","dd_outputs","cs_outputs","finance_context"]}'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.fo_workspaces (id, organization_id, title, workspace_key, ba_engagement_id, sa_engagement_id, df_engagement_id, qa_engagement_id, dd_engagement_id, cs_engagement_id, client_id, project_id, agent_id, session_id, knowledge_context_id, pipeline_stage, status, summary)
values
  ('f001f001-f001-f001-f001-f001f0010101', '11111111-1111-1111-1111-111111111111', 'Northstar Founder Operating System', 'northstar-founder-os-001', 'b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b10101', 'd1d1d1d1-d1d1-d1d1-d1d1-d1d1d1d10101', 'e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e10101', 'f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f10101', 'dd01dd01-dd01-dd01-dd01-dd01dd010101', 'c501c501-c501-c501-c501-c501c5010101', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee01', 'ffffffff-ffff-ffff-ffff-ffffffffff01', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a309', 'a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a509', 'cb000001-cb00-cb00-cb00-cb0000000008', 'founder_operating_system', 'active', 'Founder operating system workspace orchestrating strategic execution across all AI workers and enterprise modules')
on conflict (id) do nothing;

insert into public.fo_strategic_okrs (id, organization_id, workspace_id, okr_key, title, objective, key_results, quarter, status)
values
  ('f002f002-f002-f002-f002-f002f0020201', '11111111-1111-1111-1111-111111111111', 'f001f001-f001-f001-f001-f001f0010101', 'okr-q4-2026', 'Q4 2026 Strategic OKRs', 'Achieve product-market fit and Series A readiness', '[{"result":"Reach $2M ARR","target":2000000},{"result":"Net revenue retention 110%","target":110}]'::jsonb, 'Q4 2026', 'active')
on conflict (id) do nothing;

insert into public.fo_executive_dashboards (id, organization_id, workspace_id, dashboard_key, name, widgets, refresh_cadence, status)
values
  ('f003f003-f003-f003-f003-f003f0030301', '11111111-1111-1111-1111-111111111111', 'f001f001-f001-f001-f001-f001f0010101', 'exec-dashboard', 'Northstar Executive Dashboard', '[{"widget":"revenue","position":1},{"widget":"runway","position":2},{"widget":"team_capacity","position":3}]'::jsonb, 'daily', 'active')
on conflict (id) do nothing;

insert into public.fo_revenue_runway (id, organization_id, workspace_id, runway_key, name, monthly_burn_usd, cash_balance_usd, runway_months, revenue_forecast, status)
values
  ('f004f004-f004-f004-f004-f004f0040401', '11111111-1111-1111-1111-111111111111', 'f001f001-f001-f001-f001-f001f0010101', 'runway-q4', 'Q4 Revenue Runway', 85000.00, 1275000.00, 15.00, '[{"month":"2026-09","revenue":120000},{"month":"2026-10","revenue":135000}]'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.fo_team_capacity (id, organization_id, workspace_id, capacity_key, name, team_allocations, utilization_percent, status)
values
  ('f005f005-f005-f005-f005-f005f0050501', '11111111-1111-1111-1111-111111111111', 'f001f001-f001-f001-f001-f001f0010101', 'capacity-engineering', 'Engineering Team Capacity', '[{"team":"platform","allocated_pct":60},{"team":"product","allocated_pct":40}]'::jsonb, 82.50, 'active')
on conflict (id) do nothing;

insert into public.fo_product_roadmaps (id, organization_id, workspace_id, roadmap_key, name, initiatives, timeline_quarters, status)
values
  ('f006f006-f006-f006-f006-f006f0060601', '11111111-1111-1111-1111-111111111111', 'f001f001-f001-f001-f001-f001f0010101', 'roadmap-2027', '2027 Product Roadmap', '["enterprise_modules","ai_workers","founder_os"]'::jsonb, '["Q1 2027","Q2 2027","Q3 2027"]'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.fo_investor_relations (id, organization_id, workspace_id, relation_key, investor_name, round, engagement_notes, next_touchpoint, status)
values
  ('f007f007-f007-f007-f007-f007f0070701', '11111111-1111-1111-1111-111111111111', 'f001f001-f001-f001-f001-f001f0010101', 'investor-acme', 'Acme Ventures', 'Series A', 'Strong interest in AI worker platform; requested updated metrics deck', '2026-09-15', 'active')
on conflict (id) do nothing;

insert into public.fo_board_reports (id, organization_id, workspace_id, report_key, title, reporting_period, sections, status)
values
  ('f008f008-f008-f008-f008-f008f0080801', '11111111-1111-1111-1111-111111111111', 'f001f001-f001-f001-f001-f001f0010101', 'board-q3-2026', 'Q3 2026 Board Report', 'Q3 2026', '["financials","product","team","risks","outlook"]'::jsonb, 'draft')
on conflict (id) do nothing;

insert into public.fo_decision_log (id, organization_id, workspace_id, decision_key, title, decision_type, rationale, outcome, status)
values
  ('f009f009-f009-f009-f009-f009f0090901', '11111111-1111-1111-1111-111111111111', 'f001f001-f001-f001-f001-f001f0010101', 'decision-series-a', 'Series A Timing Decision', 'strategic', 'Market conditions favorable; strong pipeline and retention metrics support raise in Q4', 'Proceed with Series A preparation in Q4 2026', 'recorded')
on conflict (id) do nothing;

insert into public.fo_priorities (id, organization_id, workspace_id, priority_key, title, priority_level, owner, due_date, status)
values
  ('f00af00a-f00a-f00a-f00a-f00af00a0a01', '11111111-1111-1111-1111-111111111111', 'f001f001-f001-f001-f001-f001f0010101', 'priority-fundraise', 'Complete Series A data room', 'critical', 'CEO', '2026-10-31', 'open')
on conflict (id) do nothing;

insert into public.fo_resource_allocations (id, organization_id, workspace_id, allocation_key, name, budget_usd, allocations, status)
values
  ('f00bf00b-f00b-f00b-f00b-f00bf00b0b01', '11111111-1111-1111-1111-111111111111', 'f001f001-f001-f001-f001-f001f0010101', 'budget-q4', 'Q4 Resource Allocation', 450000.00, '[{"department":"engineering","amount_usd":280000},{"department":"sales","amount_usd":90000}]'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.fo_risk_register (id, organization_id, workspace_id, risk_key, title, risk_level, mitigation_plan, owner, status)
values
  ('f00cf00c-f00c-f00c-f00c-f00cf00c0c01', '11111111-1111-1111-1111-111111111111', 'f001f001-f001-f001-f001-f001f0010101', 'risk-runway', 'Runway compression if burn increases', 'medium', 'Maintain monthly burn review and extend runway via revenue growth initiatives', 'CFO', 'open')
on conflict (id) do nothing;

insert into public.fo_growth_metrics (id, organization_id, workspace_id, metric_key, name, metric_type, current_value, target_value, growth_rate_percent, status)
values
  ('f00df00d-f00d-f00d-f00d-f00df00d0d01', '11111111-1111-1111-1111-111111111111', 'f001f001-f001-f001-f001-f001f0010101', 'metric-arr', 'Annual Recurring Revenue', 'revenue', 1650000.0000, 2000000.0000, 18.50, 'active')
on conflict (id) do nothing;

insert into public.fo_founder_agenda (id, organization_id, workspace_id, agenda_key, title, scheduled_at, agenda_items, status)
values
  ('f00ef00e-f00e-f00e-f00e-f00ef00e0e01', '11111111-1111-1111-1111-111111111111', 'f001f001-f001-f001-f001-f001f0010101', 'agenda-weekly', 'Weekly Founder Sync', '2026-09-08 14:00:00+00', '["okr_review","runway_update","priority_triage","investor_prep"]'::jsonb, 'scheduled')
on conflict (id) do nothing;

insert into public.fo_stakeholders (id, organization_id, workspace_id, stakeholder_key, name, stakeholder_type, influence_level, engagement_plan, status)
values
  ('f00ff00f-f00f-f00f-f00f-f00ff00f0f01', '11111111-1111-1111-1111-111111111111', 'f001f001-f001-f001-f001-f001f0010101', 'stakeholder-board', 'Board of Directors', 'board', 'high', 'Monthly board updates and quarterly in-person sessions', 'active')
on conflict (id) do nothing;

insert into public.fo_capital_plans (id, organization_id, workspace_id, plan_key, name, funding_target_usd, use_of_funds, timeline, status)
values
  ('f010f010-f010-f010-f010-f010f0101001', '11111111-1111-1111-1111-111111111111', 'f001f001-f001-f001-f001-f001f0010101', 'capital-series-a', 'Series A Capital Plan', 8000000.00, '[{"category":"product","amount_usd":3200000},{"category":"sales","amount_usd":2400000},{"category":"operations","amount_usd":2400000}]'::jsonb, 'Q4 2026 – Q1 2027', 'draft')
on conflict (id) do nothing;

insert into public.fo_company_milestones (id, organization_id, workspace_id, milestone_key, title, target_date, milestone_type, success_criteria, status)
values
  ('f011f011-f011-f011-f011-f011f0111101', '11111111-1111-1111-1111-111111111111', 'f001f001-f001-f001-f001-f001f0010101', 'milestone-series-a', 'Close Series A', '2027-01-31', 'fundraising', 'Signed term sheet and closed round at target valuation', 'planned')
on conflict (id) do nothing;

insert into public.fo_founder_insights (id, organization_id, workspace_id, insight_key, title, insight_type, content, confidence_score, status)
values
  ('f012f012-f012-f012-f012-f012f0121201', '11111111-1111-1111-1111-111111111111', 'f001f001-f001-f001-f001-f001f0010101', 'insight-growth', 'Enterprise module adoption driving expansion', 'strategic', 'Customer success handoffs from DevOps deployments correlate with 40% higher expansion revenue within 90 days', 87.50, 'active')
on conflict (id) do nothing;

insert into public.fo_audit_logs (id, organization_id, entity_type, entity_id, action, summary)
values
  ('fa000001-fa00-fa00-fa00-fa0000000001', '11111111-1111-1111-1111-111111111111', 'workspace', 'f001f001-f001-f001-f001-f001f0010101', 'create', 'Northstar Founder Operating System workspace created from customer success handoff'),
  ('fa000002-fa00-fa00-fa00-fa0000000002', '11111111-1111-1111-1111-111111111111', 'strategic_okr', 'f002f002-f002-f002-f002-f002f0020201', 'generate', 'Q4 2026 strategic OKRs generated from cross-module intelligence')
on conflict (id) do nothing;
