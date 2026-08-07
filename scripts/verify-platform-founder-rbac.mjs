/**
 * Contract checks: organization_members role CHECK aligns with app RBAC.
 * Migration must not rewrite handle_new_profile().
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const sql = fs.readFileSync(path.join(root, "supabase/migrations/202608070001_grant_platform_founder.sql"), "utf8");

assert.ok(sql.includes("organization_members_role_name_check"));
assert.ok(sql.includes("drop constraint if exists organization_members_role_name_check"));
assert.ok(sql.includes("'founder'::text"));
assert.ok(sql.includes("'owner'::text"));
assert.ok(sql.includes("chittemprashantharjun@gmail.com"));
assert.ok(sql.includes("role_name = 'founder'"));
assert.ok(!/create\s+or\s+replace\s+function\s+public\.handle_new_profile/i.test(sql));
assert.ok(!sql.toLowerCase().includes("drop policy"));
assert.ok(!sql.toLowerCase().includes("disable row level security"));

console.log("verify-platform-founder-rbac: ok");
