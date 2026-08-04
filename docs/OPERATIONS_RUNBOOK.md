# Operations Runbook

## Health Monitoring

- Platform Operations `/platform-operations` — health score, observability, errors, queues
- Mission Core health dashboard — capability registry status
- Security Center — threat detection and audit logs

## Incident Response

1. Check Platform Operations Health Center
2. Review Security Center audit logs and threat alerts
3. Check Mission Core workflow monitor for failed instances
4. Escalate via operations-center if persistent failures

## Backup & Recovery

- Platform Operations Backup Center — scheduled backups and verification
- Disaster Recovery panel — RPO/RTO validation and failover tests
- See `docs/DISASTER_RECOVERY.md`

## Lead Pipeline

Monitor lead intake via audit logs (`lead_captured`, `lead_intake` actions).

## AI Operations

- AI Foundation Executive Dashboard — agent health, cost, quality scores
- All AI routing through Mission Core shared service
