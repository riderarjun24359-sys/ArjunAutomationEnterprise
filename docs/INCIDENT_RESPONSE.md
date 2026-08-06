# Incident Response Guide — Early Access

## Severity

| Level | Definition | Response |
|---|---|---|
| SEV-1 | Full outage or data integrity risk | Page on-call; begin rollback within 15 minutes |
| SEV-2 | Major feature degraded (auth, Supabase, billing) | Investigate within 30 minutes; customer comms |
| SEV-3 | Partial degradation / elevated errors | Fix in next business day; track alert |
| SEV-4 | Minor / cosmetic | Backlog |

## Detection

- `/api/ops/health`, `/api/ops/ready`, `/api/ops/production`
- Production health dashboard `/production-deployment`
- Platform Operations + Security Center alerts
- Optional: Sentry / `OPS_ALERT_WEBHOOK_URL`

## Response steps

1. **Acknowledge** — declare severity and incident channel
2. **Triage** — check live/ready/production endpoints and recent deploys
3. **Contain** — rate-limit abuse, disable failing integration if safe
4. **Mitigate** — hotfix or **Rollback** to last known-good tag/artifact
5. **Verify** — `npm run production:verify` + health probes
6. **Communicate** — status to stakeholders / Early Access users
7. **Postmortem** — root cause, timeline, action items within 48h for SEV-1/2

## Rollback trigger examples

- `/api/ops/ready` failing after deploy
- Auth unable to validate sessions at scale
- Supabase connection failure
- Error rate spike / critical unacked alerts

## Contacts

Maintain on-call rotation separately. Escalate through Platform Operations when persistent.

## Related docs

- `docs/DEPLOYMENT_CHECKLIST.md`
- `docs/OPERATIONS_RUNBOOK.md`
- `docs/DISASTER_RECOVERY.md`
- `docs/releases/v1.0.0-early-access.md`
