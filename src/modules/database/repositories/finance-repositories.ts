import type {
    DbEstimate,
    DbEstimateLineItem,
    DbExpense,
    DbInvoice,
    DbInvoiceLineItem,
    DbPayment,
    DbRecurringInvoice,
    DbTaxRate,
} from "@/src/modules/database/types/platform";
import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";
import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";

abstract class OrgFinanceRepository<T> extends BaseRepository<T> {
    async listByOrganization(organizationId: string, query: RepositoryQuery = {}): Promise<T[]> {
        const client = getRepositoryClient();
        if (!client) return [];

        const normalized = this.buildQuery(query);
        const { data, error } = await client
            .from(this.table)
            .select("*")
            .eq("organization_id", organizationId)
            .order(normalized.orderBy, { ascending: normalized.orderDirection === "asc" })
            .range(normalized.offset, normalized.offset + normalized.limit - 1);

        mapRepositoryError(error, `Failed to list ${this.table}`);
        return (data ?? []) as T[];
    }

    async getById(id: string): Promise<T | null> {
        const client = getRepositoryClient();
        if (!client) return null;

        const { data, error } = await client.from(this.table).select("*").eq("id", id).maybeSingle();
        mapRepositoryError(error, `Failed to get ${this.table}`);
        return (data as T | null) ?? null;
    }

    async create(input: Record<string, unknown>): Promise<T | null> {
        const client = getRepositoryClient();
        if (!client) return null;

        const { data, error } = await client.from(this.table).insert(input).select("*").maybeSingle();
        mapRepositoryError(error, `Failed to create ${this.table}`);
        return (data as T | null) ?? null;
    }

    async update(id: string, input: Record<string, unknown>): Promise<T | null> {
        const client = getRepositoryClient();
        if (!client) return null;

        const { data, error } = await client.from(this.table).update(input).eq("id", id).select("*").maybeSingle();
        mapRepositoryError(error, `Failed to update ${this.table}`);
        return (data as T | null) ?? null;
    }

    async delete(id: string): Promise<boolean> {
        const client = getRepositoryClient();
        if (!client) return false;

        const { error } = await client.from(this.table).delete().eq("id", id);
        mapRepositoryError(error, `Failed to delete ${this.table}`);
        return !error;
    }
}

export class TaxRateRepository extends OrgFinanceRepository<DbTaxRate> {
    protected table = "tax_rates";
}

export class InvoiceRepository extends OrgFinanceRepository<DbInvoice> {
    protected table = "invoices";

    async listLineItems(invoiceId: string): Promise<DbInvoiceLineItem[]> {
        const client = getRepositoryClient();
        if (!client) return [];

        const { data, error } = await client.from("invoice_line_items").select("*").eq("invoice_id", invoiceId).order("sort_order");
        mapRepositoryError(error, "Failed to list invoice line items");
        return (data ?? []) as DbInvoiceLineItem[];
    }

    async replaceLineItems(invoiceId: string, items: Record<string, unknown>[]): Promise<void> {
        const client = getRepositoryClient();
        if (!client) return;

        await client.from("invoice_line_items").delete().eq("invoice_id", invoiceId);
        if (items.length === 0) return;

        const { error } = await client.from("invoice_line_items").insert(items);
        mapRepositoryError(error, "Failed to replace invoice line items");
    }
}

export class EstimateRepository extends OrgFinanceRepository<DbEstimate> {
    protected table = "estimates";

    async listLineItems(estimateId: string): Promise<DbEstimateLineItem[]> {
        const client = getRepositoryClient();
        if (!client) return [];

        const { data, error } = await client.from("estimate_line_items").select("*").eq("estimate_id", estimateId).order("sort_order");
        mapRepositoryError(error, "Failed to list estimate line items");
        return (data ?? []) as DbEstimateLineItem[];
    }

    async replaceLineItems(estimateId: string, items: Record<string, unknown>[]): Promise<void> {
        const client = getRepositoryClient();
        if (!client) return;

        await client.from("estimate_line_items").delete().eq("estimate_id", estimateId);
        if (items.length === 0) return;

        const { error } = await client.from("estimate_line_items").insert(items);
        mapRepositoryError(error, "Failed to replace estimate line items");
    }
}

export class PaymentRepository extends OrgFinanceRepository<DbPayment> {
    protected table = "payments";
}

export class ExpenseRepository extends OrgFinanceRepository<DbExpense> {
    protected table = "expenses";
}

export class RecurringInvoiceRepository extends OrgFinanceRepository<DbRecurringInvoice> {
    protected table = "recurring_invoices";
}
