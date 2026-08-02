export interface DbCompany {
    id: string;
    organization_id: string;
    name: string;
    industry?: string | null;
    website?: string | null;
    phone?: string | null;
    address?: string | null;
    description?: string | null;
    created_at: string;
    updated_at: string;
}

export interface DbContact {
    id: string;
    organization_id: string;
    company_id?: string | null;
    first_name: string;
    last_name?: string | null;
    email?: string | null;
    phone?: string | null;
    title?: string | null;
    created_at: string;
    updated_at: string;
}

export interface DbClient {
    id: string;
    organization_id: string;
    company_id?: string | null;
    primary_contact_id?: string | null;
    name: string;
    status: string;
    industry: string;
    contact_email: string;
    manager_name: string;
    revenue: string;
    phone?: string | null;
    website?: string | null;
    address?: string | null;
    description?: string | null;
    lifecycle_stage: string;
    lead_score?: number | null;
    deal_value?: string | null;
    assigned_to?: string | null;
    created_at: string;
    updated_at: string;
}

export interface DbProject {
    id: string;
    organization_id: string;
    client_id?: string | null;
    name: string;
    status: string;
    priority: string;
    progress: number;
    budget: string;
    timeline: string;
    owner_name: string;
    owner_id?: string | null;
    description: string;
    template: string;
    client_name: string;
    team_size: number;
    created_at: string;
    updated_at: string;
}

export interface DbProjectMember {
    id: string;
    project_id: string;
    user_id?: string | null;
    name: string;
    role: string;
    capacity: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbProjectMilestone {
    id: string;
    project_id: string;
    title: string;
    due_date?: string | null;
    status: string;
    progress: number;
    created_at: string;
    updated_at: string;
}

export interface DbProjectTimeEntry {
    id: string;
    project_id: string;
    project_name: string;
    started_at: string;
    duration: string;
    status: string;
    created_at: string;
}

export interface DbProjectFile {
    id: string;
    project_id: string;
    name: string;
    folder: string;
    version: string;
    updated_at: string;
    created_at: string;
}

export interface DbProjectComment {
    id: string;
    project_id: string;
    author: string;
    body: string;
    mentions?: string[] | null;
    attachments?: string[] | null;
    created_at: string;
}

export interface DbTask {
    id: string;
    organization_id: string;
    project_id?: string | null;
    title: string;
    description: string;
    status: string;
    priority: string;
    assignee_id?: string | null;
    assignee_name?: string | null;
    due_date?: string | null;
    estimated_hours?: number | null;
    completed_hours?: number | null;
    tags?: string[] | null;
    created_at: string;
    updated_at: string;
}

export interface DbTaskLabel {
    id: string;
    organization_id: string;
    name: string;
    color: string;
    created_at: string;
}

export interface DbActivityLog {
    id: string;
    organization_id: string;
    user_id?: string | null;
    entity_type: string;
    entity_id?: string | null;
    action: string;
    title: string;
    detail: string;
    metadata?: Record<string, unknown> | null;
    created_at: string;
}

export interface DbRole {
    id: string;
    organization_id?: string | null;
    name: string;
    description?: string | null;
    is_system: boolean;
    created_at: string;
    updated_at: string;
}

export interface DbPermission {
    id: string;
    key: string;
    description?: string | null;
    resource?: string | null;
    created_at: string;
    updated_at: string;
}
