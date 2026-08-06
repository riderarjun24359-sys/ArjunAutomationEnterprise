import type {
    DbActivityLog,
    DbClient,
    DbCsAdoptionTracking,
    DbCsChurnPrediction,
    DbCsEngagement,
    DbCsExpansionOpportunity,
    DbCsHealthScore,
    DbCsOnboardingWorkflow,
    DbCsQbrReport,
    DbCsRenewalPlan,
    DbCsRiskAnalysis,
    DbInvoice,
    DbPayment,
    DbProject,
    DbSalesMeeting,
    DbSupportTicket,
    DbTask,
} from "@/src/modules/database/types/platform";

export interface CustomerSuccessRawData {
    organizationId: string;
    clients: DbClient[];
    engagements: DbCsEngagement[];
    healthScores: DbCsHealthScore[];
    adoption: DbCsAdoptionTracking[];
    onboarding: DbCsOnboardingWorkflow[];
    renewals: DbCsRenewalPlan[];
    expansions: DbCsExpansionOpportunity[];
    risks: DbCsRiskAnalysis[];
    churn: DbCsChurnPrediction[];
    qbrReports: DbCsQbrReport[];
    projects: DbProject[];
    tasks: DbTask[];
    invoices: DbInvoice[];
    payments: DbPayment[];
    supportTickets: DbSupportTicket[];
    meetings: DbSalesMeeting[];
    activities: DbActivityLog[];
    fetchedAt: string;
}
