-- Create idempotency table
create table if not exists public.webhook_idempotency (
    event_id text primary key,
    provider text not null default 'stripe',
    created_at timestamptz default now()
);

-- Ensure RLS is enabled and secure
alter table public.webhook_idempotency enable row level security;
create policy "No access for anyone" on public.webhook_idempotency for all using (false);
