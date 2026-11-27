# Arjun Automation Multi-Business SaaS Foundation

## Product direction
One shared platform serving independent customer organizations (tenants) across Schools, Retail, Clinics, Service Businesses, and custom verticals. Each tenant has isolated data, roles, enabled products, branding, and optional mapped hostname.

## Domain strategy
- `arjunautomations.com`: public marketing site
- `app.arjunautomations.com`: tenant-aware customer app
- `admin.arjunautomations.com`: platform operator console (privileged server-side only)
- `api.arjunautomations.com`: API entry point (optional; same application initially)
- `demo.arjunautomations.com`: curated demo environment
- Tenant routing: `{tenant-slug}.arjunautomations.com` (wildcard DNS + wildcard TLS required)
- Custom domains are a later paid feature and require ownership verification before activation.

## Shared platform modules
1. Identity & access: Supabase Auth; profile-to-tenant memberships; role permissions.
2. Tenant provisioning: organization, unique slug, initial owner membership, default settings, enabled products.
3. Product catalog: school ERP, retail POS/inventory, clinic operations, business CRM, automation.
4. Tenant routing: host -> verified domain mapping -> tenant context. Never trust a client-provided tenant ID alone.
5. Isolation: tenant-scoped queries, Postgres RLS, server-side authorization, audit events, and automated cross-tenant tests.
6. Billing: plans, subscription state, usage limits and invoices (Razorpay integration later).
7. Admin: tenant lifecycle, product entitlements, domain verification, support access with audit trail.
8. Operations: backups, migration verification, logs, rate limits, incident/rollback runbook.

## MVP sequence
- Phase 0: inspect and reuse existing organization/membership/auth/RLS infrastructure (do not create parallel identity tables).
- Phase 1: product catalog + tenant product entitlements + tenant-domain mapping migration.
- Phase 2: secure tenant resolver and provisioning service; platform admin APIs must be service-role/server-only.
- Phase 3: unified tenant dashboard with vertical module cards; product-specific routes.
- Phase 4: onboard pilot tenants, test tenant isolation, then subscriptions and custom domains.

## Initial product catalog
- school: admissions, students, attendance, fees, timetable, parent notices
- retail: products, stock, sales, billing, supplier records
- clinic: patients, appointments, follow-ups, clinic staff (sensitive records; strict access)
- business: CRM, customers, jobs, invoices, reminders
- automation: workflows, WhatsApp integrations, AI agents (external provider credentials server-only)

## Host routing rules
- Reserve `www`, `app`, `admin`, `api`, `demo`, `status`, `support`, `mail`, `ftp`, `auth`, `assets`.
- Unknown subdomains resolve to a not-found/onboarding page, never to a tenant by fuzzy matching.
- Tenant slug and custom-domain mapping must be unique and validated.
- All URLs use HTTPS. Wildcard DNS does not replace wildcard certificate configuration.

## Security acceptance criteria
- Anonymous users cannot enumerate tenants, domains, or products.
- Signed-in users can only read organizations and memberships they belong to.
- Tenant context is derived from a validated host/domain mapping and membership is checked on every protected request.
- Tenant mutations are server-side; platform provisioning/domain activation never uses a browser anon key.
- Sensitive clinic data is segregated by role and tenant; audit logging is mandatory.
- Automated tests include tenant A attempting to read/write tenant B data (must fail).

## Current status
This document defines the implementation baseline. The additive database migration is prepared on the feature branch and is **not applied** to a hosted database. Review and run migration verification before applying.
