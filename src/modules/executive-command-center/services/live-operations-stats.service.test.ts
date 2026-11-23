import { describe, expect, it } from "vitest";
import type { OrganizationOperationsData } from "./organization-operations-data.service";
import { buildLiveOperationsStatsFromData } from "./live-operations-stats.service";
import { buildRevenueTrend } from "./executive-charts.service";
import { createEmptyLiveOperationsStats } from "./build-live-operations-kpis";

function sampleData(integrationIssues: string[] = []): OrganizationOperationsData {
    return {
        organizationId: "org-1",
        clients: [{ revenue: "250000", lifecycle_stage: "client", status: "active" }],
        activeClients: [],
        projects: [],
        tasks: [],
        salesLeads: [],
        crmLeads: [],
        invoices: [{ currency: "USD", status: "paid", total: 100, amount_paid: 100 }],
        payments: [{ amount: 100, payment_date: "2026-11-22", created_at: "2026-11-22" }],
        audits: [],
        activities: [],
        fetchedAt: "2026-11-23T00:00:00.000Z",
        integrationIssues,
    } as unknown as OrganizationOperationsData;
}

describe("Executive Command Centre revenue trust", () => {
    it("never treats invoice balances, payment rows or CRM hints as verified collected revenue", () => {
        const stats = buildLiveOperationsStatsFromData(sampleData());
        expect(stats.revenue.collected).toBe(0);
        expect(stats.revenue.verified).toBe(false);
        expect(stats.revenue.label).toBe("Not verified");
        expect(stats.revenue.currency).toBe("INR");
        expect(stats.revenue.invoiceCount).toBe(0); // non-INR invoice is excluded
    });

    it("marks partial database failures as fallback instead of healthy Supabase data", () => {
        const stats = buildLiveOperationsStatsFromData(sampleData(["Payments"]));
        expect(stats.source).toBe("fallback");
        expect(stats.integrationIssues).toContain("Payments");
    });

    it("does not generate a revenue trend from unverified payment or invoice rows", () => {
        expect(buildRevenueTrend(sampleData())).toEqual([]);
    });

    it("does not present a fallback revenue value as zero collected", () => {
        const stats = createEmptyLiveOperationsStats("error");
        expect(stats.revenue.label).toBe("Not verified");
        expect(stats.revenue.verified).toBe(false);
        expect(stats.integrationIssues.length).toBeGreaterThan(0);
    });
});
