# Owner Actions — Arjun Automation Enterprise

The site is live and healthy. Everything below is **optional / provider-gated** and does not
affect `https://www.arjunautomations.com` serving normally. Do the items in order; each section
says exactly where the work happens. **No secret values are recorded here — names only.**

Conventions: Vercel project = `arjunautomationos-enterprise` (team `arjun-automation`);
repo = `riderarjun24359-sys/ArjunAutomationEnterprise`. Runtime env vars live in
Vercel → project → Settings → Environment Variables (`production` scope, redeploy after changing).
Repo secrets live in GitHub → repo → Settings → Secrets and variables → Actions → Secrets
(needed only by the manual `production-deploy.yml` path; Git auto-deploy does not use them).

---

## 1. Email provider (clears `email_provider`; `ready` stays false without it)

**Do locally (no login needed):** nothing — templates (`welcome`, `verify-email`,
`invite-teammate`, `password-reset`), the config gate (`src/lib/email-config.ts`,
`src/lib/production-email.ts`), and the real fail-closed sender
(`src/lib/email-delivery.ts`, Resend HTTP API via `fetch`, no new dependency) are implemented and
tested. The sender returns `not_configured` and makes **no network call** until a key is set, and
only reports success when the provider returns a message id. It is wired best-effort into the
invitation route (`/api/organization/invitations` POST): a skipped/failed notification never fails
the request.

**Owner dashboard work (pick ONE provider):**

- **Option A — Resend (recommended):** at https://resend.com → API Keys → create key;
  Domains → add + verify `arjunautomations.com` (make the DNS records in §4 first).
  Then set:
  - Vercel `production`: `RESEND_API_KEY`, `RESEND_FROM` (e.g. `noreply@arjunautomations.com`)
  - Repo secret: `RESEND_API_KEY` (only needed for CI verification)
- **Option B — SMTP:** from any SMTP provider, then set:
  - Vercel `production`: `SMTP_HOST`, `SMTP_PORT` (default `587`; must be 1–65535),
    `SMTP_USER`, `SMTP_PASS` (**this exact name** — the code does not read `SMTP_PASSWORD`),
    `SMTP_FROM` (or `EMAIL_FROM`)
  - Repo secrets: same names as needed for CI

**Verify (safe, sends nothing):** `npm run launch-email:verify` locally;
live: `/api/ops/cutover` `email_provider` flips to pass. No unsolicited mail is ever sent by
verification — the repo contains templates, gates, and a per-recipient sender only; there is no
bulk sender.

## 2. Payment provider (clears `payments_gateway`; pick ONE — Stripe or Razorpay)

**Do locally:** nothing — both webhook paths verify signatures and fail closed
(`app/api/payments/webhook/route.ts`, tested 11/11 in `webhook-idempotency.test.ts`).
Settlement stays `manual-reconciliation` (human confirms in Finance) until real events flow.

**Owner dashboard work:**

- **Stripe:** at https://dashboard.stripe.com → Developers → API keys (copy secret +
  publishable) → Webhooks → Add endpoint `https://www.arjunautomations.com/api/payments/webhook`
  (subscribe to payment events) → copy the signing secret. Then set:
  - Vercel `production`: `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`,
    `STRIPE_WEBHOOK_SECRET`
  - Repo secrets (`gh secret set NAME -R riderarjun24359-sys/ArjunAutomationEnterprise`):
    same three names
- **Razorpay (India-first):** at https://dashboard.razorpay.com → Settings → API Keys
  (key id + secret) → Webhooks → add the same endpoint URL → copy webhook secret. Then set:
  - Vercel `production`: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`,
    `RAZORPAY_STARTER_AMOUNT_MINOR`, `RAZORPAY_PROFESSIONAL_AMOUNT_MINOR`
    (integer minor units, e.g. paise; optional `RAZORPAY_CURRENCY`, default `INR`)
  - Repo secrets: same names

**Verify (safe, no real charges):** use the provider's **test/sandbox mode first**
(`sk_test_` / `rzp_test_` — the gate reports `liveMode` so test vs live is always visible).
Send a test webhook from the provider dashboard → expect HTTP 200 with
`{"received":true,"provider":"stripe"|"razorpay",...,"fulfillment":"manual-reconciliation"}`.
Real events only ever *record receipt*; marking invoices paid is a separate human step.
There is intentionally **no** `PAYMENT_WEBHOOK_SECRET` variable — setting one does nothing.

## 3. Monitoring sink (clears `monitoring_alerts` warning)

**Do locally:** nothing — in-app logging, alert queue, and the optional forwarder
(`forwardExternalError` in `src/lib/ops-monitoring.ts`) are implemented; without a sink the
forwarder is a documented no-op.

**Owner dashboard work:** create an incoming webhook (Slack/Discord/PagerDuty) **or** a Sentry
project, then set Vercel `production` (and repo secret if CI should see it):
`OPS_ALERT_WEBHOOK_URL` and/or `SENTRY_DSN` (`NEXT_PUBLIC_SENTRY_DSN` also accepted).

**Verify (safe):** trigger any warning-level path (e.g. a bad-signature webhook POST as above —
it enqueues an alert) → confirm arrival at the sink. Authenticated
`/api/ops/diagnostics` shows `alerts[]`.

## 4. Email DNS (independent of the website; needed before §1 sends reliably)

Cloudflare → DNS for `arjunautomations.com` (values come from the chosen provider's dashboard):

| Type | Name | Value shape |
|---|---|---|
| TXT | `@` | `v=spf1 include:<provider-spf> ~all` (exactly one SPF record) |
| TXT | `<selector>._domainkey` | provider DKIM public key |
| TXT | `_dmarc` | `v=DMARC1; p=quarantine; rua=mailto:<owner-mailbox>` (`p=none` while testing) |
| MX | `@` | only if the domain must *receive* mail (optional for send-only) |
| CAA | `@` | optional `0 issue "letsencrypt.org"` |

**Verify:** `dig +short TXT arjunautomations.com`, `dig +short TXT _dmarc.arjunautomations.com`,
plus the provider's domain-verification checklist.

## 5. Backups + restore drill (clears `supabase_backups` warning and the restore gate)

**Do locally:** nothing further — `/api/ops/diagnostics` (authenticated) now reads backup
configs, runs, and drill rows with the caller's session JWT, org-scoped.

**Owner work (all in-product, no new account):**

1. Set Vercel `production`: `BACKUP_ENABLED=true` (redeploy after).
2. In the app (signed in as an org admin): Platform Operations → enable a backup config for
   the production org (`PLATFORM_ORGANIZATION_ID=11111111-1111-1111-1111-111111111111`).
3. Run a restore drill, then record it in **`cop_restore_validations`** with:
   `organization_id` = production org id, `hub_id` = a row id from `cop_operated_hubs` for
   that org, `restore_key` = drill id, `restore_status` = `success`, `validated_at` = now.
   Docs notes alone do not pass — only rows with a success-like status and `validated_at`
   within 90 days count.

**Verify (safe, read-only):** signed-in `GET /api/ops/diagnostics` →
`disasterRecovery.backup.ok:true`, `restore.ok:true`, `healthy:true`.

## 6. `register-gemini` bootstrap (only if ever used; otherwise ignore)

```bash
gh secret set ADMIN_USER_ID -R riderarjun24359-sys/ArjunAutomationEnterprise
gh secret set ADMIN_EMAIL -R riderarjun24359-sys/ArjunAutomationEnterprise
gh secret set ADMIN_FULL_NAME -R riderarjun24359-sys/ArjunAutomationEnterprise
```

The workflow refuses `register-gemini` without all three — that refusal is the safe default.

## 6b. Apply the seven prepared hardening migrations (staging first, then production)

`supabase/apply_all.sql` already includes them (regenerated 2026-10-12; `db:verify` 68 files and
PGlite execution both pass), but **no machine on this project can reach the hosted databases**
(no Supabase CLI, no `SUPABASE_DB_URL` locally) — applying is an owner step in the Supabase
dashboard (staging `iplkndwkjuupktxwcksv` first, production `ixassghxogcabfcyjjtz` second) or via
the Management API. Apply in filename order, one file at a time. The full copy-pasteable runbook
(pre-state capture, per-file prechecks, positive/negative probes, rollback DDL) is
**`docs/STAGING_TO_PRODUCTION_MIGRATION_PROCEDURE.md`** — use it; do not improvise SQL.

0. **`202610120001_org_membership_escalation_lockdown.sql` — APPLY FIRST (critical, live on
   production).** `202610110001` only removed *anon* access; the authenticated policies still let
   any signed-in user (a) insert a membership row for their own profile into **any** organization
   (self-join ⇒ read all of that tenant's data) and (b) update **any** organization row. This
   migration adds a SECURITY-DEFINER `organization_is_memberless(uuid)` helper, restricts
   `memberships_insert` (own row only into a memberless org, or an existing member adding rows) and
   `orgs_update` (own org only). No data prerequisite. **Hottest priority** — verified locally via
   the negative-control probes in `npm run rls:verify`. Tightening the (still-permissive)
   authenticated *reads* is a separate app-coupled change, not in this migration.
1. `202610100001_crm_rls_remediation.sql` — replaces open `USING(true)` policies on the legacy
   `crm_clients/crm_leads/crm_deals/crm_activities/crm_tasks` tables with
   `is_organization_member(organization_id)` + revokes anon. No data prerequisite (tables are
   orphaned; live code uses `clients`/`sales_*`).
2. `202610100002_lead_consent_dedup.sql` — adds `consent_given/consent_at/consent_notice_version`
   to `sales_leads` + partial unique index `(organization_id, lower(email))`. **Prerequisite:**
   clean differently-cased duplicate emails first or the index build fails.
3. `202610100003_finance_invoice_guards.sql` — unique `(organization_id, lower(number))`,
   status allowlist, non-negative amounts, `amount_paid <= total`. **Prerequisite:** resolve
   duplicate numbers / negative / overpaid rows first via the Finance manual
   payment-confirmation path (never silent-adjust).
4. **`202610120002_read_scope_lockdown.sql` — APPLY LAST, and only after the platform-admin
   prerequisite below and a staging pass.** Narrowed authenticated reads: `orgs_select`,
   `memberships_select` to the caller's own org/member scope; `user_profiles` reads to
   self + shared-org + platform admins (from self-only); profiles writes restated self-only.
   Adds SECURITY-DEFINER `public.is_platform_admin()` (an active `super_admin` membership) and
   `public.shares_organization_with(uuid)`. **Prerequisite:** an operator must hold an active
   `super_admin` membership *before* this is applied, or platform-wide analytics lose cross-org
   visibility — see `docs/STAGING_TO_PRODUCTION_MIGRATION_PROCEDURE.md §2 step 5a`. **Effect:**
   the legacy "adopt a memberless organization" bootstrap becomes unreachable and unprovisioned
   users resolve to `null` (fail closed) until they use the onboarding wizard — intentional.
5. **`202610120003_legacy_table_rls_lockdown.sql`** — closes the last open policies found by
   `npm run rls:audit`: `project_management` and `storage_objects` still had foundation
   `USING(true)`/`WITH CHECK(true)` (cross-tenant read+write for any authenticated user).
   Both are currently orphaned/unused, but the open policies are a latent hole. Tightens them
   to `is_organization_member(organization_id)` `to authenticated`. No data prerequisite.
   `npm run rls:audit` now exits 0 (no open policies on any tenant table).
6. **`202610120004_module_tables_tenant_reads.sql`** — grants minimal org-scoped
   SELECT/INSERT/UPDATE (`to authenticated`, `is_organization_member`) to the 20
   module tables that back genuinely implemented, UI-wired dashboards (CSG ×8,
   delivery-engine ×8, executive-ai ×4 used). No DELETE (no code path deletes).
   Keeps 11 tables locked (deprecated `eae_*` ×4, in-memory `pr_*` ×2, 5 dead
   `executive_*` constants) — see the migration header for the full inventory.

After each: re-run `npm run db:verify`, live-probe staging with the anon key (expect 401 on the
remediated tables) plus an authenticated second-org user (expect cross-org deny), and only then
repeat on production. Until applied, the code-level guards are the only enforcement — this is
defense-in-depth, not a live outage.

**Local proof the migrations behave correctly (no hosted access needed):** `npm run rls:verify`
boots an embedded PostgreSQL 17, applies the full 66-migration chain, seeds independent tenants, and
runs 34 positive/negative RLS probes (all PASS), including the negative controls that *fail*
without `202610120001`/`202610120002`. It proves the migration *semantics*; it is **not** evidence of
a remote apply. Run it against staging only with a disposable project by setting `SUPABASE_DB_URL`
(the harness commits fixture rows, so never point it at production data you care about).

## 6c. Supabase Storage bucket + policies (uploads fail closed until this exists)

No migration creates the `organization-uploads` bucket or any `storage.objects`
policy, so uploads/signing fail closed today (safe, but inert). The app writes
objects to `{orgUuid}/{profileUuid}/{stamp}-{file}` (`buildObjectPath`) and the
signed-url route enforces the org-prefix in code — but the real enforcement
boundary is Storage RLS, which only you can create. Do it in the dashboard
(staging first), bucket **private**, and do NOT use an open `USING (true)`
policy to "make uploads work" — that would expose every tenant's files:

```sql
-- Precheck: bucket must exist (error here = create it in Storage UI first, private).
select count(*) from storage.objects where bucket_id = 'organization-uploads';

insert into storage.buckets (id, name, public)
values ('organization-uploads', 'organization-uploads', false)
on conflict (id) do nothing;

-- Org-member-only read of your own org's folder.
drop policy if exists "org member read" on storage.objects;
create policy "org member read" on storage.objects for select to authenticated
using (bucket_id = 'organization-uploads' and exists (
  select 1 from public.organization_members om
  join public.user_profiles p on p.id = om.user_id
  where om.organization_id = ((storage.foldername(name))[1])::uuid
    and om.is_active and p.auth_user_id = auth.uid()
));

-- Org-member-only upload into your own org's folder (no UPDATE/DELETE: no code
-- path updates or deletes storage objects, so those stay denied).
drop policy if exists "org member upload" on storage.objects;
create policy "org member upload" on storage.objects for insert to authenticated
with check (bucket_id = 'organization-uploads' and exists (
  select 1 from public.organization_members om
  join public.user_profiles p on p.id = om.user_id
  where om.organization_id = ((storage.foldername(name))[1])::uuid
    and om.is_active and p.auth_user_id = auth.uid()
));
```

**Verify:** signed in as org-A member, upload a file via the app (200), then as an
org-B member request its signed URL path — must 403. (Unrelated: the
`public.storage_objects` *table* locked by migration `202610120003` is an unused
stub repository, not this bucket.)

## 7. Explicitly NOT required

- **GitHub `Production` reviewer rule** — cannot be enabled on the current plan (HTTP 422);
  manual `workflow_dispatch` write-access is the accepted gate. No action.
- **Cloudflare proxy / website DNS** — done and verified live (apex `A 216.198.79.1`+`64.29.17.1`,
  `www` CNAME `8f8ccb61a152a669.vercel-dns-017.com`, DNS-only, valid TLS). No action.
- **`VERCEL_TOKEN`** — valid (run `38145177440` green). No action.

## Suggested owner order (single next action first)

**Next single action:** §1 — create the Resend key + verify the domain (unblocks onboarding
email, the smallest paid-dependency-free step if the free tiers suffice; otherwise record it as
accepted-deferred like the rest).
