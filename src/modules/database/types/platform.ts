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
