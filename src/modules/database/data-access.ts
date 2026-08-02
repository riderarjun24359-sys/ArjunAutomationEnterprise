import { OrganizationRepository } from "@/src/modules/database/repositories/organization-repository";
import { ProfileRepository } from "@/src/modules/database/repositories/profile-repository";
import { MembershipRepository } from "@/src/modules/database/repositories/membership-repository";
import { AuditRepository } from "@/src/modules/database/repositories/audit-repository";
import { StorageRepository } from "@/src/modules/database/repositories/storage-repository";
import { ClientRepository } from "@/src/modules/database/repositories/client-repository";
import { ActivityLogRepository } from "@/src/modules/database/repositories/activity-log-repository";
import { ProjectRepository } from "@/src/modules/database/repositories/project-repository";
import { TaskRepository } from "@/src/modules/database/repositories/task-repository";
import { ContactRepository } from "@/src/modules/database/repositories/contact-repository";
import {
    EstimateRepository,
    ExpenseRepository,
    InvoiceRepository,
    PaymentRepository,
    RecurringInvoiceRepository,
    TaxRateRepository,
} from "@/src/modules/database/repositories/finance-repositories";
import {
    AiAgentRepository,
    AutomationLogRepository,
    WorkflowActionRepository,
    WorkflowConditionRepository,
    WorkflowExecutionRepository,
    WorkflowRepository,
    WorkflowScheduleRepository,
    WorkflowTemplateRepository,
    WorkflowTriggerRepository,
} from "@/src/modules/database/repositories/automation-repositories";
import {
    AnalyticsDashboardRepository,
    AnalyticsMetricRepository,
    AnalyticsReportRepository,
    AnalyticsWidgetRepository,
} from "@/src/modules/database/repositories/analytics-repositories";
import {
    ApiKeyRepository,
    AuditConfigRepository,
    BackupConfigRepository,
    BackupRunRepository,
    NotificationPreferenceRepository,
    OrganizationBrandingRepository,
    OrganizationInvitationRepository,
    OrganizationPreferencesRepository,
    OrganizationSecurityPolicyRepository,
    OrganizationSettingsRepository,
    PermissionRepository,
    RolePermissionGrantRepository,
    RoleRepository,
    TeamMemberRepository,
    TeamRepository,
    UserPreferencesRepository,
} from "@/src/modules/database/repositories/settings-repositories";
import {
    AttendanceRecordRepository,
    DepartmentRepository,
    DesignationRepository,
    EmployeeDocumentRepository,
    EmployeeRepository,
    HolidayRepository,
    HrTeamMemberRepository,
    HrTeamRepository,
    JobCandidateRepository,
    JobOpeningRepository,
    LeaveRequestRepository,
    LeaveTypeRepository,
    OffboardingPlanRepository,
    OffboardingTaskRepository,
    OnboardingPlanRepository,
    OnboardingTaskRepository,
    OrgChartNodeRepository,
    PayrollCycleRepository,
    PayrollEntryRepository,
    PerformanceReviewRepository,
} from "@/src/modules/database/repositories/hr-repositories";
import {
    AssetRepository,
    GoodsReceivedNoteRepository,
    GrnItemRepository,
    InventoryAdjustmentRepository,
    InventoryAuditLogRepository,
    InventoryValuationRepository,
    LowStockAlertRepository,
    ProductBarcodeRepository,
    ProductCategoryRepository,
    ProductRepository,
    PurchaseOrderItemRepository,
    PurchaseOrderRepository,
    StockLevelRepository,
    StockMovementRepository,
    StockTransferItemRepository,
    StockTransferRepository,
    SupplierRepository,
    WarehouseRepository,
} from "@/src/modules/database/repositories/inventory-repositories";
import {
    SupportAuditLogRepository,
    SupportCannedResponseRepository,
    SupportCategoryRepository,
    SupportEscalationRuleRepository,
    SupportKnowledgeArticleRepository,
    SupportPortalSettingsRepository,
    SupportPriorityRepository,
    SupportQueueRepository,
    SupportSatisfactionRatingRepository,
    SupportSlaRepository,
    SupportTicketAttachmentRepository,
    SupportTicketNoteRepository,
    SupportTicketRepository,
} from "@/src/modules/database/repositories/support-repositories";

export class DatabaseAccessLayer {
    readonly organizations: OrganizationRepository;
    readonly profiles: ProfileRepository;
    readonly memberships: MembershipRepository;
    readonly audits: AuditRepository;
    readonly storage: StorageRepository;
    readonly clients: ClientRepository;
    readonly activityLogs: ActivityLogRepository;
    readonly projects: ProjectRepository;
    readonly tasks: TaskRepository;
    readonly contacts: ContactRepository;
    readonly taxRates: TaxRateRepository;
    readonly invoices: InvoiceRepository;
    readonly estimates: EstimateRepository;
    readonly payments: PaymentRepository;
    readonly expenses: ExpenseRepository;
    readonly recurringInvoices: RecurringInvoiceRepository;
    readonly aiAgents: AiAgentRepository;
    readonly workflowTemplates: WorkflowTemplateRepository;
    readonly workflows: WorkflowRepository;
    readonly workflowTriggers: WorkflowTriggerRepository;
    readonly workflowActions: WorkflowActionRepository;
    readonly workflowConditions: WorkflowConditionRepository;
    readonly workflowSchedules: WorkflowScheduleRepository;
    readonly workflowExecutions: WorkflowExecutionRepository;
    readonly automationLogs: AutomationLogRepository;
    readonly analyticsDashboards: AnalyticsDashboardRepository;
    readonly analyticsWidgets: AnalyticsWidgetRepository;
    readonly analyticsMetrics: AnalyticsMetricRepository;
    readonly analyticsReports: AnalyticsReportRepository;
    readonly organizationSettings: OrganizationSettingsRepository;
    readonly organizationBranding: OrganizationBrandingRepository;
    readonly organizationPreferences: OrganizationPreferencesRepository;
    readonly organizationSecurityPolicies: OrganizationSecurityPolicyRepository;
    readonly teams: TeamRepository;
    readonly teamMembers: TeamMemberRepository;
    readonly organizationInvitations: OrganizationInvitationRepository;
    readonly userPreferences: UserPreferencesRepository;
    readonly auditConfig: AuditConfigRepository;
    readonly apiKeys: ApiKeyRepository;
    readonly notificationPreferences: NotificationPreferenceRepository;
    readonly backupConfigs: BackupConfigRepository;
    readonly backupRuns: BackupRunRepository;
    readonly roles: RoleRepository;
    readonly permissions: PermissionRepository;
    readonly rolePermissionGrants: RolePermissionGrantRepository;
    readonly departments: DepartmentRepository;
    readonly designations: DesignationRepository;
    readonly employees: EmployeeRepository;
    readonly hrTeams: HrTeamRepository;
    readonly hrTeamMembers: HrTeamMemberRepository;
    readonly attendanceRecords: AttendanceRecordRepository;
    readonly leaveTypes: LeaveTypeRepository;
    readonly leaveRequests: LeaveRequestRepository;
    readonly holidays: HolidayRepository;
    readonly payrollCycles: PayrollCycleRepository;
    readonly payrollEntries: PayrollEntryRepository;
    readonly employeeDocuments: EmployeeDocumentRepository;
    readonly performanceReviews: PerformanceReviewRepository;
    readonly jobOpenings: JobOpeningRepository;
    readonly jobCandidates: JobCandidateRepository;
    readonly onboardingPlans: OnboardingPlanRepository;
    readonly onboardingTasks: OnboardingTaskRepository;
    readonly offboardingPlans: OffboardingPlanRepository;
    readonly offboardingTasks: OffboardingTaskRepository;
    readonly orgChartNodes: OrgChartNodeRepository;
    readonly productCategories: ProductCategoryRepository;
    readonly products: ProductRepository;
    readonly warehouses: WarehouseRepository;
    readonly stockLevels: StockLevelRepository;
    readonly suppliers: SupplierRepository;
    readonly stockMovements: StockMovementRepository;
    readonly inventoryAdjustments: InventoryAdjustmentRepository;
    readonly purchaseOrders: PurchaseOrderRepository;
    readonly purchaseOrderItems: PurchaseOrderItemRepository;
    readonly assets: AssetRepository;
    readonly productBarcodes: ProductBarcodeRepository;
    readonly lowStockAlerts: LowStockAlertRepository;
    readonly stockTransfers: StockTransferRepository;
    readonly stockTransferItems: StockTransferItemRepository;
    readonly goodsReceivedNotes: GoodsReceivedNoteRepository;
    readonly grnItems: GrnItemRepository;
    readonly inventoryValuations: InventoryValuationRepository;
    readonly inventoryAuditLogs: InventoryAuditLogRepository;
    readonly supportCategories: SupportCategoryRepository;
    readonly supportPriorities: SupportPriorityRepository;
    readonly supportSlas: SupportSlaRepository;
    readonly supportQueues: SupportQueueRepository;
    readonly supportTickets: SupportTicketRepository;
    readonly supportTicketNotes: SupportTicketNoteRepository;
    readonly supportTicketAttachments: SupportTicketAttachmentRepository;
    readonly supportKnowledgeArticles: SupportKnowledgeArticleRepository;
    readonly supportCannedResponses: SupportCannedResponseRepository;
    readonly supportEscalationRules: SupportEscalationRuleRepository;
    readonly supportSatisfactionRatings: SupportSatisfactionRatingRepository;
    readonly supportPortalSettings: SupportPortalSettingsRepository;
    readonly supportAuditLogs: SupportAuditLogRepository;

    constructor() {
        this.organizations = new OrganizationRepository();
        this.profiles = new ProfileRepository();
        this.memberships = new MembershipRepository();
        this.audits = new AuditRepository();
        this.storage = new StorageRepository();
        this.clients = new ClientRepository();
        this.activityLogs = new ActivityLogRepository();
        this.projects = new ProjectRepository();
        this.tasks = new TaskRepository();
        this.contacts = new ContactRepository();
        this.taxRates = new TaxRateRepository();
        this.invoices = new InvoiceRepository();
        this.estimates = new EstimateRepository();
        this.payments = new PaymentRepository();
        this.expenses = new ExpenseRepository();
        this.recurringInvoices = new RecurringInvoiceRepository();
        this.aiAgents = new AiAgentRepository();
        this.workflowTemplates = new WorkflowTemplateRepository();
        this.workflows = new WorkflowRepository();
        this.workflowTriggers = new WorkflowTriggerRepository();
        this.workflowActions = new WorkflowActionRepository();
        this.workflowConditions = new WorkflowConditionRepository();
        this.workflowSchedules = new WorkflowScheduleRepository();
        this.workflowExecutions = new WorkflowExecutionRepository();
        this.automationLogs = new AutomationLogRepository();
        this.analyticsDashboards = new AnalyticsDashboardRepository();
        this.analyticsWidgets = new AnalyticsWidgetRepository();
        this.analyticsMetrics = new AnalyticsMetricRepository();
        this.analyticsReports = new AnalyticsReportRepository();
        this.organizationSettings = new OrganizationSettingsRepository();
        this.organizationBranding = new OrganizationBrandingRepository();
        this.organizationPreferences = new OrganizationPreferencesRepository();
        this.organizationSecurityPolicies = new OrganizationSecurityPolicyRepository();
        this.teams = new TeamRepository();
        this.teamMembers = new TeamMemberRepository();
        this.organizationInvitations = new OrganizationInvitationRepository();
        this.userPreferences = new UserPreferencesRepository();
        this.auditConfig = new AuditConfigRepository();
        this.apiKeys = new ApiKeyRepository();
        this.notificationPreferences = new NotificationPreferenceRepository();
        this.backupConfigs = new BackupConfigRepository();
        this.backupRuns = new BackupRunRepository();
        this.roles = new RoleRepository();
        this.permissions = new PermissionRepository();
        this.rolePermissionGrants = new RolePermissionGrantRepository();
        this.departments = new DepartmentRepository();
        this.designations = new DesignationRepository();
        this.employees = new EmployeeRepository();
        this.hrTeams = new HrTeamRepository();
        this.hrTeamMembers = new HrTeamMemberRepository();
        this.attendanceRecords = new AttendanceRecordRepository();
        this.leaveTypes = new LeaveTypeRepository();
        this.leaveRequests = new LeaveRequestRepository();
        this.holidays = new HolidayRepository();
        this.payrollCycles = new PayrollCycleRepository();
        this.payrollEntries = new PayrollEntryRepository();
        this.employeeDocuments = new EmployeeDocumentRepository();
        this.performanceReviews = new PerformanceReviewRepository();
        this.jobOpenings = new JobOpeningRepository();
        this.jobCandidates = new JobCandidateRepository();
        this.onboardingPlans = new OnboardingPlanRepository();
        this.onboardingTasks = new OnboardingTaskRepository();
        this.offboardingPlans = new OffboardingPlanRepository();
        this.offboardingTasks = new OffboardingTaskRepository();
        this.orgChartNodes = new OrgChartNodeRepository();
        this.productCategories = new ProductCategoryRepository();
        this.products = new ProductRepository();
        this.warehouses = new WarehouseRepository();
        this.stockLevels = new StockLevelRepository();
        this.suppliers = new SupplierRepository();
        this.stockMovements = new StockMovementRepository();
        this.inventoryAdjustments = new InventoryAdjustmentRepository();
        this.purchaseOrders = new PurchaseOrderRepository();
        this.purchaseOrderItems = new PurchaseOrderItemRepository();
        this.assets = new AssetRepository();
        this.productBarcodes = new ProductBarcodeRepository();
        this.lowStockAlerts = new LowStockAlertRepository();
        this.stockTransfers = new StockTransferRepository();
        this.stockTransferItems = new StockTransferItemRepository();
        this.goodsReceivedNotes = new GoodsReceivedNoteRepository();
        this.grnItems = new GrnItemRepository();
        this.inventoryValuations = new InventoryValuationRepository();
        this.inventoryAuditLogs = new InventoryAuditLogRepository();
        this.supportCategories = new SupportCategoryRepository();
        this.supportPriorities = new SupportPriorityRepository();
        this.supportSlas = new SupportSlaRepository();
        this.supportQueues = new SupportQueueRepository();
        this.supportTickets = new SupportTicketRepository();
        this.supportTicketNotes = new SupportTicketNoteRepository();
        this.supportTicketAttachments = new SupportTicketAttachmentRepository();
        this.supportKnowledgeArticles = new SupportKnowledgeArticleRepository();
        this.supportCannedResponses = new SupportCannedResponseRepository();
        this.supportEscalationRules = new SupportEscalationRuleRepository();
        this.supportSatisfactionRatings = new SupportSatisfactionRatingRepository();
        this.supportPortalSettings = new SupportPortalSettingsRepository();
        this.supportAuditLogs = new SupportAuditLogRepository();
    }
}

export const databaseAccess = new DatabaseAccessLayer();
