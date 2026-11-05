-- Harden the trigger helper against search-path shadowing.
-- The function only uses the trigger record and pg_catalog.now().
ALTER FUNCTION public.set_updated_at() SET search_path = pg_catalog;

-- Rollback:
-- ALTER FUNCTION public.set_updated_at() RESET search_path;
