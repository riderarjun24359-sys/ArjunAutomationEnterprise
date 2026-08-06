/**
 * Security Center verification: tsc, lint, route, nav, middleware,
 * 9 panels, 8 engines, 4 bridges, constants, service methods,
 * mission-core integration, Design OS, SDK, rbac, secrets, regression.
 * Run: node scripts/verify-security-center.mjs
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { runTsc, runLint, spawnVerify } from "./_verify-spawn-helper.mjs";

const root = process.cwd();
const modRoot = join(root, "src", "modules", "security-center");
const mcRoot = join(root, "src", "modules", "mission-core");
const results = [];

function pass(check, ok, detail = "") {
    results.push({ check, pass: ok, detail });
}

function readSafe(path) {
    try { return readFileSync(path, "utf8"); } catch { return ""; }
}

function readModuleSources(dir) {
    let combined = "";
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = join(dir, entry.name);
        if (entry.isDirectory()) combined += readModuleSources(full);
        else if (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx")) combined += readSafe(full);
    }
    return combined;
}

const tsc = runTsc(root);
pass("regression:tsc", tsc.status === 0, tsc.status !== 0 ? (tsc.stderr || tsc.stdout || "").slice(0, 300) : "");

const lint = runLint(root);
pass("regression:lint", lint.status === 0, lint.status !== 0 ? (lint.stderr || lint.stdout || "").slice(0, 300) : "");

const routePath = join(root, "app", "(shell)", "security-center", "page.tsx");
const routeSource = readSafe(routePath);
pass("route:page_exists", existsSync(routePath));
pass("route:exports_SecurityCenterPage", routeSource.includes("SecurityCenterPage"));

const routesSource = readSafe(join(root, "src", "constants", "routes.ts"));
pass("route:routes_ts_securityCenter", routesSource.includes('securityCenter: "/security-center"'));

const navSource = readSafe(join(root, "src", "config", "shell-navigation.ts"));
pass("nav:Security_Center_label", navSource.includes("Security Center"));
pass("nav:ShieldCheck_icon", navSource.includes("ShieldCheck"));
pass("nav:securityCenter_route", navSource.includes("ROUTES.securityCenter"));
pass("nav:primary_section", /Security Center[\s\S]*section:\s*"primary"/.test(navSource));

const middlewareSource = readSafe(join(root, "src", "middleware", "auth.ts"));
pass("middleware:securityCenter_protected", middlewareSource.includes("ROUTES.securityCenter"));

const osPanels = [
    "OpsDashboardPanel",
    "RbacOsPanel",
    "PermissionsOsPanel",
    "AuditExplorerPanel",
    "SecurityEventsPanel",
    "MfaOsPanel",
    "SessionsOsPanel",
    "ApiSecurityOsPanel",
    "ComplianceOsPanel",
    "BackupDrOsPanel",
    "SecurityAlertsOsPanel",
    "AiSecurityAssistantPanel",
];
const osPanelSource = readSafe(join(modRoot, "components", "os", "SecurityOsPanels.tsx"));
for (const panel of osPanels) {
    pass(`panel:${panel}`, osPanelSource.includes(`function ${panel}`) || osPanelSource.includes(`export function ${panel}`));
}

const engines = [
    "authentication-engine",
    "mfa-engine",
    "rbac-engine",
    "org-isolation-engine",
    "api-security-engine",
    "secrets-engine",
    "audit-engine",
    "threat-detection-engine",
];

for (const engine of engines) {
    pass(`engine:${engine}`, existsSync(join(modRoot, "engine", `${engine}.ts`)));
}

const bridges = [
    "mission-core-bridge",
    "enterprise-identity-bridge",
    "auth-bridge",
    "audit-bridge",
];

for (const bridge of bridges) {
    pass(`bridge:${bridge}`, existsSync(join(modRoot, "integrations", `${bridge}.ts`)));
}

const constantsSource = readSafe(join(modRoot, "constants", "index.ts"));
const securityRoles = ["founder", "admin", "sales", "delivery", "support", "finance", "customer", "custom"];
for (const role of securityRoles) {
    pass(`constant:SECURITY_ROLE:${role}`, constantsSource.includes(`"${role}"`));
}

const authMethods = ["email_password", "magic_link", "google_oauth", "microsoft_oauth", "github_oauth"];
for (const method of authMethods) {
    pass(`constant:AUTH_METHOD:${method}`, constantsSource.includes(`"${method}"`));
}

const mfaMethods = ["authenticator", "recovery_codes", "backup_methods", "trusted_devices"];
for (const method of mfaMethods) {
    pass(`constant:MFA_METHOD:${method}`, constantsSource.includes(`"${method}"`));
}

const orgResources = ["projects", "documents", "invoices", "crm", "business_assets", "messages", "audit_logs"];
for (const resource of orgResources) {
    pass(`constant:ORG_ISOLATION:${resource}`, constantsSource.includes(`"${resource}"`));
}

const serviceSource = readSafe(join(modRoot, "services", "security-center.service.ts"));
const serviceMethods = [
    "getAuthenticationStatus",
    "configureAuthMethod",
    "getMfaStatus",
    "enrollMfa",
    "getRoles",
    "assignRole",
    "checkPermission",
    "verifyOrganizationIsolation",
    "createApiKey",
    "validateToken",
    "checkRateLimit",
    "listSecrets",
    "validateEnvironment",
    "logAuditEvent",
    "getAuditCenter",
    "runThreatDetection",
    "getThreatAlerts",
    "getSecurityDashboard",
    "enforceViaMissionCore",
];
for (const method of serviceMethods) {
    pass(`service:${method}`, serviceSource.includes(method));
}

const mcConstants = readSafe(join(mcRoot, "constants", "index.ts"));
pass("mission-core:securityCenter_capability", mcConstants.includes('id: "securityCenter"'));

const mcService = readSafe(join(mcRoot, "services", "mission-core.service.ts"));
pass("mission-core:enforceSecurityPolicy", mcService.includes("enforceSecurityPolicy"));

const mcSdk = readSafe(join(mcRoot, "sdk", "index.ts"));
pass("mission-core:sdk_enforceSecurityPolicy", mcSdk.includes("enforceSecurityPolicy"));

const sharedRegistry = readSafe(join(mcRoot, "engine", "shared-service-registry.ts"));
pass("mission-core:auth_delegates_security_center", sharedRegistry.includes("createSecurityCenterClient"));

const pageSource = readSafe(join(modRoot, "components", "SecurityCenterPage.tsx"));
pass("ui:page_renders_os", pageSource.includes("SecurityCenterOsPage"));

const osPageSource = readSafe(join(modRoot, "pages", "SecurityCenterOsPage.tsx"));
pass("ui:design_os_Card", osPageSource.includes("@/src/design-os/components/Card"));
pass("ui:PageTransition", osPageSource.includes("PageTransition"));
pass("os:ops_dashboard", osPageSource.includes("OpsDashboardPanel"));
pass("os:compliance", osPageSource.includes("ComplianceOsPanel"));
pass("os:assistant", osPageSource.includes("AiSecurityAssistantPanel"));

const osFiles = [
    "repository/security-center-os.repository.ts",
    "builders/security-center.builders.ts",
    "services/security-center-os.service.ts",
    "ai/ai-security-assistant.ts",
    "analytics/security-os.analytics.ts",
    "hooks/useSecurityCenterOs.ts",
    "pages/SecurityCenterOsPage.tsx",
    "types/os.ts",
    "types/raw.ts",
    "utils/os-audit.ts",
    "components/os/SecurityOsPanels.tsx",
];
for (const f of osFiles) pass(`os:file:${f}`, existsSync(join(modRoot, f)));

pass("os:multi_tenant", readSafe(join(modRoot, "repository/security-center-os.repository.ts")).includes("resolveOrganizationContext"));
pass("os:supabase", readSafe(join(modRoot, "repository/security-center-os.repository.ts")).includes("idpSecurityAlerts"));
pass("os:audit_helper", existsSync(join(modRoot, "utils/os-audit.ts")));
pass("ecc:security_widgets", existsSync(join(root, "src/modules/executive-command-center/components/ExecutiveSecurityWidgetsPanel.tsx")));
pass(
    "ecc:wired",
    readSafe(join(root, "src/modules/executive-command-center/components/ExecutiveCommandCenterPage.tsx")).includes(
        "ExecutiveSecurityWidgetsPanel",
    ),
);

const sdkSource = readSafe(join(modRoot, "sdk", "index.ts"));
pass("sdk:createSecurityCenterClient", sdkSource.includes("createSecurityCenterClient"));

const rbacEngine = readSafe(join(modRoot, "engine", "rbac-engine.ts"));
pass("rbac:hasPermission", rbacEngine.includes("hasPermission"));

const moduleSources = readModuleSources(modRoot);
const hardcodedPatterns = [/sk_live_[a-zA-Z0-9]+/, /AKIA[0-9A-Z]{16}/, /ghp_[a-zA-Z0-9]{36}/];
const hardcodedFound = hardcodedPatterns.some((p) => p.test(moduleSources));
pass("secrets:no_hardcoded_api_keys", !hardcodedFound);

pass("package:security_center_verify", readSafe(join(root, "package.json")).includes('"security-center:verify"'));

const unitOs = spawnVerify(root, "scripts/test-security-center-os.mjs");
pass("test:security-center-os", unitOs.status === 0, unitOs.status !== 0 ? (unitOs.stderr || unitOs.stdout || "").slice(0, 300) : "");

const live = spawnVerify(root, "scripts/test-executive-live-stats.mjs");
pass("regression:sprint1-live-stats", live.status === 0);

const widgets = spawnVerify(root, "scripts/test-executive-widgets.mjs");
pass("regression:sprint1-widgets", widgets.status === 0);

const crm = spawnVerify(root, "scripts/test-crm-enterprise.mjs");
pass("regression:sprint2-crm", crm.status === 0);

const cs = spawnVerify(root, "scripts/test-customer-success-os.mjs");
pass("regression:sprint4-customer-success", cs.status === 0);

const bf = spawnVerify(root, "scripts/test-billing-finance-os.mjs");
pass("regression:sprint5-billing-finance", bf.status === 0);

const hrms = spawnVerify(root, "scripts/test-hrms-workforce-os.mjs");
pass("regression:sprint6-hrms", hrms.status === 0);

const intg = spawnVerify(root, "scripts/test-integration-hub-os.mjs");
pass("regression:sprint7-integrations", intg.status === 0);

const mcVerify = spawnVerify(root, "scripts/verify-mission-core.mjs");
pass("regression:mission_core_verify", mcVerify.status === 0, mcVerify.status !== 0 ? "mission-core verify failed" : "");

const passed = results.filter((r) => r.pass).length;
const failed = results.filter((r) => !r.pass);

console.log("\nSecurity Center Verification Results\n");
for (const r of results) {
    console.log(`${r.pass ? "PASS" : "FAIL"} ${r.check}${r.detail ? ` — ${r.detail}` : ""}`);
}
console.log(`\n${passed}/${results.length} checks passed`);

if (failed.length > 0) {
    process.exit(1);
}
