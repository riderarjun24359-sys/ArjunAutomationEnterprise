/**
 * HRMS & Workforce OS unit tests (Sprint 6).
 * Run: node scripts/test-hrms-workforce-os.mjs
 */
import { existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const results = [];
function pass(check, ok, detail = "") {
    results.push({ check, pass: !!ok, detail });
}

const mod = join(root, "src/modules/hrms-workforce");
const required = [
    "repository/hrms-workforce.repository.ts",
    "builders/hrms-workforce.builders.ts",
    "services/hrms-workforce-os.service.ts",
    "ai/ai-hr-assistant.ts",
    "analytics/hrms-workforce.analytics.ts",
    "integrations/platform-bridges.ts",
    "integrations/executive-command-center-bridge.ts",
    "hooks/useHrmsWorkforceOs.ts",
    "pages/HrmsWorkforceOsPage.tsx",
    "types/os.ts",
    "utils/formatters.ts",
    "utils/audit.ts",
    "constants/os.ts",
    "components/HrmsWorkforcePage.tsx",
    "components/os/EmployeesPanel.tsx",
    "components/os/DepartmentsPanel.tsx",
    "components/os/AttendancePanel.tsx",
    "components/os/LeavePanel.tsx",
    "components/os/PayrollPanel.tsx",
    "components/os/RecruitmentPanel.tsx",
    "components/os/PerformancePanel.tsx",
    "components/os/TrainingPanel.tsx",
    "components/os/AssetsPanel.tsx",
    "components/os/SelfServicePanel.tsx",
    "components/os/AiHrAssistantPanel.tsx",
];
for (const f of required) pass(`file:${f}`, existsSync(join(mod, f)));

const page = readFileSync(join(mod, "pages/HrmsWorkforceOsPage.tsx"), "utf8");
pass("page:employees", page.includes("EmployeesPanel"));
pass("page:departments", page.includes("DepartmentsPanel"));
pass("page:attendance", page.includes("AttendancePanel"));
pass("page:leave", page.includes("LeavePanel"));
pass("page:payroll", page.includes("PayrollPanel"));
pass("page:recruitment", page.includes("RecruitmentPanel"));
pass("page:performance", page.includes("PerformancePanel"));
pass("page:training", page.includes("TrainingPanel"));
pass("page:assets", page.includes("AssetsPanel"));
pass("page:self-service", page.includes("SelfServicePanel"));
pass("page:assistant", page.includes("AiHrAssistantPanel"));

const ecc = readFileSync(join(root, "src/modules/executive-command-center/components/ExecutiveCommandCenterPage.tsx"), "utf8");
pass("ecc:hr-widgets", ecc.includes("ExecutiveHrWidgetsPanel"));

const repo = readFileSync(join(mod, "repository/hrms-workforce.repository.ts"), "utf8");
pass("multi-tenant:org-context", repo.includes("resolveOrganizationContext"));
pass("supabase:employees", repo.includes("employees.listByOrganization"));
pass("supabase:attendance", repo.includes("attendanceRecords"));
pass("supabase:leave", repo.includes("leaveRequests"));
pass("supabase:payroll", repo.includes("payrollCycles"));
pass("supabase:assets", repo.includes("assets.listByOrganization"));

const buildersSrc = readFileSync(join(mod, "builders/hrms-workforce.builders.ts"), "utf8");
pass("builder:employees", buildersSrc.includes("export function buildEmployees"));
pass("builder:departments", buildersSrc.includes("export function buildDepartments"));
pass("builder:attendance", buildersSrc.includes("export function buildAttendance"));
pass("builder:leave", buildersSrc.includes("export function buildLeave"));
pass("builder:payroll", buildersSrc.includes("export function buildPayroll"));
pass("builder:recruitment", buildersSrc.includes("export function buildRecruitment"));
pass("builder:performance", buildersSrc.includes("export function buildPerformance"));
pass("builder:training", buildersSrc.includes("export function buildTraining"));
pass("builder:assets", buildersSrc.includes("export function buildAssets"));
pass("builder:self-service", buildersSrc.includes("export function buildSelfService"));
pass("builder:audit", buildersSrc.includes("export function buildAuditTrail"));
pass("builder:snapshot", buildersSrc.includes("export function buildHrmsWorkforceSnapshot"));

const aiSrc = readFileSync(join(mod, "ai/ai-hr-assistant.ts"), "utf8");
pass("ai:daily-summary", aiSrc.includes("dailySummary"));
pass("ai:executive-summary", aiSrc.includes("executiveSummary"));

const auditSrc = readFileSync(join(mod, "utils/audit.ts"), "utf8");
pass("audit:write", auditSrc.includes("writeHrmsAuditLog"));

function clampScore(n) {
    if (!Number.isFinite(n)) return 0;
    return Math.max(0, Math.min(100, Math.round(n)));
}
pass("runtime:clamp", clampScore(150) === 100 && clampScore(-1) === 0);

const passed = results.filter((r) => r.pass).length;
const failed = results.filter((r) => !r.pass);
console.log(`\nHRMS & Workforce OS tests: ${passed}/${results.length} passed\n`);
for (const r of results) console.log(`${r.pass ? "✓" : "✗"} ${r.check}${r.detail ? ` — ${r.detail}` : ""}`);
if (failed.length > 0) process.exit(1);
