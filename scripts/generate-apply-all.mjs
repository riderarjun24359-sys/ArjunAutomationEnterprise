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
-- Includes through V2 Program A Sprint 6:
--   Foundation, CRM, Projects, Data Platform, Finance, AI Automation & Workflows, Analytics, Settings & Administration, HRMS & Employee Management, Inventory & Asset Management, Customer Support & Service Management, Sales Pipeline & Revenue Operations, Document & Content Management, AI Orchestration Layer, Enterprise Knowledge & Memory Engine, AI Business Analyst, AI Solution Architect, AI Development Factory, AI QA Engineer, AI DevOps & Deployment Engineer, AI Customer Success Manager, Founder Operating System, Autonomous Company v1, Commercial Multi-Tenant SaaS Platform, Enterprise Identity Platform, Customer Lifecycle & Tenant Operations Platform, Enterprise Billing & Revenue Platform, Enterprise Customer Communication & Notification Hub, Enterprise Integration Platform
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
