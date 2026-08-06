# Disaster Recovery Guide

## RPO / RTO Targets

Configured in Platform Operations Disaster Recovery panel (default RPO: 60 min, RTO: 120 min).

## Backup Strategy

| Type | Module | Frequency |
|---|---|---|
| Database | Platform Operations Backup Center | Daily |
| Documents | business-assets / document-engine | Daily |
| Configuration | Platform Operations | Weekly |
| Capability metadata | Mission Core | Weekly |

## Recovery Procedures

1. **Database failure** — Restore from latest verified backup via Backup Center simulate-restore
2. **Capability outage** — Mission Core health dashboard identifies degraded capability; retry workflow via workflow monitor
3. **Region failure** — Execute DR failover validation in Platform Operations DR panel

## Verification

Run failover validation: Platform Operations → Disaster Recovery → Validate Failover

## Soft Launch Verification Checklist

1. Confirm backup configs exist and are enabled for the launch organization.
2. Run Platform Operations → Disaster Recovery → Validate Failover (simulation).
3. Hit operations endpoints:
   - `GET /api/ops/live` — liveness
   - `GET /api/ops/ready` — readiness
   - `GET /api/ops/health` — global health
   - `GET /api/ops/diagnostics` — authenticated diagnostics (includes backup verification)
4. Confirm `npm run operations:verify` passes in CI.
5. After any restore drill, re-check Mission Core capability health and audit continuity.

## Restore Verification

Restore verification is procedural (no destructive production restore from CI):

1. Identify latest successful `backup_runs` row for the organization.
2. Execute simulate-restore in Backup Center / DR panel.
3. Record RTO observed vs target; page on-call if RTO breached.
4. Mark drill complete in ops runbook notes.

## Health Diagnostics

Soft-launch diagnostics surface backup status, circuit breakers, structured logs, performance marks, and session validity via `/api/ops/diagnostics`.
