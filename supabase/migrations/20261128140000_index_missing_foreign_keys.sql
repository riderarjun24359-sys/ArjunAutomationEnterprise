-- Add B-tree indexes for public single-column foreign keys that do not
-- already have a valid, non-partial index with the FK column as its leading key.
-- Inventory at 2026-11-28: Supabase Advisor reported 632 missing FK indexes.
-- Two additional FK columns had only partial indexes, which do not protect
-- every referencing row; those receive full indexes as well.
-- IF NOT EXISTS makes this safe to retry if an index was created manually.

DO $$
DECLARE
    fk RECORD;
    index_name TEXT;
    created_count INTEGER := 0;
BEGIN
    FOR fk IN
        SELECT DISTINCT
            n.nspname AS schema_name,
            t.relname AS table_name,
            a.attname AS column_name,
            a.attnum AS column_number
        FROM pg_constraint c
        JOIN pg_class t ON t.oid = c.conrelid
        JOIN pg_namespace n ON n.oid = t.relnamespace
        JOIN pg_attribute a ON a.attrelid = t.oid AND a.attnum = c.conkey[1]
        WHERE c.contype = 'f'
          AND n.nspname = 'public'
          AND cardinality(c.conkey) = 1
          AND t.relkind IN ('r', 'p')
          AND NOT EXISTS (
              SELECT 1
              FROM pg_index i
              JOIN pg_class index_rel ON index_rel.oid = i.indexrelid
              JOIN pg_am am ON am.oid = index_rel.relam
              WHERE i.indrelid = t.oid
                AND i.indisvalid
                AND i.indisready
                AND i.indpred IS NULL
                AND am.amname = 'btree'
                AND i.indkey[0] = a.attnum
          )
        ORDER BY n.nspname, t.relname, a.attname
    LOOP
        index_name := 'fk_' || left(fk.table_name, 38) || '_' ||
            substr(md5(fk.schema_name || '.' || fk.table_name || '.' || fk.column_name), 1, 12);

        EXECUTE format(
            'CREATE INDEX IF NOT EXISTS %I ON %I.%I USING btree (%I)',
            index_name,
            fk.schema_name,
            fk.table_name,
            fk.column_name
        );
        created_count := created_count + 1;
    END LOOP;

    RAISE NOTICE 'Foreign-key indexes ensured: %', created_count;
END
$$;

-- Post-migration verification is performed by the Supabase performance advisor
-- and a catalog query in the release checklist.
