insert into public.ai_orchestration_agents (id, organization_id, name, agent_type, workflow_agent_id, provider_id, model_route_id, capabilities, status)
values
  ('a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a306', '11111111-1111-1111-1111-111111111111', 'DevOps Agent', 'devops', null, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a201', '["cicd","deployment","infrastructure"]'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.ai_sessions (id, organization_id, agent_id, session_key, module_source, entity_type, entity_id, context, status, expires_at)
values
  ('a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a506', '11111111-1111-1111-1111-111111111111', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a306', 'northstar-dd-001', 'devops_deployment', 'project', 'ffffffff-ffff-ffff-ffff-ffffffffff01', '{"objective":"devops deployment orchestration"}'::jsonb, 'active', '2026-12-31 23:59:59+00')
on conflict (id) do nothing;

insert into public.knowledge_ai_contexts (id, organization_id, context_key, agent_id, session_id, entry_id, context_payload, status)
values
  ('cb000001-cb00-cb00-cb00-cb0000000005', '11111111-1111-1111-1111-111111111111', 'northstar-dd-context', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a306', 'a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a506', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c10101', '{"includes":["client_memory","project_memory","ba_outputs","sa_outputs","df_outputs","qa_outputs"]}'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.dd_engagements (id, organization_id, title, engagement_key, ba_engagement_id, sa_engagement_id, df_engagement_id, qa_engagement_id, brd_id, frs_id, solution_architecture_id, work_package_id, qa_release_readiness_id, client_id, project_id, agent_id, session_id, knowledge_context_id, pipeline_stage, status, summary)
values
  ('dd01dd01-dd01-dd01-dd01-dd01dd010101', '11111111-1111-1111-1111-111111111111', 'Northstar Platform DevOps Deployment', 'northstar-expansion-dd-001', 'b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b10101', 'd1d1d1d1-d1d1-d1d1-d1d1-d1d1d1d10101', 'e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e10101', 'f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f10101', 'b3b3b3b3-b3b3-b3b3-b3b3-b3b3b3b30101', 'b4b4b4b4-b4b4-b4b4-b4b4-b4b4b4b40101', 'd2d2d2d2-d2d2-d2d2-d2d2-d2d2d2d20101', 'e2e2e2e2-e2e2-e2e2-e2e2-e2e2e2e20101', 'fa00000a-fa00-fa00-fa00-fa000000000a', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee01', 'ffffffff-ffff-ffff-ffff-ffffffffff01', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a306', 'a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a506', 'cb000001-cb00-cb00-cb00-cb0000000005', 'devops_deployment', 'active', 'DevOps deployment orchestration for Northstar platform expansion from QA release readiness handoff')
on conflict (id) do nothing;

insert into public.dd_cicd_pipelines (id, organization_id, engagement_id, pipeline_key, name, platform, stages, triggers, status)
values
  ('dd02dd02-dd02-dd02-dd02-dd02dd020101', '11111111-1111-1111-1111-111111111111', 'dd01dd01-dd01-dd01-dd01-dd01dd010101', 'pipeline-crm-sync', 'CRM-Project Sync CI/CD Pipeline', 'github_actions', '["build","test","staging_deploy","production_deploy"]'::jsonb, '["push:main","pull_request"]'::jsonb, 'draft')
on conflict (id) do nothing;

insert into public.dd_environments (id, organization_id, engagement_id, environment_key, name, environment_type, config, variables, status)
values
  ('dd03dd03-dd03-dd03-dd03-dd03dd030101', '11111111-1111-1111-1111-111111111111', 'dd01dd01-dd01-dd01-dd01-dd01dd010101', 'env-staging', 'Northstar Staging', 'staging', '{"region":"us-east-1","replicas":2}'::jsonb, '["SUPABASE_URL","SUPABASE_ANON_KEY"]'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.dd_infrastructure_templates (id, organization_id, engagement_id, template_key, name, provider, template_type, resources, status)
values
  ('dd04dd04-dd04-dd04-dd04-dd04dd040101', '11111111-1111-1111-1111-111111111111', 'dd01dd01-dd01-dd01-dd01-dd01dd010101', 'infra-crm-sync', 'CRM Sync Infrastructure', 'aws', 'terraform', '["vpc","ecs_cluster","rds","elasticache"]'::jsonb, 'draft')
on conflict (id) do nothing;

insert into public.dd_docker_configs (id, organization_id, engagement_id, config_key, name, base_image, dockerfile_content, compose_services, status)
values
  ('dd05dd05-dd05-dd05-dd05-dd05dd050101', '11111111-1111-1111-1111-111111111111', 'dd01dd01-dd01-dd01-dd01-dd01dd010101', 'docker-sync-api', 'Sync API Container', 'node:20-alpine', 'FROM node:20-alpine\nWORKDIR /app\nCOPY . .\nRUN npm ci --production\nCMD ["node","server.js"]', '["sync-api","sync-worker"]'::jsonb, 'draft')
on conflict (id) do nothing;

insert into public.dd_kubernetes_plans (id, organization_id, engagement_id, plan_key, name, namespace, manifests, resource_limits, status)
values
  ('dd06dd06-dd06-dd06-dd06-dd06dd060101', '11111111-1111-1111-1111-111111111111', 'dd01dd01-dd01-dd01-dd01-dd01dd010101', 'k8s-sync', 'Sync Service Kubernetes Plan', 'northstar-sync', '["Deployment/sync-api","Service/sync-api","Ingress/sync-api"]'::jsonb, '{"cpu":"500m","memory":"512Mi"}'::jsonb, 'draft')
on conflict (id) do nothing;

insert into public.dd_release_orchestrations (id, organization_id, engagement_id, orchestration_key, name, release_steps, dependencies, status)
values
  ('dd07dd07-dd07-dd07-dd07-dd07dd070101', '11111111-1111-1111-1111-111111111111', 'dd01dd01-dd01-dd01-dd01-dd01dd010101', 'release-phase1', 'Phase 1 Release Orchestration', '["pre_deploy_checks","database_migration","deploy_staging","smoke_tests","deploy_production"]'::jsonb, '["qa_release_readiness","deployment_approval"]'::jsonb, 'draft')
on conflict (id) do nothing;

insert into public.dd_rollback_plans (id, organization_id, engagement_id, plan_key, name, rollback_triggers, rollback_steps, recovery_time_minutes, status)
values
  ('dd08dd08-dd08-dd08-dd08-dd08dd080101', '11111111-1111-1111-1111-111111111111', 'dd01dd01-dd01-dd01-dd01-dd01dd010101', 'rollback-sync', 'Sync Service Rollback Plan', '["error_rate_above_5pct","health_check_failure","manual_trigger"]'::jsonb, '["scale_down_new","restore_previous_image","verify_health"]'::jsonb, 15, 'draft')
on conflict (id) do nothing;

insert into public.dd_blue_green_plans (id, organization_id, engagement_id, plan_key, name, blue_environment, green_environment, switch_criteria, status)
values
  ('dd09dd09-dd09-dd09-dd09-dd09dd090101', '11111111-1111-1111-1111-111111111111', 'dd01dd01-dd01-dd01-dd01-dd01dd010101', 'bg-sync-api', 'Sync API Blue-Green Plan', 'northstar-sync-blue', 'northstar-sync-green', '["all_health_checks_pass","error_rate_below_1pct","manual_approval"]'::jsonb, 'draft')
on conflict (id) do nothing;

insert into public.dd_canary_plans (id, organization_id, engagement_id, plan_key, name, canary_percentage, promotion_criteria, rollback_thresholds, status)
values
  ('dd0add0a-dd0a-dd0a-dd0a-dd0add0a0101', '11111111-1111-1111-1111-111111111111', 'dd01dd01-dd01-dd01-dd01-dd01dd010101', 'canary-sync', 'Sync API Canary Plan', 10.00, '["p95_latency_under_200ms","error_rate_under_0.5pct"]'::jsonb, '["error_rate_above_2pct","p95_latency_above_500ms"]'::jsonb, 'draft')
on conflict (id) do nothing;

insert into public.dd_monitoring_integrations (id, organization_id, engagement_id, integration_key, name, provider, metrics, alerts, status)
values
  ('dd0bdd0b-dd0b-dd0b-dd0b-dd0bdd0b0101', '11111111-1111-1111-1111-111111111111', 'dd01dd01-dd01-dd01-dd01-dd01dd010101', 'monitor-sync', 'Sync Service Monitoring', 'datadog', '["sync.api.latency","sync.api.errors","sync.queue.depth"]'::jsonb, '["high_error_rate","latency_sla_breach"]'::jsonb, 'pending')
on conflict (id) do nothing;

insert into public.dd_logging_integrations (id, organization_id, engagement_id, integration_key, name, provider, log_sources, retention_days, status)
values
  ('dd0cdd0c-dd0c-dd0c-dd0c-dd0cdd0c0101', '11111111-1111-1111-1111-111111111111', 'dd01dd01-dd01-dd01-dd01-dd01dd010101', 'logs-sync', 'Sync Service Logging', 'cloudwatch', '["sync-api","sync-worker","ingress"]'::jsonb, 30, 'pending')
on conflict (id) do nothing;

insert into public.dd_health_checks (id, organization_id, engagement_id, check_key, name, endpoint, check_interval_seconds, thresholds, status)
values
  ('dd0ddd0d-dd0d-dd0d-dd0d-dd0ddd0d0101', '11111111-1111-1111-1111-111111111111', 'dd01dd01-dd01-dd01-dd01-dd01dd010101', 'health-sync-api', 'Sync API Health Check', '/api/sync/health', 60, '{"max_latency_ms":200,"min_success_rate":99.5}'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.dd_backup_verifications (id, organization_id, engagement_id, verification_key, name, backup_targets, verification_results, last_verified_at, status)
values
  ('dd0edd0e-dd0e-dd0e-dd0e-dd0edd0e0101', '11111111-1111-1111-1111-111111111111', 'dd01dd01-dd01-dd01-dd01-dd01dd010101', 'backup-db', 'Database Backup Verification', '["supabase_postgres","sync_events_table"]'::jsonb, 'Last backup restore test succeeded in staging', '2026-08-01 12:00:00+00', 'passed')
on conflict (id) do nothing;

insert into public.dd_disaster_recovery_plans (id, organization_id, engagement_id, plan_key, name, rto_minutes, rpo_minutes, recovery_steps, status)
values
  ('dd0fdd0f-dd0f-dd0f-dd0f-dd0fdd0f0101', '11111111-1111-1111-1111-111111111111', 'dd01dd01-dd01-dd01-dd01-dd01dd010101', 'dr-northstar', 'Northstar Disaster Recovery Plan', 60, 15, '["failover_dns","restore_database","redeploy_services","verify_integrations"]'::jsonb, 'draft')
on conflict (id) do nothing;

insert into public.dd_cost_estimates (id, organization_id, engagement_id, estimate_key, name, monthly_cost_usd, cost_breakdown, status)
values
  ('dd10dd10-dd10-dd10-dd10-dd10dd100101', '11111111-1111-1111-1111-111111111111', 'dd01dd01-dd01-dd01-dd01-dd01dd010101', 'cost-phase1', 'Phase 1 Infrastructure Cost', 2450.00, '[{"service":"ECS","cost_usd":800},{"service":"RDS","cost_usd":650},{"service":"CloudWatch","cost_usd":200},{"service":"DataTransfer","cost_usd":800}]'::jsonb, 'draft')
on conflict (id) do nothing;

insert into public.dd_deployment_approvals (id, organization_id, engagement_id, approval_key, title, approver_role, approval_criteria, status)
values
  ('dd11dd11-dd11-dd11-dd11-dd11dd110101', '11111111-1111-1111-1111-111111111111', 'dd01dd01-dd01-dd01-dd01-dd01dd010101', 'approval-phase1', 'Phase 1 Production Deployment Approval', 'release_manager', '["QA release readiness passed","Rollback plan verified","Monitoring configured"]'::jsonb, 'pending')
on conflict (id) do nothing;

insert into public.dd_release_versions (id, organization_id, engagement_id, version_key, version_number, release_notes, changelog, status)
values
  ('dd12dd12-dd12-dd12-dd12-dd12dd120101', '11111111-1111-1111-1111-111111111111', 'dd01dd01-dd01-dd01-dd01-dd01dd010101', 'version-1.0.0', '1.0.0', 'Initial CRM-Project sync release with DevOps pipeline', '["CRM sync API","Sync status panel","RLS policies"]'::jsonb, 'draft')
on conflict (id) do nothing;

insert into public.dd_audit_logs (id, organization_id, entity_type, entity_id, action, summary)
values
  ('da000001-da00-da00-da00-da0000000001', '11111111-1111-1111-1111-111111111111', 'engagement', 'dd01dd01-dd01-dd01-dd01-dd01dd010101', 'create', 'Northstar Platform DevOps engagement created from QA handoff'),
  ('da000002-da00-da00-da00-da0000000002', '11111111-1111-1111-1111-111111111111', 'cicd_pipeline', 'dd02dd02-dd02-dd02-dd02-dd02dd020101', 'generate', 'CRM-Project sync CI/CD pipeline generated from QA release readiness')
on conflict (id) do nothing;
