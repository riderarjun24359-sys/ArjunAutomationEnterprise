# Production Recovery Runbook — arjunautomations.com

**Status: RECOVERED + LAUNCH-READY (2026-10-11).** A replacement Vercel project is live and healthy,
both Supabase projects exist, and all environment/secrets are provisioned. The Cloudflare DNS records
in §2 are **applied and verified live** (apex 308 → `www`, both serving over HTTPS). The stale CI
`VERCEL_TOKEN` was refreshed by the owner and `production-deploy.yml` (run `38145177440`) is
**green**. The only anonymous RLS exposure on the foundation tables was closed (§4a). What remains
is owner-only and **does not block the live site** (payment/email providers, GitHub plan-gated
reviewer rule) — see §7.

Companion docs: `docs/MISSION_CHECKLIST.md` (ledger), `docs/SOFT_LAUNCH_DOMAIN_READINESS.md`
(domain checklist), `docs/ROLLBACK_RUNBOOK.md`.

> Historical (pre-recovery) diagnosis is preserved in **Appendix A** so the same incident can be
> recognised again. It no longer describes the current state.

---

## 0. Current status at a glance (verified 2026-10-11)

| Surface | Value | State |
|---|---|---|
| Vercel account | `riderarjun24359-sys` | authenticated locally |
| Vercel team | `arjun-automation` (`team_phuD6suWsaXfLApxkPSXWAqA`) | hobby |
| Vercel project | `arjunautomationos-enterprise` (`prj_GoeJ31s6APxX5keDRCVarrgzObOc`) | framework `nextjs`, Git-linked, deployment protection **off** |
| Production alias | `https://arjunautomationos-enterprise.vercel.app` | **READY**, `/`+all ops 200 |
| Staging alias | `https://arjunautomationos-staging.vercel.app` | **READY** (latest preview), ops 200 |
| Supabase staging | `iplkndwkjuupktxwcksv` | 64 migrations applied |
| Supabase production | `ixassghxogcabfcyjjtz` (`arjun-enterprise-production`, ap-south-1) | 64 migrations applied, platform org row present |
| Custom domain | `arjunautomations.com` / `www.arjunautomations.com` | **LIVE over HTTPS** — apex `308 → www`; DNS matches Vercel exactly; Let's Encrypt cert valid to 2026-11-08 |
| GitHub repo | `riderarjun24359-sys/ArjunAutomationEnterprise` (`1325528606`) | secrets + variables synced; `VERCEL_TOKEN` refreshed |
| CI deploy workflow | `production-deploy.yml` | **GREEN** — run `38145177440`, all jobs success |

**Remaining owner-only items (none block the live site):** configure a payment provider and email/SMTP
(B2/B3); optionally enable the GitHub `Production` required-reviewer rule (blocked by the repo's plan,
HTTP 422); optionally add MX/TXT/CAA (email auth, independent of the web records). See §7.

---

## 1. Verified final state

### 1.1 Vercel

- Project `arjunautomationos-enterprise` — `framework: nextjs`, `nodeVersion: 24.x`, Git-linked to
  repo id `1325528606`, `productionBranch: main`, `ssoProtection: null` (deployment protection
  disabled so the site can be tested from outside).
- Production deployment: **workflow `production-deploy.yml` run `38145177440`** built commit
  `b35e239` → `dpl_4VaWTXFH965BFiCsxcWoDfWsJtLr` (`READY`), aliased to
  `https://arjunautomationos-enterprise.vercel.app`, `arjunautomations.com`, and
  `www.arjunautomations.com`. Git-integration auto-deploy from `main` is also proven working
  (commit `0ea0293` built to `6x5pxyzzk`, `READY`).
- Domains assigned to the project and **verified**: `www.arjunautomations.com`,
  `arjunautomations.com` (apex set to **308 → `www.arjunautomations.com`**), plus the
  `*.vercel.app` project domain.
- Project env vars (names only), all with values set:
  - **preview:** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
    `SUPABASE_SERVICE_ROLE_KEY`, `PLATFORM_LEAD_API_KEY`, `PLATFORM_ORGANIZATION_ID`,
    `NEXT_PUBLIC_APP_URL` (= staging alias).
  - **production:** the same six, with `NEXT_PUBLIC_APP_URL=https://www.arjunautomations.com`.
  - Secret-type values: `SUPABASE_SERVICE_ROLE_KEY`, `PLATFORM_LEAD_API_KEY` (`sensitive`);
    the rest `encrypted`. Service-role keys are **never** exposed via `NEXT_PUBLIC_*`, source,
    logs, or Git.

### 1.2 Supabase

- **Staging** `iplkndwkjuupktxwcksv` and **production** `ixassghxogcabfcyjjtz` both under org
  `zmwxthjimwfbbwnbeomi` ("Arjun Automation").
- Production `arjun-enterprise-production` (ap-south-1, `ACTIVE_HEALTHY`) created because no
  production database existed. **All 64 migrations applied**; only the platform organisation row
  (`11111111-1111-1111-1111-111111111111`, "Arjun Automation") was seeded — **no demo/customer data**.
- Staging has all 64 migrations; demo seeds are **not** applied.
- Live tenant-isolation harness against staging: **11/11 PASS** (user B sees only org B;
  cross-org INSERT denied 403; UPDATE/DELETE affect 0 rows; anon 401; org B intact).
- **Anon RLS lockdown (D34).** A live anon-key probe found the `organizations`/`organization_members`
  foundation tables still had open `USING(true)` policies (anon could enumerate orgs/memberships and
  pass membership INSERT). Migration `202610110001_org_member_anon_lockdown.sql` (idempotent) was
  applied to **staging then production**; both now return **HTTP 401** to the anon role. Authenticated
  behaviour is unchanged (browser repositories use the user JWT). Proven by PGlite test
  `supabase/migrations/org-member-anon-lockdown.test.ts` **6/6** (with a negative control).

### 1.3 GitHub (`riderarjun24359-sys/ArjunAutomationEnterprise`)

- Repo **secrets** present: `VERCEL_PROJECT_ID`, `VERCEL_ORG_ID`, `VERCEL_TOKEN`,
  `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`,
  `PLATFORM_LEAD_API_KEY`, `PLATFORM_ORGANIZATION_ID`, `GEMINI_API_KEY`.
- Repo **variables**: `NEXT_PUBLIC_APP_URL=https://www.arjunautomations.com`,
  `PRODUCTION_BASE_URL=https://www.arjunautomations.com`.
- `Production` environment **required-reviewer gate cannot be enabled** — `PUT` returns
  HTTP 422 "Please ensure the billing plan supports the required reviewers protection rule"
  (private repo; needs GitHub Pro/Team/Enterprise). Manual `workflow_dispatch` write access is the
  only gate today.

### 1.4 Verified checks (2026-10-11)

- **Production** `https://arjunautomationos-enterprise.vercel.app`:
  `/` 200, `/api/ops/live` 200, `/api/ops/ready` 200, `/api/ops/health` 200 (score 95),
  `/api/ops/production` 200 (**`blockers: []`**; warnings: payment/email/monitoring not configured),
  `/api/ops/go-live` 200, `/api/ops/diagnostics` 401 (auth-gated).
  Full route smoke: **125/125 static routes PASS** (200/307/308; includes the fail-closed webhook and
  contact probes).
- **Custom domain** `https://www.arjunautomations.com`: same ops endpoints 200; apex
  `https://arjunautomations.com` → **308 → `www`**; valid Let's Encrypt cert
  (`CN=www.arjunautomations.com`, valid to 2026-11-08); `www` + apex `verified: true` in Vercel.
- **Staging** `https://arjunautomationos-staging.vercel.app`: same ops endpoints 200;
  `/api/ops/production` **ready=true, blockers=[]**.
- **Local**: `npx tsc --noEmit` 0; `test:unit` **123/123 (36 files)**; `next build` OK;
  `eslint .` 0 errors (377 pre-existing warnings); `npm audit --omit=dev` 0 vulnerabilities;
  `db:verify` **64 migrations / 1178 tables**; `db:validate` apply_all.sql on PGlite + 50 seeds PASS;
  `production-remediation:verify` 36/36; `soft-launch:verify` 53/53; `git diff --check` clean.
- Synthetic smoke-test leads created during verification were **deleted** afterwards
  (1 production, 2 staging) so production contains no test/customer data (all business tables 0).

---

## 2. Cloudflare DNS — applied and verified live (2026-10-11)

`arjunautomations.com` is on Cloudflare nameservers (`lee.ns.cloudflare.com`,
`angela.ns.cloudflare.com`). The stale tunnel records were replaced (by the owner — this machine has
no Cloudflare API/console access) and the public answers now match Vercel's project config **exactly**.

**Required records (from the project's domain config) and the live answer:**

| Type | Name | Value(s) | Proxy | Verified live |
|---|---|---|---|---|
| A | `arjunautomations.com` (apex) | `216.198.79.1` **and** `64.29.17.1` (rank 1; fallback `76.76.21.21`) | DNS-only (grey cloud) during issuance | ✅ both present |
| CNAME | `www.arjunautomations.com` | `8f8ccb61a152a669.vercel-dns-017.com` (rank 1; fallback `cname.vercel-dns.com`) | DNS-only (grey cloud) during issuance | ✅ matches |

Evidence: apex returns **308 → `https://www.arjunautomations.com/`**; `www` serves `/` + all ops
endpoints **200** with a valid Let's Encrypt cert (`CN=www.arjunautomations.com`, valid to
2026-11-08). Both domains show `verified: true` in the Vercel project. Vercel issued TLS, so the
records are correct — no further action needed here.

If the Cloudflare proxy (orange cloud) is re-enabled later, set SSL/TLS = **Full (strict)** — never
*Flexible* (it causes `err_too_many_redirects`). Note: `production-deploy.yml`'s healthcheck targets
`https://www.arjunautomations.com`, so the proxy setting must keep that domain reachable.

There are currently **no MX, TXT/SPF, DKIM, DMARC, or CAA records** on the zone; if email is needed
later, add those *in addition to* (not instead of) the web records above.

---

## 3. What the recovery actually did

1. Confirmed the old project/deployments were gone and the local CLI could authenticate as the
   canonical owner (`riderarjun24359-sys` / team `arjun-automation`).
2. **Created** project `arjunautomationos-enterprise` (no duplicate; the previous one no longer
   existed), re-imported the GitHub repo, set `framework: nextjs`, and disabled deployment protection.
3. Set **all** production + preview env vars (the previous project had only four, and was missing
   cutover-critical `PLATFORM_ORGANIZATION_ID` + `SUPABASE_SERVICE_ROLE_KEY`).
4. Created an isolated **free** production Supabase project (`ixassghxogcabfcyjjtz`), applied all
   64 migrations, and seeded only the platform organisation row.
5. Deployed with the Vercel CLI (first deploy had `framework: null` → every route 404; fixed by
   setting `framework: nextjs` and redeploying), then aliased to the production URL and verified
   every ops endpoint + the route smoke suite.
6. Re-added both custom domains to the project and set the apex → `www` **308** redirect; the owner
   then corrected the Cloudflare DNS (§2) so the domain serves Vercel over HTTPS.
7. Synced GitHub repo secrets/variables so `production-deploy.yml` can deploy; the owner refreshed the
   stale `VERCEL_TOKEN`, and run `38145177440` then went **green** end-to-end.
8. Found and closed an anonymous RLS exposure on `organizations`/`organization_members` via an
   idempotent migration applied to staging + production (§1.2, D34).

> The Git-integration deployment of the pre-recovery commit `3448462` was **BLOCKED**
> ("Vercel couldn't find a Git account for the commit author") because the commit author email was
> the local `*.local` fallback. The repo-local `user.email` was reset to the GitHub-linked noreply
> address; the next commit (`0ea0293`) then built via Git integration to **`READY`** and the
> production alias now serves it — **auto-deploy from `main` is confirmed working.**

---

## 4. `production-deploy.yml` status — **GREEN**

- Trigger: **`workflow_dispatch` only**; input `action` = `none` / `register-gemini` /
  `deploy-production`.
- `deploy-production`: verify → build-and-deploy (Vercel REST `POST /v13/deployments`) →
  **healthcheck** (`curl -fsS` against `PRODUCTION_BASE_URL`) → rollback notes.
- Fixed / hardened: `PRODUCTION_BASE_URL` is set; the workflow fails closed before building if
  `PRODUCTION_BASE_URL` or the `VERCEL_*` secrets are missing; `register-gemini` refuses to run
  without `ADMIN_USER_ID`/`ADMIN_EMAIL`/`ADMIN_FULL_NAME`.
- The healthcheck targets `https://www.arjunautomations.com`, which now serves the project (200), so
  the workflow passes end-to-end.

### Dispatch results

**Run `38138961359` (pre-fix, action `deploy-production`) — failure, root-caused:**

| Job | Result |
|---|---|
| `Production verify` (`production:verify` + `go-live:verify`) | success |
| `Build and Deploy to Vercel` | failure — `curl` exit 22, HTTP **403** on `POST /v13/deployments` |
| `Post-deploy health checks` | skipped |
| `Publish rollback strategy` | skipped |

Root cause: the `VERCEL_TOKEN` repo secret was stale/invalid (HTTP 403). It could not be recreated
from this machine (`POST /v3/user/tokens` / `vercel tokens create` → `403 Cannot create tokens for
this app`, an OAuth-app restriction). **Owner fixed it:** `gh secret set VERCEL_TOKEN`
(updated `2026-10-11T13:51:59Z`).

**Run `38145177440` (post-fix, action `deploy-production`) — ALL JOBS SUCCESS:**

| Job | Result |
|---|---|
| `Production verify` (`production:verify` + `go-live:verify`) | **success** |
| `Build and Deploy to Vercel` | **success** — created `dpl_4VaWTXFH965BFiCsxcWoDfWsJtLr` (commit `b35e239`) |
| `Post-deploy health checks` (`/api/ops/live\|ready\|health\|production\|go-live`) | **success** |
| `Publish rollback strategy` | **success** |

- **B6 resolved** — HTTP 403 no longer occurs; the REST deploy path works with the refreshed token.
- Git-integration deploys remain unaffected (they use the Vercel GitHub App, not `VERCEL_TOKEN`) —
  pushes to `main` still build and promote to production (§1.1, D29).

---

## 5. Staging

- Dedicated Enterprise staging Supabase exists (`iplkndwkjuupktxwcksv`); the two unrelated
  **INACTIVE** EducationOS projects in another org are **not** touched.
- Stable staging URL: `https://arjunautomationos-staging.vercel.app` (alias of the latest preview
  deployment). Preview env vars point at the staging Supabase project.
- To refresh staging: deploy a preview from `main` (`npx vercel deploy --scope arjun-automation`)
  and re-point the alias:
  `npx vercel alias set <new-preview-url> arjunautomationos-staging.vercel.app --scope arjun-automation`.

---

## 6. Preview

Preview deployments are available again and were verified. The previous blocker (wrong account, zero
projects) no longer applies. The `arjunautomationos-staging` alias now points at a current preview of
`main` built with the staging Supabase env (`/api/ops/production` → `ready=true`).

---

## 7. Remaining owner actions

Everything that blocks the live site is done. The following are **optional / provider-gated** and do
not affect `arjunautomations.com` serving normally.

### Owner — launch features that need external accounts (B2/B3)

- **Payments.** Create the provider account first, then provision *both* the runtime env vars
  (Vercel project → Settings → Environment Variables, `production`) *and* the repo secrets the
  manual workflow needs. Exact names — there is intentionally **no** `PAYMENT_WEBHOOK_SECRET`
  variable; the webhook route reads `STRIPE_WEBHOOK_SECRET` (Stripe) /
  `RAZORPAY_WEBHOOK_SECRET` (Razorpay), and nothing reads any other name:
  ```bash
  # Stripe path
  gh secret set STRIPE_SECRET_KEY -R riderarjun24359-sys/ArjunAutomationEnterprise
  gh secret set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY -R riderarjun24359-sys/ArjunAutomationEnterprise
  gh secret set STRIPE_WEBHOOK_SECRET -R riderarjun24359-sys/ArjunAutomationEnterprise
  # Razorpay path (India-first alternative)
  gh secret set RAZORPAY_KEY_ID -R riderarjun24359-sys/ArjunAutomationEnterprise
  gh secret set RAZORPAY_KEY_SECRET -R riderarjun24359-sys/ArjunAutomationEnterprise
  gh secret set RAZORPAY_WEBHOOK_SECRET -R riderarjun24359-sys/ArjunAutomationEnterprise
  # + plan amounts RAZORPAY_STARTER_AMOUNT_MINOR / RAZORPAY_PROFESSIONAL_AMOUNT_MINOR (minor units)
  ```
  Then mirror the same values into the Vercel project's `production` env vars and register the
  provider webhook URL `https://www.arjunautomations.com/api/payments/webhook`. Until then the
  route correctly fails closed (`webhook_secret_missing`, verified live: HTTP 400).
- **Email.** Provision `RESEND_API_KEY` (+ `RESEND_FROM`) or the SMTP set (`SMTP_HOST`,
  `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`) the same way; no sending code runs without
  them. The `/api/ops/production` report lists these as **warnings** (not blockers).
- **`register-gemini` bootstrap (optional).** Only needed if the owner ever runs the manual
  `register-gemini` workflow action; it refuses without all three:
  ```bash
  gh secret set ADMIN_USER_ID -R riderarjun24359-sys/ArjunAutomationEnterprise
  gh secret set ADMIN_EMAIL -R riderarjun24359-sys/ArjunAutomationEnterprise
  gh secret set ADMIN_FULL_NAME -R riderarjun24359-sys/ArjunAutomationEnterprise
  ```

### Owner — GitHub plan-gated reviewer rule (optional)

The `Production` environment required-reviewer rule cannot be enabled on the repo's current plan
(HTTP 422). Manual `workflow_dispatch` write-access is the only gate today. Upgrade the plan or
accept the current gate.

### Owner — email authentication DNS (optional, independent of the website)

No MX/TXT/SPF/DKIM/DMARC or CAA records exist for the zone. Add them when email is required.

### Verify the live site any time

```bash
curl -fsS https://www.arjunautomations.com/api/ops/live
curl -fsS https://www.arjunautomations.com/api/ops/ready
curl -fsS https://www.arjunautomations.com/api/ops/production   # blockers: []
```

### Routine deploy

Git-integration auto-deploys `main` to production (commit author is GitHub-linked), or:

```bash
npx vercel deploy --prod --scope arjun-automation
```

To re-validate the manual pipeline (creates a production deployment via the REST API):

```bash
gh workflow run production-deploy.yml -f action=deploy-production   # OWNER APPROVAL REQUIRED
```

---

## Appendix A — Historical diagnosis (pre-recovery, 2026-10-11)

Retained for incident recognition. **This describes the state before the recovery above.**

- **Two independent failures:**
  1. **No live Vercel deployment.** Project aliases resolved to Vercel but returned
     `x-vercel-error: DEPLOYMENT_NOT_FOUND`; the last successful deploy was 2026-08-25 (`fc7afbe`).
     With `deploymentExpiration.expirationDaysProduction: 30`, expired deployments were the most
     likely cause; public probing could not distinguish "expired" from "deleted".
  2. **Cloudflare origin was a disconnected Argo Tunnel.** NS `lee`/`angela.ns.cloudflare.com`;
     apex + `www` returned Cloudflare proxy IPs (`104.21.56.42`, `172.67.177.66`) with HTTP 530 /
     error 1033.
- The authoritative owner identity was recovered from the unmasked GitHub Actions deploy log
  (run `32839678440`): user id `SARFIa2AdkqxxhCBSUlG9gsU`, username `riderarjun24359-sys`,
  email `riderarjun24359@gmail.com`, team `{"name":"ArjunAutomation","slug":"arjun-automation"}`.
  At that time the local Vercel CLI was authenticated as a **different** account
  (`chittemprashantharjun-5618` / team `arjun-automation1`, 0 projects) — now corrected.
- The previous project recorded env vars (names only): `NEXT_PUBLIC_APP_URL`,
  `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `PLATFORM_LEAD_API_KEY` — i.e.
  `PLATFORM_ORGANIZATION_ID` and `SUPABASE_SERVICE_ROLE_KEY` were **missing** in production.
- Historical recovery options compared: **Choice A** (Vercel origin — chosen; now completed) vs
  **Choice B** (restore the Cloudflare Tunnel origin — rejected; the tunnel appears stale and would
  bypass the Vercel pipeline).
