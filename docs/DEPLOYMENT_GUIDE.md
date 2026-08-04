# Deployment Guide

## Prerequisites

- Node.js 20+
- Supabase project with migrations applied
- Environment variables configured

## Steps

1. `npm ci`
2. Apply migrations: `npm run db:verify` then apply SQL from `supabase/`
3. Apply audit RLS remediation: `supabase/migrations/20260805_audit_rls_remediation.sql`
4. Set production env vars (see `.env.example`)
5. `npm run build`
6. `npm start`

## Verification Before Deploy

```bash
npm run production-remediation:verify
```

## Environment Variables

| Variable | Required | Purpose |
|---|---|---|
| NEXT_PUBLIC_SUPABASE_URL | Yes | Supabase project URL |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Yes | Public anon key |
| PLATFORM_LEAD_API_KEY | Yes (prod) | Lead intake API authentication |
| PLATFORM_ORGANIZATION_ID | Recommended | Default org for lead intake |
| SUPABASE_DB_URL | Optional | Direct migration apply |
