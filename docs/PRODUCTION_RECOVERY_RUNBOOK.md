# Production Recovery Runbook — arjunautomations.com

Read-only diagnosis performed 2026-10-11. **No production change was made.**
Companion: `docs/SOFT_LAUNCH_DOMAIN_READINESS.md` (domain checklist), `docs/ROLLBACK_RUNBOOK.md`.

## 1. Verified access status (2026-10-11)

| Surface | Identity | Access | Can act? |
|---|---|---|---|
| GitHub (CLI `gh`) | `riderarjun24359-sys` | scopes `repo`, `workflow`, `read:org`, `gist` | read metadata; **cannot** read secret values |
| Vercel (local CLI) | `chittemprashantharjun-5618` | team `arjun-automation1` ("Arjun Automation", hobby) | **no** — team has **0 projects / 0 deployments** |
| Vercel (owns the app) | `riderarjun24359-sys` / `riderarjun24359@gmail.com` | team `ArjunAutomation` (slug `arjun-automation`) | **not accessible from this machine** (different account/team) |
| Cloudflare (DNS) | unknown | zone `arjunautomations.com` on Cloudflare NS | **not accessible from this machine** |
| Supabase (CLI) | `riderarjun24359@gmail.com's Org` + `Arjun Automation` | 2 **INACTIVE** EducationOS projects; 0 Enterprise | **no** isolated Enterprise target |

### Evidence

- Repo: `riderarjun24359-sys/ArjunAutomationEnterprise`, id **1325528606**, private, default branch `main`.
- Repo **secrets (names only)**: `GEMINI_API_KEY`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `PLATFORM_LEAD_API_KEY`, `PLATFORM_ORGANIZATION_ID`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, `VERCEL_TOKEN`.
- Repo **variables**: `NEXT_PUBLIC_APP_URL=https://www.arjunautomations.com` — **`PRODUCTION_BASE_URL` is MISSING**.
- Environments: `Production` (**no protection rules**), `Production – arjun-automation-enterprise`, `Production – arjunautomationos-enterprise`.
- Only workflow: `.github/workflows/production-deploy.yml` (`workflow_dispatch` only — no CI, no auto-deploy).
- DNS: NS `lee.ns.cloudflare.com`, `angela.ns.cloudflare.com`; apex + `www` answer Cloudflare proxy IPs.
- Custom domain: `https://www.arjunautomations.com` and `https://arjunautomations.com` → **HTTP 530**, body `error code: 1033` (Cloudflare **Argo Tunnel** error) → the domain origin is a Cloudflare Tunnel that is **not connected**. The custom domain is **not** served by Vercel.
- Vercel deployments (last success 2026-08-25, ref `fc7afbe`): every `*.vercel.app` URL → **HTTP 404**, `server: Vercel`, `x-vercel-error: DEPLOYMENT_NOT_FOUND`.
- Deploy-time Vercel owner (from masked run logs): team `{"name":"ArjunAutomation","slug":"arjun-automation"}`; project `arjunautomationos-enterprise` (Next.js, node 24.x, region `iad1`, hobby, private), Git-linked to repoId 1325528606, `productionBranch: main`.
- Project domains assigned at deploy time: `www.arjunautomations.com`, `arjunautomations.com` (+ vercel.app aliases).
- Project env var names (values masked): `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `PLATFORM_LEAD_API_KEY` (all `production`, type `sensitive`).

### Root causes (two independent failures)

1. **No live Vercel deployment.** The project aliases resolve to Vercel but return `DEPLOYMENT_NOT_FOUND`. Whether the project was deleted or all deployments simply expired (configured `deploymentExpiration.expirationDaysProduction: 30`, last deploy ~47 days ago) **cannot be determined from this machine** — it requires the owning Vercel account/team.
2. **Cloudflare origin is a disconnected tunnel (1033).** Independently of Vercel, the DNS origin for the custom domain is a Cloudflare Tunnel that is down, so even a live Vercel deployment would not be reached by the custom domain today.

> Changing DNS alone is **not** sufficient: the Vercel origin must also have a live deployment and the domain must be (re)assigned to that project.

## 2. What the deploy workflow does (`production-deploy.yml`)

- Trigger: **`workflow_dispatch` only**; input `action` = `none` (default, no-op) / `register-gemini` / `deploy-production`.
- `deploy-production` runs:
  1. `verify` — `npm run production:verify` and `npm run go-live:verify` with `NODE_ENV=production`, `AAOS_DEPLOY_ENV=production`, `NEXT_PUBLIC_APP_URL` (var) and Supabase/PLATFORM secrets. No AI creds (must pass with local fallback).
  2. `build-and-deploy` — `environment: production`; requires `VERCEL_TOKEN`, `VERCEL_PROJECT_ID`, `VERCEL_ORG_ID`; `POST https://api.vercel.com/v13/deployments` with body `{ name: "arjunautomationos-enterprise", project: <VERCEL_PROJECT_ID>, target: "production", gitSource: { type: "github", repoId: 1325528606, ref: "main" } }`; polls until `READY`.
  3. `healthcheck` — **requires repo variable `PRODUCTION_BASE_URL`** and `curl -fsS` probes `/api/ops/live|ready|health|production|go-live`. `curl -fsS` fails on HTTP ≥ 400, so a 503 readiness response fails the job (intended).
  4. `rollback_notes` — echoes the rollback strategy.
- It **can deploy to production** (target `production`), but only when dispatched by a user and only if the `Production` environment gate is configured.

### Workflow defects found (2026-10-11; status updated same day)

- ~~**`PRODUCTION_BASE_URL` variable is not set**~~ **FIXED** — set to `https://www.arjunautomations.com` via `gh variable set`.
- **`Production` environment has no protection rules** — **NOT fixable on this account**: `PUT /repos/.../environments/Production` returns HTTP **422 "Please ensure the billing plan supports the required reviewers protection rule"**. Required reviewers for a private repo need GitHub Pro/Team/Enterprise. The workflow comment now documents this; the only enforcer today is `workflow_dispatch` write access. (Environment names are case-insensitive: `production` matches `Production`.)
- **`register-gemini` referenced `ADMIN_USER_ID`/`ADMIN_EMAIL`/`ADMIN_FULL_NAME`, which do not exist** — **FIXED (fail-closed)**: a preflight step now refuses to run the job when any of those secrets is empty.
- **Preflight hardening** — `build-and-deploy` now validates `PRODUCTION_BASE_URL` + `VERCEL_TOKEN`/`VERCEL_PROJECT_ID`/`VERCEL_ORG_ID` **before** any build/deploy, instead of only failing at the post-deploy healthcheck (which previously left a live but unverified deployment).
- No CI workflow runs on push/PR; only manual dispatch exists.

### Canonical-account evidence (authoritative, from the unmasked deploy log)

GitHub Actions run **32839678440** (last successful deploy, 2026-08-25, ref `fc7afbe`) is **not** fully masked — its `Project check` step printed the raw Vercel project JSON:

- Project name `arjunautomationos-enterprise`; `hasDeployments: true`; framework `nextjs`; `nodeVersion 24.x`; region `iad1`; plan `hobby`; `rootDirectory: null`; `sourceFilesOutsideRootDirectory: true`.
- Git link: repo `ArjunAutomationEnterprise`, `repoId 1325528606`, org `riderarjun24359-sys`, `productionBranch: main`, `createDeployments: enabled`.
- Creator/owner: user id **`SARFIa2AdkqxxhCBSUlG9gsU`**, username **`riderarjun24359-sys`**, email **`riderarjun24359@gmail.com`**, GitHub login `riderarjun24359-sys`.
- Team: **`{"name":"ArjunAutomation","slug":"arjun-automation"}`** (also `oidcTokenClaims.owner = "arjun-automation"`).
- Domains aliased to production: **`www.arjunautomations.com` + `arjunautomations.com`**.
- Project env vars present at deploy time (**only four**, all `production`/`sensitive`): `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `PLATFORM_LEAD_API_KEY`. **`PLATFORM_ORGANIZATION_ID` and `SUPABASE_SERVICE_ROLE_KEY` were NOT present** → production was already missing cutover-critical/recommended secrets.
- **`deploymentExpiration`: `expirationDaysProduction: 30`, `deploymentsToKeep: 10`.** The last deploy is ~47 days old, so the public `404 / DEPLOYMENT_NOT_FOUND` aliases are **most likely expired deployments, not a deleted project**. Public probing cannot distinguish the two: a definitely-nonexistent `*.vercel.app` host returns the **identical** `x-vercel-error: DEPLOYMENT_NOT_FOUND`.

**Local Vercel CLI is the wrong account:** `chittemprashantharjun-5618` (user id `XxRTELwWfzaqNeWogpRsQQpy`, email `chittemprashantharjun@gmail.com`), team `arjun-automation1` (`team_yLYkp0v00npJpvE2cv80AeGN`) → **0 projects** (personal and team); both project names → 404. It is a different Vercel identity from the canonical owner above.

> Consequence: the canonical project cannot be inspected or deployed from this machine. The owner must **authenticate the Vercel CLI as `riderarjun24359-sys`** (or supply a `VERCEL_TOKEN` for that user/team). Do not create a project under `arjun-automation1` — that would be a duplicate under the wrong owner.

## 3. Recovery — compare the two legitimate choices

### Choice A (recommended): restore Vercel as the origin

Prerequisites
- Access to Vercel account `riderarjun24359-sys` / team `ArjunAutomation` (slug `arjun-automation`), or a `VERCEL_TOKEN` + `VERCEL_ORG_ID` + `VERCEL_PROJECT_ID` with access to that project.
- Access to the Cloudflare zone for `arjunautomations.com`.

Steps
1. Confirm whether the project still exists (owning token required):
   `curl -s -H "Authorization: Bearer $VERCEL_TOKEN" "https://api.vercel.com/v9/projects/arjunautomationos-enterprise?teamId=$VERCEL_ORG_ID"`
   - `404` → recreate the project (re-import GitHub repo `1325528606`, root `/`), re-add **all** production env vars — the four that existed (`NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `PLATFORM_LEAD_API_KEY`) **plus** the missing cutover-critical/recommended `PLATFORM_ORGANIZATION_ID` and `SUPABASE_SERVICE_ROLE_KEY` — then re-add domains `www.arjunautomations.com` + `arjunautomations.com`.
   - `200` → proceed to step 2.
2. Produce a live production deployment:
   - Preferred: `gh workflow run production-deploy.yml -f action=deploy-production` (after setting `PRODUCTION_BASE_URL`; requires the `Production` gate to be satisfied).
   - Alternative: push to `main` (Git integration auto-deploys) or redeploy a previous deployment in the Vercel dashboard.
3. Verify the platform origin before touching DNS:
   `curl -fsS https://<project>.vercel.app/api/ops/live` → expect 200.
   `curl -fsS https://<project>.vercel.app/api/ops/ready` → expect 200 (needs Supabase env).
4. Repoint Cloudflare (see §4) and re-verify the custom domain.

Rollback
- Vercel: promote the previous deployment (Dashboard → Deployments → Promote), or redeploy a prior commit.
- Cloudflare: restore the previous proxied record (capture it first). See `docs/ROLLBACK_RUNBOOK.md`.

DNS/TLS implications
- Use the **exact values from the project's domain card** (`vercel domains inspect arjunautomations.com`). General-purpose values are apex `A 76.76.21.21` (newer projects may show a different anycast IP) and `www` `CNAME` to the project's target (e.g. `<hash>.vercel-dns-<n>.com`; the generic `cname.vercel-dns.com` also works).
- Because DNS is on **Cloudflare nameservers** (external to Vercel), the domain must be added in the Vercel project; Vercel then shows the required records.
- **Set the Cloudflare records to DNS-only (grey cloud) so Vercel can verify the domain and complete the SSL (ACME) challenge.** Vercel's KB (Jul 2026) is explicit: a proxied Cloudflare record sits between the public DNS answer and the A record Vercel expects and **blocks verification and the SSL challenge**. Once Vercel has issued the cert you may re-enable the proxy if you want Cloudflare's WAF — but keep SSL/TLS mode **Full (strict)** (never Flexible, which causes `err_too_many_redirects`).
- DNS-only means Vercel terminates TLS directly (simplest, but exposes the origin). Re-proxying later is optional and reversible.

Risks
- Domain must be verified inside the Vercel project or TLS will mismatch (525/526). **A proxied Cloudflare record prevents that verification** — do not leave it proxied during issuance.
- A stale apex `A` record from the previous host blocks verification — delete it first.
- Deleting/re-adding a project loses deployment history and env vars (must be re-entered).
- Brief propagation window; do it during a low-traffic period.

### Choice B: restore the Cloudflare Tunnel origin

Prerequisites
- Access to the Cloudflare Zero Trust account and the origin host that runs `cloudflared`.
- A running instance of the app on that origin (this repo) — i.e. a persistent host. This is **not** Vercel.

Steps
1. Identify the tunnel (`cfargotunnel.com` target) and its connector host; restart `cloudflared` / recreate the connector.
2. Confirm the origin serves `GET /api/ops/live` on the tunnel's ingress.
3. Verify the custom domain.

Rollback
- Stop the connector / revert the tunnel DNS target.

Risks
- The origin host may no longer exist; the tunnel may have pointed at a localhost dev server (never production-grade).
- Requires operating a persistent host (cost/ops) and **bypasses the Vercel pipeline entirely** — the deploy workflow becomes irrelevant.
- Recommended only if the tunnel was deliberate production infrastructure.

### Recommendation

**Choice A.** The project was Vercel-hosted with the custom domain assigned and a deploy pipeline exists; the Cloudflare tunnel appears stale/unrelated. Choice B is only correct if the tunnel is intentionally the production origin.

## 4. Cloudflare DNS record change (owner-only, for Choice A)

Current state (observed 2026-10-11 via public DNS): NS `lee.ns.cloudflare.com`/`angela.ns.cloudflare.com`; apex + `www` return Cloudflare **proxy** addresses (A `104.21.56.42`, `172.67.177.66`; AAAA `2606:4700:3033::6815:382a`, `2606:4700:3030::ac43:b142`) with a **disconnected Argo Tunnel** origin (HTTP 530 / 1033). **No MX, TXT/SPF, DKIM, DMARC, or CAA records exist.**

1. Record the **actual zone records** (not just the proxy answers) for rollback — Cloudflare Dashboard → DNS → Export. Capture: apex A/AAAA/CNAME + proxy status, `www` CNAME, and the tunnel CNAME/target. This is required because the proxy answers above hide the origin target.
2. Add the apex + `www` in the Vercel project, then read the exact targets with `vercel domains inspect arjunautomations.com` (owning account required).
3. In Cloudflare, replace the apex (`arjunautomations.com`) with `A → 76.76.21.21` (or the card's IP) and `www` with `CNAME → <card target>` (e.g. `<hash>.vercel-dns-<n>.com`). **Set both to DNS-only (grey cloud)** so Vercel can verify the domain and issue the certificate. Delete any stale records first.
4. Wait for the Vercel domain card to show "Valid Configuration" and TLS to issue, then confirm:
   `curl -fsS https://www.arjunautomations.com/api/ops/live`.
5. Optionally re-enable the Cloudflare proxy afterwards; if you do, set SSL/TLS mode = **Full (strict)**.

## 5. Staging procedure (dedicated Enterprise Supabase)

Do **not** activate/migrate/reset either EducationOS project (`ekmvevevzahjjhjmvmev`, `cohgrxjzricwhlbeoiyj`) — both are **INACTIVE** and belong to a different product.

Re-verified 2026-10-11: the authenticated CLI sees two orgs —
`riderarjun24359@gmail.com's Org` (`jvpmjlaehiwiyuxtzces`, holds the 2 inactive EducationOS projects)
and **`Arjun Automation` (`zmwxthjimwfbbwnbeomi`, 0 projects)** — so there is still **no** dedicated
Enterprise staging target.

1. Owner creates a **dedicated** free project in the `Arjun Automation` org (0 projects → within the
   free 2-project limit; **no charge**). Exact command (owner machine, authenticated CLI):
   ```bash
   npx supabase projects create arjun-enterprise-staging \
     --org-id zmwxthjimwfbbwnbeomi \
     --region ap-south-1 \
     --db-password '<GENERATED-STRONG-PASSWORD>'   # store ONLY in a secret manager, never in chat/repo
   ```
   If the org already holds 2 active projects the create will be rejected — do not upgrade to a paid plan
   without explicit owner approval (₹0 budget).
2. `npx supabase link --project-ref <new-ref>`; store the DB password only in a secret store (never in the repo/chat).
3. Apply, in order, on the isolated target:
   `202610100001_crm_rls_remediation.sql`, `202610100002_lead_consent_dedup.sql`, `202610100003_finance_invoice_guards.sql`.
4. Run RLS/cross-tenant isolation, consent/dedup, and finance invoice-guard tests against the isolated target.
5. Only after tenant-isolation evidence, promote to production with the rollback plan in `docs/ROLLBACK_RUNBOOK.md`.
6. `supabase/apply_all.sql` must be reconciled per `docs/APPLY_ALL_RECONCILIATION.md` — never blindly regenerated.

## 6. Preview deployment status

A safe preview deployment is **not available** with the existing local access: the only visible Vercel team (`arjun-automation1`) has no projects, so a preview would require creating a **duplicate** project (forbidden) and would run without the canonical `production` env-var scopes. Do not deploy a preview until the owning account/team is accessible.

## 7. Next executable command (owner)

```bash
# 0. Re-authenticate the Vercel CLI as the CANONICAL owner (currently the wrong
#    account, chittemprashantharjun-5618, is logged in):
npx vercel login            # sign in as riderarjun24359-sys / riderarjun24359@gmail.com
npx vercel teams switch arjun-automation     # team slug "arjun-automation"
npx vercel whoami           # must report riderarjun24359-sys

# 1. Confirm the project exists (owning token):
VERCEL_TOKEN=<owning-token> VERCEL_ORG_ID=<team_id> VERCEL_PROJECT_ID=<project_id> \
  node scripts/debug-vercel-auth.mjs
#   200 → deployments likely only expired; redeploy (step 2).
#   404 → recreate the project from GitHub repo 1325528606, re-add the 4 project
#         env vars + PLATFORM_ORGANIZATION_ID + SUPABASE_SERVICE_ROLE_KEY, and
#         re-add domains www + apex, then deploy.
#   NOTE: the workflow healthcheck probes live|ready|health|production|go-live with
#   `curl -fsS` (fails on HTTP>=400). Locally proven (2026-10-11) that with no
#   Supabase env: live=200 but ready/health/production/go-live=503 and
#   diagnostics=401. So a production deploy will FAIL its healthcheck until the
#   full production env (incl. PLATFORM_ORGANIZATION_ID + SUPABASE_SERVICE_ROLE_KEY)
#   is present on the project. Re-provision all cutover-critical/recommended vars first.

# 2. If it exists, produce a production deployment (OWNER APPROVAL REQUIRED):
gh workflow run production-deploy.yml -f action=deploy-production

# 3. Verify the platform origin, then repoint Cloudflare (§4).
```

`deploy-production` must **not** be dispatched until the owner approves. `PRODUCTION_BASE_URL` is now set and the workflow fails closed without it; the `Production` required-reviewer gate **cannot** be enabled on the current account plan (HTTP 422), so manual dispatch write-access is the only gate today.
