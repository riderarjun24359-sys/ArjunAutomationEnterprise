-- All integration webhook writes are server-mediated.
--
-- Browser clients can read tenant-scoped endpoint/delivery metadata only.
-- Creation, activation, delivery claims, and delivery state transitions run
-- through authenticated server routes using the service role. This prevents
-- ordinary organization members from bypassing integrationManage checks or
-- tampering with signing secrets and delivery history.

BEGIN;

REVOKE INSERT, UPDATE, DELETE ON TABLE public.integration_webhooks
  FROM PUBLIC, anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON TABLE public.integration_deliveries
  FROM PUBLIC, anon, authenticated;

REVOKE SELECT ON TABLE public.integration_deliveries
  FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.integration_deliveries TO authenticated;

GRANT ALL PRIVILEGES ON TABLE public.integration_webhooks TO service_role;
GRANT ALL PRIVILEGES ON TABLE public.integration_deliveries TO service_role;

COMMIT;
