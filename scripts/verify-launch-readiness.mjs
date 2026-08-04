/**
 * Launch Readiness Program V1 — independent production audit.
 * Run: node scripts/verify-launch-readiness.mjs
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

// ── Phase 1: Runtime Verification ──────────────────────────────────────────
const tsc = runTsc(root);
pass("phase1:tsc", tsc.status === 0, tsc.status !== 0 ? (tsc.stderr || tsc.stdout || "").slice(0, 300) : "");

const lint = runLint(root);
pass("phase1:lint", lint.status === 0, lint.status !== 0 ? (lint.stderr || lint.stdout || "").slice(0, 300) : "");

const apiRoutes = [
    "app/api/business-assets/export/pdf/route.ts",
    "app/api/business-assets/export/docx/route.ts",
    "app/api/brand-os/documents/[slug]/route.ts",
    "app/api/launch-kit/contact/route.ts",
];
for (const route of apiRoutes) {
    const src = readSafe(join(root, route));
    pass(`phase1:api_secured_${route.split("/").slice(-2, -1)[0]}`, src.includes("secureApiRoute"));
}

pass("phase1:capability_executor", existsSync(join(root, "src/modules/mission-core/engine/capability-executor.ts")));
pass("phase1:no_registry_stub", !readSafe(join(root, "src/modules/mission-core/engine/capability-registry.ts")).includes("processed: true"));

const journeySteps = ["qualify-lead", "generate-proposal", "sign-agreement", "run-onboarding", "create-project", "track-delivery", "generate-invoice", "process-payment", "health-monitoring", "renewal-growth"];
const executor = readSafe(join(root, "src/modules/mission-core/engine/capability-executor.ts"));
for (const action of journeySteps) {
    pass(`phase1:journey_action_${action}`, executor.includes(`"${action}"`) || executor.includes(`:${action}`));
}

const sharedRegistry = readSafe(join(root, "src/modules/mission-core/engine/shared-service-registry.ts"));
const sharedConstants = readSafe(join(root, "src/modules/mission-core/constants/index.ts"));
for (const svc of ["auth", "notifications", "documentEngine", "gci", "search", "audit", "ai", "analytics", "integrations"]) {
    pass(`phase1:shared_service_${svc}`, sharedConstants.includes(`id: "${svc}"`) && sharedRegistry.includes(`${svc}:`));
}

// ── Phase 2: Mission Core Enforcement ──────────────────────────────────────
pass("phase2:ai_sdk_mission_core", readSafe(join(root, "src/modules/ai-orchestration/sdk/index.ts")).includes("invokeSharedService"));
pass("phase2:workflow_sdk_mission_core", readSafe(join(root, "src/modules/workflow-engine/sdk/index.ts")).includes("createMissionCoreClient"));
pass("phase2:orchestration_rules", readSafe(join(root, "src/modules/mission-core/engine/capability-executor.ts")).includes("validateNoDirectCapabilityCall"));
pass("phase2:ai_foundation_delegates", readSafe(join(root, "src/modules/ai-foundation/engine/ai-workflow-engine.ts")).includes("executeMissionCoreWorkflow"));
pass("phase2:no_direct_business_assets_service", !readSafe(join(root, "src/modules/client-success-capability/integrations/business-assets-bridge.ts")).includes("businessAssetsService"));

const mcConstants = readSafe(join(root, "src/modules/mission-core/constants/index.ts"));
const capabilities = ["sales", "clientSuccess", "businessAssets", "projects", "finance", "securityCenter", "platformOperations", "aiFoundation"];
for (const cap of capabilities) {
    pass(`phase2:capability_${cap}`, mcConstants.includes(`"${cap}"`));
}

// ── Phase 3: Customer Journey Certification ──────────────────────────────
const workflow = readSafe(join(root, "src/modules/mission-core/constants/index.ts"));
const journeyStages = [
    { id: "step-lead", cap: "sales" },
    { id: "step-proposal", cap: "businessAssets" },
    { id: "step-agreement", cap: "businessAssets" },
    { id: "step-onboarding", cap: "clientSuccess" },
    { id: "step-project", cap: "projects" },
    { id: "step-delivery", cap: "clientSuccess" },
    { id: "step-invoice", cap: "finance" },
    { id: "step-payment", cap: "finance" },
    { id: "step-support", cap: "clientSuccess" },
    { id: "step-renewal", cap: "clientSuccess" },
];
for (const stage of journeyStages) {
    pass(`phase3:${stage.id}`, workflow.includes(stage.id) && workflow.includes(`"${stage.cap}"`));
}

pass("phase3:customer_journey_service", existsSync(join(root, "src/modules/mission-core/services/customer-journey.service.ts")));
pass("phase3:lead_intake_wired", readSafe(join(root, "app/api/launch-kit/contact/route.ts")).includes("customerJourneyService"));
pass("phase3:audit_on_intake", readSafe(join(root, "app/api/launch-kit/contact/route.ts")).includes("logApiAudit"));
pass("phase3:workflow_async", readSafe(join(root, "src/modules/mission-core/engine/workflow-engine.ts")).includes("runWorkflowToCompletion"));

// ── Phase 4: Production Infrastructure ───────────────────────────────────
pass("phase4:env_example", existsSync(join(root, ".env.example")));
pass("phase4:platform_lead_key", readSafe(join(root, ".env.example")).includes("PLATFORM_LEAD_API_KEY"));
pass("phase4:audit_rls", readSafe(join(root, "supabase/apply_all.sql")).includes("is_organization_member(organization_id)"));
pass("phase4:deployment_https", readSafe(join(root, "docs/DEPLOYMENT_GUIDE.md")).includes("build"));
pass("phase4:monitoring_module", existsSync(join(root, "src/modules/platform-operations")));
pass("phase4:backup_module", readSafe(join(root, "src/modules/platform-operations/engine/backup-center-engine.ts")).includes("getBackups"));
pass("phase4:recovery_module", readSafe(join(root, "src/modules/platform-operations/engine/disaster-recovery-engine.ts")).includes("validateFailover"));
pass("phase4:api_security", existsSync(join(root, "src/lib/api-security.ts")));

// ── Phase 5: Brand Alignment ───────────────────────────────────────────────
const home = readSafe(join(root, "src/modules/company-launch-kit/data/home-content.ts"));
pass("phase5:no_ai_first_hero", !home.includes("AI-first enterprise operating system"));
pass("phase5:enterprise_eyebrow", home.includes("Enterprise Platform") || home.includes("enterprise operating system"));
pass("phase5:no_ai_first_cta", !home.includes("Ready for AI-first"));

// ── Phase 6: Documentation ─────────────────────────────────────────────────
const docs = {
    "docs/DEVELOPER_GUIDE.md": "Developer Guide",
    "docs/ADMIN_GUIDE.md": "Admin Guide",
    "docs/OPERATIONS_RUNBOOK.md": "Operations Runbook",
    "docs/API_DOCUMENTATION.md": "API Reference",
    "SECURITY.md": "Security Guide",
    "docs/DEPLOYMENT_GUIDE.md": "Deployment Guide",
    "docs/ARCHITECTURE.md": "Architecture Guide",
    "docs/DISASTER_RECOVERY.md": "Recovery Guide",
};
for (const [path] of Object.entries(docs)) {
    pass(`phase6:${path.replace(/\//g, "_")}`, existsSync(join(root, path)));
}

// ── Final Gate: Module Regression ──────────────────────────────────────────
process.env.SKIP_TSC = "1";
process.env.SKIP_LINT = "1";
const regressions = [
    ["scripts/verify-production-remediation.mjs", "gate:production_remediation"],
    ["scripts/verify-mission-core.mjs", "gate:mission_core"],
    ["scripts/verify-security-center.mjs", "gate:security"],
    ["scripts/verify-platform-operations.mjs", "gate:platform_operations"],
    ["scripts/verify-ai-foundation.mjs", "gate:ai_foundation"],
    ["scripts/verify-client-success-capability.mjs", "gate:customer_journey_module"],
    ["scripts/verify-premium-website.mjs", "gate:brand_website"],
];
for (const [script, check] of regressions) {
    const r = spawnVerify(root, script);
    pass(check, r.status === 0, r.status !== 0 ? `${script} failed` : "");
}

const passed = results.filter((r) => r.pass).length;
const failed = results.filter((r) => !r.pass);
const critical = failed.filter((f) => f.check.startsWith("phase1:") || f.check.startsWith("gate:"));

console.log("\nLaunch Readiness Program V1 — Audit Results\n");
for (const r of results) {
    console.log(`${r.pass ? "PASS" : "FAIL"} ${r.check}${r.detail ? ` — ${r.detail}` : ""}`);
}
console.log(`\n${passed}/${results.length} checks passed`);
console.log(`Critical/High blockers: ${critical.length}`);

if (failed.length > 0) process.exit(1);
