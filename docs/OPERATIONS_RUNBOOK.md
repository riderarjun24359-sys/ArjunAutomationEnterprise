# Operations Runbook

## Health Monitoring

- Platform Operations `/platform-operations` — health score, observability, errors, queues
- Mission Core health dashboard — capability registry status
- Security Center — threat detection and audit logs
- **Production health dashboard** `/production-deployment` — Early Access env + service readiness
- Ops APIs:
  - `/api/ops/live` — liveness
  - `/api/ops/ready` — readiness
  - `/api/ops/health` — aggregated health
  - `/api/ops/diagnostics` — authenticated diagnostics
  - `/api/ops/production` — Early Access production summary (no secrets)

## Production Early Access

Release: `v1.0.0-early-access` — see `docs/releases/v1.0.0-early-access.md`

### Daily checks

1. Open `/production-deployment` or `GET /api/ops/production`
2. Confirm Supabase configured, auth session helpers available
3. Review open alerts via ops monitoring / Platform Operations
4. Spot-check storage upload (authorized) and signed URL flow

### Verify locally / CI

```bash
npm run production:verify
```

### Deployment pipeline

- Workflow: `.github/workflows/production-deploy.yml`
- Checklist: `docs/DEPLOYMENT_CHECKLIST.md`
- Rollback: redeploy previous tag, re-verify live/ready

## Error monitoring

- In-app: `enqueueAlert` / recent alerts in `src/lib/ops-monitoring.ts`
- Optional external: `SENTRY_DSN`, `OPS_ALERT_WEBHOOK_URL`
- Security Center audit + threat panels for security-class events

## Performance monitoring

- `recordPerformanceMark` samples exposed via production services report
- Platform Operations observability for queue/latency trends

## Uptime monitoring

- `buildUptimeProbe` + process uptime on `/api/ops/production`
- External uptime: point probe at `/api/ops/live` and `/api/ops/ready`

## Incident Response

1. Check Platform Operations Health Center
2. Review Security Center audit logs and threat alerts
3. Check Mission Core workflow monitor for failed instances
4. Probe `/api/ops/live`, `/api/ops/ready`, `/api/ops/production`
5. Escalate via operations-center if persistent failures
6. Follow `docs/INCIDENT_RESPONSE.md` for severity, rollback, and postmortem

## Backup & Recovery

- Platform Operations Backup Center — scheduled backups and verification
- Disaster Recovery panel — RPO/RTO validation and failover tests
- See `docs/DISASTER_RECOVERY.md`

## Lead Pipeline

Monitor lead intake via audit logs (`lead_captured`, `lead_intake` actions).

## AI Operations

- AI Foundation Executive Dashboard — agent health, cost, quality scores
- All AI routing through Mission Core shared service
