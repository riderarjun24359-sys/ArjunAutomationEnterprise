# Soft Launch — Custom Domain Readiness

## Canonical host

- Production host: `www.arjunautomations.com`
- Set `NEXT_PUBLIC_APP_URL` to the canonical HTTPS origin.

## DNS checklist

1. Apex A/ALIAS record to hosting / CDN
2. `www` CNAME to CDN or apex
3. Email authentication TXT records (SPF, DKIM, DMARC)
4. Optional CAA records for TLS authority

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

## Current production status (diagnosed 2026-10-11; read-only)

Observed evidence:

- `https://www.arjunautomations.com` and `https://arjunautomations.com` → **HTTP 530**, body `error code: 1033`, `server: cloudflare`, `cf-ray` present.
- Nameservers: `lee.ns.cloudflare.com`, `angela.ns.cloudflare.com` — DNS is managed by **Cloudflare**, not Vercel.
- Cloudflare **1033 = Argo Tunnel (cloudflared) error**: the proxied hostname resolves to a Cloudflare Tunnel whose origin connector is not connected. The custom domain is therefore **not** pointed at Vercel.
- The last successful Vercel deployments (2026-08-25, ref `fc7afbe`) are recorded in GitHub for two projects:
  - `arjun-automation-enterprise` → `https://arjun-automation-enterprise-al62eliwf-arjun-automation.vercel.app`
  - `arjunautomationos-enterprise` → `https://arjunautomationos-enterprise-dphwacbl0-arjun-automation.vercel.app`
  - All of these URLs, and the bare `*.vercel.app` hosts, now return **HTTP 404** → the deployments/projects are gone or no longer public.
- `vercel` CLI is not authenticated on this machine (`~/.local/share/com.vercel.cli` absent); the Vercel token exists only as a GitHub Actions secret (value unreadable). No Vercel API access is available locally.

Conclusion: production is down for **two independent reasons** — (1) the Cloudflare origin (tunnel) is disconnected (1033), and (2) the Vercel deployments the tunnel/domain would target no longer exist (404).

### Minimum owner actions to restore

1. **Vercel:** confirm which project (`arjun-automation-enterprise` vs `arjunautomationos-enterprise`) is canonical; if deleted, recreate/relink the repo and re-run the `Production Early Access Deploy` workflow (`workflow_dispatch`, action `deploy-production`) after setting `PRODUCTION_BASE_URL` to the assigned `*.vercel.app` origin.
2. **Cloudflare:** in the Cloudflare dashboard for `arjunautomations.com`, either
   - (a) restart/recreate the `cloudflared` tunnel and its connector to the live origin, or
   - (b) replace the tunnel/`CNAME` record with `cname.vercel-dns.com` (proxied) and add `www` + apex as custom domains in Vercel (TLS auto-provisioned).
3. Re-verify `GET /api/ops/live` and `GET /api/ops/ready` on the assigned origin before re-pointing DNS.

These are production DNS/tunnel/deployment changes and require explicit owner authorization; they were **not** performed automatically.

### Follow-up evidence (2026-10-11, read-only)

- Every `*.vercel.app` URL returns `server: Vercel` with `x-vercel-error: DEPLOYMENT_NOT_FOUND` (not just a bare 404) → no live deployment exists on the project aliases.
- The Vercel account that owns the app is `riderarjun24359-sys` / team `ArjunAutomation` (slug `arjun-automation`); the **local** Vercel CLI is authenticated to a different account (`chittemprashantharjun-5618`) whose team `arjun-automation1` lists **no projects**. The owning project is therefore not reachable from this machine.
- Full access matrix, workflow analysis, and the deterministic two-choice recovery plan are in **`docs/PRODUCTION_RECOVERY_RUNBOOK.md`**.
- The unmasked deploy log (run 32839678440) proves the project `arjunautomationos-enterprise` had `deploymentExpiration.expirationDaysProduction: 30` and last deployed 2026-08-25 (~47 days before this check) → the 404s are **most likely expired deployments, not a deleted project**. A definitely-nonexistent `*.vercel.app` host returns the identical `DEPLOYMENT_NOT_FOUND`, so only the owning account can confirm.
- DNS recon: nameservers are Cloudflare (`lee`/`angela.ns.cloudflare.com`); apex/`www` resolve to Cloudflare proxy IPs (A `104.21.56.42`, `172.67.177.66`; AAAA `2606:4700:...`) and the origin is a disconnected tunnel (1033). **No MX, TXT/SPF, DKIM, DMARC, or CAA records exist** for the zone → email authentication and inbound mail are not configured (a soft-launch gap independent of the website outage).
