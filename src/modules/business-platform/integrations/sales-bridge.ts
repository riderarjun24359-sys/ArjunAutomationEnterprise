import { salesService } from "@/src/modules/sales/services/sales.service";
import type { LeadSummary, OpportunitySummary, QuoteSummary } from "@/src/modules/sales/types";

export async function fetchLeads(authUserId: string, email: string, fullName?: string | null): Promise<LeadSummary[]> {
    return salesService.getLeads(authUserId, email, fullName);
}

export async function fetchOpportunities(authUserId: string, email: string, fullName?: string | null): Promise<OpportunitySummary[]> {
    return salesService.getOpportunities(authUserId, email, fullName);
}

export async function fetchQuotes(authUserId: string, email: string, fullName?: string | null): Promise<QuoteSummary[]> {
    return salesService.getQuotes(authUserId, email, fullName);
}

export async function fetchSalesStats(authUserId: string, email: string, fullName?: string | null) {
    return salesService.getDashboardStats(authUserId, email, fullName);
}

export async function createLead(
    authUserId: string,
    email: string,
    input: { leadName: string; companyName: string; email: string; phone?: string; source?: string },
    fullName?: string | null,
) {
    return salesService.createLead(authUserId, email, { ...input, phone: input.phone ?? "", source: input.source ?? "inbound" }, fullName);
}
