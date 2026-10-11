// @vitest-environment node
import { describe, it, expect } from "vitest";
import { describeServiceRoleStatus, getServiceRoleClient, isServiceRoleConfigured } from "@/src/lib/supabase-service-role";

describe("supabase-service-role (server-only)", () => {
    it("reports unconfigured when env is missing", () => {
        expect(isServiceRoleConfigured({} as unknown as NodeJS.ProcessEnv)).toBe(false);
        expect(getServiceRoleClient({} as unknown as NodeJS.ProcessEnv)).toBeNull();
        expect(describeServiceRoleStatus({} as unknown as NodeJS.ProcessEnv)).toBe("service-role:unconfigured");
    });

    it("never exposes the key through status output", () => {
        const env = {
            NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
            SUPABASE_SERVICE_ROLE_KEY: "service-role-test-value",
        } as unknown as NodeJS.ProcessEnv;
        expect(isServiceRoleConfigured(env)).toBe(true);
        expect(getServiceRoleClient(env)).not.toBeNull();
        const status = describeServiceRoleStatus(env);
        expect(status).toBe("service-role:configured");
        expect(status).not.toContain("service-role-test-value");
    });
});
