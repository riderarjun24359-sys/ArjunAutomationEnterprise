#!/usr/bin/env node

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import pg from "pg";
import { createMigrationApplyPlan } from "./migration-apply-policy.mjs";

const { Client } = pg;
const root = process.cwd();
const migrationsDir = join(root, "supabase", "migrations");
const seedsDir = join(root, "supabase", "seed");

const databaseUrl = process.env.SUPABASE_DB_URL ?? process.env.DATABASE_URL;

if (!databaseUrl) {
    console.error("FAIL: SUPABASE_DB_URL or DATABASE_URL is required to apply migrations.");
    process.exit(1);
}

const migrationPlan = createMigrationApplyPlan(process.env);

const allMigrationFiles = readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

const migrationFiles = allMigrationFiles.filter((file) => {
    if (!migrationPlan.shouldApply(file)) {
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
