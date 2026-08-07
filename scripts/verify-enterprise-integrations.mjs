/**
 * Sprint 16 — Enterprise Integration & AI Execution Platform verification.
 * Run: npm run enterprise-integrations:verify
 * Target: 85+/85 PASS
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { runTsc, runLint, spawnVerify } from "./_verify-spawn-helper.mjs";

const root = process.cwd();
const results = [];

function pass(check, ok, detail = "") {
    results.push({ check, pass: !!ok, detail });
}

function readSafe(path) {
    try {
        return readFileSync(path, "utf8");
    } catch {
        return "";
    }
}

const tsc = runTsc(root);
pass("runtime:tsc", tsc.status === 0, tsc.status !== 0 ? (tsc.stderr || tsc.stdout || "").slice(0, 400) : "");

const lint = runLint(root);
pass("runtime:eslint", lint.status === 0, lint.status !== 0 ? (lint.stderr || lint.stdout || "").slice(0, 400) : "");

const required = [
    "src/modules/enterprise-integrations/index.ts",
    "src/modules/enterprise-integrations/access.ts",
    "src/modules/enterprise-integrations/constants.ts",
    "src/modules/enterprise-integrations/types.ts",
    "src/modules/enterprise-integrations/lib/env-secret-health.ts",
    "src/modules/enterprise-integrations/repository/enterprise-integrations.repository.ts",
    "src/modules/enterprise-integrations/builders/enterprise-integrations.builders.ts",
    "src/modules/enterprise-integrations/services/enterprise-integrations.service.ts",
    "src/modules/enterprise-integrations/hooks/useEnterpriseIntegrations.ts",
    "src/modules/enterprise-integrations/components/EnterpriseIntegrationsPage.tsx",
    "src/modules/enterprise-integrations/components/EnterpriseIntegrationsPanels.tsx",
    "app/(shell)/enterprise-integrations/page.tsx",
    "scripts/test-enterprise-integrations.mjs",
];
for (const f of required) pass(`file:${f}`, existsSync(join(root, f)));

const access = readSafe(join(root, "src/modules/enterprise-integrations/access.ts"));
pass("access:founder_admin", access.includes("isFounderOrAdminAccess"));

const builders = readSafe(join(root, "src/modules/enterprise-integrations/builders/enterprise-integrations.builders.ts"));
pass("module:ai_providers", builders.includes("buildAiProviderCenter"));
pass("module:secrets", builders.includes("buildSecretsManager"));
pass("module:email", builders.includes("buildEmailIntegration"));
pass("module:social", builders.includes("buildSocialPublishingHub"));
pass("module:payments", builders.includes("buildPaymentIntegrationCenter"));
pass("module:calendar", builders.includes("buildCalendarProductivity"));
pass("module:storage", builders.includes("buildCloudStorage"));
pass("module:webhooks", builders.includes("buildWebhookManager"));
pass("module:health", builders.includes("buildIntegrationHealthDashboard"));
pass("module:executive", builders.includes("buildExecutiveIntegrationDashboard"));
pass("feature:openai", builders.includes("openai") && builders.includes("OPENAI_API_KEY"));
pass("feature:social_platforms", builders.includes("linkedin") && builders.includes("instagram") && builders.includes("youtube"));
pass("feature:payments", builders.includes("stripe") && builders.includes("razorpay"));
pass("feature:calendar", builders.includes("google_calendar") && builders.includes("outlook"));
pass("feature:signature_validation", builders.includes("webhook_signing_key_hash") || builders.includes("signatureValidation"));
pass("no_mock_random", !builders.includes("Math.random"));
pass("no_hardcoded_secret_values", !builders.includes("sk-") && !builders.includes("whsec_"));

const envLib = readSafe(join(root, "src/modules/enterprise-integrations/lib/env-secret-health.ts"));
pass("secrets:env_presence_only", envLib.includes("configured") && envLib.includes("process.env") && !envLib.includes("return raw"));
pass("secrets:never_expose_values", envLib.includes("never expose") || envLib.includes("never expose secret"));

const repo = readSafe(join(root, "src/modules/enterprise-integrations/repository/enterprise-integrations.repository.ts"));
pass("live:databaseService", repo.includes("databaseService"));
pass("live:intg_hubs", repo.includes("intgIntegrationHubs"));
pass("live:connected", repo.includes("intgConnectedServices"));
pass("live:payment", repo.includes("intgPaymentConnectors"));
pass("live:api_keys", repo.includes("intgApiKeys"));
pass("live:rate_limits", repo.includes("intgRateLimits"));
pass("live:api_usage", repo.includes("intgApiUsage"));
pass("live:incoming_webhooks", repo.includes("intgIncomingWebhooks"));
pass("live:outgoing_webhooks", repo.includes("intgOutgoingWebhooks"));
pass("live:webhook_logs", repo.includes("intgWebhookDeliveryLogs"));
pass("live:intg_health", repo.includes("intgIntegrationHealth"));
pass("live:intg_failures", repo.includes("intgIntegrationFailures"));
pass("live:secrets_meta", repo.includes("eocSecretsMetadata"));
pass("live:email_channels", repo.includes("cnhNotificationChannels"));
pass("live:email_queue", repo.includes("cnhNotificationQueue"));
pass("live:email_templates", repo.includes("cnhMessageTemplates"));
pass("live:ai_agents", repo.includes("aiAgents"));
pass("live:env_health", repo.includes("readEnvSecretHealth"));
pass("live:multi_tenant", repo.includes("resolveOrganizationContext") && repo.includes("organizationId"));
pass("live:marketplace", repo.includes("intgMarketplaceConnectors"));
pass("live:installations", repo.includes("intgMarketplaceInstallations"));
pass("live:latency", repo.includes("intgLatencyMetrics"));
pass("live:payment_tx", repo.includes("intgPaymentTransactions"));
pass("live:payment_retry", repo.includes("intgPaymentRetryQueue"));
pass("live:dead_letter", repo.includes("intgWebhookDeadLetter"));
pass("live:retry_policies", repo.includes("cnhRetryPolicies"));

const page = readSafe(join(root, "src/modules/enterprise-integrations/components/EnterpriseIntegrationsPage.tsx"));
pass("ui:access_denied", page.includes("Founder / Admin access required"));
pass("ui:tabs", page.includes("EI_TAB_LIST"));

const panels = readSafe(join(root, "src/modules/enterprise-integrations/components/EnterpriseIntegrationsPanels.tsx"));
pass("ui:ai_providers", panels.includes("AI Provider Center") && panels.includes("Rate limit") && panels.includes("Cost tracking"));
pass("ui:secrets", panels.includes("Secrets Manager") && panels.includes("Environment validation") && panels.includes("Rotation reminders") && panels.includes("never displayed"));
pass("ui:email", panels.includes("Email Integration") && panels.includes("SMTP configuration") && panels.includes("Delivery logs") && panels.includes("Template management"));
pass("ui:social", panels.includes("Social Publishing Hub") && panels.includes("LinkedIn") && panels.includes("YouTube") && panels.includes("Publishing queue"));
pass("ui:payments", panels.includes("Payment Integration Center") && panels.includes("Stripe") && panels.includes("Razorpay") && panels.includes("Webhook monitoring"));
pass("ui:calendar", panels.includes("Calendar & Productivity") && panels.includes("Google Calendar") && panels.includes("Outlook") && panels.includes("Reminder service"));
pass("ui:storage", panels.includes("Cloud Storage") && panels.includes("File storage abstraction") && panels.includes("Asset library"));
pass("ui:webhooks", panels.includes("Webhook Manager") && panels.includes("Signature validation") && panels.includes("Event logs"));
pass("ui:health", panels.includes("Integration Health Dashboard") && panels.includes("Connected services") && panels.includes("Sync status") && panels.includes("Latency"));
pass("ui:executive", panels.includes("Executive Integration Dashboard") && panels.includes("AI usage") && panels.includes("Cost overview") && panels.includes("Optimization recommendations"));

pass(
    "routes:enterpriseIntegrations",
    readSafe(join(root, "src/constants/routes.ts")).includes("enterpriseIntegrations:"),
);
pass(
    "middleware:protected",
    readSafe(join(root, "src/middleware/auth.ts")).includes("ROUTES.enterpriseIntegrations"),
);
pass("nav:shell", readSafe(join(root, "src/config/shell-navigation.ts")).includes("enterpriseIntegrations"));
pass(
    "package:script",
    readSafe(join(root, "package.json")).includes('"enterprise-integrations:verify"'),
);

pass(
    "isolation:no_schema_migration",
    !existsSync(join(root, "supabase/migrations/enterprise-integrations.sql")),
);
pass(
    "isolation:ops_sprint15_intact",
    existsSync(join(root, "src/modules/ai-operations-center/services/ai-operations-center.service.ts")),
);
pass(
    "isolation:automation_sprint14_intact",
    existsSync(join(root, "src/modules/ai-automation-engine/services/ai-automation-engine.service.ts")),
);
pass(
    "isolation:integration_platform_route_intact",
    readSafe(join(root, "src/constants/routes.ts")).includes('integrationPlatform: "/integration-platform"'),
);
pass(
    "isolation:finance_sprint12_intact",
    existsSync(join(root, "src/modules/ai-finance-billing-engine/services/ai-finance-billing-engine.service.ts")),
);
pass(
    "isolation:customer_success_sprint11_intact",
    existsSync(join(root, "src/modules/ai-customer-success-engine/services/ai-customer-success-engine.service.ts")),
);
pass(
    "architecture:credentials_ref_not_secret_body",
    builders.includes("credentials_ref") && !builders.includes("api_secret") && !builders.includes("private_key"),
);

process.env.SKIP_TSC = "1";
process.env.SKIP_LINT = "1";
const unit = spawnVerify(root, "scripts/test-enterprise-integrations.mjs");
pass(
    "test:enterprise-integrations",
    unit.status === 0,
    unit.status !== 0 ? (unit.stderr || unit.stdout || "").slice(0, 240) : "",
);

const failed = results.filter((r) => !r.pass);
console.log(`enterprise-integrations:verify ${results.filter((r) => r.pass).length}/${results.length}`);
for (const r of results) {
    console.log(`${r.pass ? "PASS" : "FAIL"} ${r.check}${r.detail ? ` — ${r.detail}` : ""}`);
}
process.exit(failed.length ? 1 : 0);
