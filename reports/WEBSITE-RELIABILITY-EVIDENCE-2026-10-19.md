# Website reliability fix — verification evidence (2026-10-19)

Runbook: docs/WEBSITE-RELIABILITY-RUNBOOK-2026-10-19.md

## Root-cause evidence chain

1. Error message not in our codebase (grep: 0 matches) → shipped in vendor/UI chunk.
2. Deployed chunk `https://www.arjunautomations.com/_next/static/chunks/3u6itf6yfsodm.js`
   contains module 168027 — Next.js 16 builtin global error page:
   title "This page couldn’t load"; message = `"A server error occurred. Reload to try again."`
   when `error.digest` exists (SSR failure), else `"Reload to try again, or go back."`
   (client exception). User text matches the no-digest (client) variant.
3. `app/error.tsx` / `app/global-error.tsx` never existed (git history search: 0 commits),
   so max-coverage error UI the site could show was this unbranded default.
4. Vercel CLI (authenticated): 19 production deployments in ~15 h → chunk-hash churn
   makes transient client chunk-404/exception failures likely during deploys.
5. At diagnosis time: 32/32 sitemap routes + ~100 dynamic page routes → HTTP 200,
   no error card; all referenced `_next` assets 200; runtime logs clean; production
   wall-crawl via Playwright: no console/page errors, contentful render everywhere.
   → the incident was transient, and its *UI consequence* was the missing boundaries.
6. API 503s on /api/ops/{cutover,final-launch-readiness,launch-execution} are
   intentional self-reported HOLD gates (payments/env not configured) — not crashes.

## Fix implemented (additive only)

- app/error.tsx (new) — branded route-segment boundary; explicit retry only (no loops).
- app/global-error.tsx (new) — root boundary, own <html>, zero dependencies, no loops.
- scripts/prod-smoke.mjs (untracked harness from the launch work; repaired:
  error-listener ordering, broken check invocation, stale liveness/CTA/bullets checks).

## Local verification (actual results)

- ESLint: new files 0 errors; repo total 0 errors / 380 pre-existing warnings (unchanged).
- next build: rc=0 (with and without temp probes).
- Verified-by-probe (temporary untracked routes, deleted after; screenshots taken):
  * client render-crash → branded card visible, Try again + Back to home present.
  * server SSR throw (force-dynamic) → HTTP 500 + branded card in DOM after hydration,
    digest reference line; single visible card (screenshot /tmp/srv_probe_final.png).
  * unrelated routes unaffected: / /services /contact /about /pricing → 200 + correct H1s.
- Lead pipeline: vitest run app/api/launch-kit/contact/route.test.ts → 7/7 passed
  (fully mocked; no DB, no email, no secrets).
- Both boundaries compiled into client chunks (grep in .next/static/chunks: hit).

## Production verification (read-only, authorized existing access)

- prod-smoke (fixed harness) via Playwright against https://www.arjunautomations.com:
  18/18 ✅, 0 console/page errors across /, /services, service detail, /contact
  (form + consent checkbox visible), /pricing, /api/ops/{health,live,ready}.
- /api/ops/live → 200 {"status":"alive","uptimeSeconds":37,...}
- Repeated availability: earlier crawl (32/32, ~100 pages) + this smoke → stable 200s.
- AT DIAGNOSIS TIME production was already healthy again (transient incident
  class) — the fix removes the unbranded failure UX and makes recovery explicit.
  CORRECT DEPLOYMENT OF THE FIX REQUIRES OWNER CONFIRMATION (Phase 3 rule).

## Not done / no-op by design

- No DNS/domain/billing/auth changes; no env var changes; no workflow activation;
  no emails/messages sent; no DB writes (lead tests fully mocked); no paid services;
  production deploy NOT executed pending owner approval (see runbook deploy section).
- GA4/Consent Mode v2 analytics config (commit c6a85c6) untouched and verified present
  in live CSP headers (googletagmanager/analytics origins whitelisted only).
- The 12 modified-but-uncommitted design-system files in the worktree predate this
  session and were not touched.
