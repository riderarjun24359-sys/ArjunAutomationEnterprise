-- Tighten six ACC module policies so inactive organization memberships cannot
-- continue to access organization-scoped records.
BEGIN;

DROP POLICY IF EXISTS acc_alerts_org ON public.acc_alerts;
CREATE POLICY acc_alerts_org ON public.acc_alerts
  FOR ALL TO authenticated
  USING (public.is_organization_member(organization_id))
  WITH CHECK (public.is_organization_member(organization_id));

DROP POLICY IF EXISTS acc_audit_logs_org ON public.acc_audit_logs;
CREATE POLICY acc_audit_logs_org ON public.acc_audit_logs
  FOR ALL TO authenticated
  USING (public.is_organization_member(organization_id))
  WITH CHECK (public.is_organization_member(organization_id));

DROP POLICY IF EXISTS acc_automations_org ON public.acc_automations;
CREATE POLICY acc_automations_org ON public.acc_automations
  FOR ALL TO authenticated
  USING (public.is_organization_member(organization_id))
  WITH CHECK (public.is_organization_member(organization_id));

DROP POLICY IF EXISTS acc_decisions_org ON public.acc_decisions;
CREATE POLICY acc_decisions_org ON public.acc_decisions
  FOR ALL TO authenticated
  USING (public.is_organization_member(organization_id))
  WITH CHECK (public.is_organization_member(organization_id));

DROP POLICY IF EXISTS acc_health_snapshots_org ON public.acc_health_snapshots;
CREATE POLICY acc_health_snapshots_org ON public.acc_health_snapshots
  FOR ALL TO authenticated
  USING (public.is_organization_member(organization_id))
  WITH CHECK (public.is_organization_member(organization_id));

DROP POLICY IF EXISTS acc_recommendations_org ON public.acc_recommendations;
CREATE POLICY acc_recommendations_org ON public.acc_recommendations
  FOR ALL TO authenticated
  USING (public.is_organization_member(organization_id))
  WITH CHECK (public.is_organization_member(organization_id));

COMMIT;
