# Final Launch Readiness

Validate Arjun Automation as a real customer would experience it — before the first invitation.

## Scope

- Customer journey audit (sign-up → invoice → logout/login)
- UX audit (empty/loading/error, mobile, a11y, performance, motion)
- Trust audit (branding, legal links, security/billing messaging)
- Score + **GO / HOLD**

No new product features, architecture redesign, or schema changes.

## Commands

```bash
npm run final-launch-readiness:verify
npm run generate:final-launch-readiness-report
```

Probe: `GET /api/ops/final-launch-readiness`

## Decision policy

- **GO** — no critical issues, full journey surfaces present, score ≥ 75
- **HOLD** — any critical issue (including missing journey steps, legal pages, or runtime email/secrets)

Report: `docs/FINAL_LAUNCH_READINESS_REPORT.md`
