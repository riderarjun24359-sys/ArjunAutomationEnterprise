import { resolveNavigationContext } from "./navigation-context-engine";
import { ShellNavigationItem } from "./types";
import { LayoutDashboard, Settings, Activity } from "lucide-react";
import { ROUTES } from "@/src/constants/routes";

const mockItem = (href: string, label: string): ShellNavigationItem => ({
    label, href, description: "", icon: LayoutDashboard, section: "primary"
});

const mockNav = [
    mockItem(ROUTES.dashboard, "Dashboard"),
    mockItem(ROUTES.platformOperations, "Operations"),
    mockItem(ROUTES.workflowEngine, "Workflows"),
    mockItem(ROUTES.automation, "Automation"),
    mockItem(ROUTES.settings, "Settings"),
];

describe("NavigationContextEngine", () => {
    it("should resolve persistent zone items correctly", () => {
        const input = {
            currentPath: ROUTES.dashboard,
            authorizedNavigation: mockNav,
            explicitRelationships: {},
            snapshot: { runningAutomations: 0, pendingApprovals: 0, criticalRisks: 0 }
        };
        const output = resolveNavigationContext(input);
        expect(output.persistent.map(i => i.href)).toContain(ROUTES.dashboard);
    });

    it("should resolve contextual items based on relationships and actionable state", () => {
        const input = {
            currentPath: ROUTES.dashboard,
            authorizedNavigation: mockNav,
            explicitRelationships: { [ROUTES.dashboard]: [ROUTES.settings] },
            snapshot: { runningAutomations: 1, pendingApprovals: 0, criticalRisks: 0 }
        };
        const output = resolveNavigationContext(input);
        const contextualHrefs = output.contextual.map(i => i.href);
        expect(contextualHrefs).toContain(ROUTES.settings); // From relationship
        expect(contextualHrefs).toContain(ROUTES.automation); // From actionable snapshot
    });
});
