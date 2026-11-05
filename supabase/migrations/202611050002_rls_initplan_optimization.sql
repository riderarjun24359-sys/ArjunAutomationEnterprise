-- Query-planning optimization for existing RLS policies.
-- Wrap auth context functions in scalar subqueries so PostgreSQL can evaluate
-- them once per statement instead of once per candidate row. Policy semantics
-- and role scope remain unchanged.
BEGIN;

ALTER POLICY acc_alerts_org ON public.acc_alerts
  USING (organization_id IN (
    SELECT om.organization_id FROM public.organization_members om
    WHERE om.user_id = (SELECT auth.uid())
  ));
ALTER POLICY acc_audit_logs_org ON public.acc_audit_logs
  USING (organization_id IN (
    SELECT om.organization_id FROM public.organization_members om
    WHERE om.user_id = (SELECT auth.uid())
  ));
ALTER POLICY acc_automations_org ON public.acc_automations
  USING (organization_id IN (
    SELECT om.organization_id FROM public.organization_members om
    WHERE om.user_id = (SELECT auth.uid())
  ));
ALTER POLICY acc_decisions_org ON public.acc_decisions
  USING (organization_id IN (
    SELECT om.organization_id FROM public.organization_members om
    WHERE om.user_id = (SELECT auth.uid())
  ));
ALTER POLICY acc_health_snapshots_org ON public.acc_health_snapshots
  USING (organization_id IN (
    SELECT om.organization_id FROM public.organization_members om
    WHERE om.user_id = (SELECT auth.uid())
  ));
ALTER POLICY acc_recommendations_org ON public.acc_recommendations
  USING (organization_id IN (
    SELECT om.organization_id FROM public.organization_members om
    WHERE om.user_id = (SELECT auth.uid())
  ));

ALTER POLICY permissions_select ON public.permissions
  USING ((SELECT auth.role()) = 'authenticated'::text);
ALTER POLICY role_permission_grants_select ON public.role_permission_grants
  USING ((SELECT auth.role()) = 'authenticated'::text);

ALTER POLICY profiles_insert ON public.user_profiles
  WITH CHECK (auth_user_id = (SELECT auth.uid()));
ALTER POLICY profiles_select ON public.user_profiles
  USING (auth_user_id = (SELECT auth.uid()));
ALTER POLICY profiles_update ON public.user_profiles
  USING (auth_user_id = (SELECT auth.uid()));

COMMIT;
