# Production Readiness & Tenant Isolation Audit — 2026-11-23

## Executive status

**NOT YET APPROVED FOR CUSTOMER PRODUCTION DATA.** Source fixes and selected production database hardening have been completed. This is not a penetration test, a two-tenant isolation attestation, or a live provider delivery test. Vercel deployment remains paused pending the user's token recharge. Cloudflare automatic deployment is paused; manual dispatch remains available after its credentials are configured.

## Completed repository changes

- Organization-scoped repository families now validate the selected organization on list/read/write operations and scope child-record access through tenant-owned parents.
- Billing & Finance USD aggregates include only rows explicitly marked USD. INR and unverified values are excluded from USD totals; no guessed FX conversion is used.
- API credentials are generated server-side with high entropy, stored as SHA-256 digests, revealed once, and validated for tenant ownership, status and expiry. Browser reads use a safe metadata projection.
- Webhook delivery now uses authenticated server routes for configuration and dispatch. Browser users cannot directly create/update webhook records or alter delivery history.
- Webhook request bodies are byte-limited while streaming. Delivery requests claim idempotency keys before network side effects; the database unique index prevents concurrent duplicate claims, and stale pending claims can be recovered after a bounded lease.
- Outbound HTTPS delivery resolves every DNS answer, rejects non-public/reserved addresses, and pins the socket to a vetted address while preserving TLS hostname verification. Redirects are not followed.
- AI Command Center TypeScript errors, integration API-key form/type mismatches, NextRequest value import, and flat-stat rendering types were corrected.
- Organization-context and webhook unit-test mocks were corrected to represent browser storage and the Fetch ok property accurately.
- Cloudflare auto-deploy no longer fails on every main push when its secrets are absent; it is now manually dispatched.

## Production database changes applied and verified

The connected Supabase project is arjun-enterprise-production (ixassghxogcabfcyjjtz, region ap-south-1). The following migrations were applied through the Supabase migration interface and are present in live migration history:

| Live migration version | Change |
|---|---|
| 20261123182428 | Audit log tenant isolation; NULL-tenant rows are not readable/writable by authenticated tenant users |
| 20261123182431 | API-key digest column lockdown; authenticated users receive safe metadata SELECT only |
| 20261123182522 | Outbound webhook and delivery-log tables |
| 20261123182525 | Webhook signing secret restricted to service-role access |
| 20261123182527 | Pending delivery state and atomic organization/webhook/idempotency unique index |
| 20261123183004 | Webhook mutations and delivery writes restricted to server/service-role paths |
| 20261123183652 | SECURITY DEFINER RLS implementations moved to non-exposed private schema; stable public wrappers are SECURITY INVOKER |
| 20261123184122 | Webhook delivery foreign-key index |
| 20261123184156 | Audit history made append-only for authenticated users |
| 20261123184217 | Audit-log browser grants reduced to authenticated SELECT/INSERT; anonymous grants removed |
| 20261123184258 | Explicit deny policies for 32 service-role-only internal tables |

Live catalog checks confirmed:
- integration_webhooks and integration_deliveries exist; the delivery status constraint permits pending, delivered, and failed.
- integration_deliveries_org_hook_idempotency_uidx exists, with no pre-existing duplicate non-empty delivery keys at migration time.
- Authenticated users can SELECT only safe webhook metadata; they cannot SELECT the signing secret or mutate webhook configuration/delivery records. Service-role access remains available to server routes.
- intg_api_keys retains only its tenant-scoped SELECT policy for browser access; authenticated column grants exclude key_hash. Server-side API-key create/revoke routes use the service role.
- audit_logs has tenant-scoped SELECT/INSERT policies and no authenticated UPDATE/DELETE grants or policies.
- The 32 RLS-enabled tables with no business policies have no anon/authenticated table grants. Explicit deny policies now document and preserve their service-role-only boundary; no broad tenant policies were added.
- Public RLS helper functions are SECURITY INVOKER wrappers. Their SECURITY DEFINER implementations live in the non-exposed private schema with fixed search_path=pg_catalog. A SQL role-context check confirmed the wrappers execute and fail closed for a non-member.
- Supabase Security Advisor now reports only one remaining security warning: leaked-password protection is disabled in Supabase Auth. The Auth setting cannot be changed through the available Supabase connector actions and requires an authorized Auth configuration change.
- Health Advisor returned no findings. Performance Advisor still reports unindexed foreign keys and unused indexes; no broad index removal was performed because usage evidence is insufficient for safe cleanup.

## Remaining product and operational limitations

- **INR accounting is not complete.** Legacy billing fields are USD-named and historical currency is not consistently carried through every transaction path. There is no verified FX source or safe backfill basis. A currency-aware ledger, INR-native amounts, minor-unit/decimal rules, GST treatment, and reconciliation plan are still required.
- **Durable automation scheduling/worker infrastructure is not evidenced.** Local workflow execution supports a limited safe subset and rejects unsupported actions. Do not market all workflows as autonomous or scheduled.
- **Voice call dispatcher/provider delivery is not implemented.** Voice contracts/types alone are not a working calling system.
- **AI intent interpretation still returns HTTP 501.**
- **AI sales follow-up crash recovery SQL exists, but a live dispatcher/worker and provider delivery are not evidenced.** Do not market autonomous calling as live.
- No live external provider credentials, outbound webhook destinations, or end-to-end webhook deliveries were exercised.
- Backup/restore proof, production monitoring/alerting evidence, and full two-tenant negative isolation tests remain outstanding.
- The Supabase Auth leaked-password protection setting remains disabled and needs an authorized dashboard/configuration change.

## CI status

- An earlier CI run identified one ESLint error, seven TypeScript errors, and 13 unit-test failures. The lint/type errors were fixed; the test failures were traced to an unmocked browser localStorage and a Fetch mock missing ok: true, then corrected.
- The latest CI run is still pending/in progress at the time of this update. No final green CI result is claimed.
- Browser E2E smoke is not yet a verified production smoke test.
- Cloudflare automatic deployment is paused until credentials are configured. Vercel deployment is paused pending token recharge.

## Production sign-off gate

Do not onboard sensitive customer data until the remaining Auth setting is enabled, the latest CI run passes, two-tenant/memberless/suspended-tenant negative tests pass against the live project, and backup/restore plus monitoring evidence is available. INR accounting and durable automation/voice capabilities must be completed before those features are represented as production-ready.

## Additional database grant hardening — pending migration

A subsequent privilege audit found that `webhook_idempotency` still had inherited table privileges for `anon` and `authenticated`, despite its deny-all RLS policy. Current RLS prevents row access, but the grants are unnecessary and weaken defense in depth. Migration `202611230120_webhook_idempotency_server_only.sql` now revokes all browser/public privileges and grants access only to `service_role`. This migration has been committed to `main` but has **not** been applied to production; it must be included in the next approved database migration window.

## Migration replay correction

The GitHub Actions migration-chain validator exposed that `202611230010_priya_followup_crash_recovery.sql` referenced `ai_sales_followups` before any migration creates that table. The repository has no migrations defining the complete `ai_sales_followups`, `ai_voice_contact_consents`, and `ai_sales_suppressions` schema. The migration is now guarded and skips creation until all prerequisite tables exist; this preserves a replayable schema chain without inventing a partial consent/calling system. This is another confirmation that autonomous voice follow-up is not implemented or production-ready.

## Production database re-check (2026-11-23, after approved migration rollout)

A fresh read-only production snapshot confirms:
- 1,240 public tables have RLS enabled; 0 RLS-enabled public tables are missing policies.
- The RLS helper functions now live in the `private` schema with `search_path=pg_catalog`; public compatibility wrappers are non-`SECURITY DEFINER`.
- Supabase Security Advisor now reports one security warning: leaked-password protection is disabled in Supabase Auth. This requires an authorized Auth configuration change and is not changed by a SQL migration.
- Performance Advisor reports 631 foreign keys without covering indexes. The live snapshot's leading candidates have zero estimated rows and mostly 32–64 kB table sizes; do not bulk-create hundreds of indexes on an empty/low-usage database. Reassess after real workload statistics accumulate.
- The webhook delivery server-only grant migration and internal table deny migration are present in the applied migration history.

## Payment webhook reliability hardening

- Payment webhook request bodies are now streamed with a 256 KiB hard limit; oversized or invalid UTF-8 payloads are rejected before signature parsing.
- A signed payment event is no longer acknowledged with HTTP 200 when durable idempotency storage is missing or fails. The endpoint returns retryable HTTP 503 with `Retry-After: 60`, preventing a provider from treating an unrecorded receipt as successful.
- The bounded in-memory idempotency fallback remains available as a diagnostic/degraded decision path, but is not sufficient to acknowledge a payment event.
- The CI tenant-isolation assertion was corrected: webhook configuration tables have server-only mutation grants, so cross-tenant browser UPDATE is rejected at the SQL privilege layer (permission denied), not merely filtered to zero rows. The verification now expects denial.

## Outstanding production controls

- `202611230120_webhook_idempotency_server_only.sql` is committed but **not yet present in the production migration history**. The current production table still has broad browser table grants protected by its deny-all RLS policy; apply the migration only in an explicitly approved migration window.
- Supabase Auth leaked-password protection remains disabled and needs an authorized Auth settings change.
- Vercel deployment remains intentionally on hold pending the user's token recharge; Cloudflare deployment is not configured because its deploy secrets are absent.


## Provider-scoped payment event identity

A final payment idempotency review found that the receiver's in-memory key and API logic namespace event IDs by provider, but the original database primary key covered only `event_id`. Migration `202611230130_webhook_idempotency_provider_scope.sql` now changes the durable key to `(provider, event_id)`, aligning database uniqueness with the application contract. It is committed but **not applied to production**. Apply it together with the pending `202611230120_webhook_idempotency_server_only.sql` only in an explicitly approved database migration window.
