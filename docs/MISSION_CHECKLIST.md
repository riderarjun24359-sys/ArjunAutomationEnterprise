# Master Mission Checklist (persistent local checkpoint)

Branch: `main`. **2026-10-11: production deployment pipeline green, custom domain live, and the
last anonymous RLS exposure closed.** The replacement Vercel project is live and healthy; both
Supabase projects exist; env + GitHub secrets provisioned; `arjunautomations.com` +
`www.arjunautomations.com` serve the live deployment over HTTPS (apex 308 → `www`). The previously
stale CI `VERCEL_TOKEN` is fixed (workflow run `38145177440` green). See
`docs/PRODUCTION_RECOVERY_RUNBOOK.md` §0–§2 for the verified state.

> Historical note: the earlier version of this file said "No commit/push/deploy at any point."
> That is no longer true — the recovery deployed to Vercel, migrated a new production Supabase,
> and pushed to `main`. Entries D26–D28 record what was actually done and verified.

## DONE (evidenced)
- [x] D8 PGlite RLS isolation harness: `crm-rls-isolation.test.ts` 8/8 on real Postgres (negative control proves leak detection; cross-org SELECT/INSERT denied, UPDATE/DELETE 0-row filtered, anon denied). Hosted-Supabase live test still blocked.
- [x] D9 Finance DB guards: `finance-guards-db.test.ts` 4/4 on real Postgres (duplicate/status/amount/overpay rejected).
- [x] D10 `db:validate` fixed locally (pgcrypto stub + anon/authenticated roles in validator only): full 63-migration chain + seeds execute on PGlite, including all 3 prepared migrations.
- [x] D11 Reconciliation matcher + refund boundary (`finance/lib/reconciliation.ts` + tests): match/exact/partial/discrepancy, approval+reason+cover rules. Live settlement unverified.
- [x] D12 Task transitions (`tasks/lib/task-transitions.ts` + tests) wired into `updateTask`; comms retry planner (`retry-planning.ts` + tests).
- [x] D13 apply_all regeneration assessed: generator picks up new files (63) but output NOT kept — committed artifact had hand-merged drift; rewriting the production apply artifact is an owner step. Documented.
- [x] D14 First-customer launch pack: discovery→interview adapter, onboarding checklist builder, renewal-due + support-triage detectors (renewal mapper extended with date/value), task transitions wired, reconciliation attempt wired read-only into webhook, email config validator, restore-drill evidence gate, journey integration test, onboarding runbook services-motion section. Suite 95/95 (32 files).
- [x] D15 Final sweep: 3 dead package scripts removed (missing files); apply_all reconciliation procedure documented with evidence (artifact preserved); demo-data badges on capability panels; runWorkflow manual-run idempotency (+ tests); seed/production separation caution documented.
- [x] D1 Local-first AI: `src/lib/ai-provider-status.ts` + tests; Gemini optional; workflow Gemini removal; Vercel local independence. (3/3 + full suite green, build OK)
- [x] D2 Lead intake: public consent+dedup server path (`app/api/launch-kit/contact`), `src/lib/lead-intake.ts`, LeadForm consent. (tests green)
- [x] D3 Webhook: durable idempotency + honest fulfillment (`webhook-idempotency.ts`, `supabase-service-role.ts`, route). (tests green)
- [x] D4 Transaction guards wired (invoice unique/transition/payment-vs-balance, opportunity transitions, due follow-ups). (tests green)
- [x] D5 Initial service offer from catalog (`sales/offer.ts`). (tests green)
- [x] D6 Three prepared migrations (NOT applied) + content tests. (tests green)
- [x] D7 Full suite 41/41, tsc clean, eslint clean on touched files, `next build` OK, production/go-live artifact verifiers pass, `git diff --check` clean.

## TODO (highest priority first)
- [x] T1 db:verify passes (63 files); lead-intake/audit schema contract fixed (metadata column now written).
- [x] T2 Discovery slice: BA interviews/BRDs/stories/acceptance-criteria/review-approvals/versions already real services — no duplicate built.
- [x] T3 Proposal draft from catalog (`sales/lib/proposal-draft.ts` + tests); approval stays human via review-approvals; e-sign gated.
- [x] T4 Acceptance via generic review-approvals (`delivery-acceptance.ts` + tests); QA gate blocks deployment/support (`canAdvanceToStage` wired into service + hook + panel).
- [x] T5 Automation honesty: `runWorkflow` records failed-with-reason (was fake `completed`); pipelines queue as `pending`; quality helper reports manual-required (was fabricated scores).
- [x] T6 Comms consent gate: opt-out check in `sdkSendNotification` with blocked-attempt audit trail (`consent-gate.ts` + tests).
- [x] T7 Deployment review done: workflow dispatch-only verified; `PLATFORM_ORGANIZATION_ID` promoted to cutover-critical (+ tests); health endpoints honest (live 200, ready 503 w/o Supabase — runtime-proven); production status UNVERIFIED (no access).
- [x] T8 Dead artifacts assessed: `typecheck_errors.txt`/`env_usage.txt` are tracked pre-existing files, left preserved; `typecheck_errors.txt` is stale (tsc clean) — noted, not deleted. SEO metadata + contact page wired to fixed intake. `db:verify` 63/63.
- [x] T9 E2E blocked with evidence: no browser binaries, `e2e:install` no-op (no CDN). Local runtime smoke instead: live/home/contact 200, dashboard 307→sign-in, ready 503, intake 400/503 matrix, webhook 400 — all proven via curl. Authenticated E2E + Playwright UNVERIFIED.
- [x] T10 (this report) + honesty fixes: executor case-bug fixed (all capability actions were dead); sign-agreement refuses; proposal drafts real-but-unapproved; onboarding mock refused; queue seeder de-randomized; delivery recs de-fabricated; analytics zeroed on empty; 2 verifier checks strengthened (not weakened) to assert the real intake contract.
- [x] Final: full suite 101/101 (34 files) + tsc clean + build + 8 verifiers green, runbook updated, consolidated report below.
- [x] D16 E2E harness UNBLOCKED (was: "no browser binaries"). Chromium is installed; real root cause of the failing lead-intake browser test was Next dev blocking client JS cross-origin for `127.0.0.1` (form never hydrated → native GET submit). Fixed via `allowedDevOrigins: ["127.0.0.1","localhost"]` (next.config.ts, dev-only) + `reuseExistingServer: false` (playwright.config.ts). Full browser suite: 42 passed / 2 skipped (authenticated journey needs E2E_EMAIL/PASSWORD).
- [x] D17 Dependency security: `npm audit --omit=dev` 4 vulns → 0. next `^16.3.0`→`^16.3.8` (critical SSRF advisory), sharp `0.35.3`→`0.35.5` (deps + overrides), overrides `source-map-js@1.2.2` + `dompurify@3.4.16`. Rebuilt: tsc clean, 101/101 unit, `next build` OK on Next 16.4.0.
- [x] D18 Access control (customer-os): both `app/(shell)/customer-os/**` pages called CRM with a hardcoded `"system"/"system@arjun.dev"` identity instead of the session. Now use `useAuthStore` with honest loading/empty/error states; `/customer-os` added to `ROUTES` + middleware protectedRoutes + E2E gate test. Also removed fabricated pulse metrics in the CRM OS projection and corrected mislabeled dashboard cards (Collected Revenue / Open Opportunities).
- [x] D20 Webhook dedupe honesty + fallback: the payment webhook reported `dedupe: "database"` whenever a service-role client existed, even when the durable insert threw — so a replay could be processed twice while claiming a durable dedupe, and the in-memory guard was skipped entirely. Extracted `resolveWebhookDedupe()` (durable→memory fallback, returns the deciding store + `degraded` flag); the route now reports the real store and raises a degraded alert on fallback. Tests added (webhook-idempotency 7/7, including durable-decides, degraded-fallback replay, and memory-only).
- [x] D19 Ops-health honesty: `buildProductionHealthReport` no longer returns a hardcoded `uptime: "99.9%"` (now formatted from the live uptime counter) and gains a `BackupVerificationState` (`verified`/`unverified`/`failed`) with a backwards-compatible `backupVerified` alias. The public `/api/ops/health` probe stops asserting `backupVerified: true, securityScore: 90, platformHealthScore: 94`; it now derives the platform score from live runtime signals (dependency config, open errors, open circuit breakers, critical alerts) and the security score from the production environment security checks, and reports backups as `unverified` (it is unauthenticated and must not claim a check it cannot run). The authenticated `/api/ops/diagnostics` remains the authoritative backup check. The two score derivations were later extracted to `src/lib/production-health.ts` as pure exported functions (`derivePlatformHealthScore`, `deriveSecurityScore`) and covered by `src/lib/production-health.test.ts` (11/11).

- [x] D21 Production outage diagnosed (read-only). Both `www.arjunautomations.com` and apex return **HTTP 530 / Cloudflare `error code: 1033`** (Argo Tunnel disconnected); DNS is on Cloudflare nameservers, so the domain is not pointed at Vercel. The last Vercel deployments (2026-08-25, `fc7afbe`) now return **404** at every `*.vercel.app` URL → the projects/deployments are gone. Two independent causes; both need owner access (Vercel + Cloudflare). Documented in `docs/SOFT_LAUNCH_DOMAIN_READINESS.md` with minimum owner actions. No production change attempted.

- [x] D22 Closure verification (2026-10-11, after all D16–D21 edits): `npx tsc --noEmit` EXIT 0; `npm run test:unit` **117/117 (35 files)** EXIT 0; `npm run build` EXIT 0; `npx playwright test` **42 passed / 2 skipped** EXIT 0; `npx eslint` on touched files EXIT 0; `git diff --check` clean. The 8 mission-listed verifiers all re-ran EXIT 0. `db:verify` (63 migrations, 1178 tables) and `db:validate` (apply_all.sql PGlite execution) both PASS. `npm audit --omit=dev` 0 vulnerabilities; no hardcoded secret patterns or `console.log` in `src`/`app`; webhook signature verification reviewed (HMAC-SHA256, `timingSafeEqual`, 300s replay tolerance).

- [x] D23 Production-recovery preparation (2026-10-11, read-only; no production change). Verified current access: `gh` OK (`riderarjun24359-sys`); **local Vercel CLI is authenticated as a DIFFERENT account** (`chittemprashantharjun-5618`, team `arjun-automation1`, hobby, **0 projects / 0 deployments**) than the app owner (`riderarjun24359-sys` / team `ArjunAutomation` slug `arjun-automation`). `vercel project inspect arjun-automation-enterprise` → `project_not_found`; old scope `arjun-automation` → "scope does not exist". All `*.vercel.app` URLs → `x-vercel-error: DEPLOYMENT_NOT_FOUND`. Custom domain remains Cloudflare **1033** (tunnel down). Confirmed from the deploy logs (IDs masked, structure visible; fully captured in D24): project `arjunautomationos-enterprise` (Next.js, iad1, hobby, Git-linked to repoId 1325528606) had `www/apex` assigned; `deploymentExpiration.expirationDaysProduction: 30` (last deploy ~47 days ago) → deployments may simply have expired, project deletion unverifiable without the owning account. Workflow analysis + two-choice recovery plan written to **`docs/PRODUCTION_RECOVERY_RUNBOOK.md`**. Workflow gaps recorded: **`PRODUCTION_BASE_URL` variable missing**, **`Production` environment has no protection rules**, **`register-gemini` needs `ADMIN_USER_ID`/`ADMIN_EMAIL`/`ADMIN_FULL_NAME` secrets that do not exist**. No preview deployed (would require a duplicate project — forbidden). No code changed, so all green suites remain valid.

- [x] D23b Recovery-access re-check + runbook validation (2026-10-11). Owning Vercel account **still not accessible**: local CLI is still `chittemprashantharjun-5618` / team `arjun-automation1` (0 projects); scope `arjun-automation` still "does not exist". Public state unchanged (custom domain 530/1033; `<project>.vercel.app` 404 `DEPLOYMENT_NOT_FOUND`). `scripts/debug-vercel-auth.mjs` dry-run behaves cleanly (403 `invalidToken` with no creds). Runbook **corrected**: Vercel's current guidance is apex `A 76.76.21.21` (or the project card value) + `www` `CNAME` `<hash>.vercel-dns-<n>.com`, and — critically — a **proxied (orange-cloud) Cloudflare record blocks Vercel domain verification and the SSL challenge**, so records must be **DNS-only** during issuance (re-proxy optional afterwards, SSL/TLS = Full strict). No cloud mutation performed.

- [x] D24 Recovery-access re-verification + safe fixes (2026-10-11, this session). **Canonical Vercel identity is now definitively known** from the *unmasked* GitHub Actions deploy log (run 32839678440, project-check JSON): project `arjunautomationos-enterprise`, creator/owner user id `SARFIa2AdkqxxhCBSUlG9gsU`, email `riderarjun24359@gmail.com`, username `riderarjun24359-sys`, team `{"name":"ArjunAutomation","slug":"arjun-automation"}`, domains `www.arjunautomations.com` + `arjunautomations.com`, `hasDeployments: true`. Local Vercel CLI is a **different** account (`chittemprashantharjun-5618`, user id `XxRTELwWfzaqNeWogpRsQQpy`, team `arjun-automation1` = `team_yLYkp0v00npJpvE2cv80AeGN`, **0 projects** in both personal and team scope; both project names → 404). **New insight:** the project JSON recorded `deploymentExpiration.expirationDaysProduction: 30` + `deploymentsToKeep: 10`; the last deploy was 2026-08-25 (~47 days ago), so the `DEPLOYMENT_NOT_FOUND` aliases are **most likely expired deployments, not a deleted project** — but public probing cannot distinguish the two (a definitely-nonexistent `*.vercel.app` host returns the identical `x-vercel-error: DEPLOYMENT_NOT_FOUND`), so confirmation requires the owning account. Safe fixes applied: repo variable **`PRODUCTION_BASE_URL=https://www.arjunautomations.com` set**; workflow hardened to **fail closed before deploy** if `PRODUCTION_BASE_URL`/`VERCEL_*` are missing and to **refuse `register-gemini` without `ADMIN_*` secrets**; YAML validated. GitHub environment names are case-insensitive (`production` ≡ `Production`). **Required-reviewer protection rule CANNOT be enabled** — `PUT /environments/Production` → HTTP 422 "Please ensure the billing plan supports the required reviewers protection rule" (private repo on a plan without environment protection rules). Re-verified local suite: tsc 0, **117/117 unit (35 files)**, `next build` 0, `db:verify` (63 migrations / 1178 tables), `db:validate` (50 seeds), `npm audit --omit=dev` 0 vulns, `git diff --check` clean. Public state unchanged (custom domain 530/1033; all `*.vercel.app` 404). No production change, no DNS change, no resource created.

- [x] D25 Verifier sweep + genuine lint defect fixed (2026-10-11). All **8 mission verifiers** re-run to completion: `launch-readiness` **80/80**, `premium-website` **89/89**, `production-remediation` **36/36**, `ai-delivery-model` **6/6**, `production`, `go-live`, `soft-launch` **53/53** — all **EXIT 0**. `company-launch-kit:verify` **initially FAILED 88/89** on `regression:lint`: a genuine `@typescript-eslint/no-unused-vars` warning in `app/(shell)/customer-os/[customerId]/page.tsx` (a D18-modified file) — `projects` destructured but unused in the `useMemo`, and `tasks` destructured but unused in the render scope. Fixed by removing the two unused bindings (no behavior change; the values used are re-read where needed). Re-run: **`company-launch-kit:verify` 89/89 EXIT 0**, `tsc --noEmit` EXIT 0, `test:unit` **117/117 (35 files)**. Also this session: `git diff --check` clean; secret scan clean (only detector regexes + a synthetic `nsk_live_` seed value; no real secrets); no `console.log` in `src`/`app`; `npm audit --omit=dev` **0 vulnerabilities**; Playwright **42 passed / 2 skipped** EXIT 0; local production smoke: `/` 200, `/api/ops/live` 200, `/api/ops/ready` 503, `/api/launch-kit/contact` 400 (empty + no-consent), `/api/payments/webhook` 400 (fail-closed `webhook_secret_missing`).

- [x] D26 **Production infrastructure recreated (2026-10-11).** Canonical Vercel account
  `riderarjun24359-sys` / team `arjun-automation` (`team_phuD6suWsaXfLApxkPSXWAqA`) is now the
  authenticated CLI identity. Created project **`arjunautomationos-enterprise`**
  (`prj_GoeJ31s6APxX5keDRCVarrgzObOc`), Git-linked to repo `1325528606` (`productionBranch: main`),
  `framework: nextjs`, `nodeVersion 24.x`, **deployment protection disabled** (`ssoProtection: null`).
  Set **all** env vars for `preview` + `production` (Supabase URL/anon/service-role,
  `PLATFORM_LEAD_API_KEY`, `PLATFORM_ORGANIZATION_ID=11111111-1111-1111-1111-111111111111`,
  `NEXT_PUBLIC_APP_URL`). Created an isolated **free** production Supabase project
  **`ixassghxogcabfcyjjtz`** (`arjun-enterprise-production`, ap-south-1, `ACTIVE_HEALTHY`), applied
  **all 63 migrations**, and seeded **only** the platform organisation row (no demo/customer data).
  Synced GitHub repo secrets (`VERCEL_PROJECT_ID`, `VERCEL_ORG_ID`, Supabase, `PLATFORM_*`) and
  variables (`NEXT_PUBLIC_APP_URL`, `PRODUCTION_BASE_URL`). Recreated `vercel.json` build config as
  needed. (First CLI deploy had `framework: null` → every route 404; fixed by setting `nextjs` +
  redeploy.)

- [x] D27 **Deploy + verify production & staging (2026-10-11).** Production deployment `READY`,
  alias `https://arjunautomationos-enterprise.vercel.app` (`dpl_DnCvkwd21scCo5CrAGrfEDLcg67i`). Live
  checks: `/` 200, `/api/ops/live` 200, `/api/ops/ready` 200, `/api/ops/health` 200 (score 95),
  `/api/ops/production` 200 (**`blockers: []`**; warnings only: payment/email/monitoring),
  `/api/ops/go-live` 200, `/api/ops/diagnostics` 401. **Route smoke 59/59 PASS** on production and
  **59/59 PASS** on staging. Live RLS/tenant-isolation harness vs staging Supabase **11/11 PASS**.
  Stable staging alias **`https://arjunautomationos-staging.vercel.app`** created; preview
  `NEXT_PUBLIC_APP_URL` set to it. Synthetic smoke leads cleaned up afterwards (1 prod, 2 staging).
  Custom domains `arjunautomations.com` + `www.arjunautomations.com` added and **verified** in the
  project (apex set to **308 → www**).

- [x] D28 **Domain record capture + Git-deploy fix (2026-10-11).** Captured the **exact** Vercel
  DNS records: apex `A 216.198.79.1` + `64.29.17.1` (fallback `76.76.21.21`); `www`
  `CNAME 8f8ccb61a152a669.vercel-dns-017.com` (fallback `cname.vercel-dns.com`); both **DNS-only**
  during verification. Diagnosed the Git-integration production deploy of `3448462` as **BLOCKED**
  ("Vercel couldn't find a Git account for the commit author") because the commit author email was
  the local `*.local` fallback; set repo-local `user.email` to the GitHub-linked noreply address
  (`309610720+riderarjun24359-sys@users.noreply.github.com`) so future `main` pushes deploy cleanly.
  **Cloudflare DNS itself was NOT changed** — no Cloudflare access on this machine; records handed
  to the owner. `production-deploy.yml` healthcheck remains DNS-dependent (targets the custom domain).

- [x] D29 **Git auto-deploy verified end-to-end (2026-10-11).** Pushed docs commit **`0ea0293`**
  (author now GitHub-linked) to `main`; Vercel Git integration built it to **`READY`** (`6x5pxyzzk`)
  — **no longer BLOCKED** — and the production alias
  `https://arjunautomationos-enterprise.vercel.app` now serves that build. Re-checked GET endpoints:
  `/` 200, `/api/ops/live` 200, `/api/ops/ready` 200, `/api/ops/health` 200, `/api/ops/production`
  200 (**`blockers: []`**), `/api/ops/go-live` 200. Auto-deploy from `main` is proven working; no
  manual CLI deploy is required for future releases.

- [x] D30 **Production workflow dispatched + root-caused (2026-10-11).** Ran
  `gh workflow run production-deploy.yml -f action=deploy-production` (run `38138961359`). Result:
  `Production verify` **success** (`production:verify` + `go-live:verify` pass on CI); `Build and
  Deploy to Vercel` **failure** — `curl` exit 22, **HTTP 403** on `POST https://api.vercel.com/v13/deployments`;
  healthcheck + rollback-notes jobs skipped (they depend on it). Root cause: the **`VERCEL_TOKEN`
  repo secret is stale/invalid**. Cannot be replaced here — `POST /v3/user/tokens` and
  `vercel tokens create` both return **`403 Cannot create tokens for this app`** (OAuth-app
  restriction; existing tokens are not readable). **Git-integration deploys are unaffected** (they
  use the Vercel GitHub App, not the token), which is why pushes to `main` still promote to
  production. Owner action: create a dashboard token + `gh secret set VERCEL_TOKEN`.

- [x] D31 **Production workflow GREEN; stale CI token resolved (2026-10-11).** The owner refreshed the
  `VERCEL_TOKEN` repo secret (`gh secret set`, updated `2026-10-11T13:51:59Z`). Re-dispatched
  `gh workflow run production-deploy.yml -f action=deploy-production` **exactly once** (run
  **`38145177440`**) and watched it to completion: **all jobs success** — `Production verify`
  (`production:verify` + `go-live:verify`), `Build and Deploy to Vercel` (REST `POST /v13/deployments`
  → poll to `READY`), `Post-deploy health checks` (`/api/ops/live|ready|health|production|go-live`),
  `Publish rollback strategy`. The workflow created production deployment
  `dpl_4VaWTXFH965BFiCsxcWoDfWsJtLr` (commit `b35e239`), now aliased to
  `arjunautomationos-enterprise.vercel.app`, `arjunautomations.com`, and `www.arjunautomations.com`.
  **B6 is resolved** — HTTP 403 no longer occurs.

- [x] D32 **Custom domain fully verified live (2026-10-11).** `arjunautomations.com` DNS (Cloudflare,
  NS `lee`/`angela.ns.cloudflare.com`) now matches Vercel's project config **exactly**: apex
  `A 216.198.79.1` + `64.29.17.1` (Vercel `recommendedIPv4` rank 1) and `www`
  `CNAME 8f8ccb61a152a669.vercel-dns-017.com` (Vercel `recommendedCNAME` rank 1). Live checks:
  apex `308 → https://www.arjunautomations.com/`; `www` `/` + all ops endpoints **200**;
  `/api/ops/diagnostics` **401** (auth-gated); valid Let's Encrypt cert
  (`CN=www.arjunautomations.com`, valid to 2026-11-08). `www` + apex are `verified: true` in the
  Vercel project (apex `redirect: www`, `308`). No Cloudflare API access exists on this machine, so
  the record change was performed by the owner; it is verified from the authoritative public DNS
  answers, which match Vercel's required values. No MX/TXT/CAA records exist yet (email auth is a
  soft-launch gap, independent of the web records).

- [x] D33 **Staging refreshed + isolated (2026-10-11).** The staging alias had pointed at a stale
  preview built without `NEXT_PUBLIC_APP_URL` (`/api/ops/production` → 503). Deployed a fresh preview
  from `main` (`arjunautomationos-enterprise-bykc3s814-...`) and re-pointed
  `https://arjunautomationos-staging.vercel.app`. Result: `/` + all ops endpoints **200**,
  `/api/ops/production` **ready=true, blockers=[]** (score 71; payment/email/monitoring warnings only).
  Staging uses its own Supabase project `iplkndwkjuupktxwcksv`; production uses
  `ixassghxogcabfcyjjtz` (verified distinct). Synthetic tenant-isolation leftovers in staging
  (`a@test.com` profile + membership + `OrgA` crm_client from the earlier live RLS harness) were
  deleted; both databases now contain only the platform organisation row. Production contains **no**
  synthetic customer/payment/order data (all business tables 0).

- [x] D34 **Anonymous RLS exposure found and closed (2026-10-11).** A live anon-key probe against
  production (`GET`/`POST /rest/v1/organization_members` with the public anon key) showed the `anon`
  role could **read all organisations/memberships** and **pass RLS on membership INSERT** (the insert
  only failed the `user_id` FK) — an unauthenticated enumeration + privilege-escalation surface left
  by the open `USING(true)` policies from `202608020001_enterprise_foundation.sql`. Every other
  foundation table already returned `[]`/401 to anon. Prepared **and applied**
  `supabase/migrations/202610110001_org_member_anon_lockdown.sql` (idempotent): policies recreated
  `to authenticated`, membership INSERT restricted to the caller's own row (`user_id =
  auth_profile_id()`) or an existing org member, membership UPDATE restricted to org members, and all
  anon privileges revoked. Applied to **staging then production** via the Supabase Management API;
  both now return **HTTP 401** to anon for `organizations`/`organization_members`. Authenticated
  behavior is unchanged (browser repositories use the user JWT; the single-org onboarding bootstrap is
  preserved). Proven by a new PGlite test
  `supabase/migrations/org-member-anon-lockdown.test.ts` **6/6** (incl. a negative control that
  detects the open exposure). Migration version recorded in `supabase_migrations.schema_migrations`
  on both projects. Residual (documented, separate): authenticated users can still read across orgs
  because the app intentionally allows single-org bootstrap reads; tightening that is app-coupled.

- [x] D35 **Independent release verification (2026-10-11).** Local: `tsc --noEmit` 0;
  `test:unit` **123/123 (36 files)** (includes the new lockdown test); `next build` OK (exit 0);
  `eslint .` **0 errors** (377 pre-existing warnings); `db:verify` **64 migration files / 1178
  tables**; `db:validate` PASS (apply_all.sql executes on PGlite; 50 seeds FK-resolve);
  `npm audit --omit=dev` **0 vulnerabilities**; `production-remediation:verify` **36/36**;
  `soft-launch:verify` **53/53**. Live production: **125/125 static routes** return 200/307/308;
  ops endpoints 200 (`/api/ops/production` → `blockers: []`); fail-closed probes — webhook
  (`/api/payments/webhook` no signature) **400 `webhook_secret_missing`**, contact (empty / no
  consent) **400**, diagnostics anon **401**. Git auto-deploy preserved: project link
  `github`/`repoId 1325528606`/`productionBranch main`, deployment protection off.

- [x] D36 **Cutover report honesty fixed (2026-10-11).** `/api/ops/cutover` (and its
  `launch-execution` consumer) evaluated 11 source-tree file checks with `process.cwd()` inside the
  Vercel serverless bundle, where `supabase/migrations`, `instrumentation.ts`, route sources and
  `docs/*` are never shipped — so it reported **false blockers** (`supabase_migrations: "0 migration
  SQL files present"`, `secrets_startup_gate`, payment surfaces, monitoring routes, go-live docs) on
  a host where every migration was applied. Commit **`2e30e3b`**: those checks now report **warn
  ("not verifiable in the deployed runtime …; enforced in CI by `production-cutover:verify`")**
  instead of `fail` when the source tree is absent; the local/CI gate is unchanged (missing
  artefacts still `fail` when the tree is present) and env-driven gates are byte-identical in both
  contexts. A second defect of the same class: `supabase_env` demanded
  `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (never provisioned anywhere) while the whole codebase
  authenticates with `NEXT_PUBLIC_SUPABASE_ANON_KEY` — commit **`3c9984b`** accepts either key. Both
  Git auto-deploys built to **READY**; live `/api/ops/cutover` now reports only the **two true
  blockers** (`email_provider`, `payments_gateway` — genuinely unconfigured, B2/B3) with
  `supabase_migrations` as an honest warning pointing at `schema_migrations` + CI. Pinned by
  `src/lib/production-cutover.test.ts` **5/5** (repo-root pass, local gate not weakened,
  runtime warns-not-blocks, env gates identical, anon-key acceptance). Verified: tsc 0, eslint 0,
  `test:unit` **128/128 (37 files)**, `production-cutover:verify` OK, `next build` OK. Cosmetic note:
  the report score stays 0 while warnings dominate — the formula is unchanged; `ready=false` and the
  blocker list are the truthful signals.

## BLOCKED (external/owner only)
- ~~B1 Live RLS/isolation tests + migration apply~~ **RESOLVED 2026-10-11 (D26–D27)** — isolated Enterprise staging (`iplkndwkjuupktxwcksv`) and production (`ixassghxogcabfcyjjtz`) projects exist under org `zmwxthjimwfbbwnbeomi`; all 63 migrations applied to both; live RLS harness **11/11 PASS**.
- B2 Payment provider→invoice mapping + live webhook (needs provider account/secrets). Unchanged: no Stripe/Razorpay keys. `/api/payments/webhook` correctly fails closed (`webhook_secret_missing`).
- B3 External sends/signatures/charges/refunds (needs owner approval + accounts). Unchanged.
- ~~B4 Production smoke/E2E against live (needs deployment + access)~~ **RESOLVED 2026-10-11 (D27)** — production alias served and smoke **59/59**; ops endpoints 200 (`blockers: []`).
- ~~B5 **Production recovery**~~ **RESOLVED 2026-10-11 (D31–D33).** Cloudflare DNS now matches Vercel
  exactly (apex `A 216.198.79.1`+`64.29.17.1`, `www CNAME 8f8ccb61a152a669.vercel-dns-017.com`) and
  the custom domain serves over HTTPS (apex 308 → www); `production-deploy.yml` (incl. its
  custom-domain healthcheck) is **green** (run `38145177440`). Remaining non-blocking caveat: the
  `Production` required-reviewer gate **cannot** be enabled (HTTP 422, plan limitation) — manual
  `workflow_dispatch` write-access is the only gate; and `ADMIN_*` secrets are still absent
  (`register-gemini` refuses without them). Neither blocks the live site.
- ~~B6 **Stale CI `VERCEL_TOKEN` (owner-only)**~~ **RESOLVED 2026-10-11 (D31).** The owner set the
  token (`gh secret set VERCEL_TOKEN`, updated `13:51:59Z`); run `38145177440` deployed via the Vercel
  REST API successfully (no HTTP 403). Git-integration deploys were never affected.

## Environment check (2026-10-11, post-recovery)
- No `.env.local` or `.env` file present in the working tree; secrets are held only in Vercel/GitHub/Supabase and in local `chmod 600` temp files outside the repo.
- Vercel CLI **is** authenticated as the canonical owner `riderarjun24359-sys` (team `arjun-automation`), so the project is reachable and deployable. (The earlier wrong account `chittemprashantharjun-5618` is no longer used.)
- Supabase CLI: isolated staging + production Enterprise projects exist and are linked; unrelated INACTIVE EducationOS projects are untouched.
- **Still externally blocked:** Cloudflare DNS (owner-only) and the external providers in B2/B3. `Production` environment protection rule blocked by plan (B5d).
- Local preparation: **117/117** unit tests (35 files), tsc clean, `next build` green, Playwright 42 passed/2 skipped.

## Verification notes (85-script `*:verify` sweep)
- The sweep runner used `timeout 150`, but 26 of the 34 swept `FAIL`s are `scripts/verify-*.mjs` that ignore `SKIP_TSC`/`SKIP_LINT` and re-run `tsc`+`eslint` internally (~3–5 min each). Their sweep `FAIL` is a timeout artifact, not a code failure. Re-run to completion individually: `sprint3:verify` 152/152, `sprint-b1:verify`, `sprint9:verify`, `executive-ai:verify` all exit 0 (the `executive-ai-ecosystem` and `executive-ai` sweep failures also passed standalone — concurrency artifact).
- Genuine failures are **pre-existing at HEAD** (unchanged by this work), confirmed via `git show HEAD:`:
  - `crm-enterprise:verify` 20/23 — `ui:tabs-leads`/`ui:tabs-ai` expect old tab labels "Lead Management"/"AI Assistant"; committed `CrmPage.tsx` uses "Lead Pipeline"/"AI Agent". `sprint1:dashboard` expects a `liveStats` token absent from committed `ExecutiveCommandCenterPage.tsx`. Stale assertions, not functional regressions.
  - `immersive-v2:verify` — `wire:physics_page` expects `PhysicsPageTransition` referenced in `src/design-os/dashboard/DashboardShell.tsx`; the component exists but is not wired there.
  - `premium-ui:verify` 57/76 — design-token/motion checks (`tokens:*`, `a11y:*`, `micro:*`, `motion:*`) not implemented; `src/design-os` unchanged by this work.
- Environment-dependent (blocked, not code): `production-urls:verify` 0/9 (no `NEXT_PUBLIC_APP_URL`/Supabase env), `launch-email:verify` (`smtp:reachable — no SMTP_HOST`), `final-launch-readiness:verify` (`report:go` HOLD because production secrets are incomplete).
- None of the swept failures target files modified by this work; the 8 mission-listed verifiers (`launch-readiness`, `premium-website`, `production-remediation`, `ai-delivery-model`, `company-launch-kit`, `production`, `go-live`, `soft-launch`) all `PASS` in the sweep.
