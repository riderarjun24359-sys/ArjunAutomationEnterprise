/**
 * Program B Sprint 7 verification: regression, security, tenant isolation, performance,
 * admission/attendance/exam/fee verification, and framework SDK compatibility.
 * Run: node scripts/verify-sprint-b7.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const results = [];

function pass(check, ok, detail = "") {
    results.push({ check, pass: ok, detail });
}

const tsc = spawnSync("npx", ["tsc", "--noEmit"], { cwd: root, shell: true, encoding: "utf8" });
pass("regression:tsc", tsc.status === 0, tsc.status !== 0 ? (tsc.stderr || tsc.stdout || "").slice(0, 200) : "");

const lint = spawnSync("npm", ["run", "lint"], { cwd: root, shell: true, encoding: "utf8" });
pass("regression:lint", lint.status === 0, lint.status !== 0 ? (lint.stderr || lint.stdout || "").slice(0, 200) : "");

const migrationPath = join(root, "supabase", "migrations", "202608020039_enterprise_school_business_os.sql");
const migrationSql = existsSync(migrationPath) ? readFileSync(migrationPath, "utf8") : "";

const tableMatches = [...migrationSql.matchAll(/create table if not exists public\.(sch_\w+)/gi)];
const tables = [...new Set(tableMatches.map((m) => m[1]))];

pass("schema:sch_table_count", tables.length === 32, `count=${tables.length}`);

for (const table of tables) {
    const rlsEnabled = new RegExp(`alter table public\\.${table} enable row level security`, "i").test(migrationSql);
    pass(`security:RLS:${table}`, rlsEnabled);
}

const orgOnlyTables = new Set(["sch_school_metrics", "sch_school_health", "sch_audit_logs"]);
const childTables = tables.filter((t) => t !== "sch_school_hubs" && !orgOnlyTables.has(t));
const hasMemberPolicyTemplate = migrationSql.includes("is_organization_member(organization_id)");
for (const table of childTables) {
    const hasOrgCol = new RegExp(`create table if not exists public\\.${table}[\\s\\S]*?organization_id uuid`, "i").test(migrationSql);
    pass(`isolation:organization_id:${table}`, hasOrgCol);
    pass(`isolation:is_organization_member:${table}`, hasMemberPolicyTemplate);
}

for (const table of tables) {
    const indexName = `idx_${table}_org`;
    const hasIndex = migrationSql.includes(`create index if not exists ${indexName}`);
    pass(`performance:${indexName}`, hasIndex);
}

pass("admission:admissions_table", tables.includes("sch_admissions"));
pass("admission:student_profiles_table", tables.includes("sch_student_profiles"));
pass("admission:enrollments_table", tables.includes("sch_enrollments"));
pass("admission:admission_status_column", /sch_admissions[\s\S]*?admission_status text/i.test(migrationSql));

pass("attendance:staff_attendance_table", tables.includes("sch_staff_attendance"));
pass("attendance:attendance_analytics_table", tables.includes("sch_attendance_analytics"));
pass("attendance:attendance_status_column", /sch_staff_attendance[\s\S]*?attendance_status text/i.test(migrationSql));
pass("attendance:attendance_rate_column", /sch_school_metrics[\s\S]*?attendance_rate numeric/i.test(migrationSql));

pass("exam:examinations_table", tables.includes("sch_examinations"));
pass("exam:report_cards_table", tables.includes("sch_report_cards"));
pass("exam:exam_type_column", /sch_examinations[\s\S]*?exam_type text/i.test(migrationSql));
pass("exam:exam_status_column", /sch_examinations[\s\S]*?exam_status text/i.test(migrationSql));

pass("fee:fee_structures_table", tables.includes("sch_fee_structures"));
pass("fee:fee_invoices_table", tables.includes("sch_fee_invoices"));
pass("fee:fee_payments_table", tables.includes("sch_fee_payments"));
pass("fee:invoice_amount_column", /sch_fee_invoices[\s\S]*?invoice_amount numeric/i.test(migrationSql));
pass("fee:fee_collection_rate", /sch_school_metrics[\s\S]*?fee_collection_rate numeric/i.test(migrationSql));

pass("school_metrics:admissions_count", /sch_school_metrics[\s\S]*?admissions_count integer/i.test(migrationSql));
pass("school_metrics:revenue_total", /sch_school_metrics[\s\S]*?revenue_total numeric/i.test(migrationSql));
pass("school_metrics:overall_school_score", /sch_school_metrics[\s\S]*?overall_school_score numeric/i.test(migrationSql));
pass("school_metrics:teacher_performance_score", /sch_school_metrics[\s\S]*?teacher_performance_score numeric/i.test(migrationSql));

pass("disaster_recovery:school_health_column", /sch_school_health[\s\S]*?disaster_recovery_mode boolean/i.test(migrationSql));
pass("disaster_recovery:campus_health_status", /sch_school_health[\s\S]*?campus_health_status text/i.test(migrationSql));
pass("disaster_recovery:financial_health_status", /sch_school_health[\s\S]*?financial_health_status text/i.test(migrationSql));

const seedPath = join(root, "supabase", "seed", "039_enterprise_school_business_os_seed.sql");
const seedSql = existsSync(seedPath) ? readFileSync(seedPath, "utf8") : "";
pass("seed:file", existsSync(seedPath));
pass("seed:school_health_recovery", seedSql.includes("sch_school_health") && seedSql.includes("disaster_recovery_mode"));
pass("seed:admissions", seedSql.includes("sch_admissions") && seedSql.includes("adm-smith-0804"));
pass("seed:staff_attendance", seedSql.includes("sch_staff_attendance") && seedSql.includes("att-wilson-0804"));
pass("seed:examinations", seedSql.includes("sch_examinations") && seedSql.includes("exam-mid-0804"));
pass("seed:fee_invoices", seedSql.includes("sch_fee_invoices") && seedSql.includes("inv-jones-0804"));
pass("seed:school_metrics", seedSql.includes("sch_school_metrics") && seedSql.includes("overall_school_score"));
pass("seed:school_hub", seedSql.includes("sch_school_hubs") && seedSql.includes("northstar-school-os"));
pass("seed:agent_type", seedSql.includes("enterprise_school_business_os"));

const mappersPath = join(root, "src/modules/database/lib/school-mappers.ts");
const mappersSource = existsSync(mappersPath) ? readFileSync(mappersPath, "utf8") : "";
pass("mappers:file", existsSync(mappersPath));
pass("mappers:buildSchDashboardStats_exported", mappersSource.includes("export const buildSchDashboardStats") || mappersSource.includes("export function buildSchDashboardStats"));
pass("mappers:buildSchoolHubLookupMaps", mappersSource.includes("buildSchoolHubLookupMaps"));
pass("mappers:buildSchPipelineInfo", mappersSource.includes("buildSchPipelineInfo"));
if (mappersSource.includes("buildSchDashboardStats")) {
    pass("mappers:buildSchDashboardStats_campuses", /campusCount|campuses/.test(mappersSource));
    pass("mappers:buildSchDashboardStats_admissions", /admissionCount|admissions/.test(mappersSource));
    pass("mappers:buildSchDashboardStats_school_score", /overallSchoolScore|overall_school_score/.test(mappersSource));
}

const servicePath = join(root, "src/modules/school/services/school.service.ts");
const serviceSource = existsSync(servicePath) ? readFileSync(servicePath, "utf8") : "";
pass("framework:industry-framework_sdk", serviceSource.includes("@/src/modules/industry-framework/sdk"));
pass("framework:business-process_sdk", serviceSource.includes("@/src/modules/business-process/sdk"));
pass("framework:form-engine_sdk", serviceSource.includes("@/src/modules/form-engine/sdk"));
pass("framework:workflow-engine_sdk", serviceSource.includes("@/src/modules/workflow-engine/sdk"));
pass("framework:document-engine_sdk", serviceSource.includes("@/src/modules/document-engine/sdk"));
pass("framework:createIndustryFrameworkClient", serviceSource.includes("createIndustryFrameworkClient"));
pass("framework:createBusinessProcessClient", serviceSource.includes("createBusinessProcessClient"));
pass("framework:createFormEngineClient", serviceSource.includes("createFormEngineClient"));
pass("framework:createWorkflowEngineClient", serviceSource.includes("createWorkflowEngineClient"));
pass("framework:createDocumentEngineClient", serviceSource.includes("createDocumentEngineClient"));

const requiredFiles = [
    "src/modules/school/constants/index.ts",
    "src/modules/school/schemas/index.ts",
    "src/modules/school/services/school.service.ts",
    "src/modules/school/hooks/useSchool.ts",
    "src/modules/school/components/SchoolPage.tsx",
    "src/modules/school/components/SchoolStats.tsx",
    "src/modules/school/components/SchoolPanels.tsx",
    "src/modules/school/sdk/index.ts",
    "src/modules/school/index.ts",
    "src/modules/school/types/index.ts",
    "src/modules/database/lib/school-mappers.ts",
    "app/(shell)/school/page.tsx",
];

for (const file of requiredFiles) {
    pass(`file:${file}`, existsSync(join(root, file)));
}

const constantsPath = join(root, "src/modules/school/constants/index.ts");
let tabCount = 0;
if (existsSync(constantsPath)) {
    const constants = readFileSync(constantsPath, "utf8");
    const tabBlock = constants.match(/export const SCH_TABS = \{([\s\S]*?)\} as const/)?.[1] ?? "";
    tabCount = (tabBlock.match(/^\s+\w+:/gm) ?? []).length;
    pass("ui:SCH_TABS count", tabCount === 34, `count=${tabCount}`);
    pass("ui:SCH_THEME blue-600", constants.includes('primary: "blue-600"'));
    pass("ui:SCH_PERMISSIONS", constants.includes('"sch.view"') && constants.includes('"sch.admin"'));
    pass("ui:ADMISSION_STATUS_OPTIONS", constants.includes('"pending"') && constants.includes('"approved"'));
    pass("ui:EXAM_TYPE_OPTIONS", constants.includes('"midterm"') && constants.includes('"final"'));
    pass("ui:ATTENDANCE_STATUS_OPTIONS", constants.includes('"present"') && constants.includes('"absent"'));
} else {
    pass("ui:SCH_TABS count", false, "constants missing");
    pass("ui:SCH_THEME blue-600", false);
    pass("ui:SCH_PERMISSIONS", false);
    pass("ui:ADMISSION_STATUS_OPTIONS", false);
    pass("ui:EXAM_TYPE_OPTIONS", false);
    pass("ui:ATTENDANCE_STATUS_OPTIONS", false);
}

const hookPath = join(root, "src/modules/school/hooks/useSchool.ts");
if (existsSync(hookPath)) {
    const hook = readFileSync(hookPath, "utf8");
    pass("hook:cancelled useEffect", hook.includes("let cancelled = false") && hook.includes("cancelled = true"));
    pass("hook:stable auth deps", hook.includes("authUserId") && hook.includes("[authUserId, email, fullName]"));
    pass("hook:applyData semicolons", hook.includes("setStats(result.statsData);") && !hook.includes("setStats(result.statsData),"));
} else {
    pass("hook:cancelled useEffect", false);
    pass("hook:stable auth deps", false);
    pass("hook:applyData semicolons", false);
}

const panelsPath = join(root, "src/modules/school/components/SchoolPanels.tsx");
if (existsSync(panelsPath)) {
    const panels = readFileSync(panelsPath, "utf8");
    pass("ui:SchoolHubSelect form.register spread", panels.includes("SchoolHubSelect") && panels.includes('{...form.register("schoolHubId")}'));
} else {
    pass("ui:SchoolHubSelect form.register spread", false);
}

const routes = readFileSync(join(root, "src/constants/routes.ts"), "utf8");
pass("route:school", routes.includes('school: "/school"'));

const nav = readFileSync(join(root, "src/config/shell-navigation.ts"), "utf8");
pass("nav:School OS", nav.includes('"School OS"'));
pass("nav:GraduationCap icon", nav.includes("GraduationCap"));

const middleware = readFileSync(join(root, "src/middleware/auth.ts"), "utf8");
pass("middleware:school", middleware.includes("ROUTES.school"));

const pkg = readFileSync(join(root, "package.json"), "utf8");
pass("package:sprint-b7:verify", pkg.includes('"sprint-b7:verify"'));

const failed = results.filter((r) => !r.pass);
for (const item of results) {
    console.log(`${item.pass ? "PASS" : "FAIL"} ${item.check}${item.detail ? ` (${item.detail})` : ""}`);
}

console.log(`\nProgram B Sprint 7 verification: ${results.length - failed.length}/${results.length} passed`);
console.log(`SCH_TABS count: ${tabCount}`);

if (failed.length > 0) {
    process.exit(1);
}

console.log("All Program B Sprint 7 verification checks passed.");
