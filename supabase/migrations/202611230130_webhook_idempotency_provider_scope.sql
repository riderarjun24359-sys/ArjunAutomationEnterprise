-- Provider event identifiers are only unique within a provider namespace.
-- The payment receiver deduplicates by (provider, event_id); the database key
-- must enforce the same invariant rather than allowing one provider's event ID
-- to suppress a different provider's event.
BEGIN;

ALTER TABLE public.webhook_idempotency
  DROP CONSTRAINT IF EXISTS webhook_idempotency_pkey;

ALTER TABLE public.webhook_idempotency
  ADD CONSTRAINT webhook_idempotency_pkey PRIMARY KEY (provider, event_id);

COMMIT;
