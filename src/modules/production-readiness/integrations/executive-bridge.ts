import { executiveCommandCenterService } from "@/src/modules/executive-command-center/services/executive-command-center.service";
import type { ProductionReadinessContext } from "../types";

export async function fetchAiHealth(ctx: ProductionReadinessContext): Promise<number> {
    try {
        const snapshot = await executiveCommandCenterService.getSnapshot(ctx.authUserId, ctx.email, ctx.fullName);
        return Math.min(98, snapshot.unifiedScore);
    } catch {
        return 80;
    }
}

export async function fetchExecutiveRiskScore(ctx: ProductionReadinessContext): Promise<number> {
    try {
        const snapshot = await executiveCommandCenterService.getSnapshot(ctx.authUserId, ctx.email, ctx.fullName);
        return Math.max(0, Math.min(100, snapshot.risks.filter((r) => r.severity !== "low").length * 12));
    } catch {
        return 15;
    }
}
