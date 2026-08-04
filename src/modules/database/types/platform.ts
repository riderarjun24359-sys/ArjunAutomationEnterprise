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

export interface DbDepartment {
    id: string;
    organization_id: string;
    name: string;
    code: string;
    parent_department_id?: string | null;
    head_employee_id?: string | null;
    description: string;
    created_at: string;
    updated_at: string;
}

export interface DbDesignation {
    id: string;
    organization_id: string;
    title: string;
    level: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export interface DbEmployee {
    id: string;
    organization_id: string;
    employee_code: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    department_id?: string | null;
    designation_id?: string | null;
    manager_id?: string | null;
    profile_id?: string | null;
    status: string;
    employment_type: string;
    hire_date: string;
    base_salary: number;
    created_at: string;
    updated_at: string;
}

export interface DbHrTeam {
    id: string;
    organization_id: string;
    name: string;
    slug: string;
    department_id?: string | null;
    lead_employee_id?: string | null;
    description: string;
    created_at: string;
    updated_at: string;
}

export interface DbHrTeamMember {
    id: string;
    team_id: string;
    employee_id: string;
    role_name: string;
    created_at: string;
}

export interface DbAttendanceRecord {
    id: string;
    organization_id: string;
    employee_id: string;
    work_date: string;
    check_in?: string | null;
    check_out?: string | null;
    status: string;
    notes: string;
    created_at: string;
    updated_at: string;
}

export interface DbLeaveType {
    id: string;
    organization_id: string;
    name: string;
    code: string;
    annual_quota: number;
    paid: boolean;
    created_at: string;
    updated_at: string;
}

export interface DbLeaveRequest {
    id: string;
    organization_id: string;
    employee_id: string;
    leave_type_id: string;
    start_date: string;
    end_date: string;
    status: string;
    reason: string;
    created_at: string;
    updated_at: string;
}

export interface DbHoliday {
    id: string;
    organization_id: string;
    name: string;
    holiday_date: string;
    region: string;
    created_at: string;
    updated_at: string;
}

export interface DbPayrollCycle {
    id: string;
    organization_id: string;
    name: string;
    period_start: string;
    period_end: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbPayrollEntry {
    id: string;
    cycle_id: string;
    employee_id: string;
    base_salary: number;
    allowances: number;
    deductions: number;
    net_pay: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbEmployeeDocument {
    id: string;
    organization_id: string;
    employee_id: string;
    title: string;
    document_type: string;
    file_url: string;
    uploaded_at: string;
    created_at: string;
    updated_at: string;
}

export interface DbPerformanceReview {
    id: string;
    organization_id: string;
    employee_id: string;
    reviewer_id?: string | null;
    review_period: string;
    rating: number;
    summary: string;
    status: string;
    reviewed_at?: string | null;
    created_at: string;
    updated_at: string;
}

export interface DbJobOpening {
    id: string;
    organization_id: string;
    title: string;
    department_id?: string | null;
    designation_id?: string | null;
    status: string;
    description: string;
    opened_at: string;
    created_at: string;
    updated_at: string;
}

export interface DbJobCandidate {
    id: string;
    opening_id: string;
    full_name: string;
    email: string;
    stage: string;
    applied_at: string;
    notes: string;
    created_at: string;
    updated_at: string;
}

export interface DbOnboardingPlan {
    id: string;
    organization_id: string;
    employee_id: string;
    status: string;
    start_date: string;
    created_at: string;
    updated_at: string;
}

export interface DbOnboardingTask {
    id: string;
    plan_id: string;
    title: string;
    status: string;
    due_date?: string | null;
    completed_at?: string | null;
    created_at: string;
    updated_at: string;
}

export interface DbOffboardingPlan {
    id: string;
    organization_id: string;
    employee_id: string;
    status: string;
    last_working_date: string;
    created_at: string;
    updated_at: string;
}

export interface DbOffboardingTask {
    id: string;
    plan_id: string;
    title: string;
    status: string;
    due_date?: string | null;
    completed_at?: string | null;
    created_at: string;
    updated_at: string;
}

export interface DbOrgChartNode {
    id: string;
    organization_id: string;
    employee_id: string;
    department_id?: string | null;
    parent_node_id?: string | null;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

export interface DbProductCategory {
    id: string;
    organization_id: string;
    name: string;
    slug: string;
    description: string;
    parent_category_id?: string | null;
    created_at: string;
    updated_at: string;
}

export interface DbProduct {
    id: string;
    organization_id: string;
    category_id?: string | null;
    sku: string;
    name: string;
    description: string;
    unit_of_measure: string;
    unit_cost: number;
    unit_price: number;
    reorder_level: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbWarehouse {
    id: string;
    organization_id: string;
    name: string;
    code: string;
    location: string;
    manager_name: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbStockLevel {
    id: string;
    organization_id: string;
    product_id: string;
    warehouse_id: string;
    quantity: number;
    reserved_quantity: number;
    created_at: string;
    updated_at: string;
}

export interface DbSupplier {
    id: string;
    organization_id: string;
    name: string;
    code: string;
    email: string;
    phone: string;
    address: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbStockMovement {
    id: string;
    organization_id: string;
    product_id: string;
    warehouse_id: string;
    movement_type: string;
    quantity: number;
    reference_type: string;
    reference_id?: string | null;
    project_id?: string | null;
    notes: string;
    moved_at: string;
    created_at: string;
}

export interface DbInventoryAdjustment {
    id: string;
    organization_id: string;
    product_id: string;
    warehouse_id: string;
    adjustment_type: string;
    quantity_delta: number;
    reason: string;
    adjusted_by?: string | null;
    created_at: string;
}

export interface DbPurchaseOrder {
    id: string;
    organization_id: string;
    supplier_id: string;
    po_number: string;
    status: string;
    order_date: string;
    expected_date?: string | null;
    total_amount: number;
    expense_id?: string | null;
    notes: string;
    created_at: string;
    updated_at: string;
}

export interface DbPurchaseOrderItem {
    id: string;
    purchase_order_id: string;
    product_id: string;
    quantity: number;
    unit_cost: number;
    line_total: number;
    created_at: string;
}

export interface DbAsset {
    id: string;
    organization_id: string;
    asset_tag: string;
    name: string;
    category: string;
    serial_number: string;
    purchase_cost: number;
    status: string;
    warehouse_id?: string | null;
    project_id?: string | null;
    employee_id?: string | null;
    acquired_date: string;
    created_at: string;
    updated_at: string;
}

export interface DbProductBarcode {
    id: string;
    organization_id: string;
    product_id?: string | null;
    asset_id?: string | null;
    barcode_value: string;
    barcode_type: string;
    created_at: string;
}

export interface DbLowStockAlert {
    id: string;
    organization_id: string;
    product_id: string;
    warehouse_id: string;
    current_quantity: number;
    reorder_level: number;
    status: string;
    triggered_at: string;
    resolved_at?: string | null;
    created_at: string;
}

export interface DbStockTransfer {
    id: string;
    organization_id: string;
    transfer_number: string;
    source_warehouse_id: string;
    destination_warehouse_id: string;
    status: string;
    notes: string;
    transferred_at?: string | null;
    created_at: string;
    updated_at: string;
}

export interface DbStockTransferItem {
    id: string;
    transfer_id: string;
    product_id: string;
    quantity: number;
    created_at: string;
}

export interface DbGoodsReceivedNote {
    id: string;
    organization_id: string;
    grn_number: string;
    purchase_order_id?: string | null;
    warehouse_id: string;
    supplier_id?: string | null;
    status: string;
    received_date: string;
    notes: string;
    created_at: string;
    updated_at: string;
}

export interface DbGrnItem {
    id: string;
    grn_id: string;
    product_id: string;
    quantity_received: number;
    unit_cost: number;
    created_at: string;
}

export interface DbInventoryValuation {
    id: string;
    organization_id: string;
    valuation_date: string;
    method: string;
    total_value: number;
    total_units: number;
    notes: string;
    created_at: string;
}

export interface DbInventoryAuditLog {
    id: string;
    organization_id: string;
    entity_type: string;
    entity_id?: string | null;
    action: string;
    summary: string;
    metadata: Record<string, unknown>;
    performed_by?: string | null;
    created_at: string;
}

export interface DbSupportCategory {
    id: string;
    organization_id: string;
    name: string;
    slug: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export interface DbSupportPriority {
    id: string;
    organization_id: string;
    name: string;
    level: number;
    color: string;
    response_hours: number;
    created_at: string;
    updated_at: string;
}

export interface DbSupportSla {
    id: string;
    organization_id: string;
    name: string;
    priority_id?: string | null;
    first_response_minutes: number;
    resolution_minutes: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface DbSupportQueue {
    id: string;
    organization_id: string;
    name: string;
    code: string;
    description: string;
    default_assignee_id?: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface DbSupportTicket {
    id: string;
    organization_id: string;
    ticket_number: string;
    subject: string;
    description: string;
    status: string;
    category_id?: string | null;
    priority_id?: string | null;
    sla_id?: string | null;
    queue_id?: string | null;
    client_id?: string | null;
    contact_id?: string | null;
    project_id?: string | null;
    assigned_agent_id?: string | null;
    invoice_id?: string | null;
    portal_visible: boolean;
    due_at?: string | null;
    resolved_at?: string | null;
    created_at: string;
    updated_at: string;
}

export interface DbSupportTicketNote {
    id: string;
    organization_id: string;
    ticket_id: string;
    author_id?: string | null;
    body: string;
    is_internal: boolean;
    created_at: string;
}

export interface DbSupportTicketAttachment {
    id: string;
    organization_id: string;
    ticket_id: string;
    file_name: string;
    file_url: string;
    file_size: number;
    mime_type: string;
    uploaded_by?: string | null;
    created_at: string;
}

export interface DbSupportKnowledgeArticle {
    id: string;
    organization_id: string;
    title: string;
    slug: string;
    content: string;
    category_id?: string | null;
    status: string;
    view_count: number;
    created_at: string;
    updated_at: string;
}

export interface DbSupportCannedResponse {
    id: string;
    organization_id: string;
    title: string;
    shortcut: string;
    body: string;
    category_id?: string | null;
    created_at: string;
    updated_at: string;
}

export interface DbSupportEscalationRule {
    id: string;
    organization_id: string;
    name: string;
    trigger_condition: string;
    escalation_level: number;
    target_queue_id?: string | null;
    notify_agent_id?: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface DbSupportSatisfactionRating {
    id: string;
    organization_id: string;
    ticket_id: string;
    rating: number;
    comment: string;
    submitted_at: string;
    created_at: string;
}

export interface DbSupportPortalSettings {
    id: string;
    organization_id: string;
    portal_enabled: boolean;
    welcome_message: string;
    allow_ticket_creation: boolean;
    show_knowledge_base: boolean;
    custom_domain: string;
    created_at: string;
    updated_at: string;
}

export interface DbSupportAuditLog {
    id: string;
    organization_id: string;
    entity_type: string;
    entity_id?: string | null;
    action: string;
    summary: string;
    metadata: Record<string, unknown>;
    performed_by?: string | null;
    created_at: string;
}

export interface DbSalesPipeline {
    id: string;
    organization_id: string;
    name: string;
    code: string;
    description: string;
    is_default: boolean;
    created_at: string;
    updated_at: string;
}

export interface DbSalesPipelineStage {
    id: string;
    organization_id: string;
    pipeline_id: string;
    name: string;
    sort_order: number;
    probability: number;
    is_closed_won: boolean;
    is_closed_lost: boolean;
    created_at: string;
    updated_at: string;
}

export interface DbSalesLead {
    id: string;
    organization_id: string;
    client_id?: string | null;
    lead_name: string;
    company_name: string;
    email: string;
    phone: string;
    source: string;
    status: string;
    score: number;
    assigned_to?: string | null;
    created_at: string;
    updated_at: string;
}

export interface DbSalesOpportunity {
    id: string;
    organization_id: string;
    opportunity_number: string;
    name: string;
    description: string;
    pipeline_id?: string | null;
    stage_id?: string | null;
    client_id?: string | null;
    contact_id?: string | null;
    project_id?: string | null;
    assigned_to?: string | null;
    amount: number;
    probability: number;
    expected_close_date?: string | null;
    status: string;
    won_at?: string | null;
    lost_at?: string | null;
    lost_reason: string;
    estimate_id?: string | null;
    created_at: string;
    updated_at: string;
}

export interface DbSalesQuote {
    id: string;
    organization_id: string;
    quote_number: string;
    opportunity_id?: string | null;
    client_id?: string | null;
    title: string;
    status: string;
    total_amount: number;
    valid_until?: string | null;
    estimate_id?: string | null;
    created_at: string;
    updated_at: string;
}

export interface DbSalesQuoteItem {
    id: string;
    quote_id: string;
    description: string;
    quantity: number;
    unit_price: number;
    line_total: number;
    created_at: string;
}

export interface DbSalesForecast {
    id: string;
    organization_id: string;
    forecast_period: string;
    forecast_date: string;
    pipeline_value: number;
    weighted_value: number;
    closed_value: number;
    notes: string;
    created_at: string;
    updated_at: string;
}

export interface DbSalesActivity {
    id: string;
    organization_id: string;
    opportunity_id?: string | null;
    lead_id?: string | null;
    activity_type: string;
    subject: string;
    description: string;
    due_at?: string | null;
    completed_at?: string | null;
    assigned_to?: string | null;
    created_at: string;
}

export interface DbSalesMeeting {
    id: string;
    organization_id: string;
    opportunity_id?: string | null;
    lead_id?: string | null;
    title: string;
    location: string;
    meeting_url: string;
    scheduled_at: string;
    duration_minutes: number;
    status: string;
    attendee_names: string;
    created_at: string;
    updated_at: string;
}

export interface DbSalesCallLog {
    id: string;
    organization_id: string;
    opportunity_id?: string | null;
    lead_id?: string | null;
    direction: string;
    phone_number: string;
    duration_seconds: number;
    outcome: string;
    notes: string;
    called_at: string;
    created_at: string;
}

export interface DbSalesEmailTracking {
    id: string;
    organization_id: string;
    opportunity_id?: string | null;
    lead_id?: string | null;
    subject: string;
    recipient_email: string;
    status: string;
    sent_at: string;
    opened_at?: string | null;
    clicked_at?: string | null;
    created_at: string;
}

export interface DbSalesTarget {
    id: string;
    organization_id: string;
    employee_id: string;
    period_label: string;
    target_amount: number;
    achieved_amount: number;
    period_start: string;
    period_end: string;
    created_at: string;
    updated_at: string;
}

export interface DbSalesCommission {
    id: string;
    organization_id: string;
    employee_id: string;
    opportunity_id?: string | null;
    commission_rate: number;
    commission_amount: number;
    status: string;
    calculated_at: string;
    created_at: string;
}

export interface DbSalesWinLossRecord {
    id: string;
    organization_id: string;
    opportunity_id: string;
    outcome: string;
    reason: string;
    competitor: string;
    amount: number;
    recorded_at: string;
    created_at: string;
}

export interface DbSalesAuditLog {
    id: string;
    organization_id: string;
    entity_type: string;
    entity_id?: string | null;
    action: string;
    summary: string;
    metadata: Record<string, unknown>;
    performed_by?: string | null;
    created_at: string;
}

export interface DbDocumentFolder {
    id: string;
    organization_id: string;
    parent_folder_id?: string | null;
    name: string;
    slug: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export interface DbDocument {
    id: string;
    organization_id: string;
    folder_id?: string | null;
    title: string;
    file_name: string;
    file_url: string;
    mime_type: string;
    file_size: number;
    status: string;
    current_version: number;
    client_id?: string | null;
    project_id?: string | null;
    employee_id?: string | null;
    invoice_id?: string | null;
    purchase_order_id?: string | null;
    support_ticket_id?: string | null;
    sales_opportunity_id?: string | null;
    uploaded_by?: string | null;
    created_at: string;
    updated_at: string;
}

export interface DbDocumentTag {
    id: string;
    organization_id: string;
    name: string;
    color: string;
    created_at: string;
}

export interface DbDocumentTagLink {
    id: string;
    document_id: string;
    tag_id: string;
    created_at: string;
}

export interface DbDocumentVersion {
    id: string;
    organization_id: string;
    document_id: string;
    version_number: number;
    file_url: string;
    file_size: number;
    change_summary: string;
    created_by?: string | null;
    created_at: string;
}

export interface DbDocumentApproval {
    id: string;
    organization_id: string;
    document_id: string;
    approver_id?: string | null;
    status: string;
    comments: string;
    decided_at?: string | null;
    created_at: string;
    updated_at: string;
}

export interface DbDocumentEsignPreparation {
    id: string;
    organization_id: string;
    document_id: string;
    signer_name: string;
    signer_email: string;
    status: string;
    prepared_at: string;
    sent_at?: string | null;
    created_at: string;
    updated_at: string;
}

export interface DbDocumentShare {
    id: string;
    organization_id: string;
    document_id: string;
    share_token: string;
    recipient_email: string;
    permission_level: string;
    expires_at?: string | null;
    is_active: boolean;
    created_at: string;
}

export interface DbDocumentAccessGrant {
    id: string;
    organization_id: string;
    document_id?: string | null;
    folder_id?: string | null;
    grantee_type: string;
    grantee_id?: string | null;
    permission_level: string;
    created_at: string;
}

export interface DbDocumentTemplate {
    id: string;
    organization_id: string;
    name: string;
    category: string;
    description: string;
    template_content: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDocumentPreview {
    id: string;
    organization_id: string;
    document_id: string;
    preview_type: string;
    preview_url: string;
    page_count: number;
    generated_at: string;
    created_at: string;
}

export interface DbDocumentSearchIndex {
    id: string;
    organization_id: string;
    document_id: string;
    search_text: string;
    indexed_at: string;
    created_at: string;
}

export interface DbDocumentRetentionPolicy {
    id: string;
    organization_id: string;
    name: string;
    retention_days: number;
    action_on_expiry: string;
    applies_to_category: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface DbDocumentArchive {
    id: string;
    organization_id: string;
    document_id: string;
    archived_at: string;
    archived_by?: string | null;
    restore_available: boolean;
    created_at: string;
}

export interface DbDocumentActivityLog {
    id: string;
    organization_id: string;
    document_id?: string | null;
    activity_type: string;
    summary: string;
    performed_by?: string | null;
    created_at: string;
}

export interface DbDocumentAuditLog {
    id: string;
    organization_id: string;
    entity_type: string;
    entity_id?: string | null;
    action: string;
    summary: string;
    metadata: Record<string, unknown>;
    performed_by?: string | null;
    created_at: string;
}

export interface DbAiProvider {
    id: string;
    organization_id: string;
    name: string;
    provider_key: string;
    api_base_url: string;
    status: string;
    is_default: boolean;
    config: Record<string, unknown>;
    created_at: string;
    updated_at: string;
}

export interface DbAiModelRoute {
    id: string;
    organization_id: string;
    name: string;
    provider_id: string;
    model_id: string;
    priority: number;
    routing_strategy: string;
    fallback_provider_id?: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface DbAiOrchestrationAgent {
    id: string;
    organization_id: string;
    name: string;
    agent_type: string;
    workflow_agent_id?: string | null;
    provider_id?: string | null;
    model_route_id?: string | null;
    capabilities: unknown[];
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbAiPromptTemplate {
    id: string;
    organization_id: string;
    name: string;
    template_key: string;
    category: string;
    content: string;
    variables: unknown[];
    version: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbAiSession {
    id: string;
    organization_id: string;
    agent_id?: string | null;
    session_key: string;
    module_source: string;
    entity_type: string;
    entity_id?: string | null;
    context: Record<string, unknown>;
    status: string;
    expires_at?: string | null;
    created_at: string;
    updated_at: string;
}

export interface DbAiTaskExecution {
    id: string;
    organization_id: string;
    agent_id?: string | null;
    session_id?: string | null;
    provider_id?: string | null;
    task_type: string;
    input_payload: Record<string, unknown>;
    output_payload: Record<string, unknown>;
    status: string;
    model_used: string;
    tokens_used: number;
    duration_ms: number;
    error_message: string;
    started_at: string;
    completed_at?: string | null;
    created_at: string;
}

export interface DbAiUsageRecord {
    id: string;
    organization_id: string;
    provider_id?: string | null;
    agent_id?: string | null;
    task_execution_id?: string | null;
    tokens_input: number;
    tokens_output: number;
    request_count: number;
    recorded_at: string;
    created_at: string;
}

export interface DbAiCostRecord {
    id: string;
    organization_id: string;
    provider_id?: string | null;
    usage_record_id?: string | null;
    cost_usd: number;
    pricing_model: string;
    recorded_at: string;
    created_at: string;
}

export interface DbAiRateLimit {
    id: string;
    organization_id: string;
    scope_type: string;
    scope_id?: string | null;
    requests_per_minute: number;
    tokens_per_day: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface DbAiPermissionGrant {
    id: string;
    organization_id: string;
    grantee_type: string;
    grantee_id?: string | null;
    permission_key: string;
    resource_type: string;
    resource_id?: string | null;
    is_active: boolean;
    created_at: string;
}

export interface DbAiProviderHealthCheck {
    id: string;
    organization_id: string;
    provider_id: string;
    status: string;
    latency_ms: number;
    error_message: string;
    last_checked_at: string;
    created_at: string;
}

export interface DbAiRetryPolicy {
    id: string;
    organization_id: string;
    name: string;
    max_retries: number;
    backoff_strategy: string;
    fallback_route_id?: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface DbAiOrchestrationAuditLog {
    id: string;
    organization_id: string;
    entity_type: string;
    entity_id?: string | null;
    action: string;
    summary: string;
    metadata: Record<string, unknown>;
    performed_by?: string | null;
    created_at: string;
}

export interface DbAiOrchestrationAnalytics {
    id: string;
    organization_id: string;
    metric_key: string;
    metric_value: number;
    dimensions: Record<string, unknown>;
    period_start: string;
    period_end: string;
    computed_at: string;
    created_at: string;
}

export interface DbKnowledgeEntry {
    id: string;
    organization_id: string;
    title: string;
    slug: string;
    content: string;
    category: string;
    status: string;
    tags: unknown[];
    client_id?: string | null;
    project_id?: string | null;
    employee_id?: string | null;
    ai_session_id?: string | null;
    current_version: number;
    created_by?: string | null;
    created_at: string;
    updated_at: string;
}

export interface DbKnowledgeSemanticIndex {
    id: string;
    organization_id: string;
    entry_id: string;
    embedding_key: string;
    search_text: string;
    indexed_at: string;
    created_at: string;
}

export interface DbKnowledgeSolution {
    id: string;
    organization_id: string;
    name: string;
    problem_statement: string;
    solution_summary: string;
    implementation_notes: string;
    category: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbKnowledgeAdr {
    id: string;
    organization_id: string;
    adr_number: number;
    title: string;
    status: string;
    context: string;
    decision: string;
    consequences: string;
    created_at: string;
    updated_at: string;
}

export interface DbKnowledgePromptBase {
    id: string;
    organization_id: string;
    name: string;
    prompt_key: string;
    category: string;
    content: string;
    use_cases: unknown[];
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbKnowledgeProjectMemory {
    id: string;
    organization_id: string;
    project_id: string;
    memory_key: string;
    summary: string;
    details: string;
    context: Record<string, unknown>;
    created_at: string;
    updated_at: string;
}

export interface DbKnowledgeClientMemory {
    id: string;
    organization_id: string;
    client_id: string;
    memory_key: string;
    summary: string;
    details: string;
    context: Record<string, unknown>;
    created_at: string;
    updated_at: string;
}

export interface DbKnowledgeComponent {
    id: string;
    organization_id: string;
    name: string;
    component_type: string;
    description: string;
    usage_guidelines: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbKnowledgePattern {
    id: string;
    organization_id: string;
    name: string;
    pattern_type: string;
    description: string;
    when_to_use: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbKnowledgeDocumentation {
    id: string;
    organization_id: string;
    title: string;
    doc_key: string;
    module_source: string;
    content: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbKnowledgeAiContext {
    id: string;
    organization_id: string;
    context_key: string;
    agent_id?: string | null;
    session_id?: string | null;
    entry_id?: string | null;
    context_payload: Record<string, unknown>;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbKnowledgeVersion {
    id: string;
    organization_id: string;
    entry_id: string;
    version_number: number;
    content: string;
    change_summary: string;
    created_at: string;
}

export interface DbKnowledgeAnalytics {
    id: string;
    organization_id: string;
    metric_key: string;
    metric_value: number;
    dimensions: Record<string, unknown>;
    period_start: string;
    period_end: string;
    computed_at: string;
    created_at: string;
}

export interface DbKnowledgePermission {
    id: string;
    organization_id: string;
    grantee_type: string;
    grantee_id?: string | null;
    permission_key: string;
    resource_type: string;
    resource_id?: string | null;
    is_active: boolean;
    created_at: string;
}

export interface DbKnowledgeCrossLink {
    id: string;
    organization_id: string;
    source_module: string;
    source_entity_type: string;
    source_entity_id?: string | null;
    entry_id?: string | null;
    link_type: string;
    created_at: string;
}

export interface DbKnowledgeAuditLog {
    id: string;
    organization_id: string;
    entity_type: string;
    entity_id?: string | null;
    action: string;
    summary: string;
    metadata: Record<string, unknown>;
    performed_by?: string | null;
    created_at: string;
}

export interface DbBaEngagement {
    id: string;
    organization_id: string;
    title: string;
    engagement_key: string;
    client_id?: string | null;
    project_id?: string | null;
    agent_id?: string | null;
    session_id?: string | null;
    knowledge_context_id?: string | null;
    pipeline_stage: string;
    status: string;
    summary: string;
    created_at: string;
    updated_at: string;
}

export interface DbBaInterview {
    id: string;
    organization_id: string;
    engagement_id: string;
    interview_key: string;
    stakeholder_name: string;
    questions: unknown[];
    responses: unknown[];
    status: string;
    conducted_at?: string | null;
    created_at: string;
    updated_at: string;
}

export interface DbBaBrd {
    id: string;
    organization_id: string;
    engagement_id: string;
    title: string;
    executive_summary: string;
    business_objectives: string;
    scope_overview: string;
    content: string;
    status: string;
    current_version: number;
    created_at: string;
    updated_at: string;
}

export interface DbBaFrsDocument {
    id: string;
    organization_id: string;
    engagement_id: string;
    brd_id?: string | null;
    title: string;
    functional_requirements: string;
    non_functional_requirements: string;
    content: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBaUserStory {
    id: string;
    organization_id: string;
    engagement_id: string;
    frs_id?: string | null;
    story_key: string;
    title: string;
    description: string;
    persona: string;
    priority: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBaAcceptanceCriterion {
    id: string;
    organization_id: string;
    user_story_id: string;
    criterion_key: string;
    description: string;
    test_scenario: string;
    status: string;
    created_at: string;
}

export interface DbBaProcessMap {
    id: string;
    organization_id: string;
    engagement_id: string;
    name: string;
    process_type: string;
    steps: unknown[];
    description: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBaGapAnalysis {
    id: string;
    organization_id: string;
    engagement_id: string;
    current_state: string;
    desired_state: string;
    gaps: unknown[];
    recommendations: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBaFeaturePriority {
    id: string;
    organization_id: string;
    engagement_id: string;
    feature_name: string;
    priority_score: number;
    priority_rank: number;
    rationale: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBaRisk {
    id: string;
    organization_id: string;
    engagement_id: string;
    risk_key: string;
    title: string;
    description: string;
    likelihood: string;
    impact: string;
    mitigation: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBaStakeholder {
    id: string;
    organization_id: string;
    engagement_id: string;
    name: string;
    role: string;
    influence: string;
    interest: string;
    contact_info: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBaScopeItem {
    id: string;
    organization_id: string;
    engagement_id: string;
    item_key: string;
    title: string;
    scope_type: string;
    description: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBaProposal {
    id: string;
    organization_id: string;
    engagement_id: string;
    title: string;
    executive_summary: string;
    deliverables: string;
    content: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBaCostEstimate {
    id: string;
    organization_id: string;
    engagement_id: string;
    estimate_key: string;
    line_items: unknown[];
    total_amount: number;
    currency: string;
    assumptions: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBaTimelineEstimate {
    id: string;
    organization_id: string;
    engagement_id: string;
    estimate_key: string;
    phases: unknown[];
    total_duration_days: number;
    assumptions: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBaRequirementVersion {
    id: string;
    organization_id: string;
    engagement_id: string;
    entity_type: string;
    entity_id: string;
    version_number: number;
    content: string;
    change_summary: string;
    created_at: string;
}

export interface DbBaReviewApproval {
    id: string;
    organization_id: string;
    engagement_id: string;
    entity_type: string;
    entity_id?: string | null;
    reviewer_id?: string | null;
    approval_status: string;
    comments: string;
    reviewed_at?: string | null;
    created_at: string;
}

export interface DbBaAuditLog {
    id: string;
    organization_id: string;
    entity_type: string;
    entity_id?: string | null;
    action: string;
    summary: string;
    metadata: Record<string, unknown>;
    performed_by?: string | null;
    created_at: string;
}

export interface DbSaEngagement {
    id: string;
    organization_id: string;
    title: string;
    engagement_key: string;
    ba_engagement_id?: string | null;
    brd_id?: string | null;
    frs_id?: string | null;
    client_id?: string | null;
    project_id?: string | null;
    agent_id?: string | null;
    session_id?: string | null;
    knowledge_context_id?: string | null;
    pipeline_stage: string;
    status: string;
    summary: string;
    created_at: string;
    updated_at: string;
}

export interface DbSaSolutionArchitecture {
    id: string;
    organization_id: string;
    engagement_id: string;
    title: string;
    architecture_type: string;
    overview: string;
    components: unknown[];
    content: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSaSystemDecomposition {
    id: string;
    organization_id: string;
    engagement_id: string;
    name: string;
    decomposition_key: string;
    layers: unknown[];
    description: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSaDomainModel {
    id: string;
    organization_id: string;
    engagement_id: string;
    name: string;
    model_key: string;
    entities: unknown[];
    relationships: unknown[];
    description: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSaDatabaseSchema {
    id: string;
    organization_id: string;
    engagement_id: string;
    name: string;
    schema_key: string;
    tables: unknown[];
    relationships: unknown[];
    migration_notes: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSaApiContract {
    id: string;
    organization_id: string;
    engagement_id: string;
    name: string;
    contract_key: string;
    endpoints: unknown[];
    openapi_spec: string;
    version: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSaModuleSelection {
    id: string;
    organization_id: string;
    engagement_id: string;
    module_name: string;
    module_key: string;
    platform_module: string;
    selection_rationale: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSaBuildReuseRecommendation {
    id: string;
    organization_id: string;
    engagement_id: string;
    item_key: string;
    component_name: string;
    recommendation: string;
    rationale: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSaIntegrationPlan {
    id: string;
    organization_id: string;
    engagement_id: string;
    name: string;
    plan_key: string;
    integrations: unknown[];
    data_flow: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSaSecurityArchitecture {
    id: string;
    organization_id: string;
    engagement_id: string;
    name: string;
    security_key: string;
    auth_model: string;
    encryption: string;
    controls: unknown[];
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSaScalabilityPlan {
    id: string;
    organization_id: string;
    engagement_id: string;
    name: string;
    plan_key: string;
    scaling_strategy: string;
    targets: unknown[];
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSaPerformancePlan {
    id: string;
    organization_id: string;
    engagement_id: string;
    name: string;
    plan_key: string;
    performance_targets: unknown[];
    optimization_notes: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSaTechnologyDecision {
    id: string;
    organization_id: string;
    engagement_id: string;
    decision_key: string;
    title: string;
    context: string;
    decision: string;
    consequences: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSaDeploymentArchitecture {
    id: string;
    organization_id: string;
    engagement_id: string;
    name: string;
    deployment_key: string;
    environments: unknown[];
    infrastructure: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSaSprintPlan {
    id: string;
    organization_id: string;
    engagement_id: string;
    plan_key: string;
    name: string;
    sprints: unknown[];
    total_sprints: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSaDependencyAnalysis {
    id: string;
    organization_id: string;
    engagement_id: string;
    analysis_key: string;
    dependencies: unknown[];
    critical_path: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSaArchitectureReview {
    id: string;
    organization_id: string;
    engagement_id: string;
    entity_type: string;
    entity_id?: string | null;
    reviewer_id?: string | null;
    review_status: string;
    comments: string;
    reviewed_at?: string | null;
    created_at: string;
}

export interface DbSaArchitectureVersion {
    id: string;
    organization_id: string;
    engagement_id: string;
    entity_type: string;
    entity_id: string;
    version_number: number;
    content: string;
    change_summary: string;
    created_at: string;
}

export interface DbSaAuditLog {
    id: string;
    organization_id: string;
    entity_type: string;
    entity_id?: string | null;
    action: string;
    summary: string;
    metadata: Record<string, unknown>;
    performed_by?: string | null;
    created_at: string;
}

export interface DbDfEngagement {
    id: string;
    organization_id: string;
    title: string;
    engagement_key: string;
    ba_engagement_id?: string | null;
    sa_engagement_id?: string | null;
    brd_id?: string | null;
    frs_id?: string | null;
    solution_architecture_id?: string | null;
    client_id?: string | null;
    project_id?: string | null;
    agent_id?: string | null;
    session_id?: string | null;
    knowledge_context_id?: string | null;
    pipeline_stage: string;
    status: string;
    summary: string;
    created_at: string;
    updated_at: string;
}

export interface DbDfWorkPackage {
    id: string;
    organization_id: string;
    engagement_id: string;
    package_key: string;
    title: string;
    description: string;
    deliverables: unknown[];
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDfBackendWorkflow {
    id: string;
    organization_id: string;
    engagement_id: string;
    workflow_key: string;
    name: string;
    steps: unknown[];
    target_modules: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDfFrontendWorkflow {
    id: string;
    organization_id: string;
    engagement_id: string;
    workflow_key: string;
    name: string;
    steps: unknown[];
    target_modules: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDfApiScaffold {
    id: string;
    organization_id: string;
    engagement_id: string;
    scaffold_key: string;
    name: string;
    endpoints: unknown[];
    scaffold_spec: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDfMigrationPlan {
    id: string;
    organization_id: string;
    engagement_id: string;
    plan_key: string;
    name: string;
    migrations: unknown[];
    rollback_notes: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDfRepositoryStructure {
    id: string;
    organization_id: string;
    engagement_id: string;
    repo_key: string;
    name: string;
    repo_type: string;
    structure: unknown[];
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDfComponent {
    id: string;
    organization_id: string;
    engagement_id: string;
    component_key: string;
    name: string;
    component_type: string;
    specification: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDfTestScaffold {
    id: string;
    organization_id: string;
    engagement_id: string;
    scaffold_key: string;
    name: string;
    test_type: string;
    test_cases: unknown[];
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDfCodingStandard {
    id: string;
    organization_id: string;
    engagement_id: string;
    standard_key: string;
    name: string;
    rules: unknown[];
    enforcement_level: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDfSecureCodingValidation {
    id: string;
    organization_id: string;
    engagement_id: string;
    validation_key: string;
    name: string;
    checks: unknown[];
    findings: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDfModuleRecommendation {
    id: string;
    organization_id: string;
    engagement_id: string;
    recommendation_key: string;
    module_name: string;
    platform_module: string;
    rationale: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDfPullRequest {
    id: string;
    organization_id: string;
    engagement_id: string;
    pr_key: string;
    title: string;
    description: string;
    changed_files: unknown[];
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDfCodeReview {
    id: string;
    organization_id: string;
    engagement_id: string;
    review_key: string;
    title: string;
    checklist: unknown[];
    reviewer_id?: string | null;
    review_status: string;
    comments: string;
    created_at: string;
    updated_at: string;
}

export interface DbDfTechnicalDoc {
    id: string;
    organization_id: string;
    engagement_id: string;
    doc_key: string;
    title: string;
    doc_type: string;
    content: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDfProgressTracking {
    id: string;
    organization_id: string;
    engagement_id: string;
    tracking_key: string;
    milestone: string;
    progress_percent: number;
    notes: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDfBuildArtifact {
    id: string;
    organization_id: string;
    engagement_id: string;
    artifact_key: string;
    name: string;
    artifact_type: string;
    artifact_path: string;
    metadata: Record<string, unknown>;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDfVersion {
    id: string;
    organization_id: string;
    engagement_id: string;
    entity_type: string;
    entity_id: string;
    version_number: number;
    content: string;
    change_summary: string;
    created_at: string;
}

export interface DbDfAuditLog {
    id: string;
    organization_id: string;
    entity_type: string;
    entity_id?: string | null;
    action: string;
    summary: string;
    metadata: Record<string, unknown>;
    performed_by?: string | null;
    created_at: string;
}

export interface DbQaEngagement {
    id: string;
    organization_id: string;
    title: string;
    engagement_key: string;
    ba_engagement_id?: string | null;
    sa_engagement_id?: string | null;
    df_engagement_id?: string | null;
    brd_id?: string | null;
    frs_id?: string | null;
    solution_architecture_id?: string | null;
    work_package_id?: string | null;
    client_id?: string | null;
    project_id?: string | null;
    agent_id?: string | null;
    session_id?: string | null;
    knowledge_context_id?: string | null;
    pipeline_stage: string;
    status: string;
    summary: string;
    created_at: string;
    updated_at: string;
}

export interface DbQaTestStrategy {
    id: string;
    organization_id: string;
    engagement_id: string;
    strategy_key: string;
    title: string;
    scope: string;
    approach: string;
    test_levels: unknown[];
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbQaUnitTestPlan {
    id: string;
    organization_id: string;
    engagement_id: string;
    plan_key: string;
    name: string;
    target_modules: string;
    test_cases: unknown[];
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbQaIntegrationTestPlan {
    id: string;
    organization_id: string;
    engagement_id: string;
    plan_key: string;
    name: string;
    integration_points: unknown[];
    test_scenarios: unknown[];
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbQaE2eTestPlan {
    id: string;
    organization_id: string;
    engagement_id: string;
    plan_key: string;
    name: string;
    user_journeys: unknown[];
    test_scenarios: unknown[];
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbQaRegressionAnalysis {
    id: string;
    organization_id: string;
    engagement_id: string;
    analysis_key: string;
    name: string;
    affected_areas: unknown[];
    regression_risks: string;
    recommendations: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbQaRiskBasedTest {
    id: string;
    organization_id: string;
    engagement_id: string;
    test_key: string;
    name: string;
    risk_level: string;
    risk_factors: unknown[];
    test_priority: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbQaSecurityValidation {
    id: string;
    organization_id: string;
    engagement_id: string;
    validation_key: string;
    name: string;
    security_checks: unknown[];
    findings: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbQaPerformanceValidation {
    id: string;
    organization_id: string;
    engagement_id: string;
    validation_key: string;
    name: string;
    performance_targets: unknown[];
    results: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbQaAccessibilityValidation {
    id: string;
    organization_id: string;
    engagement_id: string;
    validation_key: string;
    name: string;
    wcag_level: string;
    checks: unknown[];
    findings: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbQaApiValidation {
    id: string;
    organization_id: string;
    engagement_id: string;
    validation_key: string;
    name: string;
    endpoints: unknown[];
    validation_results: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbQaDatabaseValidation {
    id: string;
    organization_id: string;
    engagement_id: string;
    validation_key: string;
    name: string;
    schema_checks: unknown[];
    data_integrity_checks: unknown[];
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbQaUiValidation {
    id: string;
    organization_id: string;
    engagement_id: string;
    validation_key: string;
    name: string;
    ui_components: unknown[];
    validation_results: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbQaBugTriage {
    id: string;
    organization_id: string;
    engagement_id: string;
    bug_key: string;
    title: string;
    severity: string;
    priority: string;
    triage_notes: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbQaDefectAnalysis {
    id: string;
    organization_id: string;
    engagement_id: string;
    analysis_key: string;
    title: string;
    root_cause: string;
    impact_analysis: string;
    remediation: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbQaCoverageAnalytics {
    id: string;
    organization_id: string;
    engagement_id: string;
    analytics_key: string;
    name: string;
    coverage_metrics: unknown[];
    coverage_percent: number;
    gaps: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbQaReleaseReadiness {
    id: string;
    organization_id: string;
    engagement_id: string;
    assessment_key: string;
    title: string;
    readiness_criteria: unknown[];
    blockers: unknown[];
    recommendation: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbQaQualityScore {
    id: string;
    organization_id: string;
    engagement_id: string;
    score_key: string;
    name: string;
    overall_score: number;
    dimension_scores: unknown[];
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbQaAuditLog {
    id: string;
    organization_id: string;
    entity_type: string;
    entity_id?: string | null;
    action: string;
    summary: string;
    metadata: Record<string, unknown>;
    performed_by?: string | null;
    created_at: string;
}

export interface DbDdEngagement {
    id: string;
    organization_id: string;
    title: string;
    engagement_key: string;
    ba_engagement_id?: string | null;
    sa_engagement_id?: string | null;
    df_engagement_id?: string | null;
    qa_engagement_id?: string | null;
    brd_id?: string | null;
    frs_id?: string | null;
    solution_architecture_id?: string | null;
    work_package_id?: string | null;
    qa_release_readiness_id?: string | null;
    client_id?: string | null;
    project_id?: string | null;
    agent_id?: string | null;
    session_id?: string | null;
    knowledge_context_id?: string | null;
    pipeline_stage: string;
    status: string;
    summary: string;
    created_at: string;
    updated_at: string;
}

export interface DbDdCicdPipeline {
    id: string;
    organization_id: string;
    engagement_id: string;
    pipeline_key: string;
    name: string;
    platform: string;
    stages: unknown[];
    triggers: unknown[];
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDdEnvironment {
    id: string;
    organization_id: string;
    engagement_id: string;
    environment_key: string;
    name: string;
    environment_type: string;
    config: Record<string, unknown>;
    variables: unknown[];
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDdInfrastructureTemplate {
    id: string;
    organization_id: string;
    engagement_id: string;
    template_key: string;
    name: string;
    provider: string;
    template_type: string;
    resources: unknown[];
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDdDockerConfig {
    id: string;
    organization_id: string;
    engagement_id: string;
    config_key: string;
    name: string;
    base_image: string;
    dockerfile_content: string;
    compose_services: unknown[];
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDdKubernetesPlan {
    id: string;
    organization_id: string;
    engagement_id: string;
    plan_key: string;
    name: string;
    namespace: string;
    manifests: unknown[];
    resource_limits: Record<string, unknown>;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDdReleaseOrchestration {
    id: string;
    organization_id: string;
    engagement_id: string;
    orchestration_key: string;
    name: string;
    release_steps: unknown[];
    dependencies: unknown[];
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDdRollbackPlan {
    id: string;
    organization_id: string;
    engagement_id: string;
    plan_key: string;
    name: string;
    rollback_triggers: unknown[];
    rollback_steps: unknown[];
    recovery_time_minutes: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDdBlueGreenPlan {
    id: string;
    organization_id: string;
    engagement_id: string;
    plan_key: string;
    name: string;
    blue_environment: string;
    green_environment: string;
    switch_criteria: unknown[];
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDdCanaryPlan {
    id: string;
    organization_id: string;
    engagement_id: string;
    plan_key: string;
    name: string;
    canary_percentage: number;
    promotion_criteria: unknown[];
    rollback_thresholds: unknown[];
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDdMonitoringIntegration {
    id: string;
    organization_id: string;
    engagement_id: string;
    integration_key: string;
    name: string;
    provider: string;
    metrics: unknown[];
    alerts: unknown[];
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDdLoggingIntegration {
    id: string;
    organization_id: string;
    engagement_id: string;
    integration_key: string;
    name: string;
    provider: string;
    log_sources: unknown[];
    retention_days: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDdHealthCheck {
    id: string;
    organization_id: string;
    engagement_id: string;
    check_key: string;
    name: string;
    endpoint: string;
    check_interval_seconds: number;
    thresholds: Record<string, unknown>;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDdBackupVerification {
    id: string;
    organization_id: string;
    engagement_id: string;
    verification_key: string;
    name: string;
    backup_targets: unknown[];
    verification_results: string;
    last_verified_at?: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDdDisasterRecoveryPlan {
    id: string;
    organization_id: string;
    engagement_id: string;
    plan_key: string;
    name: string;
    rto_minutes: number;
    rpo_minutes: number;
    recovery_steps: unknown[];
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDdCostEstimate {
    id: string;
    organization_id: string;
    engagement_id: string;
    estimate_key: string;
    name: string;
    monthly_cost_usd: number;
    cost_breakdown: unknown[];
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDdDeploymentApproval {
    id: string;
    organization_id: string;
    engagement_id: string;
    approval_key: string;
    title: string;
    approver_role: string;
    approval_criteria: unknown[];
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDdReleaseVersion {
    id: string;
    organization_id: string;
    engagement_id: string;
    version_key: string;
    version_number: string;
    release_notes: string;
    changelog: unknown[];
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDdAuditLog {
    id: string;
    organization_id: string;
    entity_type: string;
    entity_id?: string | null;
    action: string;
    summary: string;
    metadata: Record<string, unknown>;
    performed_by?: string | null;
    created_at: string;
}

export interface DbCsEngagement {
    id: string;
    organization_id: string;
    title: string;
    engagement_key: string;
    ba_engagement_id?: string | null;
    sa_engagement_id?: string | null;
    df_engagement_id?: string | null;
    qa_engagement_id?: string | null;
    dd_engagement_id?: string | null;
    brd_id?: string | null;
    frs_id?: string | null;
    solution_architecture_id?: string | null;
    work_package_id?: string | null;
    qa_release_readiness_id?: string | null;
    dd_release_version_id?: string | null;
    client_id?: string | null;
    project_id?: string | null;
    contact_id?: string | null;
    agent_id?: string | null;
    session_id?: string | null;
    knowledge_context_id?: string | null;
    pipeline_stage: string;
    status: string;
    summary: string;
    created_at: string;
    updated_at: string;
}

export interface DbCsOnboardingWorkflow {
    id: string;
    organization_id: string;
    engagement_id: string;
    workflow_key: string;
    name: string;
    phases: unknown[];
    milestones: unknown[];
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCsAdoptionTracking {
    id: string;
    organization_id: string;
    engagement_id: string;
    tracking_key: string;
    name: string;
    feature_adoptions: unknown[];
    adoption_percent: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCsHealthScore {
    id: string;
    organization_id: string;
    engagement_id: string;
    score_key: string;
    name: string;
    overall_score: number;
    dimension_scores: unknown[];
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCsRenewalPlan {
    id: string;
    organization_id: string;
    engagement_id: string;
    plan_key: string;
    name: string;
    renewal_date?: string | null;
    renewal_value_usd: number;
    renewal_actions: unknown[];
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCsExpansionOpportunity {
    id: string;
    organization_id: string;
    engagement_id: string;
    opportunity_key: string;
    name: string;
    opportunity_type: string;
    estimated_value_usd: number;
    signals: unknown[];
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCsRiskAnalysis {
    id: string;
    organization_id: string;
    engagement_id: string;
    analysis_key: string;
    name: string;
    risk_level: string;
    risk_factors: unknown[];
    mitigation_plan: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCsSupportTrendAnalysis {
    id: string;
    organization_id: string;
    engagement_id: string;
    analysis_key: string;
    name: string;
    trend_metrics: unknown[];
    insights: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCsSuccessPlaybook {
    id: string;
    organization_id: string;
    engagement_id: string;
    playbook_key: string;
    name: string;
    playbook_type: string;
    steps: unknown[];
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCsQbrReport {
    id: string;
    organization_id: string;
    engagement_id: string;
    report_key: string;
    title: string;
    quarter: string;
    report_sections: unknown[];
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCsCommunicationPlan {
    id: string;
    organization_id: string;
    engagement_id: string;
    plan_key: string;
    name: string;
    channels: unknown[];
    cadence: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCsTrainingRecommendation {
    id: string;
    organization_id: string;
    engagement_id: string;
    recommendation_key: string;
    name: string;
    training_modules: unknown[];
    priority: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCsFeedbackAnalysis {
    id: string;
    organization_id: string;
    engagement_id: string;
    analysis_key: string;
    name: string;
    sentiment_score: number;
    themes: unknown[];
    recommendations: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCsSlaMonitoring {
    id: string;
    organization_id: string;
    engagement_id: string;
    monitoring_key: string;
    name: string;
    sla_targets: unknown[];
    compliance_percent: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCsSuccessKpiDashboard {
    id: string;
    organization_id: string;
    engagement_id: string;
    dashboard_key: string;
    name: string;
    kpis: unknown[];
    refresh_cadence: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCsChurnPrediction {
    id: string;
    organization_id: string;
    engagement_id: string;
    prediction_key: string;
    name: string;
    churn_probability: number;
    risk_signals: unknown[];
    retention_actions: unknown[];
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCsLifecycleManagement {
    id: string;
    organization_id: string;
    engagement_id: string;
    lifecycle_key: string;
    name: string;
    current_stage: string;
    stage_history: unknown[];
    next_actions: unknown[];
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCsExecutiveSummary {
    id: string;
    organization_id: string;
    engagement_id: string;
    summary_key: string;
    title: string;
    summary_content: string;
    key_metrics: unknown[];
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCsAuditLog {
    id: string;
    organization_id: string;
    entity_type: string;
    entity_id?: string | null;
    action: string;
    summary: string;
    metadata: Record<string, unknown>;
    performed_by?: string | null;
    created_at: string;
}

export interface DbFoWorkspace {
    id: string;
    organization_id: string;
    title: string;
    workspace_key: string;
    ba_engagement_id?: string | null;
    sa_engagement_id?: string | null;
    df_engagement_id?: string | null;
    qa_engagement_id?: string | null;
    dd_engagement_id?: string | null;
    cs_engagement_id?: string | null;
    client_id?: string | null;
    project_id?: string | null;
    agent_id?: string | null;
    session_id?: string | null;
    knowledge_context_id?: string | null;
    pipeline_stage: string;
    status: string;
    summary: string;
    created_at: string;
    updated_at: string;
}

export interface DbFoStrategicOkr {
    id: string;
    organization_id: string;
    workspace_id: string;
    okr_key: string;
    title: string;
    objective: string;
    key_results: unknown[];
    quarter: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbFoExecutiveDashboard {
    id: string;
    organization_id: string;
    workspace_id: string;
    dashboard_key: string;
    name: string;
    widgets: unknown[];
    refresh_cadence: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbFoRevenueRunway {
    id: string;
    organization_id: string;
    workspace_id: string;
    runway_key: string;
    name: string;
    monthly_burn_usd: number;
    cash_balance_usd: number;
    runway_months: number;
    revenue_forecast: unknown[];
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbFoTeamCapacity {
    id: string;
    organization_id: string;
    workspace_id: string;
    capacity_key: string;
    name: string;
    team_allocations: unknown[];
    utilization_percent: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbFoProductRoadmap {
    id: string;
    organization_id: string;
    workspace_id: string;
    roadmap_key: string;
    name: string;
    initiatives: unknown[];
    timeline_quarters: unknown[];
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbFoInvestorRelation {
    id: string;
    organization_id: string;
    workspace_id: string;
    relation_key: string;
    investor_name: string;
    round: string;
    engagement_notes: string;
    next_touchpoint?: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbFoBoardReport {
    id: string;
    organization_id: string;
    workspace_id: string;
    report_key: string;
    title: string;
    reporting_period: string;
    sections: unknown[];
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbFoDecisionLog {
    id: string;
    organization_id: string;
    workspace_id: string;
    decision_key: string;
    title: string;
    decision_type: string;
    rationale: string;
    outcome: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbFoPriority {
    id: string;
    organization_id: string;
    workspace_id: string;
    priority_key: string;
    title: string;
    priority_level: string;
    owner: string;
    due_date?: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbFoResourceAllocation {
    id: string;
    organization_id: string;
    workspace_id: string;
    allocation_key: string;
    name: string;
    budget_usd: number;
    allocations: unknown[];
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbFoRiskRegister {
    id: string;
    organization_id: string;
    workspace_id: string;
    risk_key: string;
    title: string;
    risk_level: string;
    mitigation_plan: string;
    owner: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbFoGrowthMetric {
    id: string;
    organization_id: string;
    workspace_id: string;
    metric_key: string;
    name: string;
    metric_type: string;
    current_value: number;
    target_value: number;
    growth_rate_percent: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbFoFounderAgenda {
    id: string;
    organization_id: string;
    workspace_id: string;
    agenda_key: string;
    title: string;
    scheduled_at?: string | null;
    agenda_items: unknown[];
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbFoStakeholder {
    id: string;
    organization_id: string;
    workspace_id: string;
    stakeholder_key: string;
    name: string;
    stakeholder_type: string;
    influence_level: string;
    engagement_plan: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbFoCapitalPlan {
    id: string;
    organization_id: string;
    workspace_id: string;
    plan_key: string;
    name: string;
    funding_target_usd: number;
    use_of_funds: unknown[];
    timeline: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbFoCompanyMilestone {
    id: string;
    organization_id: string;
    workspace_id: string;
    milestone_key: string;
    title: string;
    target_date?: string | null;
    milestone_type: string;
    success_criteria: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbFoFounderInsight {
    id: string;
    organization_id: string;
    workspace_id: string;
    insight_key: string;
    title: string;
    insight_type: string;
    content: string;
    confidence_score: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbFoAuditLog {
    id: string;
    organization_id: string;
    entity_type: string;
    entity_id?: string | null;
    action: string;
    summary: string;
    metadata: Record<string, unknown>;
    performed_by?: string | null;
    created_at: string;
}

export interface DbAcCompanyContext {
    id: string;
    organization_id: string;
    title: string;
    context_key: string;
    ba_engagement_id?: string | null;
    sa_engagement_id?: string | null;
    df_engagement_id?: string | null;
    qa_engagement_id?: string | null;
    dd_engagement_id?: string | null;
    cs_engagement_id?: string | null;
    fo_workspace_id?: string | null;
    client_id?: string | null;
    project_id?: string | null;
    agent_id?: string | null;
    session_id?: string | null;
    knowledge_context_id?: string | null;
    pipeline_stage: string;
    status: string;
    summary: string;
    created_at: string;
    updated_at: string;
}

export interface DbAcWorkflowOrchestration {
    id: string;
    organization_id: string;
    context_id: string;
    orchestration_key: string;
    name: string;
    workflow_definition: unknown[];
    participating_modules: unknown[];
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbAcEventBusEvent {
    id: string;
    organization_id: string;
    context_id: string;
    event_key: string;
    name: string;
    source_module: string;
    target_modules: unknown[];
    payload_schema: Record<string, unknown>;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbAcWorkerCollaboration {
    id: string;
    organization_id: string;
    context_id: string;
    collaboration_key: string;
    name: string;
    participating_workers: unknown[];
    handoff_rules: unknown[];
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbAcApprovalWorkflow {
    id: string;
    organization_id: string;
    context_id: string;
    workflow_key: string;
    title: string;
    approval_steps: unknown[];
    required_role: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbAcNotificationCenter {
    id: string;
    organization_id: string;
    context_id: string;
    notification_key: string;
    title: string;
    channel: string;
    priority: string;
    message: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbAcCompanyTimeline {
    id: string;
    organization_id: string;
    context_id: string;
    timeline_key: string;
    title: string;
    event_type: string;
    event_at: string;
    metadata: Record<string, unknown>;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbAcActivityFeed {
    id: string;
    organization_id: string;
    context_id: string;
    feed_key: string;
    actor_type: string;
    actor_name: string;
    action: string;
    resource_type: string;
    resource_id?: string | null;
    summary: string;
    created_at: string;
}

export interface DbAcCrossModuleAutomation {
    id: string;
    organization_id: string;
    context_id: string;
    automation_key: string;
    name: string;
    trigger_module: string;
    action_modules: unknown[];
    conditions: unknown[];
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbAcExecutiveInsight {
    id: string;
    organization_id: string;
    context_id: string;
    insight_key: string;
    title: string;
    insight_type: string;
    content: string;
    metrics: unknown[];
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbAcPredictiveRecommendation {
    id: string;
    organization_id: string;
    context_id: string;
    recommendation_key: string;
    title: string;
    recommendation_type: string;
    confidence_score: number;
    recommendation: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbAcSystemSearch {
    id: string;
    organization_id: string;
    context_id: string;
    search_key: string;
    resource_type: string;
    resource_id?: string | null;
    title: string;
    keywords: string;
    module_source: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbAcCommandPalette {
    id: string;
    organization_id: string;
    context_id: string;
    command_key: string;
    label: string;
    action_type: string;
    target_path: string;
    shortcut: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbAcEmergencyWorkflow {
    id: string;
    organization_id: string;
    context_id: string;
    workflow_key: string;
    name: string;
    severity: string;
    response_steps: unknown[];
    escalation_contacts: unknown[];
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbAcBusinessKpi {
    id: string;
    organization_id: string;
    context_id: string;
    kpi_key: string;
    name: string;
    kpi_category: string;
    current_value: number;
    target_value: number;
    unit: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbAcSecurityGovernance {
    id: string;
    organization_id: string;
    context_id: string;
    governance_key: string;
    name: string;
    control_area: string;
    controls: unknown[];
    compliance_status: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbAcComplianceDashboard {
    id: string;
    organization_id: string;
    context_id: string;
    dashboard_key: string;
    name: string;
    framework: string;
    requirements: unknown[];
    compliance_percent: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbAcOperationalHealth {
    id: string;
    organization_id: string;
    context_id: string;
    health_key: string;
    name: string;
    overall_score: number;
    dimension_scores: unknown[];
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbAcAuditLog {
    id: string;
    organization_id: string;
    entity_type: string;
    entity_id?: string | null;
    action: string;
    summary: string;
    metadata: Record<string, unknown>;
    performed_by?: string | null;
    security_level: string;
    created_at: string;
}

export interface DbSaasTenant {
    id: string;
    organization_id: string;
    tenant_key: string;
    company_name: string;
    owner_user_id?: string | null;
    current_plan: string;
    tenant_status: string;
    trial_ends_at?: string | null;
    subscription_ends_at?: string | null;
    grace_period_ends_at?: string | null;
    domain_slug: string;
    summary: string;
    created_at: string;
    updated_at: string;
}

export interface DbSaasRegistration {
    id: string;
    organization_id: string;
    tenant_id: string;
    registration_key: string;
    company_name: string;
    owner_email: string;
    owner_name: string;
    registration_status: string;
    metadata: Record<string, unknown>;
    created_at: string;
    updated_at: string;
}

export interface DbSaasTenantProfile {
    id: string;
    organization_id: string;
    tenant_id: string;
    profile_key: string;
    legal_name: string;
    industry: string;
    company_size: string;
    billing_email: string;
    address: Record<string, unknown>;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSaasDomainConfig {
    id: string;
    organization_id: string;
    tenant_id: string;
    domain_key: string;
    subdomain: string;
    custom_domain: string;
    ssl_status: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSaasEmailVerification {
    id: string;
    organization_id: string;
    tenant_id: string;
    verification_key: string;
    email: string;
    verification_token: string;
    verified_at?: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSaasTrial {
    id: string;
    organization_id: string;
    tenant_id: string;
    trial_key: string;
    plan_tier: string;
    started_at: string;
    ends_at: string;
    converted_at?: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSaasWorkspaceSetup {
    id: string;
    organization_id: string;
    tenant_id: string;
    setup_key: string;
    workspace_name: string;
    initialization_steps: unknown[];
    completed_steps: unknown[];
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSaasTenantRoleProvision {
    id: string;
    organization_id: string;
    tenant_id: string;
    provision_key: string;
    role_name: string;
    permissions: unknown[];
    is_default: boolean;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSaasWelcomeExperience {
    id: string;
    organization_id: string;
    tenant_id: string;
    experience_key: string;
    title: string;
    welcome_steps: unknown[];
    completed: boolean;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSaasSubscription {
    id: string;
    organization_id: string;
    tenant_id: string;
    subscription_key: string;
    plan_tier: string;
    billing_cycle: string;
    amount_usd: number;
    starts_at: string;
    renews_at?: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSaasPlanLimit {
    id: string;
    organization_id: string;
    tenant_id: string;
    limit_key: string;
    plan_tier: string;
    resource_type: string;
    limit_value: number;
    current_usage: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSaasSubscriptionEvent {
    id: string;
    organization_id: string;
    tenant_id: string;
    event_key: string;
    event_type: string;
    from_plan: string;
    to_plan: string;
    reason: string;
    effective_at: string;
    status: string;
    created_at: string;
}

export interface DbSaasLicense {
    id: string;
    organization_id: string;
    tenant_id: string;
    license_key: string;
    license_type: string;
    name: string;
    total_units: number;
    used_units: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSaasLicenseAllocation {
    id: string;
    organization_id: string;
    tenant_id: string;
    allocation_key: string;
    license_id?: string | null;
    resource_type: string;
    resource_name: string;
    allocated_units: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSaasFeatureFlag {
    id: string;
    organization_id: string;
    tenant_id: string;
    flag_key: string;
    name: string;
    enabled: boolean;
    module_source: string;
    usage_limit?: number | null;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSaasPortalSetting {
    id: string;
    organization_id: string;
    tenant_id: string;
    settings_key: string;
    portal_name: string;
    preferences: Record<string, unknown>;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSaasPortalBranding {
    id: string;
    organization_id: string;
    tenant_id: string;
    branding_key: string;
    logo_url: string;
    primary_color: string;
    accent_color: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSaasPortalIntegration {
    id: string;
    organization_id: string;
    tenant_id: string;
    integration_key: string;
    provider: string;
    config: Record<string, unknown>;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSaasPortalApiKey {
    id: string;
    organization_id: string;
    tenant_id: string;
    api_key_hash: string;
    key_name: string;
    scopes: unknown[];
    last_used_at?: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSaasUsageMeter {
    id: string;
    organization_id: string;
    tenant_id: string;
    meter_key: string;
    meter_type: string;
    unit_label: string;
    current_period_usage: number;
    period_start: string;
    period_end?: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSaasUsageRecord {
    id: string;
    organization_id: string;
    tenant_id: string;
    record_key: string;
    meter_type: string;
    quantity: number;
    recorded_at: string;
    metadata: Record<string, unknown>;
    created_at: string;
}

export interface DbSaasCommercialInvoice {
    id: string;
    organization_id: string;
    tenant_id: string;
    invoice_key: string;
    invoice_number: string;
    amount_usd: number;
    tax_amount_usd: number;
    discount_amount_usd: number;
    due_date?: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSaasBillingCredit {
    id: string;
    organization_id: string;
    tenant_id: string;
    credit_key: string;
    balance_usd: number;
    reason: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSaasBillingCoupon {
    id: string;
    organization_id: string;
    tenant_id: string;
    coupon_key: string;
    code: string;
    discount_type: string;
    discount_value: number;
    expires_at?: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSaasRecurringBilling {
    id: string;
    organization_id: string;
    tenant_id: string;
    billing_key: string;
    amount_usd: number;
    billing_cycle: string;
    next_billing_date?: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSaasTenantHealthScore {
    id: string;
    organization_id: string;
    tenant_id: string;
    score_key: string;
    overall_score: number;
    dimension_scores: unknown[];
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSaasOnboardingChecklist {
    id: string;
    organization_id: string;
    tenant_id: string;
    checklist_key: string;
    name: string;
    items: unknown[];
    completion_percent: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSaasProductAdoption {
    id: string;
    organization_id: string;
    tenant_id: string;
    adoption_key: string;
    module_name: string;
    adoption_percent: number;
    active_users: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSaasRenewalTracking {
    id: string;
    organization_id: string;
    tenant_id: string;
    renewal_key: string;
    renewal_date: string;
    renewal_value_usd: number;
    renewal_probability: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSaasSupportSummary {
    id: string;
    organization_id: string;
    tenant_id: string;
    summary_key: string;
    open_tickets: number;
    avg_resolution_hours: number;
    satisfaction_score: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSaasAdminMetric {
    id: string;
    organization_id: string;
    metrics_key: string;
    metric_date: string;
    active_tenants: number;
    trial_tenants: number;
    mrr_usd: number;
    arr_usd: number;
    churn_rate_percent: number;
    renewal_count: number;
    total_usage_records: number;
    avg_health_score: number;
    growth_rate_percent: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSaasAuditLog {
    id: string;
    organization_id: string;
    entity_type: string;
    entity_id?: string | null;
    action: string;
    summary: string;
    metadata: Record<string, unknown>;
    performed_by?: string | null;
    security_level: string;
    created_at: string;
}

export interface DbIdpRealm {
    id: string;
    organization_id: string;
    realm_key: string;
    realm_name: string;
    summary: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIdpProvider {
    id: string;
    organization_id: string;
    realm_id: string;
    provider_key: string;
    provider_type: string;
    display_name: string;
    config: Record<string, unknown>;
    is_default: boolean;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIdpSamlConfig {
    id: string;
    organization_id: string;
    realm_id: string;
    config_key: string;
    entity_id: string;
    sso_url: string;
    certificate_pem: string;
    attribute_mapping: Record<string, unknown>;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIdpOidcConfig {
    id: string;
    organization_id: string;
    realm_id: string;
    config_key: string;
    client_id: string;
    client_secret_hash: string;
    issuer_url: string;
    redirect_uris: unknown[];
    scopes: unknown[];
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIdpMfaPolicy {
    id: string;
    organization_id: string;
    realm_id: string;
    policy_key: string;
    name: string;
    required_methods: unknown[];
    grace_period_days: number;
    enforce_for_admins: boolean;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIdpMfaEnrollment {
    id: string;
    organization_id: string;
    realm_id: string;
    enrollment_key: string;
    user_id?: string | null;
    mfa_type: string;
    enrolled_at: string;
    last_used_at?: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIdpBackupCode {
    id: string;
    organization_id: string;
    realm_id: string;
    code_key: string;
    user_id?: string | null;
    code_hash: string;
    used_at?: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIdpTrustedDevice {
    id: string;
    organization_id: string;
    realm_id: string;
    device_key: string;
    user_id?: string | null;
    device_fingerprint: string;
    device_name: string;
    trusted_at: string;
    expires_at?: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIdpSessionPolicy {
    id: string;
    organization_id: string;
    realm_id: string;
    policy_key: string;
    name: string;
    idle_timeout_minutes: number;
    absolute_timeout_hours: number;
    require_reauth: boolean;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIdpActiveSession {
    id: string;
    organization_id: string;
    realm_id: string;
    session_key: string;
    user_id?: string | null;
    device_name: string;
    ip_address: string;
    user_agent: string;
    last_active_at: string;
    expires_at?: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIdpDeviceRegistry {
    id: string;
    organization_id: string;
    realm_id: string;
    device_key: string;
    user_id?: string | null;
    device_name: string;
    device_type: string;
    os_name: string;
    registered_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIdpConcurrentLoginPolicy {
    id: string;
    organization_id: string;
    realm_id: string;
    policy_key: string;
    max_concurrent_sessions: number;
    action_on_exceed: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIdpRbacRole {
    id: string;
    organization_id: string;
    realm_id: string;
    role_key: string;
    role_name: string;
    permissions: unknown[];
    is_system: boolean;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIdpPermissionGroup {
    id: string;
    organization_id: string;
    realm_id: string;
    group_key: string;
    group_name: string;
    permissions: unknown[];
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIdpAbacPolicy {
    id: string;
    organization_id: string;
    realm_id: string;
    policy_key: string;
    name: string;
    conditions: Record<string, unknown>;
    effect: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIdpTemporaryAccessGrant {
    id: string;
    organization_id: string;
    realm_id: string;
    grant_key: string;
    user_id?: string | null;
    granted_by?: string | null;
    permissions: unknown[];
    starts_at: string;
    expires_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIdpDepartment {
    id: string;
    organization_id: string;
    realm_id: string;
    department_key: string;
    name: string;
    parent_department_id?: string | null;
    head_user_id?: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIdpTeam {
    id: string;
    organization_id: string;
    realm_id: string;
    team_key: string;
    name: string;
    department_id?: string | null;
    lead_user_id?: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIdpBusinessUnit {
    id: string;
    organization_id: string;
    realm_id: string;
    unit_key: string;
    name: string;
    code: string;
    parent_unit_id?: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIdpReportingStructure {
    id: string;
    organization_id: string;
    realm_id: string;
    structure_key: string;
    employee_user_id?: string | null;
    manager_user_id?: string | null;
    effective_from: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIdpInvitation {
    id: string;
    organization_id: string;
    realm_id: string;
    invitation_key: string;
    email: string;
    invited_by?: string | null;
    role_name: string;
    expires_at: string;
    accepted_at?: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIdpBulkInviteBatch {
    id: string;
    organization_id: string;
    realm_id: string;
    batch_key: string;
    name: string;
    total_count: number;
    sent_count: number;
    failed_count: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIdpInvitationRole {
    id: string;
    organization_id: string;
    realm_id: string;
    role_assignment_key: string;
    invitation_id?: string | null;
    role_id?: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIdpInvitationAudit {
    id: string;
    organization_id: string;
    realm_id: string;
    audit_key: string;
    invitation_id?: string | null;
    action: string;
    actor_user_id?: string | null;
    details: Record<string, unknown>;
    status: string;
    created_at: string;
}

export interface DbIdpLoginHistory {
    id: string;
    organization_id: string;
    realm_id: string;
    login_key: string;
    user_id?: string | null;
    ip_address: string;
    device_name: string;
    login_method: string;
    success: boolean;
    logged_at: string;
    status: string;
    created_at: string;
}

export interface DbIdpSecurityAlert {
    id: string;
    organization_id: string;
    realm_id: string;
    alert_key: string;
    alert_type: string;
    severity: string;
    title: string;
    description: string;
    resolved_at?: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIdpRiskEvent {
    id: string;
    organization_id: string;
    realm_id: string;
    event_key: string;
    user_id?: string | null;
    risk_score: number;
    risk_factors: unknown[];
    action_taken: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIdpPasswordPolicy {
    id: string;
    organization_id: string;
    realm_id: string;
    policy_key: string;
    name: string;
    min_length: number;
    require_uppercase: boolean;
    require_numbers: boolean;
    require_symbols: boolean;
    max_age_days: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIdpAdminMetric {
    id: string;
    organization_id: string;
    metrics_key: string;
    metric_date: string;
    total_users: number;
    mfa_adoption_percent: number;
    active_sessions: number;
    failed_logins_24h: number;
    pending_invitations: number;
    compromised_accounts: number;
    open_security_alerts: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIdpIdentityHealth {
    id: string;
    organization_id: string;
    health_key: string;
    overall_score: number;
    dimension_scores: unknown[];
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIdpCompromisedAccount {
    id: string;
    organization_id: string;
    realm_id: string;
    account_key: string;
    user_id?: string | null;
    detected_at: string;
    remediation_status: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIdpAuditLog {
    id: string;
    organization_id: string;
    entity_type: string;
    entity_id?: string | null;
    action: string;
    summary: string;
    metadata: Record<string, unknown>;
    performed_by?: string | null;
    security_level: string;
    created_at: string;
}

export interface DbTloTenantContext {
    id: string;
    organization_id: string;
    context_key: string;
    company_name: string;
    lifecycle_stage: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbTloLifecycleRecord {
    id: string;
    organization_id: string;
    tenant_context_id: string;
    record_key: string;
    current_stage: string;
    previous_stage: string;
    stage_entered_at: string;
    owner_user_id?: string | null;
    notes: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbTloLifecycleTransition {
    id: string;
    organization_id: string;
    tenant_context_id: string;
    transition_key: string;
    from_stage: string;
    to_stage: string;
    triggered_by?: string | null;
    reason: string;
    approved_by?: string | null;
    transitioned_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbTloLifecycleEvent {
    id: string;
    organization_id: string;
    tenant_context_id: string;
    event_key: string;
    event_type: string;
    stage: string;
    summary: string;
    details: Record<string, unknown>;
    actor_user_id?: string | null;
    occurred_at: string;
    status: string;
    created_at: string;
}

export interface DbTloReactivationRequest {
    id: string;
    organization_id: string;
    tenant_context_id: string;
    request_key: string;
    prior_stage: string;
    target_stage: string;
    requested_by?: string | null;
    approved_by?: string | null;
    justification: string;
    requested_at: string;
    resolved_at?: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbTloWorkspace {
    id: string;
    organization_id: string;
    tenant_context_id: string;
    workspace_key: string;
    workspace_name: string;
    workspace_type: string;
    region: string;
    isolation_tier: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbTloEnvironmentSetting {
    id: string;
    organization_id: string;
    tenant_context_id: string;
    setting_key: string;
    environment_name: string;
    config: Record<string, unknown>;
    feature_flags: Record<string, unknown>;
    api_rate_limit: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbTloStorageManagement {
    id: string;
    organization_id: string;
    tenant_context_id: string;
    storage_key: string;
    storage_type: string;
    quota_gb: number;
    used_gb: number;
    retention_days: number;
    encryption_enabled: boolean;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbTloOperationsControl {
    id: string;
    organization_id: string;
    tenant_context_id: string;
    control_key: string;
    backup_enabled: boolean;
    backup_schedule_cron: string;
    last_backup_at?: string | null;
    restore_point_id: string;
    maintenance_mode: boolean;
    maintenance_window: Record<string, unknown>;
    maintenance_message: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbTloOnboardingFlow {
    id: string;
    organization_id: string;
    tenant_context_id: string;
    flow_key: string;
    flow_name: string;
    flow_type: string;
    steps: unknown[];
    estimated_days: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbTloOnboardingProgress {
    id: string;
    organization_id: string;
    tenant_context_id: string;
    progress_key: string;
    flow_id?: string | null;
    current_step: string;
    completed_steps: unknown[];
    percent_complete: number;
    started_at: string;
    completed_at?: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbTloOnboardingValidation {
    id: string;
    organization_id: string;
    tenant_context_id: string;
    validation_key: string;
    validation_type: string;
    rule_name: string;
    expected_value: string;
    actual_value: string;
    passed: boolean;
    validated_at?: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbTloGoLiveChecklist {
    id: string;
    organization_id: string;
    tenant_context_id: string;
    checklist_key: string;
    name: string;
    checklist_items: unknown[];
    completed_items: unknown[];
    signoff_user_id?: string | null;
    go_live_date?: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbTloMarketplaceModule {
    id: string;
    organization_id: string;
    tenant_context_id: string;
    module_key: string;
    module_name: string;
    module_version: string;
    category: string;
    description: string;
    is_published: boolean;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbTloModuleInstallation {
    id: string;
    organization_id: string;
    tenant_context_id: string;
    installation_key: string;
    module_id?: string | null;
    installed_version: string;
    installed_at: string;
    installed_by?: string | null;
    config: Record<string, unknown>;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbTloModuleDependency {
    id: string;
    organization_id: string;
    tenant_context_id: string;
    dependency_key: string;
    module_id?: string | null;
    depends_on_module_id?: string | null;
    dependency_type: string;
    min_version: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbTloModuleCompatibility {
    id: string;
    organization_id: string;
    tenant_context_id: string;
    compatibility_key: string;
    module_id?: string | null;
    platform_version: string;
    compatible: boolean;
    notes: string;
    tested_at?: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbTloIndustryPack {
    id: string;
    organization_id: string;
    tenant_context_id: string;
    pack_key: string;
    pack_name: string;
    industry: string;
    pack_version: string;
    included_modules: unknown[];
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbTloPackInstallation {
    id: string;
    organization_id: string;
    tenant_context_id: string;
    installation_key: string;
    pack_id?: string | null;
    installed_version: string;
    installed_at: string;
    installed_by?: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbTloPackVersion {
    id: string;
    organization_id: string;
    tenant_context_id: string;
    version_key: string;
    pack_id?: string | null;
    version_number: string;
    changelog: string;
    release_notes: Record<string, unknown>;
    released_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbTloPackExport {
    id: string;
    organization_id: string;
    tenant_context_id: string;
    export_key: string;
    pack_id?: string | null;
    export_format: string;
    export_uri: string;
    exported_at: string;
    exported_by?: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbTloHealthSnapshot {
    id: string;
    organization_id: string;
    tenant_context_id: string;
    snapshot_key: string;
    snapshot_date: string;
    overall_score: number;
    trend: string;
    summary: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbTloHealthDimension {
    id: string;
    organization_id: string;
    tenant_context_id: string;
    dimension_key: string;
    snapshot_id?: string | null;
    dimension_name: string;
    score: number;
    weight: number;
    metrics: Record<string, unknown>;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbTloHealthRisk {
    id: string;
    organization_id: string;
    tenant_context_id: string;
    risk_key: string;
    risk_type: string;
    severity: string;
    title: string;
    description: string;
    detected_at: string;
    resolved_at?: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbTloHealthScore {
    id: string;
    organization_id: string;
    tenant_context_id: string;
    score_key: string;
    score_type: string;
    score_value: number;
    previous_value: number;
    calculated_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbTloSuccessPlan {
    id: string;
    organization_id: string;
    tenant_context_id: string;
    plan_key: string;
    plan_name: string;
    csm_user_id?: string | null;
    objectives: unknown[];
    start_date: string;
    end_date?: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbTloQuarterlyReview {
    id: string;
    organization_id: string;
    tenant_context_id: string;
    review_key: string;
    quarter: string;
    review_date: string;
    attendees: unknown[];
    outcomes: unknown[];
    next_actions: unknown[];
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbTloRenewalPlan {
    id: string;
    organization_id: string;
    tenant_context_id: string;
    renewal_key: string;
    contract_end_date: string;
    renewal_amount_usd: number;
    renewal_probability: number;
    owner_user_id?: string | null;
    strategy: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbTloCustomerMilestone {
    id: string;
    organization_id: string;
    tenant_context_id: string;
    milestone_key: string;
    milestone_name: string;
    milestone_type: string;
    target_date?: string | null;
    achieved_at?: string | null;
    success_plan_id?: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbTloCommercialMetric {
    id: string;
    organization_id: string;
    metrics_key: string;
    metric_date: string;
    total_tenants: number;
    active_tenants: number;
    trial_tenants: number;
    churned_tenants: number;
    mrr_usd: number;
    arr_usd: number;
    net_revenue_retention: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbTloGrowthSnapshot {
    id: string;
    organization_id: string;
    snapshot_key: string;
    snapshot_date: string;
    new_tenants_30d: number;
    expansion_revenue_usd: number;
    contraction_revenue_usd: number;
    pipeline_value_usd: number;
    growth_rate_percent: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbTloExpansionOpportunity {
    id: string;
    organization_id: string;
    tenant_context_id: string;
    opportunity_key: string;
    opportunity_type: string;
    title: string;
    estimated_value_usd: number;
    probability: number;
    owner_user_id?: string | null;
    expected_close_date?: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbTloAuditLog {
    id: string;
    organization_id: string;
    entity_type: string;
    entity_id?: string | null;
    action: string;
    summary: string;
    metadata: Record<string, unknown>;
    performed_by?: string | null;
    security_level: string;
    created_at: string;
}

export interface DbBrvBillingAccount {
    id: string;
    organization_id: string;
    account_key: string;
    account_name: string;
    currency_code: string;
    billing_email: string;
    payment_terms_days: number;
    tax_id: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBrvBillingCycle {
    id: string;
    organization_id: string;
    billing_account_id: string;
    cycle_key: string;
    billing_cycle: string;
    cycle_start_date: string;
    cycle_end_date?: string | null;
    next_invoice_date?: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBrvSubscriptionBilling {
    id: string;
    organization_id: string;
    billing_account_id: string;
    subscription_key: string;
    plan_name: string;
    billing_cycle: string;
    amount_usd: number;
    mrr_usd: number;
    arr_usd: number;
    quantity: number;
    starts_at: string;
    ends_at?: string | null;
    renews_at?: string | null;
    payment_status: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBrvProrationRecord {
    id: string;
    organization_id: string;
    billing_account_id: string;
    proration_key: string;
    subscription_billing_id?: string | null;
    proration_type: string;
    prorated_amount_usd: number;
    days_remaining: number;
    days_in_cycle: number;
    effective_date: string;
    reason: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBrvPaymentMethod {
    id: string;
    organization_id: string;
    billing_account_id: string;
    method_key: string;
    method_type: string;
    last_four: string;
    brand: string;
    expiry_month?: number | null;
    expiry_year?: number | null;
    is_default: boolean;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBrvPaymentAttempt {
    id: string;
    organization_id: string;
    billing_account_id: string;
    attempt_key: string;
    payment_method_id?: string | null;
    amount_usd: number;
    currency_code: string;
    payment_status: string;
    gateway_reference: string;
    failure_reason: string;
    attempted_at: string;
    status: string;
    created_at: string;
}

export interface DbBrvRefund {
    id: string;
    organization_id: string;
    billing_account_id: string;
    refund_key: string;
    payment_attempt_id?: string | null;
    amount_usd: number;
    refund_reason: string;
    refund_status: string;
    processed_at?: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBrvWalletBalance {
    id: string;
    organization_id: string;
    billing_account_id: string;
    balance_key: string;
    balance_usd: number;
    credit_usd: number;
    debit_usd: number;
    last_transaction_at?: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBrvMrrSnapshot {
    id: string;
    organization_id: string;
    billing_account_id: string;
    snapshot_key: string;
    snapshot_date: string;
    mrr_usd: number;
    previous_mrr_usd: number;
    new_mrr_usd: number;
    expansion_mrr_usd: number;
    contraction_mrr_usd: number;
    churn_mrr_usd: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBrvArrSnapshot {
    id: string;
    organization_id: string;
    billing_account_id: string;
    snapshot_key: string;
    snapshot_date: string;
    arr_usd: number;
    previous_arr_usd: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBrvDeferredRevenue {
    id: string;
    organization_id: string;
    billing_account_id: string;
    deferred_key: string;
    period_start: string;
    period_end?: string | null;
    total_deferred_usd: number;
    recognized_usd: number;
    remaining_usd: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBrvRevenueRecognition {
    id: string;
    organization_id: string;
    billing_account_id: string;
    recognition_key: string;
    deferred_revenue_id?: string | null;
    recognized_amount_usd: number;
    recognition_date: string;
    recognition_type: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBrvInvoice {
    id: string;
    organization_id: string;
    billing_account_id: string;
    invoice_key: string;
    invoice_number: string;
    subtotal_usd: number;
    tax_amount: number;
    total_usd: number;
    amount_due_usd: number;
    billing_cycle: string;
    invoice_date: string;
    due_date?: string | null;
    paid_at?: string | null;
    payment_status: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBrvCreditNote {
    id: string;
    organization_id: string;
    billing_account_id: string;
    credit_key: string;
    invoice_id?: string | null;
    amount_usd: number;
    tax_amount: number;
    reason: string;
    issued_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBrvDebitNote {
    id: string;
    organization_id: string;
    billing_account_id: string;
    debit_key: string;
    invoice_id?: string | null;
    amount_usd: number;
    tax_amount: number;
    reason: string;
    issued_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBrvTaxConfig {
    id: string;
    organization_id: string;
    billing_account_id: string;
    config_key: string;
    tax_name: string;
    gst_rate: number;
    tax_type: string;
    jurisdiction: string;
    is_default: boolean;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBrvOutstandingBalance {
    id: string;
    organization_id: string;
    billing_account_id: string;
    balance_key: string;
    total_outstanding_usd: number;
    overdue_usd: number;
    current_usd: number;
    days_overdue: number;
    last_payment_at?: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBrvPaymentReminder {
    id: string;
    organization_id: string;
    billing_account_id: string;
    reminder_key: string;
    outstanding_balance_id?: string | null;
    reminder_type: string;
    channel: string;
    sent_at?: string | null;
    next_reminder_at?: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBrvCollectionCase {
    id: string;
    organization_id: string;
    billing_account_id: string;
    case_key: string;
    case_type: string;
    priority: string;
    outstanding_amount_usd: number;
    assigned_to?: string | null;
    opened_at: string;
    resolved_at?: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBrvWriteOff {
    id: string;
    organization_id: string;
    billing_account_id: string;
    writeoff_key: string;
    collection_case_id?: string | null;
    amount_usd: number;
    reason: string;
    approved_by?: string | null;
    written_off_at?: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBrvAnalyticsSnapshot {
    id: string;
    organization_id: string;
    billing_account_id: string;
    snapshot_key: string;
    snapshot_date: string;
    total_revenue_usd: number;
    mrr_usd: number;
    arr_usd: number;
    metrics: Record<string, unknown>;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBrvRevenueGrowthMetric {
    id: string;
    organization_id: string;
    billing_account_id: string;
    metrics_key: string;
    metric_date: string;
    growth_rate_percent: number;
    net_revenue_retention: number;
    expansion_revenue_usd: number;
    contraction_revenue_usd: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBrvCashFlowRecord {
    id: string;
    organization_id: string;
    billing_account_id: string;
    record_key: string;
    record_date: string;
    inflow_usd: number;
    outflow_usd: number;
    net_cash_usd: number;
    category: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBrvSubscriptionTrend {
    id: string;
    organization_id: string;
    billing_account_id: string;
    trend_key: string;
    trend_date: string;
    active_subscriptions: number;
    new_subscriptions: number;
    churned_subscriptions: number;
    mrr_usd: number;
    arr_usd: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBrvRenewalForecast {
    id: string;
    organization_id: string;
    billing_account_id: string;
    forecast_key: string;
    forecast_date: string;
    renewal_amount_usd: number;
    renewal_probability: number;
    contract_end_date?: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBrvMrrForecast {
    id: string;
    organization_id: string;
    billing_account_id: string;
    forecast_key: string;
    forecast_date: string;
    forecast_period: string;
    projected_mrr_usd: number;
    confidence_percent: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBrvArrForecast {
    id: string;
    organization_id: string;
    billing_account_id: string;
    forecast_key: string;
    forecast_date: string;
    forecast_period: string;
    projected_arr_usd: number;
    confidence_percent: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBrvRevenueProjection {
    id: string;
    organization_id: string;
    billing_account_id: string;
    projection_key: string;
    projection_date: string;
    projected_revenue_usd: number;
    projection_horizon_months: number;
    assumptions: Record<string, unknown>;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBrvFinanceMetric {
    id: string;
    organization_id: string;
    metrics_key: string;
    metric_date: string;
    total_mrr_usd: number;
    total_arr_usd: number;
    total_revenue_usd: number;
    collection_rate_percent: number;
    dso_days: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBrvFinancialHealth {
    id: string;
    organization_id: string;
    health_key: string;
    health_date: string;
    overall_score: number;
    liquidity_score: number;
    collection_score: number;
    summary: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBrvExpansionContraction {
    id: string;
    organization_id: string;
    billing_account_id: string;
    record_key: string;
    record_date: string;
    record_type: string;
    amount_usd: number;
    mrr_impact_usd: number;
    reason: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBrvAuditLog {
    id: string;
    organization_id: string;
    entity_type: string;
    entity_id?: string | null;
    action: string;
    summary: string;
    metadata: Record<string, unknown>;
    performed_by?: string | null;
    security_level: string;
    created_at: string;
}

export interface DbCnhCommunicationHub {
    id: string;
    organization_id: string;
    hub_key: string;
    hub_name: string;
    default_locale: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCnhNotificationChannel {
    id: string;
    organization_id: string;
    hub_id: string;
    channel_key: string;
    channel_name: string;
    channel_type: string;
    provider_config: Record<string, unknown>;
    is_enabled: boolean;
    priority_level: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCnhNotificationQueue {
    id: string;
    organization_id: string;
    hub_id: string;
    queue_key: string;
    channel_id?: string | null;
    channel_type: string;
    recipient: string;
    subject: string;
    body: string;
    priority_level: string;
    delivery_status: string;
    retry_count: number;
    scheduled_at: string;
    delivered_at?: string | null;
    failure_reason: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCnhRetryPolicy {
    id: string;
    organization_id: string;
    hub_id: string;
    policy_key: string;
    policy_name: string;
    channel_type: string;
    max_retries: number;
    backoff_seconds: number;
    backoff_multiplier: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCnhMessageTemplate {
    id: string;
    organization_id: string;
    hub_id: string;
    template_key: string;
    template_name: string;
    channel_type: string;
    subject_template: string;
    body_template: string;
    version: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCnhTemplateVariable {
    id: string;
    organization_id: string;
    hub_id: string;
    template_id: string;
    variable_key: string;
    variable_name: string;
    default_value: string;
    is_required: boolean;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCnhTemplateLocalization {
    id: string;
    organization_id: string;
    hub_id: string;
    template_id: string;
    locale: string;
    subject_template: string;
    body_template: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCnhTemplateApproval {
    id: string;
    organization_id: string;
    hub_id: string;
    template_id: string;
    approval_key: string;
    approval_status: string;
    approved_by?: string | null;
    approved_at?: string | null;
    rejection_reason: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCnhAutomationRule {
    id: string;
    organization_id: string;
    hub_id: string;
    rule_key: string;
    rule_name: string;
    trigger_type: string;
    action_type: string;
    priority_level: string;
    is_enabled: boolean;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCnhAutomationTrigger {
    id: string;
    organization_id: string;
    hub_id: string;
    rule_id: string;
    trigger_key: string;
    trigger_event: string;
    conditions: Record<string, unknown>;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCnhAutomationSchedule {
    id: string;
    organization_id: string;
    hub_id: string;
    rule_id: string;
    schedule_key: string;
    cron_expression: string;
    timezone: string;
    next_run_at?: string | null;
    last_run_at?: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCnhAutomationExecution {
    id: string;
    organization_id: string;
    hub_id: string;
    rule_id?: string | null;
    execution_key: string;
    started_at: string;
    completed_at?: string | null;
    execution_status: string;
    notifications_sent: number;
    error_message: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCnhPreferenceProfile {
    id: string;
    organization_id: string;
    hub_id: string;
    profile_key: string;
    user_id?: string | null;
    customer_email: string;
    preferred_locale: string;
    timezone: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCnhChannelPreference {
    id: string;
    organization_id: string;
    hub_id: string;
    preference_profile_id: string;
    channel_type: string;
    is_enabled: boolean;
    frequency: string;
    quiet_hours_start?: string | null;
    quiet_hours_end?: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCnhOptInRecord {
    id: string;
    organization_id: string;
    hub_id: string;
    preference_profile_id?: string | null;
    opt_in_key: string;
    channel_type: string;
    source: string;
    opted_in_at: string;
    ip_address: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCnhOptOutRecord {
    id: string;
    organization_id: string;
    hub_id: string;
    preference_profile_id?: string | null;
    opt_out_key: string;
    channel_type: string;
    reason: string;
    opted_out_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCnhAnnouncement {
    id: string;
    organization_id: string;
    hub_id: string;
    announcement_key: string;
    title: string;
    content: string;
    channel_type: string;
    priority_level: string;
    requires_acknowledgement: boolean;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCnhAnnouncementSchedule {
    id: string;
    organization_id: string;
    hub_id: string;
    announcement_id: string;
    schedule_key: string;
    publish_at: string;
    expire_at?: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCnhPinnedAnnouncement {
    id: string;
    organization_id: string;
    hub_id: string;
    announcement_id: string;
    pin_key: string;
    pin_order: number;
    pinned_at: string;
    expires_at?: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCnhAnnouncementAcknowledgement {
    id: string;
    organization_id: string;
    hub_id: string;
    announcement_id: string;
    acknowledgement_key: string;
    user_id?: string | null;
    acknowledged_at: string;
    status: string;
    created_at: string;
}

export interface DbCnhCampaign {
    id: string;
    organization_id: string;
    hub_id: string;
    campaign_key: string;
    campaign_name: string;
    channel_type: string;
    template_id?: string | null;
    priority_level: string;
    starts_at?: string | null;
    ends_at?: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCnhAudienceSegment {
    id: string;
    organization_id: string;
    hub_id: string;
    campaign_id?: string | null;
    segment_key: string;
    segment_name: string;
    criteria: Record<string, unknown>;
    estimated_size: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCnhCampaignDelivery {
    id: string;
    organization_id: string;
    hub_id: string;
    campaign_id: string;
    delivery_key: string;
    recipient: string;
    channel_type: string;
    delivery_status: string;
    sent_at?: string | null;
    delivered_at?: string | null;
    opened_at?: string | null;
    clicked_at?: string | null;
    retry_count: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCnhCampaignMetric {
    id: string;
    organization_id: string;
    hub_id: string;
    campaign_id: string;
    metrics_key: string;
    metric_date: string;
    sent_count: number;
    delivered_count: number;
    open_rate: number;
    click_rate: number;
    bounce_rate: number;
    unsubscribe_rate: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCnhDeliveryAnalytics {
    id: string;
    organization_id: string;
    hub_id: string;
    analytics_key: string;
    metric_date: string;
    channel_type: string;
    total_sent: number;
    total_delivered: number;
    total_failed: number;
    delivery_rate: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCnhEngagementMetric {
    id: string;
    organization_id: string;
    hub_id: string;
    metrics_key: string;
    metric_date: string;
    channel_type: string;
    open_rate: number;
    click_rate: number;
    unsubscribe_rate: number;
    engagement_score: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCnhBounceRecord {
    id: string;
    organization_id: string;
    hub_id: string;
    bounce_key: string;
    channel_type: string;
    recipient: string;
    bounce_type: string;
    bounce_reason: string;
    bounced_at: string;
    retry_count: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCnhChannelPerformance {
    id: string;
    organization_id: string;
    hub_id: string;
    performance_key: string;
    metric_date: string;
    channel_type: string;
    delivery_rate: number;
    open_rate: number;
    click_rate: number;
    avg_latency_ms: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCnhCommunicationMetric {
    id: string;
    organization_id: string;
    metrics_key: string;
    metric_date: string;
    total_sent: number;
    total_delivered: number;
    total_failed: number;
    delivery_rate: number;
    open_rate: number;
    click_rate: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCnhSystemHealth {
    id: string;
    organization_id: string;
    health_key: string;
    health_date: string;
    overall_score: number;
    uptime_percent: number;
    queue_depth: number;
    avg_delivery_latency_ms: number;
    disaster_recovery_mode: boolean;
    summary: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCnhDeliveryFailure {
    id: string;
    organization_id: string;
    hub_id: string;
    failure_key: string;
    channel_type: string;
    recipient: string;
    error_code: string;
    error_message: string;
    retry_count: number;
    failed_at: string;
    resolved_at?: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCnhAuditLog {
    id: string;
    organization_id: string;
    entity_type: string;
    entity_id?: string | null;
    action: string;
    summary: string;
    metadata: Record<string, unknown>;
    performed_by?: string | null;
    security_level: string;
    created_at: string;
}

export interface DbIntgIntegrationHub {
    id: string;
    organization_id: string;
    hub_key: string;
    hub_name: string;
    environment: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIntgConnectedService {
    id: string;
    organization_id: string;
    hub_id: string;
    service_key: string;
    service_name: string;
    provider_type: string;
    connector_status: string;
    credentials_ref: string;
    config: Record<string, unknown>;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIntgConnectorConfig {
    id: string;
    organization_id: string;
    hub_id: string;
    connected_service_id: string;
    config_key: string;
    config_name: string;
    provider_type: string;
    api_version: string;
    settings: Record<string, unknown>;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIntgConnectorHealth {
    id: string;
    organization_id: string;
    hub_id: string;
    connected_service_id: string;
    health_key: string;
    health_score: number;
    last_check_at: string;
    check_details: Record<string, unknown>;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIntgPaymentConnector {
    id: string;
    organization_id: string;
    hub_id: string;
    connector_key: string;
    connector_name: string;
    provider_type: string;
    connector_status: string;
    api_version: string;
    credentials_ref: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIntgPaymentConnectorHealth {
    id: string;
    organization_id: string;
    hub_id: string;
    connector_id: string;
    health_key: string;
    health_score: number;
    last_check_at: string;
    latency_ms: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIntgPaymentRetryQueue {
    id: string;
    organization_id: string;
    hub_id: string;
    connector_id: string;
    queue_key: string;
    transaction_ref: string;
    retry_count: number;
    max_retries: number;
    next_retry_at?: string | null;
    last_error: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIntgPaymentTransaction {
    id: string;
    organization_id: string;
    hub_id: string;
    connector_id: string;
    transaction_key: string;
    external_id: string;
    amount: number;
    currency: string;
    provider_type: string;
    transaction_status: string;
    processed_at?: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIntgAccountingConnector {
    id: string;
    organization_id: string;
    hub_id: string;
    connector_key: string;
    connector_name: string;
    provider_type: string;
    connector_status: string;
    api_version: string;
    credentials_ref: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIntgAccountingSyncStatus {
    id: string;
    organization_id: string;
    hub_id: string;
    connector_id: string;
    sync_key: string;
    entity_type: string;
    last_sync_at?: string | null;
    records_synced: number;
    sync_status: string;
    error_message: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIntgExportMapping {
    id: string;
    organization_id: string;
    hub_id: string;
    connector_id: string;
    mapping_key: string;
    mapping_name: string;
    source_entity: string;
    target_entity: string;
    field_mappings: Record<string, unknown>;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIntgAccountingExport {
    id: string;
    organization_id: string;
    hub_id: string;
    connector_id: string;
    export_key: string;
    export_type: string;
    record_count: number;
    export_status: string;
    started_at: string;
    completed_at?: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIntgApiKey {
    id: string;
    organization_id: string;
    hub_id: string;
    key_name: string;
    key_prefix: string;
    key_hash: string;
    api_version: string;
    expires_at?: string | null;
    last_used_at?: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIntgApiScope {
    id: string;
    organization_id: string;
    hub_id: string;
    api_key_id: string;
    scope_key: string;
    scope_name: string;
    permissions: unknown[];
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIntgRateLimit {
    id: string;
    organization_id: string;
    hub_id: string;
    api_key_id?: string | null;
    limit_key: string;
    limit_name: string;
    rate_limit_rpm: number;
    burst_limit: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIntgApiUsage {
    id: string;
    organization_id: string;
    hub_id: string;
    api_key_id?: string | null;
    usage_key: string;
    endpoint: string;
    request_count: number;
    error_count: number;
    period_start: string;
    period_end?: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIntgIncomingWebhook {
    id: string;
    organization_id: string;
    hub_id: string;
    webhook_key: string;
    webhook_name: string;
    endpoint_path: string;
    provider_type: string;
    webhook_signing_key_hash: string;
    is_enabled: boolean;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIntgOutgoingWebhook {
    id: string;
    organization_id: string;
    hub_id: string;
    webhook_key: string;
    webhook_name: string;
    target_url: string;
    event_types: unknown[];
    webhook_signing_key_hash: string;
    is_enabled: boolean;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIntgWebhookDeadLetter {
    id: string;
    organization_id: string;
    hub_id: string;
    outgoing_webhook_id?: string | null;
    dead_letter_key: string;
    event_type: string;
    payload: Record<string, unknown>;
    dead_letter_status: string;
    retry_count: number;
    last_error: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIntgWebhookDeliveryLog {
    id: string;
    organization_id: string;
    hub_id: string;
    outgoing_webhook_id: string;
    delivery_key: string;
    event_type: string;
    http_status: number;
    delivery_status: string;
    response_body: string;
    delivered_at?: string | null;
    latency_ms: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIntgMarketplaceConnector {
    id: string;
    organization_id: string;
    hub_id: string;
    connector_slug: string;
    connector_name: string;
    provider_type: string;
    category: string;
    description: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIntgMarketplaceInstallation {
    id: string;
    organization_id: string;
    hub_id: string;
    marketplace_connector_id: string;
    installation_key: string;
    connector_status: string;
    installed_at: string;
    config: Record<string, unknown>;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIntgMarketplaceCompatibility {
    id: string;
    organization_id: string;
    hub_id: string;
    marketplace_connector_id: string;
    compatibility_key: string;
    min_api_version: string;
    max_api_version: string;
    platform_requirements: Record<string, unknown>;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIntgMarketplaceVersion {
    id: string;
    organization_id: string;
    hub_id: string;
    marketplace_connector_id: string;
    version_key: string;
    version_number: string;
    api_version: string;
    changelog: string;
    published_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIntgApiAnalytics {
    id: string;
    organization_id: string;
    hub_id: string;
    analytics_key: string;
    metric_date: string;
    total_requests: number;
    total_errors: number;
    error_rate: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIntgLatencyMetric {
    id: string;
    organization_id: string;
    hub_id: string;
    metrics_key: string;
    metric_date: string;
    endpoint: string;
    p50_ms: number;
    p95_ms: number;
    p99_ms: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIntgWebhookAnalytics {
    id: string;
    organization_id: string;
    hub_id: string;
    analytics_key: string;
    metric_date: string;
    total_deliveries: number;
    successful_deliveries: number;
    failed_deliveries: number;
    success_rate: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIntgUsageTrend {
    id: string;
    organization_id: string;
    hub_id: string;
    trend_key: string;
    metric_date: string;
    trend_direction: string;
    usage_delta: number;
    baseline_value: number;
    current_value: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIntgIntegrationMetric {
    id: string;
    organization_id: string;
    metrics_key: string;
    metric_date: string;
    active_connectors: number;
    total_api_calls: number;
    total_webhook_deliveries: number;
    overall_success_rate: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIntgIntegrationHealth {
    id: string;
    organization_id: string;
    health_key: string;
    health_date: string;
    overall_score: number;
    uptime_percent: number;
    active_connectors: number;
    degraded_connectors: number;
    disaster_recovery_mode: boolean;
    summary: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIntgIntegrationFailure {
    id: string;
    organization_id: string;
    hub_id: string;
    failure_key: string;
    provider_type: string;
    error_code: string;
    error_message: string;
    retry_count: number;
    failed_at: string;
    resolved_at?: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIntgAuditLog {
    id: string;
    organization_id: string;
    entity_type: string;
    entity_id?: string | null;
    action: string;
    summary: string;
    metadata: Record<string, unknown>;
    performed_by?: string | null;
    security_level: string;
    created_at: string;
}

export interface DbEocOperationsCenter {
    id: string;
    organization_id: string;
    center_key: string;
    center_name: string;
    environment: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbEocOverallHealth {
    id: string;
    organization_id: string;
    center_id: string;
    health_key: string;
    health_type: string;
    health_score: number;
    last_check_at: string;
    check_details: Record<string, unknown>;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbEocModuleHealth {
    id: string;
    organization_id: string;
    center_id: string;
    health_key: string;
    module_name: string;
    health_score: number;
    last_check_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbEocDatabaseHealth {
    id: string;
    organization_id: string;
    center_id: string;
    health_key: string;
    connection_pool_used: number;
    health_score: number;
    last_check_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbEocJobScheduler {
    id: string;
    organization_id: string;
    center_id: string;
    scheduler_key: string;
    scheduler_name: string;
    cron_expression: string;
    worker_pool_size: number;
    scheduler_status: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbEocRecurringJob {
    id: string;
    organization_id: string;
    center_id: string;
    job_key: string;
    job_name: string;
    cron_expression: string;
    job_status: string;
    last_run_at?: string;
    next_run_at?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbEocJobRetryQueue {
    id: string;
    organization_id: string;
    center_id: string;
    queue_key: string;
    job_ref: string;
    retry_count: number;
    max_retries: number;
    priority: number;
    next_retry_at?: string;
    last_error: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbEocJobDeadLetter {
    id: string;
    organization_id: string;
    center_id: string;
    dead_letter_key: string;
    job_ref: string;
    error_message: string;
    dead_letter_status: string;
    failed_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbEocPlatformEvent {
    id: string;
    organization_id: string;
    center_id: string;
    event_key: string;
    event_type: string;
    event_name: string;
    payload: Record<string, unknown>;
    event_status: string;
    published_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbEocBusinessEvent {
    id: string;
    organization_id: string;
    center_id: string;
    event_key: string;
    event_type: string;
    event_name: string;
    payload: Record<string, unknown>;
    event_status: string;
    published_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbEocEventSubscription {
    id: string;
    organization_id: string;
    center_id: string;
    subscription_key: string;
    event_type: string;
    subscriber_ref: string;
    delivery_mode: string;
    subscription_status: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbEocEventReplay {
    id: string;
    organization_id: string;
    center_id: string;
    replay_key: string;
    event_type: string;
    from_timestamp: string;
    to_timestamp?: string;
    replay_status: string;
    events_replayed: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbEocAlert {
    id: string;
    organization_id: string;
    center_id: string;
    alert_key: string;
    alert_title: string;
    alert_severity: string;
    alert_message: string;
    silenced: boolean;
    alert_status: string;
    triggered_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbEocEscalationRule {
    id: string;
    organization_id: string;
    center_id: string;
    rule_key: string;
    rule_name: string;
    alert_severity: string;
    escalation_delay_minutes: number;
    notify_channels: Record<string, unknown>;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbEocAlertAcknowledgement {
    id: string;
    organization_id: string;
    center_id: string;
    ack_key: string;
    alert_id?: string;
    acknowledged_by: string;
    ack_note: string;
    ack_status: string;
    acknowledged_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbEocMaintenanceWindow {
    id: string;
    organization_id: string;
    center_id: string;
    window_key: string;
    window_name: string;
    starts_at: string;
    ends_at?: string;
    suppress_alerts: boolean;
    window_status: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbEocGlobalFlag {
    id: string;
    organization_id: string;
    center_id: string;
    flag_key: string;
    flag_name: string;
    enabled: boolean;
    kill_switch: boolean;
    rollout_percent: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbEocTenantFlag {
    id: string;
    organization_id: string;
    center_id: string;
    flag_key: string;
    flag_name: string;
    enabled: boolean;
    tenant_ref: string;
    rollout_percent: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbEocBetaFeature {
    id: string;
    organization_id: string;
    center_id: string;
    feature_key: string;
    feature_name: string;
    beta_status: string;
    enrolled_tenants: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbEocRolloutConfig {
    id: string;
    organization_id: string;
    center_id: string;
    rollout_key: string;
    flag_key: string;
    rollout_percent: number;
    target_criteria: Record<string, unknown>;
    rollout_status: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbEocPlatformConfig {
    id: string;
    organization_id: string;
    center_id: string;
    config_key: string;
    config_name: string;
    config_value: Record<string, unknown>;
    environment_profile: string;
    approval_status: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbEocTenantConfig {
    id: string;
    organization_id: string;
    center_id: string;
    config_key: string;
    config_name: string;
    config_value: Record<string, unknown>;
    tenant_ref: string;
    approval_status: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbEocSecretsMetadata {
    id: string;
    organization_id: string;
    center_id: string;
    secret_key: string;
    secret_name: string;
    vault_ref: string;
    rotation_due_at?: string;
    secret_status: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbEocConfigVersion {
    id: string;
    organization_id: string;
    center_id: string;
    version_key: string;
    version_number: string;
    config_snapshot: Record<string, unknown>;
    approved_by: string;
    version_status: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbEocPlatformLog {
    id: string;
    organization_id: string;
    center_id: string;
    log_key: string;
    log_level: string;
    service_name: string;
    message: string;
    logged_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbEocPlatformMetric {
    id: string;
    organization_id: string;
    center_id: string;
    metrics_key: string;
    metric_date: string;
    dependency_health: number;
    cpu_percent: number;
    memory_percent: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbEocTraceSummary {
    id: string;
    organization_id: string;
    center_id: string;
    trace_key: string;
    trace_id: string;
    span_count: number;
    duration_ms: number;
    traced_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbEocServiceRegistry {
    id: string;
    organization_id: string;
    center_id: string;
    service_key: string;
    service_name: string;
    service_url: string;
    cache_status: string;
    last_heartbeat_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbEocOperationsMetric {
    id: string;
    organization_id: string;
    metrics_key: string;
    metric_date: string;
    operational_score: number;
    active_jobs: number;
    open_alerts: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbEocOperationsHealth {
    id: string;
    organization_id: string;
    health_key: string;
    health_date: string;
    overall_score: number;
    uptime_percent: number;
    disaster_recovery_mode: boolean;
    summary: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbEocOperationsFailure {
    id: string;
    organization_id: string;
    center_id: string;
    failure_key: string;
    failure_type: string;
    error_code: string;
    error_message: string;
    failed_at: string;
    resolved_at?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbEocAuditLog {
    id: string;
    organization_id: string;
    entity_type: string;
    entity_id?: string | null;
    action: string;
    summary: string;
    metadata: Record<string, unknown>;
    performed_by?: string | null;
    security_level: string;
    created_at: string;
}

export interface DbAixIntelligenceHub {
    id: string;
    organization_id: string;
    hub_key: string;
    hub_name: string;
    environment: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbAixDailyExecutiveBrief {
    id: string;
    organization_id: string;
    hub_id: string;
    brief_key: string;
    brief_date: string;
    summary: string;
    ai_confidence_score: number;
    evidence_refs: Record<string, unknown>;
    generated_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbAixWeeklyBusinessReview {
    id: string;
    organization_id: string;
    hub_id: string;
    review_key: string;
    week_start: string;
    summary: string;
    ai_confidence_score: number;
    evidence_refs: Record<string, unknown>;
    generated_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbAixMonthlyExecutiveSummary {
    id: string;
    organization_id: string;
    hub_id: string;
    summary_key: string;
    month_start: string;
    summary: string;
    ai_confidence_score: number;
    evidence_refs: Record<string, unknown>;
    generated_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbAixTrialConversionScore {
    id: string;
    organization_id: string;
    hub_id: string;
    score_key: string;
    conversion_rate: number;
    trial_count: number;
    converted_count: number;
    ai_confidence_score: number;
    scored_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbAixRenewalProbability {
    id: string;
    organization_id: string;
    hub_id: string;
    probability_key: string;
    renewal_probability: number;
    account_ref: string;
    contract_end_date?: string;
    ai_confidence_score: number;
    scored_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbAixChurnRisk {
    id: string;
    organization_id: string;
    hub_id: string;
    risk_key: string;
    churn_score: number;
    risk_level: string;
    account_ref: string;
    ai_confidence_score: number;
    scored_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbAixExpansionOpportunity {
    id: string;
    organization_id: string;
    hub_id: string;
    opportunity_key: string;
    expansion_score: number;
    account_ref: string;
    opportunity_type: string;
    ai_confidence_score: number;
    scored_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbAixMrrTrend {
    id: string;
    organization_id: string;
    hub_id: string;
    trend_key: string;
    mrr_amount: number;
    trend_direction: string;
    period_start: string;
    ai_confidence_score: number;
    recorded_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbAixArrTrend {
    id: string;
    organization_id: string;
    hub_id: string;
    trend_key: string;
    arr_amount: number;
    trend_direction: string;
    period_start: string;
    ai_confidence_score: number;
    recorded_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbAixRevenueGrowthMetric {
    id: string;
    organization_id: string;
    hub_id: string;
    metrics_key: string;
    growth_rate: number;
    period_start: string;
    period_end: string;
    ai_confidence_score: number;
    recorded_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbAixRevenueRisk {
    id: string;
    organization_id: string;
    hub_id: string;
    risk_key: string;
    risk_amount: number;
    risk_level: string;
    risk_category: string;
    ai_confidence_score: number;
    scored_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbAixPlatformHealthIntel {
    id: string;
    organization_id: string;
    hub_id: string;
    intel_key: string;
    health_score: number;
    component_summary: string;
    ai_confidence_score: number;
    last_check_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbAixQueueHealthIntel {
    id: string;
    organization_id: string;
    hub_id: string;
    intel_key: string;
    queue_depth: number;
    health_score: number;
    queue_name: string;
    ai_confidence_score: number;
    last_check_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbAixIntegrationHealthIntel {
    id: string;
    organization_id: string;
    hub_id: string;
    intel_key: string;
    integration_name: string;
    health_score: number;
    error_rate: number;
    ai_confidence_score: number;
    last_check_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbAixPerformanceTrend {
    id: string;
    organization_id: string;
    hub_id: string;
    trend_key: string;
    performance_score: number;
    trend_direction: string;
    metric_window: string;
    ai_confidence_score: number;
    recorded_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbAixUnusualLoginActivity {
    id: string;
    organization_id: string;
    hub_id: string;
    activity_key: string;
    login_count: number;
    risk_level: string;
    user_ref: string;
    geo_anomaly: string;
    ai_confidence_score: number;
    detected_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbAixPermissionRisk {
    id: string;
    organization_id: string;
    hub_id: string;
    risk_key: string;
    risk_type: string;
    risk_level: string;
    subject_ref: string;
    permission_summary: string;
    ai_confidence_score: number;
    scored_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbAixTenantSecurityTrend {
    id: string;
    organization_id: string;
    hub_id: string;
    trend_key: string;
    security_score: number;
    trend_direction: string;
    tenant_ref: string;
    ai_confidence_score: number;
    recorded_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbAixComplianceWarning {
    id: string;
    organization_id: string;
    hub_id: string;
    warning_key: string;
    compliance_type: string;
    severity: string;
    warning_message: string;
    due_date?: string;
    ai_confidence_score: number;
    detected_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbAixTodayPriority {
    id: string;
    organization_id: string;
    hub_id: string;
    priority_key: string;
    priority_title: string;
    priority_rank: number;
    priority_category: string;
    ai_confidence_score: number;
    priority_date: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbAixRecommendedAction {
    id: string;
    organization_id: string;
    hub_id: string;
    action_key: string;
    action_title: string;
    action_type: string;
    action_summary: string;
    ai_confidence_score: number;
    evidence_refs: Record<string, unknown>;
    recommended_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbAixBusinessRisk {
    id: string;
    organization_id: string;
    hub_id: string;
    risk_key: string;
    risk_title: string;
    risk_level: string;
    risk_category: string;
    impact_summary: string;
    ai_confidence_score: number;
    scored_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbAixGrowthOpportunity {
    id: string;
    organization_id: string;
    hub_id: string;
    opportunity_key: string;
    opportunity_title: string;
    growth_score: number;
    opportunity_category: string;
    impact_summary: string;
    ai_confidence_score: number;
    scored_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbAixKnowledgeReasoningSession {
    id: string;
    organization_id: string;
    hub_id: string;
    session_key: string;
    reasoning_type: string;
    objective: string;
    ai_confidence_score: number;
    started_at: string;
    completed_at?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbAixEvidenceTrace {
    id: string;
    organization_id: string;
    hub_id: string;
    trace_key: string;
    source_module: string;
    trace_summary: string;
    evidence_refs: Record<string, unknown>;
    traced_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbAixOrchestrationLink {
    id: string;
    organization_id: string;
    hub_id: string;
    link_key: string;
    link_type: string;
    target_ref: string;
    link_context: Record<string, unknown>;
    ai_confidence_score: number;
    linked_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbAixRecommendationOutput {
    id: string;
    organization_id: string;
    hub_id: string;
    output_key: string;
    recommendation_text: string;
    recommendation_type: string;
    ai_confidence_score: number;
    evidence_refs: Record<string, unknown>;
    generated_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbAixExecutiveMetric {
    id: string;
    organization_id: string;
    metrics_key: string;
    metric_date: string;
    business_score: number;
    growth_score: number;
    operational_score: number;
    security_score: number;
    customer_score: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbAixExecutiveHealth {
    id: string;
    organization_id: string;
    health_key: string;
    health_date: string;
    overall_score: number;
    uptime_percent: number;
    disaster_recovery_mode: boolean;
    summary: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbAixExecutiveFailure {
    id: string;
    organization_id: string;
    hub_id: string;
    failure_key: string;
    failure_type: string;
    error_code: string;
    error_message: string;
    failed_at: string;
    resolved_at?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbAixAuditLog {
    id: string;
    organization_id: string;
    entity_type: string;
    entity_id?: string | null;
    action: string;
    summary: string;
    metadata: Record<string, unknown>;
    performed_by?: string | null;
    security_level: string;
    created_at: string;
}

export interface DbElrReadinessHub {
    id: string;
    organization_id: string;
    hub_key: string;
    hub_name: string;
    environment: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbElrEnvironmentValidation {
    id: string;
    organization_id: string;
    hub_id: string;
    validation_key: string;
    validation_type: string;
    validation_score: number;
    validation_summary: string;
    validated_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbElrConfigurationValidation {
    id: string;
    organization_id: string;
    hub_id: string;
    validation_key: string;
    config_type: string;
    validation_score: number;
    config_ref: string;
    validated_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbElrSecretsValidation {
    id: string;
    organization_id: string;
    hub_id: string;
    validation_key: string;
    secret_type: string;
    validation_score: number;
    secret_ref: string;
    validated_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbElrDeploymentPlan {
    id: string;
    organization_id: string;
    hub_id: string;
    plan_key: string;
    plan_name: string;
    target_version: string;
    deployment_strategy: string;
    scheduled_at?: string;
    approved_at?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbElrRollbackPlan {
    id: string;
    organization_id: string;
    hub_id: string;
    plan_key: string;
    rollback_version: string;
    rollback_reason: string;
    trigger_condition: string;
    prepared_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbElrVersionRegistry {
    id: string;
    organization_id: string;
    hub_id: string;
    version_key: string;
    version_number: string;
    release_channel: string;
    artifact_ref: string;
    registered_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbElrReleaseNote {
    id: string;
    organization_id: string;
    hub_id: string;
    note_key: string;
    version_ref: string;
    note_summary: string;
    change_log: Record<string, unknown>;
    published_at?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbElrBackupPolicy {
    id: string;
    organization_id: string;
    hub_id: string;
    policy_key: string;
    policy_name: string;
    retention_days: number;
    backup_frequency: string;
    storage_target: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbElrBackupVerification {
    id: string;
    organization_id: string;
    hub_id: string;
    verification_key: string;
    backup_ref: string;
    verification_score: number;
    verification_summary: string;
    verified_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbElrRestoreVerification {
    id: string;
    organization_id: string;
    hub_id: string;
    verification_key: string;
    restore_ref: string;
    verification_score: number;
    verification_summary: string;
    verified_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbElrRecoveryDrill {
    id: string;
    organization_id: string;
    hub_id: string;
    drill_key: string;
    drill_type: string;
    drill_score: number;
    drill_summary: string;
    completed_at?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbElrObservabilityLog {
    id: string;
    organization_id: string;
    hub_id: string;
    log_key: string;
    log_level: string;
    log_source: string;
    log_message: string;
    logged_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbElrObservabilityMetric {
    id: string;
    organization_id: string;
    hub_id: string;
    metric_key: string;
    metric_name: string;
    metric_value: number;
    metric_unit: string;
    recorded_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbElrTraceRecord {
    id: string;
    organization_id: string;
    hub_id: string;
    trace_key: string;
    trace_name: string;
    latency_ms: number;
    span_count: number;
    traced_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbElrSlaMonitor {
    id: string;
    organization_id: string;
    hub_id: string;
    monitor_key: string;
    sla_target: number;
    current_value: number;
    service_ref: string;
    measured_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbElrSecurityChecklist {
    id: string;
    organization_id: string;
    hub_id: string;
    checklist_key: string;
    checklist_name: string;
    completion_score: number;
    checklist_items: Record<string, unknown>;
    reviewed_at?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbElrVulnerabilityReview {
    id: string;
    organization_id: string;
    hub_id: string;
    review_key: string;
    vulnerability_ref: string;
    severity: string;
    review_summary: string;
    reviewed_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbElrPermissionAudit {
    id: string;
    organization_id: string;
    hub_id: string;
    audit_key: string;
    audit_scope: string;
    finding_count: number;
    audit_summary: string;
    audited_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbElrComplianceReview {
    id: string;
    organization_id: string;
    hub_id: string;
    review_key: string;
    compliance_type: string;
    review_score: number;
    review_summary: string;
    reviewed_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbElrAdminGuide {
    id: string;
    organization_id: string;
    hub_id: string;
    guide_key: string;
    guide_title: string;
    guide_version: string;
    guide_content: string;
    published_at?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbElrUserGuide {
    id: string;
    organization_id: string;
    hub_id: string;
    guide_key: string;
    guide_title: string;
    guide_version: string;
    guide_content: string;
    published_at?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbElrDeploymentGuide {
    id: string;
    organization_id: string;
    hub_id: string;
    guide_key: string;
    guide_title: string;
    guide_version: string;
    guide_content: string;
    published_at?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbElrLaunchScoreMetric {
    id: string;
    organization_id: string;
    metrics_key: string;
    metric_date: string;
    security_score: number;
    reliability_score: number;
    performance_score: number;
    documentation_score: number;
    operational_score: number;
    overall_launch_score: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbElrReadinessValidation {
    id: string;
    organization_id: string;
    hub_id: string;
    validation_key: string;
    validation_type: string;
    validation_score: number;
    validation_summary: string;
    validated_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbElrLaunchBlocker {
    id: string;
    organization_id: string;
    hub_id: string;
    blocker_key: string;
    blocker_title: string;
    blocker_severity: string;
    blocker_summary: string;
    detected_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbElrScoreSnapshot {
    id: string;
    organization_id: string;
    hub_id: string;
    snapshot_key: string;
    snapshot_date: string;
    overall_launch_score: number;
    score_breakdown: Record<string, unknown>;
    captured_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbElrLaunchHealth {
    id: string;
    organization_id: string;
    health_key: string;
    health_date: string;
    overall_score: number;
    disaster_recovery_mode: boolean;
    deployment_status: string;
    backup_status: string;
    security_status: string;
    summary: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbElrCriticalIssue {
    id: string;
    organization_id: string;
    hub_id: string;
    issue_key: string;
    issue_title: string;
    issue_severity: string;
    issue_summary: string;
    detected_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbElrReadinessWarning {
    id: string;
    organization_id: string;
    hub_id: string;
    warning_key: string;
    warning_type: string;
    warning_message: string;
    due_date?: string;
    detected_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbElrLaunchFailure {
    id: string;
    organization_id: string;
    hub_id: string;
    failure_key: string;
    failure_type: string;
    error_code: string;
    error_message: string;
    failed_at: string;
    resolved_at?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbElrAuditLog {
    id: string;
    organization_id: string;
    entity_type: string;
    entity_id?: string | null;
    action: string;
    summary: string;
    metadata: Record<string, unknown>;
    performed_by?: string | null;
    security_level: string;
    created_at: string;
}

export interface DbIfrFrameworkHub {
    id: string;
    organization_id: string;
    hub_key: string;
    hub_name: string;
    environment: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIfrIndustryRegistration {
    id: string;
    organization_id: string;
    hub_id: string;
    registration_key: string;
    industry_code: string;
    industry_name: string;
    registered_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIfrIndustryMetadata {
    id: string;
    organization_id: string;
    hub_id: string;
    metadata_key: string;
    metadata_type: string;
    metadata_value: Record<string, unknown>;
    updated_at_ref: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIfrIndustryVersion {
    id: string;
    organization_id: string;
    hub_id: string;
    version_key: string;
    version_number: string;
    release_channel: string;
    published_at?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIfrIndustryDependency {
    id: string;
    organization_id: string;
    hub_id: string;
    dependency_key: string;
    dependency_type: string;
    dependency_ref: string;
    resolved_at?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIfrBusinessType {
    id: string;
    organization_id: string;
    hub_id: string;
    type_key: string;
    type_name: string;
    type_category: string;
    description: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIfrBusinessSize {
    id: string;
    organization_id: string;
    hub_id: string;
    size_key: string;
    size_label: string;
    employee_range: string;
    revenue_range: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIfrOperatingModel {
    id: string;
    organization_id: string;
    hub_id: string;
    model_key: string;
    model_name: string;
    model_type: string;
    description: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIfrIndustryProfile {
    id: string;
    organization_id: string;
    hub_id: string;
    profile_key: string;
    profile_name: string;
    profile_score: number;
    profile_summary: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIfrDashboardTemplate {
    id: string;
    organization_id: string;
    hub_id: string;
    template_key: string;
    template_name: string;
    template_version: string;
    layout_ref: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIfrWorkflowTemplate {
    id: string;
    organization_id: string;
    hub_id: string;
    template_key: string;
    template_name: string;
    workflow_type: string;
    steps_count: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIfrRoleTemplate {
    id: string;
    organization_id: string;
    hub_id: string;
    template_key: string;
    role_name: string;
    permissions_count: number;
    role_level: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIfrReportTemplate {
    id: string;
    organization_id: string;
    hub_id: string;
    template_key: string;
    report_name: string;
    report_format: string;
    schedule_ref: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIfrDynamicConfiguration {
    id: string;
    organization_id: string;
    hub_id: string;
    config_key: string;
    config_type: string;
    config_value: Record<string, unknown>;
    effective_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIfrFeatureConfiguration {
    id: string;
    organization_id: string;
    hub_id: string;
    feature_key: string;
    feature_name: string;
    enabled: boolean;
    rollout_percentage: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIfrBusinessRule {
    id: string;
    organization_id: string;
    hub_id: string;
    rule_key: string;
    rule_name: string;
    rule_type: string;
    rule_expression: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIfrValidationRule {
    id: string;
    organization_id: string;
    hub_id: string;
    rule_key: string;
    rule_name: string;
    validation_type: string;
    validation_score: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIfrIndustryContext {
    id: string;
    organization_id: string;
    hub_id: string;
    context_key: string;
    context_type: string;
    context_payload: Record<string, unknown>;
    refreshed_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIfrAiContext {
    id: string;
    organization_id: string;
    hub_id: string;
    context_key: string;
    context_type: string;
    model_ref: string;
    token_count: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIfrTerminologyEntry {
    id: string;
    organization_id: string;
    hub_id: string;
    term_key: string;
    term_label: string;
    term_definition: string;
    locale: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIfrDemoProfile {
    id: string;
    organization_id: string;
    hub_id: string;
    profile_key: string;
    profile_name: string;
    demo_duration_days: number;
    seed_data_ref: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIfrProductionProfile {
    id: string;
    organization_id: string;
    hub_id: string;
    profile_key: string;
    profile_name: string;
    deployment_target: string;
    scaling_tier: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIfrEnterpriseProfile {
    id: string;
    organization_id: string;
    hub_id: string;
    profile_key: string;
    profile_name: string;
    compliance_tier: string;
    sla_target: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIfrSharedApi {
    id: string;
    organization_id: string;
    hub_id: string;
    api_key: string;
    api_name: string;
    api_version: string;
    endpoint_ref: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIfrContextApi {
    id: string;
    organization_id: string;
    hub_id: string;
    api_key: string;
    api_name: string;
    context_type: string;
    endpoint_ref: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIfrConfigurationApi {
    id: string;
    organization_id: string;
    hub_id: string;
    api_key: string;
    api_name: string;
    config_scope: string;
    endpoint_ref: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIfrExtensionPoint {
    id: string;
    organization_id: string;
    hub_id: string;
    extension_key: string;
    extension_name: string;
    hook_type: string;
    plugin_ref: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIfrFrameworkMetric {
    id: string;
    organization_id: string;
    metrics_key: string;
    metric_date: string;
    template_score: number;
    profile_score: number;
    compatibility_score: number;
    sdk_score: number;
    framework_health_score: number;
    overall_framework_score: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIfrFrameworkHealth {
    id: string;
    organization_id: string;
    health_key: string;
    health_date: string;
    overall_score: number;
    disaster_recovery_mode: boolean;
    compatibility_status: string;
    sdk_status: string;
    template_status: string;
    summary: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIfrCompatibilityCheck {
    id: string;
    organization_id: string;
    hub_id: string;
    check_key: string;
    check_type: string;
    check_score: number;
    check_summary: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIfrFrameworkFailure {
    id: string;
    organization_id: string;
    hub_id: string;
    failure_key: string;
    failure_type: string;
    error_code: string;
    error_message: string;
    failed_at: string;
    resolved_at?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbIfrAuditLog {
    id: string;
    organization_id: string;
    entity_type: string;
    entity_id?: string | null;
    action: string;
    summary: string;
    metadata: Record<string, unknown>;
    performed_by?: string | null;
    security_level: string;
    created_at: string;
}

export interface DbBpfProcessHub {
    id: string;
    organization_id: string;
    hub_key: string;
    hub_name: string;
    environment: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBpfBusinessProcess {
    id: string;
    organization_id: string;
    hub_id: string;
    process_key: string;
    process_name: string;
    process_type: string;
    description: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBpfProcessCategory {
    id: string;
    organization_id: string;
    hub_id: string;
    category_key: string;
    category_name: string;
    category_type: string;
    description: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBpfProcessVersion {
    id: string;
    organization_id: string;
    hub_id: string;
    version_key: string;
    version_number: string;
    release_channel: string;
    published_at?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBpfProcessDependency {
    id: string;
    organization_id: string;
    hub_id: string;
    dependency_key: string;
    dependency_type: string;
    dependency_ref: string;
    resolved_at?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBpfProcessModel {
    id: string;
    organization_id: string;
    hub_id: string;
    model_key: string;
    model_name: string;
    model_type: string;
    description: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBpfProcessStep {
    id: string;
    organization_id: string;
    hub_id: string;
    step_key: string;
    step_name: string;
    step_order: number;
    step_type: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBpfDecisionPoint {
    id: string;
    organization_id: string;
    hub_id: string;
    decision_key: string;
    decision_name: string;
    decision_type: string;
    decision_expression: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBpfReusableBlock {
    id: string;
    organization_id: string;
    hub_id: string;
    block_key: string;
    block_name: string;
    block_type: string;
    block_ref: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBpfApprovalRule {
    id: string;
    organization_id: string;
    hub_id: string;
    rule_key: string;
    rule_name: string;
    rule_type: string;
    rule_expression: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBpfSequentialApproval {
    id: string;
    organization_id: string;
    hub_id: string;
    approval_key: string;
    approval_name: string;
    approval_order: number;
    approver_ref: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBpfParallelApproval {
    id: string;
    organization_id: string;
    hub_id: string;
    approval_key: string;
    approval_name: string;
    approver_count: number;
    quorum_required: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBpfEscalationRule {
    id: string;
    organization_id: string;
    hub_id: string;
    escalation_key: string;
    escalation_name: string;
    escalation_level: number;
    timeout_hours: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBpfTaskAssignment {
    id: string;
    organization_id: string;
    hub_id: string;
    assignment_key: string;
    assignment_name: string;
    assignee_ref: string;
    priority: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBpfTaskTemplate {
    id: string;
    organization_id: string;
    hub_id: string;
    template_key: string;
    template_name: string;
    template_type: string;
    steps_count: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBpfRecurringTask {
    id: string;
    organization_id: string;
    hub_id: string;
    task_key: string;
    task_name: string;
    recurrence_pattern: string;
    next_run_at?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBpfTaskSlaPolicy {
    id: string;
    organization_id: string;
    hub_id: string;
    policy_key: string;
    policy_name: string;
    sla_hours: number;
    breach_action: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBpfRuleCondition {
    id: string;
    organization_id: string;
    hub_id: string;
    condition_key: string;
    condition_name: string;
    condition_type: string;
    condition_expression: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBpfRuleValidation {
    id: string;
    organization_id: string;
    hub_id: string;
    validation_key: string;
    validation_name: string;
    validation_type: string;
    validation_score: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBpfRuleCalculation {
    id: string;
    organization_id: string;
    hub_id: string;
    calculation_key: string;
    calculation_name: string;
    calculation_type: string;
    formula_ref: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBpfReusableRule {
    id: string;
    organization_id: string;
    hub_id: string;
    rule_key: string;
    rule_name: string;
    rule_type: string;
    rule_expression: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBpfProcessExecution {
    id: string;
    organization_id: string;
    hub_id: string;
    execution_key: string;
    execution_name: string;
    execution_status: string;
    started_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBpfExecutionHistory {
    id: string;
    organization_id: string;
    hub_id: string;
    history_key: string;
    history_type: string;
    history_summary: string;
    recorded_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBpfExecutionRetry {
    id: string;
    organization_id: string;
    hub_id: string;
    retry_key: string;
    retry_count: number;
    retry_reason: string;
    retried_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBpfExecutionAnalytics {
    id: string;
    organization_id: string;
    hub_id: string;
    analytics_key: string;
    analytics_type: string;
    analytics_score: number;
    metric_date: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBpfBottleneckReport {
    id: string;
    organization_id: string;
    hub_id: string;
    report_key: string;
    report_name: string;
    bottleneck_score: number;
    report_summary: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBpfSlaPerformanceMetric {
    id: string;
    organization_id: string;
    hub_id: string;
    metric_key: string;
    metric_name: string;
    sla_score: number;
    metric_date: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBpfProcessMetric {
    id: string;
    organization_id: string;
    metrics_key: string;
    metric_date: string;
    execution_count: number;
    average_duration_ms: number;
    success_rate: number;
    failure_count: number;
    bottleneck_score: number;
    sla_performance_score: number;
    overall_process_score: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBpfProcessHealth {
    id: string;
    organization_id: string;
    health_key: string;
    health_date: string;
    overall_score: number;
    disaster_recovery_mode: boolean;
    pending_approvals_count: number;
    active_process_count: number;
    task_queue_depth: number;
    framework_health_status: string;
    summary: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBpfFailedProcessRecord {
    id: string;
    organization_id: string;
    hub_id: string;
    record_key: string;
    record_name: string;
    failure_type: string;
    error_message: string;
    failed_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBpfProcessFailure {
    id: string;
    organization_id: string;
    hub_id: string;
    failure_key: string;
    failure_type: string;
    error_code: string;
    error_message: string;
    failed_at: string;
    resolved_at?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbBpfAuditLog {
    id: string;
    organization_id: string;
    entity_type: string;
    entity_id?: string | null;
    action: string;
    summary: string;
    metadata: Record<string, unknown>;
    performed_by?: string | null;
    security_level: string;
    created_at: string;
}

export interface DbDfeFormHub {
    id: string;
    organization_id: string;
    hub_key: string;
    hub_name: string;
    environment: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDfeFormDefinition {
    id: string;
    organization_id: string;
    hub_id: string;
    form_key: string;
    form_name: string;
    form_type: string;
    description: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDfeFormCategory {
    id: string;
    organization_id: string;
    hub_id: string;
    category_key: string;
    category_name: string;
    category_type: string;
    description: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDfeFormVersion {
    id: string;
    organization_id: string;
    hub_id: string;
    version_key: string;
    version_number: string;
    release_channel: string;
    published_at?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDfeFormDependency {
    id: string;
    organization_id: string;
    hub_id: string;
    dependency_key: string;
    dependency_type: string;
    dependency_ref: string;
    resolved_at?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDfeFormSection {
    id: string;
    organization_id: string;
    hub_id: string;
    section_key: string;
    section_name: string;
    section_order: number;
    section_type: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDfeFormTab {
    id: string;
    organization_id: string;
    hub_id: string;
    tab_key: string;
    tab_name: string;
    tab_order: number;
    tab_type: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDfeFormGroup {
    id: string;
    organization_id: string;
    hub_id: string;
    group_key: string;
    group_name: string;
    group_order: number;
    group_type: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDfeRepeatableSection {
    id: string;
    organization_id: string;
    hub_id: string;
    section_key: string;
    section_name: string;
    min_instances: number;
    max_instances: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDfeFormField {
    id: string;
    organization_id: string;
    hub_id: string;
    field_key: string;
    field_name: string;
    field_type: string;
    field_order: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDfeFieldOption {
    id: string;
    organization_id: string;
    hub_id: string;
    option_key: string;
    option_label: string;
    option_value: string;
    option_order: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDfeFormulaField {
    id: string;
    organization_id: string;
    hub_id: string;
    formula_key: string;
    formula_name: string;
    formula_expression: string;
    result_type: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDfeMediaField {
    id: string;
    organization_id: string;
    hub_id: string;
    media_key: string;
    media_name: string;
    media_type: string;
    max_file_size_mb: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDfeRequiredRule {
    id: string;
    organization_id: string;
    hub_id: string;
    rule_key: string;
    rule_name: string;
    field_ref: string;
    error_message: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDfeRegexRule {
    id: string;
    organization_id: string;
    hub_id: string;
    rule_key: string;
    rule_name: string;
    pattern: string;
    error_message: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDfeRangeRule {
    id: string;
    organization_id: string;
    hub_id: string;
    rule_key: string;
    rule_name: string;
    min_value?: number;
    max_value?: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDfeCrossFieldRule {
    id: string;
    organization_id: string;
    hub_id: string;
    rule_key: string;
    rule_name: string;
    rule_expression: string;
    error_message: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDfeFormDraft {
    id: string;
    organization_id: string;
    hub_id: string;
    draft_key: string;
    draft_name: string;
    draft_status: string;
    saved_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDfeFormSubmission {
    id: string;
    organization_id: string;
    hub_id: string;
    submission_key: string;
    submission_name: string;
    submission_status: string;
    submitted_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDfeFormReview {
    id: string;
    organization_id: string;
    hub_id: string;
    review_key: string;
    review_name: string;
    review_status: string;
    reviewed_at?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDfeExecutionAuditEntry {
    id: string;
    organization_id: string;
    hub_id: string;
    audit_key: string;
    audit_type: string;
    audit_summary: string;
    recorded_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDfeRenderProfile {
    id: string;
    organization_id: string;
    hub_id: string;
    profile_key: string;
    profile_name: string;
    profile_type: string;
    layout_mode: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDfeThemeConfig {
    id: string;
    organization_id: string;
    hub_id: string;
    theme_key: string;
    theme_name: string;
    primary_color: string;
    theme_mode: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDfeLocalizationPack {
    id: string;
    organization_id: string;
    hub_id: string;
    locale_key: string;
    locale_code: string;
    locale_name: string;
    translation_count: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDfeSubmissionAnalytics {
    id: string;
    organization_id: string;
    hub_id: string;
    analytics_key: string;
    analytics_type: string;
    analytics_score: number;
    metric_date: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDfeCompletionMetric {
    id: string;
    organization_id: string;
    hub_id: string;
    metric_key: string;
    metric_name: string;
    completion_rate: number;
    metric_date: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDfeUsageTrend {
    id: string;
    organization_id: string;
    hub_id: string;
    trend_key: string;
    trend_name: string;
    trend_value: number;
    trend_date: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDfeFormMetric {
    id: string;
    organization_id: string;
    metrics_key: string;
    metric_date: string;
    submission_count: number;
    completion_rate: number;
    average_completion_time_ms: number;
    validation_error_count: number;
    abandonment_rate: number;
    overall_form_score: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDfeFormHealth {
    id: string;
    organization_id: string;
    health_key: string;
    health_date: string;
    overall_score: number;
    disaster_recovery_mode: boolean;
    pending_reviews_count: number;
    active_forms_count: number;
    framework_health_status: string;
    summary: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDfePendingReviewItem {
    id: string;
    organization_id: string;
    hub_id: string;
    item_key: string;
    item_name: string;
    review_type: string;
    priority: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDfeFormFailure {
    id: string;
    organization_id: string;
    hub_id: string;
    failure_key: string;
    failure_type: string;
    error_code: string;
    error_message: string;
    failed_at: string;
    resolved_at?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDfeAuditLog {
    id: string;
    organization_id: string;
    entity_type: string;
    entity_id?: string | null;
    action: string;
    summary: string;
    metadata: Record<string, unknown>;
    performed_by?: string | null;
    security_level: string;
    created_at: string;
}

export interface DbDweWorkflowHub {
    id: string;
    organization_id: string;
    hub_key: string;
    hub_name: string;
    environment: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDweWorkflowDefinition {
    id: string;
    organization_id: string;
    hub_id: string;
    workflow_key: string;
    workflow_name: string;
    workflow_type: string;
    description: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDweWorkflowCategory {
    id: string;
    organization_id: string;
    hub_id: string;
    category_key: string;
    category_name: string;
    category_type: string;
    description: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDweWorkflowTemplate {
    id: string;
    organization_id: string;
    hub_id: string;
    template_key: string;
    template_name: string;
    template_type: string;
    description: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDweWorkflowVersion {
    id: string;
    organization_id: string;
    hub_id: string;
    version_key: string;
    version_number: string;
    release_channel: string;
    published_at?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDweWorkflowNode {
    id: string;
    organization_id: string;
    hub_id: string;
    node_key: string;
    node_name: string;
    node_type: string;
    node_order: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDweWorkflowTransition {
    id: string;
    organization_id: string;
    hub_id: string;
    transition_key: string;
    transition_name: string;
    source_node_ref: string;
    target_node_ref: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDweDecisionNode {
    id: string;
    organization_id: string;
    hub_id: string;
    decision_key: string;
    decision_name: string;
    decision_expression: string;
    default_branch: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDweReusableSubflow {
    id: string;
    organization_id: string;
    hub_id: string;
    subflow_key: string;
    subflow_name: string;
    subflow_type: string;
    input_schema: Record<string, unknown>;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDweWorkflowExecution {
    id: string;
    organization_id: string;
    hub_id: string;
    execution_key: string;
    execution_name: string;
    execution_status: string;
    started_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDweExecutionHistory {
    id: string;
    organization_id: string;
    hub_id: string;
    history_key: string;
    history_type: string;
    history_summary: string;
    recorded_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDweExecutionRetry {
    id: string;
    organization_id: string;
    hub_id: string;
    retry_key: string;
    retry_count: number;
    retry_status: string;
    next_retry_at?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDweExecutionRollback {
    id: string;
    organization_id: string;
    hub_id: string;
    rollback_key: string;
    rollback_reason: string;
    rollback_status: string;
    rolled_back_at?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDweTimeTrigger {
    id: string;
    organization_id: string;
    hub_id: string;
    trigger_key: string;
    trigger_name: string;
    cron_expression: string;
    timezone: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDweBusinessEventTrigger {
    id: string;
    organization_id: string;
    hub_id: string;
    trigger_key: string;
    trigger_name: string;
    event_type: string;
    event_filter: Record<string, unknown>;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDweWebhookTrigger {
    id: string;
    organization_id: string;
    hub_id: string;
    trigger_key: string;
    trigger_name: string;
    webhook_url: string;
    secret_token: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDweScheduledTrigger {
    id: string;
    organization_id: string;
    hub_id: string;
    trigger_key: string;
    trigger_name: string;
    schedule_type: string;
    interval_seconds: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDweManualReview {
    id: string;
    organization_id: string;
    hub_id: string;
    review_key: string;
    review_name: string;
    review_status: string;
    assigned_to?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDweApprovalTask {
    id: string;
    organization_id: string;
    hub_id: string;
    task_key: string;
    task_name: string;
    task_status: string;
    due_at?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDweEscalationRule {
    id: string;
    organization_id: string;
    hub_id: string;
    rule_key: string;
    rule_name: string;
    escalation_level: number;
    escalation_after_minutes: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDweSlaTracking {
    id: string;
    organization_id: string;
    hub_id: string;
    sla_key: string;
    sla_name: string;
    target_minutes: number;
    breach_at?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDweAutomationNotification {
    id: string;
    organization_id: string;
    hub_id: string;
    notification_key: string;
    notification_name: string;
    channel: string;
    template_ref: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDweAutomationApiCall {
    id: string;
    organization_id: string;
    hub_id: string;
    api_key: string;
    api_name: string;
    endpoint_url: string;
    http_method: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDweAutomationIntegration {
    id: string;
    organization_id: string;
    hub_id: string;
    integration_key: string;
    integration_name: string;
    integration_type: string;
    config: Record<string, unknown>;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDweExecutionAnalytics {
    id: string;
    organization_id: string;
    hub_id: string;
    analytics_key: string;
    analytics_type: string;
    analytics_score: number;
    metric_date: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDweBottleneckReport {
    id: string;
    organization_id: string;
    hub_id: string;
    report_key: string;
    report_name: string;
    bottleneck_score: number;
    metric_date: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDweSlaComplianceMetric {
    id: string;
    organization_id: string;
    hub_id: string;
    metric_key: string;
    metric_name: string;
    compliance_rate: number;
    metric_date: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDweWorkflowMetric {
    id: string;
    organization_id: string;
    metrics_key: string;
    metric_date: string;
    execution_count: number;
    average_duration_ms: number;
    failure_rate: number;
    success_rate: number;
    bottleneck_score: number;
    sla_compliance_score: number;
    overall_workflow_score: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDweWorkflowHealth {
    id: string;
    organization_id: string;
    health_key: string;
    health_date: string;
    overall_score: number;
    disaster_recovery_mode: boolean;
    running_workflows_count: number;
    pending_tasks_count: number;
    automation_health_status: string;
    framework_health_status: string;
    summary: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDweFailedExecution {
    id: string;
    organization_id: string;
    hub_id: string;
    failure_key: string;
    execution_ref: string;
    failure_type: string;
    error_message: string;
    failed_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDweWorkflowFailure {
    id: string;
    organization_id: string;
    hub_id: string;
    failure_key: string;
    failure_type: string;
    error_code: string;
    error_message: string;
    failed_at: string;
    resolved_at?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDweAuditLog {
    id: string;
    organization_id: string;
    entity_type: string;
    entity_id?: string | null;
    action: string;
    summary: string;
    metadata: Record<string, unknown>;
    performed_by?: string | null;
    security_level: string;
    created_at: string;
}

export interface DbDdeDocumentHub {
    id: string;
    organization_id: string;
    hub_key: string;
    hub_name: string;
    environment: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDdeDocumentType {
    id: string;
    organization_id: string;
    hub_id: string;
    type_key: string;
    type_name: string;
    type_category: string;
    description: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDdeDocumentCategory {
    id: string;
    organization_id: string;
    hub_id: string;
    category_key: string;
    category_name: string;
    category_type: string;
    description: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDdeDocumentTemplate {
    id: string;
    organization_id: string;
    hub_id: string;
    template_key: string;
    template_name: string;
    template_type: string;
    description: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDdeDocumentVersion {
    id: string;
    organization_id: string;
    hub_id: string;
    version_key: string;
    version_number: string;
    release_channel: string;
    published_at?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDdeTemplateHeader {
    id: string;
    organization_id: string;
    hub_id: string;
    header_key: string;
    header_name: string;
    header_content: string;
    position: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDdeTemplateFooter {
    id: string;
    organization_id: string;
    hub_id: string;
    footer_key: string;
    footer_name: string;
    footer_content: string;
    position: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDdeTemplateSection {
    id: string;
    organization_id: string;
    hub_id: string;
    section_key: string;
    section_name: string;
    section_type: string;
    section_order: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDdeTemplateVariable {
    id: string;
    organization_id: string;
    hub_id: string;
    variable_key: string;
    variable_name: string;
    variable_type: string;
    default_value: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDdePdfGeneration {
    id: string;
    organization_id: string;
    hub_id: string;
    generation_key: string;
    generation_name: string;
    generation_status: string;
    started_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDdeHtmlGeneration {
    id: string;
    organization_id: string;
    hub_id: string;
    generation_key: string;
    generation_name: string;
    generation_status: string;
    started_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDdeExportJob {
    id: string;
    organization_id: string;
    hub_id: string;
    job_key: string;
    job_name: string;
    job_status: string;
    export_format: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDdeBatchGeneration {
    id: string;
    organization_id: string;
    hub_id: string;
    batch_key: string;
    batch_name: string;
    batch_status: string;
    total_count: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDdeElectronicSignature {
    id: string;
    organization_id: string;
    hub_id: string;
    signature_key: string;
    signature_name: string;
    signature_status: string;
    signed_at?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDdeApprovalSignature {
    id: string;
    organization_id: string;
    hub_id: string;
    signature_key: string;
    signature_name: string;
    signature_status: string;
    approved_at?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDdeSignatureVerification {
    id: string;
    organization_id: string;
    hub_id: string;
    verification_key: string;
    verification_status: string;
    verification_result: string;
    verified_at?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDdeSignatureAuditEntry {
    id: string;
    organization_id: string;
    hub_id: string;
    audit_key: string;
    audit_action: string;
    audit_summary: string;
    recorded_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDdeVersionHistory {
    id: string;
    organization_id: string;
    hub_id: string;
    history_key: string;
    history_version: string;
    history_summary: string;
    recorded_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDdeRetentionPolicy {
    id: string;
    organization_id: string;
    hub_id: string;
    policy_key: string;
    policy_name: string;
    retention_days: number;
    policy_type: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDdeArchiveRecord {
    id: string;
    organization_id: string;
    hub_id: string;
    archive_key: string;
    archive_name: string;
    archive_status: string;
    archived_at?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDdeSharingPolicy {
    id: string;
    organization_id: string;
    hub_id: string;
    policy_key: string;
    policy_name: string;
    sharing_scope: string;
    access_level: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDdeEmailDelivery {
    id: string;
    organization_id: string;
    hub_id: string;
    delivery_key: string;
    delivery_name: string;
    delivery_status: string;
    recipient_email: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDdeDownloadDelivery {
    id: string;
    organization_id: string;
    hub_id: string;
    delivery_key: string;
    delivery_name: string;
    delivery_status: string;
    download_url: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDdeWebhookDelivery {
    id: string;
    organization_id: string;
    hub_id: string;
    delivery_key: string;
    delivery_name: string;
    delivery_status: string;
    webhook_url: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDdeGenerationAnalytics {
    id: string;
    organization_id: string;
    hub_id: string;
    analytics_key: string;
    analytics_type: string;
    analytics_score: number;
    metric_date: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDdeDeliveryAnalytics {
    id: string;
    organization_id: string;
    hub_id: string;
    analytics_key: string;
    analytics_type: string;
    analytics_score: number;
    metric_date: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDdeStorageAnalytics {
    id: string;
    organization_id: string;
    hub_id: string;
    analytics_key: string;
    analytics_type: string;
    analytics_score: number;
    metric_date: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDdeDocumentMetric {
    id: string;
    organization_id: string;
    metrics_key: string;
    metric_date: string;
    generated_count: number;
    download_count: number;
    delivery_success_rate: number;
    failure_count: number;
    signature_pending_count: number;
    storage_usage_mb: number;
    overall_document_score: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDdeDocumentHealth {
    id: string;
    organization_id: string;
    health_key: string;
    health_date: string;
    overall_score: number;
    disaster_recovery_mode: boolean;
    pending_signatures_count: number;
    delivery_queue_depth: number;
    framework_health_status: string;
    summary: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDdePendingSignature {
    id: string;
    organization_id: string;
    hub_id: string;
    signature_key: string;
    signature_name: string;
    signature_status: string;
    requested_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDdeDocumentFailure {
    id: string;
    organization_id: string;
    hub_id: string;
    failure_key: string;
    failure_type: string;
    error_code: string;
    error_message: string;
    failed_at: string;
    resolved_at?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbDdeAuditLog {
    id: string;
    organization_id: string;
    entity_type: string;
    entity_id?: string | null;
    action: string;
    summary: string;
    metadata: Record<string, unknown>;
    performed_by?: string | null;
    security_level: string;
    created_at: string;
}

export interface DbRstRestaurantHub {
    id: string;
    organization_id: string;
    hub_key: string;
    hub_name: string;
    environment: string;
    gst_number: string;
    operating_hours: Record<string, unknown>;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbRstBrand {
    id: string;
    organization_id: string;
    hub_id: string;
    brand_key: string;
    brand_name: string;
    brand_type: string;
    description: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbRstBranch {
    id: string;
    organization_id: string;
    hub_id: string;
    branch_key: string;
    branch_name: string;
    branch_address: string;
    city: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbRstBusinessLicense {
    id: string;
    organization_id: string;
    hub_id: string;
    license_key: string;
    license_name: string;
    license_type: string;
    expiry_date?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbRstDiningArea {
    id: string;
    organization_id: string;
    hub_id: string;
    area_key: string;
    area_name: string;
    area_type: string;
    capacity: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbRstRestaurantTable {
    id: string;
    organization_id: string;
    hub_id: string;
    table_key: string;
    table_name: string;
    qr_code: string;
    table_status: string;
    floor_ref: string;
    seats: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbRstMenuCategory {
    id: string;
    organization_id: string;
    hub_id: string;
    category_key: string;
    category_name: string;
    category_type: string;
    display_order: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbRstMenuItem {
    id: string;
    organization_id: string;
    hub_id: string;
    item_key: string;
    item_name: string;
    item_price: number;
    description: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbRstMenuVariant {
    id: string;
    organization_id: string;
    hub_id: string;
    variant_key: string;
    variant_name: string;
    variant_type: string;
    price_adjustment: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbRstAddOn {
    id: string;
    organization_id: string;
    hub_id: string;
    addon_key: string;
    addon_name: string;
    addon_price: number;
    addon_type: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbRstComboMeal {
    id: string;
    organization_id: string;
    hub_id: string;
    combo_key: string;
    combo_name: string;
    combo_price: number;
    combo_type: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbRstOrder {
    id: string;
    organization_id: string;
    hub_id: string;
    order_key: string;
    order_number: string;
    order_type: string;
    order_status: string;
    total_amount: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbRstOrderItem {
    id: string;
    organization_id: string;
    hub_id: string;
    item_key: string;
    item_name: string;
    item_quantity: number;
    unit_price: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbRstOrderQueue {
    id: string;
    organization_id: string;
    hub_id: string;
    queue_key: string;
    queue_name: string;
    queue_status: string;
    position: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbRstKitchenRouting {
    id: string;
    organization_id: string;
    hub_id: string;
    routing_key: string;
    routing_name: string;
    routing_status: string;
    station_ref: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbRstOrderTimeline {
    id: string;
    organization_id: string;
    hub_id: string;
    timeline_key: string;
    timeline_event: string;
    timeline_status: string;
    recorded_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbRstKitchenStation {
    id: string;
    organization_id: string;
    hub_id: string;
    station_key: string;
    station_name: string;
    station_type: string;
    capacity: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbRstPreparationQueue {
    id: string;
    organization_id: string;
    hub_id: string;
    prep_key: string;
    prep_name: string;
    prep_status: string;
    priority: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbRstCookingStatus {
    id: string;
    organization_id: string;
    hub_id: string;
    cooking_key: string;
    cooking_name: string;
    cooking_status: string;
    started_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbRstReadyQueue {
    id: string;
    organization_id: string;
    hub_id: string;
    ready_key: string;
    ready_name: string;
    ready_status: string;
    ready_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbRstRushOrder {
    id: string;
    organization_id: string;
    hub_id: string;
    rush_key: string;
    rush_name: string;
    rush_priority: string;
    escalated_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbRstReservation {
    id: string;
    organization_id: string;
    hub_id: string;
    reservation_key: string;
    reservation_name: string;
    reservation_status: string;
    party_size: number;
    reserved_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbRstWaitingList {
    id: string;
    organization_id: string;
    hub_id: string;
    wait_key: string;
    wait_name: string;
    wait_status: string;
    party_size: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbRstCustomerProfile {
    id: string;
    organization_id: string;
    hub_id: string;
    profile_key: string;
    profile_name: string;
    profile_type: string;
    email: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbRstLoyaltyProgram {
    id: string;
    organization_id: string;
    hub_id: string;
    program_key: string;
    program_name: string;
    program_type: string;
    points_balance: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbRstFeedbackReview {
    id: string;
    organization_id: string;
    hub_id: string;
    review_key: string;
    review_title: string;
    review_rating: number;
    review_text: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbRstRestaurantMetric {
    id: string;
    organization_id: string;
    metrics_key: string;
    metric_date: string;
    order_count: number;
    revenue_total: number;
    average_bill: number;
    occupancy_rate: number;
    popular_dish_score: number;
    peak_hour_score: number;
    customer_growth_rate: number;
    kitchen_performance_score: number;
    overall_restaurant_score: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbRstRestaurantHealth {
    id: string;
    organization_id: string;
    health_key: string;
    health_date: string;
    overall_score: number;
    disaster_recovery_mode: boolean;
    pending_orders_count: number;
    kitchen_queue_depth: number;
    framework_health_status: string;
    summary: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbRstRevenueAnalytics {
    id: string;
    organization_id: string;
    hub_id: string;
    analytics_key: string;
    analytics_type: string;
    analytics_score: number;
    metric_date: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbRstKitchenPerformance {
    id: string;
    organization_id: string;
    hub_id: string;
    performance_key: string;
    performance_type: string;
    performance_score: number;
    metric_date: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbRstRestaurantFailure {
    id: string;
    organization_id: string;
    hub_id: string;
    failure_key: string;
    failure_type: string;
    error_code: string;
    error_message: string;
    failed_at: string;
    resolved_at?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbRstAuditLog {
    id: string;
    organization_id: string;
    entity_type: string;
    entity_id?: string | null;
    action: string;
    summary: string;
    metadata: Record<string, unknown>;
    performed_by?: string | null;
    security_level: string;
    created_at: string;
}

export interface DbSchSchoolHub {
    id: string;
    organization_id: string;
    hub_key: string;
    hub_name: string;
    environment: string;
    school_code: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSchCampus {
    id: string;
    organization_id: string;
    hub_id: string;
    campus_key: string;
    campus_name: string;
    campus_type: string;
    address: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSchBuilding {
    id: string;
    organization_id: string;
    hub_id: string;
    building_key: string;
    building_name: string;
    building_type: string;
    floor_count: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSchClassroom {
    id: string;
    organization_id: string;
    hub_id: string;
    classroom_key: string;
    classroom_name: string;
    classroom_type: string;
    capacity: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSchAcademicYear {
    id: string;
    organization_id: string;
    hub_id: string;
    year_key: string;
    year_name: string;
    year_status: string;
    start_date: string;
    end_date?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSchAdmission {
    id: string;
    organization_id: string;
    hub_id: string;
    admission_key: string;
    admission_name: string;
    admission_status: string;
    grade_level: string;
    applied_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSchStudentProfile {
    id: string;
    organization_id: string;
    hub_id: string;
    profile_key: string;
    profile_name: string;
    profile_type: string;
    grade_level: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSchParentProfile {
    id: string;
    organization_id: string;
    hub_id: string;
    parent_key: string;
    parent_name: string;
    parent_type: string;
    email: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSchEnrollment {
    id: string;
    organization_id: string;
    hub_id: string;
    enrollment_key: string;
    enrollment_name: string;
    enrollment_status: string;
    enrolled_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSchSubject {
    id: string;
    organization_id: string;
    hub_id: string;
    subject_key: string;
    subject_name: string;
    subject_type: string;
    credit_hours: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSchTimetable {
    id: string;
    organization_id: string;
    hub_id: string;
    timetable_key: string;
    timetable_name: string;
    timetable_type: string;
    period_count: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSchExamination {
    id: string;
    organization_id: string;
    hub_id: string;
    exam_key: string;
    exam_name: string;
    exam_type: string;
    exam_status: string;
    scheduled_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSchReportCard {
    id: string;
    organization_id: string;
    hub_id: string;
    report_key: string;
    report_name: string;
    report_grade: string;
    gpa: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSchTeacher {
    id: string;
    organization_id: string;
    hub_id: string;
    teacher_key: string;
    teacher_name: string;
    teacher_type: string;
    department: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSchStaffAttendance {
    id: string;
    organization_id: string;
    hub_id: string;
    attendance_key: string;
    attendance_name: string;
    attendance_status: string;
    recorded_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSchLeaveRequest {
    id: string;
    organization_id: string;
    hub_id: string;
    leave_key: string;
    leave_name: string;
    leave_status: string;
    leave_type: string;
    requested_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSchSubstituteTeacher {
    id: string;
    organization_id: string;
    hub_id: string;
    substitute_key: string;
    substitute_name: string;
    substitute_status: string;
    assigned_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSchFeeStructure {
    id: string;
    organization_id: string;
    hub_id: string;
    fee_key: string;
    fee_name: string;
    fee_type: string;
    amount: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSchFeeInvoice {
    id: string;
    organization_id: string;
    hub_id: string;
    invoice_key: string;
    invoice_name: string;
    invoice_amount: number;
    invoice_status: string;
    due_date: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSchFeePayment {
    id: string;
    organization_id: string;
    hub_id: string;
    payment_key: string;
    payment_name: string;
    payment_amount: number;
    payment_status: string;
    paid_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSchScholarship {
    id: string;
    organization_id: string;
    hub_id: string;
    scholarship_key: string;
    scholarship_name: string;
    scholarship_amount: number;
    scholarship_type: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSchAnnouncement {
    id: string;
    organization_id: string;
    hub_id: string;
    announcement_key: string;
    announcement_title: string;
    announcement_type: string;
    published_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSchMessaging {
    id: string;
    organization_id: string;
    hub_id: string;
    message_key: string;
    message_subject: string;
    message_type: string;
    sent_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSchEvent {
    id: string;
    organization_id: string;
    hub_id: string;
    event_key: string;
    event_name: string;
    event_type: string;
    event_date: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSchAdmissionsAnalytics {
    id: string;
    organization_id: string;
    hub_id: string;
    analytics_key: string;
    analytics_type: string;
    analytics_score: number;
    metric_date: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSchAttendanceAnalytics {
    id: string;
    organization_id: string;
    hub_id: string;
    analytics_key: string;
    analytics_type: string;
    analytics_score: number;
    metric_date: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSchAcademicAnalytics {
    id: string;
    organization_id: string;
    hub_id: string;
    analytics_key: string;
    analytics_type: string;
    analytics_score: number;
    metric_date: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSchSchoolMetric {
    id: string;
    organization_id: string;
    metrics_key: string;
    metric_date: string;
    revenue_total: number;
    admissions_count: number;
    attendance_rate: number;
    academic_performance_score: number;
    fee_collection_rate: number;
    teacher_performance_score: number;
    student_growth_rate: number;
    overall_school_score: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSchSchoolHealth {
    id: string;
    organization_id: string;
    health_key: string;
    health_date: string;
    overall_score: number;
    disaster_recovery_mode: boolean;
    campus_health_status: string;
    financial_health_status: string;
    operational_health_status: string;
    summary: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSchExecutiveKpi {
    id: string;
    organization_id: string;
    hub_id: string;
    kpi_key: string;
    kpi_name: string;
    kpi_score: number;
    kpi_type: string;
    metric_date: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSchSchoolFailure {
    id: string;
    organization_id: string;
    hub_id: string;
    failure_key: string;
    failure_type: string;
    error_code: string;
    error_message: string;
    failed_at: string;
    resolved_at?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbSchAuditLog {
    id: string;
    organization_id: string;
    entity_type: string;
    entity_id?: string | null;
    action: string;
    summary: string;
    metadata: Record<string, unknown>;
    performed_by?: string | null;
    security_level: string;
    created_at: string;
}

export interface DbHspHospitalHub {
    id: string;
    organization_id: string;
    hub_key: string;
    hub_name: string;
    environment: string;
    hospital_code: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbHspCampus {
    id: string;
    organization_id: string;
    hub_id: string;
    campus_key: string;
    campus_name: string;
    campus_type: string;
    address: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbHspDepartment {
    id: string;
    organization_id: string;
    hub_id: string;
    department_key: string;
    department_name: string;
    department_type: string;
    floor_level: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbHspWard {
    id: string;
    organization_id: string;
    hub_id: string;
    ward_key: string;
    ward_name: string;
    ward_type: string;
    capacity: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbHspHospitalBed {
    id: string;
    organization_id: string;
    hub_id: string;
    bed_key: string;
    bed_number: string;
    bed_status: string;
    ward_ref: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbHspPatientRegistration {
    id: string;
    organization_id: string;
    hub_id: string;
    registration_key: string;
    registration_name: string;
    registration_status: string;
    patient_type: string;
    registered_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbHspPatientProfile {
    id: string;
    organization_id: string;
    hub_id: string;
    profile_key: string;
    profile_name: string;
    profile_type: string;
    blood_group: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbHspMedicalHistory {
    id: string;
    organization_id: string;
    hub_id: string;
    history_key: string;
    history_name: string;
    history_type: string;
    recorded_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbHspInsurancePolicy {
    id: string;
    organization_id: string;
    hub_id: string;
    policy_key: string;
    policy_name: string;
    policy_type: string;
    coverage_amount: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbHspAppointment {
    id: string;
    organization_id: string;
    hub_id: string;
    appointment_key: string;
    appointment_name: string;
    appointment_status: string;
    appointment_type: string;
    scheduled_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbHspOpdVisit {
    id: string;
    organization_id: string;
    hub_id: string;
    visit_key: string;
    visit_name: string;
    visit_status: string;
    visit_type: string;
    visited_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbHspIpdAdmission {
    id: string;
    organization_id: string;
    hub_id: string;
    admission_key: string;
    admission_name: string;
    admission_status: string;
    ward_ref: string;
    admitted_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbHspClinicalNote {
    id: string;
    organization_id: string;
    hub_id: string;
    note_key: string;
    note_name: string;
    note_type: string;
    note_content: string;
    recorded_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbHspPharmacyInventory {
    id: string;
    organization_id: string;
    hub_id: string;
    inventory_key: string;
    inventory_name: string;
    inventory_type: string;
    stock_quantity: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbHspPrescription {
    id: string;
    organization_id: string;
    hub_id: string;
    prescription_key: string;
    prescription_name: string;
    prescription_status: string;
    prescribed_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbHspLabOrder {
    id: string;
    organization_id: string;
    hub_id: string;
    order_key: string;
    order_name: string;
    order_status: string;
    order_type: string;
    ordered_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbHspLabResult {
    id: string;
    organization_id: string;
    hub_id: string;
    result_key: string;
    result_name: string;
    result_status: string;
    result_value: string;
    resulted_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbHspHospitalBilling {
    id: string;
    organization_id: string;
    hub_id: string;
    billing_key: string;
    billing_name: string;
    billing_amount: number;
    billing_type: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbHspInsuranceClaim {
    id: string;
    organization_id: string;
    hub_id: string;
    claim_key: string;
    claim_name: string;
    claim_status: string;
    claim_amount: number;
    submitted_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbHspHospitalInvoice {
    id: string;
    organization_id: string;
    hub_id: string;
    invoice_key: string;
    invoice_name: string;
    invoice_amount: number;
    invoice_status: string;
    due_date: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbHspHospitalPayment {
    id: string;
    organization_id: string;
    hub_id: string;
    payment_key: string;
    payment_name: string;
    payment_amount: number;
    payment_status: string;
    paid_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbHspPatientNotification {
    id: string;
    organization_id: string;
    hub_id: string;
    notification_key: string;
    notification_title: string;
    notification_type: string;
    sent_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbHspMedicalReport {
    id: string;
    organization_id: string;
    hub_id: string;
    report_key: string;
    report_name: string;
    report_type: string;
    generated_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbHspPatientFeedback {
    id: string;
    organization_id: string;
    hub_id: string;
    feedback_key: string;
    feedback_name: string;
    feedback_score: number;
    feedback_type: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbHspAdmissionsAnalytics {
    id: string;
    organization_id: string;
    hub_id: string;
    analytics_key: string;
    analytics_type: string;
    analytics_score: number;
    metric_date: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbHspOccupancyAnalytics {
    id: string;
    organization_id: string;
    hub_id: string;
    analytics_key: string;
    analytics_type: string;
    analytics_score: number;
    metric_date: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbHspRevenueAnalytics {
    id: string;
    organization_id: string;
    hub_id: string;
    analytics_key: string;
    analytics_type: string;
    analytics_score: number;
    metric_date: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbHspHospitalMetric {
    id: string;
    organization_id: string;
    metrics_key: string;
    metric_date: string;
    admissions_count: number;
    discharge_count: number;
    bed_occupancy_rate: number;
    revenue_total: number;
    department_performance_score: number;
    patient_satisfaction_score: number;
    operational_health_score: number;
    overall_hospital_score: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbHspHospitalHealth {
    id: string;
    organization_id: string;
    health_key: string;
    health_date: string;
    overall_score: number;
    disaster_recovery_mode: boolean;
    bed_utilization_status: string;
    financial_health_status: string;
    operational_health_status: string;
    summary: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbHspExecutiveKpi {
    id: string;
    organization_id: string;
    hub_id: string;
    kpi_key: string;
    kpi_name: string;
    kpi_score: number;
    kpi_type: string;
    metric_date: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbHspHospitalFailure {
    id: string;
    organization_id: string;
    hub_id: string;
    failure_key: string;
    failure_type: string;
    error_code: string;
    error_message: string;
    failed_at: string;
    resolved_at?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbHspAuditLog {
    id: string;
    organization_id: string;
    entity_type: string;
    entity_id?: string | null;
    action: string;
    summary: string;
    metadata: Record<string, unknown>;
    performed_by?: string | null;
    security_level: string;
    created_at: string;
}

export interface DbRtlRetailHub {
    id: string;
    organization_id: string;
    hub_key: string;
    hub_name: string;
    environment: string;
    retail_code: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbRtlRetailBrand {
    id: string;
    organization_id: string;
    hub_id: string;
    brand_key: string;
    brand_name: string;
    brand_type: string;
    region: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbRtlStore {
    id: string;
    organization_id: string;
    hub_id: string;
    store_key: string;
    store_name: string;
    store_type: string;
    address: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbRtlCashRegister {
    id: string;
    organization_id: string;
    hub_id: string;
    register_key: string;
    register_name: string;
    register_status: string;
    terminal_id: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbRtlStoreDepartment {
    id: string;
    organization_id: string;
    hub_id: string;
    department_key: string;
    department_name: string;
    department_type: string;
    floor_level: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbRtlProduct {
    id: string;
    organization_id: string;
    hub_id: string;
    product_key: string;
    product_name: string;
    product_type: string;
    sku: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbRtlProductCategory {
    id: string;
    organization_id: string;
    hub_id: string;
    category_key: string;
    category_name: string;
    category_type: string;
    parent_ref: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbRtlProductVariant {
    id: string;
    organization_id: string;
    hub_id: string;
    variant_key: string;
    variant_name: string;
    variant_type: string;
    sku_ref: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbRtlPromotion {
    id: string;
    organization_id: string;
    hub_id: string;
    promotion_key: string;
    promotion_name: string;
    promotion_status: string;
    discount_pct: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbRtlSalesOrder {
    id: string;
    organization_id: string;
    hub_id: string;
    order_key: string;
    order_name: string;
    order_status: string;
    order_type: string;
    ordered_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbRtlPosTransaction {
    id: string;
    organization_id: string;
    hub_id: string;
    transaction_key: string;
    transaction_name: string;
    transaction_status: string;
    amount: number;
    transacted_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbRtlReturnsExchange {
    id: string;
    organization_id: string;
    hub_id: string;
    return_key: string;
    return_name: string;
    return_status: string;
    return_type: string;
    returned_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbRtlShiftClosing {
    id: string;
    organization_id: string;
    hub_id: string;
    closing_key: string;
    closing_name: string;
    closing_status: string;
    closed_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbRtlWarehouse {
    id: string;
    organization_id: string;
    hub_id: string;
    warehouse_key: string;
    warehouse_name: string;
    warehouse_type: string;
    location: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbRtlStockLevel {
    id: string;
    organization_id: string;
    hub_id: string;
    stock_key: string;
    stock_name: string;
    stock_quantity: number;
    reorder_level: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbRtlPurchaseOrder {
    id: string;
    organization_id: string;
    hub_id: string;
    order_key: string;
    order_name: string;
    order_status: string;
    supplier_ref: string;
    ordered_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbRtlSupplier {
    id: string;
    organization_id: string;
    hub_id: string;
    supplier_key: string;
    supplier_name: string;
    supplier_type: string;
    contact_info: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbRtlCustomerProfile {
    id: string;
    organization_id: string;
    hub_id: string;
    profile_key: string;
    profile_name: string;
    profile_type: string;
    loyalty_tier: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbRtlLoyaltyProgram {
    id: string;
    organization_id: string;
    hub_id: string;
    program_key: string;
    program_name: string;
    program_type: string;
    points_rate: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbRtlRewardPoint {
    id: string;
    organization_id: string;
    hub_id: string;
    points_key: string;
    points_name: string;
    points_balance: number;
    earned_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbRtlCampaign {
    id: string;
    organization_id: string;
    hub_id: string;
    campaign_key: string;
    campaign_name: string;
    campaign_status: string;
    start_date: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbRtlDailyClosing {
    id: string;
    organization_id: string;
    hub_id: string;
    closing_key: string;
    closing_name: string;
    closing_amount: number;
    closed_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbRtlBranchPerformance {
    id: string;
    organization_id: string;
    hub_id: string;
    performance_key: string;
    performance_name: string;
    performance_score: number;
    metric_date: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbRtlCommissionRecord {
    id: string;
    organization_id: string;
    hub_id: string;
    commission_key: string;
    commission_name: string;
    commission_amount: number;
    earned_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbRtlSalesAnalytics {
    id: string;
    organization_id: string;
    hub_id: string;
    analytics_key: string;
    analytics_type: string;
    analytics_score: number;
    metric_date: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbRtlInventoryAnalytics {
    id: string;
    organization_id: string;
    hub_id: string;
    analytics_key: string;
    analytics_type: string;
    analytics_score: number;
    metric_date: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbRtlProfitabilityAnalytics {
    id: string;
    organization_id: string;
    hub_id: string;
    analytics_key: string;
    analytics_type: string;
    analytics_score: number;
    metric_date: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbRtlRetailMetric {
    id: string;
    organization_id: string;
    metrics_key: string;
    metric_date: string;
    revenue_total: number;
    profit_total: number;
    sales_count: number;
    inventory_value: number;
    customer_retention_rate: number;
    store_performance_score: number;
    top_product_score: number;
    overall_retail_score: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbRtlRetailHealth {
    id: string;
    organization_id: string;
    health_key: string;
    health_date: string;
    overall_score: number;
    disaster_recovery_mode: boolean;
    inventory_health_status: string;
    financial_health_status: string;
    operational_health_status: string;
    summary: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbRtlExecutiveKpi {
    id: string;
    organization_id: string;
    hub_id: string;
    kpi_key: string;
    kpi_name: string;
    kpi_score: number;
    kpi_type: string;
    metric_date: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbRtlRetailFailure {
    id: string;
    organization_id: string;
    hub_id: string;
    failure_key: string;
    failure_type: string;
    error_code: string;
    error_message: string;
    failed_at: string;
    resolved_at?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbRtlAuditLog {
    id: string;
    organization_id: string;
    entity_type: string;
    entity_id?: string | null;
    action: string;
    summary: string;
    metadata: Record<string, unknown>;
    performed_by?: string | null;
    security_level: string;
    created_at: string;
}

export interface DbElfLaunchHub {
    id: string;
    organization_id: string;
    hub_key: string;
    hub_name: string;
    environment: string;
    platform_tier: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbElfOrganizationProvision {
    id: string;
    organization_id: string;
    hub_id: string;
    provision_key: string;
    provision_name: string;
    provision_status: string;
    org_ref: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbElfTenantProvision {
    id: string;
    organization_id: string;
    hub_id: string;
    provision_key: string;
    tenant_ref: string;
    provision_status: string;
    provision_summary: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbElfIndustryPackAssignment {
    id: string;
    organization_id: string;
    hub_id: string;
    assignment_key: string;
    pack_name: string;
    pack_type: string;
    pack_version: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbElfModuleLicense {
    id: string;
    organization_id: string;
    hub_id: string;
    license_key: string;
    module_name: string;
    license_status: string;
    seat_count: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbElfWizardProfile {
    id: string;
    organization_id: string;
    hub_id: string;
    profile_key: string;
    profile_name: string;
    profile_type: string;
    completion_score: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbElfWizardBranding {
    id: string;
    organization_id: string;
    hub_id: string;
    branding_key: string;
    branding_name: string;
    brand_color: string;
    logo_ref: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbElfWizardDepartment {
    id: string;
    organization_id: string;
    hub_id: string;
    department_key: string;
    department_name: string;
    department_type: string;
    head_count: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbElfWizardSetting {
    id: string;
    organization_id: string;
    hub_id: string;
    setting_key: string;
    setting_name: string;
    setting_value: string;
    setting_group: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbElfImportJob {
    id: string;
    organization_id: string;
    hub_id: string;
    job_key: string;
    job_name: string;
    job_status: string;
    source_ref: string;
    started_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbElfImportValidation {
    id: string;
    organization_id: string;
    hub_id: string;
    validation_key: string;
    validation_type: string;
    validation_score: number;
    validation_summary: string;
    validated_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbElfImportPreview {
    id: string;
    organization_id: string;
    hub_id: string;
    preview_key: string;
    preview_name: string;
    record_count: number;
    preview_summary: string;
    previewed_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbElfImportHistory {
    id: string;
    organization_id: string;
    hub_id: string;
    history_key: string;
    history_type: string;
    imported_at: string;
    record_count: number;
    import_summary: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbElfGoLiveChecklist {
    id: string;
    organization_id: string;
    hub_id: string;
    checklist_key: string;
    checklist_name: string;
    completion_score: number;
    checklist_items: Record<string, unknown>;
    reviewed_at?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbElfGoLiveScore {
    id: string;
    organization_id: string;
    hub_id: string;
    score_key: string;
    score_type: string;
    go_live_score: number;
    metric_date: string;
    captured_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbElfDeploymentStatus {
    id: string;
    organization_id: string;
    hub_id: string;
    status_key: string;
    deployment_name: string;
    deployment_status: string;
    target_version: string;
    deployed_at?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbElfReadinessValidation {
    id: string;
    organization_id: string;
    hub_id: string;
    validation_key: string;
    validation_type: string;
    validation_score: number;
    validation_summary: string;
    validated_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbElfCustomerHealthScore {
    id: string;
    organization_id: string;
    hub_id: string;
    score_key: string;
    customer_ref: string;
    health_score: number;
    metric_date: string;
    measured_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbElfPlatformAdoption {
    id: string;
    organization_id: string;
    hub_id: string;
    adoption_key: string;
    feature_name: string;
    adoption_rate: number;
    metric_date: string;
    measured_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbElfFeatureUsage {
    id: string;
    organization_id: string;
    hub_id: string;
    usage_key: string;
    feature_name: string;
    usage_count: number;
    metric_date: string;
    measured_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbElfRenewalTracking {
    id: string;
    organization_id: string;
    hub_id: string;
    renewal_key: string;
    customer_ref: string;
    renewal_status: string;
    renewal_date: string;
    contract_value: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbElfSupportTicket {
    id: string;
    organization_id: string;
    hub_id: string;
    ticket_key: string;
    ticket_title: string;
    ticket_status: string;
    priority: string;
    opened_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbElfKnowledgeBaseArticle {
    id: string;
    organization_id: string;
    hub_id: string;
    article_key: string;
    article_title: string;
    article_category: string;
    article_summary: string;
    published_at?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbElfIncidentTracking {
    id: string;
    organization_id: string;
    hub_id: string;
    incident_key: string;
    incident_title: string;
    incident_severity: string;
    incident_summary: string;
    detected_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbElfCustomerRegistry {
    id: string;
    organization_id: string;
    hub_id: string;
    customer_key: string;
    customer_name: string;
    customer_tier: string;
    region: string;
    onboarded_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbElfSubscriptionRecord {
    id: string;
    organization_id: string;
    hub_id: string;
    subscription_key: string;
    plan_name: string;
    subscription_status: string;
    seat_count: number;
    started_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbElfLicenseManagement {
    id: string;
    organization_id: string;
    hub_id: string;
    license_key: string;
    license_type: string;
    license_status: string;
    seat_limit: number;
    expires_at?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbElfLaunchMetric {
    id: string;
    organization_id: string;
    metrics_key: string;
    metric_date: string;
    platform_health_score: number;
    customer_health_score: number;
    deployment_count: number;
    subscription_count: number;
    support_open_count: number;
    go_live_score: number;
    overall_launch_score: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbElfLaunchHealth {
    id: string;
    organization_id: string;
    health_key: string;
    health_date: string;
    overall_score: number;
    disaster_recovery_mode: boolean;
    platform_status: string;
    customer_success_status: string;
    security_status: string;
    summary: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbElfMissionControlKpi {
    id: string;
    organization_id: string;
    hub_id: string;
    kpi_key: string;
    kpi_name: string;
    kpi_score: number;
    kpi_type: string;
    metric_date: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbElfLaunchFailure {
    id: string;
    organization_id: string;
    hub_id: string;
    failure_key: string;
    failure_type: string;
    error_code: string;
    error_message: string;
    failed_at: string;
    resolved_at?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbElfAuditLog {
    id: string;
    organization_id: string;
    entity_type: string;
    entity_id?: string | null;
    action: string;
    summary: string;
    metadata: Record<string, unknown>;
    performed_by?: string | null;
    security_level: string;
    created_at: string;
}

export interface DbCmpCompanyHub {
    id: string;
    organization_id: string;
    hub_key: string;
    hub_name: string;
    environment: string;
    company_tier: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCmpBrandProfile {
    id: string;
    organization_id: string;
    hub_id: string;
    profile_key: string;
    profile_name: string;
    brand_status: string;
    brand_summary: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCmpLogoAsset {
    id: string;
    organization_id: string;
    hub_id: string;
    asset_key: string;
    asset_name: string;
    asset_type: string;
    asset_url: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCmpThemeConfig {
    id: string;
    organization_id: string;
    hub_id: string;
    config_key: string;
    config_name: string;
    primary_color: string;
    secondary_color: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCmpBrandAsset {
    id: string;
    organization_id: string;
    hub_id: string;
    asset_key: string;
    asset_name: string;
    asset_category: string;
    asset_ref: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCmpWebsitePage {
    id: string;
    organization_id: string;
    hub_id: string;
    page_key: string;
    page_title: string;
    page_slug: string;
    page_status: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCmpWebsiteFeature {
    id: string;
    organization_id: string;
    hub_id: string;
    feature_key: string;
    feature_name: string;
    feature_type: string;
    feature_summary: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCmpWebsiteSection {
    id: string;
    organization_id: string;
    hub_id: string;
    section_key: string;
    section_name: string;
    section_type: string;
    section_order: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCmpDemoRequest {
    id: string;
    organization_id: string;
    hub_id: string;
    request_key: string;
    request_name: string;
    request_status: string;
    contact_email: string;
    requested_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCmpPricingPlan {
    id: string;
    organization_id: string;
    hub_id: string;
    plan_key: string;
    plan_name: string;
    plan_tier: string;
    base_price: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCmpPricingPackage {
    id: string;
    organization_id: string;
    hub_id: string;
    package_key: string;
    package_name: string;
    package_type: string;
    package_price: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCmpModulePricing {
    id: string;
    organization_id: string;
    hub_id: string;
    pricing_key: string;
    module_name: string;
    price_amount: number;
    billing_cycle: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCmpDiscountRule {
    id: string;
    organization_id: string;
    hub_id: string;
    rule_key: string;
    rule_name: string;
    discount_percent: number;
    rule_type: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCmpProposal {
    id: string;
    organization_id: string;
    hub_id: string;
    proposal_key: string;
    proposal_name: string;
    proposal_status: string;
    proposal_value: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCmpProposalDocument {
    id: string;
    organization_id: string;
    hub_id: string;
    document_key: string;
    document_name: string;
    document_type: string;
    document_ref: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCmpProposalContract {
    id: string;
    organization_id: string;
    hub_id: string;
    contract_key: string;
    contract_name: string;
    contract_status: string;
    contract_value: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCmpProposalHistory {
    id: string;
    organization_id: string;
    hub_id: string;
    history_key: string;
    history_type: string;
    changed_at: string;
    change_summary: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCmpPortalDashboard {
    id: string;
    organization_id: string;
    hub_id: string;
    dashboard_key: string;
    dashboard_name: string;
    dashboard_type: string;
    widget_count: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCmpPortalSubscription {
    id: string;
    organization_id: string;
    hub_id: string;
    subscription_key: string;
    plan_name: string;
    subscription_status: string;
    seat_count: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCmpPortalBilling {
    id: string;
    organization_id: string;
    hub_id: string;
    billing_key: string;
    billing_type: string;
    billing_amount: number;
    billing_date: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCmpPortalSupport {
    id: string;
    organization_id: string;
    hub_id: string;
    support_key: string;
    support_title: string;
    support_status: string;
    priority: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCmpDocGuide {
    id: string;
    organization_id: string;
    hub_id: string;
    guide_key: string;
    guide_title: string;
    guide_category: string;
    guide_summary: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCmpDocApiReference {
    id: string;
    organization_id: string;
    hub_id: string;
    reference_key: string;
    reference_name: string;
    api_version: string;
    endpoint_count: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCmpDocVersion {
    id: string;
    organization_id: string;
    hub_id: string;
    version_key: string;
    version_name: string;
    version_number: string;
    released_at?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCmpDemoOrganization {
    id: string;
    organization_id: string;
    hub_id: string;
    org_key: string;
    org_name: string;
    org_type: string;
    region: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCmpDemoDataSet {
    id: string;
    organization_id: string;
    hub_id: string;
    dataset_key: string;
    dataset_name: string;
    record_count: number;
    dataset_type: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCmpDemoUser {
    id: string;
    organization_id: string;
    hub_id: string;
    user_key: string;
    user_name: string;
    user_role: string;
    user_email: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCmpCompanyMetric {
    id: string;
    organization_id: string;
    metrics_key: string;
    metric_date: string;
    website_analytics_score: number;
    demo_request_count: number;
    active_customer_count: number;
    revenue_total: number;
    proposal_pending_count: number;
    support_open_count: number;
    platform_health_score: number;
    overall_company_score: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCmpCompanyHealth {
    id: string;
    organization_id: string;
    health_key: string;
    health_date: string;
    overall_score: number;
    disaster_recovery_mode: boolean;
    website_status: string;
    revenue_status: string;
    support_status: string;
    security_status: string;
    summary: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCmpExecutiveKpi {
    id: string;
    organization_id: string;
    hub_id: string;
    kpi_key: string;
    kpi_name: string;
    kpi_score: number;
    kpi_type: string;
    metric_date: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCmpCompanyFailure {
    id: string;
    organization_id: string;
    hub_id: string;
    failure_key: string;
    failure_type: string;
    error_code: string;
    error_message: string;
    failed_at: string;
    resolved_at?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCmpAuditLog {
    id: string;
    organization_id: string;
    entity_type: string;
    entity_id?: string | null;
    action: string;
    summary: string;
    metadata: Record<string, unknown>;
    performed_by?: string | null;
    security_level: string;
    created_at: string;
}

export interface DbCsdDeliveryHub {
    id: string;
    organization_id: string;
    hub_key: string;
    hub_name: string;
    environment: string;
    delivery_tier: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCsdCustomerHealthScore {
    id: string;
    organization_id: string;
    hub_id: string;
    score_key: string;
    customer_ref: string;
    health_score: number;
    metric_date: string;
    measured_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCsdAdoptionAnalytic {
    id: string;
    organization_id: string;
    hub_id: string;
    analytics_key: string;
    feature_name: string;
    adoption_rate: number;
    metric_date: string;
    measured_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCsdSuccessPlan {
    id: string;
    organization_id: string;
    hub_id: string;
    plan_key: string;
    plan_name: string;
    plan_status: string;
    customer_ref: string;
    target_date: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCsdCustomerTimeline {
    id: string;
    organization_id: string;
    hub_id: string;
    timeline_key: string;
    timeline_name: string;
    timeline_type: string;
    event_date: string;
    event_summary: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCsdRenewalForecast {
    id: string;
    organization_id: string;
    hub_id: string;
    forecast_key: string;
    customer_ref: string;
    forecast_status: string;
    renewal_date: string;
    forecast_value: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCsdSupportTicket {
    id: string;
    organization_id: string;
    hub_id: string;
    ticket_key: string;
    ticket_title: string;
    ticket_status: string;
    priority: string;
    opened_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCsdLiveChatSession {
    id: string;
    organization_id: string;
    hub_id: string;
    session_key: string;
    session_title: string;
    session_status: string;
    agent_ref: string;
    started_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCsdKnowledgeBaseArticle {
    id: string;
    organization_id: string;
    hub_id: string;
    article_key: string;
    article_title: string;
    article_category: string;
    article_summary: string;
    published_at?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCsdSlaPolicy {
    id: string;
    organization_id: string;
    hub_id: string;
    policy_key: string;
    policy_name: string;
    response_time_minutes: number;
    resolution_time_hours: number;
    policy_type: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCsdEscalationRule {
    id: string;
    organization_id: string;
    hub_id: string;
    rule_key: string;
    rule_name: string;
    escalation_level: number;
    trigger_condition: string;
    rule_type: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCsdDeploymentAutomation {
    id: string;
    organization_id: string;
    hub_id: string;
    automation_key: string;
    automation_name: string;
    automation_type: string;
    automation_status: string;
    last_run_at?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCsdEnvironmentManagement {
    id: string;
    organization_id: string;
    hub_id: string;
    environment_key: string;
    environment_name: string;
    environment_type: string;
    region: string;
    managed_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCsdDeploymentTracking {
    id: string;
    organization_id: string;
    hub_id: string;
    tracking_key: string;
    deployment_name: string;
    deployment_status: string;
    target_version: string;
    deployed_at?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCsdUpgradeManagement {
    id: string;
    organization_id: string;
    hub_id: string;
    upgrade_key: string;
    upgrade_name: string;
    upgrade_status: string;
    from_version: string;
    to_version: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCsdReleaseTracking {
    id: string;
    organization_id: string;
    hub_id: string;
    release_key: string;
    release_name: string;
    release_version: string;
    release_status: string;
    released_at?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCsdTrainingPortal {
    id: string;
    organization_id: string;
    hub_id: string;
    portal_key: string;
    portal_name: string;
    portal_type: string;
    course_count: number;
    portal_url: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCsdVideoLibrary {
    id: string;
    organization_id: string;
    hub_id: string;
    video_key: string;
    video_title: string;
    video_category: string;
    duration_minutes: number;
    video_url: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCsdProductTour {
    id: string;
    organization_id: string;
    hub_id: string;
    tour_key: string;
    tour_name: string;
    tour_type: string;
    step_count: number;
    tour_summary: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCsdCertification {
    id: string;
    organization_id: string;
    hub_id: string;
    certification_key: string;
    certification_name: string;
    certification_type: string;
    validity_days: number;
    certification_summary: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCsdProgressTracking {
    id: string;
    organization_id: string;
    hub_id: string;
    progress_key: string;
    learner_ref: string;
    progress_percent: number;
    course_ref: string;
    last_activity_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCsdLearningAnalytic {
    id: string;
    organization_id: string;
    hub_id: string;
    analytics_key: string;
    metric_name: string;
    completion_rate: number;
    metric_date: string;
    measured_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCsdDeliveryWorkflow {
    id: string;
    organization_id: string;
    hub_id: string;
    workflow_key: string;
    workflow_name: string;
    workflow_type: string;
    workflow_status: string;
    step_count: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCsdOnboardingAutomation {
    id: string;
    organization_id: string;
    hub_id: string;
    automation_key: string;
    automation_name: string;
    automation_status: string;
    customer_ref: string;
    started_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCsdImplementationTracking {
    id: string;
    organization_id: string;
    hub_id: string;
    tracking_key: string;
    implementation_name: string;
    implementation_status: string;
    completion_percent: number;
    target_date: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCsdResourceAssignment {
    id: string;
    organization_id: string;
    hub_id: string;
    assignment_key: string;
    resource_name: string;
    resource_type: string;
    assigned_to: string;
    assigned_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCsdMilestoneTracking {
    id: string;
    organization_id: string;
    hub_id: string;
    milestone_key: string;
    milestone_name: string;
    milestone_status: string;
    target_date: string;
    completed_at?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCsdOperationsMetric {
    id: string;
    organization_id: string;
    metrics_key: string;
    metric_date: string;
    customer_health_score: number;
    open_ticket_count: number;
    sla_compliance_score: number;
    deployment_status_score: number;
    renewal_forecast_count: number;
    adoption_rate: number;
    overall_delivery_score: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCsdOperationsHealth {
    id: string;
    organization_id: string;
    health_key: string;
    health_date: string;
    overall_score: number;
    disaster_recovery_mode: boolean;
    customer_success_status: string;
    support_status: string;
    deployment_status: string;
    security_status: string;
    summary: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCsdExecutiveKpi {
    id: string;
    organization_id: string;
    hub_id: string;
    kpi_key: string;
    kpi_name: string;
    kpi_score: number;
    kpi_type: string;
    metric_date: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCsdDeliveryFailure {
    id: string;
    organization_id: string;
    hub_id: string;
    failure_key: string;
    failure_type: string;
    error_code: string;
    error_message: string;
    failed_at: string;
    resolved_at?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCsdAuditLog {
    id: string;
    organization_id: string;
    entity_type: string;
    entity_id?: string | null;
    action: string;
    summary: string;
    metadata: Record<string, unknown>;
    performed_by?: string | null;
    security_level: string;
    created_at: string;
}

export interface DbCopOperatedHub {
    id: string;
    organization_id: string;
    hub_key: string;
    hub_name: string;
    environment: string;
    operated_tier: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCopSignupFlow {
    id: string;
    organization_id: string;
    hub_id: string;
    flow_key: string;
    flow_name: string;
    flow_status: string;
    signup_type: string;
    started_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCopOrgProvisioning {
    id: string;
    organization_id: string;
    hub_id: string;
    provision_key: string;
    provision_name: string;
    provision_status: string;
    org_ref: string;
    provisioned_at?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCopDomainOnboarding {
    id: string;
    organization_id: string;
    hub_id: string;
    domain_key: string;
    domain_name: string;
    domain_status: string;
    verification_method: string;
    verified_at?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCopEmailVerification {
    id: string;
    organization_id: string;
    hub_id: string;
    verification_key: string;
    email_address: string;
    verification_status: string;
    sent_at: string;
    verified_at?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCopOnboardingWizard {
    id: string;
    organization_id: string;
    hub_id: string;
    wizard_key: string;
    wizard_name: string;
    wizard_status: string;
    step_count: number;
    completion_percent: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCopProductionProfile {
    id: string;
    organization_id: string;
    hub_id: string;
    profile_key: string;
    profile_name: string;
    profile_status: string;
    environment: string;
    region: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCopDeploymentJob {
    id: string;
    organization_id: string;
    hub_id: string;
    job_key: string;
    job_name: string;
    job_status: string;
    target_version: string;
    started_at?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCopHealthValidation {
    id: string;
    organization_id: string;
    hub_id: string;
    validation_key: string;
    validation_name: string;
    validation_status: string;
    health_score: number;
    validated_at?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCopRollbackAutomation {
    id: string;
    organization_id: string;
    hub_id: string;
    rollback_key: string;
    rollback_name: string;
    rollback_status: string;
    from_version: string;
    to_version: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCopDeploymentAudit {
    id: string;
    organization_id: string;
    hub_id: string;
    audit_key: string;
    audit_name: string;
    audit_status: string;
    deployment_ref: string;
    audited_at?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCopCentralLog {
    id: string;
    organization_id: string;
    hub_id: string;
    log_key: string;
    log_source: string;
    log_level: string;
    log_message: string;
    logged_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCopMetricsCollector {
    id: string;
    organization_id: string;
    hub_id: string;
    collector_key: string;
    collector_name: string;
    collector_status: string;
    metric_type: string;
    last_scraped_at?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCopDistributedTrace {
    id: string;
    organization_id: string;
    hub_id: string;
    trace_key: string;
    trace_name: string;
    trace_status: string;
    span_count: number;
    duration_ms: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCopAlertRule {
    id: string;
    organization_id: string;
    hub_id: string;
    rule_key: string;
    rule_name: string;
    severity: string;
    threshold_value: number;
    rule_type: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCopIncidentTimeline {
    id: string;
    organization_id: string;
    hub_id: string;
    incident_key: string;
    incident_title: string;
    incident_status: string;
    severity: string;
    opened_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCopBackupScheduler {
    id: string;
    organization_id: string;
    hub_id: string;
    schedule_key: string;
    schedule_name: string;
    schedule_status: string;
    cron_expression: string;
    retention_days: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCopRestoreValidation {
    id: string;
    organization_id: string;
    hub_id: string;
    restore_key: string;
    restore_name: string;
    restore_status: string;
    backup_ref: string;
    validated_at?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCopMaintenanceMode {
    id: string;
    organization_id: string;
    hub_id: string;
    maintenance_key: string;
    maintenance_name: string;
    maintenance_status: string;
    starts_at?: string;
    ends_at?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCopFeatureFlagOp {
    id: string;
    organization_id: string;
    hub_id: string;
    flag_key: string;
    flag_name: string;
    flag_status: string;
    rollout_percent: number;
    flag_type: boolean;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCopPlatformDiagnostic {
    id: string;
    organization_id: string;
    hub_id: string;
    diagnostic_key: string;
    diagnostic_name: string;
    diagnostic_status: string;
    diagnostic_type: string;
    ran_at?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCopBetaOrganization {
    id: string;
    organization_id: string;
    hub_id: string;
    org_key: string;
    org_name: string;
    beta_status: string;
    cohort_ref: string;
    enrolled_at?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCopBetaInvitation {
    id: string;
    organization_id: string;
    hub_id: string;
    invitation_key: string;
    invitee_email: string;
    invitation_status: string;
    cohort_ref: string;
    sent_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCopFeedbackCollection {
    id: string;
    organization_id: string;
    hub_id: string;
    feedback_key: string;
    feedback_title: string;
    feedback_type: string;
    rating: number;
    collected_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCopFeatureRequest {
    id: string;
    organization_id: string;
    hub_id: string;
    request_key: string;
    request_title: string;
    request_status: string;
    priority: string;
    submitted_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCopBugReport {
    id: string;
    organization_id: string;
    hub_id: string;
    bug_key: string;
    bug_title: string;
    bug_status: string;
    severity: string;
    reported_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCopReleaseChannel {
    id: string;
    organization_id: string;
    hub_id: string;
    channel_key: string;
    channel_name: string;
    channel_status: string;
    release_version: string;
    published_at?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCopOperatedMetric {
    id: string;
    organization_id: string;
    metrics_key: string;
    metric_date: string;
    production_status_score: number;
    onboarding_completion_rate: number;
    revenue_today: number;
    active_incident_count: number;
    pending_approval_count: number;
    platform_availability_score: number;
    customer_satisfaction_score: number;
    overall_operated_score: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCopOperatedHealth {
    id: string;
    organization_id: string;
    health_key: string;
    health_date: string;
    overall_score: number;
    disaster_recovery_mode: boolean;
    production_status: string;
    onboarding_status: string;
    observability_status: string;
    security_status: string;
    summary: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCopExecutiveBriefing {
    id: string;
    organization_id: string;
    hub_id: string;
    briefing_key: string;
    briefing_title: string;
    briefing_type: string;
    briefing_date: string;
    summary: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCopPlatformFailure {
    id: string;
    organization_id: string;
    hub_id: string;
    failure_key: string;
    failure_type: string;
    error_code: string;
    error_message: string;
    failed_at: string;
    resolved_at?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbCopAuditLog {
    id: string;
    organization_id: string;
    entity_type: string;
    entity_id?: string | null;
    action: string;
    summary: string;
    metadata: Record<string, unknown>;
    performed_by?: string | null;
    security_level: string;
    created_at: string;
}

export interface DbEipIntelligenceHub {
    id: string;
    organization_id: string;
    hub_key: string;
    hub_name: string;
    environment: string;
    intelligence_tier: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbEipKpiRegistry {
    id: string;
    organization_id: string;
    hub_id: string;
    kpi_key: string;
    kpi_name: string;
    kpi_status: string;
    kpi_category: string;
    kpi_type: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbEipKpiAggregation {
    id: string;
    organization_id: string;
    hub_id: string;
    aggregation_key: string;
    aggregation_name: string;
    aggregation_type: string;
    window_size: string;
    computed_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbEipKpiCategory {
    id: string;
    organization_id: string;
    hub_id: string;
    category_key: string;
    category_name: string;
    category_status: string;
    parent_category: string;
    sort_order: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbEipKpiTarget {
    id: string;
    organization_id: string;
    hub_id: string;
    target_key: string;
    target_name: string;
    target_value: number;
    target_period: string;
    kpi_ref: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbEipKpiThreshold {
    id: string;
    organization_id: string;
    hub_id: string;
    threshold_key: string;
    threshold_name: string;
    threshold_value: number;
    threshold_type: string;
    kpi_ref: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbEipKpiSnapshot {
    id: string;
    organization_id: string;
    hub_id: string;
    snapshot_key: string;
    snapshot_name: string;
    snapshot_value: number;
    snapshot_date: string;
    kpi_ref: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbEipExecutiveDashboard {
    id: string;
    organization_id: string;
    hub_id: string;
    dashboard_key: string;
    dashboard_name: string;
    dashboard_status: string;
    widget_count: number;
    refresh_cadence: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbEipCrossModuleInsight {
    id: string;
    organization_id: string;
    hub_id: string;
    insight_key: string;
    insight_title: string;
    insight_type: string;
    source_modules: Record<string, unknown>;
    confidence_score: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbEipBusinessHealthScore {
    id: string;
    organization_id: string;
    hub_id: string;
    score_key: string;
    score_name: string;
    health_score: number;
    score_date: string;
    dimension: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbEipOperationalEfficiencyScore {
    id: string;
    organization_id: string;
    hub_id: string;
    score_key: string;
    score_name: string;
    efficiency_score: number;
    score_date: string;
    process_area: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbEipGrowthScore {
    id: string;
    organization_id: string;
    hub_id: string;
    score_key: string;
    score_name: string;
    growth_score: number;
    score_date: string;
    growth_dimension: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbEipStrategicInsight {
    id: string;
    organization_id: string;
    hub_id: string;
    insight_key: string;
    insight_title: string;
    insight_priority: string;
    insight_type: string;
    summary: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbEipRevenueForecast {
    id: string;
    organization_id: string;
    hub_id: string;
    forecast_key: string;
    forecast_name: string;
    forecast_total: number;
    forecast_horizon: string;
    confidence_level: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbEipCustomerGrowthForecast {
    id: string;
    organization_id: string;
    hub_id: string;
    forecast_key: string;
    forecast_name: string;
    growth_total: number;
    forecast_horizon: string;
    segment: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbEipRenewalForecast {
    id: string;
    organization_id: string;
    hub_id: string;
    forecast_key: string;
    forecast_name: string;
    renewal_rate: number;
    forecast_horizon: string;
    cohort_ref: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbEipCapacityPlanning {
    id: string;
    organization_id: string;
    hub_id: string;
    plan_key: string;
    plan_name: string;
    capacity_units: number;
    plan_horizon: string;
    resource_type: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbEipOperationalTrend {
    id: string;
    organization_id: string;
    hub_id: string;
    trend_key: string;
    trend_name: string;
    trend_direction: string;
    trend_value: number;
    measured_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbEipRiskForecast {
    id: string;
    organization_id: string;
    hub_id: string;
    forecast_key: string;
    forecast_name: string;
    risk_score: number;
    risk_category: string;
    forecast_horizon: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbEipDailyExecutiveBrief {
    id: string;
    organization_id: string;
    hub_id: string;
    brief_key: string;
    brief_title: string;
    brief_date: string;
    summary: string;
    priority_items: Record<string, unknown>;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbEipWeeklyBusinessSummary {
    id: string;
    organization_id: string;
    hub_id: string;
    summary_key: string;
    summary_title: string;
    summary_week: string;
    highlights: string;
    kpi_summary: Record<string, unknown>;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbEipMonthlyPerformanceReport {
    id: string;
    organization_id: string;
    hub_id: string;
    report_key: string;
    report_title: string;
    report_month: string;
    executive_summary: string;
    performance_score: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbEipQuarterlyExecutiveReview {
    id: string;
    organization_id: string;
    hub_id: string;
    review_key: string;
    review_title: string;
    review_quarter: string;
    strategic_summary: string;
    board_ready: boolean;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbEipAnnualBusinessReport {
    id: string;
    organization_id: string;
    hub_id: string;
    report_key: string;
    report_title: string;
    report_year: string;
    annual_summary: string;
    published_at?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbEipKpiServiceConfig {
    id: string;
    organization_id: string;
    hub_id: string;
    config_key: string;
    config_name: string;
    config_status: string;
    service_endpoint: string;
    refresh_interval: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbEipIntelligenceServiceConfig {
    id: string;
    organization_id: string;
    hub_id: string;
    config_key: string;
    config_name: string;
    config_status: string;
    service_endpoint: string;
    insight_types: Record<string, unknown>;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbEipForecastServiceConfig {
    id: string;
    organization_id: string;
    hub_id: string;
    config_key: string;
    config_name: string;
    config_status: string;
    service_endpoint: string;
    forecast_models: Record<string, unknown>;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbEipIntelligenceMetric {
    id: string;
    organization_id: string;
    metrics_key: string;
    metric_date: string;
    unified_kpi_score: number;
    business_health_score: number;
    operational_efficiency_score: number;
    growth_score: number;
    revenue_forecast_total: number;
    customer_forecast_total: number;
    risk_score: number;
    overall_intelligence_score: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbEipIntelligenceHealth {
    id: string;
    organization_id: string;
    health_key: string;
    health_date: string;
    overall_score: number;
    disaster_recovery_mode: boolean;
    kpi_status: string;
    intelligence_status: string;
    forecast_status: string;
    security_status: string;
    summary: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbEipMissionProgress {
    id: string;
    organization_id: string;
    hub_id: string;
    progress_key: string;
    progress_name: string;
    progress_percent: number;
    mission_ref: string;
    target_date?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbEipIntelligenceFailure {
    id: string;
    organization_id: string;
    hub_id: string;
    failure_key: string;
    failure_type: string;
    error_code: string;
    error_message: string;
    failed_at: string;
    resolved_at?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DbEipAuditLog {
    id: string;
    organization_id: string;
    entity_type: string;
    entity_id?: string | null;
    action: string;
    summary: string;
    metadata: Record<string, unknown>;
    performed_by?: string | null;
    security_level: string;
    created_at: string;
}
