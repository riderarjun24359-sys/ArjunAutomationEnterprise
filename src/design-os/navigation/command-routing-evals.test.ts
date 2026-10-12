import { describe, it, expect } from "vitest";
import { resolveCommand } from "./command-resolver";
import { shellNavigation } from "@/src/config/shell-navigation";

/**
 * Routing evaluation: dataset-driven accuracy gate over the REAL production
 * navigation config (LangGraph/Copilot-Studio "evals" analog, dependency-free).
 *
 * Each case is a realistic user phrase mapped to the module it must open.
 * The suite reports per-case results plus aggregate accuracy and FAILS below
 * the threshold, so routing regressions (renamed labels, reordered nav,
 * broken aliases) break the build instead of silently stranding users.
 *
 * To extend: add `{ query, href }` rows. `match` is informational except where
 * pinned (EXACT/ALIAS stability for the highest-traffic phrases).
 */
interface EvalCase {
    query: string;
    href: string;
    match?: string;
}

const CASES: EvalCase[] = [
    // Exact labels — the highest-traffic phrases, match type pinned.
    { query: "dashboard", href: "/dashboard", match: "EXACT" },
    { query: "crm", href: "/crm", match: "EXACT" },
    { query: "finance", href: "/finance", match: "EXACT" },
    { query: "tasks", href: "/tasks", match: "EXACT" },
    { query: "projects", href: "/projects", match: "EXACT" },
    { query: "clients", href: "/clients", match: "EXACT" },
    { query: "knowledge", href: "/knowledge", match: "EXACT" },
    { query: "sales", href: "/sales", match: "EXACT" },
    { query: "automation", href: "/automation", match: "EXACT" },
    { query: "executive ai", href: "/executive-ai", match: "EXACT" },
    { query: "client success", href: "/client-success", match: "EXACT" },
    { query: "security center", href: "/security-center", match: "EXACT" },
    { query: "restaurant os", href: "/restaurant", match: "EXACT" },
    { query: "school os", href: "/school", match: "EXACT" },
    { query: "workflow engine", href: "/workflow-engine", match: "EXACT" },
    { query: "billing & revenue", href: "/billing-revenue", match: "EXACT" },
    { query: "communication hub", href: "/communication-hub", match: "EXACT" },
    { query: "organization", href: "/organization", match: "EXACT" },
    // Documented aliases.
    { query: "home", href: "/dashboard", match: "ALIAS" },
    { query: "executive", href: "/dashboard", match: "ALIAS" },
    { query: "workflows", href: "/automation", match: "ALIAS" },
    { query: "agents", href: "/automation", match: "ALIAS" },
    { query: "revenue", href: "/finance", match: "ALIAS" },
    { query: "billing", href: "/finance", match: "ALIAS" },
    { query: "costs", href: "/finance", match: "ALIAS" },
    // Prefix / contains behavior on real labels.
    { query: "fin", href: "/finance" },
    { query: "task", href: "/tasks" },
    { query: "sec", href: "/security-center" },
    { query: "know", href: "/knowledge" },
    { query: "sale", href: "/sales" },
    { query: "client", href: "/clients" },
    { query: "project", href: "/projects" },
    { query: "dash", href: "/dashboard" },
    { query: "automat", href: "/automation" },
    { query: "intelligence", href: "/executive-intelligence" },
    { query: "governance", href: "/enterprise-governance-platform" },
    { query: "engine", href: "/delivery-engine" },
    { query: "success", href: "/client-success" },
    { query: "center", href: "/security-center" },
    // Exact prefix beats substring matches: "operations" opens Operations Center.
    { query: "operations", href: "/operations-center" },
    { query: "readiness", href: "/production-readiness" },
    { query: "hospital", href: "/hospital" },
    { query: "retail", href: "/retail" },
    // Case / whitespace normalization.
    { query: "  Dashboard  ", href: "/dashboard", match: "EXACT" },
    { query: "FINANCE", href: "/finance", match: "EXACT" },
    { query: "Executive   AI", href: "/executive-ai", match: "EXACT" },
];

const NEGATIVES = ["", "   ", "xyzzyplugh", "!!!", "zzz", "qwertyuiop", "http://evil.test"];

const ACCURACY_THRESHOLD = 0.95;

describe("command routing evals (production nav)", () => {
    it("resolves every dataset case to the intended module", () => {
        const failures: string[] = [];
        for (const c of CASES) {
            const result = resolveCommand(c.query, shellNavigation);
            if (!result || result.item.href !== c.href) {
                failures.push(`'${c.query}' -> ${result ? `${result.item.href} (${result.matchType})` : "null"}, want ${c.href}`);
            } else if (c.match && result.matchType !== c.match) {
                failures.push(`'${c.query}' matched ${result.matchType}, want ${c.match}`);
            }
        }
        expect(failures).toEqual([]);
    });

    it("rejects empty, nonsense, and non-navigation input", () => {
        for (const query of NEGATIVES) {
            expect(resolveCommand(query, shellNavigation)).toBeNull();
        }
    });

    it("meets the routing accuracy threshold", () => {
        let correct = 0;
        for (const c of CASES) {
            const result = resolveCommand(c.query, shellNavigation);
            if (result && result.item.href === c.href) correct += 1;
        }
        const accuracy = correct / CASES.length;
        expect(accuracy).toBeGreaterThanOrEqual(ACCURACY_THRESHOLD);
    });
});
