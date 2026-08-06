import type { ExecutiveHrWidgets } from "../types/os";

export function toExecutiveHrWidgets(widgets: ExecutiveHrWidgets | null) {
    return {
        module: "hrms-workforce-os" as const,
        widgets,
    };
}
