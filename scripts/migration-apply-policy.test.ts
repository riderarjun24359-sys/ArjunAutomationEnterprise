import { describe, expect, it } from "vitest";
import { createMigrationApplyPlan, HELD_TENANT_MIGRATIONS } from "./migration-apply-policy.mjs";

const held = [...HELD_TENANT_MIGRATIONS][0];
const ordinary = "202611050001_membership_role_management_hardening.sql";

describe("migration apply policy", () => {
    it("requires an explicit target environment", () => {
        expect(() => createMigrationApplyPlan({ NODE_ENV: "test" })).toThrow(/SUPABASE_MIGRATION_TARGET/);
    });

    it("blocks production until staging validation is approved", () => {
        expect(() => createMigrationApplyPlan({ NODE_ENV: "test", SUPABASE_MIGRATION_TARGET: "production" })).toThrow(/STAGING_VALIDATION_APPROVED/);
    });

    it("allows ordinary staging migrations while excluding held tenant migrations by default", () => {
        const plan = createMigrationApplyPlan({ NODE_ENV: "test", SUPABASE_MIGRATION_TARGET: "staging" });
        expect(plan.shouldApply(ordinary)).toBe(true);
        expect(plan.shouldApply(held)).toBe(false);
    });

    it("includes held migrations only after explicit opt-in", () => {
        const plan = createMigrationApplyPlan({
            NODE_ENV: "test",
            SUPABASE_MIGRATION_TARGET: "staging",
            ALLOW_HELD_MIGRATIONS: "true",
        });
        expect(plan.shouldApply(held)).toBe(true);
    });

    it("allows production only after staging approval", () => {
        const plan = createMigrationApplyPlan({
            NODE_ENV: "test",
            SUPABASE_MIGRATION_TARGET: "production",
            STAGING_VALIDATION_APPROVED: "true",
        });
        expect(plan.shouldApply(ordinary)).toBe(true);
        expect(plan.shouldApply(held)).toBe(false);
    });
});
