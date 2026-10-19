# Website Reliability Runbook — Arjun Automations production site

_Last updated: 2026-10-19 after the "This page couldn't load" incident._

## Incident summary (2026-10-18/19)

Visitors saw Next.js's raw default error interstitial — title "This page
couldn't load", body "Reload to try again, or go back." (client variant) or
"A server error occurred." (server variant).

## Proven root cause

The project shipped **no application-level error boundaries**
(`app/error.tsx`, `app/global-error.tsx` never existed), so any transient
failure — client chunk invalidated by a production deploy, temporary SSR
error — fell through to Next.js's built-in default error screen bundled in
`/_next/static/chunks/3u6itf6yfsodm.js` (module `168027`). Contributing
factor: **19 production deployments in ~15 h** during the launch, maximising
the window in which a visitor's cached page references superseded chunks.

Verified at the time of diagnosis: all 32 sitemap routes + ~100 dynamic page
routes returned 200 with no error card; the runtime failure class was
transient, not persistent (clean build logs, healthy runtime logs).

## Fix (files)

- `app/error.tsx` — branded route-segment boundary. One user-initiated retry
  (`reset()`), "Back to home" link, digest reference shown for support.
  No automatic reload loop. Dependency-light by design.
- `app/global-error.tsx` — root boundary for root-layout/SSR-level failures.
  Renders its own `<html>/<body>` with inlined brand styles so it works even
  when the rest of the runtime is broken. No dependencies, no loop.
- `scripts/prod-smoke.mjs` — repaired the smoke harness
  (error listeners were registered after navigation; check invocations were
  broken; stale liveness/CTA selectors). Run it against production read-only:
  `node scripts/prod-smoke.mjs` (18/18 pass).

## Deploy procedure (unchanged pipeline)

1. Commit `app/error.tsx` + `app/global-error.tsx`.
2. Pre-deploy: `npm run lint` (0 errors), `npm run build` (rc=0).
3. Deploy via existing gated workflow:
   GitHub → Actions → "Production Early Access Deploy" → Run workflow →
   action = `deploy-production` (runs `production:verify`, `go-live:verify`,
   then the Vercel API deploy with preflight config gate).
   Requires the existing GitHub environment approval flow.

## Rollback

- Instant: `vercel rollback <previous-deployment-url>` (Vercel CLI is
  authenticated; pick the previous Ready deployment listed by
  `vercel ls arjunautomationos-enterprise`).
- Or redeploy the previous commit through the same workflow.

## Health checks (existing, read-only)

- `GET /api/ops/live`   → 200 `{"status":"alive", ...}` (liveness)
- `GET /api/ops/ready`  → 200 JSON (readiness)
- `GET /api/ops/health` → 200/503 JSON `{status, score, ...}`
  (503 = intentional HOLD gate, e.g. payments not configured yet)
- Manual browser check after any deploy: `node scripts/prod-smoke.mjs`

## What did NOT change

No DNS/domain settings, no redirects/middleware, no env vars, no analytics
configuration (GA4 + Consent Mode v2 as committed), no lead-capture logic,
no emails, no databases, no paid services.
