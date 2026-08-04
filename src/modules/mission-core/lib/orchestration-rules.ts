import { MISSION_CORE_RULES } from "../constants";
import type { OrchestrationRule } from "../types";

export const ORCHESTRATION_RULES: OrchestrationRule[] = MISSION_CORE_RULES;

export function validateNoDirectCapabilityCall(from: string, to: string): void {
    if (from === to) return;
    if (from === "mission-core" || to === "mission-core") return;

    const rule = ORCHESTRATION_RULES.find((r) => r.id === "no-direct-capability-call");
    if (rule?.enforced) {
        throw new Error(
            `Orchestration rule violated: direct capability-to-capability call from "${from}" to "${to}" is forbidden. Route through Mission Core.`,
        );
    }
}

export function isDirectCapabilityCall(from: string, to: string): boolean {
    if (from === to || from === "mission-core" || to === "mission-core") return false;
    return true;
}
