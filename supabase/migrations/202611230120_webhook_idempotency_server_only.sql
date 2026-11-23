-- The inbound payment webhook dedupe table is an internal implementation
-- detail. It has a deny-all RLS policy, and must also have no browser grants
-- so a future policy change cannot accidentally expose provider event IDs.
-- The payment webhook route accesses it only through the service-role client.

BEGIN;

REVOKE ALL PRIVILEGES ON TABLE public.webhook_idempotency
  FROM PUBLIC, anon, authenticated;

GRANT ALL PRIVILEGES ON TABLE public.webhook_idempotency TO service_role;

COMMIT;
