# Production Recovery Runbook — arjunautomations.com

**Status: RECOVERED (2026-10-11).** A replacement Vercel project is live and healthy, both
Supabase projects exist, and all environment/secrets are provisioned. **One owner-only action
remains: apply the Cloudflare DNS records in §2** (this machine has no Cloudflare access).

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
| Supabase staging | `iplkndwkjuupktxwcksv` | 63 migrations applied |
| Supabase production | `ixassghxogcabfcyjjtz` (`arjun-enterprise-production`, ap-south-1) | 63 migrations applied, platform org row present |
| Custom domain | `arjunautomations.com` / `www.arjunautomations.com` | **assigned + verified in Vercel; DNS still points at the dead Cloudflare tunnel (HTTP 530 / error 1033)** |
| GitHub repo | `riderarjun24359-sys/ArjunAutomationEnterprise` (`1325528606`) | secrets + variables synced |

**Only remaining production blocker:** the Cloudflare DNS records in §2 (§7 has the exact steps).
Separately, the **CI `VERCEL_TOKEN` repo secret is stale** (see §4) — it only affects the manual
`production-deploy.yml` path, **not** the live site, which the Git integration deploys.

---

## 1. Verified final state

### 1.1 Vercel

- Project `arjunautomationos-enterprise` — `framework: nextjs`, `nodeVersion: 24.x`, Git-linked to
  repo id `1325528606`, `productionBranch: main`, `ssoProtection: null` (deployment protection
  disabled so the site can be tested from outside).
- Production deployment: **Git-integration build of `main` commit `0ea0293`**,
  `https://arjunautomationos-enterprise-6x5pxyzzk-arjun-automation.vercel.app` (`READY`),
  aliased to `https://arjunautomationos-enterprise.vercel.app`. (An earlier CLI production deploy
  `...-junwa1z87-...` served the same content before the docs commit.)
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
  production database existed. **All 63 migrations applied**; only the platform organisation row
  (`11111111-1111-1111-1111-111111111111`, "Arjun Automation") was seeded — **no demo/customer data**.
- Staging has all 63 migrations; demo seeds are **not** applied.
- Live tenant-isolation harness against staging: **11/11 PASS** (user B sees only org B;
  cross-org INSERT denied 403; UPDATE/DELETE affect 0 rows; anon 401; org B intact).

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
  Full route smoke: **59/59 PASS** (includes synthetic lead intake + dedup + fail-closed webhook).
- **Staging** `https://arjunautomationos-staging.vercel.app`: same ops endpoints 200;
  route smoke **59/59 PASS**.
- **Local**: `npx tsc --noEmit` 0; `test:unit` **117/117 (35 files)**; `next build` OK;
  `eslint .` 0 errors; `npm audit --omit=dev` 0 vulnerabilities; `db:verify` 63 migrations /
  1178 tables; `db:validate` apply_all.sql on PGlite + 50 seeds PASS; `git diff --check` clean.
- Synthetic smoke-test leads created during verification were **deleted** afterwards
  (1 production, 2 staging) so production contains no test/customer data.

---

## 2. Owner action required — Cloudflare DNS (the only remaining step)

`arjunautomations.com` is on Cloudflare nameservers (`lee.ns.cloudflare.com`,
`angela.ns.cloudflare.com`). Today apex + `www` answer Cloudflare **proxy** IPs whose origin is a
**disconnected Argo Tunnel** → HTTP **530 / error 1033**. Vercel already owns/verifies the domain,
so only the records need to change.

**Exact records Vercel requires** (from the project's domain config, 2026-10-11):

| Type | Name | Value(s) | Proxy |
|---|---|---|---|
| A | `arjunautomations.com` (apex) | `216.198.79.1` **and** `64.29.17.1` (rank 1; fallback `76.76.21.21`) | **DNS-only (grey cloud)** |
| CNAME | `www.arjunautomations.com` | `8f8ccb61a152a669.vercel-dns-017.com` (rank 1; fallback `cname.vercel-dns.com`) | **DNS-only (grey cloud)** |

Steps (owner, in Cloudflare → DNS):

1. **Export/record the current zone records first** (Cloudflare → DNS → Export) for rollback —
   capture the apex A/AAAA, the `www` record, and the tunnel CNAME target.
2. Delete/replace the stale apex and `www` records with the values above.
3. Set both to **DNS-only (grey cloud)**. A proxied (orange-cloud) record blocks Vercel's domain
   verification and the ACME/SSL challenge.
4. Wait until the Vercel domain card shows "Valid Configuration" and TLS is issued, then verify:
   ```bash
   curl -fsS https://www.arjunautomations.com/api/ops/live    # expect 200
   curl -fsS https://www.arjunautomations.com/api/ops/ready   # expect 200
   curl -fsS https://arjunautomations.com/api/ops/live        # expect 200 (then 308 -> www)
   ```
5. Optional: re-enable the Cloudflare proxy afterwards. If you do, set SSL/TLS = **Full (strict)**
   (never *Flexible* — it causes `err_too_many_redirects`).

There are currently **no MX, TXT/SPF, DKIM, DMARC, or CAA records** on the zone; if email is needed
later, add those *in addition to* (not instead of) the records above.

---

## 3. What the recovery actually did

1. Confirmed the old project/deployments were gone and the local CLI could authenticate as the
   canonical owner (`riderarjun24359-sys` / team `arjun-automation`).
2. **Created** project `arjunautomationos-enterprise` (no duplicate; the previous one no longer
   existed), re-imported the GitHub repo, set `framework: nextjs`, and disabled deployment protection.
3. Set **all** production + preview env vars (the previous project had only four, and was missing
   cutover-critical `PLATFORM_ORGANIZATION_ID` + `SUPABASE_SERVICE_ROLE_KEY`).
4. Created an isolated **free** production Supabase project (`ixassghxogcabfcyjjtz`), applied all
   63 migrations, and seeded only the platform organisation row.
5. Deployed with the Vercel CLI (first deploy had `framework: null` → every route 404; fixed by
   setting `framework: nextjs` and redeploying), then aliased to the production URL and verified
   every ops endpoint + the 59-route smoke suite.
6. Re-added both custom domains to the project and set the apex → `www` **308** redirect.
7. Synced GitHub repo secrets/variables so `production-deploy.yml` can deploy.

> The Git-integration deployment of the pre-recovery commit `3448462` was **BLOCKED**
> ("Vercel couldn't find a Git account for the commit author") because the commit author email was
> the local `*.local` fallback. The repo-local `user.email` was reset to the GitHub-linked noreply
> address; the next commit (`0ea0293`) then built via Git integration to **`READY`** and the
> production alias now serves it — **auto-deploy from `main` is confirmed working.**

---

## 4. `production-deploy.yml` status

- Trigger: **`workflow_dispatch` only**; input `action` = `none` / `register-gemini` /
  `deploy-production`.
- `deploy-production`: verify → build-and-deploy (Vercel REST `POST /v13/deployments`) →
  **healthcheck** (`curl -fsS` against `PRODUCTION_BASE_URL`) → rollback notes.
- Fixed / hardened: `PRODUCTION_BASE_URL` is set; the workflow now fails closed before building if
  `PRODUCTION_BASE_URL` or the `VERCEL_*` secrets are missing; `register-gemini` refuses to run
  without `ADMIN_USER_ID`/`ADMIN_EMAIL`/`ADMIN_FULL_NAME`.
- **Known limitation:** its healthcheck targets `https://www.arjunautomations.com`, which stays
  **530** until §2 is done. The workflow therefore **cannot pass until the DNS records are applied**.

### Dispatch result (2026-10-11, run `38138961359`, action `deploy-production`)

Dispatched once to validate CI + secrets. Real outcome:

| Job | Result |
|---|---|
| `Production verify` (`production:verify` + `go-live:verify`) | **success** |
| `Build and Deploy to Vercel` | **failure** — `curl` exit 22, HTTP **403** on `POST /v13/deployments` |
| `Post-deploy health checks` | skipped (needs `build-and-deploy`) |
| `Publish rollback strategy` | skipped (needs `build-and-deploy`) |

- **CI verification passes** with the current repo secrets/variables.
- **The `VERCEL_TOKEN` repo secret is stale/invalid** (HTTP 403). It **cannot** be replaced from
  this machine: `POST /v3/user/tokens` and `vercel tokens create` both return
  **`403 Cannot create tokens for this app`** (OAuth-app restriction). **Owner action:** create a
  token at Vercel → Account Settings → Tokens, then
  `gh secret set VERCEL_TOKEN -R riderarjun24359-sys/ArjunAutomationEnterprise`.
- **Git-integration deploys are unaffected** (they use the Vercel GitHub App, not `VERCEL_TOKEN`) —
  that is why pushes to `main` still build and promote to production (§1.1, D29).
- Even after the token is refreshed, the workflow's healthcheck keeps failing until §2 DNS is applied.

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

Preview deployments are available again and were verified (59/59). The previous blocker (wrong
account, zero projects) no longer applies.

---

## 7. Next commands

### Owner — finish the domain (the only outstanding action)

Apply the §2 Cloudflare records, then:

```bash
curl -fsS https://www.arjunautomations.com/api/ops/live
curl -fsS https://www.arjunautomations.com/api/ops/ready
```

### Owner — refresh the CI token (independent of DNS)

The manual workflow needs a valid `VERCEL_TOKEN`:

```bash
# Create a token at Vercel → Account Settings → Tokens, then:
gh secret set VERCEL_TOKEN -R riderarjun24359-sys/ArjunAutomationEnterprise
```

### Owner — validate the production workflow (after DNS works)

```bash
gh workflow run production-deploy.yml -f action=deploy-production   # OWNER APPROVAL REQUIRED
```

### Routine deploy

Git-integration auto-deploys `main` to production (commit author is now GitHub-linked), or:

```bash
npx vercel deploy --prod --scope arjun-automation
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
