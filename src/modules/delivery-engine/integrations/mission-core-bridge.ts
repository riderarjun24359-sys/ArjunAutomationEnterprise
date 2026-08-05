import { lazyMissionCoreClient } from "@/src/modules/mission-core/sdk/lazy-mission-core-client";

export function publishDeliveryEvent(type: string, payload: Record<string, unknown>) {
    lazyMissionCoreClient().publishEvent({ type, source: "deliveryEngine", payload });
}

export async function initializeProjectViaMissionCore(payload: Record<string, unknown>) {
    publishDeliveryEvent("DeliveryEngagementStarted", payload);
    return { initialized: true, ...payload };
}

export async function trackDeliveryHandover(clientId: string) {
    publishDeliveryEvent("DeliveryHandover", { clientId, stage: "support" });
    return { tracked: true, clientId };
}
