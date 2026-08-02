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
    }
}

export const databaseAccess = new DatabaseAccessLayer();
