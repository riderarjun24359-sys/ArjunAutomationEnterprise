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
