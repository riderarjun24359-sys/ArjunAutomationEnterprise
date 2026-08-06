/**
 * Next.js instrumentation — fail-closed when critical production secrets are missing.
 * Runs on Node.js runtime only.
 */
export async function register() {
    if (process.env.NEXT_RUNTIME === "edge") return;

    const { assertCriticalProductionSecrets } = await import("@/src/lib/production-secrets");
    try {
        assertCriticalProductionSecrets();
    } catch (error) {
        // Re-throw to abort boot in cutover/production; log for operators.
        console.error("[production-cutover] Startup secret gate failed:", error);
        throw error;
    }
}
