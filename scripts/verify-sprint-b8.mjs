/**
 * Program B Sprint 8 verification: regression, security, tenant isolation, performance,
 * patient workflow, appointment, billing, pharmacy, laboratory verification,
 * no clinical diagnosis AI, and framework SDK compatibility.
 * Run: node scripts/verify-sprint-b8.mjs
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

const migrationPath = join(root, "supabase", "migrations", "202608020040_enterprise_hospital_business_os.sql");
const migrationSql = existsSync(migrationPath) ? readFileSync(migrationPath, "utf8") : "";

const tableMatches = [...migrationSql.matchAll(/create table if not exists public\.(hsp_\w+)/gi)];
const tables = [...new Set(tableMatches.map((m) => m[1]))];

pass("schema:hsp_table_count", tables.length === 32, `count=${tables.length}`);

for (const table of tables) {
    const rlsEnabled = new RegExp(`alter table public\\.${table} enable row level security`, "i").test(migrationSql);
    pass(`security:RLS:${table}`, rlsEnabled);
}

const orgOnlyTables = new Set(["hsp_hospital_metrics", "hsp_hospital_health", "hsp_audit_logs"]);
const childTables = tables.filter((t) => t !== "hsp_hospital_hubs" && !orgOnlyTables.has(t));
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

pass("patient:patient_registrations_table", tables.includes("hsp_patient_registrations"));
pass("patient:patient_profiles_table", tables.includes("hsp_patient_profiles"));
pass("patient:insurance_policies_table", tables.includes("hsp_insurance_policies"));
pass("patient:registration_status_column", /hsp_patient_registrations[\s\S]*?registration_status text/i.test(migrationSql));

pass("appointment:appointments_table", tables.includes("hsp_appointments"));
pass("appointment:opd_visits_table", tables.includes("hsp_opd_visits"));
pass("appointment:ipd_admissions_table", tables.includes("hsp_ipd_admissions"));
pass("appointment:appointment_status_column", /hsp_appointments[\s\S]*?appointment_status text/i.test(migrationSql));

pass("billing:hospital_billing_table", tables.includes("hsp_hospital_billing"));
pass("billing:hospital_invoices_table", tables.includes("hsp_hospital_invoices"));
pass("billing:hospital_payments_table", tables.includes("hsp_hospital_payments"));
pass("billing:invoice_amount_column", /hsp_hospital_invoices[\s\S]*?invoice_amount numeric/i.test(migrationSql));
pass("billing:insurance_claims_table", tables.includes("hsp_insurance_claims"));

pass("pharmacy:pharmacy_inventory_table", tables.includes("hsp_pharmacy_inventory"));
pass("pharmacy:prescriptions_table", tables.includes("hsp_prescriptions"));
pass("pharmacy:prescription_status_column", /hsp_prescriptions[\s\S]*?prescription_status text/i.test(migrationSql));

pass("laboratory:lab_orders_table", tables.includes("hsp_lab_orders"));
pass("laboratory:lab_results_table", tables.includes("hsp_lab_results"));
pass("laboratory:order_status_column", /hsp_lab_orders[\s\S]*?order_status text/i.test(migrationSql));
pass("laboratory:result_status_column", /hsp_lab_results[\s\S]*?result_status text/i.test(migrationSql));

pass("hospital_metrics:admissions_count", /hsp_hospital_metrics[\s\S]*?admissions_count integer/i.test(migrationSql));
pass("hospital_metrics:discharge_count", /hsp_hospital_metrics[\s\S]*?discharge_count integer/i.test(migrationSql));
pass("hospital_metrics:bed_occupancy_rate", /hsp_hospital_metrics[\s\S]*?bed_occupancy_rate numeric/i.test(migrationSql));
pass("hospital_metrics:overall_hospital_score", /hsp_hospital_metrics[\s\S]*?overall_hospital_score numeric/i.test(migrationSql));
pass("hospital_metrics:patient_satisfaction_score", /hsp_hospital_metrics[\s\S]*?patient_satisfaction_score numeric/i.test(migrationSql));

pass("disaster_recovery:hospital_health_column", /hsp_hospital_health[\s\S]*?disaster_recovery_mode boolean/i.test(migrationSql));
pass("disaster_recovery:bed_utilization_status", /hsp_hospital_health[\s\S]*?bed_utilization_status text/i.test(migrationSql));
pass("disaster_recovery:financial_health_status", /hsp_hospital_health[\s\S]*?financial_health_status text/i.test(migrationSql));

const seedPath = join(root, "supabase", "seed", "040_enterprise_hospital_business_os_seed.sql");
const seedSql = existsSync(seedPath) ? readFileSync(seedPath, "utf8") : "";
pass("seed:file", existsSync(seedPath));
pass("seed:hospital_health_recovery", seedSql.includes("hsp_hospital_health") && seedSql.includes("disaster_recovery_mode"));
pass("seed:patient_registrations", seedSql.includes("hsp_patient_registrations") && seedSql.includes("reg-smith-0804"));
pass("seed:appointments", seedSql.includes("hsp_appointments") && seedSql.includes("appt-jones-0804"));
pass("seed:hospital_invoices", seedSql.includes("hsp_hospital_invoices") && seedSql.includes("inv-jones-0804"));
pass("seed:pharmacy_inventory", seedSql.includes("hsp_pharmacy_inventory") && seedSql.includes("inv-paracetamol-0804"));
pass("seed:lab_orders", seedSql.includes("hsp_lab_orders") && seedSql.includes("lab-jones-0804"));
pass("seed:hospital_metrics", seedSql.includes("hsp_hospital_metrics") && seedSql.includes("overall_hospital_score"));
pass("seed:hospital_hub", seedSql.includes("hsp_hospital_hubs") && seedSql.includes("northstar-hospital-os"));
pass("seed:agent_type", seedSql.includes("enterprise_hospital_business_os"));

const mappersPath = join(root, "src/modules/database/lib/hospital-mappers.ts");
const mappersSource = existsSync(mappersPath) ? readFileSync(mappersPath, "utf8") : "";
pass("mappers:file", existsSync(mappersPath));
pass("mappers:buildHspDashboardStats_exported", mappersSource.includes("export const buildHspDashboardStats") || mappersSource.includes("export function buildHspDashboardStats"));
pass("mappers:buildHospitalHubLookupMaps", mappersSource.includes("buildHospitalHubLookupMaps"));
pass("mappers:buildHspPipelineInfo", mappersSource.includes("buildHspPipelineInfo"));
if (mappersSource.includes("buildHspDashboardStats")) {
    pass("mappers:buildHspDashboardStats_campuses", /campusCount|campuses/.test(mappersSource));
    pass("mappers:buildHspDashboardStats_patient_registrations", /patientRegistrationCount|patientRegistrations/.test(mappersSource));
    pass("mappers:buildHspDashboardStats_hospital_score", /overallHospitalScore|overall_hospital_score/.test(mappersSource));
}

const servicePath = join(root, "src/modules/hospital/services/hospital.service.ts");
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

const diagnosisPatterns = [/clinical.?diagnosis/i, /diagnosis.?ai/i, /diagnose.?patient/i, /ai.?diagnos/i];
const hasDiagnosisAi = diagnosisPatterns.some((p) => p.test(serviceSource));
pass("no_clinical_diagnosis:service", !hasDiagnosisAi, hasDiagnosisAi ? "found diagnosis AI references" : "");
pass("no_clinical_diagnosis:clinical_notes_operational", /note_type text not null default 'operational'/i.test(migrationSql));

const requiredFiles = [
    "src/modules/hospital/constants/index.ts",
    "src/modules/hospital/schemas/index.ts",
    "src/modules/hospital/services/hospital.service.ts",
    "src/modules/hospital/hooks/useHospital.ts",
    "src/modules/hospital/components/HospitalPage.tsx",
    "src/modules/hospital/components/HospitalStats.tsx",
    "src/modules/hospital/components/HospitalPanels.tsx",
    "src/modules/hospital/sdk/index.ts",
    "src/modules/hospital/index.ts",
    "src/modules/hospital/types/index.ts",
    "src/modules/database/lib/hospital-mappers.ts",
    "app/(shell)/hospital/page.tsx",
];

for (const file of requiredFiles) {
    pass(`file:${file}`, existsSync(join(root, file)));
}

const constantsPath = join(root, "src/modules/hospital/constants/index.ts");
let tabCount = 0;
if (existsSync(constantsPath)) {
    const constants = readFileSync(constantsPath, "utf8");
    const tabBlock = constants.match(/export const HSP_TABS = \{([\s\S]*?)\} as const/)?.[1] ?? "";
    tabCount = (tabBlock.match(/^\s+\w+:/gm) ?? []).length;
    pass("ui:HSP_TABS count", tabCount === 34, `count=${tabCount}`);
    pass("ui:HSP_THEME cyan-600", constants.includes('primary: "cyan-600"'));
    pass("ui:HSP_PERMISSIONS", constants.includes('"hsp.view"') && constants.includes('"hsp.admin"'));
    pass("ui:REGISTRATION_STATUS_OPTIONS", constants.includes('"pending"') && constants.includes('"approved"'));
    pass("ui:APPOINTMENT_STATUS_OPTIONS", constants.includes('"scheduled"') && constants.includes('"completed"'));
    pass("ui:BED_STATUS_OPTIONS", constants.includes('"available"') && constants.includes('"occupied"'));
} else {
    pass("ui:HSP_TABS count", false, "constants missing");
    pass("ui:HSP_THEME cyan-600", false);
    pass("ui:HSP_PERMISSIONS", false);
    pass("ui:REGISTRATION_STATUS_OPTIONS", false);
    pass("ui:APPOINTMENT_STATUS_OPTIONS", false);
    pass("ui:BED_STATUS_OPTIONS", false);
}

const hookPath = join(root, "src/modules/hospital/hooks/useHospital.ts");
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

const panelsPath = join(root, "src/modules/hospital/components/HospitalPanels.tsx");
if (existsSync(panelsPath)) {
    const panels = readFileSync(panelsPath, "utf8");
    pass("ui:HospitalHubSelect form.register spread", panels.includes("HospitalHubSelect") && panels.includes('{...form.register("hospitalHubId")}'));
} else {
    pass("ui:HospitalHubSelect form.register spread", false);
}

const routes = readFileSync(join(root, "src/constants/routes.ts"), "utf8");
pass("route:hospital", routes.includes('hospital: "/hospital"'));

const nav = readFileSync(join(root, "src/config/shell-navigation.ts"), "utf8");
pass("nav:Hospital OS", nav.includes('"Hospital OS"'));
pass("nav:HeartPulse icon", nav.includes("HeartPulse"));

const middleware = readFileSync(join(root, "src/middleware/auth.ts"), "utf8");
pass("middleware:hospital", middleware.includes("ROUTES.hospital"));

const pkg = readFileSync(join(root, "package.json"), "utf8");
pass("package:sprint-b8:verify", pkg.includes('"sprint-b8:verify"'));

const failed = results.filter((r) => !r.pass);
for (const item of results) {
    console.log(`${item.pass ? "PASS" : "FAIL"} ${item.check}${item.detail ? ` (${item.detail})` : ""}`);
}

console.log(`\nProgram B Sprint 8 verification: ${results.length - failed.length}/${results.length} passed`);
console.log(`HSP_TABS count: ${tabCount}`);

if (failed.length > 0) {
    process.exit(1);
}

console.log("All Program B Sprint 8 verification checks passed.");
