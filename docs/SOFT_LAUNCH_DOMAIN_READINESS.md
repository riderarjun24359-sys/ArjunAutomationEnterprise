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

## Current production status (updated 2026-10-11 after recovery)

**Vercel origin: RESTORED.** Project `arjunautomationos-enterprise`
(`prj_GoeJ31s6APxX5keDRCVarrgzObOc`, team `arjun-automation`) is live:
`https://arjunautomationos-enterprise.vercel.app` (production) and
`https://arjunautomationos-staging.vercel.app` (staging) both return `/` 200 and all ops endpoints
200 (`/api/ops/production` → `blockers: []`). Route smoke 59/59 on both. Staging RLS 11/11.
Custom domains `arjunautomations.com` + `www.arjunautomations.com` are assigned and **verified** in
the project (apex → 308 → `www`).

**Custom domain: still owner-blocked on DNS.** `https://www.arjunautomations.com` and the apex
still return **HTTP 530 / error 1033** because Cloudflare DNS proxied records point at a
**disconnected Argo Tunnel** and not at Vercel. Nameservers remain
`lee.ns.cloudflare.com`, `angela.ns.cloudflare.com`. This machine has **no Cloudflare access**, so the
records above must be applied by the owner. Once applied, the domain serves the live Vercel project.

### Owner action to finish (Cloudflare → DNS)

1. Replace apex + `www` records with the values in the DNS checklist above.
2. Set them **DNS-only (grey cloud)** so Vercel can verify the domain and issue TLS.
3. Re-verify `curl -fsS https://www.arjunautomations.com/api/ops/live` (expect 200).
4. Optionally re-enable the proxy afterwards with SSL/TLS = **Full (strict)**.

No MX/TXT (SPF/DKIM/DMARC) or CAA records exist yet; add them when email is required — they are
independent of the web records above.

### Historical diagnosis (pre-recovery, retained for reference)

- `https://www.arjunautomations.com` and `https://arjunautomations.com` → **HTTP 530**, body
  `error code: 1033`, `server: cloudflare` — a disconnected Cloudflare **Argo Tunnel**.
- The prior Vercel deployments (2026-08-25, ref `fc7afbe`) had expired/been removed and returned
  **HTTP 404 / `DEPLOYMENT_NOT_FOUND`**; the local `vercel` CLI was unauthenticated or on the wrong
  account. That was the second, independent failure.
- Recovery (D26–D28 in `docs/MISSION_CHECKLIST.md`) recreated the project, migrated a new production
  Supabase, redeployed, and re-verified — leaving only the Cloudflare DNS change above.

### Follow-up evidence (2026-10-11, read-only — SUPERSEDED by the recovery above)

> These observations describe the pre-recovery state. The Vercel side has since been restored
> (project recreated, deploy live, CLI authenticated as the canonical owner); only the Cloudflare
> DNS change remains.

- Every `*.vercel.app` URL returns `server: Vercel` with `x-vercel-error: DEPLOYMENT_NOT_FOUND` (not just a bare 404) → no live deployment exists on the project aliases.
- The Vercel account that owns the app is `riderarjun24359-sys` / team `ArjunAutomation` (slug `arjun-automation`); the **local** Vercel CLI is authenticated to a different account (`chittemprashantharjun-5618`) whose team `arjun-automation1` lists **no projects**. The owning project is therefore not reachable from this machine.
- Full access matrix, workflow analysis, and the deterministic two-choice recovery plan are in **`docs/PRODUCTION_RECOVERY_RUNBOOK.md`**.
- The unmasked deploy log (run 32839678440) proves the project `arjunautomationos-enterprise` had `deploymentExpiration.expirationDaysProduction: 30` and last deployed 2026-08-25 (~47 days before this check) → the 404s are **most likely expired deployments, not a deleted project**. A definitely-nonexistent `*.vercel.app` host returns the identical `DEPLOYMENT_NOT_FOUND`, so only the owning account can confirm.
- DNS recon: nameservers are Cloudflare (`lee`/`angela.ns.cloudflare.com`); apex/`www` resolve to Cloudflare proxy IPs (A `104.21.56.42`, `172.67.177.66`; AAAA `2606:4700:...`) and the origin is a disconnected tunnel (1033). **No MX, TXT/SPF, DKIM, DMARC, or CAA records exist** for the zone → email authentication and inbound mail are not configured (a soft-launch gap independent of the website outage).
