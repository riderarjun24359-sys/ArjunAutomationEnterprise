import type { ExecutiveIntegrationWidgets } from "../types/os";

export function toExecutiveIntegrationWidgets(widgets: ExecutiveIntegrationWidgets | null) {
    return {
        module: "integration-hub-os" as const,
        widgets,
    };
}
