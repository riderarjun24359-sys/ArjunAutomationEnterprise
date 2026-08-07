/**
 * Operator script: grant Founder membership role by email.
 * Requires SUPABASE_SERVICE_ROLE_KEY + NEXT_PUBLIC_SUPABASE_URL.
 *
 * IMPORTANT: Run supabase/migrations/202608070001_grant_platform_founder.sql first
 * so organization_members_role_name_check allows 'founder' / 'owner'.
 *
 * Usage:
 *   node scripts/grant-platform-founder.mjs
 *   node scripts/grant-platform-founder.mjs --email=someone@example.com
 */
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const ROOT = process.cwd();
const DEFAULT_EMAIL = "chittemprashantharjun@gmail.com";

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

const emailArg = process.argv.find((a) => a.startsWith("--email="));
const email = (emailArg ? emailArg.slice("--email=".length) : DEFAULT_EMAIL).trim().toLowerCase();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL");
    process.exit(1);
}
if (!serviceKey) {
    console.error("Missing SUPABASE_SERVICE_ROLE_KEY (required to read user_profiles and grant role safely).");
    console.error("Alternatively run supabase/migrations/202608070001_grant_platform_founder.sql in the Supabase SQL Editor.");
    process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });

const { data: profiles, error: profileError } = await supabase
    .from("user_profiles")
    .select("id, email, auth_user_id, full_name")
    .ilike("email", email);

if (profileError) {
    console.error("Profile lookup failed:", profileError.message);
    process.exit(1);
}

if (!profiles?.length) {
    console.error(`No user_profiles row for email=${email}`);
    process.exit(1);
}

console.log(`Found ${profiles.length} profile(s) for ${email}`);

let updated = 0;
for (const profile of profiles) {
    const { data: memberships, error: listError } = await supabase
        .from("organization_members")
        .select("id, organization_id, role_name, is_active")
        .eq("user_id", profile.id)
        .eq("is_active", true);

    if (listError) {
        console.error("Membership list failed:", listError.message);
        process.exit(1);
    }

    if (!memberships?.length) {
        console.warn(`No active memberships for profile ${profile.id}; skipping`);
        continue;
    }

    for (const membership of memberships) {
        if (String(membership.role_name).toLowerCase() === "founder") {
            console.log(`Already founder: membership=${membership.id} org=${membership.organization_id}`);
            continue;
        }

        const { data: row, error: updateError } = await supabase
            .from("organization_members")
            .update({ role_name: "founder", updated_at: new Date().toISOString() })
            .eq("id", membership.id)
            .select("id, organization_id, role_name")
            .maybeSingle();

        if (updateError) {
            console.error("Update failed:", updateError.message);
            process.exit(1);
        }

        updated += 1;
        console.log(`Updated membership ${row.id}: ${membership.role_name} -> ${row.role_name} (org ${row.organization_id})`);
    }
}

console.log(`Done. Rows updated: ${updated}`);
console.log("Verify: sign in as the founder, open /founder-analytics — accessGranted should be true.");
