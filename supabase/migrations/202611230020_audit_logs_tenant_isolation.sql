-- Tighten audit_logs tenant isolation.
--
-- STATUS: PREPARED ONLY — NOT APPLIED to any database.
--
-- The earlier audit remediation allowed organization_id IS NULL for every
-- authenticated user. That made platform-level/public intake audit rows
-- globally readable and allowed browser clients to insert unscoped audit rows.
-- Server-side service-role audit writes remain available because service_role
-- bypasses RLS; those rows must not be exposed to ordinary tenant members.
--
-- Tenant users may only read/create/update/delete audit rows belonging to an
-- organization in which they have an active membership. NULL-tenant rows are
-- intentionally inaccessible to authenticated browser users.

BEGIN;

DROP POLICY IF EXISTS audit_logs_select ON public.audit_logs;
DROP POLICY IF EXISTS audit_logs_insert ON public.audit_logs;
DROP POLICY IF EXISTS audit_logs_update ON public.audit_logs;
DROP POLICY IF EXISTS audit_logs_delete ON public.audit_logs;

CREATE POLICY audit_logs_select
  ON public.audit_logs
  FOR SELECT TO authenticated
  USING (
    organization_id IS NOT NULL
    AND public.is_organization_member(organization_id)
  );

CREATE POLICY audit_logs_insert
  ON public.audit_logs
  FOR INSERT TO authenticated
  WITH CHECK (
    organization_id IS NOT NULL
    AND public.is_organization_member(organization_id)
  );

CREATE POLICY audit_logs_update
  ON public.audit_logs
  FOR UPDATE TO authenticated
  USING (
    organization_id IS NOT NULL
    AND public.is_organization_member(organization_id)
  )
  WITH CHECK (
    organization_id IS NOT NULL
    AND public.is_organization_member(organization_id)
  );

CREATE POLICY audit_logs_delete
  ON public.audit_logs
  FOR DELETE TO authenticated
  USING (
    organization_id IS NOT NULL
    AND public.is_organization_member(organization_id)
  );

COMMIT;
