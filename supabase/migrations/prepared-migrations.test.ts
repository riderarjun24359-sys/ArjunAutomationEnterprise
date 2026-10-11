// @vitest-environment node
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const dir = join(dirname(fileURLToPath(import.meta.url)));
const read = (name: string): string => readFileSync(join(dir, name), "utf8");
const stripComments = (sql: string): string =>
    sql
        .split("\n")
        .filter((line) => !line.trimStart().startsWith("--"))
        .join("\n");

/**
 * Guards for PREPARED-ONLY migrations (never applied here).
 * These assert the remediation files say what we claim — they do not touch
 * any database. Live RLS/isolation tests remain an owner action on a
 * non-production instance (see docs/LOCAL_FIRST_RUNBOOK.md).
 */
describe("prepared migrations (not applied)", () => {
    it("crm remediation removes open policies and enforces membership", () => {
        const sql = read("202610100001_crm_rls_remediation.sql");
        expect(sql).toMatch(/PREPARED ONLY/);
        const code = stripComments(sql);
        for (const tbl of ["crm_clients", "crm_leads", "crm_deals", "crm_activities", "crm_tasks"]) {
            expect(code).toContain(tbl);
        }
        expect(code).not.toMatch(/using\s*\(\s*true\s*\)/i);
        expect(code).not.toMatch(/with check\s*\(\s*true\s*\)/i);
        expect(code).toMatch(/is_organization_member\(organization_id\)/);
        expect(code).toMatch(/for delete using/);
        expect(code).toMatch(/revoke all on/i);
        expect(code).toMatch(/grant select, insert, update, delete/i);
    });

    it("lead migration adds consent proof and a dedup index", () => {
        const sql = read("202610100002_lead_consent_dedup.sql");
        expect(sql).toMatch(/PREPARED ONLY/);
        expect(sql).toContain("consent_given");
        expect(sql).toContain("consent_notice_version");
        expect(sql).toMatch(/unique index[\s\S]*sales_leads_org_email_uidx/);
        expect(sql).toContain("lower(email)");
    });

    it("finance migration mirrors code-level guards", () => {
        const sql = read("202610100003_finance_invoice_guards.sql");
        expect(sql).toMatch(/PREPARED ONLY/);
        expect(sql).toMatch(/unique index[\s\S]*invoices_org_number_uidx/);
        expect(sql).toContain("invoices_status_check");
        expect(sql).toContain("invoices_amounts_check");
        expect(sql).toContain("payments_amount_check");
        expect(sql).toContain("tax_amount");
        expect(sql).toContain("amount_paid <= total");
    });
});
