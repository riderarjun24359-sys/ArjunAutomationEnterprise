-- Prevent API credential verifier digests from being readable by browser sessions.
--
-- API key creation, verification, rotation and revocation use server-only
-- service-role routes. Tenant members need only non-secret metadata to render
-- the Integration Platform and Security Center dashboards.
--
-- Keep the existing organization-scoped SELECT RLS policy, but expose only
-- safe metadata columns to authenticated users. No browser-side writes are
-- permitted; mutations must use the authenticated server API route.

BEGIN;

ALTER TABLE public.intg_api_keys ENABLE ROW LEVEL SECURITY;

-- Remove table-wide browser privileges, including INSERT/UPDATE/DELETE and
-- SELECT on key_hash. Re-grant SELECT only for the metadata projection used
-- by the browser repository.
REVOKE ALL PRIVILEGES ON TABLE public.intg_api_keys FROM PUBLIC, anon, authenticated;

GRANT SELECT (
  id,
  organization_id,
  hub_id,
  key_name,
  key_prefix,
  api_version,
  expires_at,
  last_used_at,
  status,
  created_at,
  updated_at
) ON TABLE public.intg_api_keys TO authenticated;

-- Server-side API routes require full access for secure credential operations.
GRANT ALL PRIVILEGES ON TABLE public.intg_api_keys TO service_role;

-- The tenant-scoped SELECT policy created by the Integration Platform
-- migration remains in force. Remove browser mutation policies so future
-- privilege changes cannot accidentally re-enable direct client writes.
DROP POLICY IF EXISTS intg_api_keys_insert ON public.intg_api_keys;
DROP POLICY IF EXISTS intg_api_keys_update ON public.intg_api_keys;
DROP POLICY IF EXISTS intg_api_keys_delete ON public.intg_api_keys;

COMMIT;
