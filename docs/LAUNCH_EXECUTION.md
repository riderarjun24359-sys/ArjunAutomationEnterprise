# Launch Execution — Early Access

Execute first-cohort launch without product or schema changes.

## Sequence

1. **Production activation** — secrets, cutover, health, backups, monitoring  
   See `docs/PRODUCTION_CUTOVER.md`
2. **Early Access cohort** — invites, waitlist, onboarding, email, founder alerts  
   See `docs/EARLY_ACCESS_COHORT_RUNBOOK.md`
3. **Production smoke test** — E2E path inventory + Playwright smoke  
   Spec: `e2e/launch-execution-smoke.spec.ts`
4. **Launch readiness report** — GO / HOLD  

```bash
npm run production-cutover:verify
npm run early-access:verify
npm run launch-execution:verify
npm run generate:launch-execution-report
```

Probe:

- `/api/ops/live`
- `/api/ops/ready`
- `/api/ops/cutover`
- `/api/ops/launch-execution`

## Smoke flow

1. Sign up — `/auth/sign-up`
2. Verify email — `/auth/verify-email`
3. Workspace — `/onboarding`
4. Invite member — `/early-access`
5. Add client — `/clients`
6. Create project — `/projects`
7. Create task — `/tasks`
8. Generate invoice — `/finance`
9. AI interaction — `/ai`
10. Founder dashboard — `/founder-analytics`

## Decision policy

- **GO** — launch-execution artifacts pass AND critical secrets + email provider + `BACKUP_ENABLED` present
- **HOLD** — any artifact failure OR runtime activation incomplete

Report: `docs/LAUNCH_EXECUTION_REPORT.md`
