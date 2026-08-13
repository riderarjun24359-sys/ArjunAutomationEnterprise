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
