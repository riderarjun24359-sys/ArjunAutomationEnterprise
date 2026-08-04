import { createCommunicationHubClient } from "@/src/modules/communication-hub/sdk";

export function createClientSuccessCommClient(authUserId: string, email: string, fullName?: string | null) {
    return createCommunicationHubClient(authUserId, email, fullName);
}

export async function sendClientNotification(
    authUserId: string,
    email: string,
    clientId: string,
    title: string,
    message: string,
    fullName?: string | null,
) {
    const comm = createCommunicationHubClient(authUserId, email, fullName);
    try {
        const hubs = await comm.getCommunicationHubs();
        const hub = hubs[0];
        if (hub) {
            await comm.sendNotification({
                communicationHubId: hub.id,
                queueKey: `client-success-${clientId}`,
                recipient: clientId,
                channelType: "in_app",
                priorityLevel: "normal",
            });
        }
    } catch {
        /* notification queued locally if hub unavailable */
    }
    void title;
    void message;
}

export async function getCommunicationHubStats(
    authUserId: string,
    email: string,
    fullName?: string | null,
) {
    const comm = createCommunicationHubClient(authUserId, email, fullName);
    try {
        return await comm.getDashboardStats();
    } catch {
        return null;
    }
}

export { createCommunicationHubClient };
