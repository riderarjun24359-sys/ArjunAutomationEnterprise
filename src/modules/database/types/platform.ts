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

export interface DbRolePermissionGrant {
    id: string;
    role_id: string;
    permission_id: string;
    action: string;
    created_at: string;
}

export interface DbTaxRate {
    id: string;
    organization_id: string;
    name: string;
    rate_percent: number;
    is_default: boolean;
    created_at: string;
    updated_at: string;
}

export interface DbEstimate {
    id: string;
    organization_id: string;
    client_id?: string | null;
    project_id?: string | null;
    number: string;
    status: string;
    issue_date: string;
    valid_until?: string | null;
    subtotal: number;
    tax_amount: number;
    total: number;
    currency: string;
    notes: string;
    created_at: string;
    updated_at: string;
}

export interface DbEstimateLineItem {
    id: string;
    estimate_id: string;
    description: string;
    quantity: number;
    unit_price: number;
    tax_rate_id?: string | null;
    amount: number;
    sort_order: number;
    created_at: string;
}

export interface DbInvoice {
    id: string;
    organization_id: string;
    client_id?: string | null;
    project_id?: string | null;
    estimate_id?: string | null;
    number: string;
    status: string;
    issue_date: string;
    due_date?: string | null;
    paid_at?: string | null;
    subtotal: number;
    tax_amount: number;
    total: number;
    amount_paid: number;
    currency: string;
    notes: string;
    created_at: string;
    updated_at: string;
}

export interface DbInvoiceLineItem {
    id: string;
    invoice_id: string;
    description: string;
    quantity: number;
    unit_price: number;
    tax_rate_id?: string | null;
    amount: number;
    sort_order: number;
    created_at: string;
}

export interface DbPayment {
    id: string;
    organization_id: string;
    invoice_id: string;
    client_id?: string | null;
    amount: number;
    payment_date: string;
    method: string;
    reference: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbExpense {
    id: string;
    organization_id: string;
    project_id?: string | null;
    client_id?: string | null;
    category: string;
    description: string;
    amount: number;
    expense_date: string;
    status: string;
    submitted_by: string;
    created_at: string;
    updated_at: string;
}

export interface DbRecurringInvoice {
    id: string;
    organization_id: string;
    client_id: string;
    project_id?: string | null;
    title: string;
    frequency: string;
    next_run_date: string;
    end_date?: string | null;
    subtotal: number;
    tax_amount: number;
    total: number;
    currency: string;
    is_active: boolean;
    notes: string;
    created_at: string;
    updated_at: string;
}

export interface DbAiAgent {
    id: string;
    organization_id: string;
    name: string;
    description: string;
    model: string;
    system_prompt: string;
    status: string;
    temperature: number;
    max_tokens: number;
    config: Record<string, unknown>;
    created_at: string;
    updated_at: string;
}

export interface DbWorkflowTemplate {
    id: string;
    organization_id: string;
    name: string;
    description: string;
    category: string;
    definition: Record<string, unknown>;
    is_public: boolean;
    created_at: string;
    updated_at: string;
}

export interface DbWorkflow {
    id: string;
    organization_id: string;
    template_id?: string | null;
    agent_id?: string | null;
    name: string;
    description: string;
    status: string;
    version: number;
    created_at: string;
    updated_at: string;
}

export interface DbWorkflowTrigger {
    id: string;
    workflow_id: string;
    trigger_type: string;
    event_name: string;
    config: Record<string, unknown>;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface DbWorkflowAction {
    id: string;
    workflow_id: string;
    step_order: number;
    action_type: string;
    config: Record<string, unknown>;
    agent_id?: string | null;
    created_at: string;
    updated_at: string;
}

export interface DbWorkflowCondition {
    id: string;
    workflow_id: string;
    step_order: number;
    field: string;
    operator: string;
    value: string;
    logic_group: string;
    created_at: string;
}

export interface DbWorkflowSchedule {
    id: string;
    workflow_id: string;
    cron_expression: string;
    timezone: string;
    next_run_at?: string | null;
    last_run_at?: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface DbWorkflowExecution {
    id: string;
    organization_id: string;
    workflow_id: string;
    status: string;
    trigger_type: string;
    started_at: string;
    completed_at?: string | null;
    duration_ms: number;
    result: Record<string, unknown>;
    error_message: string;
    created_at: string;
}

export interface DbAutomationLog {
    id: string;
    organization_id: string;
    workflow_id?: string | null;
    execution_id?: string | null;
    level: string;
    message: string;
    metadata: Record<string, unknown>;
    created_at: string;
}

export interface DbAnalyticsDashboard {
    id: string;
    organization_id: string;
    name: string;
    description: string;
    is_default: boolean;
    layout: Record<string, unknown>;
    created_at: string;
    updated_at: string;
}

export interface DbAnalyticsWidget {
    id: string;
    dashboard_id: string;
    title: string;
    widget_type: string;
    metric_key: string;
    chart_type: string;
    config: Record<string, unknown>;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

export interface DbAnalyticsMetric {
    id: string;
    organization_id: string;
    metric_key: string;
    label: string;
    category: string;
    value: number;
    unit: string;
    period_start?: string | null;
    period_end?: string | null;
    metadata: Record<string, unknown>;
    created_at: string;
    updated_at: string;
}

export interface DbAnalyticsReport {
    id: string;
    organization_id: string;
    name: string;
    report_type: string;
    status: string;
    filters: Record<string, unknown>;
    summary: Record<string, unknown>;
    generated_at?: string | null;
    created_at: string;
    updated_at: string;
}

export interface DbOrganizationSettings {
    id: string;
    organization_id: string;
    timezone: string;
    currency: string;
    fiscal_year_start: string;
    contact_email: string;
    billing_address: string;
    support_phone: string;
    feature_flags: Record<string, unknown>;
    created_at: string;
    updated_at: string;
}

export interface DbOrganizationBranding {
    id: string;
    organization_id: string;
    logo_url: string;
    favicon_url: string;
    primary_color: string;
    secondary_color: string;
    accent_color: string;
    custom_domain: string;
    email_header_html: string;
    created_at: string;
    updated_at: string;
}

export interface DbOrganizationPreferences {
    id: string;
    organization_id: string;
    default_locale: string;
    default_timezone: string;
    week_starts_on: string;
    date_format: string;
    time_format: string;
    created_at: string;
    updated_at: string;
}

export interface DbOrganizationSecurityPolicy {
    id: string;
    organization_id: string;
    mfa_required: boolean;
    session_timeout_minutes: number;
    password_min_length: number;
    ip_allowlist: unknown[];
    login_attempt_limit: number;
    created_at: string;
    updated_at: string;
}

export interface DbTeam {
    id: string;
    organization_id: string;
    name: string;
    slug: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export interface DbTeamMember {
    id: string;
    team_id: string;
    user_id: string;
    role_name: string;
    created_at: string;
}

export interface DbOrganizationInvitation {
    id: string;
    organization_id: string;
    email: string;
    role_name: string;
    status: string;
    invited_by?: string | null;
    expires_at: string;
    created_at: string;
    updated_at: string;
}

export interface DbUserPreferences {
    id: string;
    user_id: string;
    organization_id?: string | null;
    theme: string;
    locale: string;
    timezone: string;
    date_format: string;
    digest_frequency: string;
    created_at: string;
    updated_at: string;
}

export interface DbAuditConfig {
    id: string;
    organization_id: string;
    retention_days: number;
    enabled_events: string[];
    export_format: string;
    alert_threshold: number;
    created_at: string;
    updated_at: string;
}

export interface DbApiKey {
    id: string;
    organization_id: string;
    name: string;
    key_prefix: string;
    key_hash: string;
    scopes: unknown[];
    status: string;
    expires_at?: string | null;
    last_used_at?: string | null;
    created_by?: string | null;
    created_at: string;
    updated_at: string;
}

export interface DbNotificationPreference {
    id: string;
    organization_id: string;
    user_id?: string | null;
    channel: string;
    event_type: string;
    enabled: boolean;
    created_at: string;
    updated_at: string;
}

export interface DbBackupConfig {
    id: string;
    organization_id: string;
    name: string;
    schedule_cron: string;
    destination: string;
    retention_count: number;
    include_tables: unknown[];
    is_enabled: boolean;
    created_at: string;
    updated_at: string;
}

export interface DbBackupRun {
    id: string;
    config_id: string;
    status: string;
    started_at: string;
    completed_at?: string | null;
    size_bytes: number;
    storage_path: string;
    error_message: string;
    created_at: string;
}
