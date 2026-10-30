-- Rate-limit state store for serverless deployments.
--
-- In-memory rate limiting (api-security-engine.ts) works on a single Node
-- process but is ineffective in Vercel serverless where every function
-- invocation gets its own heap. This table stores per-key counters with
-- TTL-based expiry so any instance can enforce the same limit.
--
-- STATUS: APPLIED
--
-- Idempotent: CREATE TABLE IF NOT EXISTS. No data prerequisite.
--
-- ACCESS CONTROL:
--   - Row Level Security is ENABLED on the table.
--   - NO policies are granted to authenticated users. Authenticated users
--     CANNOT read, insert, update, or delete rate-limit records through
--     the Supabase client.
--   - The rate limiter uses the server-side service-role client
--     (src/lib/supabase-service-role.ts), which bypasses RLS entirely.
--     This is the only authorized access path.
--   - No DELETE policy exists — expired rows are pruned by the upsert path.

create table if not exists public.rate_limits (
    id uuid primary key default gen_random_uuid(),
    key text not null,
    count integer not null default 1,
    reset_at timestamptz not null default (now() + interval '1 minute'),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique (key)
);

-- Index for fast lookups by key + expiry.
create index if not exists idx_rate_limits_key on public.rate_limits (key);
create index if not exists idx_rate_limits_reset_at on public.rate_limits (reset_at);

do $$
declare
    tbl text := 'rate_limits';
begin
    execute format('alter table public.%I enable row level security', tbl);

    -- Drop any existing policies to ensure a clean state.
    -- No new policies are created for authenticated users.
    -- Authenticated users cannot read, insert, update, or delete
    -- rate-limit records through the Supabase client.
    execute format(
        'drop policy if exists %I on public.%I',
        'rate_limit_authenticated_select', tbl
    );
    execute format(
        'drop policy if exists %I on public.%I',
        'rate_limit_authenticated_insert', tbl
    );
    execute format(
        'drop policy if exists %I on public.%I',
        'rate_limit_authenticated_update', tbl
    );
    execute format(
        'drop policy if exists %I on public.%I',
        'rate_limit_authenticated_delete', tbl
    );
    -- No policies are granted to authenticated users.
    -- The service-role client bypasses RLS entirely.
end $$;
