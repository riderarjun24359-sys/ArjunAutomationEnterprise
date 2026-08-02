export type { ClientStatus, ClientIndustry } from "@/src/modules/crm/types";

export interface ClientSummary {
    id: string;
    name: string;
    status: import("@/src/modules/crm/types").ClientStatus;
    industry: import("@/src/modules/crm/types").ClientIndustry;
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
    lifecycleStage: string;
    assignedTo: string;
    companyId: string | null;
    primaryContactId: string | null;
    createdAt: string;
}

export interface ClientProjectSummary {
    id: string;
    name: string;
    status: string;
    progress: number;
    budget: string;
    timeline: string;
    owner: string;
}

export interface ClientContactSummary {
    id: string;
    name: string;
    email: string;
    phone: string;
    title: string;
}

export interface ClientActivitySummary {
    id: string;
    action: string;
    title: string;
    detail: string;
    timestamp: string;
}

export interface ClientDashboardStats {
    totalClients: number;
    activeClients: number;
    atRiskClients: number;
    inactiveClients: number;
    linkedProjects: number;
    totalRevenue: string;
}

export interface CreateClientInput {
    name: string;
    status: import("@/src/modules/crm/types").ClientStatus;
    industry: import("@/src/modules/crm/types").ClientIndustry;
    contactEmail: string;
    manager: string;
    revenue: string;
    phone?: string;
    website?: string;
    address?: string;
    description?: string;
}

export interface UpdateClientInput {
    name?: string;
    status?: import("@/src/modules/crm/types").ClientStatus;
    industry?: import("@/src/modules/crm/types").ClientIndustry;
    contactEmail?: string;
    manager?: string;
    revenue?: string;
    phone?: string;
    website?: string;
    address?: string;
    description?: string;
}

export type ClientStatusFilter = "all" | import("@/src/modules/crm/types").ClientStatus;
