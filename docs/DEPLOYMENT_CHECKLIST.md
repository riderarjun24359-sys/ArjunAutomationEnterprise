# Deployment Checklist — Early Access v1.0.0

Use this checklist before and after promoting a production release.

## Pre-deploy

- [ ] Tag release `v1.0.0-early-access` (or matching semver tag)
- [ ] Confirm migrations applied on production Supabase
- [ ] Set required env:
  - [ ] `NEXT_PUBLIC_APP_URL` (HTTPS)
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `PLATFORM_LEAD_API_KEY`
  - [ ] `PLATFORM_ORGANIZATION_ID`
- [ ] Optional Early Access env:
  - [ ] `SUPABASE_SERVICE_ROLE_KEY` (server-only, never `NEXT_PUBLIC_*`)
  - [ ] `RESEND_API_KEY` or `SMTP_*`
  - [ ] `STRIPE_SECRET_KEY` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - [ ] `SENTRY_DSN` / `OPS_ALERT_WEBHOOK_URL`
- [ ] Run `npm run production:verify`
- [ ] Run `npm run build`
- [ ] Confirm GitHub Actions `Production Early Access Deploy` verify + build jobs green

## Deploy

- [ ] Promote immutable build artifact / platform deployment
- [ ] Set `AAOS_DEPLOY_ENV=production` (or platform production equivalent)
- [ ] Confirm DNS + TLS for `NEXT_PUBLIC_APP_URL`

## Post-deploy health checks

- [ ] `GET /api/ops/live` → 200
- [ ] `GET /api/ops/ready` → healthy
- [ ] `GET /api/ops/health` → score acceptable
- [ ] `GET /api/ops/production` → services summary (no secrets)
- [ ] Open `/production-deployment` dashboard (authenticated)
- [ ] Smoke: sign-in, CRM load, storage upload (authorized)
- [ ] Auth: session validate + refresh path
- [ ] Email: send test if provider configured
- [ ] Payment: Stripe test mode if configured
- [ ] Monitoring: alert enqueue / webhook ping if configured

## Rollback

1. Identify failing release via `/api/ops/health` and deploy logs
2. Redeploy previous git tag / immutable artifact
3. Re-run `npm run production:verify`
4. Confirm `/api/ops/live` and `/api/ops/ready`
5. Announce rollback complete (see `docs/INCIDENT_RESPONSE.md`)

## Sign-off

| Role | Name | Date | Notes |
|---|---|---|---|
| Deploy engineer | | | |
| Ops owner | | | |
