# Production Readiness Report

**Version:** 1.0.0-early-access-cutover  
**Generated:** 2026-08-14T17:09:18.597Z  
**Ready:** NO  
**Score:** 40/100  

## Secrets

- Missing critical: NEXT_PUBLIC_APP_URL, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, PLATFORM_LEAD_API_KEY, PLATFORM_ORGANIZATION_ID
- Email provider: pending
- Payments: pending · webhook secret pending
- Monitoring sink: pending
- Backup enabled: no

## Supabase

- Migration SQL files: 59
- RLS enable statements: 1233
- Policies: 361
- Apply on production with `npm run db:apply` (or platform pipeline)

## Email templates

- welcome.md: present
- verify-email.md: present
- invite-teammate.md: present
- password-reset.md: present

## Checks

| ID | Status | Detail |
|---|---|---|
| secrets_critical | warn | NEXT_PUBLIC_APP_URL, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, PLATFORM_LEAD_API_KEY, PLATFORM_ORGANIZATION_ID |
| secrets_startup_gate | pass | instrumentation.ts |
| supabase_migrations | pass | 59 files |
| supabase_rls | pass | 1233 RLS / 361 policies |
| email_provider | warn | missing |
| email_templates | pass | welcome.md:true, verify-email.md:true, invite-teammate.md:true, password-reset.md:true |
| payments_gateway | warn | missing |
| payments_webhook | warn | /api/payments/webhook |
| monitoring_health | pass | cutover endpoint |
| monitoring_alerts | warn | optional sink missing |

## Remaining blockers

- Set NEXT_PUBLIC_APP_URL
- Set NEXT_PUBLIC_SUPABASE_URL
- Set NEXT_PUBLIC_SUPABASE_ANON_KEY
- Set PLATFORM_LEAD_API_KEY
- Set PLATFORM_ORGANIZATION_ID
- Configure RESEND_API_KEY or SMTP_*
- Configure Stripe keys
- Set STRIPE_WEBHOOK_SECRET and register /api/payments/webhook
- Set BACKUP_ENABLED=true and enable org backups
- Set OPS_ALERT_WEBHOOK_URL or SENTRY_DSN

## Operator next steps

1. Complete `docs/GO_LIVE_CHECKLIST.md` and `docs/PRODUCTION_CUTOVER.md`
2. Apply migrations against production Supabase
3. Set `AAOS_CUTOVER=true` / `AAOS_DEPLOY_ENV=production`
4. Probe `/api/ops/cutover`, `/api/ops/live`, `/api/ops/ready`
5. Register Stripe webhook → `/api/payments/webhook`

See also: `docs/PRODUCTION_CUTOVER.md`, `docs/ROLLBACK_RUNBOOK.md`
