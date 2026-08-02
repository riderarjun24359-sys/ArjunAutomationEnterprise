export type ClientStatus = "lead" | "active" | "inactive" | "at_risk";
export type ClientIndustry = "saas" | "manufacturing" | "healthcare" | "retail" | "finance" | "education";
export type LeadStage = "new" | "qualified" | "proposal" | "negotiation" | "won" | "lost";
export type DealStage = "discovery" | "qualified" | "proposal" | "negotiation" | "closed_won" | "closed_lost";
export type ActivityType = "call" | "meeting" | "note" | "email" | "follow_up";
export type TaskPriority = "low" | "medium" | "high";
export type TaskStatus = "pending" | "in_progress" | "completed";

export interface ClientSummary {
  id: string;
  name: string;
  status: ClientStatus;
  industry: ClientIndustry;
  contactEmail: string;
  manager: string;
  revenue: string;
  updatedAt: string;
}

export interface ClientDetail extends ClientSummary {
  phone: string;
  website: string;
  address: string;
  description: string;
}

export interface LeadSummary {
  id: string;
  company: string;
  contact: string;
  stage: LeadStage;
  score: number;
  value: string;
  assignedTo: string;
}

export interface DealSummary {
  id: string;
  client: string;
  value: string;
  closeDate: string;
  stage: DealStage;
  probability: number;
  revenueMetric: string;
}

export interface ActivitySummary {
  id: string;
  type: ActivityType;
  title: string;
  detail: string;
  dueAt: string;
}

export interface TaskSummary {
  id: string;
  title: string;
  assignee: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
}

export interface CrmDashboardStats {
  totalClients: number;
  activeDeals: number;
  monthlyRevenue: string;
  newLeads: number;
  conversionRate: string;
  recentActivities: ActivitySummary[];
}
