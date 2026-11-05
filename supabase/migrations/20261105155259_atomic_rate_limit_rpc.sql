-- Atomic shared rate-limit counter for serverless instances.
-- Service-role only: callers cannot choose or inspect other users' counters.
CREATE OR REPLACE FUNCTION public.consume_rate_limit(
  p_key text,
  p_limit integer DEFAULT 100,
  p_window_ms integer DEFAULT 60000
)
RETURNS TABLE(count integer, reset_at timestamptz)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog
AS $$
DECLARE
  v_now timestamptz := clock_timestamp();
  v_reset_at timestamptz;
BEGIN
  IF p_key IS NULL OR length(p_key) < 1 OR length(p_key) > 512 THEN
    RAISE EXCEPTION 'invalid rate limit key' USING errcode = '22023';
  END IF;
  IF p_limit IS NULL OR p_limit < 1 OR p_limit > 1000000 THEN
    RAISE EXCEPTION 'invalid rate limit limit' USING errcode = '22023';
  END IF;
  IF p_window_ms IS NULL OR p_window_ms < 1000 OR p_window_ms > 86400000 THEN
    RAISE EXCEPTION 'invalid rate limit window' USING errcode = '22023';
  END IF;

  v_reset_at := v_now + (p_window_ms * interval '1 millisecond');

  RETURN QUERY
  INSERT INTO public.rate_limits AS rl (key, count, reset_at, updated_at)
  VALUES (p_key, 1, v_reset_at, v_now)
  ON CONFLICT (key) DO UPDATE
    SET count = CASE WHEN rl.reset_at <= v_now THEN 1 ELSE rl.count + 1 END,
        reset_at = CASE WHEN rl.reset_at <= v_now THEN v_reset_at ELSE rl.reset_at END,
        updated_at = v_now
  RETURNING rl.count, rl.reset_at;
END;
$$;

-- The RPC is the only supported access path; preserve service-role access.
REVOKE ALL ON TABLE public.rate_limits FROM PUBLIC, anon, authenticated;
GRANT ALL ON TABLE public.rate_limits TO service_role;
REVOKE ALL ON FUNCTION public.consume_rate_limit(text, integer, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_rate_limit(text, integer, integer) TO service_role;
