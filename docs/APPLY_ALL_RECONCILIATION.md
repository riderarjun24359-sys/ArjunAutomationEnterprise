# apply_all.sql Reconciliation Procedure

Status: comparison completed locally 2026-10-11. Committed artifact left
byte-identical on purpose — regenerating the production apply artifact is an
owner step (see acceptance criteria below).

## Established process

```bash
node scripts/generate-apply-all.mjs   # concatenates supabase/migrations/*.sql + supabase/seed/*.sql, sorted
npm run db:verify                     # required-tables + non-empty checks
npm run db:validate                   # executes the full chain on PGlite (validator-only auth/pgcrypto/role stubs)
```

## Observed drift (evidence, 2026-10-11 run)

Regenerating produces `+1089 / −5` against the committed file:

- **Additions (+1089):** migrations present in `supabase/migrations/` but
  absent from the committed artifact, from `202608060005_executive_ai.sql`
  through `202610100003_finance_invoice_guards.sql` (8 migration sections),
  including the three prepared-but-unapplied migrations
  (`202610100001/2/3`) and `20260815120000_durable_webhook_idempotency.sql`.
- **Deletions (−5):** a hand-merged `audit_logs` policy block
  (`organization_id is null or is_organization_member(...)`) that does not
  exist verbatim in any migration file. Functionally superseded: the chain
  contains `20260805_audit_rls_remediation.sql`, which drops and recreates
  those policies with equivalent semantics later in apply order.

## Reconciliation procedure (owner)

1. Back up: `cp supabase/apply_all.sql /tmp/apply_all.backup.sql`
2. Regenerate: `node scripts/generate-apply-all.mjs`
3. Review: `git diff -- supabase/apply_all.sql` — expect ONLY timestamp,
   the 8 listed migration sections, and the 5-line audit_logs normalization.
   Anything else = stop and investigate.
4. Validate: `npm run db:verify && npm run db:validate` (both exit 0).
5. Apply the regenerated artifact to a disposable instance first; run
   tenant-isolation suites; only then promote toward staging/production
   review. Never apply directly to production.

## Why the file was not regenerated here

`apply_all.sql` is the production apply artifact. The committed copy carries
hand-merged intent; silently replacing it from this session would mix a
production-affecting rewrite into uncommitted local work. The generator was
verified to pick up all 63 migrations (evidence above); the actual
regeneration stays an explicit owner action per the steps above.
