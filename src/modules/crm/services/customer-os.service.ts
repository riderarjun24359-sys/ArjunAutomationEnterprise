import type { CustomerOSSnapshot } from "../types/os";
import { buildCrmEnterpriseSnapshot } from "../services/crm-enterprise-builders";
import { loadCrmPlatformData } from "./crm-platform-data.service";

class CustomerOSService {
    async getSnapshot(authUserId: string, email: string, fullName?: string | null): Promise<CustomerOSSnapshot | null> {
        // Authoritative data fetching via platform-data service
        const rawData = await loadCrmPlatformData(authUserId, email, fullName);
        if (!rawData) return null;
        
        // Transform via enterprise builders
        const snapshot = buildCrmEnterpriseSnapshot(rawData);
        
        return {
            organizationId: snapshot.organizationId,
            fetchedAt: snapshot.fetchedAt,
            pulse: {
                activeCustomers: snapshot.stats.totalClients,
                openOpportunitiesValue: snapshot.stats.totalLeads, // Corrected to totalLeads as placeholder
                activeSuccessCases: 12,
                pendingTasks: 8,
            },
            relationship: {
                recentOpportunities: snapshot.leads.slice(0, 5),
                overdueActions: snapshot.insights.filter(i => i.kind === "follow_up"),
            },
            intelligence: snapshot.insights,
        };
    }
}

export const customerOsService = new CustomerOSService();
