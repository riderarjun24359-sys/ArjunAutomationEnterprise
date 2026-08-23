export interface CustomerPulse {
    activeCustomers: number;
    openOpportunitiesValue: number;
    activeSuccessCases: number;
    pendingTasks: number;
}

export interface CustomerRelationship {
    recentOpportunities: unknown[];
    overdueActions: unknown[];
}

export interface CustomerOSSnapshot {
    organizationId: string | null;
    fetchedAt: string;
    pulse: CustomerPulse;
    relationship: CustomerRelationship;
    intelligence: unknown[];
}
