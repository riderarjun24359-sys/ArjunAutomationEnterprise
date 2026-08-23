import { ShellNavigationItem } from "@/src/config/shell-navigation";

export type MatchType = "EXACT" | "ALIAS" | "PREFIX" | "CONTAINS" | "NONE";

export interface CommandResolution {
    item: ShellNavigationItem;
    matchType: MatchType;
}

const ALIASES: Record<string, string[]> = {
    "/dashboard": ["home", "executive"],
    "/automation": ["workflows", "agents"],
    "/finance": ["billing", "revenue", "costs"],
};

export function normalizeQuery(query: string): string {
    return query.toLowerCase().trim().replace(/\s+/g, " ");
}

export function resolveCommand(
    query: string,
    authorizedNavigation: ShellNavigationItem[]
): CommandResolution | null {
    const normalizedQuery = normalizeQuery(query);
    if (!normalizedQuery) return null;

    for (const item of authorizedNavigation) {
        const label = normalizeQuery(item.label);
        const aliases = ALIASES[item.href] || [];

        // 1. Exact Match
        if (label === normalizedQuery) return { item, matchType: "EXACT" };

        // 2. Alias Match
        if (aliases.some(alias => normalizeQuery(alias) === normalizedQuery)) {
            return { item, matchType: "ALIAS" };
        }
    }

    for (const item of authorizedNavigation) {
        const label = normalizeQuery(item.label);

        // 3. Prefix Match
        if (label.startsWith(normalizedQuery)) return { item, matchType: "PREFIX" };
        
        // 4. Contains Match
        if (label.includes(normalizedQuery)) return { item, matchType: "CONTAINS" };
    }

    return null;
}
