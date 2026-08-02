import type { ActivitySummary, ClientDetail, ClientSummary, CrmDashboardStats, DealSummary, LeadSummary, TaskSummary } from "@/src/modules/crm/types";

const clients: ClientSummary[] = [
  {
    id: "client-1",
    name: "Northstar Labs",
    status: "active",
    industry: "saas",
    contactEmail: "ops@northstarlabs.com",
    manager: "Mina Park",
    revenue: "$248k",
    updatedAt: "2h ago",
  },
  {
    id: "client-2",
    name: "Apex Commerce",
    status: "at_risk",
    industry: "retail",
    contactEmail: "vp@apexcommerce.com",
    manager: "Drew Hsu",
    revenue: "$96k",
    updatedAt: "1d ago",
  },
];

const clientDetails: Record<string, ClientDetail> = {
  "client-1": {
    id: "client-1",
    name: "Northstar Labs",
    status: "active",
    industry: "saas",
    contactEmail: "ops@northstarlabs.com",
    manager: "Mina Park",
    revenue: "$248k",
    updatedAt: "2h ago",
    phone: "+1 415 555 0148",
    website: "https://northstarlabs.com",
    address: "450 Market Street, San Francisco, CA",
    description: "Series B SaaS company focused on workflow automation.",
  },
  "client-2": {
    id: "client-2",
    name: "Apex Commerce",
    status: "at_risk",
    industry: "retail",
    contactEmail: "vp@apexcommerce.com",
    manager: "Drew Hsu",
    revenue: "$96k",
    updatedAt: "1d ago",
    phone: "+1 212 555 0149",
    website: "https://apexcommerce.com",
    address: "21 Mercer Street, New York, NY",
    description: "Omnichannel retail group expanding into B2B services.",
  },
};

const leads: LeadSummary[] = [
  { id: "lead-1", company: "Helio Health", contact: "Sara Kim", stage: "qualified", score: 82, value: "$48k", assignedTo: "Lina Ortiz" },
  { id: "lead-2", company: "Summit Retail", contact: "Tom Reed", stage: "proposal", score: 71, value: "$67k", assignedTo: "Jordan Lee" },
];

const deals: DealSummary[] = [
  { id: "deal-1", client: "Northstar Labs", value: "$124k", closeDate: "2026-08-28", stage: "negotiation", probability: 74, revenueMetric: "+$18k ARR" },
  { id: "deal-2", client: "Apex Commerce", value: "$84k", closeDate: "2026-09-14", stage: "proposal", probability: 61, revenueMetric: "+$12k ARR" },
];

const activities: ActivitySummary[] = [
  { id: "activity-1", type: "call", title: "Discovery call completed", detail: "Discussed implementation timeline", dueAt: "10 mins ago" },
  { id: "activity-2", type: "meeting", title: "Executive review", detail: "Shared revenue projection", dueAt: "1 hr ago" },
  { id: "activity-3", type: "email", title: "Proposal sent", detail: "Follow-up scheduled for Friday", dueAt: "Today" },
];

const tasks: TaskSummary[] = [
  { id: "task-1", title: "Prepare onboarding checklist", assignee: "Mina Park", dueDate: "2026-08-04", priority: "high", status: "pending" },
  { id: "task-2", title: "Review contract terms", assignee: "Drew Hsu", dueDate: "2026-08-06", priority: "medium", status: "in_progress" },
];

const dashboardStats: CrmDashboardStats = {
  totalClients: 24,
  activeDeals: 8,
  monthlyRevenue: "$312k",
  newLeads: 16,
  conversionRate: "68%",
  recentActivities: activities,
};

export class CrmService {
  async getClients(): Promise<ClientSummary[]> {
    return clients;
  }

  async getClient(id: string): Promise<ClientDetail | undefined> {
    return clientDetails[id];
  }

  async getLeads(): Promise<LeadSummary[]> {
    return leads;
  }

  async getDeals(): Promise<DealSummary[]> {
    return deals;
  }

  async getActivities(): Promise<ActivitySummary[]> {
    return activities;
  }

  async getTasks(): Promise<TaskSummary[]> {
    return tasks;
  }

  async getDashboardStats(): Promise<CrmDashboardStats> {
    return dashboardStats;
  }
}

export const crmService = new CrmService();
