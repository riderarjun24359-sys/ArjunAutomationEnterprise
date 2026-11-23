-- Remove any inherited/public browser grants on audit history, then grant
-- only tenant-scoped read and append operations to authenticated users.
BEGIN;
REVOKE ALL PRIVILEGES ON TABLE public.audit_logs FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT ON TABLE public.audit_logs TO authenticated;
COMMIT;
