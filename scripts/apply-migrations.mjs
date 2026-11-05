#!/usr/bin/env node

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import pg from "pg";

const { Client } = pg;
const root = process.cwd();
const migrationsDir = join(root, "supabase", "migrations");
const seedsDir = join(root, "supabase", "seed");

const databaseUrl = process.env.SUPABASE_DB_URL ?? process.env.DATABASE_URL;

if (!databaseUrl) {
    console.error("FAIL: SUPABASE_DB_URL or DATABASE_URL is required to apply migrations.");
    process.exit(1);
}

// These tenant/RLS migrations are intentionally held until the staged rollout
// and its live positive/negative probes have been reviewed. They are excluded
// from ordinary migration runs and can only be included with an explicit flag.
const HELD_MIGRATIONS = new Set([
    "202610120001_org_membership_escalation_lockdown.sql",
    "202610120002_read_scope_lockdown.sql",
    "202610120003_legacy_table_rls_lockdown.sql",
    "202610120004_module_tables_tenant_reads.sql",
]);

const migrationTarget = process.env.SUPABASE_MIGRATION_TARGET?.trim().toLowerCase();
const allowHeldMigrations = process.env.ALLOW_HELD_MIGRATIONS === "true";
const stagingApproved = process.env.STAGING_VALIDATION_APPROVED === "true";

if (migrationTarget !== "staging" && migrationTarget !== "production") {
    console.error("FAIL: Set SUPABASE_MIGRATION_TARGET=staging or production before applying migrations.");
    process.exit(1);
}

if (migrationTarget === "production" && !stagingApproved) {
    console.error("FAIL: Production migrations require STAGING_VALIDATION_APPROVED=true after staging validation.");
    process.exit(1);
}

if (allowHeldMigrations && migrationTarget === "production" && !stagingApproved) {
    console.error("FAIL: Held production migrations require completed staging validation.");
    process.exit(1);
}

const allMigrationFiles = readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

const migrationFiles = allMigrationFiles.filter((file) => {
    if (HELD_MIGRATIONS.has(file) && !allowHeldMigrations) {
        console.log(`HOLD: Skipping staged-only migration ${file} (set ALLOW_HELD_MIGRATIONS=true after review).`);
        return false;
    }
    return true;
});

const seedFiles = readdirSync(seedsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

const client = new Client({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } });

try {
    await client.connect();

    for (const file of migrationFiles) {
        const sql = readFileSync(join(migrationsDir, file), "utf8");
        console.log(`Applying migration ${file}...`);
        await client.query(sql);
    }

    for (const file of seedFiles) {
        const sql = readFileSync(join(seedsDir, file), "utf8");
        console.log(`Applying seed ${file}...`);
        await client.query(sql);
    }

    console.log("PASS: Migrations and seeds applied successfully.");
} catch (error) {
    console.error("FAIL:", error instanceof Error ? error.message : error);
    process.exit(1);
} finally {
    await client.end();
}
