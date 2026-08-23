import { resolveCommand } from "./command-resolver";
import { ShellNavigationItem } from "@/src/config/shell-navigation";
import { LayoutDashboard, Wallet, Bot } from "lucide-react";

const mockNav: ShellNavigationItem[] = [
    { label: "Dashboard", href: "/dashboard", description: "", icon: LayoutDashboard, section: "primary" },
    { label: "Finance", href: "/finance", description: "", icon: Wallet, section: "secondary" },
    { label: "Automation", href: "/automation", description: "", icon: Bot, section: "secondary" },
];

describe("CommandResolver", () => {
    it("should resolve exact match", () => {
        const result = resolveCommand("Dashboard", mockNav);
        expect(result?.item.label).toBe("Dashboard");
        expect(result?.matchType).toBe("EXACT");
    });

    it("should resolve alias match", () => {
        const result = resolveCommand("revenue", mockNav);
        expect(result?.item.label).toBe("Finance");
        expect(result?.matchType).toBe("ALIAS");
    });

    it("should resolve prefix match", () => {
        const result = resolveCommand("Auto", mockNav);
        expect(result?.item.label).toBe("Automation");
        expect(result?.matchType).toBe("PREFIX");
    });

    it("should return null for no match", () => {
        const result = resolveCommand("invalid", mockNav);
        expect(result).toBeNull();
    });
});
