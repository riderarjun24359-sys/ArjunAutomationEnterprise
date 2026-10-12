-- Governed outbound webhooks: named targets + delivery log for the automation
-- engine's `webhook` action (Zapier/n8n "HTTP request" analog).
--
-- STATUS: PREPARED / HELD — NOT APPLIED to any database. Apply staging-first
-- with the other prepared hardening migrations (see
-- docs/STAGING_TO_PRODUCTION_MIGRATION_PROCEDURE.md, step 8). Idempotent
-- (CREATE IF NOT EXISTS + DROP IF EXISTS); no data prerequisite.
--
-- WHY: the automation UI already offers a "webhook" action type, but execution
-- failed (`Unsupported action ... need providers`). This gives that action a
-- governed runtime: per-organization named targets (URL + HMAC secret +
-- host allowlist) and an append-only delivery log. Code-level guards live in
-- `src/modules/automation/lib/webhook-action.ts` (https-only, allowlist,
-- SSRF/loopback/metadata rejection, `t=…,v1=…` signatures, idempotency keys,
-- bounded timeout/retries); these policies are the database backstop.
--
-- TRUST NOTES (read before widening anything here):
--   - `integration_webhooks.secret` is stored reversibly because the server
--     must sign with it. It is readable by organization members under RLS —
--     the same trust boundary as every other org row in this schema (members
--     already read all org data). Never echo it to clients; the service layer
--     resolves it server-side only.
--   - Both tables get the repo-standard SELECT + INSERT + UPDATE trio scoped by
--     `is_organization_member(organization_id)` (uniform with 202610120004, so the
--     shared policy-shape probe covers them unchanged).
--     No DELETE policy on either table: no code path deletes (verified), so
--     delete stays deny-by-default, matching 202610120004.
--
-- NEGATIVE CONTROLS (scripts/verify-rls-isolation.mjs, "integration webhooks"
-- block): same-tenant positive reads, cross-tenant SELECT/INSERT denied,
-- memberless sees nothing, plus the shared policy-shape assertion.

create table if not exists public.integration_webhooks (
    id uuid primary key default gen_random_uuid(),
    organization_id uuid not null references public.organizations(id) on delete cascade,
    name text not null,
    url text not null,
    secret text not null default '',
    allowed_hosts text[] not null default '{}',
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique (organization_id, name)
);

create table if not exists public.integration_deliveries (
    id uuid primary key default gen_random_uuid(),
    organization_id uuid not null references public.organizations(id) on delete cascade,
    webhook_id uuid references public.integration_webhooks(id) on delete set null,
    event text not null,
    target_host text not null default '',
    status text not null default 'delivered' check (status in ('delivered', 'failed')),
    attempts integer not null default 1,
    response_status integer,
    error text not null default '',
    idempotency_key text not null default '',
    created_at timestamptz not null default now()
);

do $$
declare
    tbl text;
begin
    foreach tbl in array array['integration_webhooks', 'integration_deliveries']
    loop
        execute format('alter table public.%I enable row level security', tbl);

        execute format('drop policy if exists %I_select on public.%I', tbl, tbl);
        execute format(
            'create policy %I_select on public.%I for select to authenticated using (public.is_organization_member(organization_id))',
            tbl, tbl
        );

        execute format('drop policy if exists %I_insert on public.%I', tbl, tbl);
        execute format(
            'create policy %I_insert on public.%I for insert to authenticated with check (public.is_organization_member(organization_id))',
            tbl, tbl
        );

        execute format('drop policy if exists %I_update on public.%I', tbl, tbl);
        execute format(
            'create policy %I_update on public.%I for update to authenticated using (public.is_organization_member(organization_id)) with check (public.is_organization_member(organization_id))',
            tbl, tbl
        );
    end loop;
end
$$;
