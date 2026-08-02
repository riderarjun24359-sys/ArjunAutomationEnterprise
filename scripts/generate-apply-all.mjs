#!/usr/bin/env node

import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const migrationsDir = join(root, "supabase", "migrations");
const seedsDir = join(root, "supabase", "seed");

const migrationFiles = readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

const seedFiles = readdirSync(seedsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

const sections = [
    ...migrationFiles.map((file) => ({ file, dir: migrationsDir, kind: "migration" })),
    ...seedFiles.map((file) => ({ file, dir: seedsDir, kind: "seed" })),
];

const body = sections
    .map(({ file, dir, kind }) => {
        const sql = readFileSync(join(dir, file), "utf8").trim();
        return [
            `-- =============================================================================`,
            `-- ${kind.toUpperCase()}: ${file}`,
            `-- =============================================================================`,
            sql,
        ].join("\n");
    })
    .join("\n\n");

const header = `-- =============================================================================
-- Arjun Automation OS Enterprise — Production apply_all.sql
-- =============================================================================
-- Generated: ${new Date().toISOString()}
-- Apply manually in Supabase SQL Editor (do not auto-execute from CI).
--
-- Contents:
--   Migrations (${migrationFiles.length}):
${migrationFiles.map((file) => `--     - ${file}`).join("\n")}
--   Seeds (${seedFiles.length}):
${seedFiles.map((file) => `--     - ${file}`).join("\n")}
--
-- Includes through Sprint 16:
--   Foundation, CRM, Projects, Data Platform, Finance, AI Automation & Workflows, Analytics, Settings & Administration, HRMS & Employee Management
--
-- Idempotent: uses IF NOT EXISTS / ON CONFLICT DO NOTHING where applicable.
-- Safe to run on a project that already has core Sprint 10 tables.
-- =============================================================================

begin;

`;

const footer = `

-- =============================================================================
-- END apply_all.sql
-- =============================================================================
commit;
`;

writeFileSync(join(root, "supabase", "apply_all.sql"), `${header}${body}${footer}`, "utf8");

console.log(`Generated supabase/apply_all.sql`);
console.log(`  ${migrationFiles.length} migrations + ${seedFiles.length} seeds`);
console.log(`  ${sections.length} sections total`);
