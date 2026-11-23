#!/usr/bin/env node

import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import pg from "pg";

const { Client } = pg;
const root = process.cwd();
const migrationsDir = join(root, "supabase", "migrations");
const applyRequested = process.argv.includes("--apply");
const databaseUrl = process.env.SUPABASE_DB_URL ?? process.env.DATABASE_URL;

const migrationFiles = readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

if (migrationFiles.length === 0) {
    console.error("FAIL: No migration files found.");
    process.exit(1);
}

const versions = new Map();
const migrations = migrationFiles.map((file) => {
    const match = file.match(/^(\d{8,14})[_-]/);
    if (!match) throw new Error(`Invalid migration filename: ${file}`);
    if (versions.has(match[1])) {
        throw new Error(`Duplicate migration version ${match[1]}: ${versions.get(match[1])}, ${file}`);
    }
    versions.set(match[1], file);
    const sql = readFileSync(join(migrationsDir, file), "utf8");
    if (!sql.trim()) throw new Error(`Empty migration file: ${file}`);
    const checksum = createHash("sha256").update(sql).digest("hex");
    return { file, sql, checksum };
});

if (!applyRequested) {
    console.log("DRY RUN ONLY — no database connection or writes were made.");
    console.log(`Validated ${migrations.length} migration files with unique versions and SHA-256 checksums.`);
    console.log("Review the plan, then pass --apply explicitly to execute pending migrations.");
    process.exit(0);
}

if (!databaseUrl) {
    console.error("FAIL: SUPABASE_DB_URL or DATABASE_URL is required with --apply.");
    process.exit(1);
}

const client = new Client({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } });
let lockAcquired = false;

try {
    await client.connect();
    await client.query("SELECT pg_advisory_lock(741920261)");
    lockAcquired = true;

    await client.query(`
        CREATE TABLE IF NOT EXISTS public.arjun_schema_migrations (
            version text PRIMARY KEY,
            filename text NOT NULL,
            checksum text NOT NULL,
            applied_at timestamptz NOT NULL DEFAULT now()
        )
    `);

    const { rows } = await client.query(
        "SELECT version, filename, checksum FROM public.arjun_schema_migrations",
    );
    const applied = new Map(rows.map((row) => [row.version, row]));

    for (const migration of migrations) {
        const version = migration.file.match(/^(\d{8,14})[_-]/)[1];
        const previous = applied.get(version);

        if (previous) {
            if (previous.filename !== migration.file || previous.checksum !== migration.checksum) {
                throw new Error(
                    `Migration history conflict for ${version}. Applied file/checksum differs; refusing to rerun or rewrite history.`,
                );
            }
            console.log(`SKIP already applied: ${migration.file}`);
            continue;
        }

        console.log(`Applying migration ${migration.file}...`);
        // Do not wrap migration SQL in a transaction: some PostgreSQL operations
        // (for example CREATE INDEX CONCURRENTLY) are not transaction-safe.
        await client.query(migration.sql);
        await client.query(
            "INSERT INTO public.arjun_schema_migrations (version, filename, checksum) VALUES ($1, $2, $3)",
            [version, migration.file, migration.checksum],
        );
        console.log(`APPLIED: ${migration.file}`);
    }

    console.log("PASS: All pending migrations were applied and recorded.");
} catch (error) {
    console.error("FAIL:", error instanceof Error ? error.message : error);
    process.exitCode = 1;
} finally {
    if (lockAcquired) {
        await client.query("SELECT pg_advisory_unlock(741920261)").catch(() => undefined);
    }
    await client.end().catch(() => undefined);
}
