-- Atomic shared rate-limit counter for serverless instances.
-- Service-role only: callers cannot choose or inspect other users' counters.
create or replace function public.consume_rate_limit(
  p_key text,
  p_limit integer default 100,
  p_window_ms integer default 60000
)
returns table(count integer, reset_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_now timestamptz := clock_timestamp();
  v_reset_at timestamptz;
begin
  if p_key is null or length(p_key) < 1 or length(p_key) > 512 then
    raise exception 'invalid rate limit key' using errcode = '22023';
  end if;
  if p_limit < 1 or p_limit > 1000000 then
    raise exception 'invalid rate limit limit' using errcode = '22023';
  end if;
  if p_window_ms < 1000 or p_window_ms > 86400000 then
    raise exception 'invalid rate limit window' using errcode = '22023';
  end if;

  v_reset_at := v_now + (p_window_ms * interval '1 millisecond');

  return query
  insert into public.rate_limits as rl (key, count, reset_at, updated_at)
  values (p_key, 1, v_reset_at, v_now)
  on conflict (key) do update
    set count = case
          when rl.reset_at <= v_now then 1
          else rl.count + 1
        end,
        reset_at = case
          when rl.reset_at <= v_now then v_reset_at
          else rl.reset_at
        end,
        updated_at = v_now
  returning rl.count, rl.reset_at;
end;
$$;

revoke all on function public.consume_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_rate_limit(text, integer, integer) to service_role;
