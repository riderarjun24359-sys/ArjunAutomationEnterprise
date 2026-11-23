-- Index the nullable webhook foreign key independently of the
-- organization-first idempotency index so webhook deletion can locate its
-- delivery rows without a full table scan.
CREATE INDEX IF NOT EXISTS integration_deliveries_webhook_id_idx
  ON public.integration_deliveries (webhook_id)
  WHERE webhook_id IS NOT NULL;
