import { deliveryEngineService } from "@/src/modules/delivery-engine/services/delivery-engine-orchestrator.service";
import type { ProductionReadinessContext } from "../types";

export async function fetchDeliveryHealth(ctx: ProductionReadinessContext): Promise<number> {
    const dashboard = await deliveryEngineService.getDashboard(ctx);
    return dashboard.qualityPassRate;
}
