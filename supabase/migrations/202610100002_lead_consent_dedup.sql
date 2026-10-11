-- Lead consent proof + email dedup (sales_leads).
--
-- STATUS: PREPARED ONLY — NOT APPLIED to any database (local or remote).
-- Apply path: same as 202610100001 (non-production first, then db:verify).
--
-- CONTEXT: public lead intake now requires explicit privacy consent
-- (app/api/launch-kit/contact + src/lib/lead-intake.ts) and dedups on
-- (organization_id, lower(email)) in code. This migration makes both durable:
-- consent columns for proof, and a partial unique index so duplicates are
-- impossible even under concurrent submissions. Runtime code reads these
-- columns only after this migration is applied; until then consent proof
-- lives in the sales audit log (see contact route).
-- NOTE: emails are normalized (trim + lowercase) before insert by
-- normalizeLeadEmail; pre-existing rows with differently-cased duplicates
-- must be cleaned before applying or the unique index build will fail.

alter table public.sales_leads
    add column if not exists consent_given boolean not null default false,
    add column if not exists consent_at timestamptz,
    add column if not exists consent_notice_version text not null default '';

comment on column public.sales_leads.consent_given is 'Privacy-notice consent captured at intake (lead-intake.ts, notice version in consent_notice_version)';
comment on column public.sales_leads.consent_notice_version is 'Version of the privacy notice the lead accepted, e.g. 2026-10-01';

create unique index if not exists sales_leads_org_email_uidx
    on public.sales_leads (organization_id, lower(email))
    where email <> '';
