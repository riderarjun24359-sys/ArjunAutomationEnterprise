#!/usr/bin/env node
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const read = (path) => {
    try { return readFileSync(join(root, path), "utf8"); } catch { return ""; }
};
const checks = [];
const check = (name, ok) => checks.push({ name, ok: Boolean(ok) });

const bridges = read("src/modules/ai-command-center/integrations/platform-bridges.ts");
check("support failure is not reported as 100% SLA", !bridges.includes("slaCompliance: 100"));
check("support failure is not reported as 90% health", !bridges.includes("supportHealth: 90"));
check("delivery failure is not reported as 100% quality", !bridges.includes("qualityPassRate: 100"));
check("global operations failure is not reported healthy", !bridges.includes("customerHealth: 75") && !bridges.includes("deliveryHealth: 85"));
check("production failure is not reported as 90% health", !bridges.includes("overallScore: 90"));

const agentEngine = read("src/modules/ai-command-center/engines/health-monitoring.engine.ts");
check("agent availability requires a real heartbeat", agentEngine.includes('status: "unknown"') && !agentEngine.includes("input.systemHealth - i * 2"));

const revenueEngine = read("src/modules/ai-command-center/engines/executive-analytics.engine.ts");
const revenueUi = read("src/modules/ai-command-center/components/AiCommandCenterDashboard.tsx");
const globalOps = read("src/modules/customer-success-global-ops/services/customer-success-global-ops.service.ts");
check("MRR is never estimated from active client count", revenueEngine.includes("mrr: input.mrrEstimate ?? 0") && !revenueEngine.includes("activeClients *"));
check("revenue includes an explicit verification state", revenueEngine.includes("mrrVerified: false") && revenueUi.includes("Not verified"));
check("Command Centre revenue UI does not show USD", !revenueUi.includes("$"));
check("Global Operations does not fabricate MRR from renewals", globalOps.includes("mrr: 0, // No provider-verified recurring payment ledger"));

const repository = read("src/modules/ai-command-center/repository/ai-command-center-repository.ts");
const hook = read("src/modules/ai-command-center/hooks/useAiCommandCenter.ts");
const actionRoute = read("src/app/api/ai-command-center/recommendations/route.ts");
check("recommendation refresh preserves stored decisions", repository.includes("ignoreDuplicates: true"));
check("recommendation IDs are stable", read("src/modules/ai-command-center/engines/recommendation.engine.ts").includes("const stableId"));
check("recommendation actions use authenticated API", hook.includes("/api/ai-command-center/recommendations"));
check("recommendation action API enforces session permission", actionRoute.includes("secureApiRoute") && actionRoute.includes('permission: "automationManage"'));
check("recommendation action API scopes updates to organization", actionRoute.includes('.eq("organization_id", organizationId)'));

const jarvis = read("src/modules/ai-sales-lead-engine/services/jarvis-calling-window.ts");
check("Jarvis excludes Sunday and enforces 08:00-21:00 IST", jarvis.includes('values.weekday !== "Sun"') && jarvis.includes("hour >= 8 && hour < 21"));
check("Jarvis route uses shared calling-window policy", read("src/app/api/ai-sales/jarvis/call/route.ts").includes("withinJarvisCallingWindow"));

const migrationDir = join(root, "supabase", "migrations");
const migrationFiles = readdirSync(migrationDir).filter((file) => file.endsWith(".sql")).sort();
const versions = new Map();
const duplicates = [];
for (const file of migrationFiles) {
    const match = /^(\d{8,14})_/.exec(file);
    if (!match) {
        check("all migration files have timestamp prefixes", false);
        continue;
    }
    const prior = versions.get(match[1]);
    if (prior) duplicates.push([match[1], prior, file]);
    else versions.set(match[1], file);
}
check("migration timestamps are unique", duplicates.length === 0);
check("final identity RLS migration is ordered after Priya migrations", existsSync(join(migrationDir, "202611230011_rls_identity_grants_and_admin_lookup.sql")) && !existsSync(join(migrationDir, "202611230001_rls_identity_grants_and_admin_lookup.sql")));
check("Command Centre integrity unit tests exist", existsSync(join(root, "src/modules/ai-command-center/engines/command-centre-integrity.test.ts")));

const failures = checks.filter((item) => !item.ok);
for (const item of checks) console.log(`${item.ok ? "PASS" : "FAIL"} ${item.name}`);
if (duplicates.length) console.error("Duplicate migration versions:", duplicates);
console.log(`\nCommand Centre integration guardrails: ${checks.length - failures.length}/${checks.length} passed`);
process.exit(failures.length ? 1 : 0);
