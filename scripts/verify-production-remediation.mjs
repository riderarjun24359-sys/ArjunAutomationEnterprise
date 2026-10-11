/**
 * Production Remediation verification.
 * Run: node scripts/verify-production-remediation.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { runTsc, runLint, spawnVerify } from "./_verify-spawn-helper.mjs";

const root = process.cwd();
const results = [];

function pass(check, ok, detail = "") {
    results.push({ check, pass: ok, detail });
}

function readSafe(path) {
    try { return readFileSync(path, "utf8"); } catch { return ""; }
}

const tsc = runTsc(root);
pass("regression:tsc", tsc.status === 0, tsc.status !== 0 ? (tsc.stderr || tsc.stdout || "").slice(0, 300) : "");

// Phase 1 — Security
const apiRoutes = [
    "app/api/business-assets/export/pdf/route.ts",
    "app/api/business-assets/export/docx/route.ts",
    "app/api/brand-os/documents/[slug]/route.ts",
    "app/api/launch-kit/contact/route.ts",
];
for (const route of apiRoutes) {
    const src = readSafe(join(root, route));
    pass(`security:api_${route.split("/").pop()?.replace(".ts", "")}_secured`, src.includes("secureApiRoute"));
}

pass("security:api_security_lib", existsSync(join(root, "src/lib/api-security.ts")));
pass("security:server_shell_auth", readSafe(join(root, "app/(shell)/layout.tsx")).includes("authServerService"));
pass("security:audit_rls_org_scoped", readSafe(join(root, "supabase/apply_all.sql")).includes("is_organization_member(organization_id)"));
pass("security:audit_rls_migration", existsSync(join(root, "supabase/migrations/20260805_audit_rls_remediation.sql")));
pass("security:org_isolation_db", readSafe(join(root, "src/modules/security-center/engine/org-isolation-engine.ts")).includes("listByOrganization"));

// Phase 2 — Mission Core
pass("mission-core:capability_executor", existsSync(join(root, "src/modules/mission-core/engine/capability-executor.ts")));
pass("mission-core:no_processed_true_stub", !readSafe(join(root, "src/modules/mission-core/engine/capability-registry.ts")).includes("processed: true"));
pass("mission-core:workflow_async", readSafe(join(root, "src/modules/mission-core/engine/workflow-engine.ts")).includes("advanceStepAsync"));
pass("mission-core:customer_journey", existsSync(join(root, "src/modules/mission-core/services/customer-journey.service.ts")));
pass("mission-core:orchestration_enforced", readSafe(join(root, "src/modules/mission-core/engine/capability-executor.ts")).includes("validateNoDirectCapabilityCall"));

const mcConstants = readSafe(join(root, "src/modules/mission-core/constants/index.ts"));
pass("mission-core:finance_active", mcConstants.includes('id: "finance"') && mcConstants.includes('status: "active"'));
pass("mission-core:project_step", mcConstants.includes("step-project"));
pass("mission-core:payment_step", mcConstants.includes("step-payment"));
pass("mission-core:projects_capability", mcConstants.includes('id: "projects"'));

// Phase 3 — Customer Journey
pass("journey:lead_not_console_only", !readSafe(join(root, "app/api/launch-kit/contact/route.ts")).includes("console.info"));
// The contact route persists via the server-side intake contract (the old
// customerJourneyService path is a server-side no-op: repository clients are
// browser-only, so it could never insert from a route handler). Assert the
// real contract instead: consent gate + dedup + sales_leads insert.
const contactRouteSrc = readSafe(join(root, "app/api/launch-kit/contact/route.ts"));
pass("journey:customer_journey_service", contactRouteSrc.includes("leadIntakeSchema") && contactRouteSrc.includes("findDuplicateLead") && contactRouteSrc.includes('from("sales_leads")') && contactRouteSrc.includes("getServiceRoleClient"));
pass("journey:project_create", readSafe(join(root, "src/modules/projects/services/project.service.ts")).includes("createProject"));

// Phase 4 — AI Consolidation
pass("ai:shared_service_real", readSafe(join(root, "src/modules/mission-core/engine/shared-service-registry.ts")).includes("aiOrchestrationService"));
pass("ai:sdk_mission_core", readSafe(join(root, "src/modules/ai-orchestration/sdk/index.ts")).includes("invokeSharedService"));
pass("ai:foundation_delegates_mc", readSafe(join(root, "src/modules/ai-foundation/engine/ai-workflow-engine.ts")).includes("executeMissionCoreWorkflow"));

// Phase 5 — Documentation
const docs = ["docs/DEVELOPER_GUIDE.md", "docs/ADMIN_GUIDE.md", "docs/API_DOCUMENTATION.md", "SECURITY.md", "docs/ARCHITECTURE.md", "docs/DEPLOYMENT_GUIDE.md", "docs/OPERATIONS_RUNBOOK.md", "docs/DISASTER_RECOVERY.md"];
for (const doc of docs) {
    pass(`docs:${doc.replace(/\//g, "_")}`, existsSync(join(root, doc)));
}

// Phase 6 — Brand
const home = readSafe(join(root, "src/modules/company-launch-kit/data/home-content.ts"));
pass("brand:no_ai_first_hero", !home.includes("AI-first enterprise operating system"));
pass("brand:enterprise_positioning", home.includes("Enterprise Platform") || home.includes("enterprise operating system"));

// Regression
const mcVerify = spawnVerify(root, "scripts/verify-mission-core.mjs");
pass("regression:mission_core", mcVerify.status === 0);

const passed = results.filter((r) => r.pass).length;
const failed = results.filter((r) => !r.pass);

console.log("\nProduction Remediation Verification\n");
for (const r of results) {
    console.log(`${r.pass ? "PASS" : "FAIL"} ${r.check}${r.detail ? ` — ${r.detail}` : ""}`);
}
console.log(`\n${passed}/${results.length} checks passed`);

if (failed.length > 0) process.exit(1);
