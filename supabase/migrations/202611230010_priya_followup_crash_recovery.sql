-- Fail closed when a dispatcher worker disappears after claiming a follow-up.
-- The provider may already have accepted the call; automatically retrying could call a prospect twice.
--
-- This repository currently has no migration that creates the ai_sales_followups,
-- ai_voice_contact_consents, or ai_sales_suppressions tables. Keep this optional
-- recovery routine inert until the complete consent-aware schema is introduced.
-- The guarded block makes the historical migration chain replayable without
-- creating a callable function whose runtime dependencies do not exist.

DO $migration$
BEGIN
    IF to_regclass('public.ai_sales_followups') IS NULL
       OR to_regclass('public.ai_voice_contact_consents') IS NULL
       OR to_regclass('public.ai_sales_suppressions') IS NULL
       OR to_regclass('public.sales_leads') IS NULL THEN
        RAISE NOTICE 'Skipping AI sales follow-up recovery: prerequisite tables are not installed';
        RETURN;
    END IF;

    EXECUTE $ddl$
        CREATE INDEX IF NOT EXISTS ai_sales_followups_processing_updated_idx
            ON public.ai_sales_followups (updated_at)
            WHERE status = 'processing'
    $ddl$;

    EXECUTE $ddl$
        CREATE OR REPLACE FUNCTION public.claim_due_ai_sales_followups(
            p_organization_id uuid,
            p_limit integer DEFAULT 10
        )
        RETURNS TABLE (
            followup_id uuid,
            organization_id uuid,
            lead_id uuid,
            consent_id uuid,
            phone_number text,
            purpose text,
            idempotency_key text,
            lead_name text,
            company_name text
        )
        LANGUAGE plpgsql
        SECURITY DEFINER
        SET search_path = pg_catalog
        AS $function$
        BEGIN
            IF p_organization_id IS NULL THEN
                RAISE EXCEPTION 'organization_id is required';
            END IF;

            -- An interrupted provider call has an unknown outcome. Never
            -- automatically retry it; require manual reconciliation.
            UPDATE public.ai_sales_followups
               SET status = 'failed',
                   last_error = 'Dispatcher interrupted after claim; provider outcome unknown. Manual review required before retry.',
                   updated_at = now()
             WHERE organization_id = p_organization_id
               AND status = 'processing'
               AND updated_at < now() - interval '15 minutes';

            IF extract(dow FROM now() AT TIME ZONE 'Asia/Kolkata') = 0
               OR extract(hour FROM now() AT TIME ZONE 'Asia/Kolkata') < 9
               OR extract(hour FROM now() AT TIME ZONE 'Asia/Kolkata') >= 19 THEN
                RETURN;
            END IF;

            RETURN QUERY
            WITH candidates AS (
                SELECT f.id
                  FROM public.ai_sales_followups f
                  JOIN public.ai_voice_contact_consents c
                    ON c.id = f.consent_id
                   AND c.organization_id = f.organization_id
                   AND c.phone_number = (
                       SELECT l.phone
                         FROM public.sales_leads l
                        WHERE l.id = f.lead_id
                          AND l.organization_id = f.organization_id
                   )
                   AND c.purpose = f.purpose
                   AND c.revoked_at IS NULL
                   AND c.granted_at <= now()
                   AND c.granted_at >= now() - interval '30 days'
                 WHERE f.organization_id = p_organization_id
                   AND f.status = 'pending'
                   AND f.attempt_count < 5
                   AND f.due_at <= now()
                   AND NOT EXISTS (
                       SELECT 1
                         FROM public.ai_sales_suppressions s
                        WHERE s.organization_id = f.organization_id
                          AND s.phone_number = c.phone_number
                   )
                 ORDER BY f.due_at ASC
                 LIMIT greatest(1, least(coalesce(p_limit, 10), 25))
                 FOR UPDATE OF f SKIP LOCKED
            ),
            claimed AS (
                UPDATE public.ai_sales_followups f
                   SET status = 'processing',
                       attempt_count = f.attempt_count + 1,
                       updated_at = now()
                  FROM candidates x
                 WHERE f.id = x.id
                RETURNING f.*
            )
            SELECT f.id, f.organization_id, f.lead_id, f.consent_id,
                   l.phone, f.purpose, f.idempotency_key,
                   l.lead_name, l.company_name
              FROM claimed f
              JOIN public.sales_leads l
                ON l.id = f.lead_id
               AND l.organization_id = f.organization_id
              JOIN public.ai_voice_contact_consents c
                ON c.id = f.consent_id
               AND c.organization_id = f.organization_id
               AND c.phone_number = l.phone;
        END;
        $function$
    $ddl$;

    EXECUTE 'REVOKE ALL ON FUNCTION public.claim_due_ai_sales_followups(uuid, integer) FROM PUBLIC, anon, authenticated';
    EXECUTE 'GRANT EXECUTE ON FUNCTION public.claim_due_ai_sales_followups(uuid, integer) TO service_role';
END
$migration$;
