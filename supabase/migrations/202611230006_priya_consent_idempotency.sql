-- Prevent duplicate verbal-consent rows when Vapi/Retell retries a tool call.
create unique index if not exists ai_voice_contact_consents_interaction_unique
    on public.ai_voice_contact_consents (
        organization_id,
        phone_number,
        purpose,
        evidence_reference
    );
