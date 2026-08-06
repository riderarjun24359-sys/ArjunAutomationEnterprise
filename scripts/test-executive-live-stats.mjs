/**
 * Unit checks for Executive Dashboard live KPI builders (no Supabase required).
 * Run: node scripts/test-executive-live-stats.mjs
 */
import { readFileSync, existsSync, writeFileSync, unlinkSync, mkdtempSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const results = [];

function pass(check, ok, detail = "") {
    results.push({ check, pass: !!ok, detail });
}

const kpiPath = join(root, "src/modules/executive-command-center/services/build-live-operations-kpis.ts");
const livePath = join(root, "src/modules/executive-command-center/services/live-operations-stats.service.ts");
const opsPath = join(root, "src/modules/executive-command-center/services/organization-operations-data.service.ts");
const servicePath = join(root, "src/modules/executive-command-center/services/executive-command-center.service.ts");

pass("files:exist", existsSync(kpiPath) && existsSync(livePath) && existsSync(servicePath) && existsSync(opsPath));

const kpiSrc = readFileSync(kpiPath, "utf8");
const liveSrc = readFileSync(livePath, "utf8");
const opsSrc = readFileSync(opsPath, "utf8");
const serviceSrc = readFileSync(servicePath, "utf8");

pass("export:buildLiveOperationsKpis", kpiSrc.includes("export function buildLiveOperationsKpis"));
pass("export:createEmptyLiveOperationsStats", kpiSrc.includes("export function createEmptyLiveOperationsStats"));
pass("export:fetchLiveOperationsStats", liveSrc.includes("export async function fetchLiveOperationsStats"));
pass("service:uses-live-fetch", serviceSrc.includes("loadOrganizationOperationsData") || serviceSrc.includes("fetchLiveOperationsStats"));
pass("service:uses-kpi-builder", serviceSrc.includes("buildLiveOperationsKpis"));

const kpiLabels = ["Total Clients", "Active Projects", "Open Tasks", "CRM Leads", "Revenue Summary"];
for (const label of kpiLabels) {
    pass(`kpi-label:${label}`, kpiSrc.includes(`"${label}"`));
}

const queries = [
    "databaseService.clients",
    "databaseService.projects",
    "databaseService.tasks",
    "databaseService.salesLeads",
    "databaseService.invoices",
    "databaseService.payments",
    "databaseService.audits",
    "databaseService.activityLogs",
];
for (const q of queries) {
    pass(`query:${q}`, opsSrc.includes(q) || liveSrc.includes(q));
}

const dir = mkdtempSync(join(tmpdir(), "ecc-live-"));
const harness = join(dir, "kpi-harness.mts");
const kpiUrl = pathToFileURL(kpiPath).href;

writeFileSync(
    harness,
    `
import { buildLiveOperationsKpis, createEmptyLiveOperationsStats } from ${JSON.stringify(kpiUrl)};

const empty = createEmptyLiveOperationsStats("no_organization");
const kpis = buildLiveOperationsKpis(empty);
if (kpis.length !== 5) throw new Error("expected 5 kpis, got " + kpis.length);
const titles = kpis.map((k) => k.title);
const expected = ["Total Clients", "Active Projects", "Open Tasks", "CRM Leads", "Revenue Summary"];
for (const t of expected) if (!titles.includes(t)) throw new Error("missing " + t);

const filled = buildLiveOperationsKpis({
  ...empty,
  totalClients: 12,
  activeProjects: 4,
  openTasks: 9,
  crmLeads: 7,
  revenue: { ...empty.revenue, collected: 50000, label: "$50,000", detail: "2 open · $1,000 outstanding", invoiceCount: 3 },
  source: "supabase",
});
if (filled[0].value !== "12") throw new Error("client count wrong");
if (filled[4].value !== "$50,000") throw new Error("revenue label wrong");
console.log("RUNTIME_OK");
`,
);

const runtime = spawnSync(
    process.execPath,
    ["--experimental-strip-types", "--no-warnings", harness],
    { cwd: root, encoding: "utf8" },
);

try {
    unlinkSync(harness);
} catch {
    /* ignore */
}

const runtimeOk = (runtime.stdout || "").includes("RUNTIME_OK") && runtime.status === 0;
pass(
    "runtime:buildLiveOperationsKpis",
    runtimeOk,
    runtimeOk ? "" : ((runtime.stderr || runtime.stdout || "").slice(0, 500)),
);

const passed = results.filter((r) => r.pass).length;
const failed = results.filter((r) => !r.pass);

console.log(`\nExecutive live stats tests: ${passed}/${results.length} passed\n`);
for (const r of results) {
    console.log(`${r.pass ? "✓" : "✗"} ${r.check}${r.detail ? ` — ${r.detail}` : ""}`);
}

if (failed.length > 0) process.exit(1);
