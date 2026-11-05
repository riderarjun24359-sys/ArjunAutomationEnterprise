-- Production-only security hardening.
-- Keep authenticated execution for helper functions used by existing RLS policies.
BEGIN;

ALTER FUNCTION public.set_updated_at() SET search_path = pg_catalog;
ALTER FUNCTION public.auth_profile_id() SET search_path = pg_catalog;
ALTER FUNCTION public.is_organization_member(uuid) SET search_path = pg_catalog;

REVOKE EXECUTE ON FUNCTION public.auth_profile_id() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.auth_profile_id() TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.is_organization_member(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_organization_member(uuid) TO authenticated, service_role;

DO $$
DECLARE
  item record;
BEGIN
  -- TRUNCATE bypasses row-level security. Trigger/reference privileges are
  -- not required by the browser-facing anon/authenticated roles.
  FOR item IN
    SELECT c.relname
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relkind IN ('r', 'p')
  LOOP
    EXECUTE format(
      'REVOKE TRUNCATE, TRIGGER, REFERENCES ON TABLE %I.%I FROM anon, authenticated',
      'public', item.relname
    );
  END LOOP;

  -- These RLS-enabled tables intentionally have no policies. Remove direct
  -- API-role privileges; service_role and object owners are unchanged.
  FOR item IN
    SELECT c.relname
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relkind IN ('r', 'p')
      AND c.relrowsecurity
      AND NOT EXISTS (
        SELECT 1
        FROM pg_policies p
        WHERE p.schemaname = 'public'
          AND p.tablename = c.relname
      )
  LOOP
    EXECUTE format(
      'REVOKE ALL PRIVILEGES ON TABLE %I.%I FROM anon, authenticated',
      'public', item.relname
    );
  END LOOP;
END
$$;

COMMIT;
