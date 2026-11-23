# Production Readiness & Tenant Isolation Audit — 2026-11-23

## Executive status

**NOT APPROVED FOR PRODUCTION CUSTOMER DATA.** This is a source-level audit and remediation record, not a live penetration test or database attestation. No production database migration, Vercel deployment, Cloudflare change, secret change, or external provider action was performed.

## Tenant isolation remediation in this continuation

The browser repository client now exposes a single selected-organization query-scope helper. Organization-scoped repository families were hardened so that:
- organization list queries reject a tenant ID that differs from the selected tenant;
- record lookups, updates, and deletes include the selected organization ID;
- create/update calls reject tenant IDs that do not match the selected organization;
- workflow child records are accessed only after confirming the parent workflow belongs to the selected tenant;
- project child records, task-label assignments, analytics widgets, contacts, activity logs, and audit logs are scoped through their tenant-owned parent or tenant ID.

The shared repositories updated include automation, billing revenue, integration platform, AI orchestration, AI organization foundation, analytics, autonomous company, business analyst/process, commercial SaaS, communication hub, company foundation, customer success, customer-operated platform, customer success delivery, development factory, DevOps deployment, document engine, documents, enterprise governance/identity/intelligence, executive intelligence, finance, form engine, founder OS, growth operations/engine, hospital, HR, industry framework, inventory, knowledge, launch foundation/readiness, operations center, QA engineer, restaurant, retail, sales, school, settings, solution architect, support, tenant lifecycle operations, and workflow engine.

**Important boundary:** localStorage/cookie selection is a tenant-selection hint, not authorization. The server still validates requested tenant membership, and database RLS must remain the authoritative enforcement layer. The source changes do not prove that production RLS is enabled or correctly applied. This is targeted hardening of the shared organization-scoped repository families listed below; bespoke repositories, direct Supabase calls, and service-role data paths still require an individual table-by-table review before claiming the entire repository surface is cleared.

## RLS findings

1. `20260805_audit_rls_remediation.sql` previously permitted authenticated access to audit rows where `organization_id IS NULL`. `202611230020_audit_logs_tenant_isolation.sql` removes that broad null-tenant access, but is marked PREPARED ONLY and has not been applied.
2. `202610120004_module_tables_tenant_reads.sql` is also PREPARED / HELD. It scopes exactly 20 active module tables and deliberately leaves 10 unused/deprecated tables deny-by-default.
3. `20261105155554_rls_tenant_isolation_lockdown.sql` and related hardening migrations are repository artifacts only in this workflow; their live application state has not been verified.
4. Global permission catalogs are intentionally authenticated-read-only. Project child-table delete operations remain deny-by-default where no delete policy was created.
5. Because migrations have not been applied or checked against the live catalog, the effective production RLS policy set remains **unverified**.

## Billing and INR

- Legacy billing columns are named `amount_usd`, `mrr_usd`, `arr_usd`, etc. The billing-account table has a `currency_code`, but the current transaction/statistics mapping does not consistently carry that currency into every amount.
- There is no verified FX rate source or safe historical conversion basis. Existing values must not be relabelled as INR or multiplied by a guessed rate.
- Customer-facing finance panels already suppress unverified totals and show currency-unverified states. Payment Center no longer displays a USD-named amount beside an unverified currency label.
- Billing creation paths validate that a referenced billing account belongs to the selected tenant before writing. This is a tenant-integrity guard, not a currency conversion.
- **INR accounting is not complete.** It requires a currency-aware schema and write/read path, explicit INR transaction amounts, decimal/minor-unit rules, GST/tax treatment, and a controlled reconciliation/backfill plan. No such migration was applied.

## Integrations

- API keys use high-entropy bearer tokens with SHA-256 digests, one-time secret reveal, expiry/status checks, tenant/hub ownership validation, and rate limits.
- Webhook delivery uses HTTPS/allowlist validation, literal private/metadata address checks, HMAC signing, bounded retries/timeouts, and idempotency keys. DNS resolution is not pinned/validated by this client path, so DNS rebinding and unsafe allowlisted destinations still require a server-side egress proxy with DNS/IP enforcement before sensitive production use.
- External providers, webhook endpoints, DNS behavior, and live delivery were not exercised. Provider credentials/configuration health is not verified from source alone.

## AI and automation reliability

- Workflow execution intentionally refuses unsupported actions and does not claim retries/scheduling that do not exist. Local worker execution supports a limited safe subset; a durable scheduler/queue/worker deployment is not evidenced.
- The voice interfaces currently contain contracts/types only; no complete voice call dispatcher/provider integration was found in the reviewed paths.
- The AI intent endpoint explicitly returns 501 while interpretation is unimplemented.
- The AI sales follow-up crash-recovery SQL function is service-role-only, but a live dispatcher/worker and provider delivery are not evidenced. It must not be marketed as live autonomous calling.
- Human approval and manual reconciliation remain required for high-impact actions.

## Production readiness blockers

- Do not onboard customer medical, financial, or other sensitive data until the prepared RLS migrations are reviewed, applied through an approved change window, and verified against the live database catalog with two-tenant negative tests.
- No automated tests/builds were run in this continuation, per the operating instruction. GitHub Actions status must be checked separately; a pending/in-progress run is not a pass.
- No live provider credentials or outbound integration tests were performed.
- INR accounting, durable automation scheduling, live voice dispatcher, backup/restore proof, monitoring/alerting evidence, and end-to-end tenant isolation proof remain outstanding.
- Deployment/hosting readiness is not certified; Vercel and Cloudflare were intentionally left untouched.

## Safe next gate

1. Review the generated repository diffs and CI result.
2. Obtain an approved database maintenance window and apply only the reviewed migrations in dependency order.
3. Verify live RLS policies, grants, and helper-function ACLs with tenant A / tenant B / memberless / suspended-tenant negative tests.
4. Implement currency-aware billing before accepting or reporting INR financial totals.
5. Deploy durable queue/worker infrastructure and provider-backed AI/voice workflows before describing them as autonomous.
6. Complete backup-restore and observability evidence before production sign-off.

## Follow-up remediation — mixed-currency reporting guard (2026-11-23)

- Commit `6b9ad33f4175bbc4f9607f85dccc6dc76f2b3697` changes Billing & Finance USD-denominated aggregates to include only rows explicitly marked USD.
- INR and currency-unverified finance invoices/payments remain visible in their source-currency transaction lists, but are excluded from USD collected, outstanding, monthly revenue, account ranking, and collection-rate calculations.
- USD totals are not converted or combined with INR. No FX rate is inferred.
- This is a source-level correction only. No tests/builds were run and no production database/deployment changes were made.

- Commit `303851a8610e96ca3d7d7f5a53ee574d50b4e4da` adds streaming byte-limit enforcement to the server-side webhook delivery endpoint. The request is capped at 64 KiB while reading, including chunked requests that omit or misstate Content-Length.
- The webhook destination still needs a dedicated DNS-pinning egress proxy to fully close DNS-rebinding risk; this remains an explicit production limitation.


## Live Supabase production snapshot — 2026-11-23

Read-only inspection of the connected production project `arjun-enterprise-production` confirmed:
- The applied migration history currently ends at `20261105161010`; the newer repository migrations dated `20261123` are not applied.
- `audit_logs` exists with RLS enabled and four policies; `intg_api_keys` exists with RLS enabled and four policies; `webhook_idempotency` exists with RLS enabled and one deny-all policy.
- `integration_webhooks` and `integration_deliveries` do not exist in the live production schema. Therefore the newly implemented outbound webhook delivery endpoint is not production-operational until its schema migration and column-privilege hardening are reviewed and applied. Do not enable this feature or represent it as live before that gate.
- Supabase Security Advisor reports 32 RLS-enabled tables with no policies (deny-by-default, not a public data leak by itself); these need classification as intentionally internal/deprecated versus accidentally inaccessible before any policy is added.
- Security Advisor flags authenticated execution of `auth_profile_id()` and `is_organization_member(uuid)` SECURITY DEFINER helpers. These may be intentionally used by RLS policies; review function bodies, grants, and policy dependencies before changing EXECUTE privileges.
- Leaked-password protection is disabled in Supabase Auth and requires an Auth configuration change by an authorized project administrator.
- Health Advisor returned no findings in the inspected snapshot. Performance Advisor reported unused indexes; no indexes were removed because usage evidence is not sufficient to justify destructive cleanup.

## CI follow-up

- GitHub Actions run `45234535625` failed at ESLint before TypeScript, unit tests, migration validation, tenant-isolation tests, or production build could run. The sole ESLint error was `prefer-const` in `src/modules/database/repositories/audit-repository.ts`.
- Commit `c8b35920c1e8234676856f14683f3d143d3f5a96` corrects that lint error. The subsequent CI run `45236244245` was still in progress at the time of this record; no pass is claimed.
- The separate Cloudflare deployment workflow remains blocked because `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` are not configured. Vercel deployment remains intentionally paused pending the user's token recharge.
