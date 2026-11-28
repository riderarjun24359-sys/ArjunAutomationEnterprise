// @vitest-environment node
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const migration = readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), "20261128140000_index_missing_foreign_keys.sql"),
    "utf8",
);

describe("foreign-key index migration safety", () => {
    it("only considers public single-column foreign keys on ordinary or partitioned tables", () => {
        expect(migration).toMatch(/c\.contype\s*=\s*'f'/i);
        expect(migration).toMatch(/n\.nspname\s*=\s*'public'/i);
        expect(migration).toMatch(/cardinality\(c\.conkey\)\s*=\s*1/i);
        expect(migration).toMatch(/t\.relkind\s+IN\s*\('r',\s*'p'\)/i);
    });

    it("does not duplicate valid, ready, full B-tree indexes with the FK as leading key", () => {
        expect(migration).toMatch(/i\.indisvalid/i);
        expect(migration).toMatch(/i\.indisready/i);
        expect(migration).toMatch(/i\.indpred\s+IS\s+NULL/i);
        expect(migration).toMatch(/am\.amname\s*=\s*'btree'/i);
        expect(migration).toMatch(/i\.indkey\[0\]\s*=\s*a\.attnum/i);
    });

    it("uses deterministic bounded names, quoted identifiers, and retry-safe creation", () => {
        expect(migration).toMatch(/md5\(fk\.schema_name\s*\|\|\s*'\.'\s*\|\|\s*fk\.table_name/i);
        expect(migration).toMatch(/CREATE INDEX IF NOT EXISTS %I ON %I\.%I USING btree \(%I\)/i);
        expect(migration).toMatch(/left\(fk\.table_name,\s*38\)/i);
    });

    it("contains no destructive DDL or data mutation", () => {
        expect(migration).not.toMatch(/\b(DROP\s+TABLE|DROP\s+COLUMN|TRUNCATE|DELETE\s+FROM)\b/i);
        expect(migration).toMatch(/CREATE INDEX IF NOT EXISTS/i);
    });
});
