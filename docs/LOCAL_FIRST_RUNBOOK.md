# Local-First Runbook (Zero Paid-API Development)

This repo runs locally with **no mandatory paid API dependencies**. External AI
(Gemini/OpenAI/Anthropic) and Vercel credentials are never required for local
build, tests, or startup.

## Start locally (no keys)

```bash
npm install
cp .env.example .env.local   # optional for local UI; Supabase not required to boot
npm run dev                  # http://localhost:3000
```

Marketing and public pages render with no environment at all. Protected shell
routes redirect to sign-in when Supabase is unconfigured (`supabase_not_configured`)
instead of crashing — see `src/middleware/auth.ts` and `src/lib/supabase-*.ts`.

## Verify locally (no keys)

```bash
npm run test:unit             # vitest, includes src/lib/ai-provider-status.test.ts
npm run build                 # production build; no AI/Vercel env needed
npm start                     # serve the production build
npm run production:verify     # artifact checks; env gate only when AAOS_DEPLOY_ENV=production
npm run go-live:verify        # artifact checks; strict env gate only when AAOS_GO_LIVE=1
```

`VERCEL_TOKEN`, `VERCEL_PROJECT_ID`, and `VERCEL_ORG_ID` are used ONLY by the
manual `deploy-production` path in `.github/workflows/production-deploy.yml`
(default action `none`, no auto-deploy). They are never read by app code or
local verify scripts.

`GEMINI_API_KEY` is used ONLY by the explicit opt-in job `register-gemini` and
by `getAiProviderStatus()` to report an enabled state. General verification
never requires it. AI status without keys:

- Active provider: `local` (deterministic rule-based summaries from live data)
- External LLM: disabled with reason `no-external-llm-configured`
- No AI text, finding, or transaction is ever fabricated — unavailable
  generation is reported, not invented.

## What works with zero paid keys

- `npm run dev`, `npm run build`, `npm start`, `npm run test:unit`
- Public/marketing pages, navigation, Design OS UI
- Ops health endpoints (`/api/ops/live`, `/api/ops/ready`, `/api/ops/health`)
- Rule-based executive insights (computed from data, not LLM-generated)
- All `*.mjs` artifact verifiers in non-strict mode

## What still needs hosted services

| Feature | Requires | Offline behavior |
|---|---|---|
| Sign-in, org data, CRM/projects/billing/HRMS reads and writes | Supabase (`NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`; server ops also `SUPABASE_SERVICE_ROLE_KEY`) | Degraded honestly: middleware redirects protected routes to sign-in with `supabase_not_configured`; services throw a clear "Supabase is not configured" message. Nothing is faked. |
| External LLM generation (Gemini/OpenAI/Anthropic) | That provider's key only, explicitly set | Disabled state via `src/lib/ai-provider-status.ts`; local fallback stays active. |
| Outbound email | `RESEND_API_KEY` or SMTP (`SMTP_HOST` + `SMTP_USER`) | Templates render; send reports provider-missing warning. |
| Payments | `STRIPE_SECRET_KEY` + publishable key + webhook secret | Warn-only outside go-live mode. |
| Error paging/APM sink | `OPS_ALERT_WEBHOOK_URL` and/or `SENTRY_DSN` | In-app monitoring only; warn-only. |
| Production deploy | Vercel secrets + manual `deploy-production` dispatch | No default deploy; local flow unaffected. |

No new paid provider was introduced by this change.

## Known blocker (documented, NOT migrated)

**CRM RLS is permissive — remediation PREPARED, not applied.**
`supabase/migrations/202608020002_crm_foundation.sql`
creates `using (true)` / `with check (true)` SELECT/INSERT/UPDATE policies on
`crm_clients`, `crm_leads`, `crm_deals`, `crm_activities`, `crm_tasks`, with no
DELETE policy and no GRANT scoping. Those tables are orphaned (live code uses
`clients`/`sales_*`), but the open policies are a real latent risk.
`supabase/migrations/202610100001_crm_rls_remediation.sql` replaces them with
`public.is_organization_member(organization_id)` policies + least-privilege
grants (revoke anon, CRUD-only authenticated). Content-verified by
`supabase/migrations/prepared-migrations.test.ts`. Owner must test it on a
disposable instance and regenerate `apply_all.sql` before any promotion.
No remote migration was applied.

## Customer lifecycle status (2026-10-11 checkpoint)

Local unit suite: 117/117 across 35 files. `tsc --noEmit` clean. `next build`
succeeds. Playwright browser E2E: 42 passed / 2 skipped (authenticated journey
needs `E2E_EMAIL`/`E2E_PASSWORD`). `db:validate`: full 63-migration chain + 50
seeds execute on PGlite (validator-only pgcrypto/role stubs). Task status
transitions enforced; comms retry planning pure-tested; provider→invoice
reconciliation matcher + refund boundary tested with fixtures; live settlement
unverified.
Tenant isolation: proven on real PGlite Postgres — remediated policies deny
cross-org SELECT/INSERT (error) and UPDATE/DELETE (0 rows), anon denied;
negative control (foundation-only) leaks, proving detection is real.
`apply_all.sql` regeneration verified to pick up new migrations but NOT kept:
the committed artifact contains hand-merged drift and rewriting the
production apply artifact is an owner step (`node scripts/generate-apply-all.mjs`).
Hosted-Supabase RLS, live settlement, Playwright E2E, and production smoke
remain UNVERIFIED (no browsers, no credentials, no access).

## Customer lifecycle status (2026-10-10 checkpoint)

Real and DB-backed (verified by audit + unit tests):
- Lead intake: `POST /api/launch-kit/contact` accepts anonymous visitors
  (rate-limited), requires privacy consent (`src/lib/lead-intake.ts`),
  dedups per-org email, stores via server-only client, audits with consent
  proof (metadata column), publishes `LeadGenerated`. No external message is
  ever sent. Runtime-proven: 400 without consent, 503 without intake org.
- Pipeline/qualification/quotes: `sales_*` CRUD real; opportunity status
  transitions enforced (`open→qualified→proposal→negotiation→won/lost`);
  follow-ups due computed from persisted activities (`getDueFollowUps`) —
  human-acted, never auto-sent.
- Discovery/requirements: BA interviews, BRDs, FRS, user stories, acceptance
  criteria, scope items, cost/timeline estimates, versions, and review
  approvals are real services over migrated tables — reused, not duplicated.
- Proposals: `buildProposalDraft` composes deterministic drafts from the
  published catalog offer; `businessAnalystService.createProposal` persists;
  approval is a human `createReviewApproval` row. E-signature is NOT claimed:
  `sign-agreement` refuses without human authorization + signing handoff.
- Invoicing: finance module creates invoices/payments with unique-number,
  balance, and void/paid guards; DB-level mirrors prepared in
  `202610100003_finance_invoice_guards.sql` (not applied).
- Delivery: QA gate blocks deployment/support until persisted verifications
  all pass (`canAdvanceToStage`, surfaced in UI); pipelines record `pending`
  (never fake success); quality helper reports manual-required; acceptance
  sign-off reuses review-approvals (`delivery-acceptance.ts`, pending until
  human approves).
- Orchestration: fixed a case bug (`"missionCore"` vs `"mission-core"`) that
  made EVERY capability action throw; executor now refuses fabricated
  outcomes (signatures, mock onboarding) instead of reporting success.
- Automation: `runWorkflow` records failed-with-reason (was fake completed);
  queue counters start at zero (were random); no worker exists — claimed
  nowhere.
- Comms: opt-out gate in `sdkSendNotification` with blocked-attempt audit
  trail; queue rows only, no sender exists.
- Payments webhook: Stripe signature mandatory; durable idempotency via
  `webhook_idempotency` when secure storage is configured, bounded memory
  fallback otherwise (reported via `dedupe`); fulfillment is honestly
  `manual-reconciliation`. No charges/refunds initiated anywhere.
- Dashboards: computed from persisted records; empty analytics report zero
  (were invented baselines); delivery suggestions are labeled rule-based.
- Initial offer: `src/modules/sales/offer.ts` reuses the published catalog
  (`platform-implementation`) with scope, exclusions, turnaround, and
  acceptance criteria. Acquisition channels are taxonomy only — no prospect
  lists, no scraping, no bulk messaging.
- Startup gate: `PLATFORM_ORGANIZATION_ID` is cutover-critical (public
  intake 503s without it); service-role public exposure always fails closed.

Runtime smoke (local prod build, zero env — all proven via curl):
- `/api/ops/live` 200 · `/` 200 · `/contact` 200 · `/dashboard` 307→sign-in
  (`supabase_not_configured`) · `/api/ops/ready` 503 · intake 400/503 matrix
  · webhook bad-signature 400.

Still event-only/mock (honestly reported, not claimed):
- Client-success-capability portal/health/renewal helpers return hardcoded
  demo content (portal invoices, CSAT 4.2, renewal figures) — UI demo only,
  never persisted as records.
- Remaining capability-executor branches (track-delivery, health-monitoring,
  renewal-growth, deliveryEngine:*, productionReadiness:*, executiveAi:*,
  globalOperations:*, aiCommandCenter:*) emit orchestration events only.
- Server-side `databaseService` calls are no-ops (browser-only client);
  server routes use the narrow service-role helper only where added above.
- Playwright E2E VERIFIED locally: 42 passed / 2 skipped (browser installed; the
  2 skipped need `E2E_EMAIL`/`E2E_PASSWORD`); production smoke UNVERIFIED (no
  production access — the custom domain is down and the canonical Vercel project
  is not reachable from this machine; see `docs/PRODUCTION_RECOVERY_RUNBOOK.md`).

## Manual actions still needed from the owner

1. Configure intake org: set `PLATFORM_ORGANIZATION_ID` (+ `PLATFORM_LEAD_API_KEY`
   for server-to-server callers) or public lead intake returns 503.
2. Configure Supabase env for any data feature; test the three prepared
   migrations on a disposable instance, then follow
   `docs/APPLY_ALL_RECONCILIATION.md` (do not blindly apply the regenerated
   artifact).
3. Seed separation: `supabase/seed/*` targets the fixed dev org
   (`11111111-…`) and ships inside `apply_all.sql` — trim or skip seeds
   (including the "Acme Enterprise" demo customer) before any production
   apply so demo rows never mix with real customer data.
4. For live payments: choose Stripe or Razorpay, provision the account,
   set webhook secrets, implement provider→invoice mapping + reconciliation
   tests. Until then use manual payment confirmation in the finance module.
5. Human approval remains required before any external message, contract,
   charge, refund, or irreversible action — the code sends none.
