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

const migrationFiles = readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

// Fail closed before opening a database connection or applying any SQL.
const migrationVersions = new Map();
const migrationVersionErrors = [];
for (const file of migrationFiles) {
    const match = /^(\\d{8,14})_/.exec(file);
    if (!match) {
        migrationVersionErrors.push(`Invalid migration timestamp prefix: ${file}`);
        continue;
    }
    const previous = migrationVersions.get(match[1]);
    if (previous) {
        migrationVersionErrors.push(`Duplicate migration version ${match[1]}: ${previous} and ${file}`);
    } else {
        migrationVersions.set(match[1], file);
    }
}
if (migrationVersionErrors.length > 0) {
    console.error("FAIL: Migration preflight rejected the migration chain:");
    for (const error of migrationVersionErrors) console.error(`  - ${error}`);
    process.exit(1);
}
console.log(`PASS: Migration preflight validated ${migrationFiles.length} unique migration versions.`);

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
