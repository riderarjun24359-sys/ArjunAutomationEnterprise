/**
 * Verify AI-first delivery model: no fixed traditional timelines in marketing/business content.
 * Run: node scripts/verify-ai-delivery-model.mjs
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const results = [];

function pass(check, ok, detail = "") {
    results.push({ check, pass: ok, detail });
}

function readSafe(path) {
    try {
        return readFileSync(path, "utf8");
    } catch {
        return "";
    }
}

function walkFiles(dir, acc = []) {
    if (!existsSync(dir)) return acc;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = join(dir, entry.name);
        if (entry.isDirectory() && entry.name !== "node_modules") walkFiles(full, acc);
        else if (/\.(tsx?|md)$/.test(entry.name)) acc.push(full);
    }
    return acc;
}

const scanDirs = [
    join(root, "app", "(marketing)"),
    join(root, "src", "modules", "company-launch-kit", "data"),
    join(root, "src", "modules", "company-launch-kit", "content"),
    join(root, "src", "modules", "company-launch-kit", "components"),
    join(root, "src", "modules", "business-assets", "data"),
    join(root, "src", "modules", "brand-os", "content"),
    join(root, "src", "constants"),
];

const forbiddenPatterns = [
    /go live in 90 days/i,
    /go-live in 90 days/i,
    /Most clients go live in 90/i,
    /Average Go-Live/i,
    /90-day go-live/i,
    /90-day framework/i,
    /8–12 weeks/i,
    /8-12 weeks/i,
    /6–10 weeks/i,
    /6-10 weeks/i,
    /2–4 weeks/i,
    /2-4 weeks/i,
    /2–6 weeks/i,
    /2-6 weeks/i,
    /4–6 weeks/i,
    /4-8 weeks/i,
    /3–6 weeks/i,
    /12–16 weeks/i,
    /Enterprise Automation in 90 Days/i,
    /quote-to-cash in 8 weeks/i,
    /live in 10 weeks/i,
    /Unified in 90 Days/i,
    /Ready to launch in 90 days/i,
    /within \[X\] weeks/i,
    /Estimated Timeline:\*\* \[X weeks\]/,
    /Timeline:\*\* \[X weeks\]/,
    /Average enterprise go-live: \*\*90 days\*\*/i,
    /average 90-day enterprise/i,
];

// Allow payment/legal contexts — exclude paths that are invoice/legal only for some patterns
const allowedContextPatterns = [
    /Net 15 days/i,
    /Payment due within 15 days/i,
    /valid for 30 days from/i,
    /Valid Until.*30 days/i,
    /written notice/i,
    /post-termination/i,
    /respond within 30 days/i,
    /hypercare period/i,
    /30-day hypercare/i,
    /Day 30, 60, 90/i,
    /first 90 days; ongoing usage/i,
    /contracted within 90 days \(up to 15%/i,
    /Renewal review.*60 days before/i,
    /contracted within 90 days/i,
    /first 90 days; ongoing usage/i,
];

function isAllowedLine(line) {
    return allowedContextPatterns.some((p) => p.test(line));
}

let violations = [];
for (const dir of scanDirs) {
    for (const file of walkFiles(dir)) {
        const rel = file.replace(root + "\\", "").replace(root + "/", "");
        if (rel.includes("ai-delivery-model.ts")) continue;
        const content = readSafe(file);
        const lines = content.split("\n");
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (isAllowedLine(line)) continue;
            for (const pattern of forbiddenPatterns) {
                if (pattern.test(line)) {
                    violations.push(`${rel}:${i + 1}: ${line.trim().slice(0, 80)}`);
                    break;
                }
            }
        }
    }
}

pass("model:ai_delivery_model_exists", existsSync(join(root, "src", "constants", "ai-delivery-model.ts")));
const modelSource = readSafe(join(root, "src", "constants", "ai-delivery-model.ts"));
pass("model:five_levels", modelSource.includes("AI Requirement Analysis") && modelSource.includes("Secure Production Deployment"));
pass("model:policy_summary", modelSource.includes("AI-accelerated delivery without compromising"));
pass("model:forbidden_list", modelSource.includes("FORBIDDEN_DELIVERY_TIMELINES"));

pass("scan:no_forbidden_timelines", violations.length === 0, violations.slice(0, 5).join(" | "));

const tsc = spawnSync("npx", ["tsc", "--noEmit"], { cwd: root, shell: true, encoding: "utf8" });
pass("regression:tsc", tsc.status === 0, tsc.status !== 0 ? (tsc.stderr || tsc.stdout || "").slice(0, 200) : "");

const passed = results.filter((r) => r.pass).length;
const failed = results.filter((r) => !r.pass);

console.log("\nAI Delivery Model Verification Results\n");
for (const r of results) {
    console.log(`${r.pass ? "PASS" : "FAIL"} ${r.check}${r.detail ? ` — ${r.detail}` : ""}`);
}
if (violations.length > 0) {
    console.log("\nViolations:");
    violations.slice(0, 20).forEach((v) => console.log(`  ${v}`));
}
console.log(`\n${passed}/${results.length} checks passed`);

if (failed.length > 0) process.exit(1);
