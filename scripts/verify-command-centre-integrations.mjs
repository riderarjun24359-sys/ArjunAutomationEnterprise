#!/usr/bin/env node
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const read = (path) => {
    try { return readFileSync(join(root, path), "utf8"); } catch { return ""; }
};
const checks = [];
const check = (name, ok) => checks.push({ name, ok: Boolean(ok) });

const bridges = read("src/modules/ai-command-center/integrations/platform-bridges.ts");
const health = read("src/modules/ai-command-center/engines/health-monitoring.engine.ts");
const system = read("src/modules/ai-command-center/engines/system-monitor.engine.ts");
const commandService = read("src/modules/ai-command-center/services/ai-command-center.service.ts");
const dashboard = read("src/modules/ai-command-center/components/AiCommandCenterDashboard.tsx");
const page = read("src/modules/ai-command-center/components/AiCommandCenterPage.tsx");

check("Command Centre does not invent production SLA or quality scores", !bridges.includes("slaCompliance: 100") && !bridges.includes("qualityPassRate: 100"));
check("Command Centre labels simulated health and backup data as unverified", bridges.includes("simulated, not externally verified") && bridges.includes("available: false"));
check("Missing system health is not replaced by a 90 percent default", !system.includes("platformHealth ?? 90"));
check("Agent availability requires real heartbeat data", health.includes('status: "unknown"') && !health.includes("input.systemHealth - i * 2"));
check("Command Centre flags disconnected agent heartbeats", commandService.includes("Agent heartbeats (not connected)"));
check("Command Centre reports upstream integration issues", commandService.includes("integrationIssues") && dashboard.includes("Integrations needing attention"));
check("Command Centre requires tenant context for platform bridges", bridges.includes("Organization context unavailable"));
check("Command Centre renders unavailable KPIs explicitly", page.includes("Not available") && dashboard.includes("Partial data"));

const recommendationRoute = read("app/api/ai-command-center/recommendations/route.ts");
check("Recommendation actions require an authenticated permission", recommendationRoute.includes("secureApiRoute") && recommendationRoute.includes('permission: "automationManage"'));
check("Recommendation updates are scoped to the authenticated organization", recommendationRoute.includes('.eq("organization_id", auth.organizationId)'));

const priyaOutbound = read("app/api/ai-sales/outbound/route.ts");
const priyaDispatch = read("app/api/ai-sales/dispatch-followups/route.ts");
check("Priya outbound is disabled by default unless explicitly enabled", priyaOutbound.includes('ARJUN_AI_SALES_OUTBOUND_ENABLED !== "true"'));
check("Priya direct outbound requires recorded, recent, matching consent", priyaOutbound.includes("ai_voice_contact_consents") && priyaOutbound.includes("granted_at") && priyaOutbound.includes("revoked_at"));
check("Priya direct outbound checks organization-scoped suppression", priyaOutbound.includes("ai_sales_suppressions") && priyaOutbound.includes("organization_id"));
check("Priya dispatcher rechecks consent and suppression before each call", priyaDispatch.includes("ai_voice_contact_consents") && priyaDispatch.includes("ai_sales_suppressions"));
check("Priya dispatcher fails closed outside approved IST calling hours", priyaDispatch.includes("withinApprovedCallingWindow") && priyaDispatch.includes("Outside approved IST calling window"));
check("Priya dispatch does not automatically retry uncertain provider outcomes", priyaDispatch.includes("Never auto-retry stale processing rows"));

const jarvisCall = read("app/api/ai-sales/jarvis/call/route.ts");
const jarvisWindow = read("src/modules/ai-sales-lead-engine/services/jarvis-calling-window.ts");
check("Jarvis calling is disabled unless explicitly enabled", jarvisCall.includes('ARJUN_JARVIS_CALLS_ENABLED !== "true"'));
check("Jarvis enforces owner authorization and approved calling window", jarvisCall.includes("ARJUN_JARVIS_OWNER_USER_ID") && jarvisCall.includes("withinJarvisCallingWindow"));
check("Jarvis scheduled calls require idempotency keys", jarvisCall.includes("An idempotencyKey is required") && jarvisCall.includes("idempotency_key"));
check("Jarvis calling window excludes Sundays and restricts local hours", jarvisWindow.includes('values.weekday !== "Sun"') && jarvisWindow.includes("hour >= 8 && hour < 21"));
check("Jarvis briefing does not fabricate revenue or MRR", read("app/api/ai-sales/jarvis/briefing/route.ts").includes("mrr_inr: null") && read("app/api/ai-sales/jarvis/briefing/route.ts").includes("weekly_revenue_inr: null"));

check("Provider adapter tests are mocked and do not place live calls", read("src/modules/ai-voice-agent/providers/voice-provider.test.ts").includes("mocked; no live calls"));
check("Vapi webhook auth and event-normalization tests exist", existsSync(join(root, "app/api/ai-sales/webhooks/vapi/route.test.ts")));
check("Retell webhook authentication tests exist", existsSync(join(root, "app/api/ai-sales/webhooks/retell/route.test.ts")));
check("WhatsApp webhook authentication tests exist", existsSync(join(root, "app/api/ai-sales/webhooks/whatsapp/route.test.ts")));
check("Vapi ignored events return an empty 204 response", read("app/api/ai-sales/webhooks/vapi/route.ts").includes("return new Response(null, { status: 204 });"));

for (const file of [
    "n8n/workflows/01-priya-followup-dispatcher.json",
    "n8n/workflows/02-jarvis-daily-briefing.json",
    "n8n/workflows/03-jarvis-verified-event-alert.json",
    "n8n/workflows/04-priya-google-meet-demo-booking.json",
]) {
    let workflow;
    try { workflow = JSON.parse(read(file)); } catch { workflow = null; }
    check("n8n workflow is valid JSON and contains nodes: " + file, Boolean(workflow && Array.isArray(workflow.nodes) && workflow.nodes.length > 0));
    check("n8n workflow remains inactive pending credentials and QA: " + file, workflow?.active === false);
}

const voiceMigration = read("supabase/migrations/202611210001_arjun_ai_voice_agent.sql");
const salesMigration = read("supabase/migrations/202611230001_priya_autonomous_sales_engine.sql");
const suppressionMigration = read("supabase/migrations/202611230002_priya_sales_suppression.sql");
const dispatchMigration = read("supabase/migrations/202611230004_priya_followup_dispatcher.sql");
const jarvisMigration = read("supabase/migrations/202611230008_jarvis_call_idempotency.sql");
check("Voice consent and call-event tables enable RLS and revoke browser-role access", voiceMigration.includes("enable row level security") && voiceMigration.includes("revoke all on public.ai_voice_contact_consents from anon, authenticated"));
check("Priya sales tables enable RLS and revoke browser-role access", salesMigration.includes("enable row level security") && salesMigration.includes("revoke all on public.ai_sales_followups from anon, authenticated"));
check("Do-not-contact ledger is organization-scoped and server-only", suppressionMigration.includes("organization_id, phone_number") && suppressionMigration.includes("revoke all on public.ai_sales_suppressions from anon, authenticated"));
check("Follow-up claim function is executable only by service_role", dispatchMigration.includes("revoke all on function public.claim_due_ai_sales_followups(uuid, integer) from public, anon, authenticated") && dispatchMigration.includes("to service_role"));
check("Jarvis call idempotency is unique per organization", jarvisMigration.includes("unique index") && jarvisMigration.includes("(organization_id, idempotency_key)"));

const failures = checks.filter((item) => !item.ok);
for (const item of checks) console.log(`${item.ok ? "PASS" : "FAIL"} ${item.name}`);
console.log(`\nIntegration guardrails: ${checks.length - failures.length}/${checks.length} passed`);
process.exit(failures.length ? 1 : 0);
