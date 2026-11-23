-- Make outbound webhook idempotency atomic across concurrent delivery requests.
--
-- Requires 202610120005_integration_webhooks.sql to be applied first.
-- Existing duplicate non-empty keys are not silently removed: the unique index
-- creation fails safely and requires operator reconciliation before retry.
--
-- "pending" is inserted before the outbound HTTP side effect. The row is then
-- finalized as delivered/failed, allowing concurrent requests to observe an
-- in-progress claim instead of sending duplicate webhook events.

BEGIN;

ALTER TABLE public.integration_deliveries
  DROP CONSTRAINT IF EXISTS integration_deliveries_status_check;

ALTER TABLE public.integration_deliveries
  ADD CONSTRAINT integration_deliveries_status_check
  CHECK (status IN ('pending', 'delivered', 'failed'));

ALTER TABLE public.integration_deliveries
  ALTER COLUMN attempts SET DEFAULT 0;

CREATE UNIQUE INDEX IF NOT EXISTS integration_deliveries_org_hook_idempotency_uidx
  ON public.integration_deliveries (organization_id, webhook_id, idempotency_key)
  WHERE webhook_id IS NOT NULL AND idempotency_key <> '';

COMMIT;
