# Soft Launch — Custom Domain Readiness

## Canonical host

- Production host: `www.arjunautomations.com`
- Set `NEXT_PUBLIC_APP_URL` to the canonical HTTPS origin.

## DNS checklist

1. Apex A/ALIAS record to hosting / CDN
2. `www` CNAME to CDN or apex
3. Email authentication TXT records (SPF, DKIM, DMARC)
4. Optional CAA records for TLS authority

### Exact records required by Vercel (captured 2026-10-11)

| Type | Name | Value(s) | Proxy |
| --- | --- | --- | --- |
| A | `arjunautomations.com` (apex) | `216.198.79.1`, `64.29.17.1` (fallback `76.76.21.21`) | **DNS-only** during verification |
| CNAME | `www.arjunautomations.com` | `8f8ccb61a152a669.vercel-dns-017.com` (fallback `cname.vercel-dns.com`) | **DNS-only** during verification |

The apex is configured in Vercel to **308-redirect to `www`**. A proxied (orange-cloud) Cloudflare
record blocks Vercel domain verification and the SSL (ACME) challenge; re-enable the proxy only after
the certificate is issued, and then keep SSL/TLS = **Full (strict)**.

## Application configuration

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `PLATFORM_LEAD_API_KEY`
- `PLATFORM_ORGANIZATION_ID`

## Branding assets

- Favicon: `/brand/favicon.svg`
- Logo: `/brand/logos/favicon.svg`
- Open Graph default: `/launch-kit/og-default.svg`
- PWA manifest: `/manifest.webmanifest` (generated from `app/manifest.ts`)

## Email templates

Markdown templates live under `src/modules/company-launch-kit/content/emails/` and soft-launch copies under `src/modules/soft-launch/content/emails/`.

## Current production status (updated 2026-10-11 — verified live)

**Vercel origin: RESTORED.** Project `arjunautomationos-enterprise`
(`prj_GoeJ31s6APxX5keDRCVarrgzObOc`, team `arjun-automation`) is live:
`https://arjunautomationos-enterprise.vercel.app` (production) and
`https://arjunautomationos-staging.vercel.app` (staging) both return `/` 200 and all ops endpoints
200 (`/api/ops/production` → `blockers: []`). Route smoke **125/125** static routes on production.

**Custom domain: LIVE and VERIFIED.** `https://www.arjunautomations.com` serves `/` + all ops
endpoints **200** over a valid Let's Encrypt certificate (`CN=www.arjunautomations.com`, valid to
2026-11-08); the apex `https://arjunautomations.com` returns **308 → `https://www.arjunautomations.com/`**.
Public DNS now matches Vercel's required values **exactly** — apex `A 216.198.79.1` + `64.29.17.1`
(Vercel `recommendedIPv4` rank 1) and `www` `CNAME 8f8ccb61a152a669.vercel-dns-017.com` (Vercel
`recommendedCNAME` rank 1). Both domains report `verified: true` in the Vercel project. Nameservers
remain `lee.ns.cloudflare.com`, `angela.ns.cloudflare.com`. The record change was performed by the
owner (this machine has no Cloudflare access); it is confirmed from the authoritative public DNS
answers that match Vercel's config, and from Vercel having issued TLS + served traffic.

**CI deploy pipeline: GREEN.** `production-deploy.yml` run `38145177440` succeeded end-to-end (the
owner refreshed the previously stale `VERCEL_TOKEN`), creating production deployment
`dpl_4VaWTXFH965BFiCsxcWoDfWsJtLr` (commit `b35e239`).

### Optional follow-ups (do not block the website)

1. **Email authentication:** no MX/TXT (SPF/DKIM/DMARC) or CAA records exist yet — add them when
   email is required; they are independent of the web records above. Record *shapes* (values come
   from the provider the owner chooses — Resend or the SMTP provider):
   - `TXT @` → `v=spf1 include:<provider-spf> ~all` (exactly one SPF record per domain)
   - `TXT <selector>._domainkey` → the provider's DKIM public key (Resend/SMTP dashboards show the selector + value)
   - `TXT _dmarc` → `v=DMARC1; p=quarantine; rua=mailto:<owner-mailbox>` (start `p=none` while testing, then quarantine/reject)
   - `MX` only if the domain must *receive* mail ( stubbornly optional for send-only setups)
   - Optional `CAA 0 issue "letsencrypt.org"` to pin TLS issuance
   Keep all of these **DNS-only**; they do not interact with the orange-cloud proxy setting.
2. **Cloudflare proxy:** if re-enabled (orange cloud), set SSL/TLS = **Full (strict)**; never
   *Flexible* (causes `err_too_many_redirects`). The `production-deploy.yml` healthcheck targets
   `https://www.arjunautomations.com`, so it must stay reachable.

### Historical diagnosis (pre-recovery, retained for reference)

- `https://www.arjunautomations.com` and `https://arjunautomations.com` → **HTTP 530**, body
  `error code: 1033`, `server: cloudflare` — a disconnected Cloudflare **Argo Tunnel**.
- The prior Vercel deployments (2026-08-25, ref `fc7afbe`) had expired/been removed and returned
  **HTTP 404 / `DEPLOYMENT_NOT_FOUND`**; the local `vercel` CLI was unauthenticated or on the wrong
  account. That was the second, independent failure.
- Recovery (D26–D28 in `docs/MISSION_CHECKLIST.md`) recreated the project, migrated a new production
  Supabase, redeployed, and re-verified — leaving only the Cloudflare DNS change, which is now done.

### Follow-up evidence (2026-10-11, read-only — SUPERSEDED by the recovery above)

> These observations describe the pre-recovery state. The Vercel side has since been restored
> (project recreated, deploy live, CLI authenticated as the canonical owner); only the Cloudflare
> DNS change remains.

- Every `*.vercel.app` URL returns `server: Vercel` with `x-vercel-error: DEPLOYMENT_NOT_FOUND` (not just a bare 404) → no live deployment exists on the project aliases.
- The Vercel account that owns the app is `riderarjun24359-sys` / team `ArjunAutomation` (slug `arjun-automation`); the **local** Vercel CLI is authenticated to a different account (`chittemprashantharjun-5618`) whose team `arjun-automation1` lists **no projects**. The owning project is therefore not reachable from this machine.
- Full access matrix, workflow analysis, and the deterministic two-choice recovery plan are in **`docs/PRODUCTION_RECOVERY_RUNBOOK.md`**.
- The unmasked deploy log (run 32839678440) proves the project `arjunautomationos-enterprise` had `deploymentExpiration.expirationDaysProduction: 30` and last deployed 2026-08-25 (~47 days before this check) → the 404s are **most likely expired deployments, not a deleted project**. A definitely-nonexistent `*.vercel.app` host returns the identical `DEPLOYMENT_NOT_FOUND`, so only the owning account can confirm.
- DNS recon: nameservers are Cloudflare (`lee`/`angela.ns.cloudflare.com`); apex/`www` resolve to Cloudflare proxy IPs (A `104.21.56.42`, `172.67.177.66`; AAAA `2606:4700:...`) and the origin is a disconnected tunnel (1033). **No MX, TXT/SPF, DKIM, DMARC, or CAA records exist** for the zone → email authentication and inbound mail are not configured (a soft-launch gap independent of the website outage).
