-- Keep reversible webhook signing secrets server-only.
--
-- Outbound webhook delivery requires the secret on trusted server code. Browser
-- dashboards need only endpoint metadata and delivery state. Organization RLS
-- remains the row-level boundary; column privileges prevent a tenant member
-- from reading the signing secret even within their own organization.

BEGIN;

REVOKE SELECT ON TABLE public.integration_webhooks FROM PUBLIC, anon, authenticated;

GRANT SELECT (
  id,
  organization_id,
  name,
  url,
  allowed_hosts,
  is_active,
  created_at,
  updated_at
) ON TABLE public.integration_webhooks TO authenticated;

GRANT SELECT ON TABLE public.integration_webhooks TO service_role;

COMMIT;
