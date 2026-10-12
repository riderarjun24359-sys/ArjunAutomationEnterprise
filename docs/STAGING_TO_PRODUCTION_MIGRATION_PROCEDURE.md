# Staging → Production migration procedure (prepared hardening set)

**Status of this document:** the operator runbook for applying the prepared RLS
migrations. **Nothing here has been applied by the engineering session that wrote
it** — no database was reachable (see "Why this is a manual step"). Every command
is copy-pasteable into the Supabase dashboard SQL Editor.

## Which databases

| Environment | Project ref | Apply order |
| --- | --- | --- |
| Staging (first) | `iplkndwkjuupktxwcksv` | always staging first, then re-probe |
| Production (only after staging passes) | `ixassghxogcabfcyjjtz` | same order, same probes |

## Why this is a manual step

The engineering environment has **no database reachability**:

- no `supabase` binary on PATH and no `SUPABASE_ACCESS_TOKEN` for the CLI (the
  bundled CLI at `node_modules/.bin/supabase` is unauthenticated);
- no `SUPABASE_DB_URL` / `DATABASE_URL` locally (`.env.local` holds only a Vercel
  OIDC token);
- Docker daemon is down (no local Supabase stack);
- the only workflow is `.github/workflows/production-deploy.yml`
  (`workflow_dispatch`), and it does **not** apply migrations.

`scripts/apply-migrations.mjs` (`npm run db:apply`) requires `SUPABASE_DB_URL`
(or `DATABASE_URL`). `scripts/check-remote-schema.mjs` (`npm run db:check-remote`)
requires `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`. None are
present, so the apply is an owner action through the dashboard or the Management
API. **Do not paste secrets into chat or tickets.**

Local semantics are proven by `npm run rls:verify` (embedded PostgreSQL 17, full
chain, 21 probes incl. 2 negative controls) — that is *not* evidence of a remote
apply.

## 0. Preconditions (do all of these before touching staging)

1. Dashboard access to the staging project with SQL Editor rights.
2. A **second** test identity that is a member of a *different* organization
   (for cross-tenant negative probes), and a brand-new signed-up identity with no
   membership (for the bootstrap probe).
3. A recent backup / restore point for staging (Supabase → Database → Backups).
4. `docs/OWNER_ACTIONS.md §6b` open beside this document.

## 1. Capture pre-state (read-only — run on staging, keep the output as the rollback artifact)

```sql
-- 1a. Current policies on the affected tables.
select tablename, policyname, cmd, roles, qual, with_check
from pg_policies
where schemaname = 'public'
  and tablename in (
    'organizations','organization_members','user_profiles',
    'crm_clients','crm_leads','crm_deals','crm_activities','crm_tasks',
    'sales_leads','invoices','payments','organization_invitations',
    'project_management','storage_objects',
    'csg_success_plans','csg_onboarding_sessions','csg_delivery_milestones',
    'csg_feedback_responses','csg_escalations','csg_renewals',
    'csg_improvement_items','csg_audit_logs',
    'de_blueprints','de_components','de_engagements','de_pipeline_runs',
    'de_quality_verifications','de_knowledge_entries','de_analytics_metrics',
    'de_ai_recommendations',
    'executive_recommendations','executive_collaboration',
    'executive_audit_logs','executive_approvals',
    'eae_agent_tasks','eae_recommendations','eae_collaboration_events',
    'eae_approval_requests',
    'pr_readiness_snapshots','pr_system_alerts',
    'executive_agents','executive_tasks','executive_agent_metrics',
    'executive_health','executive_memory',
    'integration_webhooks','integration_deliveries'
  )
order by tablename, policyname;

-- 1b. Duplicate / invalid data that blocks the finance + lead indexes
--     (see the precheck queries in §2, steps 3 and 4). Row counts:
select 'crm_clients' t, count(*) from public.crm_clients
union all select 'invoices', count(*) from public.invoices
union all select 'payments', count(*) from public.payments
union all select 'sales_leads', count(*) from public.sales_leads
union all select 'organizations', count(*) from public.organizations
union all select 'organization_members', count(*) from public.organization_members
union all select 'project_management', count(*) from public.project_management
union all select 'storage_objects', count(*) from public.storage_objects
union all select 'csg_success_plans', count(*) from public.csg_success_plans
union all select 'de_blueprints', count(*) from public.de_blueprints
union all select 'executive_recommendations', count(*) from public.executive_recommendations
union all select 'executive_approvals', count(*) from public.executive_approvals;

-- 1c. Who holds a platform-admin role (needed before 202610120002, §2 step 5):
select p.email, m.organization_id, m.role_name, m.is_active
from public.organization_members m
join public.user_profiles p on p.id = m.user_id
where m.role_name = 'super_admin' and m.is_active
order by p.email;
```

**Expected pre-state (what the current chain leaves):** `orgs_select` and
`orgs_update` on `organizations`, `memberships_select` on `organization_members`,
and `profiles_select` / `profiles_update` on `user_profiles` are `USING (true)`
for `authenticated`; `memberships_insert` allows `user_id = auth_profile_id()`
into **any** organization. `project_management` and `storage_objects` carry
`USING (true)` / `WITH CHECK (true)` select/insert/update; the 31 module tables
(`csg_*`, `de_*`, `executive_*`, `eae_*`, `pr_*`) have **no policies at all**.
If §1b shows rows in `project_management` / `storage_objects`, their open
policies are a *live* cross-tenant hole, not a latent one — prioritize step 6.
If the pre-state already differs (a migration was partly applied), stop and
reconcile against `supabase/apply_all.sql` first.

## 2. Apply order (staging, one file at a time)

Paste each file's full contents into the SQL Editor and run. Each migration is
wrapped in its own `do $$ … $$` / idempotent `drop policy if exists … create
policy …`, so re-running is safe. Wrap manual runs in `begin; … commit;` if you
want an all-or-nothing apply.

1. **`202610120001_org_membership_escalation_lockdown.sql`** — *apply first,
   critical.* Fixes the live self-join escalation and `orgs_update USING(true)`.
   No data prerequisite.
2. **`202610100001_crm_rls_remediation.sql`** — replaces the open `USING(true)`
   policies on the legacy `crm_*` tables with `is_organization_member(...)` and
   revokes anon. No data prerequisite (those tables are orphaned; live code uses
   `clients`/`sales_*`).
3. **`202610100002_lead_consent_dedup.sql`** — adds consent columns + partial
   unique `(organization_id, lower(email))`.
   **Precheck (must return 0 rows) — clean *before* applying:**
   ```sql
   select organization_id, lower(email) e, count(*)
   from public.sales_leads group by 1,2 having count(*) > 1;
   ```
4. **`202610100003_finance_invoice_guards.sql`** — unique
   `(organization_id, lower(number))`, status allowlist, non-negative amounts,
   `amount_paid <= total`.
   **Precheck (must return 0 rows) — resolve via the Finance manual
   payment-confirmation path, never a silent adjust:**
   ```sql
   select organization_id, lower(number) n, count(*)
   from public.invoices group by 1,2 having count(*) > 1;
   select id from public.invoices
   where total < 0 or amount_paid < 0 or amount_paid > total;
   ```
5. **`202610120002_read_scope_lockdown.sql`** — *HELD / apply LAST, and only after
   step 5a.* Narrows authenticated READS of `organizations`,
   `organization_members` and `user_profiles` to member/platform-admin scope.

   **5a. Prerequisite (do this on staging BEFORE applying step 5):** ensure at
   least one operator holds an active `super_admin` membership — that is the
   DB-visible platform-admin marker `public.is_platform_admin()` reads.
   ```sql
   -- Example: promote an existing operator inside the platform org.
   update public.organization_members m
   set role_name = 'super_admin', updated_at = now()
   from public.user_profiles p
   where m.user_id = p.id
     and p.email = '<operator-email>'
     and m.organization_id = '<platform-org-uuid>';
   ```
   Then confirm `select public.is_platform_admin();` (as that user's JWT) returns
   true. Without this, platform-wide analytics correctly return only the
   operator's own org — so grant the role first, do not skip.

   **Effect to expect after step 5:** the legacy "adopt a memberless
   organization" bootstrap in `src/modules/database/lib/organization-context.ts`
   becomes unreachable for unprovisioned users (they can no longer list
   memberless orgs) — a signed-in user with no membership now resolves to `null`
   (fail closed) until provisioned through the `/onboarding` wizard, which uses
   the service-role provisioning route. This is intentional.

6. **`202610120003_legacy_table_rls_lockdown.sql`** — closes the last open policies
   (`project_management`, `storage_objects` still had foundation
   `USING(true)`/`WITH CHECK(true)` — cross-tenant read+write for any authenticated
   user). Both are currently orphaned/unused, but the open policies are a latent
   hole. Tightens them to `is_organization_member(organization_id)`. No data
   prerequisite. After this, `npm run rls:audit` exits 0 (no open policies on any
   tenant table).
7. **`202610120004_module_tables_tenant_reads.sql`** — grants minimal org-scoped
   SELECT/INSERT/UPDATE to the 20 module tables behind the CSG, delivery-engine,
   and executive-ai dashboards (all repository queries already filter by
   `organization_id`; no DELETE — no code path deletes). No data prerequisite.
   After this, those dashboards read their own org's rows instead of empty sets,
   cross-tenant access stays denied (`rls:verify` module block: 48 probes), and
   the 11 orphaned/dead tables (`eae_*`, `pr_*`, 5 unused `executive_*`) stay
   fully locked.
8. **`202610120005_integration_webhooks.sql`** — creates `integration_webhooks`
   (named targets: URL + HMAC secret + host allowlist) and `integration_deliveries`
   (append-only log) with the repo-standard SELECT/INSERT/UPDATE trio
   (`is_organization_member`, no DELETE). Enables the automation engine's `webhook`
   action end to end. No data prerequisite. Secrets are readable by org members
   under RLS (org trust boundary — same as every other org row); the service
   resolves them server-side only, never through action configs.

## 3. Positive / negative probes (staging, after each file; full set after step 8)

Use the anon key + a real signed-in JWT over `https://<staging-ref>.supabase.co/rest/v1/`.
`$ANON` and `$JWT_A` / `$JWT_B` are key/ token values kept in your shell only.

| # | Probe | Expected |
| --- | --- | --- |
| 1 | anon `GET /organization_members?select=*` | `[]` or 401 |
| 2 | anon `GET /organizations?select=*` | `[]` or 401 |
| 3 | A (member of org A) `GET /organizations?id=eq.<orgA>` | 1 row (own org) |
| 4 | A `GET /organizations?id=eq.<orgB>` | `[]` (cross-org denied) |
| 5 | A `POST /organization_members` `{organization_id:<orgB>, user_id:<A-profile>, role_name:'member'}` | 401/403 — **self-join blocked** |
| 6 | A `PATCH /organizations?id=eq.<orgB>` `{name:'hacked'}` | `[]` (0 rows updated) |
| 7 | A `GET /user_profiles?id=eq.<profileB>` | `[]` (cross-org profile denied) |
| 8 | A `GET /organization_members?organization_id=eq.<orgB>` | `[]` |
| 9 | A `GET /invoices?organization_id=eq.<orgB>` | `[]` |
| 10 | brand-new user `GET /api/organization/provision` | `needsProvisioning: true`, `organization: null` |
| 11 | brand-new user `POST /api/organization/provision` (create org) | 201; then `GET /organization_members` shows them as `founder` of their **own** org only |
| 12 | member invites `admin` | 403 (`Cannot invite…`) |
| 13 | founder invites `member`; invitee `GET /api/organization/invitations/mine`; `POST …/accept` | invite visible, accept succeeds, membership created |
| 14 | platform admin (post step 5a) `GET /organizations?select=*` | all orgs (analytics still work) |
| 15 | A `GET /project_management?select=*` and `GET /storage_objects?select=*` | `[]` (step 6 locked the last open policies) |
| 16 | A `POST /project_management` any row in org B | 401/403 — cross-org insert blocked |
| 17 | A (member of org A) `GET /csg_success_plans?organization_id=eq.<orgA>` | own org's rows (step 7 enabled the dashboard reads) |
| 18 | A `GET /csg_success_plans?organization_id=eq.<orgB>` (and same for `de_blueprints`, `executive_recommendations`, `executive_approvals`) | `[]` (cross-org denied) |
| 19 | B (member of org B only) `GET /csg_success_plans?organization_id=eq.<orgA>` | `[]` (negative control from the other side) |
| 20 | A `GET /integration_webhooks?organization_id=eq.<orgA>` | own org's named targets (**without** `secret` values in any list response) |
| 21 | A `GET /integration_webhooks?organization_id=eq.<orgB>` and `GET /integration_deliveries?organization_id=eq.<orgB>` | `[]` (cross-org denied) |
| 22 | `POST` a webhook delivery to an org-B-owned URL from an org-A workflow run | blocked; delivery row (if any) lands under org A only |

Local mirror of probes 3–9, 14 and the platform-admin case: `npm run rls:verify`
(82 probes, incl. the module-table block: same-tenant positive reads,
cross-tenant SELECT/INSERT/UPDATE denied, memberless sees nothing, and a
policy-shape assertion over all 20 enabled tables). Open-policy scan:
`npm run rls:audit` must exit 0 with WARN listing only the 11 intentionally
locked tables (`eae_*`, `pr_*`, 5 unused `executive_*`).

## 4. Expected results

- Steps 1–4: "Success. No rows returned." Re-running the §1a query shows the
  `crm_*`/org/member/finance policies narrowed; `db:verify`/`db:validate` still
  pass locally.
- Step 5: the same, plus `user_profiles` reads narrowed; probe 14 passes only
  when step 5a ran.
- Step 6: probes 15–16 deny; `project_management` / `storage_objects` policies
  show `is_organization_member(organization_id)` in the §1a re-query.
- Step 7: probes 17–19 pass (own-org module rows readable, cross-org denied);
  the §1a re-query shows the `{table}_select|_insert|_update` trio on all 20
  enabled tables and still zero policies on the 11 locked ones.
- Step 8: probes 20–22 pass; `integration_webhooks` / `integration_deliveries`
  show the policy trio; no `secret` value ever appears in a list response.

## 5. Recovery / rollback

Every object here is a policy drop/create, so rollback is restoring the captured
pre-state DDL from §1a. The exact pre-state definitions:

```sql
-- Undo 202610120001
drop policy if exists orgs_update on public.organizations;
create policy orgs_update on public.organizations for update to authenticated
  using (true) with check (true);
drop policy if exists memberships_insert on public.organization_members;
create policy memberships_insert on public.organization_members for insert to authenticated
  with check (user_id = public.auth_profile_id() or public.is_organization_member(organization_id));

-- Undo 202610120002
drop policy if exists orgs_select on public.organizations;
create policy orgs_select on public.organizations for select to authenticated using (true);
drop policy if exists memberships_select on public.organization_members;
create policy memberships_select on public.organization_members for select to authenticated using (true);
drop policy if exists profiles_select on public.user_profiles;
create policy profiles_select on public.user_profiles for select using (true);
drop policy if exists profiles_update on public.user_profiles;
create policy profiles_update on public.user_profiles for update using (true) with check (true);
drop function if exists public.organization_is_memberless(uuid);
drop function if exists public.is_platform_admin();
drop function if exists public.shares_organization_with(uuid);

-- Undo 202610120003 (restores the open foundation policies — only do this to
-- back out the whole step; the pre-state §1a output is authoritative)
drop policy if exists projects_select on public.project_management;
create policy projects_select on public.project_management for select using (true);
drop policy if exists projects_insert on public.project_management;
create policy projects_insert on public.project_management for insert with check (true);
drop policy if exists projects_update on public.project_management;
create policy projects_update on public.project_management for update using (true) with check (true);
drop policy if exists storage_select on public.storage_objects;
create policy storage_select on public.storage_objects for select using (true);
drop policy if exists storage_insert on public.storage_objects;
create policy storage_insert on public.storage_objects for insert with check (true);
drop policy if exists storage_update on public.storage_objects;
create policy storage_update on public.storage_objects for update using (true) with check (true);

-- Undo 202610120004 (drops the 60 added policies; tables return to full deny,
-- which was the pre-state — nothing to restore)
-- Undo 202610120005 (drops the 6 added policies; same full-deny pre-state)
do $$
declare tbl text;
begin
  foreach tbl in array array[
    'csg_success_plans','csg_onboarding_sessions','csg_delivery_milestones',
    'csg_feedback_responses','csg_escalations','csg_renewals',
    'csg_improvement_items','csg_audit_logs',
    'de_blueprints','de_components','de_engagements','de_pipeline_runs',
    'de_quality_verifications','de_knowledge_entries','de_analytics_metrics',
    'de_ai_recommendations',
    'executive_recommendations','executive_collaboration',
    'executive_audit_logs','executive_approvals',
    'integration_webhooks','integration_deliveries'
  ] loop
    execute format('drop policy if exists %I_select on public.%I', tbl, tbl);
    execute format('drop policy if exists %I_insert on public.%I', tbl, tbl);
    execute format('drop policy if exists %I_update on public.%I', tbl, tbl);
  end loop;
end $$;
```

Data changes from steps 3–4 (unique indexes) are additive; to remove them,
`drop index if exists` the named indexes from those migration files. Never
delete rows to make an index build succeed — resolve duplicates deliberately.

If a probe fails on staging, **stop**, run the rollback above, and open an
incident (`docs/INCIDENT_RESPONSE.md`). Do not proceed to production.

## 6. Production

Only after every staging probe passes **and** the production prerequisites
(dedupe cleanup for steps 3–4; step-5a `super_admin` granted) are satisfied:
repeat §1–§3 on production `ixassghxogcabfcyjjtz`, capturing the same pre-state
and keeping the same rollback artifact. Re-run `npm run db:verify` locally and
the live route probes afterward.
