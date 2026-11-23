-- Tenant audit history is append-only. Authenticated browser users may
-- read and insert tenant-scoped audit rows, but cannot rewrite or erase them.
BEGIN;

DROP POLICY IF EXISTS audit_logs_update ON public.audit_logs;
DROP POLICY IF EXISTS audit_logs_delete ON public.audit_logs;

REVOKE UPDATE, DELETE ON TABLE public.audit_logs FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT ON TABLE public.audit_logs TO authenticated;

COMMIT;
