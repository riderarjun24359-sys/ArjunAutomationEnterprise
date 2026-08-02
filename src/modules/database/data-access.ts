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
    }
}

export const databaseAccess = new DatabaseAccessLayer();
