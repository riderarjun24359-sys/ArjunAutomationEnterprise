/**
 * Unit checks for Executive Dashboard widgets (Phase 2).
 * Run: node scripts/test-executive-widgets.mjs
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

const mod = join(root, "src/modules/executive-command-center");
const files = [
    "services/activity-timeline.service.ts",
    "services/executive-charts.service.ts",
    "services/ai-executive-insights.service.ts",
    "services/executive-widgets.service.ts",
    "services/organization-operations-data.service.ts",
    "components/RecentActivityTimeline.tsx",
    "components/AiExecutiveInsightsPanel.tsx",
    "components/QuickActionsPanel.tsx",
    "components/ExecutiveChartsPanel.tsx",
    "constants/quick-actions.ts",
];

for (const f of files) {
    pass(`file:${f}`, existsSync(join(mod, f)));
}

const page = readFileSync(join(mod, "components/ExecutiveCommandCenterPage.tsx"), "utf8");
pass("page:quick-actions", page.includes("QuickActionsPanel"));
pass("page:activity", page.includes("RecentActivityTimeline"));
pass("page:insights", page.includes("AiExecutiveInsightsPanel"));
pass("page:charts", page.includes("ExecutiveChartsPanel"));
pass("page:responsive", page.includes("lg:grid-cols-2") || page.includes("md:grid-cols-2"));

const chartsSrc = readFileSync(join(mod, "services/executive-charts.service.ts"), "utf8");
pass("charts:revenue", chartsSrc.includes("buildRevenueTrend"));
pass("charts:clients", chartsSrc.includes("buildClientGrowth"));
pass("charts:projects", chartsSrc.includes("buildProjectStatusDistribution"));
pass("charts:tasks", chartsSrc.includes("buildTaskCompletionStats"));

const activitySrc = readFileSync(join(mod, "services/activity-timeline.service.ts"), "utf8");
pass("activity:filter", activitySrc.includes("filterActivityTimeline"));
pass("activity:relative", activitySrc.includes("formatRelativeTimestamp"));

const qa = readFileSync(join(mod, "constants/quick-actions.ts"), "utf8");
for (const label of ["Add Client", "Create Project", "Create Task", "Add Lead", "Generate Report"]) {
    pass(`quick-action:${label}`, qa.includes(label));
}

const dir = mkdtempSync(join(tmpdir(), "ecc-widgets-"));
const harness = join(dir, "widgets-harness.mts");
const activityUrl = pathToFileURL(join(mod, "services/activity-timeline.service.ts")).href;
const chartsUrl = pathToFileURL(join(mod, "services/executive-charts.service.ts")).href;
const insightsUrl = pathToFileURL(join(mod, "services/ai-executive-insights.service.ts")).href;
const emptyUrl = pathToFileURL(join(mod, "services/build-live-operations-kpis.ts")).href;

writeFileSync(
    harness,
    `
import { buildActivityTimeline, filterActivityTimeline, formatRelativeTimestamp, mapEntityTypeToModule } from ${JSON.stringify(activityUrl)};
import { buildExecutiveCharts } from ${JSON.stringify(chartsUrl)};
import { buildAiExecutiveInsights } from ${JSON.stringify(insightsUrl)};
import { createEmptyLiveOperationsStats } from ${JSON.stringify(emptyUrl)};

if (mapEntityTypeToModule("invoice") !== "finance") throw new Error("module map finance");
if (mapEntityTypeToModule("project") !== "projects") throw new Error("module map projects");
if (formatRelativeTimestamp(new Date().toISOString()).length < 2) throw new Error("relative");

const now = new Date("2026-08-01T12:00:00.000Z");
const data = {
  organizationId: "org-1",
  clients: [
    { id: "c1", organization_id: "org-1", name: "A", status: "active", industry: "", contact_email: "", manager_name: "", revenue: "0", lifecycle_stage: "client", created_at: "2026-06-15T00:00:00.000Z", updated_at: "2026-06-15T00:00:00.000Z" },
    { id: "c2", organization_id: "org-1", name: "B", status: "active", industry: "", contact_email: "", manager_name: "", revenue: "0", lifecycle_stage: "client", created_at: "2026-07-10T00:00:00.000Z", updated_at: "2026-07-10T00:00:00.000Z" },
  ],
  activeClients: [],
  projects: [
    { id: "p1", organization_id: "org-1", name: "P", status: "active", priority: "high", progress: 40, budget: "0", timeline: "", owner_name: "", description: "", template: "", client_name: "", team_size: 1, created_at: "2026-07-01T00:00:00.000Z", updated_at: "2026-07-01T00:00:00.000Z" },
    { id: "p2", organization_id: "org-1", name: "Q", status: "completed", priority: "low", progress: 100, budget: "0", timeline: "", owner_name: "", description: "", template: "", client_name: "", team_size: 1, created_at: "2026-05-01T00:00:00.000Z", updated_at: "2026-05-01T00:00:00.000Z" },
  ],
  tasks: [
    { id: "t1", organization_id: "org-1", title: "T1", description: "", status: "done", priority: "medium", created_at: "2026-07-01T00:00:00.000Z", updated_at: "2026-07-01T00:00:00.000Z" },
    { id: "t2", organization_id: "org-1", title: "T2", description: "", status: "todo", priority: "medium", created_at: "2026-07-02T00:00:00.000Z", updated_at: "2026-07-02T00:00:00.000Z" },
  ],
  salesLeads: [],
  crmLeads: [],
  invoices: [],
  payments: [
    { id: "pay1", organization_id: "org-1", invoice_id: "i1", amount: 1200, payment_date: "2026-07-20", method: "card", reference: "", status: "completed", created_at: "2026-07-20T00:00:00.000Z", updated_at: "2026-07-20T00:00:00.000Z" },
  ],
  audits: [
    { id: "a1", action: "update", entity_type: "invoice", entity_id: "i1", created_at: "2026-07-21T00:00:00.000Z" },
  ],
  activities: [
    { id: "act1", organization_id: "org-1", entity_type: "project", action: "create", title: "Project created", detail: "P", created_at: "2026-07-22T00:00:00.000Z" },
  ],
  fetchedAt: now.toISOString(),
};

const timeline = buildActivityTimeline(data, now.getTime());
if (timeline.length < 2) throw new Error("timeline length");
if (filterActivityTimeline(timeline, "finance").length < 1) throw new Error("finance filter");
if (filterActivityTimeline(timeline, "projects").length < 1) throw new Error("projects filter");

const charts = buildExecutiveCharts(data, now);
if (charts.revenueTrend.length !== 6) throw new Error("revenue months");
if (!charts.revenueTrend.some((p) => p.value === 1200)) throw new Error("revenue value");
if (charts.projectStatus.length < 2) throw new Error("project status");
if (charts.taskCompletion.rate !== 50) throw new Error("task rate");

const liveStats = {
  ...createEmptyLiveOperationsStats("no_organization"),
  totalClients: 2,
  activeProjects: 1,
  openTasks: 20,
  crmLeads: 5,
  revenue: { collected: 1000, outstanding: 500, openInvoiceCount: 2, invoiceCount: 3, currency: "USD", label: "$1,000", detail: "x" },
  source: "supabase",
};
const insights = buildAiExecutiveInsights({ liveStats, charts, unifiedScore: 70 });
if (insights.length === 0) throw new Error("insights empty");
if (!insights.some((i) => i.priority === "P1" || i.priority === "P2")) throw new Error("priority missing");

console.log("RUNTIME_OK");
`,
);

const runtime = spawnSync(process.execPath, ["--experimental-strip-types", "--no-warnings", harness], {
    cwd: root,
    encoding: "utf8",
});

try {
    unlinkSync(harness);
} catch {
    /* ignore */
}

const runtimeOk = (runtime.stdout || "").includes("RUNTIME_OK") && runtime.status === 0;
pass("runtime:widgets", runtimeOk, runtimeOk ? "" : ((runtime.stderr || runtime.stdout || "").slice(0, 600)));

const passed = results.filter((r) => r.pass).length;
const failed = results.filter((r) => !r.pass);
console.log(`\nExecutive widgets tests: ${passed}/${results.length} passed\n`);
for (const r of results) {
    console.log(`${r.pass ? "✓" : "✗"} ${r.check}${r.detail ? ` — ${r.detail}` : ""}`);
}
if (failed.length > 0) process.exit(1);
