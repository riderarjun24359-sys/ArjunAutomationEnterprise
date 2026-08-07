/**
 * Operator: expand organization_members.role_name CHECK + grant Founder.
 * Requires SUPABASE_DB_URL (postgres connection string) OR run the SQL migration
 * in Supabase SQL Editor (recommended for production).
 *
 * Preferred production path:
 *   Paste supabase/migrations/202608070001_grant_platform_founder.sql
 *   into Supabase Dashboard → SQL → Run
 *
 * Optional CLI path (when SUPABASE_DB_URL is set):
 *   node scripts/apply-organization-member-roles.mjs
 */
import fs from "node:fs";
import path from "node:path";
import pg from "pg";

const ROOT = process.cwd();
const MIGRATION = path.join(ROOT, "supabase/migrations/202608070001_grant_platform_founder.sql");

function loadEnvFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
        if (!line || line.trim().startsWith("#")) continue;
        const i = line.indexOf("=");
        if (i <= 0) continue;
        const key = line.slice(0, i).trim();
        let value = line.slice(i + 1).trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }
        if (!(key in process.env)) process.env[key] = value;
    }
}

loadEnvFile(path.join(ROOT, ".env.local"));
loadEnvFile(path.join(ROOT, ".env"));

const dbUrl = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;
if (!dbUrl) {
    console.error("Missing SUPABASE_DB_URL / DATABASE_URL.");
    console.error("Apply supabase/migrations/202608070001_grant_platform_founder.sql in the Supabase SQL Editor.");
    process.exit(1);
}

const sql = fs.readFileSync(MIGRATION, "utf8");
const client = new pg.Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });

await client.connect();
try {
    await client.query("begin");
    await client.query(sql);
    await client.query("commit");

    const check = await client.query(
        `select pg_get_constraintdef(oid) as def
         from pg_constraint
         where conrelid = 'public.organization_members'::regclass
           and conname = 'organization_members_role_name_check'`,
    );
    console.log("constraint:", check.rows[0]?.def ?? "(missing)");

    const founders = await client.query(
        `select up.email, om.role_name, om.is_active
         from public.organization_members om
         join public.user_profiles up on up.id = om.user_id
         where lower(up.email) = lower('chittemprashantharjun@gmail.com')`,
    );
    console.log("founder rows:", founders.rows);
    console.log("apply-organization-member-roles: ok");
} catch (error) {
    await client.query("rollback");
    console.error("Migration failed:", error.message);
    process.exit(1);
} finally {
    await client.end();
}
