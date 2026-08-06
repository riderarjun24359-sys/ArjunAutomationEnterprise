import type { FinanceExecutiveWidgets } from "../types/os";

export function toExecutiveFinanceWidgets(widgets: FinanceExecutiveWidgets | null) {
    return {
        module: "billing-finance-os" as const,
        widgets,
    };
}
