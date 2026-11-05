export const HELD_TENANT_MIGRATIONS = new Set([
    "202610120001_org_membership_escalation_lockdown.sql",
    "202610120002_read_scope_lockdown.sql",
    "202610120003_legacy_table_rls_lockdown.sql",
    "202610120004_module_tables_tenant_reads.sql",
]);

export function createMigrationApplyPlan(env = process.env) {
    const target = env.SUPABASE_MIGRATION_TARGET?.trim().toLowerCase();
    const includeHeld = env.ALLOW_HELD_MIGRATIONS === "true";
    const stagingApproved = env.STAGING_VALIDATION_APPROVED === "true";

    if (target !== "staging" && target !== "production") {
        throw new Error("Set SUPABASE_MIGRATION_TARGET=staging or production before applying migrations.");
    }
    if (target === "production" && !stagingApproved) {
        throw new Error("Production migrations require STAGING_VALIDATION_APPROVED=true after staging validation.");
    }

    return {
        target,
        includeHeld,
        shouldApply(file) {
            return includeHeld || !HELD_TENANT_MIGRATIONS.has(file);
        },
    };
}
