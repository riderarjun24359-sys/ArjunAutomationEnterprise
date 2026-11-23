-- These operational/internal tables are service-role-only. They have no
-- authenticated or anonymous table grants; explicit deny policies preserve
-- that boundary if grants are accidentally broadened in a future migration.
DO $$
DECLARE
    tbl text;
BEGIN
    FOREACH tbl IN ARRAY ARRAY[
    'csg_audit_logs',
    'csg_delivery_milestones',
    'csg_escalations',
    'csg_feedback_responses',
    'csg_improvement_items',
    'csg_onboarding_sessions',
    'csg_renewals',
    'csg_success_plans',
    'de_ai_recommendations',
    'de_analytics_metrics',
    'de_blueprints',
    'de_components',
    'de_engagements',
    'de_knowledge_entries',
    'de_pipeline_runs',
    'de_quality_verifications',
    'eae_agent_tasks',
    'eae_approval_requests',
    'eae_collaboration_events',
    'eae_recommendations',
    'executive_agent_metrics',
    'executive_agents',
    'executive_approvals',
    'executive_audit_logs',
    'executive_collaboration',
    'executive_health',
    'executive_memory',
    'executive_recommendations',
    'executive_tasks',
    'pr_readiness_snapshots',
    'pr_system_alerts',
    'rate_limits'
    ]
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS deny_browser_access ON public.%I', tbl);
        EXECUTE format(
            'CREATE POLICY deny_browser_access ON public.%I FOR ALL TO anon, authenticated USING (false) WITH CHECK (false)',
            tbl
        );
    END LOOP;
END
$$;
