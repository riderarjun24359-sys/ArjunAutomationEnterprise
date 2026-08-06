# Go-Live Checklist — Real Customer Onboarding

Complete every item before opening Arjun Automation to paying / invited customers.

## 1. Production deployment checklist

- [ ] `docs/DEPLOYMENT_CHECKLIST.md` fully signed off
- [ ] `npm run production:verify` passing
- [ ] `npm run go-live:verify` passing
- [ ] Release tag promoted (base: `v1.0.0-early-access` → go-live cut)

## 2. Production environment variables

- [ ] `NEXT_PUBLIC_APP_URL` = HTTPS production URL
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `PLATFORM_LEAD_API_KEY`
- [ ] `PLATFORM_ORGANIZATION_ID`
- [ ] `AAOS_DEPLOY_ENV=production`
- [ ] `AAOS_GO_LIVE=true` (strict readiness gate)
- [ ] Confirm no `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY`

## 3. Production Supabase

- [ ] Production project selected (not local/staging)
- [ ] All migrations applied
- [ ] `SUPABASE_SERVICE_ROLE_KEY` set server-only
- [ ] Auth redirect URLs include production domain
- [ ] RLS policies verified for customer orgs

## 4. Production storage bucket

- [ ] Bucket exists: `organization-uploads` (or `STORAGE_BUCKET` override)
- [ ] Policies: authenticated upload; org-scoped paths
- [ ] MIME allowlist + 10MB limit enforced via `/api/storage/*`

## 5. Production email

- [ ] `RESEND_API_KEY` **or** `SMTP_HOST` + `SMTP_USER` + `SMTP_PASS`
- [ ] From address verified (`SMTP_FROM` / Resend domain)
- [ ] Send test: welcome + verify-email templates
- [ ] Templates present under `src/modules/soft-launch/content/emails/`

## 6. Production payment gateway

- [ ] `STRIPE_SECRET_KEY` (live or go-live test intentionally chosen)
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- [ ] `STRIPE_WEBHOOK_SECRET` + webhook endpoint registered
- [ ] Pricing plans mapped to Soft Launch plan IDs

## 7. Monitoring & alerts

- [ ] `OPS_ALERT_WEBHOOK_URL` and/or `SENTRY_DSN`
- [ ] External uptime probe → `/api/ops/live` and `/api/ops/ready`
- [ ] Alert channel staffed for SEV-1/2

## 8. Backups

- [ ] `BACKUP_ENABLED=true`
- [ ] Platform Operations backup config enabled for production org
- [ ] Restore drill noted in `docs/DISASTER_RECOVERY.md`

## 9. Health endpoints

- [ ] `GET /api/ops/live` → 200
- [ ] `GET /api/ops/ready` → ready
- [ ] `GET /api/ops/health` → acceptable
- [ ] `GET /api/ops/production` → no blockers
- [ ] `GET /api/ops/go-live` → ready (with `AAOS_GO_LIVE=true`)
- [ ] Dashboard `/go-live` reviewed

## 10. Production security

- [ ] HTTPS only; HSTS at edge
- [ ] Session hardening (validateSession / refresh) verified
- [ ] Storage security checks green
- [ ] Rate limits on ops + lead APIs
- [ ] Security Center accessible to ops roles

## Sign-off

| Role | Name | Date |
|---|---|---|
| Deploy engineer | | |
| Ops owner | | |
| Founder / GTM | | |
