import { databaseAccess } from "@/src/modules/database/data-access";

export const databaseService = {
    organizations: databaseAccess.organizations,
    profiles: databaseAccess.profiles,
    memberships: databaseAccess.memberships,
    audits: databaseAccess.audits,
    storage: databaseAccess.storage,
    clients: databaseAccess.clients,
    activityLogs: databaseAccess.activityLogs,
    projects: databaseAccess.projects,
    tasks: databaseAccess.tasks,
    contacts: databaseAccess.contacts,
    taxRates: databaseAccess.taxRates,
    invoices: databaseAccess.invoices,
    estimates: databaseAccess.estimates,
    payments: databaseAccess.payments,
    expenses: databaseAccess.expenses,
    recurringInvoices: databaseAccess.recurringInvoices,
};
