import {
    buildEstimatePayload,
    buildExpensePayload,
    buildFinanceActivityPayload,
    buildFinanceDashboardStats,
    buildFinanceReportSummary,
    buildInvoicePayload,
    buildLineItemRecords,
    buildPaymentPayload,
    buildRecurringInvoicePayload,
    buildTaxRatePayload,
    mapEstimate,
    mapEstimateLineItem,
    mapExpense,
    mapInvoice,
    mapInvoiceLineItem,
    mapPayment,
    mapRecurringInvoice,
    mapTaxRate,
} from "@/src/modules/database/lib/finance-mappers";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import type {
    CreateEstimateInput,
    CreateExpenseInput,
    CreateInvoiceInput,
    CreatePaymentInput,
    CreateRecurringInvoiceInput,
    CreateTaxRateInput,
    Estimate,
    Expense,
    FinanceClientOption,
    FinanceDashboardStats,
    FinanceProjectOption,
    FinanceReportSummary,
    Invoice,
    Payment,
    RecurringInvoice,
    TaxRate,
} from "@/src/modules/finance/types";

export class FinanceService {
    private async getContext(authUserId: string, email: string, fullName?: string | null) {
        return resolveOrganizationContext(authUserId, email, fullName);
    }

    private async getClientMap(organizationId: string) {
        const clients = await databaseService.clients.listActiveClients(organizationId);
        return new Map(clients.map((client) => [client.id, client.name]));
    }

    private async getProjectMap(organizationId: string) {
        const projects = await databaseService.projects.listByOrganization(organizationId);
        return new Map(projects.map((project) => [project.id, project.name]));
    }

    async getClientOptions(authUserId: string, email: string, fullName?: string | null): Promise<FinanceClientOption[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];

        const clients = await databaseService.clients.listActiveClients(context.organizationId);
        return clients.map((client) => ({ id: client.id, name: client.name }));
    }

    async getProjectOptions(authUserId: string, email: string, fullName?: string | null): Promise<FinanceProjectOption[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];

        const projects = await databaseService.projects.listByOrganization(context.organizationId);
        return projects.map((project) => ({ id: project.id, name: project.name, clientId: project.client_id ?? null }));
    }

    async getTaxRates(authUserId: string, email: string, fullName?: string | null): Promise<TaxRate[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];

        const records = await databaseService.taxRates.listByOrganization(context.organizationId);
        return records.map(mapTaxRate);
    }

    async createTaxRate(authUserId: string, email: string, input: CreateTaxRateInput, fullName?: string | null): Promise<TaxRate> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");

        const created = await databaseService.taxRates.create(buildTaxRatePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create tax rate");
        return mapTaxRate(created);
    }

    async getInvoices(authUserId: string, email: string, fullName?: string | null): Promise<Invoice[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];

        const [records, clientMap, projectMap] = await Promise.all([
            databaseService.invoices.listByOrganization(context.organizationId),
            this.getClientMap(context.organizationId),
            this.getProjectMap(context.organizationId),
        ]);

        const invoices = await Promise.all(
            records.map(async (record) => {
                const lineItems = (await databaseService.invoices.listLineItems(record.id)).map(mapInvoiceLineItem);
                return mapInvoice(record, lineItems, record.client_id ? clientMap.get(record.client_id) : null, record.project_id ? projectMap.get(record.project_id) : null);
            }),
        );

        return invoices;
    }

    async createInvoice(authUserId: string, email: string, input: CreateInvoiceInput, fullName?: string | null): Promise<Invoice> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");

        const defaultTaxRate = (await databaseService.taxRates.listByOrganization(context.organizationId)).find((rate) => rate.is_default);
        const payload = buildInvoicePayload(context.organizationId, { ...input, defaultTaxRate: defaultTaxRate ? Number(defaultTaxRate.rate_percent) : 0 });
        const created = await databaseService.invoices.create(payload);
        if (!created) throw new Error("Failed to create invoice");

        await databaseService.invoices.replaceLineItems(created.id, buildLineItemRecords(created.id, "invoice_id", input.lineItems));
        await databaseService.activityLogs.create(buildFinanceActivityPayload(context.organizationId, "invoice", created.id, "create", created.number, "Invoice created"));

        const invoices = await this.getInvoices(authUserId, email, fullName);
        const invoice = invoices.find((item) => item.id === created.id);
        if (!invoice) throw new Error("Failed to load created invoice");
        return invoice;
    }

    async getEstimates(authUserId: string, email: string, fullName?: string | null): Promise<Estimate[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];

        const [records, clientMap, projectMap] = await Promise.all([
            databaseService.estimates.listByOrganization(context.organizationId),
            this.getClientMap(context.organizationId),
            this.getProjectMap(context.organizationId),
        ]);

        return Promise.all(
            records.map(async (record) => {
                const lineItems = (await databaseService.estimates.listLineItems(record.id)).map(mapEstimateLineItem);
                return mapEstimate(record, lineItems, record.client_id ? clientMap.get(record.client_id) : null, record.project_id ? projectMap.get(record.project_id) : null);
            }),
        );
    }

    async createEstimate(authUserId: string, email: string, input: CreateEstimateInput, fullName?: string | null): Promise<Estimate> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");

        const defaultTaxRate = (await databaseService.taxRates.listByOrganization(context.organizationId)).find((rate) => rate.is_default);
        const payload = buildEstimatePayload(context.organizationId, { ...input, defaultTaxRate: defaultTaxRate ? Number(defaultTaxRate.rate_percent) : 0 });
        const created = await databaseService.estimates.create(payload);
        if (!created) throw new Error("Failed to create estimate");

        await databaseService.estimates.replaceLineItems(created.id, buildLineItemRecords(created.id, "estimate_id", input.lineItems));
        await databaseService.activityLogs.create(buildFinanceActivityPayload(context.organizationId, "estimate", created.id, "create", created.number, "Estimate created"));

        const estimates = await this.getEstimates(authUserId, email, fullName);
        const estimate = estimates.find((item) => item.id === created.id);
        if (!estimate) throw new Error("Failed to load created estimate");
        return estimate;
    }

    async convertEstimateToInvoice(authUserId: string, email: string, estimateId: string, fullName?: string | null): Promise<Invoice> {
        const estimates = await this.getEstimates(authUserId, email, fullName);
        const estimate = estimates.find((item) => item.id === estimateId);
        if (!estimate) throw new Error("Estimate not found");

        return this.createInvoice(authUserId, email, {
            number: estimate.number.replace("EST", "INV"),
            status: "draft",
            clientId: estimate.clientId,
            projectId: estimate.projectId,
            issueDate: new Date().toISOString().slice(0, 10),
            dueDate: estimate.validUntil || undefined,
            notes: estimate.notes,
            lineItems: estimate.lineItems.map((item) => ({
                description: item.description,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                taxRateId: item.taxRateId,
            })),
        }, fullName);
    }

    async getPayments(authUserId: string, email: string, fullName?: string | null): Promise<Payment[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];

        const [records, invoices, clientMap] = await Promise.all([
            databaseService.payments.listByOrganization(context.organizationId),
            this.getInvoices(authUserId, email, fullName),
            this.getClientMap(context.organizationId),
        ]);

        const invoiceMap = new Map(invoices.map((invoice) => [invoice.id, invoice.number]));

        return records.map((record) =>
            mapPayment(record, invoiceMap.get(record.invoice_id), record.client_id ? clientMap.get(record.client_id) : null),
        );
    }

    async createPayment(authUserId: string, email: string, input: CreatePaymentInput, fullName?: string | null): Promise<Payment> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");

        const invoiceRecord = await databaseService.invoices.getById(input.invoiceId);
        if (!invoiceRecord) throw new Error("Invoice not found");

        const created = await databaseService.payments.create(
            buildPaymentPayload(context.organizationId, {
                ...input,
                clientId: invoiceRecord.client_id,
            }),
        );
        if (!created) throw new Error("Failed to create payment");

        const nextPaid = Number(invoiceRecord.amount_paid) + input.amount;
        const nextStatus = nextPaid >= Number(invoiceRecord.total) ? "paid" : invoiceRecord.status;
        await databaseService.invoices.update(invoiceRecord.id, {
            amount_paid: nextPaid,
            status: nextStatus,
            paid_at: nextPaid >= Number(invoiceRecord.total) ? new Date().toISOString() : null,
        });

        await databaseService.activityLogs.create(buildFinanceActivityPayload(context.organizationId, "payment", created.id, "create", `Payment ${created.reference || created.id}`, "Payment recorded"));

        const payments = await this.getPayments(authUserId, email, fullName);
        const payment = payments.find((item) => item.id === created.id);
        if (!payment) throw new Error("Failed to load created payment");
        return payment;
    }

    async getExpenses(authUserId: string, email: string, fullName?: string | null): Promise<Expense[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];

        const [records, clientMap, projectMap] = await Promise.all([
            databaseService.expenses.listByOrganization(context.organizationId),
            this.getClientMap(context.organizationId),
            this.getProjectMap(context.organizationId),
        ]);

        return records.map((record) =>
            mapExpense(record, record.project_id ? projectMap.get(record.project_id) : null, record.client_id ? clientMap.get(record.client_id) : null),
        );
    }

    async createExpense(authUserId: string, email: string, input: CreateExpenseInput, fullName?: string | null): Promise<Expense> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");

        const created = await databaseService.expenses.create(buildExpensePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create expense");

        await databaseService.activityLogs.create(buildFinanceActivityPayload(context.organizationId, "expense", created.id, "create", created.description, "Expense recorded"));

        const expenses = await this.getExpenses(authUserId, email, fullName);
        const expense = expenses.find((item) => item.id === created.id);
        if (!expense) throw new Error("Failed to load created expense");
        return expense;
    }

    async getRecurringInvoices(authUserId: string, email: string, fullName?: string | null): Promise<RecurringInvoice[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];

        const [records, clientMap, projectMap] = await Promise.all([
            databaseService.recurringInvoices.listByOrganization(context.organizationId),
            this.getClientMap(context.organizationId),
            this.getProjectMap(context.organizationId),
        ]);

        return records.map((record) =>
            mapRecurringInvoice(record, clientMap.get(record.client_id), record.project_id ? projectMap.get(record.project_id) : null),
        );
    }

    async createRecurringInvoice(authUserId: string, email: string, input: CreateRecurringInvoiceInput, fullName?: string | null): Promise<RecurringInvoice> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");

        const created = await databaseService.recurringInvoices.create(buildRecurringInvoicePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create recurring invoice");

        await databaseService.activityLogs.create(buildFinanceActivityPayload(context.organizationId, "recurring_invoice", created.id, "create", created.title, "Recurring invoice schedule created"));

        const recurring = await this.getRecurringInvoices(authUserId, email, fullName);
        const item = recurring.find((entry) => entry.id === created.id);
        if (!item) throw new Error("Failed to load created recurring invoice");
        return item;
    }

    async getDashboardStats(authUserId: string, email: string, fullName?: string | null): Promise<FinanceDashboardStats> {
        const [invoices, payments, expenses, estimates, recurringInvoices] = await Promise.all([
            this.getInvoices(authUserId, email, fullName),
            this.getPayments(authUserId, email, fullName),
            this.getExpenses(authUserId, email, fullName),
            this.getEstimates(authUserId, email, fullName),
            this.getRecurringInvoices(authUserId, email, fullName),
        ]);

        return buildFinanceDashboardStats({ invoices, payments, expenses, estimates, recurringInvoices });
    }

    async getReportSummary(authUserId: string, email: string, fullName?: string | null): Promise<FinanceReportSummary> {
        const [invoices, payments, expenses] = await Promise.all([
            this.getInvoices(authUserId, email, fullName),
            this.getPayments(authUserId, email, fullName),
            this.getExpenses(authUserId, email, fullName),
        ]);

        return buildFinanceReportSummary({ invoices, payments, expenses });
    }
}

export const financeService = new FinanceService();
