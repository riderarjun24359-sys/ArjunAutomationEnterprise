#!/usr/bin/env node

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const migrationsDir = join(root, "supabase", "migrations");

const requiredTables = [
    "organizations",
    "organization_members",
    "user_profiles",
    "roles",
    "permissions",
    "clients",
    "contacts",
    "companies",
    "projects",
    "project_members",
    "tasks",
    "task_comments",
    "task_labels",
    "notifications",
    "activity_logs",
    "audit_logs",
];

const migrationFiles = readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

if (migrationFiles.length === 0) {
    console.error("FAIL: No migration files found.");
    process.exit(1);
}

const combinedSql = migrationFiles.map((file) => readFileSync(join(migrationsDir, file), "utf8")).join("\n");
const missingTables = requiredTables.filter((table) => !combinedSql.includes(`public.${table}`) && !combinedSql.includes(` ${table} (`));

if (missingTables.length > 0) {
    console.error(`FAIL: Missing tables in migrations: ${missingTables.join(", ")}`);
    process.exit(1);
}

for (const file of migrationFiles) {
    const sql = readFileSync(join(migrationsDir, file), "utf8");
    if (!sql.trim()) {
        console.error(`FAIL: Empty migration file ${file}`);
        process.exit(1);
    }
}

console.log(`PASS: ${migrationFiles.length} migration files validated.`);
console.log(`PASS: All ${requiredTables.length} required tables are present.`);
