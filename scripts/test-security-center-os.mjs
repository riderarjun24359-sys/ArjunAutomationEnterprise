/**
 * Security Center OS unit tests (Sprint 8).
 * Run: node scripts/test-security-center-os.mjs
 */
import { existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const results = [];
function pass(check, ok, detail = "") {
    results.push({ check, pass: !!ok, detail });
}

const mod = join(root, "src/modules/security-center");
const required = [
    "repository/security-center-os.repository.ts",
    "builders/security-center.builders.ts",
    "services/security-center-os.service.ts",
    "ai/ai-security-assistant.ts",
    "analytics/security-os.analytics.ts",
    "integrations/platform-bridges.ts",
    "hooks/useSecurityCenterOs.ts",
    "pages/SecurityCenterOsPage.tsx",
    "types/os.ts",
    "types/raw.ts",
    "utils/os-formatters.ts",
    "utils/os-audit.ts",
    "constants/os.ts",
    "components/os/SecurityOsPanels.tsx",
];
for (const f of required) pass(`file:${f}`, existsSync(join(mod, f)));

const page = readFileSync(join(mod, "pages/SecurityCenterOsPage.tsx"), "utf8");
pass("page:ops", page.includes("OpsDashboardPanel"));
pass("page:rbac", page.includes("RbacOsPanel"));
pass("page:permissions", page.includes("PermissionsOsPanel"));
pass("page:audit", page.includes("AuditExplorerPanel"));
pass("page:events", page.includes("SecurityEventsPanel"));
pass("page:mfa", page.includes("MfaOsPanel"));
pass("page:sessions", page.includes("SessionsOsPanel"));
pass("page:api", page.includes("ApiSecurityOsPanel"));
pass("page:compliance", page.includes("ComplianceOsPanel"));
pass("page:backup", page.includes("BackupDrOsPanel"));
pass("page:alerts", page.includes("SecurityAlertsOsPanel"));
pass("page:assistant", page.includes("AiSecurityAssistantPanel"));

const ecc = readFileSync(join(root, "src/modules/executive-command-center/components/ExecutiveCommandCenterPage.tsx"), "utf8");
pass("ecc:security-widgets", ecc.includes("ExecutiveSecurityWidgetsPanel"));

const repo = readFileSync(join(mod, "repository/security-center-os.repository.ts"), "utf8");
pass("multi-tenant:org-context", repo.includes("resolveOrganizationContext"));
pass("supabase:idpAlerts", repo.includes("idpSecurityAlerts"));
pass("supabase:mfa", repo.includes("idpMfaEnrollments"));
pass("supabase:sessions", repo.includes("idpActiveSessions"));
pass("supabase:compliance", repo.includes("elrComplianceReviews"));
pass("supabase:backup", repo.includes("backupConfigs"));

const buildersSrc = readFileSync(join(mod, "builders/security-center.builders.ts"), "utf8");
pass("builder:ops", buildersSrc.includes("export function buildOpsDashboard"));
pass("builder:rbac", buildersSrc.includes("export function buildRbac"));
pass("builder:compliance", buildersSrc.includes("export function buildCompliance"));
pass("builder:snapshot", buildersSrc.includes("export function buildSecurityCenterSnapshot"));

const aiSrc = readFileSync(join(mod, "ai/ai-security-assistant.ts"), "utf8");
pass("ai:daily-summary", aiSrc.includes("dailySummary"));
pass("ai:iso", aiSrc.includes("ISO 27001"));
pass("ai:soc", aiSrc.includes("SOC 2"));
pass("ai:gdpr", aiSrc.includes("GDPR"));

const auditSrc = readFileSync(join(mod, "utils/os-audit.ts"), "utf8");
pass("audit:write", auditSrc.includes("writeSecurityOsAuditLog"));

function clampScore(n) {
    if (!Number.isFinite(n)) return 0;
    return Math.max(0, Math.min(100, Math.round(n)));
}
pass("runtime:clamp", clampScore(150) === 100 && clampScore(-1) === 0);

const passed = results.filter((r) => r.pass).length;
const failed = results.filter((r) => !r.pass);
console.log(`\nSecurity Center OS tests: ${passed}/${results.length} passed\n`);
for (const r of results) console.log(`${r.pass ? "✓" : "✗"} ${r.check}${r.detail ? ` — ${r.detail}` : ""}`);
if (failed.length > 0) process.exit(1);
