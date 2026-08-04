# Security Policy

## Authentication

- Supabase Auth with session validation at middleware and server layout
- Fail-closed on protected routes when Supabase is not configured

## Authorization

- RBAC enforced server-side via `requirePermission` / `requireRole`
- API routes require authentication and permission checks
- No public business endpoints (lead intake requires platform API key)

## Tenant Isolation

- All queries scoped by `organization_id`
- Org isolation engine validates organization membership against database
- RLS policies on business and audit tables

## Audit

- `audit_logs` table with org-scoped RLS (`is_organization_member`)
- API routes log all mutations and exports
- Security Center audit engine persists via AuditRepository

## Rate Limiting

- API routes use Security Center rate limiter
- Lead intake: 10 req/min; exports: 30 req/min

## Secrets

- No hardcoded secrets in source
- Environment variables documented in `.env.example`
- Secrets engine validates required env keys at runtime

## Threat Model

See Security Center threat detection engine and Enterprise Identity integration.
