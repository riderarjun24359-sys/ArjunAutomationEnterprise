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
