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

## Post-Recovery

1. Verify all capabilities show healthy in Mission Core
2. Run `npm run production-remediation:verify`
3. Confirm audit log continuity
