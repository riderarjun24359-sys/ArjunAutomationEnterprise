/** @deprecated Use @/src/modules/executive-ai — backward-compatible re-exports */
export {
    ExecutiveAiPage as ExecutiveAiEcosystemPage,
    ExecutiveAiDashboardPanel as ExecutiveAiDashboard,
    executiveAiService as executiveAiEcosystemService,
    useExecutiveAi as useExecutiveAiEcosystem,
    EXECUTIVE_AI_THEME as EXECUTIVE_AI_ECOSYSTEM_THEME,
    EXECUTIVE_AGENTS,
    EXECUTIVE_AI_STORAGE_KEY as EXECUTIVE_AI_ECOSYSTEM_STORAGE_KEY,
} from "@/src/modules/executive-ai";

export type { ExecutiveAiData as ExecutiveAiEcosystemData } from "@/src/modules/executive-ai/executive-ai-hooks";
export type { ExecutiveAiDashboard as ExecutiveAiEcosystemDashboard } from "@/src/modules/executive-ai/types";
