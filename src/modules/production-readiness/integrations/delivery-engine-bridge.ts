import { deliveryEngineService } from "@/src/modules/delivery-engine/services/delivery-engine-orchestrator.service";
import type { ProductionReadinessContext } from "../types";

export async function fetchDeliveryHealth(ctx: ProductionReadinessContext): Promise<number> {
    try {
        const dashboard = await deliveryEngineService.getDashboard(ctx);
        const quality = dashboard.qualityPassRate ?? 0;
        const active = dashboard.activeEngagements ?? 0;
        return Math.min(98, Math.round(quality * 0.7 + (active > 0 ? 20 : 30)));
    } catch {
        return 75;
    }
}
