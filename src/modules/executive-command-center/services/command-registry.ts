import { ROUTES } from "@/src/constants/routes";
import type { ExecutiveCommand } from "../types";

export const executiveCommands: ExecutiveCommand[] = [
    { id: "nav-dashboard", label: "Open Executive Command Center", detail: "Unified executive intelligence dashboard", category: "navigation", keywords: ["dashboard", "executive", "command center", "home"], href: ROUTES.dashboard },
    { id: "nav-business-platform", label: "Open Business Platform", detail: "Client lifecycle operating platform", category: "navigation", keywords: ["business", "platform", "lifecycle", "clients"], href: ROUTES.businessPlatform },
    { id: "nav-crm", label: "Open CRM", detail: "Client and revenue operations", category: "navigation", keywords: ["crm", "clients", "sales"], href: ROUTES.crm },
    { id: "nav-projects", label: "Open Projects", detail: "Delivery and execution", category: "navigation", keywords: ["projects", "delivery"], href: ROUTES.projects },
    { id: "nav-tasks", label: "Open Tasks", detail: "Operational task execution", category: "navigation", keywords: ["tasks", "todo", "assign"], href: ROUTES.tasks },
    { id: "nav-finance", label: "Open Finance", detail: "Invoices and revenue", category: "navigation", keywords: ["finance", "invoices", "billing", "overdue"], href: ROUTES.finance },
    { id: "nav-eip", label: "Open Enterprise Intelligence", detail: "EIP KPI and forecast engine", category: "navigation", keywords: ["eip", "intelligence", "kpi", "forecast"], href: ROUTES.enterpriseIntelligencePlatform },
    { id: "nav-aix", label: "Open Executive Intelligence", detail: "AIX briefs and recommendations", category: "navigation", keywords: ["aix", "executive", "brief", "copilot"], href: ROUTES.executiveIntelligence },
    { id: "action-create-proposal", label: "Create proposal", detail: "Start a new client proposal", category: "action", keywords: ["create proposal", "proposal", "new proposal", "quote"], href: ROUTES.businessPlatform },
    { id: "action-find-delayed-projects", label: "Find delayed projects", detail: "Show projects with schedule risk", category: "query", keywords: ["delayed projects", "late projects", "schedule risk", "behind schedule"], href: `${ROUTES.projects}?filter=delayed` },
    { id: "action-overdue-invoices", label: "Show overdue invoices", detail: "Open finance with outstanding billing", category: "query", keywords: ["overdue invoices", "unpaid", "billing overdue"], href: ROUTES.finance },
    { id: "action-open-client", label: "Open clients", detail: "Navigate to client records", category: "query", keywords: ["open client", "find client", "clients"], href: ROUTES.clients },
    { id: "action-assign-task", label: "Assign task", detail: "Go to tasks for assignment", category: "action", keywords: ["assign task", "create task", "new task"], href: ROUTES.tasks },
    { id: "action-create-meeting", label: "Create meeting / consultation", detail: "Schedule a client consultation", category: "action", keywords: ["create meeting", "schedule meeting", "consultation"], href: ROUTES.businessPlatform },
    { id: "action-security-review", label: "Security review", detail: "Open security center", category: "action", keywords: ["security", "audit", "permissions"], href: ROUTES.securityCenter, requiresApproval: true },
];

const NL_PATTERNS: Array<{ pattern: RegExp; commandId: string }> = [
    { pattern: /create\s+proposal/i, commandId: "action-create-proposal" },
    { pattern: /(delayed|late|behind)\s+projects?/i, commandId: "action-find-delayed-projects" },
    { pattern: /overdue\s+invoices?/i, commandId: "action-overdue-invoices" },
    { pattern: /open\s+client/i, commandId: "action-open-client" },
    { pattern: /assign\s+task/i, commandId: "action-assign-task" },
    { pattern: /(create|schedule)\s+(meeting|consultation)/i, commandId: "action-create-meeting" },
    { pattern: /show\s+(my\s+)?tasks?/i, commandId: "nav-tasks" },
    { pattern: /executive\s+(dashboard|command)/i, commandId: "nav-dashboard" },
];

export function parseNaturalLanguageCommand(query: string): ExecutiveCommand | null {
    const trimmed = query.trim();
    if (!trimmed) return null;

    for (const { pattern, commandId } of NL_PATTERNS) {
        if (pattern.test(trimmed)) {
            return executiveCommands.find((c) => c.id === commandId) ?? null;
        }
    }

    const lower = trimmed.toLowerCase();
    return (
        executiveCommands.find((cmd) =>
            cmd.keywords.some((kw) => lower.includes(kw)) || cmd.label.toLowerCase().includes(lower),
        ) ?? null
    );
}

export function searchCommands(query: string, limit = 12): ExecutiveCommand[] {
    const lower = query.trim().toLowerCase();
    if (!lower) return executiveCommands.slice(0, limit);

    const nlMatch = parseNaturalLanguageCommand(query);
    const scored = executiveCommands
        .map((cmd) => {
            let score = 0;
            if (cmd.label.toLowerCase().includes(lower)) score += 10;
            if (cmd.detail.toLowerCase().includes(lower)) score += 5;
            for (const kw of cmd.keywords) {
                if (kw.includes(lower) || lower.includes(kw)) score += 8;
            }
            return { cmd, score };
        })
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score);

    const results = scored.map((x) => x.cmd);
    if (nlMatch && !results.find((r) => r.id === nlMatch.id)) {
        results.unshift(nlMatch);
    }
    return results.slice(0, limit);
}
