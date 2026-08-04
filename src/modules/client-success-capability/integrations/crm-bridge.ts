import { crmService } from "@/src/modules/crm/services/crm.service";
import type { ClientDetail, ClientSummary, DealSummary } from "@/src/modules/crm/types";

export async function fetchClients(
    authUserId: string,
    email: string,
    fullName?: string | null,
): Promise<ClientSummary[]> {
    return crmService.getClients(authUserId, email, fullName);
}

export async function fetchClientDetail(
    authUserId: string,
    email: string,
    clientId: string,
    fullName?: string | null,
): Promise<ClientDetail | undefined> {
    return crmService.getClient(authUserId, email, clientId, fullName);
}

export async function fetchDeals(
    authUserId: string,
    email: string,
    fullName?: string | null,
): Promise<DealSummary[]> {
    return crmService.getDeals(authUserId, email, fullName);
}

export { crmService };
