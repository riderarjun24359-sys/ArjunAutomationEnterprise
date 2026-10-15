-- Migration preflight for 202610100002_lead_consent_dedup (READ-ONLY).
--
-- Run these against the target database BEFORE applying. They mutate
-- nothing. Stop and resolve any non-zero conflict count first: the
-- migration's partial unique index cannot build while case-variant
-- duplicates exist, and production rows must never be deleted to force it.
--
-- 1. Do the consent columns already exist? (0 rows = not applied)
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'sales_leads'
  AND column_name IN ('consent_given', 'consent_at', 'consent_notice_version');

-- 2. Does the dedup index already exist? (0 rows = not applied)
SELECT indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public' AND indexname = 'sales_leads_org_email_uidx';

-- 3. Case-variant duplicates that would BLOCK the unique index build.
-- Any row here must be merged by a human (keep earliest, preserve consent
-- proof from sales_audit_logs) — never bulk-deleted.
SELECT organization_id, lower(email) AS normalized_email, count(*), array_agg(id) AS lead_ids
FROM public.sales_leads
WHERE email <> ''
GROUP BY organization_id, lower(email)
HAVING count(*) > 1;

-- 4. Rows with blank emails (excluded from the partial index; informational).
SELECT count(*) AS blank_email_rows
FROM public.sales_leads
WHERE email = '';

-- 5. Leads lacking consent proof in the audit log (informational; these
-- predate mandatory consent and must not be contacted until re-consented).
SELECT count(*) AS leads_without_consent_proof
FROM public.sales_leads l
WHERE NOT EXISTS (
    SELECT 1 FROM public.sales_audit_logs a
    WHERE a.entity_type = 'lead' AND a.entity_id = l.id
);
