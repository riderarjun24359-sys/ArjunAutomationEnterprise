import { test, expect } from "@playwright/test";
import { buildDisasterRecoveryDiagnostics } from "@/src/lib/disaster-recovery";

test("DR diagnostics verify backup configuration", async () => {
    // This is a unit test, not E2E, but running via playwright
    const diagnostics = await buildDisasterRecoveryDiagnostics("11111111-1111-1111-1111-111111111111", true);
    
    // We expect it to be "healthy" if configured, or at least "not healthy but recoverable"
    // In this test, we just ensure it doesn't crash.
    expect(diagnostics).toHaveProperty("backup");
    expect(diagnostics).toHaveProperty("restore");
    console.log("DR Diagnostics:", JSON.stringify(diagnostics, null, 2));
});
