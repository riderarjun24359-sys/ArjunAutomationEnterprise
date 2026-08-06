/**
 * CRM Enterprise Platform verification + unit tests.
 * Run: node scripts/test-crm-enterprise.mjs
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

const mod = join(root, "src/modules/crm");
const files = [
    "services/crm-platform-data.service.ts",
    "services/crm-enterprise-builders.ts",
    "services/crm.service.ts",
    "hooks/useCrmPlatform.ts",
    "components/CrmPage.tsx",
    "components/ClientDirectoryPanel.tsx",
    "components/LeadKanbanBoard.tsx",
    "components/ClientProfileWorkspace.tsx",
    "components/AiCrmAssistantPanel.tsx",
    "components/CommunicationCenterPanel.tsx",
    "components/CrmAnalyticsPanel.tsx",
    "types/enterprise.ts",
];
for (const f of files) pass(`file:${f}`, existsSync(join(mod, f)));

const page = readFileSync(join(mod, "components/CrmPage.tsx"), "utf8");
pass("page:directory", page.includes("ClientDirectoryPanel"));
pass("page:leads", page.includes("LeadKanbanBoard"));
pass("page:profile", page.includes("ClientProfileWorkspace"));
pass("page:ai", page.includes("AiCrmAssistantPanel"));
pass("page:comms", page.includes("CommunicationCenterPanel"));
pass("page:analytics", page.includes("CrmAnalyticsPanel"));

const dataSrc = readFileSync(join(mod, "services/crm-platform-data.service.ts"), "utf8");
for (const q of [
    "databaseService.clients",
    "databaseService.salesLeads",
    "databaseService.salesOpportunities",
    "databaseService.salesEmailTracking",
    "databaseService.salesCallLogs",
    "databaseService.documents",
]) {
    pass(`query:${q}`, dataSrc.includes(q));
}

const mapper = readFileSync(join(root, "src/modules/database/lib/crm-mappers.ts"), "utf8");
pass("no-mock-revenue", !mapper.includes("$312k"));

const eccPage = readFileSync(join(root, "src/modules/executive-command-center/components/ExecutiveCommandCenterPage.tsx"), "utf8");
pass("sprint1-dashboard-intact", eccPage.includes("UnifiedKpiStrip") && eccPage.includes("ExecutiveChartsPanel"));

const dir = mkdtempSync(join(tmpdir(), "crm-ent-"));
const harness = join(dir, "crm-harness.mts");
const buildersUrl = pathToFileURL(join(mod, "services/crm-enterprise-builders.ts")).href;

writeFileSync(
    harness,
    `
import {
  buildCrmEnterpriseSnapshot,
  createEmptyCrmSnapshot,
  queryDirectory,
  normalizeLeadStage,
  computeClientHealthScore,
  mapDirectoryClient,
} from ${JSON.stringify(buildersUrl)};

const empty = createEmptyCrmSnapshot();
if (empty.kanban.length !== 7) throw new Error("kanban columns");
if (normalizeLeadStage("qualified") !== "qualified") throw new Error("stage");

const now = "2026-08-01T00:00:00.000Z";
const data = {
  organizationId: "org",
  clients: [{
    id: "c1", organization_id: "org", name: "Acme", status: "active", industry: "saas",
    contact_email: "a@acme.com", manager_name: "Alex", revenue: "10000", lifecycle_stage: "client",
    phone: "1", website: "", address: "", description: "Acme Corp", created_at: now, updated_at: now,
  }],
  leadsCrm: [{
    id: "l1", organization_id: "org", name: "Beta", status: "lead", industry: "retail",
    contact_email: "b@beta.com", manager_name: "Sam", revenue: "0", lifecycle_stage: "qualified",
    lead_score: 80, deal_value: "5000", assigned_to: "Sam", created_at: now, updated_at: now,
  }],
  salesLeads: [{
    id: "sl1", organization_id: "org", lead_name: "Casey", company_name: "Gamma", email: "c@gamma.com",
    phone: "2", source: "web", status: "new", score: 90, assigned_to: "Sam", created_at: now, updated_at: now,
  }],
  opportunities: [{ id: "o1", organization_id: "org", opportunity_number: "1", name: "Deal", description: "", amount: 1000, probability: 50, status: "open", created_at: now, updated_at: now }],
  contacts: [], projects: [], tasks: [], invoices: [], payments: [{ id: "p1", organization_id: "org", invoice_id: "i1", amount: 2500, payment_date: now, method: "card", reference: "", status: "paid", created_at: now, updated_at: now }],
  activities: [{ id: "a1", organization_id: "org", entity_type: "client", entity_id: "c1", action: "note", title: "Note", detail: "Hello", created_at: now }],
  salesActivities: [], calls: [], emails: [], meetings: [], winLoss: [{ id: "w1", organization_id: "org", opportunity_id: "o1", outcome: "won", reason: "fit", competitor: "", amount: 1000, recorded_at: now, created_at: now }],
  documents: [], fetchedAt: now,
};

const snap = buildCrmEnterpriseSnapshot(data);
if (snap.directory.length < 1) throw new Error("directory");
if (snap.leads.length < 2) throw new Error("leads");
if (snap.analytics.winLoss.won !== 1) throw new Error("win");
if (snap.stats.collectedRevenue < 2500) throw new Error("revenue");
const page = queryDirectory(snap.directory, { search: "acme", status: "all", owner: "all", tag: "all", page: 1, pageSize: 10 });
if (page.total !== 1) throw new Error("search");
const client = mapDirectoryClient(data.clients[0]);
const health = computeClientHealthScore({ client, openTasks: 0, activeProjects: 1, outstanding: 0, collected: 10000, recentActivityDays: 2 });
if (health < 50) throw new Error("health");
console.log("RUNTIME_OK");
`,
);

const runtime = spawnSync(process.execPath, ["--experimental-strip-types", "--no-warnings", harness], {
    cwd: root,
    encoding: "utf8",
});
try { unlinkSync(harness); } catch { /* ignore */ }

pass("runtime:builders", (runtime.stdout || "").includes("RUNTIME_OK") && runtime.status === 0, ((runtime.stderr || runtime.stdout || "").slice(0, 500)));

const passed = results.filter((r) => r.pass).length;
const failed = results.filter((r) => !r.pass);
console.log(`\nCRM enterprise tests: ${passed}/${results.length} passed\n`);
for (const r of results) console.log(`${r.pass ? "✓" : "✗"} ${r.check}${r.detail ? ` — ${r.detail}` : ""}`);
if (failed.length > 0) process.exit(1);
