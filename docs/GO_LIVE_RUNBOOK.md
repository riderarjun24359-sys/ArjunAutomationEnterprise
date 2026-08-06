# Go-Live Runbook

Operational sequence to open Arjun Automation for real customer onboarding.

## Preconditions

- Early Access production deploy complete (`docs/DEPLOYMENT_CHECKLIST.md`)
- `npm run production:verify` and `npm run go-live:verify` green in CI
- On-call + incident channel ready (`docs/INCIDENT_RESPONSE.md`)

## Phase A — Configure

1. Load production secrets (never commit):
   - Core: `NEXT_PUBLIC_APP_URL`, Supabase URL/anon, `PLATFORM_*`
   - Server: `SUPABASE_SERVICE_ROLE_KEY`
   - Email: Resend or SMTP
   - Payment: Stripe keys + webhook secret
   - Monitoring: `OPS_ALERT_WEBHOOK_URL` / Sentry
   - `BACKUP_ENABLED=true`, `AAOS_GO_LIVE=true`
2. Confirm Supabase production project + migrations
3. Confirm storage bucket `organization-uploads` (or `STORAGE_BUCKET`)
4. Register Stripe webhook to production HTTPS endpoint
5. Verify email domain / from-address

## Phase B — Verify

```bash
npm run go-live:verify
```

Live probes:

```bash
curl -fsS "$PRODUCTION_BASE_URL/api/ops/live"
curl -fsS "$PRODUCTION_BASE_URL/api/ops/ready"
curl -fsS "$PRODUCTION_BASE_URL/api/ops/go-live"
```

Open `/go-live` dashboard — all required tasks pass (no fails under strict mode).

## Phase C — Soft customer path

1. Create invite-only allowlist / first cohort
2. Walk one internal account through:
   - Sign-up → verify email → welcome → `/onboarding` wizard
   - Create org workspace → first project checklist
   - Optional upgrade path (`/pricing/upgrade`)
3. Confirm email delivery + auth session refresh
4. Confirm storage upload for org asset
5. Confirm billing path if Stripe live

## Phase D — Open go-live

1. Set `AAOS_GO_LIVE=true` on production
2. Announce go-live window to ops + support
3. Enable public sign-up (or invite flow) per GTM plan
4. Watch `/api/ops/health`, alerts, and Security Center for 2 hours

## Abort criteria

Abort or pause onboarding if any of:

- `/api/ops/ready` or `/api/ops/go-live` returns 503 with blockers
- Auth or email delivery failing for >5% of attempts
- Payment webhook failures blocking upgrades
- Critical security alert unacked

Execute `docs/ROLLBACK_RUNBOOK.md`.

## Related

- Checklist: `docs/GO_LIVE_CHECKLIST.md`
- Customer onboarding: `docs/CUSTOMER_ONBOARDING_RUNBOOK.md`
- Rollback: `docs/ROLLBACK_RUNBOOK.md`
