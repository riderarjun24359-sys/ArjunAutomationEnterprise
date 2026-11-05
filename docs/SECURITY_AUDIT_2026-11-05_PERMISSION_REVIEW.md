# Supabase permission audit addendum — 2026-11-05

## Scope and method

Read-only catalog and privilege queries were run against the linked Supabase projects:

- Staging: `iplkndwkjuupktxwcksv` (`arjun-enterprise-staging`)
- Production: `ixassghxogcabfcyjjtz` (`arjun-enterprise-production`)

Both projects report `ACTIVE_HEALTHY` on PostgreSQL 17.11. No DDL, DML, grants, role assignments, migrations, or Auth settings were changed during this review.

## Confirmed findings

### 1. RLS-enabled tables without policies have bypass-capable table grants

- Staging: 32 public tables have RLS enabled and zero policies.
- Production: the same set plus `public.rate_limits` (33 total).
- The affected tables have broad grants to `anon` and `authenticated`, including `TRUNCATE` and `TRIGGER`.
- PostgreSQL `TRUNCATE` is not governed by row-level security. These grants therefore defeat the intended deny-all posture for tables with no policies.
- The default table ACLs for objects created by both `postgres` and `supabase_admin` also grant broad privileges to `anon` and `authenticated`, so the issue can recur for future tables.

**Required remediation design (not applied):**
1. Revoke `TRUNCATE`, `TRIGGER`, and `REFERENCES` from `anon` and `authenticated` on existing public tables and in the default table privileges for both object-creating roles.
2. Revoke all table privileges from `anon` and `authenticated` on RLS-enabled public tables that have no policies. Preserve `service_role` and owner privileges.
3. Add regression checks proving the roles cannot truncate or create triggers on these tables, while intended authenticated CRUD on policy-protected tables still works.
4. Review any future public table's intended API exposure explicitly instead of relying on broad default ACLs.

### 2. Security-definer helper functions

Both projects contain:
- `public.auth_profile_id()`
- `public.is_organization_member(uuid)`

Both are SECURITY DEFINER, owned by `postgres`, have `search_path=public`, and are executable by `anon`, `authenticated`, `service_role`, and effectively PUBLIC. Their bodies schema-qualify referenced objects. Policy catalog inspection found no anonymous policies using these helpers, while authenticated policies do use them extensively.

**Required remediation design (not applied):**
- Pin both functions to `search_path=pg_catalog`.
- Revoke EXECUTE from PUBLIC and `anon`.
- Grant EXECUTE to `authenticated` and `service_role`.
- Verify representative authenticated RLS policies and unauthenticated denial in staging before rollout.

Do not revoke authenticated execution: it is required by existing policy expressions.

### 3. Existing `rate_limits` schema drift

- Production has `public.rate_limits`, RLS enabled, zero policies, and broad grants to `anon` / `authenticated`, including `TRUNCATE` and `TRIGGER`.
- Staging has no `public.rate_limits` table.
- Production's table is not represented in the migration ledger; its origin remains unknown.
- Do not replay `202610300001_rate_limits.sql` or assume the production table matches the migration. First compare the complete table definition, constraints, indexes, owner, grants, dependencies, and row-count/data retention expectations. Preserve the production table's data.

### 4. Existing `set_updated_at()` warning

The function is a shared non-SECURITY-DEFINER trigger helper attached to 1,062 non-internal triggers in each environment. The repair branch includes migration `202611050006_set_updated_at_search_path.sql` to pin its search path. This migration remains unapplied and must be validated in staging before production.

### 5. Leaked-password protection

Supabase Auth's leaked-password protection is disabled in the current Security Advisor output. This is an Auth configuration control, not a SQL migration. Enable it in the Auth password/security settings after checking the project's Auth plan/configuration, then verify the resulting Auth configuration and signup/password-change behavior.

## Release gates still open

1. Evidence of a recent recoverable backup/restore point and a tested restore procedure. The connected project metadata endpoint does not expose backup inventory or restore-point verification.
2. Two authorized staging test identities belonging to separate organizations, plus a no-membership identity. Staging currently has no organization memberships; do not invent or elevate identities.
3. Authenticated live staging tests for same-tenant access, cross-tenant denial, no-membership denial, membership role changes, and relevant API routes.
4. SSO-authorized access to the staging preview. Do not disable or bypass deployment protection merely to make an automated test pass.
5. Reconciliation of production-only `rate_limits` schema drift.
6. Staging-first application and verification of reviewed migrations, followed by separate production release approval.

## Current decision

**No production or staging database changes were made.** The findings above are confirmed by catalog queries, but remediation is intentionally held until backup/restore evidence, authorized test identities, and protected staging access are available. CI passing does not replace these live-environment safety gates.


## Staging validation update — 2026-11-05

After staging access was confirmed, the isolated trigger-helper hardening migration was applied to **staging only** using the reviewed SQL:

```sql
ALTER FUNCTION public.set_updated_at() SET search_path = pg_catalog;
```

- Supabase reported the migration application succeeded.
- The staging migration ledger now records version `20261105153924`, name `set_updated_at_search_path`.
- A direct catalog query verified `public.set_updated_at()` has `proconfig = {search_path=pg_catalog}`.
- A fresh staging Security Advisor run no longer reports `function_search_path_mutable`.
- Production was not changed.
- The remote-generated migration version is not yet represented by a matching migration file in the repository. Reconcile this migration-history/source-file alignment before the next schema release; do not replay it on staging.
- Other staging findings remain: 31 RLS-enabled tables with no policies, two SECURITY DEFINER helpers callable by anon/authenticated, and leaked-password protection disabled.
- Authenticated tenant tests remain blocked: staging still has no membership rows and no authorized separate-tenant test identities have been confirmed. Staging preview remains SSO-protected.
- No production migrations, grants, role assignments, Auth settings, or data changes were made.

This is a limited staging hardening success, not production release approval.
