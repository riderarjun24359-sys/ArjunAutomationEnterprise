-- Correlate sales call history to the provider call event so webhook retries
-- and later analysis events enrich one CRM row instead of creating duplicates.
alter table public.sales_call_logs
    add column if not exists voice_call_event_id uuid
    references public.ai_voice_call_events(id) on delete set null;

create unique index if not exists sales_call_logs_voice_call_event_unique
    on public.sales_call_logs (voice_call_event_id)
    where voice_call_event_id is not null;
