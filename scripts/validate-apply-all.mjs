#!/usr/bin/env node

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import pg from "pg";

const { Client } = pg;
const root = process.cwd();

function loadEnvFile(relativePath) {
    const filePath = join(root, relativePath);
    if (!existsSync(filePath)) return;

    for (const line of readFileSync(filePath, "utf8").split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const separator = trimmed.indexOf("=");
        if (separator === -1) continue;
        const key = trimmed.slice(0, separator).trim();
        const value = trimmed.slice(separator + 1).trim();
        if (!process.env[key]) {
            process.env[key] = value;
        }
    }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

const databaseUrl = process.env.SUPABASE_DB_URL ?? process.env.DATABASE_URL;

const authStubSql = `
create schema if not exists auth;

-- Hosted Supabase always provides anon/authenticated; create them for PGlite.
do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then
    create role anon;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then
    create role authenticated;
  end if;
end
$$;

create or replace function auth.uid()
returns uuid
language sql
stable
as $$
  select null::uuid;
$$;

create or replace function auth.role()
returns text
language sql
stable
as $$
  select 'authenticated'::text;
$$;

create or replace function gen_random_uuid()
returns uuid
language sql
as $$
  select gen_random_uuid();
$$;
`;

async function validateAgainstPglite() {
    const { PGlite } = await import("@electric-sql/pglite");
    const db = new PGlite();
    const dirs = [
        { dir: join(root, "supabase", "migrations"), label: "migration" },
        { dir: join(root, "supabase", "seed"), label: "seed" },
    ];

    try {
        await db.exec(authStubSql);

        for (const { dir, label } of dirs) {
            const files = readdirSync(dir)
                .filter((file) => file.endsWith(".sql"))
                .sort();

            for (const file of files) {
                let sql = readFileSync(join(dir, file), "utf8");
                sql = sql.replace(
                    /create extension if not exists "uuid-ossp";/gi,
                    "-- uuid-ossp stubbed for embedded validation",
                );
                // PGlite (PG17) ships gen_random_uuid() in core; the extension
                // DDL exists for hosted Postgres. Stub it so local validation
                // can execute the full migration chain.
                sql = sql.replace(
                    /create extension if not exists "pgcrypto";/gi,
                    "-- pgcrypto stubbed for embedded validation (core in PG13+)",
                );
                try {
                    await db.exec(`begin; ${sql} commit;`);
                } catch (error) {
                    return {
                        skipped: false,
                        pass: false,
                        engine: "pglite",
                        error: `${label} ${file}: ${error instanceof Error ? error.message : error}`,
                    };
                }
            }
        }

        return { skipped: false, pass: true, engine: "pglite" };
    } finally {
        await db.close();
    }
}

async function validateAgainstDatabase() {
    if (!databaseUrl) {
        return validateAgainstPglite();
    }

    const applyAllPath = join(root, "supabase", "apply_all.sql");
    const applyAllSql = readFileSync(applyAllPath, "utf8");
    const client = new Client({
        connectionString: databaseUrl,
        ssl: databaseUrl.includes("localhost") ? false : { rejectUnauthorized: false },
    });

    await client.connect();
    try {
        await client.query("begin");
        await client.query(authStubSql);
        await client.query(applyAllSql);
        await client.query("rollback");
        return { skipped: false, pass: true, engine: "postgres" };
    } catch (error) {
        await client.query("rollback").catch(() => undefined);
        return {
            skipped: false,
            pass: false,
            engine: "postgres",
            error: error instanceof Error ? error.message : String(error),
        };
    } finally {
        await client.end();
    }
}

function extractInsertBlocks(sql) {
    const blocks = [];
    const pattern = /insert\s+into\s+public\.([a-z_]+)[\s\S]*?(?=;\s*(?:insert|create|drop|alter|--|\ncommit\b|$))/gi;
    let match;
    while ((match = pattern.exec(sql)) !== null) {
        blocks.push({ table: match[1], sql: match[0] });
    }
    return blocks;
}

function extractExplicitIds(sql) {
    const ids = new Set();
    const pattern =
        /\(\s*'([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})'/gi;
    let match;
    while ((match = pattern.exec(sql)) !== null) {
        ids.add(match[1].toLowerCase());
    }
    return ids;
}

function extractFkReferences(sql) {
    const refs = [];
    const columns = [
        "organization_id",
        "client_id",
        "project_id",
        "company_id",
        "primary_contact_id",
        "estimate_id",
        "invoice_id",
        "tax_rate_id",
        "task_id",
        "label_id",
        "role_id",
        "permission_id",
        "template_id",
        "agent_id",
        "workflow_id",
        "execution_id",
    ];

    for (const column of columns) {
        const pattern = new RegExp(`${column}\\s*,\\s*'([0-9a-f-]{36})'`, "gi");
        let match;
        while ((match = pattern.exec(sql)) !== null) {
            refs.push({ column, id: match[1].toLowerCase() });
        }
    }

    return refs;
}

function validateSeedReferences() {
    const seedsDir = join(root, "supabase", "seed");
    const seedFiles = readdirSync(seedsDir)
        .filter((file) => file.endsWith(".sql"))
        .sort();

    const tableIds = new Map();
    const parentMap = {
        organization_id: "organizations",
        client_id: "clients",
        project_id: "projects",
        company_id: "companies",
        primary_contact_id: "contacts",
        estimate_id: "estimates",
        invoice_id: "invoices",
        tax_rate_id: "tax_rates",
        task_id: "tasks",
        label_id: "task_labels",
        role_id: "roles",
        permission_id: "permissions",
        template_id: "workflow_templates",
        agent_id: "ai_agents",
        workflow_id: "workflows",
        execution_id: "workflow_executions",
    };

    const violations = [];

    for (const file of seedFiles) {
        const sql = readFileSync(join(seedsDir, file), "utf8");
        const blocks = extractInsertBlocks(sql);

        for (const block of blocks) {
            const ids = extractExplicitIds(block.sql);
            if (ids.size > 0) {
                const existing = tableIds.get(block.table) ?? new Set();
                for (const id of ids) existing.add(id);
                tableIds.set(block.table, existing);
            }

            for (const ref of extractFkReferences(block.sql)) {
                const parentTable = parentMap[ref.column];
                if (!parentTable) continue;
                const parentIds = tableIds.get(parentTable);
                if (!parentIds?.has(ref.id)) {
                    violations.push(
                        `${file}: ${block.table}.${ref.column} references missing ${parentTable}.id ${ref.id}`,
                    );
                }
            }
        }
    }

    return { pass: violations.length === 0, violations, seedFiles: seedFiles.length };
}

const staticResult = validateSeedReferences();
console.log("Static seed FK validation:");
console.log(`  Seeds checked: ${staticResult.seedFiles}`);
if (staticResult.pass) {
    console.log("  PASS: All explicit foreign key UUIDs resolve to prior seed inserts.");
} else {
    console.log("  FAIL:");
    for (const violation of staticResult.violations) {
        console.log(`    - ${violation}`);
    }
}

const dbResult = await validateAgainstDatabase();
console.log("\nDatabase execution validation:");
if (dbResult.pass) {
    console.log(
        `  PASS: apply_all.sql executed successfully (${dbResult.engine ?? "postgres"}).`,
    );
} else {
    console.log(`  FAIL (${dbResult.engine ?? "postgres"}): ${dbResult.error}`);
}

const exitCode = staticResult.pass && dbResult.pass ? 0 : 1;
process.exit(exitCode);
