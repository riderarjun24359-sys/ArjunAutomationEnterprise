-- Idempotency for Jarvis outbound briefings and event-triggered calls.
alter table public.ai_voice_call_events
    add column if not exists idempotency_key text;

create unique index if not exists ai_voice_call_events_org_idempotency_unique
    on public.ai_voice_call_events (organization_id, idempotency_key)
    where idempotency_key is not null;
