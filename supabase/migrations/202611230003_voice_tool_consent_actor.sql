-- Voice-tool consent is an explicit system-recorded event, not a human-admin action.
alter table public.ai_voice_contact_consents
    alter column recorded_by drop not null;
