# Admin Guide

## Tenant Management

- Organizations scoped via `organization_id` on all business tables
- Membership enforced through `organization_members`
- Tenant isolation verified by Security Center org-isolation engine

## RBAC

Roles: `super_admin`, `admin`, `manager`, `member`, `viewer`

Permissions enforced server-side on shell layout and API routes via `requirePermission`.

## Security Center

Access `/security-center` for: authentication, MFA, RBAC, tenant isolation, API security, secrets, audit logs, threat detection.

## Customer Lifecycle

Default workflow: Lead → Proposal → Agreement → Onboarding → Project → Delivery → Invoice → Payment → Support → Renewal

Trigger via Mission Core Customer Lifecycle workflow or lead intake API.

## Audit

All API routes log to `audit_logs` with org-scoped RLS policies.
