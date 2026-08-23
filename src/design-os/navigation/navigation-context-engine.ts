import { NavContextInput, NavContextOutput, NavContextItem } from "./types";
import { ROUTES } from "@/src/constants/routes";

export function resolveNavigationContext(input: NavContextInput): NavContextOutput {
    const { currentPath, authorizedNavigation, explicitRelationships, snapshot } = input;

    // 1. Persistent Zone (Stable global destinations)
    const persistentHrefs: string[] = [ROUTES.dashboard];
    const persistent = authorizedNavigation.filter((item) => persistentHrefs.includes(item.href));

    // 2. Resolve Context Zone
    // Map of hrefs to reasons
    const contextualReasons: Record<string, string> = {};
    
    // Explicit relationships
    const relatedHrefs = explicitRelationships[currentPath] || [];
    relatedHrefs.forEach(href => {
        contextualReasons[href] = "Related to active module";
    });
    
    // Actionable states
    if (snapshot.criticalRisks > 0 && !contextualReasons[ROUTES.platformOperations]) {
        contextualReasons[ROUTES.platformOperations] = "Critical risk detected";
    }
    if (snapshot.pendingApprovals > 0 && !contextualReasons[ROUTES.workflowEngine]) {
        contextualReasons[ROUTES.workflowEngine] = "Pending approval";
    }
    if (snapshot.runningAutomations > 0 && !contextualReasons[ROUTES.automation]) {
        contextualReasons[ROUTES.automation] = "Active automation";
    }

    const contextualHrefs = Object.keys(contextualReasons);
    
    const contextual: NavContextItem[] = authorizedNavigation
        .filter((item) => contextualHrefs.includes(item.href) && !persistentHrefs.includes(item.href))
        .map(item => ({ ...item, reason: contextualReasons[item.href] }));

    // 3. Library Zone
    const library = authorizedNavigation.filter((item) => 
        !persistentHrefs.includes(item.href) && 
        !contextualHrefs.includes(item.href) // Deduplication
    );

    return {
        persistent,
        contextual,
        library,
    };
}
