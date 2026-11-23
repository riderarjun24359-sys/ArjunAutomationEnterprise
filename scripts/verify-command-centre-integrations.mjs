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
check("upstream integration outages are explicit", read("src/modules/ai-command-center/services/ai-command-center.service.ts").includes("integrationIssues") && read("src/modules/ai-command-center/components/AiCommandCenterDashboard.tsx").includes("Integrations needing attention"));
check("global operations does not synthesize client health or renewals", !read("src/modules/customer-success-global-ops/services/customer-success-global-ops.service.ts").includes("buildDefaultSuccessPlans") && !read("src/modules/customer-success-global-ops/services/customer-success-global-ops.service.ts").includes("buildRenewals"));
const globalOpsBridges = read("src/modules/customer-success-global-ops/integrations/platform-bridges.ts");
check("Global Operations support failure is not 100% SLA", !globalOpsBridges.includes("slaCompliance: 100"));
check("Global Operations delivery failure is not 100% quality", !globalOpsBridges.includes("qualityPassRate: 100"));
check("Global Operations exposes unavailable upstream integrations", read("src/modules/customer-success-global-ops/services/customer-success-global-ops.service.ts").includes("integrationIssues") && read("src/modules/customer-success-global-ops/components/CustomerSuccessGlobalOpsPage.tsx").includes("Integrations needing attention"));
check("support dashboard cannot silently turn missing org context into zero-ticket health", read("src/modules/support/services/support.service.ts").includes("Unable to resolve organization context for support dashboard"));
check("support SLA is zero when there are no measurable tickets", read("src/modules/database/lib/support-mappers.ts").includes("slaTotal > 0 ? Math.round((slaMet / slaTotal) * 100) : 0"));
const globalOpsService = read("src/modules/customer-success-global-ops/services/customer-success-global-ops.service.ts");
const globalOpsEngine = read("src/modules/customer-success-global-ops/engines/continuous-improvement.engine.ts");
check("Global Operations does not synthesize onboarding sessions", !globalOpsService.includes("buildOnboardingSessions("));
check("Global Operations does not synthesize satisfaction history", globalOpsService.includes("satisfactionTrend: []") && !globalOpsService.includes("buildSatisfactionTrend("));
check("Global Operations does not claim nominal without real health data", !globalOpsEngine.includes("Operations nominal"));
check("Global Operations does not show delivery health without active engagements", globalOpsService.includes("delivery.available && delivery.activeEngagements > 0"));
check("Global Operations does not create generic empty-evidence improvement items", !globalOpsEngine.includes("Auto-generated continuous improvement item"));
check("Global Operations trust regression tests exist", existsSync(join(root, "src/modules/customer-success-global-ops/engines/trust-integrity.test.ts")));



const revenueEngine = read("src/modules/ai-command-center/engines/executive-analytics.engine.ts");
const revenueUi = read("src/modules/ai-command-center/components/AiCommandCenterDashboard.tsx");
const globalOps = read("src/modules/customer-success-global-ops/services/customer-success-global-ops.service.ts");
check("MRR is never estimated from active client count", revenueEngine.includes("mrr: input.mrrEstimate ?? 0") && !revenueEngine.includes("activeClients *"));
check("revenue includes an explicit verification state", revenueEngine.includes("mrrVerified: false") && revenueUi.includes("Not verified"));
check("Command Centre revenue UI does not show USD", !revenueUi.includes("USD") && !revenueUi.includes('currency: "USD"'));
check("Global Operations does not fabricate MRR from renewals", globalOps.includes("mrr: 0, // No provider-verified recurring payment ledger"));
check("Global Operations does not display unverified renewal amounts as currency", !read("src/modules/customer-success-global-ops/components/GlobalOperationsPanels.tsx").includes("r.amount.toLocaleString"));

const repository = read("src/modules/ai-command-center/repository/ai-command-center-repository.ts");
const hook = read("src/modules/ai-command-center/hooks/useAiCommandCenter.ts");
const actionRoute = read("src/app/api/ai-command-center/recommendations/route.ts");
check("recommendation refresh preserves stored decisions", repository.includes("ignoreDuplicates: true"));
check("recommendation IDs are stable", read("src/modules/ai-command-center/engines/recommendation.engine.ts").includes("const stableId"));
check("recommendation actions use authenticated API", hook.includes("/api/ai-command-center/recommendations"));
check("recommendation action API enforces session permission", actionRoute.includes("secureApiRoute") && actionRoute.includes('permission: "automationManage"'));
check("recommendation action API scopes updates to organization", actionRoute.includes('.eq("organization_id", auth.organizationId)'));

const jarvis = read("src/modules/ai-sales-lead-engine/services/jarvis-calling-window.ts");
check("Jarvis excludes Sunday and enforces 08:00-21:00 IST", jarvis.includes('values.weekday !== "Sun"') && jarvis.includes("hour >= 8 && hour < 21"));
check("Jarvis route uses shared calling-window policy", read("src/app/api/ai-sales/jarvis/call/route.ts").includes("withinJarvisCallingWindow"));
check("deal Won remains blocked until verified payment mapping", read("src/app/api/ai-sales/tools/update-deal-stage/route.ts").includes("verified_payment_mapping_required"));
check("authenticated recommendation route has unit tests", existsSync(join(root, "src/app/api/ai-command-center/recommendations/route.test.ts")));
check("Vapi and Retell outbound adapter contracts have mocked tests", read("src/modules/ai-voice-agent/providers/voice-provider.test.ts").includes("mocked; no live calls"));
check("Vapi webhook authentication and event normalization tests exist", existsSync(join(root, "src/app/api/ai-sales/webhooks/vapi/route.test.ts")));
check("Retell webhook HMAC and event normalization tests exist", existsSync(join(root, "src/app/api/ai-sales/webhooks/retell/route.test.ts")));
check("WhatsApp Meta HMAC and delivery-status webhook tests exist", existsSync(join(root, "src/app/api/ai-sales/webhooks/whatsapp/route.test.ts")));

const jarvisBriefing = read("src/app/api/ai-sales/jarvis/briefing/route.ts");
check("Jarvis hides collected revenue until verified Razorpay payment-to-invoice mapping exists", jarvisBriefing.includes("weekly_revenue_inr: null") && jarvisBriefing.includes("payment_to_invoice_mapping_required") && jarvisBriefing.includes("mrr_inr: null"));
check("Jarvis revenue remains hidden until Razorpay webhook is configured", jarvisBriefing.includes("RAZORPAY_WEBHOOK_SECRET") && jarvisBriefing.includes("razorpay_webhook_not_configured_mrr_not_available"));
const workflowFiles = [
    "n8n/workflows/01-priya-followup-dispatcher.json",
    "n8n/workflows/02-jarvis-daily-briefing.json",
    "n8n/workflows/03-jarvis-verified-event-alert.json",
    "n8n/workflows/04-priya-google-meet-demo-booking.json",
];
for (const file of workflowFiles) {
    let parsed = null;
    try { parsed = JSON.parse(read(file)); } catch { /* reported below */ }
    check("n8n workflow JSON valid: " + file, Boolean(parsed && Array.isArray(parsed.nodes) && parsed.nodes.length > 0));
    check("n8n workflow remains inactive: " + file, parsed?.active === false);
}


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
const executiveService = read("src/modules/executive-command-center/services/executive-command-center.service.ts");
const executiveRevenue = read("src/modules/executive-command-center/services/live-operations-stats.service.ts");
const executiveCharts = read("src/modules/executive-command-center/services/executive-charts.service.ts");
check("Executive Command Centre never reports nominal when operational data is unavailable", executiveService.includes("Live operational data is unavailable") && !executiveService.includes("All systems nominal"));
check("Executive Command Centre hides legacy USD finance widgets", executiveService.includes("finance: null"));
check("Executive Command Centre collected revenue is unverified until Razorpay reconciliation", executiveRevenue.includes('label: "Not verified"') && executiveRevenue.includes("verified: false") && !executiveRevenue.includes("clientRevenueHint"));
check("Executive Command Centre revenue trend excludes unverified payments and invoices", executiveCharts.includes("return [];") && executiveCharts.includes("not a signed settlement ledger"));
check("Executive Command Centre integrity unit tests exist", existsSync(join(root, "src/modules/executive-command-center/services/live-operations-stats.service.test.ts")));

const failures = checks.filter((item) => !item.ok);
for (const item of checks) console.log(`${item.ok ? "PASS" : "FAIL"} ${item.name}`);
if (duplicates.length) console.error("Duplicate migration versions:", duplicates);
console.log(`\nCommand Centre integration guardrails: ${checks.length - failures.length}/${checks.length} passed`);
process.exit(failures.length ? 1 : 0);
