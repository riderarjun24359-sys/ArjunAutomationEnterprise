import { describe, it, expect } from "vitest";
import {
    assertCriticalProductionSecrets,
    isProductionCutoverRuntime,
    listMissingCriticalSecrets,
    ProductionSecretsError,
} from "./production-secrets";

describe("production-secrets gate", () => {
    it("never throws outside cutover runtime", () => {
        expect(() =>
            assertCriticalProductionSecrets({ NODE_ENV: "development" } as unknown as NodeJS.ProcessEnv),
        ).not.toThrow();
        expect(isProductionCutoverRuntime({ NODE_ENV: "development" } as unknown as NodeJS.ProcessEnv)).toBe(false);
    });

    it("requires the intake organization id in cutover runtime", () => {
        const env = {
            NODE_ENV: "production",
            AAOS_DEPLOY_ENV: "production",
            NEXT_PUBLIC_APP_URL: "https://example.com",
            NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
            NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon",
            PLATFORM_LEAD_API_KEY: "key",
        } as unknown as NodeJS.ProcessEnv;
        expect(isProductionCutoverRuntime(env)).toBe(true);
        expect(listMissingCriticalSecrets(env)).toEqual(["PLATFORM_ORGANIZATION_ID"]);
        expect(() => assertCriticalProductionSecrets(env)).toThrow(ProductionSecretsError);
    });

    it("always fails closed on public service-role exposure", () => {
        const env = {
            NODE_ENV: "development",
            NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY: "leaked",
        } as unknown as NodeJS.ProcessEnv;
        expect(() => assertCriticalProductionSecrets(env)).toThrow(/must never be set/);
    });
});
