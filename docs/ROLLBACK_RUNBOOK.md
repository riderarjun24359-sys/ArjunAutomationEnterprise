# Rollback Runbook — Production Go-Live

Use when a go-live or production deploy must be reversed quickly.

## Decision triggers

- `/api/ops/ready` or `/api/ops/go-live` unhealthy after cutover
- Auth, Supabase, or storage outage affecting customers
- Payment/email systemic failure during onboarding
- SEV-1 security incident
- Error rate / critical alerts beyond agreed threshold

## Immediate actions (0–15 min)

1. Declare incident severity (`docs/INCIDENT_RESPONSE.md`)
2. Freeze new customer invites / marketing CTAs if needed
3. Identify last known-good git tag / deployment artifact
4. Redeploy previous immutable build (do not hot-patch blindly under SEV-1)

## Technical rollback

1. Redeploy previous release artifact / tag
2. Keep database forward-compatible — prefer app rollback over schema downgrade
3. If a migration is unsafe, stop writes and follow `docs/DISASTER_RECOVERY.md`
4. Re-run:

```bash
npm run production:verify
npm run go-live:verify
```

5. Probe:

- `/api/ops/live`
- `/api/ops/ready`
- `/api/ops/production`
- `/api/ops/go-live`

6. Clear or acknowledge stale alerts; confirm monitoring sink

## Feature flags / env

- Set `AAOS_GO_LIVE=false` to relax strict go-live gate messaging while investigating (does not replace fix)
- Disable Stripe live webhooks if payment is the failure domain
- Pause outbound email if provider is looping failures

## Customer communication

1. Status note to active Early Access / go-live cohort
2. Do not promise ETA until rollback verified
3. Offer re-onboarding window after recovery

## Verification after rollback

- [ ] Health endpoints green
- [ ] Sign-in + session refresh works
- [ ] Onboarding wizard reachable
- [ ] No critical unacked alerts
- [ ] Incident timeline started for postmortem

## Exit criteria

Rollback complete when live/ready are healthy, customer-critical paths work, and incident commander announces “stable on prior release.”
