-- Module-table tenant access: grant minimal org-scoped policies to the tables that
-- back genuinely implemented, customer-facing modules, and KEEP everything else
-- locked.
--
-- STATUS: PREPARED / HELD — NOT APPLIED to any database. Apply staging-first
-- with the other prepared hardening migrations (see
-- docs/STAGING_TO_PRODUCTION_MIGRATION_PROCEDURE.md, step 7). Idempotent
-- (DROP IF EXISTS first); no data prerequisite.
--
-- WHY: 30 module tables ship with RLS enabled but ZERO policies (full deny —
-- confirmed by `npm run rls:audit`: "no policies at all"). That is the secure
-- posture, but it makes the browser (RLS) reads of wired-up module dashboards
-- return empty. This migration enables exactly the tables whose repositories
-- filter every query by organization_id AND whose dashboards are reachable UI
-- routes — nothing more.
--
-- INCLUDED (20) — every repository query carries .eq("organization_id", orgId):
--   Customer Success / Global Ops (route: /(shell)/global-operations, service:
--   customer-success-global-ops.service.ts, repo:
--   customer-success-global-ops-repository.ts) — reads 7 tables, writes plans /
--   improvement items / audit log:
--     csg_success_plans, csg_onboarding_sessions, csg_delivery_milestones,
--     csg_feedback_responses, csg_escalations, csg_renewals,
--     csg_improvement_items, csg_audit_logs
--   Delivery Engine (route: /(shell)/delivery-engine, service:
--   delivery-engine-orchestrator.service.ts, repo: delivery-engine-repository.ts)
--   — reads all 8, writes blueprints/engagements/runs/verifications/knowledge/
--   metrics/recommendations:
--     de_blueprints, de_components, de_engagements, de_pipeline_runs,
--     de_quality_verifications, de_knowledge_entries, de_analytics_metrics,
--     de_ai_recommendations
--   Executive AI (routes: /(shell)/executive-ai and /(shell)/executive-ai-ecosystem,
--   service: executive-ai-service.ts, repo: executive-ai-repository.ts) — reads
--   recommendations + pending approvals; writes recommendations / collaboration /
--   audit:
--     executive_recommendations, executive_collaboration,
--     executive_audit_logs, executive_approvals
--
-- KEPT LOCKED (10) — no policy added, stays full deny:
--   eae_agent_tasks, eae_recommendations, eae_collaboration_events,
--   eae_approval_requests — module @deprecated (executive-ai-ecosystem re-exports
--   executive-ai); ZERO references in src.
--   pr_readiness_snapshots, pr_system_alerts — production-readiness.service.ts
--   computes its snapshot fully in memory; the tables are never read or written
--   by app code (referenced only by a verifier script checking the migration text).
--   executive_agents, executive_tasks, executive_agent_metrics, executive_health,
--   executive_memory — present only as dead TABLE-map constants in
--   executive-ai-repository.ts; no method and no other file consumes them (the
--   one "executive_health" string elsewhere is an audit-log label, hitting the
--   separate, already-scoped aix_executive_health table).
--
-- POLICY SHAPE per included table (repo-standard, TO authenticated — so the
-- browser client carrying the user's JWT is covered, anon stays denied):
--   {table}_select  FOR SELECT USING (is_organization_member(organization_id))
--   {table}_insert  FOR INSERT WITH CHECK (is_organization_member(organization_id))
--   {table}_update  FOR UPDATE USING (...) WITH CHECK (...)
-- No DELETE policy is created: no repository or service issues .delete() on any
-- of these tables (verified), so delete stays deny-by-default. Writes always
-- require the row's organization_id to be an org the caller actively belongs to.
--
-- NEGATIVE CONTROLS (scripts/verify-rls-isolation.mjs, "module tables" block):
-- per-group fixtures in two orgs; same-tenant positive reads, cross-tenant
-- SELECT/INSERT/UPDATE denied, memberless sees nothing, platform admin keeps
-- cross-org visibility; plus a policy-shape assertion over all 20 tables.

do $$
declare
    tbl text;
begin
    foreach tbl in array array[
        'csg_success_plans', 'csg_onboarding_sessions', 'csg_delivery_milestones',
        'csg_feedback_responses', 'csg_escalations', 'csg_renewals',
        'csg_improvement_items', 'csg_audit_logs',
        'de_blueprints', 'de_components', 'de_engagements', 'de_pipeline_runs',
        'de_quality_verifications', 'de_knowledge_entries', 'de_analytics_metrics',
        'de_ai_recommendations',
        'executive_recommendations', 'executive_collaboration',
        'executive_audit_logs', 'executive_approvals'
    ]
    loop
        execute format('drop policy if exists %I_select on public.%I', tbl, tbl);
        execute format(
            'create policy %I_select on public.%I for select to authenticated using (public.is_organization_member(organization_id))',
            tbl, tbl
        );

        execute format('drop policy if exists %I_insert on public.%I', tbl, tbl);
        execute format(
            'create policy %I_insert on public.%I for insert to authenticated with check (public.is_organization_member(organization_id))',
            tbl, tbl
        );

        execute format('drop policy if exists %I_update on public.%I', tbl, tbl);
        execute format(
            'create policy %I_update on public.%I for update to authenticated using (public.is_organization_member(organization_id)) with check (public.is_organization_member(organization_id))',
            tbl, tbl
        );
    end loop;
end
$$;
