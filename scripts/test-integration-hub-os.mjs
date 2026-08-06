/**
 * Integration Hub & Public API OS unit tests (Sprint 7).
 * Run: node scripts/test-integration-hub-os.mjs
 */
import { existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const results = [];
function pass(check, ok, detail = "") {
    results.push({ check, pass: !!ok, detail });
}

const mod = join(root, "src/modules/integration-hub");
const required = [
    "repository/integration-hub.repository.ts",
    "builders/integration-hub.builders.ts",
    "services/integration-hub-os.service.ts",
    "ai/ai-integration-assistant.ts",
    "analytics/integration-hub.analytics.ts",
    "integrations/platform-bridges.ts",
    "integrations/executive-command-center-bridge.ts",
    "hooks/useIntegrationHubOs.ts",
    "pages/IntegrationHubOsPage.tsx",
    "types/os.ts",
    "utils/formatters.ts",
    "utils/audit.ts",
    "constants/os.ts",
    "components/IntegrationHubPage.tsx",
    "components/os/IntegrationHubPanels.tsx",
];
for (const f of required) pass(`file:${f}`, existsSync(join(mod, f)));

const page = readFileSync(join(mod, "pages/IntegrationHubOsPage.tsx"), "utf8");
pass("page:gateway", page.includes("GatewayPanel"));
pass("page:api-keys", page.includes("ApiKeysPanel"));
pass("page:webhooks", page.includes("WebhooksPanel"));
pass("page:oauth", page.includes("OauthPanel"));
pass("page:third-party", page.includes("ThirdPartyPanel"));
pass("page:marketplace", page.includes("MarketplacePanel"));
pass("page:triggers", page.includes("TriggersPanel"));
pass("page:analytics", page.includes("AnalyticsPanel"));
pass("page:developer", page.includes("DeveloperPortalPanel"));
pass("page:assistant", page.includes("AiIntegrationAssistantPanel"));

const ecc = readFileSync(join(root, "src/modules/executive-command-center/components/ExecutiveCommandCenterPage.tsx"), "utf8");
pass("ecc:integration-widgets", ecc.includes("ExecutiveIntegrationWidgetsPanel"));

const repo = readFileSync(join(mod, "repository/integration-hub.repository.ts"), "utf8");
pass("multi-tenant:org-context", repo.includes("resolveOrganizationContext"));
pass("supabase:hubs", repo.includes("intgIntegrationHubs"));
pass("supabase:apiKeys", repo.includes("intgApiKeys"));
pass("supabase:webhooks", repo.includes("intgOutgoingWebhooks"));
pass("supabase:marketplace", repo.includes("intgMarketplaceConnectors"));
pass("supabase:dweTriggers", repo.includes("dweWebhookTriggers"));

const buildersSrc = readFileSync(join(mod, "builders/integration-hub.builders.ts"), "utf8");
pass("builder:gateway", buildersSrc.includes("export function buildGateway"));
pass("builder:apiKeys", buildersSrc.includes("export function buildApiKeys"));
pass("builder:webhooks", buildersSrc.includes("export function buildWebhooks"));
pass("builder:oauth", buildersSrc.includes("export function buildOauth"));
pass("builder:thirdParty", buildersSrc.includes("export function buildThirdParty"));
pass("builder:marketplace", buildersSrc.includes("export function buildMarketplace"));
pass("builder:triggers", buildersSrc.includes("export function buildTriggers"));
pass("builder:analytics", buildersSrc.includes("export function buildAnalytics"));
pass("builder:developer", buildersSrc.includes("export function buildDeveloperPortal"));
pass("builder:audit", buildersSrc.includes("export function buildAuditTrail"));
pass("builder:snapshot", buildersSrc.includes("export function buildIntegrationHubSnapshot"));

const aiSrc = readFileSync(join(mod, "ai/ai-integration-assistant.ts"), "utf8");
pass("ai:daily-summary", aiSrc.includes("dailySummary"));
pass("ai:executive-summary", aiSrc.includes("executiveSummary"));

const auditSrc = readFileSync(join(mod, "utils/audit.ts"), "utf8");
pass("audit:write", auditSrc.includes("writeIntegrationAuditLog"));

const osTypes = readFileSync(join(mod, "types/os.ts"), "utf8");
pass("providers:google", osTypes.includes("google_workspace"));
pass("providers:slack", osTypes.includes("slack"));
pass("providers:stripe", osTypes.includes("stripe"));
pass("providers:razorpay", osTypes.includes("razorpay"));
pass("providers:zoom", osTypes.includes("zoom"));

function clampScore(n) {
    if (!Number.isFinite(n)) return 0;
    return Math.max(0, Math.min(100, Math.round(n)));
}
pass("runtime:clamp", clampScore(150) === 100 && clampScore(-1) === 0);

const passed = results.filter((r) => r.pass).length;
const failed = results.filter((r) => !r.pass);
console.log(`\nIntegration Hub OS tests: ${passed}/${results.length} passed\n`);
for (const r of results) console.log(`${r.pass ? "✓" : "✗"} ${r.check}${r.detail ? ` — ${r.detail}` : ""}`);
if (failed.length > 0) process.exit(1);
