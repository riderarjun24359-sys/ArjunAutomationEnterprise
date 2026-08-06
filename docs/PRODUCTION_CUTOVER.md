# Production Cutover — Early Access

Complete production configuration so Arjun Automation can accept Early Access customers.

## Prerequisites

- `npm run production:verify`
- `npm run go-live:verify`
- `docs/GO_LIVE_CHECKLIST.md` in progress

## 1. Production secrets

Set critical secrets (startup fails when `AAOS_CUTOVER=true` / `AAOS_DEPLOY_ENV=production` if missing):

| Variable | Required |
|---|---|
| `NEXT_PUBLIC_APP_URL` | Yes (HTTPS) |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes |
| `PLATFORM_LEAD_API_KEY` | Yes |
| `PLATFORM_ORGANIZATION_ID` | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Cutover |
| Email: `RESEND_API_KEY` or `SMTP_*` | Cutover |
| Stripe: secret + publishable + webhook secret | Cutover |
| `OPS_ALERT_WEBHOOK_URL` / `SENTRY_DSN` | Recommended |
| `BACKUP_ENABLED=true` | Recommended |

Never set `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY`.

Startup gate: `instrumentation.ts` → `assertCriticalProductionSecrets()`.

## 2. Supabase production

1. Point env at production project
2. `npm run db:verify` then `npm run db:apply` (or platform migration pipeline)
3. Confirm RLS policies applied (migrations contain `enable row level security` + `create policy`)
4. Create/verify storage bucket `organization-uploads` (or `STORAGE_BUCKET`)
5. Enable org backups; set `BACKUP_ENABLED=true`

## 3. Email

1. Configure Resend or SMTP + from-address
2. Templates:
   - `welcome.md`, `verify-email.md`, `invite-teammate.md` (onboarding)
   - `password-reset.md` (recovery)
3. Smoke: forgot-password flow + verify-email + welcome

## 4. Payments

1. Set Stripe keys (prefer `sk_live_` only when intentionally live)
2. Register webhook → `POST /api/payments/webhook` with `STRIPE_WEBHOOK_SECRET`
3. Verify signature rejection without secret / bad signature
4. Confirm Billing Finance OS subscription + invoice surfaces

## 5. Monitoring

1. Set `OPS_ALERT_WEBHOOK_URL` and/or `SENTRY_DSN`
2. Probe:
   - `/api/ops/live`
   - `/api/ops/ready`
   - `/api/ops/health`
   - `/api/ops/diagnostics`
   - `/api/ops/cutover`
3. Confirm logging via ops + production-logger

## 6. Final cutover

```bash
npm run production-cutover:verify
npm run generate:production-readiness-report
```

1. Execute remaining items in `docs/GO_LIVE_CHECKLIST.md`
2. Review `docs/PRODUCTION_READINESS_REPORT.md`
3. Set `AAOS_CUTOVER=true` and `AAOS_GO_LIVE=true`
4. Open Early Access cohort

## Rollback

See `docs/ROLLBACK_RUNBOOK.md`.
