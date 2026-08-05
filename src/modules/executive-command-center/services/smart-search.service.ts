import { shellNavigation } from "@/src/config/shell-navigation";
import { searchCommands } from "./command-registry";
import type { ExecutiveCommandCenterSnapshot, SmartSearchResult } from "../types";

export function buildStaticSearchIndex(): SmartSearchResult[] {
    const navResults: SmartSearchResult[] = shellNavigation.map((item) => ({
        id: `nav-${item.href}`,
        label: item.label,
        detail: item.description,
        category: "navigation",
        href: item.href,
        keywords: [item.label.toLowerCase(), item.description.toLowerCase(), item.href.replace("/", "")],
    }));

    const commandResults: SmartSearchResult[] = searchCommands("", 50).map((cmd) => ({
        id: cmd.id,
        label: cmd.label,
        detail: cmd.detail,
        category: cmd.category === "navigation" ? "navigation" : "action",
        href: cmd.href,
        keywords: cmd.keywords,
    }));

    const knowledgeResults: SmartSearchResult[] = [
        { id: "knowledge-brand", label: "Brand standards", detail: "Arjun Automation brand identity and guidelines", category: "knowledge", href: "/brand-os", keywords: ["brand", "standards", "identity"] },
        { id: "knowledge-design", label: "Design OS", detail: "UI/UX engineering standards", category: "knowledge", href: "/design-os", keywords: ["design", "ui", "ux", "components"] },
        { id: "knowledge-ai-foundation", label: "AI Foundation", detail: "Governed AI layer documentation", category: "knowledge", href: "/ai-foundation", keywords: ["ai", "agents", "prompts"] },
    ];

    return [...navResults, ...commandResults, ...knowledgeResults];
}

export function searchEverything(query: string, snapshot?: ExecutiveCommandCenterSnapshot | null, limit = 16): SmartSearchResult[] {
    const lower = query.trim().toLowerCase();
    const staticIndex = buildStaticSearchIndex();
    if (!lower) return staticIndex.slice(0, limit);

    const dynamic: SmartSearchResult[] = [];
    if (snapshot) {
        for (const item of snapshot.attentionToday.slice(0, 3)) {
            dynamic.push({
                id: item.id,
                label: item.title,
                detail: item.detail,
                category: "ai",
                href: item.actionHref,
                keywords: [item.title.toLowerCase(), item.module],
            });
        }
        for (const rec of snapshot.recommendations.slice(0, 3)) {
            dynamic.push({
                id: rec.id,
                label: rec.title,
                detail: rec.detail,
                category: "ai",
                keywords: [rec.title.toLowerCase(), "recommendation", "ai suggestion"],
            });
        }
    }

    const all = [...staticIndex, ...dynamic];
    const scored = all
        .map((item) => {
            let score = 0;
            if (item.label.toLowerCase().includes(lower)) score += 10;
            if (item.detail.toLowerCase().includes(lower)) score += 4;
            if (item.keywords.some((k) => k.includes(lower) || lower.includes(k))) score += 8;
            if (item.category === "ai" && (lower.includes("ai") || lower.includes("suggest"))) score += 5;
            return { item, score };
        })
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score);

    return scored.map((x) => x.item).slice(0, limit);
}
